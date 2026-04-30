import { HOME_COORDS } from './timeline';

export interface HeroPlace {
  label: string;
  note: string;
  coords: [number, number];
  zoom: number;
}

export interface ProofPillar {
  label: string;
  title: string;
  body: string;
  proof: string;
}

export interface Note {
  lead: string;
  body: string;
}

export const heroPlaces: HeroPlace[] = [
  {
    label: 'Lake Stevens / Everett',
    note: 'Home base, operating lens, and the place the work keeps returning to.',
    coords: HOME_COORDS,
    zoom: 8.4,
  },
  {
    label: 'Custer',
    note: 'The family dairy-farm map on the porch: industry, land, and memory in one artifact.',
    coords: [-122.6437, 48.9168],
    zoom: 11,
  },
  {
    label: 'Honolulu',
    note: 'Born in Honolulu; Hawaii roots run through the long version.',
    coords: [-157.8583, 21.3069],
    zoom: 10.2,
  },
  {
    label: 'San Antonio',
    note: 'Trinity University, the detour before the accounting comeback.',
    coords: [-98.4936, 29.4241],
    zoom: 10,
  },
  {
    label: 'Pullman',
    note: 'WSU accounting foundation, summa cum laude, and the CPA path.',
    coords: [-117.1796, 46.7298],
    zoom: 10,
  },
  {
    label: 'Seattle',
    note: 'Vulcan, family-office finance, and North Kai founded from here.',
    coords: [-122.3321, 47.6062],
    zoom: 10.5,
  },
  {
    label: 'Snoqualmie',
    note: 'Twin Peaks production accounting in Washington.',
    coords: [-121.8252, 47.5452],
    zoom: 11,
  },
  {
    label: 'Denver',
    note: 'GEOINT Symposium and the BlackSky thread.',
    coords: [-104.9903, 39.7392],
    zoom: 10,
  },
];

export const proofPillars: ProofPillar[] = [
  {
    label: '01 / Accounting',
    title: 'Financial judgment with source discipline.',
    body: 'CPA training means the signal has to reconcile: filings, ledgers, operational reality, and the story management tells all need to line up.',
    proof: 'Vulcan, McCaw family office, development accounting, production accounting.',
  },
  {
    label: '02 / Geospatial',
    title: 'A way to see operations before they are reported.',
    body: 'Satellite imagery, parcel data, rail networks, and land-use records turn physical activity into analyzable evidence.',
    proof: 'UMD GEOINT, UK Digital Mapping, rail_served, satellite commodities.',
  },
  {
    label: '03 / Builder',
    title: 'Enough product range to ship the idea.',
    body: 'The work does not stop at analysis. It becomes databases, maps, interfaces, pipelines, and products other people can use.',
    proof: 'Item2, Hodego, Mapbox/MapLibre work, Python and TypeScript pipelines.',
  },
];

export const notes: Note[] = [
  {
    lead: 'Family office work',
    body: "Craig McCaw's family office after freshman year at Trinity; Paul Allen's Vulcan after the WSU comeback.",
  },
  {
    lead: 'Two IMDB credits',
    body: '7 Minutes (2014) and Twin Peaks: The Return (2017, David Lynch). Production accounting. IMDB: nm5681118.',
  },
  {
    lead: 'Summa cum laude',
    body: 'BA Accounting, Washington State University. Delta Sigma Pi Scholarship Key: highest GPA in all of business and economics.',
  },
  {
    lead: 'Perfect GPA',
    body: '4.0 across every graduate program completed: UK Digital Mapping and UMD Geospatial Intelligence (USGIF-accredited).',
  },
  {
    lead: 'Hawaii roots',
    body: 'Born in Honolulu. Summers with uncle Steve Ozark, who ran backstage catering in Hawaii for 30+ years.',
  },
  {
    lead: 'Spatial finance',
    body: 'Before Item2, North Kai Capital explored public-market themes through a licensable franchise-company equity index.',
  },
];
