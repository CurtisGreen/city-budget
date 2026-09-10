import { CityInfo } from "@/lib/types";

export const hutchinsInfo: CityInfo = {
  id: "hutchins",
  name: "Hutchins",
  populations: [
    { year: 1980, value: 2996 },
    { year: 1990, value: 2719 },
    { year: 2000, value: 2805 },
    { year: 2010, value: 5338 },
    { year: 2020, value: 5607 },
    { year: 2025, value: 8206 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.592687,
      isRate: 0.11822,
    },
    {
      fiscalYear: 2016,
      moRate: 0.590853,
      isRate: 0.091606,
    },
    {
      fiscalYear: 2017,
      moRate: 0.592315,
      isRate: 0.090144,
    },
    {
      fiscalYear: 2018,
      moRate: 0.540459,
      isRate: 0.142,
    },
    {
      fiscalYear: 2019,
      moRate: 0.474159,
      isRate: 0.2083,
    },
    {
      fiscalYear: 2020,
      moRate: 0.47926,
      isRate: 0.203199,
    },
    {
      fiscalYear: 2021,
      moRate: 0.4793,
      isRate: 0.203159,
    },
    {
      fiscalYear: 2022,
      moRate: 0.524607,
      isRate: 0.157852,
    },
    {
      fiscalYear: 2023,
      moRate: 0.498049,
      isRate: 0.157852,
    },
    {
      fiscalYear: 2024,
      moRate: 0.479822,
      isRate: 0.15026,
    },
    {
      fiscalYear: 2025,
      moRate: 0.442596,
      isRate: 0.187486,
    },
    {
      fiscalYear: 2026,
      moRate: 0.455992,
      isRate: 0.201008,
    },
  ],
  revenueBySource: {
    property: 7763707,
    sales: 4314064,
    hotel: 203185,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1.5 },
    { usage: "Economic Development Corporation", percent: 0.5 },
  ],
  area: 9.09,
  notes: [
    `FY 2023 ACFR: "During the year, the City issued $11,520,000 and $14,500,000 of Series 2023 GO Refunding bonds and Certificates of Obligation, respectively.
     In addition, the City issued $1,055,000 of tax anticipation notes during the year."`,
    `FY 2025 ACFR: "During the year, the City issued $26,230,000 of general obligation bonds during the year." [...] "The City's total investment in capital assets increased by $17,594,926, net of depreciation."`,
  ],
};
