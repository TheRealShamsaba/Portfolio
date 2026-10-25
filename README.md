# Arian Shamsabadi — Portfolio

A personal portfolio built with React, TypeScript, Vite, GSAP and Lenis.

## Development

```sh
npm install
npm run dev
npm run typecheck
npm run build
npm run preview
```

The dev server normally runs at http://localhost:5173. Production is hosted by Sites using the static Vite build in `dist/`. The Site identity is in `.openai/hosting.json`; deployment and custom-domain identifiers are in `.openai/deployment.json`.

Live portfolio: https://arian.realcompanys.com

Hosting URL: https://arian-realcompanys.noblesquid18.chatgpt.site

Custom domain: `arian.realcompanys.com`. The first published source snapshot is in the Site source repository, separate from this checkout’s existing GitHub remote. When publishing an update, copy the current application into the Site checkout and use the Sites source workflow to build, push, package, save and deploy the matching version. Never create another Site for this project.

## Current site

`src/main.tsx` loads `src/site/Site.tsx`. The older `src/App.tsx` and `src/components/` are retained from earlier iterations and are not the active site.

- `src/site/data.ts`: profile, project stories, contact details and featured work.
- `src/site/sections/`: introduction, programme, client work, Drip, chess, podcast, letter, poster archive and contact.
- `src/site/zine/`: the alternate poster, Hip-hop album and sketchbook views. Their header switcher changes the presentation of the same work.
- `src/site/motion.ts`: shared animation setup, smooth scrolling and navigation.
- `src/site/site.css`: base styles and the main portfolio; alternate-view styles sit beside their components.
- `public/`: original photography, poster artwork and project screenshots.

## Responsive behaviour

The main project scenes use pinned animation above 900px. Phones keep normal vertical scrolling with a full-screen portrait cover, larger project previews that pan as you scroll, and complete project stories. Drip is a finite vertical scroll film on phones: the stage holds while its four screens advance, then releases into KnightVision. Reduced motion shows every chapter as a static sequence. The poster archive uses full-colour, swipeable artwork with scroll snapping. The alternate views adapt at 860px. Posters brings print layers into register, pans site artwork with scrolling and exhibits selected original prints at varied sizes. Hip-hop opens as a full-screen record cover. Scrolling pulls it into an album sleeve before Side A; each release changes the room’s colour and composition. Longer stories expand as liner notes. Drip has a full-bleed orange sleeve, followed by Side B and the credits. The reading tray provides chapter navigation. An optional, original 88 BPM groove starts only after a tap and stops when Hip-hop or the browser tab is left. Short viewports and reduced motion keep a static opening. The sketchbook shows one page at a time on phones and a spread on larger screens, with a mobile chapter picker and an explicit touch drawing mode; reduced motion shows a readable sequence of static pages.

Before publishing, check the introduction, project links, Drip, contact actions and all three alternate views at both phone and desktop widths. Animation-heavy changes should also be checked after a fresh page load.

## Author and related work

Created by [Arian Shamsabadi](https://github.com/TheRealShamsaba), Founder / Full-Stack Developer.

[LinkedIn](https://www.linkedin.com/in/arian-shamsabadi-00508a281/) · [KnightVision](https://github.com/TheRealShamsaba/KnightVision) (with BakerDmo) · [Real Company](https://realcompanys.com/)
