/* ===== 직각 분석 리포트 (gakgak-tier.html) =====
   조회한 캐릭터의 직업 + 직각 기준으로 직각 토너먼트 Supabase 데이터를 모아 '리포트' 형태로 보여줌 (보기 전용).
   - 전적/우승: ranking_overall (op / favor)
   - 티어: get_tier_data (최근 30일, 프로필의 티어 박스와 같은 규칙)
   - 같은 클래스 직각 비교: ranking_overall + get_tier_data
   - 우승자 분석: get_class_winner_stats (클래스 기준)
   - 승률 그래프: get_daily_winrate_history (15일 단위 합산, 승률 0%인 구간은 건너뜀) */
(function () {
  "use strict";

  const SB = "https://khszfukekudyripouifm.supabase.co";
  const KEY = "sb_publishable_XjCVKOZRq1aERqzOGj_tHw_eC4uCXEb";
  const ICON_BASE = "https://loaviewer.github.io/icon/";   // 직각 토너먼트 사이트의 직각 아이콘 (<줄임말>.png)
  const START_DATE = "2026-04-07";          // 토너먼트 시작일
  const CHUNK_DAYS = 30;                    // 그래프 데이터는 30일씩 나눠서 받음
  const UNIT = 5;                           // 그래프/툴팁은 5일 단위 합산 (가장 최근 구간이 어제까지 꽉 찬 5일)
  const UNIT_T = 15;                        // 아래 전적 표는 15일 단위 합산
  const TIER_DAYS = 30;
  const SUPPORT = ["절실한 구원", "만개", "축복의 오라", "해방자"];
  const TIER_INK = ["", "#b47c00", "#cf5f0a", "#7549cf", "#1f6fd1", "#16905a", "#6b7280"];   // 흰 종이 위에서 읽히는 티어 색
  const DONUT_COLORS = ["#2f6fe4", "#8b5cf6", "#e0a100", "#16a974", "#e5484d", "#8a919e"];
  const MODE = {
    op:    { label: "OP 직각",   short: "OP",   color: "#16905a", soft: "rgba(22,144,90,.12)" },
    favor: { label: "호감 직각", short: "호감", color: "#d77a00", soft: "rgba(215,122,0,.12)" }
  };

  const T_SHORT = {
    "고독한 기사":"고기","전투 태세":"전태","광기":"광기","광전사의 비기":"비기","분노의 망치":"분망","중력 수련":"중수","심판자":"심판자","축복의 오라":"축오",
    "처단자":"처단자","포식자":"포식자","빛의 기사":"빛의 기사","해방자":"해방자","초심":"초심","오의 강화":"오의","충격 단련":"충단","체술":"체술",
    "무상신공":"무상","역천지체":"역천","절정":"절정","절제":"절제","오의난무":"난무","일격필살":"일격","권왕파천무":"권왕","수라의 길":"수라",
    "전술 탄환":"전탄","핸드 거너":"핸건","화력 강화":"화강","포격 강화":"포강","죽음의 습격":"죽습","두 번째 동료":"두동","진화의 유산":"유산",
    "아르데타인의 기술":"기술","피스메이커":"피메","사냥의 시간":"사시","상급 소환사":"상소","넘치는 교감":"교감","황제의 칙령":"황제","황후의 은총":"황후",
    "진실된 용맹":"진용","절실한 구원":"절구","점화":"점화","환류":"환류","버스트":"버스트","잔재된 기운":"잔재","멈출 수 없는 충동":"충동",
    "완벽한 억제":"억제","달의 소리":"달소","갈증":"갈증","만월의 집행자":"만월","만개":"만개","그믐의 경계":"그믐","회귀":"회귀","이슬비":"이슬비",
    "질풍노도":"질풍","환수 각성":"환각","야성":"야성","업화":"업화","드레드 로어":"드드","시간 관리자":"시간","공간 검사":"공간"
  };
  const AP_SHORT = {
    "고독한 기사":"고기","전투 태세":"전태","광기":"광기","광전사의 비기":"비기","분노의 망치":"분망","중력 수련":"중수","심판자":"심판자","축복의 오라":"축오",
    "처단자":"처단자","포식자":"포식자","빛의 기사":"빛의 기사","해방자":"해방자","초심":"초심","오의 강화":"오의","충격 단련":"충단","극의: 체술":"체술",
    "무상신공":"무상","역천지체":"역천","절정":"절정","절제":"절제","오의난무":"난무","일격필살":"일격","권왕파천무":"권왕","수라의 길":"수라",
    "전술 탄환":"전탄","핸드거너":"핸건","화력 강화":"화강","포격 강화":"포강","죽음의 습격":"죽습","두 번째 동료":"두동","진화의 유산":"유산",
    "아르데타인의 기술":"기술","피스메이커":"피메","사냥의 시간":"사시","상급 소환사":"상소","넘치는 교감":"교감","황제의 칙령":"황제","황후의 은총":"황후",
    "진실된 용맹":"진용","절실한 구원":"절구","점화":"점화","환류":"환류","버스트":"버스트","잔재된 기운":"잔재","멈출 수 없는 충동":"충동",
    "완벽한 억제":"억제","달의 소리":"달소","갈증":"갈증","만월의 집행자":"만월","만개":"만개","그믐의 경계":"그믐","회귀":"회귀","이슬비":"이슬비",
    "질풍노도":"질풍","환수 각성":"환각","야성":"야성","업화의 계승자":"업화","드레드 로어":"드드","시간 관리자":"시간","공간 검사":"공간"
  };
  const CLS_EMB = {
    "워로드":"warlord","버서커":"berserker","디스트로이어":"destroyer","홀리나이트":"holyknight","슬레이어":"berserker_female","발키리":"valkyrie",
    "배틀마스터":"battle_master","인파이터":"infighter","기공사":"force_master","창술사":"lance_master","스트라이커":"battle_master_male","브레이커":"infighter_male",
    "데빌헌터":"devil_hunter","블래스터":"blaster","호크아이":"hawk_eye","스카우터":"scouter","건슬링어":"devil_hunter_female",
    "바드":"bard","서머너":"summoner","아르카나":"arcana","소서리스":"elemental_master","블레이드":"blade","데모닉":"demonic","리퍼":"reaper","소울이터":"soul_eater",
    "도화가":"yinyangshi","기상술사":"weather_artist","환수사":"alchemist","가디언나이트":"dragon_knight","차원술사":"dimension_master"
  };

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = (v) => Number(v) || 0;
  const pct = (v, d) => num(v).toFixed(d == null ? 1 : d) + "%";
  const comma = (v) => num(v).toLocaleString("ko-KR");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const shortOf = (full) => T_SHORT[full] || full;
  const iconUrl = (short) => ICON_BASE + encodeURIComponent(String(short).replace(/\s+/g, "")) + ".png";
  const iconImg = (short, cls) => '<img class="' + (cls || "rs-ico") + '" src="' + iconUrl(short) + '" alt="" referrerpolicy="no-referrer" onerror="this.style.visibility=\'hidden\'">';

  /* ---------- 조회한 캐릭터 정보 (URL + 마지막 조회 기록) ---------- */
  function getCtx() {
    const qs = new URLSearchParams(location.search);
    let last = null;
    try { last = JSON.parse(localStorage.getItem("loaview-last") || "null"); } catch (e) {}
    let c = { name: qs.get("name") || "", cls: qs.get("cls") || "", eng: qs.get("eng") || "", img: qs.get("img") || "", srv: "", guild: "", lv: "", il: "", cp: "" };
    if (last) {
      const keys = ["name", "cls", "eng", "img", "srv", "guild", "lv", "il", "cp"];
      if (!c.name || last.name === c.name) keys.forEach((k) => { if (!c[k]) c[k] = last[k] || ""; });   // 이름이 같으면(또는 이름이 없으면) 내 브라우저에 저장된 조회 기록으로 채움
    }
    c.short = AP_SHORT[c.eng] || T_SHORT[c.eng] || c.eng;
    c.full = Object.keys(T_SHORT).find((k) => T_SHORT[k] === c.short) || c.eng;
    return c;
  }
  const ctx = getCtx();

  /* ---------- 상단 탭: 공통 page-tabs.js 가 처리 (주소의 ?name= 기준) ---------- */

  /* ---------- Supabase ---------- */
  const H = { "apikey": KEY, "Authorization": "Bearer " + KEY };
  async function rest(path) {
    const r = await fetch(SB + "/rest/v1/" + path, { headers: H });
    if (!r.ok) throw new Error(path.split("?")[0] + " " + r.status);
    return r.json();
  }
  async function rpc(fn, body, tries) {
    tries = tries || 3;
    let err;
    for (let k = 0; k < tries; k++) {
      try {
        const r = await fetch(SB + "/rest/v1/rpc/" + fn, { method: "POST", headers: Object.assign({ "Content-Type": "application/json" }, H), body: JSON.stringify(body) });
        if (!r.ok) throw new Error(fn + " " + r.status);
        return await r.json();
      } catch (e) { err = e; if (k < tries - 1) await sleep(500 * (k + 1)); }
    }
    throw err;
  }
  const isMine = (r) => r.engraving_name === ctx.full || T_SHORT[r.engraving_name] === ctx.short;
  const isSupport = SUPPORT.includes(ctx.full);

  /* ---------- 화면 뼈대 ---------- */
  const root = $("ggRoot");
  // 주소에는 이름만 싣는다. 저장된 기록이 없으면(다른 브라우저/직접 입력) 한 번 조회해서 이 브라우저에만 저장
  try { if (location.search.indexOf("cls=") > -1 || location.search.indexOf("eng=") > -1 || location.search.indexOf("img=") > -1) history.replaceState(null, "", "?name=" + encodeURIComponent(ctx.name)); } catch (e) {}
  if (ctx.name && (!ctx.cls || !ctx.eng) && !sessionStorage.getItem("gg-fetched-" + ctx.name)) {
    root.innerHTML = '<div class="rs-msg">캐릭터 정보를 불러오는 중…</div>';
    try { sessionStorage.setItem("gg-fetched-" + ctx.name, "1"); } catch (e) {}
    fetch("https://port-0-loa-dps-viewer-mrwmoda54f8e0312.sel3.cloudtype.app/character/" + encodeURIComponent(ctx.name) + "/all")
      .then((r) => r.json()).then((d) => {
        const p = d && d.ArmoryProfile; if (!p) throw 0;
        localStorage.setItem("loaview-last", JSON.stringify({ name: p.CharacterName || ctx.name, cls: p.CharacterClassName || "", eng: String((d.ArkPassive && d.ArkPassive.Title) || "").trim(),
          img: p.CharacterImage || "", srv: p.ServerName || "", guild: p.GuildName || "", lv: p.CharacterLevel || "", il: p.ItemAvgLevel || "", cp: p.CombatPower || "" }));
        location.reload();
      }).catch(() => { root.innerHTML = '<div class="rs-msg">캐릭터 정보를 불러오지 못했어요.<br><a href="character.html">캐릭터 조회로 이동</a></div>'; });
    return;
  }
  if (!ctx.cls || !ctx.eng) {
    root.innerHTML = '<div class="rs-msg">조회한 캐릭터의 직업과 직각을 알 수 없습니다.<br>캐릭터를 먼저 조회한 뒤 <b>직각 티어</b> 탭을 눌러주세요.<br><a href="character.html">캐릭터 조회로 이동</a></div>';
    return;
  }

  const kst = new Date(Date.now() + 9 * 3600 * 1000);
  const todayTxt = kst.getUTCFullYear() + "." + String(kst.getUTCMonth() + 1).padStart(2, "0") + "." + String(kst.getUTCDate()).padStart(2, "0");
  const embFile = CLS_EMB[ctx.cls.replace(/\s+/g, "")];
  const embUrl = embFile ? "https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/emblem_" + embFile + ".png" : "";
  const embChip = embUrl ? '<i class="rs-emb" style="background-image:url(\'' + embUrl + '\')"></i>' : "";

  const photo = ctx.img
    ? '<img src="' + esc(ctx.img) + '" alt="" referrerpolicy="no-referrer" onerror="this.remove()">'
    : "";


  /* ---------- 캐릭터 검색줄 + 최근 검색/즐겨찾기 (조회하면 캐릭터 페이지로 이동) ---------- */
  (function setupSearch() {
    const rd = (k) => { try { const v = JSON.parse(localStorage.getItem(k)); return Array.isArray(v) ? v : []; } catch (e) { return []; } };
    const wr = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
    const FAV = "loaview-fav", HID = "loaview-recent-hidden", REC = "loaview-recent";
    let tab = "recent";
    root.insertAdjacentHTML("beforebegin",
      '<div class="search-row gg-search"><div class="search-bar"><span class="ico">🔍</span><input id="ggQ" type="text" placeholder="캐릭터명을 입력해 조회하세요" autocomplete="off" spellcheck="false"><button id="ggGo" type="button">조회</button></div>' +
      '<div class="recent" id="ggRecent"><button id="ggRecentBtn" class="recent-btn" type="button" aria-expanded="false">최근 검색 <span class="caret">▼</span></button>' +
      '<div id="ggRecentList" class="recent-list" hidden><div class="rc-tabs" role="tablist"><button type="button" class="rc-tab active" data-t="recent">최근검색</button><i aria-hidden="true"></i><button type="button" class="rc-tab" data-t="fav">즐겨찾기</button></div>' +
      '<ul id="ggItems" class="rc-items" role="listbox"></ul><div class="rc-foot"><button type="button" id="ggClear" class="rc-clear">전체삭제</button></div></div></div></div>');
    const q = $("ggQ"), list = $("ggRecentList"), btn = $("ggRecentBtn");
    q.value = ctx.name || "";
    const go = (v) => { v = String(v || "").trim(); if (v) location.href = "character.html?name=" + encodeURIComponent(v); };
    $("ggGo").addEventListener("click", () => go(q.value));
    q.addEventListener("keydown", (e) => { if (e.key === "Enter") go(q.value); });
    const setOpen = (o) => { list.hidden = !o; btn.classList.toggle("open", o); btn.setAttribute("aria-expanded", String(o)); if (o) paint(); };
    function paint() {
      const favs = rd(FAV), hid = new Set(rd(HID));
      document.querySelectorAll("#ggRecentList .rc-tab").forEach((b) => b.classList.toggle("active", b.dataset.t === tab));
      let names;
      if (tab === "fav") names = favs.slice();
      else { const vis = rd(REC).map((x) => x.n).filter((n) => n && !hid.has(n)); names = vis.filter((n) => favs.includes(n)).concat(vis.filter((n) => !favs.includes(n))); }
      const ul = $("ggItems"); ul.textContent = "";
      if (!names.length) { ul.innerHTML = '<li class="empty">' + (tab === "fav" ? "즐겨찾기한 캐릭터가 없어요" : "최근 검색 기록이 없어요") + "</li>"; return; }
      names.forEach((n) => {
        const on = favs.includes(n), li = document.createElement("li");
        li.dataset.name = n;
        li.innerHTML = '<button type="button" class="rc-star' + (on ? " on" : "") + '" data-act="star" title="' + (on ? "즐겨찾기 해제" : "즐겨찾기 추가") + '">' + (on ? "★" : "☆") + '</button><span class="rc-nm">' + esc(n) + '</span><button type="button" class="rc-x" data-act="del" title="삭제">✕</button>';
        ul.appendChild(li);
      });
    }
    btn.addEventListener("click", (e) => { e.stopPropagation(); setOpen(list.hidden); });
    list.addEventListener("click", (e) => {
      const t = e.target.closest(".rc-tab, #ggClear, [data-act]");
      if (t) {
        if (t.classList.contains("rc-tab")) { tab = t.dataset.t; paint(); return; }
        if (t.id === "ggClear") {
          if (!confirm(tab === "fav" ? "즐겨찾기를 모두 삭제할까요?" : "최근 검색을 모두 삭제할까요?\n(즐겨찾기는 유지됩니다)")) return;
          if (tab === "fav") wr(FAV, []); else wr(HID, Array.from(new Set(rd(HID).concat(rd(REC).map((x) => x.n)))));
          paint(); return;
        }
        const li = t.closest("li[data-name]"); if (!li) return;
        const n = li.dataset.name, favs = rd(FAV);
        if (t.dataset.act === "star") wr(FAV, favs.includes(n) ? favs.filter((x) => x !== n) : [n].concat(favs));
        else if (tab === "fav") wr(FAV, favs.filter((x) => x !== n)); else wr(HID, Array.from(new Set(rd(HID).concat(n))));
        paint(); return;
      }
      const li = e.target.closest("li[data-name]"); if (li) go(li.dataset.name);
    });
    document.addEventListener("click", (e) => { if (!e.target.closest("#ggRecent")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  })();

  root.innerHTML =
    '<article class="rs-paper">' +
      '<header class="rs-head">' +
        '<div class="rs-photo"><div class="rs-photo-box">' + photo + "</div></div>" +
        '<div class="rs-head-main">' +
          '<div class="rs-titleblk"><div class="rs-kick">ANALYSIS REPORT · 직각 분석 리포트</div><h1 class="rs-title"><span>' + esc(ctx.name || ctx.cls) + '</span></h1><div class="rs-title-sub">직각 토너먼트 기록 · ' + START_DATE.replace(/-/g, ".") + " ~ 현재</div></div>" +
          '<div class="rs-total" id="rsTotal"></div>' +
          '<div id="rsInfo"></div><div class="rs-risknote" id="rsRiskNote"><div class="rs-rn"><span class="rs-rn-load">종합 평가 집계 중…</span></div></div>' +
        "</div>" +
      "</header>" +
      '<section class="rs-sec"><h2><i>1</i>종합 전적</h2><div id="rsCareer" class="rs-scroll"></div></section>' +
      '<section class="rs-sec"><h2><i>2</i>클래스 내 순위<small>' + esc(ctx.cls) + " 직각끼리 승률 비교</small></h2><div class=\"rs-two\" id=\"rsVs\"><div class=\"rs-load\">불러오는 중…</div></div></section>" +
      '<section class="rs-sec"><h2><i>3</i>매치업 분석<small>내 직각 vs 다른 직각 · 최근 · OP + 호감 합산</small></h2><div class="rs-two" id="rsMatch"><div class="rs-load">불러오는 중…</div></div></section>' +
      '<section class="rs-sec"><h2><i>4</i>' + esc(ctx.cls) + ' 유저 선택 분포<small>같은 클래스 유저가 가장 많이 우승시킨 직각 TOP 5</small></h2><div class="rs-two" id="rsWin"><div class="rs-load">불러오는 중…</div></div></section>' +
      '<section class="rs-sec"><h2><i>5</i>승률 추이<small>그래프 ' + UNIT + '일 · 표 ' + UNIT_T + '일 단위 합산 · 승률 0%인 구간은 건너뜀</small></h2><div id="rsGraph"><div class="rs-load">전체 기간을 나눠서 받아오는 중이라 몇 초 걸릴 수 있어요…</div></div></section>' +
      '<footer class="rs-foot"><div>※ 본 데이터는 직각 토너먼트 기록을 실시간 집계한 결과이며 임의로 수정할 수 없습니다.</div><div class="rs-foot-r">집계일 ' + todayTxt + '<span class="rs-seal">LOAVIEW</span></div></footer>' +
    "</article>";

  /* ---------- 열람 조건: 토너먼트 1회 이상 / S- 이상 혜택 (gakgak-lock.js) ---------- */
  (function applyLock() {
    const wrap = document.createElement("div");
    wrap.id = "ggWrap"; wrap.className = "gg-wrap gg-checking";
    root.parentNode.insertBefore(wrap, root); wrap.appendChild(root);
    wrap.insertAdjacentHTML("beforeend", '<div class="gg-lockov" id="ggLockOv" hidden><div class="gg-lockbox"><div class="gg-lockico">🔒</div><b>토너먼트 1회 참가시 열람</b><small>직각 토너먼트를 한 번 완료하면 직각 티어를 볼 수 있어요.<br>S- 등급 이상 혜택이 남아 있어도 열람할 수 있어요.</small><a class="gg-lockbtn" href="/rank/">🏆 토너먼트 1회 참여하기</a></div></div>');
    (window.__ggLock || Promise.resolve(true)).then((ok) => {
      wrap.classList.remove("gg-checking");
      if (!ok) { wrap.classList.add("gg-locked"); $("ggLockOv").hidden = false; }
    });
  })();

  /* ---------- 상태 ---------- */
  const S = { rank: { op: undefined, favor: undefined }, tierRaw: { op: null, favor: null }, tier: { op: null, favor: null }, tierState: { op: "load", favor: "load" } };

  function sortChamp(rows) {
    return [...rows].sort((a, b) => num(b.champion_count) - num(a.champion_count) || num(b.win_rate) - num(a.win_rate) || num(b.win_count) - num(a.win_count));
  }
  function poolOf(m) {
    const rows = S.rank[m];
    if (!rows) return null;
    return m === "op" ? rows.filter((r) => !SUPPORT.includes(r.engraving_name)) : rows;
  }
  function myRow(m) {
    const pool = poolOf(m);
    if (!pool) return null;
    const sorted = sortChamp(pool), idx = sorted.findIndex(isMine);
    if (idx < 0) return null;
    return { r: sorted[idx], champRank: idx + 1, of: sorted.length };
  }

  /* ---------- 티어 (프로필의 티어 박스와 같은 규칙: 승률순 → 6/9/12 → 나머지 반반, 6티어는 맨 아래 10개) ---------- */
  function calcTier(entries) {
    const sorted = [...entries].sort((a, b) => b.winRate - a.winRate || b.total - a.total);
    const total = sorted.length;
    const tier6 = total > 10 ? sorted.slice(total - 10) : [];
    const rest = total > 10 ? sorted.slice(0, total - 10) : sorted;
    const rem = rest.slice(27), half = Math.ceil(rem.length / 2);
    const tiers = [rest.slice(0, 6), rest.slice(6, 15), rest.slice(15, 27), rem.slice(0, half), rem.slice(half), tier6];
    let out = null;
    tiers.forEach((t, i) => t.forEach((e) => { if (e.mine) out = Object.assign({}, e, { tier: i + 1, rank: sorted.indexOf(e) + 1, of: total }); }));
    return out;
  }
  function tierStamp(m) {
    if (m === "op" && isSupport) return '<span class="rs-na">서포터 제외</span>';
    const st = S.tierState[m], t = S.tier[m];
    if (st === "load") return '<span class="rs-na">집계 중…</span>';
    if (st === "err") return '<span class="rs-na">불러오기 실패</span>';
    if (!t) return '<span class="rs-na">집계 없음</span>';
    return '<span class="rs-stamp" style="--tc:' + TIER_INK[t.tier] + '">' + t.tier + '티어</span><span class="rs-tier-sub">' + t.of + "개 중 " + t.rank + "위</span>";
  }

  /* ---------- 상단 (총 경기 + 인적사항) / 전적 표 ---------- */
  /* ---------- 위험도: OP + 호감 합산 승률 순위 → SS+ ~ F ---------- */
  const GRADES = ["SS+", "SS", "S", "A+", "A", "B+", "B", "C+", "C", "D+", "D", "E+", "E", "F+", "F"];
  const riskTier = (gi) => (gi <= 1 ? 0 : gi <= 2 ? 1 : gi <= 4 ? 2 : gi <= 8 ? 3 : gi <= 10 ? 4 : gi <= 12 ? 5 : 6);
  function riskInfo(m) {
    if (S.rank[m] === undefined) return { state: "load" };
    if (m === "op" && isSupport) return { state: "na" };
    let rows = S.rank[m];
    if (!rows) return { state: "none" };
    if (!isSupport) rows = rows.filter((r) => !SUPPORT.includes(r.engraving_name));
    const list = rows.map((r) => ({ name: r.engraving_name, w: num(r.win_count), t: num(r.total_matches) })).filter((o) => o.t > 0)
      .sort((a, b) => b.w / b.t - a.w / a.t || b.t - a.t);
    const idx = list.findIndex((o) => isMine({ engraving_name: o.name }));
    if (idx < 0) return { state: "none" };
    const gi = Math.min(GRADES.length - 1, Math.floor(idx / list.length * GRADES.length));
    return { state: "ok", rank: idx + 1, n: list.length, gi, grade: GRADES[gi], rate: list[idx].w / list[idx].t * 100 };
  }
  const FAV_GRADES = ["SS+", "SS", "S+", "S", "A+", "A", "B+", "B", "C+", "C", "D+", "D"];
  const favTier = (g) => (g <= 1 ? 0 : g <= 3 ? 1 : g <= 5 ? 2 : g <= 7 ? 3 : g <= 9 ? 4 : 5);
  const SYNERGY = { "전투 태세": 1, "전태": 1 };
  function isSynergy() { return !!(SYNERGY[ctx.full] || SYNERGY[ctx.short]); }

  /* 1~3 강력너프 / 4~7 너프 / 8~12 관측 / 13~20 소폭상향 / 21~30 상향 / 31~40 매우상향 / 41~50 호흡기 / 51~ 코마 */
  function rankBand(rank) {
    const r = num(rank);
    if (!r || r < 1) return 3;
    if (r <= 3) return 0;
    if (r <= 7) return 1;
    if (r <= 12) return 2;
    if (r <= 20) return 3;
    if (r <= 30) return 4;
    if (r <= 40) return 5;
    if (r <= 50) return 6;
    return 7;
  }
  function tierToBand(tier, of) {
    if (tier == null || isNaN(num(tier))) return null;
    const t = num(tier), o = num(of) || 60;
    return rankBand(Math.max(1, Math.round((t - 0.5) / Math.max(o, 1) * 56)));
  }
  function deltaKey(ob, rb) {
    if (rb == null) return "stable";
    const d = rb - ob;
    if (d <= -2) return "rise";
    if (d === -1) return "soft_rise";
    if (d === 0) return "stable";
    if (d === 1) return "soft_fall";
    return "fall";
  }

  const PH = {
    core: {
      normal: [
        ["최정상 강세가 고착된 상태입니다.", "밸런스를 크게 흔드는 자리로 강력 너프가 시급합니다.", "메타 최상단을 장기간 점유한 모습입니다.", "다른 직군 선택의 폭을 줄이는 초강세 구간입니다.", "정상 독점이 이어지는 위험한 강세입니다.", "최우선 하향 대상으로 올려야 할 위치입니다."],
        ["상위 강세가 안정적으로 유지됩니다.", "하향 검토가 필요한 고위험 구간입니다.", "상위권을 꾸준히 방어 중인 모습입니다.", "너프 후보로 올려두기 좋은 위치입니다.", "상위 강세가 쉽게 무너지지 않습니다.", "너프 논의를 열어둘 시점입니다."],
        ["준상위권에서 경계가 필요한 구간입니다.", "당장은 지켜보되 하향 가능성을 열어둘 자리입니다.", "과하지 않은 상단으로 모니터링 대상입니다.", "너프까지는 이르지만 추이 확인이 필요합니다.", "준상위 안정권으로 관측이 우선입니다.", "경계 구간에 머무는 모습입니다."],
        ["평균 하단에서 소폭 상향이 필요한 구간입니다.", "작은 개선만 있어도 체감이 달라질 수 있는 위치입니다.", "소폭 상향 조정을 검토해 볼 만한 상태입니다.", "경쟁력을 높이려면 소폭 개선이 필요합니다.", "소폭 상향이 있으면 선택 폭이 넓어질 수 있습니다.", "밸런스 보완이 이뤄지면 한 단계 올라설 여지가 있습니다."],
        ["상향이 필요한 약세 구간입니다.", "밸런스 조정이 이뤄져야 선택 가치가 살아날 수 있습니다.", "상향 개선이 분명한 요구로 읽히는 위치입니다.", "상향 없이는 주력 기용이 부담스러운 대역입니다.", "상향이 필요한 상태로 보는 것이 맞습니다.", "상향 없이는 매력이 떨어지는 구간입니다."],
        ["매우 상향이 필요한 하위 구간입니다.", "강한 밸런스 개선이 요구되는 상태입니다.", "실전 선택 폭이 좁아져 매우 상향이 절실합니다.", "구조적 약세 가능성이 있어 강한 상향이 필요합니다.", "매우 상향 조정이 절실한 위치입니다.", "강한 상향이 동반돼야 경쟁력이 생깁니다."],
        ["호흡기를 단 상태에 가까운 구간입니다.", "긴급 상향이 시급한 위치입니다.", "쓰임이 크게 제한되어 긴급 상향이 필요합니다.", "긴급 상향 없이는 경쟁이 어려운 상태입니다.", "긴급 상향이 우선인 자리입니다.", "긴급 상향 조정이 필요한 구간입니다."],
        ["코마에 가깝거나 이미 끝난 평가를 받기 쉬운 자리입니다.", "대폭 상향이 없고는 유저 이탈 위험이 큽니다.", "기반이 무너진 구간으로 강한 상향이 시급합니다.", "메타에서 사실상 외면받기 쉬워 대폭 상향이 필요합니다.", "코마 구간에 가까운 만큼 강한 상향이 먼저입니다.", "대폭 상향 조정이 시급한 위치입니다."]
      ],
      // 호감(서포터): 너프/상향/밸런스 금지 — 취향·인기만
      support: [
        ["장기간 최상위 인기 서포터입니다.", "파티 중심 축으로 자리가 굳었습니다.", "대체 불가에 가까운 선호를 받는 서포터입니다.", "파티 구성에서 우선순위가 매우 높습니다.", "최상위 인기가 안정적으로 유지됩니다.", "주력 서포터 축으로 보는 것이 맞습니다."],
        ["꾸준히 사랑받는 상위 인기 서포터입니다.", "호감도가 쉽게 무너지지 않는 타입입니다.", "주력 픽 지위가 단단한 서포터입니다.", "상위권 선호가 안정적입니다.", "상위 인기권에서 꾸준히 선택받습니다.", "선호가 높은 서포터로 자리가 분명합니다."],
        ["준상위 인기권 서포터입니다.", "추이를 보며 주력 후보로 볼 수 있는 자리입니다.", "안정적인 선호를 받는 구간입니다.", "무난한 인기를 유지하는 서포터입니다.", "준상위권에서 꾸준히 보이는 타입입니다.", "선호가 준수한 서포터입니다."],
        ["호감도가 평균적인 수준입니다.", "취향에 따라 갈리는 서포터입니다.", "평균대에서 선호가 갈리는 타입입니다.", "개인 취향에 따라 선택 여부가 달라집니다.", "평균 인기권에 머무는 서포터입니다.", "호감도가 중간대에 위치합니다."],
        ["호감도가 다소 낮은 편입니다.", "선호 유저가 제한적인 서포터입니다.", "취향을 타는 비주력 구간에 가깝습니다.", "일부 유저에게만 선택되는 타입입니다.", "인기가 제한적인 구간에 있습니다.", "선호가 넓지 않은 위치입니다."],
        ["호감도가 낮은 편입니다.", "실전 선호가 낮은 서포터입니다.", "취향 맞는 소수 외에는 잘 보이지 않습니다.", "비주력으로 분류되기 쉬운 구간입니다.", "호감 면에서 존재감이 약한 편입니다.", "선호 기반이 얇은 위치입니다."],
        ["호감도가 매우 낮습니다.", "선호가 크게 떨어진 서포터입니다.", "실전에서 보기 드문 편입니다.", "인기 면에서 외면받기 쉬운 위치입니다.", "호감 기반이 약한 상태입니다.", "선호도가 바닥권에 가까운 구간입니다."],
        ["호감 최하단입니다.", "유저 선택이 거의 없는 편입니다.", "인기 면에서 사실상 외면받는 위치에 가깝습니다.", "선호 기반이 거의 없는 구간입니다.", "호감도가 최저권에 머무는 모습입니다.", "취향이 극단적으로 맞는 경우가 아니면 보기 어렵습니다."]
      ],
      synergy: [
        ["파티 기여가 높은 상태로 평균 이상의 폼을 보여주고 있습니다.", "팀 전투에서의 존재감이 뚜렷한 구간입니다.", "아군을 살리는 운영과 본인 지표가 함께 안정적입니다.", "조합에 넣기 부담 없는 좋은 위치입니다.", "팀 단위 선택 가치가 분명한 구간입니다.", "파티 기여와 개인 폼이 잘 맞는 상태입니다."],
        ["파티 기여와 개인 폼이 잘 맞물리는 구간입니다.", "팀 단위로 보면 실전 가치가 또렷합니다.", "주력으로 기용하기 좋은 흐름입니다.", "평균을 웃도는 폼이 이어지고 있습니다.", "조합에 넣었을 때 존재감이 분명합니다.", "아군 기여와 본인 지표가 균형 있습니다."],
        ["파티 기여가 받쳐 주는 가운데 준수한 폼입니다.", "팀 전투에서 믿을 만한 위치입니다.", "조합 선택 가치가 분명한 구간입니다.", "아군 기여와 본인 지표가 무난하게 맞물립니다.", "파티 단위로 보면 기대해 볼 만한 자리입니다.", "팀 기여가 높은 채 준수한 성적을 냅니다."],
        ["파티 기여를 감안하면 실전 가치는 준수합니다.", "팀 단위로 보면 평균 이상의 기대를 할 수 있는 구간입니다.", "숫자만으로 저평가되기 쉬운 타입입니다.", "조합 기여도가 있어 쓸 만한 위치입니다.", "아군을 살리는 운영이 강점인 구간입니다.", "파티 기여를 감안하면 표기 이상으로 기대해 볼 수 있습니다."],
        ["개인 지표는 아쉽지만 파티 기여가 남아 있습니다.", "팀 단위 가치는 숫자보다 나을 수 있는 구간입니다.", "조합에 따라 기용 여지가 있습니다.", "아군을 살리는 역할이 받쳐 주는 위치입니다.", "파티 기여를 감안하면 관측 가치가 있습니다.", "팀 전투 존재감이 남아 있는 구간입니다."],
        ["개인 지표는 낮지만 파티 기여가 남아 있습니다.", "팀 단위로는 관측 가치가 있는 구간입니다.", "조합 기여를 감안하면 완전 외면으로 보기 어렵습니다.", "실전 기용은 조합 의존도가 큰 위치입니다.", "아군 역할이 버팀목인 구간입니다.", "파티 기여를 고려하면 관측할 만합니다."],
        ["파티 기여가 마지막 버팀목인 구간에 가깝습니다.", "팀 전투 존재감은 약하게 남아 있습니다.", "개인 성적 보완이 필요한 상태입니다.", "조합 기여를 감안해도 개선 여지는 큽니다.", "파티 기여만으로는 한계가 있는 위치입니다.", "팀 가치는 남아 있으나 개선이 필요합니다."],
        ["개인 지표는 바닥권이지만 파티 기여가 아주 약하게 남아 있습니다.", "팀 단위 가치만으로는 한계가 큰 구간입니다.", "개선이 크게 필요한 상태입니다.", "조합 기여를 감안해도 보완이 절실합니다.", "파티 기여만으로 설명하기 어려운 약세입니다.", "팀 가치와 별개로 큰 개선이 필요합니다."]
      ]
    },
    trend: {
      rise: ["최근 {days}일 성향은 뚜렷한 상승세입니다.", "최근 폼이 살아나며 지표가 올라가고 있습니다.", "단기 성적이 개선되는 흐름입니다.", "최근 {tier}티어 부근까지 끌어올린 반등이 보입니다.", "최근 들어 상승 곡선이 분명합니다.", "단기 폼이 좋아져 재평가 여지가 생기고 있습니다.", "최근 성향이 위로 꺾이며 힘을 내는 모습입니다.", "최근 지표 상승이 누적 평가를 밀어 올리고 있습니다."],
      soft_rise: ["최근 {days}일 성향은 소폭 상승입니다.", "단기 폼이 조금 나아진 상태입니다.", "최근 온도가 살짝 올라간 흐름입니다.", "소폭 반등 신호가 보입니다.", "최근 지표가 천천히 개선되는 인상입니다.", "단기 성향이 소폭 긍정적으로 바뀌었습니다.", "최근 들어 힘이 조금씩 실리는 모습입니다.", "소폭 상승세가 감지됩니다."],
      stable: ["최근 {days}일 성향도 큰 기복 없이 비슷합니다.", "단기 폼이 누적 흐름과 잘 맞물려 있습니다.", "최근에도 비슷한 온도를 유지하고 있습니다.", "누적과 최근 성향이 대체로 일치합니다.", "단기 지표에서도 큰 이탈은 없습니다.", "최근 흐름이 안정적으로 이어집니다.", "누적 평가와 최근 폼의 온도 차가 크지 않습니다.", "최근에도 같은 기조가 유지됩니다."],
      soft_fall: ["최근 {days}일 성향은 소폭 하락입니다.", "단기 폼이 조금 내려앉은 상태입니다.", "최근 온도가 살짝 낮아진 흐름입니다.", "소폭 조정 구간으로 읽힙니다.", "최근 지표가 천천히 약해지는 인상입니다.", "단기 성향이 소폭 부정적으로 바뀌었습니다.", "최근 들어 힘이 조금 빠지는 모습입니다.", "소폭 하락세가 감지됩니다."],
      fall: ["최근 {days}일 성향은 뚜렷한 하락세입니다.", "단기 폼이 크게 내려앉았습니다.", "최근 지표 급락이 눈에 띕니다.", "최근 {tier}티어 부근으로 밀리는 흐름입니다.", "단기 성적이 누적 대비 크게 약해졌습니다.", "최근 들어 하락 곡선이 분명합니다.", "단기 폼이 꺾이며 추이 확인이 필요한 상태입니다.", "최근 성향이 아래로 크게 기울었습니다."]
    },
    need: {
      3: ["소폭 상향이 있으면 선택 폭이 넓어질 수 있습니다.", "소폭 개선만으로도 체감이 달라질 여지가 있습니다.", "소폭 상향 조정을 검토할 만합니다.", "밸런스 보완이 이뤄지면 경쟁력이 살아날 수 있습니다.", "소폭 상향이 필요한 상태로 보는 편이 맞습니다.", "작은 개선이 동반되면 상승세가 더 안정됩니다."],
      4: ["상향이 필요한 상태로 보는 것이 맞습니다.", "밸런스 조정이 이뤄져야 주력 기용이 수월해집니다.", "상향 개선이 분명한 요구입니다.", "상향 없이는 선택 매력이 떨어집니다.", "상향 조정을 검토해야 하는 구간입니다.", "상향이 동반돼야 반등이 자리 잡습니다."],
      5: ["매우 상향이 필요한 구간입니다.", "강한 밸런스 개선이 요구됩니다.", "매우 상향 조정이 절실합니다.", "강한 상향이 동반돼야 경쟁력이 생깁니다.", "매우 상향 없이는 주력 복귀가 어렵습니다.", "강한 상향 우선순위가 높은 위치입니다."],
      6: ["긴급 상향이 시급합니다.", "긴급 상향 조정이 필요합니다.", "긴급 상향 없이는 쓰임이 크게 제한됩니다.", "긴급 상향이 우선입니다.", "긴급 상향이 필요한 상태입니다.", "긴급 상향 논의를 미루기 어렵습니다."],
      7: ["대폭 상향이 시급합니다.", "강한 상향이 없고는 유저 이탈 위험이 큽니다.", "대폭 상향 조정이 필요합니다.", "코마 구간에 가까운 만큼 강한 상향이 먼저입니다.", "대폭 상향이 없으면 회복이 어렵습니다.", "유저 이탈을 막으려면 강한 상향이 시급합니다."]
    },
    pressure: {
      0: ["강력 너프가 시급한 자리입니다.", "최우선 하향 대상으로 올려야 합니다.", "강한 하향이 미뤄질수록 메타 왜곡이 커집니다.", "즉시 하향 논의를 열 필요가 있습니다.", "강력 너프 요구가 가장 높은 구간입니다.", "강한 하향이 필요한 위치입니다."],
      1: ["너프 검토가 필요한 위치입니다.", "하향 우선순위를 점검할 만합니다.", "너프 후보로 분류하기에 충분합니다.", "하향 논의를 열어둘 시점입니다.", "너프가 필요한 고위험 구간입니다.", "하향 조정이 요구되는 자리입니다."],
      2: ["당장은 관측이 우선입니다.", "하향 가능성은 열어두되 추이를 보면 됩니다.", "모니터링 대상에 가깝습니다.", "성급한 조정보다 관측이 맞습니다.", "지켜보면서 판단하면 되는 구간입니다.", "관측 우선으로 두는 편이 좋습니다."]
    },
    // 호감 전용 꼬리 — 하향/너프/상향 금지
    favTail: {
      0: ["많은 유저가 첫 손으로 고르는 인기 축입니다.", "취향을 넘어 대세 픽에 가까운 위치입니다.", "파티에서 가장 자주 보이는 선택지 중 하나입니다.", "선호도가 매우 높아 대체재를 찾기 어렵습니다.", "인기 최상단을 꾸준히 지키는 모습입니다.", "유저 선호가 뚜렷하게 모이는 자리입니다."],
      1: ["상위권에서 꾸준히 사랑받는 타입입니다.", "선호 유저층이 두터운 편입니다.", "인기 상위권에 안착해 있는 모습입니다.", "취향 맞는 유저에게 자주 선택됩니다.", "주력 후보로 꼽히는 인기 구간입니다.", "호감도가 안정적으로 높은 위치입니다."],
      2: ["준상위 인기권에서 무난히 선택받는 편입니다.", "취향에 따라 주력으로 쓰는 유저가 있습니다.", "인기가 준수해 후보군에 잘 들어갑니다.", "선호가 꾸준한 편인 구간입니다.", "호감도가 안정적인 준상위권입니다.", "무난한 인기를 유지하는 타입입니다."],
      3: ["취향이 갈리는 평균적인 인기 구간입니다.", "선호하는 유저와 그렇지 않은 유저가 나뉩니다.", "호감도가 중간대에 머무는 모습입니다.", "개인 취향에 따라 선택 여부가 달라집니다.", "평균적인 선호를 받는 위치입니다.", "인기면에서는 평범한 구간에 가깝습니다."],
      4: ["선호 유저가 다소 적은 편입니다.", "취향을 타는 비주력 구간에 가깝습니다.", "호감도가 평균보다 낮은 모습입니다.", "일부 유저에게만 선택되는 타입입니다.", "인기가 제한적인 구간에 있습니다.", "선호가 넓지 않은 위치입니다."],
      5: ["호감도가 낮은 편으로 선택이 드문 구간입니다.", "취향 맞는 소수 유저 외에는 잘 보이지 않습니다.", "인기가 낮은 축에 머무는 모습입니다.", "선호 기반이 얇은 위치입니다.", "비주력으로 분류되기 쉬운 구간입니다.", "호감 면에서 존재감이 약한 편입니다."],
      6: ["호감도가 매우 낮아 실전에서 보기 드문 편입니다.", "선호 유저가 크게 줄어든 구간입니다.", "인기 면에서 외면받기 쉬운 위치입니다.", "취향이 아주 맞는 경우가 아니면 선택이 어렵습니다.", "호감 기반이 약한 상태입니다.", "선호도가 바닥권에 가까운 구간입니다."],
      7: ["호감 최하단으로 유저 선택이 거의 없는 편입니다.", "인기 면에서 사실상 외면받는 위치에 가깝습니다.", "선호 기반이 거의 없는 구간입니다.", "취향이 극단적으로 맞는 경우가 아니면 보기 어렵습니다.", "호감도가 최저권에 머무는 모습입니다.", "유저 선택이 극히 드문 구간에 있습니다."]
    },
    synTail: [
      "팀 단위로 보면 실전 가치가 더 잘 드러나는 타입입니다.",
      "조합에 넣었을 때 존재감이 분명한 편입니다.",
      "파티 기여를 감안하면 표기 이상으로 기대해 볼 수 있습니다.",
      "아군을 살리는 운영이 강점인 구간입니다.",
      "팀 전투에서의 신뢰도가 핵심인 선택지입니다.",
      "조합이 맞을 때 진가가 나타나는 타입입니다.",
      "파티 단위 평가는 개인 지표보다 후한 편입니다.",
      "팀 기여가 핵심 매력인 구간입니다."
    ]
  };

  function pick(arr, seed) {
    if (!arr || !arr.length) return "";
    return arr[(Math.abs(seed) || 0) % arr.length];
  }
  function buildComment(role, band, delta, seed, tierNum) {
    const cores = (PH.core[role] || PH.core.normal)[band] || PH.core.normal[3];
    const core = pick(cores, seed);
    const tr = pick(PH.trend[delta] || PH.trend.stable, seed + 3)
      .replace(/\{days\}/g, String(TIER_DAYS))
      .replace(/\{tier\}/g, tierNum != null ? String(tierNum) : "-");
    let tail = "";
    // 호감(서포터): 밸런스 너프/상향 없이 취향·인기 멘트만
    if (role === "support") tail = pick(PH.favTail[band] || PH.favTail[3], seed + 7);
    else if (role === "synergy") tail = pick(PH.synTail, seed + 7);
    else if (band >= 3) tail = pick(PH.need[band] || PH.need[3], seed + 7);
    else tail = pick(PH.pressure[band] || PH.pressure[2], seed + 7);
    return core + " " + tr + (tail ? " " + tail : "");
  }

  function overall() {
    const m = isSupport ? "favor" : "op", k = riskInfo(m);
    if (k.state !== "ok") return k;
    if (!isSupport) return Object.assign({}, k, { cls: "t" + riskTier(k.gi), label: "OP" });
    const g = Math.min(FAV_GRADES.length - 1, k.rank - 1);
    return Object.assign({}, k, { grade: FAV_GRADES[g], cls: "p" + favTier(g), label: "호감" });
  }

  function riskStamp() {
    const k = overall();
    if (k.state === "load") return '<div class="rs-rbadge rs-rbadge-sk" aria-hidden="true"><small>종합 평가</small><b>·</b></div>';
    if (k.state !== "ok") return '<div class="rs-rbadge rs-rbadge-sk" aria-hidden="true"><small>종합 평가</small><b>-</b></div>';
    return '<div class="rs-rbadge ' + k.cls + '" aria-label="종합 평가 ' + k.grade + '"><small>종합 평가</small><b>' + k.grade + "</b></div>";
  }

  function paintRiskNote() {
    const el = $("rsRiskNote"), k = overall();
    if (!el) return;
    if (k.state === "load") {
      el.innerHTML = '<div class="rs-rn"><b>종합 평가</b><span class="rs-rn-load">집계 중… 승률·순위 데이터를 모으고 있습니다.</span></div>';
      return;
    }
    if (k.state !== "ok") {
      el.innerHTML = '<div class="rs-rn"><b>종합 평가</b><span class="rs-rn-load">종합 평가 데이터가 아직 없어요.</span></div>';
      return;
    }

    const syn = !isSupport && isSynergy();
    const role = isSupport ? "support" : (syn ? "synergy" : "normal");
    let ob = rankBand(k.rank);
    if (syn && ob > 0) ob = Math.max(0, ob - 1);

    const tm = isSupport ? "favor" : "op";
    const trObj = S.tier[tm];
    const tierNum = trObj && trObj.tier != null ? num(trObj.tier) : null;
    const recentRank = trObj && trObj.rank != null ? num(trObj.rank) : null;
    const rb = recentRank ? rankBand(recentRank) : (trObj ? tierToBand(trObj.tier, trObj.of) : null);
    const delta = deltaKey(ob, rb);
    const seed = (k.rank || 1) * 17 + (tierNum || 0) * 3 + (recentRank || 0) * 5 + String(ctx.short || "").length;
    const text = buildComment(role, ob, delta, seed, tierNum);

    const who = isSupport ? "" : ", 딜러 기준";
    const engName = esc(ctx.full || ctx.short || "");
    const labelCls = isSupport ? "rs-rn-label favor" : "rs-rn-label op";
    const stat = '<span class="rs-rn-stat"><em class="rs-rn-eng">' + engName + '</em> <em class="' + labelCls + '">' + k.label +
      '</em> 승률 <em class="rs-rn-rate">' + pct(k.rate, 1) + '</em> (<em class="rs-rn-rank">' + k.rank + '위</em> / ' + k.n + who + ')</span>';
    el.innerHTML = '<div class="rs-rn ' + k.cls + '"><b>종합 평가 ' + k.grade + "</b><span>" + stat + " — " + text + "</span></div>";
  }

  function renderTop() {
    const a = myRow("op"), b = myRow("favor");
    const ready = S.rank.op !== undefined && S.rank.favor !== undefined;
    const tOp = (a && !(isSupport)) ? num(a.r.total_matches) : 0, tFv = b ? num(b.r.total_matches) : 0;
    const wOp = a ? num(a.r.win_count) : 0, wFv = b ? num(b.r.win_count) : 0;
    const tot = tOp + tFv, wins = wOp + wFv;
    const cell = (v) => (ready ? v : "…");
    $("rsTotal").innerHTML = '<table class="rs-tbl rs-tot"><tbody><tr><th colspan="2">총 경기 횟수</th></tr><tr><td colspan="2" class="big">' + cell(comma(tot) + "<em>전</em>") + "</td></tr>" +
      "<tr><th>OP 직각</th><td>" + cell(comma(tOp) + "전") + "</td></tr><tr><th>호감 직각</th><td>" + cell(comma(tFv) + "전") + "</td></tr>" +
      "<tr><th>통합 승률</th><td>" + (ready && tot ? pct(wins / tot * 100) : "-") + '</td></tr><tr><td colspan="2" class="rk">' + riskStamp() + "</td></tr></tbody></table>";
    paintRiskNote();

    const rows = [
      ["클래스", embChip + esc(ctx.cls), "직각", '<span class="rs-eng">' + iconImg(ctx.short) + "<b>" + esc(ctx.full) + "</b></span>"],
      ["조회 캐릭터", esc(ctx.name || "-"), "서버 / 길드", esc(ctx.srv || "-") + (ctx.guild ? " · " + esc(ctx.guild) : "")],
      ["아이템 레벨", esc(ctx.il || "-") + (ctx.lv ? ' <em class="rs-tag">Lv.' + esc(ctx.lv) + "</em>" : ""), "전투력", esc(ctx.cp || "-")],
      ["OP 티어 <small>(최근 " + TIER_DAYS + "일)</small>", tierStamp("op"), "호감 티어 <small>(최근 " + TIER_DAYS + "일)</small>", tierStamp("favor")]
    ];
    $("rsInfo").innerHTML = '<table class="rs-tbl rs-info"><tbody>' + rows.map((r) => "<tr><th>" + r[0] + "</th><td>" + r[1] + "</td><th>" + r[2] + "</th><td>" + r[3] + "</td></tr>").join("") + "</tbody></table>";

    // 전적 표
    const trs = ["op", "favor"].map((m) => {
      const lab = '<th class="m-' + m + '">' + MODE[m].label + "</th>";
      if (m === "op" && isSupport) return "<tr>" + lab + '<td colspan="7" class="rs-dim">서포터 직각은 OP 토너먼트에서 제외됩니다.</td></tr>';
      if (S.rank[m] === undefined) return "<tr>" + lab + '<td colspan="7" class="rs-dim">불러오는 중…</td></tr>';
      const me = myRow(m);
      if (!me || !num(me.r.total_matches)) return "<tr>" + lab + '<td colspan="7" class="rs-dim">' + (S.rank[m] ? "아직 기록이 없어요." : "불러오지 못했어요.") + "</td></tr>";
      const raw = (S.tierRaw[m] || []).find(isMine);
      return "<tr>" + lab +
        '<td data-l="전체 경기" class="rs-hl m-' + m + '">' + comma(me.r.total_matches) + "전</td>" +
        "<td data-l=\"승\">" + comma(me.r.win_count) + "</td><td data-l=\"패\">" + comma(me.r.lose_count) + "</td>" +
        "<td data-l=\"전체 승률\"><b>" + pct(me.r.win_rate, 2) + "</b></td>" +
        "<td data-l=\"토너먼트 우승\">" + comma(me.r.champion_count) + '회 <small>(' + me.champRank + "위 / " + me.of + ")</small></td>" +
        "<td data-l=\"최근 " + TIER_DAYS + "일 승률\">" + (raw ? "<b>" + pct(raw.win_rate, 1) + "</b> <small>" + comma(raw.total_matches) + "전</small>" : (S.tierState[m] === "load" ? '<span class="rs-dim">…</span>' : '<span class="rs-dim">-</span>')) + "</td>" +
        "<td data-l=\"티어\">" + tierStamp(m) + "</td></tr>";
    });
    $("rsCareer").innerHTML = '<table class="rs-tbl rs-career"><thead><tr><th>구분</th><th>전체 경기</th><th>승</th><th>패</th><th>전체 승률</th><th>토너먼트 우승</th><th>최근 ' + TIER_DAYS + "일 승률</th><th>티어</th></tr></thead><tbody>" + trs.join("") + "</tbody></table>";
  }

  /* ---------- 같은 클래스 직각 비교 ---------- */
  function renderVs() {
    const box = $("rsVs");
    box.innerHTML = ["op", "favor"].map((m) => {
      let h = '<div class="rs-card"><h3><i style="background:' + MODE[m].color + '"></i>' + MODE[m].label + "</h3>";
      if (m === "op" && isSupport) return h + '<div class="rs-empty">서포터 직각은 OP 토너먼트에서 제외됩니다.</div></div>';
      const pool0 = poolOf(m);
      if (!pool0) return h + '<div class="rs-empty">불러오지 못했어요.</div></div>';
      const raw30 = {};
      (S.tierRaw[m] || []).forEach((r) => { raw30[r.engraving_name] = r; });
      const list = pool0.filter((r) => r.class_name === ctx.cls && num(r.total_matches) > 0)
        .sort((a, b) => (isMine(b) ? 1 : 0) - (isMine(a) ? 1 : 0) || num(b.win_rate) - num(a.win_rate));
      if (!list.some(isMine)) return h + '<div class="rs-empty">아직 기록이 없어요.</div></div>';
      if (list.length < 2) return h + '<div class="rs-empty">비교할 같은 클래스 직각이 없어요.</div></div>';
      const side = (r, me) => {
        const s = shortOf(r.engraving_name), r30 = raw30[r.engraving_name];
        return '<div class="rs-vs-side' + (me ? " me" : "") + '">' + iconImg(s, "rs-ico lg") +
          '<div class="nm">' + esc(s) + '</div>' +
          '<div class="rt"><span class="rs-pct">' + pct(r.win_rate, 2) + '</span></div>' +
          '<div class="sm"><span class="rs-m-total">' + comma(r.total_matches) + '전</span> <span class="rs-m-win">' + comma(r.win_count) + '승</span> <span class="rs-m-lose">' + comma(r.lose_count) + '패</span></div>' +
          '<div class="sm">최근 ' + TIER_DAYS + '일 <span class="rs-pct-sm">' + (r30 ? pct(r30.win_rate, 1) : '-') + '</span></div></div>';
      };
      if (list.length === 2) {
        const A = list[0], B = list[1], a = num(A.win_rate), b = num(B.win_rate), diff = a - b;
        const diffCls = Math.abs(diff) < 0.005 ? "" : (diff > 0 ? " up" : " down");
        const diffTxt = Math.abs(diff) < 0.005 ? "동률" : (esc(shortOf((diff > 0 ? A : B).engraving_name)) + " +" + Math.abs(diff).toFixed(2) + "%p");
        h += '<div class="rs-vs">' + side(A, true) + '<div class="rs-vs-mid">VS<span class="rs-diff' + diffCls + '">' + diffTxt + "</span></div>" + side(B, false) + "</div>" +
          '<div class="rs-vsbar"><i style="width:' + (a / (a + b) * 100) + "%;background:" + MODE[m].color + '"></i></div>';
      } else {
        const max = Math.max.apply(null, list.map((r) => num(r.win_rate)));
        h += '<div class="rs-bars">' + list.map((r) => {
          const me = isMine(r), s = shortOf(r.engraving_name);
          return '<div class="rs-bar' + (me ? " me" : "") + '">' + iconImg(s) + "<span class=\"nm\">" + esc(s) + "" + '</span><span class="tr"><i style="width:' + (num(r.win_rate) / max * 100) + "%;background:" + (me ? MODE[m].color : "#9aa1ad") + '"></i></span><b>' + pct(r.win_rate, 2) + "</b></div>";
        }).join("") + "</div>";
      }
      return h + "</div>";
    }).join("");
  }

  /* ---------- 우승자 분석 (클래스 기준) ---------- */
  function donutSvg(parts) {
    const R = 46, C = 2 * Math.PI * R;
    let off = 0, s = '<svg class="rs-donut" viewBox="0 0 120 120" role="img" aria-label="우승 비율 도넛 차트">';
    parts.forEach((p, i) => {
      const len = C * p.pct / 100;
      s += '<circle cx="60" cy="60" r="' + R + '" fill="none" stroke="' + DONUT_COLORS[i] + '" stroke-width="20" stroke-dasharray="' + len + " " + (C - len) + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 60 60)"/>';
      off += len;
    });
    return s + '<text x="60" y="57" text-anchor="middle" font-size="7.5" fill="#7b8190" font-weight="700">TOP 5</text><text x="60" y="70" text-anchor="middle" font-size="11" fill="#1b2230" font-weight="900">우승 비율</text></svg>';
  }
  function winnerCard(m, rows) {
    let h = '<div class="rs-card"><h3><i style="background:' + MODE[m].color + '"></i>' + esc(ctx.cls) + "가 선택한 " + MODE[m].short + " 직각</h3>";
    if (!rows || !rows.length) return h + '<div class="rs-empty">분석 데이터가 아직 없어요.</div></div>';
    const list = rows.map((r) => ({ name: shortOf(r.winner_engraving), v: num(r.pick_rate) })).sort((a, b) => b.v - a.v);
    const total = list.reduce((s, r) => s + r.v, 0);
    if (total <= 0) return h + '<div class="rs-empty">분석 데이터가 아직 없어요.</div></div>';
    const top = list.slice(0, 5).map((r) => ({ name: r.name, pct: r.v / total * 100 }));
    const etc = list.slice(5).reduce((s, r) => s + r.v, 0) / total * 100;
    const parts = etc > 0 ? top.concat([{ name: "기타", pct: etc, etc: true }]) : top;
    return h + '<div class="rs-donut-body">' + donutSvg(parts) + '<ul class="rs-legend">' +
      parts.map((p, i) => '<li><i style="background:' + DONUT_COLORS[i] + '"></i>' + (p.etc ? "" : iconImg(p.name, "rs-ico sm")) + "<span class=\"nm\">" + esc(p.name) + "</span><b>" + pct(p.pct, 1) + "</b></li>").join("") + "</ul></div></div>";
  }

  /* ---------- 상대 전적: 이기기 쉬운 / 이기기 힘든 직각 (OP + 호감 합산, match_logs 집계 함수 필요) ---------- */
  const MU_MIN = 30, MU_DAYS = 90;   // 최근 3개월(90일) 기록만 집계
  function muCard(kind, rows) {
    const easy = kind === "easy";
    let h = '<div class="rs-card rs-mu-card ' + kind + '"><h3><i style="background:' + (easy ? "#16905a" : "#c0262d") + '"></i>' + (easy ? "이기기 쉬운 직각" : "이기기 힘든 직각") +
      "<small>" + (easy ? "최근 · 승률이 가장 높은 상대 (" + MU_MIN + "전 이상)" : "최근 · 가장 많이 패배한 상대, 승률 낮은 순 (" + MU_MIN + "전 이상)") + "</small></h3>";
    if (!rows.length) return h + '<div class="rs-empty">표시할 기록이 아직 없어요.</div></div>';
    return h + '<ol class="rs-mu">' + rows.map((r, i) => {
      const sn = shortOf(r.name);
      return "<li><em>" + (i + 1) + "</em>" + iconImg(sn) + '<span class="nm">' + esc(sn) + '</span><span class="rc">' + comma(r.w) + "승 " + comma(r.l) + '패</span><b class="rt">' + pct(r.rate, 1) + "</b></li>";
    }).join("") + "</ol></div>";
  }
  function renderMatch(rows, failed) {
    const box = $("rsMatch");
    if (failed) { box.innerHTML = '<div class="rs-empty" style="grid-column:1/-1">상대 전적을 불러오지 못했어요.<br><small>토너먼트 DB에 get_matchup_stats_recent 함수가 필요해요.</small></div>'; return; }
    const list = (rows || []).map((r) => {
      const w = num(r.wins), l = num(r.losses), t = w + l;
      return { name: r.opponent, w, l, t, rate: t ? w / t * 100 : 0 };
    }).filter((r) => r.name && r.name !== ctx.full && r.t > 0);
    const MU_SKIP = ["회귀", "진용"];   // 서포터 직업의 딜러 각인은 이기기 쉬운 목록에서 제외
    const easy = list.filter((r) => r.t >= MU_MIN && !MU_SKIP.includes(shortOf(r.name))).sort((a, b) => b.rate - a.rate || b.t - a.t).slice(0, 5);
    const hard = list.filter((r) => r.t >= MU_MIN).sort((a, b) => b.l - a.l || a.rate - b.rate).slice(0, 5).sort((a, b) => a.rate - b.rate || b.l - a.l);   // 많이 진 상대 5개를 승률 낮은 순으로
    box.innerHTML = muCard("easy", easy) + muCard("hard", hard);
  }

  /* ---------- 승률 변화 (3일 합산) ---------- */
  const pad2 = (n) => String(n).padStart(2, "0");
  const fmtD = (d) => d.getUTCFullYear() + "-" + pad2(d.getUTCMonth() + 1) + "-" + pad2(d.getUTCDate());
  const parseD = (s) => { const a = s.split("-").map(Number); return new Date(Date.UTC(a[0], a[1] - 1, a[2])); };
  const addDays = (s, n) => { const d = parseD(s); d.setUTCDate(d.getUTCDate() + n); return fmtD(d); };
  const dayIdx = (s) => Math.round((parseD(s) - parseD(START_DATE)) / 864e5);
  const idxToDate = (i) => addDays(START_DATE, i);
  const md = (s) => { const a = s.split("-"); return Number(a[1]) + "/" + Number(a[2]); };
  const END_DATE = addDays(kst.getUTCFullYear() + "-" + pad2(kst.getUTCMonth() + 1) + "-" + pad2(kst.getUTCDate()), -1);   // 어제까지 (한국 시간)
  const END_IDX = dayIdx(END_DATE);
  const hist = { op: null, favor: null, failed: false };

  async function fetchRange(m, start, end) {
    const rows = await rpc("get_daily_winrate_history", { p_type: m, p_start: start, p_end: end }, 2);
    return rows.filter(isMine).map((r) => ({ i: dayIdx(r.date_key), w: num(r.win_count), t: num(r.total_matches) }));
  }
  async function loadHist(m) {
    if (m === "op" && isSupport) return [];
    const ck = "gg-hist2-" + m + "-" + ctx.short + "-" + END_DATE;
    try { const c = sessionStorage.getItem(ck); if (c) return JSON.parse(c); } catch (e) {}
    const tasks = [];
    for (let s = START_DATE; s <= END_DATE; s = addDays(s, CHUNK_DAYS)) {
      const e = addDays(s, CHUNK_DAYS - 1), end = e > END_DATE ? END_DATE : e;
      tasks.push(() => fetchRange(m, s, end).catch(() => { hist.failed = true; return []; }));
    }
    const out = new Array(tasks.length); let next = 0;
    await Promise.all([0, 1, 2].map(async () => { while (next < tasks.length) { const k = next++; out[k] = await tasks[k](); } }));   // 동시에 3개씩만 요청
    const byDay = new Map();
    out.flat().forEach((d) => { const o = byDay.get(d.i) || { i: d.i, w: 0, t: 0 }; o.w += d.w; o.t += d.t; byDay.set(d.i, o); });
    const days = [...byDay.values()].sort((a, b) => a.i - b.i);
    if (!hist.failed) { try { sessionStorage.setItem(ck, JSON.stringify(days)); } catch (e) {} }
    return days;
  }

  // UNIT일 구간으로 묶기: 어제부터 거꾸로 묶어서 가장 최근 구간이 꽉 찬 UNIT일. 경기가 없거나 승률 0%인 구간은 점을 찍지 않음
  function buildBuckets(days, unit) {
    unit = unit || UNIT;
    const map = new Map();
    days.forEach((d) => {
      const k = Math.floor((END_IDX - d.i) / unit);
      if (k < 0) return;
      const o = map.get(k) || { w: 0, t: 0 };
      o.w += d.w; o.t += d.t; map.set(k, o);
    });
    const res = new Map();
    map.forEach((o, k) => {
      if (o.t <= 0 || o.w <= 0) return;
      const to = END_IDX - k * unit, from = Math.max(0, to - unit + 1);
      res.set(k, { b: k, w: o.w, l: o.t - o.w, t: o.t, rate: o.w / o.t * 100, from, to, x: to, n: to - from + 1 });
    });
    return res;
  }
  const rangeTxt = (p) => (p.n > 1 ? md(idxToDate(p.from)) + " ~ " + md(idxToDate(p.to)) : md(idxToDate(p.from)));

  function renderGraph() {
    const box = $("rsGraph");
    const types = ["op", "favor"].filter((m) => !(m === "op" && isSupport));
    const bk = {}, series = {};
    types.forEach((m) => { bk[m] = buildBuckets(hist[m] || []); series[m] = [...bk[m].values()].sort((a, b) => a.x - b.x); });
    const vis = types.filter((m) => series[m].length);
    if (!vis.length) { box.innerHTML = '<div class="rs-empty">표시할 승률 기록이 없어요.</div>'; return; }

    const W = 1000, Ht = 330, P = { t: 18, r: 20, b: 30, l: 46 };
    const pw = W - P.l - P.r, ph = Ht - P.t - P.b;
    const maxR = Math.max.apply(null, vis.flatMap((m) => series[m].map((p) => p.rate)));
    const lo = 0, hi = Math.min(100, Math.max(60, Math.ceil((maxR + 5) / 10) * 10)), step = hi > 60 ? 20 : 10;
    const X = (i) => P.l + pw * i / END_IDX;
    const Y = (v) => P.t + (hi - v) / (hi - lo) * ph;
    const slot = pw * UNIT / END_IDX, nb = vis.length, bw = Math.max(3, Math.min(13, slot * 0.8 / nb - 1)), gap = 1.5;
    const cxOf = (p) => X(p.x - (p.n - 1) / 2);
    const yb = Y(lo);

    let s = '<svg class="rs-chart" id="rsSvg" viewBox="0 0 ' + W + " " + Ht + '" role="img" aria-label="승률 변화 막대 그래프"><defs>' +
      vis.map((m) => '<linearGradient id="rsBar-' + m + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + MODE[m].color + '"/><stop offset="1" stop-color="' + MODE[m].color + '" stop-opacity=".45"/></linearGradient>').join("") + "</defs>";
    s += '<rect id="rsBand" y="' + P.t + '" height="' + ph + '" width="' + slot.toFixed(1) + '" fill="rgba(27,34,48,.09)" style="display:none"/>';
    for (let v = lo; v <= hi + 0.01; v += step) s += '<line x1="' + P.l + '" x2="' + (W - P.r) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="rgba(27,34,48,.09)"/><text x="' + (P.l - 8) + '" y="' + (Y(v) + 4) + '" text-anchor="end">' + v + "%</text>";
    const every = Math.max(1, Math.ceil(END_IDX / 8));
    for (let i = 0; i <= END_IDX; i += every) s += '<text x="' + X(i) + '" y="' + (Ht - 10) + '" text-anchor="' + (i === 0 ? "start" : "middle") + '">' + md(idxToDate(i)) + "</text>";
    vis.forEach((m, mi) => series[m].forEach((p) => {
      const x = cxOf(p) - (nb * bw + (nb - 1) * gap) / 2 + mi * (bw + gap), y = Y(p.rate), rr = Math.min(3, bw / 2);
      s += '<path d="M' + x.toFixed(1) + " " + yb.toFixed(1) + "V" + (y + rr).toFixed(1) + "Q" + x.toFixed(1) + " " + y.toFixed(1) + " " + (x + rr).toFixed(1) + " " + y.toFixed(1) + "H" + (x + bw - rr).toFixed(1) + "Q" + (x + bw).toFixed(1) + " " + y.toFixed(1) + " " + (x + bw).toFixed(1) + " " + (y + rr).toFixed(1) + "V" + yb.toFixed(1) + 'Z" fill="url(#rsBar-' + m + ')"/>';
    }));
    s += '<line x1="' + P.l + '" x2="' + (W - P.r) + '" y1="' + Y(50) + '" y2="' + Y(50) + '" stroke="#b3202a" stroke-width="1.3" stroke-dasharray="5 4"/>' +
      '<line x1="' + P.l + '" x2="' + (W - P.r) + '" y1="' + yb + '" y2="' + yb + '" stroke="rgba(27,34,48,.6)" stroke-width="1.4"/></svg>';

    // 오른쪽 분석 패널: 기간 전체 승/패 도넛 + 우세 구간 비율
    const side = vis.map((m) => {
      const days = hist[m] || [];
      const Wn = days.reduce((a, d) => a + d.w, 0), Tn = days.reduce((a, d) => a + d.t, 0), Ln = Tn - Wn;
      const sup = series[m].filter((p) => p.rate >= 50).length, tot = series[m].length;
      const R = 34, C = 2 * Math.PI * R, wl = Tn ? C * Wn / Tn : 0;
      return '<div class="rs-sidecard"><h4><i style="background:' + MODE[m].color + '"></i>' + MODE[m].label + "<small>분석</small></h4><div class=\"rs-sd-body\">" +
        '<svg class="rs-mini" viewBox="0 0 90 90" role="img" aria-label="' + MODE[m].short + ' 승패 비율"><circle cx="45" cy="45" r="' + R + '" fill="none" stroke="#d9d3c0" stroke-width="12"/>' +
        '<circle cx="45" cy="45" r="' + R + '" fill="none" stroke="' + MODE[m].color + '" stroke-width="12" stroke-linecap="butt" stroke-dasharray="' + wl.toFixed(1) + " " + (C - wl).toFixed(1) + '" transform="rotate(-90 45 45)"/>' +
        '<text x="45" y="45" text-anchor="middle" font-size="15" font-weight="900" fill="#1b2230">' + (Tn ? (Wn / Tn * 100).toFixed(1) : "-") + '</text><text x="45" y="58" text-anchor="middle" font-size="7.5" font-weight="800" fill="#7b8190">전체 승률</text></svg>' +
        '<ul class="rs-sd-list"><li><i style="background:' + MODE[m].color + '"></i>승<b>' + comma(Wn) + '</b></li><li><i style="background:#d9d3c0"></i>패<b>' + comma(Ln) + "</b></li>" +
        '<li class="sp">우세 구간<b>' + sup + " / " + tot + "</b></li></ul></div>" +
        '<div class="rs-sd-bar"><i style="width:' + (tot ? sup / tot * 100 : 0) + "%;background:" + MODE[m].color + '"></i></div></div>';
    }).join("");

    let h = '<div class="rs-legendrow">' + vis.map((m) => '<span><i style="background:' + MODE[m].color + '"></i>' + MODE[m].label + "</span>").join("") + '<small>빨간 점선 = 승률 50% · 마우스를 올리면 ' + UNIT + '일 합산 전적</small></div>';
    h += '<div class="rs-chartrow"><div class="rs-chart-wrap" id="rsWrap">' + s + '<div class="rs-tip" id="rsTip" style="display:none"></div></div><div class="rs-side">' + side + "</div></div>";

    // 요약
    h += '<div class="rs-two rs-sum">' + vis.map((m) => {
      const pts = series[m], first = pts[0], last = pts[pts.length - 1];
      const mx = pts.reduce((a, p) => (p.rate > a.rate ? p : a)), mn = pts.reduce((a, p) => (p.rate < a.rate ? p : a));
      const T = pts.reduce((a, p) => a + p.t, 0), Wn = pts.reduce((a, p) => a + p.w, 0);
      return '<div class="rs-card"><h3><i style="background:' + MODE[m].color + '"></i>' + MODE[m].label + '</h3><div class="rs-sum-grid">' +
        "<div>시작<b>" + pct(first.rate) + "</b><small>" + md(idxToDate(first.to)) + "</small></div>" +
        "<div>현재<b>" + pct(last.rate) + "</b><small>" + md(idxToDate(last.to)) + "</small></div>" +
        "<div>평균<b>" + pct(Wn / T * 100) + "</b><small>" + comma(T) + "전</small></div>" +
        "<div>최고<b>" + pct(mx.rate) + "</b><small>" + md(idxToDate(mx.to)) + "</small></div>" +
        "<div>최저<b>" + pct(mn.rate) + "</b><small>" + md(idxToDate(mn.to)) + "</small></div>" +
        "<div>구간 수<b>" + pts.length + "개</b><small>" + UNIT + "일 단위</small></div></div></div>";
    }).join("") + "</div>";

    // 최근 구간별 UNIT_T일 합산 전적 표
    const bkT = {}; vis.forEach((m) => { bkT[m] = buildBuckets(hist[m] || [], UNIT_T); });
    const bset = new Set(); vis.forEach((m) => bkT[m].forEach((_, b) => bset.add(b)));
    const recent = [...bset].sort((a, b) => a - b).slice(0, 10);   // 키가 작을수록 최근 구간
    h += '<table class="rs-tbl rs-recent"><thead><tr><th>기간 (' + UNIT_T + '일 합산)</th>' + vis.map((m) => '<th class="m-' + m + '">' + MODE[m].label + " 전적</th>").join("") + "</tr></thead><tbody>" +
      recent.map((b) => {
        const to = END_IDX - b * UNIT_T, from = Math.max(0, to - UNIT_T + 1);
        const label = from === to ? md(idxToDate(from)) : md(idxToDate(from)) + " ~ " + md(idxToDate(to));
        return "<tr><th>" + label + "</th>" + vis.map((m) => { const p = bkT[m].get(b); return "<td>" + (p ? p.w + "승 " + p.l + "패 <small>(" + p.t + "전)</small> <b>" + pct(p.rate) + "</b>" : '<span class="rs-dim">-</span>') + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table>";
    h += '<div class="rs-note">경기가 없거나 승률이 0%인 구간은 막대를 그리지 않고 건너뜁니다.' + (hist.failed ? " · 일부 기간은 불러오지 못했어요." : "") + "</div>";
    box.innerHTML = h;

    const svg = $("rsSvg"), wrap = $("rsWrap"), tip = $("rsTip"), band = $("rsBand");
    function leave() { tip.style.display = "none"; band.style.display = "none"; }
    svg.addEventListener("pointermove", (ev) => {
      const r = svg.getBoundingClientRect(), vx = (ev.clientX - r.left) / r.width * W;
      let best = null;
      vis.forEach((m) => series[m].forEach((p) => { const dx = Math.abs(cxOf(p) - vx); if (!best || dx < best.dx) best = { dx, b: p.b, c: cxOf(p) }; }));
      if (!best || best.dx > slot * 0.9 + 6) { leave(); return; }
      band.setAttribute("x", (best.c - slot / 2).toFixed(1)); band.style.display = "";
      let rows = "", head = "";
      vis.forEach((m) => {
        const p = bk[m].get(best.b);
        if (!p) return;
        head = head || rangeTxt(p) + " · " + p.n + "일 합산";
        rows += '<div class="r"><i style="background:' + MODE[m].color + '"></i>' + MODE[m].short + "<b>" + pct(p.rate, 1) + '</b></div><div class="s">' + p.w + "승 " + p.l + "패 · 합산 " + p.t + "전</div>";
      });
      tip.innerHTML = '<div class="d">' + head + "</div>" + rows;
      tip.style.display = "block";
      const wr = wrap.getBoundingClientRect();
      let left = ev.clientX - wr.left + 14;
      if (left + tip.offsetWidth > wr.width - 4) left = ev.clientX - wr.left - tip.offsetWidth - 14;
      tip.style.left = Math.max(4, left) + "px";
      tip.style.top = Math.max(4, ev.clientY - wr.top - tip.offsetHeight / 2) + "px";
    });
    svg.addEventListener("pointerleave", leave);
  }

  /* ---------- 데이터 로드 ---------- */
  renderTop();

  const pRank = Promise.all(["op", "favor"].map((m) =>
    rest("ranking_overall?select=class_name,engraving_name,champion_count,win_count,lose_count,total_matches,win_rate&tournament_type=eq." + m)
      .then((rows) => { S.rank[m] = rows; }).catch((e) => { console.warn("ranking", e); S.rank[m] = null; })
  )).then(() => { renderTop(); renderVs(); });

  const pTier = Promise.all(["op", "favor"].map((m) => {
    if (m === "op" && isSupport) { S.tierState[m] = "ok"; return Promise.resolve(); }
    return rpc("get_tier_data", { p_type: m, p_days: TIER_DAYS }).then((rows) => {
      const list = m === "op" ? rows.filter((r) => !SUPPORT.includes(r.engraving_name)) : rows;
      S.tierRaw[m] = list;
      S.tier[m] = calcTier(list.map((r) => ({ winRate: num(r.win_rate), total: num(r.total_matches), mine: isMine(r) })));
      S.tierState[m] = "ok";
    }).catch((e) => { console.warn("tier", e); S.tierState[m] = "err"; });
  })).then(() => { renderTop(); renderVs(); });

  Promise.all(["op", "favor"].map((m) => rpc("get_class_winner_stats", { p_class: ctx.cls, p_type: m }).catch(() => null)))
    .then((res) => { $("rsWin").innerHTML = winnerCard("op", res[0]) + winnerCard("favor", res[1]); });

  // 그래프는 티어/전적 요청이 끝난 뒤에 시작 (서버에 요청이 한꺼번에 몰리지 않게)
  Promise.all([pRank, pTier]).then(() => { rpc("get_matchup_stats_recent", { p_engraving: ctx.full, p_start: addDays(END_DATE, -(MU_DAYS - 1)) }, 2).then((rows) => renderMatch(rows)).catch((e) => { console.warn("matchup", e); renderMatch(null, true); }); return Promise.all([loadHist("op"), loadHist("favor")]); }).then((r) => {
    hist.op = r[0]; hist.favor = r[1];
    renderGraph();
  }).catch(() => { $("rsGraph").innerHTML = '<div class="rs-empty">승률 기록을 불러오지 못했어요.</div>'; });
})();
