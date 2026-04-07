#!/usr/bin/env npx tsx
/**
 * AI 도구 자동 수집 + 포스트 생성 스크립트
 * GitHub Actions에서 매일 09:00 실행 (KST 기준 UTC+9)
 *
 * 소스: Product Hunt RSS, AI 기업 블로그 RSS, There's An AI For That
 * 환경변수: ANTHROPIC_API_KEY
 */
import fs from 'fs';
import path from 'path';

const MAX_POSTS_PER_RUN = 1; // 1회 실행당 최고 포스트 1개 (하루 2회 실행 = 일 2개)

// ── RSS 소스 설정 ─────────────────────────────────────────────────────────────

const RSS_SOURCES = [
  // ── 1순위: 대형 AI 미디어 (검색량 높은 뉴스 소스) ──────────────────────────
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: 'news', source: 'TechCrunch' },
  { url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', category: 'news', source: 'The Verge' },
  { url: 'https://feeds.feedburner.com/venturebeat/SZYF', category: 'news', source: 'VentureBeat' },
  { url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', category: 'news', source: 'Ars Technica' },
  { url: 'https://www.technologyreview.com/feed/', category: 'news', source: 'MIT Tech Review' },
  { url: 'https://www.artificialintelligence-news.com/feed/', category: 'news', source: 'AI News' },
  // ── 2순위: AI 기업 공식 발표 (신뢰도 높은 1차 소스) ─────────────────────────
  { url: 'https://openai.com/blog/rss.xml',  category: 'news', source: 'OpenAI' },
  { url: 'https://www.anthropic.com/rss.xml', category: 'news', source: 'Anthropic' },
  { url: 'https://blog.google/technology/ai/rss/', category: 'news', source: 'Google AI' },
  { url: 'https://mistral.ai/news/rss.xml',  category: 'news', source: 'Mistral' },
  // ── 3순위: 신제품 출시 (Product Hunt) ────────────────────────────────────────
  { url: 'https://www.producthunt.com/feed?category=artificial-intelligence', category: 'review', source: 'Product Hunt' },
];

// ── 유틸 ──────────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function getExistingTitles(): Set<string> {
  const postsDir = path.join(process.cwd(), 'content/posts');
  const titles = new Set<string>();
  if (!fs.existsSync(postsDir)) return titles;

  for (const file of fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx'))) {
    const text = fs.readFileSync(path.join(postsDir, file), 'utf-8');
    const m = text.match(/^title:\s*"([^"]+)"/m);
    if (m) titles.add(m[1].toLowerCase().slice(0, 40));
  }
  return titles;
}

// ── RSS 파싱 ──────────────────────────────────────────────────────────────────

interface RssItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
}

async function fetchRss(src: { url: string; category: string; source: string }): Promise<RssItem[]> {
  try {
    const res = await fetch(src.url, {
      headers: { 'User-Agent': 'ai-tools-blog/1.0 (mailto:dadamboo88255@gmail.com)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const items: RssItem[] = [];
    const entries = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? xml.match(/<entry>([\s\S]*?)<\/entry>/g) ?? [];

    for (const entry of entries.slice(0, 5)) {
      const title = decodeHtml(
        (entry.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/) ?? [])[1]?.trim() ?? ''
      );
      const desc = decodeHtml(
        (entry.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/) ??
         entry.match(/<summary[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/summary>/) ?? [])[1]
          ?.replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 600) ?? ''
      );
      const link =
        (entry.match(/<link[^>]*href="([^"]+)"/) ?? entry.match(/<link>([^<]+)<\/link>/) ?? [])[1] ?? '';
      const pubDate =
        (entry.match(/<pubDate>([^<]+)<\/pubDate>/) ?? entry.match(/<published>([^<]+)<\/published>/) ?? [])[1]
          ?.slice(0, 10) ?? today();

      if (title && desc.length > 80 && link) {
        items.push({ title, description: desc, link, pubDate, source: src.source, category: src.category });
      }
    }
    return items;
  } catch {
    return [];
  }
}

function decodeHtml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

// Jina Reader로 원문 전체 내용 가져오기 (실패 시 null 반환)
async function fetchJinaContent(url: string): Promise<string | null> {
  try {
    const res = await fetch(`https://r.jina.ai/${url}`, {
      headers: { 'Accept': 'text/plain', 'User-Agent': 'ainews-blog/1.0' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    // 8000자로 제한 (Claude 토큰 절약)
    return text.slice(0, 8000).trim() || null;
  } catch {
    return null;
  }
}

// ── 최고 후보 선택 ────────────────────────────────────────────────────────────

async function pickBestItem(items: RssItem[]): Promise<RssItem> {
  if (items.length === 1) return items[0];

  // 상위 15개 후보로 압축 (더 많은 후보 중에서 선택)
  const list = items.slice(0, 15).map((item, i) =>
    `${i + 1}. [${item.source}] ${item.title}\n   ${item.description.slice(0, 150)}`
  ).join('\n\n');

  const result = await callClaude(
    '숫자만 답하세요. 설명 없이.',
    `지금 이 시점에 한국 사람들이 구글에서 가장 많이 검색할 AI 뉴스 1개를 골라주세요.

선택 기준 (중요도 순):
1. 파급력: ChatGPT·Claude·Gemini 등 수백만 명이 쓰는 서비스의 주요 업데이트/출시/사고
2. 검색 트렌드: "ChatGPT 새기능", "구글 AI 발표", "AI 일자리" 같이 한국인이 실제로 검색하는 주제
3. 뉴스 가치: 단순 마케팅 보도 아닌 실제 변화(기능 출시, 정책 변경, 연구 결과, 논란)
4. 신뢰도: TechCrunch, The Verge, MIT Tech Review 등 검증된 매체 우선

피해야 할 것: 홍보성 보도, 마이너 스타트업, 이미 식은 뉴스

${list}

답: 번호만 (예: 3)`,
    10,
  );

  const idx = parseInt(result?.trim() ?? '1', 10) - 1;
  const selected = items[Math.max(0, Math.min(idx, items.length - 1))];
  console.log(`🏆 선택된 뉴스: [${idx + 1}] ${selected.title} (${selected.source})`);
  return selected;
}

// ── 글 유형 결정 ──────────────────────────────────────────────────────────────

type PostType = 'NEW_TOOL_REVIEW' | 'VS_COMPARISON' | 'HOW_TO_GUIDE' | 'NEWS_SUMMARY' | 'PRICING_GUIDE';

function decidePostType(item: RssItem): PostType {
  const t = item.title.toLowerCase();
  const d = item.description.toLowerCase();

  if (t.includes('vs') || t.includes('versus') || t.includes('compared') || t.includes('alternative')) {
    return 'VS_COMPARISON';
  }
  if (t.includes('price') || t.includes('pricing') || t.includes('plan') || t.includes('free') || t.includes('cost')) {
    return 'PRICING_GUIDE';
  }
  if (t.includes('how to') || t.includes('guide') || t.includes('tutorial') || t.includes('tip')) {
    return 'HOW_TO_GUIDE';
  }
  if (item.source === 'Product Hunt' || t.includes('launch') || t.includes('introduce') || t.includes('new')) {
    return 'NEW_TOOL_REVIEW';
  }
  return 'NEWS_SUMMARY';
}

// ── Claude API ────────────────────────────────────────────────────────────────

async function callClaude(systemPrompt: string, userPrompt: string, maxTokens = 3000): Promise<string | null> {
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
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });
  if (!res.ok) {
    console.warn(`Claude API 오류: ${res.status}`);
    return null;
  }
  const data: any = await res.json();
  return data.content?.[0]?.text?.trim() ?? null;
}

const SYSTEM_PROMPT = `당신은 한국의 AI 전문 블로거입니다.
실제 뉴스·발표 내용을 정확하게 전달하면서 한국 독자의 관점으로 풀어 씁니다.

── 정확도 규칙 (최우선) ──────────────────────────────────────────────────────
1. 원문에 없는 수치·기능·예측은 절대 추가하지 않음
2. 원문의 숫자(성능, 가격, 날짜)는 그대로 인용, 없으면 "공개되지 않음"으로 표시
3. 불확실한 정보에는 "~로 알려졌다", "공식 발표에 따르면" 등 출처 표시
4. 아직 출시 전 기능은 "예정" 또는 "발표만 된 상태"임을 명시
5. 경쟁사 비교 시 검증된 벤치마크 기준, 없으면 비교 금지

── 글쓰기 규칙 ───────────────────────────────────────────────────────────────
6. 반드시 3,000자 이상 작성 (MDX 본문만, frontmatter 제외)
7. 첫 문단: "왜 이 뉴스가 지금 중요한가"로 시작 — 독자의 검색 의도 정조준
8. 한국 사용자 관점 필수: 원화 가격 환산, 한국어 지원 여부, 국내 출시 일정
9. 구체적인 사실 중심, 장단점 균형 있게
10. SEO: 한국인이 실제로 검색할 키워드를 제목·첫 문단·소제목에 배치
11. 자연스러운 구어체, 전문적인 톤, 짧은 문장으로 리듬감
12. MDX 본문만 출력 (frontmatter 없이)

── 절대 금지 ─────────────────────────────────────────────────────────────────
- 원문에 없는 사실 추가 또는 추측성 내용
- "혁신적", "획기적", "필수 도구", "강력한" 등 AI티 나는 표현
- 과도한 이모지·감탄사
- 근거 없는 주관적 평가`;

async function generatePostBody(item: RssItem, postType: PostType, fullContent: string | null): Promise<string> {
  // Jina 원문이 있으면 사용, 없으면 RSS description 폴백
  const articleContent = fullContent
    ? `원문 전체 내용:\n${fullContent}`
    : `원문 요약: ${item.description}`;

  const prompts: Record<PostType, string> = {
    NEW_TOOL_REVIEW: `다음 AI 도구를 리뷰하는 블로그 글을 작성하세요.

도구/서비스: ${item.title}
출처: ${item.source}
${articleContent}
원문 링크: ${item.link}

글 구조:
## 이 도구, 30초 요약
## 핵심 기능 뜯어보기 (기능 3~5가지, 각 구체적 설명)
## 가격은 얼마? 무료로 뭘 할 수 있나?
## 기존 대안 대비 어떤 점이 다른가?
## 아쉬운 점 솔직하게
## 누구에게 추천? 누구에게는 아직 이른가?
## 결론 — 한줄 요약 + 별점(5점 만점)

마지막에 원문 링크 포함: > **출처**: [${item.source}](${item.link})`,

    VS_COMPARISON: `다음 주제로 AI 도구 비교 블로그 글을 작성하세요.

주제: ${item.title}
${articleContent}
출처: ${item.link}

글 구조:
## 한눈에 비교 (핵심 차이 3가지로 요약)
## 비교 항목별 상세 분석 (가격, 기능, 한국어 지원, 속도, 무료 플랜)
## 실사용 시나리오별 추천 (학생/직장인/개발자/크리에이터)
## 각 도구의 결정적 단점
## 최종 결론 — "이런 경우엔 A, 이런 경우엔 B"

마지막에 출처: > **출처**: [${item.source}](${item.link})`,

    PRICING_GUIDE: `다음 AI 도구/서비스의 가격을 분석하는 블로그 글을 작성하세요.

주제: ${item.title}
${articleContent}
출처: ${item.link}

글 구조:
## 요금제 한눈에 보기
## 무료 플랜으로 실제로 뭘 할 수 있나?
## 유료 플랜, 돈 값 하나? (원화 환산 포함)
## 경쟁 서비스와 가격 비교
## 어떤 플랜을 선택해야 할까? (상황별 추천)
## 더 저렴하게 쓰는 꿀팁 (연간 구독, 할인 코드 등)

마지막에 출처: > **출처**: [${item.source}](${item.link})`,

    HOW_TO_GUIDE: `다음 AI 도구 활용법 블로그 글을 작성하세요.

주제: ${item.title}
${articleContent}
출처: ${item.link}

글 구조:
## 이 글에서 배울 수 있는 것
## 시작 전 준비사항 (계정 생성, 플랜, 설치 등)
## 단계별 사용법 (초보 눈높이로, 번호 매기기)
## 더 잘 쓰는 팁 3~5가지
## 자주 막히는 문제 & 해결법
## 실제 활용 예시 (업무/공부/창작 등)

마지막에 출처: > **출처**: [${item.source}](${item.link})`,

    NEWS_SUMMARY: `다음 AI 업계 뉴스를 분석하는 블로그 글을 작성하세요.

뉴스 제목: ${item.title}
출처: ${item.source} (${item.link})
${articleContent}

글 구조:
## 무슨 일이 일어난 건가? (30초 요약)
## 핵심 내용 정리
## 왜 중요한가? (일반인에게 미치는 영향)
## 업계 반응 & 전문가 시각
## 앞으로 어떻게 될까? (단기/장기 전망)
## 한국 사용자에게 미치는 영향

마지막에 출처: > **출처**: [${item.source}](${item.link})`,
  };

  const result = await callClaude(SYSTEM_PROMPT, prompts[postType], 3500);
  return result ?? `## 핵심 내용\n\n${item.description}\n\n> **출처**: [${item.source}](${item.link})`;
}

async function generateMeta(item: RssItem, fullContent: string | null): Promise<{ title: string; summary: string; tags: string[]; searchKeyword: string }> {
  const context = fullContent
    ? fullContent.slice(0, 500)
    : item.description.slice(0, 300);

  const result = await callClaude(
    '한국어로 짧게 답하세요. JSON만 출력하세요.',
    `다음 AI 뉴스를 보고 JSON을 채워주세요.

원문 제목: ${item.title}
내용: ${context}

규칙:
- title: 한국인이 구글에서 검색할 법한 키워드 포함 (예: "ChatGPT 새 기능", "구글 Gemini 업데이트"). 25~40자
- summary: 이 뉴스가 왜 중요한지 1~2문장. 클릭 유도, 과장 금지
- tags: 한국인이 검색할 키워드 3~5개 (예: "ChatGPT", "AI 이미지 생성", "구글 Gemini")
- searchKeyword: 이 글의 핵심 검색어 1개 (가장 검색량 많을 것)

출력 형식 (JSON만):
{
  "title": "제목",
  "summary": "요약",
  "tags": ["태그1", "태그2", "태그3"],
  "searchKeyword": "핵심검색어"
}`,
    250,
  );

  try {
    const json = JSON.parse(result?.match(/\{[\s\S]+\}/)?.[0] ?? '{}');
    return {
      title: json.title ?? item.title,
      summary: (json.summary ?? '').replace(/"/g, "'"),
      tags: Array.isArray(json.tags) ? json.tags.slice(0, 5) : [],
      searchKeyword: json.searchKeyword ?? '',
    };
  } catch {
    return { title: item.title, summary: item.description.slice(0, 100), tags: [], searchKeyword: '' };
  }
}

// ── 제휴 링크 삽입 ─────────────────────────────────────────────────────────────
// 실제 제휴 코드 받으면 URL 교체

const AFFILIATE_MAP: Record<string, string> = {
  'ChatGPT':    'https://chat.openai.com',
  'Claude':     'https://claude.ai',
  'Gemini':     'https://gemini.google.com',
  'Midjourney': 'https://www.midjourney.com',
  'Cursor':     'https://www.cursor.com',
  'Notion':     'https://www.notion.so',
  'Vercel':     'https://vercel.com',
};

function insertAffiliateLinks(content: string): string {
  for (const [tool, link] of Object.entries(AFFILIATE_MAP)) {
    // 이미 링크가 있는 경우 스킵, 첫 번째 언급에만 링크 삽입
    const regex = new RegExp(`(?<!\\[)\\b(${tool})\\b(?![^\\[]*\\])`, '');
    content = content.replace(regex, `[$1](${link})`);
  }
  return content;
}

// ── 포스트 저장 ───────────────────────────────────────────────────────────────

const CATEGORY_EMOJI: Record<string, string> = {
  review: '🔍', comparison: '⚖️', guide: '📖', pricing: '💰', news: '📰', roundup: '🗂️',
};

async function savePost(item: RssItem, postType: PostType): Promise<string> {
  const category = postType === 'VS_COMPARISON' ? 'comparison'
    : postType === 'PRICING_GUIDE' ? 'pricing'
    : postType === 'HOW_TO_GUIDE' ? 'guide'
    : postType === 'NEWS_SUMMARY' ? 'news'
    : 'review';

  // Jina로 원문 전체 내용 가져오기 (실패해도 계속 진행)
  console.log(`  🔍 Jina로 원문 수집 중: ${item.link}`);
  const fullContent = await fetchJinaContent(item.link);
  if (fullContent) {
    console.log(`  ✅ Jina 성공 (${fullContent.length}자)`);
  } else {
    console.log('  ⚠️  Jina 실패 — RSS description으로 폴백');
  }

  const [meta, body] = await Promise.all([
    generateMeta(item, fullContent),
    generatePostBody(item, postType, fullContent),
  ]);

  const bodyWithLinks = insertAffiliateLinks(body);
  const slug = `${today()}-${slugify(item.title)}`;

  // 3000자 미만이면 스킵
  if (bodyWithLinks.length < 800) {
    throw new Error(`본문이 너무 짧음 (${bodyWithLinks.length}자)`);
  }

  const mdx = `---
title: "${meta.title.replace(/"/g, "'")}"
slug: "${slug}"
date: "${today()}"
category: "${category}"
tags: [${meta.tags.map((t) => `"${t}"`).join(', ')}]
summary: "${meta.summary}"
searchKeyword: "${meta.searchKeyword}"
sourceUrl: "${item.link}"
sourceName: "${item.source}"
coverImage: ""
---

${bodyWithLinks}
`;

  const postsDir = path.join(process.cwd(), 'content/posts');
  if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });
  fs.writeFileSync(path.join(postsDir, `${slug}.mdx`), mdx, 'utf-8');

  return `${slug} [${category}]`;
}

// ── 메인 ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🤖 AI 도구 블로그 자동 수집 시작...\n');

  const existingTitles = getExistingTitles();
  console.log(`📚 기존 포스트 ${existingTitles.size}개 확인\n`);

  // RSS 수집
  const allItems: RssItem[] = [];
  for (const src of RSS_SOURCES) {
    const items = await fetchRss(src);
    for (const item of items) {
      const key = item.title.toLowerCase().slice(0, 40);
      if (!existingTitles.has(key)) {
        allItems.push(item);
        existingTitles.add(key);
      }
    }
    if (allItems.length >= 30) break; // 30개 후보에서 가장 핫한 1개 선택
  }

  if (allItems.length === 0) {
    console.log('✅ 새 아이템 없음. 종료.');
    return;
  }

  console.log(`📄 후보 ${allItems.length}개 → Claude가 최고 1개 선택\n`);

  // Claude가 후보 중 가장 좋은 1개를 선택
  const bestItem = await pickBestItem(allItems);
  const postType = decidePostType(bestItem);
  console.log(`⚙️  [${postType}] ${bestItem.title}`);

  const results: string[] = [];
  try {
    const slug = await savePost(bestItem, postType);
    results.push(slug);
    console.log(`✅ 생성: ${slug}`);
  } catch (e: any) {
    console.warn(`⚠️  실패: ${e.message}`);
  }

  console.log(`\n🎉 완료: ${results.length}개\n${results.join('\n')}`);
}

main().catch((e) => { console.error('오류:', e.message); process.exit(1); });
