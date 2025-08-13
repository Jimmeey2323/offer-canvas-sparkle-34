
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Percent, 
  Target, 
  DollarSign,
  Award,
  Calendar,
  Activity
} from 'lucide-react';

interface StatsCardsProps {
  totalRevenue: number;
  totalSales: number;
  avgDiscount: number;
  formatCurrency: (amount: number) => string;
}

export const StatsCards = ({ 
  totalRevenue, 
  totalSales, 
  avgDiscount, 
  formatCurrency 
}: StatsCardsProps) => {
  const stats = [
    {
      title: 'Total Revenue Target',
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
      description: 'Combined revenue from all offers',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50/60',
      borderColor: 'border-emerald-200/50'
    },
    {
      title: 'Target Sales Volume',
      value: totalSales.toString(),
      icon: Users,
      description: 'Total memberships to sell',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50/60',
      borderColor: 'border-blue-200/50'
    },
    {
      title: 'Average Discount',
      value: `${avgDiscount.toFixed(1)}%`,
      icon: Percent,
      description: 'Mean discount across offers',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50/60',
      borderColor: 'border-purple-200/50'
    },
    {
      title: 'Active Offers',
      value: '18',
      icon: Target,
      description: 'Total number of live offers',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50/60',
      borderColor: 'border-orange-200/50'
    }
  ];

  return (
    <div className="container mx-auto px-6 -mt-6 relative z-10 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={`
                ${stat.bgColor} ${stat.borderColor} hover:shadow-lg
                backdrop-blur-sm border shadow-lg
                transition-all duration-200 hover:scale-105
                p-6 relative overflow-hidden
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className={`w-32 h-32 ${stat.color.replace('text-', 'bg-')} rounded-full absolute -top-8 -right-8`}></div>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                  <Badge variant="outline" className={`${stat.bgColor} ${stat.borderColor} text-xs font-medium`}>
                    Live
                  </Badge>
                </div>

                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  {stat.title}
                </h3>

                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  {stat.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
