
import {
    raidMeta,
    MORDUM_EX_DATA,
    MORDUM_BOSS_INFO,
    JONGMAK_EX_LEVELS,
    JONGMAK_EX_GATES,
    JONGMAK_EX_BASE,
    JONGMAK_EX_DATA,
    JONGMAK_BOSS_SEC,
    JONGMAK_BAR3_RATIO,
    JONGMAK_ESTHER_SKILLS,
    JONGMAK_ES_EFFECT,
    jongmakEffPct,
    JONGMAK_ESTHER_GATE_LIST,
    JONGMAK_ESTHER_DEFAULT_USE,
    JONGMAK_ESTHER_MAX_PER_GATE,
    JONGMAK_GATE_LINES,
    JONGMAK_ES_STORE_KEY,
    MORDUM_ESTHER_DIFF_INDEX,
    MORDUM_ESTHER_GROUPS,
    lineCutConfig,
    MORDUM_TIME_SCALE,
    MORDUM_NM_TACTIC
} from "./data.js";
import {
    currentMenu,
    currentCombo,
    currentExtremeRaid,
    detailTabState,
    currentRoleMode,
    setMainContentWithAdPreservation,
    buildSummaryAndDetailHtml,
    makeBadge,
    fmt,
    floorTo1,
    computeSupportConversion,
    renderSupportShareCell,
    makeRoleToggleHtml,
    makeRoleBadgeHtml,
    bindRoleToggle,
    setBaseTimeByMenu,
    renderShareCell,
    buildHeroBattleIconsHtml,
    buildMiniBattleIconsHtml,
    bindRaidBattleItemIcons,
    makeRaidPrecisionHero,
    makeRaidMiniHero,
    renderTable,
    positionPrecisionSwitchThumbs,
    setCurrentExtremeRaid,
    setCurrentCombo
} from "./index.js";


const JONGMAK_GATE_KEYS = ["g1", "g2", "g3", "g4"];
// 2-3 발악(4번째 칸)은 2-3(g3) 스타일을 그대로 쓰고 색만 바꾸기 위해 "g3 g4" 클래스를 같이 붙임
const jmGateCls = (i) => (i === 3 ? "g3 g4" : `g${i + 1}`);

function cloneJongmakEsDefault() {
    const o = {};
    JONGMAK_GATE_KEYS.forEach(k => { o[k] = (JONGMAK_ESTHER_DEFAULT_USE[k] || []).slice(); });
    return o;
}
function loadJongmakEsUse() {
    try {
        const raw = window.localStorage.getItem(JONGMAK_ES_STORE_KEY);
        if (!raw) return null;
        const o = JSON.parse(raw) || {};
        // 발악 칸이 없던 이전 저장값: 2-3 칸에 넣어 둔 히든 아만은 발악 칸으로 옮김
        if (!Array.isArray(o.g4)) {
            const old3 = Array.isArray(o.g3) ? o.g3 : [];
            o.g4 = old3.filter(id => id === "haman3");
            o.g3 = old3.filter(id => id !== "haman3");
        }
        const out = {};
        for (const gk of JONGMAK_GATE_KEYS) {
            const arr = Array.isArray(o[gk]) ? o[gk] : [];
            out[gk] = arr.filter(id => JONGMAK_ESTHER_GATE_LIST[gk].includes(id)).slice(0, JONGMAK_ESTHER_MAX_PER_GATE);
        }
        return out;
    } catch (e) { return null; }
}
function saveJongmakEsUse() {
    try {
        if (isJongmakEstherCustom()) window.localStorage.setItem(JONGMAK_ES_STORE_KEY, JSON.stringify(jongmakEstherUse));
        else window.localStorage.removeItem(JONGMAK_ES_STORE_KEY);   // 기본 구성이면 저장값 삭제
    } catch (e) { /* 저장소를 못 쓰는 환경이면 무시 (이번 접속에서만 유지) */ }
}
let jongmakEstherUse = loadJongmakEsUse() || cloneJongmakEsDefault();

function isJongmakEstherCustom() {
    const norm = (o) => JONGMAK_GATE_KEYS.map(k => (o[k] || []).slice().sort().join(",")).join("|");
    return norm(jongmakEstherUse) !== norm(JONGMAK_ESTHER_DEFAULT_USE);
}

// 발악에서 히든 아만을 쓰면 발악 소요 시간이 50초 -> 25초 (기본 클리어 타임 33:27 -> 33:02)
function isJongmakHiddenUsed() {
    return (jongmakEstherUse.g4 || []).includes("haman3");
}
function getJongmakBossSec() {
    return isJongmakHiddenUsed() ? JONGMAK_BOSS_SEC.hidden : JONGMAK_BOSS_SEC.noHidden;
}
// 현재 에스더 사용 기준 기본 클리어 타임(초)
export function getJongmakDefaultTime() {
    const sec = JONGMAK_EX_GATES.reduce((a, g) => a + (g.key === "g4" ? getJongmakBossSec() : g.sec), 0);
    return { sec, hidden: isJongmakHiddenUsed() };
}
let jongmakLastDefaultSec = getJongmakDefaultTime().sec;

// 사용자가 입력한 에스더 사용을 반영한 구간별 수치 (보스 체력은 고정, 에스더 차감값 / 발악 시간만 변동)
export function getJongmakLive(diffKey) {
    const data = JONGMAK_EX_DATA[diffKey];
    const base = JONGMAK_EX_BASE[diffKey];
    if (!data || !base) return null;
    const gates = data.gates.map(g => {
        const ids = jongmakEstherUse[g.key] || [];
        const pct = Math.round(ids.reduce((a, id) => a + jongmakEffPct(id), 0) * 1000) / 1000;
        const esther = base.hp1 * pct / 100;
        const sec = g.key === "g4" ? getJongmakBossSec() : g.sec;
        const support = base.supportPerSec * sec;
        return Object.assign({}, g, { usage: ids.slice(), estherPct: pct, esther, sec, support, share: Math.max(0, g.hp - esther - support) });
    });
    const totalShareWon = gates.reduce((a, g) => a + g.share, 0);
    return Object.assign({}, data, { gates, totalSec: gates.reduce((a, g) => a + g.sec, 0), effectiveDamage: totalShareWon / 1e8, hiddenUsed: isJongmakHiddenUsed() });
}

// 에스더 1회가 깎는 체력 줄 수 (2-3은 null = 미확인)
function getJongmakEsLines(diffKey, gateKey, pct) {
    const base = JONGMAK_EX_BASE[diffKey];
    if (!base) return null;
    if (gateKey === "g1") return pct / 100 * JONGMAK_GATE_LINES.g1;
    if (gateKey === "g2") return pct / 100 * base.hp1 / base.hp2 * JONGMAK_GATE_LINES.g2;
    return null;
}

function formatEokAbbrev(eok) {
    if (eok >= 10000) return (eok / 10000).toFixed(2) + "조";
    return fmt(Math.round(eok)) + "억";
}

// "약 19.63조" / "약 4,374억" 형태 (보스 정보 패널용)
function formatEokApprox(eok) {
    return "약 " + formatEokAbbrev(eok);
}

function getMordumDiffLabel(diffKey) {
    return diffKey === "normal" ? "노말" : diffKey === "hard" ? "하드" : "나메";
}

// 보스 정보 패널 (왼쪽 그래프: 1페이즈 체력 + 발악쉴드 체력 / 오른쪽 체력 요약)
function makeMordumBossInfoPanel(diffKey) {
    const info = MORDUM_BOSS_INFO[diffKey];
    if (!info) return "";

    const p1Hp = info.totalHp - info.shieldHp;            // 1페이즈 500줄 체력
    const p1Ratio = p1Hp / info.totalHp;
    const p2Ratio = info.shieldHp / info.totalHp;         // 2페이즈 발악쉴드 체력
    const deduct = info.estherTotal + info.supportTotal;  // 에스더 + 서폿 딜값

    // ----- 도넛 그래프 (SVG) -----
    const R = 42;
    const C = 2 * Math.PI * R;
    const GAP = 4;
    const len1 = Math.max(C * p1Ratio - GAP, 0);
    const len2 = Math.max(C * p2Ratio - GAP, 0);

    const donut = `
        <svg class="mbi-donut" viewBox="0 0 110 110" role="img" aria-label="1페이즈 체력 ${(p1Ratio * 100).toFixed(1)}%, 발악 실드 ${(p2Ratio * 100).toFixed(1)}%">
            <defs>
                <linearGradient id="mbiGradP1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#7dd3fc"/>
                    <stop offset="1" stop-color="#2563eb"/>
                </linearGradient>
                <linearGradient id="mbiGradP2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#fef08a"/>
                    <stop offset="1" stop-color="#f59e0b"/>
                </linearGradient>
            </defs>
            <circle cx="55" cy="55" r="51" fill="none" stroke="rgba(148,163,184,.14)" stroke-width="1" stroke-dasharray="2 4"/>
            <circle cx="55" cy="55" r="${R}" fill="none" stroke="#1b2033" stroke-width="12"/>
            <circle class="mbi-arc-p1" cx="55" cy="55" r="${R}" fill="none" stroke="url(#mbiGradP1)" stroke-width="12"
                stroke-dasharray="${len1.toFixed(2)} ${(C - len1).toFixed(2)}" transform="rotate(-90 55 55)"/>
            <circle class="mbi-arc-p2" cx="55" cy="55" r="${R}" fill="none" stroke="url(#mbiGradP2)" stroke-width="12"
                stroke-dasharray="${len2.toFixed(2)} ${(C - len2).toFixed(2)}" stroke-dashoffset="${(-C * p1Ratio).toFixed(2)}" transform="rotate(-90 55 55)"/>
            <text class="mbi-donut-cap" x="55" y="50" text-anchor="middle">총 체력</text>
            <text class="mbi-donut-val" x="55" y="67" text-anchor="middle">${formatEokAbbrev(info.totalHp)}</text>
        </svg>
    `;

    const detailOpen = mordumDetailOpen;

    return `
        <div class="side-card mordum-boss-info-card mbi-card">
            <div class="side-label">모르둠 EX - ${getMordumDiffLabel(diffKey)} 보스정보</div>
            <div class="mbi-body">
                <div class="mbi-chart">${donut}</div>
                <div class="mbi-legend">
                    <div class="mbi-legend-item p1">
                        <span class="mbi-legend-name"><i class="mbi-dot p1"></i>1페이즈</span>
                        <b>${(p1Ratio * 100).toFixed(1)}%</b>
                    </div>
                    <div class="mbi-legend-item p2">
                        <span class="mbi-legend-name"><i class="mbi-dot p2"></i>발악 실드</span>
                        <b>${(p2Ratio * 100).toFixed(1)}%</b>
                        <span class="mbi-legend-note">1페이즈 대비 ${(info.shieldHp / p1Hp * 100).toFixed(2)}%</span>
                    </div>
                </div>
            </div>

            <button class="mbi-more-btn" id="mordumDetailBtn" type="button">${detailOpen ? "모르둠 상세보기 ▲" : "모르둠 상세보기 ▼"}</button>

            <div class="mbi-more-content ${detailOpen ? "mbi-open" : ""}" id="mordumDetailContent">
                <div class="mbi-lines">
                    <div class="mbi-row mbi-total">
                        <span class="mbi-label">보스 총 체력 :</span>
                        <b>${formatEokApprox(info.totalHp)}</b>
                    </div>
                    <div class="mbi-row mbi-sub p1">
                        <span class="mbi-label"><span class="mbi-branch">ㄴ</span>1페이즈 500줄 체력 :</span>
                        <b>${formatEokApprox(p1Hp)}</b>
                    </div>
                    <div class="mbi-row mbi-sub p2">
                        <span class="mbi-label"><span class="mbi-branch">ㄴ</span>2페이즈 발악 실드 :</span>
                        <b>${formatEokApprox(info.shieldHp)}</b>
                    </div>
                    <div class="mbi-row mbi-sub mbi-deduct">
                        <span class="mbi-label"><span class="mbi-branch">ㄴ</span>에스더 및 변수 차감값 :</span>
                        <b>${formatEokApprox(deduct)}</b>
                    </div>
                </div>

                ${makeMordumEstherList(diffKey)}
            </div>
        </div>
    `;
}

// 에스더별 딜량 (샨디 / 바훈 / 바스티안 그룹별, 카드 폭에 맞춘 세로 태그 목록)
function makeMordumEstherList(diffKey) {
    const idx = MORDUM_ESTHER_DIFF_INDEX[diffKey];
    if (idx === undefined) return "";

    const groupsHtml = MORDUM_ESTHER_GROUPS.map(g => {
        const tags = g.skills.map(sk => {
            const eok = Math.round(sk.dmg[idx] / 1e8);
            const pips = Array.from({ length: sk.cells }, () => "<i></i>").join("");

            // "바훈 1칸 (무력 추뎀)" -> 이름 / 보조 문구로 분리
            const m = sk.name.match(/^(.*?)\s*\((.+)\)$/);
            const mainName = m ? m[1] : sk.name;
            const note = m ? m[2] : "";

            return `
                <div class="mordum-esther-tag" style="--tone:${sk.tone}" title="1페이즈 체력의 ${sk.pct.toFixed(2)}%">
                    <span class="me-pips">${pips}</span>
                    <span class="me-namebox">
                        <span class="me-name">${mainName}</span>
                        ${note ? `<span class="me-note">${note}</span>` : ""}
                    </span>
                    <span class="me-dmg">약 ${fmt(eok)}억</span>
                    <span class="me-line">${sk.lines.toFixed(2)}줄</span>
                </div>
            `;
        }).join("");

        return `
            <div class="mordum-esther-group" style="--tone:${g.tone}">
                <div class="mordum-esther-group-name"><span class="me-sym">${g.symbol}</span>${g.name}</div>
                <div class="mordum-esther-tags">${tags}</div>
            </div>
        `;
    }).join("");

    return `
        <div class="mordum-esther-list">
            <div class="mordum-esther-title">${getMordumDiffLabel(diffKey)} 에스더 딜량</div>
            <div class="mordum-esther-sub">에스더 스킬 1회당 딜량 / 제거되는 1페이즈 체력 줄 수</div>
            ${groupsHtml}
        </div>
    `;
}

// 모르둠 상세보기 열림 상태 (난이도를 바꿔도 유지)
let mordumDetailOpen = false;

function bindMordumDetailToggle() {
    const btn = document.getElementById("mordumDetailBtn");
    const content = document.getElementById("mordumDetailContent");
    if (!btn || !content) return;

    btn.addEventListener("click", () => {
        mordumDetailOpen = content.classList.toggle("mbi-open");
        btn.textContent = mordumDetailOpen ? "모르둠 상세보기 ▲" : "모르둠 상세보기 ▼";
    });
}

/* =============================================
   모르둠 EX 전용 구간별 딜지분 (1페이즈 / 2페이즈 발악쉴드 분리)
   - 1페이즈: 500줄 -> 0줄(변환) = 20분(1200초)
   - 2페이즈: 발악쉴드(나메 73줄 / 하드·노말 36줄) = 2분(120초)
   - 발악쉴드 비율 = 발악쉴드 체력 / (총 체력 - 발악쉴드 체력)
     -> 나메 14.60%, 하드·노말 7.26% (MORDUM_BOSS_INFO에서 그대로 역산)
   - 딜러 실효딜량(100% 풀)을 1페이즈 : 2페이즈 = 1 : 발악쉴드비율 로 나눠서 배분
   ============================================= */
function getMordumPhaseSplit(diffKey) {
    const info = MORDUM_BOSS_INFO[diffKey];
    const shieldRatio = info ? info.shieldHp / (info.totalHp - info.shieldHp) : 0;
    const p2Frac = shieldRatio / (1 + shieldRatio); // 전체 딜량 중 2페이즈(발악쉴드) 몫
    return { shieldRatio, p1Frac: 1 - p2Frac, p2Frac };
}

// 에스더 스킬 이름 -> 해당 난이도 딜량 (억)
// 구간 누적 시간(초): 나메는 nmSec(있으면) 우선, 이후 난이도별 시간 보정(MORDUM_TIME_SCALE) 적용
function getMordumPointSec(p, diffKey) {
    const base = (diffKey === "nightmare" && p.nmSec !== undefined) ? p.nmSec : p.sec;
    return Math.round(base * (MORDUM_TIME_SCALE[diffKey] || 1));
}

function getMordumEstherEok(skillName, diffKey) {
    const idx = MORDUM_ESTHER_DIFF_INDEX[diffKey];
    for (const g of MORDUM_ESTHER_GROUPS) {
        const sk = g.skills.find(s => s.name === skillName);
        if (sk) return sk.dmg[idx] / 1e8;
    }
    return 0;
}

// 나메: 각 줄 지점까지의 '누적 유저 딜 / 딜러 실효 딜량' 진행도 (에스더 택틱 + 서폿 균등 반영)
function getMordumNmCumProgress(diffKey, config) {
    const info = MORDUM_BOSS_INFO[diffKey];
    const ts = MORDUM_TIME_SCALE[diffKey] || 1;
    const pts = config.points;
    const baseSec = pts.map(p => getMordumPointSec(p, diffKey));
    const p1Hp = info.totalHp - info.shieldHp;
    const supportPerSec = info.supportTotal / baseSec[baseSec.length - 1]; // 서폿 초당 딜 (억/초)

    const cum = [0];
    let acc = 0;
    for (let i = 1; i < pts.length; i++) {
        const sectionHp = p1Hp * (pts[i - 1].line - pts[i].line) / config.total;
        const esther = (MORDUM_NM_TACTIC.p1[pts[i].line] || [])
            .reduce((a, name) => a + getMordumEstherEok(name, diffKey), 0);
        const support = supportPerSec * (baseSec[i] - baseSec[i - 1]);
        acc += sectionHp - esther - support;
        cum.push(acc / info.player);
    }
    return cum;
}

function getMordumLineCutRows(diffKey, totalSec, fullTank, fullOne, fullBlood) {
    const config = lineCutConfig.mordum.gate1;
    const split = getMordumPhaseSplit(diffKey);

    // 난이도별 구간 시간 보정 (나메 x0.92)
    const ts = MORDUM_TIME_SCALE[diffKey] || 1;
    const ptSec = (p) => getMordumPointSec(p, diffKey);
    const lastPtSec = ptSec(config.points[config.points.length - 1]);
    const shieldBaseSec = Math.round(config.shieldSec * ts);

    // 나메는 에스더 택틱 기준 누적 진행도, 노말/하드는 기존 줄 수 비례
    const tacticCum = diffKey === "nightmare" ? getMordumNmCumProgress(diffKey, config) : null;

    // 기준 시간(22분) 대비 CLEAR TIME 비율만큼 모든 구간 시간을 늘리고 줄임
    const baseTotalSec = lastPtSec + shieldBaseSec;
    const f = totalSec > 0 ? totalSec / baseTotalSec : 1;
    const scaleSec = (sec) => Math.round(sec * f);

    const rows = [];

    // 1페이즈: 500줄 -> 0줄(변환)
    config.points.forEach((p, i) => {
        const p1Progress = (config.total - p.line) / config.total;   // 1페이즈 내 진행도
        const progress = tacticCum ? tacticCum[i] : p1Progress * split.p1Frac;   // 전체 딜량 대비 진행도
        // "전분 기준 클각" = CLEAR TIME 입력과 무관하게 항상 원래 기준(22분) 시각으로 표시
        const nmNoteTime = (diffKey === "nightmare" && p.nmClearNote)
            ? `${String(Math.floor(ptSec(p) / 60)).padStart(2, "0")}:${String(ptSec(p) % 60).padStart(2, "0")}`
            : null;
        rows.push({
            phase: 1,
            kind: p.line === config.total ? "start" : (p.line === 0 ? "phaseEnd" : "normal"),
            line: p.line,
            desc: p.desc,
            nmNoteTime,
            progress,
            elapsedSec: scaleSec(ptSec(p))
        });
    });

    // 2페이즈: 발악쉴드 시작 -> 0줄 클리어 (1페이즈에 이어서 22분까지)
    const shieldLines = (config.shieldLines && config.shieldLines[diffKey]) || 36;
    const p1EndSec = scaleSec(lastPtSec);
    rows.push({
        phase: 2, kind: "shieldStart", line: shieldLines, desc: "종족 변환 (고대 → 정령)",
        progress: tacticCum ? tacticCum[tacticCum.length - 1] : split.p1Frac, elapsedSec: p1EndSec
    });
    rows.push({
        phase: 2, kind: "clear", line: 0, desc: "발악쉴드 파괴 · 클리어",
        progress: 1, elapsedSec: Math.max(totalSec, p1EndSec)
    });

    // 누적 피해량 + 구간 피해량 + 구간 DPS (직전 줄 ~ 해당 줄)
    const fulls = { tank: fullTank || 0, one: fullOne || 0, blood: fullBlood || 0 };
    let prev = null;

    rows.forEach(r => {
        const raw = {
            tank: fulls.tank * r.progress,
            one: fulls.one * r.progress,
            blood: fulls.blood * r.progress
        };
        const cum = {
            tank: Math.floor(raw.tank + 1e-9),
            one: Math.floor(raw.one + 1e-9),
            blood: Math.floor(raw.blood + 1e-9)
        };

        r.tank = cum.tank;
        r.one = cum.one;
        r.blood = cum.blood;

        if (r.kind === "start") {
            prev = { raw, cum, sec: r.elapsedSec };
            return;
        }
        if (r.kind === "shieldStart") return; // 라벨만 표시 (직전 = 0줄 변환 유지)

        const segSec = prev ? Math.max(r.elapsedSec - prev.sec, 0) : 0;
        r.segSec = segSec;

        ["tank", "one", "blood"].forEach(k => {
            const rawDiff = raw[k] - (prev ? prev.raw[k] : 0);
            r["seg" + k] = cum[k] - (prev ? prev.cum[k] : 0);
            r["dps" + k] = segSec > 0 ? floorTo1(rawDiff / segSec) : 0;
        });

        // 마지막 "클리어" 지점은 그 구간(2분)만의 DPS가 아니라,
        // 상단 요약 카드와 같은 "전체 클리어 타임 기준 평균 DPS"로 표시
        if (r.kind === "clear" && totalSec > 0) {
            ["tank", "one", "blood"].forEach(k => {
                r["dps" + k] = floorTo1(raw[k] / totalSec);
            });
        }

        prev = { raw, cum, sec: r.elapsedSec };
    });

    return { rows, split, shieldLines };
}

export function makeMordumLineCutTimelineHtml(diffKey, totalSec, fullTank, fullOne, fullBlood, lineShares) {
    const { rows } = getMordumLineCutRows(diffKey, totalSec, fullTank, fullOne, fullBlood);

    const isSupport = currentRoleMode === "support";
    const tankLabel = isSupport ? "강조" : "강투";
    const bloodLabel = isSupport ? "잔조" : "잔혈";

    const unit = '<span class="damage-unit" style="font-size: 11px; font-weight: 700; color: #7c88a5; margin-left: 2px;">억</span>';
    const mmss = (sec) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
    const minSec = (sec) => `${Math.floor(sec / 60)}분 ${String(sec % 60).padStart(2, "0")}초`;

    const dpsUnit = '<span class="lc-dps-unit">억</span>';
    // DPS를 크게, 피해량은 아래 알약으로
    const fmtShareM = (v) => Number.isInteger(v) ? String(v) : Number(v).toFixed(1);
    const triHtml = (cls, label, value, dps) => `
        <div class="lc-tri ${cls}">
            <span class="lc-tri-label">${label}${lineShares && lineShares[cls] != null ? ` <em>${fmtShareM(lineShares[cls])}%</em>` : ""}</span>
            <span class="lc-tri-value is-dps"><span class="lc-tri-cap">DPS</span>${dps.toFixed(1)}${dpsUnit}</span>
            <span class="lc-tri-dps">피해<span class="sm-hide">량</span> ${fmt(value)}억</span>
        </div>
    `;

    const cardHtml = (r) => `
        <div class="line-cut-card">
            ${triHtml("tank", tankLabel, r.tank, r.dpstank)}
            ${triHtml("one", "1인분", r.one, r.dpsone)}
            ${triHtml("blood", bloodLabel, r.blood, r.dpsblood)}
        </div>
    `;

    const items = rows.map(r => {
        // 시작 지점은 라벨만 (카드 없음)
        if (r.kind === "start") {
            return `
                <div class="line-cut-row line-cut-start">
                    <div class="line-cut-marker">
                        <span class="line-cut-dot start"></span>
                        <span class="line-cut-connector"></span>
                    </div>
                    <div class="line-cut-start-label">${r.line}줄 - 조우 시작 (1 페이즈)</div>
                </div>
            `;
        }

        // 발악쉴드 시작 지점 (2페이즈) - 위(0줄 변환)/아래(클리어)와 세로선으로 이어짐
        if (r.kind === "shieldStart") {
            return `
                <div class="line-cut-row line-cut-start line-cut-shield-start">
                    <div class="line-cut-marker">
                        <span class="line-cut-dot start"></span>
                        <span class="line-cut-connector"></span>
                    </div>
                    <div class="line-cut-start-label">
                        ${r.line}줄 (실드) - 발악 시작 (2 페이즈)
                        <div class="line-cut-start-sub">${r.desc}</div>
                    </div>
                </div>
            `;
        }

        const isClear = r.kind === "clear";
        const isPhaseEnd = r.kind === "phaseEnd";
        const lineLabel = isClear ? "0줄 (실드 · 클리어)" : (isPhaseEnd ? "0줄 (변환)" : `${r.line}줄`);
        const rowCls = isClear ? "line-cut-clear" : (isPhaseEnd ? "line-cut-phase-end" : "");

        return `
            <div class="line-cut-row ${rowCls}">
                <div class="line-cut-marker">
                    <span class="line-cut-dot"></span>
                    ${isClear ? "" : '<span class="line-cut-connector"></span>'}
                </div>
                <div class="line-cut-body">
                    <div class="line-cut-label-row">
                        <div class="line-cut-line-wrap">
                            <span class="line-cut-line-num">${lineLabel}</span>
                            ${r.nmNoteTime ? `<span class="line-cut-nm-badge">전분 기준 클각 <b>${r.nmNoteTime}</b>분/초</span>` : ""}
                        </div>
                        <span class="line-cut-time">누적 ${mmss(r.elapsedSec)}</span>
                    </div>
                    ${r.desc ? `<div class="line-cut-desc">${r.desc}</div>` : ""}
                    ${cardHtml(r)}
                </div>
            </div>
        `;
    }).join("");

    return `<div class="line-cut-timeline lc-colored">${items}</div>`;
}



/* =============================================
   익스트림 (모르둠 EX / 종막 EX) 렌더링 — 구글시트 연동 없이 하드코딩
   ============================================= */
function bindExtremeTabs() {
    document.querySelectorAll("[data-extreme-raid]").forEach(el => {
        el.addEventListener("click", () => {
            if (currentExtremeRaid === el.dataset.extremeRaid) return;
            // 레이드를 바꿔도 지금 선택된 난이도(노말/하드/나메)를 그대로 유지
            const prevMeta = (raidMeta.extreme[currentExtremeRaid] || {})[currentCombo];
            const keepDiff = (prevMeta && prevMeta.diffKey) || "hard";
            setCurrentExtremeRaid(el.dataset.extremeRaid);
            setCurrentCombo(`${keepDiff}_gate1`);
            setBaseTimeByMenu("extreme");
            renderTable();
        });
    });
    document.querySelectorAll("[data-extreme-diff]").forEach(el => {
        el.addEventListener("click", () => {
            const nextCombo = el.dataset.extremeDiff + "_gate1";
            if (currentCombo === nextCombo) return;
            setCurrentCombo(nextCombo);
            setBaseTimeByMenu("extreme");
            renderTable();
        });
    });
    // 벨가르딘 등 다른 정밀계산 페이지는 renderTable()의 serka/cathedral/belgardin
    // 전용 블록 끝에서 이 두 가지를 바인딩하는데, 익스트림은 그 블록을 안 타므로 직접 바인딩
    document.querySelectorAll(".detail-tab[data-detail-tab]").forEach(btn => {
        btn.addEventListener("click", () => {
            const menu = btn.dataset.detailMenu || currentMenu;
            detailTabState[menu] = btn.dataset.detailTab;
            renderTable();
        });
    });
    bindRoleToggle();
}

// 종막 EX 전용 플레이스홀더 히어로 (데이터 수집 전까지 사용)



/* =============================================
   종막 EX UI 헬퍼
   ============================================= */
function getJongmakSupportShares(shares) {
    const conv = (v) => Math.floor(v * 1.25 * 10) / 10; // 서폿 환산: 딜러 기준 x1.25 (벨가르딘/모르둠과 동일)
    return { tank: conv(shares.tank), one: conv(shares.one), blood: conv(shares.blood) };
}

function formatJongmakSec(sec) {
    const s = Math.round(sec);
    return `${Math.floor(s / 60)}분 ${String(s % 60).padStart(2, "0")}초`;
}

function makeExtremeDiffGroupHtml(meta, levels) {
    const diffGroups = [
        { diffKey: "normal", label: "노말", cls: "pd-green" },
        { diffKey: "hard", label: "하드", cls: "pd-gold" },
        { diffKey: "nightmare", label: "나메", cls: "pd-purple" }
    ];
    const active = diffGroups.find(g => g.diffKey === meta.diffKey) || diffGroups[1];
    return `
        <div class="precision-inline-group">
            <div class="precision-control-label">난이도 선택</div>
            <div class="precision-diff-inline" id="precisionDiffInline">
                <div class="precision-switch-thumb precision-diff-thumb ${active.cls}" id="precisionDiffThumb"></div>
                ${diffGroups.map(g => `
                    <div class="precision-diff-chip ${meta.diffKey === g.diffKey ? `${g.cls} active` : ""}" data-extreme-diff="${g.diffKey}">
                        <span class="precision-diff-chip-main">${g.label}</span>
                        <span class="precision-diff-chip-sub">${levels[g.diffKey] || "-"}</span>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

// 보스 정보 패널: 관문별 체력 / 에스더 / 서폿 / 지분체력

// 종막 상세보기 열림 상태 (난이도를 바꿔도 유지)
let jongmakDetailOpen = false;

function bindJongmakDetailToggle() {
    const btn = document.getElementById("jongmakDetailBtn");
    const content = document.getElementById("jongmakDetailContent");
    if (!btn || !content) return;
    btn.addEventListener("click", () => {
        jongmakDetailOpen = content.classList.toggle("mbi-open");
        btn.textContent = jongmakDetailOpen ? "종막 상세보기 ▲" : "종막 상세보기 ▼";
    });
}


// 에스더 이름 태그: 같은 스킬은 x개수로 묶어서 표시
function makeJongmakUsageTagsHtml(ids) {
    if (!ids || !ids.length) return '<span class="jm-tl-etag none">사용 없음</span>';
    const order = [];
    const cnt = {};
    ids.forEach(id => { if (!cnt[id]) { cnt[id] = 0; order.push(id); } cnt[id]++; });
    return order.map(id => {
        const sk = JONGMAK_ESTHER_SKILLS[id];
        return `<span class="jm-tl-etag" style="--tone:${sk.tone}">${sk.name}${cnt[id] > 1 ? ` <b>x${cnt[id]}</b>` : ""}</span>`;
    }).join("");
}

// 상세보기: 관문별(2-1 / 2-2 / 2-3) 에스더 목록 - 스킬 딜량 + 깎는 체력 줄 수
function makeJongmakEstherList(diffKey) {
    const base = JONGMAK_EX_BASE[diffKey];
    const live = getJongmakLive(diffKey);
    if (!base || !live) return "";

    const gateMeta = [
        { key: "g1", cls: "g1", sym: "❖", name: "2-1", info: "대악마 · 체력 999줄 기준" },
        { key: "g2", cls: "g2", sym: "◈", name: "2-2", info: "신 · 본체 777줄 기준 (쉴드 제외)" },
        { key: "g3", cls: "g3", sym: "✦", name: "2-3", info: "신 · 전체 막대의 70% · 체력 줄 수 미확인" },
        { key: "g4", cls: "g3 g4", sym: "✹", name: "2-3 발악", info: "신 · 전체 막대의 10% · 히든 아만 사용 시 25초" }
    ];

    const groups = gateMeta.map((gm, gi) => {
        const used = jongmakEstherUse[gm.key] || [];
        const tags = JONGMAK_ESTHER_GATE_LIST[gm.key].map(id => {
            const sk = JONGMAK_ESTHER_SKILLS[id];
            const eok = Math.round(base.hp1 * jongmakEffPct(id) / 100 / 1e8);
            const lines = getJongmakEsLines(diffKey, gm.key, jongmakEffPct(id));
            const n = used.filter(x => x === id).length;
            const pips = Array.from({ length: sk.cells }, () => "<i></i>").join("");
            return `
                <div class="mordum-esther-tag jm-esther-tag ${n > 0 ? "is-used" : ""}" style="--tone:${sk.tone}" title="2-1 체력의 ${jongmakEffPct(id).toFixed(3)}%${JONGMAK_ES_EFFECT[id] !== undefined ? ` (풀딜의 ${Math.round(JONGMAK_ES_EFFECT[id] * 1000) / 10}%만 반영)` : ""}">
                    <span class="me-pips">${pips}</span>
                    <span class="me-namebox">
                        <span class="me-name">${sk.name}</span>
                    </span>
                    <span class="me-dmg">약 ${fmt(eok)}억</span>
                    <span class="me-line">${lines === null ? "???" : `${lines.toFixed(2)}줄`}</span>
                </div>
            `;
        }).join("");

        const g = live.gates[gi];
        return `
            <div class="jm-es-gate ${gm.cls}">
                <div class="jm-es-gate-head">
                    <div class="jm-es-gate-title"><span class="jm-es-sym">${gm.sym}</span><b>${gm.name}</b><span>${gm.info}</span></div>
                    <div class="jm-es-gate-use">사용 중 <b>약 ${fmt(Math.round(g.esther / 1e8))}억</b></div>
                </div>
                <div class="mordum-esther-tags">${tags}</div>
            </div>
        `;
    }).join("");

    return `
        <div class="mordum-esther-list">
            <div class="mordum-esther-title jm-title ${diffKey}">${getMordumDiffLabel(diffKey)} 에스더 딜량</div>
            <div class="mordum-esther-sub">에스더 스킬 1회당 딜량 / 깎이는 체력 줄 수</div>
            ${groups}
        </div>
    `;
}

/* =============================================
   에스더 사용 입력 팝업 (✕를 누르기 전까지 유지 / 뒤 화면과 동시에 조작 가능)
   - 오른쪽 목록 -> 왼쪽 관문 칸으로 드래그(또는 탭)해서 추가, 칸 안의 x로 삭제
   ============================================= */
let jongmakEsOpen = false;
let jongmakEsEventsBound = false;

function ensureJongmakEsPopup() {
    let el = document.getElementById("jmEsPopup");
    if (!el) {
        el = document.createElement("div");
        el.id = "jmEsPopup";
        el.className = "jm-ep";
        el.setAttribute("role", "dialog");
        el.setAttribute("aria-label", "에스더 사용 입력");
        el.style.display = "none";
        document.body.appendChild(el);
        bindJongmakEsEvents(el);
    }
    return el;
}

function syncJongmakEsPopup() {
    const visible = jongmakEsOpen && currentMenu === "extreme" && currentExtremeRaid === "jongmak";
    const el = visible ? ensureJongmakEsPopup() : document.getElementById("jmEsPopup");
    if (!el) return;
    el.style.display = visible ? "" : "none";
    if (visible) renderJongmakEsPopup();
    setJongmakEsScrollLock(visible && window.innerWidth <= 768);
}

// 팝업을 화면 정중앙에 배치 (모바일은 하단 시트라 CSS 위치 사용)
function centerJongmakEsPopup() {
    const el = document.getElementById("jmEsPopup");
    if (!el || el.style.display === "none") return;
    if (window.innerWidth <= 768) {
        el.style.left = el.style.top = el.style.right = el.style.bottom = "";
        return;
    }
    const r = el.getBoundingClientRect();
    el.style.right = "auto";
    el.style.bottom = "auto";
    el.style.left = Math.max(8, Math.round((window.innerWidth - r.width) / 2)) + "px";
    el.style.top = Math.max(8, Math.round((window.innerHeight - r.height) / 2)) + "px";
}

// 모바일에서 팝업이 열려 있는지 (본문 스크롤 고정 판단용)
function isJongmakEsMobileOpen() {
    const el = document.getElementById("jmEsPopup");
    return !!el && el.style.display !== "none" && jongmakEsOpen && window.innerWidth <= 768;
}

// 모바일에서 팝업이 열려 있는 동안 뒤의 본문을 고정 (팝업 안에서 스크롤해도 본문이 같이 움직이지 않음)
//  - body를 position: fixed로 고정하고 현재 스크롤 위치를 저장했다가, 닫으면 원래 위치로 복원
//  - 팝업 목록 자체의 스크롤은 CSS(overscroll-behavior: contain)로 끝에서 본문으로 넘어가지 않게 처리
let jongmakEsScrollLock = null;
export function setJongmakEsScrollLock(on) {
    const body = document.body;
    if (on && !jongmakEsScrollLock) {
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        jongmakEsScrollLock = { y, style: body.getAttribute("style") };
        body.style.position = "fixed";
        body.style.top = `-${y}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";
    } else if (!on && jongmakEsScrollLock) {
        const { y, style } = jongmakEsScrollLock;
        jongmakEsScrollLock = null;
        if (style === null) body.removeAttribute("style"); else body.setAttribute("style", style);
        window.scrollTo(0, y);
    }
}

function jongmakEsChanged() {
    saveJongmakEsUse();
    // 히든 아만 사용 여부로 기본 클리어 타임(33:27 <-> 33:02)이 바뀌면, 사용자가 시간을 직접 바꾸지 않았을 때만 새 기본값으로 맞춤
    const prevSec = jongmakLastDefaultSec;
    const nextSec = getJongmakDefaultTime().sec;
    if (prevSec !== nextSec) {
        const mEl = document.getElementById("minutes");
        const sEl = document.getElementById("seconds");
        const cur = (parseInt(mEl && mEl.value, 10) || 0) * 60 + (parseInt(sEl && sEl.value, 10) || 0);
        if (cur === prevSec) setBaseTimeByMenu("extreme");
        jongmakLastDefaultSec = nextSec;
    }
    renderTable();   // 본문 + 팝업(sync) 한 번에 갱신
}

// 에스더 1회가 깎는 딜량(억) - 현재 난이도 기준. 추가/삭제 때 알려주는 토스트에 사용 (터치 기기는 툴팁이 없음)
let jongmakEsToast = null;
function jongmakEsSkillEok(skillId) {
    const meta = raidMeta.extreme.jongmak[currentCombo] || raidMeta.extreme.jongmak.hard_gate1;
    const base = JONGMAK_EX_BASE[meta.diffKey];
    const sk = JONGMAK_ESTHER_SKILLS[skillId];
    return base && sk ? Math.round(base.hp1 * jongmakEffPct(skillId) / 100 / 1e8) : 0;
}

function jongmakEsAdd(gate, skillId) {
    const list = jongmakEstherUse[gate];
    if (!list || !JONGMAK_ESTHER_SKILLS[skillId]) return;
    if (!JONGMAK_ESTHER_GATE_LIST[gate].includes(skillId)) return;
    if (list.length >= JONGMAK_ESTHER_MAX_PER_GATE) return;
    list.push(skillId);
    jongmakEsToast = `+ ${JONGMAK_ESTHER_SKILLS[skillId].name} · 약 ${fmt(jongmakEsSkillEok(skillId))}억 차감`;
    jongmakEsChanged();
}

function renderJongmakEsPopup() {
    const el = document.getElementById("jmEsPopup");
    if (!el) return;
    ensureJongmakExtraStyle();
    const meta = raidMeta.extreme.jongmak[currentCombo] || raidMeta.extreme.jongmak.hard_gate1;
    const diffKey = meta.diffKey;
    const base = JONGMAK_EX_BASE[diffKey];
    const live = getJongmakLive(diffKey);
    const gateNames = { g1: "2-1", g2: "2-2", g3: "2-3", g4: "2-3 발악" };
    const gateKeys = JONGMAK_GATE_KEYS;
    el.className = `jm-ep jm-ep-${diffKey}`;   // 난이도별 분위기: 나메=보라 / 하드=금색 / 노말=초록
    const pipsHtml = (n) => `<span class="me-pips">${Array.from({ length: n }, () => "<i></i>").join("")}</span>`;
    const tipOf = (sk) => `${sk.name} · 약 ${fmt(Math.round(base.hp1 * jongmakEffPct(sk.id) / 100 / 1e8))}억 (2-1 체력의 ${jongmakEffPct(sk.id).toFixed(3)}%${JONGMAK_ES_EFFECT[sk.id] !== undefined ? ` · 풀딜의 ${Math.round(JONGMAK_ES_EFFECT[sk.id] * 1000) / 10}%만 반영` : ""})`;

    // 맨 위 난이도 버튼 (누르면 팝업 + 실제 페이지가 같이 바뀜)
    const diffBar = [["normal", "노말"], ["hard", "하드"], ["nightmare", "나메"]].map(([k, label]) =>
        `<button type="button" class="jm-ep-dbtn ${k} ${k === diffKey ? "active" : ""}" data-diff="${k}" aria-pressed="${k === diffKey}">${label}</button>`
    ).join("");

    // 관문별로 [왼쪽: 사용 칸] + [오른쪽: 해당 관문 에스더 목록]을 같은 줄에 정렬
    const rowsHtml = gateKeys.map((gk, i) => {
        const ids = jongmakEstherUse[gk] || [];
        const chips = ids.map((id, idx) => {
            const sk = JONGMAK_ESTHER_SKILLS[id];
            return `<span class="jm-ep-chip placed" style="--tone:${sk.tone}" title="${tipOf(sk)}">${pipsHtml(sk.cells)}<span class="jm-ep-name">${sk.name}</span><button type="button" class="jm-ep-x" data-gate="${gk}" data-idx="${idx}" aria-label="${sk.name} 삭제">×</button></span>`;
        }).join("");
        // 기본 6자리(2열 x 3줄)를 항상 확보. 넘치면 칸 안에서만 스크롤
        const slotTotal = Math.max(6, Math.ceil(ids.length / 2) * 2);
        const slots = Array.from({ length: slotTotal - ids.length }, () => '<span class="jm-ep-slot"></span>').join("");

        const gateBox = `
            <div class="jm-ep-gate ${jmGateCls(i)}" data-gate="${gk}" style="--r:${i + 1}">
                <div class="jm-ep-gate-head">
                    <span class="jm-ep-gate-name"><i class="mbi-dot ${jmGateCls(i)}"></i>${gateNames[gk]} 에스더 사용</span>
                    <span class="jm-ep-sum">약 ${fmt(Math.round(live.gates[i].esther / 1e8))}억</span>
                </div>
                <div class="jm-ep-zone" data-gate="${gk}">${chips}${slots}</div>
            </div>`;

        const palChips = JONGMAK_ESTHER_GATE_LIST[gk].map(id => {
            const sk = JONGMAK_ESTHER_SKILLS[id];
            return `<button type="button" class="jm-ep-chip pal" data-skill="${id}" data-gate="${gk}" style="--tone:${sk.tone}" title="${tipOf(sk)}"><i class="jm-ep-grip" aria-hidden="true"></i>${pipsHtml(sk.cells)}<span class="jm-ep-name">${sk.name}</span></button>`;
        }).join("");
        const toprow = i === 0
            ? `<div class="jm-ep-toprow"><b>에스더 목록</b><span class="jm-ep-hint"><span class="jm-ep-hint-arrow" aria-hidden="true">◀</span>끌어서 관문 칸에 놓기 <em>(탭해도 추가)</em></span></div>`
            : "";
        const pal = `
            <div class="jm-ep-pal ${jmGateCls(i)}" style="--r:${i + 1}">
                ${toprow}
                <div class="jm-ep-pal-body">
                    <div class="jm-ep-pal-head">${gateNames[gk]}</div>
                    <div class="jm-ep-pal-list">${palChips}</div>
                </div>
            </div>`;
        return gateBox + pal;
    }).join("");

    const totalEsther = live.gates.reduce((a, g) => a + g.esther, 0);
    const custom = isJongmakEstherCustom();
    const hasAnyUse = gateKeys.some(gk => (jongmakEstherUse[gk] || []).length > 0);

    el.innerHTML = `
        <div class="jm-ep-head">
            <div class="jm-ep-title"><span class="jm-ep-title-ico">✦</span>에스더 사용 입력</div>
            <button type="button" class="jm-ep-clear" ${hasAnyUse ? "" : "disabled"}>비우기</button>
            <button type="button" class="jm-ep-reset" ${custom ? "" : "disabled"}>기본값</button>
            <button type="button" class="jm-ep-close" aria-label="닫기">×</button>
        </div>
        <div class="jm-ep-diffbar" role="group" aria-label="난이도 선택">${diffBar}</div>
        <div class="jm-ep-tip">목록의 에스더를 <b>관문 칸에 끌어다 놓거나 탭</b>하세요 · 칸 안 <b>×</b>로 삭제 · 창은 <b>우측 상단 ×</b>로만 닫혀요</div>
        <div class="jm-ep-body">
            <div class="jm-ep-divider"></div>
            ${rowsHtml}
        </div>
        <div class="jm-ep-foot">
            <span>에스더 차감 합계 <b>약 ${fmt(Math.round(totalEsther / 1e8))}억</b></span>
            <span class="jm-ep-state ${custom ? "custom" : ""}">${custom ? "사용자 입력 적용 중" : "기본 구성 (발악 히든 아만 사용)"}</span>
        </div>
    `;

    if (jongmakEsToast) {
        const t = document.createElement("div");
        t.className = "jm-ep-toast";
        t.setAttribute("role", "status");
        t.textContent = jongmakEsToast;
        el.appendChild(t);
        jongmakEsToast = null;
        setTimeout(() => t.remove(), 1900);
    }
}

function bindJongmakEsEvents(el) {
    // 닫기 / 삭제 / 기본값
    el.addEventListener("click", (e) => {
        if (e.target.closest(".jm-ep-close")) { jongmakEsOpen = false; syncJongmakEsPopup(); return; }
        const db = e.target.closest(".jm-ep-dbtn");
        if (db) {
            const nextCombo = db.dataset.diff + "_gate1";
            if (currentCombo !== nextCombo) {
                setCurrentCombo(nextCombo);      // 페이지의 난이도 버튼과 같은 동작
                setBaseTimeByMenu("extreme");
                renderTable();
            }
            return;
        }
        const x = e.target.closest(".jm-ep-x");
        if (x) {
            const list = jongmakEstherUse[x.dataset.gate];
            if (list) {
                const removed = list.splice(Number(x.dataset.idx), 1)[0];
                if (removed) jongmakEsToast = `− ${JONGMAK_ESTHER_SKILLS[removed].name} 삭제 · 약 ${fmt(jongmakEsSkillEok(removed))}억 되돌림`;
            }
            jongmakEsChanged();
            return;
        }
        if (e.target.closest(".jm-ep-clear")) {
            jongmakEstherUse = { g1: [], g2: [], g3: [], g4: [] };
            jongmakEsToast = "에스더를 모두 비웠어요";
            jongmakEsChanged();
            return;
        }
        if (e.target.closest(".jm-ep-reset")) {
            jongmakEstherUse = cloneJongmakEsDefault();
            jongmakEsToast = "기본 구성으로 되돌렸어요";
            jongmakEsChanged();
        }
    });

    // 키보드: 목록 칩에서 Enter / Space = 추가
    el.addEventListener("keydown", (e) => {
        const chip = e.target.closest && e.target.closest(".jm-ep-chip.pal");
        if (chip && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            jongmakEsAdd(chip.dataset.gate, chip.dataset.skill);
        }
    });

    el.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        const chip = e.target.closest(".jm-ep-chip.pal");
        if (chip) { startJongmakEsChipDrag(e, chip); return; }
        const head = e.target.closest(".jm-ep-head");
        if (head && !e.target.closest("button") && window.innerWidth > 768) startJongmakEsPopupMove(e, el);
    });
}

// 목록 칩 -> 관문 칸 드래그 (움직임이 거의 없으면 '탭'으로 보고 바로 추가)
function startJongmakEsChipDrag(e, chip) {
    e.preventDefault();
    const sx = e.clientX, sy = e.clientY;
    const gate = chip.dataset.gate, skill = chip.dataset.skill;
    const gateEls = Array.from(document.querySelectorAll("#jmEsPopup .jm-ep-gate"));
    let ghost = null;
    let dragging = false;

    const gateAt = (x, y) => {
        const under = document.elementFromPoint(x, y);
        return under ? under.closest(".jm-ep-gate") : null;
    };
    const onMove = (ev) => {
        if (!dragging && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 6) {
            dragging = true;
            ghost = chip.cloneNode(true);
            ghost.classList.add("jm-ep-ghost");
            document.body.appendChild(ghost);
            document.body.classList.add("jm-ep-dragging");
            gateEls.forEach(g => g.classList.toggle("is-target", g.dataset.gate === gate));
        }
        if (dragging) {
            ghost.style.left = ev.clientX + "px";
            ghost.style.top = ev.clientY + "px";
            const over = gateAt(ev.clientX, ev.clientY);
            gateEls.forEach(g => g.classList.toggle("is-over", !!over && g === over && g.dataset.gate === gate));
        }
    };
    const cleanup = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onCancel);
        if (ghost) ghost.remove();
        document.body.classList.remove("jm-ep-dragging");
        gateEls.forEach(g => g.classList.remove("is-target", "is-over"));
    };
    const onUp = (ev) => {
        const wasDragging = dragging;
        cleanup();
        if (!wasDragging) { jongmakEsAdd(gate, skill); return; }
        const over = gateAt(ev.clientX, ev.clientY);
        if (over && over.dataset.gate === gate) jongmakEsAdd(gate, skill);
    };
    const onCancel = () => cleanup();

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
}

// 팝업 제목줄 드래그로 위치 이동 (데스크톱)
function startJongmakEsPopupMove(e, el) {
    e.preventDefault();
    const r = el.getBoundingClientRect();
    const ox = e.clientX - r.left, oy = e.clientY - r.top;
    el.style.right = "auto";
    el.style.bottom = "auto";
    el.style.left = r.left + "px";
    el.style.top = r.top + "px";
    const onMove = (ev) => {
        const maxL = Math.max(0, window.innerWidth - 80);
        const maxT = Math.max(0, window.innerHeight - 48);
        el.style.left = Math.min(Math.max(ev.clientX - ox, 8 - r.width + 120), maxL) + "px";
        el.style.top = Math.min(Math.max(ev.clientY - oy, 0), maxT) + "px";
    };
    const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
}

// [분리] index.js 최상위에서 실행되던 이벤트 바인딩. index.js가 원래 위치에서 호출합니다.
export function initJongmakEsEvents() {
    // "에스더 사용 입력하기" 버튼(미니 히어로 / 구간별 안내) - 화면이 다시 그려져도 동작하도록 문서 단위로 한 번만 등록
    if (!jongmakEsEventsBound && typeof document !== "undefined") {
        jongmakEsEventsBound = true;
        window.addEventListener("resize", () => setJongmakEsScrollLock(isJongmakEsMobileOpen()));
        document.addEventListener("click", (e) => {
            // 구간별 딜지분 카드의 '상세 열기' (화면이 다시 그려져도 열림 상태 유지)
            const dt = e.target.closest("[data-jm-dt-toggle]");
            if (dt) {
                const card = dt.closest(".jm-tl-card");
                if (card) {
                    const on = card.classList.toggle("jm-dt-open");
                    jongmakGateDetailOpen[dt.dataset.jmDtToggle] = on;
                    dt.setAttribute("aria-expanded", on ? "true" : "false");
                }
                return;
            }
            if (!e.target.closest("[data-jm-open-es]")) return;
            const wasOpen = jongmakEsOpen;
            jongmakEsOpen = true;
            syncJongmakEsPopup();
            if (!wasOpen) centerJongmakEsPopup();   // 이미 열려 있으면 사용자가 옮긴 위치를 그대로 둠
        });
    }
}


/* =============================================
   종막 EX 구간별 딜지분 - 상세 열기 / 발악 카드 보조 코드
   ============================================= */
// 관문별 '상세 열기' 상태
let jongmakGateDetailOpen = {};

// 23100 -> "2조 3,100억" (1번글 택틱 정리 표와 같은 표기)
function fmtJoEok(eok) {
    const v = Math.round(eok);
    if (v >= 10000) return `${Math.floor(v / 10000)}조 ${fmt(v % 10000)}억`;
    return `${fmt(v)}억`;
}

// 이 구간에서 '실제로 넣어야 하는' 딜 (누적이 아니라 구간 단독 값)
function makeJongmakGateDetailHtml(g, o) {
    const req = g.share / 1e8;                                      // 요구 딜러 피해량(억)
    const reqDps = o.segSec > 0 ? floorTo1(req / o.segSec) : 0;      // 요구 DPS(딜러 6인 합산, 억/초)
    const base = JONGMAK_EX_BASE[o.diffKey];
    let hpNote = "";
    if (g.key === "g2") hpNote = "본체 기준 (쉴드 제외)";
    if ((g.key === "g3" || g.key === "g4") && base) {
        hpNote = `2-3 전체 막대 ${fmtJoEok(base.bar3 / 1e8)}의 ${Math.round(JONGMAK_BAR3_RATIO[g.key] * 100)}%`;
    }
    const cell = (label, value, note, hl) => `
        <div class="jm-dt-cell${hl ? " hl" : ""}">
            <span class="jm-dt-k">${label}</span>
            <b class="jm-dt-v">${value}</b>
            ${note ? `<i class="jm-dt-n">${note}</i>` : ""}
        </div>`;
    const shareRows = o.keys.map(k => {
        const part = req * o.pct[k] / 100;
        const dps = o.segSec > 0 ? floorTo1(part / o.segSec) : 0;
        return `
        <div class="jm-dt-share ${k}">
            <span class="jm-dt-sl">${o.labels[k]} <em>${o.fmtPct(o.pct[k])}%</em></span>
            <span class="jm-dt-sv">구간 피해 <b>${fmtJoEok(Math.floor(part + 1e-9))}</b></span>
            <span class="jm-dt-sd">구간 DPS <b>${dps.toFixed(1)}억</b></span>
        </div>`;
    }).join("");
    const hiddenNote = g.key === "g4" ? (o.hidden ? "히든 아만 사용 · 발악 25초" : "히든 미사용 · 발악 50초") : "";
    return `
        <button type="button" class="jm-tl-dt-btn" data-jm-dt-toggle="${g.key}" aria-expanded="${o.open ? "true" : "false"}">
            <span class="o-closed">상세 열기 ▾</span><span class="o-open">상세 닫기 ▴</span>
        </button>
        <div class="jm-dt">
            <div class="jm-dt-title">${g.name} 구간 상세 <small>(누적이 아니라 이 구간에서 실제로 넣어야 하는 딜)</small></div>
            <div class="jm-dt-grid">
                ${cell("구간 시간", formatJongmakSec(o.segSec), hiddenNote)}
                ${cell("구간 체력", fmtJoEok(g.hp / 1e8), hpNote)}
                ${cell("에스더 차감", fmtJoEok(g.esther / 1e8), g.usage && g.usage.length ? "" : "사용 없음")}
                ${cell("요구 딜러 피해량", fmtJoEok(req), "딜러 6명 합산", true)}
                ${cell("요구 DPS", reqDps.toFixed(1) + "억", "딜러 6명 합산 / 초", true)}
            </div>
            <div class="jm-dt-shares">${shareRows}</div>
        </div>`;
}

// g4(발악) 색 / 상세 열기 스타일은 CSS 파일을 따로 건드리지 않도록 한 번만 주입
function ensureJongmakExtraStyle() {
    if (typeof document === "undefined" || document.getElementById("jmExtraStyle")) return;
    const st = document.createElement("style");
    st.id = "jmExtraStyle";
    st.textContent = `
/* 2-3 발악(g4): 2-3(g3) 스타일을 그대로 쓰고 색만 주황으로 */
.jm-tl-row.g3.g4 .jm-tl-dot{background:#fb923c;box-shadow:0 0 0 4px rgba(251,146,60,.16),0 0 14px rgba(251,146,60,.5)}
.jm-tl-row.g3.g4 .jm-tl-card{border-color:rgba(251,146,60,.4);border-left-color:#fb923c;background-image:linear-gradient(135deg,rgba(251,146,60,.09),transparent 55%)}
.jm-tl-row.g3.g4 .jm-tl-gate{border-color:rgba(251,146,60,.55);background:rgba(251,146,60,.14);color:#fed7aa}
.mbi-dot.g3.g4{background:#fb923c;box-shadow:0 0 8px rgba(251,146,60,.6)}
.jm-es-gate.g3.g4,.jm-ep-gate.g3.g4{border-color:rgba(251,146,60,.42)}
.jm-ep-pal.g3.g4 .jm-ep-pal-head{color:#fdba74}
.mbi-sub.g3.g4 .mbi-label{color:#fdba74}
/* 구간별 상세 열기 */
.jm-tl-dt-btn{display:flex;align-items:center;justify-content:center;width:100%;margin-top:12px;padding:9px 0 3px;background:none;border:0;border-top:1px solid rgba(148,163,184,.16);color:#94a3b8;font-size:12px;font-weight:800;letter-spacing:.02em;cursor:pointer;font-family:inherit}
.jm-tl-dt-btn:hover{color:#e2e8f0}
.jm-tl-dt-btn .o-open{display:none}
.jm-tl-card.jm-dt-open .jm-tl-dt-btn .o-open{display:inline}
.jm-tl-card.jm-dt-open .jm-tl-dt-btn .o-closed{display:none}
.jm-dt{display:none;margin-top:10px;padding:12px;border-radius:12px;background:rgba(2,6,23,.5);border:1px solid rgba(148,163,184,.16)}
.jm-tl-card.jm-dt-open .jm-dt{display:block}
.jm-dt-title{font-size:12px;font-weight:900;color:#e2e8f0;margin-bottom:10px}
.jm-dt-title small{font-weight:600;color:#94a3b8;margin-left:4px}
.jm-dt-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:8px}
.jm-dt-cell{display:flex;flex-direction:column;gap:3px;padding:9px 10px;border-radius:10px;background:rgba(148,163,184,.07);border:1px solid rgba(148,163,184,.12)}
.jm-dt-cell.hl{background:rgba(250,204,21,.07);border-color:rgba(250,204,21,.28)}
.jm-dt-k{font-size:11px;color:#94a3b8;font-weight:700}
.jm-dt-v{font-size:15px;color:#f8fafc;font-weight:900}
.jm-dt-cell.hl .jm-dt-v{color:#fde68a}
.jm-dt-n{font-size:10.5px;color:#7c8aa5;font-style:normal;line-height:1.35}
.jm-dt-shares{display:grid;gap:6px;margin-top:10px}
.jm-dt-share{display:grid;grid-template-columns:minmax(76px,.7fr) 1.4fr 1fr;gap:8px;align-items:center;padding:8px 10px;border-radius:10px;background:rgba(148,163,184,.06);font-size:12px;color:#cbd5e1}
.jm-dt-share em{font-style:normal;color:#94a3b8;margin-left:3px;font-size:11px}
.jm-dt-share b{color:#f8fafc;font-weight:900}
.jm-dt-share.tank .jm-dt-sl{color:#facc15}
.jm-dt-share.one .jm-dt-sl{color:#60a5fa}
.jm-dt-share.blood .jm-dt-sl{color:#a78bfa}
@media (max-width:560px){.jm-dt-share{grid-template-columns:1fr 1fr}.jm-dt-share .jm-dt-sl{grid-column:1/-1}}
`;
    document.head.appendChild(st);
}

// 구간별 딜지분 (2-1 / 2-2 / 2-3 / 2-3 발악)
// 관문 종료 시점마다 [사용 에스더] + 강투/1인분/잔혈의 누적 딜량과 누적 DPS(= 누적 딜량 / 시작부터의 누적 시간)만 간단히 표시
// 마지막 2-3 클리어 지점의 DPS는 자동으로 전체 클리어 평균 DPS와 같아짐
// (에스더 차감값은 사용자가 입력한 에스더 사용 기준으로 이미 반영되어 있음)
export function makeJongmakLineCutTimelineHtml(diffKey, totalSec) {
    ensureJongmakExtraStyle();
    const data = getJongmakLive(diffKey);
    if (!data) return '<div class="coming-soon"><h3>준비중</h3><p>구간 데이터가 없습니다.</p></div>';

    const isSupport = currentRoleMode === "support";
    const pct = isSupport ? getJongmakSupportShares(data.shares) : data.shares;
    const labels = isSupport
        ? { tank: "강조", one: "1인분", blood: "잔조" }
        : { tank: "강투", one: "1인분", blood: "잔혈" };
    const keys = ["tank", "one", "blood"];
    const f = totalSec > 0 ? totalSec / data.totalSec : 1;
    const fmtPct = (v) => Number.isInteger(v) ? String(v) : v.toFixed(1);
    const mmss = (sec) => { const s = Math.round(sec); return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
    const custom = isJongmakEstherCustom();

    let cumShare = 0;   // 억
    let cumSec = 0;
    const lastIdx = data.gates.length - 1;

    const gateCards = data.gates.map((g, i) => {
        const gm = JONGMAK_EX_GATES.find(x => x.key === g.key);
        const cls = jmGateCls(i);
        const segSec = g.sec * f;
        const segShare = g.share / 1e8;
        cumShare += segShare;
        cumSec += segSec;
        const isClear = i === lastIdx;
        const lines = JONGMAK_GATE_LINES[g.key];

        const tiles = keys.map(k => {
            const cum = cumShare * pct[k] / 100;           // 이 관문 종료 시점까지 누적 딜량
            const cumDps = floorTo1(cum / cumSec);         // 시작부터 이 관문 종료까지 누적 딜량 / 누적 시간
            return `
                <div class="jm-tile ${k}">
                    <div class="jm-tile-label">${labels[k]} <em>${fmtPct(pct[k])}%</em></div>
                    <div class="jm-tile-main"><span class="jm-tile-cap">DPS</span>${cumDps.toFixed(1)}<span class="jm-tile-unit">억</span></div>
                    <div class="jm-tile-dps">피해<span class="sm-hide">량</span> ${fmt(Math.floor(cum + 1e-9))}억</div>
                </div>`;
        }).join("");

        return `
            <div class="jm-tl-row ${cls}">
                <div class="jm-tl-marker"><span class="jm-tl-dot"></span>${isClear ? "" : '<span class="jm-tl-line"></span>'}</div>
                <div class="jm-tl-card${jongmakGateDetailOpen[g.key] ? " jm-dt-open" : ""}">
                    <div class="jm-tl-head">
                        <div class="jm-tl-headleft">
                            <span class="jm-tl-gate">${g.name}</span>
                            <span class="jm-tl-title">${isClear ? "클리어" : "종료"}</span>
                            ${gm.estimated && data.hp3Source !== "measured" ? '<span class="jm-est">추정</span>' : ""}
                        </div>
                        <div class="jm-tl-etags"><span class="jm-tl-etags-label">사용 에스더</span>${makeJongmakUsageTagsHtml(g.usage)}</div>
                        <span class="jm-tl-time">누적 <b>${mmss(cumSec)}</b></span>
                    </div>
                    <div class="jm-tl-meta">${gm.type.text} · 관문 시간 ${formatJongmakSec(segSec)}${lines ? ` · 체력 ${lines}줄` : ""}</div>
                    <div class="jm-tiles">${tiles}</div>
                    ${makeJongmakGateDetailHtml(g, { segSec, diffKey, pct, labels, keys, fmtPct, hidden: data.hiddenUsed, open: !!jongmakGateDetailOpen[g.key] })}
                </div>
            </div>
        `;
    }).join("");

    const startRow = `
        <div class="jm-tl-row start">
            <div class="jm-tl-marker"><span class="jm-tl-dot start"></span><span class="jm-tl-line"></span></div>
            <div class="jm-tl-start">2-1 · 조우 시작</div>
        </div>`;

    return `
        <div class="jm-tl">
            <div class="jm-tl-guide">
                <div class="jm-tl-guide-text"><b>2-1, 2-2, 2-3, 발악</b> 종료까지 <b>누적 딜량</b>, <b>누적 DPS</b>는 시작부터 그 구간까지 평균 · 구간별로 넣어야 하는 딜은 <b>상세 열기</b></div>
                <div class="jm-tl-guide-actions">
                    ${custom ? '<span class="jm-tl-custom">에스더 사용값 수정됨</span>' : ""}
                    <button type="button" class="jm-es-open-btn mini" data-jm-open-es>✦ <span class="jm-es-full">에스더 사용 입력</span><span class="jm-es-short">에스더</span></button>
                </div>
            </div>
            ${startRow}
            ${gateCards}
        </div>
    `;
}

function makeJongmakMiniHero(meta) {
    const diffLabel = getMordumDiffLabel(meta.diffKey);
    const level = JONGMAK_EX_LEVELS[meta.diffKey] || "-";
    const miniBattleIconsHtml = buildMiniBattleIconsHtml("jongmak", meta.diffKey, "gate1", currentRoleMode);
    const miniLoadoutBlock = miniBattleIconsHtml ? `
                <div class="bi-mini-loadout-inline">
                    ${makeRoleBadgeHtml()}
                    ${miniBattleIconsHtml}
                </div>
    ` : "";
    const custom = isJongmakEstherCustom();
    return `
        <div class="p-hero p-mini-hero hero-jongmak">
            <div class="p-mini-hero-row">
                <div class="p-mini-hero-left">
                    <div class="p-hero-icon p-hero-icon-sm">👑</div>
                    <span class="p-mini-hero-title">종막 EX</span>
                    <span class="p-mini-diff-badge diff-${meta.diffKey}">${diffLabel}</span>
                    <span class="p-mini-gate-badge">${meta.gateName}</span>
                    <span class="p-mini-level-badge">${level}</span>
                    <button type="button" class="jm-es-open-btn" data-jm-open-es>✦ <span class="jm-es-full">에스더 사용 입력하기</span><span class="jm-es-short">에스더</span>${custom ? '<i class="jm-es-dot" title="사용자 입력 적용 중"></i>' : ""}</button>
                </div>
                ${miniLoadoutBlock}
            </div>
        </div>
    `;
}

// 보스 정보 패널 (왼쪽 도넛: 2-1/2-2/2-3 체력 비중, 오른쪽 범례 / 상세보기: 체력 요약 + 에스더)
function makeJongmakBossInfoPanel(diffKey) {
    ensureJongmakExtraStyle();
    const data = getJongmakLive(diffKey);
    if (!data) return "";
    const isEst = data.hp3Source !== "measured";   // 하드/노말의 2-3 · 발악 체력은 나메 비율 추정
    const approx = (won) => formatEokApprox(won / 1e8);
    const sum = (key) => data.gates.reduce((a, g) => a + g[key], 0);
    const totalHp = sum("hp");
    const deduct = sum("esther") + sum("support");
    const estBadge = '<span class="jm-est">추정</span>';

    // ----- 도넛 그래프 (SVG) -----
    const R = 42;
    const C = 2 * Math.PI * R;
    const GAP = 4;
    let offset = 0;
    const arcs = data.gates.map((g, i) => {
        const ratio = g.hp / totalHp;
        const len = Math.max(C * ratio - GAP, 0);
        const arc = `<circle class="mbi-arc-g${i + 1}" cx="55" cy="55" r="${R}" fill="none" stroke="url(#jmGrad${i + 1})" stroke-width="12"
            stroke-dasharray="${len.toFixed(2)} ${(C - len).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 55 55)"/>`;
        offset += C * ratio;
        return arc;
    }).join("");

    const donut = `
        <svg class="mbi-donut" viewBox="0 0 110 110" role="img"
             aria-label="${data.gates.map(g => `${g.name} ${(g.hp / totalHp * 100).toFixed(1)}%`).join(", ")}">
            <defs>
                <linearGradient id="jmGrad1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fca5a5"/><stop offset="1" stop-color="#dc2626"/></linearGradient>
                <linearGradient id="jmGrad2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ddd6fe"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
                <linearGradient id="jmGrad3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bae6fd"/><stop offset="1" stop-color="#0284c7"/></linearGradient>
                <linearGradient id="jmGrad4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fed7aa"/><stop offset="1" stop-color="#ea580c"/></linearGradient>
            </defs>
            <circle cx="55" cy="55" r="51" fill="none" stroke="rgba(148,163,184,.14)" stroke-width="1" stroke-dasharray="2 4"/>
            <circle cx="55" cy="55" r="${R}" fill="none" stroke="#1b2033" stroke-width="12"/>
            ${arcs}
            <text class="mbi-donut-cap" x="55" y="50" text-anchor="middle">총 체력</text>
            <text class="mbi-donut-val" x="55" y="67" text-anchor="middle">${formatEokAbbrev(totalHp / 1e8)}</text>
        </svg>
    `;

    // 범례는 한 줄형(이름 ··· %)이라 3개여도 모르둠 보스정보 카드와 높이가 같음
    const legend = data.gates.map((g, i) => {
        const gm = JONGMAK_EX_GATES.find(x => x.key === g.key);
        return `
            <div class="mbi-legend-item ${jmGateCls(i)}">
                <span class="mbi-legend-name"><i class="mbi-dot ${jmGateCls(i)}"></i>${g.name}${gm.estimated && isEst ? estBadge : ""}</span>
                <b>${(g.hp / totalHp * 100).toFixed(1)}%</b>
            </div>`;
    }).join("");

    const subRow = (cls, label, value) => `
        <div class="mbi-row mbi-sub ${cls}">
            <span class="mbi-label"><span class="mbi-branch">ㄴ</span>${label}</span>
            <b>${value}</b>
        </div>`;

    const estNote = isEst
        ? "하드/노말의 2-3·발악 체력은 확인 전이라 나메 비율(2-3 전체 막대 ÷ 2-1 체력)을 적용한 임시값입니다."
        : "2-3·발악 체력은 택틱 정리 자료의 실측값(2-3 전체 막대 5조 2205억 중 2-3 70% · 발악 10%)입니다.";

    const detailOpen = jongmakDetailOpen;

    return `
        <div class="side-card mordum-boss-info-card mbi-card jm-card">
            <div class="side-label">종막 EX - ${getMordumDiffLabel(diffKey)} 보스정보</div>
            <div class="mbi-body">
                <div class="mbi-chart">${donut}</div>
                <div class="mbi-legend jm-legend">${legend}</div>
            </div>

            <button class="mbi-more-btn" id="jongmakDetailBtn" type="button">${detailOpen ? "종막 상세보기 ▲" : "종막 상세보기 ▼"}</button>

            <div class="mbi-more-content ${detailOpen ? "mbi-open" : ""}" id="jongmakDetailContent">
                <div class="mbi-lines">
                    <div class="mbi-row mbi-total">
                        <span class="mbi-label">보스 총 체력 :</span>
                        <b>${approx(totalHp)}</b>
                    </div>
                    ${subRow("g1", "2-1 체력 :", approx(data.gates[0].hp))}
                    ${subRow("g2", "2-2 체력 (본체) :", approx(data.gates[1].hp))}
                    ${subRow("g3", `2-3 체력 (막대의 70%)${isEst ? " " + estBadge : ""} :`, approx(data.gates[2].hp))}
                    ${subRow("g3 g4", `2-3 발악 체력 (막대의 10%)${isEst ? " " + estBadge : ""} :`, approx(data.gates[3].hp))}
                    ${subRow("mbi-deduct", "에스더 및 변수 차감값 :", approx(deduct))}
                    ${subRow("mbi-share", "딜러 지분체력 (합산) :", approx(sum("share")))}
                </div>

                ${makeJongmakEstherList(diffKey)}

                <div class="jm-note-box">총 체력은 실제로 깎아야 하는 구간(2-3 70% + 발악 10%)의 합이고, 2-2는 본체 기준(쉴드 제외)이에요. 서폿 딜은 차감하지 않고 에스더만 뺀 값을 요구 딜러 피해량으로 봅니다. 발악 히든 아만은 풀딜이 다 들어가기 전에 유저 딜로 체력이 먼저 깎여서, 딜량의 ${Math.round(JONGMAK_ES_EFFECT.haman3 * 1000) / 10}%만 반영했어요. ${estNote}</div>
            </div>
        </div>
    `;
}

function makeJongmakHero(meta) {
    const pills = [
        { key: "normal", text: `노말 · ${JONGMAK_EX_LEVELS.normal}` },
        { key: "hard", text: `하드 · ${JONGMAK_EX_LEVELS.hard}` },
        { key: "nightmare", text: `나메 · ${JONGMAK_EX_LEVELS.nightmare}` }
    ];
    const heroBattleIconsHtml = buildHeroBattleIconsHtml("jongmak", meta.diffKey, "gate1", currentRoleMode, meta.gateName);
    return `
        <div class="p-hero hero-jongmak">
            <div class="p-hero-inner">
                <div class="p-hero-left">
                    <div class="p-hero-copy">
                        <div class="p-hero-kicker">PRECISION · JONGMAK EX</div>
                        <div class="p-hero-title-row">
                            <div class="p-hero-icon">👑</div>
                            <div class="p-hero-title-wrap">
                                <h2 class="p-hero-title">종막 EX<span class="p-hero-member-badge">8인</span></h2>
                                <div class="p-hero-subtitle">대악마 카제로스</div>
                            </div>
                        </div>
                        <div class="p-hero-badges">
                            <span class="p-badge b-type">대악마</span>
                            <span class="p-badge b-attr">신</span>
                        </div>
                        <p class="p-hero-desc">✔️ 11/02 22:40: 퍼클 계산 기준 -> 최근 실측 계산 기준으로 데이터가 변경되었습니다.</p>
                    </div>
                    <div class="p-hero-pills">
                        ${pills.map(p => `<span class="p-pill diff-${p.key} ${meta.diffKey === p.key ? "active" : ""}">${p.text}</span>`).join("")}
                    </div>
                </div>
                <div class="p-hero-right bi-hero-items-wrap">
                    <div class="bi-hero-items-header" style="justify-content:flex-end;">
                        ${makeRoleToggleHtml("hero")}
                    </div>
                    ${heroBattleIconsHtml ? `<div class="bi-hero-items-label">추천 배틀아이템</div>` : ""}
                    ${heroBattleIconsHtml}
                </div>
            </div>
        </div>
    `;
}


// 관문별 목표 딜량 / DPS 표 (CLEAR TIME 변경 시 각 관문 시간을 같은 비율로 늘리고 줄임)



// 익스트림(모르둠/종막) 표 행: 다른 정밀계산 페이지와 같은 row-30/33/40 + damage-wrap 구조 (강투/1인분/잔혈 색상)
function getExtremeRowCls(share, shares) {
    if (Math.abs(share - shares.tank) < 0.0001) return "row-30";
    if (Math.abs(share - shares.one) < 0.0001) return "row-33";
    if (Math.abs(share - shares.blood) < 0.0001) return "row-40";
    return "";
}

function getExtremeSupportRowCls(label) {
    if (label === "gangjo") return "row-30";
    if (label === "ilinbun") return "row-33";
    if (label === "janjo") return "row-40";
    return "";
}

function makeExtremeRowHtml(shareCellHtml, cls, damageText, dpsText) {
    return `<tr class="${cls}">${shareCellHtml}<td><span class="damage-wrap"><span class="damage-num">${damageText}</span><span class="damage-unit">억</span></span></td><td class="dps-cell"><span class="dps-pill">${dpsText}억</span></td></tr>`;
}

function renderJongmakExtreme(totalSec, raidGroupHtml) {
    const meta = raidMeta.extreme.jongmak[currentCombo] || raidMeta.extreme.jongmak.hard_gate1;
    const isSupport = currentRoleMode === "support";
    const data = getJongmakLive(meta.diffKey);
    const shares = data.shares;

    const topRowBlock = `
        <div class="mordum-top-row">
            <div class="mordum-controls-col">
                <div class="precision-control compact-precision-control mordum-ex-controls">
                    ${raidGroupHtml}
                    ${makeExtremeDiffGroupHtml(meta, JONGMAK_EX_LEVELS)}
                </div>
            </div>
            ${makeJongmakBossInfoPanel(meta.diffKey)}
        </div>
    `;

    const shareList = [10, 11, 12, 13, 14, 15, 16, shares.one, 17, 18, 19, 20, 21, 22, 23, 24, 25]
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .sort((a, b) => a - b);
    const rows = shareList.map(s => ({ share: s, damage: data.effectiveDamage * s / 100 }));

    let rowTank, rowOne, rowBlood, tableRowsHtml;
    if (isSupport) {
        const conv = computeSupportConversion(rows, shares, (row) => row.damage);
        rowTank = conv.anchors.gangjo;
        rowOne = conv.anchors.ilinbun;
        rowBlood = conv.anchors.janjo;
        tableRowsHtml = conv.rows.length
            ? conv.rows.map(r => {
                const dps = floorTo1(r.damage / totalSec).toFixed(1);
                return makeExtremeRowHtml(renderSupportShareCell(r), getExtremeSupportRowCls(r.label), fmt(r.damage), dps);
            }).join("")
            : '<tr><td colspan="3">데이터 없음</td></tr>';
    } else {
        rowTank = rows.find(r => Math.abs(r.share - shares.tank) < 0.0001);
        rowOne = rows.find(r => Math.abs(r.share - shares.one) < 0.0001);
        rowBlood = rows.find(r => Math.abs(r.share - shares.blood) < 0.0001);
        tableRowsHtml = rows.map(r => {
            const dmg = Math.floor(r.damage);
            const dps = floorTo1(r.damage / totalSec).toFixed(1);
            return makeExtremeRowHtml(renderShareCell(r.share, "jongmak"), getExtremeRowCls(r.share, shares), fmt(dmg), dps);
        }).join("");
    }

    const summaryMeta = { title: `${getMordumDiffLabel(meta.diffKey)}`, gateName: meta.gateName, diffKey: meta.diffKey };

    setMainContentWithAdPreservation(
        makeJongmakHero(meta),
        makeJongmakMiniHero(meta),
        `
        ${topRowBlock}
        ${buildSummaryAndDetailHtml("jongmak", "gate1", "종막 EX", summaryMeta, tableRowsHtml, totalSec, rowTank, rowOne, rowBlood, (row) => row.damage, isSupport)}
        `
    );

    bindExtremeTabs();
    bindJongmakDetailToggle();
    bindRaidBattleItemIcons();
    positionPrecisionSwitchThumbs();
    syncJongmakEsPopup();
}

export function renderExtremeSection(totalSec) {
    document.getElementById("contentTitle").textContent = "";
    document.getElementById("tableTitle").textContent = "";
    document.getElementById("titleMeta").innerHTML = "";

    // ===== 모르둠 EX (현재 유일하게 활성화된 레이드) =====
    const meta = raidMeta.extreme.mordum[currentCombo] || raidMeta.extreme.mordum.hard_gate1;
    const isSupport = currentRoleMode === "support";

    // 레이드 선택 - 벨가르딘 "관문 선택"과 같은 슬라이딩 스위치 UI
    const raidGroupHtml = `
        <div class="precision-inline-group">
            <div class="precision-control-label">레이드 선택</div>
            <div class="precision-gate-inline" id="precisionGateInline">
                <div class="precision-switch-thumb precision-gate-thumb" id="precisionGateThumb"></div>

                <div class="precision-gate-chip ${currentExtremeRaid === "mordum" ? "active" : ""}" data-extreme-raid="mordum">
                    <div class="precision-gate-chip-content">
                        <div class="precision-gate-chip-line">
                            <span class="precision-gate-chip-gate">모르둠</span>
                            <span class="precision-gate-chip-boss">EX</span>
                        </div>
                        <div class="precision-gate-chip-badges">
                            ${makeBadge(meta.type.text, meta.type.cls)}
                            ${makeBadge(meta.attr.text, meta.attr.cls)}
                        </div>
                    </div>
                </div>

                <div class="precision-gate-chip ${currentExtremeRaid === "jongmak" ? "active" : ""}" data-extreme-raid="jongmak">
                    <div class="precision-gate-chip-content">
                        <div class="precision-gate-chip-line">
                            <span class="precision-gate-chip-gate">종막</span>
                            <span class="precision-gate-chip-boss">EX</span>
                        </div>
                        <div class="precision-gate-chip-badges">
                            ${makeBadge("대악마", "type-archdemon")}
                            ${makeBadge("신", "type-divine")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // ===== 종막 EX =====
    if (currentExtremeRaid === "jongmak") {
        renderJongmakExtreme(totalSec, raidGroupHtml);
        return;
    }

    // 난이도 선택 - 벨가르딘과 같은 슬라이딩 스위치 UI (노말=초록 · 하드=골드 · 나메=보라)
    const diffGroups = [
        { diffKey: "normal", label: "노말", level: "1730", cls: "pd-green" },
        { diffKey: "hard", label: "하드", level: "1770", cls: "pd-gold" },
        { diffKey: "nightmare", label: "나메", level: "1780", cls: "pd-purple" }
    ];
    const activeDiffGroup = diffGroups.find(g => g.diffKey === meta.diffKey) || diffGroups[1];

    const diffGroupHtml = `
        <div class="precision-inline-group">
            <div class="precision-control-label">난이도 선택</div>
            <div class="precision-diff-inline" id="precisionDiffInline">
                <div class="precision-switch-thumb precision-diff-thumb ${activeDiffGroup.cls}" id="precisionDiffThumb"></div>
                ${diffGroups.map(g => {
                    const isActive = meta.diffKey === g.diffKey;
                    return `
                        <div class="precision-diff-chip ${isActive ? `${g.cls} active` : ""}" data-extreme-diff="${g.diffKey}">
                            <span class="precision-diff-chip-main">${g.label}</span>
                            <span class="precision-diff-chip-sub">${g.level}</span>
                        </div>
                    `;
                }).join("")}
            </div>
        </div>
    `;

    // 벨가르딘처럼 레이드/난이도 선택을 한 카드로 묶고 폭을 넓힘 (오른쪽은 보스 정보)
    const topRowBlock = `
        <div class="mordum-top-row">
            <div class="mordum-controls-col">
                <div class="precision-control compact-precision-control mordum-ex-controls">
                    ${raidGroupHtml}
                    ${diffGroupHtml}
                </div>
            </div>
            ${makeMordumBossInfoPanel(meta.diffKey)}
        </div>
    `;

    const data = MORDUM_EX_DATA[meta.diffKey];
    const shares = data.shares;
    const shareList = [10, 11, 12, 13, 14, 15, 16, shares.one, 17, 18, 19, 20, 21, 22, 23, 24, 25]
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .sort((a, b) => a - b);

    const rows = shareList.map(s => ({ share: s, damage: data.effectiveDamage * s / 100 }));

    let rowTank, rowOne, rowBlood, effectiveGetDamage, tableRowsHtml;

    if (isSupport) {
        // 서폿 강조컷 / 1인분 / 잔조컷 = 딜러 강투컷 / 1인분 / 잔혈컷 지분 x1.25 (벨가르딘과 동일한 환산)
        const supportConv = computeSupportConversion(rows, shares, (row) => row.damage);
        rowTank = supportConv.anchors.gangjo;
        rowOne = supportConv.anchors.ilinbun;
        rowBlood = supportConv.anchors.janjo;
        effectiveGetDamage = (row) => row.damage;

        tableRowsHtml = supportConv.rows.length
            ? supportConv.rows.map(r => {
                const dps = floorTo1(r.damage / totalSec).toFixed(1);
                return makeExtremeRowHtml(renderSupportShareCell(r), getExtremeSupportRowCls(r.label), fmt(r.damage), dps);
            }).join("")
            : '<tr><td colspan="3">데이터 없음</td></tr>';
    } else {
        rowTank = rows.find(r => Math.abs(r.share - shares.tank) < 0.0001);
        rowOne = rows.find(r => Math.abs(r.share - shares.one) < 0.0001);
        rowBlood = rows.find(r => Math.abs(r.share - shares.blood) < 0.0001);
        effectiveGetDamage = (row) => row.damage;

        tableRowsHtml = rows.map(r => {
            const dmg = Math.floor(r.damage);
            const dps = floorTo1(r.damage / totalSec).toFixed(1);
            return makeExtremeRowHtml(renderShareCell(r.share, "mordum"), getExtremeRowCls(r.share, shares), fmt(dmg), dps);
        }).join("");
    }

    setMainContentWithAdPreservation(
        makeRaidPrecisionHero("mordum", meta, meta.diffKey),
        makeRaidMiniHero("mordum", meta),
        `
        ${topRowBlock}
        ${buildSummaryAndDetailHtml("mordum", "gate1", "모르둠 EX", meta, tableRowsHtml, totalSec, rowTank, rowOne, rowBlood, effectiveGetDamage, isSupport)}
        `
    );

    bindExtremeTabs();
    bindMordumDetailToggle();
    bindRaidBattleItemIcons();
    positionPrecisionSwitchThumbs();
}

/* =============================================
   모르둠 나메 에스더 택틱 툴팁 (배지 옆 "i" 아이콘 hover/click)
   ============================================= */
const MORDUM_TACTIC_TOOLTIP_HTML = `
    <div class="rt-title">⚡ 초고점 바훈 택틱 (10/19)</div>
    <div class="rt-line">기존보다 <strong class="rt-green">더 낮은 DPS 컷</strong>으로도 클리어할 수 있도록 구간별 에스더 사용을 다시 짠 택틱입니다.</div>
    <div class="rt-divider"></div>
    <div class="rt-row"><span class="rt-tag rt-tag-blue">500~425줄</span><span>바훈 3+1 (무력 추뎀)</span></div>
    <div class="rt-row"><span class="rt-tag rt-tag-orange">390~325줄</span><span>바스티안 3칸</span></div>
    <div class="rt-row"><span class="rt-tag rt-tag-blue">250~200줄</span><span>바훈 3+1 (무력 추뎀)</span></div>
    <div class="rt-row"><span class="rt-tag rt-tag-blue">159~100줄</span><span>바훈 3+1 (무력 추뎀)</span></div>
    <div class="rt-row"><span class="rt-tag rt-tag-purple">50~0줄</span><span>히든바훈 3칸</span></div>
    <div class="rt-row"><span class="rt-tag rt-tag-orange">발악쉴드</span><span>바스티안 3+1 (쉴드 추뎀)</span></div>
    <div class="rt-divider"></div>
    <div class="rt-note">※ 구간별 딜지분 탭에 이 택틱 기준 피해량 / DPS가 반영되어 있습니다.</div>
`;

let sharedMordumTacticTooltipEl = null;

function ensureSharedMordumTacticTooltip() {
    if (sharedMordumTacticTooltipEl) return sharedMordumTacticTooltipEl;
    const el = document.createElement("div");
    el.className = "role-shared-tooltip mordum-tactic-tooltip";
    el.innerHTML = MORDUM_TACTIC_TOOLTIP_HTML;
    document.body.appendChild(el);
    sharedMordumTacticTooltipEl = el;
    return el;
}

function showSharedMordumTacticTooltip(anchorEl) {
    const tip = ensureSharedMordumTacticTooltip();
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

function hideSharedMordumTacticTooltip() {
    if (sharedMordumTacticTooltipEl) sharedMordumTacticTooltipEl.classList.remove("show");
}

// [분리] index.js 최상위에서 실행되던 이벤트 바인딩. index.js가 원래 위치에서 호출합니다.
export function initMordumTacticTooltip() {
    document.addEventListener("mouseover", (e) => {
        const trigger = e.target.closest(".mordum-tactic-tip");
        if (trigger) showSharedMordumTacticTooltip(trigger);
    });
    document.addEventListener("mouseout", (e) => {
        const trigger = e.target.closest(".mordum-tactic-tip");
        if (trigger && !trigger.contains(e.relatedTarget)) hideSharedMordumTacticTooltip();
    });
    document.addEventListener("focusin", (e) => {
        const trigger = e.target.closest(".mordum-tactic-tip");
        if (trigger) showSharedMordumTacticTooltip(trigger);
    });
    document.addEventListener("focusout", (e) => {
        const trigger = e.target.closest(".mordum-tactic-tip");
        if (trigger) hideSharedMordumTacticTooltip();
    });
    document.addEventListener("click", (e) => {
        const trigger = e.target.closest(".mordum-tactic-tip");
        if (trigger) {
            e.preventDefault();
            e.stopPropagation();

            if (sharedMordumTacticTooltipEl && sharedMordumTacticTooltipEl.classList.contains("show")) {
                hideSharedMordumTacticTooltip();
            } else {
                showSharedMordumTacticTooltip(trigger);
            }
        } else {
            hideSharedMordumTacticTooltip();
        }
    }, true);
    window.addEventListener("scroll", hideSharedMordumTacticTooltip, true);
    window.addEventListener("resize", hideSharedMordumTacticTooltip);
}
