// ===== 스킬 탭 렌더링 (app-render-skill.js) =====


// 스킬 룬 등급색 (전설=주황금, 유물=적주황 으로 구분)
function runeStyle(grade) {
  var T = {
    "고급": { c: "#8DF901", bg: "rgba(141,249,1,.16)" },
    "희귀": { c: "#00B0FA", bg: "rgba(0,176,250,.16)" },
    "영웅": { c: "#CE43FC", bg: "rgba(206,67,252,.16)" },
    "전설": { c: "#F9AE00", bg: "rgba(249,174,0,.18)" },
    "유물": { c: "#FA5D00", bg: "rgba(250,93,0,.2)" }
  };
  return T[grade] || gradeStyle(grade);
}

function isManaSkill(s) {
  var tip = parseTip(s.Tooltip);
  if (!tip) return false;
  for (var k of Object.keys(tip)) {
    var v = tip[k];
    if (v?.type === "MultiTextBox" && typeof v.value === "string" && v.value.includes("마나")) return true;
  }
  return false;
}

function parseCdSeconds(text) {
  var s = strip(text || "");
  if (!s) return 0;
  var sec = 0;
  var minM = s.match(/(\d+)\s*분/);
  if (minM) sec += parseInt(minM[1], 10) * 60;
  var secM = s.match(/(\d+(?:\.\d+)?)\s*초/);
  if (secM) sec += parseFloat(secM[1]);
  return sec;
}

// ===== 재감 적용 토글 (상단 태그 클릭으로 적용/비적용) =====
function cdOpt() { return window.__cdOpt = window.__cdOpt || { swift: true, gem: true, evo: true, mana: true }; }
function cdParams(s) {
  var o = cdOpt(), ark = window.__arkCdPct || { mana: 0, all: 1 };
  return {
    swift: o.swift ? (window.__swiftCdPct || 0) : 0,
    gem: o.gem ? (window.__gemMap?.[s.Name]?.coolPct || 0) : 0,
    mana: o.mana ? ark.mana : 0,
    all: o.evo ? ark.all : 1
  };
}

// ===== 스킬 속성 (부위 파괴 / 무력화 / 공격 타입 / 슈퍼아머 / 카운터) 아이콘 칩 =====
// 툴팁(또는 정보 표)에서 속성 읽기 → { part, groggy, attack, armor, counter }
function skillAttrs(s) {
  var out = {}, tip = parseTip(s.Tooltip);
  if (!tip) return out;
  (function walk(n) {
    if (typeof n === "string") {
      n.split(/<br\s*\/?>/i).forEach(line => {
        var t = strip(line).trim();
        var m = t.match(/^(부위\s*파괴|무력화|공격\s*타입|슈퍼아머|카운터)\s*:\s*(.+)$/);
        if (!m) return;
        var key = m[1].replace(/\s+/g, ""), v = m[2].trim();
        if (key === "부위파괴") { var lv = v.match(/(\d+)/); if (lv && +lv[1] > 0) out.part = "Lv." + lv[1]; }
        else if (key === "무력화") { if (v && v !== "없음") out.groggy = v; }
        else if (key === "공격타입") out.attack = v;
        else if (key === "슈퍼아머") out.armor = v;
        else if (key === "카운터") { if (/가능/.test(v)) out.counter = "카운터"; }
      });
    } else if (n && typeof n === "object") Object.keys(n).forEach(k => walk(n[k]));
  })(tip);
  return out;
}
function attrChipsHtml(a) {
  if (!a) return "";
  var chip = (cls, text) => `<span class="at at-${cls}">${text}</span>`;
  var h = "";
  if (a.counter) h += chip("counter", "카운터");
  if (a.attack) h += chip("attack", a.attack);            // 백 어택 / 헤드 어택 등
  if (a.part) h += chip("part", "파괴 " + a.part);
  if (a.groggy) h += chip("groggy", "무력 " + a.groggy);
  if (a.armor) String(a.armor).split(/\s*,\s*/).filter(Boolean).forEach(function (x) { h += chip("armor", x); });   // 경직 면역 / 피격이상 면역 / 상태이상 면역 (쉼표로 이어진 건 따로 칩)
  return h ? `<div class="sk-attrs">${h}</div>` : "";
}

function applyCdHtml(cdLine, s) {
  var base = parseCdSeconds(cdLine);
  if (!base) return cdLine;
  var tpCut = 0;
  var tip = parseTip(s.Tooltip);
  for (var k of Object.keys(tip || {})) {
    var v = tip[k];
    if (v?.type !== "TripodSkillCustom" || !v.value) continue;
    for (var ek of Object.keys(v.value)) {
      var o = v.value[ek];
      if (!o || !/빠른\s*준비/.test(strip(o.name || ""))) continue;
      var dm = strip(o.desc || "").match(/재사용\s*대기\s*시간[^0-9]*([0-9.]+)\s*초[^.]{0,6}감소/);
      if (dm) tpCut += parseFloat(dm[1]);
    }
  }
  var cp = cdParams(s), swift = cp.swift, gem = cp.gem, ark = { mana: cp.mana, all: cp.all };
  var arkMana = isManaSkill(s) ? ark.mana : 0;
  var timeRe = /(\d+\s*분(?:\s*\d+(?:\.\d+)?\s*초)?|\d+(?:\.\d+)?\s*초)/;
  var oldM = String(cdLine).match(timeRe);
  var oldShow = base + "초";
  if (!tpCut && !swift && !gem && !arkMana && ark.all === 1) {
    if (oldM) return String(cdLine).replace(oldM[0], oldShow);
    return cdLine;
  }
  var eff = Math.max(0, base - tpCut) * (1 - swift / 100) * (1 - gem / 100) * (1 - arkMana / 100) * ark.all;
  if (oldM) {
    return String(cdLine).replace(oldM[0], `<s class="tip-cd-old">${oldShow}</s> <span class="tip-cd-new">${eff.toFixed(2)}초</span>`);
  }
  return cdLine + ` <s class="tip-cd-old">${oldShow}</s> <span class="tip-cd-new">${eff.toFixed(2)}초</span>`;
}

function effCdBadge(s) {
  var tip = parseTip(s.Tooltip);
  if (!tip) return "";
  var base = 0, tpCut = 0;
  for (var k of Object.keys(tip)) {
    var v = tip[k];
    if (!v?.type || !v.value) continue;
    if (v.type === "CommonSkillTitle") {
      var left = strip(v.value.leftText || "");
      var sec = parseCdSeconds(left);
      if (sec) base = sec;
    } else if (v.type === "TripodSkillCustom") {
      for (var ek of Object.keys(v.value)) {
        var o = v.value[ek];
        if (!o || !/빠른\s*준비/.test(strip(o.name || ""))) continue;
        var dm = strip(o.desc || "").match(/재사용\s*대기\s*시간[^0-9]*([0-9.]+)\s*초[^.]{0,6}감소/);
        if (dm) tpCut += parseFloat(dm[1]);
      }
    }
  }
  if (!base) return "";
  var cp = cdParams(s), swift = cp.swift, gem = cp.gem, ark = { mana: cp.mana, all: cp.all };
  var arkMana = isManaSkill(s) ? ark.mana : 0;
  var eff = Math.max(0, base - tpCut) * (1 - swift / 100) * (1 - gem / 100) * (1 - arkMana / 100) * ark.all;
  return `<div class="sk-cd">${eff.toFixed(2)}초</div>`;
}

function skillTraitFlags(s) {
  var out = { counter: false, groggy: false, brk: false };
  var tip = parseTip(s.Tooltip);
  if (!tip) return out;
  var text = "";
  for (var k of Object.keys(tip)) {
    var v = tip[k];
    if (v?.type === "SingleTextBox" && typeof v.value === "string") text += " " + strip(v.value);
  }
  out.counter = /카운터\s*:\s*가능/.test(text);
  out.groggy = /무력화\s*:\s*(?!없음)\S/.test(text);
  var bm = text.match(/부위\s*파괴\s*:\s*레벨\s*([0-9]+)/);
  out.brk = !!bm && parseInt(bm[1], 10) > 0;
  return out;
}

function groupTripods(tripods) {
  var byTier = { 0: [], 1: [], 2: [] };
  for (var t of (tripods || [])) {
    if (byTier[t.Tier] !== undefined) byTier[t.Tier].push(t);
  }
  return [0, 1, 2].map(tier => {
    var options = byTier[tier].slice().sort((a, b) => (a.Slot || 0) - (b.Slot || 0));
    if (!options.length) return null;
    var picked = options.find(o => o.IsSelected);
    return { tier, options, selected: picked || options[0], none: !picked };   // none: 해당 단계 트라이포드 미선택
  }).filter(Boolean);
}

// 초각스킬/각성기/초각성기처럼 API에 설명이 없는 스킬의 설명 (인벤 기준: 스킬 이름 → 설명 HTML)
var SKILL_DESC = {
  // "스킬이름": "설명 문장… <b>12,345</b>의 피해를 준다.",
};
var __descIdx = null;
function skillDescOf(name) {
  var norm = x => String(x || "").replace(/\s+/g, "");
  var k = norm(name);
  for (var key in SKILL_DESC) if (norm(key) === k) return SKILL_DESC[key];
  var xd = window.__xsMap && window.__xsMap[k];
  if (xd && xd.desc) return String(xd.desc).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\n/g, "<br>").replace(/(\d[\d,]*(?:\.\d+)?%?)/g, '<span class="dnum">$1</span>');
  // 별도 데이터 파일(skill-desc.js)의 설명: 줄바꿈 처리 + 숫자 강조
  var data = window.SKILL_DESC_DATA;
  if (!data) return "";
  if (!__descIdx || __descIdx.src !== data) {
    __descIdx = { src: data, map: {} };
    for (var dk in data) __descIdx.map[norm(dk)] = data[dk];
  }
  var t = __descIdx.map[k];
  if (!t) return "";
  return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\n/g, "<br>")
    .replace(/(\d[\d,]*(?:\.\d+)?%?)/g, '<span class="dnum">$1</span>');
}
function buildSkillTipHtml(s) {
  var tip = parseTip(s.Tooltip);
  if (!tip) return buildTipHtml(s.Tooltip, s.Name);
  var tag = "", cdLine = "", manaLine = "", infoHtml = "", tpHtml = "";
  for (var k of Object.keys(tip)) {
    var v = tip[k];
    if (!v?.type) continue;
    if (v.type === "CommonSkillTitle" && v.value) {
      tag = strip(v.value.level || "");
      cdLine = strip(v.value.leftText || "");
    } else if (v.type === "MultiTextBox" && typeof v.value === "string" && v.value.includes("마나")) {
      manaLine = strip(v.value).replace(/\|$/, "");
    } else if (v.type === "SingleTextBox" && v.value && /부위\s*파괴|무력화|슈퍼아머/.test(strip(v.value))) {
      infoHtml = v.value.replace(/^((?:\s|<(?!br)[^>]*>)*)(?:<br\s*\/?>\s*)+/i, "$1");
    } else if (v.type === "TripodSkillCustom" && v.value) {
      tpHtml = Object.keys(v.value).map(ek => v.value[ek]).filter(Boolean).map(o => `
        <div class="tip-tp">
          ${o.slotData?.iconPath ? `<img class="tip-tp-icon" src="${o.slotData.iconPath}" alt="">` : ""}
          <div class="tip-tp-body"><div class="tip-tp-name">${strip(o.name || "")}</div><div class="tip-tp-desc">${o.desc || ""}</div></div>
        </div>`).join("");
    }
  }
  return `
    <div class="tip-hd tip-hd-skill">
      ${s.Icon ? `<img class="tip-skill-icon" src="${s.Icon}" alt="">` : ""}
      <div class="tip-hd-text"><div class="tip-hd-name">${s.Name}${tag ? ` <span class="tip-tag">${tag}</span>` : ""}</div></div>
    </div>
    <div class="tip-bd" style="padding-bottom:6px;">
      ${cdLine ? `<div class="tip-line">${applyCdHtml(cdLine, s)}</div>` : ""}
      ${manaLine ? `<div class="tip-line muted">${manaLine}</div>` : ""}
    </div>
    ${skillDescOf(s.Name) ? `<div class="tip-bd" style="padding-top:8px;padding-bottom:6px;font-size:11px;line-height:1.5;color:#c7cee0;">${skillDescOf(s.Name)}</div>` : ""}
    ${infoHtml ? `<div class="tip-info"><div class="tip-info-line">${infoHtml}</div></div>` : ""}
    ${tpHtml ? `<div class="tip-tp-wrap">${tpHtml}</div>` : ""}`;
}

var SKILL_CATEGORY = {
  "디스트로이어": { "어스 이터": "해방", "풀 스윙": "해방", "뉴트럴라이저": "해방", "어스 웨이브": "해방", "퍼펙트 스윙": "해방", "그라비티 컴프레이션": "해방", "사이즈믹 해머": "해방", "슈퍼 노바": "해방" },
  "워로드": { "방패 밀치기": "일반", "배쉬": "일반", "리프 어택": "일반", "가디언의 낙뢰": "일반", "갈고리 사슬": "일반", "방패 돌진": "일반", "증오의 함성": "일반", "방패 격동": "일반", "넬라시아의 기운": "일반", "실드 대시": "일반" },
  "배틀마스터": { "오의 : 화룡천상": "오의", "오의 : 풍신초래": "오의", "오의 : 폭쇄진": "오의", "오의 : 창룡패황권": "오의", "오의 : 나선경": "오의", "오의 : 금뢰각": "오의" },
  "인파이터": { "심판": "충격", "죽음의 선고": "충격", "풍신권": "충격", "회심의 일격": "충격", "연환파신권": "충격", "진 용출권": "충격", "파쇄격": "충격", "초신성 폭발": "충격", "천지파권": "충격" },
  "창술사": { "나선창": "집중", "사두룡격": "집중", "굉열파": "집중", "유성강천": "집중", "절룡세": "집중", "적룡포": "집중", "적룡필살": "집중" },
  "스트라이커": { "오의 : 호왕출현": "오의", "오의 : 풍신초래": "오의", "오의 : 폭쇄진": "오의", "오의 : 뇌호격": "오의", "오의 : 청염각": "오의" },
  "브레이커": { "권왕의 진격": "기력", "연쇄 돌풍": "기력", "비뢰격": "기력", "유성 낙하": "기력", "즉결타": "기력", "연속전격": "기력", "백렬권": "기력", "금강난격": "기력", "징벌의 파도": "기력", "천왕지무": "기력", "척결": "충격", "휩쓸기": "충격", "비상격": "충격", "대지파쇄권": "충격", "진 파공권": "충격", "청월난무": "충격", "연의붕권": "충격", "천기심권": "충격", "파천섬광": "충격", "성운멸쇄권": "충격" },
  "데빌헌터": { "나선의 추적자": "핸드건", "AT02 유탄": "핸드건", "사형 집행": "핸드건", "플라즈마 불릿": "핸드건", "메테오 스트림": "핸드건", "썸머솔트샷": "핸드건", "이퀄리브리엄": "핸드건", "데스파이어": "핸드건", "민첩한 사격": "핸드건", "퀵 샷": "핸드건", "잔혹한 추적자": "핸드건", "데스페라도": "핸드건", "비밀 병기": "핸드건", "래피드 파이어": "핸드건", "종말의 전조": "샷건", "심판의 날": "샷건", "샷건 연사": "샷건", "샷건의 지배자": "샷건", "최후의 만찬": "샷건", "둠스 데이": "샷건", "스파이럴 플레임": "라이플", "대재앙": "라이플", "원샷원킬": "라이플", "조준 사격": "라이플", "퍼펙트 샷": "라이플", "죽음의 표적": "라이플" },
  "블래스터": { "포격 : 스틸 레인": "포격 스킬" },
  "스카우터": { "코멧 스트라이크": "싱크 계열 스킬", "슬러그 샷": "싱크 계열 스킬", "레이저 블레이드": "싱크 계열 스킬", "엑셀리온 빔": "싱크 계열 스킬", "버스트 블로우": "싱크 계열 스킬", "크림슨 브레이커": "싱크 계열 스킬", "소닉 임팩트": "싱크 계열 스킬", "퀀텀 어셈블리 빔": "싱크 계열 스킬", "EX - 제로 포인트": "싱크 계열 스킬" },
  "건슬링어": { "나선의 추적자": "핸드건", "AT02 유탄": "핸드건", "퀵 스텝": "핸드건", "플라즈마 불릿": "핸드건", "메테오 스트림": "핸드건", "썸머솔트샷": "핸드건", "이퀄리브리엄": "핸드건", "데스파이어": "핸드건", "민첩한 사격": "핸드건", "피스키퍼": "핸드건", "레인 오브 불릿": "핸드건", "프리즌 불릿": "핸드건", "심판의 시간": "샷건", "샷건 연사": "샷건", "최후의 만찬": "샷건", "절멸의 탄환": "샷건", "마탄의 사수": "샷건", "세븐 샷건": "샷건", "스파이럴 플레임": "라이플", "대재앙": "라이플", "퍼펙트 샷": "라이플", "포커스 샷": "라이플", "타겟 다운": "라이플", "불스 아이": "라이플", "로즈 블로섬": "라이플" },
  "아르카나": { "셀레스티얼 레인": "루인", "포 카드": "루인", "세렌디피티": "루인", "시크릿 가든": "루인", "더 데빌": "루인" },
  "리퍼": { "라스트 그래피티": "급습", "레이지 스피어": "급습", "댄싱 오브 퓨리": "급습", "사일런트 스매셔": "급습", "피니쉬 스텝": "급습" },
  "데모닉": { "라스트 그래피티": "급습" },
  "소울이터": { "베스티지": "사신", "데스 위핑": "사신", "소울 시너스": "사신", "길로틴 스윙": "사신", "데스 피날레": "사신" },
  "기상술사": { "소용돌이": "기상", "소나기": "기상", "센바람": "기상", "짙은 안개": "기상", "봄바람": "기상", "날아가기": "기상", "싹쓸바람": "기상", "뙤약볕": "기상", "여름 햇살": "기상", "눈부신 나날들": "기상" },
  "환수사": { "여우 꼬리물기": "둔갑", "여우 불꽃": "둔갑", "여우 구슬": "둔갑", "여우 폴짝": "둔갑", "슈웅 곰": "둔갑", "뒤집 곰": "둔갑", "어흥 곰": "둔갑", "바위 곰": "둔갑", "한방 곰": "둔갑", "둔갑 금술 스킬": "둔갑" },
  "차원술사": { "일침": "시침", "예고": "시침", "분절": "시침", "공간 조작": "시침", "전방 찌르기": "분침", "공간 베기": "분침", "건너 찌르기": "분침", "역공": "분침", "너머 베기": "분침", "진공": "분침", "공간 절단": "분침", "분광": "분침", "일점 관통": "결합", "시간 분쇄": "결합", "경계 돌파": "결합", "차원의 틈": "결합" },
  "홀리나이트": {},
  "가디언나이트": { "리벤지 블로우": "화신", "스피닝 플레임": "화신", "윙 스팅어": "화신", "블레이즈 스윕": "화신", "렌딩 피니셔": "화신", "딥 임팩트": "화신", "인페르노 버스트": "화신" }
};
window.SKILL_CATEGORY = SKILL_CATEGORY;
window.SKILL_CATEGORY["발키리"] = window.SKILL_CATEGORY["가디언나이트"];

function skillCategoryOf(s) {
  var cls = window.__charClass || "";
  var map = window.SKILL_CATEGORY[cls];
  if (!map) return "기본";
  return map[s.Name] || "기본";
}

function skillBaseCd(s) {
  var tip = parseTip(s.Tooltip);
  if (!tip) return 0;
  for (var k of Object.keys(tip)) {
    var v = tip[k];
    if (v?.type === "CommonSkillTitle") return parseCdSeconds(strip(v.value?.leftText || "")) || 0;
  }
  return 0;
}

function skillSortKey(s, gemMap) {
  var gm = gemMap[s.Name] || {};
  var dmg = gm.dmg || 0, cool = gm.cool || 0;
  return { both: (dmg > 0 && cool > 0) ? 1 : 0, gemCount: (dmg > 0 ? 1 : 0) + (cool > 0 ? 1 : 0), gemSum: dmg + cool, lv: s.Level || 0, cd: skillBaseCd(s) };
}

function cmpSkillKey(a, b) {
  if (b.both !== a.both) return b.both - a.both;
  if (b.gemCount !== a.gemCount) return b.gemCount - a.gemCount;
  if (b.gemSum !== a.gemSum) return b.gemSum - a.gemSum;
  if (b.lv !== a.lv) return b.lv - a.lv;
  if (b.cd !== a.cd) return b.cd - a.cd;
  return 0;
}

function sortSkillsForDisplay(skills, gemMap) {
  var items = skills.map(s => ({ s, key: skillSortKey(s, gemMap), cat: skillCategoryOf(s) }));
  var byCat = {};
  for (var it of items) (byCat[it.cat] || (byCat[it.cat] = [])).push(it);
  var catOrder = Object.keys(byCat).sort((ca, cb) => {
    var ga = byCat[ca], gb = byCat[cb];
    var bestA = ga[0].key, bestB = gb[0].key;
    for (var it of ga) if (cmpSkillKey(it.key, bestA) < 0) bestA = it.key;
    for (var it of gb) if (cmpSkillKey(it.key, bestB) < 0) bestB = it.key;
    var c = cmpSkillKey(bestA, bestB);
    if (c) return c;
    if (ca === "기본" && cb !== "기본") return 1;
    if (cb === "기본" && ca !== "기본") return -1;
    return ca.localeCompare(cb, "ko");
  });
  var out = [];
  for (var cat of catOrder) {
    var group = byCat[cat].slice();
    group.sort((a, b) => { var c = cmpSkillKey(a.key, b.key); if (c) return c; return (a.s.Name || "").localeCompare(b.s.Name || "", "ko"); });
    out.push(...group.map(it => it.s));
  }
  return out;
}

// ===== 초각성 / 각성기 구역 =====
// 아크패시브 도약 노드 설명에 이름이 나오는 초각스킬은 활성, 나머지는 비활성 (도약 노드를 안 찍어 하나도 없으면 전부 비활성)
function splitHyperSkills(list) {
  if (!list.length) return { active: [], inactive: [] };
  var ap = window.__fullData && window.__fullData.ArkPassive;
  var effs = (ap && ap.Effects) || [];
  var leap = effs.filter(e => /도약/.test((e.Name || "") + " " + (e.Description || "")));
  // 띄어쓰기/HTML 태그/"묵법 : " 같은 접두어 차이를 무시하고 비교 (예: 스킬 "묵법 : 미르 새김" ↔ 노드 설명 "미르새김")
  var nz = t => String(t || "").replace(/<[^>]*>/g, "").replace(/\\n|\s+/g, "");
  var txt = nz(JSON.stringify(leap.length ? leap : effs));
  var hit = list.filter(s => {
    if (!s.Name) return false;
    var full = nz(s.Name), short = nz(String(s.Name).replace(/^[^:]+:\s*/, ""));
    return txt.indexOf(full) >= 0 || (short && txt.indexOf(short) >= 0);
  });
  // 노드 설명에 초각스킬 이름이 안 적힌 도약 노드: 노드 이름 → 활성화할 초각스킬 (직접 추가 가능)
  var NODE_HYPER = { "악의적인권한": ["와일드슬래쉬"] };
  for (var nk in NODE_HYPER) {
    if (txt.indexOf(nk) < 0) continue;
    list.forEach(s => { if (s.Name && NODE_HYPER[nk].indexOf(nz(s.Name)) >= 0 && hit.indexOf(s) < 0) hit.push(s); });
  }
  if (!hit.length) return effs.length ? { active: [], inactive: list } : { active: list, inactive: [] };
  return { active: hit, inactive: list.filter(s => hit.indexOf(s) < 0) };
}
// 아크패시브 노드로 얻는 스킬 (스킬 데이터에는 없고 ArkPassive.Effects에만 있음). 필요하면 이름 추가

var ARK_SKILL_NODES = ["포화 공격", "살인귀", "연가비기", "대지 가르기", "공간 가르기", "공간가르기", "눈부신 나날들", "사냥의 시간"];
// 노드 이름과 스킬 이름이 다른 경우(예: 노드 "사냥의 시간" → 스킬 "로즈 블로섬") ARK_SKILL_INFO 항목의 node 값으로 연결
function arkSkillNameOf(node) {
  var k = String(node || "").replace(/\s+/g, "");
  for (var key in ARK_SKILL_INFO) {
    var nd = ARK_SKILL_INFO[key].node;
    if (nd && nd.replace(/\s+/g, "") === k) return key;
  }
  return node;
}

function arkSkillNodes() {
  var ap = window.__fullData && window.__fullData.ArkPassive;
  var effs = (ap && ap.Effects) || [], out = [];
  for (var e of effs) {
    var d = strip(e.Description || "");
    var nm = ARK_SKILL_NODES.find(n => d.indexOf(n) >= 0) || "";
    if (!nm && /깨달음/.test(e.Name || "")) {
      // 자동 탐지: 깨달음 노드 설명에 "키 입력 시" 또는 "키를 눌러"가 들어 있으면 스킬 부여 노드로 간주
      var parts = [], tip = parseTip(e.ToolTip);
      (function walk(n) {
        if (typeof n === "string") parts.push(strip(n));
        else if (n && typeof n === "object") Object.keys(n).forEach(k => walk(n[k]));
      })(tip);
      var txt = parts.join(" ");
      if (/키\s*입력\s*시|키를\s*눌러|키로\s*사용/.test(txt)) {
        nm = (d.match(/티어\s+(.+?)\s+Lv\.?\s*\d+/) || [])[1] || "";
      }
    }
    if (!nm) continue;
    nm = (d.match(/티어\s+(.+?)\s+Lv\.?\s*\d+/) || [])[1] || nm;
    out.push({
      eff: e, name: arkSkillNameOf(nm), node: nm, cat: e.Name || "아크패시브",
      tier: (d.match(/(\d+)\s*티어/) || [])[1],
      lv: (d.match(/Lv\.?\s*(\d+)/) || [])[1]
    });
  }
  return out;
}
// 아크패시브 스킬의 기본 정보 (API에 없는 값이라 고정 데이터로 관리: 인벤 기준)
// icon: 스킬 아이콘 주소를 직접 지정하고 싶으면 항목에 icon: "https://..." 추가 (없으면 자동 탐색 후 노드 아이콘)
var ARK_SKILL_INFO = {
  "포화 공격": {   // 블래스터: 깨달음 노드로 찍혔을 때만 표시
    grade: "일반", tag: "[일반 스킬]", cd: 60, skillLv: 1, groggy: "최상", armor: "피격이상 면역",
    desc: "포화 공격을 위한 중화기를 꺼내 장착 후 전방을 향해 최대 10회 공격하며 각 공격은 <b>3,776</b> 피해를 준다."
  },
  "페이탈 스텝": {
    node: "살인귀", nodeIcon: true,   // 리퍼 갈증: 살인귀 노드가 곧 페이탈 스텝 (아이콘은 살인귀 노드 아이콘 사용)
    grade: "지점", cd: 40, skillLv: 1, attack: "백 어택", armor: "피격이상 면역",
    desc: "혼돈 상태일 때 사용할 수 있으며, 전방으로 9m 날아올라 적을 베어버리며 <b>2,058</b>의 피해를 준다. 이동 중 모험가 및 가디언 몬스터까지 충돌이 무시된다."
  },
  "연가비기": {
    grade: "일반", tag: "[난무 스킬]", cd: 22, skillLv: 1,
    groggy: "중", attack: "백 어택", armor: "피격이상 면역",
    desc: "창을 돌려 기운을 모은 후 전방으로 돌진하며 창을 휘둘러 <b>6,768</b>의 피해를 주고 넘어뜨린다."
  },
  "대지 가르기": {
    grade: "일반", tag: "[기력 스킬]", cd: 5, skillLv: 1,
    groggy: "상", attack: "백 어택", armor: "피격이상 면역",
    desc: "주먹에 강력한 기운을 모아 앞으로 전진하며 내질러 <b>21,040</b>의 피해를 주고 넘어뜨린다."
  },
  "공간가르기": {
    grade: "일반", tag: "[우산 스킬]", cd: 22, skillLv: 1,
    groggy: "상", armor: "피격이상 면역",
    desc: "후방으로 낮게 점프함과 동시에 전방을 베어버리며 <b>9,336</b>의 피해를 준다. 이어서 검풍이 발생하여 <b>21,769</b>의 피해를 준다."
  },
  "로즈 블로섬": {
    node: "사냥의 시간",
    grade: "일반", tag: "[라이플 스탠스]", cd: 60, skillLv: 1,
    partLv: 1, groggy: "중", armor: "피격이상 면역",
    desc: "붉은 장미가 새겨진 라이플로 전방 조준 후 발사하여 <b>51,278</b>의 피해를 주며 적을 날려버린다."
  },
  "눈부신 나날들": {
    grade: "일반", tag: "[기상 스킬]", cd: 30, skillLv: 1,
    partLv: 2, groggy: "상", armor: "피격이상 면역",
    desc: "하늘에서 눈부신 햇살이 비춰지며 여우비 반경 내에 <b>15,650</b>의 피해를 주고 적을 날려버린다."
  }
};
// 스킬 이름 띄어쓰기 차이("공간 가르기" / "공간가르기")를 무시하고 정보 찾기
function arkInfoOf(name) {
  var k = String(name || "").replace(/\s+/g, "");
  for (var key in ARK_SKILL_INFO) if (key.replace(/\s+/g, "") === k) return ARK_SKILL_INFO[key];
  var xi = window.__xsMap && window.__xsMap[k];   // 직업별 추가 스킬 표 (깨달음 노드 스킬 툴팁 보강)
  if (xi) return { grade: xi.grade, tag: xi.tag ? "[" + xi.tag + "]" : "", cd: xi.cdSec || parseCdSeconds(xi.cd), skillLv: xi.lv,
    partLv: xi.part, groggy: xi.groggy, attack: xi.attack, armor: xi.armor };
  return {};
}
// 아크패시브 스킬 아이콘: 정보 표의 icon → 스킬 목록 → 보석 데이터 → 노드 아이콘 순서
function arkIconOf(n) {
  var info = arkInfoOf(n.name);
  if (info.icon) return info.icon;
  if (info.nodeIcon && n.eff && n.eff.Icon) return n.eff.Icon;
  var fd = window.__fullData || {};
  var key = String(n.name || "").replace(/\s+/g, "");
  var sk = (fd.ArmorySkills || []).find(x => String(x.Name || "").replace(/\s+/g, "") === key);
  if (sk && sk.Icon) return sk.Icon;
  var g = gemSkillIcon(fd.ArmoryGem, n.name, fd.ArmorySkills);
  return g || (n.eff && n.eff.Icon) || "";
}
// 재사용 대기시간에 신속 / 아크패시브 재감 적용
function arkSkillEffCd(base) {
  var cp = cdParams({ Name: "" });
  return base * (1 - cp.swift / 100) * cp.all;
}
// 노드 툴팁에서 가장 긴 설명 문구(원본 색 서식 유지) 추출
function arkNodeDescHtml(eff) {
  var tip = parseTip(eff.ToolTip);
  if (!tip) return "";
  var best = "", bestLen = 0;
  (function walk(n) {
    if (typeof n === "string") {
      if (/^\s*https?:/i.test(n) || !/[가-힣]/.test(n)) return;   // 아이콘 주소 등은 제외
      var t = strip(n); if (t.length > 30 && t.length > bestLen) { best = n; bestLen = t.length; }
    }
    else if (n && typeof n === "object") Object.keys(n).forEach(k => walk(n[k]));
  })(tip);
  return best.replace(/\|\|/g, "").replace(/(<br\s*\/?>\s*)+$/i, "");
}
function arkSkillTipHtml(n) {
  var info = arkInfoOf(n.name);
  var iconSrc = arkIconOf(n);
  var icon = iconSrc ? `<img class="tip-skill-icon" src="${iconSrc}" alt="">` : "";
  var cd = "";
  if (info.cd) {
    var eff = arkSkillEffCd(info.cd);
    cd = Math.abs(eff - info.cd) > 0.005
      ? `<span class="tip-cd-old">${info.cd}초</span> <span class="tip-cd-new">${eff.toFixed(2)}초</span>`
      : `${info.cd}초`;
    cd = `<div class="tip-line">재사용 대기시간 ${cd}</div>`;
  }
  var lines = [];
  if (info.partLv) lines.push(`부위 파괴 : 레벨 ${info.partLv}`);
  if (info.groggy) lines.push(`무력화 : ${info.groggy}`);
  if (info.attack) lines.push(`공격 타입 : ${info.attack}`);
  if (info.armor) lines.push(`슈퍼아머 : ${info.armor}`);
  var infoHtml = lines.length
    ? `<div class="tip-info"><div class="tip-info-line">${lines.map(l => `<FONT COLOR='#EEA839'>${l}</FONT>`).join("<br>")}</div></div>` : "";
  var nodeDesc = arkNodeDescHtml(n.eff);
  return `
    <div class="tip-hd tip-hd-skill">
      ${icon}
      <div class="tip-hd-text"><div class="tip-hd-name">${n.name}${info.tag ? ` <span class="tip-tag">${info.tag}</span>` : ""}</div>
      ${info.grade ? `<div class="tip-muted">${info.grade}</div>` : ""}</div>
    </div>
    <div class="tip-bd" style="padding-bottom:6px;">
      ${cd}
      ${info.skillLv ? `<div class="tip-line muted">스킬 레벨 ${info.skillLv}</div>` : ""}
    </div>
    ${infoHtml}
    ${info.desc ? `<div class="tip-bd" style="padding-top:8px;padding-bottom:4px;font-size:11px;line-height:1.5;color:#c7cee0;">${info.desc}</div>` : ""}
    ${nodeDesc ? `<div class="tip-bd" style="padding-top:6px;"><div class="tip-sec-title">${n.cat}${n.tier ? " " + n.tier + "티어" : ""}${n.node && n.node !== n.name ? " · " + n.node : ""} · 아크 패시브 레벨 ${n.lv || "-"}</div><div style="font-size:11px;line-height:1.55;color:#b6bed2;">${nodeDesc}</div></div>` : ""}`;
}
function buildSpecialSection(specials, gemMap) {
  gemMap = gemMap || {};
  var hyperAll = specials.filter(s => s.SkillType === 1);
  // API가 주는 원래 순서 유지: "각성기(100) 바로 다음에 이어지는 초각성기(101)"가 한 쌍
  var awk = specials.filter(s => (s.SkillType || 0) >= 100);
  var awk1 = [], awk2 = [], awkUsed = new Set();
  awk.forEach((x, i) => {
    if (x.SkillType === 101) return;
    awk1.push(x);
    var nx = awk[i + 1];
    if (nx && nx.SkillType === 101) { awk2.push(nx); awkUsed.add(nx); }
  });
  awk.forEach(x => { if (x.SkillType === 101 && !awkUsed.has(x)) awk2.push(x); });
  // 그 외 특수 스킬 (예: 버스트 등, 레벨 1이라 숨겨지던 비일반 타입)
  var others = specials.filter(s => s.SkillType !== 1 && (s.SkillType || 0) < 100);
  var hy = splitHyperSkills(hyperAll);
  var arks = arkSkillNodes();
  if (!hyperAll.length && !awk.length && !arks.length && !others.length) return { html: "", hyperHtml: "", arkHtml: "", items: [], arks: [] };

  var items = [];
  var strip2 = n => String(n || "").replace(/^[^:]+:\s*/, "");
  function it(s, badge, shortName, off, badgeCls) {
    var idx = items.push(s) - 1;
    return `<div class="sp-it${off ? " off" : ""}" data-sp="${idx}">
      <div class="sk-icon">${s.Icon ? `<img src="${s.Icon}" alt="" loading="lazy">` : ""}</div>
      <div class="sp-nw"><div class="sk-lv${badgeCls ? " " + badgeCls : ""}">${badge}</div><div class="sk-name">${shortName || s.Name || "-"}</div></div>
      ${effCdBadge(s)}
      ${attrChipsHtml(skillAttrs(s))}
    </div>`;
  }

  // 초각스킬: 스킬 목록 맨 위에 별도 반환 (hyperHtml)
  var hyperHtml = "";
  if (hyperAll.length) {
    hyperHtml = `<div class="sp-card hyper"><div class="sp-grid" style="grid-template-columns:repeat(${Math.min(hyperAll.length, 4)},minmax(0,1fr))">`
      + hy.active.map(x => it(x, "초각스킬")).join("")
      + hy.inactive.map(x => it(x, "초각스킬", null, true)).join("")
      + `</div></div>`;
  }
  // 나머지(각성기, 초각성기, 특수, 아크패시브)는 스킬 목록 아래
  var html = (awk.length || others.length) ? `<div class="sk-sep"></div>` : "";
  var arkHtml = "";

  // 각성기 + 이어지는 초각성기를 한 쌍씩 가로로 묶은 카드 (카드 1: 각성기A | 초각성기A, 카드 2: 각성기B | 초각성기B)
  if (awk.length) {
    var pres = awk.map(x => (String(x.Name || "").match(/^([^:]+):/) || [])[1]);
    var sharedPre = pres.every(x => x && x === pres[0]) ? pres[0] : "";
    var pairN = Math.max(awk1.length, awk2.length);
    for (var pi = 0; pi < pairN; pi++) {
      var cells = [
        awk1[pi] ? it(awk1[pi], "각성기", sharedPre ? strip2(awk1[pi].Name) : awk1[pi].Name, false, "") : "",
        awk2[pi] ? it(awk2[pi], "초각성기", sharedPre ? strip2(awk2[pi].Name) : awk2[pi].Name, false, "hy2") : ""
      ].join("");
      html += `<div class="sp-card awk"><div class="sp-grp-hd">각성기 · 초각성기${sharedPre ? " · " + sharedPre : ""}</div>
        <div class="sp-grid">${cells}</div></div>`;
    }
  }
  if (others.length) {
    html += `<div class="sp-card awk etc"><div class="sp-grp-hd">특수 스킬</div><div class="sp-grid">`
      + others.map(x => it(x, x.Type || "특수")).join("") + `</div></div>`;
  }
  // 아크패시브 스킬 (연가비기 등): 속성 칩 + (아이덴티티로 장착된) 보석
  if (arks.length) {
    var gemOf = nm => { var k = String(nm || "").replace(/\s+/g, ""); for (var g in gemMap) if (g.replace(/\s+/g, "") === k) return gemMap[g]; return null; };
    arkHtml = `<div class="sp-card ark"><div class="sp-grid${arks.length === 1 ? " one" : ""}">` + arks.map((n, i) => {
      var info = arkInfoOf(n.name);
      var chips = attrChipsHtml({
        part: info.partLv ? "Lv." + info.partLv : "", groggy: info.groggy, attack: info.attack, armor: info.armor
      });
      var cdTxt = info.cd ? `<div class="sk-cd ark-lv">${arkSkillEffCd(info.cd).toFixed(2)}초</div>` : "";
      var gm = gemOf(n.name);
      var gemHtml = gm && (gm.dmg || gm.cool) ? `<div class="gems">
          <div class="gem op" data-ag="${i}" data-agt="dmg"><div class="gem-circle${gm.dmg ? " g-" + gm.dmgGrade : " empty"}">${gm.dmgIcon ? `<img class="gem-icon" src="${gm.dmgIcon}" alt="">` : ""}</div>${gm.dmg ? `<span class="gem-txt">${gm.dmg}겁</span>` : ""}</div>
          <div class="gem rd" data-ag="${i}" data-agt="cool"><div class="gem-circle${gm.cool ? " g-" + gm.coolGrade : " empty"}">${gm.coolIcon ? `<img class="gem-icon" src="${gm.coolIcon}" alt="">` : ""}</div>${gm.cool ? `<span class="gem-txt">${gm.cool}작</span>` : ""}</div>
        </div>` : "";
      n._gm = gm;
      return `
      <div class="sp-it" data-ark="${i}">
        <div class="sk-icon">${arkIconOf(n) ? `<img src="${arkIconOf(n)}" alt="" loading="lazy">` : ""}</div>
        <div class="sp-nw"><div class="sk-lv">${n.cat}${n.tier ? " " + n.tier + "티어" : ""}${n.lv ? " · Lv." + n.lv : ""}</div>
          <div class="sk-nm-col">${skillTypeHtml(String(info.tag || "").replace(/[\[\]]/g, "").replace(/^일반\s*스킬$/, ""))}<div class="sk-name">${n.name}</div></div></div>
        ${gemHtml}${cdTxt}${chips}
      </div>`;
    }).join("") + `</div></div>`;
  }
  return { html, hyperHtml, arkHtml, items, arks };
}

// ===== 그 외 장착 보석: 스킬창에 없는 스킬(아이덴티티 등)에 장착된 보석 =====
function gemSkillIcon(gemData, name, skillsData) {
  var sk = (skillsData || []).find(x => x.Name === name);
  if (sk && sk.Icon) return sk.Icon;
  var effs = gemData && gemData.Effects;
  var arr = Array.isArray(effs) ? effs : ((effs && effs.Skills) || []);
  var e = arr.find(x => x && x.Name === name);
  return (e && e.Icon) || (typeof skillIconByName === "function" ? skillIconByName(name) : "")   // 공백 차이 / 'OO 계열' 이름도 찾기
    || (typeof SPECIAL_SKILL_ICONS !== "undefined" && SPECIAL_SKILL_ICONS[name]) || "";            // 인페르노 버스트 등 고정 아이콘
}
// ===== 가디언 나이트: 기본 스킬 ↔ 변신(화신) 스킬 =====
var GK_PAIRS = [
  ["리벤지 블로우", "리벤지 스피어"], ["스피닝 플레임", "아바돈 플레임"], ["윙 스팅어", "윙 래시"],
  ["블레이즈 스윕", "블레이즈 플래시"], ["렌딩 피니셔", "익스플로전 피니셔"]
];
function gkNorm(x) { return String(x || "").replace(/\s+/g, ""); }
// 드레드 로어 직각이면 변신을 하지 않으므로 변신 스킬 이름 집합을 돌려줌 (그 외엔 null → 전부 표시)
function gkHiddenNames() {
  var ap = window.__fullData && window.__fullData.ArkPassive;
  var txt = ((ap && ap.Effects) || []).map(function (e) { return gkNorm(strip((e.Name || "") + " " + (e.Description || ""))); }).join("|");
  if (txt.indexOf("드레드로어") < 0) return null;
  var set = {};
  GK_PAIRS.forEach(function (p) { set[gkNorm(p[1])] = 1; });
  return set;
}
window.gkIsHiddenSkill = function (name) { var h = gkHiddenNames(); return !!(h && h[gkNorm(name)]); };
// 변신 스킬을 기본 스킬 바로 아래로 옮김 (기본 스킬이 목록에 있을 때만)
function gkArrange(list) {
  var byN = {}, subs = new Set(), subOf = {};
  list.forEach(function (s) { byN[gkNorm(s.Name)] = s; });
  GK_PAIRS.forEach(function (p) {
    var b = byN[gkNorm(p[0])], t = byN[gkNorm(p[1])];
    if (b && t && b !== t) { subOf[gkNorm(p[0])] = t; subs.add(t); }
  });
  var out = [];
  list.forEach(function (s) {
    if (subs.has(s)) return;
    out.push(s);
    var t = subOf[gkNorm(s.Name)];
    if (t) out.push(t);
  });
  return { list: out, subs: subs };
}
// 인벤 기준 아이덴티티 스킬 정보 (스킬창에 없어 API로 못 가져오는 값)
var IDENTITY_SKILL_INFO = {
  "인페르노 버스트": { grade: "일반", tag: "화신 스킬", cd: "1분 30초", lv: 1, groggy: "상", armor: "피격이상 면역" },
  "소닉 임팩트": { grade: "일반", tag: "제로 싱크 스킬", cd: "18초", lv: 1, mana: "제로 싱크 배터리 500 소모", part: "2", groggy: "상" },
  "퀀텀 어셈블리 빔": { grade: "일반", tag: "제로 싱크 스킬", cd: "45초", lv: 1, mana: "제로 싱크 배터리 500 소모", part: "1", groggy: "상", armor: "피격이상 면역" },
  "EX - 제로 포인트": { grade: "지점", tag: "제로 싱크 스킬", cd: "30초", lv: 1, mana: "제로 싱크 배터리 500 소모", groggy: "중상" },
  "크림슨 브레이커": { grade: "일반", tag: "하이퍼 싱크 스킬", cd: "20초", lv: 1, groggy: "중상" },
  "엑셀리온 빔": { grade: "일반", tag: "하이퍼 싱크 스킬", cd: "16초", lv: 1, groggy: "중" },
  "레이저 블레이드": { grade: "일반", tag: "하이퍼 싱크 스킬", cd: "10초", lv: 1, part: "1", groggy: "중" },
  "버스트 블로우": { grade: "일반", tag: "하이퍼 싱크 스킬", cd: "10초", lv: 1, part: "1", groggy: "중" }
};
// ===== 직업·각인별 추가 스킬 정보 (깨달음 스킬 / 아이덴티티 스킬 / 툴팁 보강) =====
// c: 직업, e: 각인 이름 정규식(없으면 직업 전체), need: 아크패시브 노드 설명 정규식(습득 시에만 표시), under: 이 이름 아래에 ㄴ 로 표시할 부모 스킬(정규식)
// over: true → 스킬창에 이미 있는 스킬이라도 이 툴팁으로 교체 (없는 스킬이면 새 줄로 추가). icon: 아이콘 주소를 직접 지정하고 싶을 때
// 설명 속 수치는 인벤 기준 고정값 (\n = 줄바꿈)
var EXTRA_SKILLS = [
  // ── 워로드 ──
  { n: "전장의 창", c: "워로드", e: /고독한\s*기사/, grade: "일반", cd: "28초", lv: 1, armor: "피격이상 면역",
    desc: "무기에 강력한 기운을 모아 강화시킨다. 이동기 스킬의 재사용 대기시간이 초기화된다. 이어서 6.0초 동안 자신의 최대 생명력의 30.0%에 해당하는 보호막을 획득하며, 실드 게이지가 2000 증가하고 진격 태세로 전환된다. 또한, 다음 사용하는 랜스 스킬의 피해량이 강화된다." },
  { n: "진격 태세", c: "워로드", e: /고독한\s*기사/, grade: "토글", cd: "2초", lv: 1, mana: "실드 게이지 50 소모", armor: "피격이상 면역",
    desc: "실드 게이지를 소모하여 진격 태세를 취한다. 진격 태세 중에는 적에게 공격을 받았을 때 실드 게이지를 대신 소모하며 피해를 받지 않는다. 이동속도가 10% 감소된다.\n진격 태세 중에는 시간이 지남에 따라 실드 게이지가 소모되고 실드 게이지가 모두 소모되면 진격 태세가 해제된다. 또한, 랜스 스킬 사용 중에도 Z키를 눌러 해제할 수 있다." },
  { n: "전장의 방패", c: "워로드", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/gl_skill/gl_skill_01_33.png", e: /전투\s*태세/, grade: "토글", cd: "1분 30초", lv: 1, mana: "실드 게이지 5000 소모", groggy: "중상", armor: "피격이상 면역, 상태이상 면역",
    desc: "실드 게이지를 소모하여 최대 16m까지 이동할 수 있으며, 이때 모험가 및 가디언 몬스터까지 충돌이 무시된다.\n착지하는 순간 반경 10m이내의 적들에게 20,042 피해를 주며 날려버리고, 피해 범위의 중심 3m 반경의 대상은 직격하여 내려찍는다.\n방어 태세가 해제되지만 자신의 최대 생명력의 100.0%의 보호막을 얻고, 10m 범위안에 있는 파티원들은 피격이상 면역이 되며, 피해를 최대 5초간 대신 막아줄 수 있다. 실드 게이지가 50% 미만일 때는 사용할 수 없다." },
  { n: "방어 태세", c: "워로드", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/gl_skill/gl_skill_01_31.png", e: /전투\s*태세/, grade: "토글", cd: "2초", lv: 1, mana: "실드 게이지 50 소모", armor: "피격이상 면역",
    desc: "실드 게이지를 소모하여 방어 태세를 취한다. 방어 태세 중에는 적에게 공격을 받았을 때 실드 게이지를 대신 소모하며 피해를 받지 않는다. 하지만 굳건한 방어 태세로 인하여 이동속도가 50% 감소된다.\n방어 태세 중에는 시간이 지남에 따라 실드 게이지가 소모되고 실드 게이지가 모두 소모되면 방어 태세가 해제된다. 또한, 스킬 사용 중에도 Z키를 눌러 해제할 수 있다." },
  // ── 디스트로이어 ──
  { n: "볼텍스 그라비티", c: "디스트로이어", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/dt_skill/dt_skill_01_20.png", e: /중력\s*수련/, grade: "일반", cd: "20초", lv: 1, groggy: "상", attack: "헤드 어택", counter: "가능",
    desc: "해머로 내려치며 3,053의 피해를 주고, 전방으로 중력을 폭발시켜 2,038의 피해를 주며 6m 이내의 적들을 끌어 당긴다. 해머로 내려치는 공격은 카운터 공격이 가능하다. 공격 적중 시 대상에게 6.0초간 '갑옷 파괴' 효과가 부여된다.\n\n갑옷 파괴 : 물리 방어력이 12.0% 감소하고, 마법 방어력이 12.0% 감소한다." },
  // ── 발키리 ──
  { n: "종언의 빛", c: "발키리", e: /빛의\s*기사/, grade: "일반", cd: "0초", lv: 1, mana: "빛 게이지 10000 소모", part: "2", groggy: "상", armor: "피격이상 면역",
    desc: "검을 높이 들어 신성력을 극한까지 응축한 뒤, 전방으로 강하게 휘둘러 거대한 신성 검기를 방출한다. 빛을 품은 검기는 직선 방향의 넓은 범위를 가르며 적들을 꿰뚫고, 폭발적인 충격으로 43,440의 피해를 주며 적들을 날려버린다." },
  // ── 홀리나이트 ──
  { n: "신의 집행자", c: "홀리나이트", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/hk_skill/hk_skill_01_20.png", e: /심판자/, grade: "일반", cd: "5초", lv: 1, armor: "피격이상 면역",
    desc: "신앙 게이지를 활용하여 검을 강화시켜 전투를 할 수 있는 신의 집행자 상태가 된다.\n신의 집행자 상태에서는 징벌 스킬로 주는 피해가 20% 증가한다." },
  { n: "심판의 칼날", c: "홀리나이트", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/hk_skill/hk_skill_01_28.png", e: /심판자/, grade: "일반", tag: "징벌 스킬", cd: "20초", lv: 1, groggy: "중상", armor: "피격이상 면역",
    desc: "자세를 잡고 신성의 힘을 극한으로 응축시켜 천벌을 형상화한다. 이후 제어할 수 없을 정도의 신성력이 담긴 검을 전방을 향해 크게 베며 12,677 피해를 주며 적을 날려버린다.\n신의 집행자 및 징벌 스킬 사용 직후 스킬 입력 시 준비 동작 없이 즉시 공격한다." },
  { n: "신성의 오라", c: "홀리나이트", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/hk_skill/hk_skill_01_21.png", e: /축복의\s*오라/, grade: "일반", cd: "2초", lv: 1, armor: "피격이상 면역, 상태이상 면역",
    desc: "신앙 게이지를 활용하여 자신을 중심으로 24m까지 영향을 미치는 신성한 오라를 내 뿜는다.\n신성의 오라 효과를 받는 자신 및 파티원은 적에게 주는 피해가 10% 증가한다." },
  { n: "신성 파도", c: "홀리나이트", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/hk_skill/hk_skill_01_29.png", e: /축복의\s*오라/, grade: "일반", tag: "신성 스킬", cd: "36초", lv: 1, groggy: "하", armor: "피격이상 면역",
    desc: "성스러운 힘을 검에 담아 맹세한다. 검을 중심으로 신성한 힘이 폭발하듯 퍼져나가 적에게 3,243의 피해를 주며 날려버린다. 신성의 힘이 폭발하는 순간 자신 및 24m이내의 파티원에게 6초 간 자신의 최대 생명력 20%에 해당하는 보호막을 부여한다." },
  // ── 기공사 무상신공 ──
  { n: "무상신각", c: "기공사", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/so_skill/so_skill_01_35.png", e: /무상신공/, grade: "일반", tag: "무상신공", cd: "3초", lv: 1, groggy: "중상", armor: "피격이상 면역",
    desc: "진기를 발끝에 모아 강하게 진각을 밟는다. 강력한 진공파가 퍼져나가며 53,036의 피해를 준다." },
  { n: "무상신장", c: "기공사", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/so_skill/so_skill_01_36.png", e: /무상신공/, grade: "일반", tag: "무상신공", cd: "3초", lv: 1, groggy: "상", armor: "피격이상 면역",
    desc: "양손에 진원 진기를 끌어모아 전방을 향해 한순간에 발산하여 56,345의 피해를 주고 대상을 넘어뜨린다." },
  { n: "무상신권", c: "기공사", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/so_skill/so_skill_01_37.png", e: /무상신공/, grade: "일반", tag: "무상신공", cd: "3초", lv: 1, mana: "진기 30000 소모", groggy: "최상", armor: "피격이상 면역",
    desc: "지고한 수준의 강기를 주먹에 모아 전방으로 발사한다. 적중 시 11,828의 피해를 주고, 강력한 권경이 순식간에 터지며 47,316의 피해를 주며 대상을 넘어뜨린다." },
  // ── 브레이커 권왕파천무 ──
  { n: "권왕십이식 : 낙화", c: "브레이커", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/ifm_skill/ifm_skill_01_26.png", e: /권왕파천무/, grade: "차지", tag: "충격 스킬", cd: "40초", lv: 1, groggy: "최상", armor: "피격이상 면역",
    desc: "지점을 향해 점프하며 최고 높이에서 포스 건틀릿을 생성한 후 지면으로 내려 찍으며 1,584의 피해를 주며 적을 띄운 뒤, 지면에서 폭발이 발생해 2,381의 피해를 주고 날려버린다. 최대 14m 이동 가능하다. 최대 3단계까지 차지할 수 있으며, 1단계 차지할 때마다 충격 에너지 33을 획득한다. 보유한 충격 에너지 1당 적에게 주는 피해가 4% 증가한다." },
  { n: "권왕십이식 : 풍랑", c: "브레이커", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_ifm/ark_passive_ifm_8.png", e: /권왕파천무/, grade: "차지", tag: "충격 스킬", cd: "40초", lv: 1, groggy: "상", armor: "피격이상 면역",
    desc: "포스 건틀릿을 생성하여 전방을 향해 정권 공격을 하며 471의 피해를 준 뒤, 포스 건틀릿에 에너지를 쏟아부어 폭발시켜 1,416의 피해를 준다. 보유한 충격 에너지 1당 적에게 주는 피해가 4% 증가한다." },
  // ── 데빌헌터 / 블래스터 / 호크아이 ──
  { n: "비밀 병기", c: "데빌헌터", e: /핸드\s*거너/, grade: "일반", tag: "핸드건 스탠스", cd: "40초", lv: 1, groggy: "중", armor: "피격이상 면역",
    desc: "비밀 병기를 꺼내 전방을 향해 5,774, 5,774의 피해를 주고 적을 날려버린다." },
  { n: "포격 : 절대 영역", c: "블래스터", e: /포격\s*강화/, grade: "일반", tag: "포격 모드", cd: "30초", lv: 1,
    desc: "6초간 최대 생명력의 40%까지 피해를 흡수하는 보호막을 생성하며 받는 피해가 50% 감소한다. 또한, 특정 보스 등급 이상에게 피격 시 발생하는 페널티 게이지가 50% 감소한다. 포격 모드 해제 시 보호막 및 받는 피해 감소와 페널티 게이지 감소 효과는 해제된다." },
  { n: "폭풍의 날개", c: "호크아이", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/he_skill/he_skill_01_20.png", grade: "지점", tag: "실버호크", cd: "9초", lv: 1, groggy: "하",
    desc: "마우스 지점에 실버호크가 빠르게 회전하여 최대 2,800의 피해를 준다." },
  { n: "최후의 습격", c: "호크아이", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/he_skill/he_skill_01_21.png", grade: "일반", tag: "실버호크", cd: "0초", lv: 1, groggy: "중상", armor: "피격이상 면역",
    desc: "마우스 방향으로 실버호크를 날려보내 폭발 시켜, 7,682피해를 주고, 소환 해제가 된다." },
  { n: "실버호크 강습", c: "호크아이", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_he/ark_passive_he_4.png", e: /죽음의\s*습격/, grade: "일반", tag: "실버호크", cd: "0초", lv: 1, mana: "호크게이지 1000 소모", groggy: "중상",
    desc: "다른 스킬 사용 중 사용할 수 있으며, 스킬 사용 시 호크 게이지를 모두 소모한다. 실버호크를 소환하지 않고 즉시 마우스 방향으로 날려보내며, 9,302의 피해를 주고 적을 날려버린다." },
  { n: "실버호크 소환", c: "호크아이", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/he_skill/he_skill_01_19.png", e: /두\s*번째\s*동료/, grade: "일반", tag: "일반 스킬", cd: "0초", lv: 1, mana: "호크게이지 1000 소모",
    desc: "주기적으로 주위의 적을 공격하는 실버호크를 소환한다. 실버호크 소환 중 강력한 특수 스킬을 사용할 수 있고, 자신 및 24m 범위 내에 있는 파티원의 이동 속도가 4% 증가한다." },
  // ── 아르카나 ──
  { n: "황제", c: "아르카나", e: /황제/, grade: "", cd: "0초", lv: 1, groggy: "중",
    desc: "14m 범위내의 적에게 7,850의 피해를 준다." },
  // ── 소서리스 ──
  { n: "마력 방출", c: "소서리스", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/scs_skill/scs_skill_01_19.png", grade: "일반", tag: "일반 스킬", cd: "2초", lv: 1, armor: "피격이상 면역",
    desc: "신비한 마력이 30% 이상일 때 사용할 수 있으며, 사용한 시점부터 신비한 마력 게이지가 감소한다. 마력을 내뿜어 주변의 적에게 294의 피해를 입히고, 마력 강화 상태가 되며, 만약 신비한 마력이 100%일 때 사용하면 더 강력한 마력 해방 상태가 된다." },
  { n: "점멸", c: "소서리스", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/scs_skill/scs_skill_01_20.png", grade: "지점", tag: "일반 스킬", cd: "1초", lv: 1, mana: "신비한 마력 3000 소모", armor: "피격이상 면역, 상태이상 면역",
    desc: "신비한 마력이 30% 이상일 때 사용할 수 있다.\n마우스 지점으로 순간 이동하며 최대 15m까지 이동이 가능하고, 순간 이동 중일 때 모험가 및 가디언 몬스터까지 충돌이 무시된다." },
  // ── 바드 절실한 구원 ──
  { n: "용맹의 세레나데", c: "바드", under: /세레나데\s*스킬/, icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/bd_skill/bd_skill_01_19.png", e: /절실한\s*구원/, grade: "일반", tag: "세레나데", cd: "2초", lv: 1, mana: "버블 1개 소모", armor: "피격이상 면역, 상태이상 면역",
    desc: "충전된 버블을 소모해 소모된 버블에 따라 8초, 12초, 16초간 24m 범위 내에 있는 자신과 파티원이 적에게 주는 피해량을 5%, 10%, 15% 증가시킨다." },
  { n: "구원의 세레나데", c: "바드", under: /세레나데\s*스킬/, icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/bd_skill/bd_skill_01_15.png", e: /절실한\s*구원/, grade: "지점", tag: "세레나데", cd: "1초", lv: 1, mana: "버블 1개 소모", armor: "피격이상 면역, 상태이상 면역",
    desc: "충전된 버블을 소모해 소모된 버블에 따라 자신 및 파티원의 생명력을 최대 14초, 18초, 24초 동안 자신의 최대 생명력의 4%씩 8회, 6%씩 12회, 8%씩 16회 회복시킨다." },
  { n: "메이저 코드", c: "바드", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/bd_skill/bd_skill_01_31.png", e: /절실한\s*구원/, grade: "일반", tag: "세레나데", cd: "0초", lv: 1,
    desc: "사용한 버블에 따라 8, 12, 16초간 자신 및 파티원에게 용맹의 세레나데 기본 효과에 비례하여 적에게 주는 피해량 증가 효과를 부여하고, 자신의 마나 자연 회복량이 8, 12, 16초간 25.0% 증가한다.\n1레벨 : 용맹의 세레나데 기본 효과의 10.0% 부여.\n2레벨 : 용맹의 세레나데 기본 효과의 15.0% 부여.\n3레벨 : 용맹의 세레나데 기본 효과의 20.0% 부여." },
  { n: "마이너 코드", c: "바드", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/bd_skill/bd_skill_01_32.png", e: /절실한\s*구원/, grade: "일반", tag: "세레나데", cd: "0초", lv: 1,
    desc: "직전 소모한 버블에 비례하여 세레나데 게이지를 환급하고, 사용한 버블에 따라 자신의 마나 자연 회복량이 8, 12, 16초간 25.0% 증가한다.\n1레벨 : 세레나데 게이지 5.0% 환급.\n2레벨 : 세레나데 게이지 10.0% 환급.\n3레벨 : 세레나데 게이지 15.0% 환급." },
  // ── 데모닉 ──
  { n: "블러드 제노사이드", c: "데모닉", e: /충동/, grade: "일반", tag: "악마 스킬", cd: "1초", lv: 1, groggy: "중상", armor: "피격이상 면역",
    desc: "혈기 에너지를 극한으로 끌어모아 블러드 데모닉 웨폰을 구현한다. 이후 전방을 향해 블러드 데모닉 웨폰을 강하게 베어 13,684의 피해를 주고 적들을 날려버린다." },
  { n: "스톰 그라인딩", c: "데모닉", e: /완벽한\s*억제/, grade: "일반", tag: "일반 스킬", cd: "36초", lv: 1, groggy: "중", armor: "피격이상 면역",
    desc: "전방으로 잠식 에너지를 주입한 무기를 던져 2,393의 피해를 준다. 공격이 적중한 지점에서 회전하며 총 60,299의 피해를 주고 기운이 모인 뒤 폭발하여 11,954의 피해를 주고 적을 날려버린다." },
  // ── 리퍼 / 소울이터 ──
  { n: "페이탈 스텝", c: "리퍼", e: /갈증/, need: /살인귀/, under: /살인귀/, grade: "지점", cd: "40초", lv: 1, attack: "백 어택", armor: "피격이상 면역",
    desc: "혼돈 상태일 때 사용할 수 있으며, 전방으로 9m 날아올라 적을 베어버리며 2,058의 피해를 준다. 이동 중 모험가 및 가디언 몬스터까지 충돌이 무시된다." },
  { n: "영혼 참수", c: "소울이터", e: /그믐/, grade: "일반", tag: "살귀 스킬", cd: "5초", lv: 1, part: "1", groggy: "중상", armor: "피격이상 면역",
    desc: "전방으로 빠르게 이동한 후 사방에서 난무 공격을 펼치며 적에게 최대 4,012의 피해를 준 뒤, 공간을 갈라버린 후 4,012의 피해를 입힌 뒤 공간이 부서지며 적에게 12,032의 피해를 주고 날려버린다." },
  // ── 차원술사 ──
  { n: "시간선 분화", c: "차원술사", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_di/ark_passive_di_5.png", e: /시간\s*관리자/, under: /시간선/, grade: "일반", tag: "결합 스킬", cd: "0초", lv: 1, armor: "피격이상 면역, 상태이상 면역",
    desc: "기존 시간선에 자신의 환영을 두고 분리된 시간선으로 진입하며 적에게 2,455의 피해를 주고, 적중된 적의 모든 방어력을 15.0초간 12.0% 감소시킨다." },
  { n: "시간선 붕괴", c: "차원술사", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_di/ark_passive_di_6.png", e: /시간\s*관리자/, under: /시간선/, grade: "일반", tag: "결합 스킬", cd: "0초", lv: 1, groggy: "중", armor: "피격이상 면역, 상태이상 면역",
    desc: "왼손을 들고 휘둘러 분리된 시간선을 붕괴시키며 16.0m 이내의 적에게 23,185의 피해를 주고 적을 날려버린 후 즉시 기존 시간선에 두었던 24.0m 이내의 환영 위치로 돌아간다.\n기존 시간선으로 돌아오면 2.0초 동안 받는 피해가 50.0% 감소하고 피격이상에 면역된다." },
  { n: "간섭", c: "차원술사", e: /공간\s*검사/, over: true, grade: "일반", tag: "분침 스킬", cd: "1초 / 충전 시간 15초", cdSec: 1, lv: 1, groggy: "하", attack: "백 어택", armor: "피격이상 면역",
    desc: "전방으로 분침을 찔러 적에게 2,382의 피해를 주고 적중된 위치에 차원 균열을 생성한다. 적중된 적의 모든 방어력을 8.0초간 12.0% 감소시킨다." },
  // ── 환수사 ──
  { n: "환수 각성", c: "환수사", e: /환수\s*각성/, over: true, grade: "일반", cd: "1초", lv: 1, armor: "피격이상 면역, 상태이상 면역",
    desc: "환수의 기운이 100% 일 때 Z키 입력 시 환수 각성 상태가 되며, X키 입력 시 환수 각성 상태를 해제할 수 있다.\n환수 각성 상태에서는 스킬을 통해 환수의 기운을 회복할 수 없으며 환수의 기운이 지속적으로 소모되지만, 공격속도와 이동속도가 20.0% 증가한다. 또한, 환수 각성 상태에서는 둔갑 스킬 및 지진 방아, 꿀밤 강타를 사용할 수 없다." },
  { n: "금술 : 찢 곰", c: "환수사", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/dr_skill/dr_skill_01_25.png", e: /야성/, under: /둔갑\s*금술/, grade: "일반", tag: "둔갑 스킬", cd: "2초", lv: 1, mana: "곰의 기운 10000 소모", groggy: "최상", armor: "피격이상 면역",
    desc: "전방을 향해 나아가며 2회 할퀴어 각각 7,233, 7,233의 피해를 주고 양 발을 교차하며 마무리 일격을 가하여 21,702의 피해를 주고 날려버린다." },
  { n: "금술 : 여우 별 소나기", c: "환수사", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/dr_skill/dr_skill_01_26.png", e: /야성/, under: /둔갑\s*금술/, grade: "일반", tag: "둔갑 스킬", cd: "2초", lv: 1, mana: "여우의 기운 10000 소모", groggy: "중상", armor: "피격이상 면역",
    desc: "강력한 기운을 가진 여우불을 5개 소환한다. 여우불은 전방으로 날아가며 경로에 있는 적을 추적하고 충돌한 대상에게 각각 6,352의 피해를 준다." },
  // ── 도화가 ──
  { n: "저무는 달", c: "도화가", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/yy_skill/yy_skill_01_3.png", e: /만개/, under: /음양/, grade: "일반", tag: "음양 스킬", cd: "2초", lv: 1, mana: "조화의 구슬 2 소모", armor: "피격이상 면역, 상태이상 면역",
    desc: "필법의 힘을 모아 크게 바닥에 붓을 내리쳐 자신과 주변 24m이내의 파티원에게 10초간 적에게 주는 피해량을 10% 증가시킨다." },
  { n: "떠오르는 해", c: "도화가", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_yy/ark_passive_yy_1.png", e: /만개/, under: /음양/, grade: "일반", tag: "음양 스킬", cd: "1초", lv: 1, mana: "조화의 구슬 1 소모", armor: "피격이상 면역, 상태이상 면역",
    desc: "해의 기운을 모아 24.0m 범위 내 자신 및 파티원 중 생명력 비율이 가장 낮은 1명에게 자신의 최대 생명력의 25%에 해당하는 생명력을 회복시킨다." },
  { n: "떠오르는 달", c: "도화가", need: /2\s*티어\s*떠오르는\s*달/, hide: true, over: true, grade: "지점", tag: "음양 스킬", cd: "30초", lv: 1, groggy: "중", armor: "피격이상 면역",
    desc: "10m 이내 마우스 위치에 묵법의 힘을 모아 정신을 집중하여 달 구슬을 소환 즉시 폭발시켜 주변 7m 범위 내 적에게 10,557의 피해를 주며 넘어뜨린다." }
];
// 현재 캐릭터(직업·각인·아크패시브 노드)에 해당하는 추가 스킬만 추려 이름 → 정보 표를 만들어 둔다
function xsActive(wantHidden) {
  var cls = window.__charClass || "", fd = window.__fullData || {};
  var ap = fd.ArkPassive || {};
  // 직업 각인(직각)은 아크패시브 Title (예: "멈출 수 없는 충동", "시간 관리자")
  var engTxt = strip(String(ap.Title || "")).trim();
  if (!engTxt) {
    var eg = fd.ArmoryEngraving || {}, engNames = [];
    [eg.ArkPassiveEffects, eg.Effects, eg.Engravings].forEach(function (a) { (a || []).forEach(function (x) { if (x && x.Name) engNames.push(String(x.Name)); }); });
    engTxt = engNames.join("|");
  }
  var apTxt = strip(JSON.stringify((ap.Effects || []).map(function (e) { return (e.Name || "") + " " + (e.Description || ""); })));
  var out = [];
  EXTRA_SKILLS.forEach(function (x) {
    if (x.c !== cls) return;
    if (x.e && !x.e.test(engTxt)) return;
    var needOk = !x.need || x.need.test(apTxt);
    if (wantHidden) { if (x.hide && !needOk) out.push(x); return; }   // hide: 노드 미습득이면 스킬창에서 숨길 스킬
    if (!needOk) return;
    out.push(x);
  });
  return out;
}

// 아크패시브 노드 툴팁에 설명이 아예 없는 경우 보여줄 설명 (노드 이름 → 설명). 직접 채워 넣으세요. 예: "선봉장의 함성": "…"
var ARK_NODE_DESC = {};
function arkNodeFallbackDesc(name) {
  var k = String(name || "").replace(/\s+/g, "");
  for (var key in ARK_NODE_DESC) if (key.replace(/\s+/g, "") === k) return String(ARK_NODE_DESC[key]).replace(/\n/g, "<br>");
  return "";
}
// 아이덴티티·추가 스킬 정보 찾기 (아이덴티티 표 → 현재 캐릭터의 추가 스킬 표)
function rawIdInfo(name) {
  var n = gkNorm(name);
  for (var k in IDENTITY_SKILL_INFO) if (gkNorm(k) === n) return IDENTITY_SKILL_INFO[k];
  return (window.__xsMap && window.__xsMap[n]) || null;
}
// 아이덴티티 줄: 기본 재사용시간에 신속 / 보석 / 진화 재감을 적용 (일반 스킬 줄과 같은 규칙)
function identityInfoOf(name) {
  var n = gkNorm(name), r = gkDreadSkillOf(name);
  if (r) return r;
  return rawIdInfo(name);
}
function identityEffCd(name) {
  var info = identityInfoOf(name);
  var base = info ? (info.cdSec || parseCdSeconds(info.cd)) : 0;
  if (!base) return null;
  var cp = cdParams({ Name: name });
  var eff = base * (1 - cp.swift / 100) * (1 - cp.gem / 100) * cp.all;
  return { base: base, eff: eff, changed: Math.abs(eff - base) > 0.005 };
}
function identityCdBadge(s) {
  var c = identityEffCd(s.Name);
  return c ? `<div class="sk-cd">${c.eff.toFixed(2)}초</div>` : "";
}
function identityCdLine(s, text) {
  var c = identityEffCd(s.Name);
  if (!c || !c.changed) return `<div class="tip-line">재사용 대기시간 ${text}</div>`;
  var rest = /\/.+$/.exec(text);   // "1초 / 충전 시간 1분" 처럼 뒤에 붙은 설명은 유지
  return `<div class="tip-line">재사용 대기시간 <s class="tip-cd-old">${c.base}초</s> <span class="tip-cd-new">${c.eff.toFixed(2)}초</span>${rest ? " " + rest[0] : ""}</div>`;
}
// 아이덴티티 줄의 속성 칩 (인벤 기준 고정 정보: 헤드 어택 / 무력화 / 슈퍼아머)
function identityChipsHtml(s) {
  var dk = gkDreadSkillOf(s.Name), info = rawIdInfo(s.Name);
  var src = dk || info;
  return src ? attrChipsHtml({ counter: src.counter, attack: src.attack, part: src.part ? "Lv." + src.part : "", groggy: src.groggy, armor: src.armor }) : "";
}
function identityTipHtml(s) {
  var dk = gkDreadSkillOf(s.Name);
  if (dk) return gkSkillTipHtml(dk, s.Icon, s);
  var info = rawIdInfo(s.Name) || {};
  var icon = s.Icon ? `<img class="tip-skill-icon" src="${s.Icon}" alt="">` : "";
  var lines = [];
  if (info.part) lines.push(`부위 파괴 : 레벨 ${info.part}`);
  if (info.groggy) lines.push(`무력화 : ${info.groggy}`);
  if (info.attack) lines.push(`공격 타입 : ${info.attack}`);
  if (info.counter) lines.push(`카운터 : ${info.counter}`);
  if (info.armor) lines.push(`슈퍼아머 : ${info.armor}`);
  var infoHtml = lines.length ? `<div class="tip-info"><div class="tip-info-line">${lines.map(l => `<FONT COLOR='#EEA839'>${l}</FONT>`).join("<br>")}</div></div>` : "";
  var desc = skillDescOf(s.Name);
  return `
    <div class="tip-hd tip-hd-skill">
      ${icon}
      <div class="tip-hd-text"><div class="tip-hd-name">${s.Name}${info.tag ? ` <span class="tip-tag">[${info.tag}]</span>` : ""}</div>
      ${info.grade === "" ? "" : `<div class="tip-muted">${info.grade || "아이덴티티 스킬"}</div>`}</div>
    </div>
    <div class="tip-bd" style="padding-bottom:6px;">
      ${info.cd ? identityCdLine(s, info.cd) : ""}
      ${info.lv ? `<div class="tip-line muted">스킬 레벨 ${info.lv}</div>` : ""}
    </div>
    ${info.mana ? `<div class="tip-bd" style="padding-top:2px;padding-bottom:2px;font-size:11px;color:#c7cee0;">${info.mana}</div>` : ""}
    ${desc ? `<div class="tip-bd" style="padding-top:8px;padding-bottom:6px;font-size:11px;line-height:1.5;color:#c7cee0;">${desc}</div>` : ""}
    ${infoHtml}`;
}

// 드레드 로어로 얻는 아이덴티티 스킬 (인벤 기준 고정 정보). icon: 스킬 아이콘 주소를 직접 넣고 싶으면 "https://..." 입력 (없으면 보석/스킬 목록에서 자동 탐색)
var GK_DREAD_SKILLS = [
  { name: "가디언 피어", grade: "일반", tag: "일반 스킬", cd: "1초", cdSec: 1, mana: "엠버레스 오브 게이지 5000 소모", lv: 1, attack: "헤드 어택", armor: "피격이상 면역", icon: "" },
  { name: "가디언 스케일", grade: "일반", tag: "일반 스킬", cd: "1초 / 충전 시간 1분", cdSec: 1, mana: "", lv: 1, attack: "", armor: "", icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/ddk_skill/ddk_skill_01_27.png" }
];

function gkDreadSkillOf(name) {
  var n = gkNorm(name);
  return GK_DREAD_SKILLS.find(function (k) { return gkNorm(k.name) === n; }) || null;
}
function gkSkillTipHtml(k, iconSrc, sk) {
  var ic = iconSrc || k.icon || "";
  var lines = [];
  if (k.attack) lines.push("공격 타입 : " + k.attack);
  if (k.armor) lines.push("슈퍼아머 : " + k.armor);
  var desc = skillDescOf(k.name);
  return `<div class="tip-hd tip-hd-skill">
      ${ic ? `<img class="tip-skill-icon" src="${ic}" alt="">` : ""}
      <div class="tip-hd-text"><div class="tip-hd-name">${k.name}${k.tag ? ` <span class="tip-tag">[${k.tag}]</span>` : ""}</div>
      <div class="tip-muted">${k.grade}</div></div>
    </div>
    <div class="tip-bd" style="padding-bottom:6px;">
      ${identityCdLine(sk || { Name: k.name }, k.cd)}
      <div class="tip-line muted">스킬 레벨 ${k.lv}</div>
    </div>
    ${k.mana ? `<div class="tip-bd" style="padding-top:2px;padding-bottom:2px;font-size:11px;color:#c7cee0;">${k.mana}</div>` : ""}
    ${desc ? `<div class="tip-bd" style="padding-top:6px;padding-bottom:6px;font-size:11px;line-height:1.5;color:#c7cee0;">${desc}</div>` : ""}
    ${lines.length ? `<div class="tip-info"><div class="tip-info-line">${lines.map(l => `<FONT COLOR='#EEA839'>${l}</FONT>`).join("<br>")}</div></div>` : ""}`;
}

// 스킬 종류 표시 (우산 스킬 / 포격 스킬 / 루인 스킬 / 악마 스킬 / 징벌 스킬 …): 일반 스킬은 표시하지 않음
function skillTypeText(s) {
  var raw = "";
  if (s._identity || s._extra) { var inf = rawIdInfo(s.Name); raw = inf && inf.tag ? inf.tag : ""; }
  if (!raw && s.Tooltip) {
    var tip = parseTip(s.Tooltip);
    if (tip) for (var k of Object.keys(tip)) {
      var v = tip[k];
      if (v && v.type === "CommonSkillTitle" && v.value) { raw = strip(v.value.level || ""); break; }
    }
  }
  var m = String(raw).match(/\[([^\]]+)\]/), t = (m ? m[1] : String(raw)).trim();
  if (!t) return "";
  if (!m && !/스킬|모드|스탠스|세레나데|무상신공|실버호크/.test(t)) return "";   // 대괄호 없는 건 종류 말이 아닐 때가 많아 제외
  if (/^일반\s*스킬?$/.test(t)) return "";
  return t;
}
function skillTypeHtml(t) { return t ? `<span class="sk-type">${t}</span>` : ""; }

function renderSkills(skillsData, gemData) {
  var listEl = $("skillList"), sumEl = $("skillSummary");
  if (!listEl) return;

  var gemMap = buildSkillGemMap(gemData);
  var xsList = xsActive();
  window.__xsMap = {};
  xsList.forEach(function (x) { window.__xsMap[gkNorm(x.n)] = x; });
  var gkHide = gkHiddenNames();
  if (gkHide) skillsData = (skillsData || []).filter(function (s) { return !gkHide[gkNorm(s.Name)]; });
  // 초각성(SkillType 1)과 각성기(아크패시브 파생, SkillType 100 이상)는 레벨 1이어도 하단 별도 구역에 표시
  var isSpecialSkill = s => s.SkillType === 1 || (s.SkillType || 0) >= 100
    || ((s.SkillType || 0) >= 2 && (s.Level || 0) <= 1);
  var normalSkills = sortSkillsForDisplay(
    (skillsData || []).filter(s => (s.Level || 0) > 1 && !isSpecialSkill(s)),
    gemMap
  );
  var specialSkills = (skillsData || []).filter(isSpecialSkill);
  var hasGem = n => { var g = gemMap[n] || {}; return !!(g.dmg || g.cool); };
  // 레벨 1이라도 보석이 장착된 스킬은 표시 (일반 스킬 아래)
  var lv1GemSkills = sortSkillsForDisplay(
    (skillsData || []).filter(s => (s.Level || 0) <= 1 && !isSpecialSkill(s) && hasGem(s.Name)),
    gemMap
  );
  // 아이덴티티 스킬: 스킬 데이터에는 없지만 보석이 장착된 스킬 (그 아래)
  var allSkillNames = new Set((skillsData || []).map(x => x.Name));
  var normK = x => String(x || "").replace(/\s+/g, "");
  var arkNameSet = new Set(arkSkillNodes().map(n => normK(n.name)));   // 아크패시브 스킬 카드에 보석을 합쳐 보여줄 스킬
  var identitySkills = Object.keys(gemMap).filter(n => n && !allSkillNames.has(n) && !arkNameSet.has(normK(n)) && !(gkHide && gkHide[gkNorm(n)]))
    .map(n => ({ Name: n, Icon: gemSkillIcon(gemData, n, skillsData), Level: null, Tripods: [], _identity: true }));
  if (gkHide) {   // 드레드 로어: 가디언 피어 → 가디언 스케일 순서로 항상 표시 (보석이 있으면 함께)
    var dN = GK_DREAD_SKILLS.map(function (k) { return gkNorm(k.name); });
    var at = identitySkills.findIndex(function (x) { return gkNorm(x.Name) === dN[0]; });
    var others = identitySkills.filter(function (x) { return dN.indexOf(gkNorm(x.Name)) < 0; });
    var dRows = GK_DREAD_SKILLS.filter(function (k) { return !allSkillNames.has(k.name); }).map(function (k) {
      return identitySkills.find(function (x) { return gkNorm(x.Name) === gkNorm(k.name); })
        || { Name: k.name, Icon: k.icon || gemSkillIcon(gemData, k.name, skillsData), Level: null, Tripods: [], _identity: true };
    });
    var cut = at < 0 ? 0 : Math.min(at, others.length);
    identitySkills = others.slice(0, cut).concat(dRows, others.slice(cut));
  }
  var gk = gkArrange(normalSkills.concat(lv1GemSkills));
  var skills = gk.list.concat(identitySkills);
  var xsHide = {};
  xsActive(true).forEach(function (x) { xsHide[gkNorm(x.n)] = 1; });
  if (Object.keys(xsHide).length) skills = skills.filter(function (x) { return !xsHide[gkNorm(x.Name)]; });
  // 추가 스킬: 스킬창에 없거나(레벨 1 · 보석 없음) 아이덴티티 목록에 없는 스킬을 줄로 추가 (under 지정 시 부모 스킬 아래 ㄴ 표시)
  var ICON_FIX = { "음양스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_yy/ark_passive_yy_18.png" };   // 아이콘 교체 (이름 공백 없이)
  skills.forEach(function (x) { var u = ICON_FIX[gkNorm(x.Name)]; if (u) x.Icon = u; });
  var shownN = new Set(skills.map(function (x) { return gkNorm(x.Name); }));
  var xsOver = {};
  xsList.forEach(function (x) {
    var nn = gkNorm(x.n);
    xsOver[nn] = 1;   // 표에 있는 스킬은 이미 목록에 있어도 정리한 툴팁으로 교체
    if (shownN.has(nn) || arkNameSet.has(nn)) return;
    var src = (skillsData || []).find(function (q) { return gkNorm(q.Name) === nn; });
    var row = { Name: x.n, Icon: x.icon || (src && src.Icon) || gemSkillIcon(gemData, x.n, skillsData), Level: null, Tripods: [], _identity: true, _extra: true };
    var pi = -1;
    if (x.under) {
      for (var qi = 0; qi < skills.length; qi++) if (x.under.test(skills[qi].Name || "") && !skills[qi]._sub) { pi = qi; break; }
    }
    if (pi >= 0) {
      row._sub = true;
      var at2 = pi + 1;
      while (at2 < skills.length && skills[at2]._sub) at2++;
      skills.splice(at2, 0, row);
    } else skills.push(row);
    shownN.add(nn);
  });
  var linkTop = new Set();   // 계열 보석이 기본·변신 스킬 둘 다에 걸린 경우 → 연결 표시
  gk.list.forEach(function (s, i) {
    if (!gk.subs.has(s)) return;
    var g = gemMap[s.Name] || {};
    if ((g.famDmg || g.famCool) && i > 0) linkTop.add(gk.list[i - 1]);
  });

  if (sumEl) {
    var cnt = 0, gro = 0, brk = 0, stiff = 0, hitImm = 0, statusImm = 0;
    for (var s of normalSkills) {
      var f = skillTraitFlags(s);
      if (f.counter) cnt++;
      if (f.groggy) gro++;
      if (f.brk) brk++;
      var ar = String((skillAttrs(s).armor) || "");
      if (/경직\s*면역/.test(ar)) stiff++;
      if (/피격\s*이상\s*면역/.test(ar)) hitImm++;
      if (/상태\s*이상\s*면역/.test(ar)) statusImm++;
    }
    var swift = window.__swiftCdPct || 0;
    var ark = window.__arkCdPct || { mana: 0, all: 1 };
    var arkAllPct = (1 - ark.all) * 100;
    var hasGemCool = false;
    for (var s of skills) {   // 레벨 1 · 아이덴티티 줄에 장착된 재감 보석도 포함
      if ((gemMap[s.Name] || {}).coolPct) { hasGemCool = true; break; }
    }
    var o = cdOpt();
    var tog = (key, cls, text) => `<span class="stag ${cls} tog ${o[key] ? "on" : "off"}" data-cd="${key}" title="클릭: ${o[key] ? "비적용으로 변경" : "적용으로 변경"}"><i class="chk"></i>${text}</span>`;
    var trait = (cls, label, n) => n > 0 ? `<span class="stag ${cls}">${label} <b>${n}</b></span>` : "";
    var row1 = [
      trait("gold", "카운터", cnt), trait("purple", "무력화", gro), trait("violet", "부위 파괴", brk),
      trait("slate", "경직 면역", stiff), trait("slate", "피격이상 면역", hitImm), trait("slate", "상태이상 면역", statusImm)
    ].join("");
    var tags = [
      swift ? tog("swift", "green", `신속재감 ${swift.toFixed(2)}%`) : "",
      hasGemCool ? tog("gem", "cyan", "보석 재감 적용") : "",
      ark.mana ? tog("mana", "cyan", `마나재감 ${ark.mana.toFixed(1)}%`) : "",
      arkAllPct > 0.001 ? tog("evo", "cyan", `진화재감 ${arkAllPct.toFixed(2)}%`) : ""
    ].join("");
    var codeBtn = `<button type="button" class="sum-code" title="게임 스킬 창에 붙여넣을 수 있는 스킬 코드를 복사합니다">스킬코드<small>복사</small></button>`;
    var pts = window.__skillPts || {};
    var ringBox = "";
    if (pts.total) {
      var used = Number(pts.used) || 0, tot = Number(pts.total) || 1;
      var R = 27, C = 2 * Math.PI * R, dash = Math.max(0, Math.min(1, used / tot)) * C;
      ringBox = `<div class="sum-ring" title="스킬 포인트 ${used} / ${tot}"><svg viewBox="0 0 70 70" width="66" height="66" aria-hidden="true">` +
        `<circle cx="35" cy="35" r="${R}" fill="none" stroke="rgba(255,255,255,.09)" stroke-width="7"/>` +
        `<circle cx="35" cy="35" r="${R}" fill="none" stroke="#7b8cff" stroke-width="7" stroke-linecap="round" stroke-dasharray="${dash.toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 35 35)"/></svg>` +
        `<div class="sum-ring-t"><b>${used}</b><span>/ ${tot}</span></div><div class="sum-ring-l">스킬 포인트</div></div>`;
    }
    sumEl.innerHTML = ringBox +
      `<div class="sum-bar sum-2row">` +
      (row1 ? `<div class="sum-r1"><span class="sum-sp">기본 효과</span>${row1}</div>` : "") +
      `<div class="sum-r2"><span class="sum-sp">재감 효과</span>${tags}</div></div>` +
      `<div class="sum-code-box">${codeBtn}</div>`;
    sumEl.onclick = async e => {
      var cb = e.target.closest(".sum-code");
      if (cb) {
        if (cb.disabled) return;
        var nm = ((window.__fullData || {}).ArmoryProfile || {}).CharacterName || "";
        if (!nm) return;
        var say = (t, ms) => { cb.textContent = t; if (ms) setTimeout(() => { cb.innerHTML = "스킬코드<small>복사</small>"; cb.disabled = false; }, ms); };
        cb.disabled = true; say("불러오는 중…");
        try {
          var rs = await fetch(`${window.PROXY}/character/${encodeURIComponent(nm)}/skillcode`);
          var js = await rs.json();
          if (!js.ok || !js.code) throw new Error(js.error || "fail");
          try { await navigator.clipboard.writeText(js.code); }
          catch (e2) { var ta = document.createElement("textarea"); ta.value = js.code; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
          say("복사됨 ✓", 1800);
        } catch (e3) { say("가져오지 못했습니다", 2500); }
        return;
      }
      var t = e.target.closest(".stag[data-cd]");
      if (!t) return;
      var oo = cdOpt(); oo[t.dataset.cd] = !oo[t.dataset.cd];
      renderSkills(skillsData, gemData);
    };
  }

  // 트라이포드 단계별 해금 레벨: 1단계 Lv.4 / 2단계 Lv.7 / 3단계 Lv.10
  var TP_UNLOCK_LV = [4, 7, 10];

  var spSec = buildSpecialSection(specialSkills, gemMap);
  listEl.innerHTML = spSec.hyperHtml + skills.map((s, si) => {
    var tiers = groupTripods(s.Tripods);
    var tpCells = s._identity ? '<div class="tp"></div><div class="tp"></div><div class="tp"></div>' : [0, 1, 2].map(i => {
      var g = tiers[i];
      if (!g) return `<div class="tp empty"><div class="tp-icon"></div><span class="tp-name">미습득</span></div>`;
      var locked = (s.Level || 0) < TP_UNLOCK_LV[g.tier];   // 스킬 레벨 부족 → 비활성
      if (g.none) {   // 스킬만 올리고 이 단계 트라이포드를 안 찍음
        return `<div class="tp none${locked ? " locked" : ""}" data-si="${si}" data-tier="${g.tier}">
          <div class="tp-icon"><span class="tp-num tier${g.tier}">${g.tier + 1}</span></div>
          <div class="tp-name">${locked ? "미해금" : "트포 미선택"}</div>
        </div>`;
      }
      var opIcon = g.selected.Icon ? `<img src="${g.selected.Icon}" alt="" loading="lazy">` : "";

      return `<div class="tp${locked ? " locked" : ""}" data-si="${si}" data-tier="${g.tier}">
        <div class="tp-icon">${opIcon}<span class="tp-num tier${g.tier}">${g.selected.Slot || (g.tier + 1)}</span></div>
        <div class="tp-name">${g.selected.Name || ""}</div>
      </div>`;
    }).join("");

    var gm = gemMap[s.Name] || {};
    var rune = s._identity ? '<div class="rune-wrap"></div>' : s.Rune
      ? `<div class="rune-wrap"><div class="rune-cell" data-si="${si}" style="background:${runeStyle(s.Rune.Grade).bg};border-color:${runeStyle(s.Rune.Grade).c}"><img src="${s.Rune.Icon || ""}" alt="" loading="lazy"></div><div class="rune-name" style="color:${runeStyle(s.Rune.Grade).c}">${s.Rune.Name || ""}</div></div>`
      : `<div class="rune-wrap"><div class="rune-cell empty">-</div></div>`;

    var isSub = gk.subs.has(s) || !!s._sub, hasLink = linkTop.has(s);
    return `
    <div class="row${isSub ? " sub" : ""}${hasLink ? " lnk-top" : ""}${isSub && (gm.famDmg || gm.famCool) ? " lnk-bot" : ""}">
      ${isSub ? '<span class="sub-mark" aria-hidden="true">ㄴ</span>' : ""}
      <div class="sk-main" data-si="${si}">
        <div class="sk-icon">${s.Icon ? `<img src="${s.Icon}" alt="" loading="lazy">` : ""}</div>
        <div class="sk-name-wrap">
          <div class="sk-lv">${s._identity ? "아이덴티티" : (s.Level ?? "-") + "레벨"}</div>
          <div class="sk-nm-col">${skillTypeHtml(skillTypeText(s))}<div class="sk-name">${s.Name || "-"}</div></div>
        </div>
        ${s._identity ? identityCdBadge(s) : effCdBadge(s)}
        ${s._identity ? identityChipsHtml(s) : attrChipsHtml(skillAttrs(s))}
      </div>
      <div class="tripods">${tpCells}</div>
      <div class="gems">
        <div class="gem op" data-si="${si}" data-gt="dmg">
          <div class="gem-circle${gm.dmg ? " g-" + gm.dmgGrade : " empty"}">${gm.dmgIcon ? `<img class="gem-icon" src="${gm.dmgIcon}" alt="">` : ""}</div>
          ${gm.dmg ? `<span class="gem-txt">${gm.dmg}겁</span>` : ""}
        </div>
        <div class="gem rd" data-si="${si}" data-gt="cool">
          <div class="gem-circle${gm.cool ? " g-" + gm.coolGrade : " empty"}">${gm.coolIcon ? `<img class="gem-icon" src="${gm.coolIcon}" alt="">` : ""}</div>
          ${gm.cool ? `<span class="gem-txt">${gm.cool}작</span>` : ""}
        </div>
      </div>
      ${rune}
    </div>`;
  }).join("") + spSec.arkHtml;

  listEl.insertAdjacentHTML("beforeend", spSec.html);
  listEl.querySelectorAll(".sp-it[data-sp]").forEach(el => {
    var spS = spSec.items[+el.dataset.sp];
    bindTip(el, (spS && xsOver[gkNorm(spS.Name)]) ? identityTipHtml(spS) : buildSkillTipHtml(spS));
  });
  listEl.querySelectorAll(".sp-it[data-ark]").forEach(el => {
    var n = spSec.arks[+el.dataset.ark];
    try { bindTip(el, arkSkillTipHtml(n)); } catch (e) { try { bindTip(el, buildTipHtml(n.eff.ToolTip, n.name)); } catch (e2) {} }
  });

  listEl.querySelectorAll(".gem[data-ag]").forEach(el => {
    var n = spSec.arks[+el.dataset.ag], gm = (n && n._gm) || {};
    var t = el.dataset.agt === "cool" ? gm.coolTip : gm.dmgTip;
    var nm = el.dataset.agt === "cool" ? gm.coolName : gm.dmgName;
    if (t) bindTip(el, buildTipHtml(t, strip(nm || "")));
  });

  listEl.querySelectorAll(".sk-main").forEach(el => {
    var s = skills[+el.dataset.si];
    if (!s) return;
    bindTip(el, (s._identity || xsOver[gkNorm(s.Name)] || ((s.Level || 0) <= 1 && identityInfoOf(s.Name))) ? identityTipHtml(s) : buildSkillTipHtml(s));   // 레벨 1 스킬은 API 툴팁이 빈약해 인벤 기준 정보 사용
  });

  listEl.querySelectorAll(".gems .gem[data-gt]").forEach(el => {
    var s = skills[+el.dataset.si];
    if (!s) return;
    var gm = gemMap[s.Name] || {};
    var t = el.dataset.gt === "cool" ? gm.coolTip : gm.dmgTip;
    var n = el.dataset.gt === "cool" ? gm.coolName : gm.dmgName;
    if (t) bindTip(el, buildTipHtml(t, strip(n)));
  });

  listEl.querySelectorAll(".tp[data-si]").forEach(el => {
    var s = skills[+el.dataset.si];
    if (!s) return;
    var g = groupTripods(s.Tripods).find(x => x.tier === +el.dataset.tier);
    if (!g) return;
    var opts = g.options.map(o => `
      <div class="tp-opt ${o.IsSelected ? "selected" : "dim"}">
        <span class="opt-ic"${o.Icon ? ` style="background-image:url('${o.Icon}')"` : ""}></span>
        <div class="opt-body">
          <div class="opt-name">${o.Name || ""}</div>
          <div class="opt-desc">${o.Tooltip || ""}</div>
        </div>
      </div>`).join("");
    var lockNote = (s.Level || 0) < TP_UNLOCK_LV[g.tier]
      ? ` <span style="color:#ff8a8a;font-weight:700">· 스킬 Lv.${TP_UNLOCK_LV[g.tier]} 필요 (비활성)</span>` : "";
    bindTip(el, `<div class="tip-hd">트라이포드 ${g.tier + 1}단계${lockNote}</div><div class="tip-bd">${opts}</div>`);
  });

  listEl.querySelectorAll(".rune-cell[data-si]").forEach(el => {
    var s = skills[+el.dataset.si];
    if (!s) return;
    if (s.Rune) bindTip(el, buildTipHtml(s.Rune.Tooltip, s.Rune.Name, s.Rune.Icon, runeStyle(s.Rune.Grade).c));
  });
}