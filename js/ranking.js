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

function getMonthKey() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
}

function formatUpdatedAt(v) {
  if (!v) return "-";
  const d = new Date(v);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

let visitorKey = null;
let completedState = { op: false, favor: false };
let currentMode = "op";
let currentPeriod = "all";
let rankingCache = {};
let gradeBenefitState = { sActive: false, ssActive: false };

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

function hasAllAccess() { return gradeBenefitState.sActive || gradeBenefitState.ssActive; }

function getRevealLimit() {
  if (hasAllAccess()) return Infinity;
  if (completedState.op && completedState.favor) return Infinity;
  if (completedState.op || completedState.favor) return 20;
  return 5;
}

function getAccessText() {
  if (gradeBenefitState.ssActive) return "SS 혜택 활성 · 전체 공개";
  if (gradeBenefitState.sActive) return "S 혜택 활성 · 전체 공개";
  if (completedState.op && completedState.favor) return "OP + 호감 완료 · 전체 공개";
  if (completedState.op || completedState.favor) return "토너먼트 1회 완료 · 20위까지 공개";
  return "기본 열람 · 5위까지 공개";
}

function updateAccessBadge() {
  const text = $("rankingAccessText");
  if (text) text.textContent = getAccessText();
}

async function loadTodayState() {
  visitorKey = getVisitorKey();
  const { data, error } = await supabase.from("sessions").select("tournament_type").eq("visitor_key", visitorKey).eq("date_key", getDateKey());
  if (error || !data) return;
  completedState.op = !!data.find(r => r.tournament_type === "op");
  completedState.favor = !!data.find(r => r.tournament_type === "favor");
}

async function loadRankingAll(mode) {
  const key = "all_" + mode;
  if (rankingCache[key]) return rankingCache[key];
  const { data, error } = await supabase.from("ranking_overall").select("class_name,engraving_name,champion_count,win_count,lose_count,total_matches,win_rate,updated_at").eq("tournament_type", mode);
  if (error || !data) return [];
  rankingCache[key] = data;
  return data;
}

async function loadRankingWeekly(mode) {
  const now = new Date(); const start = new Date(now); start.setDate(start.getDate() - 6);
  const fmt = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const { data, error } = await supabase.rpc("get_recent_ranking", { p_type: mode, p_start: fmt(start), p_end: fmt(now) });
  return error ? [] : (data || []);
}

async function loadRankingMonthly(mode) {
  const { data, error } = await supabase.rpc("get_monthly_ranking", { p_type: mode, p_month: getMonthKey() });
  return error ? [] : (data || []);
}

function sortRows(rows) {
  return [...rows].sort((a, b) => {
    if (b.champion_count !== a.champion_count) return b.champion_count - a.champion_count;
    if (Number(b.win_rate) !== Number(a.win_rate)) return Number(b.win_rate) - Number(a.win_rate);
    return b.win_count - a.win_count;
  });
}

function podiumCard(item, rank, kind) {
  if (!item) return "";
  const podClass = rank === 1 ? "pod-1st" : rank === 2 ? "pod-2nd" : "pod-3rd";
  const valueText = kind === "champ" ? `${item.champion_count}회` : `${Number(item.win_rate).toFixed(2)}%`;
  return `
    <div class="pod-card ${podClass}">
      <div class="pod-rank">${rank}위</div>
      <div class="pod-icon"><img src="${getIconPath(item.engraving_name)}" alt="${item.engraving_name}" onerror="this.style.opacity='0.2';"></div>
      <div class="pod-name">${getShortName(item.engraving_name)}</div>
      <div class="pod-val">${valueText}</div>
    </div>`;
}

function renderSummary(sorted) {
  const el = $("rankingSummary");
  if (!el) return;

  if (!sorted.length) {
    el.innerHTML = '<div class="ranking-board-empty">데이터 없음</div>';
    return;
  }

  const champTop3 = sorted.slice(0, 3);
  const rateSorted = [...sorted].filter(r => r.total_matches > 0).sort((a, b) => {
    if (Number(b.win_rate) !== Number(a.win_rate)) return Number(b.win_rate) - Number(a.win_rate);
    if (b.total_matches !== a.total_matches) return b.total_matches - a.total_matches;
    return b.win_count - a.win_count;
  });
  const rateTop3 = rateSorted.slice(0, 3);

  el.innerHTML = `
    <div class="podium-section ps-champ">
      <div class="podium-section-title"><span>🏆</span><span>우승 TOP 3</span></div>
      <div class="podium-trio">
        ${podiumCard(champTop3[0], 1, "champ")}
        ${podiumCard(champTop3[1], 2, "champ")}
        ${podiumCard(champTop3[2], 3, "champ")}
      </div>
    </div>
    <div class="podium-section ps-rate">
      <div class="podium-section-title"><span>⚔️</span><span>승률 TOP 3</span></div>
      <div class="podium-trio">
        ${podiumCard(rateTop3[0], 1, "rate")}
        ${podiumCard(rateTop3[1], 2, "rate")}
        ${podiumCard(rateTop3[2], 3, "rate")}
      </div>
    </div>`;
}


function renderList(sorted) {
  const listEl = $("rankingList");
  if (!listEl) return;

  if (!sorted.length) {
    listEl.innerHTML = '<div class="ranking-board-empty">데이터 없음 · 집계 후 자동 반영됩니다.</div>';
    return;
  }

  const limit = getRevealLimit();
  const maxChampion = Math.max(...sorted.map(r => r.champion_count), 1);
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  listEl.innerHTML = sorted.map((row, idx) => {
    const hidden = idx >= limit;
    const rowCls = idx === 0 ? "row-1st" : idx === 1 ? "row-2nd" : idx === 2 ? "row-3rd" : "";
    const winPct = Math.min(100, (row.champion_count / maxChampion) * 100);
    const ratePct = Math.min(100, Number(row.win_rate));
    const displayName = isMobile ? getShortName(row.engraving_name) : row.engraving_name;

    return `
      <div class="rank-row ${rowCls} ${hidden ? "row-hidden" : ""}">
        <div class="rank-num">${idx + 1}위</div>
        <div class="rank-icon-wrap"><img src="${getIconPath(row.engraving_name)}" alt="${row.engraving_name}" onerror="this.style.opacity='0.2';"></div>
        <div class="rank-info">
          <div class="rank-name">${displayName}</div>
          <div class="rank-job">${row.class_name}</div>
        </div>
        <div class="metric-block">
          <div class="metric-title">우승</div>
          <div class="metric-main">${row.champion_count}회</div>
          <div class="meter"><div class="meter-fill win" style="width:${winPct}%"></div></div>
        </div>
        <div class="metric-block">
          <div class="metric-title">승률</div>
          <div class="metric-main">${Number(row.win_rate).toFixed(2)}%</div>
          <div class="meter"><div class="meter-fill rate" style="width:${ratePct}%"></div></div>
        </div>
        <div class="rank-detail">
          <div class="rank-detail-text">${row.total_matches}전 ${row.win_count}승 ${row.lose_count}패</div>
        </div>
      </div>`;
  }).join("");

  if (Number.isFinite(limit) && sorted.length > limit) {
    listEl.querySelectorAll(".row-hidden").forEach(el => el.remove());

    const msg = limit === 5
      ? "🔒 토너먼트 1회 완료 시 <strong>20위까지</strong>, OP + 호감 완료 또는 <strong>S/SS 혜택</strong> 시 전체 공개"
      : "🔒 OP + 호감 완료 또는 <strong>S/SS 혜택</strong> 시 전체 랭킹 공개";

    listEl.insertAdjacentHTML("beforeend", `<div class="ranking-lock-bar">${msg}</div>`);
  }
  const footerEl = $("rankingListFooter");
  const latestUpdated = sorted.length > 0 ? sorted[0].updated_at : null;
  if (footerEl) footerEl.textContent = "※ 전체 랭킹은 매시간 정각 집계됩니다. 최근 집계: " + formatUpdatedAt(latestUpdated);
}



async function loadAndRender() {
  let rows;
  if (currentPeriod === "week") rows = await loadRankingWeekly(currentMode);
  else if (currentPeriod === "month") rows = await loadRankingMonthly(currentMode);
  else rows = await loadRankingAll(currentMode);

  let filtered = rows;
  if (currentMode === "op") filtered = rows.filter(r => !SUPPORT_ENGRAVINGS.includes(r.engraving_name));

  const sorted = sortRows(filtered);
  const modeLabel = currentMode === "op" ? "OP" : "호감";

  const listTitle = $("rankingListTitle");
  const listSub = $("rankingListSub");
  if (listTitle) listTitle.textContent = `${modeLabel} 직각 랭킹 보드`;
  if (listSub) listSub.textContent = "우승 횟수 기준 정렬";

  renderSummary(sorted);
  renderList(sorted);
  updateAccessBadge();
}

const modeOpBtn = $("modeOpBtn");
const modeFavorBtn = $("modeFavorBtn");
const periodAllBtn = $("periodAllBtn");
const periodWeekBtn = $("periodWeekBtn");
const periodMonthBtn = $("periodMonthBtn");

function setModeActive(mode) { currentMode = mode; modeOpBtn?.classList.toggle("active", mode === "op"); modeFavorBtn?.classList.toggle("active", mode === "favor"); loadAndRender(); }






function setPeriodActive(period) {
  currentPeriod = period;
  periodAllBtn?.classList.toggle("active", period === "all");
  periodWeekBtn?.classList.toggle("active", period === "week");
  periodMonthBtn?.classList.toggle("active", period === "month");
  syncPeriodChecks();
  loadAndRender();
}






modeOpBtn?.addEventListener("click", () => setModeActive("op"));
modeFavorBtn?.addEventListener("click", () => setModeActive("favor"));
periodAllBtn?.addEventListener("click", () => setPeriodActive("all"));
periodWeekBtn?.addEventListener("click", () => setPeriodActive("week"));
periodMonthBtn?.addEventListener("click", () => setPeriodActive("month"));
function syncPeriodChecks() {
  document.querySelectorAll(".ranking-period-card").forEach(card => {
    const check = card.querySelector(".period-card-check");
    if (!check) return;
    if (card.classList.contains("active")) {
      check.style.display = "inline-flex";
    } else {
      check.style.display = "none";
    }
  });
}

async function init() {
  visitorKey = getVisitorKey();
  await loadTodayState();
  await loadGradeBenefit();
  updateAccessBadge();
  await loadAndRender();
  syncPeriodChecks();
}

init();