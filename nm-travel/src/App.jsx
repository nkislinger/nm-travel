import { useState } from "react";

const NM_CALENDAR_ID = "0e55677b2a8c2803fb8a35b81b62f5457eafdcdc9b0bc93ec1a8596b100206c3@group.calendar.google.com";

const gCal = ({ title, start, end, allDay = true, location = "", description = "" }) => {
  const fmt = (d) => d.replace(/-/g, "");
  const dates = allDay ? `${fmt(start)}/${fmt(end)}` : `${start}/${end}`;
  const params = new URLSearchParams({ action: "TEMPLATE", text: title, dates, details: description, location, src: NM_CALENDAR_ID });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// "Today" detection — matches against itinerary date strings
const TODAY = new Date();
const MONTH = TODAY.getMonth(); // 0-indexed
const DAY = TODAY.getDate();
const itineraryDateMap = {
  "Wed, Jun 24": [5,24], "Thu, Jun 25": [5,25], "Fri, Jun 26": [5,26],
  "Sat, Jun 27": [5,27], "Sun, Jun 28": [5,28], "Mon, Jun 29": [5,29],
  "Tue, Jun 30": [5,30], "Wed, Jul 1": [6,1], "Thu, Jul 2": [6,2],
  "Fri, Jul 3": [6,3], "Sat, Jul 4": [6,4], "Sun, Jul 5": [6,5],
  "Mon, Jul 6": [6,6], "Tue, Jul 7": [6,7], "Wed, Jul 8": [6,8],
  "Thu, Jul 9": [6,9], "Fri, Jul 10": [6,10], "Sat, Jul 11": [6,11],
  "Sun, Jul 12": [6,12], "Mon, Jul 13": [6,13], "Tue–Sat, Jul 14–18": [6,14],
  "Sun, Jul 19": [6,19], "Mon, Jul 20": [6,20], "Tue, Jul 21": [6,21],
  "Wed, Jul 22": [6,22], "Thu, Jul 23": [6,23], "Fri, Jul 24": [6,24],
  "Sat, Jul 25": [6,25], "Sun–Mon, Jul 26–27": [6,26],
};
const isToday = (dateStr) => {
  const d = itineraryDateMap[dateStr];
  return d && d[0] === MONTH && d[1] === DAY;
};

const calendarEvents = [
  { category: "All", events: [] }, // populated below
  { category: "Flights", events: [
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
    { title: "🏨 Folies Corfu Town Hotel Apartments", start: "2026-06-25", end: "2026-06-29", allDay: true, location: "Alepou Xabai, Corfu, Greece", description: "Team · 5 studios · Conf #5071.167.071 · PIN 1546 · NON-REFUNDABLE" },
    { title: "🏝️ Dreams Corfu Resort & Spa", start: "2026-06-26", end: "2026-06-29", allDay: true, location: "Gouvia, Corfu, Greece", description: "Nick & Miriam · Bungalow Garden View · All-inclusive · Conf #42609271" },
    { title: "🏛️ Monument Athens", start: "2026-06-29", end: "2026-07-01", allDay: true, location: "Kalamida 11, Athens, Greece", description: "Nick & Miriam · Sepia room · Breakfast included · Conf #48859741" },
    { title: "🌋 Villa Don Giovanni, Taormina", start: "2026-07-01", end: "2026-07-06", allDay: true, location: "Via Nazionale - Mazzaro, Taormina, Sicily", description: "Nick + Team · Conf #6775.843.228 · PIN 4148 · Cash on arrival · Call +39 0942 24536 72hrs before" },
    { title: "🌊 Villa Cala Bitta, Sardinia", start: "2026-07-06", end: "2026-07-13", allDay: true, location: "Vaddi di Jatta 33, Arzachena, Sardinia", description: "Nick + Team · Conf #5060.372.552 · PIN 1915 · Private pool · Costa Smeralda" },
    { title: "🌲 Orcas Island Accommodation", start: "2026-07-13", end: "2026-07-19", allDay: true, location: "Orcas Island, WA", description: "Nick, Miriam + Family" },
    { title: "⛰️ Aspen Hotel (TBD)", start: "2026-07-23", end: "2026-07-27", allDay: true, location: "Aspen, CO", description: "Nick & Miriam · Big Green Sat Jul 25 · TO BOOK · Options: Hotel Jerome, Little Nell, Limelight" },
  ]},
  { category: "Trip Segments", events: [
    { title: "🇬🇷 Corfu, Greece", start: "2026-06-25", end: "2026-06-29", allDay: true, location: "Corfu, Greece", description: "Team base · Dreams Corfu for Nick & Miriam from Jun 26 (#42609271) · Folies for team (#5071.167.071)" },
    { title: "🏛️ Athens, Greece", start: "2026-06-29", end: "2026-07-01", allDay: true, location: "Athens, Greece", description: "Nick & Miriam · Acropolis tour · Monument Athens (#48859741)" },
    { title: "🌋 Taormina, Sicily", start: "2026-07-01", end: "2026-07-06", allDay: true, location: "Taormina, Sicily, Italy", description: "Nick + Team · Villa Don Giovanni · Client events Jul 4–5" },
    { title: "🌊 Sardinia, Italy", start: "2026-07-06", end: "2026-07-13", allDay: true, location: "Sardinia, Italy", description: "Nick + Team · Villa Cala Bitta · Client events Jul 10–11 · Miriam's birthday Jul 9" },
    { title: "🌲 Orcas Island, WA", start: "2026-07-13", end: "2026-07-19", allDay: true, location: "Orcas Island, WA", description: "Family vacation · Nick, Miriam + family" },
    { title: "🏡 Vashon — Savannah & Noah", start: "2026-07-19", end: "2026-07-21", allDay: true, location: "22032 Dockton Rd SW, Vashon, WA", description: "Visit with Savannah & Noah" },
    { title: "🏡 Molly & Miles", start: "2026-07-21", end: "2026-07-23", allDay: true, location: "TBD — confirm address", description: "Staying with Molly & Miles" },
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
    { title: "🏛️ Acropolis & Parthenon Guided Tour", start: "2026-06-30", end: "2026-07-01", allDay: true, location: "Acropolis, Athens, Greece", description: "Book timed entry in advance · Acropolis Museum · Plaka neighborhood lunch" },
    { title: "🏺 Ancient Agora / Monastiraki Market", start: "2026-07-01", end: "2026-07-02", allDay: true, location: "Monastiraki, Athens, Greece", description: "Morning before checkout from Monument Athens" },
    { title: "🌋 Taormina & Mt. Etna — Free Day", start: "2026-07-02", end: "2026-07-03", allDay: true, location: "Taormina / Mt. Etna, Sicily", description: "Available — explore Taormina or Mt. Etna excursion" },
    { title: "🌋 Taormina — Free Day", start: "2026-07-03", end: "2026-07-04", allDay: true, location: "Taormina, Sicily", description: "Available — explore Taormina" },
    { title: "🗺️ Noto Day Trip / Explore Sardinia", start: "2026-07-07", end: "2026-07-08", allDay: true, location: "Sardinia, Italy", description: "Noto day trip or explore Sardinia coastline" },
    { title: "🌊 Sardinia — Free Day", start: "2026-07-08", end: "2026-07-09", allDay: true, location: "Sardinia, Italy", description: "Available — explore Sardinia" },
    { title: "⛴️ Ferry to Orcas Island", start: "20260713T235500Z", end: "20260714T020000Z", allDay: false, location: "Anacortes Ferry Terminal, WA", description: "Nick, Miriam + family · After DL 1045 arrives SEA 2:55pm" },
    { title: "🌲 Orcas Island Family Vacation", start: "2026-07-14", end: "2026-07-19", allDay: true, location: "Orcas Island, WA", description: "Nick, Miriam + family · Hiking, kayaking, exploring" },
    { title: "🏔️ Aspen — Free Day", start: "2026-07-24", end: "2026-07-25", allDay: true, location: "Aspen, CO", description: "Available — Aspen" },
    { title: "🏔️ Aspen — Free Days", start: "2026-07-26", end: "2026-07-28", allDay: true, location: "Aspen, CO", description: "Available — Aspen" },
  ]},
  { category: "Reminders", events: [
    { title: "📞 Call Villa Don Giovanni — 72hrs Before Arrival", start: "2026-06-26", end: "2026-06-27", allDay: true, location: "", description: "Call +39 0942 24536 · Confirm arrival Jun 29 · €500 deposit · Cash on arrival reminder" },
    { title: "📱 XZ2510 Online Check-In Opens", start: "2026-07-11", end: "2026-07-12", allDay: true, location: "", description: "Online check-in for Aeroitalia XZ2510 (AHO → FCO, Jul 12 7:10am) · Free online vs €35 at airport · Do 3+ hrs before" },
    { title: "⏰ Depart Villa Cala Bitta for Alghero", start: "20260712T023000Z", end: "20260712T030000Z", allDay: false, location: "Villa Cala Bitta, Sardinia", description: "130km drive to Alghero Airport (AHO) · XZ2510 departs 7:10am · Allow 2.5hrs" },
  ]},
];

// Populate "All" category with events from all other categories sorted by start
calendarEvents[0].events = calendarEvents.slice(1).flatMap(c => c.events).sort((a, b) => a.start > b.start ? 1 : -1);

const itinerary = [
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
    { label: "Nick & Miriam: Fly CFU → ATH · check Aegean / Sky Express / easyJet", tag: "BOOK", tagColor: "#e8a735" },
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
    { label: "Fly ATH → CTA · check Aegean / Volotea / Ryanair", tag: "BOOK", tagColor: "#e8a735" },
    { label: "Join team at Villa Don Giovanni", tag: "✓ #6775.843.228", tagColor: "#2d6a4f" },
  ]},
  { date: "Thu, Jul 2", location: "Taormina, Sicily", icon: "🌋", type: "free", items: [{ label: "Available — Taormina / Mt. Etna" }]},
  { date: "Fri, Jul 3", location: "Taormina, Sicily", icon: "🌋", type: "free", items: [{ label: "Available — Taormina" }]},
  { date: "Sat, Jul 4", location: "Taormina, Sicily", icon: "🤝", type: "event", items: [{ label: "Client events (full day)", tag: "WORK" }]},
  { date: "Sun, Jul 5", location: "Taormina, Sicily", icon: "🤝", type: "event", items: [{ label: "Client events (full day)", tag: "WORK" }]},
  { date: "Mon, Jul 6", location: "Taormina → Sardinia", icon: "✈️", type: "travel", items: [
    { label: "Villa Don Giovanni checkout 8–10am" },
    { label: "Fly CTA → OLB · check Ryanair / Volotea / ITA Airways", tag: "BOOK", tagColor: "#e8a735" },
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
  ]},
  { date: "Mon, Jul 20", location: "Vashon Island — Savannah & Noah", icon: "🏡", type: "leisure", items: [
    { label: "Full day with Savannah & Noah" },
  ]},
  { date: "Tue, Jul 21", location: "→ Molly & Miles", icon: "🏡", type: "leisure", items: [
    { label: "Travel to Molly & Miles", tag: "CONFIRM ADDRESS", tagColor: "#e06b3a" },
  ]},
  { date: "Wed, Jul 22", location: "Molly & Miles", icon: "🏡", type: "leisure", items: [{ label: "Full day with Molly & Miles" }]},
  { date: "Thu, Jul 23", location: "→ Aspen, CO", icon: "⛰️", type: "travel", items: [
    { label: "Fly SEA → ASE via DEN or SLC · check Delta / United / AA", tag: "BOOK FLIGHT", tagColor: "#e8a735" },
    { label: "Check in: Aspen hotel · options: Hotel Jerome, Little Nell, Limelight", tag: "BOOK HOTEL", tagColor: "#e8a735" },
  ]},
  { date: "Fri, Jul 24", location: "Aspen, CO", icon: "🏔️", type: "free", items: [{ label: "Available — Aspen" }]},
  { date: "Sat, Jul 25", location: "Aspen, CO — Big Green", icon: "🌿", type: "special", items: [
    { label: "Big Green — Nick & Miriam hosting a table", tag: "EVENT" },
  ]},
  { date: "Sun–Mon, Jul 26–27", location: "Aspen, CO", icon: "🏔️", type: "free", items: [{ label: "Available — Aspen" }]},
];

const flights = [
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
  { direction: "CFU → ATH", date: "Mon Jun 29", conf: null, pax: "NICK & MIRIAM", status: "pending",
    segments: [{ flight: "TBD", route: "CFU → ATH", depart: "TBD", arrive: "TBD", cabin: "Economy", seat: "—" }],
    notes: "Nick & Miriam to Athens for Monument check-in 3pm. Check: Aegean / Sky Express / easyJet." },
  { direction: "ATH → CTA", date: "Wed Jul 1", conf: null, pax: "NICK & MIRIAM", status: "pending",
    segments: [{ flight: "TBD", route: "ATH → CTA", depart: "TBD", arrive: "TBD", cabin: "Economy", seat: "—" }],
    notes: "Nick & Miriam Athens → Catania → Taormina. Check: Aegean / Volotea / Ryanair." },
  { direction: "CTA → OLB", date: "Mon Jul 6", conf: null, pax: "FULL TEAM", status: "pending",
    segments: [{ flight: "TBD", route: "CTA → OLB", depart: "TBD", arrive: "TBD", cabin: "Economy", seat: "—" }],
    notes: "Full team Catania → Olbia/Sardinia. Check: Ryanair / Volotea / ITA Airways." },
  { direction: "→ ASPEN", date: "Thu Jul 23", conf: null, pax: "NICK & MIRIAM", status: "pending",
    segments: [{ flight: "TBD", route: "SEA → ASE", depart: "TBD", arrive: "TBD", cabin: "TBD", seat: "—" }],
    notes: "Vashon/Seattle → Aspen via DEN or SLC. Check: Delta / United / American." },
];

const hotels = [
  { name: "Folies Corfu Town Hotel Apartments", who: "TEAM", location: "Alepou Xabai, Corfu, Greece", checkin: "Thu Jun 25 · 3pm", checkout: "Mon Jun 29 · 11am", nights: 4, conf: "#5071.167.071 · PIN 1546", price: "~US$3,039 (5 studios)", status: "confirmed", cancel: "⚠️ NON-REFUNDABLE", notes: "Nick has a studio here but staying at Dreams instead." },
  { name: "Dreams Corfu Resort & Spa", who: "Nick & Miriam", location: "Gouvia, Corfu, GR 49100", checkin: "Fri Jun 26 · 3pm", checkout: "Mon Jun 29 · 11am", nights: 3, conf: "#42609271", price: "€598/night · All-inclusive", status: "confirmed", cancel: "1 day prior", notes: "Bungalow Garden View · Hyatt Discoverist" },
  { name: "Monument Athens (Mr & Mrs Smith)", who: "Nick & Miriam", location: "Kalamida 11, Athens, GR 10554", checkin: "Mon Jun 29 · 3pm", checkout: "Wed Jul 1 · 11am", nights: 2, conf: "#48859741", price: "€518/night · Breakfast included", status: "confirmed", cancel: "⚠️ 100% if cancelled within 7 days", notes: "Sepia room" },
  { name: "Villa Don Giovanni Taormina Mare", who: "Nick + Team (5 adults)", location: "Via Nazionale - Mazzarò, 98039 Taormina", checkin: "Mon Jun 29 · 3–8pm", checkout: "Mon Jul 6 · 8–10am", nights: 7, conf: "#6775.843.228 · PIN 4148", price: "~US$11,527 · No meals", status: "confirmed", cancel: "50% on cancel", notes: "⚠️ Cash on arrival · Call 72hrs before: +39 0942 24536 · €500 deposit · Nick arrives Jul 1" },
  { name: "Villa Cala Bitta, Sardinia", who: "Nick + Team (5 adults)", location: "Vaddi di Jatta 33, 07021 Arzachena", checkin: "Mon Jul 6 · 5–8pm", checkout: "Mon Jul 13 · 10am", nights: 7, conf: "#5060.372.552 · PIN 1915", price: "~US$12,329 · No meals", status: "confirmed", cancel: "⚠️ 100% after Jun 21", notes: "Private pool · Sea view · Costa Smeralda" },
  { name: "Orcas Island accommodation", who: "Nick, Miriam + Family", location: "Orcas Island, WA", checkin: "Mon Jul 13", checkout: "Sun Jul 19", nights: 6, conf: "Booked", price: "—", status: "confirmed", cancel: "—", notes: "Family vacation" },
  { name: "Aspen hotel", who: "Nick & Miriam", location: "Aspen, CO", checkin: "Thu Jul 23", checkout: "Mon Jul 27", nights: 4, conf: "—", price: "—", status: "pending", cancel: "—", notes: "Big Green Sat Jul 25 · Options: Hotel Jerome, Little Nell, Limelight Hotel" },
];

const actionItems = [
  { status: "pending", label: "Online check-in for XZ2510 (3hrs before Jul 12 departure) — €35 fee at airport" },
  { status: "pending", label: "Flight: SEA → ASE (Thu Jul 23) · Nick & Miriam · check Delta / United / AA" },
  { status: "pending", label: "Aspen hotel (Jul 23–27) · options: Hotel Jerome, Little Nell, Limelight" },
  { status: "pending", label: "Confirm Molly & Miles address (Jul 21–22)" },
  { status: "pending", label: "Flight: CFU → ATH (Jun 29) — Nick & Miriam · check Aegean / Sky Express / easyJet" },
  { status: "pending", label: "Flight: ATH → CTA (Jul 1) — Nick & Miriam · check Aegean / Volotea / Ryanair" },
  { status: "pending", label: "Flight: CTA → OLB (Jul 6) — full team · check Ryanair / Volotea / ITA" },
  { status: "pending", label: "Call Villa Don Giovanni 72hrs before Jun 29: +39 0942 24536" },
  { status: "waiting", label: "Team dinner restaurant — awaiting Austin (Jun 28)" },
  { status: "done",    label: "Matsuhisa · Jul 9 · 8:30–10:30pm · Conf OLBLC-7LP3473BD2KD" },
  { status: "done",    label: "Savannah & Noah · 22032 Dockton Rd SW, Vashon Island, WA" },
  { status: "done",    label: "DL 1045 LAX→SEA Jul 13 · Conf JMFNIL · Nick & Miriam" },
  { status: "done",    label: "Aegean A3 286 ATH→CFU Jun 25 · Seat 12A · Conf 8SKKV9" },
  { status: "done",    label: "Aeroitalia XZ2510 AHO→FCO Jul 12 · Seat 1C · Conf N6358P" },
  { status: "done",    label: "Return DL 215 + DL 500 FCO→ATL→LAX Jul 12 · Conf G4RYXA" },
  { status: "done",    label: "Dreams Corfu Jun 26–29 · Conf #42609271" },
  { status: "done",    label: "Monument Athens Jun 29–Jul 1 · Conf #48859741" },
  { status: "done",    label: "Folies Corfu (team) Jun 25–29 · Conf #5071.167.071" },
  { status: "done",    label: "Villa Don Giovanni Taormina Jun 29–Jul 6 · Conf #6775.843.228" },
  { status: "done",    label: "Villa Cala Bitta Sardinia Jul 6–13 · Conf #5060.372.552" },
  { status: "done",    label: "Orcas Island accommodation" },
];

const PRIVATE_PW = "6116";
const typeStyles = {
  travel:  { bg: "#1a1f2e", accent: "#4a9eff", label: "TRAVEL" },
  free:    { bg: "#111418", accent: "#4a7c59", label: "OPEN" },
  event:   { bg: "#1c1610", accent: "#d4a843", label: "EVENT" },
  leisure: { bg: "#111820", accent: "#5b8fa8", label: "EXPLORE" },
  special: { bg: "#1a1020", accent: "#c47fd5", label: "SPECIAL" },
};
const legend = [
  { color: "#4a9eff", label: "TRAVEL",  desc: "Flights & transit" },
  { color: "#4a7c59", label: "OPEN",    desc: "Free days" },
  { color: "#d4a843", label: "EVENT",   desc: "Work & dinners" },
  { color: "#5b8fa8", label: "EXPLORE", desc: "Sightseeing" },
  { color: "#c47fd5", label: "SPECIAL", desc: "Milestones" },
];
const tagStyle = (c) => ({ display:"inline-block", background: c||"#2d3748", color:"#fff", fontSize:"9px", fontFamily:"'DM Mono',monospace", letterSpacing:"0.12em", padding:"2px 7px", borderRadius:"3px", marginLeft:"8px", verticalAlign:"middle", fontWeight:600, textTransform:"uppercase" });
const statusCfg = {
  done:    { color:"#2d6a4f", bg:"#0d1f17", icon:"✓", text:"#52b788" },
  pending: { color:"#e8a735", bg:"#1a1508", icon:"○", text:"#e8a735" },
  waiting: { color:"#e06b3a", bg:"#1a1008", icon:"◌", text:"#e06b3a" },
};

export default function App() {
  const [expanded, setExpanded] = useState(null);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [pwInput, setPwInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [calCat, setCalCat] = useState("All");
  const [showLegend, setShowLegend] = useState(false);
  const toggle = (i) => setExpanded(expanded === i ? null : i);
  const pendingCount = actionItems.filter(a => a.status !== "done").length;
  const tryUnlock = () => { if (pwInput === PRIVATE_PW) { setUnlocked(true); setPwError(false); } else { setPwError(true); setPwInput(""); } };
  const tabs = [
    { key: "itinerary", label: "Itinerary" },
    { key: "flights",   label: "Flights" },
    { key: "hotels",    label: "Hotels" },
    { key: "calendar",  label: "📅 Cal" },
    { key: "actions",   label: `Actions (${pendingCount})` },
    { key: "private",   label: "🔒" },
  ];

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", background:"#0a0c10", minHeight:"100vh", padding:"28px 16px", color:"#e2e8f0" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box} .dc{transition:all .2s;cursor:pointer} .dc:hover{transform:translateX(3px)} .ir{animation:fi .15s ease} .tb{cursor:pointer;border:none;background:none;transition:all .15s} .cb{cursor:pointer;border:none;transition:all .15s;text-decoration:none} .cb:hover{opacity:.8} @keyframes fi{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ maxWidth:700, margin:"0 auto 20px" }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:"0.2em", color:"#4a9eff", textTransform:"uppercase", marginBottom:8 }}>N&amp;M TRAVEL</div>
        <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:"clamp(28px,5vw,44px)", fontWeight:400, margin:"0 0 4px", color:"#f0f4f8" }}>Travel 2026</h1>
        <div style={{ fontFamily:"'DM Serif Display',serif", fontStyle:"italic", color:"#7090a8", fontSize:15, marginBottom:16 }}>Nick & Miriam</div>
        <div style={{ display:"flex", gap:2, borderBottom:"1px solid #1a2030", flexWrap:"wrap", alignItems:"flex-end" }}>
          {tabs.map(t => (
            <button key={t.key} className="tb" onClick={() => setActiveTab(t.key)}
              style={{ padding:"8px 12px", fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color: activeTab===t.key?"#4a9eff":"#4a5568", borderBottom: activeTab===t.key?"2px solid #4a9eff":"2px solid transparent", marginBottom:-1 }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:700, margin:"0 auto" }}>

        {activeTab === "itinerary" && (
          <div>
            {/* Legend toggle */}
            <div style={{ marginBottom:14 }}>
              <button onClick={() => setShowLegend(!showLegend)} style={{ background:"none", border:"1px solid #1a2030", borderRadius:6, color:"#4a5568", fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.1em", padding:"4px 10px", cursor:"pointer" }}>
                {showLegend ? "HIDE LEGEND ▲" : "COLOR GUIDE ▾"}
              </button>
              {showLegend && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:10 }}>
                  {legend.map(l => (
                    <div key={l.label} style={{ display:"flex", alignItems:"center", gap:6, background:"#0e1116", border:`1px solid ${l.color}33`, borderLeft:`3px solid ${l.color}`, borderRadius:5, padding:"5px 10px" }}>
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:l.color, letterSpacing:"0.1em" }}>{l.label}</span>
                      <span style={{ fontSize:10, color:"#5a6a7a" }}>{l.desc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Timeline */}
            <div style={{ position:"relative" }}>
              <div style={{ position:"absolute", left:22, top:0, bottom:0, width:1, background:"linear-gradient(to bottom,#1e3a5f,#2d1a4a,#0a0c10)", pointerEvents:"none" }} />
              {itinerary.map((day, i) => {
                const s = typeStyles[day.type]||typeStyles.free;
                const open = expanded===i;
                const today = isToday(day.date);
                return (
                  <div key={i} className="dc" onClick={() => toggle(i)} style={{ display:"flex", gap:14, marginBottom:5, position:"relative", zIndex:1 }}>
                    <div style={{ width:44, height:44, minWidth:44, borderRadius:"50%", background: today?"#1a2f1a":s.bg, border:`1.5px solid ${today?"#52b788":open?s.accent:"#1e2535"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, boxShadow: today?"0 0 14px #52b78866":open?`0 0 12px ${s.accent}44`:"none" }}>{day.icon}</div>
                    <div style={{ flex:1, background: today?"#0d1a0d":open?s.bg:"#0e1116", border:`1px solid ${today?"#52b78855":open?s.accent+"55":"#1a2030"}`, borderRadius:8, padding:"9px 13px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:3, alignItems:"flex-start" }}>
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:today?"#52b788":s.accent, letterSpacing:"0.15em", textTransform:"uppercase" }}>{day.date}</span>
                            {today && <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:"#52b788", background:"#0d2a0d", border:"1px solid #52b78844", padding:"1px 6px", borderRadius:3 }}>TODAY</span>}
                          </div>
                          <div style={{ fontWeight:500, fontSize:13, marginTop:2, color:"#d0dce8", lineHeight:1.3 }}>{day.location}</div>
                        </div>
                        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:today?"#52b788":s.accent, border:`1px solid ${today?"#52b78844":s.accent+"44"}`, padding:"2px 6px", borderRadius:3 }}>{s.label}</span>
                      </div>
                      {open && (
                        <div style={{ marginTop:9, borderTop:`1px solid ${today?"#52b78822":s.accent+"22"}`, paddingTop:9 }}>
                          {day.items.map((item, j) => (
                            <div key={j} className="ir" style={{ fontSize:12, color:"#94a3b8", marginBottom:5, lineHeight:1.5 }}>
                              <span style={{ color:today?"#52b788":s.accent, marginRight:5, fontSize:9 }}>▸</span>
                              {item.label}
                              {item.tag && <span style={tagStyle(item.tagColor)}>{item.tag}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "flights" && flights.map((f, i) => {
          const ip = f.status==="pending"; const acc = ip?"#e8a735":"#4a9eff";
          const pc = f.pax==="NICK & MIRIAM"?"#c47fd5": f.pax==="FULL TEAM"?"#d4a843":"#5b8fa8";
          return (
            <div key={i} style={{ background: ip?"#141008":"#0e1420", border:`1px solid ${acc}33`, borderLeft:`3px solid ${acc}`, borderRadius:8, padding:"14px 16px", marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:6, marginBottom:10 }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:acc, letterSpacing:"0.18em", textTransform:"uppercase" }}>{f.direction}</span>
                    {f.pax && <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:pc, background:pc+"18", border:`1px solid ${pc}44`, padding:"2px 6px", borderRadius:3 }}>{f.pax}</span>}
                  </div>
                  <div style={{ fontSize:13, fontWeight:500, color:"#d0dce8", marginTop:2 }}>{f.date}</div>
                </div>
                {f.conf
                  ? <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#52b788", background:"#0d1f17", border:"1px solid #2d6a4f44", padding:"3px 8px", borderRadius:3 }}>✓ {f.conf}</span>
                  : <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#e8a735", background:"#1a1508", border:"1px solid #e8a73544", padding:"3px 8px", borderRadius:3 }}>BOOK</span>
                }
              </div>
              {/* Mobile-friendly two-line segment layout */}
              {f.segments.map((seg, j) => (
                <div key={j} style={{ background:"#ffffff08", borderRadius:6, padding:"8px 10px", marginBottom:6 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:acc, minWidth:60 }}>{seg.flight}</span>
                    <span style={{ fontSize:14, fontWeight:600, color:"#e0e8f0" }}>{seg.route}</span>
                  </div>
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
                    <span style={{ fontSize:12, color:"#7090a8" }}>{seg.depart} → {seg.arrive}</span>
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#5b8fa8", background:"#0e1820", padding:"2px 6px", borderRadius:3 }}>{seg.cabin}</span>
                    {seg.seat!=="—" && <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#5a6a7a" }}>Seat {seg.seat}</span>}
                  </div>
                </div>
              ))}
              <div style={{ fontSize:11, color:"#5a6a7a", marginTop:6, paddingTop:6, borderTop:`1px solid ${acc}18`, fontStyle:"italic" }}>{f.notes}</div>
            </div>
          );
        })}

        {activeTab === "hotels" && hotels.map((h, i) => {
          const ip = h.status==="pending"; const acc = ip?"#e8a735":"#52b788";
          return (
            <div key={i} style={{ background: ip?"#141008":"#0d1510", border:`1px solid ${acc}33`, borderLeft:`3px solid ${acc}`, borderRadius:8, padding:"14px 16px", marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:6, marginBottom:8 }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:"#d4e8d4" }}>{h.name}</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#7090a8", marginTop:3 }}>{h.location}</div>
                </div>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:acc, background: ip?"#1a1508":"#0d1f17", border:`1px solid ${acc}44`, padding:"3px 8px", borderRadius:3 }}>{ip?"TO BOOK":"✓ CONFIRMED"}</span>
              </div>
              <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginBottom:8 }}>
                {[["WHO",h.who],["CHECK-IN",h.checkin],["CHECK-OUT",h.checkout],["NIGHTS",h.nights]].map(([k,v]) => (
                  <div key={k}>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:"#4a6a5a", letterSpacing:"0.12em", marginBottom:2 }}>{k}</div>
                    <div style={{ fontSize:12, color:"#94a3b8" }}>{v}</div>
                  </div>
                ))}
              </div>
              {h.conf!=="—" && <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#52b788", marginBottom:5 }}>CONF {h.conf}</div>}
              {h.price!=="—" && <div style={{ fontSize:11, color:"#7090a8", marginBottom:5 }}>{h.price}</div>}
              {h.cancel!=="—" && <div style={{ fontSize:11, color: h.cancel.includes("⚠️")?"#e8a735":"#5a6a7a", marginBottom:5 }}>{h.cancel}</div>}
              <div style={{ fontSize:11, color:"#5a6a7a", fontStyle:"italic", lineHeight:1.5 }}>{h.notes}</div>
            </div>
          );
        })}

        {activeTab === "calendar" && (
          <div>
            <div style={{ fontSize:12, color:"#5a6a7a", marginBottom:14, lineHeight:1.6 }}>
              Tap any event to add to the N&M Travel calendar.
            </div>
            {/* Category filters */}
            <div style={{ display:"flex", gap:5, marginBottom:16, flexWrap:"wrap" }}>
              {calendarEvents.map(cat => (
                <button key={cat.category} onClick={() => setCalCat(cat.category)}
                  style={{ padding:"5px 12px", fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer",
                    background: calCat===cat.category?"#4a9eff22":"#0e1116",
                    color: calCat===cat.category?"#4a9eff":"#4a5568",
                    border:`1px solid ${calCat===cat.category?"#4a9eff":"#1a2030"}`, borderRadius:6 }}>
                  {cat.category} {cat.category==="All"?"":""}
                </button>
              ))}
            </div>
            {calendarEvents.find(c => c.category===calCat)?.events.map((ev, i) => (
              <a key={i} href={gCal(ev)} target="_blank" rel="noopener noreferrer" className="cb"
                style={{ display:"block", background:"#0e1116", border:"1px solid #1a2030", borderLeft:"3px solid #4a9eff", borderRadius:8, padding:"11px 14px", marginBottom:7 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:"#d0dce8", marginBottom:3 }}>{ev.title}</div>
                    <div style={{ fontSize:10, color:"#5b8fa8", fontFamily:"'DM Mono',monospace" }}>
                      {ev.allDay!==false ? `${ev.start}` : "Timed"}
                    </div>
                    {ev.location && <div style={{ fontSize:10, color:"#4a5a6a", marginTop:2 }}>📍 {ev.location}</div>}
                  </div>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:"#4a9eff", background:"#0e1f30", border:"1px solid #4a9eff44", padding:"4px 8px", borderRadius:5, whiteSpace:"nowrap", flexShrink:0 }}>+ ADD</span>
                </div>
              </a>
            ))}
          </div>
        )}

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
                    <span>{cfg.icon}</span> {labels[status]} <span style={{ color:"#2d3748" }}>({items.length})</span>
                  </div>
                  {items.map((item, i) => (
                    <div key={i} style={{ background:cfg.bg, border:`1px solid ${cfg.color}33`, borderLeft:`3px solid ${cfg.color}`, borderRadius:6, padding:"9px 13px", marginBottom:5, fontSize:12, color: status==="done"?"#52876e":"#c0c8d8", display:"flex", alignItems:"flex-start", gap:9 }}>
                      <span style={{ color:cfg.text, fontSize:12, minWidth:14, marginTop:1 }}>{cfg.icon}</span>
                      {item.label}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "private" && (
          <div>
            {!unlocked ? (
              <div style={{ maxWidth:340, margin:"60px auto", textAlign:"center" }}>
                <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
                <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:"#c47fd5", marginBottom:6 }}>Private</div>
                <div style={{ fontSize:13, color:"#5a6070", marginBottom:28, fontStyle:"italic" }}>Password protected.</div>
                <input type="password" value={pwInput} onChange={e => { setPwInput(e.target.value); setPwError(false); }} onKeyDown={e => e.key==="Enter" && tryUnlock()} placeholder="Enter password"
                  style={{ width:"100%", padding:"12px 16px", background:"#0e1116", border:`1px solid ${pwError?"#e05252":"#2a3040"}`, borderRadius:8, color:"#e2e8f0", fontSize:16, fontFamily:"'DM Mono',monospace", letterSpacing:"0.3em", textAlign:"center", outline:"none", boxSizing:"border-box", marginBottom:8 }} />
                {pwError && <div style={{ fontSize:11, color:"#e05252", marginBottom:10 }}>Incorrect password</div>}
                <button onClick={tryUnlock} style={{ width:"100%", padding:"12px", background:"#1a1020", border:"1px solid #c47fd555", borderRadius:8, color:"#c47fd5", fontFamily:"'DM Mono',monospace", fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", cursor:"pointer" }}>Unlock</button>
              </div>
            ) : (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <div>
                    <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:"#c47fd5" }}>Private Plans</div>
                    <div style={{ fontSize:11, color:"#5a4a6a", fontStyle:"italic", marginTop:2 }}>Eyes only</div>
                  </div>
                  {/* More prominent lock button */}
                  <button onClick={() => { setUnlocked(false); setPwInput(""); }} style={{ background:"#1a1020", border:"1px solid #c47fd5", borderRadius:8, color:"#c47fd5", fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:"0.12em", padding:"8px 16px", cursor:"pointer" }}>🔒 LOCK</button>
                </div>
                <div style={{ background:"#120a1a", border:"1px solid #c47fd544", borderLeft:"3px solid #c47fd5", borderRadius:10, padding:"18px", marginBottom:14 }}>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.2em", color:"#c47fd5", textTransform:"uppercase", marginBottom:12 }}>🎂 Miriam's Birthday — Thu Jul 9</div>
                  <div style={{ fontSize:15, fontWeight:600, color:"#e0c8f0" }}>Matsuhisa at Cala di Volpe</div>
                  <div style={{ fontSize:12, color:"#9a7ab0", marginTop:4 }}>Thursday, 9 July · 8:30pm – 10:30pm · 2 guests</div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#7a5a8a", marginTop:6 }}>Conf: OLBLC-7LP3473BD2KD</div>
                  <div style={{ fontSize:11, color:"#6a5a7a", marginTop:2 }}>Hotel Cala di Volpe · Porto Cervo · +39 0789 976632</div>
                  {[{icon:"👔",text:"Formal or smart casual · long trousers · no beach attire"},{icon:"💳",text:"Cancel 24hrs+ in advance or €150/person charged"},{icon:"📍",text:"Arrive by water taxi from Porto Cervo"}].map((n,i) => (
                    <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", background:"#0d0814", borderRadius:6, padding:"7px 10px", marginTop:6 }}>
                      <span style={{ fontSize:12 }}>{n.icon}</span>
                      <span style={{ fontSize:11, color:"#8a7a9a", lineHeight:1.5 }}>{n.text}</span>
                    </div>
                  ))}
                  <div style={{ borderTop:"1px solid #c47fd522", paddingTop:14, marginTop:14 }}>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:"#7a5a8a", letterSpacing:"0.12em", marginBottom:8 }}>DAY PLAN</div>
                    {[["Morning","TBD — add activity ideas"],["Afternoon","TBD — beach / boat / spa?"],["Evening · 8:30pm","Matsuhisa at Cala di Volpe ✓"]].map(([t,n],i) => (
                      <div key={i} style={{ display:"flex", gap:12, marginBottom:8 }}>
                        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#8a6a9a", minWidth:100 }}>{t}</div>
                        <div style={{ fontSize:12, color: n.includes("TBD")?"#4a3a5a":"#c8a8e8", fontStyle: n.includes("TBD")?"italic":"normal" }}>{n}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background:"#0a0f16", border:"1px solid #4a9eff44", borderLeft:"3px solid #4a9eff", borderRadius:10, padding:"18px" }}>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.2em", color:"#4a9eff", textTransform:"uppercase", marginBottom:12 }}>💍 The Proposal</div>
                  {[["DATE","TBD"],["LOCATION","TBD"],["DETAILS","TBD"],["RING","TBD"]].map(([k,v]) => (
                    <div key={k} style={{ display:"flex", gap:12, marginBottom:8 }}>
                      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#3a6a9a", minWidth:70 }}>{k}</div>
                      <div style={{ fontSize:13, color:"#4a6a8a", fontStyle:"italic" }}>{v}</div>
                    </div>
                  ))}
                  <div style={{ fontSize:11, color:"#2a4a6a", fontStyle:"italic", borderTop:"1px solid #4a9eff18", paddingTop:10, marginTop:4 }}>Tell Claude the details to fill this in.</div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
      <div style={{ maxWidth:700, margin:"28px auto 0", textAlign:"center", fontFamily:"'DM Mono',monospace", fontSize:9, color:"#2d3a4a", letterSpacing:"0.1em" }}>N&amp;M TRAVEL · 2026</div>
    </div>
  );
}
