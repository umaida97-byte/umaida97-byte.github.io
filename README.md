# Five Towns Lettings website

This site is built with **Jekyll**, which GitHub Pages runs automatically.
You edit files, commit, and GitHub rebuilds the site in a minute or two.
There is nothing to install.

> GitHub setting to check once: **Settings → Pages → Build and deployment →
> Source: "Deploy from a branch"** (main, / root). This is what makes GitHub
> run Jekyll. If a build fails, GitHub emails you and the previous version
> stays live, so nothing breaks for visitors.

---

## Where to change things

| To change... | Edit this file |
|---|---|
| Phone numbers, email, address, opening hours, team, Google link, portfolio numbers, form key | `_data/company.yml` |
| Any fee (updates the Fees page, comparison table and service pages) | `_data/fees.yml` |
| The main menu | `_data/navigation.yml` |
| Header / footer layout | `_includes/header.html`, `_includes/footer.html` |
| Testimonials | `_includes/testimonials.html` |
| Enquiry forms | `_includes/form-*.html` |
| Colours, fonts, spacing | `assets/css/style.css` |
| A page's words | the page's own `.html` file (text below the `---` block) |

Each page starts with a short block like this, which sets its Google title and description:

```
---
title: "Fees | Five Towns Lettings"
description: "One or two sentences shown in Google results."
---
```

Keep the quote marks around the title and description.

---

## Adding a property

See `PROPERTY-TEMPLATE.md`. In short: copy the example file in `_properties/`,
fill it in, add photos to `assets/properties/<folder>/`, set `published: true`, commit.
The property gets its own page and appears on the listings automatically.

---

## Enquiry forms

Forms are sent by Web3Forms to the inbox linked to the key in `_data/company.yml`.
In the Web3Forms dashboard, restrict the key to `five-towns.co.uk` so it can't be reused elsewhere.
Each email's subject tells you which form it came from.

---

## Moved and removed pages

Old addresses redirect automatically using `redirect_from:` in the front of the page
they now point to (e.g. `landlords/let-only.html`). To redirect a URL from the old
website, add it to the `redirect_from:` list of the page that replaces it.

---

## GO-LIVE CHECKLIST

1. Add the old website's URLs to `redirect_from:` on the matching new pages.
2. In `_config.yml`, change `staging_noindex: true` to `staging_noindex: false`.
3. In GitHub: **Settings → Pages → Custom domain**, enter `five-towns.co.uk` and save
   (this creates a `CNAME` file). Tick **Enforce HTTPS** once it becomes available.
4. At your domain registrar, point the domain at GitHub Pages (A records for the root
   domain and a CNAME for `www`, as listed in GitHub's Pages documentation).
5. Test the forms on the live domain and check the emails arrive.
6. Add the site to Google Search Console and submit `https://five-towns.co.uk/sitemap.xml`.
7. Update the website link on your Google Business Profile.
8. If adding Google Analytics, add a cookie consent banner first and update `cookie-policy.html`.
