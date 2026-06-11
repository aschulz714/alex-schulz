export interface Artifact {
  label: string;
  title: string;
  body: string;
  lens: 'Entertainment' | 'Geospatial' | 'Finance' | 'Bridge';
  href: string;
}

export const artifacts: Artifact[] = [
  {
    label: 'Object',
    title: 'Industrial Map of Washington',
    body:
      'A framed farm-porch map from Custer that turned land, industry, memory, and infrastructure into one personal origin object.',
    lens: 'Geospatial',
    href: '/geospatial',
  },
  {
    label: 'Index',
    title: 'Franchise-company equity index',
    body:
      'A Jack in the Box refranchising thesis became a licensable index methodology developed with EQM Indexes.',
    lens: 'Finance',
    href: '/franchise-index',
  },
  {
    label: 'Credit',
    title: 'Twin Peaks and 7 Minutes',
    body:
      'Production accounting credits that sit beside off-credit work on The Amazing Race, APEC, and live events.',
    lens: 'Entertainment',
    href: '/entertainment',
  },
  {
    label: 'Credential',
    title: 'CPA plus MS GEOINT',
    body:
      'An unusual overlap between accounting discipline and geospatial intelligence, with a 4.0 across graduate work.',
    lens: 'Bridge',
    href: '/about',
  },
  {
    label: 'Field note',
    title: 'Adverse possession records',
    body:
      'A hard lesson in boundaries, documentation, facts, and how physical evidence becomes legal reality.',
    lens: 'Geospatial',
    href: '/geospatial',
  },
  {
    label: 'Architecture',
    title: 'Tax-aware compounding',
    body:
      'The Vulcan 401(k) lesson expands into QSBS, Roth wrappers, qualified dividends, depreciation, 1031, and QOZ geography.',
    lens: 'Finance',
    href: '/finance#tax-architecture',
  },
  {
    label: 'Trip',
    title: 'Cougs on Wall Street',
    body:
      'One of 13 WSU students selected for the NYC trip to the Quinnipiac GAME Forum, funded by Gary Brinson.',
    lens: 'Finance',
    href: '/finance',
  },
  {
    label: 'Build',
    title: 'Item2 and rail_served',
    body:
      'The current direction: geospatial evidence, financial context, parcel data, and AI-assisted research workflows.',
    lens: 'Bridge',
    href: '/work',
  },
];
