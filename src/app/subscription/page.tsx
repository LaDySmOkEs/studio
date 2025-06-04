// src/app/subscription/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PlanFeature = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-center gap-2">
    <CheckCircle className="w-5 h-5 text-green-500" />
    <span className="text-muted-foreground">{children}</span>
  </li>
);

export default function SubscriptionPage() {
  const { toast } = useToast();

  const handleChoosePlan = (planName: string) => {
    toast({
      title: "Plan Selected (Placeholder)",
      description: `You've selected the ${planName}. Payment integration would follow.`,
    });
    // In a real application, this would navigate to a checkout page or trigger a payment flow.
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-primary border-2">
        <CardHeader className="text-center">
          <div className="flex justify-start w-full mb-4">
            <Link href="/case-analysis" passHref>
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Case Analysis
              </Button>
            </Link>
          </div>
          <CardTitle className="text-3xl font-bold">Choose Your Plan</CardTitle>
          <CardDescription className="text-lg">
            Unlock powerful AI legal assistance with our flexible subscription options.
            Start with a free trial to experience the benefits.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          {/* Free Trial Plan */}
          <Card className="flex flex-col shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">1-Day Free Trial</CardTitle>
              <CardDescription>Experience core features firsthand.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <p className="text-4xl font-bold">$0</p>
              <ul className="space-y-2">
                <PlanFeature>Basic Case Analysis</PlanFeature>
                <PlanFeature>Limited Document Generation</PlanFeature>
                <PlanFeature>Community Support</PlanFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleChoosePlan("1-Day Free Trial")}>
                Start Free Trial
              </Button>
            </CardFooter>
          </Card>

          {/* Basic Plan */}
          <Card className="flex flex-col shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
              Most Popular
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Basic User</CardTitle>
              <CardDescription>For individuals and small practices.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <p>
                <span className="text-4xl font-bold">$25</span>
                <span className="text-muted-foreground">/month</span>
              </p>
              <ul className="space-y-2">
                <PlanFeature>Full Case Analysis Suite</PlanFeature>
                <PlanFeature>Unlimited Document Generation</PlanFeature>
                <PlanFeature>Rights Recorder Access</PlanFeature>
                <PlanFeature>Court Directory</PlanFeature>
                <PlanFeature>Email Support</PlanFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="default" onClick={() => handleChoosePlan("Basic Plan")}>
                Choose Basic
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className="flex flex-col shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">Premium User</CardTitle>
              <CardDescription>For professionals needing advanced tools.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <p>
                <span className="text-4xl font-bold">$50</span>
                <span className="text-muted-foreground">/month</span>
              </p>
              <ul className="space-y-2">
                <PlanFeature>All Basic Features</PlanFeature>
                <PlanFeature>Advanced AI Legal Insights</PlanFeature>
                <PlanFeature>Evidence Compiler Pro</PlanFeature>
                <PlanFeature>Trauma Log with Cloud Backup (Conceptual)</PlanFeature>
                <PlanFeature>Priority Support</PlanFeature>
                <PlanFeature>Early Access to New Features</PlanFeature>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleChoosePlan("Premium Plan")}>
                Choose Premium
              </Button>
            </CardFooter>
          </Card>
        </CardContent>
         <CardFooter className="text-center block">
            <p className="text-sm text-muted-foreground">
              All subscriptions are billed monthly. You can cancel anytime.
              This is a UI representation; actual subscription and payment processing require backend integration.
            </p>
          </CardFooter>
      </Card>
    </div>
  );
}
