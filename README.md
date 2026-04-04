# Sky Converter

**Minecraft Bedrock ↔ Java Sky テクスチャ変換ツール**  
**Minecraft Bedrock ↔ Java Sky Texture Converter**

---

## 日本語 / Japanese

### 概要

**Sky Converter** は、Minecraft の統合版（Bedrock Edition）と Java 版（Java Edition）の空（Sky）テクスチャを相互に変換できる、ブラウザで動作するウェブツールです。  
インストール不要で、画像をアップロードするだけで変換できます。

### 機能

| 機能 | 説明 |
|------|------|
| **Bedrock → Java** | 6 枚の `cubemap_0〜5.png` を 1 枚の `sky.png`（3×2 グリッド）に合成 |
| **Java → Bedrock** | `sky.png`（3×2 グリッド）を 6 枚の `cubemap_0〜5.png` に分割 |
| **LCE Convert** | 出力画像を `4032×2688 px` にリサイズ（Legacy Console Edition 向け） |
| **ZIP ダウンロード** | Java→Bedrock 変換後、6 枚をまとめて ZIP で取得 |
| **日本語 / 英語対応** | ヘッダーのボタンで言語を切り替え可能 |

### フォーマット仕様

Bedrock 版のキューブマップは、以下のパノラマ配置で `sky.png` に合成されます（`images.png` 参照）。

```
[cubemap_5][cubemap_4][cubemap_2]
[cubemap_3][cubemap_0][cubemap_1]
```

### 使い方

#### Bedrock → Java

1. ブラウザで `index.html` を開く
2. ヘッダーの **Bedrock → Java** タブを選択
3. 各スロットに `cubemap_0.png` 〜 `cubemap_5.png` をアップロード  
   （6 枚まとめてドロップすると自動割り当て）
4. **変換する** ボタンをクリック
5. オプションで **LCE Convert** を有効にすると `4032×2688` にリサイズ
6. 生成された `sky.png` をダウンロード

#### Java → Bedrock

1. ヘッダーの **Java → Bedrock** タブを選択
2. `sky.png` をドロップ、またはクリックして選択
3. **変換する** ボタンをクリック
4. 各 `cubemap_X.png` を個別にダウンロード、または **ZIP でダウンロード**

### ファイル構成

```
Sky Converter/
├── index.html    # HTML 構造
├── style.css     # スタイルシート
├── script.js     # 変換ロジック・i18n
├── BedrockSky/   # テンプレート画像（Bedrock 形式サンプル）
│   ├── cubemap_0.png
│   ├── cubemap_1.png
│   ├── cubemap_2.png
│   ├── cubemap_3.png
│   ├── cubemap_4.png
│   └── cubemap_5.png
├── JavaSky/      # テンプレート画像（Java 形式サンプル）
│   └── sky.png
└── images.png    # キューブマップ配置の参考図
```

### 動作環境

- モダンブラウザ（Chrome / Edge / Firefox / Safari の最新版）
- サーバー不要 — ローカルで `index.html` を直接開いて使用可能
- ZIP ダウンロード機能には **インターネット接続が必要**（JSZip を CDN から読み込み）

---

## English

### Overview

**Sky Converter** is a browser-based tool for converting sky textures between **Minecraft Bedrock Edition** and **Minecraft Java Edition**.  
No installation required — just open `index.html` in your browser and start converting.

### Features

| Feature | Description |
|---------|-------------|
| **Bedrock → Java** | Combines 6 `cubemap_0〜5.png` files into a single `sky.png` (3×2 grid) |
| **Java → Bedrock** | Splits `sky.png` (3×2 grid) into 6 separate `cubemap_0〜5.png` files |
| **LCE Convert** | Resizes the output to `4032×2688 px` for Legacy Console Edition |
| **ZIP Download** | Download all 6 cubemap files at once as a ZIP archive |
| **JP / EN Language** | Toggle between Japanese and English via the header button |

### Format Specification

Bedrock cubemap files are assembled into `sky.png` using the following panorama layout (see `images.png`):

```
[cubemap_5][cubemap_4][cubemap_2]
[cubemap_3][cubemap_0][cubemap_1]
```

### Usage

#### Bedrock → Java

1. Open `index.html` in your browser
2. Select the **Bedrock → Java** tab in the header
3. Upload `cubemap_0.png` through `cubemap_5.png` into each slot  
   (Drag & drop all 6 files at once for automatic assignment by filename)
4. Click the **Convert** button
5. Optionally enable **LCE Convert** to resize the output to `4032×2688`
6. Download the generated `sky.png`

#### Java → Bedrock

1. Select the **Java → Bedrock** tab in the header
2. Drop or click to select your `sky.png`
3. Click the **Convert** button
4. Download each `cubemap_X.png` individually, or click **Download All as ZIP**

### File Structure

```
Sky Converter/
├── index.html    # HTML structure
├── style.css     # Stylesheet
├── script.js     # Conversion logic & i18n
├── BedrockSky/   # Template images (Bedrock format samples)
│   ├── cubemap_0.png
│   ├── cubemap_1.png
│   ├── cubemap_2.png
│   ├── cubemap_3.png
│   ├── cubemap_4.png
│   └── cubemap_5.png
├── JavaSky/      # Template images (Java format sample)
│   └── sky.png
└── images.png    # Reference diagram for cubemap layout
```

### Requirements

- A modern browser (latest Chrome / Edge / Firefox / Safari)
- No server needed — open `index.html` directly in your browser
- ZIP download requires an **internet connection** (JSZip is loaded from CDN)

---

## Tech Stack

- **HTML5** — Structure
- **CSS3** — Styling (CSS custom properties, Grid, Flexbox)
- **Vanilla JavaScript** — Conversion logic using Canvas API
- **[JSZip](https://stuk.github.io/jszip/)** — ZIP file generation (CDN)

## License

Feel free to use and modify this tool for personal or resource pack development purposes.
