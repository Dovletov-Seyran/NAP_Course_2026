window.onload = function () {
  let a = "";
  let b = "";
  let expressionResult = "";
  let selectedOperation = null;

  const outputElement = document.getElementById("result");

  const digitButtons = document.querySelectorAll('[id^="btn_digit_"]');

  function onDigitButtonClicked(digit) {
    if (!selectedOperation) {
      if (digit != "." || (digit == "." && !a.includes(digit))) {
        a += digit;
      }
      outputElement.innerHTML = a;
    } else {
      if (digit != "." || (digit == "." && !b.includes(digit))) {
        b += digit;
        outputElement.innerHTML = b;
      }
    }
  }

  function formatResult(num) {
    return (+num.toFixed(12)).toString();
  }

  digitButtons.forEach((button) => {
    button.onclick = function () {
      const digitValue = button.innerHTML;
      onDigitButtonClicked(digitValue);
    };
  });
  document.getElementById("btn_op_mult").onclick = function () {
    if (a === "") return;
    selectedOperation = "x";
  };
  document.getElementById("btn_op_plus").onclick = function () {
    if (a === "") return;
    selectedOperation = "+";
  };
  document.getElementById("btn_op_minus").onclick = function () {
    if (a === "") return;
    selectedOperation = "-";
  };
  document.getElementById("btn_op_div").onclick = function () {
    if (a === "") return;
    selectedOperation = "/";
  };
  document.getElementById("btn_op_clear").onclick = function () {
    a = "";
    b = "";
    selectedOperation = null;
    expressionResult = "";
    outputElement.innerHTML = 0;
  };
  document.getElementById("btn_op_equal").onclick = function () {
    if (a === "" || b === "" || !selectedOperation) return;
    switch (selectedOperation) {
      case "x":
        expressionResult = +a * +b;
        break;
      case "+":
        expressionResult = +a + +b;
        break;
      case "-":
        expressionResult = +a - +b;
        break;
      case "/":
        expressionResult = +a / +b;
        break;
      default:
        break;
    }
    a = formatResult(expressionResult);
    b = "";
    selectedOperation = null;

    outputElement.innerHTML = a;
  };
};
