import React from "react";
import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function TopNav() {
  return (
    <header className="h-[72px] bg-card border-b border-border flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-10">
      {/* Left section - Mobile Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search shipments, vehicles, drivers..." 
            className="pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
          />
        </div>
      </div>

      {/* Right section - Notifications & Profile */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-primary rounded-full"></span>
        </Button>

        <div className="h-6 w-px bg-border mx-1 hidden sm:block"></div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium">John Doe</span>
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20">Operations</Badge>
          </div>
          <Avatar className="w-9 h-9 border border-border">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
