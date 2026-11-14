// All site content lives here. Edit this file to add courts, change schedules, FAQ, etc.
//
// WHERE THE FACTS COME FROM
// - Public pickleball courts and open play hours: the City of San Diego's official
//   "Pickleball Court Locations" PDF, marked "Updated 8.29.2026" (obvious am/pm typos fixed).
// - Public tennis courts and hours: the City's "Tennis Courts" web page.
// - Clubs: each club's own website, read on DATA_CHECKED below.
// - Venues with `verified: false` were carried over from version 1 and have NOT been
//   confirmed yet. The site shows them with an "Unconfirmed" label.

const DATA_CHECKED = "November 13, 2026";
const HERO_IMAGE = "images/hero.jpg";

const SPORTS = [
  { id: "pickleball", label: "Pickleball", noun: "pickleball courts" },
  { id: "tennis", label: "Tennis", noun: "tennis courts" },
  { id: "padel", label: "Padel", noun: "padel clubs" },
  { id: "racquetball", label: "Racquetball", noun: "racquetball courts" },
  { id: "squash", label: "Squash", noun: "squash courts" },
  { id: "pingpong", label: "Ping Pong", noun: "table tennis spots" },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_NAMES = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };
const WEEKDAYS = "Mon Tue Wed Thu Fri";
const EVERY_DAY = "Mon Tue Wed Thu Fri Sat Sun";

// One open play session. days: "Mon Wed Fri" · time: "12:00 – 2:00 pm" · where: "Indoor"/"Outdoor" · note: optional
const S = (days, time, where = "", note = "") => ({ days: days.split(" "), time, where, note });

const CITY_PB_PDF = "https://www.sandiego.gov/sites/default/files/pballlocations.pdf";
const CITY_TENNIS = "https://www.sandiego.gov/park-and-recreation/activities/sports/tenniscourts";
const CITY_SRC = { label: "City of San Diego pickleball list (updated 8/29/2026)", url: CITY_PB_PDF };
const CITY_TENNIS_SRC = { label: "City of San Diego tennis courts page", url: CITY_TENNIS };
const BYO = "Bring your own net and equipment.";
const FCFS = "First come, first served · 7:30 am to dusk · " + BYO;

// Fields:
//   access   "public" (city park / rec center) or "private" (club, membership or pay-to-play)
//   wow      1–5, how good-looking / special the venue is. Used with open play days to rank.
//   featured true = gets a big photo card on the home page
//   image    optional photo path. Venues without one get an illustrated court card.
//   sessions open play sessions (see S above) · openCourts = always-available courts note
const VENUES = [
  /* ===================== PICKLEBALL — clubs ===================== */
  {
    sport: "pickleball", name: "Barnes Tennis Center", area: "Point Loma", address: "4490 W Point Loma Blvd, San Diego, CA 92107",
    access: "private", accessNote: "Open to the public, pay per session", featured: true, wow: 5, image: HERO_IMAGE,
    courts: "24 dedicated courts", setting: "Outdoor", lights: "Lit", cost: "$7 per open play session",
    blurb: "Home of Major League Pickleball events and the USA Pickleball National Championships. Moderated open play every day, with courts organized by skill level.",
    sessions: [
      S("Mon Wed Fri", "7:15 am – 12:00 pm"), S("Mon Wed Fri", "1:00 – 4:00 pm"),
      S("Tue Thu", "7:15 am – 12:00 pm"), S("Tue Thu", "12:00 – 3:00 pm"),
      S("Tue", "5:00 – 7:45 pm"), S("Tue", "7:45 – 9:45 pm", "", "Ladder play, sign up online"),
      S("Thu", "5:15 – 7:15 pm", "", "Ladder play, sign up online"), S("Thu", "7:15 – 10:00 pm"),
      S("Sat", "12:00 – 3:00 pm"), S("Sun", "7:00 – 10:00 am"), S("Sun", "6:00 – 9:00 pm"),
    ],
    website: "https://www.barnestenniscenter.com/pickleball",
    scheduleUrl: "https://www.barnestenniscenter.com/pickleballopenplay", scheduleLabel: "Open play schedule",
    source: { label: "barnestenniscenter.com open play page", url: "https://www.barnestenniscenter.com/pickleballopenplay" },
  },
  {
    sport: "pickleball", name: "The HUB San Diego", area: "Spring Valley", address: "9545 Campo Road, Spring Valley, CA 91977", phone: "(833) 4THEHUB ext. 1",
    access: "private", accessNote: "Membership club with drop-in play", featured: true, wow: 5,
    courts: "26 courts, 2 championship courts with stadium seating", setting: "Outdoor", lights: "Lit", cost: "Membership or drop-in — see website",
    blurb: "A club built only for pickleball: unlimited all-day drop-in challenge play every day, organized by skill level from 2.5 to 4.0+, plus ladders, round robins and leagues.",
    sessions: [
      S("Mon", "8:00 am – 11:00 pm", "", "All-day drop-in play"), S("Tue Wed Thu Fri", "8:00 am – 10:00 pm", "", "All-day drop-in play"),
      S("Sat", "8:00 am – 8:00 pm", "", "All-day drop-in play"), S("Sun", "8:00 am – 6:00 pm", "", "All-day drop-in play"),
    ],
    website: "https://thehubpickleball.com/locations/san-diego",
    scheduleUrl: "https://thehubpickleball.com/play-pickleball", scheduleLabel: "Play options",
    source: { label: "thehubpickleball.com San Diego page", url: "https://thehubpickleball.com/locations/san-diego" },
  },
  {
    sport: "pickleball", name: "Bobby Riggs Racket & Paddle", area: "Encinitas", address: "875 Santa Fe Dr, Encinitas, CA 92024", phone: "(760) 473-2672",
    access: "private", accessNote: "Open to the public, no membership required", featured: true, wow: 4,
    courts: "Dedicated pickleball club", setting: "Outdoor", lights: "Lit", cost: "$10–$15 open play · courts $20/hr",
    blurb: "A privately owned pickleball club in North County with open play, ladders and leagues six days a week. Remodel in progress, still open.",
    sessions: [
      S("Tue", "12:00 – 2:00 pm", "", "Social ladder, $10"),
      S("Fri", "12:00 – 2:00 pm", "", "Open play, all levels, $10"),
      S("Sun", "12:00 – 2:00 pm", "", "Novice open play (guided), $15"),
    ],
    website: "https://www.bobbyriggs.net/",
    scheduleUrl: "https://www.bobbyriggs.net/", scheduleLabel: "Open play & ladders",
    source: { label: "bobbyriggs.net", url: "https://www.bobbyriggs.net/" },
  },

  /* ===================== PICKLEBALL — public (City of San Diego) ===================== */
  {
    sport: "pickleball", name: "Kearny Mesa Recreation Center", area: "Kearny Mesa", address: "3170 Armstrong St, San Diego, CA 92111", phone: "(858) 573-1387",
    access: "public", featured: true, wow: 4, courts: "4 courts", setting: "Outdoor", cost: "Free",
    blurb: "The most open play hours of any public outdoor site in the city: every morning of the week, plus Wednesday nights and all-day weekends.",
    sessions: [S("Mon Tue Thu Fri", "8:00 am – 2:00 pm", "Outdoor", "4 courts"), S("Wed", "8:00 am – 2:00 pm", "Outdoor", "4 courts"), S("Wed", "5:00 – 10:00 pm", "Outdoor", "4 courts"), S("Sat Sun", "8:00 am – 9:00 pm", "Outdoor", "2 courts")],
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "Golden Hill Recreation Center", area: "Golden Hill", address: "2600 Golf Course Dr, San Diego, CA 92102", phone: "(619) 235-1138",
    access: "public", featured: true, wow: 4, courts: "3 outdoor + 2 indoor courts", setting: "Indoor & outdoor", cost: "Free",
    blurb: "Outdoor courts with open play seven days a week on the edge of Balboa Park, plus indoor sessions twice a week.",
    sessions: [S(WEEKDAYS, "11:00 am – 8:30 pm", "Outdoor"), S("Sat Sun", "9:00 am – 2:30 pm", "Outdoor"), S("Mon", "11:00 am – 2:00 pm", "Indoor"), S("Thu", "11:00 am – 2:30 pm", "Indoor")],
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "North Park Recreation Center", area: "North Park", address: "4044 Idaho St, San Diego, CA 92104", phone: "(619) 235-1152",
    access: "public", featured: true, wow: 4, courts: "5 indoor + 3 outdoor courts", setting: "Indoor & outdoor", cost: "Free",
    blurb: "Five indoor courts three days a week, and outdoor courts open every day in the middle of North Park.",
    sessions: [S("Mon Wed Fri", "11:00 am – 3:00 pm", "Indoor"), S(WEEKDAYS, "7:30 am – 7:30 pm", "Outdoor", "Tennis court #3, 2 courts"), S(WEEKDAYS, "3:00 – 7:45 pm", "Outdoor", "Behind the building, 1 court"), S("Sat", "9:00 am – 5:00 pm", "Outdoor"), S("Sun", "9:00 am – 4:00 pm", "Outdoor")],
    website: "https://www.sandiego.gov/park-and-recreation/centers/recctr/northpark", source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "Carmel Mountain Ranch / Sabre Springs Recreation Center", area: "Carmel Mountain", address: "10162 Rancho Carmel Dr, San Diego, CA 92128", phone: "(858) 538-8100",
    access: "public", featured: true, wow: 3, courts: "6 indoor + 3 outdoor courts", setting: "Indoor & outdoor", cost: "Free",
    blurb: "Six indoor courts with open play five days a week, plus three first-come outdoor courts.",
    sessions: [S("Tue", "4:00 – 6:00 pm", "Indoor"), S("Wed", "9:00 – 11:55 am", "Indoor"), S("Thu", "2:00 – 5:55 pm", "Indoor"), S("Fri", "4:00 – 6:55 pm", "Indoor"), S("Sat", "9:00 – 11:55 am", "Indoor")],
    openCourts: "3 outdoor courts, first come, first served. " + BYO,
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "Pacific Beach Recreation Center", area: "Pacific Beach", address: "1405 Diamond St, San Diego, CA 92109", phone: "(858) 581-9927",
    access: "public", featured: true, wow: 4, courts: "3 indoor + 4 outdoor courts", setting: "Indoor & outdoor", cost: "Free",
    blurb: "Indoor open play every weekday afternoon a few blocks from the beach, with four outdoor courts open dawn to dusk.",
    sessions: [S("Mon Thu", "1:00 – 3:00 pm", "Indoor"), S("Tue", "1:00 – 4:00 pm", "Indoor"), S("Wed", "1:00 – 3:30 pm", "Indoor"), S("Fri", "12:00 – 2:00 pm", "Indoor")],
    openCourts: "4 outdoor courts. " + FCFS,
    website: CITY_PB_PDF, source: CITY_SRC,
    pdf: { label: "Gym schedule PDF", url: "https://www.sandiego.gov/sites/default/files/pacificbeachgymschedule.pdf" },
  },
  {
    sport: "pickleball", name: "Balboa Park Activity Center", area: "Balboa Park", address: "2145 Park Blvd, San Diego, CA 92101", phone: "(619) 235-5997",
    access: "public", featured: true, wow: 4, courts: "5 courts", setting: "Indoor", cost: "Free",
    blurb: "Indoor courts on a sport floor in the heart of Balboa Park, three days a week.",
    sessions: [S("Tue Thu", "11:00 am – 2:30 pm", "Indoor"), S("Wed", "1:00 – 5:00 pm", "Indoor")],
    website: "https://www.sandiego.gov/park-and-recreation/centers/bpac", source: CITY_SRC,
    pdf: { label: "Activity schedule PDF", url: "https://www.sandiego.gov/sites/default/files/bpacactivityschedule.pdf" },
  },
  {
    sport: "pickleball", name: "Municipal Gym", area: "Balboa Park", address: "2111 Pan American Plaza, San Diego, CA 92101", phone: "(619) 525-8262",
    access: "public", featured: true, wow: 4, courts: "9 courts", setting: "Indoor", cost: "Free",
    blurb: "The biggest indoor public site in the city: nine courts inside the historic gym on Pan American Plaza.",
    sessions: [S("Mon Wed", "11:30 am – 3:00 pm", "Indoor"), S("Sat", "12:00 – 4:00 pm", "Indoor", "1 court only")],
    website: "https://www.sandiego.gov/park-and-recreation/centers/recctr/munigym", source: CITY_SRC,
    pdf: { label: "Open play calendar PDF", url: "https://www.sandiego.gov/sites/default/files/munigymopenplay.pdf" },
  },
  {
    sport: "pickleball", name: "Colina del Sol Recreation Center", area: "Colina del Sol", address: "5319 Orange Ave, San Diego, CA 92115", phone: "(619) 235-1144",
    access: "public", wow: 3, courts: "4 outdoor + 3 indoor courts", setting: "Indoor & outdoor", cost: "Free",
    sessions: [S(EVERY_DAY, "8:00 am – 10:00 pm", "Outdoor"), S("Tue Fri", "11:00 am – 2:00 pm", "Indoor")],
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "La Jolla Recreation Center", area: "La Jolla", address: "615 Prospect St, La Jolla, CA 92037", phone: "(858) 552-1658",
    access: "public", wow: 4, courts: "2 courts", setting: "Outdoor", cost: "Free",
    sessions: [S(EVERY_DAY, "8:00 am – 10:00 pm", "Outdoor")],
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "Ellen Browning Scripps Joint-Use Park", area: "Scripps Ranch", address: "11454 Blue Cypress Dr, San Diego, CA 92131", phone: "(858) 538-8085",
    access: "public", wow: 3, courts: "2 courts", setting: "Outdoor", cost: "Free",
    sessions: [S(WEEKDAYS, "4:00 – 9:00 pm", "Outdoor"), S("Sat Sun", "8:00 am – 9:00 pm", "Outdoor")],
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "North Clairemont Recreation Center", area: "Clairemont", address: "4421 Bannock Ave, San Diego, CA 92117", phone: "(858) 581-9926",
    access: "public", wow: 2, courts: "4 courts", setting: "Outdoor", cost: "Free",
    sessions: [S(WEEKDAYS + " Sun", "9:00 am – 2:00 pm", "Outdoor", "Bring your own net")],
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "Scripps Ranch Recreation Center", area: "Scripps Ranch", address: "11464 Blue Cypress Dr, San Diego, CA 92131", phone: "(858) 538-8085",
    access: "public", wow: 3, courts: "4 courts", setting: "Indoor", cost: "Free",
    sessions: [S("Mon", "1:30 – 4:30 pm", "Indoor"), S("Wed", "2:00 – 5:00 pm", "Indoor"), S("Thu", "2:00 – 4:45 pm", "Indoor"), S("Fri", "2:00 – 4:15 pm", "Indoor")],
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "Carmel Valley Recreation Center", area: "Carmel Valley", address: "3777 Townsgate Dr, San Diego, CA 92130", phone: "(858) 552-1616",
    access: "public", wow: 3, courts: "6 courts", setting: "Indoor", cost: "Free",
    sessions: [S("Mon Tue Fri Sat", "9:00 – 11:45 am", "Indoor")],
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "Hourglass Fieldhouse / Recreation Center", area: "Mira Mesa", address: "10440 Black Mountain Rd, San Diego, CA 92126", phone: "(858) 538-8153",
    access: "public", wow: 3, courts: "6 courts", setting: "Indoor", cost: "Free",
    sessions: [S("Mon Wed", "10:00 am – 12:00 pm", "Indoor"), S("Thu Fri", "11:00 am – 1:00 pm", "Indoor")],
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "Nobel Recreation Center", area: "University City", address: "8810 Judicial Dr, San Diego, CA 92122", phone: "(858) 552-1626",
    access: "public", wow: 3, courts: "3 indoor + 2 outdoor courts", setting: "Indoor & outdoor", cost: "Free",
    sessions: [S("Mon Wed", "10:15 am – 1:30 pm", "Indoor"), S("Fri", "10:15 am – 2:20 pm", "Indoor"), S("Sat", "9:15 – 11:45 am or 2:10 – 3:45 pm", "Indoor", "Alternates weekly")],
    openCourts: "2 outdoor courts. " + FCFS,
    website: CITY_PB_PDF, source: CITY_SRC,
    pdf: { label: "Gym calendar PDF", url: "https://www.sandiego.gov/sites/default/files/nobelopenplay.pdf" },
  },
  {
    sport: "pickleball", name: "Pacific Highlands Ranch Recreation Center", area: "Pacific Highlands Ranch", address: "5977 Village Loop Rd, San Diego, CA 92130", phone: "(858) 538-8184",
    access: "public", wow: 3, courts: "Up to 6 indoor + 2 outdoor courts", setting: "Indoor & outdoor", cost: "Free",
    sessions: [S("Tue", "9:00 am – 2:45 pm", "Indoor"), S("Thu", "9:00 am – 1:00 pm", "Indoor"), S("Sat", "12:00 – 2:30 pm", "Indoor")],
    openCourts: "2 outdoor courts. " + FCFS,
    website: CITY_PB_PDF, source: CITY_SRC,
    pdf: { label: "Gym schedule PDF", url: "https://www.sandiego.gov/sites/default/files/phropenplay.pdf" },
  },
  {
    sport: "pickleball", name: "Ocean Beach Recreation Center", area: "Ocean Beach", address: "4726 Santa Monica Ave, San Diego, CA 92107", phone: "(619) 531-1527",
    access: "public", wow: 3, courts: "3 courts", setting: "Indoor", cost: "Free",
    sessions: [S("Mon Wed", "12:00 – 2:00 pm", "Indoor"), S("Sat", "10:00 am – 1:00 pm", "Indoor")],
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "Rancho Bernardo Glassman Recreation Center", area: "Rancho Bernardo", address: "18448 W Bernardo Dr, San Diego, CA 92127", phone: "(858) 538-8129",
    access: "public", wow: 2, courts: "3 courts", setting: "Indoor", cost: "Free",
    sessions: [S("Tue Thu", "10:00 am – 12:00 pm", "Indoor"), S("Sat", "9:00 – 11:00 am", "Indoor")],
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "Allied Gardens Recreation Center", area: "Allied Gardens", address: "5155 Greenbrier Ave, San Diego, CA 92120", phone: "(619) 235-1129",
    access: "public", wow: 2, courts: "3 courts", setting: "Indoor", cost: "Free",
    sessions: [S("Mon Wed Fri", "12:00 – 2:00 pm", "Indoor")],
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "Ocean Air Recreation Center", area: "Torrey Hills", address: "4770 Fairport Way, San Diego, CA 92130", phone: "(858) 552-1687",
    access: "public", wow: 3, courts: "3 indoor + 2 outdoor courts", setting: "Indoor & outdoor", cost: "Free",
    sessions: [S("Tue", "10:00 am – 2:30 pm", "Indoor"), S("Fri", "2:00 – 6:50 pm", "Indoor")],
    openCourts: "2 outdoor courts. " + FCFS,
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "Park de la Cruz Gymnasium", area: "City Heights", address: "3911 Landis St, San Diego, CA 92105", phone: "(619) 516-3141",
    access: "public", wow: 2, courts: "3 indoor + 2 outdoor courts", setting: "Indoor & outdoor", cost: "Free",
    sessions: [S("Tue", "12:30 – 2:30 pm"), S("Thu", "10:00 am – 12:00 pm")],
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "Tierrasanta Recreation Center", area: "Tierrasanta", address: "11220 Clairemont Mesa Blvd, San Diego, CA 92124", phone: "(858) 573-1393",
    access: "public", wow: 2, courts: "2 indoor + 1 outdoor court", setting: "Indoor & outdoor", cost: "Free",
    sessions: [S("Wed", "1:00 – 3:30 pm", "Indoor"), S("Wed", "11:30 am – 3:30 pm", "Outdoor"), S("Sun", "12:15 – 1:30 pm", "Outdoor")],
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "Standley Recreation Center", area: "University City", address: "3585 Governor Dr, San Diego, CA 92122", phone: "(858) 581-1652",
    access: "public", wow: 2, courts: "2 indoor + 2 outdoor courts", setting: "Indoor & outdoor", cost: "Free",
    sessions: [S("Fri", "9:00 am – 12:00 pm", "Indoor")],
    openCourts: "2 outdoor courts. " + FCFS,
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "Mid-City Gymnasium", area: "City Heights", address: "4302 Landis St, San Diego, CA 92105", phone: "(619) 516-3082",
    access: "public", wow: 2, courts: "2 courts", setting: "Indoor", cost: "Free",
    sessions: [S("Thu", "12:00 – 3:30 pm", "Indoor")],
    website: CITY_PB_PDF, source: CITY_SRC,
    pdf: { label: "Open play flyer PDF", url: "https://www.sandiego.gov/sites/default/files/2024-11/midcitybadmintonpickleball.pdf" },
  },
  {
    sport: "pickleball", name: "Black Mountain Multipurpose Center", area: "Rancho Peñasquitos", address: "9353 Oviedo St, San Diego, CA 92129", phone: "(858) 538-8198",
    access: "public", wow: 2, courts: "3 courts", setting: "Indoor", cost: "Free",
    sessions: [S("Wed", "6:45 – 8:45 pm", "Indoor")],
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "Presidio Recreation Center", area: "Old Town", address: "2811 Jackson Dr, San Diego, CA 92110", phone: "(619) 692-4918",
    access: "public", wow: 2, courts: "2 courts", setting: "Indoor", cost: "Free",
    sessions: [S("Sat", "9:00 – 11:30 am", "Indoor")],
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "Taft Middle School Joint Use", area: "Serra Mesa", address: "9191 Gramercy Dr, San Diego, CA 92123", phone: "(858) 573-1408",
    access: "public", wow: 1, courts: "2 courts", setting: "Outdoor", cost: "Free",
    openCourts: "School days: 7:00 – 8:30 am and 4:30 pm to dusk. Weekends: 6:30 am to dusk. School breaks and holidays: 7:30 am to dusk.",
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  {
    sport: "pickleball", name: "Mira Mesa Recreation Center", area: "Mira Mesa", address: "8575 New Salem St, San Diego, CA 92126", phone: "(858) 538-8122",
    access: "public", wow: 1, courts: "2 courts", setting: "Indoor", cost: "Free", closed: "Closed — under construction",
    website: CITY_PB_PDF, source: CITY_SRC,
  },
  // Always-open public courts (no set open play hours)
  ...[
    ["Views West Park", "Rancho Peñasquitos", "12958 La Tortola, San Diego, CA 92129", "(858) 538-8131", "3 courts", FCFS],
    ["Cypress Canyon Park", "Scripps Ranch", "11490 Cypress Canyon Rd, San Diego, CA 92131", "(858) 538-8085", "3 courts", "First come, first served. " + BYO],
    ["Lindbergh Neighborhood Park", "Kearny Mesa", "4141 Ashford St, San Diego, CA 92111", "(858) 573-1387", "3 courts", FCFS],
    ["Linda Vista Recreation Center", "Linda Vista", "7064 Levant St, San Diego, CA 92111", "(858) 573-1392", "2 courts", "First come, first served. " + BYO + " Lights off at 9 pm."],
    ["Olive Grove Park", "Clairemont", "6075 Printwood Way, San Diego, CA 92117", "(858) 581-9926", "2 courts", FCFS],
    ["Murray Ridge Neighborhood Park", "Serra Mesa", "8651 Celestine Ave, San Diego, CA 92123", "(858) 573-1408", "2 courts", FCFS],
    ["Jerabek Neighborhood Park", "Scripps Ranch", "10060 Avenida Magnifica, San Diego, CA 92131", "(858) 538-8085", "2 courts", "First come, first served. " + BYO],
    ["Peñasquitos Creek Park", "Rancho Peñasquitos", "8021 Park Village Rd, San Diego, CA 92129", "(858) 538-8131", "2 courts", FCFS],
    ["Western Hills Neighborhood Park", "Bay Park", "4810 Kane St, San Diego, CA 92110", "(858) 581-9930", "2 courts", FCFS],
    ["Fairbrook Ranch Park", "Scripps Ranch", "10366 Rue Fontenay, San Diego, CA 92131", "(858) 538-8085", "1 court", "First come, first served. Net is provided, bring your own equipment."],
  ].map(([name, area, address, phone, courts, openCourts]) => ({
    sport: "pickleball", name, area, address, phone, access: "public", wow: 2, courts, setting: "Outdoor", cost: "Free", openCourts, website: CITY_PB_PDF, source: CITY_SRC,
  })),
  // Carried over from version 1 — not confirmed yet
  ...[
    ["Coronado Cays Park", "Coronado", "public", "https://www.coronado.ca.us"],
    ["Big Rock Park", "Santee", "public", "https://www.ci.santee.ca.us"],
    ["Encinitas Community Park", "Encinitas", "public", "https://www.encinitasca.gov"],
    ["San Diego Pickleball — Mission Bay Resort", "Mission Bay", "private", "https://www.sandiegopickleball.com"],
    ["Coronado Island Marriott", "Coronado", "private", "http://www.impactactivities.com/coronado"],
  ].map(([name, area, access, website]) => ({ sport: "pickleball", name, area, access, wow: 2, setting: "Outdoor", website, verified: false })),

  /* ===================== TENNIS ===================== */
  {
    sport: "tennis", name: "Barnes Tennis Center (Tennis)", area: "Point Loma", address: "4490 W Point Loma Blvd, San Diego, CA 92107",
    access: "private", accessNote: "Open to the public, court fees apply", featured: true, wow: 5, image: "images/e00910b09.png",
    courts: "Tennis courts alongside 24 pickleball and padel courts", setting: "Outdoor", lights: "Lit", cost: "See website",
    blurb: "San Diego's flagship racquet complex in Point Loma. Reserve courts online.",
    website: "https://www.barnestenniscenter.com", source: { label: "barnestenniscenter.com", url: "https://www.barnestenniscenter.com" },
  },
  {
    sport: "tennis", name: "Morley Field Sports Complex", area: "Balboa Park", address: "2221 Morley Field Dr, San Diego, CA 92104", phone: "(619) 295-9278",
    access: "public", accessNote: "Public courts run by Balboa Tennis Club — a day fee may apply", featured: true, wow: 5,
    courts: "25 courts", setting: "Outdoor", lights: "Lit", cost: "Check for day fee",
    blurb: "The largest public tennis facility in the city, at the north-east corner of Balboa Park.",
    hours: "Mon–Fri 8 am – 8 pm · Sat–Sun 8 am – 6 pm", website: CITY_TENNIS, source: CITY_TENNIS_SRC,
  },
  {
    sport: "tennis", name: "Robb Athletic Field", area: "Ocean Beach", address: "2525 Bacon St, San Diego, CA 92107", phone: "(619) 531-1563",
    access: "public", accessNote: "Public courts run by Peninsula Tennis Club — a day fee may apply", featured: true, wow: 4, image: "images/abb855591.png",
    courts: "12 courts", setting: "Outdoor", lights: "Lit", cost: "Check for day fee",
    blurb: "Twelve lighted courts by the San Diego River estuary in Ocean Beach.",
    hours: "Every day 8 am – 8 pm", website: "https://www.peninsulatennis.org", source: CITY_TENNIS_SRC,
  },
  {
    sport: "tennis", name: "Carmel Valley Community Park", area: "Carmel Valley", address: "3777 Townsgate Dr, San Diego, CA 92130", phone: "(858) 552-1616",
    access: "public", featured: true, wow: 3, image: "images/c06d98875.png", courts: "4 courts", setting: "Outdoor", lights: "Lit", cost: "Free",
    hours: "Mon–Fri 8:30 am – 8 pm · Sat 8 am – 6 pm · Sun 8 am – 5 pm", website: "https://www.sandiego.gov/park-and-recreation/centers/recctr/carmelvalley", source: CITY_TENNIS_SRC,
  },
  {
    sport: "tennis", name: "La Jolla Tennis Courts", area: "La Jolla", address: "7632 Draper Ave, La Jolla, CA 92037", phone: "(858) 454-4434",
    access: "public", accessNote: "Public courts run by La Jolla Tennis Club — a day fee may apply", featured: true, wow: 4,
    courts: "9 courts", setting: "Outdoor", lights: "Lit", cost: "Check for day fee",
    hours: "Every day, dawn – 9 pm", website: CITY_TENNIS, source: CITY_TENNIS_SRC,
  },
  {
    sport: "tennis", name: "Lake Murray Park", area: "San Carlos", address: "7003 Murray Park Dr, San Diego, CA 92119", phone: "(619) 469-3232",
    access: "public", accessNote: "Public courts run by a tennis club — a day fee may apply", featured: true, wow: 4,
    courts: "10 courts", setting: "Outdoor", lights: "Lit", cost: "Check for day fee",
    hours: "Mon–Thu 8 am – 10 pm · Fri 7 am – 8 pm · Sat–Sun 8 am – 8 pm", website: CITY_TENNIS, source: CITY_TENNIS_SRC,
  },
  // The rest of the City's public tennis list: [name, area, address, phone, courts, lights, hours, wow]
  ...[
    ["Canyonside Community Park", "Rancho Peñasquitos", "12350 Black Mountain Rd, 92129", "(858) 538-8131", "12 courts", "Lit", "Every day 8 am – 9:45 pm", 3],
    ["Pacific Beach Tennis Club (Bob McEvoy Fields)", "Pacific Beach", "2639 Grand Ave, 92109", "(858) 273-9177", "7 courts", "Lit", "Every day 8 am – 10 pm (except City holidays)", 3],
    ["Hourglass Park", "Mira Mesa", "14440 Black Mountain Rd, 92126", "(858) 538-8153", "8 courts", "Lit", "Every day 8 am – 10 pm", 3],
    ["Martin Luther King Jr. Recreation Center", "Skyline", "6401 Skyline Dr, 92114", "(619) 527-3415", "7 courts", "Lit", "Mon–Fri 9 am – 7 pm · Sat 9 am – 3 pm", 2],
    ["Standley Park and Recreation Center", "University City", "3585 Governor Dr, 92122", "(858) 552-1652", "6 courts", "Lit", "Mon–Fri 8 am – 10 pm · Sat–Sun 8 am – dusk", 2],
    ["Colina del Sol Park", "Colina del Sol", "5319 Orange Ave, 92115", "(619) 235-1144", "6 courts", "Lit", "Mon–Thu dawn – 8 pm · Fri dawn – 6 pm · Sat–Sun dawn – 4 pm", 2],
    ["Rancho Bernardo Community Park", "Rancho Bernardo", "18402 W Bernardo Dr, 92127", "(858) 538-8129", "6 courts", "Lit", "Every day 7 am – 10 pm", 2],
    ["Canyon Hills High School", "Tierrasanta", "5156 Santo Rd, 92124", "(858) 573-1393", "6 courts", "Lit", "Mon–Fri after school – 9 pm · Sat–Sun dawn – 9 pm", 2],
    ["Tierrasanta Recreation Center", "Tierrasanta", "11220 Clairemont Mesa Blvd, 92124", "(858) 278-3009", "4 courts", "Lit", "Every day 7 am – 9 pm", 2],
    ["Linda Vista Recreation Center", "Linda Vista", "7064 Levant St, 92111", "(858) 573-1392", "4 courts", "Lit", "Every day 7 am – 10 pm", 2],
    ["City Heights Recreation Center", "City Heights", "4380 Landis St, 92105", "(619) 641-6125", "4 courts", "Lit", "Mon–Fri 10 am – 7 pm · Sat 10 am – 4 pm", 2],
    ["Point Loma Park", "Point Loma", "1049 Catalina Blvd, 92107", "(619) 531-1534", "4 courts", "No lights", "Every day 7 am – dusk", 2],
    ["North Park Recreation Center", "North Park", "4044 Idaho St, 92104", "(619) 235-1152", "3 courts", "Lit", "Mon–Fri 7 am – 7 pm · Sat 7 am – 5 pm · Sun 7 am – 4 pm", 2],
    ["Pacific Beach Recreation Center", "Pacific Beach", "1405 Diamond St, 92109", "(858) 581-9927", "2 courts", "Lit", "Mon–Wed 8 am – 8 pm · Thu 8 am – 9 pm · Fri 8 am – 7 pm · Sat–Sun 9 am – dusk", 2],
    ["Cabrillo Recreation Center", "Point Loma", "3051 Cañon St, 92106", "(619) 531-1534", "2 courts", "No lights", "Every day 7 am – 6 pm", 2],
    ["San Ysidro Recreation Center", "San Ysidro", "125 East Park Ave, 92173", "(619) 424-0472", "2 courts", "Lit", "Mon–Fri 7 am – 8 pm · Sat 9 am – 4 pm", 1],
    ["Encanto Park", "Encanto", "6508 Wunderlin Ave, 92114", "(619) 527-3411", "2 courts", "Lit", "Every day 6 am – 10 pm", 1],
    ["Emerald Hills", "Emerald Hills", "Bethune Ct and Kelton Rd, 92114", "(619) 527-3411", "2 courts", "Lit", "Every day 6 am – 10 pm", 1],
    ["Jerabek Park", "Scripps Ranch", "10060 Avenida Magnifica, 92131", "(858) 538-8085", "2 courts", "No lights", "Every day 8 am – dusk", 1],
    ["Mission Hills / Pioneer Park", "Mission Hills", "1500 Washington Pl, 92103", "(619) 235-1100", "2 courts", "No lights", "Every day, dawn to dusk", 2],
    ["Santa Clara Recreation Center", "Mission Beach", "1008 Santa Clara Pl, 92109", "(858) 581-9928", "1 court", "Lit", "Every day, dawn – 10 pm", 2],
    ["South Clairemont Recreation Center", "Clairemont", "3605 Clairemont Dr, 92117", "(858) 581-9924", "1 court", "Lit", "Every day, dawn – 10 pm", 1],
    ["North Clairemont Recreation Center", "Clairemont", "4421 Bannock Ave, 92117", "(858) 581-9926", "1 court", "Lit", "Every day, dawn – 10 pm", 1],
    ["Cadman Recreation Center", "Clairemont", "4680 Avati Dr, 92117", "(858) 581-9929", "1 court", "No lights", "Every day, dawn to dusk", 1],
    ["Gershwin Park", "Clairemont", "3508 Conrad Ave, 92117", "(858) 581-9926", "1 court", "No lights", "Every day, dawn to dusk", 1],
    ["Murray Ridge Park", "Serra Mesa", "8651 Celestine Ave, 92123", "(858) 573-1408", "1 court", "No lights", "Every day, dawn to dusk", 1],
  ].map(([name, area, address, phone, courts, lights, hours, wow]) => ({
    sport: "tennis", name, area, address: address.replace(/, (\d{5})$/, ", San Diego, CA $1"), phone, access: "public", wow, courts, setting: "Outdoor", lights, cost: "Free", hours, website: CITY_TENNIS, source: CITY_TENNIS_SRC,
  })),

  /* ===================== PADEL ===================== */
  {
    sport: "padel", name: "Taktika Padel at Barnes", area: "Point Loma", address: "4490 W Point Loma Blvd, San Diego, CA 92107",
    access: "private", accessNote: "Open to the public, book by the hour", featured: true, wow: 5, image: "images/9e7621622.png",
    courts: "Padel courts inside Barnes Tennis Center", setting: "Outdoor", lights: "Lit", cost: "See Playtomic",
    blurb: "Glass-walled courts at Barnes, home of the San Diego Stingrays pro team. Book through Playtomic.",
    website: "https://www.barnestenniscenter.com/padel",
    scheduleUrl: "https://playtomic.com/clubs/taktika-padel-san-diego-barnes-tennis-center", scheduleLabel: "Book on Playtomic",
    source: { label: "barnestenniscenter.com/padel", url: "https://www.barnestenniscenter.com/padel" },
  },
  {
    sport: "padel", name: "Padel N9NE — Sorrento Valley", area: "Sorrento Valley", access: "private", accessNote: "Book through the P9 app", featured: true, wow: 4, image: "images/ab366f666.png",
    courts: "Padel club", setting: "See website", cost: "See website",
    blurb: "Book courts, join clinics and open matches, and find players at your level through the club's app.",
    website: "https://padeln9ne.com/", source: { label: "padeln9ne.com", url: "https://padeln9ne.com/" },
  },
  {
    sport: "padel", name: "Kingdom of Padel", area: "San Diego", access: "private", accessNote: "Book online", featured: true, wow: 4, image: "images/c897f7fc0.png",
    courts: "Indoor and outdoor padel, plus pickleball", setting: "Indoor & outdoor", cost: "See website",
    blurb: "Padel and pickleball with coaching, open play, golf simulators and a bar.",
    website: "https://kingdomofpadel.com/", source: { label: "kingdomofpadel.com", url: "https://kingdomofpadel.com/" },
  },
  {
    sport: "padel", name: "Padel N9NE — San Marcos", area: "San Marcos", access: "private", accessNote: "Book through the P9 app", wow: 3,
    courts: "Padel club", setting: "See website", cost: "See website", website: "https://padeln9ne.com/", source: { label: "padeln9ne.com", url: "https://padeln9ne.com/" },
  },

  /* ===================== RACQUETBALL ===================== */
  {
    sport: "racquetball", name: "UC San Diego RIMAC", area: "La Jolla", address: "9860 Hopkins Dr, La Jolla, CA 92093", phone: "(858) 534-3557",
    access: "private", accessNote: "Community day pass available", featured: true, wow: 4,
    courts: "Indoor racquetball and squash courts", setting: "Indoor", cost: "$25 day pass · $55 for 30 days",
    blurb: "University courts that anyone can book with a day pass. Bookings open three days ahead.",
    hours: "Mon–Fri 6 am – 11 pm · Sat–Sun 8 am – 11 pm", website: "https://recreation.ucsd.edu/facilities/",
    scheduleUrl: "https://recreation.ucsd.edu/memberships/", scheduleLabel: "Passes & memberships",
    source: { label: "recreation.ucsd.edu", url: "https://recreation.ucsd.edu/memberships/" },
  },
  {
    sport: "racquetball", name: "Aztec Recreation — Peterson Gym", area: "College Area (SDSU)", access: "private", accessNote: "Members and day pass holders. Community members need an SDSU sponsor", featured: true, wow: 3,
    courts: "Racquetball courts, west side of Peterson Gym", setting: "Indoor", cost: "Membership or day pass",
    blurb: "Drop in for open rec play or reserve a court. Racquets, balls and goggles are free to borrow.",
    website: "https://arc.sdsu.edu/racquetball", source: { label: "arc.sdsu.edu/racquetball", url: "https://arc.sdsu.edu/racquetball" },
  },
  {
    sport: "racquetball", name: "San Diego Tennis & Racquet Club", area: "Bay Park", address: "4848 Tecolote Rd, San Diego, CA 92110", access: "private", accessNote: "Private club", wow: 3,
    courts: "Racquetball at a 10-acre club", setting: "Indoor", cost: "Membership", website: "https://www.sdtrc.com", verified: false,
  },

  /* ===================== SQUASH ===================== */
  {
    sport: "squash", name: "Access Sports Club", area: "Southeast San Diego", access: "private", accessNote: "Memberships, lessons and clinics", featured: true, wow: 4, image: "images/b066ac985.png",
    courts: "Squash courts", setting: "Indoor", cost: "Membership", website: "https://www.accesssportsclub.com/squash", verified: false,
  },
  {
    sport: "squash", name: "Bay Club Carmel Valley", area: "Carmel Valley", access: "private", accessNote: "Members only", featured: true, wow: 4, image: "images/814205e07.png",
    courts: "Squash courts", setting: "Indoor", cost: "Membership", website: "https://www.bayclubs.com/amenity/squash", verified: false,
  },
  {
    sport: "squash", name: "San Diego Squash", area: "Mira Mesa", address: "9370 Waples St, Suite 101, San Diego, CA 92121", access: "private", featured: true, wow: 3, image: "images/5d771cd9e.png",
    courts: "Squash courts", setting: "Indoor", cost: "See website", website: "https://sdsquash.com", verified: false,
  },
  {
    sport: "squash", name: "UC San Diego RIMAC (Squash)", area: "La Jolla", address: "9860 Hopkins Dr, La Jolla, CA 92093", phone: "(858) 534-3557",
    access: "private", accessNote: "Community day pass available", wow: 3, courts: "Indoor squash courts", setting: "Indoor", cost: "$25 day pass · $55 for 30 days",
    hours: "Mon–Fri 6 am – 11 pm · Sat–Sun 8 am – 11 pm", website: "https://recreation.ucsd.edu/facilities/", source: { label: "recreation.ucsd.edu", url: "https://recreation.ucsd.edu/memberships/" },
  },
  { sport: "squash", name: "Access Youth Academy", area: "Southeast San Diego", access: "private", wow: 2, courts: "Community squash courts", setting: "Indoor", website: "https://www.accessyouthacademy.org", verified: false },
  { sport: "squash", name: "SoCal Squash League", area: "Countywide", access: "private", wow: 1, courts: "League play", setting: "Indoor", website: "https://www.socalsquash.org", verified: false },

  /* ===================== PING PONG ===================== */
  {
    sport: "pingpong", name: "San Diego Table Tennis Association", area: "Balboa Park", address: "2145 Park Blvd, San Diego, CA 92101", phone: "(619) 235-5997",
    access: "public", accessNote: "Club inside a City facility. Open to everyone, small fee per session for non-members", featured: true, wow: 5, image: "images/66093b5f9.png",
    courts: "25 Butterfly tables", setting: "Indoor", cost: "Small per-session fee",
    blurb: "About 400 members, bright lighting and a sport floor inside the Balboa Park Activity Center. All ages and levels welcome.",
    sessions: [S("Thu", "Evening", "Indoor", "Weekly round robin tournament, 60–75 players")],
    website: "https://sdtta.org", source: { label: "City of San Diego SDTTA page", url: "https://www.sandiego.gov/park-and-recreation/centers/bpac/bpactable" },
    pdf: { label: "Activity schedule PDF", url: "https://www.sandiego.gov/sites/default/files/bpacactivityschedule.pdf" },
  },
  {
    sport: "pingpong", name: "UC San Diego Table Tennis Club", area: "La Jolla", access: "private", accessNote: "University club", wow: 3,
    courts: "Club sessions in the Main Gym at Muir", setting: "Indoor", cost: "See website",
    sessions: [S("Mon", "8:00 – 11:00 pm", "Indoor"), S("Thu", "8:00 – 9:30 pm", "Indoor")],
    website: "https://recreation.ucsd.edu/competitive-sports/table-tennis/", source: { label: "recreation.ucsd.edu table tennis", url: "https://recreation.ucsd.edu/competitive-sports/table-tennis/" },
  },
  { sport: "pingpong", name: "ASLT Table Tennis", area: "Sorrento Valley", access: "private", featured: true, wow: 3, image: "images/39e991f2a.png", courts: "Table tennis club", setting: "Indoor", website: "https://www.aslttabletennis.com", verified: false },
  { sport: "pingpong", name: "SoCal Table Tennis", area: "San Diego", access: "private", featured: true, wow: 3, image: "images/d1ac7835d.png", courts: "Table tennis club", setting: "Indoor", website: "https://www.socal-tabletennis.com", verified: false },
];

// Official schedules and documents, shown in the "Schedules & PDFs" section.
const DOCUMENTS = [
  { group: "City of San Diego — public courts", items: [
    { title: "Pickleball court locations & open play hours", note: "Every City indoor and outdoor site, with days and times. Updated 8/29/2026.", kind: "PDF", url: CITY_PB_PDF },
    { title: "Balboa Park Activity Center — activity schedule", note: "Pickleball, table tennis, badminton and volleyball blocks.", kind: "PDF", url: "https://www.sandiego.gov/sites/default/files/bpacactivityschedule.pdf" },
    { title: "Municipal Gym — open play calendar", note: "Balboa Park, 9 indoor courts.", kind: "PDF", url: "https://www.sandiego.gov/sites/default/files/munigymopenplay.pdf" },
    { title: "Pacific Beach Recreation Center — gym schedule", note: "Weekday afternoon pickleball blocks.", kind: "PDF", url: "https://www.sandiego.gov/sites/default/files/pacificbeachgymschedule.pdf" },
    { title: "Nobel Recreation Center — gym calendar", note: "Monthly calendar, University City.", kind: "PDF", url: "https://www.sandiego.gov/sites/default/files/nobelopenplay.pdf" },
    { title: "Pacific Highlands Ranch — gym schedule", note: "Carmel Valley area.", kind: "PDF", url: "https://www.sandiego.gov/sites/default/files/phropenplay.pdf" },
    { title: "Mid-City Gymnasium — pickleball & badminton open play", note: "City Heights.", kind: "PDF", url: "https://www.sandiego.gov/sites/default/files/2024-11/midcitybadmintonpickleball.pdf" },
    { title: "Public tennis courts — locations & hours", note: "All 30 City tennis sites.", kind: "Web", url: CITY_TENNIS },
  ] },
  { group: "Clubs & organizations — open play", items: [
    { title: "Barnes Tennis Center — pickleball open play", note: "Daily sessions, $7. Ladder play Tuesday and Thursday.", kind: "Web", url: "https://www.barnestenniscenter.com/pickleballopenplay" },
    { title: "The HUB San Diego — play options", note: "All-day drop-in play, ladders and round robins.", kind: "Web", url: "https://thehubpickleball.com/play-pickleball" },
    { title: "Bobby Riggs Racket & Paddle — open play & ladders", note: "Tuesday ladder, Friday open play, Sunday novice session.", kind: "Web", url: "https://www.bobbyriggs.net/" },
    { title: "Taktika Padel at Barnes — court booking", note: "Padel courts and open matches on Playtomic.", kind: "Web", url: "https://playtomic.com/clubs/taktika-padel-san-diego-barnes-tennis-center" },
    { title: "San Diego Table Tennis Association", note: "Club news, hours and Thursday round robin.", kind: "Web", url: "https://sdtta.org" },
    { title: "UC San Diego Recreation — passes for racquetball & squash", note: "Day pass and court booking rules.", kind: "Web", url: "https://recreation.ucsd.edu/memberships/" },
  ] },
];

// Footer "The Social Net" links.
const ECOSYSTEM_LINKS = [
  { label: "City of San Diego Parks & Recreation", href: "https://www.sandiego.gov/parks-and-recreation" },
  { label: "USA Pickleball", href: "https://usapickleball.org" },
  { label: "USTA Southern California — Tennis", href: "https://www.sctennis.usta.com" },
  { label: "US Squash", href: "https://www.ussquash.org" },
  { label: "USA Table Tennis", href: "https://www.teamusa.org/usa-table-tennis" },
  { label: "Pickleheads — San Diego Atlas", href: "https://www.pickleheads.com/courts/us/california/san-diego" },
];

const VALUES = [
  { n: "01", t: "Accurate by design", d: "Open play times come from the City's own schedule and each club's own site, and every listing links back to its source." },
  { n: "02", t: "Built for speed", d: "Time-to-court minimized. Pick a sport, pick public or private, pick a day, and go." },
  { n: "03", t: "Community-powered", d: "Players suggest new courts and flag outdated info through our Contact page." },
];

const FAQ = [
  { q: "What's the difference between public and private courts?", a: "Public courts are City parks and recreation centers. They're free, and outdoor courts are first come, first served. Private courts are clubs. Some, like Barnes Tennis Center and Bobby Riggs, are open to anyone who pays per session. Others need a membership. Use the Public / Private switch to see one or the other." },
  { q: "When is open play?", a: "Go to the Open Play section, pick a day, and you'll see every place with open play that day and the hours. Public times come from the City's official list, and club times come from each club's website. Gym schedules change, so call ahead if you're making a special trip." },
  { q: "How do I reserve a court?", a: "Most public City of San Diego courts are first come, first served — just show up. Private clubs (padel, squash, and many tennis facilities) take reservations through their official site. Every facility page links straight to that booking page." },
  { q: "Do I need a membership?", a: "No, for public courts — they're free and open to all. Private clubs generally require a membership or a drop-in fee, which is listed on each facility's page when the club publishes it." },
  { q: "What should I bring?", a: "Your paddle or racket, balls, non-marking court shoes (required for indoor hardwood), and water. Many outdoor public pickleball courts ask you to bring your own net. Most clubs rent equipment if you're visiting without gear." },
  { q: "Where can I find the official schedules?", a: "The Schedules & PDFs section links to the City's pickleball schedule PDF, individual recreation center calendars, and each club's open play page." },
  { q: "Can I suggest a new court or report outdated info?", a: "Yes — that's exactly what our Contact page is for. Submit a new location or flag a listing that needs updating, and we'll review it for the atlas." },
];
