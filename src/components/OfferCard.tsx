
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Offer, ViewMode } from '@/types/offers';
import { 
  Eye, 
  Users, 
  TrendingUp, 
  Target, 
  Star, 
  Clock, 
  Award, 
  Zap,
  Crown,
  Sparkles,
  Calendar,
  CheckCircle
} from 'lucide-react';

interface OfferCardProps {
  offer: Offer;
  index: number;
  viewMode: ViewMode;
  onClick: () => void;
  formatCurrency: (amount: number) => string;
  sortBy: 'rank' | 'discount' | 'revenue' | 'price';
  onApprovalToggle: (offerId: number, isApproved: boolean) => void;
}

export const OfferCard = ({ 
  offer, 
  index, 
  viewMode, 
  onClick, 
  formatCurrency,
  sortBy,
  onApprovalToggle
}: OfferCardProps) => {
  const getPriorityInfo = (rank: number, sortBy: string) => {
    let displayRank = rank;
    
    // Adjust rank display based on sort criteria
    if (sortBy === 'discount') {
      displayRank = offer.discountPercent;
    } else if (sortBy === 'revenue') {
      displayRank = Math.floor(offer.revenueTarget / 100000);
    } else if (sortBy === 'price') {
      displayRank = Math.floor(offer.offerPrice / 10000);
    }

    if (rank <= 3) return {
      color: 'from-red-500 via-pink-500 to-orange-500',
      icon: Crown,
      label: 'Premium',
      glow: 'shadow-red-500/20',
      displayRank
    };
    if (rank <= 6) return {
      color: 'from-orange-500 via-yellow-500 to-amber-500',
      icon: Award,
      label: 'Priority',
      glow: 'shadow-orange-500/20',
      displayRank
    };
    if (rank <= 12) return {
      color: 'from-blue-500 via-cyan-500 to-indigo-500',
      icon: Star,
      label: 'Standard',
      glow: 'shadow-blue-500/20',
      displayRank
    };
    return {
      color: 'from-green-500 via-emerald-500 to-teal-500',
      icon: Sparkles,
      label: 'Basic',
      glow: 'shadow-green-500/20',
      displayRank
    };
  };

  const priorityInfo = getPriorityInfo(offer.rank, sortBy);
  const PriorityIcon = priorityInfo.icon;

  const getDiscountBadgeColor = (discount: number) => {
    if (discount >= 40) return 'from-red-500 to-pink-600';
    if (discount >= 30) return 'from-orange-500 to-red-500';
    if (discount >= 20) return 'from-yellow-500 to-orange-500';
    return 'from-blue-500 to-purple-500';
  };

  const getViewModeClasses = () => {
    switch (viewMode) {
      case 'list':
        return 'flex flex-row items-start gap-6 p-6 min-h-[140px]';
      case 'compact':
        return 'p-4 min-h-[200px]';
      case 'timeline':
        return 'flex flex-row items-start gap-4 p-5 border-l-4 border-indigo-500 ml-4 min-h-[120px] relative';
      case 'kanban':
        return 'p-5 min-h-[280px]';
      case 'analytics':
        return 'p-6 min-h-[320px]';
      default:
        return 'p-6 min-h-[340px]';
    }
  };

  const animationDelay = `${index * 0.05}s`;

  return (
    <Card
      className={`
        group relative overflow-hidden cursor-pointer
        bg-gradient-to-br from-white/95 via-white/90 to-white/85 
        backdrop-blur-xl border border-white/30
        shadow-lg transition-all duration-300 ease-out
        ${getViewModeClasses()}
        border-white/50
        ${offer.isApproved ? 'ring-2 ring-green-500/20' : ''}
      `}
      style={{ animationDelay }}
      onClick={onClick}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-purple-50/20 to-pink-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Header Section with Badges */}
      <div className="relative mb-4">
        {/* Priority Badge - Positioning based on view mode */}
        <div className={`absolute z-20 ${
          viewMode === 'timeline' || viewMode === 'list' 
            ? 'top-2 right-2' 
            : '-top-2 -right-2'
        }`}>
          <Badge className={`
            bg-gradient-to-r ${priorityInfo.color} text-white font-semibold text-xs
            shadow-md border-0 px-2.5 py-1 rounded-full
          `}>
            <PriorityIcon className="w-3 h-3 mr-1" />
            {sortBy === 'rank' ? `#${offer.rank}` : 
             sortBy === 'discount' ? `${offer.discountPercent}%` :
             sortBy === 'revenue' ? formatCurrency(offer.revenueTarget) :
             formatCurrency(offer.offerPrice)}
          </Badge>
        </div>

        {/* Discount Badge - Positioning based on view mode */}
        <div className={`absolute z-20 ${
          viewMode === 'timeline' || viewMode === 'list' 
            ? 'top-10 right-2' 
            : '-top-2 -left-2'
        }`}>
          <Badge className={`
            bg-gradient-to-r ${getDiscountBadgeColor(offer.discountPercent)} 
            text-white font-bold text-xs shadow-md border-0 px-2.5 py-1 rounded-full
          `}>
            <Zap className="w-3 h-3 mr-1" />
            {offer.discountPercent}% OFF
          </Badge>
        </div>

        {/* Approval Status Badge */}
        {offer.isApproved && (
          <div className={`absolute z-20 ${
            viewMode === 'timeline' || viewMode === 'list' 
              ? 'top-18 right-2' 
              : 'top-8 -right-1'
          }`}>
            <Badge className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3 mr-1" />
              Approved
            </Badge>
          </div>
        )}
      </div>

      <div className={`
        space-y-4 ${viewMode === 'timeline' || viewMode === 'list' ? 'mt-6' : 'mt-12'}
        ${viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : ''}
      `}>
        {/* Approval Toggle */}
        <div className="flex items-center justify-between">
          <h3 className={`
            font-bold text-gray-800 line-clamp-2 leading-tight
            transition-colors duration-300
            ${viewMode === 'compact' ? 'text-base' : 'text-lg'}
          `}>
            {offer.offerName}
          </h3>
          
          <div className="flex items-center gap-2 ml-2">
            <span className="text-xs text-gray-600">Approve:</span>
            <Switch
              checked={offer.isApproved || false}
              onCheckedChange={(checked) => onApprovalToggle(offer.rank, checked)}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>
        
        {/* Star Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-3.5 h-3.5 transition-colors duration-300 ${
                i < Math.floor(4 + offer.discountPercent / 20) 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`} 
            />
          ))}
          <span className="text-xs text-gray-500 ml-1.5 font-medium">
            ({Math.floor(4 + offer.discountPercent / 20)}.0)
          </span>
        </div>

        {/* Pricing Section */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className={`
              font-bold bg-gradient-to-r from-indigo-600 to-purple-600 
              bg-clip-text text-transparent
              ${viewMode === 'compact' ? 'text-lg' : 'text-xl'}
            `}>
              {formatCurrency(offer.offerPrice)}
            </span>
            <span className="text-sm text-gray-500 line-through decoration-red-500 decoration-2">
              {formatCurrency(offer.regularPrice)}
            </span>
          </div>
          
          {/* Savings Badge */}
          <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
            <TrendingUp className="w-3 h-3" />
            Save {formatCurrency(offer.regularPrice - offer.offerPrice)}
          </div>

          {viewMode !== 'compact' && viewMode !== 'timeline' && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mt-2">
              {offer.offerDetails}
            </p>
          )}
        </div>

        {/* Metrics Grid */}
        {viewMode !== 'compact' && viewMode !== 'timeline' && (
          <div className={`grid gap-2 ${
            viewMode === 'list' ? 'grid-cols-4' : 'grid-cols-2'
          }`}>
            <div className="flex items-center gap-2 text-gray-600 bg-blue-50/70 px-2 py-1.5 rounded-lg text-xs">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-medium">{offer.targetSales}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 bg-green-50/70 px-2 py-1.5 rounded-lg text-xs">
              <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              <span className="font-medium">{formatCurrency(offer.revenueTarget)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 bg-purple-50/70 px-2 py-1.5 rounded-lg text-xs">
              <Target className="w-3.5 h-3.5 text-purple-500" />
              <span className="font-medium truncate">{offer.leadSource}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 bg-orange-50/70 px-2 py-1.5 rounded-lg text-xs">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              <span className="font-medium">Active</span>
            </div>
          </div>
        )}

        {/* CTA Message for Analytics */}
        {viewMode === 'analytics' && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 italic line-clamp-2 bg-gray-50/70 p-2.5 rounded-lg">
              "{offer.ctaMessage}"
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            className={`
              w-full bg-gradient-to-r from-indigo-50/70 to-purple-50/70 
              hover:from-indigo-100/70 hover:to-purple-100/70 
              text-indigo-700 border border-indigo-200/50 
              hover:border-indigo-300/50 transition-all duration-300
              font-medium shadow-sm text-sm
            `}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </div>

      {/* Corner Decoration */}
      <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-indigo-100/40 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Card>
  );
};
