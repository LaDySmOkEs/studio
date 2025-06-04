
// src/app/mock-trial/actions.ts
'use server';

import { 
  generateMockTrialScript, 
  type GenerateMockTrialScriptInput, 
  type GenerateMockTrialScriptOutput 
} from "@/ai/flows/generateMockTrialScript";
import { z } from "zod";

export async function handleGenerateMockTrialScriptAction(
  input: GenerateMockTrialScriptInput
): Promise<GenerateMockTrialScriptOutput | { error: string }> {
  try {
    // Zod validation for input might be good here if not already handled by the flow's inputSchema
    // const validatedInput = GenerateMockTrialScriptInputSchema.parse(input); // Assuming schema is exported or defined here
    const result = await generateMockTrialScript(input);
    return result;
  } catch (error) {
    console.error("Error in AI mock trial script generation:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input for script generation: " + error.errors.map(e => e.message).join(", ") };
    }
    return { error: error instanceof Error ? error.message : "An unknown error occurred while generating the mock trial script." };
  }
}
