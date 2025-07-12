// src/app/subscription/cancel/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function SubscriptionCancelPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-red-100 rounded-full p-3 w-fit">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl mt-4">Payment Canceled</CardTitle>
          <CardDescription>
            Your payment process was canceled. You have not been charged.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            If you canceled by mistake or wish to try again, you can return to the subscription page.
          </p>
          <Link href="/subscription" passHref>
            <Button>
              Return to Subscription Page
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
