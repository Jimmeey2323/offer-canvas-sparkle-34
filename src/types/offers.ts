
export interface Offer {
  rank: number;
  offerName: string;
  offerDetails: string;
  regularPrice: number;
  offerPrice: number;
  discountPercent: number;
  targetSales: number;
  revenueTarget: number;
  crmRequirements: string;
  ctaMessage: string;
  leadSource: string;
  emailCreative: string;
  whatsappCreative: string;
  inStudioCreative: string;
  mitaliComments?: string;
  saachiComments?: string;
  finalRemarks?: string;
  isApproved?: boolean;
}

export interface OfferComment {
  id: string;
  offerId: number;
  author: 'mitali' | 'saachi';
  comment: string;
  timestamp: Date;
}

export type ViewMode = 'grid' | 'list' | 'compact' | 'masonry' | 'timeline' | 'kanban' | 'analytics' | 'priority';

export interface FilterOptions {
  searchTerm: string;
  minDiscount: number;
  maxPrice: number;
  leadSources: string[];
  sortBy: 'rank' | 'discount' | 'revenue' | 'price';
  sortOrder: 'asc' | 'desc';
  showApprovedOnly?: boolean;
}
