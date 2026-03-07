window.onload = function () {
  let displayValue = "0";
  let accumulator = null;
  let pendingOp = null;
  let freshInput = true;
  let lastOp = null;
  let lastOperand = null;
  let justEvaluated = false;
  let expressionChain = "";

  const resultEl      = document.getElementById("result");
  const expressionEl  = document.getElementById("expression");
  const historyListEl = document.getElementById("history-list");

  const SYM = { "+": "+", "-": "−", "x": "×", "/": "÷" };

  // Режим: "input" — большая строка выражения, нет результата
  //         "result" — маленькое выражение сверху, большой результат снизу
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
    if (val === "Ошибка") { resultEl.textContent = "Ошибка"; return; }
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

  function applyOp(op, a, b) {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "x": return a * b;
      case "/": return b === 0 ? "Ошибка" : a / b;
    }
  }

  function inputDigit(d) {
    // После = начать новое выражение
    if (justEvaluated && !pendingOp) {
      accumulator = null;
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

    // В режиме набора показываем выражение+текущее число большим шрифтом
    const current = expressionChain + displayValue;
    showExpression(current);
    setMode("input");
  }

  function inputOp(op) {
    // Заменить оператор если нажали дважды подряд
    if (freshInput && pendingOp !== null) {
      pendingOp = op;
      expressionChain = expressionChain.replace(/[+−×÷]\s*$/, SYM[op]);
      showExpression(expressionChain);
      setMode("input");
      return;
    }

    const current = parseFloat(displayValue);

    if (pendingOp !== null && !freshInput) {
      const result = applyOp(pendingOp, accumulator, current);
      if (result === "Ошибка") {
        showExpression("Ошибка"); setMode("input");
        expressionChain = ""; accumulator = null; pendingOp = null; freshInput = true;
        return;
      }
      expressionChain += fmtNum(current) + SYM[op];
      accumulator = result;
    } else {
      accumulator = current;
      expressionChain = fmtNum(current) + SYM[op];
    }

    showExpression(expressionChain);
    setMode("input");
    pendingOp = op;
    freshInput = true;
    justEvaluated = false;
    lastOp = null;
  }

  function inputEqual() {
    let a, b, op;

    if (justEvaluated) {
      a = parseFloat(displayValue);
      b = lastOperand;
      op = lastOp;
    } else {
      if (pendingOp === null) return;
      a = accumulator;
      b = parseFloat(displayValue);
      op = pendingOp;
      lastOp = op;
      lastOperand = b;
    }

    const result = applyOp(op, a, b);
    const fullExpr = expressionChain + fmtNum(b);
    addHistory(fullExpr + " = " + (result === "Ошибка" ? "Ошибка" : fmtNum(result)));

    // После = : маленькое выражение сверху, большой результат снизу
    showExpression(fullExpr);
    setMode("result");
    expressionChain = "";

    if (result === "Ошибка") {
      showResult("Ошибка");
      accumulator = null; pendingOp = null; freshInput = true; justEvaluated = false;
      return;
    }

    showResult(fmtNum(result));
    accumulator = result;
    pendingOp = null;
    freshInput = true;
    justEvaluated = true;
  }

  function inputPercent() {
    let val = parseFloat(displayValue);
    val = (accumulator !== null && pendingOp) ? (accumulator * val) / 100 : val / 100;
    displayValue = fmtNum(val);
    const current = expressionChain + displayValue;
    showExpression(current);
    setMode("input");
    freshInput = false;
  }

  function inputSign() {
    if (displayValue === "0" || displayValue === "Ошибка") return;
    displayValue = displayValue.startsWith("-") ? displayValue.slice(1) : "-" + displayValue;
    const current = expressionChain + displayValue;
    showExpression(current);
  }

  function inputClear() {
    displayValue = "0"; accumulator = null; pendingOp = null;
    freshInput = true; lastOp = null; lastOperand = null;
    justEvaluated = false; expressionChain = "";
    showExpression("0");
    setMode("input");
    showResult("0");
  }

  // Инициализация
  showExpression("0");
  setMode("input");

  document.querySelectorAll('[id^="btn_digit_"]').forEach(btn => {
    btn.onclick = () => inputDigit(btn.dataset.val || btn.textContent.trim());
  });

  document.getElementById("btn_op_plus").onclick    = () => inputOp("+");
  document.getElementById("btn_op_minus").onclick   = () => inputOp("-");
  document.getElementById("btn_op_mult").onclick    = () => inputOp("x");
  document.getElementById("btn_op_div").onclick     = () => inputOp("/");
  document.getElementById("btn_op_equal").onclick   = () => inputEqual();
  document.getElementById("btn_op_percent").onclick = () => inputPercent();
  document.getElementById("btn_op_sign").onclick    = () => inputSign();
  document.getElementById("btn_op_clear").onclick   = () => inputClear();

  document.addEventListener("keydown", e => {
    if (e.key >= "0" && e.key <= "9") inputDigit(e.key);
    else if (e.key === ".")           inputDigit(".");
    else if (e.key === "+")           inputOp("+");
    else if (e.key === "-")           inputOp("-");
    else if (e.key === "*")           inputOp("x");
    else if (e.key === "/")           { e.preventDefault(); inputOp("/"); }
    else if (e.key === "Enter" || e.key === "=") inputEqual();
    else if (e.key === "Escape")      inputClear();
    else if (e.key === "Backspace") {
      if (!freshInput && displayValue.length > 1) {
        displayValue = displayValue.slice(0, -1) || "0";
        showExpression(expressionChain + displayValue);
      } else {
        displayValue = "0";
        showExpression(expressionChain + "0");
        freshInput = true;
      }
    }
  });
};
