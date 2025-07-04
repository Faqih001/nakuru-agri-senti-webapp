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
  BarChart3, 
  Cloud,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      id: "ai-crop-assistant",
      icon: Sprout,
      title: "AI Crop Assistant",
      description: "Get personalized farming advice powered by advanced AI algorithms",
      image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop",
      benefits: ["Personalized recommendations", "Weather-based insights", "Crop optimization"],
      gradient: "from-green-500 to-emerald-600"
    },
    {
      id: "disease-detection",
      icon: Camera,
      title: "Disease Detection",
      description: "Instant plant disease diagnosis using computer vision technology",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
      benefits: ["Real-time scanning", "99% accuracy", "Treatment suggestions"],
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      id: "market-intelligence",
      icon: TrendingUp,
      title: "Market Intelligence",
      description: "Access real-time market prices and connect with verified buyers",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      benefits: ["Live price updates", "Buyer connections", "Market trends"],
      gradient: "from-orange-500 to-red-600"
    },
    {
      id: "risk-management",
      icon: Shield,
      title: "Risk Management",
      description: "Protect your investments with comprehensive risk assessment tools",
      image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&h=600&fit=crop",
      benefits: ["Weather alerts", "Insurance guidance", "Risk analytics"],
      gradient: "from-purple-500 to-pink-600"
    },
    {
      id: "mobile-first",
      icon: Smartphone,
      title: "Mobile First",
      description: "Complete farming solutions accessible from your smartphone",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
      benefits: ["Offline capabilities", "GPS integration", "Easy interface"],
      gradient: "from-indigo-500 to-blue-600"
    },
    {
      id: "community-support",
      icon: Users,
      title: "Community Support",
      description: "Connect with fellow farmers and agricultural experts",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop",
      benefits: ["Expert advice", "Farmer networks", "Knowledge sharing"],
      gradient: "from-teal-500 to-green-600"
    }
  ];

  const stats = [
    { label: "Active Farmers", value: "50,000+" },
    { label: "Crops Monitored", value: "1M+" },
    { label: "Accuracy Rate", value: "99.2%" },
    { label: "Counties Covered", value: "47" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 lg:py-24 px-3 sm:px-4 lg:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-3 md:mb-4 bg-green-100 text-green-800 border-green-200 text-sm px-3 py-1">
              Latest Technology
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent mb-4 md:mb-6 leading-tight">
              Revolutionary Farming Features
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Discover how AgriSenti is transforming agriculture in Kenya with cutting-edge technology, 
              AI-powered insights, and comprehensive farming solutions.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-12 md:mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/70 backdrop-blur-sm p-4 md:p-6 rounded-lg shadow-sm">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-1 md:mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-20 lg:py-24 px-3 sm:px-4 lg:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20`} />
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <div className={`bg-gradient-to-br ${feature.gradient} p-2 sm:p-3 rounded-xl shadow-lg`}>
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-3 md:pb-4 p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl font-bold text-gray-800">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0 p-4 md:p-6">
                  <div className="space-y-2 mb-4 md:mb-6">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm md:text-base text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className="w-full group/btn bg-gray-900 hover:bg-gray-800 text-sm md:text-base"
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

      {/* Technology Showcase */}
      <section className="py-16 md:py-20 lg:py-24 px-3 sm:px-4 lg:px-6 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6 leading-tight">
              Powered by Advanced Technology
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Our platform combines the latest in AI, machine learning, and agricultural science 
              to deliver unparalleled farming solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="text-center p-6 md:p-8 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-shadow">
              <div className="bg-blue-600 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">Data Analytics</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Advanced analytics engine processing millions of data points for actionable insights.
              </p>
            </Card>

            <Card className="text-center p-6 md:p-8 border-0 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-shadow">
              <div className="bg-green-600 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Sprout className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">AI Models</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Custom-trained AI models specifically designed for Kenyan agricultural conditions.
              </p>
            </Card>

            <Card className="text-center p-6 md:p-8 border-0 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-shadow md:col-span-1 col-span-1 md:col-start-auto mx-auto w-full max-w-md md:max-w-none">
              <div className="bg-purple-600 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Cloud className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">Cloud Infrastructure</h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                Reliable, scalable cloud infrastructure ensuring 99.9% uptime for our services.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 lg:py-24 px-3 sm:px-4 lg:px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl md:rounded-3xl p-8 md:p-12 text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 leading-tight">
              Ready to Transform Your Farm?
            </h2>
            <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 opacity-90 leading-relaxed">
              Join thousands of farmers already using AgriSenti to increase yields, 
              reduce costs, and build sustainable farming practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-green-100 px-6 md:px-8 transition-colors w-full sm:w-auto"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-6 md:px-8 w-full sm:w-auto">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
