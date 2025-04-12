
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Bell,
  Camera, 
  CheckCircle, 
  Cloud,
  CreditCard,
  Lock, 
  Mail, 
  RotateCw,
  Save, 
  Shield, 
  User,
} from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    goalCount: "5",
    plan: "free"
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatar(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };
  
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DashboardLayout title="Settings" description="Manage your account settings and preferences.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile" className="mb-6">
            <TabsList className="bg-dark-secondary border border-gray-800">
              <TabsTrigger value="profile" className="data-[state=active]:bg-neon-lime data-[state=active]:text-gray-900">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="account" className="data-[state=active]:bg-neon-lime data-[state=active]:text-gray-900">
                <Shield className="w-4 h-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-neon-lime data-[state=active]:text-gray-900">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="billing" className="data-[state=active]:bg-neon-lime data-[state=active]:text-gray-900">
                <CreditCard className="w-4 h-4 mr-2" />
                Billing
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <Card className="bg-dark-secondary border-gray-800 shadow-lg p-6">
                <h3 className="text-white text-xl font-medium mb-6">Profile Information</h3>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-neon-lime/30 shadow-[0_0_15px_rgba(204,255,153,0.2)] mb-4 relative group">
                        <img 
                          src={avatar || user?.avatar || "https://api.dicebear.com/7.x/personas/svg?seed=default"} 
                          alt={user?.name} 
                          className="w-full h-full object-cover"
                        />
                        <label 
                          htmlFor="avatar-upload"
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        >
                          <Camera size={24} className="text-white" />
                        </label>
                        <input 
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                      <p className="text-sm text-gray-400">
                        Click to upload new image
                      </p>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <Label htmlFor="name">Display Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={form.name}
                          onChange={handleInputChange}
                          className="bg-dark border-gray-700 text-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Input
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleInputChange}
                            disabled
                            className="bg-dark border-gray-700 text-white pr-10"
                          />
                          <CheckCircle size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neon-lime" />
                        </div>
                        <p className="text-xs text-neon-lime mt-1 flex items-center">
                          <CheckCircle size={12} className="mr-1" />
                          Email verified
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="goal-count">Daily Habit Goal</Label>
                        <Select 
                          value={form.goalCount} 
                          onValueChange={(value) => handleSelectChange("goalCount", value)}
                        >
                          <SelectTrigger className="bg-dark border-gray-700 text-white">
                            <SelectValue placeholder="Select habit count" />
                          </SelectTrigger>
                          <SelectContent className="bg-dark-secondary border-gray-700">
                            <SelectItem value="3">3 habits per day</SelectItem>
                            <SelectItem value="5">5 habits per day</SelectItem>
                            <SelectItem value="7">7 habits per day</SelectItem>
                            <SelectItem value="10">10 habits per day</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="plan">Account Plan</Label>
                        <Select 
                          value={form.plan} 
                          onValueChange={(value) => handleSelectChange("plan", value)}
                          disabled
                        >
                          <SelectTrigger className="bg-dark border-gray-700 text-white">
                            <SelectValue placeholder="Select plan" />
                          </SelectTrigger>
                          <SelectContent className="bg-dark-secondary border-gray-700">
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-400 mt-1">
                          To upgrade your plan, visit the Billing tab.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-neon-lime hover:bg-neon-lime/80 text-gray-900"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="account" className="mt-6">
              <Card className="bg-dark-secondary border-gray-800 shadow-lg p-6 mb-6">
                <h3 className="text-white text-xl font-medium mb-6">Account Security</h3>
                <div className="space-y-6">
                  <div className="border-b border-gray-800 pb-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="text-white font-medium">Password</h4>
                        <p className="text-gray-400 text-sm">Update your password regularly</p>
                      </div>
                      <Button variant="outline" className="border-gray-700 hover:border-neon-lime hover:text-neon-lime">
                        <Lock className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">
                      Last updated: 3 weeks ago
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-800 pb-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                        <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="text-xs text-gray-500">
                      Protect your account with 2FA codes via email or authenticator app
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="text-white font-medium">Delete Account</h4>
                        <p className="text-gray-400 text-sm">Permanently delete your account</p>
                      </div>
                      <Button variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                        Delete Account
                      </Button>
                    </div>
                    <div className="text-xs text-red-400">
                      This action cannot be undone. All your data will be permanently deleted.
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-dark-secondary border-gray-800 shadow-lg p-6">
                <h3 className="text-white text-xl font-medium mb-6">Connected Services</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#4285F4] flex items-center justify-center mr-4">
                        <span className="text-white font-bold">G</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Google Calendar</h4>
                        <p className="text-gray-400 text-sm">Sync your habits with Google Calendar</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-gray-700 hover:border-neon-lime hover:text-neon-lime">
                      Connect
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center mr-4">
                        <Cloud size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Cloud Backup</h4>
                        <p className="text-gray-400 text-sm">Backup your data to the cloud</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-gray-700 hover:border-neon-lime hover:text-neon-lime">
                      Setup
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-6">
              <Card className="bg-dark-secondary border-gray-800 shadow-lg p-6">
                <h3 className="text-white text-xl font-medium mb-6">Notification Preferences</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                    <div>
                      <h4 className="text-white font-medium">Daily Reminders</h4>
                      <p className="text-gray-400 text-sm">Get reminders for your daily habits</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                    <div>
                      <h4 className="text-white font-medium">Weekly Reports</h4>
                      <p className="text-gray-400 text-sm">Receive weekly progress reports</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                    <div>
                      <h4 className="text-white font-medium">Streak Alerts</h4>
                      <p className="text-gray-400 text-sm">Get alerted when you're about to break a streak</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                    <div>
                      <h4 className="text-white font-medium">AI Recommendations</h4>
                      <p className="text-gray-400 text-sm">Receive personalized AI habit recommendations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Marketing Updates</h4>
                      <p className="text-gray-400 text-sm">Receive product updates and offers</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    className="bg-neon-lime hover:bg-neon-lime/80 text-gray-900"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </Button>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing" className="mt-6">
              <Card className="bg-dark-secondary border-gray-800 shadow-lg p-6 mb-6">
                <h3 className="text-white text-xl font-medium mb-6">Current Plan</h3>
                <div className="bg-dark rounded-lg border border-gray-800 p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium">Free Plan</h4>
                    <span className="text-neon-lime bg-neon-lime/10 px-2 py-1 rounded text-xs font-medium">
                      Current Plan
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Basic habit tracking and analytics
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center text-gray-300 text-sm">
                      <CheckCircle size={16} className="text-neon-lime mr-2" />
                      Track up to 5 habits
                    </li>
                    <li className="flex items-center text-gray-300 text-sm">
                      <CheckCircle size={16} className="text-neon-lime mr-2" />
                      Basic analytics dashboard
                    </li>
                    <li className="flex items-center text-gray-300 text-sm">
                      <CheckCircle size={16} className="text-neon-lime mr-2" />
                      Daily reminders
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-neon-lime/20 to-[#00469B]/20 rounded-lg border border-neon-lime/30 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium">Premium Plan</h4>
                    <span className="text-gray-900 bg-neon-lime px-2 py-1 rounded text-xs font-medium">
                      $8.99/month
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    Advanced features and unlimited habit tracking
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center text-gray-300 text-sm">
                      <CheckCircle size={16} className="text-neon-lime mr-2" />
                      Unlimited habits
                    </li>
                    <li className="flex items-center text-gray-300 text-sm">
                      <CheckCircle size={16} className="text-neon-lime mr-2" />
                      Advanced AI coach features
                    </li>
                    <li className="flex items-center text-gray-300 text-sm">
                      <CheckCircle size={16} className="text-neon-lime mr-2" />
                      Custom categories and tags
                    </li>
                    <li className="flex items-center text-gray-300 text-sm">
                      <CheckCircle size={16} className="text-neon-lime mr-2" />
                      Export data and detailed reports
                    </li>
                    <li className="flex items-center text-gray-300 text-sm">
                      <CheckCircle size={16} className="text-neon-lime mr-2" />
                      Calendar integrations
                    </li>
                  </ul>
                  <Button className="w-full bg-neon-lime hover:bg-neon-lime/80 text-gray-900">
                    Upgrade to Premium
                  </Button>
                </div>
              </Card>
              
              <Card className="bg-dark-secondary border-gray-800 shadow-lg p-6">
                <h3 className="text-white text-xl font-medium mb-6">Payment Method</h3>
                <p className="text-gray-400 mb-4">
                  Add a payment method to upgrade to Premium.
                </p>
                <Button 
                  variant="outline"
                  className="border-gray-700 hover:border-neon-lime hover:text-neon-lime"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Payment Method
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-dark-secondary border-gray-800 shadow-lg p-6">
            <h3 className="text-white text-lg font-medium mb-4">Account Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white">June 2023</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Plan</span>
                <span className="text-neon-lime">Free</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Active Habits</span>
                <span className="text-white">4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Current Streak</span>
                <span className="text-white">12 days</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-800">
              <Button
                variant="outline"
                className="w-full border-gray-700 hover:border-neon-lime hover:text-neon-lime"
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </Card>
          
          <Card className="bg-dark-secondary border-gray-800 shadow-lg p-6">
            <h3 className="text-white text-lg font-medium mb-4">Data Management</h3>
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start border-gray-700 hover:border-neon-lime hover:text-neon-lime"
              >
                <Cloud className="mr-2 h-4 w-4" />
                Backup Data
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-gray-700 hover:border-neon-lime hover:text-neon-lime"
              >
                <Cloud className="mr-2 h-4 w-4" />
                Import Data
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-gray-700 hover:border-neon-lime hover:text-neon-lime"
              >
                <Cloud className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-xs text-gray-500">
                Last backup: Never
              </p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
