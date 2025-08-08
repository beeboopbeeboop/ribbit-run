
# Ribbit Run: Español

Cute 2D vocab-runner prototype. Collect fruit → Spanish word pops → pick the right English translation → hype popup (**BOTCH-TASTIC!**, etc.).

## Quick start
```bash
npm install
npm run dev
# open http://localhost:5173
```

## Controls
- ← → move
- Space to jump
- Quiz: ↑/↓ to select, Enter to confirm

## Settings
- Gear icon opens Settings
- Toggle: Use Argentine variants (AR)
- Reset progress button

## Persistence
- Saves character, world, and total score in `localStorage` as `ribbit.progress`
- Saves settings in `localStorage` as `ribbit.settings`

## Dev
```bash
npm install
npm run dev
npm run build
npm test
```

## Deploy
- Root directory is the repo root
- CI runs build and tests

## Badges
[![CI](https://github.com/beeboopbeeboop/ribbit-run/actions/workflows/ci.yml/badge.svg)](https://github.com/beeboopbeeboop/ribbit-run/actions/workflows/ci.yml)

## Next steps (Sprint 2 ideas)
- Tilemap collisions + slopes
- SFX & Spanish VO
- Spaced repetition + save progress
- Boss quiz (5 in a row)
- Unlocks (Chinnie, outfits)
