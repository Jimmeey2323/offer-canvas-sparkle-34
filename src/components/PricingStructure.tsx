
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Target } from 'lucide-react';

export const PricingStructure = () => {
  const allInPricing = [
    { duration: '2 Week', preTax: 11333, afterTax: 13373 },
    { duration: '1 Month', preTax: 20333, afterTax: 23993 },
    { duration: '3 Month', preTax: 58000, afterTax: 68440 },
    { duration: '6 Month', preTax: 114000, afterTax: 134520 },
    { duration: 'Annual', preTax: 220000, afterTax: 259600 },
  ];

  const singleFormatPricing = [
    { duration: '2 Week', preTax: 8500, afterTax: 10030 },
    { duration: '1 Month', preTax: 15250, afterTax: 17995 },
    { duration: '3 Month', preTax: 43500, afterTax: 51330 },
    { duration: '6 Month', preTax: 85500, afterTax: 100890 },
    { duration: 'Annual', preTax: 165000, afterTax: 194700 },
  ];

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="container mx-auto px-6 py-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ALL IN Pricing */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ALL IN Package
              </CardTitle>
            </div>
            <p className="text-gray-600">Strength + Spin + Barre</p>
            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">Most Popular</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {allInPricing.map((tier, index) => (
              <div 
                key={tier.duration}
                className="flex items-center justify-between p-4 bg-white/60 rounded-xl hover:bg-white/80 transition-all duration-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div>
                  <h4 className="font-semibold text-gray-800">{tier.duration}</h4>
                  <p className="text-sm text-gray-500">Pre-tax: {formatCurrency(tier.preTax)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-indigo-600">{formatCurrency(tier.afterTax)}</p>
                  <p className="text-xs text-gray-500">Inc. taxes</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Single Format Pricing */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Single Format
              </CardTitle>
            </div>
            <p className="text-gray-600">Either Spin OR Barre</p>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">Focused Training</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {singleFormatPricing.map((tier, index) => (
              <div 
                key={tier.duration}
                className="flex items-center justify-between p-4 bg-white/60 rounded-xl hover:bg-white/80 transition-all duration-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div>
                  <h4 className="font-semibold text-gray-800">{tier.duration}</h4>
                  <p className="text-sm text-gray-500">Pre-tax: {formatCurrency(tier.preTax)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">{formatCurrency(tier.afterTax)}</p>
                  <p className="text-xs text-gray-500">Inc. taxes</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
