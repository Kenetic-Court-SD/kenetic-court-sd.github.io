# Kinetic Court SD — San Diego : In Play

One place to find a game in San Diego: pickleball open play times, public and
private courts, and official schedules, plus tennis, padel, racquetball, squash
and ping pong.

Live site: https://kenetic-court-sd.github.io/

Static site, no build step: open `index.html` in a browser.

- `data.js` — every venue, open play session, schedule link and FAQ. Edit this to change content.
- `app.js` — pages, filters and the illustrated court pictures.
- `images/` — photos and the logo (`logo.svg`).

## Where the facts come from

- Public pickleball courts and open play hours: the City of San Diego
  "Pickleball Court Locations" PDF (updated 8/29/2026).
- Public tennis courts: the City's Tennis Courts page.
- Clubs: each club's own website.
- Venues marked `verified: false` in `data.js` have not been confirmed yet and
  show an "Unconfirmed" label on the site.

## Adding a photo for a court

Put the photo in `images/` and add `image: "images/your-file.jpg"` to that
venue in `data.js`. Venues without a photo get an illustrated court card.
