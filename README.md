# Devraj Goswami — 3D Developer Portfolio

An award-style, minimal 3D portfolio built with **React + Vite + TypeScript**, **Three.js** (`@react-three/fiber`, `@react-three/drei`), **Rapier physics**, **GSAP + ScrollTrigger**, **Lenis** smooth scrolling and **Tailwind CSS v4**.

## Features

- **Loader**: a 0–100% counter that waits for the 3D hero scene and any GLB or texture assets, then reveals the page with a clip-path wipe.
- **Custom cursor**: a glowing violet dot plus a lagging blurred circle that grows over links. It is hidden on touch devices.
- **Navbar and social bar**:
  - Navbar links slide their text on hover.
  - A fixed vertical social bar sits on the left.
  - A **RESUME** link sits at the bottom-right.
- **Hero**:
  - A stylised 3D developer (glasses and hoodie) whose head and pupils follow the mouse. The eyes blink.
  - Purple rim lights, a halo and an orbit ring.
  - The title words cycle with a scramble effect.
  - The hero is pinned on scroll while the avatar slides to the side.
- **About**: the words reveal one by one as you scroll.
- **Career timeline**: a glowing violet line and dot fill the timeline as you scroll.
- **Tech stack**: 15 glossy 3D balls with logos.
  - They drop in when the section comes into view and are pulled toward the centre.
  - Your cursor pushes them around (Rapier physics).
- **Work**:
  - Desktop: a pinned, horizontal-scroll gallery with image parallax and a violet glow on hover.
  - Mobile: the cards stack vertically.
- **Contact**: a large "Let's work together" heading, a mail link and social links.
- **Performance**:
  - Both 3D scenes are lazy-loaded.
  - The tech-stack scene (Rapier WASM) loads only when you scroll near it.
  - The hero stops rendering when it is off-screen.

## Project structure

```
src/
  data/portfolio.ts      ← ALL your personal content (edit this)
  components/            ← Cursor, Loader, Navbar/SocialBar, SmoothScroll, SplitHeading, ScrambleText, Icons
  sections/              ← Hero, About, Career, TechStack, Work, Contact
  three/                 ← HeroScene, Avatar (procedural + GLB), TechBalls (physics), logoTexture
  lib/                   ← gsap setup, shared mouse/ready signals
public/
  resume.pdf             ← linked from the RESUME button
  projects/*.svg         ← project cover images (replace with screenshots)
  models/                ← put avatar.glb here (optional)
  logos/                 ← put real tech logos here (optional)
```

## Run locally

You need **Node.js 18 or newer**.

```bash
npm install
npm run dev        # http://localhost:5173
```

Production build:

```bash
npm run build      # type-checks, then builds to /dist
npm run preview    # serve the production build locally
```

## Customise

### 1. Your content
Edit **`src/data/portfolio.ts`**. It holds your name, the hero words, the about text, socials, career entries, tech stack, projects and contact text. Leave a social `href` empty (`''`) to hide that icon.

### 2. Your own 3D avatar (GLB)
By default, the avatar is built from code in `src/three/Avatar.tsx`, so the site needs no downloads. To use your own model:
1. Export a `.glb` file (Ready Player Me, Avaturn, Blender or Mixamo all work).
2. Save it as `public/models/avatar.glb`.
3. In `portfolio.ts`, set `avatar.glbUrl: '/models/avatar.glb'`, then adjust `scale` and `position`.

Any bone whose name contains **"Head"** (and optionally **"Neck"**) follows the mouse.

### 3. Real tech logos on the 3D balls
By default, each ball gets a generated colour badge (see `src/three/logoTexture.ts`). To use real logos:
1. Add square, transparent PNG or SVG files to `public/logos/`.
2. In `portfolio.ts`, add `logo: '/logos/react.png'` to that tech item.

### 4. Project images
Replace `public/projects/*.svg` with real screenshots (16:10 works best). Then update the `image` paths in `portfolio.ts`.

### 5. Resume
Replace `public/resume.pdf` with your latest resume.

## Deploy on Vercel

**Option A: GitHub with the Vercel dashboard (recommended)**
1. Push this folder to a new GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/portfolio.git
   git push -u origin main
   ```
2. Go to https://vercel.com, then **Add New → Project** and import the repository.
3. Vercel detects **Vite** automatically. Keep these settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**. You get a live URL like `https://portfolio-xyz.vercel.app`. You can add a custom domain under **Settings → Domains**.

**Option B: Vercel CLI**
```bash
npm i -g vercel
vercel           # first deploy (answer the prompts)
vercel --prod    # production deploy
```

## Notes

- The production build has two large lazy chunks: the hero 3D scene and the physics/WASM tech-stack scene. Neither blocks the first paint.
- To keep the site smooth on lower-end machines, lower `dpr` in `src/three/HeroScene.tsx` and `src/three/TechBalls.tsx`. You can also trim the `techstack` list.
