import { CityInfo } from "@/lib/types";

export const roanokeInfo: CityInfo = {
  id: "roanoke",
  name: "Roanoke",
  populations: [
    { year: 1980, value: 910 },
    { year: 1990, value: 1616 },
    { year: 2000, value: 2810 },
    { year: 2010, value: 5962 },
    { year: 2020, value: 9665 },
    { year: 2025, value: 10931 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.15102,
      isRate: 0.2241,
    },
    {
      fiscalYear: 2016,
      moRate: 0.15201,
      isRate: 0.22311,
    },
    {
      fiscalYear: 2017,
      moRate: 0.15842,
      isRate: 0.21671,
    },
    {
      fiscalYear: 2018,
      moRate: 0.16095,
      isRate: 0.21417,
    },
    {
      fiscalYear: 2019,
      moRate: 0.16741,
      isRate: 0.20771,
    },
    {
      fiscalYear: 2020,
      moRate: 0.17363,
      isRate: 0.20149,
    },
    {
      fiscalYear: 2021,
      moRate: 0.18404,
      isRate: 0.19108,
    },
    {
      fiscalYear: 2022,
      moRate: 0.19502,
      isRate: 0.1801,
    },
    {
      fiscalYear: 2023,
      moRate: 0.19502,
      isRate: 0.18018,
    },
    {
      fiscalYear: 2024,
      moRate: 0.16967,
      isRate: 0.13837,
    },
    {
      fiscalYear: 2025,
      moRate: 0.17819,
      isRate: 0.12985,
    },
    {
      fiscalYear: 2026,
      moRate: 0.186998,
      isRate: 0.139184,
    },
  ],
  revenueBySource: {
    property: 11804174,
    sales: 19250692,
    hotel: 177365,
  },
  revenues: [
    {
      fiscalYear: 2024,
      property: 11804174,
      sales: 19250692,
      hotel: 177365,
    },
    {
      fiscalYear: 2025,
      property: 11877593,
      sales: 22247339,
      hotel: 124812,
    },
  ],
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    {
      usage: "Economic & Industrial Development Corporation",
      percent: 0.5,
    },
    { usage: "Crime Control & Prevention District", percent: 0.5 },
  ],
  latitude: 33.005,
  longitude: -97.22639,
  area: 6.89,
  notes: [
    `ACFR 2023: "Contributions from the Roanoke Economic Development Corporations is responsible for the operating contributions. These contributions increased $10,489,231 from prior year."`,
    `ACFR 2024: "The City's long-term liabilities increased by $31,861,277 due primarily to the issuance of certificates of obligations [...] The City issued $32,070,000 in Certificates of Obligation during fiscal year 2024."`,
    `ACFR 2025: "[...] increased debt service related to the 2025 issuance of Certificates of Obligation. Additionally, the City began a new hotel development agreement during the fiscal year which incurred significant convention center planning expenditures."`,
  ],
};
