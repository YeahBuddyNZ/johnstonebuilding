# Content to replace before launch

The design, structure and code are finished. The items below are **placeholders** —
they exist so the layout reads correctly, and they are not claims about real work.
Each one is also flagged with an HTML comment at its location in the source.

## Must replace

| # | Item | Where | Notes |
| --- | --- | --- | --- |
| 1 | **All photography** | `assets/img/` | Every image is a generated abstract, not a real project. Same filename + ratio = drop-in replacement. See `assets/img/README.md`. |
| 2 | **The nine projects** | `work.html`, `index.html` | Names, suburbs, years and types are illustrative. Six of the nine currently link to `contact.html` because they have no case-study page yet. |
| 3 | **The three case studies** | `project-headland.html`, `project-kohu.html`, `project-showroom.html` | Narrative, specs and details are written to demonstrate the format. *The Timber Showroom* is loosely based on a real job mentioned publicly, but the specifics are invented. |
| 4 | **Statistics** | `index.html`, `about.html` | "15+ years", "60+ projects", "4 live jobs", "10yr guarantee" are all unverified. Search for `data-count` — or delete the two `.stats` sections if you would rather not publish numbers. |
| 5 | **Phone number** | `contact.html`, and the footer on every page | Currently commented out. Search for `TODO: confirm phone number` and un-comment the two rows once confirmed. |
| 6 | **Portrait of Hayden** | `about.html` → `assets/img/about-portrait.jpg` | |

## Should confirm

- **Service areas** — the site currently claims Auckland region, Waiheke, Matakana and Ōmaha.
- **Business hours** — `contact.html` says Mon–Fri 7am–5pm.
- **Budget bands** in the enquiry form dropdown.
- **Licences and memberships** — if Johnstone Building holds LBP, Master Builders or
  NZ Certified Builders status, add it. The marquee on `services.html` currently says
  "Licensed Building Practitioner"; remove it if that is not accurate. A logo strip
  under the hero would be the natural place for the badges.
- **Physical address** — omitted deliberately. Add it to the `PostalAddress` JSON-LD
  block in `index.html` and to `contact.html` if there is a public office.
- **Instagram** — only Facebook is linked. Add the handle to the footer, the mobile
  menu and the JSON-LD `sameAs` array if one exists.

## Verified and correct as written

- Business name, and the email `hayden@johnstonebuilding.co.nz`
- The Facebook page link
- The pull quote used on the homepage:
  *"The pride we take in our work and attention to detail are paramount. Construction is our passion."*
- Auckland as the base of operations
