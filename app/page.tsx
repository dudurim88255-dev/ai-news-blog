import Link from 'next/link';
import { getAllPosts, CATEGORY_MAP } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import { AdBanner } from '@/components/AdBanner';
import { SITE_TAGLINE } from '@/lib/seo';

const CATEGORY_ICON: Record<string, string> = {
  'ai-ml': '◈',
  robotics: '◎',
  future: '◉',
  society: '◆',
  science: '◇',
  tools: '◐',
};

const CATEGORY_COLOR: Record<string, string> = {
  'ai-ml': '#ff6b35',
  robotics: '#ff2d78',
  future: '#00ff88',
  society: '#ffcc00',
  science: '#00cfff',
  tools: '#bf5fff',
};

export default function HomePage() {
  const posts = getAllPosts();
  const recent = posts.slice(0, 6);
  const featured = posts[0];

  const tagCounts: Record<string, number> = {};
  posts.forEach((p) => p.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 16);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* ── 히어로 ── */}
      <section className="mb-12 py-16 border-b" style={{ borderColor: '#1a1a1a' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#444', letterSpacing: '0.15em', marginBottom: '1rem' }}>
          SIGNAL // AI NEWS &amp; FUTURE FORECAST
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
          <span style={{ color: '#f0f0f0' }}>AI가 바꾸는</span>
          <br />
          <span style={{ color: '#ff6b35' }}>내일의 세상</span>
        </h1>
        <p style={{ color: '#666', maxWidth: 480, lineHeight: 1.8, marginBottom: '2rem', fontSize: '0.95rem' }}>
          {SITE_TAGLINE}
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/blog"
            style={{ background: '#ff6b35', color: '#000', padding: '10px 24px', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'inline-block' }}
            className="hover:opacity-80 transition-opacity">
            전체 뉴스 →
          </Link>
          <Link href="/category/future"
            style={{ border: '1px solid #333', color: '#888', padding: '10px 24px', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'inline-block' }}
            className="hover:border-[#ff6b35] hover:text-[#ff6b35] transition-all">
            미래예측
          </Link>
        </div>

        {/* 실시간 카운터 */}
        <div style={{ display: 'flex', gap: 32, marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid #1a1a1a' }}>
          {[
            { n: posts.length, label: 'ARTICLES' },
            { n: Object.keys(CATEGORY_MAP).length, label: 'TOPICS' },
            { n: topTags.length, label: 'TAGS' },
          ].map(({ n, label }) => (
            <div key={label}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.8rem', fontWeight: 700, color: '#ff6b35', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: '0.65rem', color: '#444', letterSpacing: '0.15em', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 카테고리 ── */}
      <section className="mb-12">
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
          {Object.entries(CATEGORY_MAP).map(([slug, { name }]) => {
            const count = posts.filter((p) => p.category === slug).length;
            const color = CATEGORY_COLOR[slug] ?? '#ff6b35';
            const icon = CATEGORY_ICON[slug] ?? '◈';
            return (
              <Link key={slug} href={`/category/${slug}`}
                style={{ flexShrink: 0, border: '1px solid #222', padding: '14px 20px', minWidth: 120, transition: 'all 0.2s', display: 'block' }}
                className="hover:border-[#ff6b35] group">
                <div style={{ color, fontSize: '1.2rem', marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ccc' }} className="group-hover:text-[#ff6b35] transition-colors">{name}</div>
                <div style={{ fontSize: '0.65rem', color: '#444', marginTop: 4, fontFamily: 'monospace' }}>{count} articles</div>
              </Link>
            );
          })}
        </div>
      </section>

      <AdBanner slot="1234567890" format="horizontal" className="mb-12" />

      {/* ── 주요 뉴스 ── */}
      {featured && (
        <section className="mb-12">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#ff6b35', letterSpacing: '0.1em' }}>// TOP STORY</span>
            <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
          </div>
          <Link href={`/blog/${featured.slug}`} className="block group">
            <article style={{ border: '1px solid #222', padding: '2rem', transition: 'border-color 0.2s' }} className="hover:border-[#ff6b35]">
              <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                <span style={{ background: '#ff6b35', color: '#000', fontSize: '0.65rem', fontWeight: 800, padding: '3px 10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {CATEGORY_MAP[featured.category as keyof typeof CATEGORY_MAP]?.name ?? featured.category}
                </span>
                {featured.journal && (
                  <span style={{ border: '1px solid #333', color: '#666', fontSize: '0.65rem', padding: '3px 10px', letterSpacing: '0.05em' }}>
                    {featured.journal}
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f0f0f0', marginBottom: 12, lineHeight: 1.3, letterSpacing: '-0.02em' }}>
                {featured.title}
              </h2>
              <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 16 }}>{featured.summary}</p>
              <span style={{ color: '#ff6b35', fontSize: '0.8rem', fontWeight: 700 }}>READ MORE →</span>
            </article>
          </Link>
        </section>
      )}

      {/* ── 최신 뉴스 그리드 ── */}
      <section className="mb-12">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#ff6b35', letterSpacing: '0.1em' }}>// LATEST</span>
          <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
          {posts.length > 6 && (
            <Link href="/blog" style={{ fontSize: '0.75rem', color: '#555', fontWeight: 600 }} className="hover:text-[#ff6b35]">
              ALL →
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: '#1a1a1a' }}>
          {recent.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* ── 태그 ── */}
      {topTags.length > 0 && (
        <section className="mb-8">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#444', letterSpacing: '0.1em' }}>// TOPICS</span>
            <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {topTags.map(([tag]) => (
              <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`}
                style={{ border: '1px solid #222', color: '#555', fontSize: '0.75rem', padding: '4px 12px', fontWeight: 600, transition: 'all 0.2s' }}
                className="hover:border-[#ff6b35] hover:text-[#ff6b35]">
                #{tag}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
