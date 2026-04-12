#!/usr/bin/env npx tsx
/**
 * 예측시장 포스트 생성 오케스트레이터
 * 실행: npx tsx scripts/run-prediction-post.ts
 */
import fs from 'fs';
import path from 'path';
import { collectPredictions } from './collect-predictions';
import { generatePredictionPost } from './generate-prediction-post';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function alreadyPublishedToday(): boolean {
  const postsDir = path.join(process.cwd(), 'content/posts');
  const slug = `${today()}-ai-prediction-market-briefing.mdx`;
  return fs.existsSync(path.join(postsDir, slug));
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY 환경변수가 없습니다.');
    process.exit(1);
  }

  if (alreadyPublishedToday()) {
    console.log('[run-prediction] 오늘 이미 예측시장 포스트가 있습니다. 스킵.');
    return;
  }

  const markets = await collectPredictions();

  if (markets.length < 3) {
    console.warn(`[run-prediction] AI 관련 마켓이 ${markets.length}개뿐 (최소 3개 필요). 스킵.`);
    return;
  }

  const mdx = await generatePredictionPost(markets);

  const slug = `${today()}-ai-prediction-market-briefing`;
  const filePath = path.join(process.cwd(), 'content/posts', `${slug}.mdx`);
  fs.writeFileSync(filePath, mdx, 'utf-8');
  console.log(`[run-prediction] 저장 완료: ${filePath}`);
}

main().catch((e) => {
  console.error('[run-prediction] 실패:', e instanceof Error ? e.message : e);
  process.exit(1);
});
