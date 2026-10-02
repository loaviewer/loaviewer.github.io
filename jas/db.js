// ===== 로아뷰 전용 정적 데이터베이스 레지스트리 =====

const CLASS_MAIN_STAT = {
  "워로드":"힘","버서커":"힘","디스트로이어":"힘","홀리나이트":"힘","발키리":"힘","슬레이어":"힘",
  "인파이터":"힘","배틀마스터":"힘","기공사":"힘","창술사":"힘","스트라이커":"힘","브레이커":"힘",
  "가디언나이트":"힘",
  "데빌헌터":"민첩","호크아이":"민첩","블래스터":"민첩","스카우터":"민첩","건슬링어":"민첩",
  "블레이드":"민첩","데모닉":"민첩","리퍼":"민첩","소울이터":"민첩",
  "아르카나":"지능","서머너":"지능","바드":"지능","소서리스":"지능","도화가":"지능","기상술사":"지능",
  "환수사":"지능","차원술사":"지능"
};

const ENGRAVE_ICONS = {
  "각성":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Buff/Buff_113.png",
  "강령술":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_29.png",
  "강화 방패":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_239.png",
  "결투의 대가":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Ability/Ability_224.png",
  "구슬동자":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Buff/Buff_18.png",
  "굳은 의지":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_44.png",
  "급소 타격":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_168.png",
  "기습의 대가":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_148.png",
  "긴급구조":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Ability/Ability_238.png",
  "달인의 저력":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_147.png",
  "돌격대장":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_210.png",
  "마나 효율 증가":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_166.png",
  "마나의 흐름":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_63.png",
  "바리케이드":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_170.png",
  "번개의 분노":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_191.png",
  "부러진 뼈":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_94.png",
  "분쇄의 주먹":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_83.png",
  "불굴":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_66.png",
  "선수필승":"https://cdn-lostark.game.onstove.com/efui_iconatlas/achieve/achieve_08_62.png",
  "속전속결":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Ability/Ability_236.png",
  "슈퍼 차지":"https://cdn-lostark.game.onstove.com/efui_iconatlas/achieve/achieve_06_14.png",
  "승부사":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_136.png",
  "시선 집중":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Ability/Ability_234.png",
  "실드 관통":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_89.png",
  "아드레날린":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Ability/Ability_235.png",
  "안정된 상태":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Buff/Buff_105.png",
  "약자 무시":"https://cdn-lostark.game.onstove.com/efui_iconatlas/achieve/achieve_04_30.png",
  "에테르 포식자":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_74.png",
  "여신의 가호":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_229.png",
  "예리한 둔기":"https://cdn-lostark.game.onstove.com/efui_iconatlas/achieve/achieve_03_40.png",
  "원한":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Buff/Buff_71.png",
  "위기 모면":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_162.png",
  "저주받은 인형":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_237.png",
  "전문의":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Ability/Ability_237.png",
  "정기 흡수":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_65.png",
  "정밀 단도":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Ability/Ability_239.png",
  "중갑 착용":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_46.png",
  "질량 증가":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Ability/Ability_231.png",
  "최대 마나 증가":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Buff/Buff_122.png",
  "추진력":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Ability/Ability_232.png",
  "타격의 대가":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Ability/Ability_233.png",
  "탈출의 명수":"https://cdn-lostark.game.onstove.com/efui_iconatlas/buff/buff_10.png",
  "폭발물 전문가":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Buff/Buff_121.png",
  "이동속도 감소":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Ability/Ability_221.png",
  "공격속도 감소":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Ability/Ability_220.png",
  "방어력 감소":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Ability/Ability_219.png",
  "공격력 감소":"https://cdn-lostark.game.onstove.com/EFUI_IconAtlas/Ability/Ability_218.png"
};



// 아덴/특수 스킬 아이콘 (ArmorySkills에 안 잡히는 스킬용 - 클래스별 정체성/특수 스킬)
var SPECIAL_SKILL_ICONS = {
  "블러디 러쉬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/bk_skill/bk_skill_01_11.png",
  "다크 러쉬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ability/ability_243.png",
  "전장의 창": "https://cdn-lostark.game.onstove.com/efui_iconatlas/gl_skill/gl_skill_01_42.png",
  "중력 가중 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/dt_skill/dt_skill_01_20.png",
  "심판자 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_hk/ark_passive_hk_5.png",
  "신앙 스킬": {
  "홀리나이트": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_hk/ark_passive_hk_5.png",
  "발키리": "https://cdn-lostark.game.onstove.com/efui_iconatlas/hkf_skill/hkf_skill_01_24.png",
  "음양 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/yy_skill/yy_skill_01_3.png"
  },
  "떠오르는 달": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_yy/ark_passive_yy_8.png",
  "블러드러스트": "https://cdn-lostark.game.onstove.com/efui_iconatlas/bk_skill/bk_skill_01_11.png",
  "종언의 빛": "https://cdn-lostark.game.onstove.com/efui_iconatlas/hkf_skill/hkf_skill_01_24.png",
  "권왕십이식": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_ifm/ark_passive_ifm_2.png",
  "포격 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/bs_skill/bs_skill_01_8.png",
  "실버호크 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/he_skill/he_skill_01_21.png",
  "EX - 제로 포인트": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_sc/ark_passive_sc_5.png",
  "로즈 블로섬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/dh_skill/dh_skill_01_61.png",
  "고대의 정령 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/dh_skill/dh_skill_01_61.png",
  "황제": "https://cdn-lostark.game.onstove.com/efui_iconatlas/dh_skill/dh_skill_01_61.png",
  "블레이드 버스트": "https://cdn-lostark.game.onstove.com/efui_iconatlas/bl_skill/bl_skill_01_21.png",
  "블러드 제노사이드": "https://cdn-lostark.game.onstove.com/efui_iconatlas/dm_skill/dm_skill_01_36.png",
  "수라결 기본 공격": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ifm_skill/ifm_skill_01_27.png",
  "인페르노 버스트": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ddk_skill/ddk_skill_01_25.png",
  "음양 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/yy_skill/yy_skill_01_3.png",
  "여우비 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/wa_skill/wa_skill_01_22.png",
  "둔갑 금술 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_dr/ark_passive_dr_2.png",
  "세레나데 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_hk/ark_passive_hk_5.png",
  "시간선 스킬": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_di/ark_passive_di_6.png",
  "간섭": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_di/ark_passive_di_7.png"
};







const ACC_OPT_GRADES = {
  "추가 피해": [
    {v:2.60, g:"상", tier:"T4 고대"}, {v:1.60, g:"중", tier:"T4 고대"}, {v:0.70, g:"하", tier:"T4 고대"},
    {v:1.82, g:"상", tier:"T4 유물"}, {v:1.09, g:"중", tier:"T4 유물"}, {v:0.48, g:"하", tier:"T4 유물"},
    {v:1.50, g:"상", tier:""}, {v:0.90, g:"중", tier:""}, {v:0.39, g:"하", tier:""}
  ],
  "적에게 주는 피해": [
    {v:2.00, g:"상", tier:"T4 고대"}, {v:1.20, g:"중", tier:"T4 고대"}, {v:0.55, g:"하", tier:"T4 고대"},
    {v:1.40, g:"상", tier:"T4 유물"}, {v:0.84, g:"중", tier:"T4 유물"}, {v:0.37, g:"하", tier:"T4 유물"},
    {v:1.15, g:"상", tier:""}, {v:0.69, g:"중", tier:""}, {v:0.30, g:"하", tier:""}
  ],
  "낙인력": [
    {v:8.00, g:"상", tier:"T4 고대"}, {v:4.80, g:"중", tier:"T4 고대"}, {v:2.15, g:"하", tier:"T4 고대"},
    {v:5.60, g:"상", tier:"T4 유물"}, {v:3.36, g:"중", tier:"T4 유물"}, {v:1.48, g:"하", tier:"T4 유물"},
    {v:4.60, g:"상", tier:""}, {v:2.76, g:"중", tier:""}, {v:1.20, g:"하", tier:""}
  ],
  "공격력%": [
    {v:1.55, g:"상"}, {v:0.95, g:"중"}, {v:0.40, g:"하"}
  ],
  "무기 공격력%": [
    {v:3.00, g:"상"}, {v:1.80, g:"중"}, {v:0.80, g:"하"}
  ],
  "치명타 적중률": [
    {v:1.55, g:"상"}, {v:0.95, g:"중"}, {v:0.40, g:"하"}
  ],
  "치명타 피해": [
    {v:4.00, g:"상"}, {v:2.40, g:"중"}, {v:1.00, g:"하"}
  ],
  "상태이상 공격 지속시간": [
    {v:0.50, g:"상"}, {v:0.30, g:"중"}, {v:0.20, g:"하"}
  ],
  "아군 피해량 강화 효과": [
    {v:2.00, g:"상"}, {v:1.20, g:"중"}, {v:0.55, g:"하"}
  ],
  "아군 공격력 강화 효과": [
    {v:2.00, g:"상"}, {v:1.20, g:"중"}, {v:0.55, g:"하"}
  ]
};

const GRADE = {
  "일반":{c:"#FFFFFF", bg:"rgba(255,255,255,.12)"},
  "고급":{c:"#47AB24", bg:"rgba(71,171,36,.22)"},
  "희귀":{c:"#1D8FF0", bg:"rgba(29,143,240,.22)"},
  "영웅":{c:"#A235FF", bg:"rgba(162,53,255,.22)"},
  "전설":{c:"#E36C00", bg:"rgba(227,108,0,.22)"},
  "유물":{c:"#E24A00", bg:"rgba(226,74,0,.22)"},
  "고대":{c:"#CFAD7E", bg:"rgba(207,173,126,.22)"},
  "에스더":{c:"#00CCFF", bg:"rgba(0,204,255,.22)"},
};

const ACC_MAX = {
  "추가 피해": 2.60,
  "적에게 주는 피해": 2.00,
  "무기 공격력": 3.00,
  "공격력%": 1.55,
  "공격력평타": 480,
  "치명타 적중률": 1.55,
  "치명타 피해": 4.00,
  "최대 생명력": 1300,
  "상태이상 공격 지속시간": 0.40,
  "아군 피해량 강화 효과": 2.00,
  "아군 공격력 강화 효과": 2.00,
  "파티원 보호막 효과": 2.00,
  "낙인력": 8.00,
};

// 팔찌 효과 문장 → 등급(유물/고대 상·중·하) + 축약형(initial) + 실수치 룩업 테이블
// key는 팔찌 툴팁 문장에서 공백을 모두 제거한 형태 (정규화 후 매칭)
const BRACELET_EFFECTS = {
    4: {
        "공격및이동속도가3%증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "공이속 +3%", atkSpeed: 3, moveSpeed: 3 },
        "공격및이동속도가4%증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "공이속 +4%", atkSpeed: 4, moveSpeed: 4 },
        "공격및이동속도가5%증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "공이속 +5%", atkSpeed: 5, moveSpeed: 5 },
        "공격및이동속도가6%증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "공이속 +6%", atkSpeed: 6, moveSpeed: 6 },
        "치명타적중률이2.6%증가한다.공격이치명타로적중시적에게주는피해가1.5%증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "치적 +2.6% / 치명타시 주는 피해 +1.5%", critRate: 2.6, critFinalDmg: 1.015, specCritFinalDmg: 1.01 },
        "치명타적중률이3.4%증가한다.공격이치명타로적중시적에게주는피해가1.5%증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "치적 +3.4% / 치명타시 주는 피해 +1.5%", critRate: 3.4, critFinalDmg: 1.015, specCritFinalDmg: 1.01 },
        "치명타적중률이4.2%증가한다.공격이치명타로적중시적에게주는피해가1.5%증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "치적 +4.2% / 치명타시 주는 피해 +1.5%", critRate: 4.2, critFinalDmg: 1.015, specCritFinalDmg: 1.01 },
        "치명타적중률이5%증가한다.공격이치명타로적중시적에게주는피해가1.5%증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "치적 +5.0% / 치명타시 주는 피해 +1.5%", critRate: 5, critFinalDmg: 1.015, specCritFinalDmg: 1.01 },
        "치명타피해가5.2%증가한다.공격이치명타로적중시적에게주는피해가1.5%증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "치피 +5.2% / 치명타시 주는 피해 +1.5%", critDmg: 5.2, critFinalDmg: 1.015, specCritFinalDmg: 1.01 },
        "치명타피해가6.8%증가한다.공격이치명타로적중시적에게주는피해가1.5%증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "치피 +6.8% / 치명타시 주는 피해 +1.5%", critDmg: 6.8, critFinalDmg: 1.015, specCritFinalDmg: 1.01 },
        "치명타피해가8.4%증가한다.공격이치명타로적중시적에게주는피해가1.5%증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "치피 +8.4% / 치명타시 주는 피해 +1.5%", critDmg: 8.4, critFinalDmg: 1.015, specCritFinalDmg: 1.01 },
        "치명타피해가10%증가한다.공격이치명타로적중시적에게주는피해가1.5%증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "치피 +10.0% / 치명타시 주는 피해 +1.5%", critDmg: 10, critFinalDmg: 1.015, specCritFinalDmg: 1.01 },
        "적에게주는피해가1.5%증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "적에게 주는 피해 +1.5%", finalDmg: 1.015 },
        "적에게주는피해가2%증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "적에게 주는 피해 +2%", finalDmg: 1.02 },
        "적에게주는피해가2.5%증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "적에게 주는 피해 +2.5%", finalDmg: 1.025 },
        "적에게주는피해가3%증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "적에게 주는 피해 +3%", finalDmg: 1.03 },
        "적에게주는피해가1.5%증가하며,무력화상태의적에게주는피해가3.5%증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "적주피 +1.5% / 무력화 적 피해량 +3.5%", finalDmg: 1.015, staggeredTargetDmg: 1.035 },
        "적에게주는피해가2%증가하며,무력화상태의적에게주는피해가4%증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "적주피 +2% / 무력화 적 피해량 +4%", finalDmg: 1.02, staggeredTargetDmg: 1.04 },
        "적에게주는피해가2.5%증가하며,무력화상태의적에게주는피해가4.5%증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "적주피 +2.5% / 무력화 적 피해량 +4.5%", finalDmg: 1.025, staggeredTargetDmg: 1.045 },
        "적에게주는피해가3%증가하며,무력화상태의적에게주는피해가5%증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "적주피 +3% / 무력화 적 피해량 +5%", finalDmg: 1.03, staggeredTargetDmg: 1.05 },
        "스킬의재사용대기시간이2%증가하지만,적에게주는피해가4%증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "재사용 쿨 +2% / 적에게 주는 피해 +4.0%", cdr: 0.02, finalDmg: 1.04 },
        "스킬의재사용대기시간이2%증가하지만,적에게주는피해가4.5%증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "재사용 쿨 +2% 감소 / 적에게 주는 피해 +4.5%", cdr: 0.02, finalDmg: 1.045 },
        "스킬의재사용대기시간이2%증가하지만,적에게주는피해가5%증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "재사용 쿨 +2% 감소 / 적에게 주는 피해 +5.0%", cdr: 0.02, finalDmg: 1.05 },
        "스킬의재사용대기시간이2%증가하지만,적에게주는피해가5.5%증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "재사용 쿨 +2% 감소 / 적에게 주는 피해 +5.5%", cdr: 0.02, finalDmg: 1.055 },
        "추가피해가2%증가한다.악마및대악마계열피해량이2.5%증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "추피 +2.0% / 악마&대악마 피해량 +2.5%", addDmg: 2, devilDmg: 1.025 },
        "추가피해가2.5%증가한다.악마및대악마계열피해량이2.5%증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "추피 +2.5% / 악마&대악마 피해량 +2.5%", addDmg: 2.5, devilDmg: 1.025 },
        "추가피해가3%증가한다.악마및대악마계열피해량이2.5%증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "추피 +3.0% / 악마&대악마 피해량 +2.5%", addDmg: 3, devilDmg: 1.025 },
        "추가피해가3.5%증가한다.악마및대악마계열피해량이2.5%증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "추피 +3.5% / 악마&대악마 피해량 +2.5%", addDmg: 3.5, devilDmg: 1.025 },
        "공격적중시매초마다10초동안무기공격력이1000,공격및이동속도가1%증가한다.(최대6중첩)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "공격 적중 시 무공 1000, 공이속 1%", weaponAtkPlus: 6000, atkSpeed: 6, moveSpeed: 6 },
        "공격적중시매초마다10초동안무기공격력이1160,공격및이동속도가1%증가한다.(최대6중첩)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "공격 적중 시 무공 1160, 공이속 1%", weaponAtkPlus: 6960, atkSpeed: 6, moveSpeed: 6 },
        "공격적중시매초마다10초동안무기공격력이1320,공격및이동속도가1%증가한다.(최대6중첩)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "공격 적중 시 무공 1320, 공이속 1%", weaponAtkPlus: 7920, atkSpeed: 6, moveSpeed: 6 },
        "공격적중시매초마다10초동안무기공격력이1480,공격및이동속도가1%증가한다.(최대6중첩)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "공격 적중 시 무공 1480, 공이속 1%", weaponAtkPlus: 8880, atkSpeed: 6, moveSpeed: 6 },
        "무기공격력이6300증가한다.자신의생명력이50%이상일경우적에게공격적중시5초동안무기공격력이1800증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "무공 6300 / 조건부 무공 1800", weaponAtkPlus: 8100, weaponAtkOrigin: 6300 },
        "무기공격력이7200증가한다.자신의생명력이50%이상일경우적에게공격적중시5초동안무기공격력이2000증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "무공 7200 / 조건부 무공 2000", weaponAtkPlus: 9200, weaponAtkOrigin: 7200 },
        "무기공격력이8100증가한다.자신의생명력이50%이상일경우적에게공격적중시5초동안무기공격력이2200증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "무공 8100 / 조건부 무공 2200", weaponAtkPlus: 10300, weaponAtkOrigin: 8100 },
        "무기공격력이9000증가한다.자신의생명력이50%이상일경우적에게공격적중시5초동안무기공격력이2400증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "무공 9000 / 조건부 무공 2400", weaponAtkPlus: 11400, weaponAtkOrigin: 9000 },
        "무기공격력이6000증가한다.공격적중시30초마다120초동안무기공격력이120증가한다.(최대30중첩)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "무공 6000 / 스택당 무공 120", weaponAtkPlus: 7020, weaponAtkOrigin: 6000 },
        "무기공격력이6900증가한다.공격적중시30초마다120초동안무기공격력이130증가한다.(최대30중첩)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "무공 6900 / 스택당 무공 130", weaponAtkPlus: 8005, weaponAtkOrigin: 6900 },
        "무기공격력이7800증가한다.공격적중시30초마다120초동안무기공격력이140증가한다.(최대30중첩)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "무공 7800 / 스택당 무공 140", weaponAtkPlus: 8990, weaponAtkOrigin: 7800 },
        "무기공격력이8700증가한다.공격적중시30초마다120초동안무기공격력이150증가한다.(최대30중첩)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "무공 8700 / 스택당 무공 150", weaponAtkPlus: 9975, weaponAtkOrigin: 8700 },
        "백어택스킬이적에게주는피해가2%증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "백어택 스킬 피해 +2.0%", backDmg: 1.02 },
        "백어택스킬이적에게주는피해가2.5%증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "백어택 스킬 피해 +2.5%", backDmg: 1.025 },
        "백어택스킬이적에게주는피해가3%증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "백어택 스킬 피해 +3.0%", backDmg: 1.03 },
        "백어택스킬이적에게주는피해가3.5%증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "백어택 스킬 피해 +3.5%", backDmg: 1.035 },
        "헤드어택스킬이적에게주는피해가2%증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "헤드어택 스킬 피해 +2.0%", headDmg: 1.02 },
        "헤드어택스킬이적에게주는피해가2.5%증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "헤드어택 스킬 피해 +2.5%", headDmg: 1.025 },
        "헤드어택스킬이적에게주는피해가3%증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "헤드어택 스킬 피해 +3.0%", headDmg: 1.03 },
        "헤드어택스킬이적에게주는피해가3.5%증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "헤드어택 스킬 피해 +3.5%", headDmg: 1.035 },
        "방향성공격이아닌스킬이적에게주는피해가2%증가한다.각성기는적용되지않는다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "타대 스킬 피해 +2.0%", normalDmg: 1.02 },
        "방향성공격이아닌스킬이적에게주는피해가2.5%증가한다.각성기는적용되지않는다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "타대 스킬 피해 +2.5%", normalDmg: 1.025 },
        "방향성공격이아닌스킬이적에게주는피해가3%증가한다.각성기는적용되지않는다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "타대 스킬 피해 +3.0%", normalDmg: 1.03 },
        "방향성공격이아닌스킬이적에게주는피해가3.5%증가한다.각성기는적용되지않는다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "타대 스킬 피해 +3.5%", normalDmg: 1.035 },
        "추가피해+2.50%": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "추가 피해 +2.5%", addDmg: 2.5 },
        "추가피해+3.00%": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "추가 피해 +3.0%", addDmg: 3 },
        "추가피해+3.50%": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "추가 피해 +3.5%", addDmg: 3.5 },
        "추가피해+4.00%": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "추가 피해 +4.0%", addDmg: 4 },
        "아군공격력강화효과+3.00%": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "아군 공격력 강화 +3.0%", atkBuff: 3 },
        "아군공격력강화효과+4.00%": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "아군 공격력 강화 +4.0%", atkBuff: 4 },
        "아군공격력강화효과+5.00%": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "아군 공격력 강화 +5.0%", atkBuff: 5 },
        "아군공격력강화효과+6.00%": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "아군 공격력 강화 +6.0%", atkBuff: 6 },
        "아군피해량강화효과+4.50%": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "아군 피해량 강화 +4.5%", damageBuff: 4.5 },
        "아군피해량강화효과+6.00%": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "아군 피해량 강화 +6.0%", damageBuff: 6 },
        "아군피해량강화효과+7.50%": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "아군 피해량 강화 +7.5%", damageBuff: 7.5 },
        "아군피해량강화효과+9.00%": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "아군 피해량 강화 +9.0%", damageBuff: 9 },
        "치명타적중률+2.60%": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "치명타 적중률 +2.60%", critRate: 2.6 },
        "치명타적중률+3.40%": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "치명타 적중률 +3.40%", critRate: 3.4 },
        "치명타적중률+4.20%": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "치명타 적중률 +4.20%", critRate: 4.2 },
        "치명타적중률+5.00%": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "치명타 적중률 +5.00%", critRate: 5 },
        "치명타피해+5.20%": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "치명타 피해 +5.2%", critDmg: 5.2 },
        "치명타피해+6.80%": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "치명타 피해 +6.8%", critDmg: 6.8 },
        "치명타피해+8.40%": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "치명타 피해 +8.4%", critDmg: 8.4 },
        "치명타피해+10.00%": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "치명타 피해 +10.0%", critDmg: 10 },
        "무기공격력+6300": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "무기 공격력 +6300", weaponAtkPlus: 6300, weaponAtkOrigin: 6300 },
        "무기공격력+7200": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "무기 공격력 +7200", weaponAtkPlus: 7200, weaponAtkOrigin: 7200 },
        "무기공격력+8100": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "무기 공격력 +8100", weaponAtkPlus: 8100, weaponAtkOrigin: 8100 },
        "무기공격력+9000": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "무기 공격력 +9000", weaponAtkPlus: 9000, weaponAtkOrigin: 9000 },
        "몬스터에게공격적중시8초동안대상의방어력을1.5%감소시킨다.해당효과는한파티당하나만적용된다.아군공격력강화효과가1.5%증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "방깎 1.5% / 아공강 +1.5%", atkBuff: 1.5, atkBuffPlus: 1.0075, finalDmg: 1.0075 },
        "몬스터에게공격적중시8초동안대상의방어력을1.8%감소시킨다.해당효과는한파티당하나만적용된다.아군공격력강화효과가2%증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "방깎 1.8% / 아공강 +2.0%", atkBuff: 2, atkBuffPlus: 1.007, finalDmg: 1.007 },
        "몬스터에게공격적중시8초동안대상의방어력을2.1%감소시킨다.해당효과는한파티당하나만적용된다.아군공격력강화효과가2.5%증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "방깎 2.1% / 아공강 +2.5%", atkBuff: 2.5, atkBuffPlus: 1.0106, finalDmg: 1.0106 },
        "몬스터에게공격적중시8초동안대상의방어력을2.5%감소시킨다.해당효과는한파티당하나만적용된다.아군공격력강화효과가3%증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "방깎 2.5% / 아공강 +3.0%", atkBuff: 3, atkBuffPlus: 1.0143, finalDmg: 1.0126 },
        "몬스터에게공격적중시8초동안대상의치명타저항을1.5%감소시킨다.해당효과는한파티당하나만적용된다.아군공격력강화효과가1.5%증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "치명타 저항 -1.5% / 아공강 +1.5%", critRateBuff: 1.5, atkBuff: 1.5, atkBuffPlus: 1.010875, critRate: 1.5 },
        "몬스터에게공격적중시8초동안대상의치명타저항을1.8%감소시킨다.해당효과는한파티당하나만적용된다.아군공격력강화효과가2%증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "치명타 저항 -1.8% / 아공강 +2.0%", critRateBuff: 1.8, atkBuff: 2, atkBuffPlus: 1.01305, critRate: 1.8 },
        "몬스터에게공격적중시8초동안대상의치명타저항을2.1%감소시킨다.해당효과는한파티당하나만적용된다.아군공격력강화효과가2.5%증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "치명타 저항 -2.1% / 아공강 +2.5%", critRateBuff: 2.1, atkBuff: 2.5, atkBuffPlus: 1.015225, critRate: 2.1 },
        "몬스터에게공격적중시8초동안대상의치명타저항을2.5%감소시킨다.해당효과는한파티당하나만적용된다.아군공격력강화효과가3%증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "치명타 저항 -2.5% / 아공강 +3.0%", critRateBuff: 2.5, atkBuff: 3, atkBuffPlus: 1.0176, critRate: 2.5 },
        "파티효과로보호효과(보호막,생명력회복,받는피해감소)가적용된대상이5초동안적에게주는피해가0.7%증가한다.해당효과는한파티당하나만적용되며,지속시간이없는보호효과에는적용되지않는다.아군공격력강화효과가1.5%증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "보호 대상 피해량 +0.7% / 아공강 +1.5%", shieldBuff: 0.7, atkBuff: 1.5, atkBuffPlus: 1.007, finalDmg: 1.007 },
        "파티효과로보호효과(보호막,생명력회복,받는피해감소)가적용된대상이5초동안적에게주는피해가0.9%증가한다.해당효과는한파티당하나만적용되며,지속시간이없는보호효과에는적용되지않는다.아군공격력강화효과가2%증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "보호 대상 피해량 +0.9% / 아공강 +2.0%", shieldBuff: 0.9, atkBuff: 2, atkBuffPlus: 1.009, finalDmg: 1.009 },
        "파티효과로보호효과(보호막,생명력회복,받는피해감소)가적용된대상이5초동안적에게주는피해가1.1%증가한다.해당효과는한파티당하나만적용되며,지속시간이없는보호효과에는적용되지않는다.아군공격력강화효과가2.5%증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "보호 대상 피해량 +1.1% / 아공강 +2.5%", shieldBuff: 1.1, atkBuff: 2.5, atkBuffPlus: 1.011, finalDmg: 1.011 },
        "파티효과로보호효과(보호막,생명력회복,받는피해감소)가적용된대상이5초동안적에게주는피해가1.3%증가한다.해당효과는한파티당하나만적용되며,지속시간이없는보호효과에는적용되지않는다.아군공격력강화효과가3%증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "보호 대상 피해량 +1.3% / 아공강 +3.0%", shieldBuff: 1.3, atkBuff: 3, atkBuffPlus: 1.013, finalDmg: 1.013 },
        "몬스터에게공격적중시8초동안대상의치명타피해저항을3%감소시킨다.해당효과는한파티당하나만적용된다.아군공격력강화효과가1.5%증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "치명타 피해 저항 -3.0% / 아공강 +1.5%", critDmgBuff: 3, atkBuff: 1.5, atkBuffPlus: 1.010875, critDmg: 3 },
        "몬스터에게공격적중시8초동안대상의치명타피해저항을3.6%감소시킨다.해당효과는한파티당하나만적용된다.아군공격력강화효과가2%증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "치명타 피해 저항 -3.6% / 아공강 +2.0%", critDmgBuff: 3.6, atkBuff: 2, atkBuffPlus: 1.01305, critDmg: 3.6 },
        "몬스터에게공격적중시8초동안대상의치명타피해저항을4.2%감소시킨다.해당효과는한파티당하나만적용된다.아군공격력강화효과가2.5%증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "치명타 피해 저항 -4.2% / 아공강 +2.5%", critDmgBuff: 4.2, atkBuff: 2.5, atkBuffPlus: 1.015225, critDmg: 4.2 },
        "몬스터에게공격적중시8초동안대상의치명타피해저항을4.8%감소시킨다.해당효과는한파티당하나만적용된다.아군공격력강화효과가3%증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "치명타 피해 저항 -4.8% / 아공강 +3.0%", critDmgBuff: 4.8, atkBuff: 3, atkBuffPlus: 1.0174, critDmg: 4.8 },
        "시드등급이하몬스터에게주는피해량이3%증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "시드 이하 몬스터 피해량 +3%" },
        "시드등급이하몬스터에게주는피해량이4%증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "시드 이하 몬스터 피해량 +4%" },
        "시드등급이하몬스터에게주는피해량이5%증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "시드 이하 몬스터 피해량 +5%" },
        "시드등급이하몬스터에게주는피해량이6%증가한다.": { 유물: "하", 고대: "상", 딜러: true, 서폿: true, initial: "시드 이하 몬스터 피해량 +6%" },
        "시드등급이하몬스터에게받는피해량이4%감소한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "시드 이하 몬스터 받는 피해 -4%" },
        "시드등급이하몬스터에게받는피해량이6%감소한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "시드 이하 몬스터 받는 피해 -6%" },
        "시드등급이하몬스터에게받는피해량이8%감소한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "시드 이하 몬스터 받는 피해 -8%" },
        "시드등급이하몬스터에게받는피해량이10%감소한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "시드 이하 몬스터 받는 피해 -10%" },
        "최대생명력+8400": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "최대 생명력 +8400", statHp: 8400 },
        "최대생명력+11200": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "최대 생명력 +11200", statHp: 11200 },
        "최대생명력+14000": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "최대 생명력 +14000", statHp: 14000 },
        "최대생명력+16800": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "최대 생명력 +16800", statHp: 16800 },
        "전투중생명력회복량+80": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "전투 중 생명력 회복량 +80" },
        "전투중생명력회복량+100": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "전투 중 생명력 회복량 +100" },
        "전투중생명력회복량+130": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "전투 중 생명력 회복량 +130" },
        "전투중생명력회복량+160": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "전투 중 생명력 회복량 +160" },
        "전투자원자연회복량+6.00%": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "전투자원 자연 회복량 +6%" },
        "전투자원자연회복량+8.00%": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "전투자원 자연 회복량 +8%" },
        "전투자원자연회복량+10.00%": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "전투자원 자연 회복량 +10%" },
        "전투자원자연회복량+12.00%": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "전투자원 자연 회복량 +12%" },
        "이동기및기상기재사용대기시간이6%감소한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "이동기·기상기 쿨감 +6%" },
        "이동기및기상기재사용대기시간이8%감소한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "이동기·기상기 쿨감 +8%" },
        "이동기및기상기재사용대기시간이10%감소한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "이동기·기상기 쿨감 +10%" },
        "이동기및기상기재사용대기시간이12%감소한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "이동기·기상기 쿨감 +12%" },
        "공격적중시90초동안경직및피격이상에면역이된다.(재사용대기시간90초)해당효과는1회피격시사라진다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "적중 시 90초간 경피면" },
        "공격적중시80초동안경직및피격이상에면역이된다.(재사용대기시간80초)해당효과는1회피격시사라진다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "적중 시 80초간 경피면" },
        "공격적중시70초동안경직및피격이상에면역이된다.(재사용대기시간70초)해당효과는1회피격시사라진다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "적중 시 70초간 경피면" },
        "공격적중시60초동안경직및피격이상에면역이된다.(재사용대기시간60초)해당효과는1회피격시사라진다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "적중 시 60초간 경피면" },
        "파티원보호및회복효과가2%증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "보호·회복 효과 +2.0%", careBuff: 0.02 },
        "파티원보호및회복효과가2.5%증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "보호·회복 효과 +2.5%", careBuff: 0.025 },
        "파티원보호및회복효과가3%증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "보호·회복 효과 +3.0%", careBuff: 0.03 },
        "파티원보호및회복효과가3.5%증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "보호·회복 효과 +3.5%", careBuff: 0.035 }
    },
    3: {
        "최대생명력+5500": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "최대 생명력 +5500", statHp: 5500 },
        "최대생명력+7300": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "최대 생명력 +7300", statHp: 7300 },
        "최대생명력+9100": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "최대 생명력 +9100", statHp: 9100 },
        "최대생명력+11000": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "최대 생명력 +11000", statHp: 11000 },
        "최대마나+150": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "최대 마나 +150" },
        "최대마나+200": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "최대 마나 +200" },
        "최대마나+250": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "최대 마나 +250" },
        "최대마나+300": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "최대 마나 +300" },
        "물리방어력+500": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "물리 방어력 +500" },
        "물리방어력+1200": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "물리 방어력 +1200" },
        "물리방어력+2500": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "물리 방어력 +2500" },
        "물리방어력+4000": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "물리 방어력 +4000" },
  "물리방어력+5000": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "물리 방어력 +5000" },
  "물리방어력+6000": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "물리 방어력 +6000" },
  "물리방어력+7000": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "물리 방어력 +7000" },
  "마법방어력+4000": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "마법 방어력 +4000" },
  "마법방어력+5000": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "마법 방어력 +5000" },
  "마법방어력+6000": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "마법 방어력 +6000" },
  "마법방어력+7000": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "마법 방어력 +7000" },
  "최대생명력+8400": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "최대 생명력 +8400", statHp: 8400 },
  "최대생명력+11200": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "최대 생명력 +11200", statHp: 11200 },
  "최대생명력+14000": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "최대 생명력 +14000", statHp: 14000 },
  "최대생명력+16800": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "최대 생명력 +16800", statHp: 16800 },
  "전투중생명력회복량+80": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "전투 중 생명력 회복량 +80" },
  "전투중생명력회복량+100": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "전투 중 생명력 회복량 +100" },
  "전투중생명력회복량+130": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "전투 중 생명력 회복량 +130" },
  "전투중생명력회복량+160": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "전투 중 생명력 회복량 +160" },
  "전투자원자연회복량+6.00%": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "전투자원 자연 회복량 +6%" },
  "전투자원자연회복량+8.00%": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "전투자원 자연 회복량 +8%" },
  "전투자원자연회복량+10.00%": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "전투자원 자연 회복량 +10%" },
  "전투자원자연회복량+12.00%": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "전투자원 자연 회복량 +12%" },
  "이동기및기상기재사용대기시간이6%감소한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "이동기 및 기상기 쿨감 +6%" },
  "이동기및기상기재사용대기시간이8%감소한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "이동기 및 기상기 쿨감 +8%" },
  "이동기및기상기재사용대기시간이10%감소한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "이동기 및 기상기 쿨감 +10%" },
  "이동기및기상기재사용대기시간이12%감소한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "이동기 및 기상기 쿨감 +12%" },
  "공격적중시90초동안경직및피격이상에면역이된다.(재사용대기시간90초)해당효과는1회피격시사라진다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "공격 적중 시 90초간 경피면" },
  "공격적중시80초동안경직및피격이상에면역이된다.(재사용대기시간80초)해당효과는1회피격시사라진다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "공격 적중 시 80초간 경피면" },
  "공격적중시70초동안경직및피격이상에면역이된다.(재사용대기시간70초)해당효과는1회피격시사라진다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "공격 적중 시 70초간 경피면" },
  "공격적중시60초동안경직및피격이상에면역이된다.(재사용대기시간60초)해당효과는1회피격시사라진다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "공격 적중 시 60초간 경피면" },
  "파티원보호및회복효과가2%증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "보호 및 회복 효과 +2.0%", careBuff: 0.02 },
  "파티원보호및회복효과가2.5%증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "보호 및 회복 효과 +2.5%", careBuff: 0.025 },
  "파티원보호및회복효과가3%증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "보호 및 회복 효과 +3.0%", careBuff: 0.03 },
  "파티원보호및회복효과가3.5%증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "보호 및 회복 효과 +3.5%", careBuff: 0.035 },
  
  // 기본 기본 스펙류 (카테고리 3)
  "최대생명력+5500": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "최대 생명력 +5500", statHp: 5500 },
  "최대생명력+7300": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "최대 생명력 +7300", statHp: 7300 },
  "최대생명력+9100": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "최대 생명력 +9100", statHp: 9100 },
  "최대생명력+11000": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "최대 생명력 +11000", statHp: 11000 },
  "최대마나+150": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "최대 마나 +150" },
  "최대마나+200": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "최대 마나 +200" },
  "최대마나+250": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "최대 마나 +250" },
  "최대마나+300": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "최대 마나 +300" },
  "물리방어력+500": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "물리 방어력 +500" },
  "물리방어력+1200": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "물리 방어력 +1200" },
  "물리방어력+2500": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "물리 방어력 +2500" },
  "물리방어력+4000": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "물리 방어력 +4000" },

  // 특수 효과 옵션류 (오뚝이, 돌진, 강타 등)
  "[오뚝이]기상기사용후4초동안인내가100증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "오뚝이" },
  "[오뚝이]기상기사용후4초동안인내가130증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "오뚝이" },
  "[오뚝이]기상기사용후4초동안인내가160증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "오뚝이" },
  "[오뚝이]기상기사용후4초동안인내가200증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "오뚝이" },
  "[돌진]이동기사용후4초동안신속이50,인내가50증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "돌진" },
  "[돌진]이동기사용후4초동안신속이65,인내가65증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "돌진" },
  "[돌진]이동기사용후4초동안신속이80,인내가80증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "돌진" },
  "[돌진]이동기사용후4초동안신속이100,인내가100증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "돌진" },
  "[강타]이동기사용후4초동안제압이50,숙련이50증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "강타" },
  "[강타]이동기사용후4초동안제압이65,숙련이65증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "강타" },
  "[강타]이동기사용후4초동안제압이80,숙련이80증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "강타" },
  "[강타]이동기사용후4초동안제압이100,숙련이100증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "강타" },
  "[타격]기본공격적중후4초동안숙련이100증가한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "타격" },
  "[타격]기본공격적중후4초동안숙련이130증가한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "타격" },
  "[타격]기본공격적중후4초동안숙련이160증가한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "타격" },
  "[타격]기본공격적중후4초동안숙련이200증가한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "타격" },
  "[마나회수]마나를소모하는스킬사용시20%확률로마나를125회복한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "마나회수" },
  "[마나회수]마나를소모하는스킬사용시20%확률로마나를150회복한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "마나회수" },
  "[마나회수]마나를소모하는스킬사용시20%확률로마나를175회복한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "마나회수" },
  "[마나회수]마나를소모하는스킬사용시20%확률로마나를200회복한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "마나회수" },
  "[속공]몬스터에게피격시7%확률로8초동안'속공'효과를획득한다.속공:무기공격력이1000,공격속도가2%,이동속도가2%상승한다.(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "속공" },
  "[속공]몬스터에게피격시10%확률로8초동안'속공'효과를획득한다.속공:무기공격력이1000,공격속도가2%,이동속도가2%상승한다.(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "속공" },
  "[속공]몬스터에게피격시12%확률로8초동안'속공'효과를획득한다.속공:무기공격력이1000,공격속도가2%,이동속도가2%상승한다.(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "속공" },
  "[속공]몬스터에게피격시15%확률로8초동안'속공'효과를획득한다.속공:무기공격력이1000,공격속도가2%,이동속도가2%상승한다.(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "속공" },
  "[투자]배틀아이템사용후8초동안무기공격력이1300증가한다.(재사용대기시간30초)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "투자" },
  "[투자]배틀아이템사용후8초동안무기공격력이1600증가한다.(재사용대기시간30초)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "투자" },
  "[투자]배틀아이템사용후8초동안무기공격력이2200증가한다.(재사용대기시간30초)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "투자" },
  "[투자]배틀아이템사용후8초동안무기공격력이3000증가한다.(재사용대기시간30초)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "투자" },
  "[반전]생명력이10%이하일경우몬스터에게피격시10초후체력반전이일어난다.(재사용대기시간900초)(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "반전" },
  "[반전]생명력이15%이하일경우몬스터에게피격시10초후체력반전이일어난다.(재사용대기시간900초)(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "반전" },
  "[반전]생명력이20%이하일경우몬스터에게피격시10초후체력반전이일어난다.(재사용대기시간900초)(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "반전" },
  "[반전]생명력이25%이하일경우몬스터에게피격시10초후체력반전이일어난다.(재사용대기시간900초)(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "반전" },
  "[멸시]60레벨이하시드등급이하몬스터에게주는피해량이2%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "멸시" },
  "[멸시]60레벨이하시드등급이하몬스터에게주는피해량이3%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "멸시" },
  "[멸시]60레벨이하시드등급이하몬스터에게주는피해량이4%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "멸시" },
  "[멸시]60레벨이하시드등급이하몬스터에게주는피해량이5%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "멸시" },
  "[무시]60레벨이하시드등급이하몬스터에게받는피해량이3%감소한다.(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "무시" },
  "[무시]60레벨이하시드등급이하몬스터에게받는피해량이5%감소한다.(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "무시" },
  "[무시]60레벨이하시드등급이하몬스터에게받는피해량이7%감소한다.(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "무시" },
  "[무시]60레벨이하시드등급이하몬스터에게받는피해량이10%감소한다.(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "무시" },
  "[회생]기상기사용후20초동안매초마다생명력을80회복한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "회생" },
  "[회생]기상기사용후20초동안매초마다생명력을100회복한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "회생" },
  "[회생]기상기사용후20초동안매초마다생명력을130회복한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "회생" },
  "[회생]기상기사용후20초동안매초마다생명력을160회복한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "회생" },
  "[긴급수혈]생명력이50%이하일경우몬스터에게피격시30%확률로생명력을8000회복한다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "긴급수혈" },
  "[긴급수혈]생명력이50%이하일경우몬스터에게피격시30%확률로생명력을10000회복한다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "긴급수혈" },
  "[긴급수혈]생명력이50%이하일경우몬스터에게피격시30%확률로생명력을13000회복한다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "긴급수혈" },
  "[긴급수혈]생명력이50%이하일경우몬스터에게피격시30%확률로생명력을16000회복한다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "긴급수혈" },
  "[응급처치]생명력이30%이하에서피격시5초동안회복배틀아이템의회복량을4000추가시켜주는효과를획득한다.(재사용대기시간120초)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "응급처치" },
  "[응급처치]생명력이30%이하에서피격시5초동안회복배틀아이템의회복량을5000추가시켜주는효과를획득한다.(재사용대기시간120초)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "응급처치" },
  "[응급처치]생명력이30%이하에서피격시5초동안회복배틀아이템의회복량을6500추가시켜주는효과를획득한다.(재사용대기시간120초)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "응급처치" },
  "[응급처치]생명력이30%이하에서피격시5초동안회복배틀아이템의회복량을8000추가시켜주는효과를획득한다.(재사용대기시간120초)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "응급처치" },
  "[앵콜]배틀아이템중회복계열사용시12%확률로효과가한번더발동된다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "앵콜" },
  "[앵콜]배틀아이템중회복계열사용시16%확률로효과가한번더발동된다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "앵콜" },
  "[앵콜]배틀아이템중회복계열사용시20%확률로효과가한번더발동된다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "앵콜" },
  "[앵콜]배틀아이템중회복계열사용시25%확률로효과가한번더발동된다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "앵콜" },

  // 실효 계산 반영 특수 딜러 전용 옵션류 (쐐기, 망치, 순환, 열정, 냉정, 약노, 응원 등)
  "[쐐기]몬스터에게공격적중시8초동안'쐐기'효과를획득한다.쐐기가4중첩상태가되면8초동안'강철쐐기'상태로변경되며추가피해증가효과가2배가된다.쐐기:공격적중시추가피해가0.3%증가한다.(최대4중첩,발동재사용대기시간2초)(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "쐐기", addDmg: 1.2 },
  "[쐐기]몬스터에게공격적중시8초동안'쐐기'효과를획득한다.쐐기가4중첩상태가되면8초동안'강철쐐기'상태로변경되며추가피해증가효과가2배가된다.쐐기:공격적중시추가피해가0.35%증가한다.(최대4중첩,발동재사용대기시간2초)(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "쐐기", addDmg: 1.4 },
  "[쐐기]몬스터에게공격적중시8초동안'쐐기'효과를획득한다.쐐기가4중첩상태가되면8초동안'강철쐐기'상태로변경되며추가피해증가효과가2배가된다.쐐기:공격적중시추가피해가0.45%증가한다.(최대4중첩,발동재사용대기시간2초)(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "쐐기", addDmg: 1.8 },
  "[쐐기]몬스터에게공격적중시8초동안'쐐기'효과를획득한다.쐐기가4중첩상태가되면8초동안'강철쐐기'상태로변경되며추가피해증가효과가2배가된다.쐐기:공격적중시추가피해가0.5%증가한다.(최대4중첩,발동재사용대기시간2초)(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "쐐기", addDmg: 2.0 },
  
  "[망치]몬스터에게공격적중시8초동안'망치'효과를획득한다.'강철쐐기'효과를보유시치명타피해가8%추가증가한다.망치:공격적중시치명타피해량이6%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "망치", critDmg: 6, finalDmg: 2.2 },
  "[망치]몬스터에게공격적중시8초동안'망치'효과를획득한다.'강철쐐기'효과를보유시치명타피해가8%추가증가한다.망치:공격적중시치명타피해량이8%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "망치", critDmg: 8, finalDmg: 2.9 },
  "[망치]몬스터에게공격적중시8초동안'망치'효과를획득한다.'강철쐐기'효과를보유시치명타피해가8%추가증가한다.망치:공격적중시치명타피해량이10%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "망치", critDmg: 10, finalDmg: 3.6 },
  "[망치]몬스터에게공격적중시8초동안'망치'효과를획득한다.'강철쐐기'효과를보유시치명타피해가8%추가증가한다.망치:공격적중시치명타피해량이12%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "망치", critDmg: 12, finalDmg: 4.3 },
  
  "[순환]몬스터에게공격적중시30초동안'순환'효과를획득한다.해당효과는갱신되지않는다.순환:10초간격으로스킬피해2.5%증가,치명타적중률4%증가,치명타피해6%증가효과가순차적으로적용된다.(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "순환", finalDmg: 2.5, critRate: 1.4, critDmg: 2 },
  "[순환]몬스터에게공격적중시30초동안'순환'효과를획득한다.해당효과는갱신되지않는다.순환:10초간격으로스킬피해3%증가,치명타적중률5%증가,치명타피해8%증가효과가순차적으로적용된다.(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "순환", finalDmg: 3.1, critRate: 1.7, critDmg: 2.7 },
  "[순환]몬스터에게공격적중시30초동안'순환'효과를획득한다.해당효과는갱신되지않는다.순환:10초간격으로스킬피해3.5%증가,치명타적중률6%증가,치명타피해10%증가효과가순차적으로적용된다.(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "순환", finalDmg: 3.75, critRate: 2.0, critDmg: 3.4 },
  "[순환]몬스터에게공격적중시30초동안'순환'효과를획득한다.해당효과는갱신되지않는다.순환:10초간격으로스킬피해4%증가,치명타적중률7%증가,치명타피해12%증가효과가순차적으로적용된다.(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "순환", finalDmg: 4.4, critRate: 2.4, critDmg: 4 },
  
  "[열정]자신의생명력이40%이상일경우적에게공격적중시3초동안'열정'효과를획득한다.'냉정'효과를보유중일때'열정'효과가1%추가증가한다.열정:몬스터에게주는피해가2.5%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "열정", finalDmg: 2.5 },
  "[열정]자신의생명력이40%이상일경우적에게공격적중시3초동안'열정'효과를획득한다.'냉정'효과를보유중일때'열정'효과가1%추가증가한다.열정:몬스터에게주는피해가3%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "열정", finalDmg: 3.0 },
  "[열정]자신의생명력이40%이상일경우적에게공격적중시3초동안'열정'효과를획득한다.'냉정'효과를보유중일때'열정'효과가1%추가증가한다.열정:몬스터에게주는피해가3.5%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "열정", finalDmg: 3.5 },
  "[열정]자신의생명력이40%이상일경우적에게공격적중시3초동안'열정'효과를획득한다.'냉정'효과를보유중일때'열정'효과가1%추가증가한다.열정:몬스터에게주는피해가4%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "열정", finalDmg: 4.0 },
  
  "[냉정]자신의생명력이80%이하일경우적에게공격적중시3초동안'냉정'효과를획득한다.'열정'효과를보유중일때'냉정'효과가1%추가증가한다.냉정:몬스터에게주는피해가2.5%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "냉정", finalDmg: 2.5 },
  "[냉정]자신의생명력이80%이하일경우적에게공격적중시3초동안'냉정'효과를획득한다.'열정'효과를보유중일때'냉정'효과가1%추가증가한다.냉정:몬스터에게주는피해가3%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "냉정", finalDmg: 3.0 },
  "[냉정]자신의생명력이80%이하일경우적에게공격적중시3초동안'냉정'효과를획득한다.'열정'효과를보유중일때'냉정'효과가1%추가증가한다.냉정:몬스터에게주는피해가3.5%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "냉정", finalDmg: 3.5 },
  "[냉정]자신의생명력이80%이하일경우적에게공격적중시3초동안'냉정'효과를획득한다.'열정'효과를보유중일때'냉정'효과가1%추가증가한다.냉정:몬스터에게주는피해가4%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "냉정", finalDmg: 4.0 },
  
  "[깨달음]몬스터에게공격적중시8초동안스킬적중시아이덴티티게이지획득량이3%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "깨달음" },
  "[깨달음]몬스터에게공격적중시8초동안스킬적중시아이덴티티게이지획득량이4%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "깨달음" },
  "[깨달음]몬스터에게공격적중시8초동안스킬적중시아이덴티티게이지획득량이5%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "깨달음" },
  "[깨달음]몬스터에게공격적중시8초동안스킬적중시아이덴티티게이지획득량이6%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "깨달음" },
  
  "[비수]몬스터에게공격적중시8초동안대상의방어력을1.5%감소시킨다.'비수'효과는하나의대상에게최대1개만적용된다.(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "비수", atkBuffPlus: 0.92 },
  "[비수]몬스터에게공격적중시8초동안대상의방어력을1.8%감소시킨다.'비수'효과는하나의대상에게최대1개만적용된다.(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "비수", atkBuffPlus: 1.14 },
  "[비수]몬스터에게공격적중시8초동안대상의방어력을2.1%감소시킨다.'비수'효과는하나의대상에게최대1개만적용된다.(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "비수", atkBuffPlus: 1.35 },
  "[비수]몬스터에게공격적중시8초동안대상의방어력을2.5%감소시킨다.'비수'효과는하나의대상에게최대1개만적용된다.(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "비수", atkBuffPlus: 1.61 },
  
  "[약점노출]몬스터에게공격적중시8초동안대상의치명타저항을1.5%감소시킨다.'약점노출'효과는하나의대상에게최대1개만적용된다.(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "약점 노출", critRateBuff: 1.5, atkBuff: 1.2 },
  "[약점노출]몬스터에게공격적중시8초동안대상의치명타저항을1.8%감소시킨다.'약점노출'효과는하나의대상에게최대1개만적용된다.(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "약점 노출", critRateBuff: 1.8, atkBuff: 1.5 },
  "[약점노출]몬스터에게공격적중시8초동안대상의치명타저항을2.1%감소시킨다.'약점노출'효과는하나의대상에게최대1개만적용된다.(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "약점 노출", critRateBuff: 2.1, atkBuff: 1.77 },
  "[약점노출]몬스터에게공격적중시8초동안대상의치명타저항을2.5%감소시킨다.'약점노출'효과는하나의대상에게최대1개만적용된다.(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "약점 노출", critRateBuff: 2.5, atkBuff: 2.12 },
  
  "[응원]파티효과로보호효과(보호막,생명력회복,받는피해감소)가적용된대상에게5초동안'응원'효과가적용된다.지속시간이없는보호효과에는적용되지않는다.응원:몬스터에게공격적중시주는피해가0.7%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "응원", shieldBuff: 0.7, atkBuffPlus: 0.7 },
  "[응원]파티효과로보호효과(보호막,생명력회복,받는피해감소)가적용된대상에게5초동안'응원'효과가적용된다.지속시간이없는보호효과에는적용되지않는다.응원:몬스터에게공격적중시주는피해가0.9%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "응원", shieldBuff: 0.9, atkBuffPlus: 0.9 },
  "[응원]파티효과로보호효과(보호막,생명력회복,받는피해감소)가적용된대상에게5초동안'응원'효과가적용된다.지속시간이없는보호효과에는적용되지않는다.응원:몬스터에게공격적중시주는피해가1.1%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "응원", shieldBuff: 1.1, atkBuffPlus: 1.1 },
  "[응원]파티효과로보호효과(보호막,생명력회복,받는피해감소)가적용된대상에게5초동안'응원'효과가적용된다.지속시간이없는보호효과에는적용되지않는다.응원:몬스터에게공격적중시주는피해가1.3%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "응원", shieldBuff: 1.3, atkBuffPlus: 1.3 },
  
  "[수확]공격적중시3%의확률로60초간'정기'효과를획득한다.정기:무기공격력이160증가한다.(최대10중첩)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "수확" },
  "[수확]공격적중시3%의확률로60초간'정기'효과를획득한다.정기:무기공격력이190증가한다.(최대10중첩)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "수확" },
  "[수확]공격적중시3%의확률로60초간'정기'효과를획득한다.정기:무기공격력이220증가한다.(최대10중첩)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "수확" },
  "[수확]공격적중시3%의확률로60초간'정기'효과를획득한다.정기:무기공격력이250증가한다.(최대10중첩)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "수확" },
  
  "[보상]치명타가발생할경우10초동안'보상'효과를획득한다.(발동재사용대기시간2초)보상효과가8중첩이되면다음공격시상대에게강력한피해를입힌다.": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "보상" },
  "[보상]치명타가발생할경우10초동안'보상'효과를획득한다.(발동재사용대기시간2초)보상효과가7중첩이되면다음공격시상대에게강력한피해를입힌다.": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "보상" },
  "[보상]치명타가발생할경우10초동안'보상'효과를획득한다.(발동재사용대기시간2초)보상효과가6중첩이되면다음공격시상대에게강력한피해를입힌다.": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "보상" },
  "[보상]치명타가발생할경우10초동안'보상'효과를획득한다.(발동재사용대기시간2초)보상효과가5중첩이되면다음공격시상대에게강력한피해를입힌다.": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "보상" },
  
  "무기공격력+1300": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "무기 공격력 +1300", weaponAtkPlus: 1300 },
  "무기공격력+1600": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "무기 공격력 +1600", weaponAtkPlus: 1600 },
  "무기공격력+1900": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "무기 공격력 +1900", weaponAtkPlus: 1900 },
  "무기공격력+2200": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "무기 공격력 +2200", weaponAtkPlus: 2200 },
  
  "[우월]몬스터에게공격적중시주는피해가1.5%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "우월", finalDmg: 1.5 },
  "[우월]몬스터에게공격적중시주는피해가2%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "우월", finalDmg: 2.0 },
  "[우월]몬스터에게공격적중시주는피해가2.5%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "우월", finalDmg: 2.5 },
  "[우월]몬스터에게공격적중시주는피해가3%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "우월", finalDmg: 3.0 },
  
  "[습격]몬스터에게공격적중시치명타피해량이4%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "습격", critDmg: 4, finalDmg: 1.38 },
  "[습격]몬스터에게공격적중시치명타피해량이6%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "습격", critDmg: 6, finalDmg: 2.2 },
  "[습격]몬스터에게공격적중시치명타피해량이8%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "습격", critDmg: 8, finalDmg: 2.9 },
  "[습격]몬스터에게공격적중시치명타피해량이10%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "습격", critDmg: 10, finalDmg: 3.6 },
  
  "[정밀]몬스터에게공격적중시치명타적중이2%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "정밀", critRate: 2, finalDmg: 1.3 },
  "[정밀]몬스터에게공격적중시치명타적중이3%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "정밀", critRate: 3, finalDmg: 2.0 },
  "[정밀]몬스터에게공격적중시치명타적중이4%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "정밀", critRate: 4, finalDmg: 2.7 },
  "[정밀]몬스터에게공격적중시치명타적중이5%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "정밀", critRate: 5, finalDmg: 3.4 },
  
  "[상처악화]몬스터에게치명타적중시2%의확률로각성기를제외한치명타피해가100%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "상처악화" },
  "[상처악화]몬스터에게치명타적중시3%의확률로각성기를제외한치명타피해가100%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "상처악화" },
  "[상처악화]몬스터에게치명타적중시5%의확률로각성기를제외한치명타피해가100%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "상처악화" },
  "[상처악화]몬스터에게치명타적중시7%의확률로각성기를제외한치명타피해가100%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "상처악화" },
  
  "[분개]몬스터에게공격적중시일정확률로10초동안'분개'효과를획득한다.23중첩상태일경우,각성기를제외한다음공격은반드시치명타가발생되며'분개'버프는제거된다.(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "분개" },
  "[분개]몬스터에게공격적중시일정확률로10초동안'분개'효과를획득한다.20중첩상태일경우,각성기를제외한다음공격은반드시치명타가발생되며'분개'버프는제거된다.(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "분개" },
  "[분개]몬스터에게공격적중시일정확률로10초동안'분개'효과를획득한다.17중첩상태일경우,각성기를제외한다음공격은반드시치명타가발생되며'분개'버프는제거된다.(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "분개" },
  "[분개]몬스터에게공격적중시일정확률로10초동안'분개'효과를획득한다.14중첩상태일경우,각성기를제외한다음공격은반드시치명타가발생되며'분개'버프는제거된다.(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "분개" },
  
  "[기습]백어택으로주는피해가2.5%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "기습", finalDmg: 2.5 },
  "[기습]백어택으로주는피해가3%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "기습", finalDmg: 3.0 },
  "[기습]백어택으로주는피해가3.5%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "기습", finalDmg: 3.5 },
  "[기습]백어택으로주는피해가4%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "기습", finalDmg: 4.0 },
  
  "[결투]헤드어택으로주는피해가2.5%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "결투", finalDmg: 2.5 },
  "[결투]헤드어택으로주는피해가3%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "결투", finalDmg: 3.0 },
  "[결투]헤드어택으로주는피해가3.5%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "결투", finalDmg: 3.5 },
  "[결투]헤드어택으로주는피해가4%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "결투", finalDmg: 4.0 },
  
  "[적립]몬스터에게기본공격적중시60초동안'적립'효과를획득한다.해당효과10중첩시3초동안'만기도래'효과로변경된다.(발동재사용대기시간60초)만기도래:각성기제외일반스킬의치명타피해량이20%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "하", 고대: "", 딜러: true, 서폿: true, initial: "적립" },
  "[적립]몬스터에게기본공격적중시60초동안'적립'효과를획득한다.해당효과10중첩시3초동안'만기도래'효과로변경된다.(발동재사용대기시간60초)만기도래:각성기제외일반스킬의치명타피해량이30%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "중", 고대: "하", 딜러: true, 서폿: true, initial: "적립" },
  "[적립]몬스터에게기본공격적중시60초동안'적립'효과를획득한다.해당효과10중첩시3초동안'만기도래'효과로변경된다.(발동재사용대기시간60초)만기도래:각성기제외일반스킬의치명타피해량이40%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "상", 고대: "중", 딜러: true, 서폿: true, initial: "적립" },
  "[적립]몬스터에게기본공격적중시60초동안'적립'효과를획득한다.해당효과10중첩시3초동안'만기도래'효과로변경된다.(발동재사용대기시간60초)만기도래:각성기제외일반스킬의치명타피해량이50%증가한다.(60레벨초과몬스터에게는효과감소)": { 유물: "", 고대: "상", 딜러: true, 서폿: true, initial: "적립" }
    }
};

const ENGRAVE_TABLE = {
  "원한":           { type:"enemyDmg", vals:{1:4, 2:10, 3:20, 4:24} },
  "저주받은 인형":   { type:"atkPct",   vals:{1:3, 2:8, 3:16, 4:20} },
  "예리한 둔기":     { type:"critDmg",  vals:{1:10, 2:25, 3:40, 4:50} },
  "기습의 대가":     { type:"backDmg",  vals:{1:5, 2:12, 3:25, 4:30} },
  "타격의 대가":     { type:"frontDmg", vals:{1:5, 2:12, 3:25, 4:30} },
  "결투의 대가":     { type:"headDmg",  vals:{1:5, 2:12, 3:25, 4:30} },
  "아드레날린":     { type:"adrenalin", vals:{1:1, 2:1, 3:1, 4:1} },
  "질량 증가":       { type:"atkPct",   vals:{1:10, 2:12, 3:14, 4:18} },
  "돌격대장":       { type:"moveSyn",  vals:{1:1, 2:1, 3:1, 4:1} },
  "정기 흡수":       { type:"specSyn",  vals:{1:1, 2:1, 3:1, 4:1} },
  "속전속결":       { type:"skillDmg", vals:{1:4, 2:10, 3:20, 4:24} },
  "슈퍼 차지":       { type:"chargeDmg",vals:{1:4, 2:10, 3:20, 4:24} },
  "선수필승":       { type:"firstDmg", vals:{1:4, 2:10, 3:20, 4:24} },
  "정밀 단도":       { type:"critRate", vals:{1:3, 2:6, 3:9, 4:12} },
  "약자 무시":       { type:"enemyDmg", vals:{1:3, 2:8, 3:16, 4:20} },
  "이동속도 감소": { type:"moveSpeed", vals:{1:-2, 2:-4, 3:-6, 4:-6} },
  "공격속도 감소": { type:"atkSpeed",  vals:{1:-2, 2:-4, 3:-6, 4:-6} },
  "공격력 감소":   { type:"atkPct",    vals:{1:-2, 2:-4, 3:-6, 4:-6} },
  "방어력 감소":   { type:"defPct",    vals:{1:-2, 2:-4, 3:-6, 4:-6} },


};

const SPEC_BY_CLASS = {
  "창술사": [
    { label:"타격 시 듀얼 게이지 회복량", coef:0.0501 },
    { label:"집중 스킬 피해량", coef:0.0601 },
    { label:"각성 스킬 피해량", coef:0.0219 },
  ],
  "디스트로이어": [
    { label:"중력 코어당 해방 스킬 피해 증폭", coef:0.0765 },
    { label:"해방 스킬 사용 시 중력 게이지 획득", coef:0.0429 },
    { label:"중력가중 사용 시 피해량", coef:0.0715 },
    { label:"각성 스킬 피해량", coef:0.0218 },
  ],
  "버서커": [
    { label:"분노 게이지 획득량", coef:0.0954 },
    { label:"폭주 효과 증폭", coef:0.037193},
    { label:"블러디러쉬 스킬 피해량", coef:0.1717 },
    { label:"각성 스킬 피해량", coef:0.0219 },
  ],
  "워로드": [
    { label:"실드 게이지 회복량", coef:0.1001 },
    { label:"전장의 방패 피해·실드량", coef:0.0715 },
    { label:"일반 스킬 피해량", coef:0.1574 },
    { label:"각성 스킬 피해량", coef:0.0219 },
  ],
  "홀리나이트": [
    { label:"신성의 오라 적용 효율", coef:0.0901 },
    { label:"타격 시 신앙 게이지 획득", coef:0.0358 },
    { label:"각성 스킬 피해량", coef:0.0219 },
  ],
  "슬레이어": [
    { label:"분노 게이지 획득량", coef:0.0572 },
    { label:"폭주 상태 스킬 피해량", coef:0.0171 },
    { label:"블러드러스트 스킬 피해량", coef:0.1716 },
    { label:"각성 스킬 피해량", coef:0.0218 },
  ],
  "발키리": [
    { label:"타격 시 신앙 게이지 획득", coef:0.0285 },
    { label:"빛의 해방 적주피 버프 효율", coef:0.0857 },
    { label:"각성 스킬 피해량", coef:0.0217 },
  ],
  "기공사": [
    { label:"금강선공 효과 증폭", coef:0.0213 },
    { label:"기공 스킬 피해량", coef:0.0285 },
    { label:"각성 스킬 피해량", coef:0.0217 },
  ],
  "배틀마스터": [
    { label:"오의 스킬 피해량", coef:0.0385 },
    { label:"엘리멘탈 게이지 획득량", coef:0.1001 },
    { label:"각성 스킬 피해량", coef:0.0217 },
  ],
  "브레이커": [
    { label:"권왕태세 충격 스킬 피해", coef:0.0923 },
    { label:"권왕태세 기력 스킬 피해", coef:0.0572 },
    { label:"투지 에너지 회복량", coef:0.0401 },
    { label:"각성 스킬 피해량", coef:0.0219 },
  ],
  "스트라이커": [
    { label:"오의 스킬 피해량", coef:0.0321 },
    { label:"엘리멘탈 게이지 획득량", coef:0.1001 },
    { label:"각성 스킬 피해량", coef:0.0217 },
  ],
  "인파이터": [
    { label:"충격 스킬 피해량", coef:0.0515 },
    { label:"충격 스킬 기력 회수", coef:0.0357 },
    { label:"투지 에너지 회복량", coef:0.0572 },
    { label:"각성 스킬 피해량", coef:0.0217 },
  ],
  "건슬링어": [
    { label:"핸드건 스킬 치명타 피해", coef:0.1073 },
    { label:"샷건 스킬 물리/마법 관통", coef:0.0358 },
    { label:"라이플 스킬 피해량", coef:0.0358 },
    { label:"각성 스킬 피해량", coef:0.0219 },
  ],
  "데빌헌터": [
    { label:"핸드건 스킬 치명타 피해", coef:0.1073 },
    { label:"샷건 스킬 피해량", coef:0.0358 },
    { label:"라이플 스킬 물리/마법 관통", coef:0.0358 },
    { label:"각성 스킬 피해량", coef:0.0218 },
  ],
  "블래스터": [
    { label:"포격 스킬 피해량", coef:0.0715 },
    { label:"포격 게이지 획득량", coef:0.0143 },
    { label:"화력 버프 효율", coef:0.0744 },
    { label:"각성 스킬 피해량", coef:0.0219 },
  ],
  "스카우터": [
    { label:"적중 시 코어 에너지 획득", coef:0.0715 },
    { label:"싱크 계열 스킬 피해량", coef:0.0916 },
    { label:"각성 스킬 피해량", coef:0.0219 },
  ],
  "호크아이": [
    { label:"호크게이지 자연 회복량", coef:0.0429 },
    { label:"실버호크 스킬 피해량", coef:0.1073 },
    { label:"실버호크 소환 중 스킬 피해", coef:0.0122 },
    { label:"각성 스킬 피해량", coef:0.0219 },
  ],
  "바드": [
    { label:"구원의 세레나데 회복량", coef:0.0286 },
    { label:"용맹의 세레나데 버프 효율", coef:0.0501 },
    { label:"세레나데 게이지 획득량", coef:0.0401 },
    { label:"각성 스킬 피해량", coef:0.0218 },
  ],
  "서머너": [
    { label:"고대 정령 스킬 피해량", coef:0.1216 },
    { label:"고대의 기운 획득량", coef:0.0857 },
    { label:"각성 스킬 피해량", coef:0.0217 },
  ],
  "소서리스": [
    { label:"마력 강화·해방 속성 피해 효율", coef:0.2861 },
    { label:"신비한 마력 게이지 획득", coef:0.0358 },
    { label:"각성 스킬 피해량", coef:0.0219 },
  ],
  "아르카나": [
    { label:"루인 스킬 피해량", coef:0.0501 },
    { label:"카드 게이지 획득량", coef:0.0358 },
    { label:"각성 스킬 피해량", coef:0.0219 },
  ],
  "데모닉": [
    { label:"악마화 시 스킬 피해량", coef:0.0937 },
    { label:"타격 시 잠식 게이지 회복", coef:0.0715 },
    { label:"악마화 지속시간", coef:0.0429 },
    { label:"각성 스킬 피해량", coef:0.0219 },
  ],
  "리퍼": [
    { label:"급습 스킬 피해량", coef:0.0443 },
    { label:"타격 시 어둠 게이지 회복", coef:0.0429 },
    { label:"각성 스킬 피해량", coef:0.0219 },
  ],
  "블레이드": [
    { label:"버스트 스킬 피해량", coef:0.1230 },
    { label:"타격 시 아츠 게이지 회복", coef:0.0572 },
    { label:"아츠 발동 시 쿨감 효과", coef:0.0286 },
    { label:"각성 스킬 피해량", coef:0.0219 },
  ],
  "소울이터": [
    { label:"사신화 시 사신 스킬 피해", coef:0.0807 },
    { label:"타격 시 빙의 게이지 회복", coef:0.0715 },
    { label:"각성 스킬 피해량", coef:0.0219 },
  ],
  "기상술사": [
    { label:"기상 스킬 피해량", coef:0.0793 },
    { label:"타격 시 빗방울 게이지 회복", coef:0.0357 },
    { label:"각성 스킬 피해량", coef:0.0217 },
  ],
  "도화가": [
    { label:"저무는 달 버프 효율", coef:0.0601 },
    { label:"떠오르는 해 회복량", coef:0.0343 },
    { label:"조화 게이지 획득량", coef:0.0358 },
    { label:"각성 스킬 피해량", coef:0.0219 },
  ],
  "차원술사": [
    { label:"결합 스킬 피해량", coef:0.0643 },
    { label:"시간 가속 효과 증폭", coef:0.0521 },
    { label:"각성 스킬 피해량", coef:0.0217 },
  ],
  "환수사": [
    { label:"타격 시 환수의 기운 회복", coef:0.0429 },
    { label:"타격 시 곰·여우 기운 회복", coef:0.0930 },
    { label:"둔갑 스킬 피해량", coef:0.0475 },
    { label:"각성 스킬 피해량", coef:0.0219 },
  ],
  "가디언나이트": [
    { label:"타격 시 엠버레스 게이지 회복", coef:0.0286 },
    { label:"발현·화신 스킬 피해량", coef:0.0358 },
    { label:"화신 스킬 기운 소모당 추가 피해", coef:0.0086 },
    { label:"각성 스킬 피해량", coef:0.0219 },
  ],
};







const ENGRAVE_REGISTRY = {
  "슈퍼 차지": {
    base: 18.00,
    relic: [0, 0.75, 1.50, 2.25, 3.00],
    stone: { 1: 3.00, 2: 3.75, 3: 5.25, 4: 6.00 }
  },
  "원한": {

    base: 18.00,
    relic: [0, 0.75, 1.50, 2.25, 3.00],
    stone: { 1: 3.00, 2: 3.75, 3: 5.25, 4: 6.00 }
  },
 
  "기습의 대가": {
    base: 4.80,
    relic: [0, 0.70, 1.40, 2.10, 2.80],
    stone: { 1: 2.70, 2: 3.40, 3: 4.70, 4: 5.40 },
    backAttack: 15.00
  },

   "결투의 대가": {
    base: 4.80,
    relic: [0, 0.70, 1.40, 2.10, 2.80],
    stone: { 1: 2.70, 2: 3.40, 3: 4.70, 4: 5.40 },
    headAttack: 15.00
  },
 
  "타격의 대가": {
    base: 14.00,
    relic: [0, 0.75, 1.50, 2.25, 3.00],
    stone: { 1: 3.00, 2: 3.75, 3: 5.25, 4: 6.00 }
  },
  "돌격대장": {

    baseFactor: 40.00,
    relicFactor: [0, 2.00, 4.00, 6.00, 8.00],
    stoneFactor: { 1: 7.50, 2: 9.40, 3: 13.20, 4: 15.00 }
  },
  "아드레날린": {
    baseCrit: 14.00,
    relicCrit: [0, 1.50, 3.00, 4.50, 6.00],
    baseAp: 0.90, // 중첩당
    stoneAp: { 1: 0.48, 2: 0.60, 3: 0.83, 4: 0.95 }
  },
  "예리한 둔기": {
    baseCritDmg: 44.00,
    relicCritDmg: [0, 2.00, 4.00, 6.00, 8.00],
    stoneCritDmg: { 1: 7.50, 2: 9.40, 3: 13.20, 4: 15.00 }
  },
  "질량 증가": {
    base: 16.00,
    relic: [0, 0.75, 1.50, 2.25, 3.00],
    stone: { 1: 3.00, 2: 3.75, 3: 5.25, 4: 6.00 }
  },
  "저주받은 인형": {
    base: 14.00,
    relic: [0, 0.75, 1.50, 2.25, 3.00],
    stone: { 1: 3.00, 2: 3.75, 3: 5.25, 4: 6.00 }
  },
  "바리케이드": {
     base: 14.00,
    relic: [0, 0.75, 1.50, 2.25, 3.00],
    stone: { 1: 3.00, 2: 3.75, 3: 5.25, 4: 6.00 }
  },

  "달인의 저력": {   // 생명력 50% 이하일 때 적에게 주는 피해
    base: 14.00,
    relic: [0, 0.75, 1.50, 2.25, 3.00],
    stone: { 1: 3.00, 2: 3.75, 3: 5.25, 4: 6.00 }
  },
  "안정된 상태": {   // 생명력 65% 이상일 때 주는 피해
    base: 14.00,
    relic: [0, 0.75, 1.50, 2.25, 3.00],
    stone: { 1: 3.00, 2: 3.75, 3: 5.25, 4: 6.00 }
  },
  "추진력": {        // 이동기 사용 후 5초간 기본공격·각성기 제외 스킬 피해
    base: 14.00,
    relic: [0, 0.75, 1.50, 2.25, 3.00],
    stone: { 1: 3.00, 2: 3.75, 3: 5.25, 4: 6.00 }
  },
  "마나 효율 증가": { // 마나 사용 스킬 피해 + 마나 회복 속도
    base: 13.00,
    relic: [0, 0.75, 1.50, 2.25, 3.00],
    stone: { 1: 3.00, 2: 3.75, 3: 5.25, 4: 6.00 },
    manaRegen: 20.00
  },
  "속전속결": {      // 홀딩·캐스팅 스킬 피해 + 홀딩·캐스팅 속도
    base: 18.00,
    relic: [0, 0.75, 1.50, 2.25, 3.00],
    stone: { 1: 3.00, 2: 3.75, 3: 5.25, 4: 6.00 },
    speed: 20.00
  },
  "정기 흡수": {     // 공격·이동속도
    base: 13.00,
    relic: [0, 0.75, 1.50, 2.25, 3.00],
    stone: { 1: 3.00, 2: 3.75, 3: 5.25, 4: 6.00 }
  },
  "에테르 포식자": { // 에테르 습득 시 중첩당 효과
    baseAtkPerStack: 0.42,
    relicAtkPerStack: [0, 0.03, 0.06, 0.09, 0.12],
    stoneAtkPerStack: { 1: 0.10, 2: 0.13, 3: 0.18, 4: 0.20 },
    defPerStack: 1.00,
    maxStacks: 30,
    duration: 90,
    cooldown: 4.0
  },



};







const BARRICADE_CLASSES = ["디스트로이어", "스카우터", "워로드"];

const EVOLUTION_EFFECTS = [
  { name: "예리한 감각", aliases: ["예리한 감각","예리한감각"], stat: "critRate", maxLv: 2, values: [4.0, 8.0], category: 1 , group: "진화" },
  { name: "혼신의 강타", aliases: ["혼신의 강타","혼신의강타"], stat: "critRate", maxLv: 2, values: [12.0, 24.0], category: 1 , group: "진화" },
  { name: "일격", aliases: ["일격"], stat: "critRate", maxLv: 2, values: [10.0, 20.0], category: 1 , group: "진화" },
  { name: "일격_치피", aliases: ["일격"], stat: "critDmg", maxLv: 2, values: [16.0, 32.0], category: 1, condition: "방향성 공격 스킬", group: "진화"  },
    { name: "달인", aliases: ["달인"], stat: "critRate", maxLv: 1, values: [7.0], category: 2, condition: "스킬 사용 시 10초", group: "진화" },
  { name: "파괴 전차", aliases: ["파괴 전차","파괴전차"], stat: "atkSpeed", maxLv: 2, values: [4.0, 8.0], category: 1 , group: "진화" },
  { name: "축복의여신_공속", aliases: ["축복의 여신","축복의여신"], stat: "atkSpeed", maxLv: 3, values: [3.0, 6.0, 9.0], category: 2, group: "진화" },
  { name: "축복의여신_이속", aliases: ["축복의 여신","축복의여신"], stat: "moveSpeed", maxLv: 3, values: [3.0, 6.0, 9.0], category: 2, group: "진화" },
  { name: "진군_공속", aliases: ["진군"], stat: "atkSpeed", maxLv: 1, values: [4.0], category: 2 , group: "진화" },
  { name: "진군_이속", aliases: ["진군"], stat: "moveSpeed", maxLv: 1, values: [4.0], category: 2, group: "진화"  },
  { name: "전환난무", aliases: ["전환난무"], stat: "critRate", maxLv: 5, values: [0.8,1.6,2.4,3.2,4.0], category: 1, group: "깨달음" },
  { name: "연가비기", aliases: ["연가비기"], stat: "critRate", maxLv: 3, values: [20.0,20.0,20.0], category: 1, group: "깨달음" },
    { name: "치명적인 베기", aliases: ["치명적인 베기","치명적인베기"], stat: "critDmg", maxLv: 5, values: [4.0,8.0,12.0,16.0,20.0], category: 1, condition: "난무 스킬 한정(상시 적용으로 처리)", group: "깨달음" },
  { name: "관통 필살", aliases: ["관통 필살"], stat: "critRate", maxLv: 3, values: [100.0,100.0,100.0], category: 3, condition: "적룡필살 스킬 한정(확정 치명)", group: "도약", skill: "적룡필살" },
  { name: "정교함", aliases: ["정교함"], stat: "critRate", maxLv: 3, values: [5.0, 10.0, 15.0], category: 1, condition: "고독한기사 3렙 필요", group: "깨달음" },
  { name: "선봉장의함성 치피", aliases: ["선봉장의함성", "선봉장의 함성"], stat: "critDmg", maxLv: 3, values: [15.0, 30.0, 45.0], category: 2, condition: "진격태세 中 랜스 치피", group: "깨달음" },
  { name: "선봉장의함성 공속", aliases: ["선봉장의함성", "선봉장의 함성"], stat: "atkSpeed", maxLv: 3, values: [10.0, 10.0, 10.0], category: 2, condition: "전장의창 10초", group: "깨달음" },
  { name: "전술 훈련", aliases: ["전술훈련", "전술 훈련"], stat: "critRate", maxLv: 5, values: [1.6, 3.2, 4.8, 6.4, 8.0], category: 1, condition: "방어태세/전장의방패 한정", group: "깨달음" },
  { name: "광기 치적", aliases: ["광기"], stat: "critRate", maxLv: 3, values: [10.0, 20.0, 30.0], category: 2, condition: "광기 상태", group: "깨달음" },
  { name: "광기 공속", aliases: ["광기"], stat: "atkSpeed", maxLv: 3, values: [5.0, 10.0, 15.0], category: 2, condition: "광기 상태", group: "깨달음" },
  { name: "광기 이속", aliases: ["광기"], stat: "moveSpeed", maxLv: 3, values: [5.0, 10.0, 15.0], category: 2, condition: "광기 상태", group: "깨달음" },
  { name: "분노 자극", aliases: ["분노자극", "분노 자극"], stat: "critDmg", maxLv: 5, values: [3.0, 6.0, 9.0, 12.0, 15.0], category: 2, condition: "폭주/광기 中", group: "깨달음" },
  { name: "날카로운 해머", aliases: ["날카로운해머", "날카로운 해머"], stat: "critRate", maxLv: 3, values: [6.0, 12.0, 18.0], category: 2, condition: "해방스킬 코어당(Max 3코어)", group: "깨달음" },
  { name: "분노의 망치", aliases: ["분노의망치", "분노의 망치"], stat: "critDmg", maxLv: 3, values: [15.0, 33.0, 51.0], category: 2, condition: "해방스킬 코어당", group: "깨달음" },
  { name: "영역 강화", aliases: ["영역강화", "영역 강화"], stat: "critRate", maxLv: 5, values: [2.0, 4.0, 6.0, 8.0, 10.0], category: 2, condition: "중력가중/해방모드", group: "깨달음", skill: "중력 가중 스킬" },
  { name: "중력 가속", aliases: ["중력가속", "중력 가속"], stat: "atkSpeed", maxLv: 5, values: [2.0, 4.0, 6.0, 8.0, 10.0], category: 2, condition: "중력가중/해방모드", group: "깨달음" },
  { name: "중력 수련", aliases: ["중력수련", "중력 수련"], stat: "critRate", maxLv: 3, values: [10.0, 20.0, 30.0], category: 2, condition: "중력가중 기본+볼텍스 한정", group: "깨달음", skill: "중력 가중 스킬" },
  { name: "집중 공격", aliases: ["집중공격", "집중 공격"], stat: "critRate", maxLv: 3, values: [10.0, 20.0, 30.0], category: 3, condition: "체인스트라이크", group: "도약", skill: "체인 스트라이크" },
  { name: "신의 기사", aliases: ["신의기사", "신의 기사"], stat: "moveSpeed", maxLv: 3, values: [15.0, 15.0, 15.0], category: 2, condition: "신의집행자 60초", group: "깨달음" },
  { name: "징벌의 서막", aliases: ["징벌의서막", "징벌의 서막"], stat: "atkSpeed", maxLv: 5, values: [5.0, 5.0, 5.0, 5.0, 5.0], category: 2, condition: "징벌스킬 후 5초", group: "깨달음" },
  { name: "막을 수 없는 분노", aliases: ["막을수없는분노", "막을 수 없는 분노"], stat: "atkSpeed", maxLv: 3, values: [20.0, 20.0, 20.0], category: 3, condition: "블러드러스트 한정", group: "깨달음" },
  { name: "숙련된 힘", aliases: ["숙련된힘", "숙련된 힘"], stat: "critDmg", maxLv: 3, values: [30.0, 60.0, 90.0], category: 3, condition: "플레임블레이드 한정", group: "도약", skill: "플레임 블레이드" },
  { name: "격분", aliases: ["격분"], stat: "critDmg", maxLv: 3, values: [17.0, 34.0, 51.0], category: 2, condition: "폭주 中", group: "깨달음" },
  { name: "해방의 날개", aliases: ["해방의날개", "해방의 날개"], stat: "moveSpeed", maxLv: 3, values: [8.0, 8.0, 8.0], category: 2, condition: "빛의해방 60초, 파티 포함", group: "깨달음" },
  { name: "황후의 속삭임", aliases: ["황후의속삭임", "황후의 속삭임"], stat: "atkSpeed", maxLv: 3, values: [8.0, 8.0, 8.0], category: 2, condition: "4스택 루인 적중 6초", group: "깨달음" },
  { name: "폴스딜", aliases: ["폴스딜"], stat: "critDmg", maxLv: 3, values: [10.0, 20.0, 30.0], category: 3, condition: "더썬 한정", group: "도약" },
  { name: "악마의 눈속임", aliases: ["악마의눈속임", "악마의 눈속임"], stat: "critRate", maxLv: 3, values: [10.0, 20.0, 30.0], category: 3, condition: "더데빌 한정", group: "도약", skill: "더 데빌" },
  { name: "고대의 힘", aliases: ["고대의힘", "고대의 힘"], stat: "critRate", maxLv: 3, values: [5.0, 10.0, 16.0], category: 3, condition: "일반/고대정령 한정", group: "깨달음" },
  { name: "고대의 바람", aliases: ["고대의바람", "고대의 바람"], stat: "moveSpeed", maxLv: 5, values: [10.0, 10.0, 10.0, 10.0, 10.0], category: 1, condition: "고정", group: "깨달음" },
  { name: "교감강화", aliases: ["교감강화", "교감 강화"], stat: "critRate", maxLv: 5, values: [1.4, 2.8, 4.2, 5.6, 7.0], category: 2, condition: "소환스킬", group: "깨달음" },
  { name: "넘치는교감 공속", aliases: ["넘치는교감", "넘치는 교감"], stat: "atkSpeed", maxLv: 3, values: [3.0, 6.0, 10.0], category: 3, condition: "소환수 전용", group: "깨달음", dynamic: true, note: "캐릭터 본인이 아닌 소환수 대상 버프 - 별도 처리 필요" },
  { name: "넘치는교감 이속", aliases: ["넘치는교감", "넘치는 교감"], stat: "moveSpeed", maxLv: 3, values: [3.0, 6.0, 10.0], category: 3, condition: "소환수 전용", group: "깨달음", dynamic: true, note: "소환수 대상 버프 - 별도 처리 필요" },
  { name: "정령폭주", aliases: ["정령폭주", "정령 폭주"], stat: "atkSpeed", maxLv: 3, values: [30.0, 30.0, 30.0], category: 2, condition: "아키르폭주 中 소환수", group: "깨달음", dynamic: true, note: "소환수 대상 버프 - 별도 처리 필요" },
  { name: "마에스트로", aliases: ["마에스트로"], stat: "critRate", maxLv: 3, values: [3.0, 6.0, 10.0], category: 1, condition: "찬가:템페스트 필요", group: "깨달음" },
  { name: "격노의 악장", aliases: ["격노의악장", "격노의 악장"], stat: "critDmg", maxLv: 5, values: [4.0, 8.0, 12.0, 16.0, 20.0], category: 1, condition: "상시", group: "깨달음" },
  { name: "이명", aliases: ["이명"], stat: "critDmg", maxLv: 3, values: [20.0, 20.0, 20.0], category: 3, condition: "비바체 한정", group: "도약", skill: "비바체" },
  { name: "증폭의 세레나데 공속", aliases: ["증폭의세레나데", "증폭의 세레나데"], stat: "atkSpeed", maxLv: 3, values: [1.5, 3.0, 4.5], category: 2, condition: "용맹 8초, 파티 포함", group: "깨달음" },
  { name: "점화의 불씨", aliases: ["점화의불씨", "점화의 불씨"], stat: "critRate", maxLv: 3, values: [10.0, 20.0, 30.0], category: 2, condition: "마력해방 中", group: "깨달음" },
  { name: "발화", aliases: ["발화"], stat: "critDmg", maxLv: 3, values: [18.0, 36.0, 55.0], category: 2, condition: "마력해방 中", group: "깨달음" },
  { name: "마나 순환", aliases: ["마나순환", "마나 순환"], stat: "atkSpeed", maxLv: 3, values: [8.0, 8.0, 8.0], category: 2, condition: "마력방출 종료 시 최대 30초", group: "깨달음" },
  { name: "응집되는 마력", aliases: ["응집되는마력", "응집되는 마력"], stat: "atkSpeed", maxLv: 5, values: [3.0, 3.5, 4.0, 4.5, 5.0], category: 2, condition: "점멸 45초, 2중첩", group: "깨달음", dynamic: true, note: "2중첩까지 - 중첩 수 판정 필요" },
  { name: "공수래(기본)", aliases: ["공수래"], stat: "critRate", maxLv: 5, values: [0.8, 1.6, 2.4, 3.2, 4.0], category: 1, condition: "상시", group: "깨달음" },
  { name: "치명적인 체술", aliases: ["치명적인체술", "치명적인 체술"], stat: "critDmg", maxLv: 5, values: [3.0, 6.0, 9.0, 12.0, 15.0], category: 2, condition: "일반스킬 한정", group: "깨달음" },
  { name: "공수래(3개미만)", aliases: ["공수래"], stat: "critRate", maxLv: 5, values: [0.16, 0.32, 0.48, 0.64, 0.80], category: 2, condition: "구슬 3개 미만 시", group: "깨달음", dynamic: true, note: "구슬 개수 판정 필요 - API로 확인 어려움" },
  { name: "공수래(2개미만)", aliases: ["공수래"], stat: "critRate", maxLv: 5, values: [0.40, 0.80, 1.20, 1.60, 2.00], category: 2, condition: "구슬 2개 미만 시", group: "깨달음", dynamic: true, note: "구슬 개수 판정 필요" },
  { name: "공수래(1개미만)", aliases: ["공수래"], stat: "critRate", maxLv: 5, values: [0.64, 1.28, 1.92, 2.56, 3.20], category: 2, condition: "구슬 1개 미만 시", group: "깨달음", dynamic: true, note: "구슬 개수 판정 필요" },
  { name: "날카로운 타격 치적", aliases: ["날카로운타격", "날카로운 타격"], stat: "critRate", maxLv: 5, values: [1.0, 2.0, 3.0, 4.0, 5.0], category: 3, condition: "충격스킬", group: "깨달음" },
  { name: "날카로운 타격 치피", aliases: ["날카로운타격", "날카로운 타격"], stat: "critDmg", maxLv: 5, values: [4.0, 8.0, 12.0, 16.0, 20.0], category: 2, condition: "기력스킬", group: "깨달음" },
  { name: "치명적인 투지", aliases: ["치명적인투지", "치명적인 투지"], stat: "critRate", maxLv: 5, values: [2.0, 4.0, 6.0, 8.0, 10.0], category: 2, condition: "투지발산 中", group: "깨달음" },
  { name: "속도강화", aliases: ["속도강화", "속도 강화"], stat: "atkSpeed", maxLv: 1, values: [20.0], category: 2, condition: "투지발산 5초", group: "깨달음" },
  { name: "무상진결", aliases: ["무상진결"], stat: "critRate", maxLv: 3, values: [5.0, 10.0, 15.0], category: 1, condition: "무상신공 루트", group: "깨달음" },
  { name: "단계적응", aliases: ["단계적응", "단계 적응"], stat: "atkSpeed", maxLv: 3, values: [20.0, 20.0, 20.0], category: 3, condition: "천공참 한정", group: "도약" },
  { name: "운기행공", aliases: ["운기행공"], stat: "critRate", maxLv: 3, values: [3.0, 6.0, 10.0], category: 1, condition: "역천지체 루트", group: "깨달음" },
  { name: "날카로운 기공", aliases: ["날카로운기공", "날카로운 기공"], stat: "critDmg", maxLv: 5, values: [3.2, 6.4, 9.6, 12.8, 16.0], category: 2, condition: "금강선공 中", group: "깨달음" },
  { name: "반동 제어", aliases: ["반동제어", "반동 제어"], stat: "atkSpeed", maxLv: 5, values: [5.0, 5.0, 5.0, 5.0, 5.0], category: 2, condition: "금강선공 中", group: "깨달음" },
  { name: "절정I 이속", aliases: ["절정I", "절정 1"], stat: "moveSpeed", maxLv: 3, values: [6.0, 9.0, 15.0], category: 2, condition: "난무 스탠스 전환", group: "깨달음" },
  { name: "절정I 공속", aliases: ["절정I", "절정 1"], stat: "atkSpeed", maxLv: 3, values: [6.0, 9.0, 15.0], category: 2, condition: "집중 스탠스 전환", group: "깨달음", dynamic: true, note: "절정I 이속과 이름 동일, 어느 스탠스로 전환했는지에 따라 둘 중 하나만 적용 - 판정 필요" },
  { name: "절정II 치피", aliases: ["절정II", "절정 2"], stat: "critDmg", maxLv: 3, values: [23.0, 46.0, 70.0], category: 2, condition: "난무 스탠스 전환", group: "깨달음" },
  { name: "체술 강화", aliases: ["체술강화", "체술 강화"], stat: "critRate", maxLv: 5, values: [1.2, 2.4, 3.6, 4.8, 6.0], category: 1, condition: "상시", group: "깨달음" },
  { name: "치명적인 오의", aliases: ["치명적인오의", "치명적인 오의"], stat: "critDmg", maxLv: 5, values: [4.0, 8.0, 12.0, 16.0, 20.0], category: 2, condition: "오의스킬", group: "깨달음" },
  { name: "난무 강화", aliases: ["난무강화", "난무 강화"], stat: "atkSpeed", maxLv: 3, values: [10.0, 10.0, 10.0], category: 2, condition: "오의스킬", group: "깨달음", dynamic: true, classOnly: ["스트라이커"] },
  { name: "권왕파천무", aliases: ["권왕파천무"], stat: "critRate", maxLv: 3, values: [15.0, 15.0, 15.0], category: 3, condition: "낙화 한정", group: "깨달음" },
  { name: "권왕십이식 풍랑", aliases: ["권왕십이식 : 풍랑"], stat: "critRate", maxLv: 3, values: [15.0, 15.0, 15.0], category: 3, condition: "풍랑 한정", group: "깨달음", skill: "권왕십이식" },
  { name: "충격폭발", aliases: ["충격폭발", "충격 폭발"], stat: "critRate", maxLv: 3, values: [20.0, 20.0, 20.0], category: 3, condition: "성운멸쇄권 한정", group: "도약", skill: "성운멸쇄권" },
  { name: "수라의 길", aliases: ["수라의길", "수라의 길"], stat: "moveSpeed", maxLv: 3, values: [15.0, 15.0, 15.0], category: 2, condition: "투기 상태", group: "깨달음" },
  { name: "무아지경 공속", aliases: ["무아지경"], stat: "atkSpeed", maxLv: 3, values: [15.0, 15.0, 15.0], category: 2, condition: "수라결 상태", group: "깨달음" },
  { name: "무아지경 이속", aliases: ["무아지경"], stat: "moveSpeed", maxLv: 3, values: [15.0, 15.0, 15.0], category: 2, condition: "수라결 상태", group: "깨달음" },
  { name: "섬광베기", aliases: ["섬광베기", "섬광 베기"], stat: "atkSpeed", maxLv: 3, values: [10.0, 10.0, 10.0], category: 3, condition: "브레이킹문 中", group: "도약" },
  { name: "검객의길", aliases: ["검객의길", "검객의 길"], stat: "critDmg", maxLv: 3, values: [20.0, 40.0, 60.0], category: 3, condition: "브레이킹문 후 버스트", group: "도약" },
  { name: "잔재된 기운 공속", aliases: ["잔재된기운", "잔재된 기운"], stat: "atkSpeed", maxLv: 3, values: [6.0, 9.0, 12.0], category: 2, condition: "버스트 사용 시 30초", group: "깨달음" },
  { name: "잔재된 기운 이속", aliases: ["잔재된기운", "잔재된 기운"], stat: "moveSpeed", maxLv: 3, values: [6.0, 9.0, 12.0], category: 2, condition: "버스트 사용 시 30초", group: "깨달음" },
  { name: "잠식 제어", aliases: ["잠식제어", "잠식 제어"], stat: "critRate", maxLv: 3, values: [3.0, 6.0, 10.0], category: 1, condition: "완벽한억제 루트", group: "깨달음" },
{ name: "혼돈 강화", aliases: ["혼돈강화", "혼돈 강화"], stat: "critRate", maxLv: 3, values: [10.0, 20.0, 30.0], category: 2, condition: "악마화 中", group: "깨달음", classOnly: ["데모닉"] },
  { name: "유령 무희", aliases: ["유령무희", "유령 무희"], stat: "critRate", maxLv: 3, values: [3.0, 6.0, 10.0], category: 2, condition: "페르소나 전환 시", group: "깨달음" },
  { name: "달의 소리", aliases: ["달의소리", "달의 소리"], stat: "atkSpeed", maxLv: 3, values: [10.0, 10.0, 10.0], category: 1, condition: "페르소나 상태 (상시 유지로 간주, 아덴(페르소나) 라벨로 표시)", group: "깨달음" },
  { name: "곡예사", aliases: ["곡예사"], stat: "critDmg", maxLv: 5, values: [3.0, 6.0, 9.0, 12.0, 15.0], category: 3, condition: "페르소나 급습", group: "깨달음" },
  { name: "암살자의 손놀림", aliases: ["암살자의손놀림", "암살자의 손놀림"], stat: "atkSpeed", maxLv: 5, values: [1.0, 1.0, 1.0, 1.0, 1.0], category: 2, condition: "적중 시 6초, 최대 5중첩", group: "깨달음", dynamic: true, maxStack: 5, note: "적중 시마다 1중첩(레벨무관 동일값), 최대 5중첩=5.0%" },
  { name: "비열한 칼날", aliases: ["비열한칼날", "비열한 칼날"], stat: "critRate", maxLv: 3, values: [20.0, 20.0, 20.0], category: 3, condition: "쉐도우나이프", group: "도약", skill: "쉐도우 나이프" },
  { name: "그림자 맹수 치적", aliases: ["그림자맹수", "그림자 맹수"], stat: "critRate", maxLv: 3, values: [10.0, 20.0, 30.0], category: 3, condition: "피니쉬스텝", group: "도약", skill: "피니쉬 스텝" },
  { name: "그림자 맹수 치피", aliases: ["그림자맹수", "그림자 맹수"], stat: "critDmg", maxLv: 3, values: [5.0, 10.0, 15.0], category: 3, condition: "페르소나 적중", group: "도약", skill: "피니쉬 스텝" },
  { name: "피냄새 (혼돈)", aliases: ["피냄새", "피 냄새"], stat: "critRate", maxLv: 3, values: [18.0, 20.0, 23.0], category: 2, condition: "혼돈게이지 풀 시", group: "깨달음" },
  { name: "암살자의 발자취", aliases: ["암살자의발자취", "암살자의 발자취"], stat: "critRate", maxLv: 3, values: [10.0, 15.0, 20.0], category: 3, condition: "피니쉬스텝 백어택", group: "도약", skill: "피니쉬 스텝" },
  { name: "영혼친화력", aliases: ["영혼친화력", "영혼 친화력"], stat: "critRate", maxLv: 3, values: [3.0, 8.0, 14.0], category: 1, condition: "상시", group: "깨달음" },
  { name: "어둠의 장송곡", aliases: ["어둠의장송곡", "어둠의 장송곡"], stat: "critDmg", maxLv: 3, values: [15.0, 30.0, 45.0], category: 3, condition: "사신화+데스피날레", group: "도약", skill: "데스 피날레" },
  { name: "영혼 갈구", aliases: ["영혼갈구", "영혼 갈구"], stat: "critDmg", maxLv: 3, values: [7.0, 14.0, 21.0], category: 3, condition: "영혼강탈+프랜지사이드", group: "도약" },
  { name: "정밀사격 훈련 치적", aliases: ["정밀사격훈련", "정밀 사격 훈련"], stat: "critRate", maxLv: 3, values: [8.0, 16.0, 24.0], category: 1, condition: "상시", group: "깨달음" },
  { name: "정밀사격 훈련 치피", aliases: ["정밀사격훈련", "정밀 사격 훈련"], stat: "critDmg", maxLv: 3, values: [4.0, 9.0, 14.0], category: 1, condition: "상시", group: "깨달음" },
  { name: "퀵 드로우", aliases: ["퀵드로우", "퀵 드로우"], stat: "critRate", maxLv: 5, values: [1.0, 2.0, 3.0, 4.0, 5.0], category: 2, condition: "핸드건 사용 시 9초", group: "깨달음" },
  { name: "핸드거너 맹공 공속", aliases: ["핸드 거너", "맹공"], stat: "atkSpeed", maxLv: 3, values: [8.0, 8.0, 8.0], category: 2, condition: "이동기 후 6초", group: "깨달음" },
  { name: "핸드거너 맹공 이속", aliases: ["핸드 거너", "맹공"], stat: "moveSpeed", maxLv: 3, values: [8.0, 8.0, 8.0], category: 2, condition: "이동기 후 6초", group: "깨달음" },
  { name: "오버히트", aliases: ["오버히트"], stat: "critDmg", maxLv: 5, values: [0.0, 3.0, 6.0, 9.0, 12.0], category: 1, condition: "포화공격 루트", group: "깨달음" },
  { name: "신속 포격", aliases: ["신속포격", "신속 포격"], stat: "critDmg", maxLv: 5, values: [4.0, 8.0, 12.0, 16.0, 20.0], category: 3, condition: "포격스킬 한정", group: "깨달음" },
  { name: "포격 출력 강화", aliases: ["포격출력강화", "포격 출력 강화"], stat: "critRate", maxLv: 3, values: [20.0, 30.0, 40.0], category: 3, condition: "포격스킬 한정", group: "깨달음" },
  { name: "아르데타인의 기술", aliases: ["아르데타인의기술", "아르데타인의 기술"], stat: "moveSpeed", maxLv: 3, values: [10.0, 10.0, 10.0], category: 2, condition: "드론 부착 中", group: "깨달음" },
  { name: "전술 재장전 공속", aliases: ["전술재장전", "전술 재장전"], stat: "atkSpeed", maxLv: 5, values: [1.0, 1.0, 1.0, 1.0, 1.0], category: 2, condition: "최대 8중첩(Max 8%)", group: "깨달음", dynamic: true, maxStack: 8, note: "중첩당 1.0%, 최대 8중첩" },
  { name: "전술 재장전 이속", aliases: ["전술재장전", "전술 재장전"], stat: "moveSpeed", maxLv: 5, values: [1.0, 1.0, 1.0, 1.0, 1.0], category: 2, condition: "최대 8중첩(Max 8%)", group: "깨달음", dynamic: true, maxStack: 8, note: "중첩당 1.0%, 최대 8중첩" },
  { name: "코어 인챈트", aliases: ["코어인챈트", "코어 인챈트"], stat: "critRate", maxLv: 3, values: [3.0, 6.0, 9.0], category: 1, condition: "아르데타인 루트", group: "깨달음" },
  { name: "피스메이커 핸드건 공속", aliases: ["피스메이커 - 핸드건"], stat: "atkSpeed", maxLv: 3, values: [5.0, 10.0, 16.0], category: 2, condition: "핸드건 전환 9초", group: "깨달음" },
  { name: "피스메이커 샷건 치적", aliases: ["피스메이커 - 샷건"], stat: "critRate", maxLv: 3, values: [3.0, 6.0, 10.0], category: 2, condition: "샷건 전환 9초", group: "깨달음" },
  { name: "급소 전문가", aliases: ["급소전문가", "급소 전문가"], stat: "critDmg", maxLv: 5, values: [4.5, 7.5, 10.5, 13.5, 17.0], category: 3, condition: "핸드건/라이플", group: "깨달음" },
  { name: "라이플 숙련", aliases: ["라이플숙련", "라이플 숙련"], stat: "critRate", maxLv: 3, values: [25.0, 35.0, 45.0], category: 1, condition: "사냥의시간 루트", group: "깨달음" },
  { name: "평화주의자 치적", aliases: ["평화주의자"], stat: "critRate", maxLv: 3, values: [10.0, 12.0, 15.0], category: 2, condition: "스탠스 전환 12초", group: "깨달음" },
  { name: "평화주의자 공속", aliases: ["평화주의자"], stat: "atkSpeed", maxLv: 3, values: [10.0, 13.0, 16.0], category: 2, condition: "스탠스 전환 12초", group: "깨달음" },
  { name: "페일 노트", aliases: ["페일 노트"], stat: "critDmg", maxLv: 5, values: [4.0, 8.0, 12.0, 16.0, 20.0], category: 2, condition: "최후의습격 9초", group: "깨달음" },
  { name: "폭풍의 사냥꾼", aliases: ["폭풍의사냥꾼", "폭풍의 사냥꾼"], stat: "moveSpeed", maxLv: 3, values: [12.0, 12.0, 12.0], category: 2, condition: "최후의습격 5초", group: "깨달음" },
  { name: "동료", aliases: ["동료"], stat: "critRate", maxLv: 3, values: [13.0, 26.0, 40.0], category: 3, condition: "스파이럴애로우", group: "도약", skill: "스파이럴 애로우" },
  { name: "추가 동작", aliases: ["추가동작", "추가 동작"], stat: "atkSpeed", maxLv: 3, values: [10.0, 10.0, 10.0], category: 2, condition: "락온 체인 8초", group: "도약" },
  { name: "두 번째 동료 이속", aliases: ["두번째동료", "두번째 동료"], stat: "moveSpeed", maxLv: 3, values: [8.0, 8.0, 8.0], category: 1, condition: "실버호크 소환 中 (상시 유지로 간주, 실버호크 라벨로 표시)", group: "깨달음" },
  { name: "두 번째 동료 치적", aliases: ["두번째동료", "두번째 동료"], stat: "critRate", maxLv: 3, values: [13.0, 26.0, 40.0], category: 3, condition: "실버호크 스킬 한정", group: "깨달음", skill: "실버호크 스킬" },
  { name: "해의 축복", aliases: ["해의축복", "해의 축복"], stat: "moveSpeed", maxLv: 3, values: [3.0, 6.0, 10.0], category: 2, condition: "저무는달 10초, 파티 포함", group: "깨달음" },
  { name: "승천 이속", aliases: ["승천"], stat: "moveSpeed", maxLv: 3, values: [4.0, 8.0, 12.0], category: 2, condition: "미르새김 12초, 파티 포함", group: "도약" },
  { name: "승천 공속", aliases: ["승천"], stat: "atkSpeed", maxLv: 3, values: [2.0, 4.0, 6.0], category: 2, condition: "미르새김 12초, 파티 포함", group: "도약" },
  { name: "회귀", aliases: ["회귀"], stat: "critRate", maxLv: 1, values: [25.0], category: 1, condition: "진입 시 즉시", group: "깨달음" },
   { name: "기민함_적중률", aliases: ["기민함"], stat: "critRate", maxLv: 3, values: [10.0, 20.0, 30.0], category: 2, condition: "이속 증가분 참조(이속증가×10~30%)", group: "깨달음", dynamic: true, classOnly: ["기상술사"] },
  { name: "기민함_치피", aliases: ["기민함"], stat: "critDmg", maxLv: 3, values: [40.0, 80.0, 120.0], category: 2, condition: "공속 증가분 참조(공속증가×40~120%)", group: "깨달음", dynamic: true, classOnly: ["기상술사"] },
  { name: "완벽한 가르기", aliases: ["완벽한가르기", "완벽한 가르기"], stat: "critDmg", maxLv: 3, values: [40.0, 80.0, 120.0], category: 3, condition: "우레바람 퍼펙트존", group: "도약", skill: "우레바람" },
  { name: "햇살의 포옹", aliases: ["햇살의포옹", "햇살의 포옹"], stat: "critDmg", maxLv: 3, values: [25.0, 50.0, 75.0], category: 3, condition: "여름햇살+여우비", group: "도약", skill: "여름 햇살" },
  { name: "질풍노도 공속", aliases: ["질풍노도", "질풍 노도"], stat: "atkSpeed", maxLv: 1, values: [12.0], category: 2, condition: "여우비 30초, 파티 포함", group: "깨달음" },
  { name: "질풍노도 이속", aliases: ["질풍노도", "질풍 노도"], stat: "moveSpeed", maxLv: 1, values: [12.0], category: 2, condition: "여우비 30초, 파티 포함", group: "깨달음" },
  { name: "야성 공속", aliases: ["야성"], stat: "atkSpeed", maxLv: 3, values: [3.0, 6.0, 10.0], category: 2, condition: "둔갑 2중첩 시", group: "깨달음", dynamic: true, note: "둔갑 중첩 수 판정 필요" },
  { name: "깨어난 잠재력 치적", aliases: ["깨어난잠재력", "깨어난 잠재력"], stat: "critRate", maxLv: 3, values: [10.0, 20.0, 30.0], category: 3, condition: "둔갑스킬 한정", group: "깨달음" },
  { name: "깨어난 잠재력 공속", aliases: ["깨어난잠재력", "깨어난 잠재력"], stat: "atkSpeed", maxLv: 3, values: [6.0, 12.0, 20.0], category: 3, condition: "여우둔갑 한정", group: "깨달음" },
  { name: "결속 강화", aliases: ["결속강화", "결속 강화"], stat: "critDmg", maxLv: 3, values: [70.0, 135.0, 205.0], category: 3, condition: "두둥실여우곰", group: "도약", skill: "두둥실 여우곰" },
  { name: "환수 각성 공속", aliases: ["환수각성", "환수 각성"], stat: "atkSpeed", maxLv: 1, values: [20.0], category: 2, condition: "환수각성 상태", group: "깨달음" },
  { name: "환수 각성 이속", aliases: ["환수각성", "환수 각성"], stat: "moveSpeed", maxLv: 1, values: [20.0], category: 2, condition: "환수각성 상태", group: "깨달음" },
  { name: "환수의 정기", aliases: ["환수의정기", "환수의 정기"], stat: "critDmg", maxLv: 3, values: [20.0, 40.0, 60.0], category: 2, condition: "환수각성+환수스킬", group: "깨달음" },
  { name: "가속 강화", aliases: ["가속강화", "가속 강화"], stat: "critRate", maxLv: 3, values: [10.0, 20.0, 30.0], category: 1, condition: "시간관리자 루트", group: "깨달음" },
  { name: "분침 강화", aliases: ["분침강화", "분침 강화"], stat: "critRate", maxLv: 3, values: [10.0, 15.0, 20.0], category: 1, condition: "공간검사 루트", group: "깨달음" },
  { name: "고속 진입", aliases: ["고속진입", "고속 진입"], stat: "atkSpeed", maxLv: 5, values: [10.0, 10.0, 10.0, 10.0, 10.0], category: 2, condition: "간섭 20초", group: "깨달음" },
  { name: "업화의 계승자 공속", aliases: ["업화의계승자", "업화의 계승자"], stat: "atkSpeed", maxLv: 3, values: [11.0, 13.0, 15.0], category: 1, condition: "화신 상태", group: "깨달음" },
  { name: "업화의 계승자 이속", aliases: ["업화의계승자", "업화의 계승자"], stat: "moveSpeed", maxLv: 3, values: [11.0, 13.0, 15.0], category: 1, condition: "화신 상태", group: "깨달음" },
  { name: "깨어나는 힘", aliases: ["깨어나는힘", "깨어나는 힘"], stat: "critRate", maxLv: 3, values: [6.0, 13.0, 20.0], category: 1, condition: "업화의계승자 루트", group: "깨달음" },
    { name: "잔불 공속", aliases: ["잔불"], stat: "atkSpeed", maxLv: 5, values: [5.0, 5.0, 5.0, 5.0, 5.0], category: 2, condition: "화신 해제 16초 (체크박스로 수동 적용)", group: "깨달음", dynamic: true },
  { name: "잔불 이속", aliases: ["잔불"], stat: "moveSpeed", maxLv: 5, values: [5.0, 5.0, 5.0, 5.0, 5.0], category: 2, condition: "화신 해제 16초 (체크박스로 수동 적용)", group: "깨달음", dynamic: true },
  { name: "할버드의 대가", aliases: ["할버드의대가", "할버드의 대가"], stat: "critDmg", maxLv: 5, values: [4.0, 7.0, 8.0, 11.0, 12.0], category: 2, condition: "일반스킬", group: "깨달음" },
  { name: "완전 연소", aliases: ["완전연소", "완전 연소"], stat: "critRate", maxLv: 3, values: [5.0, 10.0, 15.0], category: 1, condition: "드레드로어 루트", group: "깨달음" },
  { name: "한계 초월", aliases: ["한계초월", "한계 초월"], stat: "atkSpeed", maxLv: 3, values: [15.0, 15.0, 15.0], category: 2, condition: "가디언피어 5초", group: "깨달음" }
];





const IDENTITY_BUFFS = {
  "슬레이어": {
    "포식자": { buff_name:"폭주", type:"toggle", stats:{ crit_rate:30.0, attack_speed:20.0, move_speed:20.0 } },
    "처단자": { buff_name:"폭주", type:"toggle", stats:{ crit_rate:30.0, attack_speed:20.0, move_speed:20.0 } }
  },
  
  "버서커": {
    "광전사의 비기": { 
      buff_name: "폭주", 
      type: "toggle", 
      stats: { attack_speed: 20.0, move_speed: 20.0, crit_rate: 30.0 }, 
      scaleStat: "특화", 
      scaleCoef: 0.037193,
      ampKeyword: "폭주"  // 🎯 키워드 추가 완료!
    }
  },







  "소울이터": {
    "만월의 집행자": { buff_name:"사신화", type:"toggle", stats:{ crit_rate:20.0,attack_speed:10.0, move_speed:20.0 } }
   
  },
  "블레이드": {
    "버스트": { buff_name:"아츠 활성(3버)", type:"toggle", stats:{ attack_speed:20.0, move_speed:10.0, attack_power_percent:30.0 } }
     },
  "리퍼": {
    "갈증": { buff_name:"혼돈", type:"toggle", stats:{ attack_speed:10.0, move_speed:10.0 } },
    "달의 소리": { buff_name:"페르소나", type:"toggle", stats:{ move_speed:10.0 } }
  },
  "데모닉": {
    "멈출 수 없는 충동": { buff_name:"악마화", type:"toggle", stats:{  move_speed:20.0 } }
  },
  "창술사": {
    "절정": { buff_name:"집중 스탠스", type:"toggle", stats:{ attack_speed:15.0 } }
  },




 "기공사": {
    "역천지체": { 
      buff_name: "금강선공 3단", 
      type: "toggle", 
      stats: { attack_speed: 15.0 }, 
      scaleStat: "특화", 
      scaleCoef: 0.0213,
      ampKeyword: "금강선공의 효과" // 특화 툴팁에서 증폭률 파싱용 키워드
    },
    "세맥타통": { 
      buff_name: "금강선공 3단", 
      type: "toggle", 
      stats: { attack_speed: 15.0 }, 
      scaleStat: "특화", 
      scaleCoef: 0.0213,
      ampKeyword: "금강선공의 효과"
    }
  },
 
  "데빌헌터": {
    "강화 무기": { buff_name:"스탠스 치적(상시)", type:"permanent", stats:{ crit_rate:22.0 } }
  },
  "스카우터": {
    "진화의 유산": { buff_name:"하이퍼 씽크", type:"toggle", stats:{ attack_speed:15.0, move_speed:15.0 } }
  }
};

const ORDER_CORE_BY_ENG = {
  "분노의 망치":{해:["특이점","차원 붕괴","어스 웨이브"],달:["완벽한 제어","중력 강화","중력 질주"],별:["끊어진 사슬","몰아치는 해방","무모한 한방"]},
  "중력 수련":{해:["중력 역전","중력 파괴","그라비티 코어"],달:["사건의 지평선","중력 순환","몰아치는 중력"],별:["붕괴","바위 칼날","대지 부수기"]},
  "고독한 기사":{해:["전술 제어","창술","종전"],달:["방어 전술","스트라이크 포인트","랜스 차지"],별:["방어 포격","확정된 포격","크로스 랜스"]},
  "전투 태세":{해:["방패 연계","연속 돌진","천둥"],달:["방패술","함성 돌진","번개폭풍"],별:["방패 타격","전차 돌진","광역 낙뢰"]},
  "광전사의 비기":{해:["콤비네이션","오버 파워","파워 코어"],달:["피의 순환","오버 버스트","브레이크 대시"],별:["분쇄 폭풍","오버플로우","브레이크 아웃"]},
  "광기":{해:["다크 파워","파워드라이브","홀드 엣지"],달:["어둠의 격류","래피드 슬래쉬","사이클론 슬래쉬"],별:["광란","연참","지옥 뒤집기"]},
  "심판자":{해:["신의 권능","성스러운 일격","심판 예고"],달:["징벌의 시간","천상의 검","심판의 시간"],별:["참하는 검","신성한 검","꿰뚫는 검"]},
  "처단자":{해:["단두대","분노압축","격노폭발"],달:["단죄의 칼날","힘의 응축","교차된 힘"],별:["처형","분쇄","신중한 강타"]},
  "포식자":{해:["차오르는 분노","예측불가","회오리"],달:["코어 임팩트","분노격화","소용돌이"],별:["즉결 처형","마무리 일격","파괴의 바람"]},
  "빛의 기사":{해:["종언","기원","속삭이는 검"],달:["종언의 기사","빛의 안식","눈부신 정의"],별:["진정한 종언","성휘의 집행","강화된 정의"]},
  "초심":{해:["연격강타","극의귀원","삼문 개방"],달:["초강풍각","귀원화신","초순환"],별:["극선풍각","파천격","용류 강화"]},
  "오의 강화":{해:["패황불패","화룡순환","오기강체"],달:["패황지도","화룡진천","심안"],별:["창풍극의","폭룡천상","패황권"]},
  "충격 단련":{해:["충격 폭주","충격파","충격 억제"],달:["충격 강화","대지 연타","기력 절약"],별:["오브 폭발","지면 분쇄","역발산"]},
  "체술: 극의":{해:["대지 붕괴","반복 도약","투지 억제"],달:["투지 강화","치명적인 도약","상시 강화"],별:["대지 파괴","흑룡의 도약","연격"]},
  "역천지체":{해:["파천섬결","광류연파","백연쇄공"],달:["연환섬멸","천류섬열풍","회기탄환"],별:["광멸옥","파공나선","축기탄공"]},
  "무상신공":{해:["무영무상","무상기연","축기회류"],달:["진무상격","신장대멸겁","연태극"],별:["극멸진공","불영세","음양결"]},
  "절정":{해:["적룡의 기운","적룡연격","연가 창식"],달:["일점 집중","집중 강화","청룡기"],별:["진화의 끝","한 점 돌파","맹룡 회도"]},
  "절제":{해:["질풍연격","연가일섬","맹룡오격"],달:["맹룡의 기운","비기승화","연환 타격"],별:["이중 비기","환영","연격 난무"]},
  "일격필살":{해:["호령","광폭","뇌호"],달:["천뢰포효","호뢰진","벽뢰호각"],별:["뇌호극권","쌍극광폭진","섬호뇌격"]},
  "오의난무":{해:["광파섬","산군","외공"],달:["풍뢰보","뇌호파천","파한오의"],별:["신왕화신","초극뇌연격","파극권"]},
  "권왕파천무":{해:["진 권왕","파천경","충전된 충격"],달:["권왕태세","진 파천섬광","충격 충전"],별:["권왕십이식","파천 돌파","포스 건틀릿"]},
  "수라의 길":{해:["파천기","수라안","그림자 주먹"],달:["개 파천섬광","수라결","종횡무진"],별:["전천극","수라","징벌"]},
  "전술 탄환":{해:["블러드 하운드","데드 샷","샷건 오버로드"],달:["산탄강화","무결점 조준","광란의 해결사"],별:["탄환 폭발","아이언 사이트","지배자의 탄환"]},
  "핸드거너":{해:["섀도우 불릿","히든 팽","데드 토스"],달:["하늘의 지배자","긴박한 해결사","이터널 리볼버"],별:["불릿 샤워","실버 불릿","끝없는 나선"]},
  "포격 강화":{해:["폭격","슛 앤 스쿳","포화 전차"],달:["래피드 탱크","과열된 포탄","세이프 존"],별:["시 오브 파이어","타임 온 타겟","초토화"]},
  "화력 강화":{해:["탄약 수집가","데몬 파이어","점핑맨"],달:["질풍 포병","무한 연소","도약의 순간"],별:["아이언 샤워","웰던맨","오토 락온"]},
  "죽음의 습격":{해:["TA-09 피어싱 애로우","ATB-07 니들레인","TA-12 버스팅 애로우"],달:["HSU-98 버드 스트라이크","HSU-21 실버 레인","HSU-13 특제 고폭약"],별:["HSU-04 자동 제어 스코프","HSU-17 일렉트릭 노바","HSU-36 도트 사이트"]},
  "두 번째 동료":{해:["ATB-03 볼트 랩터","TA-64 리퍼 볼트","ATB-19 스톰리피터"],달:["HSU-99 버드 스톰","HSU-08 고강도 케이블","HSU-37 연사 보조기"],별:["HSU-06 레이저사이트","HSU-57 근력 보조 장갑","HSU-22 사지 안정기"]},
  "아르데타인의 기술":{해:["퀀텀 오퍼레이티브","에이전트 SMG","펄스 노바"],달:["생체 개조 기술","불릿 템페스트","에너지 아포칼립스"],별:["배터리 출력 강화","소각 집행","제로백 버스트"]},
  "진화의 유산":{해:["아스트라 슈트","퀘이사 캐넌 슈트","타이탄 슈트"],달:["퍼펙트 싱크","제로 펄스 에너지","어썰트 타이탄"],별:["초감각 동기화","아틸러리 스탠스","코어 리액터 증폭"]},
  "피스메이커":{해:["티거 미스트리스","연회의 잔향","트루 에임"],달:["제너럴리스트","체인지 암즈","방패 조준"],별:["올라운더","블로우 백","핀포인트"]},
  "사냥의 시간":{해:["미드나잇 로즈","무법지대","유단자"],달:["철갑파쇄탄","불릿 무빙","건법"],별:["정밀 타격","풀 매거진","힐 스트라이크"]},
  "진실된 용맹":{해:["불굴의 세레나데","템페스트 리프레인","쇼크 루프"],달:["기원의 세레나데","세컨드 임팩트","조화의 연주"],별:["음파 강화","사운드 블리츠","듀얼 쇼크"]},
  "넘치는 교감":{해:["정령 결속","강화 폭주","기초 훈련"],달:["결속 증폭","폭주 집중","강풍 진화"],별:["증폭 공명","명령 각성","전술 명령"]},
  "상급 소환사":{해:["힘의 계승","고대의 유산","힘의 순환"],달:["힘의 집중","오쉬의 지원","정령의 고리"],별:["힘의 균형","창세의 힘","정령 인도자"]},
  "황후의 은총":{해:["엣지 오브 페이트","인피니티 덱","루인 서브셋"],달:["엣지 콤보","체인 드로우","루인 풀셋"],별:["스트림 오브 엣지","페이탈 핸드","루인 마이너셋"]},
  "황제의 칙령":{해:["하이 템포","노말 인핸스","임팩트 메이트"],달:["황제의 심장","스택 홀드","다크 메이트"],별:["다크 콜렉션","셔플 댄스","스피드 메이트"]},
  "점화":{해:["마력의 촉매","불완전 연소","종말의 시작"],달:["점화의 문장","연소 가속","반복된 종말"],별:["원소의 잔향","삼중 파동","종말의 시"]},
  "환류":{해:["편향","순환","응축"],달:["직류","교류","와류"],별:["화뇌","무결","청뢰"]},
  "버스트":{해:["블레이드 버스트","살상연희","블레이드 러시"],달:["버스트 코어","쌍검난무","데스 블리츠"],별:["일격","쾌도난마","얼음과 불의 검"]},
  "잔재된 기운":{해:["아츠 마스터","집중의 일격","일섬"],달:["아츠 코어","리차지","블레이드 웨이브"],별:["기본기","잠깐의 기다림","죽음의 검기"]},
  "멈출 수 없는 충동":{해:["블러드 매서커","이터널 블러드","오미너스"],달:["블러디 데몬","고어 블리딩","제노사이드"],별:["피의 폭발","치명적인 할퀴기","혼돈의 악마"]},
  "완벽한 억제":{해:["서프레서","서징 스톰","매시브 컨슘"],달:["트리니티 코어","듀얼 코어","서브 스톰"],별:["페이탈 스트라이크","죽음의 부메랑","파괴 광선"]},
  "달의 소리":{해:["달의 향기","달의 낙하","두 개의 달"],달:["페르소나","사일런트","더블 코어"],별:["할루시네이션","암살자의 그림자","데스 루프"]},
  "갈증":{해:["갈증의 악몽","치명적인 발걸음","피의 갈증"],달:["치명적 악몽","라스트 스피어","출혈독"],별:["급습 악몽","치명적 연계","다가오는 죽음"]},
  "만월의 집행자":{해:["아더 디멘션","래피드 데스","망자의 발걸음"],달:["이계의 힘","영속자","소울 코어"],별:["이계의 지배자","수확의 밤","빙의"]},
  "그믐의 경계":{해:["다크 문","사신의 부름","살귀의 밤"],달:["크레센트","광월야","강탈자"],별:["그믐의 지배자","사신의 힘","잠식된 경계"]},
  "회귀":{해:["파죽지세","일필휘지","묵법화"],달:["조화의 완성","명필","정월 대보름"],별:["끝없는 파죽","재빠른 붓","쏟아지는 두루미"]},
  "질풍노도":{해:["비연참","기류 조절","바람의 칼날"],달:["우산의 춤","상승기류","쾌속"],별:["휘몰아치기","일점돌파","강풍일섬"]},
  "이슬비":{해:["싸라기눈","마른 하늘에 날벼락","해와 바람"],달:["비바람이 치던 바다","가랑비","뜨거운 햇볕"],별:["눈에 돌넣기","우르릉 쾅쾅쾅","나그네의 외투를 벗긴건"]},
  "야성":{해:["변신술사!","곰이 될 운명!","여우가 될 운명!"],달:["금술","센 곰","센 여우"],별:["돌격 곰 여우","필살 곰","별빛 여우"]},
  "환수 각성":{해:["무한 각성","곰 주먹","까마귀의 왕"],달:["환수 해방","빙글빙글","까마귀 내려온다"],별:["환영 곰","붕붕 펀치","까마귀 대난투"]},
  "업화의 계승자":{해:["피니셔","매니페스트","붉은 날개"],달:["노바 플레임","리버레이션","복수귀"],별:["라스트 스탠드","엑스큐셔너","추격 시작"]},
  "드레드 로어":{해:["차지 인핸스","브랜디쉬","에이펙스"],달:["위압","플러리쉬","도미넌트"],별:["그랜드 피날레","일당백","파멸"]},
  "시간 관리자":{해:["타임 키퍼","왜곡된 시간선","차원 소멸"],달:["컴바인 웨폰","타임 라인","미닛 템포"],별:["결합 강화","비틀림","컨버젼"]},
  "공간 검사":{해:["공간 검술","찌르기의 대가","차원 절단"],달:["검술 강화","포인트 어택","정밀 조작"],별:["분침 조정","찌르기 연계","다중 절단"]},
  "축복의 오라":{해:["천상의 대리인","진정한 정의","빛의 축복"],달:["천상의 결의","신성한 대의","성전"],별:["검의 기도","폭발의 기도","빛의 기도"]},
  "해방자":{해:["빛의 은총","성스러운 맹약","빛이 생명을 새긴다"],달:["빛의 서사","구원의 서약","여명이 세상을 깨우는 순간"],별:["수호의 선고","수호의 륜","성휘의 재"]},
  "절실한 구원":{해:["세라픽 엑센트","브레이브 엑센트","아리아 엑센트"],달:["세라픽 펄스","브레이브 펄스","아리아 펄스"],별:["풍요의 바람","사운드 플러드","벅샷 가속"]},
  "만개":{해:["햇살의 품","몽글몽글","해님이 지켜줘요"],달:["따뜻한 해","환영문짝","달이 내린 예언"],별:["붓 콩콩","차원의 문","먹물 뿌리기"]},
};

const CHAOS_CORE_NUM = {
  "현란한 공격":1,"안정적인 공격":2,"재빠른 공격":3,"신념의 강화":1,"흐르는 마나":2,"불굴의 강화":3,
  "불타는 일격":1,"흡수의 일격":2,"부수는 일격":3,"낙인의 흔적":1,"강철의 흔적":2,"치명적인 흔적":3,
  "공격":1,"무기":2,"구원":3,"생명":1,"속도":2,"방어":3,
};


const ARK_GRID_CORE_STATS = {"혼돈의 달 코어 : 부수는 일격":{"10":{"유물":{"critRate":0},"고대":{"critRate":0}},"14":{"유물":{"critRate":0.65},"고대":{"critRate":0.65}},"17":{"유물":{"critRate":1.95},"고대":{"critRate":3.25}},"18":{"유물":{"critRate":2.16},"고대":{"critRate":3.46}},"19":{"유물":{"critRate":2.37},"고대":{"critRate":3.67}},"20":{"유물":{"critRate":2.58},"고대":{"critRate":3.88}}},"질서의 해 코어 : 천둥":{"10":{"유물":{"critRate":0},"고대":{"critRate":0}},"14":{"유물":{"critRate":0},"고대":{"critRate":0}},"17":{"유물":{"critRate":4},"고대":{"critRate":6}},"18":{"유물":{"critRate":4},"고대":{"critRate":6}},"19":{"유물":{"critRate":4},"고대":{"critRate":6}},"20":{"유물":{"critRate":4},"고대":{"critRate":6}}},"질서의 해 코어 : 충격 폭주":{"10":{"유물":{"critRate":0},"고대":{"critRate":0}},"14":{"유물":{"critRate":0},"고대":{"critRate":0}},"17":{"유물":{"critRate":5},"고대":{"critRate":5}},"18":{"유물":{"critRate":5},"고대":{"critRate":5}},"19":{"유물":{"critRate":5},"고대":{"critRate":5}},"20":{"유물":{"critRate":5},"고대":{"critRate":5}}},"질서의 해 코어 : 탄약 수집가":{"10":{"유물":{"critRate":0,"atkSpeed":0},"고대":{"critRate":0,"atkSpeed":0}},"14":{"유물":{"critRate":5,"atkSpeed":0,"moveSpeed":0},"고대":{"critRate":5,"atkSpeed":0,"moveSpeed":0}},"17":{"유물":{"critRate":5,"atkSpeed":10,"moveSpeed":10},"고대":{"critRate":5,"atkSpeed":10,"moveSpeed":10}},"18":{"유물":{"critRate":5,"atkSpeed":10,"moveSpeed":10},"고대":{"critRate":5,"atkSpeed":10,"moveSpeed":10}},"19":{"유물":{"critRate":5,"atkSpeed":10,"moveSpeed":10},"고대":{"critRate":5,"atkSpeed":10,"moveSpeed":10}},"20":{"유물":{"critRate":5,"atkSpeed":10,"moveSpeed":10},"고대":{"critRate":5,"atkSpeed":10,"moveSpeed":10}}},"질서의 해 코어 : 아스트라 슈트":{"10":{"유물":{"critRate":0},"고대":{"critRate":0}},"14":{"유물":{"critRate":6},"고대":{"critRate":6}},"17":{"유물":{"critRate":6},"고대":{"critRate":6}},"18":{"유물":{"critRate":6},"고대":{"critRate":6}},"19":{"유물":{"critRate":6},"고대":{"critRate":6}},"20":{"유물":{"critRate":6},"고대":{"critRate":6}}},"질서의 해 코어 : 불완전 연소":{"10":{"유물":{"critRate":0},"고대":{"critRate":0}},"14":{"유물":{"critRate":10},"고대":{"critRate":10}},"17":{"유물":{"critRate":10},"고대":{"critRate":10}},"18":{"유물":{"critRate":10},"고대":{"critRate":10}},"19":{"유물":{"critRate":10},"고대":{"critRate":10}},"20":{"유물":{"critRate":10},"고대":{"critRate":10}}},"질서의 해 코어 : 타임 키퍼":{"10":{"유물":{"critRate":0},"고대":{"critRate":0}},"14":{"유물":{"critRate":6},"고대":{"critRate":6}},"17":{"유물":{"critRate":6},"고대":{"critRate":6}},"18":{"유물":{"critRate":6},"고대":{"critRate":6}},"19":{"유물":{"critRate":6},"고대":{"critRate":6}},"20":{"유물":{"critRate":6},"고대":{"critRate":6}}},"질서의 해 코어 : 공간 검술":{"10":{"유물":{"critRate":0,"atkSpeed":0},"고대":{"critRate":0,"atkSpeed":0}},"14":{"유물":{"critRate":6,"atkSpeed":0,"moveSpeed":15},"고대":{"critRate":6,"atkSpeed":0,"moveSpeed":15}},"17":{"유물":{"critRate":6,"atkSpeed":0,"moveSpeed":15},"고대":{"critRate":6,"atkSpeed":0,"moveSpeed":15}},"18":{"유물":{"critRate":6,"atkSpeed":0,"moveSpeed":15},"고대":{"critRate":6,"atkSpeed":0,"moveSpeed":15}},"19":{"유물":{"critRate":6,"atkSpeed":0,"moveSpeed":15},"고대":{"critRate":6,"atkSpeed":0,"moveSpeed":15}},"20":{"유물":{"critRate":6,"atkSpeed":0,"moveSpeed":15},"고대":{"critRate":6,"atkSpeed":0,"moveSpeed":15}}},"혼돈의 해 코어 : 재빠른 공격":{"10":{"유물":{"critDmg":0,"atkSpeed":1},"고대":{"critDmg":0,"atkSpeed":1}},"14":{"유물":{"critDmg":1.4,"atkSpeed":1},"고대":{"critDmg":1.4,"atkSpeed":1}},"17":{"유물":{"critDmg":4.2,"atkSpeed":3},"고대":{"critDmg":7,"atkSpeed":4}},"18":{"유물":{"critDmg":4.65,"atkSpeed":3},"고대":{"critDmg":7.45,"atkSpeed":4}},"19":{"유물":{"critDmg":5.1,"atkSpeed":3},"고대":{"critDmg":7.9,"atkSpeed":4}},"20":{"유물":{"critDmg":5.55,"atkSpeed":3},"고대":{"critDmg":8.35,"atkSpeed":4}}},"혼돈의 달 코어 : 치명적인 흔적":{"10":{"유물":{"critDmg":0.3},"고대":{"critDmg":0.3}},"14":{"유물":{"critDmg":0.3},"고대":{"critDmg":0.3}},"17":{"유물":{"critDmg":0.9},"고대":{"critDmg":1.5}},"18":{"유물":{"critDmg":0.9},"고대":{"critDmg":1.5}},"19":{"유물":{"critDmg":0.9},"고대":{"critDmg":1.5}},"20":{"유물":{"critDmg":0.9},"고대":{"critDmg":1.5}}},"질서의 해 코어 : 차오르는 분노":{"10":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"14":{"유물":{"critDmg":18},"고대":{"critDmg":18}},"17":{"유물":{"critDmg":18},"고대":{"critDmg":18}},"18":{"유물":{"critDmg":18},"고대":{"critDmg":18}},"19":{"유물":{"critDmg":18},"고대":{"critDmg":18}},"20":{"유물":{"critDmg":18},"고대":{"critDmg":18}}},"질서의 달 코어 : 초강풍각":{"10":{"유물":{"critDmg":3},"고대":{"critDmg":3}},"14":{"유물":{"critDmg":3},"고대":{"critDmg":3}},"17":{"유물":{"critDmg":7},"고대":{"critDmg":11}},"18":{"유물":{"critDmg":7},"고대":{"critDmg":11}},"19":{"유물":{"critDmg":7},"고대":{"critDmg":11}},"20":{"유물":{"critDmg":7},"고대":{"critDmg":11}}},"질서의 달 코어 : 초순환":{"10":{"유물":{"critDmg":3},"고대":{"critDmg":3}},"14":{"유물":{"critDmg":3},"고대":{"critDmg":3}},"17":{"유물":{"critDmg":3},"고대":{"critDmg":3}},"18":{"유물":{"critDmg":3},"고대":{"critDmg":3}},"19":{"유물":{"critDmg":3},"고대":{"critDmg":3}},"20":{"유물":{"critDmg":3},"고대":{"critDmg":3}}},"질서의 별 코어 : 파천격":{"10":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"14":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"17":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"18":{"유물":{"critDmg":0.5},"고대":{"critDmg":0.5}},"19":{"유물":{"critDmg":1},"고대":{"critDmg":1}},"20":{"유물":{"critDmg":1.5},"고대":{"critDmg":1.5}}},"질서의 달 코어 : 패황지도":{"10":{"유물":{"critDmg":4},"고대":{"critDmg":4}},"14":{"유물":{"critDmg":4},"고대":{"critDmg":4}},"17":{"유물":{"critDmg":4},"고대":{"critDmg":4}},"18":{"유물":{"critDmg":4},"고대":{"critDmg":4}},"19":{"유물":{"critDmg":4},"고대":{"critDmg":4}},"20":{"유물":{"critDmg":4},"고대":{"critDmg":4}}},"질서의 달 코어 : 심안":{"10":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"14":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"17":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"18":{"유물":{"critDmg":0.5},"고대":{"critDmg":0.5}},"19":{"유물":{"critDmg":1},"고대":{"critDmg":1}},"20":{"유물":{"critDmg":1.5},"고대":{"critDmg":1.5}}},"질서의 해 코어 : 충격파":{"10":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"14":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"17":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"18":{"유물":{"critDmg":0.4},"고대":{"critDmg":0.4}},"19":{"유물":{"critDmg":0.8},"고대":{"critDmg":0.8}},"20":{"유물":{"critDmg":1.2},"고대":{"critDmg":1.2}}},"질서의 달 코어 : 충격 강화":{"10":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"14":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"17":{"유물":{"critDmg":14},"고대":{"critDmg":18}},"18":{"유물":{"critDmg":14},"고대":{"critDmg":18}},"19":{"유물":{"critDmg":14},"고대":{"critDmg":18}},"20":{"유물":{"critDmg":14},"고대":{"critDmg":18}}},"질서의 달 코어 : 기력 절약":{"10":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"14":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"17":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"18":{"유물":{"critDmg":0.4},"고대":{"critDmg":0.4}},"19":{"유물":{"critDmg":0.8},"고대":{"critDmg":0.8}},"20":{"유물":{"critDmg":1.2},"고대":{"critDmg":1.2}}},"질서의 별 코어 : 오브 폭발":{"10":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"14":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"17":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"18":{"유물":{"critDmg":0.4},"고대":{"critDmg":0.4}},"19":{"유물":{"critDmg":0.8},"고대":{"critDmg":0.8}},"20":{"유물":{"critDmg":1.2},"고대":{"critDmg":1.2}}},"질서의 해 코어 : 대지 붕괴":{"10":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"14":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"17":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"18":{"유물":{"critDmg":0.4},"고대":{"critDmg":0.4}},"19":{"유물":{"critDmg":0.8},"고대":{"critDmg":0.8}},"20":{"유물":{"critDmg":1.2},"고대":{"critDmg":1.2}}},"질서의 해 코어 : 반복 도약":{"10":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"14":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"17":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"18":{"유물":{"critDmg":0.4},"고대":{"critDmg":0.4}},"19":{"유물":{"critDmg":0.8},"고대":{"critDmg":0.8}},"20":{"유물":{"critDmg":1.2},"고대":{"critDmg":1.2}}},"질서의 별 코어 : 연격":{"10":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"14":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"17":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"18":{"유물":{"critDmg":0.4},"고대":{"critDmg":0.4}},"19":{"유물":{"critDmg":0.8},"고대":{"critDmg":0.8}},"20":{"유물":{"critDmg":1.2},"고대":{"critDmg":1.2}}},"질서의 해 코어 : 호령":{"10":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"14":{"유물":{"critDmg":13},"고대":{"critDmg":13}},"17":{"유물":{"critDmg":13},"고대":{"critDmg":13}},"18":{"유물":{"critDmg":13.45},"고대":{"critDmg":13.45}},"19":{"유물":{"critDmg":13.9},"고대":{"critDmg":13.9}},"20":{"유물":{"critDmg":14.35},"고대":{"critDmg":14.35}}},"질서의 별 코어 : 쌍극광폭진":{"10":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"14":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"17":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"18":{"유물":{"critDmg":0.45},"고대":{"critDmg":0.45}},"19":{"유물":{"critDmg":0.9},"고대":{"critDmg":0.9}},"20":{"유물":{"critDmg":1.35},"고대":{"critDmg":1.35}}},"질서의 해 코어 : 외공":{"10":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"14":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"17":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"18":{"유물":{"critDmg":0.45},"고대":{"critDmg":0.45}},"19":{"유물":{"critDmg":0.9},"고대":{"critDmg":0.9}},"20":{"유물":{"critDmg":1.35},"고대":{"critDmg":1.35}}},"질서의 달 코어 : 풍뢰보":{"10":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"14":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"17":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"18":{"유물":{"critDmg":0.55},"고대":{"critDmg":0.55}},"19":{"유물":{"critDmg":1.1},"고대":{"critDmg":1.1}},"20":{"유물":{"critDmg":1.65},"고대":{"critDmg":1.65}}},"질서의 별 코어 : 초극뇌연격":{"10":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"14":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"17":{"유물":{"critDmg":0},"고대":{"critDmg":0}},"18":{"유물":{"critDmg":0.52},"고대":{"critDmg":0.52}},"19":{"유물":{"critDmg":1.04},"고대":{"critDmg":1.04}},"20":{"유물":{"critDmg":1.56},"고대":{"critDmg":1.56}}},"질서의 해 코어 : 일필휘지":{"10":{"유물":{"critDmg":0,"atkSpeed":0},"고대":{"critDmg":0,"atkSpeed":0}},"14":{"유물":{"critDmg":0,"atkSpeed":0,"moveSpeed":0},"고대":{"critDmg":0,"atkSpeed":0,"moveSpeed":0}},"17":{"유물":{"critDmg":10,"atkSpeed":10,"moveSpeed":0},"고대":{"critDmg":15,"atkSpeed":10,"moveSpeed":0}},"18":{"유물":{"critDmg":10,"atkSpeed":10,"moveSpeed":0},"고대":{"critDmg":15,"atkSpeed":10,"moveSpeed":0}},"19":{"유물":{"critDmg":10,"atkSpeed":10,"moveSpeed":0},"고대":{"critDmg":15,"atkSpeed":10,"moveSpeed":0}},"20":{"유물":{"critDmg":10,"atkSpeed":10,"moveSpeed":0},"고대":{"critDmg":15,"atkSpeed":10,"moveSpeed":0}}},"혼돈의 별 코어 : 속도":{"10":{"유물":{"atkSpeed":0.9,"moveSpeed":0},"고대":{"atkSpeed":0.9,"moveSpeed":0}},"14":{"유물":{"atkSpeed":0.9,"moveSpeed":0.9},"고대":{"atkSpeed":0.9,"moveSpeed":0.9}},"17":{"유물":{"atkSpeed":2.7,"moveSpeed":2.7},"고대":{"atkSpeed":3.6,"moveSpeed":3.6}},"18":{"유물":{"atkSpeed":3,"moveSpeed":3},"고대":{"atkSpeed":3.9,"moveSpeed":3.9}},"19":{"유물":{"atkSpeed":3.3,"moveSpeed":3.3},"고대":{"atkSpeed":4.2,"moveSpeed":4.2}},"20":{"유물":{"atkSpeed":3.6,"moveSpeed":3.6},"고대":{"atkSpeed":4.5,"moveSpeed":4.5}}},"질서의 해 코어 : 광파섬":{"10":{"유물":{"atkSpeed":0,"moveSpeed":0},"고대":{"atkSpeed":0,"moveSpeed":0}},"14":{"유물":{"atkSpeed":28,"moveSpeed":28},"고대":{"atkSpeed":28,"moveSpeed":28}},"17":{"유물":{"atkSpeed":28,"moveSpeed":28},"고대":{"atkSpeed":28,"moveSpeed":28}},"18":{"유물":{"atkSpeed":28,"moveSpeed":28},"고대":{"atkSpeed":28,"moveSpeed":28}},"19":{"유물":{"atkSpeed":28,"moveSpeed":28},"고대":{"atkSpeed":28,"moveSpeed":28}},"20":{"유물":{"atkSpeed":28,"moveSpeed":28},"고대":{"atkSpeed":28,"moveSpeed":28}}},"질서의 해 코어 : ATB-07 니들레인":{"10":{"유물":{"atkSpeed":0},"고대":{"atkSpeed":0}},"14":{"유물":{"atkSpeed":0,"moveSpeed":0},"고대":{"atkSpeed":0,"moveSpeed":0}},"17":{"유물":{"atkSpeed":30,"moveSpeed":30},"고대":{"atkSpeed":30,"moveSpeed":30}},"18":{"유물":{"atkSpeed":30,"moveSpeed":30},"고대":{"atkSpeed":30,"moveSpeed":30}},"19":{"유물":{"atkSpeed":30,"moveSpeed":30},"고대":{"atkSpeed":30,"moveSpeed":30}},"20":{"유물":{"atkSpeed":30,"moveSpeed":30},"고대":{"atkSpeed":30,"moveSpeed":30}}},"질서의 해 코어 : TA-09 피어싱 애로우":{"10":{"유물":{"atkSpeed":0},"고대":{"atkSpeed":0}},"14":{"유물":{"atkSpeed":0,"moveSpeed":0},"고대":{"atkSpeed":0,"moveSpeed":0}},"17":{"유물":{"atkSpeed":10,"moveSpeed":10},"고대":{"atkSpeed":10,"moveSpeed":10}},"18":{"유물":{"atkSpeed":10,"moveSpeed":10},"고대":{"atkSpeed":10,"moveSpeed":10}},"19":{"유물":{"atkSpeed":10,"moveSpeed":10},"고대":{"atkSpeed":10,"moveSpeed":10}},"20":{"유물":{"atkSpeed":10,"moveSpeed":10},"고대":{"atkSpeed":10,"moveSpeed":10}}},"질서의 해 코어 : 충격 억제":{"10":{"유물":{"atkSpeed":0},"고대":{"atkSpeed":0}},"14":{"유물":{"atkSpeed":0,"moveSpeed":0},"고대":{"atkSpeed":0,"moveSpeed":0}},"17":{"유물":{"atkSpeed":10,"moveSpeed":10},"고대":{"atkSpeed":15,"moveSpeed":15}},"18":{"유물":{"atkSpeed":10,"moveSpeed":10},"고대":{"atkSpeed":15,"moveSpeed":15}},"19":{"유물":{"atkSpeed":10,"moveSpeed":10},"고대":{"atkSpeed":15,"moveSpeed":15}},"20":{"유물":{"atkSpeed":10,"moveSpeed":10},"고대":{"atkSpeed":15,"moveSpeed":15}}},"질서의 해 코어 : 블러드 매서커":{"10":{"유물":{"atkSpeed":0},"고대":{"atkSpeed":0}},"14":{"유물":{"atkSpeed":0,"moveSpeed":0},"고대":{"atkSpeed":0,"moveSpeed":0}},"17":{"유물":{"atkSpeed":12,"moveSpeed":0},"고대":{"atkSpeed":12,"moveSpeed":0}},"18":{"유물":{"atkSpeed":12,"moveSpeed":0},"고대":{"atkSpeed":12,"moveSpeed":0}},"19":{"유물":{"atkSpeed":12,"moveSpeed":0},"고대":{"atkSpeed":12,"moveSpeed":0}},"20":{"유물":{"atkSpeed":12,"moveSpeed":0},"고대":{"atkSpeed":12,"moveSpeed":0}}},"질서의 해 코어 : 서프레서":{"10":{"유물":{"atkSpeed":0},"고대":{"atkSpeed":0}},"14":{"유물":{"atkSpeed":10,"moveSpeed":10},"고대":{"atkSpeed":10,"moveSpeed":10}},"17":{"유물":{"atkSpeed":10,"moveSpeed":10},"고대":{"atkSpeed":10,"moveSpeed":10}},"18":{"유물":{"atkSpeed":10,"moveSpeed":10},"고대":{"atkSpeed":10,"moveSpeed":10}},"19":{"유물":{"atkSpeed":10,"moveSpeed":10},"고대":{"atkSpeed":10,"moveSpeed":10}},"20":{"유물":{"atkSpeed":10,"moveSpeed":10},"고대":{"atkSpeed":10,"moveSpeed":10}}},"질서의 해 코어 : 래피드 탱크":{"10":{"유물":{"atkSpeed":0},"고대":{"atkSpeed":0}},"14":{"유물":{"atkSpeed":0,"moveSpeed":0},"고대":{"atkSpeed":0,"moveSpeed":0}},"17":{"유물":{"atkSpeed":12,"moveSpeed":0},"고대":{"atkSpeed":12,"moveSpeed":0}},"18":{"유물":{"atkSpeed":12,"moveSpeed":0},"고대":{"atkSpeed":12,"moveSpeed":0}},"19":{"유물":{"atkSpeed":12,"moveSpeed":0},"고대":{"atkSpeed":12,"moveSpeed":0}},"20":{"유물":{"atkSpeed":12,"moveSpeed":0},"고대":{"atkSpeed":12,"moveSpeed":0}}},"질서의 해 코어 : 점핑맨":{"10":{"유물":{"atkSpeed":0},"고대":{"atkSpeed":0}},"14":{"유물":{"atkSpeed":0,"moveSpeed":0},"고대":{"atkSpeed":0,"moveSpeed":0}},"17":{"유물":{"atkSpeed":20,"moveSpeed":0},"고대":{"atkSpeed":20,"moveSpeed":0}},"18":{"유물":{"atkSpeed":20,"moveSpeed":0},"고대":{"atkSpeed":20,"moveSpeed":0}},"19":{"유물":{"atkSpeed":20,"moveSpeed":0},"고대":{"atkSpeed":20,"moveSpeed":0}},"20":{"유물":{"atkSpeed":20,"moveSpeed":0},"고대":{"atkSpeed":20,"moveSpeed":0}}},"질서의 달 코어 : 도약의 순간":{"10":{"유물":{"atkSpeed":0},"고대":{"atkSpeed":0}},"14":{"유물":{"atkSpeed":0,"moveSpeed":0},"고대":{"atkSpeed":0,"moveSpeed":0}},"17":{"유물":{"atkSpeed":0,"moveSpeed":20},"고대":{"atkSpeed":0,"moveSpeed":20}},"18":{"유물":{"atkSpeed":0,"moveSpeed":20},"고대":{"atkSpeed":0,"moveSpeed":20}},"19":{"유물":{"atkSpeed":0,"moveSpeed":20},"고대":{"atkSpeed":0,"moveSpeed":20}},"20":{"유물":{"atkSpeed":0,"moveSpeed":20},"고대":{"atkSpeed":0,"moveSpeed":20}}},"질서의 해 코어 : 곰은 사람을 찢어":{"10":{"유물":{"atkSpeed":0},"고대":{"atkSpeed":0}},"14":{"유물":{"atkSpeed":0,"moveSpeed":0},"고대":{"atkSpeed":0,"moveSpeed":0}},"17":{"유물":{"atkSpeed":15,"moveSpeed":15},"고대":{"atkSpeed":15,"moveSpeed":15}},"18":{"유물":{"atkSpeed":15,"moveSpeed":15},"고대":{"atkSpeed":15,"moveSpeed":15}},"19":{"유물":{"atkSpeed":15,"moveSpeed":15},"고대":{"atkSpeed":15,"moveSpeed":15}},"20":{"유물":{"atkSpeed":15,"moveSpeed":15},"고대":{"atkSpeed":15,"moveSpeed":15}}},"질서의 해 코어 : 차원 소멸":{"10":{"유물":{"atkSpeed":0},"고대":{"atkSpeed":0}},"14":{"유물":{"atkSpeed":20,"moveSpeed":0},"고대":{"atkSpeed":20,"moveSpeed":0}},"17":{"유물":{"atkSpeed":20,"moveSpeed":0},"고대":{"atkSpeed":20,"moveSpeed":0}},"18":{"유물":{"atkSpeed":20,"moveSpeed":0},"고대":{"atkSpeed":20,"moveSpeed":0}},"19":{"유물":{"atkSpeed":20,"moveSpeed":0},"고대":{"atkSpeed":20,"moveSpeed":0}},"20":{"유물":{"atkSpeed":20,"moveSpeed":0},"고대":{"atkSpeed":20,"moveSpeed":0}}} ,"질서의 해 코어 : 망자의 발걸음":{"10":{"유물":{"moveSpeed":0},"고대":{"moveSpeed":0}},"14":{"유물":{"moveSpeed":5.0},"고대":{"moveSpeed":5.0}},"17":{"유물":{"moveSpeed":5.0},"고대":{"moveSpeed":5.0}},"18":{"유물":{"moveSpeed":5.0},"고대":{"moveSpeed":5.0}},"19":{"유물":{"moveSpeed":5.0},"고대":{"moveSpeed":5.0}},"20":{"유물":{"moveSpeed":5.0},"고대":{"moveSpeed":5.0}}}};





const CLASS_SYNERGY = [
  // === 무조건 적용 ===
  { class: "데빌헌터", stat: "critRate", value: 10.0, label: "치적 시너지" },
  { class: "건슬링어", stat: "critRate", value: 10.0, label: "치적 시너지" },
  { class: "아르카나", stat: "critRate", value: 10.0, label: "치적 시너지" },
  { class: "기상술사", stat: "critRate", value: 10.0, label: "치적 시너지" },
  { class: "스트라이커", stat: "critRate", value: 20.0, label: "자치적" },
  { class: "스트라이커", stat: "atkSpeed", value: 8.0, label: "공속 시너지" },
  { class: "스트라이커", stat: "moveSpeed", value: 8.0, label: "이속 시너지" },
  { class: "배틀마스터", stat: "critRate", value: 30.0, label: "자치적" },
  { class: "배틀마스터", stat: "moveSpeed", value: 16.0, label: "이속 시너지" },
  { class: "블레이드", stat: "atkSpeed", value: 12.8, label: "공속 시너지 (마엘)" },
  { class: "블레이드", stat: "moveSpeed", value: 12.8, label: "이속 시너지 (마엘)" },

  // === 진화/깨달음 노드 1레벨 이상 학습 시 적용 ===
  { class: "창술사", stat: "critRate", value: 20.0, label: "자치적 (청룡진)", requireNode: "연가심공" },
  { class: "도화가", stat: "atkSpeed", value: 8.0, label: "공속 시너지", requireNode: "묵법 : 파죽" },
  { class: "바드", stat: "atkSpeed", value: 16.0, label: "공속 시너지", requireNode: "템페스트 필드" },
  { class: "호크아이", stat: "moveSpeed", value: 8.0, label: "이속 시너지", requireNode: "두 번째 동료" },

  // === 스킬+트라이포드 조합 (기본값 없음, 트라이포드 미선택 시 0) ===
  { class: "서머너", stat: "critRate", value: 11.8, label: "슈르디 (빛의 성장)", requireSkill: "슈르디", requireTripod: "빛의 성장" },
  { class: "건슬링어", stat: "atkSpeed", value: 13.8, label: "퀵 스텝 (생기 흡수 공속)", requireSkill: "퀵 스텝", requireTripod: "생기 흡수" },
  { class: "건슬링어", stat: "moveSpeed", value: 13.8, label: "퀵 스텝 (생기 흡수 이속)", requireSkill: "퀵 스텝", requireTripod: "생기 흡수" },
  { class: "아르카나", stat: "critRate", value: 27.6, label: "스트림 (다크니스 엣지)", requireSkill: "스트림 오브 엣지", requireTripod: "다크니스 엣지" },
   // === 기본값 + 트라이포드 선택 시 추가값(합산) ===
  { class: "아르카나", stat: "critDmg", value: 77.5, label: "운명의 부름 (어두운 운명)", requireSkill: "운명의 부름", requireTripod: "어두운 운명", mutexGroup: "arcana_hiddenfate" },
  { class: "아르카나", stat: "critDmg", value: 77.5, label: "리턴 (노출된 어둠)", requireSkill: "리턴", requireTripod: "노출된 어둠", mutexGroup: "arcana_hiddenfate" } ,
  // === 기본값 + 트라이포드 선택 시 추가값(합산) ===
  { class: "배틀마스터", stat: "atkSpeed", value: 8.0, label: "공속 시너지",
    tripodBonus: { requireSkill: "바람의 속삭임", requireTripod: "바람의 축복", extraValue: 12.8, label: "바람의 속삭임 (바람의 축복)" } }
  ,
  { class: "아르카나", stat: "atkSpeed", value: 19.2, label: "스크래치 딜러 (안전 장치)", requireSkill: "스크래치 딜러", requireTripod: "안전 장치" },
  { class: "아르카나", stat: "moveSpeed", value: 30.0, label: "스크래치 딜러 (안전 장치)", requireSkill: "스크래치 딜러", requireTripod: "안전 장치" }
,
{ class: "발키리", stat: "moveSpeed", value: 30.0, label: "계시의 검 (날렵한 움직임)", requireSkill: "계시의 검", requireTripod: "날렵한 움직임", mutexGroup: "발키리이속" } 
,
{ class: "발키리", stat: "moveSpeed", value: 30.0, label: "전진 찌르기 (날렵한 움직임)", requireSkill: "전진 찌르기", requireTripod: "날렵한 움직임", mutexGroup: "발키리이속" } 
,
  { class: "소울이터", stat: "moveSpeed", value: 19.20, label: "루나틱 엣지 (그림자 강탈)", requireSkill: "루나틱 엣지", requireTripod: "그림자 강탈" }

];



