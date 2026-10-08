// Maps a raw ACFR line-item name -> display bucket. Members sharing a bucket are summed per year
export interface ExpenseCategoryGroup {
  fullAccrualGroups: Record<string, string>;
  modifiedAccrualGroups: Record<string, string>;
  notes: Record<string, string>;
}

export function mapDFWExpenseGroups(name: string, groups: Record<string, string>) {
  const mappedName = groups[name] ?? name;
  const n = mappedName.toLowerCase();

  if (name.toLowerCase().includes("court") || name.toLowerCase().includes("judicial")) return "Public safety"

  if (n.includes("public safety") || n.includes("police") || n.includes("fire") || n.includes("emergency")) return "Public safety"
  if (n.includes("public works") || n.includes("street") || n.includes("public services") || n.includes("transport") || n.includes("infrastructure")) return "Public works"
  if (n.includes("culture") || n.includes("recreation") || n.includes("parks") || n.includes("librar") || n.includes("leisure")) return "Parks, culture, and recreation"
  if (n.includes("general government") || n.includes("admin") || n.includes("equipment and building") || n.includes("fleet") || n.includes("facilities management")) return "General government"
  if (n.includes("interest") || n.includes("bond issuance")) return "Interest on long-term debt"
  if (n.includes("animal")) return "Animal services"
  if (n.includes("development") || n.includes("inspect") || n.includes("planning") || n.includes("code")) return "Development services"
  if (n.includes("technolog") || n.includes("information")) return "Technology"
  if (n.includes("health") || n.includes("welfare") || n.includes("human services") || n.includes("environment")) return "Health, welfare, and environmental services"
  if (n.includes("financ")) return "Finance"
  if (n.includes("community")) return "Community services"
  if (n.includes("human resources")) return "Human resources"
  if (n.includes("visit") || n.includes("touris") || n.includes("convention")) return "Visitor services"
  return mappedName;
}

export function mapDFWSalesTaxUsage(usage: string) {
  const n = usage.toLowerCase();

  if (n.includes("general fund")) return "General fund"
  if (n.includes("crime") || n.includes("fire")) return "Public Safety"
  if (n.includes("dart") || n.includes("dcta") || n.includes("trinity metro") || n.includes("texrail")) return "Mass transit"
  if (n.includes("property tax")) return "Property tax relief"
  if (n.includes("street") || n.includes("road") || n.includes("infrastructure")) return "Streets and infrastructure"
  if (n.includes("corporation") || n.includes("development") || n.includes("park") || n.includes("library") || n.includes("epic")) return "Economic and community development corporation"
  return usage;
}

// City-specific groupings for cities whose ACFR renames/splits functions across years
export const expenseCategoryGroups: Record<string, ExpenseCategoryGroup> = {
  "forest-hill": {
    fullAccrualGroups: {
      "General Government": "General government",
      "General government": "General government",
      Nondepartmental: "General government",
      "Public Safety": "Public safety",
      "Public safety": "Public safety",
      "Public Works": "Public works and streets",
      "Public works": "Public works and streets",
      Streets: "Public works and streets",
      "Public Works & Streets": "Public works and streets",
      Library: "Library, parks and recreation",
      Parks: "Library, parks and recreation",
      "Parks & Recreation": "Library, parks and recreation",
      "Parks and recreation": "Library, parks and recreation",
      "Parks and Recreation": "Library, parks and recreation",
      "Culture and recreation": "Library, parks and recreation",
      "Library, Parks & Recreation": "Library, parks and recreation",
      "Community Development": "Community development",
      "Community development": "Community development",
      "Community and Economic Development": "Community development",
      "Community & Economic Development": "Community development",
      "Community & Econ. Development": "Community development",
      "Interest and Fiscal Charges": "Interest on long-term debt",
      "Interest and other charges": "Interest on long-term debt",
      "Interest on long-term debt": "Interest on long-term debt",
      "Interest on Long-Term Debt": "Interest on long-term debt",
    },
    modifiedAccrualGroups: {
      "General Government": "General government",
      "General government": "General government",
      Nondepartmental: "General government",
      "Public Safety": "Public safety",
      "Public safety": "Public safety",
      "Public Works": "Public works and streets",
      "Public works": "Public works and streets",
      Streets: "Public works and streets",
      "Public Works & Streets": "Public works and streets",
      Library: "Library, parks and recreation",
      Parks: "Library, parks and recreation",
      "Parks & Recreation": "Library, parks and recreation",
      "Parks and recreation": "Library, parks and recreation",
      "Parks and Recreation": "Library, parks and recreation",
      "Culture and recreation": "Library, parks and recreation",
      "Library, Parks & Recreation": "Library, parks and recreation",
      "Community Development": "Community development",
      "Community development": "Community development",
      "Community and Economic Development": "Community development",
      "Community & Economic Development": "Community development",
      "Community & Econ. Development": "Community development",
      "Interest and Fiscal Charges": "Interest on long-term debt",
      "Interest and other charges": "Interest on long-term debt",
      "Interest on long-term debt": "Interest on long-term debt",
      "Interest on Long-Term Debt": "Interest on long-term debt",
    },
    notes: {
      "General government":
        "Contains Nondepartmental, which the FY2017-FY2019 reports do not print as a separate function",
      "Public works and streets":
        "Streets is a separate function in FY2016 and FY2020 onward but is inside Public works in FY2017-FY2019",
      "Library, parks and recreation":
        "Contains Library, Parks and FY2017's 'Culture and recreation'; the FY2017 report splits these differently between its audited fund statement and its Statement of Activities",
    },
  },
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
  "little-elm": {
    fullAccrualGroups: {
      "Community service": "Community services",
      "Community services": "Community services",
      "Interest expense": "Interest and fiscal charges",
      "Interest and fiscal charges": "Interest and fiscal charges",
      Interest: "Interest and fiscal charges",
    },
    modifiedAccrualGroups: {},
    notes: {},
  },
  lancaster: {
    fullAccrualGroups: {
      "Interest and fiscal charges": "Interest and fiscal charges",
      Interest: "Interest and fiscal charges",
    },
    modifiedAccrualGroups: {},
    notes: {},
  },
  dallas: {
    fullAccrualGroups: {
      "Code enforcement": "Public works",
      "Streets, street lighting, sanitation and code enforcement":
        "Public works",
      "Streets, street lighting & code enforcement": "Public works",
      "Public works and transportation": "Public works",
      "Streets, public works, and transportation": "Public works",
    },
    modifiedAccrualGroups: {
      "Code enforcement": "Public works",
      "Streets, street lighting, sanitation and code enforcement":
        "Public works",
      "Streets, street lighting & code enforcement": "Public works",
      "Public works and transportation": "Public works",
      "Streets, public works, and transportation": "Public works",
    },
    notes: {
      "Public works":
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
  "glenn-heights": {
    fullAccrualGroups: {
      "Interest and fiscal charges": "Interest on long-term debt",
      "Interest on long-term debt": "Interest on long-term debt",
    },
    modifiedAccrualGroups: {},
    notes: {},
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
  garland: {
    fullAccrualGroups: {},
    modifiedAccrualGroups: {
      Nondepartmental: "General government",
      Operations: "Community services",
      "Issue costs on issuance of debt": "Interest and fiscal charges",
      "Other charges": "Interest and fiscal charges",
    },
    notes: {
      "General government": "Also includes: Nondepartmental",
    },
  },
  wilmer: {
    fullAccrualGroups: {
      "Public works": "Development services",
      "Community services": "Development services",
      "Cultural and recreational": "Culture and recreation",
      "Community development": "Culture and recreation",
      "Interest on long-term debt": "Interest on Long-Term Debt",
      "Interest and fiscal charges": "Interest on Long-Term Debt",
    },
    modifiedAccrualGroups: {},
    notes: {
      "Development services":
        "FY2017-2019 'Public works', labeled 'Community services' in the FY2020+ Statement of Activities (MD&A still says 'Public works'). Matches the Community Services department (permitting, inspections, code enforcement) and its permit-fee revenue",
      "Culture and recreation":
        "FY2017-2019 'Cultural and recreational', labeled 'Community development' in the FY2020+ Statement of Activities (MD&A still says 'Cultural and recreational'). Appears to be Type B (community development corporation) quality-of-life spending such as recreational facilities",
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
  hutchins: {
    fullAccrualGroups: {
      "Interest and fiscal charges": "Interest on long-term debt",
      "Interest on long-term debt": "Interest on long-term debt",
    },
    modifiedAccrualGroups: {
      "Cultural and recreation": "Cultural and recreational",
      "Cultural and recreational": "Cultural and recreational",
    },
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
  desoto: {
    fullAccrualGroups: {},
    modifiedAccrualGroups: {
      "Non-departmental": "General government",
    },
    notes: {
      "General government":
        "Absorbs the separate 'Non-departmental' expenditure line the governmental-funds statements carried through FY2018; from FY2019 the City reports those costs inside General government, and the government-wide statements never broke them out at all",
    },
  },
  grapevine: {
    fullAccrualGroups: {
      "Interest on long-term debt": "Interest on long-term debt",
      "Interest and fiscal charges": "Interest on long-term debt",
      Interest: "Interest on long-term debt",
      "Bond issuance costs": "Interest on long-term debt",
    },
    modifiedAccrualGroups: {
      "Economic Development": "Economic development",
    },
    notes: {
      "Interest on long-term debt":
        "FY2015 is the one year the Statement of Activities prints 'Bond issuance costs' as its own governmental function row; it is grouped here because the City's own ten-year statistical table reports the two lines combined on the interest row",
    },
  },
  melissa: {
    fullAccrualGroups: {
      "General Government": "General government",
      "Public Safety": "Public safety",
      Streets: "Public works",
      "Culture & Recreation": "Culture and recreation",
      "Interest & Fiscal Charges": "Interest and fiscal charges",
      "Interest and other": "Interest and fiscal charges",
      "Bond issuance cost": "Interest and fiscal charges",
    },
    modifiedAccrualGroups: {
      "General Government": "General government",
      Administration: "General government",
      "Planning and development": "General government",
      "Code enforcement": "General government",
      "Public library": "General government",
      "Municipal court": "General government",
      "Building maintenance": "General government",
      "Public Safety": "Public safety",
      Street: "Public works",
      Streets: "Public works",
      "Grant expenses": "Public works",
      "Culture & Recreation": "Culture and recreation",
      "Parks and recreation": "Culture and recreation",
    },
    notes: {
      "General government":
        "FY2017-2021 fund statements split this into separate Administration, Planning and development, Code enforcement, Public library, Municipal court, and Building maintenance lines instead of one consolidated function",
      "Public works":
        "Contains the FY2020 Transportation Construction fund's one-time 'Grant expenses' line",
      "Interest and fiscal charges":
        "Contains the FY2023 'Bond issuance cost' line, which that year's Statement of Activities prints as its own governmental function",
    },
  },
  rockwall: {
    fullAccrualGroups: {
      "Mayor/council": "General government",
      Administration: "General government",
      Finance: "General government",
      "Municipal court": "General government",
      Police: "Public safety",
      Fire: "Public safety",
      "Interest and fiscal charges": "Interest on long-term debt",
      "Interest and other on long-term debt": "Interest on long-term debt",
      Interest: "Interest on long-term debt",
    },
    modifiedAccrualGroups: {},
    notes: {
      "General government":
        "Includes Mayor/council, Administration, Finance, and Municipal court",
    },
  },
  "the-colony": {
    fullAccrualGroups: {},
    modifiedAccrualGroups: {
      "Cultural and recreation": "Culture and recreation",
      "Culture and recreation": "Culture and recreation",
    },
    notes: {},
  },
  sachse: {
    fullAccrualGroups: {
      "Culture and recreation": "Leisure services",
      "Community development": "Development services",
      "Interest on long-term debt": "Interest and fiscal charges",
    },
    modifiedAccrualGroups: {},
    notes: {},
  },
  southlake: {
    fullAccrualGroups: {
      "Promotion of culture and tourism": "Culture and recreation",
    },
    modifiedAccrualGroups: {
      "Promotion of culture and tourism": "Culture and recreation",
    },
    notes: {
      "Culture and recreation": "Contains: Promotion of culture and tourism",
    },
  },
  sunnyvale: {
    fullAccrualGroups: {
      "General Government": "General government",
      "Public Safety": "Public safety",
      "Public Works": "Public works",
      "Public Services and Operations": "Public services and operations",
      "Public Services and operations": "Public services and operations",
      "Parks and Recreation": "Public services and operations",
      "Parks and recreation": "Public services and operations",
      "Parks and recreational": "Public services and operations",
      Library: "Public services and operations",
      "Interest on Long-Term Debt": "Interest on long-term debt",
    },
    modifiedAccrualGroups: {
      "General Government": "General government",
      "Public Safety": "Public safety",
      "Public safety": "Public safety",
      "Public Works": "Public works",
      "Public Services and Operations": "Public services and operations",
      "Public Services and operations": "Public services and operations",
      "Parks and Recreation": "Public services and operations",
      "Parks and recreation": "Public services and operations",
      "Parks and recreational": "Public services and operations",
      Library: "Public services and operations",
    },
    notes: {
      "Public services and operations":
        "Contains Parks and recreation and Library",
    },
  },
  "trophy-club": {
    fullAccrualGroups: {
      "General Government": "General government",
      "Information Services": "Information services",
      "Community Development": "Community development",
      Court: "Municipal court",
      Recreation: "Parks and recreation",
      Parks: "Parks and recreation",
      Streets: "Public works",
      "PID Activities": "PID activities",
      "Town secretary": "Manager's office",
      "Mayor & council": "Manager's office",
      "Streets and infrastructure": "Public works",
      "Water and sewer": "Public works",
      "Town Storm Drainage": "Public works",
      "Information services": "Information services",
      Tourism: "Tourism",
      Sanitation: "Sanitation",
      "Interest and fiscal charges on long-term debt":
        "Interest on long-term debt",
      "Interest and fiscal charges": "Interest on long-term debt",
      Interest: "Interest on long-term debt",
    },
    modifiedAccrualGroups: {
      "General Government": "General government",
      "Information Services": "Information services",
      "Community Development": "Community development",
      Court: "Municipal court",
      Recreation: "Parks and recreation",
      Parks: "Parks and recreation",
      Streets: "Public works",
      "PID Activities": "PID activities",
      "Town secretary": "Manager's office",
      "Mayor & council": "Manager's office",
    },
    notes: {
      "Public works": "Contains: Streets, water, sewer, storm drainage",
      "Manager's office": "Contains: Town secretary, Mayor & council",
    },
  },
  westlake: {
    fullAccrualGroups: {
      "Cultural recreation": "Cultural and recreation",
    },
    modifiedAccrualGroups: {
      "Cultural recreation": "Cultural and recreation",
    },
    notes: {},
  },
  "white-settlement": {
    fullAccrualGroups: {
      "Cultural and recreation": "Culture and recreation",
      "Economic development": "Planning and development",
      "Public health": "Public health",
      "Non departmental": "Non departmental",
      "Interest on long-term debt": "Interest on long-term debt",
      "Interest and fiscal charges": "Interest on long-term debt",
      Interest: "Interest on long-term debt",
    },
    modifiedAccrualGroups: {
      "Economic development": "Planning and development",
    },
    notes: {
      "Planning and development":
        "Contains as Economic development through FY2023. the Economic Development Corporation was blended into the City starting FY2016",
      Other:
        "The report lumps Non departmental and Economic development spending into 'Other' through FY2019",
    },
  },
};
