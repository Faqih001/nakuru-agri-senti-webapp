import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Camera } from "lucide-react";

export const ProfilePage = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-800">My Profile</h1>
        <Button variant="outline" className="text-green-700">Save Changes</Button>
      </div>

      <div className="grid gap-6">
        {/* Profile Photo Section */}
        <Card className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                <User className="w-12 h-12 text-green-600" />
              </div>
              <Button size="sm" variant="secondary" className="absolute -bottom-2 -right-2 rounded-full p-2">
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-green-800">Profile Photo</h2>
              <p className="text-sm text-green-600 mt-1">Update your profile picture</p>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-green-800 mb-4">Personal Information</h2>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter your first name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter your last name" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                <Input id="email" type="email" placeholder="Enter your email" className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                <Input id="phone" type="tel" placeholder="Enter your phone number" className="pl-10" />
              </div>
            </div>
          </div>
        </Card>

        {/* Location Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-green-800 mb-4">Location Information</h2>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Farm Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-green-600" />
                <Input id="address" placeholder="Enter your farm address" className="pl-10" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="county">County</Label>
                <Input id="county" placeholder="Enter your county" defaultValue="Nakuru County" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcounty">Sub-County</Label>
                <Input id="subcounty" placeholder="Enter your sub-county" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
