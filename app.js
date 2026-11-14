// Kinetic Court SD — a static, no-build copy of the Base44 app.
// Pages: #/ (home), #/about, #/faq, #/contact, #/facility-details, #/facility-details/<slug>

/* ---------- helpers ---------- */
const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const pad2 = (n) => String(n).padStart(2, "0");
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const findCourt = (id) => FEATURED_COURTS.find((c) => slug(c.name) === id);
const sportLabel = (id) => (SPORTS.find((s) => s.id === id) || { label: id }).label;

const svg = (paths, cls = "h-4 w-4") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${cls}" aria-hidden="true">${paths}</svg>`;
const icon = {
  arrowUpRight: (c) => svg(`<path d="M7 7h10v10"/><path d="M7 17 17 7"/>`, c),
  arrowLeft: (c) => svg(`<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>`, c),
  chevronDown: (c) => svg(`<path d="m6 9 6 6 6-6"/>`, c),
  wind: (c) => svg(`<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>`, c),
  sun: (c) => svg(`<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>`, c),
  moon: (c) => svg(`<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>`, c),
  mapPin: (c) => svg(`<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`, c),
  dollar: (c) => svg(`<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`, c),
  send: (c) => svg(`<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>`, c),
  check: (c) => svg(`<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>`, c),
};

const ext = `target="_blank" rel="noopener noreferrer"`;
const eyebrow = (text, extra = "mb-3 text-muted-foreground") =>
  `<p class="${extra} font-mono text-xs uppercase tracking-[0.3em]">${text}</p>`;

/* ---------- shared layout ---------- */
const NAV_LINKS = [
  { label: "Courts", to: "#/" },
  { label: "FAQ", to: "#/faq" },
  { label: "About", to: "#/about" },
  { label: "Contact", to: "#/contact" },
];

function Nav() {
  return `
  <nav class="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/65">
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-6">
      <a href="#/" class="font-display-italic text-xl leading-none text-foreground">Kinetic Court<span class="text-primary"> SD</span></a>
      <div class="flex items-center gap-1 overflow-x-auto sm:gap-2">
        ${NAV_LINKS.map((l) => `<a href="${l.to}" class="shrink-0 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary">${l.label}</a>`).join("")}
      </div>
    </div>
  </nav>`;
}

function Footer() {
  return `
  <footer class="relative bg-foreground px-6 py-24 text-background sm:py-32">
    <div class="absolute inset-0 netline opacity-[0.06]"></div>
    <div class="relative mx-auto max-w-7xl">
      ${eyebrow("04 · The Social Net", "mb-3 text-background/50")}
      <h2 class="font-display-italic text-5xl leading-[0.9] sm:text-7xl">Connect to<br>the ecosystem.</h2>
      <div class="mt-16 grid grid-cols-1 gap-px border-y border-background/15 bg-background/15 sm:grid-cols-2">
        ${ECOSYSTEM_LINKS.map((e) => `
          <a href="${e.href}" ${ext} class="group flex items-center justify-between gap-4 bg-foreground px-6 py-8 transition-colors hover:bg-primary">
            <span class="font-display-italic text-2xl leading-tight sm:text-3xl">${esc(e.label)}</span>
            ${icon.arrowUpRight("h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1")}
          </a>`).join("")}
      </div>
      <div class="mt-16 flex flex-col items-start justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-background/50 sm:flex-row sm:items-center">
        <span>San Diego : In Play</span>
        <span>An independent atlas · Not affiliated with the City of San Diego</span>
        <span>32° 44′ N · 117° 16′ W</span>
      </div>
    </div>
  </footer>`;
}

const page = (main, mainClass = "bg-background pt-16") => `${Nav()}<main class="${mainClass}">${main}${Footer()}</main>`;

const pageHeader = (label, titleHtml, sub, width = "max-w-3xl") => `
  <section class="bg-secondary px-6 py-24 sm:py-32">
    <div class="mx-auto ${width}">
      ${eyebrow(label)}
      <h1 class="font-display-italic text-5xl leading-[0.9] text-foreground sm:text-8xl">${titleHtml}</h1>
      <p class="mt-6 max-w-xl font-body text-base text-muted-foreground">${sub}</p>
    </div>
  </section>`;

/* ---------- home ---------- */
let currentSport = "pickleball";

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
        The public courts of America's finest racquet-sport city — pickleball, tennis, padel, squash, and ping pong — mapped, detailed, and linked straight to the source.
      </p>
    </div>
    <div class="fade-in absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-background/70" style="--d:1.2s">
      <div class="bob flex flex-col items-center gap-2">
        <span class="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        ${icon.chevronDown("h-4 w-4")}
      </div>
    </div>
  </section>`;
}

function SportBar() {
  return `
  <div class="sticky top-14 z-30 -mx-6 mb-16 border-y border-border bg-background/85 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
    <div class="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto">
      <span class="mr-2 shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Sport</span>
      ${SPORTS.map((s) => {
        const on = s.id === currentSport;
        return `<button data-sport="${s.id}" class="relative shrink-0 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors ${on ? "bg-primary text-primary-foreground" : "text-foreground hover:text-primary"}">${s.label}</button>`;
      }).join("")}
    </div>
  </div>`;
}

function FeaturedCard(court, i) {
  return `
  <a href="${court.website}" ${ext} class="reveal group relative block aspect-[4/5] w-full overflow-hidden rounded-sm bg-foreground hard-shadow ${i % 2 === 0 ? "sm:mt-0" : "sm:mt-16"}" style="--d:${(i % 2) * 0.08}s">
    <img src="${court.image}" alt="${esc(court.name)} courts" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
    <div class="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent transition-opacity duration-500 group-hover:from-foreground/70"></div>
    <span class="absolute left-5 top-5 font-mono text-xs text-background/70">${pad2(i + 1)}</span>
    <div class="absolute bottom-0 left-0 right-0 p-6">
      <p class="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">${esc(court.neighborhood)}</p>
      <h3 class="font-display-italic text-3xl leading-[0.95] text-background sm:text-4xl">${esc(court.name)}</h3>
      <div class="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-background/70">
        <span>${esc(court.courts)}</span><span>· ${esc(court.surface)}</span><span>· ${esc(court.nets)}</span><span>· ${esc(court.lights)}</span>
      </div>
      <div class="mt-4 max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100">
        <div class="flex items-center gap-4 border-t border-background/20 pt-4 font-mono text-[11px] uppercase tracking-wider text-background/80">
          <span class="flex items-center gap-1.5">${icon.wind("h-3.5 w-3.5")} 7 mph</span>
          <span class="flex items-center gap-1.5">${icon.sun("h-3.5 w-3.5")} 72°F</span>
        </div>
        <span class="mt-4 inline-flex w-full items-center justify-between bg-primary px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground">Visit Official Site ${icon.arrowUpRight("h-4 w-4")}</span>
      </div>
    </div>
  </a>`;
}

function Featured() {
  const list = FEATURED_COURTS.filter((c) => c.sport === currentSport);
  return `
  <section id="courts" class="relative bg-secondary px-6 py-24 sm:py-32">
    <div class="absolute inset-0 mesh-overlay opacity-50"></div>
    <div class="relative mx-auto max-w-7xl">
      ${SportBar()}
      <div class="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          ${eyebrow("02 · The Court Ledger")}
          <h2 class="font-display-italic text-5xl leading-[0.9] text-foreground sm:text-7xl">Featured<br>Courts.</h2>
        </div>
        <p class="max-w-sm font-body text-base text-muted-foreground">${list.length} standout public-access venues for this sport across the county. Hover a card for live conditions and tap through to the official site.</p>
      </div>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">${list.map(FeaturedCard).join("")}</div>
    </div>
  </section>`;
}

function Directory() {
  const list = DIRECTORY.filter((c) => c.sport === currentSport);
  return `
  <section id="directory" class="relative bg-background px-6 py-24 sm:py-32">
    <div class="mx-auto max-w-7xl">
      <div class="mb-16 max-w-2xl">
        ${eyebrow("03 · The Full Directory")}
        <h2 class="font-display-italic text-5xl leading-[0.9] text-foreground sm:text-7xl">Every Public<br>Court.</h2>
        <p class="mt-6 font-body text-base text-muted-foreground">${list.length} more public and rec-center ${sportLabel(currentSport).toLowerCase()} courts across the San Diego area, each linking to its managing agency or official facility page.</p>
      </div>
      <ul class="divide-y divide-border border-y border-border">
        ${list.map((c, i) => `
          <li class="reveal" style="--ry:12px;--d:${(i % 4) * 0.05}s">
            <a href="${c.website}" ${ext} class="group flex items-center justify-between gap-4 py-5 transition-colors hover:bg-secondary/60">
              <div class="flex items-baseline gap-4 sm:gap-8">
                <span class="font-mono text-xs text-muted-foreground">${pad2(i + 1)}</span>
                <div>
                  <h3 class="font-display-italic text-2xl leading-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl">${esc(c.name)}</h3>
                  <p class="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">${esc(c.area)} · ${esc(c.type)}</p>
                </div>
              </div>
              <span class="flex shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-primary">
                <span class="hidden sm:inline">Visit</span>${icon.arrowUpRight("h-5 w-5")}
              </span>
            </a>
          </li>`).join("")}
      </ul>
    </div>
  </section>`;
}

function HomePage() {
  return `${Nav()}<main class="min-h-screen bg-background">${Hero()}<div id="sport-sections">${Featured()}${Directory()}</div>${Footer()}</main>`;
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
          <p class="font-body text-xl leading-relaxed text-foreground sm:text-2xl">We exist to connect every San Diego player — beginner to pro — with the best public and club courts across five sports: pickleball, tennis, padel, squash, and ping pong.</p>
          <p class="mt-6 font-body text-base leading-relaxed text-muted-foreground">Kinetic Court SD was born from a simple frustration: court info was scattered across city PDFs, club sites, and forum threads. We built a single, design-forward atlas that maps the county's facilities, details their surfaces and amenities, and links straight to the official source — so the only thing between you and the court is the drive there.</p>
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
let facilityFilter = "all";

function FacilitiesPage() {
  const list = facilityFilter === "all" ? FEATURED_COURTS : FEATURED_COURTS.filter((c) => c.sport === facilityFilter);
  const chip = (id, label) => {
    const on = facilityFilter === id;
    return `<button data-filter="${id}" class="px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${on ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:text-primary"}">${label}</button>`;
  };
  return page(`
    <section class="bg-secondary px-6 py-24 sm:py-32">
      <div class="mx-auto max-w-7xl">
        ${eyebrow("The Facilities")}
        <h1 class="font-display-italic text-5xl leading-[0.9] text-foreground sm:text-8xl">Every Court,<br>One Atlas.</h1>
        <p class="mt-6 max-w-xl font-body text-base text-muted-foreground">Browse all featured facilities across San Diego. Open any card for photos, court types, pricing, and a direct booking link.</p>
        <div class="mt-12 flex flex-wrap gap-2">${chip("all", "All")}${SPORTS.map((s) => chip(s.id, s.label)).join("")}</div>
        <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          ${list.map((c, i) => `
            <a href="#/facility-details/${slug(c.name)}" class="group relative block aspect-[4/5] w-full overflow-hidden rounded-sm bg-foreground hard-shadow">
              <img src="${c.image}" alt="${esc(c.name)} courts" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div class="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent"></div>
              <span class="absolute left-5 top-5 font-mono text-xs text-background/70">${pad2(i + 1)}</span>
              <div class="absolute bottom-0 left-0 right-0 p-6">
                <p class="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">${esc(c.neighborhood)}</p>
                <h3 class="font-display-italic text-2xl leading-[0.95] text-background sm:text-3xl">${esc(c.name)}</h3>
                <div class="mt-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-background/70">View details ${icon.arrowUpRight("h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5")}</div>
              </div>
            </a>`).join("")}
        </div>
      </div>
    </section>`);
}

function FacilityDetailPage(id) {
  const c = findCourt(id);
  const back = (label) => `<a href="#/facility-details" class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">${icon.arrowLeft("h-4 w-4")} ${label}</a>`;
  if (!c) {
    return page(`
      <section class="px-6 py-32">
        <div class="mx-auto max-w-2xl text-center">
          <h1 class="font-display-italic text-5xl text-foreground">Court not found.</h1>
          <p class="mt-4 font-body text-muted-foreground">This facility isn't in our atlas yet.</p>
          <div class="mt-8">${back("Back to facilities")}</div>
        </div>
      </section>`);
  }
  const price = PRICING[c.name] || "See website";
  const lit = c.lights === "Lit";
  const specs = [["Courts", c.courts], ["Surface", c.surface], ["Nets", c.nets], ["Lighting", c.lights]];
  return page(`
    <section class="relative h-[60vh] min-h-[420px] w-full overflow-hidden bg-foreground">
      <img src="${c.image}" alt="${esc(c.name)} courts" class="absolute inset-0 h-full w-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/30 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 px-6 pb-10">
        <div class="mx-auto max-w-5xl">
          <p class="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">${icon.mapPin("h-3.5 w-3.5")} ${esc(c.neighborhood)}</p>
          <h1 class="font-display-italic text-4xl leading-[0.9] text-background sm:text-7xl">${esc(c.name)}</h1>
        </div>
      </div>
    </section>
    <section class="px-6 py-20 sm:py-28">
      <div class="mx-auto max-w-5xl">
        <a href="#/facility-details" class="mb-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary">${icon.arrowLeft("h-4 w-4")} All facilities</a>
        <div class="grid gap-12 lg:grid-cols-2">
          <div>
            ${eyebrow("Court Types Available", "mb-6 text-muted-foreground")}
            <div class="grid grid-cols-2 gap-px border border-border bg-border">
              ${specs.map(([l, v]) => `
                <div class="bg-background p-5">
                  <p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">${l}</p>
                  <p class="mt-1 font-display-italic text-xl text-foreground">${esc(v)}</p>
                </div>`).join("")}
            </div>
          </div>
          <div>
            ${eyebrow("Pricing &amp; Booking", "mb-6 text-muted-foreground")}
            <div class="border border-border p-6 hard-shadow-clay">
              <div class="flex items-center gap-3">${icon.dollar("h-5 w-5 text-primary")}<p class="font-display-italic text-3xl text-foreground">${esc(price)}</p></div>
              <p class="mt-3 font-body text-sm text-muted-foreground">${lit ? "Lit for evening play." : "Daylight play only."} Reservations handled through the facility's official site.</p>
              <a href="${c.website}" ${ext} class="mt-6 inline-flex w-full items-center justify-between bg-primary px-6 py-4 font-mono text-xs uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90">Book a session ${icon.arrowUpRight("h-4 w-4")}</a>
              <p class="mt-4 break-all font-mono text-[10px] text-muted-foreground">${esc(c.website)}</p>
            </div>
          </div>
        </div>
        <div class="mt-12 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          ${lit ? icon.moon("h-3.5 w-3.5") : icon.sun("h-3.5 w-3.5")} ${lit ? "Evening sessions available" : "Daytime sessions only"}
        </div>
      </div>
    </section>`);
}

/* ---------- faq ---------- */
function FaqPage() {
  return page(`
    ${pageHeader("Community FAQ", "Questions,<br>answered.", "Everything a new player needs to know about reservations, memberships, and finding a game in San Diego.")}
    <section class="px-6 py-20 sm:py-28">
      <div class="mx-auto max-w-3xl border-y border-border">
        ${FAQ.map((f, i) => `
          <div class="faq-item border-b border-border">
            <h3 class="flex">
              <button data-faq="${i}" aria-expanded="false" class="flex flex-1 items-center justify-between py-6 text-left font-display-italic text-xl text-foreground sm:text-2xl">
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
// The original saved submissions to a Base44 "Suggestion" table. This copy has no
// backend, so submissions are kept in this browser's localStorage. Replace
// saveSuggestion() with a real endpoint (Formspree, Supabase, your own API…) to collect them.
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
    { rootMargin: "-80px 0px" }
  );
  els.forEach((el) => observer.observe(el));
}

function render() {
  const path = (location.hash.replace(/^#/, "") || "/").replace(/\/+$/, "") || "/";
  const detail = path.match(/^\/facility-details\/([^/]+)$/);
  let html;
  if (path === "/") html = HomePage();
  else if (path === "/about") html = AboutPage();
  else if (path === "/faq") html = FaqPage();
  else if (path === "/contact") html = ContactPage();
  else if (path === "/facility-details") html = FacilitiesPage();
  else if (detail) html = FacilityDetailPage(decodeURIComponent(detail[1]));
  else html = NotFoundPage();
  app.innerHTML = html;
  window.scrollTo(0, 0);
  observeReveals();
}

app.addEventListener("click", (e) => {
  const sportBtn = e.target.closest("[data-sport]");
  if (sportBtn) {
    currentSport = sportBtn.dataset.sport;
    document.getElementById("sport-sections").innerHTML = Featured() + Directory();
    observeReveals();
    return;
  }
  const filterBtn = e.target.closest("[data-filter]");
  if (filterBtn) {
    facilityFilter = filterBtn.dataset.filter;
    const y = window.scrollY;
    app.innerHTML = FacilitiesPage();
    window.scrollTo(0, y);
    return;
  }
  const faqBtn = e.target.closest("[data-faq]");
  if (faqBtn) {
    const item = faqBtn.closest(".faq-item");
    const wasOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach((el) => { el.classList.remove("open"); el.querySelector("[data-faq]").setAttribute("aria-expanded", "false"); });
    if (!wasOpen) { item.classList.add("open"); faqBtn.setAttribute("aria-expanded", "true"); }
    return;
  }
  if (e.target.closest("#submit-another")) {
    document.getElementById("contact-slot").innerHTML = ContactForm();
  }
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
