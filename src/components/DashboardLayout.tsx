import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import {
  Sprout,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Home,
  Scan,
  Cloud,
  TrendingUp,
  Settings,
  LogOut,
  HelpCircle,
  Mail,
  Layout as LayoutIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

// Sidebar Navigation Items
const sidebarItems = [
  { label: "Overview", icon: Home, path: "/dashboard" },
  { label: "Crop Assistant", icon: Sprout, path: "/dashboard/crop-assistant" },
  { label: "Disease Detection", icon: Scan, path: "/dashboard/disease-detection" },
  { label: "Weather", icon: Cloud, path: "/dashboard/weather" },
  { label: "Market Prices", icon: TrendingUp, path: "/dashboard/market" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/landing");
  };

  const userInitials = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-transform bg-white border-r border-gray-200",
          isSidebarOpen ? "w-64" : "w-16",
          "md:translate-x-0",
          !isSidebarOpen && "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              {isSidebarOpen && (
                <span className="text-xl font-semibold text-gray-800">
                  AgriSenti
                </span>
              )}
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 py-4 overflow-y-auto">
            <nav className="space-y-1 px-3">
              {sidebarItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "text-green-600 bg-green-50"
                        : "text-gray-600 hover:text-green-600 hover:bg-green-50",
                      !isSidebarOpen && "justify-center px-2"
                    )
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                </NavLink>
              ))}

              {/* Logout Button */}
              <Button
                variant="ghost"
                className={cn(
                  "w-full mt-4 text-red-600 hover:text-red-700 hover:bg-red-50",
                  !isSidebarOpen && "px-2 justify-center"
                )}
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="ml-3">Logout</span>}
              </Button>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "md:ml-64" : "md:ml-16"
        )}
      >
        {/* Top Navigation */}
        <header className="h-16 bg-white border-b border-gray-200 fixed right-0 top-0 left-0 z-30 md:left-64">
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden"
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>

              {/* Desktop Search */}
              <div className="hidden md:flex items-center space-x-4 w-96">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search anything..."
                    className="pl-10 bg-gray-50 border-none w-full"
                  />
                </div>
              </div>

              {/* Mobile Search Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex">
                    <LayoutIcon className="w-5 h-5 mr-2" />
                    Quick Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Sprout className="w-4 h-4 mr-2" />
                      New Crop Entry
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Scan className="w-4 h-4 mr-2" />
                      Scan Disease
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Support
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Help Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Help & Resources</SheetTitle>
                    <SheetDescription>
                      Get help with AgriSenti dashboard and features
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      View Tutorial
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative"
                  >
                    <Bell className="w-5 h-5" />
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center"
                    >
                      3
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* Example notifications */}
                  <div className="max-h-64 overflow-y-auto">
                    {[1, 2, 3].map((i) => (
                      <DropdownMenuItem key={i} className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Sprout className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Crop Alert</p>
                            <p className="text-xs text-gray-500">
                              Your maize crop needs attention
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              2 hours ago
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar_url} alt={user?.email} />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard/profile")}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard/settings")}
                  >
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-600"
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Search Sheet */}
          <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <SheetContent side="top" className="h-32">
              <div className="h-full flex items-center">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 w-full"
                    autoFocus
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Page Content */}
        <main className="pt-16 min-h-screen">
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
