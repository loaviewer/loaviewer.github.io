import { supabase, SUPABASE_URL, SUPABASE_KEY } from "./supabase.js";


const SUPPORT_ENGRAVINGS = ["절실한 구원", "만개", "축복의 오라", "해방자"];

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

const HISTORY_COLORS = ["#7effae", "#59c7ff", "#ffb86b", "#d48fff", "#ffd85c"];
const HISTORY_MAX_SELECT = 4;
const HISTORY_UNIT_LIMITS = { 1: 30, 2: 60, 3: 90 };

const $ = (id) => document.getElementById(id);
function getShortName(full) { return fullToShortMap[full] || full; }

let historyCandidates = [];
let historyCandidatesMode = "";
const historySelectedSet = new Set();
let historySelectedOrder = [];
let historyCurrentUnit = 1;
let engravingListCollapsed = false;

const historyModeSelect = $("historyModeSelect");
const historyStartDate = $("historyStartDate");
const historyEndDate = $("historyEndDate");
const historyEngravingList = $("historyEngravingList");
const historyEngravingSection = $("historyEngravingSection");
const historySelectedTags = $("historySelectedTags");
const historyApplyBtn = $("historyApplyBtn");
const historyNoticeText = $("historyNoticeText");
const historyChartSvg = $("historyChartSvg");
const historyChartWrap = $("historyChartWrap");
const historyTooltip = $("historyTooltip");
const historyLegendBox = $("historyLegendBox");
const historySummaryBody = $("historySummaryBody");

function initHistoryDates() {
  const fmt = (d) => {
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

  historyStartDate.value = fmt(start);
  historyEndDate.value = fmt(yesterday);
  historyStartDate.max = fmt(yesterday);
  historyEndDate.max = fmt(yesterday);
}

function historyGetColor(name) {
  const idx = historySelectedOrder.indexOf(name);
  if (idx === -1) return "#8d6cff";
  return HISTORY_COLORS[idx % HISTORY_COLORS.length];
}

function historyUpdateSelectedTags() {
  const selected = [...historySelectedOrder];
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
        return c.engraving_name.includes(keyword) || c.class_name.includes(keyword) || short.includes(keyword);
      })
    : historyCandidates;

  if (!filtered.length) {
    historyEngravingList.innerHTML = '<div class="history-empty-state">검색 결과 없음</div>';
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
      </label>`;
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
      alert(`최대 ${HISTORY_MAX_SELECT}개까지 선택할 수 있어요.`);
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
  const mode = historyModeSelect ? historyModeSelect.value : "op";
  if (historyCandidates.length && historyCandidatesMode === mode) {
    historyRenderEngravingList("");
    return;
  }
  historyEngravingList.innerHTML = '<div class="history-empty-state">로딩 중...</div>';
  try {
    let url = `${SUPABASE_URL}/rest/v1/candidates?select=class_name,engraving_name,enabled&order=class_name.asc,engraving_name.asc`;
    if (mode === "op") url = `${SUPABASE_URL}/rest/v1/candidates?enabled=eq.true&select=class_name,engraving_name,enabled&order=class_name.asc,engraving_name.asc`;
    const res = await fetch(url, { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } });
    if (!res.ok) throw new Error(`candidates fetch failed: ${res.status}`);
    historyCandidates = await res.json();
    historyCandidatesMode = mode;
    historyRenderEngravingList("");
  } catch (err) {
    console.error("loadHistoryCandidates error:", err);
    historyEngravingList.innerHTML = '<div class="history-empty-state">각인 목록 로드 실패</div>';
  }
}

function resetHistoryChart() {
  historyChartSvg.innerHTML = `
    <rect width="1000" height="380" fill="#0f1520"></rect>
    <text x="500" y="190" text-anchor="middle" fill="#7a8a9f" font-size="15" font-weight="700">
      각인을 선택하고 조회 버튼을 눌러주세요.
    </text>`;
  historyLegendBox.innerHTML = "";
  historySummaryBody.innerHTML = '<tr><td colspan="6" style="color:#7a8a9f;">조회 결과가 여기에 표시됩니다.</td></tr>';
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

function historyHideTooltip() { historyTooltip.style.display = "none"; }

function historyRenderLegend(datasets) {
  historyLegendBox.innerHTML = datasets.map(ds => `
    <div class="history-legend-item">
      <span class="history-legend-dot" style="background:${ds.color}"></span>
      ${ds.shortName}
    </div>`).join("");
}

function historyRenderSummaryTable(datasets, allData) {
  if (!datasets.length) {
    historySummaryBody.innerHTML = '<tr><td colspan="6" style="color:#7a8a9f;">선택된 각인이 없습니다.</td></tr>';
    return;
  }
  const stats = {};
  allData.forEach(r => {
    if (!stats[r.engraving_name]) stats[r.engraving_name] = { wins: 0, total: 0 };
    stats[r.engraving_name].wins += parseInt(r.win_count) || 0;
    stats[r.engraving_name].total += parseInt(r.total_matches) || 0;
  });
  const rankList = Object.entries(stats).filter(([_, s]) => s.total > 0)
    .map(([name, s]) => ({ engraving_name: name, win_rate: (s.wins / s.total) * 100 }))
    .sort((a, b) => b.win_rate - a.win_rate);
  const rankMap = {};
  rankList.forEach((item, idx) => { rankMap[item.engraving_name] = idx + 1; });

  historySummaryBody.innerHTML = datasets.map(ds => {
    const valid = ds.values.filter(v => v !== null);
    if (!valid.length) return `<tr><td><span class="color-chip" style="background:${ds.color}"></span>${ds.shortName}</td><td>${ds.class_name}</td><td colspan="4" style="color:#7a8a9f;">데이터 없음</td></tr>`;
    return `<tr>
      <td><span class="color-chip" style="background:${ds.color}"></span>${ds.shortName}</td>
      <td>${ds.class_name}</td>
      <td>${valid[0].toFixed(1)}%</td>
      <td>${valid[valid.length - 1].toFixed(1)}%</td>
      <td>${rankMap[ds.name] || "-"}위</td>
      <td>${ds.totalMatches.toLocaleString()}</td>
    </tr>`;
  }).join("");
}

function historyRenderSvgChart(datasets, labels, dates) {
  const W = 1000, H = 380;
  const pad = { top: 28, right: 30, bottom: 46, left: 60 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  let allValues = [];
  datasets.forEach(ds => { ds.values.forEach(v => { if (v !== null) allValues.push(v); }); });

  if (!allValues.length) {
    historyChartSvg.innerHTML = `<rect width="${W}" height="${H}" fill="#0f1520"/><text x="${W/2}" y="${H/2}" text-anchor="middle" fill="#7a8a9f" font-size="15" font-weight="700">선택한 기간에 데이터가 없습니다.</text>`;
    return;
  }

  const yMin = 0, yMax = 100;
  const yTicks = [0, 20, 40, 60, 80, 100];
  const xScale = (i) => labels.length === 1 ? pad.left + plotW / 2 : pad.left + (plotW * i / (labels.length - 1));
  const yScale = (v) => pad.top + ((yMax - v) / (yMax - yMin)) * plotH;

  let svg = `<rect width="${W}" height="${H}" fill="#0f1520"/>`;
  yTicks.forEach(val => {
    const y = yScale(val);
    svg += `<line x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>`;
    svg += `<text x="${pad.left - 10}" y="${y + 4}" text-anchor="end" fill="#94a3b8" font-size="11" font-weight="700">${val}%</text>`;
  });
  svg += `<line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${H - pad.bottom}" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>`;
  svg += `<line x1="${pad.left}" y1="${H - pad.bottom}" x2="${W - pad.right}" y2="${H - pad.bottom}" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>`;

  const maxLabels = 20;
  const labelStep = labels.length <= maxLabels ? 1 : Math.ceil(labels.length / maxLabels);
  labels.forEach((label, i) => {
    if (i % labelStep !== 0 && i !== labels.length - 1) return;
    svg += `<text x="${xScale(i)}" y="${H - 18}" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="700">${label}</text>`;
  });

  datasets.forEach(ds => {
    const points = [];
    ds.values.forEach((v, i) => { if (v !== null) points.push({ x: xScale(i), y: yScale(v), label: labels[i], value: v, date: dates[i] }); });
    if (points.length > 1) {
      const pathD = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
      svg += `<path d="${pathD}" fill="none" stroke="${ds.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    points.forEach(pt => {
      const safeName = ds.name.replace(/"/g, '&quot;');
      svg += `<circle cx="${pt.x}" cy="${pt.y}" r="5" fill="${ds.color}" stroke="#0f1520" stroke-width="2.5" data-name="${safeName}" data-label="${pt.label}" data-value="${pt.value}" data-date="${pt.date}" style="cursor:pointer"/>`;
    });
  });

  historyChartSvg.innerHTML = svg;

  historyChartSvg.querySelectorAll("circle[data-name]").forEach(circle => {
    circle.addEventListener("mousemove", (e) => {
      historyShowTooltip(e, `<strong>${circle.getAttribute("data-name")}</strong><br>${circle.getAttribute("data-label")} (${circle.getAttribute("data-date")})<br>승률 ${circle.getAttribute("data-value")}%`);
    });
    circle.addEventListener("mouseleave", () => { historyHideTooltip(); circle.setAttribute("r", "5"); });
    circle.addEventListener("mouseenter", () => { circle.setAttribute("r", "7"); });
  });
}



function toggleEngravingSection() {
  engravingListCollapsed = !engravingListCollapsed;
  if (historyEngravingSection) {
    historyEngravingSection.classList.toggle("collapsed", engravingListCollapsed);
  }
  updateToggleBtnText();
}

function updateToggleBtnText() {
  const toggleBtn = $("historyToggleBtn");
  if (!toggleBtn) return;
  toggleBtn.textContent = engravingListCollapsed ? "📋 직각 목록 펼치기" : "📋 직각 목록 접기";
}


async function historyFetchAndRender() {
  const selected = [...historySelectedOrder];
  const startStr = historyStartDate.value;
  const endStr = historyEndDate.value;
  const mode = historyModeSelect.value;

  if (!startStr || !endStr) return alert("시작일과 종료일을 입력해줘.");
  if (startStr > endStr) return alert("시작일이 종료일보다 늦을 수 없어.");
  if (!selected.length) return alert("최소 1개 각인을 선택해줘.");

  const dayDiff = Math.ceil((new Date(endStr) - new Date(startStr)) / (1000 * 60 * 60 * 24)) + 1;
  const maxDays = HISTORY_UNIT_LIMITS[historyCurrentUnit] || 30;
  if (dayDiff > maxDays) {
    alert(`${historyCurrentUnit}일 단위는 최대 ${maxDays}일까지 조회할 수 있어요.\n현재 선택: ${dayDiff}일`);
    return;
  }

  historyApplyBtn.disabled = true;
  historyApplyBtn.textContent = "조회 중...";

  // 직각 목록 접기
  if (!engravingListCollapsed) toggleEngravingSection();

  const loadingDiv = document.createElement("div");
  loadingDiv.className = "history-loading-overlay";
  loadingDiv.textContent = "데이터 불러오는 중...";
  historyChartWrap.appendChild(loadingDiv);

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_daily_winrate_history`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` },
      body: JSON.stringify({ p_type: mode, p_start: startStr, p_end: endStr })
    });
    if (!res.ok) throw new Error(`RPC 실패: ${res.status}`);

    const data = await res.json();
    const filteredData = data.filter(row => selected.includes(row.engraving_name));
    const allDates = [...new Set(data.map(r => r.date_key))].sort();

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
        let wins = 0, total = 0;
        group.forEach(d => { const match = rows.find(r => r.date_key === d); if (match) { wins += parseInt(match.win_count) || 0; total += parseInt(match.total_matches) || 0; } });
        if (total === 0) return null;
        return Math.round((wins / total) * 1000) / 10;
      });
      return { name, shortName: getShortName(name), class_name: found ? found.class_name : "", color: HISTORY_COLORS[idx % HISTORY_COLORS.length], values, totalMatches: rows.reduce((sum, r) => sum + (parseInt(r.total_matches) || 0), 0) };
    });

    const labels = dates.map(d => { const parts = d.split("-"); return `${parseInt(parts[1])}/${parseInt(parts[2])}`; });
    historyRenderSvgChart(datasets, labels, dates);
    historyRenderLegend(datasets);
    historyRenderSummaryTable(datasets, data);
    historyNoticeText.textContent = `${mode === "op" ? "OP" : "호감"} · ${startStr} ~ ${endStr} · ${selected.length}개 각인 조회 완료`;
  } catch (err) {
    alert("조회 실패: " + err.message);
    console.error(err);
  } finally {
    historyApplyBtn.disabled = false;
    historyApplyBtn.textContent = "📊 승률 그래프 조회하기";
    const overlay = historyChartWrap.querySelector(".history-loading-overlay");
    if (overlay) overlay.remove();
  }
}

/* 이벤트 */
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
  if (e.target.closest("#historyResetBtn")) {
    historySelectedSet.clear();
    historySelectedOrder = [];
    historyUpdateSelectedTags();
    historyRenderEngravingList("");
    resetHistoryChart();
    return;
  }

  if (e.target.closest("#historyApplyBtn")) {
    historyFetchAndRender();
    return;
  }

  const unitBtn = e.target.closest(".history-unit-btn");
  if (unitBtn) {
    const tabs = $("historyUnitTabs");
    if (!tabs || !tabs.contains(unitBtn)) return;
    tabs.querySelectorAll(".history-unit-btn").forEach(b => b.classList.remove("active"));
    unitBtn.classList.add("active");
    historyCurrentUnit = parseInt(unitBtn.getAttribute("data-unit"), 10);
    return;
  }

  // 직각 목록 섹션 헤더 클릭 시 토글
  const sectionHead = e.target.closest(".history-engraving-section .history-section-head");
  if (sectionHead) {
    toggleEngravingSection();
  }

  if (e.target.closest("#historyToggleBtn")) {
    toggleEngravingSection();
    return;
  }


});

/* 초기화 */
async function init() {
  initHistoryDates();
  historyUpdateSelectedTags();
  resetHistoryChart();
  await loadHistoryCandidates();
}

init();