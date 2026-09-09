/* =============================================================
   로스트아크 배틀아이템 도감 - 재사용 위젯 모듈 (공식 규격 적용)
   =============================================================
   사용법:
     1) 페이지에 이 파일을 로드
        <script src="../js/battle-items.js"></script>
     2) 원하는 위치에 빈 컨테이너 하나만 두기
        <div id="battleItemsRoot"></div>
     3) JS에서 원하는 시점에 호출
        renderBattleItems("battleItemsRoot");
   ============================================================= */

(function () {
  "use strict";

  // ─────────────────────────────────────────
  // 공식 CDN 규격 아이템 데이터
  //  - icon: 공식 아이콘 명칭
  //  - grade: 등급 (5: 전설, 4: 영웅, 3: 희귀, 2: 고급)
  //  - hideGrade: 툴팁에서 등급 라벨 제거 여부
  // ─────────────────────────────────────────
  const rawItems = [
    // ── 영웅 (등급 4) ──
    { grade: 4, icon: "battle_item_01_8", name: "정령의 회복약", desc: '정령의 가호를 받아 <span class="eff-value">60%</span>의 생명력을 회복한다.', type: "회복약", stack: "일부 지역 장착 제한 7 개" },
    { grade: 4, icon: "battle_item_01_10", name: "각성 물약", desc: '아이덴티티 게이지를 <span class="eff-value">100%</span> 회복한다.', type: "물약", stack: "일부 지역 장착 제한 1 개" },
    { grade: 4, icon: "battle_item_01_44", name: "은신 로브", desc: '<span class="eff-time">10</span>초 동안 은신 상태가 된다.', type: "로브", stack: "일부 지역 장착 제한 3 개" },
    { grade: 4, icon: "battle_item_01_72", name: "아드로핀 물약", desc: '생명력이 <span class="eff-minus">25%</span> 감소하는 대신, <span class="eff-time">10</span>초간 공격력이 <span class="eff-value">30%</span> 증가하고, 이동 및 공격속도가 <span class="eff-value">20%</span> 증가한다.', type: "물약", stack: "일부 지역 장착 제한 3 개" },
    { grade: 4, icon: "battle_item_01_73", name: "루테란의 나팔", desc: '<span class="eff-time">30</span>초간 아군을 도와 싸우는 루테란 병사들을 소환한다.', type: "나팔", stack: "일부 지역 장착 제한 3 개" },
    { grade: 4, icon: "battle_item_01_76", name: "시간 정지 물약", desc: "사용하면 일정 시간동안 무적이 된다. 단, 일부 강력한 몬스터의 전멸기는 피할 수 없다.", type: "물약", stack: "일부 지역 장착 제한 3 개" },
    { grade: 4, icon: "battle_item_01_80", name: "빛나는 정령의 회복약", desc: '정령의 가호를 받아 <span class="eff-value">60%</span>의 생명력을 회복한다. 일부 지역 장착 제한 개수가 2개 증가한다.', type: "회복약", stack: "일부 지역 장착 제한 9 개" },
    { grade: 4, icon: "battle_item_01_96", name: "빛나는 은신 로브", desc: '<span class="eff-time">10</span>초 동안 은신 상태가 되며, 이동 속도가 <span class="eff-value">10%</span> 증가한다.', type: "로브", stack: "일부 지역 장착 제한 3 개" },

    // ── 희귀 (등급 3) ──
    { grade: 3, icon: "battle_item_01_0", name: "섬광 수류탄", desc: '수류탄을 던져 적을 <span class="eff-value">297</span>만큼의 [성] 속성 피해를 주고, <span class="eff-time">4</span>초 동안 기절시킨다.<br>무력화 : 중상', type: "수류탄", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_1", name: "화염 수류탄", desc: '수류탄을 던져 <span class="eff-value">86</span>만큼의 [화] 속성 피해를 준다. <span class="eff-time">10</span>초간 유지되는 넓은 화염지대를 생성한다.<br>무력화 : 중상', type: "수류탄", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_17", name: "만능 물약", desc: '<span class="eff-value">100%</span>의 확률로 해로운 효과를 모두 제거한다.', type: "물약", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_2", name: "냉기 수류탄", desc: '수류탄을 던져 <span class="eff-value">297</span>만큼의 [수] 속성 피해를 주고, <span class="eff-time">4</span>초 동안 동결시킨다.<br>무력화 : 중상', type: "수류탄", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_3", name: "전기 수류탄", desc: '수류탄을 던져 <span class="eff-value">119</span>만큼의 [뇌] 속성 피해를 준다.<br>무력화 : 중상', type: "수류탄", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_45", name: "도발 허수아비", desc: '허수아비를 세워 도발을 총 <span class="eff-value">3</span>회 시전. <span class="eff-time">30</span>초 동안 지속된다.', type: "기타", stack: "일부 지역 장착 제한 1 개" },
    { grade: 3, icon: "battle_item_01_7", name: "고급 회복약", desc: '<span class="eff-value">45%</span>의 생명력을 회복한다.', type: "회복약", stack: "일부 지역 장착 제한 5 개" },
    { grade: 3, icon: "battle_item_01_12", name: "모닥불", desc: '모닥불을 피워 자신과 파티원의 생명력과 마나를 회복한다. <span class="eff-time">30</span>초 동안 지속된다.', type: "기타", stack: "일부 지역 장착 제한 1 개" },
    { grade: 3, icon: "battle_item_01_14", name: "진군의 깃발", desc: '자신과 파티원의 이동속도를 <span class="eff-time">20</span>초 동안 <span class="eff-value">20%</span> 증가시킨다.', type: "깃발", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_19", name: "위장 로브", desc: '<span class="eff-time">10</span>초 동안 위장 상태가 되어 몬스터에게 인식되지 않는다.', type: "로브", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_47", name: "암흑 수류탄", desc: '수류탄을 던져 <span class="eff-value">212</span>만큼의 [암] 속성 피해를 주고, 모든 방어력을 <span class="eff-time">20</span>초 동안 <span class="eff-value">20%</span> 감소시킨다.<br>무력화 : 하', type: "수류탄", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_49", name: "부식 폭탄", desc: '부식 폭탄을 던져 <span class="eff-time">20</span>초 동안 부위파괴 피해량 수치가 <span class="eff-value">+1</span>레벨 만큼 더 적용 받게 만든다.', type: "폭탄", stack: "일부 지역 장착 제한 5 개" },
    { grade: 3, icon: "battle_item_01_50", name: "보호 물약", desc: '사용 즉시 최대 생명력의 <span class="eff-value">15%</span> 만큼 보호막이 <span class="eff-time">8</span>초 동안 생성된다.', type: "물약", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_51", name: "성스러운 부적", desc: '주변 파티원의 디버프를 랜덤하게 <span class="eff-value">1</span>개 삭제한다.', type: "부적", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_63", name: "천둥 물약", desc: '<span class="eff-time">1</span>초마다 주변 무작위 지점에 낙뢰를 떨어뜨려 적에게 <span class="eff-value">48</span>의 피해를 준다. <span class="eff-time">20</span>초 동안 지속된다.', type: "물약", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_52", name: "신속 로브", desc: '<span class="eff-time">12</span>초 동안, 이동속도를 <span class="eff-value">40%</span> 증가시킨다.', type: "로브", stack: "일부 지역 장착 제한 5 개" },
    { grade: 3, icon: "battle_item_01_53", name: "회오리 수류탄", desc: '수류탄을 던져 <span class="eff-value">297</span>만큼의 피해를 주고, 적을 공중에 띄운다.<br>무력화 : 상', type: "수류탄", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_54", name: "점토 수류탄", desc: '수류탄을 던져 <span class="eff-value">212</span>만큼의 [토] 속성 피해를 주고, 공격/이동속도를 <span class="eff-time">20</span>초 동안 <span class="eff-value">40%</span> 감소시킨다.<br>무력화 : 상', type: "수류탄", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_69", name: "수면 폭탄", desc: '폭탄을 던져 적들을 <span class="eff-time">12</span>초 동안 수면 상태로 만든다.', type: "폭탄", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_70", name: "성스러운 폭탄", desc: "폭탄을 던져 파티원의 행동불가 상태이상을 제거한다.", type: "폭탄", stack: "일부 지역 장착 제한 5 개" },
    { grade: 3, icon: "battle_item_01_21", name: "파괴 폭탄", desc: '파괴 폭탄을 던져 <span class="eff-value">106</span>만큼의 피해를 입힌다.<br>부위 파괴 : 레벨 3', type: "폭탄", stack: "일부 지역 장착 제한 5 개" },
    { grade: 3, icon: "battle_item_01_81", name: "빛나는 섬광 수류탄", desc: '수류탄을 던져 <span class="eff-value">386</span>만큼의 [성] 속성 피해를 주고, <span class="eff-time">4</span>초 동안 기절시킨다.<br>무력화 : 상', type: "수류탄", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_82", name: "빛나는 화염 수류탄", desc: '수류탄을 던져 <span class="eff-value">111</span>만큼의 [화] 속성 피해를 준다.<br>무력화 : 중상', type: "수류탄", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_83", name: "빛나는 냉기 수류탄", desc: '수류탄을 던져 <span class="eff-value">386</span>만큼의 [수] 속성 피해를 주고, <span class="eff-time">6</span>초 동안 동결시킨다.<br>무력화 : 중상', type: "수류탄", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_84", name: "빛나는 전기 수류탄", desc: '수류탄을 던져 <span class="eff-value">127</span>만큼의 [뇌] 속성 피해를 준다.<br>무력화 : 중상', type: "수류탄", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_85", name: "빛나는 점토 수류탄", desc: '수류탄을 던져 <span class="eff-value">276</span>만큼의 [토] 속성 피해를 주고, 공격/이동속도를 <span class="eff-time">20</span>초 동안 <span class="eff-value">60%</span> 감소시킨다.<br>무력화 : 상', type: "수류탄", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_86", name: "빛나는 회오리 수류탄", desc: '수류탄을 던져 <span class="eff-value">386</span>만큼의 피해를 주고, 적을 공중에 띄운다.<br>부위 파괴 : 레벨 1<br>무력화 : 상', type: "수류탄", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_87", name: "빛나는 암흑 수류탄", desc: '수류탄을 던져 <span class="eff-value">276</span>만큼의 [암] 속성 피해를 주고, 모든 방어력을 <span class="eff-time">25</span>초 동안 <span class="eff-value">20%</span> 감소시킨다.<br>무력화 : 하', type: "수류탄", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_88", name: "빛나는 수면 폭탄", desc: '폭탄을 던져 적들을 <span class="eff-time">16</span>초 동안 수면 상태로 만든다.', type: "폭탄", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_89", name: "빛나는 파괴 폭탄", desc: '파괴 폭탄을 던져 <span class="eff-value">106</span>만큼의 피해를 입힌다.<br>부위 파괴 : 레벨 4', type: "폭탄", stack: "일부 지역 장착 제한 5 개" },
    { grade: 3, icon: "battle_item_01_90", name: "빛나는 부식 폭탄", desc: '부식 폭탄을 던져 <span class="eff-time">25</span>초 동안 부위파괴 피해량 수치가 <span class="eff-value">+1</span>레벨 만큼 더 적용 받게 만든다.', type: "폭탄", stack: "일부 지역 장착 제한 5 개" },
    { grade: 3, icon: "battle_item_01_91", name: "빛나는 성스러운 폭탄", desc: '폭탄을 던져 파티원의 행동불가 상태이상을 제거하며 <span class="eff-time">2</span>초 동안 상태 이상에 면역이 된다.', type: "폭탄", stack: "일부 지역 장착 제한 5 개" },
    { grade: 3, icon: "battle_item_01_92", name: "빛나는 만능 물약", desc: '<span class="eff-value">100%</span>의 확률로 해로운 효과를 모두 제거하며 <span class="eff-time">2</span>초 동안 디버프에 면역이 된다.', type: "물약", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_93", name: "빛나는 보호 물약", desc: '사용 즉시 최대 생명력의 <span class="eff-value">25%</span> 만큼 보호막이 <span class="eff-time">8</span>초 동안 생성된다.', type: "물약", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_94", name: "빛나는 천둥 물약", desc: '<span class="eff-time">1</span>초마다 주변 무작위 지점에 낙뢰를 떨어뜨려 적에게 <span class="eff-value">48</span>의 피해를 준다. <span class="eff-time">24</span>초 동안 지속된다.', type: "물약", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_95", name: "빛나는 위장 로브", desc: '<span class="eff-time">10</span>초 동안 위장 상태가 되어 몬스터에게 인식되지 않으며, 일반 몬스터와 충돌하지 않고 통과한다.', type: "로브", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_97", name: "빛나는 신속 로브", desc: '<span class="eff-time">12</span>초 동안, 이동속도를 <span class="eff-value">40%</span> 증가시키고, 이동속도 감소 효과에 면역이 된다.', type: "로브", stack: "일부 지역 장착 제한 5 개" },
    { grade: 3, icon: "battle_item_01_99", name: "빛나는 모닥불", desc: '모닥불을 피워 자신과 파티원의 생명력과 마나를 회복한다. <span class="eff-time">40</span>초 동안 지속된다.', type: "기타", stack: "일부 지역 장착 제한 1 개" },
    { grade: 3, icon: "battle_item_01_100", name: "빛나는 도발 허수아비", desc: '허수아비를 세워 도발을 총 <span class="eff-value">4</span>회 시전. <span class="eff-time">40</span>초 동안 지속된다.', type: "기타", stack: "일부 지역 장착 제한 1 개" },
    { grade: 3, icon: "battle_item_01_101", name: "빛나는 성스러운 부적", desc: '주변 파티원의 디버프를 랜덤하게 <span class="eff-value">1</span>개 삭제하며, <span class="eff-time">2</span>초 동안 디버프에 면역이 된다.', type: "부적", stack: "일부 지역 장착 제한 3 개" },
    { grade: 3, icon: "battle_item_01_102", name: "빛나는 진군의 깃발", desc: '자신과 파티원의 이동속도를 <span class="eff-time">25</span>초 동안 <span class="eff-value">20%</span> 증가시킨다.', type: "깃발", stack: "일부 지역 장착 제한 3 개" },

    // ── 고급 (등급 2) ──
    { grade: 2, icon: "battle_item_01_6", name: "회복약", desc: '<span class="eff-value">30%</span>의 생명력을 회복한다.', type: "회복약", stack: "일부 지역 장착 제한 5 개" },

    // ── 그림자 스킬 (등급 없음 - 전설 컬러 5번 지정 및 툴팁 표기 해제) ──
    { grade: 5, hideGrade: true, icon: "battle_item_01_118", name: "페투스 안 크라그마의 그림자", desc: '페투스 안 크라그마의 그림자를 소환하여 최대 <span class="eff-value">3,746</span>의 피해를 준다.<br>무력화 : 중상', type: "그림자 스킬", stack: "일부 지역 장착 제한 3 개" },
    { grade: 5, hideGrade: true, icon: "battle_item_01_117", name: "코르부스 툴 라크의 그림자", desc: '코르부스 툴 라크의 그림자를 소환하여 최대 <span class="eff-value">2,340</span>의 피해를 준다.<br>무력화 : 상', type: "그림자 스킬", stack: "일부 지역 장착 제한 3 개" }
  ];

  // 등급 가이드 (전설 색상 포함)
  const gradeLabel = { 5: "전설", 4: "영웅", 3: "희귀", 2: "고급" };

  // 공식 CDN 주소 매핑
  function toCdnUrl(iconName) {
    const parts = iconName.split("_");
    const category = parts.slice(0, -2).join("_"); // battle_item
    return `https://cdn-lostark.game.onstove.com/efui_iconatlas/${category}/${iconName}.png`;
  }

  // 중복 아이템 필터링
  const seen = new Set();
  const items = rawItems.filter((item) => {
    const key = item.grade + "_" + item.icon;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // 카테고리 정렬 순서 및 아이콘 정의
  const typeOrder = ["회복약", "물약", "수류탄", "폭탄", "로브", "깃발", "부적", "나팔", "그림자 스킬", "기타"];
  const typeIcons = {
    "회복약": "💊", "물약": "🧪", "수류탄": "💣", "폭탄": "🧨",
    "로브": "🧥", "깃발": "🚩", "부적": "📿", "나팔": "📯",
    "그림자 스킬": "👤", "기타": "🔧"
  };

  // ─────────────────────────────────────────
  // 스타일 주입 (공식 가이드 색상 및 카테고리 디자인 최적화)
  // ─────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById("battle-items-widget-style")) return;

    const style = document.createElement("style");
    style.id = "battle-items-widget-style";
    style.textContent = `
.bi-widget { font-family: inherit; color: #e0e0e0; }
.bi-widget h2.bi-title { text-align: center; color: #f5c518; margin-bottom: 10px; font-size: 22px; }
.bi-widget .bi-subtitle { text-align: center; color: #888; margin-bottom: 24px; font-size: 13px; }

/* 필터 바 */
.bi-widget .bi-filter-bar { display: flex; justify-content: center; gap: 10px; margin-bottom: 25px; flex-wrap: wrap; }
.bi-widget .bi-filter-btn { padding: 7px 16px; border: 2px solid #555; border-radius: 8px; background: transparent; color: #ccc; cursor: pointer; font-size: 13px; transition: all .2s; }
.bi-widget .bi-filter-btn:hover, .bi-widget .bi-filter-btn.active { background: #f5c518; color: #1a1a2e; border-color: #f5c518; font-weight: bold; }

/* 카테고리 구조 */
.bi-widget .bi-category-section { max-width: 750px; margin: 0 auto 25px; }
.bi-widget .bi-category-title { font-size: 15px; font-weight: bold; color: #f5c518; margin-bottom: 10px; padding-bottom: 4px; border-bottom: 1px solid #333; display: flex; align-items: center; gap: 6px; }
.bi-widget .bi-category-title .bi-cat-icon { font-size: 18px; }

/* 5열 그리드 */
.bi-widget .bi-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }

/* 카드 스타일 */
.bi-widget .bi-item-card { position: relative; border: 2px solid #444; border-radius: 10px; background: #111521; text-align: center; padding: 10px 6px 8px; cursor: pointer; transition: transform .15s, box-shadow .15s, border-color .15s; }
.bi-widget .bi-item-card:hover { transform: translateY(-4px); box-shadow: 0 6px 20px rgba(0,0,0,.5); }

/* 공식 테두리 대응 */
.bi-widget .bi-item-card[data-grade="5"] { border-color: #f99200; } /* 전설 (금색) */
.bi-widget .bi-item-card[data-grade="4"] { border-color: #ce43fc; } /* 영웅 (자두색) */
.bi-widget .bi-item-card[data-grade="3"] { border-color: #00b5ff; } /* 희귀 (하늘색) */
.bi-widget .bi-item-card[data-grade="2"] { border-color: #91fe02; } /* 고급 (연두색) */

.bi-widget .bi-item-card img { width: 52px; height: 52px; border-radius: 6px; background: #0f0f23; padding: 2px; }

/* 아이콘 글로우 */
.bi-widget .bi-item-card[data-grade="5"] img { box-shadow: 0 0 10px rgba(249,146,0,.7); }
.bi-widget .bi-item-card[data-grade="4"] img { box-shadow: 0 0 8px rgba(206,67,252,.5); }
.bi-widget .bi-item-card[data-grade="3"] img { box-shadow: 0 0 8px rgba(0,181,255,.5); }
.bi-widget .bi-item-card[data-grade="2"] img { box-shadow: 0 0 8px rgba(145,254,2,.4); }

.bi-widget .bi-item-name { margin-top: 6px; font-size: 11px; line-height: 1.3; color: #ddd; word-break: keep-all; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* 공유 툴팁 */
.bi-tooltip { display: none; position: fixed; z-index: 9999; width: 320px; background: linear-gradient(135deg, #121624, #080a12); border: 1px solid #555; border-radius: 10px; padding: 16px; box-shadow: 0 8px 30px rgba(0,0,0,.8); pointer-events: none; }
.bi-tooltip.show { display: block; }
.bi-tooltip .bi-tt-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #2d3548; }
.bi-tooltip .bi-tt-header img { width: 48px; height: 48px; border-radius: 6px; background: #0f0f23; padding: 2px; }
.bi-tooltip .bi-tt-title { font-size: 16px; font-weight: bold; }
.bi-tooltip .bi-tt-grade { font-size: 11px; margin-top: 2px; }
.bi-tooltip .bi-tt-type-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; background: rgba(255,255,255,.08); margin-top: 4px; }
.bi-tooltip .bi-tt-desc { font-size: 13px; line-height: 1.6; color: #ccc; margin-bottom: 10px; }
.bi-tooltip .bi-tt-stack { font-size: 12px; color: #f5c518; padding-top: 8px; border-top: 1px solid #2d3548; }

/* 등급 텍스트 컬러 */
.bi-tooltip .grade-5 { color: #f99200; }
.bi-tooltip .grade-4 { color: #ce43fc; }
.bi-tooltip .grade-3 { color: #00b5ff; }
.bi-tooltip .grade-2 { color: #91fe02; }

/* 인게임 하이라이트 효과 */
.bi-tooltip .eff-value { color: #5eead4; font-weight: bold; }
.bi-tooltip .eff-time { color: #fbbf24; font-weight: bold; }
.bi-tooltip .eff-minus { color: #f87171; font-weight: bold; }

@media (max-width: 600px) {
  .bi-widget .bi-grid { grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .bi-widget .bi-item-card img { width: 42px; height: 42px; }
  .bi-widget .bi-item-name { font-size: 10px; }
  .bi-tooltip { width: 260px; }
}
    `;
    document.head.appendChild(style);
  }

  // ─────────────────────────────────────────
  // 위젯 렌더링 함수
  // ─────────────────────────────────────────
  function renderBattleItems(containerId, options) {
    options = options || {};
    const root = document.getElementById(containerId);
    if (!root) {
      console.warn(`[battle-items] "#${containerId}" 컨테이너를 찾을 수 없습니다.`);
      return;
    }

    injectStyles();

    const showTitle = options.showTitle !== false;
    const title = options.title || "⚔️ 로스트아크 배틀아이템";
    const subtitle = options.subtitle || "마우스를 올려 상세 정보를 확인하세요";

    const uid = "bi_" + Math.random().toString(36).slice(2, 9);

    root.className = (root.className ? root.className + " " : "") + "bi-widget";
    root.innerHTML = `
      ${showTitle ? `<h2 class="bi-title">${title}</h2><p class="bi-subtitle">${subtitle}</p>` : ""}
      <div class="bi-filter-bar" data-uid="${uid}">
        <button class="bi-filter-btn active" data-filter="all">전체</button>
        <button class="bi-filter-btn" data-filter="4" style="border-color:#ce43fc">영웅</button>
        <button class="bi-filter-btn" data-filter="3" style="border-color:#00b5ff">희귀</button>
        <button class="bi-filter-btn" data-filter="2" style="border-color:#91fe02">고급</button>
      </div>
      <div class="bi-categories-container" data-uid="${uid}"></div>
    `;

    // 공유 툴팁 요소 확인 및 설정
    let tooltip = document.getElementById("bi-tooltip-shared");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "bi-tooltip-shared";
      tooltip.className = "bi-tooltip";
      document.body.appendChild(tooltip);
    }

    const categoriesContainer = root.querySelector(`.bi-categories-container[data-uid="${uid}"]`);
    const filterBar = root.querySelector(`.bi-filter-bar[data-uid="${uid}"]`);

    // 카테고리별 정렬 및 목록 그리기
    function renderList(filterGrade) {
      categoriesContainer.innerHTML = "";

      // 등급 필터 적용
      const filtered = filterGrade === "all"
        ? items
        : items.filter((i) => i.grade == filterGrade);

      // 데이터 그룹화
      const grouped = {};
      filtered.forEach(item => {
        if (!grouped[item.type]) grouped[item.type] = [];
        grouped[item.type].push(item);
      });

      // 그룹 내 내림차순(높은 등급 우선) 정렬
      Object.values(grouped).forEach(arr => arr.sort((a, b) => b.grade - a.grade));

      // 정의된 카테고리 순서대로 그리기
      typeOrder.forEach(type => {
        const group = grouped[type];
        if (!group || group.length === 0) return;

        const section = document.createElement('div');
        section.className = 'bi-category-section';

        section.innerHTML = `
          <div class="bi-category-title">
            <span class="bi-cat-icon">${typeIcons[type] || '📦'}</span>
            ${type} <span style="color:#666;font-size:11px;font-weight:normal">(${group.length})</span>
          </div>
        `;

        const grid = document.createElement('div');
        grid.className = 'bi-grid';

        group.forEach(item => {
          const card = document.createElement("div");
          card.className = "bi-item-card";
          card.dataset.grade = item.grade;
          const cdnUrl = toCdnUrl(item.icon);

          card.innerHTML = `
            <img src="${cdnUrl}" alt="${item.name}"
                 onerror="this.src='https://cdn-lostark.game.onstove.com/efui_iconatlas/battle_item/battle_item_01_0.png'">
            <div class="bi-item-name">${item.name}</div>
          `;

          card.addEventListener("mouseenter", (e) => showTooltip(e, item, cdnUrl));
          card.addEventListener("mousemove", moveTooltip);
          card.addEventListener("mouseleave", hideTooltip);

          grid.appendChild(card);
        });

        section.appendChild(grid);
        categoriesContainer.appendChild(section);
      });
    }

    function showTooltip(e, item, cdnUrl) {
      const gradeLine = item.hideGrade
        ? ''
        : `<div class="bi-tt-grade grade-${item.grade}">● ${gradeLabel[item.grade]}</div>`;

      tooltip.innerHTML = `
        <div class="bi-tt-header">
          <img src="${cdnUrl}">
          <div>
            <div class="bi-tt-title grade-${item.grade}">${item.name}</div>
            ${gradeLine}
            <div class="bi-tt-type-badge">${typeIcons[item.type] || '📦'} ${item.type}</div>
          </div>
        </div>
        <div class="bi-tt-desc">${item.desc}</div>
        <div class="bi-tt-stack">📦 ${item.stack}</div>
      `;
      tooltip.classList.add("show");
      moveTooltip(e);
    }

    function moveTooltip(e) {
      const pad = 16;
      let x = e.clientX + pad;
      let y = e.clientY + pad;
      const tw = tooltip.offsetWidth;
      const th = tooltip.offsetHeight;
      if (x + tw > window.innerWidth - 10) x = e.clientX - tw - pad;
      if (y + th > window.innerHeight - 10) y = e.clientY - th - pad;
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    }

    function hideTooltip() {
      tooltip.classList.remove("show");
    }

    filterBar.querySelectorAll(".bi-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBar.querySelectorAll(".bi-filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderList(btn.dataset.filter);
      });
    });

    renderList("all");
  }





  // ─────────────────────────────────────────
  // 외부(index.js 히어로/미니히어로)에서 재사용하는 공개 API
  //  - 아이템 이름으로 찾기 + 공유 툴팁(마우스오버) 바인딩
  // ─────────────────────────────────────────
  function normalizeItemName(name) {
    return (name || "").replace(/\s+/g, "");
  }

  const nameIndex = {};
  items.forEach((item) => {
    nameIndex[normalizeItemName(item.name)] = item;
  });

  function findItemByName(name) {
    return nameIndex[normalizeItemName(name)] || null;
  }

  function ensureSharedTooltipEl() {
    injectStyles();
    let tooltip = document.getElementById("bi-tooltip-shared");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "bi-tooltip-shared";
      tooltip.className = "bi-tooltip";
      document.body.appendChild(tooltip);
    }
    return tooltip;
  }

  function renderSharedTooltipContent(tooltip, item) {
    const cdnUrl = toCdnUrl(item.icon);
    const gradeLine = item.hideGrade
      ? ''
      : `<div class="bi-tt-grade grade-${item.grade}">● ${gradeLabel[item.grade]}</div>`;

    tooltip.innerHTML = `
      <div class="bi-tt-header">
        <img src="${cdnUrl}">
        <div>
          <div class="bi-tt-title grade-${item.grade}">${item.name}</div>
          ${gradeLine}
          <div class="bi-tt-type-badge">${typeIcons[item.type] || '📦'} ${item.type}</div>
        </div>
      </div>
      <div class="bi-tt-desc">${item.desc}</div>
      <div class="bi-tt-stack">📦 ${item.stack}</div>
    `;
  }

  function moveSharedTooltip(tooltip, e) {
    const pad = 16;
    let x = e.clientX + pad;
    let y = e.clientY + pad;
    const tw = tooltip.offsetWidth;
    const th = tooltip.offsetHeight;
    if (x + tw > window.innerWidth - 10) x = e.clientX - tw - pad;
    if (y + th > window.innerHeight - 10) y = e.clientY - th - pad;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
  }

  function bindItemTooltip(el, name) {
    if (!el || el.dataset.biTooltipBound === "1") return;
    el.dataset.biTooltipBound = "1";

    el.addEventListener("mouseenter", (e) => {
      const item = findItemByName(name);
      if (!item) return;
      const tooltip = ensureSharedTooltipEl();
      renderSharedTooltipContent(tooltip, item);
      tooltip.classList.add("show");
      moveSharedTooltip(tooltip, e);
    });
    el.addEventListener("mousemove", (e) => {
      const tooltip = document.getElementById("bi-tooltip-shared");
      if (tooltip && tooltip.classList.contains("show")) moveSharedTooltip(tooltip, e);
    });
    el.addEventListener("mouseleave", () => {
      const tooltip = document.getElementById("bi-tooltip-shared");
      if (tooltip) tooltip.classList.remove("show");
    });
  }

  window.BattleItemsAPI = {
    findByName: findItemByName,
    toCdnUrl,
    bindTooltip: bindItemTooltip
  };



  // 전역에 모듈 바인딩
  window.renderBattleItems = renderBattleItems;
})();