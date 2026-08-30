// Maps a raw ACFR line-item name -> display bucket. Members sharing a bucket are summed per year
export interface ExpenseCategoryGroup {
  fullAccrualGroups: Record<string, string>;
  modifiedAccrualGroups: Record<string, string>;
  notes: Record<string, string>;
}

// City-specific groupings for cities whose ACFR renames/splits functions across years
export const expenseCategoryGroups: Record<string, ExpenseCategoryGroup> = {
  haslet: {
    fullAccrualGroups: {
      "Interest on long-term debt": "Interest on Long-Term Debt",
      "Interest and charges on long-term debt": "Interest on Long-Term Debt",
      Amortization: "Interest on Long-Term Debt",
      "Economic development": "Economic Development",
      "Building services": "Economic Development",
      "Non-departmental": "Information Technology",
      Nondepartmental: "Information Technology",
      "Information technology": "Information Technology",
      "Public safety": "Public Safety",
      Fire: "Public Safety",
      Court: "Public Safety",
      "Fire marshall": "Public Safety",
      Streets: "Streets and parks",
      Parks: "Streets and parks",
      Finance: "Finance and planning",
      Planning: "Finance and planning",
      "City secretary": "General government",
    },
    modifiedAccrualGroups: {
      "Interest on long-term debt": "Interest on Long-Term Debt",
      "Interest and charges on long-term debt": "Interest on Long-Term Debt",
      Amortization: "Interest on Long-Term Debt",
      "Economic development": "Economic Development",
      "Building services": "Economic Development",
      "Non-departmental": "Information Technology",
      Nondepartmental: "Information Technology",
      "Information technology": "Information Technology",
      "Public safety": "Public Safety",
      Fire: "Public Safety",
      Court: "Public Safety",
      "Fire marshall": "Public Safety",
      Streets: "Streets and parks",
      Parks: "Streets and parks",
      Finance: "Finance and planning",
      Planning: "Finance and planning",
      Administration: "General government",
      "City secretary": "General government",
    },
    notes: {
      "Public Safety": "Contains: Public Safety, Fire, Fire Marshall, Court",
      "Economic development": "FY2025 relabels as 'Building services'",
      "Information Technology":
        "Reported as 'Non-departmental' through FY2023, FY2025 relabels as 'Information technology'",
      "Streets and parks":
        "FY2017 onward combines 'Streets and parks' for full-accrual",
      "Finance and planning":
        "FY2017 onward combines 'Finance and planning' for full-accural",
    },
  },
  dallas: {
    fullAccrualGroups: {
      "Code enforcement": "Public Works",
      "Streets, street lighting, sanitation and code enforcement":
        "Public Works",
      "Streets, street lighting & code enforcement": "Public Works",
      "Public works and transportation": "Public Works",
      "Streets, public works, and transportation": "Public Works",
    },
    modifiedAccrualGroups: {
      "Code enforcement": "Public Works",
      "Streets, street lighting, sanitation and code enforcement":
        "Public Works",
      "Streets, street lighting & code enforcement": "Public Works",
      "Public works and transportation": "Public Works",
      "Streets, public works, and transportation": "Public Works",
    },
    notes: {
      "Public Works":
        "Contains: code enforcement, streets & street lighting, sanitation, and public works & transportation. Dallas recategorized these functions across years.",
    },
  },
  richardson: {
    fullAccrualGroups: {},
    modifiedAccrualGroups: {
      "General administration": "General government",
    },
    notes: {
      "General government": "Contains: General government, administration",
    },
  },
  "farmers-branch": {
    fullAccrualGroups: {
      "Interest on long-term debt": "Interest on long-term debt",
      "Interest on long term debt": "Interest on long-term debt",
    },
    modifiedAccrualGroups: {},
    notes: {},
  },
  parker: {
    fullAccrualGroups: {
      Transportation: "Public works",
      "Public works": "Public works",
    },
    modifiedAccrualGroups: {
      "Parks and recreation": "Culture and recreation",
      "Culture and recreation": "Culture and recreation",
      "Police department": "Public safety",
      "Fire department": "Public safety",
      "Municipal court": "Public safety",
      "City property": "General government",
    },
    notes: {
      "Public works":
        "FY2015-2019 'Transportation', renamed 'Public works' from FY2020",
      "Culture and recreation": "Includes parks",
    },
  },
  princeton: {
    fullAccrualGroups: {
      Library: "Culture and recreation",
      "Parks and recreation": "Culture and recreation",
      "Culture and recreation": "Culture and recreation",
      Interest: "Interest on long-term debt",
      "Interest on long-term debt": "Interest on long-term debt",
    },
    modifiedAccrualGroups: {
      Library: "Culture and recreation",
      "Parks and recreation": "Culture and recreation",
      "Culture and recreation": "Culture and recreation",
      "Public services and operation": "Public services and operations",
      "Public services and operations": "Public services and operations",
    },
    notes: {
      "Culture and recreation": "Contains library and parks",
    },
  },
  lucas: {
    fullAccrualGroups: {
      "Interest and fiscal charges": "Interest on long-term debt",
      "Interest expense": "Interest on long-term debt",
    },
    modifiedAccrualGroups: {},
    notes: {},
  },
  "dalworthington-gardens": {
    fullAccrualGroups: {
      Theft: "General government",
    },
    modifiedAccrualGroups: {
      Court: "Municipal court",
      Administrative: "General government",
    },
    notes: {},
  },
  pantego: {
    fullAccrualGroups: {
      "Municipal court": "General government",
      // "Community relations": "Other",
    },
    modifiedAccrualGroups: {
      "Municipal court": "General government",
      // "Community relations": "Other",
    },
    notes: {},
  },
};
