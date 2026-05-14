import { HOME_COORDS } from './timeline';

export interface HeroPlace {
  label: string;
  note: string;
  coords: [number, number];
  zoom: number;
}

export interface Lens {
  label: string;
  title: string;
  body: string;
  signals: string[];
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

export const lenses: Lens[] = [
  {
    label: '01 / Entertainment',
    title: 'Behind the show.',
    body: 'Story, production, access, logistics, and the machinery behind public moments. This is the world of backstage rooms, film sets, live events, and the people who make a finished thing look effortless.',
    signals: [
      'Steve Ozark and backstage Hawaii',
      'The Amazing Race, APEC, Twin Peaks',
      'Media, story, production, and access',
    ],
  },
  {
    label: '02 / Geospatial',
    title: 'Behind the place.',
    body: 'Maps, land, infrastructure, boundaries, and physical evidence. This lens turns place into something that can be inspected: parcels, rail lines, facilities, ownership, and the records beneath them.',
    signals: [
      'Industrial Map of Washington',
      'Adverse possession, parcel records, rail-served land',
      'UK Digital Mapping and UMD GEOINT',
    ],
  },
  {
    label: '03 / Finance / Investing',
    title: 'Behind the numbers.',
    body: 'Markets, ownership, incentives, compounding, filings, and tax architecture. The finance lens is not just stock picking; it is how structure shapes outcomes over time.',
    signals: [
      'CPA, family offices, North Kai Capital',
      'Compounding, public-market themes, franchise index work',
      'QSBS, Roth architecture, QOZ geography',
    ],
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
