// CPM 계산기: 시간을 전부 초로 → 분(초÷60) 환산 후, CPM = 사용 횟수 ÷ 분 (소수점 3자리)
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var min = $("cpmMin"), sec = $("cpmSec"), cnt = $("cpmCnt"), out = $("cpmOut"), calc = $("cpmCalc");
  if (!min || !sec || !cnt || !out) return;
  function num(el) { var v = parseFloat(el.value); return isFinite(v) && v > 0 ? v : 0; }
  function update() {
    var total = num(min) * 60 + num(sec), n = num(cnt);
    if (!n || !total) {
      out.textContent = "—";
      calc.textContent = !total && !n ? "시간과 횟수를 입력하세요" : (!n ? "사용 횟수를 입력하세요" : "시간을 입력하세요");
      out.classList.remove("on");
      return;
    }
    var mins = total / 60;
    out.textContent = (Math.floor(n / mins * 1000 + 1e-9) / 1000).toFixed(3);   // 소수점 3자리 버림
    out.classList.add("on");
    calc.textContent = n + "회 ÷ " + (Math.round(mins * 1000) / 1000) + "분  (" + (Math.round(total * 1000) / 1000) + "초 ÷ 60)";
  }
  [min, sec, cnt].forEach(function (el) { el.addEventListener("input", update); });
  update();
})();
