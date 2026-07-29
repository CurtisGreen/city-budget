import { CityInfo } from "@/lib/types";

export const corinthInfo: CityInfo = {
  id: "corinth",
  name: "Corinth",
  populations: [
    { year: 1980, value: 1264 },
    { year: 1990, value: 3944 },
    { year: 2000, value: 11325 },
    { year: 2010, value: 19935 },
    { year: 2020, value: 22634 },
    { year: 2025, value: 25297 },
  ],
  propertyValues: [
    { fiscalYear: 2015, moRate: 0.45143, isRate: 0.14346 },
    { fiscalYear: 2016, moRate: 0.44143, isRate: 0.14346 },
    { fiscalYear: 2017, moRate: 0.44298, isRate: 0.13895 },
    { fiscalYear: 2018, moRate: 0.42791, isRate: 0.10895 },
    { fiscalYear: 2019, moRate: 0.42711, isRate: 0.10289 },
    { fiscalYear: 2020, moRate: 0.43211, isRate: 0.11289 },
    { fiscalYear: 2021, moRate: 0.43923, isRate: 0.13894 },
    { fiscalYear: 2022, moRate: 0.427, isRate: 0.14 },
    { fiscalYear: 2023, moRate: 0.402, isRate: 0.138 },
    { fiscalYear: 2024, moRate: 0.384, isRate: 0.136 },
    { fiscalYear: 2025, moRate: 0.37621, isRate: 0.13779 },
    { fiscalYear: 2026, moRate: 0.39249, isRate: 0.1446 },
  ],
  revenueBySource: {
    property: 17454780,
    sales: 3724346,
    hotel: 119586,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1.0 },
    { usage: "Economic Development Corporation", percent: 0.5 },
    { usage: "Crime control & prevention", percent: 0.25 },
    { usage: "Fire control, prevention & emergency", percent: 0.25 },
  ],
  notes: [
    `ACFR 2023: "Long-term liabilities increased to $77,988,221 during fiscal year 2022-2023. The increase is due primarily to the issuance of bonds."`,
  ],
  area: 7.77,
};
