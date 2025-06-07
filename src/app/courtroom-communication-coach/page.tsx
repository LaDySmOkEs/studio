
// src/app/courtroom-communication-coach/page.tsx
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageSquareQuote, AlertTriangle, Loader2, Info, Brain, Mic, Volume2, Edit } from "lucide-react";
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
  { value: "ADDRESSING_JUDGE", label: "Addressing the Judge (General)" },
  { value: "OPENING_STATEMENT", label: "Making an Opening Statement (Trial)" },
  { value: "CLOSING_ARGUMENT", label: "Making a Closing Argument (Trial)" },
  { value: "DIRECT_EXAMINATION", label: "Questioning My Witness (Direct Examination)" },
  { value: "CROSS_EXAMINATION", label: "Questioning Opponent's Witness (Cross-Examination)" },
  { value: "MAKING_OBJECTION", label: "Making an Objection" },
  { value: "RESPONDING_TO_OBJECTION", label: "Responding to an Objection Made by Opponent" },
  { value: "ARGUING_MOTION", label: "Arguing a Pre-Trial or In-Trial Motion" },
  { value: "PRESENTING_EVIDENCE", label: "Presenting Evidence/Exhibit" },
  { value: "RESPONDING_TO_QUESTION_FROM_JUDGE", label: "Responding to a Question from the Judge" },
  { value: "PLEA_OR_SENTENCING_STATEMENT", label: "Making a Plea or Sentencing Statement (Defendant)" },
  { value: "NEGOTIATION_WITH_OPPOSING_COUNSEL", label: "Negotiation with Opposing Counsel (or party)" },
  { value: "MEDIATION_OPENING_STATEMENT", label: "Mediation: Opening Statement / Presenting Your Position" },
  { value: "OTHER_COURTROOM_STATEMENT", label: "Other Courtroom Statement (Specify Topic Clearly)" },
];


export default function CourtroomCommunicationCoachPage() {
  const [storedCaseSummary, setStoredCaseSummary] = useState<string | null>(null);
  const [storedCaseCategory, setStoredCaseCategory] = useState<"general" | "criminal" | "civil" | null>(null);
  const [keyPointsOrTopic, setKeyPointsOrTopic] = useState("");
  const [userDraftStatement, setUserDraftStatement] = useState(""); // New state for optional user draft
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
        setStoredCaseCategory(storedData.caseCategory);
      }
    } catch (e) {
      console.error("Failed to load or parse case data from localStorage", e);
      toast({ title: "Error", description: "Could not load stored case summary.", variant: "destructive" });
    }
  }, [toast]);

  const handleGenerateSuggestions = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!keyPointsOrTopic.trim()) { 
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
      keyPointsOrTopic: keyPointsOrTopic, // Changed from userStatement
      userDraftStatement: userDraftStatement.trim() || undefined,
      statementContext: statementContext as any, 
      caseSummary: storedCaseSummary || undefined,
      caseCategory: storedCaseCategory || undefined,
    };

    const result = await handleGeneratePhrasingSuggestionsAction(input);

    if ('error' in result) {
      setError(result.error);
      toast({ title: "Suggestion Generation Failed", description: result.error, variant: "destructive" });
    } else {
      setSuggestionsOutput(result);
      toast({ title: "AI Statements/Critique Generated", description: "Review the AI's suggestions below." });
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
            Provide key points or a topic for your statement and select the context. Optionally, include your own draft for AI critique. The AI will generate potential statements or offer improvements.
            It uses your saved case summary and category (from Case Analysis) for better context.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleGenerateSuggestions}>
          <CardContent className="space-y-6">
            {(storedCaseSummary || storedCaseCategory) && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2"><Info className="w-5 h-5 text-muted-foreground" />Case Context for AI</CardTitle>
                  <CardDescription className="text-xs">This information from Case Analysis can provide helpful context to the AI for more relevant suggestions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {storedCaseSummary && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Case Summary:</Label>
                      <Textarea value={storedCaseSummary} readOnly rows={2} className="text-sm bg-background cursor-default h-auto" aria-label="Stored case summary (context for AI)" />
                    </div>
                  )}
                  {storedCaseCategory && (
                     <div>
                      <Label className="text-xs text-muted-foreground">Case Category:</Label>
                       <p className="text-sm p-2 bg-background rounded-md capitalize">{storedCaseCategory}</p>
                     </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div>
              <Label htmlFor="key-points-topic-textarea">What key points do you want to make, or what is the topic of your statement?*</Label> 
              <Textarea
                id="key-points-topic-textarea"
                value={keyPointsOrTopic} 
                onChange={(e) => setKeyPointsOrTopic(e.target.value)} 
                placeholder="e.g., 'Need to argue for dismissal due to lack of evidence,' or 'Question witness about their presence at the scene.'" 
                rows={4}
                required
                className="min-h-[80px]"
                aria-label="Key points or topic of your intended statement"
              />
            </div>

            <div>
              <Label htmlFor="user-draft-statement-textarea">Your Draft Statement (Optional - AI will critique this based on your key points)</Label> 
              <Textarea
                id="user-draft-statement-textarea"
                value={userDraftStatement} 
                onChange={(e) => setUserDraftStatement(e.target.value)} 
                placeholder="If you have a draft, enter it here. The AI will provide feedback and suggest improvements related to your key points." 
                rows={4}
                className="min-h-[80px]"
                aria-label="Your draft statement (optional)"
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
              Generate AI Suggestions
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Generating Suggestions</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestionsOutput && (
        <Card className="shadow-md mt-6 border-primary">
          <CardHeader>
            <CardTitle className="text-xl">AI-Generated Suggestions</CardTitle>
            <CardDescription>Review the AI's critique (if you provided a draft), suggested statements, and communication tips.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {suggestionsOutput.originalStatementCritique && (
              <div>
                <h4 className="font-semibold text-md text-primary flex items-center gap-1"><Edit className="w-4 h-4" />Critique of Your Draft:</h4>
                <p className="text-sm text-muted-foreground p-2 border rounded-md bg-muted/30 whitespace-pre-wrap">{suggestionsOutput.originalStatementCritique}</p>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-md text-primary">AI-Generated/Improved Statements:</h4>
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
                    <li><strong>Describe Key Points/Topic:</strong> Enter the main ideas you want to convey or the general subject of your statement in the text box. This is required.</li>
                    <li><strong>(Optional) Provide Your Draft:</strong> If you have already written a statement, paste it into the "Your Draft Statement" box. The AI will critique it based on your key points.</li>
                    <li><strong>Select Context:</strong> Choose the situation where you'll be speaking from the dropdown (e.g., "Addressing the Judge," "Cross-Examination"). This is required.</li>
                    <li><strong>Get AI Suggestions:</strong> Click the button. The AI will either generate new statements from your key points or critique your draft and offer improvements. It will also provide general communication tips.</li>
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
