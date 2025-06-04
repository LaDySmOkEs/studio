
// src/ai/flows/generateProceduralRoadmap.ts
'use server';

/**
 * @fileOverview This flow generates a procedural roadmap with potential steps, tasks, and estimated timelines for a legal case.
 *
 * - generateProceduralRoadmap - A function that takes case context and returns a procedural roadmap.
 * - GenerateProceduralRoadmapInput - The input type for the function.
 * - GenerateProceduralRoadmapOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProceduralRoadmapInputSchema = z.object({
  caseDetails: z.string().min(50, {message: "Please provide sufficient details about your case."}).describe("Sufficient details of the legal case, including key facts, parties involved, and general nature of the dispute or charges."),
  caseCategory: z.enum(["general", "criminal", "civil"], {required_error: "Please select a case category."}).describe("The general category of the case (e.g., criminal, civil, general inquiry)."),
  currentStage: z.string().min(10, {message: "Please describe the current stage of your case."}).describe("The user's description of the current stage of their case (e.g., 'Just filed a complaint', 'Received discovery requests', 'Preparing for a hearing on [date]', 'Arrested, awaiting arraignment')."),
  jurisdictionInfo: z.string().min(5, {message: "Please provide jurisdiction information."}).describe("Information about the court or jurisdiction (e.g., 'Federal Court, Southern District of New York', 'California Superior Court, Los Angeles County', 'Small Claims Court, Travis County, Texas', 'State of Florida, criminal court'). This helps contextualize procedural rules, but AI responses will remain general."),
});
export type GenerateProceduralRoadmapInput = z.infer<typeof GenerateProceduralRoadmapInputSchema>;

const RoadmapStepSchema = z.object({
  stepName: z.string().describe("A concise name for the procedural step or task (e.g., 'Serve Defendant with Summons and Complaint', 'File Answer to Complaint', 'Attend Initial Case Management Conference', 'Prepare for Bail Hearing')."),
  description: z.string().describe("A brief explanation of what this step involves, why it's important, or what typically happens."),
  estimatedDueDate: z.string().optional().describe("A general, estimated timeframe or deadline for this step. Should be phrased generally (e.g., 'Within 90 days of filing complaint', 'Typically 30 days after service', 'At least 14 days before hearing', 'Usually within 48-72 hours of arrest'). Avoid specific calendar dates."),
  isTask: z.boolean().describe("Set to true if this step represents an actionable task for the user to complete or prepare for. Set to false if it's more of an informational or event-based step (e.g., 'Court issues scheduling order', 'Prosecution presents evidence')."),
  relatedDocuments: z.array(z.string()).optional().describe("A list of document types commonly associated with this step (e.g., ['Summons', 'Complaint', 'Proof of Service'], ['Answer'], ['Witness List', 'Exhibit List'], ['Bail Application']). Max 3 documents."),
});

const GenerateProceduralRoadmapOutputSchema = z.object({
  roadmapSteps: z.array(RoadmapStepSchema).min(3).max(10).describe("An array of 3-10 procedural steps or tasks relevant to the user's case stage and category, ordered logically."),
  disclaimer: z.string().describe("A standard disclaimer stating that this is AI-generated general information, not legal advice, and procedures vary greatly by jurisdiction and specific case facts. Emphasize consulting official court rules and an attorney."),
});
export type GenerateProceduralRoadmapOutput = z.infer<typeof GenerateProceduralRoadmapOutputSchema>;

export async function generateProceduralRoadmap(input: GenerateProceduralRoadmapInput): Promise<GenerateProceduralRoadmapOutput> {
  return generateProceduralRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProceduralRoadmapPrompt',
  input: {schema: GenerateProceduralRoadmapInputSchema},
  output: {schema: GenerateProceduralRoadmapOutputSchema},
  prompt: `You are an AI Legal Procedural Assistant.
Based on the provided case details, case category, current stage, and jurisdiction information, generate a procedural roadmap.
The roadmap should consist of 3 to 10 logically ordered steps or tasks that are likely to occur or need to be addressed next.

For each step in 'roadmapSteps':
- 'stepName': Provide a concise name for the step (e.g., "File Answer to Complaint", "Prepare for Preliminary Hearing").
- 'description': Briefly explain what the step involves or its significance.
- 'estimatedDueDate': Give a GENERAL estimated timeframe or deadline (e.g., "Typically 21-30 days after being served", "Approx. 2-4 weeks before trial", "Usually within 24-72 hours of arrest"). AVOID specific calendar dates. If no typical timeframe, state "Varies greatly".
- 'isTask': Set to true if this is an actionable item for the user (e.g., filing a document, preparing for an event). Set to false for events largely out of user's direct action (e.g., "Court reviews motion").
- 'relatedDocuments': If applicable, list 1-3 key document types related to this step (e.g., "Summons", "Motion for Discovery", "Plea Agreement Form").

Case Details: {{{caseDetails}}}
Case Category: {{{caseCategory}}}
Current Stage: {{{currentStage}}}
Jurisdiction Info: {{{jurisdictionInfo}}}

Focus on common procedural pathways. For criminal cases, consider steps like arraignment, bail, discovery, plea negotiations, motions, trial. For civil cases, consider service, answer, discovery, motions, settlement, trial.

Finally, provide a 'disclaimer': "This procedural roadmap is AI-generated general information based on common legal pathways and should not be considered legal advice. Actual procedures, deadlines, and requirements vary significantly by jurisdiction, specific court rules, and the unique facts of your case. Always consult official court rules for your specific jurisdiction and seek guidance from a qualified legal professional."

Ensure your output strictly adheres to the defined schema.
`,
});

const generateProceduralRoadmapFlow = ai.defineFlow(
  {
    name: 'generateProceduralRoadmapFlow',
    inputSchema: GenerateProceduralRoadmapInputSchema,
    outputSchema: GenerateProceduralRoadmapOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a procedural roadmap.");
    }
    // Ensure the disclaimer is always the specific one.
    return {
      ...output,
      disclaimer: "This procedural roadmap is AI-generated general information based on common legal pathways and should not be considered legal advice. Actual procedures, deadlines, and requirements vary significantly by jurisdiction, specific court rules, and the unique facts of your case. Always consult official court rules for your specific jurisdiction and seek guidance from a qualified legal professional."
    };
  }
);
