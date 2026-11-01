/* =============================================
   data.js — 정적 데이터 (구글시트 연동 없는 하드코딩 값 / 레이드 메타 / 보상 / 딜컷 설정)
   index.js 에서 분리됨. 로직 없이 데이터만 두는 파일입니다.
   ============================================= */

/* =============================================
   레이드 메타 정보
   ============================================= */
export const raidMeta = {
    serka: {
        normal_gate1: {
            diffKey: "normal", gateKey: "gate1",
            title: "노말 (1710)", gateName: "1관",
            type: { text: "인간", cls: "type-human" },
            attr: { text: "속성 없음", cls: "attr-none" }
        },
        normal_gate2: {
            diffKey: "normal", gateKey: "gate2",
            title: "노말 (1710)", gateName: "2관",
            type: { text: "고대", cls: "type-ancient" },
            attr: { text: "성속성 취약", cls: "attr-holy" }
        },
        hard_gate1: {
            diffKey: "hard", gateKey: "gate1",
            title: "하드 (1730)", gateName: "1관",
            type: { text: "인간", cls: "type-human" },
            attr: { text: "속성 없음", cls: "attr-none" }
        },
        hard_gate2: {
            diffKey: "hard", gateKey: "gate2",
            title: "하드 (1730)", gateName: "2관",
            type: { text: "고대", cls: "type-ancient" },
            attr: { text: "성속성 취약", cls: "attr-holy" }
        },
        nightmare_gate1: {
            diffKey: "nightmare", gateKey: "gate1",
            title: "나메 (1740)", gateName: "1관",
            type: { text: "인간", cls: "type-human" },
            attr: { text: "속성 없음", cls: "attr-none" }
        },
        nightmare_gate2: {
            diffKey: "nightmare", gateKey: "gate2",
            title: "나메 (1740)", gateName: "2관",
            type: { text: "고대", cls: "type-ancient" },
            attr: { text: "성속성 취약", cls: "attr-holy" }
        }
    },
    cathedral: {
        normal_gate1: {
            diffKey: "normal", gateKey: "gate1",
            title: "1단계 (1700)", gateName: "1관",
            type: { text: "인간", cls: "type-human" },
            attr: { text: "암속성 취약", cls: "attr-dark" }
        },
        normal_gate2: {
            diffKey: "normal", gateKey: "gate2",
            title: "1단계 (1700)", gateName: "2관",
            type: { text: "인간", cls: "type-human" },
            attr: { text: "암속성 취약", cls: "attr-dark" }
        },
        hard_gate1: {
            diffKey: "hard", gateKey: "gate1",
            title: "2단계 (1720)", gateName: "1관",
            type: { text: "인간", cls: "type-human" },
            attr: { text: "암속성 취약", cls: "attr-dark" }
        },
        hard_gate2: {
            diffKey: "hard", gateKey: "gate2",
            title: "2단계 (1720)", gateName: "2관",
            type: { text: "인간", cls: "type-human" },
            attr: { text: "암속성 취약", cls: "attr-dark" }
        },
        nightmare_gate1: {
            diffKey: "nightmare", gateKey: "gate1",
            title: "3단계 (1750)", gateName: "1관",
            type: { text: "인간", cls: "type-human" },
            attr: { text: "암속성 취약", cls: "attr-dark" }
        },
        nightmare_gate2: {
            diffKey: "nightmare", gateKey: "gate2",
            title: "3단계 (1750)", gateName: "2관",
            type: { text: "인간", cls: "type-human" },
            attr: { text: "암속성 취약", cls: "attr-dark" }
        }
    },
    belgardin: {
        normal_gate1: {
            diffKey: "normal", gateKey: "gate1",
            title: "노말 (1750)", gateName: "1관",
            type: { text: "인간", cls: "type-human" },
            attr: { text: "성속성 취약", cls: "attr-holy" }
        },
        normal_gate2: {
            diffKey: "normal", gateKey: "gate2",
            title: "노말 (1750)", gateName: "2관",
            type: { text: "고대", cls: "type-ancient" },
            attr: { text: "성속성 취약", cls: "attr-holy" }
        },
        hard_gate1: {
            diffKey: "hard", gateKey: "gate1",
            title: "하드 (1770)", gateName: "1관",
            type: { text: "인간", cls: "type-human" },
            attr: { text: "성속성 취약", cls: "attr-holy" }
        },
        hard_gate2: {
            diffKey: "hard", gateKey: "gate2",
            title: "하드 (1770)", gateName: "2관",
            type: { text: "고대", cls: "type-ancient" },
            attr: { text: "성속성 취약", cls: "attr-holy" }
        },
        nightmare_gate1: {
            diffKey: "nightmare", gateKey: "gate1",
            title: "나메 (1780)", gateName: "1관",
            type: { text: "인간", cls: "type-human" },
            attr: { text: "성속성 취약", cls: "attr-holy" }
        },
        nightmare_gate2: {
            diffKey: "nightmare", gateKey: "gate2",
            title: "나메 (1780)", gateName: "2관",
            type: { text: "고대", cls: "type-ancient" },
            attr: { text: "성속성 취약", cls: "attr-holy" }
        }
    },
    extreme: {
        mordum: {
            normal_gate1: {
                diffKey: "normal", gateKey: "gate1",
                title: "노말 (1730)", gateName: "1관",
                type: { text: "고대", cls: "type-ancient" },
                attr: { text: "토속성 취약", cls: "attr-earth" },
                phase2: { type: { text: "정령", cls: "type-spirit" }, attr: { text: "속성 없음", cls: "attr-none" } },
                ready: true
            },
            hard_gate1: {
                diffKey: "hard", gateKey: "gate1",
                title: "하드 (1770)", gateName: "1관",
                type: { text: "고대", cls: "type-ancient" },
                attr: { text: "토속성 취약", cls: "attr-earth" },
                phase2: { type: { text: "정령", cls: "type-spirit" }, attr: { text: "속성 없음", cls: "attr-none" } },
                ready: true
            },
            nightmare_gate1: {
                diffKey: "nightmare", gateKey: "gate1",
                title: "나메 (1780)", gateName: "1관",
                type: { text: "고대", cls: "type-ancient" },
                attr: { text: "토속성 취약", cls: "attr-earth" },
                phase2: { type: { text: "정령", cls: "type-spirit" }, attr: { text: "속성 없음", cls: "attr-none" } },
                ready: true
            }
        },
        // 종막 EX: 2-1 / 2-2 / 2-3 세 관문을 한 페이지에서 합산 (JONGMAK_EX_DATA 참고)
        jongmak: {
            normal_gate1: {
                diffKey: "normal", gateKey: "gate1",
                title: "노말", gateName: "1관",
                type: { text: "대악마", cls: "type-archdemon" },
                attr: { text: "속성 없음", cls: "attr-none" },
                ready: true
            },
            hard_gate1: {
                diffKey: "hard", gateKey: "gate1",
                title: "하드", gateName: "1관",
                type: { text: "대악마", cls: "type-archdemon" },
                attr: { text: "속성 없음", cls: "attr-none" },
                ready: true
            },
            nightmare_gate1: {
                diffKey: "nightmare", gateKey: "gate1",
                title: "나메", gateName: "1관",
                type: { text: "대악마", cls: "type-archdemon" },
                attr: { text: "속성 없음", cls: "attr-none" },
                ready: true
            }
        }
    }
};

/* =============================================
   모르둠 EX 하드코딩 데이터 (구글시트 연동 없음)
   - 딜러 6인 기준 실효 딜량(100% 풀) 및 강투/1인분/잔혈 지분 anchor
   - 단위: 억 (원 단위 raw 값을 1e8로 나눠서 저장)
   - 나이트메어만 확정, 노말/하드는 추후 확정되면 추가
   ============================================= */
export const MORDUM_EX_DATA = {
    normal: {
        totalSec: 1320,
        effectiveDamage: 23523.07052353, // 딜러6인 실효 딜량 100% 풀 (억) = 총 체력 - 에스더 - 서폿
        shares: { tank: 15, one: 16.6, blood: 20 }
    },
    hard: {
        totalSec: 1320,
        effectiveDamage: 57077.18898577,
        shares: { tank: 15, one: 16.6, blood: 20 }
    },
    nightmare: {
        totalSec: 1320, // 22분 (1구간 20분 + 2구간 발악쉴드 2분)
        effectiveDamage: 150033.02891058, // 딜러6인 실효 딜량 100% 풀 (억) = 총 체력 - 에스더 - 서폿
        shares: { tank: 15, one: 16.6, blood: 20 }
    }
};

// 보스 정보 패널용 요약 데이터 (단위: 억). player = 딜러 몫(실효딜량), esther+support = 자동 차감분
// 2026-09-25 체력 DB 수정본 반영 (나메 발악 쉴드 체력 오류 수정, 하드/노말도 소폭 보정)
// 나메: 보스 기본체력 8% 하향 반영 (1페이즈 체력 157,564.18837755억 확정값 / 발악쉴드·에스더 딜량 동일 비율, 시간·서폿 딜은 기존 유지)
export const MORDUM_BOSS_INFO = {
    normal:    { totalHp: 25712.72052353,  shieldHp: 1740.54744791,  estherTotal: 2107.15,  supportTotal: 82.5,  player: 23523.07052353 },
    hard:      { totalHp: 64599.72898577,  shieldHp: 4362.84623604,  estherTotal: 7385.04,  supportTotal: 137.5, player: 57077.18898577 },
    nightmare: { totalHp: 171650.24891058, shieldHp: 14086.06053303, estherTotal: 21397.22, supportTotal: 220.0, player: 150033.02891058 }
};

/* =============================================
   종막 EX (카제로스 레이드 종막 EX) 하드코딩 데이터 (구글시트 연동 없음)
   - 구조: 2-1 / 2-2(본체+쉴드 합산) / 2-3 세 관문의 '딜러 지분체력'을 구역별로 계산해 합산
   - 지분체력 = 보스 체력 - 에스더 총데미지 - 서폿 2명 총딜(초당 딜 x 구역 제한시간)
   - 에스더 데미지 = (나메 기준 고정 비율) x 각 난이도 2-1 체력  (난이도마다 자기 2-1 체력을 곱함)
   - 2-3 체력은 인게임에 표시되지 않아 '추정값' (나메: 클리어 시 21% 소모 기록으로 역산,
     하드/노말: 나메의 (2-3 / 2-1) 체력 비율을 임시 적용)
   - 단위: 계산은 원 단위, 외부로는 억(1e8)으로 변환해서 사용
   ============================================= */
export const JONGMAK_EX_LEVELS = { normal: "1730", hard: "1770", nightmare: "1780" }; // 모르둠 EX와 동일
const JONGMAK_EX_TOTAL_SEC = 2007; // 2-1 1000초 + 2-2 565초 + 2-3 442초

export const JONGMAK_EX_GATES = [
    { key: "g1", name: "2-1", sec: 1000, estherPct: 8.881, estherDesc: "히든 카단 3칸 + 카단 3칸 + 카단 1칸", type: { text: "대악마", cls: "type-archdemon" } },
    { key: "g2", name: "2-2", sec: 565,  estherPct: 3.011, estherDesc: "공아만 3칸 + 1칸",                    type: { text: "신", cls: "type-divine" } },
    { key: "g3", name: "2-3", sec: 442,  estherPct: 7.703, estherDesc: "공아만 3칸 / 3+1칸 / 3+1칸",          type: { text: "신", cls: "type-divine" }, estimated: true }
];

// supportPerSec: 서폿 2명 합산 초당 딜(원) - 나메 500만 / 하드 400만 / 노말 300만 (1인 기준, 사용자 지정 가정)
export const JONGMAK_EX_BASE = {
    nightmare: { hp1: 11124200336247, hp2: 5794751037908, shield2: 75331760729, supportPerSec: 10000000 },
    hard:      { hp1: 3955211667283,  hp2: 2223536657594, shield2: 28985975488, supportPerSec: 8000000 },
    normal:    { hp1: 1422084129012,  hp2: 874417129704,  shield2: 11367422269, supportPerSec: 6000000 }
};

// 나메 2-3 추정 근거: 클리어 시 4,182,178,322,107 딜러 피해량 = 전체 지분체력의 21%
const JONGMAK_EX_NM_CLEAR_DAMAGE = 4182178322107;
const JONGMAK_EX_NM_CLEAR_PCT = 0.21;

export const JONGMAK_EX_DATA = (() => {
    const gateCalc = (base, g, hp) => {
        const esther = base.hp1 * g.estherPct / 100;
        const support = base.supportPerSec * g.sec;
        return { key: g.key, name: g.name, sec: g.sec, hp, esther, support, share: hp - esther - support };
    };

    const nm = JONGMAK_EX_BASE.nightmare;
    const nm1 = gateCalc(nm, JONGMAK_EX_GATES[0], nm.hp1);
    const nm2 = gateCalc(nm, JONGMAK_EX_GATES[1], nm.hp2 + nm.shield2);
    const nmTotalShare = JONGMAK_EX_NM_CLEAR_DAMAGE / JONGMAK_EX_NM_CLEAR_PCT;
    const nm3Share = nmTotalShare - nm1.share - nm2.share;
    const nm3Hp = nm3Share + nm.hp1 * JONGMAK_EX_GATES[2].estherPct / 100 + nm.supportPerSec * JONGMAK_EX_GATES[2].sec;
    const hp3Ratio = nm3Hp / nm.hp1; // 하드/노말 임시 추정용 (2-3 체력 / 2-1 체력)

    const out = {};
    Object.keys(JONGMAK_EX_BASE).forEach(diff => {
        const b = JONGMAK_EX_BASE[diff];
        const hps = [b.hp1, b.hp2 + b.shield2, diff === "nightmare" ? nm3Hp : b.hp1 * hp3Ratio];
        const gates = JONGMAK_EX_GATES.map((g, i) => gateCalc(b, g, hps[i]));
        const totalShareWon = gates.reduce((a, g) => a + g.share, 0);
        out[diff] = {
            gates,
            totalSec: JONGMAK_EX_TOTAL_SEC,
            effectiveDamage: totalShareWon / 1e8, // 딜러 6인 실효 딜량 100% 풀 (억)
            hp3Source: diff === "nightmare" ? "clear-record" : "nightmare-ratio",
            shares: { tank: 15, one: 16.6, blood: 20 }
        };
    });
    return out;
})();

/* =============================================
   종막 에스더 스킬 / 사용 입력 (사용자가 팝업에서 직접 입력)
   - pct: 2-1 체력 대비 고정 비율 (에스더 딜량 = pct x 각 난이도 2-1 체력)
   - JONGMAK_ESTHER_GATE_LIST: 팝업 목록 / 상세보기 표시 순서
   - JONGMAK_ESTHER_DEFAULT_USE: 기본값 = 기존 계산 가정 (2-1 8.881% / 2-2 3.011% / 2-3 7.703%)
   ============================================= */
export const JONGMAK_ESTHER_SKILLS = {
    // 카단 = 빨강 / 샨디 = 파랑 / 아만 = 보라. 같은 계열은 3칸 > 1칸 순으로 밝게, 히든은 채도 높게
    kadan3:  { id: "kadan3",  name: "카단 3칸",      cells: 3, pct: 1.825, tone: "248,113,113" },
    kadan1:  { id: "kadan1",  name: "카단 1칸",      cells: 1, pct: 1.429, tone: "252,165,165" },
    hkadan3: { id: "hkadan3", name: "히든 카단 3칸", cells: 3, pct: 5.627, tone: "244,63,94" },
    shandi3: { id: "shandi3", name: "샨디 3칸",      cells: 3, pct: 1.501, tone: "96,165,250" },
    shandi1: { id: "shandi1", name: "샨디 1칸",      cells: 1, pct: 0.225, tone: "147,197,253" },
    aman3:   { id: "aman3",   name: "공아만 3칸",    cells: 3, pct: 1.681, tone: "167,139,250" },
    aman1:   { id: "aman1",   name: "공아만 1칸",    cells: 1, pct: 1.330, tone: "196,181,253" },
    haman3:  { id: "haman3",  name: "히든 아만 3칸", cells: 3, pct: 3.397, tone: "232,121,249" }
};
export const JONGMAK_ESTHER_GATE_LIST = {
    g1: ["kadan3", "kadan1", "hkadan3", "shandi3", "shandi1"],
    g2: ["aman3", "aman1"],
    g3: ["aman3", "aman1", "haman3"]
};
export const JONGMAK_ESTHER_DEFAULT_USE = {
    g1: ["kadan3", "kadan1", "hkadan3"],
    g2: ["aman3", "aman1"],
    g3: ["aman3", "aman3", "aman1", "aman3", "aman1"]   // 공아만 3 / 3+1 / 3+1
};
export const JONGMAK_ESTHER_MAX_PER_GATE = 12;
// 체력 줄 수 기준: 2-1 = 999줄(전체 체력), 2-2 = 777줄(쉴드 제외 본체), 2-3 = 미확인
export const JONGMAK_GATE_LINES = { g1: 999, g2: 777, g3: null };
export const JONGMAK_ES_STORE_KEY = "loaview.jongmak.esther.v1";

/* =============================================
   모르둠 에스더 스킬 피해량 (원 단위, 제거 체력은 1페이즈 500줄 기준)
   dmg 배열 순서: [나메(EX), 하드, 노말]
   ============================================= */
export const MORDUM_ESTHER_DIFF_INDEX = { nightmare: 0, hard: 1, normal: 2 };
export const MORDUM_ESTHER_GROUPS = [
    {
        key: "shandi", name: "샨디", symbol: "❖", tone: "244,114,182",
        skills: [
            { name: "샨디 3칸", cells: 3, pct: 1.63, lines: 8.15, tone: "244,114,182", dmg: [256829627055, 98186118882, 39074642113] },
            { name: "샨디 1칸", cells: 1, pct: 1.31, lines: 6.55, tone: "251,113,133", dmg: [206409086775, 78910316402, 31403546729] }
        ]
    },
    {
        key: "vahun", name: "바훈", symbol: "◈", tone: "56,189,248",
        skills: [
            { name: "바훈 3칸", cells: 3, pct: 1.10, lines: 5.50, tone: "56,189,248", dmg: [173320607215, 66260571025, 26369390383] },
            { name: "바훈 1칸", cells: 1, pct: 1.00, lines: 5.00, tone: "96,165,250", dmg: [157564188378, 60236882750, 23972173076] },
            { name: "바훈 1칸 (무력 추뎀)", cells: 1, pct: 2.02, lines: 10.10, tone: "34,211,238", dmg: [318279660523, 121678503154, 48423789613] },
            { name: "히든바훈 3칸", cells: 3, pct: 4.05, lines: 20.25, tone: "167,139,250", dmg: [638134962929, 243959375136, 97087300956] }
        ]
    },
    {
        key: "bastian", name: "바스티안", symbol: "✦", tone: "251,146,60",
        skills: [
            { name: "바스티안 3칸", cells: 3, pct: 1.32, lines: 6.60, tone: "251,146,60", dmg: [207984728658, 79512685230, 31643268460] },
            { name: "바스티안 1칸", cells: 1, pct: 1.05, lines: 5.25, tone: "251,191,36", dmg: [165442397796, 63248726887, 25170781729] },
            { name: "바스티안 1칸 (쉴드 추뎀)", cells: 1, pct: 2.10, lines: 10.50, tone: "250,204,21", dmg: [330884795593, 126497453774, 50341563459] }
        ]
    }
];


// fixed: 항상 표시되는 고정 아이템 이름
// choiceGroups: 선택형 그룹들. 그룹마다 [옵션 이름 배열]이며, 첫 번째 옵션이 기본 선택값.
// 지금은 노말/하드/나메가 전부 같은 로드아웃이라 gate 단위로만 저장하고,
// 나중에 난이도별로 값이 달라지면 diffKey를 써서 분기하면 됨(아래 getRaidBattleLoadout 참고).


export const RAID_BATTLE_ITEMS = {
    serka: {
        gate1: {
            dealer: {
                fixed: ["정령의 회복약", "아드로핀 물약", "암흑 수류탄", "성스러운 부적"],
                choiceGroups: []
            },
            support: {
                fixed: ["정령의 회복약", "각성 물약", "암흑 수류탄", "성스러운 부적"],
                choiceGroups: []
            }
        },
        gate2: {
            dealer: {
                fixed: ["정령의 회복약", "아드로핀 물약", "암흑 수류탄"],
                choiceGroups: [["코르부스 툴 라크의 그림자", "파괴 폭탄"]]
            },
            support: {
                fixed: ["정령의 회복약", "각성 물약", "암흑 수류탄"],
                choiceGroups: [["코르부스 툴 라크의 그림자", "파괴 폭탄", "부식 폭탄"]]
            }
        }
    },
    cathedral: {
        gate1: {
            dealer: {
                fixed: ["정령의 회복약", "아드로핀 물약", "암흑 수류탄"],
                choiceGroups: [["빛나는 성스러운 부적", "성스러운 부적"]]
            },
            support: {
                fixed: ["정령의 회복약", "암흑 수류탄", "각성 물약"],
                choiceGroups: [["빛나는 성스러운 부적", "성스러운 부적"]]
            }
        },
        gate2: {
            dealer: {
                fixed: ["정령의 회복약", "아드로핀 물약", "암흑 수류탄", "파괴 폭탄"],
                choiceGroups: []
            },
            support: {
                fixed: ["정령의 회복약", "각성 물약", "암흑 수류탄", "파괴 폭탄"],
                choiceGroups: []
            }
        }
    },
    belgardin: {
        gate1: {
            dealer: {
                fixed: ["정령의 회복약", "아드로핀 물약", "암흑 수류탄", "페투스 안 크라그마의 그림자"],
                choiceGroups: []
            },
            support: {
                fixed: ["정령의 회복약", "각성 물약" , "암흑 수류탄"],
                choiceGroups: [["빛나는 성스러운 부적", "코르부스 툴 라크의 그림자"]]
            }
        },
        gate2: {
            dealer: {
                fixed: ["정령의 회복약", "아드로핀 물약", "암흑 수류탄"],
                choiceGroups: [["페투스 안 크라그마의 그림자", "코르부스 툴 라크의 그림자"]]
            },
            support: {
                fixed: ["정령의 회복약", "각성 물약", "암흑 수류탄"],
                choiceGroups: [["코르부스 툴 라크의 그림자", "페투스 안 크라그마의 그림자"]]
            }
        }
    },
    jongmak: {
        gate1: {
            dealer: {
                fixed: ["빛나는 정령의 회복약", "빛나는 암흑 수류탄", "빛나는 성스러운 폭탄", "시간 정지 물약"],
                choiceGroups: []
            },
            support: {
                fixed: ["빛나는 정령의 회복약", "빛나는 암흑 수류탄", "빛나는 성스러운 폭탄", "시간 정지 물약"],
                choiceGroups: []
            }
        }
    },
    mordum: {
        gate1: {
            dealer: {
                fixed: ["정령의 회복약", "아드로핀 물약", "암흑 수류탄"],
                choiceGroups: [["성스러운 부적", "파괴 폭탄"]]
            },
            support: {
                fixed: ["정령의 회복약", "암흑 수류탄", "부식 폭탄"],
                choiceGroups: [["성스러운 부적", "각성 물약"]]
            }
        }
    }
};


/* =============================================
   간편보기 기본 데이터
   ============================================= */
export const simpleData = {
    1710: {
        sectionTitle: "1710 레이드",
        intro: "<i>해당 레벨대에 입장할수있는 레이드를 나열하였습니다.</i>",
        cards: [
            {
                theme: "b-green", title: "종막 노말", node: "1710",
                rows: [
                    { gate: "1관", boss: "카제로스", badges: [{ text: "대악마", cls: "type-archdemon" }], range: "1190 - 1590" },
                    { gate: "2관", boss: "카제로스", badges: [{ text: "대악마", cls: "type-archdemon" }], range: "1050 - 1400" }
                ],
                gold: "32,000", bindGold: "16,000", total: "48,000"
            },
            {
                theme: "b-green", title: "세르카 노말", node: "1710",
                rows: [
                    { gate: "1관", boss: "세르카", badges: [{ text: "인간", cls: "type-human" }], range: "1100 - 1480" },
                    { gate: "2관", boss: "코르부스", badges: [{ text: "고대", cls: "type-ancient" }, { text: "성속성 취약", cls: "attr-holy" }], range: "1430 - 1900" }
                ],
                gold: "32,000", bindGold: "16,000", total: "48,000"
            },
            {
                theme: "b-green", title: "4막 노말", node: "1700",
                rows: [
                    { gate: "1관", boss: "에키드나", badges: [{ text: "악마", cls: "type-demon" }], range: "740 - 990" },
                    { gate: "2관", boss: "아르모체", badges: [{ text: "고대", cls: "type-ancient" }, { text: "화속성 취약", cls: "attr-fire" }], range: "950 - 1270" }
                ],
                gold: "27,000", bindGold: "13,500", total: "40,500"
            },
            {
                theme: "b-gray", title: "성당 1단계", node: "1700",
                rows: [
                    { gate: "1관", boss: "대주교", badges: [{ text: "인간", cls: "type-human" }, { text: "암속성 취약", cls: "attr-dark" }], range: "994 - 1326" },
                    { gate: "2관", boss: "광신의 인도자", badges: [{ text: "인간", cls: "type-human" }, { text: "암속성 취약", cls: "attr-dark" }], range: "937 - 1250" }
                ],
                gold: "", bindGold: "30,000", total: ""
            }
        ]
    },

    1720: {
        sectionTitle: "1720 레이드",
        intro: "<i>해당 레벨대에 입장할수있는 레이드를 나열하였습니다.</i>",
        cards: [
            {
                theme: "b-gold", title: "4막 하드", node: "1720",
                rows: [
                    { gate: "1관", boss: "에키드나", badges: [{ text: "악마", cls: "type-demon" }], range: "1425 - 1900" },
                    { gate: "2관", boss: "아르모체", badges: [{ text: "고대", cls: "type-ancient" }, { text: "화속성 취약", cls: "attr-fire" }], range: "1575 - 2100" }
                ],
                gold: "38,000", bindGold: "", total: ""
            },
            {
                theme: "b-gold", title: "성당 2단계", node: "1720",
                rows: [
                    { gate: "1관", boss: "대주교", badges: [{ text: "인간", cls: "type-human" }, { text: "암속성 취약", cls: "attr-dark" }], range: "2161 - 2882" },
                    { gate: "2관", boss: "광신의 인도자", badges: [{ text: "인간", cls: "type-human" }, { text: "암속성 취약", cls: "attr-dark" }], range: "2089 - 2786" }
                ],
                gold: "", bindGold: "40,000", total: ""
            },
            {
                theme: "b-green", title: "종막 노말", node: "1710",
                rows: [
                    { gate: "1관", boss: "카제로스", badges: [{ text: "대악마", cls: "type-archdemon" }], range: "1190 - 1590" },
                    { gate: "2관", boss: "카제로스", badges: [{ text: "대악마", cls: "type-archdemon" }], range: "1050 - 1400" }
                ],
                gold: "32,000", bindGold: "16,000", total: "48,000"
            },
            {
                theme: "b-gray", title: "세르카 노말", node: "1710",
                rows: [
                    { gate: "1관", boss: "세르카", badges: [{ text: "인간", cls: "type-human" }], range: "1100 - 1480" },
                    { gate: "2관", boss: "코르부스", badges: [{ text: "고대", cls: "type-ancient" }, { text: "성속성 취약", cls: "attr-holy" }], range: "1430 - 1900" }
                ],
                gold: "32,000", bindGold: "16,000", total: "48,000"
            }
        ]
    },

    1730: {
        sectionTitle: "1730 레이드",
        intro: "<i>해당 레벨대에 입장할수있는 레이드를 나열하였습니다.</i>",
        cards: [
            {
                theme: "b-gold", title: "세르카 하드", node: "1730",
                rows: [
                    { gate: "1관", boss: "세르카", badges: [{ text: "인간", cls: "type-human" }], range: "2300 - 3070" },
                    { gate: "2관", boss: "코르부스", badges: [{ text: "고대", cls: "type-ancient" }, { text: "성속성 취약", cls: "attr-holy" }], range: "2980 - 3970" }
                ],
                gold: "44,000", bindGold: "", total: ""
            },
            {
                theme: "b-gold", title: "종막 하드", node: "1730",
                rows: [
                    { gate: "1관", boss: "카제로스", badges: [{ text: "대악마", cls: "type-archdemon" }], range: "2025 - 2700" },
                    { gate: "2관", boss: "카제로스", badges: [{ text: "대악마", cls: "type-archdemon" }, { text: "신", cls: "type-divine" }], range: "3375 - 4490" }
                ],
                gold: "48,000", bindGold: "", total: ""
            },
            {
                theme: "b-gold", title: "4막 하드", node: "1720",
                rows: [
                    { gate: "1관", boss: "에키드나", badges: [{ text: "악마", cls: "type-demon" }], range: "1425 - 1900" },
                    { gate: "2관", boss: "아르모체", badges: [{ text: "고대", cls: "type-ancient" }, { text: "화속성 취약", cls: "attr-fire" }], range: "1575 - 2100" }
                ],
                gold: "38,000", bindGold: "", total: ""
            },
            {
                theme: "b-gray", title: "성당 2단계", node: "1720",
                rows: [
                    { gate: "1관", boss: "대주교", badges: [{ text: "인간", cls: "type-human" }, { text: "암속성 취약", cls: "attr-dark" }], range: "2161 - 2882" },
                    { gate: "2관", boss: "광신의 인도자", badges: [{ text: "인간", cls: "type-human" }, { text: "암속성 취약", cls: "attr-dark" }], range: "2089 - 2786" }
                ],
                gold: "", bindGold: "40,000", total: ""
            }
        ]
    },

    1740: {
        sectionTitle: "1740 레이드",
        intro: "<i>해당 레벨대에 입장할수있는 레이드를 나열하였습니다.</i>",
        cards: [
            {
                theme: "b-purple", title: "세르카 나메", node: "1740",
                rows: [
                    { gate: "1관", boss: "세르카", badges: [{ text: "인간", cls: "type-human" }], range: "3580 - 4770" },
                    { gate: "2관", boss: "코르부스", badges: [{ text: "고대", cls: "type-ancient" }, { text: "성속성 취약", cls: "attr-holy" }], range: "4620 - 6160" }
                ],
                gold: "54,000", bindGold: "", total: ""
            },
            {
                theme: "b-gold", title: "종막 하드", node: "1730",
                rows: [
                    { gate: "1관", boss: "카제로스", badges: [{ text: "대악마", cls: "type-archdemon" }], range: "2025 - 2700" },
                    { gate: "2관", boss: "카제로스", badges: [{ text: "대악마", cls: "type-archdemon" }, { text: "신", cls: "type-divine" }], range: "3375 - 4490" }
                ],
                gold: "48,000", bindGold: "", total: ""
            },
            {
                theme: "b-gold", title: "4막 하드", node: "1720",
                rows: [
                    { gate: "1관", boss: "에키드나", badges: [{ text: "악마", cls: "type-demon" }], range: "1425 - 1900" },
                    { gate: "2관", boss: "아르모체", badges: [{ text: "고대", cls: "type-ancient" }, { text: "화속성 취약", cls: "attr-fire" }], range: "1575 - 2100" }
                ],
                gold: "38,000", bindGold: "", total: ""
            },
            {
                theme: "b-gray", title: "성당 2단계", node: "1720",
                rows: [
                    { gate: "1관", boss: "대주교", badges: [{ text: "인간", cls: "type-human" }, { text: "암속성 취약", cls: "attr-dark" }], range: "2161 - 2882" },
                    { gate: "2관", boss: "광신의 인도자", badges: [{ text: "인간", cls: "type-human" }, { text: "암속성 취약", cls: "attr-dark" }], range: "2089 - 2786" }
                ],
                gold: "", bindGold: "40,000", total: ""
            }
        ]
    },

    1750: {
        sectionTitle: "1750 레이드",
        intro: "<i>해당 레벨대에 입장할수있는 레이드를 나열하였습니다.</i>",
        cards: [
            {
                theme: "b-purple", title: "세르카 나메", node: "1740",
                rows: [
                    { gate: "1관", boss: "세르카", badges: [{ text: "인간", cls: "type-human" }], range: "3580 - 4770" },
                    { gate: "2관", boss: "코르부스", badges: [{ text: "고대", cls: "type-ancient" }, { text: "성속성 취약", cls: "attr-holy" }], range: "4620 - 6160" }
                ],
                gold: "54,000", bindGold: "", total: ""
            },
            {
                theme: "b-gold", title: "종막 하드", node: "1730",
                rows: [
                    { gate: "1관", boss: "카제로스", badges: [{ text: "대악마", cls: "type-archdemon" }], range: "2025 - 2700" },
                    { gate: "2관", boss: "카제로스", badges: [{ text: "대악마", cls: "type-archdemon" }, { text: "신", cls: "type-divine" }], range: "3375 - 4490" }
                ],
                gold: "48,000", bindGold: "", total: ""
            },
            {
                theme: "b-orange", title: "성당 3단계", node: "1750",
                rows: [
                    { gate: "1관", boss: "대주교", badges: [{ text: "인간", cls: "type-human" }, { text: "암속성 취약", cls: "attr-dark" }], range: "3650 - 4866" },
                    { gate: "2관", boss: "광신의 인도자", badges: [{ text: "인간", cls: "type-human" }, { text: "암속성 취약", cls: "attr-dark" }], range: "3594 - 4792" }
                ],
                gold: "", bindGold: "50,000", total: ""
            },
            {
                theme: "b-green", title: "벨가르딘 노말", node: "1750",
                rows: [
                    { gate: "1관", boss: "벨가르딘", badges: [{ text: "인간", cls: "type-human" }, { text: "성속성 취약", cls: "attr-holy" }], range: "2601 - 2879 - 3469" },
                    { gate: "2관", boss: "페투스", badges: [{ text: "고대", cls: "type-ancient" }, { text: "성속성 취약", cls: "attr-holy" }], range: "2917 - 3228 - 3889" }
                ],
                gold: "50,000", bindGold: "", total: ""
            },
            {
                theme: "b-gray", title: "4막 하드", node: "1720",
                rows: [
                    { gate: "1관", boss: "에키드나", badges: [{ text: "악마", cls: "type-demon" }], range: "1425 - 1900" },
                    { gate: "2관", boss: "아르모체", badges: [{ text: "고대", cls: "type-ancient" }, { text: "화속성 취약", cls: "attr-fire" }], range: "1575 - 2100" }
                ],
                gold: "38,000", bindGold: "", total: ""
            }
        ]
    },

    1770: {
        sectionTitle: "1770 레이드",
        intro: "<i>해당 레벨대에 입장할수있는 레이드를 나열하였습니다. (벨가르딘 하드 딜컷은 확인 후 업데이트 예정)</i>",
        cards: [
            {
                theme: "b-orange", title: "벨가르딘 하드", node: "1770",
                rows: [
                    { gate: "1관", boss: "벨가르딘", badges: [{ text: "인간", cls: "type-human" }, { text: "성속성 취약", cls: "attr-holy" }], range: "4142 - 4584 - 5523" },
                    { gate: "2관", boss: "페투스", badges: [{ text: "고대", cls: "type-ancient" }, { text: "성속성 취약", cls: "attr-holy" }], range: "4689 - 5189 - 6252" }
                ],
                gold: "62,000", bindGold: "", total: ""
            },
            {
                theme: "b-purple", title: "세르카 나메", node: "1740",
                rows: [
                    { gate: "1관", boss: "세르카", badges: [{ text: "인간", cls: "type-human" }], range: "3580 - 4770" },
                    { gate: "2관", boss: "코르부스", badges: [{ text: "고대", cls: "type-ancient" }, { text: "성속성 취약", cls: "attr-holy" }], range: "4620 - 6160" }
                ],
                gold: "54,000", bindGold: "", total: ""
            },
            {
                theme: "b-orange", title: "성당 3단계", node: "1750",
                rows: [
                    { gate: "1관", boss: "대주교", badges: [{ text: "인간", cls: "type-human" }, { text: "암속성 취약", cls: "attr-dark" }], range: "3650 - 4866" },
                    { gate: "2관", boss: "광신의 인도자", badges: [{ text: "인간", cls: "type-human" }, { text: "암속성 취약", cls: "attr-dark" }], range: "3594 - 4792" }
                ],
                gold: "", bindGold: "50,000", total: ""
            }
        ]
    },

    1780: {
        sectionTitle: "1780 레이드",
        intro: "<i>해당 레벨대에 입장할수있는 레이드를 나열하였습니다. (벨가르딘 나메 딜컷은 확인 후 업데이트 예정)</i>",
        cards: [
            {
                theme: "b-purple", title: "벨가르딘 나메", node: "1780",
                rows: [
                    { gate: "1관", boss: "벨가르딘", badges: [{ text: "인간", cls: "type-human" }, { text: "성속성 취약", cls: "attr-holy" }], range: "7412 - 8203 - 9883" },
                    { gate: "2관", boss: "페투스", badges: [{ text: "고대", cls: "type-ancient" }, { text: "성속성 취약", cls: "attr-holy" }], range: "8391 - 9286 - 11188" }
                ],
                gold: "75,000", bindGold: "", total: ""
            },
            {
                theme: "b-orange", title: "벨가르딘 하드", node: "1770",
                rows: [
                    { gate: "1관", boss: "벨가르딘", badges: [{ text: "인간", cls: "type-human" }, { text: "성속성 취약", cls: "attr-holy" }], range: "4142 - 4584 - 5523" },
                    { gate: "2관", boss: "페투스", badges: [{ text: "고대", cls: "type-ancient" }, { text: "성속성 취약", cls: "attr-holy" }], range: "4689 - 5189 - 6252" }
                ],
                gold: "25,000", bindGold: "", total: ""
            }
        ]
    }
};




/* =============================================
   레이드별 간편보기 메타
   ============================================= */
export const simpleRaidMeta = {
    cathedral: {
        label: "지평의 성당",
        sub: "4인 레이드",
        icon: "⛪",
        summary: "어비스 레이드",
        titles: ["성당 3단계", "성당 2단계", "성당 1단계"]
    },
    serka: {
        label: "세르카",
        sub: "4인 레이드",
        icon: "🧹",
        summary: "그림자 레이드",
        titles: ["세르카 나메", "세르카 하드", "세르카 노말"]
    },
    belgardin: {
        label: "벨가르딘",
        sub: "8인 레이드",
        icon: "🧛",
        summary: "그림자 레이드",
        titles: ["벨가르딘 나메", "벨가르딘 하드", "벨가르딘 노말"]
    },
    finale: {
        label: "종막",
        sub: "8인 레이드",
        icon: "👑",
        summary: "카제로스 레이드",
        titles: ["종막 하드", "종막 노말"]
    },
    act4: {
        label: "4막",
        sub: "8인 레이드",
        icon: "🛡️",
        summary: "카제로스 레이드",
        titles: ["4막 하드", "4막 노말"]
    }
};

export const simpleRaidKickerMap = {
    cathedral: "CATHEDRAL",
    serka: "SERKA",
    belgardin: "BELGARDIN",
    finale: "FINALE",
    act4: "ACT4"
};

/* =============================================
   EX 레이드 UI 데이터
   ============================================= */
export const exRaidData = {
    "egir-ex": {
        sectionTitle: "에기르 EX",
        intro: "<i>에기르 EX 레이드 26.04.22 ~ 26.05.20 패치전 까지</i>",
        cards: [
            {
                tier: "normal",
                level: "1720",
                name: "에기르 EX 노말",
                tags: [{ text: "1관 에기르" }, { text: "고대" }],
                tank_dmg: "2,200",
                tank_dps: "1.72억",
                one_dmg: "2,550",
                one_dps: "2.00억",
                blood_dmg: "2,900",
                blood_dps: "2.28억",
                phases: [
                    { label: "1페이즈 종료", sub: "165실드 / 누적 7분 10초", t_d: "1,804억", t_s: "4.19억", o_d: "2,091억", o_s: "4.86억", b_d: "2,379억", b_s: "5.53억" },
                    { label: "2페이즈 종료", sub: "0줄 진입 / 누적 13분 40초", t_d: "2,200억", t_s: "2.68억", o_d: "2,550억", o_s: "3.11억", b_d: "2,900억", b_s: "3.54억" },
                    { label: "🏆 최종 토벌 완료", sub: "레이드 종료 / 총 21분 20초", t_d: "2,200억", t_s: "1.72억", o_d: "2,550억", o_s: "2.00억", b_d: "2,900억", b_s: "2.28억", total: true }
                ]
            },
            {
                tier: "hard",
                level: "1750",
                name: "에기르 EX 하드",
                tags: [{ text: "1관 에기르" }, { text: "고대" }],
                tank_dmg: "4,400",
                tank_dps: "3.50억",
                one_dmg: "5,120",
                one_dps: "4.07억",
                blood_dmg: "5,850",
                blood_dps: "4.65억",
                phases: [
                    { label: "1페이즈 종료", sub: "165실드 / 누적 7분 10초", t_d: "3,608억", t_s: "8.39억", o_d: "4,198억", o_s: "9.76억", b_d: "4,797억", b_s: "11.16억" },
                    { label: "2페이즈 종료", sub: "0줄 진입 / 누적 13분 40초", t_d: "4,400억", t_s: "5.37억", o_d: "5,120억", o_s: "6.24억", b_d: "5,850억", b_s: "7.13억" },
                    { label: "🏆 최종 토벌 완료", sub: "레이드 종료 / 총 20분 55초", t_d: "4,400억", t_s: "3.50억", o_d: "5,120억", o_s: "4.07억", b_d: "5,850억", b_s: "4.65억", total: true }
                ]
            },
            {
                tier: "nightmare",
                level: "1770",
                name: "에기르 EX 나이트메어",
                tags: [{ text: "1관 에기르" }, { text: "고대" }],
                tank_dmg: "7,900",
                tank_dps: "6.27억",
                one_dmg: "9,200",
                one_dps: "7.30억",
                blood_dmg: "10,500",
                blood_dps: "8.33억",
                phases: [
                    { label: "1페이즈 종료", sub: "165실드 / 누적 7분 10초", t_d: "6,483억", t_s: "15.08억", o_d: "7,549억", o_s: "17.56억", b_d: "8,615억", b_s: "20.03억" },
                    { label: "2페이즈 종료", sub: "0줄 진입 / 누적 13분 40초", t_d: "7,900억", t_s: "9.65억", o_d: "9,200억", o_s: "11.25억", b_d: "10,500억", b_s: "12.84억" },
                    { label: "🏆 최종 토벌 완료", sub: "레이드 종료 / 총 21분 00초", t_d: "7,900억", t_s: "6.27억", o_d: "9,200억", o_s: "7.30억", b_d: "10,500억", b_s: "8.33억", total: true }
                ]
            }
        ],
        bossSection: {
            headerColor: "#a78bfa",
            estherBar: "#a78bfa",
            colName1: "나이트메어",
            colName2: "하드",
            colName3: "노말",
            col1: "#a78bfa",
            col2: "#f7ca54",
            col3: "#34d399",
            bosses: [
                {
                    name: "나이트메어",
                    color: "#a78bfa",
                    totalHp: "6조 204억",
                    parts: [
                        { name: "체력", pct: 82.1, color: "#a78bfa", legend: "기본체력 (300줄)", hp: "4조 9,436억" },
                        { name: "실드", pct: 6.0, color: "#d1d5db", legend: "165실드 (22줄)", hp: "3,604억" },
                        { name: "0줄", pct: 11.9, color: "#f87171", legend: "0줄 발악 (44줄)", hp: "7,163억" }
                    ]
                },
                {
                    name: "하드",
                    color: "#f7ca54",
                    totalHp: "3조 3,576억",
                    parts: [
                        { name: "체력", pct: 81.9, color: "#f7ca54", legend: "기본체력 (300줄)", hp: "2조 7,551억" },
                        { name: "실드", pct: 6.0, color: "#d1d5db", legend: "165실드 (22줄)", hp: "2,033억" },
                        { name: "0줄", pct: 11.9, color: "#f87171", legend: "0줄 발악 (44줄)", hp: "3,992억" }
                    ]
                },
                {
                    name: "노말",
                    color: "#34d399",
                    totalHp: "1조 6,481억",
                    parts: [
                        { name: "체력", pct: 82.1, color: "#34d399", legend: "기본체력 (300줄)", hp: "1조 3,523억" },
                        { name: "실드", pct: 6.1, color: "#d1d5db", legend: "165실드 (22줄)", hp: "998억" },
                        { name: "0줄", pct: 11.9, color: "#f87171", legend: "0줄 발악 (44줄)", hp: "1,959억" }
                    ]
                }
            ],
            esther: [
                ["에아달린 히든 3칸", "약 3,690억", "약 2,043억", "약 997.5억"],
                ["아델 3칸", "약 930억", "약 514억", "약 251억"],
                ["아델 1칸", "약 700억", "약 387억", "약 189억"],
                ["에아달린 1칸", "약 1,350억", "약 747억", "약 365억"]
            ]
        }
    },

    "abr-ex": {
        sectionTitle: "아브렐슈드 EX",
        intro: "<i>아브렐슈드 EX 레이드 26.05.20 ~ 26.06.17 패치전 까지</i>",
        cards: [
            {
                tier: "normal",
                level: "1720",
                name: "아브 EX 노말",
                tags: [{ text: "1관 아브렐슈드" }, { text: "악마" }, { text: "뇌속성 취약", weak: true }],
                tank_dmg: "1,502",
                tank_dps: "1.13억",
                one_dmg: "1,669",
                one_dps: "1.26억",
                blood_dmg: "2,003",
                blood_dps: "1.51억",
                phases: [
                    { label: "1페이즈 종료", sub: "335줄 / 누적 2분 20초", t_d: "215억", t_s: "1.54억", o_d: "239억", o_s: "1.71억", b_d: "287억", b_s: "2.05억" },
                    { label: "2페이즈 종료", sub: "145줄 / 누적 11분 00초", t_d: "760억", t_s: "1.15억", o_d: "844억", o_s: "1.28억", b_d: "1,013억", b_s: "1.53억" },
                    { label: "3페이즈 종료", sub: "0줄 진입 / 누적 17분 55초", t_d: "1,162억", t_s: "1.08억", o_d: "1,291억", o_s: "1.20억", b_d: "1,549억", b_s: "1.44억" },
                    { label: "🏆 최종 토벌 완료", sub: "레이드 종료 / 총 22분 05초", t_d: "1,502억", t_s: "1.13억", o_d: "1,669억", o_s: "1.26억", b_d: "2,003억", b_s: "1.51억", total: true }
                ]
            },
            {
                tier: "hard",
                level: "1750",
                name: "아브 EX 하드",
                tags: [{ text: "1관 아브렐슈드" }, { text: "악마" }, { text: "뇌속성 취약", weak: true }],
                tank_dmg: "4,065",
                tank_dps: "3.07억",
                one_dmg: "4,515",
                one_dps: "3.41억",
                blood_dmg: "5,420",
                blood_dps: "4.09억",
                phases: [
                    { label: "1페이즈 종료", sub: "335줄 / 누적 2분 20초", t_d: "579억", t_s: "4.14억", o_d: "643억", o_s: "4.59억", b_d: "772억", b_s: "5.51억" },
                    { label: "2페이즈 종료", sub: "145줄 / 누적 11분 00초", t_d: "2,052억", t_s: "3.11억", o_d: "2,280억", o_s: "3.45억", b_d: "2,737억", b_s: "4.15억" },
                    { label: "3페이즈 종료", sub: "0줄 진입 / 누적 17분 55초", t_d: "3,139억", t_s: "2.92억", o_d: "3,488억", o_s: "3.24억", b_d: "4,185억", b_s: "3.89억" },
                    { label: "🏆 최종 토벌 완료", sub: "레이드 종료 / 총 22분 05초", t_d: "4,065억", t_s: "3.07억", o_d: "4,515억", o_s: "3.41억", b_d: "5,420억", b_s: "4.09억", total: true }
                ]
            },
            {
                tier: "nightmare",
                level: "1770",
                name: "아브 EX 나이트메어",
                tags: [{ text: "1관 아브렐슈드" }, { text: "악마" }, { text: "뇌속성 취약", weak: true }],
                tank_dmg: "9,228",
                tank_dps: "6.96억",
                one_dmg: "10,249",
                one_dps: "7.73억",
                blood_dmg: "12,304",
                blood_dps: "9.29억",
                phases: [
                    { label: "1페이즈 종료", sub: "335줄 / 누적 2분 20초", t_d: "1,320.2억", t_s: "9.43억", o_d: "1,466.2억", o_s: "10.47억", b_d: "1,760.2억", b_s: "12.57억" },
                    { label: "2페이즈 종료", sub: "145줄 / 누적 11분 00초", t_d: "4,669.7억", t_s: "7.08억", o_d: "5,186.5억", o_s: "7.86억", b_d: "6,226.3억", b_s: "9.43억" },
                    { label: "3페이즈 종료", sub: "0줄 진입 / 누적 17분 55초", t_d: "7,141.2억", t_s: "6.64억", o_d: "7,931.5억", o_s: "7.38억", b_d: "9,521.6억", b_s: "8.86억" },
                    { label: "🏆 최종 토벌 완료", sub: "레이드 종료 / 총 22분 05초", t_d: "9,228.0억", t_s: "6.96억", o_d: "10,249.2억", o_s: "7.73억", b_d: "12,304.0억", b_s: "9.29억", total: true }
                ]
            }
        ],
        bossSection: {
            headerColor: "#a78bfa",
            estherBar: "#f7ca54",
            colName1: "나이트메어",
            colName2: "하드",
            colName3: "노말",
            col1: "#a78bfa",
            col2: "#f7ca54",
            col3: "#34d399",
            bosses: [
                {
                    name: "나이트메어",
                    color: "#a78bfa",
                    totalHp: "7조 3,669억",
                    parts: [
                        { name: "체력", pct: 73.5, color: "#a78bfa", legend: "기본 체력 (420줄)", hp: "5조 4,168억" },
                        { name: "0줄", pct: 26.5, color: "#f87171", legend: "0줄 발악 (152줄)", hp: "1조 9,500억" }
                    ]
                },
                {
                    name: "하드",
                    color: "#f7ca54",
                    totalHp: "3조 2,449억",
                    parts: [
                        { name: "체력", pct: 73.5, color: "#f7ca54", legend: "기본 체력 (420줄)", hp: "2조 3,859억" },
                        { name: "0줄", pct: 26.5, color: "#f87171", legend: "0줄 발악 (152줄)", hp: "8,589억" }
                    ]
                },
                {
                    name: "노말",
                    color: "#34d399",
                    totalHp: "1조 1,966억",
                    parts: [
                        { name: "체력", pct: 73.5, color: "#34d399", legend: "기본 체력 (420줄)", hp: "8,799억" },
                        { name: "0줄", pct: 26.5, color: "#f87171", legend: "0줄 발악 (152줄)", hp: "3,167억" }
                    ]
                }
            ],
            esther: [
                ["아제나 3칸", "약 1,009억", "약 451억", "약 162억"],
                ["아제나 1칸", "약 1,135억", "약 508억", "약 182억"],
                ["히든 아제나", "약 4,539억", "약 1,946억", "약 729억"],
                ["니나브 3칸", "약 743억", "약 320억", "약 119억"],
                ["니나브 1칸", "약 1,185억", "약 530억", "약 190억"],
                ["구스토 1칸", "약 995억", "약 445억", "약 159억"]
            ]
        }
    }
};


/* =============================================
   세르카 보상 데이터
   ============================================= */
export const serkaRewardData = {
    "normal_gate1": {
        clearItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"8", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"3", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_88.png", count:"880", name:"운명의 파괴석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_89.png", count:"1,760", name:"운명의 수호석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_85.png", count:"12", name:"운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_0.png", count:"4", name:"고통의 가시"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/tokenitem/tokenitem_88.png", count:"1,300", name:"클리어 메달"}
        ],
        gold: "13,000", shard: "6,200",
        moreItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"8", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"3", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_88.png", count:"1,500", name:"운명의 파괴석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_89.png", count:"3,000", name:"운명의 수호석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_85.png", count:"47", name:"운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_0.png", count:"4", name:"고통의 가시"}
        ],
        moreGold: "", moreShard: "12,680"
    },
    "normal_gate2": {
        clearItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"9", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"5", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_88.png", count:"1,100", name:"운명의 파괴석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_89.png", count:"2,200", name:"운명의 수호석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_85.png", count:"15", name:"운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_0.png", count:"6", name:"고통의 가시"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/tokenitem/tokenitem_88.png", count:"2,100", name:"클리어 메달"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_87.png", count:"17", name:"3티어 순환 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_7_145.png", count:"8", name:"운명의 돌"}
        ],
        gold: "19,000", shard: "7,900",
        moreItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"9", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"5", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_88.png", count:"2,250", name:"운명의 파괴석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_89.png", count:"4,500", name:"운명의 수호석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_85.png", count:"75", name:"운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_0.png", count:"6", name:"고통의 가시"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_87.png", count:"12", name:"3티어 순환 돌파석"}
        ],
        moreGold: "", moreShard: "18,900"
    },
    "hard_gate1": {
        clearItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"10", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"2", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_249.png", count:"385", name:"운명의 파괴석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_250.png", count:"770", name:"운명의 수호석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_251.png", count:"7", name:"위대한 운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_0.png", count:"10", name:"고통의 가시"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/tokenitem/tokenitem_88.png", count:"1,300", name:"클리어 메달"}
        ],
        gold: "17,500", shard: "8,300",
        moreItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"10", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"2", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_249.png", count:"750", name:"운명의 파괴석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_250.png", count:"1,500", name:"운명의 수호석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_251.png", count:"30", name:"위대한 운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_0.png", count:"10", name:"고통의 가시"}
        ],
        moreGold: "", moreShard: "17,500"
    },
    "hard_gate2": {
        clearItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"10", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"3", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_249.png", count:"475", name:"운명의 파괴석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_250.png", count:"950", name:"운명의 수호석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_251.png", count:"10", name:"위대한 운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_0.png", count:"15", name:"고통의 가시"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/tokenitem/tokenitem_88.png", count:"2,100", name:"클리어 메달"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_253.png", count:"5", name:"4티어 전이 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_7_145.png", count:"10", name:"운명의 돌"}
        ],
        gold: "26,500", shard: "10,100",
        moreItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"10", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"3", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_249.png", count:"1,130", name:"운명의 파괴석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_250.png", count:"2,260", name:"운명의 수호석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_251.png", count:"45", name:"위대한 운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_0.png", count:"15", name:"고통의 가시"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_253.png", count:"4", name:"4티어 전이 돌파석"}
        ],
        moreGold: "", moreShard: "26,820"
    },
    "nightmare_gate1": {
        clearItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"10", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"3", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_249.png", count:"405", name:"운명의 파괴석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_250.png", count:"810", name:"운명의 수호석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_251.png", count:"8", name:"위대한 운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_0.png", count:"10", name:"고통의 가시"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/tokenitem/tokenitem_88.png", count:"1,300", name:"클리어 메달"}
        ],
        gold: "21,000", shard: "9,100",
        moreItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"10", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"3", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_249.png", count:"860", name:"운명의 파괴석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_250.png", count:"1,720", name:"운명의 수호석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_251.png", count:"36", name:"위대한 운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_0.png", count:"10", name:"고통의 가시"}
        ],
        moreGold: "", moreShard: "19,000"
    },
    "nightmare_gate2": {
        clearItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"10", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"4", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/newvehicle/newvehicle_151.png", count:"1", name:"마녀의 빗자루"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_249.png", count:"500", name:"운명의 파괴석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_250.png", count:"1,000", name:"운명의 수호석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_251.png", count:"12", name:"위대한 운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_0.png", count:"15", name:"고통의 가시"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/tokenitem/tokenitem_88.png", count:"2,100", name:"클리어 메달"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_253.png", count:"6", name:"4티어 전이 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_7_145.png", count:"10", name:"운명의 돌"}
        ],
        gold: "33,000", shard: "11,000",
        moreItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"10", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"4", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_249.png", count:"1,430", name:"운명의 파괴석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_250.png", count:"2,860", name:"운명의 수호석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_251.png", count:"60", name:"위대한 운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_0.png", count:"15", name:"고통의 가시"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_253.png", count:"4", name:"4티어 전이 돌파석"}
        ],
        moreGold: "", moreShard: "32,200"
    }
};


/* =============================================
   지평의 성당 보상 데이터
   ============================================= */
export const cathedralRewardData = {
    "normal_gate1": {
        clearItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"7", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"2", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_88.png", count:"820", name:"운명의 파괴석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_89.png", count:"1,640", name:"운명의 수호석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_85.png", count:"9", name:"운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_19.png", count:"4", name:"은총의 파편"}
        ],
        gold: "13,500", shard: "5,400",
        moreItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"7", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"2", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_88.png", count:"1,400", name:"운명의 파괴석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_89.png", count:"2,800", name:"운명의 수호석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_85.png", count:"44", name:"운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_19.png", count:"4", name:"은총의 파편"}
        ],
        moreGold: "", moreShard: "11,880"
    },
    "normal_gate2": {
        clearItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"8", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"4", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_88.png", count:"960", name:"운명의 파괴석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_89.png", count:"1,920", name:"운명의 수호석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_85.png", count:"12", name:"운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_19.png", count:"6", name:"은총의 파편"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_87.png", count:"15", name:"3티어 순환 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_7_145.png", count:"8", name:"운명의 돌"}
        ],
        gold: "16,500", shard: "6,800",
        moreItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"8", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"4", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_88.png", count:"2,400", name:"운명의 파괴석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_89.png", count:"4,800", name:"운명의 수호석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_85.png", count:"78", name:"운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_19.png", count:"6", name:"은총의 파편"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_87.png", count:"10", name:"3티어 순환 돌파석"}
        ],
        moreGold: "", moreShard: "6,800"
    },
    "hard_gate1": {
        clearItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"8", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"1", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_88.png", count:"980", name:"운명의 파괴석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_89.png", count:"1,960", name:"운명의 수호석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_85.png", count:"11", name:"운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_19.png", count:"12", name:"은총의 파편"}
        ],
        gold: "16,000", shard: "6,800",
        moreItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"8", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"1", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_88.png", count:"1,680", name:"운명의 파괴석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_89.png", count:"3,360", name:"운명의 수호석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_85.png", count:"53", name:"운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_19.png", count:"12", name:"은총의 파편"}
        ],
        moreGold: "", moreShard: "14,250"
    },
    "hard_gate2": {
        clearItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"9", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"2", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_88.png", count:"1,150", name:"운명의 파괴석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_89.png", count:"2,300", name:"운명의 수호석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_85.png", count:"16", name:"운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_19.png", count:"18", name:"은총의 파편"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_87.png", count:"17", name:"3티어 순환 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_7_145.png", count:"10", name:"운명의 돌"}
        ],
        gold: "24,000", shard: "8,600",
        moreItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"9", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"2", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_88.png", count:"2,880", name:"운명의 파괴석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_89.png", count:"5,760", name:"운명의 수호석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_85.png", count:"94", name:"운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_19.png", count:"18", name:"은총의 파편"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_12_87.png", count:"13", name:"3티어 순환 돌파석"}
        ],
        moreGold: "", moreShard: "24,200"
    },
    "nightmare_gate1": {
        clearItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"10", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"3", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_249.png", count:"405", name:"운명의 파괴석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_250.png", count:"810", name:"운명의 수호석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_251.png", count:"8", name:"위대한 운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_19.png", count:"24", name:"은총의 파편"}
        ],
        gold: "20,000", shard: "9,100",
        moreItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"10", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"3", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_249.png", count:"860", name:"운명의 파괴석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_250.png", count:"1,720", name:"운명의 수호석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_251.png", count:"36", name:"위대한 운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_19.png", count:"24", name:"은총의 파편"}
        ],
        moreGold: "", moreShard: "19,000"
    },
    "nightmare_gate2": {
        clearItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"10", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"4", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_249.png", count:"500", name:"운명의 파괴석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_250.png", count:"1,000", name:"운명의 수호석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_251.png", count:"12", name:"위대한 운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_19.png", count:"36", name:"은총의 파편"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_253.png", count:"6", name:"4티어 전이 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_7_145.png", count:"10", name:"운명의 돌"}
        ],
        gold: "30,000", shard: "11,000",
        moreItems: [
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png", count:"10", name:"4티어 비상의 돌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png", count:"4", name:"4티어 팔찌"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_249.png", count:"1,430", name:"운명의 파괴석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_250.png", count:"2,860", name:"운명의 수호석 결정"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_251.png", count:"60", name:"위대한 운명의 돌파석"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_19.png", count:"36", name:"은총의 파편"},
            {src:"https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_253.png", count:"5", name:"4티어 전이 돌파석"}
        ],
        moreGold: "", moreShard: "32,200"
    }
};


/* =============================================
   벨가르딘 보상 데이터 (신규)
   ============================================= */
const BG_ICON = {
    destroy: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_249.png",   // 운명의 파괴석 결정
    guard: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_250.png",     // 운명의 수호석 결정
    bracelet: "https://cdn-lostark.game.onstove.com/efui_iconatlas/acc/acc_327.png",     // 4티어 팔찌
    stone: "https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_245.png",// 4티어 비상의 돌
    breakGreat: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_251.png",// 위대한 운명의 돌파석
    transfer: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_253.png",  // 4티어 전이 돌파석
    fateStone: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_7_145.png",  // 운명의 돌
    gold: "https://cdn-lostark.game.onstove.com/efui_iconatlas/money/money_4.png",
    shard: "https://cdn-lostark.game.onstove.com/efui_iconatlas/money/money_15.png",
    shadowOfCommand: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_46.png", // 사령의 잔영 (노말 전용)
    handOfDeath: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_14_55.png"      // 죽음의 손 (하드/나메 전용)
};

export const belgardinRewardData = {
    "normal_gate1": {
        clearItems: [
            {src:BG_ICON.stone, count:"10", name:"4티어 비상의 돌"},
            {src:BG_ICON.bracelet, count:"3", name:"4티어 팔찌"},
            {src:BG_ICON.destroy, count:"405", name:"운명의 파괴석 결정"},
            {src:BG_ICON.guard, count:"810", name:"운명의 수호석 결정"},
            {src:BG_ICON.breakGreat, count:"8", name:"위대한 운명의 돌파석"},
            {src:BG_ICON.shadowOfCommand, count:"12", name:"사령의 잔영"}
        ],
        gold: "20,000", shard: "9,100",
        moreItems: [
            {src:BG_ICON.stone, count:"10", name:"4티어 비상의 돌"},
            {src:BG_ICON.bracelet, count:"3", name:"4티어 팔찌"},
            {src:BG_ICON.destroy, count:"860", name:"운명의 파괴석 결정"},
            {src:BG_ICON.guard, count:"1,720", name:"운명의 수호석 결정"},
            {src:BG_ICON.breakGreat, count:"36", name:"위대한 운명의 돌파석"},
            {src:BG_ICON.shadowOfCommand, count:"12", name:"사령의 잔영"}
        ],
        moreGold: "", moreShard: "19,000"
    },
    "normal_gate2": {
        clearItems: [
            {src:BG_ICON.stone, count:"10", name:"4티어 비상의 돌"},
            {src:BG_ICON.bracelet, count:"4", name:"4티어 팔찌"},
            {src:BG_ICON.destroy, count:"500", name:"운명의 파괴석 결정"},
            {src:BG_ICON.guard, count:"1,000", name:"운명의 수호석 결정"},
            {src:BG_ICON.breakGreat, count:"12", name:"위대한 운명의 돌파석"},
            {src:BG_ICON.shadowOfCommand, count:"18", name:"사령의 잔영"},
            {src:BG_ICON.transfer, count:"6", name:"4티어 전이 돌파석"},
            {src:BG_ICON.fateStone, count:"10", name:"운명의 돌"}
        ],
        gold: "30,000", shard: "11,000",
        moreItems: [
            {src:BG_ICON.stone, count:"10", name:"4티어 비상의 돌"},
            {src:BG_ICON.bracelet, count:"4", name:"4티어 팔찌"},
            {src:BG_ICON.destroy, count:"1,430", name:"운명의 파괴석 결정"},
            {src:BG_ICON.guard, count:"2,860", name:"운명의 수호석 결정"},
            {src:BG_ICON.breakGreat, count:"60", name:"위대한 운명의 돌파석"},
            {src:BG_ICON.shadowOfCommand, count:"18", name:"사령의 잔영"},
            {src:BG_ICON.transfer, count:"5", name:"4티어 전이 돌파석"}
        ],
        moreGold: "", moreShard: "32,200"
    },
    "hard_gate1": {
        clearItems: [
            {src:BG_ICON.stone, count:"10", name:"4티어 비상의 돌"},
            {src:BG_ICON.bracelet, count:"4", name:"4티어 팔찌"},
            {src:BG_ICON.destroy, count:"490", name:"운명의 파괴석 결정"},
            {src:BG_ICON.guard, count:"980", name:"운명의 수호석 결정"},
            {src:BG_ICON.breakGreat, count:"10", name:"위대한 운명의 돌파석"},
            {src:BG_ICON.handOfDeath, count:"12", name:"죽음의 손"}
        ],
        gold: "25,000", shard: "10,920",
        moreItems: [
            {src:BG_ICON.stone, count:"10", name:"4티어 비상의 돌"},
            {src:BG_ICON.bracelet, count:"4", name:"4티어 팔찌"},
            {src:BG_ICON.destroy, count:"1,130", name:"운명의 파괴석 결정"},
            {src:BG_ICON.guard, count:"2,260", name:"운명의 수호석 결정"},
            {src:BG_ICON.breakGreat, count:"43", name:"위대한 운명의 돌파석"},
            {src:BG_ICON.handOfDeath, count:"12", name:"죽음의 손"}
        ],
        moreGold: "", moreShard: "22,800"
    },
    "hard_gate2": {
        clearItems: [
            {src:BG_ICON.stone, count:"10", name:"4티어 비상의 돌"},
            {src:BG_ICON.bracelet, count:"5", name:"4티어 팔찌"},
            {src:BG_ICON.destroy, count:"600", name:"운명의 파괴석 결정"},
            {src:BG_ICON.guard, count:"1,200", name:"운명의 수호석 결정"},
            {src:BG_ICON.breakGreat, count:"15", name:"위대한 운명의 돌파석"},
            {src:BG_ICON.handOfDeath, count:"18", name:"죽음의 손"},
            {src:BG_ICON.transfer, count:"9", name:"4티어 전이 돌파석"},
            {src:BG_ICON.fateStone, count:"10", name:"운명의 돌"}
        ],
        gold: "37,000", shard: "13,200",
        moreItems: [
            {src:BG_ICON.stone, count:"10", name:"4티어 비상의 돌"},
            {src:BG_ICON.bracelet, count:"5", name:"4티어 팔찌"},
            {src:BG_ICON.destroy, count:"1,720", name:"운명의 파괴석 결정"},
            {src:BG_ICON.guard, count:"3,440", name:"운명의 수호석 결정"},
            {src:BG_ICON.breakGreat, count:"72", name:"위대한 운명의 돌파석"},
            {src:BG_ICON.handOfDeath, count:"18", name:"죽음의 손"},
            {src:BG_ICON.transfer, count:"6", name:"4티어 전이 돌파석"}
        ],
        moreGold: "", moreShard: "38,640"
    },
    "nightmare_gate1": {
        clearItems: [
            {src:BG_ICON.stone, count:"10", name:"4티어 비상의 돌"},
            {src:BG_ICON.bracelet, count:"5", name:"4티어 팔찌"},
            {src:BG_ICON.destroy, count:"565", name:"운명의 파괴석 결정"},
            {src:BG_ICON.guard, count:"1,130", name:"운명의 수호석 결정"},
            {src:BG_ICON.breakGreat, count:"12", name:"위대한 운명의 돌파석"},
            {src:BG_ICON.handOfDeath, count:"12", name:"죽음의 손"}
        ],
        gold: "30,000", shard: "12,550",
        moreItems: [
            {src:BG_ICON.stone, count:"10", name:"4티어 비상의 돌"},
            {src:BG_ICON.bracelet, count:"5", name:"4티어 팔찌"},
            {src:BG_ICON.destroy, count:"1,300", name:"운명의 파괴석 결정"},
            {src:BG_ICON.guard, count:"2,600", name:"운명의 수호석 결정"},
            {src:BG_ICON.breakGreat, count:"49", name:"위대한 운명의 돌파석"},
            {src:BG_ICON.handOfDeath, count:"12", name:"죽음의 손"}
        ],
        moreGold: "", moreShard: "26,220"
    },
    "nightmare_gate2": {
        clearItems: [
            {src:BG_ICON.stone, count:"10", name:"4티어 비상의 돌"},
            {src:BG_ICON.bracelet, count:"6", name:"4티어 팔찌"},
            {src:BG_ICON.destroy, count:"690", name:"운명의 파괴석 결정"},
            {src:BG_ICON.guard, count:"1,380", name:"운명의 수호석 결정"},
            {src:BG_ICON.breakGreat, count:"18", name:"위대한 운명의 돌파석"},
            {src:BG_ICON.handOfDeath, count:"18", name:"죽음의 손"},
            {src:BG_ICON.transfer, count:"10", name:"4티어 전이 돌파석"},
            {src:BG_ICON.fateStone, count:"10", name:"운명의 돌"}
        ],
        gold: "45,000", shard: "15,180",
        moreItems: [
            {src:BG_ICON.stone, count:"10", name:"4티어 비상의 돌"},
            {src:BG_ICON.bracelet, count:"6", name:"4티어 팔찌"},
            {src:BG_ICON.destroy, count:"1,980", name:"운명의 파괴석 결정"},
            {src:BG_ICON.guard, count:"3,960", name:"운명의 수호석 결정"},
            {src:BG_ICON.breakGreat, count:"83", name:"위대한 운명의 돌파석"},
            {src:BG_ICON.handOfDeath, count:"18", name:"죽음의 손"},
            {src:BG_ICON.transfer, count:"7", name:"4티어 전이 돌파석"}
        ],
        moreGold: "", moreShard: "44,440"
    }
};




/* =============================================
   레이드별 구간별(줄 수) 딜컷 데이터
   ============================================= */
export const lineCutConfig = {
    jongmak: { gate1: { total: 0, points: [] } }, // 종막 EX: 구간 = 관문(2-1/2-2/2-3), 전용 렌더러 사용
    serka: {
        gate1: {
            total: 300,
            points: [
                { line: 300, desc: "시작" },
                { line: 240, desc: "체스판 모루저가 패턴" },
                { line: 200, desc: "돈까스 패턴" },
                { line: 100, desc: "폭탄 안전지역 패턴" },
                { line: 0,   desc: "클리어" }
            ]
        },
        gate2: {
            total: 300,
            points: [
                { line: 300, desc: "시작" },
                { line: 240, desc: "분신 저가후 무력 패턴" },
                { line: 195, desc: "멘트후 저가 무력 딜타임 패턴" },
                { line: 120, desc: "분신 타임어택 패턴" },
                { line: 60,  desc: "삼각 간파후 딜무력 패턴" },
                { line: 0,   desc: "클리어" }
            ]
        }
    },
    cathedral: {
        gate1: {
            total: 200,
            points: [
                { line: 200, desc: "시작" },
                { line: 160, desc: "중앙 종 저가 패턴" },
                { line: 100, desc: "금은 줄 장판 실드 까기 패턴" },
                { line: 60,  desc: "중앙 저가후 지형 감소 패턴" },
                { line: 0,   desc: "클리어" }
            ]
        },
        gate2: {
            total: 200,
            points: [
                { line: 200, desc: "시작" },
                { line: 150, desc: "" },
                { line: 100, desc: "" },
                { line: 50,  desc: "" },
                { line: 0,   desc: "클리어" }
            ]
        }
    },
    belgardin: {
        gate1: {
            total: 300,
            points: [
                { line: 300, desc: "시작" },
                { line: 240, desc: "저가 - 미역 - 저가 - 관카운터 패턴" },
                { line: 190, desc: "파도 - 저가or웅크 - 싸다구 패턴" },
                { line: 75,  desc: "3방향 무력 + 저가 + 카운터" },
                { line: 0,   desc: "클리어" }
            ]
        },
        gate2: {
            total: 400,
            points: [
                { line: 400, desc: "시작" },
                { line: 360, desc: "제물 쫄잡기 패턴" },
                { line: 320, desc: "줄연결 쫄잡고 무력 및 게이지 딜 타임어택" },
                { line: 280, desc: "붉은장판 3저가 3카운터" },
                { line: 200, desc: "검은 마법사(검마) 무력화 패턴" },
                { line: 100, desc: "앵그리버드" },
                { line: 0,   desc: "클리어" }
            ]
        }
    },
    mordum: {
        gate1: {
            // 1페이즈: 500줄 -> 0줄(변환, 클리어 아님) / 2페이즈: 발악쉴드 -> 클리어
            // sec = 시작부터 누적 시간(초), 기본 22분(1320초) = 1페이즈 20분 + 발악쉴드 2분
            // CLEAR TIME을 바꾸면 이 시간들이 비례해서 늘고 줄어듦 (피해량은 그대로, DPS만 변함)
            // nmSec = 나메 전용 누적 시간(초). 있으면 나메에서만 sec 대신 사용 (275~200줄 +20초: 160~100줄 -10초, 100~0줄 -10초)
            total: 500,
            shieldSec: 120,
            shieldLines: { normal: 36, hard: 36, nightmare: 45 },
            points: [
                { line: 500, sec: 0,    desc: "시작" },
                { line: 425, sec: 180,  desc: "심상 달리기",       nmClearNote: true },
                { line: 325, sec: 430,  desc: "색상 안전지대",     nmClearNote: true },
                { line: 275, sec: 550,  desc: "5연속 모루 저가",   nmClearNote: true },
                { line: 200, sec: 720,  nmSec: 740, desc: "빨왼 파오 구슬",     nmClearNote: true },
                { line: 160, sec: 830,  nmSec: 850, desc: "망치파괴후 안전지대", nmClearNote: true },
                { line: 100, sec: 970,  nmSec: 980, desc: "3결투",             nmClearNote: true },
                { line: 0,   sec: 1200, desc: "변환 (클리어 아님) · 1페이즈 종료" }
            ]
        }
    }
};

/* =============================================
   모르둠 나메 EX 에스더 택틱 + 체력 하향 시간 보정
   - 구간별 유저 딜 = 구간 체력 - (그 구간에서 쓰는 에스더 딜량) - (서폿 딜)
   - 서폿 딜은 1페이즈 시간(초)에 비례해 골고루 배분 (서폿 총딜 / 1페이즈 초)
   - 키 = 해당 에스더를 쓰는 구간의 '끝 줄'
       500~425  바훈 3칸        / 390~325  바스 3칸 / 320~275  바스 3칸
       159~100  바스 3칸+1칸    / 50~0     히든바훈 3칸
       발악쉴드  바스 3칸 + 바스 1칸(쉴드 추뎀)
   - 구간 시간(클각)은 기존 그대로 22분 기준 (MORDUM_TIME_SCALE.nightmare = 1, 500~425줄 3:00)
   ============================================= */
export const MORDUM_TIME_SCALE = { normal: 1, hard: 1, nightmare: 1 };
export const MORDUM_NM_TACTIC = {
    p1: {
        425: ["바훈 3칸"],
        325: ["바스티안 3칸"],
        275: ["바스티안 3칸"],
        100: ["바스티안 3칸", "바스티안 1칸"],
        0:   ["히든바훈 3칸"]
    },
    shield: ["바스티안 3칸", "바스티안 1칸 (쉴드 추뎀)"]
};






/* =============================================
   가디언 데이터
   ============================================= */
export const gato1730Bosses = [
    "루멘칼리고","가르가디스","스콜라키아","크라티오스","아게오로스","드렉탈라스","소나벨","베스칼",
    "쿤겔라니움","하누마탄","데스칼루다","이그렉시온","벨가누스","아카테스","엘버하스틱"
];
export const gato1750Bosses = [
    "루멘칼리고","가르가디스","스콜라키아","크라티오스","아게오로스","드렉탈라스","소나벨","베스칼",
    "쿤겔라니움","하누마탄","데스칼루다","이그렉시온","벨가누스","아카테스","엘버하스틱"
];
export const gato1770Bosses = [
    "루멘칼리고","가르가디스","스콜라키아","크라티오스","아게오로스","드렉탈라스","소나벨","베스칼",
    "쿤겔라니움","하누마탄","데스칼루다","이그렉시온","벨가누스","아카테스","엘버하스틱"
];

export const gato1730AvailableBosses = [
    "루멘칼리고","가르가디스","스콜라키아","크라티오스","아게오로스","드렉탈라스","소나벨","베스칼",
    "쿤겔라니움","하누마탄","데스칼루다","이그렉시온","벨가누스","아카테스","엘버하스틱"
];
export const gato1750AvailableBosses = [
    "루멘칼리고","가르가디스","스콜라키아","크라티오스","아게오로스","드렉탈라스","소나벨","베스칼",
    "쿤겔라니움","하누마탄","데스칼루다","이그렉시온","벨가누스","아카테스","엘버하스틱"
];
// 1770 티어는 시트에 15개 보스 데이터가 전부 존재 (엘버하스틱 포함 전체 오픈)
export const gato1770AvailableBosses = [
    "루멘칼리고","가르가디스","스콜라키아","크라티오스","아게오로스","드렉탈라스","소나벨","베스칼",
    "쿤겔라니움","하누마탄","데스칼루다","이그렉시온","벨가누스","아카테스","엘버하스틱"
];

export const gato1730Layout = [
    { boss:"루멘칼리고", startRow:66, shareCol:1, damageCol:3 },
    { boss:"가르가디스", startRow:66, shareCol:9, damageCol:11 },
    { boss:"스콜라키아", startRow:66, shareCol:17, damageCol:19 },
    { boss:"크라티오스", startRow:98, shareCol:1, damageCol:3 },
    { boss:"아게오로스", startRow:98, shareCol:9, damageCol:11 },
    { boss:"드렉탈라스", startRow:98, shareCol:17, damageCol:19 },
    { boss:"소나벨", startRow:130, shareCol:1, damageCol:3 },
    { boss:"베스칼", startRow:130, shareCol:9, damageCol:11 },
    { boss:"쿤겔라니움", startRow:266, shareCol:1, damageCol:3 },
    { boss:"하누마탄", startRow:266, shareCol:9, damageCol:11 },
    { boss:"데스칼루다", startRow:266, shareCol:17, damageCol:19 },
    { boss:"이그렉시온", startRow:298, shareCol:1, damageCol:3 },
    { boss:"벨가누스", startRow:298, shareCol:9, damageCol:11 },
    { boss:"아카테스", startRow:298, shareCol:17, damageCol:19 },
    { boss:"엘버하스틱", startRow:330, shareCol:1, damageCol:3 }
];

export const gato1750Layout = [
    { boss:"루멘칼리고", startRow:167, shareCol:1, damageCol:3 },
    { boss:"가르가디스", startRow:167, shareCol:9, damageCol:11 },
    { boss:"스콜라키아", startRow:167, shareCol:17, damageCol:19 },
    { boss:"크라티오스", startRow:199, shareCol:1, damageCol:3 },
    { boss:"아게오로스", startRow:199, shareCol:9, damageCol:11 },
    { boss:"드렉탈라스", startRow:199, shareCol:17, damageCol:19 },
    { boss:"소나벨", startRow:231, shareCol:1, damageCol:3 },
    { boss:"베스칼", startRow:231, shareCol:9, damageCol:11 },
    { boss:"쿤겔라니움", startRow:367, shareCol:1, damageCol:3 },
    { boss:"하누마탄", startRow:367, shareCol:9, damageCol:11 },
    { boss:"데스칼루다", startRow:367, shareCol:17, damageCol:19 },
    { boss:"이그렉시온", startRow:399, shareCol:1, damageCol:3 },
    { boss:"벨가누스", startRow:399, shareCol:9, damageCol:11 },
    { boss:"아카테스", startRow:399, shareCol:17, damageCol:19 },
    { boss:"엘버하스틱", startRow:431, shareCol:1, damageCol:3 }
];

// 신규: 가디언 토벌 1770 (구글시트 466~658행대, 딜지분 25%~50% 구간)
export const gato1770Layout = [
    { boss:"루멘칼리고", startRow:467, shareCol:1, damageCol:3 },
    { boss:"가르가디스", startRow:467, shareCol:9, damageCol:11 },
    { boss:"스콜라키아", startRow:467, shareCol:17, damageCol:19 },
    { boss:"크라티오스", startRow:499, shareCol:1, damageCol:3 },
    { boss:"아게오로스", startRow:499, shareCol:9, damageCol:11 },
    { boss:"드렉탈라스", startRow:499, shareCol:17, damageCol:19 },
    { boss:"소나벨", startRow:531, shareCol:1, damageCol:3 },
    { boss:"베스칼", startRow:531, shareCol:9, damageCol:11 },
    { boss:"쿤겔라니움", startRow:564, shareCol:1, damageCol:3 },
    { boss:"하누마탄", startRow:564, shareCol:9, damageCol:11 },
    { boss:"데스칼루다", startRow:564, shareCol:17, damageCol:19 },
    { boss:"이그렉시온", startRow:596, shareCol:1, damageCol:3 },
    { boss:"벨가누스", startRow:596, shareCol:9, damageCol:11 },
    { boss:"아카테스", startRow:596, shareCol:17, damageCol:19 },
    { boss:"엘버하스틱", startRow:628, shareCol:1, damageCol:3 }
];

export const gatoMeta = {
    "루멘칼리고": { type:{ text:"고대", cls:"type-ancient" }, attr:{ text:"암속성 취약", cls:"attr-dark" } },
    "가르가디스": { type:{ text:"야수", cls:"type-beast" }, attr:{ text:"토속성 취약", cls:"attr-earth" } },
    "스콜라키아": { type:{ text:"곤충", cls:"type-insect" }, attr:{ text:"토속성 취약", cls:"attr-earth" } },
    "크라티오스": { type:{ text:"야수", cls:"type-beast" }, attr:{ text:"뇌속성 취약", cls:"attr-lightning" } },
    "아게오로스": { type:{ text:"고대", cls:"type-ancient" }, attr:{ text:"성속성 취약", cls:"attr-holy" } },
    "드렉탈라스": { type:{ text:"야수", cls:"type-beast" }, attr:{ text:"화속성 취약", cls:"attr-fire" } },
    "소나벨": { type:{ text:"정령", cls:"type-spirit" }, attr:{ text:"암속성 취약", cls:"attr-dark" } },
    "베스칼": { type:{ text:"야수", cls:"type-beast" }, attr:{ text:"화속성 취약", cls:"attr-fire" } },
    "쿤겔라니움": { type:{ text:"고대", cls:"type-ancient" }, attr:{ text:"뇌속성 취약", cls:"attr-lightning" } },
    "하누마탄": { type:{ text:"고대", cls:"type-ancient" }, attr:{ text:"취약 없음", cls:"attr-none" } },
    "데스칼루다": { type:{ text:"야수", cls:"type-beast" }, attr:{ text:"수속성 취약", cls:"attr-water" } },
    "이그렉시온": { type:{ text:"고대", cls:"type-ancient" }, attr:{ text:"화속성 취약", cls:"attr-fire" } },
    "벨가누스": { type:{ text:"고대", cls:"type-ancient" }, attr:{ text:"성속성 취약", cls:"attr-holy" } },
    "아카테스": { type:{ text:"고대", cls:"type-ancient" }, attr:{ text:"암속성 취약", cls:"attr-dark" } },
    "엘버하스틱": { type:{ text:"고대", cls:"type-ancient" }, attr:{ text:"수속성 취약", cls:"attr-water" } }
};

// 메뉴별 강투/1인분/잔혈 기준 딜지분 (4인 레이드 vs 벨가르딘 8인 레이드)
export const PRECISION_SHARE_BY_MENU = {
    default: { tank: 30, one: 33, blood: 40 },
    belgardin: { tank: 15, one: 16.6, blood: 20 },
    mordum: { tank: 15, one: 16.6, blood: 20 },
    jongmak: { tank: 15, one: 16.6, blood: 20 }
};

// ===== 빠른 이동 카드 (경매 계산기 바로 위, 사이드 안내용) =====

export const QUICK_MOVE_PAGES = {
    level:     { label: "레벨별",        href: "level.html" },
    raid:      { label: "레이드별",      href: "raid.html" },
    serka:     { label: "세르카",        href: "serka.html" },
    cathedral: { label: "지평의 성당",   href: "cathedral.html" },
    belgardin: { label: "벨가르딘",      href: "belgardin.html" },
    guardian:  { label: "가디언 토벌",   href: "guardian.html" },
    extreme:   { label: "익스트림",      href: "extreme.html" },
};
export const QUICK_MOVE_SIMPLE_GROUP = ["level", "raid"];
export const QUICK_MOVE_PRECISION_GROUP = ["serka", "cathedral", "belgardin", "guardian", "extreme"];
export const QUICK_MOVE_SYNERGY_LINK = { label: "시너지표", href: "../class/synergy.html" };


export const RAID_MEMBER_COUNT = { serka: "4인", cathedral: "4인", belgardin: "8인", mordum: "8인" };