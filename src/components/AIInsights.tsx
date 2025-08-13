
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Target, Users, AlertTriangle, Lightbulb, Zap } from 'lucide-react';
import { Offer } from '@/types/offers';

interface AIInsightsProps {
  offers: Offer[];
  formatCurrency: (amount: number) => string;
}

export const AIInsights = ({ offers, formatCurrency }: AIInsightsProps) => {
  const [activeInsight, setActiveInsight] = useState<string>('performance');

  // AI-driven insights calculations
  const getPerformanceInsights = () => {
    const totalRevenue = offers.reduce((sum, offer) => sum + offer.revenueTarget, 0);
    const avgDiscount = offers.reduce((sum, offer) => sum + offer.discountPercent, 0) / offers.length;
    const topPerformers = offers.slice(0, 5);
    const lowPerformers = offers.slice(-3);

    return {
      totalRevenue,
      avgDiscount,
      topPerformers,
      lowPerformers,
      revenueDistribution: offers.map(offer => ({
        name: offer.offerName,
        revenue: offer.revenueTarget,
        percentage: (offer.revenueTarget / totalRevenue) * 100
      }))
    };
  };

  const getOptimizationSuggestions = () => {
    const insights = getPerformanceInsights();
    const suggestions = [];

    // High discount offers that might be cannibalizing
    const highDiscountOffers = offers.filter(offer => offer.discountPercent > 35);
    if (highDiscountOffers.length > 3) {
      suggestions.push({
        type: 'warning',
        title: 'High Discount Alert',
        description: `${highDiscountOffers.length} offers have >35% discounts. Consider reducing to maintain margins.`,
        action: 'Review Pricing Strategy'
      });
    }

    // Low target sales opportunities
    const lowTargetOffers = offers.filter(offer => offer.targetSales < 10);
    if (lowTargetOffers.length > 0) {
      suggestions.push({
        type: 'opportunity',
        title: 'Scale-Up Potential',
        description: `${lowTargetOffers.length} offers have low target sales. Consider increasing marketing budget.`,
        action: 'Boost Marketing'
      });
    }

    // Revenue concentration risk
    const top3Revenue = insights.topPerformers.slice(0, 3).reduce((sum, offer) => sum + offer.revenueTarget, 0);
    const concentrationRisk = (top3Revenue / insights.totalRevenue) * 100;
    
    if (concentrationRisk > 60) {
      suggestions.push({
        type: 'risk',
        title: 'Revenue Concentration Risk',
        description: `Top 3 offers represent ${concentrationRisk.toFixed(1)}% of total revenue. Diversify portfolio.`,
        action: 'Diversify Offers'
      });
    }

    return suggestions;
  };

  const getMarketingInsights = () => {
    const leadSources = [...new Set(offers.map(offer => offer.leadSource))];
    const sourcePerformance = leadSources.map(source => {
      const sourceOffers = offers.filter(offer => offer.leadSource === source);
      const totalRevenue = sourceOffers.reduce((sum, offer) => sum + offer.revenueTarget, 0);
      const avgDiscount = sourceOffers.reduce((sum, offer) => sum + offer.discountPercent, 0) / sourceOffers.length;
      
      return {
        source,
        offerCount: sourceOffers.length,
        totalRevenue,
        avgDiscount
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);

    return sourcePerformance;
  };

  const insights = getPerformanceInsights();
  const suggestions = getOptimizationSuggestions();
  const marketingInsights = getMarketingInsights();

  const insightTabs = [
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'optimization', label: 'AI Suggestions', icon: Brain },
    { id: 'marketing', label: 'Marketing', icon: Target }
  ];

  return (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">AI-Powered Insights</CardTitle>
              <p className="text-sm text-gray-600">Smart recommendations for your launch strategy</p>
            </div>
            <Badge className="ml-auto bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse">
              Live Analysis
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Insight Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {insightTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeInsight === tab.id ? "default" : "outline"}
              onClick={() => setActiveInsight(tab.id)}
              className={`whitespace-nowrap ${
                activeInsight === tab.id 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white' 
                  : ''
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Performance Insights */}
      {activeInsight === 'performance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-800">Revenue Leader</h3>
                  <p className="text-sm text-gray-600">Top performing offer</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-green-700">{insights.topPerformers[0]?.offerName}</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(insights.topPerformers[0]?.revenueTarget || 0)}
                </p>
                <p className="text-sm text-gray-500">
                  {((insights.topPerformers[0]?.revenueTarget || 0) / insights.totalRevenue * 100).toFixed(1)}% of total
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-800">Volume Leader</h3>
                  <p className="text-sm text-gray-600">Highest target sales</p>
                </div>
              </div>
              <div className="space-y-2">
                {(() => {
                  const volumeLeader = offers.reduce((max, offer) => 
                    offer.targetSales > max.targetSales ? offer : max
                  );
                  return (
                    <>
                      <p className="font-medium text-blue-700">{volumeLeader.offerName}</p>
                      <p className="text-2xl font-bold text-blue-600">{volumeLeader.targetSales} sales</p>
                      <p className="text-sm text-gray-500">{volumeLeader.discountPercent}% discount</p>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-gray-800">Best Value</h3>
                  <p className="text-sm text-gray-600">Highest discount offer</p>
                </div>
              </div>
              <div className="space-y-2">
                {(() => {
                  const bestValue = offers.reduce((max, offer) => 
                    offer.discountPercent > max.discountPercent ? offer : max
                  );
                  return (
                    <>
                      <p className="font-medium text-orange-700">{bestValue.offerName}</p>
                      <p className="text-2xl font-bold text-orange-600">{bestValue.discountPercent}% OFF</p>
                      <p className="text-sm text-gray-500">Save {formatCurrency(bestValue.regularPrice - bestValue.offerPrice)}</p>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Suggestions */}
      {activeInsight === 'optimization' && (
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <Card key={index} className={`border-l-4 ${
              suggestion.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
              suggestion.type === 'opportunity' ? 'border-l-green-500 bg-green-50' :
              'border-l-red-500 bg-red-50'
            }`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${
                    suggestion.type === 'warning' ? 'bg-yellow-500' :
                    suggestion.type === 'opportunity' ? 'bg-green-500' :
                    'bg-red-500'
                  }`}>
                    {suggestion.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-white" /> :
                     suggestion.type === 'opportunity' ? <Lightbulb className="w-5 h-5 text-white" /> :
                     <AlertTriangle className="w-5 h-5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">{suggestion.title}</h3>
                    <p className="text-gray-600 mb-3">{suggestion.description}</p>
                    <Button size="sm" variant="outline" className="text-xs">
                      {suggestion.action}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Marketing Insights */}
      {activeInsight === 'marketing' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Lead Source Performance</h3>
          {marketingInsights.map((source, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-800">{source.source}</h4>
                  <Badge variant="outline">{source.offerCount} offers</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">{formatCurrency(source.totalRevenue)}</p>
                    <p className="text-xs text-gray-500">Total Revenue</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{source.avgDiscount.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500">Avg Discount</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-pink-600">
                      {((source.totalRevenue / insights.totalRevenue) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">Revenue Share</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
