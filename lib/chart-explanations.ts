import type { ChartExplanation } from "./types";

export const chartExplanations: Record<string, ChartExplanation> = {
  netFinancialPosition: {
    title: "Net Financial Position",
    description:
      "The difference between financial assets and total liabilities",
    whatItMeans:
      "This ratio shows whether the city has enough liquid financial resources to cover what it owes. A ratio below 1 means it would not be able to pay off its liabilities using only its financial assets.",
    whatToLookFor:
      "A rising trend means the city is improving its financial buffer. A falling trend suggests the city is becomign less able to handle its obligations without borrowing or cutting services.",
  },
  financialAssetsToLiabilities: {
    title: "Financial Assets to Total Liabilities",
    description: "The ratio of liquid assets to total debts",
    whatItMeans:
      "This measures how much of the city's debt could be paid off with readily available financial assets.",
    whatToLookFor:
      "Higher ratios (above 1.0) indicate strong liquidity. Values below 0.5 may indicate liquidity concerns.",
  },
  totalAssetsToLiabilities: {
    title: "Total Assets to Total Liabilities",
    description: "The ratio of all assets to all liabilities",
    whatItMeans:
      "This shows the city's overall solvency - its ability to cover all debts with all assets.",
    whatToLookFor:
      "Ratios above 2.0 are generally healthy. Declining trends may indicate growing debt burdens.",
  },
  netDebtToRevenue: {
    title: "Net Debt to Total Revenues",
    description:
      "Total liabilities minus financial assets divided by annual revenues",
    whatItMeans:
      "This shows how many years of income it would take to pay off all debts if every dollar went to debt repayment.",
    whatToLookFor:
      "If the ratio is rising, debt is growing faster than income, this is unsustainable. If it's falling the city is gaining control of its obliations.",
    note: "If this graph shows a flat line after 0, this means the city has a net surplus (no net debt).",
  },
  interestToRevenue: {
    title: "Interest to Total Revenues",
    description: "The percentage of revenues spent on debt interest",
    whatItMeans:
      "This shows how much of the city's income goes to servicing debt rather than providing services.",
    whatToLookFor:
      "An increasing trend limits future choices and can crowd out basic services. A decreasing trend improves flexibility and budget health.",
  },
  netBookValueToCost: {
    title: "Net Book Value to Cost of Tangible Capital Assets",
    description: "The ratio of current asset value to original cost",
    whatItMeans:
      "This indicates the age and condition of the city's infrastructure - roads, buildings, equipment.",
    whatToLookFor:
      "Higher values indicate newer infrastructure. Low values (below 0.5) suggest aging assets needing replacement.",
  },
  externalTransfersToRevenue: {
    title: "External Transfers to Total Revenue",
    description: "The percentage of revenue from state/federal transfers",
    whatItMeans:
      "This shows how dependent the city is on government grants and other transfers versus local revenue.",
    whatToLookFor:
      "If the trend is rising, the city is becoming more dependent on outside help. If it's falling, the city is strengthening its local revenue base.",
  },
};
