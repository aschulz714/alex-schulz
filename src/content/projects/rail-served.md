---
title: Rail-Served Properties
blurb: A database and web map of rail-served industrial properties in Washington State.
description: A geospatial database and interactive web map of industrial properties served by rail across Washington State, including notable sites like the Bangor Trident Base and the Boeing Everett plant.
category: geospatial
year: 2022
tech:
  - MapBox GL JS
  - GeoJSON
  - HTML/CSS
links:
  repo: https://github.com/aschulz714/rail-served-wa
  demo: https://aschulz714.github.io/rail-served-wa/
featured: true
---

## What it does

A searchable database and interactive map of every rail-served industrial property in Washington State. Each parcel has a pop-up with ownership, track operator, use, and imagery; the basemap toggles between street and satellite views.

## Why it matters

Rail-served real estate is a niche but strategically important corner of commercial property — and there was no consolidated public record of it. The map pulls together Navy installations (including the Bangor Trident Base, one of only two Trident submarine bases in the U.S.), industrial anchors like Boeing Everett (served by the steepest railroad grade in North America), and hundreds of smaller sites.

## What I learned

- Data cleaning and geocoding are 80% of any "build a database" project.
- Custom MapBox styling takes a site from "school project" to "professional tool."
- A new version is actively in progress — the current site is the 2022 iteration; v6 is TypeScript-based and more comprehensive.
