// ===== STATE =====
const state = {
  currentPage: 'persoenliche-angaben',
  currentSubPage: 'personendaten',
  sidebarCollapsed: false,
  data: {
    person: { anrede: '', geschlecht: '', titel: '', vorname: '', nachname: '', geburtsdatum: '', geburtsname: '', staatsangehoerigkeit: '' },
    ausweis: { art: '', nummer: '', behoerde: '', ausstellungsdatum: '', gueltig_bis: '', geburtsort: '' },
    adresse: { land: '', plz: '', ort: '', strasse: '', hausnummer: '', adresszusatz: '' },
    arbeitgeber: { arbeitgeber: '', geschaeftsform: '', land: 'Deutschland', plz: '', ort: '', strasse: '', hausnummer: '', telefonVorwahl: '', telefonNummer: '', taetigkeit: '', befristung: 'nein', bav: 'nein', arbeitgeber_pct: '15', arbeitgeber_eur: '0,00' },
    rente: { renteninfoVom: '', renteVollEM: '0,00', regelAltersrente: '0,00', kuenftigeRente: '0,00', gesetzlicheRente: 'ja', freiwilligkeit: 'pflichtversichert', jahreEingezahlt: '0' },
    hausrat: { objekt: '', gesellschaft: '', versicherungsnummer: '', beitrag: '0,00', zahlungsweise: 'monatlich', beginn: '', ablauf: '', wohnflaeche: '0', versicherungssumme: '0,00', selbstbeteiligung: '0,00', fahrraddiebstahl: '', glasversicherung: '', elementarschaeden: '', vorschaeden: '0', hoeheVorschaeden: '0,00' },
    einnahmen: { einkommen: [], geringfuegig: [], selbststaendig: [] }
  }
};

// ===== NAVIGATION =====
function navigate(page, subPage) {
  state.currentPage = page;
  state.currentSubPage = subPage || page;
  renderNav();
  renderPage();
}

function renderNav() {
  document.querySelectorAll('.nav-link, .sub-nav-link').forEach(el => el.classList.remove('active'));
  const active = document.querySelector(`[data-page="${state.currentPage}"][data-sub="${state.currentSubPage}"]`) ||
    document.querySelector(`[data-page="${state.currentPage}"]`);
  if (active) active.classList.add('active');
  // Open parent if sub-page active
  document.querySelectorAll('.sub-nav').forEach(sub => {
    if (sub.querySelector('.active')) sub.classList.add('open');
  });
}

function toggleSubNav(el) {
  const sub = el.nextElementSibling;
  if (!sub || !sub.classList.contains('sub-nav')) return;
  sub.classList.toggle('open');
  el.classList.toggle('open');
}

function toggleSidebar() {
  state.sidebarCollapsed = !state.sidebarCollapsed;
  document.getElementById('sidebar').classList.toggle('collapsed', state.sidebarCollapsed);
}

// ===== PAGES =====
function renderPage() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pageId = state.currentSubPage || state.currentPage;
  const el = document.getElementById('page-' + pageId);
  if (el) { el.classList.add('active'); fillFormFromState(); }
}

function fillFormFromState() {
  // Person
  setVal('p-anrede', state.data.person.anrede);
  setVal('p-geschlecht', state.data.person.geschlecht);
  setVal('p-titel', state.data.person.titel);
  setVal('p-vorname', state.data.person.vorname);
  setVal('p-nachname', state.data.person.nachname);
  setVal('p-geburtsdatum', state.data.person.geburtsdatum);
  setVal('p-geburtsname', state.data.person.geburtsname);
  setVal('p-staatsangehoerigkeit', state.data.person.staatsangehoerigkeit);
  // Ausweis
  setVal('aus-art', state.data.ausweis.art);
  setVal('aus-nummer', state.data.ausweis.nummer);
  setVal('aus-behoerde', state.data.ausweis.behoerde);
  setVal('aus-ausstellungsdatum', state.data.ausweis.ausstellungsdatum);
  setVal('aus-gueltigbis', state.data.ausweis.gueltig_bis);
  setVal('aus-geburtsort', state.data.ausweis.geburtsort);
  // Adresse
  setVal('a-land', state.data.adresse.land);
  setVal('a-plz', state.data.adresse.plz);
  setVal('a-ort', state.data.adresse.ort);
  setVal('a-strasse', state.data.adresse.strasse);
  setVal('a-hausnummer', state.data.adresse.hausnummer);
  setVal('a-adresszusatz', state.data.adresse.adresszusatz);
  // Arbeitgeber
  setVal('ag-arbeitgeber', state.data.arbeitgeber.arbeitgeber);
  setVal('ag-plz', state.data.arbeitgeber.plz);
  setVal('ag-ort', state.data.arbeitgeber.ort);
  setVal('ag-strasse', state.data.arbeitgeber.strasse);
  setVal('ag-hausnummer', state.data.arbeitgeber.hausnummer);
  setVal('ag-telvorwahl', state.data.arbeitgeber.telefonVorwahl);
  setVal('ag-telnummer', state.data.arbeitgeber.telefonNummer);
  setVal('ag-taetigkeit', state.data.arbeitgeber.taetigkeit);
  setVal('ag-pct', state.data.arbeitgeber.arbeitgeber_pct);
  setVal('ag-eur', state.data.arbeitgeber.arbeitgeber_eur);
  setRadio('ag-befristung', state.data.arbeitgeber.befristung);
  setRadio('ag-bav', state.data.arbeitgeber.bav);
  // Rente
  setVal('r-info', state.data.rente.renteninfoVom);
  setVal('r-em', state.data.rente.renteVollEM);
  setVal('r-regel', state.data.rente.regelAltersrente);
  setVal('r-kuenftig', state.data.rente.kuenftigeRente);
  setRadius('r-gesetzlich', state.data.rente.gesetzlicheRente);
  setRadius('r-freiwilligkeit', state.data.rente.freiwilligkeit);
  setVal('r-jahre', state.data.rente.jahreEingezahlt);
}

function setVal(id, val) { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; }
function setRadio(name, val) {
  const radios = document.querySelectorAll(`input[name="${name}"]`);
  radios.forEach(r => { r.checked = r.value === val; });
}
function setRadius(name, val) { setRadio(name, val); }

function savePageData() {
  const g = id => { const el = document.getElementById(id); return el ? el.value : ''; };
  const radio = name => { const r = document.querySelector(`input[name="${name}"]:checked`); return r ? r.value : ''; };
  state.data.person = { anrede: g('p-anrede'), geschlecht: g('p-geschlecht'), titel: g('p-titel'), vorname: g('p-vorname'), nachname: g('p-nachname'), geburtsdatum: g('p-geburtsdatum'), geburtsname: g('p-geburtsname'), staatsangehoerigkeit: g('p-staatsangehoerigkeit') };
  state.data.ausweis = { art: g('aus-art'), nummer: g('aus-nummer'), behoerde: g('aus-behoerde'), ausstellungsdatum: g('aus-ausstellungsdatum'), gueltig_bis: g('aus-gueltigbis'), geburtsort: g('aus-geburtsort') };
  state.data.adresse = { land: g('a-land'), plz: g('a-plz'), ort: g('a-ort'), strasse: g('a-strasse'), hausnummer: g('a-hausnummer'), adresszusatz: g('a-adresszusatz') };
  state.data.arbeitgeber = { ...state.data.arbeitgeber, arbeitgeber: g('ag-arbeitgeber'), plz: g('ag-plz'), ort: g('ag-ort'), strasse: g('ag-strasse'), hausnummer: g('ag-hausnummer'), telefonVorwahl: g('ag-telvorwahl'), telefonNummer: g('ag-telnummer'), taetigkeit: g('ag-taetigkeit'), arbeitgeber_pct: g('ag-pct'), arbeitgeber_eur: g('ag-eur'), befristung: radio('ag-befristung'), bav: radio('ag-bav') };
  state.data.rente = { renteninfoVom: g('r-info'), renteVollEM: g('r-em'), regelAltersrente: g('r-regel'), kuenftigeRente: g('r-kuenftig'), gesetzlicheRente: radio('r-gesetzlich'), freiwilligkeit: radio('r-freiwilligkeit'), jahreEingezahlt: g('r-jahre') };
  showToast('Daten gespeichert.');
}

// ===== MODAL =====
function openModal() {
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('upload-status').textContent = '';
  document.getElementById('progress-wrap').classList.remove('visible');
  drawQR('qrCanvas', '#000');
}
function closeModal() { document.getElementById('modal-overlay').classList.remove('open'); }

// ===== QR CODE (clean canvas-based) =====
function drawQR(canvasId, color) {
  const canvas = document.getElementById(canvasId || 'qrCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const n = 21;
  const cell = Math.floor(size / n);
  const offset = Math.floor((size - cell * n) / 2);

  // White background
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);

  const data = generateQRPattern();
  ctx.fillStyle = color || '#000';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (data[r][c]) {
        ctx.fillRect(offset + c * cell, offset + r * cell, cell, cell);
      }
    }
  }
}

// Simple seeded PRNG (mulberry32)
function seededRand(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function generateQRPattern() {
  const n = 21;
  const grid = Array.from({ length: n }, () => Array(n).fill(-1)); // -1 = unset

  // Helper: draw finder + separator
  function finder(row, col) {
    for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) {
      grid[row + i][col + j] = (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) ? 1 : 0;
    }
    // Separator (white border around finder)
    for (let k = -1; k <= 7; k++) {
      if (row + k >= 0 && row + k < n && col - 1 >= 0) grid[row + k][col - 1] = 0;
      if (row + k >= 0 && row + k < n && col + 7 < n) grid[row + k][col + 7] = 0;
      if (col + k >= 0 && col + k < n && row - 1 >= 0) grid[row - 1][col + k] = 0;
      if (col + k >= 0 && col + k < n && row + 7 < n) grid[row + 7][col + k] = 0;
    }
  }

  finder(0, 0);
  finder(0, 14);
  finder(14, 0);

  // Timing strips
  for (let i = 8; i <= 12; i++) {
    if (grid[6][i] === -1) grid[6][i] = i % 2 === 0 ? 1 : 0;
    if (grid[i][6] === -1) grid[i][6] = i % 2 === 0 ? 1 : 0;
  }

  // Format info area (fixed dark module)
  grid[8][13] = 1;

  // Fill remaining cells with seeded random (dense-ish)
  const rand = seededRand(0xA3F1C2B4);
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === -1) {
        grid[r][c] = rand() > 0.45 ? 1 : 0;
      }
    }
  }
  return grid;
}

// ===== KI FIELD MARKING =====
let _kiBadgeCount = 0;
function KI_BADGE_HTML() {
  const gid = 'kig' + (_kiBadgeCount++);
  return `<span class="ki-badge" title="KI-erfasst"><svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
  <defs>
    <linearGradient id="${gid}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00c8f0"/>
      <stop offset="100%" stop-color="#d040fb"/>
    </linearGradient>
  </defs>
  <rect x="5" y="5" width="70" height="70" rx="18" fill="none" stroke="url(#${gid})" stroke-width="5"/>
  <path d="M30 14 L33 26 L45 29 L33 32 L30 44 L27 32 L15 29 L27 26 Z" fill="url(#${gid})"/>
  <path d="M55 40 L57 49 L66 51 L57 53 L55 62 L53 53 L44 51 L53 49 Z" fill="url(#${gid})"/>
</svg></span>`;
}

function markKIField(fieldId) {
  const el = document.getElementById(fieldId);
  if (!el) return;
  const group = el.closest('.field-group');
  if (!group) return;
  group.classList.add('ki-filled');
  // Remove existing badge
  group.querySelector('.ki-badge')?.remove();
  const label = group.querySelector('label');
  if (label) label.insertAdjacentHTML('afterend', KI_BADGE_HTML());
  // Set position relative on label if needed
  group.style.position = 'relative';
}

function markKIRadio(name) {
  const radio = document.querySelector(`input[name="${name}"]`);
  if (!radio) return;
  const group = radio.closest('.field-group');
  if (!group) return;
  group.classList.add('ki-filled');
  group.querySelector('.ki-badge')?.remove();
  const label = group.querySelector('label:first-of-type') || group.querySelector('label');
  if (label) label.insertAdjacentHTML('afterend', KI_BADGE_HTML());
  group.style.position = 'relative';
}

function clearAllKIMarkers() {
  document.querySelectorAll('.ki-filled').forEach(el => {
    el.classList.remove('ki-filled');
    el.querySelector('.ki-badge')?.remove();
  });
}

function showKIBanner(page, fields) {
  // Remove any existing banner
  document.querySelectorAll('.ki-result-banner').forEach(b => b.remove());
  const pageEl = document.getElementById('page-' + page);
  if (!pageEl) return;
  const banner = document.createElement('div');
  banner.className = 'ki-result-banner';
  banner.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1565C0" stroke-width="2">
      <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
    </svg>
    <span><strong>KI-Analyse:</strong> ${fields} Felder wurden automatisch aus dem Dokument erfasst.</span>`;
  pageEl.insertBefore(banner, pageEl.firstChild);
}

// ===== PDF → IMAGE RENDERING =====
async function renderPDFToImages(file) {
  const pdfjsLib = window['pdfjs-dist/build/pdf'];
  if (!pdfjsLib) throw new Error('PDF.js not geladen');
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const images = [];
  const pagesToRender = Math.min(pdf.numPages, 1); // First 2 pages max

  for (let i = 1; i <= pagesToRender; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.2 }); // 2x = high quality
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    // JPEG at 0.92 quality — good balance of size vs quality
    const base64 = canvas.toDataURL('image/jpeg', 0.75).split(',')[1];
    images.push(base64);
    console.log(`Page ${i}: ${Math.round(base64.length * 0.75 / 1024)} KB image sent to Gemini`);
  }
  return images; // array of base64 JPEG strings
}



// ===== PDF TEXT FALLBACK (no API key) =====
async function extractPDFTextFallback(file) {
  try {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    if (!pdfjsLib) throw new Error('PDF.js nicht geladen');
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const items = content.items.sort((a, b) =>
        Math.round(b.transform[5] / 5) * 5 - Math.round(a.transform[5] / 5) * 5 ||
        a.transform[4] - b.transform[4]
      );
      let lastY = null;
      for (const item of items) {
        const y = Math.round(item.transform[5] / 4) * 4;
        if (lastY !== null && lastY !== y) fullText += '\n';
        fullText += item.str + ' ';
        lastY = y;
      }
      fullText += '\n\n';
    }
    return fullText;
  } catch (e) {
    console.error('PDF text fallback error:', e);
    return null;
  }
}

// ===== GERMAN DOCUMENT PARSER (regex fallback) =====
function parseDocumentText(text) {
  const result = { person: {}, adresse: {}, arbeitgeber: {}, einnahmen: {}, docType: 'Dokument' };
  if (/gehalt|lohn|entgelt|lohnabr|gehaltsabr/i.test(text)) result.docType = 'Gehaltsabrechnung';
  else if (/renten(?:information|bescheid|auskunft)|deutsche rentenversicherung/i.test(text)) result.docType = 'Renteninformation';
  else if (/hausrat|wohngebäude|eigenheim/i.test(text)) result.docType = 'Versicherungsvertrag';
  const anredeMatch = text.match(/\b(Herr|Frau)\s+(?:Dr\.?\s+)?([A-ZÄÖÜ][a-zäöüß\-]+)\s+([A-ZÄÖÜ][a-zäöüß\-]+)/);
  if (anredeMatch) { result.person.anrede = anredeMatch[1]; result.person.geschlecht = anredeMatch[1] === 'Herr' ? 'männlich' : 'weiblich'; result.person.vorname = anredeMatch[2]; result.person.nachname = anredeMatch[3]; }
  const gebMatch = text.match(/(?:geb(?:oren|\.?\s*am|urtsdatum)?[:\s*]+)(\d{2}[.\/\-]\d{2}[.\/\-]\d{4})/i);
  if (gebMatch) result.person.geburtsdatum = gebMatch[1].replace(/[\/\-]/g, '.');
  const plzOrtMatch = text.match(/\b(\d{5})\s+([A-ZÄÖÜ][a-zäöüß\-\s]+?)(?:\n|,|$)/m);
  if (plzOrtMatch) { result.adresse.plz = plzOrtMatch[1]; result.adresse.ort = plzOrtMatch[2].trim(); }
  const strasseMatch = text.match(/([A-ZÄÖÜ][a-zäöüß\-]+(?:straße|str\.|gasse|weg|allee|platz|ring))\s+(\d+\s*[a-zA-Z]?)/i);
  if (strasseMatch) { result.adresse.strasse = strasseMatch[1]; result.adresse.hausnummer = strasseMatch[2].trim(); }
  result.adresse.land = 'Deutschland';
  const agLabel = text.match(/(?:Arbeitgeber|Firma|Unternehmen)[:\s]+([^\n,]{3,60})/i);
  if (agLabel) result.arbeitgeber.arbeitgeber = agLabel[1].trim();
  else { const agLine = text.match(/^([A-ZÄÖÜ][^\n]{2,50}(?:GmbH|AG|KG|SE|GbR|eG)[\s&Co.KG]*)/m); if (agLine) result.arbeitgeber.arbeitgeber = agLine[1].trim(); }
  if (/unbefristet/i.test(text)) result.arbeitgeber.befristung = 'nein';
  else if (/befristet/i.test(text)) result.arbeitgeber.befristung = 'ja';
  return result;
}

function getGeminiKey() { return localStorage.getItem('gemini_api_key') || ''; }
function getGeminiModel() { return localStorage.getItem('gemini_model') || 'gemini-2.0-flash'; }

// Preferred model priority order (vision-capable Flash models)
const GEMINI_MODEL_CANDIDATES = [
  'gemini-2.5-flash', 'gemini-2.5-flash-preview-04-17',
  'gemini-2.0-flash-001', 'gemini-2.0-flash-lite', 'gemini-2.0-flash-lite-001',
  'gemini-1.5-flash-001', 'gemini-1.5-flash-002', 'gemini-1.5-flash'
]; // 'gemini-2.0-flash' removed — deprecated alias for new API keys

async function detectGeminiModel(apiKey) {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!res.ok) return null;
    const data = await res.json();
    const available = (data.models || []).map(m => m.name.replace('models/', ''));
    // Return first candidate that is available
    for (const candidate of GEMINI_MODEL_CANDIDATES) {
      if (available.some(a => a === candidate || a.startsWith(candidate))) {
        return candidate;
      }
    }
    // Fallback: return first flash model found
    const flash = available.find(a => a.includes('flash'));
    return flash || available[0] || null;
  } catch (e) {
    console.warn('Model detection failed:', e);
    return null;
  }
}


const GEMINI_PROMPT = `Du bist ein KI-Assistent für Finanzberatung. Analysiere den folgenden Text aus einem deutschen Dokument und extrahiere strukturierte Daten.

Gib NUR ein JSON-Objekt zurück (kein Markdown, keine Erklärungen):
{
  "docType": "Gehaltsabrechnung|Renteninformation|Versicherungsvertrag|Kontoauszug|Ausweis|Unbekannt",
  "person": {
    "anrede": "Herr|Frau|...",
    "geschlecht": "männlich|weiblich",
    "titel": "",
    "vorname": "",
    "nachname": "",
    "geburtsdatum": "TT.MM.JJJJ",
    "geburtsname": "",
    "staatsangehoerigkeit": ""
  },
  "ausweis": {
    "art": "Personalausweis|Reisepass|Führerschein",
    "nummer": "",
    "behoerde": "",
    "ausstellungsdatum": "TT.MM.JJJJ",
    "gueltig_bis": "TT.MM.JJJJ",
    "geburtsort": ""
  },
  "adresse": {
    "strasse": "",
    "hausnummer": "",
    "plz": "",
    "ort": "",
    "land": "Deutschland"
  },
  "arbeitgeber": {
    "arbeitgeber": "",
    "geschaeftsform": "GmbH|AG|KG|GbR|",
    "plz": "",
    "ort": "",
    "strasse": "",
    "hausnummer": "",
    "telefonVorwahl": "",
    "telefonNummer": "",
    "taetigkeit": "TT.MM.JJJJ",
    "befristung": "ja|nein",
    "bav": "ja|nein",
    "arbeitgeber_pct": "",
    "arbeitgeber_eur": ""
  },
  "einnahmen": {
    "brutto": "",
    "netto": "",
    "steuerklasse": ""
  },
  "rente": {
    "regelAltersrente": "",
    "renteVollEM": "",
    "jahreEingezahlt": ""
  },
  "hausrat": {
    "gesellschaft": "",
    "versicherungsnummer": "",
    "beitrag": "",
    "zahlungsweise": "monatlich|vierteljährlich|halbjährlich|jährlich",
    "beginn": "TT.MM.JJJJ",
    "ablauf": "TT.MM.JJJJ",
    "wohnflaeche": "",
    "versicherungssumme": ""
  }
}

Regeln:
- Lass Felder leer ("") wenn die Information nicht im Dokument steht
- Extrahiere nur tatsächlich vorhandene Daten, erfinde nichts
- Bei Ausweisen (auch z.B. Maschinenlesbarer Bereich): lies alle Felder wie Nummer, ausstellende Behörde, Geburtsort sorgfältig aus
- Deutsche Zahlenformate beibehalten (z.B. "3.450,00")
- Datumformat immer TT.MM.JJJJ
- Wenn Arbeitgeberadresse und Mitarbeiteradresse vorhanden, trenne sie korrekt

Dokumenttext:
`;


// ===== GEMINI VISION API =====
async function callGeminiAPI(images) {
  const key = getGeminiKey();
  if (!key) return null;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${getGeminiModel()}:generateContent?key=${key}`;
  // Build parts: prompt text + one image part per page
  const parts = [{ text: GEMINI_PROMPT }];
  for (const b64 of images) {
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: b64 } });
  }
  const body = { contents: [{ parts }], generationConfig: { temperature: 0.1 } };
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);
  let res;
  try {
    res = await fetch(url, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(body),
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeoutId);
  }
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini API Fehler ${res.status}: ${errBody.slice(0, 300)}`);
  }
  const data = await res.json();
  let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  const start = rawText.indexOf('{');
  const end = rawText.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('Kein JSON in Gemini-Antwort: ' + rawText.slice(0, 200));
  return JSON.parse(rawText.slice(start, end + 1));
}

async function finishUpload(payload, useVision) {
  const status = document.getElementById('upload-status');
  const bar = document.getElementById('progress-bar');
  let parsed;

  if (useVision) {
    status.textContent = '🤖 Gemini Vision analysiert Dokument...';
    bar.style.width = '90%';
    try {
      parsed = await callGeminiAPI(payload); // payload = array of base64 images
      bar.style.width = '100%';
      status.textContent = '✓ KI-Analyse abgeschlossen!';
    } catch (err) {
      console.error('=== GEMINI FEHLER ===', err);
      bar.style.width = '100%';
      bar.style.background = '#e53935';
      status.textContent = '';
      const safeMsg = String(err.message || err).replace(/</g, '&lt;').replace(/>/g, '&gt;');
      status.innerHTML = `<span style="color:#c62828;font-size:12px;word-break:break-all">${safeMsg}</span>`;
      return;
    }
  } else {
    bar.style.width = '100%';
    status.textContent = '✓ Analyse abgeschlossen (Regex)';
    parsed = parseDocumentText(payload); // payload = extracted text string
  }

    return parsed;
  }

// ===== HUMAN IN THE LOOP REVIEW =====
let currentReviewResolve = null;
let currentParsedData = null;

function showReviewModal(parsed, resolveUpload) {
  currentReviewResolve = resolveUpload;
  currentParsedData = parsed;
  
  const container = document.getElementById('review-fields-container');
  container.innerHTML = '';
  let fieldCount = 0;

  const createRow = (category, key, value, label) => {
    if (value === undefined || value === null || String(value).trim() === '') return '';
    fieldCount++;
    const safeVal = String(value).trim().replace(/"/g, '&quot;');
    return `
      <div class="review-row">
        <label>
          <input type="checkbox" checked data-category="${category}" data-key="${key}">
          ${label}
        </label>
        <input type="text" value="${safeVal}" id="review-input-${category}-${key}">
      </div>
    `;
  };

  let html = '';

  // Person
  const personMap = { vorname: 'Vorname', nachname: 'Nachname', geburtsdatum: 'Geburtsdatum', anrede: 'Anrede', geschlecht: 'Geschlecht', titel: 'Titel', staatsangehoerigkeit: 'Staatsangehörigkeit' };
  let personHtml = '';
  for (const [key, label] of Object.entries(personMap)) {
    personHtml += createRow('person', key, parsed.person?.[key], label);
  }
  if (personHtml) html += `<div class="review-category">Person</div>${personHtml}`;

  // Ausweis
  const ausMap = { art: 'Ausweisart', nummer: 'Dokumentnummer', behoerde: 'Behörde', ausstellungsdatum: 'Ausstellungsdatum', gueltig_bis: 'Gültig bis', geburtsort: 'Geburtsort' };
  let ausHtml = '';
  for (const [key, label] of Object.entries(ausMap)) {
    ausHtml += createRow('ausweis', key, parsed.ausweis?.[key], label);
  }
  if (ausHtml) html += `<div class="review-category">Ausweis</div>${ausHtml}`;

  // Adresse
  const adrMap = { land: 'Land', plz: 'PLZ', ort: 'Ort', strasse: 'Straße', hausnummer: 'Hausnummer' };
  let adrHtml = '';
  for (const [key, label] of Object.entries(adrMap)) {
    adrHtml += createRow('adresse', key, parsed.adresse?.[key], label);
  }
  if (adrHtml) html += `<div class="review-category">Adresse</div>${adrHtml}`;

  // Arbeitgeber
  const agMap = { arbeitgeber: 'Name Arbeitgeber', plz: 'PLZ', ort: 'Ort', strasse: 'Straße', hausnummer: 'Hausnummer', telefonVorwahl: 'Tele-Vorwahl', telefonNummer: 'Tele-Nummer', taetigkeit: 'Tätigkeit', befristung: 'Befristung', bav: 'bAV', arbeitgeber_pct: 'Anteil AG (%)', arbeitgeber_eur: 'Anteil AG (€)' };
  let agHtml = '';
  for (const [key, label] of Object.entries(agMap)) {
    agHtml += createRow('arbeitgeber', key, parsed.arbeitgeber?.[key], label);
  }
  if (agHtml) html += `<div class="review-category">Beruf & Arbeitgeber</div>${agHtml}`;

  // Rente
  const renteMap = { renteVollEM: 'Erwerbsminderungsrente', regelAltersrente: 'Regelaltersrente', jahreEingezahlt: 'Jahre eingezahlt' };
  let renteHtml = '';
  for (const [key, label] of Object.entries(renteMap)) {
    renteHtml += createRow('rente', key, parsed.rente?.[key], label);
  }
  if (renteHtml) html += `<div class="review-category">Rente</div>${renteHtml}`;

  // Hausrat
  const hausratMap = { gesellschaft: 'Gesellschaft', versicherungsnummer: 'Versicherungsnr.', beitrag: 'Beitrag', zahlungsweise: 'Zahlungsweise', beginn: 'Beginn', ablauf: 'Ablauf', wohnflaeche: 'Wohnfläche', versicherungssumme: 'Versicherungssumme' };
  let hausratHtml = '';
  for (const [key, label] of Object.entries(hausratMap)) {
    hausratHtml += createRow('hausrat', key, parsed.hausrat?.[key], label);
  }
  if (hausratHtml) html += `<div class="review-category">Hausratversicherung</div>${hausratHtml}`;

  if (fieldCount === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding:20px 0;">Keine relevanten Felder erkannt.</p>';
  } else {
    container.innerHTML = html;
  }

  document.getElementById('review-modal-title').textContent = `Erkannte Daten überprüfen (${fieldCount} Felder)`;
  
  // Close standard upload modal, open review modal
  closeModal(); 
  document.getElementById('review-modal-overlay').style.display = 'flex';
}

function applyReviewSelected() {
  document.getElementById('review-modal-overlay').style.display = 'none';
  
  clearAllKIMarkers();
  const filledFields = { person: [], ausweis: [], adresse: [], arbeitgeber: [], rente: [], hausrat: [], radios: [] };

  const personIdMap = { vorname: 'p-vorname', nachname: 'p-nachname', geburtsdatum: 'p-geburtsdatum', anrede: 'p-anrede', geschlecht: 'p-geschlecht', titel: 'p-titel', staatsangehoerigkeit: 'p-staatsangehoerigkeit' };
  const ausIdMap = { art: 'aus-art', nummer: 'aus-nummer', behoerde: 'aus-behoerde', ausstellungsdatum: 'aus-ausstellungsdatum', gueltig_bis: 'aus-gueltigbis', geburtsort: 'aus-geburtsort' };
  const adrIdMap = { plz: 'a-plz', ort: 'a-ort', strasse: 'a-strasse', hausnummer: 'a-hausnummer', land: 'a-land' };
  const agIdMap = { arbeitgeber: 'ag-arbeitgeber', plz: 'ag-plz', ort: 'ag-ort', strasse: 'ag-strasse', hausnummer: 'ag-hausnummer', telefonVorwahl: 'ag-telvorwahl', telefonNummer: 'ag-telnummer', taetigkeit: 'ag-taetigkeit', arbeitgeber_pct: 'ag-pct', arbeitgeber_eur: 'ag-eur' };
  const renteIdMap = { renteVollEM: 'r-em', regelAltersrente: 'r-regel', jahreEingezahlt: 'r-jahre' };
  const hausratIdMap = { gesellschaft: 'hr-gesellschaft', versicherungsnummer: 'hr-nummer', beitrag: 'hr-beitrag', zahlungsweise: 'hr-zahlung', beginn: 'hr-beginn', ablauf: 'hr-ablauf', wohnflaeche: 'hr-wfl', versicherungssumme: 'hr-vs' };

  let totalApplied = 0;

  // Process selected boxes
  document.querySelectorAll('#review-fields-container input[type="checkbox"]:checked').forEach(cb => {
    const cat = cb.dataset.category;
    const key = cb.dataset.key;
    const val = document.getElementById(`review-input-${cat}-${key}`).value;
    
    if (cat === 'person' && personIdMap[key]) { state.data.person[key] = val; filledFields.person.push(personIdMap[key]); totalApplied++; }
    if (cat === 'ausweis' && ausIdMap[key]) { state.data.ausweis[key] = val; filledFields.ausweis.push(ausIdMap[key]); totalApplied++; }
    if (cat === 'adresse' && adrIdMap[key]) { state.data.adresse[key] = val; filledFields.adresse.push(adrIdMap[key]); totalApplied++; }
    if (cat === 'arbeitgeber') {
      state.data.arbeitgeber[key] = val;
      if (key === 'befristung') filledFields.radios.push('ag-befristung');
      else if (key === 'bav') filledFields.radios.push('ag-bav');
      else if (agIdMap[key]) filledFields.arbeitgeber.push(agIdMap[key]);
      totalApplied++;
    }
    if (cat === 'rente' && renteIdMap[key]) { state.data.rente[key] = val; filledFields.rente.push(renteIdMap[key]); totalApplied++; }
    if (cat === 'hausrat') {
      state.data.hausrat[key] = val;
      if (key === 'zahlungsweise') filledFields.radios.push('hr-zahlung');
      else if (hausratIdMap[key]) filledFields.hausrat.push(hausratIdMap[key]);
      totalApplied++;
    }
  });

  // Navigation Logic based on DocType
  let navPage = ['berufliche-angaben', 'arbeitgeber'];
  if (currentParsedData.docType === 'Renteninformation') navPage = ['rente', 'rente'];
  else if (currentParsedData.docType === 'Versicherungsvertrag') navPage = ['versicherungen', 'hausrat'];
  else if (currentParsedData.docType === 'Ausweis') navPage = ['persoenliche-angaben', 'ausweisdaten'];
  else if (totalApplied > 0 && filledFields.person.length > filledFields.arbeitgeber.length) navPage = ['persoenliche-angaben', 'personendaten'];

  navigate(navPage[0], navPage[1]);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    filledFields.person.forEach(markKIField);
    filledFields.ausweis.forEach(markKIField);
    filledFields.adresse.forEach(markKIField);
    filledFields.arbeitgeber.forEach(markKIField);
    filledFields.rente.forEach(markKIField);
    filledFields.hausrat.forEach(markKIField);
    filledFields.radios.forEach(markKIRadio);
    if (totalApplied > 0) showKIBanner(navPage[1], totalApplied);

    if (currentReviewResolve) currentReviewResolve(totalApplied);
    currentReviewResolve = null;
    currentParsedData = null;
  }));
}

function cancelReview() {
  document.getElementById('review-modal-overlay').style.display = 'none';
  if (currentReviewResolve) currentReviewResolve(0);
  currentReviewResolve = null;
  currentParsedData = null;
}



// ===== IMAGE UPLOAD (VISION) =====
async function readImageAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
         const canvas = document.createElement('canvas');
         // Scale down if image is huge (e.g., > 2500px)
         let w = img.width;
         let h = img.height;
         const maxDim = 2500;
         if (w > maxDim || h > maxDim) {
           const ratio = Math.min(maxDim / w, maxDim / h);
           w = Math.round(w * ratio);
           h = Math.round(h * ratio);
         }
         canvas.width = w;
         canvas.height = h;
         const ctx = canvas.getContext('2d');
         // Fill white background in case of transparent PNG
         ctx.fillStyle = '#ffffff';
         ctx.fillRect(0, 0, w, h);
         ctx.drawImage(img, 0, 0, w, h);
         // Convert to JPEG base64
         const base64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
         resolve([base64]);
      };
      img.onerror = () => reject(new Error('Bild konnte nicht geladen werden'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Fehler beim Lesen der Bilddatei'));
    reader.readAsDataURL(file);
  });
}

// ===== MULTI-FILE QUEUE =====
async function processFileQueue(files) {
      const list = Array.from(files).filter(f => {
        const n = f.name.toLowerCase();
        return n.endsWith('.pdf') || n.endsWith('.jpg') || n.endsWith('.jpeg') || n.endsWith('.png');
      });
      if (!list.length) {
        showToast('⚠️ Bitte PDF, JPG oder PNG hochladen.');
        return;
      }
      
      let combinedParsed = { person: {}, ausweis: {}, adresse: {}, arbeitgeber: {}, einnahmen: {}, rente: {}, hausrat: {} };
      let hasData = false;
      let lastDocType = 'Dokument';

      for (let i = 0; i < list.length; i++) {
        const file = list[i];
        const prefix = list.length > 1 ? `(${i + 1}/${list.length}) ` : '';
        const parsed = await processSingleFile(file, prefix);
        
        if (parsed) {
          hasData = true;
          if (parsed.docType && parsed.docType !== 'Dokument' && parsed.docType !== 'Unbekannt') {
            lastDocType = parsed.docType;
          }
          ['person', 'ausweis', 'adresse', 'arbeitgeber', 'einnahmen', 'rente', 'hausrat'].forEach(key => {
            if (parsed[key]) {
              Object.entries(parsed[key]).forEach(([k, v]) => {
                if (v && String(v).trim() !== '') {
                  combinedParsed[key][k] = v;
                }
              });
            }
          });
        }
      }
      
      combinedParsed.docType = lastDocType;

      if (hasData) {
        const verifiedFields = await new Promise(resolveUpload => {
          showReviewModal(combinedParsed, resolveUpload);
        });
        if (list.length > 1) {
          showToast(`✓ ${list.length} Dokumente verarbeitet – ${verifiedFields} Felder befüllt`);
        }
      }
    }

function processSingleFile(file, prefix = '') {
      return new Promise(resolve => {
        const status = document.getElementById('upload-status');
        const progressWrap = document.getElementById('progress-wrap');
        const bar = document.getElementById('progress-bar');
        bar.style.background = '';
        status.textContent = prefix + 'Lese Dokument...';
        progressWrap.classList.add('visible');
        bar.style.width = '0%';

        const apiKey = getGeminiKey();
        const isImage = file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png)$/i);
        
        if (isImage && !apiKey) {
           status.textContent = prefix + '⚠️ Für Bilder wird ein Gemini API Key benötigt.';
           resolve(null);
           return;
        }

        let pct = 0;
        const tickInterval = setInterval(() => {
          if (pct < 80) { pct += Math.random() * 5 + 1; bar.style.width = Math.min(pct, 80) + '%'; }
          const labels = apiKey
            ? [prefix + 'Seite wird vorbereitet...', prefix + 'Bild wird aufbereitet...', prefix + '🤖 Gemini Vision analysiert...']
            : [prefix + 'Lese Dokument...', prefix + 'Erkenne Felder...', prefix + 'Extrahiere Daten...'];
          status.textContent = labels[Math.min(Math.floor(pct / 27), labels.length - 1)];
        }, 200);

        const processPromise = apiKey 
          ? (isImage ? readImageAsBase64(file) : renderPDFToImages(file))
          : extractPDFTextFallback(file);

        processPromise
          .then(payload => {
            clearInterval(tickInterval);
            if (!payload) {
              bar.style.width = '0%';
              status.textContent = prefix + '⚠️ Dokument konnte nicht gelesen werden.';
              resolve(null);
              return;
            }
            finishUpload(payload, !!apiKey).then(resolve).catch(() => resolve(null));
          })
          .catch(err => {
            clearInterval(tickInterval);
            status.textContent = prefix + '⚠️ Fehler: ' + err.message;
            console.error(err);
            resolve(null);
          });
      });
    }

// ===== DROP ZONE EVENTS =====
function setupDropZone(zoneId, inputId) {
      const zone = document.getElementById(zoneId);
      if (!zone) return;
      zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
      zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
      zone.addEventListener('drop', e => {
        e.preventDefault(); zone.classList.remove('dragover');
        if (e.dataTransfer.files.length) processFileQueue(e.dataTransfer.files);
      });
      const input = document.getElementById(inputId);
      if (input) input.addEventListener('change', () => { if (input.files.length) processFileQueue(input.files); });
    }

// ===== TOAST =====
function showToast(msg) {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 3500);
    }

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
      // Nav click handlers
      document.querySelectorAll('[data-page]').forEach(el => {
        el.addEventListener('click', e => {
          e.stopPropagation();
          const page = el.dataset.page;
          const sub = el.dataset.sub;
          if (el.classList.contains('has-children')) { toggleSubNav(el); return; }
          navigate(page, sub);
        });
      });

      document.querySelector('.sidebar-toggle')?.addEventListener('click', toggleSidebar);

      // Modal
      document.getElementById('upload-btn')?.addEventListener('click', openModal);
      document.querySelector('.modal-close')?.addEventListener('click', closeModal);
      document.getElementById('modal-overlay')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
      setupDropZone('modal-dropzone', 'modal-file-input');

      // Review Modal
      document.getElementById('review-modal-close')?.addEventListener('click', cancelReview);
      document.getElementById('review-btn-cancel')?.addEventListener('click', cancelReview);
      document.getElementById('review-btn-apply')?.addEventListener('click', applyReviewSelected);

      // Gemini API Key management
      const keyInput = document.getElementById('gemini-api-key');
      const keyStatus = document.getElementById('api-key-status');
      const savedKey = getGeminiKey();
      const savedModel = getGeminiModel();
      if (savedKey) {
        keyInput.value = savedKey;
        keyStatus.textContent = `✓ Modell: ${savedModel}`;
        keyStatus.classList.add('api-key-set');
      }
      document.getElementById('save-api-key')?.addEventListener('click', async () => {
        const v = keyInput.value.trim();
        if (v) {
          localStorage.setItem('gemini_api_key', v);
          keyStatus.textContent = '🔍 Erkenne verfügbare Modelle...';
          keyStatus.classList.remove('api-key-set');
          const model = await detectGeminiModel(v);
          if (model) {
            localStorage.setItem('gemini_model', model);
            keyStatus.textContent = `✓ Modell: ${model}`;
            keyStatus.classList.add('api-key-set');
          } else {
            keyStatus.textContent = '⚠️ Key ungültig oder kein Zugriff';
            keyStatus.style.color = '#c62828';
          }
        } else {
          localStorage.removeItem('gemini_api_key');
          localStorage.removeItem('gemini_model');
          keyStatus.textContent = 'Key entfernt';
          keyStatus.classList.remove('api-key-set');
        }
      });

      // Save buttons
      document.querySelectorAll('[data-action="save"]').forEach(btn => {
        btn.addEventListener('click', savePageData);
      });
      document.querySelectorAll('[data-action="save-next"]').forEach(btn => {
        btn.addEventListener('click', () => { savePageData(); navigate('berufliche-angaben', 'arbeitgeber'); });
      });

      // Open Persönliche Angaben > Personendaten by default
      const defaultSub = document.querySelector('.sub-nav');
      if (defaultSub) defaultSub.classList.add('open');
      const defLink = document.querySelector('.nav-link.has-children');
      if (defLink) defLink.classList.add('open');

      navigate('persoenliche-angaben', 'personendaten');
    });
