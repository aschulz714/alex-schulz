---
title: Early Maps, 2020–2022
blurb: The first four web maps, made while learning the craft at night — refineries and pipelines, Fortune 500 headquarters sized by profit margin, green fees across Western Washington, and Pacific County's forest land. All still live.
description: Four maps from the Digital Mapping certificate and the start of the geospatial master's, kept online as a record of where the work began, from a static ArcGIS export to a styled Mapbox parcel choropleth.
category: geospatial
projectType: research
year: 2020
plate: 15
figure:
  src: figures/early-refineries.jpg
  alt: A 2020 map of United States petroleum refineries sized by distillation capacity with crude oil pipelines drawn as dashed lines
  caption: "United States Petroleum Refineries, December 2020. Graduated symbols by distillation capacity, crude pipelines dashed. EIA layers, exported from ArcGIS."
  ratio: '1155/878'
  source: EIA map layers, 2020
gallery:
  - src: figures/early-fortune500.jpg
    alt: A 2021 Leaflet map of Fortune 500 headquarters as proportional circles sized by profit margin
    caption: "Fortune 500 Headquarters sized by profit margin, 2021. Leaflet with a filter by name. The basemap has since gone behind an API key, which is its own lesson."
    ratio: '16/10'
  - src: figures/early-golf.jpg
    alt: A 2022 Leaflet map of Western Washington golf courses colored by green fee with a weekday and weekend selector
    caption: "Green Fees in Western Washington, 2022. Hand-entered fees by day and time, a dropdown to switch, and a note admitting the data was not entirely accurate."
    ratio: '16/10'
  - src: figures/pacific-county-timber.jpg
    alt: Pacific County designated forest land map with a top-owners panel
    caption: "Pacific County Timber, 2021, refreshed 2026. Designated forest land parcels from the county taxlot shapefile, QGIS to TopoJSON to Mapbox GL."
    ratio: '16/7'
tech:
  - ArcGIS
  - Leaflet
  - Mapbox GL JS
  - QGIS
  - Mapshaper + TopoJSON
  - HTML/CSS/JavaScript
status: All four still live
role: Student, then builder
scale:
  - Four maps in two years, each on GitHub Pages
  - From a static export to an interactive, filterable parcel map
proof:
  - United States Refineries, December 2020
  - Fortune 500 Headquarters, spring 2021
  - Pacific County Timber, 2021
  - Western WA Golf, spring 2022
artifact:
  label: Four live maps
  detail: A progression from a static ArcGIS layout to Leaflet interactivity to a Mapbox parcel choropleth built from a county shapefile.
caseStudy:
  question: What did the first two years of learning to make maps actually produce, and what changed from one map to the next?
  data: EIA refinery and pipeline layers, HIFLD Fortune 500 headquarters with revenue and profit, hand-entered green fees for Western Washington courses, and Pacific County's taxlot shapefile.
  method: Each map used the tool the coursework had just introduced. ArcGIS export first, then Leaflet with proportional symbols and a filter, then a dropdown-driven Leaflet map, then a QGIS-to-TopoJSON pipeline rendered in Mapbox GL with a custom style.
  signal: The interesting variable in every map was already a financial one. Capacity, profit margin, price, assessed value. The accounting was there before the geospatial degree was.
  why: Progression is easier to see than to claim. These are the receipts.
links:
  repo: https://github.com/aschulz714
  demo: https://aschulz714.github.io/United-States-Refineries/
embedDemo: false
featured: false
---

## Four maps, in order

**United States Petroleum Refineries, December 2020.** The first one. Every refinery as a graduated symbol by atmospheric distillation capacity in thousands of barrels per day, crude oil pipelines as dashed lines, on EIA layers. A static ArcGIS export, published as a page. [Live](https://aschulz714.github.io/United-States-Refineries/).

**Fortune 500 Headquarters, spring 2021.** Proportional circles sized by profit margin rather than revenue, because margin is the juicier metric. Tech, biotech, tobacco, and banking swell; retail and energy shrink; Walmart, the largest company on the list, is a blip at 2.81 percent. Leaflet, with a type-ahead filter. The CARTO basemap it used now demands an API key, so the page shows a watermark, which is a small lesson in dependencies. [Live](https://aschulz714.github.io/Fortune-500-Headquarters/).

**Pacific County Timber, 2021.** Every parcel classified as designated forest land, from the county's taxlot shapefile through QGIS and Mapshaper into TopoJSON, rendered in Mapbox GL with a custom style. Refreshed in 2026 with a top-owners panel. [Live](https://aschulz714.github.io/Pacific-County-Timber/).

**Green Fees in Western Washington, spring 2022.** Courses colored by green fee, with a dropdown for weekday, weekend, and time of day. The page says plainly that the data was entered by hand and is not entirely accurate. [Live](https://aschulz714.github.io/Western-WA-Golf/).

## What changed

The tools moved from a desktop export to code. The data moved from a downloaded layer to a county shapefile processed in a pipeline. And the honesty moved onto the page itself, in the golf map's note about its own accuracy, which is the habit every later project kept.
