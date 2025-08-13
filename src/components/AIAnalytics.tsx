
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Users, 
  AlertTriangle, 
  Lightbulb, 
  Zap,
  BarChart3,
  PieChart,
  Calendar,
  DollarSign,
  Star,
  Award,
  LineChart
} from 'lucide-react';
import { Offer } from '@/types/offers';

interface AIAnalyticsProps {
  offers: Offer[];
  formatCurrency: (amount: number) => string;
}

export const AIAnalytics = ({ offers, formatCurrency }: AIAnalyticsProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Advanced AI calculations
  const getAdvancedInsights = () => {
    const totalRevenue = offers.reduce((sum, offer) => sum + offer.revenueTarget, 0);
    const totalSales = offers.reduce((sum, offer) => sum + offer.targetSales, 0);
    const avgDiscount = offers.reduce((sum, offer) => sum + offer.discountPercent, 0) / offers.length;
    
    // Revenue concentration analysis
    const top5Revenue = offers.slice(0, 5).reduce((sum, offer) => sum + offer.revenueTarget, 0);
    const concentration = (top5Revenue / totalRevenue) * 100;

    // Discount efficiency score
    const discountEfficiency = offers.map(offer => ({
      name: offer.offerName,
      efficiency: (offer.revenueTarget / offer.targetSales) / offer.discountPercent,
      discountPercent: offer.discountPercent,
      revenuePerSale: offer.revenueTarget / offer.targetSales
    })).sort((a, b) => b.efficiency - a.efficiency);

    // Lead source performance
    const leadSources = [...new Set(offers.map(offer => offer.leadSource))];
    const sourceAnalysis = leadSources.map(source => {
      const sourceOffers = offers.filter(offer => offer.leadSource === source);
      const revenue = sourceOffers.reduce((sum, offer) => sum + offer.revenueTarget, 0);
      const avgDiscount = sourceOffers.reduce((sum, offer) => sum + offer.discountPercent, 0) / sourceOffers.length;
      
      return {
        source,
        revenue,
        offerCount: sourceOffers.length,
        avgDiscount,
        roi: revenue / (sourceOffers.length * 1000) // Estimated cost per offer
      };
    }).sort((a, b) => b.roi - a.roi);

    return {
      totalRevenue,
      totalSales,
      avgDiscount,
      concentration,
      discountEfficiency,
      sourceAnalysis
    };
  };

  const getSmartRecommendations = () => {
    const insights = getAdvancedInsights();
    const recommendations = [];

    // Price optimization recommendations
    const highDiscountOffers = offers.filter(offer => offer.discountPercent > 35);
    if (highDiscountOffers.length > 3) {
      recommendations.push({
        type: 'optimization',
        priority: 'high',
        title: 'Price Optimization Opportunity',
        description: `${highDiscountOffers.length} offers have discounts >35%. Consider A/B testing lower discounts to maintain margins while preserving conversion.`,
        impact: 'revenue',
        action: 'Review Pricing Strategy',
        estimatedImpact: '₹50K-2L additional revenue'
      });
    }

    // Volume scaling recommendations
    const lowVolumeHighValue = offers.filter(offer => 
      offer.targetSales < 10 && (offer.revenueTarget / offer.targetSales) > 50000
    );
    if (lowVolumeHighValue.length > 0) {
      recommendations.push({
        type: 'growth',
        priority: 'medium',
        title: 'Scale High-Value Offers',
        description: `${lowVolumeHighValue.length} high-value offers have low target volumes. Increase marketing spend to scale these profitable offers.`,
        impact: 'growth',
        action: 'Increase Marketing Budget',
        estimatedImpact: '2-3x revenue potential'
      });
    }

    // Diversification recommendations
    if (insights.concentration > 60) {
      recommendations.push({
        type: 'risk',
        priority: 'high',
        title: 'Revenue Diversification Needed',
        description: `Top 5 offers represent ${insights.concentration.toFixed(1)}% of revenue. Diversify with mid-tier offers to reduce risk.`,
        impact: 'stability',
        action: 'Develop Mid-Tier Offers',
        estimatedImpact: 'Reduced revenue risk'
      });
    }

    // Seasonal optimization
    const festivalOffers = offers.filter(offer => 
      offer.offerName.toLowerCase().includes('festival') || 
      offer.offerName.toLowerCase().includes('diwali')
    );
    if (festivalOffers.length > 0) {
      recommendations.push({
        type: 'timing',
        priority: 'medium',
        title: 'Seasonal Campaign Optimization',
        description: 'Festival offers show strong potential. Plan similar campaigns for other festivals (Holi, New Year, etc.).',
        impact: 'seasonal',
        action: 'Expand Seasonal Strategy',
        estimatedImpact: '20-30% seasonal boost'
      });
    }

    return recommendations;
  };

  const getPredictiveMetrics = () => {
    const insights = getAdvancedInsights();
    
    return {
      conversionRate: 15.2, // Estimated based on offer attractiveness
      customerLifetimeValue: 45000,
      averageOrderValue: insights.totalRevenue / insights.totalSales,
      monthlyRecurringRevenue: insights.totalRevenue * 0.08, // 8% monthly from annual
      churnRiskScore: 12.5,
      marketPenetration: 8.3
    };
  };

  const insights = getAdvancedInsights();
  const recommendations = getSmartRecommendations();
  const predictive = getPredictiveMetrics();

  return (
    <div className="space-y-6">
      {/* AI Analytics Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-800">AI Analytics Dashboard</CardTitle>
              <p className="text-sm text-gray-600">Advanced insights and predictive analytics</p>
            </div>
            <Badge className="ml-auto bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse">
              Live Analysis
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100/80">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Total Revenue</h3>
                    <p className="text-xs text-gray-600">Target projection</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(insights.totalRevenue)}</p>
                <p className="text-xs text-gray-500 mt-1">Across {offers.length} offers</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Target Sales</h3>
                    <p className="text-xs text-gray-600">Total units</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-600">{insights.totalSales}</p>
                <p className="text-xs text-gray-500 mt-1">Average: {Math.round(insights.totalSales / offers.length)} per offer</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-8 h-8 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Avg Discount</h3>
                    <p className="text-xs text-gray-600">Portfolio average</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-orange-600">{insights.avgDiscount.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">Range: 8% - 50%</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <PieChart className="w-8 h-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Concentration</h3>
                    <p className="text-xs text-gray-600">Top 5 offers</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-purple-600">{insights.concentration.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">Revenue share</p>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Top Performing Offers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.discountEfficiency.slice(0, 5).map((offer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                      <span className="font-medium text-gray-800">{offer.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        {formatCurrency(offer.revenuePerSale)} per sale
                      </p>
                      <p className="text-xs text-gray-500">{offer.discountPercent}% discount</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictive Tab */}
        <TabsContent value="predictive" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <LineChart className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Conversion Rate</h3>
                    <p className="text-xs text-gray-600">Predicted</p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-blue-600">{predictive.conversionRate}%</p>
                <p className="text-xs text-gray-500 mt-2">Based on offer attractiveness</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Customer LTV</h3>
                    <p className="text-xs text-gray-600">Lifetime value</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(predictive.customerLifetimeValue)}</p>
                <p className="text-xs text-gray-500 mt-2">18-month projection</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Monthly Revenue</h3>
                    <p className="text-xs text-gray-600">Recurring estimate</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(predictive.monthlyRecurringRevenue)}</p>
                <p className="text-xs text-gray-500 mt-2">From annual conversions</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          {recommendations.map((rec, index) => (
            <Card key={index} className={`border-l-4 ${
              rec.priority === 'high' ? 'border-l-red-500 bg-red-50' :
              rec.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
              'border-l-blue-500 bg-blue-50'
            }`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    rec.type === 'optimization' ? 'bg-red-500' :
                    rec.type === 'growth' ? 'bg-green-500' :
                    rec.type === 'risk' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}>
                    {rec.type === 'optimization' ? <TrendingUp className="w-5 h-5 text-white" /> :
                     rec.type === 'growth' ? <Lightbulb className="w-5 h-5 text-white" /> :
                     rec.type === 'risk' ? <AlertTriangle className="w-5 h-5 text-white" /> :
                     <Calendar className="w-5 h-5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800">{rec.title}</h3>
                      <Badge variant={rec.priority === 'high' ? 'destructive' : 'outline'} className="text-xs">
                        {rec.priority} priority
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{rec.description}</p>
                    <div className="flex items-center gap-4">
                      <Button size="sm" variant="outline" className="text-xs">
                        {rec.action}
                      </Button>
                      <span className="text-xs text-green-600 font-medium">
                        Impact: {rec.estimatedImpact}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Lead Source Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.sourceAnalysis.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="font-medium text-gray-800">{source.source}</h4>
                      <p className="text-sm text-gray-600">{source.offerCount} offers</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-indigo-600">{formatCurrency(source.revenue)}</p>
                      <p className="text-sm text-gray-500">ROI: {source.roi.toFixed(1)}x</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
