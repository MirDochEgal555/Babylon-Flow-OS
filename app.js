const ARCHIVE_KEY = 'master-state';
const ARCHIVE_DB = 'babylon-flow-archive';
const ARCHIVE_SCHEMA_VERSION = 2;
const clone = value => JSON.parse(JSON.stringify(value));
const canonicalArchive = () => clone(BABYLON_ARCHIVE);
const escapeHTML = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const isRecord = value => value && typeof value === 'object' && !Array.isArray(value);
const hasValidList = (value, limit) => Array.isArray(value) && value.length <= limit;
const cleanText = (value, fallback = '', limit = 500) => typeof value === 'string' ? value.slice(0, limit) : fallback;
const cleanNumber = (value, fallback, min = 0, max = 1000000) => Number.isFinite(Number(value)) ? Math.max(min, Math.min(max, Number(value))) : fallback;
function normalisePerson(person, fallback) {
  const stats = person?.stats || {};
  return {
    ...fallback,
    name: cleanText(person?.name, fallback.name, 60), alias: cleanText(person?.alias, fallback.alias, 60), animal: cleanText(person?.animal, fallback.animal, 60),
    accent: ['lime', 'pink', 'violet', 'orange', 'blue', 'yellow', 'red'].includes(person?.accent) ? person.accent : fallback.accent,
    status: person?.status ? (person.status === 'inactive' ? 'inactive' : 'active') : (fallback.status || 'active'), stock: cleanNumber(person?.stock, fallback.stock, 0, 1000000),
    stats: Object.fromEntries(Object.entries(fallback.stats).map(([key, value]) => [key, cleanNumber(stats[key], value, 0, key === 'xp' ? 10000000 : 100)]))
  };
}
function validateArchive(data) {
  if (!isRecord(data) || !hasValidList(data.people, 100) || !hasValidList(data.events, 5000) || !hasValidList(data.quotes, 5000)) throw new Error('Invalid archive structure');
  if (![undefined, 1, ARCHIVE_SCHEMA_VERSION].includes(data.schemaVersion)) throw new Error('Unsupported archive version');
  if ((data.npcs && !hasValidList(data.npcs, 1000)) || (data.morningReports && !hasValidList(data.morningReports, 5000)) || (data.duoHistory && !hasValidList(data.duoHistory, 5000)) || (data.auditLog && !hasValidList(data.auditLog, 500))) throw new Error('Archive exceeds supported limits');
  return data;
}
function migrateArchive(data) {
  const archive = validateArchive(clone(data));
  if (!archive.schemaVersion || archive.schemaVersion === 1) {
    archive.schemaVersion = ARCHIVE_SCHEMA_VERSION;
    archive.updatedAt ||= new Date().toISOString();
    archive.source ||= 'BABYLON FLOW / IMPORTED ARCHIVE';
  }
  return archive;
}
const legacyStore = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(`babylon-${key}`)) || fallback; } catch { return fallback; } },
  set(key, value) { localStorage.setItem(`babylon-${key}`, JSON.stringify(value)); }
};
const archiveDB = {
  open() { return new Promise((resolve, reject) => { const request = indexedDB.open(ARCHIVE_DB, 1); request.onupgradeneeded = () => request.result.createObjectStore('archive'); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); },
  async get() { const db = await this.open(); return new Promise((resolve, reject) => { const request = db.transaction('archive').objectStore('archive').get(ARCHIVE_KEY); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); },
  async set(value) { const db = await this.open(); return new Promise((resolve, reject) => { const request = db.transaction('archive', 'readwrite').objectStore('archive').put(value, ARCHIVE_KEY); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); }); }
};
let people = [], events = [], quotes = [], npcs = [], morningReports = [], duoHistory = [], auditLog = [], quoteQuiz = { correct: 0, total: 0 };
let rosterFilter = 'active';
let archiveReady = false;
let undoSnapshot = null;
function currentArchive() { return { schemaVersion: ARCHIVE_SCHEMA_VERSION, updatedAt: new Date().toISOString(), source: BABYLON_ARCHIVE.source, people, events, quotes, npcs, morningReports, duoHistory, auditLog, quoteQuiz }; }
function applyArchive(data) { const fallback = canonicalArchive(); const savedPeople = data.people || fallback.people; people = fallback.people.map(person => normalisePerson(savedPeople.find(saved => saved.id === person.id), person)); events = data.events || fallback.events; quotes = data.quotes || fallback.quotes; npcs = data.npcs || fallback.npcs; morningReports = data.morningReports || []; duoHistory = data.duoHistory || []; auditLog = data.auditLog || []; quoteQuiz = { correct: cleanNumber(data.quoteQuiz?.correct, 0, 0, 1000000), total: cleanNumber(data.quoteQuiz?.total, 0, 0, 1000000) }; }
function addAudit(action, detail = '') { auditLog.unshift({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, at: new Date().toISOString(), action, detail }); auditLog = auditLog.slice(0, 500); }
async function loadArchive() {
  let archive;
  try { archive = await archiveDB.get(); } catch { archive = legacyStore.get('archive-fallback', null); }
  if (!archive) {
    const legacyPeople = legacyStore.get('people', null);
    archive = canonicalArchive();
    if (legacyPeople) {
      archive.people = legacyPeople; archive.events = legacyStore.get('events', archive.events); archive.quotes = legacyStore.get('quotes', archive.quotes); archive.npcs = legacyStore.get('npcs', archive.npcs); archive.morningReports = legacyStore.get('morning-reports', []); archive.duoHistory = legacyStore.get('duo-history', []);
      archive.auditLog = [{ id: 'legacy-migration', at: new Date().toISOString(), action: 'Migrated legacy local archive', detail: 'Moved localStorage data into the durable archive.' }];
    }
    try { await archiveDB.set(archive); } catch { legacyStore.set('archive-fallback', archive); }
  }
  try { applyArchive(migrateArchive(archive)); } catch { applyArchive(canonicalArchive()); }
  archiveReady = true; renderPeople(); renderMarket(); renderTimeline();
}
let activeModal = null;
const $ = (s) => document.querySelector(s);
const initials = (name) => name.split(' ').map(x => x[0]).join('').slice(0,2);
const title = (id) => people.find(p => p.id === id)?.alias || id;
const personStatus = (person) => person.status === 'inactive' ? 'inactive' : 'active';
const activePeople = () => people.filter(person => personStatus(person) === 'active');
const ACCESS_PHRASE = 'babylon2026';
const LOG_EMAIL_ENDPOINT = 'https://formsubmit.co/ajax/rogee.oc@gmail.com';

async function emailLog(kind, details) {
  const response = await fetch(LOG_EMAIL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      _subject: `Babylon Flow — ${kind}`,
      'Log type': kind,
      'Logged at': new Date().toLocaleString(),
      ...details
    })
  });
  const result = await response.json().catch(() => ({}));
  const needsActivation = /activat|confirm/i.test(result.message || '');
  if (!response.ok || ((result.success === false || result.success === 'false') && !needsActivation)) {
    throw new Error(result.message || 'Email could not be sent');
  }
  return { ...result, needsActivation };
}

function notifyLog(kind, details) {
  emailLog(kind, details)
    .then(result => toast(result.needsActivation
      ? 'LOGGED · CHECK EMAIL TO ACTIVATE DELIVERY'
      : 'LOGGED · EMAIL SENT'))
    .catch(() => toast('LOGGED LOCALLY · EMAIL NOT SENT'));
}

function setupAccessGate() {
  const gate = $('#accessGate');
  if (sessionStorage.getItem('babylon-access') === 'granted') { gate.classList.add('unlocked'); return; }
  $('#gateForm').onsubmit = event => {
    event.preventDefault();
    if ($('#accessPassword').value === ACCESS_PHRASE) {
      sessionStorage.setItem('babylon-access', 'granted');
      gate.classList.add('unlocked');
    } else {
      $('#gateError').textContent = 'ACCESS DENIED — CHECK THE PHRASE.';
      $('#accessPassword').select();
    }
  };
}

function renderPeople() {
  const rosterPeople = people.filter(person => personStatus(person) === rosterFilter);
  $('#rosterTitle').textContent = `${rosterFilter.toUpperCase()} ASSETS`;
  $('#viewAll').innerHTML = rosterFilter === 'active' ? 'VIEW INACTIVE <span>→</span>' : 'VIEW ACTIVE <span>→</span>';
  $('#peopleGrid').innerHTML = rosterPeople.map(p => `
    <article class="person-card" style="--person:var(--${p.accent})" data-person="${escapeHTML(p.id)}" title="Open ${escapeHTML(p.name)}'s asset profile">
      <span class="person-status ${personStatus(p)}">${personStatus(p)}</span>
      <div class="avatar">${escapeHTML(initials(p.alias))}</div><span class="animal">${escapeHTML(p.animal)} CLASS</span>
      <h3>${escapeHTML(p.alias)}</h3><div class="name">${escapeHTML(p.name).toUpperCase()} · €${Number(p.stock).toFixed(1)}</div>
      <div class="bars">
        ${statBar('AURA', p.stats.aura)}${statBar('CHAOS', p.stats.chaos)}${statBar('IBIZA', p.stats.ibiza)}
      </div><span class="person-xp">${p.stats.xp} XP</span>
    </article>`).join('');
  document.querySelectorAll('[data-person]').forEach(c => c.onclick = () => openPerson(c.dataset.person));
}
function statBar(label, value) { return `<div><div class="bar-label"><span>${label}</span><span>${value}</span></div><div class="bar"><span style="width:${Math.min(value,100)}%"></span></div></div>`; }
function renderMarket() {
  const active = activePeople();
  const best = [...active].sort((a,b) => b.stock-a.stock)[0], chaos = [...active].sort((a,b)=>b.stats.chaos-a.stats.chaos)[0];
  $('#marketCard').innerHTML = `<div class="market-main"><span class="micro-label">AFTER-HOURS BRIEFING</span><p><strong class="up">${escapeHTML(best.alias)} ▲ 11.7%</strong><br>Strong DJ guidance and unexpectedly competent Spanish have driven an upgrade in investor confidence.</p></div><div class="market-stats"><div><span class="micro-label">TOP ASSET</span><b>${escapeHTML(best.alias)}</b></div><div><span class="micro-label">CHAOS INDEX</span><b>${Number(chaos.stats.chaos)}/100</b></div><div><span class="micro-label">SHOE RESERVE</span><b>02</b></div></div>`;
}
function renderTimeline() {
  $('#timeline').innerHTML = events.map(e => `<article class="timeline-item"><div><span class="event-type">${escapeHTML(e.type)}</span></div><div><h3>${escapeHTML(e.title)}</h3><p>${escapeHTML(e.description)}</p></div><div class="event-meta">${escapeHTML(e.location || 'FIELD UNKNOWN')}<br><strong>${escapeHTML(e.change || 'LOGGED')}</strong><br>${escapeHTML(e.time)}</div></article>`).join('');
}
function updateUndoButton() { $('#undoLast').hidden = !undoSnapshot; }
function rememberUndo() { undoSnapshot = clone(currentArchive()); updateUndoButton(); }
function undoLastChange() { if (!undoSnapshot) return; applyArchive(undoSnapshot); undoSnapshot = null; addAudit('Last change undone'); save(); updateUndoButton(); toast('LAST LOCAL CHANGE REVERSED'); }
function save(action, detail) { if (action) addAudit(action, detail); const archive = currentArchive(); archiveReady && archiveDB.set(archive).catch(() => legacyStore.set('archive-fallback', archive)); renderPeople(); renderMarket(); renderTimeline(); }
function openModal(content, kind, wide=false) { activeModal = kind; $('#modalBody').innerHTML = content; $('#modal').classList.toggle('wide', wide); $('#backdrop').classList.add('open'); $('#modal').classList.add('open'); }
function closeModal() { $('#backdrop').classList.remove('open'); $('#modal').classList.remove('open'); $('#modal').classList.remove('wide'); activeModal = null; }
function toast(message) { const t = $('#toast'); t.textContent = message; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 2700); }
const peopleOptions = (multiple=false) => people.map(p=>`<option value="${escapeHTML(p.id)}">${escapeHTML(p.alias)} — ${escapeHTML(p.name)}</option>`).join('');
const activePeopleOptions = () => activePeople().map(p=>`<option value="${escapeHTML(p.id)}">${escapeHTML(p.alias)} — ${escapeHTML(p.name)}</option>`).join('');
const fieldToStat = { AURA:'aura', RELIABILITY:'reliability', 'SPANISH FLUENCY':'spanish', CHAOS:'chaos', 'FISCAL RESPONSIBILITY':'fiscal', 'IBIZA PERFORMANCE':'ibiza', 'SEX APPEAL':'appeal' };
const eventTime = () => new Date().toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }).toUpperCase();

function eventModal() { openModal(`<h2 id="modalTitle">LOG EVENT</h2><p class="lede">Create a permanent record of an operational incident.</p><form id="eventForm"><div class="form-grid"><div><label>PEOPLE INVOLVED</label><select name="people" multiple required size="4">${activePeopleOptions()}</select></div><div><label>CATEGORY</label><select name="category"><option>RANDOM LORE</option><option>PARTY</option><option>CLUB</option><option>BEACH</option><option>FOOD</option><option>SPORT</option><option>LEGENDARY</option></select></div><div class="full"><label>INCIDENT TITLE</label><input required name="title" autocomplete="off" placeholder="The Supermarket Incident" maxlength="55"></div><div class="full"><label>WHAT HAPPENED</label><textarea name="description" required placeholder="Keep it brief. The timeline is watching." maxlength="180"></textarea></div><div><label>LOCATION</label><input name="location" placeholder="JÁVEA HQ" maxlength="30"></div><div><label>XP AWARD / PERSON</label><select name="xp"><option value="0">NO XP</option><option value="25">+25 XP</option><option value="50" selected>+50 XP</option><option value="100">+100 XP</option><option value="150">+150 XP</option></select></div><div><label>STAT EFFECT (OPTIONAL)</label><select name="stat"><option value="">NO STAT EFFECT</option>${Object.keys(fieldToStat).map(field=>`<option value="${field}">${field}</option>`).join('')}</select></div><div><label>STAT DELTA / PERSON</label><input name="statDelta" type="number" value="0" min="-100" max="100"></div><div><label>STOCK MOVE / PERSON</label><input name="stockDelta" type="number" value="0" min="-100" max="100" step="0.1" placeholder="e.g. -4"></div></div><button class="submit-button">COMMIT TO THE ARCHIVE →</button></form>`, 'event');
  $('#eventForm').onsubmit = e => { e.preventDefault(); const d = new FormData(e.target), ids=d.getAll('people'), involved=people.filter(p=>ids.includes(p.id)), xp=+d.get('xp'), stat=fieldToStat[d.get('stat')], statDelta=+d.get('statDelta'), stockDelta=+d.get('stockDelta'), location=(d.get('location')||'FIELD UNKNOWN').toUpperCase(), time=eventTime(); if (!involved.length) return; rememberUndo(); involved.forEach(p=>{ p.stats.xp+=xp; if(stat) p.stats[stat]=Math.max(0,Math.min(100,p.stats[stat]+statDelta)); if(stockDelta) p.stock=+(Math.max(0,p.stock*(1+stockDelta/100))).toFixed(1); }); const changes=[xp&&`+${xp} XP EACH`, stat&&`${statDelta>=0?'+':''}${statDelta} ${d.get('stat')}`, stockDelta&&`${stockDelta>=0?'+':''}${stockDelta}% STOCK`].filter(Boolean).join(' · ') || 'RECORDED'; events.unshift({ id:Date.now(), type:d.get('category'), title:d.get('title'), description:d.get('description'), location, people:ids, time, change:changes}); save('Event logged', d.get('title')); closeModal(); toast('EVENT COMMITTED · UNDO AVAILABLE'); notifyLog('Event logged', { 'People involved': involved.map(p=>p.alias).join(', '), Category: d.get('category'), Title: d.get('title'), 'What happened': d.get('description'), Location: location, 'XP per person': `+${xp} XP`, 'Stat effect': stat ? `${d.get('stat')} ${statDelta>=0?'+':''}${statDelta}` : 'None', 'Stock move per person': `${stockDelta>=0?'+':''}${stockDelta}%`, Timestamp: time }); };
}
function quoteModal() { openModal(`<h2 id="modalTitle">LOG QUOTE</h2><p class="lede">The evidentiary archive has no context limit. You should.</p><form id="quoteForm"><div class="form-grid"><div class="full"><label>THE QUOTE</label><textarea required name="quote" placeholder="A sentence future generations will misunderstand." maxlength="180"></textarea></div><div><label>SPEAKER</label><select name="speaker">${peopleOptions()}<option value="UNKNOWN">UNKNOWN ENTITY</option></select></div><div><label>CONTEXT</label><input name="context" placeholder="e.g. 04:00 taxi debate" maxlength="45"></div></div><button class="submit-button">SEAL THE EVIDENCE →</button></form>`, 'quote');
  $('#quoteForm').onsubmit = e => { e.preventDefault(); const d=new FormData(e.target), speaker=title(d.get('speaker')), context=d.get('context'); quotes.unshift({id:Date.now(), quote:d.get('quote'),speaker,context,time:'JUST NOW'}); events.unshift({id:Date.now()+1,type:'QUOTE',title:`“${d.get('quote').slice(0,48)}${d.get('quote').length>48?'…':''}”`,description:`Entered into evidence by ${speaker}${context ? ` · ${context}` : ''}.`,location:'QUOTE ARCHIVE',time:'JUST NOW',change:'RECORDED'}); save('Quote logged', d.get('quote').slice(0, 80)); closeModal(); notifyLog('Quote logged', { Speaker: speaker, Quote: d.get('quote'), Context: context || 'Not supplied' }); };
}
function quoteQuizModal() {
  if (!quotes.length) { openModal(`<h2 id="modalTitle">WHO SAID THIS?</h2><p class="lede">The quiz needs at least one quote in the archive. Go create future evidence.</p>`, 'quoteQuiz'); return; }
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const speakerPool = [...new Set([...people.map(p => p.alias), ...quotes.map(q => q.speaker)])].filter(Boolean);
  const distractors = speakerPool.filter(speaker => speaker !== quote.speaker).sort(() => Math.random() - .5).slice(0, 3);
  const options = [quote.speaker, ...distractors].sort(() => Math.random() - .5);
  openModal(`<h2 id="modalTitle">WHO SAID THIS?</h2><p class="lede">The archive remembers. You probably do not.</p><div class="quest-card"><span class="micro-label">QUOTE ARCHIVE / ${quoteQuiz.correct} CORRECT FROM ${quoteQuiz.total}</span><h3>“${escapeHTML(quote.quote)}”</h3><p class="lede">${escapeHTML(quote.context || 'CONTEXT CLASSIFIED')}</p></div><div class="quiz-options">${options.map((speaker, index) => `<button class="secondary-button" data-quiz-answer="${index}">${escapeHTML(speaker)}</button>`).join('')}</div>`, 'quoteQuiz');
  document.querySelectorAll('[data-quiz-answer]').forEach(button => button.onclick = () => {
    const selected = options[+button.dataset.quizAnswer], correct = selected === quote.speaker;
    quoteQuiz.total += 1; if (correct) quoteQuiz.correct += 1;
    save('Quote quiz answered', correct ? 'Correct identification' : 'Incorrect identification');
    $('#modalBody').innerHTML = `<div class="court-stage"><span class="micro-label">ARCHIVE VERIFICATION COMPLETE</span><div class="court-symbol">${correct ? '✓' : '✕'}</div><h3>${correct ? 'CORRECT' : 'THE ARCHIVE DISAGREES'}</h3><p>${correct ? 'Your memory has been temporarily certified.' : `This quote belongs to ${escapeHTML(quote.speaker)}.`}</p><p class="lede">SCORE: ${quoteQuiz.correct} / ${quoteQuiz.total}</p><button class="submit-button" id="nextQuote">NEXT QUOTE →</button></div>`;
    $('#nextQuote').onclick = quoteQuizModal;
  });
}
function questModal(quest = BABYLON_QUESTS[Math.floor(Math.random()*BABYLON_QUESTS.length)]) { openModal(`<h2 id="modalTitle">SIDE QUEST</h2><p class="lede">Optional mission. Mandatory lore potential.</p><div class="quest-card"><span class="rarity">${quest.rarity} ASSIGNMENT</span><h3>${quest.mission}</h3><div class="quest-details"><span>LOCATION <b>${quest.place}</b></span><span>REWARD <b>+${quest.xp} XP</b></span></div></div><label for="questRecipient">ASSIGN OPERATIVE</label><select id="questRecipient">${activePeopleOptions()}</select><div class="quest-actions"><button class="secondary-button" id="reroll">REROLL</button><button class="submit-button" id="completeQuest">COMPLETE QUEST</button></div>`, 'quest');
  $('#reroll').onclick=()=>questModal(); $('#completeQuest').onclick=()=>{ const p=people.find(person=>person.id===$('#questRecipient').value); rememberUndo(); p.stats.xp+=quest.xp; events.unshift({id:Date.now(),type:'SIDE QUEST',title:'Side quest completed',description:`${p.alias} completed the mission: ${quest.mission}`,location:quest.place,time:eventTime(),change:`+${quest.xp} XP`});save('Side quest completed',quest.mission);closeModal();toast(`QUEST COMPLETE · ${p.alias} +${quest.xp} XP`);};
}
function courtModal() { openModal(`<h2 id="modalTitle">BABYLON COURT</h2><p class="lede">An independent judicial body with no standards whatsoever.</p><form id="courtForm"><div class="form-grid"><div><label>THE ACCUSED</label><select name="accused">${peopleOptions()}</select></div><div><label>CASE TYPE</label><select name="type"><option>GENERAL MISCONDUCT</option><option>SPANISH CRIMES</option><option>FISCAL NEGLIGENCE</option><option>LORE VIOLATION</option></select></div><div class="full"><label>THE ACCUSATION</label><textarea required name="accusation" placeholder="What exactly are we pretending happened?" maxlength="160"></textarea></div><div class="full"><label>DEFENSE (OPTIONAL / IGNORED)</label><input name="defense" placeholder="An attempt will be filed."></div></div><button class="submit-button">SUBMIT TO VAR →</button></form>`, 'court');
  $('#courtForm').onsubmit=e=>{e.preventDefault();const d=new FormData(e.target);courtProcessing(d);};
}
function courtProcessing(data) { $('#modalBody').innerHTML=`<div class="court-stage"><span class="micro-label">BABYLON JUDICIARY / LIVE</span><div class="court-symbol">⚖</div><h3 id="courtStatus">ANALYSING EVIDENCE…</h3><p>Cross-referencing vibes, witness statements and the shoe archive.</p></div>`; setTimeout(()=>$('#courtStatus').textContent='CHECKING VAR…',900); setTimeout(()=>$('#courtStatus').textContent='CONSULTING BABYLON LAW…',1800); setTimeout(()=>courtVerdict(data),2850); }
function courtVerdict(data) { const accused=people.find(p=>p.id===data.get('accused')); const outcomes=['GUILTY','TECHNICALLY GUILTY','GUILTY','NOT GUILTY','CASE DISMISSED']; const verdict=outcomes[Math.floor(Math.random()*outcomes.length)], sentence=COURT_SENTENCES[Math.floor(Math.random()*COURT_SENTENCES.length)], caseType=data.get('type'), accusation=data.get('accusation'), defense=data.get('defense')||'No defense filed.'; rememberUndo(); if(verdict!=='NOT GUILTY'&&verdict!=='CASE DISMISSED') {accused.stats.chaos=Math.min(100,accused.stats.chaos+5);accused.stock=+(accused.stock*.96).toFixed(1);} events.unshift({id:Date.now(),type:'COURT',title:`${accused.alias}: ${verdict}`,description:`${caseType}. Accusation: ${accusation} Defense: ${defense} Sentence: ${verdict==='NOT GUILTY'||verdict==='CASE DISMISSED'?'The court has somehow allowed this.':sentence}`,location:'BABYLON COURT',time:eventTime(),change:verdict==='GUILTY'?'−4% STOCK · +5 CHAOS':'VERDICT FILED'});save('Court verdict',`${accused.alias}: ${verdict}`); $('#modalBody').innerHTML=`<div class="court-stage"><span class="micro-label">CASE #${String(Date.now()).slice(-5)} / FINAL</span><div class="verdict"><span class="verdict-label">${escapeHTML(caseType)} · VERDICT</span><h3>${verdict}</h3><p>After reviewing all available vibes, the court finds ${escapeHTML(accused.alias)} ${verdict.toLowerCase()}. ${verdict==='NOT GUILTY'?'This establishes no precedent.':`Sentence: ${sentence}`}</p><p><small>Defense filed: “${escapeHTML(defense)}”</small></p></div><button class="submit-button" id="closeVerdict">ACCEPT BABYLON LAW</button></div>`;$('#closeVerdict').onclick=()=>{closeModal();toast('VERDICT ARCHIVED · UNDO AVAILABLE');}; }
function openPerson(id) { const p=people.find(x=>x.id===id); openModal(`<h2 id="modalTitle">${escapeHTML(p.alias)}</h2><p class="lede">${escapeHTML(p.name).toUpperCase()} · ${escapeHTML(p.animal)} CLASS · CURRENT ASSET €${p.stock.toFixed(1)}</p><div class="form-grid">${[['AURA',p.stats.aura],['RELIABILITY',p.stats.reliability],['SPANISH FLUENCY',p.stats.spanish],['CHAOS',p.stats.chaos],['FISCAL RESPONSIBILITY',p.stats.fiscal],['IBIZA PERFORMANCE',p.stats.ibiza],['SEX APPEAL',p.stats.appeal],['EXPERIENCE',`${p.stats.xp} XP`]].map(([a,b])=>`<div class="quest-card" style="padding:14px"><span class="micro-label">${a}</span><h3 style="margin:7px 0 0;font-size:25px">${b}</h3></div>`).join('')}</div><button class="submit-button" id="requestPersonChange">REQUEST A STAT CHANGE →</button>`, 'person'); $('#requestPersonChange').onclick=()=>changeRequestModal({ personId:id }); }

function changeRequestModal({ personId = '', category = '' } = {}) {
  const statOptions = ['AURA', 'RELIABILITY', 'SPANISH FLUENCY', 'CHAOS', 'FISCAL RESPONSIBILITY', 'IBIZA PERFORMANCE', 'SEX APPEAL', 'EXPERIENCE / XP'];
  const selected = value => category === value ? ' selected' : '';
  openModal(`<h2 id="modalTitle">REQUEST A CHANGE</h2><p class="lede">Send Babylon HQ a proposed correction. Requests are emailed for review; they do not change the live ledger automatically.</p><form id="changeRequestForm"><div class="form-grid"><div><label>PERSON / ASSET</label><select name="person" required>${people.map(p=>`<option value="${escapeHTML(p.id)}"${p.id===personId?' selected':''}>${escapeHTML(p.alias)} — ${escapeHTML(p.name)}</option>`).join('')}</select></div><div><label>REQUEST TYPE</label><select name="category" id="requestCategory"><option value="PERSON STAT"${selected('PERSON STAT')}>PERSON STAT</option><option value="TRIP STOCK"${selected('TRIP STOCK')}>TRIP STOCK / SHARE PRICE</option></select></div><div><label>STAT OR MARKET FIELD</label><select name="field" id="requestField">${statOptions.map(s=>`<option>${s}</option>`).join('')}<option value="SHARE PRICE">SHARE PRICE</option></select></div><div><label>PROPOSED CHANGE</label><input required name="change" autocomplete="off" maxlength="40" placeholder="e.g. +8, 74 → 82, €112.50"></div><div class="full"><label>WHY SHOULD THIS CHANGE?</label><textarea required name="evidence" maxlength="400" placeholder="Give the field evidence: what happened, when, and why it matters."></textarea></div><div><label>YOUR NAME (OPTIONAL)</label><input name="requester" autocomplete="name" maxlength="60" placeholder="Anonymous operative"></div><div><label>WHERE / WHEN (OPTIONAL)</label><input name="context" maxlength="80" placeholder="e.g. Ibiza · last night"></div></div><button class="submit-button">EMAIL REQUEST TO BABYLON HQ →</button></form>`, 'change-request');
  const categorySelect = $('#requestCategory'), fieldSelect = $('#requestField');
  const syncFields = () => { const stock = categorySelect.value === 'TRIP STOCK'; fieldSelect.value = stock ? 'SHARE PRICE' : (fieldSelect.value === 'SHARE PRICE' ? 'AURA' : fieldSelect.value); fieldSelect.disabled = stock; };
  syncFields(); categorySelect.onchange = syncFields;
  $('#changeRequestForm').onsubmit = event => { event.preventDefault(); const data = new FormData(event.target); const person = people.find(p=>p.id===data.get('person')); const details = { 'Request type': data.get('category'), Person: person.alias, Field: data.get('category') === 'TRIP STOCK' ? 'SHARE PRICE' : data.get('field'), 'Proposed change': data.get('change'), Evidence: data.get('evidence'), Requester: data.get('requester') || 'Anonymous operative', 'Where / when': data.get('context') || 'Not supplied' }; const submit = event.target.querySelector('button'); submit.disabled = true; submit.textContent = 'SENDING REQUEST…'; emailLog('Change request', details).then(result => { closeModal(); toast(result.needsActivation ? 'REQUEST SAVED · CHECK EMAIL TO ACTIVATE DELIVERY' : 'REQUEST EMAILED TO BABYLON HQ'); }).catch(() => { submit.disabled = false; submit.textContent = 'EMAIL REQUEST TO BABYLON HQ →'; toast('EMAIL FAILED · PLEASE TRY AGAIN'); }); };
}

function wheelModal() {
  openModal(`<div class="wheel-stage"><span class="micro-label">BABYLON RANDOMIZATION ENGINE / RARE DROPS ENABLED</span><h2 id="modalTitle">WHEEL OF BAD<br>DECISIONS</h2><p class="lede">The wheel has no memory, no mercy and a 12% chance of legend.</p><div class="wheel-wrap"><div class="wheel-pointer"></div><div class="wheel-disc" id="wheelDisc"></div></div><div class="wheel-result" id="wheelResult">SPIN TO ACCEPT YOUR FATE.</div><button class="submit-button" id="spinWheel">SPIN THE WHEEL →</button></div>`, 'wheel');
  $('#spinWheel').onclick = () => { const outcome = BABYLON_WHEEL[Math.floor(Math.random()*BABYLON_WHEEL.length)]; const disc=$('#wheelDisc'); disc.style.transform=`rotate(${1800 + Math.floor(Math.random()*1800)}deg)`; $('#spinWheel').disabled=true; $('#spinWheel').textContent='DECISION IN PROGRESS…'; setTimeout(()=>{ $('#wheelResult').innerHTML=`${outcome.legendary ? '<span class="legendary-result">✦ LEGENDARY DROP ✦<br>' : ''}${outcome.text}${outcome.legendary ? '</span>' : ''}`; $('#spinWheel').disabled=false; $('#spinWheel').textContent='SPIN AGAIN →'; events.unshift({id:Date.now(),type:outcome.legendary?'LEGENDARY':'BAD DECISION',title:outcome.text,description:'Assigned by the Wheel of Bad Decisions. Appeals are not accepted.',location:'FIELD SYSTEMS',time:'JUST NOW',change:outcome.legendary?'+250 XP':'MISSION ISSUED'}); save(); },4700); };
}
function exchangeModal() {
  const total=people.reduce((sum,p)=>sum+p.stock,0), sorted=[...people].sort((a,b)=>b.stock-a.stock);
  const headlines = BABYLON_HEADLINES.map(h=>`<div class="headline"><span>BFSE FLASH</span> — ${h}</div>`).join('');
  openModal(`<h2 id="modalTitle">TRIP STOCK EXCHANGE</h2><p class="lede">Every person is a company. None of these securities are regulated.</p><div class="portfolio"><span class="micro-label">GROUP PORTFOLIO<br><b>€${total.toFixed(1)}</b></span><span class="micro-label">MARKET LEADER<br><b>${sorted[0].alias}</b></span></div><div class="stock-table">${sorted.map((p,index)=>{const move=((p.stats.xp%25)-10.6).toFixed(1);return `<div class="stock-row"><b>${p.alias}</b><span>€${p.stock.toFixed(1)}</span><strong class="${move>=0?'up':'down'}">${move>=0?'▲':'▼'} ${Math.abs(move)}%</strong><span>${index===0?'UPGRADED ON VIBES':'ANALYSTS REMAIN CONCERNED'}</span></div>`}).join('')}</div><button class="submit-button" id="requestStockChange">REQUEST A STOCK CHANGE →</button><h3 style="margin:24px 0 8px;font:18px var(--display)">BLOOMBERG-ADJACENT</h3>${headlines}</div>`, 'exchange', true);
  $('#requestStockChange').onclick = () => changeRequestModal({ category:'TRIP STOCK' });
}
function npcModal() {
  const cards = npcs.length ? `<div class="npc-grid">${npcs.map(n=>`<article class="npc-card"><span class="micro-label">${escapeHTML(n.nationality)} · ${escapeHTML(n.where)}</span><h3>${escapeHTML(n.nickname)}</h3><span class="danger">DANGER LEVEL: ${escapeHTML(n.danger)}</span><p>${escapeHTML(n.lore)}</p><p><b>SIDE QUEST:</b> ${escapeHTML(n.quest)}<br><b>REAPPEARANCE ODDS:</b> ${escapeHTML(n.odds)}</p></article>`).join('')}</div>` : '<p class="lede">No memorable entities logged yet. This is statistically temporary.</p>';
  openModal(`<h2 id="modalTitle">NPC GENERATOR</h2><p class="lede">Turn a memorable stranger into permanent canon.</p><form id="npcForm"><div class="form-grid"><div><label>NICKNAME</label><input required name="nickname" placeholder="The Espresso Oracle"></div><div><label>NATIONALITY</label><input required name="nationality" placeholder="ITALIAN"></div><div><label>WHERE ENCOUNTERED</label><input required name="where" placeholder="BEACH BAR"></div><div><label>DANGER LEVEL</label><select name="danger"><option>LOW / MYSTERIOUS</option><option>MEDIUM / UNPREDICTABLE</option><option>HIGH / KEEP EYES OPEN</option><option>FINAL BOSS</option></select></div><div class="full"><label>LORE</label><textarea required name="lore" maxlength="180" placeholder="What made this person canon?"></textarea></div><div><label>SIDE QUEST</label><input required name="quest" placeholder="Find their cousin"></div><div><label>LIKELIHOOD OF REAPPEARANCE</label><select name="odds"><option>3% / A MIRACLE</option><option>27% / SAME BAR THEORY</option><option>64% / THEY KNOW WHERE WE STAY</option><option>100% / INEVITABLE</option></select></div></div><button class="submit-button">ADD TO CANON →</button></form><h3 style="margin:32px 0 12px;font:18px var(--display)">KNOWN ENTITIES</h3>${cards}`, 'npc', true);
  $('#npcForm').onsubmit=e=>{e.preventDefault();const d=new FormData(e.target);const n=Object.fromEntries(d.entries());n.id=Date.now();npcs.unshift(n);events.unshift({id:Date.now()+1,type:'NPC ENCOUNTER',title:`NPC logged: ${n.nickname}`,description:n.lore,location:n.where.toUpperCase(),time:'JUST NOW',change:'CANONIZED'});save('NPC canonized',n.nickname);npcModal();toast('NPC CANONIZED · SIDE QUEST AVAILABLE');notifyLog('NPC canonized',{Nickname:n.nickname,Nationality:n.nationality,'Where encountered':n.where,'Danger level':n.danger,Lore:n.lore,'Side quest':n.quest,'Reappearance odds':n.odds});};
}
function varModal() { openModal(`<h2 id="modalTitle">VAR FOR ARGUMENTS</h2><p class="lede">Two accounts enter. Babylon Law leaves with the truth.</p><form id="varForm"><div class="form-grid"><div><label>WITNESS A</label><select name="a">${peopleOptions()}</select></div><div><label>WITNESS B</label><select name="b">${peopleOptions()}</select></div><div class="full"><label>WITNESS A'S ACCOUNT</label><textarea required name="accountA" placeholder="What definitely happened, according to them?"></textarea></div><div class="full"><label>WITNESS B'S ACCOUNT</label><textarea required name="accountB" placeholder="The completely different version."></textarea></div></div><button class="submit-button">SEND TO VAR →</button></form>`, 'var'); $('#varForm').onsubmit=e=>{e.preventDefault();varProcessing(new FormData(e.target));}; }
function varProcessing(data) { $('#modalBody').innerHTML=`<div class="court-stage"><span class="micro-label">BABYLON VAR / UNBIASED IN THEORY</span><div class="court-symbol">◉</div><h3 id="varStatus">LOADING EVIDENCE…</h3><p id="varSub">Synchronising witness confidence levels.</p><div class="progress-line"><span id="varProgress"></span></div></div>`; const stages=['CALIBRATING THE VIBE-O-METER…','CHECKING VAR…','REVIEWING 14 PIXELS OF EVIDENCE…','CONSULTING THE TAXI DRIVER…']; stages.forEach((s,i)=>setTimeout(()=>{$('#varStatus').textContent=s;$('#varProgress').style.width=`${(i+1)*25}%`;},i*2500)); setTimeout(()=>varVerdict(data),10000); }
function varVerdict(data) { const a=title(data.get('a')), b=title(data.get('b')), decisions=[`${a} was technically correct, but spiritually suspicious.`,`${b}'s version is accepted because it has better pacing.`, 'Both accounts are rejected. The real culprit is the group chat.', 'After frame-by-frame review: nobody remembers anything, which is legally binding.']; const decision=decisions[Math.floor(Math.random()*decisions.length)]; events.unshift({id:Date.now(),type:'VAR DECISION',title:'Argument submitted to VAR',description:decision,location:'BABYLON REVIEW ROOM',time:'JUST NOW',change:'FINAL DECISION'});save();$('#modalBody').innerHTML=`<div class="court-stage"><span class="micro-label">VAR DECISION / ABSOLUTELY FINAL</span><div class="verdict"><span class="verdict-label">ON-FIELD RULING</span><h3>DECISION ISSUED</h3><p>${decision}</p><p><small>${a}: “${escapeHTML(data.get('accountA'))}”<br>${b}: “${escapeHTML(data.get('accountB'))}”</small></p></div><button class="submit-button" id="closeVerdict">ACCEPT REALITY</button></div>`;$('#closeVerdict').onclick=closeModal; }
function loreModal() { const entries=events.slice(0,18).map((e,i)=>`<article class="lore-entry"><span class="micro-label">CHAPTER ${String(i+1).padStart(2,'0')} · ${escapeHTML(e.time)}</span><h3>The ${escapeHTML(e.title)} Incident</h3><p><b>LOCATION:</b> ${escapeHTML(e.location||'UNKNOWN')}<br><b>PARTICIPANTS:</b> ${(e.people||[]).map(title).map(escapeHTML).join(', ')||'CLASSIFIED'}</p><p>${escapeHTML(e.description)}</p><p><b>EYEWITNESS ACCOUNT:</b> “It seemed reasonable at the time.”<br><b>CONSEQUENCE:</b> ${escapeHTML(e.change||'Historical record amended.')}</p></article>`).join(''); openModal(`<h2 id="modalTitle">THE LORE BOOK</h2><p class="lede">An increasingly inaccurate historical record of the España 2026 campaign.</p><div class="lore-grid">${entries}</div>`, 'lore', true); }
function duoModal() { const pool=[...people].sort(()=>Math.random()-.5); const [a,b]=pool; const mission=BABYLON_DUOS[Math.floor(Math.random()*BABYLON_DUOS.length)]; openModal(`<h2 id="modalTitle">RANDOM DUO MISSION</h2><p class="lede">The algorithm has separated the usual suspects.</p><div class="duo-pair"><span class="micro-label">CO-OP UNIT ASSIGNED</span><h3>${a.alias} × ${b.alias}</h3><p>${mission}</p><span class="rarity">REWARD: +80 XP EACH · +1 SHARED MEMORY</span></div><div class="quest-actions"><button class="secondary-button" id="rerollDuo">REROLL PAIR</button><button class="submit-button" id="acceptDuo">ACCEPT MISSION</button></div>`, 'duo'); $('#rerollDuo').onclick=duoModal; $('#acceptDuo').onclick=()=>{a.stats.xp+=80;b.stats.xp+=80;duoHistory.unshift({id:Date.now(),pair:[a.id,b.id],mission});events.unshift({id:Date.now()+1,type:'DUO MISSION',title:`${a.alias} × ${b.alias}`,description:mission,location:'CO-OP FIELD',time:'JUST NOW',change:'+80 XP EACH'});save();closeModal();toast('DUO DEPLOYED · NO EXCUSES');}; }
function morningModal() { const reports=morningReports.length ? morningReports.map(r=>`<article class="report-card ${/contradict/i.test(r.fragment)?'contradiction':''}"><span class="micro-label">${escapeHTML(r.time)} · ANONYMOUS</span><p>“${escapeHTML(r.fragment)}”</p></article>`).join('') : '<p class="lede">The official record has no testimony yet. A rare opportunity.</p>'; openModal(`<h2 id="modalTitle">MORNING AFTER REPORT</h2><p class="lede">Anonymous fragments are reconstructed into an official account. Contradictions are a feature.</p><form id="morningForm"><div class="form-grid"><div><label>APPROX. TIME</label><input required name="time" placeholder="e.g. 03:40"></div><div><label>MEMORY CONFIDENCE</label><select name="confidence"><option>HIGH / ALLEGEDLY</option><option>MEDIUM / BLURRY</option><option>LOW / VIBES ONLY</option></select></div><div class="full"><label>WHAT DO YOU REMEMBER?</label><textarea required name="fragment" placeholder="Submit only a fragment. The bureau will do the rest."></textarea></div></div><button class="submit-button">FILE ANONYMOUS TESTIMONY →</button></form><div class="quest-actions" style="margin-top:12px"><button class="secondary-button" id="reconstruct">RECONSTRUCT OFFICIAL ACCOUNT</button></div><h3 style="margin:28px 0 12px;font:18px var(--display)">RAW TESTIMONY</h3>${reports}`, 'morning', true); $('#morningForm').onsubmit=e=>{e.preventDefault();const r=Object.fromEntries(new FormData(e.target).entries());r.id=Date.now();morningReports.push(r);save('Morning testimony filed',r.time);morningModal();notifyLog('Morning testimony',{Time:r.time,'Memory confidence':r.confidence,Testimony:r.fragment});}; $('#reconstruct').onclick=reconstructMorning; }
function reconstructMorning() { const sorted=[...morningReports].sort((a,b)=>a.time.localeCompare(b.time)); const text=sorted.length ? sorted.map((r,i)=>`${r.time} — ${r.fragment}`).join(' Then, ') : 'No witness testimony has been filed. The official account therefore reads: everyone went home early and made excellent decisions.'; const contradiction=morningReports.length>1 && morningReports.some(r=>/not|never|no /i.test(r.fragment)); $('#modalBody').innerHTML=`<h2 id="modalTitle">OFFICIAL ACCOUNT</h2><p class="lede">Reconstructed by the Babylon Bureau of Unreliable Narratives.</p><div class="report-card ${contradiction?'contradiction':''}"><span class="micro-label">CHRONOLOGICAL RECONSTRUCTION</span><p>${escapeHTML(text)}</p>${contradiction?'<p class="danger">⚠ CONTRADICTORY TESTIMONY FLAGGED — THE TRUTH HAS BEEN QUARANTINED.</p>':''}</div><button class="submit-button" id="closeReport">FILE AS FACT</button>`;$('#closeReport').onclick=closeModal; }
function wrappedModal() { const liability=[...people].sort((a,b)=>b.stats.chaos-a.stats.chaos)[0], km=events.length*3.7+31, phrase=quotes[0]?.quote||'No quote on record', late=events.filter(e=>/0[0-5]:/.test(e.time)).length, comeback=[...people].sort((a,b)=>b.stock-a.stock)[0]; openModal(`<div class="wrapped-hero"><span class="micro-label">BABYLON FLOW PRESENTS</span><h2 id="modalTitle">TRIP WRAPPED<br>2026</h2><p class="lede">A provisional finale, updated as the lore gets worse.</p></div><div class="wrapped-stats"><div><span class="micro-label">BIGGEST LIABILITY</span><b>${escapeHTML(liability.alias)}</b></div><div><span class="micro-label">KM TRAVELLED*</span><b>${km.toFixed(0)}</b></div><div><span class="micro-label">LATEST BEDTIME</span><b>${late?'05:42':'PENDING'}</b></div><div><span class="micro-label">MOST SIDE QUESTS</span><b>${duoHistory.length||'0'} DUOS</b></div><div><span class="micro-label">BIGGEST COMEBACK</span><b>${escapeHTML(comeback.alias)}</b></div><div><span class="micro-label">QUOTE OF THE TRIP</span><b style="font-size:16px">“${escapeHTML(phrase)}”</b></div></div><p class="lede" style="margin-top:16px">*Estimated from incident density, taxi lore and an unverified beach walk.</p>`, 'wrapped', true); }

document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>({event:eventModal,quote:quoteModal,quoteQuiz:quoteQuizModal,quest:questModal,court:courtModal,wheel:wheelModal,exchange:exchangeModal,npc:npcModal,var:varModal,lore:loreModal,duo:duoModal,morning:morningModal,wrapped:wrappedModal}[b.dataset.open]()));
$('#closeModal').onclick=closeModal; $('#backdrop').onclick=closeModal; document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
$('#viewAll').onclick=()=>{ rosterFilter = rosterFilter === 'active' ? 'inactive' : 'active'; renderPeople(); document.querySelector('.people-grid').scrollIntoView({behavior:'smooth',block:'start'}); toast(`${rosterFilter.toUpperCase()} ROSTER DISPLAYED`); };
$('#requestChange').onclick=()=>changeRequestModal();
$('#undoLast').onclick=undoLastChange;
function archiveModal() {
  openModal(`<h2 id="modalTitle">ARCHIVE CONTROL</h2><p class="lede">This device keeps an IndexedDB master archive. Export a backup after meaningful lore; import restores a previously exported archive.</p><div class="quest-card"><span class="micro-label">ARCHIVE STATUS</span><h3>${events.length} INCIDENTS · ${quotes.length} QUOTES</h3><p class="lede" style="margin:8px 0 0">${npcs.length} NPCS · ${morningReports.length} TESTIMONIES · ${auditLog.length} AUDIT ENTRIES</p></div><div class="quest-actions" style="margin-top:14px"><button class="secondary-button" id="exportArchive">EXPORT JSON</button><label class="secondary-button" style="display:grid;place-items:center;padding:12px">IMPORT JSON<input id="importArchive" type="file" accept="application/json" hidden></label></div><p class="lede" style="margin-top:18px">Forward incoming Babylon emails here and I’ll add them to the checked-in canonical ledger for the next deployment.</p>`, 'archive');
  $('#exportArchive').onclick = () => { const blob = new Blob([JSON.stringify(currentArchive(), null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `babylon-flow-archive-${new Date().toISOString().slice(0,10)}.json`; link.click(); URL.revokeObjectURL(link.href); toast('ARCHIVE BACKUP EXPORTED'); };
  $('#importArchive').onchange = event => { const file = event.target.files[0]; if (!file) return; if (file.size > 5 * 1024 * 1024) { toast('IMPORT REJECTED · FILE TOO LARGE'); return; } const reader = new FileReader(); reader.onload = async () => { try { const incoming = migrateArchive(JSON.parse(reader.result)); applyArchive(incoming); addAudit('Archive restored', file.name); await archiveDB.set(currentArchive()); renderPeople(); renderMarket(); renderTimeline(); closeModal(); toast('ARCHIVE RESTORED · CANON PRESERVED'); } catch { toast('IMPORT REJECTED · INVALID ARCHIVE'); } }; reader.readAsText(file); };
}
$('#adminButton').onclick=archiveModal;
$('#clearData').onclick=()=>{if(confirm('Reset this device to the checked-in canonical ledger?')){applyArchive(canonicalArchive());addAudit('Archive reset','Restored canonical ledger');save();toast('CANONICAL LEDGER RESTORED');}};
loadArchive();
setupAccessGate();
