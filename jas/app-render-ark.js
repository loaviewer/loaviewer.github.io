// ===== 아크그리드 · 아크패시브 탭 렌더링 (app-render-ark.js) =====

let __agType = "order"; // "order" | "chaos"

// ===== 아크패시브 진화 - 재사용 대기시간 감소 노드 =====
// 끝없는 마나 / 무한한 마력 : 마나 사용 스킬 전용, 서로 합연산
// 최적화 훈련 / 타이밍 지배 / 선각자 : 전체 스킬(각성기·이동기·기상기 제외) 대상, 서로 곱연산
// * 선각자는 1레벨뿐이며 '통찰' 최대 중첩 시 값(조건부)이라 항상 적용된 것으로 가정
const ARK_CD_MANA_TABLE = {
  "끝없는 마나": [7.0, 14.0],
  "무한한 마력": [7.0, 14.0],
};
const ARK_CD_ALL_TABLE = {
  "최적화 훈련": [4.0, 8.0],
  "타이밍 지배": [5.0, 10.0],
  "선각자": [5.0],
};

function calcArkCdPct(ap) {
  const out = { mana: 0, all: 1 };
  const effects = (ap && ap.Effects) || [];
  for (const e of effects) {
    if (e.Name !== "진화") continue;
    const text = strip(e.Description || "").replace(/&nbsp;/g, " ");
    const lvM = text.match(/Lv\.?\s*(\d+)/);
    const lv = lvM ? parseInt(lvM[1], 10) : 1;

    for (const nm of Object.keys(ARK_CD_MANA_TABLE)) {
      if (text.indexOf(nm) === -1) continue;
      const arr = ARK_CD_MANA_TABLE[nm];
      out.mana += arr[Math.min(lv, arr.length) - 1] || 0;
    }
    for (const nm of Object.keys(ARK_CD_ALL_TABLE)) {
      if (text.indexOf(nm) === -1) continue;
      const arr = ARK_CD_ALL_TABLE[nm];
      const pct = arr[Math.min(lv, arr.length) - 1] || 0;
      out.all *= (1 - pct / 100);
    }
  }
  window.__arkCdPct = out;
  return out;
}

function agGradeClass(gr) {
  if (gr === "고대") return "g-ancient";
  if (gr === "유물") return "g-relic";
  if (gr === "전설") return "g-legend";
  if (gr === "영웅") return "g-epic";
  return "";
}

function agParseTooltip(raw) {
  const tip = parseTip(raw);
  const result = { title: "", gradeText: "", tradeBan: "", breakBan: "", parts: [] };
  if (!tip) return result;
  for (const k of Object.keys(tip)) {
    const v = tip[k];
    if (!v || !v.type) continue;
    if (v.type === "NameTagBox") result.title = v.value || "";
    else if (v.type === "ItemTitle" && v.value) result.gradeText = v.value.leftStr0 || "";
    else if (v.type === "MultiTextBox" && v.value && /거래\s*불가/.test(strip(v.value))) result.tradeBan = "거래 불가";
    else if (v.type === "SingleTextBox" && v.value && /분해\s*불가/.test(strip(v.value))) result.breakBan = "분해불가";
  }
  result.parts = tipParts(tip);
  return result;
}

function agParseStatLines(bodyHtml) {
  const t = strip(bodyHtml);
  const out = [];
  const re = /\[([^\]]+)\]\s*Lv\.?\s*(\d+)[^%[]*?([+\-]?\d+(?:\.\d+)?%)/g;
  let m;
  while ((m = re.exec(t))) out.push({ name: m[1], lv: m[2], pct: m[3] });
  return out;
}

const AG_STAT_ABBR = {
  "보스 피해": "보피", "추가 피해": "추피", "공격력": "공격",
  "낙인력": "낙인", "아군 공격 강화": "아공", "아군 피해 강화": "아피",
};
function agAbbr(name) { return AG_STAT_ABBR[name] || name; }

function agCoreOptionRows(bodyHtml) {
  if (!bodyHtml) return [];
  return String(bodyHtml).split(/<br\s*\/?>/i).map(s => s.trim()).filter(Boolean);
}

function agStripP(html) {
  return String(html || "").replace(/^<P[^>]*>/i, "").replace(/<\/P>\s*$/i, "");
}

function agCondRows(html) {
  if (!html) return [];
  return String(html).split(/<br\s*\/?>/i).map(s => s.replace(/<img[^>]*>/gi, "").trim()).filter(Boolean);
}

function agOptionActive(rowHtml, point) {
  const m = strip(rowHtml).match(/^\[(\d+)P\]/);
  if (!m) return true;
  return Number(m[1]) <= (point || 0);
}

// 🎯 [핵심 수정] 툴팁 생성 함수: 제목에 (XXP) 추가 & 비활성 옵션 회색 처리
function buildCoreTipHtml(slot) {
  if (!slot) return "";
  const info = agParseTooltip(slot.Tooltip);
  const tip = parseTip(slot.Tooltip);
  
  // 1. 제목 옆에 현재 포인트(P) 붙여주기
  let titleText = agStripP(info.title) || slot.Name || "-";
  if (slot.Point != null) {
    titleText += ` <span style="color:#ffd200;">(${slot.Point}P)</span>`;
  }

  const g = gradeStyle(slot.Grade || "");
  const gradeC = g.c || "#cfd7e8";

  const extraLines = [];
  if (tip) {
    for (const k of Object.keys(tip).sort()) {
      const v = tip[k];
      if (!v?.type) continue;
      if (v.type === "SingleTextBox" && v.value) {
        const s = strip(v.value);
        if (!s) continue;
        if (/거래\s*불가|분해\s*불가|판매\s*불가/.test(s) && s.length < 40) continue;
        if (/획득|레이드|카제로스|에픽|하르키|일리아칸|상아탑|클라우|쿠르잔|가디언|어비스|더\s*존재/.test(s)) continue;
        extraLines.push(v.value);
      }
    }
  }

  let partsHtml = "";
  for (const part of (info.parts || [])) {
    const isCond = /발동\s*조건/.test(part.title || "");
    let bodyHtml = part.body || "";

    // 2. 코어 옵션에서 내 포인트보다 높은 옵션은 회색(비활성화) 처리
    if (/코어\s*옵션/.test(part.title) && !isCond) {
      const optRows = agCoreOptionRows(bodyHtml);
      const formattedRows = [];
      for (const rowStr of optRows) {
        if (agOptionActive(rowStr, slot.Point)) {
          formattedRows.push(`<div>${rowStr}</div>`); // 활성 옵션은 그대로
        } else {
          // 비활성 옵션은 FONT 태그의 색상(color=...)을 강제로 지우고 어두운 회색 적용
          const dimmedStr = rowStr.replace(/color\s*=\s*['"]?[^'"\s>]+['"]?/gi, "");
          formattedRows.push(`<div style="color:#666666;">${dimmedStr}</div>`);
        }
      }
      bodyHtml = formattedRows.join(""); // 깔끔하게 줄바꿈
    }

    partsHtml += `<div class="core-tip-sec${isCond ? " core-tip-cond" : ""}">
      <div class="core-tip-sec-t">${part.title || ""}</div>
      <div class="core-tip-sec-b">${bodyHtml}</div>
    </div>`;
  }

  const icon = slot.Icon
    ? `<div class="apt-tip-icon core-tip-icon" style="background:${g.bg || "rgba(255,255,255,.06)"};border-color:${gradeC}55"><img class="apt-tip-ic" src="${slot.Icon}" alt=""></div>`
    : "";

  return `
    <div class="tip-hd core-tip-title" style="color:${gradeC}">${titleText}</div>
    <div class="tip-bd apt-tip-body core-tip-body">
      <div class="apt-tip-top core-tip-hd">
        ${icon}
        <div class="apt-tip-meta core-tip-meta">
          <div class="core-tip-grade">${info.gradeText || ""}</div>
          ${info.tradeBan ? `<div class="core-tip-ban-text">${info.tradeBan}</div>` : ""}
        </div>
      </div>
      ${extraLines.map(l => `<div class="core-tip-line">${l}</div>`).join("")}
      ${partsHtml}
      ${info.breakBan ? `<div class="core-tip-break">${info.breakBan}</div>` : ""}
    </div>`;
}

function agCoreIcon(slotKey) {
  const T = {
    해: { c1: "#ffd66b", c2: "#e07a00", glyph: `<circle cx="14" cy="14" r="6" fill="#fff"/><g stroke="#fff" stroke-width="2" stroke-linecap="round"><line x1="14" y1="2" x2="14" y2="6"/><line x1="14" y1="22" x2="14" y2="26"/><line x1="2" y1="14" x2="6" y2="14"/><line x1="22" y1="14" x2="26" y2="14"/><line x1="5" y1="5" x2="8" y2="8"/><line x1="20" y1="20" x2="23" y2="23"/><line x1="23" y1="5" x2="20" y2="8"/><line x1="8" y1="20" x2="5" y2="23"/></g>` },
    달: { c1: "#b98cff", c2: "#4a3aff", glyph: `<path d="M18 6a9 9 0 1 0 4 16 7 7 0 0 1-4-16Z" fill="#fff"/>` },
    별: { c1: "#ff9ad6", c2: "#ff3d7f", glyph: `<path d="M14 3l3.09 6.86L24 11l-5 5.14L20.18 24 14 20.27 7.82 24 9 16.14 4 11l6.91-1.14L14 3Z" fill="#fff"/>` },
  };
  const t = T[slotKey] || T["해"];
  const gid = "agGrad_" + slotKey + "_" + Math.random().toString(36).slice(2, 7);
  return `<svg class="ag-core-icon" width="26" height="26" viewBox="0 0 28 28"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t.c1}"/><stop offset="1" stop-color="${t.c2}"/></linearGradient></defs><rect width="28" height="28" rx="8" fill="url(#${gid})"/>${t.glyph}</svg>`;
}

const AG_GRADE_FILL = { "고대": "#cfad7e", "유물": "#ff7a3d", "전설": "#ffb24d", "영웅": "#b97dff" };
const AG_GRADE_BG = { "고대": "#8a7754", "유물": "#a34a26", "전설": "#a06d1f", "영웅": "#6a4590" };

function agGradeGradient(hex) {
  return `radial-gradient(circle at 32% 28%, ${hex} 0%, ${hex} 35%, #241722 100%)`;
}
function agGemGradient(grade) {
  const bg = AG_GRADE_BG[grade] || "#4a4a55";
  return `radial-gradient(circle at 32% 28%, ${bg} 0%, #241d28 90%)`;
}

const AG_DPS_STAT_COLOR = { "보스 피해": "#c58bff", "추가 피해": "#6fb3ff", "공격력": "#9be36a" };
const AG_SUPPORT_VALID = ["낙인력", "아군 공격 강화", "아군 피해 강화"];

function renderArkGridGemChip(gem, isSupport) {
  const info = agParseTooltip(gem.Tooltip);
  const titleText = strip(info.title);
  const typeLabel = (titleText.split(":")[1] || titleText || "").trim();
  const gc = agGradeClass(gem.Grade || "");

  let effectBody = "";
  for (const part of info.parts) {
    if (/젬\s*효과/.test(part.title)) effectBody = part.body;
  }
  const stats = agParseStatLines(effectBody);
  const statHtml = stats.map(s => {
    const color = isSupport
      ? (AG_SUPPORT_VALID.includes(s.name) ? "#ffb84d" : null)
      : (AG_DPS_STAT_COLOR[s.name] || null);
    const style = color ? ` style="color:${color}"` : "";
    return `<span><span${style}>${agAbbr(s.name)}</span> <b${style}>Lv${s.lv}</b></span>`;
  }).join("");

  const gemFill = AG_GRADE_FILL[gem.Grade] || "#3a3f4d";
  const chip = document.createElement("div");
  chip.className = "ag-gem-chip" + (gc ? " " + gc : "") + (gem.IsActive === false ? " off" : "");
  chip.innerHTML = `
    <div class="ag-gem-icon" style="background:${agGemGradient(gem.Grade)};box-shadow:0 0 0 1px ${gemFill}66;">
      ${gem.Icon ? `<img src="${gem.Icon}" alt="" loading="lazy">` : ""}
    </div>
    <div class="ag-gem-type" style="color:${gemFill}">${typeLabel || "-"}</div>
    <div class="ag-gem-stats">${statHtml}</div>
  `;

  const tipHtml = buildTipHtml(gem.Tooltip, info.title);
  if (tipHtml) bindTip(chip, tipHtml);
  return chip;
}

function renderArkGridCoreCard(slot) {
  const info = agParseTooltip(slot.Tooltip);
  const p = parseArkCoreName(slot.Name || "");
  const num = p.isOrder ? orderCoreNum(p.short, p.slot) : p.isChaos ? chaosCoreNum(p.short) : null;
  const gc = agGradeClass(slot.Grade || "");

  let optionBody = "", conditionBody = "";
  for (const part of info.parts) {
    if (/코어\s*옵션\s*발동\s*조건/.test(part.title)) conditionBody = part.body;
    else if (/코어\s*옵션/.test(part.title)) optionBody = part.body;
  }
  const optionRows = agCoreOptionRows(optionBody);
  const condRows = agCondRows(conditionBody);

  const card = document.createElement("div");
  card.className = "ag-core-card" + (gc ? " " + gc : "");

  const ribbon = num != null ? `<div class="ag-core-ribbon ${p.isChaos ? "chaos" : "order"}">${num}</div>` : "";
  const titleText = agStripP(info.title) || slot.Name || "-";
  const titleWithPoint = slot.Point != null ? `${titleText} <span class="ag-core-point-inline">(${slot.Point}p)</span>` : titleText;

  const coreFill = AG_GRADE_FILL[slot.Grade] || "#3a3f4d";
  const icon = slot.Icon
    ? `<span class="ag-core-icon-frame"><span class="ag-core-icon-bg" style="background:${agGradeGradient(coreFill)}"><img class="ag-core-icon" src="${slot.Icon}" alt=""></span></span>`
    : "";

  card.innerHTML = `
    ${ribbon}
    <div class="ag-core-hd">
      ${icon}
      <div class="ag-core-title">${titleWithPoint}</div>
    </div>
    <div class="ag-core-meta">${info.gradeText || ""}</div>
    <div class="ag-core-tag warn">${info.tradeBan || ""}</div>
    <div class="ag-core-opts">${optionRows.map(r => `<div class="ag-core-opt-row${agOptionActive(r, slot.Point) ? "" : " inactive"}">${r}</div>`).join("")}</div>
    <div class="ag-core-cond">${condRows.length ? condRows.map(r => `<div>${r}</div>`).join("") : `<div>발동 조건 없음</div>`}</div>
    <div class="ag-core-tag muted">${info.breakBan || ""}</div>
  `;

  const tipHtml = buildCoreTipHtml(slot);
  if (tipHtml) bindTip(card, tipHtml);
  return card;
}

function renderArkGrid(ag) {
  const core = $("arkgCore"), slotsEl = $("arkgSlots"), statsEl = $("arkgStats");
  if (!core || !slotsEl || !statsEl) return;
  slotsEl.innerHTML = ""; statsEl.innerHTML = "";
  if (!ag) { core.textContent = "정보 없음"; return; }
  const slots = ag.Slots || [];
  const orderNums = { 해: null, 달: null, 별: null };
  const chaosNums = { 해: null, 달: null, 별: null };
  for (const s of slots) {
    const p = parseArkCoreName(s.Name || "");
    if (p.isOrder && p.slot) orderNums[p.slot] = orderCoreNum(p.short, p.slot);
    if (p.isChaos && p.slot) chaosNums[p.slot] = chaosCoreNum(p.short);
  }
  const oStr = ["해", "달", "별"].map(k => orderNums[k] != null ? orderNums[k] : "-").join(" ");
  const cStr = ["해", "달", "별"].map(k => chaosNums[k] != null ? chaosNums[k] : "-").join(" ");
  core.innerHTML = `<span class="arkg-core-l">코어</span><span class="arkg-core-r">질서 <strong>${oStr}</strong> · 혼돈 <strong>${cStr}</strong></span>`;
  const sorted = [...slots].sort((a, b) => {
    const pa = parseArkCoreName(a.Name || ""), pb = parseArkCoreName(b.Name || "");
    const ta = pa.isOrder ? 0 : pa.isChaos ? 1 : 2;
    const tb = pb.isOrder ? 0 : pb.isChaos ? 1 : 2;
    if (ta !== tb) return ta - tb;
    const ord = { 해: 0, 달: 1, 별: 2 };
    return (ord[pa.slot] ?? 9) - (ord[pb.slot] ?? 9);
  });
  for (const s of sorted) {
    const row = document.createElement("div");
    const gr = s.Grade || "";
    let gc = "";
    if (gr === "고대") gc = " g-ancient";
    else if (gr === "유물") gc = " g-relic";
    else if (gr === "전설") gc = " g-legend";
    else if (gr === "영웅") gc = " g-epic";
    row.className = "arkg-item" + gc;
    if (s.Icon) {
      const img = document.createElement("img");
      img.src = s.Icon; img.alt = ""; img.loading = "lazy";
      const gs = gradeStyle(gr);
      img.style.background = gs.bg;
      img.style.borderRadius = "5px";
      img.style.border = "1px solid " + gs.c + "44";
      row.appendChild(img);
    }
    const p = parseArkCoreName(s.Name || "");
    const kind = p.isOrder ? "질서" : p.isChaos ? "혼돈" : "";
    const label = kind ? `${kind}: ${p.short}` : (s.Name || "-");
    const nm = document.createElement("span"); nm.className = "nm"; nm.textContent = label;
    const pt = document.createElement("span"); pt.className = "pt"; pt.textContent = s.Point != null ? "(" + s.Point + "P)" : "";
    row.append(nm, pt);
    
    // 🎯 미니 툴팁 바인딩
    const tipHtml = buildCoreTipHtml(s);
    if (tipHtml) bindTip(row, tipHtml);
    slotsEl.appendChild(row);
  }
  const cls = (window.__charClass || "");
  const SUPPORT = ["바드", "홀리나이트", "도화가", "기상술사"];
  const isSupport = SUPPORT.some(s => cls.includes(s));
  const effectRows = [];
  for (const e of (ag.Effects || [])) {
    const tip = strip(e.Tooltip || "");
    const pctM = tip.match(/([+＋]?[0-9.]+%)/);
    const pct = pctM ? pctM[1] : "";
    const lv = e.Level != null ? "Lv." + e.Level : "";
    const name = e.Name || "-";
    let on = false;
    if (isSupport) {
      if (/아군.*피해/.test(name)) on = true;
      if (/아군.*공격/.test(name)) on = true;
      if (/낙인/.test(name)) on = true;
    } else {
      on = /보스/.test(name) || /추가 피해/.test(name) || name === "공격력";
    }
    effectRows.push({ on, name, lv, pct, tip });
  }
  effectRows.sort((a, b) => (b.on ? 1 : 0) - (a.on ? 1 : 0));
  for (const er of effectRows) {
    const row = document.createElement("div");
    row.className = "row " + (er.on ? "eff-on" : "eff-off");
    row.innerHTML = `<span class="l">${er.name}${er.lv ? ` <span class="lv">${er.lv}</span>` : ""}</span><span class="v">${er.pct || "-"}</span>`;
    if (er.tip) bindTip(row, `<div class="tip-hd">${er.name}</div><div class="tip-bd">${er.tip}</div>`);
    statsEl.appendChild(row);
  }
}

function renderArkGridTab(ag, fullData) {
  const summaryEl = $("agSummary"), coresEl = $("agCores"), toggleEl = $("agTypeToggle"), badgesEl = $("agBadges");
  if (!summaryEl || !coresEl) return;
  summaryEl.innerHTML = ""; coresEl.innerHTML = ""; if (badgesEl) badgesEl.innerHTML = "";
  if (!ag) { coresEl.textContent = "정보 없음"; return; }

  const p = fullData?.ArmoryProfile || {};
  const classLine = [p.CharacterClassName, fullData?.ArkPassive?.Title].filter(Boolean).join(" · ");

  const slots = ag.Slots || [];
  const orderSlots = [], chaosSlots = [];
  const orderNums = { 해: null, 달: null, 별: null };
  const chaosNums = { 해: null, 달: null, 별: null };
  for (const s of slots) {
    const p2 = parseArkCoreName(s.Name || "");
    if (p2.isOrder) { orderSlots.push(s); if (p2.slot) orderNums[p2.slot] = orderCoreNum(p2.short, p2.slot); }
    else if (p2.isChaos) { chaosSlots.push(s); if (p2.slot) chaosNums[p2.slot] = chaosCoreNum(p2.short); }
  }
  const slotOrder = { 해: 0, 달: 1, 별: 2 };
  const sortBySlot = arr => [...arr].sort((a, b) => {
    const pa = parseArkCoreName(a.Name || ""), pb = parseArkCoreName(b.Name || "");
    return (slotOrder[pa.slot] ?? 9) - (slotOrder[pb.slot] ?? 9);
  });
  const orderSorted = sortBySlot(orderSlots);
  const chaosSorted = sortBySlot(chaosSlots);

  const oStr = ["해", "달", "별"].map(k => orderNums[k] != null ? orderNums[k] : "-").join(" ");
  const cStr = ["해", "달", "별"].map(k => chaosNums[k] != null ? chaosNums[k] : "-").join(" ");

  const cls = window.__charClass || p.CharacterClassName || "";
  const SUPPORT = ["바드", "홀리나이트", "도화가", "기상술사"];
  const isSupport = SUPPORT.some(s => cls.includes(s));
  const onEffects = [];
  for (const e of (ag.Effects || [])) {
    const name = e.Name || "-";
    let on = false;
    if (isSupport) {
      if (/아군.*피해/.test(name)) on = true;
      if (/아군.*공격/.test(name)) on = true;
      if (/낙인/.test(name)) on = true;
    } else {
      on = /보스/.test(name) || /추가 피해/.test(name) || name === "공격력";
    }
    if (!on) continue;
    const tip = strip(e.Tooltip || "");
    const pctM = tip.match(/([+＋]?[0-9.]+%)/);
    onEffects.push({ name, level: e.Level, pct: pctM ? pctM[1] : "" });
  }

  summaryEl.innerHTML = `
    <div class="ag-hero">
      <div class="ag-hero-left">
        <div class="ag-hero-eyebrow">ARK GRID</div>
        <div class="ag-hero-class">${classLine || "-"}</div>
      </div>
      <div class="ag-hero-points">
        <div class="ag-hero-pt order"><span class="k">질서</span><b>${oStr}</b></div>
        <div class="ag-hero-pt chaos"><span class="k">혼돈</span><b>${cStr}</b></div>
      </div>
    </div>
  `;

  if (badgesEl) {
    badgesEl.innerHTML = onEffects.map(e => `<div class="ag-badge"><span class="l">${e.name}${e.level != null ? ` <b>Lv${e.level}</b>` : ""}</span><span class="v">${e.pct}</span></div>`).join("");
  }

  function draw() {
    coresEl.innerHTML = "";
    const list = __agType === "order" ? orderSorted : chaosSorted;
    if (!list.length) { coresEl.innerHTML = `<div class="ag-empty">장착된 코어가 없습니다</div>`; return; }

    const coreRow = document.createElement("div");
    coreRow.className = "ag-core-row";
    const gemSection = document.createElement("div");
    gemSection.className = "ag-gem-section";

    for (const slot of list) {
      coreRow.appendChild(renderArkGridCoreCard(slot));
      const gemsWrap = document.createElement("div");
      gemsWrap.className = "ag-gem-row";
      for (const gem of (slot.Gems || [])) gemsWrap.appendChild(renderArkGridGemChip(gem, isSupport));
      gemSection.appendChild(gemsWrap);
    }
    coresEl.appendChild(coreRow);
    coresEl.appendChild(gemSection);
  }

  if (toggleEl) toggleEl.__draw = draw;
  if (toggleEl && !toggleEl.__bound) {
    toggleEl.__bound = true;
    toggleEl.querySelectorAll(".ag-type-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        toggleEl.querySelectorAll(".ag-type-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        __agType = btn.dataset.type;
        toggleEl.__draw();
      });
    });
  }
  draw();
}

function renderAP(ap) {
  calcArkCdPct(ap);
  const targets = ["apGrid", "apGridDash"].map(id => $(id)).filter(Boolean);
  for (const grid of targets) {
    grid.innerHTML = "";
    if (!ap) {
      grid.innerHTML = `<div style="color:var(--muted);font-size:12px">정보 없음</div>`;
      continue;
    }
    const points = ap.Points || [];
    const effects = ap.Effects || [];
    const groups = { "진화": [], "깨달음": [], "도약": [] };
    for (const e of effects) {
      if (groups[e.Name]) groups[e.Name].push(e);
    }
    for (const key of ["진화", "깨달음", "도약"]) {
      const col = document.createElement("div");
      col.className = "ap-col";
      const pt = points.find(p => p.Name === key);
      col.innerHTML = `<h4>${key}${pt?.Description ? " · " + pt.Description : ""}</h4><div class="pts">${pt ? pt.Value + " 포인트" : ""}</div>`;
      for (const e of groups[key]) {
        const item = document.createElement("div");
        item.className = "ap-item";
        if (e.Icon) {
          const img = document.createElement("img");
          img.src = e.Icon; img.alt = ""; img.loading = "lazy";
          item.appendChild(img);
        }
        const span = document.createElement("span");
        span.innerHTML = e.Description || "";
        item.appendChild(span);
        const tipHtml = buildArkPassiveTipHtml(e, strip(e.Description) || e.Name);
        if (tipHtml) bindTip(item, tipHtml);
        col.appendChild(item);
      }
      grid.appendChild(col);
    }
  }
}

let __aptCat = "진화";
function renderArkPassiveTab(ap, fullData) {
  calcArkCdPct(ap);
  const heroEl = $("aptHero"), gridEl = $("aptGrid");
  if (!heroEl || !gridEl) return;
  heroEl.innerHTML = ""; gridEl.innerHTML = "";
  if (!ap) { gridEl.innerHTML = `<div class="apt-empty">아크패시브 정보가 없어요</div>`; return; }

  const points = ap.Points || [];
  const effects = ap.Effects || [];
  const CATS = [{ key: "진화", cls: "evo" }, { key: "깨달음", cls: "enl" }, { key: "도약", cls: "leap" }];

  const maxLvMap = {};
  for (const d of (typeof EVOLUTION_EFFECTS !== "undefined" ? EVOLUTION_EFFECTS : [])) {
    for (const a of (d.aliases || [d.name])) {
      maxLvMap[String(a).replace(/\s+/g, "")] = Math.max(maxLvMap[String(a).replace(/\s+/g, "")] || 0, d.maxLv || 0);
    }
  }
  const EVO_STAT_MAX = { "치명": 30, "특화": 30, "제압": 30, "신속": 30, "인내": 30, "숙련": 30 };
  const cls = $("pClass") ? $("pClass").textContent : "-";

  heroEl.innerHTML = `
    <div class="ag-hero apt-hero">
      <div class="ag-hero-left">
        <div class="ag-hero-eyebrow">ARK PASSIVE</div>
        <div class="ag-hero-class">${cls}</div>
      </div>
      <div class="ag-hero-points">
        ${CATS.map(c => {
          const pt = points.find(p => p.Name === c.key);
          return `<div class="ag-hero-pt ${c.cls}"><span class="k">${c.key}</span><b>${pt ? pt.Value : "-"}</b><small>${strip(pt ? pt.Description : "")}</small></div>`;
        }).join("")}
      </div>
    </div>`;

  const shell = document.createElement("div");
  shell.className = "apt-shell";
  const tabBar = document.createElement("div");
  tabBar.className = "apt-tabs";
  tabBar.innerHTML = CATS.map(c => {
    const pt = points.find(p => p.Name === c.key);
    return `<button type="button" class="apt-tab ${c.cls}${c.key === __aptCat ? " active" : ""}" data-cat="${c.key}">
      <span class="apt-tab-dot"></span>
      <span class="apt-tab-label">${c.key}</span>
      <span class="apt-tab-pt">${pt ? pt.Value : "-"}</span>
    </button>`;
  }).join("");
  shell.appendChild(tabBar);

  const body = document.createElement("div");
  body.className = "apt-body";
  shell.appendChild(body);
  gridEl.appendChild(shell);

  tabBar.querySelectorAll(".apt-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      __aptCat = btn.dataset.cat;
      renderArkPassiveTab(ap, fullData);
    });
  });

  const c = CATS.find(x => x.key === __aptCat) || CATS[0];
  const tiers = {};
  for (const e of effects) {
    if (e.Name !== c.key) continue;
    const text = strip(e.Description).replace(/&nbsp;/g, " ");
    const m = text.match(/(\d+)\s*티어\s*(.+?)\s*Lv\.?\s*(\d+)/i);
    if (!m) continue;
    const tier = parseInt(m[1], 10);
    const name = m[2].trim();
    const lv = parseInt(m[3], 10) || 0;
    const max = maxLvMap[name.replace(/\s+/g, "")] || EVO_STAT_MAX[name] || 0;
    (tiers[tier] = tiers[tier] || []).push({ e, name, lv, max });
  }

  const col = document.createElement("section");
  col.className = "apt-col " + c.cls;
  const tree = document.createElement("div");
  tree.className = "apt-tree";

  for (const t of [1, 2, 3, 4, 5]) {
    const row = document.createElement("div");
    row.className = "apt-row" + ((tiers[t] && tiers[t].length) ? "" : " empty");
    row.innerHTML = `<div class="apt-tier-badge"><span class="apt-tier-num">${t}</span></div><div class="apt-nodes"></div>`;
    const nodesEl = row.querySelector(".apt-nodes");
    for (const n of (tiers[t] || [])) {
      const node = document.createElement("div");
      node.className = "apt-node on";
      const lvText = n.max ? `Lv. ${n.lv}/${n.max}` : `Lv. ${n.lv}`;
      node.innerHTML = `
        <div class="apt-orb">${n.e.Icon ? `<img src="${n.e.Icon}" alt="" loading="lazy">` : ""}</div>
        <div class="apt-lv">${lvText}</div>
        <div class="apt-nm">${n.name}</div>`;
      const tipHtml = buildArkPassiveTipHtml(n.e, n.name);
      if (tipHtml) bindTip(node, tipHtml);
      nodesEl.appendChild(node);
    }
    tree.appendChild(row);
  }
  col.appendChild(tree);
  body.appendChild(col);
}