// ===== JEG PDF EXPORT via browser print dialog =====
(function() {
  const styleId = 'jeg-print-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
@media print {
  body > * { display: none !important; }
  #jeg-print-area { display: block !important; }
  #jeg-print-area * { display: revert; }
  @page { margin: 10mm 12mm; size: A4 portrait; }
}
#jeg-print-area {
  display: none;
  font-family: 'Segoe UI', Arial, sans-serif;
  color: #222;
  width: 100%;
}
`;
    document.head.appendChild(style);
  }
  if (!document.getElementById('jeg-print-area')) {
    const pa = document.createElement('div');
    pa.id = 'jeg-print-area';
    document.body.appendChild(pa);
  }
})();

window.generateJEGPdf = function() {
  const btn = document.getElementById('jeg-pdf-btn');
  if (btn) { btn.textContent = 'Wird vorbereitet\u2026'; btn.disabled = true; }

  const mandant = (document.getElementById('jeg-hero-meta') || {}).textContent || 'Mandant';
  const today   = new Date().toLocaleDateString('de-DE', { day:'2-digit', month:'2-digit', year:'numeric' });

  // Read input or span values
  const g = id => {
    const el = document.getElementById(id);
    if (!el) return '\u2014';
    return (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')
      ? (el.value || '').trim() || '\u2014'
      : el.textContent.trim() || '\u2014';
  };

  // JEG metric cards
  const liqui  = g('jeg-liquidity') + '\u00a0\u20ac/Monat';
  const sav    = g('jeg-savings')   + '\u00a0\u20ac/Monat';
  const gapAV  = g('jeg-gap-av')    + '\u00a0\u20ac/Monat';
  const gapExi = g('jeg-gap-exi')   + '\u00a0\u20ac/Monat';

  // ---- Datenaktualisierung – Gehalt ----
  const gehaltFields = [
    ['Brutto (Monat)',       'dak-brutto-akt'],
    ['Netto (Monat)',        'dak-netto-akt'],
    ['Steuer-Brutto (Jahr)', 'dak-steuerbrutto-akt'],
    ['Krankenkasse',         'dak-kk-akt'],
  ];

  // ---- Datenaktualisierung – Renteninformation ----
  const renteFields = [
    ['Renteninfo vom',               'dak-rente-datum'],
    ['Regelaltersrente (erreicht)',   'dak-rente-regel'],
    ['K\u00fcnftige Rente',          'dak-rente-kuenftig'],
    ['EM-Rente',                     'dak-rente-em'],
  ];

  // Helper: simple two-column table rows
  const tableRow = ([label, id]) =>
    `<tr>
      <td style="padding:4px 10px;color:#555;font-size:12px;border-bottom:1px solid #e8edf2;background:#f8f9ff;">${label}</td>
      <td style="padding:4px 10px;font-weight:600;font-size:12px;border-bottom:1px solid #e8edf2;">${g(id)}</td>
    </tr>`;

  const gehaltRows = gehaltFields.map(tableRow).join('');
  const renteRows  = renteFields.map(tableRow).join('');

  // ---- Datenaktualisierung – Riester vs. AV-Depot (all from Datenaktualisierung) ----
  // Kinderzulage rows are dynamically added as tr.dak-kz-row with dataset.kzIdx
  const kzRows = document.querySelectorAll('tr.dak-kz-row');

  let riesterTr = '';
  // Header
  riesterTr += `<tr style="background:#f0f4f8;">
    <td style="padding:5px 10px;font-size:11px;font-weight:700;color:#555;border-bottom:1px solid #e8edf2;">Kennzahl</td>
    <td style="padding:5px 10px;font-size:11px;font-weight:700;color:#0d47a1;border-bottom:1px solid #e8edf2;">Riester</td>
    <td style="padding:5px 10px;font-size:11px;font-weight:700;color:#7b1fa2;border-bottom:1px solid #e8edf2;">AV-Depot</td>
  </tr>`;
  // Beitragsjahr + AV-Beiträge (shared columns)
  riesterTr += `<tr>
    <td style="padding:4px 10px;font-size:12px;color:#555;border-bottom:1px solid #e8edf2;background:#f8f9ff;">Beitragsjahr</td>
    <td colspan="2" style="padding:4px 10px;font-size:12px;font-weight:600;border-bottom:1px solid #e8edf2;">${g('dak-riester-bj')}</td>
  </tr>
  <tr>
    <td style="padding:4px 10px;font-size:12px;color:#555;border-bottom:1px solid #e8edf2;background:#f8f9ff;">AV-Beitr\u00e4ge</td>
    <td colspan="2" style="padding:4px 10px;font-size:12px;font-weight:600;border-bottom:1px solid #e8edf2;">${g('dak-riester-av')}</td>
  </tr>`;
  // Grundzulage side-by-side
  riesterTr += `<tr>
    <td style="padding:4px 10px;font-size:12px;color:#555;border-bottom:1px solid #e8edf2;background:#f8f9ff;">Grundzulage</td>
    <td style="padding:4px 10px;font-size:12px;font-weight:600;color:#0d47a1;border-bottom:1px solid #e8edf2;">${g('dak-riester-gz')}</td>
    <td style="padding:4px 10px;font-size:12px;font-weight:600;color:#7b1fa2;border-bottom:1px solid #e8edf2;">${g('dak-avd-gz')}</td>
  </tr>`;
  // Kinderzulagen side-by-side
  kzRows.forEach((row, rowNum) => {
    const idx   = row.dataset.kzIdx;
    const kzInput = row.querySelector('input[type=text]');
    const rzVal  = kzInput ? (kzInput.value || '').trim() || '\u2014' : '\u2014';
    const avdEl  = document.getElementById('dak-avd-kz-' + idx);
    const avdVal = avdEl ? avdEl.textContent.trim() || '\u2014' : '\u2014';
    riesterTr += `<tr>
      <td style="padding:4px 10px;font-size:12px;color:#555;border-bottom:1px solid #e8edf2;background:#f8f9ff;">Kinderzulage ${rowNum + 1}</td>
      <td style="padding:4px 10px;font-size:12px;font-weight:600;color:#0d47a1;border-bottom:1px solid #e8edf2;">${rzVal}</td>
      <td style="padding:4px 10px;font-size:12px;font-weight:600;color:#7b1fa2;border-bottom:1px solid #e8edf2;">${avdVal}</td>
    </tr>`;
  });
  // Totals row
  riesterTr += `<tr style="background:#f0eaff;">
    <td style="padding:5px 10px;font-size:12px;font-weight:700;border-top:2px solid #c8a2e0;">Zulagen gesamt</td>
    <td style="padding:5px 10px;font-size:13px;font-weight:700;color:#0d47a1;border-top:2px solid #c8a2e0;">${g('dak-sum-riester')}</td>
    <td style="padding:5px 10px;font-size:13px;font-weight:700;color:#7b1fa2;border-top:2px solid #c8a2e0;">${g('dak-sum-avd')}</td>
  </tr>`;

  // ---- Notes ----
  const themenEl = document.getElementById('jeg-themen');
  const themen   = themenEl ? (themenEl.value || '').trim() || '(keine Angabe)' : '(keine Angabe)';
  const zieleEl  = document.getElementById('jeg-ziele');
  const ziele    = zieleEl  ? (zieleEl.value  || '').trim() || '(keine Angabe)' : '(keine Angabe)';
  const notizEl  = document.getElementById('jeg-notizen')
    || document.querySelector('#page-jeg-checkliste textarea');
  const notizen  = notizEl ? (notizEl.value || '').trim() || '(keine Angabe)' : '(keine Angabe)';

  // Checklist items
  let checkRows = '';
  document.querySelectorAll('#page-jeg-checkliste input[type=checkbox]').forEach(cb => {
    const parent = cb.closest('label') || cb.parentElement;
    const text = parent ? parent.textContent.replace(/\s+/g, ' ').trim() : '';
    if (text) checkRows += `<tr><td style="padding:3px 10px;font-size:12px;">${cb.checked ? '\u2705' : '\u2b1c'} ${text}</td></tr>`;
  });

  // ---- Template helpers ----
  const section = title =>
    `<h2 style="font-size:13px;font-weight:700;color:#023e84;border-bottom:2px solid #023e84;padding-bottom:4px;margin:16px 0 8px;">${title}</h2>`;

  const noteBox = text =>
    `<div style="font-size:12px;background:#f8f9ff;border-radius:4px;padding:7px 10px;white-space:pre-wrap;min-height:22px;margin-bottom:8px;-webkit-print-color-adjust:exact;print-color-adjust:exact;">${text}</div>`;

  const metaTile = (bg, fc, label, value) =>
    `<td style="width:50%;padding:0 5px;vertical-align:top;">
      <div style="background:${bg};border-radius:4px;padding:7px 10px;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
        <div style="font-size:10px;color:#555;">${label}</div>
        <div style="font-size:15px;font-weight:700;color:${fc};">${value}</div>
      </div>
    </td>`;

  // ---- Nächster Termin ----
  let nextApptSaved = null;
  try { nextApptSaved = JSON.parse(localStorage.getItem('jeg_next_appointment') || 'null'); } catch(e) {}

  let nextApptBlock = '';
  if (nextApptSaved && (nextApptSaved.date || nextApptSaved.time)) {
    const parts = [];
    if (nextApptSaved.date) {
      const [y,m,d] = nextApptSaved.date.split('-');
      parts.push(`<strong style="font-size:13px;">${d}.${m}.${y}</strong>`);
    }
    if (nextApptSaved.time) parts.push(`um <strong>${nextApptSaved.time} Uhr</strong>`);
    if (nextApptSaved.type) parts.push(`&middot; ${nextApptSaved.type}`);
    nextApptBlock = `
      <div style="display:flex;align-items:flex-start;gap:10px;background:#e8f4fd;border:1px solid #90caf9;border-radius:6px;padding:10px 14px;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
        <div style="margin-top:1px;font-size:18px;line-height:1;">📅</div>
        <div>
          <div style="font-size:12px;color:#0d47a1;">${parts.join(' ')}</div>
          ${nextApptSaved.note ? `<div style="font-size:11px;color:#555;margin-top:3px;">${nextApptSaved.note}</div>` : ''}
        </div>
      </div>`;
  } else {
    nextApptBlock = `<div style="font-size:12px;color:#aaa;font-style:italic;padding:6px 10px;">Kein Folgetermin vereinbart.</div>`;
  }

  document.getElementById('jeg-print-area').innerHTML = `
<div style="font-family:'Segoe UI',Arial,sans-serif;color:#222;">

  <div style="background:#023e84;color:#fff;padding:16px 20px 12px;margin:-10mm -12mm 0;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
    <div style="font-size:10px;opacity:0.85;margin-bottom:3px;">${mandant}</div>
    <div style="font-size:20px;font-weight:700;">Gesprächsprotokoll JEG 2026</div>
    <div style="font-size:10px;opacity:0.75;margin-top:4px;">Erstellt am ${today}</div>
  </div>

  ${section('Beratungsanalyse \u2013 Kennzahlen')}
  <table style="width:100%;border-collapse:collapse;">
    <tr>
      ${metaTile('#e8f0fc','#1565c0','Verf\u00fcgbare Liquidit\u00e4t', liqui)}
      ${metaTile('#e8fce8','#2e7d32','Kosteneinsparungen', sav)}
    </tr>
    <tr><td colspan="2" style="height:6px;"></td></tr>
    <tr>
      ${metaTile('#fff3e0','#e65100','Absicherungsl\u00fccke Altersvorsorge', gapAV)}
      ${metaTile('#fce8e0','#bf360c','Absicherungsl\u00fccke Existenz', gapExi)}
    </tr>
  </table>

  ${section('Datenaktualisierung \u2013 Gehalt')}
  <table style="width:60%;border-collapse:collapse;">${gehaltRows}</table>

  ${section('Datenaktualisierung \u2013 Renteninformation')}
  <table style="width:60%;border-collapse:collapse;">${renteRows}</table>

  ${section('Datenaktualisierung \u2013 Riester / AV-Depot Vergleich')}
  <table style="width:70%;border-collapse:collapse;">${riesterTr}</table>

  ${section('Notizen zur Beratung')}
  <p style="font-size:10px;font-weight:700;color:#023e84;margin:0 0 2px;">Sonstige Themen im Haushalt</p>
  ${noteBox(themen)}
  <p style="font-size:10px;font-weight:700;color:#023e84;margin:0 0 2px;">Beratungsziele</p>
  ${noteBox(ziele)}

  ${section('Checkliste &amp; Notizen')}
  ${checkRows ? `<table style="width:100%;border-collapse:collapse;margin-bottom:8px;">${checkRows}</table>` : ''}
  <p style="font-size:10px;font-weight:700;color:#023e84;margin:0 0 2px;">Freie Notizen</p>
  ${noteBox(notizen)}

  ${section('Nächster Termin')}
  ${nextApptBlock}

  <div style="background:#f0f4f8;padding:7px 20px;margin-top:16px;font-size:9px;color:#888;text-align:center;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
    JEG 2026 Gesprächsprotokoll \u2013 ${mandant} \u2013 ${today}
  </div>
</div>`;

  setTimeout(() => {
    window.print();
    setTimeout(() => {
      if (btn) {
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/></svg> Gesprächsprotokoll als PDF herunterladen`;
        btn.disabled = false;
      }
    }, 1000);
  }, 100);
};
