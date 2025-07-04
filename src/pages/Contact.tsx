import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import GoogleMap from "@/components/GoogleMap";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you within 24 hours.",
        });
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Please try again or contact us directly at fakiiahmad001@gmail.com",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-green-600" />,
      title: "Phone",
      details: ["+254 741 140 250"],
      description: "Mon-Fri 8AM-6PM"
    },
    {
      icon: <Mail className="w-6 h-6 text-blue-600" />,
      title: "Email",
      details: ["fakiiahmad001@gmail.com"],
      description: "We respond within 24 hours"
    },
    {
      icon: <MapPin className="w-6 h-6 text-red-600" />,
      title: "Office",
      details: ["Nakuru Town", "Kenya"],
      description: "Visit us for in-person support"
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      title: "Hours",
      details: ["Mon-Fri: 8AM-6PM", "Sat: 9AM-2PM"],
      description: "Sunday: Closed"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-green-100 leading-relaxed">
              Have questions about AgriSenti? We're here to help you succeed. 
              Reach out and let's discuss how we can support your farming journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="space-y-8">
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-green-600 text-white">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <MessageSquare className="w-6 h-6" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Kimani"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+254 700 123 456"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select onValueChange={(value) => handleInputChange("subject", value)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="training">Training Request</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        placeholder="Tell us how we can help you..."
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Map Section - Now below the form */}
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gray-900 text-white">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <MapPin className="w-6 h-6" />
                    Find Us
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-lg text-gray-600 mb-6">
                    Visit our office in Nakuru for in-person consultations and support
                  </p>
                  <GoogleMap />
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <Card className="border-0 shadow-xl h-fit">
              <CardHeader className="bg-gray-900 text-white">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Mail className="w-6 h-6" />
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-lg text-gray-600 mb-8">
                  We're committed to providing exceptional support to our farming community. 
                  Choose the best way to reach us.
                </p>

                <div className="grid grid-cols-1 gap-6 mb-8">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-700 font-medium">{detail}</p>
                        ))}
                        <p className="text-gray-500 text-sm mt-1">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* WhatsApp Support */}
                <div className="bg-green-50 p-6 rounded-lg text-center">
                  <div className="bg-green-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Quick WhatsApp Support</h3>
                  <p className="text-gray-600 mb-4">
                    Get instant help through WhatsApp for urgent farming questions
                  </p>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => window.open('https://wa.me/254741140250', '_blank')}
                  >
                    Chat on WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="bg-green-600 p-3 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">
                Find answers to the most common questions about AgriSenti and our smart farming solutions
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-white border-0 shadow-lg rounded-lg">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 rounded-lg text-left">
                  Is AgriSenti free to use?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Yes, we offer a free tier with basic features including crop advisory and weather updates. Premium features like advanced disease detection, market price alerts, and direct buyer connections are available through our affordable subscription plans starting at KES 500 per month.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white border-0 shadow-lg rounded-lg">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 rounded-lg text-left">
                  How accurate is the crop advisory and disease detection?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Our AI is trained on extensive local data from Nakuru County and has been validated by agricultural experts from the University of Nairobi and KALRO. We maintain over 92% accuracy in crop recommendations and 89% accuracy in disease detection. Our system is continuously learning and improving with each interaction.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white border-0 shadow-lg rounded-lg">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 rounded-lg text-left">
                  Can I use AgriSenti offline?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Yes, our mobile app works offline for basic features including previously downloaded crop advice, disease identification guides, and farming calendar. New recommendations and real-time market prices require internet connection, but data syncs automatically when you reconnect.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-white border-0 shadow-lg rounded-lg">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 rounded-lg text-left">
                  Do you provide training for farmers?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Absolutely! We offer free training sessions in local communities, online tutorials in English and Kiswahili, and hands-on workshops. We also have partnerships with local agricultural extension officers to provide in-person support. Training covers app usage, modern farming techniques, and market access strategies.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-white border-0 shadow-lg rounded-lg">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 rounded-lg text-left">
                  What crops does AgriSenti support?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  We support all major crops grown in Nakuru County including maize, beans, potatoes, tomatoes, onions, cabbage, carrots, wheat, barley, and various fruits. We're continuously adding support for more crops based on farmer requests. Our system covers crop varieties, planting seasons, pest management, and harvest optimization.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-white border-0 shadow-lg rounded-lg">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 rounded-lg text-left">
                  How does the market linkage feature work?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Our market linkage connects you directly with verified buyers including supermarkets, hotels, and export companies. You can list your produce, get real-time price updates, and receive purchase orders. We facilitate secure transactions and provide logistics support for deliveries within Nakuru County.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="bg-white border-0 shadow-lg rounded-lg">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 rounded-lg text-left">
                  What languages are supported?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  AgriSenti is available in English and Kiswahili. We're working on adding Kikuyu and Kalenjin language support. All training materials, app interface, and customer support are available in both English and Kiswahili to ensure accessibility for all farmers in the region.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="bg-white border-0 shadow-lg rounded-lg">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 rounded-lg text-left">
                  How do I get started with AgriSenti?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Getting started is easy! Simply sign up on our website or download our mobile app, complete your farm profile with details about your location and crops, and start receiving personalized recommendations immediately. New users get a 30-day free trial of premium features and a welcome call from our support team.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9" className="bg-white border-0 shadow-lg rounded-lg">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 rounded-lg text-left">
                  Is my farm data secure and private?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  Yes, we take data security very seriously. All your farm data is encrypted and stored securely. We never share personal information with third parties without your consent. You own your data and can export or delete it anytime. We comply with international data protection standards and Kenyan privacy laws.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10" className="bg-white border-0 shadow-lg rounded-lg">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 rounded-lg text-left">
                  What support is available if I have technical issues?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  We provide comprehensive support through multiple channels: 24/7 WhatsApp support (+254 741 140 250), email support, phone support during business hours, and in-person assistance at our Nakuru office. We also have video tutorials, user guides, and community forums where farmers help each other.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
