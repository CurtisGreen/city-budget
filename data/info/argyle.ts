import { CityInfo } from "@/lib/types";

export const argyleInfo: CityInfo = {
  id: "argyle",
  name: "Argyle",
  populations: [
    { year: 1980, value: 1111 },
    { year: 1990, value: 1575 },
    { year: 2000, value: 2365 },
    { year: 2010, value: 3282 },
    { year: 2020, value: 4403 },
    { year: 2025, value: 6372 },
  ],
  propertyValues: [
    { fiscalYear: 2015, moRate: 0.31945, isRate: 0.07805 },
    { fiscalYear: 2016, moRate: 0.31945, isRate: 0.07805 },
    { fiscalYear: 2017, moRate: 0.30445, isRate: 0.09305 },
    { fiscalYear: 2018, moRate: 0.3011, isRate: 0.09739 },
    { fiscalYear: 2019, moRate: 0.3011, isRate: 0.09739 },
    { fiscalYear: 2020, moRate: 0.30011, isRate: 0.09739 },
    { fiscalYear: 2021, moRate: 0.3021, isRate: 0.09541 },
    { fiscalYear: 2022, moRate: 0.29861, isRate: 0.079583 },
    { fiscalYear: 2023, moRate: 0.263677, isRate: 0.10167 },
    { fiscalYear: 2024, moRate: 0.246157, isRate: 0.096954 },
    { fiscalYear: 2025, moRate: 0.241942, isRate: 0.101169 },
    { fiscalYear: 2026, moRate: 0.2419, isRate: 0.1012 },
  ],
  revenueBySource: {
    property: 4845793,
    sales: 3580700,
    hotel: 0,
  },
  salesTaxUsage: [
    { usage: "General Fund", percent: 1 },
    { usage: "Street Maintenance Fund", percent: 0.5 },
    { usage: "Crime Control and Prevention District", percent: 0.25 },
    { usage: "Municipal Development District", percent: 0.25 },
  ],
  area: 11.56,
};
