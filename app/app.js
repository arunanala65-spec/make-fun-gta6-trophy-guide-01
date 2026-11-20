// Vice Platinum Tracker: checklist, filters, spoiler setting, roadmap and
// missable flags for the 55 GTA 6 trophies. All data lives in data/trophies.json
// and progress lives in localStorage; nothing is fetched from the network.
const STORAGE_KEY = 'vice-platinum-tracker-v1';
const DEMO_EARNED_IDS = [2, 3, 4, 5, 8, 9, 10, 15, 16, 17, 21, 22, 25];

const ROADMAP_STAGES = [
  { title: 'Stage 1 — Story, Chapters 1–4', hours: '~60 h', text: 'Play the story in order: Gone Fishing, then Chapters 1, 2, 3 and 4, then the final mission. Earns Just Like Paradise, Paradise Lost, T**s Ass Drug Money, Vice City, Baby!, Top Of The World, Ma and the gold You Gotta Know When to Get Off.' },
  { title: 'Stage 2 — Heists & stranger strands', hours: '~30 h', text: 'Finish the heist missions The Cartel Heist, VCIA Takedown and Operation Savage Glory, plus the stranger strands for Andy, Kenton, Billy, Randy and Tyrone. Earns Break the Bank, Hi-Jacked, Snow Storm, Strangers & Freaks (8 strands) and the five strand finales.' },
  { title: 'Stage 3 — Activities & races', hours: '~40 h', text: 'Sample all 9 activity types for Master of None, then grind the counted ones: 250 stunts, 42 Shooting Range challenges for gold, 14 Top Fun drone race locations, 20 different race wins, and the fishing, arcade and bowling activities.' },
  { title: 'Stage 4 — Collectibles & exploration', hours: '~50 h', text: 'Hunt the counted collectibles: 3 Collectible Card sets, WAiNK It at 100 locations, 100 vehicles discovered, all garage properties, and exploring all of Leonida. Do the Chapter 1 meditation spots for Positive Mental Attitude before leaving Chapter 1.' },
  { title: 'Stage 5 — Cleanup & 100%', hours: '~20 h', text: 'Finish the remaining challenges, money and robbery trophies, then check the in-game 100% list. A Long Road (gold, 100% completion) and the platinum Vice Got a Price! pop last.' },
];

const listEl = document.getElementById('trophyList');
const detailEl = document.getElementById('detailPane');
const missableListEl = document.getElementById('missableList');
const shownCountEl = document.getElementById('shownCount');
const earnedCountEl = document.getElementById('earnedCount');
const progressFillEl = document.getElementById('progressFill');
const searchBox = document.getElementById('searchBox');
const spoilerToggle = document.getElementById('spoilerToggle');

const params = new URLSearchParams(location.search);
const state = {
  trophies: [],
  earned: loadSavedProgress(),
  tier: params.get('tier') || 'all',
  kind: params.get('kind') || 'all',
  query: '',
  spoiler: params.get('spoiler') === 'on',
  tab: params.get('tab') || 'tracker',
  selectedId: Number(params.get('select')) || 17,
};

function loadSavedProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(saved) && saved.length > 0) return new Set(saved);
  } catch { /* a corrupt save starts empty */ }
  if (params.get('demo')) return new Set(DEMO_EARNED_IDS);
  return new Set();
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.earned].sort((a, b) => a - b)));
}

function gradeLabel(trophy) { return trophy.grade; }

function isSpoilerHidden(trophy) {
  return state.spoiler && trophy.kind === 'story' && !state.earned.has(trophy.id);
}

function displayName(trophy) {
  return isSpoilerHidden(trophy) ? 'Hidden story trophy' : trophy.name;
}

function displayDescription(trophy) {
  return isSpoilerHidden(trophy) ? 'Hidden until earned — the spoiler setting is on.' : trophy.description;
}

function trophyMatchesFilters(trophy) {
  if (state.tier !== 'all' && trophy.grade !== state.tier) return false;
  if (state.kind === 'missable' && !trophy.missable) return false;
  if (state.kind !== 'all' && state.kind !== 'missable' && trophy.kind !== state.kind) return false;
  if (state.query && !trophy.name.toLowerCase().includes(state.query)) return false;
  return true;
}

function renderProgress() {
  const earned = state.earned.size;
  earnedCountEl.textContent = String(earned);
  progressFillEl.style.width = Math.round((earned / state.trophies.length) * 100) + '%';
}

function renderChecklist() {
  const shown = state.trophies.filter(trophyMatchesFilters);
  shownCountEl.textContent = shown.length + ' trophies shown';
  listEl.replaceChildren();
  if (shown.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'No trophies match these filters.';
    listEl.append(empty);
    return;
  }
  for (const trophy of shown) {
    const item = document.createElement('li');
    if (state.earned.has(trophy.id)) item.classList.add('earned');
    if (trophy.id === state.selectedId) item.classList.add('selected');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = state.earned.has(trophy.id);
    box.setAttribute('aria-label', 'Earned: ' + displayName(trophy));
    box.addEventListener('change', () => {
      toggleEarned(trophy.id, box.checked);
    });
    box.addEventListener('click', (event) => event.stopPropagation());
    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'tname';
    name.textContent = displayName(trophy);
    const desc = document.createElement('div');
    desc.className = 'tdesc';
    desc.textContent = displayDescription(trophy);
    const meta = document.createElement('div');
    meta.className = 'tmeta';
    const badge = document.createElement('span');
    badge.className = 'badge ' + trophy.grade;
    badge.textContent = gradeLabel(trophy);
    meta.append(badge, document.createTextNode(' · ' + trophy.kind));
    if (trophy.missable) {
      const flag = document.createElement('span');
      flag.className = 'flag';
      flag.textContent = ' · ⚠ missable';
      meta.append(flag);
    }
    if (trophy.status === 'unconfirmed') {
      const note = document.createElement('span');
      note.className = 'unconf';
      note.textContent = ' · belum terkonfirmasi';
      meta.append(note);
    }
    body.append(name, desc, meta);
    item.append(box, body);
    item.addEventListener('click', () => {
      state.selectedId = trophy.id;
      renderChecklist();
      renderDetail();
    });
    listEl.append(item);
  }
}

function renderDetail() {
  const trophy = state.trophies.find((t) => t.id === state.selectedId) || state.trophies[0];
  if (!trophy) return;
  detailEl.replaceChildren();
  const heading = document.createElement('h2');
  heading.textContent = displayName(trophy);
  const grade = document.createElement('p');
  grade.className = 'grade';
  const badge = document.createElement('span');
  badge.className = 'badge ' + trophy.grade;
  badge.textContent = gradeLabel(trophy);
  grade.append(badge, document.createTextNode(' · ' + trophy.kind + ' · ' + (trophy.hidden ? 'hidden trophy' : 'shown trophy')));
  const desc = document.createElement('p');
  desc.textContent = displayDescription(trophy);
  const guide = document.createElement('p');
  guide.className = 'guide';
  guide.textContent = trophy.guide;
  detailEl.append(heading, grade, desc, guide);
  if (trophy.missable) {
    const warn = document.createElement('p');
    warn.className = 'warn';
    warn.textContent = trophy.id === 28
      ? 'Missable: the only trophy that may lock for good — meditate at the Chapter 1 spots before leaving Chapter 1.'
      : 'Missable: tied to this story chapter or mission — finish it here, or replay the mission afterwards.';
    detailEl.append(warn);
  }
  const source = document.createElement('p');
  source.className = 'source';
  source.textContent = 'Source: ' + trophy.source + ' — name, description and grade from the official PlayStation list (Exophase / PSNProfiles). Guide in our own words.';
  detailEl.append(source);
  const earnedNote = document.createElement('p');
  earnedNote.className = 'source';
  earnedNote.textContent = state.earned.has(trophy.id) ? '✓ Earned — ticked in your checklist.' : 'Not earned yet — tick the box to mark it earned.';
  detailEl.append(earnedNote);
}

function renderMissables() {
  const missables = state.trophies.filter((t) => t.missable);
  missableListEl.replaceChildren();
  for (const trophy of missables) {
    const item = document.createElement('li');
    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'tname';
    name.textContent = trophy.name;
    const desc = document.createElement('div');
    desc.className = 'tdesc';
    desc.textContent = trophy.description + (trophy.id === 28 ? ' — the one trophy that may be missable for good.' : ' — finish it in its mission; mission replay can recover it.');
    body.append(name, desc);
    item.append(body);
    missableListEl.append(item);
  }
}

function renderRoadmap() {
  const stagesEl = document.getElementById('roadmapStages');
  stagesEl.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const item = document.createElement('li');
    const heading = document.createElement('h3');
    heading.textContent = stage.title;
    const hours = document.createElement('p');
    hours.className = 'hours';
    hours.textContent = stage.hours;
    const text = document.createElement('p');
    text.textContent = stage.text;
    item.append(heading, hours, text);
    stagesEl.append(item);
  }
}

function renderTabs() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.tab === state.tab);
  });
  document.getElementById('view-tracker').classList.toggle('hidden', state.tab !== 'tracker');
  document.getElementById('view-roadmap').classList.toggle('hidden', state.tab !== 'roadmap');
  document.getElementById('view-missables').classList.toggle('hidden', state.tab !== 'missables');
}

function renderFilterChips() {
  document.querySelectorAll('#tierFilters .chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.tier === state.tier);
  });
  document.querySelectorAll('#kindFilters .chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.kind === state.kind);
  });
  spoilerToggle.checked = state.spoiler;
}

function renderAll() {
  renderProgress();
  renderChecklist();
  renderDetail();
  renderMissables();
  renderRoadmap();
  renderTabs();
  renderFilterChips();
}

function toggleEarned(id, earned) {
  if (earned) state.earned.add(id);
  else state.earned.delete(id);
  saveProgress();
  renderProgress();
  renderChecklist();
  renderDetail();
}

function exportProgress() {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...state.earned].sort((a, b) => a - b) }, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'vice-platinum-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

function importProgress(file) {
  if (!file) return;
  file.text().then((text) => {
    const data = JSON.parse(text);
    const ids = Array.isArray(data) ? data : data.earned;
    const valid = new Set(state.trophies.map((t) => t.id));
    state.earned = new Set(ids.filter((id) => valid.has(id)));
    saveProgress();
    renderAll();
  }).catch(() => {
    alert('That file is not a Vice Platinum Tracker progress file.');
  });
}

document.querySelectorAll('#tierFilters .chip').forEach((chip) => {
  chip.addEventListener('click', () => { state.tier = chip.dataset.tier; renderFilterChips(); renderChecklist(); });
});
document.querySelectorAll('#kindFilters .chip').forEach((chip) => {
  chip.addEventListener('click', () => { state.kind = chip.dataset.kind; renderFilterChips(); renderChecklist(); });
});
document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => { state.tab = tab.dataset.tab; renderTabs(); });
});
searchBox.addEventListener('input', () => {
  state.query = searchBox.value.trim().toLowerCase();
  renderChecklist();
});
spoilerToggle.addEventListener('change', () => {
  state.spoiler = spoilerToggle.checked;
  renderChecklist();
  renderDetail();
});
document.getElementById('exportBtn').addEventListener('click', exportProgress);
document.getElementById('importFile').addEventListener('change', (event) => {
  importProgress(event.target.files[0]);
  event.target.value = '';
});
document.getElementById('resetBtn').addEventListener('click', () => {
  state.earned = new Set();
  saveProgress();
  renderAll();
});

const data = await (await fetch('data/trophies.json')).json();
state.trophies = data.trophies;
if (!state.trophies.some((t) => t.id === state.selectedId)) state.selectedId = state.trophies[0].id;
document.getElementById('missableTabCount').textContent = String(state.trophies.filter((t) => t.missable).length);
renderAll();
