
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Offer } from '@/types/offers';
import { Save, MessageSquare, Mail, Phone, Store, Target, TrendingUp, Users, Edit3, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const offerSchema = z.object({
  offerName: z.string().min(1, "Offer name is required"),
  offerDetails: z.string().min(1, "Offer details are required"),
  regularPrice: z.number().min(0, "Regular price must be positive"),
  offerPrice: z.number().min(0, "Offer price must be positive"),
  discountPercent: z.number().min(0).max(100, "Discount must be between 0-100%"),
  targetSales: z.number().min(1, "Target sales must be at least 1"),
  revenueTarget: z.number().min(0, "Revenue target must be positive"),
  crmRequirements: z.string().min(1, "CRM requirements are required"),
  ctaMessage: z.string().min(1, "CTA message is required"),
  leadSource: z.string().min(1, "Lead source is required"),
  emailCreative: z.string().min(1, "Email creative is required"),
  whatsappCreative: z.string().min(1, "WhatsApp creative is required"),
  inStudioCreative: z.string().min(1, "In-studio creative is required"),
});

interface OfferModalProps {
  offer: Offer | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveComments: (offerId: number, mitaliComments: string, saachiComments: string, finalRemarks: string) => void;
  onApprovalToggle: (offerId: number, isApproved: boolean) => void;
  onSaveOffer: (offerId: number, updatedOffer: Partial<Offer>) => void;
  formatCurrency: (amount: number) => string;
}

export const OfferModal = ({ offer, isOpen, onClose, onSaveComments, onApprovalToggle, onSaveOffer, formatCurrency }: OfferModalProps) => {
  const [mitaliComments, setMitaliComments] = useState(offer?.mitaliComments || '');
  const [saachiComments, setSaachiComments] = useState(offer?.saachiComments || '');
  const [finalRemarks, setFinalRemarks] = useState(offer?.finalRemarks || '');
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof offerSchema>>({
    resolver: zodResolver(offerSchema),
    defaultValues: offer ? {
      offerName: offer.offerName,
      offerDetails: offer.offerDetails,
      regularPrice: offer.regularPrice,
      offerPrice: offer.offerPrice,
      discountPercent: offer.discountPercent,
      targetSales: offer.targetSales,
      revenueTarget: offer.revenueTarget,
      crmRequirements: offer.crmRequirements,
      ctaMessage: offer.ctaMessage,
      leadSource: offer.leadSource,
      emailCreative: offer.emailCreative,
      whatsappCreative: offer.whatsappCreative,
      inStudioCreative: offer.inStudioCreative,
    } : undefined,
  });

  if (!offer) return null;

  const handleSaveComments = () => {
    onSaveComments(offer.rank, mitaliComments, saachiComments, finalRemarks);
    toast.success('Comments saved successfully!');
  };

  const handleSaveOffer = (values: z.infer<typeof offerSchema>) => {
    onSaveOffer(offer.rank, values);
    setIsEditing(false);
    toast.success('Offer updated successfully!');
  };

  const formatCreativeContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <div key={index} className="mb-2">
        {line.includes(':') ? (
          <div>
            <span className="font-semibold text-primary">{line.split(':')[0]}:</span>
            <span className="ml-2 text-muted-foreground">{line.split(':').slice(1).join(':')}</span>
          </div>
        ) : (
          <div className="ml-4 text-muted-foreground">{line}</div>
        )}
      </div>
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 border-2 border-primary/20 shadow-2xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        
        <DialogHeader className="relative z-10 pb-6 border-b border-border/50">
          <DialogTitle className="text-3xl font-bold text-foreground flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-lg px-3 py-1">
                  #{offer.rank}
                </Badge>
                {isEditing ? (
                  <Form {...form}>
                    <FormField
                      control={form.control}
                      name="offerName"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input 
                              {...field} 
                              className="text-2xl font-bold border-primary/30 bg-background/50 backdrop-blur-sm"
                              placeholder="Offer name..."
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </Form>
                ) : (
                  <h2 className="text-2xl font-bold text-foreground">{offer.offerName}</h2>
                )}
                <Badge className="bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground">
                  {offer.discountPercent}% OFF
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Approve:</span>
                <Switch
                  checked={offer.isApproved || false}
                  onCheckedChange={(checked) => onApprovalToggle(offer.rank, checked)}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
              
              <Button
                onClick={() => {
                  if (isEditing) {
                    form.handleSubmit(handleSaveOffer)();
                  } else {
                    setIsEditing(true);
                  }
                }}
                variant={isEditing ? "default" : "outline"}
                className={isEditing ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {isEditing ? <Check className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                {isEditing ? 'Save Changes' : 'Edit Offer'}
              </Button>
              
              {isEditing && (
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    form.reset();
                  }}
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="relative z-10 overflow-y-auto flex-1">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted/50 backdrop-blur-sm border border-border/50 rounded-xl p-1 mb-6">
              <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:shadow-md">Overview</TabsTrigger>
              <TabsTrigger value="marketing" className="data-[state=active]:bg-background data-[state=active]:shadow-md">Marketing</TabsTrigger>
              <TabsTrigger value="comments" className="data-[state=active]:bg-background data-[state=active]:shadow-md">Comments</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-background data-[state=active]:shadow-md">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <Form {...form}>
                {/* Pricing Section */}
                <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 shadow-lg backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Pricing & Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="offerPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-muted-foreground">Offer Price</FormLabel>
                              {isEditing ? (
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    className="text-2xl font-bold text-primary bg-background/70"
                                  />
                                </FormControl>
                              ) : (
                                <p className="text-4xl font-bold text-primary">{formatCurrency(offer.offerPrice)}</p>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="regularPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-muted-foreground">Regular Price</FormLabel>
                              {isEditing ? (
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    className="text-xl bg-background/70"
                                  />
                                </FormControl>
                              ) : (
                                <p className="text-2xl text-muted-foreground line-through">{formatCurrency(offer.regularPrice)}</p>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="offerDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-muted-foreground">Offer Details</FormLabel>
                          {isEditing ? (
                            <FormControl>
                              <Textarea 
                                {...field} 
                                className="min-h-20 bg-background/70"
                                placeholder="Detailed description of the offer..."
                              />
                            </FormControl>
                          ) : (
                            <p className="text-foreground leading-relaxed bg-background/30 p-4 rounded-lg border border-border/50">{offer.offerDetails}</p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Targets Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-green-600" />
                        <h4 className="font-medium text-foreground">Target Sales</h4>
                      </div>
                      <FormField
                        control={form.control}
                        name="targetSales"
                        render={({ field }) => (
                          <FormItem>
                            {isEditing ? (
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="text-2xl font-bold text-green-600 bg-background/70"
                                />
                              </FormControl>
                            ) : (
                              <p className="text-3xl font-bold text-green-600">{offer.targetSales}</p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200/50 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <h4 className="font-medium text-foreground">Revenue Target</h4>
                      </div>
                      <FormField
                        control={form.control}
                        name="revenueTarget"
                        render={({ field }) => (
                          <FormItem>
                            {isEditing ? (
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="text-lg font-bold text-blue-600 bg-background/70"
                                />
                              </FormControl>
                            ) : (
                              <p className="text-xl font-bold text-blue-600">{formatCurrency(offer.revenueTarget)}</p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200/50 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Target className="w-5 h-5 text-purple-600" />
                        <h4 className="font-medium text-foreground">Lead Source</h4>
                      </div>
                      <FormField
                        control={form.control}
                        name="leadSource"
                        render={({ field }) => (
                          <FormItem>
                            {isEditing ? (
                              <FormControl>
                                <Input 
                                  {...field}
                                  className="text-sm font-medium text-purple-600 bg-background/70"
                                  placeholder="Lead source..."
                                />
                              </FormControl>
                            ) : (
                              <p className="text-sm font-medium text-purple-600">{offer.leadSource}</p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* CRM Requirements */}
                <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground">CRM Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="crmRequirements"
                      render={({ field }) => (
                        <FormItem>
                          {isEditing ? (
                            <FormControl>
                              <Textarea 
                                {...field}
                                className="min-h-20 bg-background/70"
                                placeholder="CRM requirements and setup instructions..."
                              />
                            </FormControl>
                          ) : (
                            <p className="text-foreground bg-background/30 p-4 rounded-lg border border-border/50">{offer.crmRequirements}</p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </Form>
            </TabsContent>

            <TabsContent value="marketing" className="space-y-8">
              <Form {...form}>
                {/* CTA Message */}
                <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground">Call to Action</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="ctaMessage"
                      render={({ field }) => (
                        <FormItem>
                          {isEditing ? (
                            <FormControl>
                              <Textarea 
                                {...field}
                                className="text-xl font-medium text-primary bg-background/70 italic min-h-16"
                                placeholder="Compelling call to action message..."
                              />
                            </FormControl>
                          ) : (
                            <p className="text-2xl font-medium text-primary italic bg-background/30 p-4 rounded-lg border border-border/50">"{offer.ctaMessage}"</p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Marketing Creatives */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200/50 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-600" />
                        Email Creative
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="emailCreative"
                        render={({ field }) => (
                          <FormItem>
                            {isEditing ? (
                              <FormControl>
                                <Textarea 
                                  {...field}
                                  className="min-h-32 bg-background/70 text-sm"
                                  placeholder="Email subject, hero, body, CTA..."
                                />
                              </FormControl>
                            ) : (
                              <div className="text-sm bg-background/30 p-4 rounded-lg border border-border/50">
                                {formatCreativeContent(offer.emailCreative)}
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Phone className="w-5 h-5 text-green-600" />
                        WhatsApp Creative
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="whatsappCreative"
                        render={({ field }) => (
                          <FormItem>
                            {isEditing ? (
                              <FormControl>
                                <Textarea 
                                  {...field}
                                  className="min-h-32 bg-background/70 text-sm"
                                  placeholder="WhatsApp message content..."
                                />
                              </FormControl>
                            ) : (
                              <p className="text-foreground text-sm leading-relaxed bg-background/30 p-4 rounded-lg border border-border/50">{offer.whatsappCreative}</p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200/50 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Store className="w-5 h-5 text-purple-600" />
                        In-Studio Creative
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="inStudioCreative"
                        render={({ field }) => (
                          <FormItem>
                            {isEditing ? (
                              <FormControl>
                                <Textarea 
                                  {...field}
                                  className="min-h-32 bg-background/70 text-sm"
                                  placeholder="In-studio displays and materials..."
                                />
                              </FormControl>
                            ) : (
                              <div className="text-sm bg-background/30 p-4 rounded-lg border border-border/50">
                                {formatCreativeContent(offer.inStudioCreative)}
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
              </Form>
            </TabsContent>

            <TabsContent value="comments" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Mitali's Comments */}
                <Card className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border-pink-200/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-pink-600" />
                      Mitali's Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Add Mitali's comments here..."
                      value={mitaliComments}
                      onChange={(e) => setMitaliComments(e.target.value)}
                      className="min-h-40 bg-background/70 border-pink-200/50 focus:border-pink-400 backdrop-blur-sm"
                    />
                  </CardContent>
                </Card>

                {/* Saachi's Comments */}
                <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border-cyan-200/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-cyan-600" />
                      Saachi's Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Add Saachi's comments here..."
                      value={saachiComments}
                      onChange={(e) => setSaachiComments(e.target.value)}
                      className="min-h-40 bg-background/70 border-cyan-200/50 focus:border-cyan-400 backdrop-blur-sm"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Final Remarks */}
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-foreground">Final Remarks</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Add final remarks and decisions here..."
                    value={finalRemarks}
                    onChange={(e) => setFinalRemarks(e.target.value)}
                    className="min-h-32 bg-background/70 border-primary/30 focus:border-primary/50 backdrop-blur-sm"
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveComments} 
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Comments
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-8">
              {/* Progress Tracking */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground">Revenue Projection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-background/30 rounded-lg border border-border/50">
                        <span className="text-muted-foreground">Target Revenue:</span>
                        <span className="text-green-600 font-bold text-lg">{formatCurrency(offer.revenueTarget)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-background/30 rounded-lg border border-border/50">
                        <span className="text-muted-foreground">Per Sale:</span>
                        <span className="text-foreground font-medium">{formatCurrency(offer.offerPrice)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-background/30 rounded-lg border border-border/50">
                        <span className="text-muted-foreground">Target Units:</span>
                        <span className="text-blue-600 font-bold text-lg">{offer.targetSales}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground">Offer Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-background/30 rounded-lg border border-border/50">
                        <span className="text-muted-foreground">Discount:</span>
                        <span className="text-red-600 font-bold text-lg">{offer.discountPercent}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-background/30 rounded-lg border border-border/50">
                        <span className="text-muted-foreground">Savings:</span>
                        <span className="text-primary font-bold text-lg">
                          {formatCurrency(offer.regularPrice - offer.offerPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-background/30 rounded-lg border border-border/50">
                        <span className="text-muted-foreground">Priority Rank:</span>
                        <span className="text-pink-600 font-bold text-lg">#{offer.rank}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
