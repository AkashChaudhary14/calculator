const historyEl = document.getElementById("history");
const resultEl = document.getElementById("result");
const keys = document.querySelector(".calculator__keys");

const state = {
  current: "0",
  previous: null,
  operator: null,
  overwrite: false,
};

function updateDisplay() {
  resultEl.textContent = state.current;
  if (state.previous !== null && state.operator) {
    historyEl.textContent = `${state.previous} ${state.operator}`;
  } else {
    historyEl.textContent = "";
  }
}

function inputDigit(value) {
  if (state.overwrite) {
    state.current = value;
    state.overwrite = false;
    return;
  }
  if (state.current === "0") {
    state.current = value;
    return;
  }
  state.current += value;
}

function inputDecimal() {
  if (state.overwrite) {
    state.current = "0.";
    state.overwrite = false;
    return;
  }
  if (!state.current.includes(".")) {
    state.current += ".";
  }
}

function clearAll() {
  state.current = "0";
  state.previous = null;
  state.operator = null;
  state.overwrite = false;
}

function deleteLast() {
  if (state.overwrite) {
    state.current = "0";
    state.overwrite = false;
    return;
  }
  if (state.current.length <= 1) {
    state.current = "0";
    return;
  }
  state.current = state.current.slice(0, -1);
}

function applyPercent() {
  const value = Number(state.current);
  state.current = String(value / 100);
}

function operate(a, b, operator) {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b === 0) {
        return null;
      }
      return a / b;
    default:
      return b;
  }
}

function setOperator(nextOperator) {
  if (state.operator && !state.overwrite) {
    calculate();
  }
  state.previous = state.current;
  state.operator = nextOperator;
  state.overwrite = true;
}

function calculate() {
  if (state.previous === null || !state.operator) {
    return;
  }
  const a = Number(state.previous);
  const b = Number(state.current);
  const result = operate(a, b, state.operator);
  if (result === null) {
    state.current = "Error";
    state.previous = null;
    state.operator = null;
    state.overwrite = true;
    return;
  }
  state.current = Number(result.toFixed(10)).toString();
  state.previous = null;
  state.operator = null;
  state.overwrite = true;
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const action = button.dataset.action;
  const value = button.dataset.value;

  switch (action) {
    case "digit":
      inputDigit(value);
      break;
    case "decimal":
      inputDecimal();
      break;
    case "clear":
      clearAll();
      break;
    case "delete":
      deleteLast();
      break;
    case "percent":
      applyPercent();
      break;
    case "operator":
      setOperator(value);
      break;
    case "equals":
      calculate();
      break;
    default:
      break;
  }
  updateDisplay();
});

window.addEventListener("keydown", (event) => {
  const { key } = event;
  if (/^[0-9]$/.test(key)) inputDigit(key);
  else if (key === ".") inputDecimal();
  else if (key === "Backspace") deleteLast();
  else if (key === "Escape") clearAll();
  else if (["+", "-", "*", "/"].includes(key)) setOperator(key);
  else if (key === "Enter" || key === "=") calculate();
  else return;

  updateDisplay();
});

updateDisplay();
