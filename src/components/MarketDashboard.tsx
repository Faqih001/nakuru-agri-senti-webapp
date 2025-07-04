
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Phone, MessageSquare, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MarketPrice {
  crop: string;
  price: number;
  unit: string;
  change: number;
  location: string;
  quality: string;
}

interface Buyer {
  name: string;
  location: string;
  crops: string[];
  phone: string;
  rating: number;
  priceRange: string;
}

export const MarketDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState("nakuru-town");
  const { toast } = useToast();

  const marketPrices: MarketPrice[] = [
    { crop: "Maize", price: 38, unit: "per kg", change: 5.2, location: "Nakuru Town", quality: "Grade 1" },
    { crop: "Beans", price: 95, unit: "per kg", change: -2.1, location: "Nakuru Town", quality: "Clean" },
    { crop: "Potatoes", price: 45, unit: "per kg", change: 8.3, location: "Nakuru Town", quality: "Medium" },
    { crop: "Wheat", price: 42, unit: "per kg", change: 3.7, location: "Nakuru Town", quality: "Grade 2" },
    { crop: "Carrots", price: 35, unit: "per kg", change: -1.5, location: "Nakuru Town", quality: "Fresh" },
    { crop: "Cabbages", price: 25, unit: "per kg", change: 12.1, location: "Nakuru Town", quality: "Fresh" },
  ];

  const buyers: Buyer[] = [
    {
      name: "Nakuru Fresh Produce Ltd",
      location: "Nakuru Town",
      crops: ["Maize", "Beans", "Potatoes"],
      phone: "+254712345678",
      rating: 4.8,
      priceRange: "KSh 35-45/kg"
    },
    {
      name: "County Agricultural Co-op",
      location: "Nakuru Central",
      crops: ["Wheat", "Maize", "Beans"],
      phone: "+254723456789",
      rating: 4.6,
      priceRange: "KSh 38-48/kg"
    },
    {
      name: "Green Valley Traders",
      location: "Njoro",
      crops: ["Potatoes", "Carrots", "Cabbages"],
      phone: "+254734567890",
      rating: 4.7,
      priceRange: "KSh 30-40/kg"
    },
    {
      name: "Farmers Choice Market",
      location: "Naivasha Road",
      crops: ["All Crops"],
      phone: "+254745678901",
      rating: 4.5,
      priceRange: "Market Rate"
    }
  ];

  const handleContactBuyer = (buyer: Buyer, method: 'call' | 'whatsapp') => {
    if (method === 'call') {
      window.open(`tel:${buyer.phone}`);
    } else {
      const message = `Hello ${buyer.name}, I'm a farmer interested in selling my crops. Can we discuss prices and quantities?`;
      window.open(`https://wa.me/${buyer.phone.replace('+', '')}?text=${encodeURIComponent(message)}`);
    }
    
    toast({
      title: "Contacting buyer",
      description: `Opening ${method === 'call' ? 'phone dialer' : 'WhatsApp'} for ${buyer.name}`,
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-green-800">Market Prices</h2>
          <p className="text-green-600 text-sm sm:text-base">Current prices in Nakuru County</p>
        </div>
        
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nakuru-town">Nakuru Town</SelectItem>
            <SelectItem value="njoro">Njoro</SelectItem>
            <SelectItem value="naivasha">Naivasha</SelectItem>
            <SelectItem value="molo">Molo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {marketPrices.map((item, index) => (
          <Card key={index} className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-base sm:text-lg">{item.crop}</h3>
                <div className={`flex items-center gap-1 text-xs sm:text-sm ${
                  item.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.change > 0 ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />}
                  {Math.abs(item.change)}%
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xl sm:text-2xl font-bold text-green-700">
                  KSh {item.price}
                  <span className="text-xs sm:text-sm font-normal text-gray-600 ml-1">{item.unit}</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {item.location}
                </p>
                <p className="text-xs text-gray-500">Quality: {item.quality}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-orange-600 text-white p-3 sm:p-4 lg:p-6">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            Direct Buyers
          </CardTitle>
          <p className="text-orange-100 text-xs sm:text-sm">
            Connect directly with verified buyers in your area
          </p>
        </CardHeader>
        
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {buyers.map((buyer, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-3 sm:p-4">
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg truncate">{buyer.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {buyer.location}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex text-yellow-400 text-sm">
                          {"★".repeat(Math.floor(buyer.rating))}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600">({buyer.rating})</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs sm:text-sm text-gray-700">
                        <strong>Crops:</strong> <span className="break-words">{buyer.crops.join(", ")}</span>
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700">
                        <strong>Price Range:</strong> {buyer.priceRange}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleContactBuyer(buyer, 'call')}
                        className="flex items-center gap-1 flex-1 text-xs sm:text-sm"
                      >
                        <Phone className="w-3 h-3" />
                        <span className="hidden sm:inline">Call</span>
                        <span className="sm:hidden">📞</span>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleContactBuyer(buyer, 'whatsapp')}
                        className="flex items-center gap-1 flex-1 bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span className="hidden sm:inline">WhatsApp</span>
                        <span className="sm:hidden">💬</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-4 sm:mt-6 bg-green-50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2 text-sm sm:text-base">Tips for Better Prices:</h4>
            <ul className="text-xs sm:text-sm text-green-700 space-y-1">
              <li>• Grade your produce properly before selling</li>
              <li>• Sell directly to buyers to avoid middleman costs</li>
              <li className="hidden sm:list-item">• Form farmer groups for better bargaining power</li>
              <li>• Time your sales with market demand peaks</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
