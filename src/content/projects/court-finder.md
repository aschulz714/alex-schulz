---
title: NAIP Court Finder
blurb: Meta's SAM 3, prompted with the words "tennis court," run over federal aerial imagery of four Eastside pilot areas, filtered by real-world geometry, and joined to King County parcels for human review.
description: A computer-vision pilot that finds tennis and pickleball court candidates in 2023 NAIP aerial imagery with Segment Anything 3 text prompts, filters the masks by size, aspect ratio, and rectangularity, suppresses duplicates across tiles, joins survivors to tax parcels, and hands the result to a reviewer.
category: geospatial
projectType: research
year: 2026
plate: 9
figure:
  src: figures/court-finder.jpg
  alt: 2023 aerial imagery of a public park with dashed white outlines for raw SAM 3 masks and solid red outlines for the court candidates that survived the geometry filters
  caption: "Raw SAM 3 masks (dashed) versus retained candidates (red) on a public parcel, a school campus. The model proposes; the geometry filters and a person decide."
  ratio: '16/10'
  source: 2023 NAIP via the federal GeoPlatform ImageServer; King County parcels
tech:
  - SAM 3 (text prompts)
  - SAM 2.1 + CLIP fallback
  - NAIP ImageServer
  - GeoPandas
  - PyTorch
  - pytest
status: Pilot, four areas complete
role: Designer and builder
scale:
  - Four pilot areas on 2023 NAIP, 1008-pixel overlapping tiles
  - 381 raw masks became 122 candidates after filtering, three of the four areas
  - Candidates joined to 71 tax parcels, public parcels excluded
proof:
  - Real-world size, aspect-ratio, and rectangularity filters on every mask
  - Duplicate suppression across prompts and tile boundaries
  - Parcel IDs stored, owner names never stored, by design
  - Test suite covers detection, parcel join, STAC access, and the review map
artifact:
  label: Detection pipeline + review map
  detail: A command-line pipeline from imagery request to GeoJSON, with an interactive review map for confirming or rejecting each candidate.
caseStudy:
  question: Can a foundation vision model find private sports courts in free aerial imagery well enough to be useful, and where does it need a person?
  data: 2023 NAIP imagery at sub-meter resolution, King County parcel and public-parcel layers, and the SAM 3 and SAM 2.1 checkpoints.
  method: Crop the imagery, run SAM 3 with a text prompt on overlapping tiles, keep only masks whose real-world size and shape match a court, drop duplicates, join to parcels, exclude public land, and review the rest by hand.
  signal: Roughly two-thirds of raw masks fail the geometry filters. What survives is a short, reviewable list rather than a detection score, which is the useful output.
  why: The same parcel join that resolves owners nationally can be pointed at what sits on the land. This is the smallest version of that idea, and it is honest about the human step.
featured: false
---

## What it does

The pipeline starts with a bounding box and ends with a review map. It requests 2023 NAIP imagery from the federal ImageServer, crops it to an RGB GeoTIFF, and runs Segment Anything 3 with the text prompt "tennis court" on overlapping 1008-pixel tiles. SAM proposes masks. The pipeline then measures each mask in meters, keeps the ones whose area, aspect ratio, and rectangularity look like a court, suppresses duplicates across prompts and tile edges, and joins the survivors to King County tax parcels. Public parcels are excluded when that layer is supplied.

## Why the filters matter

Across the three pilot areas that kept their raw output, 381 raw masks became 122 candidates. The rejected two-thirds were roofs, driveways, pool decks, and parking bays with the right color and the wrong geometry. A pickleball court in sub-meter imagery can be a handful of pixels, so the pipeline treats SAM as a candidate generator and the geometry filters as the first reviewer. The last reviewer is a person, with a status recorded per candidate.

## Two backends

SAM 3 accepts text prompts but needs gated checkpoint access and a recent GPU stack. The default public backend is SAM 2.1 Small with automatic masks, followed by a CLIP pass that suppresses roof, pool, driveway, parking-lot, and tree-canopy look-alikes. Both backends feed the same geometry filters and the same review map.

## What is not published

The pilot areas are residential, and the point of the join is that a court sits on a specific parcel. The project stores parcel identifiers and never owner names, and the figure above is a public school campus. No residential candidate is shown or listed on this site.
