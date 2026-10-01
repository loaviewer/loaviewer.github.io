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

function renderSkills(skillsData, gemData) {
  var listEl = $("skillList"), sumEl = $("skillSummary");
  if (!listEl) return;

  var gemMap = buildSkillGemMap(gemData);
  var skills = sortSkillsForDisplay(
    (skillsData || []).filter(s => (s.Level || 0) > 1),
    gemMap
  );

  if (sumEl) {
    var pts = window.__skillPts || {};
    var cnt = 0, gro = 0, brk = 0;
    for (var s of skills) {
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
      : `<span class="sum-sp">스킬 <b>${skills.length}개</b></span>`;
    var hasGemCool = false;
    for (var s of skills) {
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

  listEl.innerHTML = skills.map((s, si) => {
    var tiers = groupTripods(s.Tripods);
    var tpCells = [0, 1, 2].map(i => {
      var g = tiers[i];
      if (!g) return `<div class="tp empty"><div class="tp-icon"></div><span class="tp-name">미습득</span></div>`;
      var opIcon = g.selected.Icon ? `<img src="${g.selected.Icon}" alt="" loading="lazy">` : "";

      return `<div class="tp" data-si="${si}" data-tier="${g.tier}">
        <div class="tp-icon">${opIcon}<span class="tp-num tier${g.tier}">${g.selected.Slot || (g.tier + 1)}</span></div>
        <div class="tp-name">${g.selected.Name || ""}</div>
      </div>`;
    }).join("");

    var gm = gemMap[s.Name] || {};
    var rune = s.Rune
      ? `<div class="rune-wrap"><div class="rune-cell" data-si="${si}" style="background:${gradeStyle(s.Rune.Grade).bg};border-color:${gradeStyle(s.Rune.Grade).c}"><img src="${s.Rune.Icon || ""}" alt="" loading="lazy"></div><div class="rune-name" style="color:${gradeStyle(s.Rune.Grade).c}">${s.Rune.Name || ""}</div></div>`
      : `<div class="rune-wrap"><div class="rune-cell empty">-</div></div>`;

    return `
    <div class="row">
      <div class="sk-main" data-si="${si}">
        <div class="sk-icon">${s.Icon ? `<img src="${s.Icon}" alt="" loading="lazy">` : ""}</div>
        <div class="sk-name-wrap">
          <div class="sk-lv">${s.Level ?? "-"}레벨</div>
          <div class="sk-name">${s.Name || "-"}</div>
        </div>
        ${effCdBadge(s)}
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
  }).join("");

  listEl.querySelectorAll(".sk-main").forEach(el => {
    var s = skills[+el.dataset.si];
    bindTip(el, buildSkillTipHtml(s));
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
    bindTip(el, `<div class="tip-hd">트라이포드 ${g.tier + 1}단계</div><div class="tip-bd">${opts}</div>`);
  });

  listEl.querySelectorAll(".rune-cell[data-si]").forEach(el => {
    var s = skills[+el.dataset.si];
    if (s.Rune) bindTip(el, buildTipHtml(s.Rune.Tooltip, s.Rune.Name));
  });
}