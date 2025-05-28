// src/app/admin-dashboard/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users, BarChart3, AlertTriangle, Edit3, Settings, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MockUserSubscription {
  id: string;
  email: string;
  plan: "Free Trial" | "Basic" | "Premium";
  status: "Active" | "Canceled" | "Trialing";
  startDate: string;
  endDate?: string;
}

const MOCK_SUBSCRIPTIONS: MockUserSubscription[] = [
  { id: "usr_1", email: "user1@example.com", plan: "Premium", status: "Active", startDate: "2023-01-15", endDate: "2024-01-15" },
  { id: "usr_2", email: "user2@example.com", plan: "Basic", status: "Active", startDate: "2023-03-20", endDate: "2024-03-20" },
  { id: "usr_3", email: "trialuser@example.com", plan: "Free Trial", status: "Trialing", startDate: "2023-12-01", endDate: "2023-12-02" },
  { id: "usr_4", email: "canceled@example.com", plan: "Basic", status: "Canceled", startDate: "2023-05-10", endDate: "2023-06-10" },
  { id: "usr_5", email: "anotheractive@example.com", plan: "Premium", status: "Active", startDate: "2023-11-01", endDate: "2024-11-01" },
];

export default function AdminDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredSubscriptions = MOCK_SUBSCRIPTIONS.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleManageSubscription = (userId: string) => {
    toast({
      title: "Manage Subscription (Placeholder)",
      description: `Admin action for user ${userId} would be triggered here. This is a UI placeholder.`,
    });
  };

  return (
    <div className="space-y-8">
      <Alert variant="default" className="border-accent bg-accent/10">
        <AlertTriangle className="h-5 w-5 text-accent" />
        <AlertTitle className="font-semibold text-accent">Placeholder Admin Dashboard</AlertTitle>
        <AlertDescription>
          This page is a UI representation of an Admin Dashboard. Full functionality for managing users, subscriptions, and viewing real-time activity requires backend integration, database setup, and authentication/authorization systems, which are not implemented in this prototype.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month (mock data)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">789</div>
            <p className="text-xs text-muted-foreground">+15 since last week (mock data)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trial Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-muted-foreground">Currently active trials (mock data)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$19,725</div>
            <p className="text-xs text-muted-foreground">Estimate for this month (mock data)</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Subscription Management</CardTitle>
          <CardDescription>View and manage user subscriptions. (Mock Data)</CardDescription>
          <div className="pt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search subscriptions by email, plan, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full max-w-md"
                aria-label="Search subscriptions"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.email}</TableCell>
                    <TableCell>
                      <Badge variant={sub.plan === "Premium" ? "default" : sub.plan === "Basic" ? "secondary" : "outline"}>
                        {sub.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={sub.status === "Active" ? "default" : sub.status === "Canceled" ? "destructive" : "outline"} className={sub.status === "Active" ? "bg-green-500 hover:bg-green-600 text-white" : ""}>
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{sub.startDate}</TableCell>
                    <TableCell>{sub.endDate || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleManageSubscription(sub.id)}>
                        <Edit3 className="mr-1 h-3 w-3" /> Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No subscriptions found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Displaying {filteredSubscriptions.length} of {MOCK_SUBSCRIPTIONS.length} mock subscriptions. Pagination would be here.
          </p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity Log (Placeholder)</CardTitle>
          <CardDescription>Overview of recent system or user activities. (Mock Data)</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>[Timestamp] User 'user1@example.com' upgraded to Premium.</li>
            <li>[Timestamp] New user 'new@example.com' started Free Trial.</li>
            <li>[Timestamp] Admin 'admin@example.com' updated system settings.</li>
            <li>[Timestamp] Case Analysis performed by 'user2@example.com'.</li>
          </ul>
          <Button variant="link" className="mt-2 px-0">View all activity</Button>
        </CardContent>
      </Card>
    </div>
  );
}
