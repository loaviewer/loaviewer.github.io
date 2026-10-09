// ===== 유틸리티 · 툴팁 · 공통 헬퍼 (app-utils.js) =====

var $ = function(id) { return document.getElementById(id); };
var PROXY = "https://port-0-loa-dps-viewer-mrwmoda54f8e0312.sel3.cloudtype.app";

var JOB_ICON_BASE = "https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/";
var JOB_ICON_FILE = {
  "버서커": "berserker.png", "워로드": "warlord.png", "디스트로이어": "destroyer.png",
  "홀리나이트": "holyknight.png", "슬레이어": "berserker_female.png", "발키리": "holyknight.png",
  "배틀마스터": "battle_master.png", "인파이터": "infighter.png", "기공사": "force_master.png",
  "창술사": "lance_master.png", "스트라이커": "battle_master_male.png", "브레이커": "infighter_male.png",
  "데빌헌터": "devil_hunter.png", "블래스터": "blaster.png", "호크아이": "hawk_eye.png",
  "스카우터": "scouter.png", "건슬링어": "devil_hunter_female.png", "바드": "bard.png",
  "서머너": "summoner.png", "아르카나": "arcana.png", "소서리스": "elemental_master.png",
  "블레이드": "blade.png", "데모닉": "demonic.png", "리퍼": "reaper.png",
  "소울이터": "soul_eater.png", "가디언나이트": "dragon_knight.png", "도화가": "yinyangshi.png",
  "기상술사": "weather_artist.png", "환수사": "alchemist.png", "차원술사": "dimension_master.png"
};

var ARMOR = ["무기", "투구", "상의", "하의", "장갑", "어깨"];
var ARMOR_EXTRA = ["완갑", "보주"];
var SPECIAL_EQ = ["나침반", "부적", "문장"];
var ACC = ["목걸이", "귀걸이", "반지", "어빌리티 스톤", "팔찌"];
var ORDER = ["투구", "어깨", "상의", "하의", "장갑", "무기"];
var BORDER_TYPES = new Set(["무기", "투구", "상의", "하의", "장갑", "어깨", "완갑"]);
var ENG_SPRITE = "https://cdn-lostark.game.onstove.com/2018/obt/assets/images/pc/profile/img_engrave_icon.png";
var ENG_SPRITE_W = 141;
var ENG_SPRITE_H = 26;
var STONE_ICON = "https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/ico_ability_stone_symbol.png";
var BUFF_MEAL = 5;
var BUFF_DESIRE = 9;

var tipEl = document.getElementById("loa-tip");
var tipOn = false;

function strip(s) { return String(s || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); }
function round2(num) { return (Math.round((Number(num) + Number.EPSILON) * 100) / 100).toFixed(2); }
function truncate2(num) { return (Math.floor(Number(num) * 100 + 1e-9) / 100).toFixed(2); }

function parseTip(raw) {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  try { return JSON.parse(raw); } catch (e) { return null; }
}

function tipQuality(tip) {
  if (!tip) return null;
  for (var k of Object.keys(tip)) {
    if (tip[k]?.type === "ItemTitle" && tip[k].value) return tip[k].value.qualityValue;
  }
  return null;
}

function tipParts(tip) {
  if (!tip) return [];
  var out = [];
  for (var k of Object.keys(tip)) {
    if (tip[k]?.type === "ItemPartBox" && tip[k].value)
      out.push({ title: strip(tip[k].value.Element_000 || ""), body: tip[k].value.Element_001 || "" });
  }
  return out;
}

function gradeStyle(grade) {
  return (typeof GRADE !== "undefined" && GRADE[grade]) ? GRADE[grade] : { c: "#cfd7e8", bg: "rgba(255,255,255,.08)" };
}

function qBarClass(qv) {
  if (qv == null || qv < 0) return null;
  if (qv >= 100) return "q100";
  if (qv >= 90) return "q90";
  if (qv >= 70) return "q70";
  if (qv >= 60) return "q60";
  return "q0";
}





// 🎯 [핵심 함수] 아이콘 생성기 (찌그러짐 방지 로직 주입)
var ACC_FRAME_PAD_RATIO = 0.1; // 악세 테두리(마름모 장식 돌출) 여백 / 아이콘 크기 (4px @ 40px). 파란 사각 테두리가 아이콘 가장자리와 안 맞으면 조절
function stripBars(s) { return String(s == null ? "" : s).replace(/\|/g, "").replace(/^\s+|\s+$/g, ""); }
var EQ_BORDER_OUT_RATIO = 0.08; // 장비(투구/무기 등) 테두리 확장 비율 (3.2px @ 40px). 더 키우려면 올리세요
function makeIconWithQuality(iconUrl, qv, gradeBg, gradeBorder, withBorder, borderImage) {
  // 📏 아이콘 크기 변수 (여기만 수정하면 전체가 바뀝니다)
  var iconSize = "40px"; 

  var wrap = document.createElement("div");
  wrap.className = "item-ic-wrap" + (qv != null && qv >= 0 ? " has-q" : "");
  
  // 🎯 부모 높이에 따라 늘어나지 않게 고정
  wrap.style.cssText = "position:relative; display:flex; flex-direction:column; align-items:center; align-self:flex-start; flex-shrink:0;";

  if (borderImage) { wrap.className += " has-frame"; wrap.style.width = "fit-content"; }
  var imgContainer = document.createElement("div");
  // 테두리 패딩을 포함한 컨테이너 크기 계산
  imgContainer.style.cssText = "position:relative; line-height:0; display:block; width:fit-content; height:fit-content;";
  
  if (borderImage) {
    // 테두리는 아이콘 크기에 비례(ACC_FRAME_PAD_RATIO) — 아이콘이 커지면 테두리도 같이 커짐
    var framePad = Math.round(parseFloat(iconSize) * ACC_FRAME_PAD_RATIO * 10) / 10;
    // 프레임은 아이콘 "위"에 덮는 오버레이 (공식 홈처럼: 파란 사각 테두리 + 4방향 마름모 장식이 아이콘 위로 걸침)
    imgContainer.style.padding = framePad + "px";
    imgContainer.style.boxSizing = "content-box";
    imgContainer.dataset.framed = "1";
    var frameOv = document.createElement("div");
    frameOv.className = "acc-frame-ov";
    frameOv.style.cssText = "position:absolute;inset:0;z-index:2;pointer-events:none;background:url(" + borderImage + ") center/100% 100% no-repeat;";
    imgContainer.appendChild(frameOv);
  }

  var img = document.createElement("img");
  img.className = "item-ic";
  img.src = iconUrl || "";
  img.alt = "";
  img.loading = "lazy";
  
  // 🎯 이미지 크기 절대 고정 (찌그러짐 방지)
  img.style.cssText = "display:block; border-radius:4px; object-fit:cover;";
  img.style.width = iconSize;
  img.style.height = iconSize;
  img.style.minWidth = iconSize;
  img.style.minHeight = iconSize;

  if (gradeBg) img.style.background = gradeBg;
  if (borderImage) img.style.borderRadius = "0";
  if (gradeBorder) img.style.borderColor = gradeBorder;
  imgContainer.appendChild(img);

  if (withBorder) {
    var bd = document.createElement("div");
    bd.className = "eq-border";
    var bdOut = Math.round(parseFloat(iconSize) * EQ_BORDER_OUT_RATIO * 10) / 10; // 장비 테두리가 아이콘 밖으로 나가는 두께
    bd.style.cssText = "position:absolute; top:-" + bdOut + "px; left:-" + bdOut + "px; width:calc(100% + " + (bdOut * 2) + "px); height:calc(100% + " + (bdOut * 2) + "px); box-sizing:border-box; pointer-events:none; z-index:2;";
    imgContainer.appendChild(bd);
  }

  wrap.appendChild(imgContainer);

  if (qv != null && qv >= 0) {
    var bar = document.createElement("div");
    bar.className = "q-bar " + (qBarClass(qv) || "mid");
    // 🎯 품질바 너비도 아이콘 크기에 맞춤
    bar.style.width = borderImage ? "100%" : iconSize;
    bar.style.boxSizing = "border-box";
    var fill = document.createElement("div");
    fill.className = "q-fill";
    fill.style.width = Math.min(100, Math.max(0, qv)) + "%";
    var num = document.createElement("span");
    num.className = "q-num";
    num.textContent = String(qv);
    bar.append(fill, num);
    wrap.appendChild(bar);
  }
  return wrap;
}










function engBullet(sliceX, sliceW, targetW) {
  var scale = targetW / sliceW;
  var targetH = Math.round(ENG_SPRITE_H * scale);
  var bgW = Math.round(ENG_SPRITE_W * scale);
  var bgH = Math.round(ENG_SPRITE_H * scale);
  var left = -Math.round(sliceX * scale);
  var span = document.createElement("span");
  span.className = "eng-bullet";
  span.style.width = targetW + "px";
  span.style.height = targetH + "px";
  var img = document.createElement("img");
  img.src = ENG_SPRITE;
  img.alt = "";
  img.style.width = bgW + "px";
  img.style.height = bgH + "px";
  img.style.left = left + "px";
  span.appendChild(img);
  return span;
}

function engBulletHtml(sliceX, sliceW, targetW) {
  var scale = targetW / sliceW;
  var targetH = Math.round(ENG_SPRITE_H * scale);
  var bgW = Math.round(ENG_SPRITE_W * scale);
  var bgH = Math.round(ENG_SPRITE_H * scale);
  var left = -Math.round(sliceX * scale);
  return `<span class="eng-bullet tip-eng-bullet" style="width:${targetW}px;height:${targetH}px"><img class="tip-eng-sprite" src="${ENG_SPRITE}" alt="" style="left:${left}px!important;width:${bgW}px!important;height:${bgH}px!important"></span>`;
}

// 고대 장비/악세 아이콘 배경 (4티어 보석 배경과 같은 그라데이션)
var ANCIENT_ICON_BG = "linear-gradient(135deg,#473b2b,#e8d092)";
function ancientIconBg(grade, bg) { return grade === "고대" ? ANCIENT_ICON_BG : bg; }

// 스킬 이름 → 스킬 아이콘 (스킬 목록 → 보석 효과 목록 순서로 탐색, 띄어쓰기 무시)
function skillIconByName(name) {
  var fd = window.__fullData || {}, k = String(name || "").replace(/\s+/g, "");
  if (!k) return "";
  var hit = (fd.ArmorySkills || []).find(function(x) { return String(x.Name || "").replace(/\s+/g, "") === k; });
  if (hit && hit.Icon) return hit.Icon;
  var eff = fd.ArmoryGem && fd.ArmoryGem.Effects;
  var arr = Array.isArray(eff) ? eff : ((eff && eff.Skills) || []);
  hit = arr.find(function(x) { return x && String(x.Name || "").replace(/\s+/g, "") === k; });
  return (hit && hit.Icon) || "";
}

// 아이콘이 있는 툴팁 헤더 (스킬 툴팁과 같은 모양: 아이콘 + 이름 + 보조 줄)
function tipItemHeaderHtml(nameHtml, icon, badgeIcon, subs, borderColor, iconBg) {
  var bg = "url('" + icon + "') center/cover no-repeat" + (iconBg ? "," + iconBg : "");
  var ic = '<span class="tip-ic2" style="background:' + bg + ";" + (borderColor ? "border-color:" + borderColor + ";" : "") + '">' +
    (badgeIcon ? '<i style="background-image:url(\'' + badgeIcon + '\')"></i>' : "") + "</span>";
  return '<div class="tip-hd tip-hd-item">' + ic + '<div class="tip-hd-text"><div class="tip-hd-name">' + nameHtml + "</div>" +
    subs.map(function(s) { return '<div class="tip-hd-sub">' + s + "</div>"; }).join("") + "</div></div>";
}

function buildTipHtml(raw, title) {
  var tip = parseTip(raw);
  if (!tip) {
    var t = strip(raw) || title || "";
    return t ? `<div class="tip-hd">${title || ""}</div><div class="tip-bd">${t}</div>` : "";
  }
  if (brIsBraceletTip(tip)) return buildBraceletTipHtml(tip, title);
  var nameHtml = "", icon = "", subs = [], grade = "";
  var main = [], foot = [], seenSec = false;
  // 본문(main): 효과 박스 앞뒤 안내 줄 / 꼬리(foot): 효과 박스 뒤에 오는 안내 줄(분해불가 등)
  function put(html, isSec) {
    if (isSec) { seenSec = true; main.push(html); }
    else (seenSec ? foot : main).push(html);
  }
  for (var k of Object.keys(tip).sort()) {
    var v = tip[k];
    if (!v?.type) continue;
    if (v.type === "NameTagBox") nameHtml = v.value || title || "";
    else if (v.type === "CommonSkillTitle" && v.value) {
      var left = v.value.leftText || "";
      var cat = v.value.name || "";
      if (left || cat) put(`<div class="tip-muted tip-line">${cat ? cat + " · " : ""}${left}</div>`, false);
    } else if (v.type === "ItemTitle" && v.value) {
      var l0 = v.value.leftStr0 || "", l2 = v.value.leftStr2 || "";
      var qv = (v.value.qualityValue != null && v.value.qualityValue >= 0) ? v.value.qualityValue : null;
      var ip = v.value.slotData && v.value.slotData.iconPath;
      if (ip) {
        icon = ip;
        var gm0 = /(일반|고급|희귀|영웅|전설|유물|고대|에스더)/.exec(strip(l0));
        grade = gm0 ? gm0[1] : "";
        if (l0) subs.push(l0);
        var s2 = l2; if (qv != null) s2 += (s2 ? " · " : "") + "품질 " + qv;
        if (s2) subs.push(s2);
      } else {
        put(`<div>${l0}</div>`, false);
        if (l2) put(`<div class="tip-muted">${l2}</div>`, false);
        if (qv != null) put(`<div class="tip-muted">품질 ${qv}</div>`, false);
      }
    } else if (v.type === "ItemPartBox" && v.value) {
      put(`<div class="tip-sec"><div class="tip-sec-title">${v.value.Element_000 || ""}</div><div>${v.value.Element_001 || ""}</div></div>`, true);
    } else if (v.type === "SingleTextBox" && v.value) {
      var t = strip(v.value);
      if (/판매\s*불가|파괴\s*불가|분해\s*불가|거래\s*불가/.test(t) && t.length < 40)
        put(`<div class="tip-sec tip-warn">${stripBars(t)}</div>`, false);
      else if (/판매|파괴|분해/.test(t) && t.length > 30) { }
      else if (/거래 제한|캐릭터 귀속|효과 부여 불가/.test(t))
        put(`<div class="tip-sec tip-muted">${stripBars(v.value)}</div>`, false);
      else if (!/가디언|레이드|획득처/.test(t))
        put(`<div class="tip-sec tip-muted">${stripBars(v.value)}</div>`, false);
    } else if (v.type === "MultiTextBox" && v.value) {
      var rawHtml = String(v.value || "");
      var t = strip(rawHtml);
      if (/거래\s*불가/.test(t) && t.length < 40) {
        put(`<div class="tip-sec tip-warn">${stripBars(t)}</div>`, false);
      } else if (t) {
        var body = rawHtml.replace(/\|\|/g, "<br>").replace(/\|/g, "").replace(/<BR\s*\/?>/gi, "<br>").replace(/(<br\s*\/?>\s*)+$/i, "");
        put(`<div class="tip-sec tip-line">${body}</div>`, false);
      }
    } else if (v.type === "IndentStringGroup" && v.value) {
      var top = v.value.topStr || "";
      var lines = "";
      var cs = v.value.contentStr || {};
      for (var ck of Object.keys(cs)) {
        if (cs[ck]?.contentStr) lines += `<div>${cs[ck].contentStr}</div>`;
      }
      put(`<div class="tip-sec"><div class="tip-sec-title">${top}</div>${lines}</div>`, true);
    }
  }
  var hd;
  if (icon) {
    var nc = /color\s*=\s*['"]?(#[0-9a-fA-F]{3,8})/i.exec(String(nameHtml));
    var isGem = /보석/.test(strip(nameHtml));
    var gemSkill = isGem ? parseGemSkillName({ Tooltip: raw }) : "";
    var skIcon = gemSkill ? skillIconByName(gemSkill) : "";
    var gbg = ancientIconBg(grade, grade ? gradeStyle(grade).bg : "");
    // 보석: 해당 스킬 아이콘을 크게, 보석 아이콘은 작은 배지로
    hd = skIcon ? tipItemHeaderHtml(nameHtml, skIcon, icon, subs, nc ? nc[1] : "", "")
                : tipItemHeaderHtml(nameHtml, icon, "", subs, nc ? nc[1] : "", gbg);
  } else {
    hd = nameHtml ? `<div class="tip-hd">${nameHtml}</div>` : (title ? `<div class="tip-hd">${title}</div>` : "");
  }
  if (!main.length && !foot.length && !hd) return "";
  return `${hd}<div class="tip-bd tip-grp">${main.length ? `<div class="tg tg-main">${main.join("")}</div>` : ""}${foot.length ? `<div class="tg tg-foot">${foot.join("")}</div>` : ""}</div>`;
}

// ===== 팔찌 툴팁 (옵션 분리 · 상/중/하 배지 · 아이콘 · 구분선) =====
var _brOptList = null;
function brGetOptList() {
  if (_brOptList) return _brOptList;
  var list = [];
  var db1 = (typeof BRACELET_EFFECTS !== "undefined") ? BRACELET_EFFECTS : (window.BRACELET_EFFECTS || null);
  if (db1) {
    Object.keys(db1).forEach(function(cat) {
      Object.keys(db1[cat]).forEach(function(key) { list.push({ key: key, opt: db1[cat][key] }); });
    });
  }
  if (window.BRACELET_OPTIONS_DB) {
    Object.keys(window.BRACELET_OPTIONS_DB).forEach(function(key) { list.push({ key: key, opt: window.BRACELET_OPTIONS_DB[key] }); });
  }
  list.sort(function(a, b) { return b.key.length - a.key.length; });
  if (list.length) _brOptList = list;   // DB 로드 전이면 캐시하지 않음
  return list;
}

function brIsBraceletTip(tip) {
  if (!tip) return false;
  for (var k of Object.keys(tip)) {
    var v = tip[k];
    if (v?.type === "ItemPartBox" && v.value && /팔찌\s*효과/.test(strip(v.value.Element_000 || ""))) return true;
  }
  return false;
}

function brEsc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function brDecode(s) { return String(s).replace(/&nbsp;/gi, " ").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;/g, "'").replace(/&amp;/gi, "&"); }

// HTML → <BR> 기준 줄 조각 [{html, text}] (FONT 색상만 유지, 나머지 태그 제거)
function brSegments(html) {
  var s = String(html == null ? "" : html);
  var re = /<(\/?)([a-zA-Z]+)([^>]*)>/g;
  var segs = [], cur = "", stack = [], last = 0, m;
  function closeAll() { var o = ""; for (var i = stack.length - 1; i >= 0; i--) o += "</span>"; return o; }
  function reopen() { return stack.join(""); }
  function pushSeg() { segs.push(cur + closeAll()); cur = reopen(); }
  while ((m = re.exec(s))) {
    if (m.index > last) cur += brEsc(brDecode(s.slice(last, m.index))).replace(/\|/g, "");
    last = re.lastIndex;
    var closing = m[1] === "/", tag = m[2].toUpperCase();
    if (tag === "BR") pushSeg();
    else if (tag === "FONT") {
      if (closing) { if (stack.length) { stack.pop(); cur += "</span>"; } }
      else {
        var cm = /color\s*=\s*['"]?(#[0-9a-fA-F]{3,8})/i.exec(m[3]);
        var open = cm ? '<span style="color:' + cm[1] + '">' : "<span>";
        stack.push(open); cur += open;
      }
    }
  }
  if (last < s.length) cur += brEsc(brDecode(s.slice(last)));
  segs.push(cur + closeAll());
  var out = [];
  segs.forEach(function(sg) { var t = strip(sg); if (t) out.push({ html: sg, text: t }); });
  return out;
}

var BR_STAT_RE = /^(치명|특화|신속|제압|인내|숙련|힘|민첩|지능)\s*\+?\s*([0-9,]+)$/;

// 팔찌 효과 본문 → { stats, options[ {badge, label, lines} ] }
function brParseBody(segs, gradeKey) {
  var stats = [], rest = [];
  for (var i = 0; i < segs.length; i++) {
    var sg = segs[i];
    if (BR_STAT_RE.test(sg.text.replace(/\+\s+/g, "+"))) { stats.push(sg.html); continue; }
    if (/^(치명|특화|신속|제압|인내|숙련|힘|민첩|지능)$/.test(sg.text) && i + 1 < segs.length && /^[+-]?\s*\d[\d,]*$/.test(segs[i + 1].text)) {
      stats.push(sg.html + " " + segs[i + 1].html); i++; continue;
    }
    rest.push(sg);
  }
  var text = "";
  rest.forEach(function(sg) { text += sg.text.replace(/\s+/g, ""); });
  var owner = new Array(text.length), found = [];
  brGetOptList().forEach(function(it) {
    var from = 0, pos;
    while ((pos = text.indexOf(it.key, from)) >= 0) {
      var free = true, k;
      for (k = pos; k < pos + it.key.length; k++) if (owner[k] !== undefined) { free = false; break; }
      if (free) {
        var id = found.length;
        found.push(it);
        for (k = pos; k < pos + it.key.length; k++) owner[k] = id;
        break;
      }
      from = pos + 1;
    }
  });
  var groups = [], curG = null, pos2 = 0;
  rest.forEach(function(sg) {
    var n = sg.text.replace(/\s+/g, "").length;
    var o = (n > 0 && owner[pos2] !== undefined) ? owner[pos2] : -1;
    pos2 += n;
    if (curG && curG.owner === o) curG.lines.push(sg.html);
    else { curG = { owner: o, lines: [sg.html] }; groups.push(curG); }
  });
  var options = groups.map(function(g) {
    var opt = g.owner >= 0 ? found[g.owner].opt : null;
    var badge = "";
    if (opt && gradeKey) { var b = opt[gradeKey]; if (b === "상" || b === "중" || b === "하") badge = b; }
    return { badge: badge, label: opt ? (opt.initial || "") : "", lines: g.lines };
  });
  return { stats: stats, options: options };
}

function buildBraceletTipHtml(tip, title) {
  var name = "", nameColor = "", subs = [], icon = "", gradeKey = "";
  var rows = [];
  for (var k of Object.keys(tip).sort()) {
    var v = tip[k];
    if (!v?.type) continue;
    if (v.type === "NameTagBox") {
      name = v.value || title || "";
      var cm = /color\s*=\s*['"]?(#[0-9a-fA-F]{3,8})/i.exec(String(v.value || ""));
      if (cm) nameColor = cm[1];
    } else if (v.type === "ItemTitle" && v.value) {
      var l0 = v.value.leftStr0 || "";
      if (l0) subs.push(l0);
      if (v.value.leftStr2) subs.push(v.value.leftStr2);
      var gm = /(고대|유물)/.exec(strip(l0));
      if (gm) gradeKey = gm[1];
      if (v.value.slotData?.iconPath) icon = v.value.slotData.iconPath;
    } else if (v.type === "ItemPartBox" && v.value) {
      var ptitle = strip(v.value.Element_000 || "");
      if (/팔찌\s*효과/.test(ptitle)) {
        rows.push('<div class="bt-row bt-sec-title">' + (v.value.Element_000 || "") + "</div>");
        var parsed = brParseBody(brSegments(v.value.Element_001 || ""), gradeKey);
        if (parsed.stats.length) {
          rows.push('<div class="bt-row bt-stats">' + parsed.stats.map(function(h) { return '<span class="bt-stat">' + h + "</span>"; }).join("") + "</div>");
        }
        parsed.options.forEach(function(op) {
          var cls = op.badge === "상" ? "bt-g-hi" : op.badge === "중" ? "bt-g-mid" : op.badge === "하" ? "bt-g-lo" : "bt-g-none";
          var badge = '<span class="bt-badge ' + cls + '">' + op.badge + "</span>";
          var head = op.label ? '<div class="bt-opt-label">' + brEsc(op.label) + "</div>" : "";
          var desc = op.lines.map(function(l) { return "<div>" + l + "</div>"; }).join("");
          rows.push('<div class="bt-row bt-opt">' + badge + '<div class="bt-opt-body">' + head +
            '<div class="bt-opt-desc' + (op.label ? "" : " bt-nolabel") + '">' + desc + "</div></div></div>");
        });
      } else {
        rows.push('<div class="bt-row bt-sec-title">' + (v.value.Element_000 || "") + "</div>");
        brSegments(v.value.Element_001 || "").forEach(function(sg) { rows.push('<div class="bt-row">' + sg.html + "</div>"); });
      }
    } else if ((v.type === "SingleTextBox" || v.type === "MultiTextBox") && v.value) {
      var raw = String(v.value || ""), t = strip(raw);
      if (v.type === "SingleTextBox" && /판매|파괴|분해/.test(t) && t.length > 30 && !/판매\s*불가|파괴\s*불가|분해\s*불가|거래\s*불가/.test(t)) continue;
      if (/가디언|레이드|획득처/.test(t) && !/거래 제한|캐릭터 귀속|효과 부여 불가/.test(t)) continue;
      if (/판매\s*불가|파괴\s*불가|분해\s*불가|거래\s*불가/.test(t) && t.length < 40) rows.push('<div class="bt-row bt-warn">' + stripBars(t) + "</div>");
      else brSegments(raw.replace(/\|\|/g, "<br>")).forEach(function(sg) {
        rows.push('<div class="bt-row ' + (/효과 부여 불가/.test(sg.text) ? "bt-warn" : "bt-info") + '">' + sg.html + "</div>");
      });
    } else if (v.type === "IndentStringGroup" && v.value) {
      var cs = v.value.contentStr || {};
      rows.push('<div class="bt-row bt-sec-title">' + (v.value.topStr || "") + "</div>");
      for (var ck of Object.keys(cs)) {
        if (cs[ck]?.contentStr) rows.push('<div class="bt-row">' + cs[ck].contentStr + "</div>");
      }
    }
  }
  if (!name) name = title || "";
  var bc = nameColor ? ' style="border-color:' + nameColor + '"' : "";
  var hd = '<div class="tip-hd bt-hd">' +
    '<div class="bt-ic-wrap"' + bc + ">" + (icon ? '<img class="bt-ic" src="' + icon + '" alt="">' : "") + "</div>" +
    '<div class="bt-hd-text"><div class="bt-name">' + name + "</div>" +
    subs.map(function(s) { return '<div class="bt-sub">' + s + "</div>"; }).join("") + "</div></div>";
  return hd + '<div class="tip-bd bt-bd">' + rows.join("") + "</div>";
}

function buildArkPassiveTipHtml(effect, fallbackName) {
  var tip = parseTip(effect?.ToolTip || effect?.Tooltip);
  var name = fallbackName || "";
  var catHtml = "", levelHtml = "", icon = effect?.Icon || "", bodyHtml = "";
  if (tip) {
    for (var k of Object.keys(tip).sort()) {
      var v = tip[k];
      if (!v?.type) continue;
      if (v.type === "NameTagBox" && v.value) name = strip(v.value) || name;
      else if (v.type === "CommonSkillTitle" && v.value) {
        catHtml = v.value.name || "";
        levelHtml = v.value.leftText || "";
        var path = v.value.slotData?.iconPath;
        if (path && !icon) icon = path;
      } else if (v.type === "MultiTextBox" && v.value) {
        bodyHtml = String(v.value).replace(/\|\|/g, "<br>").replace(/<BR\s*\/?>/gi, "<br>").replace(/(<br\s*\/?>\s*)+$/i, "").trim();
      }
    }
  }
  if (!name) name = strip(effect?.Description) || "아크 패시브";
  if (!bodyHtml && effect?.Description) bodyHtml = strip(effect.Description);
  var iconHtml = icon
    ? `<div class="apt-tip-icon"><img class="apt-tip-ic" src="${icon}" alt=""></div>`
    : `<div class="apt-tip-icon empty"></div>`;
  return `
    <div class="tip-hd apt-tip-title">${name}</div>
    <div class="tip-bd apt-tip-body">
      <div class="apt-tip-top">
        ${iconHtml}
        <div class="apt-tip-meta">
          <div class="apt-tip-row"><span class="apt-tip-cat">${catHtml || ""}</span><span class="apt-tip-learned">습득</span></div>
          <div class="apt-tip-level">${levelHtml || ""}</div>
        </div>
      </div>
      ${bodyHtml ? `<div class="apt-tip-desc">${bodyHtml}</div>` : ""}
    </div>`;
}

function formatNirvana(n) {
  if (!n) return "";
  var v = parseInt(n, 10);
  if (v >= 100000000) return (v / 100000000).toFixed(1).replace(/\.0$/, "") + "억";
  if (v >= 10000) return Math.round(v / 10000) + "만";
  return v.toLocaleString();
}

function showTip(e, html) {
  if (!html) return;
  if (!tipEl) tipEl = document.getElementById("loa-tip");
  if (!tipEl) return;
  tipEl.innerHTML = html.replace(/<img\b(?![^>]*\bclass=)[^>]*>(<\/img>)?/gi, "");
  tipEl.classList.add("show");
  tipOn = true;
  moveTip(e);
}

function moveTip(e) {
  if (!tipOn || !tipEl) return;
  var pad = 14, r = tipEl.getBoundingClientRect();
  var x = e.clientX + pad, y = e.clientY + pad;
  if (x + r.width > innerWidth - 8) x = e.clientX - r.width - pad;
  if (y + r.height > innerHeight - 8) y = e.clientY - r.height - pad;
  tipEl.style.left = Math.max(8, x) + "px";
  tipEl.style.top = Math.max(8, y) + "px";
}

function hideTip() { 
  if (tipEl) tipEl.classList.remove("show"); 
  tipOn = false; 
}
document.addEventListener("mousemove", moveTip);

function bindTip(el, html) {
  if (!html) return;
  el.addEventListener("mouseenter", function(e) { showTip(e, html); });
  el.addEventListener("mouseleave", hideTip);
}

// 순정 상태의 특수 스킬 매핑
var SPECIAL_SKILL_ICONS = {
  "블러디 러쉬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/bk_skill/bk_skill_01_11.png",
  "다크 러쉬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_243.png",
  "전장의 창": "https://cdn-lostark.game.onstove.com/efui_iconatlas/gl_skill/gl_skill_01_42.png",
  "중력 가중 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/dt_skill/dt_skill_01_20.png",
  "심판자 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_hk/ark_passive_hk_5.png",
  "신앙 스킬": {
    "홀리나이트": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_hk/ark_passive_hk_5.png",
    "발키리": "https://cdn-lostark.game.onstove.com/efui_iconatlas/hkf_skill/hkf_skill_01_24.png"
  },
  

  "떠오르는 달": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_yy/ark_passive_yy_8.png",
  "블러드러스트": "https://cdn-lostark.game.onstove.com/efui_iconatlas/bk_skill/bk_skill_01_11.png",
  "종언의 빛": "https://cdn-lostark.game.onstove.com/efui_iconatlas/hkf_skill/hkf_skill_01_24.png",
  "권왕십이식": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_ifm/ark_passive_ifm_2.png",
  "포격 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/bs_skill/bs_skill_01_8.png",
  "실버호크 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/he_skill/he_skill_01_21.png",
  "EX - 제로 포인트": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_sc/ark_passive_sc_5.png",
  "로즈 블로섬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/dh_skill/dh_skill_01_61.png",
  "고대의 정령 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/dh_skill/dh_skill_01_61.png",
  "황제": "https://cdn-lostark.game.onstove.com/efui_iconatlas/dh_skill/dh_skill_01_61.png",
  "블레이드 버스트": "https://cdn-lostark.game.onstove.com/efui_iconatlas/bl_skill/bl_skill_01_21.png",
  "블러드 제노사이드": "https://cdn-lostark.game.onstove.com/efui_iconatlas/dm_skill/dm_skill_01_36.png",
  "수라결 기본 공격": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ifm_skill/ifm_skill_01_27.png",
  "인페르노 버스트": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ddk_skill/ddk_skill_01_25.png",
  "음양 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/yy_skill/yy_skill_01_3.png",
  "여우비 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/wa_skill/wa_skill_01_22.png",
  "둔갑 금술 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_dr/ark_passive_dr_2.png",
  "세레나데 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_hk/ark_passive_hk_5.png",
  "시간선 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_di/ark_passive_di_6.png",
  "간섭": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_di/ark_passive_di_7.png"
};

function parseGemSkillName(g) {
  var tip = parseTip(g.Tooltip);
  var blob = tip ? JSON.stringify(tip) : (typeof g.Tooltip === "string" ? g.Tooltip : "");
  var plain = blob.replace(/<[^>]+>/g, " ").replace(/\\"/g, '"');
  var m = plain.match(/\[([^\]]+)\]\s*([^\[\]\n]*?)\s*지원\s*효과/);
  if (m) return m[2].replace(/\s+/g, " ").trim();
  m = blob.match(/COLOR=['"]#FFD200['"]>([^<]+)<\/FONT>\s*(?:피해|재사용|지원\s*효과)/i);
  if (m) return m[1].replace(/<[^>]+>/g, "").trim();
  m = plain.match(/\[[^\]]+\]\s*([^\[\]\n]+?)\s*(?:피해|재사용)/);
  if (m) return m[1].replace(/\s+/g, " ").trim();
  m = plain.match(/([가-힣A-Za-z0-9][가-힣A-Za-z0-9\s\-]{0,40}?)\s*(?:피해|재사용)\s*[0-9.]/);
  if (m) return m[1].replace(/\s+/g, " ").trim();
  m = plain.match(/([가-힣A-Za-z0-9\s\-]+?\s*스킬)\s*(?:피해|재사용|지원\s*효과)/);
  if (m) return m[1].replace(/\s+/g, " ").trim();
  return "";
}

function getSwiftCdPct(stats) {
  var s = (stats || []).find(x => x.Type === "신속");
  if (!s || !Array.isArray(s.Tooltip)) return 0;
  var lines = s.Tooltip.map(l => String(l).replace(/<[^>]+>/g, ""));
  for (var re of [/재사용\s*대기\s*시간이?\s*([0-9.]+)\s*%\s*감소/, /공격\s*속도가\s*([0-9.]+)\s*%\s*증가/]) {
    for (var l of lines) { var m = l.match(re); if (m) return parseFloat(m[1]); }
  }
  return 0;
}

function parseGemCoolPct(g) {
  var tip = parseTip(g.Tooltip);
  var blob = (tip ? JSON.stringify(tip) : String(g.Tooltip || "")).replace(/<[^>]+>/g, "");
  var m = blob.match(/재사용\s*대기\s*시간\s*([0-9.]+)\s*%\s*감소/);
  return m ? parseFloat(m[1]) : 0;
}

function buildSkillGemMap(gemData) {
  var map = {};
  for (var g of (gemData?.Gems || [])) {
    var sk = parseGemSkillName(g);
    if (!sk) continue;
    if (!map[sk]) map[sk] = {};
    if (gemIsCooldown(g)) { 
      map[sk].cool = g.Level; 
      map[sk].coolIcon = g.Icon; 
      map[sk].coolGrade = g.Grade; 
      map[sk].coolPct = parseGemCoolPct(g); 
      map[sk].coolTip = g.Tooltip; 
      map[sk].coolName = g.Name; 
    } else { 
      map[sk].dmg = g.Level; 
      map[sk].dmgIcon = g.Icon; 
      map[sk].dmgGrade = g.Grade; 
      map[sk].dmgTip = g.Tooltip; 
      map[sk].dmgName = g.Name; 
    }
  }
  return map;
}