// console.log("common.js loaded");


document.addEventListener("DOMContentLoaded", () => {
  const shell = document.getElementById("common-shell");
  if (!shell) return;

  const rawPath = location.pathname;

  const isLocalhost =
    location.hostname === "127.0.0.1" ||
    location.hostname === "localhost";

  function cleanPathname(pathname) {
    if (pathname === "/index.html" || pathname === "/index") return "/";
    if (pathname.endsWith("/index.html")) return pathname.slice(0, -10) + "/";
    if (pathname.endsWith("/index")) return pathname.slice(0, -5) + "/";
   if (pathname.endsWith(".html")) return pathname.slice(0, -5);
    return pathname;
  }

  const path = isLocalhost ? rawPath : cleanPathname(rawPath);

  if (!isLocalhost && path !== rawPath) {
    history.replaceState(null, "", path + location.search + location.hash);
  }

  const commonScript =
    Array.from(document.scripts).find((s) => s.src.includes("/js/common.js")) ||
    document.currentScript;

  const siteRoot =
    commonScript && commonScript.src.includes("/js/common.js")
      ? commonScript.src.split("/js/common.js")[0] + "/"
      : (location.origin ? location.origin + "/" : "./");

  const ext = isLocalhost ? ".html" : "";

  function matchesPath(target) {
    if (target === "/") {
      return path === "/" || path === "/index" || path === "/index.html";
    }
    return path === target || path === `${target}/` || path === `${target}.html`;
  }

  const isDps = path.includes("/dps/");
  const isRank = matchesPath("/rank");
  const isTools = path.includes("/tools/");
  const isClass = path.includes("/class/");
  const isRankDir = path.includes("/rank/");
  const isStandaloneDpsPage = document.body.classList.contains("standalone-dps-page");

  const isHome = !isDps && !isRank && !isTools && matchesPath("/");

  const isLevelPage = matchesPath("/dps/level");
  const isRaidLevelPage = matchesPath("/dps/raid");
  const isSerkaPage = matchesPath("/dps/serka");
  const isCathedralPage = matchesPath("/dps/cathedral");
  const isBelgardinPage = matchesPath("/dps/belgardin");
  const isGuardianPage = matchesPath("/dps/guardian");
  const isExtremePage = matchesPath("/dps/extreme");

  const isSynergyPage = matchesPath("/class/synergy");
  const isArcGridPage = matchesPath("/class/arc-grid");
  const isArkPassivePage = matchesPath("/class/arkPassive");

  const isAuctionPage = matchesPath("/tools/auction");
  const isMarketPage = matchesPath("/tools/market");

  const isRankingPage = matchesPath("/rank/ranking");
  const isTierPage = matchesPath("/rank/tier");
  const isWinratePage = matchesPath("/rank/winrate");
  const isClassWinPage = matchesPath("/rank/class-win");
  const isHistoryPage = matchesPath("/rank/history");

  const isInfoPage =
    matchesPath("/about") || matchesPath("/guide") || matchesPath("/privacy");

  const isSimpleGroupActive = isLevelPage || isRaidLevelPage;
  const isPrecisionGroupActive = isSerkaPage || isCathedralPage || isBelgardinPage || isGuardianPage || isExtremePage;
  const isClassGroupActive = isSynergyPage || isArcGridPage || isArkPassivePage;
  const isToolsGroupActive = isAuctionPage || isMarketPage;

  const isRankGroupActive =
    isRank || isRankingPage || isTierPage || isWinratePage || isClassWinPage || isHistoryPage || isRankDir;

  const homeHref = isLocalhost ? `${siteRoot}index.html` : `${siteRoot}`;
  const rankHref = `${siteRoot}rank${ext}`;
  const levelHref = `${siteRoot}dps/level${ext}`;
  const raidHref = `${siteRoot}dps/raid${ext}`;
  const serkaHref = `${siteRoot}dps/serka${ext}`;
  const cathedralHref = `${siteRoot}dps/cathedral${ext}`;
  const belgardinHref = `${siteRoot}dps/belgardin${ext}`;
  const extremeHref = `${siteRoot}dps/extreme${ext}`;
  




// ===== 가디언 토벌 이번주 로테이션 계산 =====
const HG_BOSSES = [
  "루멘칼리고","가르가디스","스콜라키아","크라티오스","아게오로스",
  "드렉탈라스","소나벨","베스칼","쿤겔라니움","하누마탄",
  "데스칼루다","이그렉시온","벨가누스","아카테스","엘버하스틱"
];
const HG_ANCHOR = new Date(2026, 6, 29, 10, 0, 0);
const HG_ANCHOR_IDX = 13;
function getHgWeekBoss() {
  const now = new Date();
  const diff = now.getTime() - HG_ANCHOR.getTime();
  const weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
  const idx = ((HG_ANCHOR_IDX + weeks) % HG_BOSSES.length + HG_BOSSES.length) % HG_BOSSES.length;
  return HG_BOSSES[idx];
}
const hgWeekBoss = getHgWeekBoss();
const guardianHref = `${siteRoot}dps/guardian${ext}`;






  const auctionHref = `${siteRoot}tools/auction${ext}`;
  const marketHref = `${siteRoot}tools/market${ext}`;
  const synergyHref = `${siteRoot}class/synergy${ext}`;
  const arcGridHref = `${siteRoot}class/arc-grid${ext}`;
  const arkPassiveHref = `${siteRoot}class/arkPassive${ext}`;
  const rankingHref = `${siteRoot}rank/ranking${ext}`;
  const tierHref = `${siteRoot}rank/tier${ext}`;
  const winrateHref = `${siteRoot}rank/winrate${ext}`;
  const classWinHref = `${siteRoot}rank/class-win${ext}`;
  const historyHref = `${siteRoot}rank/history${ext}`;
  const aboutHref = `${siteRoot}about${ext}`;
  const guideHref = `${siteRoot}guide${ext}`;
  const privacyHref = `${siteRoot}privacy${ext}`;

  const showHero = isHome && !isStandaloneDpsPage;

  // ===== 공용 상수 =====
  const SUPABASE_URL = "https://khszfukekudyripouifm.supabase.co";
  const SUPABASE_KEY = "sb_publishable_XjCVKOZRq1aERqzOGj_tHw_eC4uCXEb";
  const GRADE_DIST_START_DATE = "2026-04-07";

  const GRADE_ORDER = [
    "SS+", "SS", "SS-",
    "S+", "S", "S-",
    "A+", "A", "A-",
    "B+", "B", "B-",
    "C+", "C", "C-",
    "D+", "D", "D-",
    "F+", "F", "F-"
  ];

  const PERSISTENT_GRADES = new Set([
    "SS+", "SS", "SS-",
    "S+", "S", "S-"
  ]);

  const GRADE_DESC = {
    "SS+": "메타를 완전히 꿰뚫은 선택",
    "SS":  "우승권 흐름을 정확히 읽은 선택",
    "SS-": "최상위권 바로 아래의 고수픽",
    "S+":  "대세를 아주 잘 짚은 선택",
    "S":   "강한 직업을 잘 골라낸 선택",
    "S-":  "상위권 감각이 살아있는 선택",
    "A+":  "정석에 가까운 안정픽",
    "A":   "무난하면서도 꽤 좋은 선택",
    "A-":  "괜찮지만 임팩트는 살짝 부족",
    "B+":  "감은 있었지만 폭발력은 약함",
    "B":   "평균 이상 정도의 무난한 선택",
    "B-":  "나쁘진 않지만 살짝 아쉬운 선택",
    "C+":  "조금 비껴간 선택",
    "C":   "평범하거나 애매한 선택",
    "C-":  "의도는 있었지만 결과는 아쉬움",
    "D+":  "의외성은 있었지만 효율은 낮음",
    "D":   "메타와 거리가 있는 선택",
    "D-":  "이번 흐름과는 잘 안 맞는 선택",
    "F+":  "낭만은 있었던 선택",
    "F":   "취향이 메타를 앞선 선택",
    "F-":  "로망에 모든 걸 건 선택"
  };

  function getVisitorKey() {
    return localStorage.getItem("loa_tournament_visitor_key");
  }

  function getDateKey() {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
  }

  function formatStampDate(dk) {
    if (!dk) return "";
    const [y, m, d] = dk.split("-");
    return `${y.slice(2)}.${m}.${d}`;
  }

  function normalizeFullGrade(grade) {
    return String(grade || "").trim().toUpperCase().replace(/\s+/g, "").replace(/등급/g, "");
  }

  function getGradeRank(grade) {
    return GRADE_ORDER.indexOf(normalizeFullGrade(grade));
  }

  function isPersistentGrade(grade) {
    return PERSISTENT_GRADES.has(normalizeFullGrade(grade));
  }

  function getGradeBarClass(grade) {
    const g = normalizeFullGrade(grade);
    if (g.startsWith("SS")) return "ss";
    if (g.startsWith("S")) return "s";
    if (g.startsWith("A")) return "a";
    if (g.startsWith("B")) return "b";
    if (g.startsWith("C")) return "c";
    if (g.startsWith("D")) return "d";
    return "f";
  }

  function getGradeRowClass(grade) {
    const g = normalizeFullGrade(grade);
    if (g.startsWith("SS")) return "gr-ss";
    if (g.startsWith("S")) return "gr-s";
    if (g.startsWith("A")) return "gr-a";
    if (g.startsWith("B")) return "gr-b";
    if (g.startsWith("C")) return "gr-c";
    if (g.startsWith("D")) return "gr-d";
    return "gr-f";
  }

  function paintOpCardByGrade(card, grade) {
    const g = normalizeFullGrade(grade);
    if (g.startsWith("SS")) {
      card.style.background = "linear-gradient(180deg, rgba(140,110,255,.16), rgba(255,255,255,.02))";
      card.style.borderColor = "rgba(160,130,255,.42)";
      card.style.boxShadow = "0 0 0 1px rgba(160,130,255,.10) inset, 0 0 18px rgba(140,110,255,.14)";
      return;
    }
    if (g.startsWith("S")) {
      card.style.background = "linear-gradient(180deg, rgba(255,215,0,.12), rgba(255,255,255,.02))";
      card.style.borderColor = "rgba(255,215,0,.38)";
      card.style.boxShadow = "0 0 0 1px rgba(255,215,0,.10) inset, 0 0 18px rgba(255,215,0,.10)";
      return;
    }
    if (g.startsWith("A")) {
      card.style.background = "linear-gradient(180deg, rgba(77,171,247,.12), rgba(255,255,255,.02))";
      card.style.borderColor = "rgba(77,171,247,.34)";
      card.style.boxShadow = "0 0 0 1px rgba(77,171,247,.08) inset, 0 0 18px rgba(77,171,247,.10)";
      return;
    }
    if (g.startsWith("B")) {
      card.style.background = "linear-gradient(180deg, rgba(81,207,102,.12), rgba(255,255,255,.02))";
      card.style.borderColor = "rgba(81,207,102,.32)";
      card.style.boxShadow = "0 0 0 1px rgba(81,207,102,.08) inset, 0 0 18px rgba(81,207,102,.10)";
      return;
    }
    if (g.startsWith("C")) {
      card.style.background = "linear-gradient(180deg, rgba(134,142,150,.12), rgba(255,255,255,.02))";
      card.style.borderColor = "rgba(134,142,150,.30)";
      card.style.boxShadow = "0 0 0 1px rgba(134,142,150,.08) inset, 0 0 18px rgba(134,142,150,.10)";
      return;
    }
    if (g.startsWith("D")) {
      card.style.background = "linear-gradient(180deg, rgba(255,146,43,.12), rgba(255,255,255,.02))";
      card.style.borderColor = "rgba(255,146,43,.30)";
      card.style.boxShadow = "0 0 0 1px rgba(255,146,43,.08) inset, 0 0 18px rgba(255,146,43,.10)";
      return;
    }
    card.style.background = "linear-gradient(180deg, rgba(255,107,107,.12), rgba(255,255,255,.02))";
    card.style.borderColor = "rgba(255,107,107,.30)";
    card.style.boxShadow = "0 0 0 1px rgba(255,107,107,.08) inset, 0 0 18px rgba(255,107,107,.10)";
  }

  // ===== GNB =====
  const gnbHtml = `
    <header class="gnb">
      <div class="gnb-shell">
        <div class="gnb-bar">
          <button class="gnb-hamburger" id="gnbHamburgerBtn" type="button" aria-label="메뉴 열기" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
          <div class="gnb-brand">
            <a href="${homeHref}" class="gnb-brand-name"><img src="https://loaviewer.github.io/favicon.ico" alt="" class="gnb-favicon"> 로아뷰<span class="gnb-brand-sub"> · LOA VIEWER</span></a>
          </div>
          <nav class="gnb-nav">
            <ul class="gnb-nav-list">
              <li class="gnb-nav-item">
                <a href="${homeHref}" class="gnb-link ${(isHome || isInfoPage) ? "active" : ""}">홈</a>
              </li>
              <li class="gnb-nav-item has-submenu">
                <button class="gnb-trigger ${isSimpleGroupActive ? "active" : ""}" type="button">잔혈컷 간편보기 <span class="gnb-caret">▼</span></button>
                <div class="gnb-dropdown">
                  <a href="${levelHref}" class="gnb-dropdown-link ${isLevelPage ? "active" : ""}">레벨별 보기</a>
                  <a href="${raidHref}" class="gnb-dropdown-link ${isRaidLevelPage ? "active" : ""}">레이드별 보기</a>
                </div>
              </li>
              <li class="gnb-nav-item has-submenu">
                <button class="gnb-trigger ${isPrecisionGroupActive ? "active" : ""}" type="button">⚡ 잔혈컷 정밀계산 <span class="gnb-caret">▼</span></button>
                <div class="gnb-dropdown">
                  <a href="${serkaHref}" class="gnb-dropdown-link ${isSerkaPage ? "active" : ""}">세르카</a>
                  <a href="${cathedralHref}" class="gnb-dropdown-link ${isCathedralPage ? "active" : ""}">지평의 성당</a>
                  <a href="${belgardinHref}" class="gnb-dropdown-link ${isBelgardinPage ? "active" : ""}">벨가르딘</a>
                  <a href="${guardianHref}" class="gnb-dropdown-link ${isGuardianPage ? "active" : ""}">가디언 토벌</a>
                  <a href="${extremeHref}" class="gnb-dropdown-link ${isExtremePage ? "active" : ""}">익스트림 ⚡</a>
                </div>
              </li>
             
              <li class="gnb-nav-item has-submenu">
                <button class="gnb-trigger ${isRankGroupActive ? "active" : ""}" type="button">직각 토너먼트 <span class="gnb-caret">▼</span></button>
                <div class="gnb-dropdown">
                  <a href="${rankHref}" class="gnb-dropdown-link ${isRank ? "active" : ""}">토너먼트 시작하기</a>
                  <a href="${rankingHref}" class="gnb-dropdown-link ${isRankingPage ? "active" : ""}">직각 랭킹보드</a>
                  <a href="${tierHref}" class="gnb-dropdown-link ${isTierPage ? "active" : ""}">티어표 (최근 10일)</a>
                  <a href="${winrateHref}" class="gnb-dropdown-link ${isWinratePage ? "active" : ""}">밸런스 승률표</a>
                  <a href="${classWinHref}" class="gnb-dropdown-link ${isClassWinPage ? "active" : ""}">클래스별 우승자 분석</a>
                  <a href="${historyHref}" class="gnb-dropdown-link ${isHistoryPage ? "active" : ""}">기간내 승률 변화 그래프</a>
                </div>
              </li>
              <li class="gnb-nav-item has-submenu">
                <button class="gnb-trigger ${isClassGroupActive ? "active" : ""}" type="button">클래스 정보 <span class="gnb-caret">▼</span></button>
                <div class="gnb-dropdown">
                  <a href="${synergyHref}" class="gnb-dropdown-link ${isSynergyPage ? "active" : ""}">시너지표</a>
                  <a href="${arcGridHref}" class="gnb-dropdown-link ${isArcGridPage ? "active" : ""}">아크그리드</a>
                  <a href="${arkPassiveHref}" class="gnb-dropdown-link ${isArkPassivePage ? "active" : ""}">아크패시브</a>
                  <span class="gnb-dropdown-link disabled" aria-disabled="true">캐릭터 정보 (준비중)</span>
                </div>
              </li>
              <li class="gnb-nav-item has-submenu">
                <button class="gnb-trigger ${isToolsGroupActive ? "active" : ""}" type="button">편의 도구 <span class="gnb-caret">▼</span></button>
                <div class="gnb-dropdown">
                  <a href="${auctionHref}" class="gnb-dropdown-link ${isAuctionPage ? "active" : ""}">경매 계산기</a>
                  <a href="${marketHref}" class="gnb-dropdown-link ${isMarketPage ? "active" : ""}">시세 정보</a>
                </div>
              </li>
            </ul>
          </nav>
          <div class="gnb-cta-group">
            <a href="${rankHref}" class="gnb-cta op">🏆 OP 토너먼트 참여</a>
            <a href="${rankHref}" class="gnb-cta like">💗 호감 토너먼트 참여</a>
          </div>
        </div>
      </div>
    </header>

    <div class="divider common-divider-top"><hr class="divider-line"></div>

    <div class="gnb-drawer-overlay" id="gnbDrawerOverlay"></div>
    <aside class="gnb-drawer" id="gnbDrawer" aria-hidden="true" inert>
      <div class="gnb-drawer-header">
        <a href="${homeHref}" class="gnb-drawer-brand"><img src="https://loaviewer.github.io/favicon.ico" alt="" class="gnb-favicon"> 로아뷰 <span class="gnb-drawer-brand-home ${(isHome || isInfoPage) ? "active" : ""}">· 홈으로</span></a>
        <button class="gnb-drawer-close" id="gnbDrawerClose" type="button" aria-label="메뉴 닫기">✕</button>
      </div>
      <nav class="gnb-drawer-nav">
        <div class="gnb-drawer-group">
          <div class="gnb-drawer-group-title">잔혈컷 간편보기</div>
          <div class="gnb-drawer-links-grid">
            <a href="${levelHref}" class="gnb-drawer-link ${isLevelPage ? "active" : ""}">레벨별 보기</a>
            <a href="${raidHref}" class="gnb-drawer-link ${isRaidLevelPage ? "active" : ""}">레이드별 보기</a>
          </div>
        </div>
        <div class="gnb-drawer-group">
          <div class="gnb-drawer-group-title">⚡ 잔혈컷 정밀계산</div>
          <div class="gnb-drawer-links-grid">
            <a href="${serkaHref}" class="gnb-drawer-link ${isSerkaPage ? "active" : ""}">세르카</a>
            <a href="${cathedralHref}" class="gnb-drawer-link ${isCathedralPage ? "active" : ""}">지평의 성당</a>
            <a href="${belgardinHref}" class="gnb-drawer-link ${isBelgardinPage ? "active" : ""}">벨가르딘</a>
            <a href="${guardianHref}" class="gnb-drawer-link ${isGuardianPage ? "active" : ""}">가디언 토벌</a>
            <a href="${extremeHref}" class="gnb-drawer-link ${isExtremePage ? "active" : ""}">익스트림 ⚡</a>
          </div>
        </div>
       
        <div class="gnb-drawer-group">
          <div class="gnb-drawer-group-title">직각 토너먼트</div>
          <div class="gnb-drawer-links-grid">
            <a href="${rankHref}" class="gnb-drawer-link ${isRank ? "active" : ""}">토너먼트 시작하기</a>
            <a href="${rankingHref}" class="gnb-drawer-link ${isRankingPage ? "active" : ""}">직각 랭킹보드</a>
            <a href="${tierHref}" class="gnb-drawer-link ${isTierPage ? "active" : ""}">티어표 (최근 10일)</a>
            <a href="${winrateHref}" class="gnb-drawer-link ${isWinratePage ? "active" : ""}">밸런스 승률표</a>
            <a href="${classWinHref}" class="gnb-drawer-link ${isClassWinPage ? "active" : ""}">클래스별 우승자 분석</a>
            <a href="${historyHref}" class="gnb-drawer-link ${isHistoryPage ? "active" : ""}">승률 변화 그래프</a>
          </div>
        </div>
        <div class="gnb-drawer-group">
          <div class="gnb-drawer-group-title">클래스 정보</div>
          <div class="gnb-drawer-links-grid">
            <a href="${synergyHref}" class="gnb-drawer-link ${isSynergyPage ? "active" : ""}">시너지표</a>
            <a href="${arcGridHref}" class="gnb-drawer-link ${isArcGridPage ? "active" : ""}">아크그리드</a>
            <a href="${arkPassiveHref}" class="gnb-drawer-link ${isArkPassivePage ? "active" : ""}">아크패시브</a>
            <span class="gnb-drawer-link disabled" aria-disabled="true">캐릭터 정보</span>
          </div>
        </div>
        <div class="gnb-drawer-group">
          <div class="gnb-drawer-group-title">편의 도구</div>
          <div class="gnb-drawer-links-grid">
            <a href="${auctionHref}" class="gnb-drawer-link ${isAuctionPage ? "active" : ""}">경매 계산기</a>
            <a href="${marketHref}" class="gnb-drawer-link ${isMarketPage ? "active" : ""}">시세 정보</a>
          </div>
        </div>
        <div class="gnb-drawer-group">
          <div class="gnb-drawer-group-title">도장 정보</div>
          <div class="gnb-drawer-links-grid">
            <button class="gnb-drawer-link" id="btnStampGuideMobile" type="button">🏅 도장 안내</button>
          </div>
        </div>
      </nav>
    </aside>

    <!-- 도장 안내 통합 모달 -->
    <div class="stamp-modal-overlay" id="stampGuideOverlay">
      <div class="stamp-modal-combined" role="dialog" aria-modal="true" aria-labelledby="stampGuideTitle">
        <div class="stamp-modal-header">
          <h3 id="stampGuideTitle">🏅 도장 안내</h3>
          <button class="stamp-modal-close" id="stampGuideClose" type="button" aria-label="닫기">✕</button>
        </div>
        <div class="stamp-modal-body" id="stampGuideBody">
          <div class="stamp-modal-loading">불러오는 중...</div>
        </div>
      </div>
    </div>
  `;

  // ===== 히어로 =====
  const heroExtraHtml = `
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-left">
          <div class="hero-eyebrow">LOA VIEWER</div>
         <div class="hero-title">데이터로 보는<br><span class="hl">로스트아크</span></div>
          <div class="hero-tags">
            <span class="hero-tag blood"><span class="tag-dot"></span>잔혈컷 · DPS</span>
            <span class="hero-tag tier"><span class="tag-dot"></span>직각 티어</span>
            <span class="hero-tag grid"><span class="tag-dot"></span>아크그리드</span>
          </div>
        </div>
        <div class="hero-right">
          <button class="stamp-guide-btn" id="btnStampGuide" type="button">🏅 도장 안내</button>
          <div class="stamp-rack">
            <div class="grade-stamp op">
              <div class="stamp-kicker">TOURNAMENT</div>
              <div class="stamp-title">OP</div>
              <div class="stamp-desc">직각 토너먼트 진입 후<br>시즌 도장 표시</div>
            </div>
            <div class="grade-stamp like-stamp">
              <div class="stamp-kicker">FAVORITE</div>
              <div class="stamp-title">호감</div>
              <div class="stamp-desc">호감 토너먼트 진입 후<br>참여 도장 표시</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <nav class="quickmenu">
      <div class="qm-row">
        <a href="${levelHref}" class="qm-item"><div class="qm-icon">💠</div><div class="qm-label">레벨별<br>잔혈컷</div></a>
        <a href="${belgardinHref}" class="qm-item"><div class="qm-icon">🧛</div><div class="qm-label">정밀 계산</div></a>
        <a href="${arcGridHref}" class="qm-item"><div class="qm-icon"><img src="https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_96.png" alt=""></div><div class="qm-label">아크그리드</div></a>
        <a href="${rankHref}" class="qm-item"><div class="qm-icon">🏆</div><div class="qm-label">직각<br>토너먼트</div></a>
        <a href="${marketHref}" class="qm-item"><div class="qm-icon">💹</div><div class="qm-label">시세정보</div></a>
        <a href="${auctionHref}" class="qm-item"><div class="qm-icon">🔨</div><div class="qm-label">경매계산기</div></a>
      </div>
    </nav>
    <div class="divider common-divider-bottom" style="margin-top:20px;"><hr class="divider-line"></div>
  `;

 const footerHtml = `
  <div style="border-top: 1px solid rgba(255,255,255,0.05); margin-top: 20px; padding-top: 15px; padding-bottom: 25px; font-size: 10px; color: #384967; line-height: 1.7; text-align: center;">
    <div>© 2026 LOA VIEWER · All Rights Reserved.</div>
    <div>Not associated with Smilegate RPG & Smilegate Stove.</div>
    <div>Data based on Google Sheets · Powered by Supabase · cloudtype · GitHub Pages · GoatCounter</div>
    <div style="margin-top: 6px; font-weight: bold;">
      <a href="${aboutHref}" style="color: #384967; text-decoration: none; margin-right: 8px; border-bottom: 1px solid #233044;">사이트 소개</a> |
      <a href="${guideHref}" style="color: #384967; text-decoration: none; margin: 0 8px; border-bottom: 1px solid #233044;">이용 가이드</a> |
      <a href="${privacyHref}" style="color: #384967; text-decoration: none; margin: 0 8px; border-bottom: 1px solid #233044;">개인정보처리방침</a> |
      <a href="#" data-open-inquiry style="color: #384967; text-decoration: none; margin: 0 8px; border-bottom: 1px solid #233044;">간편문의</a> |
<a href="${siteRoot}contact${ext}" style="color: #384967; text-decoration: none; margin: 0 8px; border-bottom: 1px solid #233044;">문의 페이지</a> |
<a href="mailto:dnjswjd10041@gmail.com" style="color: #384967; text-decoration: none; margin-left: 8px; border-bottom: 1px solid #233044;">이메일 문의</a>
    </div>
  </div>
`;

function loadInquiryScript() {
  if (document.querySelector('script[data-inquiry-script="true"]')) return;

  const script = document.createElement("script");
  script.type = "module";
  script.src = `${siteRoot}js/inquiry.js`;
  script.setAttribute("data-inquiry-script", "true");
  document.body.appendChild(script);
}

loadInquiryScript();



  const auroraHtml = `<div class="common-aurora"></div>`;

  shell.innerHTML = auroraHtml + gnbHtml + (showHero && !document.querySelector(".hero") ? heroExtraHtml : "");

  // ===== 스타일 =====
  if (!document.getElementById("stamp-modal-styles")) {
    const modalStyle = document.createElement("style");
    modalStyle.id = "stamp-modal-styles";
    modalStyle.textContent = `
      .gnb-cta-sub {
        background: transparent;
        border: 1px solid rgba(255,255,255,0.12);
        color: rgba(255,255,255,0.52);
        padding: 5px 10px;
        border-radius: 7px;
        font-size: 11px;
        line-height: 1;
        cursor: pointer;
        transition: all .18s ease;
        white-space: nowrap;
      }




.ad-refresh-wrap {
    position: relative;
    display: inline-block;
    max-width: 100%;
    line-height: 0;
}
.ad-refresh-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    width: 0%;
    background: rgba(255, 255, 255, 0.12);
    z-index: 10;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform linear; /* ★ 성능: width 대신 transform 애니메이션(합성 레이어 처리) */
}








.ad-slot-responsive {
    min-width: 320px;
    min-height: 100px;
}
@media (min-width: 1024px) {
    .ad-slot-responsive {
        min-height: 250px;
    }
}
.ad-slot-responsive.precision-slot {
    min-height: 100px;
}
@media (min-width: 1024px) {
    .ad-slot-responsive.precision-slot {
        min-height: 250px;
    }
}



      .gnb-cta-sub:hover {
        border-color: rgba(255,255,255,0.28);
        color: rgba(255,255,255,0.82);
        background: rgba(255,255,255,0.05);
      }
      .gnb-cta-divider {
        color: rgba(255,255,255,0.14);
        font-size: 14px;
        margin: 0 6px;
        user-select: none;
      }

      .stamp-modal-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.72);
        z-index: 10000;
        justify-content: center;
        align-items: flex-start;
        padding: 28px 14px;
        backdrop-filter: blur(4px);
        overflow-y: auto;
      }
      .stamp-modal-overlay.active { display: flex; }

      .stamp-modal-combined {
        background: #1a1f2e;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 14px;
        width: min(94vw, 700px);
        margin: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        overflow: hidden;
      }
      .stamp-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 22px 12px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        position: sticky;
        top: 0;
        background: #1a1f2e;
        z-index: 2;
      }
      .stamp-modal-header h3 {
        margin: 0;
        font-size: 16px;
        color: #fff;
        letter-spacing: -0.02em;
      }
      .stamp-modal-close {
        background: none;
        border: none;
        color: rgba(255,255,255,0.4);
        font-size: 18px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 6px;
        transition: all 0.2s;
      }
      .stamp-modal-close:hover {
        color: #fff;
        background: rgba(255,255,255,0.1);
      }
      .stamp-modal-body {
        padding: 18px 22px 24px;
      }
      .stamp-modal-loading {
        text-align: center;
        color: rgba(255,255,255,0.42);
        padding: 30px 0;
        font-size: 13px;
      }
      .stamp-guide-intro {
        font-size: 12.5px;
        color: rgba(255,255,255,0.48);
        margin-bottom: 18px;
        line-height: 1.5;
      }

      .grade-guide-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
      }
      .grade-guide-table th {
        background: rgba(255,255,255,0.035);
        color: rgba(255,255,255,0.48);
        padding: 8px 10px;
        text-align: left;
        font-weight: 600;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        position: sticky;
        top: 0;
        z-index: 1;
      }
      .grade-guide-table td {
        padding: 7px 10px;
        color: rgba(255,255,255,0.62);
        border-bottom: 1px solid rgba(255,255,255,0.035);
        line-height: 1.38;
        vertical-align: middle;
      }
      .guide-grade-cell {
        width: 48px;
        font-weight: 700;
        white-space: nowrap;
      }
      .guide-desc-cell { }
      .guide-ratio-cell {
        width: 150px;
        min-width: 150px;
      }
      .guide-ratio-wrap {
        display: flex;
        align-items: center;
        gap: 7px;
      }
      .guide-ratio-pct {
        width: 38px;
        text-align: right;
        font-size: 11px;
        color: rgba(255,255,255,0.74);
        flex-shrink: 0;
        font-variant-numeric: tabular-nums;
      }
      .guide-mini-bar {
        flex: 1;
        height: 8px;
        background: rgba(255,255,255,0.06);
        border-radius: 999px;
        overflow: hidden;
      }
      .guide-mini-fill {
        height: 100%;
        border-radius: 999px;
        transition: width .55s ease;
      }
      .guide-mini-fill.ss { background: linear-gradient(90deg, #8c6eff, #b49aff); }
      .guide-mini-fill.s  { background: linear-gradient(90deg, #ffd700, #ffe44d); }
      .guide-mini-fill.a  { background: linear-gradient(90deg, #4dabf7, #74c0fc); }
      .guide-mini-fill.b  { background: linear-gradient(90deg, #51cf66, #8ce99a); }
      .guide-mini-fill.c  { background: linear-gradient(90deg, #868e96, #adb5bd); }
      .guide-mini-fill.d  { background: linear-gradient(90deg, #ff922b, #ffa94d); }
      .guide-mini-fill.f  { background: linear-gradient(90deg, #ff6b6b, #ff8787); }

      .gr-ss .guide-grade-cell { color: #b49aff; }
      .gr-s  .guide-grade-cell { color: #ffd700; }
      .gr-a  .guide-grade-cell { color: #74c0fc; }
      .gr-b  .guide-grade-cell { color: #8ce99a; }
      .gr-c  .guide-grade-cell { color: #adb5bd; }
      .gr-d  .guide-grade-cell { color: #ffa94d; }
      .gr-f  .guide-grade-cell { color: #ff8787; }

      .grade-guide-note {
        margin-top: 12px;
        font-size: 11px;
        color: rgba(255,255,255,0.28);
        text-align: center;
        line-height: 1.5;
      }

      .gnb-drawer-nav button.gnb-drawer-link {
        background: none;
        border: 1px solid rgba(255,255,255,0.08);
        color: rgba(255,255,255,0.62);
        cursor: pointer;
        text-align: center;
        font-size: 13px;
        padding: 10px 8px;
        border-radius: 8px;
        transition: all 0.2s;
        width: 100%;
      }
      .gnb-drawer-nav button.gnb-drawer-link:hover {
        border-color: rgba(255,255,255,0.2);
        color: rgba(255,255,255,0.85);
        background: rgba(255,255,255,0.04);
      }

      @media (max-width: 760px) {
        .gnb-cta-sub, .gnb-cta-divider { display: none; }
        .stamp-modal-combined { width: 100%; border-radius: 12px; }
        .stamp-modal-header { padding: 14px 16px 10px; }
        .stamp-modal-body { padding: 14px 16px 20px; }
        .grade-guide-table { font-size: 11px; }
        .grade-guide-table td, .grade-guide-table th { padding: 6px 7px; }
        .guide-grade-cell { width: 40px; }
        .guide-desc-cell { font-size: 10.5px; }
        .guide-ratio-cell { width: 110px; min-width: 110px; }
        .guide-ratio-pct { width: 34px; font-size: 10px; }
      }
    `;
    document.head.appendChild(modalStyle);
  }

  // ===== 푸터 삽입 =====
const footerTarget =
  document.querySelector(".page") ||
  document.querySelector(".auction-page") ||
  document.querySelector(".tools-page") ||
  document.querySelector(".app") ||
  document.body;

const hasStaticFooter = document.getElementById("static-footer");

if (!hasStaticFooter) {
  footerTarget.insertAdjacentHTML("beforeend", footerHtml);
}

  // ===== 모바일 드로어 =====
  const hamburgerBtn = document.getElementById("gnbHamburgerBtn");
  const drawer = document.getElementById("gnbDrawer");
  const drawerOverlay = document.getElementById("gnbDrawerOverlay");
  const drawerCloseBtn = document.getElementById("gnbDrawerClose");

  function openDrawer() {
    document.body.classList.add("gnb-drawer-open");
    hamburgerBtn?.setAttribute("aria-expanded", "true");
    drawer?.setAttribute("aria-hidden", "false");
    drawer?.removeAttribute("inert"); // ★ 접근성: 열렸을 때만 포커스/상호작용 허용
  }

  function closeDrawer() {
    document.body.classList.remove("gnb-drawer-open");
    hamburgerBtn?.setAttribute("aria-expanded", "false");
    drawer?.setAttribute("aria-hidden", "true");
    drawer?.setAttribute("inert", ""); // ★ 접근성: 닫혔을 때 내부 포커스 가능 요소 완전 차단
  }

  hamburgerBtn?.addEventListener("click", () => {
    document.body.classList.contains("gnb-drawer-open") ? closeDrawer() : openDrawer();
  });

  drawerOverlay?.addEventListener("click", closeDrawer);
  drawerCloseBtn?.addEventListener("click", closeDrawer);

  drawer?.querySelectorAll("a.gnb-drawer-link:not(.disabled)").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeDrawer();
  });

  // ===== 모달 유틸 =====
  function openModal(id) {
    document.getElementById(id)?.classList.add("active");
  }
  function closeModal(id) {
    document.getElementById(id)?.classList.remove("active");
  }

  // ===== 도장 안내 모달 =====
  function buildCombinedTableHtml(counts, total) {
    let rows = "";

    const maxCount = Math.max(...GRADE_ORDER.map((g) => counts[g] || 0), 1);

    for (const grade of GRADE_ORDER) {
      const cls = getGradeRowClass(grade);
      const desc = GRADE_DESC[grade] || "";
      const count = counts[grade] || 0;
      const realPct = total > 0 ? ((count / total) * 100) : 0;
      const displayPct = realPct.toFixed(1);

      const relativeWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;
      const visualWidth = count > 0 ? Math.max(relativeWidth, 6) : 0;

      const barCls = getGradeBarClass(grade);

      rows += `
        <tr class="${cls}">
          <td class="guide-grade-cell">${grade}</td>
          <td class="guide-desc-cell">${desc}</td>
          <td class="guide-ratio-cell">
            <div class="guide-ratio-wrap">
              <span class="guide-ratio-pct">${displayPct}%</span>
              <div class="guide-mini-bar">
                <div class="guide-mini-fill ${barCls}" style="width:${visualWidth}%"></div>
              </div>
            </div>
          </td>
        </tr>
      `;
    }

    return `
      <table class="grade-guide-table">
        <thead>
          <tr>
            <th>등급</th>
            <th>설명</th>
            <th>비율</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="grade-guide-note">
        OP 토너먼트 누적 기준 · 막대는 최다 등급 대비 상대 비교<br>
        SS+ ~ S- 획득 시 메인 도장에 영구 유지됩니다.
      </p>
    `;
  }

  async function loadStampGuide() {
    const body = document.getElementById("stampGuideBody");
    if (!body) return;

    body.innerHTML = `
      <div class="stamp-guide-intro">
        토너먼트 결과에 따라 도장 등급이 부여됩니다.<br>
        SS ~ S 계열 등급은 메인 도장에 영구 유지됩니다.
      </div>
      <div class="stamp-modal-loading">등급표를 불러오는 중...</div>
    `;

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_grade_distribution`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        },
        body: JSON.stringify({
          p_type: "op",
          p_start_date: GRADE_DIST_START_DATE
        })
      });

      if (!res.ok) throw new Error(`RPC failed: ${res.status}`);

      const data = await res.json();

      const counts = {};
      GRADE_ORDER.forEach((g) => { counts[g] = 0; });
      let total = 0;

      if (Array.isArray(data)) {
        for (const row of data) {
          const g = normalizeFullGrade(row.grade);
          const c = parseInt(row.grade_count, 10) || 0;
          if (GRADE_ORDER.includes(g)) {
            counts[g] = c;
            total += c;
          }
        }
      }

      body.innerHTML = `
        <div class="stamp-guide-intro">
          토너먼트 결과에 따라 도장 등급이 부여됩니다.<br>
          SS ~ S 계열 등급은 메인 도장에 영구 유지됩니다.
        </div>
        ${buildCombinedTableHtml(counts, total)}
      `;
    } catch (e) {
      console.error("loadStampGuide error:", e);
      body.innerHTML = `
        <div class="stamp-guide-intro">
          토너먼트 결과에 따라 도장 등급이 부여됩니다.<br>
          SS ~ S 계열 등급은 메인 도장에 영구 유지됩니다.
        </div>
        <div class="stamp-modal-loading">도장 정보를 불러오지 못했어요.</div>
      `;
    }
  }

  // ===== 메인 도장 =====
  // 등급 도장이 유효한지(만료되지 않았는지) 확인하는 헬퍼 함수
  function isStampActive(grade, dateKey) {
    if (!grade || !dateKey) return false;
    const g = normalizeFullGrade(grade);
    const [y, m, d] = dateKey.split("-").map(Number);
    const baseDate = new Date(y, m - 1, d, 0, 0, 0, 0);
    const now = new Date();

    if (g.startsWith("SS")) {
      // SS등급: 획득한 달을 포함하여 3달째 되는 날의 말일 23:59:59초까지 유효
      const expireAt = new Date(baseDate.getFullYear(), baseDate.getMonth() + 3, 0, 23, 59, 59, 999);
      return now <= expireAt;
    }
    if (g.startsWith("S")) {
      // S등급: 획득한 달의 말일 23:59:59초까지 유효
      const expireAt = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0, 23, 59, 59, 999);
      return now <= expireAt;
    }
    return false;
  }

  async function applyHomeTournamentStamps() {
    if (!showHero) return;

    const opCard = document.querySelector(".grade-stamp.op");
    const favorCard = document.querySelector(".grade-stamp.like-stamp");
    if (!opCard && !favorCard) return;

    const visitorKey = getVisitorKey();
    if (!visitorKey) return;

    try {
      const url =
        `${SUPABASE_URL}/rest/v1/sessions` +
        `?select=tournament_type,grade,date_key` +
        `&visitor_key=eq.${encodeURIComponent(visitorKey)}` +
        `&order=date_key.desc`;

      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      });

      if (!res.ok) return;

      const data = await res.json();
      if (!Array.isArray(data) || !data.length) return;

      const todayKey = getDateKey();

      const todayOpRow = data.find(
        (r) => r.tournament_type === "op" && r.date_key === todayKey
      );

      const todayFavorRow = data.find(
        (r) => r.tournament_type === "favor" && r.date_key === todayKey
      );

      // S, SS 등급 중 '아직 유효기간이 만료되지 않은' 가장 높은 등급을 찾습니다.
      const bestOpRow = data
        .filter((r) => r.tournament_type === "op" && isPersistentGrade(r.grade) && isStampActive(r.grade, r.date_key))
        .sort((a, b) => {
          const aR = getGradeRank(a.grade);
          const bR = getGradeRank(b.grade);
          if (aR !== bR) return aR - bR;
          return String(b.date_key || "").localeCompare(String(a.date_key || ""));
        })[0];

      if (bestOpRow && opCard) {
        const g = normalizeFullGrade(bestOpRow.grade);
        opCard.innerHTML = `
          <div class="stamp-kicker">BEST GRADE</div>
          <div class="stamp-title">${g}</div>
          <div class="stamp-desc">${formatStampDate(bestOpRow.date_key)}<br>${g} 등급 유지중</div>
        `;
        paintOpCardByGrade(opCard, g);
      } else if (todayOpRow && opCard) {
        const g = normalizeFullGrade(todayOpRow.grade) || "완료";
        opCard.innerHTML = `
          <div class="stamp-kicker">TODAY STAMP</div>
          <div class="stamp-title">${g}</div>
          <div class="stamp-desc">${formatStampDate(todayOpRow.date_key)}<br>OP 참여 완료</div>
        `;
        paintOpCardByGrade(opCard, g);
      } else if (opCard) {
        // 만료된 등급도 없고 오늘 참여도 안 했다면 원래 기본 스탬프로 돌려놓습니다.
        opCard.innerHTML = `
          <div class="stamp-kicker">TOURNAMENT</div>
          <div class="stamp-title">OP</div>
          <div class="stamp-desc">직각 토너먼트 진입 후<br>시즌 도장 표시</div>
        `;
        // 카드 스타일도 기본으로 리셋
        opCard.style.background = "";
        opCard.style.borderColor = "";
        opCard.style.boxShadow = "";
      }

      if (todayFavorRow && favorCard) {
        favorCard.innerHTML = `
          <div class="stamp-kicker">TODAY STAMP</div>
          <div class="stamp-title">완료</div>
          <div class="stamp-desc">${formatStampDate(todayFavorRow.date_key)}<br>호감 참여 완료</div>
        `;
        favorCard.style.background = "linear-gradient(180deg, rgba(255,120,170,.12), rgba(255,255,255,.02))";
        favorCard.style.borderColor = "rgba(255,120,170,.32)";
        favorCard.style.boxShadow = "0 0 0 1px rgba(255,120,170,.08) inset, 0 0 18px rgba(255,120,170,.10)";
   
      } else if (favorCard) {
        // 오늘 호감 참여가 없다면 기본 상태로 돌려놓습니다.
        favorCard.innerHTML = `
          <div class="stamp-kicker">FAVORITE</div>
          <div class="stamp-title">호감</div>
          <div class="stamp-desc">호감 토너먼트 진입 후<br>참여 도장 표시</div>
        `;
        favorCard.style.background = "";
        favorCard.style.borderColor = "";
        favorCard.style.boxShadow = "";
      }


    } catch (e) {
      console.error("applyHomeTournamentStamps error:", e);
    }
  }

  applyHomeTournamentStamps();



  // ===== 모달 이벤트 =====
  document.getElementById("btnStampGuide")?.addEventListener("click", async () => {
    openModal("stampGuideOverlay");
    await loadStampGuide();
  });

  document.getElementById("btnStampGuideMobile")?.addEventListener("click", async () => {
    closeDrawer();
    openModal("stampGuideOverlay");
    await loadStampGuide();
  });

  document.getElementById("stampGuideClose")?.addEventListener("click", () => {
    closeModal("stampGuideOverlay");
  });

  document.getElementById("stampGuideOverlay")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal("stampGuideOverlay");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawer();
      closeModal("stampGuideOverlay");
    }
  });
});

/* =============================================
   좌우 고정 사이드 레일 광고 (인벤 스타일 anchor rail)
   - position: fixed 로 화면에 붙어서 스크롤해도 항상 같은 위치에 유지
   - 브라우저 화면 끝이 아니라, 실제 본문 박스(.app 등) 바로 옆에 붙임
   - 창 크기에 따라 300x600 → 160x600 → 120x600 순으로 자동 축소, 그마저
     안 들어가면 숨김
   - 자리가 있는 걸 확인한 뒤에만 최초 1회 display() 호출 (낭비 노출 방지)
   - 이미 표시된 뒤 사이즈 구간이 바뀔 때만 refresh() (같은 사이즈로 다시
     나타날 땐 재요청 없이 그대로 노출)
   - 왼쪽: loaview_side_left 슬롯 / 오른쪽: loaview_side2 슬롯 (55초 새로고침)
   ============================================= */
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("anchorRailLeft")) return; // 중복 삽입 방지

  window.googletag = window.googletag || { cmd: [] };

  const MIN_RAIL_GAP = 16;   // 사이즈 전환 직전 최소 간격
  const MAX_RAIL_GAP = 150;  // 여유 있을 때 최대 간격
  const EDGE_MARGIN = 8;     // 화면 맨 끝과 광고 사이 최소 여백
  const RAIL_SIZES = [
    { width: 300, height: 600 },
    { width: 160, height: 600 },
    { width: 120, height: 600 },
  ];

  function pickRailSize(availableMargin) {
    for (const size of RAIL_SIZES) {
      if (availableMargin >= size.width + MIN_RAIL_GAP) return size;
    }
    return null; // 어떤 사이즈도 들어갈 자리가 없음
  }

  function computeRailGap(availableMargin, sizeWidth) {
    const raw = availableMargin - sizeWidth;
    return Math.max(MIN_RAIL_GAP, Math.min(MAX_RAIL_GAP, raw));
  }




  function makeRail(id, className, slotId) {
    const el = document.createElement("div");
    el.id = id;
    el.className = "anchor-side-rail " + className;

    // 처음부터 숨기고 투명하게 시작 → 나중에 나타날 때 점프 방지
    el.style.display = "none";
    el.style.opacity = "0";

    const adDiv = document.createElement("div");
    adDiv.id = slotId;
    el.appendChild(adDiv);

    document.body.appendChild(el);

    return { el, adDiv, slotId, currentSize: null, displayed: false };
  }


  const leftState = makeRail("anchorRailLeft", "anchor-side-rail-left", "div-gpt-ad-1788637852218-0");
  const rightState = makeRail("anchorRailRight", "anchor-side-rail-right", "div-gpt-ad-1788638017126-0");


  function applyRailSize(state, size) {
    const sizeChanged =
      !state.currentSize ||
      state.currentSize.width !== size.width ||
      state.currentSize.height !== size.height;

    // 크기 먼저 설정
    state.el.style.width = size.width + "px";
    state.adDiv.style.minWidth = size.width + "px";
    state.adDiv.style.minHeight = size.height + "px";

    // 보이기 전에 투명하게 준비 → 갑자기 튀어나오는 느낌 줄임
    if (state.el.style.display === "none" || !state.displayed) {
      state.el.style.opacity = "0";
      state.el.style.display = "block";
      // 다음 프레임에 부드럽게 나타나게
      requestAnimationFrame(() => {
        state.el.style.transition = "opacity 0.15s ease";
        state.el.style.opacity = "1";
      });
    } else {
      state.el.style.display = "block";
      state.el.style.opacity = "1";
    }

    if (!state.displayed) {
      state.displayed = true;
      state.currentSize = size;
      const slotId = state.slotId;
      googletag.cmd.push(function () {
        googletag.display(slotId);
      });
    } else if (sizeChanged) {
      state.currentSize = size;
      const slotId = state.slotId;
      googletag.cmd.push(function () {
        const slot = googletag
          .pubads()
          .getSlots()
          .find((s) => s.getSlotElementId() === slotId);
        if (slot) googletag.pubads().refresh([slot]);
      });
    }
  }

  function hideRail(state) {
    // 바로 숨기지 말고 투명하게 만든 뒤 숨김 → 레이아웃 점프 줄임
    state.el.style.transition = "opacity 0.12s ease";
    state.el.style.opacity = "0";
    setTimeout(() => {
      state.el.style.display = "none";
      state.el.style.transition = "";
    }, 130);
  }



  // ----- 본문 박스 옆에 레일 위치 맞추기 -----
  function getContentRefEl() {
    return (
      document.querySelector(".app") ||
      document.querySelector(".gnb-shell") ||
      document.querySelector(".content-grid") ||
      document.querySelector("main")
    );
  }

  function positionAnchorRails() {
    const refEl = getContentRefEl();
    if (!refEl) {
      hideRail(leftState);
      hideRail(rightState);
      return;
    }

    const rect = refEl.getBoundingClientRect();

    // 왼쪽 레일
    const leftMargin = rect.left - EDGE_MARGIN;
    const leftSize = pickRailSize(leftMargin);
    if (!leftSize) {
      hideRail(leftState);
    } else {
      const leftGap = computeRailGap(leftMargin, leftSize.width);
      leftState.el.style.left = rect.left - leftGap - leftSize.width + "px";
      applyRailSize(leftState, leftSize);
    }

    // 오른쪽 레일
    const rightMargin = window.innerWidth - rect.right - EDGE_MARGIN;
    const rightSize = pickRailSize(rightMargin);
    if (!rightSize) {
      hideRail(rightState);
    } else {
      const rightGap = computeRailGap(rightMargin, rightSize.width);
      rightState.el.style.left = rect.right + rightGap + "px";
      applyRailSize(rightState, rightSize);
    }
  }

 

  let resizeRaf = null;
  let resizeTimer = null;

  function schedulePositionUpdate() {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(() => {
      resizeRaf = null;
      // 창 크기가 빠르게 바뀔 때 너무 자주 계산하지 않게 살짝 딜레이
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        positionAnchorRails();
      }, 80);
    });
  }

  // 처음 한 번만 바로 계산
  positionAnchorRails();

  // 폰트/이미지 로드 후 한 번 더 안전하게 재계산
  setTimeout(positionAnchorRails, 400);
  setTimeout(positionAnchorRails, 1200);

  window.addEventListener("resize", schedulePositionUpdate);
});






// ===== 구글 애드매니저(GAM) 라이브러리 및 광고 정의 동적 로드 =====

if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
  const autoAdsScript = document.createElement("script");
  autoAdsScript.async = true;
  autoAdsScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6403244403995841";
  autoAdsScript.crossOrigin = "anonymous";
  document.head.appendChild(autoAdsScript);
}

if (!document.querySelector('script[src*="gpt.js"]')) {
  const gptScript = document.createElement("script");
  gptScript.async = true;
  gptScript.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
  document.head.appendChild(gptScript);
}



window.googletag = window.googletag || {cmd: []};
googletag.cmd.push(function() {
  // 정밀계산 그룹(세르카/지평/벨가르딘/가디언토벌) 포함 전체 페이지: 970x250까지 허용
  const topAllSizes = [[970, 250], [728, 90], [320, 100], [320, 50]];

  const topMapping = googletag.sizeMapping()
    .addSize([1024, 0], [[970, 250], [728, 90]])
    .addSize([0, 0], [[320, 100], [320, 50]])
    .build();

  googletag.defineSlot('/23371069561/loaview_top_refresh', topAllSizes, 'div-gpt-ad-1788303186629-0')
    .defineSizeMapping(topMapping)
    .addService(googletag.pubads());

  // 좌/우 사이드 레일: 300x600 → 160x600 → 120x600 (본문 1180px 기준)
  // viewport >= 1180 + 2*(adWidth+16) + ~20
  const railSizeMapping = googletag.sizeMapping()
    .addSize([1832, 0], [[300, 600]])
    .addSize([1552, 0], [[160, 600]])
    .addSize([1472, 0], [[120, 600]])
    .addSize([0, 0], [])
    .build();

  googletag.defineSlot('/23371069561/loaview_side_left', [[300, 600], [160, 600], [120, 600]], 'div-gpt-ad-1788637852218-0')
    .defineSizeMapping(railSizeMapping)
    .addService(googletag.pubads());

  // 신규: 우측 사이드 세로 광고 (loaview_side2)
  googletag.defineSlot('/23371069561/loaview_side2', [[300, 600], [160, 600], [120, 600]], 'div-gpt-ad-1788638017126-0')
    .defineSizeMapping(railSizeMapping)
    .addService(googletag.pubads());

  googletag.setConfig({ singleRequest: true });
  googletag.enableServices();

  // ===== 자동 새로고침 + 진행바 (슬롯별 주기 다르게 지정 가능, 화면에 보일 때만) =====
  const DEFAULT_REFRESH_INTERVAL = 55000;
  // 슬롯 div ID별로 새로고침 주기를 다르게 주고 싶으면 여기에 추가
  const SLOT_REFRESH_INTERVALS = {
    'div-gpt-ad-1788637852218-0': 45000, // 좌측 사이드: 45초
    'div-gpt-ad-1788638017126-0': 45000, // 우측 사이드: 45초
  };
  function getRefreshInterval(slotId) {
    return SLOT_REFRESH_INTERVALS[slotId] || DEFAULT_REFRESH_INTERVAL;
  }
  const refreshTargets = {};

  const allSlots = googletag.pubads().getSlots();
  const pendingSlotIds = new Set(allSlots.map(s => s.getSlotElementId()));

 


function startBarAnimation(bar, intervalMs) {
    const targetWidth = bar.dataset.targetWidth || "100%";
    const duration = intervalMs || DEFAULT_REFRESH_INTERVAL;
    // ★ 성능: width 대신 transform(scaleX)을 애니메이션해 합성 레이어에서 처리되게 함
    bar.style.width = targetWidth;
    bar.style.transformOrigin = "left";
    bar.style.transition = "none";
    bar.style.transform = "scaleX(0)";
    void bar.offsetWidth;
    bar.style.transition = `transform ${duration / 1000}s linear`;
    bar.style.transform = "scaleX(1)";
  }
  // ① observer2를 먼저 선언 (setupSlotBar보다 위에 있어야 함)

const observer2 = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.id;
      if (refreshTargets[id]) {
        refreshTargets[id].visible = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (refreshTargets[id].loaded) {           // ← 광고 로드된 뒤에만 애니메이션 시작
            startBarAnimation(refreshTargets[id].bar, refreshTargets[id].interval);
          }
        } else {
          refreshTargets[id].bar.style.transition = "none";
          refreshTargets[id].bar.style.transform = "scaleX(0)"; // ★ 성능: width 대신 transform 초기화
          refreshTargets[id].elapsed = 0;
        }
      }
    });
  }, { threshold: 0.5 });




  // ② 슬롯 하나를 등록하는 함수

function alignBarToAd(wrap, bar, el) {
    const iframe = el.querySelector('iframe');
    const wrapRect = wrap.getBoundingClientRect();
    const targetRect = iframe ? iframe.getBoundingClientRect() : el.getBoundingClientRect();

    if (targetRect.width === 0 && targetRect.height === 0) return; // 아직 렌더링 전이면 계산 스킵

    bar.style.top = (targetRect.top - wrapRect.top) + "px";
    bar.style.left = (targetRect.left - wrapRect.left) + "px";
    bar.style.right = "auto";

    // 실제 광고 너비를 기억해뒀다가 애니메이션에 사용
    bar.dataset.targetWidth = targetRect.width + "px";
    if (bar.style.transition === "none" || !bar.style.transition) {
        bar.style.width = targetRect.width + "px";
    }
}

function setupSlotBar(slot, el) {
    const slotId = slot.getSlotElementId();
    if (refreshTargets[slotId]) return;

    const wrap = document.createElement("div");
    wrap.className = "ad-refresh-wrap";
    wrap.style.display = "inline-block";
    wrap.style.verticalAlign = "top";
    wrap.style.maxWidth = "100%";
    wrap.style.lineHeight = "0";

    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);

    const bar = document.createElement("div");
    bar.className = "ad-refresh-bar";
    bar.style.display = "none"; // 광고 로드 전에는 완전히 숨김 (겹침/긴 막대 현상 방지)
    wrap.appendChild(bar);

   refreshTargets[slotId] = { slot, visible: false, bar, wrap, el, loaded: false, interval: getRefreshInterval(slotId), elapsed: 0 };
    observer2.observe(el);

  



    let rafPending = false;
    let alignTimer = null;

    function scheduleAlign() {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
            rafPending = false;
            // 너무 자주 계산하지 않게 약간의 딜레이 추가
            clearTimeout(alignTimer);
            alignTimer = setTimeout(() => {
                alignBarToAd(wrap, bar, el);
            }, 50);
        });
    }

    // 크기 변화만 감시 (기존보다 가볍게)
    const resizeObs = new ResizeObserver(() => {
      scheduleAlign();
    });
    resizeObs.observe(el);

    // 자식이 추가/삭제될 때만 감시 (속성 변화까지 일일이 보지 않음 → 부하 감소)
    const subtreeWatcher = new MutationObserver(() => scheduleAlign());
    subtreeWatcher.observe(el, {
        childList: true,
        subtree: true
    });






    pendingSlotIds.delete(slotId);
  }

  // ③ 이미 있는 슬롯은 바로 등록
  allSlots.forEach(slot => {
    const slotId = slot.getSlotElementId();
    const el = document.getElementById(slotId);
    if (el) setupSlotBar(slot, el);
  });

  // ④ 아직 없는 슬롯(정밀계산 페이지 등)은 나타날 때까지 지켜봄
  if (pendingSlotIds.size > 0) {
    const domWatcher = new MutationObserver(() => {
      allSlots.forEach(slot => {
        const slotId = slot.getSlotElementId();
        if (!pendingSlotIds.has(slotId)) return;
        const el = document.getElementById(slotId);
        if (el) setupSlotBar(slot, el);
      });
      if (pendingSlotIds.size === 0) domWatcher.disconnect();
    });
    domWatcher.observe(document.body, { childList: true, subtree: true });
  }

  // ⑤ 광고가 완전히 로드된 직후 바 시작
  googletag.pubads().addEventListener('slotRenderEnded', (event) => {
    const slotId = event.slot.getSlotElementId();
    const target = refreshTargets[slotId];
    if (target) {
      requestAnimationFrame(() => {
        alignBarToAd(target.wrap, target.bar, target.el);
        target.loaded = true;
        target.bar.style.display = "block";
        if (target.visible) {
          startBarAnimation(target.bar, target.interval);
        }
      });
    }
  });

  // ⑥ 주기적으로 새로고침 (슬롯별 interval 다르게 지원, 보이는 슬롯만) + 바 재시작
  const HEARTBEAT_MS = 1000;
  setInterval(() => {
    // 탭이 백그라운드(알탭/다른 창)일 때는 새로고침 카운트 자체를 멈춤
    // → 사용자가 실제로 보고 있지 않은 노출에 대해 광고를 새로고침하지 않도록 방지
    if (document.hidden) return;

    const dueTargets = [];
    Object.values(refreshTargets).forEach(t => {
      if (!t.visible) return;
      t.elapsed += HEARTBEAT_MS;
      if (t.elapsed >= t.interval) {
        t.elapsed = 0;
        dueTargets.push(t);
      }
    });
    if (dueTargets.length > 0) {
      googletag.pubads().refresh(dueTargets.map(t => t.slot));
      dueTargets.forEach(t => startBarAnimation(t.bar, t.interval));
    }
  }, HEARTBEAT_MS);

  // 탭이 다시 보이게 됐을 때, 숨겨져 있던 동안의 진행 바가 어색하게 점프하지 않도록
  // 보이는 슬롯들의 진행 바를 다시 처음부터 자연스럽게 시작
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) return;
    Object.values(refreshTargets).forEach(t => {
      if (t.visible && t.loaded) {
        t.elapsed = 0;
        startBarAnimation(t.bar, t.interval);
      }
    });
  });

});

  





// ===== 토너먼트 히어로 아래 광고 + 구분선 자동 삽입 =====
document.addEventListener("DOMContentLoaded", () => {

const tourneyHero = document.querySelector(".tournament-hero, .winrate-hero, .tier-hero, .ranking-hero, .history-hero, .classwin-hero, .synergy-hero, .hero-arc-grid, .hero-arc-passive,  .market-hero");

  if (tourneyHero && !document.getElementById("tourney-ad-wrapper")) {
    const adBox = document.createElement("div");
    adBox.id = "tourney-ad-wrapper";
  

  adBox.style.cssText = "width:100%;max-width:100%;overflow:hidden;box-sizing:border-box;display:flex;justify-content:center;align-items:center;margin:14px auto 14px;min-height:90px;";
    const isPrecisionForTop = /\/dps\/(serka|cathedral|belgardin|guardian)(\.html)?$/.test(location.pathname);
    adBox.innerHTML = `
      <div id="div-gpt-ad-1788303186629-0" class="ad-slot-responsive${isPrecisionForTop ? ' precision-slot' : ''}" style="max-width:100%;overflow:hidden;"></div>
    `;

    tourneyHero.parentNode.insertBefore(adBox, tourneyHero.nextSibling);

    const divider = document.createElement("div");
    divider.className = "divider common-divider-bottom";
    divider.style.cssText = "margin-top:14px;margin-bottom:16px;";
    divider.innerHTML = '<hr class="divider-line">';
    adBox.parentNode.insertBefore(divider, adBox.nextSibling);

    try {
      googletag.cmd.push(function() {
        googletag.display('div-gpt-ad-1788303186629-0');
      });
    } catch (e) {}
  }
});


// ===== 하단 배너 (푸터 위) - 애드센스로 교체, 새로고침 없음 =====
document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector(".common-footer") || document.querySelector("footer") || document.querySelector("[style*='border-top']");
  if (footer && !document.getElementById("bottom-ad-wrapper")) {
    const adBox = document.createElement("div");
    adBox.id = "bottom-ad-wrapper";

    adBox.style.cssText = "width:100%;max-width:1200px;display:flex;justify-content:center;align-items:center;margin:20px auto 14px;min-height:90px;width:100%;";

    // 로아뷰_가로배너_공통 (애드센스, 새로고침 없음)
    adBox.innerHTML = `
      <ins class="adsbygoogle"
           style="display:block;width:100%;"
           data-ad-client="ca-pub-6403244403995841"
           data-ad-slot="3822424969"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    `;

   // DOMContentLoaded 시점에
footer.prepend(adBox);

window.adsbygoogle = window.adsbygoogle || [];
window.adsbygoogle.push({});  // ← 바로 push

  }
});
