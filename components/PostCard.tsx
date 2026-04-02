import Link from 'next/link';
import { PostMeta } from '@/lib/posts';
import { CATEGORY_MAP } from '@/lib/categories';
import { CategoryThumbnail } from './CategoryThumbnail';

const CATEGORY_COLOR: Record<string, string> = {
  'ai-ml': '#a78bfa', robotics: '#f472b6', future: '#34d399',
  society: '#fbbf24', science: '#38bdf8', tools: '#c084fc',
};

const CARD_CLASS: Record<string, string> = {
  'ai-ml': 'card-glow',
  robotics: 'card-glow-pink',
  future: 'card-glow',
  society: 'card-glow',
  science: 'card-glow-cyan',
  tools: 'card-glow-pink',
};

interface Props {
  post: PostMeta;
}

export function PostCard({ post }: Props) {
  const color = CATEGORY_COLOR[post.category] ?? '#a78bfa';
  const cardClass = CARD_CLASS[post.category] ?? 'card-glow';
  const catName = CATEGORY_MAP[post.category]?.name ?? post.category;

  return (
    <Link href={`/blog/${post.slug}`} className={`block group ${cardClass}`}>
      {/* 썸네일 영역 */}
      <div style={{ position: 'relative', height: 160, overflow: 'hidden', background: '#0a1128' }}>
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage} alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
            className="group-hover:scale-105"/>
        ) : (
          <div style={{ width: '100%', height: '100%', transition: 'transform 0.4s' }} className="group-hover:scale-105">
            <CategoryThumbnail category={post.category} />
          </div>
        )}
        {/* 카테고리 배지 */}
        <span style={{
          position: 'absolute', top: 10, left: 10,
          background: 'rgba(7,13,31,0.8)',
          border: `1px solid ${color}50`,
          color,
          fontSize: '0.68rem', fontWeight: 700, padding: '3px 10px', borderRadius: 999,
          backdropFilter: 'blur(4px)',
        }}>
          {catName}
        </span>
      </div>

      {/* 텍스트 */}
      <div style={{ padding: '1rem' }}>
        <h2 style={{
          fontSize: '0.9rem', fontWeight: 700, color: '#e8f0ff', lineHeight: 1.5, marginBottom: 8,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }} className="group-hover:text-white transition-colors">
          {post.title}
        </h2>
        <p style={{
          fontSize: '0.78rem', color: '#6b7fa8', lineHeight: 1.6, marginBottom: 12,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {post.summary}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.7rem', color: '#4a5880', fontFamily: 'monospace' }}>
            {post.date}
          </span>
          <span style={{ fontSize: '0.7rem', color, fontWeight: 600, opacity: 0, transition: 'opacity 0.2s' }}
            className="group-hover:opacity-100">
            읽기 →
          </span>
        </div>
      </div>
    </Link>
  );
}
