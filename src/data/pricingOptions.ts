export interface PricingTier {
  duration: string;
  preTax: number;
  afterTax: number;
  months: number;
}

export interface PricingPackage {
  name: string;
  description: string;
  tiers: PricingTier[];
}

export const pricingPackages: PricingPackage[] = [
  {
    name: "All In Package",
    description: "Strength + Spin + Barre",
    tiers: [
      { duration: "2 Week", preTax: 11333, afterTax: 13373, months: 0.5 },
      { duration: "1 Month", preTax: 20333, afterTax: 23993, months: 1 },
      { duration: "3 Month", preTax: 58000, afterTax: 68440, months: 3 },
      { duration: "6 Month", preTax: 114000, afterTax: 134520, months: 6 },
      { duration: "Annual", preTax: 220000, afterTax: 259600, months: 12 },
    ]
  },
  {
    name: "Single Format",
    description: "Either Spin OR Barre",
    tiers: [
      { duration: "2 Week", preTax: 8500, afterTax: 10030, months: 0.5 },
      { duration: "1 Month", preTax: 15250, afterTax: 17995, months: 1 },
      { duration: "3 Month", preTax: 43500, afterTax: 51330, months: 3 },
      { duration: "6 Month", preTax: 85500, afterTax: 100890, months: 6 },
      { duration: "Annual", preTax: 165000, afterTax: 194700, months: 12 },
    ]
  }
];