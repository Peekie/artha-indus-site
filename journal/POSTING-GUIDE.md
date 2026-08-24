# How to publish a Perspectives post

Your Journal ("Perspectives") is powered by plain text files — no software to log into, no
passwords. Publishing a new musing is three small steps.

## Step 1 — Write your post

Create a new file in this `journal/` folder named after your post, ending in `.md`, using only
lowercase letters and hyphens. Example: `journal/the-quiet-power-of-negative-space.md`

Write your post in **Markdown** — normal text, with a few simple marks for formatting:

```markdown
## A section heading

A normal paragraph. Just type. Leave a blank line between paragraphs.

**Bold text** for emphasis, and *italic text* for a softer emphasis.

> A line in quotes like this becomes a large pull-quote.

- A bulleted list
- Another item

[A link to something](https://example.com)

![A caption for an image](assets/img/your-image.jpg)
```

That's everything you need. Don't add the post's title at the top — that comes from Step 2.

## Step 2 — Add it to the list

Open `journal/posts.json`. Copy an existing block and paste it at the **top** of the list (newest
posts go first). Change the details to match your new post:

```json
{
  "slug": "the-quiet-power-of-negative-space",
  "title": "The Quiet Power of Negative Space",
  "dek": "A one-line subtitle that sits under the title",
  "date": "2026-09-15",
  "author": "Preeti Padaley",
  "readingTime": "5 min read",
  "image": "assets/img/your-cover-image.jpg",
  "excerpt": "A sentence or two that appears on the Journal card and entices the reader.",
  "tags": ["Essay", "Craft"]
}
```

- **slug** must exactly match your file name (without the `.md`).
- Put a comma after each `}` except the very last one in the list.

## Step 3 — Add a cover image (optional)

Drop a photo into `assets/img/` and point `image` at it (e.g. `assets/img/my-photo.jpg`). If you
skip this, the post still publishes without a cover.

## That's it

Save the files and re-publish the site (or, on Squarespace/Netlify, upload the changed files). Your
post appears at the top of the Journal automatically, with its own shareable link.

---

### Want to write in a visual editor instead?

If you'd rather write posts in a friendly web editor (like a simplified WordPress) without touching
files, the site can be connected to a free tool called **Decap CMS** (works with Netlify hosting).
Ask your developer to "add Decap CMS to the journal folder" — your posts, images, and publishing all
happen in the browser after that. The files above keep working exactly the same underneath.
