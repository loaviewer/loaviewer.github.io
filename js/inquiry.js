import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* ============================================================
   Supabase
   ============================================================ */
const SUPABASE_URL = "https://khszfukekudyripouifm.supabase.co";
const SUPABASE_KEY = "sb_publishable_XjCVKOZRq1aERqzOGj_tHw_eC4uCXEb";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ============================================================
   상태
   ============================================================ */
let selectedInquiryId = null;
let selectedInquiryPassword = "";
let isSubmittingInquiry = false;

const INQUIRY_GUIDE_SEEN_KEY = "loa_inquiry_guide_seen_v1";
const INQUIRY_GUIDE_HIDE_MS = 10000;

/* ============================================================
   초기화
   ============================================================ */
function initInquiryBoard() {
  injectInquiryStyles();
  injectInquiryHtml();
  bindInquiryEvents();
  setupInquiryFirstGuide();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initInquiryBoard);
} else {
  initInquiryBoard();
}

/* ============================================================
   스타일
   ============================================================ */
function injectInquiryStyles() {
  if (document.getElementById("inquiry-board-style")) return;

  const style = document.createElement("style");
  style.id = "inquiry-board-style";
  style.textContent = `
    .inquiry-fab-wrap {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 9998;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
      transition: opacity .22s ease, transform .22s ease;
    }

    .inquiry-fab {
      border: none;
      border-radius: 999px;
      padding: 12px 16px;
      background: linear-gradient(135deg, #5b6cff, #7f8cff);
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 10px 24px rgba(0,0,0,.28);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: transform .18s ease, box-shadow .18s ease, opacity .22s ease;
    }

    .inquiry-fab:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 30px rgba(0,0,0,.34);
    }

    .inquiry-fab-guide {
      max-width: 220px;
      padding: 8px 10px;
      border-radius: 10px;
      background: rgba(20, 26, 40, 0.92);
      border: 1px solid rgba(255,255,255,.08);
      color: rgba(255,255,255,.72);
      font-size: 11px;
      line-height: 1.45;
      box-shadow: 0 10px 24px rgba(0,0,0,.22);
      text-align: right;
      white-space: normal;
      transition: opacity .22s ease, transform .22s ease;
    }

    .inquiry-fab-wrap.is-hiding .inquiry-fab-guide,
    .inquiry-fab-wrap.is-hiding .inquiry-fab {
      opacity: 0;
      transform: translateY(8px);
      pointer-events: none;
    }

    .inquiry-modal-overlay,
    .inq-popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.72);
      backdrop-filter: blur(4px);
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
      width: min(100%, 760px);
      max-height: 90vh;
      overflow: hidden;
      background: #161c2b;
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 16px;
      box-shadow: 0 24px 60px rgba(0,0,0,.45);
      display: flex;
      flex-direction: column;
    }

    .inquiry-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 18px 20px 14px;
      border-bottom: 1px solid rgba(255,255,255,.06);
    }

    .inquiry-modal-title {
      margin: 0;
      color: #fff;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .inquiry-modal-sub {
      margin-top: 6px;
      color: rgba(255,255,255,.45);
      font-size: 12px;
      line-height: 1.5;
    }

    .inquiry-modal-close {
      border: none;
      background: transparent;
      color: rgba(255,255,255,.5);
      font-size: 20px;
      cursor: pointer;
      padding: 6px 8px;
      border-radius: 8px;
    }

    .inquiry-modal-close:hover {
      background: rgba(255,255,255,.06);
      color: #fff;
    }

    .inquiry-tabs {
      display: flex;
      gap: 8px;
      padding: 14px 20px 0;
    }

    .inquiry-tab {
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(255,255,255,.03);
      color: rgba(255,255,255,.6);
      border-radius: 10px 10px 0 0;
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }

    .inquiry-tab.active {
      background: rgba(127,140,255,.12);
      color: #fff;
      border-color: rgba(127,140,255,.45);
    }

    .inquiry-modal-body {
      padding: 16px 20px 20px;
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
      padding: 18px 0;
      text-align: center;
      color: rgba(255,255,255,.42);
      font-size: 13px;
    }

    .inquiry-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .inquiry-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px;
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 12px;
      background: rgba(255,255,255,.025);
      cursor: pointer;
      transition: border-color .18s ease, background .18s ease, transform .18s ease;
    }

    .inquiry-item:hover {
      border-color: rgba(127,140,255,.35);
      background: rgba(255,255,255,.04);
      transform: translateY(-1px);
    }

    .inq-no {
      min-width: 52px;
      color: rgba(255,255,255,.4);
      font-size: 12px;
      font-weight: 700;
    }

    .inq-info {
      flex: 1;
      min-width: 0;
    }

    .inq-title-text {
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 6px;
      word-break: break-word;
    }

    .inq-meta {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      color: rgba(255,255,255,.42);
      font-size: 11px;
    }

    .inq-badge-secret,
    .inq-badge-type {
      display: inline-flex;
      align-items: center;
      height: 22px;
      padding: 0 8px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
    }

    .inq-badge-secret {
      background: rgba(255,255,255,.08);
      color: rgba(255,255,255,.7);
    }

    .inq-badge-type {
      background: rgba(127,140,255,.12);
      color: #b9c4ff;
    }

    .inq-status {
      flex-shrink: 0;
      min-width: 74px;
      text-align: center;
      padding: 8px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 800;
    }

    .inq-status-waiting {
      background: rgba(255,176,96,.12);
      color: #ffb060;
    }

    .inq-status-replied {
      background: rgba(126,255,174,.12);
      color: #7effae;
    }

    .inq-form-grid {
      display: grid;
      gap: 14px;
    }

    .inq-field-label {
      display: block;
      margin-bottom: 8px;
      color: rgba(255,255,255,.78);
      font-size: 12px;
      font-weight: 700;
    }

    .inq-input,
    .inq-select,
    .inq-textarea {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(255,255,255,.03);
      color: #fff;
      border-radius: 10px;
      outline: none;
      transition: border-color .18s ease, background .18s ease;
      font-size: 13px;
    }

    .inq-input,
    .inq-select {
      height: 42px;
      padding: 0 12px;
    }

    .inq-textarea {
      min-height: 160px;
      padding: 12px;
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
      border-color: rgba(127,140,255,.8);
      background: rgba(255,255,255,.05);
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

    .inq-submit-btn {
      height: 44px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, #5b6cff, #7f8cff);
      color: #fff;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      transition: transform .18s ease, opacity .18s ease;
    }

    .inq-submit-btn:hover {
      transform: translateY(-1px);
    }

    .inq-submit-btn:disabled {
      opacity: .6;
      cursor: default;
      transform: none;
    }

    .inquiry-read-card {
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 14px;
      background: rgba(255,255,255,.025);
      padding: 16px;
    }

    .inq-read-top {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .inq-read-badges {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .inq-read-date {
      color: rgba(255,255,255,.38);
      font-size: 11px;
    }

    .inq-read-title-wrap {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }

    .inq-read-id {
      color: rgba(255,255,255,.42);
      font-size: 12px;
      font-weight: 700;
    }

    .inq-read-title-text {
      color: #fff;
      font-size: 16px;
      font-weight: 800;
    }

    .inq-read-content {
      color: rgba(255,255,255,.78);
      font-size: 13px;
      line-height: 1.8;
      white-space: pre-wrap;
      margin-bottom: 14px;
    }

    .inq-reply-section {
      margin-bottom: 14px;
      padding: 14px;
      border-radius: 12px;
      background: rgba(126,255,174,.06);
      border: 1px solid rgba(126,255,174,.12);
    }

    .inq-reply-label {
      color: #7effae;
      font-size: 12px;
      font-weight: 800;
      margin-bottom: 8px;
    }

    .inq-reply-text {
      color: rgba(255,255,255,.82);
      font-size: 13px;
      line-height: 1.7;
      white-space: pre-wrap;
    }

    .inq-reply-date {
      margin-top: 8px;
      color: rgba(255,255,255,.36);
      font-size: 11px;
    }

    .inq-no-reply {
      margin-bottom: 14px;
      padding: 12px 14px;
      border-radius: 12px;
      background: rgba(255,255,255,.03);
      border: 1px solid rgba(255,255,255,.06);
      color: rgba(255,255,255,.48);
      font-size: 12px;
    }

    .inq-edit-field {
      margin-bottom: 12px;
    }

    .inq-edit-field-label {
      margin-bottom: 8px;
      color: rgba(255,255,255,.7);
      font-size: 12px;
      font-weight: 700;
    }

    .inq-edit-input,
    .inq-edit-select,
    .inq-edit-textarea {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(255,255,255,.03);
      color: #fff;
      border-radius: 10px;
      outline: none;
      font-size: 13px;
    }

    .inq-edit-input,
    .inq-edit-select {
      height: 42px;
      padding: 0 12px;
    }

    .inq-edit-textarea {
      min-height: 150px;
      padding: 12px;
      resize: vertical;
      line-height: 1.6;
    }

    .inq-edit-save-btn,
    .inq-delete-btn,
    .inq-read-close-btn,
    .inq-popup-btn {
      height: 40px;
      border: none;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      padding: 0 14px;
    }

    .inq-edit-save-btn {
      width: 100%;
      background: linear-gradient(135deg, #5b6cff, #7f8cff);
      color: #fff;
      margin-top: 4px;
    }

    .inq-bottom-actions {
      display: flex;
      gap: 10px;
      margin-top: 12px;
    }

    .inq-delete-btn {
      background: rgba(255,107,107,.14);
      color: #ff9a9a;
      flex: 1;
    }

    .inq-read-close-btn {
      background: rgba(255,255,255,.06);
      color: rgba(255,255,255,.78);
      flex: 1;
    }

    .inq-popup {
      width: min(100%, 360px);
      background: #161c2b;
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 14px;
      box-shadow: 0 24px 60px rgba(0,0,0,.45);
      padding: 18px;
    }

    .inq-popup-title {
      color: #fff;
      font-size: 16px;
      font-weight: 800;
      margin-bottom: 8px;
    }

    .inq-popup-desc {
      color: rgba(255,255,255,.46);
      font-size: 12px;
      line-height: 1.6;
      margin-bottom: 14px;
    }

    .inq-popup-input {
      width: 100%;
      box-sizing: border-box;
      height: 42px;
      padding: 0 12px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(255,255,255,.03);
      color: #fff;
      outline: none;
      margin-bottom: 12px;
    }

    .inq-popup-actions {
      display: flex;
      gap: 10px;
    }

    .inq-popup-btn.cancel {
      flex: 1;
      background: rgba(255,255,255,.06);
      color: rgba(255,255,255,.78);
    }

    .inq-popup-btn.confirm {
      flex: 1;
      background: linear-gradient(135deg, #5b6cff, #7f8cff);
      color: #fff;
    }

    @media (max-width: 768px) {
      .inquiry-fab-wrap {
        right: 14px;
        bottom: 14px;
      }

      .inquiry-fab {
        padding: 11px 14px;
        font-size: 12px;
      }

      .inquiry-fab-guide {
        max-width: 190px;
        font-size: 10.5px;
      }

      .inquiry-modal {
        width: 100%;
        max-height: 92vh;
      }

      .inquiry-modal-header {
        padding: 16px 16px 12px;
      }

      .inquiry-tabs {
        padding: 12px 16px 0;
      }

      .inquiry-modal-body {
        padding: 14px 16px 18px;
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
      <div class="inquiry-fab-guide" id="inquiryFabGuide">
        간편문의는 페이지 하단에서도 이용할 수 있어요.
      </div>
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
            <div class="inquiry-modal-sub">문의 등록 / 확인 / 수정 / 삭제를 이곳에서 바로 할 수 있습니다.</div>
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
    hideInquiryFirstGuide();
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
   최초 방문 가이드
   ============================================================ */
function setupInquiryFirstGuide() {
  const wrap = document.getElementById("inquiryFabWrap");
  if (!wrap) return;

  const alreadySeen = localStorage.getItem(INQUIRY_GUIDE_SEEN_KEY) === "1";

  if (alreadySeen) {
    wrap.style.display = "none";
    return;
  }

  localStorage.setItem(INQUIRY_GUIDE_SEEN_KEY, "1");

  setTimeout(() => {
    hideInquiryFirstGuide();
  }, INQUIRY_GUIDE_HIDE_MS);
}

function hideInquiryFirstGuide() {
  const wrap = document.getElementById("inquiryFabWrap");
  if (!wrap || wrap.style.display === "none") return;

  wrap.classList.add("is-hiding");

  setTimeout(() => {
    wrap.style.display = "none";
  }, 220);
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

  document.querySelectorAll(".inquiry-tab").forEach(t => t.classList.remove("active"));
  const targetTab = document.querySelector(\`.inquiry-tab[data-tab="\${tabName}"]\`);
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
    inquiryListContent.innerHTML = '<div class="inq-empty">아직 문의가 없습니다 📭</div>';
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
            '<span class="inq-badge-secret">비밀글</span>' +
            '<span class="inq-badge-type">' + escapeHtml(row.inquiry_type) + '</span>' +
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
        '<div class="inq-reply-label">✅ 관리자 답변</div>' +
        '<div class="inq-reply-text">' + nl2br(escapeHtml(row.admin_reply)) + '</div>' +
        '<div class="inq-reply-date">' + replyDate + '</div>' +
      '</div>';
  } else {
    statusHTML = '<div class="inq-no-reply">⏳ 아직 답변이 등록되지 않았습니다</div>';
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
            '<span class="inq-badge-secret">비밀글</span>' +
            '<span class="inq-badge-type">' + escapeHtml(row.inquiry_type) + '</span>' +
          '</div>' +
          '<div class="inq-read-date">' + dateStr + '</div>' +
        '</div>' +
        '<div class="inq-read-title-wrap">' +
          '<div class="inq-read-id">#' + row.id + '</div>' +
          '<div class="inq-read-title-text">' + escapeHtml(row.title) + '</div>' +
        '</div>' +
        '<div class="inq-read-content">' + nl2br(escapeHtml(row.content)) + '</div>' +
        '<button class="inq-read-close-btn" id="inqReadCloseBtn">닫기</button>' +
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
