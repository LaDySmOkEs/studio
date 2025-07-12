
"use client";

import { LogoIcon } from "@/components/icons/logo-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, FileSignature } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12">
      <Card className="w-full max-w-2xl text-center shadow-xl p-6 md:p-10">
        <CardHeader className="items-center">
          <LogoIcon className="w-24 h-24 text-primary mb-6" />
          <CardTitle className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            DUE PROCESS AI
          </CardTitle>
          <CardDescription className="text-lg md:text-xl text-muted-foreground mt-3">
            Empowering Your Legal Journey with AI-Assisted Insights & Tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-left text-md">
          <p>
            Welcome to DUE PROCESS AI, the first tool of its kind designed to give power back to the people in the courtroom.
            Navigating the legal system can be daunting. Our mission is to make legal concepts more accessible, help you understand your rights, prepare your case, and identify potential areas of concern regarding due process.
          </p>
          
          <Alert variant="default" className="border-primary bg-primary/5">
              <FileSignature className="h-5 w-5 text-primary" />
              <AlertTitle className="font-semibold text-primary">A Tool for Transparency: The Violations Registry</AlertTitle>
              <AlertDescription>
                A core part of our mission is the <Link href="/violations-registry" className="font-bold hover:underline">Due Process Violations Registry</Link>. This is a free feature for everyone to report and bring light to alleged instances of official misconduct. By creating a public record, we aim to foster transparency and accountability where it's needed most.
              </AlertDescription>
          </Alert>

          <p>
            Whether you're representing yourself (Pro Se), working with an attorney, or simply trying to understand a complex legal situation, DUE PROCESS AI offers a suite of tools:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-4 text-muted-foreground">
            <li>Analyze your case narrative for relevant laws and potential due process issues.</li>
            <li>Generate templates for common legal documents.</li>
            <li>Organize your evidence and build a timeline of events.</li>
            <li>Practice courtroom communication and prepare for negotiations.</li>
            <li>And much more...</li>
          </ul>
          <p className="font-semibold text-destructive">
            Disclaimer: DUE PROCESS AI is an informational tool and does not provide legal advice. All outputs and suggestions should be reviewed by a qualified legal professional.
          </p>
        </CardContent>
        <div className="mt-8">
          <Link href="/case-analysis" passHref>
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
