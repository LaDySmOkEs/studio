
// src/ai/flows/criminalLawSuggestions.ts
'use server';

/**
 * @fileOverview This flow suggests relevant criminal case laws and document types based on user-provided case details.
 *
 * - criminalLawSuggestions - A function that takes case details as input and returns suggested criminal case laws and document types.
 * - CriminalLawSuggestionsInput - The input type for the criminalLawSuggestions function.
 * - CriminalLawSuggestionsOutput - The return type for the criminalLawSuggestions function (structurally same as SuggestRelevantLawsOutput).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { SuggestRelevantLawsOutput } from './suggest-relevant-laws'; // Re-using the output structure

const CriminalLawSuggestionsInputSchema = z.object({
  caseDetails: z
    .string()
    .describe('Detailed information about the criminal case for which relevant laws are to be suggested.'),
});
export type CriminalLawSuggestionsInput = z.infer<typeof CriminalLawSuggestionsInputSchema>;

// Output schema is the same as SuggestRelevantLawsOutput for consistency
const CriminalLawSuggestionsOutputSchema = z.object({
  relevantLaws: z
    .string()
    .describe('A list of relevant criminal case laws and precedents suggested by the AI.'),
  confidenceScore: z.number().describe('The confidence score of the suggestion for criminal laws (0-1).'),
  suggestedDocumentTypes: z
    .array(z.enum(["motion", "affidavit", "complaint"]))
    .describe('A list of document types relevant to this criminal case.'),
});
export type CriminalLawSuggestionsOutput = z.infer<typeof CriminalLawSuggestionsOutputSchema>;


export async function criminalLawSuggestions(input: CriminalLawSuggestionsInput): Promise<CriminalLawSuggestionsOutput> {
  return criminalLawSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'criminalLawSuggestionsPrompt',
  input: {schema: CriminalLawSuggestionsInputSchema},
  output: {schema: CriminalLawSuggestionsOutputSchema},
  prompt: `You are an expert AI legal assistant specializing in Criminal Law. Based on the case details provided, suggest relevant state and federal case laws.
Focus on:
- Constitutional precedents (e.g., Fourth, Fifth, Sixth Amendments)
- Supreme Court criminal procedure rules
- State criminal code interpretations (assume a generic US state jurisdiction if not specified, or ask for clarification if critical)
- Sentencing guidelines and relevant case law
- Landmark cases related to Miranda rights, search and seizure, right to counsel, etc.

Also, suggest types of legal documents (from the allowed list: 'motion', 'affidavit', 'complaint') that might be appropriate to generate for this case.
Provide a confidence score (a number between 0 and 1, where 1 is highest confidence) for your legal suggestions.

Case Details:
{{{caseDetails}}}

Ensure your output strictly adheres to the defined schema, including specific document types and a numeric confidence score.
If no specific documents seem immediately relevant from the allowed list, return an empty list for suggestedDocumentTypes.
`,
});

const criminalLawSuggestionsFlow = ai.defineFlow(
  {
    name: 'criminalLawSuggestionsFlow',
    inputSchema: CriminalLawSuggestionsInputSchema,
    outputSchema: CriminalLawSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output! as CriminalLawSuggestionsOutput; // Ensure correct typing
  }
);
