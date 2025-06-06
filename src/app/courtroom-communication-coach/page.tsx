
// src/app/courtroom-communication-coach/page.tsx
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageSquareQuote, AlertTriangle, Loader2, Info, Brain, Mic, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleGeneratePhrasingSuggestionsAction } from "./actions";
import type { GenerateCourtroomPhrasingInput, GenerateCourtroomPhrasingOutput } from "@/ai/flows/generateCourtroomPhrasingSuggestions";
import { ScrollArea } from "@/components/ui/scroll-area";

const LOCAL_STORAGE_KEY_CASE_ANALYSIS = "dueProcessAICaseAnalysisData";

interface StoredCaseData {
  caseDetails: string;
  caseCategory: "general" | "criminal" | "civil";
}

const STATEMENT_CONTEXT_OPTIONS = [
  { value: "ADDRESSING_JUDGE", label: "Addressing the Judge" },
  { value: "OPENING_STATEMENT", label: "Making an Opening Statement" },
  { value: "DIRECT_EXAMINATION", label: "Questioning My Witness (Direct Examination)" },
  { value: "CROSS_EXAMINATION", label: "Questioning Opponent's Witness (Cross-Examination)" },
  { value: "MAKING_OBJECTION", label: "Making an Objection" },
  { value: "PRESENTING_EVIDENCE", label: "Presenting Evidence/Exhibit" },
  { value: "CLOSING_ARGUMENT", label: "Making a Closing Argument" },
  { value: "RESPONDING_TO_QUESTION_FROM_JUDGE", label: "Responding to a Question from the Judge" },
  { value: "NEGOTIATION_WITH_OPPOSING_COUNSEL", label: "Negotiation with Opposing Counsel (or party)" },
  { value: "OTHER_COURTROOM_STATEMENT", label: "Other Courtroom Statement" },
];


export default function CourtroomCommunicationCoachPage() {
  const [storedCaseSummary, setStoredCaseSummary] = useState<string | null>(null);
  const [keyPointsOrTopic, setKeyPointsOrTopic] = useState(""); // Changed from userStatement
  const [statementContext, setStatementContext] = useState<string>("");
  
  const [suggestionsOutput, setSuggestionsOutput] = useState<GenerateCourtroomPhrasingOutput | null>(null);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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

  const handleGenerateSuggestions = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!keyPointsOrTopic.trim()) { // Changed from userStatement
      toast({ title: "Key Points/Topic Required", description: "Please enter the key points or topic for your statement.", variant: "destructive"});
      return;
    }
    if (!statementContext) {
      toast({ title: "Context Required", description: "Please select the context for your statement.", variant: "destructive"});
      return;
    }

    setIsGeneratingSuggestions(true);
    setSuggestionsOutput(null);
    setError(null);

    const input: GenerateCourtroomPhrasingInput = {
      keyPointsOrTopic, // Changed from userStatement
      statementContext: statementContext as any, 
      caseSummary: storedCaseSummary || undefined,
    };

    const result = await handleGeneratePhrasingSuggestionsAction(input);

    if ('error' in result) {
      setError(result.error);
      toast({ title: "Suggestion Generation Failed", description: result.error, variant: "destructive" });
    } else {
      setSuggestionsOutput(result);
      toast({ title: "AI Statements Generated", description: "Review the AI's suggested statements and tips below." });
    }
    setIsGeneratingSuggestions(false);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <MessageSquareQuote className="w-7 h-7 text-primary" /> Courtroom Communication Coach
          </CardTitle>
          <CardDescription>
            Describe the key points or topic for your statement and select the context. The AI will generate potential statements and offer communication tips. 
            Practice saying the suggested phrasings aloud. Actual audio recording and feedback are conceptual future goals.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleGenerateSuggestions}>
          <CardContent className="space-y-6">
            {storedCaseSummary && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2"><Info className="w-5 h-5 text-muted-foreground" />Case Context for AI</CardTitle>
                  <CardDescription className="text-xs">This summary from Case Analysis can provide helpful context to the AI for more relevant suggestions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea value={storedCaseSummary} readOnly rows={2} className="text-sm bg-background cursor-default h-auto" aria-label="Stored case summary (context for AI)" />
                </CardContent>
              </Card>
            )}

            <div>
              <Label htmlFor="key-points-topic-textarea">What key points do you want to make, or what is the topic of your statement?*</Label> {/* Changed label */}
              <Textarea
                id="key-points-topic-textarea"
                value={keyPointsOrTopic} // Changed from userStatement
                onChange={(e) => setKeyPointsOrTopic(e.target.value)} // Changed from setUserStatement
                placeholder="e.g., 'Need to argue for dismissal due to lack of evidence,' or 'Question witness about their presence at the scene.'" // Changed placeholder
                rows={5}
                required
                className="min-h-[100px]"
                aria-label="Key points or topic of your intended statement"
              />
            </div>

            <div>
              <Label htmlFor="statement-context-select">In what context will this statement be made?*</Label>
              <Select onValueChange={setStatementContext} value={statementContext} required>
                <SelectTrigger id="statement-context-select" aria-label="Select statement context">
                  <SelectValue placeholder="Choose a context..." />
                </SelectTrigger>
                <SelectContent>
                  {STATEMENT_CONTEXT_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isGeneratingSuggestions} className="w-full sm:w-auto">
              {isGeneratingSuggestions ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
              Generate AI Statements
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Generating Statements</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestionsOutput && (
        <Card className="shadow-md mt-6 border-primary">
          <CardHeader>
            <CardTitle className="text-xl">AI-Generated Statements &amp; Communication Tips</CardTitle>
            <CardDescription>Review the AI's generated statements, their rationales, and general tips for your chosen context.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* originalStatementCritique removed */}
            <div>
              <h4 className="font-semibold text-md text-primary">AI-Generated Statements:</h4>
              <ScrollArea className="max-h-[300px] pr-3">
                <ul className="space-y-3">
                  {suggestionsOutput.suggestedPhrasings.map((item, index) => (
                    <li key={index} className="p-3 border rounded-md bg-muted/30">
                      <p className="text-sm font-medium text-foreground">"{item.phrasing}"</p>
                      {item.rationale && <p className="text-xs text-muted-foreground mt-1"><em>Rationale: {item.rationale}</em></p>}
                      <div className="mt-2 text-xs text-accent flex items-center gap-1">
                        <Volume2 className="w-3 h-3"/> Practice saying this aloud.
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            
            {suggestionsOutput.generalTips && suggestionsOutput.generalTips.length > 0 && (
              <div>
                <h4 className="font-semibold text-md text-primary">General Communication Tips for "{STATEMENT_CONTEXT_OPTIONS.find(opt => opt.value === statementContext)?.label || 'this context'}":</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {suggestionsOutput.generalTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <Alert variant="default" className="mt-4 border-accent bg-accent/10">
              <Mic className="h-4 w-4 text-accent" />
              <AlertTitle className="font-semibold text-accent">Practice Your Delivery</AlertTitle>
              <AlertDescription>
                While this tool provides text suggestions, effective courtroom communication also involves tone, pace, and confidence. Practice saying these phrases aloud. Future versions might include audio recording and feedback features.
              </AlertDescription>
            </Alert>

          </CardContent>
        </Card>
      )}

       {!suggestionsOutput && !isGeneratingSuggestions && !error && (
         <Card className="shadow-md mt-6">
            <CardHeader>
                <CardTitle>How to Use the Communication Coach</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>This tool helps you craft language for court appearances:</p>
                <ul className="list-decimal pl-5 space-y-1">
                    <li><strong>Describe Key Points/Topic:</strong> Enter the main ideas you want to convey or the general subject of your statement in the text box.</li>
                    <li><strong>Select Context:</strong> Choose the situation where you'll be speaking from the dropdown (e.g., "Addressing the Judge," "Cross-Examination").</li>
                    <li><strong>Get AI Statements:</strong> Click the button. The AI will generate 1-3 potential statements for you, along with rationales and general communication tips.</li>
                    <li><strong>Review & Practice:</strong> Select the statement that best fits your needs, adapt it if necessary, and practice saying it aloud to build confidence and fluency.</li>
                </ul>
                 <Alert variant="default" className="border-accent bg-accent/10 mt-4">
                    <AlertTriangle className="h-4 w-4 text-accent" />
                    <AlertTitle className="font-semibold">Not Legal Advice</AlertTitle>
                    <AlertDescription>
                        The statements and tips provided are for communication assistance only and do not constitute legal advice on the substance of your case. Always consult a qualified attorney for legal guidance.
                    </AlertDescription>
                </Alert>
            </CardContent>
         </Card>
        )}
    </div>
  );
}
