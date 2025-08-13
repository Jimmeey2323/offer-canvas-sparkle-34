
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ViewMode } from '@/types/offers';
import { Grid, List, LayoutGrid, Columns, Clock, Kanban, BarChart3, Layers } from 'lucide-react';

interface ViewControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sortBy: 'rank' | 'discount' | 'revenue' | 'price';
  onSortChange: (value: string) => void;
}

export const ViewControls = ({ viewMode, setViewMode, sortBy, onSortChange }: ViewControlsProps) => {
  const viewModes = [
    { mode: 'grid' as ViewMode, icon: Grid, label: 'Grid' },
    { mode: 'list' as ViewMode, icon: List, label: 'List' },
    { mode: 'compact' as ViewMode, icon: LayoutGrid, label: 'Compact' },
    { mode: 'masonry' as ViewMode, icon: Columns, label: 'Masonry' },
    { mode: 'timeline' as ViewMode, icon: Clock, label: 'Timeline' },
    { mode: 'kanban' as ViewMode, icon: Kanban, label: 'Kanban' },
    { mode: 'analytics' as ViewMode, icon: BarChart3, label: 'Analytics' },
    { mode: 'priority' as ViewMode, icon: Layers, label: 'Priority' },
  ];

  return (
    <div className="flex items-center gap-3">
      {/* View Mode Buttons */}
      <div className="flex items-center gap-1 bg-white/50 rounded-lg p-1">
        {viewModes.map(({ mode, icon: Icon, label }) => (
          <Button
            key={mode}
            variant={viewMode === mode ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode(mode)}
            className={`transition-all duration-200 ${
              viewMode === mode 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'hover:bg-white/70 text-gray-600'
            }`}
            title={label}
          >
            <Icon className="w-4 h-4" />
            <span className="sr-only">{label}</span>
          </Button>
        ))}
      </div>

      {/* Sort Dropdown */}
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-40 bg-white/50 border-gray-300/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200/50">
          <SelectItem value="rank">Priority Rank</SelectItem>
          <SelectItem value="discount">Discount %</SelectItem>
          <SelectItem value="revenue">Revenue Target</SelectItem>
          <SelectItem value="price">Price</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
