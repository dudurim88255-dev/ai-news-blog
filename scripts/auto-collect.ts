#!/usr/bin/env npx tsx
/**
 * AI 뉴스 자동 수집 + 포스트 생성 스크립트
 * GitHub Actions에서 6시간마다 실행됨
 *
 * 소스: arXiv (무료 API) + CrossRef (무료)
 * 환경변수: ANTHROPIC_API_KEY
 */
import fs from 'fs';
import path from 'path';

const MAX_POSTS_PER_RUN = 2;

// AI/테크 분야 arXiv 검색 쿼리 + 카테고리 매핑
const ARXIV_QUERIES = [
  { query: 'large language model reasoning benchmark', category: 'ai-ml' },
  { query: 'robot manipulation autonomous learning', category: 'robotics' },
  { query: 'AI safety alignment interpretability', category: 'ai-ml' },
  { query: 'diffusion model image generation multimodal', category: 'ai-ml' },
  { query: 'autonomous driving perception lidar', category: 'robotics' },
  { query: 'AI social impact economic future work', category: 'society' },
  { query: 'quantum computing error correction', category: 'science' },
  { query: 'neural network efficiency hardware acceleration', category: 'tools' },
  { query: 'AI future prediction AGI superintelligence', category: 'future' },
];

// ── 유틸 ──────────────────────────────────────────────────────────────────────

function getFromDate(daysAgo = 30): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

function getExistingIDs(): Set<string> {
  const postsDir = path.join(process.cwd(), 'content/posts');
  const ids = new Set<string>();
  if (!fs.existsSync(postsDir)) return ids;

  for (const file of fs.readdirSync(postsDir).filter(f => f.endsWith('.mdx'))) {
    const text = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    // paperDOI 또는 arxivId 필드에서 중복 체크
    const doiMatch = text.match(/^paperDOI:\s*"([^"]+)"/m);
    const idMatch = text.match(/^arxivId:\s*"([^"]+)"/m);
    if (doiMatch) ids.add(doiMatch[1].toLowerCase());
    if (idMatch) ids.add(idMatch[1].toLowerCase());
  }
  return ids;
}

// ── arXiv API ─────────────────────────────────────────────────────────────────

interface ArxivPaper {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  published: string;
  link: string;
}

async function searchArxiv(query: string): Promise<ArxivPaper[]> {
  const fromDate = getFromDate(30);
  const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=5&sortBy=submittedDate&sortOrder=descending`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ai-news-blog/1.0 (mailto:dadamboo88255@gmail.com)' },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const papers: ArxivPaper[] = [];
    const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) ?? [];

    for (const entry of entries) {
      const id = (entry.match(/<id>https?:\/\/arxiv\.org\/abs\/([^<]+)<\/id>/) ?? [])[1]?.trim();
      const title = (entry.match(/<title>([\s\S]*?)<\/title>/) ?? [])[1]?.replace(/\s+/g, ' ').trim();
      const summary = (entry.match(/<summary>([\s\S]*?)<\/summary>/) ?? [])[1]?.replace(/\s+/g, ' ').trim();
      const published = (entry.match(/<published>([^<]+)<\/published>/) ?? [])[1]?.slice(0, 10);
      const link = (entry.match(/<link[^>]*href="([^"]*abs[^"]*)"/) ?? [])[1];
      const authors: string[] = [];
      const authorMatches = entry.matchAll(/<name>([^<]+)<\/name>/g);
      for (const m of authorMatches) authors.push(m[1].trim());

      if (id && title && summary && summary.length > 100) {
        papers.push({ id, title, summary, authors, published: published ?? '', link: link ?? `https://arxiv.org/abs/${id}` });
      }
    }
    return papers;
  } catch {
    return [];
  }
}

// ── Claude API ────────────────────────────────────────────────────────────────

async function callClaude(prompt: string, maxTokens = 200): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) { console.warn('ANTHROPIC_API_KEY 없음'); return null; }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) return null;
  const data: any = await res.json();
  return data.content?.[0]?.text?.trim() ?? null;
}

async function generateKoreanTitle(englishTitle: string, abstract: string): Promise<string> {
  const result = await callClaude(
    `AI/테크 논문 제목을 한국어로 번역. 뉴스 헤드라인처럼 흥미롭고 임팩트 있게. 20~35자. 제목만 출력.\n\n영문: ${englishTitle}\n초록: ${abstract.slice(0, 200)}`,
    80,
  );
  return result ?? englishTitle;
}

async function generateKoreanSummary(abstract: string): Promise<string> {
  const result = await callClaude(
    `다음 AI/테크 논문 초록을 한국어로 1~2문장 요약. 독자가 흥미를 느낄 수 있게. 요약문만 출력.\n\n${abstract.slice(0, 600)}`,
    150,
  );
  return result?.replace(/"/g, "'") ?? '';
}

async function generatePostBody(englishTitle: string, abstract: string, authors: string[]): Promise<string> {
  const result = await callClaude(
    `다음 AI/테크 논문을 한국어 뉴스 블로그 포스트로 작성. MDX 본문만 (프론트매터 제외).

논문: ${englishTitle}
저자: ${authors.slice(0, 3).join(', ')}
초록: ${abstract}

형식:
## 핵심 내용

(2~3문단, 일반 독자도 이해 가능하게, 전문용어는 괄호로 설명)

## 왜 주목해야 하나?

(이 연구가 중요한 이유 2~3가지, bullet 또는 문단)

## 앞으로의 전망

(향후 영향과 가능성 2~3문장)`,
    2000,
  );
  return result ?? `## 핵심 내용\n\n${abstract}\n`;
}

// ── 포스트 저장 ───────────────────────────────────────────────────────────────

async function savePost(paper: ArxivPaper, category: string): Promise<string> {
  const today = new Date().toISOString().slice(0, 10);

  const [koreanTitle, koreanSummary, body] = await Promise.all([
    generateKoreanTitle(paper.title, paper.summary),
    generateKoreanSummary(paper.summary),
    generatePostBody(paper.title, paper.summary, paper.authors),
  ]);

  const slug = `${today}-${slugify(paper.title)}`;

  const authorStr = paper.authors.slice(0, 3).join(', ') + (paper.authors.length > 3 ? ' et al.' : '');

  const mdx = `---
title: "${koreanTitle}"
slug: "${slug}"
date: "${today}"
category: "${category}"
tags: []
summary: "${koreanSummary}"
arxivId: "${paper.id}"
paperDOI: ""
journal: "arXiv"
difficulty: "입문"
coverImage: ""
---

${body}

---

> **원문 논문**: [${paper.title}](${paper.link})
> **저자**: ${authorStr}
> **발행**: ${paper.published}
`;

  const postsDir = path.join(process.cwd(), 'content/posts');
  if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });
  fs.writeFileSync(path.join(postsDir, `${slug}.mdx`), mdx, 'utf-8');

  return `${slug} [${category}]`;
}

// ── 메인 ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍 AI 뉴스 자동 수집 시작...\n');

  const existingIDs = getExistingIDs();
  console.log(`📚 기존 포스트 ${existingIDs.size}개 확인\n`);

  const candidates: { paper: ArxivPaper; category: string }[] = [];

  for (const { query, category } of ARXIV_QUERIES) {
    const papers = await searchArxiv(query);
    for (const paper of papers) {
      if (existingIDs.has(paper.id.toLowerCase())) continue;
      existingIDs.add(paper.id.toLowerCase());
      candidates.push({ paper, category });
    }
    if (candidates.length >= MAX_POSTS_PER_RUN * 3) break;
  }

  if (candidates.length === 0) {
    console.log('✅ 새 논문 없음. 종료.');
    return;
  }

  console.log(`📄 후보 ${candidates.length}개 → 상위 ${MAX_POSTS_PER_RUN}개 처리\n`);

  const results: string[] = [];
  for (const { paper, category } of candidates.slice(0, MAX_POSTS_PER_RUN)) {
    try {
      const slug = await savePost(paper, category);
      results.push(slug);
      console.log(`✅ 생성: ${slug}`);
    } catch (e: any) {
      console.warn(`⚠️ 실패 (${paper.id}): ${e.message}`);
    }
  }

  console.log(`\n🎉 완료: ${results.length}개\n${results.join('\n')}`);
}

main().catch((e) => { console.error('오류:', e.message); process.exit(1); });
