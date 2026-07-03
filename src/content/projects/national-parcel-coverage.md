---
title: National Parcel Coverage
blurb: A free owner-resolution atlas for all 3,221 US county-equivalents — the layer commercial parcel vendors charge for, rebuilt from public endpoints.
description: County-by-county research into whether "who owns this land?" can be answered anywhere in America using only free, public government endpoints — with an honest method recorded for every county, including the ones where the answer is no.
category: geospatial
year: 2026
tech:
  - Python
  - ArcGIS REST
  - WFS
  - QGIS
  - AI-agent orchestration
status: 'Complete — 3,221 of 3,221 counties recorded'
artifact:
  label: Coverage atlas
  detail: A per-county resolver, a methods table covering every US county-equivalent, and an interactive coverage map.
caseStudy:
  question: Can location → parcel → owner be resolved for free, everywhere in the United States?
  data: County assessor and GIS endpoints — ArcGIS REST, WFS, statewide cadastres, regional planning-district servers — across 50 states, DC, and Puerto Rico.
  method: Probe every county for a public owner endpoint, route each to its best source, and independently re-verify every route with a live point query before recording it. No scraping, no bot-defeating — free public endpoints only.
  signal: 72.8% of US county-equivalents (2,344 of 3,221) resolve to a named owner for free. The remaining ~27% sit behind commercial web-app vendors — and that gated tail, not the data itself, is the moat the paid products are built on.
  why: Parcel ownership is the ground truth beneath real-asset finance, and knowing exactly where the free frontier ends is worth as much as the coverage itself.
featured: true
---

## What it is

Type a coordinate anywhere in America; get back the parcel and the name of who owns it. Commercial vendors sell this as a national dataset. This project asked how much of it could be reassembled from what counties already publish for free — and recorded an honest answer for every single one of the 3,221 county-equivalents in the country, including the ones where the answer is "you can't."

## What the map says

- **100% recorded.** Every county-equivalent in all 50 states, DC, and Puerto Rico has a documented resolution method or a documented reason there isn't one.
- **72.8% resolvable.** 2,344 counties expose a free, public owner endpoint — each one independently re-verified with a live point query, not taken on faith from a directory listing.
- **The ceiling is structural.** The unresolvable ~27% isn't missing data — it's the same ownership data gated behind a handful of commercial portal vendors. That's the real boundary between free and paid in American land records, drawn county by county.

## How it was actually done

Fleets of directed AI agents probed states in parallel; every promising endpoint they surfaced was then re-verified independently before being routed, because agents oversell and undersell — verification passes personally caught three statewide sources the agents missed entirely (Maine, New Hampshire, and a Puerto Rico tax-roll snapshot covering all 78 municipios) and killed false positives that would have quietly corrupted the atlas. The accounting discipline carried over intact: nothing ships until it reconciles against the source.

## The footnote

A few years ago I applied — cover letter and all — to the company that leads this market, and never heard back. This atlas was built on nights and weekends for roughly the cost of an AI subscription. I keep the cover letter around as a calibration artifact: the distance between "no reply" and "rebuilt the core layer" is shorter than it has ever been, for anyone willing to verify their own work.
