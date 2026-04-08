import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, PostMeta } from '@/lib/posts';

// 워밍된 서버리스 인스턴스 재사용 시 파일 재읽기 방지
let cachedPosts: PostMeta[] | null = null;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.toLowerCase().trim() ?? '';
  if (!q || q.length < 2) return NextResponse.json([]);

  if (!cachedPosts) cachedPosts = getAllPosts();
  const posts = cachedPosts;
  const results = posts
    .filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    )
    .slice(0, 8)
    .map(({ slug, title, summary, category, date }) => ({
      slug, title, summary, category, date,
    }));

  return NextResponse.json(results);
}
