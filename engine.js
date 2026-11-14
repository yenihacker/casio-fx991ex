/* ==========================================================================
   CASIO fx-991EX CLASSWIZ — MATHEMATICAL, SYMBOLIC & MULTI-MODE ENGINE
   ========================================================================== */

const CASIO_CONSTANTS = [
  { id: "01", sym: "mp", name: "Proton kütlesi", val: 1.672621898e-27, unit: "kg" },
  { id: "02", sym: "mn", name: "Nötron kütlesi", val: 1.674927471e-27, unit: "kg" },
  { id: "03", sym: "me", name: "Elektron kütlesi", val: 9.10938356e-31, unit: "kg" },
  { id: "04", sym: "mμ", name: "Müon kütlesi", val: 1.883531594e-28, unit: "kg" },
  { id: "05", sym: "a0", name: "Bohr yarıçapı", val: 5.2917721067e-11, unit: "m" },
  { id: "06", sym: "h", name: "Planck sabiti", val: 6.62607004e-34, unit: "J·s" },
  { id: "07", sym: "μN", name: "Nükleer magneton", val: 5.050783699e-27, unit: "J/T" },
  { id: "08", sym: "μB", name: "Bohr magnetonu", val: 9.274009994e-24, unit: "J/T" },
  { id: "09", sym: "ℏ", name: "İndirgenmiş Planck (h/2π)", val: 1.0545718e-34, unit: "J·s" },
  { id: "10", sym: "α", name: "İnce yapı sabiti", val: 7.2973525664e-3, unit: "" },
  { id: "11", sym: "re", name: "Klasik elektron yarıçapı", val: 2.8179403227e-15, unit: "m" },
  { id: "12", sym: "λc", name: "Compton dalga boyu", val: 2.4263102367e-12, unit: "m" },
  { id: "13", sym: "γp", name: "Proton jiromanyetik oranı", val: 267522190.0, unit: "1/(s·T)" },
  { id: "14", sym: "λcp", name: "Proton Compton dalga boyu", val: 1.32140985396e-15, unit: "m" },
  { id: "15", sym: "λcn", name: "Nötron Compton dalga boyu", val: 1.31959090481e-15, unit: "m" },
  { id: "16", sym: "R∞", name: "Rydberg sabiti", val: 10973731.568508, unit: "1/m" },
  { id: "17", sym: "u", name: "Atomik kütle birimi", val: 1.66053904e-27, unit: "kg" },
  { id: "18", sym: "μp", name: "Proton manyetik momenti", val: 1.4106067873e-26, unit: "J/T" },
  { id: "19", sym: "μe", name: "Elektron manyetik momenti", val: -9.28476462e-24, unit: "J/T" },
  { id: "20", sym: "μn", name: "Nötron manyetik momenti", val: -9.662365e-27, unit: "J/T" },
  { id: "21", sym: "μμ", name: "Müon manyetik momenti", val: -4.49044826e-26, unit: "J/T" },
  { id: "22", sym: "F", name: "Faraday sabiti", val: 96485.33289, unit: "C/mol" },
  { id: "23", sym: "e", name: "Temel elektrik yükü", val: 1.6021766208e-19, unit: "C" },
  { id: "24", sym: "NA", name: "Avogadro sabiti", val: 6.022140857e23, unit: "1/mol" },
  { id: "25", sym: "k", name: "Boltzmann sabiti", val: 1.38064852e-23, unit: "J/K" },
  { id: "26", sym: "Vm", name: "İdeal gaz molar hacmi", val: 0.022710947, unit: "m³/mol" },
  { id: "27", sym: "R", name: "Molar gaz sabiti", val: 8.3144598, unit: "J/(mol·K)" },
  { id: "28", sym: "c0", name: "Vakumda ışık hızı", val: 299792458, unit: "m/s" },
  { id: "29", sym: "c1", name: "Birinci radyasyon sabiti", val: 3.74177179e-16, unit: "W·m²" },
  { id: "30", sym: "c2", name: "İkinci radyasyon sabiti", val: 0.0143877736, unit: "m·K" },
  { id: "31", sym: "σ", name: "Stefan-Boltzmann sabiti", val: 5.670367e-8, unit: "W/(m²·K⁴)" },
  { id: "32", sym: "ε0", name: "Vakum elektrik geçirgenliği", val: 8.854187817e-12, unit: "F/m" },
  { id: "33", sym: "μ0", name: "Vakum manyetik geçirgenliği", val: 1.2566370614e-6, unit: "N/A²" },
  { id: "34", sym: "Φ0", name: "Manyetik akı kuantumu", val: 2.067833831e-15, unit: "Wb" },
  { id: "35", sym: "g", name: "Standart yerçekimi ivmesi", val: 9.80665, unit: "m/s²" },
  { id: "36", sym: "G0", name: "İletkenlik kuantumu", val: 7.748091731e-5, unit: "S" },
  { id: "37", sym: "Z0", name: "Vakum karakteristik empedansı", val: 376.730313461, unit: "Ω" },
  { id: "38", sym: "t", name: "Celsius sıcaklığı (0°C)", val: 273.15, unit: "K" },
  { id: "39", sym: "G", name: "Evrensel çekim sabiti", val: 6.67408e-11, unit: "m³/(kg·s²)" },
  { id: "40", sym: "atm", name: "Standart atmosfer basıncı", val: 101325, unit: "Pa" }
];

const CASIO_CONVERSIONS = [
  { id: "01", label: "in▸cm", fn: x => x * 2.54 },
  { id: "02", label: "cm▸in", fn: x => x / 2.54 },
  { id: "03", label: "ft▸m", fn: x => x * 0.3048 },
  { id: "04", label: "m▸ft", fn: x => x / 0.3048 },
  { id: "05", label: "yd▸m", fn: x => x * 0.9144 },
  { id: "06", label: "m▸yd", fn: x => x / 0.9144 },
  { id: "07", label: "mile▸km", fn: x => x * 1.609344 },
  { id: "08", label: "km▸mile", fn: x => x / 1.609344 },
  { id: "09", label: "n mile▸m", fn: x => x * 1852 },
  { id: "10", label: "m▸n mile", fn: x => x / 1852 },
  { id: "11", label: "acre▸m²", fn: x => x * 4046.8564224 },
  { id: "12", label: "m²▸acre", fn: x => x / 4046.8564224 },
  { id: "13", label: "gal(US)▸L", fn: x => x * 3.785411784 },
  { id: "14", label: "L▸gal(US)", fn: x => x / 3.785411784 },
  { id: "15", label: "gal(UK)▸L", fn: x => x * 4.54609 },
  { id: "16", label: "L▸gal(UK)", fn: x => x / 4.54609 },
  { id: "17", label: "pc▸km", fn: x => x * 3.085677581e13 },
  { id: "18", label: "km▸pc", fn: x => x / 3.085677581e13 },
  { id: "19", label: "km/h▸m/s", fn: x => x / 3.6 },
  { id: "20", label: "m/s▸km/h", fn: x => x * 3.6 },
  { id: "21", label: "oz▸g", fn: x => x * 28.349523125 },
  { id: "22", label: "g▸oz", fn: x => x / 28.349523125 },
  { id: "23", label: "lb▸kg", fn: x => x * 0.45359237 },
  { id: "24", label: "kg▸lb", fn: x => x / 0.45359237 },
  { id: "25", label: "atm▸Pa", fn: x => x * 101325 },
  { id: "26", label: "Pa▸atm", fn: x => x / 101325 },
  { id: "27", label: "mmHg▸Pa", fn: x => x * 133.322387415 },
  { id: "28", label: "Pa▸mmHg", fn: x => x / 133.322387415 },
  { id: "29", label: "hp▸kW", fn: x => x * 0.745699872 },
  { id: "30", label: "kW▸hp", fn: x => x / 0.745699872 },
  { id: "31", label: "kgf/cm²▸Pa", fn: x => x * 98066.5 },
  { id: "32", label: "Pa▸kgf/cm²", fn: x => x / 98066.5 },
  { id: "33", label: "kgf·m▸J", fn: x => x * 9.80665 },
  { id: "34", label: "J▸kgf·m", fn: x => x / 9.80665 },
  { id: "35", label: "lbf/in²▸kPa", fn: x => x * 6.894757293 },
  { id: "36", label: "kPa▸lbf/in²", fn: x => x / 6.894757293 },
  { id: "37", label: "°F▸°C", fn: x => (x - 32) * 5 / 9 },
  { id: "38", label: "°C▸°F", fn: x => x * 9 / 5 + 32 },
  { id: "39", label: "J▸cal", fn: x => x / 4.184 },
  { id: "40", label: "cal▸J", fn: x => x * 4.184 }
];

const CLASSWIZ_MODES = [
  { id: 1, key: "1", name: "Calculate", trName: "1:Calculate", icon: "＋－\n×÷" },
  { id: 2, key: "2", name: "Complex", trName: "2:Complex", icon: "a+bi" },
  { id: 3, key: "3", name: "Base-N", trName: "3:Base-N", icon: "DEC\nBIN" },
  { id: 4, key: "4", name: "Matrix", trName: "4:Matrix", icon: "[a b]\n[c d]" },
  { id: 5, key: "5", name: "Vector", trName: "5:Vector", icon: "↗Vct" },
  { id: 6, key: "6", name: "Statistics", trName: "6:Statistics", icon: "📊Stat" },
  { id: 7, key: "7", name: "Distribution", trName: "7:Distribution", icon: "🔔Dist" },
  { id: 8, key: "8", name: "Spreadsheet", trName: "8:Spreadsheet", icon: "▦Cell" },
  { id: 9, key: "9", name: "Table", trName: "9:Table", icon: "f(x)\ng(x)" },
  { id: 10, key: "A", name: "Equation/Func", trName: "A:Equation/Func", icon: "ax²+\nbx+c" },
  { id: 11, key: "B", name: "Inequality", trName: "B:Inequality", icon: "ax²>0" },
  { id: 12, key: "C", name: "Verify", trName: "C:Verify", icon: "A=B?" }
];

/* ==========================================================================
   MATH HELPER FUNCTIONS
   ========================================================================== */
function gcdInt(a, b) {
  // NaN/∞ ile "while (b !== 0)" hiç bitmiyordu → GCD( boş argümanla sekmeyi donduruyordu
  if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

function lcmInt(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;
  if (a === 0 || b === 0) return 0;
  return Math.abs((a * b) / gcdInt(a, b));
}

function factorial(n) {
  if (n < 0 || !Number.isFinite(n)) return NaN;
  if (Math.abs(n - Math.round(n)) > 1e-9) return NaN;
  n = Math.round(n);
  if (n > 170) return Infinity;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function nPr(n, r) {
  n = Math.round(n);
  r = Math.round(r);
  if (n < 0 || r < 0 || r > n) return NaN;
  let res = 1;
  for (let i = 0; i < r && Number.isFinite(res); i++) res *= (n - i);
  return res;
}

function nCr(n, r) {
  n = Math.round(n);
  r = Math.round(r);
  if (n < 0 || r < 0 || r > n) return NaN;
  if (r > n - r) r = n - r;
  let res = 1;
  for (let i = 1; i <= r && Number.isFinite(res); i++) {
    res = (res * (n - r + i)) / i;
  }
  return Math.round(res);
}

/* Continued Fraction Rational Approximation: returns { n, d } or null */
function toExactFraction(val, maxDenom = 9999, tol = 1e-10) {
  if (!Number.isFinite(val) || Math.abs(val) > 1e8) return null;
  const sign = val < 0 ? -1 : 1;
  let x = Math.abs(val);
  if (Math.abs(x - Math.round(x)) < tol) {
    return { n: sign * Math.round(x), d: 1 };
  }
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
  let b = x;
  for (let i = 0; i < 35; i++) {
    const a = Math.floor(b + 1e-12);
    const h = a * h1 + h2;
    const k = a * k1 + k2;
    if (k > maxDenom) break;
    h2 = h1; h1 = h;
    k2 = k1; k1 = k;
    if (Math.abs(x - h1 / k1) <= tol * Math.max(1, x)) {
      const g = gcdInt(h1, k1);
      return { n: sign * (h1 / g), d: k1 / g };
    }
    const rem = b - a;
    if (Math.abs(rem) < 1e-12) break;
    b = 1 / rem;
  }
  return null;
}

/* Recognize exact surds (a*sqrt(b))/c or pi multiples */
function toSymbolicForm(val) {
  if (!Number.isFinite(val) || val === 0) return null;
  // 1. Pure integer?
  if (Math.abs(val - Math.round(val)) < 1e-10) return null;

  // 2. Exact rational fraction?
  const frac = toExactFraction(val, 2500, 1e-10);
  if (frac && frac.d > 1) {
    return {
      type: "fraction",
      n: frac.n,
      d: frac.d,
      html: `<span class="math-frac"><span class="math-frac-num">${frac.n}</span><span class="math-frac-den">${frac.d}</span></span>`,
      mixedHtml: Math.abs(frac.n) > frac.d
        ? `${frac.n < 0 ? "-" : ""}${Math.floor(Math.abs(frac.n) / frac.d)}<span class="math-frac"><span class="math-frac-num">${Math.abs(frac.n) % frac.d}</span><span class="math-frac-den">${frac.d}</span></span>`
        : null
    };
  }

  // 3. Exact multiple of pi?  (n === 0 would print "0π" for tiny values → skip)
  const piRatio = toExactFraction(val / Math.PI, 180, 1e-9);
  if (piRatio && piRatio.n !== 0 && Math.abs(piRatio.n) <= 360) {
    const { n, d } = piRatio;
    const numStr = n === 1 ? "π" : n === -1 ? "-π" : `${n}π`;
    if (d === 1) {
      return { type: "pi", html: numStr };
    }
    return {
      type: "pi",
      html: `<span class="math-frac"><span class="math-frac-num">${numStr}</span><span class="math-frac-den">${d}</span></span>`
    };
  }

  // 4. Exact simple radical: (a * sqrt(b)) / d
  const sqFree = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23, 26, 29, 30];
  for (const b of sqFree) {
    const r = Math.sqrt(b);
    const ratio = toExactFraction(val / r, 60, 1e-9);
    if (ratio && ratio.n !== 0 && Math.abs(ratio.n) <= 100) {
      const { n, d } = ratio;
      const coeff = n === 1 ? "" : n === -1 ? "-" : `${n}`;
      const radHtml = `${coeff}<span class="math-sqrt"><span class="math-sqrt-sym">√</span><span class="math-sqrt-body">${b}</span></span>`;
      if (d === 1) {
        return { type: "surd", html: radHtml };
      }
      return {
        type: "surd",
        html: `<span class="math-frac"><span class="math-frac-num">${radHtml}</span><span class="math-frac-den">${d}</span></span>`
      };
    }
  }

  return null;
}

/* Prime Factorization (FACT) */
function primeFactorize(num) {
  if (!Number.isFinite(num) || num <= 1 || Math.abs(num - Math.round(num)) > 1e-9 || num > 9e12) {
    return null;
  }
  let n = Math.round(num);
  const factors = [];
  let d = 2;
  while (d * d <= n) {
    if (n % d === 0) {
      let count = 0;
      while (n % d === 0) {
        count++;
        n = Math.floor(n / d);
      }
      factors.push({ p: d, e: count });
    }
    d += d === 2 ? 1 : 2;
  }
  if (n > 1) factors.push({ p: n, e: 1 });
  return factors
    .map(f => f.e > 1 ? `${f.p}<span class="math-sup">${f.e}</span>` : `${f.p}`)
    .join(" × ");
}

/* Sexagesimal (Degrees Minutes Seconds) Formatter */
function toDMSString(val) {
  if (!Number.isFinite(val)) return null;
  const sign = val < 0 ? "-" : "";
  let abs = Math.abs(val);
  const deg = Math.floor(abs + 1e-11);
  abs = (abs - deg) * 60;
  const min = Math.floor(abs + 1e-9);
  const sec = Math.round((abs - min) * 60 * 100) / 100;
  return `${sign}${deg}° ${min}′ ${sec}″`;
}

/* Engineering Notation Formatter */
const ENG_PREFIXES = {
  "-15": "f",
  "-12": "p",
  "-9": "n",
  "-6": "μ",
  "-3": "m",
  "0": "",
  "3": "k",
  "6": "M",
  "9": "G",
  "12": "T"
};

/* shiftSteps: 0 = standart ENG gösterimi; her ENG basışı −1 (virgül sağa, üs −3),
   her SHIFT+ENG (←) basışı +1 (virgül sola, üs +3) — gerçek fx-991EX davranışı. */
function formatEngineering(val, shiftSteps = 0, useSymbols = false) {
  if (!Number.isFinite(val)) return "Math ERROR";
  if (val === 0) return "0×10<span class=\"math-sup\">0</span>";
  // 10 anlamlı basamağa yuvarlayıp üssü ondan hesapla (999.99999999 → 1000 gibi sınır hatalarını önler)
  const rounded = Number(val.toPrecision(10));
  let exp3 = Math.floor(Math.floor(Math.log10(Math.abs(rounded)) + 1e-12) / 3) * 3;
  exp3 += shiftSteps * 3;
  const mantissa = rounded / Math.pow(10, exp3);
  const cleanMant = Number(mantissa.toPrecision(10));
  if (useSymbols && ENG_PREFIXES[String(exp3)] !== undefined && exp3 !== 0) {
    return `${cleanMant} ${ENG_PREFIXES[String(exp3)]}`;
  }
  return `${cleanMant}×10<span class="math-sup">${exp3}</span>`;
}

/* Number Format helper (Norm / Fix / Sci) */
function formatSciNotation(val, sigDigits, trimZeros) {
  // toExponential mantisayı her zaman [1,10) aralığında verir (eski kod 9.99→"10.00×10⁰" üretebiliyordu)
  const [m, e] = val.toExponential(sigDigits - 1).split("e");
  const mant = trimZeros ? String(Number(m)) : m;
  return `${mant}×10<span class="math-sup">${Number(e)}</span>`;
}

function formatNumberDisplay(val, settings) {
  if (!Number.isFinite(val)) return "Math ERROR";
  // Gerçek hesap makinesi yalnızca |x| < 1×10⁻⁹⁹ değerleri 0 gösterir.
  // (Eski kod |x| < 1e-14 olan her şeyi 0 yapıyordu → Planck sabiti, elektron kütlesi vb. "0" görünüyordu.)
  if (Math.abs(val) < 1e-99) val = 0;
  const abs = Math.abs(val);

  if (settings.numFormat === "FIX") {
    if (abs >= 1e10) return formatSciNotation(val, 10, true);
    const fixed = val.toFixed(settings.fixDigits);
    return /^-0(\.0*)?$/.test(fixed) ? fixed.slice(1) : fixed;
  }
  if (settings.numFormat === "SCI") {
    if (val === 0) return `${(0).toFixed(settings.sciDigits - 1)}×10<span class="math-sup">0</span>`;
    return formatSciNotation(val, settings.sciDigits, false);
  }

  // Normal mode (sınırı 10 basamağa yuvarlanmış değere göre seç: 9999999999.6 → 1×10¹⁰)
  const rounded = Number(val.toPrecision(10));
  const rAbs = Math.abs(rounded);
  if (rAbs > 0 && (rAbs >= 1e10 || rAbs < (settings.normMode === 1 ? 1e-2 : 1e-9))) {
    return formatSciNotation(val, 10, true);
  }
  return String(rounded);
}

/* Bir sayıyı hesap makinesine yeniden girilebilecek metne çevirir
   (ör. 1.6e-27 → "1.6×10^(-27)"). Sabit ekleme ve giriş ekranı varsayılanlarında kullanılır. */
function numberToInputString(v) {
  if (typeof v !== "number" || !Number.isFinite(v)) return String(v);
  const clean = Number(v.toPrecision(10));
  const s = String(clean);
  if (!/e/i.test(s)) return s;
  const [m, e] = clean.toExponential().split("e");
  return `${Number(m)}×10^(${Number(e)})`;
}

/* ==========================================================================
   NATURAL EXPRESSION EVALUATOR (Supports 2D templates, Calculus, Complex, Vars)
   ========================================================================== */
/* --------------------------------------------------------------------------
   Casio ifadesini JavaScript'e çevirir.
   Düzeltmeler: küpkök (³√), "2sin(30)" gibi sayı+fonksiyon yazımı, ×10ˣ'in tek sayı
   gibi davranması, tekli eksi önceliği (−2² = −4, 5−(−2) = 7), Ans!, Ans(2),
   1.6e-27 gibi üstel sayılar.
   -------------------------------------------------------------------------- */
function convertExprToJS(rawExpr, angleUnit = "DEG") {
  let s = rawExpr.trim();
  if (!s) return "0";

  // 1) JS üstel yazımıyla gelen sayılar (1.6e-27) → tek bir sayı grubu
  s = s.replace(/(\d+(?:\.\d+)?|\.\d+)e([+\-−]?\d+)/g, "($1*10**($2))");

  // 2) Sayıya bitişik ×10^(n): Casio'da tek bir sayı girişidir → 2÷5×10³ = 2÷5000
  s = s.replace(/(\d+(?:\.\d*)?|\.\d+)×10\^\(([^()]*)\)/g, "($1*10**($2))");

  // 3) Derece-dakika-saniye girişi: 12°30°45°
  s = s.replace(/(\d+(?:\.\d+)?)°(\d+(?:\.\d+)?)°(\d+(?:\.\d+)?)°/g, "((($1)+($2)/60+($3)/3600))");
  s = s.replace(/(\d+(?:\.\d+)?)°(\d+(?:\.\d+)?)°/g, "((($1)+($2)/60))");
  s = s.replace(/(\d+(?:\.\d+)?)°/g, "($1)");

  // 4) Özel şablonlar (küpkök, ³ → **3 dönüşümünden ÖNCE yapılmalı)
  s = s
    .replace(/d\/dx\(/g, "__deriv(")
    .replace(/∫\(/g, "__integ(")
    .replace(/∑\(/g, "__sum(")
    .replace(/³√\(/g, "Math.cbrt(")
    .replace(/√\(/g, "Math.sqrt(")
    .replace(/RanInt#\(/g, "__ranInt(")
    .replace(/Ran#/g, "Math.random()");

  // 5) Fonksiyon adları (\b yerine "öncesinde harf yok" kontrolü → 2sin(30) de çalışır)
  for (const [re, to] of CASIO_FUNC_MAP) s = s.replace(re, to);

  // 6) Semboller
  s = s
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/π/g, "(Math.PI)")
    .replace(/𝒆/g, "(Math.E)")
    .replace(/²/g, "**2")
    .replace(/³/g, "**3")
    .replace(/⁻¹/g, "**(-1)")
    .replace(/\^/g, "**");

  // 7) Yüzde, permütasyon / kombinasyon
  s = s.replace(/(\d+(?:\.\d+)?)%/g, "(($1)/100)");
  s = s.replace(/(\d+|\([^()]+\)|[A-FMxy])\s*P\s*(\d+|\([^()]+\)|[A-FMxy])/g, "__nPr($1,$2)");
  s = s.replace(/(\d+|\([^()]+\)|[A-FMxy])\s*C\s*(\d+|\([^()]+\)|[A-FMxy])/g, "__nCr($1,$2)");

  // 8) Sonek faktöriyel (Ans!, (2+3)!, √(4)! ...)
  s = replaceFactorials(s);

  // 9) Gizli çarpma: 2(3), (2)(3), 2sin, 2π, 2x, xy, Ans(2)
  s = s.replace(/(\d|\))(?=\s*(?:__|[a-zA-Z(]|Math\.))/g, "$1*");
  // (ABC gibi 3+ değişken yan yana olduğunda tek geçiş yetmez → değişmeyene kadar tekrarla)
  for (let pass = 0; pass < 12; pass++) {
    const before = s;
    s = s.replace(/(?<![a-zA-Z0-9_$.])([A-FMxy])(?=\s*(?:\d|\(|__|Math\.|[A-FMxy]))/g, "$1*");
    if (s === before) break;
  }
  s = s.replace(/(?<![A-Za-z0-9_$.])(PreAns|Ans)(?=\s*(?:[\d(]|__|Math\.|[A-Za-z]))/g, "$1*");

  // 10) Kapanmamış parantezleri otomatik kapat (ClassWiz gibi)
  let openCount = 0;
  for (const ch of s) {
    if (ch === "(") openCount++;
    else if (ch === ")") openCount = Math.max(0, openCount - 1);
  }
  if (openCount > 0) s += ")".repeat(openCount);

  // 11) Tekli eksi: Casio önceliğiyle sar (JS'de "-2**2" ve "5--2" sözdizimi hatasıdır)
  return wrapUnaryMinus(s);
}

const CASIO_FUNC_MAP = [
  ["sinh⁻¹(", "Math.asinh("], ["cosh⁻¹(", "Math.acosh("], ["tanh⁻¹(", "Math.atanh("],
  ["sin⁻¹(", "__asin("], ["cos⁻¹(", "__acos("], ["tan⁻¹(", "__atan("],
  ["sinh(", "Math.sinh("], ["cosh(", "Math.cosh("], ["tanh(", "Math.tanh("],
  ["sin(", "__sin("], ["cos(", "__cos("], ["tan(", "__tan("],
  ["log(", "__log("], ["ln(", "Math.log("],
  ["Abs(", "Math.abs("], ["Int(", "Math.trunc("], ["Frac(", "__fracPart("], ["Rnd(", "__rnd("],
  ["GCD(", "__gcd("], ["LCM(", "__lcm("], ["mfrac(", "__mfrac("], ["frac(", "__frac("],
  ["nthroot(", "__nthroot("], ["Pol(", "__pol("], ["Rec(", "__rec("]
].map(([from, to]) => [new RegExp("(?<![A-Za-z_$.])" + from.replace(/[()]/g, "\\$&"), "g"), to]);

function matchParenForward(s, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < s.length; i++) {
    if (s[i] === "(") depth++;
    else if (s[i] === ")") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function matchParenBackward(s, closeIdx) {
  let depth = 0;
  for (let i = closeIdx; i >= 0; i--) {
    if (s[i] === ")") depth++;
    else if (s[i] === "(") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/* "!" sonekini __fact(...) yapar. İşlenen: sayı, tek harfli değişken, Ans/PreAns,
   parantez grubu ya da fonksiyon çağrısı. */
function replaceFactorials(s) {
  let idx;
  while ((idx = s.indexOf("!")) !== -1) {
    let p = idx - 1;
    while (p >= 0 && s[p] === " ") p--;
    if (p < 0) throw new Error("Syntax ERROR");
    let start;
    if (s[p] === ")") {
      const open = matchParenBackward(s, p);
      if (open < 0) throw new Error("Syntax ERROR");
      const fn = s.slice(0, open).match(/(?:__[A-Za-z]+|Math\.[A-Za-z0-9]+)$/);
      start = fn ? open - fn[0].length : open;
    } else if (/[0-9.]/.test(s[p])) {
      start = p;
      while (start > 0 && /[0-9.]/.test(s[start - 1])) start--;
    } else if (/[A-Za-z]/.test(s[p])) {
      const m = s.slice(0, p + 1).match(/(?:PreAns|Ans)$/);
      start = m ? p + 1 - m[0].length : p;
    } else {
      throw new Error("Syntax ERROR");
    }
    s = s.slice(0, start) + "__fact(" + s.slice(start, p + 1) + ")" + s.slice(idx + 1);
  }
  return s;
}

function scanPrimaryEnd(s, j) {
  if (j >= s.length) return j;
  const ch = s[j];
  if (ch === "(") {
    const k = matchParenForward(s, j);
    return k === -1 ? s.length : k + 1;
  }
  if (/[0-9.]/.test(ch)) {
    let k = j;
    while (k < s.length && /[0-9.]/.test(s[k])) k++;
    return k;
  }
  if (/[A-Za-z_$]/.test(ch)) {
    let k = j;
    while (k < s.length && /[A-Za-z0-9_$.]/.test(s[k])) k++;
    if (s[k] === "(") {
      const m = matchParenForward(s, k);
      return m === -1 ? s.length : m + 1;
    }
    return k;
  }
  return j;
}

function scanPowerTermEnd(s, j) {
  let k = scanPrimaryEnd(s, j);
  while (s.startsWith("**", k)) {
    let m = k + 2;
    if (s[m] === "-" || s[m] === "+") m++;
    k = scanPrimaryEnd(s, m);
  }
  return k;
}

/* Tekli eksiyi "(-(...))" biçiminde sarar; işlenen bir üs zinciridir (−2² → −(2²)). */
function wrapUnaryMinus(s) {
  const positions = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== "-") continue;
    let p = i - 1;
    while (p >= 0 && s[p] === " ") p--;
    if (p < 0 || "(,+-*/=<>".includes(s[p])) positions.push(i);
  }
  for (let n = positions.length - 1; n >= 0; n--) {
    const i = positions[n];
    const end = scanPowerTermEnd(s, i + 1);
    s = s.slice(0, i) + "(-(" + s.slice(i + 1, end) + "))" + s.slice(end);
  }
  return s;
}

/* İptal (cancellation) gürültüsü için büyüklük ifadesi: üs parantezleri dışındaki ikili
   eksileri artıya çevirir. 0.1+0.2−0.3 gibi işlemlerin 5.55×10⁻¹⁷ yerine 0 görünmesi için. */
function buildMagnitudeExpr(raw) {
  let out = "";
  const expStack = [];
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === "(") {
      expStack.push(Boolean((expStack.length && expStack[expStack.length - 1]) || raw[i - 1] === "^"));
      out += ch;
      continue;
    }
    if (ch === ")") {
      expStack.pop();
      out += ch;
      continue;
    }
    const inExp = expStack.length && expStack[expStack.length - 1];
    if ((ch === "−" || ch === "-") && !inExp) {
      const before = raw.slice(0, i).replace(/\s+$/, "");
      const binary =
        !/\de$/.test(before) &&
        (/[0-9.)A-Za-z²³!%π°]$/.test(before) || before.endsWith("𝒆") || before.endsWith("⁻¹"));
      if (binary) {
        out += "+";
        continue;
      }
    }
    out += ch;
  }
  return out;
}

/* Zaman sınırı: iç içe integral/toplam gibi çok uzun hesaplar tarayıcıyı dondurmasın
   (gerçek cihaz bu durumda "Time Out" gösterir). */
const EVAL_GUARD = { deadline: 0 };
function runWithTimeBudget(ms, fn) {
  if (EVAL_GUARD.deadline) return fn(); // zaten bir zaman bütçesinin içindeyiz
  EVAL_GUARD.deadline = Date.now() + ms;
  try {
    return fn();
  } finally {
    EVAL_GUARD.deadline = 0;
  }
}
function checkTimeBudget() {
  if (EVAL_GUARD.deadline && Date.now() > EVAL_GUARD.deadline) throw new Error("Time Out");
}

function evaluateMathExpression(rawExpr, state, overrideVars = {}) {
  return runWithTimeBudget(3000, () => evaluateMathExpressionCore(rawExpr, state, overrideVars));
}

function evaluateMathExpressionCore(rawExpr, state, overrideVars = {}) {
  const angleUnit = state.settings.angleUnit;
  const toRad = a =>
    angleUnit === "DEG" ? (a * Math.PI) / 180 : angleUnit === "GRA" ? (a * Math.PI) / 200 : a;
  const fromRad = r =>
    angleUnit === "DEG" ? (r * 180) / Math.PI : angleUnit === "GRA" ? (r * 200) / Math.PI : r;

  const vars = { ...state.vars, Ans: state.ans, PreAns: state.preAns, ...overrideVars };

  // DEG/GRA'da açıyı tam tura indirger; 90°'nin katlarında tam değer döner (sin 1800° = 0, tan 90° = ERROR)
  const fullTurn = angleUnit === "DEG" ? 360 : angleUnit === "GRA" ? 400 : 0;
  const reduceAngle = x => {
    if (!fullTurn) return x;
    let r = x % fullTurn;
    if (r < 0) r += fullTurn;
    return r;
  };
  const quarterIndex = x => {
    if (!fullTurn || !Number.isFinite(x)) return -1;
    const k = reduceAngle(x) / (fullTurn / 4);
    return Math.abs(k - Math.round(k)) < 1e-12 ? Math.round(k) % 4 : -1;
  };
  const __sin = x => {
    const q = quarterIndex(x);
    if (q >= 0) return [0, 1, 0, -1][q];
    const v = Math.sin(toRad(reduceAngle(x)));
    return Math.abs(v) < 1e-15 ? 0 : v;
  };
  const __cos = x => {
    const q = quarterIndex(x);
    if (q >= 0) return [1, 0, -1, 0][q];
    const v = Math.cos(toRad(reduceAngle(x)));
    return Math.abs(v) < 1e-15 ? 0 : v;
  };
  const __tan = x => {
    const q = quarterIndex(x);
    if (q === 1 || q === 3) return NaN;
    if (q === 0 || q === 2) return 0;
    const c = __cos(x);
    if (Math.abs(c) < 1e-14) return NaN;
    return __sin(x) / c;
  };
  const __asin = x => fromRad(Math.asin(x));
  const __acos = x => fromRad(Math.acos(x));
  const __atan = x => fromRad(Math.atan(x));
  const __log = (a, b) => (b === undefined ? Math.log10(a) : Math.log(b) / Math.log(a));
  const __fact = x => factorial(x);
  const __nPr = (n, r) => nPr(n, r);
  const __nCr = (n, r) => nCr(n, r);
  const intArg = v => (Number.isFinite(v) && Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v) : NaN);
  const __gcd = (a, b) => gcdInt(intArg(a), intArg(b));
  const __lcm = (a, b) => lcmInt(intArg(a), intArg(b));
  const __frac = (a, b) => a / b;
  const __mfrac = (w, a, b) => (w < 0 ? w - a / b : w + a / b);
  const __nthroot = (n, x) => (x < 0 && Math.abs(n % 2) === 1 ? -Math.pow(-x, 1 / n) : Math.pow(x, 1 / n));
  const __fracPart = x => x - Math.trunc(x);
  // Rnd: gerçek cihazdaki gibi geçerli gösterim biçimine (Fix/Sci/Norm) göre yuvarlar
  const __rnd = x => {
    const st = state.settings;
    if (st.numFormat === "FIX") return Number(x.toFixed(st.fixDigits));
    if (st.numFormat === "SCI") return Number(x.toPrecision(st.sciDigits));
    return Number(x.toPrecision(10));
  };
  const __ranInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + Math.ceil(a);
  const __pol = (x, y) => {
    const r = Math.hypot(x, y);
    const theta = fromRad(Math.atan2(y, x));
    state.vars.x = r;
    state.vars.y = theta;
    return r;
  };
  const __rec = (r, theta) => {
    const x = r * __cos(theta);
    const y = r * __sin(theta);
    state.vars.x = x;
    state.vars.y = y;
    return x;
  };

  // Sayısal türev: d/dx(f(x), x0) — 5 noktalı merkezi fark
  const __deriv = (fn, x0) => {
    const h = Math.max(1e-5, Math.abs(x0) * 1e-5);
    const d = (-fn(x0 + 2 * h) + 8 * fn(x0 + h) - 8 * fn(x0 - h) + fn(x0 - 2 * h)) / (12 * h);
    return Number(d.toPrecision(11));
  };

  // Belirli integral: uyarlamalı Gauss–Kronrod (G7/K15). Uç noktalarda fonksiyonu
  // hesaplamadığı için ∫ln(x)dx [0,1] veya ∫1/√x dx [0,1] gibi integraller de çalışır.
  const __integ = (fn, a, b) => integrateAdaptive(fn, a, b);

  // Toplam: ∑(f(x), başlangıç, bitiş)
  const __sum = (fn, start, end) => {
    const a = Math.round(start);
    const b = Math.round(end);
    if (b < a || b - a > 10000) return NaN;
    let total = 0;
    for (let k = a; k <= b; k++) {
      if ((k & 63) === 0) checkTimeBudget();
      total += fn(k);
    }
    return total;
  };

  const processed = transformCalculusCalls(rawExpr);
  const jsCode = convertExprToJS(processed, angleUnit);

  const fn = new Function(
    "vars",
    "__sin", "__cos", "__tan", "__asin", "__acos", "__atan",
    "__log", "__fact", "__nPr", "__nCr", "__gcd", "__lcm",
    "__frac", "__mfrac", "__nthroot",
    "__fracPart", "__rnd", "__ranInt", "__pol", "__rec",
    "__deriv", "__integ", "__sum",
    `const { A, B, C, D, E, F, x, y, z, M, Ans, PreAns } = vars;
     return (${jsCode});`
  );

  return fn(
    vars,
    __sin, __cos, __tan, __asin, __acos, __atan,
    __log, __fact, __nPr, __nCr, __gcd, __lcm,
    __frac, __mfrac, __nthroot,
    __fracPart, __rnd, __ranInt, __pol, __rec,
    __deriv, __integ, __sum
  );
}

/* Gauss–Kronrod 15 noktalı kural (QUADPACK qk15 katsayıları) */
const GK15_XGK = [
  0.991455371120812639206854697526329, 0.949107912342758524526189684047851,
  0.864864423359769072789712788640926, 0.741531185599394439863864773280788,
  0.586087235467691130294144845693013, 0.405845151377397166906606412076961,
  0.207784955007898467600689403773245, 0.0
];
const GK15_WGK = [
  0.022935322010529224963732008058970, 0.063092092629978553290700663189204,
  0.104790010322250183839876322541518, 0.140653259715525918745189590510238,
  0.169004726639267902826583426598550, 0.190350578064785409913256402421014,
  0.204432940075298892414161999234649, 0.209482141084727828012999174891714
];
const GK15_WG = [
  0.129484966168869693270611432679082, 0.279705391489276667901467771423780,
  0.381830050505118944950369775488975, 0.417959183673469387755102040816327
];

function gaussKronrod15(f, a, b) {
  checkTimeBudget();
  const c = (a + b) / 2;
  const h = (b - a) / 2;
  const fc = f(c);
  let resK = fc * GK15_WGK[7];
  let resG = fc * GK15_WG[3];
  for (let j = 0; j < 7; j++) {
    const dx = h * GK15_XGK[j];
    const pair = f(c - dx) + f(c + dx);
    resK += GK15_WGK[j] * pair;
    if (j % 2 === 1) resG += GK15_WG[(j - 1) / 2] * pair;
  }
  return { value: resK * h, error: Math.abs((resK - resG) * h) };
}

function integrateAdaptive(f, a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;
  if (a === b) return 0;
  let intervals = [{ a, b, ...gaussKronrod15(f, a, b) }];
  let total = 0, totalErr = 0;
  for (let iter = 0; iter < 400; iter++) {
    total = 0;
    totalErr = 0;
    let worst = 0;
    for (let i = 0; i < intervals.length; i++) {
      total += intervals[i].value;
      totalErr += intervals[i].error;
      if (intervals[i].error > intervals[worst].error) worst = i;
    }
    if (!Number.isFinite(total)) return NaN;
    if (totalErr <= Math.max(1e-14, 1e-12 * Math.abs(total))) return total;
    const iv = intervals[worst];
    const m = (iv.a + iv.b) / 2;
    if (m === iv.a || m === iv.b) break;
    intervals.splice(worst, 1, { a: iv.a, b: m, ...gaussKronrod15(f, iv.a, m) }, { a: m, b: iv.b, ...gaussKronrod15(f, m, iv.b) });
  }
  // Yakınsamadıysa (ıraksak integral vb.) yalnızca makul hassasiyetteyse sonucu ver
  return totalErr <= 1e-7 * Math.max(1, Math.abs(total)) ? total : NaN;
}

function transformCalculusCalls(str) {
  const targets = ["d/dx(", "∫(", "∑("];
  let out = str;
  for (const t of targets) {
    let idx = out.indexOf(t);
    while (idx !== -1) {
      const startArgs = idx + t.length;
      let depth = 1;
      let commaPos = -1;
      let i = startArgs;
      for (; i < out.length && depth > 0; i++) {
        if (out[i] === "(") depth++;
        else if (out[i] === ")") depth--;
        else if (out[i] === "," && depth === 1 && commaPos === -1) {
          commaPos = i;
        }
      }
      if (commaPos !== -1) {
        const innerExpr = out.slice(startArgs, commaPos);
        const restArgs = out.slice(commaPos);
        out = out.slice(0, startArgs) + `(x=>(${innerExpr}))` + restArgs;
      }
      // iç içe ∫/∑/d/dx: bir sonraki aramayı sarmalanan ifadenin İÇİNDEN başlat
      // (eski "+6" ofseti iç integrali atlıyordu → ∫(∫(…)…) Syntax ERROR veriyordu)
      idx = out.indexOf(t, idx + t.length);
    }
  }
  return out;
}

/* ==========================================================================
   NEWTON-RAPHSON EQUATION SOLVER (SHIFT + CALC = SOLVE)
   ========================================================================== */
function solveEquation(rawExpr, state, initialGuess = 1) {
  return runWithTimeBudget(5000, () => solveEquationCore(rawExpr, state, initialGuess));
}

function solveEquationCore(rawExpr, state, initialGuess = 1) {
  let lhs = rawExpr;
  let rhs = "0";
  if (rawExpr.includes("=")) {
    const parts = rawExpr.split("=");
    lhs = parts[0];
    rhs = parts.slice(1).join("=");
  }
  const f = xVal => {
    const l = evaluateMathExpression(lhs, state, { x: xVal });
    const r = evaluateMathExpression(rhs, state, { x: xVal });
    return l - r;
  };

  let x = initialGuess;
  for (let iter = 0; iter < 80; iter++) {
    const fx = f(x);
    if (!Number.isFinite(fx)) {
      x += 0.37;
      continue;
    }
    if (Math.abs(fx) < 1e-12) {
      return { x: Number(x.toPrecision(10)), lr: 0 };
    }
    const h = Math.max(1e-6, Math.abs(x) * 1e-6);
    const df = (f(x + h) - f(x - h)) / (2 * h);
    if (Math.abs(df) < 1e-14) {
      x += 0.5;
      continue;
    }
    const nextX = x - fx / df;
    if (Math.abs(nextX - x) < 1e-11) {
      return { x: Number(nextX.toPrecision(10)), lr: Number(f(nextX).toExponential(2)) };
    }
    x = nextX;
  }
  const finalErr = f(x);
  if (Math.abs(finalErr) < 1e-5) {
    return { x: Number(x.toPrecision(10)), lr: Number(finalErr.toExponential(2)) };
  }
  return null;
}

/* ==========================================================================
   MODE 2: COMPLEX NUMBER ENGINE
   ========================================================================== */
class ComplexNum {
  constructor(re = 0, im = 0) {
    this.re = re;
    this.im = im;
  }
  add(o) { return new ComplexNum(this.re + o.re, this.im + o.im); }
  sub(o) { return new ComplexNum(this.re - o.re, this.im - o.im); }
  mul(o) { return new ComplexNum(this.re * o.re - this.im * o.im, this.re * o.im + this.im * o.re); }
  div(o) {
    const d = o.re * o.re + o.im * o.im;
    if (d === 0) return new ComplexNum(NaN, NaN);
    return new ComplexNum((this.re * o.re + this.im * o.im) / d, (this.im * o.re - this.re * o.im) / d);
  }
  conj() { return new ComplexNum(this.re, -this.im); }
  abs() { return Math.hypot(this.re, this.im); }
  arg(angleUnit = "DEG") {
    const r = Math.atan2(this.im, this.re);
    return angleUnit === "DEG" ? (r * 180) / Math.PI : angleUnit === "GRA" ? (r * 200) / Math.PI : r;
  }
  // Gösterim için göreli gürültü temizliği (1∠90 → i, 6×10⁻¹⁷ gibi artıklar silinir)
  clean() {
    let re = this.re, im = this.im;
    if (Math.abs(re) < 1e-99 || Math.abs(re) <= 1e-12 * Math.abs(im)) re = 0;
    if (Math.abs(im) < 1e-99 || Math.abs(im) <= 1e-12 * Math.abs(re)) im = 0;
    return new ComplexNum(re, im);
  }
  toRectString() {
    const c = this.clean();
    const r = Number(c.re.toPrecision(10));
    const im = Number(c.im.toPrecision(10));
    if (im === 0) return `${r}`;
    if (r === 0) return im === 1 ? "i" : im === -1 ? "-i" : `${im}i`;
    const sign = im >= 0 ? "+" : "−";
    const absIm = Math.abs(im) === 1 ? "" : Math.abs(im);
    return `${r}${sign}${absIm}i`;
  }
  toPolarString(angleUnit = "DEG") {
    const c = this.clean();
    const r = Number(c.abs().toPrecision(10));
    const th = Number(c.arg(angleUnit).toPrecision(10));
    return `${r}∠${th}`;
  }
}

function complexSqrt(z) {
  const r = z.abs();
  const re = Math.sqrt(Math.max(0, (r + z.re) / 2));
  let im = Math.sqrt(Math.max(0, (r - z.re) / 2));
  if (z.im < 0) im = -im;
  return new ComplexNum(re, im);
}

/* Karmaşık sayı modu: tanınmayan karakterler artık sessizce yok sayılmıyor (Syntax ERROR),
   0'a bölme Math ERROR veriyor, gizli çarpma (2i, i(2), (1+i)(1−i)) ve −2² = −4 önceliği doğru,
   π, 𝒆, Ans, √( ve A–F/x/y/M değişkenleri destekleniyor. */
function evaluateComplexExpression(rawExpr, angleUnit = "DEG", ansValue = null, vars = {}) {
  const toRad = a =>
    angleUnit === "DEG" ? (a * Math.PI) / 180 : angleUnit === "GRA" ? (a * Math.PI) / 200 : a;

  const expr = rawExpr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/⁻¹/g, "^(-1)")
    .replace(/√\(/g, "Sqrt(")
    .replace(/𝒆/g, "ℯ");

  const tokens = [];
  const re = /\s+|Conj|Arg|Abs|ReP|ImP|Sqrt|PreAns|Ans|\d+(?:\.\d*)?|\.\d+|[iπℯA-FMxy]|[+\-*/^()∠]/y;
  let pos = 0;
  while (pos < expr.length) {
    re.lastIndex = pos;
    const m = re.exec(expr);
    if (!m) throw new Error("Syntax ERROR");
    pos = re.lastIndex;
    if (!/^\s+$/.test(m[0])) tokens.push(m[0]);
  }

  const FUNCS = new Set(["Conj", "Arg", "Abs", "ReP", "ImP", "Sqrt"]);
  const PREC = { "+": 1, "-": 1, "*": 2, "/": 2, "∠": 3, "u-": 3.5, "^": 4 };
  const isOperand = t => /^[\d.]/.test(t) || ["i", "π", "ℯ", "Ans", "PreAns"].includes(t) || /^[A-FMxy]$/.test(t);

  const out = [];
  const ops = [];
  let prev = null; // "operand" | ")" | "(" | "op" | "func" | null
  const pushOp = op => {
    if (op !== "u-") {
      while (ops.length) {
        const top = ops[ops.length - 1];
        if (!(top in PREC)) break;
        const popIt = op === "^" ? PREC[op] < PREC[top] : PREC[op] <= PREC[top];
        if (!popIt) break;
        out.push(ops.pop());
      }
    }
    ops.push(op);
  };

  for (const t of tokens) {
    const startsOperand = isOperand(t) || t === "(" || FUNCS.has(t);
    if (startsOperand && (prev === "operand" || prev === ")")) pushOp("*"); // gizli çarpma
    if (isOperand(t)) {
      out.push(t);
      prev = "operand";
    } else if (FUNCS.has(t)) {
      ops.push(t);
      prev = "func";
    } else if (t === "(") {
      ops.push(t);
      prev = "(";
    } else if (t === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") out.push(ops.pop());
      if (!ops.length) throw new Error("Syntax ERROR");
      ops.pop();
      if (ops.length && FUNCS.has(ops[ops.length - 1])) out.push(ops.pop());
      prev = ")";
    } else if (t === "-" && (prev === null || prev === "op" || prev === "(" || prev === "func")) {
      pushOp("u-");
      prev = "op";
    } else if (t === "+" && (prev === null || prev === "op" || prev === "(" || prev === "func")) {
      prev = "op"; // tekli artı: etkisiz
    } else {
      if (prev !== "operand" && prev !== ")") throw new Error("Syntax ERROR");
      pushOp(t);
      prev = "op";
    }
  }
  while (ops.length) {
    const op = ops.pop();
    if (op !== "(") out.push(op); // kapanmamış parantez: otomatik kapat
  }

  const valueOf = t => {
    if (/^[\d.]/.test(t)) return new ComplexNum(parseFloat(t), 0);
    if (t === "i") return new ComplexNum(0, 1);
    if (t === "π") return new ComplexNum(Math.PI, 0);
    if (t === "ℯ") return new ComplexNum(Math.E, 0);
    if (t === "Ans") return ansValue instanceof ComplexNum ? ansValue : new ComplexNum(Number(ansValue) || 0, 0);
    if (t === "PreAns") return new ComplexNum(0, 0);
    return new ComplexNum(Number(vars[t]) || 0, 0);
  };

  const st = [];
  const pop = () => {
    if (!st.length) throw new Error("Syntax ERROR");
    return st.pop();
  };
  for (const item of out) {
    if (isOperand(item)) st.push(valueOf(item));
    else if (item === "u-") {
      const a = pop();
      st.push(new ComplexNum(-a.re, -a.im));
    } else if (FUNCS.has(item)) {
      const a = pop();
      if (item === "Conj") st.push(a.conj());
      else if (item === "Abs") st.push(new ComplexNum(a.abs(), 0));
      else if (item === "Arg") st.push(new ComplexNum(a.arg(angleUnit), 0));
      else if (item === "ReP") st.push(new ComplexNum(a.re, 0));
      else if (item === "ImP") st.push(new ComplexNum(a.im, 0));
      else if (item === "Sqrt") st.push(complexSqrt(a));
    } else {
      const b = pop();
      const a = pop();
      if (item === "+") st.push(a.add(b));
      else if (item === "-") st.push(a.sub(b));
      else if (item === "*") st.push(a.mul(b));
      else if (item === "/") {
        if (b.re === 0 && b.im === 0) throw new Error("Math ERROR");
        st.push(a.div(b));
      } else if (item === "∠") {
        const rad = toRad(b.re);
        st.push(new ComplexNum(a.re * Math.cos(rad), a.re * Math.sin(rad)));
      } else if (item === "^") {
        if (b.im !== 0 || Math.abs(b.re - Math.round(b.re)) > 1e-9) throw new Error("Math ERROR");
        const n = Math.round(b.re);
        let res = new ComplexNum(1, 0);
        for (let k = 0; k < Math.abs(n); k++) res = res.mul(a);
        if (n < 0) {
          if (res.re === 0 && res.im === 0) throw new Error("Math ERROR");
          res = new ComplexNum(1, 0).div(res);
        }
        st.push(res);
      }
    }
  }
  if (st.length !== 1) throw new Error("Syntax ERROR");
  const result = st[0];
  if (!Number.isFinite(result.re) || !Number.isFinite(result.im)) throw new Error("Math ERROR");
  return result.clean();
}

/* ==========================================================================
   MODE 3: BASE-N ENGINE (DEC / HEX / BIN / OCT + Bitwise)
   ========================================================================== */
/* Base-N: 32 bit tamsayı aritmetiği ile küçük bir ayrıştırıcı.
   Düzeltmeler: xnor artık ~(a xor b), bölme her adımda tamsayı (7÷2×2 = 6),
   tabana uymayan rakam Syntax ERROR, 0'a bölme Math ERROR, Ans desteği. */
function evaluateBaseN(rawExpr, currentBase = 10, ansValue = 0) {
  const s = rawExpr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
  const digitRe = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^[0-9]+$/, 16: /^[0-9A-F]+$/i };
  const tokens = [];
  const re = /\s+|xnor|xor|and|or|Not\(|Neg\(|Ans|[0-9A-Fa-f]+|[+\-*/()]/y;
  let p = 0;
  while (p < s.length) {
    re.lastIndex = p;
    const m = re.exec(s);
    if (!m) throw new Error("Syntax ERROR");
    p = re.lastIndex;
    if (!/^\s+$/.test(m[0])) tokens.push(m[0]);
  }

  const isDec = currentBase === 10;
  const fit = v => {
    if (isDec && (v > 2147483647 || v < -2147483648)) throw new Error("Math ERROR");
    return v | 0;
  };
  let pos = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  function parseOr() {
    let v = parseAnd();
    while (["or", "xor", "xnor"].includes(peek())) {
      const op = next();
      const r = parseAnd();
      v = op === "or" ? v | r : op === "xor" ? v ^ r : ~(v ^ r);
    }
    return v;
  }
  function parseAnd() {
    let v = parseAdd();
    while (peek() === "and") {
      next();
      v = v & parseAdd();
    }
    return v;
  }
  function parseAdd() {
    let v = parseMul();
    while (peek() === "+" || peek() === "-") {
      const op = next();
      const r = parseMul();
      v = fit(op === "+" ? v + r : v - r);
    }
    return v;
  }
  function parseMul() {
    let v = parseUnary();
    while (peek() === "*" || peek() === "/") {
      const op = next();
      const r = parseUnary();
      if (op === "*") v = isDec ? fit(v * r) : Math.imul(v, r);
      else {
        if (r === 0) throw new Error("Math ERROR");
        v = fit(Math.trunc(v / r));
      }
    }
    return v;
  }
  function parseUnary() {
    const t = peek();
    if (t === "-") {
      next();
      return fit(-parseUnary());
    }
    if (t === "+") {
      next();
      return parseUnary();
    }
    if (t === "Not(" || t === "Neg(") {
      next();
      const v = parseOr();
      if (peek() === ")") next();
      return t === "Not(" ? ~v : fit(-v);
    }
    return parsePrimary();
  }
  function parsePrimary() {
    const t = next();
    if (t === undefined) throw new Error("Syntax ERROR");
    if (t === "(") {
      const v = parseOr();
      if (peek() === ")") next();
      return v;
    }
    if (t === "Ans") return ansValue | 0;
    if (/^[0-9A-Fa-f]+$/.test(t)) {
      if (!digitRe[currentBase].test(t)) throw new Error("Syntax ERROR");
      const v = parseInt(t, currentBase);
      if (v > 0xffffffff) throw new Error("Math ERROR");
      return isDec ? fit(v) : v | 0;
    }
    throw new Error("Syntax ERROR");
  }

  const v = parseOr();
  if (pos < tokens.length) throw new Error("Syntax ERROR");
  return v | 0;
}

function formatBaseN(val32, base = 10) {
  const unsigned = val32 >>> 0;
  if (base === 10) return String(val32 | 0);
  if (base === 16) return unsigned.toString(16).toUpperCase();
  if (base === 8) return unsigned.toString(8);
  if (base === 2) return unsigned.toString(2); // eskiden 16 bitte kesiliyordu (65536 → 0)
  return String(val32);
}

/* ==========================================================================
   MODE 4 & 5: MATRIX & VECTOR OPERATIONS
   ========================================================================== */
function matAdd(A, B, sign = 1) {
  if (A.length !== B.length || A[0].length !== B[0].length) throw new Error("Dimension ERROR");
  return A.map((row, r) => row.map((v, c) => v + sign * B[r][c]));
}

function matMul(A, B) {
  if (typeof A === "number") return B.map(r => r.map(v => A * v));
  if (typeof B === "number") return A.map(r => r.map(v => B * v));
  if (A[0].length !== B.length) throw new Error("Dimension ERROR");
  const rows = A.length, cols = B[0].length, inner = B.length;
  const C = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let s = 0;
      for (let k = 0; k < inner; k++) s += A[i][k] * B[k][j];
      C[i][j] = Number(s.toPrecision(10));
    }
  }
  return C;
}

function matTranspose(A) {
  return A[0].map((_, c) => A.map(r => r[c]));
}

function matDet(A) {
  const n = A.length;
  if (n !== A[0].length) throw new Error("Dimension ERROR");
  const M = A.map(r => [...r]);
  let det = 1;
  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(M[r][i]) > Math.abs(M[pivot][i])) pivot = r;
    }
    if (Math.abs(M[pivot][i]) < 1e-12) return 0;
    if (pivot !== i) {
      [M[i], M[pivot]] = [M[pivot], M[i]];
      det = -det;
    }
    det *= M[i][i];
    for (let r = i + 1; r < n; r++) {
      const f = M[r][i] / M[i][i];
      for (let c = i; c < n; c++) M[r][c] -= f * M[i][c];
    }
  }
  return Number(det.toPrecision(10));
}

function matInverse(A) {
  const n = A.length;
  if (n !== A[0].length) throw new Error("Dimension ERROR");
  const aug = A.map((row, i) => [
    ...row,
    ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  ]);
  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(aug[r][i]) > Math.abs(aug[pivot][i])) pivot = r;
    }
    if (Math.abs(aug[pivot][i]) < 1e-12) throw new Error("Math ERROR (Singular)");
    [aug[i], aug[pivot]] = [aug[pivot], aug[i]];
    const div = aug[i][i];
    for (let c = 0; c < 2 * n; c++) aug[i][c] /= div;
    for (let r = 0; r < n; r++) {
      if (r !== i) {
        const f = aug[r][i];
        for (let c = 0; c < 2 * n; c++) aug[r][c] -= f * aug[i][c];
      }
    }
  }
  return aug.map(row => row.slice(n).map(v => Number(v.toPrecision(8))));
}

function vctDot(u, v) {
  if (u.length !== v.length) throw new Error("Dimension ERROR");
  return u.reduce((s, x, i) => s + x * v[i], 0);
}

function vctCross(u, v) {
  const a = u.length === 2 ? [u[0], u[1], 0] : u;
  const b = v.length === 2 ? [v[0], v[1], 0] : v;
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

function vctNorm(u) {
  return Math.hypot(...u);
}

/* ==========================================================================
   MODE A: SIMULTANEOUS LINEAR EQUATIONS & POLYNOMIAL SOLVER
   ========================================================================== */
function solveLinearSystem(matrixAug) {
  const n = matrixAug.length;
  const M = matrixAug.map(r => [...r]);
  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(M[r][i]) > Math.abs(M[pivot][i])) pivot = r;
    }
    if (Math.abs(M[pivot][i]) < 1e-12) return null;
    [M[i], M[pivot]] = [M[pivot], M[i]];
    const div = M[i][i];
    for (let c = i; c <= n; c++) M[i][c] /= div;
    for (let r = 0; r < n; r++) {
      if (r !== i) {
        const f = M[r][i];
        for (let c = i; c <= n; c++) M[r][c] -= f * M[i][c];
      }
    }
  }
  return M.map(r => Number(r[n].toPrecision(10)));
}

/* 2., 3. ve 4. derece polinom kökleri.
   2. derece: sayısal olarak kararlı formül. 3. derece: Cardano/trigonometrik kapalı form
   (katlı kökler tam çıkar). 4. derece: Ferrari yöntemi. Hepsi Newton ile cilalanır.
   Baş katsayı 0 ise Math ERROR. */
function solvePolynomialRoots(coeffs) {
  const deg = coeffs.length - 1;
  if (!coeffs.every(Number.isFinite) || Math.abs(coeffs[0]) < 1e-300) return ["Math ERROR"];

  if (deg === 2) {
    const [a, b, c] = coeffs;
    const disc = b * b - 4 * a * c;
    const vx = -b / (2 * a);
    const vy = c - (b * b) / (4 * a);
    const minMax = a > 0
      ? `Min(${Number(vx.toPrecision(6))}, ${Number(vy.toPrecision(6))})`
      : `Max(${Number(vx.toPrecision(6))}, ${Number(vy.toPrecision(6))})`;
    if (disc >= 0) {
      const sq = Math.sqrt(disc);
      let r1, r2; // r1 = (−b+√Δ)/2a, r2 = (−b−√Δ)/2a — iptal hatası olmadan
      if (b >= 0) {
        const q = -(b + sq) / 2;
        r2 = q / a;
        r1 = q !== 0 ? c / q : 0;
      } else {
        const q = (-b + sq) / 2;
        r1 = q / a;
        r2 = q !== 0 ? c / q : 0;
      }
      return [`x₁ = ${Number(r1.toPrecision(10))}`, `x₂ = ${Number(r2.toPrecision(10))}`, minMax];
    }
    const re = -b / (2 * a);
    const im = Math.abs(Math.sqrt(-disc) / (2 * a));
    return [`x₁ = ${new ComplexNum(re, im).toRectString()}`, `x₂ = ${new ComplexNum(re, -im).toRectString()}`, minMax];
  }

  let roots;
  if (deg === 3) roots = solveCubicComplex(...coeffs);
  else if (deg === 4) roots = solveQuarticComplex(...coeffs);
  else return ["Math ERROR"];

  roots = roots.map(z => polishPolyRoot(coeffs, z));
  if (roots.some(z => !Number.isFinite(z.re) || !Number.isFinite(z.im))) return ["Math ERROR"];

  const scale = Math.max(1, ...roots.map(z => z.abs()));
  const cleaned = roots.map(z => (Math.abs(z.im) <= 1e-9 * scale ? new ComplexNum(z.re, 0) : z));
  // Önce reel kökler (büyükten küçüğe), sonra karmaşık kökler
  cleaned.sort((p, q) => (p.im !== 0) - (q.im !== 0) || q.re - p.re || q.im - p.im);
  const sub = ["₁", "₂", "₃", "₄"];
  return cleaned.map((z, i) =>
    z.im === 0 ? `x${sub[i]} = ${Number(z.re.toPrecision(10))}` : `x${sub[i]} = ${z.toRectString()}`
  );
}

function polyEvalComplex(coeffs, z) {
  let acc = new ComplexNum(0, 0);
  for (const c of coeffs) acc = acc.mul(z).add(new ComplexNum(c, 0));
  return acc;
}

/* Newton cilası: yalnızca |p(z)| küçülüyorsa uygular (katlı köklerde bozulmaz) */
function polishPolyRoot(coeffs, z) {
  const n = coeffs.length - 1;
  const dcoeffs = coeffs.slice(0, -1).map((c, i) => c * (n - i));
  let best = z, bestVal = polyEvalComplex(coeffs, z).abs();
  let cur = z;
  for (let it = 0; it < 8 && bestVal > 0; it++) {
    const d = polyEvalComplex(dcoeffs, cur);
    if (d.abs() < 1e-300) break;
    cur = cur.sub(polyEvalComplex(coeffs, cur).div(d));
    const v = polyEvalComplex(coeffs, cur).abs();
    if (!(v < bestVal)) break;
    best = cur;
    bestVal = v;
  }
  return best;
}

/* a x³ + b x² + c x + d = 0 → 3 kök (ComplexNum) */
function solveCubicComplex(a, b, c, d) {
  const shift = -b / (3 * a);
  const p = (3 * a * c - b * b) / (3 * a * a);
  const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
  const scale = Math.max(Math.abs(p), Math.abs(q), 1e-300);
  const C = t => new ComplexNum(t + shift, 0);

  if (Math.abs(p) <= 1e-12 * Math.max(1, scale) && Math.abs(q) <= 1e-12 * Math.max(1, scale)) {
    return [C(0), C(0), C(0)]; // üçlü kök
  }
  const Dq = (q / 2) * (q / 2);
  const Dp = (p / 3) * (p / 3) * (p / 3);
  const D = Dq + Dp;
  if (Math.abs(D) <= 1e-12 * Math.max(Math.abs(Dq), Math.abs(Dp))) {
    // çift kök
    const t1 = (3 * q) / p;
    const t2 = (-3 * q) / (2 * p);
    return [C(t1), C(t2), C(t2)];
  }
  if (D > 0) {
    const sq = Math.sqrt(D);
    const u = Math.cbrt(-q / 2 + sq);
    const v = Math.cbrt(-q / 2 - sq);
    const re = -(u + v) / 2 + shift;
    const im = (Math.sqrt(3) / 2) * (u - v);
    return [C(u + v), new ComplexNum(re, im), new ComplexNum(re, -im)];
  }
  // üç farklı reel kök (trigonometrik çözüm)
  const r = 2 * Math.sqrt(-p / 3);
  const arg = Math.max(-1, Math.min(1, ((3 * q) / (2 * p)) * Math.sqrt(-3 / p)));
  const phi = Math.acos(arg) / 3;
  return [0, 1, 2].map(k => C(r * Math.cos(phi - (2 * Math.PI * k) / 3)));
}

/* a x⁴ + b x³ + c x² + d x + e = 0 → 4 kök (Ferrari) */
function solveQuarticComplex(a, b, c, d, e) {
  const B = b / a, Cc = c / a, Dd = d / a, E = e / a;
  const shift = -B / 4;
  const p = Cc - (3 * B * B) / 8;
  const q = Dd - (B * Cc) / 2 + (B * B * B) / 8;
  const r = E - (B * Dd) / 4 + (B * B * Cc) / 16 - (3 * B * B * B * B) / 256;
  const scale = Math.max(1, Math.abs(p), Math.abs(r), Math.abs(q));
  const shiftC = z => new ComplexNum(z.re + shift, z.im);

  if (Math.abs(q) <= 1e-12 * scale) {
    // iki karesel: y⁴ + p y² + r = 0
    const disc = complexSqrt(new ComplexNum(p * p - 4 * r, 0));
    const z1 = new ComplexNum(-p, 0).add(disc).mul(new ComplexNum(0.5, 0));
    const z2 = new ComplexNum(-p, 0).sub(disc).mul(new ComplexNum(0.5, 0));
    const s1 = complexSqrt(z1), s2 = complexSqrt(z2);
    return [s1, new ComplexNum(-s1.re, -s1.im), s2, new ComplexNum(-s2.re, -s2.im)].map(shiftC);
  }
  // çözücü kübik: 8m³ + 8p m² + (2p² − 8r) m − q² = 0 → pozitif reel kök
  const res = solveCubicComplex(8, 8 * p, 2 * p * p - 8 * r, -q * q)
    .map(z => polishPolyRoot([8, 8 * p, 2 * p * p - 8 * r, -q * q], z))
    .filter(z => Math.abs(z.im) <= 1e-9 * Math.max(1, z.abs()))
    .map(z => z.re)
    .sort((x, y) => y - x);
  const m = res[0];
  if (!(m > 0)) return solveQuarticDurandKerner([a, b, c, d, e]);
  const s = Math.sqrt(2 * m);
  const half = new ComplexNum(0.5, 0);
  const r1 = complexSqrt(new ComplexNum(-(2 * p + 2 * m + (2 * q) / s), 0));
  const r2 = complexSqrt(new ComplexNum(-(2 * p + 2 * m - (2 * q) / s), 0));
  return [
    new ComplexNum(s, 0).add(r1).mul(half),
    new ComplexNum(s, 0).sub(r1).mul(half),
    new ComplexNum(-s, 0).add(r2).mul(half),
    new ComplexNum(-s, 0).sub(r2).mul(half)
  ].map(shiftC);
}

/* Yedek: Durand–Kerner (yalnızca Ferrari sayısal olarak başarısız olursa) */
function solveQuarticDurandKerner(coeffs) {
  const n = coeffs.length - 1;
  const normC = coeffs.map(c => c / coeffs[0]);
  let roots = Array.from({ length: n }, (_, k) => {
    const ang = (2 * Math.PI * k) / n + 0.4;
    return new ComplexNum(0.8 * Math.cos(ang), 0.8 * Math.sin(ang));
  });
  for (let iter = 0; iter < 500; iter++) {
    for (let i = 0; i < n; i++) {
      let denom = new ComplexNum(1, 0);
      for (let j = 0; j < n; j++) if (i !== j) denom = denom.mul(roots[i].sub(roots[j]));
      roots[i] = roots[i].sub(polyEvalComplex(normC, roots[i]).div(denom));
    }
  }
  return roots;
}

/* ==========================================================================
   MODE 6 & 7: STATISTICS & PROBABILITY DISTRIBUTIONS
   ========================================================================== */
function compute1VarStats(xs, freqs) {
  let n = 0, sumX = 0, sumX2 = 0;
  const expanded = [];
  for (let i = 0; i < xs.length; i++) {
    const x = Number(xs[i]);
    const fRaw = Number(freqs[i] ?? 1);
    const f = Number.isFinite(fRaw) ? Math.round(fRaw) : 1;
    if (!Number.isFinite(x) || f <= 0) continue; // frekansı 0 olan satır hesaba katılmaz
    n += f;
    sumX += x * f;
    sumX2 += x * x * f;
    for (let k = 0; k < f; k++) expanded.push(x);
  }
  if (n === 0) return null;
  expanded.sort((a, b) => a - b);
  const mean = sumX / n;
  // varyansı ortalamadan sapmalarla hesapla (büyük sayılarda iptal hatası olmasın)
  let ss = 0;
  for (const v of expanded) ss += (v - mean) * (v - mean);
  const popVar = ss / n;
  const popSD = Math.sqrt(popVar);
  const sampVar = n > 1 ? ss / (n - 1) : 0;
  const sampSD = Math.sqrt(sampVar);

  const medianOf = arr => {
    const m = Math.floor(arr.length / 2);
    return arr.length % 2 !== 0 ? arr[m] : (arr[m - 1] + arr[m]) / 2;
  };
  const med = medianOf(expanded);
  const lowerHalf = expanded.slice(0, Math.floor(expanded.length / 2));
  const upperHalf = expanded.slice(Math.ceil(expanded.length / 2));
  const q1 = lowerHalf.length ? medianOf(lowerHalf) : expanded[0];
  const q3 = upperHalf.length ? medianOf(upperHalf) : expanded[expanded.length - 1];

  return [
    `x̄ = ${Number(mean.toPrecision(10))}`,
    `∑x = ${Number(sumX.toPrecision(10))}`,
    `∑x² = ${Number(sumX2.toPrecision(10))}`,
    `σx = ${Number(popSD.toPrecision(10))}`,
    `sx = ${Number(sampSD.toPrecision(10))}`,
    `n = ${n}`,
    `min(x) = ${expanded[0]}`,
    `Q₁ = ${q1}`,
    `Med = ${med}`,
    `Q₃ = ${q3}`,
    `max(x) = ${expanded[expanded.length - 1]}`
  ];
}

function compute2VarLinearReg(xs, ys) {
  const pts = [];
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    const x = Number(xs[i]), y = Number(ys[i]);
    if (Number.isFinite(x) && Number.isFinite(y)) pts.push([x, y]);
  }
  const n = pts.length;
  if (n < 2) return ["Veri yetersiz (n≥2)"];
  const mx = pts.reduce((s, p) => s + p[0], 0) / n;
  const my = pts.reduce((s, p) => s + p[1], 0) / n;
  let sxx = 0, syy = 0, sxy = 0;
  for (const [x, y] of pts) {
    sxx += (x - mx) * (x - mx);
    syy += (y - my) * (y - my);
    sxy += (x - mx) * (y - my);
  }
  if (sxx === 0) return ["Math ERROR (tüm x değerleri aynı)"];
  const b = sxy / sxx;
  const a = my - b * mx;
  const r = syy === 0 ? 0 : sxy / Math.sqrt(sxx * syy);
  return [
    `y = a + bx`,
    `a = ${Number(a.toPrecision(10))}`,
    `b = ${Number(b.toPrecision(10))}`,
    `r = ${Number(r.toPrecision(10))}`,
    `x̄ = ${Number(mx.toPrecision(10))}`,
    `ȳ = ${Number(my.toPrecision(10))}`,
    `n = ${n}`
  ];
}

/* Eski Abramowitz–Stegun yaklaşımı yalnızca ~7 basamak doğruydu (10 basamak gösteriliyordu).
   Yerine: seri (x<1.5) + sürekli kesir (x≥1.5) ile ~15 basamak doğru erfc. */
function erfcAccurate(x) {
  if (Number.isNaN(x)) return NaN;
  if (x < 0) return 2 - erfcAccurate(-x);
  if (x < 1.5) {
    let term = x, sum = x;
    for (let n = 1; n < 300; n++) {
      term *= (2 * x * x) / (2 * n + 1);
      sum += term;
      if (term < 1e-17 * sum) break;
    }
    return 1 - (2 / Math.sqrt(Math.PI)) * Math.exp(-x * x) * sum;
  }
  if (x > 27) return 0;
  let f = x;
  for (let k = 150; k >= 1; k--) f = x + k / 2 / f;
  return Math.exp(-x * x) / Math.sqrt(Math.PI) / f;
}

function erfApprox(x) {
  return 1 - erfcAccurate(x);
}

function normalPDF(x, mu = 0, sigma = 1) {
  if (!(sigma > 0)) return NaN;
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

function normalCDF(lower, upper, mu = 0, sigma = 1) {
  if (!(sigma > 0)) return NaN;
  const Q = z => 0.5 * erfcAccurate(z / Math.SQRT2); // P(Z > z)
  const zl = (lower - mu) / sigma;
  const zu = (upper - mu) / sigma;
  if (zl >= 0) return Q(zl) - Q(zu);
  if (zu <= 0) return Q(-zu) - Q(-zl);
  return 1 - Q(-zl) - Q(zu);
}

function invNormal(area, mu = 0, sigma = 1) {
  if (!(area > 0 && area < 1) || !(sigma > 0)) return NaN;
  // Acklam yaklaşımı + doğru CDF ile bir Halley adımı (tam çift duyarlık)
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.3577518672690, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const pLow = 0.02425, pHigh = 1 - pLow;
  let q, r, z;
  if (area < pLow) {
    q = Math.sqrt(-2 * Math.log(area));
    z = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (area <= pHigh) {
    q = area - 0.5;
    r = q * q;
    z = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
        (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - area));
    z = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
         ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  for (let k = 0; k < 2; k++) {
    const e = 0.5 * erfcAccurate(-z / Math.SQRT2) - area;
    const u = e * Math.sqrt(2 * Math.PI) * Math.exp((z * z) / 2);
    z = z - u / (1 + (z * u) / 2);
  }
  return mu + sigma * z;
}

/* Binom ve Poisson olasılıkları — logaritmayla hesaplanır (N=2000 gibi değerlerde taşma yok) */
function nearInt(v) {
  return Number.isFinite(v) && Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v) : NaN;
}

function binomialPD(x, n, p) {
  x = nearInt(x);
  n = nearInt(n);
  if (!(n >= 0) || !(x >= 0) || x > n || n > 1e7 || !(p >= 0 && p <= 1)) return NaN;
  if (p === 0) return x === 0 ? 1 : 0;
  if (p === 1) return x === n ? 1 : 0;
  const k = Math.min(x, n - x);
  let logC = 0;
  for (let i = 1; i <= k; i++) logC += Math.log((n - k + i) / i);
  return Math.exp(logC + x * Math.log(p) + (n - x) * Math.log1p(-p));
}

function poissonPD(x, lam) {
  x = nearInt(x);
  if (!(x >= 0) || x > 1e7 || !(lam > 0)) return NaN;
  if (x <= 170 && lam <= 700) return (Math.pow(lam, x) * Math.exp(-lam)) / factorial(x);
  let logFact = 0;
  for (let i = 2; i <= x; i++) logFact += Math.log(i);
  return Math.exp(x * Math.log(lam) - lam - logFact);
}
