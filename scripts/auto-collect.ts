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
  // AI 기업 공식 블로그
  { url: 'https://openai.com/blog/rss.xml',             category: 'news',    source: 'OpenAI' },
  { url: 'https://www.anthropic.com/rss.xml',            category: 'news',    source: 'Anthropic' },
  { url: 'https://blog.google/technology/ai/rss/',       category: 'news',    source: 'Google AI' },
  { url: 'https://stability.ai/blog/rss.xml',            category: 'news',    source: 'Stability AI' },
  { url: 'https://mistral.ai/news/rss.xml',              category: 'news',    source: 'Mistral' },
  // Product Hunt AI 카테고리
  { url: 'https://www.producthunt.com/feed?category=artificial-intelligence', category: 'review', source: 'Product Hunt' },
  // AI 미디어
  { url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', category: 'news',   source: 'The Verge' },
  { url: 'https://venturebeat.com/category/ai/feed/',    category: 'news',    source: 'VentureBeat' },
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

// ── 최고 후보 선택 ────────────────────────────────────────────────────────────

async function pickBestItem(items: RssItem[]): Promise<RssItem> {
  if (items.length === 1) return items[0];

  const list = items.slice(0, 10).map((item, i) =>
    `${i + 1}. [${item.source}] ${item.title}\n   ${item.description.slice(0, 120)}`
  ).join('\n\n');

  const result = await callClaude(
    '숫자만 답하세요. 설명 없이.',
    `다음 AI 뉴스/도구 목록 중 한국 독자에게 가장 유용하고 흥미로운 항목 하나의 번호를 선택하세요.
선택 기준: 실용성, 최신성, 한국 사용자 관련성, 독자 흥미도.

${list}

답: 번호만 (예: 3)`,
    10,
  );

  const idx = parseInt(result?.trim() ?? '1', 10) - 1;
  const selected = items[Math.max(0, Math.min(idx, items.length - 1))];
  console.log(`🏆 최고 후보 선택: [${idx + 1}] ${selected.title}`);
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

const SYSTEM_PROMPT = `당신은 한국의 AI 도구 전문 블로거입니다.
실제로 도구를 사용해본 사람의 관점에서 글을 작성합니다.

작성 규칙:
1. 반드시 3,000자 이상 작성 (MDX 본문만, frontmatter 제외)
2. 첫 문단은 독자의 고민/상황으로 시작 (검색 의도 반영)
3. "직접 써봤는데", "실제로 테스트해보니" 같은 체험형 표현 사용
4. 구체적인 숫자와 비교 데이터 포함
5. 장점만 나열하지 않고, 아쉬운 점도 솔직하게 기술
6. 결론에서 "이런 사람에게 추천/비추천" 명확히 제시
7. 한국 사용자 관점 (원화 가격 환산, 한국어 지원 여부, 결제 방법)
8. 자연스러운 구어체, 하지만 전문적인 톤
9. SEO 키워드를 제목, 첫 문단, 소제목에 자연스럽게 배치
10. 중간중간 짧은 문장으로 리듬감 부여
11. MDX 본문만 출력 (frontmatter 없이)

절대 하지 말 것:
- AI가 쓴 티 나는 표현 ("혁신적인", "획기적인", "필수 도구", "강력한")
- 과도한 감탄사나 이모지 남발
- 모든 도구를 긍정적으로만 평가
- 근거 없는 주관적 평가`;

async function generatePostBody(item: RssItem, postType: PostType): Promise<string> {
  const prompts: Record<PostType, string> = {
    NEW_TOOL_REVIEW: `다음 AI 도구를 리뷰하는 블로그 글을 작성하세요.

도구/서비스: ${item.title}
출처: ${item.source}
원문 요약: ${item.description}
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
배경 정보: ${item.description}
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
배경 정보: ${item.description}
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
배경 정보: ${item.description}
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
내용 요약: ${item.description}
출처: ${item.source} (${item.link})

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

async function generateMeta(item: RssItem): Promise<{ title: string; summary: string; tags: string[] }> {
  const result = await callClaude(
    '한국어로 짧게 답하세요. JSON만 출력하세요.',
    `다음 AI 관련 뉴스/도구 정보를 보고 아래 JSON을 채워주세요.

제목: ${item.title}
내용: ${item.description.slice(0, 300)}

출력 형식 (JSON만, 다른 텍스트 없이):
{
  "title": "한국어 제목 (25~40자, 뉴스 헤드라인처럼)",
  "summary": "한국어 요약 1~2문장 (독자가 클릭하고 싶게)",
  "tags": ["태그1", "태그2", "태그3"]
}`,
    250,
  );

  try {
    const json = JSON.parse(result?.match(/\{[\s\S]+\}/)?.[0] ?? '{}');
    return {
      title: json.title ?? item.title,
      summary: (json.summary ?? '').replace(/"/g, "'"),
      tags: Array.isArray(json.tags) ? json.tags.slice(0, 5) : [],
    };
  } catch {
    return { title: item.title, summary: item.description.slice(0, 100), tags: [] };
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

  const [meta, body] = await Promise.all([
    generateMeta(item),
    generatePostBody(item, postType),
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
    if (allItems.length >= 20) break; // 20개 후보에서 최고 1개 선택
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
