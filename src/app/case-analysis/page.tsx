
// src/app/case-analysis/page.tsx
"use client";

import { useState, type ChangeEvent, useRef, useEffect } from "react";
import Link from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lightbulb, FileText, Scale, HelpCircle, UploadCloud, Verified, Edit, Info, ShieldAlert, Trash2, ArrowRight, Brain, AlertTriangle, MessageSquare, MessageCircleQuestion } from "lucide-react";
import type { SuggestRelevantLawsOutput } from "@/ai/flows/suggest-relevant-laws";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import {
  handleCaseAnalysisAction,
  handleSuggestStrategiesAction,
  handleSuggestFilingDecisionAction,
  handleRefineAnalysisAction,
  handleSummarizeCaseAction,
  handleRefineFromFeedbackAction
} from "./actions";
import type { SuggestLegalStrategiesInput, SuggestLegalStrategiesOutput } from "@/ai/flows/suggestLegalStrategies";
import { formSchema, type CaseAnalysisFormValues } from "./schemas";
import type { SuggestFilingDecisionHelperInput, SuggestFilingDecisionHelperOutput } from "@/ai/flows/suggestFilingDecisionHelper";
import type { RefineCaseAnalysisInput } from "@/ai/flows/refineCaseAnalysisWithClarification";
import type { SummarizeCaseInput, CaseSummaryOutput } from "@/ai/flows/summarizeCaseUnderstanding";
import type { RefineFromFeedbackInput } from "@/ai/flows/refineAnalysisFromSummaryFeedback";


import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";


const LOCAL_STORAGE_KEY = "dueProcessAICaseAnalysisData";

interface StoredCaseData {
  caseDetails: string;
  caseCategory: "general" | "criminal" | "civil";
}

interface ConfidenceDetails {
  level: string;
  explanation: string;
  nextSteps: string;
  colorClass: string;
}

const getConfidenceDetails = (score: number, caseCategory: "general" | "criminal" | "civil"): ConfidenceDetails => {
  const roundedScore = Math.round(score * 100);
  let criminalCaution = "";
  if (caseCategory === "criminal") {
    criminalCaution = " For criminal matters, given the potential severity of outcomes, these suggestions require particularly careful review by a legal professional. Potential due process violations in criminal cases can have severe consequences.";
  }

  if (roundedScore >= 90) {
    return {
      level: `High Confidence (${roundedScore}%)`,
      explanation: `The AI has a high degree of confidence in these suggestions based on the information provided. You have access to all relevant features.${criminalCaution}`,
      nextSteps: "Review the suggested laws and documents. Standard disclaimers apply. Always consult with a legal professional for advice specific to your situation.",
      colorClass: "text-green-600",
    };
  } else if (roundedScore >= 70) {
    return {
      level: `Moderate Confidence (${roundedScore}%)`,
      explanation: `The AI has moderate confidence. The suggestions are likely relevant, but providing more specific information could improve accuracy.${criminalCaution}`,
      nextSteps: "Review suggestions carefully. Enhanced disclaimers apply. Consider using the 'Provide Clarifications' or 'Document Upload' sections below to provide more details. Consulting a legal professional is strongly advised.",
      colorClass: "text-yellow-600",
    };
  } else if (roundedScore >= 50) {
    return {
      level: `Low Confidence (${roundedScore}%)`,
      explanation: `The AI has low confidence. The initial information may be too general or lack specific legal keywords. Suggestions provided are broad.${criminalCaution}`,
      nextSteps: "It is highly recommended to provide more details through the 'Provide Clarifications', 'Document Upload', or 'Structured Verification' sections. Stronger attorney recommendations apply. Seeking advice from a legal professional is critical.",
      colorClass: "text-orange-600",
    };
  } else {
    return {
      level: `Very Low Confidence (${roundedScore}%)`,
      explanation: `The AI has very low confidence. The case details may be unclear or fall outside common legal patterns. Feature access might be limited until more clarity is provided.${criminalCaution}`,
      nextSteps: "It is essential to provide significantly more detail, possibly through a structured questionnaire (conceptual feature). Limited features may apply. Consulting a legal professional is crucial.",
      colorClass: "text-red-600",
    };
  }
};

const getDocumentDisplayName = (docType: string): string => {
    if (!docType) return "";
    // Add spaces before capital letters and capitalize first letter
    return docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
};


export default function CaseAnalysisPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SuggestRelevantLawsOutput | null>(null);
  const [strategyResult, setStrategyResult] = useState<SuggestLegalStrategiesOutput | null>(null);
  const [isStrategyLoading, setIsStrategyLoading] = useState(false);
  const [filingDecisionResult, setFilingDecisionResult] = useState<SuggestFilingDecisionHelperOutput | null>(null);
  const [isFilingDecisionLoading, setIsFilingDecisionLoading] = useState(false);
  const [isFilingDecisionDialogOpen, setIsFilingDecisionDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [clarifications, setClarifications] = useState("");
  const [isRefiningAnalysis, setIsRefiningAnalysis] = useState(false);

  // For Phase 4
  const [aiCaseSummary, setAiCaseSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [userFeedbackOnSummary, setUserFeedbackOnSummary] = useState("");
  const [isRefiningFromFeedback, setIsRefiningFromFeedback] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);


  const form = useForm<CaseAnalysisFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caseDetails: "",
      caseCategory: "general",
    },
  });

  useEffect(() => {
    try {
      const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedDataString) {
        const storedData: StoredCaseData = JSON.parse(storedDataString);
        if (storedData.caseDetails || storedData.caseCategory) {
           form.reset({
            caseDetails: storedData.caseDetails || "",
            caseCategory: storedData.caseCategory || "general",
          });
          toast({
            title: "Previous Case Data Loaded",
            description: "Your previously entered case details and category have been loaded.",
            action: (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm"> <Trash2 className="mr-2 h-4 w-4" /> Clear Data </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will permanently delete your saved case details (narrative and category) from your browser's local storage. You will need to re-enter them if you want to use them again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => clearStoredCaseDetails(true)}>
                      Yes, Clear Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ),
          });
        }
      }
    } catch (e) {
      console.error("Failed to load or parse case data from localStorage", e);
      localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted data
    }
  }, [form, toast]);

  const getCurrentFullNarrative = () => {
    const originalDetails = form.getValues("caseDetails");
    if (clarifications.trim()) {
      return `${originalDetails}\n\nFurther User Clarifications (Phase 2):\n${clarifications}`;
    }
    return originalDetails;
  };

  const onSubmit: SubmitHandler<CaseAnalysisFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setStrategyResult(null);
    setFilingDecisionResult(null);
    setClarifications("");
    setAiCaseSummary(null);
    setUserFeedbackOnSummary("");
    setSelectedFileName(null);

    const result = await handleCaseAnalysisAction(data);

    if ('error' in result) {
      setError(result.error);
      toast({
        title: "Analysis Failed",
        description: result.error,
        variant: "destructive",
      });
      setIsLoading(false);
    } else {
      setAnalysisResult(result);
      try {
        const dataToStore: StoredCaseData = {
          caseDetails: data.caseDetails,
          caseCategory: data.caseCategory,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
        toast({
          title: "Initial Analysis Complete & Saved",
          description: `Relevant laws for ${form.getValues("caseCategory")} case, confidence score, due process violation assessment, and suggested documents are now available. Case details saved for other app features. The AI may also suggest clarifying questions below to help refine the analysis.`,
        });
      } catch (e) {
        console.error("Failed to save case data to localStorage", e);
        toast({
          title: "Analysis Complete (Save Failed)",
          description: "Analysis complete, but failed to save case details for other app features due to a storage issue.",
          variant: "destructive",
        });
      }

      await triggerStrategySuggestion(data.caseDetails, data.caseCategory, result.dueProcessViolationScore, result.relevantLaws);
      setIsLoading(false);
    }
  };

  const triggerStrategySuggestion = async (fullNarrative: string, caseCategory: "general" | "criminal" | "civil", dueProcessViolationAssessment: string, relevantLaws: string) => {
    setIsStrategyLoading(true);
    setStrategyResult(null);
    const strategyInput: SuggestLegalStrategiesInput = {
      caseDetails: fullNarrative,
      caseCategory,
      dueProcessViolationAssessment,
      relevantLaws,
    };
    const strategies = await handleSuggestStrategiesAction(strategyInput);
    if ('error' in strategies) {
      toast({
        title: "Strategy Suggestion Failed",
        description: strategies.error,
        variant: "destructive",
      });
    } else {
      setStrategyResult(strategies);
    }
    setIsStrategyLoading(false);
  };


  const clearStoredCaseDetails = (showToast = true) => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      form.reset({
        caseDetails: "",
        caseCategory: "general",
      });
      setAnalysisResult(null);
      setStrategyResult(null);
      setFilingDecisionResult(null);
      setClarifications("");
      setAiCaseSummary(null);
      setUserFeedbackOnSummary("");
      if (showToast) {
        toast({
          title: "Stored Case Data Cleared",
          description: "Previously saved case details and category have been removed.",
        });
      }
    } catch (e) {
      console.error("Failed to clear case data from localStorage", e);
      if (showToast) {
        toast({
          title: "Error Clearing Data",
          description: "Could not clear stored case data.",
          variant: "destructive",
        });
      }
    }
  };


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFileName(event.target.files[0].name);
    } else {
      setSelectedFileName(null);
    }
  };

  const handlePlaceholderSubmit = (phaseName: string) => {
    toast({
      title: `${phaseName} (Conceptual)`,
      description: "This feature is a placeholder. In a full version, this action would trigger further AI processing.",
      duration: 5000,
    });
  };

  const handleSubmitClarifications = async () => {
    if (!analysisResult || !form.getValues("caseDetails") || !clarifications.trim()) {
      toast({
        title: "Cannot Refine Analysis",
        description: "An initial analysis must be complete and clarifications must be provided.",
        variant: "destructive",
      });
      return;
    }

    setIsRefiningAnalysis(true);
    setStrategyResult(null);
    setFilingDecisionResult(null);
    setAiCaseSummary(null); // Clear previous summary if any
    setUserFeedbackOnSummary(""); // Clear feedback on summary

    const input: RefineCaseAnalysisInput = {
      originalCaseDetails: form.getValues("caseDetails"),
      clarifications: clarifications,
      caseCategory: form.getValues("caseCategory"),
    };

    const refinedResult = await handleRefineAnalysisAction(input);

    if ('error' in refinedResult) {
      setError(refinedResult.error);
      toast({
        title: "Refinement Failed",
        description: refinedResult.error,
        variant: "destructive",
      });
    } else {
      setAnalysisResult(refinedResult);
      toast({
        title: "Analysis Refined (Phase 2)",
        description: "The case analysis has been updated with your clarifications. New strategy suggestions will be generated. The AI may also provide further clarifying questions.",
      });

      await triggerStrategySuggestion(
        getCurrentFullNarrative(),
        form.getValues("caseCategory"),
        refinedResult.dueProcessViolationScore,
        refinedResult.relevantLaws
      );
      // Clarifications are now part of getCurrentFullNarrative(), so we don't clear the form's caseDetails, but we do clear the clarifications input field
      setClarifications("");
    }
    setIsRefiningAnalysis(false);
  };


  const handleRequestFilingDecision = async () => {
    if (!analysisResult) {
      toast({
        title: "Analysis Required",
        description: "Please perform an initial case analysis first.",
        variant: "destructive",
      });
      return;
    }
    setIsFilingDecisionLoading(true);
    setFilingDecisionResult(null);

    const input: SuggestFilingDecisionHelperInput = {
      caseDetails: getCurrentFullNarrative(),
      caseCategory: form.getValues("caseCategory"),
      relevantLaws: analysisResult.relevantLaws,
      dueProcessViolationScore: analysisResult.dueProcessViolationScore,
      suggestedDocumentTypes: analysisResult.suggestedDocumentTypes,
    };

    const result = await handleSuggestFilingDecisionAction(input);

    if ('error' in result) {
      toast({
        title: "Filing Decision Help Failed",
        description: result.error,
        variant: "destructive",
      });
    } else {
      setFilingDecisionResult(result);
      setIsFilingDecisionDialogOpen(true);
    }
    setIsFilingDecisionLoading(false);
  };

  const handleRequestAiSummary = async () => {
    if (!analysisResult) {
      toast({ title: "Initial Analysis Needed", description: "Please complete Phase 1 analysis first.", variant: "destructive" });
      return;
    }
    setIsSummarizing(true);
    setAiCaseSummary(null);
    const input: SummarizeCaseInput = {
      fullCaseNarrative: getCurrentFullNarrative(),
      relevantLaws: analysisResult.relevantLaws,
      dueProcessViolationScore: analysisResult.dueProcessViolationScore,
    };
    const summary = await handleSummarizeCaseAction(input);
    if ('error' in summary) {
      toast({ title: "AI Summary Failed", description: summary.error, variant: "destructive" });
    } else {
      setAiCaseSummary(summary.summaryText);
      toast({ title: "AI Summary Generated", description: "Review the AI's understanding below and provide feedback." });
    }
    setIsSummarizing(false);
  };

  const handleSubmitFeedbackOnSummary = async () => {
    if (!analysisResult || !aiCaseSummary || !userFeedbackOnSummary.trim()) {
      toast({ title: "Cannot Refine from Feedback", description: "AI summary must be generated and feedback provided.", variant: "destructive" });
      return;
    }
    setIsRefiningFromFeedback(true);
    setStrategyResult(null);
    setFilingDecisionResult(null);

    const input: RefineFromFeedbackInput = {
      fullCaseNarrative: getCurrentFullNarrative(),
      aiGeneratedSummary: aiCaseSummary,
      userFeedbackOnSummary: userFeedbackOnSummary,
      caseCategory: form.getValues("caseCategory"),
    };

    const finalRefinedResult = await handleRefineFromFeedbackAction(input);

    if ('error' in finalRefinedResult) {
      setError(finalRefinedResult.error);
      toast({ title: "Refinement from Feedback Failed", description: finalRefinedResult.error, variant: "destructive" });
    } else {
      setAnalysisResult(finalRefinedResult);
      toast({ title: "Analysis Refined (Phase 4)", description: "Case analysis updated based on your feedback to the AI's summary. The AI may also provide further clarifying questions below." });
      await triggerStrategySuggestion(
        getCurrentFullNarrative(), // Narrative remains the same
        form.getValues("caseCategory"),
        finalRefinedResult.dueProcessViolationScore,
        finalRefinedResult.relevantLaws
      );
      setAiCaseSummary(null); // Clear summary and feedback for next potential cycle
      setUserFeedbackOnSummary("");
    }
    setIsRefiningFromFeedback(false);
  };

  const confidenceDetails = analysisResult ? getConfidenceDetails(analysisResult.confidenceScore, form.getValues("caseCategory")) : null;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Scale /> Intelligent Case Analysis Engine
            </CardTitle>
          <CardDescription>
            Provide initial details about your case (Phase 1). The AI may then ask clarifying questions. You can answer these and provide more information (Phase 2). Finally, you can review the AI's summary of its understanding and offer corrections (Phase 4).
            Case details entered here can be saved and referenced in other parts of the app.
            This tool is for informational purposes. <strong>It does not provide legal advice.</strong> All AI-generated suggestions should be reviewed by a qualified legal professional. Avoid submitting highly sensitive personal identifiable information.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="caseCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="caseCategorySelect">Case Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger id="caseCategorySelect" aria-describedby="caseCategory-message" aria-label="Case Category">
                          <SelectValue placeholder="Select a case category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="criminal">Criminal Law</SelectItem>
                        <SelectItem value="civil">Civil Law</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage id="caseCategory-message" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="caseDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="caseDetailsInput">Phase 1: Free-Form Narrative</FormLabel>
                    <FormControl>
                      <Textarea
                        id="caseDetailsInput"
                        placeholder="Describe your situation in your own words. Include key facts, parties involved, legal questions, and any concerns about how procedures were handled..."
                        rows={10}
                        className="resize-none"
                        {...field}
                        aria-describedby="caseDetails-message"
                        aria-label="Case details input"
                      />
                    </FormControl>
                    <FormMessage id="caseDetails-message" />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <Button type="submit" disabled={isLoading || isRefiningAnalysis || isSummarizing || isRefiningFromFeedback} className="w-full sm:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing (Phase 1)...
                  </>
                ) : (
                  "Analyze Case & Save Details"
                )}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="outline" className="w-full sm:w-auto" aria-label="Clear stored case details from browser">
                    <Trash2 className="mr-2 h-4 w-4" /> Clear Stored Details
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will permanently delete your saved case details (narrative and category) from your browser's local storage. You will need to re-enter them if you want to use them again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => clearStoredCaseDetails(true)}>
                      Yes, Clear Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysisResult && confidenceDetails && (
        <div className="space-y-6 mt-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Analysis Results</CardTitle>
              <CardDescription>
                The following suggestions are AI-generated and for informational purposes only. They do not constitute legal advice and must be reviewed by a qualified legal professional.
                The "Case Law Recommender" aspect (conceptually) finds relevant cases based on your facts, to help you back your claims.
                For more insight into how these suggestions are generated and the factors influencing them, please see the "Confidence Score" and "Due Process Violation Assessment" sections below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-accent" />
                      Suggested Relevant Laws ({form.getValues("caseCategory").charAt(0).toUpperCase() + form.getValues("caseCategory").slice(1)})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{analysisResult.relevantLaws}</p>
                  </CardContent>
                </Card>
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>Confidence Score</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress value={analysisResult.confidenceScore * 100} className="w-full" aria-label={`Confidence score: ${confidenceDetails.level}`}/>
                    <p className={`text-xl font-bold text-center ${confidenceDetails.colorClass}`}>
                      {confidenceDetails.level}
                    </p>
                    <p className="text-sm text-muted-foreground">{confidenceDetails.explanation}</p>
                    <div>
                        <h4 className="font-semibold text-sm mb-1">Recommended Next Steps:</h4>
                        <p className="text-sm text-muted-foreground">{confidenceDetails.nextSteps}</p>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-sm py-2">
                          <Info className="w-4 h-4 mr-2 text-muted-foreground" /> How is this score determined?
                        </AccordionTrigger>
                        <AccordionContent className="text-xs text-muted-foreground space-y-2 pl-2">
                          <p>The confidence score is an AI-generated estimate based on several factors from your input. The AI processes your narrative and (conceptually, if uploaded) documents to identify patterns and relevant information that match its training data, which consists of a vast amount of legal text and case information. It's a probabilistic process, not a deterministic legal judgment.</p>
                          <p>Key factors that typically influence this score include:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Clarity and Specificity:</strong> How clearly and specifically you describe your situation, including the use of relevant legal terms.</li>
                            <li><strong>Information Completeness:</strong> The amount of detail provided about key facts, parties, dates, and actions.</li>
                            <li><strong>Evidence Indication:</strong> Mention or (conceptual) presence of supporting documents (e.g., contracts, notices, police reports).</li>
                            <li><strong>Consistency:</strong> The internal consistency of your narrative and follow-up information.</li>
                            <li><strong>Case Complexity Indicators:</strong> Factors that might suggest a straightforward or a more complex legal issue.</li>
                          </ul>
                          <p className="pt-1">A higher score generally suggests a clearer match to known legal patterns and precedents within the AI's knowledge base. A lower score may indicate that the information is too general, ambiguous, or falls outside common patterns the AI is trained on. This score is for informational purposes and not a guarantee of legal outcomes or the sole basis for legal decisions. Its primary aim is to provide transparency into the AI's initial assessment.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                   <CardFooter>
                    <p className="text-xs text-muted-foreground">
                      <strong>Crucial Note:</strong> Always consult with a qualified legal professional for advice specific to your situation. AI suggestions are not a substitute for professional legal counsel.
                    </p>
                  </CardFooter>
                </Card>
                 <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-destructive" />
                      Due Process Violation Assessment
                    </CardTitle>
                     <CardDescription>
                      This AI assessment identifies potential due process concerns (e.g., issues with notice, opportunity to be heard, right to counsel if criminal, Miranda issues, inadequate representation) based on your case narrative. It considers the severity and volume of potential issues mentioned. It is <strong>not a legal determination</strong>.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive dark:text-destructive">
                        {analysisResult.dueProcessViolationScore || "No specific assessment provided."}
                    </p>
                    <div className="text-xs text-muted-foreground mt-3">
                        <p>Examples of what this might mean:</p>
                        <div className="list-disc pl-4 mt-1">
                            <div><strong>Low Risk:</strong> Input suggests standard procedures were likely followed.</div>
                            <div><strong>Moderate Risk:</strong> Input indicates potential concerns (e.g., about notice, hearing opportunity) that warrant closer examination by a legal professional.</div>
                            <div><strong>High Risk:</strong> Input suggests multiple or severe potential violations (e.g., lack of legal representation in a serious criminal matter, clear denial of a hearing). Immediate consultation with a lawyer is strongly advised.</div>
                             <div><strong>Indeterminate:</strong> Not enough specific detail in your narrative to make a meaningful assessment of due process risks.</div>
                        </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                     <p className="text-xs text-muted-foreground">
                        <strong>Legal Advice Required:</strong> This assessment is a conceptual tool. Any potential due process violation must be evaluated by a qualified attorney.
                    </p>
                  </CardFooter>
                </Card>
              </div>

              {analysisResult.suggestedDocumentTypes && analysisResult.suggestedDocumentTypes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-accent" />
                      Suggested Document Types
                    </CardTitle>
                    <CardDescription>
                      Based on your case analysis, we suggest considering these document types. Click on a type to go to the Document Generator with it pre-selected. These are templates and require legal review.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="list-disc pl-5 space-y-2">
                      {analysisResult.suggestedDocumentTypes.map((docType) => (
                        <li key={docType} className="text-sm">
                          <Link href={`/document-generator?suggested=${docType}`} className="text-primary hover:underline flex items-center gap-1">
                            {getDocumentDisplayName(docType)}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRequestFilingDecision}
                      disabled={isFilingDecisionLoading || !analysisResult || isLoading || isRefiningAnalysis || isSummarizing || isRefiningFromFeedback}
                      className="mt-4"
                      aria-label="Help me decide what to file"
                    >
                      {isFilingDecisionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
                      Help Me Decide What to File
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card className="shadow-md mt-6 border-accent">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                    <Brain className="w-5 h-5 text-accent" /> AI Suggested Strategies & Motions
                    </CardTitle>
                    <CardDescription>
                    Based on the analysis and due process assessment, the AI suggests specific legal strategies or motions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                  {(isStrategyLoading || isRefiningAnalysis || isRefiningFromFeedback) && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin text-accent" />
                      <p className="text-accent">{(isRefiningAnalysis || isRefiningFromFeedback) ? "Refining analysis and generating new strategies..." : "Generating strategy suggestions..."}</p>
                    </div>
                  )}
                  {!isStrategyLoading && !isRefiningAnalysis && !isRefiningFromFeedback && strategyResult && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Suggested Strategies:</h4>
                        {strategyResult.suggestedStrategies.length > 0 ? (
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            {strategyResult.suggestedStrategies.map((strategy, index) => <li key={index}>{strategy}</li>)}
                          </ul>
                        ) : <p className="text-sm text-muted-foreground">No specific strategies suggested.</p>}
                      </div>
                      <div>
                        <h4 className="font-semibold">Suggested Motions:</h4>
                        {strategyResult.suggestedMotions.length > 0 ? (
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            {strategyResult.suggestedMotions.map((motion, index) => <li key={index}>{motion}</li>)}
                          </ul>
                        ) : <p className="text-sm text-muted-foreground">No specific motions suggested.</p>}
                      </div>
                      <div>
                        <h4 className="font-semibold">Reasoning:</h4>
                        <p className="text-sm whitespace-pre-wrap">{strategyResult.reasoning}</p>
                      </div>
                      <Alert variant="default" className="bg-accent/10 mt-3">
                        <AlertTriangle className="h-4 w-4 text-accent" />
                        <AlertTitle className="font-semibold text-accent">Disclaimer</AlertTitle>
                        <AlertDescription className="text-xs">{strategyResult.disclaimer}</AlertDescription>
                      </Alert>
                    </div>
                  )}
                   {!isStrategyLoading && !isRefiningAnalysis && !isRefiningFromFeedback && !strategyResult && !analysisResult && (
                     <Alert variant="default" className="bg-accent/10">
                       <AlertTitle className="font-semibold text-accent">Suggestions Appear Here</AlertTitle>
                       <AlertDescription>
                           After the initial case analysis is complete, AI-suggested strategies and motions will be displayed in this section.
                       </AlertDescription>
                     </Alert>
                  )}
                   {!isStrategyLoading && !isRefiningAnalysis && !isRefiningFromFeedback && !strategyResult && analysisResult && (
                     <Alert variant="default" className="bg-accent/10">
                       <AlertTitle className="font-semibold text-accent">Awaiting Strategy Suggestions</AlertTitle>
                       <AlertDescription>
                           AI-suggested strategies and motions are being processed or were not generated.
                       </AlertDescription>
                     </Alert>
                  )}
                </CardContent>
              </Card>

            </CardContent>
          </Card>

          {filingDecisionResult && (
            <Dialog open={isFilingDecisionDialogOpen} onOpenChange={setIsFilingDecisionDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" /> AI Filing Decision Helper
                  </DialogTitle>
                  <DialogDescription>
                    Based on your case analysis, here's some guidance on what you might consider filing next. This is not legal advice.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-4">
                  <div>
                    <h4 className="font-semibold">Top Suggested Document Types to Consider:</h4>
                    {filingDecisionResult.topSuggestions.length > 0 ? (
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {filingDecisionResult.topSuggestions.map((docType, index) => (
                          <li key={index}>{getDocumentDisplayName(docType)}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No specific top suggestions at this time.</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">AI's Reasoning & Advice:</h4>
                    <p className="text-sm whitespace-pre-wrap">{filingDecisionResult.filingAdvice}</p>
                  </div>
                   <Alert variant="default" className="bg-accent/10 mt-2">
                    <AlertTriangle className="h-4 w-4 text-accent" />
                    <AlertTitle className="font-semibold text-accent">Important Disclaimer</AlertTitle>
                    <AlertDescription className="text-xs">
                      This AI-generated advice is for informational purposes only and does not constitute legal advice. Always consult with a qualified legal professional for guidance specific to your situation.
                    </AlertDescription>
                  </Alert>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button">Got it</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}


          {/* Phase 2: Provide Clarifications to Refine Analysis */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-accent" />
                Phase 2: Provide Clarifications to Refine Analysis
              </CardTitle>
              <CardDescription>
                If the initial analysis isn't quite right, or if you have more details, provide them here. The AI may have suggested specific questions below based on its initial analysis. Answering these can help the AI provide a more refined analysis.
                This tool does not provide legal advice. If you've logged events in the <Link href="/timeline-event-log" className="text-primary hover:underline">Timeline & Event Log</Link>, you can use that information to answer these clarifying questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysisResult?.clarifyingQuestions && analysisResult.clarifyingQuestions.length > 0 && (
                <Alert variant="default" className="border-primary bg-primary/5">
                  <MessageCircleQuestion className="h-5 w-5 text-primary" />
                  <AlertTitle className="font-semibold text-primary">AI Suggested Clarifying Questions:</AlertTitle>
                  <AlertDescription>
                    The AI has suggested the following questions to help refine its understanding. Please consider these as you provide your clarifications:
                    <ul className="list-disc pl-5 mt-2 text-sm">
                      {analysisResult.clarifyingQuestions.map((q, index) => (
                        <li key={index}>{q}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              <Label htmlFor="clarificationsInput" className="sr-only">Your clarifications for the AI</Label>
              <Textarea
                id="clarificationsInput"
                value={clarifications}
                onChange={(e) => setClarifications(e.target.value)}
                placeholder="Enter any clarifications, corrections, or additional details here to refine the AI's understanding. Address the AI's questions above if provided..."
                rows={5}
                aria-label="Your clarifications for the AI"
                disabled={!analysisResult || isLoading || isRefiningAnalysis || isSummarizing || isRefiningFromFeedback}
              />
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={handleSubmitClarifications}
                disabled={!analysisResult || isLoading || isRefiningAnalysis || !clarifications.trim() || isSummarizing || isRefiningFromFeedback}
              >
                {isRefiningAnalysis ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Refining Analysis (Phase 2)...
                  </>
                ) : (
                  "Submit Clarifications & Refine Analysis"
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Phase 3: Document Upload (Conceptual) */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-accent" />
                Conceptual Phase 3: Document Upload & Analysis
              </CardTitle>
              <CardDescription>
                You could upload relevant documents (e.g., police reports, contracts) for AI analysis to extract key info and verify details. If you've organized items in the <Link href="/evidence-compiler" className="text-primary hover:underline">Evidence Compiler</Link>, you might conceptually upload relevant ones here. This tool does not provide legal advice.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <Alert variant="default" className="border-accent bg-accent/10">
                <AlertTitle className="font-semibold text-accent">How Document Analysis Would Work:</AlertTitle>
                <AlertDescription>
                  In a full version, uploaded documents would be analyzed using techniques like OCR (Optical Character Recognition) and content analysis. This helps extract key information, confirm details from your narrative, and further refine the case assessment and confidence score.
                </AlertDescription>
              </Alert>
              <Label htmlFor="conceptualDocumentUploadInput" className="sr-only">Conceptual document upload</Label>
              <Input
                id="conceptualDocumentUploadInput"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                aria-label="Conceptual document upload"
                />
              {selectedFileName && <p className="text-xs text-muted-foreground mt-1">Selected: {selectedFileName}</p>}
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => handlePlaceholderSubmit("Document Upload & Analysis")}>
                Upload and Analyze Documents (Conceptual)
              </Button>
            </CardFooter>
          </Card>

          {/* Phase 4: Verify AI's Understanding & Refine */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Verified className="w-5 h-5 text-accent" />
                 Phase 4: Verify AI's Understanding & Refine
              </CardTitle>
              <CardDescription>
                First, ask the AI to summarize its current understanding of your case. Then, review the summary and provide specific corrections or additional details. The AI will then generate a final refined analysis based on this feedback.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                onClick={handleRequestAiSummary}
                disabled={!analysisResult || isLoading || isRefiningAnalysis || isSummarizing || isRefiningFromFeedback}
                className="mb-4"
              >
                {isSummarizing ? (
                  <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Getting AI Summary... </>
                ) : (
                  <> <MessageSquare className="mr-2 h-4 w-4" /> Get AI's Summary of Understanding </>
                )}
              </Button>

              {aiCaseSummary && (
                <Alert variant="default" className="border-primary bg-primary/5">
                  <AlertTitle className="font-semibold text-primary">AI's Current Understanding:</AlertTitle>
                  <AlertDescription className="whitespace-pre-wrap text-sm">{aiCaseSummary}</AlertDescription>
                </Alert>
              )}

              <Label htmlFor="feedbackOnSummaryInput" className="sr-only">Your corrections or feedback on the AI's summary</Label>
              <Textarea
                id="feedbackOnSummaryInput"
                value={userFeedbackOnSummary}
                onChange={(e) => setUserFeedbackOnSummary(e.target.value)}
                placeholder="After reviewing the AI's summary above, enter your specific corrections, additions, or feedback here..."
                rows={5}
                aria-label="Your corrections or feedback on the AI's summary"
                disabled={!aiCaseSummary || isSummarizing || isRefiningFromFeedback || isLoading || isRefiningAnalysis}
              />
            </CardContent>
            <CardFooter>
              <Button
                variant="default"
                onClick={handleSubmitFeedbackOnSummary}
                disabled={!aiCaseSummary || !userFeedbackOnSummary.trim() || isSummarizing || isRefiningFromFeedback || isLoading || isRefiningAnalysis}
              >
                {isRefiningFromFeedback ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Refining Final Analysis...
                  </>
                ) : (
                  "Submit Feedback & Get Final Refined Analysis"
                )}
              </Button>
            </CardFooter>
          </Card>

        </div>
      )}
    </div>
  );
}

    