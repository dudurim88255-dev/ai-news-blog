import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { CATEGORY_MAP } from '@/lib/categories';
import { PostCard } from '@/components/PostCard';
import { CategoryThumbnail } from '@/components/CategoryThumbnail';
import { AdBanner } from '@/components/AdBanner';

const HOT_KEYWORDS = [
  { icon: '🤖', label: 'LLM' },
  { icon: '🦾', label: 'Robotics' },
  { icon: '⚖️', label: 'Ethical AI' },
  { icon: '🌐', label: 'Metaverse' },
  { icon: '⚛️', label: 'Quantum' },
  { icon: '🔮', label: 'AGI' },
];

export default function HomePage() {
  const posts = getAllPosts();
  const featured = posts[0];
  const gridPosts = posts.slice(0, 6);
  const popularPosts = posts.slice(0, 4);

  const tagCounts: Record<string, number> = {};
  posts.forEach((p) => p.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 12);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* ── 히어로 + 사이드바 ── */}
      <section className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

          {/* 히어로 배너 */}
          <div className="card-glow" style={{
            position: 'relative', minHeight: 340, overflow: 'hidden',
            background: 'linear-gradient(135deg, #0d1535 0%, #1a1040 50%, #0d2040 100%)',
          }}>
            {/* 배경 장식 */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.2) 0%, transparent 60%), radial-gradient(ellipse at 30% 20%, rgba(6,182,212,0.15) 0%, transparent 50%)',
            }} />
            {/* 회로 패턴 원 */}
            <div style={{ position: 'absolute', right: -40, top: '50%', transform: 'translateY(-50%)', width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(139,92,246,0.15)' }} />
            <div style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', width: 220, height: 220, borderRadius: '50%', border: '1px solid rgba(6,182,212,0.2)' }} />
            <div style={{ position: 'absolute', right: 30, top: '50%', transform: 'translateY(-50%)', width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)' }} />

            {/* 텍스트 */}
            <div style={{ position: 'relative', zIndex: 2, padding: '3rem 2rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#a78bfa', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                AI NEWS · TECH · FUTURE
              </div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                <span style={{ color: '#f0f4ff' }}>대한민국 AI의</span>
                <br />
                <span style={{ background: 'linear-gradient(90deg, #a78bfa, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  미래를 잇다
                </span>
              </h1>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/blog"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: '#fff', padding: '10px 22px', fontWeight: 700, fontSize: '0.82rem', borderRadius: 8, display: 'inline-block' }}
                  className="hover:opacity-85 transition-opacity">
                  최신 뉴스 →
                </Link>
                <Link href="/category/future"
                  style={{ border: '1px solid rgba(139,92,246,0.4)', color: '#a78bfa', padding: '10px 22px', fontWeight: 600, fontSize: '0.82rem', borderRadius: 8, display: 'inline-block' }}
                  className="hover:bg-[rgba(139,92,246,0.1)] transition-colors">
                  미래 예측
                </Link>
              </div>

              {/* 통계 */}
              <div style={{ display: 'flex', gap: 28, marginTop: '2.5rem' }}>
                {[
                  { n: posts.length, label: '아티클' },
                  { n: Object.keys(CATEGORY_MAP).length, label: '카테고리' },
                  { n: topTags.length, label: '태그' },
                ].map(({ n, label }) => (
                  <div key={label}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a78bfa', lineHeight: 1 }}>{n}</div>
                    <div style={{ fontSize: '0.68rem', color: '#4a5880', marginTop: 3 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 우측 사이드바 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* 금주의 핫 키워드 */}
            <div className="side-box">
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#e8f0ff', marginBottom: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#f59e0b' }}>🔥</span> 금주의 핫 키워드
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {HOT_KEYWORDS.map(({ icon, label }) => (
                  <Link key={label} href={`/tag/${encodeURIComponent(label)}`} className="keyword-pill">
                    <span>{icon}</span> {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* 인기 뉴스 */}
            <div className="side-box" style={{ flex: 1 }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#e8f0ff', marginBottom: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>📈</span> 인기 뉴스
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {popularPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}
                    style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid rgba(139,92,246,0.1)' }}
                    className="group">
                    {/* 썸네일 */}
                    <div style={{ width: 56, height: 48, borderRadius: 8, flexShrink: 0, overflow: 'hidden', background: '#0a1128' }}>
                      <CategoryThumbnail category={post.category} />
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#8b9cc8', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      className="group-hover:text-white transition-colors">
                      {post.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <AdBanner slot="1234567890" format="horizontal" className="mb-8" />

      {/* ── 카테고리 ── */}
      <section className="mb-8">
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {Object.entries(CATEGORY_MAP).map(([slug, { name }]) => {
            const count = posts.filter((p) => p.category === slug).length;
            return (
              <Link key={slug} href={`/category/${slug}`}
                className="card-glow shrink-0 hover:border-[#8b5cf6]"
                style={{ padding: '12px 18px', minWidth: 110, textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c4b5fd', marginBottom: 4 }}>{name}</div>
                <div style={{ fontSize: '0.65rem', color: '#4a5880', fontFamily: 'monospace' }}>{count} articles</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 최신 뉴스 그리드 ── */}
      <section className="mb-8">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#e8f0ff' }}>최신 뉴스</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(139,92,246,0.4), transparent)' }} />
          {posts.length > 6 && (
            <Link href="/blog" style={{ fontSize: '0.78rem', color: '#6b7fa8', fontWeight: 600 }} className="hover:text-[#a78bfa]">
              전체 보기 →
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {gridPosts.map((post, i) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* ── 태그 ── */}
      {topTags.length > 0 && (
        <section className="mb-8">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#e8f0ff' }}>태그</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(139,92,246,0.4), transparent)' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {topTags.map(([tag]) => (
              <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`} className="keyword-pill">
                #{tag}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
