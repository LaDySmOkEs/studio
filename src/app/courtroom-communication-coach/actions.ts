
// src/app/courtroom-communication-coach/actions.ts
'use server';

import { 
  generateCourtroomPhrasingSuggestions, 
  type GenerateCourtroomPhrasingInput, 
  type GenerateCourtroomPhrasingOutput,
  GenerateCourtroomPhrasingInputSchema
} from "@/ai/flows/generateCourtroomPhrasingSuggestions";
import { z } from "zod";

export async function handleGeneratePhrasingSuggestionsAction(
  input: GenerateCourtroomPhrasingInput
): Promise<GenerateCourtroomPhrasingOutput | { error: string }> {
  try {
    const validatedInput = GenerateCourtroomPhrasingInputSchema.parse(input);
    const result = await generateCourtroomPhrasingSuggestions(validatedInput);
    return result;
  } catch (error) {
    console.error("Error in AI phrasing suggestions generation:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input: " + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(", ") };
    }
    return { error: error instanceof Error ? error.message : "An unknown error occurred while generating suggestions." };
  }
}
