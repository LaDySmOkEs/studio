// src/ai/schemas/violationReportSchemas.ts
import { z } from 'zod';

export const ViolationReportInputSchema = z.object({
  narrative: z.string().min(50, { message: "Please provide a detailed narrative of at least 50 characters." }).describe("The user's detailed account of the alleged violation."),
  involvedParties: z.string().optional().describe("Names of individuals, agencies, or departments allegedly involved."),
  violationCategory: z.string().describe("The primary category of the violation as selected by the user."),
  eventDate: z.string().optional().describe("The approximate date of the event."),
  jurisdiction: z.string().min(2, { message: "Please specify the jurisdiction." }).describe("The state, county, or city where the event occurred."),
});
export type ViolationReportInput = z.infer<typeof ViolationReportInputSchema>;

export const ViolationAnalysisOutputSchema = z.object({
  potentialDueProcessElements: z.array(z.string()).describe("A list of 2-4 potential due process elements or rights that appear relevant based on the narrative (e.g., 'Right to notice', 'Right to be heard', 'Fourth Amendment search issue')."),
  suggestedKeywords: z.array(z.string()).max(5).describe("A list of 3-5 relevant keywords for the user to research (e.g., 'qualified immunity', 'malicious prosecution', 'Brady violation')."),
  conceptualNextSteps: z.string().describe("A brief, general paragraph suggesting conceptual next steps, like gathering evidence, consulting the app's legal library on the suggested keywords, and speaking with an attorney."),
  disclaimer: z.string().describe("A standard disclaimer that this is AI-generated conceptual analysis, not legal advice."),
});
export type ViolationAnalysisOutput = z.infer<typeof ViolationAnalysisOutputSchema>;
