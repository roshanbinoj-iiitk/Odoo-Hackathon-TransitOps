import React from "react";
import Head from "next/head";
import { 
  Fuel, 
  IndianRupee, 
  Wrench, 
  TrendingDown, 
  TrendingUp,
  Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import useSWR from "swr";
const fetcher = (url: string) => fetch(url, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then(res => res.json());
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

const monthlyCosts = [
  { name: "Jan", fuel: 4000, maintenance: 2400, other: 2400 },
  { name: "Feb", fuel: 3000, maintenance: 1398, other: 2210 },
  { name: "Mar", fuel: 2000, maintenance: 9800, other: 2290 },
  { name: "Apr", fuel: 2780, maintenance: 3908, other: 2000 },
  { name: "May", fuel: 1890, maintenance: 4800, other: 2181 },
  { name: "Jun", fuel: 2390, maintenance: 3800, other: 2500 },
];

const expenseBreakdown = [
  { name: "Fuel", value: 45 },
  { name: "Maintenance", value: 30 },
  { name: "Tolls & Routes", value: 15 },
  { name: "Driver Expenses", value: 10 },
];

const COLORS = ['var(--primary)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)'];

export default function FuelExpenses() {
  const { data: fuelLogsData } = useSWR('/api/fuel', fetcher);
  const fuelLogs = Array.isArray(fuelLogsData) ? fuelLogsData : [];

  const totalFuelCost = fuelLogs.reduce((acc: number, log: any) => acc + (log.cost || 0), 0);
  const totalLiters = fuelLogs.reduce((acc: number, log: any) => acc + (log.liters || 0), 0);

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Date,Vehicle,Location,Liters,Cost\n" +
      fuelLogs.map((log: any) => 
        `${new Date(log.date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })},${log.vehicle?.registration || log.vehicleId},"${log.location}",${log.liters},${log.cost}`
      ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "fuel_expenses_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Fuel & Expenses Report", 14, 15);
    autoTable(doc, {
      head: [['Date', 'Vehicle', 'Location', 'Liters', 'Cost (INR)']],
      body: fuelLogs.map((log: any) => [
        new Date(log.date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }),
        log.vehicle?.registration || log.vehicleId,
        log.location,
        String(log.liters),
        String(log.cost)
      ]),
    });
    doc.save('fuel_expenses_report.pdf');
  };

  return (
    <>
      <Head>
        <title>Fuel & Expenses | TransitOps</title>
      </Head>
      
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fuel & Expenses</h1>
            <p className="text-muted-foreground">Financial overview of fleet operations.</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className={buttonVariants({ variant: "outline" })}>
              <Download className="mr-2 h-4 w-4" /> Export Report
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportCSV}>Download CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={exportPDF}>Download PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Fuel Cost</CardTitle>
              <Fuel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalFuelCost.toLocaleString()}</div>
              <p className="text-xs flex items-center mt-1 text-destructive">
                <TrendingUp className="h-3 w-3 mr-1" />
                +4.5% vs last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Fuel Consumption</CardTitle>
              <Fuel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLiters.toLocaleString()} L</div>
              <p className="text-xs flex items-center mt-1 text-success">
                <TrendingDown className="h-3 w-3 mr-1" />
                -2.1% efficiency improved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Maintenance Costs</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹34,250</div>
              <p className="text-xs flex items-center mt-1 text-success">
                <TrendingDown className="h-3 w-3 mr-1" />
                -12% vs last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cost per Km</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹1.84</div>
              <p className="text-xs flex items-center mt-1 text-destructive">
                <TrendingUp className="h-3 w-3 mr-1" />
                +₹0.12 vs avg
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Operating Costs Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyCosts}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip cursor={{ stroke: 'var(--border)' }} contentStyle={{ borderRadius: '10px' }} />
                    <Area type="monotone" dataKey="fuel" stackId="1" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.8} />
                    <Area type="monotone" dataKey="maintenance" stackId="1" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.8} />
                    <Area type="monotone" dataKey="other" stackId="1" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                {expenseBreakdown.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-sm font-medium">{item.name} ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Fuel Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Date</th>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Liters</th>
                    <th className="px-4 py-3 rounded-tr-lg">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {fuelLogs.slice(0, 10).map((log: any) => (
                    <tr key={log.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{new Date(log.date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                      <td className="px-4 py-3 text-primary">{log.vehicle?.registration || log.vehicleId}</td>
                      <td className="px-4 py-3">{log.location}</td>
                      <td className="px-4 py-3">{log.liters}</td>
                      <td className="px-4 py-3 font-medium">₹{log.cost}</td>
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
