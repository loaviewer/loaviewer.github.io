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

function shuffle(arr) {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

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
let currentTierType = null;

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
function getTierRevealCount() {
  if (gradeBenefitState.sActive || gradeBenefitState.ssActive) return 6;
  if (completedState.op || completedState.favor) return 6;
  return 2;
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

async function loadTierData(type) {
    const days = 10;
  const { data, error } = await supabase.rpc("get_tier_data", { p_type: type, p_days: days });
  if (error || !data) return null;
  let entries = data.map(r => ({ name: r.engraving_name, winRate: Number(r.win_rate), total: Number(r.total_matches) }));
  if (type === "op") entries = entries.filter(e => !SUPPORT_ENGRAVINGS.includes(e.name));
  return entries;
}

function calcTiers(entries) {
  if (!entries.length) return [[], [], [], [], [], []];
  const sorted = [...entries].sort((a, b) => b.winRate - a.winRate);
  const total = sorted.length;
  const tier6 = total > 10 ? sorted.slice(total - 10) : [];
  const rest = total > 10 ? sorted.slice(0, total - 10) : sorted;
  const tier1 = rest.slice(0, 6);
  const tier2 = rest.slice(6, 15);
  const tier3 = rest.slice(15, 27);
  const rem = rest.slice(27);
  const half = Math.ceil(rem.length / 2);
  return [tier1, tier2, tier3, rem.slice(0, half), rem.slice(half), tier6];
}

/* ============================================================
   렌더
   ============================================================ */
function renderTier(tiers, type) {
  const tierList = $("tierList");
  const revealCount = getTierRevealCount();
  const names = ["1티어", "2티어", "3티어", "4티어", "5티어", "6티어"];
  const classes = ["tier-1", "tier-2", "tier-3", "tier-4", "tier-5", "tier-6"];
  const emojis = ["👑", "⭐", "💜", "💙", "💚", "⚪"];

  let html = "";

  tiers.forEach((tier, i) => {
    if (!tier.length) return;

    const locked = i >= revealCount;
    const lockClass = locked ? "tier-locked" : "";

    html += `
      <div class="tier-block ${classes[i]} ${lockClass}">
        <div class="tier-header">
          <span>${emojis[i]}</span>
          <span class="tier-badge">${names[i]}</span>
          <span class="tier-count">${tier.length}개</span>
        </div>
        <div class="tier-engravings">
          ${shuffle(tier).map(e => `<span class="engraving-chip">${getShortName(e.name)}</span>`).join("")}
        </div>
      </div>
    `;
  });

  if (revealCount < 6) {
    html += `
      <div class="tier-lock-notice">
        🔒 토너먼트 <strong>1회 이상 완료</strong> 시 전체 티어가 공개됩니다.
      </div>
    `;
  }

  tierList.innerHTML = html || '<div style="text-align:center;padding:20px;color:#a49bae;">데이터가 부족합니다.</div>';
}

/* ============================================================
   생성
   ============================================================ */
async function generateTier(type) {
  currentTierType = type;

  const idle = $("tierIdle");
  const loading = $("tierLoading");
  const content = $("tierContent");
  const title = $("tierTitle");
  const sub = $("tierSub");

  const genOpBtn = $("genOpBtn");
  const genFavorBtn = $("genFavorBtn");

  genOpBtn.classList.remove("active-op");
  genFavorBtn.classList.remove("active-favor");

  if (type === "op") genOpBtn.classList.add("active-op");
  else genFavorBtn.classList.add("active-favor");

  idle.style.display = "none";
  content.style.display = "none";
  loading.style.display = "flex";

  const entries = await loadTierData(type);

  if (!entries || !entries.length) {
    loading.style.display = "none";
    idle.style.display = "flex";
    alert("티어 데이터를 불러오지 못했습니다.");
    return;
  }

  const tiers = calcTiers(entries);
  const label = type === "op" ? "OP" : "호감";
  const days = 10;

  const now = new Date();
  const stamp = `${String(now.getFullYear()).slice(2)}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  title.textContent = `${label} 밸런스 티어표`;
  sub.textContent = `최근 ${days}일간 1:1 승률 통합 기준 🕖 ${stamp}`;

  renderTier(tiers, type);

  loading.style.display = "none";
  content.style.display = "block";
}

/* ============================================================
   이벤트
   ============================================================ */
const genOpBtn = $("genOpBtn");
const genFavorBtn = $("genFavorBtn");

if (genOpBtn) genOpBtn.addEventListener("click", () => generateTier("op"));
if (genFavorBtn) genFavorBtn.addEventListener("click", () => generateTier("favor"));

/* ============================================================
   초기화
   ============================================================ */
async function init() {
  visitorKey = getVisitorKey();
  await loadTodayState();
  await loadGradeBenefit();
}

init();