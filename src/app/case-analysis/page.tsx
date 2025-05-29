
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
import { Loader2, Lightbulb, FileText, Scale, HelpCircle, UploadCloud, Verified, Edit, Info, ShieldAlert, Trash2, ArrowRight, Brain } from "lucide-react";
import type { SuggestRelevantLawsOutput } from "@/ai/flows/suggest-relevant-laws";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import { handleCaseAnalysisAction } from "./actions";
import { formSchema, type CaseAnalysisFormValues } from "./schemas";

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
      nextSteps: "Review suggestions carefully. Enhanced disclaimers apply. Consider using the 'Guided Clarification' or 'Document Upload' sections below to provide more details. Consulting a legal professional is strongly advised.",
      colorClass: "text-yellow-600",
    };
  } else if (roundedScore >= 50) {
    return {
      level: `Low Confidence (${roundedScore}%)`,
      explanation: `The AI has low confidence. The initial information may be too general or lack specific legal keywords. Suggestions provided are broad.${criminalCaution}`,
      nextSteps: "It is highly recommended to provide more details through the 'Guided Clarification', 'Document Upload', or 'Structured Verification' sections. Stronger attorney recommendations apply. Seeking advice from a legal professional is critical.",
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
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [clarifications, setClarifications] = useState("");
  const [feedback, setFeedback] = useState("");
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
            action: ( <Button variant="ghost" size="sm" onClick={() => clearStoredCaseDetails(true)}> <Trash2 className="mr-2 h-4 w-4" /> Clear Data </Button> ),
          });
        }
      }
    } catch (e) {
      console.error("Failed to load or parse case data from localStorage", e);
      localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted data
    }
  }, [form, toast]);


  const onSubmit: SubmitHandler<CaseAnalysisFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setClarifications("");
    setSelectedFileName(null);
    setFeedback("");

    const result = await handleCaseAnalysisAction(data);

    if ('error' in result) {
      setError(result.error);
      toast({
        title: "Analysis Failed",
        description: result.error,
        variant: "destructive",
      });
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
          description: `Relevant laws for ${form.getValues("caseCategory")} case, confidence score, due process violation assessment, and suggested documents are now available. Case details saved for other app features.`,
        });
      } catch (e) {
        console.error("Failed to save case data to localStorage", e);
        toast({
          title: "Analysis Complete (Save Failed)",
          description: "Analysis complete, but failed to save case details for other app features due to a storage issue.",
          variant: "destructive",
        });
      }
    }
    setIsLoading(false);
  };

  const clearStoredCaseDetails = (showToast = true) => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      form.reset({
        caseDetails: "",
        caseCategory: "general",
      });
      setAnalysisResult(null); // Also clear current analysis results from display
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
      title: `Conceptual: ${phaseName}`,
      description: "This feature is a placeholder. In a full version, this action would trigger further AI processing and potentially refine analysis or learn from feedback.",
      duration: 5000,
    });
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
            Provide initial details about your case (Phase 1). After initial analysis, conceptual steps for clarification, document upload, and verification will be shown.
            Case details entered here can be saved and referenced in other parts of the app (e.g., Document Generator).
            This tool is for informational purposes and to assist with organizing your thoughts. <strong>It does not provide legal advice.</strong> All AI-generated suggestions, including any assessment of due process, should be reviewed by a qualified legal professional. Case details submitted are processed by an AI model; please avoid submitting highly sensitive personal identifiable information.
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
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing (Phase 1)...
                  </>
                ) : (
                  "Analyze Case & Save Details"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => clearStoredCaseDetails(true)} className="w-full sm:w-auto" aria-label="Clear stored case details from browser">
                 <Trash2 className="mr-2 h-4 w-4" /> Clear Stored Details
              </Button>
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
              <CardTitle className="text-xl">Initial Analysis Results</CardTitle>
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
                            <li><strong>Consistency:</strong> The internal consistency of your narrative and (conceptual) follow-up information.</li>
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
                      This is a conceptual AI assessment of potential due process concerns (e.g., issues with notice, opportunity to be heard, right to counsel if criminal, Miranda issues, inadequate representation). It considers the severity and volume of potential issues mentioned in your case narrative. It is <strong>not a legal determination</strong>.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive-foreground dark:text-destructive-foreground/90">
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
                        onClick={() => toast({
                            title: "Conceptual Feature: AI Filing Decider",
                            description: "In a more advanced system, clicking this would trigger an AI to analyze your case further and provide more specific advice on exactly what to file and when. This feature is conceptual for now.",
                            duration: 7000,
                        })}
                        className="mt-4"
                        aria-label="Help me decide what to file (Conceptual)"
                        >
                        <Brain className="mr-2 h-4 w-4" /> Help Me Decide What to File (Conceptual)
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card className="shadow-md mt-6 border-accent">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                    <Brain className="w-5 h-5 text-accent" /> AI Suggested Strategies & Motions (Conceptual)
                    </CardTitle>
                    <CardDescription>
                    Based on the initial analysis and due process assessment, a more advanced AI could suggest specific legal strategies or motions (e.g., "Motion to Suppress," "Entrapment defense considerations"). This is a conceptual feature.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert variant="default" className="bg-accent/10">
                    <AlertTitle className="font-semibold text-accent">Example AI Suggestions (Conceptual):</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc pl-5 text-sm mt-1">
                        <li>If 'High Risk' Due Process Violation related to search and seizure: "Consider researching a 'Motion to Suppress Evidence' based on potential Fourth Amendment violations."</li>
                        <li>If case details imply coercion for a confession: "Explore if an 'Entrapment' defense or issues with voluntariness of statements are relevant."</li>
                        <li>If inadequate notice for a hearing is indicated: "Review procedures for 'Motion to Vacate Order' due to improper notice."</li>
                        </ul>
                        <p className="mt-2 text-xs"><strong>Disclaimer:</strong> These are highly simplified examples. Actual legal strategy is complex and requires professional legal advice.</p>
                    </AlertDescription>
                    </Alert>
                </CardContent>
              </Card>

            </CardContent>
          </Card>

          {/* Phase 2: Guided Clarification (Conceptual) */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-accent" />
                Conceptual Phase 2: Guided Clarification
              </CardTitle>
              <CardDescription>
                In a more advanced system, the AI might ask follow-up questions to refine its understanding. Your responses here would help improve accuracy. This tool does not provide legal advice.
                If you've logged events in the <Link href="/timeline-event-log" className="text-primary hover:underline">Timeline & Event Log</Link>, you can use that information to answer these clarifying questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="default" className="border-accent bg-accent/10">
                <AlertTitle className="font-semibold text-accent">Example Clarifying Questions:</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 text-sm">
                    <li>"Could you provide specific dates or a timeline for the events you described?"</li>
                    <li>"Who are the main parties involved, and what are their relationships to each other?"</li>
                    <li>"Were there any specific damages, injuries, or losses incurred? If so, please detail them."</li>
                  </ul>
                </AlertDescription>
              </Alert>
              <Label htmlFor="clarificationsInput" className="sr-only">Your answers to potential clarifying questions</Label>
              <Textarea
                id="clarificationsInput"
                value={clarifications}
                onChange={(e) => setClarifications(e.target.value)}
                placeholder="Your answers to potential clarifying questions..."
                rows={5}
                aria-label="Your answers to potential clarifying questions"
              />
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => handlePlaceholderSubmit("Guided Clarification")}>
                Submit Clarifications (Conceptual)
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

          {/* Phase 4: Structured Verification (Conceptual) */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Verified className="w-5 h-5 text-accent" />
                 Conceptual Phase 4: Structured Verification & Refinement
              </CardTitle>
              <CardDescription>
                Review the AI's current understanding and provide corrections or additional details. In a full system, this feedback would help the AI learn and improve.
                For this prototype, the AI does not learn from feedback. This tool does not provide legal advice.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="default" className="border-accent bg-accent/10">
                <AlertTitle className="font-semibold text-accent">Verification & System Improvement:</AlertTitle>
                <AlertDescription>
                  The AI would present its summarized understanding of your case based on all information provided. You could then correct any misinterpretations or add crucial missing information. This iterative feedback loop is essential for refining the AI's accuracy and, in a production system, would contribute to its ongoing learning and improvement for future analyses.
                </AlertDescription>
              </Alert>
              <Label htmlFor="feedbackInput" className="sr-only">Your corrections or additional details for the AI</Label>
              <Textarea
                id="feedbackInput"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Your corrections or additional details for the AI..."
                rows={5}
                aria-label="Your corrections or additional details for the AI"
              />
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => handlePlaceholderSubmit("Feedback & Refinement")}>
                Submit Feedback & Refine Analysis (Conceptual)
              </Button>
            </CardFooter>
          </Card>

        </div>
      )}
    </div>
  );
}
    

    

    