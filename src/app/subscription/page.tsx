// src/app/subscription/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { createCheckoutSession } from "./actions";

const PlanFeature = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-center gap-2">
    <CheckCircle className="w-5 h-5 text-green-500" />
    <span className="text-muted-foreground">{children}</span>
  </li>
);

// In a real app, these Price IDs would come from your Stripe Dashboard
const PLANS = [
  {
    name: "Basic User",
    price: 25,
    priceId: "price_1PghdFDEQaroqDjsvI0i3uCl", // Replace with your actual Stripe Price ID for the Basic plan
    description: "For individuals and small practices.",
    features: [
      "Full Case Analysis Suite",
      "Unlimited Document Generation",
      "Rights Recorder Access",
      "Court Directory",
      "Email Support",
    ],
    popular: true,
  },
  {
    name: "Premium User",
    price: 50,
    priceId: "price_1PghdFDEQaroqDjswO1c2g3f", // Replace with your actual Stripe Price ID for the Premium plan
    description: "For professionals needing advanced tools.",
    features: [
      "All Basic Features",
      "Advanced AI Legal Insights",
      "Evidence Compiler Pro",
      "Trauma Log with Cloud Backup (Conceptual)",
      "Priority Support",
      "Early Access to New Features",
    ],
    popular: false,
  },
];


export default function SubscriptionPage() {
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleChoosePlan = async (planName: string, planPrice: number, priceId: string) => {
    setLoadingPlan(planName);
    
    const result = await createCheckoutSession({
      plan: planName,
      price: planPrice,
      priceId: priceId,
    });

    if (result?.error) {
      toast({
        title: "Error Creating Checkout Session",
        description: result.error,
        variant: "destructive",
      });
    }
    // If successful, the server action will redirect the user, so no success handling is needed here.
    
    setLoadingPlan(null);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg border-primary border-2">
        <CardHeader className="text-center">
          <div className="flex justify-start w-full mb-4">
            <Link href="/" passHref>
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </div>
          <CardTitle className="text-3xl font-bold">Choose Your Plan</CardTitle>
          <CardDescription className="text-lg">
            Unlock powerful AI legal assistance with our flexible subscription options.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6 justify-center">

          {PLANS.map((plan) => (
            <Card key={plan.name} className="flex flex-col shadow-md relative overflow-hidden max-w-sm">
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <p>
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </p>
                <ul className="space-y-2">
                  {plan.features.map(feature => <PlanFeature key={feature}>{feature}</PlanFeature>)}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleChoosePlan(plan.name, plan.price, plan.priceId)}
                  disabled={loadingPlan === plan.name}
                >
                  {loadingPlan === plan.name ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...</>
                  ) : (
                    `Choose ${plan.name.split(' ')[0]}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
          
        </CardContent>
         <CardFooter className="text-center block">
            <p className="text-sm text-muted-foreground">
              All subscriptions are billed monthly. You can cancel anytime.
              <br/>
              This connects to a live Stripe test environment. Do not use real card details unless you are in a secure, controlled testing scenario.
            </p>
          </CardFooter>
      </Card>
    </div>
  );
}
