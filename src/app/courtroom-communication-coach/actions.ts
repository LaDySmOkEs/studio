
// src/app/courtroom-communication-coach/actions.ts
'use server';

import { 
  generateCourtroomPhrasingSuggestions, 
  type GenerateCourtroomPhrasingInput, 
  type GenerateCourtroomPhrasingOutput
  // GenerateCourtroomPhrasingInputSchema is no longer imported
} from "@/ai/flows/generateCourtroomPhrasingSuggestions";
import { z } from "zod";

export async function handleGeneratePhrasingSuggestionsAction(
  input: GenerateCourtroomPhrasingInput
): Promise<GenerateCourtroomPhrasingOutput | { error: string }> {
  try {
    // Input validation will be handled by the Genkit flow itself
    // as GenerateCourtroomPhrasingInputSchema is part of its definition.
    // No need for: const validatedInput = GenerateCourtroomPhrasingInputSchema.parse(input);
    const result = await generateCourtroomPhrasingSuggestions(input);
    return result;
  } catch (error) {
    console.error("Error in AI phrasing suggestions generation:", error);
    if (error instanceof z.ZodError) {
      // This will catch Zod errors if Genkit's internal validation fails
      return { error: "Invalid input: " + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(", ") };
    }
    return { error: error instanceof Error ? error.message : "An unknown error occurred while generating suggestions." };
  }
}
