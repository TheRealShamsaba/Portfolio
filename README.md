# Arian Shamsabadi — Portfolio

Personal portfolio for my engineering projects, poster work, and The Reasonable Show. Built with React, TypeScript, Vite, and Tailwind CSS, with English and Persian views.

[Live portfolio](https://arian-portfolio-puce.vercel.app/) · [GitHub profile](https://github.com/TheRealShamsaba) · [LinkedIn](https://www.linkedin.com/in/arian-shamsabadi-00508a281/)

## Explore the site

The home page brings together an introduction, selected posters, project case studies, repositories, podcast content, and contact links. `/showcase` opens the full poster gallery. The language toggle switches between English and Persian and saves the choice locally.

This repository contains the public portfolio frontend. My current product work is also presented through [Real Company](https://realcompanys.com/) and [Drip](https://dressrightinpublic.com/) (public website; iPhone app in private beta).

## Run locally

Use Node.js 22.12 or newer and npm. Run these commands from a terminal:

```bash
git clone https://github.com/TheRealShamsaba/Portfolio.git
cd Portfolio
npm ci --ignore-scripts
npm run dev -- --host 127.0.0.1
```

Open the local URL printed by Vite, normally `http://127.0.0.1:5173`. The checked-in lockfile fixes dependency versions; installation lifecycle scripts are not needed for this setup. No API credentials or environment file are required.

## Check and build

From the repository root:

```bash
npm exec -- tsc --noEmit
npm run build
npm run preview -- --host 127.0.0.1
```

The build writes static files to `dist/`. The preview command serves that build locally, normally at `http://127.0.0.1:4173`; stop either server with Ctrl+C. `npm run build` bundles the site but does not run TypeScript checking, so run both checks. There is no automated browser test suite or `npm test` script in this repository.

## Edit content

| Location | Purpose |
| --- | --- |
| [`src/content.ts`](src/content.ts) | English profile, project entries, poster metadata, and links |
| [`src/i18n.tsx`](src/i18n.tsx) | UI strings, Persian content overrides, and language state |
| [`src/App.tsx`](src/App.tsx) | Home page composition and `/showcase` routing |
| [`src/components/`](src/components/) | Page sections and gallery components |
| [`src/styles.css`](src/styles.css) | Layout, typography, and visual styling |
| [`public/`](public/) | Profile image and poster assets |

When changing profile or project copy, check the Persian overrides as well as the English source. Some components have both `.tsx` and older `.jsx` files; [`vite.config.ts`](vite.config.ts) explicitly prefers the typed files.

## Status and limitations

- The public portfolio is live. The deployment and a local checkout can reflect different revisions.
- Contact buttons open email or messaging services; there is no contact-form backend in this repository.
- The route selection is handled in the frontend. A static host must serve `index.html` for `/showcase`; [`vercel.json`](vercel.json) contains the Vercel rewrite.
- Content, external links, and both language views need manual review after changes. Build and type checks do not verify their accuracy or accessibility.

## Author and related work

Created by [Arian Shamsabadi](https://github.com/TheRealShamsaba), Founder / Full-Stack Developer.

[KnightVision](https://github.com/TheRealShamsaba/KnightVision) · [Movie Recommender System](https://github.com/TheRealShamsaba/Movie-Recommender-system) · [Real Company](https://realcompanys.com/)
