
// src/app/violations-registry/actions.ts
'use server';

import { 
  analyzeViolationReport,
} from "@/ai/flows/analyzeViolationReport";
import {
  type ViolationReportInput, 
  type ViolationAnalysisOutput,
  ViolationReportInputSchema
} from '@/ai/schemas/violationReportSchemas';
import { z } from "zod";


export async function handleViolationReportAction(
  input: ViolationReportInput
): Promise<ViolationAnalysisOutput | { error: string }> {
  try {
    const validatedInput = ViolationReportInputSchema.parse(input);
    const result = await analyzeViolationReport(validatedInput);
    return result;
  } catch (error) {
    console.error("Error in AI violation report analysis:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input for violation report: " + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(", ") };
    }
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while analyzing the report.";
    return { error: errorMessage };
  }
}
