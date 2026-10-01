// ===== 장비 · 악세 · 아바타 · 보석 · 카드 · 각인 · 원정대 (app-render-gear.js) =====

function getBraceletOpt(normKey) {
  var db = window.BRACELET_EFFECTS || (typeof BRACELET_EFFECTS !== "undefined" ? BRACELET_EFFECTS : null);
  if (db) { for (var cat of Object.keys(db)) { if (db[cat][normKey]) return db[cat][normKey]; } }
  if (window.BRACELET_OPTIONS_DB && window.BRACELET_OPTIONS_DB[normKey]) return window.BRACELET_OPTIONS_DB[normKey];
  return null;
}

function getGradeColorClass(grade) {
  if (grade === "상") return { cls: "sang", color: "#FE9600" };
  if (grade === "중") return { cls: "jung", color: "#A235FF" };
  if (grade === "하") return { cls: "ha", color: "#00B5FF" };
  return { cls: "none", color: "#7c88a5" };
}

function getCombatStatColor(val) {
  var v = parseInt(String(val).replace(/,/g, ""), 10) || 0;
  if (v >= 111) return "#ffd200";
  if (v >= 100) return "#a235ff";
  if (v >= 85) return "#00b5ff";
  return "#8df901";
}

function getBraceletMainStatQuality(val, itemGrade) {
  var v = parseInt(String(val).replace(/,/g, ""), 10) || 0;
  var min = (itemGrade === "고대") ? 9600 : 6400;
  var max = (itemGrade === "고대") ? 16000 : 12800;
  var pct = Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
  return Math.round(pct);
}

function getMainStatQualityColor(pct) {
  if (pct >= 100) return "#ffd200";
  if (pct >= 90) return "#a235ff";
  if (pct >= 80) return "#00b5ff";
  return "#8df901";
}

function formatBraceletOpts(body, itemGrade) {
  if (!body) return "";
  var rawLines = body.replace(/<[^>]+>/g, "\n").split("\n").map(function(s) { return s.trim(); }).filter(Boolean);
  var merged = [];
  for (var i = 0; i < rawLines.length; i++) {
    var line = rawLines[i];
    if (/^(치명|특화|신속|제압|인내|숙련|힘|민첩|지능)$/.test(line) && i + 1 < rawLines.length) {
      var next = rawLines[i + 1];
      if (/^[+-]?\d[\d,]*$/.test(next)) { line = line + " +" + next.replace(/[+-]/g, ""); i++; }
    }
    merged.push(line);
  }
  var combatStatItems = [];
  var mainStatItems = [];
  var normalizedSearch = "";
  for (var j = 0; j < merged.length; j++) {
    var ml = merged[j];
    var mainMatch = ml.match(/^(힘|민첩|지능)\s*\+?\s*([0-9,]+)$/);
    if (mainMatch) { mainStatItems.push({ name: mainMatch[1], val: mainMatch[2] }); continue; }
    var combatMatch = ml.match(/^(치명|특화|신속|제압|인내|숙련)\s*\+?\s*([0-9,]+)$/);
    if (combatMatch) { combatStatItems.push({ name: combatMatch[1], val: combatMatch[2] }); continue; }
    normalizedSearch += ml.replace(/\s+/g, "");
  }
  var allOpts = [];
  var db1 = window.BRACELET_EFFECTS || (typeof BRACELET_EFFECTS !== "undefined" ? BRACELET_EFFECTS : null);
  if (db1) { for (var cat of Object.keys(db1)) { for (var key of Object.keys(db1[cat])) { allOpts.push({ key: key, opt: db1[cat][key] }); } } }
  var db2 = window.BRACELET_OPTIONS_DB;
  if (db2) {
    for (var key2 of Object.keys(db2)) {
      var opt2 = db2[key2];
      if (opt2 && opt2["3"]) continue;
      allOpts.push({ key: key2, opt: opt2 });
    }
  }
  allOpts.sort(function(a, b) { return b.key.length - a.key.length; });
  var specialItems = [];
  for (var n = 0; n < allOpts.length; n++) {
    if (normalizedSearch.indexOf(allOpts[n].key) >= 0) {
      specialItems.push(allOpts[n].opt);
      normalizedSearch = normalizedSearch.replace(allOpts[n].key, "");
    }
  }
  var html = "";
  var boxStyle = "display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border:1px solid rgba(255,255,255,.12);border-radius:5px;background:rgba(255,255,255,.04);font-size:11px;";
  var wrapStyle = "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px;";
  var statBoxes = [];
  for (var a = 0; a < combatStatItems.length; a++) {
    var s = combatStatItems[a];
    var color = getCombatStatColor(s.val);
    statBoxes.push('<span style="' + boxStyle + '"><span style="color:#fff;font-weight:600;">' + s.name + '</span><b style="color:' + color + ';font-weight:800;">' + s.val + '</b></span>');
  }
  for (var b = 0; b < mainStatItems.length; b++) {
    var ms = mainStatItems[b];
    var pct = getBraceletMainStatQuality(ms.val, itemGrade);
    var mcolor = getMainStatQualityColor(pct);
    statBoxes.push('<span style="' + boxStyle + '"><span style="color:#fff;font-weight:600;">' + ms.name + '</span><b style="color:' + mcolor + ';font-weight:800;">' + ms.val + '</b><span style="color:var(--muted);font-size:10px;">(' + pct + '%)</span></span>');
  }
  if (statBoxes.length) html += '<div style="' + wrapStyle + '">' + statBoxes.join("") + '</div>';
  for (var c = 0; c < specialItems.length; c++) {
    var opt = specialItems[c];
    var grade = opt[itemGrade] || opt["고대"] || opt["유물"] || "";
    var g = getGradeColorClass(grade);
    var badgeStyle = "display:inline-block;min-width:20px;padding:1px 5px;border-radius:3px;font-size:10px;font-weight:800;text-align:center;background:" + g.color + "22;color:" + g.color + ";border:1px solid " + g.color + "66;";
    var badgeHtml = grade ? '<span style="' + badgeStyle + '">' + grade + '</span>' : '<span style="' + badgeStyle + '">-</span>';
    var displayName = opt.initial || "특수 옵션";
    displayName = displayName.replace(/([+\-][\d.]+%?)/g, '<b style="color:' + g.color + ';font-weight:800;">$1</b>');
    html += '<span class="line">' + badgeHtml + ' <span class="opt-name" style="color:#e7ecf6;">' + displayName + '</span></span>';
  }
  return html;
}

function renderEng(eng) {
  var list = $("engList"); if (!list) return;
  list.innerHTML = "";
  var effects = eng ? (eng.ArkPassiveEffects || []) : [];
  if ($("engSub")) $("engSub").textContent = effects.length ? effects.length + "개" : "";
  if (!effects.length) { list.innerHTML = '<div style="color:var(--muted);font-size:12px">각인 정보 없음</div>'; return; }
  for (var i = 0; i < effects.length; i++) {
    var e = effects[i];
    var g = gradeStyle(e.Grade);
    var row = document.createElement("div");
    row.className = "eng-item";
    var ic = document.createElement("div");
    ic.className = "eng-ic";
    ic.style.background = g.bg;
    ic.style.borderColor = g.c + "55";
    var iconUrl = (typeof ENGRAVE_ICONS !== "undefined" && ENGRAVE_ICONS[e.Name]) ? ENGRAVE_ICONS[e.Name] : null;
    if (iconUrl) {
      var img = document.createElement("img");
      img.src = iconUrl; img.alt = e.Name || ""; img.loading = "lazy";
      img.onerror = function() { ic.textContent = (e.Name || "?").charAt(0); ic.style.color = g.c; };
      ic.appendChild(img);
    } else {
      ic.style.color = g.c;
      ic.textContent = (e.Name || "?").charAt(0);
    }
    var mid = document.createElement("div");
    mid.className = "eng-mid";
    var nm = document.createElement("span");
    nm.className = "eng-nm";
    nm.textContent = e.Name || "-";
    nm.style.color = g.c;
    mid.appendChild(nm);
    if (e.AbilityStoneLevel != null) {
      var badge = document.createElement("span");
      badge.className = "eng-lv-badge";
      badge.appendChild(engBullet(3, 18, 13));
      var lvText = document.createElement("span");
      lvText.textContent = "Lv." + e.AbilityStoneLevel;
      badge.appendChild(lvText);
      mid.appendChild(badge);
    }
    var right = document.createElement("span");
    right.className = "eng-right";
    var pts = e.Level != null ? e.Level : 4;
    right.appendChild(engBullet(114, 27, 18));
    var xText = document.createElement("span");
    xText.textContent = "x " + pts;
    right.appendChild(xText);
    row.append(ic, mid, right);
    var relicC = (typeof GRADE !== "undefined" && GRADE["유물"]) ? GRADE["유물"].c : "#E24A00";
    var desc = e.Description || "";
    var stoneLv = e.AbilityStoneLevel;
    var stoneHtml = stoneLv != null ? '<span class="eng-tip-chip">' + engBulletHtml(3, 18, 13) + '<span class="eng-tip-chip-t">Lv.' + stoneLv + '</span></span>' : "";
    var ptsHtml = pts != null ? '<span class="eng-tip-chip">' + engBulletHtml(114, 27, 18) + '<span class="eng-tip-chip-t">x ' + pts + '</span></span>' : "";
    var tipHtml = '<div class="eng-tip-hd"><span class="eng-tip-name" style="color:' + relicC + '">' + (e.Name || "") + '</span><span class="eng-tip-chips">' + stoneHtml + ptsHtml + '</span></div>' + (desc ? '<div class="tip-bd eng-tip-bd">' + desc + '</div>' : "");
    if (desc || stoneHtml || ptsHtml) bindTip(row, tipHtml);
    list.appendChild(row);
  }
}

// 미장착 슬롯 아이콘 (공식 CDN, 배열은 좌/우 슬롯 순서)
var EQ_SLOT_CDN = "https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/";
var EMPTY_SLOT_ICON = {
  "투구": ["bg_equipment_slot1.png"],
  "어깨": ["bg_equipment_slot2.png"],
  "상의": ["bg_equipment_slot3.png"],
  "하의": ["bg_equipment_slot4.png"],
  "장갑": ["bg_equipment_slot5.png"],
  "무기": ["bg_equipment_slot6.png"],
  "완갑": ["bg_equipment_slot20.png"],
  "보주": ["bg_equipment_slot_orb.png"],
  "목걸이": ["bg_equipment_slot7.png"],
  "귀걸이": ["bg_equipment_slot8.png", "bg_equipment_slot9.png"],
  "반지": ["bg_equipment_slot10.png", "bg_equipment_slot11.png"],
  "어빌리티 스톤": ["bg_equipment_slot12.png"],
  "팔찌": ["bg_equipment_slot19.png"],
};
var EMPTY_SLOT_OVERLAY = { "보주": "bg_equipment_slot_orb_over.png" };

function makeEmptySlotIcon(type, idx) {
  var wrap = document.createElement("div");
  wrap.style.cssText = "position:relative;width:45px;height:45px;line-height:0;";
  var fallback = function() {
    wrap.innerHTML = "";
    wrap.style.cssText = "width:45px;height:45px;background:rgba(255,255,255,0.03);border:1px dashed rgba(255,255,255,0.1);border-radius:4px;display:flex;align-items:center;justify-content:center;color:var(--muted-2);font-size:9px;line-height:normal;";
    wrap.textContent = type;
  };
  var files = EMPTY_SLOT_ICON[type];
  if (!files) { fallback(); return wrap; }
  var img = new Image();
  img.alt = type;
  img.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;";
  img.onerror = fallback;
  img.src = EQ_SLOT_CDN + files[Math.min(idx || 0, files.length - 1)];
  wrap.appendChild(img);
  if (EMPTY_SLOT_OVERLAY[type]) {
    var ov = new Image();
    ov.alt = "";
    ov.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;";
    ov.src = EQ_SLOT_CDN + EMPTY_SLOT_OVERLAY[type];
    wrap.appendChild(ov);
  }
  return wrap;
}

function renderGear(list, avatarList) {
  var eqList = $("eqList"), accList = $("accList");
  if (!eqList || !accList) return;
  eqList.innerHTML = ""; accList.innerHTML = "";
  var armors = list.filter(function(x) { return ARMOR.indexOf(x.Type) >= 0; }).sort(function(a, b) { return ORDER.indexOf(a.Type) - ORDER.indexOf(b.Type); });
  var extras = list.filter(function(x) { return ARMOR_EXTRA.indexOf(x.Type) >= 0; }).sort(function(a, b) { return ARMOR_EXTRA.indexOf(a.Type) - ARMOR_EXTRA.indexOf(b.Type); });
  var eqAll = armors.concat(extras);
  var accs = list.filter(function(x) { return ACC.indexOf(x.Type) >= 0; });

  // 고정 슬롯 순서대로 배치 (장착 아이템이 있으면 그 자리에, 없으면 빈 슬롯)
  function arrangeBySlots(equipped, slotOrder) {
    var pool = equipped.slice();
    var seen = {};
    var out = [];
    for (var i = 0; i < slotOrder.length; i++) {
      var t = slotOrder[i];
      var nth = seen[t] || 0;
      seen[t] = nth + 1;
      var idx = -1;
      for (var k = 0; k < pool.length; k++) { if (pool[k].Type === t) { idx = k; break; } }
      if (idx >= 0) out.push(pool.splice(idx, 1)[0]);
      else out.push({ Type: t, Name: "", Icon: "", Grade: "", Tooltip: "", SlotIdx: nth });
    }
    return out.concat(pool); // 정의되지 않은 타입은 뒤에 그대로
  }
  var allSlots = ["투구", "어깨", "상의", "하의", "장갑", "무기", "완갑", "보주"];
  eqAll = arrangeBySlots(eqAll, allSlots);
  var accSlots = ["목걸이", "귀걸이", "귀걸이", "반지", "반지", "어빌리티 스톤", "팔찌"];
  accs = arrangeBySlots(accs, accSlots);

  // 특수 장비(나침반/부적/문장): 보주 행 오른쪽에 구분선과 함께 표시
  function makeSpDivider() {
    var dv = document.createElement("span");
    dv.className = "sp-divider";
    return dv;
  }
  function buildSpecialBlock() {
    var box = document.createElement("div");
    box.className = "sp-inline";
    var specials = list.filter(function(x) { return SPECIAL_EQ.indexOf(x.Type) >= 0; });
    var lab = document.createElement("span");
    lab.className = "sp-label";
    lab.textContent = "특수 장비";
    box.appendChild(lab);
    for (var t = 0; t < SPECIAL_EQ.length; t++) {
      var item = specials.find(function(s) { return s.Type === SPECIAL_EQ[t]; });
      if (item) {
        var img = document.createElement("img");
        img.className = "sp-icon";
        img.src = item.Icon || "";
        img.alt = item.Name || SPECIAL_EQ[t];
        img.loading = "lazy";
        var gs = gradeStyle(item.Grade);
        img.style.borderColor = gs.c + "55";
        img.style.background = gs.bg;
        bindTip(img, buildTipHtml(item.Tooltip, item.Name));
        box.appendChild(img);
      } else {
        var empty = document.createElement("div");
        empty.className = "sp-empty";
        empty.textContent = "·";
        box.appendChild(empty);
      }
    }
    return box;
  }

  for (var i = 0; i < eqAll.length; i++) {
    var eq = eqAll[i];
    if (!eq.Icon) {
      var emptyRow = document.createElement("div");
      emptyRow.className = "item-row";
      var emptyWrap = document.createElement("div");
      emptyWrap.className = "item-ic-wrap";
      emptyWrap.style.position = "relative";
      emptyWrap.style.lineHeight = "0";
      emptyWrap.appendChild(makeEmptySlotIcon(eq.Type, 0));
      var emptyMid = document.createElement("div");
      emptyMid.className = "item-mid";
      emptyMid.style.marginLeft = "8px";
      var emptyNm = document.createElement("div");
      emptyNm.className = "item-nm";
      emptyNm.style.color = "var(--muted-2)";
      emptyNm.textContent = "미장착";
      var emptySb = document.createElement("div");
      emptySb.className = "item-sb";
      emptySb.textContent = eq.Type;
      emptyMid.append(emptyNm, emptySb);
      emptyRow.append(emptyWrap, emptyMid);
      if (eq.Type === "보주") emptyRow.append(makeSpDivider(), buildSpecialBlock());
      eqList.appendChild(emptyRow);
      continue;
    }
    var tip = parseTip(eq.Tooltip);
    var qv = tipQuality(tip);
    var g = gradeStyle(eq.Grade);
    var row = document.createElement("div");
    row.className = "item-row";
    var hasBorder = BORDER_TYPES.has(eq.Type);
    if (eq.Type === "완갑") {
      var cleanName = String(eq.Name || "").replace(/<[^>]+>/g, "");
      var upgradeMatch = cleanName.match(/\+(\d+)/);
      var level = upgradeMatch ? parseInt(upgradeMatch[1], 10) : 0;
      if (level < 20) hasBorder = false;
    }
    var iconWrap = makeIconWithQuality(eq.Icon, qv, g.bg, g.c + "44", hasBorder);
    var mid = document.createElement("div"); mid.className = "item-mid";
    mid.style.marginLeft = "8px";
    var nm = document.createElement("div");
    nm.className = "item-nm";
    nm.style.color = g.c;
    nm.style.marginLeft = "8px";
    nm.textContent = eq.Name || eq.Type;
    var sb = document.createElement("div"); sb.className = "item-sb";
    sb.style.marginLeft = "8px";
    sb.textContent = eq.Type;
    mid.append(nm, sb);
    var orbMeta = null, nir = null;
    if (eq.Type === "보주") {
      nir = parseOrbNirvana(tip, eq.Tooltip);
      if (nir) {
        orbMeta = document.createElement("div");
        orbMeta.className = "orb-meta";
        orbMeta.textContent = "시즌" + nir.season + ": " + formatNirvana(nir.value);
      }
    }
    var tag = document.createElement("span");
    tag.className = "item-tag";
    tag.textContent = eq.Grade || "";
    tag.style.color = g.c;
    tag.style.borderColor = g.c + "55";
    tag.style.background = g.bg;
    if (eq.Type === "보주") {
      // 시즌 태그는 아이콘 위에 표시, 등급 태그/누적 수치는 표시하지 않음
      if (nir) {
        iconWrap.style.position = "relative";
        var seasonTag = document.createElement("span");
        seasonTag.className = "orb-season";
        seasonTag.textContent = "시즌 " + nir.season;
        iconWrap.appendChild(seasonTag);
      }
      row.append(iconWrap, mid);
    } else {
      row.append(iconWrap, mid, tag);
    }
    if (eq.Type === "보주") {
      row.append(makeSpDivider(), buildSpecialBlock());
      var orbTip = buildTipHtml(eq.Tooltip, eq.Name);   // 특수 장비 툴팁과 겹치지 않도록 보주 부분에만 연결
      bindTip(iconWrap, orbTip); bindTip(mid, orbTip);
    } else {
      bindTip(row, buildTipHtml(eq.Tooltip, eq.Name));
    }
    eqList.appendChild(row);
  }

  var spEl = $("specialEq");
  if (spEl) { spEl.innerHTML = ""; spEl.style.display = "none"; }

  for (var j = 0; j < accs.length; j++) {
    var eq2 = accs[j];
    var tip2 = parseTip(eq2.Tooltip);
    var qv2 = tipQuality(tip2);
    var parts = tipParts(tip2);
    var g2 = gradeStyle(eq2.Grade);
    var row2 = document.createElement("div");
    row2.className = "item-row";

    var accBorderImg = "";
    if (eq2.Type === "팔찌") {
      accBorderImg = "https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/bg_equipment_arkpassive3.png";
    } else if (eq2.Type === "목걸이" || eq2.Type === "귀걸이" || eq2.Type === "반지" || eq2.Type === "어빌리티 스톤") {
      accBorderImg = "https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/bg_equipment_arkpassive2.png";
    }

    if (!eq2.Icon) {
      var emptyRow2 = document.createElement("div");
      emptyRow2.className = "item-row";
      var emptyWrap2 = document.createElement("div");
      emptyWrap2.className = "item-ic-wrap";
      emptyWrap2.style.position = "relative";
      emptyWrap2.style.lineHeight = "0";
      emptyWrap2.appendChild(makeEmptySlotIcon(eq2.Type, eq2.SlotIdx || 0));
      var emptyMid2 = document.createElement("div");
      emptyMid2.className = "item-mid";
      emptyMid2.style.marginLeft = "19px";
      var emptyNm2 = document.createElement("div");
      emptyNm2.className = "item-nm";
      emptyNm2.style.color = "var(--muted-2)";
      emptyNm2.textContent = "미장착";
      emptyMid2.appendChild(emptyNm2);
      emptyRow2.append(emptyWrap2, emptyMid2);
      accList.appendChild(emptyRow2);
      continue;
    }

    var iconWrap2 = makeIconWithQuality(eq2.Icon, qv2, g2.bg, g2.c + "44", false, accBorderImg);
    var mid2 = document.createElement("div"); mid2.className = "item-mid";
    var opts = document.createElement("div"); opts.className = "item-opts";
    opts.style.marginLeft = "19px";

    if (eq2.Type === "팔찌") {
      var br = parts.find(function(p) { return /팔찌\s*효과/.test(p.title); });
      opts.innerHTML = br ? formatBraceletOpts(br.body, eq2.Grade) : (eq2.Name || "팔찌");
      opts.style.paddingLeft = "12px";

      var bag = sumGearStats(window.__fullData ? (window.__fullData.ArmoryEquipment || []) : []);
      var engBag = sumEngraveEffects(window.__fullData ? window.__fullData.ArmoryEngraving : null);
      var finalCritRate = window.__realCritRate || 75;
      var finalCritDmg = window.__realCritDmg || (200 + (bag.critDmg || 0) + (engBag.critDmg || 0));

      var braceletEff = calcBraceletEfficiency(eq2, {
        critRate: finalCritRate,
        critDmg: finalCritDmg,
        weaponAtk: bag.weaponAtk || 265000,
        mainStat: bag.mainStat || 500000,
        extraDmg: bag.extraDmg || 39.5
      });

      if (braceletEff && braceletEff.totalEff > 0) {
        var effVal = braceletEff.totalEff;
        var effColor = "#ffffff";
        var effGlow = "rgba(255,255,255,0.08)";
        if (effVal >= 17) { effColor = "#FFD200"; effGlow = "rgba(255,210,0,0.25)"; }
        else if (effVal >= 14) { effColor = "#A235FF"; effGlow = "rgba(162,53,255,0.25)"; }
        else if (effVal >= 11) { effColor = "#00B5FF"; effGlow = "rgba(0,181,255,0.25)"; }
        else if (effVal >= 8) { effColor = "#8DF901"; effGlow = "rgba(141,249,1,0.25)"; }

        iconWrap2.style.display = "flex";
        iconWrap2.style.flexDirection = "column";
        iconWrap2.style.alignItems = "center";
        iconWrap2.style.overflow = "visible";
        iconWrap2.style.width = "auto";

        var effBadge = document.createElement("div");
        effBadge.className = "bracelet-eff-badge";
        effBadge.style.cssText = "display:inline-block;width:fit-content;margin:6px auto 0 auto;padding:3px 8px;background:" + effGlow + ";color:#ffffff;font-size:12px;font-weight:800;text-align:center;border-radius:4px;line-height:1.3;box-shadow:0 1px 4px rgba(0,0,0,.4);border:1px solid " + effColor + "80;cursor:help;letter-spacing:-0.2px;white-space:nowrap;";
        effBadge.textContent = effVal.toFixed(2) + "%";

        var tooltipHtml = '<div class="tip-hd">📿 팔찌 옵션별 효율</div><div class="tip-bd" style="padding:6px 0 2px 0;">';
        for (var r = 0; r < braceletEff.rows.length; r++) {
          tooltipHtml += '<div style="display:flex;justify-content:space-between;gap:40px;font-size:11px;margin-bottom:5px;line-height:1.4;"><span style="color:#e7ecf6;">' + braceletEff.rows[r].name + '</span><b style="color:#ffd200;">+' + braceletEff.rows[r].pct.toFixed(2) + '%</b></div>';
        }
        tooltipHtml += '</div>';
        bindTip(effBadge, tooltipHtml);

        effBadge.addEventListener("mouseenter", function() {
          var t = document.getElementById("loa-tip");
          if (t) { t.style.setProperty("min-width", "360px", "important"); t.style.setProperty("max-width", "500px", "important"); }
        });
        effBadge.addEventListener("mouseleave", function() {
          var t = document.getElementById("loa-tip");
          if (t) { t.style.removeProperty("min-width"); t.style.removeProperty("max-width"); }
        });
        iconWrap2.appendChild(effBadge);
      }
    } else if (eq2.Type === "어빌리티 스톤") {
      var title = document.createElement("div");
      title.className = "item-nm";
      title.style.color = g2.c;
      title.textContent = eq2.Name || "어빌리티 스톤";
      var engs = parseStoneEngraves(tip2).filter(function(en) { return !en.bonus; });
      if (!engs.length) {
        var blob = typeof eq2.Tooltip === "string" ? eq2.Tooltip : JSON.stringify(tip2 || {});
        var re = /\[([^\]]+)\][\s\S]*?Lv\.?\s*(\d+)/gi;
        var m; var seen = new Set();
        while ((m = re.exec(blob))) {
          var name = strip(m[1]);
          if (!name || seen.has(name)) continue;
          seen.add(name);
          var neg = /감소|FE2E2E/.test(m[0]);
          engs.push({ name: name, lv: parseInt(m[2], 10), neg: neg, bonus: false });
        }
      }
      var line = document.createElement("div");
      line.className = "stone-compact";
      for (var ei = 0; ei < engs.length; ei++) {
        var en = engs[ei];
        var span = document.createElement("span");
        span.className = en.neg ? "sc-neg" : "sc-pos";
        span.innerHTML = en.name + " <b>" + (en.lv != null ? en.lv : "") + "</b>";
        line.appendChild(span);
      }
      opts.appendChild(title);
      if (engs.length) opts.appendChild(line);
      var posSum = engs.filter(function(en) { return !en.neg; }).reduce(function(s, en) { return s + (en.lv || 0); }, 0);
      var allEngs = parseStoneEngraves(tip2);
      var bonusFromTip = allEngs.find(function(en) { return en.bonus; });
      if (posSum >= 5 || bonusFromTip) {
        var bonus = document.createElement("div");
        bonus.className = "stone-bonus";
        bonus.textContent = (bonusFromTip && bonusFromTip.name) ? bonusFromTip.name : "공격력 +1.5%";
        opts.appendChild(bonus);
      }
    } else {
      var polish = parts.find(function(p) { return /연마|추가 효과/.test(p.title); });
      opts.innerHTML = polish ? formatAccOpts(polish.body) : formatPlainLines(((parts.find(function(p) { return /기본/.test(p.title); })) || {}).body || eq2.Name || eq2.Type);
    }
    mid2.appendChild(opts);
    var qq = document.createElement("div");
    qq.className = "item-tag";
    qq.textContent = eq2.Grade || "";
    qq.style.color = g2.c;
    qq.style.borderColor = g2.c + "55";
    qq.style.background = g2.bg;
    row2.append(iconWrap2, mid2, qq);
    bindTip(row2, buildTipHtml(eq2.Tooltip, eq2.Name));
    accList.appendChild(row2);
  }
}

function renderAvatars(list) {
  var el = $("avList"); if (!el) return;
  el.innerHTML = "";
  if (!list || !list.length) { el.innerHTML = '<div style="color:var(--muted);font-size:12px">아바타 없음</div>'; return; }
  var order = [
    { key: "머리", types: ["머리 아바타"] },
    { key: "얼굴1", types: ["얼굴1 아바타"] },
    { key: "얼굴2", types: ["얼굴2 아바타"] },
    { key: "상의", types: ["상의 아바타"] },
    { key: "하의", types: ["하의 아바타"] },
    { key: "무기", types: ["무기 아바타"] },
    { key: "이동효과", types: ["이동 효과", "이동효과"] }
  ];
  function pick(types, grade) {
    return list.find(function(a) {
      var t = a.Type || "";
      if (a.Grade !== grade) return false;
      return types.some(function(k) { return t === k || t.indexOf(k) >= 0; });
    }) || null;
  }
  function optText(av) {
    if (!av || !av.Tooltip) return "";
    var tip = parseTip(av.Tooltip);
    if (!tip) return "";
    for (var k of Object.keys(tip)) {
      var v = tip[k];
      if (v && v.type === "ItemPartBox" && v.value) {
        var body = strip(v.value.Element_001 || "");
        if (/\+/.test(body)) return body.replace(/\s+/g, " ");
      }
    }
    return "";
  }
  function fillSlot(parent, av) {
    if (!av) {
      parent.innerHTML = '<div class="sp-empty" style="width:36px;height:36px">·</div><div class="meta"><div class="nm" style="color:var(--muted-2)">미착용</div></div>';
      return;
    }
    var g = gradeStyle(av.Grade);
    var img = document.createElement("img");
    img.src = av.Icon || ""; img.alt = ""; img.loading = "lazy";
    img.style.background = g.bg; img.style.borderColor = g.c + "55";
    var meta = document.createElement("div"); meta.className = "meta";
    var opt = document.createElement("div"); opt.className = "opt";
    opt.style.color = g.c;
    opt.textContent = optText(av) || (av.Grade || "");
    meta.append(opt);
    parent.append(img, meta);
    bindTip(parent, buildTipHtml(av.Tooltip, av.Name));
  }
  for (var i = 0; i < order.length; i++) {
    var slot = order[i];
    var row = document.createElement("div");
    row.className = "av-row";
    var left = document.createElement("div"); left.className = "av-slot";
    var right = document.createElement("div"); right.className = "av-slot";
    fillSlot(left, pick(slot.types, "전설"));
    fillSlot(right, pick(slot.types, "영웅"));
    row.append(left, right);
    var badge = document.createElement("div");
    badge.style.cssText = "font-size:10px;font-weight:800;color:var(--muted);width:28px;flex-shrink:0;";
    badge.textContent = slot.key;
    left.prepend(badge);
    el.appendChild(row);
  }
}

// 보석 계열명 → 해당 슬롯의 스킬들 (기본 + 변신 스킬은 보석을 공유)
// 왼쪽: 보석 툴팁에 나오는 이름 / 오른쪽: 실제 스킬 이름들
var GEM_SKILL_FAMILIES = {
  "리벤지 블로우 계열": ["리벤지 블로우", "리벤지 스피어"],
  "스피닝 플레임 계열": ["스피닝 플레임", "아바돈 플레임"],
  "윙 스팅어 계열": ["윙 스팅어", "윙 래시"],
  "블레이즈 스윕 계열": ["블레이즈 스윕", "블레이즈 플래시"],
  "렌딩 피니셔 계열": ["렌딩 피니셔", "익스플로전 피니셔"]
};
function gemNorm(n) { return String(n == null ? "" : n).replace(/\s+/g, ""); }
// 정규화된 이름(계열명, 각 스킬명) → 스킬 이름 배열
var GEM_FAMILY_INDEX = (function () {
  var idx = {};
  Object.keys(GEM_SKILL_FAMILIES).forEach(function (label) {
    var members = GEM_SKILL_FAMILIES[label] || [];
    var group = members.slice();
    idx[gemNorm(label)] = group;
    members.forEach(function (m) { idx[gemNorm(m)] = group; });
  });
  return idx;
})();

// 스킬 API 목록에 없는 스킬(변신 후 Z 스킬 등)의 아이콘을 직접 지정
// 키: 스킬 이름 (공백 무시), 값: 이미지 경로 또는 URL
var GEM_SKILL_ICON_FALLBACK = {
};
var GEM_SKILL_ICON_FALLBACK_N = (function () {
  var o = {};
  Object.keys(GEM_SKILL_ICON_FALLBACK).forEach(function (k) { o[gemNorm(k)] = GEM_SKILL_ICON_FALLBACK[k]; });
  return o;
})();

function renderGems(gemData, skills) {
  var el = $("gemList"); if (!el) return;
  el.innerHTML = "";
  var gems = gemData ? (gemData.Gems || []) : [];
  var skillIcon = {};
  for (var i = 0; i < (skills || []).length; i++) {
    var s = skills[i];
    if (s.Name && s.Icon) { skillIcon[s.Name] = s.Icon; skillIcon["\u0000" + s.Name.replace(/\s+/g, "")] = s.Icon; }
  }
  // 이름 → 아이콘: 정확히 일치 → 공백 무시 → 계열(기본/변신 스킬) 순으로 탐색
  function findSkillIcon(name) {
    if (!name) return "";
    if (skillIcon[name]) return skillIcon[name];
    var n = gemNorm(name);
    if (skillIcon["\u0000" + n]) return skillIcon["\u0000" + n];
    var group = GEM_FAMILY_INDEX[n];
    if (group) {
      for (var gi = 0; gi < group.length; gi++) {
        var ic = skillIcon[group[gi]] || skillIcon["\u0000" + gemNorm(group[gi])];
        if (ic) return ic;
      }
    }
    return GEM_SKILL_ICON_FALLBACK_N[n] || "";
  }
  var dmg = [], cool = [];
  for (var j = 0; j < gems.length; j++) {
    if (gemIsCooldown(gems[j])) cool.push(gems[j]); else dmg.push(gems[j]);
  }
  var baseAtkPct = 0;
  for (var k = 0; k < gems.length; k++) {
    var tip = parseTip(gems[k].Tooltip);
    var blob = tip ? JSON.stringify(tip) : "";
    var m = blob.match(/기본 공격력\s*([0-9.]+)\s*%/);
    if (m) baseAtkPct += parseFloat(m[1]) || 0;
  }
  if ($("gemSub")) $("gemSub").textContent = "딜증 " + dmg.length + " · 쿨감 " + cool.length;
  var wrap = document.createElement("div");
  wrap.className = "gem-wrap";
  // 보석 슬롯 고정 배치: 총 11칸, 피해 6 / 쿨감 5 기본 (장착 수가 더 많으면 그쪽 우선)
  var GEM_SLOT_MAX = 11;
  var dmgSlots = 0, coolSlots = 0;
  if (gemData) {
    dmgSlots = Math.max(dmg.length, Math.min(6, GEM_SLOT_MAX - cool.length));
    coolSlots = Math.max(cool.length, GEM_SLOT_MAX - dmgSlots);
  }
  function addGroup(glist, label, cls, slots) {
    if (!glist.length && !slots) return;
    var grp = document.createElement("div");
    grp.className = "gem-group";
    var lab = document.createElement("span");
    lab.className = "gem-group-label " + cls;
    lab.textContent = label;
    grp.appendChild(lab);
    for (var i = 0; i < glist.length; i++) {
      var g = glist[i];
      var gs = gradeStyle(g.Grade);
      var cell = document.createElement("div"); cell.className = "gem";
      cell.style.borderColor = gs.c + "55";
      cell.style.background = gs.bg;
      var sk = parseGemSkillName(g);
      var skIcon = sk && findSkillIcon(sk);
      if (!skIcon && !(window.SPECIAL_SKILL_ICONS && window.SPECIAL_SKILL_ICONS[sk])) {
        console.warn("[gem] 스킬 아이콘 매칭 실패:", strip(g.Name), "| 추출된 스킬명:", sk, "| 스킬 목록에 있음:", (skills || []).some(function (x) { return gemNorm(x.Name) === gemNorm(sk); }));
      }
      if (!skIcon && sk && window.SPECIAL_SKILL_ICONS && window.SPECIAL_SKILL_ICONS[sk]) {
        var special = window.SPECIAL_SKILL_ICONS[sk];
        skIcon = typeof special === "string" ? special : (special[window.__charClass] || "");
      }
      if (skIcon) {
        var simg = document.createElement("img");
        simg.className = "gem-skill"; simg.src = skIcon; simg.alt = sk || ""; simg.loading = "lazy";
        cell.appendChild(simg);
      } else if (g.Icon) {
        var bg = document.createElement("img");
        bg.className = "gem-skill"; bg.src = g.Icon; bg.alt = ""; bg.loading = "lazy";
        cell.appendChild(bg);
      }
      if (g.Icon && skIcon) {
        var badge = document.createElement("img");
        badge.className = "gem-badge g-" + g.Grade; badge.src = g.Icon; badge.alt = ""; badge.loading = "lazy";
        cell.appendChild(badge);
      }
      var lv = document.createElement("span"); lv.className = "lv"; lv.textContent = g.Level != null ? g.Level : "";
      cell.appendChild(lv);
      bindTip(cell, buildTipHtml(g.Tooltip, strip(g.Name)));
      grp.appendChild(cell);
    }
    // 미장착 칸: 보석이 들어갈 자리를 그대로 유지
    for (var e = glist.length; e < slots; e++) {
      var empty = document.createElement("div");
      empty.className = "gem gem-slot-empty";
      empty.textContent = "·";
      grp.appendChild(empty);
    }
    wrap.appendChild(grp);
  }
  addGroup(dmg, "피해", "dmg", dmgSlots);
  addGroup(cool, "쿨감", "cool", coolSlots);
  if (baseAtkPct > 0) {
    var atk = document.createElement("div");
    atk.className = "gem-atk";
    atk.textContent = "기본 공격력 " + baseAtkPct.toFixed(2) + "%";
    wrap.appendChild(atk);
  }
  el.appendChild(wrap);
}

// 카드 등급 → 공식 프레임 스프라이트(img_card_grade.png, 가로 6칸) 인덱스
// 스프라이트 순서: 0 일반(회색) · 1 고급(초록) · 2 희귀(파랑) · 3 영웅(보라) · 4 전설(주황) · 5 (미사용)
var CARD_FRAME_COUNT = 6;
var CARD_GRADE_TIER = {
  "\uC77C\uBC18": 0, // 일반
  "\uACE0\uAE09": 1, // 고급
  "\uD76C\uADC0": 2, // 희귀
  "\uC601\uC6C5": 3, // 영웅
  "\uC804\uC124": 4  // 전설
};
// 카드 등급 → 이름 텍스트 색상 (기존 UI 등급 색상 기준)
var CARD_GRADE_COLOR = {
  "\uC77C\uBC18": "#c9ced8", // 일반
  "\uACE0\uAE09": "#8DF901", // 고급
  "\uD76C\uADC0": "#00B5FF", // 희귀
  "\uC601\uC6C5": "#A235FF", // 영웅
  "\uC804\uC124": "#FE9600"  // 전설
};
var CARD_FRAME_SPRITE = "https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/profile/img_card_grade.png";
var CARD_GEM_SPRITE = "https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/profile/img_profile_awake.png";
var CARD_GEM_COLS = 5; // 실측: 보석 스프라이트 120px ÷ 5칸(24px)

var CARD_ATTR_ICON = {
  "성": "img/card-icon-light.png",
  "암": "img/card-icon-dark.png",
  "화": "img/card-icon-fire.png",
  "수": "img/card-icon-water.png",
  "토": "img/card-icon-earth.png",
  "뇌": "img/card-icon-lightning.png",
};

// 카드 세트명 → 속성 (딜러용 / 서포터용)
var CARD_SET_ATTR = {
  // 딜러용
  "세상을 구하는 빛": "성",
  "카제로스의 군단장": "암",
  "날랜 뇌전의 숨결": "뇌",
  "굳센 대지의 숨결": "토",
  "거센 파도의 숨결": "수",
  "힘찬 화염의 숨결": "화",
  // 서포터용
  "남겨진 바람의 절벽": "성",
  "신념의 길": "암",
  "몰아치는 뇌전의 가호": "뇌",
  "잠재우는 대지의 가호": "토",
  "노래하는 파도의 가호": "수",
  "피어나는 화염의 가호": "화",
};
function detectCardSetAttr(name) {
  var n = String(name || "").replace(/\s+/g, "");
  var keys = Object.keys(CARD_SET_ATTR);
  for (var i = 0; i < keys.length; i++) {
    if (n.indexOf(keys[i].replace(/\s+/g, "")) >= 0) return CARD_SET_ATTR[keys[i]];
  }
  return "";
}

// 세우라제(세 우마르가 오리라 + 라제니스의 운명) 조합 감지
// 둘 다 장착돼 있을 때만 전용 뱃지를 보여주기 위한 헬퍼
function detectSeUraje(effects, cards) {
  var ori = 0, laje = 0, oriBase = false, lajeBase = false, slots = [];
  (effects || []).forEach(function (eff) {
    var touched = false;
    (eff.Items || []).forEach(function (it) {
      var n = String(it.Name || "");
      var mO = n.match(/\uC138\s*\uC6B0\uB9C8\uB974\uAC00\s*\uC624\uB9AC\uB77C.*?\((\d+)\s*\uAC01\uC131\uD569\uACC4\)/); // 세 우마르가 오리라 (...각성합계)
      var mL = n.match(/\uB77C\uC81C\uB2C8\uC2A4\uC758\s*\uC6B4\uBA85.*?\((\d+)\s*\uAC01\uC131\uD569\uACC4\)/); // 라제니스의 운명 (...각성합계)
      if (mO) { ori = Math.max(ori, parseInt(mO[1], 10)); touched = true; }
      else if (/\uC138\s*\uC6B0\uB9C8\uB974\uAC00\s*\uC624\uB9AC\uB77C/.test(n)) { oriBase = true; touched = true; }
      if (mL) { laje = Math.max(laje, parseInt(mL[1], 10)); touched = true; }
      else if (/\uB77C\uC81C\uB2C8\uC2A4\uC758\s*\uC6B4\uBA85/.test(n)) { lajeBase = true; touched = true; }
    });
    if (touched) slots = slots.concat(eff.CardSlots || []);
  });
  if (!oriBase || !lajeBase) return null; // 둘 다 있어야 세우라제로 인정
  var minSlot = slots.length ? Math.min.apply(null, slots) : null;
  var firstCard = minSlot != null ? (cards || []).filter(function (c) { return c.Slot === minSlot; })[0] : null;
  return { ori: ori, laje: laje, icon: firstCard ? (firstCard.Icon || "") : "" };
}

function renderCards(cardData) {
  var listEl = $("cardList"), titleEl = $("cardTitle"), infoEl = $("cardInfo");
  if (!listEl) return;
  listEl.innerHTML = "";
  if (infoEl) infoEl.innerHTML = "";
  var cards = cardData ? (cardData.Cards || []) : [];
  var effects = cardData ? (cardData.Effects || []) : [];
  var awakeSum = 0;
  for (var i = 0; i < cards.length; i++) awakeSum += (cards[i].AwakeCount || 0);
  var items = [];
  for (var j = 0; j < effects.length; j++) { for (var it of (effects[j].Items || [])) items.push(it); }
  var seuraje = detectSeUraje(effects, cards);
  var setBase = "카드";
  if (items.length) setBase = (items[0].Name || "").replace(/\s*\d*세트.*$/, "").trim() || "카드";
  var setLabel = seuraje ? "\uC138\uC6B0\uB77C\uC81C" : (setBase + (awakeSum ? " " + awakeSum + "각" : ""));
  if (titleEl) titleEl.textContent = "카드";
  var tipBody = items.map(function(it) { return '<div class="tip-line">' + strip(it.Name || "") + ' — ' + strip(it.Description || "") + '</div>'; }).join("");
  var tipHtml = tipBody ? '<div class="tip-hd">' + setLabel + '</div><div class="tip-bd">' + tipBody + '</div>' : "";
  for (var k = 0; k < cards.length; k++) {
    var c = cards[k];
    if (!c.Icon) continue;
    var cell = document.createElement("div");
    cell.className = "card-cell";
    var thumbWrap = document.createElement("div");
    thumbWrap.className = "card-thumb-wrap";

    var img = document.createElement("img");
    img.className = "card-thumb";
    img.src = c.Icon; img.alt = c.Name || ""; img.loading = "lazy";

    var gradeKey = String(c.Grade || "").trim();
    var tierIdx = CARD_GRADE_TIER[gradeKey];
    var frame = document.createElement("div");
    frame.className = "card-frame";
    if (tierIdx != null) {
      frame.style.backgroundImage = "url(" + CARD_FRAME_SPRITE + ")";
      frame.style.backgroundPosition = (tierIdx / (CARD_FRAME_COUNT - 1) * 100) + "% 0%";
    }

    var nameTag = document.createElement("div");
    nameTag.className = "card-name-tag";
    nameTag.textContent = c.Name || "";
    nameTag.style.color = CARD_GRADE_COLOR[gradeKey] || "#eef1f8";

    // 낱개로 자르지 않고, 공식 사이트처럼 "꽉 찬 줄" 이미지를 통째로 쓰고
    // 미달성분만 오른쪽에서 꺼짐(회색) 줄로 덮는 방식 (오벌 장식이 잘리지 않음)
    var gems = document.createElement("div");
    gems.className = "card-gems";
    var total = c.AwakeTotal || 5;
    var on = c.AwakeCount || 0;
    var rowW = 65; // px, thumbWrap 실제 폭(72px) 기준 89.6%
    var rowH = rowW * (36 / 120); // 실측 원본 비율 유지

    var onLayer = document.createElement("div");
    onLayer.className = "gem-row gem-row-on";
    onLayer.style.backgroundImage = "url(" + CARD_GEM_SPRITE + ")";
    onLayer.style.backgroundSize = rowW + "px " + (rowH * 2) + "px";
    onLayer.style.backgroundPosition = "0px " + (-rowH) + "px";
    gems.appendChild(onLayer);

    if (on < total) {
      var offW = rowW * ((total - on) / total);
      var offLayer = document.createElement("div");
      offLayer.className = "gem-row gem-row-off";
      offLayer.style.width = offW + "px";
      offLayer.style.backgroundImage = "url(" + CARD_GEM_SPRITE + ")";
      offLayer.style.backgroundSize = rowW + "px " + (rowH * 2) + "px";
      offLayer.style.backgroundPosition = (-(rowW - offW)) + "px 0px";
      gems.appendChild(offLayer);
    }

    thumbWrap.append(img, frame, nameTag, gems);
    cell.append(thumbWrap);
    bindTip(cell, tipHtml || '<div class="tip-hd">' + (c.Name || "") + '</div>');
    listEl.appendChild(cell);
  }
  if (infoEl) {
    var attrs = ["성", "암", "화", "수", "토", "뇌"];
    var firstIcon = (seuraje && seuraje.icon) || (cards[0] && cards[0].Icon) || "";
    var activeAttr = detectCardSetAttr(setBase);
    // 세트 효과 이름의 "(N각성합계)" 중 가장 높은 단계 = 현재 도달한 각성 단계(12/18/24/30)
    var tier = 0;
    items.forEach(function(it) {
      var m = String(it.Name || "").match(/\((\d+)\s*각/);
      if (m) tier = Math.max(tier, parseInt(m[1], 10));
    });
    var awakeVal = tier || Math.min(awakeSum, 30);
    // 장착 세트의 속성 칸에만 값 표시, 나머지는 "-"
    var tiles = attrs.map(function(a) {
      var icon = CARD_ATTR_ICON[a] || "";
      var isOn = (a === activeAttr);
      var v = isOn ? (awakeVal || "-") : "-";
      return '<div class="ci-tile' + (isOn ? ' on' : ' zero') + '">' +
        (icon ? '<img src="' + icon + '" alt="' + a + '">' : '<span class="ci-tile-dot"></span>') +
        '<span class="ci-tile-val">' + v + '</span>' +
        '<span class="ci-tile-label">' + a + '</span>' +
        '</div>';
    }).join("");
    var fxBody = items.map(function(it) {
      return '<div class="ci-fx-line"><b>' + strip(it.Name || "") + '</b><span>' + strip(it.Description || "") + '</span></div>';
    }).join("");
    var setBadgeHtml = seuraje ? (
      '<div class="ci-set-badge">' +
        '<div class="ci-set-badge-name">\uC138\uC6B0\uB77C\uC81C ' + seuraje.ori + '+' + seuraje.laje + '\uAC01</div>' +
        '<div class="ci-set-badge-sub">\uC138 \uC6B0\uB9C8\uB974\uAC00 \uC624\uB9AC\uB77C ' + seuraje.ori + '\uAC01 \u00B7 \uB77C\uC81C\uB2C8\uC2A4\uC758 \uC6B4\uBA85 ' + seuraje.laje + '\uAC01</div>' +
      '</div>'
    ) : "";
    infoEl.innerHTML =
      '<div class="ci-equip">' +
        (firstIcon ? '<img class="ci-equip-icon" src="' + firstIcon + '" alt="">' : '<div class="ci-equip-icon ci-equip-icon-empty"></div>') +
        '<div class="ci-equip-text">' +
          '<div class="ci-equip-label">장착중인 카드</div>' +
          '<div class="ci-equip-name">' + setLabel + '</div>' +
        '</div>' +
        (fxBody ? '<button type="button" class="ci-fx-btn">카드 효과 ▼</button>' : '') +
      '</div>' +
      (seuraje ? '' : '<div class="ci-stats">' + tiles + '</div>') +
      setBadgeHtml +
      (fxBody ? '<div class="ci-fx-panel" hidden>' + fxBody + '</div>' : '');
    var fxBtn = infoEl.querySelector(".ci-fx-btn");
    var fxPanel = infoEl.querySelector(".ci-fx-panel");
    if (infoEl.__fxOff) document.removeEventListener("click", infoEl.__fxOff);
    if (fxBtn && fxPanel) {
      fxBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        fxPanel.hidden = !fxPanel.hidden;
        fxBtn.textContent = fxPanel.hidden ? "카드 효과 ▼" : "카드 효과 ▲";
      });
      infoEl.__fxOff = function(e) {
        if (!infoEl.contains(e.target)) { fxPanel.hidden = true; fxBtn.textContent = "카드 효과 ▼"; }
      };
      document.addEventListener("click", infoEl.__fxOff);
    }
  }
}

function loadExpedition() {
  var p = window.__fullData ? window.__fullData.ArmoryProfile : null;
  if (!p || !p.CharacterName) return;
  if (window.__expeditionLoadedFor === p.CharacterName) return;
  var groupsEl = $("expGroups");
  if (groupsEl) groupsEl.innerHTML = '<div class="exp-loading">불러오는 중...</div>';
  fetch(PROXY + "/character/" + encodeURIComponent(p.CharacterName) + "/siblings").then(function(res) {
    if (!res.ok) throw new Error("원정대 조회 실패");
    return res.json();
  }).then(function(data) {
    var siblings = Array.isArray(data.Siblings) ? data.Siblings : [];
    window.__expeditionLoadedFor = p.CharacterName;
    renderExpedition(siblings, p);
  }).catch(function() {
    if (groupsEl) groupsEl.innerHTML = '<div class="exp-loading">원정대 정보를 불러오지 못했습니다.</div>';
  });
}

function renderExpedition(siblings, currentProfile) {
  var container = $("expGroups");
  if (!container) return;
  if (!siblings.length) { container.innerHTML = '<div class="exp-loading">원정대 캐릭터가 없습니다.</div>'; return; }
  var groups = new Map();
  siblings.forEach(function(c) {
    var server = c.ServerName || "-";
    if (!groups.has(server)) groups.set(server, []);
    groups.get(server).push(c);
  });
  container.innerHTML = Array.from(groups.entries()).map(function(entry) {
    var server = entry[0]; var list = entry[1];
    var sorted = list.slice().sort(function(a, b) {
      var av = parseFloat(String(a.ItemAvgLevel || "0").replace(/,/g, "")) || 0;
      var bv = parseFloat(String(b.ItemAvgLevel || "0").replace(/,/g, "")) || 0;
      return bv - av;
    });
    var cards = sorted.map(function(c) {
      var isActive = c.CharacterName === currentProfile.CharacterName;
      var iconFile = JOB_ICON_FILE[c.CharacterClassName];
      var avatarHtml = iconFile ? '<img src="' + JOB_ICON_BASE + iconFile + '" alt="' + (c.CharacterClassName || "") + '">' : (c.CharacterName || "").slice(0, 2);
      return '<div class="exp-card ' + (isActive ? "active" : "") + '" data-name="' + (c.CharacterName || "") + '"><div class="exp-avatar">' + avatarHtml + '</div><div class="exp-info"><div class="exp-lv">Lv.' + (c.CharacterLevel != null ? c.CharacterLevel : "-") + ' ' + (c.CharacterClassName || "") + '</div><div class="exp-nick">' + (c.CharacterName || "-") + '</div><div class="exp-nums"><span class="exp-il">Lv.' + (c.ItemAvgLevel || "-") + '</span></div></div></div>';
    }).join("");
    return '<div class="exp-group"><div class="exp-group-head"><span class="server">' + server + '</span><span class="dot"></span><span class="cnt">보유 캐릭터 <b>' + list.length + '개</b></span></div><div class="exp-grid">' + cards + '</div></div>';
  }).join("");
  container.querySelectorAll(".exp-card").forEach(function(card) {
    card.addEventListener("click", function() {
      var name = card.dataset.name;
      if (name && name !== currentProfile.CharacterName) {
        if (typeof q !== "undefined" && q) q.value = name;
        if (typeof go === "function") go(name);
      }
    });
  });
}