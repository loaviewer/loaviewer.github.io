// ===== 실시간 계산 엔진 라이브러리 (Calculator Core - calculator.js) =====

function gradeFromOptValue(optName, value) {
  var listTable = window.ACC_OPT_GRADES || (typeof ACC_OPT_GRADES !== "undefined" ? ACC_OPT_GRADES : null);
  if (!listTable) return null;

  var key = optName.replace(/\s+/g, " ").trim();
  if (/^공격력$/.test(key)) key = "공격력%";
  if (/무기\s*공격력/.test(key)) key = "무기 공격력%";
  if (/치명타\s*적중/.test(key)) key = "치명타 적중률";
  if (/치명타\s*피해/.test(key)) key = "치명타 피해";
  if (/상태이상.*지속/.test(key)) key = "상태이상 공격 지속시간";
  if (/아군.*피해량/.test(key)) key = "아군 피해량 강화 효과";
  if (/아군.*공격력/.test(key)) key = "아군 공격력 강화 효과";
  if (/추가\s*피해/.test(key)) key = "추가 피해";
  if (/적에게\s*주는\s*피해/.test(key)) key = "적에게 주는 피해";
  if (/낙인력/.test(key)) key = "낙인력";

  var list = listTable[key];
  if (!list) return null;
  var v = Math.round(value * 1000) / 1000;
  var best = null, bestDiff = 1e9;
  for (var i = 0; i < list.length; i++) {
    var row = list[i];
    var d = Math.abs(row.v - v);
    if (d < bestDiff - 1e-9) {
      bestDiff = d;
      best = row;
    }
  }
  if (!best || bestDiff > 0.05) return null;
  return best.g;
}

function tierFromColor(htmlLine) {
  var m = htmlLine.match(/color\s*=\s*['"]?#?([0-9A-Fa-f]{6})/i);
  if (!m) return "ha";
  var hex = m[1].toUpperCase();
  if (/^(FE9600|F9AE00|E36C00|E24A00|FFD200|CFAD7E|FFA500)$/.test(hex)) return "sang";
  if (/^(A235FF|A11EC8|CE43FC|9B7EF0|C77DFF)$/.test(hex)) return "jung";
  if (/^(00B5FF|1D8FF0|3B9BFF|00CCFF|47AB24|8DF901)$/.test(hex)) return "ha";
  return "ha";
}

function formatAccOpts(body) {
  if (!body) return "";
  var parts = body.split(/<br\s*\/?>/i);
  return parts.map(function(raw) {
    var clean = String(raw || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (!clean) return "";
    
    var label = null;
    var om = clean.match(/^(.+?)\s*\+\s*([0-9.]+)\s*(%?)/);
    if (om) {
      var g = gradeFromOptValue(om[1].trim(), parseFloat(om[2]));
      if (g) label = g;
    }
    if (!label) {
      var tier = tierFromColor(raw);
      label = tier === "sang" ? "상" : tier === "jung" ? "중" : "하";
    }

    var color = "#7c88a5";
    if (label === "상") color = "#FE9600";
    if (label === "중") color = "#A235FF";
    if (label === "하") color = "#00B5FF";

    var badgeStyle = "display:inline-block;min-width:20px;padding:1px 5px;border-radius:3px;font-size:10px;font-weight:800;text-align:center;margin-right:5px;background:" + color + "22;color:" + color + ";border:1px solid " + color + "66;";
    var badgeHtml = '<span style="' + badgeStyle + '">' + label + '</span>';

    if (om) {
      var namePart = om[1].trim();
      var numPart = "+" + om[2] + (om[3] || "");
      return '<span class="line">' + badgeHtml + ' <span class="opt-name" style="color:#e7ecf6;">' + namePart + '</span> <span style="color:' + color + ';font-weight:800;">' + numPart + '</span></span>';
    }
    return '<span class="line">' + badgeHtml + ' <span class="opt-name" style="color:#e7ecf6;">' + clean + '</span></span>';
  }).filter(Boolean).join("");
}

function formatPlainLines(body) {
  if (!body) return "";
  return body.split(/<br\s*\/?>/i).map(function(raw) {
    var clean = String(raw || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return clean ? '<span class="line">' + clean + '</span>' : "";
  }).filter(Boolean).join("");
}

function parseStoneEngraves(tip) {
  var out = [];
  if (!tip) return out;
  for (var k of Object.keys(tip)) {
    var v = tip[k];
    if (v && v.type === "IndentStringGroup" && v.value) {
      var cs = v.value.contentStr || {};
      for (var ck of Object.keys(cs)) {
        var raw = cs[ck]?.contentStr || "";
        var nameM = raw.match(/\[(?:<[^>]+>)*([^\]<]+)/);
        var lvM = raw.match(/Lv\.?\s*(\d+)/i);
        var isNeg = /FE2E2E|방어력 감소|공격력 감소/.test(raw);
        var isBonus = /레벨 보너스|73DC04/.test(raw);
        if (isBonus) {
          var bonus = String(raw || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").replace(/레벨 보너스/g, "").trim();
          if (bonus) out.push({ name: bonus, lv: null, neg: false, bonus: true });
          continue;
        }
        var name = nameM ? nameM[1] : null;
        if (name) out.push({ name: name, lv: lvM ? parseInt(lvM[1], 10) : null, neg: isNeg, bonus: false });
      }
    }
  }
  return out;
}

function parseOrbNirvana(tip, rawTip) {
  var blob = typeof rawTip === "string" ? rawTip : (tip ? JSON.stringify(tip) : "");
  var m = blob.match(/시즌\s*3[^\d]{0,30}낙원력[^\d]{0,10}([\d,]+)/);
  if (m) return { season: 3, value: m[1].replace(/,/g, "") };
  var m2 = blob.match(/낙원력[^\d]{0,10}([\d,]+)/);
  if (m2) return { season: 3, value: m2[1].replace(/,/g, "") };
  return null;
}

function gemIsCooldown(g) {
  var tip = null;
  try { tip = g.Tooltip ? JSON.parse(g.Tooltip) : null; } catch (e) { tip = null; }
  var blob = tip ? JSON.stringify(tip) : (g.Tooltip || "");
  return /재사용/.test(blob);
}

function classifyAccOpt(name, val, isPct) {
  var n = name.replace(/\s+/g, "");
  var maxTable = window.ACC_MAX || (typeof ACC_MAX !== "undefined" ? ACC_MAX : {});
  if (/추가피해/.test(n)) return { key: "추가 피해", max: maxTable["추가 피해"], pct: true };
  if (/적에게주는피해/.test(n)) return { key: "적에게 주는 피해", max: maxTable["적에게 주는 피해"], pct: true };
  if (/무기공격력/.test(n) && isPct) return { key: "무기 공격력", max: maxTable["무기 공격력"], pct: true };
  if (/무기공격력/.test(n) && !isPct) return { key: "무기 공격력 평타", max: 2000, pct: false };
  if (/^공격력$/.test(name.trim()) || n === "공격력") {
    return isPct ? { key: "공격력%", max: maxTable["공격력%"], pct: true }
                 : { key: "공격력평타", max: maxTable["공격력평타"], pct: false };
  }
  if (/치명타적중/.test(n)) return { key: "치명타 적중률", max: maxTable["치명타 적중률"], pct: true };
  if (/치명타피해/.test(n)) return { key: "치명타 피해", max: maxTable["치명타 피해"], pct: true };
  if (/최대생명력/.test(n)) return { key: "최대 생명력", max: maxTable["최대 생명력"], pct: false };
  if (/상태이상.*지속/.test(n)) return { key: "상태이상 공격 지속시간", max: maxTable["상태이상 공격 지속시간"], pct: true };
  if (/아군피해량강화/.test(n)) return { key: "아군 피해량 강화 효과", max: maxTable["아군 피해량 강화 효과"], pct: true };
  if (/아군공격력강화/.test(n)) return { key: "아군 공격력 강화 효과", max: maxTable["아군 공격력 강화 효과"], pct: true };
  if (/낙인력/.test(n)) return { key: "낙인력", max: maxTable["낙인력"], pct: true };
  return null;
}

function parseOptLines(text) {
  var raw = String(text || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  var out = [];
  var re = /([가-힣A-Za-z0-9\s·]+?)\s*\+\s*([0-9]+(?:\.[0-9]+)?)\s*(%?)/g;
  var m;
  while ((m = re.exec(raw))) {
    out.push({ name: m[1].trim(), value: parseFloat(m[2]), isPct: m[3] === "%" });
  }
  return out;
}

function mainStatForClass(cls) {
  var c = (cls || "").trim();
  var statTable = window.CLASS_MAIN_STAT || (typeof CLASS_MAIN_STAT !== "undefined" ? CLASS_MAIN_STAT : null);
  if (!statTable) return "힘";
  if (statTable[c]) return statTable[c];
  var keys = Object.keys(statTable);
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    if (c.indexOf(k) >= 0 || k.indexOf(c) >= 0) return statTable[k];
  }
  return "힘";
}

function parseEffectPercents(text) {
  var t = String(text || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  var bag = {
    enemyDmg: 0, extraDmg: 0, atkPct: 0, weaponAtkPct: 0,
    critRate: 0, critDmg: 0, critHitDmg: 0, dmg: 0, bossDmg: 0,
    allyAtk: 0, allyDmg: 0, brand: 0
  };
  if (!t) return bag;
  var patterns = [
    { re: /적에게\s*주는\s*피해[^\d]{0,20}([0-9.]+)\s*%/g, key: "enemyDmg" },
    { re: /추가\s*피해[^\d]{0,20}([0-9.]+)\s*%/g, key: "extraDmg" },
    { re: /보스[^\n]{0,12}피해[^\d]{0,20}([0-9.]+)\s*%/g, key: "bossDmg" },
    { re: /치명타\s*적중률[^\d]{0,20}([0-9.]+)\s*%/g, key: "critRate" },
    { re: /치명타\s*피해[^\d]{0,20}([0-9.]+)\s*%/g, key: "critDmg" },
    { re: /치명타로\s*적중\s*시[^\d]{0,30}([0-9.]+)\s*%/g, key: "critHitDmg" },
    { re: /무기\s*공격력[^\d]{0,12}([0-9.]+)\s*%/g, key: "weaponAtkPct" },
    { re: /(?<![가-힣])공격력[^\d]{0,12}([0-9.]+)\s*%/g, key: "atkPct" },
    { re: /피해량[^\d]{0,20}([0-9.]+)\s*%/g, key: "dmg" },
    { re: /낙인력[^\d]{0,20}([0-9.]+)\s*%/g, key: "brand" },
    { re: /아군\s*공격력\s*강화[^\d]{0,20}([0-9.]+)\s*%/g, key: "allyAtk" },
    { re: /아군\s*피해량?\s*강화[^\d]{0,20}([0-9.]+)\s*%/g, key: "allyDmg" },
  ];
  for (var i = 0; i < patterns.length; i++) {
    var p = patterns[i];
    var m;
    var re = new RegExp(p.re.source, p.re.flags);
    while ((m = re.exec(t))) {
      bag[p.key] += parseFloat(m[1]) || 0;
    }
  }
  return bag;
}

function mergeBags(a, b) {
  var out = { ...a };
  for (var k of Object.keys(b)) out[k] = (out[k] || 0) + (b[k] || 0);
  return out;
}

function sumEngraveEffects(eng) {
  var bag = {
    enemyDmg: 0, atkPct: 0, critDmg: 0, critRate: 0, backDmg: 0, frontDmg: 0, headDmg: 0,
    atkSpeed: 0, moveSpeed: 0, partial: [], known: []
  };
  var registry = window.ENGRAVE_REGISTRY || (typeof ENGRAVE_REGISTRY !== "undefined" ? ENGRAVE_REGISTRY : {});
  var engTable = window.ENGRAVE_TABLE || (typeof ENGRAVE_TABLE !== "undefined" ? ENGRAVE_TABLE : {});
  var effects = eng?.ArkPassiveEffects || [];
  
  for (var i = 0; i < effects.length; i++) {
    var e = effects[i];
    var name = (e.Name || "").trim();
    var lv = e.Level != null ? Number(e.Level) : 0;
    var stone = e.AbilityStoneLevel != null ? Number(e.AbilityStoneLevel) : 0;
    var cfg = registry[name];

    if (cfg) {
      if (name === "아드레날린") {
        var relicBonus = (cfg.relicCrit && cfg.relicCrit[Math.min(lv, 4)]) || 0;
        var totalCrit = (cfg.baseCrit || 0) + relicBonus;
        bag.critRate += totalCrit;
        bag.known.push(name + " Lv" + lv + " 치적 +" + totalCrit.toFixed(2) + "%");
        continue;
      }
      if (name === "예리한 둔기") {
        var relicBonus = (cfg.relicCritDmg && cfg.relicCritDmg[Math.min(lv, 4)]) || 0;
        var stoneBonus = stone > 0 ? ((cfg.stoneCritDmg && cfg.stoneCritDmg[stone]) || 0) : 0;
        var totalCritDmg = (cfg.baseCritDmg || 0) + relicBonus + stoneBonus;
        bag.critDmg += totalCritDmg;
        bag.known.push(name + " Lv" + lv + " 치피 +" + totalCritDmg.toFixed(2) + "%");
        continue;
      }
      if (name === "기습의 대가") {
        var relicBonus = (cfg.relic && cfg.relic[Math.min(lv, 4)]) || 0;
        var stoneBonus = stone > 0 ? ((cfg.stone && cfg.stone[stone]) || 0) : 0;
        var baseDmg = (cfg.base || 0) + relicBonus + stoneBonus;
        var totalAmbush = baseDmg + (cfg.backAttack || 0);
        bag.enemyDmg += totalAmbush;
        bag.known.push(name + " Lv" + lv + " 백어택시 +" + totalAmbush.toFixed(2) + "%");
        continue;
      }
      if (name === "결투의 대가") {
        var relicBonus = (cfg.relic && cfg.relic[Math.min(lv, 4)]) || 0;
        var stoneBonus = stone > 0 ? ((cfg.stone && cfg.stone[stone]) || 0) : 0;
        var baseDmg = (cfg.base || 0) + relicBonus + stoneBonus;
        var totalBrawler = baseDmg + (cfg.headAttack || 0);
        bag.enemyDmg += totalBrawler;
        bag.known.push(name + " Lv" + lv + " 헤드어택시 +" + totalBrawler.toFixed(2) + "%");
        continue;
      }
      if (name === "원한") {
        var relicBonus = (cfg.relic && cfg.relic[Math.min(lv, 4)]) || 0;
        var stoneBonus = stone > 0 ? ((cfg.stone && cfg.stone[stone]) || 0) : 0;
        var totalGrudge = (cfg.base || 0) + relicBonus + stoneBonus;
        bag.enemyDmg += totalGrudge;
        bag.known.push(name + " Lv" + lv + " 피증 +" + totalGrudge.toFixed(2) + "%");
        continue;
      }
      if (name === "타격의 대가") {
        var relicBonus = (cfg.relic && cfg.relic[Math.min(lv, 4)]) || 0;
        var stoneBonus = stone > 0 ? ((cfg.stone && cfg.stone[stone]) || 0) : 0;
        var totalHitMaster = (cfg.base || 0) + relicBonus + stoneBonus;
        bag.enemyDmg += totalHitMaster;
        bag.known.push(name + " Lv" + lv + " 피증 +" + totalHitMaster.toFixed(2) + "%");
        continue;
      }
    }

    if (name === "이동속도 감소" || name === "공격속도 감소" || name === "공격력 감소") {
      var dm = (e.Description || "").match(/([0-9.]+)\s*%/);
      var v = dm ? -parseFloat(dm[1]) : 0;
      if (name === "이동속도 감소") bag.moveSpeed += v;
      else if (name === "공격속도 감소") bag.atkSpeed += v;
      else if (name === "공격력 감소") bag.atkPct += v;
      bag.known.push(name + " " + v.toFixed(2) + "%");
      continue;
    }

    var row = engTable[name];
    if (row && lv) {
      var val = (row.vals && row.vals[lv] != null) ? row.vals[lv] : ((row.vals && row.vals[Math.min(4, lv)]) ?? null);
      if (val != null) {
        var finalVal = val;
        if (name === "바리케이드" && stone > 0 && registry["바리케이드"]) {
          var barCfg = registry["바리케이드"];
          var barRelic = ((barCfg.basePercent && barCfg.basePercent[Math.min(lv, 4)]) || 0) * 100;
          var barStone = ((barCfg.stoneGains && barCfg.stoneGains[stone]) || 0) * 100;
          finalVal = barRelic + barStone;
        }

        if (row.type === "enemyDmg") bag.enemyDmg += finalVal;
        else if (row.type === "atkPct") bag.atkPct += finalVal;
        else if (row.type === "critDmg") bag.critDmg += finalVal;
        else if (row.type === "critRate") bag.critRate += finalVal;
        else if (row.type === "backDmg") bag.backDmg += finalVal;
        else if (row.type === "frontDmg") bag.frontDmg += finalVal;
        else if (row.type === "headDmg") bag.headDmg += finalVal;
        else if (row.type === "atkSpeed") bag.atkSpeed += finalVal;
        else if (row.type === "moveSpeed") bag.moveSpeed += finalVal;

        bag.known.push(name + " Lv" + lv + " +" + finalVal.toFixed(2) + "%");
      }
    }
  }
  return bag;
}

function getArkGridCoreStat(coreName, point, grade) {
  var result = { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0 };
  var arkTable = window.ARK_GRID_CORE_STATS || (typeof ARK_GRID_CORE_STATS !== "undefined" ? ARK_GRID_CORE_STATS : {});
  var table = coreName ? arkTable[coreName] : null;
  if (!table) return result;
  var tiers = [10, 14, 17, 18, 19, 20].filter(function(t) { return t <= (point || 0); }).sort(function(a, b) { return b - a; });
  if (!tiers.length) return result;
  var byPoint = table[tiers[0]];
  var g = byPoint && byPoint[grade];
  if (g) {
    result.critRate = g.critRate || 0;
    result.critDmg = g.critDmg || 0;
    result.atkSpeed = g.atkSpeed || 0;
    result.moveSpeed = g.moveSpeed || 0;
  }
  return result;
}

function sumArkGridEffects(ag) {
  var bag = {
    enemyDmg: 0, extraDmg: 0, atkPct: 0, weaponAtkPct: 0,
    critRate: 0, critDmg: 0, critHitDmg: 0, dmg: 0, bossDmg: 0,
    allyAtk: 0, allyDmg: 0, brand: 0, atkSpeed: 0, moveSpeed: 0
  };
  if (!ag) return bag;
  var slots = ag.Slots || [];
  for (var i = 0; i < slots.length; i++) {
    var s = slots[i];
    var tip = s.Tooltip ? (typeof s.Tooltip === "string" ? s.Tooltip : JSON.stringify(s.Tooltip)) : "";
    var textBag = parseEffectPercents(tip);
    textBag.critRate = 0;
    textBag.critDmg = 0;
    bag = mergeBags(bag, textBag);
    if (s.Name) bag = mergeBags(bag, parseEffectPercents(s.Name));

    var stat = getArkGridCoreStat(s.Name, s.Point || 0, s.Grade || "");
    bag.critRate += stat.critRate;
    bag.critDmg += stat.critDmg;
    bag.atkSpeed += stat.atkSpeed;
    bag.moveSpeed += stat.moveSpeed;
  }
  var effects = ag.Effects || [];
  for (var j = 0; j < effects.length; j++) {
    var e = effects[j];
    bag = mergeBags(bag, parseEffectPercents(e.Tooltip || e.Name || ""));
    var tipStr = String(e.Tooltip || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    var pctM = tipStr.match(/([0-9.]+)\s*%/);
    if (pctM && e.Name) {
      var n = e.Name;
      var v = parseFloat(pctM[1]) || 0;
      if (/보스/.test(n)) bag.bossDmg += v;
      else if (/추가\s*피해/.test(n)) bag.extraDmg += v;
      else if (/^공격력$/.test(n.trim())) bag.atkPct += v;
      else if (/낙인/.test(n)) bag.brand += v;
      else if (/아군.*공격/.test(n)) bag.allyAtk += v;
      else if (/아군.*피해/.test(n)) bag.allyDmg += v;
    }
  }
  return bag;
}

function sumArkPassiveEffects(ap) {
  var bag = {
    enemyDmg: 0, extraDmg: 0, atkPct: 0, weaponAtkPct: 0,
    critRate: 0, critDmg: 0, critHitDmg: 0, dmg: 0, bossDmg: 0,
    allyAtk: 0, allyDmg: 0, brand: 0, critFlat: 0, specFlat: 0, swiftFlat: 0
  };
  if (!ap) return bag;
  var effects = ap.Effects || [];
  for (var i = 0; i < effects.length; i++) {
    var e = effects[i];
    var blob = [e.Description, e.Name, e.ToolTip, e.Tooltip].filter(Boolean).join(" ");
    bag = mergeBags(bag, parseEffectPercents(blob));
  }
  return bag;
}

function sumGearStats(equipList) {
  var bag = {
    weaponAtk: 0, extraDmg: 0, brandDmg: 0, atkPct: 0, weaponAtkPct: 0, atkFlat: 0,
    critRate: 0, critDmg: 0, critHitDmg: 0, mainStat: 0, mainStatName: "",
    atkSpeed: 0, moveSpeed: 0
  };
  var mainName = mainStatForClass(window.__charClass || "");
  bag.mainStatName = mainName;
  var list = equipList || [];
  for (var i = 0; i < list.length; i++) {
    var eq = list[i];
    var tip = null;
    try { tip = eq.Tooltip ? JSON.parse(eq.Tooltip) : null; } catch (e) { tip = null; }
    if (!tip) continue;
    for (var k of Object.keys(tip)) {
      var v = tip[k];
      if (!v || v.type !== "ItemPartBox" || !v.value) continue;
      var title = String(v.value.Element_000 || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      var body = v.value.Element_001 || "";
      var opts = parseOptLines(body);
      if (/기본\s*효과/.test(title)) {
        for (var o1 = 0; o1 < opts.length; o1++) {
          if (/무기\s*공격력/.test(opts[o1].name) && !opts[o1].isPct) bag.weaponAtk += opts[o1].value;
        }
        var plain1 = String(body || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        var all1 = [...plain1.matchAll(/(힘|민첩|지능)\s*\+\s*([0-9,]+)/g)];
        for (var m1 of all1) {
          if (m1[1] === mainName) bag.mainStat += parseInt(m1[2].replace(/,/g, ""), 10);
        }
      }
      if (eq.Type === "무기" && /추가\s*효과/.test(title)) {
        for (var o2 = 0; o2 < opts.length; o2++) {
          if (/추가\s*피해/.test(opts[o2].name) && opts[o2].isPct) bag.extraDmg += opts[o2].value;
        }
      }
      if (/연마/.test(title)) {
        for (var o3 = 0; o3 < opts.length; o3++) {
          var opt3 = opts[o3];
          if (/추가\s*피해/.test(opt3.name) && opt3.isPct) bag.extraDmg += opt3.value;
          else if (/적에게\s*주는\s*피해/.test(opt3.name) && opt3.isPct) bag.brandDmg += opt3.value;
          else if (/무기\s*공격력/.test(opt3.name) && opt3.isPct) bag.weaponAtkPct += opt3.value;
          else if (/무기\s*공격력/.test(opt3.name) && !opt3.isPct) bag.weaponAtk += opt3.value;
          else if (/^공격력$/.test(opt3.name.trim()) && opt3.isPct) bag.atkPct += opt3.value;
          else if (/^공격력$/.test(opt3.name.trim()) && !opt3.isPct) bag.atkFlat += opt3.value;
          else if (/치명타\s*적중/.test(opt3.name) && opt3.isPct) bag.critRate += opt3.value;
          else if (/치명타\s*피해/.test(opt3.name) && opt3.isPct) bag.critDmg += opt3.value;
        }
      }
    }

    if (eq.Type === "팔찌") {
      var blob = typeof eq.Tooltip === "string" ? eq.Tooltip : JSON.stringify(tip);
      var plain = String(blob || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      var m;

      var lines = String(blob || "").split(/<br\s*\/?>/i);
      for (var li = 0; li < lines.length; li++) {
        var normKey = lines[li].replace(/<[^>]+>/g, "").replace(/\s+/g, "").trim();
        var dbOpt = window.BRACELET_OPTIONS_DB ? window.BRACELET_OPTIONS_DB[normKey] : null;

        if (dbOpt) {
          if (dbOpt.critRate) bag.critRate += dbOpt.critRate;
          if (dbOpt.critRateBuff) bag.critRate += dbOpt.critRateBuff;
          if (dbOpt.critDmg) bag.critDmg += dbOpt.critDmg;
          if (dbOpt.weaponAtkPlus) bag.weaponAtk += dbOpt.weaponAtkPlus;
          if (dbOpt.finalDmg) bag.extraDmg += dbOpt.finalDmg;
          if (dbOpt.addDmg) bag.extraDmg += dbOpt.addDmg;
        }
      }

      {
        var spdRe = /공격\s*및\s*이동\s*속도가\s*([0-9.]+)%\s*증가/g;
        var sm;
        while ((sm = spdRe.exec(plain))) {
          var after = plain.slice(sm.index, sm.index + sm[0].length + 20);
          if (/중첩/.test(after)) continue;
          var v2 = parseFloat(sm[1]);
          bag.atkSpeed += v2;
          bag.moveSpeed += v2;
        }
      }

      var crMatches = [...plain.matchAll(/치명타\s*적중률이?\s*\+?\s*([0-9.]+)%/g)];
      for (var cm of crMatches) {
        var val1 = parseFloat(cm[1]);
        if (val1 > 0 && val1 < 10) bag.critRate += val1;
      }

      var cdMatches = [...plain.matchAll(/치명타\s*피해가?\s*\+?\s*([0-9.]+)%/g)];
      for (var cdm of cdMatches) {
        var val2 = parseFloat(cdm[1]);
        if (val2 > 0 && val2 < 20) bag.critDmg += val2;
      }

      if (/공격\s*적중\s*시\s*매\s*초.*공격\s*및\s*이동\s*속도가\s*1%\s*증가.*최대\s*6중첩/.test(plain)) {
        bag.atkSpeed += 6;
        bag.moveSpeed += 6;
      }

      if ((m = plain.match(/치명타로\s*적중\s*시[^\d]*([0-9.]+)%/))) bag.critHitDmg += parseFloat(m[1]);
      if ((m = plain.match(/무기\s*공격력\s*\+?\s*([0-9,]+)/)) && !plain.includes("배틀아이템")) {
        bag.weaponAtk += parseInt(m[1].replace(/,/g, ""), 10);
      }
      if ((m = plain.match(new RegExp(mainName + "\\s*\\+\\s*([0-9,]+)")))) bag.mainStat += parseInt(m[1].replace(/,/g, ""), 10);
    }
  }
  return bag;
}

function calcBluntThorn(critRateRaw, level) {
  level = level | 0;
  if (level <= 0) {
    return { active: false, level: 0, effectiveCrit: critRateRaw, excessCrit: 0, evoDmgAdd: 0, baseEvo: 0, convEvo: 0, maxEff: 0, convRate: 0 };
  }
  var baseEvo = level >= 2 ? 15.0 : 7.5;
  var convRate = level >= 2 ? 1.50 : 1.25;
  var maxEff = level >= 2 ? 75.0 : 52.5;
  var excessCrit = Math.max(0, critRateRaw - 80);
  var convEvo = excessCrit * convRate;
  var evoDmgAdd = Math.min(baseEvo + convEvo, maxEff);
  var effectiveCrit = Math.min(critRateRaw, 80);
  return {
    active: true, level: level, effectiveCrit: effectiveCrit, excessCrit: excessCrit,
    baseEvo: baseEvo, convEvo: convEvo, evoDmgAdd: evoDmgAdd, maxEff: maxEff, convRate: convRate
  };
}

function calcSonicBreakthrough(atkSpeedBonus, moveSpeedBonus, level) {
  level = level | 0;
  if (level <= 0) return { active: false, level: 0, evoDmg: 0, maxLimit: 0 };
  var underCoef = level === 1 ? 0.05 : 0.10;
  var bothOverBonus = level === 1 ? 4.0 : 8.0;
  var overCoef = level === 1 ? 0.15 : 0.30;
  var maxLimit = level === 1 ? 12.0 : 24.0;
  var under40Sum = Math.min(atkSpeedBonus, 40) * underCoef + Math.min(moveSpeedBonus, 40) * underCoef;
  var bothOver = (atkSpeedBonus > 40 && moveSpeedBonus > 40) ? bothOverBonus : 0;
  var over40Sum = Math.max(0, atkSpeedBonus - 40) * overCoef + Math.max(0, moveSpeedBonus - 40) * overCoef;
  var evoDmg = Math.min(under40Sum + bothOver + over40Sum, maxLimit);
  return { active: true, level: level, evoDmg: evoDmg, maxLimit: maxLimit, under40Sum: under40Sum, bothOver: bothOver, over40Sum: over40Sum };
}

function calcStandingStriker(level) {
  level = level | 0;
  if (level <= 0) return { active: false, level: 0, efficiency: 0, maxEff: 21 };
  var efficiency = level >= 2 ? 21.0 : 10.5;
  return { active: true, level: level, efficiency: efficiency, maxEff: 21 };
}

function calcManaFurnace(level, skills) {
  level = level | 0;
  if (level <= 0) return { active: false, level: 0, avg: 0, maxEff: 0, rows: [] };
  var step = level >= 2 ? 0.50 : 0.25;
  var maxLimit = level >= 2 ? 24.0 : 12.0;
  var rows = [];
  var list = skills || [];
  for (var i = 0; i < list.length; i++) {
    var sk = list[i];
    var name = sk.Name || sk.SkillName || "";
    if (!name) continue;
    var mana = sk.Mana != null ? Number(sk.Mana) : null;
    if (mana == null && sk.Tooltip) {
      var blob = typeof sk.Tooltip === "string" ? sk.Tooltip : JSON.stringify(sk.Tooltip);
      var m = blob.match(/마나\s*(?:소모)?\s*[：:\s]*([0-9]+)/i) || blob.match(/소모\s*마나[^0-9]*([0-9]+)/i);
      if (m) mana = parseInt(m[1], 10);
    }
    if (mana == null || !(mana > 0)) continue;
    var evo = Math.min(step * Math.floor(mana / 10), maxLimit);
    rows.push({ name: name, mana: mana, evo: evo });
  }
  rows.sort(function(a, b) { return b.evo - a.evo; });
  var avg = rows.length ? (rows.reduce(function(s, r) { return s + r.evo; }, 0) / rows.length) : 0;
  var top = rows.length ? rows[0].evo : 0;
  return { active: true, level: level, avg: avg, top: top, maxEff: maxLimit, rows: rows };
}

function engBasePct(name, level, stoneLv) {
  level = Math.min(4, Math.max(1, level || 4));
  stoneLv = Math.min(4, Math.max(0, stoneLv || 0));
  var registry = window.ENGRAVE_REGISTRY || (typeof ENGRAVE_REGISTRY !== "undefined" ? ENGRAVE_REGISTRY : {});
  var cfg = registry[name];
  if (!cfg) return null;
  var base = (cfg.basePercent && cfg.basePercent[level]) ?? (cfg.basePercent && cfg.basePercent[4]) ?? 0;
  var stone = (cfg.stoneGains && cfg.stoneGains[stoneLv]) || 0;
  return base + stone;
}

function calcEngraveEfficiency(eng, msIncPct, realCritRate, realCritDmg) {
  var rows = [];
  var product = 1;
  var effects = eng?.ArkPassiveEffects || [];
  var has = {};
  
  for (var i = 0; i < effects.length; i++) {
    var e = effects[i];
    var name = e.Name || "";
    var lv = e.Level != null ? e.Level : 4;
    var stone = e.AbilityStoneLevel != null ? e.AbilityStoneLevel : 0;
    has[name] = { lv: lv, stone: stone };
  }

  var currentClass = window.__charClass || "";
  var barricadeClasses = window.BARRICADE_CLASSES || (typeof BARRICADE_CLASSES !== 'undefined' ? BARRICADE_CLASSES : []);
  var barricadeValid = Array.isArray(barricadeClasses) ? barricadeClasses.some(function(c) { return currentClass.includes(c); }) : false;
  var order = ["원한", "슈퍼 차지", "질량 증가", "저주받은 인형", "기습의 대가", "돌격대장", "아드레날린", "예리한 둔기", "결투의 대가", "타격의 대가", "달인의 저력", "안정된 상태", "추진력", "속전속결", "마나 효율 증가", "정기 흡수"];
  if (barricadeValid) order.push("바리케이드");

  var registry = window.ENGRAVE_REGISTRY || (typeof ENGRAVE_REGISTRY !== "undefined" ? ENGRAVE_REGISTRY : {});

  for (var j = 0; j < order.length; j++) {
    var engName = order[j];
    if (!has[engName]) continue;
    var itemObj = has[engName];
    var engLv = itemObj.lv;
    var engStone = itemObj.stone;
    var cfg = registry[engName];
    
    if (!cfg) continue; // 정보가 없으면 안전하게 스킵

    var pct = 0;

    if (engName === "원한" || engName === "슈퍼 차지" || engName === "질량 증가" || engName === "저주받은 인형" || engName === "바리케이드" || engName === "타격의 대가" ||
        engName === "달인의 저력" || engName === "안정된 상태" || engName === "추진력" || engName === "속전속결" || engName === "마나 효율 증가" || engName === "정기 흡수") {
      var relicBonus = (cfg.relic && cfg.relic[Math.min(engLv, 4)]) || 0;
      var stoneBonus = (engStone > 0 && cfg.stone && cfg.stone[engStone]) || 0;
      pct = (cfg.base || 0) + relicBonus + stoneBonus;
    } 
    else if (engName === "기습의 대가") {
      var relicBonus = (cfg.relic && cfg.relic[Math.min(engLv, 4)]) || 0;
      var stoneBonus = (engStone > 0 && cfg.stone && cfg.stone[engStone]) || 0;
      pct = (cfg.base || 0) + relicBonus + stoneBonus + (cfg.backAttack || 0);
    } 
    else if (engName === "결투의 대가") {
      var relicBonus = (cfg.relic && cfg.relic[Math.min(engLv, 4)]) || 0;
      var stoneBonus = (engStone > 0 && cfg.stone && cfg.stone[engStone]) || 0;
      pct = (cfg.base || 0) + relicBonus + stoneBonus + (cfg.headAttack || 0);
    } 
    else if (engName === "돌격대장") {
      var relicFactor = (cfg.relicFactor && cfg.relicFactor[Math.min(engLv, 4)]) || 0;
      var stoneFactor = (engStone > 0 && cfg.stoneFactor && cfg.stoneFactor[engStone]) || 0;
      var factor = (cfg.baseFactor || 0) + relicFactor + stoneFactor;
      pct = factor * (Math.min(msIncPct, 40.00) / 100);
      window.__computedDolDaeRate = factor;
    } 
    else if (engName === "아드레날린") {
      var stoneAPBonus = (engStone > 0 && cfg.stoneAp && cfg.stoneAp[engStone]) || 0;
      var totalAP = ((cfg.baseAp || 0) + stoneAPBonus) * 6;
      var relicCrit = (cfg.relicCrit && cfg.relicCrit[Math.min(engLv, 4)]) || 0;
      var totalCrit = (cfg.baseCrit || 0) + relicCrit;

      var d = realCritDmg != null ? (realCritDmg / 100) : 2.4925;
      var c1 = realCritRate != null ? (realCritRate / 100) : 0.68;
      var c0 = c1 - (totalCrit / 100);

      var critGain = (1 + c1 * (d - 1)) / (1 + c0 * (d - 1));
      pct = ((1 + totalAP / 100) * critGain - 1) * 100;
    }
    else if (engName === "예리한 둔기") {
      var relicBonus = (cfg.relicCritDmg && cfg.relicCritDmg[Math.min(engLv, 4)]) || 0;
      var stoneBonus = (engStone > 0 && cfg.stoneCritDmg && cfg.stoneCritDmg[engStone]) || 0;
      var addedCritDmg = (cfg.baseCritDmg || 0) + relicBonus + stoneBonus;

      var d0 = 2.0;
      var d1 = (200 + addedCritDmg) / 100;
      var c = 0.75;

      var dmgGain = (1 + c * (d1 - 1)) / (1 + c * (d0 - 1));
      pct = (dmgGain * 0.98 - 1) * 100;
    }

    if (pct <= 0) continue;
    rows.push({ name: engName, pct: pct, lv: engLv, stone: engStone });
    product *= (1 + pct / 100);
  }
  var total = (product - 1) * 100;
  return { total: total, rows: rows };
}

function parseDolDaeRate(eng) {
  var effects = eng?.ArkPassiveEffects || [];
  for (var i = 0; i < effects.length; i++) {
    var e = effects[i];
    if (!/돌격대장/.test(e.Name || "")) continue;
    var blob = String(e.Description || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() + " " + String(typeof e.Tooltip === "string" ? e.Tooltip : JSON.stringify(e.Tooltip || ""));
    var m = blob.match(/이동\s*속도\s*증가량의\s*([0-9.]+)\s*%/);
    if (m) return parseFloat(m[1]);
    var m2 = blob.match(/([0-9.]+)\s*%\s*만큼\s*적에게\s*주는\s*피해/);
    if (m2) return parseFloat(m2[1]);
  }
  return null;
}

function parseEvolutionEffects(fullData) {
  var ap = fullData?.ArkPassive || fullData?.ArmoryArkPassive || {};
  var stripHtml = function(s) { return String(s || "").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim(); };

  var learned = {};
  var effects = ap.Effects || [];
  for (var i = 0; i < effects.length; i++) {
    var text = stripHtml(effects[i].Description || "");
    var m = text.match(/\d+\s*티어\s*(.+?)\s*Lv\.?\s*(\d+)\s*$/i);
    if (m) {
      var nodeName = m[1].trim().replace(/\s+/g, "");
      var level = parseInt(m[2], 10) || 0;
      if (nodeName && level > 0) learned[nodeName] = level;
    }
  }

  var engForGisup = fullData?.ArmoryEngraving || fullData?.Engraving;
  var engNamesForGisup = [];
  if (engForGisup) {
    if (engForGisup.ArkPassiveEffects) engForGisup.ArkPassiveEffects.forEach(function(e) { if (e.Name) engNamesForGisup.push(e.Name.trim()); });
    if (engForGisup.Effects) engForGisup.Effects.forEach(function(e) { if (e.Name) engNamesForGisup.push(e.Name.trim()); });
  }
  var hasGisup = engNamesForGisup.some(function(n) { return n.includes("기습의 대가"); });

  var evoList = window.EVOLUTION_EFFECTS || (typeof EVOLUTION_EFFECTS !== "undefined" ? EVOLUTION_EFFECTS : []);
  var primaryOnly = evoList.filter(function(d) { return !["일격_치피", "축복의여신_이속", "진군_이속"].includes(d.name); });
  var charClass = fullData?.ArmoryProfile?.CharacterClassName || "";
  var found = [];

  for (var j = 0; j < primaryOnly.length; j++) {
    var def = primaryOnly[j];
    if (def.classOnly && !def.classOnly.includes(charClass)) continue;
    var nodeLv = 0;
    var aliases = def.aliases || [def.name];
    for (var a = 0; a < aliases.length; a++) {
      var alNorm = aliases[a].replace(/\s+/g, "");
      if (learned[alNorm] != null) { nodeLv = learned[alNorm]; break; }
     
if (learned[alNorm] != null) { 
  nodeLv = learned[alNorm]; 
  break; 
}


    }

    if (nodeLv <= 0) continue;
    nodeLv = Math.min(nodeLv, def.maxLv);
    found.push({
      name: def.name, level: nodeLv, stat: def.stat,
      value: (def.values && def.values[nodeLv - 1]) ?? 0,
      category: def.dynamic ? 3 : def.category, condition: def.condition || null, group: def.group || "진화"
    });

    if (def.name === "일격") {
      var dmgDef = evoList.find(function(x) { return x.name === "일격_치피"; });
      if (dmgDef) {
        found.push({
          name: "일격_치피", level: nodeLv, stat: "critDmg",
          value: (dmgDef.values && dmgDef.values[nodeLv - 1]) ?? 0,
          category: hasGisup ? 1 : 3,
          condition: hasGisup ? (dmgDef.condition + " (기습의 대가 착용으로 상시 적용)") : dmgDef.condition
        });
      }
    }

    if (def.name === "축복의여신_공속") {
      var msDef = evoList.find(function(x) { return x.name === "축복의여신_이속"; });
      if (msDef) {
        var lv2 = Math.min(nodeLv, msDef.maxLv);
        found.push({
          name: "축복의여신_이속", level: lv2, stat: "moveSpeed",
          value: (msDef.values && msDef.values[lv2 - 1]) ?? 0,
          category: 2, condition: msDef.condition || null
        });
      }
    }
    if (def.name === "진군_공속") {
      var msDef2 = evoList.find(function(x) { return x.name === "진군_이속"; });
      if (msDef2) {
        found.push({
          name: "진군_이속", level: 1, stat: "moveSpeed",
          value: msDef2.values[0], category: 2, condition: msDef2.condition || null
        });
      }
    }
  }
  return found;
}

function sumEvoEffects(list, opts) {
  var includeCat2 = opts?.includeCat2 !== false;
  var includeCat3 = !!opts?.includeCat3;
  var out = { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0, rows: [], conditional: [] };
  var arr = list || [];
  for (var i = 0; i < arr.length; i++) {
    var e = arr[i];
    if (e.category === 3) {
      out.conditional.push(e);
      if (!includeCat3) continue;
    }
    if (e.category === 2 && !includeCat2) continue;
    if (e.stat === "critRate") out.critRate += e.value;
    else if (e.stat === "critDmg") out.critDmg += e.value;
    else if (e.stat === "atkSpeed") out.atkSpeed += e.value;
    else if (e.stat === "moveSpeed") out.moveSpeed += e.value;
    out.rows.push(e);
  }
  return out;
}

function detectIdentityBuff(className, fullData) {
  if (!className) return null;
  var cleanClass = className.replace(/\s+/g, "").trim(); 
  var buffTable = window.IDENTITY_BUFFS || (typeof IDENTITY_BUFFS !== 'undefined' ? IDENTITY_BUFFS : {});
  var matchedClassKey = Object.keys(buffTable).find(function(k) { return k.includes(cleanClass) || cleanClass.includes(k); });
  if (!matchedClassKey) return null;
  
  var table = buffTable[matchedClassKey];
  var names = [];

  var eng = fullData?.ArmoryEngraving || fullData?.Engraving;
  if (eng) {
    if (eng.ArkPassiveEffects) eng.ArkPassiveEffects.forEach(function(e) { if (e.Name) names.push(e.Name.trim()); });
    if (eng.Effects) eng.Effects.forEach(function(e) { if (e.Name) names.push(e.Name.trim()); });
  }

  var ap = fullData?.ArkPassive || fullData?.ArmoryArkPassive;
  if (ap) {
    if (ap.Title) names.push(ap.Title.trim());
    if (ap.Effects) {
      ap.Effects.forEach(function(e) { if (e.Name) names.push(e.Name.trim()); });
    }
  }

  for (var key of Object.keys(table)) {
    if (names.some(function(n) { return n.includes(key) || key.includes(n); })) {
      return Object.assign({ key: key }, table[key]);
    }
  }
  return null;
}

function parseArkNodeLevel(blob, nameRe) {
  var re = new RegExp(nameRe + "[^0-9]{0,12}Lv\\.?\\s*(\\d+)", "i");
  var m = blob.match(re);
  if (m) return parseInt(m[1], 10) || 0;
  if (new RegExp(nameRe, "i").test(blob)) return 2;
  return 0;
}

function parseArkCoreName(name) {
  var n = name || "";
  var isOrder = /질서/.test(n);
  var isChaos = /혼돈/.test(n);
  var slot = "";
  var head = n.indexOf(":") >= 0 ? n.slice(0, n.indexOf(":")) : n;
  if (/해/.test(head)) slot = "해";
  else if (/달/.test(head)) slot = "달";
  else if (/별/.test(head)) slot = "별";
  var short = n;
  var col = n.indexOf(":");
  if (col >= 0) short = n.slice(col + 1).trim();
  short = short.replace(/\s*\(\d+P\)\s*$/, "").trim();
  return { isOrder: isOrder, isChaos: isChaos, slot: slot, short: short };
}

function orderCoreNum(short, slot) {
  var orderTable = window.ORDER_CORE_BY_ENG || (typeof ORDER_CORE_BY_ENG !== 'undefined' ? ORDER_CORE_BY_ENG : {});
  for (var eng of Object.keys(orderTable)) {
    var list = orderTable[eng][slot];
    if (!list) continue;
    var idx = list.findIndex(function(x) { return x === short || short.includes(x) || x.includes(short); });
    if (idx >= 0) return idx + 1;
  }
  return null;
}

function chaosCoreNum(short) {
  var chaosTable = window.CHAOS_CORE_NUM || (typeof CHAOS_CORE_NUM !== 'undefined' ? CHAOS_CORE_NUM : {});
  if (chaosTable[short] != null) return chaosTable[short];
  for (var k of Object.keys(chaosTable)) {
    if (short.includes(k) || k.includes(short)) return chaosTable[k];
  }
  return null;
}

function isNodeLearned(fullData, nodeName) {
  var ap = fullData?.ArkPassive || fullData?.ArmoryArkPassive || {};
  var target = nodeName.replace(/\s+/g, "");
  var effects = ap.Effects || [];
  for (var i = 0; i < effects.length; i++) {
    var text = String(effects[i].Description || "").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
    var m = text.match(/\d+\s*티어\s*(.+?)\s*Lv\.?\s*(\d+)\s*$/i);
    if (m && m[1].trim().replace(/\s+/g, "") === target) return true;
  }
  return false;
}

function isTripodSelected(skillsData, skillName, tripodName) {
  var arr = Array.isArray(skillsData) ? skillsData : [];
  var skill = arr.find(function(s) {
    return (s.Name || "").trim() === skillName;
  });
  if (!skill) return false;
  var tripods = Array.isArray(skill.Tripods) ? skill.Tripods : [];
  return tripods.some(function(t) {
    return t.IsSelected && (t.Name || "").trim() === tripodName;
  });
}

function calcClassSynergy(skillsData, charClass, fullData) {
  var bag = { critRate: 0, critDmg: 0, atkSpeed: 0, moveSpeed: 0, rows: [] };
  var synergyList = window.CLASS_SYNERGY || (typeof CLASS_SYNERGY !== 'undefined' ? CLASS_SYNERGY : []);
  var entries = synergyList.filter(function(e) { return e.class === charClass; });
  var usedMutex = new Set();
  
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];
    if (e.mutexGroup && usedMutex.has(e.mutexGroup)) continue;
    var value = 0;
    var label = e.label;

    if (e.requireNode) {
      if (isNodeLearned(fullData, e.requireNode)) value = e.value;
    } else if (e.requireSkill) {
      if (isTripodSelected(skillsData, e.requireSkill, e.requireTripod)) value = e.value;
    } else {
      value = e.value;
    }

    if (e.tripodBonus && isTripodSelected(skillsData, e.tripodBonus.requireSkill, e.tripodBonus.requireTripod)) {
      value += e.tripodBonus.extraValue;
      label = e.tripodBonus.label;
    }

    if (value > 0) {
      bag[e.stat] = (bag[e.stat] || 0) + value;
      bag.rows.push({ stat: e.stat, value: value, label: label });
      if (e.mutexGroup) usedMutex.add(e.mutexGroup);
    }
  }
  return bag;
}





// 🎯 [신규] 서폿 직업군 딜모드/서폿모드 자동 판별 함수
function checkIsSupportMode(fullData, charClass) {
  var cls = (charClass || window.__charClass || "").trim();
  var supports = ["홀리나이트", "발키리", "바드", "도화가"];
  
  var isSupportClass = supports.some(function(s) { return cls.indexOf(s) >= 0; });
  if (!isSupportClass) return false; // 서폿 직업군이 아니면 무조건 딜러

  // 1. 딜모드 노드 체크 (하나라도 습득했으면 딜러 모드 적용)
  var dpsNodes = ["신의 기사", "빛의 기사", "진실된 용맹", "회귀"];
  for (var i = 0; i < dpsNodes.length; i++) {
    if (typeof isNodeLearned === "function" && isNodeLearned(fullData, dpsNodes[i])) {
      return false; // 딜모드로 스위칭!
    }
  }

  // 2. 서폿모드 노드 체크 (하나라도 습득했으면 서폿 모드 적용)
  var supNodes = ["신성 보호", "해방자", "완벽한 화음", "저물어 가는 달"];
  for (var j = 0; j < supNodes.length; j++) {
    if (typeof isNodeLearned === "function" && isNodeLearned(fullData, supNodes[j])) {
      return true; // 서폿모드 유지!
    }
  }

  // 3. 노드 정보가 없는 기본 상태인 경우 서폿으로 판정
  return true;
}







// ============================================================
// 서폿 팔찌 효율 모델 ( 팔찌 시뮬레이션 기반)
//   기준 = 팔찌 옵션·스탯이 전부 없는 상태 (상시 101.70 / 풀 186.11 / 종합 154.58)
//   - 아공강 1%      : (1+상시), (1+풀)에 ln +0.0021183 (양쪽 동일)
//   - 부가효과       : DB atkBuffPlus 배율을 그대로 곱함 (방깎·치저·치피저·보호)
//   - 지능/힘        : ln +0.003168 / 15000 pt (선형)
//   - 특화·신속      : 같은 값. 상시 0, 풀 ln +0.002175 / 111 pt, 종합 추가분 +2.355%p / 111 pt (옵션 배율 F에 비례)
//   - 치명·제압·인내·숙련 : 효율 0
//   - 아군 피해량 강화(아피강) 1% : ln +K_DMG ( 시뮬 단독 값에 맞춤)
//   - 치저(치명타 저항 감소) 부가효과 : 실측한 티어는 CRR_PLUS 값 사용, 나머지는 DB atkBuffPlus
//   - 종합 = 0.37353 × 상시 + 0.62647 × 풀 + 특화·신속 추가분
//   - 효율 = exp(3.023x + 1.8x²) − 1,  x = ln((1+종합) / (1+기준 종합))
// 인자: sumA(아공강 % 합), lnP(부가효과 배율의 ln 합), intel(지능/힘 합), stat(특화+신속 합)
// 반환: 팔찌 효율 %
// ============================================================
// 이 파일이 실제로 로드됐는지 확인용: 브라우저 콘솔에 CALC_BRACELET_VERSION 입력
var CALC_BRACELET_VERSION = "r4 | 타대 반영 · 아피강 K=0.0015574 · 치저2.1 보정";
if (typeof window !== "undefined") window.CALC_BRACELET_VERSION = CALC_BRACELET_VERSION;

var SUP_BR = {
  SANG0: 2.017,          // 1 + 기준 상시 버프력
  POOL0: 2.8611,         // 1 + 기준 풀 버프력
  TOT0: 2.5458,          // 1 + 기준 종합 버프력
  W: 0.37353,            // 종합에서 상시가 차지하는 비중
  K_ATK: 0.0021183,      // 아공강 1%당 ln 증가량
  K_DMG: 0.0015574,      // 아피강 1%당 ln 증가량 ( 시뮬: 아피강 +7.5% 단독 = 3.62% 에 맞춤)
  // 치저(치명타 저항 감소) 부가효과 배율 실측값 — 키: 감소 %, 없으면 DB atkBuffPlus 사용
  //   2.1% :  시뮬 '치저 -2.1%|아공강 +2.5%' 단독 = 6.09% 에 맞춤 (DB 값 1.015225 는 과대)
  //   나머지 티어(1.5 / 1.8 / 2.5)는 단독 시뮬 미확인 → DB 값 유지
  CRR_PLUS: { "2.1": 1.014135 },
  K_INT: 0.003168 / 15000,
  POOL_STAT: 0.002175 / 111,
  TOT_STAT: 2.355 / 111,
  S1: 3.023,
  S2: 1.8
};

function calcSupBraceletEff(sumA, lnP, intel, stat) {
  var M = SUP_BR;
  var F = Math.exp(M.K_ATK * (sumA || 0) + (lnP || 0) + M.K_INT * (intel || 0));
  var st = stat || 0;
  var sang = M.SANG0 * F - 1;
  var pool = M.POOL0 * F * Math.exp(M.POOL_STAT * st) - 1;
  var tot = M.W * sang * 100 + (1 - M.W) * pool * 100 + M.TOT_STAT * st * F;
  var x = Math.log((1 + tot / 100) / M.TOT0);
  return (Math.exp(M.S1 * x + M.S2 * x * x) - 1) * 100;
}

function calcBraceletEfficiency(eq, charStats) {
  if (!eq || eq.Type !== "팔찌") return null;
  var tip = null;
  try { tip = JSON.parse(eq.Tooltip); } catch(e) { tip = null; }
  if (!tip) return null;
  var body = "";
  for (var k of Object.keys(tip)) {
    var v = tip[k];
    if (v && v.type === "ItemPartBox" && v.value && /팔찌\s*효과/.test(String(v.value.Element_000 || ""))) {
      body = v.value.Element_001 || "";
    }
  }
 

  if (!body) return null;

  // 🎯 아크패시브 1티어 깨달음 노드로 딜모드/서폿모드 자동 스위칭!
  var cls = window.__charClass || "";
  var fullDataObj = (charStats && charStats.fullData) ? charStats.fullData : (window.__fullData || null);
  var isSupport = checkIsSupportMode(fullDataObj, cls);

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

  var critRate = (charStats && charStats.critRate) ? charStats.critRate : 75;
  var critDmg = (charStats && charStats.critDmg) ? charStats.critDmg : 200;
  var totalWeaponAtk = (charStats && charStats.weaponAtk && charStats.weaponAtk > 50000) ? charStats.weaponAtk : 265000;
  var mainStat = (charStats && charStats.mainStat && charStats.mainStat > 10000) ? charStats.mainStat : 500000;
  var productMul = 1;
  var normalizedSearch = "";
  var rows = [];

  // 🎯 서폿 모드 수집기: 스탯·옵션을 모은 뒤  시뮬 기반 모델(calcSupBraceletEff)로 한 번에 계산
  var supItems = [];
  var supSumA = 0, supLnP = 0, supIntel = 0, supStat = 0;
  function addSup(name, a, p, intel, stat) {
    a = a || 0; p = p || 1; intel = intel || 0; stat = stat || 0;
    var lp = Math.log(p);
    supItems.push({ name: name, sumA: a, lnP: lp, intel: intel, stat: stat });
    supSumA += a; supLnP += lp; supIntel += intel; supStat += stat;
  }

  function getSpecCoefSum() {
    var cls = window.__charClass || "";
    var specTable = window.SPEC_BY_CLASS || (typeof SPEC_BY_CLASS !== "undefined" ? SPEC_BY_CLASS : null);
    if (!specTable) return 0.057;
    var matched = null;
    for (var key of Object.keys(specTable)) {
      if (cls.indexOf(key) >= 0 || key.indexOf(cls) >= 0) { matched = specTable[key]; break; }
    }
    if (!matched || !matched.length) return 0.057;
    var dmgCoefSum = 0;
    for (var i = 0; i < matched.length; i++) {
      if (/피해|증폭|관통|치명타\s*피해|효율/.test(matched[i].label)) {
        dmgCoefSum += matched[i].coef;
      }
    }
    return dmgCoefSum > 0 ? dmgCoefSum : 0.057;
  }
  var specCoefSum = getSpecCoefSum();

  for (var j = 0; j < merged.length; j++) {
    var ml = merged[j];
    
    var mainMatch = ml.match(/^(힘|민첩|지능)\s*\+?\s*([0-9,]+)$/);
    if (mainMatch) {
      var mName = mainMatch[1];
      var mVal = parseInt(mainMatch[2].replace(/,/g, ""), 10) || 0;
      var mMin = (eq.Grade === "고대") ? 9600 : 6400;
      var mMax = (eq.Grade === "고대") ? 16000 : 12800;
      var mQuality = Math.round(Math.max(0, Math.min(100, ((mVal - mMin) / (mMax - mMin)) * 100)));
      var mRowName = mName + " +" + mVal + " (" + mQuality + "%)";

      // 🎯 서폿: 지능/힘만 효율에 반영 (민첩은 0)
      if (isSupport) {
        if (mName !== "민첩") addSup(mRowName, 0, 1, mVal, 0);
        continue;
      }

      // 딜러: 기존 √ 공식
      var baseAtkOld = Math.sqrt(mainStat * totalWeaponAtk / 6);
      var baseAtkNew = Math.sqrt((mainStat + mVal) * totalWeaponAtk / 6);
      var mDps = (baseAtkNew / baseAtkOld - 1) * 100;

      productMul *= (1 + mDps / 100);
      rows.push({ name: mRowName, pct: mDps });
      continue;
    }

    var combatMatch = ml.match(/^(치명|특화|신속|제압|인내|숙련)\s*\+?\s*([0-9,]+)$/);
    if (combatMatch) {
      var name = combatMatch[1];
      var val = parseInt(combatMatch[2], 10) || 0;
      var pct = 0;

      // 🎯 서폿: 특화·신속만 효율 반영(두 스탯 같은 값), 치명·제압·인내·숙련은 0
      if (isSupport) {
        if (name === "특화" || name === "신속") addSup(name + " +" + val, 0, 1, 0, val);
        continue;
      }

      if (name === "치명") pct = val * 0.0238;
      else if (name === "특화") pct = val * specCoefSum * 0.176;
      else if (name === "신속") pct = val * 0.03;
      else pct = val * 0.015;

      if (pct > 0) {
        productMul *= (1 + pct / 100);
        rows.push({ name: name, pct: pct });
        rows[rows.length - 1].name = name + " +" + val;
      }
      continue;
    }
    normalizedSearch += ml.replace(/\s+/g, "");
  }






  // 🎯 [정밀 연산부] 특수 옵션 DB 룩업 (중복 제거 깔끔 단일 루프)
  var allOpts = [];
  var db1 = window.BRACELET_EFFECTS || (typeof BRACELET_EFFECTS !== "undefined" ? BRACELET_EFFECTS : null);
  if (db1) { for (var cat of Object.keys(db1)) { for (var key of Object.keys(db1[cat])) { allOpts.push({ key: key, opt: db1[cat][key] }); } } }
  var db2 = window.BRACELET_OPTIONS_DB;
  if (db2) { for (var key2 of Object.keys(db2)) { allOpts.push({ key: key2, opt: db2[key2] }); } }
  allOpts.sort(function(a, b) { return b.key.length - a.key.length; });

  function parseOptVal(val) {
    if (!val || typeof val !== "number") return 0;
    if (val > 1.0001 && val < 1.0999) return (val - 1) * 100;
    if (val > 0 && val <= 1.0) return val * 100;
    return val;
  }

  for (var n = 0; n < allOpts.length; n++) {
    var item = allOpts[n];
    if (normalizedSearch.indexOf(item.key) >= 0) {
      var opt = item.opt;
      var pct2 = 0;
      var optLabel = opt.initial || opt.name || "특수 옵션";

      // ─────────────────────────────────────────────
      // 🎯 서폿 모드: 아공강·부가효과 옵션은 시뮬 기반 모델로 처리
      // ─────────────────────────────────────────────
      if (isSupport) {
        // (a) 3티어 [응원]/[비수]: DB 값이 이미 % 단위 딜 기여 (0.7, 0.92 …) → 배율 1+값/100
        if (opt.initial === "응원" || opt.initial === "비수") {
          addSup(optLabel, 0, 1 + (opt.atkBuffPlus || 0) / 100);
          normalizedSearch = normalizedSearch.replace(item.key, "");
          continue;
        }
        // (b) 3티어 [약점 노출]: atkBuff가 아공강 원본이 아니라 이미 딜 기여 % (critRateBuff와 중복 → 한 번만)
        if (opt.initial === "약점 노출") {
          addSup(optLabel, 0, 1 + (opt.atkBuff || 0) / 100);
          normalizedSearch = normalizedSearch.replace(item.key, "");
          continue;
        }
        // (c) 4티어 아공강 콤보 (방깎/치저/치피저/보호): atkBuffPlus = 부가효과 배율(D=1), atkBuff = 아공강 원본 %
        if (opt.atkBuff && opt.atkBuffPlus > 1.0001 && opt.atkBuffPlus < 1.0999) {
          var plusMul = opt.atkBuffPlus;
          if (opt.critRateBuff && SUP_BR.CRR_PLUS[String(opt.critRateBuff)]) plusMul = SUP_BR.CRR_PLUS[String(opt.critRateBuff)];   // 치저: 시뮬 실측값 우선
          addSup(optLabel, opt.atkBuff, plusMul);
          normalizedSearch = normalizedSearch.replace(item.key, "");
          continue;
        }
        // (d) 아공강 단독
        if (opt.atkBuff && !opt.atkBuffPlus && !opt.critRateBuff && !opt.critDmgBuff && !opt.shieldBuff) {
          addSup(optLabel, opt.atkBuff, 1);
          normalizedSearch = normalizedSearch.replace(item.key, "");
          continue;
        }
        // (e) 아군 피해량 강화(아피강): 딜증 버프(낙인·춤사위 등)를 증폭 → 배율 exp(K_DMG × 아피강%)
        if (opt.damageBuff && !opt.atkBuff && !opt.atkBuffPlus) {
          addSup(optLabel, 0, Math.exp(SUP_BR.K_DMG * opt.damageBuff));
          normalizedSearch = normalizedSearch.replace(item.key, "");
          continue;
        }
      } else if (opt.initial === "응원" || opt.initial === "비수") {
        // 딜러: 3티어 [응원]/[비수]는 두 값의 합 (DB 값이 이미 % 단위)
        pct2 = (opt.atkBuffPlus || 0) + (opt.shieldBuff || 0);
        productMul *= (1 + pct2 / 100);
        rows.push({ name: opt.initial, pct: pct2 });
        normalizedSearch = normalizedSearch.replace(item.key, "");
        continue;
      }

      // 1. 피증 / 적주피 (보호막 피해와 중복 방지)
      if (opt.finalDmg && !opt.shieldBuff) {
        pct2 += parseOptVal(opt.finalDmg);
      }

      // 2. 추가 피해 (상대적 합연산)
      if (opt.addDmg) {
        var baseED = (charStats && charStats.extraDmg) ? charStats.extraDmg : 39.5;
        pct2 += ((100 + baseED + opt.addDmg) / (100 + baseED) - 1) * 100;
      }

      // 3. 백어택 / 헤드어택
      if (opt.backDmg) pct2 += parseOptVal(opt.backDmg);
      if (opt.headDmg) pct2 += parseOptVal(opt.headDmg);
      // 3-1. 타대(방향성 공격이 아닌 스킬, 각성기 제외) — '타격의 대가' 옵션
      if (opt.normalDmg) pct2 += parseOptVal(opt.normalDmg);

      // 4. 무력화 적 피해 (40% 발동률)
      var optKeyNorm = item.key || "";
      var groggyMatch = optKeyNorm.match(/무력화.*피해.*?([0-9.]+)%/);
      if (!groggyMatch) groggyMatch = optKeyNorm.match(/무력화.*?([0-9.]+)%.*피해/);
      if (groggyMatch) {
        pct2 += (parseFloat(groggyMatch[1]) || 0) * 0.40;
      }

      // 5. 치피 / 치적 / 치피증
      var isPartyCritDebuff = isSupport && (opt.critDmgBuff || opt.critRateBuff);
      if (opt.critDmg && !isPartyCritDebuff) {
        var cr = Math.min(critRate, 100) / 100;
        var cd0 = critDmg / 100;
        var cd1 = cd0 + opt.critDmg / 100;
        pct2 += ((1 + cr * (cd1 - 1)) / (1 + cr * (cd0 - 1)) - 1) * 100;
      }
      if (opt.critRate && !isPartyCritDebuff) {
        var cr2 = Math.min(critRate, 100) / 100;
        var cd2 = critDmg / 100;
        var cr_new = cr2 + opt.critRate / 100;
        pct2 += ((1 + cr_new * (cd2 - 1)) / (1 + cr2 * (cd2 - 1)) - 1) * 100;
      }
      if (opt.critFinalDmg) {
        pct2 += (critRate / 100) * parseOptVal(opt.critFinalDmg);
      }

      // 6. 무기 공격력 (√ 공식)
      if (opt.weaponAtkPlus) {
        pct2 += (Math.sqrt((totalWeaponAtk + opt.weaponAtkPlus) / totalWeaponAtk) - 1) * 100;
      }

      if (isSupport) {
        // 서폿: 아공강·부가효과는 위(모델)에서 처리됨. 남은 항목(보호·회복 효과 등)만 기존 방식
        if (opt.careBuff) pct2 += parseOptVal(opt.careBuff);
      } else {
        // 딜러용 기본 계산
        if (opt.atkBuffPlus) pct2 += parseOptVal(opt.atkBuffPlus);
        if (opt.atkBuff) pct2 += parseOptVal(opt.atkBuff);
        if (opt.critRateBuff) pct2 += parseOptVal(opt.critRateBuff);
        if (opt.shieldBuff) pct2 += parseOptVal(opt.shieldBuff);
        if (opt.careBuff) pct2 += parseOptVal(opt.careBuff);
      }

      if (pct2 > 0) {
        productMul *= (1 + pct2 / 100);
        rows.push({ name: optLabel, pct: pct2 });
      }
      normalizedSearch = normalizedSearch.replace(item.key, "");
    }
  }

  // 🎯 서폿 모델 계산: 전체 효율 + 항목별 단독 효율(해당 항목만 있는 팔찌의 효율)
  var supEff = 0;
  if (isSupport && supItems.length) {
    supEff = calcSupBraceletEff(supSumA, supLnP, supIntel, supStat);
    for (var q = 0; q < supItems.length; q++) {
      var it = supItems[q];
      rows.push({ name: it.name, pct: calcSupBraceletEff(it.sumA, it.lnP, it.intel, it.stat) });
    }
  }

  return { totalEff: ((1 + supEff / 100) * productMul - 1) * 100, rows: rows };
}