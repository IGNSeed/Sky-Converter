let lang = "ja";

const translations = {
  ja: {
    header_sub: "BedrockとJavaの空テクスチャ変換",
    page_title: "Sky Texture Converter",
    page_description: "画像はアップロードされず、すべてブラウザ内で処理されます。",
    tab_b2j: "Bedrock → Java",
    tab_j2b: "Java → Bedrock",
    b2j_h2: "BedrockからJavaへ",
    b2j_p: "6枚のcubemap画像を1枚のsky.pngにまとめます。",
    b2j_card_label: "cubemap画像を選択",
    b2j_info: "各枠から個別に選ぶか、ファイル名がcubemap_0～5の6枚をまとめてドロップしてください。",
    drop_hint: "6枚をまとめてここへドロップできます",
    pano_label: "出力レイアウト",
    btn_convert: "変換する",
    res_b2j_label: "変換結果：sky.png",
    btn_reset: "リセット",
    btn_dl_sky: "sky.pngをダウンロード",
    j2b_h2: "JavaからBedrockへ",
    j2b_p: "1枚のsky.pngを6枚のcubemap画像に分割します。",
    j2b_card_label: "sky.pngを選択",
    j2b_info: "3×2のグリッドで構成されたJava版のsky.pngを選択してください。",
    dz_text: "sky.pngを選択またはドロップ",
    prev_label: "プレビュー",
    res_j2b_label: "変換結果：cubemap 6枚",
    btn_zip: "ZIPでまとめてダウンロード",
    br_dl: "ダウンロード",
    modal_title: "変換オプション",
    modal_lce_title: "LCE向けに変換",
    modal_lce_desc: "出力画像をLegacy Console Edition向けのサイズに変更します。",
    modal_cancel: "キャンセル",
    modal_confirm: "変換する",
    lang_next: "EN"
  },
  en: {
    header_sub: "Bedrock and Java sky texture converter",
    page_title: "Sky Texture Converter",
    page_description: "Images stay on your device and are processed entirely in your browser.",
    tab_b2j: "Bedrock → Java",
    tab_j2b: "Java → Bedrock",
    b2j_h2: "Bedrock to Java",
    b2j_p: "Combine six cubemap images into one sky.png.",
    b2j_card_label: "Select cubemap images",
    b2j_info: "Choose each image separately, or drop six files named cubemap_0 through cubemap_5.",
    drop_hint: "You can drop all six images here",
    pano_label: "Output layout",
    btn_convert: "Convert",
    res_b2j_label: "Result: sky.png",
    btn_reset: "Reset",
    btn_dl_sky: "Download sky.png",
    j2b_h2: "Java to Bedrock",
    j2b_p: "Split one sky.png into six cubemap images.",
    j2b_card_label: "Select sky.png",
    j2b_info: "Select a Java sky.png arranged as a 3×2 grid.",
    dz_text: "Select or drop sky.png",
    prev_label: "Preview",
    res_j2b_label: "Result: 6 cubemap images",
    btn_zip: "Download all as ZIP",
    br_dl: "Download",
    modal_title: "Conversion options",
    modal_lce_title: "Convert for LCE",
    modal_lce_desc: "Resize the output for Legacy Console Edition.",
    modal_cancel: "Cancel",
    modal_confirm: "Convert",
    lang_next: "JA"
  }
};

const faces = new Array(6).fill(null);
const layout = [
  [5, 4, 2],
  [3, 0, 1]
];

let javaImg = null;
let zipFiles = [];
let lceOn = false;

function applyLang() {
  const text = translations[lang];
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = text[element.dataset.i18n];
    if (value !== undefined) {
      element.textContent = value;
    }
  });
  document.querySelectorAll(".br-item-dl").forEach((element) => {
    element.textContent = text.br_dl;
  });
  document.getElementById("lang-btn").textContent = text.lang_next;
  document.documentElement.lang = lang;
}

function toggleLang() {
  lang = lang === "ja" ? "en" : "ja";
  applyLang();
}

function switchTab(id) {
  document.querySelectorAll(".tab-button").forEach((button, index) => {
    button.classList.toggle("active", ["b2j", "j2b"][index] === id);
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `panel-${id}`);
  });
}

function resetCurrent() {
  const activePanel = document.querySelector(".tab-panel.active");
  if (!activePanel) {
    return;
  }
  if (activePanel.id === "panel-b2j") {
    resetB2J();
  } else {
    resetJ2B();
  }
}

function setOver(id, enabled) {
  document.getElementById(id).classList.toggle("over", enabled);
}

function loadImg(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function downloadFile(url, name) {
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
}

function initSlots() {
  const grid = document.getElementById("slot-grid");
  for (let index = 0; index < 6; index += 1) {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.id = `slot-${index}`;
    slot.innerHTML = `
      <input type="file" accept="image/*" onchange="handleSlot(event, ${index})">
      <img class="slot-img" id="simg-${index}" src="" alt="">
      <span class="slot-placeholder" aria-hidden="true">＋</span>
      <span class="slot-badge">cubemap_${index}</span>
    `;
    grid.appendChild(slot);
  }
}

async function handleSlot(event, index) {
  event.stopPropagation();
  const file = event.target.files[0];
  if (file) {
    await loadFace(index, file);
  }
}

async function loadFace(index, file) {
  const url = await readFile(file);
  const image = await loadImg(url);
  faces[index] = image;
  document.getElementById(`slot-${index}`).classList.add("loaded");
  document.getElementById(`simg-${index}`).src = url;
  updatePanoPreview();
  checkB2JReady();
}

function updatePanoPreview() {
  for (let index = 0; index < 6; index += 1) {
    const cell = document.getElementById(`pc-${index}`);
    const oldImage = cell.querySelector("img");
    if (oldImage) {
      oldImage.remove();
    }
    if (faces[index]) {
      const image = document.createElement("img");
      image.src = faces[index].src;
      image.alt = `cubemap_${index}`;
      cell.prepend(image);
    }
  }
}

function checkB2JReady() {
  document.getElementById("btn-b2j").disabled = !faces.every(Boolean);
}

async function handleBedrockDrop(event) {
  event.preventDefault();
  setOver("b2j-overlay", false);
  await assignFiles([...event.dataTransfer.files]);
}

async function handleBedrockMulti(event) {
  await assignFiles([...event.target.files]);
}

async function assignFiles(files) {
  for (const file of files) {
    const match = file.name.match(/cubemap[_-]?(\d)/i);
    if (match) {
      const index = Number.parseInt(match[1], 10);
      if (index >= 0 && index <= 5) {
        await loadFace(index, file);
      }
    }
  }
}

function resetB2J() {
  faces.fill(null);
  for (let index = 0; index < 6; index += 1) {
    document.getElementById(`slot-${index}`).classList.remove("loaded");
    document.getElementById(`simg-${index}`).src = "";
  }
  updatePanoPreview();
  checkB2JReady();
  document.getElementById("res-b2j").classList.remove("show");
}

function openConvertModal() {
  lceOn = false;
  document.getElementById("chk-box-lce").classList.remove("on");
  document.getElementById("chk-row-lce").classList.remove("active");
  document.getElementById("chk-row-lce").setAttribute("aria-pressed", "false");
  document.getElementById("modal-b2j").classList.add("open");
}

function closeModal() {
  document.getElementById("modal-b2j").classList.remove("open");
}

function handleOverlayClick(event) {
  if (event.target === document.getElementById("modal-b2j")) {
    closeModal();
  }
}

function toggleLce() {
  lceOn = !lceOn;
  document.getElementById("chk-box-lce").classList.toggle("on", lceOn);
  document.getElementById("chk-row-lce").classList.toggle("active", lceOn);
  document.getElementById("chk-row-lce").setAttribute("aria-pressed", String(lceOn));
}

async function doConvertB2J() {
  closeModal();
  await convertB2J();
}

async function convertB2J() {
  const faceWidth = faces[0].naturalWidth;
  const faceHeight = faces[0].naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = faceWidth * 3;
  canvas.height = faceHeight * 2;
  const context = canvas.getContext("2d");
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < 2; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      context.drawImage(
        faces[layout[row][column]],
        column * faceWidth,
        row * faceHeight,
        faceWidth,
        faceHeight
      );
    }
  }

  let output = canvas;
  if (lceOn) {
    output = document.createElement("canvas");
    output.width = 4032;
    output.height = 2688;
    output.getContext("2d").drawImage(canvas, 0, 0, 4032, 2688);
  }

  const dataUrl = output.toDataURL("image/png");
  const result = document.getElementById("res-b2j");
  result.classList.add("show");
  document.getElementById("res-b2j-img").src = dataUrl;
  document.getElementById("res-b2j-dl").href = dataUrl;
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function handleJavaInput(event) {
  const file = event.target.files[0];
  if (file) {
    await loadJavaSky(file);
  }
}

async function handleJavaDrop(event) {
  event.preventDefault();
  setOver("j2b-dz", false);
  const file = event.dataTransfer.files[0];
  if (file) {
    await loadJavaSky(file);
  }
}

async function loadJavaSky(file) {
  const url = await readFile(file);
  javaImg = await loadImg(url);
  document.getElementById("j2b-fname").textContent = file.name;
  document.getElementById("j2b-prev-wrap").classList.add("show");
  document.getElementById("j2b-prev-img").src = url;
  document.getElementById("btn-j2b").disabled = false;
}

function resetJ2B() {
  javaImg = null;
  zipFiles = [];
  document.getElementById("j2b-fname").textContent = "";
  document.getElementById("j2b-prev-wrap").classList.remove("show");
  document.getElementById("j2b-prev-img").src = "";
  document.getElementById("btn-j2b").disabled = true;
  document.getElementById("res-j2b").classList.remove("show");
  document.getElementById("br-grid").innerHTML = "";
}

async function convertJ2B() {
  const faceWidth = Math.floor(javaImg.naturalWidth / 3);
  const faceHeight = Math.floor(javaImg.naturalHeight / 2);
  zipFiles = [];
  const grid = document.getElementById("br-grid");
  grid.innerHTML = "";

  for (let row = 0; row < 2; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      const faceIndex = layout[row][column];
      const canvas = document.createElement("canvas");
      canvas.width = faceWidth;
      canvas.height = faceHeight;
      canvas.getContext("2d").drawImage(
        javaImg,
        column * faceWidth,
        row * faceHeight,
        faceWidth,
        faceHeight,
        0,
        0,
        faceWidth,
        faceHeight
      );
      zipFiles.push({
        name: `cubemap_${faceIndex}.png`,
        dataUrl: canvas.toDataURL("image/png")
      });
    }
  }

  zipFiles.sort((first, second) => {
    const firstIndex = Number.parseInt(first.name.match(/\d+/)[0], 10);
    const secondIndex = Number.parseInt(second.name.match(/\d+/)[0], 10);
    return firstIndex - secondIndex;
  });

  for (const file of zipFiles) {
    const item = document.createElement("div");
    item.className = "br-item";
    item.innerHTML = `
      <img src="${file.dataUrl}" alt="${file.name}">
      <div class="br-item-name">${file.name}</div>
      <a class="br-item-dl" href="${file.dataUrl}" download="${file.name}">${translations[lang].br_dl}</a>
    `;
    grid.appendChild(item);
  }

  const result = document.getElementById("res-j2b");
  result.classList.add("show");
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function downloadZip() {
  if (!zipFiles.length) {
    return;
  }

  if (typeof JSZip !== "undefined") {
    const zip = new JSZip();
    for (const file of zipFiles) {
      zip.file(file.name, file.dataUrl.split(",")[1], { base64: true });
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    downloadFile(url, "bedrock_sky.zip");
    URL.revokeObjectURL(url);
    return;
  }

  zipFiles.forEach((file, index) => {
    setTimeout(() => downloadFile(file.dataUrl, file.name), index * 250);
  });
}

initSlots();
