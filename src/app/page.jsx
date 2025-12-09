"use client";

import React, { useState, useEffect, useRef } from "react";
import Button from "../components/Button";

export default function AccessibleCalculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [theme, setTheme] = useState(1);
  const [announceText, setAnnounceText] = useState("");
  const displayRef = useRef(null);

  // Theme configurations
  const themes = {
    1: {
      name: "Dark Blue",
      mainBg: "bg-[#3a4764]",
      keypadBg: "bg-[#232c43]",
      screenBg: "bg-[#182034]",
      numberKey:
        "bg-[#eae3dc] hover:bg-white text-[#444b5a] shadow-[0_4px_0_#b4a597]",
      delResetKey:
        "bg-[#637097] hover:bg-[#a2b2e1] text-white shadow-[0_4px_0_#404e72]",
      equalsKey:
        "bg-[#d03f2f] hover:bg-[#f96b5b] text-white shadow-[0_4px_0_#93261a]",
      text: "text-white",
      toggleBg: "bg-[#232c43]",
      toggleThumb: "bg-[#d03f2f]",
    },
    2: {
      name: "Light",
      mainBg: "bg-[#e6e6e6]",
      keypadBg: "bg-[#d1cccc]",
      screenBg: "bg-[#ededed]",
      numberKey:
        "bg-[#e5e4e1] hover:bg-white text-[#35352c] shadow-[0_4px_0_#a79e91]",
      delResetKey:
        "bg-[#377f86] hover:bg-[#62b5bc] text-white shadow-[0_4px_0_#1b5f65]",
      equalsKey:
        "bg-[#ca5502] hover:bg-[#ff8a38] text-white shadow-[0_4px_0_#893901]",
      text: "text-[#35352c]",
      toggleBg: "bg-[#d1cccc]",
      toggleThumb: "bg-[#ca5502]",
    },
    3: {
      name: "Purple",
      mainBg: "bg-[#160628]",
      keypadBg: "bg-[#1d0934]",
      screenBg: "bg-[#1d0934]",
      numberKey:
        "bg-[#341c4f] hover:bg-[#6b34ac] text-[#ffe53d] shadow-[0_4px_0_#871c9c]",
      delResetKey:
        "bg-[#58077d] hover:bg-[#8631af] text-white shadow-[0_4px_0_#bc15f4]",
      equalsKey:
        "bg-[#00e0d1] hover:bg-[#93fff8] text-[#1b2428] shadow-[0_4px_0_#6cf9f2]",
      text: "text-[#ffe53d]",
      toggleBg: "bg-[#1d0934]",
      toggleThumb: "bg-[#00e0d1]",
    },
  };

  const currentTheme = themes[theme];

  // Announce for screen readers
  const announce = (message) => {
    setAnnounceText(message);
    setTimeout(() => setAnnounceText(""), 100);
  };

  // Handle number input
  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
      announce(`${digit}`);
    } else {
      const newDisplay = display === "0" ? String(digit) : display + digit;
      setDisplay(newDisplay);
      announce(`${digit}. Current value: ${newDisplay}`);
    }
  };

  // Handle decimal point
  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      announce("0 point");
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
      announce("point");
    }
  };

  // Handle operations
  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);
    const operationNames = {
      "+": "plus",
      "-": "minus",
      "×": "times",
      "÷": "divided by",
    };

    if (previousValue === null) {
      setPreviousValue(inputValue);
      announce(`${inputValue} ${operationNames[nextOperation]}`);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(newValue);
      announce(`Result: ${newValue}. ${operationNames[nextOperation]}`);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  // Calculate result
  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  // Handle equals
  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      announce(`Result: ${newValue}`);
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  // Clear all
  const clearAll = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    announce("Calculator reset. Display shows 0");
  };

  // Delete last digit
  const deleteDigit = () => {
    const newDisplay = display.slice(0, -1);
    const finalDisplay = newDisplay === "" ? "0" : newDisplay;
    setDisplay(finalDisplay);
    announce(`Deleted. Display shows ${finalDisplay}`);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key >= "0" && e.key <= "9") {
        inputDigit(parseInt(e.key));
      } else if (e.key === ".") {
        inputDot();
      } else if (e.key === "+" || e.key === "-") {
        performOperation(e.key);
      } else if (e.key === "*") {
        performOperation("×");
      } else if (e.key === "/") {
        e.preventDefault();
        performOperation("÷");
      } else if (e.key === "Enter" || e.key === "=") {
        handleEquals();
      } else if (e.key === "Escape") {
        clearAll();
      } else if (e.key === "Backspace") {
        deleteDigit();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [display, previousValue, operation, waitingForOperand]);

  return (
    <>
      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announceText}
      </div>

      <main
        id="calculator-main"
        className={`min-h-screen ${currentTheme.mainBg} ${currentTheme.text} flex items-center justify-center p-4`}
        role="main"
      >
        <div className="w-full max-w-lg">
          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">calc</h1>

            {/* Theme Switcher */}
            <div
              className="flex items-center gap-6"
              role="group"
              aria-label="Theme selector"
            >
              <span className="text-base uppercase tracking-wider">Theme</span>
              <div className="flex flex-col">
                <div className="flex justify-between text-sm mb-1 px-1">
                  <span
                    className={theme === 1 ? "font-bold" : ""}
                    aria-hidden="true"
                  >
                    1
                  </span>
                  <span
                    className={theme === 2 ? "font-bold" : ""}
                    aria-hidden="true"
                  >
                    2
                  </span>
                  <span
                    className={theme === 3 ? "font-bold" : ""}
                    aria-hidden="true"
                  >
                    3
                  </span>
                </div>
                <div
                  className={`${currentTheme.toggleBg} rounded-full p-1 w-16 flex justify-between`}
                >
                  <button
                    onClick={() => {
                      setTheme(1);
                      announce("Theme changed to Dark Blue");
                    }}
                    className={`w-4 h-4 rounded-full transition-all ${
                      theme === 1 ? currentTheme.toggleThumb : "bg-transparent"
                    } cursor-pointer focus:outline-none focus:ring-2 focus:ring-white`}
                    aria-label="Switch to Dark Blue theme"
                    aria-pressed={theme === 1}
                  />
                  <button
                    onClick={() => {
                      setTheme(2);
                      announce("Theme changed to Light");
                    }}
                    className={`w-4 h-4 rounded-full transition-all ${
                      theme === 2 ? currentTheme.toggleThumb : "bg-transparent"
                    } cursor-pointer focus:outline-none focus:ring-2 focus:ring-white`}
                    aria-label="Switch to Light theme"
                    aria-pressed={theme === 2}
                  />
                  <button
                    onClick={() => {
                      setTheme(3);
                      announce("Theme changed to Purple");
                    }}
                    className={`w-4 h-4 rounded-full transition-all ${
                      theme === 3 ? currentTheme.toggleThumb : "bg-transparent"
                    } cursor-pointer focus:outline-none focus:ring-2 focus:ring-white`}
                    aria-label="Switch to Purple theme"
                    aria-pressed={theme === 3}
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Display */}
          <div
            className={`${currentTheme.screenBg} rounded-lg p-6 mb-6 text-right`}
            role="region"
            aria-label="Calculator display"
          >
            <div
              ref={displayRef}
              className="text-5xl font-bold break-all"
              aria-live="polite"
              aria-atomic="true"
            >
              {display}
            </div>
          </div>

          {/* Keypad */}
          <div
            className={`${currentTheme.keypadBg} rounded-lg p-6`}
            role="grid"
            aria-label="Calculator keypad"
          >
            <div className="grid grid-cols-4 gap-4">
              <Button
                onClick={() => inputDigit(7)}
                ariaLabel="7"
                theme={currentTheme}
              >
                7
              </Button>
              <Button
                onClick={() => inputDigit(8)}
                ariaLabel="8"
                theme={currentTheme}
              >
                8
              </Button>
              <Button
                onClick={() => inputDigit(9)}
                ariaLabel="9"
                theme={currentTheme}
              >
                9
              </Button>
              <Button
                onClick={deleteDigit}
                type="special"
                className="text-xl"
                ariaLabel="Delete last digit"
                theme={currentTheme}
              >
                DEL
              </Button>

              <Button
                onClick={() => inputDigit(4)}
                ariaLabel="4"
                theme={currentTheme}
              >
                4
              </Button>
              <Button
                onClick={() => inputDigit(5)}
                ariaLabel="5"
                theme={currentTheme}
              >
                5
              </Button>
              <Button
                onClick={() => inputDigit(6)}
                ariaLabel="6"
                theme={currentTheme}
              >
                6
              </Button>
              <Button
                onClick={() => performOperation("+")}
                ariaLabel="Plus"
                theme={currentTheme}
              >
                +
              </Button>

              <Button
                onClick={() => inputDigit(1)}
                ariaLabel="1"
                theme={currentTheme}
              >
                1
              </Button>
              <Button
                onClick={() => inputDigit(2)}
                ariaLabel="2"
                theme={currentTheme}
              >
                2
              </Button>
              <Button
                onClick={() => inputDigit(3)}
                ariaLabel="3"
                theme={currentTheme}
              >
                3
              </Button>
              <Button
                onClick={() => performOperation("-")}
                ariaLabel="Minus"
                theme={currentTheme}
              >
                -
              </Button>

              <Button
                onClick={inputDot}
                ariaLabel="Decimal point"
                theme={currentTheme}
              >
                .
              </Button>
              <Button
                onClick={() => inputDigit(0)}
                ariaLabel="0"
                theme={currentTheme}
              >
                0
              </Button>
              <Button
                onClick={() => performOperation("÷")}
                ariaLabel="Divide"
                theme={currentTheme}
              >
                ÷
              </Button>
              <Button
                onClick={() => performOperation("×")}
                ariaLabel="Multiply"
                theme={currentTheme}
              >
                ×
              </Button>

              <Button
                onClick={clearAll}
                type="special"
                className="col-span-2 text-xl"
                ariaLabel="Reset calculator"
                theme={currentTheme}
              >
                RESET
              </Button>
              <Button
                onClick={handleEquals}
                type="equals"
                className="col-span-2"
                ariaLabel="Calculate result"
                theme={currentTheme}
              >
                =
              </Button>
            </div>
          </div>

          {/* Keyboard shortcuts info */}
          <details className="mt-6 text-sm opacity-70">
            <summary className="cursor-pointer hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1">
              Keyboard Shortcuts
            </summary>
            <ul className="mt-2 space-y-1 pl-4">
              <li>
                <kbd className="px-2 py-1 bg-gray-700 rounded">0-9</kbd> Numbers
              </li>
              <li>
                <kbd className="px-2 py-1 bg-gray-700 rounded">+ - * /</kbd>{" "}
                Operations
              </li>
              <li>
                <kbd className="px-2 py-1 bg-gray-700 rounded">Enter</kbd> or{" "}
                <kbd className="px-2 py-1 bg-gray-700 rounded">=</kbd> Calculate
              </li>
              <li>
                <kbd className="px-2 py-1 bg-gray-700 rounded">Backspace</kbd>{" "}
                Delete
              </li>
              <li>
                <kbd className="px-2 py-1 bg-gray-700 rounded">Escape</kbd>{" "}
                Reset
              </li>
            </ul>
          </details>
        </div>
      </main>
    </>
  );
}
