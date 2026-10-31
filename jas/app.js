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

  // 직업 마크 (로아 홈페이지 엠블럼): 직업 이름 → 이미지 주소
  const CLS_EMB = {
      "워로드":"warlord","버서커":"berserker","디스트로이어":"destroyer","홀리나이트":"holyknight","슬레이어":"berserker_female","발키리":"valkyrie",
      "배틀마스터":"battle_master","인파이터":"infighter","기공사":"force_master","창술사":"lance_master","스트라이커":"battle_master_male","브레이커":"infighter_male",
      "데빌헌터":"devil_hunter","블래스터":"blaster","호크아이":"hawk_eye","스카우터":"scouter","건슬링어":"devil_hunter_female",
      "바드":"bard","서머너":"summoner","아르카나":"arcana","소서리스":"elemental_master","블레이드":"blade","데모닉":"demonic","리퍼":"reaper","소울이터":"soul_eater",
      "도화가":"yinyangshi","기상술사":"weather_artist","환수사":"alchemist","가디언나이트":"dragon_knight","차원술사":"dimension_master"
    };
  window.__classEmblemUrl = function (cls) {
    const f = CLS_EMB[String(cls || "").replace(/\s+/g, "")];
    return f ? "https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/emblem_" + f + ".png" : "";
  };
  // 캐릭터 이름 → 직업 (최근 검색 / 즐겨찾기 목록에서 마크를 보여주기 위해 조회할 때마다 저장)
  const CLS_KEY = "loaview-class";
  const readCls = () => { try { return JSON.parse(localStorage.getItem(CLS_KEY)) || {}; } catch (e) { return {}; } };
  window.__setClass = function (name, cls) {
    if (!name || !cls) return;
    try { const m = readCls(); if (m[name] === cls) return; m[name] = cls; localStorage.setItem(CLS_KEY, JSON.stringify(m)); } catch (e) {}
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

  // ===== 즐겨찾기 / 최근 검색 =====
  const FAV_KEY = "loaview-fav", HID_KEY = "loaview-recent-hidden";
  const readList = (k) => { try { const v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : []; } catch (e) { return []; } };
  const writeList = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  let rcTab = "recent", cachedNames = new Set();

  const origTouch = window.__touchRecent;
  window.__touchRecent = function (name) {   // 다시 조회하면 숨김 해제
    origTouch(name);
    writeList(HID_KEY, readList(HID_KEY).filter(x => x !== name));
  };

  function renderRecent() {
    const ul = document.getElementById("rcItems");
    if (!ul) return;
    const favs = readList(FAV_KEY), hidden = new Set(readList(HID_KEY));
    document.querySelectorAll("#recentList .rc-tab").forEach(b => b.classList.toggle("active", b.dataset.t === rcTab));
    let names;
    if (rcTab === "fav") names = favs.slice();
    else {
      const rec = readRecent().map(x => x.n).filter(n => cachedNames.has(n));
      cachedNames.forEach(n => { if (!rec.includes(n)) rec.push(n); });   // 기록 없는 기존 캐시도 포함
      const vis = rec.filter(n => !hidden.has(n)).slice(0, RECENT_MAX);
      names = vis.filter(n => favs.includes(n)).concat(vis.filter(n => !favs.includes(n)));   // 즐겨찾기 우선
    }
    ul.textContent = "";
    if (!names.length) {
      const li = document.createElement("li");
      li.className = "empty"; li.textContent = rcTab === "fav" ? "즐겨찾기한 캐릭터가 없어요" : "최근 검색 기록이 없어요";
      ul.appendChild(li); return;
    }
    names.forEach(n => {
      const on = favs.includes(n);
      const li = document.createElement("li");
      li.dataset.name = n; li.setAttribute("role", "option");
      const st = document.createElement("button");
      st.type = "button"; st.className = "rc-star" + (on ? " on" : ""); st.textContent = on ? "★" : "☆";
      st.title = on ? "즐겨찾기 해제" : "즐겨찾기 추가"; st.dataset.act = "star";
      const nm = document.createElement("span"); nm.className = "rc-nm"; nm.textContent = n;
      const x = document.createElement("button");
      x.type = "button"; x.className = "rc-x"; x.textContent = "✕"; x.title = "삭제"; x.dataset.act = "del";
      const cu = window.__classEmblemUrl(readCls()[n]);
      if (cu) { const em = document.createElement("i"); em.className = "cls-emb sm"; em.style.backgroundImage = `url("${cu}")`; li.append(st, em, nm, x); }
      else li.append(st, nm, x);
      ul.appendChild(li);
    });
  }

  // 캐시에 실제로 있는 이름 + 즐겨찾기 상태로 목록 갱신
  window.__refreshSavedNames = function () {
    if (!document.getElementById("rcItems")) return;
    cacheKeys().then(keys => {
      const cached = new Set();
      keys.forEach(k => {
        const m = String(k).match(/\/character\/([^/]+)\/all$/);
        if (m) cached.add(decodeURIComponent(m[1]));
      });
      cachedNames = cached;
      renderRecent();
    });
  };

  // 별/삭제/탭/전체삭제 (이름 클릭은 기존 핸들러가 조회 처리)
  const pop = document.getElementById("recentList");
  if (pop) pop.addEventListener("click", e => {
    const t = e.target.closest(".rc-tab, #rcClear, [data-act]");
    if (!t) return;
    e.stopImmediatePropagation();
    if (t.classList.contains("rc-tab")) { rcTab = t.dataset.t; renderRecent(); return; }
    if (t.id === "rcClear") {
      if (!confirm(rcTab === "fav" ? "즐겨찾기를 모두 삭제할까요?" : "최근 검색을 모두 삭제할까요?\n(즐겨찾기는 유지됩니다)")) return;
      if (rcTab === "fav") writeList(FAV_KEY, []);
      else writeList(HID_KEY, Array.from(new Set(readList(HID_KEY).concat(Array.from(cachedNames), readRecent().map(x => x.n)))));
      renderRecent(); return;
    }
    const li = t.closest("li[data-name]"); if (!li) return;
    const n = li.dataset.name, favs = readList(FAV_KEY);
    if (t.dataset.act === "star") writeList(FAV_KEY, favs.includes(n) ? favs.filter(x => x !== n) : [n].concat(favs));
    else if (t.dataset.act === "del") {
      if (rcTab === "fav") writeList(FAV_KEY, favs.filter(x => x !== n));
      else writeList(HID_KEY, Array.from(new Set(readList(HID_KEY).concat(n))));
    }
    renderRecent();
  });
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
  mainEl.classList.toggle("tab-skill", dataLoaded && currentTab === "skill");   // 스킬 탭: 스킬 포인트 바 상단 고정
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
    window.__setClass(name, data.ArmoryProfile.CharacterClassName);
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
    "세계수의 축복 받은 자","S1 낙원의 선봉대","S1 낙원의 정복자","S1 낙원의 주인",
    "S2 낙원의 선봉대","S2 낙원의 정복자","S2 낙원의 주인",
    "S3 낙원의 선봉대","S3 낙원의 정복자","S3 낙원의 주인",
    "21년 최고의 금손","22년 최고의 금손","23년 최고의 금손","24년 최고의 금손","25년 최고의 금손","삼라만상",
    "기분 좋은 향기","모코코 사냥꾼","미술품 애호가","생활의 달인","서풍의 지휘자","일등 항해사","아크라시아의 순례자","영혼의 공명"
  ]);
  add("tg-relic", [
    "죽음을 부르는 자","카멘 The 1st","카멘 The 2nd","카멘 The 3rd","카멘 The TOP10",
    "광풍의 슬레이어","날개를 꺾은 자","뇌룡을 정복한 자","벨가누스 슬레이어","아카테스 슬레이어",
    "엘버하스틱 슬레이어","이그렉시온 슬레이어","몽환의 지배자",
    "에스더의 결속자","에스더의 후계자"
  ]);
  add("tg-ancient", ["카제로스 The 1st","카제로스 The 2nd","카제로스 The 3rd","카제로스 The TOP10"]);
  add("tg-thunder", ["뇌전의 군주"]);   // 전설 목록과 겹치므로 마지막에 덮어씀
  add("tg-doom", ["파멸의 군주"]);
  add("tg-abyss", ["심연의 끝을 마주한 자"]);
  return m;
})();
// ===== 칭호 앞 아이콘 (img/title/*.webp) =====
const TITLE_ICON_DIR = "img/title/";
const TITLE_ICON = {
  "광기의 그림자":"madness-shadow","뇌전의 군주":"thunder-lord","마수의 포효":"beast-roar",
  "몽환의 지배자":"dream-ruler","삼라만상":"all-things","심연의 군주":"abyss-lord",
  "심연의 끝을 마주한 자":"abyss-end","에스더의 결속자":"esther-bound","에스더의 후계자":"esther-heir",
  "이클립스":"eclipse","죽음을 부르는 자":"death-caller","쾌락의 탐닉자":"pleasure-seeker",
  "혹한의 군주":"frost-lord","홍염의 군주":"blaze-lord",
  "세계수의 축복 받은 자":"worldtree-blessed"
};
function titleIconUrl(title) {
  const key = String(title || "").replace(/\s+/g, " ").trim();
  const f = TITLE_ICON[key];
  return f ? TITLE_ICON_DIR + f + ".webp" : "";
}
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

// ===== 직각 티어 박스 (인식 티어 / 경기 승률): 직각 토너먼트 OP 1:1 승률 기준, 최근 30일 =====
const TOURN = {
  URL: "https://khszfukekudyripouifm.supabase.co",
  KEY: "sb_publishable_XjCVKOZRq1aERqzOGj_tHw_eC4uCXEb",
  DAYS: 30,
  SUPPORT: ["절실한 구원", "만개", "축복의 오라", "해방자"],            // OP 티어에서 제외 → 표시 '-'
  SHORT: {   // 토너먼트 직각 이름 → 줄임말 (AP_SHORT 의 값과 같아서 이 값끼리 비교)
    "고독한 기사":"고기","전투 태세":"전태","광기":"광기","광전사의 비기":"비기","분노의 망치":"분망","중력 수련":"중수","심판자":"심판자","축복의 오라":"축오",
    "처단자":"처단자","포식자":"포식자","빛의 기사":"빛의 기사","해방자":"해방자","초심":"초심","오의 강화":"오의","충격 단련":"충단","체술":"체술",
    "무상신공":"무상","역천지체":"역천","절정":"절정","절제":"절제","오의난무":"난무","일격필살":"일격","권왕파천무":"권왕","수라의 길":"수라",
    "전술 탄환":"전탄","핸드 거너":"핸건","화력 강화":"화강","포격 강화":"포강","죽음의 습격":"죽습","두 번째 동료":"두동","진화의 유산":"유산",
    "아르데타인의 기술":"기술","피스메이커":"피메","사냥의 시간":"사시","상급 소환사":"상소","넘치는 교감":"교감","황제의 칙령":"황제","황후의 은총":"황후",
    "진실된 용맹":"진용","절실한 구원":"절구","점화":"점화","환류":"환류","버스트":"버스트","잔재된 기운":"잔재","멈출 수 없는 충동":"충동",
    "완벽한 억제":"억제","달의 소리":"달소","갈증":"갈증","만월의 집행자":"만월","만개":"만개","그믐의 경계":"그믐","회귀":"회귀","이슬비":"이슬비",
    "질풍노도":"질풍","환수 각성":"환각","야성":"야성","업화":"업화","드레드 로어":"드드","시간 관리자":"시간","공간 검사":"공간"
  }
};
const TIER_COLORS = ["", "#ffd24a", "#ff9f43", "#c79cff", "#4da3ff", "#3cc78c", "#9aa3b5"];
// 직각 토너먼트 티어표와 같은 규칙: 승률 순 → 1티어 6개 / 2티어 9개 / 3티어 12개 / 6티어 맨 아래 10개 / 나머지 반반(4·5티어)
function tournCalcTiers(entries) {
  const sorted = [...entries].sort((a, b) => b.winRate - a.winRate || b.total - a.total);
  const total = sorted.length;
  const tier6 = total > 10 ? sorted.slice(total - 10) : [];
  const rest = total > 10 ? sorted.slice(0, total - 10) : sorted;
  const rem = rest.slice(27), half = Math.ceil(rem.length / 2);
  const tiers = [rest.slice(0, 6), rest.slice(6, 15), rest.slice(15, 27), rem.slice(0, half), rem.slice(half), tier6];
  const out = {};
  tiers.forEach((t, i) => t.forEach(e => { out[e.short] = Object.assign({}, e, { tier: i + 1, rank: sorted.indexOf(e) + 1, of: total }); }));
  return out;
}
let __tournP = null;
function loadTournTiers() {
  if (__tournP) return __tournP;
  __tournP = (async () => {
    try {
      const ck = sessionStorage.getItem("loaview-tourn");
      if (ck) { const o = JSON.parse(ck); if (Date.now() - o.t < 30 * 60 * 1000) return o.map; }
    } catch (e) {}
    const res = await fetch(TOURN.URL + "/rest/v1/rpc/get_tier_data", {
      method: "POST",
      headers: { "apikey": TOURN.KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ p_type: "op", p_days: TOURN.DAYS })
    });
    if (!res.ok) throw new Error("tier " + res.status);
    const rows = await res.json();
    const entries = rows.filter(r => !TOURN.SUPPORT.includes(r.engraving_name)).map(r => ({
      name: r.engraving_name, short: TOURN.SHORT[r.engraving_name] || r.engraving_name,
      winRate: Number(r.win_rate), total: Number(r.total_matches), win: Number(r.win_count), lose: Number(r.lose_count)
    }));
    const map = tournCalcTiers(entries);
    try { sessionStorage.setItem("loaview-tourn", JSON.stringify({ t: Date.now(), map })); } catch (e) {}
    return map;
  })().catch(e => { __tournP = null; throw e; });
  return __tournP;
}
// 박스 값 변경: setTierBox(3, 52.3, "툴팁 HTML") / 값 없으면 setTierBox(null, null)
window.setTierBox = function (tier, pct, tipHtml) {
  const r = window.$("tierRank"), p = window.$("tierPct"), box = window.$("tierBox");
  if (r) {
    r.dataset.rank = tier || "";
    r.innerHTML = tier ? tier + "<small>티어</small>" : "-";
    r.style.color = tier ? TIER_COLORS[tier] : "#6b7690";
  }
  if (p) {
    p.textContent = pct == null ? "-" : pct.toFixed(1) + "%";
    p.style.color = pct == null ? "#6b7690" : pct >= 52 ? "#3cc78c" : pct >= 48 ? "#cfd8ee" : "#ff8a8a";
  }
  if (box) {
    box.dataset.tip = tipHtml || "";
    if (!box.__tipBound) {   // 툴팁은 한 번만 연결하고 내용은 dataset.tip 에서 읽음
      box.__tipBound = true;
      box.addEventListener("mouseenter", e => { if (box.dataset.tip) showTip(e, box.dataset.tip); });
      box.addEventListener("mouseleave", hideTip);
    }
  }
};
async function updateTierBox(data) {
  window.setTierBox(null, null);
  const cls = (data.ArmoryProfile && data.ArmoryProfile.CharacterClassName) || "";
  const raw = String((data.ArkPassive && data.ArkPassive.Title) || "").trim();
  if (!raw) return;
  const short = (window.__apShort || {})[raw] || raw;
  const rev = Object.keys(TOURN.SHORT).find(k => TOURN.SHORT[k] === short);
  if (rev && TOURN.SUPPORT.includes(rev)) return;   // 서포터: '-'
  // 불러오는 동안 두 칸에 회전 로딩 표시 (끝나면 값 또는 '-'로 교체)
  ["tierRank", "tierPct"].forEach(id => { const el = window.$(id); if (el) { el.textContent = ""; el.style.color = ""; el.innerHTML = '<span class="tier-spin" aria-label="불러오는 중"></span>'; } });
  const clearSpin = () => { if (window.__fullData === data) ["tierRank", "tierPct"].forEach(id => { const el = window.$(id); if (el && el.querySelector(".tier-spin")) { el.textContent = "-"; el.style.color = "#6b7690"; } }); };
  try {
    const map = await loadTournTiers();
    if (window.__fullData !== data) return;          // 그 사이 다른 캐릭터를 조회한 경우
    const e = map[short];
    if (!e) { clearSpin(); return; }
    window.setTierBox(e.tier, e.winRate,
      `<div class="tip-hd">${cls} ${raw}</div><div class="tip-bd" style="font-size:11px;line-height:1.6;">OP 직각 ${e.of}개 중 <b>${e.rank}위</b> · ${e.tier}티어<br>최근 ${TOURN.DAYS}일 1:1 승률 ${e.winRate.toFixed(1)}%<br>${e.total}전 ${e.win}승 ${e.lose}패</div>`);
  } catch (err) { clearSpin(); /* 실패하면 '-' */ }
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
  const AP_SHORT = {
    "고독한 기사":"고기","전투 태세":"전태","광기":"광기","광전사의 비기":"비기",
    "분노의 망치":"분망","중력 수련":"중수","심판자":"심판자","축복의 오라":"축오",
    "처단자":"처단자","포식자":"포식자","빛의 기사":"빛의 기사","해방자":"해방자",
    "초심":"초심","오의 강화":"오의","충격 단련":"충단","극의: 체술":"체술",
    "무상신공":"무상","역천지체":"역천","절정":"절정","절제":"절제",
    "오의난무":"난무","일격필살":"일격","권왕파천무":"권왕","수라의 길":"수라",
    "전술 탄환":"전탄","핸드거너":"핸건","화력 강화":"화강","포격 강화":"포강",
    "죽음의 습격":"죽습","두 번째 동료":"두동","진화의 유산":"유산",
    "아르데타인의 기술":"기술","피스메이커":"피메","사냥의 시간":"사시",
    "상급 소환사":"상소","넘치는 교감":"교감","황제의 칙령":"황제","황후의 은총":"황후",
    "진실된 용맹":"진용","절실한 구원":"절구","점화":"점화","환류":"환류",
    "버스트":"버스트","잔재된 기운":"잔재","멈출 수 없는 충동":"충동",
    "완벽한 억제":"억제","달의 소리":"달소","갈증":"갈증",
    "만월의 집행자":"만월","만개":"만개","그믐의 경계":"그믐","회귀":"회귀","이슬비":"이슬비",
    "질풍노도":"질풍","환수 각성":"환각","야성":"야성","업화의 계승자":"업화","드레드 로어":"드드",
    "시간 관리자":"시간","공간 검사":"공간"
  };
  window.__apShort = AP_SHORT;
  const apRaw = data.ArkPassive?.Title;
  const apTitle = apRaw ? (AP_SHORT[String(apRaw).trim()] || apRaw) : apRaw;
  info.appendChild(el("div", "art-class", `Lv. ${p.CharacterLevel ?? "-"} ${p.CharacterClassName || ""}${apTitle ? " #" + apTitle : ""}`));
  const nmEl = el("div", "art-name", p.CharacterName || "-");
  { const eu = window.__classEmblemUrl && window.__classEmblemUrl(p.CharacterClassName);
    if (eu) { const em = document.createElement("i"); em.className = "cls-emb"; em.style.backgroundImage = `url("${eu}")`; em.title = p.CharacterClassName || ""; nmEl.insertBefore(em, nmEl.firstChild); } }
  info.appendChild(nmEl);
  const nums = el("div", "art-nums");
  const r1 = el("div", "art-num art-ilvl"); r1.appendChild(el("i", "", "💠​")); r1.appendChild(el("b", "", p.ItemAvgLevel || "-"));
  const r2 = el("div", "art-num art-cp"); r2.appendChild(el("i", "", "⚔️")); r2.appendChild(el("b", "", p.CombatPower || "-"));
  nums.appendChild(r1); nums.appendChild(r2);
  info.appendChild(nums);
  art.appendChild(info);
  { // 엠블럼 / 심볼: 캐릭터 이미지 좌하단에 작게 표시
    window.__embWrap = null;
    const dec = p.Decorations || {};
    const urls = [];
    const pushU = (x) => { const u = typeof x === "string" ? x : (x && (x.Icon || x.Image || x.Url)); if (u && /^https?:/.test(u)) urls.push(u); };
    (Array.isArray(dec.Emblems) ? dec.Emblems : []).forEach(pushU);   // 엠블럼 전부 표시 (심볼 제외)
    if (urls.length) {
      const wrap = el("div", "art-emblems");
      wrap.style.cssText = "display:flex;gap:8px;align-items:center;justify-content:flex-start;margin-top:10px";
      urls.forEach((u, idx) => {
        const im = document.createElement("img");
        im.src = u; im.alt = ""; im.loading = "lazy";
        im.style.cssText = "position:static !important;transform:none !important;top:auto !important;left:auto !important;height:34px !important;width:auto !important;max-width:52px !important;object-fit:contain !important;-webkit-mask-image:none !important;mask-image:none !important;opacity:1 !important;filter:drop-shadow(0 2px 4px rgba(0,0,0,.7))";
        im.onerror = () => im.remove();
        wrap.appendChild(im);
      });
      info.appendChild(wrap);
    }
  }


  const rows = el("div", "art-rows");
  const addRow = (label, value, cls, color) => {
    const r = el("div", "art-row");
    r.appendChild(el("span", "art-k", label));
    const v = el("span", "art-v" + (cls ? " " + cls : ""), value);
    if (color) { v.style.color = color; v.style.fontWeight = "800"; }
    r.appendChild(v);
    rows.appendChild(r);
  };
  addRow("서버", p.ServerName || "-", "", p.ServerName ? "#e8b84b" : "");
  addRow("원정대", p.ExpeditionLevel != null ? "Lv." + p.ExpeditionLevel : "-", "", p.ExpeditionLevel != null ? "#7fd1ff" : "");
  addRow("칭호", p.Title || "-", p.Title ? titleGradeClass(p.Title) : "");
  { // 해당 칭호 아이콘이 있으면 글자 앞에 표시 (효과 클래스는 글자 span에만 적용 → 세로 정렬 일정)
    const tu = titleIconUrl(p.Title);
    if (tu) {
      const tv = rows.lastElementChild && rows.lastElementChild.querySelector(".art-v");
      if (tv) {
        const tgCls = [...tv.classList].filter(c2 => /^tg-/.test(c2));
        tgCls.forEach(c2 => tv.classList.remove(c2));
        const txt = document.createElement("span");
        txt.className = "t-txt";
        const inner = document.createElement("span");
        inner.className = tgCls.join(" ");
        inner.textContent = p.Title;
        txt.appendChild(inner);
        tv.textContent = "";
        const im = document.createElement("img");
        im.className = "t-ico"; im.src = tu; im.alt = ""; im.loading = "lazy";
        im.onerror = () => im.remove();
        tv.classList.add("has-t-ico");
        tv.append(im, txt);
      }
    }
  }
  addRow("길드", p.GuildName || "-", p.GuildName ? "art-guild" : "");
  addRow("영지", p.TownName ? `Lv.${p.TownLevel ?? "-"} ${p.TownName}` : "-", "", p.TownName ? "#c8a2ff" : "");
  { // 명예: 프로필에 명예 관련 값이 있을 때만 표시
    const hk = Object.keys(p).find(k => /honor|명예/i.test(k));
    if (hk && p[hk] != null && p[hk] !== "") { const hv = parseInt(String(p[hk]).replace(/[^0-9]/g, ""), 10) || 0;
      const hc = hv >= 1000 ? "#F9AE00" : hv >= 500 ? "#CE43FC" : hv >= 300 ? "#00B0FA" : hv >= 100 ? "#8DF901" : "#aeb6c6";
      addRow("명예", String(p[hk]), "", hc); }
  }
  addRow("토너", "미랭크", "art-chip", "#8b95a8");   // 나중에 다른 시스템 줄을 이 아래에 추가
  { // 우측 상단: 경과 시간만 간단히 (저장본 여부는 상단 안내 문구로 표시됨)
    const hit = window.__cacheHit && /\/all$/.test(window.__cacheHit.url);
    const at = hit ? window.__cacheHit.t : Date.now();
    const u = el("div", "art-upd");
    u.style.cssText = "position:absolute;top:12px;right:12px;z-index:3;white-space:nowrap;font-size:11px;font-weight:700;color:" + (hit ? "#ffb070" : "#cfd8ee") + ";background:rgba(8,12,24,.62);border:1px solid " + (hit ? "rgba(255,150,70,.5)" : "rgba(255,255,255,.14)") + ";border-radius:999px;padding:3px 9px;backdrop-filter:blur(4px)";
    const paint = () => {
      const m = Math.floor((Date.now() - at) / 60000);
      u.textContent = m < 1 ? "방금" : m < 60 ? m + "분전" : Math.floor(m / 60) + "시간전";
    };
    paint();
    art.appendChild(u);
    clearInterval(window.__updTimer);
    window.__updTimer = setInterval(() => { if (!u.isConnected) return clearInterval(window.__updTimer); paint(); }, 20000);
  }
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
  updateTierBox(data);
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