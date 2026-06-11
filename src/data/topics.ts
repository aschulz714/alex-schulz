export interface TopicLink {
  label: string;
  href: string;
}

export interface Topic {
  slug: 'entertainment' | 'geospatial' | 'finance';
  nav: string;
  label: string;
  title: string;
  dek: string;
  thesis: string;
  signal: string;
  bridge: string;
  chapters: {
    eyebrow: string;
    title: string;
    body: string;
  }[];
  evidence: string[];
  related: TopicLink[];
}

export const topics: Topic[] = [
  {
    slug: 'entertainment',
    nav: 'Entertainment',
    label: '01 / Entertainment',
    title: 'Behind the show.',
    dek:
      'Story, production, access, logistics, and the machinery behind public moments.',
    thesis:
      'Entertainment is where Alex learned that finished products are usually the visible tip of a much larger operating system: people, timing, trust, budgets, equipment, access, and controlled chaos.',
    signal:
      'The recurring skill is seeing the production system behind the public moment.',
    bridge:
      'This connects directly to finance and geospatial work: the show is the visible artifact, but the edge is in understanding the logistics, locations, contracts, and people that produced it.',
    chapters: [
      {
        eyebrow: 'Hawaii roots',
        title: 'Steve Ozark and the backstage world.',
        body:
          'Steve ran backstage catering in Hawaii for more than thirty years, cooking for artists including Santana, Bob Dylan, Neil Diamond, Elton John, Jimmy Buffett, and many others. Growing up near that world made entertainment feel less like celebrity and more like logistics, trust, timing, and craft.',
      },
      {
        eyebrow: 'Production work',
        title: 'The credits and the off-credit stories both matter.',
        body:
          'The formal credits include 7 Minutes and Twin Peaks: The Return. The off-credit stories include The Amazing Race season 20 finale, driving host Phil Keoghan, 2011 APEC perimeter work for Showcall USA, and backstage event work around Lil Wayne, Elton John, Kevin Hart, Shaquille O Neal’s All Star Comedy Jam, Steve Miller Band, and Boyz II Men.',
      },
      {
        eyebrow: 'What carried forward',
        title: 'Entertainment taught the operating reality behind a polished surface.',
        body:
          'That lens now shows up in how Alex thinks about media, product, markets, and storytelling: the public artifact matters, but the real edge is often in understanding how it was produced.',
      },
    ],
    evidence: [
      'IMDb credits: 7 Minutes and Twin Peaks: The Return',
      'Production accounting and event operations',
      'The Amazing Race, APEC, backstage Hawaii context',
    ],
    related: [
      { label: 'Long-form background', href: '/about' },
      { label: 'Selected work', href: '/work' },
    ],
  },
  {
    slug: 'geospatial',
    nav: 'Geospatial',
    label: '02 / Geospatial',
    title: 'Behind the place.',
    dek:
      'Maps, land, infrastructure, boundaries, and the physical evidence beneath a story.',
    thesis:
      'Geospatial work gives Alex a way to inspect the real world directly: parcels, rail lines, industrial assets, land-use records, satellite imagery, and the stubborn facts attached to place.',
    signal:
      'The recurring skill is finding overlooked physical evidence and making it legible.',
    bridge:
      'This is where the entertainment and finance lenses become grounded: stories happen somewhere, assets sit somewhere, ownership has boundaries, and physical evidence can confirm or challenge the narrative.',
    chapters: [
      {
        eyebrow: 'Origin object',
        title: 'The Industrial Map of Washington was not just decoration.',
        body:
          'The old Washington industrial map came from Alex’s mom’s grandparents’ dairy farm in Custer, Washington. It had been hanging on the porch by a thumb tack before it was framed. That object became a quiet template: industry, memory, land, infrastructure, and family history all in one map.',
      },
      {
        eyebrow: 'Credential path',
        title: 'The accounting path kept bumping into maps.',
        body:
          'At WSU, Alex wanted to minor in Geospatial Analysis, but the labs overlapped with core accounting courses. The map thread came back later through the University of Kentucky Digital Mapping certificate and the University of Maryland MS in Geospatial Intelligence, both completed with a 4.0.',
      },
      {
        eyebrow: 'Practical edge',
        title: 'Parcel records, rail-served land, and documented facts.',
        body:
          'The same instinct showed up in adverse possession lawsuits Alex helped his mom fight: facts, boundaries, documentation, and records mattered. Today it shows up in rail_served, parcel workflows, and the Item2 thesis around physical-world signals.',
      },
    ],
    evidence: [
      'MS Geospatial Intelligence, University of Maryland',
      'Digital Mapping certificate, University of Kentucky',
      'rail_served, parcel data, satellite signals, land records',
    ],
    related: [
      { label: 'Selected work', href: '/work' },
      { label: 'About Alex', href: '/about' },
    ],
  },
  {
    slug: 'finance',
    nav: 'Finance',
    label: '03 / Finance / Investing',
    title: 'Behind the numbers.',
    dek:
      'Markets, ownership, incentives, compounding, filings, and tax architecture.',
    thesis:
      'Finance is the lens Alex keeps using to understand structure: who owns what, where incentives sit, how cash moves, why compounding matters, and how tax rules can change the shape of an outcome.',
    signal:
      'The recurring skill is noticing where business structure creates a hidden advantage.',
    bridge:
      'This lens gives stakes to the other two: entertainment becomes an industry with contracts and incentives, while geospatial evidence becomes investable or operational when it can be connected to ownership, cash flow, and tax structure.',
    chapters: [
      {
        eyebrow: 'Accounting foundation',
        title: 'The CPA was the discipline layer, even when accounting was not the dream.',
        body:
          'The accounting path created the operating grammar: reconciliations, controls, filings, project accounting, real-estate finance, and the ability to inspect claims against source documents.',
      },
      {
        eyebrow: 'Family offices',
        title: 'McCaw and Vulcan made wealth feel concrete.',
        body:
          'The Craig McCaw family office and Paul Allen’s Vulcan exposed Alex to real estate, capital planning, monthly draws, portfolio variance, and the quieter mechanics of large pools of capital. Vulcan also made compounding real through a 50% 401(k) match up to the IRS limit.',
      },
      {
        eyebrow: 'Investing thesis',
        title: 'North Kai was the first attempt to turn curiosity into a product.',
        body:
          'The franchise-company index began with a Jack in the Box refranchising thesis, moved through industry outreach, and became a licensable methodology with EQM Indexes. The next version lives at the overlap of financial data, AI, geospatial context, and tax-aware structure.',
      },
      {
        eyebrow: 'Tax architecture',
        title: 'After-tax structure is part of the thesis.',
        body:
          'The finance lens now includes a deliberate tax-architecture layer: QSBS for founder equity, Roth-style compounding wrappers, qualified-dividend and capital-gain windows, real-asset depreciation, 1031 exchanges, and QOZ geography for rail-served property ideas.',
      },
      {
        eyebrow: 'Reference point',
        title: 'The larger pattern is data product to creative freedom.',
        body:
          'A useful outside reference is Allen Gilmer, who co-founded Drillinginfo, later Enverus, at the intersection of geoscience, energy data, and vertical software, and later moved into film production through AHUEVO Films. The lesson is not to copy the path, but to recognize the architecture: deep domain knowledge, proprietary data, software ownership, and creative optionality.',
      },
    ],
    evidence: [
      'CPA, WSU accounting, summa cum laude',
      'Family-office and real-estate finance experience',
      'North Kai franchise index, QSBS, Roth wrappers, QOZ and real-asset tax structure',
    ],
    related: [
      { label: 'Tax architecture', href: '#tax-architecture' },
      { label: 'Franchise Index case study', href: '/franchise-index' },
      { label: 'Selected work', href: '/work' },
    ],
  },
];

export const topicBySlug = Object.fromEntries(topics.map((topic) => [topic.slug, topic])) as Record<
  Topic['slug'],
  Topic
>;
