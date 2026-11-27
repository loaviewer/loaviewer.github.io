import { supabase } from "./supabase.js";


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

const CW_COLORS = ["#3b82f6","#a78bfa","#f7ca54","#34d399","#f87171","#4b5563"];
const CW_GLOW_A = [0.26,0.22,0.20,0.18,0.16,0.10];

const $ = (id) => document.getElementById(id);

function getShortName(n) {
  return fullToShortMap[n] || n;
}

/* ============================================================
   상태
   ============================================================ */
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

/* ============================================================
   헤더 / 범례
   ============================================================ */
function cwUpdateHeader() {
  const badge = $("cwClassBadge");
  const title = $("cwChartTitle");

  if (badge) badge.textContent = cwCurrentGroup;

  if (title) {
    const hl = cwCurrentType === "op"
      ? '<span class="cw-hl-op">OP</span>'
      : '<span class="cw-hl-favor">호감</span>';

    title.innerHTML = `${cwCurrentClass}가 선택한 ${hl} 각인은?`;
  }
}

function cwUpdateLegend(data) {
  const wrap = $("cwLegendWrap");
  if (!wrap) return;

  wrap.innerHTML = data.map((d, i) => `
    <div class="cw-legend-item">
      <span class="cw-legend-dot" style="background:${CW_COLORS[i]}"></span>
      ${d.name} ${d.pct}%
    </div>
  `).join("");
}

/* ============================================================
   데이터
   ============================================================ */
function cwCalcAngles(data) {
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

async function cwLoadData(cls, type) {
  const { data, error } = await supabase.rpc("get_class_winner_stats", {
    p_class: cls,
    p_type: type
  });

  if (error || !data || !data.length) return [];

  const rows = data.map(r => ({
    name: getShortName(r.winner_engraving),
    pct: Number(r.pick_rate)
  }));

  const total = rows.reduce((s, r) => s + r.pct, 0);
  if (total <= 0) return [];

  const top5 = rows.slice(0, 5);
  const etcPct = rows.slice(5).reduce((s, r) => s + r.pct, 0);

  const result = top5.map(r => ({
    name: r.name,
    pct: Number((r.pct / total * 100).toFixed(1))
  }));

  if (etcPct > 0) {
    result.push({
      name: "기타",
      pct: Number((etcPct / total * 100).toFixed(1))
    });
  }

  return result;
}

/* ============================================================
   Hover
   ============================================================ */
function cwGetHovered(mx, my) {
  const canvas = $("cwPieCanvas");
  if (!canvas) return -1;

  const rect = canvas.getBoundingClientRect();
  const sx = canvas.width / rect.width;
  const sy = canvas.height / rect.height;

  const x = (mx - rect.left) * sx;
  const y = (my - rect.top) * sy;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = canvas.width * 0.37;
  const inner = r - canvas.width * 0.14;

  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < inner || dist > r + 30) return -1;

  let ang = Math.atan2(dy, dx);
  if (ang < -Math.PI / 2) ang += Math.PI * 2;

  for (let i = 0; i < cwSliceAngles.length; i++) {
    if (ang >= cwSliceAngles[i].start && ang <= cwSliceAngles[i].end) return i;
  }

  return -1;
}

function cwStartHoverLoop() {
  cwRafRunning = true;

  function loop() {
    cwDrawDonut();

    let anyMoving = false;
    for (let i = 0; i < cwCurrentData.length; i++) {
      const target = cwHoverIndex === i ? 1 : 0;
      if (Math.abs((cwHoverScale[i] || 0) - target) > 0.005) anyMoving = true;
    }

    if (anyMoving || cwHoverIndex >= 0) {
      requestAnimationFrame(loop);
    } else {
      cwRafRunning = false;
    }
  }

  requestAnimationFrame(loop);
}

/* ============================================================
   도넛 그리기
   ============================================================ */
function cwDrawDonut() {
  if (!cwCurrentData.length) return;

  const canvas = $("cwPieCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const r = w * 0.37;
  const thickness = w * 0.14;
  const innerR = r - thickness;

  ctx.clearRect(0, 0, w, h);

  cwCurrentData.forEach((d, i) => {
    const sa = cwSliceAngles[i];
    if (!sa) return;

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
    ctx.beginPath();
    ctx.arc(cx + offX, cy + offY, lr, sa.start, sa.end);
    ctx.strokeStyle = CW_COLORS[i];
    ctx.lineWidth = lt + 44;
    ctx.globalAlpha = CW_GLOW_A[i] * (0.32 + pop * 0.22);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx + offX, cy + offY, lr, sa.start, sa.end);
    ctx.strokeStyle = CW_COLORS[i];
    ctx.lineWidth = lt + 22;
    ctx.globalAlpha = CW_GLOW_A[i] * (1 + pop * 0.6);
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx + offX, cy + offY, lr, sa.start, sa.end);
    ctx.strokeStyle = CW_COLORS[i];
    ctx.lineWidth = lt;
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx + offX, cy + offY, lr, sa.start, sa.end);
    const g = ctx.createLinearGradient(cx, cy - lr, cx, cy);
    g.addColorStop(0, "rgba(255,255,255," + (0.14 + pop * 0.10) + ")");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.strokeStyle = g;
    ctx.lineWidth = lt * 0.42;
    ctx.stroke();
    ctx.restore();

    const lx = cx + offX + lr * Math.cos(sa.mid);
    const ly = cy + offY + lr * Math.sin(sa.mid);
    const ns = d.pct >= 10 ? w * 0.026 : w * 0.020;
    const ps = d.pct >= 10 ? w * 0.036 : w * 0.026;
    const labelScale = 1 + pop * 0.12;

    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.7)";
    ctx.shadowBlur = 8;
    ctx.font = "bold " + (ns * labelScale) + "px sans-serif";
    ctx.fillText(d.name, lx, ly - w * 0.014);
    ctx.font = "bold " + (ps * labelScale) + "px sans-serif";
    ctx.fillText(d.pct + "%", lx, ly + w * 0.016);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(cx, cy, innerR - 6, 0, Math.PI * 2);
  ctx.fillStyle = "#13151c";
  ctx.fill();
  ctx.strokeStyle = "#252836";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#4b5563";
  ctx.font = "bold " + (w * 0.026) + "px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("TOP 5", cx, cy - w * 0.014);

  ctx.fillStyle = "#fff";
  ctx.font = "bold " + (w * 0.040) + "px sans-serif";
  ctx.fillText("우승 비율", cx, cy + w * 0.028);
}

/* ============================================================
   애니메이션 진입
   ============================================================ */
function cwAnimateEntry(data) {
  if (cwAnimId) cancelAnimationFrame(cwAnimId);

  cwCurrentData = data;
  cwSliceAngles = cwCalcAngles(data);
  cwHoverScale = data.map(() => 0);
  cwHoverIndex = -1;

  const canvas = $("cwPieCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const r = w * 0.37;
  const thickness = w * 0.14;
  const innerR = r - thickness;
  const dur = 850;
  const t0 = performance.now();

  function frame(now) {
    const p = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);

    ctx.clearRect(0, 0, w, h);

    let cum = 0;

    data.forEach((d, i) => {
      const pn = d.pct * ease;
      const s = (cum / 100) * Math.PI * 2 - Math.PI / 2;
      cum += pn;
      const e = (cum / 100) * Math.PI * 2 - Math.PI / 2;
      if (e <= s) return;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, s, e);
      ctx.strokeStyle = CW_COLORS[i];
      ctx.lineWidth = thickness + 44;
      ctx.globalAlpha = CW_GLOW_A[i] * 0.32;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, s, e);
      ctx.strokeStyle = CW_COLORS[i];
      ctx.lineWidth = thickness + 22;
      ctx.globalAlpha = CW_GLOW_A[i];
      ctx.stroke();
      ctx.restore();

      ctx.beginPath();
      ctx.arc(cx, cy, r, s, e);
      ctx.strokeStyle = CW_COLORS[i];
      ctx.lineWidth = thickness;
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, s, e);
      const g = ctx.createLinearGradient(cx, cy - r, cx, cy);
      g.addColorStop(0, "rgba(255,255,255,0.14)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = thickness * 0.42;
      ctx.stroke();
      ctx.restore();

      if (p >= 0.85) {
        const a = Math.min(1, (p - 0.85) / 0.15);
        const mid = (s + e) / 2;
        const lx = cx + r * Math.cos(mid);
        const ly = cy + r * Math.sin(mid);
        const ns = d.pct >= 10 ? w * 0.026 : w * 0.020;
        const ps = d.pct >= 10 ? w * 0.036 : w * 0.026;

        ctx.save();
        ctx.globalAlpha = a;
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "rgba(0,0,0,0.7)";
        ctx.shadowBlur = 8;
        ctx.font = "bold " + ns + "px sans-serif";
        ctx.fillText(d.name, lx, ly - w * 0.014);
        ctx.font = "bold " + ps + "px sans-serif";
        ctx.fillText(d.pct + "%", lx, ly + w * 0.016);
        ctx.restore();
      }
    });

    ctx.beginPath();
    ctx.arc(cx, cy, innerR - 6, 0, Math.PI * 2);
    ctx.fillStyle = "#13151c";
    ctx.fill();
    ctx.strokeStyle = "#252836";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#4b5563";
    ctx.font = "bold " + (w * 0.026) + "px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("TOP 5", cx, cy - w * 0.014);

    ctx.fillStyle = "#fff";
    ctx.font = "bold " + (w * 0.040) + "px sans-serif";
    ctx.fillText("우승 비율", cx, cy + w * 0.028);

    if (p < 1) cwAnimId = requestAnimationFrame(frame);
  }

  cwAnimId = requestAnimationFrame(frame);
}

async function cwAnimateRender() {
  const wrap = $("cwPieWrap");
  if (!wrap) return;

  wrap.classList.add("fading");
  cwUpdateHeader();

  const data = await cwLoadData(cwCurrentClass, cwCurrentType);

  cwAnimateEntry(data);
  cwUpdateLegend(data);

  wrap.classList.remove("fading");
}

/* ============================================================
   이벤트
   ============================================================ */
function cwInitEvents() {
  if (cwEventsBound) return;
  cwEventsBound = true;

  const cwSelectBtn = $("cwSelectBtn");
  const cwSelectArrow = $("cwSelectArrow");
  const cwSelectDropdown = $("cwSelectDropdown");
  const cwSelectWrap = $("cwSelectWrap");
  const cwPieCanvas = $("cwPieCanvas");

  if (cwSelectBtn) {
    cwSelectBtn.addEventListener("click", () => {
      cwSelectDropdown.classList.toggle("show");
      cwSelectArrow.classList.toggle("open");
    });
  }

  document.addEventListener("click", (e) => {
    if (cwSelectWrap && !cwSelectWrap.contains(e.target)) {
      if (cwSelectDropdown) cwSelectDropdown.classList.remove("show");
      if (cwSelectArrow) cwSelectArrow.classList.remove("open");
    }
  });

  document.querySelectorAll(".cw-select-option").forEach(opt => {
    opt.addEventListener("click", () => {
      document.querySelectorAll(".cw-select-option").forEach(o => o.classList.remove("cw-active"));
      opt.classList.add("cw-active");

      cwCurrentClass = opt.dataset.class;
      cwCurrentGroup = opt.dataset.group;

      const label = $("cwSelectLabel");
      if (label) label.textContent = cwCurrentClass;

      if (cwSelectDropdown) cwSelectDropdown.classList.remove("show");
      if (cwSelectArrow) cwSelectArrow.classList.remove("open");

      cwAnimateRender();
    });
  });

  const cwTypeOpBtn = $("cwTypeOpBtn");
  const cwTypeFavorBtn = $("cwTypeFavorBtn");

  if (cwTypeOpBtn) {
    cwTypeOpBtn.addEventListener("click", () => {
      cwTypeOpBtn.className = "cw-type-btn cw-active-op";
      cwTypeFavorBtn.className = "cw-type-btn";
      cwCurrentType = "op";
      cwAnimateRender();
    });
  }

  if (cwTypeFavorBtn) {
    cwTypeFavorBtn.addEventListener("click", () => {
      cwTypeFavorBtn.className = "cw-type-btn cw-active-favor";
      cwTypeOpBtn.className = "cw-type-btn";
      cwCurrentType = "favor";
      cwAnimateRender();
    });
  }

  if (cwPieCanvas) {
    cwPieCanvas.addEventListener("mousemove", (ev) => {
      cwHoverIndex = cwGetHovered(ev.clientX, ev.clientY);
      if (!cwRafRunning) cwStartHoverLoop();
    });

    cwPieCanvas.addEventListener("mouseleave", () => {
      cwHoverIndex = -1;
    });

    cwPieCanvas.addEventListener("touchstart", (ev) => {
      const t = ev.touches[0];
      cwHoverIndex = cwGetHovered(t.clientX, t.clientY);
      if (!cwRafRunning) cwStartHoverLoop();
      setTimeout(() => { cwHoverIndex = -1; }, 1200);
    }, { passive: true });
  }
}

/* ============================================================
   초기화
   ============================================================ */
function init() {
  cwInitEvents();
  cwAnimateRender();
}

init();