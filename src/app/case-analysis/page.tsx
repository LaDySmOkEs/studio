
// src/app/case-analysis/page.tsx
"use client";

import { useState, type ChangeEvent, useRef } from "react";
import Link from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lightbulb, ArrowRight, FileText, Scale, HelpCircle, UploadCloud, Verified, Edit } from "lucide-react";
import type { SuggestRelevantLawsOutput } from "@/ai/flows/suggest-relevant-laws";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

import { handleCaseAnalysisAction } from "./actions";
import { formSchema, type CaseAnalysisFormValues } from "./schemas";


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
      toast({
        title: "Initial Analysis Complete",
        description: `Relevant laws for ${form.getValues("caseCategory")} case, confidence score, and suggested documents are now available. Conceptual follow-up steps are shown below.`,
      });
    }
    setIsLoading(false);
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
      description: "This feature is a placeholder. In a full version, this action would trigger further AI processing.",
      duration: 4000,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Scale /> Intelligent Case Analysis Engine
            </CardTitle>
          <CardDescription>
            Provide initial details about your case (Phase 1). After initial analysis, conceptual steps for clarification, document upload, and verification will be shown. This tool is for informational purposes only.
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
                    <FormLabel htmlFor="caseCategory" className="text-lg">Case Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger id="caseCategory" aria-describedby="caseCategory-message">
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
                    <FormLabel htmlFor="caseDetails" className="text-lg">Phase 1: Free-Form Narrative</FormLabel>
                    <FormControl>
                      <Textarea
                        id="caseDetails"
                        placeholder="Describe your situation in your own words. Include key facts, parties involved, and legal questions..."
                        rows={10}
                        className="resize-none"
                        {...field}
                        aria-describedby="caseDetails-message"
                      />
                    </FormControl>
                    <FormMessage id="caseDetails-message" />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing (Phase 1)...
                  </>
                ) : (
                  "Analyze Case & Suggest Documents"
                )}
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

      {analysisResult && (
        <div className="space-y-6 mt-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Initial Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
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
                <Card>
                  <CardHeader>
                    <CardTitle>Confidence Score</CardTitle>
                    <CardDescription>
                      Our confidence in the relevance of the suggested laws based on the initial details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Progress value={analysisResult.confidenceScore * 100} className="w-full" aria-label={`Confidence score: ${Math.round(analysisResult.confidenceScore * 100)}%`}/>
                    <p className="text-2xl font-bold text-center text-primary">
                      {Math.round(analysisResult.confidenceScore * 100)}%
                    </p>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-muted-foreground">
                      Note: Higher scores indicate greater confidence. Always consult with a legal professional.
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
                      Based on your case analysis, we suggest considering these document types:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      {analysisResult.suggestedDocumentTypes.map((docType) => (
                        <li key={docType} className="capitalize text-sm">{docType}</li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/document-generator?suggested=${analysisResult.suggestedDocumentTypes.join(',')}`}>
                      <Button variant="outline">
                        Go to Document Generator
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )}
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
                In a more advanced system, the AI might ask follow-up questions to refine its understanding.
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
              <Textarea
                value={clarifications}
                onChange={(e) => setClarifications(e.target.value)}
                placeholder="Your answers to potential clarifying questions..."
                rows={5}
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
                Conceptual Phase 3: Document Upload
              </CardTitle>
              <CardDescription>
                You could upload relevant documents (e.g., police reports, contracts) for AI analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <Alert variant="default" className="border-accent bg-accent/10">
                <AlertTitle className="font-semibold text-accent">Document Analysis:</AlertTitle>
                <AlertDescription>
                  In a full version, uploaded documents would be analyzed using OCR and content analysis to extract key information, confirm details, and further refine the case assessment.
                </AlertDescription>
              </Alert>
              <Input
                id="conceptualDocumentUpload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
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
                Review the AI's understanding and provide corrections or additional details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="default" className="border-accent bg-accent/10">
                <AlertTitle className="font-semibold text-accent">Verification Step:</AlertTitle>
                <AlertDescription>
                  The AI would present its current understanding for your review. You could then correct any misinterpretations or add missing information.
                </AlertDescription>
              </Alert>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Your corrections or additional details for the AI..."
                rows={5}
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

