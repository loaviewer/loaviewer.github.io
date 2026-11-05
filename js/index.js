import {
    raidMeta,
    MORDUM_EX_DATA,
    RAID_BATTLE_ITEMS,
    simpleData,
    simpleRaidMeta,
    simpleRaidKickerMap,
    exRaidData,
    serkaRewardData,
    cathedralRewardData,
    belgardinRewardData,
    lineCutConfig,
    gato1730Bosses,
    gato1750Bosses,
    gato1770Bosses,
    gato1730AvailableBosses,
    gato1750AvailableBosses,
    gato1770AvailableBosses,
    gato1730Layout,
    gato1750Layout,
    gato1770Layout,
    gatoMeta,
    PRECISION_SHARE_BY_MENU,
    QUICK_MOVE_PAGES,
    QUICK_MOVE_SIMPLE_GROUP,
    QUICK_MOVE_PRECISION_GROUP,
    QUICK_MOVE_SYNERGY_LINK,
    RAID_MEMBER_COUNT
} from "./data.js";
import {
    initJongmakEsEvents,
    initMordumTacticTooltip,
    getJongmakLive,
    getJongmakDefaultTime,
    makeMordumLineCutTimelineHtml,
    setJongmakEsScrollLock,
    makeJongmakLineCutTimelineHtml,
    renderExtremeSection
} from "./extreme.js";

/* =============================================
   전역 변수 & 상수
   ============================================= */
const CSV_URL = "https://docs.google.com/spreadsheets/d/1v4gfG-Lr0iFmiP0PXtVTsijdMziekQaZ-wBTWrobncY/export?format=csv&gid=0";

export let currentMenu = "simple";
export let currentCombo = "hard_gate1";
let currentGatoBoss = "루멘칼리고";
let currentGato1750Boss = "루멘칼리고";
let currentGato1770Boss = "루멘칼리고";
let currentSimpleLevel = "1770";
let currentGuardianTier = "1770";
let acMembers = 4;
let currentSimpleRaid = "belgardin";
export let currentExtremeRaid = "mordum"; // "jongmak" | "mordum" | "abrel" | "egir"
export let detailTabState = { serka: "percent", cathedral: "percent", belgardin: "percent", jongmak: "percent" };
export let currentRoleMode = "dealer"; // "dealer" | "support"
let battleItemChoiceState = {}; // key: `${menu}_${gateKey}_${role}_${groupIdx}` → 선택된 옵션 인덱스

// [분리] extreme.js 는 아래 let 변수를 직접 재할당할 수 없으므로(ES 모듈 import 는 읽기 전용) setter 를 통해 변경합니다.
export function setCurrentExtremeRaid(v) { currentExtremeRaid = v; }
export function setCurrentCombo(v) { currentCombo = v; }



// [개선판] 광고 iframe을 절대 이동/제거하지 않는 방식.
// mainContent 안에 "히어로 자리 / 광고 자리(고정) / 본문 자리" 뼈대를 최초 1회만 만들고,
// 이후 재렌더링(버튼 클릭 등)에서는 히어로와 본문만 갈아끼우고 광고 자리는 절대 건드리지 않음.



export function setMainContentWithAdPreservation(heroHtml, miniHeroHtml, bodyHtml) {
    const mainContent = document.getElementById("mainContent");
    const heroSlot = document.getElementById("precisionHeroSlot"); // 이제 content-grid 바깥(HTML에 이미 존재)
    let bodySlot = document.getElementById("precisionBodySlot");

    // 최초 1회만: 히어로 슬롯 내부를 [큰히어로 자리] - [광고 자리(고정)] - [미니히어로 자리]로 나눠서 뼈대를 만듭니다.
    // 이후 재렌더링(난이도/관문 클릭 등)에서는 큰히어로/미니히어로 내용만 갈아끼우고 광고 노드는 절대 건드리지 않습니다.
    if (heroSlot && !document.getElementById("precisionBigHeroSlot")) {
        heroSlot.innerHTML = `
            <div id="precisionBigHeroSlot"></div>
            <!-- 대형 수평 광고판 (간편보기와 동일 여백 / PC 970x250 · 모바일 90px) -->
            <div class="simple-top-ad-wrap" style="width:100%;max-width:100%;overflow:hidden;display:flex;justify-content:center;align-items:center;margin:14px auto 40px;">
                ${window.loaviewCenterAdHtml ? window.loaviewCenterAdHtml() : ""}
            </div>
            <div class="divider common-divider-bottom" style="margin-top:40px;margin-bottom:70px;"><hr class="divider-line"></div>
            <div id="precisionMiniHeroSlot"></div>
        `;

        // innerHTML로 넣은 광고 슬롯은 script가 실행되지 않으므로 여기서 직접 display/refresh (간편보기와 동일 로직)
        try { window.loaviewPushAdsense && window.loaviewPushAdsense(heroSlot); } catch (e) {}
    }

    if (!bodySlot) {
        mainContent.innerHTML = `<div id="precisionBodySlot"></div>`;
        bodySlot = document.getElementById("precisionBodySlot");
    }

    const bigHeroSlot = document.getElementById("precisionBigHeroSlot");
    const miniHeroSlot = document.getElementById("precisionMiniHeroSlot");
    if (bigHeroSlot) bigHeroSlot.innerHTML = heroHtml;
    if (miniHeroSlot) miniHeroSlot.innerHTML = miniHeroHtml;
    bodySlot.innerHTML = bodyHtml;
}




// 가디언 토벌 이번주 로테이션 (Asia/Seoul, common.js와 동일)
const HG_BOSSES = [
  "루멘칼리고","가르가디스","스콜라키아","크라티오스","아게오로스",
  "드렉탈라스","소나벨","베스칼","쿤겔라니움","하누마탄",
  "데스칼루다","이그렉시온","벨가누스","아카테스","엘버하스틱"
];
const HG_ANCHOR_MS = Date.parse("2026-07-29T10:00:00+09:00");
const HG_ANCHOR_IDX = 13;
function getHgWeekBoss(atMs) {
  const nowMs = atMs != null ? atMs : Date.now();
  const weeks = Math.floor((nowMs - HG_ANCHOR_MS) / (7 * 24 * 60 * 60 * 1000));
  const idx = ((HG_ANCHOR_IDX + weeks) % HG_BOSSES.length + HG_BOSSES.length) % HG_BOSSES.length;
  return HG_BOSSES[idx];
}





function normalizePathname(pathname) {
  let p = pathname;

  // /index.html -> /
  if (p === "/index.html" || p === "/index") return "/";

  // /abc/index.html -> /abc
  p = p.replace(/\/index\.html$/, "");
  p = p.replace(/\/index$/, "");

  // .html 제거
  p = p.replace(/\.html$/, "");

  // 끝 슬래시 제거 (루트 / 는 제외)
  if (p.length > 1 && p.endsWith("/")) {
    p = p.slice(0, -1);
  }

  return p;
}

const currentPathname = normalizePathname(window.location.pathname);

const isPath = (target) => currentPathname === target;

const isStandaloneLevelPage = isPath("/dps/level");
const isStandaloneRaidPage = isPath("/dps/raid");
const isStandaloneSerkaPage = isPath("/dps/serka");
const isStandaloneCathedralPage = isPath("/dps/cathedral");
const isStandaloneGuardianPage = isPath("/dps/guardian");
const isStandaloneBelgardinPage = isPath("/dps/belgardin");
const isStandaloneExtremePage = isPath("/dps/extreme");




/* =============================================
   URL / canonical 갱신
   ============================================= */

function updateCanonicalAndUrl(menu) {
    if (
        isStandaloneLevelPage ||
        isStandaloneRaidPage ||
        isStandaloneSerkaPage ||
        isStandaloneCathedralPage ||
        isStandaloneGuardianPage ||
        isStandaloneBelgardinPage ||
        isStandaloneExtremePage
    ) return;

    const canonicalTag = document.querySelector('link[rel="canonical"]');
    const baseUrl = "https://loaviewer.github.io/";
    const newUrl = (menu === "simple" || !menu)
        ? baseUrl
        : `${baseUrl}?menu=${menu}`;

    if (canonicalTag) {
        canonicalTag.setAttribute("href", newUrl);
    }

    const currentPath = window.location.pathname + window.location.search;
    const targetPath = (menu === "simple" || !menu) ? "/" : `/?menu=${menu}`;

    if (currentPath !== targetPath) {
        history.pushState({}, "", targetPath);
    }
}


/* =============================================
   파싱 데이터 저장소
   ============================================= */
const parsedData = {
    serka: { normal: [], hard: [], nightmare: [] },
    cathedral: { normal: [], hard: [], nightmare: [] },
    belgardin: { normal: [], hard: [], nightmare: [] },
    extreme: {
        mordum:  { normal: [], hard: [], nightmare: [] },
        jongmak: { normal: [], hard: [], nightmare: [] }
    },
    gato1730: {},
    gato1750: {},
    gato1770: {}
};





function getRaidBattleLoadout(menu, diffKey, gateKey, role) {
    const raidData = RAID_BATTLE_ITEMS[menu];
    if (!raidData) return null;
    const gateData = raidData[gateKey];
    if (!gateData) return null;
    return gateData[role] || null;
}

// 100% 클리어 기준값에서 역산해 구간별(줄 수) 요구 수치를 계산
// progress = (총 줄 수 - 남은 줄 수) / 총 줄 수
// ※ 시간은 실측 구간 타임이 없어 클리어타임 × progress로 선형 근사한 참고값입니다.
function getLineCutRows(menu, gateKey, totalSec, fullTank, fullOne, fullBlood) {
    const config = lineCutConfig[menu] && lineCutConfig[menu][gateKey];
    if (!config) return [];

    const total = config.total;

    return config.points.map(p => {
        const progress = (total - p.line) / total;
        const elapsedSec = Math.round(totalSec * progress);

        return {
            line: p.line,
            desc: p.desc,
            progress,
            tank: Math.round((fullTank || 0) * progress),
            one: Math.round((fullOne || 0) * progress),
            blood: Math.round((fullBlood || 0) * progress),
            elapsedSec
        };
    });
}

function makeLineCutTimelineHtml(menu, gateKey, totalSec, fullTank, fullOne, fullBlood, diffKey, lineShares) {
    // 종막 EX는 2-1 / 2-2 / 2-3 관문 단위로 계산
    if (menu === "jongmak") {
        return makeJongmakLineCutTimelineHtml(diffKey, totalSec);
    }

    // 모르둠 EX는 1페이즈(500줄)와 2페이즈(발악쉴드)를 나눠서 계산
    if (menu === "mordum") {
        return makeMordumLineCutTimelineHtml(diffKey, totalSec, fullTank, fullOne, fullBlood, lineShares);
    }

    const rows = getLineCutRows(menu, gateKey, totalSec, fullTank, fullOne, fullBlood);
    if (!rows.length) {
        return '<div class="coming-soon"><h3>준비중</h3><p>구간 데이터가 없습니다.</p></div>';
    }

    // [오류 해결] 에러를 유발하던 무의미한 config 관련 줄을 완전히 제거했습니다.

    // 서폿 모드일 때 라벨을 강조 / 잔조로 동적 변경
    const isSupport = currentRoleMode === "support";
    const tankLabel = isSupport ? "강조" : "강투";
    const bloodLabel = isSupport ? "잔조" : "잔혈";

    // DPS = 피해량 / 전분시간 (요약 카드와 같은 식). 구간 시간을 줄 수 비율로 근사하므로 모든 줄에서 같은 값이 나옴
    const dpsOf = (full) => totalSec > 0 ? floorTo1(Math.floor(full || 0) / totalSec) : 0;
    const fmtShareG = (v) => Number.isInteger(v) ? String(v) : Number(v).toFixed(1);
    const triG = (cls, label, dmg, full) => `
                        <div class="lc-tri ${cls}">
                            <span class="lc-tri-label">${label}${lineShares && lineShares[cls] != null ? ` <em>${fmtShareG(lineShares[cls])}%</em>` : ""}</span>
                            <span class="lc-tri-value is-dps"><span class="lc-tri-cap">DPS</span>${dpsOf(full).toFixed(1)}<span class="lc-dps-unit">억</span></span>
                            <span class="lc-tri-dps">피해<span class="sm-hide">량</span> ${fmt(dmg)}억</span>
                        </div>`;

    const items = rows.map((r, idx) => {
        const isStart = r.progress === 0;
        const isLast = idx === rows.length - 1;
        const timeLabel = `${String(Math.floor(r.elapsedSec / 60)).padStart(2, "0")}:${String(r.elapsedSec % 60).padStart(2, "0")}`;
        const lineLabel = r.line === 0 ? "0줄 (클리어)" : `${r.line}줄`;

        if (isStart) {
            return `
                <div class="line-cut-row line-cut-start">
                    <div class="line-cut-marker">
                        <span class="line-cut-dot start"></span>
                        <span class="line-cut-connector"></span>
                    </div>
                    <div class="line-cut-start-label">${lineLabel} - 조우 시작</div>
                </div>
            `;
        }

        return `
            <div class="line-cut-row ${isLast ? "line-cut-clear" : ""}">
                <div class="line-cut-marker">
                    <span class="line-cut-dot"></span>
                    ${isLast ? "" : '<span class="line-cut-connector"></span>'}
                </div>
                <div class="line-cut-body">
                    <div class="line-cut-label-row">
                        <span class="line-cut-line-num">${lineLabel}</span>
                        <span class="line-cut-time">누적 ${timeLabel} (근사)</span>
                    </div>
                    ${r.desc ? `<div class="line-cut-desc">${r.desc}</div>` : ""}
                   
                    <div class="line-cut-card">
                        ${triG("tank", tankLabel, r.tank, fullTank)}
                        ${triG("one", "1인분", r.one, fullOne)}
                        ${triG("blood", bloodLabel, r.blood, fullBlood)}
                    </div>
                </div>
            </div>
        `;
    }).join("");

    return `<div class="line-cut-timeline lc-colored">${items}</div>`;
}





export function buildSummaryAndDetailHtml(menu, gateKey, raidName, meta, tableRowsHtml, totalSec, rowTank, rowOne, rowBlood, getDamage, isSupport) {
    const timeBadge = `전분시간 : ${String(Math.floor(totalSec / 60)).padStart(2, "0")}분 ${String(totalSec % 60).padStart(2, "0")}초`;
    // 종막 EX: 2-3 체력이 추정값이라 합계 숫자에도 추정이 섞여 있음을 표시
    // (나메는 택틱 정리 자료의 실측 체력이라 배지 없음 / 하드·노말은 나메 비율로 추정한 값)
    const estBadgeHtml = (menu === "jongmak" && meta && meta.diffKey !== "nightmare") ? `<div class="precision-table-badge jm-est-badge" title="하드/노말의 2-3·발악 체력은 인게임에 표시되지 않아 나메 비율로 추정한 값입니다">2-3·발악 추정 포함</div>` : "";
    const titleText = `${raidName} ${meta.title.replace(/\s*\(.+\)/, "")} ${meta.gateName}`;
    const sectionDivider = `<div class="precision-section-divider"><span>딜지분 상세보기</span></div>`;

    const headLabels = isSupport
        ? { share: "조력지분", dmg: "조력피해/억", dps: "조력 DPS" }
        : { share: "딜지분", dmg: "피해/억", dps: "DPS" };

    const percentTableHtml = `
        <div class="table-wrap">
            <table id="dataTable">
                <thead><tr><th>${headLabels.share}</th><th>${headLabels.dmg}</th><th>${headLabels.dps}</th></tr></thead>
                <tbody>${tableRowsHtml}</tbody>
            </table>
        </div>
    `;

    const hasLineCut = !!(lineCutConfig[menu] && lineCutConfig[menu][gateKey]);
    const activeTab = hasLineCut ? (detailTabState[menu] || "percent") : "percent";

    // 라인컷이 없으면 (세르카, 성당 등 구간별 데이터 없는 관문) - 상세 딜지분만 표시
    if (!hasLineCut) {
        return `
            ${sectionDivider}
            ${makePrecisionSummary(rowTank, rowOne, rowBlood, getDamage, totalSec, menu, isSupport)}

            <div class="precision-table-panel">
                <div class="precision-table-head">
                    <div class="precision-table-title">${titleText} 상세 딜지분</div>
                    <div class="precision-badges">${estBadgeHtml}<div class="precision-table-badge" id="precisionTimeBadge">${timeBadge}</div></div>
                </div>
                ${percentTableHtml}
            </div>
        `;
    }

    // 라인컷 지원되는 관문 (벨가르딘 등) - 탭 노출
    const tabBarHtml = `
        <div class="detail-tab-bar">
            <div class="detail-tabs">
                <button type="button" class="detail-tab ${activeTab === "percent" ? "active" : ""}" data-detail-tab="percent" data-detail-menu="${menu}">상세 딜지분</button>
                <button type="button" class="detail-tab ${activeTab === "lines" ? "active" : ""}" data-detail-tab="lines" data-detail-menu="${menu}">구간별 딜지분</button>
            </div>
            <div class="control-divider"></div>
            ${makeRoleToggleHtml("compact")}
        </div>
    `;

    if (activeTab === "lines") {
        const fullTank = rowTank ? getDamage(rowTank) : 0;
        const fullOne = rowOne ? getDamage(rowOne) : 0;
        const fullBlood = rowBlood ? getDamage(rowBlood) : 0;
        // 요약 카드와 같은 지분(%) (서폿 모드는 환산된 지분)
        const baseShares = getPrecisionShares(menu);
        const shareOf = (row, def) => (isSupport && row && row.share !== undefined) ? row.share : def;
        const lineShares = { tank: shareOf(rowTank, baseShares.tank), one: shareOf(rowOne, baseShares.one), blood: shareOf(rowBlood, baseShares.blood) };
        const lineTimelineHtml = makeLineCutTimelineHtml(menu, gateKey, totalSec, fullTank, fullOne, fullBlood, meta && meta.diffKey, lineShares);

        return `
            ${sectionDivider}
            ${tabBarHtml}

            <div class="precision-table-panel">
                <div class="line-cut-section-head">
                    <div class="line-cut-section-title">${titleText} 구간별 딜지분</div>
                    <div class="precision-badges">${estBadgeHtml}<div class="precision-table-badge" id="precisionTimeBadgeLines">${timeBadge}</div></div>
                </div>
                ${lineTimelineHtml}
            </div>
        `;
    }

    return `
        ${sectionDivider}
        ${tabBarHtml}
        ${makePrecisionSummary(rowTank, rowOne, rowBlood, getDamage, totalSec, menu, isSupport)}

        <div class="precision-table-panel">
            <div class="precision-table-head">
                <div class="precision-table-title">${titleText} 상세 딜지분</div>
                <div class="precision-badges">${estBadgeHtml}<div class="precision-table-badge" id="precisionTimeBadgePercent">${timeBadge}</div></div>
            </div>
            ${percentTableHtml}
        </div>
    `;
}

function isGato1730Available(boss) {
    return gato1730AvailableBosses.includes(boss);
}
function isGato1750Available(boss) {
    return gato1750AvailableBosses.includes(boss);
}
function isGato1770Available(boss) {
    return gato1770AvailableBosses.includes(boss);
}

/* =============================================
   가디언 티어별 보스 변수 (1730 / 1750 / 1770)
   ============================================= */
function getCurrentGuardianBoss() {
    if (currentGuardianTier === "1730") return currentGatoBoss;
    if (currentGuardianTier === "1750") return currentGato1750Boss;
    return currentGato1770Boss;
}
function setCurrentGuardianBoss(boss) {
    if (currentGuardianTier === "1730") currentGatoBoss = boss;
    else if (currentGuardianTier === "1750") currentGato1750Boss = boss;
    else currentGato1770Boss = boss;
}
function getGuardianBossListByTier(tier) {
    if (tier === "1730") return gato1730Bosses;
    if (tier === "1750") return gato1750Bosses;
    return gato1770Bosses;
}
function getGuardianAvailListByTier(tier) {
    if (tier === "1730") return gato1730AvailableBosses;
    if (tier === "1750") return gato1750AvailableBosses;
    return gato1770AvailableBosses;
}
function isGuardianBossAvailable(tier, boss) {
    if (tier === "1730") return isGato1730Available(boss);
    if (tier === "1750") return isGato1750Available(boss);
    return isGato1770Available(boss);
}
function getGuardianParsedRows(tier, boss) {
    if (tier === "1730") return parsedData.gato1730[boss] || [];
    if (tier === "1750") return parsedData.gato1750[boss] || [];
    return parsedData.gato1770[boss] || [];
}

/* =============================================
   유틸 함수
   ============================================= */
export function makeBadge(text, cls) {
    const emoji = getAttrEmoji(text, cls);
    const finalText = emoji ? `${emoji} ${text}` : text;
    return `<span class="badge ${cls}">${finalText}</span>`;
}

export function fmt(v) {
    return Number(v || 0).toLocaleString("ko-KR");
}

function fmtPartyDps(v) {
    return `${Number(v || 0).toLocaleString("ko-KR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}억`;
}

function toNum(v) {
    if (v == null) return 0;
    const t = String(v).replace(/,/g, "").replace(/"/g, "").trim();
    const n = Number(t);
    return isNaN(n) ? 0 : n;
}

function parseCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === "," && !inQuotes) {
            result.push(current);
            current = "";
        } else {
            current += ch;
        }
    }

    result.push(current);
    return result;
}

function percentNum(v) {
    // 소수 딜지분(예: 16.60%)도 정확히 인식하도록 소수부까지 매칭
    const m = String(v || "").match(/(\d+(?:\.\d+)?)%/);
    return m ? Number(m[1]) : null;
}


function getPrecisionShares(menu) {
    return PRECISION_SHARE_BY_MENU[menu] || PRECISION_SHARE_BY_MENU.default;
}


function getRoleMultiplier() {
    return currentRoleMode === "support" ? 1.25 : 1;
}

export function floorTo1(n) {
    return Math.floor(n * 10) / 10;
}

// 딜러표(dataRows)를 기준으로 서폿 강조컷/1인분/잔조컷 지점을 보간 계산
// getDamage: row -> 피해량(억) 반환 함수





// 딜러표(dataRows)를 기준으로 서폿 강조컷/1인분/잔조컷 지점을 보간 계산 및 테이블 정적 범위 변환
export function computeSupportConversion(dataRows, shares, getDamage) {
    const sorted = dataRows
        .filter(r => getDamage(r) > 0)
        .sort((a, b) => a.share - b.share);

    if (!sorted.length) return { rows: [], anchors: {} };

    // 특정 %(share) 지점의 피해량을 두 인접 행 사이에서 선형 보간(역산)해 구함
    function damageAtShare(share) {
        for (let i = 0; i < sorted.length; i++) {
            if (Math.abs(sorted[i].share - share) < 1e-9) {
                return getDamage(sorted[i]);
            }
        }
        for (let i = 0; i < sorted.length - 1; i++) {
            const a = sorted[i], b = sorted[i + 1];
            if (share > a.share && share < b.share) {
                const da = getDamage(a), db = getDamage(b);
                const frac = (share - a.share) / (b.share - a.share);
                return da + frac * (db - da);
            }
        }
        const last = sorted[sorted.length - 1];
        const prev = sorted[sorted.length - 2];
        if (prev && share > last.share) {
            const da = getDamage(prev), db = getDamage(last);
            const frac = (share - prev.share) / (last.share - prev.share);
            return da + frac * (db - da);
        }
        const first = sorted[0];
        const second = sorted[1];
        if (second && share < first.share) {
            const da = getDamage(first), db = getDamage(second);
            const frac = (share - first.share) / (second.share - first.share);
            return da + frac * (db - da);
        }
        return null;
    }

    // 목표 %는 기준% × 1.25로 이미 확정된 값이므로, 그 지점의 피해량만 보간
    function makeAnchor(baseShare) {
        const targetShare = Math.floor(baseShare * 1.25 * 10) / 10;
        const dmg = damageAtShare(targetShare);
        if (dmg == null) return null;
        return { share: targetShare, damage: Math.floor(dmg) };
    }

    const anchors = {
        gangjo: makeAnchor(shares.tank),
        ilinbun: makeAnchor(shares.one),
        janjo: makeAnchor(shares.blood)
    };

    // [핵심 변경] 8인 레이드(벨가르딘) 여부에 따라 정수 테이블의 범위를 동적으로 생성
    const is8Man = (shares.tank === 15); // 벨가르딘은 강투 지분이 15%입니다.
    const startShare = is8Man ? 15 : 35; // 8인은 15%부터, 4인은 35%부터 시작
    const endShare = is8Man ? 35 : 55;   // 8인은 35%까지, 4인은 55%까지 표시

    const merged = [];
    
    // 정해진 범위의 서폿 정수 지분율에 맞게 딜러 피해량을 선형 보간하여 행 생성
    for (let s = startShare; s <= endShare; s++) {
        const dmg = damageAtShare(s);
        if (dmg !== null) {
            merged.push({ share: s, damage: Math.floor(dmg), label: null });
        }
    }

    // 강조컷, 1인분, 잔조컷 등의 특수 소수점 앵커(예: 37.5%, 41.2% 등)를 적재적소에 머지
    Object.entries(anchors).forEach(([key, anchor]) => {
        if (!anchor) return;
        const dupIdx = merged.findIndex(r => Math.abs(r.share - anchor.share) < 1e-9);
        if (dupIdx >= 0) {
            merged[dupIdx].label = key;
            merged[dupIdx].damage = anchor.damage;
        } else {
            merged.push({ share: anchor.share, damage: anchor.damage, label: key });
        }
    });

    merged.sort((a, b) => a.share - b.share);

    return { rows: merged, anchors };
}










export function renderSupportShareCell(row) {
    const tagMap = {
        gangjo: { tag: "강조", cls: "tag-30" },
        ilinbun: { tag: "1인분", cls: "tag-33" },
        janjo: { tag: "잔조", cls: "tag-40" }
    };
    const info = row.label ? tagMap[row.label] : null;

    const badgeSlot = info
        ? `<div class="share-tag-area"><span class="share-tag ${info.cls}">${info.tag}</span></div>`
        : `<div class="share-tag-area"></div>`;

    const shareLabel = Number.isInteger(row.share) ? `${row.share}%` : `${row.share.toFixed(1)}%`;

    return `
        <td class="share-cell ${info ? "has-badge" : ""}">
            <div class="share-row">
                ${badgeSlot}
                <span class="share-pct">${shareLabel}</span>
            </div>
        </td>
    `;
}


const ROLE_TOOLTIP_HTML = `
    <div class="rt-title">잔조컷에 대하여 💡</div>
    <div class="rt-line"><strong>잔혈+찬조</strong> = 합성어로 <strong class="rt-purple">잔조컷</strong>으로 정의했습니다.</div>
    <div class="rt-line"><strong>강투+찬조</strong> = 합성어로 <strong class="rt-orange">강조컷</strong>으로 정의했습니다.</div>
    <div class="rt-line">서폿의 <strong>풀 케어 + 비슷한 스펙 딜러</strong> 기준이며,</div>
    <div class="rt-line">오로지 <strong>조력 피해</strong>로만 이 수치를 확인합니다. </div>
    <div class="rt-divider"></div>
    <div class="rt-row"><span class="rt-tag rt-tag-orange">강조컷</span><span>딜러의 강투보다 살짝 우위</span></div>
    <div class="rt-row"><span class="rt-tag rt-tag-blue">서폿 1인분</span><span>딜러의 1인분보다 살짝 우위</span></div>
    <div class="rt-row"><span class="rt-tag rt-tag-purple">잔조컷</span><span>딜러의 잔혈보다 살짝 우위</span></div>
    <div class="rt-divider"></div>
    <div class="rt-line" style="margin-top:10px;">서폿은 기믹 대응과 케어를 동시에 수행하기 때문에 전체적으로 딜러보다 살짝 우위에 속합니다.</div>
    <div class="rt-line">수많은 서폿분들의 전분을 확인한 결과, 트라이~딜찍 기준 <strong>↑5%~50%</strong>까지 딜러 피해량과 조력 피해량의 차이가 있었습니다.</div>
    <div class="rt-divider"></div>
    <div class="rt-line">이 데이터를 종합해 로아뷰에서 찾은 <strong class="rt-green">황금 비율</strong>로 서폿 잔조컷을 만들었습니다.</div>
    <div class="rt-note">※ 이 계산법은 로아뷰에서 자체 제작한 방식으로, 절대적인 정답 수치는 아닙니다.</div>
`;

export function makeRoleToggleHtml(variant) {
    const isDealer = currentRoleMode === "dealer";
    const isHero = variant === "hero";
    const boxCls = variant === "compact"
        ? "role-toggle-box compact"
        : isHero
        ? "role-toggle-box compact hero-role"
        : "role-toggle-box";
    const dealerLabel = isHero ? "딜러" : "딜러 잔혈컷";
    const suppLabel = isHero ? "서폿" : "서폿 잔조컷";
    // 큰 히어로(hero variant)에는 "!" 안내 툴팁을 노출하지 않음 — 잔조컷 안내는 아래쪽 잔조컷 토글에만 표시
    const infoTipHtml = isHero
        ? ""
        : `<span class="role-info-tip" tabindex="0"><span class="role-info-icon">!</span></span>`;
    return `
        <div class="${boxCls}">
            <div class="role-toggle-group">
                <button type="button" class="role-toggle-btn role-dealer ${isDealer ? "active" : ""}" data-role="dealer">
                    <span class="role-icon">⚔️</span>
                    <span class="role-label">${dealerLabel}</span>
                    <span class="role-check">${isDealer ? "✓" : "○"}</span>
                </button>
                <button type="button" class="role-toggle-btn role-support ${!isDealer ? "active" : ""}" data-role="support">
                    <span class="role-icon">✚</span>
                    <span class="role-label">${suppLabel}</span>
                    <span class="role-check">${!isDealer ? "✓" : "○"}</span>
                    ${infoTipHtml}
                </button>
            </div>
        </div>
    `;
}






// 미니히어로 전용 - 클릭 불가, 현재 currentRoleMode만 보여주는 정적 배지
// (딜러/서폿 전환은 큰 히어로 토글 + 하단 잔혈컷/잔조컷 버튼에서만 가능)
export function makeRoleBadgeHtml() {
    const isDealer = currentRoleMode === "dealer";
    const roleCls = isDealer ? "role-badge-dealer" : "role-badge-support";
    const icon = isDealer ? "⚔" : "+";
    const label = isDealer ? "딜러" : "서폿";
    return `
        <div class="bi-role-badge ${roleCls}">
            <span class="bi-role-badge-icon">${icon}</span>
            <span class="bi-role-badge-label">${label}</span>
        </div>
    `;
}

export function bindRoleToggle() {
    document.querySelectorAll(".role-toggle-btn[data-role]").forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.dataset.role === currentRoleMode) return;
            currentRoleMode = btn.dataset.role;

            // 역할 토글 버튼 자체의 active 상태만 갱신 (전체 재렌더 방지)
            document.querySelectorAll(".role-toggle-btn").forEach(b => {
                const isActive = b.dataset.role === currentRoleMode;
                b.classList.toggle("active", isActive);
                const check = b.querySelector(".role-check");
                if (check) check.textContent = isActive ? "✓" : "○";
            });

            renderTable();
        });
    });
}





/* =============================================
   속성 이모지
   ============================================= */
function getAttrEmoji(text, cls) {
    if (!cls || !cls.startsWith("attr-")) return "";

    if (text.includes("속성 없음") || text.includes("취약 없음")) return "🔘";
    if (text.includes("암속성")) return "👥​";
    if (text.includes("성속성")) return "☀️​";
    if (text.includes("화속성")) return "🔥";
    if (text.includes("뇌속성")) return "⚡";
    if (text.includes("토속성")) return "🧱​";
    if (text.includes("수속성")) return "❄️​";

    return "🔘";
}

function getWeakAttrEmojiOnly(text, cls) {
    if (!cls || !cls.startsWith("attr-")) return "";
    if (text.includes("속성 없음") || text.includes("취약 없음")) return "";
    return getAttrEmoji(text, cls);
}

function getGuardianElementEmojiFromWeakness(attrText) {
    if (!attrText) return "🔘";
    if (attrText.includes("취약 없음") || attrText.includes("속성 없음")) return "🔘";
    if (attrText.includes("암속성")) return "☀️​"; // 암속성 취약 = 성속성 몬스터
    if (attrText.includes("성속성")) return "👥​"; // 성속성 취약 = 암속성 몬스터
    if (attrText.includes("뇌속성")) return "❄️​"; // 뇌속성 취약 = 수속성 몬스터
    if (attrText.includes("수속성")) return "🔥"; // 수속성 취약 = 화속성 몬스터
    if (attrText.includes("토속성")) return "⚡"; // 토속성 취약 = 뇌속성 몬스터
    if (attrText.includes("화속성")) return "🧱​"; // 화속성 취약 = 토속성 몬스터
    return "🔘";
}

function getRaidElementEmojiFromAttr(attrText) {
    if (!attrText) return "🔘";
    if (attrText.includes("속성 없음") || attrText.includes("취약 없음")) return "🔘";
    if (attrText.includes("암속성")) return "☀️​";
    if (attrText.includes("성속성")) return "👥​";
    if (attrText.includes("뇌속성")) return "❄️​";
    if (attrText.includes("수속성")) return "🔥";
    if (attrText.includes("토속성")) return "⚡";
    if (attrText.includes("화속성")) return "🧱​";
    return "🔘";
}


/* =============================================
   시간 관련 함수
   ============================================= */
function updateTimeDisplay() {
    let m = parseInt(document.getElementById("minutes").value || 0, 10);
    let s = parseInt(document.getElementById("seconds").value || 0, 10);

    if (isNaN(m) || m < 0) m = 0;
    if (isNaN(s) || s < 0) s = 0;
    if (s > 59) s = 59;

    document.getElementById("minutes").value = m;
    document.getElementById("seconds").value = s;
    document.getElementById("timeDisplay").textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function setBaseTimeByMenu(menu, gateKey) {
    const minutes = document.getElementById("minutes");
    const seconds = document.getElementById("seconds");
    const label = document.getElementById("timeBaseLabel");

    if (menu === "guardian") {
        minutes.value = 1;
        seconds.value = 50;
        label.textContent = "기본값: 1분 50초(110초)";
    } else if (menu === "belgardin" && gateKey === "gate2") {
        minutes.value = 13;
        seconds.value = 0;
        label.textContent = "기본값: 13분(780초)";
    } else if (menu === "extreme" && currentExtremeRaid === "jongmak") {
        // 기본 클리어 타임: 발악 히든 아만 미사용 33분 27초(2007초) / 사용 33분 2초(1982초)
        const jm = getJongmakDefaultTime();
        minutes.value = Math.floor(jm.sec / 60);
        seconds.value = jm.sec % 60;
        label.textContent = `기본값: ${Math.floor(jm.sec / 60)}분 ${jm.sec % 60}초(${jm.sec}초)${jm.hidden ? " · 발악 히든 아만 사용 기준" : ""}`;
    } else if (menu === "extreme") {
        minutes.value = 22;
        seconds.value = 0;
        label.textContent = "기본값: 22분(1320초)";
    } else {
        minutes.value = 10;
        seconds.value = 0;
        label.textContent = "기본값: 10분(600초)";
    }

    updateTimeDisplay();
}

function getTotalSeconds() {
    let m = parseInt(document.getElementById("minutes").value || 0, 10);
    let s = parseInt(document.getElementById("seconds").value || 0, 10);

    if (isNaN(m) || m < 0) m = 0;
    if (isNaN(s) || s < 0) s = 0;
    if (s > 59) s = 59;

    document.getElementById("minutes").value = m;
    document.getElementById("seconds").value = s;

    return Math.max(1, 60 * m + s);
}

function changeTimeValue(target, step) {
   if (currentMenu === "simple" || currentMenu === "raid-simple") return;

    const input = document.getElementById(target);
    let value = parseInt(input.value || 0, 10);
    if (isNaN(value)) value = 0;
    value += step;

    if (target === "minutes") value = Math.max(0, value);
    if (target === "seconds") value = Math.max(0, Math.min(59, value));

    input.value = value;
    renderTable();
}

/* =============================================
   제목 / 메뉴 관련
   ============================================= */
function getRaidDisplayName(menu) {
    if (menu === "serka") return "세르카";
    if (menu === "cathedral") return "지평의 성당";
    if (menu === "belgardin") return "벨가르딘";
    if (menu === "mordum") return "모르둠 EX";
    if (menu === "jongmak") return "종막 EX";
    return "";
}

function getContentName() {
if (currentMenu === "raid-simple") {
    return "레이드별 잔혈컷 👀";
}
    if (currentMenu === "simple") {
        if (currentSimpleLevel === "egir-ex") return "에기르 EX 레이드 💠";
        if (currentSimpleLevel === "abr-ex") return "아브렐슈드 EX 레이드 ⚡";
        return "잔혈컷 간편보기 👀";
    }

    if (currentMenu === "guardian") {
        const boss = getCurrentGuardianBoss();
        return `가디언 토벌 : ${boss}`;
    }

    if (currentMenu === "serka" || currentMenu === "cathedral" || currentMenu === "belgardin") {
        const info = raidMeta[currentMenu][currentCombo];
        return `${getRaidDisplayName(currentMenu)} : ${info.title.replace(/\s*\(.+\)/, "")} ${info.gateName}`;
    }

    return "콘텐츠";
}

function getTableTitle() {
   
if (currentMenu === "raid-simple") {
    return simpleRaidMeta[currentSimpleRaid]?.label || "레이드별 잔혈컷";
}

 if (currentMenu === "simple") {
        if (currentSimpleLevel === "egir-ex" || currentSimpleLevel === "abr-ex") {
            return "DPS컷은 딱클 정도의 수치로 표기되었습니다.";
        }
        return simpleData[currentSimpleLevel]?.sectionTitle || "잔혈컷 간편보기";
    }

    if (currentMenu === "serka" || currentMenu === "cathedral" || currentMenu === "belgardin") {
        const lv = raidMeta[currentMenu][currentCombo].title.match(/\((\d+)\)/);
        return `입장레벨 : ${lv ? lv[1] : "-"}`;
    }

    return "";
}

function applyMenuFromQuery() {
    if (isStandaloneLevelPage) {
        currentMenu = "simple";
        currentSimpleLevel = "1750";
        document.querySelectorAll(".menu-item").forEach(btn => btn.classList.remove("active"));
        document.querySelector('.menu-item[data-menu="simple"]')?.classList.add("active");
        setBaseTimeByMenu(currentMenu);
        return;
    }

    if (isStandaloneRaidPage) {
        currentMenu = "raid-simple";
        currentSimpleRaid = "cathedral";
        document.querySelectorAll(".menu-item").forEach(btn => btn.classList.remove("active"));
        document.querySelector('.menu-item[data-menu="raid-simple"]')?.classList.add("active");
        setBaseTimeByMenu(currentMenu);
        return;
    }

    if (isStandaloneSerkaPage) {
        currentMenu = "serka";
        currentCombo = "nightmare_gate1";
        document.querySelectorAll(".menu-item").forEach(btn => btn.classList.remove("active"));
        document.querySelector('.menu-item[data-menu="serka"]')?.classList.add("active");
        setBaseTimeByMenu(currentMenu);
        return;
    }

    if (isStandaloneCathedralPage) {
        currentMenu = "cathedral";
        currentCombo = "nightmare_gate1";
        document.querySelectorAll(".menu-item").forEach(btn => btn.classList.remove("active"));
        document.querySelector('.menu-item[data-menu="cathedral"]')?.classList.add("active");
        setBaseTimeByMenu(currentMenu);
        return;
    }

    if (isStandaloneBelgardinPage) {
        currentMenu = "belgardin";
        currentCombo = "nightmare_gate1";
        document.querySelectorAll(".menu-item").forEach(btn => btn.classList.remove("active"));
        document.querySelector('.menu-item[data-menu="belgardin"]')?.classList.add("active");
        setBaseTimeByMenu(currentMenu);
        return;
    }

    if (isStandaloneExtremePage) {
        currentMenu = "extreme";
        currentExtremeRaid = "jongmak";
        currentCombo = "nightmare_gate1";
        document.querySelectorAll(".menu-item").forEach(btn => btn.classList.remove("active"));
        document.querySelector('.menu-item[data-menu="extreme"]')?.classList.add("active");
        setBaseTimeByMenu(currentMenu);
        return;
    }

  // 수정
if (isStandaloneGuardianPage) {
    currentMenu = "guardian";

    const guardianParams = new URLSearchParams(window.location.search);
    const qTier = guardianParams.get("tier");
    const qBoss = guardianParams.get("boss");

    const validTiers = ["1730", "1750", "1770"];
    currentGuardianTier = validTiers.includes(qTier) ? qTier : "1770";

    const bossList = getGuardianBossListByTier(currentGuardianTier);
  const resolvedBoss = (qBoss && bossList.includes(qBoss)) ? qBoss : getHgWeekBoss();

    currentGatoBoss = resolvedBoss;
    currentGato1750Boss = resolvedBoss;
    currentGato1770Boss = resolvedBoss;

    document.querySelectorAll(".menu-item").forEach(btn => btn.classList.remove("active"));
    document.querySelector('.menu-item[data-menu="guardian"]')?.classList.add("active");
    setBaseTimeByMenu(currentMenu);
    return;
}

    const menu = new URLSearchParams(window.location.search).get("menu");
    if (!menu) return;

  if (["serka", "cathedral", "belgardin", "guardian", "simple", "raid-simple", "egir-ex", "abr-ex"].includes(menu)) {
        if (menu === "egir-ex" || menu === "abr-ex") {
            currentMenu = "simple";
            currentSimpleLevel = menu;
        } else {
            currentMenu = menu;
        }
    
if (currentMenu === "serka") {
    currentCombo = "nightmare_gate1";
} else if (currentMenu === "cathedral") {
    currentCombo = "nightmare_gate1";
} else if (currentMenu === "belgardin") {
    currentCombo = "nightmare_gate1";
} else if (currentMenu === "guardian") {
    currentGuardianTier = "1770";
    currentGatoBoss = "루멘칼리고";
    currentGato1750Boss = "루멘칼리고";
    currentGato1770Boss = "루멘칼리고";
} else if (currentMenu === "raid-simple") {
    currentSimpleRaid = "cathedral";
} else if (currentMenu === "simple" && currentSimpleLevel !== "egir-ex" && currentSimpleLevel !== "abr-ex") {
    currentSimpleLevel = "1750";
}

        document.querySelectorAll(".menu-item").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.menu === menu || (menu === "simple" && btn.dataset.menu === "simple"));
        });

        setBaseTimeByMenu(currentMenu);
    }
}

function renderTitleMeta() {
    const box = document.getElementById("titleMeta");

   if (currentMenu === "simple" || currentMenu === "raid-simple") {
    box.innerHTML = "";
    return;
}

    if (currentMenu === "guardian") {
        const boss = getCurrentGuardianBoss();
        const info = gatoMeta[boss];
        box.innerHTML = `${makeBadge(info.type.text, info.type.cls)} ${makeBadge(info.attr.text, info.attr.cls)}`;
        return;
    }

    if (currentMenu === "serka" || currentMenu === "cathedral" || currentMenu === "belgardin") {
        const info = raidMeta[currentMenu][currentCombo];
        box.innerHTML = `${makeBadge(info.type.text, info.type.cls)} ${makeBadge(info.attr.text, info.attr.cls)}`;
        return;
    }

    box.innerHTML = "";
}


/* =============================================
   심플 히어로 함수
   ============================================= */

function simpleHeroHtml() {
    return `
        <section class="simple-hero">
            <div class="simple-hero-top">
                <div class="simple-hero-left">
                    <div class="simple-hero-copy">
                        <div class="simple-hero-kicker">LOA VIEWER · SIMPLE MODE</div>

                        <div class="simple-hero-title-row">
                            <div class="simple-hero-title-icon">💠</div>
                            <h2 class="simple-hero-title">레벨별 잔혈컷</h2>
                        </div>

                        <p class="simple-hero-desc">
                            레벨별 강투 · 1인분 · 잔혈 컷을 한 번에 비교하고,
                            각 관문의 수치를 빠르게 확인할 수 있습니다.
                        </p>
                    </div>

                    <div class="simple-hero-pills">
                        <span class="simple-hero-pill pill-level">레벨별 정리</span>
                        <span class="simple-hero-pill pill-compare">빠른 비교</span>
                        <span class="simple-hero-pill pill-cut">강투 · 1인분 · 잔혈</span>
                    </div>
                </div>

                <div class="simple-hero-right">
                    <div class="simple-hero-stat">
                        <div class="simple-hero-stat-label">현재 선택</div>
                        <div class="simple-hero-stat-value" id="simpleHeroCurrentLevel">${currentSimpleLevel}</div>
                        <div class="simple-hero-stat-sub">골드 획득 우선 3개</div>
                    </div>

                    <div class="simple-hero-stat">
                        <div class="simple-hero-stat-label">LEVEL RANGE</div>
                        <div class="simple-hero-stat-value">1710 ~ 1780</div>
                        <div class="simple-hero-stat-sub">추가 레이드는 아래 펼치기</div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

/* =============================================
  헬퍼 함수
   ============================================= */

function getSimpleCardMapByTitle() {
    const orderedLevels = ["1710", "1720", "1730", "1740", "1750", "1770", "1780"];
    const map = {};

    orderedLevels.forEach(level => {
        const cards = simpleData[level]?.cards || [];
        cards.forEach(card => {
            if (!map[card.title]) {
                map[card.title] = card;
            }
        });
    });

    return map;
}


function parseSimpleGoldValue(v) {
    return Number(String(v || "").replace(/,/g, "").trim()) || 0;
}

function getSimpleCardRewardValue(card) {
    if (!card) return 0;

    const total = parseSimpleGoldValue(card.total);
    if (total > 0) return total;

    return parseSimpleGoldValue(card.gold) + parseSimpleGoldValue(card.bindGold);
}

function getSimpleCardNodeLevel(card) {
    return Number(String(card?.node || "").replace(/[^0-9]/g, "")) || 0;
}

function getSimpleCardGroupKey(card) {
    const title = card?.title || "";

    if (title.includes("벨가르딘")) return "belgardin";
    if (title.includes("세르카")) return "serka";
    if (title.includes("성당")) return "cathedral";
    if (title.includes("종막")) return "finale";
    if (title.includes("4막")) return "act4";

    return title;
}

function getSimpleAllBaseCards() {
    return Object.values(getSimpleCardMapByTitle());
}

function pickBetterSimpleCard(prev, next) {
    if (!prev) return next;
    if (!next) return prev;

    const prevNode = getSimpleCardNodeLevel(prev);
    const nextNode = getSimpleCardNodeLevel(next);

    if (nextNode !== prevNode) {
        return nextNode > prevNode ? next : prev;
    }

    const prevReward = getSimpleCardRewardValue(prev);
    const nextReward = getSimpleCardRewardValue(next);

    if (nextReward !== prevReward) {
        return nextReward > prevReward ? next : prev;
    }

    return prev;
}

function getSimpleLevelCardsByAccess(level) {
    const lv = Number(level);
    const allCards = getSimpleAllBaseCards().filter(card => getSimpleCardNodeLevel(card) <= lv);

    const groupMap = {};

    allCards.forEach(card => {
        const groupKey = getSimpleCardGroupKey(card);
        groupMap[groupKey] = pickBetterSimpleCard(groupMap[groupKey], card);
    });

    return Object.values(groupMap).sort((a, b) => {
        const rewardDiff = getSimpleCardRewardValue(b) - getSimpleCardRewardValue(a);
        if (rewardDiff !== 0) return rewardDiff;

        const nodeDiff = getSimpleCardNodeLevel(b) - getSimpleCardNodeLevel(a);
        if (nodeDiff !== 0) return nodeDiff;

        return 0;
    });
}

function getSimpleLevelCardSections(level) {
    const cards = getSimpleLevelCardsByAccess(level);

    return {
        goldCards: cards.slice(0, 3),
        extraCards: cards.slice(3)
    };
}

function bindSimpleExtraToggle() {
    const btn = document.getElementById("simpleExtraToggleBtn");
    const panel = document.getElementById("simpleExtraPanel");
    const text = document.getElementById("simpleExtraToggleText");
    const arrow = document.getElementById("simpleExtraToggleArrow");

    if (!btn || !panel || !text || !arrow) return;

    btn.addEventListener("click", () => {
        const isOpen = panel.classList.toggle("open");
        btn.classList.toggle("open", isOpen);
        text.textContent = isOpen ? "골드 미획득 레이드 접기" : "골드 미획득 레이드 펼치기";
        arrow.textContent = isOpen ? "▲" : "▼";
    });
}




function getSimpleRaidCards(raidKey) {
    const meta = simpleRaidMeta[raidKey];
    if (!meta) return [];

    const cardMap = getSimpleCardMapByTitle();
    return meta.titles.map(title => cardMap[title]).filter(Boolean);
}

function simpleRaidHeroHtml() {
    const meta = simpleRaidMeta[currentSimpleRaid];
    if (!meta) return "";

    return `
        <section class="simple-hero">
            <div class="simple-hero-top">
                <div class="simple-hero-left">
                    <div class="simple-hero-copy">
                        <div class="simple-hero-kicker">LOA VIEWER · RAID MODE</div>

                        <div class="simple-hero-title-row">
                            <div class="simple-hero-title-icon">${meta.icon}</div>
                            <h2 class="simple-hero-title">레이드별 잔혈컷</h2>
                        </div>

                        <p class="simple-hero-desc">
                          레이드별 강투 · 1인분 · 잔혈 컷을 한 번에 비교하고,
                            각 관문의 수치를 빠르게 확인할 수 있습니다.
                        </p>
                    </div>

                    <div class="simple-hero-pills">
                        <span class="simple-hero-pill pill-level">레이드별 정리</span>
                        <span class="simple-hero-pill pill-compare">간편 비교</span>
                        <span class="simple-hero-pill pill-cut">강투 · 1인분 · 잔혈</span>
                    </div>
                </div>

                <div class="simple-hero-right">
                    <div class="simple-hero-stat">
                        <div class="simple-hero-stat-label">현재 선택</div>
                      <div class="simple-hero-stat-value" id="simpleHeroCurrentRaid">${meta.label}</div>
                      <div class="simple-hero-stat-sub" id="simpleHeroCurrentRaidSub">${meta.sub}</div>
                    </div>

                    <div class="simple-hero-stat">
                        <div class="simple-hero-stat-label">RAID INFO</div>
                        <div class="simple-hero-stat-value">${meta.summary}</div>
                        <div class="simple-hero-stat-sub">난이도 / 관문 기준 보기</div>
                    </div>
                </div>
            </div>
        </section>
    `;
}




function simpleLevelMiniHeroHtml() {
    return `
        <div class="p-hero p-mini-hero hero-simple-neutral">
            <div class="p-mini-hero-row">
                <div class="p-mini-hero-left">
                    <span class="p-hero-kicker" style="margin-bottom:0;">PRECISION · LEVEL</span>
                    <span class="p-mini-hero-divider"></span>
                    <div class="p-hero-icon p-hero-icon-sm">💠</div>
                    <span class="p-mini-hero-title" id="simpleMiniHeroLevelTitle">${currentSimpleLevel}</span>
                </div>
                <div class="simple-mini-hero-stats level-range-stats">
                    <div class="simple-mini-hero-badge badge-accent">
                        <span class="badge-label">레벨 범위</span>
                        <span class="badge-value">1710~1780</span>
                    </div>
                    <div class="simple-mini-hero-badge badge-purple">
                        <span class="badge-label">우선순위</span>
                        <span class="badge-value">골드 3개</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function simpleRaidMiniHeroHtml() {
    const meta = simpleRaidMeta[currentSimpleRaid];
    if (!meta) return "";

    const eng = simpleRaidKickerMap[currentSimpleRaid] || "";

    return `
        <div class="p-hero p-mini-hero hero-simple-neutral">
            <div class="p-mini-hero-row">
                <div class="p-mini-hero-left">
                    <span class="p-hero-kicker" style="margin-bottom:0;" id="simpleMiniHeroRaidKicker">PRECISION · ${eng}</span>
                    <span class="p-mini-hero-divider"></span>
                    <div class="p-hero-icon p-hero-icon-sm">${meta.icon}</div>
                    <span class="p-mini-hero-title" id="simpleMiniHeroRaidTitle">${meta.label}</span>
                </div>
                <div class="simple-mini-hero-stats">
                    <div class="simple-mini-hero-badge badge-accent">
                        <span class="badge-label">레이드 유형</span>
                        <span class="badge-value" id="simpleMiniHeroRaidSummary">${meta.summary}</span>
                    </div>
                    <div class="simple-mini-hero-badge badge-purple">
                        <span class="badge-label">인원</span>
                        <span class="badge-value" id="simpleMiniHeroRaidSub">${meta.sub}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}





/* =============================================
   탭 렌더링
   ============================================= */

function renderTabs() {
    const el = document.getElementById("tabs");
    el.classList.remove("simple-tabs");

    if (currentMenu === "simple") {
        el.classList.add("simple-tabs");
        if (currentSimpleLevel === "egir-ex" || currentSimpleLevel === "abr-ex") {
            el.innerHTML = "";
            return;
        }

        const levels = ["1710", "1720", "1730", "1740", "1750", "1770", "1780"];

       



el.innerHTML = `
    ${simpleHeroHtml()}
    
    <!-- 대형 수평 광고판 (정밀계산과 동일 여백 / PC 970x250 · 모바일 90px) -->
   <div class="simple-top-ad-wrap" style="width:100%;max-width:100%;overflow:hidden;display:flex;justify-content:center;align-items:center;margin:14px auto 40px;">
      ${window.loaviewCenterAdHtml ? window.loaviewCenterAdHtml() : ""}
    </div>
    
 <!-- 그라데이션 구분선 (정밀계산과 동일 여백) -->
<div class="divider common-divider-bottom" style="margin-top:40px;margin-bottom:70px;"><hr class="divider-line"></div>

${simpleLevelMiniHeroHtml()}

    <div class="simple-grid-layout">




                <div class="simple-controls-col simple-grid-left">
                    <div class="simple-level-tabs">
                        ${levels.map(lv => `
                            <button class="simple-level-tab ${currentSimpleLevel === lv ? "active" : ""}" data-simple-level="${lv}">
                                <span class="simple-level-tab-main">${lv}</span>
                                <span class="simple-level-tab-sub">레이드</span>
                            </button>
                        `).join("")}
                    </div>
                    ${makeRoleToggleHtml()}

                    <div class="simple-cards-full" id="simpleCardsFull"></div>
                </div><!-- // .simple-grid-left 닫힘 -->

                <div class="simple-grid-right" id="simpleGridRight"></div>
            </div><!-- // .simple-grid-layout 닫힘 -->
        `;

    // innerHTML로 넣은 광고 슬롯은 script가 실행되지 않으므로 여기서 직접 display/refresh
    try { window.loaviewPushAdsense && window.loaviewPushAdsense(el); } catch (e) {}

   
el.querySelectorAll(".simple-level-tab[data-simple-level]").forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.dataset.simpleLevel === currentSimpleLevel) return;
        currentSimpleLevel = btn.dataset.simpleLevel;

        // 탭 active 상태만 갱신 (우측 광고/경매계산기 영역 재생성 방지)
        el.querySelectorAll(".simple-level-tab[data-simple-level]").forEach(b => {
            b.classList.toggle("active", b.dataset.simpleLevel === currentSimpleLevel);
        });

        const heroVal = document.getElementById("simpleHeroCurrentLevel");
        if (heroVal) heroVal.textContent = currentSimpleLevel;


        const miniHeroVal = document.getElementById("simpleMiniHeroLevelTitle");
        if (miniHeroVal) miniHeroVal.textContent = currentSimpleLevel;

  


        renderTable();
    });
});


        bindRoleToggle();

        return;
    }

    if (currentMenu === "raid-simple") {
        el.classList.add("simple-tabs");

        const raids = ["cathedral", "serka", "belgardin", "finale", "act4"];

    

el.innerHTML = `
    ${simpleRaidHeroHtml()}
    
    <!-- 대형 수평 광고판 (정밀계산과 동일 여백 / PC 970x250 · 모바일 90px) -->
    <div class="simple-top-ad-wrap" style="width:100%;max-width:100%;overflow:hidden;display:flex;justify-content:center;align-items:center;margin:14px auto 40px;">
      ${window.loaviewCenterAdHtml ? window.loaviewCenterAdHtml() : ""}
    </div>
    
    <!-- 그라데이션 구분선 (정밀계산과 동일 여백) -->
    
<div class="divider common-divider-bottom" style="margin-top:40px;margin-bottom:70px;"><hr class="divider-line"></div>

   

${simpleRaidMiniHeroHtml()}

    <div class="simple-grid-layout">

                <div class="simple-controls-col simple-grid-left">



                    <div class="simple-level-tabs">
                        ${raids.map(key => {
                            const meta = simpleRaidMeta[key];
                            return `
                                <button class="simple-level-tab simple-raid-tab ${currentSimpleRaid === key ? "active" : ""}" data-simple-raid="${key}">
                                    <span class="simple-level-tab-main">${meta.label}</span>
                                    <span class="simple-level-tab-sub">${meta.sub}</span>
                                </button>
                            `;
                        }).join("")}
                    </div>
                    ${makeRoleToggleHtml()}

                    <div class="simple-cards-full" id="simpleCardsFull"></div>
                </div><!-- // .simple-grid-left 닫힘 -->

                <div class="simple-grid-right" id="simpleGridRight"></div>
            </div><!-- // .simple-grid-layout 닫힘 -->
        `;

    // innerHTML로 넣은 광고 슬롯은 script가 실행되지 않으므로 여기서 직접 display/refresh
    try { window.loaviewPushAdsense && window.loaviewPushAdsense(el); } catch (e) {}


el.querySelectorAll(".simple-raid-tab[data-simple-raid]").forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.dataset.simpleRaid === currentSimpleRaid) return;
        currentSimpleRaid = btn.dataset.simpleRaid;

        el.querySelectorAll(".simple-raid-tab[data-simple-raid]").forEach(b => {
            b.classList.toggle("active", b.dataset.simpleRaid === currentSimpleRaid);
        });

        const meta = simpleRaidMeta[currentSimpleRaid];
        const heroVal = document.getElementById("simpleHeroCurrentRaid");
        const heroSub = document.getElementById("simpleHeroCurrentRaidSub");
        if (heroVal && meta) heroVal.textContent = meta.label;
        if (heroSub && meta) heroSub.textContent = meta.sub;
        
                const miniKicker = document.getElementById("simpleMiniHeroRaidKicker");
        const miniTitle = document.getElementById("simpleMiniHeroRaidTitle");
        const miniSummary = document.getElementById("simpleMiniHeroRaidSummary");
        const miniSub = document.getElementById("simpleMiniHeroRaidSub");
        if (miniKicker && meta) miniKicker.textContent = `PRECISION · ${simpleRaidKickerMap[currentSimpleRaid] || ""}`;
        if (miniTitle && meta) miniTitle.textContent = meta.label;
        if (miniSummary && meta) miniSummary.textContent = meta.summary;
        if (miniSub && meta) miniSub.textContent = meta.sub; 


        renderTable();
    });
});


        bindRoleToggle();

        return;
    }

    el.innerHTML = "";
}


/* =============================================
   CSV 파싱
   ============================================= */
function clearAllData() {
    parsedData.serka = { normal: [], hard: [], nightmare: [] };
    parsedData.cathedral = { normal: [], hard: [], nightmare: [] };
    parsedData.belgardin = { normal: [], hard: [], nightmare: [] };
    parsedData.gato1730 = {};
    parsedData.gato1750 = {};
    parsedData.gato1770 = {};
}

function parseBlock(lines, startRow, target) {
    for (let i = startRow + 3; i < startRow + 29; i++) {
        const cols = parseCSVLine(lines[i] || "");
        const share = percentNum(cols[1]);
        if (share) {
            parsedData[target].normal.push({ share, g1: toNum(cols[3]), g2: toNum(cols[6]) });
            parsedData[target].hard.push({ share, g1: toNum(cols[11]), g2: toNum(cols[14]) });
            parsedData[target].nightmare.push({ share, g1: toNum(cols[19]), g2: toNum(cols[22]) });
        }
    }
}

function parseCathedral(lines) {
    for (let i = 0; i < lines.length; i++) {
        if ((lines[i] || "").includes("지평의 성당 1~3단계 딜지분 상세")) {
            parseBlock(lines, i + 1, "cathedral");
            return;
        }
    }
}

function parseSerka(lines) {
    for (let i = 0; i < lines.length; i++) {
        if ((lines[i] || "").includes("세르카 딜지분 상세")) {
            parseBlock(lines, i + 1, "serka");
            return;
        }
    }
}

// 신규: 벨가르딘 파싱 — 세르카/성당과 달리 난이도별로 딜지분 컬럼이 따로 존재
// (노말 B열 / 하드 J열 / 나메 R열), 데이터 시작은 제목행+4(=670행 기준)
function parseBelgardin(lines) {
    // 공백 배치가 시트마다 미묘하게 다를 수 있어 "벨가르딘"+"딜지분"+"상세"가
    // 같은 줄에 순서대로 있으면 매칭되도록 느슨하게 검사
    const titleRe = /벨가르딘\s*딜지분\s*상세/;

    for (let i = 0; i < lines.length; i++) {
        if (titleRe.test(lines[i] || "")) {
            const headerRow = i + 1; // 난이도 라벨행 (제목 다음 줄)
            const dataStart = headerRow + 3; // 데이터 시작행 (제목행+4)
            for (let r = dataStart; r < dataStart + 22; r++) {
                const cols = parseCSVLine(lines[r] || "");

                const shareNormal = percentNum(cols[1]);      // B열
                if (shareNormal) {
                    parsedData.belgardin.normal.push({ share: shareNormal, g1: toNum(cols[3]), g2: toNum(cols[6]) });
                }

                const shareHard = percentNum(cols[9]);         // J열
                if (shareHard) {
                    parsedData.belgardin.hard.push({ share: shareHard, g1: toNum(cols[11]), g2: toNum(cols[14]) });
                }

                const shareNightmare = percentNum(cols[17]);   // R열
                if (shareNightmare) {
                    parsedData.belgardin.nightmare.push({ share: shareNightmare, g1: toNum(cols[19]), g2: toNum(cols[22]) });
                }
            }

            // 디버그용: 실제로 파싱된 행 수가 0이면 dataStart 오프셋이 틀렸을 가능성이 큼
            if (
                !parsedData.belgardin.normal.length &&
                !parsedData.belgardin.hard.length &&
                !parsedData.belgardin.nightmare.length
            ) {
                console.warn(
                    `[벨가르딘 파싱] 제목은 찾았지만(줄 ${i}) 데이터가 비어있습니다. ` +
                    `dataStart=${dataStart}행 부근을 시트에서 직접 확인해보세요. ` +
                    `해당 행 원문: "${lines[dataStart] || "(없음)"}"`
                );
            }
            return;
        }
    }

    console.warn('[벨가르딘 파싱] CSV에서 "벨가르딘 딜지분 상세" 제목을 찾지 못했습니다. 시트 문구 또는 gid(탭)를 확인해주세요.');
}

function parseGato1730(lines) {
    gato1730Bosses.forEach(b => { parsedData.gato1730[b] = []; });
    gato1730Layout.forEach(layout => {
        for (let i = layout.startRow + 3; i <= layout.startRow + 28; i++) {
            const cols = parseCSVLine(lines[i] || "");
            const share = percentNum(cols[layout.shareCol]);
            if (share) {
                parsedData.gato1730[layout.boss].push({ share, damage: toNum(cols[layout.damageCol]) });
            }
        }
    });
}

function parseGato1750(lines) {
    gato1750Bosses.forEach(b => { parsedData.gato1750[b] = []; });
    gato1750Layout.forEach(layout => {
        for (let i = layout.startRow + 3; i <= layout.startRow + 28; i++) {
            const cols = parseCSVLine(lines[i] || "");
            const share = percentNum(cols[layout.shareCol]);
            if (share) {
                parsedData.gato1750[layout.boss].push({ share, damage: toNum(cols[layout.damageCol]) });
            }
        }
    });
}

// 신규: 가디언 토벌 1770 파싱 (딜지분 25%~50% 구간, startRow+3 ~ startRow+28)
function parseGato1770(lines) {
    gato1770Bosses.forEach(b => { parsedData.gato1770[b] = []; });
    gato1770Layout.forEach(layout => {
        for (let i = layout.startRow + 3; i <= layout.startRow + 28; i++) {
            const cols = parseCSVLine(lines[i] || "");
            const share = percentNum(cols[layout.shareCol]);
            if (share) {
                parsedData.gato1770[layout.boss].push({ share, damage: toNum(cols[layout.damageCol]) });
            }
        }
    });
}


/* =============================================
   테이블 렌더 헬퍼
   ============================================= */
export function renderShareCell(share, menu) {
    const shares = getPrecisionShares(menu);
    const tagMap = {
        [shares.tank]: { tag: "강투", cls: "tag-30" },
        [shares.one]: { tag: "1인분", cls: "tag-33" },
        [shares.blood]: { tag: "잔혈", cls: "tag-40" }
    };

    const info = tagMap[share];

    const badgeSlot = info
        ? `<div class="share-tag-area"><span class="share-tag ${info.cls}">${info.tag}</span></div>`
        : `<div class="share-tag-area"></div>`;

    const shareLabel = Number.isInteger(share) ? `${share}%` : `${share.toFixed(2).replace(/0$/, "")}%`;

    return `
        <td class="share-cell ${info ? "has-badge" : ""}">
            <div class="share-row">
                ${badgeSlot}
                <span class="share-pct">${shareLabel}</span>
            </div>
        </td>
    `;
}

function renderHead() {
    document.getElementById("tableHead").innerHTML = "<tr><th>딜지분</th><th>피해/억</th><th>DPS</th></tr>";
}

function renderComingSoon(title, desc) {
    document.getElementById("mainContent").innerHTML = `<div class="coming-soon"><h3>${title}</h3><p>${desc}</p></div>`;
}

function ensureTableWrap() {
    document.getElementById("mainContent").innerHTML =
        '<div class="table-wrap" id="tableWrap"><table id="dataTable"><thead id="tableHead"></thead><tbody id="tableBody"></tbody></table></div>';
}




// 페이지 로드 시 최초 1회만 붙잡아두는 전역 참조.
// HTML에 없다면 동적으로 직접 빌드하여 소실을 방지합니다.
let persistentAuctionCalcEl = null;

function getAuctionCalcEl() {
    if (!persistentAuctionCalcEl) {
        // 1. 먼저 HTML에 이미 경매 계산기가 존재하는지 찾아봅니다.
        let el = document.querySelector(".auction-calc") || document.querySelector(".side-auction-link");
        
        // 2. [완벽 해결] HTML에 경매 계산기 태그가 없다면, JS가 똑같은 디자인으로 즉석 빌드합니다!
        if (!el) {
            el = document.createElement("a");
            
            // 현재 폴더 위치(루트 / 인지 dps / 인지)에 맞춰 올바른 상대 경로 지정
            if (window.location.pathname === "/" || window.location.pathname === "/index.html" || window.location.pathname === "/index") {
                el.href = "./tools/auction.html";
            } else {
                el.href = "../tools/auction.html";
            }
            
            el.className = "side-card side-auction-link";
            
            // 기존 HTML에 선언되어 있던 럭셔리한 인라인 스타일 그대로 적용
            el.style.display = "flex";
            el.style.flexDirection = "column";
            el.style.alignItems = "center";
            el.style.justifyContent = "center";
            el.style.gap = "6px";
            el.style.padding = "12px";
            el.style.textDecoration = "none";
            el.style.color = "inherit";
            el.style.borderColor = "rgba(247,202,84,.18)";
            el.style.transition = "all .2s";
            el.style.height = "119px";
            
            // 구조 삽입
            el.innerHTML = `
                <div style="font-size:24px;">🔨</div>
                <div style="font-size:14px;font-weight:900;color:#f7ca54;">경매 계산기</div>
                <div style="font-size:11px;color:#667085;text-align:center;line-height:1.45;">실시간 각인서 시세 +<br>손익분기점 계산</div>
            `;
        }
        persistentAuctionCalcEl = el;
    }
    return persistentAuctionCalcEl;
}


function getCurrentDpsPageKey() {
    const match = window.location.pathname.match(/\/dps\/(level|raid|serka|belgardin|cathedral|guardian|extreme)(\.html)?$/);
    return match ? match[1] : null;
}



function getAuctionHref() {
    if (window.location.pathname === "/" || window.location.pathname === "/index.html" || window.location.pathname === "/index") {
        return "./tools/auction.html";
    }
    return "../tools/auction.html";
}

let persistentQuickMoveEl = null;
function getQuickMoveEl() {
    if (persistentQuickMoveEl) return persistentQuickMoveEl;

    const current = getCurrentDpsPageKey();
    if (!current) return null;

    let order = [];
    if (QUICK_MOVE_SIMPLE_GROUP.includes(current)) {
        order = QUICK_MOVE_SIMPLE_GROUP;
    } else if (QUICK_MOVE_PRECISION_GROUP.includes(current)) {
        order = QUICK_MOVE_PRECISION_GROUP;
    } else {
        return null;
    }

    const items = order.map((key) => ({
        key,
        label: QUICK_MOVE_PAGES[key].label,
        href: QUICK_MOVE_PAGES[key].href,
        disabled: !!QUICK_MOVE_PAGES[key].disabled
    }));
    items.push({ key: "synergy", label: QUICK_MOVE_SYNERGY_LINK.label, href: QUICK_MOVE_SYNERGY_LINK.href });
    items.push({ key: "auction", label: "경매계산기", href: getAuctionHref() });

    const group = document.createElement("div");
    group.className = "quick-move-group";

    const header = document.createElement("div");
    header.className = "quick-move-gold-title";
    header.textContent = "빠른 이동 ↗";
    group.appendChild(header);

    items.forEach((item) => {
        // 레이드 계열 링크와 기타(시너지표·경매계산기) 링크 사이 구분선
        if (item.key === "synergy") {
            const divider = document.createElement("div");
            divider.className = "quick-move-divider";
            group.appendChild(divider);
        }

        if (item.disabled || !item.href) {
            const span = document.createElement("span");
            span.className = "quick-move-gold-link disabled";
            span.setAttribute("aria-disabled", "true");
            span.style.cssText = "opacity:0.45;cursor:default;pointer-events:none;";
            span.textContent = item.label;
            group.appendChild(span);
            return;
        }
        const a = document.createElement("a");
        a.href = item.href;
        a.className = "quick-move-gold-link" + (item.key === current ? " active" : "");
        a.textContent = item.label;
        group.appendChild(a);
    });

    persistentQuickMoveEl = group;
    return persistentQuickMoveEl;
}







function setClearTimeDisabled(disabled) {
    const card = document.getElementById("timeCard");
    if (!card) return;

    card.classList.toggle("simple-disabled", disabled);
    card.querySelectorAll("input, button").forEach(el => { el.disabled = disabled; });

    const note = card.querySelector(".side-hint");
    if (note) {
        note.textContent = disabled ? "간편보기 상태에서는 비활성화" : "시간 변경 시 즉시 반영";
    }
}

/* =============================================
   골드바 HTML
   ============================================= */


function goldBarHtml(card) {
    if (!card.gold && !card.bindGold) return "";

    if (card.bindGold && !card.gold) {
        return `
            <div class="simple-goldbar">
                <div class="gold-item">
                    <div class="gold-item-label">
                        <img src="https://cdn-lostark.game.onstove.com/efui_iconatlas/money/money_16.png" class="icon" alt="">
                        <span class="gold-bind-label">귀속 골드</span>
                    </div>
                    <div class="gold-item-value gold-bind-value">${card.bindGold}</div>
                </div>
            </div>
        `;
    }

    if (currentSimpleLevel === "egir-ex" || currentSimpleLevel === "abr-ex") {
        let orb = 0;
        if (card.title && card.title.includes("노말")) orb = 150;
        else if (card.title) orb = 200;

        return `
            <div class="simple-goldbar">
                <div class="gold-item">
                    <div class="gold-item-label">
                        <img src="https://cdn-lostark.game.onstove.com/efui_iconatlas/money/money_4.png" class="icon" alt="">
                        <span class="gold-clear-label">클리어 골드</span>
                    </div>
                    <div class="gold-item-value gold-clear-value">${card.gold}</div>
                </div>
                <div class="gold-item">
                    <div class="gold-item-label">
                        <img src="../img/wing_orb.png" class="icon" alt="">
                        <span class="gold-bind-label">재료</span>
                    </div>
                    <div class="gold-item-value gold-bind-value">x${orb}</div>
                </div>
            </div>
        `;
    }

    if (card.bindGold) {
        return `
            <div class="simple-goldbar">
                <div class="gold-item">
                    <div class="gold-item-label">
                        <img src="https://cdn-lostark.game.onstove.com/efui_iconatlas/money/money_4.png" class="icon" alt="">
                        <span class="gold-clear-label">클리어 골드</span>
                    </div>
                    <div class="gold-item-value gold-clear-value">${card.gold}</div>
                </div>
                <div class="gold-operator">+</div>
                <div class="gold-item">
                    <div class="gold-item-label">
                        <img src="https://cdn-lostark.game.onstove.com/efui_iconatlas/money/money_16.png" class="icon" alt="">
                        <span class="gold-bind-label">귀속 골드</span>
                    </div>
                    <div class="gold-item-value gold-bind-value">${card.bindGold}</div>
                </div>
                <div class="gold-operator">=</div>
                <div class="gold-total">
                    <div class="gold-total-label">합계</div>
                    <div class="gold-total-value">${card.total}</div>
                </div>
            </div>
        `;
    }

    return `
        <div class="simple-goldbar">
            <div class="gold-item">
                <div class="gold-item-label">
                    <img src="https://cdn-lostark.game.onstove.com/efui_iconatlas/money/money_4.png" class="icon" alt="">
                    <span class="gold-clear-label">클리어 골드</span>
                </div>
                <div class="gold-item-value gold-clear-value">${card.gold}</div>
            </div>
        </div>
    `;
}


/* =============================================
   칸분리형 HTML
   ============================================= */

function getSimpleRaidShareConfig(title = "") {
    // 4인 레이드
    if (title.includes("세르카") || title.includes("성당")) {
        return {
            bloodShare: 0.40,
            oneShare: 1 / 3
        };
    }

    // 8인 레이드 (4막, 종막, 벨가르딘)
    return {
        bloodShare: 0.20,
        oneShare: 1 / 6
    };
}

function parseSimpleRangeParts(rangeText, cardTitle) {
    if (!rangeText || rangeText === "준비중") return null;

    const parts = String(rangeText)
        .split("-")
        .map(v => v.trim())
        .filter(Boolean);

    // 이미 3개 값을 직접 적어둔 경우
    if (parts.length === 3) {
        const nums = parts.map(v => Number(String(v).replace(/,/g, "")));
        if (nums.some(n => Number.isNaN(n))) return null;

        return {
            tank: Math.round(nums[0]),
            one: Math.round(nums[1]),
            blood: Math.round(nums[2])
        };
    }

    // 기존처럼 2개만 적혀있는 경우: 강투 - 잔혈
    if (parts.length === 2) {
        const nums = parts.map(v => Number(String(v).replace(/,/g, "")));
        if (nums.some(n => Number.isNaN(n))) return null;

        const [tank, blood] = nums;
        const config = getSimpleRaidShareConfig(cardTitle);

        const total = blood / config.bloodShare;
        const one = Math.round((total * config.oneShare) / 10) * 10; // 끝자리 0으로 정리

        return {
            tank: Math.round(tank),
            one,
            blood: Math.round(blood)
        };
    }

    return null;
}


/* =============================================
   간편보기 카드 HTML
   ============================================= */
function simpleCardHtml(card) {
    const rows = card.rows.map(r => {
        const badges = (r.badges || []).map(b => {
            const emoji = getAttrEmoji(b.text, b.cls);
            const finalText = emoji ? `${emoji} ${b.text}` : b.text;
            return `<span class="badge ${b.cls}">${finalText}</span>`;
        }).join("");

      
        const isPreparing = r.range === "준비중";
        const rawRangeParts = parseSimpleRangeParts(r.range, card.title);
        const roleMul = getRoleMultiplier();
        const rangeParts = rawRangeParts
            ? {
                tank: Math.round(rawRangeParts.tank * roleMul),
                one: Math.round(rawRangeParts.one * roleMul),
                blood: Math.round(rawRangeParts.blood * roleMul)
            }
            : null;
        const hasTripleRange = !!rangeParts && !isPreparing;



         const isSupportModeCard = currentRoleMode === "support";
        const tankLabel = isSupportModeCard ? "강조" : "강투";
        const bloodLabel = isSupportModeCard ? "잔조" : "잔혈";

        const rangeHtml = hasTripleRange
            ? `
                <div class="triple-range">
                    <div class="triple-part tank">
                        <span class="t-label">${tankLabel}</span>
                        <span class="t-value">${rangeParts.tank}</span>
                    </div>
                    <div class="triple-part one">
                        <span class="t-label">1인분</span>
                        <span class="t-value">${rangeParts.one}</span>
                    </div>
                    <div class="triple-part blood">
                        <span class="t-label">${bloodLabel}</span>
                        <span class="t-value">${rangeParts.blood}</span>
                    </div>
                </div>
            `
            : `<span class="range-b ${isPreparing ? "preparing" : ""}">${r.range}</span>`;



        return `
            <div class="simple-row ${hasTripleRange ? "has-triple-range" : ""}" style="${isPreparing ? "min-height:56px;align-items:center;" : ""}">
                <div class="simple-row-left">
                    <span class="gate-b">${r.gate}</span>
                    <span class="boss-b">${r.boss}</span>
                    <span class="simple-badges">${badges}</span>
                </div>

                <div style="text-align:right;">
                    ${rangeHtml}
                    ${r.dpscut ? `<div style="font-size:14px;color:#d4bf8a;font-style:italic;margin-top:3px;">${r.dpscut}</div>` : ""}
                </div>
            </div>
        `;
    }).join("");

    return `
        <article class="simple-card ${card.theme}">
            <div class="simple-left">
                <div class="simple-node">${card.node}</div>
            </div>

            <div class="simple-right">
                <div class="simple-head">
                    <div class="simple-mobile-title-pack">
                        <span class="simple-mobile-node">${card.node}</span>
                        <span class="simple-mobile-name">${card.title}</span>
                    </div>

                    <h3 class="simple-title">${card.title}</h3>
                    <div class="simple-kind">피해/억</div>
                </div>

                <div class="simple-rows">${rows}</div>
                ${goldBarHtml(card)}
            </div>
        </article>
    `;
}


/* =============================================
   EX 전용 카드 HTML
   ============================================= */
window.toggleExAccordion = function(card) {
    card.classList.toggle("ex-active");
};

function makeExCard(opt) {
    return `
        <div class="ex-raid-card ex-card-${opt.tier}" onclick="toggleExAccordion(this)">
            <div class="ex-card-header">
                <div class="ex-left-section">
                    <div class="ex-level-badge">${opt.level}</div>
                    <div class="ex-raid-info-title">
                        <h2>${opt.name}</h2>
                        <div class="ex-tags">
                            ${opt.tags.map(t => `<span class="ex-tag${t.weak ? " ex-weakness" : ""}">${t.text}</span>`).join("")}
                        </div>
                    </div>
                </div>

                <div class="ex-right-section">
                    <div class="ex-stats-grid">
                        <div class="ex-stat-col">
                            <div class="ex-stat-label l-tank">강투</div>
                            <div class="ex-stat-dmg">${opt.tank_dmg}</div>
                            <div class="ex-stat-dps">${opt.tank_dps}</div>
                        </div>
                        <div class="ex-stat-col">
                            <div class="ex-stat-label l-one">1인분</div>
                            <div class="ex-stat-dmg">${opt.one_dmg}</div>
                            <div class="ex-stat-dps">${opt.one_dps}</div>
                        </div>
                        <div class="ex-stat-col col-blood">
                            <div class="ex-stat-label l-blood">잔혈</div>
                            <div class="ex-stat-dmg">${opt.blood_dmg}</div>
                            <div class="ex-stat-dps">${opt.blood_dps}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ex-detail-bar">
                <span>상세보기</span>
                <span class="ex-detail-arrow">▼</span>
            </div>

            <div class="ex-accordion-content" onclick="event.stopPropagation();">
                <div class="ex-pc-table-view">
                    <table class="ex-dps-table">
                        <thead>
                            <tr>
                                <th style="text-align:left;width:31%;">구간 (누적 기준)</th>
                                <th style="width:23%;">강투 (15%)</th>
                                <th style="width:23%;">1인분 (16.66%)</th>
                                <th style="width:23%;" class="ex-col-highlight">잔혈 (20%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${opt.phases.map(p => `
                                <tr${p.total ? ' class="ex-row-total"' : ''}>
                                    <td class="ex-phase-title">${p.label}<span>${p.sub}</span></td>
                                    <td><span class="ex-val-text">${p.t_d}</span><span class="ex-dps-text">${p.t_s}</span></td>
                                    <td><span class="ex-val-text">${p.o_d}</span><span class="ex-dps-text">${p.o_s}</span></td>
                                    <td class="ex-col-highlight"><span class="ex-val-text">${p.b_d}</span><span class="ex-dps-text">${p.b_s}</span></td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>

                <div class="ex-mobile-list-view">
                    ${opt.phases.map(p => `
                        <div class="ex-m-phase-card${p.total ? " ex-m-total" : ""}">
                            <div class="ex-m-phase-header">
                                <span class="ex-m-phase-name ex-phase-title"${p.total ? ` style="color:${opt.tierColor};"` : ""}>${p.label}</span>
                                <span class="ex-m-phase-info"${p.total ? ` style="color:${opt.tierColor};"` : ""}>${p.sub}</span>
                            </div>
                            <div class="ex-m-grid-row"><span class="ex-m-label">강투 (15%)</span><span class="ex-m-values">${p.t_d}<span class="ex-m-dps">${p.t_s}</span></span></div>
                            <div class="ex-m-grid-row"><span class="ex-m-label">1인분 (16.6%)</span><span class="ex-m-values">${p.o_d}<span class="ex-m-dps">${p.o_s}</span></span></div>
                            <div class="ex-m-grid-row ex-m-highlight"><span class="ex-m-label">잔혈 (20%)</span><span class="ex-m-values">${p.b_d}<span class="ex-m-dps">${p.b_s}</span></span></div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>
    `;
}

/* =============================================
   보스 그래프 + 에스더 HTML
   ============================================= */
function makeBossSection(config) {
    const bossCards = config.bosses.map(b => {
        const totalPct = b.parts.reduce((acc, p) => acc + p.pct, 0);
        let current = 0;
        const gradient = b.parts.map(p => {
            const start = current / totalPct * 100;
            current += p.pct;
            const end = current / totalPct * 100;
            return `${p.color} ${start}% ${end}%`;
        }).join(", ");

        const labels = b.parts.map(p => `
            <div class="boss-label-item">
                <div class="boss-label-dot" style="background:${p.color};"></div>
                <div>
                    <div class="boss-label-name">${p.name}</div>
                    <div class="boss-label-pct" style="color:${p.color};">${p.pct}%</div>
                </div>
            </div>
        `).join("");

        const legends = b.parts.map(p => `
            <div class="boss-legend-row">
                <div class="boss-legend-dot" style="background:${p.color};"></div>
                ${p.legend}
                <span class="boss-legend-val">${p.hp}</span>
            </div>
        `).join("");

        return `
            <div class="boss-card">
                <div class="boss-card-title" style="color:${b.color};">
                    <div class="bar" style="background:${b.color};"></div>${b.name}
                </div>
                <div class="boss-chart-row">
                    <div class="boss-labels">${labels}</div>
                    <div class="boss-donut-wrap">
                        <div class="boss-donut" style="background:conic-gradient(from -90deg, ${gradient}); box-shadow:0 0 0 3px rgba(255,255,255,.03), 0 4px 14px rgba(0,0,0,.4);">
                            <div class="boss-donut-inner">
                                <div class="boss-donut-title">총 체력</div>
                                <div class="boss-donut-val">${b.totalHp}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="boss-legend">${legends}</div>
                <div class="boss-total-row">
                    <span class="boss-total-label">총 체력</span>
                    <span class="boss-total-val" style="color:${b.color};">${b.totalHp}</span>
                </div>
            </div>
        `;
    }).join("");

    const estherRows = config.esther.map(r => `
        <div class="esther-row">
            <div>${r[0]}</div>
            <div style="color:${config.col1};">${r[1]}</div>
            <div style="color:${config.col2};">${r[2]}</div>
            <div style="color:${config.col3};">${r[3]}</div>
        </div>
    `).join("");

    return `
        <div class="boss-info-section">
            <div class="section-header">
                <div class="dot" style="background:${config.headerColor};"></div>
                <span class="section-title">보스 체력 정보</span>
            </div>
            <div class="warning-bar">⚠ 보스 체력정보 / 에스더 데미지는 직접 수작업으로 체크한 부분이라 정확하지 않을 수 있습니다.</div>
            <div class="boss-grid">${bossCards}</div>
            <div class="esther-table">
                <div class="esther-header">
                    <div class="bar" style="background:${config.estherBar};"></div>
                    <span>에스더 데미지 기대값</span>
                </div>
                <div class="esther-cols">
                    <div>에스더 스킬</div>
                    <div style="color:${config.col1};">${config.colName1}</div>
                    <div style="color:${config.col2};">${config.colName2}</div>
                    <div style="color:${config.col3};">${config.colName3}</div>
                </div>
                ${estherRows}
            </div>
        </div>
    `;
}

/* =============================================
   EX / 간편보기 렌더
   ============================================= */
function renderExView(exKey) {
    const data = exRaidData[exKey];
    if (!data) return "<div class='coming-soon'><h3>준비중</h3></div>";

    const tierColors = { normal: "#34d399", hard: "#f7ca54", nightmare: "#a78bfa" };
    const cards = data.cards.map(c => makeExCard({ ...c, tierColor: tierColors[c.tier] || "#fff" })).join("");
    const boss = data.bossSection ? makeBossSection(data.bossSection) : "";

    const introTheme = exKey === "egir-ex" ? "ex-intro-purple" : "ex-intro-gold";

    return `
        <div class="simple-view">
            <div class="ex-intro-box ${introTheme}">
                <div class="ex-intro-title-box">${data.sectionTitle}</div>
                <div class="ex-intro-desc">${data.intro}</div>
            </div>
            <div class="ex-dash-container">${cards}</div>
            ${boss}
        </div>
    `;
}

function renderRaidSimpleView() {
    const meta = simpleRaidMeta[currentSimpleRaid];
    const cards = getSimpleRaidCards(currentSimpleRaid);
    const target = document.getElementById("simpleCardsFull") || document.getElementById("mainContent");

    if (!meta) {
        if (target) {
            target.innerHTML = ""; // 청소
            target.insertAdjacentHTML("beforeend",
                '<div class="coming-soon"><h3>준비중</h3><p>데이터 준비중입니다.</p></div>');
        }
        return;
    }

    // [보완] 렌더링 전 타겟 클리어
    if (target) {
        target.innerHTML = "";
    }

    target.insertAdjacentHTML("beforeend", `
        <div class="simple-view">
            <div class="simple-stack">
                ${cards.length > 0
                    ? cards.map(simpleCardHtml).join("")
                    : "<div class='coming-soon'><h3>준비중</h3><p>곧 업데이트 예정입니다.</p></div>"}
            </div>
        </div>
    `);
}




function renderSimpleView() {
    const defaultContent = document.getElementById("defaultSimpleContent");
    if (defaultContent) defaultContent.remove();

    if (currentSimpleLevel === "egir-ex" || currentSimpleLevel === "abr-ex") {
        document.getElementById("mainContent").innerHTML = renderExView(currentSimpleLevel);
        return;
    }

    const data = simpleData[currentSimpleLevel];
    const target = document.getElementById("simpleCardsFull") || document.getElementById("mainContent");

    if (!data) {
        if (target) {
            target.innerHTML = ""; // 기존 잔여물 청소
            target.insertAdjacentHTML("beforeend",
                '<div class="coming-soon"><h3>준비중</h3><p>데이터 준비중입니다.</p></div>');
        }
        return;
    }

    const { goldCards, extraCards } = getSimpleLevelCardSections(currentSimpleLevel);

    // [보완] 카드를 덧붙이기 전에 기존 카드를 한 번 깨끗하게 비워줌
    if (target) {
        target.innerHTML = ""; 
    }

    target.insertAdjacentHTML("beforeend", `
        <div class="simple-view">
            <div class="simple-stack">
                ${
                    goldCards.length > 0
                        ? goldCards.map(simpleCardHtml).join("")
                        : "<div class='coming-soon'><h3>준비중</h3><p>곧 업데이트 예정입니다.</p></div>"
                }
                ${
                    extraCards.length > 0
                        ? `
                            <div class="simple-extra-wrap">
                                <button class="simple-extra-toggle" id="simpleExtraToggleBtn" type="button">
                                    <span id="simpleExtraToggleText">골드 미획득 레이드 펼치기</span>
                                    <span id="simpleExtraToggleArrow">▼</span>
                                </button>
                                <div class="simple-extra-panel" id="simpleExtraPanel">
                                    <div class="simple-extra-stack">
                                        ${extraCards.map(simpleCardHtml).join("")}
                                    </div>
                                </div>
                            </div>
                        `
                        : ""
                }
            </div>
        </div>
    `);

    bindSimpleExtraToggle();
}




/* =============================================
   파티 DPS
   ============================================= */
function getCurrentRowsForPartyDps() {
    if (currentMenu === "simple") return [];

    if (currentMenu === "guardian") {
        const tier = currentGuardianTier;
        const boss = getCurrentGuardianBoss();
        const isAvail = isGuardianBossAvailable(tier, boss);
        if (!isAvail) return [];
        return getGuardianParsedRows(tier, boss);
    }

    if (currentMenu === "serka" || currentMenu === "cathedral" || currentMenu === "belgardin") {
        const info = raidMeta[currentMenu][currentCombo];
        return parsedData[currentMenu]?.[info.diffKey] || [];
    }

    if (currentMenu === "extreme") {
        const isJongmak = currentExtremeRaid === "jongmak";
        if (currentExtremeRaid !== "mordum" && !isJongmak) return [];
        const meta = raidMeta.extreme[currentExtremeRaid][currentCombo];
        const data = meta && (isJongmak ? getJongmakLive(meta.diffKey) : MORDUM_EX_DATA[meta.diffKey]);
        if (!data) return [];
        const shares = data.shares;
        const shareList = [10, 11, 12, 13, 14, 15, 16, shares.one, 17, 18, 19, 20, 21, 22, 23, 24, 25]
            .filter((v, i, arr) => arr.indexOf(v) === i);
        return shareList.map(s => ({ share: s, damage: data.effectiveDamage * s / 100 }));
    }

    return [];
}

function getDamageFromRow(row) {
    if (!row) return 0;

    if (currentMenu === "guardian") return row.damage || 0;

    if (currentMenu === "serka" || currentMenu === "cathedral" || currentMenu === "belgardin") {
        return raidMeta[currentMenu][currentCombo].gateKey === "gate1"
            ? row.g1 || 0
            : row.g2 || 0;
    }

    return row.damage || 0;
}

function getPartyDpsValue() {
    const rows = getCurrentRowsForPartyDps();
    if (!rows.length) return null;

    const shareMenu = currentMenu === "extreme" ? currentExtremeRaid : currentMenu;
    const shares = getPrecisionShares(shareMenu);
    let found = null;
    for (const share of [shares.one, shares.tank, shares.blood]) {
        found = rows.find(r => r.share === share && getDamageFromRow(r) > 0);
        if (found) break;
    }

    if (!found) found = rows.find(r => getDamageFromRow(r) > 0) || null;
    if (!found) return null;

    const dmg = getDamageFromRow(found);
    const pct = (found.share || 0) / 100;
    return (dmg && pct) ? dmg / pct / getTotalSeconds() : null;
}

function updatePartyDpsDisplay() {
    const el = document.getElementById("partyDpsDisplay");
    const isGuardianPending = currentMenu === "guardian" &&
        !isGuardianBossAvailable(currentGuardianTier, getCurrentGuardianBoss());

    if (currentMenu === "simple" || isGuardianPending) {
        el.innerHTML = '파티 DPS : <span class="party-dps-value">-</span>';
        return;
    }

    const val = getPartyDpsValue();
    el.innerHTML = val !== null
        ? `파티 DPS : <span class="party-dps-value">${fmtPartyDps(val)}</span>`
        : '파티 DPS : <span class="party-dps-value">-</span>';
}


/* =============================================
   가디언 히어로 바
   ============================================= */

function makeGuardianHero(tier, boss, bossInfo) {
    const bossElementEmoji = getGuardianElementEmojiFromWeakness(bossInfo.attr.text);
    const weakEmoji = getAttrEmoji(bossInfo.attr.text, bossInfo.attr.cls);
    const stageText = tier === "1730" ? "잔영 : 1단계" : (tier === "1750" ? "잔영 : 2단계" : "잔영 : 3단계");

    return `
        <div class="p-hero hero-guardian">
            <div class="p-hero-inner">
                <div class="p-hero-left">
                    <div class="p-hero-copy">
                        <div class="p-hero-kicker">PRECISION · GUARDIAN RAID</div>

                        <div class="p-hero-title-row">
                            <div class="p-hero-icon">🐉</div>
                            

                            <div class="p-hero-title-wrap">
                                <h2 class="p-hero-title">가디언 토벌<span class="p-hero-member-badge">4인</span></h2>
                                <div class="p-hero-subtitle">${stageText}</div>
                            </div>


                        </div>

                        <div class="p-hero-badges">
                            <span class="p-badge b-type">${bossInfo.type.text}</span>
                            <span class="p-badge b-attr">${weakEmoji ? `${weakEmoji} ` : ""}${bossInfo.attr.text}</span>
                        </div>

                       <p class="p-hero-desc">
    레벨과 보스를 선택하면 잔영 단계별 강투·1인분·잔혈 컷 딜지분과 DPS를 실시간으로 확인할 수 있습니다.
</p>
                    </div>

                    <div class="p-hero-pills">
                        <span class="p-pill ${tier === "1730" ? "active" : ""}">1730 가디언</span>
                        <span class="p-pill ${tier === "1750" ? "active" : ""}">1750 가디언</span>
                        <span class="p-pill ${tier === "1770" ? "active" : ""}">1770 가디언</span>
                    </div>
                </div>

           
            </div>
        </div>
    `;
}

function makeGuardianMiniHero(tier, boss, bossInfo) {
    const bossElementEmoji = getGuardianElementEmojiFromWeakness(bossInfo.attr.text);

    return `
        <div class="p-hero p-mini-hero hero-guardian">
            <div class="p-mini-hero-row">
                <div class="p-mini-hero-left">
                    <span class="p-hero-kicker" style="margin-bottom:0;">PRECISION · GUARDIAN RAID</span>
                    <span class="p-mini-hero-divider"></span>
                    <div class="p-hero-icon p-hero-icon-sm">🐉</div>
                    <span class="p-mini-hero-title">가디언 토벌</span>
                </div>
                <div class="p-mini-hero-stats">
                    <div>
                        <div class="p-stat-label" style="margin-bottom:0;">입장 레벨</div>
                        <div class="p-mini-hero-title">${tier}</div>
                    </div>
                    <div>
                        <div class="p-stat-label" style="margin-bottom:0;">보스명</div>
                        <div class="p-mini-hero-title">${bossElementEmoji} ${boss}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}



/* =============================================
   보상 위젯 HTML 생성
   ============================================= */
function getRewardDataSource(menu) {
    if (menu === "serka") return serkaRewardData;
    if (menu === "cathedral") return cathedralRewardData;
    if (menu === "belgardin") return belgardinRewardData;
    return null;
}

function makeRewardWidget(menu, comboKey) {
    const dataSource = getRewardDataSource(menu);
    const data = dataSource ? dataSource[comboKey] : null;
    if (!data) return "";

    const widgetId = `rewardWidget_${menu}`;
    const moreId = `rewardMore_${menu}`;
    const moreBtnId = `rewardMoreBtn_${menu}`;

    const itemSlots = (items) => items.map(item =>
        `<div class="rw-slot" title="${item.name}"><img src="${item.src}" alt="${item.name}" loading="lazy"><span class="rw-count">${item.count}</span></div>`
    ).join("");

    const goldLine = (gold) => gold ? `
        <div class="rw-currency">
            <div class="rw-currency-left"><img class="rw-currency-icon" src="https://cdn-lostark.game.onstove.com/efui_iconatlas/money/money_4.png" alt="골드"><span>골드</span></div>
            <span class="rw-gold">${gold}</span>
        </div>` : "";

    const shardLine = (shard) => shard ? `
        <div class="rw-currency">
            <div class="rw-currency-left"><img class="rw-currency-icon" src="https://cdn-lostark.game.onstove.com/efui_iconatlas/money/money_15.png" alt="운명의 파편"><span>운명의 파편</span></div>
            <span class="rw-shard">${shard}</span>
        </div>` : "";

    return `
        <div class="rw-widget" id="${widgetId}">
            <div class="rw-title">클리어 보상</div>
            <div class="rw-grid">${itemSlots(data.clearItems)}</div>
            ${goldLine(data.gold)}
            ${shardLine(data.shard)}

            <div class="rw-more-area">
                <button class="rw-more-btn" id="${moreBtnId}" type="button">더보기 보상 열기 ▼</button>
                <div class="rw-more-content" id="${moreId}">
                    <div class="rw-more-label">더보기 고정보상</div>
                    <div class="rw-grid">${itemSlots(data.moreItems)}</div>
                    ${goldLine(data.moreGold)}
                    ${shardLine(data.moreShard)}
                </div>
            </div>
        </div>
    `;
}

function makeRewardWidgetMobile(menu, comboKey) {
    const dataSource = getRewardDataSource(menu);
    const data = dataSource ? dataSource[comboKey] : null;
    if (!data) return "";

    const moreId = `mobileRewardMore_${menu}`;
    const moreBtnId = `mobileRewardMoreBtn_${menu}`;

    const itemSlots = (items) => items.map(item =>
        `<div class="rw-slot" title="${item.name}"><img src="${item.src}" alt="${item.name}" loading="lazy"><span class="rw-count">${item.count}</span></div>`
    ).join("");

    const goldLine = (gold) => gold ? `
        <div class="rw-currency">
            <div class="rw-currency-left">
                <img class="rw-currency-icon" src="https://cdn-lostark.game.onstove.com/efui_iconatlas/money/money_4.png" alt="골드">
                <span>골드</span>
            </div>
            <span class="rw-gold">${gold}</span>
        </div>` : "";

    const shardLine = (shard) => shard ? `
        <div class="rw-currency">
            <div class="rw-currency-left">
                <img class="rw-currency-icon" src="https://cdn-lostark.game.onstove.com/efui_iconatlas/money/money_15.png" alt="운명의 파편">
                <span>운명의 파편</span>
            </div>
            <span class="rw-shard">${shard}</span>
        </div>` : "";

    return `
        <div class="rw-widget mobile-rw-widget">
            <div class="rw-title">클리어 보상</div>
            <div class="rw-grid">${itemSlots(data.clearItems)}</div>
            ${goldLine(data.gold)}
            ${shardLine(data.shard)}

            <div class="rw-more-area">
                <button class="rw-more-btn" id="${moreBtnId}" type="button">더보기 보상 열기 ▼</button>
                <div class="rw-more-content" id="${moreId}">
                    <div class="rw-more-label">더보기 고정보상</div>
                    <div class="rw-grid">${itemSlots(data.moreItems)}</div>
                    ${goldLine(data.moreGold)}
                    ${shardLine(data.moreShard)}
                </div>
            </div>
        </div>
    `;
}

function makeMobilePrecisionTools(menu, comboKey) {
    const timeBtnId = `openMobileTimeBtn_${menu}`;
    const rewardToggleId = `mobileRewardToggle_${menu}`;
    const rewardBoxId = `mobileRewardBox_${menu}`;

    return `
        <div class="mobile-precision-tools">
            <button class="mobile-precision-tool-btn" id="${timeBtnId}" type="button">
                ⏱ 클리어 타임 입력
            </button>

            <button class="mobile-precision-tool-btn" id="${rewardToggleId}" type="button">
                📦 클리어 보상 확대하기
            </button>
        </div>

        <div class="mobile-reward-collapse" id="${rewardBoxId}">
            ${makeRewardWidgetMobile(menu, comboKey)}
        </div>
    `;
}

function bindRewardMoreToggle(menu) {
    const moreId = `rewardMore_${menu}`;
    const moreBtnId = `rewardMoreBtn_${menu}`;
    const btn = document.getElementById(moreBtnId);
    const content = document.getElementById(moreId);
    if (!btn || !content) return;

    btn.addEventListener("click", () => {
        const isOpen = content.classList.toggle("rw-open");
        btn.textContent = isOpen ? "더보기 보상 닫기 ▲" : "더보기 보상 열기 ▼";
    });
}



let biOutsideClickBound = false;

function biIconChip(itemName, opts) {
    opts = opts || {};
    const item = window.BattleItemsAPI ? window.BattleItemsAPI.findByName(itemName) : null;
    const src = item ? window.BattleItemsAPI.toCdnUrl(item.icon) : "";
    const sizeCls = opts.mini ? " bi-mini" : "";
    return `
        <div class="bi-hero-icon-chip${sizeCls}" data-item-name="${itemName}">
            <img src="${src}" alt="${itemName}" loading="lazy"
                 onerror="this.src='https://cdn-lostark.game.onstove.com/efui_iconatlas/battle_item/battle_item_01_0.png'">
        </div>
    `;
}

function biChoiceToggleChip(groupIdx, options, selectedIdx) {
    const current = options[selectedIdx] || options[0];
    const curItem = window.BattleItemsAPI ? window.BattleItemsAPI.findByName(current) : null;
    const curSrc = curItem ? window.BattleItemsAPI.toCdnUrl(curItem.icon) : "";

    const rows = options.map((name, idx) => {
        const optItem = window.BattleItemsAPI ? window.BattleItemsAPI.findByName(name) : null;
        const optSrc = optItem ? window.BattleItemsAPI.toCdnUrl(optItem.icon) : "";
        return `
            <div class="bi-reco-row ${idx === selectedIdx ? "active" : ""}" data-idx="${idx}" data-item-name="${name}" title="${name}">
                <img src="${optSrc}" alt="${name}"
                     onerror="this.src='https://cdn-lostark.game.onstove.com/efui_iconatlas/battle_item/battle_item_01_0.png'">
            </div>
        `;
    }).join("");

    return `
        <div class="bi-choice-wrap" data-group-idx="${groupIdx}">
            <div class="bi-hero-icon-chip bi-choice-toggle" data-group-toggle="${groupIdx}">
                <div class="bi-hero-icon-chip-inner" data-item-name="${current}">
                    <img src="${curSrc}" alt="${current}"
                         onerror="this.src='https://cdn-lostark.game.onstove.com/efui_iconatlas/battle_item/battle_item_01_0.png'">
                </div>
                <span class="bi-open-tag"><span class="bi-open-arrow">▼</span>열기</span>
            </div>
            <div class="bi-choice-drawer" data-drawer="${groupIdx}">${rows}</div>
        </div>
    `;
}

export function buildHeroBattleIconsHtml(menu, diffKey, gateKey, role, gateLabel) {
    const loadout = getRaidBattleLoadout(menu, diffKey, gateKey, role);
    if (!loadout) return "";

    const fixedHtml = loadout.fixed.map(name => biIconChip(name)).join("");

    const choiceHtml = loadout.choiceGroups.map((options, groupIdx) => {
        const stateKey = `${menu}_${gateKey}_${role}_${groupIdx}`;
        const selectedIdx = battleItemChoiceState[stateKey] || 0;
        return biChoiceToggleChip(groupIdx, options, selectedIdx);
    }).join("");

    const gateBadgeHtml = gateLabel ? `<div class="bi-hero-gate-badge">${gateLabel}</div>` : "";

    return `<div class="bi-hero-icons-row" data-bi-menu="${menu}" data-bi-gate="${gateKey}" data-bi-role="${role}">${gateBadgeHtml}${fixedHtml}${choiceHtml}</div>`;
}

export function buildMiniBattleIconsHtml(menu, diffKey, gateKey, role) {
    const loadout = getRaidBattleLoadout(menu, diffKey, gateKey, role);
    if (!loadout) return "";

    // 고정 아이템은 구분자 없이 그대로 나열하고, 선택형 그룹 안의 옵션들 사이에만 "+"를 넣어
    // "여러 옵션 중 하나"라는 걸 시각적으로 구분함 (기본값은 항상 각 그룹의 첫 번째 옵션)
    const fixedHtml = loadout.fixed.map(name => biIconChip(name, { mini: true })).join("");
    const choiceHtml = loadout.choiceGroups
        .map(options => options.map(name => biIconChip(name, { mini: true })).join(`<span class="bi-mini-plus">+</span>`))
        .join("");

    return `<div class="bi-mini-icons-row">${fixedHtml}${choiceHtml}</div>`;
}

export function bindRaidBattleItemIcons() {
    // 마우스오버 툴팁 (히어로 고정/선택아이콘 + 서랍 안 아이템 + 미니히어로 아이콘 전부)
    if (window.BattleItemsAPI) {
        document.querySelectorAll(
            ".bi-hero-icon-chip[data-item-name], .bi-hero-icon-chip-inner[data-item-name], .bi-reco-row[data-item-name]"
        ).forEach(el => {
            window.BattleItemsAPI.bindTooltip(el, el.dataset.itemName);
        });
    }

    // 선택형 서랍 열기/닫기 (한 번에 하나만 열리는 아코디언 방식)
    document.querySelectorAll(".bi-choice-toggle[data-group-toggle]").forEach(toggle => {
        toggle.addEventListener("click", (e) => {
            e.stopPropagation();
            const wrap = toggle.closest(".bi-choice-wrap");
            const drawer = wrap ? wrap.querySelector(".bi-choice-drawer") : null;
            if (!drawer) return;
            const willOpen = !drawer.classList.contains("open");

            document.querySelectorAll(".bi-choice-drawer.open").forEach(d => d.classList.remove("open"));
            document.querySelectorAll(".bi-choice-toggle.open").forEach(t => t.classList.remove("open"));

            if (willOpen) {
                drawer.classList.add("open");
                toggle.classList.add("open");
            }
        });
    });

    // 서랍은 열기/닫기만 가능한 "보기 전용" — 안의 아이템을 눌러도 선택이 바뀌지 않음
    // (예전엔 여기서 클릭 시 battleItemChoiceState를 바꾸고 renderTable()을 다시 불렀지만,
    //  요청에 따라 다른 추천 옵션이 뭐가 있는지 확인만 하는 용도로 변경함)

    // 바깥 클릭 시 열린 서랍 닫기 (리스너 중복 등록 방지)
    if (!biOutsideClickBound) {
        biOutsideClickBound = true;
        document.addEventListener("click", () => {
            document.querySelectorAll(".bi-choice-drawer.open").forEach(d => d.classList.remove("open"));
            document.querySelectorAll(".bi-choice-toggle.open").forEach(t => t.classList.remove("open"));
        });
    }
}





export function makeRaidPrecisionHero(menu, meta, currentDiff) {
    const isSerka = menu === "serka";
    const isCathedral = menu === "cathedral";
    const isMordum = menu === "mordum";
    const raidTitle = getRaidDisplayName(menu);
    const memberCount = RAID_MEMBER_COUNT[menu] || "";

    const themeClass = isSerka ? "hero-serka" : (isCathedral ? "hero-cathedral" : (isMordum ? "hero-mordum" : "hero-belgardin"));
    const kicker = isSerka ? "PRECISION · SERKA" : (isCathedral ? "PRECISION · CATHEDRAL" : (isMordum ? "PRECISION · MORDUM EX" : "PRECISION · BELGARDIN"));
    const icon = isSerka ? "🧹" : (isCathedral ? "⛪" : (isMordum ? "⚡" : "🧛"));
    const subtitle = isSerka ? "그림자 레이드" : (isCathedral ? "어비스 던전" : (isMordum ? "익스트림 레이드" : "그림자 레이드"));

    const entryLevelMatch = meta.title.match(/\((\d+)\)/);
    const entryLevel = entryLevelMatch ? entryLevelMatch[1] : "-";
    const diffLabel = meta.title.replace(/\s*\(.+\)/, "");
    const gateLabel = meta.gateName;
    const attrEmoji = getAttrEmoji(meta.attr.text, meta.attr.cls);

    const pills = isSerka
        ? [
            { key: "normal", text: "노말 · 1710" },
            { key: "hard", text: "하드 · 1730" },
            { key: "nightmare", text: "나메 · 1740" }
        ]
        : isCathedral
        ? [
            { key: "normal", text: "1단계 · 1700" },
            { key: "hard", text: "2단계 · 1720" },
            { key: "nightmare", text: "3단계 · 1750" }
        ]
        : isMordum
        ? [
            { key: "normal", text: "노말 · 1730" },
            { key: "hard", text: "하드 · 1770" },
            { key: "nightmare", text: "나메 · 1780" }
        ]
        : [
            { key: "normal", text: "노말 · 1750" },
            { key: "hard", text: "하드 · 1770" },
            { key: "nightmare", text: "나메 · 1780" }
        ];

    const heroBattleIconsHtml = buildHeroBattleIconsHtml(menu, meta.diffKey, meta.gateKey, currentRoleMode, gateLabel);
    const hasHeroItems = !!heroBattleIconsHtml;
    // 딜러/서폿 토글은 배틀아이템 데이터 유무와 상관없이 항상 노출 (지평/벨가르딘처럼 아직 데이터가 없어도 토글은 보여야 함)
    const heroRightBlock = `
                <div class="p-hero-right bi-hero-items-wrap">
                    <div class="bi-hero-items-header" style="justify-content:flex-end;">
                        ${makeRoleToggleHtml("hero")}
                    </div>
                    ${hasHeroItems ? `<div class="bi-hero-items-label">추천 배틀아이템</div>` : ""}
                    ${heroBattleIconsHtml}
                </div>
    `;

    return `
        <div class="p-hero ${themeClass}">
            <div class="p-hero-inner">
                <div class="p-hero-left">
                    <div class="p-hero-copy">
                        <div class="p-hero-kicker">${kicker}</div>

                        <div class="p-hero-title-row">
                            <div class="p-hero-icon">${icon}</div>
                           

                            <div class="p-hero-title-wrap">
                                <h2 class="p-hero-title">${raidTitle}<span class="p-hero-member-badge">${memberCount}</span></h2>
                                <div class="p-hero-subtitle">${subtitle}</div>
                            </div>
                        </div>

                        <div class="p-hero-badges">
                            <span class="p-badge b-type">${meta.type.text}</span>



                            <span class="p-badge b-attr">${attrEmoji ? `${attrEmoji} ` : ""}${meta.attr.text}</span>
                        </div>

                        <p class="p-hero-desc">
    클리어 시간을 입력하면 강투·1인분·잔혈 컷 딜지분별 DPS를 실시간으로 확인할 수 있습니다.
</p>
                    </div>

                    <div class="p-hero-pills">
                        ${pills.map(p => `
                            <span class="p-pill diff-${p.key} ${currentDiff === p.key ? "active" : ""}">${p.text}</span>
                        `).join("")}
                    </div>
                </div>

                ${heroRightBlock}
            </div>
        </div>
    `;
}

export function makeRaidMiniHero(menu, meta) {
    const isSerka = menu === "serka";
    const isCathedral = menu === "cathedral";
    const isMordum = menu === "mordum";
    const raidTitle = getRaidDisplayName(menu);
    const themeClass = isSerka ? "hero-serka" : (isCathedral ? "hero-cathedral" : (isMordum ? "hero-mordum" : "hero-belgardin"));
    const icon = isSerka ? "🧹" : (isCathedral ? "⛪" : (isMordum ? "⚡" : "🧛"));

    const entryLevelMatch = meta.title.match(/\((\d+)\)/);
    const entryLevel = entryLevelMatch ? entryLevelMatch[1] : "-";
    const diffLabel = meta.title.replace(/\s*\(.+\)/, "");
    const gateLabel = meta.gateName;




    const patchBadgeHtml = "";

    const miniBattleIconsHtml = buildMiniBattleIconsHtml(menu, meta.diffKey, meta.gateKey, currentRoleMode);
    const miniLoadoutBlock = miniBattleIconsHtml ? `
                <div class="bi-mini-loadout-inline">
                    ${makeRoleBadgeHtml()}
                    ${miniBattleIconsHtml}
                </div>
    ` : "";

    return `
        <div class="p-hero p-mini-hero ${themeClass}">
            <div class="p-mini-hero-row">
                <div class="p-mini-hero-left">
                    <div class="p-hero-icon p-hero-icon-sm">${icon}</div>
                    <span class="p-mini-hero-title">${raidTitle}</span>
                    <span class="p-mini-diff-badge diff-${meta.diffKey}">${diffLabel}</span>
                    <span class="p-mini-gate-badge">${gateLabel}</span>
                    <span class="p-mini-level-badge">${entryLevel}</span>
                    ${patchBadgeHtml}
                </div>

                ${miniLoadoutBlock}
            </div>
        </div>
    `;
}




/* =============================================
   가디언 컨트롤
   ============================================= */
function makeGuardianControl(tier, boss, bossList, availList, bossInfo) {
    const oldBosses = ["루멘칼리고","가르가디스","스콜라키아","크라티오스","아게오로스","드렉탈라스","소나벨","베스칼"];

    const tierColorMap = { "1730": "gt-green", "1750": "gt-gold", "1770": "gt-purple" };
    const tierChecks = ["1730", "1750", "1770"].map(t => {
        const isActive = tier === t;
        const cls = tierColorMap[t];

        return `
            <div class="guardian-tier-chip ${isActive ? `${cls} active` : ""}" data-tier="${t}">
                <span class="guardian-tier-chip-text">${t}</span>
            </div>
        `;
    }).join("");

    const makeDropdownItem = (b) => {
        const m = gatoMeta[b];
        const isActive = b === boss;
        const isAvail = availList.includes(b);
        const baseEmoji = getGuardianElementEmojiFromWeakness(m.attr.text);

        return `
            <div class="guardian-dropdown-item ${isActive ? "gd-active" : ""} ${isAvail ? "" : "pending"}" data-boss="${b}">
                <div class="gd-item-name">
                    <span class="gd-item-name-wrap">
                        <span class="element-emoji">${baseEmoji}</span>
                        <span>${b}</span>
                    </span>
                </div>
                <div class="gd-item-badges">
                    ${makeBadge(m.type.text, m.type.cls)}
                    ${makeBadge(m.attr.text, m.attr.cls)}
                </div>
                ${isAvail ? "" : '<span class="gd-pending-tag">준비중</span>'}
            </div>
        `;
    };

    const oldItems = bossList.filter(b => oldBosses.includes(b)).map(makeDropdownItem).join("");
    const newItems = bossList.filter(b => !oldBosses.includes(b)).map(makeDropdownItem).join("");
    const triggerEmoji = getGuardianElementEmojiFromWeakness(bossInfo.attr.text);

    // 요청 반영: [1730][1750][1770] 티어 버튼을 한 줄로, 그 아래 줄에 보스 선택 드롭다운을 배치
    // (guardian-inline-row를 1열로 강제 → 상단 guardian-top-tools(티어+시간버튼), 하단 guardian-select-inline(드롭다운) 순서로 쌓임)
    return `
        <div class="precision-control guardian-inline-control">
            <div class="guardian-inline-row" style="display:grid;grid-template-columns:1fr;gap:12px;">
                <div class="guardian-top-tools">
                    <div class="guardian-tier-inline" style="display:grid;grid-template-columns:repeat(3, minmax(0,1fr));gap:8px;">
                        ${tierChecks}
                    </div>

                    <button class="guardian-mobile-time-btn" id="guardianMobileTimeBtn" type="button">
                        ⏱ 클리어 타임 입력
                    </button>
                </div>

                <div class="guardian-select-inline">
                    <div class="guardian-dropdown">
                        <div class="guardian-dropdown-trigger compact">
                            <div class="gd-trigger-name">
                                <span class="gd-trigger-name-wrap">
                                    <span class="element-emoji">${triggerEmoji}</span>
                                    <span>${boss}</span>
                                </span>
                            </div>
                            <div class="gd-trigger-badges">
                                ${makeBadge(bossInfo.type.text, bossInfo.type.cls)}
                                ${makeBadge(bossInfo.attr.text, bossInfo.attr.cls)}
                            </div>
                            <div class="gd-trigger-arrow">▼</div>
                        </div>

                        <div class="guardian-dropdown-list" style="display:none;">
                            <div class="gd-group-label">기존 가디언</div>
                            ${oldItems}
                            <div class="gd-group-label">신규 가디언</div>
                            ${newItems}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}


/* =============================================
   공통 요약 카드 HTML
   ============================================= */


function makePrecisionSummary(rowTank, rowOne, rowBlood, getDmgFn, totalSec, menu, isSupport) {
    const shares = getPrecisionShares(menu);
    const fmtShare = (s) => Number.isInteger(s) ? s : s.toFixed(1);

    const labels = isSupport
        ? { tank: "강조컷", one: "1인분", blood: "잔조컷" }
        : { tank: "강투컷", one: "1인분", blood: "잔혈컷" };

   
    const dpsLabel = isSupport ? "조력 DPS" : "DPS";

    const makeCard = (key, labelCls, cardCls, dpsCls, defaultShare, row) => {
        const dmg = row ? Math.floor(getDmgFn(row)) : 0;
        const dps = row ? floorTo1(dmg / totalSec).toFixed(1) : "-";
        const shareVal = (isSupport && row && row.share !== undefined) ? row.share : defaultShare;
        // 서폿 모드: 카드 우측 위에 초록 + 표시
        const supportMark = isSupport
            ? `<span class="precision-summary-support" title="서폿 기준" aria-label="서폿 기준">✚</span>`
            : "";
        // 사람들이 먼저 보는 건 DPS이므로 DPS를 크게, 피해량은 아래 알약으로 (라벨과 지분은 한 줄)
        return `
            <div class="precision-summary-card ${cardCls}">
                ${supportMark}
                <div class="precision-summary-head">
                    <span class="precision-summary-label ${labelCls}">${labels[key]}</span>
                    <span class="precision-summary-share">${fmtShare(shareVal)}%</span>
                </div>
                <div class="precision-summary-dps-line">
                    <span class="precision-summary-dpscap ${labelCls}">${dpsLabel}</span>
                    <span class="precision-summary-dps-main">${dps}</span><span class="precision-summary-unit">억</span>
                </div>
                <div class="precision-summary-dmg-pill ${dpsCls}">피해량 ${fmt(dmg)}억</div>
            </div>
        `;
    };

    return `
        <div class="precision-summary-cards">
            ${makeCard("tank", "precision-label-tank", "precision-card-tank", "precision-dps-tank", shares.tank, rowTank)}
            ${makeCard("one", "precision-label-one", "precision-card-one", "precision-dps-one", shares.one, rowOne)}
            ${makeCard("blood", "precision-label-blood", "precision-card-blood", "precision-dps-blood", shares.blood, rowBlood)}
        </div>
    `;
}

// [분리] extreme.js 로 옮긴 이벤트 바인딩을 원래 실행 위치에서 호출
initJongmakEsEvents();


/* =============================================
   메인 테이블 렌더링
   ============================================= */
export function renderTable() {
    // 종막 에스더 입력 팝업은 종막 화면에서만 보이도록 (다른 화면으로 가면 숨김, 돌아오면 다시 표시)
    const _jmEs = document.getElementById("jmEsPopup");
    if (_jmEs && !(currentMenu === "extreme" && currentExtremeRaid === "jongmak")) { _jmEs.style.display = "none"; setJongmakEsScrollLock(false); }
    updateTimeDisplay();
    const totalSec = getTotalSeconds();

    const isSimpleQuickView =
    currentMenu === "simple" &&
    currentSimpleLevel !== "egir-ex" &&
    currentSimpleLevel !== "abr-ex";

const isRaidSimpleQuickView = currentMenu === "raid-simple";
const isMobilePrecisionView = currentMenu === "serka" || currentMenu === "cathedral" || currentMenu === "belgardin" || currentMenu === "guardian" || currentMenu === "extreme";
document.body.classList.toggle("mobile-precision-view", isMobilePrecisionView);


    // [개정판] 간편보기일 때 빈 공간(.content-grid)과 우측 컬럼(.right-column)까지 통째로 숨기기
    const contentGrid = document.querySelector(".content-grid");
    const rightCol = document.querySelector(".right-column");
    if (currentMenu === "simple" || currentMenu === "raid-simple") {
        if (contentGrid) contentGrid.style.setProperty("display", "none", "important");
        if (rightCol) rightCol.style.setProperty("display", "none", "important");
    } else {
        if (contentGrid) contentGrid.style.display = ""; // 정밀계산일 때는 원래대로 노출
        if (rightCol) rightCol.style.display = "";
    
    }



    const shouldHideTopline =
    isSimpleQuickView ||
    isRaidSimpleQuickView ||
    currentMenu === "guardian" ||
    currentMenu === "serka" ||
    currentMenu === "cathedral" ||
    currentMenu === "belgardin" ||
    currentMenu === "extreme" ||
    currentMenu === "arc-grid";

const tabsEl = document.getElementById("tabs");
if (tabsEl) {
    tabsEl.style.display = currentMenu === "arc-grid" ? "none" : "";
}

    const topline = document.querySelector(".topline");
    if (topline) {
        topline.style.display = shouldHideTopline ? "none" : "";
    }

    const mainEl = document.querySelector(".main");

    if (mainEl) {
       mainEl.classList.toggle("simple-quick-mode", isSimpleQuickView || isRaidSimpleQuickView);
    }

   if (isSimpleQuickView || isRaidSimpleQuickView) {
        document.getElementById("contentTitle").textContent = "";
        document.getElementById("tableTitle").textContent = "";
        document.getElementById("titleMeta").innerHTML = "";
    }

    // EX 제목 특수 처리
    if (currentMenu === "simple" && currentSimpleLevel === "egir-ex") {
        document.getElementById("contentTitle").innerHTML =
            '<span style="background:linear-gradient(90deg,#ff6b6b 0%,#ffd700 15%,#fffacd 30%,#6bcb77 45%,#ffd700 60%,#fffacd 75%,#ff9ff3 90%,#ffd700 100%);background-size:250% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:textShimmer 2s linear infinite;filter:drop-shadow(0 0 7px rgba(255,215,0,0.85));">에기르 EX 레이드</span>';
    } else if (currentMenu === "simple" && currentSimpleLevel === "abr-ex") {
        document.getElementById("contentTitle").innerHTML =
            '<span style="background:linear-gradient(90deg,#FFD60A 0%,#7E57C2 25%,#FFD60A 50%,#7E57C2 75%,#FFD60A 100%);background-size:250% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:textShimmer 2s linear infinite;filter:drop-shadow(0 0 7px rgba(255,214,10,0.85));">아브렐슈드 EX 레이드</span>';
    } else if (!isSimpleQuickView) {
        document.getElementById("contentTitle").textContent = getContentName();
    }

    document.getElementById("tableTitle").textContent = getTableTitle();
    renderTitleMeta();
    document.getElementById("infoHint").innerHTML = getInfoHintText();

    if (currentMenu === "extreme") {
        setClearTimeDisabled(false);
        disableSimpleAdSlot();
        enablePrecisionAdSlot();
        renderExtremeSection(totalSec);
        updatePartyDpsDisplay();
        return;
    }

if (currentMenu === "arc-grid") {
    setClearTimeDisabled(true);
    document.getElementById("partyDpsDisplay").innerHTML = '파티 DPS : <span class="party-dps-value">-</span>';

    document.getElementById("contentTitle").textContent = "";
    document.getElementById("tableTitle").textContent = "";
    document.getElementById("titleMeta").innerHTML = "";

    if (typeof ArcGrid !== "undefined") {
        ArcGrid.init(document.getElementById("mainContent"));
    }

    return;
}


if (currentMenu === "simple" || currentMenu === "raid-simple") {
    setClearTimeDisabled(true);
    document.getElementById("partyDpsDisplay").innerHTML = '파티 DPS : <span class="party-dps-value">-</span>';

    // 정밀계산에서 쓰던 mainContent 광고 슬롯(동일 ID)이 남아 있으면
    // 간편보기 쪽 display()가 숨겨진 쪽을 잡는 문제가 생기므로 비움
    const mainContent = document.getElementById("mainContent");
    if (mainContent) mainContent.innerHTML = "";

    enableSimpleAdSlot();

    if (currentMenu === "raid-simple") {
        renderRaidSimpleView();
    } else {
        renderSimpleView();
    }
    return;
}



        setClearTimeDisabled(false);
    disableSimpleAdSlot();
    enablePrecisionAdSlot();

    // === 가디언 토벌 ===
    if (currentMenu === "guardian") {
        document.getElementById("contentTitle").textContent = "";
        document.getElementById("tableTitle").textContent = "";
        document.getElementById("titleMeta").innerHTML = "";

        const tier = currentGuardianTier;
        const boss = getCurrentGuardianBoss();
        const bossInfo = gatoMeta[boss];
        const isAvail = isGuardianBossAvailable(tier, boss);
        const bossList = getGuardianBossListByTier(tier);
        const availList = getGuardianAvailListByTier(tier);

              if (!isAvail) {
           


setMainContentWithAdPreservation(
    makeGuardianHero(tier, boss, bossInfo),
    makeGuardianMiniHero(tier, boss, bossInfo),
    `
    ${makeGuardianControl(tier, boss, bossList, availList, bossInfo)}

    <div class="precision-section-divider"><span>가디언 토벌 딜지분 상세보기</span></div>
    ${makeRoleToggleHtml()}

    <div class="coming-soon"><h3>${boss} 준비중</h3><p>해당 보스의 가디언 토벌 데이터는 순차적으로 공개됩니다.</p></div>
    `
);
     
        } else {
           


            const rows = getGuardianParsedRows(tier, boss);
            const isSupportGuardian = currentRoleMode === "support";
            const guardianShares = getPrecisionShares("guardian");

            const getDmg = (r) => r.damage || 0;
            const findRow = (share) => rows.find(r => r.share === share && getDmg(r) > 0);

            let row30, row33, row40, effectiveGetDmg, guardianConv;

            if (isSupportGuardian) {
                guardianConv = computeSupportConversion(rows, guardianShares, getDmg);
                row30 = guardianConv.anchors.gangjo;
                row33 = guardianConv.anchors.ilinbun;
                row40 = guardianConv.anchors.janjo;
                effectiveGetDmg = (r) => r.damage;
            } else {
                row30 = findRow(30);
                row33 = findRow(33);
                row40 = findRow(40);
                effectiveGetDmg = getDmg;
            }

            let tableRowsHtml;
            if (isSupportGuardian) {
                const gRows = guardianConv.rows;
                tableRowsHtml = gRows.length
                    ? gRows.map(r => {
                        let cls = "";
                        if (r.label === "gangjo") cls = "row-30";
                        if (r.label === "ilinbun") cls = "row-33";
                        if (r.label === "janjo") cls = "row-40";
                        return `<tr class="${cls}">${renderSupportShareCell(r)}<td><span class="damage-wrap"><span class="damage-num">${fmt(r.damage)}</span><span class="damage-unit">억</span></span></td><td class="dps-cell"><span class="dps-pill">${floorTo1(r.damage / totalSec).toFixed(1)}억</span></td></tr>`;
                    }).join("")
                    : '<tr><td colspan="3">데이터 없음</td></tr>';
            } else {
                tableRowsHtml = rows.length
                    ? rows.map(r => {
                        let cls = "";
                        if (r.share === 30) cls = "row-30";
                        if (r.share === 33) cls = "row-33";
                        if (r.share === 40) cls = "row-40";
                        return `<tr class="${cls}">${renderShareCell(r.share, "guardian")}<td><span class="damage-wrap"><span class="damage-num">${fmt(r.damage)}</span><span class="damage-unit">억</span></span></td><td class="dps-cell"><span class="dps-pill">${floorTo1(r.damage / totalSec).toFixed(1)}억</span></td></tr>`;
                    }).join("")
                    : '<tr><td colspan="3">데이터 없음</td></tr>';
            }

               setMainContentWithAdPreservation(
    makeGuardianHero(tier, boss, bossInfo),
    makeGuardianMiniHero(tier, boss, bossInfo),
    `
    ${makeGuardianControl(tier, boss, bossList, availList, bossInfo)}                               


    <div class="precision-section-divider"><span>가디언 토벌 딜지분 상세보기</span></div>

    ${makeRoleToggleHtml()}
    ${makePrecisionSummary(row30, row33, row40, effectiveGetDmg, totalSec, "guardian", isSupportGuardian)}
                

    <div class="precision-table-panel">
        <div class="precision-table-head">
            <div class="precision-table-title">${boss} (${tier}) 상세 딜지분</div>
            <div class="precision-table-badge" id="precisionTimeBadge">전분시간 : ${String(Math.floor(totalSec / 60)).padStart(2, "0")}분 ${String(totalSec % 60).padStart(2, "0")}초</div>
        </div>
        <div class="table-wrap">
            <table id="dataTable">
                <thead>
                    <tr>${isSupportGuardian
                        ? "<th>조력지분</th><th>조력피해/억</th><th>조력 DPS</th>"
                        : "<th>딜지분</th><th>피해/억</th><th>DPS</th>"}</tr>
                </thead>
                <tbody>${tableRowsHtml}</tbody>
            </table>
        </div>
    </div>
    `
);
            }


        // 레벨 체크 이벤트
        document.querySelectorAll(".guardian-tier-chip[data-tier]").forEach(el => {
            el.addEventListener("click", () => {
                currentGuardianTier = el.dataset.tier;
                renderTable();
            });
        });

        // 드롭다운 토글
        const trigger = document.querySelector(".guardian-dropdown-trigger");
        const list = document.querySelector(".guardian-dropdown-list");
        if (trigger && list) {
            trigger.addEventListener("click", () => {
                const isOpen = list.style.display === "block";
                list.style.display = isOpen ? "none" : "block";
                trigger.classList.toggle("open", !isOpen);
            });
        }

        // 보스 선택 이벤트
        document.querySelectorAll(".guardian-dropdown-item[data-boss]").forEach(el => {
            el.addEventListener("click", () => {
                if (el.classList.contains("pending")) return;
                const selectedBoss = el.dataset.boss;
                setCurrentGuardianBoss(selectedBoss);
                renderTable();
            });
        });

  
    const guardianMobileTimeBtn = document.getElementById("guardianMobileTimeBtn");
    if (guardianMobileTimeBtn) {
        guardianMobileTimeBtn.addEventListener("click", openMobileTimeModal);
    }



        bindRoleToggle();
        updatePartyDpsDisplay();
        return;
    }



// === 세르카 / 성당 / 벨가르딘 ===
if (currentMenu === "serka" || currentMenu === "cathedral" || currentMenu === "belgardin") {
    document.getElementById("contentTitle").textContent = "";
    document.getElementById("tableTitle").textContent = "";
    document.getElementById("titleMeta").innerHTML = "";

  

    const meta = raidMeta[currentMenu][currentCombo];
    const dataRows = parsedData[currentMenu]?.[meta.diffKey] || [];
    const raidName = getRaidDisplayName(currentMenu);
    const shares = getPrecisionShares(currentMenu);
    const isSupport = currentRoleMode === "support";

    const getDamage = (row) => meta.gateKey === "gate1" ? row.g1 : row.g2;
    const findRow = (share) => dataRows.find(r => r.share === share && getDamage(r) > 0);

    let rowTank, rowOne, rowBlood, effectiveGetDamage, supportConv;

    if (isSupport) {
        supportConv = computeSupportConversion(dataRows, shares, getDamage);
        rowTank = supportConv.anchors.gangjo;
        rowOne = supportConv.anchors.ilinbun;
        rowBlood = supportConv.anchors.janjo;
        effectiveGetDamage = (row) => row.damage;
    } else {
        rowTank = findRow(shares.tank);
        rowOne = findRow(shares.one);
        rowBlood = findRow(shares.blood);
        effectiveGetDamage = getDamage;
    }

    const bossNames = currentMenu === "serka"
        ? { gate1: "세르카", gate2: "코르부스" }
        : currentMenu === "cathedral"
        ? { gate1: "대주교", gate2: "광신의 인도자" }
        : { gate1: "벨가르딘", gate2: "페투스" };

    const groups = currentMenu === "serka"
        ? [
            { diffKey: "normal", label: "노말", level: "1710", cls: "pd-green" },
            { diffKey: "hard", label: "하드", level: "1730", cls: "pd-gold" },
            { diffKey: "nightmare", label: "나메", level: "1740", cls: "pd-purple" }
        ]
        : currentMenu === "cathedral"
        ? [
            { diffKey: "normal", label: "1단계", level: "1700", cls: "pd-green" },
            { diffKey: "hard", label: "2단계", level: "1720", cls: "pd-gold" },
            { diffKey: "nightmare", label: "3단계", level: "1750", cls: "pd-purple" }
        ]
        : [
            { diffKey: "normal", label: "노말", level: "1750", cls: "pd-green" },
            { diffKey: "hard", label: "하드", level: "1770", cls: "pd-gold" },
            { diffKey: "nightmare", label: "나메", level: "1780", cls: "pd-purple" }
        ];

    const currentDiff = currentCombo.split("_")[0];
    const currentGate = currentCombo.split("_")[1];

  
    let tableRowsHtml;

    if (isSupport) {
        const rows = supportConv.rows;
        tableRowsHtml = rows.length
            ? rows.map(r => {
                let cls = "";
                if (r.label === "gangjo") cls = "row-30";
                if (r.label === "ilinbun") cls = "row-33";
                if (r.label === "janjo") cls = "row-40";
                return `<tr class="${cls}">${renderSupportShareCell(r)}<td><span class="damage-wrap"><span class="damage-num">${fmt(r.damage)}</span><span class="damage-unit">억</span></span></td><td class="dps-cell"><span class="dps-pill">${floorTo1(r.damage / totalSec).toFixed(1)}억</span></td></tr>`;
            }).join("")
            : '<tr><td colspan="3">데이터 없음</td></tr>';
    } else {
        tableRowsHtml = dataRows.length
            ? dataRows.map(r => {
                let cls = "";
                if (r.share === shares.tank) cls = "row-30";
                if (r.share === shares.one) cls = "row-33";
                if (r.share === shares.blood) cls = "row-40";
                const dmg = getDamage(r);
                return `<tr class="${cls}">${renderShareCell(r.share, currentMenu)}<td><span class="damage-wrap"><span class="damage-num">${fmt(dmg)}</span><span class="damage-unit">억</span></span></td><td class="dps-cell"><span class="dps-pill">${floorTo1(dmg / totalSec).toFixed(1)}억</span></td></tr>`;
            }).join("")
            : '<tr><td colspan="3">데이터 없음</td></tr>';
    }
  


setMainContentWithAdPreservation(
    makeRaidPrecisionHero(currentMenu, meta, currentDiff),
    makeRaidMiniHero(currentMenu, meta),
    `

            <div class="precision-layout-split menu-${currentMenu}">


   
 
            <div class="precision-control compact-precision-control">
                <div class="precision-inline-group">
                    <div class="precision-control-label">난이도 선택</div>
                    <div class="precision-diff-inline" id="precisionDiffInline">
                        <div class="precision-switch-thumb precision-diff-thumb ${groups.find(g => g.diffKey === currentDiff).cls}" id="precisionDiffThumb"></div>
                        ${groups.map(g => {
                            const isActive = currentDiff === g.diffKey;
                            return `
                                <div class="precision-diff-chip ${isActive ? `${g.cls} active` : ""}" data-diff="${g.diffKey}">
                                    <span class="precision-diff-chip-main">${g.label}</span>
                                    <span class="precision-diff-chip-sub">${g.level}</span>
                                </div>
                            `;
                        }).join("")}
                    </div>
                </div>

                <div class="precision-inline-group">
                    <div class="precision-control-label">관문 선택</div>
                    <div class="precision-gate-inline" id="precisionGateInline">
                        <div class="precision-switch-thumb precision-gate-thumb" id="precisionGateThumb"></div>
                        <div class="precision-gate-chip ${currentGate === "gate1" ? "active" : ""}" data-gate="gate1">
                            <div class="precision-gate-chip-content">
                                <div class="precision-gate-chip-line">
                                    <span class="precision-gate-chip-gate">1관</span>
                                    <span class="precision-gate-chip-boss">${bossNames.gate1}</span>
                                </div>
                                <div class="precision-gate-chip-badges">
                                    ${makeBadge(raidMeta[currentMenu][`${currentDiff}_gate1`].type.text, raidMeta[currentMenu][`${currentDiff}_gate1`].type.cls)}
                                    ${makeBadge(raidMeta[currentMenu][`${currentDiff}_gate1`].attr.text, raidMeta[currentMenu][`${currentDiff}_gate1`].attr.cls)}
                                </div>
                            </div>
                        </div>

                        <div class="precision-gate-chip ${currentGate === "gate2" ? "active" : ""}" data-gate="gate2">
                            <div class="precision-gate-chip-content">
                                <div class="precision-gate-chip-line">
                                    <span class="precision-gate-chip-gate">2관</span>
                                    <span class="precision-gate-chip-boss">${bossNames.gate2}</span>
                                </div>
                                <div class="precision-gate-chip-badges">
                                    ${makeBadge(raidMeta[currentMenu][`${currentDiff}_gate2`].type.text, raidMeta[currentMenu][`${currentDiff}_gate2`].type.cls)}
                                    ${makeBadge(raidMeta[currentMenu][`${currentDiff}_gate2`].attr.text, raidMeta[currentMenu][`${currentDiff}_gate2`].attr.cls)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                ${makeMobilePrecisionTools(currentMenu, currentDiff + "_" + meta.gateKey)}
            </div>

            <div class="precision-reward-standalone">
                ${makeRewardWidget(currentMenu, currentDiff + "_" + meta.gateKey)}
            </div>
        </div>


              ${buildSummaryAndDetailHtml(currentMenu, meta.gateKey, raidName, meta, tableRowsHtml, totalSec, rowTank, rowOne, rowBlood, effectiveGetDamage, isSupport)}
    `);



    // 난이도 선택
    document.querySelectorAll(".precision-diff-chip[data-diff]").forEach(el => {
        el.addEventListener("click", () => {
            const gate = currentCombo.split("_")[1];
            currentCombo = `${el.dataset.diff}_${gate}`;
            renderTable();
        });
    });

    // 관문 선택
    document.querySelectorAll(".precision-gate-chip[data-gate]").forEach(el => {
        el.addEventListener("click", () => {
            const diff = currentCombo.split("_")[0];
            currentCombo = `${diff}_${el.dataset.gate}`;
            if (currentMenu === "belgardin") {
                setBaseTimeByMenu(currentMenu, el.dataset.gate);
            }
            renderTable();
        });
    });

    bindRewardMoreToggle(currentMenu);

document.querySelectorAll(".detail-tab[data-detail-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
        const menu = btn.dataset.detailMenu || currentMenu;
        detailTabState[menu] = btn.dataset.detailTab;
        renderTable();
    });
});


    const mobileTimeBtn = document.getElementById(`openMobileTimeBtn_${currentMenu}`);
    const mobileRewardToggleBtn = document.getElementById(`mobileRewardToggle_${currentMenu}`);
    const mobileRewardBox = document.getElementById(`mobileRewardBox_${currentMenu}`);

    if (mobileTimeBtn) {
        mobileTimeBtn.addEventListener("click", openMobileTimeModal);
    }

    if (mobileRewardToggleBtn && mobileRewardBox) {
        mobileRewardToggleBtn.addEventListener("click", () => {
            const isOpen = mobileRewardBox.classList.toggle("open");
            mobileRewardToggleBtn.textContent = isOpen
                ? "📦 클리어 보상 닫기"
                : "📦 클리어 보상 확대하기";
        });
    }

    const mobileRewardMoreBtn = document.getElementById(`mobileRewardMoreBtn_${currentMenu}`);
    const mobileRewardMoreContent = document.getElementById(`mobileRewardMore_${currentMenu}`);

  
    if (mobileRewardMoreBtn && mobileRewardMoreContent) {
        mobileRewardMoreBtn.addEventListener("click", () => {
            const isOpen = mobileRewardMoreContent.classList.toggle("rw-open");
            mobileRewardMoreBtn.textContent = isOpen ? "더보기 보상 닫기 ▲" : "더보기 보상 열기 ▼";
        });
    }


    bindRaidBattleItemIcons();
    bindRoleToggle();
    updatePartyDpsDisplay();
    positionPrecisionSwitchThumbs();
    return;
}

}

/* =============================================
   난이도/관문 슬라이딩 스위치 썸(thumb) 위치 계산
   ============================================= */
function positionPrecisionSwitchThumb(trackId, thumbId) {
    const track = document.getElementById(trackId);
    const thumb = document.getElementById(thumbId);
    if (!track || !thumb) return;

    const activeBtn = track.querySelector(".active");
    if (!activeBtn) return;

    const trackRect = track.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    thumb.style.transform = `translateX(${Math.round(btnRect.left - trackRect.left - 6)}px)`;
    thumb.style.width = `${Math.ceil(btnRect.width)}px`;
}

export function positionPrecisionSwitchThumbs() {
    positionPrecisionSwitchThumb("precisionDiffInline", "precisionDiffThumb");
    positionPrecisionSwitchThumb("precisionGateInline", "precisionGateThumb");
}

window.addEventListener("resize", () => {
    positionPrecisionSwitchThumbs();
});


/* =============================================
   CSV 로드
   ============================================= */
async function loadCSV() {
    const statusEl = document.getElementById("status");
    const CACHE_KEY = "loa_dps_csv_cache_v1";

    try {
        const cachedCsv = localStorage.getItem(CACHE_KEY);
        if (cachedCsv) {
            const cachedLines = cachedCsv.split(/\r?\n/);

            clearAllData();
            parseCathedral(cachedLines);
            parseSerka(cachedLines);
            parseBelgardin(cachedLines);
            parseGato1730(cachedLines);
            parseGato1750(cachedLines);
            parseGato1770(cachedLines);

            if (currentMenu !== "simple" && currentMenu !== "raid-simple") {
                renderTabs();
                renderTable();
            }
        }

        const resp = await fetch(CSV_URL);
        const csvText = await resp.text();
        const lines = csvText.split(/\r?\n/);

        localStorage.setItem(CACHE_KEY, csvText);

        clearAllData();
        parseCathedral(lines);
        parseSerka(lines);
        parseBelgardin(lines);
        parseGato1730(lines);
        parseGato1750(lines);
        parseGato1770(lines);

        if (currentMenu !== "simple" && currentMenu !== "raid-simple") {
            renderTabs();
            renderTable();

            if (statusEl) {
                statusEl.textContent = "연동 완료";
                statusEl.style.display = "block";
                setTimeout(() => { statusEl.style.display = "none"; }, 2000);
            }
        } else {
            if (statusEl) {
                statusEl.style.display = "none";
            }
        }
    } catch (err) {
        console.error(err);
        if (statusEl) {
            statusEl.style.display = "none";
        }
    }
}

/* =============================================
   경매 계산기
   ============================================= */
function acFmt(v) {
    return Math.round(v).toLocaleString("ko-KR");
}

function calcBreakeven(price, members) {
    return 0.95 * price * (members - 1) / members;
}

function calcRecommend(breakeven, margin) {
    return breakeven / (1 + margin);
}

function acUpdate() {
    const acPriceEl = document.getElementById("ac-price");
    if (!acPriceEl) return;

    const raw = (acPriceEl.value || "").replace(/,/g, "");
    const price = parseInt(raw) || 0;

    if (!price) {
        document.getElementById("ac-be").textContent = "-";
        document.getElementById("ac-be-desc").textContent = "거래소 가격을 입력하세요";
        [5, 10].forEach(pct => {
            document.getElementById(`ac-v${pct}`).textContent = "-";
            document.getElementById(`ac-d${pct}`).textContent = "가격 입력 시 표시";
            document.getElementById(`ac-bar${pct}`).style.width = "0%";
        });
        return;
    }

    const be = calcBreakeven(price, acMembers);
    document.getElementById("ac-be").textContent = acFmt(be);
    document.getElementById("ac-be-desc").textContent = "이 금액 이하로 입찰하면 이득";

    const r5 = calcRecommend(be, 0.05);
    const r10 = calcRecommend(be, 0.1);

    document.getElementById("ac-v5").textContent = acFmt(r5);
    document.getElementById("ac-d5").textContent = `${acFmt(r5)} 입찰 시 ${acFmt(be - r5)} 이득`;
    document.getElementById("ac-bar5").style.width = "60%";

    document.getElementById("ac-v10").textContent = acFmt(r10);
    document.getElementById("ac-d10").textContent = `${acFmt(r10)} 입찰 시 ${acFmt(be - r10)} 이득`;
    document.getElementById("ac-bar10").style.width = "100%";
}

/* =============================================
   가이드 모달
   ============================================= */
const guideModal = document.getElementById("guideModal");
const openGuideBtn = document.getElementById("openGuideBtn");
const closeGuideBtn = document.getElementById("closeGuideBtn");

function openGuideModal() {
    if (!guideModal) return;
    guideModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeGuideModal() {
    if (!guideModal) return;
    guideModal.classList.remove("show");
    document.body.style.overflow = "";
}

/* =============================================
   INFO
   ============================================= */
function getInfoHintText() {
if (currentMenu === "raid-simple") {
    return "레이드 기준으로 난이도별 강투 / 1인분 / 잔혈 컷을 비교할 수 있습니다.";
}
   
if (currentMenu === "simple") {
    if (currentSimpleLevel === "egir-ex" || currentSimpleLevel === "abr-ex") {
        return "에스더가 포함된 추정 기준표입니다. 실전 오차가 있을 수 있습니다.";
    }
    return "해당 레벨에서 골드 획득 우선순위 3개를 먼저 보여주고, 나머지 입장 가능 레이드는 아래에서 펼쳐 볼 수 있습니다.";
}


    if (currentMenu === "serka" || currentMenu === "cathedral") {
        return "클리어 타임을 입력하면 피해량과 DPS가 실시간으로 반영됩니다.";
    }

    if (currentMenu === "belgardin") {
        return "벨가르딘은 8인 레이드로 강투 15% · 1인분 16.6% · 잔혈 20% 기준입니다. 클리어 타임을 입력하면 실시간 반영됩니다.";
    }

    if (currentMenu === "guardian") {
        return "레벨과 보스를 선택하면 해당 가디언의 딜지분과 DPS를 확인할 수 있습니다.";
    }

    return "구글 시트 데이터를 읽어 옵니다.";
}

// 사이드바 메뉴
document.querySelectorAll(".menu-item").forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.classList.contains("disabled")) return;

        const menu = btn.dataset.menu;
        if (!menu) return;

        document.body.classList.remove("arc-grid-mode");

        document.querySelectorAll(".menu-item").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        if (menu === "simple") {
            currentMenu = "simple";
            currentSimpleLevel = "1750";
        }
        else if (menu === "raid-simple") {
            currentMenu = "raid-simple";
            currentSimpleRaid = "cathedral";
        }
        else if (menu === "egir-ex") {
            currentMenu = "simple";
            currentSimpleLevel = "egir-ex";
        }
        else if (menu === "abr-ex") {
            currentMenu = "simple";
            currentSimpleLevel = "abr-ex";
        }
        else if (menu === "serka") {
            currentMenu = "serka";
            currentCombo = "nightmare_gate1";
        }
        else if (menu === "cathedral") {
            currentMenu = "cathedral";
            currentCombo = "nightmare_gate1";
        }
        else if (menu === "belgardin") {
            currentMenu = "belgardin";
            currentCombo = "nightmare_gate1";
        }
        else if (menu === "guardian") {
            currentMenu = "guardian";
            currentGuardianTier = "1770";
            currentGatoBoss = "루멘칼리고";
            currentGato1750Boss = "루멘칼리고";
            currentGato1770Boss = "루멘칼리고";
        }
        else if (menu === "arc-grid") {
            currentMenu = "arc-grid";
            document.body.classList.add("arc-grid-mode");
        }

        setBaseTimeByMenu(currentMenu);
        renderTabs();
        renderTable();
       updateCanonicalAndUrl(currentMenu);

if (menu === "arc-grid") {
    window.scrollTo({ top: 0, behavior: "auto" });
}

        if (isMobileViewport() && btn.classList.contains("mobile-launch-btn")) {
            enterMobileContentMode();
            window.scrollTo({ top: 0, behavior: "auto" });
        }
    });
});

// 시간 스텝 버튼
document.querySelectorAll(".time-step-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        changeTimeValue(btn.dataset.stepTarget, parseInt(btn.dataset.step, 10));
    });
});

// 시간 입력
document.getElementById("minutes").addEventListener("input", () => {
    if (currentMenu !== "simple") renderTable();
});

document.getElementById("seconds").addEventListener("input", () => {
    if (currentMenu !== "simple") renderTable();
});

// 가이드 모달
if (openGuideBtn) {
    openGuideBtn.addEventListener("click", () => {
        openGuideModal();
    });
}

if (closeGuideBtn) {
    closeGuideBtn.addEventListener("click", closeGuideModal);
}

if (guideModal) {
    guideModal.addEventListener("click", e => {
        if (e.target === guideModal) closeGuideModal();
    });
}

document.addEventListener("keydown", e => {
    if (e.key === "Escape" && guideModal && guideModal.classList.contains("show")) {
        closeGuideModal();
    }
});

/* =============================================
   모바일 홈 / 콘텐츠 전환
   ============================================= */
const mobileGuideBtn = document.getElementById("mobileGuideBtn");
const mobileBackBtn = document.getElementById("mobileBackBtn");

function isMobileViewport() {
    return window.innerWidth <= 768;
}

function enterMobileHomeMode() {
    if (!isMobileViewport()) return;
    document.body.classList.add("mobile-home-mode");
    document.body.classList.remove("mobile-content-mode");
}

function enterMobileContentMode() {
    if (!isMobileViewport()) return;
    document.body.classList.add("mobile-content-mode");
    document.body.classList.remove("mobile-home-mode");
}

function syncMobileShellMode() {
    if (isMobileViewport()) {
        if (
            !document.body.classList.contains("mobile-home-mode") &&
            !document.body.classList.contains("mobile-content-mode")
        ) {
            document.body.classList.add("mobile-home-mode");
        }
    } else {
        document.body.classList.remove("mobile-home-mode", "mobile-content-mode");
    }
}

if (mobileGuideBtn) {
    mobileGuideBtn.addEventListener("click", openGuideModal);
}

if (mobileBackBtn) {
    mobileBackBtn.addEventListener("click", () => {
        enterMobileHomeMode();
        window.scrollTo({ top: 0, behavior: "auto" });
    });
}

window.addEventListener("resize", syncMobileShellMode);
syncMobileShellMode();

/* =============================================
   모바일 클리어 타임 팝업
   ============================================= */
const mobileTimeModal = document.getElementById("mobileTimeModal");
const closeMobileTimeModalBtn = document.getElementById("closeMobileTimeModal");
const applyMobileTimeBtn = document.getElementById("applyMobileTimeBtn");
const mobileTimeMinutes = document.getElementById("mobileTimeMinutes");
const mobileTimeSeconds = document.getElementById("mobileTimeSeconds");
const mobileTimePreview = document.getElementById("mobileTimePreview");

function updateMobileTimePreview() {
    let m = parseInt(mobileTimeMinutes.value || 0, 10);
    let s = parseInt(mobileTimeSeconds.value || 0, 10);

    if (isNaN(m) || m < 0) m = 0;
    if (isNaN(s) || s < 0) s = 0;
    if (s > 59) s = 59;

    mobileTimeMinutes.value = m;
    mobileTimeSeconds.value = s;
    mobileTimePreview.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function openMobileTimeModal() {
    if (!mobileTimeModal) return;

    const mainMinutes = document.getElementById("minutes");
    const mainSeconds = document.getElementById("seconds");

    mobileTimeMinutes.value = mainMinutes ? mainMinutes.value || 0 : 0;
    mobileTimeSeconds.value = mainSeconds ? mainSeconds.value || 0 : 0;
    updateMobileTimePreview();

    mobileTimeModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeMobileTimeModal() {
    if (!mobileTimeModal) return;
    mobileTimeModal.classList.remove("show");
    document.body.style.overflow = "";
}

if (mobileTimeMinutes) {
    mobileTimeMinutes.addEventListener("input", updateMobileTimePreview);
}

if (mobileTimeSeconds) {
    mobileTimeSeconds.addEventListener("input", updateMobileTimePreview);
}

if (closeMobileTimeModalBtn) {
    closeMobileTimeModalBtn.addEventListener("click", closeMobileTimeModal);
}

if (applyMobileTimeBtn) {
    applyMobileTimeBtn.addEventListener("click", () => {
        const mainMinutes = document.getElementById("minutes");
        const mainSeconds = document.getElementById("seconds");

        if (mainMinutes) mainMinutes.value = mobileTimeMinutes.value;
        if (mainSeconds) mainSeconds.value = mobileTimeSeconds.value;

        closeMobileTimeModal();
        renderTable();
    });
}

if (mobileTimeModal) {
    mobileTimeModal.addEventListener("click", e => {
        if (e.target === mobileTimeModal) closeMobileTimeModal();
    });
}

// 경매 계산기 토글
document.querySelectorAll(".ac-toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".ac-toggle-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        acMembers = parseInt(btn.dataset.m);
        acUpdate();
    });
});

// 경매 계산기 입력
const acPriceInput = document.getElementById("ac-price");
if (acPriceInput) {
    acPriceInput.addEventListener("input", e => {
        let val = e.target.value.replace(/,/g, "").replace(/[^0-9]/g, "");
        e.target.value = val ? Number(val).toLocaleString("ko-KR") : "";
        acUpdate();
    });
}

/* =============================================
   패치노트 미니 팝업
   ============================================= */
const patchModal = document.getElementById("patchModal");
const closePatchModalBtn = document.getElementById("closePatchModal");
const patchModalDate = document.getElementById("patchModalDate");
const patchModalTitle = document.getElementById("patchModalTitle");
const patchModalDesc = document.getElementById("patchModalDesc");
const patchModalBody = document.getElementById("patchModalBody");

function openPatchModal(data) {
    if (!patchModal) return;

    patchModalDate.textContent = data.date || "";
    patchModalTitle.textContent = data.title || "";
    patchModalDesc.textContent = data.desc || "";
    patchModalBody.innerHTML = data.body || "";

    patchModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closePatchModal() {
    if (!patchModal) return;
    patchModal.classList.remove("show");
    document.body.style.overflow = "";
}

document.querySelectorAll(".patch-item[data-patch-title]").forEach(item => {
    item.addEventListener("click", () => {
        openPatchModal({
            date: item.dataset.patchDate,
            title: item.dataset.patchTitle,
            desc: item.dataset.patchDesc,
            body: item.dataset.patchBody
        });
    });
});

if (closePatchModalBtn) {
    closePatchModalBtn.addEventListener("click", closePatchModal);
}

if (patchModal) {
    patchModal.addEventListener("click", e => {
        if (e.target === patchModal) closePatchModal();
    });
}

document.addEventListener("keydown", e => {
    if (e.key === "Escape" && patchModal && patchModal.classList.contains("show")) {
        closePatchModal();
    }
});

/* =============================================
   초기화 실행
   ============================================= */
setBaseTimeByMenu("simple");
applyMenuFromQuery();
updateCanonicalAndUrl(currentMenu);

if (currentMenu === "simple" || currentMenu === "raid-simple") {
    renderTabs();
    renderTable();
}


/* =============================================
   서폿 툴팁 - 최초 원본 복구 및 오작동 완벽 해결 버전
   ============================================= */
let sharedRoleTooltipEl = null;

function ensureSharedRoleTooltip() {
    if (sharedRoleTooltipEl) return sharedRoleTooltipEl;
    const el = document.createElement("div");
    el.className = "role-shared-tooltip";
    el.innerHTML = ROLE_TOOLTIP_HTML;
    document.body.appendChild(el);
    sharedRoleTooltipEl = el;
    return el;
}

function showSharedRoleTooltip(anchorEl) {
    const tip = ensureSharedRoleTooltip();
    tip.classList.add("show");

    const rect = anchorEl.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    const margin = 10;

    let left = rect.left + rect.width / 2 - tipRect.width / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - tipRect.width - margin));

    let top = rect.top - tipRect.height - 12;
    if (top < margin) {
        top = rect.bottom + 12;
    }

    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
}

function hideSharedRoleTooltip() {
    if (sharedRoleTooltipEl) sharedRoleTooltipEl.classList.remove("show");
}

// 1. 마우스 올렸을 때 작동 (최초 원본 로직)
document.addEventListener("mouseover", (e) => {
    const trigger = e.target.closest(".role-info-tip");
    if (trigger) showSharedRoleTooltip(trigger);
});

document.addEventListener("mouseout", (e) => {
    const trigger = e.target.closest(".role-info-tip");
    if (trigger && !trigger.contains(e.relatedTarget)) hideSharedRoleTooltip();
});

document.addEventListener("focusin", (e) => {
    const trigger = e.target.closest(".role-info-tip");
    if (trigger) showSharedRoleTooltip(trigger);
});

document.addEventListener("focusout", (e) => {
    const trigger = e.target.closest(".role-info-tip");
    if (trigger) hideSharedRoleTooltip();
});

// 2. [완벽 해결] 느낌표 클릭 시 부모 버튼이 클릭되는 버그를 캡처링 단계에서 선제 차단
document.addEventListener("click", (e) => {
    const trigger = e.target.closest(".role-info-tip");
    if (trigger) {
        e.preventDefault();
        e.stopPropagation(); // 부모 버튼 클릭 이벤트 발동 원천 봉쇄!

        if (sharedRoleTooltipEl && sharedRoleTooltipEl.classList.contains("show")) {
            hideSharedRoleTooltip();
        } else {
            showSharedRoleTooltip(trigger);
        }
    } else {
        hideSharedRoleTooltip();
    }
}, true); // ← true(캡처링) 옵션이 버튼보다 이벤트를 먼저 가로챕니다.

window.addEventListener("scroll", hideSharedRoleTooltip, true);
window.addEventListener("resize", hideSharedRoleTooltip);

// [분리] extreme.js 로 옮긴 이벤트 바인딩을 원래 실행 위치에서 호출
initMordumTacticTooltip();


/* =============================================
   우측 사이드바 제어 엔진
   ============================================= */

function enableSimpleAdSlot() {
    const quickMove = getQuickMoveEl();
    const gridRight = document.getElementById("simpleGridRight");
    const timeCard = document.getElementById("timeCard");

    if (timeCard) timeCard.style.display = "none";

    const infoHintEl = document.getElementById("infoHint");
    const infoCard = infoHintEl ? infoHintEl.closest(".side-card") : null;
    if (infoCard) infoCard.style.display = "none";

    const precisionAd = document.getElementById("precisionAdSlot");
    if (precisionAd) precisionAd.style.display = "none";

    if (!gridRight) return;

    if (quickMove) {
        gridRight.insertBefore(quickMove, gridRight.firstElementChild || null);
    }

    if (window.getComputedStyle(gridRight).display === "none") {
        return;
    }
}



function disableSimpleAdSlot() {
    const timeCard = document.getElementById("timeCard");
    const quickMove = getQuickMoveEl();
    const aside = document.querySelector(".right-column");

    if (timeCard) timeCard.style.display = "";

    const infoHintEl = document.getElementById("infoHint");
    const infoCard = infoHintEl ? infoHintEl.closest(".side-card") : null;
    if (infoCard) infoCard.style.display = "none";

    if (aside && quickMove) {
        const afterTimeCard = timeCard ? timeCard.nextSibling : (aside.firstElementChild || null);
        aside.insertBefore(quickMove, afterTimeCard);
    }
}





function enablePrecisionAdSlot() {
    const timeCard = document.getElementById("timeCard");
    const aside = document.querySelector(".right-column");
    if (!timeCard || !aside) return;

    // 수직 광고는 이제 사이드 안이 아니라 화면 좌우 고정 레일(common.js의
    // anchor-side-rail)에서 표시하므로, 여기서는 더 이상 삽입하지 않는다.
    // 예전에 삽입했던 사이드 내부 광고 슬롯이 남아있다면 정리한다.
    const oldAdSlot = document.getElementById("precisionAdSlot");
    if (oldAdSlot) oldAdSlot.style.display = "none";
    const oldAdSlot2 = document.getElementById("precisionAdSlot2");
    if (oldAdSlot2) oldAdSlot2.style.display = "none";
}



loadCSV();
acUpdate();
