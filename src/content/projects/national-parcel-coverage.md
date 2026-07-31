---
title: National Parcel Coverage
blurb: A normalized national parcel store assembled from free public sources—122 million records, one schema, explicit provenance, and regression QA.
description: A national data system that acquires, normalizes, validates, and maintains parcel records from fragmented county and state government sources.
category: data-systems
projectType: data-system
year: 2026
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
  - 122,097,430 parcel records
  - 2,298 counties across 51 jurisdictions
  - Approximately 95% owner and 99.6% geometry coverage
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
  signal: More than 122 million parcels can be assembled across 2,298 counties, while the remaining gaps reveal where access, licensing, and vendor portals create the commercial moat.
  why: The system converts thousands of inconsistent local sources into reusable infrastructure for property, ownership, industrial, and geospatial research.
featured: true
featuredRank: 2
---

## The system

The current build is a local, normalized national parcel store: one GeoParquet per county, one shared schema, standardized owner and land-use fields, explicit source provenance, a regression suite, map tiles, and hash-verified backup. It contains more than 122 million records across 2,298 counties.

The live resolver remains a second layer. Give it a coordinate or address and it routes the request to the best available public endpoint for that county. The project records an honest method for every US county-equivalent, including the places where a free owner answer is not available.

The two layers reinforce each other: the bulk store supports national analysis, while the live resolver exposes the boundary between public coverage and vendor-gated access.

## What the resolver says

- **100% recorded.** Every county-equivalent in all 50 states, DC, and Puerto Rico has a documented resolution method or a documented reason there isn't one.
- **72.8% resolvable.** 2,344 counties expose a free, public owner endpoint — each one independently re-verified with a live point query, not taken on faith from a directory listing.
- **The ceiling is structural.** The unresolvable ~27% isn't missing data — it's the same ownership data gated behind a handful of commercial portal vendors. That's the real boundary between free and paid in American land records, drawn county by county.

## How it was actually done

Fleets of directed AI agents probed states in parallel; every promising endpoint they surfaced was then re-verified independently before being routed, because agents oversell and undersell — verification passes personally caught three statewide sources the agents missed entirely (Maine, New Hampshire, and a Puerto Rico tax-roll snapshot covering all 78 municipios) and killed false positives that would have quietly corrupted the atlas. The accounting discipline carried over intact: nothing ships until it reconciles against the source.

## The footnote

This atlas was built on nights and weekends for roughly the cost of an AI subscription. A few years ago I applied to the company that leads this market and never heard back — which turned out to be useful calibration, not a grievance: the distance between "no reply" and "rebuilt the core layer" is shorter than it has ever been, for anyone willing to verify their own work.
