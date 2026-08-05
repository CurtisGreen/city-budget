// Maps a raw ACFR line-item name -> display bucket. Members sharing a bucket are summed per year
export interface ExpenseCategoryGroup {
  fullAccrualGroups: Record<string, string>;
  modifiedAccrualGroups: Record<string, string>;
  notes: Record<string, string>;
}

// City-specific groupings for cities whose ACFR renames/splits functions across years.
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
    // Same as the accrual map but without the Streets/Parks and Finance/Planning consolidation
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
      "Administration": "General government",
      "City secretary": "General government",
    },
    notes: {
      "Public Safety": "Contains: Public Safety, Fire, Fire Marshall, Court",
      "Economic development": "FY2025 relabels as 'Building services'.",
      "Information Technology":
        "Reported as 'Non-departmental' through FY2023, FY2025 relabels as 'Information technology'.",
      "Streets and parks":
        "FY2017 onward combines 'Streets and parks' for full-accrual",
      "Finance and planning":
        "FY2017 onward combines 'Finance and planning' for full-accural.",
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
};
