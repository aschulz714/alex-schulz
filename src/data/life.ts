/**
 * The life timeline. Every entry paraphrases a fact already stated on the Story page or in
 * timeline.ts; year labels are only given where the source states them. Undated entries carry
 * a short era label instead of a year so nothing is invented.
 */
export type LifeCategory = 'origin' | 'entertainment' | 'finance' | 'geospatial' | 'build';

export interface LifeEntry {
  /** A year like "2017", or a short era label like "Summers" when the source gives no year. */
  when: string;
  title: string;
  body: string;
  place: string;
  category: LifeCategory;
  /** Optional link into the site (a project or an analysis piece). */
  href?: string;
}

export const categoryLabel: Record<LifeCategory, string> = {
  origin: 'Origin',
  entertainment: 'Entertainment',
  finance: 'Finance',
  geospatial: 'Geospatial',
  build: 'Build',
};

export const life: LifeEntry[] = [
  {
    when: 'Origin',
    title: 'Honolulu to Everett',
    body: 'Born at Kapiolani in Honolulu. A year later the family moved to Everett, Washington, where my mom was from. An only child, raised by a dental assistant, and by all accounts a serious kid.',
    place: 'Honolulu → Everett, WA',
    category: 'origin',
  },
  {
    when: 'Summers',
    title: 'Backstage with Steve Ozark',
    body: 'Childhood summers back in Hawaii with my uncle, who ran backstage catering on Oahu for more than thirty years and cooked for Santana, Bob Dylan, Neil Diamond, Elton John, and Jimmy Buffett. The lesson before I could name it: the world is smaller and more reachable than it looks.',
    place: 'Oahu, HI',
    category: 'entertainment',
  },
  {
    when: 'Custer',
    title: 'The map on the porch',
    body: 'An old Industrial Map of Washington hung by a thumbtack on the porch of my great-grandparents\' dairy farm until my mom framed it. Industry, land, movement, and memory on one sheet. The work still circles back to it.',
    place: 'Custer, WA',
    category: 'origin',
  },
  {
    when: 'Everett High',
    title: 'Valedictorian',
    body: 'It started as a family bet: Steve mailed a hundred-dollar bill for every 4.0 semester. By sophomore year I realized I could keep it going.',
    place: 'Everett, WA',
    category: 'origin',
  },
  {
    when: 'Trinity',
    title: 'The detour, and the dropout',
    body: 'A year at Trinity University in San Antonio, then out. In between, a job flying down to Montecito to help with properties, including one acquired from John Cleese, and a private meet-and-greet with Cleese himself the fall he spoke at Trinity.',
    place: 'San Antonio, TX',
    category: 'origin',
  },
  {
    when: 'Before WSU',
    title: 'A first family office',
    body: 'The McCaw chapter came unusually early, before the comeback. A close-up view of how real money does accounting, years before the credential.',
    place: 'Seattle, WA',
    category: 'finance',
  },
  {
    when: '2011',
    title: 'APEC, and The Amazing Race',
    body: 'Setting up umbrellas for Secret Service perimeter positions at the 2011 APEC meeting for Showcall USA. On another Hawaii stay, production assistant and driver for host Phil Keoghan on the season 20 finale of The Amazing Race.',
    place: 'Honolulu, HI',
    category: 'entertainment',
  },
  {
    when: '2014',
    title: '7 Minutes',
    body: 'First IMDb credit: production accounting on a crime thriller directed by Jay Martin. Production accounting is its own discipline. The logic is familiar, the pace and stakes are not.',
    place: 'Washington',
    category: 'entertainment',
  },
  {
    when: '2015',
    title: 'WSU, summa cum laude',
    body: 'BA in Accounting at Washington State. Delta Sigma Pi Scholarship Key for the highest cumulative GPA across all of business and economics. In spring 2014, one of thirteen students chosen for Cougs on Wall Street, a trip to the Quinnipiac GAME Forum in New York. The CPA license followed.',
    place: 'Pullman, WA',
    category: 'finance',
  },
  {
    when: '2015',
    title: 'Twin Peaks: The Return',
    body: 'Production accounting across ten episodes of David Lynch\'s limited-series revival, filmed September to October 2015 on the Washington state production team. The second IMDb credit, and it came just before Vulcan.',
    place: 'Snoqualmie, WA',
    category: 'entertainment',
  },
  {
    when: '2017',
    title: 'Vulcan Inc.',
    body: 'Real-estate finance inside Paul Allen\'s family office: monthly loan draws, portfolio variance analysis across eight projects, capital planning. Also an early personal-finance education, courtesy of a 401(k) match worth maxing out in my twenties.',
    place: 'Seattle, WA',
    category: 'finance',
  },
  {
    when: '2018',
    title: 'North Kai Capital',
    body: 'After reading the Value Investing Congress thesis on Jack in the Box, built an equity-index concept around publicly traded franchise companies and worked with EQM Indexes in San Diego to refine the methodology and launch it as a licensable index.',
    place: 'Seattle, WA',
    category: 'finance',
  },
  {
    when: '2019',
    title: 'Pillar Properties',
    body: 'Sole accountant on construction draws for fifteen-plus multimillion-dollar Seattle development projects: job costs, lender draws, equity partners. Where buildings become ledgers. Fund administration at ALPS sits in the same stretch of craft years.',
    place: 'Seattle, WA',
    category: 'finance',
  },
  {
    when: 'Everett',
    title: 'Land records get personal',
    body: 'Twice helped my mom defend the boundaries of her own property. An unwanted education in documentation, recorded facts, and the gap between being right and being able to prove it.',
    place: 'Everett, WA',
    category: 'geospatial',
  },
  {
    when: '2021',
    title: 'Digital Mapping, University of Kentucky',
    body: 'A graduate certificate through New Maps Plus, remote, at night, while working full-time in development accounting. 4.0, and first contact with HTML, CSS, JavaScript, Git, QGIS, Leaflet, and Mapbox. Every ledger is a dataset, and every dataset has a shape.',
    place: 'Remote from WA',
    category: 'geospatial',
  },
  {
    when: '2022',
    title: 'MS Geospatial Intelligence, Maryland',
    body: 'USGIF-accredited, one of 23 such programs in the country. Also remote, also 4.0, also nights and weekends. The capstone became rail_served. Attended the GEOINT Symposium in Denver and met the BlackSky team.',
    place: 'Remote from WA · Denver, CO',
    category: 'geospatial',
    href: '/work/wa-rail-properties',
  },
  {
    when: '2023',
    title: 'Spaceflight / Firefly Aerospace',
    body: 'Senior accountant for a launch-services company: month-end close, Washington use-tax compliance, and documenting the D365 ERP. Aerospace, from the ledger side.',
    place: 'Bellevue, WA',
    category: 'finance',
  },
  {
    when: '2024',
    title: 'Building at the intersection',
    body: 'Co-founded Hodego and shipped its marketplace MVP on AWS with a three-developer team. Started Item2, the SEC-filings-to-facilities asset graph. Spatial finance, in practice.',
    place: 'Lake Stevens, WA',
    category: 'build',
    href: '/work/item2',
  },
  {
    when: '2025',
    title: 'The day job goes modular',
    body: 'Revenue accounting and multi-jurisdiction VAT for a marketplace company; cash-flow modeling for a private trust holding a self-storage portfolio. Consulting funds the build.',
    place: 'Remote from WA',
    category: 'finance',
  },
  {
    when: '2026',
    title: 'Full-time on a revenue team',
    body: 'Senior Accountant, Revenue, at a marketplace company: on contract from 2025, full-time since April 2026. The close cockpit on this site was built in this role.',
    place: 'Remote from WA',
    category: 'finance',
    href: '/work/close-automation',
  },
  {
    when: '2026',
    title: 'National parcel coverage, and the wealth atlas',
    body: 'Recorded an owner-resolution method for every one of the 3,221 US county-equivalents, built a 143.9-million-parcel store from free public sources, then ran a six-county study of how Washington\'s wealthiest households actually made their money. Solo, directing AI agents, every route verified by hand.',
    place: 'Lake Stevens, WA',
    category: 'geospatial',
    href: '/work/national-parcel-coverage',
  },
  {
    when: '2026',
    title: 'A ring in Lake Goodwin',
    body: 'A wedding ring went overboard in August. Forty-eight hours later a phone app fused the boat\'s fixes and a video clock into a numbered search grid over the lake\'s depth contours. A small project, and the most personal one.',
    place: 'Lake Goodwin, WA',
    category: 'geospatial',
  },
];
