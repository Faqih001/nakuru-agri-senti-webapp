
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sprout, Camera, TrendingUp, Shield, Users, Zap, ArrowRight, Check, Star, Quote, Play, BarChart, Globe, Award, Crown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { DemoDashboard } from "@/components/DemoDashboard";
import { useState } from "react";

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

  // State for demo video modal
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Modal component for video
  const DemoVideoModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-2 sm:mx-4 p-2 sm:p-4 md:p-6 relative flex flex-col items-center"
      >
        <button
          className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-500 hover:text-red-600 text-2xl font-bold focus:outline-none"
          onClick={() => setIsVideoOpen(false)}
          aria-label="Close video modal"
        >
          &times;
        </button>
        <div className="w-full flex justify-center items-center">
          <video
            src="/Nakuru-Agri-SentiWebApp.mp4"
            controls
            className="w-full h-auto rounded-lg mb-4 bg-black"
            style={{
              maxHeight: '60vh',
              minHeight: '180px',
              aspectRatio: '16/9',
              objectFit: 'contain',
            }}
          />
        </div>
        <div className="flex gap-2 w-full justify-center">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            onClick={() => setIsVideoOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Demo Video Modal */}
      {isVideoOpen && <DemoVideoModal />}
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-100 pt-20 pb-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <div className="space-y-4 md:space-y-6">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 inline-flex items-center gap-2 px-3 py-1.5 text-sm">
                  🎉 Now serving 2,500+ farmers in Nakuru County
                </Badge>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-green-800 leading-tight">
                  Smart Farming for
                  <span className="text-green-600 block lg:inline"> Modern </span>
                  Nakuru Farmers
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-green-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Transform your farming with AI-powered crop advisory, instant disease detection, 
                  and direct market access. Join thousands of farmers increasing their yields and profits with AgriSenti.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                <Link to="/auth" className="w-full sm:w-auto">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 w-full group transition-all duration-300 py-3 px-6">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 w-full sm:w-auto group py-3 px-6"
                  onClick={() => setIsVideoOpen(true)}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 pt-6 md:pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-white/70 backdrop-blur-sm p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-green-600 flex justify-center mb-1 md:mb-2">
                        {stat.icon}
                      </div>
                      <div className="text-xl md:text-2xl font-bold text-green-800">{stat.number}</div>
                      <div className="text-xs md:text-sm text-green-600">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0 order-first lg:order-last">
              <img 
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop" 
                alt="Modern farming with technology"
                className="rounded-2xl shadow-2xl w-full h-[300px] md:h-[400px] object-cover"
              />
              <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 bg-white p-2 md:p-4 rounded-lg shadow-lg animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs md:text-sm font-medium">Live crop monitoring</span>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-green-600 text-white p-2 md:p-3 rounded-lg shadow-lg">
                <div className="text-xs md:text-sm font-medium">+40% Yield</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Dashboard Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
              Experience Your Future Farm Dashboard
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              See how AgriSenti transforms farming data into actionable insights. 
              This interactive preview shows real farming scenarios from Nakuru County.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <DemoDashboard />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
              Everything You Need to Succeed
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Our comprehensive platform provides all the tools and insights you need 
              to maximize your farming potential in Nakuru County.
            </p>
          </div>

          <div className="space-y-16 md:space-y-20 lg:space-y-24">
            {features.map((feature, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`space-y-4 md:space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="bg-gray-100 p-2 md:p-3 rounded-lg flex-shrink-0">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">{feature.title}</h3>
                  </div>
                  <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-3 h-3 md:w-4 md:h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm md:text-base text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1' : ''} order-first lg:order-none`}>
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="rounded-2xl shadow-lg w-full h-64 md:h-80 lg:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with African people images */}
      <section className="py-16 md:py-20 lg:py-24 bg-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
              Trusted by Farmers Across Nakuru County
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600">
              See how AgriSenti is transforming lives and livelihoods
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white transform hover:-translate-y-1">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-1 mb-3 md:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 md:w-8 md:h-8 text-green-600 mb-3 md:mb-4" />
                  <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 text-sm md:text-base truncate">{testimonial.name}</div>
                      <div className="text-xs md:text-sm text-gray-600 truncate">{testimonial.role}</div>
                      <div className="text-xs md:text-sm text-green-600 truncate">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section className="py-20 md:py-24 lg:py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 md:mb-20">
            <Badge className="mb-4 md:mb-6 bg-green-100 text-green-800 border-green-200 text-sm px-4 py-2">
              Special Launch Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
              Choose Your Perfect Plan
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Start free and upgrade when you're ready to unlock the full potential of smart farming. 
              All plans include our core features with no hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative border-2 transition-all duration-300 hover:shadow-2xl ${
                plan.highlighted 
                  ? 'border-green-500 shadow-2xl md:scale-105 bg-gradient-to-br from-green-50 to-emerald-50' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}>
                {plan.badge && (
                  <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className={`${
                      plan.highlighted ? 'bg-green-600 text-white' : 'bg-purple-600 text-white'
                    } px-3 md:px-4 py-1 text-xs md:text-sm font-semibold shadow-lg`}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className={`text-center pb-6 md:pb-8 pt-6 md:pt-8 ${plan.highlighted ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg' : ''}`}>
                  <div className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full flex items-center justify-center ${
                    plan.highlighted ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    <div className={plan.highlighted ? 'text-white' : `text-${plan.color}-600`}>
                      {plan.icon}
                    </div>
                  </div>
                  
                  <CardTitle className={`text-xl md:text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </CardTitle>
                  
                  <div className="mb-3 md:mb-4">
                    {plan.originalPrice && (
                      <div className={`text-sm line-through ${plan.highlighted ? 'text-green-200' : 'text-gray-500'} mb-1`}>
                        {plan.originalPrice}
                      </div>
                    )}
                    <div className={`text-3xl md:text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
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
                
                <CardContent className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
                  <ul className="space-y-3 md:space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 md:gap-3">
                        <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                          <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm md:text-base leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to="/auth" className="block">
                    <Button className={`w-full py-2.5 md:py-3 text-sm md:text-base font-semibold transition-all duration-300 ${
                      plan.highlighted 
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl' 
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}>
                      {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
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
          
          <div className="text-center mt-12 md:mt-16">
            <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
              All plans include free migration assistance and 24/7 customer support
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 text-sm text-gray-500">
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
      <section className="py-16 md:py-20 lg:py-24 bg-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="/assets/images/African-farmer.avif"
                alt="African farmer proudly holding fresh produce from his farm"
                className="rounded-2xl shadow-lg w-full h-64 md:h-80 lg:h-96 object-cover"
              />
            </div>
            
            <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
                  Why Farmers Choose AgriSenti
                </h2>
                <p className="text-base md:text-lg lg:text-xl text-gray-600">
                  Join thousands of farmers who have transformed their farming 
                  practices and increased their profits with our smart solutions.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 md:gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-green-600 p-1 rounded-full flex-shrink-0">
                      <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                    </div>
                    <span className="text-sm md:text-base text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 md:pt-6">
                <Link to="/auth">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 group w-full sm:w-auto">
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
      <section className="py-16 md:py-20 lg:py-24 bg-green-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
            <div className="flex justify-center">
              <Award className="w-12 h-12 md:w-16 md:h-16 text-green-200" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-green-100 leading-relaxed">
              Join AgriSenti today and start getting personalized farming advice, 
              disease detection, and better market access. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-green-100 hover:text-green-700 w-full transition-colors py-3 px-6"
                >
                  Start Your Free Trial
                </Button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/20 w-full py-3 px-6">
                  Contact Sales
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 text-green-200 text-sm">
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
