import React from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart
} from "recharts";

const utilizationData = [
  { name: "Mon", util: 85 },
  { name: "Tue", util: 88 },
  { name: "Wed", util: 92 },
  { name: "Thu", util: 87 },
  { name: "Fri", util: 94 },
  { name: "Sat", util: 70 },
  { name: "Sun", util: 65 },
];

const roiData = [
  { name: "Q1", revenue: 450000, cost: 280000 },
  { name: "Q2", revenue: 520000, cost: 310000 },
  { name: "Q3", revenue: 480000, cost: 295000 },
  { name: "Q4", revenue: 610000, cost: 350000 },
];

export default function Analytics() {
  return (
    <>
      <Head>
        <title>Analytics | TransitOps</title>
      </Head>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Analytics</h1>
          <p className="text-muted-foreground">High-level metrics and fleet performance.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Fleet Utilization Rate (%)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={utilizationData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '10px' }} />
                    <Line type="monotone" dataKey="util" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quarterly Revenue vs Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={roiData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                    <Tooltip contentStyle={{ borderRadius: '10px' }} formatter={(val) => `$${(val as number).toLocaleString()}`} />
                    <Bar dataKey="cost" fill="var(--chart-2)" radius={[4, 4, 0, 0]} barSize={40} />
                    <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
