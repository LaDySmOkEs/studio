
// src/app/case-analysis/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lightbulb, ArrowRight, FileText, Scale } from "lucide-react";
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
        title: "Analysis Complete",
        description: `Relevant laws for ${form.getValues("caseCategory")} case, confidence score, and suggested documents are now available.`,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Scale /> Intelligent Case Analysis Engine
            </CardTitle>
          <CardDescription>
            Enter the details of your case and select the primary legal category. Our AI will analyze the information, suggest relevant case laws, and recommend document types. This tool is for informational purposes only and does not constitute legal advice.
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
                    <FormLabel htmlFor="caseDetails" className="text-lg">Case Details</FormLabel>
                    <FormControl>
                      <Textarea
                        id="caseDetails"
                        placeholder="Provide a detailed description of the case, including key facts, parties involved, and legal questions..."
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
                    Analyzing...
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
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-md">
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
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Confidence Score</CardTitle>
                <CardDescription>
                  Our confidence in the relevance of the suggested laws based on the provided details.
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
            <Card className="shadow-md">
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
        </div>
      )}
    </div>
  );
}
