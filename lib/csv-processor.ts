import type { CityFinancialData, CityMetrics } from "./types"

export function parseCSV(csvContent: string): Record<string, any>[] {
  const lines = csvContent.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim())

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim())
    const row: Record<string, any> = {}

    headers.forEach((header, index) => {
      const value = values[index]
      // Try to parse as number, otherwise keep as string
      row[header] = isNaN(Number(value)) ? value : Number(value)
    })

    return row
  })
}

export function calculateMetrics(data: CityFinancialData): CityMetrics {
  return {
    netFinancialPosition: data.totalAssets - data.totalLiabilities,
    financialAssetsToLiabilities: data.totalLiabilities > 0 ? data.financialAssets / data.totalLiabilities : 0,
    totalAssetsToLiabilities: data.totalLiabilities > 0 ? data.totalAssets / data.totalLiabilities : 0,
    netDebtToRevenue: data.totalRevenue > 0 ? data.netDebt / data.totalRevenue : 0,
    interestToRevenue: data.totalRevenue > 0 ? data.interest / data.totalRevenue : 0,
    netBookValueToCost: data.costOfTangibleCapitalAssets > 0 ? data.netBookValue / data.costOfTangibleCapitalAssets : 0,
    governmentTransfersToRevenue: data.totalRevenue > 0 ? data.governmentTransfers / data.totalRevenue : 0,
  }
}

export function calculateAverageMetrics(allCitiesData: CityFinancialData[][]): CityMetrics[] {
  // Group by year
  const yearMap = new Map<number, CityFinancialData[]>()

  allCitiesData.forEach((cityData) => {
    cityData.forEach((yearData) => {
      if (!yearMap.has(yearData.year)) {
        yearMap.set(yearData.year, [])
      }
      yearMap.get(yearData.year)!.push(yearData)
    })
  })

  // Calculate average for each year
  const averages: CityMetrics[] = []

  Array.from(yearMap.entries())
    .sort(([a], [b]) => a - b)
    .forEach(([year, dataPoints]) => {
      const avgData: CityFinancialData = {
        year,
        totalRevenue: average(dataPoints.map((d) => d.totalRevenue)),
        totalAssets: average(dataPoints.map((d) => d.totalAssets)),
        totalLiabilities: average(dataPoints.map((d) => d.totalLiabilities)),
        financialAssets: average(dataPoints.map((d) => d.financialAssets)),
        netDebt: average(dataPoints.map((d) => d.netDebt)),
        interest: average(dataPoints.map((d) => d.interest)),
        governmentTransfers: average(dataPoints.map((d) => d.governmentTransfers)),
        netBookValue: average(dataPoints.map((d) => d.netBookValue)),
        costOfTangibleCapitalAssets: average(dataPoints.map((d) => d.costOfTangibleCapitalAssets)),
      }

      averages.push(calculateMetrics(avgData))
    })

  return averages
}

function average(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length
}
