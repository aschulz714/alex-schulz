---
title: Private Trip Sharing
blurb: A private trip app built for one family vacation, used again for a second, and now being rebuilt as a product. An itinerary on a map, everyone's photos and comments, push notifications, and PINs instead of accounts.
description: A React and Firebase progressive web app that started as a family's private trip companion, for Hawaii in April 2026 and Palm Springs that November, and is now being rebuilt as a product anyone can use, with one private link per trip and no accounts for the people following along.
category: product
projectType: product
year: 2026
plate: 15
figure:
  src: figures/hawaii-trip-app.svg
  alt: Schematic of the trip app, three phone views feeding Firestore and Cloud Storage, with Cloud Functions fanning out push notifications and a guest PIN and editor PIN gating access
  caption: "How the family app is put together. Photos are personal and stay in the app; this page shows the architecture, not the trip."
  ratio: '1600/760'
tech:
  - React 19 + TypeScript
  - Vite 7 + Tailwind v4
  - Leaflet + marker clustering
  - Firebase (Firestore, Storage, Functions, Messaging)
  - Google Places API v1
  - PWA share target
status: Family app in use; product in pilot
role: Designer and builder
scale:
  - 'Two family trips: 60 and 38 photos, 36 and 44 comments'
  - 'Seven Cloud Functions in the family app: push fan-out, cleanup, PIN checks, PIN setters'
  - Product pilot running since November 2026, not yet public
proof:
  - Guest and editor PINs verified server-side by callable functions that let the device in
  - Firestore and Storage rules enforce viewer-only reads, editor-only writes, comment field constraints, and a 5 MB image cap
  - Web Share Target lets a phone send a photo straight from the OS share sheet
  - PIN hashes kept where no client can read them, and wrong guesses are capped
artifact:
  label: Installable PWA
  detail: A map-first trip companion that a small group installs on their phones, with an editor mode for planning and a guest mode for photos and comments.
caseStudy:
  question: Can a family trip run on one shared app that everyone can open in a minute, without accounts, and can the same idea work for anyone's trip?
  data: Itinerary stops with category, date, and location; photos with EXIF coordinates and timestamps; comments; device push tokens.
  method: Anonymous sign-in on load, a guest PIN and an editor PIN each checked by a Cloud Function that lets the device in, Firestore and Storage rules that back the same model, and a service worker that handles installs, offline uploads, and the share sheet.
  signal: The access model is the interesting part. Two PINs and a server-side whitelist do the job of user accounts for a private group, and the same idea generalizes to any small shared tool.
  why: Most of my work is data pipelines. This is the product side, built end to end for people who would tell me immediately if it was annoying. They asked for more.
featured: false
---

## From a family app to a product

I built the app for a family trip to Hawaii in April 2026 and used it again for Palm Springs that November. The comments came from parents, siblings, and friends following along at home, and the people who used it asked for a version they could use for their own trips.

So in November I started rebuilding it as a product anyone can use. An organizer signs in and starts a trip. Everyone else gets one private link and a PIN, with no account. A pilot has been running since November 22, 2026, with separate guest and editor PINs, push notifications when photos and comments land, and controls to remove a person, replace a leaked link, or delete a trip.

Early in the build, the written App Store reviews of the closest existing app were coded by theme. Failed uploads were the most common complaint, so the product saves every picked photo on the phone before it sends any. The product's name and address come at launch.

## What the family app does

Each trip gets one shared app. Three views switch from a bottom nav on phones or a toggle on desktop. The map shows clustered markers for itinerary stops and photos, centered on the trip, with a fly-to animation from the list. The list is the itinerary as cards, sortable, each with a category, a date, a description, and a completed flag. The photo view is a gallery with upload, captions, a lightbox that groups photos within about 500 meters of each other, and per-photo comments.

Stops are added by tapping the map in edit mode or through Google Places autocomplete. Photos come from the gallery or straight from the phone's share sheet through the PWA's Web Share Target. EXIF gives each photo its coordinates and timestamp; photos without GPS can be placed by tapping the map. Images are compressed on the device before upload, and an offline queue in IndexedDB holds pending uploads across reloads and dead spots.

## The access model

There are no user accounts. Everyone is signed in anonymously on load, but that alone reads nothing. The guest PIN is checked server-side: a Cloud Function verifies its hash and records the device as a viewer, and only then do the database and storage rules let it see the trip or comment. A separate editor PIN grants write access the same way: entering edit mode calls a Cloud Function that verifies the PIN hash and adds the device's identity to an editor whitelist, so anyone who knows the PIN can promote a new phone without anyone editing the database by hand. Both hashes sit where no client can read them, wrong guesses are capped, and an editor can change either PIN from inside the app. Firestore and Storage rules enforce the same split, with comments constrained to an exact field set and photos capped at five megabytes.

## What runs in the cloud

Seven functions. Two fan out push notifications on new photos and new comments to subscribed devices that have been let in, skipping the device that posted and pruning tokens that fail. One cleans up a photo's comments when the photo is deleted. Two check the guest and editor PINs, and two let an editor change them. Deploys are run by hand from the Firebase CLI.

## What is not shown

The photos and the itinerary are a family's trips. The figure on this page is the architecture, and the app itself stays behind its PIN. The product pilot isn't linked here until it launches under its own name.
