'use strict';

// ── Color Conversion ──────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3
    ? h.split('').map(c => c + c).join('')
    : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function rgbToHsl({ r, g, b }) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  switch (max) {
    case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
    case gn: h = ((bn - rn) / d + 2) / 6; break;
    default: h = ((rn - gn) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHsv({ r, g, b }) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const v = max, d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      default: h = ((rn - gn) / d + 4) / 6;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function rgbToCmyk({ r, g, b }) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - rn - k) / (1 - k)) * 100),
    m: Math.round(((1 - gn - k) / (1 - k)) * 100),
    y: Math.round(((1 - bn - k) / (1 - k)) * 100),
    k: Math.round(k * 100)
  };
}

function getLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map(v => {
    const sRGB = v / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function hslToRgb(h, s, l) {
  const sn = s / 100, ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = ln - c / 2;
  let r, g, b;
  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

function hslToHex(h, s, l) {
  return rgbToHex(hslToRgb(h, s, l));
}

function getContrastRatio(lum1, lum2) {
  const lighter = Math.max(lum1, lum2);
  const darker  = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getHarmonies(hex) {
  const { h, s, l } = rgbToHsl(hexToRgb(hex));
  return [
    { label: 'Comp',  hex: hslToHex((h + 180) % 360, s, l) },
    { label: 'Ana−',  hex: hslToHex((h - 30 + 360) % 360, s, l) },
    { label: 'Ana+',  hex: hslToHex((h + 30) % 360, s, l) },
    { label: 'Tri 1', hex: hslToHex((h + 120) % 360, s, l) },
    { label: 'Tri 2', hex: hslToHex((h + 240) % 360, s, l) },
  ];
}

function getColorName(hex) {
  const named = {
    '#FF0000': 'Red', '#00FF00': 'Lime', '#0000FF': 'Blue',
    '#FFFF00': 'Yellow', '#FF00FF': 'Magenta', '#00FFFF': 'Cyan',
    '#FFFFFF': 'White', '#000000': 'Black', '#FFA500': 'Orange',
    '#800080': 'Purple', '#008000': 'Green', '#FFC0CB': 'Pink',
    '#A52A2A': 'Brown', '#808080': 'Gray', '#FFD700': 'Gold',
    '#C0C0C0': 'Silver', '#000080': 'Navy', '#808000': 'Olive',
    '#008080': 'Teal', '#4B0082': 'Indigo', '#EE82EE': 'Violet',
    '#40E0D0': 'Turquoise', '#DC143C': 'Crimson', '#FF6347': 'Tomato',
    '#FF7F50': 'Coral', '#20B2AA': 'Light Sea Green',
    '#3B82F6': 'Cornflower Blue', '#6366F1': 'Indigo', '#8B5CF6': 'Violet',
    '#EC4899': 'Pink', '#EF4444': 'Red', '#F97316': 'Orange',
    '#EAB308': 'Yellow', '#22C55E': 'Green', '#14B8A6': 'Teal',
  };
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);

  // Check exact match first
  const upperHex = hex.toUpperCase();
  if (named[upperHex]) return named[upperHex];

  // Approximate name from HSL
  const { h, s, l } = hsl;
  if (l < 8) return 'Near Black';
  if (l > 92) return 'Near White';
  if (s < 10) {
    if (l < 30) return 'Dark Gray';
    if (l < 60) return 'Gray';
    return 'Light Gray';
  }
  const hueNames = [
    [15, 'Red'], [35, 'Orange'], [60, 'Yellow'], [80, 'Yellow-Green'],
    [150, 'Green'], [185, 'Cyan'], [260, 'Blue'], [290, 'Blue-Violet'],
    [330, 'Purple'], [345, 'Pink'], [360, 'Red']
  ];
  let name = 'Red';
  for (const [limit, n] of hueNames) { if (h <= limit) { name = n; break; } }
  const prefix = l < 35 ? 'Dark ' : l > 70 ? 'Light ' : '';
  const satPrefix = s < 40 ? 'Muted ' : '';
  return satPrefix + prefix + name;
}

function formatValues(hex) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);
  const cmyk = rgbToCmyk(rgb);
  return {
    hex: hex.toUpperCase(),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
    cmyk: `cmyk(${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k})`,
    rawRgb: rgb
  };
}

// ── State ─────────────────────────────────────────────────────────────────────

let currentHex = '#3B82F6';
let history = [];
let palettes = [];
let settings = { autoCopy: false, copyFormat: 'hex' };

async function loadState() {
  const data = await chrome.storage.local.get(['colorHistory', 'palettes', 'lastColor', 'settings', 'pendingColor']);
  history = data.colorHistory || [];
  palettes = data.palettes || [];
  if (data.lastColor) currentHex = data.lastColor;
  if (data.settings) settings = { ...settings, ...data.settings };
  if (data.pendingColor) {
    currentHex = data.pendingColor;
    history = [data.pendingColor.toUpperCase(), ...history.filter(h => h.toUpperCase() !== data.pendingColor.toUpperCase())].slice(0, 60);
    await chrome.storage.local.remove('pendingColor');
    await saveHistory();
  }
}

async function saveHistory() {
  await chrome.storage.local.set({ colorHistory: history });
}

async function savePalettes() {
  await chrome.storage.local.set({ palettes });
}

async function saveSettings() {
  await chrome.storage.local.set({ settings });
}

// ── UI Updates ─────────────────────────────────────────────────────────────────

function updatePickerUI(hex) {
  const vals = formatValues(hex);
  const { rawRgb } = vals;
  const lum = getLuminance(rawRgb);

  document.getElementById('colorPreviewLarge').style.background = hex;
  document.getElementById('colorName').textContent = getColorName(hex);
  document.getElementById('luminanceFill').style.width = `${Math.round(lum * 100)}%`;
  document.getElementById('nativeColorPicker').value = hex.toUpperCase().length === 7 ? hex : '#' + hex.slice(1, 7);

  document.getElementById('hexValue').textContent = vals.hex;
  document.getElementById('rgbValue').textContent = vals.rgb;
  document.getElementById('hslValue').textContent = vals.hsl;
  document.getElementById('hsvValue').textContent = vals.hsv;
  document.getElementById('cmykValue').textContent = vals.cmyk;

  renderWcag(lum);
  renderHarmonies(hex);
}

function renderWcag(lum) {
  const vsWhite = getContrastRatio(lum, 1.0);
  const vsBlack = getContrastRatio(lum, 0.0);

  function badges(ratio) {
    const aa  = ratio >= 4.5;
    const aaa = ratio >= 7.0;
    const aaLarge  = ratio >= 3.0;
    return `
      <span class="wcag-badge ${aaa  ? 'pass' : aa ? 'pass' : 'fail'}" title="Normal text (≥4.5)">AA${aa ? '✓' : '✗'}</span>
      <span class="wcag-badge ${aaa  ? 'pass' : 'fail'}" title="Enhanced (≥7.0)">AAA${aaa ? '✓' : '✗'}</span>
    `;
  }

  document.getElementById('wcagRows').innerHTML = `
    <div class="wcag-row">
      <div class="wcag-swatch" style="background:#fff;border:1px solid rgba(255,255,255,0.15)"></div>
      <span class="wcag-on">on White</span>
      <span class="wcag-ratio">${vsWhite.toFixed(1)}:1</span>
      ${badges(vsWhite)}
    </div>
    <div class="wcag-row">
      <div class="wcag-swatch" style="background:#000"></div>
      <span class="wcag-on">on Black</span>
      <span class="wcag-ratio">${vsBlack.toFixed(1)}:1</span>
      ${badges(vsBlack)}
    </div>
  `;
}

function renderHarmonies(hex) {
  const harmonies = getHarmonies(hex);
  document.getElementById('harmoniesSwatches').innerHTML = harmonies.map(h => `
    <div class="harmony-item" data-hex="${h.hex}" title="${h.label}: ${h.hex.toUpperCase()}">
      <div class="harmony-swatch" style="background:${h.hex}"></div>
      <span class="harmony-label">${h.label}</span>
    </div>
  `).join('');

  document.getElementById('harmoniesSwatches').querySelectorAll('.harmony-item').forEach(el => {
    el.addEventListener('click', () => setColor(el.dataset.hex));
  });
}

function renderHistory() {
  const grid = document.getElementById('historyGrid');
  if (history.length === 0) {
    grid.innerHTML = `<div class="empty-state">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
      <p>No colors yet. Pick a color to start.</p>
    </div>`;
    return;
  }
  grid.innerHTML = history.map((hex, i) =>
    `<div class="color-swatch" style="background:${hex}" data-hex="${hex}" data-index="${i}" title="${hex}">
      <span class="swatch-tooltip">${hex.toUpperCase()}</span>
    </div>`
  ).join('');

  grid.querySelectorAll('.color-swatch').forEach(el => {
    el.addEventListener('click', () => {
      setColor(el.dataset.hex);
      switchTab('picker');
    });
  });
}

function renderPalettes() {
  const container = document.getElementById('palettesContainer');
  if (palettes.length === 0) {
    container.innerHTML = `<div class="empty-state">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
      <p>No palettes yet. Create one to organize colors.</p>
    </div>`;
    return;
  }

  container.innerHTML = palettes.map((palette, pi) => `
    <div class="palette-card" data-palette-index="${pi}">
      <div class="palette-card-header">
        <span class="palette-name">${escHtml(palette.name)}</span>
        <div class="palette-actions">
          <button class="icon-btn export-palette-btn" data-pi="${pi}" title="Export as CSS variables">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
          <button class="icon-btn delete-palette-btn" data-pi="${pi}" title="Delete palette">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6"/><path d="M10,11v6"/><path d="M14,11v6"/><path d="M9,6V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v2"/></svg>
          </button>
        </div>
      </div>
      <div class="palette-swatches">
        ${palette.colors.length === 0
          ? '<span class="palette-empty">No colors yet</span>'
          : palette.colors.map((hex, ci) =>
            `<div class="palette-swatch" style="background:${hex}" title="${hex.toUpperCase()}" data-pi="${pi}" data-ci="${ci}"></div>`
          ).join('')}
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.export-palette-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pi = Number(btn.dataset.pi);
      const p = palettes[pi];
      if (p.colors.length === 0) { showToast('Palette is empty'); return; }
      const slug = p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const css = ':root {\n' + p.colors.map((hex, i) => `  --${slug}-${i + 1}: ${hex};`).join('\n') + '\n}';
      copyToClipboard(css);
      showToast('Copied as CSS variables');
    });
  });

  container.querySelectorAll('.delete-palette-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      palettes.splice(Number(btn.dataset.pi), 1);
      await savePalettes();
      renderPalettes();
    });
  });

  container.querySelectorAll('.palette-swatch').forEach(el => {
    el.addEventListener('click', () => {
      setColor(el.title);
      switchTab('picker');
    });
  });
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Core Actions ──────────────────────────────────────────────────────────────

function setColor(hex) {
  const normalized = hex.startsWith('#') ? hex : '#' + hex;
  currentHex = normalized.toUpperCase();
  updatePickerUI(currentHex);
  chrome.storage.local.set({ lastColor: currentHex });
}

async function addToHistory(hex) {
  const upper = hex.toUpperCase();
  history = history.filter(h => h.toUpperCase() !== upper);
  history.unshift(upper);
  if (history.length > 60) history = history.slice(0, 60);
  await saveHistory();
  renderHistory();
}

function showToast(msg, duration = 1800) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => showToast('Copied: ' + text));
}

function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === 'tab-' + name));
}

// ── Eyedropper ─────────────────────────────────────────────────────────────────

async function launchEyedropper() {
  if (!window.EyeDropper) {
    showToast('Eyedropper not supported in this browser');
    return;
  }
  try {
    const dropper = new EyeDropper();
    const result = await dropper.open();
    if (result?.sRGBHex) {
      setColor(result.sRGBHex);
      await addToHistory(result.sRGBHex);
      if (settings.autoCopy) {
        const vals = formatValues(result.sRGBHex);
        const text = settings.copyFormat === 'hex' ? vals.hex : vals[settings.copyFormat];
        copyToClipboard(text);
      } else {
        showToast('Color picked!');
      }
    }
  } catch (e) {
    // User cancelled — no-op
  }
}

// ── Palette Modal ─────────────────────────────────────────────────────────────

function openPaletteModal() {
  document.getElementById('paletteModal').classList.add('open');
  document.getElementById('paletteNameInput').value = '';
  document.getElementById('paletteNameInput').focus();
}

function closePaletteModal() {
  document.getElementById('paletteModal').classList.remove('open');
}

async function createPalette() {
  const name = document.getElementById('paletteNameInput').value.trim();
  if (!name) return;
  palettes.push({ name, colors: [] });
  await savePalettes();
  renderPalettes();
  closePaletteModal();
  switchTab('palettes');
  showToast('Palette created');
}

function openAddToPaletteModal() {
  if (palettes.length === 0) {
    showToast('Create a palette first');
    return;
  }
  const list = document.getElementById('palettePickList');
  list.innerHTML = palettes.map((p, i) => `
    <div class="palette-pick-item" data-pi="${i}">
      <div class="palette-pick-preview">
        ${p.colors.slice(0, 5).map(c => `<div class="palette-pick-dot" style="background:${c}"></div>`).join('')}
      </div>
      <span>${escHtml(p.name)}</span>
    </div>
  `).join('');

  list.querySelectorAll('.palette-pick-item').forEach(el => {
    el.addEventListener('click', async () => {
      const pi = Number(el.dataset.pi);
      const upper = currentHex.toUpperCase();
      if (!palettes[pi].colors.includes(upper)) {
        palettes[pi].colors.push(upper);
        await savePalettes();
        renderPalettes();
        showToast(`Added to "${palettes[pi].name}"`);
      } else {
        showToast('Already in this palette');
      }
      closeAddToPaletteModal();
    });
  });

  document.getElementById('addToPaletteModal').classList.add('open');
}

function closeAddToPaletteModal() {
  document.getElementById('addToPaletteModal').classList.remove('open');
}

// ── Init ──────────────────────────────────────────────────────────────────────

async function init() {
  await loadState();
  updatePickerUI(currentHex);
  renderHistory();
  renderPalettes();

  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // Eyedropper
  document.getElementById('eyedropperBtn').addEventListener('click', launchEyedropper);

  // Native color picker
  document.getElementById('nativeColorPicker').addEventListener('input', e => {
    setColor(e.target.value);
  });

  // Copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const format = btn.dataset.copy;
      const vals = formatValues(currentHex);
      const text = format === 'hex' ? vals.hex : vals[format];
      copyToClipboard(text);
      btn.classList.add('copied');
      setTimeout(() => btn.classList.remove('copied'), 1500);
    });
  });

  // Click on format row copies value
  document.querySelectorAll('.format-row').forEach(row => {
    row.addEventListener('click', e => {
      if (e.target.closest('.copy-btn')) return;
      const format = row.dataset.format;
      const vals = formatValues(currentHex);
      const text = format === 'hex' ? vals.hex : vals[format];
      copyToClipboard(text);
    });
  });

  // Save to history
  document.getElementById('saveToHistoryBtn').addEventListener('click', async () => {
    await addToHistory(currentHex);
    showToast('Saved to history');
  });

  // Add to palette
  document.getElementById('addToPaletteBtn').addEventListener('click', openAddToPaletteModal);

  // History clear
  document.getElementById('clearHistoryBtn').addEventListener('click', async () => {
    if (history.length === 0) return;
    history = [];
    await saveHistory();
    renderHistory();
    showToast('History cleared');
  });

  // Palette modals
  document.getElementById('newPaletteBtn').addEventListener('click', openPaletteModal);
  document.getElementById('closePaletteModal').addEventListener('click', closePaletteModal);
  document.getElementById('cancelPaletteBtn').addEventListener('click', closePaletteModal);
  document.getElementById('createPaletteBtn').addEventListener('click', createPalette);
  document.getElementById('paletteNameInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') createPalette();
  });
  document.getElementById('closeAddModal').addEventListener('click', closeAddToPaletteModal);
  document.getElementById('cancelAddBtn').addEventListener('click', closeAddToPaletteModal);

  // Close modals on overlay click
  document.getElementById('paletteModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closePaletteModal();
  });
  document.getElementById('addToPaletteModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeAddToPaletteModal();
  });

  // Settings panel
  const settingsPanel = document.getElementById('settingsPanel');
  const autoCopyToggle = document.getElementById('autoCopyToggle');
  const copyFormatSelect = document.getElementById('copyFormatSelect');

  function openSettings() {
    autoCopyToggle.checked = settings.autoCopy;
    copyFormatSelect.value = settings.copyFormat;
    settingsPanel.classList.add('open');
  }
  function closeSettings() {
    settingsPanel.classList.remove('open');
  }

  document.getElementById('settingsBtn').addEventListener('click', openSettings);
  document.getElementById('closeSettingsBtn').addEventListener('click', closeSettings);

  autoCopyToggle.addEventListener('change', async () => {
    settings.autoCopy = autoCopyToggle.checked;
    await saveSettings();
  });
  copyFormatSelect.addEventListener('change', async () => {
    settings.copyFormat = copyFormatSelect.value;
    await saveSettings();
  });

  // Listen for colors picked via content script (keyboard shortcut path)
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'COLOR_PICKED' && msg.hex) {
      setColor(msg.hex);
      addToHistory(msg.hex);
      if (settings.autoCopy) {
        const vals = formatValues(msg.hex);
        const text = settings.copyFormat === 'hex' ? vals.hex : vals[settings.copyFormat];
        copyToClipboard(text);
      } else {
        showToast('Color picked!');
      }
    }
  });
}

init();
