import { supabase, SUPABASE_URL, SUPABASE_KEY } from "./supabase.js";

/* ============================================================
   Supabase
   ============================================================ */

const TEST_MODE_DISABLE_SAVE = false;

/* ============================================================
   공통 상수
   ============================================================ */
const SUPPORT_ENGRAVINGS = ["절실한 구원", "만개", "축복의 오라", "해방자"];
const FAVOR_ONLY_IDS = [8, 12, 40, 52];

// 등급 구간: 유저가 몰리는 중상위(약 70~90%)를 잘게 나눠 한쪽으로 치우치지 않게 조정
//  · SS+는 100만 아니라 상위권(96~) 포함
//  · 기존 A/A-에 몰리던 75~84%대를 S- ~ A- 여러 칸으로 분산
const GRADE_TABLE = [
  { grade: "SS+", min: 96, max: 100 }, { grade: "SS", min: 93, max: 95 }, { grade: "SS-", min: 90, max: 92 },
  { grade: "S+", min: 87, max: 89 }, { grade: "S", min: 84, max: 86 }, { grade: "S-", min: 81, max: 83 },
  { grade: "A+", min: 78, max: 80 }, { grade: "A", min: 75, max: 77 }, { grade: "A-", min: 72, max: 74 },
  { grade: "B+", min: 69, max: 71 }, { grade: "B", min: 66, max: 68 }, { grade: "B-", min: 63, max: 65 },
  { grade: "C+", min: 59, max: 62 }, { grade: "C", min: 55, max: 58 }, { grade: "C-", min: 51, max: 54 },
  { grade: "D+", min: 46, max: 50 }, { grade: "D", min: 41, max: 45 }, { grade: "D-", min: 36, max: 40 },
  { grade: "E+", min: 31, max: 35 }, { grade: "E", min: 26, max: 30 }, { grade: "E-", min: 21, max: 25 },
  { grade: "F+", min: 16, max: 20 }, { grade: "F", min: 11, max: 15 }, { grade: "F-", min: 0, max: 10 }
];

const GRADE_COLORS = {
  "SS+": "#ffd700", "SS": "#ffd700", "SS-": "#ffd700",
  "S+": "#7fc6ff", "S": "#7fc6ff", "S-": "#7fc6ff",
  "A+": "#ff7755", "A": "#ff7755", "A-": "#ff7755",
  "B+": "#ffb060", "B": "#ffb060", "B-": "#ffb060",
  "C+": "#c79cff", "C": "#c79cff", "C-": "#c79cff",
  "D+": "#a9dfff", "D": "#a9dfff", "D-": "#a9dfff",
  "E+": "#8ee8b0", "E": "#8ee8b0", "E-": "#8ee8b0",
  "F+": "#999999", "F": "#999999", "F-": "#999999"
};

const GRADE_COMMENTS = {
  "SS+": ["완벽한 판단입니다! 모든 선택이 정확했어요.", "100% 달성! 전설급 결과입니다."],
  "SS": ["거의 완벽에 가까운 판단이었어요.", "정석적인 최고의 선택들이었습니다."],
  "SS-": ["아주 강한 판단이었어요.", "충분히 인상적인 결과입니다."],
  "S+": ["매우 좋은 결과입니다.", "상당히 높은 완성도로 풀었습니다."],
  "S": ["무난하게 좋은 결과입니다.", "판단이 꽤 괜찮았습니다."],
  "S-": ["좋은 편의 결과입니다.", "상위권 진입 직전의 흐름이 보였습니다."],
  "A+": ["꽤 괜찮은 결과입니다.", "중상위권 판정입니다."],
  "A": ["평균 이상은 확실히 했습니다.", "기본기는 잘 살렸습니다."],
  "A-": ["나쁘지 않은 결과입니다.", "무난한 편이지만 아쉬움이 남습니다."],
  "B+": ["무난한 편이지만 다듬을 여지가 있습니다."],
  "B": ["평범한 결과입니다."],
  "B-": ["아쉬움이 조금 남는 결과입니다."],
  "C+": ["아쉽지만 가능성은 충분합니다."],
  "C": ["선택이 많이 갈렸어요."],
  "C-": ["선택이 자주 빗나갔어요."],
  "D+": ["선택이 많이 엇갈렸어요."],
  "D": ["판단이 자주 빗나갔어요."],
  "D-": ["많이 흔들렸습니다."],
  "E+": ["선택이 대부분 빗나갔어요."],
  "E": ["거의 대부분 엇갈렸습니다."],
  "E-": ["메타 파악이 더 필요한 것 같습니다."],
  "F+": ["집중이 필요합니다."],
  "F": ["토너먼트 흐름을 따라가기 어려웠던 판정입니다."],
  "F-": ["이번엔 흐름이 맞지 않았어요. 다시 도전!"]
};

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

const classGroups = {
  "전사":["워로드","버서커","디스트로이어","홀리나이트","슬레이어","발키리"],
  "무도가":["배틀마스터","인파이터","기공사","창술사","스트라이커","브레이커"],
  "헌터":["데빌헌터","블래스터","호크아이","스카우터","건슬링어"],
  "마법사":["서머너","아르카나","바드","소서리스"],
  "암살자":["블레이드","데모닉","리퍼","소울이터"],
  "스페셜리스트":["도화가","기상술사","환수사","차원술사"],
  "가디언나이트":["가디언나이트"]
};

const classColorMap = {
  "워로드":"engr-warrior","버서커":"engr-warrior","디스트로이어":"engr-warrior","홀리나이트":"engr-warrior","슬레이어":"engr-warrior","발키리":"engr-warrior",
  "배틀마스터":"engr-fighter","인파이터":"engr-fighter","기공사":"engr-fighter","창술사":"engr-fighter","스트라이커":"engr-fighter","브레이커":"engr-fighter",
  "데빌헌터":"engr-hunter","블래스터":"engr-hunter","호크아이":"engr-hunter","스카우터":"engr-hunter","건슬링어":"engr-hunter",
  "서머너":"engr-mage","아르카나":"engr-mage","바드":"engr-mage","소서리스":"engr-mage",
  "블레이드":"engr-assassin","데모닉":"engr-assassin","리퍼":"engr-assassin","소울이터":"engr-assassin",
  "도화가":"engr-specialist","기상술사":"engr-specialist","환수사":"engr-specialist","차원술사":"engr-specialist",
  "가디언나이트":"engr-guardian"
};

const OP_LINES = [
  "어느 직각이 더 강할까?","최강 직각 월드컵","현재 메타의 승자는?",
  "더 높은 티어를 골라주세요","성능으로 압도하라","진검승부",
  "딜킹을 가려보자","실전에서 더 강한 직각은?","최종 승자는 누구?"
];

const FAVOR_LINES = [
  "어느 직각이 더 끌릴까?","최애 직각 월드컵","당신의 취향 저격은?",
  "마음이 가는 쪽을 골라주세요","가장 애정하는 직각은?",
  "성능보다 마음이 먼저","나만의 원픽 직각은?"
];

/* ============================================================
   유틸
   ============================================================ */
const $ = (id) => document.getElementById(id);

function getShortName(full) { return fullToShortMap[full] || full; }
function getIconPath(name) { return `./icon/${getShortName(name).replace(/\s+/g, "")}.png`; }
function getColorClass(cls) { return classColorMap[cls] || ""; }

function shuffle(arr) {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

function calcGrade(score, total) {
  if (!total) return "F-";
  const rate = Math.round((score / total) * 100);
  for (const row of GRADE_TABLE) {
    if (rate >= row.min && rate <= row.max) return row.grade;
  }
  return "F-";
}

function getRandomComment(grade) {
  const list = GRADE_COMMENTS[grade] || ["잘 하셨습니다!"];
  return list[Math.floor(Math.random() * list.length)];
}

function getStampClass(grade) {
  if (!grade) return "";
  const g = grade.replace("+", "").replace("-", "");
  return "stamp-" + g.toLowerCase();
}

function getNow() { return new Date(); }

function getDateKey() {
  const n = getNow();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}

function getMonthKey() {
  const n = getNow();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
}

function getWeekKey() {
  const n = getNow();
  const f = new Date(n.getFullYear(), 0, 1);
  const p = Math.floor((n - f) / 86400000);
  return `${n.getFullYear()}-W${String(Math.ceil((p + f.getDay() + 1) / 7)).padStart(2, "0")}`;
}

function formatStampDate(dk) {
  const [y, m, d] = dk.split("-");
  return `${y.slice(2)} ${m} ${d}`;
}

function formatUpdatedAt(v) {
  if (!v) return "-";
  const d = new Date(v);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function getRoundLabel(count) {
  if (count <= 2) return "FINAL";
  if (count === 4) return "4강";
  if (count === 8) return "8강";
  if (count === 16) return "16강";
  if (count === 32) return "32강";
  return "예선";
}

function getBattleLine(type) {
  const key = type === "op" ? "loa_line_pool_op" : "loa_line_pool_favor";
  const source = type === "op" ? OP_LINES : FAVOR_LINES;
  let pool = [];
  try { pool = JSON.parse(localStorage.getItem(key) || "[]"); } catch { pool = []; }
  if (!pool.length) pool = shuffle([...source]);
  const picked = pool.pop();
  localStorage.setItem(key, JSON.stringify(pool));
  return picked || source[0];
}

function getAuraClass(cls) {
  if (["워로드","버서커","디스트로이어","슬레이어"].includes(cls)) return "aura-power";
  if (["배틀마스터","인파이터","기공사","창술사","스트라이커","브레이커"].includes(cls)) return "aura-ki";
  if (["데빌헌터","블래스터","호크아이","스카우터","건슬링어"].includes(cls)) return "aura-gun";
  if (["블레이드","데모닉","리퍼","소울이터"].includes(cls)) return "aura-dark";
  if (["서머너","아르카나","소서리스","가디언나이트"].includes(cls)) return "aura-element";
  if (["환수사","도화가","기상술사","차원술사"].includes(cls)) return "aura-flower";
  if (["바드","홀리나이트","발키리"].includes(cls)) return "aura-holy";
  return "aura-holy";
}

function getStageColor(count) {
  if (count <= 2) return "stage-red";
  if (count <= 4) return "stage-yellow";
  if (count <= 8) return "stage-purple";
  if (count <= 16) return "stage-blue";
  return "stage-green";
}

function getVisitorKey() {
  let k = localStorage.getItem("loa_tournament_visitor_key");
  if (!k) {
    k = "loa_tournament_user_" + crypto.randomUUID();
    localStorage.setItem("loa_tournament_visitor_key", k);
  }
  return k;
}

async function getClientIP() {
  const sources = [
    () => fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(3000) }).then(r => r.json()).then(d => d.ip),
    () => fetch("https://api64.ipify.org?format=json", { signal: AbortSignal.timeout(3000) }).then(r => r.json()).then(d => d.ip)
  ];
  for (const source of sources) {
    try {
      const ip = await source();
      if (ip && typeof ip === "string" && ip.includes(".")) return ip;
    } catch {}
  }
  return null;
}

function getWeeklyWinnerResetKey() {
  const now = new Date();
  const reset = new Date(now);
  reset.setHours(0, 0, 0, 0);

  const day = reset.getDay(); // 0=일요일, 3=수요일
  const diff = day >= 3 ? day - 3 : day + 4; // 가장 최근 수요일까지 차이
  reset.setDate(reset.getDate() - diff);

  const y = reset.getFullYear();
  const m = String(reset.getMonth() + 1).padStart(2, "0");
  const d = String(reset.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

async function loadRecentWinnerExclusions(type) {
  const clientIP = await getClientIP();
  const startKey = getWeeklyWinnerResetKey();

  let query = supabase
    .from("sessions")
    .select("winner_engraving")
    .eq("tournament_type", type)
    .gte("date_key", startKey);

  query = clientIP
    ? query.or(`visitor_key.eq.${visitorKey},client_ip.eq.${clientIP}`)
    : query.eq("visitor_key", visitorKey);

  const { data, error } = await query;
  if (error || !data) return [];
  return [...new Set(data.map(r => r.winner_engraving))];
}






/* ============================================================
   커스텀 알림
   ============================================================ */
function showCustomAlert(icon, title, desc) {
  const overlay = document.getElementById("customAlertOverlay");
  const iconEl = document.getElementById("customAlertIcon");
  const titleEl = document.getElementById("customAlertTitle");
  const descEl = document.getElementById("customAlertDesc");

  if (!overlay || !iconEl || !titleEl || !descEl) {
    alert(desc);
    return;
  }

  iconEl.textContent = icon || "ℹ️";
  titleEl.textContent = title || "알림";
  descEl.innerHTML = desc || "";
  overlay.classList.add("show");
}

function hideCustomAlert() {
  const overlay = document.getElementById("customAlertOverlay");
  if (overlay) overlay.classList.remove("show");
}







/* ============================================================
   DOM
   ============================================================ */
const shutter = $("tournamentShutter");
const arenaIdle = $("arenaIdle");
const arenaZone = $("arenaZone");
const stageWrap = $("tournamentStageWrap");

const phaseClass = $("phaseClass");
const phaseBattle = $("phaseBattle");
const phaseWinner = $("phaseWinner");
const arenaLoadingOverlay = $("arenaLoadingOverlay");
const arenaLoadingText = $("arenaLoadingText");

const classPhaseBadge = $("classPhaseBadge");
const classSelectGrid = $("classSelectGrid");
const classCancelBtn = $("classCancelBtn");

const battleProgressPct = $("battleProgressPct");
const battleProgressFill = $("battleProgressFill");

const leftFighter = $("leftFighter");
const rightFighter = $("rightFighter");
const leftAura = $("leftAura");
const rightAura = $("rightAura");
const leftIcon = $("leftIcon");
const rightIcon = $("rightIcon");
const leftFighterName = $("leftFighterName");
const leftFighterClass = $("leftFighterClass");
const rightFighterName = $("rightFighterName");
const rightFighterClass = $("rightFighterClass");
const battleQuitBtn = $("battleQuitBtn");

const winnerBadge = $("winnerBadge");
const winnerEngrName = $("winnerEngrName");
const winnerEngrClass = $("winnerEngrClass");
const winnerStampArea = $("winnerStampArea");
const winnerStamp = $("winnerStamp");
const winnerStampDate = $("winnerStampDate");
const winnerStampGrade = $("winnerStampGrade");
const winnerGradeInfo = $("winnerGradeInfo");
const winnerComment = $("winnerComment");
const winnerConfirmBtn = $("winnerConfirmBtn");

const opStartBtn = $("opStartBtn");
const favorStartBtn = $("favorStartBtn");
const opShutterStamp = $("opShutterStamp");
const favorShutterStamp = $("favorShutterStamp");

const rankingSection = $("rankingSection");
const rankingLock = $("rankingLock");
const rankingInner = $("rankingInner");
const rankingTitle = $("rankingTitle");
const rankingSub = $("rankingSub");
const rankingSummary = $("rankingSummary");
const rankingList = $("rankingList");
const rankingFooter = $("rankingFooter");
const modeOpBtn = $("modeOpBtn");
const modeFavorBtn = $("modeFavorBtn");
const periodAllBtn = $("periodAllBtn");
const periodWeekBtn = $("periodWeekBtn");
const periodMonthBtn = $("periodMonthBtn");

const quitOverlay = $("quitOverlay");
const quitCancelBtn = $("quitCancelBtn");
const quitConfirmBtn = $("quitConfirmBtn");

const guideModal = $("guideModal");
const closeGuideBtn = $("closeGuideBtn");
const gradeGrid = $("gradeGrid");

const winnerAudio = $("winnerAudio");
const flipAudio = $("flipAudio");
const soundIcon = $("soundIcon");
const soundSlider = $("soundSlider");
const soundValue = $("soundValue");

/* ============================================================
   상태
   ============================================================ */

let visitorKey = null;
let completedState = { op: false, favor: false };
let todayOpGrade = null;
let currentBoardMode = null;

const S_BENEFIT_GRADES = ["S+", "S", "S-"];
const SS_BENEFIT_GRADES = ["SS+", "SS", "SS-"];

let gradeBenefitState = {
  sActive: false,
  ssActive: false,
  sExpireAt: null,
  ssExpireAt: null
};

let allCandidates = [];
let rankingCache = {};
let winRateCache = {};

let currentTournamentType = null;
let selectedClass = null;
let currentRoundCandidates = [];
let nextRoundCandidates = [];
let currentIndex = 0;
let currentLeft = null;
let currentRight = null;
let totalMatches = 0;
let completedMatches = 0;
let battleLogs = [];
let pendingWinner = null;
let opScore = 0;
let opMaxScore = 0;
let isChoosing = false;
let isFinalizingTournament = false;


/* ============================================================
   등급 분포 통계
   ============================================================ */
let gradeDistStatsCache = null;

async function loadGradeDistStats() {
  if (gradeDistStatsCache) return gradeDistStatsCache;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_grade_distribution`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({ p_type: "op", p_start_date: "2026-04-07" })
    });
    if (!res.ok) return null;
    const data = await res.json();
    const counts = {};
    let total = 0;
    GRADE_TABLE.forEach(g => counts[g.grade] = 0);
    if (Array.isArray(data)) {
      data.forEach(row => {
        const c = parseInt(row.grade_count, 10) || 0;
        counts[row.grade] = c;
        total += c;
      });
    }
    gradeDistStatsCache = { counts, total };
    return gradeDistStatsCache;
  } catch {
    return null;
  }
}

function getGradeDistributionInfo(grade, stats) {
  if (!stats || !stats.total) return null;
  const counts = stats.counts;
  const total = stats.total;
  const idx = GRADE_TABLE.findIndex(g => g.grade === grade);
  if (idx === -1) return null;

  let betterCount = 0;
  for (let i = 0; i < idx; i++) {
    betterCount += counts[GRADE_TABLE[i].grade] || 0;
  }
  const sameCount = counts[grade] || 0;
  let topPct = Number(((betterCount / total) * 100).toFixed(1));
  if (idx === 0) topPct = 0.1;

  return {
    topPct,
    samePct: Number(((sameCount / total) * 100).toFixed(1)),
    sameCount,
    total
  };
}



/* 조별 예선 상태 */
const GROUP_NAMES = ["A", "B", "C", "D"];
const GROUP_COLORS = { A: "stage-green", B: "stage-blue", C: "stage-purple", D: "stage-yellow" };

let subgroupQueue = [];
let currentGroupIndex = 0;
let groupResults = { A: [], B: [], C: [], D: [] };
let isQualifierPhase = true;
let mainRoundCandidates = [];
let recentWinnerCount = 0;

// 조 대진 현황판
let currentBigGroupRoster = [];
let currentBigGroupName = null;
let bigGroupStatus = {};
let bigGroupMatchLog = [];
let bigGroupMatchCounter = 0;
let currentMatchLogIndex = null;
let groupLogExpanded = false;
const GROUP_LOG_COLLAPSED_COUNT = 5;


/* ============================================================
   사운드
   ============================================================ */
let soundEnabled = true;
let masterVolume = 50;

function updateSoundUI() {
  if (!soundSlider || !soundValue || !soundIcon) return;
  soundSlider.value = masterVolume;
  soundValue.textContent = soundEnabled ? `${masterVolume}%` : "OFF";
  if (!soundEnabled || masterVolume === 0) soundIcon.textContent = "🔇";
  else if (masterVolume <= 50) soundIcon.textContent = "🔉";
  else soundIcon.textContent = "🔊";
}

function applySoundVolume() {
  const vol = soundEnabled ? masterVolume / 100 : 0;
  if (winnerAudio) winnerAudio.volume = vol;
  if (flipAudio) flipAudio.volume = vol;
}

if (soundSlider) {
  soundSlider.addEventListener("input", (e) => {
    masterVolume = Number(e.target.value);
    if (masterVolume > 0) soundEnabled = true;
    updateSoundUI();
    applySoundVolume();
  });
}

if (soundIcon) {
  soundIcon.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    if (!soundEnabled) masterVolume = 0;
    else if (masterVolume === 0) masterVolume = 50;
    updateSoundUI();
    applySoundVolume();
  });
}

function playFlip() {
  if (!soundEnabled || masterVolume <= 0) return;
  try { flipAudio.currentTime = 0; flipAudio.volume = masterVolume / 100; flipAudio.play().catch(() => {}); } catch {}
}

function playWinner() {
  if (!soundEnabled || masterVolume <= 0) return;
  try { winnerAudio.currentTime = 0; winnerAudio.volume = masterVolume / 100; winnerAudio.play().catch(() => {}); } catch {}
}

/* ============================================================
   데이터 로드
   ============================================================ */
async function loadCandidates() {
  const { data, error } = await supabase
    .from("candidates")
    .select("id,class_name,engraving_name,enabled")
    .order("id", { ascending: true });
  if (error || !data) { console.error("loadCandidates error", error); return; }
  allCandidates = data;
}

async function loadRecentWinRates(type) {
  winRateCache = {};
  const { data, error } = await supabase.rpc("get_recent_winrates", { p_type: type, p_days: 15 });
  if (error || !data) return;
  for (const row of data) { winRateCache[row.engraving_name] = Number(row.win_rate); }
}

function getWinRate(name) {
  return winRateCache[name] !== undefined ? winRateCache[name] : 0.5;
}

async function preloadIcons() {
  if (!allCandidates.length) return;
  const paths = [...new Set(allCandidates.map(c => getIconPath(c.engraving_name)))];
  await Promise.all(paths.map(src => new Promise(resolve => {
    const img = new Image();
    img.onload = img.onerror = resolve;
    img.src = src;
  })));
}


function parseDateKeyToDate(dateKey) {
  if (!dateKey) return null;
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function getMonthEndExpireAt(baseDate) {
  if (!baseDate) return null;
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
}

function getSBenefitExpireAt(dateKey) {
  const baseDate = parseDateKeyToDate(dateKey);
  return getMonthEndExpireAt(baseDate);
}

function getSSBenefitExpireAt(dateKey) {
  const baseDate = parseDateKeyToDate(dateKey);
  if (!baseDate) return null;

  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() + 3,
    0,
    23,
    59,
    59,
    999
  );
}

async function loadGradeBenefitState() {
  gradeBenefitState = {
    sActive: false,
    ssActive: false,
    sExpireAt: null,
    ssExpireAt: null
  };

  const { data, error } = await supabase
    .from("sessions")
    .select("grade,date_key")
    .eq("visitor_key", visitorKey)
    .not("grade", "is", null);

  if (error || !data || !data.length) return;

  const now = new Date();
  let latestSExpire = null;
  let latestSSExpire = null;

  data.forEach(row => {
    if (!row.grade || !row.date_key) return;

    if (S_BENEFIT_GRADES.includes(row.grade)) {
      const expireAt = getSBenefitExpireAt(row.date_key);
      if (expireAt && expireAt >= now) {
        if (!latestSExpire || expireAt > latestSExpire) {
          latestSExpire = expireAt;
        }
      }
    }

    if (SS_BENEFIT_GRADES.includes(row.grade)) {
      const expireAt = getSSBenefitExpireAt(row.date_key);
      if (expireAt && expireAt >= now) {
        if (!latestSSExpire || expireAt > latestSSExpire) {
          latestSSExpire = expireAt;
        }
      }
    }
  });

  gradeBenefitState.sActive = !!latestSExpire;
  gradeBenefitState.ssActive = !!latestSSExpire;
  gradeBenefitState.sExpireAt = latestSExpire;
  gradeBenefitState.ssExpireAt = latestSSExpire;
}






function applyTournamentEntryState() {
  const isSSExempt = gradeBenefitState.ssActive;

  if (opStartBtn) {
    opStartBtn.disabled = isSSExempt;
    opStartBtn.classList.toggle("exempt-disabled", isSSExempt);
    opStartBtn.textContent = isSSExempt
      ? "🏅 SS 혜택 활성 · OP 토너먼트 면제"
      : "🔥 OP 토너먼트 시작";
  }

  if (favorStartBtn) {
    favorStartBtn.disabled = isSSExempt;
    favorStartBtn.classList.toggle("exempt-disabled", isSSExempt);
    favorStartBtn.textContent = isSSExempt
      ? "🏅 SS 혜택 활성 · 호감 토너먼트 면제"
      : "💗 호감 토너먼트 시작";
  }
}



async function loadTodayParticipation() {
  visitorKey = getVisitorKey();

  const { data, error } = await supabase
    .from("sessions")
    .select("tournament_type,date_key,grade")
    .eq("visitor_key", visitorKey)
    .eq("date_key", getDateKey());

  if (error) return;

  completedState.op = !!data.find(r => r.tournament_type === "op");
  completedState.favor = !!data.find(r => r.tournament_type === "favor");

  if (completedState.op) {
    const opRow = data.find(r => r.tournament_type === "op");
    todayOpGrade = opRow?.grade || null;
    renderShutterStamp("op", todayOpGrade);
  }

  if (completedState.favor) {
    renderShutterStamp("favor", null);
  }

  await loadGradeBenefitState();
  applyTournamentEntryState();
  updateRankingLockState();
}




function hasGradeBenefitAllAccess() {
  return gradeBenefitState.sActive || gradeBenefitState.ssActive;
}

function getRankingRevealLimit() {
  if (hasGradeBenefitAllAccess()) return Infinity;
  if (completedState.op && completedState.favor) return Infinity;
  if (completedState.op || completedState.favor) return 20;
  return 5;
}

function getRankingStatusText() {
  if (gradeBenefitState.ssActive) {
    return "SS 혜택 활성 · 전체 랭킹 공개 중";
  }
  if (gradeBenefitState.sActive) {
    return "S 혜택 활성 · 전체 랭킹 공개 중";
  }
  if (completedState.op && completedState.favor) {
    return "OP + 호감 완료 · 전체 랭킹 공개";
  }
  if (completedState.op || completedState.favor) {
    return "토너먼트 1회 완료 · 20위까지 공개";
  }
  return "기본 열람 · 5위까지 공개";
}





/* ============================================================
   셔터 도장
   ============================================================ */
function renderShutterStamp(type, grade) {
  const el = type === "op" ? opShutterStamp : favorShutterStamp;
  if (!el) return;

  if (type === "op" && grade) {
    el.innerHTML = `
      <div class="shutter-stamp-circle ${getStampClass(grade)}">
        <div class="shutter-stamp-date">${formatStampDate(getDateKey())}</div>
        <div class="shutter-stamp-grade">${grade}</div>
        <div class="shutter-stamp-done">참여완료</div>
      </div>`;
  } else {
    el.innerHTML = `
      <div class="shutter-stamp-circle stamp-favor">
        <div class="shutter-stamp-date">${formatStampDate(getDateKey())}</div>
        <div class="shutter-stamp-done">참여완료</div>
      </div>`;
  }
}

/* ============================================================
   클래스 선택 UI
   ============================================================ */
function buildClassSelectGrid() {
  classSelectGrid.innerHTML = Object.entries(classGroups).map(([group, classes]) => `
    <div class="class-group-row">
      <div class="class-group-tag">${group}</div>
      <div class="class-group-btns">
        ${classes.map(c => `<button class="class-pick-btn" data-class="${c}">${c}</button>`).join("")}
      </div>
    </div>
  `).join("");

  classSelectGrid.querySelectorAll(".class-pick-btn").forEach(btn => {
    btn.addEventListener("click", () => startBattle(btn.dataset.class));
  });
}

/* ============================================================
   경기장 열기/닫기
   ============================================================ */
function showPhase(p) {
  phaseClass.classList.remove("active");
  phaseBattle.classList.remove("active");
  phaseWinner.classList.remove("active");
  const phaseQualified = $("phaseQualified");
  if (phaseQualified) phaseQualified.classList.remove("active");
  p.classList.add("active");
}

function openArena(mode) {
  currentTournamentType = mode;
  shutter.classList.add("rolled-up");
  arenaIdle.classList.add("hidden");
  arenaZone.classList.add("open");
  stageWrap.classList.add("arena-active");
  stageWrap.classList.remove("mode-op", "mode-favor");
  stageWrap.classList.add(mode === "op" ? "mode-op" : "mode-favor");

  classPhaseBadge.textContent = mode === "op" ? "OP TOURNAMENT" : "FAVOR TOURNAMENT";
  classPhaseBadge.className = "arena-phase-badge " + (mode === "op" ? "badge-op" : "badge-favor");

  buildClassSelectGrid();
  showPhase(phaseClass);

  setTimeout(() => { arenaZone.scrollIntoView({ behavior: "smooth", block: "start" }); }, 340);
}



function showArenaLoading(message = "경기장을 불러오는 중입니다...") {
  if (arenaLoadingText) arenaLoadingText.textContent = message;
  if (arenaLoadingOverlay) arenaLoadingOverlay.classList.add("show");
}

function hideArenaLoading() {
  if (arenaLoadingOverlay) arenaLoadingOverlay.classList.remove("show");
}




function closeArena() {
  hideArenaLoading();

  shutter.classList.remove("rolled-up");
  arenaIdle.classList.remove("hidden");
  arenaZone.classList.remove("open");
  stageWrap.classList.remove("arena-active", "mode-op", "mode-favor");

  currentTournamentType = null;
  selectedClass = null;
  currentIndex = 0;
  currentLeft = null;
  currentRight = null;
  totalMatches = 0;
  completedMatches = 0;
  battleLogs = [];
  pendingWinner = null;
  opScore = 0;
  opMaxScore = 0;
  isChoosing = false;

  subgroupQueue = [];
  groupResults = { A: [], B: [], C: [], D: [] };
  currentGroupIndex = 0;
  isQualifierPhase = true;
  mainRoundCandidates = [];
  resetGroupPanel();
}






/* ============================================================
   시작하기
   ============================================================ */
async function handleStart(type) {
  if (gradeBenefitState.ssActive) {
        showCustomAlert("🏅", "SS 혜택 활성", "SS 등급 혜택이 활성화되어 있어<br>토너먼트가 면제됩니다.");
    return;
  }

  if (type === "op" && completedState.op) {
        showCustomAlert("✅", "이미 완료!", "OP 토너먼트는 오늘 이미 완료했습니다.<br>내일 다시 참여할 수 있어요.");
    return;
  }

  if (type === "favor" && completedState.favor) {
        showCustomAlert("✅", "이미 완료!", "호감 토너먼트는 오늘 이미 완료했습니다.<br>내일 다시 참여할 수 있어요.");
    return;
  }

  openArena(type);
}
/* ============================================================
   미니 조 큐 생성
   ============================================================ */
function buildSubgroupQueue(filtered) {
  const displayPools = { A: [], B: [], C: [], D: [] };
  filtered.forEach((c, idx) => displayPools[GROUP_NAMES[idx % 4]].push(c));

  const queue = [];
  GROUP_NAMES.forEach(g => {
    const members = shuffle(displayPools[g]);
    const subPools = [[], [], [], []];
    members.forEach((c, idx) => subPools[idx % 4].push(c));
    subPools.forEach(sp => queue.push({ displayGroup: g, pool: sp }));
  });
  return queue;
}

/* ============================================================
   부전승 + 라운드 시작
   ============================================================ */
function pickByeCandidate(list) {
  if (currentTournamentType === "op") {
    let best = list[0];
    let bestRate = getWinRate(best.engraving_name);
    for (let i = 1; i < list.length; i++) {
      const r = getWinRate(list[i].engraving_name);
      if (r > bestRate) { best = list[i]; bestRate = r; }
    }
    return best;
  }
  return list[Math.floor(Math.random() * list.length)];
}

function startNewRound(candidates) {
  currentRoundCandidates = [...candidates];
  nextRoundCandidates = [];
  currentIndex = 0;

  if (currentRoundCandidates.length > 1 && currentRoundCandidates.length % 2 === 1) {
    const bye = pickByeCandidate(currentRoundCandidates);
    currentRoundCandidates = currentRoundCandidates.filter(c => c !== bye);
    nextRoundCandidates.push(bye);

    if (isQualifierPhase) {
      bigGroupMatchCounter++;
      bigGroupMatchLog.push({ num: bigGroupMatchCounter, type: "bye", name: bye.engraving_name });
      renderGroupPanel();
    }
  }
}

/* ============================================================
   진행 단계 배지
   ============================================================ */
function getMatchPhaseLabel(groupName, matchNum) {
  const totalInGroup = currentBigGroupRoster.length - 1;
  const half = Math.ceil(totalInGroup / 2);
  if (matchNum <= half) return `${groupName}조 예선 진행 중`;
  return `${groupName}조 본선 선발전`;
}

function updateBattleStageUI() {
  const stageBadge = $("battleStageBadge");
  if (!stageBadge) return;

  if (isQualifierPhase && currentBigGroupName) {
    stageBadge.textContent = getMatchPhaseLabel(currentBigGroupName, bigGroupMatchCounter);
  } else if (!isQualifierPhase) {
    const count = currentRoundCandidates.length;
    if (count <= 2) stageBadge.textContent = "결승전";
    else if (count <= 4) stageBadge.textContent = "4강";
    else if (count <= 8) stageBadge.textContent = "8강";
    else stageBadge.textContent = "16강";
  }
}


/* ============================================================
   진행바 구간 렌더
   ============================================================ */
function renderProgressSegments(n) {
  const wrap = $("battleProgressSegments");
  if (!wrap) return;
  if (n <= 16) { wrap.innerHTML = ""; return; }

  const total = n - 1;
  const bounds = [
    { label: "예선", matches: n - 16 },
    { label: "16강", matches: 8 },
    { label: "8강", matches: 4 },
    { label: "4강", matches: 2 },
    { label: "결승", matches: 1 }
  ];

  let cum = 0;
  wrap.innerHTML = bounds.map(b => {
    const startPct = (cum / total) * 100;
    cum += b.matches;
    const endPct = (cum / total) * 100;
    return `<div class="progress-segment" style="left:${startPct}%; width:${endPct - startPct}%;">
      <span class="progress-segment-label">${b.label}</span>
    </div>`;
  }).join("");
}

/* ============================================================
   조 대진 현황판
   ============================================================ */
function initGroupPanel(displayGroup, subgroupIdx) {
  const startIdx = subgroupIdx - (subgroupIdx % 4);
  let roster = [];
  for (let i = startIdx; i < startIdx + 4; i++) {
    if (subgroupQueue[i]) roster = roster.concat(subgroupQueue[i].pool);
  }
  currentBigGroupRoster = roster;
  currentBigGroupName = displayGroup;
  bigGroupStatus = {};
  roster.forEach(c => { bigGroupStatus[c.engraving_name] = "alive"; });
  bigGroupMatchLog = [];
  bigGroupMatchCounter = 0;
  groupLogExpanded = false;
}

function resetGroupPanel() {
  currentBigGroupRoster = [];
  currentBigGroupName = null;
  bigGroupStatus = {};
  bigGroupMatchLog = [];
  bigGroupMatchCounter = 0;
  currentMatchLogIndex = null;
  groupLogExpanded = false;
  renderGroupPanel();
}

function renderGroupPanel() {
  const panel = $("battleGroupPanel");
  if (!panel) return;

  if (!isQualifierPhase || !currentBigGroupRoster.length) {
    panel.innerHTML = "";
    panel.style.display = "none";
    return;
  }
  panel.style.display = "block";

  const aliveList = currentBigGroupRoster.filter(c => bigGroupStatus[c.engraving_name] !== "eliminated");
  const eliminatedList = currentBigGroupRoster.filter(c => bigGroupStatus[c.engraving_name] === "eliminated");

  const aliveHtml = aliveList.map(c => `<span class="group-roster-chip">${getShortName(c.engraving_name)}</span>`).join("");
  const eliminatedHtml = eliminatedList.map(c => `<span class="group-roster-chip eliminated">${getShortName(c.engraving_name)}</span>`).join("");

  // 완료된 경기만 노출 (pending 제외)
  const finishedLogs = bigGroupMatchLog.filter(e => e.type === "bye" || e.status === "done");
  const reversedLogs = [...finishedLogs].reverse();

  const visibleLogs = groupLogExpanded ? reversedLogs : reversedLogs.slice(0, GROUP_LOG_COLLAPSED_COUNT);

  const renderTickerRow = (entry) => {
    if (entry.type === "bye") {
      return `<div class="match-ticker-row bye">
        <span class="ticker-num">${entry.num}경기</span>
        <span class="ticker-body">
          <span class="ticker-bye-name">${getShortName(entry.name)}</span>
          <span class="ticker-bye-tag">부전승</span>
        </span>
      </div>`;
    }

    const isLeftWinner = entry.winnerName === entry.leftName;
    const winName = isLeftWinner ? entry.leftName : entry.rightName;
    const loseName = isLeftWinner ? entry.rightName : entry.leftName;

    return `<div class="match-ticker-row">
      <span class="ticker-num">${entry.num}경기</span>
      <span class="ticker-body">
        <span class="ticker-winner">${getShortName(winName)}</span>
        <span class="ticker-vs">승</span>
        <span class="ticker-loser">${getShortName(loseName)}</span>
      </span>
    </div>`;
  };

  const logHtml = visibleLogs.map(renderTickerRow).join("");

  const hasMore = reversedLogs.length > GROUP_LOG_COLLAPSED_COUNT;
  const toggleHtml = hasMore
    ? `<button type="button" class="group-log-toggle-btn" id="groupLogToggleBtn">${groupLogExpanded ? "접기 ▲" : `전체 기록 보기 (${reversedLogs.length}) ▼`}</button>`
    : "";

  const aliveCount = aliveList.length;
  const eliminatedCount = eliminatedList.length;

  panel.innerHTML = `
    <div class="group-panel-header">
      <div class="group-panel-title">${currentBigGroupName}조 대진 현황</div>
      <div class="group-panel-sub">생존 ${aliveCount}명 · 탈락 ${eliminatedCount}명 · 총 ${currentBigGroupRoster.length}명</div>
    </div>

    <div class="group-roster-section">
      <div class="group-roster-label">생존</div>
      <div class="group-roster-list">${aliveHtml || '<span class="group-roster-chip eliminated">없음</span>'}</div>
    </div>

    ${eliminatedCount > 0 ? `
    <div class="group-roster-section">
      <div class="group-roster-label">탈락</div>
      <div class="group-roster-list">${eliminatedHtml}</div>
    </div>
    ` : ""}

    <div class="group-match-section">
      <div class="group-match-label">경기 기록</div>
      <div class="match-ticker-list">${logHtml || '<div class="match-ticker-empty">아직 완료된 경기가 없습니다.</div>'}</div>
      ${toggleHtml}
    </div>
  `;
}

/* ============================================================
   대진 시작
   ============================================================ */



async function startBattle(className) {
  selectedClass = className;
  showArenaLoading("경기장을 불러오는 중입니다...");

  try {
    let pool = currentTournamentType === "favor"
      ? allCandidates.filter(i => i.enabled || FAVOR_ONLY_IDS.includes(i.id))
      : allCandidates.filter(i => i.enabled);

    const recentWinnersPromise = loadRecentWinnerExclusions(currentTournamentType);
    const winRatePromise = currentTournamentType === "op"
      ? loadRecentWinRates("op")
      : Promise.resolve();

    const [recentWinners] = await Promise.all([recentWinnersPromise, winRatePromise]);
    recentWinnerCount = recentWinners.length;

    const filtered = pool.filter(i =>
      i.class_name !== className && !recentWinners.includes(i.engraving_name)
    );

    subgroupQueue = buildSubgroupQueue(filtered);
    groupResults = { A: [], B: [], C: [], D: [] };
    currentGroupIndex = 0;
    isQualifierPhase = true;
    mainRoundCandidates = [];
    battleLogs = [];
    pendingWinner = null;
    opScore = 0;
    opMaxScore = 0;
    isChoosing = false;
    completedMatches = 0;
    totalMatches = filtered.length - 1;

    renderProgressSegments(filtered.length);

    showPhase(phaseBattle);

    requestAnimationFrame(() => {
      const targetTop = Math.max(
        0,
        phaseBattle.getBoundingClientRect().top + window.scrollY - 110
      );
      window.scrollTo({ top: targetTop, behavior: "smooth" });
    });

    const battleField = $("battleField");
    if (battleField) battleField.classList.add("field-entering");

    setTimeout(() => {
      if (battleField) battleField.classList.remove("field-entering");
      startGroupQualifier(0);
      hideArenaLoading();
    }, 120);
  } catch (error) {
    console.error("startBattle error:", error);
    hideArenaLoading();
        showCustomAlert("⚠️", "불러오기 실패", "경기장 데이터를 불러오지 못했습니다.<br>잠시 후 다시 시도해주세요.");
  }
}




/* ============================================================
   조별 예선
   ============================================================ */
function startGroupQualifier(subgroupIdx) {
  const item = subgroupQueue[subgroupIdx];
  if (!item) return;
  const { displayGroup, pool } = item;

  if (subgroupIdx % 4 === 0) initGroupPanel(displayGroup, subgroupIdx);
  if (!pool || !pool.length) { handleSubgroupComplete(null); return; }

  startNewRound(pool);

  const heroKicker = $("battleHeroKicker");
  const heroTitle = $("battleHeroTitle");
  const heroSub = $("battleHeroSub");
  const banner = $("battleHeroBanner");
  const excluded = $("battleExcluded");

  if (heroKicker) heroKicker.textContent = currentTournamentType === "op" ? "OP TOURNAMENT" : "FAVOR TOURNAMENT";
  if (heroTitle) heroTitle.textContent = currentTournamentType === "op" ? "OP 직각 토너먼트" : "호감 직각 토너먼트";
  if (heroSub) heroSub.textContent = getBattleLine(currentTournamentType);
  if (excluded) {
    const extra = recentWinnerCount > 0 ? ` · 이번 주 우승 ${recentWinnerCount}개 제외` : "";
    excluded.textContent = "⚔️ " + selectedClass + " 제외" + extra;
  }

  if (banner) {
    banner.classList.remove("banner-op", "banner-favor", "banner-group-a", "banner-group-b", "banner-group-c", "banner-group-d");
    banner.classList.add(currentTournamentType === "op" ? "banner-op" : "banner-favor");
    banner.classList.add("banner-group-" + displayGroup.toLowerCase());
  }

  const fill = $("battleProgressFill");
  if (fill) {
    fill.classList.remove("stage-green", "stage-blue", "stage-purple", "stage-yellow", "stage-red");
    fill.classList.add(GROUP_COLORS[displayGroup]);
  }

  updateBattleStageUI();
  renderGroupPanel();
  renderNextBattle();
}

/* ============================================================
   조별 예선 종료 처리
   ============================================================ */
function handleSubgroupComplete(winner) {
  const { displayGroup } = subgroupQueue[currentGroupIndex];
  if (winner) groupResults[displayGroup].push(winner);

  currentGroupIndex++;

  if (currentGroupIndex < subgroupQueue.length) {
    if (currentGroupIndex % 4 === 0) resetGroupPanel();

    const battleField = $("battleField");
    if (battleField) battleField.classList.add("field-entering");
    setTimeout(() => {
      if (battleField) battleField.classList.remove("field-entering");
      startGroupQualifier(currentGroupIndex);
    }, 200);
  } else {
    resetGroupPanel();
    showQualifiedPhase();
  }
}

function finishStage(winner) {
  if (isQualifierPhase) {
    handleSubgroupComplete(winner);
  } else {
    pendingWinner = winner;
    showWinnerPhase(winner);
  }
}

/* ============================================================
   대진 렌더
   ============================================================ */
function renderNextBattle() {
  if (currentRoundCandidates.length === 1) { finishStage(currentRoundCandidates[0]); return; }

  if (currentIndex >= currentRoundCandidates.length) {
    if (nextRoundCandidates.length === 1) { finishStage(nextRoundCandidates[0]); return; }
    if (nextRoundCandidates.length === 0) return;
    startNewRound(nextRoundCandidates);
    renderNextBattle();
    return;
  }

  currentLeft = currentRoundCandidates[currentIndex];
  currentRight = currentRoundCandidates[currentIndex + 1];

  if (!currentRight) { nextRoundCandidates.push(currentLeft); currentIndex++; renderNextBattle(); return; }

  leftFighter.classList.remove("card-win", "card-lose");
  rightFighter.classList.remove("card-win", "card-lose");
  leftFighter.disabled = false;
  rightFighter.disabled = false;

  leftAura.className = "card-aura " + getAuraClass(currentLeft.class_name);
  leftIcon.src = getIconPath(currentLeft.engraving_name);
  leftIcon.alt = currentLeft.engraving_name;
  leftIcon.onerror = () => { leftIcon.style.opacity = "0.2"; };
  leftIcon.style.opacity = "1";
  leftFighterName.textContent = getShortName(currentLeft.engraving_name);
  leftFighterName.className = "card-engr-name " + getColorClass(currentLeft.class_name);
  leftFighterClass.textContent = currentLeft.class_name;

  rightAura.className = "card-aura " + getAuraClass(currentRight.class_name);
  rightIcon.src = getIconPath(currentRight.engraving_name);
  rightIcon.alt = currentRight.engraving_name;
  rightIcon.onerror = () => { rightIcon.style.opacity = "0.2"; };
  rightIcon.style.opacity = "1";
  rightFighterName.textContent = getShortName(currentRight.engraving_name);
  rightFighterName.className = "card-engr-name " + getColorClass(currentRight.class_name);
  rightFighterClass.textContent = currentRight.class_name;

  let roundLabel, stageColor;
  if (isQualifierPhase) {
    const { displayGroup } = subgroupQueue[currentGroupIndex];
    const count = currentRoundCandidates.length;
    if (count <= 2) roundLabel = displayGroup + "조 결승";
    else if (count <= 4) roundLabel = displayGroup + "조 4강";
    else roundLabel = displayGroup + "조 예선";
    stageColor = "stage-green";
  } else {
    roundLabel = getRoundLabel(currentRoundCandidates.length);
    const count = currentRoundCandidates.length;
    if (count <= 2) stageColor = "stage-red";
    else if (count <= 4) stageColor = "stage-yellow";
    else if (count <= 8) stageColor = "stage-purple";
    else if (count <= 16) stageColor = "stage-blue";
    else stageColor = "stage-green";
  }



  const heroSub = $("battleHeroSub");
  if (heroSub) heroSub.textContent = getBattleLine(currentTournamentType);

  const fill = $("battleProgressFill");
  if (fill) {
    fill.classList.remove("stage-green", "stage-blue", "stage-purple", "stage-yellow", "stage-red");
    fill.classList.add(stageColor);
  }

  const pct = totalMatches > 0 ? Math.floor((completedMatches / totalMatches) * 100) : 0;
  battleProgressPct.textContent = pct + "%";
  battleProgressFill.style.width = pct + "%";

  if (isQualifierPhase) {
    bigGroupMatchLog.push({
      num: bigGroupMatchCounter + 1, type: "match",
      leftName: currentLeft.engraving_name, rightName: currentRight.engraving_name,
      status: "pending", winnerName: null
    });
    currentMatchLogIndex = bigGroupMatchLog.length - 1;
    updateBattleStageUI();
    renderGroupPanel();
  } else {
    updateBattleStageUI();
  }
}

/* ============================================================
   선택 처리
   ============================================================ */
function chooseBattleWinner(side) {
  if (!currentLeft || !currentRight || isChoosing) return;
  isChoosing = true;
  playFlip();

  const winner = side === "left" ? currentLeft : currentRight;
  const loser = side === "left" ? currentRight : currentLeft;
  const winCard = side === "left" ? leftFighter : rightFighter;
  const loseCard = side === "left" ? rightFighter : leftFighter;

  if (currentTournamentType === "op") {
    const wrW = getWinRate(winner.engraving_name);
    const wrL = getWinRate(loser.engraving_name);
    opMaxScore++;
    if (wrW >= wrL) opScore++;
  }

  leftFighter.disabled = true;
  rightFighter.disabled = true;

  battleLogs.push({
    left_engraving: currentLeft.engraving_name,
    right_engraving: currentRight.engraving_name,
    winner_engraving: winner.engraving_name,
    loser_engraving: loser.engraving_name,
    round_label: getRoundLabel(currentRoundCandidates.length)
  });

  if (isQualifierPhase && currentMatchLogIndex !== null) {
    bigGroupMatchCounter++;
    const entry = bigGroupMatchLog[currentMatchLogIndex];
    if (entry) { entry.status = "done"; entry.winnerName = winner.engraving_name; }
    bigGroupStatus[loser.engraving_name] = "eliminated";
    currentMatchLogIndex = null;
    renderGroupPanel();
  }

  nextRoundCandidates.push(winner);
  completedMatches++;
  currentIndex += 2;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  if (isMobile) {
    winCard.classList.add("card-win");
    loseCard.classList.add("card-lose");
    setTimeout(() => { isChoosing = false; renderNextBattle(); }, 120);
    return;
  }

  winCard.classList.add("card-win");
  loseCard.classList.add("card-lose");
  setTimeout(() => { isChoosing = false; renderNextBattle(); }, 450);
}

/* ============================================================
   16강 진출자 화면
   ============================================================ */
function showQualifiedPhase() {
  isQualifierPhase = false;

  GROUP_NAMES.forEach(groupName => {
    const el = $("qualifiedGroup" + groupName);
    if (!el) return;

    const winners = groupResults[groupName];
    if (!winners.length) {
      el.innerHTML = '<span class="qualified-chip empty">-</span>';
      return;
    }

    el.innerHTML = winners.map(w => {
      const short = getShortName(w.engraving_name);
      const iconSrc = getIconPath(w.engraving_name);
      const colorCls = getColorClass(w.class_name);
      return `
        <span class="qualified-chip ${colorCls}">
          <img class="qualified-chip-icon" src="${iconSrc}" alt="${short}" onerror="this.style.opacity='0.2'">
          <span class="qualified-chip-name">${short}</span>
        </span>`;
    }).join("");
  });

  const phaseQualified = $("phaseQualified");
  showPhase(phaseQualified);
  createConfetti();
}

/* ============================================================
   본선 시작
   ============================================================ */
function startMainRound() {
  mainRoundCandidates = [];
  GROUP_NAMES.forEach(g => { groupResults[g].forEach(w => mainRoundCandidates.push(w)); });
  mainRoundCandidates = shuffle(mainRoundCandidates);

  const banner = $("battleHeroBanner");
  if (banner) banner.classList.remove("banner-group-a", "banner-group-b", "banner-group-c", "banner-group-d");

  const fill = $("battleProgressFill");
  if (fill) {
    fill.classList.remove("stage-green", "stage-blue", "stage-purple", "stage-yellow");
    fill.classList.add("stage-blue");
  }

  showPhase(phaseBattle);

  const battleField = $("battleField");
  if (battleField) battleField.classList.add("field-entering");

  setTimeout(() => {
    if (battleField) battleField.classList.remove("field-entering");
    startNewRound(mainRoundCandidates);
    renderNextBattle();
  }, 200);
}



/* ============================================================
   우승 화면
   ============================================================ */
function createConfetti() {
  const zone = $("winnerConfettiZone");
  if (!zone) return;
  const colors = ["#ff7070", "#ffb36b", "#ffd76b", "#8bd0ff", "#c48bff"];
  for (let i = 0; i < 28; i++) {
    const p = document.createElement("div");
    p.className = "confetti-piece";
    p.style.left = Math.random() * 100 + "%";
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDelay = (Math.random() * 0.4) + "s";
    zone.appendChild(p);
    setTimeout(() => p.remove(), 3200);
  }
}

function createEntryConfetti() {
  const zone = $("battleEntryConfetti");
  if (!zone) return;
  zone.innerHTML = "";
  const colors = ["#ff7070", "#ffb36b", "#ffd76b", "#8bd0ff", "#c48bff", "#7effae"];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement("div");
    p.className = "entry-confetti-piece";
    p.style.left = Math.random() * 100 + "%";
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDelay = (Math.random() * 0.5) + "s";
    p.style.animationDuration = (1.5 + Math.random() * 1.0) + "s";
    zone.appendChild(p);
    setTimeout(() => p.remove(), 3000);
  }
}


function showWinnerPhase(winner) {
  playWinner();

  battleProgressPct.textContent = "100%";
  battleProgressFill.style.width = "100%";

  winnerBadge.textContent = currentTournamentType === "op" ? "OP TOURNAMENT COMPLETE" : "FAVOR TOURNAMENT COMPLETE";
  winnerEngrName.textContent = getShortName(winner.engraving_name);
  winnerEngrClass.textContent = "우승 직각 · " + winner.class_name;

  if (currentTournamentType === "op") {
    const grade = calcGrade(opScore, opMaxScore);
    const color = GRADE_COLORS[grade] || "#ccc";

    winnerStampArea.style.display = "block";
    winnerStampDate.textContent = formatStampDate(getDateKey());
    winnerStampGrade.textContent = grade;
    winnerStamp.className = "winner-stamp " + getStampClass(grade);

    winnerGradeInfo.innerHTML = `
      <div style="color:${color}; font-weight:700; font-size:15px; margin-bottom:8px;">
        📊 실제 유저 분포를 계산 중입니다...
      </div>`;
    winnerComment.innerHTML = `<div style="color:#8fa3bf; font-size:13px; line-height:1.7;">${getRandomComment(grade)}</div>`;

    loadGradeDistStats().then(stats => {
      const info = getGradeDistributionInfo(grade, stats);
      if (!info) {
        winnerGradeInfo.innerHTML = `
          <div style="color:${color}; font-weight:700; font-size:15px; margin-bottom:8px;">
            📊 실제 유저 분포 데이터가 아직 부족합니다
          </div>`;
        return;
      }
      winnerGradeInfo.innerHTML = `
        <div style="color:${color}; font-weight:700; font-size:15px; margin-bottom:8px;">
          📊 전체 유저 중 <span style="font-size:18px; font-weight:900;">상위 ${info.topPct}%</span> 수준의 선택입니다
        </div>`;
      winnerComment.innerHTML = `
        <div style="color:#8fa3bf; font-size:13px; line-height:1.7;">
          같은 등급(<strong style="color:${color};">${grade}</strong>)을 받은 유저는 전체의 <strong>${info.samePct}%</strong>입니다.<br>
          ${getRandomComment(grade)}
        </div>`;
    });
  } else {
    winnerStampArea.style.display = "none";
    winnerGradeInfo.innerHTML = "";
    winnerComment.textContent = "토너먼트가 완료되었습니다. 확인을 누르면 결과가 저장됩니다.";
  }

  showPhase(phaseWinner);
  createConfetti();
}


/* ============================================================
   저장
   ============================================================ */
async function finalizeTournament() {
  if (!pendingWinner || isFinalizingTournament) return;
  isFinalizingTournament = true;
  winnerConfirmBtn.disabled = true;

  if (TEST_MODE_DISABLE_SAVE) {
    console.log("[TEST MODE] Supabase 저장 생략됨 →", {
      selectedClass,
      winner: pendingWinner.engraving_name,
      tournamentType: currentTournamentType,
      grade: currentTournamentType === "op" ? calcGrade(opScore, opMaxScore) : null,
      opScore, opMaxScore
    });

    if (currentTournamentType === "op") {
      completedState.op = true;
      todayOpGrade = calcGrade(opScore, opMaxScore);
      renderShutterStamp("op", todayOpGrade);
    } else {
      completedState.favor = true;
      renderShutterStamp("favor", null);
    }

    currentBoardMode = currentTournamentType;
    closeArena();
    updateRankingLockState();
    setTimeout(() => {
  if (rankingSection) {
    rankingSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}, 400);

    isFinalizingTournament = false;
    winnerConfirmBtn.disabled = false;
    return;
  }

  const clientIP = await getClientIP();
  const grade = currentTournamentType === "op" ? calcGrade(opScore, opMaxScore) : null;
  const score = currentTournamentType === "op" ? opScore : 0;
  const maxScore = currentTournamentType === "op" ? opMaxScore : 0;

  const sessionPayload = {
    visitor_key: visitorKey,
    client_ip: clientIP,
    selected_class: selectedClass,
    winner_engraving: pendingWinner.engraving_name,
    tournament_type: currentTournamentType,
    date_key: getDateKey(),
    week_key: getWeekKey(),
    month_key: getMonthKey(),
    grade, score, max_score: maxScore
  };

  const { data: sessionData, error: sessionError } = await supabase
    .from("sessions").insert([sessionPayload]).select();

  if (sessionError) {
        showCustomAlert("❌", "저장 실패", "결과를 저장하지 못했습니다.<br>" + sessionError.message);
    isFinalizingTournament = false;
    winnerConfirmBtn.disabled = false;
    return;
  }

  const sessionId = sessionData[0].id;

  if (battleLogs.length > 0) {
    const matchPayload = battleLogs.map(log => ({
      session_id: sessionId,
      left_engraving: log.left_engraving,
      right_engraving: log.right_engraving,
      winner_engraving: log.winner_engraving,
      loser_engraving: log.loser_engraving,
      round_label: log.round_label,
      tournament_type: currentTournamentType,
      date_key: getDateKey(),
      week_key: getWeekKey(),
      month_key: getMonthKey()
    }));

    const { error: matchError } = await supabase.from("match_logs").insert(matchPayload);
    if (matchError) {
          showCustomAlert("❌", "저장 실패", "매치 로그를 저장하지 못했습니다.<br>" + matchError.message);
      isFinalizingTournament = false;
      winnerConfirmBtn.disabled = false;
      return;
    }
  }

  if (currentTournamentType === "op") {
    completedState.op = true;
    todayOpGrade = grade;
    renderShutterStamp("op", grade);
  } else {
    completedState.favor = true;
    renderShutterStamp("favor", null);
  }

  currentBoardMode = currentTournamentType;
  closeArena();
  updateRankingLockState();
 setTimeout(() => {
  if (rankingSection) {
    rankingSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}, 400);

  isFinalizingTournament = false;
  winnerConfirmBtn.disabled = false;
}

/* ============================================================
   랭킹보드
   ============================================================ */

function updateRankingLockState() {
  if (!rankingSection || !rankingLock || !rankingInner) return;

  rankingLock.style.display = "none";
  rankingInner.style.filter = "";
  rankingInner.style.pointerEvents = "";

  modeOpBtn?.classList.remove("active", "disabled");
  modeFavorBtn?.classList.remove("active", "disabled");

  if (!currentBoardMode) {
    currentBoardMode = "op";
  }

  if (currentBoardMode === "op") modeOpBtn?.classList.add("active");
  else modeFavorBtn?.classList.add("active");

  loadRankingData(currentBoardMode);
}



async function loadRankingData(mode) {
  const cacheKey = "all_" + mode;
  if (rankingCache[cacheKey]) { renderRanking(rankingCache[cacheKey], mode); return; }

  const { data, error } = await supabase
    .from("ranking_overall")
    .select("tournament_type,class_name,engraving_name,champion_count,unique_winner_count,participant_ratio,win_count,lose_count,total_matches,win_rate,updated_at")
    .eq("tournament_type", mode);

  if (error) { alert("랭킹 조회 실패"); return; }
  rankingCache[cacheKey] = data;
  renderRanking(data, mode);
}



function renderRanking(rows, mode) {
  let filtered = rows;
  if (mode === "op") filtered = rows.filter(r => !SUPPORT_ENGRAVINGS.includes(r.engraving_name));

  const sorted = [...filtered].sort((a, b) => {
    if (b.champion_count !== a.champion_count) return b.champion_count - a.champion_count;
    if (Number(b.win_rate) !== Number(a.win_rate)) return Number(b.win_rate) - Number(a.win_rate);
    return b.win_count - a.win_count;
  });

  const revealLimit = getRankingRevealLimit();

  rankingTitle.textContent = mode === "op" ? "OP 직각 랭킹 보드" : "호감 직각 랭킹 보드";
  rankingTitle.className = "ranking-title " + (mode === "op" ? "ranking-title-op" : "ranking-title-favor");
  rankingSub.textContent = getRankingStatusText();

  const top3 = sorted.slice(0, 3);
  rankingSummary.innerHTML = `
    <div class="ranking-top3">
      ${top3.map((r, i) => `
        <div class="top3-card top3-${i + 1}">
          <div class="top3-rank">${i + 1}위</div>
          <div class="top3-icon-wrap">
            <img src="${getIconPath(r.engraving_name)}" alt="${r.engraving_name}" onerror="this.style.opacity='0.2'">
          </div>
          <div class="top3-name">${getShortName(r.engraving_name)}</div>
          <div class="top3-val">${r.champion_count}회 우승</div>
        </div>
      `).join("")}
    </div>`;

  if (!sorted.length) {
    rankingList.innerHTML = `<div class="ranking-empty">데이터 없음 · 집계 후 자동 반영됩니다.</div>`;
    return;
  }

  rankingList.innerHTML = sorted.map((row, idx) => {
    const hidden = idx >= revealLimit;
    const rankCls = idx === 0 ? "rank-1st" : idx === 1 ? "rank-2nd" : idx === 2 ? "rank-3rd" : "";
    return `
      <div class="rank-row ${rankCls} ${hidden ? "rank-hidden" : ""}">
        <div class="rank-num">${idx + 1}</div>
        <div class="rank-icon">
          <img src="${getIconPath(row.engraving_name)}" alt="${row.engraving_name}" onerror="this.style.opacity='0.2'">
        </div>
        <div class="rank-info">
          <div class="rank-name">${row.engraving_name}</div>
          <div class="rank-class">${row.class_name}</div>
        </div>
        <div class="rank-stats">
          <div class="rank-stat-main">${row.champion_count}회</div>
          <div class="rank-stat-sub">승률 ${Number(row.win_rate).toFixed(1)}%</div>
          <div class="rank-stat-detail">${row.total_matches}전 ${row.win_count}승 ${row.lose_count}패</div>
        </div>
      </div>`;
  }).join("");

  if (Number.isFinite(revealLimit) && sorted.length > revealLimit) {
    const hiddenRows = rankingList.querySelectorAll(".rank-hidden");
    if (hiddenRows.length > 0) {
      const noticeText = revealLimit === 5
        ? "🔒 토너먼트 1회 완료 시 <strong>20위까지</strong>, OP + 호감 완료 또는 <strong>S/SS 혜택</strong> 시 전체 랭킹이 공개됩니다!"
        : "🔒 OP + 호감 완료 또는 <strong>S/SS 혜택</strong> 시 전체 랭킹이 공개됩니다!";

      hiddenRows[0].insertAdjacentHTML("beforebegin", `
        <div class="ranking-lock-notice">
          ${noticeText}
        </div>`);
    }
  }

  const latestUpdated = filtered.length > 0 ? filtered[0].updated_at : null;
  rankingFooter.textContent = "※ 전체 랭킹은 매시간 정각 집계됩니다. 최근 집계: " + formatUpdatedAt(latestUpdated);
}



/* ============================================================
   주간 / 월간 랭킹
   ============================================================ */
function clearPeriodActive() {
  periodAllBtn.classList.remove("active");
  periodWeekBtn.classList.remove("active");
  periodMonthBtn.classList.remove("active");
}

async function loadWeeklyRanking(mode) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 6);
  const fmt = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const { data, error } = await supabase.rpc("get_recent_ranking", {
    p_type: mode, p_start: fmt(start), p_end: fmt(now)
  });
  if (error) { alert("주간 랭킹 조회 실패"); return; }
  renderRanking(data, mode);
}

async function loadMonthlyRanking(mode) {
  const { data, error } = await supabase.rpc("get_monthly_ranking", {
    p_type: mode, p_month: getMonthKey()
  });
  if (error) { alert("월간 랭킹 조회 실패"); return; }
  renderRanking(data, mode);
}

/* ============================================================
   등급 가이드 모달
   ============================================================ */
function buildGradeGrid() {
  if (!gradeGrid) return;
  gradeGrid.innerHTML = GRADE_TABLE.map(row => `
    <div class="grade-cell ${getStampClass(row.grade)}" style="
      border:1px solid rgba(255,255,255,.08); border-radius:12px; padding:10px 8px;
      text-align:center; background:rgba(255,255,255,.03);
    ">
      <div style="font-size:16px;font-weight:900;color:${GRADE_COLORS[row.grade]};margin-bottom:4px;">${row.grade}</div>
      <div style="font-size:11px;color:#94a3b8;">${row.min}~${row.max}%</div>
    </div>
  `).join("");
}

/* ============================================================
   이벤트
   ============================================================ */
if (opStartBtn) opStartBtn.addEventListener("click", () => handleStart("op"));
if (favorStartBtn) favorStartBtn.addEventListener("click", () => handleStart("favor"));
if (classCancelBtn) classCancelBtn.addEventListener("click", closeArena);
if (leftFighter) leftFighter.addEventListener("click", () => chooseBattleWinner("left"));
if (rightFighter) rightFighter.addEventListener("click", () => chooseBattleWinner("right"));

if (battleQuitBtn) battleQuitBtn.addEventListener("click", () => { quitOverlay.classList.add("show"); });
if (quitCancelBtn) quitCancelBtn.addEventListener("click", () => { quitOverlay.classList.remove("show"); });
if (quitConfirmBtn) quitConfirmBtn.addEventListener("click", () => { quitOverlay.classList.remove("show"); closeArena(); });

const qualifiedStartBtn = $("qualifiedStartBtn");
if (qualifiedStartBtn) qualifiedStartBtn.addEventListener("click", startMainRound);

if (winnerConfirmBtn) winnerConfirmBtn.addEventListener("click", finalizeTournament);

const battleGroupPanelEl = $("battleGroupPanel");
if (battleGroupPanelEl) {
  battleGroupPanelEl.addEventListener("click", (e) => {
    if (e.target.closest("#groupLogToggleBtn")) {
      groupLogExpanded = !groupLogExpanded;
      renderGroupPanel();
    }
  });
}


if (modeOpBtn) modeOpBtn.addEventListener("click", () => {
  currentBoardMode = "op";
  modeOpBtn.classList.add("active");
  modeFavorBtn.classList.remove("active");
  if (periodWeekBtn.classList.contains("active")) loadWeeklyRanking("op");
  else if (periodMonthBtn.classList.contains("active")) loadMonthlyRanking("op");
  else loadRankingData("op");
});

if (modeFavorBtn) modeFavorBtn.addEventListener("click", () => {
  currentBoardMode = "favor";
  modeFavorBtn.classList.add("active");
  modeOpBtn.classList.remove("active");
  if (periodWeekBtn.classList.contains("active")) loadWeeklyRanking("favor");
  else if (periodMonthBtn.classList.contains("active")) loadMonthlyRanking("favor");
  else loadRankingData("favor");
});


if (periodAllBtn) periodAllBtn.addEventListener("click", () => {
  if (!completedState.op && !completedState.favor) return;
  clearPeriodActive();
  periodAllBtn.classList.add("active");
  loadRankingData(currentBoardMode || "op");
});

if (periodWeekBtn) periodWeekBtn.addEventListener("click", () => {
  if (!completedState.op && !completedState.favor) return;
  clearPeriodActive();
  periodWeekBtn.classList.add("active");
  loadWeeklyRanking(currentBoardMode || "op");
});

if (periodMonthBtn) periodMonthBtn.addEventListener("click", () => {
  if (!completedState.op && !completedState.favor) return;
  clearPeriodActive();
  periodMonthBtn.classList.add("active");
  loadMonthlyRanking(currentBoardMode || "op");
});

if (closeGuideBtn) closeGuideBtn.addEventListener("click", () => { guideModal?.classList.remove("show"); });
if (guideModal) guideModal.addEventListener("click", (e) => { if (e.target === guideModal) guideModal.classList.remove("show"); });




document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    quitOverlay?.classList.remove("show");
    guideModal?.classList.remove("show");
    hideCustomAlert();
  }
});

document.getElementById("customAlertCloseBtn")?.addEventListener("click", hideCustomAlert);

document.getElementById("customAlertOverlay")?.addEventListener("click", (e) => {
  if (e.target.id === "customAlertOverlay") hideCustomAlert();
});



/* ============================================================
   초기화
   ============================================================ */
async function init() {
  visitorKey = getVisitorKey();
  buildGradeGrid();
  updateSoundUI();
  applySoundVolume();
  await loadCandidates();
  await preloadIcons();
  await loadTodayParticipation();
}

init();
