const ArcGrid = (() => {
    const THUMB = "https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/thumb/";

    const allJobs = [
        { name: "버서커", file: "berserker.png" },
        { name: "워로드", file: "warlord.png" },
        { name: "디스트로이어", file: "destroyer.png" },
        { name: "홀리나이트", file: "holyknight.png" },
        { name: "슬레이어", file: "berserker_female.png" },
        { name: "발키리", file: "holyknight.png" },
        { name: "배틀마스터", file: "battle_master.png" },
        { name: "인파이터", file: "infighter.png" },
        { name: "기공사", file: "force_master.png" },
        { name: "창술사", file: "lance_master.png" },
        { name: "스트라이커", file: "battle_master_male.png" },
        { name: "브레이커", file: "infighter_male.png" },
        { name: "데빌헌터", file: "devil_hunter.png" },
        { name: "블래스터", file: "blaster.png" },
        { name: "호크아이", file: "hawk_eye.png" },
        { name: "스카우터", file: "scouter.png" },
        { name: "건슬링어", file: "devil_hunter_female.png" },
        { name: "바드", file: "bard.png" },
        { name: "서머너", file: "summoner.png" },
        { name: "아르카나", file: "arcana.png" },
        { name: "소서리스", file: "elemental_master.png" },
        { name: "블레이드", file: "blade.png" },
        { name: "데모닉", file: "demonic.png" },
        { name: "리퍼", file: "reaper.png" },
        { name: "소울이터", file: "soul_eater.png" },
        { name: "가디언나이트", file: "dragon_knight.png" },
        { name: "도화가", file: "yinyangshi.png" },
        { name: "기상술사", file: "weather_artist.png" },
        { name: "환수사", file: "alchemist.png" },
        { name: "차원술사", file: "dimension_master.png" }
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
                                        <div class="p-hero-icon">
                                            <img src="https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_96.png" alt="해 코어" style="width:48px;height:48px;object-fit:contain;">
                                        </div>
                                        <div class="p-hero-title-wrap">
                                            <h2 class="p-hero-title">아크 그리드</h2>
                                            <div class="p-hero-subtitle">코어 간편보기</div>
                                        </div>
                                    </div>
                                    <p class="p-hero-desc">아크그리드 코어 DB정보 : 2026/07/15</p>
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
                                        <div class="p-hero-icon">
                                            <img src="https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_96.png" alt="해 코어" style="width:48px;height:48px;object-fit:contain;">
                                        </div>
                                        <div class="p-hero-title-wrap">
                                            <h2 class="p-hero-title">아크 그리드</h2>
                                            <div class="p-hero-subtitle">코어 간편보기</div>
                                        </div>
                                    </div>
                                    <p class="p-hero-desc">아크그리드 코어 DB정보 : 2026/07/15</p>
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

        const typeEmojis = { "해": "🌞", "달": "🌙", "별": "⭐" };

        const orderImgMap = {
            "해": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_96.png",
            "달": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_97.png",
            "별": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_98.png"
        };

        const chaosImgMap = {
            "해": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_99.png",
            "달": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_100.png",
            "별": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_101.png"
        };

        function closeMobileCoreMenu() {
            if (coreDropdown) {
                coreDropdown.classList.remove("open");
            }
        }

        function clearMobileCard() {
            card.classList.add("empty");
            card.innerHTML = "코어를 선택하세요";
        }

        function updateGradeButtons() {
            target.querySelectorAll("#mobileGradeBar .grade-btn").forEach(btn => {
                btn.classList.remove("active");
                if (btn.classList.contains(mobileCurrentGrade)) {
                    btn.classList.add("active");
                }
            });
        }

        function resetAllSelections() {
            ["해", "달", "별"].forEach(type => {
                savedSelections[type].coreIndex = "";
                savedSelections[type].grade = "relic";
            });
            mobileCurrentGrade = "relic";
            updateGradeButtons();
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

        function fillMobileCoreSelect() {
            if (!currentJob || !currentStyle) {
                coreSel.value = "";
                coreTrigger.textContent = "코어를 선택하세요";
                coreMenu.innerHTML = "";
                return;
            }

            const data = coreData[currentJob]?.[currentStyle];
            if (!data) return;

            const orderArr = data[mobileCurrentCore] || [];
            const chaosArr = chaosNames[mobileCurrentCore] || [];

            const orderHtml = orderArr.map((core, i) => {
                const value = `order-${i}`;
                const activeClass = savedSelections[mobileCurrentCore].coreIndex === value ? " active" : "";
                return `
                    <button type="button" class="m-custom-core-option${activeClass}" data-value="${value}" data-name="${core.name}" data-icon="${typeEmojis[mobileCurrentCore]}">
                        <span class="m-custom-core-option-icon">${typeEmojis[mobileCurrentCore]}</span>
                        <span class="core-badge">${i + 1}</span>
                        <span class="m-custom-core-option-name">${core.name}</span>
                    </button>
                `;
            }).join("");

            const chaosHtml = chaosArr.map((name, i) => {
                const value = `chaos-${i}`;
                const activeClass = savedSelections[mobileCurrentCore].coreIndex === value ? " active" : "";
                return `
                    <button type="button" class="m-custom-core-option${activeClass}" data-value="${value}" data-name="${name}" data-icon="${typeEmojis[mobileCurrentCore]}">
                        <span class="m-custom-core-option-icon">${typeEmojis[mobileCurrentCore]}</span>
                        <span class="core-badge">${i + 1}</span>
                        <span class="m-custom-core-option-name">${name}</span>
                    </button>
                `;
            }).join("");

            coreMenu.innerHTML = `
                <div class="custom-core-group-title">
                    <img src="${orderImgMap[mobileCurrentCore]}" alt="질서 ${mobileCurrentCore} 코어">
                    <span>질서 ${mobileCurrentCore} 코어</span>
                </div>
                ${orderHtml}
                <div class="custom-core-group-title chaos">
                    <img src="${chaosImgMap[mobileCurrentCore]}" alt="혼돈 ${mobileCurrentCore} 코어">
                    <span>혼돈 ${mobileCurrentCore} 코어</span>
                </div>
                ${chaosHtml}
            `;

            const savedValue = savedSelections[mobileCurrentCore].coreIndex;

            if (savedValue) {
                const parsed = parseCoreValue(savedValue);

                if (parsed) {
                    const selectedName = parsed.group === "order"
                        ? orderArr[parsed.index]?.name
                        : chaosArr[parsed.index];

                    if (selectedName) {
                        coreSel.value = savedValue;
                        coreTrigger.innerHTML = buildCoreSelectedLabel(typeEmojis[mobileCurrentCore], savedValue, selectedName);
                    } else {
                        coreSel.value = "";
                        coreTrigger.textContent = `${typeEmojis[mobileCurrentCore]} ${mobileCurrentCore} 코어를 선택하세요`;
                    }
                } else {
                    coreSel.value = "";
                    coreTrigger.textContent = `${typeEmojis[mobileCurrentCore]} ${mobileCurrentCore} 코어를 선택하세요`;
                }
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
                    tab.innerHTML = typeEmojis[type];
                    tab.classList.remove("has-selection");
                });
                return;
            }

            const data = coreData[currentJob]?.[currentStyle];
            if (!data) return;

            tabs.forEach(tab => {
                const type = tab.dataset.core;
                const savedValue = savedSelections[type].coreIndex;
                const isActive = tab.classList.contains("active");

                if (savedValue) {
                    const parsed = parseCoreValue(savedValue);

                    if (!parsed) {
                        tab.innerHTML = typeEmojis[type];
                        tab.classList.remove("has-selection");
                        return;
                    }

                    const orderArr = data[type] || [];
                    const chaosArr = chaosNames[type] || [];

                    const selectedName = parsed.group === "order"
                        ? orderArr[parsed.index]?.name
                        : chaosArr[parsed.index];

                    if (!selectedName) {
                        tab.innerHTML = typeEmojis[type];
                        tab.classList.remove("has-selection");
                        return;
                    }

                    if (isActive) {
                        tab.innerHTML = buildCoreSelectedLabel(typeEmojis[type], savedValue, selectedName);
                    } else {
                        tab.innerHTML = `${typeEmojis[type]} <span class="core-badge">${parsed.index + 1}</span>`;
                    }

                    tab.classList.add("has-selection");
                } else {
                    tab.innerHTML = typeEmojis[type];
                    tab.classList.remove("has-selection");
                }
            });
        }

        function renderMobileCard(selectIndex) {
            if (!currentJob || !currentStyle) return;

            const slotLabel = mobileCurrentCore;
            const normalizedSlot = slotLabel === "해" ? "Hae" : slotLabel === "달" ? "Dal" : "Byeol";
            currentGrades[normalizedSlot] = mobileCurrentGrade;

            const selectedCore = getCoreDataByValue(slotLabel, selectIndex, mobileCurrentGrade);
            if (!selectedCore) return;

            updateAllTabLabels();

            const parsed = parseCoreValue(selectIndex);
            const coreNumber = parsed
                ? parsed.index + 1
                : (Number.isNaN(Number(selectIndex)) ? 1 : Number(selectIndex) + 1);

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

            const isChaos = selectedCore.chaos === true;

            const slotIcons = isChaos ? {
                "해": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_99.png",
                "달": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_100.png",
                "별": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_101.png"
            } : {
                "해": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_96.png",
                "달": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_97.png",
                "별": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_98.png"
            };

            const tiersHtml = getTierHtml(selectedCore.tiers, mobileCurrentGrade);

            const stickerHtml = selectedCore.chaos
                ? ""
                : `<div class="card-grade-sticker ${mobileCurrentGrade}">${coreNumber}</div>`;

            card.classList.remove("empty");
            card.innerHTML = `
                ${stickerHtml}
                <div class="card-title-row ${mobileCurrentGrade}">${gradeLabels[mobileCurrentGrade]}의 ${slotLabel} 코어 : ${selectedCore.name}</div>
                <div class="card-icon-row">
                    <div class="card-icon-box ${mobileCurrentGrade}"><img src="${slotIcons[slotLabel]}" alt="${slotLabel}코어"></div>
                    <span class="card-icon-label">${gradeLabels[mobileCurrentGrade]} 아크 그리드 코어</span>
                </div>
                <div class="card-basic-info">${selectedCore.chaos ? "공용 코어" : `${currentJob} 전용`}<br>획득 시 캐릭터 귀속</div>
                <div class="card-no-trade">거래 불가</div>
                <div class="card-section">
                    <div class="card-section-label">코어 타입</div>
                    <div class="card-section-value">${isChaos ? "혼돈" : "질서"} - ${slotLabel}</div>
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
                    <div class="card-passive-condition">${selectedCore.chaos ? "공용 코어" : `아크 패시브 : ${currentStyle} 습득`}</div>
                </div>
            `;
        }

        jobSel.addEventListener("change", () => {
            const thumb = document.getElementById("mobileJobThumb");
            const jobInfo = allJobs.find(j => j.name === jobSel.value);

            if (thumb) {
                if (jobInfo) {
                    thumb.innerHTML = `<img src="${THUMB}${jobInfo.file}" alt="${jobInfo.name}">`;
                } else {
                    thumb.innerHTML = `<span class="m-arc-job-placeholder">?</span>`;
                }
            }

            const jobName = jobSel.value;

            if (!jobName) {
                currentJob = null;
                currentStyle = null;

                const mobileTitle1 = document.getElementById("selectedJobTitle");
                if (mobileTitle1) mobileTitle1.textContent = "직업을 선택하세요";

                document.getElementById("styleToggleTabs").innerHTML = "";
                document.getElementById("mobileStyleSection").classList.remove("style-active");

                resetAllSelections();
                resetMobileCore();
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

        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                savedSelections[mobileCurrentCore].coreIndex = coreSel.value;
                savedSelections[mobileCurrentCore].grade = mobileCurrentGrade;

                tabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");

                mobileCurrentCore = tab.dataset.core;
                mobileCurrentGrade = savedSelections[mobileCurrentCore].grade;

                updateGradeButtons();
                fillMobileCoreSelect();

                const savedValue = savedSelections[mobileCurrentCore].coreIndex;
                coreSel.value = savedValue;

                if (savedValue !== "") {
                    renderMobileCard(savedValue);
                } else {
                    clearMobileCard();
                }

                updateAllTabLabels();
            });
        });

        coreTrigger.addEventListener("click", (e) => {
            e.stopPropagation();

            if (!currentJob || !currentStyle) return;
            if (coreMenu.children.length === 0) return;

            const isOpen = coreDropdown.classList.contains("open");
            closeMobileCoreMenu();

            if (!isOpen) {
                coreDropdown.classList.add("open");
            }
        });

        coreMenu.addEventListener("click", (e) => {
            const option = e.target.closest(".m-custom-core-option");
            if (!option) return;

            const val = option.dataset.value;
            const name = option.dataset.name;
            const icon = option.dataset.icon;

            coreSel.value = val;
            savedSelections[mobileCurrentCore].coreIndex = val;

            coreTrigger.innerHTML = buildCoreSelectedLabel(icon, val, name);

            closeMobileCoreMenu();
            renderMobileCard(val);
            updateAllTabLabels();
        });

        if (!document._arcMobileCoreMenuBound) {
            document.addEventListener("click", () => {
                closeMobileCoreMenu();
            });
            document._arcMobileCoreMenuBound = true;
        }

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
                    : (
                        document.getElementById("selectHae")?.value !== "" ||
                        document.getElementById("selectDal")?.value !== "" ||
                        document.getElementById("selectByeol")?.value !== ""
                    );

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

function removeZeroEffectSentence(str, grade) {
    if (grade !== "relic") return str;

    return str
        .split("\n")
        .map(line => {
            const parts = line.split(". ");

            const filtered = parts.filter(sentence => {
                const m = sentence.match(/(\d+(?:\.\d+)?)%(?:\s*추가로)?\s*(증가|감소)한다/);

                // 퍼센트 증가/감소 문장이 아니면 유지
                if (!m) return true;

                // 숫자가 정확히 0일 때만 제거
                return Number(m[1]) !== 0;
            });

            return filtered.join(". ");
        })
        .filter(line => line.trim() !== "")
        .join("\n")
        .trim();
}

    function fillSelect(id, type, arr) {
        const typeEmojis = { "해": "🌞", "달": "🌙", "별": "⭐" };
        const sel = document.getElementById(id);
        if (!sel) return;

        sel.innerHTML =
            `<option value="">${typeEmojis[type]} ${type} 코어를 선택하세요</option>` +
            arr.map((core, i) => `<option value="${i}">${typeEmojis[type]} [${i + 1}] ${core.name}</option>`).join("");
    }

    function parseCoreValue(value) {
        if (!value || typeof value !== "string") return null;

        const [group, indexStr] = value.split("-");
        const index = Number(indexStr);

        if (!group || Number.isNaN(index)) return null;

        return { group, index };
    }

    function getCoreDataByValue(type, value, grade) {
        const parsed = parseCoreValue(value);
        if (!parsed) return null;

        if (parsed.group === "order") {
            return coreData[currentJob]?.[currentStyle]?.[type]?.[parsed.index] || null;
        }

        if (parsed.group === "chaos") {
            return getChaosCore(type, parsed.index, grade);
        }

        return null;
    }

    function getCoreNameColorByValue(value) {
        const parsed = parseCoreValue(value);
        if (!parsed) return "#f87171";
        return parsed.group === "chaos" ? "#7dd3fc" : "#f87171";
    }

    function buildCoreSelectedLabel(icon, value, name) {
        const parsed = parseCoreValue(value);
        const badgeNum = parsed ? parsed.index + 1 : "";
        const color = getCoreNameColorByValue(value);
        return `${icon} <span class="core-badge">${badgeNum}</span> <span style="color:${color};">${name}</span>`;
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

                if (trigger.hasAttribute("disabled")) return;
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
                trigger.innerHTML = buildCoreSelectedLabel(cfg.icon, value, name);

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
            "해": {
                wrapId: "customHae",
                menuId: "menuHae",
                triggerId: "triggerHae",
                inputId: "selectHae",
                icon: "🌞",
                label: "🌞 해 코어를 선택하세요",
                orderImg: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_96.png",
                chaosImg: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_99.png"
            },
            "달": {
                wrapId: "customDal",
                menuId: "menuDal",
                triggerId: "triggerDal",
                inputId: "selectDal",
                icon: "🌙",
                label: "🌙 달 코어를 선택하세요",
                orderImg: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_97.png",
                chaosImg: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_100.png"
            },
            "별": {
                wrapId: "customByeol",
                menuId: "menuByeol",
                triggerId: "triggerByeol",
                inputId: "selectByeol",
                icon: "⭐",
                label: "⭐ 별 코어를 선택하세요",
                orderImg: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_98.png",
                chaosImg: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_101.png"
            }
        };

        const cfg = map[type];
        if (!cfg) return;

        const wrap = document.getElementById(cfg.wrapId);
        const menu = document.getElementById(cfg.menuId);
        const trigger = document.getElementById(cfg.triggerId);
        const hidden = document.getElementById(cfg.inputId);

        if (!wrap || !menu || !trigger || !hidden) return;

        const chaosArr = chaosNames[type] || [];

        const orderHtml = arr.map((core, i) => {
            const value = `order-${i}`;
            const activeClass = hidden.value === value ? " active" : "";
            return `
                <button type="button" class="custom-core-option${activeClass}" data-value="${value}" data-name="${core.name}">
                    <span class="custom-core-option-icon">${cfg.icon}</span>
                    <span class="core-badge">${i + 1}</span>
                    <span class="custom-core-option-name">${core.name}</span>
                </button>
            `;
        }).join("");

        const chaosHtml = chaosArr.map((name, i) => {
            const value = `chaos-${i}`;
            const activeClass = hidden.value === value ? " active" : "";
            return `
                <button type="button" class="custom-core-option${activeClass}" data-value="${value}" data-name="${name}">
                    <span class="custom-core-option-icon">${cfg.icon}</span>
                    <span class="core-badge">${i + 1}</span>
                    <span class="custom-core-option-name">${name}</span>
                </button>
            `;
        }).join("");

        menu.innerHTML = `
            <div class="custom-core-group-title">
                <img src="${cfg.orderImg}" alt="질서 ${type} 코어">
                <span>질서 ${type} 코어</span>
            </div>
            ${orderHtml}
            <div class="custom-core-group-title chaos">
                <img src="${cfg.chaosImg}" alt="혼돈 ${type} 코어">
                <span>혼돈 ${type} 코어</span>
            </div>
            ${chaosHtml}
        `;

        if (hidden.value) {
            const parsed = parseCoreValue(hidden.value);

            if (parsed) {
                const selectedName = parsed.group === "order"
                    ? arr[parsed.index]?.name
                    : chaosArr[parsed.index];

                if (selectedName) {
                    trigger.innerHTML = buildCoreSelectedLabel(cfg.icon, hidden.value, selectedName);
                } else {
                    hidden.value = "";
                    trigger.innerHTML = `<span class="custom-core-trigger-icon">${cfg.icon}</span> ${type} 코어를 선택하세요`;
                }
            } else {
                hidden.value = "";
                trigger.innerHTML = `<span class="custom-core-trigger-icon">${cfg.icon}</span> ${type} 코어를 선택하세요`;
            }
        } else {
            trigger.textContent = cfg.label;
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


    // n의 피해를 입힌다 / n의 피해를 준다 / n의 피해를 주고 = 노랑
    s = s.replace(
        /(\d{1,3}(?:,\d{3})*|\d+(?:\.\d+)?)(?=의\s*피해를\s*(?:입힌다|준다|주고))/g,
        m => save(`<span style="color:#F9D915;">${m}</span>`)
    );

    // 고정 피해 수치 노랑 (예: 1,416의 피해를 입힌다 / 152의 피해를 주고)
    s = s.replace(
        /(\d{1,3}(?:,\d{3})*|\d+(?:\.\d+)?)(?=의\s*피해를?\s*(?:입히|주))/g,
        m => save(`<span style="color:#F9D915;">${m}</span>`)
    );

    // 에너지/게이지/코어/구슬 생성 수치 노랑
    s = s.replace(
        /((?:게이지|에너지|코어|구슬)[^\n]*?)(\d+(?:\.\d+)?(?:%|개|중첩|만큼)?)(\s*)(생성)/g,
        (_, head, num, space, verb) => {
            return `${head}${save(`<span style="color:#F9D915;">${num}</span>`)}${space}${verb}`;
        }
    );

    // 정령의 구슬을 3개 소모 → 3만 노랑
    s = s.replace(
        /(정령의\s*구슬을\s*)(\d+)(개\s*소모)/g,
        (_, head, num, tail) => {
            return `${head}${save(`<span style="color:#F9D915;">${num}</span>`)}${tail}`;
        }
    );

    // 부위파괴 레벨이 1만큼 / 부위 파괴 레벨 1에 해당하는 → 숫자 노랑
    s = s.replace(
        /(부위\s*파괴\s*레벨(?:이|가)?\s*)(\d+)(?=(?:만큼|에\s*해당하는))/g,
        (_, head, num) => {
            return `${head}${save(`<span style="color:#F9D915;">${num}</span>`)}`;
        }
    );

    // n배 / n회 + 증가/감소
    s = s.replace(
        /(\d+(?:\.\d+)?(?:배|회))(\s*)(증가|감소)/g,
        (_, unit, space, verb) => {
            const color = verb === "감소" ? "#F2A1A1" : "#F9D915";
            return `${save(`<span style="color:${color};">${unit}</span>`)}${space}${verb}`;
        }
    );

    // standalone n배 / n회 노랑
    s = s.replace(
        /(\d+(?:\.\d+)?(?:배|회))/g,
        m => save(`<span style="color:#F9D915;">${m}</span>`)
    );


    // 생명력을 n 추가로 회복 = 노랑
    s = s.replace(
        /((?:생명력을\s*))(\d+(?:\.\d+)?)(\s*추가로\s*회복)/g,
        (_, head, num, tail) => {
            return `${head}${save(`<span style="color:#F9D915;">${num}</span>`)}${tail}`;
        }
    );


    // 고정 생명력 회복 수치 초록
    s = s.replace(
        /(\d+(?:\.\d+)?)(?=의\s*생명력을\s*회복)/g,
        m => save(`<span style="color:#80C342;">${m}</span>`)
    );

    // 부위 파괴 레벨 숫자 노랑
    s = s.replace(
        /(부위\s*파괴\s*레벨\s*)(\d+)/g,
        (_, head, num) => `${head}${save(`<span style="color:#F9D915;">${num}</span>`)}`
    );

    // n회 노랑
    s = s.replace(
        /(\d+(?:\.\d+)?회)/g,
        m => save(`<span style="color:#F9D915;">${m}</span>`)
    );

    // 공격/무기/생명/방어 고정 수치 증가 = 노랑
    s = s.replace(
        /((?:공격력|무기\s*공격력|체력|최대\s*생명력|물리\s*방어력|마법\s*방어력|물리\s*및\s*마법\s*방어력)[^\n]*?)(\d+(?:\.\d+)?)(\s*)(증가)/g,
        (_, head, num, space, verb) => {
            return `${head}${save(`<span style="color:#F9D915;">${num}</span>`)}${space}${verb}`;
        }
    );

    // 최대 마나 고정 수치 증가 = 초록
    s = s.replace(
        /((?:최대\s*마나가\s*))(\d+(?:\.\d+)?)(\s*)(증가)/g,
        (_, head, num, space, verb) => {
            return `${head}${save(`<span style="color:#80C342;">${num}</span>`)}${space}${verb}`;
        }
    );


        s = s.replace(/'운명[^']*'/g, m => save(`<span style="color:#D3B6E4;">${m}</span>`));

        s = s.replace(
            /((?:피해량|시전\s*속도|치명타(?:\s*적중률|\s*피해량)?|공격\s*속도|이동\s*속도|홀딩\s*속도|차지\s*속도)[^\n]*?)(\d+(?:\.\d+)?%)(\s*)(증가|감소)/g,
            (_, head, num, space, verb) => {
                const color = verb === "증가" ? "#80C342" : "#F2A1A1";
                return `${head}${save(`<span style="color:${color};">${num}</span>`)}${space}${verb}`;
            }
        );

        s = s.replace(
            /((?:재사용\s*대기시간)[^\n]*?)(\d+(?:\.\d+)?(?:초|%))(\s*)(증가|감소)/g,
            (_, head, num, space, verb) => {
                const color = verb === "감소" ? "#80C342" : "#F2A1A1";
                return `${head}${save(`<span style="color:${color};">${num}</span>`)}${space}${verb}`;
            }
        );

        s = s.replace(
            /((?:소모량)[^\n]*?)(\d+(?:\.\d+)?%)(\s*)(증가|감소)/g,
            (_, head, num, space, verb) => {
                const color = verb === "감소" ? "#80C342" : "#F2A1A1";
                return `${head}${save(`<span style="color:${color};">${num}</span>`)}${space}${verb}`;
            }
        );

        s = s.replace(
            /((?:게이지|회복량|획득량|보호막\s*수치|중첩\s*수|스택\s*수)[^\n]*?)(\d+(?:\.\d+)?%)(\s*)(증가|감소)/g,
            (_, head, num, space, verb) => {
                const color = verb === "증가" ? "#80C342" : "#F2A1A1";
                return `${head}${save(`<span style="color:${color};">${num}</span>`)}${space}${verb}`;
            }
        );

        s = s.replace(
            /((?:게이지|마나|에너지|구슬|코어|중첩)[^\n]*?)(\d+(?:\.\d+)?(?:%|개|중첩|만큼)?)(\s*)(획득|회복|변경)/g,
            (_, head, num, space, verb) => {
                return `${head}${save(`<span style="color:#80C342;">${num}</span>`)}${space}${verb}`;
            }
        );

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


        s = s.replace(
            /(\d+(?:\.\d+)?초)/g,
            m => save(`<span style="color:#F9D915;">${m}</span>`)
        );

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
const cleaned = removeZeroEffectSentence(parsed, grade);
const colored = colorizeText(cleaned);

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

    function getSlotActiveGrade(slotLabel) {
        const barIdMap = {
            "해": "barHae",
            "달": "barDal",
            "별": "barByeol"
        };

        const normalizedSlot = slotLabel === "해" ? "Hae" : slotLabel === "달" ? "Dal" : "Byeol";
        const fallback = currentGrades[normalizedSlot];

        const bar = document.getElementById(barIdMap[slotLabel]);
        if (!bar) return fallback;

        const activeBtn = bar.querySelector(".grade-btn.active");
        if (!activeBtn) return fallback;

        if (activeBtn.classList.contains("legendary")) return "legendary";
        if (activeBtn.classList.contains("ancient")) return "ancient";
        return "relic";
    }

    function renderCard(cardId, slotLabel, selectIndex) {
        const card = document.getElementById(cardId);
        if (!card) return;

        const normalizedSlot = slotLabel === "해" ? "Hae" : slotLabel === "달" ? "Dal" : "Byeol";
        const currentGrade = getSlotActiveGrade(slotLabel);
        currentGrades[normalizedSlot] = currentGrade;

        const selectedCore = getCoreDataByValue(slotLabel, selectIndex, currentGrade);
        if (!selectedCore) return;

        const parsed = parseCoreValue(selectIndex);
        const coreNumber = parsed
            ? parsed.index + 1
            : (Number.isNaN(Number(selectIndex)) ? 1 : Number(selectIndex) + 1);

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

        const isChaos = selectedCore.chaos === true;

        const slotIcons = isChaos ? {
            "해": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_99.png",
            "달": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_100.png",
            "별": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_101.png"
        } : {
            "해": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_96.png",
            "달": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_97.png",
            "별": "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_13_98.png"
        };

        const tiersHtml = getTierHtml(selectedCore.tiers, currentGrade);

        const stickerHtml = selectedCore.chaos
            ? ""
            : `<div class="card-grade-sticker ${currentGrade}">${coreNumber}</div>`;

        card.classList.remove("empty");
        card.innerHTML = `
            ${stickerHtml}
            <div class="card-title-row ${currentGrade}">${gradeLabels[currentGrade]}의 ${slotLabel} 코어 : ${selectedCore.name}</div>
            <div class="card-icon-row">
              <div class="card-icon-box ${currentGrade}"><img src="${slotIcons[slotLabel]}" alt="${slotLabel}코어"></div>
                <span class="card-icon-label">${gradeLabels[currentGrade]} 아크 그리드 코어</span>
            </div>
            <div class="card-basic-info">${selectedCore.chaos ? "공용 코어" : `${currentJob} 전용`}<br>획득 시 캐릭터 귀속</div>
            <div class="card-no-trade">거래 불가</div>
            <div class="card-section">
                <div class="card-section-label">코어 타입</div>
                <div class="card-section-value">${isChaos ? "혼돈" : "질서"} - ${slotLabel}</div>
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
                <div class="card-passive-condition">${selectedCore.chaos ? "공용 코어" : `아크 패시브 : ${currentStyle} 습득`}</div>
            </div>
        `;
    }

    return { init };
})();
