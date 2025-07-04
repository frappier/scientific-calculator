import React, { useState } from 'react';
import './App.css';

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [isRadians, setIsRadians] = useState(true);
  const [isSecondFunction, setIsSecondFunction] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const inputDegree = () => {
    if (display !== '0' && !display.includes('DEG') && !display.includes('RAD')) {
      setDisplay(display + ' DEG');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setIsSecondFunction(false);
  };

  const allClear = () => {
    clear();
    setMemory(0);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const parseDisplayValue = (displayStr: string): number => {
    if (displayStr.includes('DEG')) {
      return parseFloat(displayStr.replace(' DEG', ''));
    } else if (displayStr.includes('RAD')) {
      return parseFloat(displayStr.replace(' RAD', ''));
    }
    return parseFloat(displayStr);
  };

  const isDisplayInDegrees = (displayStr: string): boolean => {
    return displayStr.includes('DEG');
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseDisplayValue(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '^':
        return Math.pow(firstValue, secondValue);
      case 'mod':
        return firstValue % secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performScientificOperation = (func: string) => {
    const value = parseDisplayValue(display);
    const inputInDegrees = isDisplayInDegrees(display);
    let result: number;

    switch (func) {
      case 'sin':
        result = Math.sin(inputInDegrees || !isRadians ? (value * Math.PI) / 180 : value);
        break;
      case 'cos':
        result = Math.cos(inputInDegrees || !isRadians ? (value * Math.PI) / 180 : value);
        break;
      case 'tan':
        result = Math.tan(inputInDegrees || !isRadians ? (value * Math.PI) / 180 : value);
        break;
      case 'asin':
        result = Math.asin(value);
        if (inputInDegrees || !isRadians) result = (result * 180) / Math.PI;
        break;
      case 'acos':
        result = Math.acos(value);
        if (inputInDegrees || !isRadians) result = (result * 180) / Math.PI;
        break;
      case 'atan':
        result = Math.atan(value);
        if (inputInDegrees || !isRadians) result = (result * 180) / Math.PI;
        break;
      case 'log':
        result = Math.log10(value);
        break;
      case 'ln':
        result = Math.log(value);
        break;
      case 'sqrt':
        result = Math.sqrt(value);
        break;
      case 'cbrt':
        result = Math.cbrt(value);
        break;
      case 'square':
        result = value * value;
        break;
      case 'cube':
        result = value * value * value;
        break;
      case 'factorial':
        result = factorial(value);
        break;
      case 'reciprocal':
        result = 1 / value;
        break;
      case 'exp':
        result = Math.exp(value);
        break;
      case 'abs':
        result = Math.abs(value);
        break;
      case 'negate':
        result = -value;
        break;
      default:
        result = value;
    }

    setDisplay(String(result));
    setWaitingForOperand(true);
    setIsSecondFunction(false);
  };

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const insertConstant = (constant: string) => {
    let value: number;
    switch (constant) {
      case 'pi':
        value = Math.PI;
        break;
      case 'e':
        value = Math.E;
        break;
      default:
        return;
    }
    setDisplay(String(value));
    setWaitingForOperand(true);
  };

  const percentage = () => {
    const value = parseDisplayValue(display);
    setDisplay(String(value / 100));
  };

  const memoryStore = () => {
    setMemory(parseDisplayValue(display));
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForOperand(true);
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const memoryAdd = () => {
    setMemory(memory + parseDisplayValue(display));
  };

  const memorySubtract = () => {
    setMemory(memory - parseDisplayValue(display));
  };

  const toggleAngleUnit = () => {
    setIsRadians(!isRadians);
  };

  const toggleSecondFunction = () => {
    setIsSecondFunction(!isSecondFunction);
  };

  const formatDisplay = (value: string) => {
    if (value.includes('DEG') || value.includes('RAD')) {
      return value;
    }
    
    if (value.length > 12) {
      const num = parseFloat(value);
      if (num > 999999999999 || num < -999999999999) {
        return num.toExponential(6);
      }
      return num.toPrecision(12);
    }
    return value;
  };

  return (
    <div className="calculator scientific">
      <div className="display">
        <div className="display-info">
          <span className={`angle-unit ${isRadians ? 'active' : ''}`}>RAD</span>
          <span className={`angle-unit ${!isRadians ? 'active' : ''}`}>DEG</span>
          {memory !== 0 && <span className="memory-indicator">M</span>}
          {isSecondFunction && <span className="second-function">2nd</span>}
        </div>
        <div className="display-value">
          {formatDisplay(display)}
        </div>
      </div>
      
      <div className="keypad scientific-keypad">
        {/* Row 1 - Memory and Functions */}
        <div className="row">
          <button className="key function small" onClick={memoryClear}>MC</button>
          <button className="key function small" onClick={memoryRecall}>MR</button>
          <button className="key function small" onClick={memoryStore}>MS</button>
          <button className="key function small" onClick={memoryAdd}>M+</button>
          <button className="key function small" onClick={memorySubtract}>M-</button>
          <button className="key function" onClick={toggleSecondFunction}>2nd</button>
          <button className="key function" onClick={toggleAngleUnit}>{isRadians ? 'RAD' : 'DEG'}</button>
        </div>

        {/* Row 2 - Scientific Functions */}
        <div className="row">
          <button className="key scientific" onClick={() => performScientificOperation(isSecondFunction ? 'asin' : 'sin')}>
            {isSecondFunction ? 'sin⁻¹' : 'sin'}
          </button>
          <button className="key scientific" onClick={() => performScientificOperation(isSecondFunction ? 'acos' : 'cos')}>
            {isSecondFunction ? 'cos⁻¹' : 'cos'}
          </button>
          <button className="key scientific" onClick={() => performScientificOperation(isSecondFunction ? 'atan' : 'tan')}>
            {isSecondFunction ? 'tan⁻¹' : 'tan'}
          </button>
          <button className="key scientific" onClick={() => performScientificOperation(isSecondFunction ? 'cbrt' : 'square')}>
            {isSecondFunction ? '∛x' : 'x²'}
          </button>
          <button className="key scientific" onClick={() => performScientificOperation(isSecondFunction ? 'cube' : 'sqrt')}>
            {isSecondFunction ? 'x³' : '√x'}
          </button>
          <button className="key operation" onClick={() => performOperation('^')}>xʸ</button>
          <button className="key function" onClick={allClear}>AC</button>
        </div>

        {/* Row 3 - More Functions */}
        <div className="row">
          <button className="key scientific" onClick={() => performScientificOperation(isSecondFunction ? 'exp' : 'ln')}>
            {isSecondFunction ? 'eˣ' : 'ln'}
          </button>
          <button className="key scientific" onClick={() => performScientificOperation('log')}>log</button>
          <button className="key scientific" onClick={() => performScientificOperation('factorial')}>x!</button>
          <button className="key scientific" onClick={() => performScientificOperation('reciprocal')}>1/x</button>
          <button className="key scientific" onClick={() => performScientificOperation('abs')}>|x|</button>
          <button className="key operation" onClick={() => performOperation('mod')}>mod</button>
          <button className="key function" onClick={clear}>C</button>
        </div>

        {/* Row 4 - Constants and Operations */}
        <div className="row">
          <button className="key scientific" onClick={() => insertConstant('pi')}>π</button>
          <button className="key scientific" onClick={() => insertConstant('e')}>e</button>
          <button className="key function" onClick={inputDegree}>DEG</button>
          <button className="key function" onClick={backspace}>⌫</button>
          <button className="key function" onClick={percentage}>%</button>
          <button className="key function" onClick={() => performScientificOperation('negate')}>±</button>
          <button className="key operation" onClick={() => performOperation('÷')}>÷</button>
        </div>
        
        {/* Row 5 - Numbers */}
        <div className="row">
          <button className="key number" onClick={() => inputNumber('7')}>7</button>
          <button className="key number" onClick={() => inputNumber('8')}>8</button>
          <button className="key number" onClick={() => inputNumber('9')}>9</button>
          <button className="key operation" onClick={() => performOperation('×')}>×</button>
        </div>
        
        {/* Row 6 - Numbers */}
        <div className="row">
          <button className="key number" onClick={() => inputNumber('4')}>4</button>
          <button className="key number" onClick={() => inputNumber('5')}>5</button>
          <button className="key number" onClick={() => inputNumber('6')}>6</button>
          <button className="key operation" onClick={() => performOperation('-')}>−</button>
        </div>
        
        {/* Row 7 - Numbers */}
        <div className="row">
          <button className="key number" onClick={() => inputNumber('1')}>1</button>
          <button className="key number" onClick={() => inputNumber('2')}>2</button>
          <button className="key number" onClick={() => inputNumber('3')}>3</button>
          <button className="key operation" onClick={() => performOperation('+')}>+</button>
        </div>
        
        {/* Row 8 - Bottom row */}
        <div className="row">
          <button className="key number zero" onClick={() => inputNumber('0')}>0</button>
          <button className="key number" onClick={inputDecimal}>.</button>
          <button className="key operation equals" onClick={() => performOperation('=')}>=</button>
        </div>
      </div>
    </div>
  );
};

export default App;
