// src/ai/flows/suggest-relevant-laws.ts
'use server';

/**
 * @fileOverview This flow suggests relevant case laws and document types based on user-provided case details.
 *
 * - suggestRelevantLaws - A function that takes case details as input and returns suggested case laws and document types.
 * - SuggestRelevantLawsInput - The input type for the suggestRelevantLaws function.
 * - SuggestRelevantLawsOutput - The return type for the suggestRelevantLaws function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelevantLawsInputSchema = z.object({
  caseDetails: z
    .string()
    .describe('Detailed information about the case for which relevant laws are to be suggested.'),
});
export type SuggestRelevantLawsInput = z.infer<typeof SuggestRelevantLawsInputSchema>;

const SuggestRelevantLawsOutputSchema = z.object({
  relevantLaws: z
    .string()
    .describe('A list of relevant case laws suggested by the AI, based on the case details.'),
  confidenceScore: z.number().describe('The confidence score of the suggestion for laws (0-1).'),
  suggestedDocumentTypes: z
    .array(z.enum(["motion", "affidavit", "complaint"]))
    .describe('A list of document types (e.g., motion, affidavit, complaint) that might be relevant to generate for this case. If no specific documents seem immediately relevant, return an empty list.'),
});
export type SuggestRelevantLawsOutput = z.infer<typeof SuggestRelevantLawsOutputSchema>;

export async function suggestRelevantLaws(input: SuggestRelevantLawsInput): Promise<SuggestRelevantLawsOutput> {
  return suggestRelevantLawsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantLawsPrompt',
  input: {schema: SuggestRelevantLawsInputSchema},
  output: {schema: SuggestRelevantLawsOutputSchema},
  prompt: `You are an expert legal assistant. Based on the following case details, suggest relevant case laws and also suggest types of legal documents that might be appropriate to generate for this case. The only valid document types you can suggest are 'motion', 'affidavit', or 'complaint'.

Case Details: {{{caseDetails}}}

Ensure that you also provide a confidence score (0-1) for your legal suggestions. The confidence score must be between 0 and 1.
Return a list of suggested document types. If no specific documents seem immediately relevant, return an empty list for suggestedDocumentTypes.
`,
});

const suggestRelevantLawsFlow = ai.defineFlow(
  {
    name: 'suggestRelevantLawsFlow',
    inputSchema: SuggestRelevantLawsInputSchema,
    outputSchema: SuggestRelevantLawsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
