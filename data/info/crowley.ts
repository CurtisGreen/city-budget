import { CityInfo } from "@/lib/types";

export const crowleyInfo: CityInfo = {
  id: "crowley",
  name: "Crowley",
  populations: [
    { year: 1980, value: 5852 },
    { year: 1990, value: 6974 },
    { year: 2000, value: 7467 },
    { year: 2010, value: 12838 },
    { year: 2020, value: 18070 },
    { year: 2025, value: 20954 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.474528,
      isRate: 0.222301,
    },
    {
      fiscalYear: 2016,
      moRate: 0.512894,
      isRate: 0.226376,
    },
    {
      fiscalYear: 2017,
      moRate: 0.513591,
      isRate: 0.225679,
    },
    {
      fiscalYear: 2018,
      moRate: 0.514161,
      isRate: 0.204839,
    },
    {
      fiscalYear: 2019,
      moRate: 0.501279,
      isRate: 0.207721,
    },
    {
      fiscalYear: 2020,
      moRate: 0.486408,
      isRate: 0.195584,
    },
    {
      fiscalYear: 2021,
      moRate: 0.51291,
      isRate: 0.186896,
    },
    {
      fiscalYear: 2022,
      moRate: 0.526103,
      isRate: 0.203442,
    },
    {
      fiscalYear: 2023,
      moRate: 0.499736,
      isRate: 0.145467,
    },
    {
      fiscalYear: 2024,
      moRate: 0.459734,
      isRate: 0.135156,
    },
    {
      fiscalYear: 2025,
      moRate: 0.47726,
      isRate: 0.13104,
    },
    {
      fiscalYear: 2026,
      moRate: 0.497181,
      isRate: 0.140348,
    },
  ],
  revenueBySource: {
    property: 11306065,
    sales: 6571228,
    hotel: 0,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Crime Control and Prevention District", percent: 0.5 },
    { usage: "Economic Development Corporation", percent: 0.5 },
  ],
  area: 7.31,
};
