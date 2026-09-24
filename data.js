const BABYLON_PEOPLE = [
  { id: 'philipp', name: 'Philipp', alias: 'P TO THE K', animal: 'CAT', accent: 'lime', stock: 128.4, stats: { aura: 72, reliability: 63, spanish: 66, chaos: 57, fiscal: 42, ibiza: 78, appeal: 71, xp: 890 } },
  { id: 'ainhoa', name: 'Ainhoa', alias: 'AINHOA', animal: 'BEER', accent: 'pink', stock: 119.7, stats: { aura: 76, reliability: 68, spanish: 98, chaos: 54, fiscal: 61, ibiza: 71, appeal: 75, xp: 770 } },
  { id: 'nerea', name: 'Nerea', alias: 'NEREA', animal: 'NIGHT OWL', accent: 'violet', stock: 96.2, stats: { aura: 70, reliability: 54, spanish: 94, chaos: 68, fiscal: 56, ibiza: 74, appeal: 73, xp: 690 } },
  { id: 'tibi', name: 'Tibi', alias: 'TIBI', animal: 'DOG', accent: 'orange', stock: 141.8, stats: { aura: 74, reliability: 47, spanish: 48, chaos: 79, fiscal: 39, ibiza: 82, appeal: 68, xp: 930 } },
  { id: 'luisa', name: 'Luisa', alias: 'LUUL', animal: 'STAR', accent: 'blue', stock: 111.3, stats: { aura: 73, reliability: 71, spanish: 62, chaos: 51, fiscal: 66, ibiza: 68, appeal: 74, xp: 650 } },
  { id: 'sven', name: 'Sven', alias: 'WAGGERBAGGER', animal: 'ELEPHANT', accent: 'yellow', stock: 84.6, stats: { aura: 59, reliability: 38, spanish: 36, chaos: 86, fiscal: 31, ibiza: 75, appeal: 57, xp: 890 } },
  { id: 'robin', name: 'Robin', alias: 'ROGER', animal: 'LION', accent: 'red', stock: 107.9, stats: { aura: 77, reliability: 51, spanish: 57, chaos: 72, fiscal: 45, ibiza: 80, appeal: 82, xp: 810 } },
  { id: 'marvin', name: 'Marvin', alias: 'MARVIN', animal: 'WOLF', accent: 'blue', stock: 103.6, stats: { aura: 69, reliability: 58, spanish: 44, chaos: 73, fiscal: 52, ibiza: 76, appeal: 70, xp: 720 } },
  { id: 'ruben', name: 'Ruben', alias: 'RUBEN', animal: 'FALCON', accent: 'pink', stock: 115.2, stats: { aura: 75, reliability: 67, spanish: 82, chaos: 55, fiscal: 64, ibiza: 69, appeal: 77, xp: 780 } },
  { id: 'jan', name: 'Jan', alias: 'JAN', animal: 'OTTER', accent: 'orange', stock: 98.4, stats: { aura: 66, reliability: 62, spanish: 53, chaos: 64, fiscal: 59, ibiza: 72, appeal: 68, xp: 690 } },
  { id: 'nico', name: 'Nico', alias: 'NICO', animal: 'GECKO', accent: 'lime', stock: 109.8, stats: { aura: 71, reliability: 56, spanish: 71, chaos: 67, fiscal: 48, ibiza: 77, appeal: 74, xp: 750 } },
  { id: 'taeyong', name: 'Taeyong', alias: 'TAEYONG', animal: 'TIGER', accent: 'blue', stock: 122.6, stats: { aura: 79, reliability: 65, spanish: 59, chaos: 61, fiscal: 57, ibiza: 74, appeal: 81, xp: 840 } },
  { id: 'naehwan', name: 'Naehwan', alias: 'NAEHWAN', animal: 'PANDA', accent: 'pink', stock: 105.1, stats: { aura: 72, reliability: 69, spanish: 51, chaos: 58, fiscal: 63, ibiza: 70, appeal: 73, xp: 730 } }
];

const BABYLON_EVENTS = [
  { id: 'seed-1', type: 'LEGENDARY', title: 'The 24-hour Ibiza operation', description: 'A brief field visit generated an amount of lore usually reserved for a full fiscal quarter.', location: 'IBIZA', people: ['tibi', 'sven', 'robin'], time: '23 SEP · 05:42', change: '+180 XP', seed: true },
  { id: 'seed-2', type: 'POOL PARTY', title: 'Pool boy encounter', description: 'The old German pool boy made his rounds between Spain life and his free-time shift. Pool condition: immaculate.', location: 'JÁVEA HQ', people: ['philipp', 'ainhoa', 'nerea'], time: '20 SEP · 16:18', change: '+55 AURA', seed: true },
  { id: 'event-2026-09-19-p-to-the-k-tinder', type: 'RANDOM LORE', title: 'Tinder Incident', description: 'Helped on Robin’s Tinder Chats', location: 'JAVEA HQ', people: ['philipp'], time: '19 SEP · 00:34', change: '+50 XP EACH', seed: true },
  { id: 'event-2026-09-19-ainhoa-tinder', type: 'SPORT', title: 'Tinder Incident', description: 'Helped on Robin’s Tinder Chats', location: 'JACEA HQ', people: ['ainhoa'], time: '19 SEP · 00:33', change: '+50 XP EACH', seed: true },
  { id: 'quote-event-2026-09-19-tibi-pussy-jus', type: 'QUOTE', title: '“Elle veut son pussy jus”', description: 'Entered into evidence by TIBI · elle veut son labubu (labubu song).', location: 'QUOTE ARCHIVE', people: ['tibi'], time: '19 SEP · 00:29', change: 'RECORDED', seed: true },
  { id: 'seed-3', type: 'RANDOM LORE', title: 'Single-shoe collection expands', description: 'A swimming shoe has entered the archive. The collection now has two entries and no explanation.', location: 'MOLY PARKING', people: ['sven', 'tibi'], time: '18 SEP · 03:07', change: '+1 SHOE', seed: true }
];

const BABYLON_QUOTES = [
  { id: 'quote-2026-09-19-tibi-pussy-jus', quote: 'Elle veut son pussy jus', speaker: 'TIBI', context: 'elle veut son labubu (labubu song)', time: '19 SEP · 00:29' },
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
  { id: 'npc-seed-1', nickname: 'The Pool Boy', nationality: 'OLD GERMAN / LIVES IN SPAIN', where: 'JÁVEA HQ POOL', danger: 'LOW / EARLY SHIFT', lore: 'An old German who now lives in Spain and cleans the pool for fun in his free time. He arrives before sunrise; the pool is always immaculate and the group is always asleep.', quest: 'Wake up early enough to thank him for the immaculate pool.', odds: '100% / TUESDAY + SATURDAY' }
];

// Add JPEGs or PNGs to /photos, then list them here to publish them in the shared
// album. Browser-uploaded images remain local to the device.
const BABYLON_PHOTOS = [
  // { src: 'photos/ibiza-001.jpg', caption: 'Ibiza survival evidence', addedAt: '23 SEP 2026' }
  { src: 'photos/babylonflow.PNG', caption: 'OG Babylon Flow', addedAt: '23 SEP 2026' },
  { src: 'photos/babylonflowv0.jpeg', caption: 'Babylon Flow v0', addedAt: '23 SEP 2026' },
  { src: 'photos/babylonflowv1.jpeg', caption: 'Babylon Flow v1', addedAt: '23 SEP 2026' },
  { src: 'photos/babylonflowv2.PNG', caption: 'Babylon Flow v2', addedAt: '23 SEP 2026' },
  { src: 'photos/babylonflowv3.jpeg', caption: 'Babylon Flow v3', addedAt: '23 SEP 2026' },
  { src: 'photos/babylonflowv4.jpeg', caption: 'Babylon Flow v4', addedAt: '23 SEP 2026' },
  { src: 'photos/babylonflowv5.jpeg', caption: 'Babylon Flow v5', addedAt: '23 SEP 2026' },
  { src: 'photos/babylonflowv5x2.jpeg', caption: 'Babylon Flow v5x2', addedAt: '23 SEP 2026' },
  { src: 'photos/babylonflowv6.jpeg', caption: 'Babylon Flow v6', addedAt: '23 SEP 2026' },
  { src: 'photos/babylonflowv7.jpeg', caption: 'Babylon Flow v7', addedAt: '23 SEP 2026' },
  { src: 'photos/babylonflowv8.jpeg', caption: 'Babylon Flow v8', addedAt: '23 SEP 2026' },
  { src: 'photos/babylonflowv9.jpeg', caption: 'Babylon Flow v9', addedAt: '23 SEP 2026' },
  { src: 'photos/babylonflowv10.jpeg', caption: 'Babylon Flow v10', addedAt: '23 SEP 2026' },
  { src: 'photos/babylonflowv11.jpeg', caption: 'Babylon Flow v11', addedAt: '23 SEP 2026' },
  { src: 'photos/babylonflowv12.jpeg', caption: 'Babylon Flow v12', addedAt: '23 SEP 2026' },
  { src: 'photos/babylonflowv13.jpeg', caption: 'Babylon Flow v13', addedAt: '23 SEP 2026' },
  { src: 'photos/babylonflowv14v15.jpeg', caption: 'Babylon Flow v14+v15', addedAt: '23 SEP 2026' },
  { src: 'photos/benidorm.jpeg', caption: 'Benidorm Club', addedAt: '23 SEP 2026' },
  { src: 'photos/javeajournal-001.jpeg', caption: 'Javea Journal - Page 1', addedAt: '23 SEP 2026' },
  { src: 'photos/javeajournal-002.jpeg', caption: 'Javea Journal - Page 2', addedAt: '23 SEP 2026' },
  { src: 'photos/javeajournal-003.jpeg', caption: 'Javea Journal - Page 3', addedAt: '23 SEP 2026' },
  { src: 'photos/javeajournal-004.jpeg', caption: 'Javea Journal - Page 4', addedAt: '23 SEP 2026' },
  { src: 'photos/javeajournal-005.jpeg', caption: 'Javea Journal - Page 5', addedAt: '23 SEP 2026' },
  { src: 'photos/javeajournal-006.jpeg', caption: 'Javea Journal - Page 6', addedAt: '23 SEP 2026' },
  { src: 'photos/javeajournal-007.jpeg', caption: 'Javea Journal - Page 7', addedAt: '23 SEP 2026' },
  { src: 'photos/javeajournal-008.jpeg', caption: 'Javea Journal - Page 8', addedAt: '23 SEP 2026' },
  { src: 'photos/manu.jpeg', caption: 'Manchester United Fans', addedAt: '23 SEP 2026' },
  { src: 'photos/teaparty.jpeg', caption: 'British Royalty Tea Party', addedAt: '23 SEP 2026' },
  { src: 'photos/paella.jpeg', caption: 'Spanish Revolucion', addedAt: '23 SEP 2026' },
  { src: 'photos/poolpartyflyer.jpeg', caption: 'Pool Party Invite', addedAt: '23 SEP 2026' },
  { src: 'photos/roaster.jpeg', caption: 'Full Roster', addedAt: '23 SEP 2026' },
  { src: 'photos/svenbarker.jpeg', caption: 'DJ Sven Barker', addedAt: '23 SEP 2026' },
];

// Checked-in master record. España 2026 concluded on 23 September; this is
// the final baseline. Late memories may be added, while stat and market
// corrections remain subject to HQ review.
const BABYLON_ARCHIVE = {
  schemaVersion: 2,
  canonicalRevision: 4,
  ledgerPatches: {
    2: { xp: { philipp: 50, ainhoa: 50 } }
  },
  updatedAt: '2026-09-24T00:00:00.000Z',
  source: 'BABYLON FLOW / FINAL CANONICAL LEDGER',
  trip: { status: 'concluded', concludedAt: '2026-09-23', label: 'ESPAÑA 2026' },
  people: BABYLON_PEOPLE,
  events: BABYLON_EVENTS,
  quotes: BABYLON_QUOTES,
  npcs: BABYLON_NPCS,
  morningReports: [],
  duoHistory: [],
  auditLog: []
};
