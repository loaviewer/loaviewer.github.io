/* =============================================
   전역 변수 & 상수
   ============================================= */
const CSV_URL = "https://docs.google.com/spreadsheets/d/1v4gfG-Lr0iFmiP0PXtVTsijdMziekQaZ-wBTWrobncY/export?format=csv&gid=0";

let currentMenu = "simple";
let currentCombo = "hard_gate1";
let currentGatoBoss = "벨가누스";
let currentGato1750Boss = "벨가누스;
let currentSimpleLevel = "1750";
let currentGuardianTier = "1750";
let acMembers = 4;
let currentSimpleRaid = "cathedral";

/* =============================================
   URL / canonical 갱신
   ============================================= */
function updateCanonicalAndUrl(menu) {
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
    gato1730: {},
    gato1750: {}
};

/* =============================================
   레이드 메타 정보
   ============================================= */
const raidMeta = {
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
    }
};

/* =============================================
   간편보기 기본 데이터
   ============================================= */
const simpleData = {
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
                theme: "b-gray", title: "4막 하드", node: "1720",
                rows: [
                    { gate: "1관", boss: "에키드나", badges: [{ text: "악마", cls: "type-demon" }], range: "1425 - 1900" },
                    { gate: "2관", boss: "아르모체", badges: [{ text: "고대", cls: "type-ancient" }, { text: "화속성 취약", cls: "attr-fire" }], range: "1575 - 2100" }
                ],
                gold: "38,000", bindGold: "", total: ""
            }
        ]
    }
};




/* =============================================
   레이드별 간편보기 메타
   ============================================= */
const simpleRaidMeta = {
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





/* =============================================
   EX 레이드 UI 데이터
   ============================================= */
const exRaidData = {
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
const serkaRewardData = {
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
const cathedralRewardData = {
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
   가디언 데이터
   ============================================= */
const gato1730Bosses = [
    "루멘칼리고","가르가디스","스콜라키아","크라티오스","아게오로스","드렉탈라스","소나벨","베스칼",
    "쿤겔라니움","하누마탄","데스칼루다","이그렉시온","벨가누스","아카테스","엘버하스틱"
];
const gato1750Bosses = [
    "루멘칼리고","가르가디스","스콜라키아","크라티오스","아게오로스","드렉탈라스","소나벨","베스칼",
    "쿤겔라니움","하누마탄","데스칼루다","이그렉시온","벨가누스","아카테스","엘버하스틱"
];

const gato1730AvailableBosses = [
    "루멘칼리고","가르가디스","스콜라키아","크라티오스","아게오로스","드렉탈라스","소나벨","베스칼",
    "쿤겔라니움","하누마탄","데스칼루다","이그렉시온","벨가누스"
];
const gato1750AvailableBosses = [
    "루멘칼리고","가르가디스","스콜라키아","크라티오스","아게오로스","드렉탈라스","소나벨","베스칼",
    "쿤겔라니움","하누마탄","데스칼루다","이그렉시온","벨가누스"
];

function isGato1730Available(boss) {
    return gato1730AvailableBosses.includes(boss);
}
function isGato1750Available(boss) {
    return gato1750AvailableBosses.includes(boss);
}

const gato1730Layout = [
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

const gato1750Layout = [
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

const gatoMeta = {
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

/* =============================================
   유틸 함수
   ============================================= */
function makeBadge(text, cls) {
    const emoji = getAttrEmoji(text, cls);
    const finalText = emoji ? `${emoji} ${text}` : text;
    return `<span class="badge ${cls}">${finalText}</span>`;
}

function fmt(v) {
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
    const m = String(v || "").match(/(\d+)%/);
    return m ? Number(m[1]) : null;
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

function setBaseTimeByMenu(menu) {
    const minutes = document.getElementById("minutes");
    const seconds = document.getElementById("seconds");
    const label = document.getElementById("timeBaseLabel");

    if (menu === "guardian") {
        minutes.value = 1;
        seconds.value = 50;
        label.textContent = "기본값: 1분 50초(110초)";
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
        const boss = currentGuardianTier === "1730" ? currentGatoBoss : currentGato1750Boss;
        return `가디언 토벌 : ${boss}`;
    }

    if (currentMenu === "serka" || currentMenu === "cathedral") {
        const info = raidMeta[currentMenu][currentCombo];
        return `${currentMenu === "serka" ? "세르카" : "지평의 성당"} : ${info.title.replace(/\s*\(.+\)/, "")} ${info.gateName}`;
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

    if (currentMenu === "serka" || currentMenu === "cathedral") {
        const lv = raidMeta[currentMenu][currentCombo].title.match(/\((\d+)\)/);
        return `입장레벨 : ${lv ? lv[1] : "-"}`;
    }

    return "";
}

function applyMenuFromQuery() {
    const menu = new URLSearchParams(window.location.search).get("menu");
    if (!menu) return;

  if (["serka", "cathedral", "guardian", "simple", "raid-simple", "egir-ex", "abr-ex"].includes(menu)) {
        if (menu === "egir-ex" || menu === "abr-ex") {
            currentMenu = "simple";
            currentSimpleLevel = menu;
        } else {
            currentMenu = menu;
        }
    
if (currentMenu === "serka") {
    currentCombo = "hard_gate1";
} else if (currentMenu === "cathedral") {
    currentCombo = "hard_gate1";
} else if (currentMenu === "guardian") {
    currentGuardianTier = "1750";
    currentGatoBoss = "벨가누스";
    currentGato1750Boss = "벨가누스";
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
        const boss = currentGuardianTier === "1730" ? currentGatoBoss : currentGato1750Boss;
        const info = gatoMeta[boss];
        box.innerHTML = `${makeBadge(info.type.text, info.type.cls)} ${makeBadge(info.attr.text, info.attr.cls)}`;
        return;
    }

    if (currentMenu === "serka" || currentMenu === "cathedral") {
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
                            1710 ~ 1750 구간에서 입장 가능한 레이드를 빠르게 확인하고,
                            강투컷 · 1인분 · 잔혈컷을 한눈에 비교할 수 있습니다.
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
                        <div class="simple-hero-stat-value">${currentSimpleLevel}</div>
                        <div class="simple-hero-stat-sub">${currentSimpleLevel} 레이드</div>
                    </div>

                    <div class="simple-hero-stat">
                        <div class="simple-hero-stat-label">LEVEL RANGE</div>
                        <div class="simple-hero-stat-value">1710 ~ 1750</div>
                        <div class="simple-hero-stat-sub">간편 요약 보기</div>
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
    const orderedLevels = ["1710", "1720", "1730", "1740", "1750"];
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
                          난이도별 강투 · 1인분 · 잔혈 컷을 한 번에 비교하고,
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
                        <div class="simple-hero-stat-value">${meta.label}</div>
                        <div class="simple-hero-stat-sub">${meta.sub}</div>
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

        const levels = ["1710", "1720", "1730", "1740", "1750"];

        el.innerHTML = `
            ${simpleHeroHtml()}

            <div class="simple-level-tabs">
                ${levels.map(lv => `
                    <button class="simple-level-tab ${currentSimpleLevel === lv ? "active" : ""}" data-simple-level="${lv}">
                        <span class="simple-level-tab-main">${lv}</span>
                        <span class="simple-level-tab-sub">레이드</span>
                    </button>
                `).join("")}
            </div>
        `;

        el.querySelectorAll(".simple-level-tab[data-simple-level]").forEach(btn => {
            btn.addEventListener("click", () => {
                currentSimpleLevel = btn.dataset.simpleLevel;
                renderTabs();
                renderTable();
            });
        });

        return;
    }

    if (currentMenu === "raid-simple") {
        el.classList.add("simple-tabs");

        const raids = ["cathedral", "serka", "finale", "act4"];

        el.innerHTML = `
            ${simpleRaidHeroHtml()}

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
        `;

        el.querySelectorAll(".simple-raid-tab[data-simple-raid]").forEach(btn => {
            btn.addEventListener("click", () => {
                currentSimpleRaid = btn.dataset.simpleRaid;
                renderTabs();
                renderTable();
            });
        });

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
    parsedData.gato1730 = {};
    parsedData.gato1750 = {};
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

/* =============================================
   테이블 렌더 헬퍼
   ============================================= */
function renderShareCell(share) {
    const tagMap = {
        30: { tag: "강투", cls: "tag-30" },
        33: { tag: "1인분", cls: "tag-33" },
        40: { tag: "잔혈", cls: "tag-40" }
    };

    const info = tagMap[share];

    const badgeSlot = info
        ? `<div class="share-tag-area"><span class="share-tag ${info.cls}">${info.tag}</span></div>`
        : `<div class="share-tag-area"></div>`;

    return `
        <td class="share-cell ${info ? "has-badge" : ""}">
            <div class="share-row">
                ${badgeSlot}
                <span class="share-pct">${share}%</span>
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
                        <img src="img/bind_gold.png" class="icon">
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
                        <img src="img/gold.png" class="icon">
                        <span class="gold-clear-label">클리어 골드</span>
                    </div>
                    <div class="gold-item-value gold-clear-value">${card.gold}</div>
                </div>
                <div class="gold-item">
                    <div class="gold-item-label">
                        <img src="img/wing_orb.png" class="icon">
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
                        <img src="img/gold.png" class="icon">
                        <span class="gold-clear-label">클리어 골드</span>
                    </div>
                    <div class="gold-item-value gold-clear-value">${card.gold}</div>
                </div>
                <div class="gold-operator">+</div>
                <div class="gold-item">
                    <div class="gold-item-label">
                        <img src="img/bind_gold.png" class="icon">
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
                    <img src="img/gold.png" class="icon">
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

    // 8인 레이드 (4막, 종막)
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
        const rangeParts = parseSimpleRangeParts(r.range, card.title);
        const hasTripleRange = !!rangeParts && !isPreparing;

        const rangeHtml = hasTripleRange
            ? `
                <div class="triple-range">
                    <div class="triple-part tank">
                        <span class="t-label">강투</span>
                        <span class="t-value">${rangeParts.tank}</span>
                    </div>
                    <div class="triple-part one">
                        <span class="t-label">1인분</span>
                        <span class="t-value">${rangeParts.one}</span>
                    </div>
                    <div class="triple-part blood">
                        <span class="t-label">잔혈</span>
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

    if (!meta) {
        document.getElementById("mainContent").innerHTML =
            '<div class="coming-soon"><h3>준비중</h3><p>데이터 준비중입니다.</p></div>';
        return;
    }

    document.getElementById("mainContent").innerHTML = `
        <div class="simple-view">
            <div class="simple-stack">
                ${cards.length > 0
                    ? cards.map(simpleCardHtml).join("")
                    : "<div class='coming-soon'><h3>준비중</h3><p>곧 업데이트 예정입니다.</p></div>"}
            </div>
        </div>
    `;
}


function renderSimpleView() {
    // ★ HTML에 정적으로 삽입된 기본 콘텐츠 제거
    const defaultContent = document.getElementById("defaultSimpleContent");
    if (defaultContent) defaultContent.remove();

    if (currentSimpleLevel === "egir-ex" || currentSimpleLevel === "abr-ex") {
        document.getElementById("mainContent").innerHTML = renderExView(currentSimpleLevel);
        return;
    }

    const data = simpleData[currentSimpleLevel];
    if (!data) {
        document.getElementById("mainContent").innerHTML = '<div class="coming-soon"><h3>준비중</h3><p>데이터 준비중입니다.</p></div>';
        return;
    }

    document.getElementById("mainContent").innerHTML = `
        <div class="simple-view">
            <div class="simple-stack">
                ${data.cards.length > 0
                    ? data.cards.map(simpleCardHtml).join("")
                    : "<div class='coming-soon'><h3>준비중</h3><p>곧 업데이트 예정입니다.</p></div>"}
            </div>
        </div>
    `;
}

/* =============================================
   파티 DPS
   ============================================= */
function getCurrentRowsForPartyDps() {
    if (currentMenu === "simple") return [];

    if (currentMenu === "guardian") {
        const tier = currentGuardianTier;
        const boss = tier === "1730" ? currentGatoBoss : currentGato1750Boss;
        const isAvail = tier === "1730" ? isGato1730Available(boss) : isGato1750Available(boss);
        if (!isAvail) return [];
        return tier === "1730"
            ? (parsedData.gato1730[boss] || [])
            : (parsedData.gato1750[boss] || []);
    }

    if (currentMenu === "serka" || currentMenu === "cathedral") {
        const info = raidMeta[currentMenu][currentCombo];
        return parsedData[currentMenu]?.[info.diffKey] || [];
    }

    return [];
}

function getDamageFromRow(row) {
    if (!row) return 0;

    if (currentMenu === "guardian") return row.damage || 0;

    if (currentMenu === "serka" || currentMenu === "cathedral") {
        return raidMeta[currentMenu][currentCombo].gateKey === "gate1"
            ? row.g1 || 0
            : row.g2 || 0;
    }

    return row.damage || 0;
}

function getPartyDpsValue() {
    const rows = getCurrentRowsForPartyDps();
    if (!rows.length) return null;

    let found = null;
    for (const share of [33, 30, 40]) {
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
        !(currentGuardianTier === "1730" ? isGato1730Available(currentGatoBoss) : isGato1750Available(currentGato1750Boss));

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
    const stageText = tier === "1730" ? "잔영 : 1단계" : "잔영 : 2단계";

    return `
        <div class="p-hero hero-guardian">
            <div class="p-hero-inner">
                <div class="p-hero-left">
                    <div class="p-hero-copy">
                        <div class="p-hero-kicker">PRECISION · GUARDIAN RAID</div>

                        <div class="p-hero-title-row">
                            <div class="p-hero-icon">🐉</div>
                            <div class="p-hero-title-wrap">
                                <h2 class="p-hero-title">가디언 토벌</h2>
                                <div class="p-hero-subtitle">${stageText}</div>
                            </div>
                        </div>

                        <div class="p-hero-badges">
                            <span class="p-badge b-type">${bossInfo.type.text}</span>
                            <span class="p-badge b-attr">${weakEmoji ? `${weakEmoji} ` : ""}${bossInfo.attr.text}</span>
                        </div>

                        <p class="p-hero-desc">
                            레벨과 보스를 선택하면 해당 가디언의 딜지분과 DPS를 실시간으로 확인할 수 있습니다.
                        </p>
                        <p class="p-hero-desc" style="margin-top:6px;">
                            가디언 토벌은 잔영 단계에 따라 요구 DPS가 크게 달라지며, 강투컷·1인분·잔혈컷 기준으로
                            자신의 딜 기여도를 빠르게 비교할 수 있습니다.
                        </p>
                    </div>

                    <div class="p-hero-pills">
                        <span class="p-pill ${tier === "1730" ? "active" : ""}">1730 가디언</span>
                        <span class="p-pill ${tier === "1750" ? "active" : ""}">1750 가디언</span>
                    </div>
                </div>

                <div class="p-hero-right">
                    <div class="p-stat">
                        <div class="p-stat-label">입장 레벨</div>
                        <div class="p-stat-value">${tier}</div>
                    </div>

                    <div class="p-stat">
                        <div class="p-stat-label">보스명</div>
                        <div class="p-stat-value">${bossElementEmoji} ${boss}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}


/* =============================================
   보상 위젯 HTML 생성
   ============================================= */
function makeRewardWidget(menu, comboKey) {
    const dataSource = menu === "serka" ? serkaRewardData : cathedralRewardData;
    const data = dataSource[comboKey];
    if (!data) return "";

    const widgetId = `rewardWidget_${menu}`;
    const moreId = `rewardMore_${menu}`;
    const moreBtnId = `rewardMoreBtn_${menu}`;

    const itemSlots = (items) => items.map(item =>
        `<div class="rw-slot" title="${item.name}"><img src="${item.src}"><span class="rw-count">${item.count}</span></div>`
    ).join("");

    const goldLine = (gold) => gold ? `
        <div class="rw-currency">
            <div class="rw-currency-left"><img class="rw-currency-icon" src="https://cdn-lostark.game.onstove.com/efui_iconatlas/money/money_4.png"><span>골드</span></div>
            <span class="rw-gold">${gold}</span>
        </div>` : "";

    const shardLine = (shard) => shard ? `
        <div class="rw-currency">
            <div class="rw-currency-left"><img class="rw-currency-icon" src="https://cdn-lostark.game.onstove.com/efui_iconatlas/money/money_15.png"><span>운명의 파편</span></div>
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
    const dataSource = menu === "serka" ? serkaRewardData : cathedralRewardData;
    const data = dataSource[comboKey];
    if (!data) return "";

    const moreId = `mobileRewardMore_${menu}`;
    const moreBtnId = `mobileRewardMoreBtn_${menu}`;

    const itemSlots = (items) => items.map(item =>
        `<div class="rw-slot" title="${item.name}"><img src="${item.src}"><span class="rw-count">${item.count}</span></div>`
    ).join("");

    const goldLine = (gold) => gold ? `
        <div class="rw-currency">
            <div class="rw-currency-left">
                <img class="rw-currency-icon" src="https://cdn-lostark.game.onstove.com/efui_iconatlas/money/money_4.png">
                <span>골드</span>
            </div>
            <span class="rw-gold">${gold}</span>
        </div>` : "";

    const shardLine = (shard) => shard ? `
        <div class="rw-currency">
            <div class="rw-currency-left">
                <img class="rw-currency-icon" src="https://cdn-lostark.game.onstove.com/efui_iconatlas/money/money_15.png">
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

function makeRaidPrecisionHero(menu, meta, currentDiff) {
    const isSerka = menu === "serka";
    const raidTitle = isSerka ? "세르카" : "지평의 성당";
    const themeClass = isSerka ? "hero-serka" : "hero-cathedral";
    const kicker = isSerka ? "PRECISION · SERKA" : "PRECISION · CATHEDRAL";
    const icon = isSerka ? "🧹" : "⛪";
    const subtitle = isSerka ? "그림자 레이드" : "어비스 던전";

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
        : [
            { key: "normal", text: "1단계 · 1700" },
            { key: "hard", text: "2단계 · 1720" },
            { key: "nightmare", text: "3단계 · 1750" }
        ];

    return `
        <div class="p-hero ${themeClass}">
            <div class="p-hero-inner">
                <div class="p-hero-left">
                    <div class="p-hero-copy">
                        <div class="p-hero-kicker">${kicker}</div>

                        <div class="p-hero-title-row">
                            <div class="p-hero-icon">${icon}</div>
                            <div class="p-hero-title-wrap">
                                <h2 class="p-hero-title">${raidTitle}</h2>
                                <div class="p-hero-subtitle">${subtitle}</div>
                            </div>
                        </div>

                        <div class="p-hero-badges">
                            <span class="p-badge b-type">${meta.type.text}</span>
                            <span class="p-badge b-attr">${attrEmoji ? `${attrEmoji} ` : ""}${meta.attr.text}</span>
                        </div>

                        
<p class="p-hero-desc">
                            클리어 시간을 직접 입력해 딜지분에 따른 DPS를 실시간으로 확인할 수 있습니다.
                        </p>
                        <p class="p-hero-desc" style="margin-top:6px;">
                            강투컷은 파티 내 상위 기여도, 1인분은 인원수 기준 균등 분배, 잔혈컷은 압도적 기여 기준입니다.
                            같은 딜지분이라도 클리어 시간이 짧을수록 요구되는 DPS는 높아집니다.
                        </p>
                    </div>
                  
                                      <div class="p-hero-pills">



                        ${pills.map(p => `
                            <span class="p-pill ${currentDiff === p.key ? "active" : ""}">${p.text}</span>
                        `).join("")}
                                    </div>
                </div>

                <div class="p-hero-right">

                    <div class="p-stat">
                        <div class="p-stat-label">입장 레벨</div>
                        <div class="p-stat-value">${entryLevel}</div>
                    </div>

                    <div class="p-stat">
                        <div class="p-stat-label">난이도 · 관문</div>
                        <div class="p-stat-value">${diffLabel} · ${gateLabel}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/* =============================================
   가디언 컨트롤
   ============================================= */


function makeGuardianControl(tier, boss, bossList, availList, bossInfo) {
    const oldBosses = ["루멘칼리고","가르가디스","스콜라키아","크라티오스","아게오로스","드렉탈라스","소나벨","베스칼"];

    const tierChecks = ["1730", "1750"].map(t => {
        const isActive = tier === t;

        return `
            <div class="guardian-tier-chip ${isActive ? "active" : ""}" data-tier="${t}">
                <span class="guardian-tier-chip-check">${isActive ? "✓" : ""}</span>
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
                ${isActive ? '<div class="gd-item-check">✓</div>' : ""}
                ${isAvail ? "" : '<span class="gd-pending-tag">준비중</span>'}
            </div>
        `;
    };

    const oldItems = bossList.filter(b => oldBosses.includes(b)).map(makeDropdownItem).join("");
    const newItems = bossList.filter(b => !oldBosses.includes(b)).map(makeDropdownItem).join("");
    const triggerEmoji = getGuardianElementEmojiFromWeakness(bossInfo.attr.text);

    return `
        <div class="precision-control guardian-inline-control">
            <div class="guardian-inline-row">
                <div class="guardian-top-tools">
                    <div class="guardian-tier-inline">
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
function makePrecisionSummary(row30, row33, row40, getDmgFn, totalSec) {
    const makeCard = (label, labelCls, cardCls, dpsCls, share, row) => {
        const dmg = row ? getDmgFn(row) : 0;
        const dps = row ? (dmg / totalSec).toFixed(1) : "-";
        return `
            <div class="precision-summary-card ${cardCls}">
                <div class="precision-summary-label ${labelCls}">${label}</div>
                <div class="precision-summary-share">딜지분 ${share}%</div>
                <div class="precision-summary-dmg">${fmt(dmg)}<span class="precision-summary-unit"> 억</span></div>
                <div class="precision-summary-dps ${dpsCls}">DPS ${dps}억</div>
            </div>
        `;
    };

    return `
        <div class="precision-summary-cards">
            ${makeCard("강투컷", "precision-label-tank", "precision-card-tank", "precision-dps-tank", 30, row30)}
            ${makeCard("1인분", "precision-label-one", "precision-card-one", "precision-dps-one", 33, row33)}
            ${makeCard("잔혈컷", "precision-label-blood", "precision-card-blood", "precision-dps-blood", 40, row40)}
        </div>
    `;
}

/* =============================================
   메인 테이블 렌더링
   ============================================= */


function renderTable() {
    updateTimeDisplay();
    const totalSec = getTotalSeconds();

    
    const isSimpleQuickView =
    currentMenu === "simple" &&
    currentSimpleLevel !== "egir-ex" &&
    currentSimpleLevel !== "abr-ex";

const isRaidSimpleQuickView = currentMenu === "raid-simple";
    const isMobilePrecisionView = currentMenu === "serka" || currentMenu === "cathedral";
    document.body.classList.toggle("mobile-precision-view", isMobilePrecisionView);



    const shouldHideTopline =
    isSimpleQuickView ||
    isRaidSimpleQuickView ||
    currentMenu === "guardian" ||
    currentMenu === "serka" ||
    currentMenu === "cathedral" ||
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

    if (currentMenu === "raid-simple") {
        renderRaidSimpleView();
    } else {
        renderSimpleView();
    }
    return;
}


    setClearTimeDisabled(false);

    // 이하 기존 코드 그대로






    // === 가디언 토벌 ===
    if (currentMenu === "guardian") {
        document.getElementById("contentTitle").textContent = "";
        document.getElementById("tableTitle").textContent = "";
        document.getElementById("titleMeta").innerHTML = "";

        const tier = currentGuardianTier;
        const boss = tier === "1730" ? currentGatoBoss : currentGato1750Boss;
        const bossInfo = gatoMeta[boss];
        const isAvail = tier === "1730" ? isGato1730Available(boss) : isGato1750Available(boss);
        const bossList = tier === "1730" ? gato1730Bosses : gato1750Bosses;
        const availList = tier === "1730" ? gato1730AvailableBosses : gato1750AvailableBosses;

        if (!isAvail) {
            document.getElementById("mainContent").innerHTML = `
                ${makeGuardianHero(tier, boss, bossInfo)}
                ${makeGuardianControl(tier, boss, bossList, availList, bossInfo)}


                <div class="coming-soon"><h3>${boss} 준비중</h3><p>해당 보스의 가디언 토벌 데이터는 순차적으로 공개됩니다.</p></div>
            `;
        } else {
            const rows = tier === "1730"
                ? (parsedData.gato1730[boss] || [])
                : (parsedData.gato1750[boss] || []);

            const getDmg = (r) => r.damage || 0;
            const findRow = (share) => rows.find(r => r.share === share && getDmg(r) > 0);

            const row30 = findRow(30);
            const row33 = findRow(33);
            const row40 = findRow(40);

            const tableRowsHtml = rows.length
                ? rows.map(r => {
                    let cls = "";
                    if (r.share === 30) cls = "row-30";
                    if (r.share === 33) cls = "row-33";
                    if (r.share === 40) cls = "row-40";
                    return `<tr class="${cls}">${renderShareCell(r.share)}<td><span class="damage-wrap"><span class="damage-num">${fmt(r.damage)}</span><span class="damage-unit">억</span></span></td><td class="dps-cell"><span class="dps-pill">${(r.damage / totalSec).toFixed(1)}억</span></td></tr>`;
                }).join("")
                : '<tr><td colspan="3">데이터 없음</td></tr>';

            document.getElementById("mainContent").innerHTML = `
                ${makeGuardianHero(tier, boss, bossInfo)}
                ${makeGuardianControl(tier, boss, bossList, availList, bossInfo)}
                ${makePrecisionSummary(row30, row33, row40, getDmg, totalSec)}
                <div class="precision-table-panel">
                    <div class="precision-table-head">
                        <div class="precision-table-title">${boss} (${tier}) 상세 딜지분</div>
                        
<div class="precision-table-badge" id="precisionTimeBadge">전분시간 : ${String(Math.floor(totalSec / 60)).padStart(2, "0")}분 ${String(totalSec % 60).padStart(2, "0")}초</div>

                    </div>
                    <div class="table-wrap">
                        <table id="dataTable">
                            <thead>
                                <tr><th>딜지분</th><th>피해/억</th><th>DPS</th></tr>
                            </thead>
                            <tbody>${tableRowsHtml}</tbody>
                        </table>
                    </div>
                </div>
            `;
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
                if (currentGuardianTier === "1730") {
                    currentGatoBoss = selectedBoss;
                } else {
                    currentGato1750Boss = selectedBoss;
                }
                renderTable();
            });
        });


    const guardianMobileTimeBtn = document.getElementById("guardianMobileTimeBtn");
    if (guardianMobileTimeBtn) {
        guardianMobileTimeBtn.addEventListener("click", openMobileTimeModal);
    }
        updatePartyDpsDisplay();
        return;
    }



// === 세르카 / 성당 ===
if (currentMenu === "serka" || currentMenu === "cathedral") {
    document.getElementById("contentTitle").textContent = "";
    document.getElementById("tableTitle").textContent = "";
    document.getElementById("titleMeta").innerHTML = "";

    const meta = raidMeta[currentMenu][currentCombo];
    const dataRows = parsedData[currentMenu]?.[meta.diffKey] || [];
    const raidName = currentMenu === "serka" ? "세르카" : "지평의 성당";

    const getDamage = (row) => meta.gateKey === "gate1" ? row.g1 : row.g2;
    const findRow = (share) => dataRows.find(r => r.share === share && getDamage(r) > 0);
    const row30 = findRow(30);
    const row33 = findRow(33);
    const row40 = findRow(40);

    const bossNames = currentMenu === "serka"
        ? { gate1: "세르카", gate2: "코르부스" }
        : { gate1: "대주교", gate2: "광신의 인도자" };

    const groups = currentMenu === "serka"
        ? [
            { diffKey: "normal", label: "노말", level: "1710", cls: "pd-green" },
            { diffKey: "hard", label: "하드", level: "1730", cls: "pd-gold" },
            { diffKey: "nightmare", label: "나메", level: "1740", cls: "pd-purple" }
        ]
        : [
            { diffKey: "normal", label: "1단계", level: "1700", cls: "pd-green" },
            { diffKey: "hard", label: "2단계", level: "1720", cls: "pd-gold" },
            { diffKey: "nightmare", label: "3단계", level: "1750", cls: "pd-purple" }
        ];

    const currentDiff = currentCombo.split("_")[0];
    const currentGate = currentCombo.split("_")[1];

    const tableRowsHtml = dataRows.length
        ? dataRows.map(r => {
            let cls = "";
            if (r.share === 30) cls = "row-30";
            if (r.share === 33) cls = "row-33";
            if (r.share === 40) cls = "row-40";
            const dmg = getDamage(r);
            return `<tr class="${cls}">${renderShareCell(r.share)}<td><span class="damage-wrap"><span class="damage-num">${fmt(dmg)}</span><span class="damage-unit">억</span></span></td><td class="dps-cell"><span class="dps-pill">${(dmg / totalSec).toFixed(1)}억</span></td></tr>`;
        }).join("")
        : '<tr><td colspan="3">데이터 없음</td></tr>';

    document.getElementById("mainContent").innerHTML = `
        ${makeRaidPrecisionHero(currentMenu, meta, currentDiff)}

                <div class="precision-layout-split">
            <div class="precision-control compact-precision-control">
                <div class="precision-inline-group">
                    <div class="precision-control-label">난이도 선택</div>
                    <div class="precision-diff-inline">
                        ${groups.map(g => {
                            const isActive = currentDiff === g.diffKey;
                            return `
                                <div class="precision-diff-chip ${isActive ? `${g.cls} active` : ""}" data-diff="${g.diffKey}">
                                    <span class="precision-diff-chip-check">${isActive ? "✓" : ""}</span>
                                    <span class="precision-diff-chip-main">${g.label}</span>
                                    <span class="precision-diff-chip-sub">${g.level}</span>
                                </div>
                            `;
                        }).join("")}
                    </div>
                </div>

                <div class="precision-inline-group">
                    <div class="precision-control-label">관문 선택</div>
                    <div class="precision-gate-inline">
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

        ${makePrecisionSummary(row30, row33, row40, getDamage, totalSec)}



        <div class="precision-table-panel">
            <div class="precision-table-head">
                <div class="precision-table-title">${raidName} ${meta.title.replace(/\s*\(.+\)/, "")} ${meta.gateName} 상세 딜지분</div>
                <div class="precision-table-badge" id="precisionTimeBadge">전분시간 : ${String(Math.floor(totalSec / 60)).padStart(2, "0")}분 ${String(totalSec % 60).padStart(2, "0")}초</div>
            </div>
            <div class="table-wrap">
                <table id="dataTable">
                    <thead>
                        <tr><th>딜지분</th><th>피해/억</th><th>DPS</th></tr>
                    </thead>
                    <tbody>${tableRowsHtml}</tbody>
                </table>
            </div>
        </div>
    `;

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
            renderTable();
        });
    });

    bindRewardMoreToggle(currentMenu);

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



    updatePartyDpsDisplay();
    return;
}

}




/* =============================================
   CSV 로드
   ============================================= */
async function loadCSV() {
    try {
        const resp = await fetch(CSV_URL);
        const lines = (await resp.text()).split(/\r?\n/);
        clearAllData();
        parseCathedral(lines);
        parseSerka(lines);
        parseGato1730(lines);
        parseGato1750(lines);
        renderTabs();
        renderTable();
        const statusEl = document.getElementById("status");
        statusEl.textContent = "연동 완료";
        statusEl.style.display = "block";
        setTimeout(() => { statusEl.style.display = "none"; }, 2000);
    } catch (err) {
        console.error(err);
        document.getElementById("status").style.display = "none";
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
    const raw = (document.getElementById("ac-price").value || "").replace(/,/g, "");
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
    guideModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeGuideModal() {
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
        return "레벨별 레이드 잔혈컷을 빠르게 확인할 수 있습니다.";
    }

    if (currentMenu === "serka" || currentMenu === "cathedral") {
        return "클리어 타임을 입력하면 피해량과 DPS가 실시간으로 반영됩니다.";
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

        // 다른 메뉴로 이동할 때 아크 그리드 모드 해제
        document.body.classList.remove("arc-grid-mode");

        // active 처리
        document.querySelectorAll(".menu-item").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // 메뉴별 상태 초기화
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
            currentCombo = "hard_gate1";
        } 
        else if (menu === "cathedral") {
            currentMenu = "cathedral";
            currentCombo = "hard_gate1";
        } 
        else if (menu === "guardian") {
            currentMenu = "guardian";
            currentGuardianTier = "1750";
            currentGatoBoss = "벨가누스";
            currentGato1750Boss = "벨가누스";
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


        // 모바일 홈 버튼으로 들어온 경우 콘텐츠 모드로 전환
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
openGuideBtn.addEventListener("click", () => {
    openGuideModal();
});

closeGuideBtn.addEventListener("click", closeGuideModal);

guideModal.addEventListener("click", e => {
    if (e.target === guideModal) closeGuideModal();
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape" && guideModal.classList.contains("show")) {
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
document.getElementById("ac-price").addEventListener("input", e => {
    let val = e.target.value.replace(/,/g, "").replace(/[^0-9]/g, "");
    e.target.value = val ? Number(val).toLocaleString("ko-KR") : "";
    acUpdate();
});


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

if (currentMenu === "simple") {
    renderTabs();
    renderTable();
}

loadCSV();
acUpdate();
