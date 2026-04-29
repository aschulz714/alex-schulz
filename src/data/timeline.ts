export interface Milestone {
  year: number;
  title: string;
  blurb: string;
  where: string;
  /** [lng, lat] — used to pan the hero map when this milestone scrolls into view. */
  coords: [number, number];
  zoom: number;
}

export const HOME_COORDS: [number, number] = [-122.2021, 47.979];
export const HOME_ZOOM = 10;

export const milestones: Milestone[] = [
  {
    year: 2015,
    title: 'BA Accounting, summa cum laude — WSU',
    blurb: 'Delta Sigma Pi Scholarship Key — highest GPA in all of business and economics. CPA license followed.',
    where: 'Pullman, WA',
    coords: [-117.1796, 46.7298],
    zoom: 10,
  },
  {
    year: 2017,
    title: 'Vulcan Inc. — Paul Allen’s family office',
    blurb: 'Real-estate finance inside a billionaire holding company: monthly loan draws, portfolio variance, capital planning.',
    where: 'Seattle, WA',
    coords: [-122.3321, 47.6062],
    zoom: 11,
  },
  {
    year: 2017,
    title: 'Twin Peaks: The Return — David Lynch',
    blurb: 'Production accounting across 10 episodes of the limited-series revival. Also on the set of 7 Minutes (2014). IMDB: nm5681118.',
    where: 'Snoqualmie, WA',
    coords: [-121.8252, 47.5452],
    zoom: 11,
  },
  {
    year: 2018,
    title: 'Founded North Kai Capital',
    blurb: 'Built a thematic equity index with an industry-recognized provider; presented to ETF industry veterans pursuing a license.',
    where: 'New York, NY',
    coords: [-74.006, 40.7128],
    zoom: 11,
  },
  {
    year: 2021,
    title: 'Digital Mapping certificate — U. Kentucky',
    blurb: '4.0 GPA, remote from Washington. First contact with HTML, CSS, JavaScript, Git, QGIS, Leaflet, Mapbox — the craft layer beneath the analysis.',
    where: 'U. Kentucky · remote',
    coords: [-84.5037, 38.0406],
    zoom: 11,
  },
  {
    year: 2022,
    title: 'MS Geospatial Intelligence — UMD',
    blurb: '4.0 GPA, remote from Washington. USGIF-accredited. Capstone became rail_served. Attended the GEOINT Symposium in Denver and met the BlackSky team.',
    where: 'UMD · remote',
    coords: [-76.9429, 38.9897],
    zoom: 12,
  },
  {
    year: 2024,
    title: 'Building at the intersection',
    blurb: 'Co-founded Hodego (AWS). Shipping Item2 (satellite-derived signals on micro-caps) and rail_served. Spatial finance, in practice.',
    where: 'Lake Stevens, WA',
    coords: HOME_COORDS,
    zoom: 10,
  },
];
