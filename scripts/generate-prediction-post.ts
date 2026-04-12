#!/usr/bin/env npx tsx
/**
 * 수집된 예측 마켓 데이터 → Claude API → 한국어 MDX 포스트 생성
 */
import type { PredictionMarket } from './collect-predictions';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildPrompt(markets: PredictionMarket[]): string {
  const marketList = markets
    .map((m, i) =>
      `${i + 1}. [${m.source}] "${m.question}"
   - 현재 확률: ${m.probability}%
   - 거래량/참여자: ${m.volume.toLocaleString()}
   - 마감일: ${m.closeDate ?? '미정'}
   - URL: ${m.url}`
    )
    .join('\n\n');

  return `너는 한국 AI 커뮤니티를 위한 예측시장 분석가다.
아래는 Polymarket, Manifold, Metaculus에서 수집한 AI 관련 예측 마켓 목록이다.

## 예측 마켓 목록
${marketList}

## 요구사항
- 가장 흥미롭고 시사점이 큰 질문 3~5개를 선택해 한국어 MDX 포스트를 작성하라
- frontmatter 필드:
  - title: 클릭을 유도하는 한국어 제목 (예: "AI가 2026년 내 노벨상 수상? 예측시장이 말하는 AI의 미래")
  - slug: ${today()}-ai-prediction-market-briefing
  - date: ${today()}
  - category: "ai-prediction"
  - tags: 배열 (한국어/영어 혼용)
  - summary: 2~3문장 한국어 요약
  - searchKeyword: "AI 예측시장 확률"
  - sourceUrl: "https://polymarket.com"
  - sourceName: "Polymarket / Manifold / Metaculus"
  - coverImage: ""
- 본문 구조:
  1. **리드 문단** — "이번 주 예측시장이 주목하는 AI 질문들" 형태로 시작
  2. 선택한 각 질문에 대해: 질문 번역·설명 → 현재 확률 시각화(예: "■■■■□ 74%") → 분석 (왜 이 수치인가, 주목할 이유)
  3. **총평** — 예측시장이 시사하는 AI 업계 방향성
- 톤: 단정적 분석체, 존댓말 없음, 데이터 기반
- GEO/LLMO 최적화: 첫 문단에 "AI 예측시장은 ~" 형태의 명확한 정의 포함
- 마지막에 출처 명시: Polymarket(polymarket.com), Manifold(manifold.markets), Metaculus(metaculus.com)
- slug는 반드시 ${today()}-ai-prediction-market-briefing 사용

MDX 파일 전체를 출력하라. \`\`\`mdx 블록 없이 raw 텍스트로.`;
}

export async function generatePredictionPost(markets: PredictionMarket[]): Promise<string> {
  console.log(`[generate-prediction] ${markets.length}개 마켓으로 포스트 생성 중...`);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      messages: [{ role: 'user', content: buildPrompt(markets) }],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`[generate-prediction] Anthropic API ${res.status}: ${errBody}`);
  }

  const data = await res.json() as { content: Array<{ type: string; text?: string }> };
  const text = data.content[0]?.type === 'text' ? data.content[0].text ?? '' : '';
  if (!text) throw new Error('[generate-prediction] 빈 응답');

  return text.trim();
}
