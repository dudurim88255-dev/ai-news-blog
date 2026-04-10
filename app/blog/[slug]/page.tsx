import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import { buildPostMetadata, buildArticleJsonLd, buildBreadcrumbJsonLd, SITE_URL, SITE_NAME } from '@/lib/seo';
import { AdBanner } from '@/components/AdBanner';
import { ShareButtons } from '@/components/ShareButtons';
import { ReadingProgress } from '@/components/ReadingProgress';
import Link from 'next/link';
import { CATEGORY_MAP } from '@/lib/categories';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildPostMetadata(post);
}

const CATEGORY_COLOR: Record<string, string> = {
  review:     '#a78bfa',
  comparison: '#f472b6',
  guide:      '#34d399',
  pricing:    '#fbbf24',
  news:       '#38bdf8',
  roundup:    '#c084fc',
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const color = CATEGORY_COLOR[post.category] ?? '#ff6b35';
  const catName = CATEGORY_MAP[post.category]?.name ?? post.category;
  const relatedPosts = getRelatedPosts(post.slug);
  const articleJsonLd = buildArticleJsonLd(post);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: SITE_NAME, url: SITE_URL },
    { name: catName, url: `${SITE_URL}/category/${post.category}` },
    { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
  ]);

  const postUrl = `${SITE_URL}/blog/${post.slug}`;

  return (
    <>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* 브레드크럼 */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '2rem', fontFamily: 'monospace', fontSize: '0.7rem', color: '#444' }}>
          <Link href="/" className="hover:text-[#ff6b35] transition-colors">HOME</Link>
          <span>/</span>
          <Link href={`/category/${post.category}`} style={{ color }} className="hover:opacity-80 transition-opacity uppercase">
            {catName}
          </Link>
          <span>/</span>
          <span style={{ color: '#555' }} className="truncate max-w-xs">···</span>
        </nav>

        {/* 헤더 */}
        <header style={{ marginBottom: '2.5rem', borderBottom: '1px solid rgba(139,92,246,0.2)', paddingBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              {catName}
            </span>
            {post.journal && (
              <span style={{ border: '1px solid rgba(139,92,246,0.3)', color: '#8b9cc8', fontSize: '0.65rem', padding: '2px 8px', letterSpacing: '0.05em', borderRadius: 4 }}>
                {post.journal}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', fontWeight: 900, color: '#f0f0f0', lineHeight: 1.25, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            {post.title}
          </h1>

          <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            {post.summary}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'monospace', fontSize: '0.7rem', color: '#4a5880' }}>
            <span>{post.date}</span>
            {post.readingTime && <><span>·</span><span>{post.readingTime}</span></>}
          </div>
        </header>

        <AdBanner slot="2345678901" className="mb-8" />

        {/* MDX 본문 */}
        <article className="prose">
          <MDXRemote source={post.content} />
        </article>

        <AdBanner slot="3456789012" className="mt-10" />

        {/* 태그 */}
        {post.tags.length > 0 && (
          <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {post.tags.map((tag) => (
              <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`}
                className="keyword-pill">
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* 공유 버튼 */}
        <ShareButtons title={post.title} url={postUrl} />
      </div>

      {/* 관련 포스트 */}
      {relatedPosts.length > 0 && (
        <div style={{ borderTop: '1px solid #1a1a1a', marginTop: '4rem' }}>
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#ff6b35', letterSpacing: '0.1em' }}>// RELATED</span>
              <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: '#1a1a1a' }}>
              {relatedPosts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
