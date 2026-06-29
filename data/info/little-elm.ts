import { CityInfo } from "@/lib/types";

export const littleElmInfo: CityInfo = {
  id: "little-elm",
  name: "Little Elm",
  populations: [
    { year: 1980, value: 926 },
    { year: 1990, value: 1255 },
    { year: 2000, value: 3646 },
    { year: 2010, value: 25898 },
    { year: 2020, value: 46453 },
    { year: 2025, value: 62727 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.47715,
      isRate: 0.18782,
    },
    {
      fiscalYear: 2016,
      moRate: 0.4776,
      isRate: 0.18409,
    },
    {
      fiscalYear: 2017,
      moRate: 0.49573,
      isRate: 0.16596,
    },
    {
      fiscalYear: 2018,
      moRate: 0.48519,
      isRate: 0.17248,
    },
    {
      fiscalYear: 2019,
      moRate: 0.47943,
      isRate: 0.17047,
    },
    {
      fiscalYear: 2020,
      moRate: 0.49587,
      isRate: 0.15403,
    },
    {
      fiscalYear: 2021,
      moRate: 0.52,
      isRate: 0.1297,
    },
    {
      fiscalYear: 2022,
      moRate: 0.52404,
      isRate: 0.11991,
    },
    {
      fiscalYear: 2023,
      moRate: 0.48642,
      isRate: 0.14348,
    },
    {
      fiscalYear: 2024,
      moRate: 0.4401,
      isRate: 0.14981,
    },
    {
      fiscalYear: 2025,
      moRate: 0.43579,
      isRate: 0.12411,
    },
    {
      fiscalYear: 2026,
      moRate: 0.441195,
      isRate: 0.108706,
    },
  ],
  revenueBySource: {
    property: 42342937,
    sales: 10483808,
    hotel: 190432,
  },
  revenues: [
    {
      fiscalYear: 2024,
      property: 42342937,
      sales: 10483808,
      hotel: 190432,
    },
    {
      fiscalYear: 2025,
      property: 43233523,
      sales: 10630908,
      hotel: 200915,
    },
  ],
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Economic Development Corporation", percent: 0.5 },
    { usage: "Street Maintenance", percent: 0.25 },
    { usage: "Community Development Corporation", percent: 0.25 },
  ],
  latitude: 33.16389,
  longitude: -96.93028,
  area: 17.99,
  notes: [
    `ACFR 2021: "the Town of Little Elm's governmental funds reported a combined ending fund balance of $110,882,921,
    an increase of $61,344,819 in comparison with the prior year.
    The increase is due largely to the issuance of debt in 2021 and to the expansion of PID capital projects within the Town.
    [...]
    During 2021, the Town issued $21,765,000 of Certificates of Obligation."
    `,
    `ACFR 2021: "Governmental activities increased the Town's net position by $66,549,505 from the prior year.
    This was due in large part to the increase in capital grants and contributions.
    These contributions are largely the result of increased operations of the public improvement districts within the Town.`,
  ],
};
