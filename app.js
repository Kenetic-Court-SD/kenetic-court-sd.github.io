// Kinetic Court SD — static, no-build site. Content lives in data.js.
// Pages: #/ (home), #/open-play, #/schedules, #/about, #/faq, #/contact,
//        #/facility-details, #/facility-details/<id>

/* ---------- helpers ---------- */
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const pad2 = (n) => String(n).padStart(2, "0");
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const sportOf = (id) => SPORTS.find((s) => s.id === id) || { id, label: id, noun: "courts" };

// Give every venue an id, its picture, its open play days, and a ranking score.
VENUES.forEach((v) => {
  v.id = `${v.sport}-${slug(v.name)}`;
  if (v.photo && PHOTOS[v.photo]) { v.photoInfo = PHOTOS[v.photo]; v.image = v.photoInfo.src; }
  v.geo = (v.address && GEO[v.address]) || null;
  v.sessions = v.sessions || [];
  v.playDays = DAYS.filter((d) => v.sessions.some((s) => s.days.includes(d)));
  // "Coolest courts with the most open play first": looks count double, plus one point per open play day.
  v.score = (v.wow || 1) * 2 + v.playDays.length + (v.verified === false ? -3 : 0) + (v.closed ? -10 : 0);
});
// State, city and ZIP code come from the end of each address ("…, Carlsbad, CA 92011").
const STATE_NAMES = { CA: "California" };
VENUES.forEach((v) => {
  const m = v.address && /,\s*([^,]+),\s*([A-Z]{2})(?:\s+(\d{5}))?\s*$/.exec(v.address);
  v.city = v.city || (m ? m[1].trim() : "");
  v.state = v.state || (m ? m[2] : "CA");
  v.zip = v.zip || (m && m[3]) || "";
});
// Venues without an address: use their area when it is a city we know, otherwise San Diego.
const KNOWN_CITIES = new Set(VENUES.map((v) => v.city).filter(Boolean));
VENUES.forEach((v) => { if (!v.city && v.area !== "Countywide") v.city = KNOWN_CITIES.has(v.area) ? v.area : "San Diego"; });
const byScore = (a, b) => b.score - a.score || a.name.localeCompare(b.name);
const findVenue = (id) => VENUES.find((v) => v.id === id);
const hasOpenPlay = (sport) => VENUES.some((v) => v.sport === sport && v.sessions.length);

const svg = (paths, cls = "h-4 w-4") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" class="${cls}" aria-hidden="true">${paths}</svg>`;
const icon = {
  arrowUpRight: (c) => svg(`<path d="M7 7h10v10"/><path d="M7 17 17 7"/>`, c),
  arrowRight: (c) => svg(`<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>`, c),
  arrowLeft: (c) => svg(`<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>`, c),
  chevronDown: (c) => svg(`<path d="m6 9 6 6 6-6"/>`, c),
  mapPin: (c) => svg(`<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`, c),
  phone: (c) => svg(`<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>`, c),
  clock: (c) => svg(`<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>`, c),
  file: (c) => svg(`<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 13h8"/><path d="M8 17h5"/>`, c),
  send: (c) => svg(`<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>`, c),
  check: (c) => svg(`<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>`, c),
};

// A pickleball. Used as the site's bullet, full stop and badge.
const BALL_HOLES = `<circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="6" r="1.4"/><circle cx="12" cy="18" r="1.4"/><circle cx="6.8" cy="9" r="1.4"/><circle cx="17.2" cy="9" r="1.4"/><circle cx="6.8" cy="15" r="1.4"/><circle cx="17.2" cy="15" r="1.4"/>`;
const ball = (cls = "h-4 w-4") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="${cls}" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#F7C531"/><g fill="#C99A12">${BALL_HOLES}</g></svg>`;

// The logo: a palm tree with a pickleball as the sun. The tree uses the current text color.
const PALM = `<path d="M24.5 60C25.5 48 26 38 29.5 27L33 28C30.5 39 30.5 49 30.5 60Z"/><path d="M31 27C24 17 14 15 6 21 15 19 23 22 31 27Z"/><path d="M31 27C27 15 19 8 9 8 18 11 25 18 31 27Z"/><path d="M31 27C31 15 35 7 43 3 38 10 35 18 31 27Z"/><path d="M31 27C38 17 48 14 57 18 47 18 39 21 31 27Z"/><path d="M31 27C41 23 51 27 56 36 49 29 40 27 31 27Z"/><path d="M31 27C22 26 14 31 11 40 17 33 24 29 31 27Z"/>`;
const logo = (cls = "h-8 w-8") => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="${cls}" role="img" aria-label="Palm tree with a pickleball sun">
    <circle cx="40" cy="24" r="17" fill="#F7C531"/>
    <g fill="#C99A12"><circle cx="40" cy="24" r="2"/><circle cx="40" cy="14" r="1.8"/><circle cx="40" cy="34" r="1.8"/><circle cx="30" cy="24" r="1.8"/><circle cx="50" cy="24" r="1.8"/><circle cx="33" cy="17" r="1.8"/><circle cx="47" cy="17" r="1.8"/><circle cx="33" cy="31" r="1.8"/><circle cx="47" cy="31" r="1.8"/></g>
    <g fill="currentColor">${PALM}</g>
    <path d="M12 60H52" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;

const ext = `target="_blank" rel="noopener noreferrer"`;
const LBL = "font-mono uppercase tracking-[0.12em]";
const eyebrow = (text, tone = "text-muted-foreground", gap = "mb-3") =>
  `<p class="${gap} ${tone} flex items-center gap-2 ${LBL} text-xs">${ball("h-3.5 w-3.5 shrink-0")}<span>${text}</span></p>`;
const mapsUrl = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const BTN = `inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 ${LBL} text-xs transition`;
const BTN_SUN = `${BTN} bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg`;
const BTN_LINE = `${BTN} border-2 border-foreground text-foreground hover:bg-foreground hover:text-background`;
const BTN_LINE_DARK = `${BTN} border-2 border-background/70 text-background hover:bg-background hover:text-foreground`;

/* ---------- illustrated court art (for venues without a photo) ---------- */
const hashStr = (str) => { let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const PALETTES = [
  { bg: "#F0DDB4", court: "#1C7FA6", zone: "#5FB6D0" }, // sand + ocean
  { bg: "#12304A", court: "#2A8C7A", zone: "#63C2A8" }, // night + green
  { bg: "#63B8CF", court: "#12304A", zone: "#1C7FA6" }, // sky + navy
  { bg: "#2A8C7A", court: "#1C5F8A", zone: "#6CB7DA" }, // palm green + blue
  { bg: "#EE7A55", court: "#134B6B", zone: "#2F86A8" }, // sunset + ocean
  { bg: "#F7C531", court: "#15648A", zone: "#57AFCB" }, // pickleball yellow + ocean
];
const LINE = `stroke="#FFFAF0" stroke-width="3" fill="none"`;

function drawCourt(sport, x, y, p) {
  const r = (rx, ry, w, h, extra) => `<rect x="${rx}" y="${ry}" width="${w}" height="${h}" ${extra}/>`;
  const l = (x1, y1, x2, y2, extra = LINE) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}/>`;
  const net = (w, h) => l(x - 9, y + h / 2, x + w + 9, y + h / 2, `stroke="#0C2233" stroke-width="5" stroke-linecap="round"`);
  if (sport === "tennis") {
    const w = 168, h = 364, a = w * 4.5 / 36, s = h * 21 / 78, m = y + h / 2;
    return r(x, y, w, h, `fill="${p.court}"`) + r(x + a, m - s, w - 2 * a, 2 * s, `fill="${p.zone}"`) + r(x, y, w, h, LINE) +
      l(x + a, y, x + a, y + h) + l(x + w - a, y, x + w - a, y + h) + l(x + a, m - s, x + w - a, m - s) + l(x + a, m + s, x + w - a, m + s) + l(x + w / 2, m - s, x + w / 2, m + s) + net(w, h);
  }
  if (sport === "padel") {
    const w = 172, h = 344, s = h * 6.95 / 20, m = y + h / 2;
    return r(x, y, w, h, `fill="${p.court}"`) + l(x, m - s, x + w, m - s) + l(x, m + s, x + w, m + s) + l(x + w / 2, m - s, x + w / 2, m + s) +
      r(x - 4, y - 4, w + 8, h + 8, `rx="6" fill="none" stroke="#FFFAF0" stroke-opacity=".75" stroke-width="7"`) + net(w, h);
  }
  if (sport === "squash" || sport === "racquetball") {
    const red = `stroke="#C4472F" stroke-width="4" fill="none"`;
    const w = 190, h = sport === "squash" ? 290 : 360, floor = r(x, y, w, h, `fill="#E3C08F"`) +
      Array.from({ length: 9 }, (_, i) => l(x + (w / 10) * (i + 1), y, x + (w / 10) * (i + 1), y + h, `stroke="#CFA872" stroke-width="1.5"`)).join("");
    const wall = l(x - 6, y, x + w + 6, y, `stroke="#0C2233" stroke-width="9"`);
    if (sport === "squash") {
      const sl = y + h * 5.44 / 9.75, b = w * 1.6 / 6.4;
      return floor + r(x, y, w, h, red) + l(x, sl, x + w, sl, red) + l(x + w / 2, sl, x + w / 2, y + h, red) + r(x, sl, b, b, red) + r(x + w - b, sl, b, b, red) + wall;
    }
    const sv = y + h * 15 / 40, sh = y + h / 2, rc = y + h * 25 / 40;
    return floor + r(x, y, w, h, red) + l(x, sv, x + w, sv, red) + l(x, sh, x + w, sh, red) + l(x, rc, x + w, rc, `stroke="#C4472F" stroke-width="3" stroke-dasharray="10 9"`) +
      l(x + 22, sv, x + 22, sh, red) + l(x + w - 22, sv, x + w - 22, sh, red) + wall;
  }
  if (sport === "pingpong") {
    const w = 170, h = 306;
    return r(x + 7, y + 9, w, h, `fill="#0C2233" fill-opacity=".25"`) + r(x, y, w, h, `fill="${p.court}"`) + r(x, y, w, h, LINE) + l(x + w / 2, y, x + w / 2, y + h, `stroke="#FFFAF0" stroke-width="1.5"`) + net(w, h);
  }
  // pickleball
  const w = 150, h = 330, k = h * 7 / 44, m = y + h / 2;
  return r(x, y, w, h, `fill="${p.court}"`) + r(x, m - k, w, 2 * k, `fill="${p.zone}"`) + r(x, y, w, h, LINE) + l(x, m - k, x + w, m - k) + l(x, m + k, x + w, m + k) +
    l(x + w / 2, y, x + w / 2, m - k) + l(x + w / 2, m + k, x + w / 2, y + h) + net(w, h);
}
const COURT_SIZE = { pickleball: [150, 330], tennis: [168, 364], padel: [172, 344], squash: [190, 290], racquetball: [190, 360], pingpong: [170, 306] };

function courtArt(v, cls = "absolute inset-0 h-full w-full") {
  const h = hashStr(v.name), p = PALETTES[h % PALETTES.length];
  const angle = ((h >> 4) % 31) - 15, [w, ht] = COURT_SIZE[v.sport] || COURT_SIZE.pickleball, gap = 46;
  const courts = [-1, 0, 1].map((i) => drawCourt(v.sport, 200 - w / 2 + i * (w + gap), 250 - ht / 2, p)).join("");
  const sx = 40 + ((h >> 9) % 240), flip = (h >> 13) % 2 ? -1 : 1;
  // A pickleball in play (skipped when the card itself is pickleball yellow).
  const bx = 120 + ((h >> 17) % 170), by = 95 + ((h >> 21) % 90);
  const playBall = v.sport === "pickleball" && p.bg !== "#F7C531"
    ? `<ellipse cx="${bx + 10}" cy="${by + 16}" rx="15" ry="6" fill="#0C2233" fill-opacity=".22"/><g transform="translate(${bx - 17} ${by - 17}) scale(1.42)"><circle cx="12" cy="12" r="11" fill="#F7C531"/><g fill="#C99A12">${BALL_HOLES}</g></g>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" class="${cls}" role="img" aria-label="Illustration of ${esc(sportOf(v.sport).label.toLowerCase())} courts">
    <rect width="400" height="500" fill="${p.bg}"/>
    <g transform="rotate(${angle} 200 250) scale(1.08) translate(-15 -18)">${courts}</g>
    <g transform="translate(${sx} 300) scale(${flip * 4.2} 4.2) rotate(18)" fill="#0C2233" fill-opacity=".2">${PALM}</g>
    ${playBall}
  </svg>`;
}

// A venue's picture: its photo if it has one, otherwise the illustration.
const venueImage = (v, imgCls = "", eager = false) => v.image
  ? `<img src="${v.image}" alt="${esc(v.photoInfo ? v.photoInfo.shows : v.name)}" ${eager ? "" : `loading="lazy"`} class="absolute inset-0 h-full w-full object-cover ${imgCls}" />`
  : courtArt(v, `absolute inset-0 h-full w-full ${imgCls}`);

/* ---------- small pieces ---------- */
const CHIP = `inline-block shrink-0 rounded-full px-2.5 py-1 ${LBL} text-[10px]`;
function accessChip(v, onImage = false) {
  const pub = v.access === "public";
  const tone = pub ? (onImage ? "bg-background text-foreground" : "bg-secondary text-foreground ring-1 ring-inset ring-ocean/25") : "bg-coral text-foreground";
  return `<span class="${CHIP} ${tone}">${pub ? "Public" : "Private club"}</span>`;
}
const unconfirmedChip = (v, onImage = false) => v.verified === false
  ? `<span class="${CHIP} border border-dashed ${onImage ? "border-background/80 text-background" : "border-muted-foreground text-muted-foreground"}">Unconfirmed</span>` : "";
const playSummary = (v) => v.closed ? v.closed
  : v.playDays.length === 7 ? "Open play 7 days a week"
  : v.playDays.length ? `Open play ${v.playDays.join(" · ")}`
  : v.openCourts ? "Open courts, first come first served"
  : v.hours ? v.hours : "";
const dots = (extra = "opacity-60") => `<div class="mesh-overlay pointer-events-none absolute inset-0 ${extra}"></div>`;

/* ---------- shared layout ---------- */
const NAV_LINKS = [
  { label: "Courts", to: "#/" },
  { label: "Open Play", to: "#/open-play" },
  { label: "Map", to: "#/map" },
  { label: "Schedules", to: "#/schedules" },
  { label: "FAQ", to: "#/faq" },
  { label: "About", to: "#/about" },
  { label: "Contact", to: "#/contact" },
];

function Nav() {
  return `
  <nav class="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
      <a href="#/" class="flex shrink-0 items-center gap-2 text-foreground">
        ${logo("h-9 w-9")}
        <span class="font-display whitespace-nowrap text-lg leading-none sm:text-xl">Kinetic Court<span class="text-pop"> SD</span></span>
      </a>
      <div class="hidden items-center gap-1 lg:flex">
        ${NAV_LINKS.map((l) => `<a href="${l.to}" class="shrink-0 whitespace-nowrap rounded-full px-3 py-2 ${LBL} text-[11px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">${l.label}</a>`).join("")}
      </div>
      <button data-menu aria-expanded="false" aria-controls="phone-menu" class="flex items-center gap-2 rounded-full bg-foreground px-4 py-2 ${LBL} text-[11px] text-background lg:hidden">Menu ${svg(`<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>`, "h-4 w-4")}</button>
    </div>
    <div id="phone-menu" class="hidden border-t border-border bg-background px-4 pb-4 pt-2 lg:hidden">
      <div class="mx-auto grid max-w-7xl grid-cols-2 gap-2">
        ${NAV_LINKS.map((l) => `<a href="${l.to}" data-menu-link class="rounded-2xl bg-secondary px-4 py-3 font-display text-lg text-foreground">${l.label}</a>`).join("")}
      </div>
    </div>
  </nav>`;
}

function Footer() {
  return `
  <footer class="on-dark relative bg-foreground px-6 py-24 text-background sm:py-28">
    <div class="netline pointer-events-none absolute inset-0 opacity-[0.05]"></div>
    <div class="relative mx-auto max-w-7xl">
      ${eyebrow("The Social Net", "text-background/60")}
      <h2 class="font-display text-5xl leading-[0.95] sm:text-7xl">Connect to<br>the ecosystem<span class="text-pop">.</span></h2>
      <div class="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2">
        ${ECOSYSTEM_LINKS.map((e) => `
          <a href="${e.href}" ${ext} class="group flex items-center justify-between gap-4 rounded-3xl bg-background/[0.07] px-6 py-6 transition-colors hover:bg-primary hover:text-primary-foreground">
            <span class="font-display text-xl leading-tight sm:text-2xl">${esc(e.label)}</span>
            ${icon.arrowUpRight("h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1")}
          </a>`).join("")}
      </div>
      <div class="mt-16 flex flex-col items-start justify-between gap-4 ${LBL} text-[11px] text-background/60 sm:flex-row sm:items-center">
        <span class="flex items-center gap-3 text-background">${logo("h-9 w-9")} San Diego : In Play</span>
        <span>An independent atlas · Not affiliated with the City of San Diego</span>
        <span>32° 44′ N · 117° 16′ W</span>
      </div>
    </div>
  </footer>`;
}

const page = (main, mainClass = "bg-background pt-14") => `${Nav()}<main class="${mainClass}">${main}${Footer()}</main>`;

const pageHeader = (label, titleHtml, sub, width = "max-w-3xl") => `
  <section class="relative overflow-hidden bg-secondary px-6 py-20 sm:py-28">
    ${dots()}
    <div class="relative mx-auto ${width}">
      ${eyebrow(label)}
      <h1 class="font-display text-5xl leading-[0.95] text-foreground sm:text-8xl">${titleHtml}</h1>
      <p class="mt-6 max-w-xl font-body text-lg text-muted-foreground">${sub}</p>
    </div>
  </section>`;

// A wavy bottom edge, like the shoreline.
const wave = (tone = "text-background") => `
  <svg class="pointer-events-none absolute -bottom-px left-0 h-10 w-full sm:h-16 ${tone}" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
    <path fill="currentColor" d="M0 48C180 92 360 8 600 36s420 60 600 22c96-20 168-28 240-10v42H0Z"/>
  </svg>`;

/* ---------- home ---------- */
// "Now" in San Diego, whatever time zone the visitor is in.
const sdNow = () => new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
const TODAY = DAYS[(sdNow().getDay() + 6) % 7];
const nowMinutes = () => { const d = sdNow(); return d.getHours() * 60 + d.getMinutes(); };

// Turn "7:15 am – 12:00 pm" or "1:00 – 4:00 pm" into [start, end] minutes. Returns null when it can't.
function parseRange(time) {
  const m = /^(\d{1,2}):(\d{2})\s*(am|pm)?\s*–\s*(?:(\d{1,2}):(\d{2})\s*(am|pm)|(dusk|dark|sunset))$/i.exec(time.trim());
  if (!m) return null;
  const mins = (h, mm, ap) => (Number(h) % 12 + (ap.toLowerCase() === "pm" ? 12 : 0)) * 60 + Number(mm);
  if (m[7]) return m[3] ? [mins(m[1], m[2], m[3]), 16 * 60 + 45] : null; // "dusk": assume the earliest winter sunset
  const end = mins(m[4], m[5], m[6]);
  let start = mins(m[1], m[2], m[3] || m[6]);
  if (start > end) start = mins(m[1], m[2], "am");
  return start < end ? [start, end] : null;
}
const fmtTime = (min) => `${((Math.floor(min / 60) + 11) % 12) + 1}:${pad2(min % 60)} ${min >= 720 ? "pm" : "am"}`;
// For a session today: "live", "soon" (starts within 90 minutes), "later", "done", or null if unknown.
function sessionState(s) {
  const r = parseRange(s.time); if (!r) return null;
  const now = nowMinutes();
  return now >= r[1] ? "done" : now >= r[0] ? "live" : r[0] - now <= 90 ? "soon" : "later";
}
const liveSessions = (v) => v.sessions.filter((s) => s.days.includes(TODAY) && sessionState(s) === "live");
const liveNowCount = () => VENUES.filter((v) => v.sport === "pickleball" && liveSessions(v).length).length;

// Distance between two [lat, lng] points, in miles.
const milesBetween = (a, b) => {
  const R = 3958.8, rad = (x) => x * Math.PI / 180, dLat = rad(b[0] - a[0]), dLng = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
let userLoc = null;      // the visitor's [lat, lng] once they press "Near me"
let sortNear = false;    // list the directory nearest first
let locMsg = "";         // message shown under the Near me button
let mapObj = null;
let venueMapObj = null;
let showAllPlay = false; // open play list: first 10, or everything
let showAllDir = false;  // directory: first 20, or everything
const moreButton = (attr, n, what) => `<div class="mt-6 text-center"><button ${attr} class="${BTN} border-2 border-current">Show all ${n} ${what} ${icon.chevronDown("h-4 w-4")}</button></div>`;
const distOf = (v) => (userLoc && v.geo ? milesBetween(userLoc, v.geo) : null);
const distLabel = (v) => { const d = distOf(v); return d === null ? "" : `${d < 10 ? d.toFixed(1) : Math.round(d)} mi`; };
let currentSport = "pickleball";
let accessFilter = "all"; // all | public | private
let currentDay = TODAY;
let dirQuery = "";

let locTab = "city";   // which location tab is open: state | city | zip
let loc = null;        // the chosen location, e.g. { type: "city", value: "Carlsbad" }, or null for everywhere
let zipQuery = "";
const locMatch = (v) => !loc || v[loc.type] === loc.value;
const locLabel = () => !loc ? "" : loc.type === "state" ? (STATE_NAMES[loc.value] || loc.value) : loc.type === "zip" ? `ZIP ${loc.value}` : loc.value;
const whereWord = () => (loc ? ` in ${locLabel()}` : "");
// Venues for the chosen sport and access, before and after the location filter.
const baseVenues = () => VENUES.filter((v) => v.sport === currentSport && (accessFilter === "all" || v.access === accessFilter));
const sportVenues = () => baseVenues().filter(locMatch);

function Hero() {
  return `
  <section class="on-dark relative h-screen min-h-[640px] w-full overflow-hidden bg-foreground">
    <img src="${HERO_IMAGE}" alt="Aerial view of empty San Diego pickleball courts at golden hour" class="absolute inset-0 h-full w-full object-cover" />
    <div class="absolute inset-0 bg-gradient-to-b from-foreground/45 via-foreground/20 to-foreground/75"></div>
    <div class="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-10 text-center">
      <p class="fade-up mb-5 flex items-center gap-2 rounded-full bg-background/15 px-4 py-2 ${LBL} text-xs text-background backdrop-blur">${ball("h-4 w-4")} ${liveNowCount() ? `${liveNowCount()} spots have open play right now` : "San Diego's court atlas"}</p>
      <h1 class="fade-in font-display leading-[0.92] text-background" style="font-size:clamp(3.4rem,12.5vw,10.5rem);font-weight:700;--d:.2s">
        San Diego
        <span class="block text-primary">In Play<span class="ball-bounce">${ball("ml-[0.05em] inline-block h-[0.22em] w-[0.22em]")}</span></span>
      </h1>
      <p class="fade-up mt-7 max-w-xl font-body text-base text-background/90 sm:text-xl" style="--d:.6s">
        Public and private courts across San Diego — pickleball, tennis, padel, racquetball, squash and ping pong — with open play times and official schedules in one place.
      </p>
      <div class="fade-up mt-8 flex flex-wrap justify-center gap-3" style="--d:.9s">
        <a href="#/open-play" class="${BTN_SUN}">Find open play today ${icon.arrowRight("h-4 w-4")}</a>
        <a href="#/schedules" class="${BTN_LINE_DARK}">Official schedules</a>
      </div>
      <p class="fade-up mt-6 ${LBL} text-[11px] text-background/80" style="--d:1.1s">${VENUES.length} courts and clubs · ${VENUES.filter((v) => v.access === "public").length} public · ${VENUES.filter((v) => v.sport === "pickleball" && v.playDays.includes(TODAY)).length} with pickleball open play today</p>
    </div>
    <div class="fade-in absolute bottom-16 left-1/2 z-10 -translate-x-1/2 text-background/80 sm:bottom-24" style="--d:1.2s">
      <div class="bob flex flex-col items-center gap-1">
        <span class="${LBL} text-[10px]">Scroll</span>
        ${icon.chevronDown("h-4 w-4")}
      </div>
    </div>
    ${wave()}
  </section>`;
}

function FilterBar() {
  const pill = (attr, id, label, on) => `<button ${attr}="${id}" aria-pressed="${on}" class="shrink-0 rounded-full px-3.5 py-2 ${LBL} text-xs transition-colors ${on ? "bg-foreground text-background" : "text-foreground hover:bg-secondary"}">${label}</button>`;
  return `
  <div id="filter-bar" class="sticky top-14 z-30 border-b border-border bg-background/95 px-4 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:px-6">
    <div class="mx-auto flex max-w-7xl flex-col gap-1.5 lg:flex-row lg:items-center lg:justify-between">
      <div class="scroll-hint flex items-center gap-1 overflow-x-auto">
        <span class="mr-1 w-14 shrink-0 ${LBL} text-[10px] text-muted-foreground">Sport</span>
        ${SPORTS.map((s) => pill("data-sport", s.id, s.label, s.id === currentSport)).join("")}
      </div>
      <div class="scroll-hint flex items-center gap-1 overflow-x-auto">
        <span class="mr-1 w-14 shrink-0 ${LBL} text-[10px] text-muted-foreground">Access</span>
        ${pill("data-access", "all", "All", accessFilter === "all")}${pill("data-access", "public", "Public", accessFilter === "public")}${pill("data-access", "private", "Private", accessFilter === "private")}
        ${loc ? `<button data-loc-clear aria-label="Clear location ${esc(locLabel())}" class="ml-2 flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 ${LBL} text-xs text-primary-foreground">${icon.mapPin("h-3.5 w-3.5")} ${esc(locLabel())} <span aria-hidden="true">✕</span></button>` : ""}
      </div>
    </div>
  </div>`;
}

// Browse by State, City or ZIP code. Counts follow the chosen sport and access.
function locOptions(type) {
  const counts = new Map();
  baseVenues().forEach((v) => { if (v[type]) counts.set(v[type], (counts.get(v[type]) || 0) + 1); });
  return [...counts.entries()].sort((a, b) => (type === "zip" ? a[0].localeCompare(b[0]) : b[1] - a[1] || a[0].localeCompare(b[0])));
}
const locChip = (type, value, label, count) => {
  const on = loc && loc.type === type && loc.value === value;
  return `<button data-loc="${type}:${esc(value)}" aria-pressed="${!!on}" class="flex items-center gap-2 rounded-full py-2 pl-4 pr-2 ${LBL} text-xs transition-colors ${on ? "bg-foreground text-background" : "bg-secondary text-foreground hover:bg-sand"}">${esc(label)}<span class="flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[11px] ${on ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"}">${count}</span></button>`;
};
function ZipChips() {
  const q = zipQuery.trim(), zips = locOptions("zip").filter(([z]) => !q || z.startsWith(q));
  if (!zips.length) return `<p class="font-body text-base text-muted-foreground">No ${accessWord()}${sportOf(currentSport).noun} listed in ZIP codes starting with “${esc(q)}”. Try the City tab, or use “Nearest to me” in the directory.</p>`;
  return zips.map(([z, n]) => locChip("zip", z, z, n)).join("");
}
function LocationPanel() {
  const tab = (id, label) => `<button data-loctab="${id}" role="tab" aria-selected="${locTab === id}" class="rounded-t-2xl px-5 py-3 font-display text-lg transition-colors ${locTab === id ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"}">${label}</button>`;
  const all = `<button data-loc-clear aria-pressed="${!loc}" class="rounded-full px-4 py-2 ${LBL} text-xs transition-colors ${loc ? "bg-secondary text-foreground hover:bg-sand" : "bg-foreground text-background"}">Everywhere</button>`;
  const noAddress = baseVenues().filter((v) => !v.zip).length;
  const body = locTab === "state"
    ? `<div class="flex flex-wrap gap-2">${all}${locOptions("state").map(([st, n]) => locChip("state", st, STATE_NAMES[st] || st, n)).join("")}</div>
       <p class="mt-4 font-body text-sm text-muted-foreground">The atlas covers San Diego County, California for now. More states will show up here as they are added.</p>`
    : locTab === "city"
    ? `<div class="flex flex-wrap gap-2">${all}${locOptions("city").map(([c, n]) => locChip("city", c, c, n)).join("")}</div>
       <p class="mt-4 font-body text-sm text-muted-foreground">Cities follow each court's mailing address, so La Jolla is listed on its own.</p>`
    : `<label class="block max-w-xs">
         <span class="mb-2 block ${LBL} text-[10px] text-muted-foreground">Type a ZIP code</span>
         <input id="zip-search" type="text" inputmode="numeric" maxlength="5" autocomplete="postal-code" value="${esc(zipQuery)}" placeholder="e.g. 92109" class="h-11 w-full rounded-full border-2 border-input bg-background px-4 font-body text-base placeholder:text-muted-foreground focus-visible:border-ocean focus-visible:outline-none" />
       </label>
       <div id="zip-chips" class="mt-4 flex flex-wrap gap-2">${all}${ZipChips()}</div>
       ${noAddress ? `<p class="mt-4 font-body text-sm text-muted-foreground">${noAddress} ${noAddress === 1 ? "listing has" : "listings have"} no confirmed ZIP code yet and only ${noAddress === 1 ? "shows" : "show"} under Everywhere${locTab === "zip" ? ", State or City" : ""}.</p>` : ""}`;
  return `
  <section id="where" class="relative scroll-mt-28 bg-secondary px-6 pt-10">
    <div class="mx-auto max-w-7xl">
      ${eyebrow("Browse by location")}
      <div class="flex gap-1" role="tablist" aria-label="Browse by location">${tab("state", "State")}${tab("city", "City")}${tab("zip", "ZIP code")}</div>
      <div class="rounded-b-3xl rounded-tr-3xl bg-background p-5 sm:p-6" role="tabpanel">${body}</div>
    </div>
  </section>`;
}

function VenueCard(v, i, stagger = true) {
  const summary = playSummary(v);
  return `
  <a href="#/facility-details/${v.id}" class="on-dark reveal group relative block aspect-[4/5] w-full overflow-hidden rounded-3xl bg-foreground hard-shadow ${stagger ? (i % 2 ? "sm:max-lg:mt-14 " : "") + (i % 3 === 1 ? "lg:mt-14" : "") : ""}" style="--d:${(i % 3) * 0.07}s">
    ${venueImage(v, "transition-transform duration-700 ease-out group-hover:scale-105")}
    <div class="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/70 to-foreground/5"></div>
    <div class="absolute left-4 right-4 top-4 flex items-start justify-between gap-2">
      <span class="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-display text-sm text-primary-foreground">${i + 1}</span>
      <span class="flex flex-wrap justify-end gap-1.5">${unconfirmedChip(v, true)}${accessChip(v, true)}</span>
    </div>
    <div class="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
      <p class="mb-1.5 ${LBL} text-[11px] text-pop">${esc(v.area)}</p>
      <h3 class="font-display text-[1.7rem] leading-[1.05] text-background">${esc(v.name)}</h3>
      <p class="mt-2.5 font-body text-sm leading-snug text-background/80">${esc([v.courts, v.setting, v.cost].filter(Boolean).join(" · "))}</p>
      ${summary ? `<p class="mt-2.5 flex items-start gap-2 ${LBL} text-[11px] text-background">${icon.clock("mt-px h-3.5 w-3.5 shrink-0 text-pop")} <span>${esc(summary)}</span></p>` : ""}
      <span class="mt-4 flex w-full items-center justify-between rounded-full bg-primary px-5 py-3 ${LBL} text-xs text-primary-foreground">Schedule &amp; details ${icon.arrowRight("h-4 w-4 transition-transform group-hover:translate-x-1")}</span>
    </div>
  </a>`;
}

const emptyState = (text) => `<p class="rounded-3xl border-2 border-dashed border-border px-6 py-10 text-center font-body text-base text-muted-foreground">${text}</p>`;
const accessWord = () => (accessFilter === "all" ? "" : accessFilter + " ");
const sectionTitle = (html) => `<h2 class="font-display text-5xl leading-[0.95] text-foreground sm:text-7xl">${html}</h2>`;

function Featured(n) {
  const list = loc ? sportVenues().sort(byScore).slice(0, 6) : sportVenues().filter((v) => v.featured).sort(byScore);
  const sport = sportOf(currentSport);
  return `
  <section id="courts" class="relative bg-secondary px-6 pb-20 pt-14 sm:pb-28 sm:pt-16">
    ${dots()}
    <div class="relative mx-auto max-w-7xl">
      <div class="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          ${eyebrow(`${pad2(n)} · The Court Ledger`)}
          ${sectionTitle(`Featured<br>courts<span class="text-pop">.</span>`)}
        </div>
        <p class="max-w-sm font-body text-base text-muted-foreground ${list.length ? "" : "hidden"}">The ${list.length === 1 ? "top" : `${list.length} ${loc ? "top" : "standout"}`} ${accessWord()}${sport.label.toLowerCase()} ${list.length === 1 ? "venue" : "venues"}${whereWord()}, ranked by how good the courts are${hasOpenPlay(currentSport) ? " and how many days a week they run open play" : ""}.</p>
      </div>
      ${list.length ? `<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">${list.map((v, i) => VenueCard(v, i)).join("")}</div>`
        : emptyState(loc ? `No ${accessWord()}${sport.noun}${whereWord()} yet. Try another location, sport or access setting.` : `No featured ${accessWord()}${sport.noun} yet. ${accessFilter === "public" ? "We haven't confirmed any free public ones. Try Private, or tell us about one on the Contact page." : "Try switching the Access filter."}`)}
    </div>
  </section>`;
}

function OpenPlay(n) {
  if (!hasOpenPlay(currentSport)) return "";
  const all = sportVenues().filter((v) => v.sessions.length);
  const isToday = currentDay === TODAY;
  const rank = (v) => { const st = v.sessions.filter((s) => s.days.includes(currentDay)).map(sessionState); return st.includes("live") ? 0 : st.includes("soon") ? 1 : st.includes("later") || st.includes(null) ? 2 : 3; };
  const today = all.filter((v) => v.playDays.includes(currentDay)).sort((a, b) => (isToday ? rank(a) - rank(b) : 0) || byScore(a, b));
  const liveCount = isToday ? today.filter((v) => rank(v) === 0).length : 0;
  const stateChip = (s) => {
    if (!isToday) return "";
    const st = sessionState(s), r = parseRange(s.time);
    return st === "live" ? `<span class="${CHIP} bg-primary text-primary-foreground">● On now · until ${fmtTime(r[1])}</span>`
      : st === "soon" ? `<span class="${CHIP} bg-background/20 text-background">Starts in ${r[0] - nowMinutes()} min</span>`
      : st === "done" ? `<span class="${CHIP} bg-background/10 text-background/50">Ended</span>` : "";
  };
  const sport = sportOf(currentSport);
  return `
  <section id="open-play" class="on-dark relative scroll-mt-28 overflow-hidden bg-foreground px-6 py-20 text-background sm:py-28">
    ${dots("text-background/[0.06]")}
    <div class="relative mx-auto max-w-7xl">
      <div class="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          ${eyebrow(`${pad2(n)} · Open Play`, "text-background/60")}
          <h2 class="font-display text-5xl leading-[0.95] sm:text-7xl">Open play,<br>day by day<span class="text-pop">.</span></h2>
        </div>
        <p class="max-w-sm font-body text-base text-background/75">Pick a day to see every ${accessWord()}${sport.label.toLowerCase()} spot${whereWord()} with open play and the hours. Schedules change, so call ahead before a special trip.</p>
      </div>
      <div class="scroll-hint mb-8 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Day of the week">
        ${DAYS.map((d) => {
          const on = d === currentDay, count = all.filter((v) => v.playDays.includes(d)).length;
          return `<button data-day="${d}" role="tab" aria-selected="${on}" class="flex shrink-0 items-center gap-2 rounded-full py-2 pl-4 pr-2 ${LBL} text-xs transition-colors ${on ? "bg-primary text-primary-foreground" : "bg-background/10 text-background hover:bg-background/20"}">${d}${d === TODAY ? " · today" : ""}<span class="flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[11px] ${on ? "bg-foreground text-background" : "bg-background/15 text-background/80"}">${count}</span></button>`;
        }).join("")}
      </div>
      <p class="mb-5 flex flex-wrap items-center gap-3 ${LBL} text-[11px] text-background/60"><span>${today.length} ${today.length === 1 ? "place" : "places"} with open play on ${DAY_NAMES[currentDay]}</span>${liveCount ? `<span class="${CHIP} bg-primary text-primary-foreground">● ${liveCount} on right now</span>` : ""}</p>
      ${today.length ? `<ul class="space-y-2">
        ${(showAllPlay ? today : today.slice(0, 10)).map((v) => `
          <li>
            <a href="#/facility-details/${v.id}" class="group grid gap-3 rounded-3xl bg-background/[0.06] px-5 py-4 transition-colors hover:bg-background/[0.12] sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-8 sm:px-6">
              <div>
                <h3 class="font-display text-2xl leading-tight transition-colors group-hover:text-pop">${esc(v.name)}</h3>
                <p class="mt-2 flex flex-wrap items-center gap-2 font-body text-sm text-background/70">
                  ${accessChip(v, true)}<span>${esc(v.area)}</span>${v.cost ? `<span>· ${esc(v.cost)}</span>` : ""}
                </p>
              </div>
              <ul class="space-y-1 self-center">
                ${v.sessions.filter((s) => s.days.includes(currentDay)).map((s) => `
                  <li class="flex flex-wrap items-center gap-x-3 gap-y-1 ${isToday && sessionState(s) === "done" ? "opacity-50" : ""}">
                    <span class="font-mono text-base text-background">${esc(s.time)}</span>
                    <span class="font-body text-sm text-background/60">${esc([s.where, s.note].filter(Boolean).join(" · "))}</span>
                    ${stateChip(s)}
                  </li>`).join("")}
              </ul>
            </a>
          </li>`).join("")}
      </ul>${!showAllPlay && today.length > 10 ? moreButton("data-more-play", today.length, "places") : ""}` : `<p class="rounded-3xl border-2 border-dashed border-background/25 px-6 py-10 text-center font-body text-base text-background/75">No ${accessWord()}open play listed${whereWord()} for ${DAY_NAMES[currentDay]}. Try another day, location or access setting.</p>`}
      <p class="mt-8 font-body text-sm text-background/60">Public hours: City of San Diego pickleball list, updated 8/29/2026. Club hours: each club's website, checked ${DATA_CHECKED}. <a href="#/schedules" class="underline underline-offset-4 hover:text-pop">See the official schedules</a>.</p>
    </div>
  </section>`;
}

function DirectoryRows() {
  const q = dirQuery.trim().toLowerCase();
  const near = sortNear && userLoc;
  const list = sportVenues().filter((v) => !q || `${v.name} ${v.area}`.toLowerCase().includes(q))
    .sort((a, b) => (near ? (distOf(a) ?? 9999) - (distOf(b) ?? 9999) : 0) || byScore(a, b));
  if (!list.length) return emptyState(q ? `Nothing matches “${esc(dirQuery)}”.` : `No ${accessWord()}${sportOf(currentSport).noun} listed${whereWord()} yet. Try another location or access setting.`);
  const shown = showAllDir || q ? list : list.slice(0, 20);
  return `<ul class="divide-y divide-border border-y border-border">
    ${shown.map((v) => `
      <li class="flex items-center gap-4 py-4 sm:gap-5">
        <a href="#/facility-details/${v.id}" tabindex="-1" aria-hidden="true" class="relative hidden h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-foreground sm:block">${venueImage(v)}</a>
        <div class="min-w-0 flex-1">
          <h3 class="font-display text-xl leading-tight text-foreground sm:text-2xl"><a href="#/facility-details/${v.id}" class="transition-colors hover:text-pop">${esc(v.name)}</a></h3>
          <p class="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-sm text-muted-foreground">
            ${accessChip(v)}${unconfirmedChip(v)}${distLabel(v) ? `<span class="${CHIP} bg-primary text-primary-foreground">${distLabel(v)}</span>` : ""}<span>${esc([v.area, v.courts, v.setting].filter(Boolean).join(" · "))}</span>
          </p>
          ${playSummary(v) ? `<p class="mt-1.5 ${LBL} text-[11px] text-pop">${esc(playSummary(v))}</p>` : ""}
        </div>
        <div class="flex shrink-0 flex-col items-end gap-2 ${LBL} text-[11px]">
          <a href="#/facility-details/${v.id}" class="flex items-center gap-1.5 rounded-full border-2 border-foreground px-3.5 py-1.5 text-foreground transition-colors hover:bg-foreground hover:text-background">Details ${icon.arrowRight("h-3.5 w-3.5")}</a>
          ${v.pdf ? `<a href="${v.pdf.url}" ${ext} class="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-pop">${icon.file("h-3.5 w-3.5")} Schedule PDF</a>` : ""}
        </div>
      </li>`).join("")}
  </ul>${shown.length < list.length ? moreButton("data-more-dir", list.length, "courts") : ""}`;
}

function Directory(n) {
  const sport = sportOf(currentSport), count = sportVenues().length;
  return `
  <section id="directory" class="relative scroll-mt-28 bg-background px-6 py-20 sm:py-28">
    <div class="mx-auto max-w-7xl">
      <div class="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div class="max-w-2xl">
          ${eyebrow(`${pad2(n)} · The Full Directory`)}
          ${sectionTitle(`Every<br>court<span class="text-pop">.</span>`)}
          <p class="mt-6 font-body text-base text-muted-foreground">${count ? `${count === 1 ? "The 1" : `All ${count}`} ${accessWord()}${sport.noun}${loc ? whereWord() : " in the atlas"}, ${sortNear && userLoc ? "nearest first" : "best first"}.` : ""} Open any one for its schedule, address, phone number and official links.</p>
          <div class="mt-5 flex flex-wrap items-center gap-2">
            <span class="${LBL} text-[10px] text-muted-foreground">Sort</span>
            <button data-sort="best" aria-pressed="${!(sortNear && userLoc)}" class="rounded-full px-3.5 py-2 ${LBL} text-[11px] transition-colors ${sortNear && userLoc ? "bg-secondary text-foreground" : "bg-foreground text-background"}">Best first</button>
            <button data-near aria-pressed="${!!(sortNear && userLoc)}" class="flex items-center gap-1.5 rounded-full px-3.5 py-2 ${LBL} text-[11px] transition-colors ${sortNear && userLoc ? "bg-foreground text-background" : "bg-secondary text-foreground"}">${icon.mapPin("h-3.5 w-3.5")} Nearest to me</button>
            ${locMsg ? `<span class="font-body text-sm text-muted-foreground">${esc(locMsg)}</span>` : ""}
          </div>
        </div>
        <label class="block w-full sm:w-72">
          <span class="mb-2 block ${LBL} text-[10px] text-muted-foreground">Search by name or neighborhood</span>
          <input id="dir-search" type="search" value="${esc(dirQuery)}" placeholder="e.g. North Park" class="h-11 w-full rounded-full border-2 border-input bg-background px-4 font-body text-base placeholder:text-muted-foreground focus-visible:border-ocean focus-visible:outline-none" />
        </label>
      </div>
      <div id="dir-list">${DirectoryRows()}</div>
    </div>
  </section>`;
}

/* ---------- map ---------- */
const PIN = (color) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 40" width="30" height="40"><path d="M15 39C15 39 28 24.5 28 14.5A13 13 0 0 0 2 14.5C2 24.5 15 39 15 39Z" fill="${color}" stroke="#FFFAF0" stroke-width="2"/><circle cx="15" cy="14.5" r="6.2" fill="#F7C531"/><g fill="#C99A12"><circle cx="15" cy="14.5" r="1"/><circle cx="15" cy="11" r=".9"/><circle cx="15" cy="18" r=".9"/><circle cx="12" cy="12.8" r=".9"/><circle cx="18" cy="12.8" r=".9"/><circle cx="12" cy="16.2" r=".9"/><circle cx="18" cy="16.2" r=".9"/></g></svg>`;
const PIN_COLOR = { public: "#117198", private: "#EE6A45" };

function MapSection(n) {
  const all = sportVenues(), onMap = all.filter((v) => v.geo).length;
  return `
  <section id="map" class="relative scroll-mt-28 bg-background px-6 pt-20 sm:pt-28">
    <div class="mx-auto max-w-7xl">
      <div class="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          ${eyebrow(`${pad2(n)} · The Map`)}
          ${sectionTitle(`Find a court<br>near you<span class="text-pop">.</span>`)}
        </div>
        <div class="max-w-sm">
          <button data-near class="${BTN_SUN}">${icon.mapPin("h-4 w-4")} ${userLoc ? "Update my location" : "Use my location"}</button>
          <p class="mt-3 font-body text-sm text-muted-foreground">${esc(locMsg || "Shows the closest courts first. Your location stays on your device.")}</p>
        </div>
      </div>
      <div id="court-map" class="map-box map-box-lg relative z-0 overflow-hidden rounded-3xl border-2 border-border bg-secondary" role="application" aria-label="Map of ${esc(sportOf(currentSport).label)} courts"></div>
      <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-body text-sm text-muted-foreground">
        <span class="flex items-center gap-2"><span class="h-3 w-3 rounded-full" style="background:${PIN_COLOR.public}"></span> Public</span>
        <span class="flex items-center gap-2"><span class="h-3 w-3 rounded-full" style="background:${PIN_COLOR.private}"></span> Private club</span>
        <span>${onMap} of ${all.length} ${accessWord()}${sportOf(currentSport).noun}${whereWord()} are on the map${onMap < all.length ? "; the rest don't have a confirmed address yet" : ""}.</span>
      </div>
    </div>
  </section>`;
}

// Maps must be shut down before the page under them is replaced, or the map library
// keeps animating elements that no longer exist.
function closeMap(m) { if (m) { try { m.stop(); m.off(); m.remove(); } catch {} } return null; }
function closeMaps() { mapObj = closeMap(mapObj); venueMapObj = closeMap(venueMapObj); }

function initMap() {
  const el = document.getElementById("court-map");
  mapObj = closeMap(mapObj);
  if (!el) return;
  if (!window.L) { el.innerHTML = `<p class="flex h-full items-center justify-center px-6 text-center font-body text-base text-muted-foreground">The map couldn't load. Check your connection and refresh.</p>`; return; }
  const list = sportVenues().filter((v) => v.geo);
  mapObj = L.map(el, { scrollWheelZoom: false, zoomAnimation: false, fadeAnimation: false, markerZoomAnimation: false }).setView([32.85, -117.12], 10);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors' }).addTo(mapObj);
  list.forEach((v) => {
    const icon = L.divIcon({ className: "court-pin", html: PIN(PIN_COLOR[v.access] || PIN_COLOR.public), iconSize: [30, 40], iconAnchor: [15, 39], popupAnchor: [0, -36] });
    L.marker(v.geo, { icon, title: v.name, alt: v.name }).addTo(mapObj).bindPopup(`
      <div class="map-pop">
        <p class="map-pop-area">${esc(v.area)} · ${v.access === "public" ? "Public" : "Private club"}${distLabel(v) ? ` · ${distLabel(v)}` : ""}</p>
        <p class="map-pop-name">${esc(v.name)}</p>
        ${playSummary(v) ? `<p class="map-pop-line">${esc(playSummary(v))}</p>` : ""}
        <a class="map-pop-link" href="#/facility-details/${v.id}">Schedule &amp; details →</a>
      </div>`);
  });
  if (userLoc) L.circleMarker(userLoc, { radius: 9, color: "#FFFAF0", weight: 3, fillColor: "#102F46", fillOpacity: 1 }).addTo(mapObj).bindPopup("You are here");
  const pts = list.map((v) => v.geo);
  if (userLoc && pts.length) {
    const nearest = [...list].sort((a, b) => distOf(a) - distOf(b)).slice(0, 5).map((v) => v.geo);
    mapObj.fitBounds([userLoc, ...nearest], { padding: [50, 50], maxZoom: 14, animate: false });
  } else if (pts.length) mapObj.fitBounds(pts, { padding: [40, 40], maxZoom: 13, animate: false });
  const m = mapObj; setTimeout(() => m === mapObj && m.invalidateSize({ animate: false }), 300);
}

function locateMe() {
  if (!navigator.geolocation) { locMsg = "This browser can't share a location."; return refreshSections(); }
  locMsg = "Finding you…"; refreshSections();
  navigator.geolocation.getCurrentPosition(
    (pos) => { userLoc = [pos.coords.latitude, pos.coords.longitude]; sortNear = true; locMsg = "Showing the courts closest to you."; refreshSections(); },
    () => { locMsg = "We couldn't get your location. Check that location access is allowed for this site."; refreshSections(); },
    { timeout: 10000, maximumAge: 300000 }
  );
}

function Schedules(n) {
  return `
  <section id="schedules" class="relative scroll-mt-28 overflow-hidden bg-secondary px-6 py-20 sm:py-28">
    ${dots()}
    <div class="relative mx-auto max-w-7xl">
      <div class="mb-14 max-w-2xl">
        ${eyebrow(`${pad2(n)} · Schedules &amp; PDFs`)}
        ${sectionTitle(`Straight from<br>the source<span class="text-pop">.</span>`)}
        <p class="mt-6 font-body text-base text-muted-foreground">The official schedule PDFs for public courts, and the open play pages of local clubs and organizations. These open on the City's or the club's own website.</p>
      </div>
      <div class="grid gap-10 lg:grid-cols-2">
        ${DOCUMENTS.map((g) => `
          <div>
            <h3 class="mb-4 ${LBL} text-xs text-muted-foreground">${esc(g.group)}</h3>
            <ul class="space-y-2">
              ${g.items.map((d) => `
                <li>
                  <a href="${d.url}" ${ext} class="group flex items-start gap-4 rounded-3xl bg-background px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-lg">
                    <span class="mt-0.5 w-12 shrink-0 rounded-full py-1 text-center ${LBL} text-[10px] ${d.kind === "PDF" ? "bg-primary text-primary-foreground" : "bg-foreground text-background"}">${d.kind}</span>
                    <span class="min-w-0 flex-1">
                      <span class="block font-display text-xl leading-tight text-foreground transition-colors group-hover:text-pop">${esc(d.title)}</span>
                      <span class="mt-1 block font-body text-sm text-muted-foreground">${esc(d.note)}</span>
                    </span>
                    ${icon.arrowUpRight("mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-pop")}
                  </a>
                </li>`).join("")}
            </ul>
          </div>`).join("")}
      </div>
    </div>
  </section>`;
}

function SportSections() {
  let n = 2;
  const featured = Featured(n++), open = OpenPlay(n);
  if (open) n++;
  return FilterBar() + LocationPanel() + featured + open + MapSection(n++) + Directory(n++) + Schedules(n);
}

function HomePage() {
  return `${Nav()}<main class="min-h-screen bg-background">${Hero()}<div id="sport-sections">${SportSections()}</div>${Footer()}</main>`;
}

/* ---------- about ---------- */
function AboutPage() {
  return page(`
    <section class="on-dark relative overflow-hidden bg-foreground px-6 py-24 text-background sm:py-32">
      <img src="${HERO_IMAGE}" alt="San Diego courts at golden hour" class="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div class="relative mx-auto max-w-5xl">
        ${eyebrow("The Story", "text-background/70", "mb-4")}
        <h1 class="fade-up font-display text-5xl leading-[0.95] sm:text-8xl" style="--fy:16px">Kinetic Court<span class="text-pop"> SD</span></h1>
      </div>
      ${wave()}
    </section>
    <section class="px-6 py-20 sm:py-28">
      <div class="mx-auto grid max-w-5xl gap-10 sm:grid-cols-3">
        <div class="sm:col-span-1">${eyebrow("Our Mission")}</div>
        <div class="sm:col-span-2">
          <p class="font-body text-xl leading-relaxed text-foreground sm:text-2xl">We exist to give San Diego's fast-growing pickleball community one place to find a game: open play times, public and private courts, and the official schedules, alongside tennis, padel, racquetball, squash and ping pong.</p>
          <p class="mt-6 font-body text-base leading-relaxed text-muted-foreground">Kinetic Court SD was born from a simple frustration: court info was scattered across city PDFs, club sites, and forum threads. We built a single atlas that maps the county's facilities, shows when open play runs, and links straight to the official source — so the only thing between you and the court is the drive there.</p>
        </div>
      </div>
    </section>
    <section class="relative overflow-hidden bg-secondary px-6 py-20 sm:py-28">
      ${dots()}
      <div class="relative mx-auto max-w-5xl">
        <h2 class="mb-12 font-display text-4xl leading-[0.95] text-foreground sm:text-6xl">What we stand for<span class="text-pop">.</span></h2>
        <div class="grid gap-4 sm:grid-cols-3">
          ${VALUES.map((v) => `
            <div class="rounded-3xl bg-background p-7">
              <p class="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-sm text-primary-foreground">${v.n}</p>
              <h3 class="mb-2 font-display text-2xl text-foreground">${v.t}</h3>
              <p class="font-body text-sm leading-relaxed text-muted-foreground">${v.d}</p>
            </div>`).join("")}
        </div>
      </div>
    </section>
    <section class="px-6 py-20 sm:py-24">
      <div class="mx-auto max-w-5xl">
        ${eyebrow("Photo Credits")}
        <h2 class="font-display text-3xl text-foreground sm:text-4xl">Pictures on this site</h2>
        <p class="mt-4 max-w-2xl font-body text-base text-muted-foreground">Real photos come from Wikimedia Commons under free licenses, resized and cropped to fit. Courts without a photo show an illustration, and a few pictures carried over from our first version are illustrative images, not photos of the venue.</p>
        <ul class="mt-8 divide-y divide-border border-y border-border font-body text-sm">
          ${Object.values(PHOTOS).map((p) => `
            <li class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
              <a href="${p.page}" ${ext} class="text-foreground underline underline-offset-4 hover:text-pop">${esc(p.shows)}</a>
              <span class="text-muted-foreground">${esc(p.author)} · <a href="${p.licenseUrl}" ${ext} class="underline underline-offset-4 hover:text-pop">${esc(p.license)}</a></span>
            </li>`).join("")}
        </ul>
      </div>
    </section>`);
}

/* ---------- facilities ---------- */
let facilitySport = "all";

function FacilitiesPage() {
  const list = VENUES.filter((v) => (facilitySport === "all" ? v.featured : v.sport === facilitySport) && (accessFilter === "all" || v.access === accessFilter)).sort(byScore);
  const chip = (attr, id, label, on) => `<button ${attr}="${id}" aria-pressed="${on}" class="rounded-full px-4 py-2 ${LBL} text-[11px] transition-colors ${on ? "bg-foreground text-background" : "bg-background text-foreground hover:bg-background/60"}">${label}</button>`;
  return page(`
    <section class="relative overflow-hidden bg-secondary px-6 py-20 sm:py-28">
      ${dots()}
      <div class="relative mx-auto max-w-7xl">
        ${eyebrow("The Facilities")}
        <h1 class="font-display text-5xl leading-[0.95] text-foreground sm:text-8xl">Every court,<br>one atlas<span class="text-pop">.</span></h1>
        <p class="mt-6 max-w-xl font-body text-lg text-muted-foreground">Browse facilities across San Diego. “All featured” shows the standout venues for every sport; pick a sport to see every court. Open any card for its schedule, pricing and official links.</p>
        <div class="mt-10 flex flex-wrap gap-2">${chip("data-fsport", "all", "All featured", facilitySport === "all")}${SPORTS.map((s) => chip("data-fsport", s.id, s.label, facilitySport === s.id)).join("")}</div>
        <div class="mt-2 flex flex-wrap gap-2">${chip("data-faccess", "all", "Public + private", accessFilter === "all")}${chip("data-faccess", "public", "Public only", accessFilter === "public")}${chip("data-faccess", "private", "Private only", accessFilter === "private")}</div>
        <div class="mt-12">${list.length ? `<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">${list.map((v, i) => VenueCard(v, i, false)).join("")}</div>` : emptyState("Nothing matches those filters yet.")}</div>
      </div>
    </section>`);
}

function pictureNote(v) {
  const p = v.photoInfo;
  if (p) return `Photo: ${esc(p.shows)}${p.area ? " (shows the area, not the courts)" : ""}. By ${esc(p.author)}, <a href="${p.licenseUrl}" ${ext} class="underline underline-offset-4 hover:text-pop">${esc(p.license)}</a>, via <a href="${p.page}" ${ext} class="underline underline-offset-4 hover:text-pop">Wikimedia Commons</a>. Resized.`;
  return v.image ? "The picture above is an illustrative image, not a photo of this venue." : "The picture above is an illustration, not a photo of this venue.";
}

function FacilityDetailPage(id) {
  const v = findVenue(id);
  if (!v) {
    return page(`
      <section class="px-6 py-32">
        <div class="mx-auto max-w-2xl text-center">
          ${ball("mx-auto mb-6 h-14 w-14")}
          <h1 class="font-display text-5xl text-foreground">Out of bounds.</h1>
          <p class="mt-4 font-body text-lg text-muted-foreground">This facility isn't in our atlas yet.</p>
          <a href="#/facility-details" class="${BTN_LINE} mt-8">${icon.arrowLeft("h-4 w-4")} Back to facilities</a>
        </div>
      </section>`);
  }
  const sport = sportOf(v.sport);
  const specs = [["Sport", sport.label], ["Courts", v.courts], ["Setting", [v.setting, v.lights].filter(Boolean).join(" · ")], ["Access", v.access === "public" ? "Public" : "Private club"]].filter(([, val]) => val);
  const label = (t) => eyebrow(t, "text-muted-foreground", "mb-5");
  const box = "rounded-3xl border-2 border-border bg-background";
  const schedule = v.closed
    ? `<p class="${box} p-6 font-display text-2xl text-foreground">${esc(v.closed)}</p>`
    : v.sessions.length ? `
      <div class="${box} overflow-hidden">
        <table class="w-full text-left">
          <tbody class="divide-y divide-border">
            ${DAYS.map((d) => {
              const ss = v.sessions.filter((s) => s.days.includes(d));
              return `<tr class="${d === TODAY ? "bg-primary/20" : ""}">
                <th scope="row" class="w-24 py-3 pl-5 align-top ${LBL} text-[11px] ${ss.length ? "text-foreground" : "text-muted-foreground/60"}">${DAY_NAMES[d].slice(0, 3)}${d === TODAY ? `<span class="block text-pop">Today</span>` : ""}</th>
                <td class="py-3 pr-5">${ss.length ? ss.map((s) => `<p class="font-mono text-base text-foreground">${esc(s.time)} <span class="font-body text-sm font-normal text-muted-foreground">${esc([s.where, s.note].filter(Boolean).join(" · "))}</span></p>`).join("") : `<p class="font-body text-base text-muted-foreground/60">No open play</p>`}</td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>`
    : v.hours ? `<p class="${box} p-6 font-body text-base text-foreground"><span class="mb-1 block ${LBL} text-[10px] text-muted-foreground">Court hours</span>${esc(v.hours)}</p>`
    : v.openCourts ? "" : `<p class="rounded-3xl border-2 border-dashed border-border p-6 font-body text-base text-muted-foreground">No set open play times are published for this venue. Check its official site for the latest.</p>`;

  return page(`
    <section class="on-dark relative h-[58vh] max-h-[620px] min-h-[420px] w-full overflow-hidden bg-foreground">
      ${venueImage(v, "", true)}
      <div class="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/45 to-foreground/5"></div>
      <div class="absolute bottom-0 left-0 right-0 px-6 pb-16 sm:pb-24">
        <div class="mx-auto max-w-5xl">
          <p class="mb-3 flex flex-wrap items-center gap-2 ${LBL} text-xs text-pop">${icon.mapPin("h-4 w-4")} ${esc(v.area)} <span class="ml-2 flex gap-1.5">${accessChip(v, true)}${unconfirmedChip(v, true)}</span></p>
          <h1 class="font-display text-4xl leading-[0.98] text-background sm:text-7xl">${esc(v.name)}</h1>
        </div>
      </div>
      ${wave()}
    </section>
    <section class="px-6 pb-20 pt-10 sm:pb-28">
      <div class="mx-auto max-w-5xl">
        <a href="#/facility-details" class="mb-8 inline-flex items-center gap-2 ${LBL} text-[11px] text-muted-foreground transition-colors hover:text-pop">${icon.arrowLeft("h-4 w-4")} All facilities</a>
        ${v.verified === false ? `<p class="mb-10 rounded-3xl border-2 border-dashed border-coral bg-coral/10 p-5 font-body text-sm text-foreground"><strong>Unconfirmed listing.</strong> This venue was carried over from an earlier version of the atlas and its details haven't been checked against an official source yet. Confirm with the venue before you go.</p>` : ""}
        ${v.blurb ? `<p class="mb-12 max-w-3xl font-body text-xl leading-relaxed text-foreground">${esc(v.blurb)}</p>` : ""}
        <div class="grid gap-12 lg:grid-cols-2">
          <div>
            ${label(v.sessions.length || v.sport === "pickleball" ? "Open Play Schedule" : "Hours")}
            ${schedule}
            ${v.openCourts ? `<p class="${v.sessions.length ? "mt-4 " : ""}${box} p-5 font-body text-base text-foreground"><span class="mb-1 block ${LBL} text-[10px] text-muted-foreground">Open courts</span>${esc(v.openCourts)}</p>` : ""}
            ${v.sessions.length || v.hours || v.openCourts ? `<p class="mt-4 font-body text-sm text-muted-foreground">Hours are subject to change${v.phone ? `. Call ${esc(v.phone)} to confirm before a special trip` : ""}.</p>` : ""}
            <div class="mt-10">
              ${label("Court Details")}
              <div class="grid grid-cols-2 gap-3">
                ${specs.map(([l, val]) => `
                  <div class="rounded-3xl bg-secondary p-5">
                    <p class="${LBL} text-[10px] text-muted-foreground">${l}</p>
                    <p class="mt-1 font-display text-lg leading-tight text-foreground">${esc(val)}</p>
                  </div>`).join("")}
              </div>
              ${v.accessNote ? `<p class="mt-4 font-body text-sm text-muted-foreground">${esc(v.accessNote)}.</p>` : ""}
            </div>
          </div>
          <div>
            ${label("Pricing &amp; Links")}
            <div class="${box} p-6 hard-shadow-clay">
              <p class="${LBL} text-[10px] text-muted-foreground">Cost</p>
              <p class="mt-1 font-display text-3xl leading-tight text-foreground">${esc(v.cost || "See website")}</p>
              <div class="mt-6 space-y-3">
                <a href="${v.website}" ${ext} class="${BTN_SUN} w-full !justify-between">${v.access === "public" ? "Official info" : "Visit official site"} ${icon.arrowUpRight("h-4 w-4")}</a>
                ${v.scheduleUrl && v.scheduleUrl !== v.website ? `<a href="${v.scheduleUrl}" ${ext} class="${BTN_LINE} w-full !justify-between">${esc(v.scheduleLabel || "Schedule")} ${icon.arrowUpRight("h-4 w-4")}</a>` : ""}
                ${v.pdf ? `<a href="${v.pdf.url}" ${ext} class="${BTN_LINE} w-full !justify-between"><span class="flex items-center gap-2">${icon.file("h-4 w-4")} ${esc(v.pdf.label)}</span> ${icon.arrowUpRight("h-4 w-4")}</a>` : ""}
              </div>
              <ul class="mt-6 space-y-3 font-body text-base text-foreground">
                ${v.address ? `<li class="flex gap-3">${icon.mapPin("mt-1 h-4 w-4 shrink-0 text-pop")}<a href="${mapsUrl(v.address)}" ${ext} class="underline underline-offset-4 hover:text-pop">${esc(v.address)}</a></li>` : ""}
                ${v.phone ? `<li class="flex gap-3">${icon.phone("mt-1 h-4 w-4 shrink-0 text-pop")}<span>${esc(v.phone)}</span></li>` : ""}
              </ul>
            </div>
            ${v.geo ? `
            <div class="mt-10">
              ${label("Location")}
              <div id="venue-map" data-venue="${v.id}" class="map-box relative z-0 overflow-hidden rounded-3xl border-2 border-border bg-secondary" role="application" aria-label="Map showing ${esc(v.name)}"></div>
            </div>` : ""}
            <div class="mt-4 flex flex-wrap gap-3">
              ${v.address ? `<a href="${mapsUrl(v.address)}" ${ext} class="${BTN_LINE}">${icon.mapPin("h-4 w-4")} Get directions</a>` : ""}
              <button data-share class="${BTN_LINE}">${icon.send("h-4 w-4")} <span data-share-label>Share this court</span></button>
            </div>
            ${v.source ? `<p class="mt-8 font-body text-sm text-muted-foreground">Source: <a href="${v.source.url}" ${ext} class="underline underline-offset-4 hover:text-pop">${esc(v.source.label)}</a>. Last checked ${DATA_CHECKED}.</p>` : ""}
            <p class="mt-3 font-body text-sm text-muted-foreground">${pictureNote(v)}</p>
          </div>
        </div>
        ${nearbyCourts(v)}
      </div>
    </section>`);
}

// The four closest other venues for the same sport.
function nearbyCourts(v) {
  if (!v.geo) return "";
  const near = VENUES.filter((o) => o !== v && o.sport === v.sport && o.geo && !o.closed)
    .map((o) => [milesBetween(v.geo, o.geo), o]).sort((a, b) => a[0] - b[0]).slice(0, 4);
  if (!near.length) return "";
  return `
        <div class="mt-16">
          ${eyebrow("Nearby " + sportOf(v.sport).label + " Courts", "text-muted-foreground", "mb-5")}
          <ul class="grid gap-3 sm:grid-cols-2">
            ${near.map(([d, o]) => `
              <li><a href="#/facility-details/${o.id}" class="group flex items-center gap-4 rounded-3xl bg-secondary p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
                <span class="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-foreground">${venueImage(o)}</span>
                <span class="min-w-0 flex-1">
                  <span class="block font-display text-lg leading-tight text-foreground transition-colors group-hover:text-pop">${esc(o.name)}</span>
                  <span class="mt-1 block font-body text-sm text-muted-foreground">${d < 10 ? d.toFixed(1) : Math.round(d)} mi away · ${o.access === "public" ? "Public" : "Private club"}${o.playDays.length ? ` · open play ${o.playDays.length} day${o.playDays.length > 1 ? "s" : ""} a week` : ""}</span>
                </span>
                ${icon.arrowRight("h-4 w-4 shrink-0 text-muted-foreground")}
              </a></li>`).join("")}
          </ul>
        </div>`;
}

function initVenueMap() {
  const el = document.getElementById("venue-map");
  venueMapObj = closeMap(venueMapObj);
  if (!el || !window.L) return;
  const v = findVenue(el.dataset.venue);
  venueMapObj = L.map(el, { scrollWheelZoom: false, zoomAnimation: false, fadeAnimation: false, markerZoomAnimation: false }).setView(v.geo, 14);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors' }).addTo(venueMapObj);
  L.marker(v.geo, { icon: L.divIcon({ className: "court-pin", html: PIN(PIN_COLOR[v.access] || PIN_COLOR.public), iconSize: [30, 40], iconAnchor: [15, 39] }), title: v.name, alt: v.name }).addTo(venueMapObj);
  const m = venueMapObj; setTimeout(() => m === venueMapObj && m.invalidateSize({ animate: false }), 300);
}

async function shareVenue() {
  const label = document.querySelector("[data-share-label]"), url = location.href;
  try {
    if (navigator.share) await navigator.share({ title: document.title, url });
    else { await navigator.clipboard.writeText(url); if (label) label.textContent = "Link copied!"; }
  } catch { if (label) label.textContent = "Copy the address bar link"; }
}

/* ---------- faq ---------- */
function FaqPage() {
  return page(`
    ${pageHeader("Community FAQ", `Questions,<br>answered<span class="text-pop">.</span>`, "Everything a new player needs to know about open play, public and private courts, and finding a game in San Diego.")}
    <section class="px-6 py-16 sm:py-24">
      <div class="mx-auto max-w-3xl space-y-3">
        ${FAQ.map((f, i) => `
          <div class="faq-item rounded-3xl border-2 border-border bg-background px-6">
            <h3 class="flex">
              <button data-faq="${i}" aria-expanded="false" class="flex flex-1 items-center justify-between gap-4 py-5 text-left font-display text-xl text-foreground sm:text-2xl">
                ${esc(f.q)}
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">${icon.chevronDown("faq-chevron h-4 w-4 transition-transform duration-200")}</span>
              </button>
            </h3>
            <div class="faq-body"><div class="overflow-hidden"><p class="pb-6 font-body text-base leading-relaxed text-muted-foreground">${esc(f.a)}</p></div></div>
          </div>`).join("")}
      </div>
    </section>`);
}

/* ---------- contact ---------- */
// Submissions go to Formspree (set FORMSPREE_URL in data.js). Without it the form is switched off.
const formReady = () => typeof FORMSPREE_URL === "string" && FORMSPREE_URL.startsWith("https://");
async function saveSuggestion(data) {
  const res = await fetch(FORMSPREE_URL, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Form service refused the submission");
}

const fieldLabel = (id, text) => `<label for="${id}" class="block ${LBL} text-[11px] text-foreground">${text}</label>`;
const inputCls = "w-full rounded-2xl border-2 border-input bg-background px-4 py-2.5 font-body text-base placeholder:text-muted-foreground focus-visible:border-ocean focus-visible:outline-none";

function ContactPage() {
  return page(`
    ${pageHeader("Contact Us", `Build the<br>atlas with us<span class="text-pop">.</span>`, "Suggest a new court location or report outdated information. Every submission helps the next player find their court faster.")}
    <section class="px-6 py-16 sm:py-24">
      <div class="mx-auto max-w-2xl" id="contact-slot">${ContactForm()}</div>
    </section>`);
}

function ContactForm() {
  return `
  <form id="contact-form" novalidate class="space-y-6 rounded-3xl border-2 border-border bg-background p-7 hard-shadow sm:p-10">
    <div class="grid gap-6 sm:grid-cols-2">
      <div class="space-y-2">${fieldLabel("name", "Name")}<input id="name" name="submitter_name" placeholder="Your name" class="${inputCls}" /></div>
      <div class="space-y-2">${fieldLabel("email", "Email")}<input id="email" name="submitter_email" type="email" placeholder="you@email.com" class="${inputCls}" /></div>
    </div>
    <div class="space-y-2">
      ${fieldLabel("type", "Submission type")}
      <select id="type" name="suggestion_type" class="${inputCls}">
        <option value="new_court">Suggest a new court</option>
        <option value="report_outdated">Report outdated info</option>
      </select>
    </div>
    <div class="space-y-2">${fieldLabel("message", "Message")}<textarea id="message" name="message" rows="5" placeholder="Tell us about the court or what needs updating…" class="${inputCls}"></textarea></div>
    <p id="form-error" class="hidden font-body text-sm text-destructive"></p>
    ${formReady() ? `<button type="submit" class="${BTN_SUN} w-full disabled:opacity-50">
      <span>Send submission</span>${icon.send("h-4 w-4")}
    </button>` : `<p class="rounded-2xl bg-secondary p-4 text-center font-body text-base text-foreground">This form opens soon. We're still connecting it, so nothing can be sent yet.</p>`}
  </form>`;
}

function ContactThanks() {
  return `
  <div class="rounded-3xl bg-secondary p-10 text-center hard-shadow">
    ${ball("mx-auto h-14 w-14")}
    <h2 class="mt-4 font-display text-4xl text-foreground">Thank you!</h2>
    <p class="mt-3 font-body text-lg text-muted-foreground">Your submission is in. We'll review it for the atlas.</p>
    <button id="submit-another" class="${BTN_LINE} mt-6">Submit another</button>
  </div>`;
}

/* ---------- 404 ---------- */
function NotFoundPage() {
  return page(`
    <section class="px-6 py-32">
      <div class="mx-auto max-w-2xl text-center">
        ${ball("mx-auto mb-6 h-14 w-14")}
        <h1 class="font-display text-5xl text-foreground">Out of bounds.</h1>
        <p class="mt-4 font-body text-lg text-muted-foreground">That page isn't part of the atlas.</p>
        <a href="#/" class="${BTN_LINE} mt-8">${icon.arrowLeft("h-4 w-4")} Back to courts</a>
      </div>
    </section>`);
}

/* ---------- router + interactions ---------- */
const app = document.getElementById("app");
let observer;

function observeReveals() {
  observer?.disconnect();
  const els = document.querySelectorAll(".reveal:not(.in)");
  if (!("IntersectionObserver" in window)) return els.forEach((el) => el.classList.add("in"));
  observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); observer.unobserve(e.target); } }),
    { rootMargin: "0px 0px -60px 0px" }
  );
  els.forEach((el) => observer.observe(el));
}

// Jump to a section of the home page. On a fresh load the page keeps changing height for a
// moment (styles, fonts and pictures arrive), so repeat the jump until it settles, unless
// the visitor starts scrolling themselves.
let jumpToken = 0;
function jumpToSection(id) {
  const token = ++jumpToken;
  const jump = () => { const el = document.getElementById(id); if (el && token === jumpToken) el.scrollIntoView(); };
  const stop = () => { if (token === jumpToken) jumpToken++; };
  ["wheel", "touchstart", "keydown", "mousedown"].forEach((ev) => window.addEventListener(ev, stop, { once: true, passive: true }));
  jump();
  [100, 300, 700, 1200, 2000].forEach((ms) => setTimeout(jump, ms));
}

function render() {
  const path = (location.hash.replace(/^#/, "") || "/").replace(/\/+$/, "") || "/";
  const detail = path.match(/^\/facility-details\/([^/]+)$/);
  const homeSection = { "/open-play": "open-play", "/schedules": "schedules", "/map": "map" }[path];
  let html;
  if (path === "/" || homeSection) {
    // The Open Play section only exists for sports that have open play sessions.
    if (homeSection === "open-play" && !hasOpenPlay(currentSport)) currentSport = "pickleball";
    html = HomePage();
  }
  else if (path === "/about") html = AboutPage();
  else if (path === "/faq") html = FaqPage();
  else if (path === "/contact") html = ContactPage();
  else if (path === "/facility-details") html = FacilitiesPage();
  else if (detail) html = FacilityDetailPage(decodeURIComponent(detail[1]));
  else html = NotFoundPage();
  closeMaps();
  app.innerHTML = html;
  if (homeSection) jumpToSection(homeSection); else window.scrollTo(0, 0);
  observeReveals();
  initMap();
  initVenueMap();
  const v = detail && findVenue(decodeURIComponent(detail[1]));
  const names = { "/about": "About", "/faq": "FAQ", "/contact": "Contact", "/facility-details": "All courts" };
  document.title = v ? `${v.name} — Kinetic Court SD` : names[path] ? `${names[path]} — Kinetic Court SD` : "San Diego : In Play — A Pickleball Court Atlas";
}

// Re-draw the sport sections in place. Keeps the section being read where it is;
// with toTop (a sport change) it goes back to the start of the sections if the reader is past it.
function refreshSections(toTop = false) {
  const box = document.getElementById("sport-sections");
  const reading = [...box.querySelectorAll("section[id]")].find((el) => { const r = el.getBoundingClientRect(); return r.top <= 140 && r.bottom > 140; });
  const before = reading ? reading.getBoundingClientRect().top : null;
  closeMaps();
  box.innerHTML = SportSections();
  const same = !toTop && reading && document.getElementById(reading.id);
  if (same) window.scrollBy(0, same.getBoundingClientRect().top - before);
  else if (box.getBoundingClientRect().top < 56) window.scrollBy(0, box.getBoundingClientRect().top - 56);
  observeReveals();
  initMap();
}

app.addEventListener("click", (e) => {
  const pick = (attr) => e.target.closest(`[${attr}]`);
  let b;
  if ((b = pick("data-sport"))) { currentSport = b.dataset.sport; dirQuery = ""; showAllPlay = showAllDir = false; return refreshSections(true); }
  if ((b = pick("data-access"))) { accessFilter = b.dataset.access; return refreshSections(); }
  if ((b = pick("data-day"))) { currentDay = b.dataset.day; showAllPlay = false; return refreshSections(); }
  if ((b = pick("data-loctab"))) { locTab = b.dataset.loctab; return refreshSections(); }
  if (pick("data-loc-clear")) { loc = null; zipQuery = ""; dirQuery = ""; showAllPlay = showAllDir = false; return refreshSections(); }
  if ((b = pick("data-loc"))) {
    const [type, ...rest] = b.dataset.loc.split(":"), value = rest.join(":");
    loc = loc && loc.type === type && loc.value === value ? null : { type, value };
    dirQuery = ""; showAllPlay = showAllDir = false;
    return refreshSections();
  }
  if (pick("data-near")) return locateMe();
  if (pick("data-more-play")) { showAllPlay = true; return refreshSections(); }
  if (pick("data-more-dir")) { showAllDir = true; document.getElementById("dir-list").innerHTML = DirectoryRows(); return; }
  if (pick("data-share")) return shareVenue();
  if (pick("data-sort")) { sortNear = false; locMsg = ""; return refreshSections(); }
  if ((b = pick("data-menu")) || pick("data-menu-link")) {
    const menu = document.getElementById("phone-menu"), open = b ? menu.classList.toggle("hidden") === false : (menu.classList.add("hidden"), false);
    document.querySelector("[data-menu]").setAttribute("aria-expanded", String(open));
    if (b) return;
  }
  if ((b = pick("data-fsport")) || (b = pick("data-faccess"))) {
    if (b.dataset.fsport) facilitySport = b.dataset.fsport; else accessFilter = b.dataset.faccess;
    const y = window.scrollY;
    closeMaps();
    app.innerHTML = FacilitiesPage();
    window.scrollTo(0, y);
    return observeReveals();
  }
  if ((b = pick("data-faq"))) {
    const item = b.closest(".faq-item"), wasOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach((el) => { el.classList.remove("open"); el.querySelector("[data-faq]").setAttribute("aria-expanded", "false"); });
    if (!wasOpen) { item.classList.add("open"); b.setAttribute("aria-expanded", "true"); }
    return;
  }
  if (e.target.closest("#submit-another")) document.getElementById("contact-slot").innerHTML = ContactForm();
});

app.addEventListener("input", (e) => {
  if (e.target.id === "zip-search") {
    zipQuery = e.target.value.replace(/\D/g, "").slice(0, 5);
    if (e.target.value !== zipQuery) e.target.value = zipQuery;
    const exact = zipQuery.length === 5 && locOptions("zip").some(([z]) => z === zipQuery);
    if (exact) { loc = { type: "zip", value: zipQuery }; dirQuery = ""; showAllPlay = showAllDir = false; refreshSections(); const box = document.getElementById("zip-search"); if (box) { box.focus(); box.setSelectionRange(5, 5); } return; }
    document.getElementById("zip-chips").innerHTML = `<button data-loc-clear aria-pressed="${!loc}" class="rounded-full px-4 py-2 ${LBL} text-xs transition-colors ${loc ? "bg-secondary text-foreground hover:bg-sand" : "bg-foreground text-background"}">Everywhere</button>` + ZipChips();
    return;
  }
  if (e.target.id !== "dir-search") return;
  dirQuery = e.target.value;
  document.getElementById("dir-list").innerHTML = DirectoryRows();
});

app.addEventListener("submit", async (e) => {
  if (e.target.id !== "contact-form") return;
  e.preventDefault();
  if (!formReady()) return;
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));
  const err = form.querySelector("#form-error");
  if (!data.message.trim()) {
    err.textContent = "Please enter a message.";
    err.classList.remove("hidden");
    return;
  }
  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true;
  btn.innerHTML = "<span>Sending…</span>";
  try {
    await saveSuggestion(data);
    document.getElementById("contact-slot").innerHTML = ContactThanks();
  } catch {
    err.textContent = "Something went wrong. Please try again.";
    err.classList.remove("hidden");
    btn.disabled = false;
    btn.innerHTML = `<span>Send submission</span>${icon.send("h-4 w-4")}`;
  }
});

window.addEventListener("hashchange", render);
render();
