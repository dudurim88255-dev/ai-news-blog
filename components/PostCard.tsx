import Link from 'next/link';
import { PostMeta } from '@/lib/posts';
import { CATEGORY_MAP } from '@/lib/categories';

// 카테고리별 그라디언트 (이미지 없을 때 플레이스홀더)
const CATEGORY_GRADIENT: Record<string, string> = {
  'ai-ml':    'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)',
  robotics:   'linear-gradient(135deg, #0c1a3a 0%, #1e3a5f 40%, #0e4d7a 100%)',
  future:     'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #0d6d5c 100%)',
  society:    'linear-gradient(135deg, #1c1917 0%, #292524 40%, #44403c 100%)',
  science:    'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0c2a4a 100%)',
  tools:      'linear-gradient(135deg, #2d1b69 0%, #3730a3 40%, #4338ca 100%)',
};

const CATEGORY_ICON: Record<string, string> = {
  'ai-ml': '🤖', robotics: '🦾', future: '🔮',
  society: '🌐', science: '⚛️', tools: '🛠️',
};

const CATEGORY_COLOR: Record<string, string> = {
  'ai-ml': '#a78bfa', robotics: '#38bdf8', future: '#34d399',
  society: '#fbbf24', science: '#60a5fa', tools: '#c084fc',
};

// 카드 글로우 클래스
const CARD_CLASS: Record<string, string> = {
  'ai-ml': 'card-glow',
  robotics: 'card-glow-cyan',
  future: 'card-glow',
  society: 'card-glow',
  science: 'card-glow-cyan',
  tools: 'card-glow-pink',
};

interface Props {
  post: PostMeta;
}

export function PostCard({ post }: Props) {
  const gradient = CATEGORY_GRADIENT[post.category] ?? CATEGORY_GRADIENT['ai-ml'];
  const icon = CATEGORY_ICON[post.category] ?? '📰';
  const color = CATEGORY_COLOR[post.category] ?? '#a78bfa';
  const cardClass = CARD_CLASS[post.category] ?? 'card-glow';
  const catName = CATEGORY_MAP[post.category]?.name ?? post.category;

  return (
    <Link href={`/blog/${post.slug}`} className={`block group ${cardClass}`}>
      {/* 이미지 영역 */}
      <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
            className="group-hover:scale-105"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* 장식 원 */}
            <div style={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', border: `1px solid ${color}30`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
            <div style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', border: `1px solid ${color}50`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
            <span style={{ fontSize: '2.5rem', position: 'relative', zIndex: 1 }}>{icon}</span>
          </div>
        )}
        {/* 카테고리 배지 */}
        <span style={{
          position: 'absolute', top: 10, left: 10,
          background: 'rgba(7,13,31,0.75)',
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
        <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e8f0ff', lineHeight: 1.5, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          className="group-hover:text-white transition-colors">
          {post.title}
        </h2>
        <p style={{ fontSize: '0.78rem', color: '#6b7fa8', lineHeight: 1.6, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
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
