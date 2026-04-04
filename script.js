/* ================================================================
   i18n
================================================================ */
let lang = 'ja';

const T = {
  ja: {
    header_sub:     'Minecraft Bedrock &#8596; Java Sky テクスチャ変換ツール',
    tab_b2j:        'Bedrock &rarr; Java',
    tab_j2b:        'Java &rarr; Bedrock',
    b2j_h2:         'Bedrock Sky &rarr; Java Sky',
    b2j_p:          '統合版のキューブマップ画像 6 枚を Java 版の sky.png（3&times;2 グリッド）に変換します',
    b2j_card_label: 'Bedrock キューブマップ &mdash; 6 枚をアップロード',
    b2j_info:       '各スロット（cubemap_0 〜 5）をクリックして個別に選択できます。<br>または、6 枚をまとめてエリア全体にドロップすると <strong>ファイル名から自動割り当て</strong> されます。',
    drop_hint:      '&#9650; 6 枚まとめてここにドロップ可',
    pano_label:     '配置プレビュー（images.png 準拠: [5][4][2] / [3][0][1]）',
    btn_convert:    '&#9889; 変換する',
    res_b2j_label:  '変換結果 &mdash; sky.png',
    btn_reset:      '&#x21BA; リセット',
    btn_dl_sky:     '&darr; sky.png をダウンロード',
    j2b_h2:         'Java Sky &rarr; Bedrock Sky',
    j2b_p:          'Java 版の sky.png を統合版のキューブマップ画像 6 枚に変換します',
    j2b_card_label: 'Java sky.png をアップロード',
    j2b_info:       'Java 版の sky.png（3&times;2 グリッドレイアウト）をアップロードしてください。<br>以下の配置で分割されます:',
    dz_text:        'sky.png をドロップ、またはクリックして選択',
    prev_label:     'プレビュー',
    res_j2b_label:  '変換結果 &mdash; キューブマップ 6 枚',
    btn_zip:        '&darr; すべて ZIP でダウンロード',
    br_dl:          '&darr; ダウンロード',
    modal_title:    '変換オプション',
    modal_lce_title:'LCE Convert',
    modal_lce_desc: '出力画像を以下のサイズにリサイズします（Legacy Console Edition 向け）',
    modal_cancel:   'キャンセル',
    modal_confirm:  '変換する',
    lang_next:      'EN',
  },
  en: {
    header_sub:     'Minecraft Bedrock &#8596; Java Sky Texture Converter',
    tab_b2j:        'Bedrock &rarr; Java',
    tab_j2b:        'Java &rarr; Bedrock',
    b2j_h2:         'Bedrock Sky &rarr; Java Sky',
    b2j_p:          'Convert 6 Bedrock cubemap images into a Java sky.png (3&times;2 grid)',
    b2j_card_label: 'Bedrock Cubemaps &mdash; Upload 6 Images',
    b2j_info:       'Click each slot (cubemap_0 to 5) to upload individually.<br>Or drop all 6 files onto the area for <strong>automatic assignment by filename</strong>.',
    drop_hint:      '&#9650; Drop all 6 files here',
    pano_label:     'Layout Preview (images.png reference: [5][4][2] / [3][0][1])',
    btn_convert:    '&#9889; Convert',
    res_b2j_label:  'Result &mdash; sky.png',
    btn_reset:      '&#x21BA; Reset',
    btn_dl_sky:     '&darr; Download sky.png',
    j2b_h2:         'Java Sky &rarr; Bedrock Sky',
    j2b_p:          'Convert a Java sky.png into 6 Bedrock cubemap images',
    j2b_card_label: 'Upload Java sky.png',
    j2b_info:       'Upload your Java sky.png (3&times;2 grid layout).<br>It will be split as follows:',
    dz_text:        'Drop sky.png here or click to select',
    prev_label:     'Preview',
    res_j2b_label:  'Result &mdash; 6 Cubemap Files',
    btn_zip:        '&darr; Download All as ZIP',
    br_dl:          '&darr; Download',
    modal_title:    'Conversion Options',
    modal_lce_title:'LCE Convert',
    modal_lce_desc: 'Resize output to the following size (for Legacy Console Edition)',
    modal_cancel:   'Cancel',
    modal_confirm:  'Convert',
    lang_next:      'JA',
  }
};

function applyLang() {
  const t = T[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });
  document.querySelectorAll('.br-item-dl').forEach(el => {
    el.innerHTML = t.br_dl;
  });
  document.getElementById('lang-btn').textContent = t.lang_next;
  document.documentElement.lang = lang;
}

function toggleLang() {
  lang = lang === 'ja' ? 'en' : 'ja';
  applyLang();
}

/* ================================================================
   State
================================================================ */
const faces  = new Array(6).fill(null); // HTMLImageElement | null
let javaImg  = null;                    // HTMLImageElement
let zipFiles = [];                      // [{ name, dataUrl }]
let lceOn    = false;

// Layout from images.png: LAYOUT[row][col] = face index
const LAYOUT = [
  [5, 4, 2],
  [3, 0, 1]
];

/* ================================================================
   Tab switching
================================================================ */
function switchTab(id) {
  document.querySelectorAll('.header-tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', ['b2j', 'j2b'][i] === id);
  });
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.toggle('active', p.id === 'panel-' + id);
  });
}

/* ================================================================
   Utilities
================================================================ */
function setOver(id, on) {
  document.getElementById(id).classList.toggle('over', on);
}

function loadImg(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function dlFile(url, name) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
}

/* ================================================================
   Init: 6 upload slots
================================================================ */
function initSlots() {
  const grid = document.getElementById('slot-grid');
  for (let i = 0; i < 6; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.id = 'slot-' + i;
    slot.innerHTML = `
      <input type="file" accept="image/*" onchange="handleSlot(event, ${i})">
      <img class="slot-img" id="simg-${i}" src="" alt="">
      <div class="slot-ph"><span class="slot-ph-icon">+</span></div>
      <span class="slot-badge">cubemap_${i}</span>
    `;
    grid.appendChild(slot);
  }
}

/* ================================================================
   Bedrock → Java: file uploads
================================================================ */
async function handleSlot(ev, idx) {
  ev.stopPropagation();
  const file = ev.target.files[0];
  if (file) await loadFace(idx, file);
}

async function loadFace(idx, file) {
  const url = await readFile(file);
  const img = await loadImg(url);
  faces[idx] = img;
  document.getElementById('slot-' + idx).classList.add('loaded');
  document.getElementById('simg-' + idx).src = url;
  updatePanoPreview();
  checkB2JReady();
}

function updatePanoPreview() {
  for (let i = 0; i < 6; i++) {
    const cell = document.getElementById('pc-' + i);
    const old  = cell.querySelector('img');
    if (old) old.remove();
    if (faces[i]) {
      const img = document.createElement('img');
      img.src = faces[i].src;
      cell.prepend(img);
    }
  }
}

function checkB2JReady() {
  document.getElementById('btn-b2j').disabled = !faces.every(Boolean);
}

async function handleBedrockDrop(ev) {
  ev.preventDefault();
  setOver('b2j-overlay', false);
  await assignFiles([...ev.dataTransfer.files]);
}

async function handleBedrockMulti(ev) {
  await assignFiles([...ev.target.files]);
}

async function assignFiles(files) {
  for (const file of files) {
    const match = file.name.match(/cubemap[_-]?(\d)/i);
    if (match) {
      const idx = parseInt(match[1]);
      if (idx >= 0 && idx <= 5) await loadFace(idx, file);
    }
  }
}

function resetB2J() {
  faces.fill(null);
  for (let i = 0; i < 6; i++) {
    document.getElementById('slot-' + i).classList.remove('loaded');
    document.getElementById('simg-' + i).src = '';
  }
  updatePanoPreview();
  checkB2JReady();
  document.getElementById('res-b2j').classList.remove('show');
}

/* ================================================================
   Modal (Bedrock → Java options)
================================================================ */
function openConvertModal() {
  lceOn = false;
  document.getElementById('chk-box-lce').classList.remove('on');
  document.getElementById('chk-row-lce').classList.remove('active');
  document.getElementById('modal-b2j').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-b2j').classList.remove('open');
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modal-b2j')) closeModal();
}

function toggleLce() {
  lceOn = !lceOn;
  document.getElementById('chk-box-lce').classList.toggle('on', lceOn);
  document.getElementById('chk-row-lce').classList.toggle('active', lceOn);
}

async function doConvertB2J() {
  closeModal();
  await convertB2J();
}

/* ================================================================
   Bedrock → Java: conversion
================================================================ */
async function convertB2J() {
  const faceW = faces[0].naturalWidth;
  const faceH = faces[0].naturalHeight;

  // Compose 3×2 grid canvas
  const canvas = document.createElement('canvas');
  canvas.width  = faceW * 3;
  canvas.height = faceH * 2;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      ctx.drawImage(faces[LAYOUT[row][col]], col * faceW, row * faceH, faceW, faceH);
    }
  }

  // LCE resize to 4032×2688
  let out = canvas;
  if (lceOn) {
    out = document.createElement('canvas');
    out.width  = 4032;
    out.height = 2688;
    out.getContext('2d').drawImage(canvas, 0, 0, 4032, 2688);
  }

  const dataUrl = out.toDataURL('image/png');
  const res = document.getElementById('res-b2j');
  res.classList.add('show');
  document.getElementById('res-b2j-img').src  = dataUrl;
  document.getElementById('res-b2j-dl').href  = dataUrl;
  res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ================================================================
   Java → Bedrock: file upload
================================================================ */
async function handleJavaInput(ev) {
  const file = ev.target.files[0];
  if (file) await loadJavaSky(file);
}

async function handleJavaDrop(ev) {
  ev.preventDefault();
  setOver('j2b-dz', false);
  const file = ev.dataTransfer.files[0];
  if (file) await loadJavaSky(file);
}

async function loadJavaSky(file) {
  const url = await readFile(file);
  javaImg = await loadImg(url);
  document.getElementById('j2b-fname').textContent = file.name;
  document.getElementById('j2b-prev-wrap').classList.add('show');
  document.getElementById('j2b-prev-img').src = url;
  document.getElementById('btn-j2b').disabled  = false;
}

function resetJ2B() {
  javaImg = null;
  zipFiles = [];
  document.getElementById('j2b-fname').textContent    = '';
  document.getElementById('j2b-prev-wrap').classList.remove('show');
  document.getElementById('j2b-prev-img').src         = '';
  document.getElementById('btn-j2b').disabled         = true;
  document.getElementById('res-j2b').classList.remove('show');
  document.getElementById('br-grid').innerHTML        = '';
}

/* ================================================================
   Java → Bedrock: conversion
================================================================ */
async function convertJ2B() {
  const img   = javaImg;
  const faceW = img.naturalWidth  / 3;
  const faceH = img.naturalHeight / 2;

  zipFiles = [];
  const grid = document.getElementById('br-grid');
  grid.innerHTML = '';

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      const fi = LAYOUT[row][col];
      const c  = document.createElement('canvas');
      c.width  = faceW;
      c.height = faceH;
      c.getContext('2d').drawImage(img, col * faceW, row * faceH, faceW, faceH, 0, 0, faceW, faceH);
      zipFiles.push({ name: `cubemap_${fi}.png`, dataUrl: c.toDataURL('image/png') });
    }
  }

  zipFiles.sort((a, b) =>
    parseInt(a.name.match(/\d+/)[0]) - parseInt(b.name.match(/\d+/)[0])
  );

  const dlLabel = T[lang].br_dl;
  for (const f of zipFiles) {
    const item = document.createElement('div');
    item.className = 'br-item';
    item.innerHTML = `
      <img src="${f.dataUrl}" alt="${f.name}">
      <div class="br-item-name">${f.name}</div>
      <a class="br-item-dl" href="${f.dataUrl}" download="${f.name}">${dlLabel}</a>
    `;
    grid.appendChild(item);
  }

  const res = document.getElementById('res-j2b');
  res.classList.add('show');
  res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ================================================================
   ZIP download
================================================================ */
async function downloadZip() {
  if (!zipFiles.length) return;

  if (typeof JSZip !== 'undefined') {
    const zip = new JSZip();
    for (const f of zipFiles) {
      zip.file(f.name, f.dataUrl.split(',')[1], { base64: true });
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url  = URL.createObjectURL(blob);
    dlFile(url, 'bedrock_sky.zip');
    URL.revokeObjectURL(url);
  } else {
    zipFiles.forEach((f, i) => setTimeout(() => dlFile(f.dataUrl, f.name), i * 250));
  }
}

/* ================================================================
   Bootstrap
================================================================ */
initSlots();
