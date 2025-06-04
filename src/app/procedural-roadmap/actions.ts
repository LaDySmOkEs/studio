
// src/app/procedural-roadmap/actions.ts
'use server';

import { 
  generateProceduralRoadmap, 
  type GenerateProceduralRoadmapInput, 
  type GenerateProceduralRoadmapOutput 
} from "@/ai/flows/generateProceduralRoadmap";
import { z } from "zod";

// Re-define schema for validation within the action, as it's good practice
// even if flow also validates. This catches issues before calling the flow.
const GenerateProceduralRoadmapInputSchemaForAction = z.object({
  caseDetails: z.string().min(50, {message: "Case details must be at least 50 characters."}),
  caseCategory: z.enum(["general", "criminal", "civil"]),
  currentStage: z.string().min(10, {message: "Current stage description is too short."}),
  jurisdictionInfo: z.string().min(5, {message: "Jurisdiction information is too short."}),
});


export async function handleGenerateRoadmapAction(
  input: GenerateProceduralRoadmapInput
): Promise<GenerateProceduralRoadmapOutput | { error: string }> {
  try {
    const validatedInput = GenerateProceduralRoadmapInputSchemaForAction.parse(input);
    const result = await generateProceduralRoadmap(validatedInput);
    return result;
  } catch (error) {
    console.error("Error in AI roadmap generation:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input for roadmap generation: " + error.errors.map(e => e.message).join(", ") };
    }
    return { error: error instanceof Error ? error.message : "An unknown error occurred while generating the procedural roadmap." };
  }
}
