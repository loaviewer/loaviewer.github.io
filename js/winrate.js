import { supabase } from "./supabase.js";


const SUPPORT_ENGRAVINGS = ["절실한 구원", "만개", "축복의 오라", "해방자"];
const S_BENEFIT_GRADES = ["S+", "S", "S-"];
const SS_BENEFIT_GRADES = ["SS+", "SS", "SS-"];

const fullToShortMap = {
  "고독한 기사":"고기","전투 태세":"전태","광기":"광기","광전사의 비기":"비기",
  "분노의 망치":"분망","중력 수련":"중수","심판자":"심판자","축복의 오라":"축오",
  "처단자":"처단자","포식자":"포식자","빛의 기사":"빛의 기사","해방자":"해방자",
  "초심":"초심","오의 강화":"오의","충격 단련":"충단","체술":"체술",
  "무상신공":"무상","역천지체":"역천","절정":"절정","절제":"절제",
  "오의난무":"난무","일격필살":"일격","권왕파천무":"권왕","수라의 길":"수라",
  "전술 탄환":"전탄","핸드 거너":"핸건","화력 강화":"화강","포격 강화":"포강",
  "죽음의 습격":"죽습","두 번째 동료":"두동","진화의 유산":"유산",
  "아르데타인의 기술":"기술","피스메이커":"피메","사냥의 시간":"사시",
  "상급 소환사":"상소","넘치는 교감":"교감","황제의 칙령":"황제","황후의 은총":"황후",
  "진실된 용맹":"진용","절실한 구원":"절구","점화":"점화","환류":"환류",
  "버스트":"버스트","잔재된 기운":"잔재","멈출 수 없는 충동":"충동",
  "완벽한 억제":"억제","달의 소리":"달소","갈증":"갈증",
  "만월의 집행자":"만월","만개":"만개","그믐의 경계":"그믐","회귀":"회귀","이슬비":"이슬비",
  "질풍노도":"질풍","환수 각성":"환각","야성":"야성","업화":"업화","드레드 로어":"드드",
  "시간 관리자":"시간","공간 검사":"공간"
};

const $ = (id) => document.getElementById(id);
function getShortName(full) { return fullToShortMap[full] || full; }
function getIconPath(name) { return `../icon/${getShortName(name).replace(/\s+/g, "")}.png`; }

function getVisitorKey() {
  let k = localStorage.getItem("loa_tournament_visitor_key");
  if (!k) { k = "loa_tournament_user_" + crypto.randomUUID(); localStorage.setItem("loa_tournament_visitor_key", k); }
  return k;
}

function getDateKey() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}

/* ============================================================
   상태
   ============================================================ */
let visitorKey = null;
let completedState = { op: false, favor: false };
let gradeBenefitState = { sActive: false, ssActive: false };
let currentMode = "postpatch";
let dataCache = {};
let prevRows = null;
let isLoaded = false;

// ⚠️ false면 실제 잠금 조건 적용
const TEST_UNLOCK_ALL = false;

/* ============================================================
   S / SS 혜택
   ============================================================ */
function parseDateKeyToDate(dk) { if (!dk) return null; const [y, m, d] = dk.split("-").map(Number); return new Date(y, m - 1, d); }
function getSBenefitExpireAt(dk) { const d = parseDateKeyToDate(dk); if (!d) return null; return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999); }
function getSSBenefitExpireAt(dk) { const d = parseDateKeyToDate(dk); if (!d) return null; return new Date(d.getFullYear(), d.getMonth() + 3, 0, 23, 59, 59, 999); }

async function loadGradeBenefit() {
  gradeBenefitState = { sActive: false, ssActive: false };
  const { data, error } = await supabase.from("sessions").select("grade,date_key").eq("visitor_key", visitorKey).not("grade", "is", null);
  if (error || !data) return;
  const now = new Date();
  data.forEach(row => {
    if (!row.grade || !row.date_key) return;
    if (S_BENEFIT_GRADES.includes(row.grade)) { const exp = getSBenefitExpireAt(row.date_key); if (exp && exp >= now) gradeBenefitState.sActive = true; }
    if (SS_BENEFIT_GRADES.includes(row.grade)) { const exp = getSSBenefitExpireAt(row.date_key); if (exp && exp >= now) gradeBenefitState.ssActive = true; }
  });
}

/* ============================================================
   열람 정책
   ============================================================ */
function isUnlocked() {
  if (TEST_UNLOCK_ALL) return true;
  if (gradeBenefitState.sActive || gradeBenefitState.ssActive) return true;
  if (completedState.op && completedState.favor) return true;
  return false;
}

function applyInitialLockState() {
  const lockSection = $("winrateLockSection");
  if (!lockSection) return;

  if (isUnlocked()) {
    lockSection.style.display = "none";
  } else {
    lockSection.style.display = "block";
  }
}

/* ============================================================
   데이터
   ============================================================ */
async function loadTodayState() {
  visitorKey = getVisitorKey();
  const { data, error } = await supabase.from("sessions").select("tournament_type").eq("visitor_key", visitorKey).eq("date_key", getDateKey());
  if (error || !data) return;
  completedState.op = !!data.find(r => r.tournament_type === "op");
  completedState.favor = !!data.find(r => r.tournament_type === "favor");
}

async function loadPrevData() {
  if (prevRows) return prevRows;
  const { data, error } = await supabase.rpc("get_tier_data_range", {
    p_type: "op",
    p_start: "2026-06-22",
    p_end: "2026-07-21"
  });
  if (error || !data) return null;
  prevRows = data.filter(r => !SUPPORT_ENGRAVINGS.includes(r.engraving_name));
  return prevRows;
}

async function loadPostpatchData() {
  const start = new Date("2026-07-22T00:00:00+09:00");
  const now = new Date();
  const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;
  const { data, error } = await supabase.rpc("get_tier_data", { p_type: "op", p_days: diffDays });
  if (error || !data) return null;
  return data.filter(r => !SUPPORT_ENGRAVINGS.includes(r.engraving_name));
}

async function loadRecentData(days) {
  const { data, error } = await supabase.rpc("get_tier_data", { p_type: "op", p_days: days });
  if (error || !data) return null;
  return data.filter(r => !SUPPORT_ENGRAVINGS.includes(r.engraving_name));
}

async function loadCompareData(mode) {
  if (dataCache[mode]) return dataCache[mode];
  let rows;
  if (mode === "postpatch") rows = await loadPostpatchData();
  else if (mode === "recent10") rows = await loadRecentData(10);
  else if (mode === "recent5") rows = await loadRecentData(5);
  else rows = await loadPostpatchData();
  dataCache[mode] = rows;
  return rows;
}

/* ============================================================
   렌더
   ============================================================ */
function renderWinrateContent(rows, prev) {
  const listEl = $("winrateList");
  if (!listEl) return;

  if (!rows || !rows.length) {
    listEl.innerHTML = '<div style="text-align:center;padding:24px;color:#a49bae;">데이터를 불러오지 못했어요 😢</div>';
    return;
  }

  const sorted = [...rows].sort((a, b) => {
    if (Number(b.win_rate) !== Number(a.win_rate)) return Number(b.win_rate) - Number(a.win_rate);
    if (Number(b.total_matches) !== Number(a.total_matches)) return Number(b.total_matches) - Number(a.total_matches);
    return Number(b.win_count) - Number(a.win_count);
  });

  const prevRankMap = {};
  const prevRateMap = {};

  if (prev && prev.length) {
    const prevSorted = [...prev].sort((a, b) => {
      if (Number(b.win_rate) !== Number(a.win_rate)) return Number(b.win_rate) - Number(a.win_rate);
      if (Number(b.total_matches) !== Number(a.total_matches)) return Number(b.total_matches) - Number(a.total_matches);
      return Number(b.win_count) - Number(a.win_count);
    });
    prevSorted.forEach((r, i) => {
      prevRankMap[r.engraving_name] = i + 1;
      prevRateMap[r.engraving_name] = Number(r.win_rate);
    });
  }

  function getRowClass(i) {
    if (i === 0) return "row-top1";
    if (i === 1) return "row-top2";
    if (i === 2) return "row-top3";
    return "";
  }

  function getDeltaHTML(name, currentRank, currentRate) {
    const prevRank = prevRankMap[name];
    const prevRate = prevRateMap[name];

    if (prevRank === undefined || prevRate === undefined) {
      return '<div class="delta-wrap"><span class="delta-new">🌱 신규</span></div>';
    }

    const rankDiff = prevRank - currentRank;
    const rateDiff = (currentRate - prevRate).toFixed(2);
    let rankHTML = "";
    let rateHTML = "";

    if (rankDiff > 0) rankHTML = '<span class="delta-up">▲ +' + rankDiff + '</span>';
    else if (rankDiff < 0) rankHTML = '<span class="delta-down">▼ ' + rankDiff + '</span>';
    else rankHTML = '<span class="delta-same">─</span>';

    if (Number(rateDiff) > 0) rateHTML = '<span class="delta-rate-up">+' + rateDiff + '%</span>';
    else if (Number(rateDiff) < 0) rateHTML = '<span class="delta-rate-down">' + rateDiff + '%</span>';

    if (rankDiff === 0 && Number(rateDiff) === 0) return "";
    return '<div class="delta-wrap">' + rankHTML + ' ' + rateHTML + '</div>';
  }

  listEl.innerHTML = sorted.map((row, i) => {
    const delta = getDeltaHTML(row.engraving_name, i + 1, Number(row.win_rate));

    return `
      <div class="rate-row-item ${getRowClass(i)}">
        <div class="rate-rank">${i + 1}</div>
        <div class="rate-icon">
          <img src="${getIconPath(row.engraving_name)}" alt="${row.engraving_name}" onerror="this.style.opacity='0.2';">
        </div>
        <div class="rate-info">
          <div class="rate-name">${row.engraving_name}</div>
          <div class="rate-class">${row.class_name || ""}</div>
          <div class="rate-bar-bg">
            <div class="rate-bar-fill bar-fill-op" style="width:${Math.min(100, Number(row.win_rate))}%"></div>
          </div>
          ${delta}
        </div>
        <div class="rate-right">
          <div class="rate-value">${Number(row.win_rate).toFixed(1)}%</div>
          <div class="rate-record">${row.total_matches}전 ${row.win_count}승 ${row.lose_count}패</div>
        </div>
      </div>`;
  }).join("");
}

/* ============================================================
   모드 전환
   ============================================================ */
async function refreshWinrate(mode) {
  currentMode = mode;

  const now = new Date();
  const stamp = `${String(now.getFullYear()).slice(2)}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const subEl = $("winrateSub");
  if (mode === "recent10") {
    if (subEl) subEl.textContent = `OP 직각 1:1 승률 · 최근 10일 비교 🕙 ${stamp}`;
  } else if (mode === "recent5") {
    if (subEl) subEl.textContent = `OP 직각 1:1 승률 · 최근 5일 비교 🕔 ${stamp}`;
  } else {
    if (subEl) subEl.textContent = `OP 직각 1:1 승률 · 7/22 ~ 현재 비교 🕙 ${stamp}`;
  }

  const rows = await loadCompareData(mode);
  const prev = await loadPrevData();

  renderWinrateContent(rows, prev);
}

/* ============================================================
   생성
   ============================================================ */
async function generateWinrate() {
  if (!isUnlocked()) {
    $("winrateLockSection").style.display = "block";
    return;
  }

  $("winrateLockSection").style.display = "none";

  const idle = $("winrateIdle");
  const loading = $("winrateLoading");
  const content = $("winrateContent");
  const compareTabs = $("winrateCompareTabs");
  const genBtn = $("genWinrateBtn");

  idle.style.display = "none";
  content.style.display = "none";
  loading.style.display = "flex";
  genBtn.classList.add("active");

  await loadPrevData();
  await refreshWinrate("postpatch");

  loading.style.display = "none";
  content.style.display = "block";
  compareTabs.style.display = "inline-flex";
  isLoaded = true;

  // 비교 탭 초기화
  document.querySelectorAll(".winrate-compare-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === "postpatch");
  });
}

/* ============================================================
   이벤트
   ============================================================ */
const genBtn = $("genWinrateBtn");
if (genBtn) genBtn.addEventListener("click", generateWinrate);

document.querySelectorAll(".winrate-compare-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    if (!isLoaded) return;
    document.querySelectorAll(".winrate-compare-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    await refreshWinrate(btn.dataset.mode);
  });
});

/* ============================================================
   초기화
   ============================================================ */
async function init() {
  visitorKey = getVisitorKey();
  await loadTodayState();
  await loadGradeBenefit();
  applyInitialLockState();
}

init();