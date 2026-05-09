# ЛР №1-2 — Вёрстка сайта + JavaScript калькулятор

> **Тема:** cloud_hosting.ru  
> [← Вернуться к оглавлению](https://github.com/Dovletov-Seyran/NAP_Course_2026)

---

## Содержание

- [Цель](#цель)
- [Что реализовано](#что-реализовано)
- [Структура проекта](#структура-проекта)
- [Калькулятор — логика](#калькулятор--логика)
  - [Парсинг выражений](#парсинг-выражений)
  - [Приоритет операторов](#приоритет-операторов)
  - [Повторное нажатие «=»](#повторное-нажатие-)
  - [Обработка клавиатуры](#обработка-клавиатуры)
- [Вёрстка сайта](#вёрстка-сайта)
- [Запуск](#запуск)

---

## Цель

Создание многостраничного сайта и JavaScript-калькулятора с поддержкой выражений.

## Что реализовано

- Многостраничный сайт: главная, калькулятор, о компании
- Калькулятор: ввод цифр, операторы (+, −, ×, ÷), процент, смена знака
- Приоритет операций (умножение/деление раньше сложения/вычитания)
- История вычислений (последние 30 записей)
- Ввод с клавиатуры
- Адаптивная вёрстка

## Структура проекта

```
├── project/
│   ├── index.html           // Главная страница
│   ├── calculator.html      // Калькулятор
│   └── about.html           // О компании
├── js/
│   └── script.js            // Логика калькулятора
└── css/
    └── style.css            // Стили
```

## Калькулятор — логика

### Парсинг выражений

Калькулятор работает с массивом токенов — чисел и операторов. При нажатии цифры обновляется текущее число, при нажатии оператора — число и оператор добавляются в массив:

```js
function inputOp(op) {
  const current = parseFloat(displayValue);
  tokens.push({ type: "num", val: current });
  tokens.push({ type: "op", val: op });
  freshInput = true;
}
```

### Приоритет операторов

Вычисление учитывает приоритет: `×` и `÷` выполняются раньше `+` и `−`. Реализовано через стековый алгоритм (аналог Shunting-yard):

```js
function priority(op) {
  return op === "x" || op === "/" ? 2 : 1;
}

function evalTokens(toks) {
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
        nums.push(applyOne(ops.pop(), a, b));
      }
      ops.push(op);
    }
  }
  while (ops.length) {
    const b = nums.pop();
    const a = nums.pop();
    nums.push(applyOne(ops.pop(), a, b));
  }
  return nums[0];
}
```

### Повторное нажатие «=»

При повторном нажатии `=` повторяется последняя операция с последним операндом (как в стандартном калькуляторе):

```js
function inputEqual() {
  if (justEvaluated) {
    const current = parseFloat(displayValue);
    const result = applyOne(lastOp, current, lastOperand);
    // 5 + 3 = 8, затем = → 8 + 3 = 11, = → 11 + 3 = 14
    showResult(fmtNum(result));
    return;
  }
  // ... обычное вычисление
}
```

### Обработка клавиатуры

```js
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") inputDigit(e.key);
  else if (e.key === ".") inputDigit(".");
  else if (e.key === "+") inputOp("+");
  else if (e.key === "-") inputOp("-");
  else if (e.key === "*") inputOp("x");
  else if (e.key === "/") { e.preventDefault(); inputOp("/"); }
  else if (e.key === "Enter" || e.key === "=") inputEqual();
  else if (e.key === "Escape") inputClear();
  else if (e.key === "Backspace") { /* удаление последнего символа */ }
});
```

## Вёрстка сайта

- CSS Custom Properties для цветовой схемы (`--green`, `--bg`, `--text`)
- Flexbox/Grid для раскладки
- Адаптивность через медиа-запросы
- Тёмная тема калькулятора с градиентными кнопками

## Запуск

Открыть `project/index.html` через Live Server или любой локальный сервер.
