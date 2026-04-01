import Link from 'next/link';
import { PostMeta } from '@/lib/posts';
import { CATEGORY_MAP } from '@/lib/categories';

const CATEGORY_COLOR: Record<string, string> = {
  'ai-ml': '#ff6b35',
  robotics: '#ff2d78',
  future: '#00ff88',
  society: '#ffcc00',
  science: '#00cfff',
  tools: '#bf5fff',
};

interface Props {
  post: PostMeta;
}

export function PostCard({ post }: Props) {
  const color = CATEGORY_COLOR[post.category] ?? '#ff6b35';
  const catName = CATEGORY_MAP[post.category]?.name ?? post.category;

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article style={{ background: '#0a0a0a', padding: '1.5rem', transition: 'background 0.2s' }} className="h-full hover:bg-[#111]">

        {/* 카테고리 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            {catName}
          </span>
          {post.journal && (
            <span style={{ fontSize: '0.65rem', color: '#444', marginLeft: 'auto' }}>
              {post.journal}
            </span>
          )}
        </div>

        {/* 제목 */}
        <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#e0e0e0', lineHeight: 1.4, marginBottom: 10, letterSpacing: '-0.01em' }}
          className="group-hover:text-white transition-colors">
          {post.title}
        </h2>

        {/* 요약 */}
        <p style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.7, marginBottom: 16 }}
          className="line-clamp-2">
          {post.summary}
        </p>

        {/* 하단 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.7rem', color: '#333', fontFamily: 'monospace' }}>
            {post.date}
          </span>
          <span style={{ fontSize: '0.7rem', color, fontWeight: 700, opacity: 0, transition: 'opacity 0.2s' }}
            className="group-hover:opacity-100">
            READ →
          </span>
        </div>
      </article>
    </Link>
  );
}
