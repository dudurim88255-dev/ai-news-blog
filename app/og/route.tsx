import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? 'AI News KR';
  const category = searchParams.get('category') ?? '';

  const CATEGORY_COLORS: Record<string, string> = {
    review:     '#a78bfa',
    comparison: '#f472b6',
    guide:      '#34d399',
    pricing:    '#fbbf24',
    news:       '#38bdf8',
    roundup:    '#c084fc',
  };
  const accentColor = CATEGORY_COLORS[category] ?? '#38bdf8';

  const CATEGORY_LABELS: Record<string, string> = {
    review:     '도구 리뷰',
    comparison: 'VS 비교',
    guide:      '사용법·팁',
    pricing:    '가격 분석',
    news:       'AI 뉴스',
    roundup:    '도구 모음',
  };
  const categoryLabel = CATEGORY_LABELS[category] ?? 'AI 뉴스';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #0a0f1a 0%, #0d1424 60%, #131a2e 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 상단: 사이트명 + 카테고리 뱃지 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '4px', height: '28px', background: accentColor, borderRadius: '2px' }} />
            <span style={{ color: '#e8edf5', fontSize: '22px', fontWeight: 700, letterSpacing: '0.02em' }}>
              AI News KR
            </span>
          </div>
          <span style={{ background: `${accentColor}25`, border: `1px solid ${accentColor}60`, color: accentColor, borderRadius: '20px', padding: '6px 18px', fontSize: '16px', fontWeight: 600 }}>
            {categoryLabel}
          </span>
        </div>

        {/* 제목 */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '32px 0' }}>
          <h1
            style={{
              color: '#e8edf5',
              fontSize: title.length > 35 ? '44px' : '56px',
              fontWeight: 800,
              lineHeight: 1.35,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h1>
        </div>

        {/* 하단: 태그라인 + 강조점 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#8b96b0', fontSize: '16px' }}>대한민국 AI의 미래를 잇다</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: accentColor }} />
            <span style={{ color: '#8b96b0', fontSize: '16px' }}>ainews-kr.vercel.app</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
