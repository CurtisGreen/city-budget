import { CityInfo } from "@/lib/types";

export const benbrookInfo: CityInfo = {
  id: "benbrook",
  name: "Benbrook",
  populations: [
    { year: 1980, value: 13579 },
    { year: 1990, value: 19564 },
    { year: 2000, value: 20208 },
    { year: 2010, value: 21234 },
    { year: 2020, value: 24520 },
    { year: 2025, value: 24279 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.6375,
      isRate: 0.02,
    },
    {
      fiscalYear: 2016,
      moRate: 0.6375,
      isRate: 0.02,
    },
    {
      fiscalYear: 2017,
      moRate: 0.6225,
      isRate: 0.0275,
    },
    {
      fiscalYear: 2018,
      moRate: 0.6125,
      isRate: 0.0275,
    },
    {
      fiscalYear: 2019,
      moRate: 0.6075,
      isRate: 0.0325,
    },
    {
      fiscalYear: 2020,
      moRate: 0.60647,
      isRate: 0.0213,
    },
    {
      fiscalYear: 2021,
      moRate: 0.6015,
      isRate: 0.021,
    },
    {
      fiscalYear: 2022,
      moRate: 0.581,
      isRate: 0.0365,
    },
    {
      fiscalYear: 2023,
      moRate: 0.574,
      isRate: 0.021,
    },
    {
      fiscalYear: 2024,
      moRate: 0.526,
      isRate: 0.039,
    },
    {
      fiscalYear: 2025,
      moRate: 0.5193,
      isRate: 0.0357,
    },
    {
      fiscalYear: 2026,
      moRate: 0.5191,
      isRate: 0.0359,
    },
  ],
  revenueBySource: {
    property: 17531765,
    sales: 4379798,
    hotel: 176210,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Economic Development Corporation", percent: 0.5 },
    { usage: "Library District", percent: 0.5 },
  ],
  area: 11.5,
  notes: [
    `ACFR 2021: "The City restated beginning net position/fund balance within governmental activities, the general fund, the TIF fund and the EDC fund due to accounting errors,
      and changes in fund reporting." The Economic Development Corporation and TIF moved out of governmental activities into discretely presented component units,
      reducing FY 2020 governmental net position by $7,277,333, so FY 2020 and later exclude balances that FY 2015-2019 include.`,
    `ACFR 2023: "Total current and other assets for governmental activities decreased by $9,573,145 or 21% primarily due to less cash on hand in the current year,
      resulting from available cash spent on the construction for the Municipal Complex.
      Total capital assets for governmental activities increased by $14,448,591 or 23% due to construction on the Municipal Complex in the current year." [...]
      "Total liabilities for the primary government increased by $10,827,203 or 35% primarily due to a greater net pension liability recognized in the current year.
      In addition, third party payables increased due to nonrecurring payables for capital improvements at the end of the current year."`,
  ],
};
