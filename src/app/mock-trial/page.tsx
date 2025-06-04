
// src/app/mock-trial/page.tsx
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Gavel, AlertTriangle, ScrollText, MessageCircle, Loader2, Info, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleGenerateMockTrialScriptAction } from "./actions";
import type { GenerateMockTrialScriptInput, GenerateMockTrialScriptOutput, GenerateMockTrialScriptStep } from "@/ai/flows/generateMockTrialScript"; // Assuming GenerateMockTrialScriptStep is exported type for a step
import { ScrollArea } from "@/components/ui/scroll-area";

const LOCAL_STORAGE_KEY_CASE_ANALYSIS = "dueProcessAICaseAnalysisData";

interface StoredCaseData {
  caseDetails: string;
  caseCategory: "general" | "criminal" | "civil";
}

const PROCEEDING_TYPES = [
  { value: "SMALL_CLAIMS_PLAINTIFF", label: "Small Claims (I am Plaintiff)", userRole: "Plaintiff" },
  { value: "SMALL_CLAIMS_DEFENDANT", label: "Small Claims (I am Defendant)", userRole: "Defendant" },
  { value: "EVICTION_HEARING_TENANT", label: "Eviction Hearing (I am Tenant)", userRole: "Tenant" },
  { value: "EVICTION_HEARING_LANDLORD", label: "Eviction Hearing (I am Landlord)", userRole: "Landlord" },
  { value: "CIVIL_MOTION_MOVANT", label: "Civil Motion Hearing (I am filing/arguing for the motion)", userRole: "Movant" },
  { value: "CIVIL_MOTION_RESPONDENT", label: "Civil Motion Hearing (I am opposing the motion)", userRole: "Respondent" },
  { value: "TRAFFIC_TICKET_DEFENSE", label: "Traffic Ticket Challenge (I am Defendant)", userRole: "Defendant" },
  { value: "GENERAL_CIVIL_TRIAL_PLAINTIFF", label: "General Civil Trial (I am Plaintiff)", userRole: "Plaintiff" },
  { value: "GENERAL_CIVIL_TRIAL_DEFENDANT", label: "General Civil Trial (I am Defendant)", userRole: "Defendant" },
];

export default function MockTrialPage() {
  const [storedCaseSummary, setStoredCaseSummary] = useState<string | null>(null);
  const [selectedProceedingType, setSelectedProceedingType] = useState<string>("");
  
  const [generatedScript, setGeneratedScript] = useState<GenerateMockTrialScriptStep[] | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentUserInput, setCurrentUserInput] = useState("");
  const [transcript, setTranscript] = useState<{ role: string; line: string }[]>([]);
  
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY_CASE_ANALYSIS);
      if (storedDataString) {
        const storedData: StoredCaseData = JSON.parse(storedDataString);
        setStoredCaseSummary(storedData.caseDetails);
      }
    } catch (e) {
      console.error("Failed to load or parse case data from localStorage", e);
      toast({ title: "Error", description: "Could not load stored case summary.", variant: "destructive" });
    }
  }, [toast]);

  const handleGenerateScript = async () => {
    if (!storedCaseSummary) {
      toast({ title: "Case Summary Needed", description: "Please provide case details in the Case Analysis section first.", variant: "destructive" });
      return;
    }
    if (!selectedProceedingType) {
      toast({ title: "Proceeding Type Needed", description: "Please select the type of proceeding you want to simulate.", variant: "destructive" });
      return;
    }

    setIsGeneratingScript(true);
    setGeneratedScript(null);
    setTranscript([]);
    setCurrentStep(0);
    setCurrentUserInput("");

    const proceedingDetail = PROCEEDING_TYPES.find(p => p.value === selectedProceedingType);
    if (!proceedingDetail) {
        toast({ title: "Error", description: "Invalid proceeding type selected.", variant: "destructive"});
        setIsGeneratingScript(false);
        return;
    }

    const input: GenerateMockTrialScriptInput = {
      caseNarrative: storedCaseSummary,
      proceedingType: proceedingDetail.value as any, // Cast as AI flow enum type expects specific string literals
      userRoleInProceeding: proceedingDetail.userRole,
    };

    const result = await handleGenerateMockTrialScriptAction(input);

    if ('error' in result) {
      toast({ title: "Script Generation Failed", description: result.error, variant: "destructive" });
    } else if (result.steps && result.steps.length > 0) {
      setGeneratedScript(result.steps);
      // Initialize with the first line if it's not user input
      if (!result.steps[0].isUserInput) {
        setTranscript([{ role: result.steps[0].role, line: result.steps[0].lineOrPrompt }]);
      }
    } else {
      toast({ title: "Script Generation Issue", description: "The AI generated an empty or invalid script. Please try again or rephrase your case summary.", variant: "destructive" });
    }
    setIsGeneratingScript(false);
  };

  const handleNextStepOrSubmit = () => {
    if (!generatedScript || currentStep >= generatedScript.length) {
      toast({ title: "Simulation Ended", description: "You have reached the end of this mock trial."});
      return;
    }

    const currentScriptItem = generatedScript[currentStep];
    let newTranscript = [...transcript];

    if (currentScriptItem.isUserInput) {
      newTranscript.push({ role: `You (as ${PROCEEDING_TYPES.find(p=>p.value === selectedProceedingType)?.userRole || 'User'})`, line: currentUserInput.trim() || "(No response provided)" });
      setCurrentUserInput("");
    } else {
      // If the current line is an AI line and it's not already the last item in transcript (to avoid duplicates on first load)
      if (newTranscript.length === 0 || newTranscript[newTranscript.length - 1].line !== currentScriptItem.lineOrPrompt || newTranscript[newTranscript.length -1].role !== currentScriptItem.role) {
         // This condition is tricky for the very first AI line if it was pre-added. Let's ensure it's not a user input step.
         // Add if it's not a user input and the current step's dialogue isn't already the last thing in the transcript
         if (transcript.length === currentStep) { // Only add AI line if we are advancing to it
            newTranscript.push({ role: currentScriptItem.role, line: currentScriptItem.lineOrPrompt });
         }
      }
    }
    
    setTranscript(newTranscript);
    const nextStepIndex = currentStep + 1;
    setCurrentStep(nextStepIndex);

    if (nextStepIndex < generatedScript.length) {
      const nextScriptItem = generatedScript[nextStepIndex];
      if (!nextScriptItem.isUserInput) {
        // If next is also AI, add it immediately to transcript. UI will show it.
        // This creates an effect of AI speaking, then prompting user if next.
         setTranscript(prev => [...prev, { role: nextScriptItem.role, line: nextScriptItem.lineOrPrompt }]);
      }
    } else {
      toast({ title: "Simulation Ended", description: "You have reached the end of this mock trial."});
    }
  };
  
  const currentScriptItem = generatedScript && currentStep < generatedScript.length ? generatedScript[currentStep] : null;
  const userPrompt = currentScriptItem?.isUserInput ? currentScriptItem.lineOrPrompt : "";

  let buttonText = "Generate Personalized Mock Trial";
  let buttonAction = handleGenerateScript;
  let buttonDisabled = isGeneratingScript || !storedCaseSummary || !selectedProceedingType;

  if (generatedScript) {
    if (currentStep >= generatedScript.length) {
      buttonText = "Simulation Ended";
      buttonDisabled = true;
    } else if (currentScriptItem?.isUserInput) {
      buttonText = "Submit & Continue";
      buttonAction = handleNextStepOrSubmit;
      buttonDisabled = false; 
    } else {
      buttonText = "Continue to Next Step";
      buttonAction = handleNextStepOrSubmit;
      buttonDisabled = false;
    }
  }


  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Gavel className="w-7 h-7 text-primary" /> Personalized Mock Trial Simulator
          </CardTitle>
          <CardDescription>
            Use your case narrative to generate a personalized mock trial script. Practice responding to common court interactions based on your specific situation. This tool helps demystify courtroom dynamics. This is a simulation and NOT legal advice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {storedCaseSummary ? (
            <Card className="bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2"><Info className="w-5 h-5 text-muted-foreground" />Current Case Context</CardTitle>
                <CardDescription className="text-xs">This summary from Case Analysis will be used to generate the mock trial script.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea value={storedCaseSummary} readOnly rows={3} className="text-sm bg-background cursor-default h-auto" aria-label="Stored case summary" />
              </CardContent>
            </Card>
          ) : (
            <Alert variant="default" className="border-primary bg-primary/5">
              <Info className="h-5 w-5 text-primary" />
              <AlertTitle className="font-semibold text-primary">Case Details Needed</AlertTitle>
              <AlertDescription>
                Please go to the "Case Analysis" page and enter your case details first. This summary will be used to generate your personalized mock trial.
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="proceeding-type-select">Select Type of Proceeding to Simulate</Label>
            <Select onValueChange={setSelectedProceedingType} value={selectedProceedingType} disabled={!storedCaseSummary || isGeneratingScript || !!generatedScript}>
              <SelectTrigger id="proceeding-type-select" aria-label="Select proceeding type">
                <SelectValue placeholder="Choose a proceeding type..." />
              </SelectTrigger>
              <SelectContent>
                {PROCEEDING_TYPES.map(pt => (
                  <SelectItem key={pt.value} value={pt.value}>{pt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={buttonAction} disabled={buttonDisabled} className="w-full sm:w-auto">
            {isGeneratingScript ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (generatedScript && currentStep < generatedScript.length) ? null : <Brain className="mr-2 h-4 w-4" />}
            {isGeneratingScript ? "Generating Script..." : buttonText}
          </Button>
          {generatedScript && (
             <Button variant="outline" onClick={() => { setGeneratedScript(null); setTranscript([]); setCurrentStep(0); setSelectedProceedingType(""); }} disabled={isGeneratingScript}>
                Start New Simulation
            </Button>
          )}

          {generatedScript && (
            <Card className="border-primary mt-6">
              <CardHeader>
                <CardTitle className="text-xl">Simulation: {PROCEEDING_TYPES.find(s => s.value === selectedProceedingType)?.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-80 overflow-y-auto p-3 bg-muted/50 rounded-md space-y-2 border">
                  <h3 className="text-sm font-semibold mb-2 sticky top-0 bg-muted/50 py-1 z-10 flex items-center gap-1">
                    <ScrollText className="w-4 h-4"/>Transcript
                  </h3>
                  {transcript.map((entry, index) => (
                    <div key={index} className={`text-sm ${entry.role.startsWith("You") ? "text-blue-600 dark:text-blue-400 font-medium" : "text-foreground"}`}>
                      <strong>{entry.role}:</strong> {entry.line}
                    </div>
                  ))}
                </ScrollArea>

                {currentScriptItem?.isUserInput && currentStep < generatedScript.length && (
                  <div className="space-y-2">
                    <Label htmlFor="user-response" className="font-semibold flex items-center gap-1">
                      <MessageCircle className="w-4 h-4"/>{userPrompt}
                    </Label>
                    <Textarea
                      id="user-response"
                      value={currentUserInput}
                      onChange={(e) => setCurrentUserInput(e.target.value)}
                      placeholder="Type your response here..."
                      rows={5}
                      aria-label="Your response in the mock trial"
                      className="border-primary focus:ring-primary"
                    />
                  </div>
                )}
                {!currentScriptItem?.isUserInput && currentScriptItem && currentStep < generatedScript.length && (
                   <Alert variant="default" className="border-accent bg-accent/5">
                      <Info className="h-5 w-5 text-accent" />
                      <AlertTitle className="font-semibold text-accent">Next: {currentScriptItem.role} speaks</AlertTitle>
                      <AlertDescription>
                       Click "Continue to Next Step" to see their dialogue.
                      </AlertDescription>
                    </Alert>
                )}

              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Alert variant="default" className="border-accent bg-accent/10">
        <AlertTriangle className="h-5 w-5 text-accent" />
        <AlertTitle className="font-semibold text-accent">Important Disclaimer</AlertTitle>
        <AlertDescription>
          This mock trial simulator uses AI to generate scripts based on your input. It is a simplified tool for practice and familiarization. Actual court proceedings are complex and vary significantly. This simulation does not constitute legal advice and should not replace consultation with a qualified attorney.
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Helper type (could be in a types file if more broadly used)
declare global {
    interface GenerateMockTrialScriptStep {
        role: string;
        lineOrPrompt: string;
        isUserInput?: boolean;
    }
}
