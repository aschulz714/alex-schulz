---
title: Where free parcel data stops
dek: Free public endpoints put 83 percent of US counties in a national parcel store. The other 17 percent is not missing data. It is a business model.
date: 2026-09-23
vertical: parcels
tags:
  - parcel data
  - county assessors
  - public records
figure:
  src: figures/parcel-coverage-us.jpg
  alt: Choropleth of every US county by parcel-record status
  caption: Sage counties are in the store. Terracotta counties publish parcels only through a viewer that has no queryable endpoint. Tan counties have no public source, suppress owner names, or sit in the backlog.
  ratio: '2086/1244'
  source: counties_status.geojson, Jul 2026
frame:
  question: How much of a commercial national parcel layer can be rebuilt from free, public, machine-readable county and state sources, and what exactly is in the part that cannot?
  data: A status record for all 3,221 US county-equivalents, built by probing every county's assessor GIS, statewide cadastre, or regional aggregator, then ingesting what resolved into one normalized store.
  method: Route each county to its best public endpoint (ArcGIS REST, WFS, join views, bulk downloads), verify each route by hand with a point query at the county seat, ingest in bulk, and classify every county that did not resolve by the reason it did not.
  finding: 2,613 of 3,143 counties (83 percent) are in the store, holding 143.9 million parcels. Of the 530 that are not, 493 publish parcels only through a vendor viewer with no endpoint, 28 have no public source at all, 4 suppress owner names at the source, 4 are mapped but not yet ingested, and 1 is unprobed.
  limits: Counts are from the July 2026 status build and the September 2026 method table. Source vintages range from 2017 to 2026 and are not uniform. Owner coverage measures whether the field is populated, not whether it is correct. Puerto Rico's 78 municipios are recorded with a 2018 snapshot but excluded from the store universe. Nothing here was scraped from a viewer.
draft: true
plates:
  - national-parcel-coverage
---

## The question people actually ask

Commercial parcel vendors sell a national layer of every property in the United States with an owner name attached. The pitch is completeness. The question I wanted to answer was simple: how much of that completeness is a service, and how much is just the assembly of records that counties already give away?

The answer turns out to be a number, and the number has a shape.

## What resolves

Out of 3,221 county-equivalents in the country, 78 are Puerto Rico's municipios, which are recorded separately. That leaves 3,143 counties in the store universe. As of the July 2026 build, 2,613 of them are in the store: 83 percent of counties, 143.9 million parcels, normalized to one schema with provenance on every row.

Most of those counties resolve through an ArcGIS REST endpoint the assessor or the state GIS office already runs. A smaller set resolve through WFS, through join views that stitch a geometry layer to a tax-roll table, or through a statewide bulk download. Each route was verified with a real point query before it was trusted, because the agents that probed the endpoints both oversold and undersold what they found.

## What does not, and why

The 530 counties outside the store sort cleanly by cause.

| Reason | Counties |
|---|---|
| Viewer-only portal, no queryable endpoint | 493 |
| No public source exists | 28 |
| Owner suppressed at the source | 4 |
| Source mapped, not yet ingested | 4 |
| Not yet probed | 1 |

The first row is the whole story. Those 493 counties are not hiding their parcels. They publish them through a handful of vendor web viewers that render a map in the browser but expose no endpoint a program can query. The data is public. The access is not. Reaching it means either paying the vendor or defeating the viewer's bot protection, and the second option is both a terms-of-service problem and a bad way to build anything durable.

That is the moat. It is roughly 17 percent of counties, concentrated in a few states, and it is what a commercial vendor is selling when it sells completeness.

## The live layer is a different number

The store is one thing. A live owner lookup at a coordinate is another. 2,363 counties answer a live point query today, which is 73 percent of the 3,221. The gap between 73 and 83 is mostly counties whose bulk file could be ingested but whose live endpoint is slow, rate-limited, or gone. For most uses the store is the right layer. For anything that needs the record as of this minute, the live count is the honest one.

## What this is for

A free 83 percent is enough to answer most questions about land ownership at national scale, as long as the question does not require the last 17 percent to be uniform. The wealth studies on this site, the rail-served inventory, and the facility-resolution work in Item2 all run on it.

What it is not is a substitute for a commercial layer where completeness is the product. I built it to find out where the line is. The line is at 83 percent, and the reason is a viewer.
