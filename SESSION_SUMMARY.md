# Hamieverse Wiki - Session Summary
**Date:** February 17, 2026
**Project Path:** `/Users/bill/Documents/Development/hamiewiki`
**Dev Server:** Port 3001 (Next.js 16 with Turbopack)
**Repo:** https://github.com/zaddy99999/HamieWiki.git (auto-deploys to Vercel)

---

## Recent Changes Made This Session

### 1. Font System Overhaul
Replaced all fonts throughout the codebase:
- **Mokoto** (`/public/fonts/Mokoto.ttf`) - Logo + major headers (h1, h2)
- **Bicubik** (`/public/fonts/bicubik.otf`) - Subheaders (h3, h4, h5, h6)
- **Satoshi** (`/public/fonts/Satoshi-*.woff2`) - Body copy (all weights available)

Files updated:
- `/src/app/globals.css` - CSS variables and @font-face declarations
- `/src/styles/theme-brutalist.css` - All Azonix/Poppins references replaced
- `/src/app/xp-card/page.tsx` - ID card inline styles

### 2. Character of the Day Navigation
Added left/right arrow navigation to browse previous characters of the day.
- File: `/src/components/CharacterOfTheDay.tsx`
- Added `dayOffset` state to track which day to show
- Added ChevronLeft/ChevronRight icons to `/src/components/Icons.tsx`
- CSS for nav buttons in `/src/styles/theme-brutalist.css`

### 3. Gallery Page - Novel Link Removed
- File: `/src/app/gallery/page.tsx`
- Removed the Novel external link from the tabs
- Tabs now: Hamieverse, Comics, Community, Chaos (star button)

### 4. Character PNG Images (21 new)
Added to `/public/images/`:
- AceCharacter.png, AcePudgyCharacter.png, AlistairVeynarCharacter.png
- CaligoCharacter.png, EchoWhispererCharacter.png, ElyndorCharacter.png
- HaloCharacter.png, HamieCharacternft.png, HikariCharacter.png
- IronPawCharacter.png, KaelCharacter.png, KaiVoxCharacter.png
- KiraFluxCharacter.png, LiraCharacter.png, LostSentinelCharacter.png
- MalvoriaCharacter.png, OrrienCharacter.png, OrrienVeynar.png
- SamCharacter.png, SilasCharacter.png, SimbaCharacter.png, VeylorQuann.png

Mapping in `/src/lib/hamieverse/characters.ts` - `characterPngs` object

### 5. Image Fallback Logic
All components now use pngFile as fallback when gifFile not available:
```typescript
src={char.gifFile ? `/images/${char.gifFile}` : char.pngFile ? `/images/${char.pngFile}` : '/images/hamiepfp.png'}
```

Updated files:
- `/src/app/page.tsx`
- `/src/app/character/[id]/page.tsx`
- `/src/components/WikiNavbar.tsx`
- `/src/components/RandomQuoteWidget.tsx`
- `/src/components/CharacterOfTheDay.tsx`

---

## Pending/Uncommitted Changes

1. **Gallery page** - Novel link removal (not pushed yet)

---

## Project Structure Overview

### Key Pages
| Route | File | Description |
|-------|------|-------------|
| `/` | `/src/app/page.tsx` | Home - character grid, glossary, COTD |
| `/character/[id]` | `/src/app/character/[id]/page.tsx` | Character detail pages |
| `/xp-card` | `/src/app/xp-card/page.tsx` | XP/ID card generator with export |
| `/tier-maker` | `/src/app/tier-maker/page.tsx` | S-F tier ranking drag-drop |
| `/build-your-team` | `/src/app/build-your-team/page.tsx` | Budget team builder |
| `/gallery` | `/src/app/gallery/page.tsx` | Media gallery with chaos mode |

### Key Libraries
- `html2canvas` - Screenshot/export functionality
- `gif.js` + `omggif` - GIF generation for XP cards
- `/public/gif.worker.js` - GIF worker script

### Data Layer
- `/src/lib/hamieverse/characters.ts` - getAllCharacters(), getGlossary(), etc.
- `/src/lib/hamieverse/lore.json` - Main character/lore data
- `/src/lib/hamieverse/comics.json` - Comic character data
- `/src/lib/hamieverse/colors.ts` - Character color mappings
- `/src/lib/hamieverse/types.ts` - TypeScript interfaces

### Styling
- `/src/app/globals.css` - Base styles + CSS variables
- `/src/styles/theme-brutalist.css` - Main theme (purple/blue brutalist)
- `/src/styles/mobile-fix.css` - Mobile responsive fixes

### CSS Variables
```css
--brand-primary: #0446F1 (blue)
--brand-secondary: #AE4DAF (purple)
--font-heading: 'Mokoto'
--font-subheading: 'Bicubik'
--font-sans: 'Satoshi'
```

---

## Known Issues / Notes

1. **Large video file** - `/public/fanart/HamieTCGGameplay.mp4` (388MB) excluded from git due to GitHub's 100MB limit

2. **Background images** - Desktop: `/DesktopBG.png`, Mobile: `/MobileBG.png`

3. **Dev server** - Start with: `npm run dev -- -p 3001`

---

## Git Status
- Branch: `main`
- Remote: `origin/main` (GitHub → Vercel auto-deploy)
- Last push included: Font updates, COTD navigation, character images

---

## To Continue Work

1. Start dev server: `cd /Users/bill/Documents/Development/hamiewiki && npm run dev -- -p 3001`
2. Push pending changes: `git add . && git commit -m "message" && git push`
3. Character images folder also at: `/Users/bill/Documents/Hamieverse/`
