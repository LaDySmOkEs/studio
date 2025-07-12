// src/app/subscription/success/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SubscriptionSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl mt-4">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for subscribing. Your plan is now active. You now have full access to all the features included in your plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
                You can now return to the application and continue your work. If you have any questions, please contact support.
            </p>
          <Link href="/case-analysis" passHref>
            <Button>
              Go to Case Analysis
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
