---
title: Private Jet Tracker
blurb: Every private jet in the FAA registry, scored for whether a real person is behind the registration, then watched live over ADS-B — and a finding about who actually owns them that looks nothing like a billionaire list.
description: A Flask application that joins the FAA aircraft registry to live ADS-B Exchange positions, logs arrivals and departures by nearest airport, and classifies the wealth source behind each registrant using three offline methods, with a superyacht tracker built the same way.
category: data-systems
projectType: research
year: 2026
plate: 9
figure:
  src: figures/jet-tracker.jpg
  alt: Horizontal bar chart of private jets by the owner's industry, led by trucking and logistics, agriculture, construction, and manufacturing
  caption: Jets whose owner's industry can be read straight from the registration. Trucking, agriculture, construction, and manufacturing lead. Technology is eleventh.
  ratio: '2353/1305'
  source: FAA Aircraft Registry pulled 2026-03-10, classified 2026-09-19
tech:
  - Python
  - Flask
  - ADS-B Exchange API
  - FAA Aircraft Registry
  - SEC company tickers
  - Address linkage
status: Personal tool, not published
role: Designer, builder, and analyst
scale:
  - 310,552 aircraft in the FAA registry; 27,190 jets scored
  - 12,137 jets in scope, $2M+, fleet of three or fewer
  - 3,656 owners identifiable without a paid search, 30.1 percent
proof:
  - Three offline identification methods, each with its false-positive rule written down
  - Public-company filter built from the SEC's free ticker file, 8,031 names
  - Surname corpus of 36,365 tokens mined from 129,612 individual registrations
  - Live arrival and departure log by nearest airport, 762 events in a six-day test window
artifact:
  label: Live tracker + ownership classifier
  detail: A local Flask app with a live map of tracked jets, a scored registry, a wealth-source classification with tiers, and a companion superyacht tracker.
caseStudy:
  question: Who actually owns America's private jets, and can that be answered from public records without paying for an investigator's database?
  data: The FAA Aircraft Registry, the SEC's public company ticker list, ADS-B Exchange positions and traces, an airports table, and the registrants' own filed addresses.
  method: Score every jet for the likelihood of an individual owner, strip out government, charter, institutional, aviation-business, and public-company registrants, then identify the rest three ways, by a readable registrant name, by a surname that appears in the registry's individual filings, and by sharing a street address with an entity that names its industry.
  signal: 30 percent of in-scope jets are identifiable with no paid search. Among them, trucking, agriculture, construction, and manufacturing own more jets than technology or private equity. The distribution is the industrial economy of the interior.
  why: It is the wealth-atlas method pointed at a different registry. Same habit, same finding about opacity, and a result that overturns the obvious assumption.
featured: false
---

## The two halves

The first half is a tracker. A Flask server polls ADS-B Exchange for the jets in a watch list built from the FAA registry, matched on ICAO hex, and logs each arrival and departure against the nearest airport. In a six-day test window in March 2026 it recorded 762 events.

The second half is the question the tracker raised. Most jets are registered to an LLC or a trust, so the watch list was full of shells. Who is behind them?

## The wrong filter, then the right one

The first pass searched only LLC and trust registrations, on the theory that the interesting owners are the ones hiding. That filter turned out to be backwards. Operating businesses register jets under their real trading name as corporations, and the corporation file had been excluded entirely. A Caterpillar dealership in Birmingham, the largest garlic grower in the country, a ready-mix concrete company in Nashville, a carpet maker in Dalton: the wealth source was readable from the registration with zero research. Searching for mystery had selected against the answer.

## Three methods, all offline

- **Public-company filter.** Registrant names matched against the SEC's free ticker list on the normalized name, the suffix-stripped core, and a subsidiary form, with a length rule so a small air charter does not match a listed bus manufacturer.
- **Surname corpus.** Name tokens mined from the registry's 129,612 individual registrations, requiring at least five appearances, so a family aviation LLC is separated from a brand name.
- **Address linkage.** Every registrant in the full registry indexed by street and ZIP. Where a shell shares an address with two to four tenants and one of them names an industry, the shell inherits it. Agent farms and trustee addresses are excluded.

Applied to the 12,137 jets in scope, 3,656 owners resolve without a paid search. The remaining 70 percent are opaque shells that would need web research, and that share is itself the finding about how private aviation is held.

## Where the money comes from

Restricting to owners whose industry is readable and to five-to-sixty-five-million-dollar aircraft in fleets of two or fewer leaves 677 jets. Trucking and logistics leads with 77, then agriculture and ranching, construction, and manufacturing. Technology has 23. Private equity has 27. Texas, California, and Florida lead the geography, with Delaware showing up only as a registration artifact.

## The yacht side

The same method runs against a superyacht ownership database: 1,479 yachts, a median value around 20 million dollars, and owners who typically commit a few percent of their net worth to the boat.

## What is not shown

The tracker logs the movements of real people, and the scored registry names them. None of that leaves the machine. This page carries only the aggregates and the corporate examples that are already public in the registry.
