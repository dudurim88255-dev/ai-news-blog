import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPostsByCategory, getAllPosts } from '@/lib/posts';
import { CATEGORY_MAP } from '@/lib/categories';
import { PostCard } from '@/components/PostCard';
import { SITE_NAME } from '@/lib/seo';
import Link from 'next/link';

interface Props {
  params: Promise<{ category: string }>;
}

const CATEGORY_COLOR: Record<string, string> = {
  'ai-ml': '#ff6b35',
  robotics: '#ff2d78',
  future: '#00ff88',
  society: '#ffcc00',
  science: '#00cfff',
  tools: '#bf5fff',
};

export async function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const info = CATEGORY_MAP[category];
  if (!info) return {};
  return {
    title: `${info.name} | ${SITE_NAME}`,
    description: `${info.description} 관련 최신 AI 뉴스`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const info = CATEGORY_MAP[category];
  if (!info) notFound();

  const posts = getPostsByCategory(category);
  const color = CATEGORY_COLOR[category] ?? '#ff6b35';

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-10" style={{ borderBottom: '1px solid #1a1a1a', paddingBottom: '2rem' }}>
        <Link href="/blog" style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          className="hover:text-[#ff6b35]">
          ← ALL ARTICLES
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: '1rem', marginBottom: '0.5rem' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
          <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
            {info.name}
          </span>
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f0f0f0', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
          {info.name}
        </h1>
        <p style={{ color: '#444', fontSize: '0.85rem' }}>{info.description}</p>
        <p style={{ color: '#333', fontSize: '0.75rem', fontFamily: 'monospace', marginTop: 8 }}>
          {posts.length} ARTICLES
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#333', marginBottom: 8 }}>// NO CONTENT</div>
          <p style={{ color: '#444' }}>아직 이 카테고리에 포스트가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: '#1a1a1a' }}>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
