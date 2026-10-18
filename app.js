/**
 * Dr. Nehmedo Frontal Smile Assessment — Standalone Analytics Dashboard
 * Self-Contained JavaScript with Direct Google Spreadsheet Sync & Chart.js Visualizations
 */

// Application State
const state = {
  rawRecords: [],
  filteredRecords: [],
  headers: [],
  activeQuestionTab: 'all', // 'all' | 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Q5' | 'Q6'
  meta: {
    sheetId: localStorage.getItem('smile_survey_sheet_id') || '1luj9ZvFhZI52_0mHeZ2dlhcVBt0gU0dZy71yWF35R8A',
    sourceType: 'google_direct', // 'live_backend' | 'google_direct' | 'demo'
    lastSync: null,
    totalCount: 0,
  },
  filters: {
    occupation: 'all',
    gender: 'all',
    ageGroup: 'all',
    language: 'all',
    search: '',
  },
  charts: {},
};

// Curvature Questions (The Last 6 Ranking Questions Q1 to Q6)
const CURVATURE_QUESTIONS = [
  {
    id: 'Q1',
    title: 'Question 1: Straight Smile Curvature',
    subtitle: 'Gingival Margin Exposure (Green Level: 0mm to 3mm)',
    category: 'Straight Curvature',
    exposureType: 'Gingival Margin (Green)',
    badgeClass: 'tag-green',
    photos: [
      { id: 'Q1-straight-0-green', exposure: '0 mm', label: '0 mm Exposure', src: './photos/straight-0.jpg' },
      { id: 'Q1-straight-1-green', exposure: '1 mm', label: '1 mm Exposure (G)', src: './photos/straight-1-green.jpg' },
      { id: 'Q1-straight-2-green', exposure: '2 mm', label: '2 mm Exposure (G)', src: './photos/straight-2-green.jpg' },
      { id: 'Q1-straight-3-green', exposure: '3 mm', label: '3 mm Exposure (G)', src: './photos/straight-3-green.jpg' }
    ]
  },
  {
    id: 'Q2',
    title: 'Question 2: Slight Smile Curvature',
    subtitle: 'Gingival Margin Exposure (Green Level: 0mm to 3mm)',
    category: 'Slight Curvature',
    exposureType: 'Gingival Margin (Green)',
    badgeClass: 'tag-green',
    photos: [
      { id: 'Q2-slight-0-green', exposure: '0 mm', label: '0 mm Exposure', src: './photos/slight-0.jpg' },
      { id: 'Q2-slight-1-green', exposure: '1 mm', label: '1 mm Exposure (G)', src: './photos/slight-1-green.jpg' },
      { id: 'Q2-slight-2-green', exposure: '2 mm', label: '2 mm Exposure (G)', src: './photos/slight-2-green.jpg' },
      { id: 'Q2-slight-3-green', exposure: '3 mm', label: '3 mm Exposure (G)', src: './photos/slight-3-green.jpg' }
    ]
  },
  {
    id: 'Q3',
    title: 'Question 3: Reverse / Banana Smile Curvature',
    subtitle: 'Gingival Margin Exposure (Green Level: 0mm to 3mm)',
    category: 'Banana / Reverse Curvature',
    exposureType: 'Gingival Margin (Green)',
    badgeClass: 'tag-green',
    photos: [
      { id: 'Q3-banana-0-green', exposure: '0 mm', label: '0 mm Exposure', src: './photos/banana-0.jpg' },
      { id: 'Q3-banana-1-green', exposure: '1 mm', label: '1 mm Exposure (G)', src: './photos/banana-1-green.jpg' },
      { id: 'Q3-banana-2-green', exposure: '2 mm', label: '2 mm Exposure (G)', src: './photos/banana-2-green.jpg' },
      { id: 'Q3-banana-3-green', exposure: '3 mm', label: '3 mm Exposure (G)', src: './photos/banana-3-green.jpg' }
    ]
  },
  {
    id: 'Q4',
    title: 'Question 4: Straight Smile Curvature',
    subtitle: 'Upper Lip Line Exposure (Red Level: 0mm to 3mm)',
    category: 'Straight Curvature',
    exposureType: 'Lip Line (Red)',
    badgeClass: 'tag-red',
    photos: [
      { id: 'Q4-straight-0-red', exposure: '0 mm', label: '0 mm Exposure', src: './photos/straight-0.jpg' },
      { id: 'Q4-straight-1-red', exposure: '1 mm', label: '1 mm Exposure (R)', src: './photos/straight-1-red.jpg' },
      { id: 'Q4-straight-2-red', exposure: '2 mm', label: '2 mm Exposure (R)', src: './photos/straight-2-red.jpg' },
      { id: 'Q4-straight-3-red', exposure: '3 mm', label: '3 mm Exposure (R)', src: './photos/straight-3-red.jpg' }
    ]
  },
  {
    id: 'Q5',
    title: 'Question 5: Slight Smile Curvature',
    subtitle: 'Upper Lip Line Exposure (Red Level: 0mm to 3mm)',
    category: 'Slight Curvature',
    exposureType: 'Lip Line (Red)',
    badgeClass: 'tag-red',
    photos: [
      { id: 'Q5-slight-0-red', exposure: '0 mm', label: '0 mm Exposure', src: './photos/slight-0.jpg' },
      { id: 'Q5-slight-1-red', exposure: '1 mm', label: '1 mm Exposure (R)', src: './photos/slight-1-red.jpg' },
      { id: 'Q5-slight-2-red', exposure: '2 mm', label: '2 mm Exposure (R)', src: './photos/slight-2-red.jpg' },
      { id: 'Q5-slight-3-red', exposure: '3 mm', label: '3 mm Exposure (R)', src: './photos/slight-3-red.jpg' }
    ]
  },
  {
    id: 'Q6',
    title: 'Question 6: Reverse / Banana Smile Curvature',
    subtitle: 'Upper Lip Line Exposure (Red Level: 0mm to 3mm)',
    category: 'Banana / Reverse Curvature',
    exposureType: 'Lip Line (Red)',
    badgeClass: 'tag-red',
    photos: [
      { id: 'Q6-banana-0-red', exposure: '0 mm', label: '0 mm Exposure', src: './photos/banana-0.jpg' },
      { id: 'Q6-banana-1-red', exposure: '1 mm', label: '1 mm Exposure (R)', src: './photos/banana-1-red.jpg' },
      { id: 'Q6-banana-2-red', exposure: '2 mm', label: '2 mm Exposure (R)', src: './photos/banana-2-red.jpg' },
      { id: 'Q6-banana-3-red', exposure: '3 mm', label: '3 mm Exposure (R)', src: './photos/banana-3-red.jpg' }
    ]
  }
];

// Photo Definitions for the 21 Rating Questions
const PHOTO_CONFIG = [
  { id: 'straight-0', name: 'Straight (0mm)', category: 'straight', exposure: '0mm', src: './photos/straight-0.jpg' },
  { id: 'slight-0', name: 'Slight (0mm)', category: 'slight', exposure: '0mm', src: './photos/slight-0.jpg' },
  { id: 'banana-0', name: 'Banana (0mm)', category: 'banana', exposure: '0mm', src: './photos/banana-0.jpg' },

  { id: 'straight-1-green', name: 'Straight (1mm G)', category: 'straight', exposure: '1mm-G', src: './photos/straight-1-green.jpg' },
  { id: 'slight-1-green', name: 'Slight (1mm G)', category: 'slight', exposure: '1mm-G', src: './photos/slight-1-green.jpg' },
  { id: 'banana-1-green', name: 'Banana (1mm G)', category: 'banana', exposure: '1mm-G', src: './photos/banana-1-green.jpg' },

  { id: 'straight-1-red', name: 'Straight (1mm R)', category: 'straight', exposure: '1mm-R', src: './photos/straight-1-red.jpg' },
  { id: 'slight-1-red', name: 'Slight (1mm R)', category: 'slight', exposure: '1mm-R', src: './photos/slight-1-red.jpg' },
  { id: 'banana-1-red', name: 'Banana (1mm R)', category: 'banana', exposure: '1mm-R', src: './photos/banana-1-red.jpg' },

  { id: 'straight-2-green', name: 'Straight (2mm G)', category: 'straight', exposure: '2mm-G', src: './photos/straight-2-green.jpg' },
  { id: 'slight-2-green', name: 'Slight (2mm G)', category: 'slight', exposure: '2mm-G', src: './photos/slight-2-green.jpg' },
  { id: 'banana-2-green', name: 'Banana (2mm G)', category: 'banana', exposure: '2mm-G', src: './photos/banana-2-green.jpg' },

  { id: 'straight-2-red', name: 'Straight (2mm R)', category: 'straight', exposure: '2mm-R', src: './photos/straight-2-red.jpg' },
  { id: 'slight-2-red', name: 'Slight (2mm R)', category: 'slight', exposure: '2mm-R', src: './photos/slight-2-red.jpg' },
  { id: 'banana-2-red', name: 'Banana (2mm R)', category: 'banana', exposure: '2mm-R', src: './photos/banana-2-red.jpg' },

  { id: 'straight-3-green', name: 'Straight (3mm G)', category: 'straight', exposure: '3mm-G', src: './photos/straight-3-green.jpg' },
  { id: 'slight-3-green', name: 'Slight (3mm G)', category: 'slight', exposure: '3mm-G', src: './photos/slight-3-green.jpg' },
  { id: 'banana-3-green', name: 'Banana (3mm G)', category: 'banana', exposure: '3mm-G', src: './photos/banana-3-green.jpg' },

  { id: 'straight-3-red', name: 'Straight (3mm R)', category: 'straight', exposure: '3mm-R', src: './photos/straight-3-red.jpg' },
  { id: 'slight-3-red', name: 'Slight (3mm R)', category: 'slight', exposure: '3mm-R', src: './photos/slight-3-red.jpg' },
  { id: 'banana-3-red', name: 'Banana (3mm R)', category: 'banana', exposure: '3mm-R', src: './photos/banana-3-red.jpg' },
];

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupEventListeners();
  loadData();
});

// Event Listeners
function setupEventListeners() {
  document.getElementById('refreshBtn')?.addEventListener('click', () => loadData(true));
  document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);
  document.getElementById('floatingThemeBtn')?.addEventListener('click', toggleTheme);
  document.getElementById('dataSourceBtn')?.addEventListener('click', openDataSourceModal);
  document.getElementById('exportCsvBtn')?.addEventListener('click', exportToCsv);
  document.getElementById('printReportBtn')?.addEventListener('click', () => window.print());

  // Filter Dropdowns
  document.getElementById('filterOccupation')?.addEventListener('change', (e) => {
    state.filters.occupation = e.target.value;
    applyFilters();
  });
  document.getElementById('filterGender')?.addEventListener('change', (e) => {
    state.filters.gender = e.target.value;
    applyFilters();
  });
  document.getElementById('filterAgeGroup')?.addEventListener('change', (e) => {
    state.filters.ageGroup = e.target.value;
    applyFilters();
  });
  document.getElementById('filterLanguage')?.addEventListener('change', (e) => {
    state.filters.language = e.target.value;
    applyFilters();
  });
  document.getElementById('searchInput')?.addEventListener('input', (e) => {
    state.filters.search = e.target.value.toLowerCase().trim();
    applyFilters();
  });
  document.getElementById('resetFiltersBtn')?.addEventListener('click', resetFilters);

  // Curvature Question Tab Buttons
  document.querySelectorAll('.q-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const qId = e.currentTarget.getAttribute('data-question');
      setActiveQuestionTab(qId);
    });
  });

  // Modal Handlers
  document.getElementById('modalCloseBtn')?.addEventListener('click', closeModal);
  document.getElementById('sourceModalCloseBtn')?.addEventListener('click', closeDataSourceModal);
  document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') closeModal();
  });
  document.getElementById('sourceModalOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'sourceModalOverlay') closeDataSourceModal();
  });

  // Data Source Settings
  document.getElementById('saveSourceBtn')?.addEventListener('click', handleSaveCustomSource);
  document.getElementById('loadDemoBtn')?.addEventListener('click', () => {
    closeDataSourceModal();
    loadDemoDataset();
  });
}

// -------------------------------------------------------------
// Data Fetching: Multi-Strategy (Direct Google Sheet CSV / API)
// -------------------------------------------------------------
async function loadData(forceRefresh = false) {
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) refreshBtn.classList.add('btn-spinning');

  updateStatusBadge('syncing', 'Connecting to Google Sheets...');

  // Strategy 1: If hosted alongside Next.js backend on localhost, try /api/responses
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  let fetchedViaBackend = false;

  if (isLocalhost) {
    try {
      const res = await fetch(`/api/responses?_t=${Date.now()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.ok && Array.isArray(json.records)) {
          state.rawRecords = json.records;
          state.headers = json.headers || [];
          state.meta.sheetId = json.sheetId || state.meta.sheetId;
          state.meta.sourceType = 'live_backend';
          state.meta.lastSync = new Date();
          updateStatusBadge('live', `Google Sheet Connected (${state.rawRecords.length} rows)`);
          updateBannerInfo();
          applyFilters();
          fetchedViaBackend = true;
        }
      }
    } catch (e) {
      // Expected when running standalone outside Next.js
    }
  }

  if (fetchedViaBackend) {
    if (refreshBtn) refreshBtn.classList.remove('btn-spinning');
    return;
  }

  // Strategy 2: Direct Google Sheet CSV Export via Google Visualization API
  // This allows the standalone dashboard to be hosted on GitHub Pages, Netlify, or run locally!
  try {
    const sheetId = state.meta.sheetId;
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Responses&_t=${Date.now()}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Google Sheets responded with HTTP ${res.status}`);
    }

    const csvText = await res.text();
    const parsed = parseCsv(csvText);

    if (parsed.records && parsed.records.length > 0) {
      state.rawRecords = parsed.records;
      state.headers = parsed.headers;
      state.meta.sourceType = 'google_direct';
      state.meta.lastSync = new Date();
      updateStatusBadge('live', `Live Google Sheet (${state.rawRecords.length} rows)`);
      updateBannerInfo();
      applyFilters();
      return;
    } else {
      throw new Error('Google Sheet returned 0 data rows');
    }
  } catch (err) {
    console.warn('[Dashboard] Direct Google Sheet fetch failed or offline:', err.message);
    loadDemoDataset(true);
  } finally {
    if (refreshBtn) refreshBtn.classList.remove('btn-spinning');
  }
}

// Robust CSV Parser (supports quotes, numbers, UTF-8 Arabic text)
function parseCsv(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let currentVal = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(currentVal.trim());
      if (row.some(val => val !== '')) lines.push(row);
      row = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  if (currentVal || row.length > 0) {
    row.push(currentVal.trim());
    if (row.some(val => val !== '')) lines.push(row);
  }

  if (lines.length === 0) return { headers: [], records: [] };

  const headers = lines[0].map(h => h.replace(/^"|"$/g, '').trim());
  const records = lines.slice(1).map((rowVals, idx) => {
    const rec = { _rowIndex: idx + 2 };
    headers.forEach((h, colIdx) => {
      let raw = rowVals[colIdx] !== undefined ? rowVals[colIdx].replace(/^"|"$/g, '').trim() : '';
      const num = Number(raw);
      if (!isNaN(num) && raw !== '' && !h.includes('id') && h !== 'timestamp' && h !== 'language' && h !== 'name' && h !== 'gender' && h !== 'age_group' && h !== 'occupation') {
        rec[h] = num;
      } else {
        rec[h] = raw;
      }
    });
    return rec;
  });

  return { headers, records };
}

// -------------------------------------------------------------
// Demo Dataset Generator (Realistic 24 Participants)
// -------------------------------------------------------------
function generateDemoDataset() {
  const occupations = ['orthodontist', 'dentist', 'non_dental'];
  const ageGroups = ['18_24', '25_34', '35_45', 'over_45'];
  const genders = ['male', 'female'];
  const languages = ['ar', 'en'];

  const namesAr = ['د. سارة محمود', 'د. أحمد كامل', 'نورهان فكري', 'د. طارق مصطفى', 'ياسمين الشريف', 'عمر حسان', 'منى عبد العزيز', 'د. كريم فهمي'];
  const namesEn = ['Dr. Laura Chen', 'Dr. Michael Vance', 'Sophia Turner', 'Dr. David Miller', 'Emma Watson', 'James Harris', 'Olivia Brown', 'Dr. Noah Reed'];

  const records = [];

  for (let i = 1; i <= 24; i++) {
    const isDental = i % 3 !== 0;
    const occ = isDental ? (i % 2 === 0 ? 'orthodontist' : 'dentist') : 'non_dental';
    const lang = languages[i % 2];
    const name = lang === 'ar' ? namesAr[i % namesAr.length] + ` (${i})` : namesEn[i % namesEn.length] + ` (${i})`;
    const gender = genders[i % 2];
    const age = ageGroups[i % ageGroups.length];
    const workExp = isDental ? Math.floor(3 + (i * 1.5)) : '';
    const duration = 75 + Math.floor(Math.sin(i) * 35) + 30;

    const row = {
      _rowIndex: i + 1,
      submission_id: `sub_demo_${1000 + i}`,
      timestamp: new Date(Date.now() - i * 3600000 * 4).toISOString(),
      language: lang,
      duration_seconds: duration,
      name: name,
      gender: gender,
      age_group: age,
      occupation: occ,
      work_experience: workExp,
    };

    // Smile ratings (10 - 100)
    PHOTO_CONFIG.forEach((p) => {
      let baseScore = 65;
      if (p.category === 'slight') baseScore = 80;
      if (p.category === 'straight') baseScore = 65;
      if (p.category === 'banana') baseScore = 40;

      if (occ === 'orthodontist') {
        if (p.exposure.includes('3mm')) baseScore -= 15;
        if (p.exposure === '0mm' && p.category === 'slight') baseScore += 10;
      }

      const score = Math.min(100, Math.max(10, Math.round((baseScore + (Math.sin(i + p.id.length) * 16)) / 10) * 10));
      row[p.id] = score;
    });

    // Realistic rankings for Q1 - Q6
    // Generally 0mm and 1mm are ranked 1st and 2nd, while 3mm is ranked 4th
    CURVATURE_QUESTIONS.forEach((q) => {
      // Deterministic slight bias towards 0mm & 1mm
      const order = [0, 1, 2, 3];
      if (occ === 'orthodontist') {
        // Orthodontists favor 0mm or 1mm as rank 1
        order.sort((a, b) => (a + (Math.sin(i * 3 + a) * 0.4)) - (b + (Math.sin(i * 3 + b) * 0.4)));
      } else {
        order.sort((a, b) => Math.sin(i * 7 + a * 2 + q.id.charCodeAt(1)) - 0.5);
      }

      q.photos.forEach((photo, idx) => {
        row[photo.id] = order[idx] + 1; // 1-indexed (1 to 4)
      });
    });

    records.push(row);
  }

  return records;
}

function loadDemoDataset(isFallback = false) {
  state.rawRecords = generateDemoDataset();
  state.headers = Object.keys(state.rawRecords[0]).filter(k => k !== '_rowIndex');
  state.meta.sourceType = 'demo';
  state.meta.lastSync = new Date();

  updateStatusBadge('demo', isFallback ? 'Offline / Demo Mode (24 Responses)' : 'Demo Dataset Loaded');
  updateBannerInfo();
  applyFilters();
}

function updateBannerInfo() {
  const banner = document.getElementById('sheetMetaBanner');
  if (!banner) return;

  if (state.meta.sourceType === 'demo') {
    banner.innerHTML = `
      <div>
        <strong>ℹ️ Demo Dataset Active:</strong> Showing 24 realistic participants (Orthodontists, Dentists & General Public).
      </div>
      <button class="btn btn-secondary" style="padding: 5px 12px; font-size: 0.76rem;" onclick="loadData(true)">Sync Live Google Sheet</button>
    `;
  } else {
    banner.innerHTML = `
      <div>
        <strong>📊 Google Sheet:</strong> Tab <code>Responses</code> | Sheet ID: <code>${state.meta.sheetId}</code>
        <span style="margin-left: 8px; opacity: 0.85;">(${state.rawRecords.length} synchronized responses)</span>
      </div>
      <div>
        <span class="sheet-source-tag">${state.meta.sourceType === 'live_backend' ? 'Backend Live Sync' : 'Direct Google Sheets CORS Sync'}</span>
      </div>
    `;
  }
}

// -------------------------------------------------------------
// Filters & Data Aggregation
// -------------------------------------------------------------
function applyFilters() {
  const { occupation, gender, ageGroup, language, search } = state.filters;

  state.filteredRecords = state.rawRecords.filter((row) => {
    if (occupation !== 'all' && String(row.occupation).toLowerCase() !== occupation) return false;
    if (gender !== 'all' && String(row.gender).toLowerCase() !== gender) return false;
    if (ageGroup !== 'all' && String(row.age_group).toLowerCase() !== ageGroup) return false;
    if (language !== 'all' && String(row.language).toLowerCase() !== language) return false;

    if (search) {
      const name = String(row.name || '').toLowerCase();
      const id = String(row.submission_id || '').toLowerCase();
      if (!name.includes(search) && !id.includes(search)) return false;
    }
    return true;
  });

  updateToolbarCounter();
  computeAndRenderKPIs();
  renderCurvatureSection();
  renderGeneralCharts();
  renderPhotoGallery();
  renderDataTable();
}

function resetFilters() {
  state.filters = { occupation: 'all', gender: 'all', ageGroup: 'all', language: 'all', search: '' };
  const setSelect = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  setSelect('filterOccupation', 'all');
  setSelect('filterGender', 'all');
  setSelect('filterAgeGroup', 'all');
  setSelect('filterLanguage', 'all');
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  applyFilters();
}

function updateToolbarCounter() {
  const countEl = document.getElementById('filteredCount');
  if (countEl) countEl.textContent = state.filteredRecords.length;
  const totalEl = document.getElementById('totalCount');
  if (totalEl) totalEl.textContent = state.rawRecords.length;
}

// -------------------------------------------------------------
// KPI Summary Cards (Total Numbers)
// -------------------------------------------------------------
function computeAndRenderKPIs() {
  const list = state.filteredRecords;
  const count = list.length;

  setText('kpiTotalSubmissions', count.toLocaleString());
  setText('kpiTotalSubtitle', count === state.rawRecords.length ? '100% of recorded responses' : `Filtered from ${state.rawRecords.length} total`);

  if (count === 0) {
    setText('kpiAvgDuration', '0m 00s');
    setText('kpiGenderRatio', '0% M / 0% F');
    setText('kpiProfessionBreakdown', '0% Dental');
    setText('kpiAvgSmileRating', '0.0 / 100');
    setText('kpiAvgExperience', '0.0 yrs');
    return;
  }

  // Duration
  const totalSeconds = list.reduce((acc, r) => acc + (Number(r.duration_seconds) || 0), 0);
  const avgSeconds = Math.round(totalSeconds / count);
  setText('kpiAvgDuration', `${Math.floor(avgSeconds / 60)}m ${avgSeconds % 60 < 10 ? '0' : ''}${avgSeconds % 60}s`);

  // Gender
  const maleCount = list.filter((r) => String(r.gender).toLowerCase() === 'male').length;
  const femaleCount = list.filter((r) => String(r.gender).toLowerCase() === 'female').length;
  const malePct = Math.round((maleCount / count) * 100) || 0;
  const femalePct = Math.round((femaleCount / count) * 100) || 0;
  setText('kpiGenderRatio', `${malePct}% M / ${femalePct}% F`);
  setText('kpiGenderSubtitle', `${maleCount} Male · ${femaleCount} Female`);

  // Profession
  const orthoCount = list.filter((r) => String(r.occupation).toLowerCase() === 'orthodontist').length;
  const dentistCount = list.filter((r) => String(r.occupation).toLowerCase() === 'dentist').length;
  const nonDentalCount = list.filter((r) => String(r.occupation).toLowerCase() === 'non_dental').length;
  const dentalTotal = orthoCount + dentistCount;
  const dentalPct = Math.round((dentalTotal / count) * 100) || 0;
  setText('kpiProfessionBreakdown', `${dentalPct}% Dental`);
  setText('kpiProfessionSubtitle', `${orthoCount} Ortho · ${dentistCount} Dentist · ${nonDentalCount} Lay`);

  // Overall Smile Rating
  let ratingSum = 0;
  let ratingCount = 0;
  PHOTO_CONFIG.forEach((p) => {
    list.forEach((r) => {
      const val = Number(r[p.id]);
      if (!isNaN(val) && val > 0) {
        ratingSum += val;
        ratingCount++;
      }
    });
  });
  setText('kpiAvgSmileRating', ratingCount > 0 ? `${(ratingSum / ratingCount).toFixed(1)} / 100` : '0.0 / 100');

  // Work Experience
  const dentalList = list.filter((r) => r.work_experience !== '' && r.work_experience !== undefined && !isNaN(Number(r.work_experience)));
  const expSum = dentalList.reduce((acc, r) => acc + Number(r.work_experience), 0);
  setText('kpiAvgExperience', dentalList.length > 0 ? `${(expSum / dentalList.length).toFixed(1)} yrs` : '0.0 yrs');
  setText('kpiExperienceSubtitle', `Based on ${dentalList.length} specialists`);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// -------------------------------------------------------------
// Curvature Analysis: Questions 1 to 6 (Click-to-Rate Rankings)
// -------------------------------------------------------------
function setActiveQuestionTab(tabKey) {
  state.activeQuestionTab = tabKey;

  // Update tab buttons style
  document.querySelectorAll('.q-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-question') === tabKey) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderCurvatureSection();
}

function renderCurvatureSection() {
  const container = document.getElementById('curvatureContentArea');
  if (!container) return;

  const list = state.filteredRecords;

  if (state.activeQuestionTab === 'all') {
    // Overview of all 6 questions in a grid
    renderAllQuestionsGrid(container, list);
  } else {
    // Focused detail view for a specific question (Q1 to Q6)
    const question = CURVATURE_QUESTIONS.find(q => q.id === state.activeQuestionTab);
    if (question) {
      renderSingleQuestionDetail(container, question, list);
    }
  }
}

// Render All 6 Questions Side-by-Side
function renderAllQuestionsGrid(container, list) {
  let cardsHtml = '<div class="q-all-grid">';

  CURVATURE_QUESTIONS.forEach(q => {
    // Find winning photo (ranked 1st most frequently)
    let bestPhoto = q.photos[0];
    let maxRank1Count = -1;

    q.photos.forEach(photo => {
      const countRank1 = list.filter(r => Number(r[photo.id]) === 1).length;
      if (countRank1 > maxRank1Count) {
        maxRank1Count = countRank1;
        bestPhoto = photo;
      }
    });

    const rank1Pct = list.length > 0 ? Math.round((maxRank1Count / list.length) * 100) : 0;

    cardsHtml += `
      <div class="q-card-mini" onclick="setActiveQuestionTab('${q.id}')" style="cursor: pointer;">
        <div class="q-mini-header">
          <div>
            <div class="q-mini-title">${q.title}</div>
            <div style="font-size: 0.74rem; color: var(--text-dim);">${q.subtitle}</div>
          </div>
          <span class="q-mini-tag ${q.badgeClass}">${q.exposureType}</span>
        </div>

        <div class="q-mini-chart-wrapper">
          <canvas id="miniChart_${q.id}"></canvas>
        </div>

        <div class="q-mini-winner">
          <img src="${bestPhoto.src}" alt="${bestPhoto.label}" onerror="this.src='./photos/straight-0.jpg'" />
          <div>
            <div style="color: #fbbf24; font-weight: 700; font-size: 0.76rem;">🏆 Most Preferred: ${bestPhoto.exposure}</div>
            <div style="color: var(--text-muted); font-size: 0.72rem;"><strong>${rank1Pct}%</strong> chosen as Rank 1 (${maxRank1Count} votes)</div>
          </div>
        </div>
      </div>
    `;
  });

  cardsHtml += '</div>';
  container.innerHTML = cardsHtml;

  // Render Chart for each of the 6 mini cards
  CURVATURE_QUESTIONS.forEach(q => {
    const exposures = q.photos.map(p => p.exposure);
    const rank1Counts = q.photos.map(p => list.filter(r => Number(r[p.id]) === 1).length);

    getOrCreateChart(`miniChart_${q.id}`, {
      type: 'bar',
      data: {
        labels: exposures,
        datasets: [
          {
            label: '#1 Choice Votes',
            data: rank1Counts,
            backgroundColor: q.type === 'green' ? '#10b981' : '#f43f5e',
            borderRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.parsed.y} participants ranked this #1`
            }
          }
        },
        scales: {
          x: { ticks: { color: getTextColor() }, grid: { display: false } },
          y: { ticks: { color: getTextColor(), precision: 0 }, grid: { color: getGridColor() }, beginAtZero: true }
        }
      }
    });
  });
}

// Render Focused Question View (Q1 to Q6)
function renderSingleQuestionDetail(container, question, list) {
  // Compute rankings breakdown for each photo in this question
  const photoStats = question.photos.map(photo => {
    const total = list.length;
    const r1 = list.filter(r => Number(r[photo.id]) === 1).length;
    const r2 = list.filter(r => Number(r[photo.id]) === 2).length;
    const r3 = list.filter(r => Number(r[photo.id]) === 3).length;
    const r4 = list.filter(r => Number(r[photo.id]) === 4).length;

    // Average rank: sum(rank * count) / total
    const sumRanks = (r1 * 1) + (r2 * 2) + (r3 * 3) + (r4 * 4);
    const avgRank = total > 0 ? (sumRanks / total).toFixed(2) : '4.00';
    const rank1Pct = total > 0 ? Math.round((r1 / total) * 100) : 0;

    return {
      ...photo,
      r1, r2, r3, r4,
      avgRank,
      rank1Pct
    };
  });

  // Sort to find the winner
  const sortedByR1 = [...photoStats].sort((a, b) => b.r1 - a.r1);
  const winnerId = sortedByR1[0]?.id;

  // Build HTML for the 4 Photo Pills
  const photoCardsHtml = photoStats.map(p => {
    const isWinner = p.id === winnerId;
    return `
      <div class="q-photo-pill ${isWinner ? 'winner' : ''}">
        <div class="q-photo-thumb">
          <img src="${p.src}" alt="${p.label}" onerror="this.src='./photos/straight-0.jpg'" />
          <span class="q-photo-badge">${isWinner ? '🏆 #1 Preferred' : p.exposure}</span>
        </div>
        <div class="q-photo-meta">
          <div class="q-photo-exposure">${p.label}</div>
          <div class="q-photo-stats">
            <span>Rank 1 Votes:</span>
            <strong>${p.rank1Pct}% (${p.r1})</strong>
          </div>
          <div class="q-photo-stats">
            <span>Avg Rank:</span>
            <strong>${p.avgRank} / 4</strong>
          </div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="q-single-container">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div>
          <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main);">${question.title}</h3>
          <p style="font-size: 0.8rem; color: var(--text-muted);">${question.subtitle} · Category: <strong>${question.category}</strong></p>
        </div>
        <button class="btn btn-secondary" onclick="setActiveQuestionTab('all')" style="padding: 6px 14px; font-size: 0.78rem;">
          ← Back to All 6 Questions
        </button>
      </div>

      <!-- 4 Photo Exposure Cards -->
      <div class="q-photos-row">
        ${photoCardsHtml}
      </div>

      <!-- 2 Focused Charts -->
      <div class="q-detail-layout">
        <!-- Chart 1: Complete Rank Tier Distribution (1st, 2nd, 3rd, 4th Choice) -->
        <div class="q-detail-card">
          <h3>📊 Complete Rank Distribution for ${question.category} (${question.exposureType})</h3>
          <p style="font-size: 0.76rem; color: var(--text-muted); margin-bottom: 12px;">Stacked distribution showing exact percentage of participants who placed each exposure in 1st, 2nd, 3rd, or 4th rank.</p>
          <div class="q-focused-chart-box">
            <canvas id="focusedChartRankTiers"></canvas>
          </div>
        </div>

        <!-- Chart 2: Profession Preference Breakdown (Orthodontists vs Dentists vs Non-Dental) -->
        <div class="q-detail-card">
          <h3>🎯 Specialist vs Layperson #1 Choice</h3>
          <p style="font-size: 0.76rem; color: var(--text-muted); margin-bottom: 12px;">Comparing which smile exposure was chosen as Rank 1 across professions.</p>
          <div class="q-focused-chart-box">
            <canvas id="focusedChartProfession"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;

  // Render Chart 1: Stacked Rank Tiers
  getOrCreateChart('focusedChartRankTiers', {
    type: 'bar',
    data: {
      labels: question.photos.map(p => p.exposure),
      datasets: [
        { label: '🥇 1st Choice', data: photoStats.map(p => p.r1), backgroundColor: '#f59e0b', borderRadius: 4 },
        { label: '🥈 2nd Choice', data: photoStats.map(p => p.r2), backgroundColor: '#10b981', borderRadius: 4 },
        { label: '🥉 3rd Choice', data: photoStats.map(p => p.r3), backgroundColor: '#06b6d4', borderRadius: 4 },
        { label: '4th Choice', data: photoStats.map(p => p.r4), backgroundColor: '#64748b', borderRadius: 4 },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { color: getTextColor(), boxWidth: 12 } },
        tooltip: { mode: 'index', intersect: false }
      },
      scales: {
        x: { stacked: true, ticks: { color: getTextColor() }, grid: { display: false } },
        y: { stacked: true, ticks: { color: getTextColor(), precision: 0 }, grid: { color: getGridColor() }, beginAtZero: true }
      }
    }
  });

  // Render Chart 2: Profession Perception
  const orthoList = list.filter(r => r.occupation === 'orthodontist');
  const dentList = list.filter(r => r.occupation === 'dentist');
  const layList = list.filter(r => r.occupation === 'non_dental');

  const getRank1Count = (group, photoId) => group.filter(r => Number(r[photoId]) === 1).length;

  getOrCreateChart('focusedChartProfession', {
    type: 'bar',
    data: {
      labels: question.photos.map(p => p.exposure),
      datasets: [
        { label: 'Orthodontists', data: question.photos.map(p => getRank1Count(orthoList, p.id)), backgroundColor: '#10b981', borderRadius: 4 },
        { label: 'Dentists', data: question.photos.map(p => getRank1Count(dentList, p.id)), backgroundColor: '#06b6d4', borderRadius: 4 },
        { label: 'Public (Lay)', data: question.photos.map(p => getRank1Count(layList, p.id)), backgroundColor: '#a855f7', borderRadius: 4 },
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { color: getTextColor(), boxWidth: 12 } }
      },
      scales: {
        x: { ticks: { color: getTextColor() }, grid: { display: false } },
        y: { ticks: { color: getTextColor(), precision: 0 }, grid: { color: getGridColor() }, beginAtZero: true }
      }
    }
  });
}

// -------------------------------------------------------------
// General Charts (Demographics, Attractiveness, Time)
// -------------------------------------------------------------
function renderGeneralCharts() {
  if (typeof Chart === 'undefined') return;

  renderDemographicsChart();
  renderAgeGroupChart();
  renderCurvatureComparisonChart();
  renderProfessionPerceptionChart();
  renderDurationDistributionChart();
}

function getOrCreateChart(canvasId, config) {
  if (state.charts[canvasId]) {
    state.charts[canvasId].destroy();
  }
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  const chart = new Chart(ctx, config);
  state.charts[canvasId] = chart;
  return chart;
}

function renderDemographicsChart() {
  const list = state.filteredRecords;
  const orthoM = list.filter(r => r.occupation === 'orthodontist' && r.gender === 'male').length;
  const orthoF = list.filter(r => r.occupation === 'orthodontist' && r.gender === 'female').length;
  const dentM = list.filter(r => r.occupation === 'dentist' && r.gender === 'male').length;
  const dentF = list.filter(r => r.occupation === 'dentist' && r.gender === 'female').length;
  const nonM = list.filter(r => r.occupation === 'non_dental' && r.gender === 'male').length;
  const nonF = list.filter(r => r.occupation === 'non_dental' && r.gender === 'female').length;

  getOrCreateChart('chartDemographics', {
    type: 'bar',
    data: {
      labels: ['Orthodontists', 'Dentists', 'Non-Dental (Public)'],
      datasets: [
        { label: 'Male', data: [orthoM, dentM, nonM], backgroundColor: '#06b6d4', borderRadius: 6 },
        { label: 'Female', data: [orthoF, dentF, nonF], backgroundColor: '#ec4899', borderRadius: 6 },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { color: getTextColor() } },
      },
      scales: {
        x: { ticks: { color: getTextColor() }, grid: { display: false } },
        y: { ticks: { color: getTextColor(), precision: 0 }, grid: { color: getGridColor() }, beginAtZero: true },
      },
    },
  });
}

function renderAgeGroupChart() {
  const list = state.filteredRecords;
  const counts = {
    '18_24': list.filter(r => r.age_group === '18_24').length,
    '25_34': list.filter(r => r.age_group === '25_34').length,
    '35_45': list.filter(r => r.age_group === '35_45').length,
    'over_45': list.filter(r => r.age_group === 'over_45').length,
  };

  getOrCreateChart('chartAgeGroup', {
    type: 'doughnut',
    data: {
      labels: ['18 - 24 yrs', '25 - 34 yrs', '35 - 45 yrs', '> 45 yrs'],
      datasets: [
        {
          data: [counts['18_24'], counts['25_34'], counts['35_45'], counts['over_45']],
          backgroundColor: ['#10b981', '#06b6d4', '#6366f1', '#f59e0b'],
          borderColor: 'transparent',
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: getTextColor(), boxWidth: 14 } },
      },
      cutout: '65%',
    },
  });
}

function renderCurvatureComparisonChart() {
  const list = state.filteredRecords;

  const exposures = [
    { label: '0mm', straight: 'straight-0', slight: 'slight-0', banana: 'banana-0' },
    { label: '1mm G', straight: 'straight-1-green', slight: 'slight-1-green', banana: 'banana-1-green' },
    { label: '1mm R', straight: 'straight-1-red', slight: 'slight-1-red', banana: 'banana-1-red' },
    { label: '2mm G', straight: 'straight-2-green', slight: 'slight-2-green', banana: 'banana-2-green' },
    { label: '2mm R', straight: 'straight-2-red', slight: 'slight-2-red', banana: 'banana-2-red' },
    { label: '3mm G', straight: 'straight-3-green', slight: 'slight-3-green', banana: 'banana-3-green' },
    { label: '3mm R', straight: 'straight-3-red', slight: 'slight-3-red', banana: 'banana-3-red' },
  ];

  const calcAvg = (key) => {
    if (!list.length) return 0;
    const vals = list.map(r => Number(r[key])).filter(v => !isNaN(v) && v > 0);
    return vals.length ? Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)) : 0;
  };

  getOrCreateChart('chartCurvature', {
    type: 'bar',
    data: {
      labels: exposures.map(e => e.label),
      datasets: [
        { label: 'Straight Smile', data: exposures.map(e => calcAvg(e.straight)), backgroundColor: '#3b82f6', borderRadius: 4 },
        { label: 'Slight Curvature', data: exposures.map(e => calcAvg(e.slight)), backgroundColor: '#10b981', borderRadius: 4 },
        { label: 'Banana / Reverse Curve', data: exposures.map(e => calcAvg(e.banana)), backgroundColor: '#f43f5e', borderRadius: 4 },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { color: getTextColor() } },
      },
      scales: {
        x: { ticks: { color: getTextColor() }, grid: { display: false } },
        y: { min: 0, max: 100, ticks: { color: getTextColor() }, grid: { color: getGridColor() } },
      },
    },
  });
}

function renderProfessionPerceptionChart() {
  const list = state.filteredRecords;
  const orthoList = list.filter(r => r.occupation === 'orthodontist');
  const dentList = list.filter(r => r.occupation === 'dentist');
  const nonList = list.filter(r => r.occupation === 'non_dental');

  const calcGroupAvg = (sublist, photoId) => {
    if (!sublist.length) return 0;
    const vals = sublist.map(r => Number(r[photoId])).filter(v => !isNaN(v) && v > 0);
    return vals.length ? Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)) : 0;
  };

  const benchmarkPhotos = [
    { id: 'slight-0', label: 'Slight (0mm)' },
    { id: 'straight-0', label: 'Straight (0mm)' },
    { id: 'banana-0', label: 'Banana (0mm)' },
    { id: 'slight-2-green', label: 'Slight (2mm G)' },
    { id: 'straight-2-red', label: 'Straight (2mm R)' },
    { id: 'banana-3-red', label: 'Banana (3mm R)' },
  ];

  getOrCreateChart('chartProfessionPerception', {
    type: 'radar',
    data: {
      labels: benchmarkPhotos.map(b => b.label),
      datasets: [
        { label: 'Orthodontists', data: benchmarkPhotos.map(b => calcGroupAvg(orthoList, b.id)), borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.2)', pointBackgroundColor: '#10b981' },
        { label: 'Dentists', data: benchmarkPhotos.map(b => calcGroupAvg(dentList, b.id)), borderColor: '#06b6d4', backgroundColor: 'rgba(6, 182, 212, 0.2)', pointBackgroundColor: '#06b6d4' },
        { label: 'Public (Lay)', data: benchmarkPhotos.map(b => calcGroupAvg(nonList, b.id)), borderColor: '#a855f7', backgroundColor: 'rgba(168, 85, 247, 0.2)', pointBackgroundColor: '#a855f7' },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { color: getTextColor() } },
      },
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { color: getTextColor(), showLabelBackdrop: false },
          grid: { color: getGridColor() },
          pointLabels: { color: getTextColor(), font: { size: 11, weight: '600' } },
        },
      },
    },
  });
}

function renderDurationDistributionChart() {
  const list = state.filteredRecords;
  const brackets = [
    { label: '< 1 min', count: 0 },
    { label: '1 - 2 mins', count: 0 },
    { label: '2 - 3 mins', count: 0 },
    { label: '3 - 5 mins', count: 0 },
    { label: '> 5 mins', count: 0 },
  ];

  list.forEach(r => {
    const sec = Number(r.duration_seconds) || 0;
    if (sec < 60) brackets[0].count++;
    else if (sec < 120) brackets[1].count++;
    else if (sec < 180) brackets[2].count++;
    else if (sec < 300) brackets[3].count++;
    else brackets[4].count++;
  });

  getOrCreateChart('chartDuration', {
    type: 'line',
    data: {
      labels: brackets.map(b => b.label),
      datasets: [
        {
          label: 'Participants',
          data: brackets.map(b => b.count),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#10b981',
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: getTextColor() }, grid: { display: false } },
        y: { ticks: { color: getTextColor(), precision: 0 }, grid: { color: getGridColor() }, beginAtZero: true },
      },
    },
  });
}

function getTextColor() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? '#334155' : '#94a3b8';
}

function getGridColor() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
}

// -------------------------------------------------------------
// Photo Rating Gallery Rendering
// -------------------------------------------------------------
function renderPhotoGallery() {
  const container = document.getElementById('photoCardsGrid');
  if (!container) return;

  const list = state.filteredRecords;

  const scoredPhotos = PHOTO_CONFIG.map(p => {
    const vals = list.map(r => Number(r[p.id])).filter(v => !isNaN(v) && v > 0);
    const avg = vals.length ? Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)) : 0;
    return { ...p, avgScore: avg, votes: vals.length };
  });

  scoredPhotos.sort((a, b) => b.avgScore - a.avgScore);

  container.innerHTML = scoredPhotos.map((photo, index) => {
    return `
      <div class="smile-photo-card" onclick="openPhotoModal('${photo.id}')" style="cursor: pointer;">
        <div class="photo-img-box">
          <img src="${photo.src}" alt="${photo.name}" loading="lazy" onerror="this.src='./photos/straight-0.jpg'" />
          <span class="photo-rank-tag">#${index + 1}</span>
        </div>
        <div class="photo-info">
          <div class="photo-name" title="${photo.name}">${photo.name}</div>
          <div class="photo-score-row">
            <span class="photo-score-val">${photo.avgScore}</span>
            <span class="photo-score-label">${photo.votes} ratings</span>
          </div>
          <div class="photo-progress">
            <div class="photo-progress-bar" style="width: ${photo.avgScore}%;"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// -------------------------------------------------------------
// Raw Responses Table Rendering
// -------------------------------------------------------------
function renderDataTable() {
  const tbody = document.getElementById('responsesTableBody');
  if (!tbody) return;

  const list = state.filteredRecords;

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 40px; color: var(--text-dim);">
          No matching survey responses found.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = list.map((row, index) => {
    const occBadgeClass = row.occupation === 'orthodontist' ? 'badge-ortho' : (row.occupation === 'dentist' ? 'badge-dentist' : 'badge-lay');
    const occLabel = row.occupation === 'orthodontist' ? 'Orthodontist' : (row.occupation === 'dentist' ? 'Dentist' : 'Non-Dental');
    const dateFormatted = row.timestamp ? new Date(row.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

    const ratingVals = PHOTO_CONFIG.map(p => Number(row[p.id])).filter(v => !isNaN(v) && v > 0);
    const participantAvg = ratingVals.length ? (ratingVals.reduce((a, b) => a + b, 0) / ratingVals.length).toFixed(1) : '-';

    const durationSec = Number(row.duration_seconds) || 0;
    const durationFormatted = `${Math.floor(durationSec / 60)}m ${durationSec % 60}s`;

    return `
      <tr>
        <td style="font-weight: 700; color: var(--text-dim);">${index + 1}</td>
        <td>
          <div style="font-weight: 600;">${escapeHtml(row.name || 'Anonymous')}</div>
          <div style="font-size: 0.72rem; color: var(--text-dim); font-family: monospace;">${escapeHtml(String(row.submission_id || '').slice(0, 14))}...</div>
        </td>
        <td>${escapeHtml(row.gender ? (row.gender === 'male' ? 'Male' : 'Female') : '-')}</td>
        <td>${escapeHtml(formatAge(row.age_group))}</td>
        <td><span class="badge-tag ${occBadgeClass}">${occLabel}</span></td>
        <td>${row.work_experience !== '' && row.work_experience !== undefined ? `${row.work_experience} yrs` : '-'}</td>
        <td>${durationFormatted}</td>
        <td style="font-weight: 700; color: var(--accent-teal);">${participantAvg}</td>
        <td style="color: var(--text-dim); font-size: 0.76rem;">${dateFormatted}</td>
        <td>
          <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.74rem;" onclick="viewRecordDetails('${escapeHtml(String(row.submission_id))}')">
            Details
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function formatAge(ageKey) {
  if (ageKey === '18_24') return '18-24';
  if (ageKey === '25_34') return '25-34';
  if (ageKey === '35_45') return '35-45';
  if (ageKey === 'over_45') return '>45';
  return ageKey || '-';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// -------------------------------------------------------------
// Modals
// -------------------------------------------------------------
function viewRecordDetails(submissionId) {
  const record = state.rawRecords.find(r => String(r.submission_id) === String(submissionId));
  if (!record) return;

  const modal = document.getElementById('modalOverlay');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  if (title) title.textContent = `Submission: ${record.name || 'Anonymous'}`;

  if (body) {
    const ratingsHtml = PHOTO_CONFIG.map(p => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--border-subtle); font-size: 0.8rem;">
        <span>${p.name}</span>
        <strong style="color: var(--accent-teal);">${record[p.id] !== undefined && record[p.id] !== '' ? `${record[p.id]} / 100` : '-'}</strong>
      </div>
    `).join('');

    const rankingsHtml = CURVATURE_QUESTIONS.map(q => {
      const items = q.photos.map(p => `<span>${p.exposure}: <strong>#${record[p.id] || '-'}</strong></span>`).join(' · ');
      return `
        <div style="padding: 6px 0; border-bottom: 1px solid var(--border-subtle); font-size: 0.8rem;">
          <div style="font-weight: 600; color: var(--text-main);">${q.title}</div>
          <div style="color: var(--accent-cyan); font-size: 0.76rem;">${items}</div>
        </div>
      `;
    }).join('');

    body.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; font-size: 0.82rem;">
        <div><strong>Submission ID:</strong> <span style="font-family: monospace;">${escapeHtml(record.submission_id)}</span></div>
        <div><strong>Timestamp:</strong> ${record.timestamp ? new Date(record.timestamp).toLocaleString() : '-'}</div>
        <div><strong>Language:</strong> ${record.language === 'ar' ? 'Arabic (العربية)' : 'English'}</div>
        <div><strong>Duration:</strong> ${record.duration_seconds} seconds</div>
        <div><strong>Occupation:</strong> ${escapeHtml(record.occupation)}</div>
        <div><strong>Experience:</strong> ${record.work_experience ? `${record.work_experience} years` : 'N/A'}</div>
      </div>
      <h4 style="margin: 14px 0 6px; font-size: 0.9rem; color: var(--text-main);">Click-to-Rate Rankings (Questions 1 to 6)</h4>
      <div style="margin-bottom: 14px;">${rankingsHtml}</div>
      <h4 style="margin: 14px 0 6px; font-size: 0.9rem; color: var(--text-main);">Smile Ratings (Scale 10 - 100)</h4>
      <div style="max-height: 220px; overflow-y: auto;">${ratingsHtml}</div>
    `;
  }

  if (modal) modal.classList.add('open');
}

function openPhotoModal(photoId) {
  const photo = PHOTO_CONFIG.find(p => p.id === photoId);
  if (!photo) return;

  const list = state.filteredRecords;
  const vals = list.map(r => Number(r[photo.id])).filter(v => !isNaN(v) && v > 0);
  const avg = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '0.0';

  const orthoVals = list.filter(r => r.occupation === 'orthodontist').map(r => Number(r[photo.id])).filter(v => !isNaN(v) && v > 0);
  const dentVals = list.filter(r => r.occupation === 'dentist').map(r => Number(r[photo.id])).filter(v => !isNaN(v) && v > 0);
  const layVals = list.filter(r => r.occupation === 'non_dental').map(r => Number(r[photo.id])).filter(v => !isNaN(v) && v > 0);
  const getMean = (arr) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : '-';

  const modal = document.getElementById('modalOverlay');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  if (title) title.textContent = `Photo Rating Details: ${photo.name}`;

  if (body) {
    body.innerHTML = `
      <div style="text-align: center; margin-bottom: 16px;">
        <img src="${photo.src}" alt="${photo.name}" style="max-width: 100%; max-height: 220px; border-radius: 8px; object-fit: contain; box-shadow: 0 4px 14px rgba(0,0,0,0.5);" />
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px; font-size: 0.85rem;">
        <div style="background: var(--bg-subtle); padding: 12px; border-radius: 8px;">
          <div style="color: var(--text-dim); font-size: 0.74rem;">OVERALL SCORE</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent-teal);">${avg} / 100</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${vals.length} participant evaluations</div>
        </div>
        <div style="background: var(--bg-subtle); padding: 12px; border-radius: 8px;">
          <div style="color: var(--text-dim); font-size: 0.74rem;">CATEGORY & EXPOSURE</div>
          <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-main); text-transform: capitalize;">${photo.category}</div>
          <div style="font-size: 0.75rem; color: var(--accent-cyan);">${photo.exposure}</div>
        </div>
      </div>
      <h4 style="font-size: 0.88rem; margin-bottom: 8px;">Perception by Profession</h4>
      <div style="font-size: 0.82rem; display: flex; flex-direction: column; gap: 6px;">
        <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-subtle);">
          <span>Orthodontists:</span>
          <strong>${getMean(orthoVals)} / 100</strong>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid var(--border-subtle);">
          <span>Dentists:</span>
          <strong>${getMean(dentVals)} / 100</strong>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 6px 0;">
          <span>General Public (Non-Dental):</span>
          <strong>${getMean(layVals)} / 100</strong>
        </div>
      </div>
    `;
  }

  if (modal) modal.classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay')?.classList.remove('open');
}

function openDataSourceModal() {
  const modal = document.getElementById('sourceModalOverlay');
  const sheetInput = document.getElementById('customSheetIdInput');
  if (sheetInput) sheetInput.value = state.meta.sheetId;
  if (modal) modal.classList.add('open');
}

function closeDataSourceModal() {
  document.getElementById('sourceModalOverlay')?.classList.remove('open');
}

function handleSaveCustomSource() {
  const sheetInput = document.getElementById('customSheetIdInput');
  const val = sheetInput ? sheetInput.value.trim() : '';
  if (val) {
    state.meta.sheetId = val;
    localStorage.setItem('smile_survey_sheet_id', val);
  }
  closeDataSourceModal();
  loadData(true);
}

// -------------------------------------------------------------
// UI Themes & Status Helpers
// -------------------------------------------------------------
function updateStatusBadge(mode, text) {
  const textEl = document.getElementById('statusText');
  const dot = document.getElementById('statusDot');
  if (textEl) textEl.textContent = text;
  if (dot) {
    if (mode === 'live') {
      dot.className = 'status-dot pulse';
      dot.style.background = '#10b981';
    } else if (mode === 'syncing') {
      dot.className = 'status-dot pulse';
      dot.style.background = '#06b6d4';
    } else {
      dot.className = 'status-dot';
      dot.style.background = '#f59e0b';
    }
  }
}

function initTheme() {
  const saved = localStorage.getItem('smile_survey_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('smile_survey_theme', next);
  updateThemeIcon(next);
  renderCurvatureSection();
  renderGeneralCharts();
}

function updateThemeIcon(theme) {
  const isDark = theme === 'dark';

  // Header button update
  const label = document.getElementById('themeSwitchLabel');
  if (label) {
    label.innerHTML = isDark
      ? '<span id="themeSwitchIcon">☀️</span> Light Mode'
      : '<span id="themeSwitchIcon">🌙</span> Dark Mode';
  }
  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.title = isDark ? 'Click to swap to Light theme' : 'Click to swap to Dark theme';
  }

  // Floating button update
  const floatIcon = document.getElementById('floatingThemeIcon');
  const floatText = document.getElementById('floatingThemeText');
  if (floatIcon) {
    floatIcon.textContent = isDark ? '☀️' : '🌙';
  }
  if (floatText) {
    floatText.textContent = isDark ? 'Light Theme' : 'Dark Theme';
  }
  const floatBtn = document.getElementById('floatingThemeBtn');
  if (floatBtn) {
    floatBtn.title = isDark ? 'Click to swap to Light theme' : 'Click to swap to Dark theme';
  }
}

// -------------------------------------------------------------
// Export to CSV
// -------------------------------------------------------------
function exportToCsv() {
  const list = state.filteredRecords;
  if (list.length === 0) {
    alert('No records available to export.');
    return;
  }

  const keys = state.headers.length > 0 ? state.headers : Object.keys(list[0]).filter(k => k !== '_rowIndex');
  const csvRows = [keys.map(k => `"${k.replace(/"/g, '""')}"`).join(',')];

  list.forEach(row => {
    const values = keys.map(k => {
      const val = row[k] !== undefined && row[k] !== null ? String(row[k]) : '';
      return `"${val.replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  });

  const blob = new Blob(['\uFEFF' + csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `smile_survey_analytics_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Global scope bindings for inline HTML attributes
window.loadDemoDataset = loadDemoDataset;
window.loadData = loadData;
window.viewRecordDetails = viewRecordDetails;
window.openPhotoModal = openPhotoModal;
window.toggleTheme = toggleTheme;
window.setActiveQuestionTab = setActiveQuestionTab;
