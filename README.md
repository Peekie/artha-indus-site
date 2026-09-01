# Artha Indus Atelier Website

Live: https://artha-indus.netlify.app

A static site (HTML + one CSS file + one JS file). No framework.
Netlify runs `npm run build` on each push, which regenerates the Journal
index from the Markdown posts, so publishing a post needs no code.

## For Preeti: writing a post
Go to **https://artha-indus.netlify.app/admin/**, sign in, and click
**New Post**. Write, drag in photos, hit **Publish**. The site updates
itself in about a minute. You never need to touch this repository.

## Structure
- `index.html`, `curators-note.html`, `spatial-studies.html`, `lineages.html`,
  `perspectives.html`, `collaborate.html`, `post.html`, `404.html` (the pages)
- `journal/*.md` (the Journal posts, written via the editor)
- `journal/posts.json` (generated; do not edit by hand)
- `assets/` (css, js, images, the Lookbook PDF)
- `admin/` (the Decap CMS editor)
- `scripts/build-journal.mjs` (rebuilds the Journal index)

## Local preview
    python3 -m http.server 8777
