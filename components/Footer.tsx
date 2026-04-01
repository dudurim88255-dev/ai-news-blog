import Link from 'next/link';
import { SITE_NAME } from '@/lib/seo';

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #1a1a1a', background: '#000', marginTop: '4rem', padding: '2.5rem 0' }}>
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-6" style={{ color: '#444', fontSize: '0.8rem' }}>
        <div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#ff6b35' }}>SIGNAL//AI</span>
          <p style={{ marginTop: 6, color: '#333', fontSize: '0.75rem' }}>오늘의 AI 뉴스, 내일의 미래 예측</p>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ color: '#333', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Topics</span>
            <Link href="/category/ai-ml" style={{ color: '#444' }} className="hover:text-[#ff6b35] transition-colors">AI·머신러닝</Link>
            <Link href="/category/robotics" style={{ color: '#444' }} className="hover:text-[#ff6b35] transition-colors">로보틱스</Link>
            <Link href="/category/future" style={{ color: '#444' }} className="hover:text-[#ff6b35] transition-colors">미래예측</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ color: '#333', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Site</span>
            <Link href="/about" style={{ color: '#444' }} className="hover:text-[#ff6b35] transition-colors">소개</Link>
            <Link href="/privacy" style={{ color: '#444' }} className="hover:text-[#ff6b35] transition-colors">개인정보</Link>
            <Link href="/contact" style={{ color: '#444' }} className="hover:text-[#ff6b35] transition-colors">연락처</Link>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-6" style={{ color: '#2a2a2a', fontSize: '0.7rem', fontFamily: 'monospace' }}>
        © {new Date().getFullYear()} {SITE_NAME}
      </div>
    </footer>
  );
}
