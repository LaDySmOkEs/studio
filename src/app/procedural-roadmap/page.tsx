
// src/app/procedural-roadmap/page.tsx
"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Route, Loader2, Info, AlertTriangle, FileText, CalendarDays, ExternalLink, MapIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleGenerateRoadmapAction } from "./actions";
import type { GenerateProceduralRoadmapInput, GenerateProceduralRoadmapOutput, RoadmapStep } from "@/ai/flows/generateProceduralRoadmap";

const LOCAL_STORAGE_KEY_CASE_ANALYSIS = "dueProcessAICaseAnalysisData";

interface StoredCaseData {
  caseDetails: string;
  caseCategory: "general" | "criminal" | "civil";
}

export default function ProceduralRoadmapPage() {
  const [caseDetails, setCaseDetails] = useState("");
  const [caseCategory, setCaseCategory] = useState<"general" | "criminal" | "civil" | "">("");
  const [currentStage, setCurrentStage] = useState("");
  const [jurisdictionInfo, setJurisdictionInfo] = useState("");
  
  const [roadmapOutput, setRoadmapOutput] = useState<GenerateProceduralRoadmapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskCompletion, setTaskCompletion] = useState<Record<string, boolean>>({});

  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY_CASE_ANALYSIS);
      if (storedDataString) {
        const storedData: StoredCaseData = JSON.parse(storedDataString);
        if (storedData.caseDetails) setCaseDetails(storedData.caseDetails);
        if (storedData.caseCategory) setCaseCategory(storedData.caseCategory);
      }
    } catch (e) {
      console.error("Failed to load or parse case data from localStorage", e);
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!caseDetails || !caseCategory || !currentStage || !jurisdictionInfo) {
      toast({ title: "Missing Information", description: "Please fill out all fields to generate a roadmap.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setError(null);
    setRoadmapOutput(null);
    setTaskCompletion({});

    const input: GenerateProceduralRoadmapInput = {
      caseDetails,
      caseCategory: caseCategory as "general" | "criminal" | "civil", // Ensure type
      currentStage,
      jurisdictionInfo,
    };

    const result = await handleGenerateRoadmapAction(input);

    if ('error' in result) {
      setError(result.error);
      toast({ title: "Roadmap Generation Failed", description: result.error, variant: "destructive" });
    } else {
      setRoadmapOutput(result);
      toast({ title: "Procedural Roadmap Generated", description: "Review the suggested steps and tasks below." });
    }
    setIsLoading(false);
  };

  const handleTaskToggle = (stepName: string) => {
    setTaskCompletion(prev => ({ ...prev, [stepName]: !prev[stepName] }));
  };
  
  const getDocumentDisplayName = (docType: string): string => {
    if (!docType) return "";
    return docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Route className="w-7 h-7 text-primary" /> Procedural Roadmap Generator
          </CardTitle>
          <CardDescription>
            Enter details about your case, its current stage, and jurisdiction to get an AI-generated overview of potential procedural steps, tasks, and general timelines. This tool helps you anticipate what might come next.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="caseDetailsRoadmap">Case Details (Summary)</Label>
              <Textarea
                id="caseDetailsRoadmap"
                value={caseDetails}
                onChange={(e) => setCaseDetails(e.target.value)}
                placeholder="Provide a summary of your case. If you used Case Analysis, this may be pre-filled."
                rows={5}
                required
                aria-label="Case details summary"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="caseCategoryRoadmap">Case Category</Label>
                <Select onValueChange={(value) => setCaseCategory(value as "general" | "criminal" | "civil" | "")} value={caseCategory} required>
                  <SelectTrigger id="caseCategoryRoadmap" aria-label="Select case category">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="criminal">Criminal Law</SelectItem>
                    <SelectItem value="civil">Civil Law</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currentStageRoadmap">Current Stage of Case</Label>
                <Input
                  id="currentStageRoadmap"
                  value={currentStage}
                  onChange={(e) => setCurrentStage(e.target.value)}
                  placeholder="e.g., Just filed complaint, Awaiting arraignment"
                  required
                  aria-label="Current stage of case"
                />
              </div>
              <div>
                <Label htmlFor="jurisdictionInfoRoadmap">Jurisdiction Information</Label>
                <Input
                  id="jurisdictionInfoRoadmap"
                  value={jurisdictionInfo}
                  onChange={(e) => setJurisdictionInfo(e.target.value)}
                  placeholder="e.g., State Court, NY; Federal, CA Central District"
                  required
                  aria-label="Jurisdiction information"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapIcon className="mr-2 h-4 w-4" />}
              Generate Procedural Roadmap
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Generating Roadmap</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {roadmapOutput && (
        <Card className="shadow-md mt-6">
          <CardHeader>
            <CardTitle>Generated Procedural Roadmap</CardTitle>
            <CardDescription>
              Below are AI-suggested procedural steps. Use the checkboxes to track your progress on tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-[500px] pr-3">
              {roadmapOutput.roadmapSteps.map((step, index) => (
                <Card key={index} className="mb-4 p-4 bg-muted/30">
                  <div className="flex items-start gap-3">
                    {step.isTask && (
                      <Checkbox
                        id={`task-${index}`}
                        checked={taskCompletion[step.stepName] || false}
                        onCheckedChange={() => handleTaskToggle(step.stepName)}
                        className="mt-1"
                        aria-label={`Mark task ${step.stepName} as complete`}
                      />
                    )}
                    <div className="flex-grow">
                      <Label htmlFor={step.isTask ? `task-${index}` : undefined} className={`font-semibold text-md ${taskCompletion[step.stepName] ? 'line-through text-muted-foreground' : ''}`}>
                        {step.stepName}
                      </Label>
                      <p className={`text-sm mt-1 ${taskCompletion[step.stepName] ? 'text-muted-foreground' : 'text-foreground/80'}`}>
                        {step.description}
                      </p>
                      {step.estimatedDueDate && (
                        <p className="text-xs text-primary mt-1 flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          Est. Due: {step.estimatedDueDate}
                        </p>
                      )}
                      {step.relatedDocuments && step.relatedDocuments.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-xs font-semibold text-muted-foreground">Related Documents:</h5>
                          <ul className="list-disc list-inside pl-1 text-xs">
                            {step.relatedDocuments.map((doc, docIndex) => (
                              <li key={docIndex}>
                                <Link href={`/document-generator?suggested=${doc.toLowerCase().replace(/\s+/g, '')}`} className="text-accent hover:underline flex items-center gap-1">
                                  {getDocumentDisplayName(doc)}
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </ScrollArea>
            <Alert variant="default" className="border-accent bg-accent/10">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <AlertTitle className="font-semibold text-accent">Important Disclaimer</AlertTitle>
              <AlertDescription>{roadmapOutput.disclaimer}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
        {!roadmapOutput && !isLoading && !error && (
         <Card className="shadow-md mt-6">
            <CardHeader>
                <CardTitle>Guidance on Using the Roadmap Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>This tool helps you anticipate potential steps in a legal process. To get started:</p>
                <ul className="list-decimal pl-5 space-y-1">
                    <li><strong>Provide Case Details:</strong> A clear summary of your situation.</li>
                    <li><strong>Select Case Category:</strong> Choose general, criminal, or civil.</li>
                    <li><strong>Describe Current Stage:</strong> Explain where you are right now in the legal process (e.g., "just received a summons," "preparing for first court date," "negotiating a plea").</li>
                    <li><strong>Jurisdiction Information:</strong> Mention the court system (e.g., "State Court of Georgia, Fulton County," "Federal Court, Northern District of Illinois," "Small Claims, Austin, TX"). While the AI provides general guidance, this context can be helpful.</li>
                </ul>
                <p>The AI will then generate a list of potential next steps, tasks, and general timelines. Remember, this is for informational purposes and not legal advice.</p>
                <Alert variant="default" className="border-accent bg-accent/10 mt-4">
                    <Info className="h-4 w-4 text-accent" />
                    <AlertTitle className="font-semibold text-accent">This is Not Legal Advice</AlertTitle>
                    <AlertDescription>
                        The generated roadmap is based on common procedures and AI understanding. It does not replace the need for specific legal advice from a qualified attorney or a thorough review of your jurisdiction's specific court rules and statutes. Deadlines and procedures can vary significantly.
                    </AlertDescription>
                </Alert>
            </CardContent>
         </Card>
        )}
    </div>
  );
}
