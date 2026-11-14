/* ==========================================================================
   CASIO fx-991EX CLASSWIZ — INTERACTIVE CONTROLLER, 2D RENDERER & UI STATE
   ========================================================================== */

const calcState = {
  powerOn: true,
  shift: false,
  alpha: false,
  stoMode: false,
  rclMode: false,
  soundEnabled: true,

  // Active ClassWiz Mode (1..12)
  modeId: 1,
  screenView: "MAIN", // "MAIN", "MENU", "SETUP", "OPTN", "CONST", "CONV", "RESET", "QR", "PROMPT", "MATRIX_EDIT", "VECTOR_EDIT", "STAT_EDIT", "TABLE_RES", "SPREADSHEET", "EQN_UI"
  menuCursor: 0,
  listCursor: 0,
  listItems: [],
  listTitle: "",
  listCallback: null,

  // Expression & Cursor
  expr: "",
  cursorPos: 0,
  resultText: "0",
  resultHtml: "0",
  lastNumericResult: 0,
  lastComplexResult: null,
  displayFormat: "SYMBOLIC", // "SYMBOLIC", "DECIMAL", "MIXED", "DMS", "FACT", "ENG", "POLAR"
  engShift: 0,
  justEvaluated: false,

  // Memories & History
  ans: 0,
  preAns: 0,
  vars: { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, x: 0, y: 0, z: 0, M: 0 },
  history: [],
  historyIdx: -1,

  // Global Calculator Setup
  settings: {
    ioMode: "MathI/MathO", // "MathI/MathO" or "MathI/DecimalO"
    angleUnit: "DEG",      // "DEG", "RAD", "GRA"
    numFormat: "NORM",     // "NORM", "FIX", "SCI"
    fixDigits: 4,
    sciDigits: 5,
    normMode: 1,
    engSymbol: false
  },

  // Mode 3: Base-N state
  baseN: 10, // 10, 16, 2, 8
  lastBaseNVal: 0,

  // Mode 4: Matrices (up to 4x4)
  matrices: {
    MatA: [[1, 2], [3, 4]],
    MatB: [[2, 0], [1, 2]],
    MatC: [[1, 0], [0, 1]],
    MatAns: [[0, 0], [0, 0]]
  },
  activeMatName: "MatA",
  gridRow: 0,
  gridCol: 0,

  // Mode 5: Vectors (2D or 3D)
  vectors: {
    VctA: [1, 2, 3],
    VctB: [4, 5, 6],
    VctC: [1, 0, 0],
    VctAns: [0, 0, 0]
  },
  activeVctName: "VctA",

  // Mode 6: Statistics
  statType: "1-VAR", // "1-VAR" or "2-VAR"
  statData: {
    x: [10, 20, 30, 40, 50],
    y: [12, 25, 31, 44, 52],
    freq: [1, 1, 1, 1, 1]
  },

  // Mode 8: Spreadsheet (5 cols A-E x 6 rows)
  sheetFormulas: Array.from({ length: 6 }, (_, r) =>
    Array.from({ length: 5 }, (_, c) => (r === 0 && c === 0 ? "10" : r === 1 && c === 0 ? "20" : r === 2 && c === 0 ? "=A1+A2" : ""))
  ),

  // Mode 9: Table
  tableConfig: { f: "x²", g: "2x+1", start: -2, end: 3, step: 1 },
  tableRows: [],

  // Multi-step Prompt Queue (for CALC, SOLVE, Table, Dist, Equation, Inequality)
  promptQueue: [],
  promptTitle: "",
  promptInput: "",
  promptCursor: 0,
  promptFresh: false,
  promptError: "",
  promptOnDone: null,
  promptOnCancel: null,
  collectedPrompts: {},

  // Liste menüsünden sonra dönülecek ekran ve açı birimi değişince yeniden hesaplanacak ifade
  listReturnView: "MAIN",
  lastEvalExpr: null
};

/* ==========================================================================
   SUBTLE AUDIO CLICK FEEDBACK (Web Audio API)
   ========================================================================== */
let audioCtx = null;
function playClickSound(freq = 1350, dur = 0.012) {
  if (!calcState.soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  } catch (_) {}
}

/* ==========================================================================
   2D NATURAL TEXTBOOK EXPRESSION RENDERER
   ========================================================================== */
function splitTopLevelArgs(str) {
  const args = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "(") depth++;
    else if (str[i] === ")") depth--;
    else if (str[i] === "," && depth === 0) {
      args.push(str.slice(start, i));
      start = i + 1;
    }
  }
  args.push(str.slice(start));
  return args;
}

function findMatchingParen(str, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < str.length; i++) {
    if (str[i] === "(") depth++;
    else if (str[i] === ")") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/* Boş şablon kutusu: içerik yoksa (ya da yalnızca imleç varsa) □ göster */
function renderSlot(part) {
  const p = part || "";
  const html = renderNaturalMathHTML(p);
  return p.replace(/\u0001/g, "") === "" ? html + `<span class="math-box"></span>` : html;
}

function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* Çok karakterli belirteçler: ◀ ▶ ve DEL bunları tek parça gibi atlar / siler
   (eskiden "sin(" içine girilip tek harf silinebiliyordu, 𝒆 yarım siliniyordu). */
const EDIT_TOKENS = [
  "RanInt#(", "sinh⁻¹(", "cosh⁻¹(", "tanh⁻¹(", "nthroot(", "sin⁻¹(", "cos⁻¹(", "tan⁻¹(",
  "PreAns", "MatAns", "VctAns", "mfrac(", "UnitV(", "Angle(", "×10^(", "frac(", "d/dx(",
  "sinh(", "cosh(", "tanh(", "Conj(", "Frac(", "Mean(", "MatA", "MatB", "MatC", "VctA", "VctB", "VctC",
  " xnor ", " xor ", " and ", " or ",
  "sin(", "cos(", "tan(", "log(", "Abs(", "Int(", "Rnd(", "GCD(", "LCM(", "Pol(", "Rec(", "Arg(", "ReP(", "ImP(",
  "Det(", "Trn(", "Dot(", "Not(", "Neg(", "Sum(", "Min(", "Max(", "Ran#", "Ans", "ln(", "³√(", "√(", "∫(", "∑(", "^(", "⁻¹", "𝒆"
].sort((a, b) => b.length - a.length);

function tokenLenBefore(str, pos) {
  const before = str.slice(0, pos);
  if (!before.length) return 0;
  for (const t of EDIT_TOKENS) if (before.endsWith(t)) return t.length;
  const code = before.charCodeAt(before.length - 1);
  return code >= 0xdc00 && code <= 0xdfff && before.length >= 2 ? 2 : 1;
}

function tokenLenAfter(str, pos) {
  const after = str.slice(pos);
  if (!after.length) return 0;
  for (const t of EDIT_TOKENS) if (after.startsWith(t)) return t.length;
  const code = after.charCodeAt(0);
  return code >= 0xd800 && code <= 0xdbff && after.length >= 2 ? 2 : 1;
}

const LIST_VIEWS = ["SETUP", "OPTN", "CONST", "CONV", "RESET", "EQN_UI"];
const GRID_EDIT_VIEWS = ["MATRIX_EDIT", "VECTOR_EDIT", "STAT_EDIT", "SPREADSHEET"];

/* Modun "ana" ekranı (Spreadsheet modunda tablo, diğerlerinde hesap ekranı) */
function homeView() {
  return calcState.modeId === 8 ? "SPREADSHEET" : "MAIN";
}

function errorLabel(err) {
  const msg = (err && err.message) || "";
  if (msg.includes("Time Out")) return "Time Out";
  if (msg.includes("Dimension")) return "Dimension ERROR";
  if (msg.includes("Math")) return "Math ERROR";
  return "Syntax ERROR";
}

function hasNumericResult() {
  return (
    calcState.justEvaluated &&
    !/ERROR|Initialized|Solve|TRUE|FALSE|Time Out/.test(calcState.resultHtml) &&
    Number.isFinite(calcState.lastNumericResult)
  );
}

/* Ans / PreAns'ı günceller (eskiden CONV, dağılım ve matris sonuçlarında Ans güncellenmiyordu) */
function setAnswer(val) {
  calcState.preAns = calcState.ans;
  calcState.ans = val;
  calcState.lastNumericResult = val;
}

function renderNaturalMathHTML(str) {
  if (!str) return "";
  let out = "";
  let i = 0;

  while (i < str.length) {
    // Cursor marker \u0001
    if (str[i] === "\u0001") {
      out += `<span class="lcd-cursor"></span>`;
      i++;
      continue;
    }

    // 2D Fraction: frac(num,den)
    if (str.startsWith("frac(", i)) {
      const openIdx = i + 4;
      const closeIdx = findMatchingParen(str, openIdx);
      const inner = closeIdx !== -1 ? str.slice(openIdx + 1, closeIdx) : str.slice(openIdx + 1);
      const parts = splitTopLevelArgs(inner);
      const numHtml = renderSlot(parts[0] || "");
      const denHtml = renderSlot(parts[1] || "");
      out += `<span class="math-frac"><span class="math-frac-num">${numHtml}</span><span class="math-frac-den">${denHtml}</span></span>`;
      i = closeIdx !== -1 ? closeIdx + 1 : str.length;
      continue;
    }

    // 2D Mixed Fraction: mfrac(w,num,den)
    if (str.startsWith("mfrac(", i)) {
      const openIdx = i + 5;
      const closeIdx = findMatchingParen(str, openIdx);
      const inner = closeIdx !== -1 ? str.slice(openIdx + 1, closeIdx) : str.slice(openIdx + 1);
      const parts = splitTopLevelArgs(inner);
      const wHtml = renderSlot(parts[0] || "");
      const numHtml = renderSlot(parts[1] || "");
      const denHtml = renderSlot(parts[2] || "");
      out += `${wHtml}<span class="math-frac"><span class="math-frac-num">${numHtml}</span><span class="math-frac-den">${denHtml}</span></span>`;
      i = closeIdx !== -1 ? closeIdx + 1 : str.length;
      continue;
    }

    // 2D Square Root: √(inner)
    if (str.startsWith("√(", i)) {
      const openIdx = i + 1;
      const closeIdx = findMatchingParen(str, openIdx);
      const inner = closeIdx !== -1 ? str.slice(openIdx + 1, closeIdx) : str.slice(openIdx + 1);
      const bodyHtml = renderSlot(inner);
      out += `<span class="math-sqrt"><span class="math-sqrt-sym">√</span><span class="math-sqrt-body">${bodyHtml}</span></span>`;
      i = closeIdx !== -1 ? closeIdx + 1 : str.length;
      continue;
    }

    // 2D Cube Root: ³√(inner)
    if (str.startsWith("³√(", i)) {
      const openIdx = i + 2;
      const closeIdx = findMatchingParen(str, openIdx);
      const inner = closeIdx !== -1 ? str.slice(openIdx + 1, closeIdx) : str.slice(openIdx + 1);
      const bodyHtml = renderSlot(inner);
      out += `<span class="math-sup">3</span><span class="math-sqrt"><span class="math-sqrt-sym">√</span><span class="math-sqrt-body">${bodyHtml}</span></span>`;
      i = closeIdx !== -1 ? closeIdx + 1 : str.length;
      continue;
    }

    // 2D N-th Root: nthroot(n,x)
    if (str.startsWith("nthroot(", i)) {
      const openIdx = i + 7;
      const closeIdx = findMatchingParen(str, openIdx);
      const inner = closeIdx !== -1 ? str.slice(openIdx + 1, closeIdx) : str.slice(openIdx + 1);
      const parts = splitTopLevelArgs(inner);
      const nHtml = renderSlot(parts[0] || "");
      const xHtml = renderSlot(parts[1] || "");
      out += `<span class="math-sup">${nHtml}</span><span class="math-sqrt"><span class="math-sqrt-sym">√</span><span class="math-sqrt-body">${xHtml}</span></span>`;
      i = closeIdx !== -1 ? closeIdx + 1 : str.length;
      continue;
    }

    // 2D Superscript Power: ^(exp)
    if (str.startsWith("^(", i)) {
      const openIdx = i + 1;
      const closeIdx = findMatchingParen(str, openIdx);
      const inner = closeIdx !== -1 ? str.slice(openIdx + 1, closeIdx) : str.slice(openIdx + 1);
      const expHtml = renderSlot(inner);
      out += `<span class="math-sup">${expHtml}</span>`;
      i = closeIdx !== -1 ? closeIdx + 1 : str.length;
      continue;
    }

    // 2D Definite Integral: ∫(f,a,b)
    if (str.startsWith("∫(", i)) {
      const openIdx = i + 1;
      const closeIdx = findMatchingParen(str, openIdx);
      const inner = closeIdx !== -1 ? str.slice(openIdx + 1, closeIdx) : str.slice(openIdx + 1);
      const parts = splitTopLevelArgs(inner);
      const fHtml = renderSlot(parts[0] || "");
      const aHtml = renderSlot(parts[1] || "");
      const bHtml = renderSlot(parts[2] || "");
      out += `<span class="math-int-wrap"><span class="math-int-sym">∫</span><span class="math-limits"><span>${bHtml}</span><span>${aHtml}</span></span><span>(${fHtml})dx</span></span>`;
      i = closeIdx !== -1 ? closeIdx + 1 : str.length;
      continue;
    }

    // 2D Derivative: d/dx(f,a)
    if (str.startsWith("d/dx(", i)) {
      const openIdx = i + 4;
      const closeIdx = findMatchingParen(str, openIdx);
      const inner = closeIdx !== -1 ? str.slice(openIdx + 1, closeIdx) : str.slice(openIdx + 1);
      const parts = splitTopLevelArgs(inner);
      const fHtml = renderSlot(parts[0] || "");
      const aHtml = renderSlot(parts[1] || "");
      out += `<span class="math-frac"><span class="math-frac-num">d</span><span class="math-frac-den">dx</span></span>(${fHtml})<span class="math-sub">|x=${aHtml}</span>`;
      i = closeIdx !== -1 ? closeIdx + 1 : str.length;
      continue;
    }

    // 2D Summation: ∑(f,a,b)
    if (str.startsWith("∑(", i)) {
      const openIdx = i + 1;
      const closeIdx = findMatchingParen(str, openIdx);
      const inner = closeIdx !== -1 ? str.slice(openIdx + 1, closeIdx) : str.slice(openIdx + 1);
      const parts = splitTopLevelArgs(inner);
      const fHtml = renderSlot(parts[0] || "");
      const aHtml = renderSlot(parts[1] || "");
      const bHtml = renderSlot(parts[2] || "");
      out += `<span class="math-sum-wrap"><span class="math-int-sym">∑</span><span class="math-limits"><span>${bHtml}</span><span>x=${aHtml}</span></span><span>(${fHtml})</span></span>`;
      i = closeIdx !== -1 ? closeIdx + 1 : str.length;
      continue;
    }

    // 2D Log with arbitrary base: log(base,val)
    if (str.startsWith("log(", i)) {
      const openIdx = i + 3;
      const closeIdx = findMatchingParen(str, openIdx);
      const inner = closeIdx !== -1 ? str.slice(openIdx + 1, closeIdx) : str.slice(openIdx + 1);
      const parts = splitTopLevelArgs(inner);
      if (parts.length === 2) {
        const baseHtml = renderSlot(parts[0] || "");
        const valHtml = renderSlot(parts[1] || "");
        out += `log<span class="math-sub">${baseHtml}</span>(${valHtml})`;
        i = closeIdx !== -1 ? closeIdx + 1 : str.length;
        continue;
      }
    }

    // Escape regular characters
    const ch = str[i];
    if (ch === "<") out += "&lt;";
    else if (ch === ">") out += "&gt;";
    else if (ch === "&") out += "&amp;";
    else out += ch;
    i++;
  }
  return out;
}

/* ==========================================================================
   INSERTING TEXT & TEMPLATES AT CURSOR
   ========================================================================== */
function insertAtCursor(text, cursorOffsetFromEnd = 0) {
  if (!calcState.powerOn) return;

  // Giriş ekranı: gerçek imleç ile (eskiden √(), sin() gibi şablonlar imleç sonda kaldığı için
  // "√()9" oluyor ve sessizce 0 kabul ediliyordu)
  if (calcState.screenView === "PROMPT") {
    if (calcState.promptFresh) {
      calcState.promptInput = "";
      calcState.promptCursor = 0;
      calcState.promptFresh = false;
    }
    const before = calcState.promptInput.slice(0, calcState.promptCursor);
    const after = calcState.promptInput.slice(calcState.promptCursor);
    calcState.promptInput = before + text + after;
    calcState.promptCursor = before.length + text.length + cursorOffsetFromEnd;
    calcState.promptError = "";
    renderLCD();
    return;
  }

  // Matris / vektör / istatistik / tablo editöründe yazmaya başlamak seçili hücreyi düzenler
  if (GRID_EDIT_VIEWS.includes(calcState.screenView)) {
    startCellEditWith(text, cursorOffsetFromEnd);
    return;
  }

  if (calcState.screenView !== "MAIN") {
    calcState.screenView = "MAIN";
  }

  // "=" sonrasında ikili işlemle başlanırsa başa Ans eklenir
  if (calcState.justEvaluated) {
    const isBinaryOp = /^[+−×÷^²³⁻¹!%]|^\^\(/.test(text);
    if (isBinaryOp && ![4, 5, 12].includes(calcState.modeId)) {
      calcState.expr = "Ans";
      calcState.cursorPos = 3;
    } else {
      calcState.expr = "";
      calcState.cursorPos = 0;
    }
    calcState.justEvaluated = false;
  }

  calcState.resultHtml = ""; // ifade değişince eski sonucu gösterme
  const before = calcState.expr.slice(0, calcState.cursorPos);
  const after = calcState.expr.slice(calcState.cursorPos);
  calcState.expr = before + text + after;
  calcState.cursorPos = before.length + text.length + cursorOffsetFromEnd;
  renderLCD();
}

function startCellEditWith(text, cursorOffsetFromEnd = 0) {
  const v = calcState.screenView;
  if (v === "MATRIX_EDIT") promptCurrentMatrixCell();
  else if (v === "VECTOR_EDIT") promptCurrentVectorCell();
  else if (v === "STAT_EDIT") promptCurrentStatCell();
  else if (v === "SPREADSHEET") promptCurrentSheetCell();
  else return;
  insertAtCursor(text, cursorOffsetFromEnd);
}

/* ==========================================================================
   EVALUATION DISPATCHER BY MODE (`=` KEY)
   ========================================================================== */
function executeEquals(forceApproximate = false) {
  if (!calcState.powerOn) return;

  if (calcState.screenView === "MENU") {
    const selectedMode = CLASSWIZ_MODES[calcState.menuCursor];
    if (selectedMode) selectCalculatorMode(selectedMode.id);
    return;
  }

  if (LIST_VIEWS.includes(calcState.screenView)) {
    const item = calcState.listItems[calcState.listCursor];
    if (item && calcState.listCallback) calcState.listCallback(item, calcState.listCursor);
    return;
  }

  if (calcState.screenView === "PROMPT") {
    advancePromptQueue();
    return;
  }
  if (calcState.screenView === "MATRIX_EDIT") {
    promptCurrentMatrixCell();
    return;
  }
  if (calcState.screenView === "VECTOR_EDIT") {
    promptCurrentVectorCell();
    return;
  }
  if (calcState.screenView === "STAT_EDIT") {
    promptCurrentStatCell();
    return;
  }
  if (calcState.screenView === "SPREADSHEET") {
    promptCurrentSheetCell();
    return;
  }
  if (calcState.screenView !== "MAIN") return;

  const raw = calcState.expr.trim();
  if (!raw) return;
  calcState.lastEvalExpr = raw;
  calcState.engShift = 0;

  try {
    // MODE 2: COMPLEX
    if (calcState.modeId === 2) {
      const cRes = evaluateComplexExpression(raw, calcState.settings.angleUnit, calcState.lastComplexResult, calcState.vars);
      calcState.lastComplexResult = cRes;
      calcState.lastNumericResult = cRes.re;
      calcState.displayFormat = forceApproximate ? "POLAR" : "SYMBOLIC";
      calcState.resultHtml = forceApproximate
        ? cRes.toPolarString(calcState.settings.angleUnit)
        : cRes.toRectString();
      calcState.justEvaluated = true;
      pushHistory(raw, calcState.resultHtml);
      renderLCD();
      return;
    }

    // MODE 3: BASE-N
    if (calcState.modeId === 3) {
      const val32 = evaluateBaseN(raw, calcState.baseN, calcState.lastBaseNVal);
      calcState.lastBaseNVal = val32;
      calcState.lastNumericResult = val32;
      calcState.resultHtml = formatBaseN(val32, calcState.baseN);
      calcState.justEvaluated = true;
      pushHistory(`${raw} [${getBaseName(calcState.baseN)}]`, calcState.resultHtml);
      renderLCD();
      return;
    }

    // MODE 4: MATRIX
    if (calcState.modeId === 4) {
      const matRes = evaluateMatrixExpression(raw);
      calcState.justEvaluated = true;
      if (Array.isArray(matRes)) {
        calcState.matrices.MatAns = matRes;
        calcState.resultHtml = formatMatrixInline(matRes);
      } else {
        if (!Number.isFinite(matRes)) throw new Error("Math ERROR");
        setAnswer(matRes);
        calcState.resultHtml = formatNumberDisplay(matRes, calcState.settings);
      }
      pushHistory(raw, calcState.resultHtml);
      renderLCD();
      return;
    }

    // MODE 5: VECTOR
    if (calcState.modeId === 5) {
      const vctRes = evaluateVectorExpression(raw);
      calcState.justEvaluated = true;
      if (Array.isArray(vctRes)) {
        if (!vctRes.every(Number.isFinite)) throw new Error("Math ERROR");
        calcState.vectors.VctAns = vctRes;
        calcState.resultHtml = `[${vctRes.map(v => Number(v.toPrecision(6))).join(", ")}]`;
      } else {
        if (!Number.isFinite(vctRes)) throw new Error("Math ERROR");
        setAnswer(vctRes);
        calcState.resultHtml = formatNumberDisplay(vctRes, calcState.settings);
      }
      pushHistory(raw, calcState.resultHtml);
      renderLCD();
      return;
    }

    // MODE 12: VERIFY
    if (calcState.modeId === 12) {
      const verRes = evaluateVerifyExpression(raw);
      calcState.resultHtml = verRes ? "TRUE" : "FALSE";
      calcState.justEvaluated = true;
      pushHistory(raw, calcState.resultHtml);
      renderLCD();
      return;
    }

    // MODE 1 (ve diğerleri): NORMAL HESAP
    let val = evaluateMathExpression(raw, calcState);
    if (typeof val !== "number" || !Number.isFinite(val)) {
      calcState.resultHtml = "Math ERROR";
      calcState.justEvaluated = true;
      renderLCD();
      return;
    }

    // 0.1+0.2−0.3 gibi iptal gürültüsünü (5.55×10⁻¹⁷) 0'a çek; gerçekten küçük sonuçlara
    // (Planck sabiti vb.) dokunmaz çünkü karşılaştırma ifadenin kendi büyüklüğüne göre yapılır.
    if (val !== 0 && !/Pol\(|Rec\(|Ran/.test(raw)) {
      try {
        const mag = Math.abs(evaluateMathExpression(buildMagnitudeExpr(raw), calcState));
        if (Number.isFinite(mag) && Math.abs(val) < mag * 4e-15) val = 0;
      } catch (_) {}
    }

    setAnswer(val);
    calcState.justEvaluated = true;

    const useSymbolic = calcState.settings.ioMode === "MathI/MathO" && !forceApproximate;
    const sym = useSymbolic ? toSymbolicForm(val) : null;
    if (sym) {
      calcState.displayFormat = "SYMBOLIC";
      calcState.resultHtml = sym.html;
    } else {
      calcState.displayFormat = "DECIMAL";
      calcState.resultHtml = formatNumberDisplay(val, calcState.settings);
    }

    pushHistory(raw, formatNumberDisplay(val, calcState.settings));
    renderLCD();
    updateCompanionSidebar();
  } catch (err) {
    calcState.resultHtml = errorLabel(err);
    calcState.justEvaluated = true;
    renderLCD();
  }
}

/* ==========================================================================
   MATRIX, VECTOR & VERIFY MODE EVALUATORS
   ========================================================================== */
function formatMatrixInline(M) {
  return "[" + M.map(r => "[" + r.map(v => Number(v.toPrecision(5))).join(",") + "]").join(" ") + "]";
}

function evaluateMatrixExpression(raw) {
  const s = raw.trim();
  const getM = name => {
    const M = calcState.matrices[name];
    if (!M) throw new Error("Syntax ERROR");
    return M;
  };
  const operand = str => (calcState.matrices[str] ? calcState.matrices[str] : Number.isFinite(parseFloat(str)) && /^[-−]?[\d.]+$/.test(str) ? parseFloat(str.replace("−", "-")) : getM(str));

  // Det( / Trn( — kapanış parantezi unutulsa da çalışır (ClassWiz otomatik kapatır)
  const det = s.match(/^Det\(\s*(\w+)\s*\)?$/);
  if (det) return matDet(getM(det[1]));
  const trn = s.match(/^Trn\(\s*(\w+)\s*\)?$/);
  if (trn) return matTranspose(getM(trn[1]));
  if (/^Mat(A|B|C|Ans)⁻¹$/.test(s)) return matInverse(getM(s.replace("⁻¹", "")));
  if (/^Mat(A|B|C|Ans)²$/.test(s)) {
    const m = getM(s.replace("²", ""));
    return matMul(m, m);
  }
  if (s.includes("+")) {
    const [a, b] = s.split("+").map(x => x.trim());
    return matAdd(getM(a), getM(b), 1);
  }
  if (s.includes("×") || s.includes("*")) {
    const [a, b] = s.split(/[×*]/).map(x => x.trim());
    return matMul(operand(a), operand(b));
  }
  if (/^[^−-]+[−-][^−-]+$/.test(s)) {
    const [a, b] = s.split(/[−-]/).map(x => x.trim());
    return matAdd(getM(a), getM(b), -1);
  }
  if (calcState.matrices[s]) return calcState.matrices[s];
  return evaluateMathExpression(raw, calcState);
}

function evaluateVectorExpression(raw) {
  const s = raw.trim();
  const getV = name => {
    const V = calcState.vectors[name];
    if (!V) throw new Error("Syntax ERROR");
    return V;
  };
  const sameDim = (u, v) => {
    if (u.length !== v.length) throw new Error("Dimension ERROR");
  };
  const args = (str, prefix) => str.slice(prefix.length).replace(/\)$/, "").split(",").map(x => x.trim());

  if (s.startsWith("Dot(")) {
    const [a, b] = args(s, "Dot(");
    return vctDot(getV(a), getV(b));
  }
  if (s.startsWith("Angle(")) {
    const [a, b] = args(s, "Angle(");
    const u = getV(a), v = getV(b);
    sameDim(u, v);
    const cosT = vctDot(u, v) / (vctNorm(u) * vctNorm(v));
    const rad = Math.acos(Math.max(-1, Math.min(1, cosT)));
    const unit = calcState.settings.angleUnit;
    return unit === "DEG" ? (rad * 180) / Math.PI : unit === "GRA" ? (rad * 200) / Math.PI : rad;
  }
  if (s.startsWith("UnitV(")) {
    const u = getV(args(s, "UnitV(")[0]);
    const n = vctNorm(u);
    if (n === 0) throw new Error("Math ERROR");
    return u.map(x => x / n);
  }
  if (s.startsWith("Abs(")) {
    const inner = args(s, "Abs(")[0];
    if (calcState.vectors[inner]) return vctNorm(calcState.vectors[inner]);
  }
  if (s.includes("+")) {
    const [a, b] = s.split("+").map(x => x.trim());
    const u = getV(a), v = getV(b);
    sameDim(u, v);
    return u.map((x, i) => x + v[i]);
  }
  if (s.includes("×") || s.includes("*")) {
    const [a, b] = s.split(/[×*]/).map(x => x.trim());
    const num = t => parseFloat(t.replace("−", "-"));
    if (calcState.vectors[a] && calcState.vectors[b]) return vctCross(getV(a), getV(b));
    if (!Number.isNaN(num(a)) && calcState.vectors[b]) return getV(b).map(x => num(a) * x);
    if (calcState.vectors[a] && !Number.isNaN(num(b))) return getV(a).map(x => num(b) * x);
  }
  if (/^[^−-]+[−-][^−-]+$/.test(s)) {
    const [a, b] = s.split(/[−-]/).map(x => x.trim());
    const u = getV(a), v = getV(b);
    sameDim(u, v);
    return u.map((x, i) => x - v[i]);
  }
  if (calcState.vectors[s]) return calcState.vectors[s];
  return evaluateMathExpression(raw, calcState);
}

function evaluateVerifyExpression(raw) {
  const ops = ["≥", "≤", "≠", "=", ">", "<"];
  for (const op of ops) {
    if (raw.includes(op)) {
      const [lhs, rhs] = raw.split(op);
      const l = evaluateMathExpression(lhs, calcState);
      const r = evaluateMathExpression(rhs, calcState);
      const diff = Math.abs(l - r);
      if (op === "=") return diff < 1e-9;
      if (op === "≠") return diff >= 1e-9;
      if (op === ">") return l > r + 1e-11;
      if (op === "<") return l < r - 1e-11;
      if (op === "≥") return l >= r - 1e-9;
      if (op === "≤") return l <= r + 1e-9;
    }
  }
  return false;
}

/* ==========================================================================
   MULTI-STEP INTERACTIVE PROMPT QUEUE (CALC, SOLVE, TABLE, DIST, EQN)
   ========================================================================== */
function startPromptSequence(title, prompts, onComplete, onCancel) {
  calcState.screenView = "PROMPT";
  calcState.promptTitle = title;
  calcState.promptQueue = prompts.map(p => ({ ...p }));
  calcState.collectedPrompts = {};
  calcState.promptOnDone = onComplete;
  calcState.promptOnCancel = onCancel || null;
  loadPromptDefault();
  renderLCD();
}

function loadPromptDefault() {
  const cur = calcState.promptQueue[0];
  const dv = cur ? cur.defaultVal : "";
  calcState.promptInput = typeof dv === "number" ? numberToInputString(dv) : String(dv ?? "");
  calcState.promptCursor = calcState.promptInput.length;
  calcState.promptFresh = true;
  calcState.promptError = "";
}

function advancePromptQueue() {
  if (!calcState.promptQueue.length) return;
  const current = calcState.promptQueue[0];
  let val = calcState.promptInput.trim();
  if (!current.rawText) {
    if (val === "") {
      val = current.defaultVal;
    } else {
      // Hatalı giriş artık sessizce 0 sayılmıyor: hata gösterilir, aynı soruda kalınır
      try {
        val = evaluateMathExpression(val, calcState);
      } catch (err) {
        calcState.promptError = errorLabel(err);
        renderLCD();
        return;
      }
    }
    if (typeof val !== "number" || !Number.isFinite(val)) {
      calcState.promptError = "Math ERROR";
      renderLCD();
      return;
    }
  }
  calcState.promptQueue.shift();
  calcState.collectedPrompts[current.key] = val;

  if (calcState.promptQueue.length > 0) {
    loadPromptDefault();
    renderLCD();
  } else {
    const collected = { ...calcState.collectedPrompts };
    calcState.collectedPrompts = {};
    calcState.screenView = "MAIN";
    if (calcState.promptOnDone) calcState.promptOnDone(collected);
  }
}

/* ==========================================================================
   MODE SWITCHING (`MENU` + 1..C)
   ========================================================================== */
function selectCalculatorMode(modeId) {
  calcState.modeId = modeId;
  calcState.screenView = "MAIN";
  calcState.expr = "";
  calcState.cursorPos = 0;
  calcState.resultHtml = "0";
  calcState.justEvaluated = false;
  calcState.lastEvalExpr = null;
  calcState.displayFormat = "SYMBOLIC";
  calcState.promptQueue = [];

  if (modeId === 4) {
    // Matrix Mode: open Matrix selector or Main
    openMatrixOptionMenu();
    return;
  }
  if (modeId === 5) {
    openVectorOptionMenu();
    return;
  }
  if (modeId === 6) {
    openStatisticsMenu();
    return;
  }
  if (modeId === 7) {
    openDistributionMenu();
    return;
  }
  if (modeId === 8) {
    calcState.screenView = "SPREADSHEET";
    calcState.gridRow = 0;
    calcState.gridCol = 0;
    renderLCD();
    return;
  }
  if (modeId === 9) {
    startTableWizard();
    return;
  }
  if (modeId === 10) {
    openEquationMenu();
    return;
  }
  if (modeId === 11) {
    openInequalityMenu();
    return;
  }
  renderLCD();
}

/* ==========================================================================
   INTERACTIVE MENUS: SET UP, OPTN, CONST, CONV, RESET, MATRIX, STAT, EQN
   ========================================================================== */
function syncAngleButtons() {
  ["DEG", "RAD", "GRA"].forEach(u => {
    const btn = document.getElementById(`angle-btn-${u}`);
    if (btn) btn.classList.toggle("active", u === calcState.settings.angleUnit);
  });
}

function setAngleUnit(unit) {
  calcState.settings.angleUnit = unit;
  if (calcState.screenView === "SETUP") calcState.screenView = homeView();
  syncAngleButtons();
  // Yalnızca son hesaplanan ifade hâlâ ekrandaysa yeniden hesapla
  // (eskiden "Ans→M+", "x²−4=0" gibi satırlar da hesaplanıp Syntax ERROR veriyordu)
  if (
    calcState.screenView === "MAIN" &&
    calcState.justEvaluated &&
    calcState.lastEvalExpr &&
    calcState.expr.trim() === calcState.lastEvalExpr
  ) {
    executeEquals();
  } else {
    renderLCD();
  }
}

function openListMenu(viewName, title, items, onSelect) {
  const from = calcState.screenView;
  // Listeden sonra dönülecek ekran (giriş ekranından açıldıysa oraya geri dönülür)
  if (!LIST_VIEWS.includes(from)) {
    calcState.listReturnView = from === "PROMPT" ? "PROMPT" : from === "SPREADSHEET" ? "SPREADSHEET" : homeView();
  }
  calcState.screenView = viewName;
  calcState.listTitle = title;
  calcState.listItems = items;
  calcState.listCursor = 0;
  calcState.listCallback = onSelect;
  renderLCD();
}

function insertFromList(text, cursorOffsetFromEnd = 0) {
  calcState.screenView = calcState.listReturnView || homeView();
  insertAtCursor(text, cursorOffsetFromEnd);
}

function openSetupMenu() {
  openListMenu(
    "SETUP",
    "SET UP (1~7 Tuşuna Basın)",
    [
      { label: "1: Input/Output (Giriş/Çıkış)", action: "SUB_IO" },
      { label: "2: Angle Unit (Açı Birimi: D/R/G)", action: "SUB_ANGLE" },
      { label: "3: Number Format (Fix/Sci/Norm)", action: "SUB_FMT" },
      { label: "4: Engineer Symbol (Müh. Sembolü)", action: "ENG_SYM" },
      { label: "5: Hızlı Seçim → Degree (D)", action: "DEG" },
      { label: "6: Hızlı Seçim → Radian (R)", action: "RAD" },
      { label: "7: Hızlı Seçim → Gradian (G)", action: "GRA" }
    ],
    item => {
      if (item.action === "SUB_IO") {
        openListMenu(
          "SETUP",
          "1: INPUT / OUTPUT",
          [
            { label: "1: MathI / MathO (Doğal Kesir/Kök)", mode: "MathI/MathO" },
            { label: "2: MathI / DecimalO (Ondalık Sonuç)", mode: "MathI/DecimalO" }
          ],
          sub => {
            calcState.settings.ioMode = sub.mode;
            calcState.screenView = "MAIN";
            renderLCD();
          }
        );
        return;
      }
      if (item.action === "SUB_ANGLE") {
        openListMenu(
          "SETUP",
          "2: ANGLE UNIT (AÇI BİRİMİ)",
          [
            { label: "1: Degree (Derece — D)", unit: "DEG" },
            { label: "2: Radian (Radyan — R)", unit: "RAD" },
            { label: "3: Gradian (Gradyan — G)", unit: "GRA" }
          ],
          sub => {
            setAngleUnit(sub.unit);
          }
        );
        return;
      }
      if (item.action === "SUB_FMT") {
        openListMenu(
          "SETUP",
          "3: NUMBER FORMAT",
          [
            { label: "1: Fix (Sabit Ondalık 0~9)", fmt: "FIX" },
            { label: "2: Sci (Bilimsel 1~10)", fmt: "SCI" },
            { label: "3: Norm (Normal Gösterim)", fmt: "NORM" }
          ],
          sub => {
            if (sub.fmt === "NORM") {
              calcState.settings.numFormat = "NORM";
              calcState.screenView = "MAIN";
              renderLCD();
            } else if (sub.fmt === "FIX") {
              startPromptSequence("Fix Basamak (0~9)", [{ key: "d", label: "Fix (0~9)?", defaultVal: 4 }], res => {
                calcState.settings.numFormat = "FIX";
                calcState.settings.fixDigits = Math.max(0, Math.min(9, Math.round(res.d)));
                renderLCD();
              });
            } else if (sub.fmt === "SCI") {
              startPromptSequence("Sci Basamak (1~10)", [{ key: "d", label: "Sci (1~10)?", defaultVal: 5 }], res => {
                calcState.settings.numFormat = "SCI";
                calcState.settings.sciDigits = Math.max(1, Math.min(10, Math.round(res.d)));
                renderLCD();
              });
            }
          }
        );
        return;
      }
      if (item.action === "DEG" || item.action === "RAD" || item.action === "GRA") {
        setAngleUnit(item.action);
        return;
      }
      if (item.action === "ENG_SYM") {
        calcState.settings.engSymbol = !calcState.settings.engSymbol;
      }
      calcState.screenView = "MAIN";
      renderLCD();
    }
  );
}

function openOptnMenu() {
  const inPrompt = calcState.screenView === "PROMPT";

  if (calcState.modeId === 2) {
    openListMenu(
      "OPTN",
      "COMPLEX SEÇENEKLERİ",
      [
        { label: "1: Sanal Birim (i)", ins: "i" },
        { label: "2: Argüman Arg(", ins: "Arg(" },
        { label: "3: Eşlenik Conj(", ins: "Conj(" },
        { label: "4: Reel Kısım ReP(", ins: "ReP(" },
        { label: "5: Sanal Kısım ImP(", ins: "ImP(" },
        { label: "6: Kutupsal Gösterim ▶r∠θ", action: "TO_POLAR" },
        { label: "7: Kartezyen Gösterim ▶a+bi", action: "TO_RECT" }
      ],
      item => {
        if (item.action === "TO_POLAR" || item.action === "TO_RECT") {
          calcState.screenView = "MAIN";
          if (calcState.lastComplexResult) {
            calcState.resultHtml =
              item.action === "TO_POLAR"
                ? calcState.lastComplexResult.toPolarString(calcState.settings.angleUnit)
                : calcState.lastComplexResult.toRectString();
            calcState.displayFormat = item.action === "TO_POLAR" ? "POLAR" : "SYMBOLIC";
          }
          renderLCD();
        } else if (item.ins) {
          insertFromList(item.ins);
        }
      }
    );
    return;
  }

  if (calcState.modeId === 3) {
    openListMenu(
      "OPTN",
      "BASE-N BİTSEL İŞLEMLER",
      [
        { label: "1: and (VE)", ins: " and " },
        { label: "2: or (VEYA)", ins: " or " },
        { label: "3: xor (ÖZEL VEYA)", ins: " xor " },
        { label: "4: xnor", ins: " xnor " },
        { label: "5: Not(", ins: "Not(" },
        { label: "6: Neg(", ins: "Neg(" }
      ],
      item => insertFromList(item.ins)
    );
    return;
  }

  if (calcState.modeId === 8) {
    openListMenu(
      "OPTN",
      "TABLO FONKSİYONLARI",
      [
        { label: "1: Sum( — Toplam", ins: "Sum(" },
        { label: "2: Mean( — Ortalama", ins: "Mean(" },
        { label: "3: Min(", ins: "Min(" },
        { label: "4: Max(", ins: "Max(" },
        { label: "5: : (aralık, ör. A1:A3)", ins: ":" }
      ],
      item => insertFromList(inPrompt || item.ins === ":" ? item.ins : "=" + item.ins)
    );
    return;
  }

  if (calcState.modeId === 12) {
    openListMenu(
      "OPTN",
      "VERIFY KARŞILAŞTIRMA",
      [
        { label: "1: = (Eşittir)", ins: "=" },
        { label: "2: ≠ (Eşit Değildir)", ins: "≠" },
        { label: "3: > (Büyüktür)", ins: ">" },
        { label: "4: < (Küçüktür)", ins: "<" },
        { label: "5: ≥ (Büyük Eşittir)", ins: "≥" },
        { label: "6: ≤ (Küçük Eşittir)", ins: "≤" }
      ],
      item => insertFromList(item.ins)
    );
    return;
  }

  // Bir değer girilirken OPTN fonksiyon kataloğunu açar; aksi hâlde modun kendi menüsünü
  if (!inPrompt) {
    if (calcState.modeId === 4) return openMatrixOptionMenu();
    if (calcState.modeId === 5) return openVectorOptionMenu();
    if (calcState.modeId === 6) return openStatisticsMenu();
    if (calcState.modeId === 7) return openDistributionMenu();
    if (calcState.modeId === 9) return startTableWizard();
    if (calcState.modeId === 10) return openEquationMenu();
    if (calcState.modeId === 11) return openInequalityMenu();
  }

  openListMenu(
    "OPTN",
    "OPTN — FONKSİYON KATALOĞU",
    [
      { label: "1: sinh(", ins: "sinh(" },
      { label: "2: cosh(", ins: "cosh(" },
      { label: "3: tanh(", ins: "tanh(" },
      { label: "4: sinh⁻¹(", ins: "sinh⁻¹(" },
      { label: "5: cosh⁻¹(", ins: "cosh⁻¹(" },
      { label: "6: tanh⁻¹(", ins: "tanh⁻¹(" },
      { label: "7: Mutlak Değer Abs(", ins: "Abs(" },
      { label: "8: EBOB GCD(a,b)", ins: "GCD(" },
      { label: "9: EKOK LCM(a,b)", ins: "LCM(" },
      { label: "10: Tam Kısım Int(", ins: "Int(" },
      { label: "11: Kesir Kısmı Frac(", ins: "Frac(" },
      { label: "12: Faktöriyel !", ins: "!" },
      { label: "13: Permütasyon P", ins: "P" },
      { label: "14: Kombinasyon C", ins: "C" }
    ],
    item => insertFromList(item.ins)
  );
}

function openMatrixOptionMenu() {
  openListMenu(
    "OPTN",
    "MATRIX MENÜSÜ",
    [
      { label: "1: MatA Düzenle / Boyutla", action: "EDIT_MatA" },
      { label: "2: MatB Düzenle / Boyutla", action: "EDIT_MatB" },
      { label: "3: MatC Düzenle / Boyutla", action: "EDIT_MatC" },
      { label: "4: MatA Ekle", ins: "MatA" },
      { label: "5: MatB Ekle", ins: "MatB" },
      { label: "6: MatC Ekle", ins: "MatC" },
      { label: "7: MatAns Ekle", ins: "MatAns" },
      { label: "8: Determinant Det(", ins: "Det(" },
      { label: "9: Transpoz Trn(", ins: "Trn(" }
    ],
    item => {
      if (item.action && item.action.startsWith("EDIT_")) {
        const name = item.action.replace("EDIT_", "");
        calcState.activeMatName = name;
        startPromptSequence(
          `${name} Boyutu (1~4)`,
          [
            { key: "rows", label: "Satır Sayısı (m)?", defaultVal: calcState.matrices[name].length },
            { key: "cols", label: "Sütun Sayısı (n)?", defaultVal: calcState.matrices[name][0].length }
          ],
          res => {
            const m = Math.max(1, Math.min(4, Math.round(res.rows)));
            const n = Math.max(1, Math.min(4, Math.round(res.cols)));
            const old = calcState.matrices[name];
            calcState.matrices[name] = Array.from({ length: m }, (_, r) =>
              Array.from({ length: n }, (_, c) => (old[r] && old[r][c] !== undefined ? old[r][c] : 0))
            );
            calcState.screenView = "MATRIX_EDIT";
            calcState.gridRow = 0;
            calcState.gridCol = 0;
            renderLCD();
          },
          () => openMatrixOptionMenu()
        );
      } else if (item.ins) {
        insertFromList(item.ins);
      }
    }
  );
}

function openVectorOptionMenu() {
  openListMenu(
    "OPTN",
    "VECTOR MENÜSÜ",
    [
      { label: "1: VctA Düzenle (2B/3B)", action: "EDIT_VctA" },
      { label: "2: VctB Düzenle (2B/3B)", action: "EDIT_VctB" },
      { label: "3: VctC Düzenle (2B/3B)", action: "EDIT_VctC" },
      { label: "4: VctA Ekle", ins: "VctA" },
      { label: "5: VctB Ekle", ins: "VctB" },
      { label: "6: İç Çarpım Dot(VctA,VctB)", ins: "Dot(VctA,VctB)" },
      { label: "7: Vektörel Çarpım VctA×VctB", ins: "VctA×VctB" },
      { label: "8: Açı Angle(VctA,VctB)", ins: "Angle(VctA,VctB)" },
      { label: "9: Birim Vektör UnitV(VctA)", ins: "UnitV(VctA)" }
    ],
    item => {
      if (item.action && item.action.startsWith("EDIT_")) {
        const name = item.action.replace("EDIT_", "");
        calcState.activeVctName = name;
        startPromptSequence(
          `${name} Boyutu`,
          [{ key: "dim", label: "Boyut (2 veya 3)?", defaultVal: calcState.vectors[name].length }],
          res => {
            const d = Math.round(res.dim) === 2 ? 2 : 3;
            const old = calcState.vectors[name];
            calcState.vectors[name] = Array.from({ length: d }, (_, i) => old[i] || 0);
            calcState.screenView = "VECTOR_EDIT";
            calcState.gridCol = 0;
            renderLCD();
          },
          () => openVectorOptionMenu()
        );
      } else if (item.ins) {
        insertFromList(item.ins);
      }
    }
  );
}

function openStatisticsMenu() {
  openListMenu(
    "OPTN",
    "6: İSTATİSTİK (STATISTICS)",
    [
      { label: "1: 1-Değişkenli Veri Tablosu", action: "EDIT_1VAR" },
      { label: "2: 2-Değişkenli (y=a+bx) Tablo", action: "EDIT_2VAR" },
      { label: "3: 1-Değişken İstatistik Sonuçları", action: "CALC_1VAR" },
      { label: "4: Doğrusal Regresyon (a,b,r)", action: "CALC_2VAR" }
    ],
    item => {
      if (item.action === "EDIT_1VAR") {
        calcState.statType = "1-VAR";
        calcState.screenView = "STAT_EDIT";
        calcState.gridRow = 0;
        calcState.gridCol = 0;
        renderLCD();
      } else if (item.action === "EDIT_2VAR") {
        calcState.statType = "2-VAR";
        calcState.screenView = "STAT_EDIT";
        calcState.gridRow = 0;
        calcState.gridCol = 0;
        renderLCD();
      } else if (item.action === "CALC_1VAR") {
        const lines = compute1VarStats(calcState.statData.x, calcState.statData.freq) || ["Veri Yok"];
        openListMenu("OPTN", "1-DEĞİŞKEN SONUÇLARI", lines.map(l => ({ label: l })), () => {
          calcState.screenView = "STAT_EDIT";
          renderLCD();
        });
      } else if (item.action === "CALC_2VAR") {
        const lines = compute2VarLinearReg(calcState.statData.x, calcState.statData.y);
        openListMenu("OPTN", "REGRESYON (y=a+bx)", lines.map(l => ({ label: l })), () => {
          calcState.screenView = "STAT_EDIT";
          renderLCD();
        });
      }
    }
  );
}

function openDistributionMenu() {
  const showResult = (expr, value) => {
    calcState.screenView = "MAIN";
    calcState.expr = expr;
    calcState.cursorPos = expr.length;
    calcState.lastEvalExpr = null;
    calcState.displayFormat = "DECIMAL";
    if (Number.isFinite(value)) setAnswer(value);
    calcState.resultHtml = formatNumberDisplay(value, calcState.settings);
    calcState.justEvaluated = true;
    renderLCD();
    updateCompanionSidebar();
  };
  const back = () => openDistributionMenu();

  openListMenu(
    "OPTN",
    "7: OLASILIK DAĞILIMLARI",
    [
      { label: "1: Normal PD (Yoğunluk)", action: "NORM_PD" },
      { label: "2: Normal CD (Kümülatif)", action: "NORM_CD" },
      { label: "3: Ters Normal (Inverse Normal)", action: "INV_NORM" },
      { label: "4: Binom PD (P(X=x))", action: "BINOM_PD" },
      { label: "5: Poisson PD (P(X=x))", action: "POISSON_PD" }
    ],
    item => {
      if (item.action === "NORM_PD") {
        startPromptSequence(
          "Normal PD",
          [
            { key: "x", label: "x değeri?", defaultVal: 0 },
            { key: "sigma", label: "Standart Sapma (σ)?", defaultVal: 1 },
            { key: "mu", label: "Ortalama (μ)?", defaultVal: 0 }
          ],
          res => showResult(`NormalPD(${res.x}, μ=${res.mu}, σ=${res.sigma})`, normalPDF(res.x, res.mu, res.sigma)),
          back
        );
      } else if (item.action === "NORM_CD") {
        startPromptSequence(
          "Normal CD",
          [
            { key: "low", label: "Alt Sınır (Lower)?", defaultVal: -1.96 },
            { key: "up", label: "Üst Sınır (Upper)?", defaultVal: 1.96 },
            { key: "sigma", label: "Standart Sapma (σ)?", defaultVal: 1 },
            { key: "mu", label: "Ortalama (μ)?", defaultVal: 0 }
          ],
          res => showResult(`NormalCD(${res.low}, ${res.up})`, normalCDF(res.low, res.up, res.mu, res.sigma)),
          back
        );
      } else if (item.action === "INV_NORM") {
        startPromptSequence(
          "Inverse Normal",
          [
            { key: "area", label: "Alan (Area 0~1)?", defaultVal: 0.975 },
            { key: "sigma", label: "Standart Sapma (σ)?", defaultVal: 1 },
            { key: "mu", label: "Ortalama (μ)?", defaultVal: 0 }
          ],
          res => showResult(`InvNorm(Area=${res.area})`, invNormal(res.area, res.mu, res.sigma)),
          back
        );
      } else if (item.action === "BINOM_PD") {
        startPromptSequence(
          "Binomial PD",
          [
            { key: "x", label: "Başarı sayısı (x)?", defaultVal: 3 },
            { key: "n", label: "Deneme sayısı (N)?", defaultVal: 10 },
            { key: "p", label: "Olasılık (p)?", defaultVal: 0.5 }
          ],
          res => showResult(`BinomialPD(x=${res.x}, N=${res.n}, p=${res.p})`, binomialPD(res.x, res.n, res.p)),
          back
        );
      } else if (item.action === "POISSON_PD") {
        startPromptSequence(
          "Poisson PD",
          [
            { key: "x", label: "Olay sayısı (x)?", defaultVal: 2 },
            { key: "lam", label: "Ortalama (λ)?", defaultVal: 3 }
          ],
          res => showResult(`PoissonPD(x=${res.x}, λ=${res.lam})`, poissonPD(res.x, res.lam)),
          back
        );
      }
    }
  );
}

function startTableWizard() {
  startPromptSequence(
    "9: FONKSİYON TABLOSU",
    [
      { key: "f", label: "f(x) =", defaultVal: calcState.tableConfig.f, rawText: true },
      { key: "g", label: "g(x) = (boş bırakılabilir)", defaultVal: calcState.tableConfig.g, rawText: true },
      { key: "start", label: "Başlangıç (Start)?", defaultVal: calcState.tableConfig.start },
      { key: "end", label: "Bitiş (End)?", defaultVal: calcState.tableConfig.end },
      { key: "step", label: "Adım (Step)?", defaultVal: calcState.tableConfig.step }
    ],
    res => {
      calcState.tableConfig = { f: res.f, g: res.g, start: res.start, end: res.end, step: res.step };
      const rows = [];
      const step = res.step > 0 ? res.step : 1;
      const maxRows = res.g && res.g.trim() ? 30 : 45;
      runWithTimeBudget(6000, () => {
      for (let i = 0; rows.length < maxRows; i++) {
        const x = res.start + i * step; // biriken kayan nokta hatası olmasın diye her adımda yeniden hesapla
        if (x > res.end + Math.abs(step) * 1e-9) break;
        const cleanX = Number(x.toPrecision(10));
        let fx = NaN, gx = null;
        try { fx = evaluateMathExpression(res.f, calcState, { x: cleanX }); } catch (_) {}
        if (res.g && res.g.trim()) {
          gx = NaN;
          try { gx = evaluateMathExpression(res.g, calcState, { x: cleanX }); } catch (_) {}
        }
        rows.push({
          x: cleanX,
          fx: Number.isFinite(fx) ? Number(fx.toPrecision(7)) : "ERR",
          gx: gx !== null ? (Number.isFinite(gx) ? Number(gx.toPrecision(7)) : "ERR") : null
        });
      }
      });
      calcState.tableRows = rows;
      calcState.screenView = "TABLE_RES";
      calcState.gridRow = 0;
      renderLCD();
    },
    () => { calcState.screenView = "MAIN"; }
  );
}

function openEquationMenu() {
  const back = () => openEquationMenu();
  const showList = (title, lines) =>
    openListMenu("EQN_UI", title, lines.map(l => ({ label: l })), () => openEquationMenu());
  openListMenu(
    "EQN_UI",
    "A: DENKLEM ÇÖZÜCÜ (EQUATION)",
    [
      { label: "1: 2 Bilinmeyenli Denklem (a₁x+b₁y=c₁)", action: "SIMUL_2" },
      { label: "2: 3 Bilinmeyenli Denklem Sistemi", action: "SIMUL_3" },
      { label: "3: 2. Derece Polinom (ax²+bx+c=0)", action: "POLY_2" },
      { label: "4: 3. Derece Polinom (ax³+bx²+cx+d=0)", action: "POLY_3" },
      { label: "5: 4. Derece Polinom (ax⁴+...+e=0)", action: "POLY_4" }
    ],
    item => {
      if (item.action === "SIMUL_2") {
        startPromptSequence(
          "a₁x + b₁y = c₁",
          [
            { key: "a1", label: "a₁?", defaultVal: 2 },
            { key: "b1", label: "b₁?", defaultVal: 1 },
            { key: "c1", label: "c₁?", defaultVal: 5 },
            { key: "a2", label: "a₂?", defaultVal: 1 },
            { key: "b2", label: "b₂?", defaultVal: -1 },
            { key: "c2", label: "c₂?", defaultVal: 1 }
          ],
          r => {
            const sol = solveLinearSystem([[r.a1, r.b1, r.c1], [r.a2, r.b2, r.c2]]);
            showList("DENKLEM SİSTEMİ ÇÖZÜMÜ", sol ? [`x = ${sol[0]}`, `y = ${sol[1]}`] : ["Çözüm Yok / Sonsuz Çözüm"]);
          },
          back
        );
      } else if (item.action === "SIMUL_3") {
        startPromptSequence(
          "aₙx + bₙy + cₙz = dₙ",
          [
            { key: "a1", label: "a₁?", defaultVal: 1 }, { key: "b1", label: "b₁?", defaultVal: 1 }, { key: "c1", label: "c₁?", defaultVal: 1 }, { key: "d1", label: "d₁?", defaultVal: 6 },
            { key: "a2", label: "a₂?", defaultVal: 2 }, { key: "b2", label: "b₂?", defaultVal: -1 }, { key: "c2", label: "c₂?", defaultVal: 1 }, { key: "d2", label: "d₂?", defaultVal: 3 },
            { key: "a3", label: "a₃?", defaultVal: 1 }, { key: "b3", label: "b₃?", defaultVal: 2 }, { key: "c3", label: "c₃?", defaultVal: -1 }, { key: "d3", label: "d₃?", defaultVal: 2 }
          ],
          r => {
            const sol = solveLinearSystem([
              [r.a1, r.b1, r.c1, r.d1],
              [r.a2, r.b2, r.c2, r.d2],
              [r.a3, r.b3, r.c3, r.d3]
            ]);
            showList("3 BİLİNMEYEN ÇÖZÜMÜ", sol ? [`x = ${sol[0]}`, `y = ${sol[1]}`, `z = ${sol[2]}`] : ["Çözüm Yok / Sonsuz Çözüm"]);
          },
          back
        );
      } else if (item.action === "POLY_2") {
        startPromptSequence(
          "ax² + bx + c = 0",
          [
            { key: "a", label: "a (x² katsayısı)?", defaultVal: 1 },
            { key: "b", label: "b (x katsayısı)?", defaultVal: -5 },
            { key: "c", label: "c (sabit)?", defaultVal: 6 }
          ],
          r => showList(`${r.a}x²+(${r.b})x+(${r.c})=0`, solvePolynomialRoots([r.a, r.b, r.c])),
          back
        );
      } else if (item.action === "POLY_3") {
        startPromptSequence(
          "ax³ + bx² + cx + d = 0",
          [
            { key: "a", label: "a (x³)?", defaultVal: 1 },
            { key: "b", label: "b (x²)?", defaultVal: -6 },
            { key: "c", label: "c (x)?", defaultVal: 11 },
            { key: "d", label: "d (sabit)?", defaultVal: -6 }
          ],
          r => showList("3. DERECE KÖKLER", solvePolynomialRoots([r.a, r.b, r.c, r.d])),
          back
        );
      } else if (item.action === "POLY_4") {
        startPromptSequence(
          "ax⁴ + bx³ + cx² + dx + e = 0",
          [
            { key: "a", label: "a (x⁴)?", defaultVal: 1 },
            { key: "b", label: "b (x³)?", defaultVal: 0 },
            { key: "c", label: "c (x²)?", defaultVal: -5 },
            { key: "d", label: "d (x)?", defaultVal: 0 },
            { key: "e", label: "e (sabit)?", defaultVal: 4 }
          ],
          r => showList("4. DERECE KÖKLER", solvePolynomialRoots([r.a, r.b, r.c, r.d, r.e])),
          back
        );
      }
    }
  );
}

function openInequalityMenu() {
  openListMenu(
    "EQN_UI",
    "B: EŞİTSİZLİK ÇÖZÜCÜ (ax²+bx+c)",
    [
      { label: "1: ax² + bx + c > 0", op: ">" },
      { label: "2: ax² + bx + c < 0", op: "<" },
      { label: "3: ax² + bx + c ≥ 0", op: "≥" },
      { label: "4: ax² + bx + c ≤ 0", op: "≤" }
    ],
    item => {
      startPromptSequence(
        `ax² + bx + c ${item.op} 0`,
        [
          { key: "a", label: "a?", defaultVal: 1 },
          { key: "b", label: "b?", defaultVal: -5 },
          { key: "c", label: "c?", defaultVal: 6 }
        ],
        r => {
          const wantPos = item.op === ">" || item.op === "≥";
          const strict = item.op === ">" || item.op === "<";
          const lt = strict ? "<" : "≤";
          const fmt = v => Number(v.toPrecision(10));
          let ans;
          if (r.a === 0) {
            ans = "Math ERROR"; // ikinci derece eşitsizlikte a ≠ 0 olmalı
          } else {
            const disc = r.b * r.b - 4 * r.a * r.c;
            const tol = 1e-12 * Math.max(r.b * r.b, Math.abs(4 * r.a * r.c));
            const opensUp = r.a > 0;
            if (disc < -tol) {
              ans = opensUp === wantPos ? "Tüm Reel Sayılar (ℝ)" : "Çözüm Yok (∅)";
            } else if (Math.abs(disc) <= tol) {
              // çift kök: eskiden "1 < x < 1" gibi anlamsız sonuçlar çıkıyordu
              const x0 = fmt(-r.b / (2 * r.a));
              if (opensUp === wantPos) ans = strict ? `x ≠ ${x0}` : "Tüm Reel Sayılar (ℝ)";
              else ans = strict ? "Çözüm Yok (∅)" : `x = ${x0}`;
            } else {
              const sq = Math.sqrt(disc);
              const q = r.b >= 0 ? -(r.b + sq) / 2 : (-r.b + sq) / 2;
              const ra = q / r.a;
              const rb = q !== 0 ? r.c / q : 0;
              const x1 = fmt(Math.min(ra, rb));
              const x2 = fmt(Math.max(ra, rb));
              ans = opensUp === wantPos ? `x ${lt} ${x1},  ${x2} ${lt} x` : `${x1} ${lt} x ${lt} ${x2}`;
            }
          }
          calcState.screenView = "MAIN";
          calcState.expr = `${r.a}x²+(${r.b})x+(${r.c}) ${item.op} 0`;
          calcState.cursorPos = calcState.expr.length;
          calcState.lastEvalExpr = null;
          calcState.resultHtml = ans;
          calcState.justEvaluated = true;
          renderLCD();
        },
        () => openInequalityMenu()
      );
    }
  );
}

/* ==========================================================================
   GRID CELL EDITORS (MATRIX, VECTOR, STATISTICS, SPREADSHEET)
   ========================================================================== */
function promptCurrentMatrixCell() {
  const M = calcState.matrices[calcState.activeMatName];
  const r = calcState.gridRow, c = calcState.gridCol;
  startPromptSequence(
    `${calcState.activeMatName}[${r + 1},${c + 1}]`,
    [{ key: "val", label: `${calcState.activeMatName}[${r + 1},${c + 1}] =`, defaultVal: M[r][c] }],
    res => {
      M[r][c] = res.val;
      if (c + 1 < M[0].length) calcState.gridCol++;
      else if (r + 1 < M.length) { calcState.gridRow++; calcState.gridCol = 0; }
      calcState.screenView = "MATRIX_EDIT";
      renderLCD();
    },
    () => { calcState.screenView = "MATRIX_EDIT"; }
  );
}

function promptCurrentVectorCell() {
  const V = calcState.vectors[calcState.activeVctName];
  const c = calcState.gridCol;
  startPromptSequence(
    `${calcState.activeVctName}[${c + 1}]`,
    [{ key: "val", label: `${calcState.activeVctName}[${c + 1}] =`, defaultVal: V[c] }],
    res => {
      V[c] = res.val;
      if (c + 1 < V.length) calcState.gridCol++;
      calcState.screenView = "VECTOR_EDIT";
      renderLCD();
    },
    () => { calcState.screenView = "VECTOR_EDIT"; }
  );
}

function promptCurrentStatCell() {
  const r = calcState.gridRow;
  const colName = calcState.gridCol === 0 ? "x" : calcState.statType === "2-VAR" ? "y" : "freq";
  const curVal = calcState.statData[colName][r] ?? (colName === "freq" ? 1 : 0);
  startPromptSequence(
    `Stat ${colName}[${r + 1}]`,
    [{ key: "val", label: `${colName}[${r + 1}] =`, defaultVal: curVal }],
    res => {
      calcState.statData[colName][r] = res.val;
      if (calcState.statData.x[r] === undefined) calcState.statData.x[r] = 0;
      if (calcState.statData.freq[r] === undefined) calcState.statData.freq[r] = 1;
      if (calcState.statType === "2-VAR" && calcState.statData.y[r] === undefined) calcState.statData.y[r] = 0;
      calcState.gridRow = Math.min(19, r + 1);
      calcState.screenView = "STAT_EDIT";
      renderLCD();
    },
    () => { calcState.screenView = "STAT_EDIT"; }
  );
}

/* Hücre değeri (tam duyarlık). Düzeltmeler: formül artık BÜYÜK harfe çevrilmiyor
   (sin, √, π çalışır), hücre başvuruları parantezle sarılıyor (negatif değerler "10--5"
   sözdizimi hatası vermiyor), aralık fonksiyonları boş hücreleri saymıyor, döngüsel başvuru ERR. */
function evalSpreadsheetCell(r, c, visited = new Set()) {
  const key = `${r},${c}`;
  if (visited.has(key)) return "ERR";
  visited.add(key);
  const raw = String(calcState.sheetFormulas[r]?.[c] ?? "").trim();
  if (!raw) return "";
  if (!raw.startsWith("=")) {
    const n = Number(raw.replace(/−/g, "-"));
    if (!Number.isNaN(n)) return n;
    try {
      const v = evaluateMathExpression(raw, calcState);
      return Number.isFinite(v) ? v : raw;
    } catch (_) {
      return raw;
    }
  }
  let failed = false;
  const cellValue = (rr, cc) => evalSpreadsheetCell(rr, cc, new Set(visited));
  let f = raw.slice(1);
  f = f.replace(/(SUM|MEAN|MIN|MAX)\(([A-Ea-e])(\d+):([A-Ea-e])(\d+)\)?/gi, (_, fnName, c1, r1, c2, r2) => {
    const colA = c1.toUpperCase().charCodeAt(0) - 65, colB = c2.toUpperCase().charCodeAt(0) - 65;
    const rowA = parseInt(r1, 10) - 1, rowB = parseInt(r2, 10) - 1;
    const vals = [];
    for (let rr = Math.min(rowA, rowB); rr <= Math.max(rowA, rowB); rr++) {
      for (let cc = Math.min(colA, colB); cc <= Math.max(colA, colB); cc++) {
        const v = cellValue(rr, cc);
        if (v === "ERR") failed = true;
        else if (typeof v === "number" && Number.isFinite(v)) vals.push(v);
      }
    }
    const fn = fnName.toUpperCase();
    if (!vals.length) return fn === "SUM" ? "(0)" : (failed = true, "(0)");
    const out =
      fn === "SUM" ? vals.reduce((a, b) => a + b, 0)
      : fn === "MEAN" ? vals.reduce((a, b) => a + b, 0) / vals.length
      : fn === "MIN" ? Math.min(...vals)
      : Math.max(...vals);
    return `(${out})`;
  });
  f = f.replace(/(?<![A-Za-z_$])([A-E])([1-6])(?!\d)/g, (_, colCh, rowCh) => {
    const v = cellValue(parseInt(rowCh, 10) - 1, colCh.charCodeAt(0) - 65);
    if (v === "") return "(0)";
    if (typeof v !== "number" || !Number.isFinite(v)) {
      failed = true;
      return "(0)";
    }
    return `(${v})`;
  });
  if (failed) return "ERR";
  try {
    const v = evaluateMathExpression(f, calcState);
    return typeof v === "number" && Number.isFinite(v) ? v : "ERR";
  } catch (_) {
    return "ERR";
  }
}

function formatCellValue(v) {
  if (typeof v !== "number") return escapeHtml(v);
  return String(Number(v.toPrecision(7)));
}

function promptCurrentSheetCell() {
  const r = calcState.gridRow, c = calcState.gridCol;
  const cellName = `${String.fromCharCode(65 + c)}${r + 1}`;
  startPromptSequence(
    `Hücre ${cellName} (Örn: 25 veya =Sum(A1:A3))`,
    [{ key: "f", label: `${cellName} =`, defaultVal: calcState.sheetFormulas[r][c], rawText: true }],
    res => {
      calcState.sheetFormulas[r][c] = res.f;
      calcState.screenView = "SPREADSHEET";
      renderLCD();
    },
    () => { calcState.screenView = "SPREADSHEET"; }
  );
}

/* ==========================================================================
   BUTTON PRESS HANDLER (ALL 50 KEYS + SHIFT & ALPHA MODIFIERS)
   ========================================================================== */
function handleButtonAction(btnId) {
  playClickSound();

  // ON her zaman açar ve modun ana ekranına döner
  if (btnId === "ON") {
    calcState.powerOn = true;
    calcState.shift = false;
    calcState.alpha = false;
    calcState.stoMode = false;
    calcState.rclMode = false;
    calcState.promptQueue = [];
    calcState.collectedPrompts = {};
    calcState.screenView = homeView();
    calcState.expr = "";
    calcState.cursorPos = 0;
    calcState.resultHtml = "0";
    calcState.justEvaluated = false;
    renderLCD();
    return;
  }

  if (!calcState.powerOn) return;

  if (btnId === "SHIFT") {
    calcState.shift = !calcState.shift;
    if (calcState.shift) calcState.alpha = false;
    renderLCD();
    return;
  }
  if (btnId === "ALPHA") {
    calcState.alpha = !calcState.alpha;
    if (calcState.alpha) calcState.shift = false;
    renderLCD();
    return;
  }

  const isShift = calcState.shift;
  const isAlpha = calcState.alpha;
  calcState.shift = false;
  calcState.alpha = false;

  // STO / RCL hedef değişkenleri (A, B, C, D, E, F, x, y, M)
  const varMap = {
    NEG: "A",
    DMS: "B",
    INV: "C",
    SIN: "D",
    COS: "E",
    TAN: "F",
    RPAREN: "x",
    X_VAR: "x",
    SD: "y",
    MPLUS: "M"
  };

  if (calcState.stoMode && varMap[btnId]) {
    const vName = varMap[btnId];
    calcState.stoMode = false;
    if (calcState.expr.trim() && !calcState.justEvaluated) executeEquals();
    if (/ERROR/.test(calcState.resultHtml)) {
      renderLCD();
      return;
    }
    calcState.vars[vName] = calcState.lastNumericResult;
    calcState.expr = `Ans→${vName}`;
    calcState.cursorPos = calcState.expr.length;
    calcState.resultHtml = formatNumberDisplay(calcState.lastNumericResult, calcState.settings);
    calcState.justEvaluated = true;
    renderLCD();
    updateCompanionSidebar();
    return;
  }

  if (calcState.rclMode && varMap[btnId]) {
    const vName = varMap[btnId];
    calcState.rclMode = false;
    const vVal = calcState.vars[vName];
    calcState.screenView = "MAIN";
    calcState.expr = `${vName}=`;
    calcState.cursorPos = calcState.expr.length;
    calcState.lastEvalExpr = null;
    calcState.resultHtml = formatNumberDisplay(vVal, calcState.settings);
    calcState.lastNumericResult = vVal;
    calcState.justEvaluated = true;
    renderLCD();
    return;
  }
  calcState.stoMode = false;
  calcState.rclMode = false;

  // Değer girilirken (PROMPT) anlamı olmayan tuşlar girişi bozmasın
  if (calcState.screenView === "PROMPT") {
    if (!isAlpha && ["SD", "ENG", "MPLUS", "STO", "CALC"].includes(btnId)) { renderLCD(); return; }
    if (isShift && ["OPTN", "NUM8", "NUM9"].includes(btnId)) { renderLCD(); return; }
    if (isAlpha && btnId === "DEL") { renderLCD(); return; }
  }

  // ALPHA harfleri
  if (isAlpha) {
    if (varMap[btnId]) {
      insertAtCursor(varMap[btnId]);
      return;
    }
    if (btnId === "CALC") { insertAtCursor("="); return; }
    if (btnId === "INTEG") { insertAtCursor(":"); return; }
    if (btnId === "LN" || btnId === "EXP10") { insertAtCursor("𝒆"); return; }
    if (btnId === "ENG") { insertAtCursor("i"); return; }
    if (btnId === "MUL") { insertAtCursor("GCD(", 0); return; }
    if (btnId === "DIV") { insertAtCursor("LCM(", 0); return; }
    if (btnId === "DOT") { insertAtCursor("RanInt#(", 0); return; }
    if (btnId === "ANS") { insertAtCursor("PreAns"); return; }
    if (btnId === "DEL") {
      // UNDO: son ifadeyi geri getir
      if (calcState.history.length > 0) {
        calcState.screenView = "MAIN";
        calcState.expr = calcState.history[0].expr;
        calcState.cursorPos = calcState.expr.length;
        calcState.justEvaluated = false;
        renderLCD();
      }
      return;
    }
  }

  // MENU / SET UP
  if (btnId === "MENU") {
    if (isShift) {
      openSetupMenu();
    } else {
      calcState.screenView = calcState.screenView === "MENU" ? homeView() : "MENU";
      calcState.menuCursor = calcState.modeId - 1;
      renderLCD();
    }
    return;
  }

  // MENU ızgarasında doğrudan seçim (1..9, A, B, C)
  if (calcState.screenView === "MENU") {
    const numMap = {
      NUM1: 1, NUM2: 2, NUM3: 3, NUM4: 4, NUM5: 5,
      NUM6: 6, NUM7: 7, NUM8: 8, NUM9: 9,
      NEG: 10, DMS: 11, INV: 12
    };
    if (numMap[btnId]) {
      selectCalculatorMode(numMap[btnId]);
      return;
    }
  }

  // Liste menülerinde 1..9 ile doğrudan seçim
  if (LIST_VIEWS.includes(calcState.screenView) && !isShift && !isAlpha) {
    const listNumMap = {
      NUM1: 0, NUM2: 1, NUM3: 2, NUM4: 3, NUM5: 4,
      NUM6: 5, NUM7: 6, NUM8: 7, NUM9: 8
    };
    if (listNumMap[btnId] !== undefined && calcState.listItems[listNumMap[btnId]]) {
      calcState.listCursor = listNumMap[btnId];
      executeEquals();
      return;
    }
  }

  // Yön tuşları
  if (["UP", "DOWN", "LEFT", "RIGHT"].includes(btnId)) {
    handleDpadNavigation(btnId);
    return;
  }

  // OPTN / QR
  if (btnId === "OPTN") {
    if (isShift) {
      calcState.screenView = calcState.screenView === "QR" ? homeView() : "QR";
      renderLCD();
    } else {
      openOptnMenu();
    }
    return;
  }

  // CALC / SOLVE
  if (btnId === "CALC") {
    if (isShift) {
      const exprToSolve = calcState.expr.trim() || "x²−4=0";
      startPromptSequence(
        `SOLVE: ${exprToSolve}`,
        [{ key: "guess", label: "Başlangıç tahmini x =", defaultVal: calcState.vars.x || 1 }],
        res => {
          calcState.expr = exprToSolve;
          calcState.cursorPos = exprToSolve.length;
          calcState.lastEvalExpr = null;
          try {
            const sol = solveEquation(exprToSolve, calcState, res.guess);
            if (sol) {
              calcState.vars.x = sol.x;
              calcState.lastNumericResult = sol.x;
              calcState.resultHtml = `x = ${sol.x}  (L−R = ${sol.lr})`;
            } else {
              calcState.resultHtml = "Can't Solve";
            }
          } catch (err) {
            calcState.resultHtml = errorLabel(err);
          }
          calcState.justEvaluated = true;
          renderLCD();
          updateCompanionSidebar();
        },
        () => { calcState.screenView = "MAIN"; }
      );
    } else {
      // CALC: ifadedeki değişkenleri sırayla sor (eskiden "2x+1"deki x algılanmıyordu)
      const expr = calcState.expr.trim();
      if (!expr) return;
      const usedVars = ["x", "y", "A", "B", "C", "D", "E", "F", "M"].filter(v =>
        new RegExp(`(?<![A-Za-z])${v}(?![A-Za-z])`).test(expr)
      );
      if (usedVars.length === 0) {
        executeEquals();
        return;
      }
      startPromptSequence(
        `CALC: ${expr}`,
        usedVars.map(v => ({ key: v, label: `${v}? =`, defaultVal: calcState.vars[v] })),
        res => {
          Object.assign(calcState.vars, res);
          executeEquals();
        },
        () => { calcState.screenView = "MAIN"; }
      );
    }
    return;
  }

  // ∫dx / d/dx
  if (btnId === "INTEG") {
    if (isShift) insertAtCursor("d/dx(,)", -2);
    else insertAtCursor("∫(,,)", -3);
    return;
  }

  // x / ∑
  if (btnId === "X_VAR") {
    if (isShift) insertAtCursor("∑(,,)", -3);
    else insertAtCursor("x");
    return;
  }

  // Base-N: x²=DEC, x^=HEX, log=BIN, ln=OCT
  if (calcState.modeId === 3 && !isShift) {
    if (btnId === "SQ") { switchBaseN(10); return; }
    if (btnId === "POW") { switchBaseN(16); return; }
    if (btnId === "LOG") { switchBaseN(2); return; }
    if (btnId === "LN") { switchBaseN(8); return; }
  }

  // Base-N HEX rakamları A..F
  if (calcState.modeId === 3 && calcState.baseN === 16 && !isShift) {
    const hexMap = { NEG: "A", DMS: "B", INV: "C", SIN: "D", COS: "E", TAN: "F" };
    if (hexMap[btnId]) {
      insertAtCursor(hexMap[btnId]);
      return;
    }
  }

  if (btnId === "FRAC") {
    if (isShift) insertAtCursor("mfrac(,,)", -3);
    else insertAtCursor("frac(,)", -2);
    return;
  }
  if (btnId === "SQRT") {
    if (isShift) insertAtCursor("³√()", -1);
    else insertAtCursor("√()", -1);
    return;
  }
  if (btnId === "SQ") {
    if (isShift) insertAtCursor("³");
    else insertAtCursor("²");
    return;
  }
  if (btnId === "POW") {
    if (isShift) insertAtCursor("nthroot(,)", -2);
    else insertAtCursor("^()", -1);
    return;
  }
  if (btnId === "LOG") {
    if (isShift) insertAtCursor("10^()", -1);
    else insertAtCursor("log(,)", -2);
    return;
  }
  if (btnId === "LN") {
    if (isShift) insertAtCursor("𝒆^()", -1);
    else insertAtCursor("ln()", -1);
    return;
  }

  if (btnId === "NEG") {
    if (isShift) insertAtCursor("∠");
    else insertAtCursor("-");
    return;
  }
  if (btnId === "DMS") {
    if (isShift) {
      // FACT: sonucun asal çarpanları
      if (calcState.screenView !== "MAIN") return;
      if (!calcState.justEvaluated && calcState.expr.trim()) executeEquals();
      if (hasNumericResult()) {
        const factHtml = primeFactorize(calcState.lastNumericResult);
        if (factHtml) {
          calcState.resultHtml = factHtml;
          calcState.displayFormat = "FACT";
        }
      }
      renderLCD();
    } else if (calcState.screenView === "MAIN" && calcState.justEvaluated) {
      if (hasNumericResult()) {
        const dms = toDMSString(calcState.lastNumericResult);
        if (dms) {
          calcState.resultHtml = dms;
          calcState.displayFormat = "DMS";
        }
      }
      renderLCD();
    } else {
      insertAtCursor("°");
    }
    return;
  }
  if (btnId === "INV") {
    if (isShift) insertAtCursor("!");
    else insertAtCursor("⁻¹");
    return;
  }
  if (btnId === "SIN") {
    if (isShift) insertAtCursor("sin⁻¹()", -1);
    else insertAtCursor("sin()", -1);
    return;
  }
  if (btnId === "COS") {
    if (isShift) insertAtCursor("cos⁻¹()", -1);
    else insertAtCursor("cos()", -1);
    return;
  }
  if (btnId === "TAN") {
    if (isShift) insertAtCursor("tan⁻¹()", -1);
    else insertAtCursor("tan()", -1);
    return;
  }

  if (btnId === "STO") {
    if (isShift) {
      calcState.rclMode = true;
      calcState.stoMode = false;
    } else {
      calcState.stoMode = true;
      calcState.rclMode = false;
    }
    renderLCD();
    return;
  }
  if (btnId === "ENG") {
    // ENG: virgül 3 basamak sağa (üs −3), SHIFT+ENG (←): sola (üs +3) — gerçek cihazdaki yön
    if (calcState.screenView !== "MAIN") return;
    if (!calcState.justEvaluated && calcState.expr.trim()) executeEquals();
    if (!hasNumericResult()) {
      renderLCD();
      return;
    }
    const wasEng = calcState.displayFormat === "ENG";
    if (isShift) calcState.engShift = (wasEng ? calcState.engShift : 0) + 1;
    else calcState.engShift = wasEng ? calcState.engShift - 1 : 0;
    calcState.displayFormat = "ENG";
    calcState.resultHtml = formatEngineering(calcState.lastNumericResult, calcState.engShift, calcState.settings.engSymbol);
    renderLCD();
    return;
  }
  if (btnId === "LPAREN") {
    if (isShift) insertAtCursor("%");
    else insertAtCursor("(");
    return;
  }
  if (btnId === "RPAREN") {
    if (isShift) insertAtCursor(",");
    else insertAtCursor(")");
    return;
  }
  if (btnId === "SD") {
    // S⇔D: kesir/kök ⇔ ondalık
    if (calcState.screenView !== "MAIN") return;
    if (!calcState.justEvaluated && calcState.expr.trim()) {
      executeEquals();
      return;
    }
    if (!hasNumericResult()) return;
    if (calcState.modeId === 2 && calcState.lastComplexResult) {
      calcState.displayFormat = calcState.displayFormat === "POLAR" ? "SYMBOLIC" : "POLAR";
      calcState.resultHtml =
        calcState.displayFormat === "POLAR"
          ? calcState.lastComplexResult.toPolarString(calcState.settings.angleUnit)
          : calcState.lastComplexResult.toRectString();
      renderLCD();
      return;
    }
    const sym = toSymbolicForm(calcState.lastNumericResult);
    if (isShift && sym && sym.mixedHtml) {
      calcState.displayFormat = calcState.displayFormat === "MIXED" ? "SYMBOLIC" : "MIXED";
      calcState.resultHtml = calcState.displayFormat === "MIXED" ? sym.mixedHtml : sym.html;
    } else if (sym && calcState.displayFormat !== "SYMBOLIC") {
      calcState.displayFormat = "SYMBOLIC";
      calcState.resultHtml = sym.html;
    } else {
      calcState.displayFormat = "DECIMAL";
      calcState.resultHtml = formatNumberDisplay(calcState.lastNumericResult, calcState.settings);
    }
    renderLCD();
    return;
  }
  if (btnId === "MPLUS") {
    if (calcState.screenView !== "MAIN") return;
    if (!calcState.justEvaluated && calcState.expr.trim()) executeEquals();
    if (calcState.justEvaluated && !hasNumericResult()) return;
    if (isShift) {
      calcState.vars.M -= calcState.lastNumericResult;
      calcState.expr = "Ans→M-";
    } else {
      calcState.vars.M += calcState.lastNumericResult;
      calcState.expr = "Ans→M+";
    }
    calcState.cursorPos = calcState.expr.length;
    calcState.justEvaluated = true;
    renderLCD();
    updateCompanionSidebar();
    return;
  }

  // DEL: belirteç bazında siler (sin(, Ans, 𝒆 ... tek parça)
  if (btnId === "DEL") {
    if (calcState.screenView === "PROMPT") {
      calcState.promptFresh = false;
      const n = tokenLenBefore(calcState.promptInput, calcState.promptCursor);
      if (n) {
        calcState.promptInput =
          calcState.promptInput.slice(0, calcState.promptCursor - n) + calcState.promptInput.slice(calcState.promptCursor);
        calcState.promptCursor -= n;
      }
      calcState.promptError = "";
      renderLCD();
      return;
    }
    if (calcState.screenView !== "MAIN") return;
    if (calcState.justEvaluated) {
      // sonuçtan sonra DEL: aynı ifadeyi düzenlemeye dön (imleç sonda)
      if (calcState.lastEvalExpr && calcState.expr.trim() === calcState.lastEvalExpr) {
        calcState.justEvaluated = false;
        calcState.cursorPos = calcState.expr.length;
        renderLCD();
      }
      return;
    }
    const n = tokenLenBefore(calcState.expr, calcState.cursorPos);
    if (n) {
      calcState.expr = calcState.expr.slice(0, calcState.cursorPos - n) + calcState.expr.slice(calcState.cursorPos);
      calcState.cursorPos -= n;
      calcState.resultHtml = "";
      renderLCD();
    }
    return;
  }

  if (btnId === "AC") {
    if (isShift) {
      calcState.powerOn = false;
      renderLCD();
      return;
    }
    if (calcState.screenView === "PROMPT") {
      // girişi iptal et: geldiği ekrana dön (hücre editörü, menü vb.)
      const cancel = calcState.promptOnCancel;
      calcState.promptQueue = [];
      calcState.collectedPrompts = {};
      calcState.screenView = homeView();
      if (typeof cancel === "function") cancel();
      renderLCD();
      return;
    }
    if (LIST_VIEWS.includes(calcState.screenView) && calcState.listReturnView === "PROMPT") {
      calcState.screenView = "PROMPT";
      renderLCD();
      return;
    }
    if (calcState.screenView === "TABLE_RES") {
      startTableWizard();
      return;
    }
    // Matris/vektör/istatistik editöründen AC → hesap ekranı (alt bilgi "[AC] Hesap" diyordu ama çıkmıyordu)
    calcState.screenView = homeView();
    calcState.expr = "";
    calcState.cursorPos = 0;
    calcState.resultHtml = "0";
    calcState.justEvaluated = false;
    renderLCD();
    return;
  }

  // SHIFT 7: CONST
  if (isShift && btnId === "NUM7") {
    openListMenu(
      "CONST",
      "BİLİMSEL SABİTLER (CONST 01~40)",
      CASIO_CONSTANTS.map(c => ({
        label: `${c.id}: ${c.sym} (${c.name})`,
        val: c.val,
        sym: c.sym
      })),
      // Değer "(6.62607004×10^(-34))" biçiminde eklenir (eskiden "6.62607004e-34" eklenip Syntax ERROR veriyordu)
      item => insertFromList(`(${numberToInputString(item.val)})`)
    );
    return;
  }

  // SHIFT 8: CONV
  if (isShift && btnId === "NUM8") {
    openListMenu(
      "CONV",
      "BİRİM DÖNÜŞTÜRÜCÜ (CONV 01~40)",
      CASIO_CONVERSIONS.map(c => ({
        label: `${c.id}: ${c.label}`,
        conv: c
      })),
      item => {
        let inputVal;
        if (calcState.justEvaluated) inputVal = calcState.lastNumericResult;
        else if (calcState.expr.trim()) {
          try {
            inputVal = evaluateMathExpression(calcState.expr, calcState);
          } catch (_) {
            inputVal = NaN;
          }
        } else inputVal = calcState.ans;
        calcState.screenView = "MAIN";
        calcState.justEvaluated = true;
        calcState.lastEvalExpr = null;
        if (typeof inputVal !== "number" || !Number.isFinite(inputVal)) {
          calcState.resultHtml = "Syntax ERROR";
          renderLCD();
          return;
        }
        const outVal = item.conv.fn(inputVal);
        calcState.expr = `${numberToInputString(inputVal)} ${item.conv.label}`;
        calcState.cursorPos = calcState.expr.length;
        setAnswer(outVal);
        calcState.displayFormat = "DECIMAL";
        calcState.resultHtml = formatNumberDisplay(outVal, calcState.settings);
        pushHistory(calcState.expr, calcState.resultHtml);
        renderLCD();
      }
    );
    return;
  }

  // SHIFT 9: RESET
  if (isShift && btnId === "NUM9") {
    openListMenu(
      "RESET",
      "SIFIRLAMA (RESET)",
      [
        { label: "1: Ayarları Sıfırla (Setup Data)", action: "SETUP" },
        { label: "2: Hafızayı Temizle (Memory)", action: "MEM" },
        { label: "3: Tümünü Sıfırla (Initialize All)", action: "ALL" }
      ],
      item => {
        if (item.action === "SETUP" || item.action === "ALL") {
          calcState.settings = {
            ioMode: "MathI/MathO",
            angleUnit: "DEG",
            numFormat: "NORM",
            fixDigits: 4,
            sciDigits: 5,
            normMode: 1,
            engSymbol: false
          };
          calcState.modeId = 1;
          calcState.baseN = 10;
          syncAngleButtons();
        }
        if (item.action === "MEM" || item.action === "ALL") {
          calcState.vars = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, x: 0, y: 0, z: 0, M: 0 };
          calcState.ans = 0;
          calcState.preAns = 0;
          calcState.lastNumericResult = 0;
          calcState.lastComplexResult = null;
          calcState.lastBaseNVal = 0;
          calcState.history = [];
        }
        calcState.screenView = homeView();
        calcState.expr = "";
        calcState.cursorPos = 0;
        calcState.lastEvalExpr = null;
        calcState.resultHtml = "Initialized";
        calcState.justEvaluated = true;
        renderLCD();
        updateCompanionSidebar();
      }
    );
    return;
  }

  // SHIFT 4 (MATRIX/VECTOR), SHIFT 1 (STAT/DIST), SHIFT 2 (CMPLX), SHIFT 3 (BASE-N)
  // Eskiden SHIFT 4 / SHIFT 1 modu değiştirmeden menü açıyordu → "MatA" hesap modunda Syntax ERROR
  if (isShift && btnId === "NUM4") {
    if (calcState.modeId === 5) openVectorOptionMenu();
    else if (calcState.modeId === 4) openMatrixOptionMenu();
    else selectCalculatorMode(4);
    return;
  }
  if (isShift && btnId === "NUM1") {
    if (calcState.modeId === 7) openDistributionMenu();
    else if (calcState.modeId === 6) openStatisticsMenu();
    else selectCalculatorMode(6);
    return;
  }
  if (isShift && btnId === "NUM2") { selectCalculatorMode(2); return; }
  if (isShift && btnId === "NUM3") { selectCalculatorMode(3); return; }

  // Rakamlar
  const digitMap = {
    NUM0: "0", NUM1: "1", NUM2: "2", NUM3: "3", NUM4: "4",
    NUM5: "5", NUM6: "6", NUM7: "7", NUM8: "8", NUM9: "9"
  };
  if (digitMap[btnId]) {
    if (isShift && btnId === "NUM0") {
      insertAtCursor("Rnd()", -1);
      return;
    }
    // BIN modunda 2–9, OCT modunda 8–9 yazılamaz (gerçek cihazdaki gibi)
    if (calcState.modeId === 3 && calcState.screenView === "MAIN") {
      const d = Number(digitMap[btnId]);
      if ((calcState.baseN === 2 && d > 1) || (calcState.baseN === 8 && d > 7)) return;
    }
    insertAtCursor(digitMap[btnId]);
    return;
  }

  if (btnId === "MUL") {
    if (isShift) insertAtCursor("P");
    else insertAtCursor("×");
    return;
  }
  if (btnId === "DIV") {
    if (isShift) insertAtCursor("C");
    else insertAtCursor("÷");
    return;
  }
  if (btnId === "PLUS") {
    if (isShift) insertAtCursor("Pol(,)", -2);
    else insertAtCursor("+");
    return;
  }
  if (btnId === "MINUS") {
    if (isShift) insertAtCursor("Rec(,)", -2);
    else insertAtCursor("−");
    return;
  }
  if (btnId === "DOT") {
    if (isShift) insertAtCursor("Ran#");
    else insertAtCursor(".");
    return;
  }
  if (btnId === "EXP10") {
    if (isShift) insertAtCursor("π");
    else insertAtCursor("×10^()", -1);
    return;
  }
  if (btnId === "ANS") {
    if (isShift) {
      const order = ["DEG", "RAD", "GRA"];
      const next = order[(order.indexOf(calcState.settings.angleUnit) + 1) % 3];
      setAngleUnit(next);
    } else {
      insertAtCursor("Ans");
    }
    return;
  }
  if (btnId === "EQUALS") {
    executeEquals(isShift);
    return;
  }
}

/* ==========================================================================
   D-PAD NAVIGATION HANDLER (MENUS, GRIDS, HISTORY, 2D CURSOR)
   ========================================================================== */
function handleDpadNavigation(dir) {
  // Değer girişi: imleç girişin içinde hareket eder (eskiden ana ifadeyi/geçmişi değiştiriyordu)
  if (calcState.screenView === "PROMPT") {
    const s = calcState.promptInput;
    calcState.promptFresh = false;
    if (dir === "LEFT") calcState.promptCursor -= tokenLenBefore(s, calcState.promptCursor);
    else if (dir === "RIGHT") calcState.promptCursor += tokenLenAfter(s, calcState.promptCursor);
    else if (dir === "DOWN") {
      const k = s.indexOf(",", calcState.promptCursor);
      if (k !== -1) calcState.promptCursor = k + 1;
    } else if (dir === "UP" && calcState.promptCursor > 0) {
      const k = s.lastIndexOf(",", calcState.promptCursor - 1);
      if (k !== -1) calcState.promptCursor = k;
    }
    renderLCD();
    return;
  }

  if (calcState.screenView === "MENU") {
    const col = calcState.menuCursor % 4;
    const row = Math.floor(calcState.menuCursor / 4);
    if (dir === "RIGHT") calcState.menuCursor = (calcState.menuCursor + 1) % 12;
    else if (dir === "LEFT") calcState.menuCursor = (calcState.menuCursor + 11) % 12;
    else if (dir === "DOWN") calcState.menuCursor = ((row + 1) % 3) * 4 + col;
    else if (dir === "UP") calcState.menuCursor = ((row + 2) % 3) * 4 + col;
    renderLCD();
    return;
  }

  if (LIST_VIEWS.includes(calcState.screenView)) {
    const len = calcState.listItems.length;
    if (!len) return;
    if (dir === "DOWN") calcState.listCursor = (calcState.listCursor + 1) % len;
    else if (dir === "UP") calcState.listCursor = (calcState.listCursor + len - 1) % len;
    renderLCD();
    return;
  }

  if (calcState.screenView === "MATRIX_EDIT") {
    const M = calcState.matrices[calcState.activeMatName];
    if (dir === "RIGHT") calcState.gridCol = (calcState.gridCol + 1) % M[0].length;
    else if (dir === "LEFT") calcState.gridCol = (calcState.gridCol + M[0].length - 1) % M[0].length;
    else if (dir === "DOWN") calcState.gridRow = (calcState.gridRow + 1) % M.length;
    else if (dir === "UP") calcState.gridRow = (calcState.gridRow + M.length - 1) % M.length;
    renderLCD();
    return;
  }

  if (calcState.screenView === "VECTOR_EDIT") {
    const V = calcState.vectors[calcState.activeVctName];
    if (dir === "RIGHT" || dir === "DOWN") calcState.gridCol = (calcState.gridCol + 1) % V.length;
    else if (dir === "LEFT" || dir === "UP") calcState.gridCol = (calcState.gridCol + V.length - 1) % V.length;
    renderLCD();
    return;
  }

  if (calcState.screenView === "STAT_EDIT") {
    const maxCols = 2;
    if (dir === "RIGHT") calcState.gridCol = (calcState.gridCol + 1) % maxCols;
    else if (dir === "LEFT") calcState.gridCol = (calcState.gridCol + maxCols - 1) % maxCols;
    else if (dir === "DOWN") calcState.gridRow = Math.min(19, calcState.gridRow + 1);
    else if (dir === "UP") calcState.gridRow = Math.max(0, calcState.gridRow - 1);
    renderLCD();
    return;
  }

  if (calcState.screenView === "SPREADSHEET") {
    if (dir === "RIGHT") calcState.gridCol = (calcState.gridCol + 1) % 5;
    else if (dir === "LEFT") calcState.gridCol = (calcState.gridCol + 4) % 5;
    else if (dir === "DOWN") calcState.gridRow = (calcState.gridRow + 1) % 6;
    else if (dir === "UP") calcState.gridRow = (calcState.gridRow + 5) % 6;
    renderLCD();
    return;
  }

  if (calcState.screenView === "TABLE_RES") {
    if (dir === "DOWN") calcState.gridRow = Math.min(Math.max(0, calcState.tableRows.length - 1), calcState.gridRow + 1);
    else if (dir === "UP") calcState.gridRow = Math.max(0, calcState.gridRow - 1);
    renderLCD();
    return;
  }

  if (calcState.screenView !== "MAIN") return;

  // Ana ekran: ◀ ▶ imleç (belirteç bazında), ▲ ▼ şablon kutuları arası / geçmiş
  if (dir === "LEFT") {
    if (calcState.justEvaluated) {
      calcState.justEvaluated = false;
      calcState.cursorPos = calcState.expr.length;
    } else {
      calcState.cursorPos = Math.max(0, calcState.cursorPos - tokenLenBefore(calcState.expr, calcState.cursorPos));
    }
    renderLCD();
  } else if (dir === "RIGHT") {
    if (calcState.justEvaluated) {
      calcState.justEvaluated = false;
      calcState.cursorPos = 0;
    } else {
      calcState.cursorPos = Math.min(calcState.expr.length, calcState.cursorPos + tokenLenAfter(calcState.expr, calcState.cursorPos));
    }
    renderLCD();
  } else if (dir === "UP" || dir === "DOWN") {
    const nextComma = calcState.expr.indexOf(",", calcState.cursorPos);
    const prevComma = calcState.cursorPos > 0 ? calcState.expr.lastIndexOf(",", calcState.cursorPos - 1) : -1;
    if (!calcState.justEvaluated && dir === "DOWN" && nextComma !== -1) {
      calcState.cursorPos = nextComma + 1;
      renderLCD();
      return;
    }
    if (!calcState.justEvaluated && dir === "UP" && prevComma !== -1) {
      calcState.cursorPos = prevComma;
      renderLCD();
      return;
    }
    if (calcState.history.length > 0) {
      if (dir === "UP") {
        calcState.historyIdx = Math.min(calcState.history.length - 1, calcState.historyIdx + 1);
      } else {
        calcState.historyIdx = Math.max(0, calcState.historyIdx - 1);
      }
      const item = calcState.history[calcState.historyIdx];
      if (item) {
        calcState.expr = item.expr;
        calcState.cursorPos = item.expr.length;
        calcState.resultHtml = item.res;
        calcState.justEvaluated = true;
        renderLCD();
      }
    }
  }
}

function getBaseName(b) {
  return b === 10 ? "DEC" : b === 16 ? "HEX" : b === 2 ? "BIN" : "OCT";
}

function switchBaseN(newBase) {
  calcState.baseN = newBase;
  if (calcState.justEvaluated) {
    calcState.resultHtml = formatBaseN(calcState.lastBaseNVal, newBase);
  }
  renderLCD();
}

function pushHistory(expr, res) {
  const top = calcState.history[0];
  if (!(top && top.expr === expr && top.res === res)) {
    calcState.history.unshift({ expr, res });
    if (calcState.history.length > 30) calcState.history.pop();
  }
  calcState.historyIdx = -1;
  updateCompanionSidebar(); // eskiden yalnızca hesap modunda güncelleniyordu
}

/* ==========================================================================
   LCD SCREEN RENDERER
   ========================================================================== */
function renderLCD() {
  const screenEl = document.getElementById("lcd-screen");
  const bodyEl = document.getElementById("lcd-body");
  if (!screenEl || !bodyEl) return;

  const setInd = (id, active) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("on", Boolean(active && calcState.powerOn));
  };

  screenEl.classList.toggle("off-state", !calcState.powerOn);

  setInd("ind-shift", calcState.shift);
  setInd("ind-alpha", calcState.alpha);
  setInd("ind-m", Math.abs(calcState.vars.M) > 1e-14);
  setInd("ind-sto", calcState.stoMode);
  setInd("ind-rcl", calcState.rclMode);
  setInd("ind-cmplx", calcState.modeId === 2);
  setInd("ind-mat", calcState.modeId === 4);
  setInd("ind-vct", calcState.modeId === 5);
  setInd("ind-stat", calcState.modeId === 6);
  setInd("ind-deg", calcState.settings.angleUnit === "DEG");
  setInd("ind-rad", calcState.settings.angleUnit === "RAD");
  setInd("ind-gra", calcState.settings.angleUnit === "GRA");
  setInd("ind-fix", calcState.settings.numFormat === "FIX");
  setInd("ind-sci", calcState.settings.numFormat === "SCI");
  setInd("ind-math", calcState.settings.ioMode === "MathI/MathO");
  setInd("ind-hist", calcState.history.length > 0);
  setInd("ind-solar", true);

  if (!calcState.powerOn) {
    bodyEl.innerHTML = `<div style="display:flex;height:100%;align-items:center;justify-content:center;font-family:'Arial Black',sans-serif;font-size:18px;letter-spacing:0.15em;opacity:0.25;">CASIO</div>`;
    return;
  }

  // 1. MENU (ikonlar)
  if (calcState.screenView === "MENU") {
    const curMode = CLASSWIZ_MODES[calcState.menuCursor] || CLASSWIZ_MODES[0];
    bodyEl.innerHTML = `
      <div class="lcd-menu-grid">
        ${CLASSWIZ_MODES.map((m, idx) => `
          <div class="lcd-menu-item ${idx === calcState.menuCursor ? "selected" : ""}" onclick="selectCalculatorMode(${m.id})">
            <span class="lcd-menu-key">${m.key}</span>
            <span class="lcd-menu-icon">${m.icon.split("\n")[0]}</span>
          </div>
        `).join("")}
      </div>
      <div class="lcd-menu-footer">
        <span>${curMode.trName}</span>
        <span>[=] Seç</span>
      </div>
    `;
    return;
  }

  // 2. LİSTE MENÜLERİ
  if (LIST_VIEWS.includes(calcState.screenView)) {
    const items = calcState.listItems;
    const startIdx = Math.max(0, Math.min(calcState.listCursor - 1, Math.max(0, items.length - 4)));
    const visible = items.slice(startIdx, startIdx + 4);
    bodyEl.innerHTML = `
      <div class="lcd-menu-footer" style="margin-bottom:2px;">
        <span>${escapeHtml(calcState.listTitle)}</span>
        <span>${calcState.listCursor + 1}/${items.length}</span>
      </div>
      <div class="lcd-list-menu">
        ${visible.map((it, i) => {
          const realIdx = startIdx + i;
          return `
            <div class="lcd-list-row ${realIdx === calcState.listCursor ? "selected" : ""}"
                 onclick="calcState.listCursor=${realIdx}; executeEquals();">
              <span>${escapeHtml(it.label)}</span>
            </div>
          `;
        }).join("")}
      </div>
    `;
    return;
  }

  // 3. DEĞER GİRİŞİ (CALC, SOLVE, tablo, dağılım, denklem, hücreler) — 2B gösterim + imleç
  if (calcState.screenView === "PROMPT") {
    const currentPrompt = calcState.promptQueue[0] || { label: "Değer?" };
    const inp = calcState.promptInput;
    const withCursor = inp.slice(0, calcState.promptCursor) + "\u0001" + inp.slice(calcState.promptCursor);
    bodyEl.innerHTML = `
      <div class="lcd-menu-footer">
        <span>${escapeHtml(calcState.promptTitle)}</span>
        <span>[=] Onayla</span>
      </div>
      <div class="lcd-prompt">
        <div class="lcd-prompt-label">${escapeHtml(currentPrompt.label)}${calcState.promptError ? `<span class="lcd-prompt-error">${calcState.promptError}</span>` : ""}</div>
        <div class="lcd-prompt-input">${renderNaturalMathHTML(withCursor)}</div>
      </div>
    `;
    return;
  }

  // 4. MATRİS EDİTÖRÜ
  if (calcState.screenView === "MATRIX_EDIT") {
    const M = calcState.matrices[calcState.activeMatName];
    bodyEl.innerHTML = `
      <div class="lcd-menu-footer">
        <span>${calcState.activeMatName} (${M.length}×${M[0].length}) — [=] Düzenle | [AC] Hesap</span>
        <span>OPTN</span>
      </div>
      <div class="lcd-grid-editor">
        <table class="lcd-grid-table">
          <tbody>
            ${M.map((row, r) => `
              <tr>
                ${row.map((val, c) => `
                  <td class="${r === calcState.gridRow && c === calcState.gridCol ? "active-cell" : ""}"
                      onclick="calcState.gridRow=${r};calcState.gridCol=${c};promptCurrentMatrixCell();">
                    ${Number(Number(val).toPrecision(5))}
                  </td>
                `).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
    return;
  }

  // 5. VEKTÖR EDİTÖRÜ
  if (calcState.screenView === "VECTOR_EDIT") {
    const V = calcState.vectors[calcState.activeVctName];
    bodyEl.innerHTML = `
      <div class="lcd-menu-footer">
        <span>${calcState.activeVctName} (1×${V.length}) — [=] Düzenle | [AC] Hesap</span>
        <span>OPTN</span>
      </div>
      <div class="lcd-grid-editor" style="justify-content:center;">
        <table class="lcd-grid-table">
          <tbody>
            <tr>
              ${V.map((val, c) => `
                <td class="${c === calcState.gridCol ? "active-cell" : ""}"
                    onclick="calcState.gridCol=${c};promptCurrentVectorCell();">
                  ${Number(Number(val).toPrecision(6))}
                </td>
              `).join("")}
            </tr>
          </tbody>
        </table>
      </div>
    `;
    return;
  }

  // 6. İSTATİSTİK VERİ EDİTÖRÜ
  if (calcState.screenView === "STAT_EDIT") {
    const is2Var = calcState.statType === "2-VAR";
    const startR = Math.max(0, calcState.gridRow - 2);
    const rows = [0, 1, 2].map(k => startR + k);
    bodyEl.innerHTML = `
      <div class="lcd-menu-footer">
        <span>STAT (${calcState.statType}) — [OPTN] Sonuç Hesapla</span>
        <span>Satır ${calcState.gridRow + 1}</span>
      </div>
      <div class="lcd-grid-editor">
        <table class="lcd-grid-table">
          <thead>
            <tr><th>#</th><th>x</th><th>${is2Var ? "y" : "Freq"}</th></tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr>
                <th>${r + 1}</th>
                <td class="${r === calcState.gridRow && calcState.gridCol === 0 ? "active-cell" : ""}"
                    onclick="calcState.gridRow=${r};calcState.gridCol=0;promptCurrentStatCell();">
                  ${calcState.statData.x[r] ?? ""}
                </td>
                <td class="${r === calcState.gridRow && calcState.gridCol === 1 ? "active-cell" : ""}"
                    onclick="calcState.gridRow=${r};calcState.gridCol=1;promptCurrentStatCell();">
                  ${is2Var ? (calcState.statData.y[r] ?? "") : (calcState.statData.freq[r] ?? "")}
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
    return;
  }

  // 7. HESAP TABLOSU
  if (calcState.screenView === "SPREADSHEET") {
    const startR = Math.max(0, calcState.gridRow - 2);
    const rows = [0, 1, 2].map(k => startR + k);
    const cellFormula = calcState.sheetFormulas[calcState.gridRow][calcState.gridCol] || "";
    bodyEl.innerHTML = `
      <div class="lcd-menu-footer">
        <span>${String.fromCharCode(65 + calcState.gridCol)}${calcState.gridRow + 1}: ${escapeHtml(cellFormula || "(boş)")}</span>
        <span>[=] Düzenle</span>
      </div>
      <div class="lcd-grid-editor">
        <table class="lcd-grid-table">
          <thead>
            <tr><th>#</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr>
                <th>${r + 1}</th>
                ${[0, 1, 2, 3, 4].map(c => `
                  <td class="${r === calcState.gridRow && c === calcState.gridCol ? "active-cell" : ""}"
                      onclick="calcState.gridRow=${r};calcState.gridCol=${c};promptCurrentSheetCell();">
                    ${formatCellValue(evalSpreadsheetCell(r, c))}
                  </td>
                `).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
    return;
  }

  // 8. FONKSİYON TABLOSU SONUCU
  if (calcState.screenView === "TABLE_RES") {
    const startR = Math.max(0, Math.min(calcState.gridRow - 1, Math.max(0, calcState.tableRows.length - 3)));
    const visible = calcState.tableRows.slice(startR, startR + 3);
    const hasG = calcState.tableRows.some(r => r.gx !== null);
    bodyEl.innerHTML = `
      <div class="lcd-menu-footer">
        <span>f(x)=${renderNaturalMathHTML(calcState.tableConfig.f)}</span>
        <span>▲▼ Kaydır</span>
      </div>
      <div class="lcd-grid-editor">
        <table class="lcd-grid-table">
          <thead>
            <tr><th>#</th><th>x</th><th>f(x)</th>${hasG ? "<th>g(x)</th>" : ""}</tr>
          </thead>
          <tbody>
            ${visible.length ? visible.map((row, idx) => {
              const realIdx = startR + idx;
              return `
                <tr class="${realIdx === calcState.gridRow ? "selected" : ""}">
                  <th>${realIdx + 1}</th>
                  <td class="${realIdx === calcState.gridRow ? "active-cell" : ""}">${row.x}</td>
                  <td>${row.fx}</td>
                  ${hasG ? `<td>${row.gx}</td>` : ""}
                </tr>
              `;
            }).join("") : `<tr><td colspan="4" style="text-align:center;">Satır yok (Başlangıç &gt; Bitiş)</td></tr>`}
          </tbody>
        </table>
      </div>
    `;
    return;
  }

  // 9. QR (SHIFT + OPTN)
  if (calcState.screenView === "QR") {
    const qrPayload = `CASIO fx-991EX | Mode:${calcState.modeId} | Expr:${calcState.expr || "0"} | Ans:${calcState.lastNumericResult}`;
    bodyEl.innerHTML = `
      <div class="lcd-qr-view">
        <canvas id="qr-canvas" class="lcd-qr-canvas" width="66" height="66"></canvas>
        <div style="font-size:10px;line-height:1.25;font-family:Arial,sans-serif;">
          <div style="font-weight:800;">CLASSWIZ QR (temsilî)</div>
          <div>İfade: <b>${renderNaturalMathHTML(calcState.expr || "0")}</b></div>
          <div>Sonuç: <b>${Number(Number(calcState.lastNumericResult).toPrecision(10))}</b></div>
          <div style="margin-top:3px;opacity:0.75;">[AC] veya [SHIFT][OPTN] ile çık</div>
        </div>
      </div>
    `;
    drawSimulatedQR("qr-canvas", qrPayload);
    return;
  }

  // 10. ANA HESAP EKRANI
  const exprWithCursor = calcState.justEvaluated
    ? calcState.expr
    : calcState.expr.slice(0, calcState.cursorPos) + "\u0001" + calcState.expr.slice(calcState.cursorPos);

  const exprHtml = renderNaturalMathHTML(exprWithCursor);
  const modeHint =
    calcState.modeId === 3
      ? `[${getBaseName(calcState.baseN)}]`
      : calcState.modeId === 2
      ? "[CMPLX]"
      : calcState.modeId === 4
      ? "[MAT]"
      : calcState.modeId === 5
      ? "[VCT]"
      : calcState.modeId === 12
      ? "[VERIFY]"
      : "";
  // Uzun sonuçlar (32 bit BIN, eşitsizlik aralıkları) ekrana sığsın diye küçük yazı
  const plainLen = calcState.resultHtml.replace(/<[^>]*>/g, "").length;
  const resultClass = plainLen > 17 ? "lcd-result lcd-result-small" : "lcd-result";

  bodyEl.innerHTML = `
    <div class="lcd-expr-container">${exprHtml}</div>
    <div class="lcd-result-row">
      <span class="lcd-mode-hint">${modeHint}</span>
      <div class="${resultClass}">${calcState.resultHtml}</div>
    </div>
  `;
  // Uzun ifadelerde imleci görünür tut (yalnızca LCD içinde kaydırır, sayfayı değil)
  const exprBox = bodyEl.querySelector(".lcd-expr-container");
  const cursorEl = exprBox && exprBox.querySelector(".lcd-cursor");
  if (cursorEl) {
    const box = exprBox.getBoundingClientRect();
    const cur = cursorEl.getBoundingClientRect();
    if (cur.right > box.right) exprBox.scrollLeft += cur.right - box.right + 6;
    else if (cur.left < box.left) exprBox.scrollLeft -= box.left - cur.left + 6;
  }
}

function drawSimulatedQR(canvasId, text) {
  const c = document.getElementById(canvasId);
  if (!c) return;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, 66, 66);
  ctx.fillStyle = "#000";
  const N = 21;
  const cell = 3;
  // Finder patterns
  const drawFinder = (ox, oy) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const border = x === 0 || x === 6 || y === 0 || y === 6;
        const inner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        if (border || inner) ctx.fillRect((ox + x) * cell + 1, (oy + y) * cell + 1, cell, cell);
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(N - 7, 0);
  drawFinder(0, N - 7);
  // Deterministic hash modules from payload
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if ((x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8)) continue;
      h ^= (x * 37 + y * 101);
      h = Math.imul(h, 16777619);
      if ((h >>> 0) % 2 === 0) {
        ctx.fillRect(x * cell + 1, y * cell + 1, cell, cell);
      }
    }
  }
}

/* ==========================================================================
   COMPANION SIDEBAR UPDATER (HISTORY TAPE & LIVE VARIABLE INSPECTOR)
   ========================================================================== */
function updateCompanionSidebar() {
  const histEl = document.getElementById("history-list");
  if (histEl) {
    if (calcState.history.length === 0) {
      histEl.innerHTML = `<div style="font-size:12px;color:#64748b;text-align:center;padding:14px 0;">Henüz işlem yapılmadı.</div>`;
    } else {
      histEl.innerHTML = calcState.history
        .map(
          (item, idx) => `
          <div class="history-item" onclick="loadHistoryEntry(${idx})">
            <div class="history-expr">${renderNaturalMathHTML(item.expr)}</div>
            <div class="history-res">= ${item.res}</div>
          </div>
        `
        )
        .join("");
    }
  }

  const varsEl = document.getElementById("vars-grid");
  if (varsEl) {
    const keys = ["A", "B", "C", "D", "E", "F", "x", "y", "M"];
    varsEl.innerHTML = keys
      .map(k => {
        const v = Number(calcState.vars[k]);
        return `
        <div class="var-chip">
          <span class="var-name">${k}:</span>
          <span class="var-val">${Number.isFinite(v) ? Number(v.toPrecision(6)) : "?"}</span>
        </div>
      `;
      })
      .join("");
  }
}

function loadHistoryEntry(idx) {
  const item = calcState.history[idx];
  if (!item) return;
  calcState.screenView = "MAIN";
  calcState.expr = item.expr;
  calcState.cursorPos = item.expr.length;
  calcState.justEvaluated = false;
  calcState.resultHtml = "";
  renderLCD();
}

/* ==========================================================================
   PC KEYBOARD BINDINGS FOR FAST TYPING
   ========================================================================== */
function setupKeyboardShortcuts() {
  window.addEventListener("keydown", e => {
    if (e.metaKey || e.ctrlKey) return;
    const k = e.key;
    const map = {
      "0": "NUM0", "1": "NUM1", "2": "NUM2", "3": "NUM3", "4": "NUM4",
      "5": "NUM5", "6": "NUM6", "7": "NUM7", "8": "NUM8", "9": "NUM9",
      "+": "PLUS", "-": "MINUS", "*": "MUL", "/": "DIV", ".": "DOT", ",": "RPAREN",
      "(": "LPAREN", ")": "RPAREN", "^": "POW",
      "Enter": "EQUALS", "=": "EQUALS",
      "Backspace": "DEL", "Delete": "DEL",
      "Escape": "AC",
      "ArrowUp": "UP", "ArrowDown": "DOWN", "ArrowLeft": "LEFT", "ArrowRight": "RIGHT",
      "Tab": "SD",
      "x": "X_VAR", "X": "X_VAR",
      "s": "SHIFT", "S": "SHIFT",
      "a": "ALPHA", "A": "ALPHA",
      "m": "MENU", "M": "MENU",
      "o": "OPTN", "O": "OPTN"
    };
    if (k === ",") {
      e.preventDefault();
      insertAtCursor(",");
      return;
    }
    if (map[k]) {
      e.preventDefault();
      const btnEl = document.querySelector(`[data-key="${map[k]}"]`);
      if (btnEl) {
        btnEl.classList.add("key-pressed");
        setTimeout(() => btnEl.classList.remove("key-pressed"), 110);
      }
      handleButtonAction(map[k]);
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  // Bind all calculator buttons with data-key
  document.querySelectorAll("[data-key]").forEach(btn => {
    btn.addEventListener("click", () => {
      handleButtonAction(btn.getAttribute("data-key"));
      btn.blur(); // odakta kalırsa Boşluk tuşu son basılan tuşu tekrarlıyordu
    });
  });

  setupKeyboardShortcuts();
  renderLCD();
  updateCompanionSidebar();
});
