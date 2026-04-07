'use client';

import { marked } from 'marked';
import { useEffect, useMemo, useState } from 'react';

type Post = {
  slug: string;
  title: string;
  description: string;
  tags: string;
  refs: string;
  links: string;
  updatedAt: string;
};

export default function EditorPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [refs, setRefs] = useState('');
  const [links, setLinks] = useState('');
  const [markdown, setMarkdown] = useState('# New post\n\nStart writing...');
  const [push, setPush] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [q, setQ] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);

  const preview = useMemo(() => ({ __html: marked.parse(markdown) as string }), [markdown]);

  async function loadPosts(search?: string) {
    const res = await fetch(`/api/posts/list${search ? `?q=${encodeURIComponent(search)}` : ''}`);
    const data = await res.json();
    if (data.ok) setPosts(data.posts);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function publish() {
    setSaving(true);
    setMsg('');
    const res = await fetch('/api/posts/publish', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title, description, tags, refs, links, markdown, push }),
    });
    const data = await res.json();
    setSaving(false);
    if (!data.ok) {
      setMsg(`❌ ${data.error}`);
      return;
    }
    setMsg(`✅ published: ${data.slug}`);
    loadPosts(q);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginTop: 0 }}>xdoes blog editor</h1>
      <p>Write markdown, save to <code>blogs/&lt;slug&gt;/blog.md</code>, update <code>blog.sqlite</code>, optionally push to GitHub.</p>

      <div style={{ display: 'grid', gap: 8, maxWidth: 880 }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={input} />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={input} />
        <input placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} style={input} />
        <input placeholder="References (comma separated blog slugs)" value={refs} onChange={(e) => setRefs(e.target.value)} style={input} />
        <input placeholder="Links (comma separated URLs)" value={links} onChange={(e) => setLinks(e.target.value)} style={input} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} style={textarea} />
          <div style={previewBox} dangerouslySetInnerHTML={preview} />
        </div>

        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="checkbox" checked={push} onChange={(e) => setPush(e.target.checked)} />
          Commit and push to GitHub
        </label>

        <button onClick={publish} disabled={saving} style={button}>
          {saving ? 'Publishing...' : 'Publish post'}
        </button>
        {msg ? <p>{msg}</p> : null}
      </div>

      <hr style={{ margin: '24px 0', borderColor: '#2a2339' }} />

      <h2>Posts index (from sqlite)</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input placeholder="Search posts" value={q} onChange={(e) => setQ(e.target.value)} style={input} />
        <button onClick={() => loadPosts(q)} style={button}>Search</button>
      </div>
      <div style={{ display: 'grid', gap: 8 }}>
        {posts.map((p) => (
          <div key={p.slug} style={card}>
            <strong>{p.title}</strong>
            <div style={{ opacity: 0.8 }}>{p.slug}</div>
            <div style={{ opacity: 0.9 }}>{p.description}</div>
            <small>tags: {p.tags || '-'} | refs: {p.refs || '-'} | updated: {p.updatedAt}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

const input: React.CSSProperties = {
  background: '#120f1a', color: '#efe8ff', border: '1px solid #31294a', borderRadius: 8, padding: '10px 12px'
};
const textarea: React.CSSProperties = {
  minHeight: 360, background: '#120f1a', color: '#efe8ff', border: '1px solid #31294a', borderRadius: 8, padding: 12,
};
const previewBox: React.CSSProperties = {
  minHeight: 360, overflow: 'auto', background: '#0f0c16', border: '1px solid #31294a', borderRadius: 8, padding: 12,
};
const button: React.CSSProperties = {
  background: '#2b2140', color: '#efe8ff', border: '1px solid #4a3a69', borderRadius: 8, padding: '10px 12px', cursor: 'pointer',
};
const card: React.CSSProperties = {
  background: '#120f1a', border: '1px solid #31294a', borderRadius: 8, padding: 10,
};
