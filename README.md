# xdoes blog editor

Local browser-based markdown editor + sqlite metadata index + optional git push.

## What it does

- Write blog content in a simple markdown editor with live preview.
- Saves posts to `blogs/<slug>/blog.md`.
- Stores searchable metadata in root sqlite file: `blog.sqlite`.
- Optional commit+push to `origin/main` from the UI action.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Metadata schema (sqlite)

Table: `posts`

- `slug` (PK)
- `title`
- `description`
- `tags` (plain text, comma-separated)
- `refs` (plain text, comma-separated related slugs)
- `links` (plain text, comma-separated URLs)
- `folder` (e.g. `blogs/my-post`)
- `filename` (`blog.md`)
- `createdAt`
- `updatedAt`

## Publish flow

UI calls `POST /api/posts/publish` with:

- title
- description
- tags
- refs
- links
- markdown
- push (boolean)

Server writes markdown, upserts sqlite metadata, and if `push=true` runs:

- `git add blogs blog.sqlite`
- `git commit -m "blog: publish <slug>"`
- `git push origin main`

## Notes on GitHub auth

This app uses your local git credentials/session.
If push fails, authenticate git in your terminal first (`gh auth login` or PAT/credential helper).
