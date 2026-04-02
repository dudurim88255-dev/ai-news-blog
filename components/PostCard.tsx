'use client';
import Link from 'next/link';
import Image from 'next/image';
import { PostMeta } from '@/lib/posts';
import { CATEGORY_MAP } from '@/lib/categories';

const CATEGORY_COLOR: Record<string, string> = {
  'ai-ml': '#a78bfa', robotics: '#f472b6', future: '#34d399',
  society: '#fbbf24', science: '#38bdf8', tools: '#c084fc',
};

// 글로우 색상 (hover 시 border + box-shadow)
const GLOW_COLOR: Record<string, string> = {
  'ai-ml':   '139,92,246',
  robotics:  '244,114,182',
  future:    '52,211,153',
  society:   '251,191,36',
  science:   '56,189,248',
  tools:     '192,132,252',
};

// 카테고리 이미지 경로
const CATEGORY_IMAGE: Record<string, string> = {
  'ai-ml':   '/images/categories/ai-ml.png',
  robotics:  '/images/categories/robotics.png',
  future:    '/images/categories/future.png',
  society:   '/images/categories/society.png',
  science:   '/images/categories/science.png',
  tools:     '/images/categories/tools.png',
};

interface Props {
  post: PostMeta;
}

export function PostCard({ post }: Props) {
  const color = CATEGORY_COLOR[post.category] ?? '#a78bfa';
  const glow = GLOW_COLOR[post.category] ?? '139,92,246';
  const catName = CATEGORY_MAP[post.category]?.name ?? post.category;
  const thumbSrc = post.coverImage || CATEGORY_IMAGE[post.category] || '/images/categories/ai-ml.png';

  return (
    <Link href={`/blog/${post.slug}`} className="block group" style={{ borderRadius: 12 }}>
      <article style={{
        background: '#0d1535',
        border: `1px solid rgba(${glow},0.25)`,
        borderRadius: 12,
        overflow: 'hidden',
        transition: 'border-color 0.25s, box-shadow 0.25s, transform 0.25s',
      }}
        className="group-hover:scale-[1.03]"
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = `rgba(${glow},0.75)`;
          el.style.boxShadow = `0 0 24px rgba(${glow},0.25), 0 4px 24px rgba(0,0,0,0.5)`;
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = `rgba(${glow},0.25)`;
          el.style.boxShadow = 'none';
        }}
      >
        {/* 이미지 영역 */}
        <div style={{ position: 'relative', height: 168, overflow: 'hidden' }}>
          <Image
            src={thumbSrc}
            alt={catName}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: 'cover', transition: 'transform 0.4s' }}
            className="group-hover:scale-105"
          />

          {/* 상단 그라디언트 (어둡게) */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(7,13,31,0.2) 0%, rgba(7,13,31,0.0) 40%, rgba(7,13,31,0.7) 100%)',
          }} />

          {/* 카테고리 배지 */}
          <span style={{
            position: 'absolute', top: 10, left: 10,
            background: 'rgba(7,13,31,0.75)',
            border: `1px solid rgba(${glow},0.55)`,
            color,
            fontSize: '0.67rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999,
            backdropFilter: 'blur(6px)',
            letterSpacing: '0.05em',
          }}>
            {catName}
          </span>

          {/* 저널 배지 */}
          {post.journal && (
            <span style={{
              position: 'absolute', top: 10, right: 10,
              background: 'rgba(7,13,31,0.7)',
              color: '#4a5880', fontSize: '0.62rem', padding: '3px 8px', borderRadius: 999,
              backdropFilter: 'blur(4px)',
            }}>
              {post.journal}
            </span>
          )}

          {/* 하단 네온 라인 */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(to right, transparent, rgba(${glow},0.7), transparent)`,
            opacity: 0, transition: 'opacity 0.25s',
          }} className="group-hover:opacity-100" />
        </div>

        {/* 텍스트 */}
        <div style={{ padding: '0.9rem 1rem' }}>
          <h2 style={{
            fontSize: '0.88rem', fontWeight: 700, color: '#dde6ff', lineHeight: 1.5, marginBottom: 7,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }} className="group-hover:text-white transition-colors">
            {post.title}
          </h2>
          <p style={{
            fontSize: '0.77rem', color: '#576080', lineHeight: 1.65, marginBottom: 10,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {post.summary}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.68rem', color: '#3a4660', fontFamily: 'monospace' }}>
              {post.date}
            </span>
            <span style={{ fontSize: '0.7rem', color, fontWeight: 700, opacity: 0, transition: 'opacity 0.2s' }}
              className="group-hover:opacity-100">
              읽기 →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
