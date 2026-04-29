---
title: Item2
blurb: Real-world signals from underfollowed assets — tracking physical activity around micro- and small-cap public companies.
description: Item2 is a geospatial intelligence platform that surfaces operational signals from satellite imagery and physical-world data before they hit filings or news.
category: geospatial
year: 2026
tech:
  - Python
  - Docker
  - PostgreSQL
  - Alembic
  - Satellite imagery
links:
  demo: https://item2.io
featured: true
---

## What it does

Item2 watches the physical world around publicly traded micro- and small-cap companies and turns that observation into a stream of operational signals — plant activity, shipping volume, land use, build progress — delivered before the story reaches filings or press.

## Why it matters

Large-cap companies get bathed in analyst coverage. Small- and micro-caps don't. That coverage gap is where real information asymmetry lives — and satellite imagery plus modern geospatial tooling is finally cheap enough to close it for one operator at a time.

## What I'm learning

- The geospatial pipeline — Sentinel-2, Google Earth Engine, time-series alignment — is where my MS finally earns its keep.
- Dockerized infrastructure, Alembic migrations, a real backend: the craft layer I kept picking at has become the product layer.
- The accounting discipline stays in the loop: if a signal doesn't reconcile against the source, it doesn't ship.
