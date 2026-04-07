import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

const DB_PATH = path.join(process.cwd(), 'blog.sqlite');

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  tags: string;
  refs: string;
  links: string;
  folder: string;
  filename: string;
  createdAt: string;
  updatedAt: string;
};

function ensureDbFile() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, '');
  }
}

export function getDb() {
  ensureDbFile();
  const db = new Database(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      tags TEXT DEFAULT '',
      refs TEXT DEFAULT '',
      links TEXT DEFAULT '',
      folder TEXT NOT NULL,
      filename TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);
  return db;
}

export function upsertPost(meta: Omit<PostMeta, 'createdAt' | 'updatedAt'>) {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO posts (slug, title, description, tags, refs, links, folder, filename, createdAt, updatedAt)
     VALUES (@slug, @title, @description, @tags, @refs, @links, @folder, @filename, @createdAt, @updatedAt)
     ON CONFLICT(slug) DO UPDATE SET
      title=excluded.title,
      description=excluded.description,
      tags=excluded.tags,
      refs=excluded.refs,
      links=excluded.links,
      folder=excluded.folder,
      filename=excluded.filename,
      updatedAt=excluded.updatedAt`
  ).run({ ...meta, createdAt: now, updatedAt: now });
  db.close();
}

export function listPosts(query?: string): PostMeta[] {
  const db = getDb();
  let rows: PostMeta[];
  if (query && query.trim()) {
    const q = `%${query.trim()}%`;
    rows = db
      .prepare(
        `SELECT * FROM posts
         WHERE title LIKE ? OR description LIKE ? OR tags LIKE ? OR refs LIKE ? OR links LIKE ?
         ORDER BY updatedAt DESC`
      )
      .all(q, q, q, q, q) as PostMeta[];
  } else {
    rows = db.prepare(`SELECT * FROM posts ORDER BY updatedAt DESC`).all() as PostMeta[];
  }
  db.close();
  return rows;
}
