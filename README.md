# Black Friday Deal Radar

![Black Friday Deal Finder](https://make.fun/badge/black-friday-deal-finder-01.svg)
![Rank](https://make.fun/badge/black-friday-deal-finder-01/longjie-xing/black-friday-deal-finder-01/rank.svg)
![Reward](https://make.fun/badge/black-friday-deal-finder-01/longjie-xing/black-friday-deal-finder-01/reward.svg)

Entry for [Build the best real Black Friday deal finder](https://make.fun/c/black-friday-deal-finder-01) — a static deal-finder site for Black Friday and Cyber Monday 2026.

## What it is

A plain static site under `app/` (no build step, no network requests): 35 real Black Friday deals across TVs, audio, laptops, smart home, wearables, home and kitchen, from Amazon, Best Buy, Walmart and Target. Every price was checked on Friday, November 27, 2026 at the named store or in a deals source naming the store, and each card shows the sale price, usual price, discount, when the price was checked, where it was read, and an honest verdict — new low, strong price, or routine sale — with the evidence for it.

## Features

- Search across products, brands and stores
- Filters by category, store and minimum discount, plus a new-lows-only toggle
- Sorting: best deals first, biggest % off, biggest $ saving, price low/high
- A detail page for every deal (`#/deal/<id>`) with the full evidence and, where the same product is cheaper at another store, the comparison
- Works on desktop and phone widths; all files local, nothing loaded over the network

## Run it

```sh
node serve.ts        # or: python3 -m http.server -d app 8080
```

Then open http://localhost:8080.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored `vendor/makefun-frontend.ts` library.

## License

MIT — see [LICENSE](LICENSE).
