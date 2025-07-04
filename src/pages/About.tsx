import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Target, Users, Award, Heart, Globe, Lightbulb, Shield, User, UserCheck } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Farmer-First",
      description: "Everything we do is designed with farmers' needs and challenges in mind."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
      title: "Innovation",
      description: "We leverage cutting-edge AI and technology to solve real farming problems."
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: "Reliability",
      description: "Farmers can count on us for accurate, timely, and actionable advice."
    },
    {
      icon: <Globe className="w-8 h-8 text-green-500" />,
      title: "Sustainability",
      description: "We promote farming practices that protect our environment for future generations."
    }
  ];

  const team = [
    {
      name: "Fakii Mohammed",
      role: "CEO",
      bio: "Visionary leader with extensive experience in educational technology and family-centered solutions.",
      expertise: "Leadership & Strategy",
      image: "/assets/team/team-member-1.png",
      useImage: true
    },
    {
      name: "Andrew Ogembo", 
      role: "CTO",
      bio: "Technical architect specializing in AI systems and scalable educational platforms.",
      expertise: "AI & Technology",
      icon: <User className="w-20 h-20 text-blue-600" />,
      useImage: false
    },
    {
      name: "Chiboniso Nyoni",
      role: "User Experience Lead",
      bio: "UX expert focused on creating intuitive, family-friendly interfaces that make learning accessible.",
      expertise: "User Experience",
      icon: <UserCheck className="w-20 h-20 text-purple-600" />,
      useImage: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <div className="bg-white/20 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Sprout className="w-10 h-10" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">About AgriSenti</h1>
              <p className="text-xl text-green-100 leading-relaxed">
                Empowering Nakuru farmers with AI-driven solutions for smarter, more profitable farming. 
                We bridge the gap between traditional farming wisdom and modern technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-green-600 text-white text-center">
                <Target className="w-12 h-12 mx-auto mb-4" />
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  To democratize access to agricultural expertise and market opportunities for 
                  smallholder farmers in Nakuru County, using artificial intelligence to provide 
                  personalized, actionable farming advice that increases yields and profits.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-blue-600 text-white text-center">
                <Award className="w-12 h-12 mx-auto mb-4" />
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  A future where every farmer in Kenya has access to smart farming tools and 
                  fair market opportunities, creating sustainable livelihoods and food security 
                  for generations to come.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600">
                Born from the challenges faced by farmers in Nakuru County
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  AgriSenti was founded in 2024 by a team of agricultural experts, data scientists, 
                  and farmers who recognized the urgent need for accessible, localized farming advice 
                  in Kenya.
                </p>
                
                <p className="text-gray-700 leading-relaxed">
                  We witnessed firsthand how farmers struggled with unpredictable weather, 
                  pest outbreaks, and unfair market prices. Traditional extension services 
                  couldn't reach everyone, and generic farming advice didn't account for 
                  local conditions.
                </p>
                
                <p className="text-gray-700 leading-relaxed">
                  That's when we decided to harness the power of artificial intelligence 
                  to create a platform that provides personalized, real-time farming advice 
                  and connects farmers directly with buyers.
                </p>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Impact So Far</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">1,000+</div>
                      <div className="text-sm text-green-700">Farmers Served</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">30%</div>
                      <div className="text-sm text-green-700">Average Yield Increase</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <img 
                  src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop" 
                  alt="Farmers working together"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="mb-6">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Passionate experts dedicated to transforming agriculture in Kenya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  {member.useImage ? (
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-green-100"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full mx-auto mb-6 bg-gray-100 flex items-center justify-center border-4 border-green-100">
                      {member.icon}
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-2">{member.role}</p>
                  <p className="text-blue-600 text-sm font-medium mb-4">{member.expertise}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
