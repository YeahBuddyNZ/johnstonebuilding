# Images

Every file in this folder is an **art-directed placeholder**, not a photograph of a
real Johnstone Building project. They exist so the layout reads correctly before the
real photography arrives.

## Replacing them

Drop a real photo in with **the same filename and roughly the same aspect ratio**.
No HTML changes are needed.

| File | Used on | Ratio | Suggested size |
| --- | --- | --- | --- |
| `hero.jpg` | Homepage hero | 21:9 | 2400 × 1000 |
| `hero-poster.jpg` | Social share image | 16:9 | 2000 × 1125 |
| `intro-wide.jpg`, `intro-detail.jpg` | Homepage intro | 4:3, 4:5 | 1400 × 1050, 1200 × 1500 |
| `work-01.jpg` … `work-09.jpg` | Work grid | 4:3 | 1400 × 1050 |
| `service-*.jpg` | Services + capability hover previews | 4:3 | 1400 × 1050 |
| `about-portrait.jpg` | About — portrait of Hayden | 4:5 | 1200 × 1500 |
| `about-site.jpg`, `about-detail.jpg` | About | 4:3 | 1400 × 1050 |
| `project-<slug>-hero.jpg` | Case-study hero | 21:9 | 2400 × 1000 |
| `project-<slug>-01…04.jpg` | Case-study gallery | 4:3 / 4:5 | 1400 × 1050 / 1200 × 1500 |
| `cta-wide.jpg` | Closing call-to-action band | 21:9 | 2400 × 1000 |

## Before uploading

- Export at **quality 80–85**, progressive JPEG. Aim for under 300 KB each.
- Keep the longest edge at 2400px — the layout never needs more.
- Update the `alt` text in the HTML to describe the actual photograph.
- If you change a file's aspect ratio, change its `ratio-*` class in the HTML
  (`ratio-21`, `ratio-16`, `ratio-43`, `ratio-45`, `ratio-11`).
