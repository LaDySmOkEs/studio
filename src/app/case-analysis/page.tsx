// src/app/case-analysis/page.tsx
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// z is no longer directly needed here if formSchema is imported
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lightbulb } from "lucide-react";
import type { SuggestRelevantLawsOutput } from "@/ai/flows/suggest-relevant-laws";
// suggestRelevantLaws and SuggestRelevantLawsInput are no longer directly needed here
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

// Import from actions file and new schemas file
import { handleCaseAnalysisAction } from "./actions";
import { formSchema, type CaseAnalysisFormValues } from "./schemas"; // Updated import


export default function CaseAnalysisPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SuggestRelevantLawsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<CaseAnalysisFormValues>({
    resolver: zodResolver(formSchema), // formSchema is now imported from schemas.ts
    defaultValues: {
      caseDetails: "",
    },
  });

  const onSubmit: SubmitHandler<CaseAnalysisFormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const result = await handleCaseAnalysisAction(data); // Uses imported action

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
        description: "Relevant laws and confidence score are now available.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Intelligent Case Analysis</CardTitle>
          <CardDescription>
            Enter the details of your case below. Our AI will analyze the information and suggest relevant case laws. This tool is for informational purposes only and does not constitute legal advice.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
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
                  "Suggest Relevant Laws"
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
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-accent" />
                Suggested Relevant Laws
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
      )}
    </div>
  );
}
