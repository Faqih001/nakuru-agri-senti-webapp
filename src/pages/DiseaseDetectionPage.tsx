import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Upload, 
  AlertTriangle, 
  Database, 
  BookOpen, 
  Search,
  Leaf,
  FileQuestion
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DiseaseDetection } from "@/components/DiseaseDetection";
import { LeafBlightInfo } from "@/components/LeafBlightInfo";

const DiseaseDetectionPage = () => {
  const [activeTab, setActiveTab] = useState("detection");
  const [searchQuery, setSearchQuery] = useState("");

  // Simulated disease database - in a real app, this would come from an API
  const commonDiseases = [
    {
      id: "gray-leaf-spot",
      name: "Gray Leaf Spot / Leaf Blight",
      crop: "Maize",
      severity: "Medium"
    },
    {
      id: "maize-streak-virus",
      name: "Maize Streak Virus",
      crop: "Maize",
      severity: "High"
    },
    {
      id: "northern-leaf-blight",
      name: "Northern Leaf Blight",
      crop: "Maize",
      severity: "Medium"
    },
    {
      id: "common-rust",
      name: "Common Rust",
      crop: "Maize",
      severity: "Low"
    }
  ];

  // Filter diseases based on search query
  const filteredDiseases = commonDiseases.filter(disease => 
    disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    disease.crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Disease Detection</h1>
          <p className="text-gray-500">Identify crop diseases and get treatment recommendations</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            AI Powered
          </Badge>
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Instant Results
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="detection" className="gap-2">
            <Camera className="w-4 h-4" />
            <span>Scan Disease</span>
          </TabsTrigger>
          <TabsTrigger value="library" className="gap-2">
            <Database className="w-4 h-4" />
            <span>Disease Library</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="detection" className="focus-visible:outline-none focus-visible:ring-0">
          <DiseaseDetection />
        </TabsContent>
        
        <TabsContent value="library" className="focus-visible:outline-none focus-visible:ring-0">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    Disease Library
                  </CardTitle>
                </div>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search diseases by name or crop..."
                    className="pl-10 bg-gray-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {searchQuery && filteredDiseases.length === 0 ? (
                  <div className="p-6 text-center">
                    <FileQuestion className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">No diseases found for "{searchQuery}"</p>
                    <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredDiseases.map((disease) => (
                      <div key={disease.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Leaf className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{disease.name}</p>
                            <p className="text-sm text-gray-500">{disease.crop}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={
                              disease.severity === "High" ? "bg-red-100 text-red-800 border-red-200" :
                              disease.severity === "Medium" ? "bg-orange-100 text-orange-800 border-orange-200" :
                              "bg-yellow-100 text-yellow-800 border-yellow-200"
                            }
                          >
                            {disease.severity} Risk
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              // In a real app, this would load the disease details
                              if (disease.id === "gray-leaf-spot") {
                                setActiveTab("details");
                              }
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Featured Disease Details */}
            <div className="pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Disease Information</h2>
              <LeafBlightInfo />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="focus-visible:outline-none focus-visible:ring-0">
          <div className="space-y-4">
            <Button variant="outline" onClick={() => setActiveTab("library")} className="mb-2">
              Back to Library
            </Button>
            <LeafBlightInfo />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiseaseDetectionPage;
