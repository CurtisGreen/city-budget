export interface ExpenseCategoryGroup {
  // Maps a raw ACFR line-item name -> display bucket. Members sharing a bucket are summed per year.
  groups: Record<string, string>;
  notes: Record<string, string>;
}

// City-specific groupings for cities whose ACFR renames/splits functions across years.
export const expenseCategoryGroups: Record<string, ExpenseCategoryGroup> = {
  haslet: {
    groups: {
      "Interest on long-term debt": "Interest on Long-Term Debt",
      "Interest and charges on long-term debt": "Interest on Long-Term Debt",
      "Economic development": "Building Services",
      "Building services": "Building Services",
      "Non-departmental": "Information Technology",
      "Information technology": "Information Technology",
    },
    notes: {
      "Interest on Long-Term Debt":
        "Haslet renamed this line from 'Interest on long-term debt' to 'Interest and charges on long-term debt' beginning with the FY2025 report.",
      "Building Services":
        "Reported as 'Economic development' through FY2023. The FY2025 report relabels FY2024's identical $14,250 as 'Building services'.",
      "Information Technology":
        "Reported as 'Non-departmental' through FY2023. The FY2025 report relabels FY2024's identical $865,253 as 'Information technology'.",
    },
  },
  dallas: {
    groups: {
      "Code enforcement": "Public Works",
      "Streets, street lighting, sanitation and code enforcement":
        "Public Works",
      "Streets, street lighting & code enforcement": "Public Works",
      "Public works and transportation": "Public Works",
      "Streets, public works, and transportation": "Public Works",
    },
    notes: {
      "Public Works":
        "Public Works contains code enforcement, streets & street lighting, sanitation, and public works & transportation. Dallas recategorized these functions across years.",
    },
  },
};
