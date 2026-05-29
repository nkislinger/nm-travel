import { useState, useRef, useEffect } from "react";

// ─── Google Calendar link builder ───────────────────────────────────────────
const gCal = ({ title, start, end, allDay = true, location = "", description = "" }) => {
  const fmt = (d) => d.replace(/-/g, "");
  const dates = allDay ? `${fmt(start)}/${fmt(end)}` : `${start}/${end}`;
  const params = new URLSearchParams({ action: "TEMPLATE", text: title, dates, details: description, location });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// Build a Google Calendar invite URL pre-loaded with both guests
const gCalWithGuests = ({ title, date, startTime, endTime, location, description }) => {
  // date: "2026-07-09", startTime: "20:30", endTime: "22:30"
  const fmt = (d) => d.replace(/-/g, "");
  const pad = (s) => s.replace(":", "");
  const start = startTime ? `${fmt(date)}T${pad(startTime)}00` : fmt(date);
  const end = endTime ? `${fmt(date)}T${pad(endTime)}00` : fmt(date);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details: description || "",
    location: location || "",
    add: "nickkislinger@gmail.com,miriam@example.com",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// ─── CALENDAR EVENTS ─────────────────────────────────────────────────────────
const calendarEvents = [
  { category: "Flights", events: [
    { title: "✈️ DL 1729 · LAX → Denver", start: "20260601T201900Z", end: "20260602T054400Z", allDay: false, location: "Los Angeles International Airport", description: "Main Extra · Nonstop · Conf GS34NP · Nick Only" },
    { title: "✈️ DL 2176 · Denver → LAX", start: "20260602T203000Z", end: "20260602T230400Z", allDay: false, location: "Denver International Airport", description: "Main Extra · Nonstop · Conf GS34NP · Nick Only" },
    { title: "✈️ DL 914 · LAX → MSP", start: "20260624T193500Z", end: "20260625T011300Z", allDay: false, location: "Los Angeles International Airport", description: "Delta First · Seat 2D · Conf G4DQXX" },
    { title: "✈️ DL 162 · MSP → Amsterdam", start: "20260625T013000Z", end: "20260625T151000Z", allDay: false, location: "Minneapolis-St Paul Airport", description: "Delta One · Seat 5J · Conf G4DQXX" },
    { title: "✈️ DL 9185 · AMS → Athens", start: "20260625T102500Z", end: "20260625T143000Z", allDay: false, location: "Amsterdam Schiphol Airport", description: "KLM Economy · Seat 8F · Conf G4DQXX" },
    { title: "✈️ A3 286 · Athens → Corfu", start: "20260625T162000Z", end: "20260625T172000Z", allDay: false, location: "Athens El. Venizelos Airport", description: "Aegean Economy · Seat 12A extra legroom · Conf 8SKKV9" },
    { title: "✈️ XZ2510 · Alghero → Rome FCO", start: "20260712T051000Z", end: "20260712T061000Z", allDay: false, location: "Alghero Airport (AHO)", description: "Aeroitalia · Seat 1C · Conf N6358P · Depart villa 4:30am" },
    { title: "✈️ DL 215 · Rome FCO → Atlanta", start: "20260712T074500Z", end: "20260712T193000Z", allDay: false, location: "Rome Fiumicino T3", description: "Premium Select · Conf G4RYXA" },
    { title: "✈️ DL 500 · Atlanta → LAX", start: "20260712T210000Z", end: "20260713T033000Z", allDay: false, location: "Atlanta Hartsfield Airport", description: "Premium Select · Conf G4RYXA · Arrive LAX 7:30pm" },
    { title: "✈️ DL 1045 · LAX → Seattle", start: "20260713T190900Z", end: "20260713T215500Z", allDay: false, location: "Los Angeles International Airport", description: "SkyMiles Award · Conf JMFNIL · Nick & Miriam" },
  ]},
  { category: "Hotels", events: [
    { title: "🏨 Hotel 1000, Seattle", start: "2026-07-21", end: "2026-07-23", allDay: true, location: "1000 1st Ave, Seattle, WA", description: "Nick & Miriam · 1 King City View · Hyatt free night · Conf #40023B18869296" },
    { title: "🏝️ Dreams Corfu Resort & Spa", start: "2026-06-26", end: "2026-06-29", allDay: true, location: "Gouvia, Corfu, Greece", description: "Nick & Miriam · Bungalow Garden View · All-inclusive · Conf #42609271" },
    { title: "🏛️ Monument Athens", start: "2026-06-29", end: "2026-07-01", allDay: true, location: "Kalamida 11, Athens, Greece", description: "Nick & Miriam · Sepia room · Breakfast included · Conf #48859741" },
    { title: "🌋 Villa Don Giovanni, Taormina", start: "2026-07-01", end: "2026-07-06", allDay: true, location: "Via Nazionale - Mazzarò, Taormina, Sicily", description: "Nick + Team · Conf #6775.843.228 · PIN 4148 · Cash on arrival · Private pool" },
    { title: "🌊 Villa Cala Bitta, Sardinia", start: "2026-07-06", end: "2026-07-13", allDay: true, location: "Vaddi di Jatta 33, Arzachena, Sardinia", description: "Nick + Team · Conf #5060.372.552 · PIN 1915 · Private pool · Costa Smeralda" },
    { title: "🌲 Orcas Island Accommodation", start: "2026-07-13", end: "2026-07-19", allDay: true, location: "Orcas Island, WA", description: "Nick, Miriam + Family" },
  ]},
  { category: "Trip Segments", events: [
    { title: "🏔️ Denver, CO", start: "2026-06-01", end: "2026-06-03", allDay: true, location: "Denver, CO", description: "Nick Only · Quick trip · DL 1729/2176 · Conf GS34NP" },
    { title: "🇬🇷 Corfu, Greece", start: "2026-06-25", end: "2026-06-29", allDay: true, location: "Corfu, Greece", description: "Team base · Dreams Corfu for Nick & Miriam from Jun 26 (#42609271) · Folies for team (#5071.167.071)" },
    { title: "🏛️ Athens, Greece", start: "2026-06-29", end: "2026-07-01", allDay: true, location: "Athens, Greece", description: "Nick & Miriam · Acropolis tour · Monument Athens (#48859741)" },
    { title: "🌋 Taormina, Sicily", start: "2026-07-01", end: "2026-07-06", allDay: true, location: "Taormina, Sicily, Italy", description: "Nick + Team · Villa Don Giovanni · Client events Jul 4–5" },
    { title: "🌊 Sardinia, Italy", start: "2026-07-06", end: "2026-07-13", allDay: true, location: "Sardinia, Italy", description: "Nick + Team · Villa Cala Bitta · Client events Jul 10–11 · Miriam's birthday Jul 9" },
    { title: "🌲 Orcas Island, WA", start: "2026-07-13", end: "2026-07-19", allDay: true, location: "Orcas Island, WA", description: "Family vacation · Nick, Miriam + family" },
    { title: "🏡 Vashon — Savannah & Noah", start: "2026-07-19", end: "2026-07-21", allDay: true, location: "22032 Dockton Rd SW, Vashon, WA", description: "Visit with Savannah & Noah" },
    { title: "🏙️ Seattle — Hotel 1000", start: "2026-07-21", end: "2026-07-23", allDay: true, location: "1000 1st Ave, Seattle, WA", description: "Nick & Miriam · Molly & Miles visit · Hotel 1000 (#40023B18869296)" },
    { title: "⛰️ Aspen, CO", start: "2026-07-23", end: "2026-07-28", allDay: true, location: "Aspen, CO", description: "Nick & Miriam · Big Green Sat Jul 25" },
  ]},
  { category: "Key Events", events: [
    { title: "🍽️ Team Kickoff Dinner — Corfu", start: "20260628T180000Z", end: "20260628T210000Z", allDay: false, location: "Corfu, Greece", description: "Jenna, Genevieve, Martina, Ruben, Miriam, Nick · Restaurant TBD" },
    { title: "🎂 Miriam's Birthday", start: "2026-07-09", end: "2026-07-10", allDay: true, location: "Sardinia, Italy", description: "Special birthday day · Matsuhisa dinner 8:30pm" },
    { title: "🍽️ Matsuhisa at Cala di Volpe", start: "20260709T183000Z", end: "20260709T203000Z", allDay: false, location: "Hotel Cala di Volpe, Porto Cervo, Sardinia", description: "2 guests · 8:30–10:30pm · Conf OLBLC-7LP3473BD2KD · Formal dress code" },
    { title: "🤝 Client Events — Taormina", start: "2026-07-04", end: "2026-07-06", allDay: true, location: "Taormina, Sicily", description: "Client events Fri Jul 4 and Sat Jul 5" },
    { title: "🤝 Client Events — Sardinia", start: "2026-07-10", end: "2026-07-12", allDay: true, location: "Sardinia, Italy", description: "Client events Fri Jul 10 and Sat Jul 11" },
    { title: "🌿 Big Green — Aspen", start: "20260725T150000Z", end: "20260725T230000Z", allDay: false, location: "Aspen, CO", description: "Nick & Miriam hosting a table" },
  ]},
  { category: "Activities", events: [
    { title: "🏛️ Acropolis & Parthenon Tour", start: "2026-06-30", end: "2026-07-01", allDay: true, location: "Acropolis, Athens, Greece", description: "Book timed entry in advance · Acropolis Museum · Plaka neighborhood lunch" },
    { title: "🌋 Taormina / Mt. Etna Explore", start: "2026-07-02", end: "2026-07-04", allDay: true, location: "Taormina, Sicily", description: "Free days — explore Taormina old town, consider Mt. Etna excursion" },
    { title: "🚤 Explore Sardinia / Noto Day Trip", start: "2026-07-07", end: "2026-07-09", allDay: true, location: "Sardinia, Italy", description: "Free days — boat trips, beaches, possible Noto day trip" },
    { title: "🌲 Orcas Island — Family Vacation", start: "2026-07-13", end: "2026-07-19", allDay: true, location: "Orcas Island, WA", description: "Nick, Miriam + family · Hiking, kayaking, ferry, Rosario Resort area" },
    { title: "⛰️ Aspen — Free Days", start: "2026-07-24", end: "2026-07-28", allDay: true, location: "Aspen, CO", description: "Hiking, biking, Maroon Bells, restaurants — before/after Big Green Jul 25" },
  ]},
  { category: "Reminders", events: [
    { title: "📞 Call Villa Don Giovanni (72hrs before Jun 29)", start: "20260626T150000Z", end: "20260626T153000Z", allDay: false, location: "Phone", description: "+39 0942 24536 · Confirm arrival, €500 cash deposit, key collection" },
    { title: "📱 Aeroitalia XZ2510 Online Check-In", start: "20260712T040000Z", end: "20260712T041500Z", allDay: false, location: "Online / App", description: "Check in 3hrs before 7:10am departure (4:10am) · Free online, €35 at airport · Conf N6358P" },
    { title: "⛴️ Water Taxi — Pier 50 → Vashon", start: "20260719T165500Z", end: "20260719T172700Z", allDay: false, location: "Pier 50, Seattle, WA", description: "King County Water Taxi · Departs 9:55am · Crossing ~22 min · Return from Vashon: 10:35am, 12:00pm, 1:30pm, 3:20pm, 4:30pm, 5:50pm, 7:05pm" },
  ]},
];

// ─── ITINERARY DATA ───────────────────────────────────────────────────────────
const itinerary = [
  { date: "Mon, Jun 1", location: "Los Angeles → Denver", icon: "✈️", type: "travel", items: [
    { label: "DL 1729 · LAX 1:19pm → DEN 5:44pm · Main Extra", tag: "NICK · GS34NP", tagColor: "#5b8fa8" },
    { label: "Denver overnight" },
  ]},
  { date: "Tue, Jun 2", location: "Denver → Los Angeles", icon: "✈️", type: "travel", items: [
    { label: "DL 2176 · DEN 1:30pm → LAX 3:04pm · Main Extra", tag: "NICK · GS34NP", tagColor: "#5b8fa8" },
  ]},
  { date: "Wed, Jun 24", location: "Los Angeles → Minneapolis → Amsterdam", icon: "✈️", type: "travel", items: [
    { label: "DL 914 · LAX 12:35pm → MSP 6:13pm · Seat 2D · Delta First", tag: "NICK · G4DQXX", tagColor: "#5b8fa8" },
    { label: "DL 162 · MSP 7:50pm → Amsterdam (arrives Thu 11:10am) · Seat 5J · Delta One", tag: "NICK · G4DQXX", tagColor: "#5b8fa8" },
  ]},
  { date: "Thu, Jun 25", location: "Amsterdam → Athens → Corfu", icon: "🛬", type: "travel", items: [
    { label: "Arrive Amsterdam 11:10am" },
    { label: "DL 9185 · AMS 12:15pm → ATH 4:30pm · Seat 8F · KLM Economy", tag: "NICK · G4DQXX", tagColor: "#5b8fa8" },
    { label: "A3 286 · ATH 6:20pm → CFU 7:20pm · Seat 12A · Aegean (extra legroom)", tag: "NICK · 8SKKV9", tagColor: "#2d6a4f" },
    { label: "Arrive Corfu 7:20pm ✓" },
    { label: "Team also arrives → Folies Corfu Town Hotel Apartments · #5071.167.071" },
  ]},
  { date: "Fri, Jun 26", location: "Corfu, Greece", icon: "🏝️", type: "travel", items: [
    { label: "Nick & Miriam check in: Dreams Corfu Resort & Spa · Bungalow Garden View · 3pm", tag: "✓ #42609271", tagColor: "#2d6a4f" },
    { label: "All-inclusive · €598/night" },
  ]},
  { date: "Sat, Jun 27", location: "Corfu, Greece", icon: "🏝️", type: "free", items: [{ label: "Available — explore Corfu" }]},
  { date: "Sun, Jun 28", location: "Corfu, Greece", icon: "🍽️", type: "event", items: [
    { label: "Team Kickoff Dinner — Jenna, Genevieve, Martina, Ruben, Miriam, Nick", tag: "TEAM" },
    { label: "Restaurant: TBD — awaiting Austin", tag: "PENDING", tagColor: "#e06b3a" },
  ]},
  { date: "Mon, Jun 29", location: "Corfu → Athens (Nick & Miriam) | Team → Taormina", icon: "✈️", type: "travel", items: [
    { label: "Dreams Corfu checkout 11am" },
    { label: "Nick & Miriam: Fly CFU → ATH" },
    { label: "Check in: Monument Athens · Sepia room · 3pm", tag: "✓ #48859741", tagColor: "#2d6a4f" },
    { label: "Team: Fly CFU → CTA → Villa Don Giovanni, Taormina", tag: "✓ #6775.843.228", tagColor: "#2d6a4f" },
  ]},
  { date: "Tue, Jun 30", location: "Athens, Greece", icon: "🏛️", type: "leisure", items: [
    { label: "Acropolis & Parthenon guided tour — book timed entry in advance" },
    { label: "Acropolis Museum" },
    { label: "Plaka neighborhood — lunch below the rock" },
  ]},
  { date: "Wed, Jul 1", location: "Athens → Taormina, Sicily", icon: "✈️", type: "travel", items: [
    { label: "Morning: Ancient Agora or Monastiraki market" },
    { label: "Monument Athens checkout 11am" },
    { label: "Fly ATH → CTA → Taormina" },
    { label: "Join team at Villa Don Giovanni", tag: "✓ #6775.843.228", tagColor: "#2d6a4f" },
  ]},
  { date: "Thu, Jul 2", location: "Taormina, Sicily", icon: "🌋", type: "free", items: [{ label: "Available — Taormina / Mt. Etna" }]},
  { date: "Fri, Jul 3", location: "Taormina, Sicily", icon: "🌋", type: "free", items: [{ label: "Available — Taormina" }]},
  { date: "Sat, Jul 4", location: "Taormina, Sicily", icon: "🤝", type: "event", items: [{ label: "Client events (full day)", tag: "WORK" }]},
  { date: "Sun, Jul 5", location: "Taormina, Sicily", icon: "🤝", type: "event", items: [{ label: "Client events (full day)", tag: "WORK" }]},
  { date: "Mon, Jul 6", location: "Taormina → Sardinia", icon: "✈️", type: "travel", items: [
    { label: "Villa Don Giovanni checkout 8–10am" },
    { label: "Fly CTA → OLB/Sardinia" },
    { label: "Check in: Villa Cala Bitta, Arzachena · 5–8pm", tag: "✓ #5060.372.552", tagColor: "#2d6a4f" },
  ]},
  { date: "Tue, Jul 7", location: "Sardinia", icon: "🌊", type: "leisure", items: [{ label: "Noto day trip or explore Sardinia" }]},
  { date: "Wed, Jul 8", location: "Sardinia", icon: "🌊", type: "free", items: [{ label: "Available — explore Sardinia" }]},
  { date: "Thu, Jul 9", location: "Sardinia — Miriam's Birthday 🎂", icon: "🎂", type: "special", items: [
    { label: "🎉 Miriam's Birthday!" },
    { label: "Special birthday day — TBD activities" },
    { label: "Matsuhisa at Cala di Volpe · 8:30pm · 2 guests", tag: "✓ OLBLC-7LP3473BD2KD", tagColor: "#2d6a4f" },
  ]},
  { date: "Fri, Jul 10", location: "Sardinia", icon: "🤝", type: "event", items: [{ label: "Client events (full day)", tag: "WORK" }]},
  { date: "Sat, Jul 11", location: "Sardinia", icon: "🤝", type: "event", items: [{ label: "Client events (full day)", tag: "WORK" }]},
  { date: "Sun, Jul 12", location: "Sardinia → Rome → Los Angeles", icon: "✈️", type: "travel", items: [
    { label: "Depart Villa Cala Bitta ~4:30–5am for Alghero (130km)" },
    { label: "XZ2510 · AHO 7:10am → FCO T1 8:10am · Seat 1C", tag: "NICK · N6358P", tagColor: "#5b8fa8" },
    { label: "DL 215 · FCO T3 9:45am → ATL · Premium Select", tag: "NICK · G4RYXA", tagColor: "#5b8fa8" },
    { label: "DL 500 · ATL → LAX 7:30pm · Premium Select", tag: "NICK · G4RYXA", tagColor: "#5b8fa8" },
    { label: "Arrive home LAX ~7:30pm" },
  ]},
  { date: "Mon, Jul 13", location: "Los Angeles → Seattle → Orcas Island, WA", icon: "⛴️", type: "travel", items: [
    { label: "DL 1045 · LAX 12:09pm → SEA 2:55pm", tag: "NICK & MIRIAM · JMFNIL", tagColor: "#9b5bb5" },
    { label: "Ferry to Orcas Island · Family vacation begins" },
    { label: "Orcas Island accommodation", tag: "✓ BOOKED", tagColor: "#2d6a4f" },
  ]},
  { date: "Tue–Sat, Jul 14–18", location: "Orcas Island, WA", icon: "🌲", type: "leisure", items: [{ label: "Family vacation — Orcas Island" }]},
  { date: "Sun, Jul 19", location: "Orcas Island → Vashon Island, WA", icon: "⛴️", type: "travel", items: [
    { label: "Visit Savannah & Noah · 22032 Dockton Rd SW, Vashon, WA" },
    { label: "King County Water Taxi — Pier 50 (Seattle) → Vashon · ~22 min crossing" },
    { label: "Departs Pier 50: 9:55am · 11:15am · 12:45pm · 2:45pm · 3:55pm · 5:10pm · 6:30pm" },
    { label: "Return from Vashon: 10:35am · 12:00pm · 1:30pm · 3:20pm · 4:30pm · 5:50pm · 7:05pm", tag: "Jul 19 SCHEDULE", tagColor: "#5b8fa8" },
  ]},
  { date: "Mon, Jul 20", location: "Vashon Island — Savannah & Noah", icon: "🏡", type: "leisure", items: [
    { label: "Full day with Savannah & Noah" },
  ]},
  { date: "Tue, Jul 21", location: "Seattle, WA — Hotel 1000", icon: "🏙️", type: "leisure", items: [
    { label: "Hotel 1000 — Check-in · 4:00pm · 1000 1st Ave", tag: "✓ #40023B18869296", tagColor: "#2d6a4f" },
    { label: "Visit with Molly & Miles" },
  ]},
  { date: "Wed, Jul 22", location: "Seattle, WA", icon: "🏙️", type: "leisure", items: [
    { label: "Full day with Molly & Miles · Hotel 1000" },
  ]},
  { date: "Thu, Jul 23", location: "Seattle → Aspen, CO", icon: "⛰️", type: "travel", items: [
    { label: "Hotel 1000 checkout · Fly SEA → ASE via DEN or SLC", tag: "BOOK FLIGHT", tagColor: "#e8a735" },
    { label: "Check in: Aspen hotel", tag: "BOOK HOTEL", tagColor: "#e8a735" },
  ]},
  { date: "Fri, Jul 24", location: "Aspen, CO", icon: "🏔️", type: "free", items: [{ label: "Available — Aspen" }]},
  { date: "Sat, Jul 25", location: "Aspen, CO — Big Green", icon: "🌿", type: "special", items: [
    { label: "Big Green — Nick & Miriam hosting a table", tag: "EVENT" },
  ]},
  { date: "Sun–Mon, Jul 26–27", location: "Aspen, CO", icon: "🏔️", type: "free", items: [{ label: "Available — Aspen" }]},
];

// ─── FLIGHTS ──────────────────────────────────────────────────────────────────
const flights = [
  { direction: "LAX → DENVER", date: "Mon Jun 1", conf: "GS34NP", pax: "NICK ONLY", status: "confirmed",
    segments: [{ flight: "DL 1729", route: "LAX → DEN", depart: "1:19pm", arrive: "5:44pm", cabin: "Main Extra", seat: "—" }],
    notes: "Quick Denver trip. Returns Tue Jun 2." },
  { direction: "DENVER → LAX", date: "Tue Jun 2", conf: "GS34NP", pax: "NICK ONLY", status: "confirmed",
    segments: [{ flight: "DL 2176", route: "DEN → LAX", depart: "1:30pm", arrive: "3:04pm", cabin: "Main Extra", seat: "—" }],
    notes: "Return from Denver." },
  { direction: "OUTBOUND", date: "Wed Jun 24 → Thu Jun 25", conf: "G4DQXX", pax: "NICK ONLY", status: "confirmed",
    segments: [
      { flight: "DL 914",  route: "LAX → MSP",  depart: "12:35pm", arrive: "6:13pm",    cabin: "Delta First",    seat: "2D" },
      { flight: "DL 162",  route: "MSP → AMS",  depart: "7:50pm",  arrive: "11:10am+1", cabin: "Delta One",      seat: "5J" },
      { flight: "DL 9185", route: "AMS → ATH",  depart: "12:15pm", arrive: "4:30pm",    cabin: "KLM Economy",    seat: "8F" },
      { flight: "A3 286",  route: "ATH → CFU",  depart: "6:20pm",  arrive: "7:20pm",    cabin: "Aegean Economy", seat: "12A (XL)" },
    ], notes: "Aegean A3 286 confirmed separately (8SKKV9). Arrives Corfu 7:20pm Jun 25 ✓" },
  { direction: "SARDINIA → ROME", date: "Sun Jul 12", conf: "N6358P", pax: "NICK ONLY", status: "confirmed",
    segments: [{ flight: "XZ 2510", route: "AHO → FCO T1", depart: "7:10am", arrive: "8:10am", cabin: "Economy", seat: "1C" }],
    notes: "Depart villa ~4:30am. Online check-in required (free) — airport check-in €35." },
  { direction: "RETURN", date: "Sun Jul 12", conf: "G4RYXA", pax: "NICK ONLY", status: "confirmed",
    segments: [
      { flight: "DL 215", route: "FCO T3 → ATL", depart: "9:45am",  arrive: "~3:30pm", cabin: "Premium Select", seat: "TBD" },
      { flight: "DL 500", route: "ATL → LAX",    depart: "~5:00pm", arrive: "7:30pm",  cabin: "Premium Select", seat: "TBD" },
    ], notes: "GUC opportunity on FCO→ATL for Delta One upgrade." },
  { direction: "LAX → SEATTLE", date: "Mon Jul 13", conf: "JMFNIL", pax: "NICK & MIRIAM", status: "confirmed",
    segments: [{ flight: "DL 1045", route: "LAX → SEA", depart: "12:09pm", arrive: "2:55pm", cabin: "SkyMiles Award", seat: "—" }],
    notes: "Arrive Seattle 2:55pm → ferry to Orcas Island" },
  { direction: "PENDING", date: "Mon Jun 29", conf: null, pax: "NICK & MIRIAM", status: "pending",
    segments: [{ flight: "TBD", route: "CFU → ATH", depart: "TBD", arrive: "TBD", cabin: "Economy", seat: "—" }],
    notes: "Nick & Miriam to Athens for Monument check-in. Options: Aegean or Sky Express." },
  { direction: "PENDING", date: "Wed Jul 1", conf: null, pax: "NICK & MIRIAM", status: "pending",
    segments: [{ flight: "TBD", route: "ATH → CTA", depart: "TBD", arrive: "TBD", cabin: "Economy", seat: "—" }],
    notes: "Nick & Miriam Athens → Catania → Taormina. Options: Aegean, easyJet, Volotea." },
  { direction: "PENDING", date: "Mon Jul 6", conf: null, pax: "FULL TEAM", status: "pending",
    segments: [{ flight: "TBD", route: "CTA → OLB", depart: "TBD", arrive: "TBD", cabin: "Economy", seat: "—" }],
    notes: "Full team Catania → Olbia/Sardinia. Options: Ryanair, easyJet, Volotea." },
  { direction: "PENDING", date: "Thu Jul 23", conf: null, pax: "NICK & MIRIAM", status: "pending",
    segments: [{ flight: "TBD", route: "SEA → ASE", depart: "TBD", arrive: "TBD", cabin: "TBD", seat: "—" }],
    notes: "Seattle → Aspen via DEN or SLC. Options: United, Delta, American with connection." },
];

// ─── HOTELS ───────────────────────────────────────────────────────────────────
const hotels = [
  { name: "Folies Corfu Town Hotel Apartments", who: "TEAM", location: "Alepou Xabai, Corfu, Greece", checkin: "Thu Jun 25 · 3pm", checkout: "Mon Jun 29 · 11am", nights: 4, conf: "#5071.167.071 · PIN 1546", price: "~US$3,039 (5 studios)", status: "confirmed", cancel: "⚠️ NON-REFUNDABLE", notes: "Nick has a studio here but staying at Dreams instead." },
  { name: "Dreams Corfu Resort & Spa", who: "Nick & Miriam", location: "Gouvia, Corfu, GR 49100", checkin: "Fri Jun 26 · 3pm", checkout: "Mon Jun 29 · 11am", nights: 3, conf: "#42609271", price: "€598/night · All-inclusive", status: "confirmed", cancel: "1 day prior", notes: "Bungalow Garden View · Hyatt Discoverist" },
  { name: "Monument Athens (Mr & Mrs Smith)", who: "Nick & Miriam", location: "Kalamida 11, Athens, GR 10554", checkin: "Mon Jun 29 · 3pm", checkout: "Wed Jul 1 · 11am", nights: 2, conf: "#48859741", price: "€518/night · Breakfast included", status: "confirmed", cancel: "⚠️ 100% if cancelled within 7 days", notes: "Sepia room" },
  { name: "Villa Don Giovanni Taormina Mare", who: "Nick + Team (5 adults)", location: "Via Nazionale - Mazzarò, 98039 Taormina", checkin: "Mon Jun 29 · 3–8pm", checkout: "Mon Jul 6 · 8–10am", nights: 7, conf: "#6775.843.228 · PIN 4148", price: "~US$11,527 · No meals", status: "confirmed", cancel: "50% on cancel", notes: "⚠️ Cash on arrival · Call 72hrs before: +39 0942 24536 · €500 deposit · Nick arrives Jul 1" },
  { name: "Villa Cala Bitta, Sardinia", who: "Nick + Team (5 adults)", location: "Vaddi di Jatta 33, 07021 Arzachena", checkin: "Mon Jul 6 · 5–8pm", checkout: "Mon Jul 13 · 10am", nights: 7, conf: "#5060.372.552 · PIN 1915", price: "~US$12,329 · No meals", status: "confirmed", cancel: "⚠️ 100% after Jun 21", notes: "Private pool · Sea view · Costa Smeralda" },
  { name: "Orcas Island accommodation", who: "Nick, Miriam + Family", location: "Orcas Island, WA", checkin: "Mon Jul 13", checkout: "Sun Jul 19", nights: 6, conf: "Booked", price: "—", status: "confirmed", cancel: "—", notes: "Family vacation" },
  { name: "Hotel 1000 (Unbound Collection by Hyatt)", who: "Nick & Miriam", location: "1000 1st Ave, Seattle, WA", checkin: "Tue Jul 21 · 4pm", checkout: "Thu Jul 23 · 11am", nights: 2, conf: "#40023B18869296", price: "Hyatt free night award", status: "confirmed", cancel: "Cancel night-before by 11:59pm", notes: "1 King City View · Rosebay cocktail bar in hotel · Molly & Miles visit" },
  { name: "Aspen hotel", who: "Nick & Miriam", location: "Aspen, CO", checkin: "Thu Jul 23", checkout: "Mon Jul 27", nights: 4, conf: "—", price: "—", status: "pending", cancel: "—", notes: "Big Green Sat Jul 25" },
];

// ─── ACTION ITEMS (initial seed — runtime state handles updates) ──────────────
const initialActions = [
  { id: 1, status: "pending", label: "Online check-in for XZ2510 (3hrs before Jul 12 departure) — €35 fee at airport" },
  { id: 2, status: "pending", label: "Flight: SEA → ASE (Thu Jul 23) · Nick & Miriam" },
  { id: 3, status: "pending", label: "Aspen hotel (Jul 23–27)" },
  { id: 4, status: "pending", label: "Flight: CFU → ATH (Jun 29) — Nick & Miriam" },
  { id: 5, status: "pending", label: "Flight: ATH → CTA (Jul 1) — Nick & Miriam" },
  { id: 6, status: "pending", label: "Flight: CTA → OLB (Jul 6) — full team" },
  { id: 7, status: "pending", label: "Call Villa Don Giovanni 72hrs before Jun 29: +39 0942 24536" },
  { id: 8, status: "waiting", label: "Team dinner restaurant — awaiting Austin (Jun 28)" },
  { id: 9, status: "waiting", label: "Confirm Molly & Miles address (Jul 21–22)" },
  { id: 10, status: "done", label: "Hotel 1000, Seattle (Jul 21–23) · Conf #40023B18869296 · Hyatt free night" },
  { id: 11, status: "done", label: "DL 1729 + DL 2176 Denver trip Jun 1–2 · Conf GS34NP" },
  { id: 12, status: "done", label: "Matsuhisa · Jul 9 · 8:30–10:30pm · Conf OLBLC-7LP3473BD2KD" },
  { id: 13, status: "done", label: "Savannah & Noah · 22032 Dockton Rd SW, Vashon Island, WA" },
  { id: 14, status: "done", label: "DL 1045 LAX→SEA Jul 13 · Conf JMFNIL · Nick & Miriam" },
  { id: 15, status: "done", label: "Aegean A3 286 ATH→CFU Jun 25 · Seat 12A · Conf 8SKKV9" },
  { id: 16, status: "done", label: "Aeroitalia XZ2510 AHO→FCO Jul 12 · Seat 1C · Conf N6358P" },
  { id: 17, status: "done", label: "Return DL 215 + DL 500 FCO→ATL→LAX Jul 12 · Conf G4RYXA" },
  { id: 18, status: "done", label: "Dreams Corfu Jun 26–29 · Conf #42609271" },
  { id: 19, status: "done", label: "Monument Athens Jun 29–Jul 1 · Conf #48859741" },
  { id: 20, status: "done", label: "Folies Corfu (team) Jun 25–29 · Conf #5071.167.071" },
  { id: 21, status: "done", label: "Villa Don Giovanni Taormina Jun 29–Jul 6 · Conf #6775.843.228" },
  { id: 22, status: "done", label: "Villa Cala Bitta Sardinia Jul 6–13 · Conf #5060.372.552" },
  { id: 23, status: "done", label: "Orcas Island accommodation" },
];

// ─── STYLE CONFIG ─────────────────────────────────────────────────────────────
const PRIVATE_PW = "6116";
const typeStyles = {
  travel:  { bg: "#1a1f2e", accent: "#4a9eff", label: "TRAVEL" },
  free:    { bg: "#111418", accent: "#4a7c59", label: "OPEN" },
  event:   { bg: "#1c1610", accent: "#d4a843", label: "EVENT" },
  leisure: { bg: "#111820", accent: "#5b8fa8", label: "EXPLORE" },
  special: { bg: "#1a1020", accent: "#c47fd5", label: "SPECIAL" },
};
const tagStyle = (c) => ({ display:"inline-block", background: c||"#2d3748", color:"#fff", fontSize:"9px", fontFamily:"'DM Mono',monospace", letterSpacing:"0.12em", padding:"2px 7px", borderRadius:"3px", marginLeft:"8px", verticalAlign:"middle", fontWeight:600, textTransform:"uppercase" });
const statusCfg = {
  done:    { color:"#2d6a4f", bg:"#0d1f17", icon:"✓", text:"#52b788" },
  pending: { color:"#e8a735", bg:"#1a1508", icon:"○", text:"#e8a735" },
  waiting: { color:"#e06b3a", bg:"#1a1008", icon:"◌", text:"#e06b3a" },
};

// ─── CALENDAR GRID HELPERS ────────────────────────────────────────────────────
const MONTHS = [
  { name: "June 2026",     year: 2026, month: 5,  days: 30 },
  { name: "July 2026",     year: 2026, month: 6,  days: 31 },
  { name: "August 2026",   year: 2026, month: 7,  days: 31 },
  { name: "September 2026",year: 2026, month: 8,  days: 30 },
  { name: "October 2026",  year: 2026, month: 9,  days: 31 },
  { name: "November 2026", year: 2026, month: 10, days: 30 },
  { name: "December 2026", year: 2026, month: 11, days: 31 },
];
const MONTH_ABBR = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};

function buildDayMap() {
  const map = {};
  itinerary.forEach(day => {
    const m = day.date.match(/([A-Z][a-z]+),\s+([A-Z][a-z]+)\s+(\d+)/);
    if (!m) return;
    const monthIdx = MONTH_ABBR[m[2]];
    if (monthIdx === undefined) return;
    const key = `${2026}-${String(monthIdx+1).padStart(2,"0")}-${String(parseInt(m[3])).padStart(2,"0")}`;
    map[key] = day;
  });
  return map;
}

function getWeekDays(anchorDate) {
  const d = new Date(anchorDate);
  const dow = d.getDay();
  const sunday = new Date(d);
  sunday.setDate(d.getDate() - dow);
  return Array.from({length:7}, (_, i) => {
    const dd = new Date(sunday);
    dd.setDate(sunday.getDate() + i);
    return dd;
  });
}

function fmtKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

// ─── SEARCH HELPER ────────────────────────────────────────────────────────────
function searchAll(q) {
  if (!q || q.length < 2) return [];
  const lq = q.toLowerCase();
  const results = [];

  itinerary.forEach(day => {
    const text = `${day.date} ${day.location} ${day.items.map(i=>i.label).join(" ")}`.toLowerCase();
    if (text.includes(lq)) results.push({ type: "itinerary", icon: day.icon, title: day.location, subtitle: day.date, data: day });
  });

  flights.forEach(f => {
    const text = `${f.direction} ${f.date} ${f.conf||""} ${f.pax} ${f.segments.map(s=>s.route+" "+s.flight).join(" ")} ${f.notes}`.toLowerCase();
    if (text.includes(lq)) results.push({ type: "flight", icon: "✈️", title: f.direction + " — " + f.date, subtitle: f.conf ? "Conf " + f.conf : "Pending", data: f });
  });

  hotels.forEach(h => {
    const text = `${h.name} ${h.location} ${h.conf} ${h.who} ${h.checkin} ${h.checkout} ${h.notes}`.toLowerCase();
    if (text.includes(lq)) results.push({ type: "hotel", icon: "🏨", title: h.name, subtitle: h.checkin + " → " + h.checkout, data: h });
  });

  return results.slice(0, 12);
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function App() {
  const today = new Date();
  const todayKey = fmtKey(today);
  const dayMap = buildDayMap();

  // Core state
  const [activeTab, setActiveTab]     = useState("itinerary");
  const [pwInput, setPwInput]         = useState("");
  const [unlocked, setUnlocked]       = useState(false);
  const [pwError, setPwError]         = useState(false);
  const [calCat, setCalCat]           = useState(calendarEvents[0].category);
  const [actionItems, setActionItems] = useState(initialActions);

  // Itinerary view modes
  const [viewMode, setViewMode]       = useState("month"); // "day" | "week" | "month"
  const [selDay, setSelDay]           = useState(todayKey);
  const [weekAnchor, setWeekAnchor]   = useState(today);
  const [monthIdx, setMonthIdx]       = useState(0); // index into MONTHS

  // Search
  const [searchQ, setSearchQ]         = useState("");
  const [searchOpen, setSearchOpen]   = useState(false);
  const searchResults                 = searchAll(searchQ);

  // Add Event modal
  const [addOpen, setAddOpen]         = useState(false);
  const [form, setForm]               = useState({ title:"", date:"", startTime:"", endTime:"", location:"", description:"" });
  const [generatedLink, setGeneratedLink] = useState(null);

  // Mark done modal
  const [markingId, setMarkingId]     = useState(null);
  const [confInput, setConfInput]     = useState("");

  const pendingCount = actionItems.filter(a => a.status !== "done").length;
  const tryUnlock = () => { if (pwInput === PRIVATE_PW) { setUnlocked(true); setPwError(false); } else { setPwError(true); setPwInput(""); } };

  const tabs = [
    { key: "itinerary", label: "Itinerary" },
    { key: "flights",   label: "Flights" },
    { key: "hotels",    label: "Hotels" },
    { key: "calendar",  label: "📅 Calendar" },
    { key: "actions",   label: `Actions (${pendingCount})` },
    { key: "private",   label: "🔒 Private" },
  ];

  // Mark action done
  const markDone = (id) => {
    setActionItems(prev => prev.map(a => a.id === id
      ? { ...a, status: "done", label: confInput ? a.label + " · Conf " + confInput : a.label }
      : a
    ));
    setMarkingId(null);
    setConfInput("");
  };

  // Generate calendar invite link
  const generateLink = () => {
    if (!form.title || !form.date) return;
    setGeneratedLink(gCalWithGuests(form));
  };

  // Week navigation
  const prevWeek = () => { const d = new Date(weekAnchor); d.setDate(d.getDate()-7); setWeekAnchor(d); };
  const nextWeek = () => { const d = new Date(weekAnchor); d.setDate(d.getDate()+7); setWeekAnchor(d); };
  const goToday  = () => { setSelDay(todayKey); setWeekAnchor(today); setMonthIdx(0); };

  const weekDays = getWeekDays(weekAnchor);

  // Input style helper
  const inputStyle = { width:"100%", padding:"9px 12px", background:"#f4f7fc", border:"1px solid #d0dce8", borderRadius:6, color:"#1e2d3d", fontSize:12, fontFamily:"'DM Mono',monospace", outline:"none", boxSizing:"border-box" };

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#f8f9fb", minHeight:"100vh", color:"#1a2230" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box}
        .dc{transition:all .2s;cursor:pointer} .dc:hover{transform:translateX(2px)}
        .ir{animation:fi .15s ease}
        .tb{cursor:pointer;border:none;background:none;transition:all .15s}
        .cb{cursor:pointer;border:none;transition:all .15s;text-decoration:none} .cb:hover{opacity:.8}
        .gcell{cursor:pointer;transition:background .12s,border .12s;border-radius:5px}
        .gcell:hover{filter:brightness(1.25)}
        .btn{cursor:pointer;border:none;transition:all .15s;font-family:'DM Mono',monospace;letter-spacing:0.1em;text-transform:uppercase}
        .btn:hover{opacity:.85}
        .overlay{position:fixed;inset:0;background:#000a;display:flex;align-items:center;justify-content:center;z-index:200;padding:16px}
        .modal{background:#ffffff;border:1px solid #dde4ed;border-radius:12px;padding:24px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto}
        .sr-result:hover{background:#f0f5ff!important}
        @keyframes fi{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .fadeIn{animation:fadeIn .2s ease}
      `}</style>

      {/* ── STICKY NAV ─────────────────────────────────────────────────────── */}
      <div style={{ position:"sticky", top:0, zIndex:100, background:"#f8f9fbee", backdropFilter:"blur(10px)", borderBottom:"1px solid #dde4ed" }}>
        <div style={{ maxWidth:700, margin:"0 auto", padding:"10px 16px 0" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:18, color:"#0f1824" }}>N&M Travel</span>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#4a9eff", letterSpacing:"0.15em" }}>2026</span>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {/* Search button */}
              <button className="btn" onClick={() => setSearchOpen(true)}
                style={{ padding:"5px 12px", fontSize:9, color:"#5a6a7a", border:"1px solid #dde4ed", borderRadius:6, background:"none" }}>
                🔍 Search
              </button>
              {/* Add Event button */}
              <button className="btn" onClick={() => { setAddOpen(true); setGeneratedLink(null); setForm({ title:"", date:"", startTime:"", endTime:"", location:"", description:"" }); }}
                style={{ padding:"5px 12px", fontSize:9, color:"#4a9eff", border:"1px solid #4a9eff44", borderRadius:6, background:"#eef6ff" }}>
                + Add Event
              </button>
            </div>
          </div>
          <div style={{ display:"flex", gap:1, flexWrap:"wrap" }}>
            {tabs.map(t => (
              <button key={t.key} className="tb" onClick={() => setActiveTab(t.key)}
                style={{ padding:"7px 12px", fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", color: activeTab===t.key?"#4a9eff":"#4a5568", borderBottom: activeTab===t.key?"2px solid #4a9eff":"2px solid transparent", marginBottom:-1 }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:700, margin:"0 auto", padding:"24px 16px" }}>

        {/* ── ITINERARY TAB ──────────────────────────────────────────────────── */}
        {activeTab === "itinerary" && (
          <div>
            {/* View mode toolbar */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:8 }}>
              <div style={{ display:"flex", gap:2, background:"#ffffff", border:"1px solid #dde4ed", borderRadius:7, padding:2 }}>
                {["day","week","month"].map(m => (
                  <button key={m} className="btn" onClick={() => setViewMode(m)}
                    style={{ padding:"5px 14px", fontSize:9, borderRadius:5, background: viewMode===m?"#4a9eff22":"none", color: viewMode===m?"#4a9eff":"#4a5568", border: viewMode===m?"1px solid #4a9eff33":"1px solid transparent" }}>
                    {m.charAt(0).toUpperCase()+m.slice(1)}
                  </button>
                ))}
              </div>
              <button className="btn" onClick={goToday}
                style={{ padding:"5px 14px", fontSize:9, color:"#52b788", border:"1px solid #52b78844", borderRadius:6, background:"#edfaf3" }}>
                Today
              </button>
            </div>

            {/* ── DAY VIEW ── */}
            {viewMode === "day" && (() => {
              const dayEntry = dayMap[selDay];
              const ds = dayEntry ? (typeStyles[dayEntry.type]||typeStyles.free) : null;
              const d = new Date(selDay + "T12:00:00");
              const prevDay = () => { const pd = new Date(d); pd.setDate(d.getDate()-1); setSelDay(fmtKey(pd)); };
              const nextDay = () => { const nd = new Date(d); nd.setDate(d.getDate()+1); setSelDay(fmtKey(nd)); };
              return (
                <div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                    <button className="btn" onClick={prevDay} style={{ fontSize:16, color:"#5a6a7a", border:"none", background:"none", padding:"4px 8px" }}>‹</button>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:"#0f1824" }}>
                        {d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
                      </div>
                      {selDay===todayKey && <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#52b788", letterSpacing:"0.1em" }}>TODAY</span>}
                    </div>
                    <button className="btn" onClick={nextDay} style={{ fontSize:16, color:"#5a6a7a", border:"none", background:"none", padding:"4px 8px" }}>›</button>
                  </div>
                  {dayEntry ? (
                    <div style={{ background:ds.bg, border:`1px solid ${ds.accent}44`, borderLeft:`3px solid ${ds.accent}`, borderRadius:10, padding:"18px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                        <div>
                          <div style={{ fontSize:22 }}>{dayEntry.icon}</div>
                          <div style={{ fontSize:15, fontWeight:600, color:"#1e2d3d", marginTop:6 }}>{dayEntry.location}</div>
                        </div>
                        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:ds.accent, border:`1px solid ${ds.accent}44`, padding:"3px 8px", borderRadius:3 }}>{ds.label}</span>
                      </div>
                      {dayEntry.items.map((item, j) => (
                        <div key={j} style={{ fontSize:13, color:"#4a6070", marginBottom:8, lineHeight:1.6, borderBottom:"1px solid #ffffff08", paddingBottom:8 }}>
                          <span style={{ color:ds.accent, marginRight:6, fontSize:10 }}>▸</span>
                          {item.label}
                          {item.tag && <span style={tagStyle(item.tagColor)}>{item.tag}</span>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign:"center", padding:"48px 16px", color:"#9aaabb", fontFamily:"'DM Mono',monospace", fontSize:11 }}>
                      <div style={{ fontSize:32, marginBottom:12 }}>—</div>
                      No plans for this day
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── WEEK VIEW ── */}
            {viewMode === "week" && (() => {
              return (
                <div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                    <button className="btn" onClick={prevWeek} style={{ fontSize:16, color:"#5a6a7a", border:"none", background:"none", padding:"4px 8px" }}>‹</button>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#4a9eff", letterSpacing:"0.15em" }}>
                      {weekDays[0].toLocaleDateString("en-US",{month:"short",day:"numeric"})} – {weekDays[6].toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
                    </div>
                    <button className="btn" onClick={nextWeek} style={{ fontSize:16, color:"#5a6a7a", border:"none", background:"none", padding:"4px 8px" }}>›</button>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:4 }}>
                    {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                      <div key={d} style={{ textAlign:"center", fontFamily:"'DM Mono',monospace", fontSize:8, color:"#9aaabb", padding:"2px 0" }}>{d}</div>
                    ))}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:16 }}>
                    {weekDays.map(d => {
                      const k = fmtKey(d);
                      const entry = dayMap[k];
                      const s = entry ? (typeStyles[entry.type]||typeStyles.free) : null;
                      const isToday = k===todayKey;
                      const isSel = k===selDay;
                      return (
                        <div key={k} className="gcell" onClick={() => setSelDay(k)}
                          style={{ minHeight:54, padding:"6px 4px", textAlign:"center", background: isSel?(s?.accent+"33"||"#4a9eff22"):entry?s?.bg:"transparent", border: isSel?`1px solid ${s?.accent||"#4a9eff"}`:`1px solid ${isToday?"#4a9eff55":entry?s?.accent+"22":"#1a2030"}` }}>
                          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color: isToday?"#4a9eff":entry?s?.accent:"#2d3a4a", fontWeight: isToday?700:400 }}>{d.getDate()}</div>
                          {entry && <div style={{ fontSize:14, marginTop:2 }}>{entry.icon}</div>}
                        </div>
                      );
                    })}
                  </div>
                  {/* Selected day detail */}
                  {selDay && dayMap[selDay] && (() => {
                    const entry = dayMap[selDay];
                    const s = typeStyles[entry.type]||typeStyles.free;
                    return (
                      <div className="ir" style={{ background:s.bg, border:`1px solid ${s.accent}44`, borderLeft:`3px solid ${s.accent}`, borderRadius:8, padding:"14px 16px" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                          <div style={{ fontSize:13, fontWeight:600, color:"#1e2d3d" }}>{entry.icon} {entry.location}</div>
                          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:s.accent, border:`1px solid ${s.accent}44`, padding:"2px 6px", borderRadius:3 }}>{s.label}</span>
                        </div>
                        {entry.items.map((item, j) => (
                          <div key={j} style={{ fontSize:12, color:"#4a6070", marginBottom:5, lineHeight:1.5 }}>
                            <span style={{ color:s.accent, marginRight:5, fontSize:9 }}>▸</span>
                            {item.label}
                            {item.tag && <span style={tagStyle(item.tagColor)}>{item.tag}</span>}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                  {selDay && !dayMap[selDay] && (
                    <div style={{ textAlign:"center", padding:"24px", color:"#9aaabb", fontFamily:"'DM Mono',monospace", fontSize:10 }}>No plans for this day</div>
                  )}
                </div>
              );
            })()}

            {/* ── MONTH VIEW ── */}
            {viewMode === "month" && (() => {
              const { name, year, month, days } = MONTHS[monthIdx];
              const firstDow = new Date(year, month, 1).getDay();
              const cells = [];
              for (let i=0; i<firstDow; i++) cells.push(null);
              for (let d=1; d<=days; d++) cells.push(d);
              const keyStr = (d) => `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
              const hasTrips = Array.from({length:days},(_,i)=>i+1).some(d=>dayMap[keyStr(d)]);

              return (
                <div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
                    <button className="btn" onClick={() => setMonthIdx(Math.max(0,monthIdx-1))} style={{ fontSize:16, color: monthIdx>0?"#4a5568":"#1e2535", border:"none", background:"none", padding:"4px 8px" }}>‹</button>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#4a9eff", letterSpacing:"0.18em" }}>{name.toUpperCase()}</div>
                    <button className="btn" onClick={() => setMonthIdx(Math.min(MONTHS.length-1,monthIdx+1))} style={{ fontSize:16, color: monthIdx<MONTHS.length-1?"#4a5568":"#1e2535", border:"none", background:"none", padding:"4px 8px" }}>›</button>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, marginBottom:2 }}>
                    {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                      <div key={d} style={{ textAlign:"center", fontFamily:"'DM Mono',monospace", fontSize:8, color:"#9aaabb", padding:"2px 0" }}>{d}</div>
                    ))}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
                    {cells.map((d, ci) => {
                      if (!d) return <div key={`e${ci}`} />;
                      const k = keyStr(d);
                      const item = dayMap[k];
                      const s = item ? (typeStyles[item.type]||typeStyles.free) : null;
                      const isToday = k===todayKey;
                      const isSel = k===selDay;
                      return (
                        <div key={k} className="gcell"
                          onClick={() => { setSelDay(isSel ? null : k); }}
                          style={{ height:36, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative",
                            background: isSel?(s?.accent+"44"||"#4a9eff22"):item?s?.bg:"transparent",
                            border: isSel?`1px solid ${s?.accent||"#4a9eff"}`:`1px solid ${isToday?"#4a9eff66":item?s?.accent+"22":"transparent"}`,
                            cursor: "pointer" }}>
                          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color: isToday?"#4a9eff":item?s?.accent:"#2d3a4a", fontWeight:isToday?700:400, lineHeight:1 }}>{d}</span>
                          {item && <div style={{ fontSize:9, lineHeight:1 }}>{item.icon}</div>}
                          {isToday && <div style={{ position:"absolute", top:1, right:2, fontFamily:"'DM Mono',monospace", fontSize:5, color:"#4a9eff" }}>●</div>}
                        </div>
                      );
                    })}
                  </div>
                  {!hasTrips && <div style={{ textAlign:"center", padding:"12px 0", fontFamily:"'DM Mono',monospace", fontSize:9, color:"#c8d4e0" }}>— no trips added yet —</div>}
                  {/* Day detail panel */}
                  {selDay && dayMap[selDay] && (() => {
                    const [sy,sm,sd] = selDay.split("-").map(Number);
                    if (sm-1 !== month || sy !== year) return null;
                    const entry = dayMap[selDay];
                    const s = typeStyles[entry.type]||typeStyles.free;
                    return (
                      <div className="ir" style={{ marginTop:10, background:s.bg, border:`1px solid ${s.accent}44`, borderLeft:`3px solid ${s.accent}`, borderRadius:8, padding:"12px 14px" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                          <div style={{ fontSize:13, fontWeight:600, color:"#1e2d3d" }}>{entry.icon} {entry.location}</div>
                          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:s.accent, border:`1px solid ${s.accent}44`, padding:"2px 6px", borderRadius:3 }}>{s.label}</span>
                        </div>
                        {entry.items.map((item, j) => (
                          <div key={j} style={{ fontSize:12, color:"#4a6070", marginBottom:5, lineHeight:1.5 }}>
                            <span style={{ color:s.accent, marginRight:5, fontSize:9 }}>▸</span>
                            {item.label}
                            {item.tag && <span style={tagStyle(item.tagColor)}>{item.tag}</span>}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              );
            })()}
          </div>
        )}

        {/* ── FLIGHTS TAB ──────────────────────────────────────────────────────── */}
        {activeTab === "flights" && flights.map((f, i) => {
          const ip = f.status==="pending"; const acc = ip?"#e8a735":"#4a9eff";
          const pc = f.pax==="NICK & MIRIAM"?"#c47fd5": f.pax==="FULL TEAM"?"#d4a843":"#5b8fa8";
          return (
            <div key={i} style={{ background: ip?"#fffbf0":"#f0f6ff", border:`1px solid ${acc}33`, borderLeft:`3px solid ${acc}`, borderRadius:8, padding:"14px 16px", marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:6, marginBottom:10 }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:acc, letterSpacing:"0.18em", textTransform:"uppercase" }}>{f.direction}</span>
                    {f.pax && <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:pc, background:pc+"18", border:`1px solid ${pc}44`, padding:"2px 6px", borderRadius:3 }}>{f.pax}</span>}
                  </div>
                  <div style={{ fontSize:13, fontWeight:500, color:"#1e2d3d", marginTop:2 }}>{f.date}</div>
                </div>
                {f.conf
                  ? <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#52b788", background:"#e8f5ee", border:"1px solid #2d6a4f44", padding:"3px 8px", borderRadius:3 }}>✓ {f.conf}</span>
                  : <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#e8a735", background:"#fef9ec", border:"1px solid #e8a73544", padding:"3px 8px", borderRadius:3 }}>BOOK</span>
                }
              </div>
              {f.segments.map((seg, j) => (
                <div key={j} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:7, flexWrap:"wrap" }}>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:acc, minWidth:50 }}>{seg.flight}</span>
                  <span style={{ fontSize:14, fontWeight:600, color:"#1a2a3a" }}>{seg.route}</span>
                  <span style={{ fontSize:11, color:"#5a7080" }}>{seg.depart} → {seg.arrive}</span>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#5b8fa8", background:"#eef4fa", padding:"2px 6px", borderRadius:3 }}>{seg.cabin}</span>
                  {seg.seat!=="—" && <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#5a7080" }}>Seat {seg.seat}</span>}
                </div>
              ))}
              <div style={{ fontSize:11, color:"#6a7a8a", marginTop:6, paddingTop:6, borderTop:`1px solid ${acc}18`, fontStyle:"italic" }}>{f.notes}</div>
            </div>
          );
        })}

        {/* ── HOTELS TAB ───────────────────────────────────────────────────────── */}
        {activeTab === "hotels" && hotels.map((h, i) => {
          const ip = h.status==="pending"; const acc = ip?"#e8a735":"#52b788";
          return (
            <div key={i} style={{ background: ip?"#fffbf0":"#f0faf4", border:`1px solid ${acc}33`, borderLeft:`3px solid ${acc}`, borderRadius:8, padding:"14px 16px", marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:6, marginBottom:8 }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:"#1a3a2a" }}>{h.name}</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#5a7080", marginTop:3 }}>{h.location}</div>
                </div>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:acc, background: ip?"#fef9ec":"#e8f5ee", border:`1px solid ${acc}44`, padding:"3px 8px", borderRadius:3 }}>{ip?"TO BOOK":"✓ CONFIRMED"}</span>
              </div>
              <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginBottom:8 }}>
                {[["WHO",h.who],["CHECK-IN",h.checkin],["CHECK-OUT",h.checkout],["NIGHTS",h.nights]].map(([k,v]) => (
                  <div key={k}>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:"#4a6a5a", letterSpacing:"0.12em", marginBottom:2 }}>{k}</div>
                    <div style={{ fontSize:12, color:"#4a6070" }}>{v}</div>
                  </div>
                ))}
              </div>
              {h.conf!=="—" && <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#52b788", marginBottom:5 }}>CONF {h.conf}</div>}
              {h.price!=="—" && <div style={{ fontSize:11, color:"#5a7080", marginBottom:5 }}>{h.price}</div>}
              {h.cancel!=="—" && <div style={{ fontSize:11, color: h.cancel.includes("⚠️")?"#e8a735":"#5a6a7a", marginBottom:5 }}>{h.cancel}</div>}
              <div style={{ fontSize:11, color:"#6a7a8a", fontStyle:"italic", lineHeight:1.5 }}>{h.notes}</div>
            </div>
          );
        })}

        {/* ── CALENDAR TAB ─────────────────────────────────────────────────────── */}
        {activeTab === "calendar" && (
          <div>
            <div style={{ fontSize:13, color:"#6a7a8a", marginBottom:18, lineHeight:1.6 }}>Click any event to open Google Calendar pre-filled. Choose a category:</div>
            <div style={{ display:"flex", gap:6, marginBottom:18, flexWrap:"wrap" }}>
              {calendarEvents.map(cat => (
                <button key={cat.category} onClick={() => setCalCat(cat.category)}
                  style={{ padding:"6px 14px", fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer",
                    background: calCat===cat.category?"#4a9eff22":"#0e1116",
                    color: calCat===cat.category?"#4a9eff":"#4a5568",
                    border:`1px solid ${calCat===cat.category?"#4a9eff":"#1a2030"}`, borderRadius:6 }}>
                  {cat.category}
                </button>
              ))}
            </div>
            {calendarEvents.find(c => c.category===calCat)?.events.map((ev, i) => (
              <a key={i} href={gCal(ev)} target="_blank" rel="noopener noreferrer" className="cb"
                style={{ display:"block", background:"#ffffff", border:"1px solid #dde4ed", borderLeft:"3px solid #4a9eff", borderRadius:8, padding:"12px 16px", marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, flexWrap:"wrap" }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#1e2d3d", marginBottom:4 }}>{ev.title}</div>
                    <div style={{ fontSize:11, color:"#5b8fa8", fontFamily:"'DM Mono',monospace", marginBottom: ev.location?3:0 }}>
                      {ev.allDay!==false ? `${ev.start} → ${ev.end} · All day` : "Timed event"}
                    </div>
                    {ev.location && <div style={{ fontSize:11, color:"#4a5a6a" }}>📍 {ev.location}</div>}
                    {ev.description && <div style={{ fontSize:11, color:"#4a5a6a", marginTop:3, fontStyle:"italic" }}>{ev.description}</div>}
                  </div>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#4a9eff", background:"#e0eeff", border:"1px solid #4a9eff44", padding:"4px 10px", borderRadius:5, whiteSpace:"nowrap" }}>+ Add to Cal</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* ── ACTIONS TAB ──────────────────────────────────────────────────────── */}
        {activeTab === "actions" && (
          <div>
            {["pending","waiting","done"].map(status => {
              const items = actionItems.filter(a => a.status===status);
              if (!items.length) return null;
              const cfg = statusCfg[status];
              const labels = { pending:"To Book / Do", waiting:"Waiting On", done:"Done" };
              return (
                <div key={status} style={{ marginBottom:18 }}>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.15em", color:cfg.text, textTransform:"uppercase", marginBottom:7, display:"flex", alignItems:"center", gap:7 }}>
                    <span>{cfg.icon}</span> {labels[status]} <span style={{ color:"#8a9ab0" }}>({items.length})</span>
                  </div>
                  {items.map((item) => (
                    <div key={item.id} style={{ background:cfg.bg, border:`1px solid ${cfg.color}33`, borderLeft:`3px solid ${cfg.color}`, borderRadius:6, padding:"9px 13px", marginBottom:5, fontSize:12, color: status==="done"?"#1a5a38":"#1e2d3d", display:"flex", alignItems:"flex-start", gap:9, justifyContent:"space-between" }}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:9, flex:1 }}>
                        <span style={{ color:cfg.text, fontSize:12, minWidth:14, marginTop:1 }}>{cfg.icon}</span>
                        {item.label}
                      </div>
                      {status !== "done" && (
                        <button className="btn" onClick={() => { setMarkingId(item.id); setConfInput(""); }}
                          style={{ fontSize:8, color:"#52b788", border:"1px solid #52b78844", borderRadius:4, padding:"2px 8px", background:"#e8f5ee", flexShrink:0, marginLeft:8 }}>
                          Mark Done
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* ── PRIVATE TAB ──────────────────────────────────────────────────────── */}
        {activeTab === "private" && (
          <div>
            {!unlocked ? (
              <div style={{ maxWidth:340, margin:"60px auto", textAlign:"center" }}>
                <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
                <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:"#c47fd5", marginBottom:6 }}>Private</div>
                <div style={{ fontSize:13, color:"#6a7080", marginBottom:28, fontStyle:"italic" }}>Password protected.</div>
                <input type="password" value={pwInput} onChange={e => { setPwInput(e.target.value); setPwError(false); }} onKeyDown={e => e.key==="Enter" && tryUnlock()} placeholder="Enter password"
                  style={{ width:"100%", padding:"12px 16px", background:"#ffffff", border:`1px solid ${pwError?"#e05252":"#c8d4e0"}`, borderRadius:8, color:"#1a2230", fontSize:16, fontFamily:"'DM Mono',monospace", letterSpacing:"0.3em", textAlign:"center", outline:"none", marginBottom:8 }} />
                {pwError && <div style={{ fontSize:11, color:"#e05252", marginBottom:10 }}>Incorrect password</div>}
                <button onClick={tryUnlock} style={{ width:"100%", padding:"12px", background:"#f8f0ff", border:"1px solid #c47fd555", borderRadius:8, color:"#c47fd5", fontFamily:"'DM Mono',monospace", fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", cursor:"pointer" }}>Unlock</button>
              </div>
            ) : (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <div>
                    <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:"#c47fd5" }}>Private Plans</div>
                    <div style={{ fontSize:11, color:"#6a5a7a", fontStyle:"italic", marginTop:2 }}>Eyes only</div>
                  </div>
                  <button onClick={() => { setUnlocked(false); setPwInput(""); }} style={{ background:"none", border:"1px solid #c47fd544", borderRadius:6, color:"#c47fd5", fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.12em", padding:"5px 12px", cursor:"pointer" }}>🔒 LOCK</button>
                </div>
                <div style={{ background:"#fdf6ff", border:"1px solid #c47fd544", borderLeft:"3px solid #c47fd5", borderRadius:10, padding:"18px", marginBottom:14 }}>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.2em", color:"#c47fd5", textTransform:"uppercase", marginBottom:12 }}>🎂 Miriam's Birthday — Thu Jul 9</div>
                  <div style={{ fontSize:15, fontWeight:600, color:"#3a1a5a" }}>Matsuhisa at Cala di Volpe</div>
                  <div style={{ fontSize:12, color:"#6a4a8a", marginTop:4 }}>Thursday, 9 July · 8:30pm – 10:30pm · 2 guests</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#7a5a8a", marginTop:6 }}>Conf: OLBLC-7LP3473BD2KD</div>
                  <div style={{ fontSize:11, color:"#7a6a8a", marginTop:2 }}>Hotel Cala di Volpe · Porto Cervo · +39 0789 976632</div>
                  {[{icon:"👔",text:"Formal or smart casual · long trousers · no beach attire"},{icon:"💳",text:"Cancel 24hrs+ in advance or €150/person charged"},{icon:"📍",text:"Arrive by water taxi from Porto Cervo"}].map((n,i) => (
                    <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", background:"#f5f0fa", borderRadius:6, padding:"7px 10px", marginTop:6 }}>
                      <span style={{ fontSize:12 }}>{n.icon}</span>
                      <span style={{ fontSize:11, color:"#6a5a7a", lineHeight:1.5 }}>{n.text}</span>
                    </div>
                  ))}
                  <div style={{ borderTop:"1px solid #e8d0f8", paddingTop:14, marginTop:14 }}>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:"#7a5a8a", letterSpacing:"0.12em", marginBottom:8 }}>DAY PLAN</div>
                    {[["Morning","TBD — add activity ideas"],["Afternoon","TBD — beach / boat / spa?"],["Evening · 8:30pm","Matsuhisa at Cala di Volpe ✓"]].map(([t,n],i) => (
                      <div key={i} style={{ display:"flex", gap:12, marginBottom:8 }}>
                        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#8a6a9a", minWidth:100 }}>{t}</div>
                        <div style={{ fontSize:12, color: n.includes("TBD")?"#4a3a5a":"#c8a8e8", fontStyle: n.includes("TBD")?"italic":"normal" }}>{n}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background:"#f0f6ff", border:"1px solid #4a9eff44", borderLeft:"3px solid #4a9eff", borderRadius:10, padding:"18px" }}>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.2em", color:"#4a9eff", textTransform:"uppercase", marginBottom:12 }}>💍 The Proposal</div>
                  {[["DATE","TBD"],["LOCATION","TBD"],["DETAILS","TBD"],["RING","TBD"]].map(([k,v]) => (
                    <div key={k} style={{ display:"flex", gap:12, marginBottom:8 }}>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#3a6a9a", minWidth:70 }}>{k}</div>
                      <div style={{ fontSize:13, color:"#4a6a8a", fontStyle:"italic" }}>{v}</div>
                    </div>
                  ))}
                  <div style={{ fontSize:11, color:"#3a5a7a", fontStyle:"italic", borderTop:"1px solid #c8deff", paddingTop:10, marginTop:4 }}>Tell Claude the details to fill this in.</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── SEARCH MODAL ─────────────────────────────────────────────────────── */}
      {searchOpen && (
        <div className="overlay fadeIn" onClick={() => setSearchOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth:560 }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#4a9eff", letterSpacing:"0.15em", marginBottom:12 }}>SEARCH</div>
            <input autoFocus value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder="Search flights, hotels, dates, conf numbers..."
              style={{ ...inputStyle, fontSize:14, marginBottom:12 }} />
            {searchQ.length >= 2 && (
              <div>
                {searchResults.length === 0
                  ? <div style={{ fontSize:12, color:"#5a6a7a", padding:"12px 0", fontStyle:"italic" }}>No results found</div>
                  : searchResults.map((r, i) => (
                    <div key={i} className="sr-result" style={{ display:"flex", gap:10, alignItems:"flex-start", padding:"10px 10px", background:"#f4f7fb", border:"1px solid #dde4ed", borderRadius:6, marginBottom:6, cursor:"default" }}>
                      <span style={{ fontSize:18, minWidth:24 }}>{r.icon}</span>
                      <div>
                        <div style={{ fontSize:12, fontWeight:500, color:"#1e2d3d" }}>{r.title}</div>
                        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#4a6a7a", marginTop:2 }}>{r.type.toUpperCase()} · {r.subtitle}</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
            {searchQ.length < 2 && (
              <div style={{ fontSize:11, color:"#2a3a4a", fontStyle:"italic" }}>Type at least 2 characters to search across all itinerary, flights, and hotels</div>
            )}
            <button className="btn" onClick={() => { setSearchOpen(false); setSearchQ(""); }} style={{ marginTop:16, fontSize:9, color:"#5a6a7a", border:"1px solid #dde4ed", borderRadius:5, padding:"6px 14px", background:"none" }}>Close</button>
          </div>
        </div>
      )}

      {/* ── ADD EVENT MODAL ───────────────────────────────────────────────────── */}
      {addOpen && (
        <div className="overlay fadeIn" onClick={() => setAddOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#4a9eff", letterSpacing:"0.15em", marginBottom:4 }}>ADD EVENT</div>
            <div style={{ fontSize:11, color:"#3a5a6a", marginBottom:18, fontStyle:"italic" }}>Generates a Google Calendar link pre-loaded for Nick & Miriam</div>

            {[
              { label:"Event Name *", key:"title", type:"text", placeholder:"Dinner at Matsuhisa" },
              { label:"Date *", key:"date", type:"date", placeholder:"" },
              { label:"Start Time", key:"startTime", type:"time", placeholder:"" },
              { label:"End Time", key:"endTime", type:"time", placeholder:"" },
              { label:"Location", key:"location", type:"text", placeholder:"Porto Cervo, Sardinia" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:12 }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:"#4a6a5a", letterSpacing:"0.12em", marginBottom:5 }}>{f.label}</div>
                <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({...p, [f.key]:e.target.value}))} placeholder={f.placeholder}
                  style={inputStyle} />
              </div>
            ))}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:"#4a6a5a", letterSpacing:"0.12em", marginBottom:5 }}>Notes / Description</div>
              <textarea value={form.description} onChange={e => setForm(p => ({...p, description:e.target.value}))} rows={3}
                placeholder="Reservation details, dress code, conf number..."
                style={{ ...inputStyle, resize:"vertical", lineHeight:1.5 }} />
            </div>

            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <button className="btn" onClick={generateLink} disabled={!form.title||!form.date}
                style={{ flex:1, padding:"10px", fontSize:9, color:"#4a9eff", border:"1px solid #4a9eff55", borderRadius:7, background:"#eef6ff", opacity: (!form.title||!form.date)?0.4:1 }}>
                Generate Calendar Link
              </button>
              <button className="btn" onClick={() => setAddOpen(false)} style={{ padding:"10px 14px", fontSize:9, color:"#5a6a7a", border:"1px solid #dde4ed", borderRadius:7, background:"none" }}>Cancel</button>
            </div>

            {generatedLink && (
              <div className="ir" style={{ marginTop:16, background:"#e8f5ee", border:"1px solid #2d6a4f44", borderRadius:8, padding:"14px" }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#52b788", marginBottom:8 }}>✓ CALENDAR LINK READY</div>
                <div style={{ fontSize:11, color:"#2a6a4a", marginBottom:12, lineHeight:1.5 }}>
                  Opens Google Calendar with <strong style={{color:"#7ab890"}}>Nick & Miriam</strong> pre-added as guests. Each person will receive a calendar invite.
                </div>
                <a href={generatedLink} target="_blank" rel="noopener noreferrer"
                  style={{ display:"block", textAlign:"center", padding:"10px", background:"#d4f0e0", border:"1px solid #52b78855", borderRadius:6, color:"#52b788", fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:"0.1em", textDecoration:"none" }}>
                  → Open in Google Calendar
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MARK DONE MODAL ──────────────────────────────────────────────────── */}
      {markingId && (() => {
        const item = actionItems.find(a => a.id === markingId);
        return (
          <div className="overlay fadeIn" onClick={() => setMarkingId(null)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth:400 }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#52b788", letterSpacing:"0.15em", marginBottom:10 }}>MARK AS DONE</div>
              <div style={{ fontSize:12, color:"#5a7080", marginBottom:16, lineHeight:1.5, borderBottom:"1px solid #dde4ed", paddingBottom:16 }}>{item?.label}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:"#4a6a5a", letterSpacing:"0.12em", marginBottom:6 }}>Confirmation Number (optional)</div>
              <input autoFocus value={confInput} onChange={e => setConfInput(e.target.value)}
                onKeyDown={e => e.key==="Enter" && markDone(markingId)}
                placeholder="e.g. G4DQXX or #42609271"
                style={{ ...inputStyle, marginBottom:14 }} />
              <div style={{ display:"flex", gap:8 }}>
                <button className="btn" onClick={() => markDone(markingId)}
                  style={{ flex:1, padding:"10px", fontSize:9, color:"#52b788", border:"1px solid #52b78855", borderRadius:7, background:"#e8f5ee" }}>
                  ✓ Mark Done
                </button>
                <button className="btn" onClick={() => setMarkingId(null)} style={{ padding:"10px 14px", fontSize:9, color:"#5a6a7a", border:"1px solid #dde4ed", borderRadius:7, background:"none" }}>Cancel</button>
              </div>
            </div>
          </div>
        );
      })()}

      <div style={{ maxWidth:700, margin:"28px auto 0", padding:"0 16px 28px", textAlign:"center", fontFamily:"'DM Mono',monospace", fontSize:9, color:"#9aaabb", letterSpacing:"0.1em" }}>N&M TRAVEL · 2026 · KISLINGER IMPACT COLLECTIVE</div>
    </div>
  );
}
