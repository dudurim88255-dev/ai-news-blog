import Link from 'next/link';

export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(139,92,246,0.15)',
      background: 'rgba(7,13,31,0.95)',
      marginTop: '4rem',
      padding: '2rem 0',
    }}>
      <div className="max-w-7xl mx-auto px-4">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          {/* 링크 */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { href: '/about', label: '소개' },
              { href: '/contact', label: '제휴 문의' },
              { href: '/privacy', label: '개인정보처리방침' },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                style={{ fontSize: '0.8rem', color: '#4a5880' }}
                className="hover:text-[#a78bfa] transition-colors">
                {label}
              </Link>
            ))}
          </div>

          {/* Powered by */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#2d3a5a' }}>
            Powered by
            <span style={{ color: '#4a5880', fontWeight: 700 }}>▲ Vercel</span>
          </div>
        </div>

        <div style={{ marginTop: '1rem', fontSize: '0.72rem', color: '#2d3a5a' }}>
          © {new Date().getFullYear()} AI News KR. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
