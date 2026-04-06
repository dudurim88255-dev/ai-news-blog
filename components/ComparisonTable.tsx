'use client';

interface ComparisonTableProps {
  tools: string[];
  criteria: string[];
  data: Record<string, Record<string, string | boolean | number>>;
  recommendation?: string;
  recommendationReason?: string;
}

const CELL_COLORS: Record<string, string> = {
  '✅': '#34d399',
  '❌': '#f87171',
  '⚠️': '#fbbf24',
  '부분': '#fbbf24',
};

function renderCell(value: string | boolean | number) {
  if (typeof value === 'boolean') return value ? '✅' : '❌';
  return String(value);
}

function getCellColor(value: string | boolean | number): string | undefined {
  const str = renderCell(value);
  return CELL_COLORS[str];
}

export function ComparisonTable({
  tools,
  criteria,
  data,
  recommendation,
  recommendationReason,
}: ComparisonTableProps) {
  return (
    <div style={{ margin: '1.5rem 0', overflowX: 'auto' }}>
      <table style={{
        width: '100%', borderCollapse: 'collapse',
        background: '#0d1535', borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(139,92,246,0.2)',
        fontSize: '0.88rem',
      }}>
        <thead>
          <tr style={{ background: 'rgba(139,92,246,0.15)' }}>
            <th style={{ padding: '12px 16px', textAlign: 'left', color: '#8b9cc8', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.05em', borderBottom: '1px solid rgba(139,92,246,0.2)' }}>
              항목
            </th>
            {tools.map((tool) => (
              <th key={tool} style={{
                padding: '12px 16px', textAlign: 'center', color: '#e8f0ff', fontWeight: 800,
                borderBottom: '1px solid rgba(139,92,246,0.2)',
                borderLeft: '1px solid rgba(139,92,246,0.1)',
                background: recommendation === tool ? 'rgba(139,92,246,0.2)' : undefined,
              }}>
                {tool}
                {recommendation === tool && (
                  <span style={{ display: 'block', fontSize: '0.6rem', color: '#a78bfa', fontWeight: 600, marginTop: 2 }}>
                    추천
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {criteria.map((criterion, i) => (
            <tr key={criterion} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(139,92,246,0.04)' }}>
              <td style={{ padding: '11px 16px', color: '#8b9cc8', fontWeight: 600, fontSize: '0.82rem', borderTop: '1px solid rgba(139,92,246,0.08)' }}>
                {criterion}
              </td>
              {tools.map((tool) => {
                const val = data[tool]?.[criterion] ?? '-';
                const color = getCellColor(val);
                return (
                  <td key={tool} style={{
                    padding: '11px 16px', textAlign: 'center',
                    borderTop: '1px solid rgba(139,92,246,0.08)',
                    borderLeft: '1px solid rgba(139,92,246,0.06)',
                    color: color ?? '#c5d8f0',
                    fontWeight: color ? 700 : 400,
                    background: recommendation === tool ? 'rgba(139,92,246,0.06)' : undefined,
                  }}>
                    {renderCell(val)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {recommendation && recommendationReason && (
        <div style={{
          marginTop: 12, padding: '10px 16px',
          background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: 8, fontSize: '0.82rem', color: '#c4b5fd',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontWeight: 800 }}>✦ 추천:</span>
          <span style={{ color: '#e8f0ff', fontWeight: 700 }}>{recommendation}</span>
          <span style={{ color: '#8b9cc8' }}>— {recommendationReason}</span>
        </div>
      )}
    </div>
  );
}
