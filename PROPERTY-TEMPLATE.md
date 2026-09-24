# How to add a property

1. **Photos.** Create a folder such as `assets/properties/2-bed-burslem-st6/` and upload
   the photos (JPG, ideally around 1600px wide and under 300 KB each). The first photo is the main one.

2. **Listing file.** In the `_properties` folder, copy `example-2-bed-terrace-burslem.md`
   and rename it. The file name becomes the web address, so make it descriptive:
   `3-bed-semi-hanley-st1.md` → `five-towns.co.uk/properties/3-bed-semi-hanley-st1/`

3. **Fill in the details** between the `---` lines:

| Field | What to enter |
|---|---|
| `published` | `true` to show it, `false` to hide it |
| `listing` | `rent` or `sale` |
| `status` | Rent: `Available`, `Let Agreed` or `Let`. Sale: `For Sale`, `Sold STC` or `Sold` |
| `title` | e.g. `3 Bedroom Semi-Detached House, Hanley` |
| `price` | e.g. `"£750"` (keep the quote marks). Rent is shown per month |
| `available` | e.g. `1 November 2026` |
| `furnishing` | Unfurnished / Part furnished / Furnished |
| `bedrooms`, `bathrooms` | numbers |
| `property_type` | e.g. `Semi-detached house` |
| `area` | e.g. `Hanley, ST1` |
| `epc`, `council_tax` | letters, e.g. `C` and `A` |
| `images` | one line per photo, starting `  - /assets/properties/your-folder/` |
| `features` | short bullet points |
| `description` | one sentence for Google results |

4. **Description.** Below the second `---`, write two or three short paragraphs.

5. **Commit.** The property appears on the listings page and gets its own page with a viewing request form.

Renters' Rights Act reminders: show one clear rent figure, don't invite offers above it,
and don't use wording that excludes tenants on benefits or with children.

When a property is let, change `status` to `Let`, or set `published: false` to remove it.
