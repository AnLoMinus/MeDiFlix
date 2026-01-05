// אתר MeDiFlix Hub — JavaScript ראשי (RTL + תמיכה מלאה ב-manifest ובסריקה אוטומטית של המאגר)
const MANIFEST_URL = "./manifest.json";
const VERSION_URL = "./VERSION";
const LS_THEME = "mfh_theme_v1";
const LS_PROGRESS = "mfh_progress_v1";
const RECENT_LIMIT = 18;
const CONTINUE_LIMIT = 12;
const MAX_SCAN_DEPTH = 3;

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

let rawItems = [];
let viewItems = [];
let categories = new Map();
let currentIndex = -1;
let currentItem = null;
let repoContext = null;
const mtimeCache = new Map();

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  captureEls();
  initTheme();
  initEvents();
  renderVersionTag();
  boot();
});

function captureEls(){
  els.status = document.getElementById("status");
  els.main = document.getElementById("main");
  els.q = document.getElementById("q");
  els.type = document.getElementById("type");
  els.sort = document.getElementById("sort");
  els.themeBtn = document.getElementById("themeBtn");
  els.reloadBtn = document.getElementById("reloadBtn");
  els.version = document.getElementById("versionBadge");

  els.modal = document.getElementById("modal");
  els.playerBox = document.getElementById("playerBox");
  els.mTitle = document.getElementById("mTitle");
  els.mSub = document.getElementById("mSub");
  els.tagRow = document.getElementById("tagRow");
  els.openFile = document.getElementById("openFile");

  els.prevBtn = document.getElementById("prevBtn");
  els.nextBtn = document.getElementById("nextBtn");
  els.closeBtn = document.getElementById("closeBtn");
  els.clearProgressBtn = document.getElementById("clearProgressBtn");

  els.vizWrap = document.getElementById("vizWrap");
  els.viz = document.getElementById("viz");
}

function icon(t){ return t==="video"?"🎬":t==="audio"?"🎧":"📚"; }
const safe = s => (s ?? "").toString();
const fileName = p => safe(p).split("/").pop();
const humanDate = (sec) => sec ? new Date(sec*1000).toLocaleString("he-IL") : "—";
const norm = (s) => safe(s).toLowerCase().trim();

function categoryFromPath(p){
  const parts = safe(p).split("/").filter(Boolean);
  const idx = parts.indexOf("media");
  const after = idx>=0 ? parts.slice(idx+1) : parts;
  if(after.length<=1) return "כללי";
  return after.slice(0, after.length-1).join(" / ");
}

function buildKey(item){
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
  els.themeBtn.textContent = theme==="light" ? "🌙 מצב כהה" : "☀️ מצב בהיר";
}

function initTheme(){
  const theme = localStorage.getItem(LS_THEME) || "dark";
  applyTheme(theme);
}

async function renderVersionTag(){
  if(!els.version) return;
  try{
    const r = await fetch(VERSION_URL, { cache:"no-store" });
    if(!r.ok) throw new Error("no version");
    const txt = (await r.text()).trim();
    els.version.textContent = txt ? `גרסה ${txt}` : "גרסה לא ידועה";
  }catch{
    els.version.textContent = "גרסת פיתוח";
  }
}

async function loadManifest(){
  els.status.textContent = "טוען manifest.json…";
  try{
    const r = await fetch(MANIFEST_URL, { cache:"no-store" });
    if(!r.ok) throw new Error("manifest not found");
    const data = await r.json();
    rawItems = (data.items || []).map(enrichItem);
    if(rawItems.length){
      els.status.textContent = `✅ נטענו ${rawItems.length} פריטים מה-manifest`;
      await mergeDiscoveredMedia();
      return;
    }
    throw new Error("manifest empty");
  }catch{
    els.status.textContent = "⚙️ לא נמצא manifest.json — מבצע סריקה אוטומטית במאגר…";
    await autoDiscoverMedia();
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
  item.url = item.url || (item.path ? `./${encodeURI(item.path)}` : "");
  return item;
}

function guessType(p){
  const s = safe(p).toLowerCase();
  if(s.endsWith(".mp4")||s.endsWith(".webm")||s.endsWith(".mov")||s.endsWith(".m4v")) return "video";
  if(s.endsWith(".mp3")||s.endsWith(".wav")||s.endsWith(".ogg")||s.endsWith(".m4a")||s.endsWith(".flac")) return "audio";
  if(s.endsWith(".pdf")) return "pdf";
  return "video";
}

function computeView(){
  const q = norm(els.q.value);
  const t = els.type.value;
  const sort = els.sort.value;

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

function render(){
  computeView();

  const continueList = getContinueWatchingList();
  const recentList = [...viewItems].sort((a,b)=>(b.mtime||0)-(a.mtime||0)).slice(0, RECENT_LIMIT);

  els.main.innerHTML = `
    ${renderSection("▶️ המשך צפייה", "Continue Watching", continueList, true)}
    ${renderSection("🆕 נוסף לאחרונה", "Recently Added", recentList, false)}
    ${renderCategories()}
    ${renderHowTo()}
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

function renderHowTo(){
  return `
    <div class="howto">
      <h3>📥 איך מוסיפים מדיה חדשה?</h3>
      <ol>
        <li>גררו קובצי וידאו / אודיו / PDF אל התיקייה <strong>media/</strong> (או אפילו לשורש המאגר).</li>
        <li>אופציונלי: הוסיפו תמונה תואמת בשם זהה תחת <strong>media/thumbs/</strong>.</li>
        <li>בצד ימין למעלה לחצו על <strong>♻️ רענון</strong> — האתר יסרוק אוטומטית את המאגר ויזהה את הקבצים.</li>
      </ol>
      <p class="small">הסריקה משתמשת ב-GitHub API אם אין manifest.json. רוצים ביצועים יציבים? שמרו manifest.json מעודכן ב-root.</p>
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

function getContinueWatchingList(){
  const prog = readProgress();
  const keys = Object.keys(prog);

  const mapped = keys.map(k=>{
    const it = rawItems.find(x => buildKey(x) === k);
    if(!it) return null;
    return { it, updated: prog[k].updated || 0, t: prog[k].t || 0, d: prog[k].d || 0 };
  }).filter(Boolean);

  const meaningful = mapped.filter(x => x.d > 30 && x.t > 2 && x.t < (x.d - 2));

  meaningful.sort((a,b)=> (b.updated||0)-(a.updated||0));
  return meaningful.slice(0, CONTINUE_LIMIT).map(x=> x.it);
}

function openAtIndex(idx){
  if(!viewItems.length) return;
  currentIndex = Math.max(0, Math.min(viewItems.length-1, idx));
  currentItem = viewItems[currentIndex];
  openItem(currentItem);
}

function openItem(it){
  els.mTitle.textContent = it.title || fileName(it.path);
  els.mSub.textContent = `${icon(it.type)} ${it.type.toUpperCase()} • 📂 ${it.category || "כללי"} • 🗓️ ${humanDate(it.mtime)}`;
  els.openFile.href = it.url || it.embed || "#";

  const tags = [...(it.tags||[])].slice(0, 14);
  els.tagRow.innerHTML = tags.length ? tags.map(t=>`<span class="tag">🏷️ ${escapeHtml(t)}</span>`).join("") : `<span class="tag">🏷️ ללא תגיות</span>`;

  els.playerBox.innerHTML = "";
  els.vizWrap.classList.remove("show");
  stopAudioViz();

  if(it.type === "video"){
    const v = document.createElement("video");
    v.controls = true;
    v.preload = "metadata";
    v.src = it.url || "";
    v.playsInline = true;

    const p = getProgress(it);
    v.addEventListener("loadedmetadata", ()=>{
      if(p && p.t>0 && p.t < v.duration-2) v.currentTime = p.t;
    });
    v.addEventListener("timeupdate", ()=>{
      if(!v.duration || !isFinite(v.duration)) return;
      setProgress(it, v.currentTime, v.duration);
    });

    els.playerBox.appendChild(v);
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

    els.playerBox.appendChild(a);
    els.vizWrap.classList.add("show");
  }

  if(it.type === "pdf"){
    const f = document.createElement("iframe");
    f.src = (it.url || "") + "#view=FitH";
    f.title = it.title || "PDF";
    els.playerBox.appendChild(f);
    setProgress(it, 1, 2);
  }

  els.modal.classList.add("open");
  els.modal.setAttribute("aria-hidden", "false");

  els.prevBtn.disabled = currentIndex <= 0;
  els.nextBtn.disabled = currentIndex >= viewItems.length-1;
}

function closeModal(){
  const v = els.playerBox.querySelector("video");
  const a = els.playerBox.querySelector("audio");
  if(v) v.pause();
  if(a) a.pause();
  stopAudioViz();

  els.modal.classList.remove("open");
  els.modal.setAttribute("aria-hidden", "true");
  els.playerBox.innerHTML = "";
  els.vizWrap.classList.remove("show");
}

let audioCtx = null, analyser = null, srcNode = null, rafId = null;

function startAudioViz(audioEl){
  try{
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if(audioCtx.state === "suspended") audioCtx.resume();

    stopAudioViz(true);

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;

    srcNode = audioCtx.createMediaElementSource(audioEl);
    srcNode.connect(analyser);
    analyser.connect(audioCtx.destination);

    drawViz();
  }catch{
    // visualizer optional
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
    // keep context warm
  }
}

function drawViz(){
  if(!analyser) return;
  const c = els.viz;
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

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#6be7ff";
      ctx.globalAlpha = 0.18 + v * 0.75;
      ctx.fillRect(x, y, Math.max(2, w-4), h);
    }
    ctx.globalAlpha = 1;

    rafId = requestAnimationFrame(loop);
  };
  loop();
}

function escapeHtml(s){
  return safe(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
function escapeAttr(s){ return escapeHtml(s); }

function initEvents(){
  els.reloadBtn.addEventListener("click", async ()=>{
    await boot(true);
  });

  els.themeBtn.addEventListener("click", ()=>{
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(cur === "dark" ? "light" : "dark");
  });

  [els.q, els.type, els.sort].forEach(el=>{
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });

  els.closeBtn.addEventListener("click", closeModal);
  els.modal.addEventListener("click", (e)=>{
    if(e.target === els.modal) closeModal();
  });
  window.addEventListener("keydown", (e)=>{
    if(!els.modal.classList.contains("open")) return;
    if(e.key === "Escape") closeModal();
    if(e.key === "ArrowLeft") goPrev();
    if(e.key === "ArrowRight") goNext();
  });

  els.prevBtn.addEventListener("click", goPrev);
  els.nextBtn.addEventListener("click", goNext);

  els.clearProgressBtn.addEventListener("click", ()=>{
    if(!currentItem) return;
    clearProgress(currentItem);
    render();
    openItem(currentItem);
  });
}

function goPrev(){
  if(currentIndex <= 0) return;
  openAtIndex(currentIndex - 1);
}
function goNext(){
  if(currentIndex >= viewItems.length-1) return;
  openAtIndex(currentIndex + 1);
}

async function boot(forceReload=false){
  repoContext = detectRepoContext();
  if(forceReload) rawItems = [];
  await loadManifest();
  render();
}

function detectRepoContext(){
  const attrOwner = document.body.getAttribute("data-repo-owner");
  const attrRepo = document.body.getAttribute("data-repo-name");
  if(attrOwner && attrRepo) return { owner: attrOwner, repo: attrRepo };

  const host = location.hostname || "";
  const pathParts = (location.pathname || "").split("/").filter(Boolean);
  if(host.endsWith(".github.io") && pathParts.length){
    return { owner: host.replace(".github.io",""), repo: pathParts[0] };
  }
  return null;
}

async function autoDiscoverMedia(){
  if(!repoContext){
    rawItems = (DEMO.items || []).map(enrichItem);
    els.status.textContent = `⚠️ מצב דמו — לא אותר הקשר GitHub. הוסיפו manifest.json או הגדירו data-repo-owner/name ב-body.`;
    return;
  }

  try{
    els.status.textContent = "🛰️ סורק קבצים חדשים דרך GitHub API…";
    const mediaFiles = await collectMediaFiles("", 0);

    if(!mediaFiles.length){
      rawItems = (DEMO.items || []).map(enrichItem);
      els.status.textContent = "⚠️ לא נמצאו קבצי מדיה במאגר — מוצגת דוגמה מובנית.";
      return;
    }

    const enriched = [];
    for(const f of mediaFiles){
      enriched.push(await fileToItem(f));
    }

    rawItems = enriched.map(enrichItem);
    els.status.textContent = `✅ זוהו אוטומטית ${rawItems.length} פריטים מתוך המאגר (ללא manifest).`;
  }catch(err){
    rawItems = (DEMO.items || []).map(enrichItem);
    els.status.textContent = `⚠️ סריקת GitHub נכשלה (${err?.message || "שגיאה"}). מוצגת תצוגת דמו.`;
  }
}

async function collectMediaFiles(path="", depth=0){
  if(depth > MAX_SCAN_DEPTH) return [];
  const out = [];
  const url = `https://api.github.com/repos/${repoContext.owner}/${repoContext.repo}/contents/${path}`;
  const res = await fetch(url, { headers:{ Accept:"application/vnd.github.v3+json" } });
  if(!res.ok) return out;
  const data = await res.json();
  for(const item of data){
    if(item.type === "dir"){
      if([".git",".github","assets","node_modules","dist","build"].includes(item.name)) continue;
      out.push(...await collectMediaFiles(item.path, depth+1));
    }else if(item.type === "file"){
      if(isMediaFile(item.name)){
        out.push({ name:item.name, path:item.path });
      }
    }
  }
  return out;
}

function isMediaFile(name){
  const n = safe(name).toLowerCase();
  return [".mp4",".webm",".mov",".m4v",".mp3",".wav",".ogg",".m4a",".flac",".pdf"].some(ext => n.endsWith(ext));
}

async function fileToItem(file){
  const mtime = await getLastModified(file.path);
  return {
    path: file.path,
    url: `./${encodeURI(file.path)}`,
    title: beautifyTitle(file.name),
    description: `קובץ מתוך המאגר (${file.path})`,
    tags: [],
    thumb: "",
    mtime
  };
}

async function getLastModified(path){
  if(mtimeCache.has(path)) return mtimeCache.get(path);
  if(!repoContext) return 0;
  const url = `https://api.github.com/repos/${repoContext.owner}/${repoContext.repo}/commits?path=${encodeURIComponent(path)}&per_page=1`;
  const res = await fetch(url, { headers:{ Accept:"application/vnd.github.v3+json" } });
  if(!res.ok){
    mtimeCache.set(path, 0);
    return 0;
  }
  const data = await res.json();
  const date = data?.[0]?.commit?.committer?.date || data?.[0]?.commit?.author?.date;
  const ts = date ? Math.floor(new Date(date).getTime()/1000) : 0;
  mtimeCache.set(path, ts);
  return ts;
}

function beautifyTitle(name){
  return safe(name)
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .trim() || name;
}

async function mergeDiscoveredMedia(){
  if(!repoContext) return;
  try{
    const discovered = await collectMediaFiles("", 0);
    const newOnes = discovered.filter(f=>{
      const p = safe(f.path).toLowerCase();
      return !rawItems.some(it => safe(it.path).toLowerCase() === p);
    });
    if(!newOnes.length) return;

    const extras = [];
    for(const f of newOnes){
      extras.push(await fileToItem(f));
    }
    rawItems.push(...extras.map(enrichItem));
    els.status.textContent += ` • נוספו ${extras.length} פריטים מסריקה אוטומטית`;
  }catch{
    // אם הסריקה נכשלת, ממשיכים עם manifest בלבד
  }
}
