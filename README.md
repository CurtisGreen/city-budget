# city-budget
<img width="971" height="785" alt="image" src="https://github.com/user-attachments/assets/f64ffa9e-953a-4f57-8700-521d9f05df48" />

Easily explain city finances using maps and graphs

## How to add a city
Setup the sheet:
1. Duplicate the [Hurst](https://docs.google.com/spreadsheets/d/10XzX37RJKCnQho-a_yPE6meGILpF0mkTCbo5yz-XmF8/edit?usp=sharing) spreadsheet and clear out the values
1. From the 2015-2025 ACFRs: Fill in all of the data in the main spreadsheet
1. From the 2015-2025 ACFRs: Fill in the FY 2024 and 2025 property, sales, and hotel occupancy tax revenues
1. From the 2024 & 2025 ACFRs: Fill in the maintenance and debt service property tax rates on the "Other Info" spreadsheet tab. Search for "overlapping rates" or "property tax rates" in the ACFRs
1. From the 2026 budget: Get the FY 2026 property tax rates. You'll likely need to subtract the total rate - debt service rate to get the maintenance (M&O) rate
1. From wikipedia get: 1980, 1990, 2000, 2010, and 2020 populations
1. From wikipedia get: Land area in square miles
1. From US Census Quickfacts: Get 2025 population
1. Transpose data into "Formatted Data" tab so it can be put into a .csv
1. Get the city boundaries from overpass and export -> copy it into the geojson format
1. Using the ACFR and city website, find out how the city uses the 1% local sales tax. Ex: transit, economic development corporation, etc.

# What to look for in the ACFR

## Assets and Liabilities
- Typically you can search "Current and other" and find the right section.
- You can often find all the info necessary for current year and previous year. This can save you time in grabbing all of the data.
- If they ever conflict, use the latest year's numbers

<img width="1105" height="508" alt="image" src="https://github.com/user-attachments/assets/97317b9a-9620-46bf-b27c-501e1b45e844" />

## Revenues and Expenses
- Usually just 1 or 2 pages down from the first section to grab data from

<img width="1090" height="726" alt="image" src="https://github.com/user-attachments/assets/27c63f46-8d7d-415e-8bd1-be8bd044add8" />

# Asset Life
- Search "Not being depreciated" or "depreciable" to find the government & business-type capital assets section

<img width="1147" height="1034" alt="image" src="https://github.com/user-attachments/assets/ee89413b-1ab2-4541-a25d-d2355f4d2444" />

# Geo JSON
- Go to https://overpass-turbo.eu/
- Paste the following, replacing Hurst with the city name you want
- Then run it -> export -> geojson copy -> paste into new .ts file
```
[out:json];
wr["name"="Hurst"]["boundary"="administrative"]["admin_level"="8"];
out geom qt;
```
