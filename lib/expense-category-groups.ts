export interface ExpenseCategoryGroup {
  // Maps a raw ACFR line-item name -> display bucket. Members sharing a bucket are summed per year.
  groups: Record<string, string>;
  notes: Record<string, string>;
}

// City-specific groupings for cities whose ACFR renames/splits functions across years.
export const expenseCategoryGroups: Record<string, ExpenseCategoryGroup> = {
  dallas: {
    groups: {
      "Code enforcement": "Public Works",
      "Streets, street lighting, sanitation and code enforcement": "Public Works",
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
