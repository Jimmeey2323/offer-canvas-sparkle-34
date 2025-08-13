
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Download, FileText, Table, FileSpreadsheet, FileImage } from 'lucide-react';
import { Offer } from '@/types/offers';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  approvedOffers: Offer[];
  formatCurrency: (amount: number) => string;
}

export const ExportModal = ({ isOpen, onClose, approvedOffers, formatCurrency }: ExportModalProps) => {
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['csv']);
  const [includeDetails, setIncludeDetails] = useState(true);

  if (!isOpen) return null;

  const exportFormats = [
    { id: 'csv', name: 'CSV', icon: Table, description: 'Comma-separated values' },
    { id: 'json', name: 'JSON', icon: FileText, description: 'JavaScript Object Notation' },
    { id: 'excel', name: 'Excel', icon: FileSpreadsheet, description: 'Excel spreadsheet' },
    { id: 'pdf', name: 'PDF', icon: FileImage, description: 'Portable Document Format' }
  ];

  const handleFormatToggle = (formatId: string) => {
    setSelectedFormats(prev => 
      prev.includes(formatId) 
        ? prev.filter(id => id !== formatId)
        : [...prev, formatId]
    );
  };

  const generateCSV = () => {
    const headers = [
      'Rank', 'Offer Name', 'Regular Price', 'Offer Price', 'Discount %', 
      'Target Sales', 'Revenue Target', 'Lead Source', 'CTA Message'
    ];
    
    if (includeDetails) {
      headers.push('Offer Details', 'CRM Requirements');
    }

    const csvContent = [
      headers.join(','),
      ...approvedOffers.map(offer => {
        const row = [
          offer.rank,
          `"${offer.offerName}"`,
          offer.regularPrice,
          offer.offerPrice,
          offer.discountPercent,
          offer.targetSales,
          offer.revenueTarget,
          `"${offer.leadSource}"`,
          `"${offer.ctaMessage}"`
        ];
        
        if (includeDetails) {
          row.push(`"${offer.offerDetails}"`, `"${offer.crmRequirements}"`);
        }
        
        return row.join(',');
      })
    ].join('\n');

    return csvContent;
  };

  const generateJSON = () => {
    const data = approvedOffers.map(offer => ({
      rank: offer.rank,
      offerName: offer.offerName,
      regularPrice: offer.regularPrice,
      offerPrice: offer.offerPrice,
      discountPercent: offer.discountPercent,
      targetSales: offer.targetSales,
      revenueTarget: offer.revenueTarget,
      leadSource: offer.leadSource,
      ctaMessage: offer.ctaMessage,
      ...(includeDetails && {
        offerDetails: offer.offerDetails,
        crmRequirements: offer.crmRequirements
      })
    }));

    return JSON.stringify(data, null, 2);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    
    selectedFormats.forEach(format => {
      switch (format) {
        case 'csv':
          downloadFile(
            generateCSV(), 
            `approved-offers-${timestamp}.csv`, 
            'text/csv'
          );
          break;
        case 'json':
          downloadFile(
            generateJSON(), 
            `approved-offers-${timestamp}.json`, 
            'application/json'
          );
          break;
        default:
          // For Excel and PDF, we'd need additional libraries
          console.log(`${format} export would be implemented with additional libraries`);
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Export Approved Offers</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-green-500 text-white">
                {approvedOffers.length} Approved
              </Badge>
              <span className="text-sm text-green-700">offers ready for export</span>
            </div>
            <p className="text-xs text-green-600">
              Total Revenue: {formatCurrency(approvedOffers.reduce((sum, offer) => sum + offer.revenueTarget, 0))}
            </p>
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Export Formats:</h4>
            {exportFormats.map(format => {
              const Icon = format.icon;
              return (
                <div key={format.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={format.id}
                    checked={selectedFormats.includes(format.id)}
                    onCheckedChange={() => handleFormatToggle(format.id)}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <Icon className="w-4 h-4 text-gray-600" />
                    <div>
                      <span className="text-sm font-medium">{format.name}</span>
                      <p className="text-xs text-gray-500">{format.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Options */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Options:</h4>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="include-details"
                checked={includeDetails}
                onCheckedChange={(checked) => setIncludeDetails(checked === true)}
              />
              <label htmlFor="include-details" className="text-sm">
                Include detailed descriptions and CRM requirements
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleExport} 
              disabled={selectedFormats.length === 0}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
