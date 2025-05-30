import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Sprout, 
  Microscope, 
  BookOpen, 
  Vial, 
  ShieldAlert,
  CheckCircle,
  Info
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export interface DiseaseInfo {
  diseaseName: string;
  description: string;
  treatment: string[];
  prevention: string[];
}

export const LeafBlightInfo: React.FC = () => {
  const diseaseInfo: DiseaseInfo = {
    diseaseName: "Gray Leaf Spot / Leaf Blight",
    description: "The leaves show elongated, rectangular gray to tan lesions parallel to the leaf veins. They appear to be spreading. Leaf blight causes tan spots on the lower leaves which develop into elongated lesions that dry up and kill the leaf.",
    treatment: [
      "Application of appropriate fungicides containing active ingredients like strobilurins or triazoles, if the infestation is severe and at an early stage. Consult a local agricultural extension officer for specific product recommendations approved for use in Kenya and effective against Cercospora or leaf blight.",
      "Supplementing with foliar nutrient sprays may help reduce the impact of disease."
    ],
    prevention: [
      "Crop Rotation: Rotate maize with non-host crops (e.g., legumes) for at least two years.",
      "Resistant Varieties: Plant maize varieties known to be resistant to Gray Leaf Spot and leaf blight prevalent in the Nakuru region. Consult with local seed suppliers.",
      "Sanitation: Remove and destroy infected plant debris after harvest to reduce inoculum.",
      "Balanced Fertilization: Ensure balanced soil nutrition based on soil testing to improve plant health and resistance. Avoid excessive nitrogen, which can favor disease development.",
      "Air Circulation: Promote good air circulation within the maize canopy by optimizing plant spacing."
    ]
  };

  return (
    <Card className="bg-white shadow overflow-hidden border-0">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sprout className="h-6 w-6" />
            <span>{diseaseInfo.diseaseName}</span>
          </CardTitle>
          <Badge variant="outline" className="bg-white/20 text-white border-none">
            Moderate Risk
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="p-5 border-b bg-green-50">
          <div className="flex gap-3 items-start">
            <Info className="h-5 w-5 text-green-700 mt-1 flex-shrink-0" />
            <p className="text-green-800">{diseaseInfo.description}</p>
          </div>
        </div>

        <Tabs defaultValue="treatment" className="w-full">
          <TabsList className="grid grid-cols-2 p-0 bg-transparent h-auto border-b">
            <TabsTrigger 
              value="treatment" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none py-3 text-gray-600"
            >
              <div className="flex items-center gap-2">
                <Vial className="w-4 h-4" />
                <span>Treatment</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="prevention"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-700 rounded-none py-3 text-gray-600"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                <span>Prevention</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="treatment" className="p-5 focus-visible:outline-none focus-visible:ring-0">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-100">
                  <Vial className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Treatment Options</h3>
              </div>

              <ul className="space-y-4">
                {diseaseInfo.treatment.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-sm font-medium text-green-700">{index + 1}</span>
                    </span>
                    <p className="text-gray-700">{item}</p>
                  </li>
                ))}
              </ul>
              
              <div className="bg-blue-50 rounded-lg p-4 mt-4 border border-blue-100">
                <div className="flex gap-2">
                  <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    Always follow product labels and safety guidelines when applying agricultural chemicals. 
                    Consult with a local agricultural extension officer for specific recommendations.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="prevention" className="p-5 focus-visible:outline-none focus-visible:ring-0">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100">
                  <ShieldAlert className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Prevention Measures</h3>
              </div>
              
              <ul className="space-y-4">
                {diseaseInfo.prevention.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      {item.includes(':') ? (
                        <>
                          <span className="font-medium">{item.split(':')[0]}:</span>
                          <span className="text-gray-700">{item.split(':')[1]}</span>
                        </>
                      ) : (
                        <span className="text-gray-700">{item}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="bg-amber-50 rounded-lg p-4 mt-4 border border-amber-100">
                <div className="flex gap-2">
                  <Microscope className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <p className="text-sm text-amber-800">
                    Regular monitoring is crucial for early detection. Inspect your crops 
                    weekly, particularly during periods of high humidity or after rain.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="p-5 bg-green-50 border-t">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-800">
              For more detailed information, contact your local agricultural extension officer.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
