---
title: National Parcel Coverage
blurb: A normalized national parcel store assembled from free public sources — 143.9 million records across 2,613 counties, one schema, explicit provenance, and regression QA.
description: A national data system that acquires, normalizes, validates, and maintains parcel records from fragmented county and state government sources.
category: data-systems
projectType: data-system
year: 2026
plate: 1
figure:
  src: figures/parcel-coverage-us.jpg
  alt: Choropleth of every US county by parcel-record status, in the bulk store, viewer-only portal, or no public source
  caption: Owner-resolution status for 3,221 county-equivalents. Sage in the store, terracotta viewer-only, tan no public source.
  ratio: '2086/1244'
  source: counties_status.geojson, Jul 2026
tech:
  - Python
  - GeoParquet
  - ArcGIS REST
  - DuckDB
  - Cloudflare R2
  - AI-agent orchestration
status: Active national data system
role: Product architect, AI-directed developer, and final verifier
scale:
  - 143,955,093 parcel records in the store
  - 2,613 of 3,143 counties ingested (83%); 2,364 of all 3,221 county-equivalents answer a live owner query
  - Owner populated on 84% of parcels (parcel-weighted), geometry ~99.6%
proof:
  - Normalized county GeoParquet files with a shared schema
  - Per-county manifest, provenance, and populated-field metrics
  - Regression QA for row loss, owner wipes, duplicate APNs, and geometry sanity
  - Endpoint health checks and hash-verified cold-storage backups
artifact:
  label: National data system
  detail: A normalized parcel store, live owner resolver, QA suite, coverage catalog, map tiles, and maintenance tooling.
caseStudy:
  question: How much of a commercial national parcel layer can be rebuilt from free public government sources?
  data: County assessors, statewide cadastres, ArcGIS REST services, WFS endpoints, tax rolls, and regional GIS servers.
  method: Route each county to its best source, acquire in bulk, normalize to one schema, reconcile counts and coverage, standardize owners and land use, then preserve provenance and test for regressions.
  signal: More than 143 million parcels can be assembled across 2,613 counties, while the remaining gaps reveal where access, licensing, and vendor portals create the commercial moat.
  why: The system converts thousands of inconsistent local sources into reusable infrastructure for property, ownership, industrial, and geospatial research.
links:
  repo: https://github.com/aschulz714/us-parcel-coverage
  demo: https://aschulz714.github.io/us-parcel-coverage/
embedDemo: false
featured: true
featuredRank: 2
---

## The system

The current build is a local, normalized national parcel store: one GeoParquet per county, one shared schema, standardized owner and land-use fields, explicit source provenance, a regression suite, map tiles, and hash-verified backup. It contains more than 143 million records across 2,613 of the 3,143 counties in the 50 states and DC. Puerto Rico's 78 municipios are recorded by the resolver but are not in the store, which is why the resolver counts 3,221 county-equivalents.

The live resolver remains a second layer. Give it a coordinate or address and it routes the request to the best available public endpoint for that county. The project records an honest method for every US county-equivalent, including the places where a free owner answer is not available.

The two layers reinforce each other: the bulk store supports national analysis, while the live resolver exposes the boundary between public coverage and vendor-gated access.

## What the resolver says

- **100% recorded.** Every county-equivalent in all 50 states, DC, and Puerto Rico has a documented resolution method or a documented reason there isn't one.
- **73.4% resolvable.** 2,364 of those 3,221 county-equivalents expose a free, public owner endpoint — each one independently re-verified with a live point query, not taken on faith from a directory listing.
- **The ceiling is structural.** The unresolvable ~27% isn't missing data — it's the same ownership data gated behind a handful of commercial portal vendors. That's the real boundary between free and paid in American land records, drawn county by county.

## How it was actually done

Fleets of directed AI agents probed states in parallel; every promising endpoint they surfaced was then re-verified independently before being routed, because agents oversell and undersell — verification passes personally caught three statewide sources the agents missed entirely (Maine, New Hampshire, and a Puerto Rico tax-roll snapshot covering all 78 municipios) and killed false positives that would have quietly corrupted the atlas. The accounting discipline carried over intact: nothing ships until it reconciles against the source.

## What it cost

The market leader's 2023 price list started a nationwide license at $50,000 a year. This atlas was built on nights and weekends for roughly the cost of an AI subscription.
