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
      Police: "Public safety",
      Fire: "Public safety",
      "Municipal court": "Public safety",
    },
    modifiedAccrualGroups: {
      Administrative: "General government",
      Police: "Public safety",
      Fire: "Public safety",
      "Municipal court": "Public safety",
      Court: "Public safety",
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
  crowley: {
    fullAccrualGroups: {
      "Fire and ambulance": "Public safety",
      "Municipal court": "Public safety",
      "Administration and finance": "General government",
      "Recreation center": "Parks and recreation",
      Parks: "Parks and recreation",
      "Senior citizens center": "Parks and recreation",
      "Community center": "Parks and recreation",
    },
    modifiedAccrualGroups: {
      "Fire and ambulance": "Public safety",
      "Municipal court": "Public safety",
      "Administrative and finance": "General government",
      "Recreation center": "Parks and recreation",
      Parks: "Parks and recreation",
      "Senior citizens center": "Parks and recreation",
      "Community center": "Parks and recreation",
    },
    notes: {
      "Parks and recreation":
        "Contains recreation center, parks, senior citizens center, community center",
    },
  },
  "cockrell-hill": {
    fullAccrualGroups: {},
    modifiedAccrualGroups: {
      "Administration and non-departmental": "General government",
      Police: "Public safety",
      Fire: "Public safety",
      "Municipal court": "Public safety",
      "Code enforcement": "Public safety",
      "Cultural and recreational": "Parks, recreation and culture",
    },
    notes: {
      "Public safety":
        "FY2021 onward the reports split police, fire, municipal court and code enforcement",
    },
  },
  "grand-prairie": {
    fullAccrualGroups: {
      "Support services": "General government",
    },
    modifiedAccrualGroups: {
      "Support services": "General government",
    },
    notes: {
      "General government":
        "Renamed from 'Support services' to be more consistent with other cities",
    },
  },
  wilmer: {
    fullAccrualGroups: {
      "Community services": "Public works",
      "Cultural and recreational": "Community development",
      "Community development": "Community development",
      "Interest on long-term debt": "Interest on Long-Term Debt",
      "Interest and fiscal charges": "Interest on Long-Term Debt",
    },
    modifiedAccrualGroups: {},
    notes: {
      "Community development":
        "FY2017-2019 'Cultural and recreational', renamed 'Community development' from FY2020",
    },
  },
  "red-oak": {
    fullAccrualGroups: {
      "Cultural and recreational": "Culture and recreation",
      "Interest on long-term government": "Interest on Long-Term Debt",
      "Interest and fiscal charges": "Interest on Long-Term Debt",
      "Interest on long term debt": "Interest on Long-Term Debt",
    },
    modifiedAccrualGroups: {},
    notes: {},
  },
  fairview: {
    fullAccrualGroups: {
      "Interest and fiscal charges": "Interest on long-term debt",
      "Interest on long-term debt": "Interest on long-term debt",
    },
    modifiedAccrualGroups: {},
    notes: {},
  },
  northlake: {
    fullAccrualGroups: {
      "Municipal court": "Public safety",
      Police: "Public safety",
      "Interest on long-term debt": "Interest and fiscal charges",
    },
    modifiedAccrualGroups: {},
    notes: {},
  },
  mesquite: {
    fullAccrualGroups: {
      "Field services": "Public works",
    },
    modifiedAccrualGroups: {
      "Field services": "Public works",
      "Housing services": "Housing and community services",
      "Community services": "Housing and community services",
    },
    notes: {
      "Public works":
        "FY2015 reported 'Field services' separately; combined into Public works from FY2016",
      "Housing and community services":
        "FY2015 split 'Housing services' and 'Community services'; combined from FY2016",
    },
  },
  bedford: {
    fullAccrualGroups: {},
    modifiedAccrualGroups: {
      Police: "Public safety",
      Fire: "Public safety",
      "Leisure services": "Community services",
    },
    notes: {
      "Community services": "Also contains 'Leisure services' separately",
    },
  },
  benbrook: {
    fullAccrualGroups: {
      "Interest on long-term debt": "Interest and fiscal charges",
      "Payments to discrete component units": "Payment to TIF",
    },
    modifiedAccrualGroups: {
      "Public service": "Public works",
      "Payments to discrete component units": "Payment to TIF",
    },
    notes: {
      "Payment to TIF":
        "FY2023 relabels as Payments to discrete component units",
    },
  },
  burleson: {
    fullAccrualGroups: {
      "Interest and other fees": "Interest on long-term debt",
      "Culture and recreation": "Culture and recreation",
      "Parks and recreation": "Culture and recreation",
      Library: "Culture and recreation",
    },
    modifiedAccrualGroups: {
      "Culture and recreation": "Culture and recreation",
      "Parks and recreation": "Culture and recreation",
      Library: "Culture and recreation",
    },
    notes: {
      "Culture and recreation":
        "FY2022 onward splits into 'Parks and recreation' and 'Library'",
    },
  },
};
