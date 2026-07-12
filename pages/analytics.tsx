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

import useSWR from "swr";

const fetcher = (url: string) => fetch(url, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then(res => res.json());

export default function Analytics() {
  const { data: reportsData } = useSWR('/api/reports', fetcher);
  const { data: dashboard } = useSWR('/api/dashboard', fetcher);

  const reports = Array.isArray(reportsData) ? reportsData : [];
  const totalRevenue = reports.reduce((acc: number, r: any) => acc + (r.revenue || 0), 0);
  const totalCost = reports.reduce((acc: number, r: any) => acc + (r.operationalCost || 0), 0);
  
  const roiData = [
    { name: "Live Data", revenue: totalRevenue, cost: totalCost },
  ];

  const utilizationData = [
    { name: "Live", util: dashboard?.fleetUtilization || 0 },
  ];
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
                  <BarChart data={utilizationData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '10px' }} />
                    <Bar dataKey="util" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
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
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip contentStyle={{ borderRadius: '10px' }} formatter={(val) => `₹${(val as number).toLocaleString()}`} />
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
