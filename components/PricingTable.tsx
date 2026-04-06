'use client';

export interface PricingPlan {
  name: string;
  price: string;          // "무료" | "$20/월" | "₩29,900/월"
  priceKrw?: string;      // 원화 환산 표시용
  features: string[];
  highlighted?: boolean;  // 추천 플랜 강조
  cta?: string;           // "무료로 시작" | "플랜 보기"
  ctaUrl?: string;
  badge?: string;         // "가성비" | "인기" | "추천"
}

interface PricingTableProps {
  toolName: string;
  plans: PricingPlan[];
  note?: string;          // 주의사항 or 면책 문구
}

const BADGE_STYLE: Record<string, { bg: string; color: string }> = {
  '인기':   { bg: 'rgba(139,92,246,0.2)', color: '#a78bfa' },
  '추천':   { bg: 'rgba(52,211,153,0.2)',  color: '#34d399' },
  '가성비': { bg: 'rgba(251,191,36,0.2)',  color: '#fbbf24' },
  '무료':   { bg: 'rgba(6,182,212,0.15)',  color: '#06b6d4' },
};

export function PricingTable({ toolName, plans, note }: PricingTableProps) {
  return (
    <div style={{ margin: '1.5rem 0' }}>
      <div style={{ fontSize: '0.78rem', color: '#4a5880', fontFamily: 'monospace', marginBottom: 12, letterSpacing: '0.08em' }}>
        {toolName} 요금제 비교
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(plans.length, 4)}, 1fr)`,
        gap: 12,
      }}>
        {plans.map((plan) => (
          <div key={plan.name} style={{
            background: plan.highlighted ? 'rgba(139,92,246,0.12)' : '#0d1535',
            border: `1px solid ${plan.highlighted ? 'rgba(139,92,246,0.6)' : 'rgba(139,92,246,0.2)'}`,
            borderRadius: 12,
            padding: '1.25rem 1rem',
            position: 'relative',
            boxShadow: plan.highlighted ? '0 0 24px rgba(139,92,246,0.2)' : undefined,
          }}>
            {plan.badge && (
              <span style={{
                position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                ...( BADGE_STYLE[plan.badge] ?? { bg: 'rgba(139,92,246,0.2)', color: '#a78bfa' }),
                background: (BADGE_STYLE[plan.badge] ?? BADGE_STYLE['인기']).bg,
                color: (BADGE_STYLE[plan.badge] ?? BADGE_STYLE['인기']).color,
                fontSize: '0.65rem', fontWeight: 800, padding: '3px 10px', borderRadius: 999,
                border: `1px solid currentColor`, whiteSpace: 'nowrap',
              }}>
                {plan.badge}
              </span>
            )}

            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8b9cc8', marginBottom: 8 }}>
              {plan.name}
            </div>

            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: plan.highlighted ? '#a78bfa' : '#e8f0ff' }}>
                {plan.price}
              </span>
              {plan.priceKrw && (
                <div style={{ fontSize: '0.7rem', color: '#4a5880', marginTop: 2 }}>
                  ≈ {plan.priceKrw}
                </div>
              )}
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {plan.features.map((feat) => (
                <li key={feat} style={{ fontSize: '0.78rem', color: '#8b9cc8', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  <span style={{ color: '#34d399', flexShrink: 0, marginTop: 1 }}>✓</span>
                  {feat}
                </li>
              ))}
            </ul>

            {plan.cta && (
              <a
                href={plan.ctaUrl ?? '#'}
                target="_blank"
                rel="noopener noreferrer nofollow"
                style={{
                  display: 'block', textAlign: 'center', padding: '8px 0',
                  background: plan.highlighted ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : 'transparent',
                  border: plan.highlighted ? 'none' : '1px solid rgba(139,92,246,0.4)',
                  color: plan.highlighted ? '#fff' : '#a78bfa',
                  borderRadius: 8, fontSize: '0.78rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'opacity 0.2s',
                }}
                className="hover:opacity-80"
              >
                {plan.cta}
              </a>
            )}
          </div>
        ))}
      </div>

      {note && (
        <p style={{ marginTop: 10, fontSize: '0.72rem', color: '#4a5880', fontStyle: 'italic' }}>
          * {note}
        </p>
      )}
    </div>
  );
}
