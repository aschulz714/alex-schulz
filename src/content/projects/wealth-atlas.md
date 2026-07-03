---
title: The Wealth Atlas
blurb: Six Washington counties, 1,749 high-value homes, and one question — how did the people who own them actually get the money?
description: An academic study of wealth formation grounded in property records instead of surveys — every mansion above a threshold in six counties, resolved to an owner, traced to a source of wealth.
category: geospatial
year: 2026
tech:
  - Python
  - County parcel APIs
  - Deed records
  - Leaflet
  - AI-agent orchestration
status: 'Six counties complete; pipeline now portable to any US county'
artifact:
  label: Interactive maps
  detail: A county-by-county atlas of high-value homes with owner identification rates of 81–93%, plus a portable pipeline validated in ten enclaves across six states.
caseStudy:
  question: How do people actually become wealthy — not in survey averages, but house by house, name by name?
  data: Assessor parcels, deed histories, LLC registries, and public records across King, Snohomish, Whatcom, Skagit, San Juan, and Chelan counties.
  method: Sweep every parcel above a value threshold, resolve owners through parcel and deed records, crack LLC shells via the names on prior sales, then classify each household's source of wealth from public evidence.
  signal: Every county has a distinct wealth signature — and opacity concentrates at the apex; the more valuable the home, the more likely its owner hides behind an entity.
  why: Wealth formation is usually studied through surveys and anecdotes. Property records are the one place it is written down, parcel by parcel, for anyone rigorous enough to read them.
featured: true
---

## The design

Take a county. Pull every home above a wealth threshold ($10M in King County — 669 homes; $3M in the five smaller counties — 1,080 more). Resolve who owns each one, including the ones held through LLCs and trusts. Then answer the only question that matters: where did the money come from?

## What six counties revealed

Each county turned out to have its own signature. King County's apex is technology wealth. Snohomish skews construction and maritime — the money that built the region, not the money that disrupted it. Whatcom is led by medicine, with a legacy industrial dynasty and cross-border opacity mixed in. Skagit's waterfront wealth is largely imported retirement money — California oil, Arizona, Montana. The San Juans hold nearly $2 billion of home value on islands with no traffic lights: Seattle dynasties, billionaires' trophy properties, the wealthiest-per-capita and most entity-shielded county in the sweep. Chelan is Seattle tech wealth on a resort lake, stacked over apple-orchard fortunes hidden in commercial and agricultural parcels.

Two structural findings held everywhere. Owner identification is achievable at 81–93% from public records alone — and the residual opacity is not random. It concentrates at the very top: the most valuable properties are the most likely to be wrapped in LLCs and trusts, and cracking those shells (usually through the names left behind on prior deeds) is where the real method lives.

## The portable version

The six-county method has since been generalized: a pipeline that can run the same study in any US county, built on the national parcel-coverage atlas, validated in ten wealthy enclaves across six states. The study started as a question about one region; the instrument now works anywhere.
