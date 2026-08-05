import { CityInfo } from "@/lib/types";

export const hasletInfo: CityInfo = {
  id: "haslet",
  name: "Haslet",
  populations: [
    { year: 1980, value: 262 },
    { year: 1990, value: 795 },
    { year: 2000, value: 1134 },
    { year: 2010, value: 1517 },
    { year: 2020, value: 1952 },
    { year: 2025, value: 5267 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.255648,
      isRate: 0.065221,
    },
    {
      fiscalYear: 2016,
      moRate: 0.236708,
      isRate: 0.048985,
    },
    {
      fiscalYear: 2017,
      moRate: 0.240965,
      isRate: 0.049288,
    },
    {
      fiscalYear: 2018,
      moRate: 0.279504,
      isRate: 0.05354,
    },
    {
      fiscalYear: 2019,
      moRate: 0.252854,
      isRate: 0.053106,
    },
    {
      fiscalYear: 2020,
      moRate: 0.258966,
      isRate: 0.038617,
    },
    {
      fiscalYear: 2021,
      moRate: 0.216702,
      isRate: 0.03327,
    },
    {
      fiscalYear: 2022,
      moRate: 0.254152,
      isRate: 0.029077,
    },
    {
      fiscalYear: 2023,
      moRate: 0.272682,
      isRate: 0.024275,
    },
    {
      fiscalYear: 2024,
      moRate: 0.297294,
      isRate: 0.045344,
    },
    {
      fiscalYear: 2025,
      moRate: 0.314203,
      isRate: 0.03587,
    },
    {
      fiscalYear: 2026,
      moRate: 0.282961,
      isRate: 0.032489,
    },
  ],
  revenueBySource: {
    property: 5008671,
    sales: 4687658,
    hotel: 22061,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1.0 },
    { usage: "Community & Economic Development Corporation", percent: 0.5 },
    { usage: "Economic Development Corporation", percent: 0.25 },
    { usage: "Street Maintenance", percent: 0.25 },
  ],
  notes: [
    `ACFR 2019: "The current year increase was largely due to capital contributions from
     developers." [...] "This is a net increase in capital assets of $7,510,258 and mostly
     attributable to street and drainage improvements and additions to water system
     infrastructure."`,
    `ACFR 2023: "the City issued the Series 2022 Combination Tax and Revenue Bonds in the
     original principal amount of $16,075,000 (split between governmental and business type
     activities)." [...] "the City budgeted for the expenditure of all proceeds from the Series
     2022 Combination Tax and Revenue Bonds; however, they were not spent as of the year end."`,
  ],
  area: 8.93,
};
