import { CityInfo } from "@/lib/types";

export const arlingtonInfo: CityInfo = {
  id: "arlington",
  name: "Arlington",
  population: 413955,
  populations: [
    { year: 1980, value: 160113 },
    { year: 1990, value: 261721 },
    { year: 2000, value: 332969 },
    { year: 2010, value: 365438 },
    { year: 2020, value: 394266 },
    { year: 2025, value: 413955 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.446,
      isRate: 0.202,
    },
    {
      fiscalYear: 2016,
      moRate: 0.4538,
      isRate: 0.191,
    },
    {
      fiscalYear: 2017,
      moRate: 0.4409,
      isRate: 0.1989,
    },
    {
      fiscalYear: 2018,
      moRate: 0.4428,
      isRate: 0.192,
    },
    {
      fiscalYear: 2019,
      moRate: 0.4467,
      isRate: 0.1773,
    },
    {
      fiscalYear: 2020,
      moRate: 0.4085,
      isRate: 0.214,
    },
    {
      fiscalYear: 2021,
      moRate: 0.4098,
      isRate: 0.21,
    },
    {
      fiscalYear: 2022,
      moRate: 0.403,
      isRate: 0.1968,
    },
    {
      fiscalYear: 2023,
      moRate: 0.408,
      isRate: 0.1818,
    },
    {
      fiscalYear: 2024,
      moRate: 0.4146,
      isRate: 0.1852,
    },
    {
      fiscalYear: 2025,
      moRate: 0.4146,
      isRate: 0.1852,
    },
    {
      fiscalYear: 2026,
      moRate: 0.4446,
      isRate: 0.1852,
    },
  ],
  salesTaxBreakdown: [
    { category: "Public Safety", percentage: 42, amount: 147000000 },
    { category: "Transportation", percentage: 24, amount: 84000000 },
    { category: "Parks & Recreation", percentage: 16, amount: 56000000 },
    { category: "Community Services", percentage: 11, amount: 38500000 },
    { category: "Administration", percentage: 7, amount: 24500000 },
  ],
  latitude: 32.705,
  longitude: -97.122778,
  area: 95.84,
  notes: [
    `FY 2026 Budget: [...] the property tax base grew by 1.9% in FY 2026. While the total assessed value of property in Arlington has not decreased, this is the lowest rate of growth in assessed value since FY 2012—even lower than FY 2021, when property values were most severely impacted by the Covid-19 Pandemic.
    This is not necessarily an indication of a slowdown in growth in market values but is largely a reflection of policy decisions by the Tarrant Appraisal District, which shifted state policy and elected not to reappraise properties in Tarrant County this year, notable impacting on the City's ability to generate revenue for programs and services for its residents.`,
  ],
};
