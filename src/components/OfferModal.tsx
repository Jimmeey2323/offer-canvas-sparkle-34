import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Offer } from '@/types/offers';
import { Save, MessageSquare, Mail, Phone, Store, Target, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';

interface OfferModalProps {
  offer: Offer | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveComments: (offerId: number, mitaliComments: string, saachiComments: string, finalRemarks: string) => void;
  formatCurrency: (amount: number) => string;
}

export const OfferModal = ({ offer, isOpen, onClose, onSaveComments, formatCurrency }: OfferModalProps) => {
  const [mitaliComments, setMitaliComments] = useState(offer?.mitaliComments || '');
  const [saachiComments, setSaachiComments] = useState(offer?.saachiComments || '');
  const [finalRemarks, setFinalRemarks] = useState(offer?.finalRemarks || '');

  if (!offer) return null;

  const handleSave = () => {
    onSaveComments(offer.rank, mitaliComments, saachiComments, finalRemarks);
    toast.success('Comments saved successfully!');
  };

  const formatCreativeContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <div key={index} className="mb-2">
        {line.includes(':') ? (
          <div>
            <span className="font-semibold text-indigo-600">{line.split(':')[0]}:</span>
            <span className="ml-2 text-gray-700">{line.split(':').slice(1).join(':')}</span>
          </div>
        ) : (
          <div className="ml-4 text-gray-600">{line}</div>
        )}
      </div>
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              #{offer.rank}
            </Badge>
            {offer.offerName}
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse">
              {offer.discountPercent}% OFF
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100/80">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Pricing Section */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Pricing & Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Offer Price</h4>
                    <p className="text-3xl font-bold text-indigo-600">{formatCurrency(offer.offerPrice)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600">Regular Price</h4>
                    <p className="text-xl text-gray-500 line-through">{formatCurrency(offer.regularPrice)}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Offer Details</h4>
                  <p className="text-gray-700 leading-relaxed">{offer.offerDetails}</p>
                </div>
              </CardContent>
            </Card>

            {/* Targets Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-gray-800">Target Sales</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{offer.targetSales}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-gray-800">Revenue Target</h4>
                  </div>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(offer.revenueTarget)}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    <h4 className="font-medium text-gray-800">Lead Source</h4>
                  </div>
                  <p className="text-sm font-medium text-purple-600">{offer.leadSource}</p>
                </CardContent>
              </Card>
            </div>

            {/* CRM Requirements */}
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800">CRM Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{offer.crmRequirements}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing" className="space-y-6">
            {/* CTA Message */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800">Call to Action</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-medium text-indigo-600 italic">"{offer.ctaMessage}"</p>
              </CardContent>
            </Card>

            {/* Marketing Creatives */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email Creative
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  {formatCreativeContent(offer.emailCreative)}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    WhatsApp Creative
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm leading-relaxed">{offer.whatsappCreative}</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <Store className="w-5 h-5" />
                    In-Studio Creative
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  {formatCreativeContent(offer.inStudioCreative)}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mitali's Comments */}
              <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Mitali's Comments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Add Mitali's comments here..."
                    value={mitaliComments}
                    onChange={(e) => setMitaliComments(e.target.value)}
                    className="min-h-32 bg-white/60 border-pink-200 focus:border-pink-400"
                  />
                </CardContent>
              </Card>

              {/* Saachi's Comments */}
              <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Saachi's Comments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Add Saachi's comments here..."
                    value={saachiComments}
                    onChange={(e) => setSaachiComments(e.target.value)}
                    className="min-h-32 bg-white/60 border-cyan-200 focus:border-cyan-400"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Final Remarks */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800">Final Remarks</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add final remarks and decisions here..."
                  value={finalRemarks}
                  onChange={(e) => setFinalRemarks(e.target.value)}
                  className="min-h-24 bg-white/60 border-indigo-200 focus:border-indigo-400"
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                onClick={handleSave} 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Comments
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Progress Tracking */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-800">Revenue Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target Revenue:</span>
                      <span className="text-green-600 font-bold">{formatCurrency(offer.revenueTarget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Per Sale:</span>
                      <span className="text-gray-700">{formatCurrency(offer.offerPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target Units:</span>
                      <span className="text-blue-600 font-bold">{offer.targetSales}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-800">Offer Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount:</span>
                      <span className="text-red-600 font-bold">{offer.discountPercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Savings:</span>
                      <span className="text-indigo-600 font-bold">
                        {formatCurrency(offer.regularPrice - offer.offerPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority Rank:</span>
                      <span className="text-pink-600 font-bold">#{offer.rank}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
