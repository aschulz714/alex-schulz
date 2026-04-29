---
title: Satellite Commodities
blurb: Satellite-derived signals for under-covered commodity markets — sawmills, citrus, and the operational data hiding in plain sight.
description: A research site built on free public imagery and Google Earth Engine, analyzing operational activity at 18 PNW/BC sawmills and 8 Florida citrus counties using Sentinel-2 optical and NDVI data.
category: geospatial
year: 2026
tech:
  - Google Earth Engine
  - Sentinel-2
  - NDVI
  - Python
links:
  repo: https://github.com/aschulz714/satellite-commodities
  demo: https://aschulz714.github.io/satellite-commodities/
featured: true
---

## What it does

A public-facing research project that takes freely available satellite imagery — Sentinel-2 optical for industrial sites, NDVI for agricultural — and turns it into operational signals for markets that analysts rarely touch. Two pilots:

- **18 PNW & British Columbia sawmills** tracked from Jan 2020 to Feb 2025 using Sentinel-2 optical.
- **8 Florida citrus counties** tracked across 91 USDA report windows from 2018 to 2026 using NDVI.

## Why it matters

The commodities world runs on expensive, subscription-only intelligence. But much of the same information — mill activity, crop vigor, shipment cycles — is visible from space for free, if you know what you're looking at. This is the proof-of-concept that spun into [Item2](/#project-item2).

## What I learned

- Google Earth Engine is the right tool when you need decades of global coverage without hosting a single pixel yourself.
- The hard part isn't the imagery — it's the ground truth. USDA reports anchor the citrus work; site-specific operational knowledge anchors the sawmill work.
- Presentation matters: the same analysis looks authoritative in the right layout and sketchy in the wrong one.
