/**
 * Headline figures for the home page.
 * Every number here was recomputed from the built project files on 2026-09-23:
 *  - national-parcel-coverage/output/counties_status.geojson (built 2026-07-18)
 *  - national-parcel-coverage/src/county_methods.csv (2026-09-14, alias rows excluded)
 * Update the source files first, then these values.
 */
export const siteStats: [string, string][] = [
  ['143.9M', 'parcels normalized to one schema'],
  ['2,613', 'counties in the bulk store'],
  ['2,363', 'counties with a live owner query'],
  ['3,221', 'county-equivalents recorded'],
];

export const heroFigure = {
  src: 'figures/parcel-coverage-us.jpg',
  alt: 'Choropleth of every US county colored by whether its parcel records are in the bulk store, gated behind a viewer-only portal, or unavailable from any public source',
  caption:
    'Owner-resolution status for every US county-equivalent. Puerto Rico\'s 78 municipios are recorded but excluded from the store universe.',
  ratio: '2086/1244',
  source: 'counties_status.geojson · Jul 2026',
};

/** Legend swatches must match the colors in scripts that render the hero figure. */
export const heroLegend: [string, string][] = [
  ['#4f6f5a', 'In the bulk store · 2,613'],
  ['#c8845f', 'Viewer-only portal, no endpoint · 493'],
  ['#cfc6ad', 'No public source, suppressed, or backlog · 37'],
];
