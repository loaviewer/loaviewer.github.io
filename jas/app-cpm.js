// CPM 계산기: (분×60 + 초) ÷ 사용 횟수, 소수점 3자리
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
    out.textContent = (total / n).toFixed(3);
    out.classList.add("on");
    calc.textContent = (Math.round(total * 1000) / 1000) + "초 ÷ " + n + "회";
  }
  [min, sec, cnt].forEach(function (el) { el.addEventListener("input", update); });
  update();
})();
