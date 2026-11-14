// Kinetic Court SD — static, no-build site. Content lives in data.js.
// Pages: #/ (home), #/open-play, #/schedules, #/about, #/faq, #/contact,
//        #/facility-details, #/facility-details/<id>

/* ---------- helpers ---------- */
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const pad2 = (n) => String(n).padStart(2, "0");
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const sportOf = (id) => SPORTS.find((s) => s.id === id) || { id, label: id, noun: "courts" };

// Give every venue an id, its open play days, and a ranking score.
VENUES.forEach((v) => {
  v.id = `${v.sport}-${slug(v.name)}`;
  v.sessions = v.sessions || [];
  v.playDays = DAYS.filter((d) => v.sessions.some((s) => s.days.includes(d)));
  // "Coolest courts with the most open play first": looks count double, plus one point per open play day.
  v.score = (v.wow || 1) * 2 + v.playDays.length + (v.verified === false ? -3 : 0) + (v.closed ? -10 : 0);
});
const byScore = (a, b) => b.score - a.score || a.name.localeCompare(b.name);
const findVenue = (id) => VENUES.find((v) => v.id === id);

const svg = (paths, cls = "h-4 w-4") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${cls}" aria-hidden="true">${paths}</svg>`;
const icon = {
  arrowUpRight: (c) => svg(`<path d="M7 7h10v10"/><path d="M7 17 17 7"/>`, c),
  arrowRight: (c) => svg(`<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>`, c),
  arrowLeft: (c) => svg(`<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>`, c),
  chevronDown: (c) => svg(`<path d="m6 9 6 6 6-6"/>`, c),
  mapPin: (c) => svg(`<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`, c),
  phone: (c) => svg(`<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>`, c),
  dollar: (c) => svg(`<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`, c),
  clock: (c) => svg(`<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>`, c),
  file: (c) => svg(`<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 13h8"/><path d="M8 17h5"/>`, c),
  send: (c) => svg(`<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>`, c),
  check: (c) => svg(`<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>`, c),
};

// The logo: a palm tree with a pickleball as the sun. The tree uses the current text color.
const logo = (cls = "h-8 w-8") => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="${cls}" role="img" aria-label="Palm tree with a pickleball sun">
    <circle cx="40" cy="24" r="17" fill="#EFC14A"/>
    <g fill="#D9A02B"><circle cx="40" cy="24" r="2"/><circle cx="40" cy="14" r="1.8"/><circle cx="40" cy="34" r="1.8"/><circle cx="30" cy="24" r="1.8"/><circle cx="50" cy="24" r="1.8"/><circle cx="33" cy="17" r="1.8"/><circle cx="47" cy="17" r="1.8"/><circle cx="33" cy="31" r="1.8"/><circle cx="47" cy="31" r="1.8"/></g>
    <g fill="currentColor"><path d="M24.5 60C25.5 48 26 38 29.5 27L33 28C30.5 39 30.5 49 30.5 60Z"/><path d="M31 27C24 17 14 15 6 21 15 19 23 22 31 27Z"/><path d="M31 27C27 15 19 8 9 8 18 11 25 18 31 27Z"/><path d="M31 27C31 15 35 7 43 3 38 10 35 18 31 27Z"/><path d="M31 27C38 17 48 14 57 18 47 18 39 21 31 27Z"/><path d="M31 27C41 23 51 27 56 36 49 29 40 27 31 27Z"/><path d="M31 27C22 26 14 31 11 40 17 33 24 29 31 27Z"/></g>
    <path d="M12 60H52" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;

const ext = `target="_blank" rel="noopener noreferrer"`;
const eyebrow = (text, extra = "mb-3 text-muted-foreground") =>
  `<p class="${extra} font-mono text-xs uppercase tracking-[0.3em]">${text}</p>`;
const mapsUrl = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

/* ---------- illustrated court art (for venues without a photo) ---------- */
const hashStr = (str) => { let h = 2166136261; for (const ch of str) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const PALETTES = [
  { bg: "#C96A4B", court: "#3F6E8C", zone: "#6A9BB8" },
  { bg: "#6F8F72", court: "#C96A4B", zone: "#DE9478" },
  { bg: "#24394A", court: "#4E86A8", zone: "#D46E4E" },
  { bg: "#E4D3B5", court: "#2F6B5E", zone: "#D46E4E" },
  { bg: "#3F6E8C", court: "#D46E4E", zone: "#E8A98F" },
];
const LINE = `stroke="#FCFCFC" stroke-width="3" fill="none"`;

function drawCourt(sport, x, y, p) {
  const r = (rx, ry, w, h, extra) => `<rect x="${rx}" y="${ry}" width="${w}" height="${h}" ${extra}/>`;
  const l = (x1, y1, x2, y2, extra = LINE) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}/>`;
  const net = (w, h) => l(x - 9, y + h / 2, x + w + 9, y + h / 2, `stroke="#1A2933" stroke-width="5" stroke-linecap="round"`);
  if (sport === "tennis") {
    const w = 168, h = 364, a = w * 4.5 / 36, s = h * 21 / 78, m = y + h / 2;
    return r(x, y, w, h, `fill="${p.court}"`) + r(x + a, m - s, w - 2 * a, 2 * s, `fill="${p.zone}"`) + r(x, y, w, h, LINE) +
      l(x + a, y, x + a, y + h) + l(x + w - a, y, x + w - a, y + h) + l(x + a, m - s, x + w - a, m - s) + l(x + a, m + s, x + w - a, m + s) + l(x + w / 2, m - s, x + w / 2, m + s) + net(w, h);
  }
  if (sport === "padel") {
    const w = 172, h = 344, s = h * 6.95 / 20, m = y + h / 2;
    return r(x, y, w, h, `fill="${p.court}"`) + l(x, m - s, x + w, m - s) + l(x, m + s, x + w, m + s) + l(x + w / 2, m - s, x + w / 2, m + s) +
      r(x - 4, y - 4, w + 8, h + 8, `rx="6" fill="none" stroke="#FCFCFC" stroke-opacity=".75" stroke-width="7"`) + net(w, h);
  }
  if (sport === "squash" || sport === "racquetball") {
    const red = `stroke="#B5412F" stroke-width="4" fill="none"`;
    const w = 190, h = sport === "squash" ? 290 : 360, floor = r(x, y, w, h, `fill="#DDB98A"`) +
      Array.from({ length: 9 }, (_, i) => l(x + (w / 10) * (i + 1), y, x + (w / 10) * (i + 1), y + h, `stroke="#C9A371" stroke-width="1.5"`)).join("");
    const wall = l(x - 6, y, x + w + 6, y, `stroke="#1A2933" stroke-width="9"`);
    if (sport === "squash") {
      const sl = y + h * 5.44 / 9.75, b = w * 1.6 / 6.4;
      return floor + r(x, y, w, h, red) + l(x, sl, x + w, sl, red) + l(x + w / 2, sl, x + w / 2, y + h, red) + r(x, sl, b, b, red) + r(x + w - b, sl, b, b, red) + wall;
    }
    const sv = y + h * 15 / 40, sh = y + h / 2, rc = y + h * 25 / 40;
    return floor + r(x, y, w, h, red) + l(x, sv, x + w, sv, red) + l(x, sh, x + w, sh, red) + l(x, rc, x + w, rc, `stroke="#B5412F" stroke-width="3" stroke-dasharray="10 9"`) +
      l(x + 22, sv, x + 22, sh, red) + l(x + w - 22, sv, x + w - 22, sh, red) + wall;
  }
  if (sport === "pingpong") {
    const w = 170, h = 306;
    return r(x + 7, y + 9, w, h, `fill="#1A2933" fill-opacity=".25"`) + r(x, y, w, h, `fill="${p.court}"`) + r(x, y, w, h, LINE) + l(x + w / 2, y, x + w / 2, y + h, `stroke="#FCFCFC" stroke-width="1.5"`) + net(w, h);
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
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" class="${cls}" role="img" aria-label="Illustration of ${esc(sportOf(v.sport).label.toLowerCase())} courts">
    <rect width="400" height="500" fill="${p.bg}"/>
    <g transform="rotate(${angle} 200 250) scale(1.08) translate(-15 -18)">${courts}</g>
    <g transform="translate(${sx} 300) scale(${flip * 4.2} 4.2) rotate(18)" fill="#1A2933" fill-opacity=".2"><path d="M24.5 60C25.5 48 26 38 29.5 27L33 28C30.5 39 30.5 49 30.5 60Z"/><path d="M31 27C24 17 14 15 6 21 15 19 23 22 31 27Z"/><path d="M31 27C27 15 19 8 9 8 18 11 25 18 31 27Z"/><path d="M31 27C31 15 35 7 43 3 38 10 35 18 31 27Z"/><path d="M31 27C38 17 48 14 57 18 47 18 39 21 31 27Z"/><path d="M31 27C41 23 51 27 56 36 49 29 40 27 31 27Z"/><path d="M31 27C22 26 14 31 11 40 17 33 24 29 31 27Z"/></g>
  </svg>`;
}

// A venue's picture: its photo if it has one, otherwise the illustration.
const venueImage = (v, imgCls = "", eager = false) => v.image
  ? `<img src="${v.image}" alt="${esc(v.name)}" ${eager ? "" : `loading="lazy"`} class="absolute inset-0 h-full w-full object-cover ${imgCls}" />`
  : courtArt(v, `absolute inset-0 h-full w-full ${imgCls}`);

/* ---------- small pieces ---------- */
function accessChip(v, onImage = false) {
  const pub = v.access === "public";
  const tone = onImage
    ? (pub ? "bg-background text-foreground" : "bg-primary text-primary-foreground")
    : (pub ? "bg-secondary text-foreground" : "bg-foreground text-background");
  return `<span class="inline-block shrink-0 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${tone}">${pub ? "Public" : "Private club"}</span>`;
}
const unconfirmedChip = (v, onImage = false) => v.verified === false
  ? `<span class="inline-block shrink-0 border border-dashed px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${onImage ? "border-background/70 text-background" : "border-muted-foreground text-muted-foreground"}">Unconfirmed</span>` : "";
const playSummary = (v) => v.closed ? v.closed
  : v.playDays.length === 7 ? "Open play 7 days a week"
  : v.playDays.length ? `Open play ${v.playDays.join(" · ")}`
  : v.openCourts ? "Open courts, first come first served"
  : v.hours ? v.hours : "";

/* ---------- shared layout ---------- */
const NAV_LINKS = [
  { label: "Courts", to: "#/" },
  { label: "Open Play", to: "#/open-play" },
  { label: "Schedules", to: "#/schedules" },
  { label: "FAQ", to: "#/faq" },
  { label: "About", to: "#/about" },
  { label: "Contact", to: "#/contact" },
];

function Nav() {
  return `
  <nav class="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/65">
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
      <a href="#/" class="flex shrink-0 items-center gap-2 text-foreground">
        ${logo("h-9 w-9")}
        <span class="font-display-italic whitespace-nowrap text-lg leading-none sm:text-xl">Kinetic Court<span class="text-primary"> SD</span></span>
      </a>
      <div class="flex items-center gap-0 overflow-x-auto sm:gap-1">
        ${NAV_LINKS.map((l) => `<a href="${l.to}" class="shrink-0 whitespace-nowrap px-2.5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary sm:px-3">${l.label}</a>`).join("")}
      </div>
    </div>
  </nav>`;
}

function Footer() {
  return `
  <footer class="relative bg-foreground px-6 py-24 text-background sm:py-32">
    <div class="absolute inset-0 netline opacity-[0.06]"></div>
    <div class="relative mx-auto max-w-7xl">
      ${eyebrow("The Social Net", "mb-3 text-background/50")}
      <h2 class="font-display-italic text-5xl leading-[0.9] sm:text-7xl">Connect to<br>the ecosystem.</h2>
      <div class="mt-16 grid grid-cols-1 gap-px border-y border-background/15 bg-background/15 sm:grid-cols-2">
        ${ECOSYSTEM_LINKS.map((e) => `
          <a href="${e.href}" ${ext} class="group flex items-center justify-between gap-4 bg-foreground px-6 py-8 transition-colors hover:bg-primary">
            <span class="font-display-italic text-2xl leading-tight sm:text-3xl">${esc(e.label)}</span>
            ${icon.arrowUpRight("h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1")}
          </a>`).join("")}
      </div>
      <div class="mt-16 flex flex-col items-start justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-background/50 sm:flex-row sm:items-center">
        <span class="flex items-center gap-3 text-background/80">${logo("h-8 w-8")} San Diego : In Play</span>
        <span>An independent atlas · Not affiliated with the City of San Diego</span>
        <span>32° 44′ N · 117° 16′ W</span>
      </div>
    </div>
  </footer>`;
}

const page = (main, mainClass = "bg-background pt-14") => `${Nav()}<main class="${mainClass}">${main}${Footer()}</main>`;

const pageHeader = (label, titleHtml, sub, width = "max-w-3xl") => `
  <section class="bg-secondary px-6 py-24 sm:py-32">
    <div class="mx-auto ${width}">
      ${eyebrow(label)}
      <h1 class="font-display-italic text-5xl leading-[0.9] text-foreground sm:text-8xl">${titleHtml}</h1>
      <p class="mt-6 max-w-xl font-body text-base text-muted-foreground">${sub}</p>
    </div>
  </section>`;

/* ---------- home ---------- */
const TODAY = DAYS[(new Date().getDay() + 6) % 7];
let currentSport = "pickleball";
let accessFilter = "all"; // all | public | private
let currentDay = TODAY;
let dirQuery = "";

const sportVenues = () => VENUES.filter((v) => v.sport === currentSport && (accessFilter === "all" || v.access === accessFilter));

function Hero() {
  return `
  <section class="relative h-screen min-h-[640px] w-full overflow-hidden bg-foreground">
    <img src="${HERO_IMAGE}" alt="Aerial view of empty San Diego pickleball courts at golden hour" class="absolute inset-0 h-full w-full object-cover" />
    <div class="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/10 to-foreground/70"></div>
    <div class="absolute inset-0 mesh-overlay opacity-40"></div>
    <div class="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
      <p class="fade-up mb-6 font-mono text-xs uppercase tracking-[0.4em] text-background/80">A High-Performance Atlas · 32° 44′ N</p>
      <h1 class="fade-in font-display-italic leading-[0.85] text-background" style="font-size:clamp(3.5rem,13vw,11rem);--d:.2s">
        San Diego<span class="block text-primary">: In Play.</span>
      </h1>
      <p class="fade-up mt-8 max-w-xl font-body text-base text-background/85 sm:text-lg" style="--d:.6s">
        Public and private courts across San Diego — pickleball, tennis, padel, racquetball, squash and ping pong — with open play times and official schedules in one place.
      </p>
      <div class="fade-up mt-8 flex flex-wrap justify-center gap-3" style="--d:.9s">
        <a href="#/open-play" class="bg-primary px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90">Find open play today</a>
        <a href="#/schedules" class="border border-background/60 px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-background transition-colors hover:bg-background hover:text-foreground">Official schedules</a>
      </div>
    </div>
    <div class="fade-in absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-background/70" style="--d:1.2s">
      <div class="bob flex flex-col items-center gap-2">
        <span class="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        ${icon.chevronDown("h-4 w-4")}
      </div>
    </div>
  </section>`;
}

function FilterBar() {
  const pill = (attr, id, label, on) => `<button ${attr}="${id}" aria-pressed="${on}" class="shrink-0 px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors sm:px-4 ${on ? "bg-primary text-primary-foreground" : "text-foreground hover:text-primary"}">${label}</button>`;
  return `
  <div id="filter-bar" class="sticky top-14 z-30 border-b border-border bg-background/95 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/85">
    <div class="mx-auto flex max-w-7xl flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex items-center gap-1 overflow-x-auto">
        <span class="mr-2 w-14 shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Sport</span>
        ${SPORTS.map((s) => pill("data-sport", s.id, s.label, s.id === currentSport)).join("")}
      </div>
      <div class="flex items-center gap-1 overflow-x-auto">
        <span class="mr-2 w-14 shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Access</span>
        ${pill("data-access", "all", "All", accessFilter === "all")}${pill("data-access", "public", "Public", accessFilter === "public")}${pill("data-access", "private", "Private", accessFilter === "private")}
      </div>
    </div>
  </div>`;
}

function VenueCard(v, i, stagger = true) {
  const summary = playSummary(v);
  return `
  <a href="#/facility-details/${v.id}" class="reveal group relative block aspect-[4/5] w-full overflow-hidden rounded-sm bg-foreground hard-shadow ${stagger ? (i % 2 ? "sm:max-lg:mt-16 " : "") + (i % 3 === 1 ? "lg:mt-16" : "") : ""}" style="--d:${(i % 2) * 0.08}s">
    ${venueImage(v, "transition-transform duration-700 ease-out group-hover:scale-110")}
    <div class="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/75 to-foreground/10"></div>
    <div class="absolute left-5 right-5 top-5 flex items-start justify-between gap-2">
      <span class="font-mono text-xs text-background/80">${pad2(i + 1)}</span>
      <span class="flex flex-wrap justify-end gap-1.5">${unconfirmedChip(v, true)}${accessChip(v, true)}</span>
    </div>
    <div class="absolute bottom-0 left-0 right-0 p-6">
      <p class="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">${esc(v.area)}</p>
      <h3 class="font-display-italic text-3xl leading-[0.95] text-background">${esc(v.name)}</h3>
      <div class="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-background/75">
        ${[v.courts, v.setting, v.cost].filter(Boolean).map((t, k) => `<span>${k ? "· " : ""}${esc(t)}</span>`).join("")}
      </div>
      ${summary ? `<p class="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-background">${icon.clock("h-3.5 w-3.5 shrink-0 text-primary")} ${esc(summary)}</p>` : ""}
      <span class="mt-4 inline-flex w-full items-center justify-between bg-primary px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground">Schedule &amp; details ${icon.arrowRight("h-4 w-4 transition-transform group-hover:translate-x-1")}</span>
    </div>
  </a>`;
}

const emptyState = (text) => `<p class="border border-dashed border-border px-6 py-10 text-center font-body text-base text-muted-foreground">${text}</p>`;
const accessWord = () => (accessFilter === "all" ? "" : accessFilter + " ");

function Featured(n) {
  const list = sportVenues().filter((v) => v.featured).sort(byScore);
  const sport = sportOf(currentSport);
  return `
  <section id="courts" class="relative bg-secondary px-6 py-20 sm:py-28">
    <div class="absolute inset-0 mesh-overlay opacity-50"></div>
    <div class="relative mx-auto max-w-7xl">
      <div class="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          ${eyebrow(`${pad2(n)} · The Court Ledger`)}
          <h2 class="font-display-italic text-5xl leading-[0.9] text-foreground sm:text-7xl">Featured<br>Courts.</h2>
        </div>
        <p class="max-w-sm font-body text-base text-muted-foreground ${list.length ? "" : "hidden"}">The ${list.length} standout ${accessWord()}${sport.label.toLowerCase()} venues, ranked by how good the courts are${VENUES.some((v) => v.sport === currentSport && v.sessions.length) ? " and how many days a week they run open play" : ""}.</p>
      </div>
      ${list.length ? `<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">${list.map((v, i) => VenueCard(v, i)).join("")}</div>`
        : emptyState(`No featured ${accessWord()}${sport.noun} yet. ${accessFilter === "public" ? "We haven't confirmed any free public ones. Try Private, or tell us about one on the Contact page." : "Try switching the Access filter."}`)}
    </div>
  </section>`;
}

function OpenPlay(n) {
  const all = sportVenues().filter((v) => v.sessions.length);
  if (!VENUES.some((v) => v.sport === currentSport && v.sessions.length)) return "";
  const today = all.filter((v) => v.playDays.includes(currentDay)).sort(byScore);
  const sport = sportOf(currentSport);
  return `
  <section id="open-play" class="relative scroll-mt-28 bg-foreground px-6 py-24 text-background sm:py-32">
    <div class="absolute inset-0 netline opacity-[0.05]"></div>
    <div class="relative mx-auto max-w-7xl">
      <div class="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          ${eyebrow(`${pad2(n)} · Open Play`, "mb-3 text-background/50")}
          <h2 class="font-display-italic text-5xl leading-[0.9] sm:text-7xl">Open play,<br>day by day.</h2>
        </div>
        <p class="max-w-sm font-body text-base text-background/70">Pick a day to see every ${accessWord()}${sport.label.toLowerCase()} spot with open play and the hours. Schedules change, so call ahead before a special trip.</p>
      </div>
      <div class="mb-10 flex gap-1 overflow-x-auto border-y border-background/15 py-3" role="tablist" aria-label="Day of the week">
        ${DAYS.map((d) => {
          const on = d === currentDay, count = all.filter((v) => v.playDays.includes(d)).length;
          return `<button data-day="${d}" role="tab" aria-selected="${on}" class="shrink-0 px-4 py-2 text-left font-mono text-xs uppercase tracking-[0.2em] transition-colors ${on ? "bg-primary text-primary-foreground" : "text-background/80 hover:text-primary"}">${d}${d === TODAY ? " · today" : ""}<span class="ml-2 ${on ? "text-primary-foreground/80" : "text-background/40"}">${count}</span></button>`;
        }).join("")}
      </div>
      <p class="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-background/50">${today.length} ${today.length === 1 ? "place" : "places"} with open play on ${DAY_NAMES[currentDay]}</p>
      ${today.length ? `<ul class="divide-y divide-background/15 border-y border-background/15">
        ${today.map((v) => `
          <li>
            <a href="#/facility-details/${v.id}" class="group grid gap-3 py-5 transition-colors hover:bg-background/5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-8 sm:px-3">
              <div>
                <h3 class="font-display-italic text-2xl leading-tight transition-colors group-hover:text-primary">${esc(v.name)}</h3>
                <p class="mt-2 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-background/60">
                  ${accessChip(v, true)}<span>${esc(v.area)}</span>${v.cost ? `<span>· ${esc(v.cost)}</span>` : ""}
                </p>
              </div>
              <ul class="space-y-1.5 self-center">
                ${v.sessions.filter((s) => s.days.includes(currentDay)).map((s) => `
                  <li class="flex flex-wrap items-baseline gap-x-3 font-mono text-sm">
                    <span class="text-background">${esc(s.time)}</span>
                    <span class="text-[11px] uppercase tracking-wider text-background/50">${esc([s.where, s.note].filter(Boolean).join(" · "))}</span>
                  </li>`).join("")}
              </ul>
            </a>
          </li>`).join("")}
      </ul>` : `<p class="border border-dashed border-background/25 px-6 py-10 text-center font-body text-base text-background/70">No ${accessWord()}open play listed for ${DAY_NAMES[currentDay]}. Try another day or switch the Access filter.</p>`}
      <p class="mt-8 font-body text-sm text-background/50">Public hours: City of San Diego pickleball list, updated 8/29/2026. Club hours: each club's website, checked ${DATA_CHECKED}. <a href="#/schedules" class="underline underline-offset-4 hover:text-primary">See the official schedules</a>.</p>
    </div>
  </section>`;
}

function DirectoryRows() {
  const q = dirQuery.trim().toLowerCase();
  const list = sportVenues().filter((v) => !q || `${v.name} ${v.area}`.toLowerCase().includes(q)).sort(byScore);
  if (!list.length) return emptyState(q ? `Nothing matches “${esc(dirQuery)}”.` : `No ${accessWord()}${sportOf(currentSport).noun} listed yet. Try switching the Access filter.`);
  return `<ul class="divide-y divide-border border-y border-border">
    ${list.map((v, i) => `
      <li class="flex items-center gap-4 py-4 sm:gap-6">
        <a href="#/facility-details/${v.id}" tabindex="-1" aria-hidden="true" class="relative hidden h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-foreground sm:block">${venueImage(v)}</a>
        <div class="min-w-0 flex-1">
          <h3 class="font-display-italic text-xl leading-tight text-foreground sm:text-2xl"><a href="#/facility-details/${v.id}" class="transition-colors hover:text-primary">${esc(v.name)}</a></h3>
          <p class="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            ${accessChip(v)}${unconfirmedChip(v)}<span>${esc([v.area, v.courts, v.setting].filter(Boolean).join(" · "))}</span>
          </p>
          ${playSummary(v) ? `<p class="mt-1.5 font-mono text-[11px] uppercase tracking-wider text-primary">${esc(playSummary(v))}</p>` : ""}
        </div>
        <div class="flex shrink-0 flex-col items-end gap-2 font-mono text-[11px] uppercase tracking-[0.2em]">
          <a href="#/facility-details/${v.id}" class="flex items-center gap-1.5 text-foreground transition-colors hover:text-primary">Details ${icon.arrowRight("h-4 w-4")}</a>
          ${v.pdf ? `<a href="${v.pdf.url}" ${ext} class="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary">${icon.file("h-3.5 w-3.5")} PDF</a>` : ""}
        </div>
      </li>`).join("")}
  </ul>`;
}

function Directory(n) {
  const sport = sportOf(currentSport), count = sportVenues().length;
  return `
  <section id="directory" class="relative bg-background px-6 py-24 sm:py-32">
    <div class="mx-auto max-w-7xl">
      <div class="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div class="max-w-2xl">
          ${eyebrow(`${pad2(n)} · The Full Directory`)}
          <h2 class="font-display-italic text-5xl leading-[0.9] text-foreground sm:text-7xl">Every<br>Court.</h2>
          <p class="mt-6 font-body text-base text-muted-foreground">${count ? `All ${count} ${accessWord()}${sport.noun} in the atlas, best first.` : ""} Open any one for its schedule, address, phone number and official links.</p>
        </div>
        <label class="block w-full sm:w-72">
          <span class="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Search by name or neighborhood</span>
          <input id="dir-search" type="search" value="${esc(dirQuery)}" placeholder="e.g. North Park" class="h-10 w-full rounded-sm border border-input bg-transparent px-3 font-body text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
        </label>
      </div>
      <div id="dir-list">${DirectoryRows()}</div>
    </div>
  </section>`;
}

function Schedules(n) {
  return `
  <section id="schedules" class="relative scroll-mt-28 bg-secondary px-6 py-24 sm:py-32">
    <div class="absolute inset-0 mesh-overlay opacity-50"></div>
    <div class="relative mx-auto max-w-7xl">
      <div class="mb-16 max-w-2xl">
        ${eyebrow(`${pad2(n)} · Schedules &amp; PDFs`)}
        <h2 class="font-display-italic text-5xl leading-[0.9] text-foreground sm:text-7xl">Straight from<br>the source.</h2>
        <p class="mt-6 font-body text-base text-muted-foreground">The official schedule PDFs for public courts, and the open play pages of local clubs and organizations. These open on the City's or the club's own website.</p>
      </div>
      <div class="grid gap-12 lg:grid-cols-2">
        ${DOCUMENTS.map((g) => `
          <div>
            <h3 class="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">${esc(g.group)}</h3>
            <ul class="divide-y divide-border border-y border-border">
              ${g.items.map((d) => `
                <li>
                  <a href="${d.url}" ${ext} class="group flex items-start gap-4 py-4 transition-colors hover:bg-background/60 sm:px-2">
                    <span class="mt-0.5 flex w-14 shrink-0 items-center justify-center gap-1 py-1 font-mono text-[10px] uppercase tracking-[0.15em] ${d.kind === "PDF" ? "bg-primary text-primary-foreground" : "bg-foreground text-background"}">${d.kind}</span>
                    <span class="min-w-0 flex-1">
                      <span class="block font-display-italic text-xl leading-tight text-foreground transition-colors group-hover:text-primary">${esc(d.title)}</span>
                      <span class="mt-1 block font-body text-sm text-muted-foreground">${esc(d.note)}</span>
                    </span>
                    ${icon.arrowUpRight("mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary")}
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
  return FilterBar() + featured + open + Directory(n++) + Schedules(n);
}

function HomePage() {
  return `${Nav()}<main class="min-h-screen bg-background">${Hero()}<div id="sport-sections">${SportSections()}</div>${Footer()}</main>`;
}

/* ---------- about ---------- */
function AboutPage() {
  return page(`
    <section class="relative overflow-hidden bg-foreground px-6 py-24 text-background sm:py-32">
      <img src="${HERO_IMAGE}" alt="San Diego courts at golden hour" class="absolute inset-0 h-full w-full object-cover opacity-30" />
      <div class="absolute inset-0 mesh-overlay opacity-30"></div>
      <div class="relative mx-auto max-w-5xl">
        ${eyebrow("The Story", "mb-4 text-background/60")}
        <h1 class="fade-up font-display-italic text-5xl leading-[0.88] sm:text-8xl" style="--fy:16px">Kinetic Court<span class="text-primary"> SD.</span></h1>
      </div>
    </section>
    <section class="px-6 py-24 sm:py-32">
      <div class="mx-auto grid max-w-5xl gap-12 sm:grid-cols-3">
        <div class="sm:col-span-1">${eyebrow("Our Mission", "text-muted-foreground")}</div>
        <div class="sm:col-span-2">
          <p class="font-body text-xl leading-relaxed text-foreground sm:text-2xl">We exist to give San Diego's fast-growing pickleball community one place to find a game: open play times, public and private courts, and the official schedules, alongside tennis, padel, racquetball, squash and ping pong.</p>
          <p class="mt-6 font-body text-base leading-relaxed text-muted-foreground">Kinetic Court SD was born from a simple frustration: court info was scattered across city PDFs, club sites, and forum threads. We built a single, design-forward atlas that maps the county's facilities, shows when open play runs, and links straight to the official source — so the only thing between you and the court is the drive there.</p>
        </div>
      </div>
    </section>
    <section class="bg-secondary px-6 py-24 sm:py-32">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-16 font-display-italic text-4xl leading-[0.9] text-foreground sm:text-6xl">What we stand for.</h2>
        <div class="grid gap-px border border-border bg-border sm:grid-cols-3">
          ${VALUES.map((v) => `
            <div class="bg-secondary p-8">
              <p class="mb-4 font-mono text-xs text-primary">${v.n}</p>
              <h3 class="mb-3 font-display-italic text-2xl text-foreground">${v.t}</h3>
              <p class="font-body text-sm text-muted-foreground">${v.d}</p>
            </div>`).join("")}
        </div>
      </div>
    </section>`);
}

/* ---------- facilities ---------- */
let facilitySport = "all";

function FacilitiesPage() {
  const list = VENUES.filter((v) => (facilitySport === "all" ? v.featured : v.sport === facilitySport) && (accessFilter === "all" || v.access === accessFilter)).sort(byScore);
  const chip = (attr, id, label, on) => `<button ${attr}="${id}" aria-pressed="${on}" class="px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${on ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:text-primary"}">${label}</button>`;
  return page(`
    <section class="bg-secondary px-6 py-24 sm:py-32">
      <div class="mx-auto max-w-7xl">
        ${eyebrow("The Facilities")}
        <h1 class="font-display-italic text-5xl leading-[0.9] text-foreground sm:text-8xl">Every Court,<br>One Atlas.</h1>
        <p class="mt-6 max-w-xl font-body text-base text-muted-foreground">Browse facilities across San Diego. “All” shows the featured venues for every sport; pick a sport to see every court. Open any card for its schedule, pricing and official links.</p>
        <div class="mt-12 flex flex-wrap gap-2">${chip("data-fsport", "all", "All featured", facilitySport === "all")}${SPORTS.map((s) => chip("data-fsport", s.id, s.label, facilitySport === s.id)).join("")}</div>
        <div class="mt-3 flex flex-wrap gap-2">${chip("data-faccess", "all", "Public + private", accessFilter === "all")}${chip("data-faccess", "public", "Public only", accessFilter === "public")}${chip("data-faccess", "private", "Private only", accessFilter === "private")}</div>
        <div class="mt-12">${list.length ? `<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">${list.map((v, i) => VenueCard(v, i, false)).join("")}</div>` : emptyState("Nothing matches those filters yet.")}</div>
      </div>
    </section>`);
}

function FacilityDetailPage(id) {
  const v = findVenue(id);
  if (!v) {
    return page(`
      <section class="px-6 py-32">
        <div class="mx-auto max-w-2xl text-center">
          <h1 class="font-display-italic text-5xl text-foreground">Court not found.</h1>
          <p class="mt-4 font-body text-muted-foreground">This facility isn't in our atlas yet.</p>
          <a href="#/facility-details" class="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">${icon.arrowLeft("h-4 w-4")} Back to facilities</a>
        </div>
      </section>`);
  }
  const sport = sportOf(v.sport);
  const specs = [["Sport", sport.label], ["Courts", v.courts], ["Setting", [v.setting, v.lights].filter(Boolean).join(" · ")], ["Access", v.access === "public" ? "Public" : "Private club"]].filter(([, val]) => val);
  const label = (t) => eyebrow(t, "mb-6 text-muted-foreground");
  const schedule = v.closed
    ? `<p class="border border-border p-6 font-display-italic text-2xl text-foreground">${esc(v.closed)}</p>`
    : v.sessions.length ? `
      <table class="w-full border-y border-border text-left">
        <tbody class="divide-y divide-border">
          ${DAYS.map((d) => {
            const ss = v.sessions.filter((s) => s.days.includes(d));
            return `<tr class="${d === TODAY ? "bg-secondary/70" : ""}">
              <th scope="row" class="w-28 py-3 pl-3 align-top font-mono text-[11px] font-normal uppercase tracking-[0.2em] ${ss.length ? "text-foreground" : "text-muted-foreground/60"}">${DAY_NAMES[d].slice(0, 3)}${d === TODAY ? `<span class="block text-primary">Today</span>` : ""}</th>
              <td class="py-3 pr-3">${ss.length ? ss.map((s) => `<p class="font-mono text-sm text-foreground">${esc(s.time)} <span class="text-[11px] uppercase tracking-wider text-muted-foreground">${esc([s.where, s.note].filter(Boolean).join(" · "))}</span></p>`).join("") : `<p class="font-mono text-sm text-muted-foreground/60">—</p>`}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>`
    : v.hours ? `<p class="border border-border p-6 font-body text-base text-foreground"><span class="mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Court hours</span>${esc(v.hours)}</p>`
    : v.openCourts ? "" : `<p class="border border-dashed border-border p-6 font-body text-base text-muted-foreground">No set open play times are published for this venue. Check its official site for the latest.</p>`;

  return page(`
    <section class="relative h-[60vh] min-h-[420px] w-full overflow-hidden bg-foreground">
      ${venueImage(v, "", true)}
      <div class="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/30 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 px-6 pb-10">
        <div class="mx-auto max-w-5xl">
          <p class="mb-3 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">${icon.mapPin("h-3.5 w-3.5")} ${esc(v.area)} <span class="ml-2 flex gap-1.5">${accessChip(v, true)}${unconfirmedChip(v, true)}</span></p>
          <h1 class="font-display-italic text-4xl leading-[0.9] text-background sm:text-7xl">${esc(v.name)}</h1>
        </div>
      </div>
    </section>
    <section class="px-6 py-20 sm:py-28">
      <div class="mx-auto max-w-5xl">
        <a href="#/facility-details" class="mb-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary">${icon.arrowLeft("h-4 w-4")} All facilities</a>
        ${v.verified === false ? `<p class="mb-10 border border-dashed border-primary p-4 font-body text-sm text-foreground"><strong>Unconfirmed listing.</strong> This venue was carried over from an earlier version of the atlas and its details haven't been checked against an official source yet. Confirm with the venue before you go.</p>` : ""}
        ${v.blurb ? `<p class="mb-12 max-w-3xl font-body text-xl leading-relaxed text-foreground">${esc(v.blurb)}</p>` : ""}
        <div class="grid gap-12 lg:grid-cols-2">
          <div>
            ${label(v.sport === "pickleball" ? "Open Play Schedule" : v.sessions.length ? "Open Play Schedule" : "Hours")}
            ${schedule}
            ${v.openCourts ? `<p class="${v.sessions.length ? "mt-4 " : ""}border border-border p-5 font-body text-sm text-foreground"><span class="mb-1 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Open courts</span>${esc(v.openCourts)}</p>` : ""}
            ${v.sessions.length || v.hours || v.openCourts ? `<p class="mt-4 font-body text-sm text-muted-foreground">Hours are subject to change${v.phone ? `. Call ${esc(v.phone)} to confirm before a special trip` : ""}.</p>` : ""}
            <div class="mt-10">
              ${label("Court Details")}
              <div class="grid grid-cols-2 gap-px border border-border bg-border">
                ${specs.map(([l, val]) => `
                  <div class="bg-background p-5">
                    <p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">${l}</p>
                    <p class="mt-1 font-display-italic text-lg leading-tight text-foreground">${esc(val)}</p>
                  </div>`).join("")}
              </div>
              ${v.accessNote ? `<p class="mt-4 font-body text-sm text-muted-foreground">${esc(v.accessNote)}.</p>` : ""}
            </div>
          </div>
          <div>
            ${label("Pricing &amp; Links")}
            <div class="border border-border p-6 hard-shadow-clay">
              <div class="flex items-center gap-3">${icon.dollar("h-5 w-5 shrink-0 text-primary")}<p class="font-display-italic text-3xl leading-tight text-foreground">${esc(v.cost || "See website")}</p></div>
              <div class="mt-6 space-y-3">
                <a href="${v.website}" ${ext} class="flex w-full items-center justify-between bg-primary px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90">${v.access === "public" ? "Official info" : "Visit official site"} ${icon.arrowUpRight("h-4 w-4")}</a>
                ${v.scheduleUrl && v.scheduleUrl !== v.website ? `<a href="${v.scheduleUrl}" ${ext} class="flex w-full items-center justify-between border border-foreground px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground hover:text-background">${esc(v.scheduleLabel || "Schedule")} ${icon.arrowUpRight("h-4 w-4")}</a>` : ""}
                ${v.pdf ? `<a href="${v.pdf.url}" ${ext} class="flex w-full items-center justify-between border border-foreground px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground hover:text-background"><span class="flex items-center gap-2">${icon.file("h-4 w-4")} ${esc(v.pdf.label)}</span> ${icon.arrowUpRight("h-4 w-4")}</a>` : ""}
              </div>
              <ul class="mt-6 space-y-3 font-body text-sm text-foreground">
                ${v.address ? `<li class="flex gap-3">${icon.mapPin("mt-0.5 h-4 w-4 shrink-0 text-primary")}<a href="${mapsUrl(v.address)}" ${ext} class="underline underline-offset-4 hover:text-primary">${esc(v.address)}</a></li>` : ""}
                ${v.phone ? `<li class="flex gap-3">${icon.phone("mt-0.5 h-4 w-4 shrink-0 text-primary")}<span>${esc(v.phone)}</span></li>` : ""}
              </ul>
            </div>
            ${v.source ? `<p class="mt-8 font-body text-sm text-muted-foreground">Source: <a href="${v.source.url}" ${ext} class="underline underline-offset-4 hover:text-primary">${esc(v.source.label)}</a>. Last checked ${DATA_CHECKED}.</p>` : ""}
            ${v.image ? "" : `<p class="mt-3 font-body text-sm text-muted-foreground">The picture above is an illustration, not a photo of this venue.</p>`}
          </div>
        </div>
      </div>
    </section>`);
}

/* ---------- faq ---------- */
function FaqPage() {
  return page(`
    ${pageHeader("Community FAQ", "Questions,<br>answered.", "Everything a new player needs to know about open play, public and private courts, and finding a game in San Diego.")}
    <section class="px-6 py-20 sm:py-28">
      <div class="mx-auto max-w-3xl border-y border-border">
        ${FAQ.map((f, i) => `
          <div class="faq-item border-b border-border">
            <h3 class="flex">
              <button data-faq="${i}" aria-expanded="false" class="flex flex-1 items-center justify-between gap-4 py-6 text-left font-display-italic text-xl text-foreground sm:text-2xl">
                ${esc(f.q)}
                ${icon.chevronDown("faq-chevron h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200")}
              </button>
            </h3>
            <div class="faq-body"><div class="overflow-hidden"><p class="pb-6 font-body text-base leading-relaxed text-muted-foreground">${esc(f.a)}</p></div></div>
          </div>`).join("")}
      </div>
    </section>`);
}

/* ---------- contact ---------- */
// This site has no backend, so submissions are kept in this browser's localStorage.
// Replace saveSuggestion() with a real endpoint (Formspree, Supabase, your own API…) to collect them.
async function saveSuggestion(data) {
  const key = "kinetic-court-suggestions";
  let all = [];
  try { all = JSON.parse(localStorage.getItem(key) || "[]"); } catch {}
  all.push({ ...data, created_at: new Date().toISOString() });
  try { localStorage.setItem(key, JSON.stringify(all)); } catch {}
}

const fieldLabel = (id, text) => `<label for="${id}" class="text-sm font-medium leading-none font-mono text-[11px] uppercase tracking-[0.2em]">${text}</label>`;
const inputCls = "flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm";

function ContactPage() {
  return page(`
    ${pageHeader("Contact Us", "Build the<br>atlas with us.", "Suggest a new court location or report outdated information. Every submission helps the next player find their court faster.")}
    <section class="px-6 py-20 sm:py-28">
      <div class="mx-auto max-w-2xl" id="contact-slot">${ContactForm()}</div>
    </section>`);
}

function ContactForm() {
  return `
  <form id="contact-form" novalidate class="space-y-6 border border-border bg-background p-8 hard-shadow sm:p-10">
    <div class="grid gap-6 sm:grid-cols-2">
      <div class="space-y-2">${fieldLabel("name", "Name")}<input id="name" name="submitter_name" placeholder="Your name" class="${inputCls} h-9" /></div>
      <div class="space-y-2">${fieldLabel("email", "Email")}<input id="email" name="submitter_email" type="email" placeholder="you@email.com" class="${inputCls} h-9" /></div>
    </div>
    <div class="space-y-2">
      ${fieldLabel("type", "Submission type")}
      <select id="type" name="suggestion_type" class="${inputCls} h-9">
        <option value="new_court">Suggest a new court</option>
        <option value="report_outdated">Report outdated info</option>
      </select>
    </div>
    <div class="space-y-2">${fieldLabel("message", "Message")}<textarea id="message" name="message" rows="5" placeholder="Tell us about the court or what needs updating…" class="${inputCls} min-h-[60px] py-2"></textarea></div>
    <p id="form-error" class="hidden font-body text-sm text-destructive"></p>
    <button type="submit" class="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground shadow transition-opacity hover:opacity-90 disabled:opacity-50">
      <span>Send submission</span>${icon.send("h-4 w-4")}
    </button>
  </form>`;
}

function ContactThanks() {
  return `
  <div class="border border-border bg-secondary p-10 text-center hard-shadow">
    ${icon.check("mx-auto h-10 w-10 text-primary")}
    <h2 class="mt-4 font-display-italic text-3xl text-foreground">Thank you.</h2>
    <p class="mt-3 font-body text-muted-foreground">Your submission is in. We'll review it for the atlas.</p>
    <button id="submit-another" class="mt-6 inline-flex h-9 items-center justify-center rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium shadow-sm hover:bg-secondary">Submit another</button>
  </div>`;
}

/* ---------- 404 ---------- */
function NotFoundPage() {
  return page(`
    <section class="px-6 py-32">
      <div class="mx-auto max-w-2xl text-center">
        <h1 class="font-display-italic text-5xl text-foreground">Page not found.</h1>
        <p class="mt-4 font-body text-muted-foreground">That page isn't part of the atlas.</p>
        <a href="#/" class="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">${icon.arrowLeft("h-4 w-4")} Back to courts</a>
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

function render() {
  const path = (location.hash.replace(/^#/, "") || "/").replace(/\/+$/, "") || "/";
  const detail = path.match(/^\/facility-details\/([^/]+)$/);
  const homeSection = { "/open-play": "open-play", "/schedules": "schedules" }[path];
  let html;
  if (path === "/" || homeSection) {
    // The Open Play section only exists for sports that have open play sessions.
    if (homeSection === "open-play" && !VENUES.some((v) => v.sport === currentSport && v.sessions.length)) currentSport = "pickleball";
    html = HomePage();
  }
  else if (path === "/about") html = AboutPage();
  else if (path === "/faq") html = FaqPage();
  else if (path === "/contact") html = ContactPage();
  else if (path === "/facility-details") html = FacilitiesPage();
  else if (detail) html = FacilityDetailPage(decodeURIComponent(detail[1]));
  else html = NotFoundPage();
  app.innerHTML = html;
  const target = homeSection && document.getElementById(homeSection);
  if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
  observeReveals();
}

// Re-draw the sport sections in place. Keeps the section being read where it is;
// with toTop (a sport change) it goes back to the start of the sections if the reader is past it.
function refreshSections(toTop = false) {
  const box = document.getElementById("sport-sections");
  const reading = [...box.querySelectorAll("section[id]")].find((el) => { const r = el.getBoundingClientRect(); return r.top <= 140 && r.bottom > 140; });
  const before = reading ? reading.getBoundingClientRect().top : null;
  box.innerHTML = SportSections();
  const same = !toTop && reading && document.getElementById(reading.id);
  if (same) window.scrollBy(0, same.getBoundingClientRect().top - before);
  else if (box.getBoundingClientRect().top < 56) window.scrollBy(0, box.getBoundingClientRect().top - 56);
  observeReveals();
}

app.addEventListener("click", (e) => {
  const pick = (attr) => e.target.closest(`[${attr}]`);
  let b;
  if ((b = pick("data-sport"))) { currentSport = b.dataset.sport; dirQuery = ""; return refreshSections(true); }
  if ((b = pick("data-access"))) { accessFilter = b.dataset.access; return refreshSections(); }
  if ((b = pick("data-day"))) { currentDay = b.dataset.day; return refreshSections(); }
  if ((b = pick("data-fsport")) || (b = pick("data-faccess"))) {
    if (b.dataset.fsport) facilitySport = b.dataset.fsport; else accessFilter = b.dataset.faccess;
    const y = window.scrollY;
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
  if (e.target.id !== "dir-search") return;
  dirQuery = e.target.value;
  document.getElementById("dir-list").innerHTML = DirectoryRows();
});

app.addEventListener("submit", async (e) => {
  if (e.target.id !== "contact-form") return;
  e.preventDefault();
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
