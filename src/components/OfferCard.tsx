
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
        group relative overflow-hidden
        bg-white/95
        backdrop-blur-xl border border-white/30
        shadow-sm hover:shadow-xl transition-all duration-300 ease-out
        ${getViewModeClasses()}
        ${offer.isApproved ? 'ring-1 ring-green-500/30 bg-green-50/30' : ''}
        hover:border-indigo-200/50
      `}
      style={{ animationDelay }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-purple-50/10 to-pink-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Header with Badges */}
      <div className="relative p-4 pb-2">
        <div className="flex items-start justify-between mb-3">
          {/* Left side badges */}
          <div className="flex items-center gap-2">
            <Badge className={`
              bg-gradient-to-r ${priorityInfo.color} text-white font-medium text-xs
              shadow-sm border-0 px-2 py-1 rounded-md
            `}>
              <PriorityIcon className="w-3 h-3 mr-1" />
              {sortBy === 'rank' ? `#${offer.rank}` : 
               sortBy === 'discount' ? `${offer.discountPercent}%` :
               sortBy === 'revenue' ? formatCurrency(offer.revenueTarget) :
               formatCurrency(offer.offerPrice)}
            </Badge>
            
            <Badge className={`
              bg-gradient-to-r ${getDiscountBadgeColor(offer.discountPercent)} 
              text-white font-medium text-xs shadow-sm border-0 px-2 py-1 rounded-md
            `}>
              <Zap className="w-3 h-3 mr-1" />
              {offer.discountPercent}% OFF
            </Badge>
          </div>

          {/* Right side - Approval toggle */}
          <div className="flex items-center gap-2">
            {offer.isApproved && (
              <Badge className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md border border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Approved
              </Badge>
            )}
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Approve</span>
              <Switch
                checked={offer.isApproved || false}
                onCheckedChange={(checked) => {
                  onApprovalToggle(offer.rank, checked);
                }}
                onClick={(e) => e.stopPropagation()}
                className="data-[state=checked]:bg-green-500 scale-75"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 space-y-3" onClick={onClick}>
        {/* Title */}
        <h3 className={`
          font-semibold text-gray-800 line-clamp-2 leading-tight cursor-pointer
          hover:text-indigo-600 transition-colors duration-200
          ${viewMode === 'compact' ? 'text-sm' : 'text-base'}
        `}>
          {offer.offerName}
        </h3>
        
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-3 h-3 transition-colors duration-300 ${
                i < Math.floor(4 + offer.discountPercent / 20) 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`} 
            />
          ))}
          <span className="text-xs text-gray-500 ml-1 font-medium">
            ({Math.floor(4 + offer.discountPercent / 20)}.0)
          </span>
        </div>

        {/* Pricing Section */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className={`
              font-bold bg-gradient-to-r from-indigo-600 to-purple-600
              bg-clip-text text-transparent
              ${viewMode === 'compact' ? 'text-base' : 'text-lg'}
            `}>
              {formatCurrency(offer.offerPrice)}
            </span>
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(offer.regularPrice)}
            </span>
          </div>
          
          {/* Savings Badge */}
          <div className="inline-flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-md text-xs font-medium border border-green-200">
            <TrendingUp className="w-3 h-3" />
            Save {formatCurrency(offer.regularPrice - offer.offerPrice)}
          </div>

          {viewMode !== 'compact' && (
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {offer.offerDetails}
            </p>
          )}
        </div>

        {/* Metrics Grid */}
        {viewMode !== 'compact' && (
          <div className={`grid gap-1.5 ${
            viewMode === 'list' ? 'grid-cols-4' : 'grid-cols-2'
          }`}>
            <div className="flex items-center gap-1.5 text-gray-600 bg-blue-50/50 px-2 py-1 rounded-md text-xs border border-blue-100">
              <Users className="w-3 h-3 text-blue-500" />
              <span className="font-medium">{offer.targetSales}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 bg-green-50/50 px-2 py-1 rounded-md text-xs border border-green-100">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="font-medium">{formatCurrency(offer.revenueTarget)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 bg-purple-50/50 px-2 py-1 rounded-md text-xs border border-purple-100">
              <Target className="w-3 h-3 text-purple-500" />
              <span className="font-medium truncate">{offer.leadSource}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 bg-orange-50/50 px-2 py-1 rounded-md text-xs border border-orange-100">
              <Clock className="w-3 h-3 text-orange-500" />
              <span className="font-medium">Active</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            className={`
              w-full bg-gradient-to-r from-indigo-50 to-purple-50
              hover:from-indigo-100 hover:to-purple-100
              text-indigo-700 border border-indigo-200
              hover:border-indigo-300 transition-all duration-200
              font-medium text-xs h-8
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
    </Card>
  );
};
