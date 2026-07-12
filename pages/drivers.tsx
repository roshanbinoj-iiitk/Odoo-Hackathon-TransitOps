import React from "react";
import Head from "next/head";
import { Plus, Search, MoreVertical, ShieldAlert } from "lucide-react";
import { mockDrivers } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Drivers() {
  return (
    <>
      <Head>
        <title>Drivers | TransitOps</title>
      </Head>
      
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Driver Directory</h1>
            <p className="text-muted-foreground">Manage your driving staff and monitor safety scores.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Driver
          </Button>
        </div>

        <div className="flex items-center w-full max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search drivers by name or license..." className="pl-10 bg-card" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDrivers.map((driver) => (
            <Card key={driver.id} className={`overflow-hidden ${driver.status === 'Suspended' ? 'border-destructive/50' : ''}`}>
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border">
                        <AvatarImage src={driver.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">{driver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{driver.name}</h3>
                        <p className="text-sm text-muted-foreground">{driver.licenseNumber}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 -mr-2" />}>
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Assign Trip</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Suspend Driver</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Safety Score</p>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">{driver.safetyScore}</div>
                        {driver.safetyScore < 85 && (
                          <ShieldAlert className="h-4 w-4 text-warning" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Experience</p>
                      <div className="font-semibold">{driver.experienceYears} Years</div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Trips Completed</p>
                      <div className="font-semibold">{driver.tripsCompleted}</div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge 
                        variant="secondary"
                        className={
                          driver.status === "Available" ? "bg-success/10 text-success" :
                          driver.status === "On Trip" ? "bg-info/10 text-info" :
                          driver.status === "Suspended" ? "bg-destructive/10 text-destructive" :
                          "bg-muted text-muted-foreground"
                        }
                      >
                        {driver.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                {driver.status === 'Suspended' && (
                  <div className="bg-destructive/10 px-6 py-3 border-t border-destructive/20">
                    <p className="text-xs font-medium text-destructive flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" /> Action Required: License Review
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
