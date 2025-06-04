
// src/ai/flows/summarizeCaseUnderstanding.ts
'use server';

/**
 * @fileOverview This flow generates a summary of the AI's understanding of a case.
 *
 * - summarizeCaseUnderstanding - A function that takes case narrative and prior analysis outputs to generate a summary.
 * - SummarizeCaseInput - The input type for the function.
 * - CaseSummaryOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const SummarizeCaseInputSchema = z.object({
  fullCaseNarrative: z.string().describe('The complete narrative of the case, including original details and any clarifications.'),
  relevantLaws: z.string().describe('The relevant laws previously identified by the AI.'),
  dueProcessViolationScore: z.string().describe('The due process violation assessment previously provided by the AI.'),
});
export type SummarizeCaseInput = z.infer<typeof SummarizeCaseInputSchema>;

export const CaseSummaryOutputSchema = z.object({
  summaryText: z.string().describe("A concise summary of the AI's understanding of the key facts, main legal issues, and due process concerns."),
});
export type CaseSummaryOutput = z.infer<typeof CaseSummaryOutputSchema>;

export async function summarizeCaseUnderstanding(input: SummarizeCaseInput): Promise<CaseSummaryOutput> {
  return summarizeCaseUnderstandingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCaseUnderstandingPrompt',
  input: {schema: SummarizeCaseInputSchema},
  output: {schema: CaseSummaryOutputSchema},
  prompt: `You are an expert legal assistant. Based on the full case narrative and your previous analysis (identified relevant laws and due process assessment), provide a concise summary of your understanding of the case. 
This summary should cover:
1. Key facts as you understand them.
2. Main legal issues you've identified.
3. Your current assessment of potential due process concerns.

This summary will be presented to the user for verification, so it should be clear and easy to understand.

Full Case Narrative:
{{{fullCaseNarrative}}}

Previously Identified Relevant Laws:
{{{relevantLaws}}}

Previously Assessed Due Process Violation Score:
{{{dueProcessViolationScore}}}

Generate the summaryText.
`,
});

const summarizeCaseUnderstandingFlow = ai.defineFlow(
  {
    name: 'summarizeCaseUnderstandingFlow',
    inputSchema: SummarizeCaseInputSchema,
    outputSchema: CaseSummaryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to provide a case summary.");
    }
    return output;
  }
);
