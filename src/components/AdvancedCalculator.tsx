
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Calculator as CalcIcon, Percent, DivideIcon, Plus, Minus, Equal } from 'lucide-react';
import { offersData } from '@/data/offers';

interface AdvancedCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvancedCalculator = ({ isOpen, onClose }: AdvancedCalculatorProps) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      const { key } = event;
      
      if (key >= '0' && key <= '9') {
        inputNumber(key);
      } else if (key === '.') {
        inputNumber('.');
      } else if (key === '+') {
        inputOperation('+');
      } else if (key === '-') {
        inputOperation('-');
      } else if (key === '*') {
        inputOperation('×');
      } else if (key === '/') {
        event.preventDefault();
        inputOperation('÷');
      } else if (key === '%') {
        inputOperation('%');
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        performCalculation();
      } else if (key === 'Escape') {
        clear();
      } else if (key === 'Backspace') {
        backspace();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, display, previousValue, operation, waitingForNewValue]);

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
      const calculation = `${previousValue} ${operation} ${inputValue} = ${newValue}`;
      
      setHistory(prev => [calculation, ...prev.slice(0, 4)]);
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

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const calculateDiscount = (percentage: number) => {
    const value = parseFloat(display);
    const discountAmount = (value * percentage) / 100;
    const finalPrice = value - discountAmount;
    const calculation = `${value} - ${percentage}% = ${finalPrice}`;
    
    setHistory(prev => [calculation, ...prev.slice(0, 4)]);
    setDisplay(String(finalPrice));
    setWaitingForNewValue(true);
  };

  const loadOfferPrice = (offerName: string) => {
    const offer = offersData.find(o => o.offerName === offerName);
    if (offer) {
      setDisplay(String(offer.regularPrice));
      setSelectedOffer(offerName);
      setWaitingForNewValue(true);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalcIcon className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-lg">Advanced Calculator</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Display */}
          <div className="bg-gray-900 text-white p-4 rounded-lg">
            <div className="text-right">
              <div className="text-2xl font-mono break-all">{display}</div>
              {previousValue !== null && operation && (
                <div className="text-sm text-gray-400">
                  {previousValue} {operation}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {formatCurrency(parseFloat(display) || 0)}
              </div>
            </div>
          </div>

          {/* Offer Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Quick Load Offer Price:</label>
            <Select value={selectedOffer} onValueChange={loadOfferPrice}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an offer..." />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {offersData.map((offer) => (
                  <SelectItem key={offer.rank} value={offer.offerName}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">#{offer.rank}</Badge>
                      <span className="truncate">{offer.offerName}</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {formatCurrency(offer.regularPrice)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Enhanced Discount Buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Quick Discounts:</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70].map((discount) => (
                <Button
                  key={discount}
                  variant="outline"
                  size="sm"
                  onClick={() => calculateDiscount(discount)}
                  className={`text-xs ${
                    discount <= 20 ? 'bg-green-50 hover:bg-green-100 border-green-200' :
                    discount <= 40 ? 'bg-blue-50 hover:bg-blue-100 border-blue-200' :
                    discount <= 50 ? 'bg-orange-50 hover:bg-orange-100 border-orange-200' :
                    'bg-red-50 hover:bg-red-100 border-red-200'
                  }`}
                >
                  -{discount}%
                </Button>
              ))}
            </div>
          </div>

          {/* Calculator Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {/* Row 1 */}
            <Button variant="outline" onClick={clear} className="bg-red-50 text-red-700 hover:bg-red-100">
              AC
            </Button>
            <Button variant="outline" onClick={clearEntry} className="bg-orange-50 text-orange-700 hover:bg-orange-100">
              CE
            </Button>
            <Button variant="outline" onClick={backspace} className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100">
              ⌫
            </Button>
            <Button variant="outline" onClick={() => inputOperation('÷')} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
              <DivideIcon className="w-4 h-4" />
            </Button>

            {/* Row 2 */}
            <Button variant="outline" onClick={() => inputNumber('7')}>7</Button>
            <Button variant="outline" onClick={() => inputNumber('8')}>8</Button>
            <Button variant="outline" onClick={() => inputNumber('9')}>9</Button>
            <Button variant="outline" onClick={() => inputOperation('×')} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
              ×
            </Button>

            {/* Row 3 */}
            <Button variant="outline" onClick={() => inputNumber('4')}>4</Button>
            <Button variant="outline" onClick={() => inputNumber('5')}>5</Button>
            <Button variant="outline" onClick={() => inputNumber('6')}>6</Button>
            <Button variant="outline" onClick={() => inputOperation('-')} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
              <Minus className="w-4 h-4" />
            </Button>

            {/* Row 4 */}
            <Button variant="outline" onClick={() => inputNumber('1')}>1</Button>
            <Button variant="outline" onClick={() => inputNumber('2')}>2</Button>
            <Button variant="outline" onClick={() => inputNumber('3')}>3</Button>
            <Button variant="outline" onClick={() => inputOperation('+')} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
              <Plus className="w-4 h-4" />
            </Button>

            {/* Row 5 */}
            <Button variant="outline" onClick={() => inputNumber('0')} className="col-span-2">
              0
            </Button>
            <Button variant="outline" onClick={() => inputNumber('.')}>.</Button>
            <Button 
              onClick={performCalculation}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            >
              <Equal className="w-4 h-4" />
            </Button>

            {/* Row 6 - Percentage */}
            <Button 
              variant="outline" 
              onClick={() => inputOperation('%')} 
              className="col-span-4 bg-purple-50 text-purple-700 hover:bg-purple-100"
            >
              <Percent className="w-4 h-4 mr-2" />
              Percentage
            </Button>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Recent Calculations:</label>
              <div className="bg-gray-50 rounded-lg p-3 max-h-24 overflow-y-auto">
                {history.map((calc, index) => (
                  <div key={index} className="text-xs text-gray-600 font-mono">
                    {calc}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keyboard Shortcuts */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Keyboard: Numbers, +, -, *, /, %, Enter (=), Esc (Clear), Backspace
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
