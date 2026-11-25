---
title: Lake Goodwin Ring Search
blurb: A field-search app built in a weekend after a wedding ring went overboard — bathymetry, a drift model from timestamped phone fixes, and a numbered station grid a diver can follow.
description: "A small geospatial field tool built for a real search: fuse a boat's phone fixes and video timestamps into a probable drop line, overlay it on lake bathymetry, and give the search team a station grid and live position on their phones."
category: geospatial
projectType: research
year: 2026
plate: 16
hidden: true
figure:
  src: figures/lake-goodwin-ring.jpg
  alt: Lake Goodwin ring-search app showing depth contours, a numbered station line, and timestamped position fixes over aerial imagery
  caption: Search grid over bathymetry, Lake Goodwin, WA. Stations every 25 m along the modeled heading.
  ratio: '1568/655'
  source: Phone GPS fixes, video timestamps, WA Ecology and 1952 WDFW depth surveys
tech:
  - Leaflet
  - Firebase
  - KML
  - Python
status: Field tool, shipped in 48 hours
role: Designer and builder
scale:
  - 19 numbered search stations along a modeled drift line
  - Two depth surveys fused into one contour layer
  - Live phone positioning for the search crew
proof:
  - Timestamped position fixes reconciled against the video record
  - Station grid exported as KML for the divers' devices
  - Shared state synced across every phone on the water
artifact:
  label: Field search map
  detail: A phone-first Leaflet app with bathymetric contours, a modeled drop line, numbered stations, and shared live positions.
caseStudy:
  question: Where, within a few meters, did a ring leave a moving boat on a lake with no landmarks?
  data: Phone location history from the people aboard, a video with a wall clock, two public depth surveys, and aerial imagery.
  method: Reconcile the fixes and the video into one timeline, model the boat's heading across the loss window, project a search corridor onto the bathymetry, and number stations a diver can work in order.
  signal: A loss window of seconds becomes a corridor of a few hundred meters with a most-likely segment, which is the difference between a search and a guess.
  why: The same reconciliation habit that closes a ledger closes a search area. It is the smallest project on the site and the most personal.
links:
  demo: https://lake-goodwin-ring.web.app
featured: false
---

## What it does

A lake has no landmarks, so a search needs a coordinate system. The app fuses the timestamped phone fixes from the boat with the wall clock visible in a video taken moments after the loss, models the boat's heading through the loss window, and projects a corridor onto the lake's depth contours. Stations are numbered every 25 meters along the corridor so a diver or a magnet line can work them in order and report back by number.

## What it taught

The reconciliation problem was the whole problem. Three phones disagreed by tens of meters. The video's clock was the tiebreaker, and the modeled drift line only became useful once every fix had been argued against that clock. Ship the disagreement, not a false precision.
