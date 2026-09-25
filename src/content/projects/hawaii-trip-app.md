---
title: Hawaii 2026 Trip App
blurb: A collaborative trip-planning and photo-sharing PWA built for one family trip — an itinerary on a map, geotagged photos from everyone's phones, comments, push notifications, and a two-PIN access model instead of accounts.
description: A React and Firebase progressive web app for a small group on one trip. An editor plans stops on a Leaflet map with Google Places autocomplete; everyone uploads photos that auto-locate from EXIF, comments, and gets push notifications. Anonymous auth plus a guest PIN and a server-verified editor PIN replace user accounts.
category: product
projectType: product
year: 2026
plate: 15
figure:
  src: figures/hawaii-trip-app.svg
  alt: Schematic of the trip app, three phone views feeding Firestore and Cloud Storage, with Cloud Functions fanning out push notifications and a guest PIN and editor PIN gating access
  caption: "How the app is put together. Photos are personal and stay in the app; this page shows the architecture, not the trip."
  ratio: '1600/760'
tech:
  - React 19 + TypeScript
  - Vite 7 + Tailwind v4
  - Leaflet + marker clustering
  - Firebase (Firestore, Storage, Functions, Messaging)
  - Google Places API v1
  - PWA share target
status: Private, in use
role: Designer and builder
scale:
  - Three views, map, list, photos, on one shared trip
  - Four Cloud Functions, two for push fan-out, one cleanup, one PIN check
  - Seven itinerary categories, EXIF auto-location, offline upload queue
proof:
  - Editor PIN verified server-side by a callable function that whitelists the device
  - Firestore and Storage rules enforce editor-only writes, comment field constraints, and a 5 MB image cap
  - Web Share Target lets a phone send a photo straight from the OS share sheet
  - Auto-deployed to Firebase Hosting from GitHub Actions on every push
artifact:
  label: Installable PWA
  detail: A map-first trip companion that a small group installs on their phones, with an editor mode for planning and an open mode for photos and comments.
caseStudy:
  question: Can a family trip run on one shared app that everyone can install in a minute, without accounts, and still keep planning under control?
  data: Itinerary stops with category, date, and location; photos with EXIF coordinates and timestamps; comments; device push tokens.
  method: Anonymous sign-in on load, a guest PIN for viewing, an editor PIN checked by a Cloud Function that adds the device to a whitelist, Firestore rules that back the same model, and a service worker that handles installs, offline uploads, and the share sheet.
  signal: The access model is the interesting part. Two PINs and a server-side whitelist do the job of user accounts for a private group, and the same idea generalizes to any small shared tool.
  why: Most of my work is data pipelines. This is the product side, built end to end for people who would tell me immediately if it was annoying.
featured: false
---

## What it does

One trip, one shared app. Three views switch from a bottom nav on phones or a toggle on desktop. The map shows clustered markers for itinerary stops and photos, biased to Oahu, with a fly-to animation from the list. The list is the itinerary as cards, sortable, each with a category, a date, a description, and a completed flag. The photo view is a gallery with upload, captions, a lightbox that groups photos within about 500 meters of each other, and per-photo comments.

Stops are added by tapping the map in edit mode or through Google Places autocomplete. Photos come from the gallery or straight from the phone's share sheet through the PWA's Web Share Target. EXIF gives each photo its coordinates and timestamp; photos without GPS can be placed by tapping the map. Images are compressed on the device before upload, and an offline queue in IndexedDB holds pending uploads across reloads and dead spots.

## The access model

There are no user accounts. Everyone is signed in anonymously on load, which is enough to read and to comment. A guest PIN gates viewing. A separate editor PIN grants write access, and it is checked server-side: entering edit mode calls a Cloud Function that verifies the PIN hash and adds the device's identity to an editor whitelist, so anyone who knows the PIN can promote a new phone without anyone editing the database by hand. Firestore and Storage rules enforce the same split, with comments constrained to an exact field set and photos capped at five megabytes.

## What runs in the cloud

Four functions. Two fan out push notifications on new photos and new comments to every subscribed device, skipping the device that posted and pruning tokens that fail. One cleans up a photo's comments when the photo is deleted. One is the editor PIN check. Deploys happen from GitHub Actions on every push to main.

## What is not shown

The photos and the itinerary are a family's trip. The figure on this page is the architecture, and the app itself stays behind its PIN.
