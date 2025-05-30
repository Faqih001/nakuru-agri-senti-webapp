import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, Leaf, Sailboat, RotateCw, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DiseaseDetailsProps {
  diseaseName: string;
  severity: "High" | "Medium" | "Low" | "None";
  description: string;
  treatment: string[];
  prevention: string[];
  confidence?: number;
}

export const DiseaseDetailsCard: React.FC<DiseaseDetailsProps> = ({
  diseaseName,
  severity,
  description,
  treatment,
  prevention,
  confidence
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "text-red-600 bg-red-100";
      case "Medium": return "text-orange-600 bg-orange-100";
      case "Low": return "text-yellow-600 bg-yellow-100";
      default: return "text-green-600 bg-green-100";
    }
  };

  const getSeverityIcon = (severity: string) => {
    return severity === "None" ? CheckCircle2 : AlertTriangle;
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm overflow-hidden border-gray-200">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <CardTitle className="flex items-center gap-2">
          <Leaf className="w-5 h-5" />
          {diseaseName}
        </CardTitle>
        {confidence && (
          <div className="text-sm text-green-100">
            {confidence}% confidence
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-5">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            {(() => {
              const Icon = getSeverityIcon(severity);
              return <Icon className={cn("w-6 h-6", 
                severity === "None" ? "text-green-600" : 
                severity === "Low" ? "text-yellow-600" : 
                severity === "Medium" ? "text-orange-600" : 
                "text-red-600")} />;
            })()}
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(severity)}`}>
                {severity} Risk
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-700">{description}</p>
          </div>

          <Tabs defaultValue="treatment" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="treatment" className="flex items-center gap-2">
                <Sailboat className="w-4 h-4" />
                <span>Treatment</span>
              </TabsTrigger>
              <TabsTrigger value="prevention" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Prevention</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="treatment" className="mt-4 space-y-4">
              <div className="border rounded-lg bg-white p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-3">Treatment Options</h4>
                <ul className="space-y-3">
                  {treatment.map((item, index) => (
                    <li key={index} className="flex gap-2 text-sm text-gray-700">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5"></div>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="prevention" className="mt-4">
              <div className="border rounded-lg bg-white p-4 shadow-sm">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-green-600" />
                  Prevention Measures
                </h4>
                <ul className="space-y-3">
                  {prevention.map((item, index) => (
                    <li key={index} className="flex gap-2 text-sm text-gray-700">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5"></div>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-green-50 p-4 rounded-lg text-sm text-green-800 border border-green-100">
            <p>
              <strong>Need expert help?</strong> Contact your local agricultural extension officer 
              in Nakuru for personalized advice specific to your farm conditions.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
