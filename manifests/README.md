# ACFR PDF manifests

One JSON file per city: `manifests/{id}.json`. It maps each fiscal year's source PDF to its
permanent public Internet Archive URL, and drives `scripts/fetch_to_ia.py`.

Two purposes:

1. **Upload pipeline** — `fetch_to_ia.py` reads it to know what to download vs. upload.
2. **Stable index** — the website (`lib/acfr-pdf-url.ts`) and the `add-city` skill read
   `archiveUrl` instead of re-hunting the flaky city sites.

## Schema

```jsonc
{
  "id": "little-elm",        // kebab-case city id (matches data/acfr-json/{id}.ts)
  "city": "Little Elm",      // display name; also the wrong-city verification string
  "pdfs": [
    {
      "year": 2025,          // fiscal year
      "source": "url",       // "url" = script downloads it | "manual" = you supply the file
      "url": "https://...",  // required when source=="url"
      "archiveUrl": null     // filled in by the script after a successful upload
    },
    {
      "year": 2020,
      "source": "manual",
      "file": "inbox/little-elm-FY2020.pdf",  // required when source=="manual"; path relative to repo root
      "archiveUrl": null
    }
  ]
}
```

- Omit a year entirely if the city has no report for it (a gap is just an absent entry).
- `manual` files: drop the PDF in `inbox/` (gitignored) and point `file` at it. Use this for
  reports you had to request from the city — they get the same permanent IA link as scraped ones.

## Run

```bash
pip install -r scripts/requirements.txt
ia configure                                    # once — paste archive.org S3 keys
python scripts/fetch_to_ia.py manifests/little-elm.json
```

Public URL that results: `https://archive.org/download/city-budget-acfr-{id}/{id}-acfr-FY{year}.pdf`
