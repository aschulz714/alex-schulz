---
title: Pacific County Timber
blurb: Mapping designated forest land parcels in Pacific County, Washington.
description: A choropleth web map of Designated Forest Land parcels in Pacific County, WA — shapefile-to-TopoJSON pipeline, MapBox GL JS rendering, and custom MapBox Studio styling.
category: geospatial
year: 2021
tech:
  - QGIS
  - Mapshaper
  - MapBox GL JS
  - TopoJSON
  - HTML/CSS
links:
  repo: https://github.com/aschulz714/Pacific-County-Timber
  demo: https://aschulz714.github.io/Pacific-County-Timber/
featured: false
---

## What it does

An interactive web map of parcels in Pacific County, Washington classified as "88 — Designated Forest Land" — a tax-status category with real consequences for how much of the Pacific Northwest coastal shelf stays in timber. Each parcel is clickable, styled against a custom MapBox Studio basemap.

## Pipeline

1. Load the County's Taxlot (Parcels) shapefile in QGIS 3.14.
2. Filter by department code `88 — Designated Forest Land Parcels`.
3. Export to GeoJSON → reduce line intersections in Mapshaper → export TopoJSON.
4. Render with MapBox GL JS against a custom MapBox Studio style.

## What I learned

- The GIS pipeline is worth internalizing start to finish — you learn where the file-size and rendering costs really live.
- "Make a map" is a verb with a lot of surface area: source the data, clean it, filter it, simplify it, style it, ship it.
- This is an early project I plan to revisit — the current version works, but the new generation of tools (MapLibre, pmtiles, Protomaps) makes a cleaner rebuild very cheap.
