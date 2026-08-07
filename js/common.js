// console.log("common.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const shell = document.getElementById("common-shell");
  if (!shell) return;

  const rawPath = location.pathname;

  const isLocalhost =
    location.hostname === "127.0.0.1" ||
    location.hostname === "localhost";

  function cleanPathname(pathname) {
    // 루트 홈
    if (pathname === "/index.html" || pathname === "/index") return "/";

    // 하위 폴더의 index
    if (pathname.endsWith("/index.html")) {
      return pathname.slice(0, -10) + "/";
    }

    if (pathname.endsWith("/index")) {
      return pathname.slice(0, -5) + "/";
    }

    // 일반 .html 제거
    if (pathname.endsWith(".html")) {
      return pathname.slice(0, -5);
    }

    return pathname;
  }

  // 로컬에서는 .html 유지 / 배포에서는 .html 없는 주소로 정리
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
    return (
      path === target ||
      path === `${target}/` ||
      path === `${target}.html`
    );
  }

  const isDps = path.includes("/dps/");
  const isRank = matchesPath("/rank");
  const isTools = path.includes("/tools/");
  const isClass = path.includes("/class/");
  const isRankDir = path.includes("/rank/");
  const isStandaloneDpsPage = document.body.classList.contains("standalone-dps-page");

  const isHome =
    !isDps &&
    !isRank &&
    !isTools &&
    matchesPath("/");

  // 현재 페이지 판별
  const isLevelPage = matchesPath("/dps/level");
  const isRaidLevelPage = matchesPath("/dps/raid");
  const isSerkaPage = matchesPath("/dps/serka");
  const isCathedralPage = matchesPath("/dps/cathedral");
  const isBelgardinPage = matchesPath("/dps/belgardin");
  const isGuardianPage = matchesPath("/dps/guardian");

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
    matchesPath("/about") ||
    matchesPath("/guide") ||
    matchesPath("/privacy");

  const isSimpleGroupActive = isLevelPage || isRaidLevelPage;
  const isPrecisionGroupActive = isSerkaPage || isCathedralPage || isBelgardinPage || isGuardianPage;
  const isClassGroupActive = isSynergyPage || isArcGridPage || isArkPassivePage;
  const isToolsGroupActive = isAuctionPage || isMarketPage;

  const isRankGroupActive =
    isRank ||
    isRankingPage ||
    isTierPage ||
    isWinratePage ||
    isClassWinPage ||
    isHistoryPage ||
    isRankDir;

  // 링크
  const homeHref = isLocalhost ? `${siteRoot}index.html` : `${siteRoot}`;
  const dpsHref = isLocalhost ? `${siteRoot}dps/index.html` : `${siteRoot}dps/`;
  const rankHref = `${siteRoot}rank${ext}`;

  const levelHref = `${siteRoot}dps/level${ext}`;
  const raidHref = `${siteRoot}dps/raid${ext}`;

  const serkaHref = `${siteRoot}dps/serka${ext}`;
  const cathedralHref = `${siteRoot}dps/cathedral${ext}`;
  const belgardinHref = `${siteRoot}dps/belgardin${ext}`;
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

  // ===== GNB (모든 페이지 공통) =====
  const gnbHtml = `
    <header class="gnb">
      <div class="gnb-shell">
        <div class="gnb-bar">
          <button class="gnb-hamburger" id="gnbHamburgerBtn" type="button" aria-label="메뉴 열기" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>

          <div class="gnb-brand">
            <a href="${homeHref}" class="gnb-brand-name"><img src="https://loaviewer.github.io/favicon.ico" alt="로아뷰" class="gnb-favicon"> 로아뷰<span class="gnb-brand-sub"> · LOA VIEWER</span></a>
          </div>

          <nav class="gnb-nav">
            <ul class="gnb-nav-list">
            
              <li class="gnb-nav-item">
                <a href="${homeHref}" class="gnb-link ${(isHome || isInfoPage) ? "active" : ""}">홈</a>
              </li>

              <li class="gnb-nav-item has-submenu">
                <button class="gnb-trigger ${isSimpleGroupActive ? "active" : ""}" type="button">
                  잔혈컷 간편보기 <span class="gnb-caret">▼</span>
                </button>
                <div class="gnb-dropdown">
                  <a href="${levelHref}" class="gnb-dropdown-link ${isLevelPage ? "active" : ""}">레벨별 보기</a>
                  <a href="${raidHref}" class="gnb-dropdown-link ${isRaidLevelPage ? "active" : ""}">레이드별 보기</a>
                </div>
              </li>

              <li class="gnb-nav-item has-submenu">
                <button class="gnb-trigger ${isPrecisionGroupActive ? "active" : ""}" type="button">
                  잔혈컷 정밀계산 <span class="gnb-caret">▼</span>
                </button>
                <div class="gnb-dropdown">
                  <a href="${serkaHref}" class="gnb-dropdown-link ${isSerkaPage ? "active" : ""}">세르카</a>
                  <a href="${cathedralHref}" class="gnb-dropdown-link ${isCathedralPage ? "active" : ""}">지평의 성당</a>
                  <a href="${belgardinHref}" class="gnb-dropdown-link ${isBelgardinPage ? "active" : ""}">벨가르딘</a>
                  <a href="${guardianHref}" class="gnb-dropdown-link ${isGuardianPage ? "active" : ""}">가디언 토벌</a>
                </div>
              </li>

              <li class="gnb-nav-item has-submenu">
                <button class="gnb-trigger" type="button">
                  직업별 DPS컷 <span class="gnb-caret">▼</span>
                </button>
                <div class="gnb-dropdown">
                  <a href="javascript:void(0)" class="gnb-dropdown-link disabled">허수 배율 계산 (준비중)</a>
                  <a href="javascript:void(0)" class="gnb-dropdown-link disabled">DPS값 계산 (준비중)</a>
                </div>
              </li>

              <li class="gnb-nav-item has-submenu">
                <button class="gnb-trigger ${isRankGroupActive ? "active" : ""}" type="button">
                  직각 토너먼트 <span class="gnb-caret">▼</span>
                </button>
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
                <button class="gnb-trigger ${isClassGroupActive ? "active" : ""}" type="button">
                  클래스 정보 <span class="gnb-caret">▼</span>
                </button>
                <div class="gnb-dropdown">
                  <a href="${synergyHref}" class="gnb-dropdown-link ${isSynergyPage ? "active" : ""}">시너지표</a>
                  <a href="${arcGridHref}" class="gnb-dropdown-link ${isArcGridPage ? "active" : ""}">아크그리드</a>
                  <a href="${arkPassiveHref}" class="gnb-dropdown-link ${isArkPassivePage ? "active" : ""}">아크패시브</a>
                  <a href="javascript:void(0)" class="gnb-dropdown-link disabled">캐릭터 정보 (준비중)</a>
                </div>
              </li>

              <li class="gnb-nav-item has-submenu">
                <button class="gnb-trigger ${isToolsGroupActive ? "active" : ""}" type="button">
                  편의 도구 <span class="gnb-caret">▼</span>
                </button>
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
    <aside class="gnb-drawer" id="gnbDrawer" aria-hidden="true">
      <div class="gnb-drawer-header">
        <a href="${homeHref}" class="gnb-drawer-brand"><img src="https://loaviewer.github.io/favicon.ico" alt="로아뷰" class="gnb-favicon"> 로아뷰 <span class="gnb-drawer-brand-home ${(isHome || isInfoPage) ? "active" : ""}">· 홈으로</span></a>
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
          <div class="gnb-drawer-group-title">잔혈컷 정밀계산</div>
          <div class="gnb-drawer-links-grid">
            <a href="${serkaHref}" class="gnb-drawer-link ${isSerkaPage ? "active" : ""}">세르카</a>
            <a href="${cathedralHref}" class="gnb-drawer-link ${isCathedralPage ? "active" : ""}">지평의 성당</a>
            <a href="${belgardinHref}" class="gnb-drawer-link ${isBelgardinPage ? "active" : ""}">벨가르딘</a>
            <a href="${guardianHref}" class="gnb-drawer-link ${isGuardianPage ? "active" : ""}">가디언 토벌</a>
          </div>
        </div>

        <div class="gnb-drawer-group">
          <div class="gnb-drawer-group-title">직업별 DPS컷</div>
          <div class="gnb-drawer-links-grid">
            <a href="javascript:void(0)" class="gnb-drawer-link disabled">허수 배율 계산 (준비중)</a>
            <a href="javascript:void(0)" class="gnb-drawer-link disabled">DPS값 계산 (준비중)</a>
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
            <a href="javascript:void(0)" class="gnb-drawer-link disabled">캐릭터 정보</a>
          </div>
        </div>

        <div class="gnb-drawer-group">
          <div class="gnb-drawer-group-title">편의 도구</div>
          <div class="gnb-drawer-links-grid">
            <a href="${auctionHref}" class="gnb-drawer-link ${isAuctionPage ? "active" : ""}">경매 계산기</a>
            <a href="${marketHref}" class="gnb-drawer-link ${isMarketPage ? "active" : ""}">시세 정보</a>
          </div>
        </div>
      </nav>
    </aside>
  `;

  // ===== 히어로 + 빠른메뉴 =====
  const heroExtraHtml = `
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-left">
          <div class="hero-eyebrow">LOA VIEWER</div>
          <h1 class="hero-title">데이터로 보는<br><span class="hl">로스트아크</span></h1>
          <div class="hero-tags">
            <span class="hero-tag blood"><span class="tag-dot"></span>잔혈컷 · DPS</span>
            <span class="hero-tag tier"><span class="tag-dot"></span>직각 티어</span>
            <span class="hero-tag grid"><span class="tag-dot"></span>아크그리드</span>
          </div>
        </div>

        <div class="hero-right">
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
        <a href="${levelHref}" class="qm-item">
          <div class="qm-icon">💠</div>
          <div class="qm-label">레벨별<br>잔혈컷</div>
        </a>

        <a href="${belgardinHref}" class="qm-item">
          <div class="qm-icon">🧛</div>
          <div class="qm-label">정밀 계산</div>
        </a>

        <a href="${arcGridHref}" class="qm-item">
          <div class="qm-icon">
            <img src="https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_96.png" alt="">
          </div>
          <div class="qm-label">아크그리드</div>
        </a>

        <a href="${rankHref}" class="qm-item">
          <div class="qm-icon">🏆</div>
          <div class="qm-label">직각<br>토너먼트</div>
        </a>

        <a href="${marketHref}" class="qm-item">
          <div class="qm-icon">💹</div>
          <div class="qm-label">시세정보</div>
        </a>

        <a href="${auctionHref}" class="qm-item">
          <div class="qm-icon">🔨</div>
          <div class="qm-label">경매계산기</div>
        </a>
      </div>
    </nav>

    <div class="divider common-divider-bottom" style="margin-top:20px;"><hr class="divider-line"></div>
  `;

  // ===== 푸터 (공통) =====
  const footerHtml = `
    <div style="border-top: 1px solid rgba(255,255,255,0.05); margin-top: 20px; padding-top: 15px; padding-bottom: 25px; font-size: 10px; color: #384967; line-height: 1.7; text-align: center;">
        <div>© 2026 LOA VIEWER · All Rights Reserved.</div>
        <div>Not associated with Smilegate RPG & Smilegate Stove.</div>
        <div>Data based on Google Sheets · Powered by Supabase · cloudtype · GitHub Pages · GoatCounter</div>
        <div style="margin-top: 6px; font-weight: bold;">
            <a href="${aboutHref}" style="color: #384967; text-decoration: none; margin-right: 8px; border-bottom: 1px solid #233044;">사이트 소개</a> |
            <a href="${guideHref}" style="color: #384967; text-decoration: none; margin: 0 8px; border-bottom: 1px solid #233044;">이용 가이드</a> |
            <a href="${privacyHref}" style="color: #384967; text-decoration: none; margin: 0 8px; border-bottom: 1px solid #233044;">개인정보처리방침</a> |
            <a href="mailto:dnjswjd10041@gmail.com" style="color: #384967; text-decoration: none; margin-left: 8px; border-bottom: 1px solid #233044;">이메일 문의</a>
        </div>
    </div>
  `;

  const auroraHtml = `
    <div class="common-aurora"></div>
  `;

  shell.innerHTML = auroraHtml + gnbHtml + (showHero ? heroExtraHtml : "");

  async function applyHomeTournamentStamps() {
    if (!showHero) return;

    const opCard = shell.querySelector(".grade-stamp.op");
    const favorCard = shell.querySelector(".grade-stamp.like-stamp");
    if (!opCard && !favorCard) return;

    const SUPABASE_URL = "https://khszfukekudyripouifm.supabase.co";
    const SUPABASE_KEY = "sb_publishable_XjCVKOZRq1aERqzOGj_tHw_eC4uCXEb";

    function getVisitorKey() {
      let k = localStorage.getItem("loa_tournament_visitor_key");
      if (!k) return null;
      return k;
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

    const visitorKey = getVisitorKey();
    if (!visitorKey) return;

    try {
      const url =
        `${SUPABASE_URL}/rest/v1/sessions` +
        `?select=tournament_type,grade,date_key` +
        `&visitor_key=eq.${encodeURIComponent(visitorKey)}` +
        `&date_key=eq.${getDateKey()}`;

      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      });

      if (!res.ok) return;

      const data = await res.json();
      if (!Array.isArray(data) || !data.length) return;

      const opRow = data.find((r) => r.tournament_type === "op");
      const favorRow = data.find((r) => r.tournament_type === "favor");

      if (opRow && opCard) {
        opCard.innerHTML = `
          <div class="stamp-kicker">TODAY STAMP</div>
          <div class="stamp-title">${opRow.grade || "완료"}</div>
          <div class="stamp-desc">${formatStampDate(opRow.date_key)}<br>OP 참여 완료</div>
        `;
        opCard.style.background = "linear-gradient(180deg, rgba(255,215,0,.12), rgba(255,255,255,.02))";
        opCard.style.borderColor = "rgba(255,215,0,.38)";
        opCard.style.boxShadow = "0 0 0 1px rgba(255,215,0,.10) inset, 0 0 18px rgba(255,215,0,.10)";
      }

      if (favorRow && favorCard) {
        favorCard.innerHTML = `
          <div class="stamp-kicker">TODAY STAMP</div>
          <div class="stamp-title">완료</div>
          <div class="stamp-desc">${formatStampDate(favorRow.date_key)}<br>호감 참여 완료</div>
        `;
        favorCard.style.background = "linear-gradient(180deg, rgba(255,120,170,.12), rgba(255,255,255,.02))";
        favorCard.style.borderColor = "rgba(255,120,170,.32)";
        favorCard.style.boxShadow = "0 0 0 1px rgba(255,120,170,.08) inset, 0 0 18px rgba(255,120,170,.10)";
      }
    } catch (e) {
      console.error("applyHomeTournamentStamps error:", e);
    }
  }

  applyHomeTournamentStamps();

  // 푸터 삽입
  const footerTarget =
    document.querySelector(".page") ||
    document.querySelector(".auction-page") ||
    document.querySelector(".tools-page") ||
    document.querySelector(".app") ||
    document.body;

  footerTarget.insertAdjacentHTML("beforeend", footerHtml);

  // 모바일 드로어
  const hamburgerBtn = document.getElementById("gnbHamburgerBtn");
  const drawer = document.getElementById("gnbDrawer");
  const drawerOverlay = document.getElementById("gnbDrawerOverlay");
  const drawerClose = document.getElementById("gnbDrawerClose");

  function openDrawer() {
    document.body.classList.add("gnb-drawer-open");
    hamburgerBtn?.setAttribute("aria-expanded", "true");
    drawer?.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    document.body.classList.remove("gnb-drawer-open");
    hamburgerBtn?.setAttribute("aria-expanded", "false");
    drawer?.setAttribute("aria-hidden", "true");
  }

  hamburgerBtn?.addEventListener("click", () => {
    if (document.body.classList.contains("gnb-drawer-open")) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawerOverlay?.addEventListener("click", closeDrawer);
  drawerClose?.addEventListener("click", closeDrawer);

  drawer?.querySelectorAll("a.gnb-drawer-link:not(.disabled)").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeDrawer();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
});
