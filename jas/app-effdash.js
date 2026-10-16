// ===== 스펙 보드 · 스탯 · 노드 카드 (app-effdash.js) =====

function setEffPanelOpen(open) {
  const dash = $("effDash"), gear = $("gearBlock");
  if (dash) dash.style.display = open ? "" : "none";
  if (gear) {
    if (open) gear.classList.add("gear-hidden");
    else gear.classList.remove("gear-hidden");
  }
  window.__effOpen = !!open;
  document.querySelectorAll(".char-tab").forEach(b => {
    const t = b.dataset.tab;
    if (t === "info") b.classList.toggle("active", !open);
    else if (t === "stat") b.classList.toggle("active", !!open);
  });
}

function statHoverHtml(type, value, tooltip) {
  const v = value || 0;
  const lines = [];
  const plainLines = (Array.isArray(tooltip) ? tooltip : [])
    .map(t => String(t).replace(/<[^>]+>/g, "").trim())
    .filter(t => /%/.test(t) && !/물약|원정대|카드\s*도감/.test(t))
    .map(t => {
      const m = t.match(/^(.*?)([0-9.]+)\s*%\s*(증가|증폭|감소)/);
      if (!m) return t;
      const label = m[1].trim().replace(/[이가을를]\s*$/, "").trim();
      const value = m[3] === "감소" ? `${m[2]}% 감소` : `+${m[2]}%`;
      return `${label} <b>${value}</b>`;
    });
  if (type === "치명" || type === "신속" || type === "제압" || type === "인내") {
    for (const t of plainLines) lines.push(t.replace(/([0-9.]+)%/, "<b>$1%</b>"));
  } else if (type === "숙련") {
    for (const t of plainLines) lines.push(t.replace(/([0-9.]+)%/, "<b>$1%</b>"));
  } else if (type === "특화") {
    if (plainLines.length) {
      lines.push(`<span style="color:#c4b5fd">${window.__charClass || ""} 특화</span>`);
      for (const t of plainLines) lines.push(t.replace(/([0-9.]+)%/, "<b>$1%</b>"));
    } else {
      lines.push(`직업별 게이지·스킬 피해에 적용`);
      lines.push(`<span style="color:#7c88a5">이 직업 계수 미등록</span>`);
    }
  } else {
    lines.push(type + " " + v);
  }
  const body = lines.map(line => {
    const m = String(line).match(/^(.*?)\s*<b>(.*?)<\/b>\s*$/i);
    if (m) return `<div class="tip-row"><span class="k">${m[1].replace(/<[^>]+>/g, "")}</span><span class="v">${m[2]}</span></div>`;
    if (/style=/.test(line) || /직업별|계수|미등록|추후/.test(line))
      return `<div class="tip-note">${line}</div>`;
    return `<div class="tip-row"><span class="k">${line.replace(/<[^>]+>/g, "")}</span><span class="v"></span></div>`;
  }).join("");
  return `<div class="tip-hd">${type} · ${v.toLocaleString()}</div><div class="tip-bd">${body}</div>`;
}

function renderStats(stats, equipList, fullData) {
  const box = $("statsBox"), grid = $("statsGrid"), sumEl = $("statsSum");
  if (!box || !grid) return;
  grid.innerHTML = "";
  const combatTypes = ["치명", "특화", "제압", "신속", "인내", "숙련"];
  let sum = 0, shown = 0;
  const statMap = {};
  for (const s of stats || []) {
    if (!combatTypes.includes(s.Type)) continue;
    const v = parseInt(String(s.Value).replace(/,/g, ""), 10) || 0;
    statMap[s.Type] = v;
    sum += v; shown++;
    const row = document.createElement("div");
    row.className = "st";
    row.innerHTML = `<span>${s.Type}</span><strong>${s.Value}</strong>`;
    bindTip(row, statHoverHtml(s.Type, v, s.Tooltip));
    grid.appendChild(row);
  }
  if (shown) {
    box.style.display = "";
    sumEl.textContent = sum.toLocaleString();
  } else box.style.display = "none";
  fillEffDash(stats, equipList, fullData, statMap);
  setEffPanelOpen(false);
}




function updateNodeCards(fullData) {
  const ap = fullData?.ArkPassive || fullData?.ArmoryArkPassive || {};
  const effects = ap.Effects || [];
 
  let mungaLv = 0, eumLv = 0, ipsikLv = 0, manaLv = 0, inpaLv = 0; 


  function extractNodeLv(text, keyword, maxLv) {
    const re = new RegExp(keyword + "[^0-9]{0,20}Lv\\.?\\s*(\\d+)", "i");
    const m = text.match(re);
    if (m) return Math.min(parseInt(m[1], 10) || 0, maxLv);
    return text.includes(keyword) ? maxLv : 0;
  }
  for (const e of effects) {
    const name = e.Name || "";
    const desc = e.Description || "";
    const tooltip = typeof e.Tooltip === "string" ? e.Tooltip : JSON.stringify(e.Tooltip || e.ToolTip || "");
    const fullText = (name + " " + desc + " " + tooltip).replace(/\s+/g, "").trim();
    const eumHit = extractNodeLv(fullText, "음속돌파", 2) || extractNodeLv(fullText, "음속돌", 2);
    if (eumHit) eumLv = eumHit;
    const mungaHit = extractNodeLv(fullText, "뭉툭한가시", 2) || extractNodeLv(fullText, "뭉툭한", 2);
    if (mungaHit) mungaLv = mungaHit;
    const ipsikHit = extractNodeLv(fullText, "입식타격가", 2) || extractNodeLv(fullText, "입식", 2);
    if (ipsikHit) ipsikLv = ipsikHit;
    const manaHit = extractNodeLv(fullText, "마나용광로", 2) || extractNodeLv(fullText, "마나용", 2);
 



    if (manaHit) manaLv = manaHit;
    // 👇 인파이팅 감지 추가
    const inpaHit = extractNodeLv(fullText, "인파이팅", 2);
    if (inpaHit) inpaLv = inpaHit;
  }
  
  let activeKey = null;
  if (manaLv > 0) activeKey = "mana";
  else if (mungaLv > 0) activeKey = "munga";
  else if (eumLv > 0) activeKey = "eum";
  else if (ipsikLv > 0) activeKey = "ipsik";
  else if (inpaLv > 0) activeKey = "inpa"; // 👇 인파이팅 활성키 추가

  window.__hasMunga = activeKey === "munga";
  window.__mungaLv = mungaLv;
  window.__eumLv = eumLv;
  window.__ipsikLv = ipsikLv;
  window.__manaLv = manaLv;
  window.__inpaLv = inpaLv; // 👇 인파이팅 레벨 저장
  window.__activeEvoNode = activeKey;
  window.__skillsData = fullData?.ArmorySkills || [];
}






function buildCritDrawerHtml(ctx) {
  const { critFromStat, critFromAcc, critFromEng, engBag, critFromEvo, critFromArkGrid,
          critFromYeongaBigi, idCrit, identity, critTotal, munga, backAtk10, giminhamCritBonus, giminhamCritDef, critRateEvoRows, synergyRows } = ctx;
  let html = "";
  
  // 🎯 [수정] 치적 서랍 헤더 (16px, 금색 라벨, 초록색 수치)
  html += `<div style="padding-bottom:10px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); font-size:16px; font-weight:800;">
            <span style="color:#ffd200;">치명타 합산 효과 :</span> <span style="color:#8df901;">+${truncate2(critTotal)}%</span>
           </div>`;
  
  html += `<div class="mc-sub-line"><span>특성</span><b>${round2(critFromStat)}%</b></div>`;
  if (critFromAcc) html += `<div class="mc-sub-line"><span>악세+팔찌</span><b>+${round2(critFromAcc)}%</b></div>`;
  if (critFromEng > 0) html += `<div class="mc-sub-line"><span>각인</span><b>+${round2(critFromEng)}%</b></div>`;
  if (critFromArkGrid) html += `<div class="mc-sub-line"><span>아크 그리드</span><b>+${round2(critFromArkGrid)}%</b></div>`;
  for (const r of (synergyRows || [])) html += `<div class="mc-sub-line"><span>${r.label}</span><b>+${round2(r.value)}%</b></div>`;
  if (critFromEvo || giminhamCritBonus) {
    const evoCount = (critRateEvoRows ? critRateEvoRows.length : 0) + (giminhamCritBonus ? 1 : 0);
    if (evoCount === 1 && critRateEvoRows && critRateEvoRows.length === 1) {
      const r0 = critRateEvoRows[0];
      html += `<div class="mc-sub-line"><span>[${r0.group || "진화"}] ${r0.name} Lv.${r0.level}</span><b>+${round2(r0.value)}%</b></div>`;
    } else if (evoCount === 1 && giminhamCritBonus) {
      html += `<div class="mc-sub-line"><span>[${giminhamCritDef?.group || "깨달음"}] 기민함(이속 연동) Lv.${giminhamCritDef?.level}</span><b>+${round2(giminhamCritBonus)}%</b></div>`;
    } else {
      html += `<div class="mc-sub-line" data-tip="evo-crit"><span>진화/깨달음 <span style="color:#e8b84b;font-size:10px;">🔍</span></span><b>+${round2(critFromEvo + giminhamCritBonus)}%</b></div>`;
    }
  }
  if (critFromYeongaBigi) html += `<div class="mc-sub-line"><span>연가비기(절제)</span><b>+${round2(critFromYeongaBigi)}%</b></div>`;
  if (idCrit) html += `<div class="mc-sub-line"><span>아덴(${identity?.buff_name || ""})</span><b>+${round2(idCrit)}%</b></div>`;
  if (backAtk10) html += `<div class="mc-sub-line"><span>백어택</span><b>+10%</b></div>`;
  html += `<div class="mc-sub-line total"><span>합계</span><b>${truncate2(critTotal)}%</b></div>`;
  return html;
}

// ===== 실시간 계산 엔진 연동 함수 (fillEffDash) =====
function fillEffDash(stats, equipList, fullData, statMap) {
  const dash = $("effDash");
  if (!dash) return;
  window.__dolDaeRate = parseDolDaeRate(fullData?.ArmoryEngraving);
  window.__engData = fullData?.ArmoryEngraving;
  // 점화 소서리스 + 해 코어 '불완전 연소': 아이덴티티를 100%까지 못 채워 마력 해방을 쓸 수 없으므로
  // 깨달음 '점화의 불씨' / '발화' 효과는 적용하지 않음
  const __badIgnite = (window.__charClass === "소서리스") &&
    JSON.stringify((fullData && fullData.ArkGrid) || {}).indexOf("불완전 연소") >= 0;
  window.__igniteBlocked = !!__badIgnite;
  const __igniteRe = /점화의\s*불씨|발화/;
  window.__evoEffects = parseEvolutionEffects(fullData);
  if (__badIgnite) window.__evoEffects = window.__evoEffects.filter(function (e) { return !__igniteRe.test(String(e.name || "")); });
  window.__evoSum = sumEvoEffects(window.__evoEffects, { includeCat2: true, includeCat3: false });

  const critStat = statMap?.["치명"] || 0;
  const swiftStat = statMap?.["신속"] || 0;
  const specStat = statMap?.["특화"] || 0;
  // 특화 툴팁의 '…피해량이 N% 증가' 줄 (회복량 등 제외) → 팔찌 특화 효율 계산에 사용
  window.__specInfo = (function () {
    const st = (stats || []).find(x => x.Type === "특화");
    const lines = [];
    ((st && Array.isArray(st.Tooltip)) ? st.Tooltip : []).forEach(t => {
      const plain = String(t).replace(/<[^>]+>/g, "").trim();
      const m = plain.match(/^(.*?)([0-9.]+)\s*%\s*(증가|증폭)/);
      if (m && /피해/.test(m[1]) && !/회복/.test(m[1])) lines.push({ name: m[1].trim(), pct: parseFloat(m[2]) });
    });
    return { total: specStat, lines: lines };
  })();

  const bag = sumGearStats(equipList || []);
  const engBag = sumEngraveEffects(fullData?.ArmoryEngraving);
  const agBag = sumArkGridEffects(fullData?.ArkGrid);

  const synergyBag = calcClassSynergy(fullData?.ArmorySkills || [], window.__charClass, fullData);
  if (__badIgnite && synergyBag && Array.isArray(synergyBag.rows)) {
    synergyBag.rows = synergyBag.rows.filter(function (r) {
      if (__igniteRe.test(String(r.label || ""))) { synergyBag[r.stat] = (synergyBag[r.stat] || 0) - (r.value || 0); return false; }
      return true;
    });
  }
  const hasMass = (fullData?.ArmoryEngraving?.ArkPassiveEffects || []).some(e => /질량\s*증가/.test(e.Name || ""));
  const massAsPenalty = hasMass ? -10 : 0;

  const identity = detectIdentityBuff(window.__charClass, fullData);
  window.__identityBuff = identity;
  let identityOn = identity ? true : false;

  function extractStatTooltipPct(statType, labelRegex) {
    const s = (stats || []).find(x => x.Type === statType);
    if (!s || !Array.isArray(s.Tooltip)) return 0;
    for (const line of s.Tooltip) {
      const clean = String(line).replace(/<[^>]+>/g, "");
      const m = clean.match(labelRegex);
      if (m) return parseFloat(m[1]);
    }
    return 0;
  }

  const critFromStat = extractStatTooltipPct("치명", /치명타\s*적중률이?\s*([0-9.]+)\s*%\s*증가/);
  const critFromAcc = bag.critRate || 0;
  const critFromEng = engBag.critRate || 0;
  const evoSum = window.__evoSum || { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0, rows: [], conditional: [] };

  const critFromEvo = evoSum.critRate || 0;
  const critRateEvoRows = (evoSum.rows || []).filter(r => r.stat === "critRate");
  const critFromArkGrid = agBag.critRate || 0;
  const critFromSynergy = synergyBag.critRate || 0;

  const hasJeolje = (fullData?.ArmoryEngraving?.ArkPassiveEffects || []).some(e => /절제/.test(e.Name || ""));
  const critFromYeongaBigi = hasJeolje ? 20 : 0;

  const critTotalBaseNoIdentity = critFromStat + critFromAcc + critFromEng + critFromEvo + critFromArkGrid + critFromSynergy + critFromYeongaBigi;
  const critDmgBonusNoIdentity = (bag.critDmg || 0) + (engBag.critDmg || 0) + (evoSum.critDmg || 0) + (agBag.critDmg || 0);

  const janbulAsDef = EVOLUTION_EFFECTS.find(x => x.name === "잔불_공속");
  const janbulMsDef = EVOLUTION_EFFECTS.find(x => x.name === "잔불_이속");
  const janbulAsVal = janbulAsDef ? (janbulAsDef.values[0] || 0) : 0;
  const janbulMsVal = janbulMsDef ? (janbulMsDef.values[0] || 0) : 0;

  const swiftAsPct = extractStatTooltipPct("신속", /공격\s*속도가\s*([0-9.]+)\s*%\s*증가/);
  const swiftMsPct = extractStatTooltipPct("신속", /이동\s*속도가\s*([0-9.]+)\s*%\s*증가/);

  const __isSup = typeof checkIsSupportMode === "function" && checkIsSupportMode(fullData, window.__charClass); // 서폿은 축복의 여신에 갈망 포함
  window.__isSupFlag = __isSup;
  let desireOn = !__isSup;

  function extractSpecAmpPct(keyword) {
    const s = (stats || []).find(x => x.Type === "특화");
    if (!s || !Array.isArray(s.Tooltip)) return null;
    for (const line of s.Tooltip) {
      const clean = String(line).replace(/<[^>]+>/g, "");
      if (clean.includes(keyword)) {
        const m = clean.match(/([0-9.]+)\s*%/);
        if (m) return parseFloat(m[1]);
      }
    }
    return null;
  }








  // 🎯 아덴 특화 증폭 정밀 계산 함수
  const idNow = () => {
    if (!(identity && identityOn)) return {};
    const base = identity.stats || {};
    
    // 1. 특화 스탯에 의한 증폭률 계산
    let ampPct = null;
    if (identity.ampKeyword) {
      const s = (stats || []).find(x => x.Type === "특화");
      if (s && Array.isArray(s.Tooltip)) {
        for (const line of s.Tooltip) {
          const clean = String(line).replace(/<[^>]+>/g, "");
          if (clean.includes(identity.ampKeyword)) {
            const m = clean.match(/([0-9.]+)\s*%/);
            if (m) { ampPct = parseFloat(m[1]); break; }
          }
        }
      }
    }
    if (ampPct == null && identity.scaleCoef) ampPct = specStat * identity.scaleCoef;
    if (ampPct == null || ampPct <= 0) ampPct = 0;

    // 2. 기공사 한계 돌파(깨달음)에 의한 추가 증폭률 계산
    let extraAmpPct = 0;
    if (window.__charClass === "기공사") {
      const ap = fullData?.ArkPassive || fullData?.ArmoryArkPassive || {};
      const effects = ap.Effects || [];
      for (let i = 0; i < effects.length; i++) {
        const text = String(effects[i].Description || "").replace(/<[^>]+>/g, "");
        // "한계 돌파 Lv.3" 매칭
        const m = text.match(/한계\s*돌파\s*Lv\.?\s*(\d+)/i);
        if (m) {
          const lv = parseInt(m[1], 10);
          if (lv === 1) extraAmpPct = 11;
          else if (lv === 2) extraAmpPct = 22;
          else if (lv === 3) extraAmpPct = 33;
          break;
        }
      }
    }

    // 3. 최종 증폭 곱연산: (1 + 특화증폭) × (1 + 노드증폭)
    const amp = (1 + (ampPct / 100)) * (1 + (extraAmpPct / 100));
    
    const scaled = {};
    for (const k of Object.keys(base)) {
      if (k === "crit_rate" || k === "attack_speed" || k === "move_speed") {
        scaled[k] = base[k] * amp;
      } else {
        scaled[k] = base[k];
      }
    }
    return scaled;
  };









  const asInc = () => swiftAsPct + massAsPenalty + BUFF_MEAL + (desireOn ? BUFF_DESIRE : 0) + (evoSum.atkSpeed || 0) + (idNow().attack_speed || 0) + (bag.atkSpeed || 0) + (agBag.atkSpeed || 0) + (synergyBag.atkSpeed || 0) + (engBag.atkSpeed || 0) + (window.__janbulChecked ? janbulAsVal : 0);
  const msInc = () => swiftMsPct + BUFF_MEAL + (desireOn ? BUFF_DESIRE : 0) + (evoSum.moveSpeed || 0) + (idNow().move_speed || 0) + (bag.moveSpeed || 0) + (agBag.moveSpeed || 0) + (synergyBag.moveSpeed || 0) + (engBag.moveSpeed || 0) + (window.__janbulChecked ? janbulMsVal : 0);

  function parseNightmareGemSkills(gemData) {
    const gems = gemData?.Gems || [];
    const result = [];
    for (const g of gems) {
      if (gemIsCooldown(g)) continue;
      const tip = parseTip(g.Tooltip);
      const blob = tip ? JSON.stringify(tip) : (g.Tooltip || "");
      if (!/겁화/.test(blob)) continue;
      let skillName = "";
      let m = blob.match(/COLOR=['"]#FFD200['"]>([^<]+)<\/FONT>/);
      if (m) skillName = m[1].trim();
      if (!skillName) {
        m = blob.match(/\[[^\]]+\]\s*(?:<[^>]+>)*\s*([^<>\s]+)\s*(?:<[^>]+>)*\s*피해/);
        if (m) skillName = m[1].trim();
      }
      if (skillName) result.push({ name: skillName, critDmgBonus: 0 });   // 겁화 보석은 스킬 피해만 → 치피 없음
    }
    return result;
  }

  const nightmareSkills = parseNightmareGemSkills(fullData?.ArmoryGem);
  window.__nightmareSkills = nightmareSkills || [];

  const paint = () => {
    const idStats = idNow();
    const idCrit = idStats.crit_rate || 0;
    const idCritDmg = idStats.crit_damage || 0;
    const critTotalBase = critTotalBaseNoIdentity + idCrit;
    const critDmgBonus = critDmgBonusNoIdentity + idCritDmg;
    const as = asInc(), ms = msInc();

    const giminhamCritDef = (window.__evoSum?.conditional || []).find(r => r.name === "기민함_적중률");
    const giminhamDmgDef = (window.__evoSum?.conditional || []).find(r => r.name === "기민함_치피");
    const asCapped = Math.min(as, 40);
    const msCapped = Math.min(ms, 40);
    const giminhamCritBonus = giminhamCritDef ? (msCapped * giminhamCritDef.value / 100) : 0;
    const giminhamDmgBonus = giminhamDmgDef ? (asCapped * giminhamDmgDef.value / 100) : 0;

    const hasGiseupEng = (fullData?.ArmoryEngraving?.ArkPassiveEffects || []).some(e => /기습의\s*대가/.test(e.Name || ""));
    const hasGyeoltuEng = (fullData?.ArmoryEngraving?.ArkPassiveEffects || []).some(e => /결투의\s*대가/.test(e.Name || ""));
    const hasDirectionalEng = hasGiseupEng || hasGyeoltuEng;
    const ilgyeokDmgDef = (window.__evoSum?.conditional || []).find(r => r.name === "일격_치피");
    const ilgyeokDmgBonus = (hasDirectionalEng && ilgyeokDmgDef) ? ilgyeokDmgDef.value : 0;

    const critDmgTotal = 200 + critDmgBonus + giminhamDmgBonus + ilgyeokDmgBonus + (synergyBag.critDmg || 0);
    const critTotal = critTotalBase + (window.__backAtk10Checked ? 10 : 0) + giminhamCritBonus;
    
    window.__realCritRate = critTotal;
    window.__realAs = as; window.__realMs = ms;
    window.__realCritDmg = critDmgTotal;
    window.__bagExtraDmg = (bag && bag.extraDmg) || 39.5;
    window.__critPerPt = (critStat > 0 && critFromStat > 0) ? critStat / critFromStat : 27.9;   // 치명 스탯 N포인트 = 치적 1%

    const activeEvo = window.__activeEvoNode;
    const mungaLv = (activeEvo === "munga") ? (window.__mungaLv | 0) : 0;
    const eumLv = (activeEvo === "eum") ? (window.__eumLv | 0) : 0;

    const munga = calcBluntThorn(critTotal, mungaLv);
    const sonic = calcSonicBreakthrough(as, ms, eumLv);
    const ipsik = calcStandingStriker(activeEvo === "ipsik" ? (window.__ipsikLv | 0) : 0);

    if ($("mungaTag")) $("mungaTag").style.display = munga.active ? "inline" : "none";
    if ($("effCritRate")) $("effCritRate").textContent = truncate2(critTotal) + "%";
    if ($("critCapNote")) $("critCapNote").style.display = "none";

    if ($("effCritDmg")) $("effCritDmg").textContent = truncate2(critDmgTotal) + "%";
    if ($("effAs")) $("effAs").textContent = truncate2(as) + "% / 40%";
    if ($("effMs")) $("effMs").textContent = truncate2(ms) + "% / 40%";

    function setDrawer(cardSel, html) {
      const card = document.querySelector(cardSel);
      if (!card) return;
      let inner = card.querySelector(".mc-drawer-inner");
      if (!inner) {
        const d = card.querySelector(".mc-drawer");
        if (d) { inner = document.createElement("div"); inner.className = "mc-drawer-inner"; d.appendChild(inner); }
      }
      if (inner) inner.innerHTML = html;
    }

    setDrawer(".mc.crit", buildCritDrawerHtml({
      critFromStat, critFromAcc, critFromEng, engBag, critFromEvo, critFromArkGrid,
      critFromYeongaBigi, idCrit, identity, critTotal, munga,
      backAtk10: window.__backAtk10Checked, giminhamCritBonus, giminhamCritDef, critRateEvoRows,
      synergyRows: (synergyBag.rows || []).filter(r => r.stat === "critRate")
    }));

    const evoTipTarget = document.querySelector('.mc.crit [data-tip="evo-crit"]');
    if (evoTipTarget) {
      const evoRows = (window.__evoSum?.rows || []).filter(r => r.stat === "critRate");
      let tipHtml = `<div class="tip-hd">진화/깨달음 효과 (치명타 적중률)</div><div class="tip-bd">`;
      let hasAny = false;
      for (const r of evoRows) {
        tipHtml += `<div>[${r.group || "진화"}] ${r.name} Lv.${r.level} <b>+${r.value.toFixed(1)}%</b></div>`;
        hasAny = true;
      }
      if (giminhamCritDef && giminhamCritBonus) {
        tipHtml += `<div>[${giminhamCritDef.group || "깨달음"}] 기민함(이속 연동) Lv.${giminhamCritDef.level} <b>+${giminhamCritBonus.toFixed(1)}%</b></div>`;
        hasAny = true;
      }
      if (!hasAny) tipHtml += `<div>상세 정보 없음</div>`;
      tipHtml += `</div>`;
      bindTip(evoTipTarget, tipHtml);
    }

    // 🎯 [수정] 치피 서랍 헤더
    let cdmgHtml = `<div style="padding-bottom:10px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); font-size:16px; font-weight:800;">
                      <span style="color:#ffd200;">치명타 피해 효과 :</span> <span style="color:#8df901;">+${truncate2(critDmgTotal)}%</span>
                    </div>`;
    cdmgHtml += `<div class="mc-sub-line"><span>기본</span><b>200.00%</b></div>`;
    if (bag.critDmg) cdmgHtml += `<div class="mc-sub-line"><span>악세+팔찌</span><b>+${round2(bag.critDmg)}%</b></div>`;
    if (engBag.critDmg) cdmgHtml += `<div class="mc-sub-line"><span>각인</span><b>+${round2(engBag.critDmg)}%</b></div>`;
    if (agBag.critDmg) cdmgHtml += `<div class="mc-sub-line"><span>아크 그리드</span><b>+${round2(agBag.critDmg)}%</b></div>`;
    for (const r of (synergyBag.rows || []).filter(r => r.stat === "critDmg")) {
      cdmgHtml += `<div class="mc-sub-line"><span>${r.label}</span><b>+${round2(r.value)}%</b></div>`;
    }
    const critDmgEvoRows = (evoSum.rows || []).filter(r => r.stat === "critDmg");
    if (critDmgEvoRows.length === 1) {
      const r0 = critDmgEvoRows[0];
      cdmgHtml += `<div class="mc-sub-line"><span>[${r0.group || "진화"}] ${r0.name} Lv.${r0.level}</span><b>+${round2(r0.value)}%</b></div>`;
    } else if (critDmgEvoRows.length >= 2) {
      cdmgHtml += `<div class="mc-sub-line" data-tip="evo-cdmg"><span>진화/깨달음 <span style="color:#e8b84b;font-size:10px;">🔍</span></span><b>+${round2(evoSum.critDmg)}%</b></div>`;
    }
    if (giminhamDmgBonus) cdmgHtml += `<div class="mc-sub-line"><span>[${giminhamDmgDef.group || "깨달음"}] 기민함(공속 연동) Lv.${giminhamDmgDef.level}</span><b>+${round2(giminhamDmgBonus)}%</b></div>`;
    if (ilgyeokDmgBonus) cdmgHtml += `<div class="mc-sub-line"><span>[${ilgyeokDmgDef.group || "진화"}] 일격 Lv.${ilgyeokDmgDef.level} (${hasGiseupEng ? "기습의 대가" : "결투의 대가"})</span><b>+${round2(ilgyeokDmgBonus)}%</b></div>`;
    if (idCritDmg) cdmgHtml += `<div class="mc-sub-line"><span>아덴(${identity?.buff_name || ""})</span><b>+${round2(idCritDmg)}%</b></div>`;
    cdmgHtml += `<div class="mc-sub-line total"><span>합계</span><b>${truncate2(critDmgTotal)}%</b></div>`;

    const cond = (evoSum.conditional || []).filter(r => r.stat === "critDmg" && r.name !== "기민함_치피" && !(r.name === "일격_치피" && hasDirectionalEng));
    if (cond.length) {
      cdmgHtml += `<div class="mc-sub-line mc-expandable open"><span>조건부 (합산 제외)</span><b></b></div>`;
      cdmgHtml += `<div class="mc-mini show">`;
      for (const r of cond) {
        cdmgHtml += `<div class="el"><span>${r.name} Lv.${r.level}</span><span>+${r.value.toFixed(1)}%</span></div>`;
      }
      cdmgHtml += `</div>`;
    }
    {
      const tg = (window.critTargets ? window.critTargets() : []).filter(x => x.cd > 0);   // 치피가 붙은 스킬만
      if (tg.length) {
        cdmgHtml += `<div class="mc-sub-line mc-expandable open" style="margin-top:8px;"><span>스킬별 치피 (트라이포드·노드)</span><b></b></div><div class="mc-mini show">`;
        tg.forEach(x => { cdmgHtml += `<div class="el"><span>${x.name}</span><span>${truncate2(critDmgTotal + x.cd)}%${x.cd ? ` <small style="opacity:.7">(+${round2(x.cd)})</small>` : ""}</span></div>`; });
        cdmgHtml += `</div>`;
      }
    }
    setDrawer(".mc.cdmg", cdmgHtml);

    const cdmgTipTarget = document.querySelector('.mc.cdmg [data-tip="evo-cdmg"]');
    if (cdmgTipTarget) {
      let cdmgTipHtml = `<div class="tip-hd">진화/깨달음 효과 (치명타 피해)</div><div class="tip-bd">`;
      for (const r of critDmgEvoRows) {
        cdmgTipHtml += `<div>[${r.group || "진화"}] ${r.name} Lv.${r.level} <b>+${r.value.toFixed(1)}%</b></div>`;
      }
      cdmgTipHtml += `</div>`;
      bindTip(cdmgTipTarget, cdmgTipHtml);
    }

  



    // 🎯 [공속 / 이속 100% 기본값 합산 및 140% 표기 수정 파트]

    // 1. 공속 카드 수치 및 서랍 수정 (기본 100% 포함)
    const asTotal = 100 + as;
    if ($("effAs")) $("effAs").textContent = truncate2(asTotal) + "%";

    const asParts = [];
    asParts.push(`<div style="padding-bottom:10px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); font-size:16px; font-weight:800;">
                    <span style="color:#ffd200;">공격 속도 :</span> <span style="color:#8df901;">${truncate2(asTotal)}%</span>
                  </div>`);
    asParts.push(`<div class="mc-sub-line"><span>기본</span><b>100.00%</b></div>`);
    asParts.push(`<div class="mc-sub-line"><span>특성</span><b>+${round2(swiftAsPct)}%</b></div>`);
    asParts.push(`<div class="mc-sub-line"><span>만찬</span><b>+${BUFF_MEAL}%</b></div>`);
    if (desireOn) asParts.push(`<div class="mc-sub-line"><span>갈망</span><b>+${BUFF_DESIRE}%</b></div>`);
    if (bag.atkSpeed) asParts.push(`<div class="mc-sub-line"><span>악세+팔찌</span><b>+${round2(bag.atkSpeed)}%</b></div>`);
    if (agBag.atkSpeed) asParts.push(`<div class="mc-sub-line"><span>아크 그리드</span><b>+${round2(agBag.atkSpeed)}%</b></div>`);
    for (const r of (synergyBag.rows || []).filter(r => r.stat === "atkSpeed")) {
      asParts.push(`<div class="mc-sub-line"><span>${r.label}</span><b>+${round2(r.value)}%</b></div>`);
    }
    if (window.__janbulChecked) asParts.push(`<div class="mc-sub-line"><span>잔불(체크)</span><b>+${round2(janbulAsVal)}%</b></div>`);
    const asEvoRows = (evoSum.rows || []).filter(r => r.stat === "atkSpeed");
    if (asEvoRows.length === 1) {
      const r0 = asEvoRows[0];
      asParts.push(`<div class="mc-sub-line"><span>[${r0.group || "진화"}] ${r0.name} Lv.${r0.level}</span><b>+${round2(r0.value)}%</b></div>`);
    } else if (asEvoRows.length >= 2) {
      asParts.push(`<div class="mc-sub-line" data-tip="evo-as"><span>진화/깨달음 <span style="color:#e8b84b;font-size:10px;">🔍</span></span><b>+${round2(evoSum.atkSpeed)}%</b></div>`);
    }
    if (idStats.attack_speed) asParts.push(`<div class="mc-sub-line"><span>아덴(${identity?.buff_name || ""})</span><b>+${round2(idStats.attack_speed)}%</b></div>`);
    if (hasMass) asParts.push(`<div class="mc-sub-line"><span>질량 증가</span><b style="color:#ff6b6b;">-10.00%</b></div>`);
    if (engBag.atkSpeed) asParts.push(`<div class="mc-sub-line"><span>비상의 돌 (공속)</span><b style="color:#ff6b6b;">+${round2(engBag.atkSpeed)}%</b></div>`);
    
    const asGap = 40 - as;
    let asHint = "";
    if (asGap > 0.005) {
      const needSwift = Math.ceil(asGap / 0.017178);
      asHint = `<div class="mc-sub-line need"><span>140%까지 ${round2(asGap)}% 부족</span><b>신속 약 +${needSwift}</b></div>`;
    } else {
      asHint = `<div class="mc-sub-line ok"><span>공속 140% 충족</span><b>✓</b></div>`;
    }
    setDrawer(".mc.as", asParts.join("") + asHint);

    const asTipTarget = document.querySelector('.mc.as [data-tip="evo-as"]');
    if (asTipTarget) {
      let asTipHtml = `<div class="tip-hd">진화/깨달음 효과 (공격 속도)</div><div class="tip-bd">`;
      for (const r of asEvoRows) {
        asTipHtml += `<div>[${r.group || "진화"}] ${r.name} Lv.${r.level} <b>+${r.value.toFixed(1)}%</b></div>`;
      }
      asTipHtml += `</div>`;
      bindTip(asTipTarget, asTipHtml);
    }

    // 2. 이속 카드 수치 및 서랍 수정 (기본 100% 포함)
    const msTotal = 100 + ms;
    if ($("effMs")) $("effMs").textContent = truncate2(msTotal) + "%";

    const msParts = [];
    msParts.push(`<div style="padding-bottom:10px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); font-size:16px; font-weight:800;">
                    <span style="color:#ffd200;">이동 속도 :</span> <span style="color:#8df901;">${truncate2(msTotal)}%</span>
                  </div>`);
    msParts.push(`<div class="mc-sub-line"><span>기본</span><b>100.00%</b></div>`);
    msParts.push(`<div class="mc-sub-line"><span>특성</span><b>+${round2(swiftMsPct)}%</b></div>`);
    msParts.push(`<div class="mc-sub-line"><span>만찬</span><b>+${BUFF_MEAL}%</b></div>`);
    if (desireOn) msParts.push(`<div class="mc-sub-line"><span>갈망</span><b>+${BUFF_DESIRE}%</b></div>`);
    if (bag.moveSpeed) msParts.push(`<div class="mc-sub-line"><span>악세+팔찌</span><b>+${round2(bag.moveSpeed)}%</b></div>`);
    if (agBag.moveSpeed) msParts.push(`<div class="mc-sub-line"><span>아크 그리드</span><b>+${round2(agBag.moveSpeed)}%</b></div>`);
    for (const r of (synergyBag.rows || []).filter(r => r.stat === "moveSpeed")) {
      msParts.push(`<div class="mc-sub-line"><span>${r.label}</span><b>+${round2(r.value)}%</b></div>`);
    }
    if (window.__janbulChecked) msParts.push(`<div class="mc-sub-line"><span>잔불(체크)</span><b>+${round2(janbulMsVal)}%</b></div>`);
    const msEvoRows = (evoSum.rows || []).filter(r => r.stat === "moveSpeed");
    if (msEvoRows.length === 1) {
      const r0 = msEvoRows[0];
      msParts.push(`<div class="mc-sub-line"><span>[${r0.group || "진화"}] ${r0.name} Lv.${r0.level}</span><b>+${round2(r0.value)}%</b></div>`);
    } else if (msEvoRows.length >= 2) {
      msParts.push(`<div class="mc-sub-line" data-tip="evo-ms"><span>진화/깨달음 <span style="color:#e8b84b;font-size:10px;">🔍</span></span><b>+${round2(evoSum.moveSpeed)}%</b></div>`);
    }
    if (idStats.move_speed) msParts.push(`<div class="mc-sub-line"><span>아덴(${identity?.buff_name || ""})</span><b>+${round2(idStats.move_speed)}%</b></div>`);
    if (engBag.moveSpeed) msParts.push(`<div class="mc-sub-line"><span>비상의 돌 (이속)</span><b style="color:#ff6b6b;">+${round2(engBag.moveSpeed)}%</b></div>`);
    
    const msGap = 40 - ms;
    let msHint = "";
    if (msGap > 0.005) {
      const needSwift = Math.ceil(msGap / 0.017178);
      msHint = `<div class="mc-sub-line need"><span>140%까지 ${round2(msGap)}% 부족</span><b>신속 약 +${needSwift}</b></div>`;
    } else {
      msHint = `<div class="mc-sub-line ok"><span>이속 140% 충족</span><b>✓</b></div>`;
    }
    setDrawer(".mc.ms", msParts.join("") + msHint);

    const msTipTarget = document.querySelector('.mc.ms [data-tip="evo-ms"]');
    if (msTipTarget) {
      let msTipHtml = `<div class="tip-hd">진화/깨달음 효과 (이동 속도)</div><div class="tip-bd">`;
      for (const r of msEvoRows) {
        msTipHtml += `<div>[${r.group || "진화"}] ${r.name} Lv.${r.level} <b>+${r.value.toFixed(1)}%</b></div>`;
      }
      msTipHtml += `</div>`;
      bindTip(msTipTarget, msTipHtml);
    }









    // 🎯 [수정] 돌격대장 효율 서랍 헤더
    const dolRate = window.__dolDaeRate;
    if (dolRate != null && $("effDol")) {
      const used = Math.min(ms, 40) / 100;
      const cur = dolRate * used;
      const max = dolRate * 0.4;
      $("effDol").textContent = cur.toFixed(2) + "% / " + max.toFixed(2) + "%";
      
      let html = `<div style="padding-bottom:10px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); font-size:16px; font-weight:800;">
                    <span style="color:#ffd200;">돌격대장 효율 :</span> <span style="color:#8df901;">+${cur.toFixed(2)}%</span>
                  </div>`;
      html += `<div class="mc-sub-line"><span>전환율</span><b>${dolRate.toFixed(2)}%</b></div>`;
      html += `<div class="mc-sub-line"><span>이속 증가</span><b>${ms.toFixed(2)}%</b></div>`;
      html += `<div class="mc-sub-line total"><span>현재 / 최대</span><b>${cur.toFixed(2)}% / ${max.toFixed(2)}%</b></div>`;
      if (ms < 40) {
        const need = Math.ceil((40 - ms) / 0.017178);
        html += `<div class="mc-sub-line need"><span>이속 풀까지</span><b>신속 약 +${need}</b></div>`;
      }
      setDrawer("#effDolCard", html);
    } else if ($("effDol")) {
      $("effDol").textContent = "—";
      setDrawer("#effDolCard", `<div class="mc-sub-line"><span>돌격대장 미장착</span><b></b></div>`);
    }

    // 🎯 [수정] 각인 효율 서랍 헤더
    const engEff = calcEngraveEfficiency(window.__engData, ms, critTotal, critDmgTotal);
    if ($("effEngTotal")) {
      $("effEngTotal").textContent = engEff.total > 0 ? engEff.total.toFixed(2) + "%" : "—";
    }
    
    let html = `<div style="padding-bottom:10px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); font-size:16px; font-weight:800;">
                  <span style="color:#ffd200;">각인 총 효율 :</span> <span style="color:#8df901;">+${engEff.total.toFixed(2)}%</span>
                </div>`;
    html += `<div class="mc-sub-line"><span>곱연산</span><b>${engEff.rows.length}종</b></div>`;
    if (engEff.rows.length) {
      html += `<div class="mc-sub-line" style="margin-top:8px;"><span>각인별 상세</span><b></b></div>`;
      html += `<div class="eng-lines">`;
      for (const r of engEff.rows) {
        html += `<div class="el"><span>${r.name}</span><span>${r.pct.toFixed(2)}%</span></div>`;
      }
      html += `</div>`;
    }
    setDrawer("#effEngCard", html);

    // 🎯 [수정] 활성 진화 노드 카드 렌더링 및 헤더 추가
    const activeNode = window.__activeEvoNode;
    const nodeCard = $("activeNodeCard");
    if (nodeCard) {
      if (activeNode) {
        nodeCard.style.display = "block";





        const nodeNames = { munga: "뭉툭한 가시", eum: "음속돌파", ipsik: "입식 타격가", mana: "마나 용광로", inpa: "인파이팅" };
        const nodeIcons = {
          munga: "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_evolution/ark_passive_evolution_20.png",
          eum: "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_evolution/ark_passive_evolution_21.png",
          ipsik: "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_evolution/ark_passive_evolution_18.png",
          mana: "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_evolution/ark_passive_evolution_24.png",
          inpa: "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_evolution/ark_passive_evolution_38.png" // 👇 인파이팅 아이콘 추가
        };
        const nodeLvs = { munga: window.__mungaLv, eum: window.__eumLv, ipsik: window.__ipsikLv, mana: window.__manaLv, inpa: window.__inpaLv };



     
        
        if ($("activeNodeLabel")) $("activeNodeLabel").textContent = nodeNames[activeNode] || "-";
        if ($("activeNodeIcon")) $("activeNodeIcon").src = nodeIcons[activeNode] || "";
        if ($("activeNodeBadge")) {
          $("activeNodeBadge").textContent = "활성 Lv." + (nodeLvs[activeNode] || 0);
          $("activeNodeBadge").className = "mc-badge on";
        }

        const nodeVal = $("activeNodeValue");
        if (nodeVal) {
        





          if (activeNode === "munga") {
            const mg = window.calcBluntThorn ? window.calcBluntThorn(critTotal, window.__mungaLv | 0) : {evoDmgAdd:0, maxEff:0, baseEvo:0, convEvo:0};
            nodeVal.textContent = mg.evoDmgAdd.toFixed(2) + "% / " + mg.maxEff.toFixed(2) + "%";
            setDrawer("#activeNodeCard", `
              <div style="padding-bottom:10px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); font-size:16px; font-weight:800;">
                <span style="color:#ffd200;">뭉툭한 가시 :</span> <span style="color:#8df901;">+${round2(mg.evoDmgAdd)}%</span>
              </div>
              <div class="mc-sub-line"><span>뭉툭한 가시</span><b>Lv.${window.__mungaLv}</b></div>
              <div class="mc-sub-line"><span>기본 진피</span><b>+${round2(mg.baseEvo)}%</b></div>
              <div class="mc-sub-line"><span>원본 치적</span><b>${truncate2(critTotal)}%</b></div>
              <div class="mc-sub-line"><span>전환 진피</span><b>+${round2(mg.convEvo)}%</b></div>
              <div class="mc-sub-line total"><span>총 진피</span><b>+${round2(mg.evoDmgAdd)}% / ${round2(mg.maxEff)}%</b></div>
              ${(function () {
                if (mg.evoDmgAdd >= mg.maxEff - 0.005) return `<div class="mc-sub-line ok"><span>최대 효율 달성</span><b>✓</b></div>`;
                const needCrit = Math.max(0, 80 + (mg.maxEff - mg.baseEvo) / mg.convRate - critTotal);
                const perPct = (critStat > 0 && critFromStat > 0) ? critStat / critFromStat : 27.9;
                return `<div class="mc-sub-line need"><span>풀 효율까지 치명타 적중률 ${round2(needCrit)}% 부족</span><b>치명 약 +${Math.ceil(needCrit * perPct)}</b></div>`;
              })()}
              ${(function () {
                const tl = (window.critTargets ? window.critTargets() : []).filter(x => x.cr > 0);   // 치적이 붙은 스킬만
                if (!tl.length || !window.calcBluntThorn) return "";
                const lv0 = window.__mungaLv | 0;
                const rows = tl.map(x => { const c = critTotal + x.cr; return { name: x.name, c: c, evo: window.calcBluntThorn(c, lv0).evoDmgAdd }; });
                let h = `<div class="mc-sub-line mc-expandable open"><span>스킬별 상세 (트라이포드·노드 치적)</span><b></b></div><div class="mc-mini show">`;
                rows.forEach(r => { h += `<div class="el"><span>${r.name}</span><span>치적 ${truncate2(r.c)}% · 진피 +${round2(r.evo)}%</span></div>`; });
                return h + `</div>`;
              })()}
            `);
          } else if (activeNode === "eum") {
            const sn = window.calcSonicBreakthrough ? window.calcSonicBreakthrough(as, ms, window.__eumLv | 0) : {evoDmg:0, maxLimit:0};
            nodeVal.textContent = sn.evoDmg.toFixed(2) + "% / " + sn.maxLimit.toFixed(2) + "%";
            setDrawer("#activeNodeCard", `
              <div style="padding-bottom:10px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); font-size:16px; font-weight:800;">
                <span style="color:#ffd200;">음속돌파 :</span> <span style="color:#8df901;">+${sn.evoDmg.toFixed(2)}%</span>
              </div>
              <div class="mc-sub-line"><span>음속돌파</span><b>Lv.${window.__eumLv}</b></div>
              <div class="mc-sub-line"><span>공속</span><b>${as.toFixed(2)}%</b></div>
              <div class="mc-sub-line"><span>이속</span><b>${ms.toFixed(2)}%</b></div>
              <div class="mc-sub-line total"><span>진피</span><b>${sn.evoDmg.toFixed(2)}% / ${sn.maxLimit.toFixed(2)}%</b></div>
              ${(function () {
                if (sn.evoDmg >= sn.maxLimit - 0.005) return `<div class="mc-sub-line ok"><span>최대 효율 달성</span><b>✓</b></div>`;
                const lv = window.__eumLv | 0, K = 0.017178;   // 신속 1pt = 공속·이속 각 0.017178%
                let needSw = null;
                for (let sw = 1; sw <= 4000; sw++) {
                  const t = window.calcSonicBreakthrough(as + sw * K, ms + sw * K, lv);
                  if (t.evoDmg >= sn.maxLimit - 0.005) { needSw = sw; break; }
                }
                let needSum = null;   // 공이속을 자유롭게 배분할 때 필요한 합계 (공속 140 / 이속 140 기준 충족 이후)
                for (let d = 0.1; d <= 150; d += 0.1) {
                  let ok = false;
                  for (let a = 0; a <= d + 1e-9; a += 0.5) {
                    if (window.calcSonicBreakthrough(as + a, ms + (d - a), lv).evoDmg >= sn.maxLimit - 0.005) { ok = true; break; }
                  }
                  if (ok) { needSum = d; break; }
                }
                let h = "";
                if (needSum != null) h += `<div class="mc-sub-line need"><span>풀 효율까지 공속+이속 합 부족</span><b>${round2(needSum)}%</b></div>`;
                if (needSw != null) h += `<div class="mc-sub-line need"><span>신속 스탯으로 채운다면</span><b>신속 약 +${needSw}</b></div>`;
                return h;
              })()}
            `);
          } else if (activeNode === "ipsik") {
            const ip = window.calcStandingStriker ? window.calcStandingStriker(window.__ipsikLv | 0) : {efficiency:0, maxEff:21};
            nodeVal.textContent = ip.efficiency.toFixed(2) + "% / " + ip.maxEff.toFixed(2) + "%";
            setDrawer("#activeNodeCard", `
              <div style="padding-bottom:10px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); font-size:16px; font-weight:800;">
                <span style="color:#ffd200;">입식 타격가 :</span> <span style="color:#8df901;">+${ip.efficiency}%</span>
              </div>
              <div class="mc-sub-line"><span>입식 타격가</span><b>고정</b></div>
              <div class="mc-sub-line total"><span>효율</span><b>${ip.efficiency}% / 21%</b></div>
            `);
          } else if (activeNode === "mana") {
            const mn = window.calcManaFurnace ? window.calcManaFurnace(window.__manaLv | 0, window.__skillsData) : {maxEff:0, rows:[]};
            const show = mn.top > 0 ? mn.top : mn.maxEff;
            nodeVal.textContent = show.toFixed(2) + "% / " + mn.maxEff.toFixed(2) + "%";
            let mHtml = `
              <div style="padding-bottom:10px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); font-size:16px; font-weight:800;">
                <span style="color:#ffd200;">마나 용광로 :</span> <span style="color:#8df901;">+${show.toFixed(2)}%</span>
              </div>
              <div class="mc-sub-line"><span>마나 용광로</span><b>Lv.${window.__manaLv}</b></div>
              <div class="mc-sub-line"><span>최대 효율 조건</span><b>마나 480 이상 소모</b></div>
              <div class="mc-sub-line"><span>효율 증가량</span><b>마나 10당 +${window.__manaLv >= 2 ? "0.50" : "0.25"}%</b></div>
            `;
            const mRows = (mn.rows || []).slice(0, 10);
            if (mRows.length) {
              mHtml += `<div class="mc-sub-line mc-expandable open"><span>스킬별 상세</span><b></b></div><div class="mc-mini show">`;
              for (var mi = 0; mi < mRows.length; mi++) {
                mHtml += `<div class="el"><span>${mRows[mi].name}</span><span>${mRows[mi].evo.toFixed(2)}%</span></div>`;
              }
              mHtml += `</div>`;
            }
            setDrawer("#activeNodeCard", mHtml);
     


          } else if (activeNode === "inpa") {
            // 🎯 [수정 완료] 인파이팅 수치: Lv.1 = 9.00%, Lv.2 = 18.00%
            const inpaVal = (window.__inpaLv | 0) >= 2 ? 18.0 : 9.0;
            nodeVal.textContent = inpaVal.toFixed(2) + "% / 18.00%";
            setDrawer("#activeNodeCard", `
              <div style="padding-bottom:10px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); font-size:16px; font-weight:800;">
                <span style="color:#ffd200;">인파이팅 :</span> <span style="color:#8df901;">+${inpaVal.toFixed(2)}%</span>
              </div>
              <div class="mc-sub-line"><span>인파이팅</span><b>고정 (근접)</b></div>
              <div class="mc-sub-line total"><span>최대 효율</span><b>${inpaVal.toFixed(2)}% / 18.00%</b></div>
            `);
          }




        }
      } else {
        nodeCard.style.display = "none";
      }
    }




    // 🎯 [수정] 팔찌 효율 카드 렌더링 및 헤더 색상 매칭
    const bVal = $("braceletEffValue");
    const bCard = $("braceletEffCard");
    if (bCard) {
      const eqList2 = (fullData && fullData.ArmoryEquipment) ? fullData.ArmoryEquipment : [];
      let bItem = null;
      for (let bi = 0; bi < eqList2.length; bi++) {
        if (eqList2[bi].Type === "팔찌") { bItem = eqList2[bi]; break; }
      }
      if (bItem) {
        bCard.style.display = "block";
        let bEff = calcBraceletEfficiency(bItem, {
          critRate: critTotal,
          critDmg: critDmgTotal,
          weaponAtk: bag.weaponAtk || 265000,
          mainStat: bag.mainStat || 500000,
          extraDmg: bag.extraDmg || 39.5
        });
        bEff = window.braceletApplySpeed ? window.braceletApplySpeed(bItem, bEff) : bEff;
        if (bEff && bEff.totalEff > 0) {
          if (bVal) bVal.textContent = bEff.totalEff.toFixed(2) + "%";
          
          // 팔찌 효율에 따른 동적 색상 결정 (흰/초/파/보/노)
          let dynColor = "#ffffff";
          if (bEff.totalEff >= 17) dynColor = "#FFD200";
          else if (bEff.totalEff >= 14) dynColor = "#A235FF";
          else if (bEff.totalEff >= 11) dynColor = "#00B5FF";
          else if (bEff.totalEff >= 8) dynColor = "#8DF901";

          let bHtml = `<div style="padding-bottom:10px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.1); font-size:16px; font-weight:800;">
                         <span style="color:#ffd200;">팔찌 효율 :</span> <span style="color:${dynColor};">+${bEff.totalEff.toFixed(2)}%</span>
                       </div>`;
          for (let br = 0; br < bEff.rows.length; br++) {
            bHtml += '<div class="mc-sub-line"><span>' + (window.brColorize ? window.brColorize(bEff.rows[br].name, bItem) : bEff.rows[br].name) + '</span><b>+' + bEff.rows[br].pct.toFixed(2) + '%</b></div>';
          }
          setDrawer("#braceletEffCard", bHtml);
        } else {
          if (bVal) bVal.textContent = "-";
          setDrawer("#braceletEffCard", '<div class="mc-sub-line"><span>효율 정보 없음</span><b></b></div>');
        }
      } else {
        bCard.style.display = "none";
      }
    }
  };

  const buffs = $("effBuffs");
  if (buffs) {
    let identityRow = "";
    if (identity) {
      if (identity.type === "permanent") {
        identityRow = `<div class="buff-row"><label><input type="checkbox" id="buffIdentity" checked disabled> ${identity.buff_name} (아덴 · 고유 자치적)</label><span class="locked">상시 · 잠금</span></div>`;
      } else {
        const checkedStr = identityOn ? "checked" : "";
        identityRow = `<div class="buff-row"><label><input type="checkbox" id="buffIdentity" ${checkedStr}> ${identity.buff_name} (아덴 · 고유 자치적)</label><span style="color:#3cc78c;font-size:10px;font-weight:700">기본 활성</span></div>`;
      }
    }
    buffs.innerHTML = `
      <div class="buff-row"><label><input type="checkbox" id="buffMeal" checked disabled> 영지 요리 공이속 +${BUFF_MEAL}%</label><span class="locked">상시 · 잠금</span></div>
      ${__isSup ? "" : `<div class="buff-row"><label><input type="checkbox" id="buffDesire" checked> 갈망 버프 공이속 +${BUFF_DESIRE}%</label><span style="color:#FFB84D;font-size:10px;font-weight:700">활성 전용</span></div>`}
      ${identityRow}
    `;
    const cb = buffs.querySelector("#buffDesire");
    if (cb) {
      cb.addEventListener("change", () => {
        desireOn = cb.checked;
        paint();
      });
    }
    const cbId = buffs.querySelector("#buffIdentity");
    if (cbId && identity && identity.type !== "permanent") {
      cbId.addEventListener("change", () => {
        identityOn = cbId.checked;
        paint();
      });
    }
  }

  // 🎯 백어택/잔불 세팅 먼저 완료!
  const hasGiseup = (fullData?.ArmoryEngraving?.ArkPassiveEffects || []).some(e => /기습의\s*대가/.test(e.Name || ""));
  window.__backAtk10Checked = hasGiseup;
  const backAtkWrap = $("backAtkWrap");
  const chkBack = $("chkMungaBack");
  if (backAtkWrap) backAtkWrap.style.display = hasGiseup ? "inline-flex" : "none";
  if (chkBack) {
    chkBack.checked = !!window.__backAtk10Checked;
    const newChk = chkBack.cloneNode(true);
    chkBack.parentNode.replaceChild(newChk, chkBack);
    newChk.addEventListener("change", () => {
      window.__backAtk10Checked = newChk.checked;
      paint();
    });
  }

  const hasJanbul = (window.__evoSum?.conditional || []).some(r => r.name === "잔불_공속");
  const janbulWrap = $("janbulWrap");
  const chkJanbul = $("chkJanbul");
  if (janbulWrap) janbulWrap.style.display = hasJanbul ? "inline-flex" : "none";
  if (!hasJanbul) window.__janbulChecked = false;
  if (chkJanbul) {
    chkJanbul.checked = !!window.__janbulChecked;
    const newChkJ = chkJanbul.cloneNode(true);
    chkJanbul.parentNode.replaceChild(newChkJ, chkJanbul);
    newChkJ.addEventListener("change", () => {
      window.__janbulChecked = newChkJ.checked;
      paint();
    });
  }

  updateNodeCards(fullData);

  // 🎯 세팅이 끝난 후 최종적으로 paint() 실행
  paint();
}

// ===== 팔찌 공이속 옵션 효율 (스탯 보드 팔찌 카드 + 장비 툴팁 공용) =====
// 팔찌의 "공격 및 이동 속도 +N%" 를 뺀 상태와 비교 → 음속돌파 / 돌격대장 / 공속·이속 실효율
// 공속·이속은 기본 100% + 최대 40% (140%) 까지만 유효
// 재사용 대기시간 증가 패널티 반영: "재사용 대기시간이 N% 증가하지만, 적에게 주는 피해가 M% 증가"
// 쿨 +N% → 시전 빈도 1/(1+N%) 로 보고 해당 옵션 효율에서 나눠 줌 (CD_COEF: 쿨타임에 묶인 딜 비중, 1=전부)
window.braceletApplyCdPenalty = function (bItem, bEff) {
  try {
    if (!bItem || !bEff || !bEff.rows) return bEff;
    const CD_COEF = 0.66;
    const t = String(bItem.Tooltip || "").replace(/\\r\\n|\\n|\\r/g, " ").replace(/\\"/g, '"').replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    const m = /재사용\s*대기\s*시간이\s*([0-9.]+)\s*%\s*증가하지만/.exec(t);
    if (!m) return bEff;
    const c = parseFloat(m[1]) * CD_COEF;
    const rows = bEff.rows.map(r => Object.assign({}, r));
    const row = rows.find(r => /재사용\s*쿨/.test(r.name || "") && r.pct > 0);
    if (!row) return bEff;
    const oldP = row.pct;
    const newP = ((1 + oldP / 100) / (1 + c / 100) - 1) * 100;
    row.pct = newP;
    row.name = String(row.name).replace(/(재사용\s*쿨\s*\+?[0-9.]+%)\s*감소/, "$1 증가");
    const total = ((1 + bEff.totalEff / 100) / (1 + oldP / 100) * (1 + newP / 100) - 1) * 100;
    return { totalEff: total, rows: rows };
  } catch (e) { return bEff; }
};

// 점화 소서리스 + 해 코어 '불완전 연소': 특화는 마력 해방(점화)을 쓸 수 없어 딜 증가가 아닌 아덴 안정용 → 포인트당 효율을 따로 책정
window.braceletApplySpec = function (bItem, bEff) {
  try {
    if (!bEff || !bEff.rows) return bEff;
    const SPEC_PT = 0.03;   // 특화 1포인트당 효율(%)
    const fd = window.__fullData || {};
    const cls = (fd.ArmoryProfile && fd.ArmoryProfile.CharacterClassName) || window.__charClass || "";
    const rows = bEff.rows.map(r => Object.assign({}, r));
    const row = rows.find(r => /^특화\s*\+\s*\d+/.test(String(r.name || "")));
    if (!row) return bEff;
    const v = parseInt(/\+\s*(\d+)/.exec(row.name)[1], 10) || 0;
    if (cls !== "소서리스" || JSON.stringify(fd.ArkGrid || {}).indexOf("불완전 연소") < 0) {
      // 일반: 특화 툴팁의 스킬 피해량(합연산)으로 산정. 가장 큰 피해량 줄 1개를 주력으로 100% 반영
      // 효율 = ΔS / (100 + 추가피해 + 팔찌 뺀 S)  (S = 특화로 늘어난 스킬 피해량 %)
      const si = window.__specInfo;
      if (!si || !(si.total > 0) || !si.lines.length || !(v > 0)) return bEff;
      const top = si.lines.slice().sort((a, b) => b.pct - a.pct)[0];
      const T = si.total, Sw = top.pct, So = Sw * Math.max(0, T - v) / T;
      const extra = window.__bagExtraDmg != null ? window.__bagExtraDmg : 39.5;
      const newP0 = (Sw - So) / (100 + extra + So) * 100;
      const oldP0 = row.pct;
      row.pct = newP0;
      const total0 = ((1 + bEff.totalEff / 100) / (1 + oldP0 / 100) * (1 + newP0 / 100) - 1) * 100;
      return { totalEff: total0, rows: rows };
    }
    const oldP = row.pct, newP = v * SPEC_PT;
    row.pct = newP;
    const total = ((1 + bEff.totalEff / 100) / (1 + oldP / 100) * (1 + newP / 100) - 1) * 100;
    return { totalEff: total, rows: rows };
  } catch (e) { return bEff; }
};


// 트라이포드(선택+해금)로 변동되는 스킬별 치명타 적중률/피해 (skillData.js: TRIPOD_CRIT_BY_SKILL)
window.skillTripodCrit = function () {
  const out = [];
  try {
    if (typeof TRIPOD_CRIT_BY_SKILL === "undefined") return out;
    const fd = window.__fullData || {};
    const cls = (fd.ArmoryProfile && fd.ArmoryProfile.CharacterClassName) || window.__charClass || "";
    const UNLOCK = [4, 7, 10];
    const nz = (x) => String(x || "").replace(/\s+/g, "");
    (fd.ArmorySkills || []).forEach(function (sk) {
      const lv = sk.Level || 0, st = sk.SkillType || 0;
      if (!(lv > 1 || st === 1 || st >= 100)) return;
      const db = TRIPOD_CRIT_BY_SKILL[sk.Name + "@" + cls] || TRIPOD_CRIT_BY_SKILL[sk.Name];
      if (!db) return;
      let cr = 0, cd = 0;
      (sk.Tripods || []).forEach(function (t) {
        if (!t.IsSelected || lv < (UNLOCK[t.Tier] || 0)) return;
        [["critRate", 0], ["critDmg", 1]].forEach(function (k) {
          const tbl = db[k[0]]; if (!tbl) return;
          for (const nm in tbl) if (nz(nm) === nz(t.Name)) { if (k[1] === 0) cr += tbl[nm]; else cd += tbl[nm]; }
        });
      });
      if (cr || cd) out.push({ name: sk.Name, cr: cr, cd: cd });
    });
  } catch (e) {}
  return out;
};

// 팔찌 치명 효율 계산 대상: 스킬 Lv10↑ 겁화 보석 장착 스킬 + 초각 스킬 1개 + 각성기 1개
// 스킬별 치적/치피 = 전체 값 + 트라이포드 + 도약/깨달음 노드 (겁화 보석은 스킬 피해만 → 치피 없음)
window.critTargets = function () {
  const out = [];
  try {
    const fd = window.__fullData || {};
    const skills = fd.ArmorySkills || [];
    const tri = {};
    (window.skillTripodCrit ? window.skillTripodCrit() : []).forEach(x => { tri[x.name] = { name: x.name, cr: x.cr, cd: x.cd }; });
    // 깨달음/도약 노드(AWAKENING_NODE_BY_SKILL) 중 스킬명이 실제 스킬과 일치하는 것만 합산
    try {
      if (typeof AWAKENING_NODE_BY_SKILL !== "undefined") {
        const nz = (x) => String(x || "").replace(/\s+/g, "");
        const ap = fd.ArkPassive || fd.ArmoryArkPassive || {};
        const texts = (ap.Effects || []).map(e => nz((e.Name || "") + " " + (e.Description || "") + " " + (typeof e.Tooltip === "string" ? e.Tooltip : JSON.stringify(e.Tooltip || e.ToolTip || ""))));
        const byName = {}; skills.forEach(sk => { byName[nz(sk.Name)] = sk.Name; });
        for (const node in AWAKENING_NODE_BY_SKILL) {
          const def = AWAKENING_NODE_BY_SKILL[node], real = byName[nz(def.skill)];
          if (!real) continue;
          const key = nz(node);
          const re = new RegExp(key + "[^0-9]{0,20}Lv\\.?(\\d+)", "i");
          let lv = 0;
          for (const t of texts) { const m = t.match(re); if (m) { lv = parseInt(m[1], 10) || 0; break; } }
          const row = def.level && def.level[String(lv)];
          if (!row) continue;
          const t0 = tri[real] || (tri[real] = { name: real, cr: 0, cd: 0 });
          t0.cr += row.critRate || 0; t0.cd += row.critDmg || 0;
        }
      }
    } catch (e) {}
    // 스킬 묶음에 걸리는 노드 (skillData.js에 없는 것): 블래스터 '포격 출력 강화' = 포격 스킬 치적 +40%
    try {
      const nz = (x) => String(x || "").replace(/\s+/g, "");
      const cls0 = (fd.ArmoryProfile && fd.ArmoryProfile.CharacterClassName) || window.__charClass || "";
      const ap = fd.ArkPassive || fd.ArmoryArkPassive || {};
      const alltext = (ap.Effects || []).map(e => nz((e.Name || "") + " " + (e.Description || "") + " " + (typeof e.Tooltip === "string" ? e.Tooltip : JSON.stringify(e.Tooltip || e.ToolTip || "")))).join("|");
      const GROUP_NODES = [
        { node: "포격 출력 강화", cls: "블래스터", cr: 40, cd: 0,
          skills: ["포격 : 스틸 레인", "강화탄", "산탄", "고압열탄", "네이팜탄", "화염방사기", "공중 폭격", "중력 폭발", "전방 포격", "미사일 폭격"] }
      ];
      GROUP_NODES.forEach(gn => {
        if (gn.cls && gn.cls !== cls0) return;
        if (alltext.indexOf(nz(gn.node)) < 0) return;
        const names = {}; gn.skills.forEach(n => { names[nz(n)] = 1; });
        skills.forEach(sk => {
          if (!names[nz(sk.Name)]) return;
          const t0 = tri[sk.Name] || (tri[sk.Name] = { name: sk.Name, cr: 0, cd: 0 });
          t0.cr += gn.cr; t0.cd += gn.cd;
        });
      });
    } catch (e) {}
    // 겁화(피해) 보석 장착 스킬: 스킬 탭과 같은 buildSkillGemMap 기준
    const gem = {};
    try {
      if (typeof buildSkillGemMap === "function") {
        const gm = buildSkillGemMap(fd.ArmoryGem);
        for (const n in gm) if (gm[n] && gm[n].dmg) gem[n] = 0;
      }
    } catch (e) {}
    (window.__nightmareSkills || []).forEach(g => { if (gem[g.name] == null) gem[g.name] = 0; });
    const add = (sk, gemCd) => {
      const t = tri[sk.Name] || { cr: 0, cd: 0 };
      out.push({ name: sk.Name, cr: t.cr || 0, cd: (t.cd || 0) + (gemCd || 0) });
    };
    const seen = {};
    skills.forEach(sk => {
      if ((sk.Level || 0) >= 10 && gem[sk.Name] != null && !seen[sk.Name]) { seen[sk.Name] = 1; add(sk, gem[sk.Name]); }
    });
    const best = (pred) => skills.filter(pred).sort((a, b) => (b.Level || 0) - (a.Level || 0))[0];
    const hyper = best(sk => sk.SkillType === 1);
    const awak  = best(sk => (sk.SkillType || 0) >= 100);
    if (hyper && !seen[hyper.Name]) { seen[hyper.Name] = 1; add(hyper, 0); }
    if (awak && !seen[awak.Name]) { seen[awak.Name] = 1; add(awak, 0); }
  } catch (e) {}
  return out;
};

// 팔찌 치명 효율 통합: 치명 스탯 → 치적(%)로 환산, 치적/치피 옵션과 함께 실제 치적·치피로 한 번에 계산
// 팔찌를 뺀 상태(CR0, cd0)와 비교. 뭉툭한 가시 활성 시 치적 80% 상한 + 초과분→진피 전환까지 반영
window.braceletApplyCrit = function (bItem, bEff) {
  try {
    if (!bEff || !bEff.rows || window.__isSupFlag) return bEff;
    const CR = window.__realCritRate, CD = window.__realCritDmg;
    if (CR == null || CD == null) return bEff;
    const perPt = window.__critPerPt > 0 ? window.__critPerPt : 27.9;
    const rows = bEff.rows.map(r => Object.assign({}, r));
    const num = (r, re) => { const m = re.exec(String(r.name || "")); return m ? parseFloat(m[1]) : 0; };
    const rStat = rows.find(r => /^치명(?!타)\s*\+?\s*\d/.test(String(r.name || "")));
    const rCr = rows.find(r => r !== rStat && /(치명타\s*적중률|치적)/.test(String(r.name || "")) && !/공격\s*적중/.test(r.name));
    const rCd = rows.find(r => r !== rStat && /(치명타\s*(피해|데미지)|치피)/.test(String(r.name || "")) && !/공격\s*적중/.test(r.name));
    const S  = rStat ? num(rStat, /\+?\s*(\d[\d,]*)/) : 0;
    const oC = rCr ? num(rCr, /([0-9.]+)\s*%/) : 0;
    const oD = rCd ? num(rCd, /([0-9.]+)\s*%/) : 0;
    if (!(S > 0) && !(oC > 0) && !(oD > 0)) return bEff;
    const cS = S / perPt;
    const lv = (window.__activeEvoNode === "munga") ? (window.__mungaLv | 0) : 0;
    const EVO = 186.9;
    const F = (cr, cd) => {
      cr = Math.max(0, cr);
      if (lv > 0 && typeof calcBluntThorn === "function") {
        const mg = calcBluntThorn(cr, lv);
        return (1 + Math.min(cr, 80) / 100 * (cd / 100 - 1)) * (EVO + (mg.evoDmgAdd || 0)) / EVO;
      }
      return 1 + Math.min(cr, 100) / 100 * (cd / 100 - 1);
    };
    // 대상 스킬별로 팔찌 유/무 효율을 구해 동일 비중 평균
    const tg = (window.critTargets ? window.critTargets() : []);
    const T = tg.length ? tg : [{ cr: 0, cd: 0 }];
    const avg = (dc, dd) => T.reduce((a, t) => {
      const c = CR + t.cr, d = CD + t.cd;
      return a + (F(c, d) / F(c - dc, d - dd) - 1) * 100;
    }, 0) / T.length;
    let oldProd = 1;
    [rStat, rCr, rCd].forEach(r => { if (r) oldProd *= (1 + r.pct / 100); });
    if (rStat) rStat.pct = avg(cS, 0);
    if (rCr)   rCr.pct   = avg(oC, 0);
    if (rCd)   rCd.pct   = avg(0, oD);
    const gAll = avg(cS + oC, oD);
    const total = ((1 + bEff.totalEff / 100) / oldProd * (1 + gAll / 100) - 1) * 100;
    return { totalEff: total, rows: rows };
  } catch (e) { return bEff; }
};

window.braceletApplySpeed = function (bItem, bEff) {
  try {
    bEff = window.braceletApplyCdPenalty ? window.braceletApplyCdPenalty(bItem, bEff) : bEff;
    bEff = window.braceletApplySpec ? window.braceletApplySpec(bItem, bEff) : bEff;
    bEff = window.braceletApplyCrit ? window.braceletApplyCrit(bItem, bEff) : bEff;
    const as0 = window.__realAs, ms0 = window.__realMs;
    if (!bItem || as0 == null || ms0 == null) return bEff;
    const SPD = { asPerPct: 0.22, msPerPct: 0.11 };   // 공속 1%p당 효율 0.22% / 이속 1%p당 효율 0.11%
    const t = String(bItem.Tooltip || "").replace(/\\r\\n|\\n|\\r/g, " ").replace(/\\"/g, '"').replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
    let vFix = 0, m;
    const re = /공격\s*및\s*이동\s*속도가\s*([0-9.]+)\s*%\s*증가/g;
    while ((m = re.exec(t))) { if (/중첩/.test(t.slice(m.index, m.index + m[0].length + 30))) continue; vFix += parseFloat(m[1]); }
    const vStk = /공격\s*적중\s*시\s*매\s*초.*공격\s*및\s*이동\s*속도가\s*1\s*%\s*증가.*최대\s*6\s*중첩/.test(t) ? 6 : 0;
    if (vFix + vStk <= 0) return bEff;

    const apT = String(window.__fullData?.ArkPassive?.Title || "").replace(/\s+/g, "");
    const asBoost = ((window.__charClass === "디스트로이어" && apT.indexOf("중력수련") >= 0) ||
                     (window.__charClass === "브레이커" && apT.indexOf("수라의길") >= 0)) ? 1.4 : 1;   // 중수 디트 / 수라 브레이커: 공속 효율 ×1.4
    const lv = window.__eumLv | 0;
    // 공이속 v 를 뺀 상태와 비교한 효율(합연산: 공속 + 이속 + 돌격대장 + 음속돌파)
    const eff = (v) => {
      if (v <= 0) return 0;
      const as1 = Math.max(0, as0 - v), ms1 = Math.max(0, ms0 - v);
      const asC0 = Math.min(as0, 40), asC1 = Math.min(as1, 40), msC0 = Math.min(ms0, 40), msC1 = Math.min(ms1, 40);
      let g = (asC0 - asC1) * SPD.asPerPct * asBoost + (msC0 - msC1) * SPD.msPerPct;
      if (window.__dolDaeRate != null) g += window.__dolDaeRate * (msC0 - msC1) / 100;
      if (window.__activeEvoNode === "eum" && lv > 0 && typeof calcSonicBreakthrough === "function") {
        const a = calcSonicBreakthrough(as0, ms0, lv).evoDmg, b = calcSonicBreakthrough(as1, ms1, lv).evoDmg;
        g += ((186.9 + a) / (186.9 + b) - 1) * 100;
      }
      return g;
    };
    const gStk = eff(vStk), gFix = eff(vFix), gAll = eff(vStk + vFix);

    const rows = (bEff && bEff.rows ? bEff.rows : []).map(r => Object.assign({}, r));
    if (vStk > 0) {
      const r = rows.find(x => /무공/.test(x.name || "") && /공이속/.test(x.name || ""));
      if (r) { r.pct = ((1 + r.pct / 100) * (1 + gStk / 100) - 1) * 100; r.name = r.name.replace(/\s*\(6중첩\)\s*$/, "") + " (6중첩)"; }
      else rows.push({ name: "공격 적중 시 공이속 1% (6중첩)", pct: gStk });
    }
    if (vFix > 0) rows.push({ name: "공이속 +" + (Math.round(vFix * 100) / 100) + "%", pct: gFix });

    const base = (bEff && bEff.totalEff > 0) ? bEff.totalEff : 0;
    return { totalEff: ((1 + base / 100) * (1 + gAll / 100) - 1) * 100, rows: rows };
  } catch (e) { return bEff; }
};