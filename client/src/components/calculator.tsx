import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function CalculatorComponent() {
  const [display, setDisplay] = useState("0");
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const appendToDisplay = (value: string) => {
    if (shouldResetDisplay) {
      setDisplay("");
      setShouldResetDisplay(false);
    }

    if (display === "0" && value !== ".") {
      setDisplay(value);
    } else {
      setDisplay((prev) => prev + value);
    }
  };

  const clearCalculator = () => {
    setDisplay("0");
    setShouldResetDisplay(false);
  };

  const deleteLastChar = () => {
    if (display.length > 1) {
      setDisplay((prev) => prev.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const calculateResult = () => {
    try {
      let expression = display
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-");

      if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
        throw new Error("Invalid expression");
      }

      const result = Function('"use strict"; return (' + expression + ")")();
      setDisplay(result.toString());
      setShouldResetDisplay(true);
    } catch (error) {
      setDisplay("エラー");
      setShouldResetDisplay(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if ("0123456789".includes(key) || "+-*/.".includes(key)) {
        appendToDisplay(key === "*" ? "×" : key === "/" ? "÷" : key === "-" ? "−" : key);
      } else if (key === "Enter" || key === "=") {
        calculateResult();
      } else if (key === "Escape" || key === "c" || key === "C") {
        clearCalculator();
      } else if (key === "Backspace") {
        deleteLastChar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [display, shouldResetDisplay]);

  const buttons = [
    [
      { label: "C", onClick: clearCalculator, className: "bg-red-500 hover:bg-red-600 text-white" },
      { label: "⌫", onClick: deleteLastChar, className: "bg-gray-500 hover:bg-gray-600 text-white" },
      { label: "÷", onClick: () => appendToDisplay("÷"), className: "bg-gray-500 hover:bg-gray-600 text-white" },
      { label: "×", onClick: () => appendToDisplay("×"), className: "bg-gray-500 hover:bg-gray-600 text-white" },
    ],
    [
      { label: "7", onClick: () => appendToDisplay("7"), className: "bg-gray-200 hover:bg-gray-300 text-gray-800" },
      { label: "8", onClick: () => appendToDisplay("8"), className: "bg-gray-200 hover:bg-gray-300 text-gray-800" },
      { label: "9", onClick: () => appendToDisplay("9"), className: "bg-gray-200 hover:bg-gray-300 text-gray-800" },
      { label: "−", onClick: () => appendToDisplay("−"), className: "bg-gray-500 hover:bg-gray-600 text-white" },
    ],
    [
      { label: "4", onClick: () => appendToDisplay("4"), className: "bg-gray-200 hover:bg-gray-300 text-gray-800" },
      { label: "5", onClick: () => appendToDisplay("5"), className: "bg-gray-200 hover:bg-gray-300 text-gray-800" },
      { label: "6", onClick: () => appendToDisplay("6"), className: "bg-gray-200 hover:bg-gray-300 text-gray-800" },
      { label: "+", onClick: () => appendToDisplay("+"), className: "bg-gray-500 hover:bg-gray-600 text-white" },
    ],
    [
      { label: "1", onClick: () => appendToDisplay("1"), className: "bg-gray-200 hover:bg-gray-300 text-gray-800" },
      { label: "2", onClick: () => appendToDisplay("2"), className: "bg-gray-200 hover:bg-gray-300 text-gray-800" },
      { label: "3", onClick: () => appendToDisplay("3"), className: "bg-gray-200 hover:bg-gray-300 text-gray-800" },
      { label: "=", onClick: calculateResult, className: "bg-blue-600 hover:bg-blue-700 text-white row-span-2", rowSpan: 2 },
    ],
    [
      { label: "0", onClick: () => appendToDisplay("0"), className: "bg-gray-200 hover:bg-gray-300 text-gray-800 col-span-2", colSpan: 2 },
      { label: ".", onClick: () => appendToDisplay("."), className: "bg-gray-200 hover:bg-gray-300 text-gray-800" },
    ],
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">電卓</h2>
        <p className="text-gray-600">基本的な数学演算を実行</p>
      </div>

      <div className="max-w-md mx-auto">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="mb-4">
              <Input
                value={display}
                readOnly
                className="text-right text-3xl font-mono bg-gray-100 border-2 border-gray-200 h-16"
              />
            </div>

            <div className="grid grid-cols-4 gap-3">
              {buttons.map((row, rowIndex) =>
                row.map((button, colIndex) => (
                  <Button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={button.onClick}
                    className={`calc-btn p-4 font-semibold text-lg ${button.className} ${
                      button.colSpan ? `col-span-${button.colSpan}` : ""
                    } ${button.rowSpan ? `row-span-${button.rowSpan}` : ""}`}
                  >
                    {button.label}
                  </Button>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
