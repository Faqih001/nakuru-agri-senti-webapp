
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sprout, Camera, TrendingUp, Shield, Users, Zap, ArrowRight, Check, Star, Quote, Play, BarChart, Globe, Award, Crown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { DemoDashboard } from "@/components/DemoDashboard";

const Landing = () => {
  const features = [
    {
      icon: <Sprout className="w-8 h-8 text-green-600" />,
      title: "AI-Powered Crop Advisory",
      description: "Get personalized farming recommendations based on your specific location, soil type, weather patterns, and crop varieties grown in Nakuru County.",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
      benefits: ["Localized advice for Nakuru", "Weather-based recommendations", "Soil analysis integration", "Seasonal planning"]
    },
    {
      icon: <Camera className="w-8 h-8 text-blue-600" />,
      title: "Instant Disease Detection",
      description: "Upload photos of your crops for immediate AI diagnosis and treatment recommendations. Our system recognizes over 50 common crop diseases.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
      benefits: ["90%+ accuracy rate", "Instant diagnosis", "Treatment recommendations", "Prevention tips"]
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
      title: "Direct Market Access",
      description: "Connect directly with verified buyers, get real-time market prices, and secure better deals for your produce through our marketplace.",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
      benefits: ["Direct buyer connections", "Real-time pricing", "Secure transactions", "Logistics support"]
    }
  ];

  const stats = [
    { number: "2,500+", label: "Active Farmers", icon: <Users className="w-6 h-6" /> },
    { number: "12,000+", label: "Acres Managed", icon: <Globe className="w-6 h-6" /> },
    { number: "85%", label: "Yield Increase", icon: <BarChart className="w-6 h-6" /> },
    { number: "4.9/5", label: "User Rating", icon: <Star className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Mary Wanjiku",
      location: "Njoro, Nakuru",
      role: "Potato Farmer",
      quote: "AgriSenti helped me increase my potato yield by 40% this season. The disease detection feature saved my entire crop from late blight.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1597393922738-085ea04b5a07?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Peter Kiprotich",
      location: "Molo, Nakuru", 
      role: "Maize & Bean Farmer",
      quote: "The market linkage feature connected me directly with buyers in Nairobi. I now get 25% better prices for my maize and beans.",
      rating: 5,
      image: "/assets/images/peter.avif"
    },
    {
      name: "Grace Muthoni",
      location: "Naivasha, Nakuru",
      role: "Greenhouse Farmer",
      quote: "The AI advisory system recommended the perfect planting schedule. My tomato harvest timing is now perfectly aligned with market demand.",
      rating: 5,
      image: "/assets/images/grace.avif"
    }
  ];

  const benefits = [
    "Increase crop yields by up to 40%",
    "Reduce farming costs through precise inputs",
    "Get 25% better market prices through direct sales",
    "24/7 expert farming advice in English & Kiswahili",
    "Early disease detection and prevention",
    "Weather-based planting recommendations",
    "Soil health monitoring and improvement tips",
    "Access to modern farming techniques and equipment"
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      originalPrice: null,
      period: "Forever",
      description: "Perfect for small-scale farmers starting their smart farming journey",
      features: ["Basic crop advisory", "Weather updates", "Community access", "Basic market prices", "Email support"],
      highlighted: false,
      color: "gray",
      icon: <Sprout className="w-6 h-6" />,
      badge: null
    },
    {
      name: "Premium",
      price: "KES 500",
      originalPrice: "KES 800",
      period: "per month",
      description: "Complete smart farming solution for serious farmers",
      features: ["Everything in Basic", "Advanced AI advisory", "Disease detection", "Market linkage", "Priority support", "Yield analytics", "Custom recommendations", "SMS alerts"],
      highlighted: true,
      color: "green",
      icon: <Crown className="w-6 h-6" />,
      badge: "Most Popular"
    },
    {
      name: "Enterprise",
      price: "Custom",
      originalPrice: null,
      period: "pricing",
      description: "Tailored solutions for large farms and agricultural cooperatives",
      features: ["Everything in Premium", "Multiple farm management", "Team collaboration", "API access", "Custom integrations", "Dedicated support", "Training sessions", "On-site consultation"],
      highlighted: false,
      color: "purple",
      icon: <Sparkles className="w-6 h-6" />,
      badge: "Best Value"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-100 py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  🎉 Now serving 2,500+ farmers in Nakuru County
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-green-800 leading-tight">
                  Smart Farming for
                  <span className="text-green-600"> Modern </span>
                  Nakuru Farmers
                </h1>
                <p className="text-lg text-green-700 leading-relaxed">
                  Transform your farming with AI-powered crop advisory, instant disease detection, 
                  and direct market access. Join thousands of farmers increasing their yields and profits with AgriSenti.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto group">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 w-full sm:w-auto group">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg">
                      <div className="text-green-600 flex justify-center mb-2">
                        {stat.icon}
                      </div>
                      <div className="text-2xl font-bold text-green-800">{stat.number}</div>
                      <div className="text-sm text-green-600">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop" 
                alt="Modern farming with technology"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Live crop monitoring</span>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg">
                <div className="text-sm font-medium">+40% Yield</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Dashboard Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Experience Your Future Farm Dashboard
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how AgriSenti transforms farming data into actionable insights. 
              This interactive preview shows real farming scenarios from Nakuru County.
            </p>
          </div>
          <DemoDashboard />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and insights you need 
              to maximize your farming potential in Nakuru County.
            </p>
          </div>

          <div className="space-y-20">
            {features.map((feature, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="rounded-2xl shadow-lg w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with African people images */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Farmers Across Nakuru County
            </h2>
            <p className="text-lg text-gray-600">
              See how AgriSenti is transforming lives and livelihoods
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-green-600 mb-4" />
                  <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-green-600">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-green-100 text-green-800 border-green-200 text-sm px-4 py-2">
              Special Launch Pricing
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Start free and upgrade when you're ready to unlock the full potential of smart farming. 
              All plans include our core features with no hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative border-2 transition-all duration-300 hover:shadow-2xl ${
                plan.highlighted 
                  ? 'border-green-500 shadow-2xl scale-105 bg-gradient-to-br from-green-50 to-emerald-50' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}>
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className={`${
                      plan.highlighted ? 'bg-green-600 text-white' : 'bg-purple-600 text-white'
                    } px-4 py-1 text-sm font-semibold shadow-lg`}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className={`text-center pb-8 pt-8 ${plan.highlighted ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg' : ''}`}>
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    plan.highlighted ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    <div className={plan.highlighted ? 'text-white' : `text-${plan.color}-600`}>
                      {plan.icon}
                    </div>
                  </div>
                  
                  <CardTitle className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mb-4">
                    {plan.originalPrice && (
                      <div className={`text-sm line-through ${plan.highlighted ? 'text-green-200' : 'text-gray-500'} mb-1`}>
                        {plan.originalPrice}
                      </div>
                    )}
                    <div className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </div>
                    <div className={`text-sm ${plan.highlighted ? 'text-green-100' : 'text-gray-600'}`}>
                      {plan.period}
                    </div>
                  </div>
                  
                  <p className={`text-sm leading-relaxed ${plan.highlighted ? 'text-green-100' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                </CardHeader>
                
                <CardContent className="p-8 space-y-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to="/auth" className="block">
                    <Button className={`w-full py-3 text-base font-semibold transition-all duration-300 ${
                      plan.highlighted 
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl' 
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}>
                      {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  
                  {plan.highlighted && (
                    <div className="text-center">
                      <p className="text-sm text-green-600 font-medium">
                        ✨ 30-day money-back guarantee
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <p className="text-gray-600 mb-6">
              All plans include free migration assistance and 24/7 customer support
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-600" />
                <span>Instant activation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section with African people images */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/assets/images/African-farmer.avif"
                alt="African farmer proudly holding fresh produce from his farm"
                className="rounded-2xl shadow-lg"
              />
            </div>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Why Farmers Choose AgriSenti
                </h2>
                <p className="text-lg text-gray-600">
                  Join thousands of farmers who have transformed their farming 
                  practices and increased their profits with our smart solutions.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <div className="bg-green-600 p-1 rounded-full">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Link to="/auth">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 group">
                    Get Started Today
                    <Zap className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex justify-center">
              <Award className="w-16 h-16 text-green-200" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-xl text-green-100">
              Join AgriSenti today and start getting personalized farming advice, 
              disease detection, and better market access. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-green-100 hover:text-green-700 w-full sm:w-auto transition-colors"
                >
                  Start Your Free Trial
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-2 border-white text-black hover:bg-white/20 w-full sm:w-auto">
                  Contact Sales
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-8 text-green-200 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Join 2,500+ farmers</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Setup in 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
