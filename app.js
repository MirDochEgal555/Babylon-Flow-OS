const store = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(`babylon-${key}`)) || fallback; } catch { return fallback; } },
  set(key, value) { localStorage.setItem(`babylon-${key}`, JSON.stringify(value)); }
};

let people = store.get('people', BABYLON_PEOPLE);
let events = store.get('events', BABYLON_EVENTS);
let quotes = store.get('quotes', BABYLON_QUOTES);
let activeModal = null;
const $ = (s) => document.querySelector(s);
const initials = (name) => name.split(' ').map(x => x[0]).join('').slice(0,2);
const title = (id) => people.find(p => p.id === id)?.alias || id;
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
  if (!response.ok || result.success === false) throw new Error(result.message || 'Email could not be sent');
  return result;
}

function notifyLog(kind, details) {
  emailLog(kind, details)
    .then(result => toast(/activat|confirm/i.test(result.message || '')
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
  $('#peopleGrid').innerHTML = people.map(p => `
    <article class="person-card" style="--person:var(--${p.accent})" data-person="${p.id}" title="Open ${p.name}'s asset profile">
      <div class="avatar">${initials(p.alias)}</div><span class="animal">${p.animal} CLASS</span>
      <h3>${p.alias}</h3><div class="name">${p.name.toUpperCase()} · €${p.stock.toFixed(1)}</div>
      <div class="bars">
        ${statBar('AURA', p.stats.aura)}${statBar('CHAOS', p.stats.chaos)}${statBar('IBIZA', p.stats.ibiza)}
      </div><span class="person-xp">${p.stats.xp} XP</span>
    </article>`).join('');
  document.querySelectorAll('[data-person]').forEach(c => c.onclick = () => openPerson(c.dataset.person));
}
function statBar(label, value) { return `<div><div class="bar-label"><span>${label}</span><span>${value}</span></div><div class="bar"><span style="width:${Math.min(value,100)}%"></span></div></div>`; }
function renderMarket() {
  const best = [...people].sort((a,b) => b.stock-a.stock)[0], chaos = [...people].sort((a,b)=>b.stats.chaos-a.stats.chaos)[0];
  $('#marketCard').innerHTML = `<div class="market-main"><span class="micro-label">AFTER-HOURS BRIEFING</span><p><strong class="up">${best.alias} ▲ 11.7%</strong><br>Strong DJ guidance and unexpectedly competent Spanish have driven an upgrade in investor confidence.</p></div><div class="market-stats"><div><span class="micro-label">TOP ASSET</span><b>${best.alias}</b></div><div><span class="micro-label">CHAOS INDEX</span><b>${chaos.stats.chaos}/100</b></div><div><span class="micro-label">SHOE RESERVE</span><b>02</b></div></div>`;
}
function renderTimeline() {
  $('#timeline').innerHTML = events.map(e => `<article class="timeline-item"><div><span class="event-type">${e.type}</span></div><div><h3>${e.title}</h3><p>${e.description}</p></div><div class="event-meta">${e.location || 'FIELD UNKNOWN'}<br><strong>${e.change || 'LOGGED'}</strong><br>${e.time}</div></article>`).join('');
}
function save() { store.set('people', people); store.set('events', events); store.set('quotes', quotes); renderPeople(); renderMarket(); renderTimeline(); }
function openModal(content, kind) { activeModal = kind; $('#modalBody').innerHTML = content; $('#backdrop').classList.add('open'); $('#modal').classList.add('open'); }
function closeModal() { $('#backdrop').classList.remove('open'); $('#modal').classList.remove('open'); activeModal = null; }
function toast(message) { const t = $('#toast'); t.textContent = message; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 2700); }
const peopleOptions = (multiple=false) => people.map(p=>`<option value="${p.id}">${p.alias} — ${p.name}</option>`).join('');

function eventModal() { openModal(`<h2 id="modalTitle">LOG EVENT</h2><p class="lede">Create a permanent record of an operational incident.</p><form id="eventForm"><div class="form-grid"><div><label>PEOPLE INVOLVED</label><select name="person">${peopleOptions()}</select></div><div><label>CATEGORY</label><select name="category"><option>RANDOM LORE</option><option>PARTY</option><option>CLUB</option><option>BEACH</option><option>FOOD</option><option>SPORT</option><option>LEGENDARY</option></select></div><div class="full"><label>INCIDENT TITLE</label><input required name="title" autocomplete="off" placeholder="The Supermarket Incident" maxlength="55"></div><div class="full"><label>WHAT HAPPENED</label><textarea name="description" required placeholder="Keep it brief. The timeline is watching." maxlength="180"></textarea></div><div><label>LOCATION</label><input name="location" placeholder="JÁVEA HQ" maxlength="30"></div><div><label>XP AWARD</label><select name="xp"><option value="25">+25 XP</option><option value="50" selected>+50 XP</option><option value="100">+100 XP</option><option value="150">+150 XP</option></select></div></div><button class="submit-button">COMMIT TO THE ARCHIVE →</button></form>`, 'event');
  $('#eventForm').onsubmit = e => { e.preventDefault(); const d = new FormData(e.target), xp=+d.get('xp'), p=people.find(x=>x.id===d.get('person')), location=(d.get('location')||'FIELD UNKNOWN').toUpperCase(); p.stats.xp += xp; p.stock = +(p.stock * (1 + (Math.random()*.06-.015))).toFixed(1); events.unshift({ id:Date.now(), type:d.get('category'), title:d.get('title'), description:d.get('description'), location, people:[p.id], time:'JUST NOW', change:`+${xp} XP`}); save(); closeModal(); notifyLog('Event logged', { 'Person involved': p.alias, Category: d.get('category'), Title: d.get('title'), 'What happened': d.get('description'), Location: location, 'XP award': `+${xp} XP` }); };
}
function quoteModal() { openModal(`<h2 id="modalTitle">LOG QUOTE</h2><p class="lede">The evidentiary archive has no context limit. You should.</p><form id="quoteForm"><div class="form-grid"><div class="full"><label>THE QUOTE</label><textarea required name="quote" placeholder="A sentence future generations will misunderstand." maxlength="180"></textarea></div><div><label>SPEAKER</label><select name="speaker">${peopleOptions()}<option value="UNKNOWN">UNKNOWN ENTITY</option></select></div><div><label>CONTEXT</label><input name="context" placeholder="e.g. 04:00 taxi debate" maxlength="45"></div></div><button class="submit-button">SEAL THE EVIDENCE →</button></form>`, 'quote');
  $('#quoteForm').onsubmit = e => { e.preventDefault(); const d=new FormData(e.target), speaker=title(d.get('speaker')), context=d.get('context'); quotes.unshift({id:Date.now(), quote:d.get('quote'),speaker,context,time:'JUST NOW'}); events.unshift({id:Date.now()+1,type:'QUOTE',title:`“${d.get('quote').slice(0,48)}${d.get('quote').length>48?'…':''}”`,description:`Entered into evidence by ${speaker}${context ? ` · ${context}` : ''}.`,location:'QUOTE ARCHIVE',time:'JUST NOW',change:'RECORDED'}); save(); closeModal(); notifyLog('Quote logged', { Speaker: speaker, Quote: d.get('quote'), Context: context || 'Not supplied' }); };
}
function questModal(quest = BABYLON_QUESTS[Math.floor(Math.random()*BABYLON_QUESTS.length)]) { openModal(`<h2 id="modalTitle">SIDE QUEST</h2><p class="lede">Optional mission. Mandatory lore potential.</p><div class="quest-card"><span class="rarity">${quest.rarity} ASSIGNMENT</span><h3>${quest.mission}</h3><div class="quest-details"><span>LOCATION <b>${quest.place}</b></span><span>REWARD <b>+${quest.xp} XP</b></span></div></div><div class="quest-actions"><button class="secondary-button" id="reroll">REROLL</button><button class="submit-button" id="completeQuest">COMPLETE QUEST</button></div>`, 'quest');
  $('#reroll').onclick=()=>questModal(); $('#completeQuest').onclick=()=>{ const p=people[Math.floor(Math.random()*people.length)];p.stats.xp+=quest.xp;events.unshift({id:Date.now(),type:'SIDE QUEST',title:'Side quest completed',description:`${p.alias} completed the mission: ${quest.mission}`,location:quest.place,time:'JUST NOW',change:`+${quest.xp} XP`});save();closeModal();toast(`QUEST COMPLETE · ${p.alias} +${quest.xp} XP`);};
}
function courtModal() { openModal(`<h2 id="modalTitle">BABYLON COURT</h2><p class="lede">An independent judicial body with no standards whatsoever.</p><form id="courtForm"><div class="form-grid"><div><label>THE ACCUSED</label><select name="accused">${peopleOptions()}</select></div><div><label>CASE TYPE</label><select name="type"><option>GENERAL MISCONDUCT</option><option>SPANISH CRIMES</option><option>FISCAL NEGLIGENCE</option><option>LORE VIOLATION</option></select></div><div class="full"><label>THE ACCUSATION</label><textarea required name="accusation" placeholder="What exactly are we pretending happened?" maxlength="160"></textarea></div><div class="full"><label>DEFENSE (OPTIONAL / IGNORED)</label><input name="defense" placeholder="An attempt will be filed."></div></div><button class="submit-button">SUBMIT TO VAR →</button></form>`, 'court');
  $('#courtForm').onsubmit=e=>{e.preventDefault();const d=new FormData(e.target);courtProcessing(d);};
}
function courtProcessing(data) { $('#modalBody').innerHTML=`<div class="court-stage"><span class="micro-label">BABYLON JUDICIARY / LIVE</span><div class="court-symbol">⚖</div><h3 id="courtStatus">ANALYSING EVIDENCE…</h3><p>Cross-referencing vibes, witness statements and the shoe archive.</p></div>`; setTimeout(()=>$('#courtStatus').textContent='CHECKING VAR…',900); setTimeout(()=>$('#courtStatus').textContent='CONSULTING BABYLON LAW…',1800); setTimeout(()=>courtVerdict(data),2850); }
function courtVerdict(data) { const accused=people.find(p=>p.id===data.get('accused')); const outcomes=['GUILTY','TECHNICALLY GUILTY','GUILTY','NOT GUILTY','CASE DISMISSED']; const verdict=outcomes[Math.floor(Math.random()*outcomes.length)], sentence=COURT_SENTENCES[Math.floor(Math.random()*COURT_SENTENCES.length)]; if(verdict!=='NOT GUILTY'&&verdict!=='CASE DISMISSED') {accused.stats.chaos=Math.min(100,accused.stats.chaos+5);accused.stock=+(accused.stock*.96).toFixed(1);} events.unshift({id:Date.now(),type:'COURT',title:`${accused.alias}: ${verdict}`,description:`Case: ${data.get('accusation')} Sentence: ${verdict==='NOT GUILTY'||verdict==='CASE DISMISSED'?'The court has somehow allowed this.':sentence}`,location:'BABYLON COURT',time:'JUST NOW',change:verdict==='GUILTY'?'−4% STOCK':'VERDICT FILED'});save(); $('#modalBody').innerHTML=`<div class="court-stage"><span class="micro-label">CASE #${String(Date.now()).slice(-5)} / FINAL</span><div class="verdict"><span class="verdict-label">VERDICT</span><h3>${verdict}</h3><p>After reviewing all available vibes, the court finds ${accused.alias} ${verdict.toLowerCase()}. ${verdict==='NOT GUILTY'?'This establishes no precedent.':`Sentence: ${sentence}`}</p></div><button class="submit-button" id="closeVerdict">ACCEPT BABYLON LAW</button></div>`;$('#closeVerdict').onclick=()=>{closeModal();toast('VERDICT ARCHIVED · THE LAW PREVAILS');}; }
function openPerson(id) { const p=people.find(x=>x.id===id); openModal(`<h2 id="modalTitle">${p.alias}</h2><p class="lede">${p.name.toUpperCase()} · ${p.animal} CLASS · CURRENT ASSET €${p.stock.toFixed(1)}</p><div class="form-grid">${[['AURA',p.stats.aura],['RELIABILITY',p.stats.reliability],['SPANISH FLUENCY',p.stats.spanish],['CHAOS',p.stats.chaos],['FISCAL RESPONSIBILITY',p.stats.fiscal],['IBIZA PERFORMANCE',p.stats.ibiza],['SEX APPEAL',p.stats.appeal],['EXPERIENCE',`${p.stats.xp} XP`]].map(([a,b])=>`<div class="quest-card" style="padding:14px"><span class="micro-label">${a}</span><h3 style="margin:7px 0 0;font-size:25px">${b}</h3></div>`).join('')}</div>`, 'person'); }

document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>({event:eventModal,quote:quoteModal,quest:questModal,court:courtModal}[b.dataset.open]()));
$('#closeModal').onclick=closeModal; $('#backdrop').onclick=closeModal; document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
$('#viewAll').onclick=()=>{ document.querySelector('.people-grid').scrollIntoView({behavior:'smooth',block:'start'}); toast('ALL 7 ACTIVE ASSETS DISPLAYED'); };
$('#adminButton').onclick=()=>toast('ADMIN MODE · LOCAL DEVICE AUTHORITY');
$('#clearData').onclick=()=>{if(confirm('Reset all locally logged events and quotes?')){localStorage.removeItem('babylon-people');localStorage.removeItem('babylon-events');localStorage.removeItem('babylon-quotes');people=BABYLON_PEOPLE.map(x=>({...x,stats:{...x.stats}}));events=[...BABYLON_EVENTS];quotes=[...BABYLON_QUOTES];save();toast('DEMO DATA RESTORED');}};
renderPeople();renderMarket();renderTimeline();
setupAccessGate();
