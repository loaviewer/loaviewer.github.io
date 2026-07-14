const ArcGrid = (() => {
    const THUMB = "https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/";

    const allJobs = [
        {name:"버서커", file:"berserker.png"},
        {name:"워로드", file:"warlord.png"},
        {name:"디스트로이어", file:"destroyer.png"},
        {name:"홀리나이트", file:"holyknight.png"},
        {name:"슬레이어", file:"berserker_female.png"},
        {name:"발키리", file:"holyknight.png"},
        {name:"배틀마스터", file:"battle_master.png"},
        {name:"인파이터", file:"infighter.png"},
        {name:"기공사", file:"force_master.png"},
        {name:"창술사", file:"lance_master.png"},
        {name:"스트라이커", file:"battle_master_male.png"},
        {name:"브레이커", file:"infighter_male.png"},
        {name:"데빌헌터", file:"devil_hunter.png"},
        {name:"블래스터", file:"blaster.png"},
        {name:"호크아이", file:"hawk_eye.png"},
        {name:"스카우터", file:"scouter.png"},
        {name:"건슬링어", file:"devil_hunter_female.png"},
        {name:"바드", file:"bard.png"},
        {name:"서머너", file:"summoner.png"},
        {name:"아르카나", file:"arcana.png"},
        {name:"소서리스", file:"elemental_master.png"},
        {name:"블레이드", file:"blade.png"},
        {name:"데모닉", file:"demonic.png"},
        {name:"리퍼", file:"reaper.png"},
        {name:"소울이터", file:"soul_eater.png"},
        {name:"가디언나이트", file:"dragon_knight.png"},
        {name:"도화가", file:"yinyangshi.png"},
        {name:"기상술사", file:"weather_artist.png"},
        {name:"환수사", file:"alchemist.png"},
        {name:"차원술사", file:"dimension_master.png"}
    ];


const enabledJobs = [
    "디스트로이어", "워로드", "버서커", "홀리나이트",
    "슬레이어", "발키리", "배틀마스터", "인파이터",
    "기공사", "창술사", "스트라이커", "브레이커",
    "데빌헌터", "블래스터", "호크아이", "스카우터",
    "건슬링어", "바드", "서머너", "아르카나",
    "소서리스", "블레이드", "데모닉", "리퍼",
    "소울이터", "도화가", "기상술사", "환수사",
    "가디언나이트", "차원술사"
];

const jobStyles = {
    "디스트로이어": ["분노의 망치", "중력 수련"],
    "워로드": ["고독한 기사", "전투 태세"],
    "버서커": ["광전사의 비기", "광기"],
    "홀리나이트": ["심판자", "축복의 오라"],
    "슬레이어": ["처단자", "포식자"],
    "발키리": ["빛의 기사", "해방자"],
    "배틀마스터": ["초심", "오의 강화"],
    "인파이터": ["충격 단련", "극의: 체술"],
    "기공사": ["역천지체", "무상신공"],
    "창술사": ["절정", "절제"],
    "스트라이커": ["일격필살", "오의난무"],
    "브레이커": ["권왕파천무", "수라의 길"],
    "데빌헌터": ["전술 탄환", "핸드거너"],
    "블래스터": ["포격 강화", "화력 강화"],
    "호크아이": ["죽음의 습격", "두 번째 동료"],
    "스카우터": ["아르데타인의 기술", "진화의 유산"],
    "건슬링어": ["피스메이커", "사냥의 시간"],
    "바드": ["진실된 용맹", "절실한 구원"],
    "서머너": ["넘치는 교감", "상급 소환사"],
    "아르카나": ["황후의 은총", "황제의 칙령"],
    "소서리스": ["점화", "환류"],
    "블레이드": ["버스트", "잔재된 기운"],
    "데모닉": ["멈출 수 없는 충동", "완벽한 억제"],
    "리퍼": ["달의 소리", "갈증"],
    "소울이터": ["만월의 집행자", "그믐의 경계"],
    "가디언나이트": ["업화의 계승자", "드레드 로어"],
    "도화가": ["회귀", "만개"],
    "기상술사": ["질풍노도", "이슬비"],
    "환수사": ["야성", "환수 각성"],
    "차원술사": ["시간 관리자", "공간 검사"]
};

let currentJob = null;
let currentStyle = null;

const currentGrades = { Hae: "relic", Dal: "relic", Byeol: "relic" };


function init(target) {
    if (!target) return;

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
     




target.innerHTML = `
    <div id="arcGridApp" class="mobile">

      <div class="p-hero hero-arc-grid">
    <div class="p-hero-inner">
        <div class="p-hero-left">
            <div class="p-hero-copy">
                <div class="p-hero-kicker">PRECISION · ARC GRID</div>
                <div class="p-hero-title-row">
                   <div class="p-hero-icon"><img src="https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_96.png" alt="해 코어" style="width:48px;height:48px;object-fit:contain;"></div>
                    <div class="p-hero-title-wrap">
                        <h2 class="p-hero-title">아크 그리드</h2>
                        <div class="p-hero-subtitle">코어 간편보기</div>
                    </div>
                </div>
                <p class="p-hero-desc">직업별 코어 옵션을 빠르게 비교할 수 있습니다.</p>
<div class="p-hero-pills">
    <span class="p-pill">빠른 비교</span>
    <span class="p-pill">정밀 탐색</span>
    <span class="p-pill">등급별 확인</span>
</div>
            </div>
        </div>
    </div>
</div>

        <div class="m-arc-section">
            <div class="m-arc-label">클래스 선택</div>
            <div class="m-arc-job-row">
                <div class="m-arc-job-thumb" id="mobileJobThumb">
                    <span class="m-arc-job-placeholder">?</span>
                </div>
                <select id="mobileJobSelect" class="m-arc-select">
                    <option value="">직업을 선택하세요</option>
                    <optgroup label="전사">
                        <option value="워로드">워로드</option>
                        <option value="버서커">버서커</option>
                        <option value="디스트로이어">디스트로이어</option>
                        <option value="홀리나이트">홀리나이트</option>
                        <option value="슬레이어">슬레이어</option>
                        <option value="발키리">발키리</option>
                    </optgroup>
                    <optgroup label="무도가">
                        <option value="배틀마스터">배틀마스터</option>
                        <option value="인파이터">인파이터</option>
                        <option value="기공사">기공사</option>
                        <option value="창술사">창술사</option>
                        <option value="스트라이커">스트라이커</option>
                        <option value="브레이커">브레이커</option>
                    </optgroup>
                    <optgroup label="헌터">
                        <option value="데빌헌터">데빌헌터</option>
                        <option value="블래스터">블래스터</option>
                        <option value="호크아이">호크아이</option>
                        <option value="스카우터">스카우터</option>
                        <option value="건슬링어">건슬링어</option>
                    </optgroup>
                    <optgroup label="마법사">
                        <option value="바드">바드</option>
                        <option value="서머너">서머너</option>
                        <option value="아르카나">아르카나</option>
                        <option value="소서리스">소서리스</option>
                    </optgroup>
                    <optgroup label="암살자">
                        <option value="블레이드">블레이드</option>
                        <option value="데모닉">데모닉</option>
                        <option value="리퍼">리퍼</option>
                        <option value="소울이터">소울이터</option>
                    </optgroup>
                    <optgroup label="스페셜리스트">
                        <option value="도화가">도화가</option>
                        <option value="기상술사">기상술사</option>
                        <option value="환수사">환수사</option>
                        <option value="차원술사">차원술사</option>
                    </optgroup>
                    <optgroup label="가디언">
                        <option value="가디언나이트">가디언나이트</option>
                    </optgroup>
                </select>
            </div>
        </div>

        <div class="m-arc-style-section" id="mobileStyleSection">
            <div class="m-arc-style-disabled">클래스 선택 후 활성화</div>
            <div id="styleToggleTabs"></div>
        </div>

        <div class="m-arc-tabs" id="mobileCoreTabs">
            <button class="m-arc-tab active" data-core="해" type="button">🌞</button>
            <button class="m-arc-tab" data-core="달" type="button">🌙</button>
            <button class="m-arc-tab" data-core="별" type="button">⭐</button>
        </div>

     
<div class="m-arc-core-select" id="mobileCoreSelectWrap">
    <div class="m-custom-core-select" id="mobileCoreDropdown">
        <button type="button" class="m-custom-core-trigger" id="mobileCoreTrigger">코어를 선택하세요</button>
        <div class="m-custom-core-menu" id="mobileCoreMenu"></div>
        <input type="hidden" id="mobileCoreSel" value="">
    </div>
</div>


        <div class="m-arc-card-wrap">
            <div class="m-arc-grade-float" id="mobileGradeBar">
                <button class="grade-btn legendary" type="button">전설</button>
                <button class="grade-btn relic active" type="button">유물</button>
                <button class="grade-btn ancient" type="button">고대</button>
            </div>
            <div class="core-card empty" id="mobileCard">코어를 선택하세요</div>
        </div>

        <div id="arcGridToast">초기화 되었습니다.</div>
    </div>
`;

bindMobileEvents(target);




    } else {
        target.innerHTML = `
            <div id="arcGridApp">
   



<div class="p-hero hero-arc-grid">
    <div class="p-hero-inner">
        <div class="p-hero-left">
            <div class="p-hero-copy">
                <div class="p-hero-kicker">PRECISION · ARC GRID</div>
                <div class="p-hero-title-row">
                   <div class="p-hero-icon"><img src="https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_96.png" alt="해 코어" style="width:48px;height:48px;object-fit:contain;"></div>
                    <div class="p-hero-title-wrap">
                        <h2 class="p-hero-title">아크 그리드</h2>
                        <div class="p-hero-subtitle">코어 간편보기</div>
                    </div>
                </div>
                <p class="p-hero-desc">직업별 코어 옵션을 빠르게 비교할 수 있습니다.</p>
<div class="p-hero-pills">
    <span class="p-pill">빠른 비교</span>
    <span class="p-pill">정밀 탐색</span>
    <span class="p-pill">등급별 확인</span>
</div>
            </div>
        </div>
    </div>
</div>




    <div id="jobGrid"></div>

                <div id="classHeaderPanel">
                    <div id="selectedJobTitle">직업을 선택하세요</div>
                    <div id="styleToggleTabs"></div>
                </div>

             


<div id="coreSelectRow">
    <div class="custom-core-select" id="customHae" data-type="해">
        <button type="button" class="custom-core-trigger" id="triggerHae" disabled><span class="custom-core-trigger-icon">🌞</span> 해 코어를 선택하세요</button>
        <div class="custom-core-menu" id="menuHae"></div>
        <input type="hidden" id="selectHae" data-type="해" value="">
    </div>

    <div class="custom-core-select" id="customDal" data-type="달">
        <button type="button" class="custom-core-trigger" id="triggerDal" disabled><span class="custom-core-trigger-icon">🌙</span> 달 코어를 선택하세요</button>
        <div class="custom-core-menu" id="menuDal"></div>
        <input type="hidden" id="selectDal" data-type="달" value="">
    </div>

    <div class="custom-core-select" id="customByeol" data-type="별">
        <button type="button" class="custom-core-trigger" id="triggerByeol" disabled><span class="custom-core-trigger-icon">⭐</span> 별 코어를 선택하세요</button>
        <div class="custom-core-menu" id="menuByeol"></div>
        <input type="hidden" id="selectByeol" data-type="별" value="">
    </div>
</div>



                <hr class="divider">

                <div id="resultRow">
                    <div class="card-container">
                        <div class="grade-bar" id="barHae">
                            <button class="grade-btn legendary" type="button">전설</button>
                            <button class="grade-btn relic active" type="button">유물</button>
                            <button class="grade-btn ancient" type="button">고대</button>
                        </div>
                        <div class="core-card empty" id="cardHae">해 코어 슬롯</div>
                    </div>

                    <div class="card-container">
                        <div class="grade-bar" id="barDal">
                            <button class="grade-btn legendary" type="button">전설</button>
                            <button class="grade-btn relic active" type="button">유물</button>
                            <button class="grade-btn ancient" type="button">고대</button>
                        </div>
                        <div class="core-card empty" id="cardDal">달 코어 슬롯</div>
                    </div>

                    <div class="card-container">
                        <div class="grade-bar" id="barByeol">
                            <button class="grade-btn legendary" type="button">전설</button>
                            <button class="grade-btn relic active" type="button">유물</button>
                            <button class="grade-btn ancient" type="button">고대</button>
                        </div>
                        <div class="core-card empty" id="cardByeol">별 코어 슬롯</div>
                    </div>
                </div>

                <div id="arcGridToast">초기화 되었습니다.</div>
            </div>
        `;

        renderJobGrid();
bindGradeButtons();
bindSelectEvents();
bindCustomCoreDropdown();
    }
}




function bindMobileEvents(target) {
    let mobileCurrentCore = "해";
    let mobileCurrentGrade = "relic";

    // 각 탭별 선택값 저장소
    const savedSelections = {
        "해": { coreIndex: "", grade: "relic" },
        "달": { coreIndex: "", grade: "relic" },
        "별": { coreIndex: "", grade: "relic" }
    };
window._arcSaved = savedSelections;
    
const jobSel = target.querySelector("#mobileJobSelect");
const coreSel = target.querySelector("#mobileCoreSel");
const coreTrigger = target.querySelector("#mobileCoreTrigger");
const coreMenu = target.querySelector("#mobileCoreMenu");
const coreDropdown = target.querySelector("#mobileCoreDropdown");
const card = target.querySelector("#mobileCard");
const tabs = target.querySelectorAll(".m-arc-tab");







    // 직업 선택
    jobSel.addEventListener("change", () => {
    const thumb = document.getElementById("mobileJobThumb");
    const jobInfo = allJobs.find(j => j.name === jobSel.value);

    if (jobInfo) {
        thumb.innerHTML = `<img src="${THUMB}${jobInfo.file}" alt="${jobInfo.name}">`;
    } else {
        thumb.innerHTML = `<span class="m-arc-job-placeholder">?</span>`;
    }

    const jobName = jobSel.value;



        if (!jobName) {
            currentJob = null;
            currentStyle = null;
            const mobileTitle1 = document.getElementById("selectedJobTitle");
if (mobileTitle1) mobileTitle1.textContent = "직업을 선택하세요";
            document.getElementById("styleToggleTabs").innerHTML = "";
            resetAllSelections();
            resetMobileCore();
            document.getElementById("mobileStyleSection").classList.remove("style-active");
            return;
        }

        currentJob = jobName;
        const mobileTitle2 = document.getElementById("selectedJobTitle");
if (mobileTitle2) mobileTitle2.textContent = jobName;
        document.getElementById("mobileStyleSection").classList.add("style-active");
        renderStyleTabs();
        resetAllSelections();
        resetMobileCore();
        fillMobileCoreSelect();
    });

    // 코어 탭 (해/달/별) - 선택값 저장 후 전환
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // 현재 탭 선택값 저장
            savedSelections[mobileCurrentCore].coreIndex = coreSel.value;
            savedSelections[mobileCurrentCore].grade = mobileCurrentGrade;

            // 탭 전환
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            mobileCurrentCore = tab.dataset.core;

            // 새 탭의 저장된 값 복원
            mobileCurrentGrade = savedSelections[mobileCurrentCore].grade;
            updateGradeButtons();
            fillMobileCoreSelect();

            // 저장된 코어 선택값 복원
            const savedIdx = savedSelections[mobileCurrentCore].coreIndex;
            coreSel.value = savedIdx;

            if (savedIdx !== "") {
                renderMobileCard(savedIdx);
            } else {
                clearMobileCard();
            }

            updateAllTabLabels();
        });
    });

   
// 커스텀 코어 드롭다운 열기/닫기
coreTrigger.addEventListener("click", (e) => {
    e.stopPropagation();

    if (!currentJob || !currentStyle) return;

    const isOpen = coreDropdown.classList.contains("open");
    closeMobileCoreMenu();

    if (!isOpen) {
        coreDropdown.classList.add("open");
    }
});

// 커스텀 코어 옵션 선택
coreMenu.addEventListener("click", (e) => {
    const option = e.target.closest(".m-custom-core-option");
    if (!option) return;

    const val = option.dataset.value;
    const name = option.dataset.name;
    const icon = option.dataset.icon;

    coreSel.value = val;
    savedSelections[mobileCurrentCore].coreIndex = val;

    coreTrigger.innerHTML = `${icon} <span class="core-badge">${Number(val) + 1}</span> ${name}`;

    closeMobileCoreMenu();
    renderMobileCard(val);
    updateAllTabLabels();
});

// 바깥 클릭 시 닫기
if (!document._arcMobileCoreMenuBound) {
    document.addEventListener("click", () => {
        closeMobileCoreMenu();
    });
    document._arcMobileCoreMenuBound = true;
}


    // 등급 버튼
    target.querySelectorAll("#mobileGradeBar .grade-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            let grade = "";
            if (btn.classList.contains("legendary")) grade = "legendary";
            else if (btn.classList.contains("relic")) grade = "relic";
            else if (btn.classList.contains("ancient")) grade = "ancient";

            mobileCurrentGrade = grade;
            savedSelections[mobileCurrentCore].grade = grade;

            target.querySelectorAll("#mobileGradeBar .grade-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const val = coreSel.value;
            if (val !== "") {
                renderMobileCard(val);
            }
        });
    });

    function resetAllSelections() {
        ["해", "달", "별"].forEach(type => {
            savedSelections[type].coreIndex = "";
            savedSelections[type].grade = "relic";
        });
        mobileCurrentGrade = "relic";
        updateGradeButtons();
    }

    function updateGradeButtons() {
        target.querySelectorAll("#mobileGradeBar .grade-btn").forEach(btn => {
            btn.classList.remove("active");
            if (btn.classList.contains(mobileCurrentGrade)) {
                btn.classList.add("active");
            }
        });
    }

  
function resetMobileCore() {
    mobileCurrentCore = "해";
    tabs.forEach(t => t.classList.remove("active"));
    if (tabs[0]) tabs[0].classList.add("active");

    coreSel.value = "";
    coreTrigger.textContent = "코어를 선택하세요";
    coreMenu.innerHTML = "";

    closeMobileCoreMenu();
    clearMobileCard();
    updateAllTabLabels();
}



    function clearMobileCard() {
        card.classList.add("empty");
        card.innerHTML = "코어를 선택하세요";
    }


function closeMobileCoreMenu() {
    if (coreDropdown) {
        coreDropdown.classList.remove("open");
    }
}

function fillMobileCoreSelect() {
    if (!currentJob || !currentStyle) {
        coreSel.value = "";
        coreTrigger.textContent = "코어를 선택하세요";
        coreMenu.innerHTML = "";
        return;
    }

    const data = coreData[currentJob]?.[currentStyle];
    if (!data) return;

    const arr = data[mobileCurrentCore] || [];
    const typeEmojis = { "해": "🌞", "달": "🌙", "별": "⭐" };

    coreMenu.innerHTML = arr.map((core, i) => {
        const activeClass = savedSelections[mobileCurrentCore].coreIndex === String(i) ? " active" : "";
        return `
            <button type="button" class="m-custom-core-option${activeClass}" data-value="${i}" data-name="${core.name}" data-icon="${typeEmojis[mobileCurrentCore]}">
                <span class="m-custom-core-option-icon">${typeEmojis[mobileCurrentCore]}</span>
                <span class="core-badge">${i + 1}</span>
                <span class="m-custom-core-option-name">${core.name}</span>
            </button>
        `;
    }).join("");

    const savedIdx = savedSelections[mobileCurrentCore].coreIndex;

    if (savedIdx !== "" && arr[savedIdx]) {
        coreSel.value = savedIdx;
        coreTrigger.innerHTML = `${typeEmojis[mobileCurrentCore]} <span class="core-badge">${Number(savedIdx) + 1}</span> ${arr[savedIdx].name}`;
    } else {
        coreSel.value = "";
        coreTrigger.textContent = `${typeEmojis[mobileCurrentCore]} ${mobileCurrentCore} 코어를 선택하세요`;
    }

    closeMobileCoreMenu();
}



    function updateAllTabLabels() {
        if (!currentJob || !currentStyle) {
            tabs.forEach(tab => {
                const type = tab.dataset.core;
                const icons = { "해": "🌞", "달": "🌙", "별": "⭐" };
                tab.innerHTML = icons[type];
                tab.classList.remove("has-selection");
            });
            return;
        }

        const data = coreData[currentJob]?.[currentStyle];
        if (!data) return;

        tabs.forEach(tab => {
            const type = tab.dataset.core;
            const icons = { "해": "🌞", "달": "🌙", "별": "⭐" };
            const savedIdx = savedSelections[type].coreIndex;
            const isActive = tab.classList.contains("active");

            if (savedIdx !== "") {
                const core = data[type]?.[savedIdx];
                const num = parseInt(savedIdx) + 1;
                if (isActive) {
                    tab.innerHTML = `${icons[type]} <span class="core-badge">${num}</span> ${core?.name || ""}`;
                } else {
                  tab.innerHTML = `${icons[type]} <span class="core-badge">${num}</span>`;
                }
                tab.classList.add("has-selection");
            } else {
                tab.innerHTML = icons[type];
                tab.classList.remove("has-selection");
            }
        });
    }

    function renderMobileCard(selectIndex) {
        if (!currentJob || !currentStyle) return;

        const data = coreData[currentJob]?.[currentStyle];
        if (!data) return;

        const selectedCore = data[mobileCurrentCore]?.[selectIndex];
        if (!selectedCore) return;

        updateAllTabLabels();

        const slotLabel = mobileCurrentCore;
        const normalizedSlot = slotLabel === "해" ? "Hae" : slotLabel === "달" ? "Dal" : "Byeol";
        currentGrades[normalizedSlot] = mobileCurrentGrade;

        const gradeLabels = {
            legendary: "전설",
            relic: "유물",
            ancient: "고대"
        };

        const gradePoints = {
            legendary: "12 포인트",
            relic: "15 포인트",
            ancient: "17 포인트"
        };

        const slotIcons = {
            "해": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_96.png",
            "달": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_97.png",
            "별": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_98.png"
        };

        const coreNumber = parseInt(selectIndex) + 1;
        const tiersHtml = getTierHtml(selectedCore.tiers, mobileCurrentGrade);

        card.classList.remove("empty");
        card.innerHTML = `
            <div class="card-grade-sticker ${mobileCurrentGrade}">${coreNumber}</div>
            <div class="card-title-row ${mobileCurrentGrade}">${gradeLabels[mobileCurrentGrade]}의 ${slotLabel} 코어 : ${selectedCore.name}</div>
            <div class="card-icon-row">
                <div class="card-icon-box"><img src="${slotIcons[slotLabel]}" alt="${slotLabel}코어"></div>
                <span class="card-icon-label">${gradeLabels[mobileCurrentGrade]} 아크 그리드 코어</span>
            </div>
            <div class="card-basic-info">${currentJob} 전용<br>획득 시 캐릭터 귀속</div>
            <div class="card-no-trade">거래 불가</div>
            <div class="card-section">
                <div class="card-section-label">코어 타입</div>
                <div class="card-section-value">질서 - ${slotLabel}</div>
            </div>
            <div class="card-section">
                <div class="card-section-label">코어 공급 의지력</div>
                <div class="card-section-gray points-highlight">${gradePoints[mobileCurrentGrade].replace(/(\d+)/, '<span class="points-number">$1</span>')}</div>
            </div>
            <div class="card-section">
                <div class="card-section-label">코어 옵션</div>
                ${tiersHtml}
            </div>
            <div class="card-section">
                <div class="card-section-label">코어 옵션 발동 조건</div>
                <div class="card-passive-condition">아크 패시브 : ${currentStyle} 습득</div>
            </div>
        `;
    }

    window._arcResetMobileCoreUI = function () {
        resetAllSelections();
        resetMobileCore();
        fillMobileCoreSelect();
        updateGradeButtons();
    };
}




function renderJobGrid() {
    const grid = document.getElementById("jobGrid");
    if (!grid) return;

    grid.innerHTML = "";

    allJobs.forEach(job => {
        const supported = enabledJobs.includes(job.name);

        const div = document.createElement("div");
        div.className = "arc-job-item" + (supported ? "" : " disabled");
        div.innerHTML = `
            <img src="${THUMB}${job.file}" alt="${job.name}">
            <span>${job.name}</span>
        `;

        if (supported) {
            div.addEventListener("click", () => {
                const hadSelected =
                    document.getElementById("selectHae")?.value !== "" ||
                    document.getElementById("selectDal")?.value !== "" ||
                    document.getElementById("selectByeol")?.value !== "";

                document.querySelectorAll(".arc-job-item").forEach(item => {
                    item.classList.remove("active");
                });

                div.classList.add("active");
                currentJob = job.name;

                const title = document.getElementById("selectedJobTitle");
                if (title) title.textContent = job.name;

                renderStyleTabs();
                resetSelects();
                populateSelects();
                clearCards();
                showResetToast(hadSelected);
            });
        }

        grid.appendChild(div);
    });
}


function renderStyleTabs() {
    const tabBox = document.getElementById("styleToggleTabs");
    if (!tabBox) return;

    tabBox.innerHTML = "";

    const styles = jobStyles[currentJob] || [];
    if (!styles.length) return;

    currentStyle = styles[0];

    styles.forEach((styleName, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = styleName;

        if (index === 0) {
            btn.classList.add("active");
        }





btn.addEventListener("click", () => {
    const isMobile = window.innerWidth <= 768;

    const hadSelected = isMobile
        ? document.getElementById("mobileCoreSel")?.value !== ""
        : (document.getElementById("selectHae")?.value !== "" ||
           document.getElementById("selectDal")?.value !== "" ||
           document.getElementById("selectByeol")?.value !== "");

    document.querySelectorAll("#styleToggleTabs button").forEach(b => {
        b.classList.remove("active");
    });

    btn.classList.add("active");
    currentStyle = styleName;

  


    if (isMobile) {
        if (typeof window._arcResetMobileCoreUI === "function") {
            window._arcResetMobileCoreUI();
        }
    } else {



        resetSelects();
        populateSelects();
        clearCards();
    }

    showResetToast(hadSelected);
});




        tabBox.appendChild(btn);
    });
}



function resetSelects() {
    const map = {
        "해": { inputId: "selectHae", triggerId: "triggerHae", menuId: "menuHae", label: "🌞 해 코어를 선택하세요" },
        "달": { inputId: "selectDal", triggerId: "triggerDal", menuId: "menuDal", label: "🌙 달 코어를 선택하세요" },
        "별": { inputId: "selectByeol", triggerId: "triggerByeol", menuId: "menuByeol", label: "⭐ 별 코어를 선택하세요" }
    };

    Object.values(map).forEach(cfg => {
        const input = document.getElementById(cfg.inputId);
        const trigger = document.getElementById(cfg.triggerId);
        const menu = document.getElementById(cfg.menuId);

        if (input) input.value = "";
        if (trigger) trigger.textContent = cfg.label;
        if (menu) menu.innerHTML = "";
    });

    closeCustomCoreMenus();
}





function clearCards() {
    ["Hae", "Dal", "Byeol"].forEach((slot, idx) => {
        const label = idx === 0 ? "해" : idx === 1 ? "달" : "별";
        const card = document.getElementById(`card${slot}`);
        if (card) {
            card.classList.add("empty");
            card.innerHTML = `${label} 코어 슬롯`;
        }
    });
}


function showResetToast(shouldShow = false) {
    if (!shouldShow) return;

    const toast = document.getElementById("arcGridToast");
    if (!toast) return;

    toast.classList.remove("show");
    void toast.offsetWidth;
    toast.classList.add("show");

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 1500);
}



function populateSelects() {
    if (!currentJob || !currentStyle) return;

    const data = coreData[currentJob]?.[currentStyle];
    if (!data) return;

    fillCustomCoreDropdown("해", data.해 || []);
    fillCustomCoreDropdown("달", data.달 || []);
    fillCustomCoreDropdown("별", data.별 || []);

document.getElementById("triggerHae")?.removeAttribute("disabled");
document.getElementById("triggerDal")?.removeAttribute("disabled");
document.getElementById("triggerByeol")?.removeAttribute("disabled");

}

function parseSlashValue(str, grade) {
    if (!str.includes("/")) return str;

    return str.replace(/([0-9.]+)\/([0-9.]+)(%?)/g, (_, a, b, suffix) => {
        return (grade === "ancient" ? b : a) + suffix;
    });
}


function fillSelect(id, type, arr) {
    const typeEmojis = { "해": "🌞", "달": "🌙", "별": "⭐" };
    const sel = document.getElementById(id);
    if (!sel) return;

    sel.innerHTML =
        `<option value="">${typeEmojis[type]} ${type} 코어를 선택하세요</option>` +
        arr.map((core, i) => `<option value="${i}">${typeEmojis[type]} [${i + 1}] ${core.name}</option>`).join("");
}




function closeCustomCoreMenus() {
    document.querySelectorAll(".custom-core-select.open").forEach(el => {
        el.classList.remove("open");
    });
}

function bindCustomCoreDropdown() {
    const configs = [
        {
            type: "해",
            wrapId: "customHae",
            triggerId: "triggerHae",
            menuId: "menuHae",
            inputId: "selectHae",
            cardId: "cardHae",
            icon: "🌞"
        },
        {
            type: "달",
            wrapId: "customDal",
            triggerId: "triggerDal",
            menuId: "menuDal",
            inputId: "selectDal",
            cardId: "cardDal",
            icon: "🌙"
        },
        {
            type: "별",
            wrapId: "customByeol",
            triggerId: "triggerByeol",
            menuId: "menuByeol",
            inputId: "selectByeol",
            cardId: "cardByeol",
            icon: "⭐"
        }
    ];

    configs.forEach(cfg => {
        const wrap = document.getElementById(cfg.wrapId);
        const trigger = document.getElementById(cfg.triggerId);
        const menu = document.getElementById(cfg.menuId);
        const hidden = document.getElementById(cfg.inputId);

        if (!wrap || !trigger || !menu || !hidden) return;

       


trigger.addEventListener("click", (e) => {
    e.stopPropagation();

    if (!currentJob || !currentStyle) return;
    if (menu.children.length === 0) return;

    const isOpen = wrap.classList.contains("open");
    closeCustomCoreMenus();

    if (!isOpen) {
        wrap.classList.add("open");
    }
});




        menu.addEventListener("click", (e) => {
            const option = e.target.closest(".custom-core-option");
            if (!option) return;

            const value = option.dataset.value;
            const name = option.dataset.name;

            hidden.value = value;
           trigger.innerHTML = `<span class="custom-core-trigger-icon">${cfg.icon}</span> <span class="core-badge">${Number(value) + 1}</span> ${name}`;

            closeCustomCoreMenus();
            renderCard(cfg.cardId, cfg.type, value);
        });
    });

    if (!document._arcCustomCoreMenuBound) {
        document.addEventListener("click", () => {
            closeCustomCoreMenus();
        });
        document._arcCustomCoreMenuBound = true;
    }
}


function fillCustomCoreDropdown(type, arr) {
    const map = {
        "해": { wrapId: "customHae", menuId: "menuHae", triggerId: "triggerHae", inputId: "selectHae", icon: "🌞", label: "🌞 해 코어를 선택하세요" },
        "달": { wrapId: "customDal", menuId: "menuDal", triggerId: "triggerDal", inputId: "selectDal", icon: "🌙", label: "🌙 달 코어를 선택하세요" },
        "별": { wrapId: "customByeol", menuId: "menuByeol", triggerId: "triggerByeol", inputId: "selectByeol", icon: "⭐", label: "⭐ 별 코어를 선택하세요" }
    };

    const cfg = map[type];
    if (!cfg) return;

    const wrap = document.getElementById(cfg.wrapId);
    const menu = document.getElementById(cfg.menuId);
    const trigger = document.getElementById(cfg.triggerId);
    const hidden = document.getElementById(cfg.inputId);

    if (!wrap || !menu || !trigger || !hidden) return;

    menu.innerHTML = arr.map((core, i) => {
        const activeClass = hidden.value === String(i) ? " active" : "";
        return `
            <button type="button" class="custom-core-option${activeClass}" data-value="${i}" data-name="${core.name}">
                <span class="custom-core-option-icon">${cfg.icon}</span>
                <span class="core-badge">${i + 1}</span>
                <span class="custom-core-option-name">${core.name}</span>
            </button>
        `;
    }).join("");

    if (hidden.value !== "" && arr[hidden.value]) {
        


trigger.innerHTML = `<span class="custom-core-trigger-icon">${cfg.icon}</span> <span class="core-badge">${Number(hidden.value) + 1}</span> ${arr[hidden.value].name}`;


    } else {
        hidden.value = "";
       trigger.innerHTML = `<span class="custom-core-trigger-icon">${cfg.icon}</span> ${type} 코어를 선택하세요`;
    }

    wrap.classList.remove("open");
}




function colorizeText(str) {
    const tokens = [];
    const save = (html) => {
        const key = `@@TOKEN_${tokens.length}@@`;
        tokens.push(html);
        return key;
    };

    let s = str;

    // 운명
    s = s.replace(/'운명[^']*'/g, m => save(`<span style="color:#D3B6E4;">${m}</span>`));

    // 피해량 / 시전 속도 / 치명타 / 공격 속도 / 이동 속도 / 홀딩 속도 / 차지 속도
    // 증가 = 초록, 감소 = 빨강
    s = s.replace(
        /((?:피해량|시전\s*속도|치명타(?:\s*적중률|\s*피해량)?|공격\s*속도|이동\s*속도|홀딩\s*속도|차지\s*속도)[^\n]*?)(\d+(?:\.\d+)?%)(\s*)(증가|감소)/g,
        (_, head, num, space, verb) => {
            const color = verb === "증가" ? "#80C342" : "#F2A1A1";
            return `${head}${save(`<span style="color:${color};">${num}</span>`)}${space}${verb}`;
        }
    );

    // 재사용 대기시간 : 감소 = 초록, 증가 = 빨강
    s = s.replace(
        /((?:재사용\s*대기시간)[^\n]*?)(\d+(?:\.\d+)?(?:초|%))(\s*)(증가|감소)/g,
        (_, head, num, space, verb) => {
            const color = verb === "감소" ? "#80C342" : "#F2A1A1";
            return `${head}${save(`<span style="color:${color};">${num}</span>`)}${space}${verb}`;
        }
    );

    // 소모량 : 감소 = 초록, 증가 = 빨강
    s = s.replace(
        /((?:소모량)[^\n]*?)(\d+(?:\.\d+)?%)(\s*)(증가|감소)/g,
        (_, head, num, space, verb) => {
            const color = verb === "감소" ? "#80C342" : "#F2A1A1";
            return `${head}${save(`<span style="color:${color};">${num}</span>`)}${space}${verb}`;
        }
    );

    // 게이지 / 회복량 / 획득량 / 보호막 수치 / 중첩 수 / 스택 수 : 증가 = 초록, 감소 = 빨강
    s = s.replace(
        /((?:게이지|회복량|획득량|보호막\s*수치|중첩\s*수|스택\s*수)[^\n]*?)(\d+(?:\.\d+)?%)(\s*)(증가|감소)/g,
        (_, head, num, space, verb) => {
            const color = verb === "증가" ? "#80C342" : "#F2A1A1";
            return `${head}${save(`<span style="color:${color};">${num}</span>`)}${space}${verb}`;
        }
    );

    // 게이지 / 마나 / 에너지 / 구슬 / 코어 / 중첩 획득/회복/변경
    s = s.replace(
        /((?:게이지|마나|에너지|구슬|코어|중첩)[^\n]*?)(\d+(?:\.\d+)?(?:%|개|중첩|만큼)?)(\s*)(획득|회복|변경)/g,
        (_, head, num, space, verb) => {
            return `${head}${save(`<span style="color:#80C342;">${num}</span>`)}${space}${verb}`;
        }
    );

    // 최대 n회/개/중첩까지
    s = s.replace(
        /(최대\s*)(\d+(?:\.\d+)?(?:회|개|중첩))(\s*까지)/g,
        (_, a, num, b) => `${a}${save(`<span style="color:#F9D915;">${num}</span>`)}${b}`
    );

    // n회까지 충전
    s = s.replace(
        /(\d+(?:\.\d+)?회)(\s*까지\s*충전)/g,
        (_, num, tail) => `${save(`<span style="color:#F9D915;">${num}</span>`)}${tail}`
    );

    // n중첩 / n스택
    s = s.replace(
        /(\d+(?:\.\d+)?(?:중첩|스택))/g,
        m => save(`<span style="color:#F9D915;">${m}</span>`)
    );

    // 시간(초)
    s = s.replace(
        /(\d+(?:\.\d+)?초)/g,
        m => save(`<span style="color:#F9D915;">${m}</span>`)
    );

    // 남아있는 퍼센트는 기본 초록
    s = s.replace(
        /(\d+(?:\.\d+)?%)/g,
        m => save(`<span style="color:#80C342;">${m}</span>`)
    );

    tokens.forEach((html, i) => {
        s = s.replaceAll(`@@TOKEN_${i}@@`, html);
    });

    return s;
}








function getTierHtml(tiers, grade) {
    const keys = grade === "legendary"
        ? ["10P", "14P"]
        : ["10P", "14P", "17P", "18-20P"];

    let html = "";

    keys.forEach(key => {
        const text = tiers[key];
        if (!text) return;

        const parsed = parseSlashValue(text, grade);
        const colored = colorizeText(parsed);

        if (key === "18-20P") {
            ["18P", "19P", "20P"].forEach(p => {
                html += `
                    <div class="tier">
                        <span class="tier-label">[${p}]</span>
                        <span class="tier-desc">${colored}</span>
                    </div>
                `;
            });
        } else {
            html += `
                <div class="tier">
                    <span class="tier-label">[${key}]</span>
                    <span class="tier-desc">${colored}</span>
                </div>
            `;
        }
    });

    return html;
}



function bindGradeButtons() {
    document.querySelectorAll(".grade-bar").forEach(bar => {
        bar.querySelectorAll(".grade-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const barId = bar.id;
                const slot = barId.replace("bar", "");

                let grade = "";
                if (btn.classList.contains("legendary")) grade = "legendary";
                else if (btn.classList.contains("relic")) grade = "relic";
                else if (btn.classList.contains("ancient")) grade = "ancient";

                currentGrades[slot] = grade;

                bar.querySelectorAll(".grade-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const selectEl = document.getElementById(`select${slot}`);
                if (!selectEl) return;

                const selectedValue = selectEl.value;
                if (selectedValue === "") return;

                const type = slot === "Hae" ? "해" : slot === "Dal" ? "달" : "별";
                const cardId = `card${slot}`;
                renderCard(cardId, type, selectedValue);
            });
        });
    });
}


function bindSelectEvents() {
    document.querySelectorAll("#coreSelectRow select").forEach(sel => {
        sel.addEventListener("change", e => {
            const type = e.target.getAttribute("data-type");
            const engType = type === "해" ? "Hae" : type === "달" ? "Dal" : "Byeol";
            const cardId = `card${engType}`;
            const val = e.target.value;

            if (val === "") {
                const card = document.getElementById(cardId);
                card.classList.add("empty");
                card.innerHTML = `${type} 코어 슬롯`;
                return;
            }

            renderCard(cardId, type, val);
        });
    });
}


function renderCard(cardId, slotLabel, selectIndex) {
    const card = document.getElementById(cardId);
    if (!card) return;

    const data = coreData[currentJob]?.[currentStyle];
    if (!data) return;

    const selectedCore = data[slotLabel]?.[selectIndex];
    if (!selectedCore) return;

    const normalizedSlot = slotLabel === "해" ? "Hae" : slotLabel === "달" ? "Dal" : "Byeol";
    const currentGrade = currentGrades[normalizedSlot];

    const gradeLabels = {
        legendary: "전설",
        relic: "유물",
        ancient: "고대"
    };

    const gradePoints = {
        legendary: "12 포인트",
        relic: "15 포인트",
        ancient: "17 포인트"
    };

    const slotIcons = {
        "해": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_96.png",
        "달": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_97.png",
        "별": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_98.png"
    };

    const coreNumber = parseInt(selectIndex) + 1;
    const tiersHtml = getTierHtml(selectedCore.tiers, currentGrade);

    card.classList.remove("empty");
    card.innerHTML = `
        <div class="card-grade-sticker ${currentGrade}">${coreNumber}</div>
        <div class="card-title-row ${currentGrade}">${gradeLabels[currentGrade]}의 ${slotLabel} 코어 : ${selectedCore.name}</div>
        <div class="card-icon-row">
            <div class="card-icon-box"><img src="${slotIcons[slotLabel]}" alt="${slotLabel}코어"></div>
            <span class="card-icon-label">${gradeLabels[currentGrade]} 아크 그리드 코어</span>
        </div>
        <div class="card-basic-info">${currentJob} 전용<br>획득 시 캐릭터 귀속</div>
        <div class="card-no-trade">거래 불가</div>
        <div class="card-section">
            <div class="card-section-label">코어 타입</div>
            <div class="card-section-value">질서 - ${slotLabel}</div>
        </div>
        <div class="card-section">
            <div class="card-section-label">코어 공급 의지력</div>
           <div class="card-section-gray points-highlight">${gradePoints[currentGrade].replace(/(\d+)/, '<span class="points-number">$1</span>')}</div>
        </div>
        <div class="card-section">
            <div class="card-section-label">코어 옵션</div>
            ${tiersHtml}
        </div>
        <div class="card-section">
            <div class="card-section-label">코어 옵션 발동 조건</div>
            <div class="card-passive-condition">아크 패시브 : ${currentStyle} 습득</div>
        </div>
    `;
}


    return { init };
})();
