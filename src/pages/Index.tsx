import { useState, useEffect } from 'react';
import { OfferCard } from '@/components/OfferCard';
import { OfferModal } from '@/components/OfferModal';
import { PricingStructure } from '@/components/PricingStructure';
import { AIConfiguration } from '@/components/AIConfiguration';
import { ViewControls } from '@/components/ViewControls';
import { StatsCards } from '@/components/StatsCards';
import { Calculator } from '@/components/Calculator';
import { AIInsights } from '@/components/AIInsights';
import { AIAnalytics } from '@/components/AIAnalytics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { offersData } from '@/data/offers';
import { Offer, ViewMode } from '@/types/offers';
import { 
  Search, 
  Settings, 
  Zap, 
  Calculator as CalcIcon,
  Brain,
  Plus,
  Sparkles,
  TrendingUp,
  Filter,
  CheckCircle,
  Download
} from 'lucide-react';
import { AdvancedCalculator } from '@/components/AdvancedCalculator';
import { ExportModal } from '@/components/ExportModal';

const Index = () => {
  const [offers, setOffers] = useState<Offer[]>(offersData);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'discount' | 'revenue' | 'price'>('rank');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showAIConfig, setShowAIConfig] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showAIAnalytics, setShowAIAnalytics] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showApprovedOnly, setShowApprovedOnly] = useState(false);

  // Filter and sort offers
  const filteredOffers = offers
    .filter(offer => {
      const matchesSearch = offer.offerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.offerDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.leadSource.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesApproval = !showApprovedOnly || offer.isApproved;
      
      return matchesSearch && matchesApproval;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'discount':
          return b.discountPercent - a.discountPercent;
        case 'revenue':
          return b.revenueTarget - a.revenueTarget;
        case 'price':
          return a.offerPrice - b.offerPrice;
        default:
          return a.rank - b.rank;
      }
    });

  const approvedOffers = offers.filter(offer => offer.isApproved);

  // Calculate summary stats
  const totalRevenue = offers.reduce((sum, offer) => sum + offer.revenueTarget, 0);
  const totalSales = offers.reduce((sum, offer) => sum + offer.targetSales, 0);
  const avgDiscount = offers.reduce((sum, offer) => sum + offer.discountPercent, 0) / offers.length;

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const handleOfferClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const handleSaveComments = (offerId: number, mitaliComments: string, saachiComments: string, finalRemarks: string) => {
    setOffers(prevOffers =>
      prevOffers.map(offer =>
        offer.rank === offerId
          ? { ...offer, mitaliComments, saachiComments, finalRemarks }
          : offer
      )
    );
  };

  const handleApprovalToggle = (offerId: number, isApproved: boolean) => {
    setOffers(prevOffers =>
      prevOffers.map(offer =>
        offer.rank === offerId
          ? { ...offer, isApproved }
          : offer
      )
    );
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as 'rank' | 'discount' | 'revenue' | 'price');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm font-medium animate-pulse-glow">
              <Zap className="w-4 h-4" />
              Kwality House Annexe Studio Launch
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-fade-in">
              Launch Strategy
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto animate-slide-up">
              AI-powered marketing dashboard with smart insights and premium offer analytics
            </p>
            
            {/* Enhanced Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
              <Button 
                onClick={() => setShowPricing(!showPricing)}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Pricing Structure
              </Button>
              <Button 
                onClick={() => setShowAIConfig(!showAIConfig)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 transition-all duration-300 hover:scale-105"
              >
                <Settings className="w-4 h-4 mr-2" />
                AI Configuration
              </Button>
              <Button 
                onClick={() => setShowCalculator(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 transition-all duration-300 hover:scale-105"
              >
                <CalcIcon className="w-4 h-4 mr-2" />
                Calculator
              </Button>
              <Button 
                onClick={() => setShowAIInsights(!showAIInsights)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 transition-all duration-300 hover:scale-105"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Insights
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 rounded-full animate-float-delayed"></div>
        <div className="absolute top-32 right-20 w-12 h-12 bg-white/10 rounded-full animate-pulse"></div>
      </div>

      {/* Conditional Components */}
      {showPricing && <PricingStructure />}
      {showAIConfig && <AIConfiguration onClose={() => setShowAIConfig(false)} />}
      {showAIInsights && (
        <div className="container mx-auto px-6 py-8">
          <AIInsights offers={offers} formatCurrency={formatCurrency} />
        </div>
      )}
      {showAIAnalytics && (
        <div className="container mx-auto px-6 py-8">
          <AIAnalytics offers={offers} formatCurrency={formatCurrency} />
        </div>
      )}

      {/* Stats Cards - Moved after hero */}
      <StatsCards 
        totalRevenue={totalRevenue}
        totalSales={totalSales}
        avgDiscount={avgDiscount}
        formatCurrency={formatCurrency}
      />

      {/* Enhanced Controls Section */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/90 border-b border-gray-200/30 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col xl:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search offers, details, or lead sources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/70 border-gray-200/50 focus:bg-white transition-all duration-200 text-sm"
              />
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button 
                onClick={() => setShowApprovedOnly(!showApprovedOnly)}
                size="sm"
                variant={showApprovedOnly ? "default" : "outline"}
                className={`text-xs ${showApprovedOnly ? "bg-green-600 text-white" : ""}`}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {showApprovedOnly ? 'All Offers' : 'Approved Only'}
              </Button>
              
              <Button 
                onClick={() => setShowExportModal(true)}
                size="sm"
                disabled={approvedOffers.length === 0}
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white text-xs"
              >
                <Download className="w-4 h-4 mr-2" />
                Export ({approvedOffers.length})
              </Button>

              <Button 
                onClick={() => setShowAIAnalytics(!showAIAnalytics)}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-xs"
              >
                <Brain className="w-4 h-4 mr-2" />
                AI Analytics
              </Button>
              
              <Button 
                onClick={() => setShowCalculator(true)}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs"
              >
                <CalcIcon className="w-4 h-4 mr-2" />
                Calculator
              </Button>
            </div>

            {/* View Controls */}
            <ViewControls 
              viewMode={viewMode}
              setViewMode={setViewMode}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />

            {/* Quick Stats */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                {filteredOffers.length} offers
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                {approvedOffers.length} approved
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                {formatCurrency(totalRevenue)} target
              </Badge>
            </div>
          </div>

          {/* Active Filters */}
          {searchTerm && (
            <div className="flex items-center gap-2 mt-3 animate-fade-in">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Active filters:</span>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 text-xs">
                Search: {searchTerm}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Offers Grid */}
      <div className="container mx-auto px-6 py-6">
        <div className={`grid gap-6 ${
          viewMode === 'list' ? 'grid-cols-1' :
          viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
          viewMode === 'compact' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
          viewMode === 'masonry' ? 'columns-1 md:columns-2 lg:columns-3' :
          viewMode === 'timeline' ? 'grid-cols-1 max-w-4xl mx-auto' :
          viewMode === 'kanban' ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4' :
          viewMode === 'analytics' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        }`}>
          {filteredOffers.map((offer, index) => (
            <div 
              key={offer.rank} 
              style={{ 
                animationDelay: `${index * 0.05}s`,
                breakInside: viewMode === 'masonry' ? 'avoid' : 'auto'
              }}
            >
              <OfferCard
                offer={offer}
                index={index}
                viewMode={viewMode}
                onClick={() => handleOfferClick(offer)}
                formatCurrency={formatCurrency}
                sortBy={sortBy}
                onApprovalToggle={handleApprovalToggle}
              />
            </div>
          ))}
        </div>

        {/* Enhanced Empty State */}
        {filteredOffers.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 inline-block shadow-lg">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No offers found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search terms or filters</p>
              <Button 
                onClick={() => setSearchTerm('')}
                variant="outline"
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
              >
                Clear Search
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Components */}
      <AdvancedCalculator isOpen={showCalculator} onClose={() => setShowCalculator(false)} />
      
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        approvedOffers={approvedOffers}
        formatCurrency={formatCurrency}
      />

      <OfferModal
        offer={selectedOffer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveComments={handleSaveComments}
        onApprovalToggle={handleApprovalToggle}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default Index;
