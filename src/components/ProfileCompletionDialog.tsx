import React, { useState } from "react";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useAuth } from "@/hooks/use-auth";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserProfile } from "@/contexts/types";
import { Loader2 } from "lucide-react";

interface ProfileCompletionDialogProps {
  open: boolean;
}

export const ProfileCompletionDialog: React.FC<ProfileCompletionDialogProps> = ({ open }) => {
  const { user, completeUserProfile, hideProfileCompletion } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  
  const [profileData, setProfileData] = useState<Partial<UserProfile>>({
    first_name: "",
    last_name: "",
    phone_number: "",
    account_type: "farmer",
  });

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setSubmitting(true);
    try {
      await completeUserProfile(profileData);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    hideProfileCompletion();
  };

  return (
    <Dialog open={open && !!user} onOpenChange={hideProfileCompletion}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Tell us more about yourself to get the most out of AgriSenti.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First name</Label>
              <Input
                id="first_name"
                value={profileData.first_name || ""}
                onChange={(e) => handleChange("first_name", e.target.value)}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last name</Label>
              <Input
                id="last_name"
                value={profileData.last_name || ""}
                onChange={(e) => handleChange("last_name", e.target.value)}
                placeholder="Doe"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone number</Label>
            <Input
              id="phone_number"
              value={profileData.phone_number || ""}
              onChange={(e) => handleChange("phone_number", e.target.value)}
              placeholder="+2547XXXXXXXX"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="account_type">Account type</Label>
            <Select
              value={profileData.account_type || "farmer"}
              onValueChange={(value) => handleChange("account_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="farmer">Farmer</SelectItem>
                <SelectItem value="buyer">Buyer/Trader</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={handleSkip}>
              Skip for now
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save profile"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
