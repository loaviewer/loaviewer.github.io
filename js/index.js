// 개인정보처리방침 팝업 제어
const privacyModal = document.getElementById('privacyModal');
const openPrivacyBtn = document.getElementById('openPrivacy');
const closePrivacyBtn = document.getElementById('closePrivacy');

if(openPrivacyBtn && privacyModal) {
    openPrivacyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        privacyModal.style.display = 'flex';
    });
}
if(closePrivacyBtn && privacyModal) {
    closePrivacyBtn.addEventListener('click', () => {
        privacyModal.style.display = 'none';
    });
}
window.addEventListener('click', (e) => {
    if (e.target === privacyModal) {
        privacyModal.style.display = 'none';
    }
});





        /* =============================================
           전역 변수 & 상수
           ============================================= */
        const CSV_URL = "https://docs.google.com/spreadsheets/d/1v4gfG-Lr0iFmiP0PXtVTsijdMziekQaZ-wBTWrobncY/export?format=csv&gid=0";

        let calYear, calMonth;
        let currentMenu = "simple";
        let currentCombo = "hard_gate1";
        let currentGatoBoss = "루멘칼리고";
        let currentGato1750Boss = "스콜라키아";
        let currentSimpleLevel = "1750";
        let acMembers = 4;

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
                    attr: { text: "속성 없음", cls: "attr-none" },
                    tierClass: "tab-tier-normal"
                },
                normal_gate2: {
                    diffKey: "normal", gateKey: "gate2",
                    title: "노말 (1710)", gateName: "2관",
                    type: { text: "고대", cls: "type-ancient" },
                    attr: { text: "성속성 취약", cls: "attr-holy" },
                    tierClass: "tab-tier-normal"
                },
                hard_gate1: {
                    diffKey: "hard", gateKey: "gate1",
                    title: "하드 (1730)", gateName: "1관",
                    type: { text: "인간", cls: "type-human" },
                    attr: { text: "속성 없음", cls: "attr-none" },
                    tierClass: "tab-tier-hard"
                },
                hard_gate2: {
                    diffKey: "hard", gateKey: "gate2",
                    title: "하드 (1730)", gateName: "2관",
                    type: { text: "고대", cls: "type-ancient" },
                    attr: { text: "성속성 취약", cls: "attr-holy" },
                    tierClass: "tab-tier-hard"
                },
                nightmare_gate1: {
                    diffKey: "nightmare", gateKey: "gate1",
                    title: "나메 (1740)", gateName: "1관",
                    type: { text: "인간", cls: "type-human" },
                    attr: { text: "속성 없음", cls: "attr-none" },
                    tierClass: "tab-tier-nightmare"
                },
                nightmare_gate2: {
                    diffKey: "nightmare", gateKey: "gate2",
                    title: "나메 (1740)", gateName: "2관",
                    type: { text: "고대", cls: "type-ancient" },
                    attr: { text: "성속성 취약", cls: "attr-holy" },
                    tierClass: "tab-tier-nightmare"
                }
            },
            cathedral: {
                normal_gate1: {
                    diffKey: "normal", gateKey: "gate1",
                    title: "1단계 (1700)", gateName: "1관",
                    type: { text: "인간", cls: "type-human" },
                    attr: { text: "암속성 취약", cls: "attr-dark" },
                    tierClass: "tab-tier-normal"
                },
                normal_gate2: {
                    diffKey: "normal", gateKey: "gate2",
                    title: "1단계 (1700)", gateName: "2관",
                    type: { text: "인간", cls: "type-human" },
                    attr: { text: "암속성 취약", cls: "attr-dark" },
                    tierClass: "tab-tier-normal"
                },
                hard_gate1: {
                    diffKey: "hard", gateKey: "gate1",
                    title: "2단계 (1720)", gateName: "1관",
                    type: { text: "인간", cls: "type-human" },
                    attr: { text: "암속성 취약", cls: "attr-dark" },
                    tierClass: "tab-tier-hard"
                },
                hard_gate2: {
                    diffKey: "hard", gateKey: "gate2",
                    title: "2단계 (1720)", gateName: "2관",
                    type: { text: "인간", cls: "type-human" },
                    attr: { text: "암속성 취약", cls: "attr-dark" },
                    tierClass: "tab-tier-hard"
                },
                nightmare_gate1: {
                    diffKey: "nightmare", gateKey: "gate1",
                    title: "3단계 (1750)", gateName: "1관",
                    type: { text: "인간", cls: "type-human" },
                    attr: { text: "암속성 취약", cls: "attr-dark" },
                    tierClass: "tab-tier-nightmare"
                },
                nightmare_gate2: {
                    diffKey: "nightmare", gateKey: "gate2",
                    title: "3단계 (1750)", gateName: "2관",
                    type: { text: "인간", cls: "type-human" },
                    attr: { text: "암속성 취약", cls: "attr-dark" },
                    tierClass: "tab-tier-nightmare"
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
                        gold: "20,000", bindGold: "20,000", total: "40,000"
                    },
                    {
                        theme: "b-green", title: "세르카 노말", node: "1710",
                        rows: [
                            { gate: "1관", boss: "세르카", badges: [{ text: "인간", cls: "type-human" }], range: "1100 - 1480" },
                            { gate: "2관", boss: "코르부스", badges: [{ text: "고대", cls: "type-ancient" }, { text: "성속성 취약", cls: "attr-holy" }], range: "1430 - 1900" }
                        ],
                        gold: "17,500", bindGold: "17,500", total: "35,000"
                    },
                    {
                        theme: "b-green", title: "4막 노말", node: "1700",
                        rows: [
                            { gate: "1관", boss: "에키드나", badges: [{ text: "악마", cls: "type-demon" }], range: "740 - 990" },
                            { gate: "2관", boss: "아르모체", badges: [{ text: "고대", cls: "type-ancient" }, { text: "화속성 취약", cls: "attr-fire" }], range: "950 - 1270" }
                        ],
                        gold: "16,500", bindGold: "16,500", total: "33,000"
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
                        gold: "42,000", bindGold: "", total: ""
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
                        gold: "20,000", bindGold: "20,000", total: "40,000"
                    },
                    {
                        theme: "b-gray", title: "세르카 노말", node: "1710",
                        rows: [
                            { gate: "1관", boss: "세르카", badges: [{ text: "인간", cls: "type-human" }], range: "1100 - 1480" },
                            { gate: "2관", boss: "코르부스", badges: [{ text: "고대", cls: "type-ancient" }, { text: "성속성 취약", cls: "attr-holy" }], range: "1430 - 1900" }
                        ],
                        gold: "17,500", bindGold: "17,500", total: "35,000"
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
                            { gate: "1관", boss: "카제로스", badges: [{ text: "대악마", cls: "type-archdemon" }], range: "2370 - 3170" },
                            { gate: "2관", boss: "카제로스", badges: [{ text: "대악마", cls: "type-archdemon" }, { text: "신", cls: "type-divine" }], range: "4200 - 5625" }
                        ],
                        gold: "52,000", bindGold: "", total: ""
                    },
                    {
                        theme: "b-gold", title: "4막 하드", node: "1720",
                        rows: [
                            { gate: "1관", boss: "에키드나", badges: [{ text: "악마", cls: "type-demon" }], range: "1425 - 1900" },
                            { gate: "2관", boss: "아르모체", badges: [{ text: "고대", cls: "type-ancient" }, { text: "화속성 취약", cls: "attr-fire" }], range: "1575 - 2100" }
                        ],
                        gold: "42,000", bindGold: "", total: ""
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
                            { gate: "1관", boss: "카제로스", badges: [{ text: "대악마", cls: "type-archdemon" }], range: "2370 - 3170" },
                            { gate: "2관", boss: "카제로스", badges: [{ text: "대악마", cls: "type-archdemon" }, { text: "신", cls: "type-divine" }], range: "4200 - 5625" }
                        ],
                        gold: "52,000", bindGold: "", total: ""
                    },
                    {
                        theme: "b-gold", title: "4막 하드", node: "1720",
                        rows: [
                            { gate: "1관", boss: "에키드나", badges: [{ text: "악마", cls: "type-demon" }], range: "1425 - 1900" },
                            { gate: "2관", boss: "아르모체", badges: [{ text: "고대", cls: "type-ancient" }, { text: "화속성 취약", cls: "attr-fire" }], range: "1575 - 2100" }
                        ],
                        gold: "42,000", bindGold: "", total: ""
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
                            { gate: "1관", boss: "카제로스", badges: [{ text: "대악마", cls: "type-archdemon" }], range: "2370 - 3170" },
                            { gate: "2관", boss: "카제로스", badges: [{ text: "대악마", cls: "type-archdemon" }, { text: "신", cls: "type-divine" }], range: "4200 - 5625" }
                        ],
                        gold: "52,000", bindGold: "", total: ""
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
                        gold: "42,000", bindGold: "", total: ""
                    }
                ]
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
           가토 보스 목록 & 레이아웃
           ============================================= */
        const gato1730Bosses = ["루멘칼리고", "가르가디스", "스콜라키아", "크라티오스", "아게오로스", "드렉탈라스", "소나벨", "베스칼"];
        const gato1750Bosses = ["루멘칼리고", "가르가디스", "스콜라키아", "크라티오스", "아게오로스", "드렉탈라스", "소나벨", "베스칼"];
        const gato1750AvailableBosses = ["루멘칼리고", "가르가디스", "스콜라키아", "크라티오스", "아게오로스", "드렉탈라스", "소나벨", "베스칼"];

        const gato1730Layout = [
            { boss: "루멘칼리고", startRow: 66,  shareCol: 1,  damageCol: 3 },
            { boss: "가르가디스", startRow: 66,  shareCol: 9,  damageCol: 11 },
            { boss: "스콜라키아", startRow: 66,  shareCol: 17, damageCol: 19 },
            { boss: "크라티오스", startRow: 98,  shareCol: 1,  damageCol: 3 },
            { boss: "아게오로스", startRow: 98,  shareCol: 9,  damageCol: 11 },
            { boss: "드렉탈라스", startRow: 98,  shareCol: 17, damageCol: 19 },
            { boss: "소나벨",     startRow: 130, shareCol: 1,  damageCol: 3 },
            { boss: "베스칼",     startRow: 130, shareCol: 9,  damageCol: 11 }
        ];

        const gato1750Layout = [
            { boss: "루멘칼리고", startRow: 167, shareCol: 1,  damageCol: 3 },
            { boss: "가르가디스", startRow: 167, shareCol: 9,  damageCol: 11 },
            { boss: "스콜라키아", startRow: 167, shareCol: 17, damageCol: 19 },
            { boss: "크라티오스", startRow: 199, shareCol: 1,  damageCol: 3 },
            { boss: "아게오로스", startRow: 199, shareCol: 9,  damageCol: 11 },
            { boss: "드렉탈라스", startRow: 199, shareCol: 17, damageCol: 19 },
            { boss: "소나벨",     startRow: 231, shareCol: 1,  damageCol: 3 },
            { boss: "베스칼",     startRow: 231, shareCol: 9,  damageCol: 11 }
        ];

        const gatoMeta = {
            "루멘칼리고": { type: { text: "고대", cls: "type-ancient" }, attr: { text: "암속성 취약", cls: "attr-dark" } },
            "가르가디스": { type: { text: "야수", cls: "type-beast" },   attr: { text: "토속성 취약", cls: "attr-earth" } },
            "스콜라키아": { type: { text: "곤충", cls: "type-insect" },  attr: { text: "토속성 취약", cls: "attr-earth" } },
            "크라티오스": { type: { text: "야수", cls: "type-beast" },   attr: { text: "뇌속성 취약", cls: "attr-lightning" } },
            "아게오로스": { type: { text: "고대", cls: "type-ancient" }, attr: { text: "성속성 취약", cls: "attr-holy" } },
            "드렉탈라스": { type: { text: "야수", cls: "type-beast" },   attr: { text: "화속성 취약", cls: "attr-fire" } },
            "소나벨":     { type: { text: "정령", cls: "type-spirit" },  attr: { text: "암속성 취약", cls: "attr-dark" } },
            "베스칼":     { type: { text: "야수", cls: "type-beast" },   attr: { text: "화속성 취약", cls: "attr-fire" } }
        };


        function formatDateTime(d) {
            return `${d.getFullYear()} / ${String(d.getMonth() + 1).padStart(2, "0")} / ${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
        }

        function updateTopDateTime() {
            document.getElementById("topDateTime").textContent = formatDateTime(new Date());
        }

        function makeBadge(text, cls) {
            return `<span class="badge ${cls}">${text}</span>`;
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

        function isGato1750Available(boss) {
            return gato1750AvailableBosses.includes(boss);
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

            if (menu === "gato1730" || menu === "gato1750") {
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
            if (currentMenu === "simple") return;

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
           콤보 탭 / 제목 관련
           ============================================= */
        function getComboTabs(menu) {
            if (menu === "serka") {
                return [
                    { key: "normal_gate1", label: "노말", sub: "1관" },
                    { key: "normal_gate2", label: "노말", sub: "2관" },
                    { key: "hard_gate1", label: "하드", sub: "1관" },
                    { key: "hard_gate2", label: "하드", sub: "2관" },
                    { key: "nightmare_gate1", label: "나메", sub: "1관" },
                    { key: "nightmare_gate2", label: "나메", sub: "2관" }
                ];
            }

            if (menu === "cathedral") {
                return [
                    { key: "normal_gate1", label: "1단계", sub: "1관" },
                    { key: "normal_gate2", label: "1단계", sub: "2관" },
                    { key: "hard_gate1", label: "2단계", sub: "1관" },
                    { key: "hard_gate2", label: "2단계", sub: "2관" },
                    { key: "nightmare_gate1", label: "3단계", sub: "1관" },
                    { key: "nightmare_gate2", label: "3단계", sub: "2관" }
                ];
            }

            return [];
        }

        function getContentName() {
            if (currentMenu === "simple") {
                if (currentSimpleLevel === "egir-ex") return "에기르 EX 레이드 💠";
                if (currentSimpleLevel === "abr-ex") return "아브렐슈드 EX 레이드 ⚡";
                return "잔혈컷 간편보기 👀";
            }

            if (currentMenu === "serka" || currentMenu === "cathedral") {
                const info = raidMeta[currentMenu][currentCombo];
                return `${currentMenu === "serka" ? "세르카" : "성당"} : ${info.title.replace(/\s*\(.+\)/, "")} ${info.gateName}`;
            }

            if (currentMenu === "gato1730") return `1730 가디언 토벌 : ${currentGatoBoss}`;
            if (currentMenu === "gato1750") return `1750 가디언 토벌 : ${currentGato1750Boss}`;

            return "콘텐츠";
        }

        function getTableTitle() {
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

            if (currentMenu === "gato1730") return "잔영 1단계";
            if (currentMenu === "gato1750") return "잔영 2단계";

            return "";
        }

        function applyMenuFromQuery() {
            const menu = new URLSearchParams(window.location.search).get("menu");
            if (!menu) return;

            if (["serka", "cathedral", "gato1730", "gato1750", "simple"].includes(menu)) {
                currentMenu = menu;

                if (currentMenu === "serka" || currentMenu === "cathedral") {
                    currentCombo = "hard_gate1";
                } else if (currentMenu === "gato1730") {
                    currentGatoBoss = "루멘칼리고";
                } else if (currentMenu === "gato1750") {
                    currentGato1750Boss = "스콜라키아";
                } else if (currentMenu === "simple") {
                    currentSimpleLevel = "1710";
                }

                document.querySelectorAll(".menu-item").forEach(btn => {
                    btn.classList.toggle("active", btn.dataset.menu === currentMenu);
                });

                setBaseTimeByMenu(currentMenu);
            }
        }

        function renderTitleMeta() {
            const box = document.getElementById("titleMeta");

            if (currentMenu === "simple") {
                box.innerHTML = "";
                return;
            }

            if (currentMenu === "serka" || currentMenu === "cathedral") {
                const info = raidMeta[currentMenu][currentCombo];
                box.innerHTML = `${makeBadge(info.type.text, info.type.cls)} ${makeBadge(info.attr.text, info.attr.cls)}`;
                return;
            }

            if (currentMenu === "gato1730") {
                const info = gatoMeta[currentGatoBoss];
                box.innerHTML = `${makeBadge(info.type.text, info.type.cls)} ${makeBadge(info.attr.text, info.attr.cls)}`;
                return;
            }

            if (currentMenu === "gato1750") {
                const info = gatoMeta[currentGato1750Boss];
                box.innerHTML = `${makeBadge(info.type.text, info.type.cls)} ${makeBadge(info.attr.text, info.attr.cls)}`;
                return;
            }

            box.innerHTML = "";
        }




        /* =============================================
           탭 렌더링
           ============================================= */
        function renderTabs() {
            const el = document.getElementById("tabs");
            el.classList.remove("gato-grid", "simple-tabs");

            if (currentMenu === "simple") {
                el.classList.add("simple-tabs");
                const levels = ["1710", "1720", "1730", "1740", "1750"];

                el.innerHTML = `
                   <button class="tab tab-ex ${currentSimpleLevel === "egir-ex" ? "active" : ""}" data-simple-level="egir-ex" style="opacity: 0.6;">
    <div class="tab-label" style="text-decoration: line-through;">에기르 EX</div>
</button>

<button class="tab tab-ex ${currentSimpleLevel === "abr-ex" ? "active" : ""}" data-simple-level="abr-ex" style="opacity: 0.6;">
    <div class="tab-label" style="text-decoration: line-through;">아브 EX</div>
</button>
</button>
                    </button>
                    ${levels.map(lv => `
                        <button class="tab ${currentSimpleLevel === lv ? "active" : ""}" data-simple-level="${lv}">
                            <div class="tab-label">${lv}</div>
                        </button>
                    `).join("")}
                `;

                el.querySelectorAll(".tab[data-simple-level]").forEach(btn => {
                    btn.addEventListener("click", () => {
                        currentSimpleLevel = btn.dataset.simpleLevel;
                        renderTabs();
                        renderTable();
                    });
                });
                return;
            }

            if (currentMenu === "gato1730") {
                el.classList.add("gato-grid");
                el.innerHTML = gato1730Bosses.map(boss => {
                    const m = gatoMeta[boss];
                    return `<button class="tab gato ${currentGatoBoss === boss ? "active" : ""}" data-boss="${boss}">
                        <div class="tab-label">${boss}</div>
                        <div class="tab-meta">${makeBadge(m.type.text, m.type.cls)}${makeBadge(m.attr.text, m.attr.cls)}</div>
                    </button>`;
                }).join("");

                el.querySelectorAll(".tab[data-boss]").forEach(btn => {
                    btn.addEventListener("click", () => {
                        currentGatoBoss = btn.dataset.boss;
                        renderTabs();
                        renderTable();
                    });
                });
                return;
            }

            if (currentMenu === "gato1750") {
                el.classList.add("gato-grid");
                el.innerHTML = gato1750Bosses.map(boss => {
                    const m = gatoMeta[boss];
                    const avail = isGato1750Available(boss);
                    return `<button class="tab gato ${avail ? "" : "pending"} ${currentGato1750Boss === boss ? "active" : ""}" data-boss1750="${boss}">
                        <div class="tab-label">${boss}</div>
                        <div class="tab-meta">${makeBadge(m.type.text, m.type.cls)}${makeBadge(m.attr.text, m.attr.cls)}</div>
                        ${avail ? "" : '<div class="tab-pending">준비중</div>'}
                    </button>`;
                }).join("");

                el.querySelectorAll(".tab[data-boss1750]").forEach(btn => {
                    btn.addEventListener("click", () => {
                        currentGato1750Boss = btn.dataset.boss1750;
                        renderTabs();
                        renderTable();
                    });
                });
                return;
            }

            const combos = getComboTabs(currentMenu);
            el.innerHTML = combos.map(c =>
                `<button class="tab ${raidMeta[currentMenu][c.key].tierClass} ${currentCombo === c.key ? "active" : ""}" data-combo="${c.key}">
                    <div class="tab-label">${c.label}</div>
                    <div class="tab-sub">${c.sub}</div>
                </button>`
            ).join("");

            el.querySelectorAll(".tab[data-combo]").forEach(btn => {
                btn.addEventListener("click", () => {
                    currentCombo = btn.dataset.combo;
                    renderTabs();
                    renderTable();
                });
            });
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
            if (share === 30)
                return '<td class="share-cell"><div class="share-row"><span class="share-label label-30">강투컷</span><span class="share-value">30%</span></div></td>';
            if (share === 33)
                return '<td class="share-cell"><div class="share-row"><span class="share-label label-33">1인분</span><span class="share-value">33%</span></div></td>';
            if (share === 40)
                return '<td class="share-cell"><div class="share-row"><span class="share-label label-40">잔혈컷</span><span class="share-value">40%</span></div></td>';
            return `<td class="share-cell"><div class="share-row"><span class="share-label"></span><span class="share-value">${share}%</span></div></td>`;
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
            const note = card.querySelector(".side-note");
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
                return `<div class="simple-goldbar">
                    <div class="gold-item">
                        <div class="gold-item-label">
                            <svg width="10" height="10" viewBox="0 0 18 18"><circle cx="9" cy="9" r="8" fill="#c0c0c0" stroke="#888888" stroke-width="1.5"/><text x="9" y="13" text-anchor="middle" font-size="8" font-weight="900" fill="#333333" font-family="Arial">G</text></svg>
                            <span class="gold-bind-label">귀속 골드</span>
                        </div>
                        <div class="gold-item-value gold-bind-value">${card.bindGold}</div>
                    </div>
                </div>`;
            }

            if (currentSimpleLevel === "egir-ex" || currentSimpleLevel === "abr-ex") {
                let orb = 0;
                if (card.title && card.title.includes("노말")) orb = 150;
                else if (card.title) orb = 200;

                return `<div class="simple-goldbar">
                    <div class="gold-item">
                        <div class="gold-item-label">
                            <img src="img/gold.png" class="icon">
                            <span class="gold-clear-label">클리어 골드</span>
                        </div>
                        <div class="gold-item-value gold-clear-value">${card.gold}</div>
                    </div>
                    <div class="gold-material">
                        <img src="img/wing_orb.png" class="icon orb">
                        x${orb}
                    </div>
                </div>`;
            }

            if (card.bindGold) {
                return `<div class="simple-goldbar">
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
                </div>`;
            }

            return `<div class="simple-goldbar">
                <div class="gold-item">
                    <div class="gold-item-label">
                        <img src="img/gold.png" class="icon">
                        <span class="gold-clear-label">클리어 골드</span>
                    </div>
                    <div class="gold-item-value gold-clear-value">${card.gold}</div>
                </div>
            </div>`;
        }

        /* =============================================
           간편보기 카드 HTML
           ============================================= */
        function simpleCardHtml(card) {
            const rows = card.rows.map(r => {
                const badges = (r.badges || []).map(b => `<span class="badge ${b.cls}">${b.text}</span>`).join("");
                const isPreparing = r.range === "준비중";

                return `<div class="simple-row" style="${isPreparing ? "min-height:56px;align-items:center;" : ""}">
                    <div class="simple-dot"></div>
                    <div class="simple-row-left">
                        <span class="gate-b">${r.gate}</span>
                        <span class="boss-b">${r.boss}</span>
                        <span class="simple-badges">${badges}</span>
                    </div>
                    <div style="text-align:right;">
                        <span class="range-b ${isPreparing ? "preparing" : ""}">${r.range}</span>
                        ${r.dpscut ? `<div style="font-size:14px;color:#d4bf8a;font-style:italic;margin-top:3px;">${r.dpscut}</div>` : ""}
                    </div>
                </div>`;
            }).join("");

            return `<article class="simple-card ${card.theme}">
                <div class="simple-left"><div class="simple-node">${card.node}</div></div>
                <div class="simple-right">
                    <div class="simple-head">
                        <h3 class="simple-title">${card.title}</h3>
                        <div class="simple-kind">강투 · 잔혈</div>
                    </div>
                    <div class="simple-rows">${rows}</div>
                    ${goldBarHtml(card)}
                </div>
            </article>`;
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
                                ${opt.tags.map(t => `<span class="ex-tag${t.weak ? ' ex-weakness' : ''}">${t.text}</span>`).join("")}
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
                            <thead><tr>
                                <th style="text-align:left;width:31%;">구간 (누적 기준)</th>
                                <th style="width:23%;">강투 (15%)</th>
                                <th style="width:23%;">1인분 (16.66%)</th>
                                <th style="width:23%;" class="ex-col-highlight">잔혈 (20%)</th>
                            </tr></thead>
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
                            <div class="ex-m-phase-card${p.total ? ' ex-m-total' : ''}">
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
            </div>`;
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
                    </div>`).join("");

                const legends = b.parts.map(p => `
                    <div class="boss-legend-row">
                        <div class="boss-legend-dot" style="background:${p.color};"></div>
                        ${p.legend}
                        <span class="boss-legend-val">${p.hp}</span>
                    </div>`).join("");

                return `
                <div class="boss-card">
                    <div class="boss-card-title" style="color:${b.color};"><div class="bar" style="background:${b.color};"></div>${b.name}</div>
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
                    <div class="boss-total-row"><span class="boss-total-label">총 체력</span><span class="boss-total-val" style="color:${b.color};">${b.totalHp}</span></div>
                </div>`;
            }).join("");

            const estherRows = config.esther.map(r =>
                `<div class="esther-row"><div>${r[0]}</div><div style="color:${config.col1};">${r[1]}</div><div style="color:${config.col2};">${r[2]}</div><div style="color:${config.col3};">${r[3]}</div></div>`
            ).join("");

            return `
            <div class="boss-info-section">
                <div class="section-header"><div class="dot" style="background:${config.headerColor};"></div><span class="section-title">보스 체력 정보</span></div>
                <div class="warning-bar">⚠ 보스 체력정보 / 에스더 데미지는 직접 수작업으로 체크한 부분이라 정확하지 않을 수 있습니다.</div>
                <div class="boss-grid">${bossCards}</div>
                <div class="esther-table">
                    <div class="esther-header"><div class="bar" style="background:${config.estherBar};"></div><span>에스더 데미지 기대값</span></div>
                    <div class="esther-cols"><div>에스더 스킬</div><div style="color:${config.col1};">${config.colName1}</div><div style="color:${config.col2};">${config.colName2}</div><div style="color:${config.col3};">${config.colName3}</div></div>
                    ${estherRows}
                </div>
            </div>`;
        }

        /* =============================================
           EX 레이드 간편보기 렌더
           ============================================= */
        function renderExView(exKey) {
            const data = exRaidData[exKey];
            if (!data) return "<div class='coming-soon'><h3>준비중</h3></div>";

            const tierColors = { normal: "#34d399", hard: "#f7ca54", nightmare: "#a78bfa" };
            const cards = data.cards.map(c => makeExCard({ ...c, tierColor: tierColors[c.tier] || "#fff" })).join("");
            const boss = data.bossSection ? makeBossSection(data.bossSection) : "";

            return `
                <div class="simple-view">
                    <div class="simple-intro">
                        <div class="simple-intro-title">${data.sectionTitle}</div>
                        <div class="simple-intro-sub">${data.intro}</div>
                    </div>
                    <div class="ex-dash-container">${cards}</div>
                    ${boss}
                </div>
            `;
        }

        /* =============================================
           간편보기 전체 렌더
           ============================================= */
        function renderSimpleView() {
            if (currentSimpleLevel === "egir-ex" || currentSimpleLevel === "abr-ex") {
                document.getElementById("mainContent").innerHTML = renderExView(currentSimpleLevel);
                return;
            }

            const data = simpleData[currentSimpleLevel];
            if (!data) {
                document.getElementById("mainContent").innerHTML =
                    '<div class="coming-soon"><h3>준비중</h3><p>데이터 준비중입니다.</p></div>';
                return;
            }

            let html = `
                <div class="simple-view">
                    <div class="simple-intro">
                        <div class="simple-intro-title"><b>안내 : 잔혈컷 간편보기 페이지 입니다. 😎</b></div>
                        <div class="simple-intro-sub">${data.intro}</div>
                    </div>
                    <div class="simple-stack">
                        ${data.cards.length > 0
                            ? data.cards.map(simpleCardHtml).join("")
                            : "<div class='coming-soon'><h3>준비중</h3><p>곧 업데이트 예정입니다.</p></div>"}
                    </div>
                </div>`;

            document.getElementById("mainContent").innerHTML = html;
        }

        /* =============================================
           파티 DPS
           ============================================= */
        function getCurrentRowsForPartyDps() {
            if (currentMenu === "simple") return [];
            if (currentMenu === "gato1730") return parsedData.gato1730[currentGatoBoss] || [];
            if (currentMenu === "gato1750") return isGato1750Available(currentGato1750Boss) && parsedData.gato1750[currentGato1750Boss] || [];
            const info = raidMeta[currentMenu][currentCombo];
            return parsedData[currentMenu]?.[info.diffKey] || [];
        }

        function getDamageFromRow(row) {
            if (!row) return 0;
            if (currentMenu === "gato1730" || currentMenu === "gato1750") return row.damage || 0;
            return raidMeta[currentMenu][currentCombo].gateKey === "gate1" ? row.g1 || 0 : row.g2 || 0;
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
            if (currentMenu === "simple" || (currentMenu === "gato1750" && !isGato1750Available(currentGato1750Boss))) {
                el.innerHTML = '파티 DPS : <span class="party-dps-value">-</span>';
                return;
            }
            const val = getPartyDpsValue();
            el.innerHTML = val !== null
                ? `파티 DPS : <span class="party-dps-value">${fmtPartyDps(val)}</span>`
                : '파티 DPS : <span class="party-dps-value">-</span>';
        }




        /* =============================================
           메인 테이블 렌더링
           ============================================= */
        function renderTable() {
            updateTimeDisplay();

            if (currentMenu === "simple" && currentSimpleLevel === "egir-ex") {
                document.getElementById("contentTitle").innerHTML =
                    '<span style="background:linear-gradient(90deg,#ff6b6b 0%,#ffd700 15%,#fffacd 30%,#6bcb77 45%,#ffd700 60%,#fffacd 75%,#ff9ff3 90%,#ffd700 100%);background-size:250% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:textShimmer 2s linear infinite;filter:drop-shadow(0 0 7px rgba(255,215,0,0.85));">에기르 EX 레이드</span>';
            } else if (currentMenu === "simple" && currentSimpleLevel === "abr-ex") {
                document.getElementById("contentTitle").innerHTML =
                    '<span style="background:linear-gradient(90deg,#FFD60A 0%,#7E57C2 25%,#FFD60A 50%,#7E57C2 75%,#FFD60A 100%);background-size:250% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:textShimmer 2s linear infinite;filter:drop-shadow(0 0 7px rgba(255,214,10,0.85));">아브렐슈드 EX 레이드</span>';
            } else {
                document.getElementById("contentTitle").textContent = getContentName();
            }

            document.getElementById("tableTitle").textContent = getTableTitle();
            renderTitleMeta();

            // 간편보기
            if (currentMenu === "simple") {
                setClearTimeDisabled(true);
                document.getElementById("infoHint").innerHTML = "<i>해당 레벨대에 입장할수있는 레이드를 나열하였습니다.</i>";
                document.getElementById("partyDpsDisplay").innerHTML = '파티 DPS : <span class="party-dps-value">-</span>';
                renderSimpleView();
                return;
            }

            setClearTimeDisabled(false);

            // 1750 가토 준비중
            if (currentMenu === "gato1750" && !isGato1750Available(currentGato1750Boss)) {
                renderComingSoon(`${currentGato1750Boss} 준비중`, "해당 보스의 잔영 2단계 데이터는 아직 준비중입니다.");
                document.getElementById("infoHint").innerHTML = "1750 가디언 토벌은 일부 보스만 공개되었습니다.";
                updatePartyDpsDisplay();
                return;
            }

            ensureTableWrap();
            renderHead();
            document.getElementById("infoHint").innerHTML = "구글 시트 데이터를 읽어 옵니다.";

            const tbody = document.getElementById("tableBody");
            const totalSec = getTotalSeconds();

            // 1730 가토
            if (currentMenu === "gato1730") {
                const rows = parsedData.gato1730[currentGatoBoss] || [];
                if (rows.length) {
                    tbody.innerHTML = rows.map(r => {
                        let cls = "";
                        if (r.share === 30) cls = "row-30";
                        if (r.share === 33) cls = "row-33";
                        if (r.share === 40) cls = "row-40";
                        return `<tr class="${cls}">${renderShareCell(r.share)}<td>${fmt(r.damage)}</td><td class="dps-cell"><span class="dps-pill">${(r.damage / totalSec).toFixed(1)}억</span></td></tr>`;
                    }).join("");
                } else {
                    tbody.innerHTML = '<tr><td colspan="3">데이터 없음</td></tr>';
                }
                updatePartyDpsDisplay();
                return;
            }

            // 1750 가토
            if (currentMenu === "gato1750") {
                const rows = parsedData.gato1750[currentGato1750Boss] || [];
                if (rows.length) {
                    tbody.innerHTML = rows.map(r => {
                        let cls = "";
                        if (r.share === 30) cls = "row-30";
                        if (r.share === 33) cls = "row-33";
                        if (r.share === 40) cls = "row-40";
                        return `<tr class="${cls}">${renderShareCell(r.share)}<td>${fmt(r.damage)}</td><td class="dps-cell"><span class="dps-pill">${(r.damage / totalSec).toFixed(1)}억</span></td></tr>`;
                    }).join("");
                } else {
                    tbody.innerHTML = '<tr><td colspan="3">데이터 없음</td></tr>';
                }
                updatePartyDpsDisplay();
                return;
            }

            // 세르카 / 성당
            const meta = raidMeta[currentMenu][currentCombo];
            const dataRows = parsedData[currentMenu]?.[meta.diffKey] || [];

            if (!dataRows.length) {
                tbody.innerHTML = '<tr><td colspan="3">데이터 없음</td></tr>';
                updatePartyDpsDisplay();
                return;
            }

            tbody.innerHTML = dataRows.map(r => {
                let cls = "";
                if (r.share === 30) cls = "row-30";
                if (r.share === 33) cls = "row-33";
                if (r.share === 40) cls = "row-40";
                const dmg = meta.gateKey === "gate1" ? r.g1 : r.g2;
                return `<tr class="${cls}">${renderShareCell(r.share)}<td>${fmt(dmg)}</td><td class="dps-cell"><span class="dps-pill">${(dmg / totalSec).toFixed(1)}억</span></td></tr>`;
            }).join("");

            updatePartyDpsDisplay();
        }

        /* =============================================
           CSV 로드
           ============================================= */
        async function loadCSV() {
            document.getElementById("status").textContent = "시트 불러오는 중...";
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
                document.getElementById("status").textContent = "연동 완료";
            } catch (err) {
                console.error(err);
                document.getElementById("status").textContent = "불러오기 실패";
            }
        }

        /* =============================================
           캘린더
           ============================================= */
        function initCalendar() {
            const now = new Date();
            calYear = now.getFullYear();
            calMonth = now.getMonth();
            renderCalendar();
        }

        function renderCalendar() {
            const now = new Date();
            const todayYear = now.getFullYear();
            const todayMonth = now.getMonth();
            const todayDate = now.getDate();

            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];

            document.getElementById("calMonth").textContent = `${monthNames[calMonth]} ${calYear}`;

            const grid = document.getElementById("calGrid");
            let html = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
                .map((d, i) => `<div class="cal-dow ${i === 0 ? "sun" : i === 6 ? "sat" : ""}">${d}</div>`)
                .join("");

            const firstDay = new Date(calYear, calMonth, 1).getDay();
            const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
            const prevMonthDays = new Date(calYear, calMonth, 0).getDate();

            for (let i = 0; i < firstDay; i++) {
                const dow = i;
                html += `<div class="cal-day other-month ${dow === 0 ? "sun" : dow === 6 ? "sat" : ""}">${prevMonthDays - firstDay + 1 + i}</div>`;
            }

            for (let d = 1; d <= daysInMonth; d++) {
                const dow = (firstDay + d - 1) % 7;
                const isToday = d === todayDate && calMonth === todayMonth && calYear === todayYear;
                html += `<div class="cal-day ${isToday ? "today" : ""} ${dow === 0 ? "sun" : dow === 6 ? "sat" : ""}">${d}</div>`;
            }

            const totalCells = firstDay + daysInMonth;
            const remainder = totalCells % 7 === 0 ? 0 : 7 - totalCells % 7;
            for (let i = 1; i <= remainder; i++) {
                const dow = (totalCells + i - 1) % 7;
                html += `<div class="cal-day other-month ${dow === 0 ? "sun" : dow === 6 ? "sat" : ""}">${i}</div>`;
            }

            grid.innerHTML = html;
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
           이벤트 리스너
           ============================================= */

        // 캘린더
        document.getElementById("calPrev").addEventListener("click", () => {
            calMonth--;
            if (calMonth < 0) { calMonth = 11; calYear--; }
            renderCalendar();
        });

        document.getElementById("calNext").addEventListener("click", () => {
            calMonth++;
            if (calMonth > 11) { calMonth = 0; calYear++; }
            renderCalendar();
        });

        // 사이드바 메뉴
        document.querySelectorAll(".menu-item").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".menu-item").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentMenu = btn.dataset.menu;
                if (currentMenu === "serka") {
                    currentCombo = "hard_gate1";                   
                } else if (currentMenu === "cathedral") {
                    currentCombo = "hard_gate1";                
                } else if (currentMenu === "gato1730") {
                    currentGatoBoss = "루멘칼리고";                  
                } else if (currentMenu === "gato1750") {
                    currentGato1750Boss = "스콜라키아";                   
                } else if (currentMenu === "simple") {
                    currentSimpleLevel = "1710";                    
                }

                setBaseTimeByMenu(currentMenu);
                renderTabs();
                renderTable();
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
            trackEvent("/이벤트/가이드/DPS보는방법", "가이드 클릭 - DPS 보는 방법");
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
           초기화 실행
           ============================================= */
        updateTopDateTime();
        setInterval(updateTopDateTime, 1000);
        setBaseTimeByMenu("simple");
        applyMenuFromQuery();
        initCalendar();
        loadCSV();
        acUpdate();
