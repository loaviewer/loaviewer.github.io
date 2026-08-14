import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* ============================================================
   Supabase
   ============================================================ */
const SUPABASE_URL = "https://khszfukekudyripouifm.supabase.co";
const SUPABASE_KEY = "sb_publishable_XjCVKOZRq1aERqzOGj_tHw_eC4uCXEb";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ============================================================
   설정
   ============================================================ */
const INQUIRY_RPC_NAME = "create_inquiry";
const INQUIRY_MIN_LENGTH = 5;
const INQUIRY_MAX_LENGTH = 1000;
const INQUIRY_COOLDOWN_MS = 30 * 1000; // 30초
const INQUIRY_LAST_SUBMIT_KEY = "loa_inquiry_last_submit_at";

/* ============================================================
   초기화
   ============================================================ */
function initInquiry() {
  injectInquiryStyles();
  injectInquiryHtml();
  bindInquiryEvents();
  updateInquiryCount();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initInquiry);
} else {
  initInquiry();
}

/* ============================================================
   스타일 주입
   ============================================================ */
function injectInquiryStyles() {
  if (document.getElementById("inquiry-style")) return;

  const style = document.createElement("style");
  style.id = "inquiry-style";
  style.textContent = `
    .inquiry-fab {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 9998;
      border: none;
      border-radius: 999px;
      padding: 12px 16px;
      background: linear-gradient(135deg, #5b6cff, #7f8cff);
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: -0.02em;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
      cursor: pointer;
      transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .inquiry-fab:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.34);
    }

    .inquiry-fab:active {
      transform: translateY(0);
    }

    .inquiry-fab-icon {
      font-size: 15px;
      line-height: 1;
    }

    .inquiry-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.68);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .inquiry-overlay.show {
      display: flex;
    }

    .inquiry-modal {
      width: min(100%, 520px);
      background: #161c2b;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
      overflow: hidden;
    }

    .inquiry-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 18px 20px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .inquiry-title-wrap {
      min-width: 0;
    }

    .inquiry-title {
      margin: 0;
      color: #fff;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .inquiry-subtitle {
      margin-top: 6px;
      color: rgba(255, 255, 255, 0.45);
      font-size: 12px;
      line-height: 1.5;
    }

    .inquiry-close {
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.5);
      font-size: 20px;
      cursor: pointer;
      padding: 6px 8px;
      border-radius: 8px;
      transition: background .18s ease, color .18s ease;
      flex-shrink: 0;
    }

    .inquiry-close:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #fff;
    }

    .inquiry-body {
      padding: 18px 20px 20px;
    }

    .inquiry-field {
      margin-bottom: 14px;
    }

    .inquiry-label {
      display: block;
      margin-bottom: 8px;
      color: rgba(255, 255, 255, 0.78);
      font-size: 12px;
      font-weight: 700;
    }

    .inquiry-label .optional {
      color: rgba(255, 255, 255, 0.36);
      font-weight: 500;
      margin-left: 4px;
    }

    .inquiry-select,
    .inquiry-input,
    .inquiry-textarea {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.03);
      color: #fff;
      border-radius: 10px;
      outline: none;
      transition: border-color .18s ease, background .18s ease;
      font-size: 13px;
    }

    .inquiry-select,
    .inquiry-input {
      height: 42px;
      padding: 0 12px;
    }

    .inquiry-textarea {
      min-height: 150px;
      resize: vertical;
      padding: 12px;
      line-height: 1.6;
    }

    .inquiry-select:focus,
    .inquiry-input:focus,
    .inquiry-textarea:focus {
      border-color: rgba(127, 140, 255, 0.85);
      background: rgba(255, 255, 255, 0.05);
    }

    .inquiry-help-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-top: 8px;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.36);
    }

    .inquiry-meta-box {
      margin-top: 14px;
      padding: 12px 12px 10px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 11px;
      color: rgba(255, 255, 255, 0.38);
      line-height: 1.6;
    }

    .inquiry-actions {
      display: flex;
      gap: 10px;
      margin-top: 16px;
    }

    .inquiry-btn {
      flex: 1;
      height: 42px;
      border-radius: 10px;
      border: none;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: transform .16s ease, opacity .16s ease, background .16s ease;
    }

    .inquiry-btn:hover {
      transform: translateY(-1px);
    }

    .inquiry-btn:disabled {
      opacity: 0.6;
      cursor: default;
      transform: none;
    }

    .inquiry-btn.cancel {
      background: rgba(255, 255, 255, 0.06);
      color: rgba(255, 255, 255, 0.72);
    }

    .inquiry-btn.submit {
      background: linear-gradient(135deg, #5b6cff, #7f8cff);
      color: #fff;
    }

    .inquiry-status {
      min-height: 20px;
      margin-top: 12px;
      font-size: 12px;
      line-height: 1.5;
    }

    .inquiry-status.error {
      color: #ff8f8f;
    }

    .inquiry-status.success {
      color: #94f0a8;
    }

    @media (max-width: 768px) {
      .inquiry-fab {
        right: 14px;
        bottom: 14px;
        padding: 11px 14px;
        font-size: 12px;
      }

      .inquiry-modal {
        width: 100%;
        border-radius: 14px;
      }

      .inquiry-header {
        padding: 16px 16px 12px;
      }

      .inquiry-body {
        padding: 16px 16px 18px;
      }

      .inquiry-textarea {
        min-height: 130px;
      }
    }
  `;
  document.head.appendChild(style);
}

/* ============================================================
   HTML 주입
   ============================================================ */
function injectInquiryHtml() {
  if (!document.getElementById("inquiryFloatingBtn")) {
    const fab = document.createElement("button");
    fab.id = "inquiryFloatingBtn";
    fab.className = "inquiry-fab";
    fab.type = "button";
    fab.innerHTML = `
      <span class="inquiry-fab-icon">💬</span>
      <span>간편문의</span>
    `;
    document.body.appendChild(fab);
  }

  if (!document.getElementById("inquiryOverlay")) {
    const overlay = document.createElement("div");
    overlay.id = "inquiryOverlay";
    overlay.className = "inquiry-overlay";
    overlay.innerHTML = `
      <div class="inquiry-modal" role="dialog" aria-modal="true" aria-labelledby="inquiryTitle">
        <div class="inquiry-header">
          <div class="inquiry-title-wrap">
            <h2 class="inquiry-title" id="inquiryTitle">간편문의</h2>
            <div class="inquiry-subtitle">
              오류 제보, 데이터 수정 요청, 기능 건의 등을 간단히 남겨주세요.
            </div>
          </div>
          <button type="button" class="inquiry-close" id="inquiryCloseBtn" aria-label="문의창 닫기">✕</button>
        </div>

        <div class="inquiry-body">
          <div class="inquiry-field">
            <label class="inquiry-label" for="inquiryType">문의 유형</label>
            <select id="inquiryType" class="inquiry-select">
              <option value="버그/오류">버그/오류</option>
              <option value="기능 건의">기능 건의</option>
              <option value="데이터 제보">데이터 제보</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div class="inquiry-field">
            <label class="inquiry-label" for="inquiryContact">
              답변 받을 수단
              <span class="optional">(선택)</span>
            </label>
            <input
              id="inquiryContact"
              class="inquiry-input"
              type="text"
              maxlength="120"
              placeholder="이메일, 디스코드, 오픈채팅 등"
            >
          </div>

          <div class="inquiry-field">
            <label class="inquiry-label" for="inquiryMessage">문의 내용</label>
            <textarea
              id="inquiryMessage"
              class="inquiry-textarea"
              maxlength="${INQUIRY_MAX_LENGTH}"
              placeholder="예) 모바일에서 토너먼트 버튼이 안 눌려요.&#10;예) 분노의 망치 아이콘이 누락된 것 같아요.&#10;예) 이 기능이 있으면 좋겠어요."
            ></textarea>
            <div class="inquiry-help-row">
              <span>구체적으로 적을수록 빠르게 확인할 수 있어요.</span>
              <span id="inquiryCount">0 / ${INQUIRY_MAX_LENGTH}</span>
            </div>
          </div>

          <div class="inquiry-meta-box">
            현재 페이지 주소와 브라우저 정보는 문의 확인용으로 함께 전달될 수 있습니다.
          </div>

          <div class="inquiry-actions">
            <button type="button" class="inquiry-btn cancel" id="inquiryCancelBtn">취소</button>
            <button type="button" class="inquiry-btn submit" id="inquirySubmitBtn">문의 보내기</button>
          </div>

          <div class="inquiry-status" id="inquiryStatus"></div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }
}

/* ============================================================
   이벤트
   ============================================================ */
function bindInquiryEvents() {
  const fab = document.getElementById("inquiryFloatingBtn");
  const overlay = document.getElementById("inquiryOverlay");
  const closeBtn = document.getElementById("inquiryCloseBtn");
  const cancelBtn = document.getElementById("inquiryCancelBtn");
  const submitBtn = document.getElementById("inquirySubmitBtn");
  const messageEl = document.getElementById("inquiryMessage");

  fab?.addEventListener("click", openInquiryModal);
  closeBtn?.addEventListener("click", closeInquiryModal);
  cancelBtn?.addEventListener("click", closeInquiryModal);

  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeInquiryModal();
  });

  messageEl?.addEventListener("input", updateInquiryCount);

  submitBtn?.addEventListener("click", submitInquiryForm);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeInquiryModal();
  });

  // 나중에 푸터/버튼 어디든 연결 가능
  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open-inquiry]");
    if (!opener) return;
    e.preventDefault();
    openInquiryModal();
  });
}

/* ============================================================
   열기/닫기
   ============================================================ */
function openInquiryModal() {
  const overlay = document.getElementById("inquiryOverlay");
  if (!overlay) return;

  overlay.classList.add("show");
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    document.getElementById("inquiryMessage")?.focus();
  }, 10);
}

function closeInquiryModal() {
  const overlay = document.getElementById("inquiryOverlay");
  if (!overlay) return;

  overlay.classList.remove("show");
  document.body.style.overflow = "";
  clearInquiryStatus();
}

/* ============================================================
   UI 보조
   ============================================================ */
function updateInquiryCount() {
  const messageEl = document.getElementById("inquiryMessage");
  const countEl = document.getElementById("inquiryCount");
  if (!messageEl || !countEl) return;

  countEl.textContent = `${messageEl.value.length} / ${INQUIRY_MAX_LENGTH}`;
}

function setInquiryStatus(message, type = "") {
  const statusEl = document.getElementById("inquiryStatus");
  if (!statusEl) return;

  statusEl.className = `inquiry-status ${type}`.trim();
  statusEl.innerHTML = message || "";
}

function clearInquiryStatus() {
  setInquiryStatus("", "");
}

function setInquirySubmitting(isSubmitting) {
  const submitBtn = document.getElementById("inquirySubmitBtn");
  const cancelBtn = document.getElementById("inquiryCancelBtn");
  const closeBtn = document.getElementById("inquiryCloseBtn");

  if (submitBtn) {
    submitBtn.disabled = isSubmitting;
    submitBtn.textContent = isSubmitting ? "보내는 중..." : "문의 보내기";
  }
  if (cancelBtn) cancelBtn.disabled = isSubmitting;
  if (closeBtn) closeBtn.disabled = isSubmitting;
}

/* ============================================================
   제출
   ============================================================ */
async function submitInquiryForm() {
  const typeEl = document.getElementById("inquiryType");
  const contactEl = document.getElementById("inquiryContact");
  const messageEl = document.getElementById("inquiryMessage");

  if (!typeEl || !contactEl || !messageEl) return;

  clearInquiryStatus();

  const type = typeEl.value.trim();
  const contact = contactEl.value.trim();
  const content = messageEl.value.trim();

  if (content.length < INQUIRY_MIN_LENGTH) {
    setInquiryStatus(`문의 내용은 최소 ${INQUIRY_MIN_LENGTH}자 이상 입력해주세요.`, "error");
    messageEl.focus();
    return;
  }

  if (content.length > INQUIRY_MAX_LENGTH) {
    setInquiryStatus(`문의 내용은 최대 ${INQUIRY_MAX_LENGTH}자까지 입력할 수 있어요.`, "error");
    messageEl.focus();
    return;
  }

  const lastSubmitAt = Number(localStorage.getItem(INQUIRY_LAST_SUBMIT_KEY) || 0);
  const now = Date.now();
  if (now - lastSubmitAt < INQUIRY_COOLDOWN_MS) {
    const remain = Math.ceil((INQUIRY_COOLDOWN_MS - (now - lastSubmitAt)) / 1000);
    setInquiryStatus(`너무 빠르게 연속 제출 중이에요. ${remain}초 후 다시 시도해주세요.`, "error");
    return;
  }

  const payload = {
    type,
    contact,
    content,
    page_url: location.href,
    user_agent: navigator.userAgent
  };

  try {
    setInquirySubmitting(true);
    await submitInquiryToSupabase(payload);

    localStorage.setItem(INQUIRY_LAST_SUBMIT_KEY, String(Date.now()));
    setInquiryStatus("문의가 접수되었습니다. 확인 후 반영할게요. 감사합니다!", "success");

    contactEl.value = "";
    messageEl.value = "";
    updateInquiryCount();

    setTimeout(() => {
      closeInquiryModal();
    }, 900);
  } catch (err) {
    console.error("submitInquiryForm error:", err);
    setInquiryStatus(
      "문의 전송에 실패했습니다.<br>잠시 후 다시 시도하거나 이메일 문의를 이용해주세요.",
      "error"
    );
  } finally {
    setInquirySubmitting(false);
  }
}

/* ============================================================
   Supabase 제출
   ============================================================ */
async function submitInquiryToSupabase(payload) {
  // create_inquiry 함수 시그니처를 아직 100% 모르는 상태라
  // 자주 쓰는 파라미터 조합을 순서대로 시도함.
  // 안 맞으면 여기만 네 DB 함수 시그니처에 맞게 1회 수정하면 됨.

  const candidates = [
    { p_type: payload.type, p_content: payload.content, p_contact: payload.contact },
    { p_category: payload.type, p_content: payload.content, p_contact: payload.contact },
    { p_type: payload.type, p_message: payload.content, p_contact: payload.contact },
    { p_category: payload.type, p_message: payload.content, p_contact: payload.contact },
    { p_content: payload.content, p_contact: payload.contact },
    { p_message: payload.content, p_contact: payload.contact }
  ];

  let lastError = null;

  for (const body of candidates) {
    const { error } = await supabase.rpc(INQUIRY_RPC_NAME, body);
    if (!error) return;
    lastError = error;
  }

  throw lastError || new Error("inquiry submit failed");
}

/* ============================================================
   외부에서 열기용
   ============================================================ */
window.openInquiryModal = openInquiryModal;
window.closeInquiryModal = closeInquiryModal;
