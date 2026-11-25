/* ===== 이관 탭 렌더 (app-render-igwan.js) ===== */
(function (global) {
  "use strict";

  var IGWAN_ICONS = {
    necklace: "https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_218.png",
    earring:  "https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_118.png",
    ring:     "https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_25.png",
    braceletAncient: "https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_302.png",
    braceletRelic:   "https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_301.png",
    braceletLegend:  "https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_300.png",
    scroll:   "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_9_6.png",
    waistband: "img/waistband.webp",
    sacred:    "img/Sacredobject.webp",
    seal:      "img/seal.webp",
    engravingSlot: "https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_115.png"
  };

  var ARMOR_TO_ACC = {
    "투구": { acc: "목걸이", icon: IGWAN_ICONS.necklace },
    "어깨": { acc: "귀걸이", icon: IGWAN_ICONS.earring },
    "상의": { acc: "귀걸이", icon: IGWAN_ICONS.earring },
    "하의": { acc: "반지",   icon: IGWAN_ICONS.ring },
    "장갑": { acc: "반지",   icon: IGWAN_ICONS.ring }
  };

  // 공식 이관표 기준 (min 초과 ~ max 이하). delta = 이관 레벨 - max
  // 일반: 1795~1800 → 1815 3연마
  // 에스더는 lookupRule(ilvl, true)에서 별도 처리 (1830→1865 5연마 등)
  var LEVEL_RULES = [
    { min: 1795, max: 1800, after: 1815, grade: "고대", yeonma: 3, delta: 15 },
    { min: 1790, max: 1795, after: 1810, grade: "고대", yeonma: 2, delta: 15 },
    { min: 1785, max: 1790, after: 1800, grade: "고대", yeonma: 0, delta: 10 },
    { min: 1780, max: 1785, after: 1795, grade: "유물", yeonma: 4, delta: 10 },
    { min: 1775, max: 1780, after: 1790, grade: "유물", yeonma: 3, delta: 10 },
    { min: 1770, max: 1775, after: 1785, grade: "유물", yeonma: 2, delta: 10 },
    { min: 1765, max: 1770, after: 1770, grade: "전설", yeonma: 4, delta: 0 },
    { min: 1760, max: 1765, after: 1765, grade: "전설", yeonma: 3, delta: 0 },
    { min: 1755, max: 1760, after: 1760, grade: "전설", yeonma: 2, delta: 0 },
    { min: 1750, max: 1755, after: 1755, grade: "전설", yeonma: 1, delta: 0 },
    { min: 1745, max: 1750, after: 1750, grade: "전설", yeonma: 0, delta: 0 },
    { min: 1740, max: 1745, after: 1745, grade: "영웅", yeonma: 4, delta: 0 },
    { min: 1735, max: 1740, after: 1740, grade: "영웅", yeonma: 3, delta: 0 },
    { min: 1730, max: 1735, after: 1735, grade: "영웅", yeonma: 2, delta: 0 },
    { min: 1725, max: 1730, after: 1730, grade: "영웅", yeonma: 1, delta: 0 },
    { min: 1720, max: 1725, after: 1725, grade: "영웅", yeonma: 0, delta: 0 },
    { min: 1715, max: 1720, after: 1720, grade: "희귀", yeonma: 4, delta: 0 },
    { min: 1710, max: 1715, after: 1715, grade: "희귀", yeonma: 3, delta: 0 },
    { min: 1705, max: 1710, after: 1710, grade: "희귀", yeonma: 2, delta: 0 },
    { min: 1700, max: 1705, after: 1705, grade: "희귀", yeonma: 1, delta: 0 },
    { min: 1695, max: 1700, after: 1700, grade: "희귀", yeonma: 0, delta: 0 },
    { min: 1690, max: 1695, after: 1695, grade: "고급", yeonma: 4, delta: 0 },
    { min: 1685, max: 1690, after: 1690, grade: "고급", yeonma: 3, delta: 0 },
    { min: 1680, max: 1685, after: 1685, grade: "고급", yeonma: 2, delta: 0 },
    { min: 1675, max: 1680, after: 1680, grade: "고급", yeonma: 1, delta: 0 },
    { min: 1600, max: 1675, after: 1675, grade: "고급", yeonma: 0, delta: 0 }
  ];

  var ARMOR_ORDER = ["투구", "어깨", "상의", "하의", "장갑"];
  var ACC_ORDER = ["목걸이", "귀걸이", "귀걸이", "반지", "반지", "어빌리티 스톤", "팔찌"];

  // 로아 API 등급색 (툴팁 아이템명 색상). 장비 툴팁에서 읽어오고, 없으면 공식 기본값 사용
  var GRADE_COLOR = {
    "고대": "#E3C7A1",
    "유물": "#FA5D00",
    "전설": "#F99200",
    "영웅": "#8045DD",
    "희귀": "#00B0FA",
    "고급": "#4FC93C"
  };

  /** 장착 아이템 툴팁(이름 색상)에서 등급색을 읽어 덮어쓰기 */
  function learnGradeColors(list) {
    (list || []).forEach(function (it) {
      try {
        if (!it || !it.Grade || !it.Tooltip || !GRADE_COLOR[it.Grade]) return;
        var tip = typeof it.Tooltip === "string" ? it.Tooltip : JSON.stringify(it.Tooltip);
        var m = /Element_000[\s\S]{0,500}?COLOR\s*=\s*\\?['"]?(#[0-9A-Fa-f]{6})/i.exec(tip);
        if (m) GRADE_COLOR[it.Grade] = m[1].toUpperCase();
      } catch (e) {}
    });
  }

  function shadeHex(hex, f) {
    var n = parseInt(String(hex).replace("#", ""), 16);
    var r = Math.round(((n >> 16) & 255) * f), g = Math.round(((n >> 8) & 255) * f), b = Math.round((n & 255) * f);
    return "#" + [r, g, b].map(function (x) { return ("0" + Math.max(0, Math.min(255, x)).toString(16)).slice(-2); }).join("");
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function gradeColor(g) { return GRADE_COLOR[g] || "#9aa3b5"; }
  // 아이템 아이콘 배경 (인게임 아이콘 배경색 참고, 한 톤 어둡게)
  var GRADE_BG = {
    "유물": "linear-gradient(135deg,#4a1d0b,#7a3310 55%,#331409)",
    "전설": "linear-gradient(135deg,#46300a,#735013 55%,#2d1f08)",
    "영웅": "linear-gradient(135deg,#2b1649,#4a2c70 55%,#1b0e30)",
    "희귀": "linear-gradient(135deg,#0f2840,#1c4568 55%,#0a1a2b)",
    "고급": "linear-gradient(135deg,#1b3310,#345621 55%,#112208)"
  };
  function gradeBg(g) {
    if (GRADE_BG[g]) return GRADE_BG[g];
    var c = GRADE_COLOR[g];
    if (!c) return "linear-gradient(145deg,#2a3148,#1a1f2e)";
    return "linear-gradient(135deg," + shadeHex(c, 0.28) + "," + shadeHex(c, 0.92) + ")";
  }

  /** 심볼(뱃지) 공통 규격: 등급/레벨/연마/장비레벨 심볼 모두 동일 크기·테두리·글자크기(볼드 없음)·세로 가운데 정렬. 아이템명보다 작게
   *  BDG_NUDGE: 글자가 위로 쏠려 보이면 값을 키우고(1~3), 아래로 쏠리면 줄이세요 (px) */
  var BDG_H = 18, BDG_FS = 11, BDG_NUDGE = 1;
  var BDG_BASE = "box-sizing:border-box!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;" +
    "height:var(--ig-bh," + BDG_H + "px)!important;min-height:0!important;padding:" + BDG_NUDGE + "px var(--ig-bpx,7px) 0!important;margin-top:0!important;margin-bottom:0!important;" +
    "font-size:var(--ig-bfs," + BDG_FS + "px)!important;font-weight:400!important;line-height:1!important;" +
    "border-width:1px!important;border-style:solid!important;border-radius:5px!important;white-space:nowrap;vertical-align:middle;";
  function bdgStyle(c) {
    return BDG_BASE + "color:" + c + "!important;border-color:" + c + "!important;background:" + c + "26!important;";
  }
  function yeonBadge(n, grade, colorOverride) {
    var c = colorOverride || gradeColor(grade);
    return '<span class="ig-bdg ig-bdg-yeon" style="' + bdgStyle(c) + '">' + n + '연마</span>';
  }
  function lvBadge(lv, grade, colorOverride) {
    var c = colorOverride || gradeColor(grade);
    return '<span class="ig-bdg ig-bdg-lv" style="' + bdgStyle(c) + '">' + lv + '</span>';
  }
  function gradePill(g, colorOverride) {
    var c = colorOverride || gradeColor(g);
    return '<span class="ig-bdg ig-bdg-grade" style="' + bdgStyle(c) + '">' + esc(g) + '</span>';
  }
  /** 이관 전 장비레벨 심볼 (색은 기존 CSS 유지, 크기/테두리 두께만 통일) */
  function beforeBadge(txt) {
    return '<span class="ig-bdg ig-bdg-before" style="' + BDG_BASE + '">' + esc(txt) + '</span>';
  }
  /** 심볼 순서: 장비레벨 → 연마 (등급은 별도 gradePill) */
  function ruleBadges(rule, colorOverride) {
    return lvBadge(rule.after, rule.grade, colorOverride) + yeonBadge(rule.yeonma, rule.grade, colorOverride);
  }

  function gradeClass(g) {
    if (g === "고대") return "ancient";
    if (g === "유물") return "relic";
    if (g === "전설") return "legend";
    if (g === "영웅") return "hero";
    return "";
  }

  /** 아이템 레벨 (소수점 유지, 평균용) */
  function parseItemLevelFloat(item) {
    if (!item) return 0;
    var tip = item.Tooltip || "";
    var m = /아이템\s*레벨\s*([0-9]+(?:\.[0-9]+)?)/.exec(tip);
    if (m) return parseFloat(m[1]);
    if (item.ItemLevel != null) return Number(item.ItemLevel) || 0;
    return 0;
  }
  /** 아이템 레벨 (내림, 이관 구간 조회용) */
  function parseItemLevel(item) {
    return Math.floor(parseItemLevelFloat(item));
  }

  function parseUpgrade(item) {
    var name = String((item && item.Name) || "").replace(/<[^>]+>/g, "");
    var m = /\+(\d+)/.exec(name);
    return m ? parseInt(m[1], 10) : 0;
  }

  /**
   * 이관 전 강화 추천 (에스더 제외)
   * 공식표 기준: +20(1775)부터 +10 보정, +24(1795)/+25(1800)는 +15 보정
   * @returns {{ goal: number, reason: string }|null}
   */
  function honeRecommend(up, isWeapon) {
    up = up | 0;
    if (up >= 18 && up < 20) {
      return { goal: 20, reason: "+20(1775)부터 이관 보정 +10. 보정 구간 진입 추천" };
    }
    if (up === 22) {
      return { goal: 23, reason: "+23(1790)→이관 1800. 1강으로 +10 보정 유지·레벨 상승" };
    }
    if (up === 24) {
      return { goal: 25, reason: "+25(1800)→이관 1815(+15). 표상 최상위 구간" };
    }
    if (!isWeapon && up === 21) {
      return { goal: 23, reason: "+23(1790)→이관 1800. 방어구는 비용 부담이 상대적으로 적어 +23 추천" };
    }
    if (isWeapon && up >= 15 && up < 18) {
      return { goal: 20, reason: "무기 최소 +20(1775) 권장. 이관 보정 +10 구간 진입" };
    }
    return null;
  }

  /** 추천 강 달성 시 예상 아이템 레벨 (1675 베이스 +5/강) */
  function honeToIlvl(goal) {
    return 1675 + (goal | 0) * 5;
  }

  /** 이관 전 장비 우측 상단 떠다니는 추천 말풍선 (클릭 시 미니 툴팁)
   *  +N강 색상 = 해당 강 달성 후 이관 시 장비 등급색 (전설/유물/고대) */
  function honeBubble(up, isWeapon, key) {
    var rec = honeRecommend(up, isWeapon);
    if (!rec) return "";
    var k = key || ("h" + up + (isWeapon ? "w" : "a"));
    var afterRule = lookupRule(honeToIlvl(rec.goal));
    var g = afterRule.grade || "유물";
    var col = gradeColor(g);
    return '<div class="ig-hone-bubble ig-hb-' + esc(g) + '" data-ig-hone="' + esc(k) + '" data-reason="' + esc(rec.reason) + '" data-goal="' + rec.goal + '" data-grade="' + esc(g) + '">' +
      '추천 <b>+' + rec.goal + '강</b> <span class="ig-hb-detail">자세히</span>' +
      '</div>';
  }

  /** 추천 말풍선 클릭 → 미니 툴팁 / X로 해당 풍선 숨김 (새로고침 시 다시 표시) */
  function bindHoneBubbles(root) {
    if (!root) return;
    var panel = root.querySelector("#igwanPanel") || root;
    // 기존 팝업 제거
    var old = panel.querySelector(".ig-hone-pop");
    if (old) old.remove();

    panel.querySelectorAll(".ig-hone-bubble").forEach(function (bub) {
      if (bub._igBound) return;
      bub._igBound = true;
      bub.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        // 다른 팝업 닫기
        var exist = panel.querySelector(".ig-hone-pop");
        if (exist) exist.remove();

        var reason = bub.getAttribute("data-reason") || "";
        var goal = bub.getAttribute("data-goal") || "";
        var pop = document.createElement("div");
        pop.className = "ig-hone-pop";
        pop.innerHTML =
          '<button type="button" class="ig-hone-pop-x" aria-label="닫기">×</button>' +
          '<div class="ig-hone-pop-title">추천 +' + goal + '강</div>' +
          '<div class="ig-hone-pop-body">' + reason + '</div>';
        // 위치: 말풍선 근처
        var rect = bub.getBoundingClientRect();
        var host = bub.closest(".ig-side-rel") || bub.parentNode;
        if (host && host.style) host.style.position = host.style.position || "relative";
        host.appendChild(pop);
        // 풍선 오른쪽에 맞춤
        pop.style.top = "0";
        pop.style.right = "0";
        pop.style.transform = "translateY(-100%)";

        pop.querySelector(".ig-hone-pop-x").addEventListener("click", function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          pop.remove();
          bub.style.display = "none"; // 해당 풍선만 숨김 (재진입 시 다시 렌더되어 표시)
        });
      });
    });
  }

  /** 에스더 무기 여부 (이름/툴팁에 에스더 포함) */
  function isEstherWeapon(item) {
    if (!item) return false;
    var name = String((item && item.Name) || "").replace(/<[^>]+>/g, "");
    if (/에스더/.test(name)) return true;
    var tip = String(item.Tooltip || "");
    if (/에스더/.test(tip)) return true;
    return false;
  }

  /**
   * 이관 후 재련(슬롯) 단계.
   * 공식표: 진화10/엘라3 → +25, 진화9/엘라3 → +25 등.
   * 1800+ 에스더 보유 시 완갑·허리띠·성물·인장·팔찌는 25단계 무기 기준으로 지급.
   * forceEstherHigh=true 이면 (에스더 무기 기준) 무조건 25 반환.
   */
  /**
   * 이관 후 재련(슬롯) 단계.
   * - 에스더 1800+ (또는 forceEstherHigh): 25단계
   * - 그 외 일반 무기/완갑: 현재 강화 단계 유지
   */
  function transferSlotStage(item, forceEstherHigh) {
    if (forceEstherHigh) return 25;
    var up = parseUpgrade(item);
    var il = 0;
    try {
      var tip = (item && item.Tooltip) || "";
      var m = /아이템\s*레벨\s*([0-9]+(?:\.[0-9]+)?)/.exec(tip);
      if (m) il = Math.floor(parseFloat(m[1]));
      else if (item && item.ItemLevel) il = Math.floor(Number(item.ItemLevel) || 0);
    } catch (e) {}
    // 에스더 무기 1800+ (또는 강화 9+) → 25단계
    if (isEstherWeapon(item) && (il >= 1800 || up >= 9)) return 25;
    // 일반: 현재 강화 단계 유지 (22강 → 22, 20강 → 20)
    return Math.max(0, up);
  }

  function parseQuality(item) {
    if (typeof tipQuality === "function" && item && item.Tooltip) {
      try {
        var tip = typeof parseTip === "function" ? parseTip(item.Tooltip) : null;
        if (tip) {
          var q = tipQuality(tip);
          if (q != null && !isNaN(q)) return q | 0;
        }
      } catch (e) {}
    }
    var tip = (item && item.Tooltip) || "";
    var m = /품질\s*([0-9]+)/.exec(tip);
    if (m) return parseInt(m[1], 10);
    m = /"qualityValue"\s*:\s*([0-9]+)/i.exec(tip);
    if (m) return parseInt(m[1], 10);
    return 0;
  }

  function cleanName(item) {
    return String((item && item.Name) || "").replace(/<[^>]+>/g, "").trim();
  }

  function shortName(item, fallback) {
    var n = cleanName(item);
    if (!n) return fallback || "";
    if (n.length > 16) n = n.slice(0, 15) + "…";
    return n;
  }

  /** 표시용: "+24 투구" / "+25 무기" */
  function slotTitle(item, typeLabel) {
    var up = parseUpgrade(item);
    var label = typeLabel || shortArmorLabel((item && item.Type) || "") || "";
    if (up) return "+" + up + " " + label;
    return label || shortName(item, label);
  }

  /** 이관 전 이름: 강화수(+N)는 등급색, 부위명(투구/무기 등)은 흰색 */
  function slotTitleHtml(item, typeLabel, grade) {
    var up = parseUpgrade(item);
    var label = typeLabel || shortArmorLabel((item && item.Type) || "") || "";
    var col = gradeColor(grade || (item && item.Grade) || "고대");
    if (up) {
      return '<span style="color:' + col + '">+' + up + '</span> <span style="color:#e8eef8">' + esc(label) + '</span>';
    }
    return '<span style="color:#e8eef8">' + esc(label || shortName(item, label)) + '</span>';
  }

  function shortArmorLabel(type) {
    return type === "어깨" ? "견갑" : (type || "");
  }
  function accSlotLabel(type) {
    if (type === "어빌리티 스톤") return "스톤";
    if (type === "목걸이") return "목걸이";
    if (type === "귀걸이") return "귀걸이";
    if (type === "반지") return "반지";
    if (type === "팔찌") return "팔찌";
    return type || "";
  }
  function stoneOptsHtml(item) {
    if (!item) return "";
    var grade = item.Grade || "고대";
    var parts = [gradePill(grade)];
    try {
      if (typeof parseTip === "function" && typeof parseStoneEngraves === "function") {
        var tip = parseTip(item.Tooltip || "");
        var engs = parseStoneEngraves(tip).filter(function (en) { return !en.bonus; });
        engs.forEach(function (en) {
          var nm = en.name || en.Name || "";
          var lv = en.lv != null ? en.lv : (en.level != null ? en.level : (en.Level != null ? en.Level : en.value));
          if (nm) parts.push('<span class="ig-stone-opt">[' + esc(nm) + ' ' + esc(lv) + ']</span>');
        });
      }
    } catch (e) {}
    return parts.join(" ");
  }

  /**
   * 이관 레벨 규칙 조회.
   * isEsther=true 이면 에스더 전용 고구간 적용:
   *   1825+ → 1865 5연마 (진화10/엘라3)
   *   1800~1824 → 1840 0연마 (진화9/엘라3)
   * 일반 무기는 LEVEL_RULES만 사용 (1795~1800 → 1815 3연마)
   */
  function lookupRule(ilvl, isEsther) {
    if (isEsther) {
      if (ilvl > 1825) return { min: 1825, max: 1835, after: 1865, grade: "고대", yeonma: 5, delta: 35 };
      if (ilvl > 1800) return { min: 1800, max: 1825, after: 1840, grade: "고대", yeonma: 0, delta: 40 };
      // 에스더 1800 이하: 일반표와 동일 구간 사용
    }
    for (var i = 0; i < LEVEL_RULES.length; i++) {
      var r = LEVEL_RULES[i];
      if (ilvl > r.min && ilvl <= r.max) return r;
    }
    if (ilvl > 1800) return LEVEL_RULES[0]; // 일반 최고구간 (1815)
    return LEVEL_RULES[LEVEL_RULES.length - 1];
  }

  function qualityBar(q) {
    q = Math.max(0, Math.min(100, q | 0));
    var w = q >= 100 ? 100 : Math.max(8, q);
    var fill = q >= 100
      ? "linear-gradient(90deg,#e8b84b,#ffd76a)"
      : "linear-gradient(90deg,#5b9cf5,#7eb6ff)";
    return '<div class="ig-qbar"><div class="ig-qfill" style="width:' + w + '%;background:' + fill + '"></div><span class="ig-qnum">' + q + '</span></div>';
  }

  /** 정보탭 스타일 아이콘: 등급 테두리 + 배경 */
  function iconBox(src, grade, fallbackText, size, opts) {
    size = size || "md";
    opts = opts || {};
    var col = opts.color || gradeColor(grade);
    var bg = opts.bg || gradeBg(grade);
    var cls = "ig-ic ig-ic-" + size + (grade ? (" grade-" + gradeClass(grade)) : "");
    var style = "border:1px solid " + col + ";box-shadow:0 0 0 1px " + col + "44;background:" + (bg || "#1a1f2e") + ";";
    if (src) {
      return '<div class="' + cls + '" style="' + style + '"><img src="' + esc(src) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'"></div>';
    }
    return '<div class="' + cls + '" style="' + style + '"><span class="ig-ic-fb" style="color:' + col + '">' + esc(fallbackText || "") + "</span></div>";
  }

  function arrowSvg(big) {
    var s = big ? 26 : 18;
    return '<span class="ig-arrow"><svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24"><path fill="#8b7cff" d="M8 5 L15 12 L8 19 L10.5 19 L17.5 12 L10.5 5 Z"/><path fill="#8b7cff" opacity=".45" d="M2 5 L9 12 L2 19 L4.5 19 L11.5 12 L4.5 5 Z"/></svg></span>';
  }

  /** 컬럼 상단 "이관 전 → 이관 후" 구분 */
  function flowHead(acc) {
    return '<div class="ig-flow-head' + (acc ? ' acc' : '') + '"><span class="ig-fh ig-fh-before">이관 전</span>' +
      '<span class="ig-fh-mid">' + arrowSvg() + '</span><span class="ig-fh ig-fh-after">이관 후</span></div>';
  }

  function findByType(list, type, nth) {
    nth = nth || 0;
    var n = 0;
    for (var i = 0; i < list.length; i++) {
      if (list[i].Type === type) {
        if (n === nth) return list[i];
        n++;
      }
    }
    return null;
  }

  // ---- 주문서 등급: 공개 표 기준 (상/중/하 조합) ----
  // 딜러 유효 옵션
  var DEALER_VALID = {
    "목걸이": [
      [/추가\s*피해/, 1], [/적에게\s*주는\s*피해/, 1],
      [/공격력\s*\+/, 3], [/무기\s*공격력\s*\+/, 3]
    ],
    "귀걸이": [
      [/공격력\s*%/, 1], [/무기\s*공격력\s*%/, 1],
      [/공격력\s*\+/, 3], [/무기\s*공격력\s*\+/, 3]
    ],
    "반지": [
      [/치명타\s*적중/, 1], [/치명타\s*피해/, 1],
      [/공격력\s*\+/, 3], [/무기\s*공격력\s*\+/, 3]
    ]
  };
  // 서폿 유효 옵션
  var SUPPORT_VALID = {
    "목걸이": [
      [/낙인력/, 1], [/세레나데/, 1], [/신앙/, 1], [/조화\s*게이지/, 1],
      [/무기\s*공격력\s*\+/, 3], [/최대\s*생명력\s*\+/, 3]
    ],
    "귀걸이": [
      [/무기\s*공격력\s*%/, 1], [/무기\s*공격력\s*\+/, 1],
      [/최대\s*생명력\s*\+/, 3], [/보호막/, 3], [/회복\s*효과/, 3]
    ],
    "반지": [
      [/아군\s*공격력\s*강화/, 1], [/아군\s*피해량\s*강화/, 1],
      [/무기\s*공격력\s*\+/, 3], [/최대\s*생명력\s*\+/, 3]
    ]
  };

  function isSupportClass(fullData) {
    try {
      var cls = (fullData && fullData.ArmoryProfile && fullData.ArmoryProfile.CharacterClassName) || "";
      return /바드|도화가|홀리나이트|기상술사/.test(cls);
    } catch (e) { return false; }
  }

  function parseAccOptList(item) {
    var out = [];
    if (!item || !item.Tooltip) return out;
    try {
      var tip = (typeof parseTip === "function") ? parseTip(item.Tooltip) : null;
      if (!tip) {
        try { tip = JSON.parse(item.Tooltip); } catch (e) { tip = null; }
      }
      if (!tip) return out;
      var body = "";
      if (typeof tipParts === "function") {
        var parts = tipParts(tip);
        var polish = parts.find(function (p) { return /연마|추가 효과/.test(p.title || ""); });
        if (polish && polish.body) body = polish.body;
      }
      if (!body) body = typeof item.Tooltip === "string" ? item.Tooltip : JSON.stringify(tip);

      body.split(/<br\s*\/?>/i).forEach(function (raw) {
        var clean = String(raw || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        if (!clean || clean.length < 2) return;
        var badge = null;
        var name = clean;
        var om = clean.match(/^(.+?)\s*\+\s*([0-9.]+)\s*(%?)/);
        if (om && typeof gradeFromOptValue === "function") {
          badge = gradeFromOptValue(om[1].trim(), parseFloat(om[2]));
          name = om[1].trim() + (om[3] === "%" ? " %" : " +");
        }
        if (!badge && typeof tierFromColor === "function") {
          var tier = tierFromColor(raw);
          badge = tier === "sang" ? "상" : tier === "jung" ? "중" : tier === "ha" ? "하" : null;
        }
        if (!badge) {
          if (/#?FE9600/i.test(raw)) badge = "상";
          else if (/#?A235FF/i.test(raw)) badge = "중";
          else if (/#?00B5FF/i.test(raw)) badge = "하";
        }
        if (!badge) return;
        if (om) name = om[1].trim() + (om[3] === "%" ? "%" : "+");
        out.push({ name: name, badge: badge, raw: clean });
      });
    } catch (e) {}
    return out;
  }

  function isValidOpt(optName, slotType, support) {
    var table = support ? SUPPORT_VALID[slotType] : DEALER_VALID[slotType];
    if (!table) return true;
    var n = String(optName || "");
    for (var i = 0; i < table.length; i++) {
      if (table[i][0].test(n)) return true;
    }
    // 퍼센트/플러스 변형 매칭 완화
    var n2 = n.replace(/\s+/g, "");
    for (var j = 0; j < table.length; j++) {
      if (table[j][0].test(n2)) return true;
    }
    return false;
  }

  /** 옵션의 공개표 슬롯 가중치: 1 = 1·2옵션(%류), 3 = 3옵션(고정수치), 0 = 표에 없음 */
  function optWeight(opt, slotType, support) {
    var table = support ? SUPPORT_VALID[slotType] : DEALER_VALID[slotType];
    if (!table) return 0;
    function w(str) {
      var n = String(str || ""), n2 = n.replace(/\s+/g, "");
      for (var i = 0; i < table.length; i++) {
        if (table[i][0].test(n) || table[i][0].test(n2)) return table[i][1];
      }
      return 0;
    }
    // 이름(%/+ 구분 완료된 값)을 우선 보고, 매칭 안 될 때만 raw 사용
    return w(opt.name) || w(opt.raw);
  }

  function supportEarringSpecial(opts) {
    // 서폿 귀걸이 3옵션 특수: 최대 생명력 / 보호막 / 회복
    var third = opts[2] || opts[opts.length - 1];
    if (!third) return null;
    var n = third.name || third.raw || "";
    if (/최대\s*생명력/.test(n)) return "life";
    if (/보호막|회복/.test(n)) return "shield";
    return null;
  }

  /**
   * 1·2옵션(%류) 조합 + 3옵션 → 주문서 등급 (공개표 기준)
   * 딜러 전 부위 / 서폿 목걸이·반지:
   *   상상+3옵션 상→1, 상상+중→2, 상상(3옵션 하/없음)→3, 상중/중상→4, 상하/하상→5, 그 외→6
   * 서폿 귀걸이: 상상+3옵션 상(생명력)→2, 상상+상(보호막/회복)→3, 상상+중→4, 상상→5, 그 외→6
   * 4티어 유물 서폿 목걸이/반지: 상상→5, 그 외→6
   * pBadges = 1·2옵션 배지 배열, third = 3옵션 배지(없으면 null)
   * 서폿 귀걸이 상상상은 null 반환 → 호출측에서 3옵션 종류 판별
   */
  function comboToGrade(pBadges, third, slotType, support, itemGrade) {
    var s = 0, j = 0, h = 0;
    pBadges.forEach(function (b) {
      if (b === "상") s++;
      else if (b === "중") j++;
      else if (b === "하") h++;
    });
    if (pBadges.length < 2) return 6;
    var bothSang = (s === 2);

    // 유물 서폿 목걸이/반지
    if (itemGrade === "유물" && support && (slotType === "목걸이" || slotType === "반지")) {
      return bothSang ? 5 : 6;
    }

    // 서폿 귀걸이
    if (support && slotType === "귀걸이") {
      if (!bothSang) return 6;
      if (third === "상") return null;
      if (third === "중") return 4;
      return 5;
    }

    // 기본 (딜러 전 부위 + 서폿 목걸이/반지)
    if (bothSang) {
      if (third === "상") return 1;
      if (third === "중") return 2;
      return 3;
    }
    if (s === 1 && j === 1) return 4; // 상중/중상
    if (s === 1 && h === 1) return 5; // 상하/하상
    return 6; // 중중 이하
  }

  /** 악세 분석: 1·2옵션/3옵션 상중하 슬롯 + 주문서 등급 */
  function accAnalysis(item, fullData) {
    if (!item) return { slots: ["-", "-", "-"], grade: 4 };
    var slotType = item.Type || "";
    if (slotType === "어빌리티 스톤" || slotType === "팔찌") return { slots: ["-", "-", "-"], grade: 1 };
    var support = isSupportClass(fullData);
    var opts = parseAccOptList(item);

    // 1·2옵션(가중치 1) / 3옵션(가중치 3) 분리. 표에 없는 옵션은 무시
    var primary = [], thirdOpt = null;
    opts.forEach(function (o) {
      var w = optWeight(o, slotType, support);
      if (w === 1) primary.push(o);
      else if (w === 3 && !thirdOpt) thirdOpt = o;
    });

    if (!opts.length || !opts.some(function (o) { return o.badge; })) {
      // 파싱 실패 → 보수적
      return { slots: ["-", "-", "-"], grade: (item.Grade === "고대") ? 4 : 5 };
    }

    var pBadges = primary.map(function (o) { return o.badge; }).filter(Boolean);
    var third = thirdOpt ? thirdOpt.badge : null;

    var g = comboToGrade(pBadges, third, slotType, support, item.Grade || "");
    if (g == null) {
      // 서폿 귀걸이 상상상: 3옵션 종류로 판별
      var sp = supportEarringSpecial(thirdOpt ? [thirdOpt] : []);
      g = (sp === "life") ? 2 : 3;
    }
    return {
      slots: [pBadges[0] || "-", pBadges[1] || "-", third || "-"],
      grade: g
    };
  }

  function scrollGradeFromAcc(item, fullData) {
    return accAnalysis(item, fullData).grade;
  }

  /**
   * 장신구 이관 결과 (공지 기준)
   * - 고대: 품질 67↑ + 유효 옵션 → 마력 주입 주문서 1~6
   * - 유물: 서폿 상/상 목걸이·반지만 주문서, 그 외 파편
   * - 품질 67 미만 / 유효 옵션 없음 → 영롱한 보석 파편
   */
  function accTransferResult(item, fullData) {
    if (!item) return { type: "none", note: "-" };
    var q = parseQuality(item);
    var g = item.Grade || "";
    var type = item.Type || "";
    var info = accAnalysis(item, fullData);
    var hasValid = (info.slots || []).some(function (s) { return s === "상" || s === "중" || s === "하"; });

    if (g === "유물") {
      var support = isSupportClass(fullData);
      var topCnt = (info.slots || []).filter(function (s) { return s === "상"; }).length;
      var neckRing = /목걸이|반지/.test(type);
      if (!(support && neckRing && topCnt >= 2 && q >= 67 && hasValid)) {
        return { type: "fragment", note: "영롱한 보석 파편", slots: info.slots };
      }
    } else if (q < 67 || !hasValid) {
      return { type: "fragment", note: "영롱한 보석 파편", slots: info.slots, quality: q };
    }
    return { type: "scroll", grade: info.grade, slots: info.slots, quality: q };
  }

  /**
   * 어빌리티 스톤 → 각인 슬롯 업그레이드 (공지 표)
   * AbilityStoneLevel 합/분포 기준
   */
  function stoneSlotUpgrade(fullData) {
    var engs = getEngravings(fullData).filter(hasStone);
    if (!engs.length) return null;
    var pts = engs.map(function (e) { return Number(e.AbilityStoneLevel) || 0; })
      .filter(function (n) { return n > 0; })
      .sort(function (a, b) { return b - a; });
    var a = pts[0] || 0, b = pts[1] || 0;
    var sum = a + b;
    if (sum < 4) return { sum: sum, label: "미반영 (합계 4 미만)", detail: a + "+" + b };
    if (sum === 4 && a === 2 && b === 2) return { sum: 4, slots: 1, stage: 3, label: "슬롯 1개 · 3단계", detail: "2+2" };
    if (sum === 4) return { sum: 4, slots: 1, stage: 5, label: "슬롯 1개 · 5단계", detail: a + "+" + b };
    if (sum === 5) return { sum: 5, slots: 2, stage: 7, label: "슬롯 2개 · 7단계", detail: a + "+" + b };
    if (sum === 6 && a === 4 && b === 2) return { sum: 6, slots: 3, stage: 7, label: "슬롯 3개 · 7단계", detail: "4+2" };
    if (sum === 6) return { sum: 6, slots: 4, stage: 7, label: "슬롯 4개 · 7단계", detail: a + "+" + b };
    if (sum === 7) return { sum: 7, slots: 5, stage: 7, label: "슬롯 5개 · 7단계", detail: a + "+" + b };
    if (sum >= 8) return { sum: sum, slots: 5, stage: 7, label: "슬롯 5개 · 7단계 + 추가 아이템", detail: a + "+" + b };
    return { sum: sum, label: "합계 " + sum, detail: a + "+" + b };
  }

  var SLOT_Q = "box-sizing:border-box!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;" +
    "width:var(--ig-sq,17px)!important;height:var(--ig-sq,17px)!important;min-width:0!important;padding:1px 0 0!important;font-size:var(--ig-sqfs,10px)!important;line-height:1!important;";
  /** 악세 옵션 상/중/하 심볼 (팔찌와 동일 디자인): [상][하][-] */
  function accSlotsHtml(slots) {
    var qcls = { "상": "q-sang", "중": "q-jung", "하": "q-ha" };
    var h = '<span class="ig-acc-q" style="display:inline-flex;align-items:center;gap:3px;margin-left:6px;vertical-align:middle">';
    (slots || []).forEach(function (b) {
      h += b && b !== "-"
        ? '<span class="ig-br-q ' + (qcls[b] || '') + '" style="' + SLOT_Q + '">' + esc(b) + '</span>'
        : '<span class="ig-br-q none" style="' + SLOT_Q + '">-</span>';
    });
    return h + '</span>';
  }

  /** 주문서 등급 → 심볼 등급색: 1 전설 / 2~3 영웅 / 4~5 희귀 / 6 고급 */
  function scrollTierGrade(n) {
    if (n <= 1) return "전설";
    if (n <= 3) return "영웅";
    if (n <= 5) return "희귀";
    return "고급";
  }

  // ---- 팔찌 → 인장 주문서 (1~21등급) ----
  // 고정옵션(특성) 2개 최대 12점 + 부여옵션 3개 최대 21점 + 힘/민/지 최대 3점 = 36점 만점
  // 등급 = round(점수/36*21)
  // 티어×품질: 1=5/6/7, 2=4/5/6, 3=3/4/5
  // 특성: 하≤84 · 중85~102 · 상≥103 → 2티어 점수
  // 파싱: 사이트 brSegments + brParseBody (db.js 옵션 매칭)
  var BR_SCORE = {
    1:   { "하": 5, "중": 6, "상": 7 },
    2:   { "하": 4, "중": 5, "상": 6 },
    2.5: { "하": 4, "중": 5, "상": 6 },
    3:   { "하": 3, "중": 4, "상": 5 },
    3.5: { "하": 3, "중": 4, "상": 5 },
    4:   { "하": 2, "중": 3, "상": 4 },
    5:   { "하": 1, "중": 2, "상": 3 }
  };

  // 힘/민첩/지능 (5티어): 하 ≤12,159 · 중 12,160~14,079 · 상 ≥14,080 → 1/2/3점
  var BR_MAIN_SCORE = { "하": 1, "중": 2, "상": 3 };
  function brMainStatQuality(val) {
    val = Number(val) || 0;
    if (val >= 14080) return "상";
    if (val >= 12160) return "중";
    return "하";
  }

  function brStatQuality(val) {
    val = Number(val) || 0;
    if (val >= 103) return "상";
    if (val >= 85) return "중";
    return "하";
  }

  // 팔찌 부여옵션 티어 (공식 티어표 기준)
  // 딜러: 1티어(치적&치피, 치피&치명타시, 추피&악마, 쿨&적주피, 적주피&무력화) / 2티어(방향성·백·헤드 적주피, 추피, 적주피, 치피, 치적)
  //       3티어+(무공&생50% / 무공&30초120초) / 3티어(무공, 공격적중시 무공&공이속) / 4티어(방깎·치저·치피저항·파티보호 & 아공강) / 5티어(힘민지)
  // 서폿: 1티어(방깎·치저·치피저항·파티보호 & 아공강) / 2티어(아피강, 아공강) / 3티어+ / 3티어 / 4티어(힘민지)
  // 반환: 0·-1 = 점수 없음
  function brGrantedTier(label, support) {
    var n = String(label || "").replace(/\s+/g, " ");
    if (/무기\s*공격력|무공/.test(n)) {
      if (/생명력\s*50|50\s*%\s*이상|30\s*초|120\s*초/.test(n)) return 3.5;
      return 3; // 공격 적중 시 무공 & 공이속 포함
    }
    if (/공이속|공격\s*및\s*이동\s*속도/.test(n)) return 0;
    if (/힘|민첩|지능/.test(n)) return support ? 4 : 5;

    if (support) {
      if (/방깎|방어력\s*감소|치명타\s*저항|치저|치피저항|치명타\s*피해\s*저항|파티\s*보호|보호\s*효과/.test(n)) return 1;
      if (/아군\s*피해량|아피강|아군\s*공격력\s*강화|아공강/.test(n)) return 2;
      return -1;
    }
    var crit = /치적|치명타\s*적중/.test(n);
    var critDmg = /치피|치명타\s*피해/.test(n);
    var critHit = /치명타\s*시/.test(n);
    var add = /추피|추가\s*피해/.test(n);
    var enemy = /적에게\s*주는\s*피해|적주피/.test(n);
    if (crit && critHit) return 1;
    if (critDmg && critHit) return 1;
    if (add && /악마/.test(n)) return 1;
    if (/쿨|재사용/.test(n) && enemy) return 1;
    if (enemy && /무력화/.test(n)) return 1;
    if (/방깎|방어력\s*감소|치명타\s*저항|치저|파티\s*보호/.test(n)) return 4;
    if (/방향성|백어택|헤드어택|타대/.test(n)) return 2;
    if (add || enemy || critDmg || crit) return 2;
    return -1;
  }

  /** 정보탭과 동일하게 팔찌 툴팁 파싱 */
  function brParseEquipped(item) {
    var stats = []; // [{name, value}]
    var options = []; // [{badge, label}]
    if (!item || !item.Tooltip) return { stats: stats, options: options };
    try {
      var tip = (typeof parseTip === "function") ? parseTip(item.Tooltip) : null;
      if (!tip) { try { tip = JSON.parse(item.Tooltip); } catch (e) { tip = null; } }
      if (!tip) return { stats: stats, options: options };

      var bodyHtml = "";
      if (typeof tipParts === "function") {
        var parts = tipParts(tip);
        var hit = parts.find(function (p) { return /팔찌\s*효과/.test(p.title || ""); });
        if (hit && hit.body) bodyHtml = hit.body;
      }
      if (!bodyHtml) {
        for (var k of Object.keys(tip)) {
          var v = tip[k];
          if (v && v.type === "ItemPartBox" && v.value && /팔찌\s*효과/.test(String(v.value.Element_000 || ""))) {
            bodyHtml = v.value.Element_001 || "";
            break;
          }
        }
      }
      if (!bodyHtml) return { stats: stats, options: options };

      var gradeKey = item.Grade || "고대";
      // 사이트 공용 파서 사용
      if (typeof brSegments === "function" && typeof brParseBody === "function") {
        var segs = brSegments(bodyHtml);
        var parsed = brParseBody(segs, gradeKey);
        (parsed.stats || []).forEach(function (html) {
          var t = String(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
          var m = t.match(/^(치명|특화|신속|제압|인내|숙련|힘|민첩|지능)\s*\+?\s*([0-9,]+)/);
          if (m) stats.push({ name: m[1], value: parseInt(m[2].replace(/,/g, ""), 10) });
        });
        (parsed.options || []).forEach(function (op) {
          var label = op.label || "";
          if (!label && op.lines && op.lines.length) {
            label = String(op.lines.join(" ")).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
          }
          var badge = op.badge || "";
          if (!badge && op.lines) {
            var raw = op.lines.join(" ");
            if (/#?FE9600/i.test(raw)) badge = "상";
            else if (/#?A235FF/i.test(raw)) badge = "중";
            else if (/#?00B5FF/i.test(raw)) badge = "하";
          }
          if (!label) return;
          // 공이속 제외는 점수에서
          options.push({ badge: badge || "중", label: label });
        });
        return { stats: stats, options: options };
      }

      // fallback: 단순 줄 파싱
      String(bodyHtml).split(/<br\s*\/?>/i).forEach(function (raw) {
        var clean = String(raw || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        if (!clean) return;
        var sm = clean.match(/^(치명|특화|신속|제압|인내|숙련)\s*\+?\s*([0-9]+)/);
        if (sm) { stats.push({ name: sm[1], value: parseInt(sm[2], 10) }); return; }
        var badge = /#?FE9600/i.test(raw) ? "상" : /#?A235FF/i.test(raw) ? "중" : /#?00B5FF/i.test(raw) ? "하" : "중";
        if (/품질|아이템/.test(clean)) return;
        options.push({ badge: badge, label: clean });
      });
    } catch (e) {}
    return { stats: stats, options: options };
  }

  /** 팔찌 옵션별 점수 내역 + 합계/등급. 등급은 1(최고) ~ 21(최저) */
  function braceletBreakdown(item, fullData) {
    var parsed = brParseEquipped(item);
    var sup = isSupportClass(fullData);
    var rows = [], fixed = 0, granted = 0, mainPts = 0, sn = 0, gn = 0, mainDone = false;
    (parsed.stats || []).forEach(function (st) {
      if (/^(힘|민첩|지능)$/.test(st.name)) {
        if (mainDone) return;
        mainDone = true;
        var mq = brMainStatQuality(st.value), mp = BR_MAIN_SCORE[mq];
        mainPts += mp;
        rows.push({ tier: "5티어", badge: mq, text: st.name + " +" + st.value, pts: mp });
        return;
      }
      if (sn >= 2) return;
      if (!/^(치명|특화|신속|제압|인내|숙련)$/.test(st.name)) return;
      var q = brStatQuality(st.value), pts = BR_SCORE[2.5][q];
      fixed += pts; sn++;
      rows.push({ tier: sup ? "2티어" : "2티어+", badge: q, text: st.name + " +" + st.value, pts: pts });
    });
    if (fixed > 12) fixed = 12;
    (parsed.options || []).forEach(function (op) {
      if (gn >= 3) return;
      var tier = brGrantedTier(op.label, sup);
      if (tier <= 0) { rows.push({ tier: "-", badge: "", text: op.label, pts: 0, skip: true }); return; }
      var q = op.badge;
      if (q !== "상" && q !== "중" && q !== "하") q = "중";
      var pts = (BR_SCORE[tier] && BR_SCORE[tier][q]) || 0;
      granted += pts; gn++;
      rows.push({ tier: Math.floor(tier) + "티어" + (tier % 1 ? "+" : ""), badge: q, text: op.label, pts: pts });
    });
    if (granted > 21) granted = 21;
    var raw = fixed + granted + mainPts;
    var max = 36; // 특성 12 + 부여옵션 21 + 힘/민/지 3
    var relic = ((item && item.Grade) || "") === "유물";
    var adj = relic ? raw * 0.92 : raw;
    // 점수가 높을수록 낮은 등급 번호 (만점 = 1등급, 0점 = 21등급)
    var rank = adj <= 0 ? 21 : 22 - Math.max(1, Math.min(21, Math.round((adj / max) * 21)));
    return { rows: rows, raw: raw, adj: adj, max: max, relic: relic, grade: rank, support: sup };
  }

  function scrollGradeFromBracelet(item, fullData) {
    if (!item) return 1;
    return braceletBreakdown(item, fullData).grade;
  }

  /** 팔찌 옵션·등급점수 요약 박스 (팔찌 행 대체) */
  function braceletBoxHtml(item, fullData) {
    if (!item) return "";
    var br = braceletBreakdown(item, fullData);
    var qcls = { "상": "q-sang", "중": "q-jung", "하": "q-ha" };
    var g = item.Grade || "고대";
    var h = '<div class="ig-br">';
    h += '<div class="ig-br-head"><div class="ig-br-id">' + iconBox(item.Icon, g, "팔찌", "md");
    h += '<div class="ig-br-title"><span>팔찌 → 인장 마력 주입 주문서</span><small>' + gradePill(g) + (br.support ? '<em>서폿 티어표</em>' : '<em>딜러 티어표</em>') +
      '<span class="ig-bdg ig-bdg-est" title="캐릭터 보유 팔찌 중 최고 성능 1개만 인장 마력 주입 주문서(1~21등급)로 이관됩니다." style="' + bdgStyle("#8fa0c4") + '">최고 1개만</span>' +
      '</small></div></div>';
    h += '<div class="ig-br-grade"><b>' + br.grade + '</b><span>/ 21등급</span></div></div>';
    if (!br.rows.length) {
      h += '<div class="ig-eng-empty">팔찌 옵션 정보를 불러오지 못했어요</div>';
    } else {
      h += '<div class="ig-br-rows">';
      br.rows.forEach(function (r) {
        h += '<div class="ig-br-row' + (r.skip ? ' skip' : '') + '">';
        h += '<span class="ig-br-tier">' + esc(r.tier) + '</span>';
        h += r.badge ? '<span class="ig-br-q ' + (qcls[r.badge] || '') + '">' + esc(r.badge) + '</span>' : '<span class="ig-br-q none">-</span>';
        h += '<span class="ig-br-txt" title="' + esc(r.text) + '">' + esc(r.text) + '</span>';
        h += '<span class="ig-br-pts">' + (r.skip ? '0' : r.pts) + '</span></div>';
      });
      h += '</div>';
    }
    var pos = ((21 - br.grade) / 20) * 100;
    h += '<div class="ig-br-total"><div class="ig-br-sum"><span>합계 <b>' + (br.relic ? br.adj.toFixed(1) : br.raw) + '</b> / ' + br.max + '점</span>';
    if (br.relic) h += '<em>유물 ×0.92 적용</em>';
    h += '</div>';
    h += '<div class="ig-br-scale"><i style="left:' + pos.toFixed(1) + '%"></i></div>';
    h += '<div class="ig-br-scale-lb"><span>21등급 · 최저</span><span>1등급 · 최고</span></div></div></div>';
    return h;
  }

  // 각인 줄임말 (이관 탭 전용 표시용)
  var ENG_SHORT = {
    "각성": "각성", "강령술": "강령술", "강화방패": "강방", "결투의대가": "결대",
    "구슬동자": "구동", "굳은의지": "굳의", "급소타격": "급타", "기습의대가": "기습",
    "긴급구조": "긴구", "달인의저력": "달인", "돌격대장": "돌대", "마나효율증가": "마효증",
    "마나의흐름": "마흐", "바리케이드": "바리", "번개의분노": "번분", "부러진뼈": "부껴",
    "분쇄의주먹": "분주", "불굴": "불굴", "선수필승": "선필", "속전속결": "속속",
    "슈퍼차지": "슈차", "승부사": "승부사", "시선집중": "시집", "실드관통": "실관",
    "아드레날린": "아드", "안정된상태": "안상", "약자무시": "약무", "에테르포식자": "에포",
    "여신의가호": "여신", "예리한둔기": "예둔", "원한": "원한", "위기모면": "위모",
    "저주받은인형": "저받", "전문의": "전문의", "정기흡수": "정흡", "정밀단도": "정단",
    "중갑착용": "중갑", "질량증가": "질증", "최대마나증가": "최마증", "추진력": "추진력",
    "타격의대가": "타대", "탈출의명수": "탈명", "폭발물전문가": "폭전"
  };
  function engShort(nm) {
    var key = String(nm || "").replace(/\s+/g, "");
    return ENG_SHORT[key] || nm;
  }
  function engNameHtml(nm) {
    return '<span class="ig-eng-nm" title="' + esc(nm) + '">' + esc(engShort(nm)) + '</span>';
  }

  /** 어빌리티 스톤이 붙은(물방울 Lv 있는) 각인인지 */
  function hasStone(e) {
    var v = e && e.AbilityStoneLevel;
    return v != null && v !== "" && Number(v) > 0;
  }

  function getEngravings(fullData) {
    var eng = fullData && fullData.ArmoryEngraving;
    if (!eng) return [];
    // 정보탭 renderEng 과 동일: ArkPassiveEffects 우선
    var list = eng.ArkPassiveEffects || eng.Effects || eng.Engravings || [];
    if (!list.length && eng.Engrave) list = eng.Engrave;
    return list || [];
  }

  function renderIgwan(fullData) {
    var root = document.getElementById("igwanPanel");
    if (!root) return;
    var list = (fullData && fullData.ArmoryEquipment) || [];
    learnGradeColors(list);
    if (!list.length) {
      root.innerHTML = '<div class="ig-empty">장비 데이터가 없습니다. 캐릭터를 조회해 주세요.</div>';
      return;
    }

    var armors = {};
    ARMOR_ORDER.forEach(function (t) { armors[t] = findByType(list, t, 0); });
    var weapon = findByType(list, "무기", 0);
    var gauntlet = findByType(list, "완갑", 0); // 기존 장착 완갑

    var accSeen = {};
    var accs = ACC_ORDER.map(function (t) {
      var nth = accSeen[t] || 0;
      accSeen[t] = nth + 1;
      return { type: t, item: findByType(list, t, nth) };
    });

    var armorRules = ARMOR_ORDER.map(function (t) {
      var it = armors[t];
      var il = parseItemLevel(it);
      return lookupRule(il || 0);
    });
    var weaponIl = parseItemLevel(weapon) || 0;
    var weaponIlF = parseItemLevelFloat(weapon) || 0;
    var weaponIsEsther = isEstherWeapon(weapon);
    // 에스더 무기는 전용 고구간, 일반 무기는 1795~1800 → 1815 3연마
    var weaponRule = lookupRule(weaponIl || 1800, weaponIsEsther);
    // 에스더 1800+: 완갑·허리띠·성물·인장·팔찌는 25단계(1800) 기준
    var relatedAfter = (weaponIsEsther && weaponIl >= 1800) ? 1815 : weaponRule.after;

    // ---- 이관 전: 무기+방어구 6부위 평균 (소수점 유지, 프로필과 동일) ----
    var beforeSum = 0, beforeCnt = 0;
    ARMOR_ORDER.forEach(function (t) {
      var it = armors[t];
      if (!it || !it.Icon) return;
      beforeSum += parseItemLevelFloat(it) || 0;
      beforeCnt++;
    });
    if (weapon && weapon.Icon) {
      beforeSum += weaponIlF;
      beforeCnt++;
    }
    var beforeAvg = beforeCnt ? beforeSum / beforeCnt : 0;

    // ---- 이관 후: 16부위 평균 (공식 매핑) ----
    // 투구→목걸이, 어깨→귀1, 상의→귀2, 하의→반1, 장갑→반2
    // 무기→완갑·허리띠·인장·성물·팔찌
    var afterLevels = [];
    // 1~6: 무기 + 방어구 5
    afterLevels.push(weaponRule.after);
    armorRules.forEach(function (r) { afterLevels.push(r.after); });
    // 7~11: 악세 5 (방어구 각 부위 after 매핑)
    // ARMOR_ORDER = ["투구","어깨","상의","하의","장갑"]
    armorRules.forEach(function (r) { afterLevels.push(r.after); });
    // 12~16: 무기 계열 5 (완갑·허리띠·인장·성물·팔찌)
    for (var ri = 0; ri < 5; ri++) afterLevels.push(relatedAfter);
    var afterSum = 0;
    afterLevels.forEach(function (v) { afterSum += v; });
    var afterAvg = afterLevels.length ? afterSum / afterLevels.length : 0;

    var html = "";

    // 상단 요약
    html += '<div class="ig-summary">';
    html += '<div class="ig-sum-card"><div class="ig-sum-label">아이템 레벨 변화</div>';
    html += '<div class="ig-sum-value">' + beforeAvg.toFixed(2) + ' → ' + afterAvg.toFixed(2);
    html += ' <span class="ig-delta">+' + Math.max(0, afterAvg - beforeAvg).toFixed(2) + '</span></div>';
    html += '<div class="ig-sum-sub">이관 전 6부위 · 이관 후 16부위</div></div>';
    html += '<div class="ig-sum-card"><div class="ig-sum-label">지급 장비 · 주문서</div>';
    html += '<div class="ig-sum-value">16개</div><div class="ig-sum-sub">장신구 주문서 포함</div></div>';
    html += '<div class="ig-sum-card"><div class="ig-sum-label">무기 이관 후</div>';
    html += '<div class="ig-sum-value" style="color:' + gradeColor(weaponRule.grade) + '">' + weaponRule.after + '</div>';
    html += '<div class="ig-sum-sub">' + gradePill(weaponRule.grade) + yeonBadge(weaponRule.yeonma, weaponRule.grade) + '</div></div>';
    html += '</div>';

    html += '<div class="ig-sec-title"><span class="ig-dot"></span> 장비 · 장신구 이관</div>';
    html += '<div class="ig-legend">';
    // 에스더를 고대 왼쪽에 추가
    var ESTHER_LEGEND_COLOR = "#5EC8FF";
    var ESTHER_LEGEND_BG = "linear-gradient(135deg,#1a3a55,#2a6a9a 50%,#163d5c)";
    html += '<span class="ig-leg"><i style="background:' + ESTHER_LEGEND_BG + ';box-shadow:0 0 0 1px ' + ESTHER_LEGEND_COLOR + '"></i><b style="color:' + ESTHER_LEGEND_COLOR + '">에스더</b></span>';
    ["고대", "유물", "전설", "영웅", "희귀", "고급"].forEach(function (g) {
      html += '<span class="ig-leg"><i style="background:' + gradeBg(g) + ';box-shadow:0 0 0 1px ' + gradeColor(g) + '"></i><b style="color:' + gradeColor(g) + '">' + g + '</b></span>';
    });
    html += '</div>';
    html += '<div class="ig-split">';

    // ===== 왼쪽 방어구 =====
    html += '<div class="ig-col"><div class="ig-col-title"><span class="ig-chip chip-eq">장비</span> 방어구 (현재 → 이관 후)</div>';
    html += flowHead(false);

    ARMOR_ORDER.forEach(function (type) {
      var it = armors[type];
      var il = parseItemLevel(it) || 0;
      var up = parseUpgrade(it);
      var q = parseQuality(it);
      var rule = lookupRule(il || 0);
      var link = ARMOR_TO_ACC[type];
      var label = shortArmorLabel(type);
      var grade = (it && it.Grade) || "고대";
      var icon = (it && it.Icon) || "";

      html += '<div class="ig-row">';
      // 현재 — 장착 아이템 (+ 추천 말풍선)
      html += '<div class="ig-side ig-side-rel">';
      html += honeBubble(up, false, "armor-" + type);
      html += '<div class="ig-ic-wrap w-lg">' + iconBox(icon, grade, label, "lg") + qualityBar(q) + '</div>';
      html += '<div class="ig-text">';
      html += '<div class="ig-name">' + slotTitleHtml(it, label, grade) + '</div>';
      html += '<div class="ig-sub">' + gradePill(grade) + beforeBadge(il || "-") + '</div></div></div>';

      html += arrowSvg();

      // 이관 후 — 같은 아이콘 + 이관 등급색 / 연동 악세
      html += '<div class="ig-after">';
      html += '<div class="ig-after-item">';
      html += iconBox(icon, rule.grade, rule.grade, "md");
      html += '<div class="ig-text"><div class="ig-name ig-name-row"><span>' + esc(label) + '</span><span class="ig-slot-txt">슬롯 ' + up + '단계</span></div>';
      html += '<div class="ig-sub">' + gradePill(rule.grade) + lvBadge(rule.after, rule.grade) + yeonBadge(rule.yeonma, rule.grade) + '</div></div></div>';
      if (link) {
        // 이관 악세 주문서는 "해당 슬롯 장착 악세" 옵션으로 계산 (방어구 아님)
        var linkedAccItem = null;
        var linkNth = 0;
        // 귀걸이/반지는 부위마다 짝: 투구→목걸이0, 어깨→귀0, 상의→귀1, 하의→반0, 장갑→반1
        if (type === "상의" || type === "장갑") linkNth = 1;
        linkedAccItem = findByType(list, link.acc, linkNth);
        html += '<div class="ig-after-item">';
        html += iconBox((linkedAccItem && linkedAccItem.Icon) || link.icon, rule.grade, link.acc, "md"); // 현재 장착 악세 아이콘 (없을 때만 기본 아이콘)
        html += '<div class="ig-text"><div class="ig-name ig-name-row"><span>' + esc(link.acc) + '</span></div>';
        html += '<div class="ig-sub">' + gradePill(rule.grade) + lvBadge(rule.after, rule.grade) + yeonBadge(rule.yeonma, rule.grade) + '</div></div></div>';
      }
      html += '</div></div>';
    });

    // 무기 블록
    html += '<div class="ig-weapon">';
    html += '<div class="ig-weapon-label"><span class="ig-chip chip-eq">무기</span> 특수슬롯 6종 지급</div>';
    html += '<div class="ig-weapon-flow">';
    html += '<div class="ig-w-lab"><span class="ig-fh ig-fh-before">이관 전</span></div>';
    html += '<div class="ig-w-from ig-side-rel">';
    var wGrade = (weapon && weapon.Grade) || "고대";
    var isEsther = isEstherWeapon(weapon);
    var ESTHER_COLOR = "#5EC8FF"; // 에스더 전용 심볼 색
    var beforeSlot = parseUpgrade(weapon);
    // 에스더 아이콘 배경을 더 밝게 (시안 계열)
    var estherIconOpts = isEsther ? {
      color: ESTHER_COLOR,
      bg: "linear-gradient(135deg,#1a3a55,#2a6a9a 50%,#163d5c)"
    } : null;
    // 에스더가 아닐 때만 추천 말풍선
    if (!isEsther) html += honeBubble(beforeSlot, true, "weapon");
    html += '<div class="ig-ic-wrap w-xl">' + iconBox(weapon && weapon.Icon, wGrade, "무기", "xl", estherIconOpts) + qualityBar(parseQuality(weapon)) + '</div>';
    html += '<div class="ig-text"><div class="ig-name">' + (isEsther
      ? '<span style="color:' + ESTHER_COLOR + '">' + esc(slotTitle(weapon, "무기")) + '</span>'
      : slotTitleHtml(weapon, "무기", wGrade)) + '</div>';
    // 에스더면 색상 있는 에스더 배지만 표시 (중복·무색 제거)
    html += '<div class="ig-sub">';
    if (isEsther) {
      html += '<span class="ig-bdg ig-bdg-esther" style="' + bdgStyle(ESTHER_COLOR) + '">에스더</span>';
    } else {
      html += gradePill(wGrade);
    }
    html += beforeBadge(weaponIl || "-") + '</div></div>';
    html += '<div class="ig-w-meta">';
    html += '<div class="ig-w-meta-row"><span class="k">레벨</span><span class="v">' + (weaponIl || "-") + ' → ' + lvBadge(weaponRule.after, weaponRule.grade) + (weaponIl ? ' <span class="ig-up">+' + (weaponRule.after - weaponIl) + '</span>' : '') + '</span></div>';
    var afterSlot = transferSlotStage(weapon);
    html += '<div class="ig-w-meta-row"><span class="k">슬롯</span><span class="v">' + beforeSlot + '단계 → <b style="color:' + (afterSlot > beforeSlot ? '#7dffa0' : 'inherit') + '">' + afterSlot + '단계</b></span></div>';
    html += '</div></div>';
    html += '<div class="ig-w-lab ig-w-lab-mid">' + arrowSvg(true) + '<span class="ig-fh ig-fh-after">이관 후</span>' + arrowSvg(true) + '</div>';
    html += '<div class="ig-w-grid">';

    var wg = weaponRule.grade;
    // 에스더 무기: 강화·엘라 기준 에스더 이관표
    // 완갑·허리띠·성물·인장·팔찌: 1800+ 에스더면 현 재련 25단계(1800) 무기 기준 → 1815 / 3연마
    var relatedRule = (isEsther && weaponIl >= 1800)
      ? { after: 1815, grade: "고대", yeonma: 3, delta: 15 }
      : weaponRule;
    var relatedGrade = relatedRule.grade;
    var wUp = transferSlotStage(weapon);
    var gUp = (isEsther && (weaponIl >= 1800 || beforeSlot >= 9))
      ? 25
      : transferSlotStage(gauntlet, isEsther && weaponIl >= 1800);
    var brItemW = findByType(list, "팔찌", 0);
    var brIcon = relatedGrade === "고대" ? IGWAN_ICONS.braceletAncient
      : (relatedGrade === "유물" ? IGWAN_ICONS.braceletRelic : IGWAN_ICONS.braceletLegend);
    // 이관 후 무기는 에스더면 "에스더 무기" + 엘라4, 나머지는 relatedRule 레벨
    var wChips = [
      { name: isEsther ? "에스더 무기" : (wg + " 무기"), sub: "슬롯 " + wUp + "단계", icon: weapon && weapon.Icon, fb: "무기", esther: isEsther, ella: isEsther, rule: weaponRule },
      { name: relatedGrade + " 완갑", sub: "슬롯 " + gUp + "단계", icon: gauntlet && gauntlet.Icon, fb: "완갑", rule: relatedRule },
      { name: relatedGrade + " 허리띠", sub: "슬롯 0단계", icon: IGWAN_ICONS.waistband, fb: "허리", neu: true, rule: relatedRule },
      { name: relatedGrade + " 팔찌", subHtml: '<span class="ig-scroll">' + scrollGradeFromBracelet(brItemW, fullData) + '등급 주문서</span>', icon: brIcon, fb: "팔찌", rule: relatedRule },
      { name: relatedGrade + " 성물", sub: "재련 슬롯 없음", icon: IGWAN_ICONS.sacred, fb: "성물", neu: true, rule: relatedRule },
      { name: relatedGrade + " 인장", sub: "재련 슬롯 없음", icon: IGWAN_ICONS.seal, fb: "인장", neu: true, rule: relatedRule }
    ];
    wChips.forEach(function (w) {
      var chipRule = w.rule || weaponRule;
      var chipGrade = chipRule.grade;
      html += '<div class="ig-w-chip' + (w.neu ? " new" : "") + (w.esther ? " esther" : "") + '">';
      if (w.neu) html += '<span class="ig-bdg ig-bdg-new ig-chip-new">NEW</span>';
      // 엘라4: NEW와 동일 위치·강조 (스타일은 CSS .ig-chip-ella)
      if (w.ella) html += '<span class="ig-bdg ig-bdg-ella ig-chip-ella">엘라4</span>';
      var chipIconOpts = w.esther ? { color: ESTHER_COLOR, bg: "linear-gradient(135deg,#1a3a55,#2a6a9a 50%,#163d5c)" } : null;
      html += iconBox(w.icon, chipGrade, w.fb, "md", chipIconOpts);
      var nameCol = w.esther ? ESTHER_COLOR : gradeColor(chipGrade);
      html += '<div class="ig-text"><div class="ig-name" style="color:' + nameCol + '">' + esc(w.name) + '</div>';
      // 에스더 무기: 5연마·1865 심볼도 에스더 색
      html += '<div class="ig-sub ig-sub-b">' + ruleBadges(chipRule, w.esther ? ESTHER_COLOR : null) + '</div>';
      html += '<div class="ig-sub ig-sub-t">' + (w.subHtml || esc(w.sub)) + '</div></div></div>';
    });
    html += '</div>';

    html += '</div>'; // weapon-flow end

    html += '</div></div>'; // weapon col

    // ===== 오른쪽 악세 =====
    html += '<div class="ig-col"><div class="ig-col-title acc"><span class="ig-chip chip-acc">악세</span> 악세사리 (현재 → 주문서)</div>';
    html += flowHead(true);

    var stoneHtml = "";
    accs.forEach(function (slot) {
      var it = slot.item;
      var type = slot.type;
      if (type === "팔찌") return; // 팔찌는 아래 옵션·등급점수 박스로 대체
      var _prevHtml = html; html = "";
      var grade = (it && it.Grade) || "고대";
      var q = parseQuality(it);
      var icon = (it && it.Icon) || "";
      var accInfo = (type === "어빌리티 스톤" || type === "팔찌") ? { slots: [], grade: 1 } : accAnalysis(it, fullData);

      html += '<div class="ig-row acc">';
      html += '<div class="ig-side">';
      html += '<div class="ig-ic-wrap w-lg">' + iconBox(icon, grade, type.replace("어빌리티 ", ""), "lg");
      if (type !== "어빌리티 스톤" && type !== "팔찌") html += qualityBar(q);
      html += '</div><div class="ig-text">';
      html += '<div class="ig-name" style="color:#e8eef8">' + esc(accSlotLabel(type)) + '</div>';
      var stUpEarly = (type === "어빌리티 스톤") ? stoneSlotUpgrade(fullData) : null;
      if (type === "어빌리티 스톤") {
        html += '<div class="ig-sub ig-stone-opts">' + gradePill(grade);
        if (stUpEarly && stUpEarly.detail) {
          html += beforeBadge(stUpEarly.detail);
        }
        html += '</div>';
      } else {
        html += '<div class="ig-sub">' + gradePill(grade) + accSlotsHtml(accInfo.slots) + '</div>';
      }
      html += '</div></div>';
      html += arrowSvg();

      if (type === "어빌리티 스톤") {
        var stUp = stUpEarly;
        var stLabel = "해당 없음";
        if (stUp && stUp.stage) {
          stLabel = "슬롯 Lv." + stUp.stage + (stUp.slots ? " + " + stUp.slots + "개" : "");
        } else if (stUp && stUp.label) {
          stLabel = stUp.label;
        }
        html += '<div class="ig-side">';
        html += '<div class="ig-ic-wrap w-lg">' + iconBox(IGWAN_ICONS.engravingSlot, grade, "각인", "lg") + '</div>';
        html += '<div class="ig-text"><div class="ig-name" style="color:#e8eef8">각인 슬롯 강화</div>';
        html += '<div class="ig-sub"><span class="ig-scroll">' + esc(stLabel) + '</span></div></div></div>';
      } else {
        // 공지: 품질 67↑ + 유효옵션 → 마력 주입 주문서, 아니면 영롱한 보석 파편
        var tr = accTransferResult(it, fullData);
        if (tr.type === "fragment") {
          html += '<div class="ig-side">';
          html += '<div class="ig-ic-wrap w-lg">' + iconBox(IGWAN_ICONS.scroll, "희귀", "파편", "lg") + '</div>';
          html += '<div class="ig-text"><div class="ig-name" style="color:#9aa3b5">영롱한 보석 파편</div>';
          html += '<div class="ig-sub"><span class="ig-scroll">' +
            (q < 67 ? '품질 ' + q + ' (&lt;67)' : '유효 옵션 없음') +
            '</span></div></div></div>';
        } else {
          var sg = tr.grade || accInfo.grade;
          var sgGrade = scrollTierGrade(sg);
          html += '<div class="ig-side">';
          html += '<div class="ig-ic-wrap w-lg">' + iconBox(IGWAN_ICONS.scroll, sgGrade, "주문", "lg") + '</div>';
          html += '<div class="ig-text"><div class="ig-name">마력 주입 주문서</div>';
          html += '<div class="ig-sub"><span class="ig-bdg ig-bdg-scroll" style="' + bdgStyle(gradeColor(sgGrade)) + '">' + sg + '등급</span></div></div></div>';
        }
      }
      html += '</div>';
      if (type === "어빌리티 스톤") { stoneHtml = html; html = _prevHtml; }
      else { html = _prevHtml + html; }
    });

    html += braceletBoxHtml(findByType(list, "팔찌", 0), fullData);

    // 스톤 + 각인 이관을 한 묶음 박스로
    html += '<div class="ig-grp">' + stoneHtml;

    // 각인 이관 — AbilityStoneLevel 물방울 심볼 (정보탭과 동일)
    var engs = getEngravings(fullData);
    html += '<div class="ig-eng">';
    html += '<div class="ig-eng-label"><span><span class="ig-chip chip-eng">각인</span> 이관</span><span class="ig-eng-res">슬롯 강화</span></div>';
    if (engs.length) {
      html += '<div class="ig-eng-split">';
      html += '<div class="ig-eng-col">';
      engs.slice(0, 8).forEach(function (e) {
        var nm = e.Name || e.EngravingName || "?";
        var lv = e.Level != null ? e.Level : (e.Value != null ? e.Value : "");
        var iconUrl = (typeof ENGRAVE_ICONS !== "undefined" && ENGRAVE_ICONS[nm]) ? ENGRAVE_ICONS[nm] : null;
        var stoneLv = e.AbilityStoneLevel;
        html += '<div class="ig-eng-item">';
        if (iconUrl) html += '<img class="ig-eng-ic" src="' + esc(iconUrl) + '" alt="" loading="lazy">';
        else html += '<span class="ig-eng-ic fb">' + esc(nm.charAt(0)) + '</span>';
        html += engNameHtml(nm);
        if (hasStone(e)) {
          var bullet = (typeof engBulletHtml === "function") ? engBulletHtml(3, 18, 13) : '<span class="ig-drop">◆</span>';
          html += '<span class="ig-eng-stone-lv">' + bullet + '<span>Lv.' + esc(stoneLv) + '</span></span>';
        }
        html += '<span class="ig-eng-lv">' + esc(lv) + '</span></div>';
      });
      html += '</div>';
      html += '<div class="ig-eng-arrow">' + arrowSvg() + '</div>';
      html += '<div class="ig-eng-col">';
      // 공지 표: 스톤 합계에 따라 슬롯 N개 · M단계 — 하드코딩 Lv.7 금지
      var stUpEng = stoneSlotUpgrade(fullData);
      var upgradeNames = {};
      if (stUpEng && stUpEng.slots && stUpEng.stage) {
        var ranked = engs.filter(hasStone).slice().sort(function (a, b) {
          return (Number(b.AbilityStoneLevel) || 0) - (Number(a.AbilityStoneLevel) || 0);
        });
        ranked.slice(0, stUpEng.slots).forEach(function (e) {
          var n = e.Name || e.EngravingName || "";
          if (n) upgradeNames[n] = true;
        });
      }
      engs.slice(0, 8).forEach(function (e) {
        var nm = e.Name || e.EngravingName || "?";
        var lv = e.Level != null ? e.Level : (e.Value != null ? e.Value : "");
        var iconUrl = (typeof ENGRAVE_ICONS !== "undefined" && ENGRAVE_ICONS[nm]) ? ENGRAVE_ICONS[nm] : null;
        var slotMark = upgradeNames[nm]
          ? '<span class="ig-eng-slot">슬롯 Lv.' + stUpEng.stage + '</span>'
          : '';
        html += '<div class="ig-eng-item">';
        if (iconUrl) html += '<img class="ig-eng-ic" src="' + esc(iconUrl) + '" alt="" loading="lazy">';
        else html += '<span class="ig-eng-ic fb">' + esc(nm.charAt(0)) + '</span>';
        html += engNameHtml(nm) + slotMark + '<span class="ig-eng-lv">' + esc(lv) + '</span></div>';
      });
      html += '</div></div>';
    } else {
      html += '<div class="ig-eng-empty">각인 정보 없음</div>';
    }
    html += '</div>'; // ig-eng
    html += '</div>'; // ig-grp (스톤 + 각인)
    html += '</div>'; // eng col


    html += '</div>'; // split

    // 하단
    var armorGrade = armorRules[0] ? armorRules[0].grade : "유물";
    var armorYeon = armorRules[0] ? armorRules[0].yeonma : 3;
    var armorAfter = armorRules[0] ? armorRules[0].after : 1790;

    var armorActive = armorRules.concat([weaponRule]);
    var showRows = 8;
    LEVEL_RULES.forEach(function (r, i) { if (armorActive.indexOf(r) >= 0 && i + 1 > showRows) showRows = i + 1; });
    var brItem = findByType(list, "팔찌", 0);
    var brG = scrollGradeFromBracelet(brItem, fullData);
    var stoneUp = stoneSlotUpgrade(fullData);
    var isEstherDetail = isEstherWeapon(weapon);
    // 장신구 주문서 개수 (목걸이·귀걸이×2·반지×2 중 scroll 대상)
    var accScrollCnt = 0, accFragCnt = 0;
    ["목걸이", "귀걸이", "귀걸이", "반지", "반지"].forEach(function (t, i) {
      var it = findByType(list, t, t === "귀걸이" || t === "반지" ? (i === 2 || i === 4 ? 1 : 0) : 0);
      // 위 forEach index는 부정확할 수 있어 아래에서 재계산
    });
    (function () {
      var pairs = [
        ["목걸이", 0], ["귀걸이", 0], ["귀걸이", 1], ["반지", 0], ["반지", 1]
      ];
      pairs.forEach(function (p) {
        var it = findByType(list, p[0], p[1]);
        if (!it || !it.Icon) return;
        var tr = accTransferResult(it, fullData);
        if (tr.type === "scroll") accScrollCnt++;
        else if (tr.type === "fragment") accFragCnt++;
      });
    })();
    var wUp2 = transferSlotStage(weapon);
    var gUp2 = (isEstherDetail && (weaponIl >= 1800 || parseUpgrade(weapon) >= 9))
      ? 25
      : transferSlotStage(gauntlet, isEstherDetail && weaponIl >= 1800);
    // 에스더 1800+: 완갑 등 관련 슬롯은 25단계(1800) 기준 → 1815 / 3연마
    var relatedRuleDetail = (isEstherDetail && weaponIl >= 1800)
      ? { after: 1815, grade: "고대", yeonma: 3, delta: 15 }
      : weaponRule;

    html += '<div class="ig-panel ig-merged">';
    html += '<div class="ig-panel-title"><span class="ig-chip chip-stat">상세</span> 지급 상세 · 이관 기준</div>';
    html += '<div class="ig-merged-body">';

    // 왼쪽: 지급 상세
    html += '<div class="ig-m-left">';
    html += '<div class="ig-m-sub">지급 상세</div>';
    html += '<div class="ig-kv"><span class="k">방어구 5부위</span><span class="v">' + gradePill(armorGrade) + lvBadge(armorAfter, armorGrade) + yeonBadge(armorYeon, armorGrade) + '</span></div>';
    html += '<div class="ig-kv"><span class="k">무기 계열</span><span class="v">' +
      (isEstherDetail ? '<span class="ig-bdg" style="' + bdgStyle("#5EC8FF") + '">에스더</span>' : gradePill(weaponRule.grade)) +
      ruleBadges(weaponRule, isEstherDetail ? "#5EC8FF" : null) +
      '</span></div>';
    // 에스더 1800+: 관련 장비는 25단계 기준(1815/3연마) — 라벨 짧게, 배지 한 줄
    html += '<div class="ig-kv"><span class="k">' +
      (isEstherDetail && weaponIl >= 1800 ? '관련 장비' : '성물·인장·팔찌 등') +
      '</span><span class="v">' +
      (isEstherDetail && weaponIl >= 1800
        ? '<span class="ig-m-same">무기 기준</span>' + lvBadge(relatedRuleDetail.after, relatedRuleDetail.grade) + yeonBadge(relatedRuleDetail.yeonma, relatedRuleDetail.grade)
        : '<span class="ig-m-same">무기 기준</span>' + lvBadge(weaponRule.after, weaponRule.grade)) +
      '</span></div>';
    html += '<div class="ig-kv"><span class="k">슬롯 단계</span><span class="v ig-m-slots"><span>무기 ' + wUp2 + '</span><span>완갑 ' + gUp2 + '</span><span>허리띠 0</span></span></div>';
    html += '<div class="ig-kv"><span class="k">악세5종 → 마력 주입 주문서</span><span class="v accent">' +
      (accScrollCnt ? accScrollCnt + '장' : '0장') +
      (accFragCnt ? ' · 파편 ' + accFragCnt + '부위' : '') +
      '</span></div>';
    html += '<div class="ig-kv"><span class="k">팔찌 → 인장 마력 주입 주문서</span><span class="v accent">' + brG + '등급 / 21 · 최고 1개</span></div>';
    html += '<div class="ig-kv"><span class="k">각인 슬롯 강화</span><span class="v accent">' +
      (stoneUp ? esc(stoneUp.label) + (stoneUp.detail ? ' (' + esc(stoneUp.detail) + ')' : '') : '해당 없음') +
      '</span></div>';
    html += '</div>';

    // 오른쪽: 이관 기준표
    html += '<div class="ig-m-right">';
    html += '<div class="ig-m-sub">이관 기준표 <em>내 장비 구간 강조</em></div>';
    html += '<table class="ig-table"><thead><tr><th>기존 레벨</th><th>장비 등급</th><th style="text-align:right">이관 레벨</th></tr></thead><tbody>';
    LEVEL_RULES.slice(0, showRows).forEach(function (r) {
      var over = armorActive.indexOf(r) >= 0;
      html += '<tr class="' + (over ? "over" : "") + '">';
      html += '<td class="lv">' + r.min + ' ~ ' + r.max + '</td>';
      html += '<td>' + gradePill(r.grade) + yeonBadge(r.yeonma, r.grade) + '</td>';
      html += '<td style="text-align:right">';
      if (r.delta) html += '<span class="ig-up">+' + r.delta + '</span> ';
      html += lvBadge(r.after, r.grade) + '</td></tr>';
    });
    html += '</tbody></table></div>';
    html += '</div>';
    html += '<div class="ig-note">공개된 이관 기준을 바탕으로 한 추정 결과입니다. 실제 수치는 공식 이관 공지 후 정확히 반영됩니다.</div>';
    html += '</div>';

    ensureIgwanStyle();
    root.innerHTML = html;
    bindHoneBubbles(root);
  }

  /** 모바일 대응 CSS (폭 768px 이하)
   *  window.IGWAN_HIDE_ON_MOBILE = [".프로필클래스", "#left-panel"]  처럼 지정하면 모바일에서 해당 영역을 숨김 */
  function igwanMobileCss() {
    var hide = (global.IGWAN_HIDE_ON_MOBILE || []).filter(Boolean);
    var m = "@media (max-width:768px){";
    if (hide.length) m += hide.join(",") + "{display:none!important}";
    m +=
      // 전체: 2단 → 1단
      // 상단 요약 카드 / 섹션 제목 / 등급 범례는 모바일에서 숨김
      ".ig-summary,.ig-sec-title,.ig-legend{display:none!important}" +
      ".ig-split{display:flex!important;flex-direction:column!important;grid-template-columns:1fr!important;gap:12px!important}" +
      ".ig-col{width:100%!important;max-width:100%!important;min-width:0!important}" +
      // 심볼·아이콘 컴팩트
      ".ig-bdg{--ig-bh:16px;--ig-bfs:10px;--ig-bpx:5px}" +
      ".ig-acc-q{--ig-sq:15px;--ig-sqfs:9px;margin-left:4px!important}" +
      ".ig-ic-lg{width:40px!important;height:40px!important}" +
      ".ig-ic-md{width:32px!important;height:32px!important}" +
      ".ig-ic-wrap.w-lg{width:40px!important}" +
      ".ig-name{font-size:12.5px!important}" +
      ".ig-slot-txt{font-size:10px!important}" +
      // 장비/악세 행: 가로 한 줄 유지 (좌: 현재, 우: 이관 후)
      ".ig-row{padding:14px 8px 8px!important;gap:4px!important;overflow:visible}" +
      ".ig-row .ig-side-rel{overflow:visible}" +
      ".ig-weapon-flow{overflow:visible!important}" +
      ".ig-w-from{overflow:visible!important;padding-top:6px}" +
      ".ig-row .ig-side,.ig-row .ig-after,.ig-row .ig-after-item{min-width:0!important}" +
      ".ig-row .ig-side{gap:7px!important}" +
      ".ig-row .ig-text{min-width:0}" +
      ".ig-row .ig-sub{gap:3px!important;flex-wrap:wrap}" +
      ".ig-after{gap:6px!important}" +
      ".ig-after-item{gap:6px!important}" +
      ".ig-row>.ig-arrow svg{width:14px!important;height:14px!important}" +
      // 무기 블록
      ".ig-weapon{padding:10px!important}" +
      ".ig-weapon-flow{max-width:100%!important}" +
      ".ig-w-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}" +
      ".ig-w-from{flex-wrap:wrap!important;gap:10px!important}" +
      // 팔찌 / 스톤+각인
      ".ig-br,.ig-grp{padding-left:10px!important;padding-right:10px!important}" +
      ".ig-eng-split{gap:6px!important}" +
      // 하단 상세
      ".ig-merged-body{display:flex!important;flex-direction:column!important;gap:12px!important}" +
      ".ig-merged .ig-m-left,.ig-merged .ig-m-right{width:100%!important;padding:12px!important}" +
      ".ig-merged .ig-m-right{overflow-x:auto}" +
      ".ig-merged .ig-kv{flex-wrap:wrap;gap:4px 8px}" +
      ".ig-table{min-width:320px}" +
      "}" +
      // 아주 좁은 화면(380px 이하): 현재 → 이관 후 를 위아래로
      "@media (max-width:380px){" +
      ".ig-row{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:6px!important}" +
      ".ig-row>.ig-arrow{align-self:center;transform:rotate(90deg)}" +
      ".ig-row .ig-side,.ig-row .ig-after{width:100%!important}" +
      "}";
    return m;
  }

  /** 하단 [상세] 패널: 움푹 들어간 효과 + 구분선 (한 번만 주입) */
  function ensureIgwanStyle() {
    if (document.getElementById("ig-extra-style")) return;
    var st = document.createElement("style");
    st.id = "ig-extra-style";
    st.textContent =
      // 엘라4 배지: NEW와 동일 위치·강조 (진한 시안 + 흰 글자)
      ".ig-w-chip{position:relative!important}" +
      ".ig-w-chip .ig-chip-ella,.ig-w-chip .ig-bdg-ella{position:absolute!important;top:7px!important;right:7px!important;z-index:2;height:18px!important;padding:0 8px!important;font-size:10px!important;font-weight:900!important;line-height:18px!important;border-radius:5px!important;white-space:nowrap;letter-spacing:-0.02em;color:#fff!important;text-shadow:0 1px 2px rgba(0,0,0,.45);background:linear-gradient(135deg,#3ecfff,#0a9ad8)!important;border:1px solid rgba(120,220,255,.95)!important;box-shadow:0 0 12px rgba(30,170,240,.55),inset 0 1px 0 rgba(255,255,255,.25)!important}" +
      ".ig-w-chip .ig-chip-new{position:absolute!important;top:7px!important;right:7px!important;z-index:2}" +
      ".ig-br .ig-br-head{display:flex!important;align-items:center;justify-content:space-between;gap:10px;padding-bottom:10px;margin-bottom:10px;border-bottom:1px solid rgba(255,255,255,.1)}" +
      ".ig-br .ig-br-id{display:flex!important;align-items:center;gap:10px;min-width:0;flex:1 1 auto}" +
      ".ig-br .ig-br-title{display:flex!important;flex-direction:column;align-items:flex-start;gap:5px;min-width:0}" +
      ".ig-br .ig-br-title>span{white-space:nowrap}" +
      ".ig-br .ig-br-title small{display:flex!important;flex-wrap:wrap;align-items:center;gap:4px 5px;margin:0}" +
      ".ig-br .ig-br-title small em{white-space:nowrap}" +
      ".ig-br .ig-br-grade{flex:0 0 auto!important;white-space:nowrap!important}" +
      ".ig-br .ig-br-grade b,.ig-br .ig-br-grade span{white-space:nowrap}" +
      ".ig-grp{margin-top:10px;padding:8px 12px 12px;border:1px solid rgba(255,214,140,.3);border-radius:14px;" +
        "background:linear-gradient(160deg,rgba(38,44,68,.6),rgba(14,18,30,.82));box-shadow:inset 0 2px 10px rgba(0,0,0,.5)}" +
      ".ig-grp .ig-row{background:transparent!important;border:none!important;box-shadow:none!important;padding-left:2px;padding-right:2px;margin:0!important}" +
      ".ig-grp .ig-eng{background:transparent!important;border:none!important;box-shadow:none!important;margin:8px 0 0!important;padding:12px 0 0!important;" +
        "border-top:1px solid rgba(255,255,255,.12)!important;border-radius:0!important}" +
      ".ig-merged .ig-panel-title{padding-bottom:10px;margin-bottom:14px;border-bottom:1px solid rgba(255,255,255,.14)}" +
      ".ig-merged .ig-merged-body{gap:14px}" +
      ".ig-merged .ig-m-left,.ig-merged .ig-m-right{background:rgba(5,8,15,.6);border:1px solid rgba(255,255,255,.09);border-radius:12px;padding:14px 16px;" +
        "box-shadow:inset 0 3px 12px rgba(0,0,0,.65),inset 0 0 0 1px rgba(0,0,0,.25),0 1px 0 rgba(255,255,255,.05)}" +
      ".ig-merged .ig-m-sub{padding-bottom:9px;margin-bottom:6px;border-bottom:1px solid rgba(255,255,255,.14)}" +
      ".ig-merged .ig-kv{padding-top:9px;padding-bottom:9px;border-bottom:1px solid rgba(255,255,255,.07)}" +
      ".ig-merged .ig-kv:last-child{border-bottom:none}" +
      ".ig-merged .ig-table th{border-bottom:1px solid rgba(255,255,255,.14)}" +
      ".ig-merged .ig-table td{border-bottom:1px solid rgba(255,255,255,.06)}" +
      ".ig-merged .ig-table tr:last-child td{border-bottom:none}" +
      ".ig-merged .ig-note{margin-top:14px;padding-top:10px;border-top:1px solid rgba(255,255,255,.12)}" +
      igwanMobileCss();
    document.head.appendChild(st);
  }

  global.renderIgwan = renderIgwan;
  global.IGWAN_ICONS = IGWAN_ICONS;
})(window);
