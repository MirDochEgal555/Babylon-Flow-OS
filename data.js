const BABYLON_PEOPLE = [
  { id: 'philipp', name: 'Philipp', alias: 'P TO THE K', animal: 'CAT', accent: 'lime', stock: 128.4, stats: { aura: 72, reliability: 63, spanish: 66, chaos: 57, fiscal: 42, ibiza: 78, appeal: 71, xp: 840 } },
  { id: 'ainhoa', name: 'Ainhoa', alias: 'AINHOA', animal: 'BEER', accent: 'pink', stock: 119.7, stats: { aura: 76, reliability: 68, spanish: 98, chaos: 54, fiscal: 61, ibiza: 71, appeal: 75, xp: 720 } },
  { id: 'nerea', name: 'Nerea', alias: 'NEREA', animal: 'NIGHT OWL', accent: 'violet', stock: 96.2, stats: { aura: 70, reliability: 54, spanish: 94, chaos: 68, fiscal: 56, ibiza: 74, appeal: 73, xp: 690 } },
  { id: 'tibi', name: 'Tibi', alias: 'TIBI', animal: 'DOG', accent: 'orange', stock: 141.8, stats: { aura: 74, reliability: 47, spanish: 48, chaos: 79, fiscal: 39, ibiza: 82, appeal: 68, xp: 930 } },
  { id: 'luisa', name: 'Luisa', alias: 'LUUL', animal: 'STAR', accent: 'blue', stock: 111.3, stats: { aura: 73, reliability: 71, spanish: 62, chaos: 51, fiscal: 66, ibiza: 68, appeal: 74, xp: 650 } },
  { id: 'sven', name: 'Sven', alias: 'WAGGERBAGGER', animal: 'ELEPHANT', accent: 'yellow', stock: 84.6, stats: { aura: 59, reliability: 38, spanish: 36, chaos: 86, fiscal: 31, ibiza: 75, appeal: 57, xp: 890 } },
  { id: 'robin', name: 'Robin', alias: 'ROGER', animal: 'LION', accent: 'red', stock: 107.9, stats: { aura: 77, reliability: 51, spanish: 57, chaos: 72, fiscal: 45, ibiza: 80, appeal: 82, xp: 810 } },
  { id: 'marvin', name: 'Marvin', alias: 'MARVIN', animal: 'UNCLASSIFIED', accent: 'blue', status: 'inactive', stock: 0, stats: { aura: 0, reliability: 0, spanish: 0, chaos: 0, fiscal: 0, ibiza: 0, appeal: 0, xp: 0 } },
  { id: 'ruben', name: 'Ruben', alias: 'RUBEN', animal: 'UNCLASSIFIED', accent: 'pink', status: 'inactive', stock: 0, stats: { aura: 0, reliability: 0, spanish: 0, chaos: 0, fiscal: 0, ibiza: 0, appeal: 0, xp: 0 } },
  { id: 'jan', name: 'Jan', alias: 'JAN', animal: 'UNCLASSIFIED', accent: 'orange', status: 'inactive', stock: 0, stats: { aura: 0, reliability: 0, spanish: 0, chaos: 0, fiscal: 0, ibiza: 0, appeal: 0, xp: 0 } },
  { id: 'nico', name: 'Nico', alias: 'NICO', animal: 'UNCLASSIFIED', accent: 'lime', status: 'inactive', stock: 0, stats: { aura: 0, reliability: 0, spanish: 0, chaos: 0, fiscal: 0, ibiza: 0, appeal: 0, xp: 0 } },
  { id: 'taeyong', name: 'Taeyong', alias: 'TAEYONG', animal: 'UNCLASSIFIED', accent: 'blue', status: 'inactive', stock: 0, stats: { aura: 0, reliability: 0, spanish: 0, chaos: 0, fiscal: 0, ibiza: 0, appeal: 0, xp: 0 } },
  { id: 'naehwan', name: 'Naehwan', alias: 'NAEHWAN', animal: 'UNCLASSIFIED', accent: 'pink', status: 'inactive', stock: 0, stats: { aura: 0, reliability: 0, spanish: 0, chaos: 0, fiscal: 0, ibiza: 0, appeal: 0, xp: 0 } }
];

const BABYLON_EVENTS = [
  { id: 'seed-1', type: 'LEGENDARY', title: 'The 24-hour Ibiza operation', description: 'A brief field visit generated an amount of lore usually reserved for a full fiscal quarter.', location: 'IBIZA', people: ['tibi', 'sven', 'robin'], time: '23 SEP · 05:42', change: '+180 XP', seed: true },
  { id: 'seed-2', type: 'POOL PARTY', title: 'International relations established', description: 'The German connection successfully reached the pool. Diplomatic outcomes remain classified.', location: 'JÁVEA HQ', people: ['philipp', 'ainhoa', 'nerea'], time: '20 SEP · 16:18', change: '+55 AURA', seed: true },
  { id: 'seed-3', type: 'RANDOM LORE', title: 'Single-shoe collection expands', description: 'A swimming shoe has entered the archive. The collection now has two entries and no explanation.', location: 'MOLY PARKING', people: ['sven', 'tibi'], time: '18 SEP · 03:07', change: '+1 SHOE', seed: true }
];

const BABYLON_QUOTES = [
  { id: 'quote-1', quote: 'Crazy Ass.', speaker: 'Daniel', context: 'Ordering assistance', time: 'ARCHIVE' },
  { id: 'quote-2', quote: 'Woisch oldr.', speaker: 'Marvin', context: 'A complete sentence, allegedly', time: 'ARCHIVE' }
];

const BABYLON_QUESTS = [
  { mission: 'Get a stranger to rate the group’s Spanish pronunciation with a completely serious scorecard.', place: 'ANYWHERE', rarity: 'RARE', xp: 90 },
  { mission: 'Find the most suspicious object at the beach and give it an official Babylon name.', place: 'BEACH', rarity: 'COMMON', xp: 45 },
  { mission: 'Order a non-alcoholic drink in Spanish with no English emergency exit.', place: 'BAR', rarity: 'EPIC', xp: 110 },
  { mission: 'Create a two-person entrance song and use it for one room entry.', place: 'HOUSE', rarity: 'COMMON', xp: 55 },
  { mission: 'Convince the group that a totally normal moment is a historical Babylon milestone.', place: 'PREGAME', rarity: 'RARE', xp: 85 },
  { mission: 'Locate a new candidate for the single-shoe archive. Observe only. Do not acquire property.', place: 'ANYWHERE', rarity: 'LEGENDARY', xp: 140 },
  { mission: 'Invent an unnecessarily specific toast for the next round.', place: 'CLUB', rarity: 'COMMON', xp: 50 },
  { mission: 'Ask for the local recommendation, then actually follow it.', place: 'RESTAURANT', rarity: 'RARE', xp: 80 }
];

const COURT_SENTENCES = [
  'Speak only Spanish for the next 15 minutes.',
  'Become El Trafficante for the next round.',
  'Deliver a dramatic 30-second apology to Babylon Flow.',
  'Use “Crazy Ass” instead of “Gracias” once. Carefully.',
  'Become responsible for the next group photo.',
  'Let the group select your next non-alcoholic snack.'
];

const BABYLON_WHEEL = [
  { text: 'ORDER FOR SOMEONE ELSE — no consultation, no mercy.' },
  { text: 'SPEAK ONLY SPANISH FOR 30 MINUTES.' },
  { text: 'CHOOSE THE NEXT DESTINATION. The group must obey.' },
  { text: 'WEAR SOMEONE ELSE’S SHIRT FOR THE NEXT LOCATION.' },
  { text: 'GIVE A STRANGER A 30-SECOND BABYLON SALES PITCH.' },
  { text: 'BECOME GROUP PHOTOGRAPHER UNTIL FURTHER NOTICE.' },
  { text: 'CREATE A NEW TOAST. Everyone must use it once.' },
  { text: 'TRADE ONE ACCESSORY WITH THE PERSON TO YOUR LEFT.' },
  { text: 'YOU ARE NAVIGATION. No maps, only confidence.', legendary: true },
  { text: 'LEGENDARY: DECLARE A HISTORICAL INCIDENT AND MAKE THE SPEECH.', legendary: true }
];

const BABYLON_HEADLINES = [
  'P TO THE K upgraded after confident Spanish interaction; analysts question methodology.',
  'WAGGERBAGGER shares slide on renewed wallet-security concerns.',
  'LUUL holds steady as board praises “quietly elite logistics.”',
  'TIBI volatility rises; investors urged to keep a safe distance from the aux cord.',
  'ROGER gains on late-night resilience despite deteriorating sleep fundamentals.'
];

const BABYLON_DUOS = [
  'Find the best local snack under €6 and deliver an investor-grade tasting report.',
  'Get a photo with something that looks like it has its own lore.',
  'Create a two-person entrance and deploy it at the next venue.',
  'Ask one local for a recommendation, then follow it without group-chat interference.',
  'Return with a verified piece of evidence that the group was here.'
];

const BABYLON_NPCS = [
  { id: 'npc-seed-1', nickname: 'The Pool Boy', nationality: 'GERMAN / 60 YEARS OLD', where: 'JÁVEA HQ POOL', danger: 'LOW / EARLY SHIFT', lore: 'Cleans the pool every Tuesday and Saturday before sunrise. Nobody has seen him because everyone is still asleep.', quest: 'Wake up early enough to verify the legend.', odds: '100% / TUESDAY + SATURDAY' }
];

// Checked-in master record. This is deliberately separate from the browser
// archive: it is the portable baseline we update when an emailed field report
// is added to the project.
const BABYLON_ARCHIVE = {
  schemaVersion: 1,
  updatedAt: '2026-09-16T00:00:00.000Z',
  source: 'BABYLON FLOW / CANONICAL LEDGER',
  people: BABYLON_PEOPLE,
  events: BABYLON_EVENTS,
  quotes: BABYLON_QUOTES,
  npcs: BABYLON_NPCS,
  morningReports: [],
  duoHistory: [],
  auditLog: []
};
