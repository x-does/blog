import fs from 'node:fs';
import path from 'node:path';

export function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function writePostFile(slug: string, markdown: string) {
  const folder = path.join(process.cwd(), 'blogs', slug);
  const filename = 'blog.md';
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, filename), markdown, 'utf8');
  return { folder: `blogs/${slug}`, filename };
}
