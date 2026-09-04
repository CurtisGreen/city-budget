import { CityInfo } from "@/lib/types";

export const cockrellHillInfo: CityInfo = {
  id: "cockrell-hill",
  name: "Cockrell Hill",
  populations: [
    { year: 1980, value: 3262 },
    { year: 1990, value: 3746 },
    { year: 2000, value: 4443 },
    { year: 2010, value: 4193 },
    { year: 2020, value: 3815 },
    { year: 2025, value: 3703 },
  ],
  propertyValues: [
    {
      fiscalYear: 2019,
      moRate: 0.7558,
      isRate: 0.233147,
    },
    {
      fiscalYear: 2020,
      moRate: 0.781241,
      isRate: 0.165885,
    },
    {
      fiscalYear: 2021,
      moRate: 0.657522,
      isRate: 0.193051,
    },
    {
      fiscalYear: 2022,
      moRate: 0.648945,
      isRate: 0.174071,
    },
    {
      fiscalYear: 2023,
      moRate: 0.52017,
      isRate: 0.23761,
    },
    {
      fiscalYear: 2024,
      moRate: 0.492408,
      isRate: 0.280188,
    },
    {
      fiscalYear: 2025,
      moRate: 0.441062,
      isRate: 0.254024,
    },
    {
      fiscalYear: 2026,
      moRate: 0.434353,
      isRate: 0.24139,
    },
  ],
  revenueBySource: {
    property: 1697132,
    sales: 637645,
    hotel: 0,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "DART", percent: 1 },
  ],
  area: 0.58,
  notes: [
    `FY 2020 ACFR: "The City's capital assets reflect an increase of $9,808,000 which is due to additions to infrastructure
    (roundabout discussed above, plus the addition of $600,00 added to the streets project accompanied by intergovernmental
    improvements ($255,000) to the water and sewer distribution system provided by Dallas County." [...] "Net position
    increased because of the intergovernmental capital grants of $9,406,000."`,
  ],
};
