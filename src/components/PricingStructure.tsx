
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, Crown, Star, CheckCircle } from 'lucide-react';
import { pricingPackages } from '@/data/pricingOptions';

export const PricingStructure = () => {
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getPopularBadge = (duration: string) => {
    return duration === '3 Month' || duration === '6 Month';
  };

  const getBestValueBadge = (duration: string) => {
    return duration === 'Annual';
  };

  return (
    <div className="container mx-auto px-6 py-12 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Membership Pricing</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the perfect membership plan for your fitness journey. All prices include taxes and premium amenities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {pricingPackages.map((pkg, pkgIndex) => (
          <Card key={pkg.name} className={`
            relative overflow-hidden border-0 shadow-xl
            ${pkgIndex === 0 
              ? 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50' 
              : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50'
            }
          `}>
            {/* Popular badge for All In Package */}
            {pkgIndex === 0 && (
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-medium transform rotate-12 shadow-lg">
                <Crown className="w-3 h-3 inline mr-1" />
                Most Popular
              </div>
            )}

            <CardHeader className="text-center pb-6 relative">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${
                  pkgIndex === 0 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
                }`}>
                  {pkgIndex === 0 ? <Zap className="w-6 h-6 text-white" /> : <Target className="w-6 h-6 text-white" />}
                </div>
                <CardTitle className={`text-2xl font-bold ${
                  pkgIndex === 0 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
                    : 'bg-gradient-to-r from-green-600 to-emerald-600'
                } bg-clip-text text-transparent`}>
                  {pkg.name}
                </CardTitle>
              </div>
              <p className="text-gray-600 text-lg font-medium">{pkg.description}</p>
            </CardHeader>

            <CardContent className="space-y-3">
              {pkg.tiers.map((tier, index) => (
                <div 
                  key={tier.duration}
                  className={`
                    relative flex items-center justify-between p-4 rounded-xl transition-all duration-300
                    bg-white/70 hover:bg-white/90 hover:shadow-md
                    ${getBestValueBadge(tier.duration) ? 'ring-2 ring-yellow-400 bg-yellow-50/50' : ''}
                    ${getPopularBadge(tier.duration) ? 'ring-1 ring-indigo-300' : ''}
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Best Value Badge */}
                  {getBestValueBadge(tier.duration) && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                      <Star className="w-3 h-3 inline mr-1" />
                      Best Value
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-800 text-lg">{tier.duration}</h4>
                      {getPopularBadge(tier.duration) && (
                        <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-600 border-indigo-200">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Pre-tax: {formatCurrency(tier.preTax)} • {tier.months} month{tier.months !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      pkgIndex === 0 ? 'text-indigo-600' : 'text-green-600'
                    }`}>
                      {formatCurrency(tier.afterTax)}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Inc. taxes
                    </p>
                    {tier.months >= 3 && (
                      <p className="text-xs text-gray-400">
                        ₹{Math.round(tier.afterTax / tier.months).toLocaleString()}/month
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Section */}
      <div className="mt-12 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 bg-white/60 rounded-xl border border-gray-200/50">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800 mb-2">Premium Equipment</h4>
            <p className="text-sm text-gray-600">State-of-the-art fitness equipment and facilities</p>
          </div>
          <div className="p-6 bg-white/60 rounded-xl border border-gray-200/50">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800 mb-2">Expert Trainers</h4>
            <p className="text-sm text-gray-600">Certified professionals to guide your fitness journey</p>
          </div>
          <div className="p-6 bg-white/60 rounded-xl border border-gray-200/50">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-800 mb-2">Flexible Scheduling</h4>
            <p className="text-sm text-gray-600">Book classes that fit your busy lifestyle</p>
          </div>
        </div>
      </div>
    </div>
  );
};
