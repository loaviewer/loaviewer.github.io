import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

async function getClientIP() {
  const sources = [
    () => fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(3000) })
          .then(r => r.json()).then(d => d.ip),

    () => fetch("https://api64.ipify.org?format=json", { signal: AbortSignal.timeout(3000) })
          .then(r => r.json()).then(d => d.ip),

    () => fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) })
          .then(r => r.json()).then(d => d.ip),
  ];

  for (const source of sources) {
    try {
      const ip = await source();
      if (ip && typeof ip === "string" && ip.includes(".")) return ip;
    } catch {}
  }

  return null;
}

    const SUPABASE_URL = "https://khszfukekudyripouifm.supabase.co";
    const SUPABASE_KEY = "sb_publishable_XjCVKOZRq1aERqzOGj_tHw_eC4uCXEb";
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const winnerAudio = document.getElementById("winnerAudio");
const flipAudio   = document.getElementById("flipAudio");

const battleVolumeSlider = document.getElementById("battleVolumeSlider");
const battleVolumeValue  = document.getElementById("battleVolumeValue");
const battleSoundIcon    = document.getElementById("battleSoundIcon");

let battleSoundEnabled = true;
let battleMasterVolume = 50; // 기본 50%

function updateBattleSoundUI() {
  if (!battleVolumeSlider || !battleVolumeValue || !battleSoundIcon) return;

  battleVolumeSlider.value = battleMasterVolume;
  battleVolumeValue.textContent = battleSoundEnabled ? `${battleMasterVolume}%` : "OFF";

  if (!battleSoundEnabled || battleMasterVolume === 0) {
    battleSoundIcon.textContent = "🔇";
  } else if (battleMasterVolume <= 50) {
    battleSoundIcon.textContent = "🔉";
  } else {
    battleSoundIcon.textContent = "🔊";
  }
}

function applyBattleSoundVolume() {
  const vol = battleSoundEnabled ? battleMasterVolume / 100 : 0;
  winnerAudio.volume = vol;
  flipAudio.volume = vol;
}

if (battleVolumeSlider && battleVolumeValue && battleSoundIcon) {
  updateBattleSoundUI();
  applyBattleSoundVolume();

  battleVolumeSlider.addEventListener("input", (e) => {
    battleMasterVolume = Number(e.target.value);
    if (battleMasterVolume > 0) battleSoundEnabled = true;
    updateBattleSoundUI();
    applyBattleSoundVolume();
  });

  battleSoundIcon.addEventListener("click", () => {
    battleSoundEnabled = !battleSoundEnabled;

    if (!battleSoundEnabled) {
      battleMasterVolume = 0;
    } else if (battleMasterVolume === 0) {
      battleMasterVolume = 50;
    }

    updateBattleSoundUI();
    applyBattleSoundVolume();
  });
}

    const SUPPORT_ENGRAVINGS = ["절실한 구원","만개","축복의 오라","해방자"];
    const A_MINUS_AND_ABOVE  = ["SS+","SS","SS-","S+","S","S-","A+","A","A-"];
    const S_AND_ABOVE = ["SS+","SS","SS-","S+","S","S-"];
    const A_LINE_ONLY = ["A+","A","A-"];

    const GRADE_TABLE = [
      {grade:"SS+",min:100,max:100},{grade:"SS",min:98,max:99},{grade:"SS-",min:96,max:97},
      {grade:"S+",min:94,max:95},{grade:"S",min:92,max:93},{grade:"S-",min:90,max:91},
      {grade:"A+",min:85,max:89},{grade:"A",min:80,max:84},{grade:"A-",min:75,max:79},
      {grade:"B+",min:70,max:74},{grade:"B",min:65,max:69},{grade:"B-",min:60,max:64},
      {grade:"C+",min:55,max:59},{grade:"C",min:50,max:54},{grade:"C-",min:45,max:49},
      {grade:"D+",min:40,max:44},{grade:"D",min:35,max:39},{grade:"D-",min:30,max:34},
      {grade:"E+",min:25,max:29},{grade:"E",min:20,max:24},{grade:"E-",min:15,max:19},
      {grade:"F+",min:10,max:14},{grade:"F",min:5,max:9},{grade:"F-",min:0,max:4},
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
      "SS+":["완벽한 판단입니다! 모든 선택이 정확했어요. 전설급 결과!","100% 달성! 이 선택은 흔치 않은 최상위 판정입니다.","완벽 그 자체! 정석을 넘어선 초월적인 선택이었습니다."],
      "SS": ["아주 훌륭한 결과입니다. 거의 완벽에 가까운 판단이었어요.","정석적인 최고의 선택들로 안정적으로 마무리했습니다.","상위권 판정입니다. 흐름을 잘 읽고 정확하게 골랐어요."],
      "SS-":["거의 완벽한 수준입니다. 아주 강한 판단이었어요.","상위권답게 잘 마무리했습니다. 충분히 인상적인 결과입니다.","좋은 흐름을 유지했습니다. 마지막까지 안정적이었어요."],
      "S+": ["매우 좋은 결과입니다. 판단력이 확실히 돋보였어요.","상당히 높은 완성도로 토너먼트를 잘 풀었습니다.","상위권 직전의 강한 판정입니다. 흐름이 좋았어요."],
      "S":  ["무난하게 좋은 결과입니다. 전체적으로 안정적이었어요.","판단이 꽤 괜찮았습니다. 큰 흔들림 없이 진행했네요.","실력 있는 선택으로 잘 마무리했습니다."],
      "S-": ["좋은 편의 결과입니다. 몇몇 구간만 더 정확했으면 더 높았어요.","전반적으로 괜찮은 판단이었습니다.","상위권 진입 직전의 흐름이 보였습니다."],
      "A+": ["꽤 괜찮은 결과입니다. 감이 나쁘지 않았어요.","안정감은 있었지만, 조금만 더 정교하면 더 올라갈 수 있었습니다.","중상위권 판정입니다. 흐름은 괜찮았어요."],
      "A":  ["평균 이상은 확실히 했습니다. 무난한 결과예요.","기본기는 잘 살렸습니다. 다만 결정적인 구간이 조금 아쉬웠네요.","괜찮은 선택들이었습니다. 전체적으로는 안정적이었어요."],
      "A-": ["나쁘지 않은 결과입니다. 조금 더 날카로웠으면 좋았어요.","중간 이상은 확보했습니다. 다만 흔들린 구간이 보입니다.","무난한 편이지만 아쉬움이 조금 남는 결과입니다."],
      "B+": ["무난한 편이지만 조금 더 다듬을 여지는 있습니다.","기본 흐름은 괜찮았으나, 정확도는 조금 아쉬웠어요.","중간권 결과입니다. 다음엔 더 높은 판정을 노려볼 만합니다."],
      "B":  ["평범한 결과입니다. 크게 틀리진 않았지만 날카롭진 않았어요.","무난하게 진행했지만, 인상적인 선택은 적었습니다.","보통 수준의 결과입니다. 조금만 더 맞히면 올라갈 수 있어요."],
      "B-": ["아쉬움이 조금 남는 결과입니다. 판단이 다소 흔들렸어요.","기본은 했지만, 점수를 더 챙길 수 있는 구간이 있었습니다.","중하위권 판정입니다. 다음엔 더 정확하게 가볼 수 있어요."],
      "C+": ["아쉽지만 아직 가능성은 충분합니다.","정확도는 낮았지만, 흐름을 익히기엔 괜찮은 결과예요.","조금 더 신중했다면 점수를 더 올릴 수 있었습니다."],
      "C":  ["보통보다 낮은 결과입니다. 선택이 많이 갈렸어요.","판단이 다소 흔들렸습니다. 다음엔 더 안정적으로 가보죠.","아쉬운 편의 결과지만, 토너먼트 감각은 잡히고 있어요."],
      "C-": ["조금 어려운 결과입니다. 선택이 자주 빗나갔어요.","정확도가 많이 부족했습니다. 다음엔 흐름을 더 읽어보세요.","하위권 판정입니다. 다시 도전할 여지는 충분합니다."],
      "D+": ["절반을 조금 밑도는 결과입니다. 선택이 많이 엇갈렸어요.","흐름을 잡기 어려웠던 것 같습니다. 다음엔 더 집중해보세요.","아쉬운 결과지만 다음 도전에서 충분히 올라갈 수 있어요."],
      "D":  ["많이 아쉬운 결과입니다. 판단이 자주 빗나갔어요.","선택의 절반 이상이 엇갈렸습니다. 다시 도전해보세요.","쉽지 않은 결과였지만, 경험이 쌓이면 달라질 거예요."],
      "D-": ["판단이 많이 흔들렸습니다. 다음엔 더 신중하게 골라보세요.","결과가 많이 아쉽습니다. 승률 데이터를 참고해보면 도움이 될 거예요.","낮은 정답률이지만 포기하지 마세요. 다음엔 더 나아질 수 있어요."],
      "E+": ["많이 어려운 결과입니다. 선택이 대부분 빗나갔어요.","흐름을 따라가기 힘들었던 것 같습니다. 다시 도전해보세요.","쉽지 않은 판정이었지만, 다음엔 더 좋은 결과를 기대할게요."],
      "E":  ["거의 대부분의 선택이 엇갈렸습니다. 많이 어려우셨나요?","결과가 많이 아쉽습니다. 메타를 다시 한번 살펴보세요.","낮은 결과지만 괜찮아요. 다음 도전이 더 기대됩니다."],
      "E-": ["선택이 대부분 빗나간 결과입니다. 많이 어려우셨죠?","메타 파악이 조금 더 필요한 것 같습니다. 다시 도전해보세요.","결과가 아쉽지만, 경험을 쌓으면 분명 달라질 거예요."],
      "F+": ["조금 더 집중이 필요합니다. 결과가 많이 흔들렸어요.","아쉬운 결과입니다. 판단 기준을 다시 잡아보면 좋아요.","기본 흐름을 놓친 구간이 많았습니다. 다음엔 더 나아질 수 있어요."],
      "F":  ["많이 아쉬운 결과입니다. 선택이 꽤 엇갈렸어요.","토너먼트 흐름을 따라가기가 어려웠던 판정입니다.","다음 도전이 기대되는 결과입니다. 지금은 감을 다시 잡아야 해요."],
      "F-": ["가장 낮은 판정입니다. 이번엔 흐름이 전혀 맞지 않았어요.","많이 아쉬운 결과지만, 처음엔 이런 날도 있습니다.","다시 시작해볼 시간입니다. 다음엔 더 좋은 선택을 기대할게요."],
    };

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
      body: JSON.stringify({
        p_type: "op",
        p_start_date: "2026-04-07"
      })
    });

    if (!res.ok) return null;

    const data = await res.json();
    const counts = {};
    let total = 0;

    GRADE_TABLE.forEach(g => {
      counts[g.grade] = 0;
    });

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

  // 1. 나보다 '높은' 등급을 받은 사람들의 누적 (<= 가 아니라 < 로 변경)
  let betterCount = 0;
  for (let i = 0; i < idx; i++) {
    betterCount += counts[GRADE_TABLE[i].grade] || 0;
  }

  // 2. 나와 같은 등급을 받은 사람
  const sameCount = counts[grade] || 0;

  // 상위 % 계산
  let topPct = Number(((betterCount / total) * 100).toFixed(1));
  
  // 만약 최고 등급(SS+)이라 나보다 높은 사람이 없으면 0%가 되므로 0.1%로 뽀대나게 보정
  if (idx === 0) topPct = 0.1;

  return {
    topPct: topPct,
    samePct: Number(((sameCount / total) * 100).toFixed(1)),
    sameCount,
    total
  };
}


function getStampClass(grade) {
  if (!grade) return "";
  const g = grade.replace("+","").replace("-","");
  if (g === "SS") return "stamp-ss";
  if (g === "S")  return "stamp-s";
  if (g === "A")  return "stamp-a";
  if (g === "B")  return "stamp-b";
  if (g === "C")  return "stamp-c";
  if (g === "D")  return "stamp-d";
  if (g === "E")  return "stamp-e";
  if (g === "F")  return "stamp-f";
  return "";
}
    function calcGrade(score, total) {
      if (total===0) return "F-";
      const rate=Math.round((score/total)*100);
      for (const row of GRADE_TABLE) { if (rate>=row.min&&rate<=row.max) return row.grade; }
      return "F-";
    }

    function getRandomComment(grade) {
      const list=GRADE_COMMENTS[grade]||["잘 하셨습니다!"];
      return list[Math.floor(Math.random()*list.length)];
    }

    let winRateCache={};

    async function loadRecentWinRates(type) {
  winRateCache = {};

  const start = new Date("2026-04-22T00:00:00+09:00");
  const now = new Date();
  const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;

  const {data,error}=await supabase.rpc("get_recent_winrates",{
    p_type: type,
    p_days: diffDays
  });

  if (error||!data) return;
  for (const row of data) {
    winRateCache[row.engraving_name] = Number(row.win_rate);
  }
}

    function getWinRate(name) { return winRateCache[name]!==undefined?winRateCache[name]:0.5; }

    const fullToShortMap = {
      "고독한 기사":"고기","전투 태세":"전태","광기":"광기","광전사의 비기":"비기",
  "분노의 망치":"분망","중력 수련":"중수","심판자":"심판자","축복의 오라":"축오",
  "처단자":"처단자","포식자":"포식자","빛의 기사":"빛의 기사","해방자":"해방자",
  "초심":"초심","오의 강화":"오의","충격 단련":"충단","체술":"체술",
  "세맥타통":"세맥","역천지체":"역천","절정":"절정","절제":"절제",
  "오의난무":"난무","일격필살":"일격","권왕파천무":"권왕","수라의 길":"수라",
  "강화 무기":"강무","핸드거너":"핸드","화력 강화":"화강","포격 강화":"포강",
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

    function getShortName(full) { return fullToShortMap[full]||full; }

    function shuffle(arr) {
      const c=[...arr];
      for (let i=c.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [c[i],c[j]]=[c[j],c[i]]; }
      return c;
    }

const OP_BATTLE_LINES = [
  "어느 직각이 더 강할까?",
  "최강 직각 월드컵",
  "현재 메타의 승자는?",
  "당신의 파워 픽은?",
  "더 높은 티어를 골라주세요",
  "성능으로 압도하라",
  "진검승부",
  "밸런스의 정점은?",
  "어느 쪽이 더 딜이 쌜까?",
  "최고의 실전 성능은?",
  "메타 최강자는 누구?",
  "레이드의 지배자는?",
  "딜킹을 가려보자",
  "압도적인 화력 대결",
  "실전에서 더 강한 직각은?",
  "최종 승자는 누구일까?",
  "티어표 최상단은?",
  "누가 보스의 체력을 더 빨리 녹일까?",
  "한계를 뛰어넘는 성능",
  "최고의 OP 직각은?"
];

const FAVOR_BATTLE_LINES = [
  "어느 직각이 더 끌릴까?",
  "최애 직각 월드컵",
  "당신의 취향 저격은?",
  "낭만으로 승부하라",
  "더 재밌어 보이는 직각은?",
  "마음이 가는 쪽을 골라주세요",
  "애정 픽 매치",
  "어느 쪽이 더 플레이하고 싶나요?",
  "취향의 정점은?",
  "당신의 로망 픽은?",
  "가장 애정하는 직각은?",
  "파티 신청시 바로 받을 직각은?",
  "손이 더 자주 가는 직각은?",
  "보는 것만으로도 설레는 직각은?",
  "가장 정이 가는 직각은?",
  "내 스타일은 어느 쪽?",
  "성능보다 마음이 먼저",
  "가슴이 시키는 선택",
  "나만의 원픽 직각은?",
  "추억이 담긴 최고의 직각은?"
];

function getBattleLine(type) {
  try {
    const key = type === "op"
      ? "loa_battle_line_pool_op"
      : "loa_battle_line_pool_favor";

    const source = type === "op" ? OP_BATTLE_LINES : FAVOR_BATTLE_LINES;

    let pool = [];
    try {
      pool = JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
      pool = [];
    }

    if (!Array.isArray(pool) || pool.length === 0) {
      pool = shuffle([...source]);
    }

    const picked = pool.pop();
    localStorage.setItem(key, JSON.stringify(pool));
    return picked || source[0];
  } catch (e) {
    console.error("getBattleLine error:", e);
    return type === "op" ? "어느 직각이 더 강할까?" : "어느 직각이 더 끌릴까?";
  }
}



    async function loadTierData(type) {
  const {data, error} = await supabase.rpc("get_tier_data", {
    p_type: type,
    p_days: 7
  });
  if (error||!data) return null;
  let entries = data.map(r => ({name: r.engraving_name, winRate: Number(r.win_rate), total: Number(r.total_matches)}));
  if (type==="op") entries = entries.filter(e => !SUPPORT_ENGRAVINGS.includes(e.name));
  return entries;
}

async function loadTierDataDays(type, days) {
  const {data, error} = await supabase.rpc("get_tier_data", {
    p_type: type,
    p_days: days
  });
  if (error||!data) return null;
  let entries = data.map(r => ({name: r.engraving_name, winRate: Number(r.win_rate), total: Number(r.total_matches)}));
  if (type==="op") entries = entries.filter(e => !SUPPORT_ENGRAVINGS.includes(e.name));
  return entries;
}

    

async function loadOpRateData() {
  const start = new Date("2026-06-24T00:00:00+09:00");
  const now = new Date();
  const diffDays = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;

  const {data, error} = await supabase.rpc("get_tier_data", {
    p_type: "op",
    p_days: diffDays
  });
  if (error || !data) return null;
  return data.filter(r => !SUPPORT_ENGRAVINGS.includes(r.engraving_name));
}

async function loadOpRatePrevData() {
  const {data, error} = await supabase.rpc("get_tier_data_range", {
    p_type: "op",
    p_start: "2026-05-24",
    p_end: "2026-06-23"
  });
  if (error || !data) return null;
  return data.filter(r => !SUPPORT_ENGRAVINGS.includes(r.engraving_name));
}

async function preloadAllOpRateModes() {
  if (opRatePreloadPromise) return opRatePreloadPromise;

  opRatePreloadPromise = (async () => {
    const prevRows = await loadOpRatePrevData();

    const [postpatchRows, recent10Rows, recent5Rows] = await Promise.all([
      loadOpRateCompareData("postpatch"),
      loadOpRateCompareData("recent10"),
      loadOpRateCompareData("recent5")
    ]);

    opRateCache["postpatch"] = { rows: postpatchRows, prevRows: prevRows };
    opRateCache["recent10"]  = { rows: recent10Rows,  prevRows: prevRows };
    opRateCache["recent5"]   = { rows: recent5Rows,   prevRows: prevRows };
  })();

  return opRatePreloadPromise;
}

    

async function loadOpRateCompareData(mode) {
  if (mode === "recent10") {
    const {data, error} = await supabase.rpc("get_tier_data", {
      p_type: "op",
      p_days: 10
    });
    if (error || !data) return null;
    return data.filter(r => !SUPPORT_ENGRAVINGS.includes(r.engraving_name));
  }

  if (mode === "recent5") {
    const {data, error} = await supabase.rpc("get_tier_data", {
      p_type: "op",
      p_days: 5
    });
    if (error || !data) return null;
    return data.filter(r => !SUPPORT_ENGRAVINGS.includes(r.engraving_name));
  }

  // 기본값 = 6/23 ~ 현재
  return await loadOpRateData();
}

async function refreshOpRateModal(mode = "postpatch") {
  const now = new Date();
  const stamp = `${String(now.getFullYear()).slice(2)}.${String(now.getMonth()+1).padStart(2,"0")}.${String(now.getDate()).padStart(2,"0")} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;

  if (mode === "recent10") {
    opRateSub.textContent = `OP 직각 1:1 승률 · 최근 10일 비교 🕙 ${stamp}`;
  } else if (mode === "recent5") {
    opRateSub.textContent = `OP 직각 1:1 승률 · 최근 5일 비교 🕔 ${stamp}`;
  } else {
    opRateSub.textContent = `OP 직각 1:1 승률 · 6/24 ~ 현재 비교 🕙 ${stamp}`;
  }

  if (!opRateCache["postpatch"] || !opRateCache["recent10"] || !opRateCache["recent5"]) {
    opRateContent.innerHTML = '<div class="loading-text">데이터 불러오는 중...</div>';
    await preloadAllOpRateModes();
  }

  renderOpRateContent(opRateCache[mode].rows, opRateCache[mode].prevRows);
}

    

    function calcTiers(entries) {
      if (!entries.length) return [[],[],[],[],[],[]];
      const sorted=[...entries].sort((a,b)=>b.winRate-a.winRate);
      const total=sorted.length;
      const tier6=total>10?sorted.slice(total-10):[];
      const rest=total>10?sorted.slice(0,total-10):sorted;
      const tier1=rest.slice(0,6),tier2=rest.slice(6,15),tier3=rest.slice(15,27);
      const rem=rest.slice(27),half=Math.ceil(rem.length/2);
      return [tier1,tier2,tier3,rem.slice(0,half),rem.slice(half),tier6];
    }

    function renderTierContent(tiers,containerId) {
      const container=document.getElementById(containerId);
      if (!tiers||tiers.every(t=>t.length===0)) {
        container.innerHTML=`<div class="loading-text">데이터가 부족합니다 😢<br>토너먼트 참여자가 늘면 자동으로 반영됩니다!</div>`;
        return;
      }
      const names=["1티어","2티어","3티어","4티어","5티어","6티어"];
      const classes=["tier-1","tier-2","tier-3","tier-4","tier-5","tier-6"];
      const emojis=["👑","⭐","💜","💙","💚","⚪"];
      container.innerHTML=tiers.map((tier,i)=>{
        if (!tier.length) return "";
        return `<div class="tier-block ${classes[i]}">
          <div class="tier-header"><span>${emojis[i]}</span><span class="tier-badge">${names[i]}</span><span class="tier-count">${tier.length}개</span></div>
          <div class="tier-engravings">${shuffle(tier).map(e=>`<span class="engraving-chip">${getShortName(e.name)}</span>`).join("")}</div>
        </div>`;
      }).join("");
    }


function renderOpRateContent(rows, prevRows) {
  if (!rows || rows.length === 0) {
    opRateContent.innerHTML = '<div class="loading-text">데이터를 불러오지 못했어요 😢</div>';
    return;
  }

  var sorted = rows.slice().sort(function(a, b) {
    if (Number(b.win_rate) !== Number(a.win_rate)) return Number(b.win_rate) - Number(a.win_rate);
    if (Number(b.total_matches) !== Number(a.total_matches)) return Number(b.total_matches) - Number(a.total_matches);
    return Number(b.win_count) - Number(a.win_count);
  });

  var prevRankMap = {};
  var prevRateMap = {};

  if (prevRows && prevRows.length > 0) {
    var prevSorted = prevRows.slice().sort(function(a, b) {
      if (Number(b.win_rate) !== Number(a.win_rate)) return Number(b.win_rate) - Number(a.win_rate);
      if (Number(b.total_matches) !== Number(a.total_matches)) return Number(b.total_matches) - Number(a.total_matches);
      return Number(b.win_count) - Number(a.win_count);
    });

    prevSorted.forEach(function(r, i) {
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

  function getClassName(engraving) {
    var cand = allCandidates.find(function(c) { return c.engraving_name === engraving; });
    return cand ? cand.class_name : "";
  }

  function getDeltaHTML(engName, currentRank, currentRate) {
    var prevRank = prevRankMap[engName];
    var prevRate = prevRateMap[engName];

    if (prevRank === undefined || prevRate === undefined) {
      return '<div class="delta-wrap"><span class="delta-new">🆕 신규</span></div>';
    }

    var rankDiff = prevRank - currentRank;
    var rateDiff = (currentRate - prevRate).toFixed(2);
    var rankHTML = "";
    var rateHTML = "";

    if (rankDiff > 0) {
      rankHTML = '<span class="delta-up">▲ +' + rankDiff + '</span>';
    } else if (rankDiff < 0) {
      rankHTML = '<span class="delta-down">▼ ' + rankDiff + '</span>';
    } else {
      rankHTML = '<span class="delta-same">─</span>';
    }

    if (Number(rateDiff) > 0) {
      rateHTML = '<span class="delta-rate-up">+' + rateDiff + '%</span>';
    } else if (Number(rateDiff) < 0) {
      rateHTML = '<span class="delta-rate-down">' + rateDiff + '%</span>';
    }

    if (rankDiff === 0 && Number(rateDiff) === 0) return "";
    return '<div class="delta-wrap">' + rankHTML + ' ' + rateHTML + '</div>';
  }

  var html = '<div class="rate-list-wrap">';

  sorted.forEach(function(row, i) {
    var delta = getDeltaHTML(row.engraving_name, i + 1, Number(row.win_rate));

       html +=
      '<div class="rate-row-item ' + getRowClass(i) + '">' +
        '<div class="rate-rank">' + (i + 1) + '</div>' +
        '<div class="rate-icon">' +
          '<img src="' + getIconPath(row.engraving_name) + '" alt="' + row.engraving_name + '" onerror="this.style.opacity=\'0.2\';">' +
        '</div>' +
        '<div class="rate-info">' +
          '<div class="rate-name">' + row.engraving_name + '</div>' +
          '<div class="rate-class">' + getClassName(row.engraving_name) + '</div>' +
          '<div class="rate-bar-bg">' +
            '<div class="rate-bar-fill bar-fill-op" style="width:' + Math.min(100, Number(row.win_rate)) + '%"></div>' +
          '</div>' +
          delta +
        '</div>' +
        '<div class="rate-right">' +
          '<div class="rate-value">' + Number(row.win_rate).toFixed(1) + '%</div>' +
          '<div class="rate-record">' + row.total_matches + '전 ' + row.win_count + '승 ' + row.lose_count + '패</div>' +
        '</div>' +
      '</div>';
  });

  html += '</div>';
  opRateContent.innerHTML = html;
}
      

    // ===== 달력 =====
    let calYear, calMonth;

    function initCalendar() {
      const now=new Date(); calYear=now.getFullYear(); calMonth=now.getMonth(); renderCalendar();
    }

    function renderCalendar() {
      const now=new Date(), todayY=now.getFullYear(), todayM=now.getMonth(), todayD=now.getDate();
      const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];
      document.getElementById("calMonth").textContent=`${monthNames[calMonth]} ${calYear}`;
      const grid=document.getElementById("calGrid");
      const dows=["Su","Mo","Tu","We","Th","Fr","Sa"];
      let html=dows.map((d,i)=>`<div class="cal-dow ${i===0?"sun":i===6?"sat":""}">${d}</div>`).join("");
      const firstDay=new Date(calYear,calMonth,1).getDay();
      const lastDate=new Date(calYear,calMonth+1,0).getDate();
      const prevLast=new Date(calYear,calMonth,0).getDate();
      for (let i=0;i<firstDay;i++) {
        const d=prevLast-firstDay+1+i, dow=i;
        html+=`<div class="cal-day other-month ${dow===0?"sun":dow===6?"sat":""}">${d}</div>`;
      }
      for (let d=1;d<=lastDate;d++) {
        const dow=(firstDay+d-1)%7;
        const isToday=(d===todayD&&calMonth===todayM&&calYear===todayY);
        html+=`<div class="cal-day ${isToday?"today":""} ${dow===0?"sun":dow===6?"sat":""}">${d}</div>`;
      }
      const total=firstDay+lastDate, remain=total%7===0?0:7-(total%7);
      for (let d=1;d<=remain;d++) {
        const dow=(total+d-1)%7;
        html+=`<div class="cal-day other-month ${dow===0?"sun":dow===6?"sat":""}">${d}</div>`;
      }
      grid.innerHTML=html;
    }

    document.getElementById("calPrev").addEventListener("click",()=>{ calMonth--; if(calMonth<0){calMonth=11;calYear--;} renderCalendar(); });
    document.getElementById("calNext").addEventListener("click",()=>{ calMonth++; if(calMonth>11){calMonth=0;calYear++;} renderCalendar(); });

    // ===== 미니 팝업 (핵심 수정 부분) =====
    const miniPopup      = document.getElementById("miniPopup");
    const miniPopupTitle = document.getElementById("miniPopupTitle");
    const miniPopupDesc  = document.getElementById("miniPopupDesc");
    let popupTimeout = null;

    function showMiniPopup(btn, title, desc) {
      miniPopupTitle.textContent = title;
      miniPopupDesc.innerHTML    = desc;

      // 먼저 show 없이 DOM에 올려서 크기 측정
      miniPopup.style.visibility = "hidden";
      miniPopup.style.display    = "block";

      const btnRect  = btn.getBoundingClientRect();
      const popW     = miniPopup.offsetWidth;
      const popH     = miniPopup.offsetHeight;
      const viewW    = window.innerWidth;
      const viewH    = window.innerHeight;

      let top  = btnRect.bottom + 8;
      let left = btnRect.left;

      // 화면 오른쪽 넘치면 왼쪽으로 조정
      if (left + popW > viewW - 8) left = viewW - popW - 8;
      // 화면 아래 넘치면 버튼 위로 표시
      if (top + popH > viewH - 8) top = btnRect.top - popH - 8;

      miniPopup.style.top        = top  + "px";
      miniPopup.style.left       = left + "px";
      miniPopup.style.visibility = "";
      miniPopup.style.display    = "";
      miniPopup.classList.add("show");

      if (popupTimeout) clearTimeout(popupTimeout);
      popupTimeout = setTimeout(() => miniPopup.classList.remove("show"), 3000);
    }

    document.addEventListener("click", e => {
  const opBtn        = document.getElementById("openOpTierBtn");
  const favorBtn     = document.getElementById("openFavorTierBtn");
  const opRateBtn    = document.getElementById("openOpRateBtn");
  const historyBtn   = document.getElementById("openHistoryRateBtn");
  const classWinBtn  = document.getElementById("openClassWinBtn");

  if (
    !miniPopup.contains(e.target) &&
    (!opBtn || (e.target !== opBtn && !opBtn.contains(e.target))) &&
    (!favorBtn || (e.target !== favorBtn && !favorBtn.contains(e.target))) &&
    (!opRateBtn || (e.target !== opRateBtn && !opRateBtn.contains(e.target))) &&
    (!historyBtn || (e.target !== historyBtn && !historyBtn.contains(e.target))) &&
    (!classWinBtn || (e.target !== classWinBtn && !classWinBtn.contains(e.target)))
  ) {
    miniPopup.classList.remove("show");
  }
});

    // ===== DOM =====
    const opStamp        = document.getElementById("opStamp");
    const favorStamp     = document.getElementById("favorStamp");
    const opStampDate    = document.getElementById("opStampDate");
    const favorStampDate = document.getElementById("favorStampDate");
    const opStampGrade   = document.getElementById("opStampGrade");
    const opStartBtn     = document.getElementById("opStartBtn");
    const favorStartBtn  = document.getElementById("favorStartBtn");
    const rankingBoard   = document.getElementById("rankingBoard");
    const rankingBoardTitle = document.getElementById("rankingBoardTitle");
    const rankingBoardSub   = document.getElementById("rankingBoardSub");
    const rankingFooterNote = document.getElementById("rankingFooterNote");
    const summaryCards   = document.getElementById("summaryCards");
    const rankingList    = document.getElementById("rankingList");
    const modeOpBtn      = document.getElementById("modeOpBtn");
    const modeFavorBtn   = document.getElementById("modeFavorBtn");
    const lockTitle      = document.getElementById("lockTitle");
    const lockDesc       = document.getElementById("lockDesc");
    const classModal     = document.getElementById("classModal");
    const classFlowLabel = document.getElementById("classFlowLabel");
    const classTable     = document.getElementById("classTable");
    const closeClassModalBtn = document.getElementById("closeClassModalBtn");
    const battleModal    = document.getElementById("battleModal");
    const battleModeLabel    = document.getElementById("battleModeLabel");
    const battleTopKorTitle  = document.getElementById("battleTopKorTitle");
    const battleRoundTitle   = document.getElementById("battleRoundTitle");
    const battleSubText      = document.getElementById("battleSubText");
   const battleCenterRound  = document.getElementById("battleCenterRound");

    const battleProgressText = document.getElementById("battleProgressText");
    const battleProgressFill = document.getElementById("battleProgressFill");
    const leftChoiceBtn      = document.getElementById("leftChoiceBtn");
    const rightChoiceBtn     = document.getElementById("rightChoiceBtn");
    const leftChoiceClass    = document.getElementById("leftChoiceClass");
    const rightChoiceClass   = document.getElementById("rightChoiceClass");
    const leftChoiceName     = document.getElementById("leftChoiceName");
    const rightChoiceName    = document.getElementById("rightChoiceName");
    const leftChoiceIcon     = document.getElementById("leftChoiceIcon");
const rightChoiceIcon    = document.getElementById("rightChoiceIcon");
const leftAuraOuter      = document.getElementById("leftAuraOuter");
const rightAuraOuter     = document.getElementById("rightAuraOuter");
    const quitBattleBtn      = document.getElementById("quitBattleBtn");
    const winnerModal        = document.getElementById("winnerModal");
    const winnerModeLabel    = document.getElementById("winnerModeLabel");
    const winnerTitleText    = document.getElementById("winnerTitleText");
    const winnerSubText      = document.getElementById("winnerSubText");
    const winnerDescText     = document.getElementById("winnerDescText");
    const winnerConfirmBtn   = document.getElementById("winnerConfirmBtn");
    const gradeStampWrap     = document.getElementById("gradeStampWrap");
    const gsDate             = document.getElementById("gsDate");
    const gsGrade            = document.getElementById("gsGrade");
    const gradeComment       = document.getElementById("gradeComment");
    const guideModal         = document.getElementById("guideModal");
    const opTierModal        = document.getElementById("opTierModal");
    const favorTierModal     = document.getElementById("favorTierModal");
    const opLockIcon         = document.getElementById("opLockIcon");
    const favorLockIcon      = document.getElementById("favorLockIcon");
    const opRateModal        = document.getElementById("opRateModal");
    const classWinModal      = document.getElementById("classWinModal");
    const classWinLockIcon   = document.getElementById("classWinLockIcon");
    const opRateSub          = document.getElementById("opRateSub");
    const opRateContent      = document.getElementById("opRateContent");
    const opRateLockIcon     = document.getElementById("opRateLockIcon");

    let visitorKey    = null;
    let completedState= {op:false,favor:false};
    const rankingCache = {};
    const opRateCache = {};
let opRatePreloadPromise = null;
    let currentBoardMode=null, allCandidates=[], currentTournamentType=null, selectedClass=null, todayOpGrade=null;
    let battleIconsReady = null;
    let workingCandidates=[], currentRoundCandidates=[], nextRoundCandidates=[];
    let currentIndex=0, currentLeft=null, currentRight=null;
    let totalMatches=0, completedMatches=0, battleLogs=[], pendingWinner=null;
    let opScore=0, opMaxScore=0, isChoosing=false;
    let isFinalizingTournament = false;
    

   const classColorMap = {
  "워로드":"engr-warrior","버서커":"engr-warrior","디스트로이어":"engr-warrior","홀리나이트":"engr-warrior","슬레이어":"engr-warrior","발키리":"engr-warrior",
  "배틀마스터":"engr-fighter","인파이터":"engr-fighter","기공사":"engr-fighter","창술사":"engr-fighter","스트라이커":"engr-fighter","브레이커":"engr-fighter",
  "데빌헌터":"engr-hunter","블래스터":"engr-hunter","호크아이":"engr-hunter","스카우터":"engr-hunter","건슬링어":"engr-hunter",
  "서머너":"engr-mage","아르카나":"engr-mage","바드":"engr-mage","소서리스":"engr-mage",
  "블레이드":"engr-assassin","데모닉":"engr-assassin","리퍼":"engr-assassin","소울이터":"engr-assassin",
  "도화가":"engr-specialist","기상술사":"engr-specialist","환수사":"engr-specialist","차원술사":"engr-specialist","가디언나이트":"engr-guardian"
};

    const classGroups = {
  "전사":["워로드","버서커","디스트로이어","홀리나이트","슬레이어","발키리"],
  "무도가":["배틀마스터","인파이터","기공사","창술사","스트라이커","브레이커"],
  "헌터":["데빌헌터","블래스터","호크아이","스카우터","건슬링어"],
  "마법사":["서머너","아르카나","바드","소서리스"],
  "암살자":["블레이드","데모닉","리퍼","소울이터"],
  "스페셜리스트(여)":["도화가","기상술사","환수사"],
  "스페셜리스트(남)":["차원술사"],
  "가디언나이트":["가디언나이트"]
};

    const FAVOR_ONLY_IDS=[8,12,40,52];
    function getColorClass(cls) { return classColorMap[cls]||""; }

    function getVisitorKey() {
      let k=localStorage.getItem("loa_tournament_visitor_key");
      if (!k) { k="loa_tournament_user_"+crypto.randomUUID(); localStorage.setItem("loa_tournament_visitor_key",k); }
      return k;
    }

function getIconPath(engravingName) {
  return `./icon/${getShortName(engravingName).replace(/\s+/g, "")}.png`;
}

function getAuraClass(className) {
  if (["워로드","버서커","디스트로이어","슬레이어"].includes(className)) return "aura-power";
  if (["배틀마스터","인파이터","기공사","창술사","스트라이커","브레이커"].includes(className)) return "aura-ki";
  if (["데빌헌터","블래스터","호크아이","스카우터","건슬링어"].includes(className)) return "aura-gun";
  if (["블레이드","데모닉","리퍼","소울이터"].includes(className)) return "aura-dark";
  if (["서머너","아르카나","소서리스","가디언나이트"].includes(className)) return "aura-element";
  if (["환수사","도화가","기상술사","차원술사"].includes(className)) return "aura-flower";
  if (["바드","홀리나이트","발키리"].includes(className)) return "aura-holy";
  return "aura-holy";
}

async function preloadBattleIcons() {
  if (!allCandidates || !allCandidates.length) return;

  const uniquePaths = [...new Set(
    allCandidates.map(c => getIconPath(c.engraving_name))
  )];

  await Promise.all(
    uniquePaths.map(src => new Promise(resolve => {
      const img = new Image();
      img.onload = async () => {
        try {
          if (img.decode) await img.decode();
        } catch {}
        resolve();
      };
      img.onerror = () => resolve();
      img.src = src;
    }))
  );
}

    
function setBattleCardVisuals(side, candidate) {
  const auraEl  = side === "left" ? leftAuraOuter : rightAuraOuter;
  const iconEl  = side === "left" ? leftChoiceIcon : rightChoiceIcon;
  const nameEl  = side === "left" ? leftChoiceName : rightChoiceName;
  const classEl = side === "left" ? leftChoiceClass : rightChoiceClass;

  iconEl.style.opacity = "1";
  auraEl.className = "battle-aura-outer " + getAuraClass(candidate.class_name);
  iconEl.src = getIconPath(candidate.engraving_name);
  iconEl.alt = candidate.engraving_name;
  iconEl.onerror = () => { iconEl.style.opacity = "0.25"; };

  nameEl.textContent = getShortName(candidate.engraving_name);
  nameEl.className = `battle-choice-name ${getColorClass(candidate.class_name)}`;

  classEl.textContent = candidate.class_name;
}


    
    function getNow() { return new Date(); }
    function getDateKey()  { const n=getNow(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`; }
    function getMonthKey() { const n=getNow(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`; }
    function getWeekKey()  {
      const n=getNow(),f=new Date(n.getFullYear(),0,1),p=Math.floor((n-f)/86400000);
      return `${n.getFullYear()}-W${String(Math.ceil((p+f.getDay()+1)/7)).padStart(2,"0")}`;
    }
    function formatStampDate(dk) { const [y,m,d]=dk.split("-"); return `${y.slice(2)} ${m} ${d}`; }
    function formatUpdatedAt(v) {
      if (!v) return "-";
      const d=new Date(v);
      return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
    }



function isOpRateUnlocked() {
  return !!(
    completedState.op &&
    todayOpGrade &&
    (
      S_AND_ABOVE.includes(todayOpGrade) ||
      (A_LINE_ONLY.includes(todayOpGrade) && completedState.favor)
    )
  );
}

const historyRateLockIcon = document.getElementById("historyRateLockIcon");
const openHistoryRateBtn = document.getElementById("openHistoryRateBtn");

const historyRateModal = document.getElementById("historyRateModal");
const closeHistoryRateBtn = document.getElementById("closeHistoryRateBtn");


if (closeHistoryRateBtn) {
  closeHistoryRateBtn.addEventListener("click", () => {
    historyRateModal.style.display = "none";
document.body.classList.remove("history-modal-open");
  });
}

if (historyRateModal) {
  historyRateModal.addEventListener("click", (e) => {
    if (e.target === historyRateModal) {
      historyRateModal.style.display = "none";
document.body.classList.remove("history-modal-open");
    }
  });
}
    
document.addEventListener("input", (e) => {
  if (e.target && e.target.id === "historySearchInput") {
    historyRenderEngravingList(e.target.value || "");
  }
});

document.addEventListener("change", (e) => {
  if (!e.target || e.target.id !== "historyModeSelect") return;

  historySelectedSet.clear();
  historySelectedOrder = [];
  historyUpdateSelectedTags();
  resetHistoryChart();

  historyCandidates = [];
  historyCandidatesMode = "";
  loadHistoryCandidates();
});

    
document.addEventListener("click", (e) => {
  const resetBtn = e.target.closest("#historyResetBtn");
  if (!resetBtn) return;

  const hadSelected = historySelectedOrder.length > 0;

  historySelectedSet.clear();
  historySelectedOrder = [];

  historyUpdateSelectedTags();
  historyRenderEngravingList(historySearchInput ? (historySearchInput.value || "") : "");
  resetHistoryChart();

  showMiniPopup(
    resetBtn,
    "선택 초기화",
    hadSelected
      ? `선택한 각인을 모두 초기화했어요.`
      : `초기화할 선택 각인이 없어요.`
  );
});
    
    
    const historyModeSelect = document.getElementById("historyModeSelect");
const historyStartDate = document.getElementById("historyStartDate");
const historyEndDate = document.getElementById("historyEndDate");
const historySearchInput = document.getElementById("historySearchInput");
const historyEngravingList = document.getElementById("historyEngravingList");
const historySelectedTags = document.getElementById("historySelectedTags");
const historyApplyBtn = document.getElementById("historyApplyBtn");
const historyNoticeText = document.getElementById("historyNoticeText");
const historyChartSvg = document.getElementById("historyChartSvg");
const historyChartWrap = document.getElementById("historyChartWrap");
const historyTooltip = document.getElementById("historyTooltip");
const historyLegendBox = document.getElementById("historyLegendBox");
const historySummaryBody = document.getElementById("historySummaryBody");

const HISTORY_MAX_SELECT = 4;
const HISTORY_COLORS = [
  "#7effae",
  "#59c7ff",
  "#ffb86b",
  "#d48fff",
  "#ffd85c"
];
    
let historyCandidates = [];
let historyCandidatesMode = "";
const historySelectedSet = new Set();
let historySelectedOrder = [];

function initHistoryDates() {
  const formatDateISO = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const tenDaysAgo = new Date(yesterday);
  tenDaysAgo.setDate(yesterday.getDate() - 9);

  const minDate = new Date("2026-04-07");
  const start = tenDaysAgo < minDate ? minDate : tenDaysAgo;

  historyStartDate.value = formatDateISO(start);
  historyEndDate.value = formatDateISO(yesterday);

  historyStartDate.max = formatDateISO(yesterday);
  historyEndDate.max = formatDateISO(yesterday);
}

function historyGetColor(name) {
  const idx = historySelectedOrder.indexOf(name);
  if (idx === -1) return "#8d6cff";
  return HISTORY_COLORS[idx % HISTORY_COLORS.length];
}

function historyGetSelectedEngravings() {
  return Array.from(historySelectedOrder);
}

function historyUpdateSelectedTags() {
  const selected = historyGetSelectedEngravings();

  if (!selected.length) {
    historySelectedTags.innerHTML = '<span class="history-selected-tag" style="color:#7a8a9f;">선택 없음</span>';
    return;
  }

  historySelectedTags.innerHTML = selected.map(name => {
    const color = historyGetColor(name);
    const short = getShortName(name);
    return `<span class="history-selected-tag" style="color:${color}; background:${color}18; border-color:${color}40;">${short}</span>`;
  }).join("");
}

function historyRenderEngravingList(filter = "") {
  const keyword = filter.trim();

  const filtered = keyword
    ? historyCandidates.filter(c => {
        const short = getShortName(c.engraving_name);
        return (
          c.engraving_name.includes(keyword) ||
          c.class_name.includes(keyword) ||
          short.includes(keyword)
        );
      })
    : historyCandidates;

  if (!filtered.length) {
    historyEngravingList.innerHTML = `<div style="padding:20px; text-align:center; color:#7a8a9f;">검색 결과 없음</div>`;
    return;
  }

  historyEngravingList.innerHTML = filtered.map(c => {
    const checked = historySelectedSet.has(c.engraving_name) ? "checked" : "";
    const short = getShortName(c.engraving_name);

    return `
      <label class="history-engraving-item ${checked ? 'checked' : ''}">
        <input type="checkbox" value="${c.engraving_name}" data-class="${c.class_name}" ${checked}>
        <span class="history-engraving-short">${short}</span>
        <span class="history-engraving-class">${c.class_name}</span>
      </label>
    `;
  }).join("");

  historyEngravingList.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener("change", historyOnCheckboxChange);
  });
}

function historyOnCheckboxChange(e) {
  const name = e.target.value;

  if (e.target.checked) {
    if (historySelectedSet.size >= HISTORY_MAX_SELECT) {
      e.target.checked = false;
      showMiniPopup(
  document.getElementById("historyResetBtn"),
  "선택 제한",
  `최대 <span class="cond">${HISTORY_MAX_SELECT}개</span>까지 선택할 수 있어요.`
);
      return;
    }

    historySelectedSet.add(name);
    historySelectedOrder.push(name);
  } else {
    historySelectedSet.delete(name);
    historySelectedOrder = historySelectedOrder.filter(v => v !== name);
  }

  const item = e.target.closest(".history-engraving-item");
  if (item) item.classList.toggle("checked", e.target.checked);

  historyUpdateSelectedTags();
}


async function loadHistoryCandidates() {
  const listEl = document.getElementById("historyEngravingList");
  const searchEl = document.getElementById("historySearchInput");
  const mode = historyModeSelect ? historyModeSelect.value : "op";

  if (!listEl) {
    console.error("historyEngravingList 요소를 찾지 못했습니다.");
    return;
  }

  // 같은 모드면 캐시 재사용
  if (historyCandidates.length && historyCandidatesMode === mode) {
    historyRenderEngravingList(searchEl ? (searchEl.value || "") : "");
    return;
  }

  listEl.innerHTML = `<div style="padding:20px; text-align:center; color:#7a8a9f;">로딩 중...</div>`;

  try {
    let url = `${SUPABASE_URL}/rest/v1/candidates?select=class_name,engraving_name,enabled&order=class_name.asc,engraving_name.asc`;

    // OP는 enabled=true만, 호감은 전체 각인
    if (mode === "op") {
      url = `${SUPABASE_URL}/rest/v1/candidates?enabled=eq.true&select=class_name,engraving_name,enabled&order=class_name.asc,engraving_name.asc`;
    }

    const res = await fetch(url, {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`candidates fetch failed: ${res.status} ${errText}`);
    }

    historyCandidates = await res.json();
    historyCandidatesMode = mode;

    historyRenderEngravingList(searchEl ? (searchEl.value || "") : "");
  } catch (err) {
    console.error("loadHistoryCandidates error:", err);
    listEl.innerHTML = `<div style="padding:20px; text-align:center; color:#ff9b9b;">각인 목록 로드 실패<br><small style="color:#c7a6a6;">${err.message}</small></div>`;
  }
}
    

function resetHistorySummaryTable() {
  historySummaryBody.innerHTML = `<tr><td colspan="7" style="color:#7a8a9f;">조회 결과가 여기에 표시됩니다.</td></tr>`;
}

function resetHistoryChart() {
  historyChartSvg.innerHTML = `
    <rect width="1000" height="380" fill="#0f1520"></rect>
    <text x="500" y="190" text-anchor="middle" fill="#7a8a9f" font-size="15" font-weight="700">
      각인을 선택하고 확인을 눌러주세요.
    </text>
  `;
  historyLegendBox.innerHTML = "";
  resetHistorySummaryTable();
}

async function historyFetchAndRender() {
  const selected = historyGetSelectedEngravings();
  const startStr = historyStartDate.value;
  const endStr = historyEndDate.value;
  const mode = historyModeSelect.value;

 if (!startStr || !endStr) return alert("시작일과 종료일을 입력해줘.");
if (startStr > endStr) return alert("시작일이 종료일보다 늦을 수 없어.");
if (!selected.length) return alert("최소 1개 각인을 선택해줘.");

const dayDiff = Math.ceil((new Date(endStr) - new Date(startStr)) / (1000 * 60 * 60 * 24)) + 1;
const maxDays = HISTORY_UNIT_LIMITS[historyCurrentUnit] || 15;

if (dayDiff > maxDays) {
  alert(`${historyCurrentUnit}일 단위는 최대 ${maxDays}일까지 조회할 수 있어요.\n현재 선택: ${dayDiff}일`);
  return;
}

  historyApplyBtn.disabled = true;
  historyApplyBtn.textContent = "조회 중...";

  const loadingDiv = document.createElement("div");
  loadingDiv.className = "history-loading-overlay";
  loadingDiv.textContent = "데이터 불러오는 중...";
  historyChartWrap.appendChild(loadingDiv);

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_daily_winrate_history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        p_type: mode,
        p_start: startStr,
        p_end: endStr
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`RPC 실패: ${res.status} ${errText}`);
    }

    const data = await res.json();
    const filteredData = data.filter(row => selected.includes(row.engraving_name));
const allDates = [...new Set(data.map(r => r.date_key))].sort();

// 단위별 날짜 묶음
const dates = [];
const dateGroups = [];

for (let i = 0; i < allDates.length; i += historyCurrentUnit) {
  const group = allDates.slice(i, i + historyCurrentUnit);
  dateGroups.push(group);
  dates.push(group[group.length - 1]);
}

    const datasets = selected.map((name, idx) => {
      const rows = filteredData.filter(r => r.engraving_name === name);
      const found = historyCandidates.find(c => c.engraving_name === name);

     const values = dateGroups.map(group => {
  let wins = 0;
  let total = 0;

  group.forEach(d => {
    const match = rows.find(r => r.date_key === d);
    if (match) {
      wins += parseInt(match.win_count) || 0;
      total += parseInt(match.total_matches) || 0;
    }
  });

  if (total === 0) return null;
  return Math.round((wins / total) * 1000) / 10;
});

const totalMatches = rows.reduce((sum, r) => sum + (parseInt(r.total_matches) || 0), 0);

      return {
        name,
        shortName: getShortName(name),
        class_name: found ? found.class_name : "",
        color: HISTORY_COLORS[idx % HISTORY_COLORS.length],
        values,
        totalMatches
      };
    });

    const labels = dates.map(d => {
      const parts = d.split("-");
      return `${parseInt(parts[1])}/${parseInt(parts[2])}`;
    });

    historyRenderSvgChart(datasets, labels, dates);
    historyRenderLegend(datasets);
    historyRenderSummaryTable(datasets, data, dates);

    historyNoticeText.textContent =
      `${mode === "op" ? "OP" : "호감"} · ${startStr} ~ ${endStr} · ${selected.length}개 각인 조회 완료`;

  } catch (err) {
    alert("조회 실패: " + err.message);
    console.error(err);
  } finally {
    historyApplyBtn.disabled = false;
    historyApplyBtn.textContent = "확인";
    const overlay = historyChartWrap.querySelector(".history-loading-overlay");
    if (overlay) overlay.remove();
  }
}

   function historyRenderSvgChart(datasets, labels, dates) {
  const W = 1000;
  const H = 380;
  const pad = { top: 28, right: 30, bottom: 46, left: 60 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  let allValues = [];
  datasets.forEach(ds => {
    ds.values.forEach(v => { if (v !== null) allValues.push(v); });
  });

  if (!allValues.length) {
    historyChartSvg.innerHTML = `
      <rect width="${W}" height="${H}" fill="#0f1520"/>
      <text x="${W/2}" y="${H/2}" text-anchor="middle" fill="#7a8a9f" font-size="15" font-weight="700">
        선택한 기간에 데이터가 없습니다.
      </text>
    `;
    return;
  }

  const yMin = 0;
  const yMax = 100;
  const yTicks = [0, 20, 40, 60, 80, 100];

  function xScale(i) {
    if (labels.length === 1) return pad.left + plotW / 2;
    return pad.left + (plotW * i / (labels.length - 1));
  }

  function yScale(v) {
    return pad.top + ((yMax - v) / (yMax - yMin)) * plotH;
  }

  let svg = `<rect width="${W}" height="${H}" fill="#0f1520"/>`;

  // Y축 그리드 + 라벨 (왼쪽 배치)
  yTicks.forEach(val => {
    const y = yScale(val);
    svg += `<line x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>`;
    svg += `<text x="${pad.left - 10}" y="${y + 4}" text-anchor="end" fill="#94a3b8" font-size="11" font-weight="700">${val}%</text>`;
  });

  // 축선
  svg += `<line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${H - pad.bottom}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`;
  svg += `<line x1="${pad.left}" y1="${H - pad.bottom}" x2="${W - pad.right}" y2="${H - pad.bottom}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`;

  // X축 날짜 라벨
  const maxLabels = 20;
  const labelStep = labels.length <= maxLabels ? 1 : Math.ceil(labels.length / maxLabels);

  labels.forEach((label, i) => {
    if (i % labelStep !== 0 && i !== labels.length - 1) return;
    const x = xScale(i);
    svg += `<text x="${x}" y="${H - 18}" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="700">${label}</text>`;
  });

  // 라인 + 점
  datasets.forEach(ds => {
    const points = [];
    ds.values.forEach((v, i) => {
      if (v !== null) {
        points.push({ x: xScale(i), y: yScale(v), label: labels[i], value: v, date: dates[i] });
      }
    });

    if (points.length > 1) {
      const pathD = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
      svg += `<path d="${pathD}" fill="none" stroke="${ds.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
    }

    points.forEach(pt => {
      const safeName = ds.name.replace(/"/g, '&quot;');
      svg += `
        <circle cx="${pt.x}" cy="${pt.y}" r="5" fill="${ds.color}" stroke="#0f1520" stroke-width="2.5"
          data-name="${safeName}" data-label="${pt.label}" data-value="${pt.value}" data-date="${pt.date}"
          style="cursor:pointer"/>
      `;
    });
  });

  historyChartSvg.innerHTML = svg;

  historyChartSvg.querySelectorAll("circle[data-name]").forEach(circle => {
    circle.addEventListener("mousemove", (e) => {
      const name = circle.getAttribute("data-name");
      const label = circle.getAttribute("data-label");
      const value = circle.getAttribute("data-value");
      const date = circle.getAttribute("data-date");
      historyShowTooltip(e, `<strong>${name}</strong><br>${label} (${date})<br>승률 ${value}%`);
    });

    circle.addEventListener("mouseleave", () => {
      historyHideTooltip();
      circle.setAttribute("r", "5");
    });

    circle.addEventListener("mouseenter", () => {
      circle.setAttribute("r", "7");
    });
  });
}

      
function historyShowTooltip(event, html) {
  const rect = historyChartWrap.getBoundingClientRect();
  historyTooltip.style.display = "block";
  historyTooltip.innerHTML = html;

  let left = event.clientX - rect.left + 16;
  let top = event.clientY - rect.top - 12;

  if (left + 180 > rect.width) left = event.clientX - rect.left - 180;
  if (top < 0) top = 10;

  historyTooltip.style.left = left + "px";
  historyTooltip.style.top = top + "px";
}

function historyHideTooltip() {
  historyTooltip.style.display = "none";
}

function historyRenderLegend(datasets) {
  historyLegendBox.innerHTML = datasets.map(ds => `
    <div class="history-legend-item">
      <span class="history-legend-dot" style="background:${ds.color}"></span>
      ${ds.shortName}
    </div>
  `).join("");
}


function historyRenderSummaryTable(datasets, allData, dates) {
  if (!datasets.length) {
    historySummaryBody.innerHTML = `<tr><td colspan="6" style="color:#7a8a9f;">선택된 각인이 없습니다.</td></tr>`;
    return;
  }
 
 // 해당 기간 전체 통합 승률로 순위 계산
const allEngravingStats = {};

allData.forEach(r => {
  const name = r.engraving_name;
  if (!allEngravingStats[name]) {
    allEngravingStats[name] = { wins: 0, total: 0 };
  }
  allEngravingStats[name].wins += parseInt(r.win_count) || 0;
  allEngravingStats[name].total += parseInt(r.total_matches) || 0;
});

const globalRankList = Object.entries(allEngravingStats)
  .filter(([_, s]) => s.total > 0)
  .map(([name, s]) => ({
    engraving_name: name,
    win_rate: (s.wins / s.total) * 100
  }))
  .sort((a, b) => b.win_rate - a.win_rate);

const globalRankMap = {};
globalRankList.forEach((item, idx) => {
  globalRankMap[item.engraving_name] = idx + 1;
});

  historySummaryBody.innerHTML = datasets.map(ds => {
    const valid = ds.values.filter(v => v !== null);

    if (!valid.length) {
      return `
        <tr>
          <td><span class="color-chip" style="background:${ds.color}"></span>${ds.shortName}</td>
          <td>${ds.class_name}</td>
          <td colspan="4" style="color:#7a8a9f;">데이터 없음</td>
        </tr>
      `;
    }

    const first = valid[0];
    const last = valid[valid.length - 1];
    const rank = globalRankMap[ds.name] || "-";
   

    return `
      <tr>
        <td><span class="color-chip" style="background:${ds.color}"></span>${ds.shortName}</td>
        <td>${ds.class_name}</td>
        <td>${first.toFixed(1)}%</td>
        <td>${last.toFixed(1)}%</td>
        <td>${rank}위</td>
        <td>${ds.totalMatches.toLocaleString()}</td>
      </tr>
    `;
  }).join("");
}

document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "historyApplyBtn") {
    historyFetchAndRender();
  }
});

let historyCurrentUnit = 1;

const HISTORY_UNIT_LIMITS = {
  1: 30,
  2: 60,
  3: 90
};

document.addEventListener("click", (e) => {
  const unitBtn = e.target.closest(".history-unit-btn");
  if (!unitBtn) return;

  const tabs = document.getElementById("historyUnitTabs");
  if (!tabs || !tabs.contains(unitBtn)) return;

  tabs.querySelectorAll(".history-unit-btn").forEach(b => b.classList.remove("active"));
  unitBtn.classList.add("active");

  historyCurrentUnit = parseInt(unitBtn.getAttribute("data-unit"));
});
    
function openHistoryRateModalPanel() {
  if (!historyRateModal) return;

  historyRateModal.style.display = "flex";
  document.body.classList.add("history-modal-open");
  initHistoryDates();
  historyUpdateSelectedTags();
  resetHistoryChart();
  loadHistoryCandidates();
}



const openGradeDistBtn = document.getElementById("openGradeDistBtn");
const gradeDistModal = document.getElementById("gradeDistModal");
const closeGradeDistBtn = document.getElementById("closeGradeDistBtn");
const gradeDistContent = document.getElementById("gradeDistContent");



function renderGradeDist(counts) {
  if (!gradeDistContent) return;

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  if (!total) {
    gradeDistContent.innerHTML = `<div class="grade-dist-empty">데이터 없음 😢</div>`;
    return;
  }

  const rows = GRADE_TABLE
    .map(g => {
      const count = counts[g.grade] || 0;
      if (count === 0) return "";
      const pct = ((count / total) * 100).toFixed(2);

      return `
        <div class="grade-dist-row">
          <div class="grade-dist-grade" style="color:${GRADE_COLORS[g.grade]}">${g.grade}</div>
          <div class="grade-dist-percent">${pct}%</div>
        </div>
      `;
    })
    .join("");

  gradeDistContent.innerHTML = `
    <div class="grade-dist-list">
      ${rows || `<div class="grade-dist-empty">데이터 없음 😢</div>`}
    </div>
  `;
}

async function loadGradeDist() {
  if (!gradeDistContent) return;

  gradeDistContent.innerHTML = `<div class="loading-text">불러오는 중...</div>`;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_grade_distribution`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        p_type: "op",
        p_start_date: "2026-04-07"
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`get_grade_distribution RPC failed: ${res.status} ${errText}`);
    }

    const data = await res.json();
    const counts = {};

    if (data && Array.isArray(data)) {
      for (const row of data) {
        counts[row.grade] = parseInt(row.grade_count, 10);
      }
    }

    renderGradeDist(counts);
  } catch (err) {
    console.error("loadGradeDist error:", err);
    gradeDistContent.innerHTML = `<div class="grade-dist-empty">등급 분포를 불러오지 못했어요.</div>`;
  }
}

if (openGradeDistBtn) {
  openGradeDistBtn.addEventListener("click", async () => {
    if (gradeDistModal) {
      gradeDistModal.style.display = "flex";
    }
    await loadGradeDist();
  });
}

if (closeGradeDistBtn) {
  closeGradeDistBtn.addEventListener("click", () => {
    if (gradeDistModal) {
      gradeDistModal.style.display = "none";
    }
  });
}

if (gradeDistModal) {
  gradeDistModal.addEventListener("click", (e) => {
    if (e.target === gradeDistModal) {
      gradeDistModal.style.display = "none";
    }
  });
}

    
  function updateLockIcons() {
  const opUnlocked           = completedState.op && todayOpGrade && A_MINUS_AND_ABOVE.includes(todayOpGrade);
  const favorUnlocked        = completedState.op || completedState.favor;
  const opRateUnlocked       = isOpRateUnlocked();
  const historyRateUnlocked  = completedState.op && completedState.favor;
  const classWinUnlocked     = completedState.op || completedState.favor;

  opLockIcon.style.display           = opUnlocked ? "none" : "flex";
  favorLockIcon.style.display        = favorUnlocked ? "none" : "flex";
  opRateLockIcon.style.display       = opRateUnlocked ? "none" : "flex";
  historyRateLockIcon.style.display  = historyRateUnlocked ? "none" : "flex";
  classWinLockIcon.style.display     = classWinUnlocked ? "none" : "flex";
}
    function sortRankingRows(rows) {
      return [...rows].sort((a,b)=>{
        if (b.champion_count!==a.champion_count) return b.champion_count-a.champion_count;
        if (Number(b.win_rate)!==Number(a.win_rate)) return Number(b.win_rate)-Number(a.win_rate);
        if (b.win_count!==a.win_count) return b.win_count-a.win_count;
        return a.engraving_name.localeCompare(b.engraving_name,"ko");
      });
    }

    function renderBoardFromRows(rows,mode) {
      currentBoardMode=mode;
      let filteredRows=rows;
      if (mode==="op") filteredRows=rows.filter(r=>!SUPPORT_ENGRAVINGS.includes(r.engraving_name));
      rankingBoard.classList.remove("locked","board-op","board-favor");
      rankingBoardTitle.classList.remove("ranking-title-op","ranking-title-favor");
      rankingBoardTitle.textContent=mode==="op"?"OP 직각 랭킹 보드":"호감 직각 랭킹 보드";
      rankingBoardSub.textContent="토너먼트 1개 완료 시 10위까지 공개되고, 2개 모두 완료 시 전체 랭킹이 공개됩니다.";
      modeOpBtn.classList.remove("active-op","disabled");
      modeFavorBtn.classList.remove("active-favor","disabled");
      if (!completedState.op)    modeOpBtn.classList.add("disabled");
      if (!completedState.favor) modeFavorBtn.classList.add("disabled");
      if (mode==="op") { modeOpBtn.classList.add("active-op"); rankingBoardTitle.classList.add("ranking-title-op"); rankingBoard.classList.add("board-op"); }
      else             { modeFavorBtn.classList.add("active-favor"); rankingBoardTitle.classList.add("ranking-title-favor"); rankingBoard.classList.add("board-favor"); }
      const sorted=sortRankingRows(filteredRows);
      const championTop=sorted[0]||null;
      const rateSorted=[...filteredRows].filter(r=>r.total_matches>0).sort((a,b)=>{
        if (Number(b.win_rate)!==Number(a.win_rate)) return Number(b.win_rate)-Number(a.win_rate);
        if (b.total_matches!==a.total_matches) return b.total_matches-a.total_matches;
        return b.win_count-a.win_count;
      });
      const rateTop=rateSorted[0]||championTop;
      const latestUpdatedAt=filteredRows.length>0?filteredRows[0].updated_at:null;
      rankingFooterNote.textContent=`※ 전체 랭킹은 매시간 정각 집계됩니다. 최근 집계: ${formatUpdatedAt(latestUpdatedAt)}`;

      const championTop3 = sorted.slice(0, 3);
      const rateTop3 = rateSorted.slice(0, 3);

      function podiumCard(item, rank, kind) {
        if (!item) return "";

        const podClass =
          rank === 1 ? "pod-1st" :
          rank === 2 ? "pod-2nd" :
          "pod-3rd";

        const valueText =
          kind === "champ"
            ? `${item.champion_count}회`
            : `${Number(item.win_rate).toFixed(2)}%`;

        return `
          <div class="pod-card ${podClass}">
            <div class="pod-rank">${rank}위</div>
            <div class="pod-icon">
              <img src="${getIconPath(item.engraving_name)}" alt="${item.engraving_name}" onerror="this.style.opacity='0.2';">
            </div>
            <div class="pod-name">${getShortName(item.engraving_name)}</div>
            <div class="pod-val">${valueText}</div>
          </div>
        `;
      }

      summaryCards.innerHTML = `
        <div class="podium-section ps-champ">
          <div class="podium-section-title">
            <span>🏆</span>
            <span>우승 TOP 3</span>
          </div>
          <div class="podium-trio">
            ${podiumCard(championTop3[0], 1, "champ")}
            ${podiumCard(championTop3[1], 2, "champ")}
            ${podiumCard(championTop3[2], 3, "champ")}
          </div>
        </div>

        <div class="podium-section ps-rate">
          <div class="podium-section-title">
            <span>⚔️</span>
            <span>승률 TOP 3</span>
          </div>
          <div class="podium-trio">
            ${podiumCard(rateTop3[0], 1, "rate")}
            ${podiumCard(rateTop3[1], 2, "rate")}
            ${podiumCard(rateTop3[2], 3, "rate")}
          </div>
        </div>
      `;
      
      if (sorted.length===0) {
        rankingList.innerHTML=`<div class="rank-row"><div class="rank-col"><div class="rank-num">-</div></div><div class="rank-col"><div class="rank-name">데이터 없음</div><div class="rank-job">집계 이후 자동 반영됩니다.</div></div></div>`;
        return;
      }
      const bothCompleted=completedState.op&&completedState.favor;
      const oneCompleted=completedState.op||completedState.favor;
      const revealLimit=bothCompleted?Infinity:(oneCompleted?10:0);

            rankingList.innerHTML=sorted.map((row,index)=>{
        const hidden=index>=revealLimit;

        let iconClass = "";
        let rowClass = "";
        let rankClass = "";

        if (index === 0) {
          iconClass = "icon-1st";
          rowClass = "row-1st";
          rankClass = "top1";
        } else if (index === 1) {
          iconClass = "icon-2nd";
          rowClass = "row-2nd";
          rankClass = "top2";
        } else if (index === 2) {
          iconClass = "icon-3rd";
          rowClass = "row-3rd";
          rankClass = "top3";
        }

        return `<div class="rank-row ${rowClass} ${hidden?"dimmed":""}">
          <div class="rank-col"><div class="rank-num ${rankClass}">${index+1}위</div></div>

          <div class="rank-col">
            <div class="rank-icon-wrap ${iconClass}">
              <img src="${getIconPath(row.engraving_name)}" alt="${row.engraving_name}" onerror="this.style.opacity='0.2';">
            </div>
          </div>

          <div class="rank-col">
            <div class="rank-name">${row.engraving_name}</div>
            <div class="rank-job">${row.class_name}</div>
          </div>

          <div class="rank-col metric-block">
            <div class="metric-title">우승 횟수</div>
            <div class="metric-main">${row.champion_count}회</div>
            <div class="meter">
              <div class="meter-fill win" style="width:${Math.min(100,row.champion_count*12)}%;"></div>
            </div>
          </div>

          <div class="rank-col metric-block">
            <div class="metric-title">1:1 승률</div>
            <div class="metric-main">${Number(row.win_rate).toFixed(2)}%</div>
            <div class="meter">
              <div class="meter-fill rate" style="width:${Math.min(100,Number(row.win_rate))}%;"></div>
            </div>
          </div>

          <div class="rank-col metric-block">
            <div class="metric-title">설명</div>
            <div class="metric-sub">총 ${row.total_matches}전 · ${row.win_count}승 ${row.lose_count}패</div>
          </div>
        </div>`;
      }).join("");
      
                 if (!bothCompleted&&oneCompleted&&sorted.length>10) {
        const dimmedRows = rankingList.querySelectorAll(".rank-row.dimmed");
        if (dimmedRows.length > 0) {
          dimmedRows[0].insertAdjacentHTML("beforebegin",`
            <div class="locked-notice">
              <div class="locked-notice-icon">🔒</div>
              <div class="locked-notice-text">OP / 호감 토너먼트를 <strong>모두 완료</strong>하면 전체 랭킹이 오픈됩니다!</div>
            </div>
          `);
        }
      }
    }

    async function loadRankingData(mode) {
  const cacheKey = "all_" + mode;

  if (rankingCache[cacheKey]) {
    renderBoardFromRows(rankingCache[cacheKey], mode);
    return;
  }

  const {data,error}=await supabase.from("ranking_overall").select("tournament_type,class_name,engraving_name,champion_count,win_count,lose_count,total_matches,win_rate,updated_at").eq("tournament_type",mode);
  if (error) { alert("랭킹 조회 실패: "+error.message); return; }

  rankingCache[cacheKey] = data;
  renderBoardFromRows(data,mode);
}

async function loadRankingDataByPeriod(mode, period) {
  const cacheKey = "week_" + mode;

  if (rankingCache[cacheKey]) {
    renderBoardFromRows(rankingCache[cacheKey], mode);
    return;
  }

  const weekKey = getWeekKey();

  const {data, error} = await supabase.rpc("get_weekly_ranking", {
    p_type: mode,
    p_week: weekKey
  });

  if (error) { alert("주간 랭킹 조회 실패: " + error.message); return; }

  rankingCache[cacheKey] = data;
  renderBoardFromRows(data, mode);
}

async function loadRankingDataByMonth(mode) {
  const cacheKey = "month_" + mode;

  if (rankingCache[cacheKey]) {
    renderBoardFromRows(rankingCache[cacheKey], mode);
    return;
  }

  const monthKey = getMonthKey();

  const {data, error} = await supabase.rpc("get_monthly_ranking", {
    p_type: mode,
    p_month: monthKey
  });

  if (error) { alert("월간 랭킹 조회 실패: " + error.message); return; }

  rankingCache[cacheKey] = data;
  renderBoardFromRows(data, mode);
}
    
    function updateRankingLockState() {
      const bothCompleted=completedState.op&&completedState.favor;
      const oneCompleted=completedState.op||completedState.favor;
      if (!oneCompleted) {
        rankingBoard.classList.add("locked"); rankingBoard.classList.remove("board-op","board-favor");
        rankingBoardTitle.classList.remove("ranking-title-op","ranking-title-favor");
        lockTitle.textContent="토너먼트 완료 후 랭킹이 공개됩니다";
        lockDesc.textContent="OP 직각 또는 호감 직각 토너먼트를 완료하면 해당 랭킹이 해제됩니다.";
        currentBoardMode=null; return;
      }
      rankingBoard.classList.remove("locked");
      if (completedState.op&&!completedState.favor)  { currentBoardMode="op";    loadRankingData("op");    return; }
      if (!completedState.op&&completedState.favor)  { currentBoardMode="favor"; loadRankingData("favor"); return; }
      if (bothCompleted) { if (!currentBoardMode) currentBoardMode="op"; loadRankingData(currentBoardMode); }
    }

    function computeTotalMatches(n) { return Math.max(1,n-1); }
    function getRoundLabel(count) {
      if (count<=2) return "FINAL"; if (count===4) return "4강"; if (count===8) return "8강";
      if (count===16) return "16강"; if (count===32) return "32강"; if (count===64) return "64강";
      return `${count}강`;
    }
    function getStageClass(count) {
      if (count<=2) return "stage-red"; if (count<=7) return "stage-yellow";
      if (count<=16) return "stage-purple"; if (count<=32) return "stage-blue"; return "stage-green";
    }
    function playFlipSound() {
  if (!battleSoundEnabled || battleMasterVolume <= 0) return;
  try {
    flipAudio.currentTime = 0;
    flipAudio.play().catch(() => {});
  } catch {}
}

function playWinnerSound() {
  if (!battleSoundEnabled || battleMasterVolume <= 0) return;
  try {
    winnerAudio.currentTime = 0;
    winnerAudio.play().catch(() => {});
  } catch {}
}

    async function loadCandidates() {
      const {data,error}=await supabase.from("candidates").select("id,class_name,engraving_name,enabled").order("id",{ascending:true});
      if (error) { opStartBtn.disabled=favorStartBtn.disabled=opRankBtn.disabled=favorRankBtn.disabled=true; return; }
      allCandidates=data;
    }

    async function loadTodayParticipation() {
      visitorKey=getVisitorKey();
      const {data,error}=await supabase.from("sessions").select("tournament_type,date_key,grade").eq("visitor_key",visitorKey).eq("date_key",getDateKey());
      if (error) return;
      completedState.op    =!!data.find(r=>r.tournament_type==="op");
      completedState.favor =!!data.find(r=>r.tournament_type==="favor");
      if (completedState.op) {
  opStamp.classList.add("show"); opStampDate.textContent=formatStampDate(getDateKey());
  const opRow=data.find(r=>r.tournament_type==="op");
  if (opRow&&opRow.grade) {
    opStampGrade.textContent=opRow.grade; todayOpGrade=opRow.grade;
    opStamp.classList.remove("stamp-ss","stamp-s","stamp-a","stamp-b","stamp-c","stamp-d","stamp-e","stamp-f");
    opStamp.classList.add(getStampClass(opRow.grade));
  }
} else { opStamp.classList.remove("show"); todayOpGrade=null; }
      if (completedState.favor) { favorStamp.classList.add("show"); favorStampDate.textContent=formatStampDate(getDateKey()); }
      else { favorStamp.classList.remove("show"); }
      updateLockIcons();
      updateRankingLockState();
    }


function openClassModal(type) {
  currentTournamentType=type;
  classFlowLabel.textContent=type==="op"?"OP TOURNAMENT":"FAVOR TOURNAMENT";
  classTable.innerHTML=Object.entries(classGroups).map(([groupName,classes])=>`
    <div class="class-row">
      <div class="class-group">${groupName}</div>
      <div class="class-buttons">${classes.map(cls=>`<button class="secondary-btn class-select-btn" data-class="${cls}" style="padding:10px 14px;">${cls}</button>`).join("")}</div>
    </div>`).join("");
  classModal.classList.add("show");
  classTable.querySelectorAll(".class-select-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{ selectedClass=btn.dataset.class; classModal.classList.remove("show"); startBattle(type,selectedClass); });
  });
}


    function closeClassModal() { classModal.classList.remove("show"); }

   function resetBattleCardEffects() {
  leftChoiceBtn.className=rightChoiceBtn.className="battle-choice";
  leftChoiceBtn.disabled=rightChoiceBtn.disabled=false;
  leftChoiceIcon.style.opacity="1";
  rightChoiceIcon.style.opacity="1";
  leftChoiceBtn.style.filter="";
  rightChoiceBtn.style.filter="";
}

    async function startBattle(type,selectedClassName) {
      let pool=type==="favor"?allCandidates.filter(i=>i.enabled||FAVOR_ONLY_IDS.includes(i.id)):allCandidates.filter(i=>i.enabled);
        if (battleIconsReady) await battleIconsReady;
      if (type==="op") await loadRecentWinRates("op");
      const filtered=pool.filter(i=>i.class_name!==selectedClassName);
      workingCandidates=shuffle(filtered); currentRoundCandidates=[...workingCandidates]; nextRoundCandidates=[];
      currentIndex=0; currentLeft=currentRight=null;
      totalMatches=computeTotalMatches(filtered.length); completedMatches=0;
      battleLogs=[]; pendingWinner=null; opScore=opMaxScore=0; isChoosing=false;
      battleModeLabel.textContent=type==="op"?"OP TOURNAMENT":"FAVOR TOURNAMENT";
      battleTopKorTitle.textContent=type==="op"?"OP 직각 토너먼트":"호감 직각 토너먼트";
      battleTopKorTitle.style.color=type==="op"?"#8ef0c9":"#ffd48a";
     battleModal.classList.remove("mode-op","mode-favor");
     battleModal.classList.add(type==="op" ? "mode-op" : "mode-favor");

      battleModal.classList.add("show"); renderNextBattle();
    }

    function updateBattleProgress() {
      const pct=totalMatches>0?Math.floor((completedMatches/totalMatches)*100):0;
      battleProgressText.textContent=`${pct}%`; battleProgressFill.style.width=`${pct}%`;
    }

    function renderNextBattle() {
      if (currentRoundCandidates.length===1) { pendingWinner=currentRoundCandidates[0]; showWinnerModal(pendingWinner); return; }
      if (currentIndex>=currentRoundCandidates.length) { currentRoundCandidates=[...nextRoundCandidates]; nextRoundCandidates=[]; currentIndex=0; }
      if (currentRoundCandidates.length===1) { pendingWinner=currentRoundCandidates[0]; showWinnerModal(pendingWinner); return; }
      currentLeft=currentRoundCandidates[currentIndex]; currentRight=currentRoundCandidates[currentIndex+1]||null;
      if (!currentRight) { nextRoundCandidates.push(currentLeft); currentIndex++; renderNextBattle(); return; }
      resetBattleCardEffects();
      const sc=getStageClass(currentRoundCandidates.length);
      leftChoiceBtn.classList.add(sc); rightChoiceBtn.classList.add(sc);
      
battleRoundTitle.textContent = getBattleLine(currentTournamentType);

     battleSubText.textContent = `${selectedClass} 제외`;
if (battleCenterRound) {
  battleCenterRound.textContent = getRoundLabel(currentRoundCandidates.length);
}
            setBattleCardVisuals("left", currentLeft);
      setBattleCardVisuals("right", currentRight);
      updateBattleProgress();
    }

    function chooseBattleWinner(side) {
  if (!currentLeft || !currentRight || isChoosing) return;

  isChoosing = true;
  playFlipSound();

  const winner   = side === "left" ? currentLeft  : currentRight;
  const loser    = side === "left" ? currentRight : currentLeft;
  const winBtn   = side === "left" ? leftChoiceBtn  : rightChoiceBtn;
  const loseBtn  = side === "left" ? rightChoiceBtn : leftChoiceBtn;
  const loseSide = side === "left" ? "right" : "left";

  if (currentTournamentType === "op") {
    const wrW = getWinRate(winner.engraving_name);
    const wrL = getWinRate(loser.engraving_name);
    opMaxScore++;
    if (wrW >= wrL) opScore++;
  }

  leftChoiceBtn.disabled = rightChoiceBtn.disabled = true;

  battleLogs.push({
    left_engraving: currentLeft.engraving_name,
    right_engraving: currentRight.engraving_name,
    winner_engraving: winner.engraving_name,
    loser_engraving: loser.engraving_name,
    round_label: getRoundLabel(currentRoundCandidates.length)
  });

  nextRoundCandidates.push(winner);
  completedMatches++;
  currentIndex += 2;

  const isMobileBattle = window.matchMedia("(max-width: 768px)").matches;

  if (isMobileBattle) {
    // 모바일에서는 애니메이션 완전 생략
    setTimeout(() => {
      isChoosing = false;
      renderNextBattle();
    }, 60);
    return;
  }

  // PC에서는 기존 애니메이션 유지
  winBtn.classList.add("anim-win");
  loseBtn.classList.add(loseSide === "right" ? "anim-lose-right" : "anim-lose-left");

  setTimeout(() => {
    isChoosing = false;
    renderNextBattle();
  }, 500);
}

function showWinnerModal(winner) {
  battleModal.classList.remove("show");
  playWinnerSound();

  winnerModeLabel.textContent = currentTournamentType === "op"
    ? "OP TOURNAMENT COMPLETE"
    : "FAVOR TOURNAMENT COMPLETE";

  winnerTitleText.textContent = getShortName(winner.engraving_name);
  winnerSubText.textContent = `우승 직각 · ${winner.class_name}`;
  winnerDescText.textContent = "토너먼트가 완료되었습니다. 확인을 누르면 저장 후 참여 완료 도장이 표시되고 랭킹이 해제됩니다.";




if (currentTournamentType === "op") {
  const grade = calcGrade(opScore, opMaxScore);
  const color = GRADE_COLORS[grade] || "#ccc";

  gsDate.textContent = formatStampDate(getDateKey());
  gsGrade.textContent = grade;
  gradeStampWrap.style.display = "flex";

  const gradeStampEl = document.getElementById("gradeStamp");
  gradeStampEl.classList.remove("stamp-ss","stamp-s","stamp-a","stamp-b","stamp-c","stamp-d","stamp-e","stamp-f");
  gradeStampEl.classList.add(getStampClass(grade));

  gradeComment.innerHTML = `
    <div class="percentile-line" style="color:${color}; font-weight:700; font-size:15px; margin-bottom:8px;">
      📊 실제 유저 분포를 계산 중입니다...
    </div>
    <div style="color:#8fa3bf; font-size:13px; line-height:1.7;">
      ${getRandomComment(grade)}
    </div>
  `;

  loadGradeDistStats().then(stats => {
    if (!winnerModal.classList.contains("show")) return;

    const info = getGradeDistributionInfo(grade, stats);

    if (!info) {
      gradeComment.innerHTML = `
        <div class="percentile-line" style="color:${color}; font-weight:700; font-size:15px; margin-bottom:8px;">
          📊 실제 유저 분포 데이터가 아직 부족합니다
        </div>
        <div style="color:#8fa3bf; font-size:13px; line-height:1.7;">
          ${getRandomComment(grade)}
        </div>
      `;
      return;
    }

    gradeComment.innerHTML = `
      <div class="percentile-line" style="color:${color}; font-weight:700; font-size:15px; margin-bottom:8px;">
        📊 전체 유저 중 <span style="font-size:18px; font-weight:900;">상위 ${info.topPct}%</span> 수준의 선택입니다
      </div>
      <div style="color:#8fa3bf; font-size:13px; line-height:1.7;">
        같은 등급(<strong style="color:${color};">${grade}</strong>)을 받은 유저는 전체의 <strong>${info.samePct}%</strong>입니다.<br>
        ${getRandomComment(grade)}
      </div>
    `;
  });
} else {
  gradeStampWrap.style.display = "none";
  gradeComment.textContent = "";
}



  winnerModal.classList.add("show");
  createConfetti();
}

async function finalizeTournamentSave() {
  if (!pendingWinner) return;
  if (isFinalizingTournament) return;
  isFinalizingTournament = true;
  winnerConfirmBtn.disabled = true;



  const clientIP=await getClientIP();

      const grade=currentTournamentType==="op"?calcGrade(opScore,opMaxScore):null;
      const score=currentTournamentType==="op"?opScore:0;
      const maxScore=currentTournamentType==="op"?opMaxScore:0;
      const sessionPayload={visitor_key:visitorKey,client_ip:clientIP,selected_class:selectedClass,winner_engraving:pendingWinner.engraving_name,tournament_type:currentTournamentType,date_key:getDateKey(),week_key:getWeekKey(),month_key:getMonthKey(),grade,score,max_score:maxScore};
      const {data:sessionData,error:sessionError}=await supabase.from("sessions").insert([sessionPayload]).select();
      if (sessionError) {
  alert("sessions 저장 실패: " + sessionError.message);
  isFinalizingTournament = false;
  winnerConfirmBtn.disabled = false;
  return;
}
      const sessionId=sessionData[0].id;
      if (battleLogs.length>0) {
        const matchPayload=battleLogs.map(log=>({session_id:sessionId,left_engraving:log.left_engraving,right_engraving:log.right_engraving,winner_engraving:log.winner_engraving,loser_engraving:log.loser_engraving,round_label:log.round_label,tournament_type:currentTournamentType,date_key:getDateKey(),week_key:getWeekKey(),month_key:getMonthKey()}));
        const {error:matchError}=await supabase.from("match_logs").insert(matchPayload);
        if (matchError) {
  alert("match_logs 저장 실패: " + matchError.message);
  isFinalizingTournament = false;
  winnerConfirmBtn.disabled = false;
  return;
}
      }
      if (currentTournamentType==="op") {
        completedState.op=true; todayOpGrade=grade;
        opStamp.classList.add("show"); opStampDate.textContent=formatStampDate(getDateKey()); opStampGrade.textContent=grade||"";
        opStamp.classList.remove("stamp-ss","stamp-s","stamp-a","stamp-b","stamp-c","stamp-d","stamp-e","stamp-f");
        opStamp.classList.add(getStampClass(grade));
      } else {
        completedState.favor=true; favorStamp.classList.add("show"); favorStampDate.textContent=formatStampDate(getDateKey());
      }
      currentBoardMode=currentTournamentType;
      winnerModal.classList.remove("show");
      updateLockIcons();
      updateRankingLockState();
      rankingBoard.scrollIntoView({behavior:"smooth",block:"start"});
      isFinalizingTournament = false;
      winnerConfirmBtn.disabled = false;
    }


async function handleStart(type) {
  const clientIP = await getClientIP();
  const {data, error} = await supabase
    .from("sessions")
    .select("id")
    .eq("date_key", getDateKey())
    .eq("tournament_type", type)
    .or(`visitor_key.eq.${visitorKey},client_ip.eq.${clientIP}`);

  if (error) { alert("참여 체크 실패: " + error.message); return; }
  if (data.length > 0) {
    alert(`${type==="op"?"OP":"호감"} 토너먼트는 오늘 이미 완료했습니다.`);
    return;
  }
  openClassModal(type);
}



    function createConfetti() {
      const colors=["#ff7070","#ffb36b","#ffd76b","#8bd0ff","#c48bff"];
      for (let i=0;i<28;i++) {
        const p=document.createElement("div"); p.className="confetti";
        p.style.left=`${Math.random()*100}%`; p.style.background=colors[Math.floor(Math.random()*colors.length)];
        p.style.animationDelay=`${Math.random()*0.4}s`; p.style.transform=`rotate(${Math.random()*360}deg)`;
        winnerModal.appendChild(p); setTimeout(()=>p.remove(),3200);
      }
    }

    // ===== 이벤트 =====
    opStartBtn.addEventListener("click",()=>handleStart("op"));
    favorStartBtn.addEventListener("click",()=>handleStart("favor"));

   

   modeOpBtn.addEventListener("click", async () => {
  if (!completedState.op) return;
  currentBoardMode = "op";
  if (document.getElementById("periodWeekBtn").classList.contains("active-period")) {
    await loadRankingDataByPeriod("op", "week");
  } else if (document.getElementById("periodMonthBtn").classList.contains("active-period")) {
    await loadRankingDataByMonth("op");
  } else {
    await loadRankingData("op");
  }
});

modeFavorBtn.addEventListener("click", async () => {
  if (!completedState.favor) return;
  currentBoardMode = "favor";
  if (document.getElementById("periodWeekBtn").classList.contains("active-period")) {
    await loadRankingDataByPeriod("favor", "week");
  } else if (document.getElementById("periodMonthBtn").classList.contains("active-period")) {
    await loadRankingDataByMonth("favor");
  } else {
    await loadRankingData("favor");
  }
});

    function clearPeriodTabs() {
  document.getElementById("periodWeekBtn").classList.remove("active-period");
  document.getElementById("periodMonthBtn").classList.remove("active-period");
  document.getElementById("periodAllBtn").classList.remove("active-period");
}

document.getElementById("periodAllBtn").addEventListener("click", async () => {
  if (!completedState.op && !completedState.favor) return;
  clearPeriodTabs();
  document.getElementById("periodAllBtn").classList.add("active-period");
  await loadRankingData(currentBoardMode || "op");
});

document.getElementById("periodWeekBtn").addEventListener("click", async () => {
  if (!completedState.op && !completedState.favor) return;
  clearPeriodTabs();
  document.getElementById("periodWeekBtn").classList.add("active-period");
  await loadRankingDataByPeriod(currentBoardMode || "op", "week");
});

document.getElementById("periodMonthBtn").addEventListener("click", async () => {
  if (!completedState.op && !completedState.favor) return;
  clearPeriodTabs();
  document.getElementById("periodMonthBtn").classList.add("active-period");
  await loadRankingDataByMonth(currentBoardMode || "op");
});
    
    closeClassModalBtn.addEventListener("click",closeClassModal);
    leftChoiceBtn.addEventListener("click",()=>chooseBattleWinner("left"));
    rightChoiceBtn.addEventListener("click",()=>chooseBattleWinner("right"));

    quitBattleBtn.addEventListener("click",()=>{
      if (!confirm("진행 중인 토너먼트를 종료하시겠습니까?\n현재 진행은 저장되지 않습니다.")) return;
      isChoosing=false; battleModal.classList.remove("show");
    });

    winnerConfirmBtn.addEventListener("click",finalizeTournamentSave);

    document.getElementById("openGuideBtn").addEventListener("click",()=>{ guideModal.classList.add("show"); });
    document.getElementById("closeGuideBtn").addEventListener("click",()=>{ guideModal.classList.remove("show"); });
    guideModal.addEventListener("click",e=>{ if(e.target===guideModal) guideModal.classList.remove("show"); });

    document.getElementById("openOpTierBtn").addEventListener("click",async(e)=>{
  const opUnlocked=completedState.op&&todayOpGrade&&A_MINUS_AND_ABOVE.includes(todayOpGrade);
  if (!opUnlocked) {
    showMiniPopup(e.currentTarget,"OP직각 티어표",`열람 조건 : <span class="cond">A 도장 획득 필요</span>`);
    return;
  }
  opTierModal.classList.add("show");
  document.getElementById("opTierContent").innerHTML=`<div class="loading-text">데이터 불러오는 중...</div>`;
  const entries=await loadTierDataDays("op", 10);
  if (entries&&entries.length>0) { const now = new Date();
const stamp = `${String(now.getFullYear()).slice(2)}.${String(now.getMonth()+1).padStart(2,"0")}.${String(now.getDate()).padStart(2,"0")} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
document.getElementById("opTierSub").textContent=`최근 10일간 OP 1:1 승률 통합 기준 🕖 ${stamp}`; renderTierContent(calcTiers(entries),"opTierContent"); }
  else { document.getElementById("opTierContent").innerHTML=`<div class="loading-text">데이터를 불러오지 못했어요 😢</div>`; }
});

    document.getElementById("closeOpTierBtn").addEventListener("click",()=>{ opTierModal.classList.remove("show"); });
    opTierModal.addEventListener("click",e=>{ if(e.target===opTierModal) opTierModal.classList.remove("show"); });

    document.getElementById("openFavorTierBtn").addEventListener("click",async(e)=>{
  const favorUnlocked=completedState.op||completedState.favor;
  if (!favorUnlocked) {
    showMiniPopup(e.currentTarget,"호감직각 티어표",`열람 조건 : <span class="cond">아무 도장 1개 획득 필요</span>`);
    return;
  }
  favorTierModal.classList.add("show");
  document.getElementById("favorTierContent").innerHTML=`<div class="loading-text">데이터 불러오는 중...</div>`;
  const entries=await loadTierDataDays("favor", 10);
  if (entries&&entries.length>0) { const now = new Date();
const stamp = `${String(now.getFullYear()).slice(2)}.${String(now.getMonth()+1).padStart(2,"0")}.${String(now.getDate()).padStart(2,"0")} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
document.getElementById("favorTierSub").textContent=`최근 10일간 호감 1:1 승률 통합 기준 🕜 ${stamp}`; renderTierContent(calcTiers(entries),"favorTierContent"); }
  else { document.getElementById("favorTierContent").innerHTML=`<div class="loading-text">데이터를 불러오지 못했어요 😢</div>`; }
});

    document.getElementById("closeFavorTierBtn").addEventListener("click",()=>{ favorTierModal.classList.remove("show"); });
    favorTierModal.addEventListener("click",e=>{ if(e.target===favorTierModal) favorTierModal.classList.remove("show"); });

document.getElementById("closeOpRateBtn").addEventListener("click",()=>{ opRateModal.classList.remove("show"); });
opRateModal.addEventListener("click",e=>{ if(e.target===opRateModal) opRateModal.classList.remove("show"); });

    document.querySelectorAll("#opRateCompareTabs .oprate-compare-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    document.querySelectorAll("#opRateCompareTabs .oprate-compare-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    await refreshOpRateModal(btn.dataset.mode);
  });
});
    

   document.getElementById("openOpRateBtn").addEventListener("click", async (e) => {
  const opRateUnlocked = isOpRateUnlocked();

  if (!opRateUnlocked) {
    showMiniPopup(
      e.currentTarget,
      "OP직각 승률표",
      `열람 조건 : <span class="cond">S 도장 이상 획득 필요</span>`
    );
    return;
  }

  opRateModal.classList.add("show");

  const compareBtns = document.querySelectorAll("#opRateCompareTabs .oprate-compare-btn");
  compareBtns.forEach(btn => btn.classList.remove("active"));
  const defaultBtn = document.querySelector('#opRateCompareTabs .oprate-compare-btn[data-mode="postpatch"]');
  if (defaultBtn) defaultBtn.classList.add("active");

  await refreshOpRateModal("postpatch");
});

document.addEventListener("click", (e) => {
  const historyBtn = e.target.closest("#openHistoryRateBtn");
  if (!historyBtn) return;

  const historyRateUnlocked = completedState.op && completedState.favor;

  if (!historyRateUnlocked) {
    showMiniPopup(
      historyBtn,
      "승률 변동 그래프",
      `열람 조건 : <span class="cond">도장 2개 이상 획득 필요</span>`
    );
    return;
  }

  openHistoryRateModalPanel();
});
    




document.getElementById("closeClassWinBtn").addEventListener("click", () => {
  classWinModal.classList.remove("show");
  document.body.classList.remove("class-win-modal-open");
});

classWinModal.addEventListener("click", e => {
  if (e.target === classWinModal){
    classWinModal.classList.remove("show");
    document.body.classList.remove("class-win-modal-open");
  }
});




    document.addEventListener("keydown",e=>{
  if (e.key==="Escape") {
    guideModal.classList.remove("show");
    opTierModal.classList.remove("show");
    favorTierModal.classList.remove("show");
    opRateModal.classList.remove("show");
    document.getElementById("inquiryModal").classList.remove("show");
    document.getElementById("inqPwPopup")?.classList.remove("show");
    classWinModal.classList.remove("show");
    document.body.classList.remove("class-win-modal-open");
  }
});


        // ===== 문의 게시판 =====
    const inquiryModal = document.getElementById("inquiryModal");
    const openInquiryBtn = document.getElementById("openInquiryBtn");
    const closeInquiryBtn = document.getElementById("closeInquiryBtn");
    const inquiryListPanel = document.getElementById("inquiryListPanel");
    const inquiryWritePanel = document.getElementById("inquiryWritePanel");
    const inquiryReadResult = document.getElementById("inquiryReadResult");
    const inquiryListContent = document.getElementById("inquiryListContent");
    const inqSubmitBtn = document.getElementById("inqSubmitBtn");

    const inqPwPopup = document.getElementById("inqPwPopup");
    const inqPwPopupInput = document.getElementById("inqPwPopupInput");
    const inqPwPopupCancel = document.getElementById("inqPwPopupCancel");
    const inqPwPopupConfirm = document.getElementById("inqPwPopupConfirm");

    let selectedInquiryId = null;
    let isSubmittingInquiry = false;

    if (
      inquiryModal &&
      openInquiryBtn &&
      closeInquiryBtn &&
      inquiryListPanel &&
      inquiryWritePanel &&
      inquiryReadResult &&
      inquiryListContent &&
      inqSubmitBtn &&
      inqPwPopup &&
      inqPwPopupInput &&
      inqPwPopupCancel &&
      inqPwPopupConfirm
    ) {
      openInquiryBtn.addEventListener("click", () => {
        inquiryModal.classList.add("show");
        switchInquiryTab("list");
        loadInquiryList();
      });

      closeInquiryBtn.addEventListener("click", () => {
        inquiryModal.classList.remove("show");
      });

      inquiryModal.addEventListener("click", e => {
        if (e.target === inquiryModal) inquiryModal.classList.remove("show");
      });

      inqPwPopupCancel.addEventListener("click", () => {
        inqPwPopup.classList.remove("show");
        inqPwPopupInput.value = "";
        selectedInquiryId = null;
      });

      inqPwPopup.addEventListener("click", e => {
        if (e.target === inqPwPopup) {
          inqPwPopup.classList.remove("show");
          inqPwPopupInput.value = "";
          selectedInquiryId = null;
        }
      });

      document.querySelectorAll(".inquiry-tab").forEach(tab => {
        tab.addEventListener("click", () => {
          switchInquiryTab(tab.dataset.tab);
        });
      });

      function switchInquiryTab(tabName) {
        document.querySelectorAll(".inquiry-tab").forEach(t => t.classList.remove("active"));
        const targetTab = document.querySelector('.inquiry-tab[data-tab="' + tabName + '"]');
        if (targetTab) targetTab.classList.add("active");

        inquiryListPanel.style.display = tabName === "list" ? "block" : "none";
        inquiryWritePanel.style.display = tabName === "write" ? "block" : "none";
        inquiryReadResult.style.display = "none";
      }

      async function loadInquiryList() {
        inquiryListContent.innerHTML = '<div class="loading-text">불러오는 중...</div>';

        const result = await supabase.rpc("list_inquiries");

        if (result.error || !result.data || result.data.length === 0) {
          inquiryListContent.innerHTML = '<div class="inq-empty">아직 문의가 없습니다 📭</div>';
          return;
        }

        let html = '<div class="inquiry-list">';

        result.data.forEach(function(row) {
          const dateStr = new Date(row.created_at).toLocaleDateString("ko-KR", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit"
          });

          const statusClass = row.status === "답변완료" ? "inq-status-replied" : "inq-status-waiting";

                    html +=
            '<div class="inquiry-item" data-inquiry-id="' + row.id + '">' +
              '<div class="inq-no">#' + row.id + '</div>' +
              '<div class="inq-info">' +
                '<div class="inq-title-text">' + row.title + '</div>' +
                '<div class="inq-meta">' +
                  '<span class="inq-badge-secret">비밀글</span>' +
                  '<span class="inq-badge-type">' + row.inquiry_type + '</span>' +
                  '<span>' + dateStr + '</span>' +
                '</div>' +
              '</div>' +
              '<div class="inq-status ' + statusClass + '">' + row.status + '</div>' +
            '</div>';
        });

        html += '</div>';
        inquiryListContent.innerHTML = html;
      }

      inquiryListContent.addEventListener("click", function(e) {
        const item = e.target.closest(".inquiry-item");
        if (!item) return;

        selectedInquiryId = Number(item.dataset.inquiryId);
        inqPwPopupInput.value = "";
        inqPwPopup.classList.add("show");

        setTimeout(() => {
          inqPwPopupInput.focus();
        }, 20);
      });

      async function openInquiryWithPassword() {
        const pw = inqPwPopupInput.value.trim();

        if (!selectedInquiryId || !pw) {
          alert("비밀번호를 입력해 주세요.");
          return;
        }

        const result = await supabase.rpc("read_inquiry", {
          p_id: selectedInquiryId,
          p_password: pw
        });

        if (result.error || !result.data || result.data.length === 0) {
          alert("비밀번호가 일치하지 않습니다.");
          return;
        }

        const row = result.data[0];

        const dateStr = new Date(row.created_at).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        });

        let replyHTML = "";

        if (row.status === "답변완료" && row.admin_reply) {
          const replyDate = new Date(row.replied_at).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
          });

          replyHTML =
            '<div class="inq-reply-section">' +
              '<div class="inq-reply-label">✅ 관리자 답변</div>' +
              '<div class="inq-reply-text">' + row.admin_reply + '</div>' +
              '<div class="inq-reply-date">' + replyDate + '</div>' +
            '</div>';
        } else {
          replyHTML = '<div class="inq-no-reply">⏳ 아직 답변이 등록되지 않았습니다</div>';
        }

                            const canEdit = row.status !== "답변완료";

        let statusHTML = "";
        if (row.status === "답변완료" && row.admin_reply) {
          const replyDate = new Date(row.replied_at).toLocaleDateString("ko-KR", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit"
          });
          statusHTML =
            '<div class="inq-reply-section">' +
              '<div class="inq-reply-label">✅ 관리자 답변</div>' +
              '<div class="inq-reply-text">' + row.admin_reply + '</div>' +
              '<div class="inq-reply-date">' + replyDate + '</div>' +
            '</div>';
        } else {
          statusHTML = '<div class="inq-no-reply">⏳ 아직 답변이 등록되지 않았습니다</div>';
        }

        if (canEdit) {
          inquiryReadResult.innerHTML =
            '<div class="inquiry-read-card">' +
              statusHTML +
              '<div class="inq-edit-field" style="margin-top:12px;">' +
                '<div class="inq-edit-field-label">문의 유형</div>' +
                '<select class="inq-edit-select" id="inqEditType">' +
                  '<option value="오류제보"' + (row.inquiry_type === "오류제보" ? " selected" : "") + '>오류제보</option>' +
                  '<option value="질문하기"' + (row.inquiry_type === "질문하기" ? " selected" : "") + '>질문하기</option>' +
                  '<option value="기타"' + (row.inquiry_type === "기타" ? " selected" : "") + '>기타</option>' +
                '</select>' +
              '</div>' +
              '<div class="inq-edit-field">' +
                '<div class="inq-edit-field-label">제목</div>' +
                '<input class="inq-edit-input" type="text" id="inqEditTitle" value="' + row.title.replace(/"/g, '&quot;') + '" />' +
              '</div>' +
              '<div class="inq-edit-field">' +
                '<div class="inq-edit-field-label">내용</div>' +
                '<textarea class="inq-edit-textarea" id="inqEditContent">' + row.content + '</textarea>' +
              '</div>' +
                            '<button class="inq-edit-save-btn" id="inqEditSaveBtn">수정 저장</button>' +
              '<div class="inq-bottom-actions">' +
                '<button class="inq-delete-btn" id="inqDeleteBtn">삭제하기</button>' +
                '<button class="inq-read-close-btn" id="inqReadCloseBtn">닫기</button>' +
              '</div>' +
            '</div>';
        } else {
          inquiryReadResult.innerHTML =
            '<div class="inquiry-read-card">' +
              statusHTML +
              '<div class="inq-read-top" style="margin-top:12px;">' +
                '<div class="inq-read-badges">' +
                  '<span class="inq-badge-secret">비밀글</span>' +
                  '<span class="inq-badge-type">' + row.inquiry_type + '</span>' +
                '</div>' +
                '<div class="inq-read-date">' + dateStr + '</div>' +
              '</div>' +
              '<div class="inq-read-title-wrap">' +
                '<div class="inq-read-id">#' + row.id + '</div>' +
                '<div class="inq-read-title-text">' + row.title + '</div>' +
              '</div>' +
              '<div class="inq-read-content">' + row.content + '</div>' +
              '<button class="inq-read-close-btn" id="inqReadCloseBtn">닫기</button>' +
            '</div>';
        }

        inquiryReadResult.style.display = "block";
        inqPwPopup.classList.remove("show");

        const savedPw = inqPwPopupInput.value.trim();
        const savedId = selectedInquiryId;

        inqPwPopupInput.value = "";
        selectedInquiryId = null;

        const inqReadCloseBtn = document.getElementById("inqReadCloseBtn");
        if (inqReadCloseBtn) {
          inqReadCloseBtn.addEventListener("click", function() {
            inquiryReadResult.style.display = "none";
          });
        }


        const inqDeleteBtn = document.getElementById("inqDeleteBtn");
        if (inqDeleteBtn && canEdit) {
          inqDeleteBtn.addEventListener("click", async function() {
            if (!confirm("정말 이 문의를 삭제하시겠습니까?\n삭제 후 복구할 수 없습니다.")) return;

            inqDeleteBtn.disabled = true;
            inqDeleteBtn.textContent = "삭제 중...";

            const deleteResult = await supabase.rpc("delete_inquiry", {
              p_id: savedId,
              p_password: savedPw
            });

            if (deleteResult.error || deleteResult.data === false) {
              alert("삭제 실패: 비밀번호가 일치하지 않거나 이미 답변된 글입니다.");
              inqDeleteBtn.disabled = false;
              inqDeleteBtn.textContent = "삭제하기";
              return;
            }

            alert("문의가 삭제되었습니다.");
            inquiryReadResult.style.display = "none";
            loadInquiryList();
          });
        }
        
           const inqEditSaveBtn = document.getElementById("inqEditSaveBtn");
        if (inqEditSaveBtn && canEdit) {
          inqEditSaveBtn.addEventListener("click", async function() {
            const newType = document.getElementById("inqEditType").value;
            const newTitle = document.getElementById("inqEditTitle").value.trim();
            const newContent = document.getElementById("inqEditContent").value.trim();

            if (!newTitle) { alert("제목을 입력해 주세요."); return; }
            if (!newContent) { alert("내용을 입력해 주세요."); return; }

            inqEditSaveBtn.disabled = true;
            inqEditSaveBtn.textContent = "저장 중...";

            const updateResult = await supabase.rpc("update_inquiry_content", {
              p_id: savedId,
              p_password: savedPw,
              p_type: newType,
              p_title: newTitle,
              p_content: newContent
            });

            if (updateResult.error || updateResult.data === false) {
              alert("수정 실패: 비밀번호가 일치하지 않거나 이미 답변된 글입니다.");
              inqEditSaveBtn.disabled = false;
              inqEditSaveBtn.textContent = "수정 저장";
              return;
            }

            alert("내용이 수정되었습니다.");
            inquiryReadResult.style.display = "none";
            loadInquiryList();
          });
        }
      }

      inqPwPopupConfirm.addEventListener("click", openInquiryWithPassword);

      inqPwPopupInput.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
          openInquiryWithPassword();
        }
      });

      inqSubmitBtn.addEventListener("click", async function() {
        if (isSubmittingInquiry) return;

        const type = document.getElementById("inqType").value;
        const title = document.getElementById("inqTitle").value.trim();
        const content = document.getElementById("inqContent").value.trim();
        const pw1 = document.getElementById("inqPw1").value;
        const pw2 = document.getElementById("inqPw2").value;

        if (!title) {
          alert("제목을 입력해 주세요.");
          return;
        }

        if (!content) {
          alert("내용을 입력해 주세요.");
          return;
        }

        if (!pw1 || pw1.length < 4 || pw1.length > 8) {
          alert("비밀번호는 4~8자리로 입력해 주세요.");
          return;
        }

        if (pw1 !== pw2) {
          alert("비밀번호가 일치하지 않습니다.");
          return;
        }

        isSubmittingInquiry = true;
        inqSubmitBtn.disabled = true;

        const result = await supabase.rpc("create_inquiry", {
          p_type: type,
          p_title: title,
          p_content: content,
          p_password: pw1
        });

        if (result.error) {
          alert("문의 등록 실패: " + result.error.message);
          isSubmittingInquiry = false;
          inqSubmitBtn.disabled = false;
          return;
        }

        const newId = result.data;

        alert(
          "문의가 등록되었습니다!\n\n" +
          "문의 번호: #" + newId + "\n" +
          "이 번호와 비밀번호로 나중에 답변을 확인할 수 있습니다."
        );

        document.getElementById("inqTitle").value = "";
        document.getElementById("inqContent").value = "";
        document.getElementById("inqPw1").value = "";
        document.getElementById("inqPw2").value = "";

        isSubmittingInquiry = false;
        inqSubmitBtn.disabled = false;

        switchInquiryTab("list");
        loadInquiryList();
      });
    }
    
   async function init() {
  visitorKey=getVisitorKey();
  initCalendar();
  await loadCandidates();
  battleIconsReady = preloadBattleIcons();
  await battleIconsReady;
  await loadTodayParticipation();
     preloadAllOpRateModes();
     
  // 주간 탭 날짜 세팅
const now = new Date();
const weekAgo = new Date(now);
weekAgo.setDate(weekAgo.getDate() - 7);
const fmt = d => `${String(d.getFullYear()).slice(2)}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`;
document.getElementById("weekTabDate").textContent = `${fmt(weekAgo)} ~ 오늘`;
     document.getElementById("monthTabDate").textContent = `${now.getFullYear()}년 ${now.getMonth()+1}월`;
}
    // ===== 경매 계산기 =====
    function acFmt(n) { return Math.round(n).toLocaleString("ko-KR"); }
    function calcBreakeven(price, members) { return price * 0.95 * (members - 1) / members; }
    function calcRecommend(be, rate) { return be / (1 + rate); }

    let acMembers = 4;

    function acUpdate() {
      const raw = (document.getElementById("ac-price").value||"").replace(/,/g,"");
      const price = parseInt(raw) || 0;
      if (!price) {
        document.getElementById("ac-be").textContent = "-";
        document.getElementById("ac-be-desc").textContent = "거래소 가격을 입력하세요";
        [5,10].forEach(r => {
          document.getElementById(`ac-v${r}`).textContent = "-";
          document.getElementById(`ac-d${r}`).textContent = "가격 입력 시 표시";
          document.getElementById(`ac-bar${r}`).style.width = "0%";
        });
        return;
      }
      const be = calcBreakeven(price, acMembers);
      document.getElementById("ac-be").textContent = acFmt(be);
      document.getElementById("ac-be-desc").textContent = "이 금액 이하로 입찰하면 이득";
      const rec5 = calcRecommend(be, 0.05);
      const rec10 = calcRecommend(be, 0.10);
      document.getElementById("ac-v5").textContent = acFmt(rec5);
      document.getElementById("ac-d5").textContent = `${acFmt(rec5)} 입찰 시 ${acFmt(be - rec5)} 이득`;
      document.getElementById("ac-bar5").style.width = "60%";
      document.getElementById("ac-v10").textContent = acFmt(rec10);
      document.getElementById("ac-d10").textContent = `${acFmt(rec10)} 입찰 시 ${acFmt(be - rec10)} 이득`;
      document.getElementById("ac-bar10").style.width = "100%";
    }

    document.querySelectorAll(".ac-toggle-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".ac-toggle-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        acMembers = parseInt(btn.dataset.m);
        acUpdate();
      });
    });

    document.getElementById("ac-price").addEventListener("input", e => {
      let v = e.target.value.replace(/,/g,"").replace(/[^0-9]/g,"");
      e.target.value = v ? Number(v).toLocaleString("ko-KR") : "";
      acUpdate();
    });


/* ===== 클래스별 우승 분석 차트 ===== */
const CW_COLORS = ["#3b82f6","#a78bfa","#f7ca54","#34d399","#f87171","#4b5563"];
const CW_GLOW_A = [0.26,0.22,0.20,0.18,0.16,0.10];

let cwCurrentClass = "워로드";
let cwCurrentGroup = "전사";
let cwCurrentType = "op";
let cwAnimId = null;
let cwCurrentData = [];
let cwSliceAngles = [];
let cwHoverIndex = -1;
let cwHoverScale = [];
let cwRafRunning = false;
let cwEventsBound = false;

function cwGetShort(n){ return fullToShortMap[n] || n; }

function cwUpdateHeader(){
  const badge = document.getElementById("cwClassBadge");
  const title = document.getElementById("cwChartTitle");
  if(badge) badge.textContent = cwCurrentGroup;
  if(title){
    const hl = cwCurrentType === "op"
      ? '<span class="cw-hl-op">OP</span>'
      : '<span class="cw-hl-favor">호감</span>';
    title.innerHTML = cwCurrentClass + "가 선택한 " + hl + " 각인은?";
  }
}

function cwUpdateLegend(data){
  const wrap = document.getElementById("cwLegendWrap");
  if(!wrap) return;
  wrap.innerHTML = data.map((d,i) =>
    '<div class="cw-legend-item">' +
    '<div class="cw-legend-dot" style="background:' + CW_COLORS[i] + '"></div>' +
    d.name + ' ' + d.pct + '%</div>'
  ).join("");
}

function cwCalcAngles(data){
  const a = [];
  let c = 0;
  data.forEach(d => {
    const s = (c / 100) * Math.PI * 2 - Math.PI / 2;
    c += d.pct;
    const e = (c / 100) * Math.PI * 2 - Math.PI / 2;
    a.push({ start: s, end: e, mid: (s + e) / 2 });
  });
  return a;
}

async function cwLoadData(cls, type){
  const { data, error } = await supabase.rpc("get_class_winner_stats", {
    p_class: cls,
    p_type: type
  });
  if(error || !data || !data.length) return [];

  const rows = data.map(r => ({
    name: cwGetShort(r.winner_engraving),
    pct: Number(r.pick_rate)
  }));
  const total = rows.reduce((s,r) => s + r.pct, 0);
  if(total <= 0) return [];

  const top5 = rows.slice(0, 5);
  const etcPct = rows.slice(5).reduce((s,r) => s + r.pct, 0);

  const result = top5.map(r => ({
    name: r.name,
    pct: Number((r.pct / total * 100).toFixed(1))
  }));
  if(etcPct > 0) result.push({
    name: "기타",
    pct: Number((etcPct / total * 100).toFixed(1))
  });

  return result;
}

function cwGetHovered(mx, my){
  const canvas = document.getElementById("cwPieCanvas");
  if(!canvas) return -1;
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.width / rect.width;
  const sy = canvas.height / rect.height;
  const x = (mx - rect.left) * sx;
  const y = (my - rect.top) * sy;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = canvas.width * 0.37;
  const inner = r - canvas.width * 0.14;
  const dx = x - cx, dy = y - cy;
  const dist = Math.sqrt(dx*dx + dy*dy);
  if(dist < inner || dist > r + 30) return -1;
  let ang = Math.atan2(dy, dx);
  if(ang < -Math.PI/2) ang += Math.PI*2;
  for(let i = 0; i < cwSliceAngles.length; i++){
    if(ang >= cwSliceAngles[i].start && ang <= cwSliceAngles[i].end) return i;
  }
  return -1;
}

function cwStartHoverLoop(){
  cwRafRunning = true;
  function loop(){
    cwDrawDonut();
    let anyMoving = false;
    for(let i = 0; i < cwCurrentData.length; i++){
      const target = cwHoverIndex === i ? 1 : 0;
      if(Math.abs((cwHoverScale[i]||0) - target) > 0.005) anyMoving = true;
    }
    if(anyMoving || cwHoverIndex >= 0){
      requestAnimationFrame(loop);
    } else {
      cwRafRunning = false;
    }
  }
  requestAnimationFrame(loop);
}

function cwDrawDonut(){
  if(!cwCurrentData.length) return;
  const canvas = document.getElementById("cwPieCanvas");
  if(!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const cx = w/2, cy = h/2;
  const r = w * 0.37;
  const thickness = w * 0.14;
  const innerR = r - thickness;

  ctx.clearRect(0, 0, w, h);

  cwCurrentData.forEach((d, i) => {
    const sa = cwSliceAngles[i];
    if(!sa) return;

    const target = cwHoverIndex === i ? 1 : 0;
    cwHoverScale[i] = cwHoverScale[i] || 0;
    cwHoverScale[i] += (target - cwHoverScale[i]) * 0.12;

    const pop = cwHoverScale[i];
    const popDist = pop * 22;
    const popScale = 1 + pop * 0.08;
    const offX = Math.cos(sa.mid) * popDist;
    const offY = Math.sin(sa.mid) * popDist;
    const lr = r * popScale;
    const lt = thickness * popScale;

    ctx.save();
    ctx.beginPath(); ctx.arc(cx+offX, cy+offY, lr, sa.start, sa.end);
    ctx.strokeStyle = CW_COLORS[i]; ctx.lineWidth = lt + 44;
    ctx.globalAlpha = CW_GLOW_A[i] * (0.32 + pop*0.22);
    ctx.stroke(); ctx.restore();

    ctx.save();
    ctx.beginPath(); ctx.arc(cx+offX, cy+offY, lr, sa.start, sa.end);
    ctx.strokeStyle = CW_COLORS[i]; ctx.lineWidth = lt + 22;
    ctx.globalAlpha = CW_GLOW_A[i] * (1 + pop*0.6);
    ctx.stroke(); ctx.restore();

    ctx.beginPath(); ctx.arc(cx+offX, cy+offY, lr, sa.start, sa.end);
    ctx.strokeStyle = CW_COLORS[i]; ctx.lineWidth = lt; ctx.stroke();

    ctx.save();
    ctx.beginPath(); ctx.arc(cx+offX, cy+offY, lr, sa.start, sa.end);
    const g = ctx.createLinearGradient(cx, cy-lr, cx, cy);
    g.addColorStop(0, "rgba(255,255,255," + (0.14 + pop*0.10) + ")");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.strokeStyle = g; ctx.lineWidth = lt*0.42; ctx.stroke(); ctx.restore();

    const lx = cx + offX + lr * Math.cos(sa.mid);
    const ly = cy + offY + lr * Math.sin(sa.mid);
    const ns = d.pct >= 10 ? w*0.026 : w*0.020;
    const ps = d.pct >= 10 ? w*0.036 : w*0.026;
    const labelScale = 1 + pop*0.12;

    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.7)";
    ctx.shadowBlur = 8;
    ctx.font = "bold " + (ns*labelScale) + "px sans-serif";
    ctx.fillText(d.name, lx, ly - w*0.014);
    ctx.font = "bold " + (ps*labelScale) + "px sans-serif";
    ctx.fillText(d.pct + "%", lx, ly + w*0.016);
    ctx.restore();
  });

  ctx.beginPath(); ctx.arc(cx, cy, innerR-6, 0, Math.PI*2);
  ctx.fillStyle = "#13151c"; ctx.fill();
  ctx.strokeStyle = "#252836"; ctx.lineWidth = 1; ctx.stroke();

  ctx.fillStyle = "#4b5563";
  ctx.font = "bold " + (w*0.026) + "px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("TOP 5", cx, cy - w*0.014);

  ctx.fillStyle = "#fff";
  ctx.font = "bold " + (w*0.040) + "px sans-serif";
  ctx.fillText("우승 비율", cx, cy + w*0.028);
}

function cwAnimateEntry(data){
  if(cwAnimId) cancelAnimationFrame(cwAnimId);
  cwCurrentData = data;
  cwSliceAngles = cwCalcAngles(data);
  cwHoverScale = data.map(() => 0);
  cwHoverIndex = -1;

  const canvas = document.getElementById("cwPieCanvas");
  if(!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const cx = w/2, cy = h/2;
  const r = w * 0.37;
  const thickness = w * 0.14;
  const innerR = r - thickness;
  const dur = 850;
  const t0 = performance.now();

  function frame(now){
    const p = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1-p, 3);
    ctx.clearRect(0, 0, w, h);
    let cum = 0;

    data.forEach((d,i) => {
      const pn = d.pct * ease;
      const s = (cum/100) * Math.PI*2 - Math.PI/2;
      cum += pn;
      const e = (cum/100) * Math.PI*2 - Math.PI/2;
      if(e <= s) return;

      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, r, s, e);
      ctx.strokeStyle = CW_COLORS[i]; ctx.lineWidth = thickness+44;
      ctx.globalAlpha = CW_GLOW_A[i]*0.32; ctx.stroke(); ctx.restore();

      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, r, s, e);
      ctx.strokeStyle = CW_COLORS[i]; ctx.lineWidth = thickness+22;
      ctx.globalAlpha = CW_GLOW_A[i]; ctx.stroke(); ctx.restore();

      ctx.beginPath(); ctx.arc(cx, cy, r, s, e);
      ctx.strokeStyle = CW_COLORS[i]; ctx.lineWidth = thickness; ctx.stroke();

      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, r, s, e);
      const g = ctx.createLinearGradient(cx, cy-r, cx, cy);
      g.addColorStop(0, "rgba(255,255,255,0.14)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = g; ctx.lineWidth = thickness*0.42; ctx.stroke(); ctx.restore();

      if(p >= 0.85){
        const a = Math.min(1, (p-0.85)/0.15);
        const mid = (s+e)/2;
        const lx = cx + r * Math.cos(mid);
        const ly = cy + r * Math.sin(mid);
        const ns = d.pct >= 10 ? w*0.026 : w*0.020;
        const ps = d.pct >= 10 ? w*0.036 : w*0.026;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0,0,0,0.7)";
        ctx.shadowBlur = 8;
        ctx.font = "bold " + ns + "px sans-serif";
        ctx.fillText(d.name, lx, ly - w*0.014);
        ctx.font = "bold " + ps + "px sans-serif";
        ctx.fillText(d.pct + "%", lx, ly + w*0.016);
        ctx.restore();
      }
    });

    ctx.beginPath(); ctx.arc(cx, cy, innerR-6, 0, Math.PI*2);
    ctx.fillStyle = "#13151c"; ctx.fill();
    ctx.strokeStyle = "#252836"; ctx.lineWidth = 1; ctx.stroke();

    ctx.fillStyle = "#4b5563";
    ctx.font = "bold " + (w*0.026) + "px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("TOP 5", cx, cy - w*0.014);

    ctx.fillStyle = "#fff";
    ctx.font = "bold " + (w*0.040) + "px sans-serif";
    ctx.fillText("우승 비율", cx, cy + w*0.028);

    if(p < 1) cwAnimId = requestAnimationFrame(frame);
  }
  cwAnimId = requestAnimationFrame(frame);
}

async function cwAnimateRender(){
  const wrap = document.getElementById("cwPieWrap");
  if(!wrap) return;

  wrap.classList.add("fading");
  cwUpdateHeader();

  const data = await cwLoadData(cwCurrentClass, cwCurrentType);

  cwAnimateEntry(data);
  cwUpdateLegend(data);
  wrap.classList.remove("fading");
}

function cwInitEvents(){
  if(cwEventsBound) return;
  cwEventsBound = true;

  const cwSelectBtn = document.getElementById("cwSelectBtn");
  const cwSelectArrow = document.getElementById("cwSelectArrow");
  const cwSelectDropdown = document.getElementById("cwSelectDropdown");
  const cwSelectWrap = document.getElementById("cwSelectWrap");
  const cwPieCanvas = document.getElementById("cwPieCanvas");

  if(cwSelectBtn){
    cwSelectBtn.addEventListener("click", () => {
      cwSelectDropdown.classList.toggle("show");
      cwSelectArrow.classList.toggle("open");
    });
  }

  document.addEventListener("click", (e) => {
    if(cwSelectWrap && !cwSelectWrap.contains(e.target)){
      if(cwSelectDropdown) cwSelectDropdown.classList.remove("show");
      if(cwSelectArrow) cwSelectArrow.classList.remove("open");
    }
  });

  document.querySelectorAll(".cw-select-option").forEach(opt => {
    opt.addEventListener("click", () => {
      document.querySelectorAll(".cw-select-option")
        .forEach(o => o.classList.remove("cw-active"));
      opt.classList.add("cw-active");
      cwCurrentClass = opt.dataset.class;
      cwCurrentGroup = opt.dataset.group;
      const label = document.getElementById("cwSelectLabel");
      if(label) label.textContent = cwCurrentClass;
      if(cwSelectDropdown) cwSelectDropdown.classList.remove("show");
      if(cwSelectArrow) cwSelectArrow.classList.remove("open");
      cwAnimateRender();
    });
  });

  const cwTypeOpBtn = document.getElementById("cwTypeOpBtn");
  const cwTypeFavorBtn = document.getElementById("cwTypeFavorBtn");

  if(cwTypeOpBtn){
    cwTypeOpBtn.addEventListener("click", () => {
      cwTypeOpBtn.className = "cw-type-btn cw-active-op";
      cwTypeFavorBtn.className = "cw-type-btn";
      cwCurrentType = "op";
      cwAnimateRender();
    });
  }

  if(cwTypeFavorBtn){
    cwTypeFavorBtn.addEventListener("click", () => {
      cwTypeFavorBtn.className = "cw-type-btn cw-active-favor";
      cwTypeOpBtn.className = "cw-type-btn";
      cwCurrentType = "favor";
      cwAnimateRender();
    });
  }

  if(cwPieCanvas){
    cwPieCanvas.addEventListener("mousemove", (ev) => {
      cwHoverIndex = cwGetHovered(ev.clientX, ev.clientY);
      if(!cwRafRunning) cwStartHoverLoop();
    });

    cwPieCanvas.addEventListener("mouseleave", () => {
      cwHoverIndex = -1;
    });

    cwPieCanvas.addEventListener("touchstart", (ev) => {
      const t = ev.touches[0];
      cwHoverIndex = cwGetHovered(t.clientX, t.clientY);
      if(!cwRafRunning) cwStartHoverLoop();
      setTimeout(() => { cwHoverIndex = -1; }, 1200);
    }, { passive: true });
  }
}
    

/* 모달 열릴 때 차트 초기화 */
document.getElementById("openClassWinBtn").addEventListener("click", (e) => {
  const classWinUnlocked = completedState.op || completedState.favor;
  if(!classWinUnlocked){
    showMiniPopup(
      e.currentTarget,
      "클래스별 우승 분석",
      `열람 조건 : <span class="cond">도장 1개 이상 획득 필요</span>`
    );
    return;
  }
  classWinModal.classList.add("show");
  document.body.classList.add("class-win-modal-open");
  cwCurrentClass = "워로드";
  cwCurrentGroup = "전사";
  cwCurrentType = "op";

  const opBtn = document.getElementById("cwTypeOpBtn");
  const favorBtn = document.getElementById("cwTypeFavorBtn");
  if(opBtn) opBtn.className = "cw-type-btn cw-active-op";
  if(favorBtn) favorBtn.className = "cw-type-btn";

  document.querySelectorAll(".cw-select-option")
    .forEach(o => o.classList.remove("cw-active"));
  const firstOpt = document.querySelector('.cw-select-option[data-class="워로드"]');
  if(firstOpt) firstOpt.classList.add("cw-active");

  const label = document.getElementById("cwSelectLabel");
  if(label) label.textContent = "워로드";

  cwInitEvents();
  cwAnimateRender();
});
/* ===== 클래스별 우승 분석 차트 끝 ===== */

    
    acUpdate();
    init();
 
