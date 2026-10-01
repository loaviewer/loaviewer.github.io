// ===== 메인 진입점 및 탭 컨트롤러 (app.js) =====

// ===== 점검/장애 대비 캐시 =====
// PROXY로 나가는 GET 응답(/all, /siblings)을 IndexedDB에 저장해 두고,
// 서버가 실패하거나 응답이 비정상이면 저장본으로 대신 응답한다. (평소엔 항상 라이브 우선)
(function () {
  const DB_NAME = "loaview-cache", STORE = "res", TIMEOUT_MS = 8000;
  let dbp = null;

  function openDB() {
    if (!dbp) dbp = new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error("IndexedDB 미지원"));
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbp;
  }
  function idb(mode, fn) {
    return openDB().then(db => new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const r = fn(tx.objectStore(STORE));
      tx.oncomplete = () => resolve(r.result);
      tx.onerror = () => reject(tx.error);
    }));
  }
  const cacheGet = key => idb("readonly", s => s.get(key)).catch(() => null);
  const cachePut = (key, val) => idb("readwrite", s => s.put(val, key)).catch(() => {});
  const cacheKeys = () => idb("readonly", s => s.getAllKeys()).catch(() => []);

  // 점검 중 빈 응답이 정상 저장본을 덮어쓰지 않도록 내용 검증
  function isGood(url, text) {
    try {
      const d = JSON.parse(text);
      if (!d) return false;
      if (/\/all$/.test(url)) return !!d.ArmoryProfile;
      if (/\/siblings$/.test(url)) return Array.isArray(d.Siblings) && d.Siblings.length > 0;
      return true;
    } catch (e) { return false; }
  }

  window.__cacheHit = null;
  const origFetch = window.fetch.bind(window);
  window.fetch = async function (input, init) {
    const url = typeof input === "string" ? input : ((input && input.url) || "");
    const method = String((init && init.method) || (input && input.method) || "GET").toUpperCase();
    if (method !== "GET" || !window.PROXY || !url.startsWith(window.PROXY)) return origFetch(input, init);

    const cached = await cacheGet(url);
    let res = null, lastErr = null;
    try {
      let opts = init, timer = null;
      if (cached) {   // 저장본이 있을 때만 타임아웃 (점검 중 응답이 안 오는 경우 대비)
        const ctrl = new AbortController();
        timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
        opts = Object.assign({}, init, { signal: ctrl.signal });
      }
      try { res = await origFetch(input, opts); } finally { clearTimeout(timer); }
    } catch (e) { lastErr = e; }

    if (res && res.ok) {
      const text = await res.clone().text();
      if (isGood(url, text)) {
        cachePut(url, { t: Date.now(), body: text }).then(() => window.__refreshSavedNames && window.__refreshSavedNames());
        return res;
      }
    }
    if (cached) {
      window.__cacheHit = { url, t: cached.t };
      return new Response(cached.body, { status: 200, headers: { "Content-Type": "application/json" } });
    }
    if (res) return res;
    throw lastErr || new TypeError("network error");
  };

  // 최근 조회 순서 (캐시 본문을 읽지 않도록 이름/시각만 따로 저장)
  const RECENT_KEY = "loaview-recent", RECENT_MAX = 20;
  const readRecent = () => { try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch (e) { return []; } };
  window.__touchRecent = function (name) {
    try {
      const l = readRecent().filter(x => x.n !== name);
      l.unshift({ n: name, t: Date.now() });
      localStorage.setItem(RECENT_KEY, JSON.stringify(l.slice(0, RECENT_MAX)));
    } catch (e) {}
  };

  // 최근 검색 드롭다운 목록 갱신: 캐시에 실제로 있는 이름만, 최근 조회 순
  window.__refreshSavedNames = function () {
    const ul = document.getElementById("recentList");
    if (!ul) return;
    cacheKeys().then(keys => {
      const cached = new Set();
      keys.forEach(k => {
        const m = String(k).match(/\/character\/([^/]+)\/all$/);
        if (m) cached.add(decodeURIComponent(m[1]));
      });
      const names = readRecent().map(x => x.n).filter(n => cached.has(n));
      cached.forEach(n => { if (!names.includes(n)) names.push(n); }); // 기록 없는 기존 캐시도 포함
      ul.textContent = "";
      if (!names.length) {
        const li = document.createElement("li");
        li.className = "empty"; li.textContent = "최근 검색 기록이 없어요";
        ul.appendChild(li); return;
      }
      names.slice(0, RECENT_MAX).forEach(n => {
        const li = document.createElement("li");
        li.textContent = n; li.dataset.name = n; li.setAttribute("role", "option");
        ul.appendChild(li);
      });
    });
  };
  window.__refreshSavedNames();
})();


document.querySelectorAll(".eq-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".eq-tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".eq-tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    window.$((btn.dataset.tab === "av") ? "panelAv" : "panelEq").classList.add("active");
  });
});

const q = window.$("q"), btn = window.$("btn"), statusEl = window.$("status"), mainEl = window.$("main");
const skillPanelEl = window.$("skillPanel"), arkgridPanelEl = window.$("arkgridPanel");
const arkpassivePanelEl = window.$("arkpassivePanel"), expeditionPanelEl = window.$("expeditionPanel");

// ===== 최근 검색 드롭다운 =====
const recentBtn = window.$("recentBtn"), recentList = window.$("recentList");
function setRecent(open) {
  recentList.hidden = !open;
  recentBtn.classList.toggle("open", open);
  recentBtn.setAttribute("aria-expanded", String(open));
  if (open) window.__refreshSavedNames();
}
recentBtn.addEventListener("click", e => { e.stopPropagation(); setRecent(recentList.hidden); });
recentList.addEventListener("click", e => {
  const li = e.target.closest("li[data-name]");
  if (!li) return;
  setRecent(false);
  q.value = li.dataset.name;
  go(q.value);
});
document.addEventListener("click", e => { if (!e.target.closest("#recent")) setRecent(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape") setRecent(false); });

if (skillPanelEl) mainEl.querySelectorAll(".col")[1].appendChild(skillPanelEl);
if (arkgridPanelEl) mainEl.querySelectorAll(".col")[1].appendChild(arkgridPanelEl);
if (arkpassivePanelEl) mainEl.querySelectorAll(".col")[1].appendChild(arkpassivePanelEl);
if (expeditionPanelEl) mainEl.querySelectorAll(".col")[1].appendChild(expeditionPanelEl);

let currentTab = "info";
let dataLoaded = false;

function applyTabView() {
  mainEl.classList.toggle("show", dataLoaded && ["info","stat","skill","arkgrid","arkpassive","expedition"].includes(currentTab));
  mainEl.classList.toggle("skill-mode", ["skill","arkgrid","arkpassive","expedition"].includes(currentTab));
  if (skillPanelEl) skillPanelEl.style.display = (dataLoaded && currentTab === "skill") ? "flex" : "none";
  if (arkgridPanelEl) arkgridPanelEl.style.display = (dataLoaded && currentTab === "arkgrid") ? "flex" : "none";
  if (arkpassivePanelEl) arkpassivePanelEl.style.display = (dataLoaded && currentTab === "arkpassive") ? "flex" : "none";
  if (expeditionPanelEl) expeditionPanelEl.style.display = (dataLoaded && currentTab === "expedition") ? "flex" : "none";
}

document.querySelectorAll(".char-tab").forEach(btn2 => {
  btn2.addEventListener("click", () => {
    document.querySelectorAll(".char-tab").forEach(b => b.classList.remove("active"));
    btn2.classList.add("active");
    currentTab = btn2.dataset.tab;
    if (currentTab === "info") setEffPanelOpen(false);
    else if (currentTab === "stat") setEffPanelOpen(true);
    applyTabView();
    if (currentTab === "expedition") loadExpedition();
  });
});

btn.addEventListener("click", () => go(q.value.trim()));
q.addEventListener("keydown", e => { if (e.key === "Enter") go(q.value.trim()); });

let __reqSeq = 0;

async function go(name) {
  if (!name) return;
  const mySeq = ++__reqSeq;
  btn.disabled = true;
  statusEl.className = "status show";
  statusEl.innerHTML = `<span class="spin"></span>조회 중...`;
  statusEl.style.padding = "";
  window.__cacheHit = null;
  mainEl.classList.remove("show");
  try {
    const res = await fetch(`${window.PROXY}/character/${encodeURIComponent(name)}/all`);
    if (!res.ok) throw new Error(res.status === 404 ? "캐릭터를 찾을 수 없습니다" : `조회 실패 (${res.status})`);
    const data = await res.json();
    if (!data?.ArmoryProfile) throw new Error("캐릭터 데이터가 비어 있습니다");
    if (mySeq !== __reqSeq) return;
    render(data);
    window.__touchRecent(name);
    window.__refreshSavedNames();
    if (window.__cacheHit && /\/all$/.test(window.__cacheHit.url)) {
      const when = new Date(window.__cacheHit.t).toLocaleString("ko-KR", { hour12: false });
      statusEl.className = "status show";
      statusEl.style.padding = "10px 16px";
      statusEl.textContent = `⚠ 서버에 연결할 수 없어 저장된 데이터를 표시 중입니다 (저장 시각: ${when})`;
    } else {
      statusEl.className = "status";
    }
    dataLoaded = true;
    currentTab = "info";
    document.querySelectorAll(".char-tab").forEach(b => b.classList.toggle("active", b.dataset.tab === "info"));
    applyTabView();
    history.replaceState(null, "", `?name=${encodeURIComponent(name)}`);
  } catch (err) {
    if (mySeq !== __reqSeq) return;
    dataLoaded = false;   // 실패 시 이전 캐릭터 데이터가 탭 전환으로 다시 노출되지 않도록
    applyTabView();
    statusEl.className = "status show err";
    statusEl.textContent = err.message || "조회 실패";
  } finally {
    if (mySeq === __reqSeq) btn.disabled = false;
  }
}

// ===== 칭호 → 등급 클래스 (API는 칭호 등급을 주지 않아 이름으로 매핑) =====
const TITLE_GRADE = (() => {
  const m = new Map();
  const add = (cls, arr) => arr.forEach(t => m.set(t.toLowerCase().replace(/\s+/g, " ").trim(), cls));
  add("tg-legend", [
    "심연의 군주","이클립스","광기의 그림자","마수의 포효","쾌락의 탐닉자",
    "광기군단장 슬레이어","마수군단장 슬레이어","몽환군단장 슬레이어","악마 사냥꾼","욕망군단장 슬레이어",
    "광풍의 눈","대지를 분쇄하는","돌로리스","번뇌의 창","분노의 포식자","빛의 날개","찬란하게 빛나는",
    "천둥을 내리꽂는","크로체","푸른 갈기","혹한의 군주","홍염의 군주",
    "S1 낙원의 선봉대","S1 낙원의 정복자","S1 낙원의 주인",
    "S2 낙원의 선봉대","S2 낙원의 정복자","S2 낙원의 주인",
    "S3 낙원의 선봉대","S3 낙원의 정복자","S3 낙원의 주인",
    "21년 최고의 금손","22년 최고의 금손","23년 최고의 금손","24년 최고의 금손","25년 최고의 금손","삼라만상",
    "기분 좋은 향기","모코코 사냥꾼","미술품 애호가","생활의 달인","서풍의 지휘자","일등 항해사","아크라시아의 순례자","영혼의 공명"
  ]);
  add("tg-relic", [
    "죽음을 부르는 자","카멘 The 1st","카멘 The 2nd","카멘 The 3rd","카멘 The TOP10",
    "광풍의 슬레이어","날개를 꺾은 자","뇌룡을 정복한 자","벨가누스 슬레이어","아카테스 슬레이어",
    "엘버하스틱 슬레이어","이그렉시온 슬레이어","몽환의 지배자"
  ]);
  add("tg-ancient", ["카제로스 The 1st","카제로스 The 2nd","카제로스 The 3rd","카제로스 The TOP10"]);
  add("tg-esther", ["에스더의 결속자","에스더의 후계자"]);
  add("tg-thunder", ["뇌전의 군주"]);   // 전설 목록과 겹치므로 마지막에 덮어씀
  return m;
})();
// 전투력 구간 → 배경 등급 (2800 미만은 효과 없음)
function powerTier(v) {
  const t = [[9800,"esther"],[8800,"ancient"],[7800,"relic"],[6800,"legend"],[5800,"epic"],[4800,"rare"],[3800,"uncommon"],[2800,"copper"]];
  for (const [min, name] of t) if (v >= min) return name;
  return "";
}
function titleGradeClass(title) {
  const key = String(title || "").toLowerCase().replace(/\s+/g, " ").trim();
  return TITLE_GRADE.get(key) || "tg-default";
}

function render(data) {
  window.__fullData = data;
  window.__charClass = "";
  window.__mungaLv = 0; window.__eumLv = 0; window.__ipsikLv = 0; window.__manaLv = 0;
  window.__activeEvoNode = null;
  window.__backAtk10Checked = false; window.__janbulChecked = false;
  window.__effOpen = false; window.__identityBuff = null; window.__dolDaeRate = null;
  window.__engData = null; window.__evoEffects = null; window.__evoSum = null;
  window.__skillsData = []; window.__expeditionLoadedFor = "";

  const p = data.ArmoryProfile;
  const art = window.$("art"); art.innerHTML = "";
  if (p.CharacterImage) { const i = document.createElement("img"); i.src = p.CharacterImage; i.alt = p.CharacterName || ""; i.loading = "lazy"; art.appendChild(i); }
  // 전투력 구간별 배경 효과
  const cpNum = parseFloat(String(p.CombatPower || "0").replace(/,/g, "")) || 0;
  const tier = powerTier(cpNum);
  art.className = "profile-art";
  const card = art.closest(".profile");
  if (card) card.className = "box profile" + (tier ? " pw-" + tier : "");   // 카드 테두리/빛에 등급색 적용

  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const info = el("div", "art-info");
  const apTitle = data.ArkPassive?.Title;
  info.appendChild(el("div", "art-class", `Lv. ${p.CharacterLevel ?? "-"} ${p.CharacterClassName || ""}${apTitle ? " #" + apTitle : ""}`));
  info.appendChild(el("div", "art-name", p.CharacterName || "-"));
  const nums = el("div", "art-nums");
  const r1 = el("div", "art-num art-ilvl"); r1.appendChild(el("i", "", "💠")); r1.appendChild(el("b", "", p.ItemAvgLevel || "-"));
  const r2 = el("div", "art-num art-cp"); r2.appendChild(el("i", "", "⚔️")); r2.appendChild(el("b", "", p.CombatPower || "-"));
  nums.appendChild(r1); nums.appendChild(r2);
  info.appendChild(nums);
  art.appendChild(info);

  const rows = el("div", "art-rows");
  const addRow = (label, value, cls) => {
    const r = el("div", "art-row");
    r.appendChild(el("span", "art-k", label));
    r.appendChild(el("span", "art-v" + (cls ? " " + cls : ""), value));
    rows.appendChild(r);
  };
  addRow("서버", p.ServerName || "-");
  addRow("원정대", p.ExpeditionLevel != null ? "Lv." + p.ExpeditionLevel : "-");
  addRow("칭호", p.Title || "-", p.Title ? titleGradeClass(p.Title) : "");
  addRow("길드", p.GuildName || "-", p.GuildName ? "art-guild" : "");
  addRow("PVP", p.PvpGradeName || "-");
  addRow("영지", p.TownName ? `Lv.${p.TownLevel ?? "-"} ${p.TownName}` : "-");
  art.appendChild(rows);
  window.$("pName").textContent = p.CharacterName || "-";
  window.$("pClass").textContent = [p.CharacterClassName, data.ArkPassive?.Title].filter(Boolean).join(" · ") || "-";
  window.__charClass = p.CharacterClassName || "";
  window.$("pServer").textContent = p.ServerName || "-";
  window.$("pGuild").textContent = p.GuildName || "-";
  window.$("pLevel").textContent = p.CharacterLevel ?? "-";
  window.$("pExp").textContent = p.ExpeditionLevel ?? "-";
  window.$("pItem").textContent = p.ItemAvgLevel || "-";
  const titleEl = window.$("pTitle");
  titleEl.textContent = p.Title || "-";
  if (p.Title) { titleEl.style.color = "#CFAD7E"; titleEl.style.fontWeight = "800"; } else { titleEl.style.color = ""; }
  window.$("pPower").textContent = p.CombatPower || "-";

  renderStats(p.Stats || [], data.ArmoryEquipment || [], data);
  renderEng(data.ArmoryEngraving);
  renderArkGrid(data.ArkGrid);
  renderArkGridTab(data.ArkGrid, data);
  renderArkPassiveTab(data.ArkPassive, data);
  renderGear(data.ArmoryEquipment || [], data.ArmoryAvatars || []);
  renderAvatars(data.ArmoryAvatars || []);
  renderGems(data.ArmoryGem, data.ArmorySkills);
  renderCards(data.ArmoryCard);
  renderAP(data.ArkPassive);

  window.__skillPts = { used: p.UsingSkillPoint, total: p.TotalSkillPoint };
  window.__swiftCdPct = getSwiftCdPct(p.Stats || []);
  window.__gemMap = buildSkillGemMap(data.ArmoryGem);
  renderSkills(data.ArmorySkills || [], data.ArmoryGem);
  setEffPanelOpen(false);
}

// 카드 클릭 서랍 토글 이벤트
document.addEventListener("click", (ev) => {
  const card = ev.target.closest(".mc");
  if (card) {
    if (ev.target.closest("label") || ev.target.closest("input")) return;
    ev.preventDefault();
    const wasOpen = card.classList.contains("open");
    document.querySelectorAll(".mc.open").forEach(c => c.classList.remove("open"));
    if (!wasOpen) card.classList.add("open");
    return;
  }
  document.querySelectorAll(".mc.open").forEach(c => c.classList.remove("open"));
});

// 시작 시 URL 검색 파라미터가 있으면 즉시 검색 실행
const params = new URLSearchParams(location.search);
const init = params.get("name") || q.value.trim();
if (init) { q.value = init; go(init); }