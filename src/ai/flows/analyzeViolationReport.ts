
// src/ai/flows/analyzeViolationReport.ts
'use server';

/**
 * @fileOverview A Genkit flow to analyze a user's report of a due process violation.
 *
 * - analyzeViolationReport - A function that takes a user's report and provides a conceptual analysis.
 */

import {ai} from '@/ai/genkit';
import { 
  ViolationReportInputSchema,
  type ViolationReportInput, 
  ViolationAnalysisOutputSchema,
  type ViolationAnalysisOutput 
} from '@/ai/schemas/violationReportSchemas';

export async function analyzeViolationReport(input: ViolationReportInput): Promise<ViolationAnalysisOutput> {
  return analyzeViolationReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeViolationReportPrompt',
  input: {schema: ViolationReportInputSchema},
  output: {schema: ViolationAnalysisOutputSchema},
  prompt: `You are an AI assistant helping a user analyze their report of a potential due process violation or official misconduct.
Your task is to provide a conceptual, informational analysis based on their narrative.

User's Report:
- Category of Violation: "{{violationCategory}}"
- Jurisdiction: "{{jurisdiction}}"
{{#if eventDate}}- Approx. Date: "{{eventDate}}"{{/if}}
{{#if involvedParties}}- Involved Parties/Agency: "{{involvedParties}}"{{/if}}
- Narrative:
"{{narrative}}"

Based on this report, provide the following:
1. 'potentialDueProcessElements': Identify 2-4 potential legal or due process elements that seem most relevant from the narrative. Examples: "Right to be heard," "Fourth Amendment search issue," "Proper notice of proceedings," "Right to counsel." Be general.
2. 'suggestedKeywords': Suggest 3-5 keywords or legal terms the user could research to learn more about their situation. Examples: "qualified immunity," "malicious prosecution," "Brady violation," "procedural due process," "excessive force."
3. 'conceptualNextSteps': Provide a brief, general paragraph suggesting conceptual next steps. This should include ideas like using the app's Evidence Compiler to gather related documents, using the Legal Library to research the suggested keywords, and the importance of consulting with a qualified attorney. Do NOT give legal advice.
4. 'disclaimer': Provide *exactly* this text: "This analysis is AI-generated for informational purposes and is not legal advice. It is based on the information provided and does not constitute a legal finding. Consult a qualified legal professional for advice on your specific situation."

Ensure your output strictly adheres to the defined schema.
`,
});

const analyzeViolationReportFlow = ai.defineFlow(
  {
    name: 'analyzeViolationReportFlow',
    inputSchema: ViolationReportInputSchema,
    outputSchema: ViolationAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to provide a violation report analysis.");
    }
    // Ensure the disclaimer is always the specific one, even if the model hallucinates another.
    return {
      ...output,
      disclaimer: "This analysis is AI-generated for informational purposes and is not legal advice. It is based on the information provided and does not constitute a legal finding. Consult a qualified legal professional for advice on your specific situation."
    };
  }
);
