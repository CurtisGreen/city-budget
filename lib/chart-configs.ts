import type { ChartConfig } from "./types";

export const chartConfigs: Record<string, ChartConfig> = {
  netFinancialPosition: {
    title: "Net Financial Position",
    description:
      "The difference between financial assets and total liabilities. This is the cumulative surplus/deficit the city has accumulated through successive budget cycles.",
    whatItMeans:
      "A positive net financial position says the city has more financial assets than obligations and is in a better position to weather downturns, invest in infrastructure, or respond to emergencies without borrowing or service cuts. If this number is negative the city has spent more than it has saved and is relying on future revenue to pay past bills",
    whatToLookFor:
      "A rising trend means the city is improving its financial buffer. A falling trend suggests the city is becomign less able to handle its obligations without borrowing or cutting services.",
    positiveDirection: "up",
    upwardDescription: "More Sustainable",
    downwardDescription: "Less Sustainable",
  },
  financialAssetsToLiabilities: {
    title: "Financial Assets to Liabilities",
    description: "The ratio of liquid assets to total liabilities",
    whatItMeans:
      "This ratio shows whether the city has enough liquid financial resources to cover what it owes. A ratio below 1 means it would not be able to pay off its liabilities using only its financial assets.",
    whatToLookFor:
      "A rising trend means the city is improving its financial buffer. A falling trend suggests the city is becomign less able to handle its obligations without borrowing or cutting services.",
    positiveDirection: "up",
    upwardDescription: "More Sustainable",
    downwardDescription: "Less Sustainable",
  },
  assetsToLiabilities: {
    title: "Assets to Liabilities",
    description:
      "The value of all the city's assets (including infrastructure) divided by its total liabilities.",
    whatItMeans:
      "A ratio above 1 means the city owns more than it owes (solvent). Below 1 means it owes more than it owns (insolvent).",
    whatToLookFor:
      "A downward trend means the city is becoming less solvent. An upward trend shows improving financial resilience.",
    positiveDirection: "up",
    upwardDescription: "More Sustainable",
    downwardDescription: "Less Sustainable",
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
    positiveDirection: "down",
    upwardDescription: "Less Sustainable",
    downwardDescription: "More Sustainable",
  },
  interestToRevenue: {
    title: "Interest to Total Revenues",
    description: "The percentage of revenues spent on debt interest",
    whatItMeans:
      "This shows how much of the city's income goes to servicing debt rather than providing services.",
    whatToLookFor:
      "An increasing trend limits future choices and can crowd out basic services. A decreasing trend improves flexibility and budget health.",
    positiveDirection: "down",
    upwardDescription: "Less Flexible",
    downwardDescription: "More Flexible",
  },
  netBookValueToCostOfTCA: {
    title: "Net Book Value to Cost of Tangible Capital Assets",
    description:
      "The current value of the city's physical assets compared to their original cost.",
    whatItMeans:
      "This indicates how well the city is maintaining its infrastructure. A low value means assets are aging and wearing out.",
    whatToLookFor:
      "A declining trend means the city is falling behind on maintenance. A stable or rising trend suggests it is keeping up.",
    positiveDirection: "up",
    upwardDescription: "More Flexible",
    downwardDescription: "Less Flexible",
    range: [0.4, 0.8],
  },
  externalTransfersToRevenue: {
    title: "External Transfers to Total Revenue",
    description: "The percentage of revenue from capital and operating grants",
    whatItMeans:
      "This shows how dependent the city is on government grants and other one-time transfers versus local revenue.",
    whatToLookFor:
      "If the trend is rising, the city is becoming more dependent on outside help. If it's falling, the city is strengthening its local revenue base.",
    positiveDirection: "down",
    upwardDescription: "More Vulnerable",
    downwardDescription: "Less Vulnerable",
  },
};
