import { CityInfo } from "@/lib/types";

export const haltomCityInfo: CityInfo = {
  id: "haltom-city",
  name: "Haltom City",
  populations: [
    { year: 1980, value: 29014 },
    { year: 1990, value: 32856 },
    { year: 2000, value: 39018 },
    { year: 2010, value: 42409 },
    { year: 2020, value: 46073 },
    { year: 2025, value: 45542 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.47999,
      isRate: 0.22,
    },
    {
      fiscalYear: 2016,
      moRate: 0.46232,
      isRate: 0.23767,
    },
    {
      fiscalYear: 2017,
      moRate: 0.46232,
      isRate: 0.23767,
    },
    {
      fiscalYear: 2018,
      moRate: 0.45518,
      isRate: 0.213,
    },
    {
      fiscalYear: 2019,
      moRate: 0.423,
      isRate: 0.23,
    },
    {
      fiscalYear: 2020,
      moRate: 0.41373,
      isRate: 0.25203,
    },
    {
      fiscalYear: 2021,
      moRate: 0.40375,
      isRate: 0.26201,
    },
    {
      fiscalYear: 2022,
      moRate: 0.395769,
      isRate: 0.249882,
    },
    {
      fiscalYear: 2023,
      moRate: 0.376427,
      isRate: 0.231735,
    },
    {
      fiscalYear: 2024,
      moRate: 0.371831,
      isRate: 0.195452,
    },
    {
      fiscalYear: 2025,
      moRate: 0.386103,
      isRate: 0.194624,
    },
    {
      fiscalYear: 2026,
      moRate: 0.36924,
      isRate: 0.188050,
    },
  ],
  revenueBySource: {
    property: 22136941,
    sales: 18351400,
    hotel: 124918,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1.375 },
    { usage: "Street Maintenance", percent: 0.375 },
    { usage: "Crime Control and Prevention District", percent: 0.25 },
  ],
  area: 12.35,
  notes: [
    `ACFR 2016: "operating grants and capital grants were lower due to conclusion of grants from Department of Transportation and North Texas Council of Government"`,
    `ACFR 2021: "The increase in the fund was approximately $25.3 million, caused by the issuance of debt"`,
    `ACFR 2022: "The increase in the fund was approximately $28.8 million, caused by the issuance of debt in FY22"`,
    `ACFR 2023: "the one-time revenue recognition of the Coronavirus State and Local Fiscal Recovery Funds (SLFRF) program authorized by the American Rescue Plan Act in 2021"`,
  ],
};
