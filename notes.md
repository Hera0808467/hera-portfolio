# Notes: ReactBits Library (Catalog + Integration)

## Categories (from tool)
- animations
- backgrounds
- text-animations
- components
- buttons
- forms
- loaders

## Key observations
- Many higher-quality components are TS + Tailwind oriented (paths like `src/ts-tailwind/...`).
- Some components depend on animation libs:
  - Tool metadata often lists `framer-motion`, while some generated code imports from `motion/react`.
- Some components are strictly client-only (use `window`, `document`, `canvas`, `WebGL`, `ResizeObserver`).
  - In Next.js App Router: add `'use client'` to those component files, or only render them under a client component.
- Tool-generated "Usage Example" sections can be buggy (invalid JSX); treat the component implementation as source-of-truth.

## Notable components (good for portfolios)
### animations
- `splash-cursor` (WebGL fluid cursor effect; client-only; heavy)
- `blob-cursor` (depends on framer-motion per metadata)
- `animated-content`, `fade-content` (depends on framer-motion per metadata)

### backgrounds
- `aurora` (depends on `ogl`; WebGL; client-only)
- `beams`, `particles` (background effects; some are complete per tool)

### text-animations
- `gradient-text` (imports `motion/react` in demo)
- `blur-text`, `ascii-text`, `circular-text`, `count-up` (many depend on framer-motion per metadata)

### components
- `pixel-card` (canvas + `window.matchMedia` => client-only)
- `dock` (imports `motion/react` in demo)
- `animated-list` (complete per tool)

## Practical workflow to use ReactBits in a real project
1. Identify needed component slugs (e.g., `pixel-card`, `splash-cursor`).
2. Pull code via tool (`get_component` / `get_component_demo`).
3. Copy into your repo (one file per component, keep names stable).
4. Install required deps per component:
   - Animation: `framer-motion` or `motion` (depending on imports in the component you pulled).
   - WebGL shader background: `ogl` (e.g., `aurora`).
5. Ensure styling matches the component variant (Tailwind vs CSS).
6. For Next.js, mark client components with `'use client'` where needed and avoid SSR-only rendering paths.

## Reverse-engineering notes (this specific artifact)
### Entry points
- The main page loads these chunks (from `reference/__next.__PAGE__.txt`):
  - `reference/_next/static/chunks/9d18e53bc5db42e6.js`
  - `reference/_next/static/chunks/8e3caccc846f97b8.js`
  - `reference/_next/static/chunks/20faba63631f54d6.js`
  - plus runtime chunks like `reference/_next/static/chunks/ff1a16fafef87110.js` and `reference/_next/static/chunks/7340adf74ff47ec0.js`

### Canonical content data
- Project/month data is embedded as module `84509` in:
  - `reference/_next/static/chunks/9d18e53bc5db42e6.js`
  - Format: `e.v(JSON.parse('...'))` (single JSON blob with `month`, `displayMonth`, `welcomeText`, `endingText`, `projects[]`).

### Page/component map (high-level)
- Main page component (renders hero + sections + nav + contact) is module `31713` in:
  - `reference/_next/static/chunks/8e3caccc846f97b8.js`
- Hero section is implemented as function `sw(...)` in the same chunk (uses a variable-weight text effect).
- Ending “Thanks for making this far.” uses a SplitText-like component dynamically loaded from:
  - `reference/_next/static/chunks/04228f0fbd445c07.js`
- Background is dynamically loaded (SSR false) as module `58064` -> loads:
  - `reference/_next/static/chunks/a8599c113791f59a.js` (Three.js + shader background code)

### Confirmed effects detected via CSS class signatures
- Circular Text (matches ReactBits `circular-text`):
  - CSS selector `.circular-text` in `reference/_next/static/chunks/d4a63f568a269e47.css`
- Variable Proximity (matches ReactBits `variable-proximity`):
  - CSS selector `.variable-proximity` in `reference/_next/static/chunks/a2d3dcdbfd83f794.css`
- Text Cursor (matches ReactBits `text-cursor`):
  - CSS selectors `.text-cursor-container`, `.text-cursor-inner`, `.text-cursor-item` in `reference/_next/static/chunks/a2d3dcdbfd83f794.css`
- Ghost Cursor (canvas-based cursor overlay; not in the tool's current catalog):
  - CSS selectors `.ghost-cursor` / `.ghost-cursor>canvas` in `reference/_next/static/chunks/a2d3dcdbfd83f794.css`
  - NOTE: these classes may be unused in the current page HTML/JS (potential dead CSS).

### Confirmed JS libraries / heavy effects
- GSAP is bundled (text split/scroll animation behavior appears in `reference/_next/static/chunks/20faba63631f54d6.js`).
- ReactBits-like SplitText component is bundled (code contains `_rbsplitInstance`, GSAP `ScrollTrigger`, and a `splitType` prop):
  - `reference/_next/static/chunks/04228f0fbd445c07.js`
- Three.js is bundled (revision "167"), plus shader uniforms like `uTime` etc:
  - `reference/_next/static/chunks/a8599c113791f59a.js`

## Tailwind v4 integration gotcha (this repo)
- Using Tailwind v4 with `@tailwind base/components/utilities;` produced utilities, but missed the v4 `@layer theme` output (breakpoints, tokens) in our Next build.
  - Symptom: no `sm:` / `md:` / `lg:` CSS in `.next/static/chunks/*.css`, causing `hidden sm:block` elements (like GroupNav) to stay hidden.
- Fix: switch `app/globals.css` to `@import "tailwindcss";` and keep an explicit `@config "../tailwind.config.js";`.
