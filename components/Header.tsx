'use client';
import Link from 'next/link';
import { useState } from 'react';
import { CATEGORY_MAP } from '@/lib/categories';
import { SearchBar } from './SearchBar';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{
      background: 'rgba(7,13,31,0.92)',
      borderBottom: '1px solid rgba(139,92,246,0.2)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">

        {/* 로고 */}
        <Link href="/" className="shrink-0 flex items-center gap-2">
          {/* AI 아이콘 */}
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 900, color: '#fff',
          }}>AI</div>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#f0f4ff', letterSpacing: '-0.01em' }}>
            <span style={{ color: '#f0f4ff' }}>AI </span>
            <span style={{ color: '#a78bfa' }}>News</span>
            <span style={{ color: '#f0f4ff' }}> KR</span>
          </span>
        </Link>

        {/* 검색바 (데스크탑) */}
        <div className="hidden md:flex flex-1 max-w-xs">
          <SearchBar />
        </div>

        {/* 데스크탑 네비 */}
        <nav className="hidden md:flex items-center gap-6 ml-auto shrink-0">
          <Link href="/blog" style={{ color: '#8b9cc8', fontSize: '0.88rem', fontWeight: 600 }} className="hover:text-white transition-colors">
            최신 뉴스
          </Link>
          <Link href="/category/news" style={{ color: '#8b9cc8', fontSize: '0.88rem', fontWeight: 600 }} className="hover:text-white transition-colors">
            AI 뉴스
          </Link>
          <Link href="/category/review" style={{ color: '#8b9cc8', fontSize: '0.88rem', fontWeight: 600 }} className="hover:text-white transition-colors">
            도구 리뷰
          </Link>
          <Link href="/category/guide" style={{ color: '#8b9cc8', fontSize: '0.88rem', fontWeight: 600 }} className="hover:text-white transition-colors">
            사용법·팁
          </Link>
          <Link href="/category/roundup" style={{ color: '#8b9cc8', fontSize: '0.88rem', fontWeight: 600 }} className="hover:text-white transition-colors">
            도구 모음
          </Link>
        </nav>

        {/* 모바일 햄버거 */}
        <button
          className="md:hidden p-2 ml-auto"
          style={{ color: '#8b9cc8' }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div style={{ background: '#0d1535', borderTop: '1px solid rgba(139,92,246,0.15)' }} className="md:hidden px-4 py-4 flex flex-col gap-4">
          <SearchBar />
          {Object.entries(CATEGORY_MAP).map(([slug, { name }]) => (
            <Link
              key={slug}
              href={`/category/${slug}`}
              style={{ color: '#8b9cc8', fontSize: '0.88rem', fontWeight: 600 }}
              className="hover:text-white"
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
