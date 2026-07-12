import React from "react";
import Head from "next/head";
import { 
  Truck, 
  Route, 
  AlertTriangle, 
  TrendingUp, 
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then(res => res.json());
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: dashboardData, error: dashError } = useSWR('/api/dashboard', fetcher);
  const { data: tripsData, error: tripsError } = useSWR('/api/trips', fetcher);

  const recentTrips = tripsData ? tripsData.slice(0, 5) : [];
  
  const revenueData = [
    { name: "Mon", total: 12400 },
    { name: "Tue", total: 14500 },
    { name: "Wed", total: 11200 },
    { name: "Thu", total: 15800 },
    { name: "Fri", total: 18900 },
    { name: "Sat", total: 9400 },
    { name: "Sun", total: 8100 },
  ];

  return (
    <>
      <Head>
        <title>Dashboard | TransitOps</title>
      </Head>
      
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            <p className="text-muted-foreground">Welcome back, here's what's happening with your fleet today.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Download Report</Button>
            <Button>New Dispatch</Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-t-4 border-t-primary">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Active Vehicles</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.activeVehicles + dashboardData?.availableVehicles || 0}
                </div>
                <p className="text-xs flex items-center mt-1 text-success">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +4 from yesterday
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-t-4 border-t-info">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Trips</CardTitle>
                <Route className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.activeTrips || 0}
                </div>
                <p className="text-xs flex items-center mt-1 text-success">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% this week
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-t-4 border-t-warning">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Vehicles in Shop</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData?.maintenanceVehicles || 0}
                </div>
                <p className="text-xs flex items-center mt-1 text-destructive">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  +2 needs immediate attention
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-t-4 border-t-success">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">On-Time Delivery</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96.4%</div>
                <p className="text-xs flex items-center mt-1 text-success">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +1.2% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts & Tables */}
        <div className="grid gap-6 md:grid-cols-7">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Revenue vs Operational Cost</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `$${value}`} 
                    />
                    <RechartsTooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-destructive/10 p-2 rounded-full">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Engine Temp Warning</p>
                    <p className="text-sm text-muted-foreground">Vehicle TRK-4923 needs immediate inspection.</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-warning/10 p-2 rounded-full">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Driver License Expiring</p>
                    <p className="text-sm text-muted-foreground">John Smith's CDL expires in 15 days.</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-success/10 p-2 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Maintenance Completed</p>
                    <p className="text-sm text-muted-foreground">TRK-8812 brake replacement finished.</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">View All Alerts</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Trips Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Dispatches</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Trip ID</th>
                    <th className="px-4 py-3">Route</th>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-tr-lg">ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrips.map((trip: any) => (
                    <tr key={trip.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{trip.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span>{trip.source}</span>
                          <span className="text-muted-foreground text-xs">to {trip.destination}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{trip.vehicle?.registration || trip.vehicleId}</td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant="secondary"
                          className={
                            trip.status === "COMPLETED" ? "bg-success/10 text-success" :
                            trip.status === "DISPATCHED" ? "bg-info/10 text-info" :
                            trip.status === "ASSIGNED" ? "bg-warning/10 text-warning" :
                            "bg-muted text-muted-foreground"
                          }
                        >
                          {trip.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{new Date(trip.estimatedArrival).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
