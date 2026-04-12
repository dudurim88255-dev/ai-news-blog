#!/usr/bin/env npx tsx
/**
 * Polymarket / Manifold / Metaculus에서 AI 관련 예측 마켓 수집
 */

export interface PredictionMarket {
  source: 'Polymarket' | 'Manifold' | 'Metaculus';
  question: string;
  probability: number; // 0~100 (%)
  volume: number;      // USD 또는 상대 활동량
  url: string;
  closeDate?: string;
  description?: string;
}

const AI_KEYWORDS = ['ai', 'llm', 'gpt', 'claude', 'gemini', 'openai', 'anthropic', 'deepmind',
  'artificial intelligence', 'machine learning', 'model', 'chatbot', 'robot', 'automation'];

function isAiRelated(text: string): boolean {
  const lower = text.toLowerCase();
  return AI_KEYWORDS.some((kw) => lower.includes(kw));
}

// ── Polymarket ────────────────────────────────────────────────────────────────
async function fetchPolymarket(): Promise<PredictionMarket[]> {
  try {
    const res = await fetch(
      'https://gamma-api.polymarket.com/markets?limit=50&active=true&closed=false&order=volume&ascending=false',
      { headers: { 'User-Agent': 'ainews-kr-bot/1.0' } }
    );
    if (!res.ok) return [];
    const data = await res.json() as Array<{
      question: string;
      outcomePrices?: string;
      volume?: number | string;
      url?: string;
      conditionId?: string;
      endDateIso?: string;
      description?: string;
    }>;

    return data
      .filter((m) => isAiRelated(m.question))
      .slice(0, 10)
      .map((m) => {
        // outcomePrices = "[\"0.72\",\"0.28\"]" 형태
        let prob = 50;
        try {
          const prices = JSON.parse(m.outcomePrices ?? '[]') as string[];
          prob = Math.round(parseFloat(prices[0] ?? '0.5') * 100);
        } catch { /* 파싱 실패 시 50% 기본값 */ }

        return {
          source: 'Polymarket' as const,
          question: m.question,
          probability: prob,
          volume: typeof m.volume === 'string' ? parseFloat(m.volume) : (m.volume ?? 0),
          url: m.url ?? `https://polymarket.com/market/${m.conditionId}`,
          closeDate: m.endDateIso?.slice(0, 10),
          description: m.description?.slice(0, 200),
        };
      });
  } catch (e) {
    console.warn('[Polymarket] 수집 실패:', e instanceof Error ? e.message : e);
    return [];
  }
}

// ── Manifold ──────────────────────────────────────────────────────────────────
async function fetchManifold(): Promise<PredictionMarket[]> {
  try {
    const res = await fetch(
      'https://api.manifold.markets/v0/search-markets?term=AI&sort=liquidity&filter=open&limit=30',
      { headers: { 'User-Agent': 'ainews-kr-bot/1.0' } }
    );
    if (!res.ok) return [];
    const data = await res.json() as Array<{
      question: string;
      probability?: number;
      volume: number;
      url: string;
      closeTime?: number;
      textDescription?: string;
    }>;

    return data
      .filter((m) => isAiRelated(m.question))
      .slice(0, 10)
      .map((m) => ({
        source: 'Manifold' as const,
        question: m.question,
        probability: Math.round((m.probability ?? 0.5) * 100),
        volume: m.volume,
        url: m.url,
        closeDate: m.closeTime ? new Date(m.closeTime).toISOString().slice(0, 10) : undefined,
        description: m.textDescription?.slice(0, 200),
      }));
  } catch (e) {
    console.warn('[Manifold] 수집 실패:', e instanceof Error ? e.message : e);
    return [];
  }
}

// ── Metaculus ─────────────────────────────────────────────────────────────────
async function fetchMetaculus(): Promise<PredictionMarket[]> {
  try {
    const res = await fetch(
      'https://www.metaculus.com/api2/questions/?format=json&order_by=-activity&search=artificial+intelligence&limit=30&status=open&type=forecast',
      { headers: { 'User-Agent': 'ainews-kr-bot/1.0' } }
    );
    if (!res.ok) return [];
    const data = await res.json() as {
      results: Array<{
        title: string;
        community_prediction?: { q2?: number };
        number_of_forecasters?: number;
        page_url?: string;
        id: number;
        close_time?: string;
        description?: string;
      }>;
    };

    return data.results
      .filter((m) => isAiRelated(m.title))
      .slice(0, 10)
      .map((m) => ({
        source: 'Metaculus' as const,
        question: m.title,
        probability: Math.round((m.community_prediction?.q2 ?? 0.5) * 100),
        volume: m.number_of_forecasters ?? 0,
        url: `https://www.metaculus.com${m.page_url ?? `/questions/${m.id}`}`,
        closeDate: m.close_time?.slice(0, 10),
        description: m.description?.replace(/<[^>]+>/g, '').slice(0, 200),
      }));
  } catch (e) {
    console.warn('[Metaculus] 수집 실패:', e instanceof Error ? e.message : e);
    return [];
  }
}

// ── 통합 수집 ─────────────────────────────────────────────────────────────────
export async function collectPredictions(): Promise<PredictionMarket[]> {
  console.log('[predictions] 3개 소스에서 수집 시작...');
  const [poly, manifold, meta] = await Promise.all([
    fetchPolymarket(),
    fetchManifold(),
    fetchMetaculus(),
  ]);

  console.log(`[predictions] Polymarket ${poly.length}개, Manifold ${manifold.length}개, Metaculus ${meta.length}개`);

  // volume 기준 내림차순 정렬 후 상위 15개 반환
  return [...poly, ...manifold, ...meta]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 15);
}
