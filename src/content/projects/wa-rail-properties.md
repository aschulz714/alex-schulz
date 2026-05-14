---
title: WA Rail-Served Properties
blurb: An inventory of every parcel in Washington State with private rail access — 671 parcels, $9.3B in assessed value.
description: An interactive map and concentration analysis of rail-served industrial real estate in Washington State. Built on USDOT Bureau of Transportation Statistics rail network data crossed against statewide parcel layers from county GIS sources.
category: geospatial
year: 2026
tech:
  - MapLibre GL JS
  - OpenFreeMap
  - GeoJSON
  - Python
status: Live
artifact:
  label: Property inventory
  detail: 671 parcels · 29 counties · 15 industries · $9.3B assessed
caseStudy:
  question: Where are the rail-served industrial parcels in Washington, and what do they reveal about industrial-real-estate concentration?
  data: BTS NARN rail network, WA State GIS parcel layer, county assessor records.
  method: Python spatial intersection of parcels with rail centerlines, manual review for false positives, MapLibre client for interactive exploration.
  signal: A complete public-facing inventory of a scarce industrial real-estate category — rail access cannot be retrofitted, so the existing 671 parcels are effectively the universe.
  why: Rail-connected industrial real estate is structurally fixed inventory; concentration patterns in this dataset are the kind of pattern an analyst would want to see.
links:
  repo: https://github.com/aschulz714/wa-rail-properties
  demo: https://aschulz714.github.io/wa-rail-properties/
featured: true
---

## What it does

An interactive map of every parcel in Washington State where a freight rail spur extends onto private property — connecting the site directly to the North American rail network. 671 parcels across 29 counties and 15 industries, with $9.3B in combined assessed value across 562 parcels that have recorded assessor values.

## Why it matters

Rail access cannot be retrofitted. The cost and complexity of building a new spur (right-of-way negotiation, track-grade engineering, FRA approvals) means the existing inventory is effectively fixed — new rail-served parcels aren't being created at scale. That makes the 671 parcels here a near-complete map of a scarce industrial real-estate category. Concentration is the most legible finding: the top 2 grain operators alone hold 57 combined parcels, Agriculture &amp; Food covers 47% of the dataset, and King + Pierce counties account for ~26% of statewide rail-served inventory.

## What's in the build

- Map-first single-page tool: 100vh MapLibre map with glass-panel overlays for filter, basemap toggle, and rail-network visibility
- Slide-out drawer (right) holds narrative — overview, key findings, methodology, notes
- Light / Satellite basemap toggle (CARTO Positron + ESRI World Imagery), with foreground line colors auto-adapting for satellite contrast
- 5 industry-tier toggles (multi-select) plus a 15-industry drill-down list
- Per-parcel popup with owner, county, address, acres, assessed value, and a direct link to the county assessor record
- All statistics computed live from the loaded GeoJSON — no precomputation
- No tracking, no API keys, no third-party tokens

## Note on vintage

Parcel attributes are a 2022-02-15 snapshot from the Washington State Geospatial Open Data Portal and county assessors. The 2026 refresh is the visualization layer — pipeline, filtering, drawer UX, satellite basemap, and the concentration analysis. The original 2022 capstone is preserved unchanged in separate repos as an artifact.
