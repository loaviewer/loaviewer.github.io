// ===== 스킬 탭 렌더링 (app-render-skill.js) =====

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

function formatCdBaseLabel(sec) {
  if (sec >= 60 && sec % 60 === 0) return (sec / 60) + "분";
  if (sec >= 60) {
    var m = Math.floor(sec / 60);
    var r = Math.round((sec - m * 60) * 100) / 100;
    return r ? `${m}분 ${r}초` : `${m}분`;
  }
  return sec + "초";
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
  var swift = window.__swiftCdPct || 0;
  var gem = window.__gemMap?.[s.Name]?.coolPct || 0;
  var ark = window.__arkCdPct || { mana: 0, all: 1 };
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
  var swift = window.__swiftCdPct || 0;
  var gem = window.__gemMap?.[s.Name]?.coolPct || 0;
  var ark = window.__arkCdPct || { mana: 0, all: 1 };
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
    var selected = options.find(o => o.IsSelected) || options[0];
    return { tier, options, selected };
  }).filter(Boolean);
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
// 아크패시브 도약 노드 설명에 이름이 나오는 초각스킬은 활성, 나머지는 비활성 (하나도 못 찾으면 전부 활성)
function splitHyperSkills(list) {
  if (!list.length) return { active: [], inactive: [] };
  var ap = window.__fullData && window.__fullData.ArkPassive;
  var effs = (ap && ap.Effects) || [];
  var leap = effs.filter(e => /도약/.test((e.Name || "") + " " + (e.Description || "")));
  var txt = JSON.stringify(leap.length ? leap : effs);
  var hit = list.filter(s => s.Name && txt.indexOf(s.Name) >= 0);
  if (!hit.length) return { active: list, inactive: [] };
  return { active: hit, inactive: list.filter(s => hit.indexOf(s) < 0) };
}
// 아크패시브 노드로 얻는 스킬 (스킬 데이터에는 없고 ArkPassive.Effects에만 있음). 필요하면 이름 추가

var ARK_SKILL_NODES = ["연가비기", "대지 가르기", "공간 가르기", "공간가르기", "눈부신 나날들", "사냥의 시간"];
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
  return {};
}
// 아크패시브 스킬 아이콘: 정보 표의 icon → 스킬 목록 → 보석 데이터 → 노드 아이콘 순서
function arkIconOf(n) {
  var info = arkInfoOf(n.name);
  if (info.icon) return info.icon;
  var fd = window.__fullData || {};
  var key = String(n.name || "").replace(/\s+/g, "");
  var sk = (fd.ArmorySkills || []).find(x => String(x.Name || "").replace(/\s+/g, "") === key);
  if (sk && sk.Icon) return sk.Icon;
  var g = gemSkillIcon(fd.ArmoryGem, n.name, fd.ArmorySkills);
  return g || (n.eff && n.eff.Icon) || "";
}
// 재사용 대기시간에 신속 / 아크패시브 재감 적용
function arkSkillEffCd(base) {
  var swift = window.__swiftCdPct || 0;
  var ark = window.__arkCdPct || { mana: 0, all: 1 };
  return base * (1 - swift / 100) * ark.all;
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
function buildSpecialSection(specials) {
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
  // 아크패시브 스킬 (연가비기 등)
  if (arks.length) {
    arkHtml = `<div class="sp-card ark"><div class="sp-grid${arks.length === 1 ? " one" : ""}">` + arks.map((n, i) => {
      var info = arkInfoOf(n.name);
      var chips = [info.partLv ? `부위 파괴 Lv.${info.partLv}` : "", info.groggy ? `무력화 ${info.groggy}` : "", info.attack || "", info.armor || ""].filter(Boolean)
        .map(c => `<span class="sp-chip">${c}</span>`).join("");
      var cdTxt = info.cd ? `<div class="sk-cd ark-lv">${arkSkillEffCd(info.cd).toFixed(2)}초</div>` : "";
      return `
      <div class="sp-it" data-ark="${i}">
        <div class="sk-icon">${arkIconOf(n) ? `<img src="${arkIconOf(n)}" alt="" loading="lazy">` : ""}</div>
        <div class="sp-nw"><div class="sk-lv">${n.cat}${n.tier ? " " + n.tier + "티어" : ""}${n.lv ? " · Lv." + n.lv : ""}</div>
          <div class="sk-name">${n.name}${chips}</div></div>
        ${cdTxt}
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
  return (e && e.Icon) || "";
}
function renderSkills(skillsData, gemData) {
  var listEl = $("skillList"), sumEl = $("skillSummary");
  if (!listEl) return;

  var gemMap = buildSkillGemMap(gemData);
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
  var identitySkills = Object.keys(gemMap).filter(n => n && !allSkillNames.has(n))
    .map(n => ({ Name: n, Icon: gemSkillIcon(gemData, n, skillsData), Level: null, Tripods: [], _identity: true }));
  var skills = normalSkills.concat(lv1GemSkills, identitySkills);

  if (sumEl) {
    var pts = window.__skillPts || {};
    var cnt = 0, gro = 0, brk = 0;
    for (var s of normalSkills) {
      var f = skillTraitFlags(s);
      if (f.counter) cnt++;
      if (f.groggy) gro++;
      if (f.brk) brk++;
    }
    var swift = window.__swiftCdPct || 0;
    var ark = window.__arkCdPct || { mana: 0, all: 1 };
    var arkAllPct = (1 - ark.all) * 100;
    var sp = pts.total
      ? `<span class="sum-sp">SP <b>${pts.used ?? "-"}/${pts.total}</b></span>`
      : `<span class="sum-sp">스킬 <b>${normalSkills.length}개</b></span>`;
    var hasGemCool = false;
    for (var s of normalSkills) {
      if ((gemMap[s.Name] || {}).coolPct) { hasGemCool = true; break; }
    }
    var tags = [
      cnt ? `<span class="stag gold">카운터 ${cnt}</span>` : "",
      gro ? `<span class="stag purple">무력화 ${gro}</span>` : "",
      brk ? `<span class="stag violet">부위 파괴 ${brk}</span>` : "",
      swift ? `<span class="stag green">신속재감 ${swift.toFixed(2)}%</span>` : "",
      hasGemCool ? `<span class="stag cyan">보석 재감 적용</span>` : "",
      ark.mana ? `<span class="stag cyan">마나재감 ${ark.mana.toFixed(1)}%</span>` : "",
      arkAllPct > 0.001 ? `<span class="stag cyan">진화재감 ${arkAllPct.toFixed(2)}%</span>` : ""
    ].join("");
    sumEl.innerHTML = `<div class="sum-bar">${sp}${tags}</div>`;
  }

  // 트라이포드 단계별 해금 레벨: 1단계 Lv.4 / 2단계 Lv.7 / 3단계 Lv.10
  var TP_UNLOCK_LV = [4, 7, 10];

  var spSec = buildSpecialSection(specialSkills);
  listEl.innerHTML = spSec.hyperHtml + skills.map((s, si) => {
    var tiers = groupTripods(s.Tripods);
    var tpCells = s._identity ? '<div class="tp"></div><div class="tp"></div><div class="tp"></div>' : [0, 1, 2].map(i => {
      var g = tiers[i];
      if (!g) return `<div class="tp empty"><div class="tp-icon"></div><span class="tp-name">미습득</span></div>`;
      var opIcon = g.selected.Icon ? `<img src="${g.selected.Icon}" alt="" loading="lazy">` : "";

      var locked = (s.Level || 0) < TP_UNLOCK_LV[g.tier];   // 스킬 레벨 부족 → 비활성
      return `<div class="tp${locked ? " locked" : ""}" data-si="${si}" data-tier="${g.tier}">
        <div class="tp-icon">${opIcon}<span class="tp-num tier${g.tier}">${g.selected.Slot || (g.tier + 1)}</span></div>
        <div class="tp-name">${g.selected.Name || ""}</div>
      </div>`;
    }).join("");

    var gm = gemMap[s.Name] || {};
    var rune = s._identity ? '<div class="rune-wrap"></div>' : s.Rune
      ? `<div class="rune-wrap"><div class="rune-cell" data-si="${si}" style="background:${gradeStyle(s.Rune.Grade).bg};border-color:${gradeStyle(s.Rune.Grade).c}"><img src="${s.Rune.Icon || ""}" alt="" loading="lazy"></div><div class="rune-name" style="color:${gradeStyle(s.Rune.Grade).c}">${s.Rune.Name || ""}</div></div>`
      : `<div class="rune-wrap"><div class="rune-cell empty">-</div></div>`;

    return `
    <div class="row">
      <div class="sk-main" data-si="${si}">
        <div class="sk-icon">${s.Icon ? `<img src="${s.Icon}" alt="" loading="lazy">` : ""}</div>
        <div class="sk-name-wrap">
          <div class="sk-lv">${s._identity ? "아이덴티티" : (s.Level ?? "-") + "레벨"}</div>
          <div class="sk-name">${s.Name || "-"}</div>
        </div>
        ${s._identity ? "" : effCdBadge(s)}
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
    bindTip(el, buildSkillTipHtml(spSec.items[+el.dataset.sp]));
  });
  listEl.querySelectorAll(".sp-it[data-ark]").forEach(el => {
    var n = spSec.arks[+el.dataset.ark];
    try { bindTip(el, arkSkillTipHtml(n)); } catch (e) { try { bindTip(el, buildTipHtml(n.eff.ToolTip, n.name)); } catch (e2) {} }
  });

  listEl.querySelectorAll(".sk-main").forEach(el => {
    var s = skills[+el.dataset.si];
    bindTip(el, s._identity
      ? `<div class="tip-hd">${s.Name}</div><div class="tip-bd" style="color:#9aa6c4;font-size:11px;">아이덴티티 스킬 · 스킬창에 없는 스킬</div>`
      : buildSkillTipHtml(s));
  });

  listEl.querySelectorAll(".gems .gem[data-gt]").forEach(el => {
    var s = skills[+el.dataset.si];
    var gm = gemMap[s.Name] || {};
    var t = el.dataset.gt === "cool" ? gm.coolTip : gm.dmgTip;
    var n = el.dataset.gt === "cool" ? gm.coolName : gm.dmgName;
    if (t) bindTip(el, buildTipHtml(t, strip(n)));
  });

  listEl.querySelectorAll(".tp[data-si]").forEach(el => {
    var s = skills[+el.dataset.si];
    var g = groupTripods(s.Tripods).find(x => x.tier === +el.dataset.tier);
    if (!g) return;
    var opts = g.options.map(o => `
      <div class="tp-opt ${o.IsSelected ? "selected" : "dim"}">
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
    if (s.Rune) bindTip(el, buildTipHtml(s.Rune.Tooltip, s.Rune.Name));
  });
}
