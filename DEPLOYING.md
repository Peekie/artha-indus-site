# Deploying

Netlify rebuilds the site on every push to `main`, and build minutes are metered.
22 pushes over two days meant 22 production builds, most of them for work that
was not finished yet.

## The rule

`main` is production. Only push to `main` when the site is ready to be seen.

Do the work on `dev`, look at it locally, then merge once.

## Day to day

```
git switch dev            # work here, push here freely; Netlify ignores it
npm run preview           # rebuilds the journal index, serves on :8899
```

Open http://localhost:8899 and check the pages you touched. This is the same
build Netlify runs, so what you see locally is what deploys.

## When you are happy

```
git switch main
git merge dev
git push                  # one build
```

Several days of edits become a single deploy.

## Why `main` has to stay production

Preeti's CMS at `/admin` commits straight to `main` with `publish_mode: simple`.
Her posts are meant to go live the moment she presses Publish. If production
were moved to another branch, her posts would sit unpublished until someone
merged them, and nothing in the CMS would tell her that. Her path stays instant;
ours is the one that batches.

## Skipping a build on main

For a change that does not affect the published site (notes, README, comments),
put `[skip ci]` anywhere in the commit message and Netlify will not build:

```
git commit -m "docs: note the deploy workflow [skip ci]"
```

## One setting to confirm in Netlify

Build & deploy → Branch deploys should be **"None"** (or at least not "All").
If branch deploys are on, pushing `dev` builds too and this saves nothing.

## Jala + Dharā capsule: content awaiting approval

The capsule page launched with everything approved. Content that waits on a
third party was deleted from the shipped HTML (CSS hiding is not
unpublishing). It is preserved in commit `ded691d` (branch `capsule`):

- `alka`: RESTORED 2026-10-13 after Alka Jha's approval, as her contract's
  attribution (bio, traditions, region, Pehchan card). Her email stays private.
- `skyline`: the "Glazing translation" paragraph in each chapter and the
  fabrication and specification panel. Restore when Skyline confirms in
  writing the figures, the "Eco-Etch" name, the partnership line and the
  CSI section. Reconcile the light-transmission ranges first; they differ
  between chapters and the panel in the source brief.
- `specguide`: the "Download the specification guide" link. Restore when the
  PDF exists.

To restore one: copy the block from `git show ded691d:jala-dhara.html`,
drop the `data-gate` attribute, check it with `?preview=all` off, and deploy.

The Vault, when it ships, joins `.nav__utils` and the phone menu's utility
row, and the bar handover moves from 1260px to about 1320px (see the comment
in styles.css). Re-measure the bar after adding it.
