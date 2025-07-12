
// src/app/violations-registry/page.tsx
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scale, Loader2, Info, AlertTriangle, FileSignature, Brain, ShieldCheck, Tag, Handshake } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleViolationReportAction } from "./actions";
import type { ViolationReportInput, ViolationAnalysisOutput } from "@/ai/schemas/violationReportSchemas";
import { Badge } from "@/components/ui/badge";


const VIOLATION_CATEGORIES = [
    "Unlawful Search & Seizure (4th Am.)",
    "Self-Incrimination / Miranda Rights (5th Am.)",
    "Right to Counsel (6th Am.)",
    "Speedy Trial Right (6th Am.)",
    "Cruel and Unusual Punishment (8th Am.)",
    "Procedural Due Process (Notice & Hearing)",
    "Substantive Due Process (Fundamental Rights)",
    "Equal Protection (Discrimination)",
    "First Amendment (Speech, Assembly, Religion)",
    "Malicious Prosecution / Abuse of Process",
    "Evidence Tampering / Brady Violation",
    "Excessive Force",
    "Coercion / Intimidation",
    "Other"
];

const LOCAL_STORAGE_KEY_CASE_ANALYSIS = "dueProcessAICaseAnalysisData";

interface StoredCaseData {
  caseDetails: string;
  caseCategory: "general" | "criminal" | "civil";
}

export default function ViolationsRegistryPage() {
  const [narrative, setNarrative] = useState("");
  const [involvedParties, setInvolvedParties] = useState("");
  const [violationCategory, setViolationCategory] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  
  const [analysisOutput, setAnalysisOutput] = useState<ViolationAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

   useEffect(() => {
    try {
      const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY_CASE_ANALYSIS);
      if (storedDataString) {
        const storedData: StoredCaseData = JSON.parse(storedDataString);
        if (storedData.caseDetails && !narrative) {
            setNarrative(storedData.caseDetails);
             toast({ title: "Case Details Loaded", description: "Your narrative has been pre-filled from your saved Case Analysis.", variant: "default" });
        }
      }
    } catch (e) {
      console.error("Failed to load or parse case data from localStorage", e);
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!narrative || !violationCategory || !jurisdiction) {
      toast({ title: "Missing Information", description: "Please fill out Narrative, Violation Category, and Jurisdiction.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisOutput(null);

    const input: ViolationReportInput = {
      narrative,
      involvedParties,
      violationCategory,
      eventDate,
      jurisdiction,
    };

    const result = await handleViolationReportAction(input);

    if ('error' in result) {
      setError(result.error);
      toast({ title: "Report Analysis Failed", description: result.error, variant: "destructive" });
    } else {
      setAnalysisOutput(result);
      toast({ title: "Report Submitted & Analyzed", description: "The AI has provided a conceptual analysis of your report below." });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileSignature className="w-7 h-7 text-primary" /> Due Process Violations Registry
          </CardTitle>
          <CardDescription>
            Report alleged instances of due process violations or official misconduct. This information can be used to identify patterns and connect with others who have had similar experiences.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Alert variant="default" className="mb-6 border-accent bg-accent/10">
              <Handshake className="h-5 w-5 text-accent" />
              <AlertTitle className="font-semibold text-accent">A Free Tool for Transparency</AlertTitle>
              <AlertDescription>
                This registry is a free feature for all users. We believe that providing a space for people to report alleged misconduct is a crucial step toward transparency and accountability. By documenting these events, we can help inform the public and challenge systems like qualified immunity that may shield misconduct from scrutiny.
                <br/><strong>Note:</strong> In this prototype, reports are for your session only and are not stored in a public database.
              </AlertDescription>
            </Alert>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="narrative">Narrative of Events*</Label>
                <Textarea
                  id="narrative"
                  value={narrative}
                  onChange={(e) => setNarrative(e.target.value)}
                  placeholder="Describe the incident(s) in detail. What happened, who was involved, where and when did it occur?"
                  rows={8}
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="involvedParties">Involved Parties/Agency (Optional)</Label>
                  <Input
                    id="involvedParties"
                    value={involvedParties}
                    onChange={(e) => setInvolvedParties(e.target.value)}
                    placeholder="e.g., Anytown Police Dept., Officer John Doe, County Clerk's Office"
                  />
                </div>
                  <div>
                    <Label htmlFor="eventDate">Approximate Date of Main Event (Optional)</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                  </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="violationCategory">Primary Violation Category*</Label>
                      <Select onValueChange={setViolationCategory} value={violationCategory} required>
                      <SelectTrigger id="violationCategory">
                          <SelectValue placeholder="Select the main type of violation..." />
                      </SelectTrigger>
                      <SelectContent>
                          {VIOLATION_CATEGORIES.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                      </SelectContent>
                      </Select>
                  </div>
                  <div>
                      <Label htmlFor="jurisdiction">Jurisdiction (State, County, or City)*</Label>
                      <Input
                      id="jurisdiction"
                      value={jurisdiction}
                      onChange={(e) => setJurisdiction(e.target.value)}
                      placeholder="e.g., State of California, Travis County TX, New York City"
                      required
                      />
                  </div>
              </div>
            </div>
             <CardFooter className="px-0 pt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
                Submit Report for AI Analysis
              </Button>
            </CardFooter>
          </form>
        </CardContent>
       
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Generating Analysis</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysisOutput && (
        <Card className="shadow-md mt-6 border-primary">
          <CardHeader>
            <CardTitle>AI Analysis of Your Report</CardTitle>
            <CardDescription>Below is the AI's conceptual analysis based on your submission. This is for informational purposes only.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-md text-primary flex items-center gap-1"><ShieldCheck className="w-4 h-4" />Potential Due Process Elements Identified:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {analysisOutput.potentialDueProcessElements.length > 0 ? analysisOutput.potentialDueProcessElements.map((element, index) => <li key={index}>{element}</li>)
                : <li>No specific elements were automatically identified.</li>}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-md text-primary flex items-center gap-1"><Tag className="w-4 h-4" />Suggested Keywords for Research:</h4>
               <div className="flex flex-wrap gap-2 pt-1">
                 {analysisOutput.suggestedKeywords.length > 0 ? analysisOutput.suggestedKeywords.map((kw, index) => <Badge key={index} variant="secondary">{kw}</Badge>)
                 : <p className="text-sm text-muted-foreground">No specific keywords suggested.</p>}
               </div>
            </div>
            <div>
                <h4 className="font-semibold text-md text-primary">Conceptual Next Steps & Considerations:</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysisOutput.conceptualNextSteps}</p>
            </div>
            <Alert variant="default" className="mt-4 border-accent bg-accent/10">
              <Info className="h-4 w-4 text-accent" />
              <AlertTitle className="font-semibold text-accent">Disclaimer</AlertTitle>
              <AlertDescription>{analysisOutput.disclaimer}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      <Alert variant="default" className="border-destructive bg-destructive/10">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <AlertTitle className="font-semibold text-destructive">Important Disclaimer & Note on Use</AlertTitle>
        <AlertDescription>
          This registry is a tool for personal organization and to receive AI-powered conceptual feedback. The AI analysis is NOT legal advice. In a future version, this feature could allow users (with explicit consent) to connect with others who have reported similar patterns of misconduct to specific agencies or officials.
          <br/><strong>Currently, all submissions are processed for your session only and are NOT stored in any database or shared.</strong>
        </AlertDescription>
      </Alert>
    </div>
  );
}
