import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, PhoneCall, HelpCircle, MessageCircle, Video, FileText, ExternalLink } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export const Help = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("tutorials");
  
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "tutorials" || tab === "support") {
      setActiveTab(tab);
    }
  }, [searchParams]);
  return (
    <div className="container mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Help & Resources</h1>
        <p className="text-gray-500 mt-2">Get help with AgriSenti dashboard and features</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="tutorials" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Tutorials</span>
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4" />
            <span>Support</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tutorials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-md">
                    <Video className="h-5 w-5 text-green-600" />
                  </div>
                  Getting Started
                </CardTitle>
                <CardDescription>Learn the basics of AgriSenti platform</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">This guide walks you through the key features and navigation of the AgriSenti platform.</p>
                <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-3">
                  <Video className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-xs text-gray-400">Duration: 5 minutes</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Watch Video
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  Crop Management
                </CardTitle>
                <CardDescription>How to track and manage your crops</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">Learn how to add, edit, and manage your crop data efficiently.</p>
                <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-3">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-xs text-gray-400">Updated: May 25, 2025</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Guide
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-md">
                    <HelpCircle className="h-5 w-5 text-purple-600" />
                  </div>
                  Disease Detection
                </CardTitle>
                <CardDescription>How to use AI-powered disease detection</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">Learn how to scan your plants for diseases and get treatment recommendations.</p>
                <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-3">
                  <Video className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-xs text-gray-400">Duration: 3 minutes</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Watch Video
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-md">
                    <FileText className="h-5 w-5 text-orange-600" />
                  </div>
                  Market Intelligence
                </CardTitle>
                <CardDescription>Making sense of market data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">Understand crop pricing trends and set alerts for price changes.</p>
                <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-3">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-xs text-gray-400">Updated: May 28, 2025</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Guide
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Get in touch with our support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Live Chat Support</h3>
                  <p className="text-sm text-gray-500 mt-1">Chat with our team for quick answers to your questions.</p>
                  <Button variant="outline" className="mt-3 text-green-600 bg-green-50 border-green-100 hover:bg-green-100">
                    Start Chat
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <PhoneCall className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Phone Support</h3>
                  <p className="text-sm text-gray-500 mt-1">Call our dedicated support line (Mon-Fri, 9AM-5PM).</p>
                  <Button variant="outline" className="mt-3 text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100">
                    +254 712 345678
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="bg-purple-100 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Submit a Ticket</h3>
                  <p className="text-sm text-gray-500 mt-1">File a detailed support request for complex issues.</p>
                  <Button variant="outline" className="mt-3 text-purple-600 bg-purple-50 border-purple-100 hover:bg-purple-100">
                    Create Ticket
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start border-t pt-4">
              <h4 className="font-medium text-sm">Support Hours</h4>
              <p className="text-xs text-gray-500 mt-1">Our support team is available Monday-Friday, 9:00 AM - 5:00 PM East African Time.</p>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border border-gray-200 rounded-lg">
                <h3 className="font-medium">How do I update my farm location?</h3>
                <p className="text-sm text-gray-600 mt-2">Go to Settings &gt; Farm Profile &gt; Location and use the map to pinpoint your location.</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <h3 className="font-medium">Why can't I see weather data?</h3>
                <p className="text-sm text-gray-600 mt-2">Weather data requires a valid farm location. Update your location in Farm Profile settings.</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <h3 className="font-medium">How accurate is the disease detection?</h3>
                <p className="text-sm text-gray-600 mt-2">Our AI model is trained on thousands of images with 90%+ accuracy. Take clear photos in good lighting for best results.</p>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg">
                <h3 className="font-medium">Can I use AgriSenti offline?</h3>
                <p className="text-sm text-gray-600 mt-2">Some features work offline, but synchronization and AI features require an internet connection.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All FAQs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Help;
