'use client';
import Link from 'next/link';
import { useState } from 'react';
import { CATEGORY_MAP } from '@/lib/categories';
import { SearchBar } from './SearchBar';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{ background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid #222', backdropFilter: 'blur(8px)' }} className="sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center gap-6">

        {/* 로고 */}
        <Link href="/" className="shrink-0 flex items-center gap-2">
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '1.1rem', color: '#ff6b35', letterSpacing: '-0.02em' }}>
            SIGNAL<span style={{ color: '#555' }}>//</span><span style={{ color: '#fff' }}>AI</span>
          </span>
        </Link>

        {/* 검색바 (데스크탑) */}
        <div className="hidden md:flex flex-1">
          <SearchBar />
        </div>

        {/* 데스크탑 네비 */}
        <nav className="hidden md:flex items-center gap-6 shrink-0">
          {Object.entries(CATEGORY_MAP).slice(0, 4).map(([slug, { name }]) => (
            <Link
              key={slug}
              href={`/category/${slug}`}
              style={{ color: '#666', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', transition: 'color 0.2s' }}
              className="hover:text-[#ff6b35]"
            >
              {name}
            </Link>
          ))}
        </nav>

        {/* 모바일 햄버거 */}
        <button
          className="md:hidden p-2 ml-auto"
          style={{ color: '#666', fontFamily: 'monospace' }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '[×]' : '[≡]'}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div style={{ background: '#111', borderTop: '1px solid #222' }} className="md:hidden px-4 py-4 flex flex-col gap-4">
          <SearchBar />
          {Object.entries(CATEGORY_MAP).map(([slug, { name }]) => (
            <Link
              key={slug}
              href={`/category/${slug}`}
              style={{ color: '#666', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}
              className="hover:text-[#ff6b35]"
              onClick={() => setMenuOpen(false)}
            >
              {name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
