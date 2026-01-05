## 🎬📺 MeDiFlix Hub — אתר מדיה “Netflix/YouTube” סטטי ל-GitHub Pages (MFH)

🗓️ **תאריך:** 05 בינואר 2026 | **ט״ז טבת תשפ״ו**
⏰ **שעה (Asia/Jerusalem):** 08:25

---

## ✅ מה תקבל בקובץ אחד

* 🏠 **Home** עם: “המשך צפייה” + “נוסף לאחרונה”
* 📁 **קטגוריות לפי תיקיות** (כולל תת-תיקיות)
* 🎬 **נגן Overlay** (מסך מלא) עם Next/Prev
* 🎧 **אודיו עם פלייליסט** + ויזואליזציה בסיסית (WebAudio)
* 📚 **PDF Viewer** (iframe) + פתיחה נוחה
* 🔍 **חיפוש / סינון / מיון**
* 🌙☀️ **Dark/Light** + שמירת העדפה
* 🇮🇱 **RTL מלא** + עברית טבעית
* 🧾 **manifest.json** (אוטומטי) + Fallback לדוגמה אם אין עדיין

---

## 📁 איפה לשים קבצים במאגר

מומלץ:

```
/media/videos/
/media/audio/
/media/pdfs/
/media/thumbs/   (תמונות ממוזערות)
/site/           (האתר - GitHub Pages)
/site/manifest.json
```

---

## 🧠 המפתח: manifest.json

האתר קורא את `site/manifest.json`. אם עדיין לא יצרת — הוא יעבוד עם נתוני דמו מובנים.

דוגמה רשומה:

```json
{
  "type": "video",
  "path": "media/videos/lesson01.mp4",
  "url": "../media/videos/lesson01.mp4",
  "title": "Lesson 01 – Awakening",
  "description": "Opening session",
  "tags": ["intro","light"],
  "thumb": "../media/thumbs/lesson01.jpg",
  "mtime": 1736040000
}
```

---

## ✅ הקובץ המבוקש: HTML/CSS/JS (הכל בקובץ אחד)

צור קובץ: `site/index.html`

```html
<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>MeDiFlix Hub</title>
  <style>
    :root{
      --bg:#070914; --bg2:#0b1030;
      --card:rgba(255,255,255,.05);
      --card2:rgba(255,255,255,.07);
      --line:rgba(255,255,255,.10);
      --txt:#eaf0ff; --muted:#aab7ff;
      --accent:#6be7ff; --accent2:#b9a4ff;
      --shadow: 0 18px 50px rgba(0,0,0,.35);
      --radius:18px;
    }
    [data-theme="light"]{
      --bg:#f6f7ff; --bg2:#eef0ff;
      --card:rgba(0,0,0,.04);
      --card2:rgba(0,0,0,.06);
      --line:rgba(0,0,0,.10);
      --txt:#0c1020; --muted:#4b577a;
      --accent:#0066ff; --accent2:#7c3aed;
      --shadow: 0 18px 50px rgba(0,0,0,.12);
    }

    *{box-sizing:border-box}
    body{
      margin:0;
      font-family: system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
      color:var(--txt);
      background:
        radial-gradient(1100px 700px at 15% 10%, rgba(185,164,255,.20), transparent 55%),
        radial-gradient(1000px 700px at 85% 15%, rgba(107,231,255,.16), transparent 55%),
        linear-gradient(180deg, var(--bg), var(--bg2));
      min-height:100vh;
    }

    header{
      position:sticky; top:0; z-index:20;
      backdrop-filter: blur(12px);
      background: color-mix(in srgb, var(--bg) 70%, transparent);
      border-bottom:1px solid var(--line);
    }

    .wrap{max-width:1200px; margin:0 auto; padding:14px 16px}
    .topRow{display:flex; align-items:center; gap:12px; flex-wrap:wrap}
    .brand{
      display:flex; align-items:center; gap:10px;
      padding:10px 12px;
      border:1px solid var(--line);
      border-radius:999px;
      background:var(--card);
      box-shadow: var(--shadow);
    }
    .brand b{letter-spacing:.2px}
    .brand .dot{
      width:10px; height:10px; border-radius:50%;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      box-shadow: 0 0 20px color-mix(in srgb, var(--accent) 70%, transparent);
    }

    .controls{
      flex:1;
      display:flex; gap:10px; align-items:center; flex-wrap:wrap;
      justify-content:space-between;
    }

    .inputs{display:flex; gap:10px; flex-wrap:wrap; align-items:center; flex: 1}
    input, select, button{
      border:1px solid var(--line);
      background: var(--card);
      color:var(--txt);
      padding:10px 12px;
      border-radius: 14px;
      outline:none;
    }
    input{min-width:240px; flex:1}
    button{cursor:pointer}
    button.primary{
      background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 65%, transparent), color-mix(in srgb, var(--accent2) 55%, transparent));
      border-color: color-mix(in srgb, var(--accent) 30%, var(--line));
    }
    .small{font-size:12px; color:var(--muted)}
    .status{padding:8px 0 0}

    .sectionTitle{
      display:flex; align-items:center; justify-content:space-between;
      gap:12px;
      margin:18px 0 8px;
    }
    .sectionTitle h2{
      margin:0;
      font-size:16px;
      display:flex; align-items:center; gap:8px;
    }
    .chips{display:flex; gap:8px; flex-wrap:wrap}
    .chip{
      font-size:12px; color:var(--muted);
      border:1px solid var(--line);
      background: var(--card);
      padding:6px 10px; border-radius:999px;
    }

    .rail{
      display:flex; gap:12px; overflow:auto;
      padding:8px 4px 14px;
      scroll-snap-type: x mandatory;
    }
    .rail::-webkit-scrollbar{height:10px}
    .rail::-webkit-scrollbar-thumb{background:color-mix(in srgb, var(--line) 60%, transparent); border-radius:999px}
    .rail::-webkit-scrollbar-track{background:transparent}

    .card{
      width: 240px;
      flex: 0 0 auto;
      scroll-snap-align:start;
      border-radius: var(--radius);
      border:1px solid var(--line);
      background: var(--card);
      overflow:hidden;
      box-shadow: var(--shadow);
      transition: transform .18s ease, background .18s ease, border-color .18s ease;
    }
    .card:hover{
      transform: translateY(-4px) scale(1.02);
      background: var(--card2);
      border-color: color-mix(in srgb, var(--accent) 20%, var(--line));
    }
    .thumb{
      position:relative;
      width:100%;
      aspect-ratio: 16/9;
      background:
        radial-gradient(500px 280px at 30% 30%, rgba(107,231,255,.20), transparent 60%),
        radial-gradient(500px 300px at 70% 20%, rgba(185,164,255,.22), transparent 60%),
        linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
      border-bottom:1px solid var(--line);
    }
    .thumb img{width:100%; height:100%; object-fit:cover; display:block}
    .badge{
      position:absolute; top:10px; right:10px;
      font-size:12px;
      padding:6px 10px;
      border-radius:999px;
      border:1px solid var(--line);
      background: color-mix(in srgb, var(--bg) 75%, transparent);
      backdrop-filter: blur(8px);
    }
    .progressBar{
      position:absolute; left:10px; right:10px; bottom:10px;
      height:6px; border-radius:999px;
      background: color-mix(in srgb, var(--line) 65%, transparent);
      overflow:hidden;
      display:none;
    }
    .progressBar > i{
      display:block; height:100%; width:0%;
      background: linear-gradient(90deg, var(--accent), var(--accent2));
    }

    .meta{padding:12px}
    .title{
      font-weight:800; font-size:14px; line-height:1.2;
      margin:0 0 6px;
      display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
    }
    .desc{
      margin:0 0 10px;
      font-size:12px; color:var(--muted);
      display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
    }
    .row{
      display:flex; gap:8px; flex-wrap:wrap; align-items:center; justify-content:space-between;
      font-size:12px; color:var(--muted);
    }
    .pill{
      display:inline-flex; align-items:center; gap:6px;
      padding:6px 10px;
      border-radius:999px;
      border:1px solid var(--line);
      background: color-mix(in srgb, var(--card) 75%, transparent);
      white-space:nowrap;
    }

    /* Modal player */
    .modal{
      position:fixed; inset:0; z-index:50;
      background: rgba(0,0,0,.68);
      display:none;
      align-items:center; justify-content:center;
      padding:16px;
    }
    .modal.open{display:flex}
    .modalCard{
      width:min(1100px, 100%);
      border-radius: 22px;
      background: color-mix(in srgb, var(--bg) 85%, transparent);
      border:1px solid var(--line);
      box-shadow: 0 30px 90px rgba(0,0,0,.55);
      overflow:hidden;
      backdrop-filter: blur(14px);
    }
    .modalTop{
      display:flex; align-items:center; justify-content:space-between;
      gap:10px;
      padding:12px 12px;
      border-bottom:1px solid var(--line);
    }
    .modalTop .left{
      display:flex; flex-direction:column; gap:4px;
      min-width: 0;
    }
    .modalTop .left b{
      font-size:14px;
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
      max-width: 75vw;
    }
    .modalTop .left span{font-size:12px; color:var(--muted)}
    .modalTop .btns{display:flex; gap:8px; flex-wrap:wrap}
    .modalBody{padding:12px}
    .playerBox{
      border:1px solid var(--line);
      border-radius: 18px;
      overflow:hidden;
      background:#000;
    }
    video, audio, iframe{
      width:100%;
      display:block;
      border:0;
    }
    iframe{height:min(70vh, 720px); background:#111}
    .modalBottom{
      display:flex; gap:10px; flex-wrap:wrap; align-items:center; justify-content:space-between;
      padding:12px;
      border-top:1px solid var(--line);
      color:var(--muted);
      font-size:12px;
    }
    .tags{display:flex; gap:6px; flex-wrap:wrap}
    .tag{padding:5px 9px; border-radius:999px; border:1px solid var(--line); background:var(--card)}

    /* Audio visualizer */
    .vizWrap{
      padding:10px;
      border-top:1px solid var(--line);
      background: color-mix(in srgb, var(--bg) 80%, transparent);
      display:none;
    }
    .vizWrap.show{display:block}
    canvas{width:100%; height:80px; display:block}

    /* Footer */
    footer{padding:22px 16px; text-align:center; color:var(--muted); font-size:12px}

    /* Helpers */
    .hide{display:none !important}
  </style>
</head>
<body>

<header>
  <div class="wrap">
    <div class="topRow">
      <div class="brand" title="Repo suggestion: MeDiFlixHub">
        <span class="dot"></span>
        <div>
          <b>🎬 MeDiFlix Hub</b>
          <div class="small">Netflix-style • GitHub Pages • manifest.json</div>
        </div>
      </div>

      <div class="controls">
        <div class="inputs">
          <input id="q" placeholder="🔍 חיפוש לפי שם / תגיות / קטגוריה…" />
          <select id="type">
            <option value="all">🧩 הכל</option>
            <option value="video">🎬 וידאו</option>
            <option value="audio">🎧 אודיו</option>
            <option value="pdf">📚 PDF</option>
          </select>
          <select id="sort">
            <option value="new">🕒 חדש → ישן</option>
            <option value="old">⌛ ישן → חדש</option>
            <option value="az">🔤 א → ת</option>
            <option value="za">🔤 ת → א</option>
          </select>
        </div>

        <div class="inputs" style="justify-content:flex-end; flex:0 0 auto">
          <button id="themeBtn" class="primary">🌙 מצב כהה</button>
          <button id="reloadBtn">♻️ רענון</button>
        </div>
      </div>
    </div>

    <div class="status small" id="status">טוען…</div>
  </div>
</header>

<main class="wrap" id="main"></main>

<footer>
  ✨ העלה קבצים לתיקיית <span class="chip">/media</span> • וה-manifest יעדכן את האתר.
</footer>

<!-- Modal Player -->
<div class="modal" id="modal" aria-hidden="true">
  <div class="modalCard">
    <div class="modalTop">
      <div class="left">
        <b id="mTitle">—</b>
        <span id="mSub">—</span>
      </div>
      <div class="btns">
        <button id="prevBtn">⏮️ קודם</button>
        <button id="nextBtn" class="primary">הבא ⏭️</button>
        <button id="closeBtn">❌ סגור</button>
      </div>
    </div>

    <div class="modalBody">
      <div class="playerBox" id="playerBox"></div>
      <div class="vizWrap" id="vizWrap">
        <canvas id="viz"></canvas>
      </div>
    </div>

    <div class="modalBottom">
      <div class="tags" id="tagRow"></div>
      <div>
        <a id="openFile" href="#" target="_blank" rel="noopener">🔗 פתיחת קובץ</a>
        <span style="margin:0 10px;">•</span>
        <button id="clearProgressBtn">🧹 איפוס “המשך צפייה”</button>
      </div>
    </div>
  </div>
</div>

<script>
  /*********************
   * CONFIG
   *********************/
  const MANIFEST_URL = "./manifest.json"; // placed in /site
  const LS_THEME = "mfh_theme_v1";
  const LS_PROGRESS = "mfh_progress_v1"; // { [key]: {t,d,updated} }
  const RECENT_LIMIT = 18;
  const CONTINUE_LIMIT = 12;

  // Demo fallback (works even without manifest.json)
  const DEMO = {
    spec: "media_manifest_v1",
    generated_at: Math.floor(Date.now()/1000),
    items: [
      {
        type:"video",
        path:"media/videos/lesson01.mp4",
        url:"../media/videos/lesson01.mp4",
        title:"Lesson 01 – Awakening",
        description:"Opening session",
        tags:["intro","light"],
        thumb:"../media/thumbs/lesson01.jpg",
        mtime: 1736040000
      },
      {
        type:"pdf",
        path:"media/pdfs/slides01.pdf",
        url:"../media/pdfs/slides01.pdf",
        title:"Slides – Chapter 01",
        description:"PDF presentation",
        tags:["slides","chapter1"],
        thumb:"../media/thumbs/slides01.jpg",
        mtime: 1736042000
      },
      {
        type:"audio",
        path:"media/audio/track01.mp3",
        url:"../media/audio/track01.mp3",
        title:"Audio – Focus Flow",
        description:"Playlist starter",
        tags:["audio","focus"],
        thumb:"../media/thumbs/track01.jpg",
        mtime: 1736043000
      }
    ]
  };

  /*********************
   * STATE
   *********************/
  let rawItems = [];
  let viewItems = [];     // after filter/sort
  let categories = new Map(); // category -> items
  let currentIndex = -1;  // index within viewItems
  let currentItem = null;

  /*********************
   * EL
   *********************/
  const elStatus = document.getElementById("status");
  const elMain = document.getElementById("main");
  const elQ = document.getElementById("q");
  const elType = document.getElementById("type");
  const elSort = document.getElementById("sort");
  const elThemeBtn = document.getElementById("themeBtn");
  const elReloadBtn = document.getElementById("reloadBtn");

  const elModal = document.getElementById("modal");
  const elPlayerBox = document.getElementById("playerBox");
  const elMTitle = document.getElementById("mTitle");
  const elMSub = document.getElementById("mSub");
  const elTagRow = document.getElementById("tagRow");
  const elOpenFile = document.getElementById("openFile");

  const elPrevBtn = document.getElementById("prevBtn");
  const elNextBtn = document.getElementById("nextBtn");
  const elCloseBtn = document.getElementById("closeBtn");
  const elClearProgressBtn = document.getElementById("clearProgressBtn");

  const elVizWrap = document.getElementById("vizWrap");
  const elViz = document.getElementById("viz");

  /*********************
   * UTILS
   *********************/
  const icon = t => t==="video"?"🎬":t==="audio"?"🎧":"📚";
  const safe = s => (s ?? "").toString();
  const fileName = p => safe(p).split("/").pop();
  const humanDate = (sec) => sec ? new Date(sec*1000).toLocaleString("he-IL") : "—";
  const norm = (s) => safe(s).toLowerCase().trim();

  function categoryFromPath(p){
    // media/videos/season1/ep01.mp4 -> videos / season1
    const parts = safe(p).split("/").filter(Boolean);
    const idx = parts.indexOf("media");
    const after = idx>=0 ? parts.slice(idx+1) : parts;
    if(after.length<=1) return "כללי";
    // exclude filename
    return after.slice(0, after.length-1).join(" / ");
  }

  function buildKey(item){
    // unique progress key
    return safe(item.path || item.url || fileName(item.path));
  }

  function readProgress(){
    try{ return JSON.parse(localStorage.getItem(LS_PROGRESS) || "{}"); }
    catch{ return {}; }
  }

  function writeProgress(obj){
    localStorage.setItem(LS_PROGRESS, JSON.stringify(obj));
  }

  function setProgress(item, t, d){
    const key = buildKey(item);
    const prog = readProgress();
    prog[key] = { t: Math.max(0, t||0), d: Math.max(0, d||0), updated: Date.now() };
    writeProgress(prog);
  }

  function getProgress(item){
    const prog = readProgress();
    return prog[buildKey(item)] || null;
  }

  function clearProgress(item){
    const prog = readProgress();
    delete prog[buildKey(item)];
    writeProgress(prog);
  }

  function applyTheme(theme){
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(LS_THEME, theme);
    elThemeBtn.textContent = theme==="light" ? "🌙 מצב כהה" : "☀️ מצב בהיר";
  }

  function initTheme(){
    const theme = localStorage.getItem(LS_THEME) || "dark";
    applyTheme(theme);
  }

  /*********************
   * DATA LOAD
   *********************/
  async function loadManifest(){
    elStatus.textContent = "טוען manifest.json…";
    try{
      const r = await fetch(MANIFEST_URL, { cache:"no-store" });
      if(!r.ok) throw new Error("manifest not found");
      const data = await r.json();
      rawItems = (data.items || []).map(enrichItem);
      elStatus.textContent = `✅ נטענו ${rawItems.length} פריטים מה-manifest`;
    }catch{
      rawItems = (DEMO.items || []).map(enrichItem);
      elStatus.textContent = `⚠️ לא נמצא manifest.json — מוצגת דוגמה (${rawItems.length} פריטים). העלה קבצים + צור manifest כדי לעבוד אמיתי.`;
    }
  }

  function enrichItem(x){
    const item = { ...x };
    item.type = item.type || guessType(item.path || item.url);
    item.title = item.title || fileName(item.path);
    item.description = item.description || "";
    item.tags = Array.isArray(item.tags) ? item.tags : [];
    item.thumb = item.thumb || "";
    item.category = item.category || categoryFromPath(item.path || "");
    item.mtime = item.mtime || 0;
    return item;
  }

  function guessType(p){
    const s = safe(p).toLowerCase();
    if(s.endsWith(".mp4")||s.endsWith(".webm")||s.endsWith(".mov")||s.endsWith(".m4v")) return "video";
    if(s.endsWith(".mp3")||s.endsWith(".wav")||s.endsWith(".ogg")||s.endsWith(".m4a")||s.endsWith(".flac")) return "audio";
    if(s.endsWith(".pdf")) return "pdf";
    return "video";
  }

  /*********************
   * FILTER / SORT / GROUP
   *********************/
  function computeView(){
    const q = norm(elQ.value);
    const t = elType.value;
    const sort = elSort.value;

    viewItems = rawItems.filter(it=>{
      if(t!=="all" && it.type!==t) return false;
      if(!q) return true;
      const hay = [
        it.title, it.description, it.category,
        it.path, (it.tags||[]).join(" ")
      ].map(norm).join(" | ");
      return hay.includes(q);
    });

    if(sort==="new") viewItems.sort((a,b)=>(b.mtime||0)-(a.mtime||0));
    if(sort==="old") viewItems.sort((a,b)=>(a.mtime||0)-(b.mtime||0));
    if(sort==="az")  viewItems.sort((a,b)=> safe(a.title).localeCompare(safe(b.title), "he"));
    if(sort==="za")  viewItems.sort((a,b)=> safe(b.title).localeCompare(safe(a.title), "he"));

    categories = new Map();
    for(const it of viewItems){
      const cat = it.category || "כללי";
      if(!categories.has(cat)) categories.set(cat, []);
      categories.get(cat).push(it);
    }
  }

  /*********************
   * RENDER
   *********************/
  function render(){
    computeView();

    const continueList = getContinueWatchingList();
    const recentList = [...viewItems].sort((a,b)=>(b.mtime||0)-(a.mtime||0)).slice(0, RECENT_LIMIT);

    elMain.innerHTML = `
      ${renderSection("▶️ המשך צפייה", "Continue Watching", continueList, true)}
      ${renderSection("🆕 נוסף לאחרונה", "Recently Added", recentList, false)}
      ${renderCategories()}
    `;

    attachCardClicks();
  }

  function renderSection(title, sub, list, showProgress){
    if(!list.length) return `
      <div class="sectionTitle">
        <h2>${title}</h2>
        <div class="chips"><span class="chip">${sub}</span></div>
      </div>
      <div class="small" style="color:var(--muted);padding:6px 0 10px;">אין פריטים להצגה כאן כרגע.</div>
    `;

    return `
      <div class="sectionTitle">
        <h2>${title}</h2>
        <div class="chips">
          <span class="chip">${sub}</span>
          <span class="chip">📦 ${list.length}</span>
        </div>
      </div>
      <div class="rail">
        ${list.map(it => renderCard(it, showProgress)).join("")}
      </div>
    `;
  }

  function renderCategories(){
    if(!categories.size) return `
      <div class="sectionTitle">
        <h2>📁 קטגוריות</h2>
        <div class="chips"><span class="chip">No results</span></div>
      </div>
    `;

    const html = [];
    for(const [cat, list] of categories.entries()){
      html.push(`
        <div class="sectionTitle">
          <h2>📁 ${escapeHtml(cat)}</h2>
          <div class="chips">
            <span class="chip">📦 ${list.length}</span>
            <span class="chip">🔎 תואם פילטרים</span>
          </div>
        </div>
        <div class="rail">
          ${list.map(it => renderCard(it, true)).join("")}
        </div>
      `);
    }
    return html.join("");
  }

  function renderCard(it, showProgress){
    const p = getProgress(it);
    const percent = (p && p.d>0) ? Math.min(100, Math.floor((p.t/p.d)*100)) : 0;

    const badge = `${icon(it.type)} ${it.type.toUpperCase()}`;
    const thumbHtml = it.thumb
      ? `<img src="${escapeAttr(it.thumb)}" alt="${escapeAttr(it.title)}" onerror="this.remove()" />`
      : "";

    const progressHtml = showProgress && p && p.d>0
      ? `<div class="progressBar" style="display:block"><i style="width:${percent}%"></i></div>`
      : `<div class="progressBar"></div>`;

    return `
      <div class="card" data-key="${escapeAttr(buildKey(it))}">
        <div class="thumb">
          ${thumbHtml}
          <div class="badge">${badge}</div>
          ${progressHtml}
        </div>
        <div class="meta">
          <div class="title">${escapeHtml(it.title)}</div>
          <div class="desc">${escapeHtml(it.description || "")}</div>
          <div class="row">
            <span class="pill">🗓️ ${humanDate(it.mtime)}</span>
            <span class="pill">📂 ${escapeHtml(it.category || "כללי")}</span>
          </div>
        </div>
      </div>
    `;
  }

  function attachCardClicks(){
    document.querySelectorAll(".card").forEach(card=>{
      card.addEventListener("click", ()=>{
        const key = card.getAttribute("data-key");
        const idx = viewItems.findIndex(x => buildKey(x) === key);
        openAtIndex(idx >= 0 ? idx : 0);
      });
    });
  }

  /*********************
   * CONTINUE WATCHING
   *********************/
  function getContinueWatchingList(){
    const prog = readProgress();
    const keys = Object.keys(prog);

    const mapped = keys.map(k=>{
      const it = rawItems.find(x => buildKey(x) === k);
      if(!it) return null;
      return { it, updated: prog[k].updated || 0, t: prog[k].t || 0, d: prog[k].d || 0 };
    }).filter(Boolean);

    // keep only meaningful progress (avoid near-zero)
    const meaningful = mapped.filter(x => x.d > 30 && x.t > 2 && x.t < (x.d - 2));

    meaningful.sort((a,b)=> (b.updated||0)-(a.updated||0));
    return meaningful.slice(0, CONTINUE_LIMIT).map(x=> x.it);
  }

  /*********************
   * MODAL PLAYER
   *********************/
  function openAtIndex(idx){
    if(!viewItems.length) return;
    currentIndex = Math.max(0, Math.min(viewItems.length-1, idx));
    currentItem = viewItems[currentIndex];
    openItem(currentItem);
  }

  function openItem(it){
    // header
    elMTitle.textContent = it.title || fileName(it.path);
    elMSub.textContent = `${icon(it.type)} ${it.type.toUpperCase()} • 📂 ${it.category || "כללי"} • 🗓️ ${humanDate(it.mtime)}`;
    elOpenFile.href = it.url || it.embed || "#";

    // tags
    const tags = [...(it.tags||[])].slice(0, 14);
    elTagRow.innerHTML = tags.length ? tags.map(t=>`<span class="tag">🏷️ ${escapeHtml(t)}</span>`).join("") : `<span class="tag">🏷️ ללא תגיות</span>`;

    // body
    elPlayerBox.innerHTML = "";
    elVizWrap.classList.remove("show");
    stopAudioViz();

    if(it.type === "video"){
      const v = document.createElement("video");
      v.controls = true;
      v.preload = "metadata";
      v.src = it.url || "";
      v.playsInline = true;

      // resume
      const p = getProgress(it);
      v.addEventListener("loadedmetadata", ()=>{
        if(p && p.t>0 && p.t < v.duration-2) v.currentTime = p.t;
      });

      // save progress
      v.addEventListener("timeupdate", ()=>{
        if(!v.duration || !isFinite(v.duration)) return;
        setProgress(it, v.currentTime, v.duration);
      });

      elPlayerBox.appendChild(v);
    }

    if(it.type === "audio"){
      const a = document.createElement("audio");
      a.controls = true;
      a.preload = "metadata";
      a.src = it.url || "";

      const p = getProgress(it);
      a.addEventListener("loadedmetadata", ()=>{
        if(p && p.t>0 && p.t < a.duration-2) a.currentTime = p.t;
        startAudioViz(a);
      });

      a.addEventListener("play", ()=> startAudioViz(a));
      a.addEventListener("pause", ()=> stopAudioViz());
      a.addEventListener("ended", ()=> stopAudioViz());

      a.addEventListener("timeupdate", ()=>{
        if(!a.duration || !isFinite(a.duration)) return;
        setProgress(it, a.currentTime, a.duration);
      });

      elPlayerBox.appendChild(a);
      elVizWrap.classList.add("show");
    }

    if(it.type === "pdf"){
      const f = document.createElement("iframe");
      // FitH is supported by many PDF viewers; still ok if ignored.
      f.src = (it.url || "") + "#view=FitH";
      f.title = it.title || "PDF";
      elPlayerBox.appendChild(f);

      // mark as opened (progress-like)
      setProgress(it, 1, 2); // minimal flag, so it can appear as "recently opened" if desired
    }

    // modal open
    elModal.classList.add("open");
    elModal.setAttribute("aria-hidden", "false");

    // buttons state
    elPrevBtn.disabled = currentIndex <= 0;
    elNextBtn.disabled = currentIndex >= viewItems.length-1;
  }

  function closeModal(){
    // stop media
    const v = elPlayerBox.querySelector("video");
    const a = elPlayerBox.querySelector("audio");
    if(v) v.pause();
    if(a) a.pause();
    stopAudioViz();

    elModal.classList.remove("open");
    elModal.setAttribute("aria-hidden", "true");
    elPlayerBox.innerHTML = "";
    elVizWrap.classList.remove("show");
  }

  /*********************
   * AUDIO VISUALIZER (basic)
   *********************/
  let audioCtx = null, analyser = null, srcNode = null, rafId = null;

  function startAudioViz(audioEl){
    try{
      if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if(audioCtx.state === "suspended") audioCtx.resume();

      // rebuild nodes safely
      stopAudioViz(true);

      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;

      srcNode = audioCtx.createMediaElementSource(audioEl);
      srcNode.connect(analyser);
      analyser.connect(audioCtx.destination);

      drawViz();
    }catch{
      // silent: visualizer is optional
    }
  }

  function stopAudioViz(keepCtx=false){
    if(rafId){ cancelAnimationFrame(rafId); rafId=null; }
    if(srcNode){
      try{ srcNode.disconnect(); }catch{}
      srcNode=null;
    }
    if(analyser){
      try{ analyser.disconnect(); }catch{}
      analyser=null;
    }
    if(!keepCtx && audioCtx){
      // keep context to avoid re-init issues; no hard close
    }
  }

  function drawViz(){
    if(!analyser) return;
    const c = elViz;
    const ctx = c.getContext("2d");
    const rect = c.getBoundingClientRect();
    c.width = Math.max(600, Math.floor(rect.width));
    c.height = 90;

    const data = new Uint8Array(analyser.frequencyBinCount);

    const loop = ()=>{
      if(!analyser) return;
      analyser.getByteFrequencyData(data);

      ctx.clearRect(0,0,c.width,c.height);

      const bars = 72;
      const step = Math.floor(data.length / bars);
      const w = c.width / bars;

      for(let i=0;i<bars;i++){
        const v = data[i*step] / 255;
        const h = Math.max(4, v * (c.height-10));
        const x = i*w + 2;
        const y = c.height - h;

        // no fixed colors: use theme variables via computed style
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#6be7ff";
        ctx.globalAlpha = 0.18 + v * 0.75;
        ctx.fillRect(x, y, Math.max(2, w-4), h);
      }
      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  /*********************
   * ESCAPE HELPERS
   *********************/
  function escapeHtml(s){
    return safe(s)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }
  function escapeAttr(s){ return escapeHtml(s); }

  /*********************
   * EVENTS
   *********************/
  elReloadBtn.addEventListener("click", async ()=>{
    await boot();
  });

  elThemeBtn.addEventListener("click", ()=>{
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(cur === "dark" ? "light" : "dark");
  });

  [elQ, elType, elSort].forEach(el=>{
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });

  elCloseBtn.addEventListener("click", closeModal);
  elModal.addEventListener("click", (e)=>{
    if(e.target === elModal) closeModal();
  });
  window.addEventListener("keydown", (e)=>{
    if(!elModal.classList.contains("open")) return;
    if(e.key === "Escape") closeModal();
    if(e.key === "ArrowLeft") goPrev();
    if(e.key === "ArrowRight") goNext();
  });

  function goPrev(){
    if(currentIndex <= 0) return;
    openAtIndex(currentIndex - 1);
  }
  function goNext(){
    if(currentIndex >= viewItems.length-1) return;
    openAtIndex(currentIndex + 1);
  }

  elPrevBtn.addEventListener("click", goPrev);
  elNextBtn.addEventListener("click", goNext);

  elClearProgressBtn.addEventListener("click", ()=>{
    if(!currentItem) return;
    clearProgress(currentItem);
    render();
    openItem(currentItem); // refresh progress bar state
  });

  /*********************
   * BOOT
   *********************/
  async function boot(){
    initTheme();
    await loadManifest();
    render();
  }

  boot();
</script>
</body>
</html>
```

---

## 🧾 קרדיטים (מערכת/טכנולוגיות)

* 🧩 HTML5 Media (Video/Audio)
* 📚 PDF Viewer (iframe)
* 🎛️ WebAudio API (Visualizer)
* 💾 LocalStorage (Continue Watching + Theme)
* 🧱 GitHub Pages + (אופציונלי) GitHub Actions ל-manifest

---

## 🎤🔥 4 שורות ראפ (על ה־MeDiFlix Hub)

🎬 מעלה למאגר — והמסך כבר דופק,
📚 שקפים רצים — כל פריים פה מתדלק,
🎧 וייב בגלים — הפלייליסט מתהדק,
⚡ קליק על כרטיס — והלב מתעורר חזק!

---

## 📏 מספר המידות

**12 מידות**

---

## 🕯️ משפט מהמאגרי קודש (מתאים לתוכן)

**"כִּי נֵר מִצְוָה וְתוֹרָה אוֹר"** (משלי ו׳, כ״ג)

---

אם תרצה עכשיו את ה”אוטומציה” שמייצרת `manifest.json` לבד בכל Push (GitHub Actions) — תגיד “תן את ה-Action”, ואני מדביק לך את ה-YAML + סקריפט יצירה.
