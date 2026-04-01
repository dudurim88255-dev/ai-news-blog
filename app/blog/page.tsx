import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import { CATEGORY_MAP } from '@/lib/categories';
import { PostCard } from '@/components/PostCard';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '전체 뉴스',
  description: 'AI·테크 최신 뉴스 전체 보기',
  openGraph: {
    title: `전체 뉴스 | ${SITE_NAME}`,
    url: `${SITE_URL}/blog`,
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* 헤더 */}
      <div className="mb-10" style={{ borderBottom: '1px solid #1a1a1a', paddingBottom: '2rem' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#444', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
          // ALL ARTICLES
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f0f0f0', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
          전체 뉴스
        </h1>
        <p style={{ color: '#444', fontSize: '0.85rem', fontFamily: 'monospace' }}>
          {posts.length} ARTICLES INDEXED
        </p>
      </div>

      {/* 카테고리 필터 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '2.5rem' }}>
        <Link
          href="/blog"
          style={{ border: '1px solid #ff6b35', color: '#ff6b35', padding: '5px 14px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}
        >
          ALL ({posts.length})
        </Link>
        {Object.entries(CATEGORY_MAP).map(([slug, { name }]) => {
          const count = posts.filter((p) => p.category === slug).length;
          if (count === 0) return null;
          return (
            <Link
              key={slug}
              href={`/category/${slug}`}
              style={{ border: '1px solid #222', color: '#555', padding: '5px 14px', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', transition: 'all 0.2s' }}
              className="hover:border-[#ff6b35] hover:text-[#ff6b35]"
            >
              {name} ({count})
            </Link>
          );
        })}
      </div>

      {/* 포스트 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: '#1a1a1a' }}>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
