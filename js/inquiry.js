import { supabase } from "./supabase.js";

/* ============================================================
   Supabase
   ============================================================ */

/* ============================================================
   상태
   ============================================================ */
let selectedInquiryId = null;
let selectedInquiryPassword = "";
let isSubmittingInquiry = false;

/* ============================================================
   초기화
   ============================================================ */
function initInquiryBoard() {
  injectInquiryStyles();
  injectInquiryHtml();
  bindInquiryEvents();
  initFloatingInquiryButton();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initInquiryBoard);
} else {
  initInquiryBoard();
}

/* ============================================================
   경로 / 페이지 판별
   ============================================================ */
function normalizePathname(pathname) {
  let p = pathname || "/";
  p = p.replace(/\/index\.html$/, "/");
  p = p.replace(/\/index$/, "/");
  p = p.replace(/\.html$/, "");
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}

function isHomePage() {
  const p = normalizePathname(location.pathname);
  return p === "/";
}

/* ============================================================
   스타일
   ============================================================ */
function injectInquiryStyles() {
  if (document.getElementById("inquiry-board-style")) return;

  const style = document.createElement("style");
  style.id = "inquiry-board-style";
  style.textContent = `

  :root {
    --inq-bg: #14161f;
    --inq-surface: #1b1e29;
    --inq-surface-2: #21242f;
    --inq-border: rgba(255,255,255,.08);
    --inq-border-soft: rgba(255,255,255,.05);
    --inq-text: #f2f3f6;
    --inq-text-dim: rgba(242,243,246,.5);
    --inq-text-faint: rgba(242,243,246,.32);
    --inq-accent: #6e7bf2;
    --inq-accent-soft: rgba(110,123,242,.14);
    --inq-good: #57c98a;
    --inq-good-soft: rgba(87,201,138,.14);
    --inq-warn: #e0a45c;
    --inq-warn-soft: rgba(224,164,92,.14);
    --inq-bad: #e5807c;
    --inq-bad-soft: rgba(229,128,124,.14);
    --inq-radius: 12px;
    --inq-radius-sm: 8px;
  }

  .inquiry-fab-wrap {
    position: fixed;
    bottom: 36px;
    right: 20px;
    z-index: 9998;
    opacity: 0;
    transform: translateY(6px);
    transition: opacity .2s ease, transform .2s ease;
    pointer-events: none;
  }

  .inquiry-fab-wrap.show {
    pointer-events: auto;
  }

  .inquiry-fab {
    border: 1px solid var(--inq-border);
    border-radius: 999px;
    padding: 11px 16px;
    background: var(--inq-surface);
    color: var(--inq-text);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 6px 16px rgba(0,0,0,.24);
    display: inline-flex;
    align-items: center;
    gap: 7px;
    transition: border-color .15s ease, transform .15s ease;
  }

  .inquiry-fab:hover {
    border-color: rgba(110,123,242,.5);
    transform: translateY(-1px);
  }

  .inquiry-modal-overlay,
  .inq-popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(8,9,13,.7);
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .inquiry-modal-overlay.show,
  .inq-popup-overlay.show {
    display: flex;
  }

  .inquiry-modal {
    width: min(100%, 640px);
    max-height: 88vh;
    overflow: hidden;
    background: var(--inq-bg);
    border: 1px solid var(--inq-border);
    border-radius: 16px;
    box-shadow: 0 20px 50px rgba(0,0,0,.4);
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .inquiry-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    padding: 20px 22px 16px;
  }

  .inquiry-modal-title {
    margin: 0;
    color: var(--inq-text);
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .inquiry-modal-sub {
    margin-top: 5px;
    color: var(--inq-text-faint);
    font-size: 12px;
    line-height: 1.5;
  }

  .inquiry-modal-close {
    border: none;
    background: transparent;
    color: var(--inq-text-faint);
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    transition: color .15s ease, background .15s ease;
  }

  .inquiry-modal-close:hover {
    background: var(--inq-surface);
    color: var(--inq-text);
  }

  .inquiry-tabs {
    display: flex;
    gap: 4px;
    padding: 0 22px;
    border-bottom: 1px solid var(--inq-border-soft);
  }

  .inquiry-tab {
    border: none;
    background: transparent;
    color: var(--inq-text-faint);
    padding: 10px 4px;
    margin-right: 18px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: color .15s ease, border-color .15s ease;
  }

  .inquiry-tab.active {
    color: var(--inq-text);
    border-bottom-color: var(--inq-accent);
  }

  .inquiry-modal-body {
    padding: 18px 22px 22px;
    overflow-y: auto;
  }

  .inq-panel {
    display: none;
  }

  .inq-panel.show {
    display: block;
  }

  .loading-text,
  .inq-empty {
    padding: 40px 0;
    text-align: center;
    color: var(--inq-text-faint);
    font-size: 13px;
  }

  .inquiry-list {
    display: flex;
    flex-direction: column;
  }

  .inquiry-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 4px;
    border-bottom: 1px solid var(--inq-border-soft);
    cursor: pointer;
    transition: background .15s ease;
  }

  .inquiry-item:first-child {
    padding-top: 2px;
  }

  .inquiry-item:hover {
    background: var(--inq-surface);
  }

  .inq-no {
    flex-shrink: 0;
    width: 34px;
    color: var(--inq-text-faint);
    font-size: 12px;
    font-weight: 600;
  }

  .inq-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .inq-title-text {
    color: var(--inq-text);
    font-size: 14px;
    font-weight: 600;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }

  .inq-meta {
    display: flex;
    gap: 8px;
    align-items: center;
    color: var(--inq-text-faint);
    font-size: 11.5px;
    line-height: 1;
  }

  .inq-meta-lock {
    opacity: .6;
  }

  .inq-badge-type {
    color: var(--inq-text-dim);
  }

  .inq-meta-dot {
    width: 3px;
    height: 3px;
    border-radius: 999px;
    background: var(--inq-text-faint);
  }

  .inq-status {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
  }

  .inq-status::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 999px;
  }

  .inq-status-waiting {
    color: var(--inq-warn);
  }

  .inq-status-waiting::before {
    background: var(--inq-warn);
  }

  .inq-status-replied {
    color: var(--inq-good);
  }

  .inq-status-replied::before {
    background: var(--inq-good);
  }

  .inq-form-grid {
    display: grid;
    gap: 16px;
  }

  .inq-field-label {
    display: block;
    margin-bottom: 8px;
    color: var(--inq-text-dim);
    font-size: 12px;
    font-weight: 600;
  }

  .inq-input,
  .inq-select,
  .inq-textarea,
  .inq-edit-input,
  .inq-edit-select,
  .inq-edit-textarea,
  .inq-popup-input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--inq-border);
    background: var(--inq-surface);
    color: var(--inq-text);
    border-radius: var(--inq-radius-sm);
    outline: none;
    transition: border-color .15s ease;
    font-size: 13px;
    font-family: inherit;
  }

  .inq-input,
  .inq-select,
  .inq-edit-input,
  .inq-edit-select {
    height: 40px;
    padding: 0 12px;
  }

  .inq-textarea,
  .inq-edit-textarea {
    min-height: 140px;
    padding: 11px 12px;
    resize: vertical;
    line-height: 1.6;
  }

  .inq-input:focus,
  .inq-select:focus,
  .inq-textarea:focus,
  .inq-edit-input:focus,
  .inq-edit-select:focus,
  .inq-edit-textarea:focus,
  .inq-popup-input:focus {
    border-color: var(--inq-accent);
  }

  .inq-select option,
  .inq-edit-select option {
    background: #ffffff;
    color: #111827;
  }

  .inq-pw-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .inq-submit-btn,
  .inq-edit-save-btn {
    height: 42px;
    border: none;
    border-radius: var(--inq-radius-sm);
    background: var(--inq-accent);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity .15s ease;
  }

  .inq-submit-btn:hover,
  .inq-edit-save-btn:hover {
    opacity: .9;
  }

  .inq-submit-btn:disabled,
  .inq-edit-save-btn:disabled {
    opacity: .5;
    cursor: default;
  }

  .inquiry-read-card {
    border: 1px solid var(--inq-border-soft);
    border-radius: var(--inq-radius);
    background: var(--inq-surface);
    padding: 18px;
  }

  .inq-read-top {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    margin-bottom: 12px;
  }

  .inq-read-badges {
    display: flex;
    gap: 8px;
    align-items: center;
    color: var(--inq-text-dim);
    font-size: 12px;
    font-weight: 600;
  }

  .inq-read-date {
    color: var(--inq-text-faint);
    font-size: 11.5px;
  }

  .inq-read-title-wrap {
    display: flex;
    gap: 8px;
    align-items: baseline;
    margin-bottom: 14px;
  }

  .inq-read-id {
    color: var(--inq-text-faint);
    font-size: 12px;
    font-weight: 600;
  }

  .inq-read-title-text {
    color: var(--inq-text);
    font-size: 15px;
    font-weight: 700;
  }

  .inq-read-content {
    color: var(--inq-text-dim);
    font-size: 13px;
    line-height: 1.75;
    white-space: pre-wrap;
    margin-bottom: 16px;
  }

  .inq-reply-section {
    margin-bottom: 16px;
    padding: 14px;
    border-radius: var(--inq-radius-sm);
    background: var(--inq-good-soft);
  }

  .inq-reply-label {
    color: var(--inq-good);
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .inq-reply-text {
    color: var(--inq-text);
    font-size: 13px;
    line-height: 1.7;
    white-space: pre-wrap;
  }

  .inq-reply-date {
    margin-top: 8px;
    color: var(--inq-text-faint);
    font-size: 11px;
  }

  .inq-no-reply {
    margin-bottom: 16px;
    padding: 12px 14px;
    border-radius: var(--inq-radius-sm);
    background: var(--inq-warn-soft);
    color: var(--inq-warn);
    font-size: 12px;
    font-weight: 600;
  }

  .inq-edit-field {
    margin-bottom: 12px;
  }

  .inq-edit-field-label {
    margin-bottom: 8px;
    color: var(--inq-text-dim);
    font-size: 12px;
    font-weight: 600;
  }

  .inq-edit-save-btn {
    width: 100%;
    margin-top: 4px;
  }

  .inq-bottom-actions {
    display: flex;
    gap: 8px;
    margin-top: 14px;
  }

  .inq-delete-btn,
  .inq-read-close-btn {
    height: 40px;
    border: 1px solid var(--inq-border);
    border-radius: var(--inq-radius-sm);
    background: transparent;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    flex: 1;
    transition: background .15s ease;
  }

  .inq-delete-btn {
    color: var(--inq-bad);
  }

  .inq-delete-btn:hover {
    background: var(--inq-bad-soft);
  }

  .inq-read-close-btn {
    color: var(--inq-text-dim);
  }

  .inq-read-close-btn:hover {
    background: var(--inq-surface-2);
  }

  .inq-popup {
    width: min(100%, 340px);
    background: var(--inq-bg);
    border: 1px solid var(--inq-border);
    border-radius: 14px;
    box-shadow: 0 20px 50px rgba(0,0,0,.4);
    padding: 20px;
    text-align: left;
  }

  .inq-popup-title {
    color: var(--inq-text);
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .inq-popup-desc {
    color: var(--inq-text-faint);
    font-size: 12px;
    line-height: 1.6;
    margin-bottom: 14px;
  }

  .inq-popup-input {
    height: 40px;
    margin-bottom: 12px;
  }

  .inq-popup-actions {
    display: flex;
    gap: 8px;
  }

  .inq-popup-btn {
    height: 40px;
    border: none;
    border-radius: var(--inq-radius-sm);
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    flex: 1;
    transition: opacity .15s ease, background .15s ease;
  }

  .inq-popup-btn.cancel {
    background: var(--inq-surface);
    color: var(--inq-text-dim);
    border: 1px solid var(--inq-border);
  }

  .inq-popup-btn.cancel:hover {
    background: var(--inq-surface-2);
  }

  .inq-popup-btn.confirm {
    background: var(--inq-accent);
    color: #fff;
  }

  .inq-popup-btn.confirm:hover {
    opacity: .9;
  }

  @media (max-width: 768px) {
    .inquiry-fab-wrap {
      right: 14px !important;
      bottom: 66px;
    }

    .inquiry-fab {
      padding: 10px 14px;
      font-size: 12px;
    }

    .inquiry-modal {
      width: 100%;
      max-height: 92vh;
    }

    .inquiry-modal-header {
      padding: 18px 16px 14px;
    }

    .inquiry-tabs {
      padding: 0 16px;
    }

    .inquiry-modal-body {
      padding: 16px 16px 20px;
    }

    .inq-pw-grid {
      grid-template-columns: 1fr;
    }

    .inq-bottom-actions {
      flex-direction: column;
    }
  }
  `;
  document.head.appendChild(style);
}

/* ============================================================
   HTML
   ============================================================ */
function injectInquiryHtml() {
  if (!document.getElementById("inquiryFabWrap")) {
    const wrap = document.createElement("div");
    wrap.id = "inquiryFabWrap";
    wrap.className = "inquiry-fab-wrap";
    wrap.innerHTML = `
      <button id="openInquiryBtn" class="inquiry-fab" type="button">
        <span>💬</span><span>간편문의</span>
      </button>
    `;
    document.body.appendChild(wrap);
  }

  if (!document.getElementById("inquiryModal")) {
    const modal = document.createElement("div");
    modal.id = "inquiryModal";
    modal.className = "inquiry-modal-overlay";
    modal.innerHTML = `
      <div class="inquiry-modal">
        <div class="inquiry-modal-header">
          <div>
            <h2 class="inquiry-modal-title">간편문의</h2>
            <div class="inquiry-modal-sub">문의 등록·확인·수정·삭제를 이곳에서 바로 할 수 있습니다.</div>
          </div>
          <button type="button" class="inquiry-modal-close" id="closeInquiryBtn">✕</button>
        </div>

        <div class="inquiry-tabs">
          <button type="button" class="inquiry-tab active" data-tab="list">문의 목록</button>
          <button type="button" class="inquiry-tab" data-tab="write">문의 작성</button>
        </div>

        <div class="inquiry-modal-body">
          <div id="inquiryListPanel" class="inq-panel show">
            <div id="inquiryListContent" class="loading-text">불러오는 중...</div>
          </div>

          <div id="inquiryWritePanel" class="inq-panel">
            <div class="inq-form-grid">
              <div>
                <label class="inq-field-label" for="inqType">문의 유형</label>
                <select id="inqType" class="inq-select">
                  <option value="오류제보">오류제보</option>
                  <option value="질문하기">질문하기</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div>
                <label class="inq-field-label" for="inqTitle">제목</label>
                <input id="inqTitle" class="inq-input" type="text" maxlength="120" placeholder="문의 제목을 입력해주세요">
              </div>

              <div>
                <label class="inq-field-label" for="inqContent">내용</label>
                <textarea id="inqContent" class="inq-textarea" maxlength="2000" placeholder="문의 내용을 입력해주세요"></textarea>
              </div>

              <div class="inq-pw-grid">
                <div>
                  <label class="inq-field-label" for="inqPw1">비밀번호 (4~8자리)</label>
                  <input id="inqPw1" class="inq-input" type="password" maxlength="8" placeholder="비밀번호 입력">
                </div>
                <div>
                  <label class="inq-field-label" for="inqPw2">비밀번호 확인</label>
                  <input id="inqPw2" class="inq-input" type="password" maxlength="8" placeholder="비밀번호 다시 입력">
                </div>
              </div>

              <button type="button" id="inqSubmitBtn" class="inq-submit-btn">문의 등록하기</button>
            </div>
          </div>

          <div id="inquiryReadResult" style="display:none; margin-top:14px;"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  if (!document.getElementById("inqPwPopup")) {
    const popup = document.createElement("div");
    popup.id = "inqPwPopup";
    popup.className = "inq-popup-overlay";
    popup.innerHTML = `
      <div class="inq-popup">
        <div class="inq-popup-title">비밀번호 확인</div>
        <div class="inq-popup-desc">비밀글을 열람하려면 작성 시 입력한 비밀번호를 입력해주세요.</div>
        <input id="inqPwPopupInput" class="inq-popup-input" type="password" maxlength="8" placeholder="비밀번호 입력">
        <div class="inq-popup-actions">
          <button type="button" class="inq-popup-btn cancel" id="inqPwPopupCancel">취소</button>
          <button type="button" class="inq-popup-btn confirm" id="inqPwPopupConfirm">확인</button>
        </div>
      </div>
    `;
    document.body.appendChild(popup);
  }
}

/* ============================================================
   플로팅 버튼 동작
   ============================================================ */
function initFloatingInquiryButton() {
  const wrap = document.getElementById("inquiryFabWrap");
  if (!wrap) return;

  const apply = () => {
    updateFloatingInquiryVisibility();
    syncFloatingInquiryPosition();
  };

  apply();

  window.addEventListener("scroll", apply, { passive: true });
  window.addEventListener("resize", apply);
}

function updateFloatingInquiryVisibility() {
  const wrap = document.getElementById("inquiryFabWrap");
  if (!wrap) return;

  if (!isHomePage()) {
    wrap.style.display = "none";
    return;
  }

  wrap.style.display = "block";
  wrap.classList.add("show");

  const y = Math.max(0, window.scrollY || window.pageYOffset || 0);
  const progress = Math.min(y / 500, 1);
  const opacity = 0.28 + (0.72 * progress);
  const offsetY = 6 - (6 * progress);

  wrap.style.opacity = String(opacity);
  wrap.style.transform = `translateY(${offsetY}px)`;
}

function syncFloatingInquiryPosition() {
  const wrap = document.getElementById("inquiryFabWrap");
  if (!wrap) return;

  if (window.innerWidth <= 768) {
    wrap.style.right = "14px";
    return;
  }

  const anchor =
    document.querySelector(".hero-inner") ||
    document.querySelector(".quickmenu .qm-row") ||
    document.querySelector(".gnb-shell") ||
    document.querySelector(".page");

  if (!anchor) {
    wrap.style.right = "18px";
    return;
  }

  const rect = anchor.getBoundingClientRect();
  const rightGap = Math.max(18, Math.round(window.innerWidth - rect.right)) + 8;
  wrap.style.right = `${rightGap}px`;
}

/* ============================================================
   이벤트 바인딩
   ============================================================ */
function bindInquiryEvents() {
  const inquiryModal = document.getElementById("inquiryModal");
  const openInquiryBtn = document.getElementById("openInquiryBtn");
  const closeInquiryBtn = document.getElementById("closeInquiryBtn");
  const inquiryListPanel = document.getElementById("inquiryListPanel");
  const inquiryWritePanel = document.getElementById("inquiryWritePanel");
  const inquiryReadResult = document.getElementById("inquiryReadResult");
  const inquiryListContent = document.getElementById("inquiryListContent");
  const inqSubmitBtn = document.getElementById("inqSubmitBtn");

  const inqPwPopup = document.getElementById("inqPwPopup");
  const inqPwPopupInput = document.getElementById("inqPwPopupInput");
  const inqPwPopupCancel = document.getElementById("inqPwPopupCancel");
  const inqPwPopupConfirm = document.getElementById("inqPwPopupConfirm");

  if (
    !inquiryModal ||
    !openInquiryBtn ||
    !closeInquiryBtn ||
    !inquiryListPanel ||
    !inquiryWritePanel ||
    !inquiryReadResult ||
    !inquiryListContent ||
    !inqSubmitBtn ||
    !inqPwPopup ||
    !inqPwPopupInput ||
    !inqPwPopupCancel ||
    !inqPwPopupConfirm
  ) return;

  openInquiryBtn.addEventListener("click", () => {
    inquiryModal.classList.add("show");
    document.body.style.overflow = "hidden";
    switchInquiryTab("list");
    loadInquiryList();
  });

  closeInquiryBtn.addEventListener("click", closeInquiryModal);

  inquiryModal.addEventListener("click", (e) => {
    if (e.target === inquiryModal) closeInquiryModal();
  });

  inqPwPopupCancel.addEventListener("click", () => {
    closePasswordPopup(true);
  });

  inqPwPopup.addEventListener("click", (e) => {
    if (e.target === inqPwPopup) {
      closePasswordPopup(true);
    }
  });

  document.querySelectorAll(".inquiry-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      switchInquiryTab(tab.dataset.tab);
    });
  });

  inquiryListContent.addEventListener("click", function(e) {
    const item = e.target.closest(".inquiry-item");
    if (!item) return;

    selectedInquiryId = Number(item.dataset.inquiryId);
    inqPwPopupInput.value = "";
    inqPwPopup.classList.add("show");

    setTimeout(() => {
      inqPwPopupInput.focus();
    }, 20);
  });

  inqPwPopupConfirm.addEventListener("click", openInquiryWithPassword);

  inqPwPopupInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") openInquiryWithPassword();
  });

  inqSubmitBtn.addEventListener("click", submitInquiry);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePasswordPopup(true);
      closeInquiryModal();
    }
  });

  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open-inquiry]");
    if (!opener) return;
    e.preventDefault();
    inquiryModal.classList.add("show");
    document.body.style.overflow = "hidden";
    switchInquiryTab("list");
    loadInquiryList();
  });
}

/* ============================================================
   모달 제어
   ============================================================ */
function closeInquiryModal() {
  const inquiryModal = document.getElementById("inquiryModal");
  const inquiryReadResult = document.getElementById("inquiryReadResult");

  if (inquiryModal) inquiryModal.classList.remove("show");
  if (inquiryReadResult) inquiryReadResult.style.display = "none";

  document.body.style.overflow = "";
  selectedInquiryPassword = "";
  closePasswordPopup(true);
}

function closePasswordPopup(resetSelection = false) {
  const inqPwPopup = document.getElementById("inqPwPopup");
  const inqPwPopupInput = document.getElementById("inqPwPopupInput");

  if (inqPwPopup) inqPwPopup.classList.remove("show");
  if (inqPwPopupInput) inqPwPopupInput.value = "";

  if (resetSelection) {
    selectedInquiryId = null;
  }
}

function switchInquiryTab(tabName) {
  const inquiryListPanel = document.getElementById("inquiryListPanel");
  const inquiryWritePanel = document.getElementById("inquiryWritePanel");
  const inquiryReadResult = document.getElementById("inquiryReadResult");

  document.querySelectorAll(".inquiry-tab").forEach((t) => t.classList.remove("active"));
  const targetTab = document.querySelector(`.inquiry-tab[data-tab="${tabName}"]`);
  if (targetTab) targetTab.classList.add("active");

  if (inquiryListPanel) inquiryListPanel.classList.toggle("show", tabName === "list");
  if (inquiryWritePanel) inquiryWritePanel.classList.toggle("show", tabName === "write");
  if (inquiryReadResult) inquiryReadResult.style.display = "none";
}

/* ============================================================
   문의 목록
   ============================================================ */
async function loadInquiryList() {
  const inquiryListContent = document.getElementById("inquiryListContent");
  if (!inquiryListContent) return;

  inquiryListContent.innerHTML = '<div class="loading-text">불러오는 중...</div>';

  const result = await supabase.rpc("list_inquiries");

  if (result.error || !result.data || result.data.length === 0) {
    inquiryListContent.innerHTML = '<div class="inq-empty">아직 문의가 없습니다</div>';
    return;
  }

  let html = '<div class="inquiry-list">';

  result.data.forEach((row) => {
    const dateStr = new Date(row.created_at).toLocaleDateString("ko-KR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit"
    });

    const statusClass = row.status === "답변완료" ? "inq-status-replied" : "inq-status-waiting";

    html +=
      '<div class="inquiry-item" data-inquiry-id="' + row.id + '">' +
        '<div class="inq-no">#' + row.id + '</div>' +
        '<div class="inq-info">' +
          '<div class="inq-title-text">' + escapeHtml(row.title) + '</div>' +
          '<div class="inq-meta">' +
            '<span class="inq-meta-lock">🔒</span>' +
            '<span class="inq-badge-type">' + escapeHtml(row.inquiry_type) + '</span>' +
            '<span class="inq-meta-dot"></span>' +
            '<span>' + dateStr + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="inq-status ' + statusClass + '">' + escapeHtml(row.status) + '</div>' +
      '</div>';
  });

  html += '</div>';
  inquiryListContent.innerHTML = html;
}

/* ============================================================
   문의 열람
   ============================================================ */
async function openInquiryWithPassword() {
  const inqPwPopup = document.getElementById("inqPwPopup");
  const inqPwPopupInput = document.getElementById("inqPwPopupInput");
  const inquiryReadResult = document.getElementById("inquiryReadResult");
  if (!inqPwPopupInput || !inquiryReadResult || !inqPwPopup) return;

  const pw = inqPwPopupInput.value.trim();

  if (!selectedInquiryId || !pw) {
    alert("비밀번호를 입력해 주세요.");
    return;
  }

  const result = await supabase.rpc("read_inquiry", {
    p_id: selectedInquiryId,
    p_password: pw
  });

  if (result.error || !result.data || result.data.length === 0) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  const row = result.data[0];

  const dateStr = new Date(row.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });

  const canEdit = row.status !== "답변완료";

  let statusHTML = "";
  if (row.status === "답변완료" && row.admin_reply) {
    const replyDate = new Date(row.replied_at).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });

    statusHTML =
      '<div class="inq-reply-section">' +
        '<div class="inq-reply-label">관리자 답변</div>' +
        '<div class="inq-reply-text">' + nl2br(escapeHtml(row.admin_reply)) + '</div>' +
        '<div class="inq-reply-date">' + replyDate + '</div>' +
      '</div>';
  } else {
    statusHTML = '<div class="inq-no-reply">아직 답변이 등록되지 않았습니다</div>';
  }

  selectedInquiryPassword = pw;

  if (canEdit) {
    inquiryReadResult.innerHTML =
      '<div class="inquiry-read-card">' +
        statusHTML +
        '<div class="inq-edit-field" style="margin-top:12px;">' +
          '<div class="inq-edit-field-label">문의 유형</div>' +
          '<select class="inq-edit-select" id="inqEditType">' +
            '<option value="오류제보"' + (row.inquiry_type === "오류제보" ? " selected" : "") + '>오류제보</option>' +
            '<option value="질문하기"' + (row.inquiry_type === "질문하기" ? " selected" : "") + '>질문하기</option>' +
            '<option value="기타"' + (row.inquiry_type === "기타" ? " selected" : "") + '>기타</option>' +
          '</select>' +
        '</div>' +
        '<div class="inq-edit-field">' +
          '<div class="inq-edit-field-label">제목</div>' +
          '<input class="inq-edit-input" type="text" id="inqEditTitle" value="' + escapeAttr(row.title) + '" />' +
        '</div>' +
        '<div class="inq-edit-field">' +
          '<div class="inq-edit-field-label">내용</div>' +
          '<textarea class="inq-edit-textarea" id="inqEditContent">' + escapeHtml(row.content) + '</textarea>' +
        '</div>' +
        '<button class="inq-edit-save-btn" id="inqEditSaveBtn">수정 저장</button>' +
        '<div class="inq-bottom-actions">' +
          '<button class="inq-delete-btn" id="inqDeleteBtn">삭제하기</button>' +
          '<button class="inq-read-close-btn" id="inqReadCloseBtn">닫기</button>' +
        '</div>' +
      '</div>';
  } else {
    inquiryReadResult.innerHTML =
      '<div class="inquiry-read-card">' +
        statusHTML +
        '<div class="inq-read-top" style="margin-top:12px;">' +
          '<div class="inq-read-badges">' +
            '<span>🔒 비밀글</span>' +
            '<span class="inq-meta-dot"></span>' +
            '<span>' + escapeHtml(row.inquiry_type) + '</span>' +
          '</div>' +
          '<div class="inq-read-date">' + dateStr + '</div>' +
        '</div>' +
        '<div class="inq-read-title-wrap">' +
          '<div class="inq-read-id">#' + row.id + '</div>' +
          '<div class="inq-read-title-text">' + escapeHtml(row.title) + '</div>' +
        '</div>' +
        '<div class="inq-read-content">' + nl2br(escapeHtml(row.content)) + '</div>' +
        '<button class="inq-read-close-btn" id="inqReadCloseBtn" style="width:100%;">닫기</button>' +
      '</div>';
  }

  inquiryReadResult.style.display = "block";

  inqPwPopup.classList.remove("show");
  inqPwPopupInput.value = "";
  selectedInquiryId = null;

  document.getElementById("inqReadCloseBtn")?.addEventListener("click", function() {
    inquiryReadResult.style.display = "none";
    selectedInquiryPassword = "";
  });

  const inqDeleteBtn = document.getElementById("inqDeleteBtn");
  if (inqDeleteBtn && canEdit) {
    inqDeleteBtn.addEventListener("click", async function() {
      if (!confirm("정말 이 문의를 삭제하시겠습니까?\n삭제 후 복구할 수 없습니다.")) return;

      inqDeleteBtn.disabled = true;
      inqDeleteBtn.textContent = "삭제 중...";

      const deleteResult = await supabase.rpc("delete_inquiry", {
        p_id: row.id,
        p_password: selectedInquiryPassword
      });

      if (deleteResult.error || deleteResult.data === false) {
        alert("삭제 실패: 비밀번호가 일치하지 않거나 이미 답변된 글입니다.");
        inqDeleteBtn.disabled = false;
        inqDeleteBtn.textContent = "삭제하기";
        return;
      }

      alert("문의가 삭제되었습니다.");
      inquiryReadResult.style.display = "none";
      selectedInquiryPassword = "";
      loadInquiryList();
    });
  }

  const inqEditSaveBtn = document.getElementById("inqEditSaveBtn");
  if (inqEditSaveBtn && canEdit) {
    inqEditSaveBtn.addEventListener("click", async function() {
      const newType = document.getElementById("inqEditType").value;
      const newTitle = document.getElementById("inqEditTitle").value.trim();
      const newContent = document.getElementById("inqEditContent").value.trim();

      if (!newTitle) {
        alert("제목을 입력해 주세요.");
        return;
      }
      if (!newContent) {
        alert("내용을 입력해 주세요.");
        return;
      }

      inqEditSaveBtn.disabled = true;
      inqEditSaveBtn.textContent = "저장 중...";

      const updateResult = await supabase.rpc("update_inquiry_content", {
        p_id: row.id,
        p_password: selectedInquiryPassword,
        p_type: newType,
        p_title: newTitle,
        p_content: newContent
      });

      if (updateResult.error || updateResult.data === false) {
        alert("수정 실패: 비밀번호가 일치하지 않거나 이미 답변된 글입니다.");
        inqEditSaveBtn.disabled = false;
        inqEditSaveBtn.textContent = "수정 저장";
        return;
      }

      alert("내용이 수정되었습니다.");
      inquiryReadResult.style.display = "none";
      selectedInquiryPassword = "";
      loadInquiryList();
    });
  }
}

/* ============================================================
   문의 등록
   ============================================================ */
async function submitInquiry() {
  if (isSubmittingInquiry) return;

  const type = document.getElementById("inqType")?.value;
  const title = document.getElementById("inqTitle")?.value.trim();
  const content = document.getElementById("inqContent")?.value.trim();
  const pw1 = document.getElementById("inqPw1")?.value;
  const pw2 = document.getElementById("inqPw2")?.value;
  const inqSubmitBtn = document.getElementById("inqSubmitBtn");

  if (!title) {
    alert("제목을 입력해 주세요.");
    return;
  }

  if (!content) {
    alert("내용을 입력해 주세요.");
    return;
  }

  if (!pw1 || pw1.length < 4 || pw1.length > 8) {
    alert("비밀번호는 4~8자리로 입력해 주세요.");
    return;
  }

  if (pw1 !== pw2) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  isSubmittingInquiry = true;
  if (inqSubmitBtn) {
    inqSubmitBtn.disabled = true;
    inqSubmitBtn.textContent = "등록 중...";
  }

  const result = await supabase.rpc("create_inquiry", {
    p_type: type,
    p_title: title,
    p_content: content,
    p_password: pw1
  });

  if (result.error) {
    alert("문의 등록 실패: " + result.error.message);
    isSubmittingInquiry = false;
    if (inqSubmitBtn) {
      inqSubmitBtn.disabled = false;
      inqSubmitBtn.textContent = "문의 등록하기";
    }
    return;
  }

  const newId = result.data;

  alert(
    "문의가 등록되었습니다!\n\n" +
    "문의 번호: #" + newId + "\n" +
    "이 번호와 비밀번호로 나중에 답변을 확인할 수 있습니다."
  );

  document.getElementById("inqTitle").value = "";
  document.getElementById("inqContent").value = "";
  document.getElementById("inqPw1").value = "";
  document.getElementById("inqPw2").value = "";

  isSubmittingInquiry = false;
  if (inqSubmitBtn) {
    inqSubmitBtn.disabled = false;
    inqSubmitBtn.textContent = "문의 등록하기";
  }

  switchInquiryTab("list");
  loadInquiryList();
}

/* ============================================================
   유틸
   ============================================================ */
function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, "&quot;");
}

function nl2br(str) {
  return String(str ?? "").replace(/\n/g, "<br>");
}

/* ============================================================
   외부에서 열기
   ============================================================ */
window.openInquiryModal = function() {
  const inquiryModal = document.getElementById("inquiryModal");
  if (!inquiryModal) return;
  inquiryModal.classList.add("show");
  document.body.style.overflow = "hidden";
  switchInquiryTab("list");
  loadInquiryList();
};