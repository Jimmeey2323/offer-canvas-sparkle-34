
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Calculator as CalcIcon, Percent, DivideIcon } from 'lucide-react';

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Calculator = ({ isOpen, onClose }: CalculatorProps) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  if (!isOpen) return null;

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '%':
        return (firstValue * secondValue) / 100;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  // Quick discount calculators
  const calculateDiscount = (percentage: number) => {
    const value = parseFloat(display);
    const discountAmount = (value * percentage) / 100;
    const finalPrice = value - discountAmount;
    setDisplay(String(finalPrice));
    setWaitingForNewValue(true);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-white/95 backdrop-blur-xl border-0 shadow-2xl animate-scale-in">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalcIcon className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-lg">Smart Calculator</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Display */}
          <div className="bg-gray-900 text-white p-4 rounded-lg text-right">
            <div className="text-2xl font-mono">{display}</div>
            {previousValue !== null && operation && (
              <div className="text-sm text-gray-400">
                {previousValue} {operation}
              </div>
            )}
          </div>

          {/* Quick Discount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => calculateDiscount(10)}
              className="text-xs bg-green-50 hover:bg-green-100 border-green-200"
            >
              -10%
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => calculateDiscount(20)}
              className="text-xs bg-blue-50 hover:bg-blue-100 border-blue-200"
            >
              -20%
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => calculateDiscount(30)}
              className="text-xs bg-orange-50 hover:bg-orange-100 border-orange-200"
            >
              -30%
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => calculateDiscount(50)}
              className="text-xs bg-red-50 hover:bg-red-100 border-red-200"
            >
              -50%
            </Button>
          </div>

          {/* Calculator Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {/* Row 1 */}
            <Button variant="outline" onClick={clear} className="bg-red-50 hover:bg-red-100">
              AC
            </Button>
            <Button variant="outline" onClick={clearEntry} className="bg-orange-50 hover:bg-orange-100">
              CE
            </Button>
            <Button variant="outline" onClick={() => inputOperation('%')} className="bg-purple-50 hover:bg-purple-100">
              <Percent className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => inputOperation('÷')} className="bg-indigo-50 hover:bg-indigo-100">
              <DivideIcon className="w-4 h-4" />
            </Button>

            {/* Row 2 */}
            <Button variant="outline" onClick={() => inputNumber('7')}>7</Button>
            <Button variant="outline" onClick={() => inputNumber('8')}>8</Button>
            <Button variant="outline" onClick={() => inputNumber('9')}>9</Button>
            <Button variant="outline" onClick={() => inputOperation('×')} className="bg-indigo-50 hover:bg-indigo-100">
              ×
            </Button>

            {/* Row 3 */}
            <Button variant="outline" onClick={() => inputNumber('4')}>4</Button>
            <Button variant="outline" onClick={() => inputNumber('5')}>5</Button>
            <Button variant="outline" onClick={() => inputNumber('6')}>6</Button>
            <Button variant="outline" onClick={() => inputOperation('-')} className="bg-indigo-50 hover:bg-indigo-100">
              −
            </Button>

            {/* Row 4 */}
            <Button variant="outline" onClick={() => inputNumber('1')}>1</Button>
            <Button variant="outline" onClick={() => inputNumber('2')}>2</Button>
            <Button variant="outline" onClick={() => inputNumber('3')}>3</Button>
            <Button variant="outline" onClick={() => inputOperation('+')} className="bg-indigo-50 hover:bg-indigo-100">
              +
            </Button>

            {/* Row 5 */}
            <Button variant="outline" onClick={() => inputNumber('0')} className="col-span-2">
              0
            </Button>
            <Button variant="outline" onClick={() => inputNumber('.')}>.</Button>
            <Button 
              onClick={performCalculation}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
            >
              =
            </Button>
          </div>

          {/* Currency Conversion Helper */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Result: {formatCurrency(parseFloat(display) || 0)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
