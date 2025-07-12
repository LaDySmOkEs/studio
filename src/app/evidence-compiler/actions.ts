// src/app/evidence-compiler/actions.ts
'use server';

import { z } from "zod";
import { 
  analyzeDocumentContent, 
  type DocumentEvidenceInput, 
  type DocumentEvidenceAnalysisOutput,
  DocumentEvidenceInputSchema // Assuming flow exports this schema
} from "@/ai/flows/analyzeDocumentContent";

export async function handleAnalyzeDocumentContentAction(
  input: DocumentEvidenceInput
): Promise<DocumentEvidenceAnalysisOutput | { error: string }> {
  try {
    // Validate input if schema is exported, otherwise Genkit handles it
    const validatedInput = DocumentEvidenceInputSchema.parse(input); 
    const result = await analyzeDocumentContent(validatedInput);
    return result;
  } catch (error) {
    console.error("Error in AI document content analysis:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input for document analysis: " + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(", ") };
    }
    return { error: error instanceof Error ? error.message : "An unknown error occurred while analyzing document content." };
  }
}
