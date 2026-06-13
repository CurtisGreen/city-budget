import { CityInfo } from "@/lib/types";

export const kellerInfo: CityInfo = {
  id: "keller",
  name: "Keller",
  populations: [
    { year: 1980, value: 4156 },
    { year: 1990, value: 13683 },
    { year: 2000, value: 27345 },
    { year: 2010, value: 39627 },
    { year: 2020, value: 45776 },
    { year: 2025, value: 46078 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.320090,
      isRate: 0.117100,
    },
    {
      fiscalYear: 2016,
      moRate: 0.323170,
      isRate: 0.111520,
    },
    {
      fiscalYear: 2017,
      moRate: 0.313578,
      isRate: 0.116422,
    },
    {
      fiscalYear: 2018,
      moRate: 0.318985,
      isRate: 0.108515,
    },
    {
      fiscalYear: 2019,
      moRate: 0.332943,
      isRate: 0.080307,
    },
    {
      fiscalYear: 2020,
      moRate: 0.318276,
      isRate: 0.081624,
    },
    {
      fiscalYear: 2021,
      moRate: 0.32419,
      isRate: 0.07081,
    },
    {
      fiscalYear: 2022,
      moRate: 0.33603,
      isRate: 0.05897,
    },
    {
      fiscalYear: 2023,
      moRate: 0.299234,
      isRate: 0.055266,
    },
    {
      fiscalYear: 2024,
      moRate: 0.260403,
      isRate: 0.051597,
    },
    {
      fiscalYear: 2025,
      moRate: 0.24762,
      isRate: 0.0435,
    },
    {
      fiscalYear: 2026,
      moRate: 0.24502,
      isRate: 0.04198,
    },
  ],
  revenueBySource: {
    property: 23747476,
    sales: 18881959,
    hotel: 233794,
  },
  revenues: [
    {
      fiscalYear: 2024,
      property: 23747476,
      sales: 18881959,
      hotel: 233794,
    },
    {
      fiscalYear: 2025,
      property: 23766426,
      sales: 19303861,
      hotel: 227734,
    },
  ],
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Park Development Corporation", percent: 0.5 },
    { usage: "Crime Control and Prevention District", percent: 0.25 },
    { usage: "Street Maintenance", percent: 0.25 },
  ],
  area: 18.45,
};
