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
