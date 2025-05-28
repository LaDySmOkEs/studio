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
