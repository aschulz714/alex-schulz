---
title: Rail-Served Parcels, National
blurb: The Washington inventory, taken national — 26,974 rail-served parcels across 49 states and DC, screened for investability, with owners, occupants, serving railroads, and commodity research carried per parcel with provenance.
description: A national parcel discovery and enrichment pipeline that finds every parcel with private rail access, enriches it with owner, occupant, railroad, capacity, and commodity evidence, and holds the whole snapshot to a strict validator with rollback.
category: data-systems
projectType: data-system
year: 2026
plate: 6
figure:
  src: figures/rail-served-national.jpg
  alt: Map of the United States with each state shaded by its count of rail-served parcels in the national inventory
  caption: Rail-served parcels by state, September 2026 snapshot. Counts only. The parcel-level data stays unpublished until source rights are resolved.
  ratio: '2086/1244'
  source: rail_master_national.csv, 2026-09-18
tech:
  - Python
  - GeoParquet parcel store
  - BTS NARN rail network
  - Google Places API
  - Imagery review
  - pytest + strict snapshot validator
status: Active; publication gated on source rights
role: Architect, builder, and the person who signs the owner corrections
scale:
  - 26,974 parcels, 49 states and DC
  - 14,565 investable, 6,703 core screen
  - 292 researched by hand, 144 classified
proof:
  - Strict validator checks identity, schema, numeric sanity, and map drift on every snapshot
  - Every apply step takes a recovery bundle and rolls back on failure
  - "Owner audit sampled 100 core parcels against the counties: 89 matched, 0 held by an unrelated party"
  - "Owner provenance stamped on every row: source, field name, and retrieval date"
artifact:
  label: National inventory + pipeline
  detail: A 26,974-row master with points and polygons, a guarded refresh workflow, a commodity-research ledger, and a Pacific Northwest application held back until publication rights clear.
caseStudy:
  question: Where in the United States does freight rail cross private property, who owns those parcels, and which of them could a buyer actually use?
  data: The national parcel store, the BTS rail network, county assessor rolls, Google Places, satellite imagery, and per-parcel web research with citations.
  method: Intersect parcels with rail centerlines nationally, bind each hit to a stable identity with point and polygon geometry, enrich with owner, occupant, railroad class, and estimated car spots, stamp a rules-based core screen, then research the top of the ranking by hand and record every finding with a source.
  signal: Rail access is fixed inventory. About a quarter of rail-served parcels pass a basic investability screen, and only a small fraction of those have a confirmed shipper on site. The gap between mapped track and working rail service is the finding.
  why: It is the Washington project run at national scale with the controls an accountant would demand, which is what makes the data usable rather than merely large.
embedDemo: false
featured: false
---

## From one state to fifty

The Washington inventory answered a question for one state. The national version asks it everywhere: 26,974 parcels across 49 states and DC where a rail spur crosses the property line, each bound to a stable identity with matching point and polygon geometry, and every snapshot held to a strict validator before it can be written.

## What enrichment means here

A rail-served parcel is only interesting if someone could use it. The pipeline layers evidence on each row: the owner and its provenance, the occupant from assessor rolls or Google Places, the serving railroad and its class, the on-site track length and an estimate of car spots, and a commodity group where the evidence supports one. A rules-based core screen then ranks the set: investable, single-site owner, five or more car spots. As of September 2026, 14,565 parcels pass the investability heuristic and 6,703 meet the core screen.

The last mile is human. The highest-ranked parcels are researched one at a time, and a classification is refused unless it carries a URL and a quote. Of the first 292 researched, 144 were classified, 21 turned out to be railcar, locomotive, or terminal businesses rather than shippers, 24 were closed or vacant, and 13 had track removed or cut off. Mapped track does not establish current rail service, and the research ledger says so parcel by parcel.

## Controls

Every step that changes the master takes a recovery bundle and rolls back on failure. Owner corrections go through prepare, verify, rehearse, authorize, and apply, with an authorization record and a transaction lock. A 100-parcel owner audit against the county sources found 89 matches and no parcel held by an unrelated party. The test suite covers rollback, activation locks, and showcase privacy.

## Why it is not published yet

The Pacific Northwest application holds 2,196 records whose source rights are unresolved, and the publication build fails closed on that condition by design. Until those rights clear, the map stays local and this page shows counts.
