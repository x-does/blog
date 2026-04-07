import { NextRequest, NextResponse } from 'next/server';
import { upsertPost } from '@/lib/db';
import { gitCommitAndPush } from '@/lib/git';
import { toSlug, writePostFile } from '@/lib/posts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const title = String(body.title || '').trim();
    const description = String(body.description || '').trim();
    const markdown = String(body.markdown || '').trim();
    const tags = String(body.tags || '').trim();
    const refs = String(body.refs || '').trim();
    const links = String(body.links || '').trim();

    if (!title || !markdown) {
      return NextResponse.json({ ok: false, error: 'title and markdown are required' }, { status: 400 });
    }

    const slug = toSlug(title);
    const file = writePostFile(slug, markdown);

    upsertPost({
      slug,
      title,
      description,
      tags,
      refs,
      links,
      folder: file.folder,
      filename: file.filename,
    });

    if (body.push === true) {
      gitCommitAndPush(`blog: publish ${slug}`);
    }

    return NextResponse.json({ ok: true, slug, file });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown error' },
      { status: 500 },
    );
  }
}
