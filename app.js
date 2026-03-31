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
    einnahmen: { brutto: '', netto: '', anzahlProJahr: '12' },
    gkv: { gesellschaft: '', mitgliedsnummer: '', beginn: '', status: '', bonus: '', notizen: '' },
    steuerdaten: { steuerId: '', svNummer: '' }
  }
};

// ===== TOP NAVIGATION SECTIONS =====
// Sections: 'dashboard', 'daten', 'beratung', 'vertraege', 'informationen', 'controlling'
const TOP_NAV_SECTIONS = {
  dashboard: { sidebarDaten: false, sidebarBeratung: false, page: 'dashboard',  sub: 'dashboard' },
  daten:     { sidebarDaten: true,  sidebarBeratung: false, page: null,          sub: null },
  beratung:  { sidebarDaten: false, sidebarBeratung: true,  page: 'jeg2026',     sub: 'jeg2026' },
  vertraege: { sidebarDaten: false, sidebarBeratung: false, page: 'vertraege',   sub: 'vertraege' },
  'pot-jeg': { sidebarDaten: false, sidebarBeratung: false, page: 'pot-jeg',     sub: 'pot-jeg' },
};
state.activeSection = 'daten'; // default section

function switchSection(section) {
  state.activeSection = section;
  const cfg = TOP_NAV_SECTIONS[section];
  if (!cfg) return;

  // Update active tab styling
  document.querySelectorAll('.top-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === section);
  });

  // Show/hide the two sidebars independently
  const sidebarDaten    = document.getElementById('sidebar');
  const sidebarBeratung = document.getElementById('sidebar-beratung');
  if (sidebarDaten)    sidebarDaten.classList.toggle('section-hidden', !cfg.sidebarDaten);
  if (sidebarBeratung) sidebarBeratung.classList.toggle('section-hidden', !cfg.sidebarBeratung);

  // Show KI upload button only in Daten section
  document.querySelectorAll('.ki-btn-daten-only').forEach(btn => {
    btn.style.display = (section === 'daten') ? '' : 'none';
  });

  // Navigate to target page
  if (cfg.page) {
    navigate(cfg.page, cfg.sub);
  } else if (section === 'daten') {
    const isBeratungPage = p => !p || p.startsWith('jeg') || [
      'dashboard','informationen','controlling','vertraege','pot-jeg',
      'spezialthemen','beratung',
      // Beratung sub-pages
      'vermoegensanlage','kindervorsorge','servicefeedback'
    ].includes(p);

    // If EITHER current page or sub-page is a beratung/non-daten page, go to daten default
    if (isBeratungPage(state.currentPage) || isBeratungPage(state.currentSubPage)) {
      navigate('persoenliche-angaben', 'personendaten');
    } else {
      navigate(state.currentPage, state.currentSubPage);
    }
  }

}


// ===== NAVIGATION =====
function navigate(page, subPage) {
  state.currentPage = page;
  state.currentSubPage = subPage || page;
  renderNav();
  renderPage();
}

function renderNav() {
  document.querySelectorAll('.nav-link, .sub-nav-link, .bnav-link, .bnav-sub-link, .bnav-subsub-link').forEach(el => el.classList.remove('active'));
  const active = document.querySelector(`[data-page="${state.currentPage}"][data-sub="${state.currentSubPage}"]`) ||
    document.querySelector(`[data-page="${state.currentPage}"]`);
  if (active) active.classList.add('active');
  
  // Close all submenus first, then only open the active one
  document.querySelectorAll('.sub-nav, .bnav-sub').forEach(sub => {
    sub.classList.remove('open');
    if (sub.previousElementSibling) sub.previousElementSibling.classList.remove('open');
    
    // Open parent if sub-page active OR if the parent link itself is active
    if (sub.querySelector('.active') || (sub.previousElementSibling && sub.previousElementSibling.classList.contains('active'))) {
      sub.classList.add('open');
      if (sub.previousElementSibling) sub.previousElementSibling.classList.add('open');
    }
  });
}

function toggleSubNav(el) {
  const sub = el.nextElementSibling;
  if (!sub || (!sub.classList.contains('sub-nav') && !sub.classList.contains('bnav-sub'))) return;
  sub.classList.toggle('open');
  el.classList.toggle('open');
}

function toggleSidebar() {
  state.sidebarCollapsed = !state.sidebarCollapsed;
  document.getElementById('sidebar').classList.toggle('collapsed', state.sidebarCollapsed);
}

function updateBnavSubActive(activeSub) {
  document.querySelectorAll('.bnav-sub-link').forEach(link => {
    link.classList.toggle('active', link.dataset.sub === activeSub);
  });
}

function updateBnavSubSubActive(activeSub) {
  document.querySelectorAll('.bnav-subsub-link').forEach(link => {
    link.classList.toggle('active', link.dataset.sub === activeSub);
  });
}


// ===== PAGES =====
function renderPage() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pageId = state.currentSubPage || state.currentPage;
  const el = document.getElementById('page-' + pageId);
  if (el) {
    el.classList.add('active');
    fillFormFromState();
    // Lazily initialize the Förder-Vergleichsrechner on first visit
    if (pageId === 'jeg-foerder' && typeof initFoerderRechner === 'function') {
      initFoerderRechner();
    }
  }
  // Scroll to top on every page change
  const scroller = document.querySelector('.main-content') || document.querySelector('main') || document.documentElement;
  if (scroller) scroller.scrollTop = 0;
  window.scrollTo(0, 0);
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
  // Einnahmen
  setVal('e-brutto', state.data.einnahmen.brutto);
  setVal('e-netto', state.data.einnahmen.netto);
  setVal('e-anzahl', state.data.einnahmen.anzahlProJahr);
  // GKV
  setVal('gkv-gesellschaft', state.data.gkv.gesellschaft);
  setVal('gkv-nummer', state.data.gkv.mitgliedsnummer);
  setVal('gkv-beginn', state.data.gkv.beginn);
  setVal('gkv-notizen', state.data.gkv.notizen);
  setRadio('gkv-status', state.data.gkv.status);
  setRadio('gkv-bonus', state.data.gkv.bonus);
  // Steuerdaten
  setVal('st-einkommen', state.data.steuerdaten?.einkommen);
  setRadio('st-familienstand', state.data.steuerdaten?.familienstand);
  setRadio('st-steuerklasse', state.data.steuerdaten?.steuerklasse);
  setRadio('st-kirchensteuer', state.data.steuerdaten?.kirchensteuerpflichtig);
  setRadio('st-sozialversicherung', state.data.steuerdaten?.sozialversicherungspflichtig);
  setVal('st-id', state.data.steuerdaten?.steuerId);
  setVal('st-sv', state.data.steuerdaten?.svNummer);
  setVal('st-steuernummer', state.data.steuerdaten?.steuernummer);
  setVal('st-finanzamt', state.data.steuerdaten?.finanzamt);
  // Energie
  setVal('en-strom-verbrauch', state.data.energie?.strom_verbrauch);
  setVal('en-strom-kosten', state.data.energie?.strom_kosten);
  setVal('en-strom-anbieter', state.data.energie?.strom_anbieter);
  setCheckbox('en-strom-oeko', state.data.energie?.strom_oeko);
  setCheckbox('en-strom-gewerblich', state.data.energie?.strom_gewerblich);
  setVal('en-gas-verbrauch', state.data.energie?.gas_verbrauch);
  setVal('en-gas-kosten', state.data.energie?.gas_kosten);
  setVal('en-gas-anbieter', state.data.energie?.gas_anbieter);
  setCheckbox('en-gas-oeko', state.data.energie?.gas_oeko);
  setCheckbox('en-gas-gewerblich', state.data.energie?.gas_gewerblich);
}

function setVal(id, val) { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; }
function setRadio(name, val) {
  const radios = document.querySelectorAll(`input[name="${name}"]`);
  radios.forEach(r => { r.checked = r.value === val; });
}
function setRadius(name, val) { setRadio(name, val); }
function setCheckbox(id, val) { const el = document.getElementById(id); if (el) el.checked = !!val; }

function savePageData() {
  const g = id => { const el = document.getElementById(id); return el ? el.value : ''; };
  const radio = name => { const r = document.querySelector(`input[name="${name}"]:checked`); return r ? r.value : ''; };
  const checkbox = id => { const el = document.getElementById(id); return el ? el.checked : false; };
  state.data.person = { anrede: g('p-anrede'), geschlecht: g('p-geschlecht'), titel: g('p-titel'), vorname: g('p-vorname'), nachname: g('p-nachname'), geburtsdatum: g('p-geburtsdatum'), geburtsname: g('p-geburtsname'), staatsangehoerigkeit: g('p-staatsangehoerigkeit') };
  state.data.ausweis = { art: g('aus-art'), nummer: g('aus-nummer'), behoerde: g('aus-behoerde'), ausstellungsdatum: g('aus-ausstellungsdatum'), gueltig_bis: g('aus-gueltigbis'), geburtsort: g('aus-geburtsort') };
  state.data.adresse = { land: g('a-land'), plz: g('a-plz'), ort: g('a-ort'), strasse: g('a-strasse'), hausnummer: g('a-hausnummer'), adresszusatz: g('a-adresszusatz') };
  state.data.arbeitgeber = { ...state.data.arbeitgeber, arbeitgeber: g('ag-arbeitgeber'), plz: g('ag-plz'), ort: g('ag-ort'), strasse: g('ag-strasse'), hausnummer: g('ag-hausnummer'), telefonVorwahl: g('ag-telvorwahl'), telefonNummer: g('ag-telnummer'), taetigkeit: g('ag-taetigkeit'), arbeitgeber_pct: g('ag-pct'), arbeitgeber_eur: g('ag-eur'), befristung: radio('ag-befristung'), bav: radio('ag-bav') };
  state.data.rente = { renteninfoVom: g('r-info'), renteVollEM: g('r-em'), regelAltersrente: g('r-regel'), kuenftigeRente: g('r-kuenftig'), gesetzlicheRente: radio('r-gesetzlich'), freiwilligkeit: radio('r-freiwilligkeit'), jahreEingezahlt: g('r-jahre') };
  state.data.einnahmen = { brutto: g('e-brutto'), netto: g('e-netto'), anzahlProJahr: g('e-anzahl') };
  state.data.gkv = { gesellschaft: g('gkv-gesellschaft'), mitgliedsnummer: g('gkv-nummer'), beginn: g('gkv-beginn'), status: radio('gkv-status'), bonus: radio('gkv-bonus'), notizen: g('gkv-notizen') };
  state.data.steuerdaten = { einkommen: g('st-einkommen'), familienstand: radio('st-familienstand'), steuerklasse: radio('st-steuerklasse'), kirchensteuerpflichtig: radio('st-kirchensteuer'), sozialversicherungspflichtig: radio('st-sozialversicherung'), steuerId: g('st-id'), svNummer: g('st-sv'), steuernummer: g('st-steuernummer'), finanzamt: g('st-finanzamt') };
  state.data.energie = { strom_verbrauch: g('en-strom-verbrauch'), strom_kosten: g('en-strom-kosten'), strom_anbieter: g('en-strom-anbieter'), strom_oeko: checkbox('en-strom-oeko'), strom_gewerblich: checkbox('en-strom-gewerblich'), gas_verbrauch: g('en-gas-verbrauch'), gas_kosten: g('en-gas-kosten'), gas_anbieter: g('en-gas-anbieter'), gas_oeko: checkbox('en-gas-oeko'), gas_gewerblich: checkbox('en-gas-gewerblich') };
  showToast('Daten gespeichert.');
}

// ===== MODAL =====
function openModal(context) {
  state.kiContext = context || 'daten';
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('upload-status').textContent = '';
  document.getElementById('progress-wrap').classList.remove('visible');
  drawQR('qrCanvas', '#000');
}

function openDakModal() {
  openModal('dak');
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
    const viewport = page.getViewport({ scale: 2.0 }); // 2x = high quality for small text like StKl column
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    // JPEG at 0.90 quality – higher detail for dense payslip tables
    const base64 = canvas.toDataURL('image/jpeg', 0.90).split(',')[1];
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
  else if (/krankenversicherung|gesundheitskarte|mitgliedsbescheinigung|kassenärztliche/i.test(text)) result.docType = 'Gesetzliche Krankenversicherung';
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
  "docType": "Gehaltsabrechnung|Renteninformation|Versicherungsvertrag|Gesetzliche Krankenversicherung|Kontoauszug|Ausweis|Unbekannt",
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
    "nummer": "",                       // Ausweisnummer / Dokumentennummer (Vorderseite oder maschinenlesbarer Bereich)
    "behoerde": "",                     // Ausstellende Behörde: auf der Rückseite unter 'Behörde / Authority / Autorité' (z.B. 'STADT KÖLN')
    "ausstellungsdatum": "TT.MM.JJJJ", // Rückseite unter 'Datum / Date / Date' (z.B. '02.08.21' → 02.08.2021)
    "gueltig_bis": "TT.MM.JJJJ",      // Gültigkeitsdatum: Vorderseite oder maschinenlesbarer Bereich
    "geburtsort": ""                    // Geburtsort: Vorderseite oder maschinenlesbarer Bereich
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
    "taetigkeit": "TT.MM.JJJJ",  // Eintrittsdatum beim Arbeitgeber (tätig seit / Beschäftigungsbeginn / Eintrittsdatum)
    "befristung": "ja|nein",
    "bav": "ja|nein",
    "arbeitgeber_pct": "",
    "arbeitgeber_eur": ""
  },
  "einnahmen": {
    "brutto": "",
    "netto": "",
    "steuerbrutto": "",
    "anzahlProJahr": "12|13|14"
  },
  "rente": {
    "renteninfoVom": "TT.MM.JJJJ",   // Datum des Schreibens der Deutschen Rentenversicherung (z.B. oben rechts auf dem Brief)
    "renteVollEM": "",                 // Rente wegen voller Erwerbsminderung (erster Betrag, z.B. 'Wären Sie heute erwerbsgemindert...')
    "regelAltersrente": "",            // 'bislang erreichte Rentenanwartschaft' / 'Ihre Rentenanwartschaft entspräche...' (ZWEITER Betrag, NICHT die künftige Rente!)
    "kuenftigeRente": "",              // künftige Regelaltersrente ohne Rentenanpassung (DRITTER / letzter Hauptbetrag)
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
  },
  "gkv": {
    "gesellschaft": "",
    "mitgliedsnummer": "",
    "beginn": "TT.MM.JJJJ",
    "status": "freiwillig versichert|pflichtversichert",
    "bonus": "ja|nein",
    "notizen": ""
  },
  "steuerdaten": {
    "einkommen": "",
    "familienstand": "geschieden|ledig|verheiratet|verwitwet",
    "steuerklasse": "I|II|III|IV|V",
    "kirchensteuerpflichtig": "ja|nein",
    "sozialversicherungspflichtig": "ja|nein",
    "steuerId": "",
    "svNummer": "",
    "steuernummer": "",
    "finanzamt": ""
  },
  "energie": {
    "strom_verbrauch": "",
    "strom_kosten": "",
    "strom_anbieter": "",
    "strom_oeko": false,
    "strom_gewerblich": false,
    "gas_verbrauch": "",
    "gas_kosten": "",
    "gas_anbieter": "",
    "gas_oeko": false,
    "gas_gewerblich": false
  }
}

Regeln:
- Lass Felder leer ("") wenn die Information nicht im Dokument steht
- Extrahiere nur tatsächlich vorhandene Daten, erfinde nichts
- Bei Ausweisen (auch z.B. Maschinenlesbarer Bereich): lies alle Felder wie Nummer, ausstellende Behörde, Geburtsort sorgfältig aus
- Deutsche Zahlenformate beibehalten (z.B. "3.450,00")
- Datumformat immer TT.MM.JJJJ
- Wenn Arbeitgeberadresse und Mitarbeiteradresse vorhanden, trenne sie korrekt
- Manche deutschen Lohnabrechnungen (z.B. DATEV-Format) schreiben Daten komprimiert ohne Trennzeichen und mit 2-stelliger Jahreszahl, z.B. "010120" = 01.01.2020 oder "010102" = 01.01.2002. Wandle solche 6-stelligen Datumsangaben (TTMMJJ) immer in TT.MM.JJJJ um. Jahreszahlen 00–30 → 2000–2030, 31–99 → 1931–1999.
- Das Feld "Eintritt" auf Gehaltsabrechnungen entspricht dem JSON-Feld "taetigkeit" im Arbeitgeber-Objekt
- Renteninformation (Deutsche Rentenversicherung): Das Briefdatum oben rechts (z.B. "Datum 03.01.2023") → renteninfoVom. Die drei Hauptbeträge im Dokument sind IMMER: 1) Erwerbsminderungsrente → renteVollEM, 2) bislang erreichte Rentenanwartschaft ("Ihre bislang erreichte Rentenanwartschaft entspräche...") → regelAltersrente, 3) künftige Regelaltersrente ohne Rentenanpassung (der letzte der drei Hauptbeträge) → kuenftigeRente. Verwechsle diese Beträge NICHT miteinander.
- Personalausweis Rückseite: Das Feld 'Datum / Date / Date' (z.B. '02.08.21') ist das Ausstellungsdatum → ausstellungsdatum. Das Feld 'Behörde / Authority / Autorité' (z.B. 'STADT KÖLN') ist die ausstellende Behörde → behoerde. Datumsangaben auf Ausweisen mit 2-stelligem Jahr (Format TT.MM.JJ) immer in TT.MM.JJJJ umwandeln: Jahreszahlen 00–30 →2000–2030, 31–99 →1931–1999.
- Steuerklasse (Spalte 'StKl' auf Gehaltsabrechnungen): Auf Lohnabrechnungen steht die Steuerklasse oft als arabische Zahl (1–5). Wandle diese IMMER in römische Zahlen um: 1→I, 2→II, 3→III, 4→IV, 5→V. Im Feld steuerklasse nur I, II, III, IV oder V eintragen.
- Steuer-Brutto: Ist auf Gehaltsabrechnungen oft (unten links) bei den kumulierten Jahreswerten / Verdienstbescheinigung zu finden. Extrahiere diesen Betrag pflichtgemäß.

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
  const body = { contents: [{ parts }], generationConfig: { temperature: 0 } };
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

// Section index for pagination
let _reviewSections = [];  // [{title, html}]
let _reviewCurrentIdx = 0;
// Human-in-the-loop review state
let currentReviewResolve = null;
let currentParsedData = null;


function showReviewModal(parsed, resolveUpload) {
  currentReviewResolve = resolveUpload;
  currentParsedData = parsed;
  let fieldCount = 0;

  // Fields that are mandatory in the main forms (keys match state/JSON field names)
  const REQUIRED_FIELDS = {
    steuerdaten: new Set(['familienstand', 'steuerklasse', 'kirchensteuerpflichtig', 'sozialversicherungspflichtig']),
    arbeitgeber: new Set(['befristung', 'bav', 'arbeitgeber_pct']),
    einnahmen:   new Set(['brutto', 'netto', 'anzahlProJahr']),
    hausrat:     new Set(['gesellschaft', 'versicherungsnummer', 'beitrag', 'zahlungsweise', 'wohnflaeche']),
    gkv:         new Set(['gesellschaft', 'status']),
  };
  const isRequired = (cat, key) => REQUIRED_FIELDS[cat]?.has(key) ?? false;

  // Predefined options for fields rendered as dropdowns
  const FIELD_OPTIONS = {
    familienstand:             ['geschieden', 'ledig', 'verheiratet', 'verwitwet'],
    steuerklasse:              ['I', 'II', 'III', 'IV', 'V'],
    kirchensteuerpflichtig:    ['ja', 'nein'],
    sozialversicherungspflichtig: ['ja', 'nein'],
    befristung:                ['ja', 'nein'],
    bav:                       ['ja', 'nein'],
    arbeitgeber_pct:           ['15', '20', '25'],
    anzahlProJahr:             ['12', '13', '14'],
    zahlungsweise:             ['monatlich', 'vierteljährlich', 'halbjährlich', 'jährlich'],
    status:                    ['freiwillig versichert', 'pflichtversichert'],
    bonus:                     ['ja', 'nein'],
    'art':                     ['Personalausweis', 'Reisepass', 'Führerschein'],
    geschaeftsform:            ['GmbH', 'AG', 'KG', 'GbR'],
  };

  // Helper: build a <select> element for fields with predefined options
  const buildSelect = (category, key, currentVal, extraClass = '') => {
    const opts = FIELD_OPTIONS[key] || [];
    const options = ['', ...opts].map(o => {
      const selected = o === currentVal ? ' selected' : '';
      return `<option value="${o}"${selected}>${o === '' ? '— bitte wählen —' : o}</option>`;
    }).join('');
    return `<select id="review-input-${category}-${key}" class="review-select${extraClass ? ' ' + extraClass : ''}">${options}</select>`;
  };

  // Renders a row for an AI-extracted field (checked checkbox)
  const createRow = (category, key, value, label) => {
    if (value === undefined || value === null || String(value).trim() === '') return null;
    fieldCount++;
    const safeVal = String(value).trim();
    const hasOptions = !!FIELD_OPTIONS[key];
    const inputHtml = hasOptions
      ? buildSelect(category, key, safeVal)
      : `<input type="text" value="${safeVal.replace(/"/g, '&quot;')}" id="review-input-${category}-${key}">`;
    return `
      <div class="review-row">
        <label>
          <input type="checkbox" checked data-category="${category}" data-key="${key}">
          ${label}
        </label>
        ${inputHtml}
      </div>
    `;
  };

  // Renders a row for a field NOT extracted by AI (unchecked, empty, editable)
  const createEmptyRow = (category, key, label) => {
    const req = isRequired(category, key);
    const reqMark = req ? '<span class="review-required-mark" title="Pflichtfeld">*</span>' : '';
    const reqClass = req ? ' review-row--required' : '';
    const hasOptions = !!FIELD_OPTIONS[key];
    const inputHtml = hasOptions
      ? buildSelect(category, key, '', `review-input--empty${req ? ' review-input--required' : ''}`)
      : `<input type="text" value="" placeholder="—" id="review-input-${category}-${key}" class="review-input--empty${req ? ' review-input--required' : ''}">`;
    return `
      <div class="review-row review-row--missing${reqClass}">
        <label>
          <input type="checkbox" data-category="${category}" data-key="${key}">
          <span>${label}${reqMark}</span>
        </label>
        ${inputHtml}
      </div>
    `;
  };

  // Returns HTML for a section if at least one field was extracted, null otherwise
  const renderSection = (category, fieldMap, parsedObj) => {
    let extracted = '';
    let missingRequired = '';
    let missingOptional = '';
    for (const [key, label] of Object.entries(fieldMap)) {
      const row = createRow(category, key, parsedObj?.[key], label);
      if (row !== null) {
        extracted += row;
      } else if (isRequired(category, key)) {
        missingRequired += createEmptyRow(category, key, label);
      } else {
        missingOptional += createEmptyRow(category, key, label);
      }
    }
    // Order: extracted → required-missing → optional-missing
    return extracted ? extracted + missingRequired + missingOptional : null;
  };

  // Define field maps
  const personMap     = { vorname: 'Vorname', nachname: 'Nachname', geburtsdatum: 'Geburtsdatum', anrede: 'Anrede', geschlecht: 'Geschlecht', titel: 'Titel', geburtsname: 'Geburtsname', staatsangehoerigkeit: 'Staatsangehörigkeit' };
  const ausMap        = { art: 'Ausweisart', nummer: 'Dokumentnummer', behoerde: 'Behörde', ausstellungsdatum: 'Ausstellungsdatum', gueltig_bis: 'Gültig bis', geburtsort: 'Geburtsort' };
  const adrMap        = { land: 'Land', plz: 'PLZ', ort: 'Ort', strasse: 'Straße', hausnummer: 'Hausnummer', adresszusatz: 'Adresszusatz' };
  const steuerMap     = { einkommen: 'zu verst. Einkommen', familienstand: 'Familienstand', steuerklasse: 'Steuerklasse', kirchensteuerpflichtig: 'Kirchensteuerpfl.', sozialversicherungspflichtig: 'Sozialvers.pfl.', steuerId: 'Steuer-ID', svNummer: 'SV-Nummer', steuernummer: 'Steuernummer', finanzamt: 'Finanzamt' };
  const energieMap    = { strom_verbrauch: 'Strom Verbrauch', strom_kosten: 'Strom Kosten', strom_anbieter: 'Strom Anbieter', strom_oeko: 'Ökostrom erwünscht', strom_gewerblich: 'Strom gewerblich', gas_verbrauch: 'Gas Verbrauch', gas_kosten: 'Gas Kosten', gas_anbieter: 'Gas Anbieter', gas_oeko: 'Biogas erwünscht', gas_gewerblich: 'Gas gewerblich' };
  const agMap         = { arbeitgeber: 'Name Arbeitgeber', plz: 'PLZ', ort: 'Ort', strasse: 'Straße', hausnummer: 'Hausnummer', telefonVorwahl: 'Tele-Vorwahl', telefonNummer: 'Tele-Nummer', taetigkeit: 'Eintritt', befristung: 'Befristung', bav: 'bAV', arbeitgeber_pct: 'Anteil AG (%)', arbeitgeber_eur: 'Anteil AG (€)' };
  const renteMap      = { renteninfoVom: 'Renteninformation vom', renteVollEM: 'Erwerbsminderungsrente', regelAltersrente: 'Bislang erreichte Regelaltersrente', kuenftigeRente: 'Künftige Rente (ohne Anpassung)', jahreEingezahlt: 'Jahre eingezahlt' };
  const einnahmenMap  = { brutto: 'Brutto in Euro', netto: 'Netto in Euro', anzahlProJahr: 'Anzahl pro Jahr' };
  const hausratMap    = { gesellschaft: 'Gesellschaft', versicherungsnummer: 'Versicherungsnr.', beitrag: 'Beitrag', zahlungsweise: 'Zahlungsweise', beginn: 'Beginn', ablauf: 'Ablauf', wohnflaeche: 'Wohnfläche', versicherungssumme: 'Versicherungssumme' };
  const gkvMap        = { gesellschaft: 'Name der Gesellschaft', mitgliedsnummer: 'Mitgliedsnummer', beginn: 'Beginn', status: 'Versicherungsstatus', bonus: 'Bonusprogramm' };

  // Build sections array: only include sections with at least one extracted field
  const sectionDefs = [
    ['Person',                          'person',      personMap,    parsed.person],
    ['Ausweis',                         'ausweis',     ausMap,       parsed.ausweis],
    ['Adresse',                         'adresse',     adrMap,       parsed.adresse],
    ['Steuerdaten',                     'steuerdaten', steuerMap,    parsed.steuerdaten],
    ['Energie (Ausgaben)',              'energie',     energieMap,   parsed.energie],
    ['Beruf & Arbeitgeber',            'arbeitgeber', agMap,        parsed.arbeitgeber],
    ['Rente',                           'rente',       renteMap,     parsed.rente],
    ['Einkommen',                       'einnahmen',   einnahmenMap, parsed.einnahmen],
    ['Hausratversicherung',             'hausrat',     hausratMap,   parsed.hausrat],
    ['Gesetzliche Krankenversicherung', 'gkv',         gkvMap,       parsed.gkv],
  ];

  _reviewSections = [];
  for (const [title, category, fieldMap, parsedObj] of sectionDefs) {
    const body = renderSection(category, fieldMap, parsedObj);
    if (body) _reviewSections.push({ title, html: body });
  }

  // Build full html with all sections in hidden wrappers so inputs persist between pages
  const container = document.getElementById('review-fields-container');
  let fullHtml = '';
  _reviewSections.forEach((sec, i) => {
    fullHtml += `<div class="review-section-page" id="review-section-${i}" style="display:none;">${sec.html}</div>`;
  });
  container.innerHTML = fullHtml;

  // Auto-check + remove empty styling + update apply button on input/change
  const autoCheckOnInput = (e) => {
    if (e.target.classList.contains('review-input--empty') && e.target.value.trim() !== '') {
      e.target.classList.remove('review-input--empty', 'review-input--required');
      const row = e.target.closest('.review-row');
      if (row) {
        const cb = row.querySelector('input[type="checkbox"]');
        if (cb && !cb.checked) cb.checked = true;
      }
    }
    _reviewUpdateApplyBtn();
  };
  container.addEventListener('input', autoCheckOnInput);
  container.addEventListener('change', autoCheckOnInput);

  // Initial state of apply button
  // (will be set correctly once _reviewUpdateApplyBtn runs after sections are built)
  setTimeout(_reviewUpdateApplyBtn, 0);

  document.getElementById('review-modal-title').textContent = `Erkannte Daten überprüfen (${fieldCount} erkannte Felder)`;

  // Show first section
  _reviewCurrentIdx = 0;
  _reviewRenderPage();

  // Close standard upload modal, open review modal
  closeModal();
  document.getElementById('review-modal-overlay').style.display = 'flex';
}

function _reviewRenderPage() {
  const total = _reviewSections.length;
  const idx = _reviewCurrentIdx;

  // Show/hide section pages
  document.querySelectorAll('.review-section-page').forEach((el, i) => {
    el.style.display = i === idx ? '' : 'none';
  });

  // Update nav labels
  document.getElementById('review-step-label').textContent = _reviewSections[idx]?.title || '';
  document.getElementById('review-step-counter').textContent = `${idx + 1} / ${total}`;

  // Enable/disable prev
  document.getElementById('review-btn-prev').disabled = idx === 0;

  // Next button: hide on last step, show on earlier steps
  const nextBtn = document.getElementById('review-btn-next');
  if (idx === total - 1) {
    nextBtn.style.visibility = 'hidden';
  } else {
    nextBtn.style.visibility = '';
    nextBtn.textContent = 'Weiter →';
    nextBtn.disabled = false;
    nextBtn.onclick = () => reviewNavigate(1);
  }

  _reviewUpdateApplyBtn();
}

// Checks all required fields across all section pages and en/disables the apply button
function _reviewUpdateApplyBtn() {
  const applyBtn = document.getElementById('review-btn-apply');
  if (!applyBtn) return;

  // A required field is satisfied when its input/select has a non-empty value
  // (regardless of whether the checkbox is checked – the advisor must at least acknowledge it)
  const unmet = document.querySelectorAll(
    '#review-fields-container .review-row--required .review-input--empty, ' +
    '#review-fields-container .review-row--required .review-input--required'
  );

  // Count fields that still have no value selected
  let missingCount = 0;
  unmet.forEach(el => {
    if (!el.value || el.value.trim() === '') missingCount++;
  });

  if (missingCount > 0) {
    applyBtn.disabled = true;
    applyBtn.title = `Bitte alle Pflichtfelder ausfüllen (${missingCount} offen)`;
  } else {
    applyBtn.disabled = false;
    applyBtn.title = '';
  }
}

function reviewNavigate(dir) {
  const next = _reviewCurrentIdx + dir;
  if (next < 0 || next >= _reviewSections.length) return;
  _reviewCurrentIdx = next;
  _reviewRenderPage();
}


function applyReviewSelected() {
  document.getElementById('review-modal-overlay').style.display = 'none';
  
  clearAllKIMarkers();
  const filledFields = { person: [], ausweis: [], adresse: [], arbeitgeber: [], rente: [], hausrat: [], einnahmen: [], gkv: [], steuerdaten: [], radios: [], energie: [] };

  const personIdMap = { vorname: 'p-vorname', nachname: 'p-nachname', geburtsdatum: 'p-geburtsdatum', anrede: 'p-anrede', geschlecht: 'p-geschlecht', titel: 'p-titel', geburtsname: 'p-geburtsname', staatsangehoerigkeit: 'p-staatsangehoerigkeit' };
  const ausIdMap = { art: 'aus-art', nummer: 'aus-nummer', behoerde: 'aus-behoerde', ausstellungsdatum: 'aus-ausstellungsdatum', gueltig_bis: 'aus-gueltigbis', geburtsort: 'aus-geburtsort' };
  const adrIdMap = { plz: 'a-plz', ort: 'a-ort', strasse: 'a-strasse', hausnummer: 'a-hausnummer', land: 'a-land', adresszusatz: 'a-adresszusatz' };
  const agIdMap = { arbeitgeber: 'ag-arbeitgeber', plz: 'ag-plz', ort: 'ag-ort', strasse: 'ag-strasse', hausnummer: 'ag-hausnummer', telefonVorwahl: 'ag-telvorwahl', telefonNummer: 'ag-telnummer', taetigkeit: 'ag-taetigkeit', arbeitgeber_pct: 'ag-pct', arbeitgeber_eur: 'ag-eur' };
  const renteIdMap = { renteninfoVom: 'r-info', renteVollEM: 'r-em', regelAltersrente: 'r-regel', kuenftigeRente: 'r-kuenftig', jahreEingezahlt: 'r-jahre' };
  const hausratIdMap = { gesellschaft: 'hr-gesellschaft', versicherungsnummer: 'hr-nummer', beitrag: 'hr-beitrag', zahlungsweise: 'hr-zahlung', beginn: 'hr-beginn', ablauf: 'hr-ablauf', wohnflaeche: 'hr-wfl', versicherungssumme: 'hr-vs' };
  const einnahmenIdMap = { brutto: 'e-brutto', netto: 'e-netto', anzahlProJahr: 'e-anzahl' };
  const gkvIdMap = { gesellschaft: 'gkv-gesellschaft', mitgliedsnummer: 'gkv-nummer', beginn: 'gkv-beginn', notizen: 'gkv-notizen' };
  const steuerIdMap = { einkommen: 'st-einkommen', steuerId: 'st-id', svNummer: 'st-sv', steuernummer: 'st-steuernummer', finanzamt: 'st-finanzamt' };
  const energieIdMap = { strom_verbrauch: 'en-strom-verbrauch', strom_kosten: 'en-strom-kosten', strom_anbieter: 'en-strom-anbieter', gas_verbrauch: 'en-gas-verbrauch', gas_kosten: 'en-gas-kosten', gas_anbieter: 'en-gas-anbieter' };

  let totalApplied = 0;

  // Process selected boxes
  document.querySelectorAll('#review-fields-container input[type="checkbox"]:checked').forEach(cb => {
    const cat = cb.dataset.category;
    const key = cb.dataset.key;
    const val = document.getElementById(`review-input-${cat}-${key}`).value;
    
    if (cat === 'person' && personIdMap[key]) { state.data.person[key] = val; filledFields.person.push(personIdMap[key]); totalApplied++; }
    if (cat === 'ausweis' && ausIdMap[key]) { state.data.ausweis[key] = val; filledFields.ausweis.push(ausIdMap[key]); totalApplied++; }
    if (cat === 'adresse' && adrIdMap[key]) { state.data.adresse[key] = val; filledFields.adresse.push(adrIdMap[key]); totalApplied++; }
    if (cat === 'steuerdaten') {
      state.data.steuerdaten[key] = val;
      if (['familienstand', 'steuerklasse', 'kirchensteuerpflichtig', 'sozialversicherungspflichtig'].includes(key)) {
        filledFields.radios.push(`st-${key.replace('pflichtig', '')}`);
      } else if (steuerIdMap[key]) {
        filledFields.steuerdaten.push(steuerIdMap[key]);
      }
      totalApplied++;
    }
    if (cat === 'energie') {
      state.data.energie = state.data.energie || {};
      state.data.energie[key] = val;
      if (['strom_oeko', 'strom_gewerblich', 'gas_oeko', 'gas_gewerblich'].includes(key)) {
        const id = `en-${key.replace('_', '-')}`;
        const cbEl = document.getElementById(id);
        if (cbEl) cbEl.checked = (String(val).toLowerCase() === 'true' || val === '1');
        filledFields.energie.push(id);
      } else if (energieIdMap[key]) {
        filledFields.energie.push(energieIdMap[key]);
      }
      totalApplied++;
    }
    if (cat === 'arbeitgeber') {
      state.data.arbeitgeber[key] = val;
      if (key === 'befristung') filledFields.radios.push('ag-befristung');
      else if (key === 'bav') filledFields.radios.push('ag-bav');
      else if (agIdMap[key]) filledFields.arbeitgeber.push(agIdMap[key]);
      totalApplied++;
    }
    if (cat === 'rente' && renteIdMap[key]) { state.data.rente[key] = val; filledFields.rente.push(renteIdMap[key]); totalApplied++; }
    if (cat === 'einnahmen' && einnahmenIdMap[key]) { state.data.einnahmen[key] = val; filledFields.einnahmen.push(einnahmenIdMap[key]); totalApplied++; }
    if (cat === 'hausrat') {
      state.data.hausrat[key] = val;
      if (key === 'zahlungsweise') filledFields.radios.push('hr-zahlung');
      else if (hausratIdMap[key]) filledFields.hausrat.push(hausratIdMap[key]);
      totalApplied++;
    }
    if (cat === 'gkv') {
      state.data.gkv[key] = val;
      if (key === 'status') filledFields.radios.push('gkv-status');
      else if (key === 'bonus') filledFields.radios.push('gkv-bonus');
      else if (gkvIdMap[key]) filledFields.gkv.push(gkvIdMap[key]);
      totalApplied++;
    }
  });

  // ===== DAK CONTEXT: fill Datenaktualisierung fields instead of navigating =====
  if (state.kiContext === 'dak') {
    // Navigate to the DAK sub-page and fill its fields
    navigate('jeg2026', 'jeg-datenaktualisierung');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== undefined && val !== null && String(val).trim() !== '') {
          el.value = val;
          el.style.background = '#f0f8ff';
          el.style.boxShadow = 'inset 3px 0 0 #1976D2';
        }
      };
      const setRadio = (name, val) => {
        const radio = document.querySelector(`input[type="radio"][name="${name}"][value="${val}"]`);
        if (radio) radio.checked = true;
      };
      const setSelect = (id, val) => {
        const el = document.getElementById(id);
        if (el && val) {
          for (const opt of el.options) {
            if (opt.text === val || opt.value === val) { el.value = opt.value; break; }
          }
        }
      };

      // From einnahmen → aktuelle Gehaltsabrechnung fields
      const e = currentParsedData?.einnahmen || {};
      setVal('dak-brutto-akt',       e.brutto);
      setVal('dak-netto-akt',        e.netto);
      setVal('dak-steuerbrutto-akt', e.steuerbrutto);
      setVal('dak-gehaelter-akt',    e.anzahlProJahr);

      // From steuerdaten
      const st = currentParsedData?.steuerdaten || {};
      setSelect('dak-stk-akt', st.steuerklasse);

      // From arbeitgeber
      const ag = currentParsedData?.arbeitgeber || {};
      setVal('dak-bav-akt',   ag.arbeitgeber_eur);
      setVal('dak-vl-akt',    ag.vl);

      // From rente
      const r = currentParsedData?.rente || {};
      setVal('dak-rente-regel',    r.regelAltersrente);
      setVal('dak-rente-em',       r.renteVollEM);
      setVal('dak-rente-jahre',    r.jahreEingezahlt);
      setVal('dak-rente-kuenftig', r.renteKuenftig);
      setVal('dak-rente-datum',    r.datum);

      const dakFilled = [e.brutto, e.netto, r.regelAltersrente, r.renteVollEM].filter(v => v && String(v).trim() !== '').length;
      if (dakFilled > 0) showToast(`✓ ${dakFilled} Felder in der Datenaktualisierung befüllt`);
      if (currentReviewResolve) currentReviewResolve(dakFilled);
      currentReviewResolve = null;
      currentParsedData = null;
    }));
    state.kiContext = 'daten';
    return;
  }

  // ===== STANDARD CONTEXT: navigate to relevant page =====
  let navPage = ['berufliche-angaben', 'arbeitgeber'];
  if (currentParsedData.docType === 'Renteninformation') navPage = ['rente', 'rente'];
  else if (currentParsedData.docType === 'Gehaltsabrechnung' || filledFields.steuerdaten.length > 0) {
    if (filledFields.steuerdaten.length > 0) navPage = ['persoenliche-angaben', 'steuerdaten'];
    else navPage = ['einnahmen', 'einnahmen'];
  }
  else if (currentParsedData.docType === 'Versicherungsvertrag') navPage = ['versicherungen', 'hausrat'];
  else if (currentParsedData.docType === 'Gesetzliche Krankenversicherung') navPage = ['versicherungen', 'existenzrisiken'];
  else if (currentParsedData.docType === 'Ausweis') navPage = ['persoenliche-angaben', 'ausweisdaten'];
  else if (filledFields.energie && filledFields.energie.length > 0) navPage = ['ausgaben', 'ausgaben'];
  else if (totalApplied > 0 && filledFields.person.length > filledFields.arbeitgeber.length) navPage = ['persoenliche-angaben', 'personendaten'];

  navigate(navPage[0], navPage[1]);

  requestAnimationFrame(() => requestAnimationFrame(() => {
    filledFields.person.forEach(markKIField);
    filledFields.ausweis.forEach(markKIField);
    filledFields.adresse.forEach(markKIField);
    filledFields.steuerdaten.forEach(markKIField);
    filledFields.arbeitgeber.forEach(markKIField);
    filledFields.rente.forEach(markKIField);
    filledFields.hausrat.forEach(markKIField);
    filledFields.einnahmen.forEach(markKIField);
    filledFields.gkv.forEach(markKIField);
    filledFields.energie.forEach(markKIField);
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
      
      let combinedParsed = { person: {}, ausweis: {}, adresse: {}, steuerdaten: {}, arbeitgeber: {}, einnahmen: {}, rente: {}, hausrat: {}, gkv: {} };
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
          ['person', 'ausweis', 'adresse', 'steuerdaten', 'arbeitgeber', 'einnahmen', 'rente', 'hausrat', 'gkv'].forEach(key => {
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
          if (el.classList.contains('has-children') || el.classList.contains('bnav-has-children')) { 
            toggleSubNav(el); 
            // Only navigate if it's explicitly the JEG 2026 overview
            if (el.id === 'bnav-jeg2026') navigate(page, sub);
            return; 
          }
          navigate(page, sub);
        });
      });

      document.querySelector('.sidebar-toggle')?.addEventListener('click', toggleSidebar);

      // Top navigation section buttons
      document.querySelectorAll('.top-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const section = btn.dataset.section;
          switchSection(section);
        });
      });

      // JEG 2026 parent: handle additional click logic if needed
      // (The toggle and navigation are now handled generically above)
      document.getElementById('bnav-jeg2026')?.addEventListener('click', () => {
        updateBnavSubActive(null);
      });

      // JEG 2026 sub-links
      document.querySelectorAll('.bnav-sub-link').forEach(link => {
        link.addEventListener('click', e => {
          e.stopPropagation();
          const page = link.dataset.page;
          const sub  = link.dataset.sub;

          // Tools & Rechner: toggle sub-sub menu instead of navigating directly
          if (sub === 'jeg-tools') {
            const subsub = document.getElementById('tools-subsub');
            if (subsub) subsub.classList.toggle('open');
            updateBnavSubActive(sub);
            updateBnavSubSubActive(null);
            navigate(page, sub);
            return;
          }

          // Collapse tools subsub when switching to another item
          const subsub = document.getElementById('tools-subsub');
          if (subsub) subsub.classList.remove('open');

          navigate(page, sub);
          updateBnavSubActive(sub);
          updateBnavSubSubActive(null);
        });
      });

      // JEG Tools sub-sub-links
      document.querySelectorAll('.bnav-subsub-link').forEach(link => {
        link.addEventListener('click', e => {
          e.stopPropagation();
          const page = link.dataset.page;
          const sub  = link.dataset.sub;
          navigate(page, sub);
          updateBnavSubActive('jeg-tools');
          updateBnavSubSubActive(sub);
        });
      });


      // Activate 'Daten' tab by default on load
      switchSection('daten');


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
    });

// ===== JEG METRIC BAR UPDATE =====
function jegUpdateMetric(inputId, barId, min, max) {
  const input = document.getElementById(inputId);
  const bar   = document.getElementById(barId);
  if (!input || !bar) return;
  const val = parseFloat(input.value) || 0;
  const pct = Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));
  bar.style.width = pct.toFixed(1) + '%';
}

// ===== JEG STEP CHECKBOX TOGGLE =====
function jegToggleStep(n) {
  const rect  = document.getElementById('jeg-cb-rect-' + n);
  const mark  = document.getElementById('jeg-cb-mark-' + n);
  const done  = document.getElementById('jeg-done-' + n);
  if (!rect) return;
  const checked = rect.getAttribute('data-checked') === 'true';
  if (!checked) {
    rect.setAttribute('fill', '#1a6eb5');
    rect.setAttribute('stroke', '#1565c0');
    rect.setAttribute('data-checked', 'true');
    mark.setAttribute('stroke', 'white');
    mark.setAttribute('opacity', '1');
    if (done) done.setAttribute('opacity', '0.25');
  } else {
    rect.setAttribute('fill', 'white');
    rect.setAttribute('stroke', '#1a6eb5');
    rect.setAttribute('data-checked', 'false');
    mark.setAttribute('opacity', '0');
    if (done) done.setAttribute('opacity', '0');
  }
}

// ===== JEG TOP LEVEL TAB TOGGLE =====
function jegSwitchTopLevel(target) {
  // Update Top Tabs
  document.getElementById('tab-mandant').classList.toggle('active', target === 'mandant');
  document.getElementById('tab-potenziale').classList.toggle('active', target === 'potenziale');

  // Update Toolbar Navs
  const navMandant = document.getElementById('top-nav-mandant');
  const navPotenziale = document.getElementById('top-nav-potenziale');
  if (navMandant) navMandant.style.display = target === 'mandant' ? 'flex' : 'none';
  if (navPotenziale) navPotenziale.style.display = target === 'potenziale' ? 'flex' : 'none';

  // Force navigate when switching Top Level Tabs using native switchSection which handles all sidebars automatically
  if (target === 'potenziale') {
    // Remember last mandant section (e.g. daten, beratung)
    if (state.activeSection !== 'pot-jeg') {
      state.lastMandantSection = state.activeSection;
    }
    switchSection('pot-jeg');
  } else if (target === 'mandant') {
    // Restore mandant section if we are coming from potenziale
    if (state.activeSection === 'pot-jeg') {
      switchSection(state.lastMandantSection || 'daten');
    }
  }
}

// ===== JEG MANDANT / PARTNER TOGGLE =====
const _jegPersonData = {
  mandant: {
    liquidity: { val: 420, min: 0, max: 2000 },
    savings:   { val: 175, min: 0, max: 500  },
    gapAv:     { val: 850, min: 0, max: 2000 },
    gapExi:    { val: 650, min: 0, max: 2000 },
  },
  partner: {
    liquidity: { val: 420, min: 0, max: 2000 }, // identical
    savings:   { val: 175, min: 0, max: 500  }, // identical
    gapAv:     { val: 520, min: 0, max: 2000 },
    gapExi:    { val: 380, min: 0, max: 2000 },
  },
};

function jegSwitchPerson(type) {
  const d = _jegPersonData[type];
  if (!d) return;

  // Toggle button styles
  ['mandant', 'partner'].forEach(t => {
    const btn = document.getElementById('jeg-btn-' + t);
    if (btn) btn.classList.toggle('jeg-person-btn--active', t === type);
  });

  // Helper: update one metric
  const set = (inputId, barId, data) => {
    const input = document.getElementById(inputId);
    const bar   = document.getElementById(barId);
    if (input) input.value = data.val;
    if (bar) {
      const pct = Math.min(100, Math.max(0, ((data.val - data.min) / (data.max - data.min)) * 100));
      bar.style.width = pct.toFixed(1) + '%';
    }
  };

  set('jeg-liquidity', 'jeg-liquidity-bar', d.liquidity);
  set('jeg-savings',   'jeg-savings-bar',   d.savings);
  set('jeg-gap-av',    'jeg-gap-av-bar',    d.gapAv);
  set('jeg-gap-exi',   'jeg-gap-exi-bar',   d.gapExi);
}

// ===== BV JEG STEP CHECKBOX TOGGLE (Beratungsvorbereitung) =====
function bvJegToggleStep(n) {
  const rect  = document.getElementById('bv-jeg-cb-rect-' + n);
  const mark  = document.getElementById('bv-jeg-cb-mark-' + n);
  const done  = document.getElementById('bv-jeg-done-' + n);
  if (!rect) return;
  const checked = rect.getAttribute('data-checked') === 'true';
  if (!checked) {
    rect.setAttribute('fill', '#1a6eb5');
    rect.setAttribute('stroke', '#1565c0');
    rect.setAttribute('data-checked', 'true');
    mark.setAttribute('stroke', 'white');
    mark.setAttribute('opacity', '1');
    if (done) done.setAttribute('opacity', '0.25');
  } else {
    rect.setAttribute('fill', 'white');
    rect.setAttribute('stroke', '#1a6eb5');
    rect.setAttribute('data-checked', 'false');
    mark.setAttribute('opacity', '0');
    if (done) done.setAttribute('opacity', '0');
  }
}

// ===== BV JEG MANDANT / PARTNER TOGGLE (Beratungsvorbereitung) =====
const _bvJegPersonData = {
  mandant: {
    liquidity: { val: 420, min: 0, max: 2000 },
    savings:   { val: 175, min: 0, max: 500  },
    gapAv:     { val: 850, min: 0, max: 2000 },
    gapExi:    { val: 650, min: 0, max: 2000 },
  },
  partner: {
    liquidity: { val: 420, min: 0, max: 2000 },
    savings:   { val: 175, min: 0, max: 500  },
    gapAv:     { val: 520, min: 0, max: 2000 },
    gapExi:    { val: 380, min: 0, max: 2000 },
  },
};

function bvJegSwitchPerson(type) {
  const d = _bvJegPersonData[type];
  if (!d) return;

  ['mandant', 'partner'].forEach(t => {
    const btn = document.getElementById('bv-jeg-btn-' + t);
    if (btn) btn.classList.toggle('jeg-person-btn--active', t === type);
  });

  const set = (inputId, barId, data) => {
    const input = document.getElementById(inputId);
    const bar   = document.getElementById(barId);
    if (input) input.value = data.val;
    if (bar) {
      const pct = Math.min(100, Math.max(0, ((data.val - data.min) / (data.max - data.min)) * 100));
      bar.style.width = pct.toFixed(1) + '%';
    }
  };

  set('bv-jeg-liquidity', 'bv-jeg-liquidity-bar', d.liquidity);
  set('bv-jeg-savings',   'bv-jeg-savings-bar',   d.savings);
  set('bv-jeg-gap-av',    'bv-jeg-gap-av-bar',    d.gapAv);
  set('bv-jeg-gap-exi',   'bv-jeg-gap-exi-bar',   d.gapExi);
}

// ===== BV HANDLUNGSEMPFEHLUNGEN – Delta-basiert aus Datenaktualisierung =====
function bvRefreshHandlungsempfehlungen() {
  const list  = document.getElementById('bv-handlungsempfehlungen-list');
  const empty = document.getElementById('bv-handlungsempfehlungen-empty');
  if (!list) return;

  const recs = [];

  // Helper: Zahl aus deutschem Zahlenformat lesen
  const parseDE = s => {
    if (!s) return NaN;
    return parseFloat(String(s).replace(/\./g,'').replace(',','.').replace(/[^\d.-]/g,''));
  };

  // Helper: prüft ob ein dak-warn-Element sichtbar ist (für Riester-Grundzulage)
  const warnVisible = id => {
    const el = document.getElementById(id);
    return el && el.style.display !== 'none' && el.style.display !== '';
  };

  // Helper: prüft ob ein Dokument hochgeladen wurde (dak-fname-X hat Inhalt)
  const fileUploaded = id => {
    const el = document.getElementById(id);
    return el && el.textContent.trim() !== '';
  };

  // --- 1. Gehaltserhöhung erkannt: Delta aus Bisheriger/Neuer Wert ---
  const bruttoDez = parseDE(document.getElementById('dak-brutto-dez')?.value);
  const bruttoAkt = parseDE(document.getElementById('dak-brutto-akt')?.value);
  const nettoDez  = parseDE(document.getElementById('dak-netto-dez')?.value);
  const nettoAkt  = parseDE(document.getElementById('dak-netto-akt')?.value);

  const bruttoGestiegen = !isNaN(bruttoDez) && !isNaN(bruttoAkt) && bruttoAkt > bruttoDez;
  const nettoGestiegen  = !isNaN(nettoDez)  && !isNaN(nettoAkt)  && nettoAkt  > nettoDez;
  const gehaltsErhoehung = bruttoGestiegen || nettoGestiegen;

  if (gehaltsErhoehung) {
    const art = bruttoGestiegen ? 'Brutto' : 'Netto';
    const diffAbs = bruttoGestiegen
      ? (bruttoAkt - bruttoDez).toLocaleString('de-DE', {minimumFractionDigits:2, maximumFractionDigits:2})
      : (nettoAkt  - nettoDez ).toLocaleString('de-DE', {minimumFractionDigits:2, maximumFractionDigits:2});

    // 1a. Arbeitskraftsicherung / BU
    recs.push({
      icon: '🛡️',
      prio: 'high',
      kategorie: 'Arbeitskraftsicherung – Anpassungsbedarf',
      text: `Das ${art}einkommen ist gegenüber dem Vorjahr gestiegen (+${diffAbs}&nbsp;€/Monat). Die <strong>Absicherungslücke im Bereich Arbeitskraft hat sich damit erhöht</strong> – die BU-Rente sollte entsprechend angepasst werden, um das gestiegene Einkommen vollständig abzusichern.`
    });

    // 1b. Rentenlücke / Altersvorsorge
    recs.push({
      icon: '📊',
      prio: 'high',
      kategorie: 'Rentenlücke – Altersvorsorge überprüfen',
      text: `Durch das gestiegene Einkommen hat sich auch die <strong>Rentenlücke vergrößert</strong>. Die bestehenden Altersvorsorgeverträge sollten auf ihre Beitragshöhe hin überprüft und ggf. angepasst werden, damit der aktuelle Lebensstandard im Alter gesichert bleibt.`
    });
  }

  // --- 2. Krankenkassen-Einsparpotenzial ---
  const KK_ZUSATZBEITRAG = {
    // Referenz
    'hkk':                              2.59,
    // AOK-Verbund
    'aok baden-württemberg':            2.99,
    'aok bw':                           2.99,
    'aok bayern':                       2.69,
    'aok bremen':                       3.29,
    'aok bremerhaven':                  3.29,
    'aok hessen':                       2.98,
    'aok niedersachsen':                2.98,
    'aok nordost':                      3.50,
    'aok plus':                         3.10,
    'aok rheinland-pfalz':              2.47,
    'aok saarland':                     2.47,
    'aok rheinland/hamburg':            3.39,
    'aok rheinland hamburg':            3.39,
    'aok nordwest':                     2.99,
    'aok sachsen-anhalt':               3.20,
    // Ersatzkassen
    'techniker krankenkasse':           2.69,
    'tk':                               2.69,
    'barmer':                           3.29,
    'dak':                              3.20,
    'dak-gesundheit':                   3.20,
    'dak gesundheit':                   3.20,
    'kkh':                              3.78,
    'kkh kaufmännische':                3.78,
    'handelskrankenkasse':              2.59,
    'hek':                              2.99,
    'big direkt gesund':                3.69,
    'big direkt':                       3.69,
    // Betriebskrankenkassen
    'ikk classic':                      3.40,
    'ikk':                              3.40,
    'knappschaft':                      4.30,
    'debeka':                           3.25,
    'debeka bkk':                       3.25,
    'pronova bkk':                      3.70,
    'pronova':                          3.70,
    'sbk':                              3.80,
    'siemens betriebskrankenkasse':     3.80,
    'bkk firmus':                       2.80,
    'bkk vbu':                          2.80,
    'bkk provita':                      2.39,
    'bkk faber-castell':                2.99,
    'audi bkk':                         2.69,
    'bahn-bkk':                         2.89,
    'bkk linde':                        2.69,
    'mhplus':                           3.10,
    'bergische krankenkasse':           2.79,
    'bkk melitta':                      2.99,
    'bkk euregio':                      2.99,
    'bkk herkules':                     2.79,
    'energie-bkk':                      2.59,
    'hallesche':                        2.59,
  };
  const HKK_RATE = 2.59;

  const kkEl    = document.getElementById('dak-kk-akt');
  const kkName  = (kkEl?.value || '').trim();
  const bruttoEl = document.getElementById('dak-brutto-akt');
  const bruttoMonat = parseDE(bruttoEl?.value);

  if (kkName) {
    // Fuzzy-Lookup: sucht nach dem längsten Schlüssel, der im KK-Namen vorkommt
    const kkLower = kkName.toLowerCase();
    let matchedRate = null;
    let matchedName = null;
    let bestLen = 0;
    for (const [key, rate] of Object.entries(KK_ZUSATZBEITRAG)) {
      if (kkLower.includes(key) && key.length > bestLen) {
        matchedRate = rate;
        matchedName = key;
        bestLen = key.length;
      }
    }

    if (matchedRate !== null && matchedRate > HKK_RATE) {
      const diffPct = (matchedRate - HKK_RATE).toFixed(2).replace('.', ',');
      let savingsText = '';
      if (!isNaN(bruttoMonat) && bruttoMonat > 0) {
        // Arbeitnehmer trägt die Hälfte des Zusatzbeitrags
        const monthlySavings = bruttoMonat * (matchedRate - HKK_RATE) / 100 / 2;
        const annualSavings  = monthlySavings * 12;
        savingsText = ` Das entspricht einer monatlichen Ersparnis von ca. <strong>${monthlySavings.toLocaleString('de-DE', {minimumFractionDigits:2,maximumFractionDigits:2})}&nbsp;€</strong> (${annualSavings.toLocaleString('de-DE', {minimumFractionDigits:2,maximumFractionDigits:2})}&nbsp;€/Jahr).`;
      }
      recs.push({
        icon: '💊',
        prio: 'high',
        kategorie: 'Einsparpotenzial Krankenkasse',
        text: `Die aktuelle Krankenkasse (<strong>${kkName}</strong>) hat einen Zusatzbeitrag von <strong>${String(matchedRate).replace('.', ',')} %</strong>. Die <strong>hkk</strong> bietet mit <strong>${String(HKK_RATE).replace('.', ',')} %</strong> einen um ${diffPct}&nbsp;Prozentpunkte niedrigeren Zusatzbeitrag.${savingsText} Ein Kassenwechsel zur hkk kann schnell und unkompliziert angesprochen werden.`
      });
    }
  }

  // --- 3. Strom- & Gasrechnung hochgeladen ---
  if (fileUploaded('dak-fname-3')) {
    recs.push({
      icon: '⚡',
      prio: 'medium',
      kategorie: 'Energiekosten',
      text: `Strom- & Gasabrechnung liegt vor – Einsparpotenzial durch <strong>Tarifoptimierung</strong> prüfen und ggf. Anbieter wechseln.`
    });
  }

  // --- 3. Riester-Zulagenbescheinigung hochgeladen ---
  if (fileUploaded('dak-fname-4')) {
    // 3a. Grundzulage nicht voll ausgeschöpft → direkt Wert auslesen statt DOM-Sichtbarkeit prüfen
    const gzEl  = document.getElementById('dak-riester-gz');
    const gzVal = parseDE(gzEl?.value);
    if (!isNaN(gzVal) && gzVal > 0 && gzVal < 175) {
      recs.push({
        icon: '⚠️',
        prio: 'high',
        kategorie: 'Riester – Zulage nicht voll ausgeschöpft',
        text: `Die Grundzulage beträgt nur <strong>${gzEl.value}&nbsp;€</strong> statt 175&nbsp;€. Riesterbeitrag anpassen, um die <strong>volle staatliche Zulage</strong> zu erhalten.`
      });
    }
    // 3b. AV-Depot-Vergleich immer als gesonderte Card
    recs.push({
      icon: '🏦',
      prio: 'medium',
      kategorie: 'Riester – Fördervergleich empfohlen',
      text: `Riester-Zulagenbescheinigung vorhanden – <strong>Fördervergleich Riester vs. AV-Depot</strong> durchführen und Umstiegsszenario kalkulieren.`
    });
  }

  // --- 4. Erhöhungsanträge vorhanden ---
  const erhoehung = (typeof _jegCurrentErhoehung !== 'undefined') ? _jegCurrentErhoehung : 0;
  if (erhoehung >= 1) {
    recs.push({
      icon: '📋',
      prio: 'medium',
      kategorie: 'Erhöhungsanträge nutzen',
      text: `Für diesen Mandanten ${erhoehung === 1 ? 'liegt <strong>1 Erhöhungsantrag</strong>' : `liegen <strong>${erhoehung} Erhöhungsanträge</strong>`} vor – ideale Möglichkeit, die bestehende Absicherung <strong>schnell und unkompliziert zu erhöhen</strong>. Antrag im Termin direkt ansprechen und abschließen.`
    });
  }

  // --- Rendern ---
  list.querySelectorAll('.bv-rec-item').forEach(el => el.remove());

  if (recs.length === 0) {
    if (empty) empty.style.display = '';
    return;
  }
  if (empty) empty.style.display = 'none';

  const colorMap = {
    high:   { bg: '#fff8e1', border: '#f9a825', badge: '#f9a825', badgeTxt: '#fff', iconColor: '#f57f17', label: 'Handlungsbedarf' },
    medium: { bg: '#e8f5e9', border: '#43a047', badge: '#43a047', badgeTxt: '#fff', iconColor: '#2e7d32', label: 'Empfehlung'     },
  };

  recs.forEach(rec => {
    const c = colorMap[rec.prio] || colorMap.medium;
    const div = document.createElement('div');
    div.className = 'bv-rec-item';
    div.style.cssText = `display:flex;align-items:flex-start;gap:14px;padding:14px 18px;background:${c.bg};border:1px solid ${c.border};border-radius:10px;`;
    div.innerHTML = `
      <span style="font-size:22px;flex-shrink:0;line-height:1.3;">${rec.icon}</span>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap;">
          <span style="font-size:11px;font-weight:700;padding:2px 9px;border-radius:20px;background:${c.badge};color:${c.badgeTxt};letter-spacing:0.3px;">${c.label}</span>
          <span style="font-size:12px;font-weight:600;color:${c.iconColor};">${rec.kategorie}</span>
        </div>
        <p style="margin:0;font-size:13px;color:#333;line-height:1.55;">${rec.text}</p>
      </div>`;
    list.appendChild(div);
  });
}

// Auto-refresh wenn Beratungsvorbereitung-Seite aktiv wird
document.addEventListener('DOMContentLoaded', function() {
  const bvPage = document.getElementById('page-jeg-beratungsvorbereitung');
  if (!bvPage) return;
  new MutationObserver(function(mutations) {
    mutations.forEach(function(m) {
      if (m.target && m.target.id === 'page-jeg-beratungsvorbereitung' && m.target.classList.contains('active')) {
        bvRefreshHandlungsempfehlungen();
      }
    });
  }).observe(bvPage, { attributes: true, attributeFilter: ['class'] });
});

// ===== JEG POTENZIALE LISTE =====
const jegPotClients = [
  { id: 1,  fa: '900101', name: 'Müller, Thomas',        liqui: 350, kinder: 2, riester: 'ja',   ersparnis: 120, besuch: '2024-11-08', telis: 2, fremd: 0, einheiten: 57, erhoehung: 2, active: true, status: 'terminiert',    statusDatum: '2026-03-24' },
  { id: 2,  fa: '900102', name: 'Schmidt, Julia',         liqui: 150, kinder: 1, riester: 'nein', ersparnis: 200, besuch: '2024-07-15', telis: 5, fremd: 1, einheiten: 24, erhoehung: 0, active: true, status: 'offen',         statusDatum: '2026-03-23' },
  { id: 3,  fa: '900103', name: 'Schneider, Michael',     liqui: 800, kinder: 0, riester: 'ja',   ersparnis: 50,  besuch: '2026-01-10', telis: 3, fremd: 5, einheiten: 16, erhoehung: 1, active: true, status: 'erledigt',      statusDatum: '2026-03-22' },
  { id: 4,  fa: '900104', name: 'Fischer, Laura',         liqui: 220, kinder: 2, riester: 'nein', ersparnis: 300, besuch: '2025-11-05', telis: 2, fremd: 4, einheiten: 37, erhoehung: 3, active: true, status: 'terminiert',    statusDatum: '2026-03-25' },
  { id: 5,  fa: '900105', name: 'Weber, Andreas',         liqui: 450, kinder: 1, riester: 'ja',   ersparnis: 180, besuch: '2024-03-22', telis: 1, fremd: 0, einheiten: 15, erhoehung: 0, active: true, status: 'nicht erreicht', statusDatum: '2026-03-21' },
  { id: 6,  fa: '900106', name: 'Meyer, Sarah',           liqui: 100, kinder: 0, riester: 'nein', ersparnis: 150, besuch: '2024-09-04', telis: 4, fremd: 1, einheiten: 42, erhoehung: 1, active: true, status: 'offen',         statusDatum: '2026-03-23' },
  { id: 7,  fa: '900107', name: 'Wagner, Christian',      liqui: 600, kinder: 3, riester: 'ja',   ersparnis: 210, besuch: '2026-02-15', telis: 1, fremd: 4, einheiten: 22, erhoehung: 2, active: true, status: 'terminiert',    statusDatum: '2026-03-24' },
  { id: 8,  fa: '900108', name: 'Becker, Anna',           liqui: 320, kinder: 1, riester: 'ja',   ersparnis: 90,  besuch: '2024-05-30', telis: 7, fremd: 1, einheiten: 38, erhoehung: 3, active: true, status: 'erledigt',      statusDatum: '2026-03-22' },
  { id: 9,  fa: '900109', name: 'Schulz, Kevin',          liqui: 50,  kinder: 0, riester: 'nein', ersparnis: 80,  besuch: '2023-11-14', telis: 5, fremd: 0, einheiten: 58, erhoehung: 0, active: true, status: 'kein Interesse', statusDatum: '2026-03-19' },
  { id: 10, fa: '900110', name: 'Hoffmann, Lisa',         liqui: 410, kinder: 2, riester: 'ja',   ersparnis: 160, besuch: '2026-03-01', telis: 3, fremd: 5, einheiten: 37, erhoehung: 2, active: true, status: 'terminiert',    statusDatum: '2026-03-25' },
  { id: 11, fa: '900111', name: 'Schäfer, Daniel',        liqui: 280, kinder: 0, riester: 'nein', ersparnis: 220, besuch: '2024-12-11', telis: 6, fremd: 2, einheiten: 19, erhoehung: 1, active: true, status: 'offen',         statusDatum: '2026-03-23' },
  { id: 12, fa: '900112', name: 'Koch, Melanie',          liqui: 550, kinder: 3, riester: 'ja',   ersparnis: 310, besuch: '2026-01-25', telis: 4, fremd: 2, einheiten: 16, erhoehung: 0, active: true, status: 'erledigt',      statusDatum: '2026-03-22' },
  { id: 13, fa: '900113', name: 'Bauer, Stefan',          liqui: 190, kinder: 1, riester: 'nein', ersparnis: 140, besuch: '2023-06-27', telis: 2, fremd: 3, einheiten: 16, erhoehung: 3, active: true, status: 'nicht erreicht', statusDatum: '2026-03-21' },
  { id: 14, fa: '900114', name: 'Richter, Maria',         liqui: 700, kinder: 2, riester: 'ja',   ersparnis: 250, besuch: '2026-02-28', telis: 6, fremd: 2, einheiten: 48, erhoehung: 2, active: true, status: 'terminiert',    statusDatum: '2026-03-24' },
  { id: 15, fa: '900115', name: 'Klein, Tobias',          liqui: 380, kinder: 0, riester: 'ja',   ersparnis: 100, besuch: '2025-08-11', telis: 5, fremd: 0, einheiten: 56, erhoehung: 1, active: true, status: 'offen',         statusDatum: '2026-03-20' },
  { id: 16, fa: '900116', name: 'Wolf, Sabine',           liqui: 260, kinder: 1, riester: 'nein', ersparnis: 270, besuch: '2023-09-05', telis: 8, fremd: 4, einheiten: 17, erhoehung: 0, active: true, status: 'nicht erreicht', statusDatum: '2026-03-20' },
  { id: 17, fa: '900117', name: 'Schröder, Markus',       liqui: 480, kinder: 2, riester: 'ja',   ersparnis: 190, besuch: '2026-01-18', telis: 7, fremd: 0, einheiten: 45, erhoehung: 2, active: true, status: 'terminiert',    statusDatum: '2026-03-24' },
  { id: 18, fa: '900118', name: 'Neumann, Nadine',        liqui: 310, kinder: 0, riester: 'nein', ersparnis: 130, besuch: '2024-08-19', telis: 5, fremd: 5, einheiten: 49, erhoehung: 1, active: true, status: 'kein Interesse', statusDatum: '2026-03-19' },
  { id: 19, fa: '900119', name: 'Schwarz, Patrick',       liqui: 650, kinder: 3, riester: 'ja',   ersparnis: 280, besuch: '2026-03-10', telis: 6, fremd: 4, einheiten: 22, erhoehung: 3, active: true, status: 'offen',         statusDatum: '2026-03-25' },
  { id: 20, fa: '900120', name: 'Zimmermann, Lena',       liqui: 210, kinder: 1, riester: 'ja',   ersparnis: 110, besuch: '2025-06-25', telis: 2, fremd: 0, einheiten: 52, erhoehung: 0, active: true, status: 'erledigt',      statusDatum: '2026-03-22' },
  { id: 21, fa: '900121', name: 'Braun, Dennis',          liqui: 120, kinder: 0, riester: 'nein', ersparnis: 160, besuch: '2025-11-12', telis: 4, fremd: 2, einheiten: 15, erhoehung: 2, active: true, status: 'offen',         statusDatum: '2026-03-21' },
  { id: 22, fa: '900122', name: 'Krüger, Katharina',      liqui: 520, kinder: 2, riester: 'ja',   ersparnis: 240, besuch: '2026-02-05', telis: 4, fremd: 0, einheiten: 34, erhoehung: 1, active: true, status: 'terminiert',    statusDatum: '2026-03-24' },
  { id: 23, fa: '900123', name: 'Hofmann, Felix',         liqui: 370, kinder: 0, riester: 'ja',   ersparnis: 150, besuch: '2025-10-28', telis: 5, fremd: 3, einheiten: 50, erhoehung: 0, active: true, status: 'nicht erreicht', statusDatum: '2026-03-20' },
  { id: 24, fa: '900124', name: 'Lange, Vanessa',         liqui: 290, kinder: 1, riester: 'nein', ersparnis: 210, besuch: '2025-12-20', telis: 6, fremd: 1, einheiten: 33, erhoehung: 3, active: true, status: 'offen',         statusDatum: '2026-03-23' },
  { id: 25, fa: '900125', name: 'Schmitt, Florian',       liqui: 440, kinder: 2, riester: 'ja',   ersparnis: 170, besuch: '2026-01-08', telis: 6, fremd: 1, einheiten: 52, erhoehung: 2, active: true, status: 'erledigt',      statusDatum: '2026-03-22' }
];

let jegPotSortCol = 'name';
let jegPotSortDesc = false;

function jegRenderPotTable() {
  const tbody = document.getElementById('jeg-pot-tbody');
  if (!tbody) return;
  
  const filterName = (document.getElementById('filter-name').value || '').toLowerCase();
  const filterRiester = document.getElementById('filter-riester').value;
  const filterLiqui = parseInt(document.getElementById('filter-liqui').value) || 0;
  const filterKinder = parseInt(document.getElementById('filter-kinder').value) || 0;
  const filterErsparnis = parseInt(document.getElementById('filter-ersparnis').value) || 0;
  const filterBesuch = document.getElementById('filter-besuch').value;
  const filterErhoehung = parseInt(document.getElementById('filter-erhoehung')?.value) || 0;
  const filterVertraege = parseInt(document.getElementById('filter-vertraege')?.value) || 0;
  const filterEinheiten = parseInt(document.getElementById('filter-einheiten').value) || 0;
  const activeChips = [...document.querySelectorAll('#filter-status-chips .jeg-chip--active')]
    .map(el => el.dataset.status);

  let filtered = jegPotClients.filter(c => {
    if (!c.active) return false;
    if (filterName && !c.name.toLowerCase().includes(filterName)) return false;
    if (filterRiester !== 'all' && c.riester !== filterRiester) return false;
    if (c.liqui < filterLiqui) return false;
    if (c.kinder < filterKinder) return false;
    if (c.ersparnis < filterErsparnis) return false;
    if ((c.telis + c.fremd) < filterVertraege) return false;
    if (c.einheiten < filterEinheiten) return false;
    
    if (filterBesuch !== 'all') {
      const year = parseInt(c.besuch.split('-')[0], 10);
      if (filterBesuch === 'vor2026' && year >= 2026) return false;
      if (filterBesuch === 'vor2025' && year >= 2025) return false;
      if (filterBesuch === 'vor2024' && year >= 2024) return false;
    }

    if (c.erhoehung < filterErhoehung) return false;
    if (activeChips.length > 0 && !activeChips.includes(c.status)) return false;
    return true;
  });

  // Update KPI Cards
  const count = filtered.length;
  let sumLiqui = 0, sumVertraege = 0, sumEinheiten = 0;

  filtered.forEach(c => {
    sumLiqui += c.liqui;
    sumVertraege += (c.telis + c.fremd);
    sumEinheiten += c.einheiten;
  });

  const elCount = document.getElementById('pot-kpi-count');
  const elLiqui = document.getElementById('pot-kpi-liqui');
  const elVertraege = document.getElementById('pot-kpi-vertraege');
  const elEinheiten = document.getElementById('pot-kpi-einheiten');

  if (elCount) elCount.innerText = count;
  if (elLiqui) elLiqui.innerText = count > 0 ? Math.round(sumLiqui / count) + ' €' : '0 €';
  if (elVertraege) elVertraege.innerText = count > 0 ? (sumVertraege / count).toFixed(1) : '0.0';
  if (elEinheiten) elEinheiten.innerText = count > 0 ? Math.round(sumEinheiten / count) : '0';

  filtered.sort((a, b) => {
    let valA = jegPotSortCol === 'vertraege' ? (a.telis + a.fremd) : a[jegPotSortCol];
    let valB = jegPotSortCol === 'vertraege' ? (b.telis + b.fremd) : b[jegPotSortCol];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return jegPotSortDesc ? 1 : -1;
    if (valA > valB) return jegPotSortDesc ? -1 : 1;
    return 0;
  });

  tbody.innerHTML = filtered.map(c => {
    const statusOpts = ['offen','terminiert','nicht erreicht','erledigt','kein Interesse'];
    const statusSel = statusOpts.map(s =>
      `<option value="${s}"${c.status === s ? ' selected' : ''}>${s}</option>`
    ).join('');
    return `
    <tr>
      <td><a href="#" class="jeg-pot-name-link" onclick="jegOpenMandantJEG(event, ${c.liqui}, ${c.ersparnis}, '${c.name.replace(/'/g, "\\'")}', '${c.fa}', ${c.erhoehung})"
        title="JEG 2026 für ${c.name.replace(/"/g,'&quot;')} öffnen">${c.name}</a></td>
      <td class="text-center">${c.liqui} €</td>
      <td class="text-center">${c.ersparnis} €</td>
      <td class="text-center">${c.riester === 'ja' ? 'Ja' : 'Nein'}</td>
      <td class="text-center">${c.kinder}</td>
      <td class="text-center">${c.telis + c.fremd}</td>
      <td class="text-center">${c.einheiten}</td>
      <td class="text-center">${c.erhoehung}</td>
      <td class="text-center">${jegFormatDate(c.besuch)}</td>
      <td class="text-center">
        <select class="jeg-status-select jeg-status--${c.status.replace(/\s+/g,'-')}" onchange="jegUpdatePotClientStatus(${c.id}, this)">
          ${statusSel}
        </select>
      </td>
      <td class="text-center" id="jeg-datum-${c.id}">${jegFormatDate(c.statusDatum)}</td>
    </tr>
  `}).join('');

  jegUpdateSortIcons();
}

window.jegUpdatePotClientStatus = function(id, selectEl) {
  const c = jegPotClients.find(x => x.id === id);
  if (!c) return;
  c.status = selectEl.value;
  c.statusDatum = new Date().toISOString().split('T')[0];
  selectEl.className = 'jeg-status-select jeg-status--' + c.status.replace(/\s+/g, '-');
  const datumEl = document.getElementById('jeg-datum-' + id);
  if (datumEl) datumEl.textContent = jegFormatDate(c.statusDatum);
};

window.jegToggleStatusChip = function(btn) {
  btn.classList.toggle('jeg-chip--active');
  jegRenderPotTable();
};



window.jegOpenMandantJEG = function(event, liqui, ersparnis, name, fa, erhoehung) {
  event.preventDefault();
  _jegCurrentErhoehung = erhoehung || 0;

  // Build the header meta text: "Name (FA-Nr. XXXXX)"
  const metaText = name + ' (FA-Nr. ' + (fa || '') + ')';
  try { localStorage.setItem('jeg_last_mandant_meta', metaText); } catch(e) {}

  // Update internal person data so Mandant/Partner toggle keeps these values
  if (typeof _jegPersonData !== 'undefined') {
    _jegPersonData.mandant.liquidity.val = liqui;
    _jegPersonData.mandant.savings.val   = ersparnis;
  }

  jegSwitchTopLevel('mandant');

  setTimeout(function() {
    switchSection('beratung');
    navigate('jeg2026', 'jeg2026');
    updateBnavSubActive(null);
    updateBnavSubSubActive(null);

    // Open JEG sub-menu in sidebar
    const bnavSub = document.querySelector('#sidebar-beratung .bnav-sub');
    if (bnavSub) bnavSub.classList.add('open');

    const main = document.querySelector('main') || document.querySelector('.main-content') || document.documentElement;
    if (main) main.scrollTop = 0;
    window.scrollTo(0, 0);

    setTimeout(function() {
      const elLiqui = document.getElementById('jeg-liquidity');
      if (elLiqui) { elLiqui.value = liqui; if (typeof jegUpdateMetric === 'function') jegUpdateMetric('jeg-liquidity', 'jeg-liquidity-bar', 0, 2000); }
      const elSavings = document.getElementById('jeg-savings');
      if (elSavings) { elSavings.value = ersparnis; if (typeof jegUpdateMetric === 'function') jegUpdateMetric('jeg-savings', 'jeg-savings-bar', 0, 500); }

      // Show "Name (FA-Nr. XXXXX)" in hero meta line (JEG 2026 page)
      const heroMeta = document.getElementById('jeg-hero-meta');
      if (heroMeta) heroMeta.textContent = metaText;

      // ── Mirror to Beratungsvorbereitung page ──────────────────────────
      const bvHeroMeta = document.getElementById('bv-hero-meta');
      if (bvHeroMeta) bvHeroMeta.textContent = metaText;

      // ── Mirror to Datenaktualisierung page ────────────────────────────
      const dakHeroMeta = document.getElementById('dak-hero-meta');
      if (dakHeroMeta) dakHeroMeta.textContent = metaText;

      // ── Mirror to Abschluss page ──────────────────────────────────────
      const abschlussHeroMeta = document.getElementById('abschluss-hero-meta');
      if (abschlussHeroMeta) abschlussHeroMeta.textContent = metaText;

      // ── Mirror to Tools & Rechner page ───────────────────────────────
      const toolsHeroMeta = document.getElementById('tools-hero-meta');
      if (toolsHeroMeta) toolsHeroMeta.textContent = metaText;

      const bvLiqui = document.getElementById('bv-jeg-liquidity');
      if (bvLiqui) {
        bvLiqui.value = liqui;
        if (typeof jegUpdateMetric === 'function') jegUpdateMetric('bv-jeg-liquidity', 'bv-jeg-liquidity-bar', 0, 2000);
      }
      const bvSavings = document.getElementById('bv-jeg-savings');
      if (bvSavings) {
        bvSavings.value = ersparnis;
        if (typeof jegUpdateMetric === 'function') jegUpdateMetric('bv-jeg-savings', 'bv-jeg-savings-bar', 0, 500);
      }
    }, 80);
  }, 50);
};

// On page load: restore last visited mandant in hero meta (both pages)
document.addEventListener('DOMContentLoaded', function() {
  try {
    const last = localStorage.getItem('jeg_last_mandant_meta');
    if (last) {
      const heroMeta = document.getElementById('jeg-hero-meta');
      if (heroMeta) heroMeta.textContent = last;
      const bvHeroMeta = document.getElementById('bv-hero-meta');
      if (bvHeroMeta) bvHeroMeta.textContent = last;
      const dakHeroMeta = document.getElementById('dak-hero-meta');
      if (dakHeroMeta) dakHeroMeta.textContent = last;
      const abschlussHeroMeta = document.getElementById('abschluss-hero-meta');
      if (abschlussHeroMeta) abschlussHeroMeta.textContent = last;
      const toolsHeroMeta = document.getElementById('tools-hero-meta');
      if (toolsHeroMeta) toolsHeroMeta.textContent = last;
    }
  } catch(e) {}
});

function jegFormatDate(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${d}.${m}.${y}`;
}

function jegSortPotTable(col) {
  if (jegPotSortCol === col) {
    jegPotSortDesc = !jegPotSortDesc;
  } else {
    jegPotSortCol = col;
    jegPotSortDesc = false;
  }
  jegRenderPotTable();
}

function jegUpdateSortIcons() {
  const icons = document.querySelectorAll('.sort-icon');
  icons.forEach(ic => ic.innerHTML = '');
  const activeIcon = document.getElementById('sort-icon-' + jegPotSortCol);
  if (activeIcon) {
    activeIcon.innerHTML = jegPotSortDesc ? '▼' : '▲';
  }
}

function jegDeactivatePotClient(id) {
  const c = jegPotClients.find(x => x.id === id);
  if (c) {
    c.active = false;
    jegRenderPotTable();
  }
}

// Initial render slightly delayed to ensure DOM
setTimeout(() => {
  if (document.getElementById('jeg-pot-tbody')) jegRenderPotTable();
}, 100);

// ===== JEG COUNTDOWN LOGIC =====
function initJegCountdown() {
  const targetDate = new Date("2026-12-31T23:59:59").getTime();

  function update() {
    const elDays = document.getElementById("jeg-cd-days");
    const elHours = document.getElementById("jeg-cd-hours");
    const elMinutes = document.getElementById("jeg-cd-minutes");
    const elSeconds = document.getElementById("jeg-cd-seconds");

    // Only update if we are on the page containing the countdown
    if (!elDays || !elHours || !elMinutes || !elSeconds) return;

    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      elDays.innerText = "00";
      elHours.innerText = "00";
      elMinutes.innerText = "00";
      elSeconds.innerText = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    elDays.innerText = String(days).padStart(2, '0');
    elHours.innerText = String(hours).padStart(2, '0');
    elMinutes.innerText = String(minutes).padStart(2, '0');
    elSeconds.innerText = String(seconds).padStart(2, '0');
  }

  update();
  // We use setInterval and don't clear it because the app is a single DOM SPA and we might navigate away and back
  setInterval(update, 1000);
}

// Start countdown wrapper
setTimeout(initJegCountdown, 500);

// ===== GENERIC VOICE DICTATION FOR JEG TEXTAREAS =====
let jegGenericRecognition = null;
let jegGenericRecordingId = null;

window.jegGenericUpdateCharCount = function(baseId) {
  const ta = document.getElementById(baseId);
  const counter = document.getElementById(baseId + '-count');
  if (ta && counter) counter.textContent = ta.value.length + ' Zeichen';
};

window.jegGenericSave = function(baseId) {
  const ta = document.getElementById(baseId);
  if (ta) {
    localStorage.setItem('jeg_notes_' + baseId, ta.value);
    if(typeof showToast === 'function') showToast('Notizen gespeichert.');
  }
};

window.jegGenericVoiceToggle = function(baseId) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if(typeof showToast === 'function') showToast('Spracheingabe wird von diesem Browser nicht unterstützt.');
    return;
  }
  
  if (jegGenericRecordingId === baseId) {
    if (jegGenericRecognition) jegGenericRecognition.stop();
    return;
  } else if (jegGenericRecordingId) {
    if (jegGenericRecognition) jegGenericRecognition.stop();
  }

  jegGenericRecognition = new SpeechRecognition();
  jegGenericRecognition.lang = 'de-DE';
  jegGenericRecognition.continuous = true;
  jegGenericRecognition.interimResults = true;

  jegGenericRecognition.onstart = function () {
    jegGenericRecordingId = baseId;
    jegGenericSetMicState(baseId, true);
  };

  jegGenericRecognition.onresult = function (e) {
    const ta = document.getElementById(baseId);
    const status = document.getElementById(baseId + '-status');
    if (!ta) return;

    let interim = '';
    let final = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t + ' ';
        else interim += t;
    }

    if (status) status.textContent = interim ? '🎤 ' + interim : '';
    if (final) {
        ta.value += final;
        jegGenericUpdateCharCount(baseId);
    }
  };

  jegGenericRecognition.onerror = function (e) {
    const status = document.getElementById(baseId + '-status');
    if (status) status.textContent = 'Fehler: ' + (e.error === 'no-speech' ? 'Kein Ton' : e.error);
    jegGenericSetMicState(baseId, false);
    jegGenericRecordingId = null;
  };

  jegGenericRecognition.onend = function () {
    jegGenericSetMicState(baseId, false);
    const status = document.getElementById(baseId + '-status');
    if (status) status.textContent = '';
    jegGenericRecordingId = null;
  };

  jegGenericRecognition.start();
};

window.jegGenericSetMicState = function(baseId, active) {
  const btn = document.getElementById(baseId + '-mic');
  const label = document.getElementById(baseId + '-mic-label');
  if (!btn || !label) return;
  if (active) {
    btn.style.background = '#c62828';
    btn.style.animation = 'jekPulse 1s infinite';
    label.textContent = 'Stop';
  } else {
    btn.style.background = 'var(--blue-accent)';
    btn.style.animation = '';
    label.textContent = 'Sprache';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ['jeg-themen', 'jeg-ziele'].forEach(id => {
    const ta = document.getElementById(id);
    if (ta) {
      const saved = localStorage.getItem('jeg_notes_' + id);
      if (saved) {
        ta.value = saved;
        jegGenericUpdateCharCount(id);
      }
    }
  });
});

// ===== VERMÖGENSANLAGE BERATUNGSSTRECKE =====
const VA_WISHES = {
  auto:       { label: 'Traumauto',                img: 'wish_auto.png' },
  haus:       { label: 'Eigenes Haus',             img: 'wish_haus.png' },
  weltreise:  { label: 'Weltreise',                img: 'wish_weltreise.png' },
  ruhestand:  { label: 'Sorgenfreier Ruhestand',   img: 'wish_ruhestand.png' },
  ausbildung: { label: 'Ausbildung der Kinder',    img: 'wish_ausbildung.png' },
  individuell:{ label: 'Individueller Wunsch',     img: null },
};

let vaCurrentWish = null;

function vaSelectWish(cardEl) {
  document.querySelectorAll('.va-wish-card').forEach(c => {
    c.style.border = '2px solid var(--border)';
    c.style.background = '#fff';
    c.style.boxShadow = 'none';
  });
  cardEl.style.border = '2px solid var(--blue-primary)';
  cardEl.style.background = '#e8f0fe';
  cardEl.style.boxShadow = '0 4px 12px rgba(21,101,192,0.18)';

  vaCurrentWish = cardEl.dataset.wish;
  const wish = VA_WISHES[vaCurrentWish];
  const customInput = document.getElementById('va-custom-input');

  // Always reset step 2, 3 and invest result when changing wish
  document.getElementById('va-step2').style.display        = 'none';
  document.getElementById('va-step3').style.display        = 'none';
  document.getElementById('va-invest-result').style.display = 'none';
  document.querySelectorAll('.va-invest-card').forEach(c => {
    c.style.border = '2px solid var(--border)';
    c.style.background = '#fff';
    c.classList.remove('selected');
  });

  if (vaCurrentWish === 'individuell') {
    customInput.style.display = 'block';
    document.getElementById('va-wish-detail').style.display = 'none';
    return;
  }
  customInput.style.display = 'none';

  document.getElementById('va-wish-label').textContent = wish.label;
  const imgEl = document.getElementById('va-wish-image');
  imgEl.src = wish.img;
  imgEl.style.display = 'block';
  document.getElementById('va-wish-image-loading').style.display = 'none';
  document.getElementById('va-wish-detail').style.display = 'block';
  document.getElementById('va-wish-kosten').value = '';
  document.getElementById('va-wish-jahre').value = '';
  document.getElementById('va-wish-einmalanlage').value = '';
  document.getElementById('va-step2').style.display = 'none';
  document.getElementById('va-step3').style.display = 'none';
  document.getElementById('va-step4').style.display = 'none';
  document.getElementById('va-s4-result').style.display = 'none';
  document.getElementById('va-s4-result-diy').style.display = 'none';
  document.getElementById('va-s4-result-pro').style.display = 'none';
  ['va-s4-diy','va-s4-pro'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.border = '2px solid var(--border)'; el.style.background = '#fff'; el.style.boxShadow = 'none'; }
  });
}

function vaCustomWishChanged(val) {
  document.getElementById('va-wish-label').textContent = val.trim() || 'Individueller Wunsch';
}

function vaGetImageKey() {
  return (localStorage.getItem('va_image_api_key') || getGeminiKey() || '').trim();
}

function vaImageKeyChanged() {
  document.getElementById('va-image-key-status').textContent = '';
}

function vaSaveImageKey() {
  const val = document.getElementById('va-image-api-key')?.value?.trim();
  if (val) {
    localStorage.setItem('va_image_api_key', val);
    vaCollapseKeyInput(); // hide input, show badge
  } else {
    localStorage.removeItem('va_image_api_key');
    document.getElementById('va-image-key-status').textContent = 'Entfernt';
    document.getElementById('va-image-key-status').style.color = 'var(--text-muted)';
  }
}

function vaCollapseKeyInput() {
  const badge = document.getElementById('va-key-set-badge');
  const area  = document.getElementById('va-key-input-area');
  if (badge) badge.style.display = 'flex';
  if (area)  area.style.display  = 'none';
}

function vaShowKeyInput() {
  const badge = document.getElementById('va-key-set-badge');
  const area  = document.getElementById('va-key-input-area');
  if (badge) badge.style.display = 'none';
  if (area)  area.style.display  = 'flex';
  document.getElementById('va-image-api-key')?.focus();
}

async function vaTestImageKey() {
  const keyInput = document.getElementById('va-image-api-key');
  const rawStored = localStorage.getItem('va_image_api_key') || '';
  const imageKey = (keyInput?.value?.trim() || rawStored.trim());
  const textKey  = getGeminiKey().trim();
  const statusEl = document.getElementById('va-image-key-status');

  async function testKey(key, label) {
    if (!key) return { ok: false, msg: 'Kein Key', models: [] };
    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      const data = await resp.json();
      if (!resp.ok) {
        return { ok: false, msg: `Fehler ${data?.error?.code}: ${(data?.error?.message||'').slice(0,50)}`, models: [] };
      }
      const models = (data.models || []).map(m => m.name.replace('models/', ''));
      const imgModels = models.filter(m => m.includes('image') || m.includes('imagen'));
      return { ok: true, msg: `✓ Gültig (${models.length} Modelle, ${imgModels.length} Bild-Modelle)`, models, imgModels };
    } catch(e) { return { ok: false, msg: `Netzwerkfehler: ${e.message}`, models: [] }; }
  }

  if (!imageKey && !textKey) {
    if (statusEl) { statusEl.textContent = '⚠️ Kein Key vorhanden'; statusEl.style.color = 'orange'; }
    return;
  }

  if (statusEl) { statusEl.textContent = '⏳ Teste Keys…'; statusEl.style.color = 'var(--text-muted)'; }

  const [imgResult, txtResult] = await Promise.all([
    testKey(imageKey, 'Bild-Key'),
    testKey(textKey,  'Text-Key')
  ]);

  // Build diagnostic message
  let lines = [];
  if (imageKey) lines.push(`Bild-Key (Länge: ${imageKey.length}): ${imgResult.msg}`);
  else          lines.push('Bild-Key: nicht gesetzt');
  if (textKey)  lines.push(`Text-Key (Länge: ${textKey.length}): ${txtResult.msg}`);

  // Auto-use text key for images if it has image models and image key fails
  if (!imgResult.ok && txtResult.ok && txtResult.imgModels.length > 0) {
    lines.push('→ Text-Key hat Bildmodelle – wird automatisch verwendet: ' + txtResult.imgModels[0]);
    localStorage.setItem('va_image_api_key', textKey);
    if (keyInput) keyInput.value = textKey;
    if (statusEl) {
      statusEl.textContent = lines[lines.length - 1];
      statusEl.title = lines.join('|');
      statusEl.style.color = '#2e7d32';
    }
    return;
  }

  // Show result
  const allGood = imgResult.ok && imgResult.imgModels.length > 0;
  if (statusEl) {
    statusEl.title = lines.join(' | ');
    if (allGood) {
      statusEl.textContent = `✓ Key gültig · Bildmodelle: ${imgResult.imgModels.slice(0,2).join(', ')}`;
      statusEl.style.color = '#2e7d32';
    } else {
      statusEl.textContent = lines.join(' | ');
      statusEl.style.color = imgResult.ok ? 'orange' : '#c62828';
    }
  }
  // Alert with full details for debugging
  const detail = lines.join('\n');
  if (!allGood) setTimeout(() => alert('Key-Diagnose:\n\n' + detail), 100);
}

// On page init: restore saved image key (auto-trim on restore)
(function vaInitImageKey() {
  document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('va_image_api_key');
    const el = document.getElementById('va-image-api-key');
    const status = document.getElementById('va-image-key-status');
    if (saved) {
      const trimmed = saved.trim();
      if (trimmed !== saved) {
        // Key had hidden whitespace – auto-fix
        localStorage.setItem('va_image_api_key', trimmed);
      }
      if (el) el.value = trimmed;
      if (status) { status.textContent = '✓ Gespeichert'; status.style.color = '#2e7d32'; }
      vaCollapseKeyInput(); // show badge, hide input
    }
  });
})();

async function vaGenerateCustomImage() {
  const text = document.getElementById('va-custom-text')?.value?.trim();
  if (!text) { showToast('⚠️ Bitte zuerst einen Wunsch eingeben.'); return; }
  const apiKey = vaGetImageKey();
  if (!apiKey) { showToast('⚠️ Bitte einen API Key für die Bildgenerierung hinterlegen.'); return; }

  // Basic key format check
  if (!apiKey.startsWith('AIza') || apiKey.length < 30) {
    showToast('⚠️ Der API Key hat ein ungültiges Format (erwartet: AIza…)');
    return;
  }

  document.getElementById('va-wish-label').textContent = text;
  document.getElementById('va-wish-detail').style.display = 'block';
  const imgEl = document.getElementById('va-wish-image');
  imgEl.style.display = 'none';
  const loadingEl = document.getElementById('va-wish-image-loading');
  loadingEl.innerHTML = '<span>🖼️ Bild wird generiert…</span>';
  loadingEl.style.display = 'flex';

  const prompt = `Aspirational lifestyle photo: "${text}". Photorealistic, warm colors, professional, no people required, no text, no logos.`;

  // Try gemini-2.5-flash-image first, fallback to gemini-3.1-flash-image-preview
  const tryModels = [
    { 
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
      body: { contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseModalities: ['IMAGE', 'TEXT'] } },
      parse: data => {
        const part = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        return part ? `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` : null;
      }
    },
    { 
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`,
      body: { contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseModalities: ['IMAGE', 'TEXT'] } },
      parse: data => {
        const part = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        return part ? `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` : null;
      }
    },
  ];

  const errors = [];
  for (const m of tryModels) {
    try {
      const resp = await fetch(m.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(m.body)
      });
      const data = await resp.json();
      const dataUrl = m.parse(data);
      if (dataUrl) {
        imgEl.src = dataUrl;
        imgEl.style.display = 'block';
        loadingEl.style.display = 'none';
        return;
      }
      // Capture API error message if available
      const errCode = data?.error?.code;
      const errMsg = data?.error?.message || data?.error?.status || JSON.stringify(data).slice(0, 120);
      // If key is invalid (401/403), no need to try further models
      if (errCode === 400 && errMsg.toLowerCase().includes('api key not valid')) {
        loadingEl.innerHTML = `<span style="font-size:12px;line-height:1.5;">
          ⚠️ <strong>API Key ungültig oder fehlende Berechtigung.</strong><br>
          Bildgenerierung erfordert einen Gemini API Key mit aktiviertem Billing.<br>
          <a href="https://aistudio.google.com/apikey" target="_blank" style="color:var(--blue-accent);">→ API Key in Google AI Studio verwalten</a>
        </span>`;
        return;
      }
      errors.push(errMsg);
    } catch(e) { errors.push(e.message); }
  }
  // Deduplicate error messages
  const uniqueErrors = [...new Set(errors)];
  const isKeyError = uniqueErrors.some(e => e && e.toLowerCase().includes('api key'));
  if (isKeyError) {
    loadingEl.innerHTML = `<span style="font-size:12px;line-height:1.5;">
      ⚠️ <strong>API Key ungültig oder fehlende Berechtigung.</strong><br>
      Bildgenerierung erfordert einen Gemini API Key mit aktiviertem Billing.<br>
      <a href="https://aistudio.google.com/apikey" target="_blank" style="color:var(--blue-accent);">→ API Key in Google AI Studio verwalten</a>
    </span>`;
  } else {
    loadingEl.innerHTML = `<span style="font-size:11px;">⚠️ Fehler: ${uniqueErrors.join(' | ')}</span>`;
  }
}


const VA_INVEST_OPTIONS = [
  { name: 'Sparbuch',      rate: 0.001,  emoji: '🏦' },
  { name: 'Tagesgeldkonto',rate: 0.01,   emoji: '💳' },
  { name: 'Rentenfonds',   rate: 0.025,  emoji: '📊' },
  { name: 'Investmentfonds',rate: 0.08,  emoji: '📈' },
];

function vaCalcRate(ziel, jahre, ratePA, einmalanlage) {
  const monate = jahre * 12;
  // Future value of the initial lump-sum investment
  const fvEinmal = (einmalanlage || 0) * Math.pow(1 + ratePA, jahre);
  // Remaining target after the lump-sum covers part of the goal
  const remaining = Math.max(0, ziel - fvEinmal);
  if (remaining === 0) return 0;
  if (ratePA === 0 || ratePA < 0.0001) return remaining / monate;
  const r = ratePA / 12;
  return remaining * r / (Math.pow(1 + r, monate) - 1);
}

function vaUpdateCalc() {
  const kostStr      = document.getElementById('va-wish-kosten')?.value || '';
  const jahre        = parseFloat(document.getElementById('va-wish-jahre')?.value) || 0;
  const einmalStr    = document.getElementById('va-wish-einmalanlage')?.value || '';
  const kosten       = parseFloat(kostStr.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '')) || 0;
  const einmalanlage = parseFloat(einmalStr.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '')) || 0;

  if (kosten <= 0 || jahre <= 0) {
    document.getElementById('va-step2').style.display = 'none';
    document.getElementById('va-step3').style.display = 'none';
    return;
  }

  // Reveal Schritt 2, 3 & 4
  document.getElementById('va-step2').style.display = 'block';
  document.getElementById('va-step3').style.display = 'block';
  document.getElementById('va-step4').style.display = 'block';

  // Rebuild comparison table (all options)
  vaRenderCompareTable(kosten, jahre, einmalanlage);
}

// ===== SCHRITT 4: Selbst oder professionell? =====

function vaSelectS4(choice) {
  // Reset both cards
  const diyCard = document.getElementById('va-s4-diy');
  const proCard = document.getElementById('va-s4-pro');
  [diyCard, proCard].forEach(el => {
    if (!el) return;
    el.style.border     = '2px solid var(--border)';
    el.style.background = '#fff';
    el.style.boxShadow  = 'none';
  });

  // Highlight selected
  if (choice === 'diy' && diyCard) {
    diyCard.style.border     = '2px solid #43a047';
    diyCard.style.background = '#f1f8f2';
    diyCard.style.boxShadow  = '0 4px 16px rgba(67,160,71,0.18)';
  } else if (choice === 'pro' && proCard) {
    proCard.style.border     = '2px solid var(--blue-accent)';
    proCard.style.background = '#e8f0fe';
    proCard.style.boxShadow  = '0 4px 16px rgba(21,101,192,0.18)';
  }

  // Show correct result block
  const resultBox = document.getElementById('va-s4-result');
  const diyResult = document.getElementById('va-s4-result-diy');
  const proResult = document.getElementById('va-s4-result-pro');

  if (resultBox) resultBox.style.display = 'block';
  if (diyResult) diyResult.style.display = choice === 'diy' ? 'block' : 'none';
  if (proResult) proResult.style.display = choice === 'pro' ? 'block' : 'none';

  // Smooth scroll to result
  setTimeout(() => {
    const el = document.getElementById('va-s4-result');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

function vaS4RequestConsultation() {
  if (typeof showToast === 'function') {
    showToast('✅ Beratungsgespräch wird vorbereitet – Ihr Berater meldet sich bei Ihnen.');
  }
}
function vaRenderCompareTable(kosten, jahre, einmalanlage) {
  einmalanlage = einmalanlage || 0;
  const fmt = v => v.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const monate = jahre * 12;
  const tbody = document.getElementById('va-invest-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';
  VA_INVEST_OPTIONS.forEach(opt => {
    const rate    = vaCalcRate(kosten, jahre, opt.rate, einmalanlage);
    const eigen   = rate * monate + einmalanlage;
    const gewinn  = kosten - eigen;
    const gewinnPct = ((gewinn / kosten) * 100).toFixed(0);
    const isSelected = document.querySelector('.va-invest-card.selected')?.dataset?.name === opt.name;
    const tr = document.createElement('tr');
    tr.style.background = isSelected ? '#e8f0fe' : '';
    tr.innerHTML = `
      <td style="padding:9px 16px;border-bottom:1px solid #f0f0f0;">${opt.emoji} ${opt.name}</td>
      <td style="padding:9px 16px;text-align:right;border-bottom:1px solid #f0f0f0;color:var(--text-muted);">${(opt.rate * 100).toLocaleString('de-DE', {minimumFractionDigits:1,maximumFractionDigits:1})} %</td>
      <td style="padding:9px 16px;text-align:right;border-bottom:1px solid #f0f0f0;font-weight:600;color:var(--blue-primary);">${rate > 0 ? fmt(rate) + ' €' : '—'}</td>
      <td style="padding:9px 16px;text-align:right;border-bottom:1px solid #f0f0f0;color:#555;">${fmt(eigen)} €</td>
      <td style="padding:9px 16px;text-align:right;border-bottom:1px solid #f0f0f0;color:${gewinn >= 0 ? '#2e7d32' : '#c62828'};">${gewinn >= 0 ? '+' : ''}${fmt(gewinn)} € (${gewinn >= 0 ? '+' : ''}${gewinnPct} %)</td>`;
    tbody.appendChild(tr);
  });
}

function vaSelectInvest(cardEl) {
  // Deselect all invest cards
  document.querySelectorAll('.va-invest-card').forEach(c => {
    c.style.border = '2px solid var(--border)';
    c.style.background = '#fff';
    c.style.boxShadow = 'none';
    c.classList.remove('selected');
  });
  // Select clicked
  cardEl.style.border = '2px solid var(--blue-primary)';
  cardEl.style.background = '#e8f0fe';
  cardEl.style.boxShadow = '0 4px 12px rgba(21,101,192,0.18)';
  cardEl.classList.add('selected');

  const rate  = parseFloat(cardEl.dataset.rate);
  const name  = cardEl.dataset.name;

  const kostStr      = document.getElementById('va-wish-kosten')?.value || '';
  const jahre        = parseFloat(document.getElementById('va-wish-jahre')?.value) || 0;
  const einmalStr    = document.getElementById('va-wish-einmalanlage')?.value || '';
  const kosten       = parseFloat(kostStr.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '')) || 0;
  const einmalanlage = parseFloat(einmalStr.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '')) || 0;

  if (kosten <= 0 || jahre <= 0) {
    showToast('⚠️ Bitte zuerst Kosten und Zeitraum im Schritt 1 eingeben.');
    return;
  }

  const fmt    = v => v.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const monate = jahre * 12;
  const monRate = vaCalcRate(kosten, jahre, rate, einmalanlage);
  const eigen   = monRate * monate + einmalanlage;
  const gewinn  = kosten - eigen;
  const gewinnPct = ((gewinn / kosten) * 100).toFixed(0);

  document.getElementById('va-invest-rate').textContent = monRate > 0 ? `${fmt(monRate)} €` : '0,00 €';
  document.getElementById('va-invest-name').textContent = `${name} · ${(rate * 100).toLocaleString('de-DE', {minimumFractionDigits:1})} % p.a. · ${jahre} Jahre${einmalanlage > 0 ? ' · Einmalanlage ' + fmt(einmalanlage) + ' €' : ''}`;
  document.getElementById('va-invest-own').textContent  = `${fmt(eigen)} €`;
  document.getElementById('va-invest-gain').textContent = `${gewinn >= 0 ? '+' : ''}${fmt(gewinn)} €`;
  document.getElementById('va-invest-gain-pct').textContent = `${gewinn >= 0 ? '+' : ''}${gewinnPct} % des Ziels durch Rendite`;
  document.getElementById('va-invest-result').style.display = 'block';

  vaRenderCompareTable(kosten, jahre, einmalanlage);
}
