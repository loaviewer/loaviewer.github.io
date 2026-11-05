/* ===== 공통 탭 바 (page-tabs.js) =====
   모든 페이지(정보/스텟/스킬/아크그리드/아크패시브/원정대/직각 티어)가 같은 탭 바를 쓴다.
   - 탭 목록·순서·파일 이름은 아래 PAGES 에서만 관리
   - <div class="char-tabs" id="charTabs"></div> 가 있으면 자동으로 채워짐 (data-page 로 현재 탭 지정, 없으면 window.__PAGE)
   - 주소에는 ?name= 만 붙고, 클릭하면 이동 직전에 "다음 페이지는 저장본 우선" 표시를 남김
   - 탭 hover / 유휴 시 다른 탭 HTML을 prefetch 해서 전환 대기 시간을 줄임 */
(function () {
  "use strict";
  /* 페이지 목록 (탭 순서 · 이름 · 파일). 파일 이름을 바꾸려면 여기만 고치면 된다 */
  const PAGES = [
    { key: "info", label: "정보", file: "character.html" },
    { key: "stat", label: "스텟", file: "stat.html" },
    { key: "skill", label: "스킬", file: "skill.html" },
    { key: "arkgrid", label: "아크그리드", file: "arkgrid.html" },
    { key: "arkpassive", label: "아크패시브", file: "arkpassive.html" },
    { key: "expedition", label: "원정대", file: "expedition.html" },
    { key: "gakgak", label: "직각 티어", file: "gakgak-tier.html" }
  ];
  window.__PAGES = PAGES;
  const fileOf = (k) => (PAGES.find((p) => p.key === k) || PAGES[0]).file;

  /* 탭 링크: 이름이 있으면 ?name= 을 붙임 */
  window.__tabHref = function (key, name) {
    const base = fileOf(key);
    if (!name) return base;
    return base + "?name=" + encodeURIComponent(name);   // 주소에는 이름만 (직업/각인은 이 브라우저에 저장된 조회 기록 사용)
  };
  window.__updateTabLinks = function (name) {
    document.querySelectorAll("#charTabs .char-tab").forEach((a) => { a.setAttribute("href", window.__tabHref(a.dataset.tab, name)); });
    schedulePrefetchAll();
  };

  // ===== 탭 HTML 프리페치 (로아 API는 호출하지 않음, 문서만 미리 받음) =====
  const __prefetched = new Set();
  function prefetchUrl(href) {
    if (!href || __prefetched.has(href)) return;
    // 현재 페이지와 같으면 스킵
    try {
      const u = new URL(href, location.href);
      if (u.pathname === location.pathname && u.search === location.search) return;
    } catch (e) {}
    __prefetched.add(href);
    try {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = href;
      link.as = "document";
      document.head.appendChild(link);
    } catch (e) {
      // prefetch 미지원 시 fetch로 브라우저 HTTP 캐시에만 올려 둠 (본문은 버림)
      try { fetch(href, { credentials: "same-origin", priority: "low" }).catch(function () {}); } catch (e2) {}
    }
  }
  function prefetchTab(el) {
    if (!el || el.classList.contains("active")) return;
    const href = el.getAttribute("href");
    if (href) prefetchUrl(href);
  }
  // 이름이 있을 때 다른 탭을 유휴 시간에 미리 받음 (현재 탭 제외)
  var __prefetchTimer = null;
  function schedulePrefetchAll() {
    if (__prefetchTimer) clearTimeout(__prefetchTimer);
    __prefetchTimer = setTimeout(function () {
      const name = new URLSearchParams(location.search).get("name");
      if (!name) return;
      const active = window.__PAGE;
      PAGES.forEach(function (p) {
        if (p.key === active) return;
        prefetchUrl(window.__tabHref(p.key, name));
      });
    }, 600);   // 첫 페인트·데이터 로드 이후
  }

  // 탭 이동 직전에 표시: 다음 페이지는 방금 받은 데이터를 저장본에서 바로 읽는다 (서버 재호출 방지)
  // 화면에 보이는 모습 그대로 복사 (탭 모드 클래스로 숨겨진 요소는 인라인 display:none 으로 고정)
  function snap(el) {
    const c = el.cloneNode(true), A = [el].concat(Array.from(el.querySelectorAll("*"))), B = [c].concat(Array.from(c.querySelectorAll("*")));
    for (let i = 0; i < A.length; i++) { if (getComputedStyle(A[i]).display === "none") B[i].style.display = "none"; }
    return c.outerHTML;
  }
  document.addEventListener("click", function (e) {
    const a = e.target.closest && e.target.closest("#charTabs .char-tab");
    if (!a) return;
    const name = new URLSearchParams(location.search).get("name");
    if (name) { try { sessionStorage.setItem("loaview-nav", JSON.stringify({ n: name, t: Date.now() })); } catch (err) {} }
    // 같은 탭이면 이동 안 함 / 새 탭 열기(Ctrl·휠클릭)는 그대로 / 그 외에는 화면이 슬쩍 빠지고 이동
    if (a.classList.contains("active")) { e.preventDefault(); return; }
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    try { sessionStorage.removeItem("loaview-leftcol"); sessionStorage.removeItem("loaview-rightcol"); } catch (e0) {}   // 오래된 복사본 제거
    try {   // 다음 페이지에서 먼저 보여줄 왼쪽 열 저장
      const m = document.getElementById("main"), c = m && m.classList.contains("show") && m.querySelector(":scope > .col");
      if (c && name) sessionStorage.setItem("loaview-leftcol", JSON.stringify({ n: name, h: snap(c) }));
    } catch (err) {}
    document.documentElement.classList.add("pg-loading");
    const href = a.getAttribute("href");
    location.href = href;
  }, true);

  // hover / 터치 시작 시 해당 탭만 즉시 프리페치 (pointerover는 버블됨)
  document.addEventListener("pointerover", function (e) {
    const a = e.target.closest && e.target.closest("#charTabs .char-tab");
    if (a) prefetchTab(a);
  }, true);
  document.addEventListener("touchstart", function (e) {
    const a = e.target.closest && e.target.closest("#charTabs .char-tab");
    if (a) prefetchTab(a);
  }, { capture: true, passive: true });
  // 클릭 직전(pointerdown)에도 한 번 더 — hover 없이 누르는 경우 대비
  document.addEventListener("pointerdown", function (e) {
    const a = e.target.closest && e.target.closest("#charTabs .char-tab");
    if (a) prefetchTab(a);
  }, true);

  window.addEventListener("pageshow", function (e) { if (e.persisted) document.documentElement.classList.remove("pg-loading"); });

  window.__tabsHtml = function (active, name) {
    return PAGES.map((p) => '<a class="char-tab' + (p.key === active ? " active" : "") + '" data-tab="' + p.key + '" href="' + window.__tabHref(p.key, name) + '">' + p.label + "</a>").join("");
  };
  window.__fillTabs = function (active) {
    const el = document.getElementById("charTabs"); if (!el) return;
    el.innerHTML = window.__tabsHtml(active || window.__PAGE, new URLSearchParams(location.search).get("name"));
    try { const on = el.querySelector(".char-tab.active"); if (on) el.scrollLeft = Math.max(0, on.offsetLeft - (el.clientWidth - on.offsetWidth) / 2); } catch (e) {}   // 모바일: 현재 탭이 보이게
    schedulePrefetchAll();
  };
  const st = document.createElement("style");
  st.textContent = ".char-tabs a.char-tab,.char-tabs a.char-tab:hover,.char-tabs a.char-tab:visited{text-decoration:none}" +
    "html{color-scheme:dark}.char-tabs{scrollbar-width:none;-webkit-overflow-scrolling:touch}.char-tabs::-webkit-scrollbar{display:none}";
  try {   // 탭 제목을 처음부터 "이름 · 탭 · 로아뷰" 로 (이동할 때 제목이 바뀌며 깜빡이지 않게)
    const nm = new URLSearchParams(location.search).get("name"), pg = PAGES.find((x) => x.key === window.__PAGE);
    if (nm && pg) { const t = nm + " · " + pg.label + " · 로아뷰"; if (document.title !== t) document.title = t; }
  } catch (e) {}
  try { document.documentElement.dataset.page = window.__PAGE || ""; } catch (e) {}
  document.head.appendChild(st);
  if (window.__PAGE !== undefined || document.currentScript && document.currentScript.dataset.fill) window.__fillTabs(window.__PAGE);
  // 이름이 URL에 있으면 유휴 프리페치 예약
  if (new URLSearchParams(location.search).get("name")) schedulePrefetchAll();
})();
