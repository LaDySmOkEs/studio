// src/app/case-analysis/actions.ts
'use server';

import { z } from "zod"; // Still needed for instanceof check
import type { SuggestRelevantLawsInput, SuggestRelevantLawsOutput } from "@/ai/flows/suggest-relevant-laws";
import { suggestRelevantLaws } from "@/ai/flows/suggest-relevant-laws";
import { formSchema, type CaseAnalysisFormValues } from "./schemas"; // Import from the new schemas file

// Server Action
export async function handleCaseAnalysisAction(data: CaseAnalysisFormValues): Promise<SuggestRelevantLawsOutput | { error: string }> {
  try {
    // Validate input with the schema (React Hook Form does this on client, but good practice for actions)
    const validatedData = formSchema.parse(data);
    const input: SuggestRelevantLawsInput = { caseDetails: validatedData.caseDetails };
    const result = await suggestRelevantLaws(input);
    return result;
  } catch (error) {
    console.error("Error in AI suggestion:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input: " + error.errors.map(e => e.message).join(", ") };
    }
    return { error: error instanceof Error ? error.message : "An unknown error occurred." };
  }
}
