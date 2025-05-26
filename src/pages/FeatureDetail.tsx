import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sprout, 
  Camera, 
  TrendingUp, 
  Shield, 
  Smartphone, 
  Users, 
  ArrowLeft,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const FeatureDetail = () => {
  const { featureId } = useParams();
  const navigate = useNavigate();

  const allFeatures = [
    {
      id: "ai-crop-assistant",
      icon: Sprout,
      title: "AI Crop Assistant",
      description: "Get personalized farming advice powered by advanced AI algorithms",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop",
      benefits: ["Personalized recommendations", "Weather-based insights", "Crop optimization"],
      gradient: "from-green-500 to-emerald-600",
      detailedDescription: "Our AI Crop Assistant leverages machine learning algorithms trained on decades of agricultural data from Nakuru County. It analyzes your specific farm conditions, weather patterns, soil type, and crop history to provide personalized recommendations that can increase your yield by up to 40%.",
      features: [
        "Real-time weather integration for optimal planting and harvesting times",
        "Soil analysis recommendations based on local conditions",
        "Crop rotation suggestions to maintain soil health",
        "Fertilizer and irrigation optimization",
        "Seasonal planning and calendar management",
        "Integration with local agricultural extension services"
      ]
    },
    {
      id: "disease-detection",
      icon: Camera,
      title: "Disease Detection",
      description: "Instant plant disease diagnosis using computer vision technology",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
      benefits: ["Real-time scanning", "99% accuracy", "Treatment suggestions"],
      gradient: "from-blue-500 to-cyan-600",
      detailedDescription: "Our advanced computer vision system can identify over 50 common crop diseases within seconds. Simply take a photo of the affected plant, and our AI will provide instant diagnosis along with treatment recommendations and prevention strategies.",
      features: [
        "Instant photo-based disease identification",
        "Treatment recommendations with local availability",
        "Prevention strategies and timing",
        "Disease progression tracking",
        "Integration with local agro-vet shops",
        "Offline disease reference guide"
      ]
    },
    {
      id: "market-intelligence",
      icon: TrendingUp,
      title: "Market Intelligence",
      description: "Access real-time market prices and connect with verified buyers",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      benefits: ["Live price updates", "Buyer connections", "Market trends"],
      gradient: "from-orange-500 to-red-600",
      detailedDescription: "Connect directly with verified buyers across Kenya and get real-time market prices for your produce. Our platform eliminates middlemen, ensuring you get the best prices while maintaining quality standards that buyers trust.",
      features: [
        "Real-time price updates from major markets",
        "Direct buyer connections and negotiations",
        "Quality certification and grading",
        "Logistics and transportation coordination",
        "Payment security and escrow services",
        "Market trend analysis and forecasting"
      ]
    },
    {
      id: "risk-management",
      icon: Shield,
      title: "Risk Management",
      description: "Protect your investments with comprehensive risk assessment tools",
      image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&h=600&fit=crop",
      benefits: ["Weather alerts", "Insurance guidance", "Risk analytics"],
      gradient: "from-purple-500 to-pink-600",
      detailedDescription: "Comprehensive risk management tools help you protect your farming investments. Get early warnings about weather changes, access to insurance products, and detailed risk analytics to make informed decisions about your farming operations.",
      features: [
        "Early weather warning systems",
        "Crop insurance guidance and applications",
        "Risk assessment and mitigation strategies",
        "Financial planning and budgeting tools",
        "Emergency response protocols",
        "Integration with government support programs"
      ]
    },
    {
      id: "mobile-first",
      icon: Smartphone,
      title: "Mobile First",
      description: "Complete farming solutions accessible from your smartphone",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
      benefits: ["Offline capabilities", "GPS integration", "Easy interface"],
      gradient: "from-indigo-500 to-blue-600",
      detailedDescription: "Our mobile-first platform ensures you can access all farming tools and information directly from your smartphone, even in areas with limited internet connectivity. The intuitive interface is designed specifically for farmers in the field.",
      features: [
        "Offline functionality for core features",
        "GPS integration for field mapping",
        "Voice input in English and Kiswahili",
        "Simple, farmer-friendly interface",
        "Low data usage optimization",
        "SMS backup for critical alerts"
      ]
    },
    {
      id: "community-support",
      icon: Users,
      title: "Community Support",
      description: "Connect with fellow farmers and agricultural experts",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop",
      benefits: ["Expert advice", "Farmer networks", "Knowledge sharing"],
      gradient: "from-teal-500 to-green-600",
      detailedDescription: "Join a thriving community of farmers, agricultural experts, and extension officers. Share experiences, get advice, and learn from others who understand the unique challenges of farming in Nakuru County.",
      features: [
        "Farmer discussion forums and groups",
        "Expert Q&A sessions",
        "Knowledge sharing and best practices",
        "Local farming events and workshops",
        "Mentorship programs for new farmers",
        "Success story sharing and inspiration"
      ]
    }
  ];

  const currentFeature = allFeatures.find(f => f.id === featureId);
  const otherFeatures = allFeatures.filter(f => f.id !== featureId);

  if (!currentFeature) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Feature not found</h1>
          <Button onClick={() => navigate('/features')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Features
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10" />
        <div className="container mx-auto max-w-6xl relative">
          <Button 
            onClick={() => navigate('/features')} 
            variant="outline" 
            className="mb-8 hover:bg-green-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Features
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`bg-gradient-to-br ${currentFeature.gradient} p-4 rounded-xl shadow-lg`}>
                  <currentFeature.icon className="w-8 h-8 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Premium Feature
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent">
                {currentFeature.title}
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                {currentFeature.detailedDescription}
              </p>
              
              <div className="grid grid-cols-1 gap-3">
                {currentFeature.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={currentFeature.image} 
                alt={currentFeature.title}
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${currentFeature.gradient} opacity-20 rounded-2xl`} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Detail Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Features & Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentFeature.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Other Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Other Features
            </h2>
            <p className="text-lg text-gray-600">
              Discover more ways AgriSenti can transform your farming experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20`} />
                  <div className="absolute top-4 left-4">
                    <div className={`bg-gradient-to-br ${feature.gradient} p-3 rounded-xl shadow-lg`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-800">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-6">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full group/btn bg-gray-900 hover:bg-gray-800"
                    onClick={() => navigate(`/features/${feature.id}`)}
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto max-w-4xl text-center px-4">
          <div className="text-white space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Get Started with {currentFeature.title}?
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of farmers already using AgriSenti to increase yields, 
              reduce costs, and build sustainable farming practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeatureDetail;
