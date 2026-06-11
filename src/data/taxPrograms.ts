export interface TaxPrinciple {
  title: string;
  body: string;
}

export interface TaxProgram {
  name: string;
  code: string;
  status: string;
  fit: string;
  use: string;
  sourceLabel: string;
  sourceHref: string;
}

export interface TaxProgramGroup {
  title: string;
  angle: string;
  programs: TaxProgram[];
}

export const taxPrinciples: TaxPrinciple[] = [
  {
    title: 'Ownership',
    body:
      'Who owns the upside, what entity owns it, and whether the equity was structured correctly from day one.',
  },
  {
    title: 'Timing',
    body:
      'Holding periods, income years, liquidity events, gain harvesting, and when deductions or exclusions become available.',
  },
  {
    title: 'Place',
    body:
      'Rail-served sites, opportunity zones, redevelopment areas, energy upgrades, and real assets where geography changes the economics.',
  },
  {
    title: 'Wrapper',
    body:
      'Roth accounts, retirement plans, HSAs, and other structures where compounding happens inside a better tax container.',
  },
];

export const taxProgramGroups: TaxProgramGroup[] = [
  {
    title: 'Founder equity',
    angle:
      'For proprietary data products, vertical software, and index or AI businesses where early ownership could become the main asset.',
    programs: [
      {
        name: 'Qualified small business stock',
        code: 'IRC 1202 / QSBS',
        status: 'Core interest',
        fit:
          'C-corp founder equity can become dramatically more valuable when the exclusion rules, asset test, active-business test, and holding period are planned early.',
        use:
          'Best fit for an eventual software, data, or AI operating company built to own the upside.',
        sourceLabel: 'IRS Pub. 550 / US Code 1202',
        sourceHref:
          'https://www.irs.gov/publications/p550#en_US_2025_publink10009865',
      },
      {
        name: 'QSBS rollover',
        code: 'IRC 1045',
        status: 'Advanced watchlist',
        fit:
          'A qualifying sale of QSBS held more than six months may create a rollover path into replacement QSBS rather than immediately recognizing the full gain.',
        use:
          'Best fit if one founder-equity outcome needs to be redeployed into another qualifying early-stage company.',
        sourceLabel: 'US Code 1045',
        sourceHref: 'https://www.law.cornell.edu/uscode/text/26/1045',
      },
      {
        name: 'Restricted stock election',
        code: 'IRC 83(b)',
        status: 'Formation hygiene',
        fit:
          'Restricted founder stock can be taxed closer to grant value instead of vesting value, but only when the election is made on time and correctly.',
        use:
          'Best fit for founder or early-employee stock that is actually transferred and subject to vesting or forfeiture.',
        sourceLabel: 'IRS Pub. 525 / Form 15620',
        sourceHref: 'https://www.irs.gov/publications/p525#en_US_2025_publink1000229228',
      },
      {
        name: 'Research credit',
        code: 'IRC 41',
        status: 'Operating company lever',
        fit:
          'Product development, data pipelines, software experimentation, and technical uncertainty may create credit opportunities when documented correctly.',
        use:
          'Best fit for AI, geospatial, franchise-index, or parcel-data work that becomes a real trade or business.',
        sourceLabel: 'IRS research credit guide',
        sourceHref:
          'https://www.irs.gov/businesses/audit-techniques-guide-credit-for-increasing-research-activities-ie-research-tax-credit-irc-ss-41-qualified-research-expenses',
      },
    ],
  },
  {
    title: 'Compounding wrappers',
    angle:
      'For turning earned income, low-income years, and long holding periods into better after-tax compounding.',
    programs: [
      {
        name: 'Roth wrappers',
        code: 'Roth IRA / Roth 401(k)',
        status: 'Core interest',
        fit:
          'The lesson from the Vulcan 401(k) years extends here: the account wrapper can matter as much as the investment when compounding has enough time.',
        use:
          'Best fit for tax-free qualified distributions, conversions in lower-income years, and plan designs that allow after-tax contributions.',
        sourceLabel: 'IRS Pub. 590-A / 2026 limits',
        sourceHref: 'https://www.irs.gov/publications/p590a#en_US_2025_publink1000230984',
      },
      {
        name: 'Employer and solo retirement plans',
        code: '401(k), SEP, SIMPLE',
        status: 'High-priority wrapper',
        fit:
          'Retirement plan design can create larger annual contribution space than an IRA alone, especially for self-employment or founder income.',
        use:
          'Best fit for future consulting, product-company, or side-business income that can support plan design.',
        sourceLabel: 'IRS 2026 retirement limits',
        sourceHref:
          'https://www.irs.gov/retirement-plans/cola-increases-for-dollar-limitations-on-benefits-and-contributions',
      },
      {
        name: 'Health savings account',
        code: 'HSA',
        status: 'Quiet compounding',
        fit:
          'An HSA can combine deductible contributions, tax-deferred growth, and tax-free qualified medical withdrawals when eligibility requirements are met.',
        use:
          'Best fit as a health-care reserve that can also behave like a long-duration tax-favored investment account.',
        sourceLabel: 'IRS Pub. 969',
        sourceHref: 'https://www.irs.gov/publications/p969#en_US_2025_publink1000204030',
      },
      {
        name: 'Qualified dividend and capital-gain windows',
        code: '0% / 15% / 20% rate bands',
        status: 'Income-timing lever',
        fit:
          'Lower-income years can create room for qualified dividends or long-term capital gains to be taxed at lower rates, including the 0% band.',
        use:
          'Best fit for transition years, sabbaticals, business build years, or tax-gain harvesting plans.',
        sourceLabel: 'IRS Pub. 550',
        sourceHref: 'https://www.irs.gov/publications/p550#en_US_2025_publink100010661',
      },
    ],
  },
  {
    title: 'Real assets and place',
    angle:
      'For rail-served property, parcels, industrial land, and buildings where location, basis, and improvement work shape returns.',
    programs: [
      {
        name: 'Depreciation and cost recovery',
        code: 'MACRS / bonus / 179',
        status: 'Real-asset core',
        fit:
          'Real assets are not just cap rates and rents; basis, placed-in-service timing, component lives, and bonus depreciation can change cash yield.',
        use:
          'Best fit for rail-served properties, industrial buildings, equipment, and improvement-heavy projects.',
        sourceLabel: 'IRS Pub. 946',
        sourceHref: 'https://www.irs.gov/publications/p946',
      },
      {
        name: 'Like-kind exchanges',
        code: 'IRC 1031',
        status: 'Real-estate rollover',
        fit:
          'Business or investment real estate can sometimes be exchanged for other like-kind real estate without immediate gain recognition.',
        use:
          'Best fit for scaling from one property thesis into another while keeping capital working.',
        sourceLabel: 'IRS 1031 real estate tips',
        sourceHref:
          'https://www.irs.gov/businesses/small-businesses-self-employed/like-kind-exchanges-real-estate-tax-tips',
      },
      {
        name: 'Qualified Opportunity Zones',
        code: 'QOZ / QOF',
        status: 'Rail-served fit',
        fit:
          'QOZ rules connect capital gains, long holding periods, and geography, which makes them directly relevant to the rail-served property thesis.',
        use:
          'Best fit where parcel selection, operating plan, and community-development economics all line up.',
        sourceLabel: 'IRS QOF guidance',
        sourceHref:
          'https://www.irs.gov/credits-deductions/businesses/invest-in-a-qualified-opportunity-fund',
      },
      {
        name: 'New Markets Tax Credit',
        code: 'NMTC',
        status: 'Place-based watchlist',
        fit:
          'NMTC financing can support qualifying businesses and real-estate projects in low-income communities through CDE structures.',
        use:
          'Best fit for redevelopment, industrial reuse, community-serving facilities, or rail-adjacent projects with local impact.',
        sourceLabel: 'CDFI Fund NMTC',
        sourceHref:
          'https://www.cdfifund.gov/programs-training/programs/new-markets-tax-credit',
      },
      {
        name: 'Energy-efficient commercial buildings',
        code: 'IRC 179D',
        status: 'Building upgrade lever',
        fit:
          'Commercial energy improvements can have deduction value when design, construction, certification, and timing requirements are met.',
        use:
          'Best fit for industrial or commercial property upgrades where operating savings and tax benefits can stack.',
        sourceLabel: 'IRS 179D',
        sourceHref:
          'https://www.irs.gov/credits-deductions/energy-efficient-commercial-buildings-deduction',
      },
      {
        name: 'Home-sale exclusion',
        code: 'IRC 121',
        status: 'Personal balance-sheet lever',
        fit:
          'Principal residence gains can sometimes be excluded, which matters when housing, liquidity, and future business formation are connected.',
        use:
          'Best fit for personal planning around home equity, relocation, and the capital needed for the next build.',
        sourceLabel: 'IRS Topic 701',
        sourceHref: 'https://www.irs.gov/taxtopics/tc701',
      },
    ],
  },
  {
    title: 'Operating income',
    angle:
      'For converting the CPA background into sharper entity, deduction, and income-character questions without making the site feel like a tax practice.',
    programs: [
      {
        name: 'Qualified business income deduction',
        code: 'IRC 199A / QBI',
        status: 'Pass-through watchlist',
        fit:
          'Pass-through income can have a different after-tax profile than wages or C-corp income, depending on the business and limitation rules.',
        use:
          'Best fit for consulting, data services, or side businesses before a venture-style C-corp path makes more sense.',
        sourceLabel: 'IRS QBI overview',
        sourceHref: 'https://www.irs.gov/newsroom/qualified-business-income-deduction',
      },
    ],
  },
];

export const taxSourceLinks = [
  {
    label: 'IRS QSBS / investment income',
    href: 'https://www.irs.gov/publications/p550#en_US_2025_publink10009865',
  },
  {
    label: 'IRS Opportunity Zones',
    href: 'https://www.irs.gov/credits-deductions/businesses/invest-in-a-qualified-opportunity-fund',
  },
  {
    label: 'IRS depreciation',
    href: 'https://www.irs.gov/publications/p946',
  },
  {
    label: 'IRS retirement limits',
    href:
      'https://www.irs.gov/retirement-plans/cola-increases-for-dollar-limitations-on-benefits-and-contributions',
  },
  {
    label: 'CDFI NMTC',
    href: 'https://www.cdfifund.gov/programs-training/programs/new-markets-tax-credit',
  },
];
