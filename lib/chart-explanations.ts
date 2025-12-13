import type { ChartExplanation } from "./types"

export const chartExplanations: Record<string, ChartExplanation> = {
  netFinancialPosition: {
    title: "Net Financial Position",
    description: "The difference between total assets and total liabilities",
    whatItMeans:
      "This shows the overall financial health of the city. A positive value means the city has more assets than debts.",
    whatToLookFor:
      "A growing trend indicates improving financial health. Declining values may signal financial stress.",
  },
  financialAssetsToLiabilities: {
    title: "Financial Assets to Total Liabilities",
    description: "The ratio of liquid assets to total debts",
    whatItMeans: "This measures how much of the city's debt could be paid off with readily available financial assets.",
    whatToLookFor:
      "Higher ratios (above 1.0) indicate strong liquidity. Values below 0.5 may indicate liquidity concerns.",
  },
  totalAssetsToLiabilities: {
    title: "Total Assets to Total Liabilities",
    description: "The ratio of all assets to all liabilities",
    whatItMeans: "This shows the city's overall solvency - its ability to cover all debts with all assets.",
    whatToLookFor: "Ratios above 2.0 are generally healthy. Declining trends may indicate growing debt burdens.",
  },
  netDebtToRevenue: {
    title: "Net Debt to Total Revenues",
    description: "The ratio of net debt to annual revenues",
    whatItMeans: "This indicates how many years of revenue it would take to pay off the city's net debt.",
    whatToLookFor: "Lower values are better. Ratios above 2.0 may indicate high debt levels relative to income.",
  },
  interestToRevenue: {
    title: "Interest to Total Revenues",
    description: "The percentage of revenues spent on debt interest",
    whatItMeans: "This shows how much of the city's income goes to servicing debt rather than providing services.",
    whatToLookFor: "Lower percentages are better. Values above 10% may indicate debt is consuming too many resources.",
  },
  netBookValueToCost: {
    title: "Net Book Value to Cost of Tangible Capital Assets",
    description: "The ratio of current asset value to original cost",
    whatItMeans: "This indicates the age and condition of the city's infrastructure - roads, buildings, equipment.",
    whatToLookFor:
      "Higher values indicate newer infrastructure. Low values (below 0.5) suggest aging assets needing replacement.",
  },
  governmentTransfersToRevenue: {
    title: "Government Transfers to Total Revenue",
    description: "The percentage of revenue from state/federal transfers",
    whatItMeans: "This shows how dependent the city is on government grants and transfers versus local revenue.",
    whatToLookFor:
      "High percentages indicate dependency on outside funding. Stable or declining trends show local revenue growth.",
  },
}
