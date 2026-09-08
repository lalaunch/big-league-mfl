# The Big League MFL Theme

Hosted design layer for **The Big League** on MyFantasyLeague (2026 league 73086).
MFL stays the league engine and source of truth for rosters, standings, transactions, scoring and
schedules. This repo hosts the presentation layer on GitHub Pages so it can be edited, versioned and
rolled back without editing MFL custom messages.

## How it loads

The MFL header includes two files by name (those two names are fixed unless MFL is edited):

- `bigleague.css` — base theme
- `bigleague-v8.js` — the loader

The loader carries one version stamp `V`. It loads everything else with `?v=V`, so bumping `V` busts
every cache at once:

| File | What it does |
|---|---|
| `masthead.css` | photographic masthead and nav, on every league page |
| `hero.css` | the champion panel and photo callout under the nav (home) |
| `team.css` | the franchise hero on team pages (crest, name, record, sub-nav tabs, player art from `assets/players/<slug>.webp` when present) |
| `bigleague-core.js` | rebuilds the home page: hero grid, quick links, matchups, deadlines, standings, news row, Legacy cards, ring race |
| `sports-network.css` | page background, layout grids, quick links, matchups, standings, news row |
| `dashboard.css` | lower dashboard cards: Legacy, ring race |
| `team-logos.js` | swaps MFL franchise icons for the hosted crests everywhere; adds crests to report captions |

## Data

- `bigleague-core.js` holds `FINALS` (champion and runner-up, every season 1990 on, from the league
  plaques) and `TOPGUN` (Top Gun Trophy, from MFL league awards, 2000 on). Add a season by adding a row.
  Seasons newer than the tables are appended from MFL's League Champions and League Awards pages.
- `assets/logos/*.webp` — one 400px crest per current franchise
- `assets/hero-player-full.png` — source art for the hero; `hero-player-point.webp` is the crop in use
- `the_big_league_same_crew_bigger_legends.png` — the masthead
- `assets/big-league-wordmark.svg` — referenced by `bigleague.css` only

## Working on it

1. Edit, commit, push. GitHub Pages redeploys in about a minute; browsers hold the loader for up to
   ten minutes (Ctrl+F5).
2. Bump `V` in `bigleague-v8.js` whenever a hosted file changes.
3. A baseline of layout measurements (element positions and sizes at 980, 1400 and 1850 wide) is the
   regression check for "no visual change" refactors.
