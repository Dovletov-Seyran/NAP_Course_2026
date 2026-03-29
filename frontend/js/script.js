window.onload = function () {
  let displayValue = "0";
  let freshInput = true;
  let justEvaluated = false;
  let lastOp = null;
  let lastOperand = null;
  let expressionChain = "";

  let tokens = [];

  const resultEl = document.getElementById("result");
  const expressionEl = document.getElementById("expression");
  const historyListEl = document.getElementById("history-list");

  const SYM = { "+": "+", "-": "−", x: "×", "/": "÷" };

  function setMode(mode) {
    if (mode === "input") {
      expressionEl.classList.add("expression--big");
      expressionEl.classList.remove("expression--small");
      resultEl.classList.add("result--hidden");
    } else {
      expressionEl.classList.remove("expression--big");
      expressionEl.classList.add("expression--small");
      resultEl.classList.remove("result--hidden");
    }
  }

  function showExpression(text) {
    expressionEl.textContent = text;
    expressionEl.scrollLeft = expressionEl.scrollWidth;
  }

  function showResult(val) {
    displayValue = String(val);
    if (val === "Ошибка") {
      resultEl.textContent = "Ошибка";
      return;
    }
    let f = (+parseFloat(val).toPrecision(12)).toString();
    if (f.length > 14) f = parseFloat(val).toExponential(6);
    resultEl.textContent = f;
  }

  function fmtNum(n) {
    return (+parseFloat(n).toPrecision(12)).toString();
  }

  function addHistory(entry) {
    const li = document.createElement("li");
    li.textContent = entry;
    historyListEl.insertBefore(li, historyListEl.firstChild);
    while (historyListEl.children.length > 30)
      historyListEl.removeChild(historyListEl.lastChild);
  }

  function priority(op) {
    return op === "x" || op === "/" ? 2 : 1;
  }

  function evalTokens(toks) {
    if (toks.length === 0) return "Ошибка";
    let nums = [];
    let ops = [];
    for (let i = 0; i < toks.length; i++) {
      if (toks[i].type === "num") {
        nums.push(toks[i].val);
      } else {
        const op = toks[i].val;
        while (ops.length && priority(ops[ops.length - 1]) >= priority(op)) {
          const b = nums.pop();
          const a = nums.pop();
          const o = ops.pop();
          const r = applyOne(o, a, b);
          if (r === "Ошибка") return "Ошибка";
          nums.push(r);
        }
        ops.push(op);
      }
    }
    while (ops.length) {
      const b = nums.pop();
      const a = nums.pop();
      const o = ops.pop();
      const r = applyOne(o, a, b);
      if (r === "Ошибка") return "Ошибка";
      nums.push(r);
    }
    return nums[0];
  }

  function applyOne(op, a, b) {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "x":
        return a * b;
      case "/":
        return b === 0 ? "Ошибка" : a / b;
    }
  }

  function buildExprStr(toks, currentInput) {
    let s = "";
    for (const t of toks) {
      if (t.type === "num") s += fmtNum(t.val);
      else s += SYM[t.val];
    }
    if (currentInput !== undefined) s += currentInput;
    return s || "0";
  }

  function inputDigit(d) {
    if (justEvaluated && tokens.length === 0) {
      tokens = [];
      expressionChain = "";
      justEvaluated = false;
      freshInput = true;
    }

    if (freshInput) {
      displayValue = d === "." ? "0." : d;
      freshInput = false;
    } else {
      if (d === "." && displayValue.includes(".")) return;
      if (displayValue === "0" && d !== ".") displayValue = d;
      else {
        if (displayValue.replace(/[-.]/g, "").length >= 12) return;
        displayValue += d;
      }
    }

    showExpression(buildExprStr(tokens, displayValue));
    setMode("input");
  }

  function inputOp(op) {
    if (
      freshInput &&
      tokens.length > 0 &&
      tokens[tokens.length - 1].type === "op"
    ) {
      tokens[tokens.length - 1].val = op;
      showExpression(buildExprStr(tokens));
      setMode("input");
      return;
    }

    const current = parseFloat(displayValue);
    tokens.push({ type: "num", val: current });
    tokens.push({ type: "op", val: op });

    showExpression(buildExprStr(tokens));
    setMode("input");
    freshInput = true;
    justEvaluated = false;
    lastOp = null;
  }

  function inputEqual() {
    if (justEvaluated) {
      const current = parseFloat(displayValue);
      const result = applyOne(lastOp, current, lastOperand);
      const exprStr = fmtNum(current) + SYM[lastOp] + fmtNum(lastOperand);
      addHistory(
        exprStr + " = " + (result === "Ошибка" ? "Ошибка" : fmtNum(result)),
      );
      showExpression(exprStr);
      setMode("result");
      if (result === "Ошибка") {
        showResult("Ошибка");
        tokens = [];
        freshInput = true;
        justEvaluated = false;
        return;
      }
      showResult(fmtNum(result));
      tokens = [];
      freshInput = true;
      return;
    }

    if (tokens.length === 0) return;
    const lastTok = tokens[tokens.length - 1];
    if (lastTok.type !== "op") return;

    const b = parseFloat(displayValue);
    lastOp = lastTok.val;
    lastOperand = b;

    const allTokens = [...tokens, { type: "num", val: b }];
    const exprStr = buildExprStr(allTokens);
    const result = evalTokens(allTokens);

    addHistory(
      exprStr + " = " + (result === "Ошибка" ? "Ошибка" : fmtNum(result)),
    );
    showExpression(exprStr);
    setMode("result");
    tokens = [];

    if (result === "Ошибка") {
      showResult("Ошибка");
      freshInput = true;
      justEvaluated = false;
      return;
    }

    showResult(fmtNum(result));
    freshInput = true;
    justEvaluated = true;
  }

  function inputPercent() {
    let val = parseFloat(displayValue);
    const prevNum = tokens.length >= 2 ? tokens[tokens.length - 2].val : null;
    val = prevNum !== null ? (prevNum * val) / 100 : val / 100;
    displayValue = fmtNum(val);
    showExpression(buildExprStr(tokens, displayValue));
    setMode("input");
    freshInput = false;
  }

  function inputSign() {
    if (displayValue === "0" || displayValue === "Ошибка") return;
    displayValue = displayValue.startsWith("-")
      ? displayValue.slice(1)
      : "-" + displayValue;
    showExpression(buildExprStr(tokens, displayValue));
  }

  function inputClear() {
    displayValue = "0";
    tokens = [];
    freshInput = true;
    lastOp = null;
    lastOperand = null;
    justEvaluated = false;
    expressionChain = "";
    showExpression("0");
    setMode("input");
    showResult("0");
  }

  showExpression("0");
  setMode("input");

  document.querySelectorAll('[id^="btn_digit_"]').forEach((btn) => {
    btn.onclick = () => inputDigit(btn.dataset.val || btn.textContent.trim());
  });

  document.getElementById("btn_op_plus").onclick = () => inputOp("+");
  document.getElementById("btn_op_minus").onclick = () => inputOp("-");
  document.getElementById("btn_op_mult").onclick = () => inputOp("x");
  document.getElementById("btn_op_div").onclick = () => inputOp("/");
  document.getElementById("btn_op_equal").onclick = () => inputEqual();
  document.getElementById("btn_op_percent").onclick = () => inputPercent();
  document.getElementById("btn_op_sign").onclick = () => inputSign();
  document.getElementById("btn_op_clear").onclick = () => inputClear();

  document.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") inputDigit(e.key);
    else if (e.key === ".") inputDigit(".");
    else if (e.key === "+") inputOp("+");
    else if (e.key === "-") inputOp("-");
    else if (e.key === "*") inputOp("x");
    else if (e.key === "/") {
      e.preventDefault();
      inputOp("/");
    } else if (e.key === "Enter" || e.key === "=") inputEqual();
    else if (e.key === "Escape") inputClear();
    else if (e.key === "Backspace") {
      if (!freshInput && displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1) || "0";
        showExpression(buildExprStr(tokens, displayValue));
      } else {
        displayValue = "0";
        showExpression(buildExprStr(tokens, "0"));
        freshInput = true;
      }
    }
  });
};
