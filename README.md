# make-fun-gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/arunanala65-spec/make-fun-gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/arunanala65-spec/make-fun-gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

**Entry title:** Vice Platinum Tracker
**Competition:** [gta6-trophy-guide-01 — Build the best GTA 6 trophy guide](https://make.fun/bounty/gta6-trophy-guide-01) ($250, 50 paid, free entry)
**Repo:** `arunanala65-spec/make-fun-gta6-trophy-guide-01`
**Referral:** https://make.fun/r/ce51ph37 (code `ce51ph37`)

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

## What it does

An offline trophy-guide tracker web app for Grand Theft Auto VI (PlayStation 5). It covers all **55 trophies — 1 Platinum ("Vice Got a Price!"), 2 Gold, 6 Silver, 46 Bronze**, 1,000 Gamerscore on Xbox, all single-player, **0 online trophies**.

- **Checklist tracker** — tick trophies off; progress is saved in `localStorage` and survives reloads. Progress bar shows X / 55 earned.
- **Export & import** — export progress to a JSON file and import it back, no network involved.
- **Filters** — by tier (Platinum / Gold / Silver / Bronze) and by kind (story, heist, activities, collectibles, 100%, missable), plus a search box.
- **Spoiler setting** — when ON, the names and descriptions of story trophies stay hidden until you earn them.
- **Guide per trophy** — every trophy shows its official name, description and grade, a guide in our own words, and its source by name (PushSquare, GTABase, WikiGTAVI, KeenGamer, Exophase, PSNProfiles, or the Official PlayStation description).
- **Platinum roadmap** — about 200 hours in 5 stages, built from the official descriptions: story chapters and missions, heist and stranger strands, activities, collectibles and exploration, then the 100% cleanup.
- **Missable flags** — 13 trophies flagged from the official descriptions. The only one that may be missable for good is **"Positive Mental Attitude"** (meditation, Chapter 1) — start it in Chapter 1.
- **Honest about the hidden trophies** — 28 hidden trophies are marked **"belum terkonfirmasi"**: their unlock methods are not confirmed in public sources yet, so this guide invents no method for them and says so plainly.

No build step, no dependencies, no network requests at runtime. Plain static files under `app/` (`index.html` + `style.css` + `app.js` + `data/trophies.json`); no Rockstar logos, artwork or fonts.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
# writes out/dossier.json plus out/app and out/screenshots
```

Screenshots (1280×800, in `screenshots/`): 1) checklist with a trophy guide open, 2) platinum roadmap, 3) silver-tier filter, 4) spoiler setting on a story filter.

## License

MIT — see `LICENSE`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=ce51ph37&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
