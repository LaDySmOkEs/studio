
// src/app/negotiation-coach/page.tsx
"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users, Loader2, Info, AlertTriangle, Brain, FileText, ListChecks, MessageSquareWarning } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleGenerateNegotiationAdviceAction } from "./actions";
import type { GenerateNegotiationAdviceInput, GenerateNegotiationAdviceOutput } from "@/ai/flows/generateNegotiationAdvice";

const LOCAL_STORAGE_KEY_CASE_ANALYSIS = "dueProcessAICaseAnalysisData";

interface StoredCaseData {
  caseDetails: string;
  caseCategory: "general" | "criminal" | "civil";
}

const NEGOTIATION_STANCES = [
  { value: "SEEKING_QUICK_RESOLUTION", label: "Seeking Quick Resolution" },
  { value: "WILLING_TO_BE_FLEXIBLE", label: "Willing to be Flexible / Compromise" },
  { value: "HOLDING_FIRM_ON_KEY_POINTS", label: "Holding Firm on Key Points" },
  { value: "EXPLORING_ALL_OPTIONS", label: "Exploring All Options / Information Gathering" },
  { value: "FOCUSED_ON_NON_MONETARY_TERMS", label: "Focused on Non-Monetary Terms" },
  { value: "PREPARING_FOR_LENGTHY_NEGOTIATION", label: "Preparing for Potentially Lengthy Negotiation" },
];

const COMMON_NEGOTIATION_TACTICS = [
  { name: "Anchoring", description: "Making an extreme first offer to set the perceived value range." },
  { name: "Good Cop / Bad Cop", description: "One negotiator is aggressive, the other reasonable, to make the 'reasonable' offer seem better." },
  { name: "Nibbling", description: "Asking for small concessions right at the end, after the main deal seems agreed." },
  { name: "Limited Authority", description: "Claiming they need approval for concessions, delaying or deflecting." },
  { name: "Time Pressure", description: "Creating artificial urgency to force a quick decision." },
  { name: "Silence", description: "Using prolonged silence to make the other party uncomfortable and potentially concede." },
  { name: "Emotional Appeals", description: "Using emotion (sympathy, guilt) rather than logic to persuade." },
];

export default function NegotiationCoachPage() {
  const [caseSummary, setCaseSummary] = useState("");
  const [negotiationGoal, setNegotiationGoal] = useState("");
  const [userStance, setUserStance] = useState<string>("");
  
  const [adviceOutput, setAdviceOutput] = useState<GenerateNegotiationAdviceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY_CASE_ANALYSIS);
      if (storedDataString) {
        const storedData: StoredCaseData = JSON.parse(storedDataString);
        if (storedData.caseDetails) setCaseSummary(storedData.caseDetails);
      }
    } catch (e) {
      console.error("Failed to load or parse case data from localStorage", e);
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!caseSummary || !negotiationGoal || !userStance) {
      toast({ title: "Missing Information", description: "Please fill out all fields for negotiation coaching.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAdviceOutput(null);

    const input: GenerateNegotiationAdviceInput = {
      caseSummary,
      negotiationGoal,
      userStance: userStance as any, // Zod enum in flow will validate
    };

    const result = await handleGenerateNegotiationAdviceAction(input);

    if ('error' in result) {
      setError(result.error);
      toast({ title: "Coaching Advice Failed", description: result.error, variant: "destructive" });
    } else {
      setAdviceOutput(result);
      toast({ title: "Negotiation Advice Generated", description: "Review the AI's suggestions below." });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" /> AI Negotiation &amp; Mediation Coach
          </CardTitle>
          <CardDescription>
            Get AI-powered insights to help you prepare for negotiations or mediations. This tool provides general advice, points to consider, and information on common tactics. It does not simulate an opponent or provide specific settlement offers.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="caseSummaryNegotiation">Case Summary / Situation</Label>
              <Textarea
                id="caseSummaryNegotiation"
                value={caseSummary}
                onChange={(e) => setCaseSummary(e.target.value)}
                placeholder="Briefly describe the situation you're negotiating. Pre-filled if available from Case Analysis."
                rows={4}
                required
                aria-label="Case summary for negotiation"
              />
            </div>
            <div>
              <Label htmlFor="negotiationGoal">Primary Goal for this Negotiation</Label>
              <Input
                id="negotiationGoal"
                value={negotiationGoal}
                onChange={(e) => setNegotiationGoal(e.target.value)}
                placeholder="e.g., Settle outstanding debt, Resolve contract dispute, Agree on parenting time"
                required
                aria-label="Primary goal for negotiation"
              />
            </div>
            <div>
              <Label htmlFor="userStance">Your General Stance/Approach</Label>
              <Select onValueChange={setUserStance} value={userStance} required>
                <SelectTrigger id="userStance" aria-label="Select your negotiation stance">
                  <SelectValue placeholder="Select your approach..." />
                </SelectTrigger>
                <SelectContent>
                  {NEGOTIATION_STANCES.map(stance => (
                    <SelectItem key={stance.value} value={stance.value}>{stance.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
              Get Negotiation Coaching Advice
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Generating Advice</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {adviceOutput && (
        <Card className="shadow-md mt-6 border-primary">
          <CardHeader>
            <CardTitle>AI Coaching Advice</CardTitle>
            <CardDescription>Review the AI's suggestions below. Remember, this is general guidance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {adviceOutput.generalAdvice && adviceOutput.generalAdvice.length > 0 && (
              <div>
                <h4 className="font-semibold text-md text-primary flex items-center gap-1"><ListChecks className="w-4 h-4" />General Negotiation Advice:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {adviceOutput.generalAdvice.map((tip, index) => <li key={index}>{tip}</li>)}
                </ul>
              </div>
            )}
            {adviceOutput.pointsToConsider && adviceOutput.pointsToConsider.length > 0 && (
              <div>
                <h4 className="font-semibold text-md text-primary flex items-center gap-1"><Brain className="w-4 h-4" />Key Points to Consider:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {adviceOutput.pointsToConsider.map((point, index) => <li key={index}>{point}</li>)}
                </ul>
              </div>
            )}
            {adviceOutput.potentialTacticsToWatchFor && adviceOutput.potentialTacticsToWatchFor.length > 0 && (
              <div>
                <h4 className="font-semibold text-md text-primary flex items-center gap-1"><MessageSquareWarning className="w-4 h-4" />Potential Tactics to Watch For:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {adviceOutput.potentialTacticsToWatchFor.map((tactic, index) => <li key={index}>{tactic}</li>)}
                </ul>
              </div>
            )}
            <Alert variant="default" className="mt-4 border-accent bg-accent/10">
              <Info className="h-4 w-4 text-accent" />
              <AlertTitle className="font-semibold text-accent">Disclaimer</AlertTitle>
              <AlertDescription>{adviceOutput.disclaimer}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-md">
        <CardHeader>
            <CardTitle>Understanding Common Negotiation Tactics</CardTitle>
            <CardDescription>Familiarize yourself with these common tactics you might encounter.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
            {COMMON_NEGOTIATION_TACTICS.map(tactic => (
                <div key={tactic.name} className="p-3 border rounded-md bg-muted/30">
                    <h5 className="font-semibold text-sm">{tactic.name}</h5>
                    <p className="text-xs text-muted-foreground">{tactic.description}</p>
                </div>
            ))}
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader>
            <CardTitle>Settlement Agreement Template</CardTitle>
            <CardDescription>If your negotiation leads to an agreement, you'll likely need a written document. This links to a generic template.</CardDescription>
        </CardHeader>
        <CardContent>
            <Link href="/document-generator?suggested=settlementAgreement" passHref>
                <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" /> Go to Settlement Agreement Template
                </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-2">
                Remember: Settlement agreements are legally binding. It is highly recommended to have any settlement agreement reviewed by a qualified attorney before signing.
            </p>
        </CardContent>
      </Card>

      <Alert variant="default" className="border-accent bg-accent/10">
        <AlertTriangle className="h-5 w-5 text-accent" />
        <AlertTitle className="font-semibold text-accent">Important Disclaimer</AlertTitle>
        <AlertDescription>
          This AI Negotiation Coach is for informational and educational purposes only. It does not provide legal advice, financial advice, or professional negotiation services. Always consult with qualified professionals (attorneys, mediators, financial advisors) for guidance tailored to your specific situation. AI suggestions are general and may not be applicable or appropriate for your unique circumstances.
        </AlertDescription>
      </Alert>
    </div>
  );
}

