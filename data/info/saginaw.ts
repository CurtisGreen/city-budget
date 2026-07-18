import { CityInfo } from "@/lib/types";

export const saginawInfo: CityInfo = {
  id: "saginaw",
  name: "Saginaw",
  populations: [
    { year: 1980, value: 5736 },
    { year: 1990, value: 8551 },
    { year: 2000, value: 12374 },
    { year: 2010, value: 19806 },
    { year: 2020, value: 23890 },
    { year: 2025, value: 26706 },
  ],
  propertyValues: [
    {
      fiscalYear: 2015,
      moRate: 0.298511,
      isRate: 0.211489,
    },
    {
      fiscalYear: 2016,
      moRate: 0.291937,
      isRate: 0.252063,
    },
    {
      fiscalYear: 2017,
      moRate: 0.293308,
      isRate: 0.219692,
    },
    {
      fiscalYear: 2018,
      moRate: 0.284186,
      isRate: 0.210814,
    },
    {
      fiscalYear: 2019,
      moRate: 0.291129,
      isRate: 0.180671,
    },
    {
      fiscalYear: 2020,
      moRate: 0.281655,
      isRate: 0.177345,
    },
    {
      fiscalYear: 2021,
      moRate: 0.284238,
      isRate: 0.177341,
    },
    {
      fiscalYear: 2022,
      moRate: 0.285058,
      isRate: 0.194458,
    },
    {
      fiscalYear: 2023,
      moRate: 0.273156,
      isRate: 0.234886,
    },
    {
      fiscalYear: 2024,
      moRate: 0.263959,
      isRate: 0.23481,
    },
    {
      fiscalYear: 2025,
      moRate: 0.27533,
      isRate: 0.218417,
    },
    {
      fiscalYear: 2026,
      moRate: 0.305752,
      isRate: 0.223897,
    },
  ],
  revenueBySource: {
    property: 15294001,
    sales: 10147310,
    hotel: 110360,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1.5 },
    { usage: "Crime Control and Prevention District", percent: 0.375 },
    { usage: "Street Maintenance", percent: 0.125 },
  ],
  area: 7.65,
  notes: [
    `ACFR 2017: "Donated streets and drainage for the Spring Creek phase 2 development ($852,534)." [...] "Donated streets and drainage for the Willow Vista 3B development ($398,390)." [...] "Donated water and sewer lines for Spring Creek phase 2 and Willow Vista 3B ($814,640)."`,
    `ACFR 2020: "Certificates of Obligation ($20.5 million) were issued in 2020 for the design and construction of a new central fire station, and design for Knowles Drive and Old Decatur Road North."`,
    `ACFR 2025: "In August 2025, the City issued General Obligation Bonds, Series 2025, in the amount of $17,410,000."`,
  ],
};
