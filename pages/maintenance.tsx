import React from "react";
import Head from "next/head";
import { Wrench, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockMaintenanceLogs } from "@/data/mock";
import { Separator } from "@/components/ui/separator";

export default function Maintenance() {
  return (
    <>
      <Head>
        <title>Maintenance | TransitOps</title>
      </Head>
      
      <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance & Repairs</h1>
          <p className="text-muted-foreground">Schedule service and view vehicle maintenance history.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Left Panel - Schedule Form */}
          <Card className="flex flex-col h-full overflow-hidden border-border shadow-sm lg:col-span-1">
            <CardHeader className="bg-muted/30 border-b border-border pb-4">
              <CardTitle>Schedule Service</CardTitle>
              <CardDescription>Log a new maintenance record or schedule an upcoming service.</CardDescription>
            </CardHeader>
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              <div className="space-y-2">
                <Label>Vehicle ID</Label>
                <Input placeholder="Search or select vehicle" />
              </div>
              <div className="space-y-2">
                <Label>Service Type</Label>
                <Input placeholder="e.g. Oil Change, Brake Inspection" />
              </div>
              <div className="space-y-2">
                <Label>Technician / Shop</Label>
                <Input placeholder="Name of technician or external shop" />
              </div>
              <div className="space-y-2">
                <Label>Estimated Cost</Label>
                <Input type="number" placeholder="$0.00" />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="p-6 border-t border-border bg-muted/10 space-y-3">
              <Button className="w-full">Schedule Maintenance</Button>
              <Button variant="outline" className="w-full">Log Completed Service</Button>
            </div>
          </Card>

          {/* Right Panel - Service History */}
          <Card className="flex flex-col h-full overflow-hidden border-border shadow-sm lg:col-span-2 bg-muted/10">
            <CardHeader className="bg-muted/30 border-b border-border pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Service History</CardTitle>
                <CardDescription>Recent maintenance logs across the fleet.</CardDescription>
              </div>
              <Button variant="outline" size="sm">Export Logs</Button>
            </CardHeader>
            <div className="overflow-y-auto flex-1 p-6">
              <div className="relative border-l-2 border-muted ml-3 space-y-8 pb-4">
                {mockMaintenanceLogs.slice(0, 15).map((log) => (
                  <div key={log.id} className="relative pl-6">
                    <div className="absolute w-6 h-6 bg-card border-2 border-border rounded-full -left-[13px] top-0 flex items-center justify-center">
                      {log.status === 'Completed' ? (
                        <CheckCircle2 className="w-3 h-3 text-success" />
                      ) : log.status === 'In Progress' ? (
                        <Wrench className="w-3 h-3 text-info" />
                      ) : (
                        <Clock className="w-3 h-3 text-warning" />
                      )}
                    </div>
                    
                    <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{log.service}</h4>
                          <p className="text-sm text-primary font-medium">{log.vehicleId}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold">${log.cost}</span>
                          <p className="text-xs text-muted-foreground">{log.date}</p>
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between items-center text-xs text-muted-foreground pt-1">
                        <span>Technician: {log.technician}</span>
                        <span className={`font-medium ${
                          log.status === 'Completed' ? 'text-success' : 
                          log.status === 'In Progress' ? 'text-info' : 'text-warning'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
