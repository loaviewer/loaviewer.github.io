/* 서폿 전용 카드 (공증 / 피증 / 낙인) — 스텟 탭, 딜러 카드는 그대로 */
(function () {
  var BASE_BUFF = 22;      // 공증 기본: 스킬 12% + 발산 트라이포드 10%
  var BASE_BRAND = 10;     // 낙인 기본 받는 피해 증가 (추정)

  function flat(src) {
    var s = typeof src === "string" ? src : JSON.stringify(src || "");
    return s.replace(/\\r\\n|\\n|\\r/g, "\n").replace(/\\"/g, '"')
      .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  }
  function all(s, re) { var a = [], m; re.lastIndex = 0; while ((m = re.exec(s))) a.push(m); return a; }
  function sumN(s, re) { return all(s, re).reduce(function (t, m) { return t + parseFloat(m[1]); }, 0); }
  function sumStack(s, re) { return all(s, re).reduce(function (t, m) { return t + parseFloat(m[1]) * parseInt(m[2], 10); }, 0); }
  function r2(n) { return Math.round(n * 100) / 100; }
  function fmt(n) { return Math.round(n).toLocaleString(); }

  // 코어: [nP] 구간 중 현재 포인트 이하만
  function coreText(tip, point) {
    var parts = flat(tip).split(/\[(\d+)P\]/), out = [];
    for (var i = 1; i < parts.length; i += 2) if (+parts[i] <= point) out.push(parts[i + 1]);
    return out.join(" ");
  }

  // 팔찌 상시 디버프/보호 효과 → 딜러가 받는 피해 증가 환산표
  var BR_DEF = { 1.5: 1.0075, 1.8: 1.007, 2.1: 1.0106, 2.5: 1.0126 };               // 방어력 감소 %
  var BR_CRR = { 1.5: 1.010875, 1.8: 1.01305, 2.1: 1.015225, 2.5: 1.0176 };         // 치명타 저항 감소 %
  var BR_CRD = { 3: 1.010875, 3.6: 1.01305, 4.2: 1.015225, 4.8: 1.0174 };           // 치명타 피해 저항 감소 %
  var BR_SHD = { 0.7: 1.007, 0.9: 1.009, 1.1: 1.011, 1.3: 1.013 };                  // 보호 대상 피해 증가 %
  function brLook(tb, x) {
    var ks = Object.keys(tb).map(parseFloat), best = ks[0];
    ks.forEach(function (k) { if (Math.abs(k - x) < Math.abs(best - x)) best = k; });
    return tb[best];
  }
  function bracelet(t) {   // t: 공백 제거한 툴팁
    var rows = [], mul = 1;
    [[/방어력을([\d.]+)%감소/g, BR_DEF, "방어력 감소"], [/치명타저항을([\d.]+)%감소/g, BR_CRR, "치명타 저항 감소"],
     [/치명타피해저항을([\d.]+)%감소/g, BR_CRD, "치명타 피해 저항 감소"], [/적에게주는피해가([\d.]+)%증가/g, BR_SHD, "보호 대상 피해"]]
      .forEach(function (d) {
        all(t, d[0]).forEach(function (m) {
          var v = parseFloat(m[1]), f = brLook(d[1], v);
          mul *= f; rows.push({ k: d[2] + " " + v + "%", v: (f - 1) * 100 });
        });
      });
    return { mul: mul, rows: rows };
  }

  function collect(fd) {
    var R = {
      atk: { acc: 0, bracelet: 0, passive: 0, core: 0, gem: 0, grid: 0, jewel: 0 },
      dmg: { acc: 0, bracelet: 0, passive: 0, core: 0, grid: 0, identity: [] },
      brand: { br: { mul: 1, rows: [] }, karma: 0, evo: 0, acc: 0, bracelet: 0, passive: 0, core: 0, grid: 0, coreDmg: 0 }
    };
    (fd.ArmoryEquipment || []).forEach(function (e) {
      var t = flat(e.Tooltip);
      if (/목걸이|귀걸이|반지/.test(e.Type)) {
        R.atk.acc += sumN(t, /아군 공격력 강화 효과 \+([\d.]+)%/g);
        R.dmg.acc += sumN(t, /아군 피해량 강화 효과 \+([\d.]+)%/g);
        R.brand.acc += sumN(t, /낙인력 \+([\d.]+)%/g);
      } else if (/팔찌/.test(e.Type)) {
        R.atk.bracelet += sumN(t, /아군 공격력 강화 효과가 ([\d.]+)% 증가/g);
        R.atk.bracelet += sumN(t, /아군 공격력 강화 효과 \+([\d.]+)%/g);
        R.dmg.bracelet += sumN(t, /아군 피해량 강화 효과 \+([\d.]+)%/g);
        R.brand.bracelet += sumN(t, /낙인력 \+([\d.]+)%/g);
        R.brand.br = bracelet(t.replace(/\s+/g, ""));
      }
    });
    var ag = fd.ArkGrid || {};
    (ag.Effects || []).forEach(function (e) {
      var t = flat(e.Tooltip), v = sumN(t, /\+([\d.]+)%/g);
      if (/^아군 공격/.test(e.Name)) R.atk.grid += v;
      else if (/^아군 피해/.test(e.Name)) R.dmg.grid += v;
      else if (/^낙인력/.test(e.Name)) R.brand.grid += v;
    });
    (ag.Slots || []).forEach(function (s) {
      var t = coreText(s.Tooltip, s.Point || 0);
      R.atk.core += sumN(t, /아군 공격력 강화 효과가 ([\d.]+)%/g);
      all(t, /(\S*의\s)?아군 피해량 강화 효과가 ([\d.]+)%/g).forEach(function (m) {
        if (m[1]) R.dmg.identity.push({ name: m[1].replace(/의\s*$/, ""), v: parseFloat(m[2]) });
        else R.dmg.core += parseFloat(m[2]);
      });
      R.brand.core += sumN(t, /낙인력이 ([\d.]+)%/g);
      R.brand.coreDmg += sumN(t, /받는 피해가 ([\d.]+)%/g);
    });
    ((fd.ArkPassive || {}).Effects || []).forEach(function (e) {
      var t = flat(e);
      R.atk.passive += sumN(t, /아군 공격력 강화 효과가 ([\d.]+)% 증가/g)
        + sumN(t, /아군 공격력 강화 효과가 추가로 ([\d.]+)% 증가/g)
        + sumStack(t, /아군 공격력 강화 효과 \+([\d.]+)%\s*,\s*최대\s*(\d+)중첩/g);
      R.dmg.passive += sumN(t, /아군 피해량 강화 효과가 ([\d.]+)% 증가/g);
      var bs = sumStack(t, /낙인력 \+([\d.]+)%\s*,\s*최대\s*(\d+)중첩/g), bn = sumN(t, /낙인력이 ([\d.]+)% 증가/g);
      if (bs) R.brand.evo += bn + bs; else R.brand.passive += bn;
    });
    // 진화 카르마 랭크: 랭크당 낙인력 +1% (최대 6%)
    var evoPt = ((fd.ArkPassive || {}).Points || []).filter(function (x) { return x.Name === "진화"; })[0];
    var rk = evoPt ? String(evoPt.Description || "").match(/(\d+)\s*랭크/) : null;
    if (rk) R.brand.karma = Math.min(parseInt(rk[1], 10), 6);
    var gems = (fd.ArmoryGem || {}).Gems || [];
    gems.forEach(function (g) { R.atk.gem += sumN(flat(g.Tooltip), /아군 공격력 강화 효과[^%]{0,12}?([\d.]+)% 증가/g); });
    // 보석 지원 효과 (서폿 보석): 공증에도 그대로 합산
    if (!R.atk.gem) {
      var ge = (fd.ArmoryGem || {}).Effects, ga = Array.isArray(ge) ? ge : ((ge && ge.Skills) || []);
      ga.forEach(function (x) {
        var m = flat(x.Description || x.Tooltip || "").match(/지원 효과\s*\+?\s*([\d.]+)\s*%/);
        if (m) R.atk.gem = Math.max(R.atk.gem, parseFloat(m[1]));
      });
    }
    return R;
  }

  var SKILLS = {
    "도화가": ["묵법 : 해그리기", "묵법 : 해우물"],
    "홀리나이트": ["신의 분노", "천상의 축복"],
    "바드": ["천상의 연주", "음파 진동"],
    "발키리": ["숭고한 맹세", "숭고한 도약"]
  };

  var TP_UNLOCK = { 1: 4, 2: 7, 3: 10 };
  function shieldRows(fd) {
    var RE = /최대\s*생명력(?:의)?\s*([\d.]+)\s*%[^.]{0,25}?보호막/g, rows = [];
    (fd.ArmorySkills || []).forEach(function (sk) {
      var lv = sk.Level || 0, st = sk.SkillType || 0;
      // 스킬 탭과 같은 기준: 일반은 Lv2↑, 초각성/각성기만 Lv1 허용
      if (!(lv > 1 || st === 1 || st >= 100)) return;
      var tps = (sk.Tripods || []).filter(function (t) { return t.IsSelected && lv >= (TP_UNLOCK[t.Tier] || 0); });
      var mult = 1;
      tps.forEach(function (t) {
        var m = flat(t.Tooltip).match(/보호막(?:의)?\s*효과가\s*([\d.]+)\s*배/);
        if (m) mult *= parseFloat(m[1]);
      });
      var found = [];
      all(flat(sk.Tooltip), RE).forEach(function (m) { found.push({ src: "", v: parseFloat(m[1]) }); });
      tps.forEach(function (t) {
        all(flat(t.Tooltip), RE).forEach(function (m) { found.push({ src: t.Name || "", v: parseFloat(m[1]) }); });
      });
      var seen = {};
      found.forEach(function (f) {
        var k = String(f.v * mult); if (seen[k]) return; seen[k] = 1;
        rows.push({ name: sk.Name, icon: sk.Icon, lv: lv, src: f.src, v: f.v * mult, mult: mult });
      });
    });
    return rows;
  }
  function effIcon(fd, re, nameRe) {
    var e = ((fd.ArkPassive || {}).Effects || []).filter(function (x) {
      return re.test(String(x.Description || "")) && (!nameRe || nameRe.test(String(x.Name || "")));
    })[0];
    return (e && e.Icon) || "";
  }
  function man(n) { return n >= 10000 ? (Math.round(n / 1000) / 10).toLocaleString() + "만" : fmt(n); }
  function subc(l, v, color) { return '<div class="mc-sub-line"><span style="color:' + color + '">' + l + "</span><b>" + v + "</b></div>"; }
  function shortSpec(k) {   // "파티원에게 적용되는 ○○ 스킬의 (적에게 주는 피해) 버프 효율" → "○○ 버프 효율"
    return k.replace(/^파티원에게 적용되는\s*/, "").replace(/\s*스킬의\s*(적에게 주는 피해\s*)?버프 효율/, " 버프 효율");
  }
  // 아크패시브 코드 노드: "○○ 기본 효과의 N%에 해당하는 …" → 기본 효과 배율 (1 + N%)
  function codeMul(fd, fb) {
    var hit = 0;
    ((fd.ArkPassive || {}).Effects || []).forEach(function (e) {
      var m = flat(e).match(/기본 효과의\s*([\d.]+)\s*%\s*에\s*해당/);
      if (m && !hit) hit = parseFloat(m[1]);
    });
    return hit ? 1 + (hit + (fb === 1.23 ? 3 : 0)) / 100 : (fb || 1.2);
  }
  function sub(l, v, cls) { if (/^[+-]?0(\.0+)?%$/.test(String(v).trim())) return ""; return '<div class="mc-sub-line' + (cls ? " " + cls : "") + '"><span>' + l + "</span><b>" + v + "</b></div>"; }
  function card(id, label, icon, valueHtml, drawer, color) {
    return '<div class="mc" id="' + id + '"><div class="mc-top">' +
      '<img class="mc-icon" src="' + icon + '" alt="" style="width:44px;height:44px;">' +
      '<span class="mc-label" style="color:' + color + '">' + label + '</span>' +
      '<div class="mc-top-r"><span class="mc-badge on" style="border-color:' + color + ';color:' + color + '">실효</span></div></div>' +
      '<div class="mc-value" style="font-size:26px;font-weight:900;color:#fff">' + valueHtml + "</div>" +
      '<div class="mc-toggle-bar"><span class="mc-toggle-label mc-toggle-closed">▼ 열기</span><span class="mc-toggle-label mc-toggle-open">▲ 닫기</span></div>' +
      '<div class="mc-drawer"><div class="mc-drawer-inner">' + drawer + "</div></div></div>";
  }

  function restoreMoved(eg) {
    if (!eg) return;
    var as = document.querySelector("#supGrid .mc.as"), ms = document.querySelector("#supGrid .mc.ms"), br = document.querySelector("#supGrid #braceletEffCard");
    var dol = document.getElementById("effDolCard");
    if (as) eg.insertBefore(as, dol || null);
    if (ms) eg.insertBefore(ms, dol || null);
    if (br) eg.appendChild(br);
  }
  function renderSupport(fd) {
    var host = document.getElementById("supGrid");
    if (!host) return;
    var cls = window.__charClass || "";
    var isSup = typeof checkIsSupportMode === "function" && checkIsSupportMode(fd, cls);
    var eg = document.getElementById("effGrid");
    restoreMoved(eg);
    if (eg) eg.classList.toggle("sup-mode", !!isSup);
    if (!isSup) { host.style.display = "none"; host.innerHTML = ""; return; }

    var R = collect(fd), A = R.atk, D = R.dmg, B = R.brand;
    var stat = ((fd.ArmoryProfile || {}).Stats || []).find(function (s) { return s.Type === "공격력"; });
    var baseAtk = stat ? parseInt(String(stat.Value).replace(/,/g, ""), 10) || 0 : 0;

    // 공증
    var aSum = A.acc + A.bracelet + A.passive + A.core + A.gem + A.grid;
    var inc = baseAtk * BASE_BUFF / 100 * (1 + aSum / 100);
    var key = (Object.keys(SKILLS).filter(function (k) { return cls.indexOf(k) >= 0; })[0]) || "";
    var skills = (SKILLS[key] || []).filter(function (n) {
      return (fd.ArmorySkills || []).some(function (s) { return String(s.Name).replace(/\s+/g, "") === n.replace(/\s+/g, ""); });
    });
    var aDraw = subc("기본 공격력", fmt(baseAtk), "#7fd1ff") + sub("기본 계수", BASE_BUFF + "% (스킬 12 + 발산 10)") +
      sub("액세서리", "+" + r2(A.acc) + "%") + sub("팔찌", "+" + r2(A.bracelet) + "%") +
      sub("아크패시브", "+" + r2(A.passive) + "%") + sub("아크그리드 코어", "+" + r2(A.core) + "%") +
      sub("아크그리드 젬", "+" + r2(A.grid) + "%") + (A.gem ? sub("보석", "+" + r2(A.gem) + "%") : "") +
      subc("합계 증폭", "×" + r2(1 + aSum / 100), "#ffb84d");
    skills.forEach(function (n) { aDraw += subc(n, "+" + fmt(inc), "#3cc78c"); });

    // 피증: 버프 = 기본 × (1 + 상시 합 [+ 새김]) [× (1 + 특화 버프효율)]
    var dSum = D.acc + D.bracelet + D.passive + D.core + D.grid;
    var spec = ((fd.ArmoryProfile || {}).Stats || []).find(function (x) { return x.Type === "특화"; });
    var specRows = [];
    (spec && Array.isArray(spec.Tooltip) ? spec.Tooltip : []).forEach(function (t) {
      t = String(t).replace(/<[^>]+>/g, "").trim();
      var m = t.match(/^(.*?)\s*([0-9.]+)\s*%\s*(증가|증폭|감소)/);
      if (!/%/.test(t) || /물약|원정대|카드\s*도감/.test(t) || !m) return;
      specRows.push({ k: shortSpec(m[1].trim().replace(/[이가을를]\s*$/, "").trim()), v: parseFloat(m[2]), neg: m[3] === "감소" });
    });
    var specBuff = specRows.filter(function (r) { return /버프 효율/.test(r.k); })[0];
    var idSum = D.identity.reduce(function (t, x) { return t + x.v; }, 0);
    var idAria = D.identity.filter(function (x) { return /아리아/.test(x.name); }).reduce(function (t, x) { return t + x.v; }, 0);
    var dDraw = sub("기본 효과", "10%") + sub("액세서리", "+" + r2(D.acc) + "%") + sub("팔찌", "+" + r2(D.bracelet) + "%") +
      sub("아크패시브", "+" + r2(D.passive) + "%") + sub("아크그리드 코어", "+" + r2(D.core) + "%") +
      sub("아크그리드 젬", "+" + r2(D.grid) + "%");
    var dMain;
    if (/도화가/.test(cls)) {
      var cm = codeMul(fd, false), moon = 10 * cm * (1 + dSum / 100) * (1 + (specBuff ? specBuff.v : 0) / 100);
      var mir = 10 * (1 + (dSum + idSum) / 100);
      dDraw = '<div class="mc-sub-line"><span style="color:#ffb84d">저무는 달</span><b>+' + r2(moon) + "%</b></div>" +
        sub("└ 기본 효과", r2(10 * cm) + "%") + sub("└ 상시 합계", "+" + r2(dSum) + "%") +
        sub("└ 특화 버프 효율", "+" + r2(specBuff ? specBuff.v : 0) + "%") +
        '<div class="mc-sub-line"><span style="color:#3cc78c">미르새김</span><b>+' + r2(mir) + "%</b></div>" +
        sub("└ 기본 효과", "10%") + sub("└ 상시 합계", "+" + r2(dSum) + "%") + sub("└ 미르 새김 (코어)", "+" + r2(idSum) + "%") +
        sub("└ 액세서리 / 팔찌 / 젬 / 코어", "+" + r2(D.acc) + " / " + r2(D.bracelet) + " / " + r2(D.grid) + " / " + r2(D.core) + "%");
      dMain = "+" + r2((moon + mir) / 2) + '% <small style="font-size:13px;color:#9aa8c7">평균</small>';
    } else if (/홀리나이트/.test(cls)) {
      // 신성한 정의 = 10% × (1 + 상시 + 코어 증가분),  축복의 오라 = 12% × (1 + 상시) × (1 + 특화 적용효율) × (1 + 보석 지원효과)
      var spec2 = specRows.filter(function (r) { return /적용 효율|버프 효율/.test(r.k); })[0];
      var gemSup = (function () {
        var e = (fd.ArmoryGem || {}).Effects, a2 = Array.isArray(e) ? e : ((e && e.Skills) || []);
        var hit = a2.filter(function (x) { return /신앙|신의|축복|오라/.test(x.Name || "") && /지원 효과\s*([\d.]+)\s*%/.test(flat(x.Description || x.Tooltip || "")); })[0];
        if (!hit) return 0;
        return parseFloat(flat(hit.Description || hit.Tooltip).match(/지원 효과\s*([\d.]+)\s*%/)[1]);
      })();
      var just = 10 * (1 + (dSum + idSum) / 100);
      var cm2 = codeMul(fd, false), aura = 10 * cm2 * (1 + dSum / 100) * (1 + (spec2 ? spec2.v : 0) / 100) * (1 + gemSup / 100);
      dDraw = '<div class="mc-sub-line"><span style="color:#ffb84d">축복의 오라</span><b>+' + r2(aura) + "%</b></div>" +
        sub("└ 기본 효과", r2(10 * cm2) + "%") + sub("└ 상시 합계", "+" + r2(dSum) + "%") +
        sub("└ 특화 적용 효율", "+" + r2(spec2 ? spec2.v : 0) + "%") + sub("└ 보석 지원 효과", "+" + r2(gemSup) + "%") +
        '<div class="mc-sub-line"><span style="color:#3cc78c">신성한 정의</span><b>+' + r2(just) + "%</b></div>" +
        sub("└ 기본 효과", "10%") + sub("└ 상시 합계", "+" + r2(dSum) + "%") + sub("└ 신성한 정의 (코어)", "+" + r2(idSum) + "%");
      dMain = "+" + r2((aura + just) / 2) + '% <small style="font-size:13px;color:#9aa8c7">평균</small>';
    } else {
      // 바드 아리아 / 발키리 신의 증명 = 10% × (1 + 상시)
      // 초각성 버프(용맹의 세레나데 / 빛의 해방) = 기본 × 1.2 × (1 + 상시[+코어]) × (1 + 특화 버프효율) × (1 + 보석 지원효과)  (근사식, 코드 노드 문구 미검출 시 경험값 1.22~1.23)
      var isBard = /바드/.test(cls), isVal = /발키리/.test(cls);
      var pn = isBard ? "아리아" : isVal ? "신의 증명" : "상시 버프";
      var pvSum = dSum + (isBard ? idAria : 0);
      var pv = 10 * (1 + pvSum / 100);
      if (isBard || isVal) {
        var sp3 = specRows.filter(function (r) { return /버프 효율/.test(r.k); })[0];
        var gs = (function () {
          var e = (fd.ArmoryGem || {}).Effects, a3 = Array.isArray(e) ? e : ((e && e.Skills) || []);
          var hit = a3.filter(function (x) { return /신앙|세레나데/.test(x.Name || "") && /지원 효과\s*([\d.]+)\s*%/.test(flat(x.Description || x.Tooltip || "")); })[0];
          return hit ? parseFloat(flat(hit.Description || hit.Tooltip).match(/지원 효과\s*([\d.]+)\s*%/)[1]) : 0;
        })();
        var an = isBard ? "용맹의 세레나데" : "빛의 해방";
        var abase = isBard ? 15 : 10;              // 세레나데: 3버블 기준 15%
        var aSumX = isBard ? dSum + (idSum - idAria) : dSum;  // 바드: 세레나데 전용 코어만 포함 (아리아 전용 코어 제외)
        var av = abase * codeMul(fd, isBard ? 1.23 : 1.22) * (1 + aSumX / 100) * (1 + (sp3 ? sp3.v : 0) / 100) * (1 + gs / 100);
        dDraw = '<div class="mc-sub-line"><span style="color:#ffb84d">' + an + '</span><b>+' + r2(av) + "%</b></div>" +
          sub("└ 기본 효과", abase + "%" + (isBard ? " (3버블)" : "")) + sub("└ 상시 합계" + (isBard ? " (코어 포함)" : ""), "+" + r2(aSumX) + "%") +
          sub("└ 특화 버프 효율", "+" + r2(sp3 ? sp3.v : 0) + "%") + sub("└ 보석 지원 효과", "+" + r2(gs) + "%") +
          '<div class="mc-sub-line"><span style="color:#3cc78c">' + pn + '</span><b>+' + r2(pv) + "%</b></div>" +
          sub("└ 기본 효과", "10%") + sub("└ 상시 합계" + (isBard ? " (코어 포함)" : ""), "+" + r2(pvSum) + "%") +
          "";
        dMain = "+" + r2((av + pv) / 2) + '% <small style="font-size:13px;color:#9aa8c7">평균</small>';
      } else {
        dDraw += sub(pn, "+" + r2(pv) + "%", "ok");
        dMain = "+" + r2(pv) + '% <small style="font-size:13px;color:#9aa8c7">' + pn + "</small>";
      }
    }

    // 낙인
    var bSum = B.acc + B.bracelet + B.passive + B.core + B.grid + B.karma + B.evo; // 진화 노드 낙인력도 합산
    var brandDmg = BASE_BRAND * (1 + bSum / 100);
    var coreMul = 1 + B.coreDmg / 100;
    // 정열의 춤사위(진화 노드): "정열의 춤 N : 진화형 피해 X% 증가" → 기준 딜러 진화형 피해(약 86.9%) 위에서 총 피해 증가율로 환산
    var passion = 0;
    ((fd.ArkPassive || {}).Effects || []).forEach(function (e) {
      var m = flat(e).match(/정열의 춤\s*[IVX]*\s*:\s*진화형 피해\s*([\d.]+)\s*%/);
      if (m) passion = Math.max(passion, parseFloat(m[1]) / 1.869);
    });
    passion = r2(passion);
    var total = (1 + brandDmg / 100) * (1 + passion / 100) * coreMul * B.br.mul;
    var bDraw = subc("상시 적용 딜증 (아래 4개를 곱한 값)", "+" + r2((total - 1) * 100) + "%", "#fff") +
      subc("① 낙인 딜증 = 기본 10% × (1 + 낙인력 합계)", "+" + r2(brandDmg) + "%", "#ffb84d") +
      subc("└ 낙인력 합계", "+" + r2(bSum) + "%", "#d9a8ff") +
      sub("　└ 액세서리", "+" + r2(B.acc) + "%") + sub("　└ 팔찌", "+" + r2(B.bracelet) + "%") +
      sub("　└ 아크패시브", "+" + r2(B.passive) + "%") + sub("　└ 진화 카르마", "+" + r2(B.karma) + "%") +
      sub("　└ 진화 노드", "+" + r2(B.evo) + "%") +
      sub("　└ 아크그리드 코어", "+" + r2(B.core) + "%") + sub("　└ 아크그리드 젬", "+" + r2(B.grid) + "%") +
      subc("② 정열의 춤사위 딜증", "+" + passion + "%", "#ffb84d") +
      subc("③ 아크그리드 코어 (낙인 피해)", "+" + r2(B.coreDmg) + "%", "#ffb84d") +
      subc("④ 팔찌 효과 (상시 디버프 환산)", "+" + r2((B.br.mul - 1) * 100) + "%", "#ffb84d") +
      B.br.rows.map(function (r) { return sub("　└ " + r.k, "+" + r2(r.v) + "%"); }).join("");

    var skAll = fd.ArmorySkills || [];
    var awake = skAll.filter(function (x) { return x.Icon && ((x.SkillType || 0) >= 100); })[0] || skAll.filter(function (x) { return x.Icon && (x.Level || 0) > 1; })[0] || skAll.filter(function (x) { return x.Icon; })[0];
    var def = (awake && awake.Icon) || "";   // 팔찌 이미지 대신 직업 스킬 이미지로 대체
    var slots = (fd.ArkGrid || {}).Slots || [];
    var ic1 = (typeof skillIconByName === "function" && skills[0] && skillIconByName(skills[0])) || def;
    var DMG_ICON = {
      "도화가": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_yy/ark_passive_yy_7.png",
      "바드": "https://cdn-lostark.game.onstove.com/efui_iconatlas/bd_skill/bd_skill_01_19.png",
      "홀리나이트": "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_hk/ark_passive_hk_2.png",
      "발키리": "https://cdn-lostark.game.onstove.com/efui_iconatlas/hkf_skill/hkf_skill_01_21.png"
    };
    var ic2 = DMG_ICON[key] || def;
    var brandSlot = ((fd.ArkGrid || {}).Slots || []).filter(function (x) { return /낙인/.test(x.Name || "") && x.Icon; })[0];
    var brandSk = skAll.filter(function (x) {
      return x.Icon && (x.Tripods || []).some(function (t) { return t.IsSelected && /빛의 흔적|낙인/.test(flat(t.Tooltip)); });
    })[0];
    var ic3 = effIcon(fd, /낙인/, /깨달음/) || effIcon(fd, /낙인/) || (brandSk && brandSk.Icon) || (brandSlot && brandSlot.Icon) || effIcon(fd, /./, /깨달음/) || def;
    var sh = shieldRows(fd);
    var hpStat = ((fd.ArmoryProfile || {}).Stats || []).filter(function (x) { return x.Type === "최대 생명력"; })[0];
    var hp = hpStat ? parseInt(String(hpStat.Value).replace(/,/g, ""), 10) || 0 : 0;
    var shDraw = subc("최대 생명력", fmt(hp), "#7fe3b0") + (sh.length ? sh.map(function (r) {
      return sub(r.name + (r.src ? " · " + r.src : "") + (r.mult !== 1 ? " ×" + r.mult : "") + ' <span style="color:#6f7d9c">(' + r2(r.v) + "%)</span>", man(hp * r.v / 100));
    }).join("") : sub("채용 중인 보호막 스킬 없음", ""));
    var shTop = sh.slice().sort(function (x, y) { return y.v - x.v; })[0];
    var shIcon = (shTop && shTop.icon) || "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_01/ark_passive_01_10.png";
    var shMain = shTop ? man(hp * shTop.v / 100) + ' <small style="font-size:12px;color:#9aa8c7">' + sh.length + "개 · " + shTop.name + "</small>" : "-";
    var specPick = specRows.filter(function (r) { return /버프 효율/.test(r.k); })[0] || specRows.filter(function (r) { return /적용 효율/.test(r.k); })[0] || specRows[0];
    var specMain = specPick ? "+" + r2(specPick.v) + "%" : "-";
    var specDraw = specRows.map(function (r) { return sub(r.k, (r.neg ? "-" : "+") + r2(r.v) + "%"); }).join("") || sub("특화 툴팁 없음", "");
    var specVal = spec ? parseInt(String(spec.Value).replace(/,/g, ""), 10) || 0 : 0;
    host.style.display = "";
    host.innerHTML =
      '<div style="grid-column:1/-1;font-weight:800;color:#e8b84b;font-size:14px;margin:6px 2px 0">서폿 버프 효과</div>' +
      card("supAtkCard", "공증 효과", ic1, "+" + fmt(inc) + ' <small style="font-size:13px;color:#9aa8c7">(+' + r2(aSum) + "%)</small>", aDraw, "#7fd1ff") +
      card("supDmgCard", "피증 효과", ic2, dMain, dDraw, "#ff9d6e") +
      card("supBrandCard", "낙인 및 상시 버프", ic3, "+" + r2((total - 1) * 100) + "%", bDraw, "#d9a8ff") +
      card("supSpecCard", "특화 효율", "https://cdn-lostark.game.onstove.com/efui_iconatlas/ark_passive_01/ark_passive_01_18.png",
        specMain + ' <small style="font-size:12px;color:#9aa8c7">' + (specPick ? specPick.k : "") + "</small>",
        sub("특화", fmt(specVal)) + specDraw, "#c4b5fd") +
      card("supShieldCard", "보호막 효율", shIcon, shMain, shDraw, "#7fe3b0");

    // 공속 / 이속 / 보호막 / 팔찌 순서로 아래에 배치
    var as = document.querySelector("#effGrid .mc.as"), ms = document.querySelector("#effGrid .mc.ms"), br = document.getElementById("braceletEffCard");
    var shc = document.getElementById("supShieldCard");
    [as, ms, shc, br].forEach(function (n) { if (n) host.appendChild(n); });

    if (window.console && console.table) console.table({ 공증합: r2(aSum), 낙인력합: r2(bSum), 기본공격력: baseAtk, 공증증가량: fmt(inc) });
  }
  var st = document.createElement("style");
  st.textContent = "#effGrid.sup-mode .mc.crit,#effGrid.sup-mode .mc.cdmg,#effGrid.sup-mode #effDolCard,#effGrid.sup-mode #effEngCard,#effGrid.sup-mode #activeNodeCard{display:none !important}.recent{position:relative;z-index:2000 !important}.recent-list{z-index:2001 !important}";
  if (document.head) document.head.appendChild(st);
  window.renderSupportCards = renderSupport;
  window.__supCollect = collect;

  var orig = window.fillEffDash;
  if (typeof orig === "function") {
    window.fillEffDash = function (stats, equipList, fullData, statMap) {
      var r = orig.apply(this, arguments);
      try { renderSupport(fullData || window.__fullData || {}); } catch (e) { console.warn("[support]", e); }
      return r;
    };
  }
})();
