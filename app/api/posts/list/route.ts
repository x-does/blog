import { NextRequest, NextResponse } from 'next/server';
import { listPosts } from '@/lib/db';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || undefined;
  const posts = listPosts(q);
  return NextResponse.json({ ok: true, posts });
}
