/* ===== 직각 티어 열람 조건 (gakgak-lock.js) =====
   직각 토너먼트 사이트(tier.js)와 같은 규칙: 오늘 토너먼트를 1회 이상 완료했거나, 최근 S-/SS- 이상 등급 혜택(S: 그 달 말까지, SS: 다음 달 말까지)이 남아 있으면 열람 가능.
   - 방문자 키는 토너먼트 사이트가 localStorage("loa_tournament_visitor_key")에 저장한 값을 그대로 읽음 (같은 도메인이라 공유됨)
   - 결과는 window.__ggLock (Promise<boolean>) 로 노출, 탭 버튼의 🔒 표시도 여기서 갱신 */
(function () {
  "use strict";
  const SB = "https://khszfukekudyripouifm.supabase.co";
  const KEY = "sb_publishable_XjCVKOZRq1aERqzOGj_tHw_eC4uCXEb";
  const S_GRADES = ["S+", "S", "S-"], SS_GRADES = ["SS+", "SS", "SS-"];
  const pad = (n) => String(n).padStart(2, "0");
  const now = new Date();
  const today = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
  const CK = "gg-unlock-" + today;

  function paintTabs(unlocked) {
    document.querySelectorAll('.char-tab[data-tab="gakgak"]').forEach((b) => {
      b.textContent = unlocked ? "직각 티어" : "직각 티어 🔒";
      b.classList.toggle("gg-locked-tab", !unlocked);
    });
  }
  const endOf = (dk, addMonths) => { const a = String(dk).split("-").map(Number); return new Date(a[0], a[1] - 1 + addMonths + 1, 0, 23, 59, 59, 999); };

  async function check() {
    try { if (sessionStorage.getItem(CK) === "1") return true; } catch (e) {}
    let vk = null;
    try { vk = localStorage.getItem("loa_tournament_visitor_key"); } catch (e) {}
    if (!vk) return false;   // 토너먼트를 한 번도 안 한 브라우저
    const url = SB + "/rest/v1/sessions?select=date_key,grade&visitor_key=eq." + encodeURIComponent(vk) +
      "&or=(date_key.eq." + today + ",grade.not.is.null)";
    const r = await fetch(url, { headers: { apikey: KEY, Authorization: "Bearer " + KEY } });
    if (!r.ok) throw new Error("sessions " + r.status);
    const rows = await r.json();
    const ok = rows.some((x) => {
      if (x.date_key === today) return true;   // 오늘 1회 이상 완료
      if (!x.grade || !x.date_key) return false;
      if (S_GRADES.includes(x.grade)) return endOf(x.date_key, 0) >= now;
      if (SS_GRADES.includes(x.grade)) return endOf(x.date_key, 2) >= now;
      return false;
    });
    if (ok) { try { sessionStorage.setItem(CK, "1"); } catch (e) {} }
    return ok;
  }

  let cached = false;
  try { cached = sessionStorage.getItem(CK) === "1"; } catch (e) {}
  const start = () => paintTabs(cached);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();

  window.__ggLock = check().catch((e) => { console.warn("gg-lock", e); return false; }).then((ok) => {
    const apply = () => paintTabs(ok);
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply); else apply();
    return ok;
  });
})();
