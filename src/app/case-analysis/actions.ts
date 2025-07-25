
// src/app/case-analysis/actions.ts
'use server';

import { z } from "zod";
// Note: SuggestRelevantLawsOutput is used as the general type because all three flows
// now have a structurally identical output, including `dueProcessViolationScore`.
import type { SuggestRelevantLawsInput, SuggestRelevantLawsOutput } from "@/ai/flows/suggest-relevant-laws";
import { suggestRelevantLaws } from "@/ai/flows/suggest-relevant-laws";

import type { CriminalLawSuggestionsInput } from "@/ai/flows/criminalLawSuggestions"; // CriminalLawSuggestionsOutput is structurally same as SuggestRelevantLawsOutput
import { criminalLawSuggestions } from "@/ai/flows/criminalLawSuggestions";

import type { CivilLawSuggestionsInput } from "@/ai/flows/civilLawSuggestions"; // CivilLawSuggestionsOutput is structurally same as SuggestRelevantLawsOutput
import { civilLawSuggestions } from "@/ai/flows/civilLawSuggestions";

import {
  suggestLegalStrategies,
  type SuggestLegalStrategiesInput,
  type SuggestLegalStrategiesOutput
} from "@/ai/flows/suggestLegalStrategies";

import {
  suggestFilingDecisionHelper,
  type SuggestFilingDecisionHelperInput,
  type SuggestFilingDecisionHelperOutput
} from "@/ai/flows/suggestFilingDecisionHelper";

import {
  refineCaseAnalysisWithClarification,
  type RefineCaseAnalysisInput,
  // RefineCaseAnalysisOutput is structurally the same as SuggestRelevantLawsOutput
} from "@/ai/flows/refineCaseAnalysisWithClarification";

import {
  summarizeCaseUnderstanding,
  type SummarizeCaseInput,
  type CaseSummaryOutput
} from "@/ai/flows/summarizeCaseUnderstanding";

import {
  refineAnalysisFromSummaryFeedback,
  type RefineFromFeedbackInput,
  // RefinedAnalysisOutput is structurally SuggestRelevantLawsOutput
} from "@/ai/flows/refineAnalysisFromSummaryFeedback";


import { formSchema, type CaseAnalysisFormValues } from "./schemas";

// The output type remains consistent across all flows, now including dueProcessViolationScore
export async function handleCaseAnalysisAction(data: CaseAnalysisFormValues): Promise<SuggestRelevantLawsOutput | { error: string }> {
  try {
    const validatedData = formSchema.parse(data);
    const { caseDetails, caseCategory } = validatedData;

    let result: SuggestRelevantLawsOutput; // Using the general output type as they are structurally identical

    switch (caseCategory) {
      case "criminal":
        const criminalInput: CriminalLawSuggestionsInput = { caseDetails };
        result = await criminalLawSuggestions(criminalInput);
        break;
      case "civil":
        const civilInput: CivilLawSuggestionsInput = { caseDetails };
        result = await civilLawSuggestions(civilInput);
        break;
      case "general":
      default:
        const generalInput: SuggestRelevantLawsInput = { caseDetails };
        result = await suggestRelevantLaws(generalInput);
        break;
    }
    return result;
  } catch (error) {
    console.error("Error in AI suggestion:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input: " + error.errors.map(e => e.message).join(", ") };
    }
    return { error: error instanceof Error ? error.message : "An unknown error occurred." };
  }
}

export async function handleSuggestStrategiesAction(input: SuggestLegalStrategiesInput): Promise<SuggestLegalStrategiesOutput | { error: string }> {
  try {
    const result = await suggestLegalStrategies(input);
    return result;
  } catch (error) {
    console.error("Error in AI strategy suggestion:", error);
    return { error: error instanceof Error ? error.message : "An unknown error occurred while suggesting strategies." };
  }
}

export async function handleSuggestFilingDecisionAction(input: SuggestFilingDecisionHelperInput): Promise<SuggestFilingDecisionHelperOutput | { error: string }> {
  try {
    const result = await suggestFilingDecisionHelper(input);
    return result;
  } catch (error) {
    console.error("Error in AI filing decision suggestion:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input for filing decision: " + error.errors.map(e => e.message).join(", ") };
    }
    return { error: error instanceof Error ? error.message : "An unknown error occurred while suggesting filing decisions." };
  }
}

export async function handleRefineAnalysisAction(input: RefineCaseAnalysisInput): Promise<SuggestRelevantLawsOutput | { error: string }> {
  try {
    // Input for refineCaseAnalysisWithClarification is RefineCaseAnalysisInput
    // Output is RefineCaseAnalysisOutput, which is structurally same as SuggestRelevantLawsOutput
    const result = await refineCaseAnalysisWithClarification(input);
    return result;
  } catch (error) {
    console.error("Error in AI analysis refinement:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input for refinement: " + error.errors.map(e => e.message).join(", ") };
    }
    return { error: error instanceof Error ? error.message : "An unknown error occurred while refining analysis." };
  }
}

export async function handleSummarizeCaseAction(input: SummarizeCaseInput): Promise<CaseSummaryOutput | { error: string }> {
  try {
    const result = await summarizeCaseUnderstanding(input);
    return result;
  } catch (error) {
    console.error("Error in AI case summarization:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input for summarization: " + error.errors.map(e => e.message).join(", ") };
    }
    return { error: error instanceof Error ? error.message : "An unknown error occurred while summarizing the case." };
  }
}

export async function handleRefineFromFeedbackAction(input: RefineFromFeedbackInput): Promise<SuggestRelevantLawsOutput | { error: string }> {
  try {
    const result = await refineAnalysisFromSummaryFeedback(input);
    return result;
  } catch (error) {
    console.error("Error in AI refinement from feedback:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input for refinement from feedback: " + error.errors.map(e => e.message).join(", ") };
    }
    return { error: error instanceof Error ? error.message : "An unknown error occurred while refining analysis from feedback." };
  }
}
