
// src/app/negotiation-coach/actions.ts
'use server';

import { 
  generateNegotiationAdvice, 
  type GenerateNegotiationAdviceInput, 
  type GenerateNegotiationAdviceOutput,
  GenerateNegotiationAdviceInputSchema // Assuming you export this from the flow for validation
} from "@/ai/flows/generateNegotiationAdvice";
import { z } from "zod";

export async function handleGenerateNegotiationAdviceAction(
  input: GenerateNegotiationAdviceInput
): Promise<GenerateNegotiationAdviceOutput | { error: string }> {
  try {
    // Validate input against the schema defined in the flow or a local copy
    const validatedInput = GenerateNegotiationAdviceInputSchema.parse(input);
    const result = await generateNegotiationAdvice(validatedInput);
    return result;
  } catch (error) {
    console.error("Error in AI negotiation advice generation:", error);
    if (error instanceof z.ZodError) {
      // Format Zod errors for better display
      return { error: "Invalid input: " + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(", ") };
    }
    return { error: error instanceof Error ? error.message : "An unknown error occurred while generating negotiation advice." };
  }
}

