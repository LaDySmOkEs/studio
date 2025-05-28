
// src/ai/flows/civilLawSuggestions.ts
'use server';

/**
 * @fileOverview This flow suggests relevant civil case laws and document types based on user-provided case details.
 *
 * - civilLawSuggestions - A function that takes case details as input and returns suggested civil case laws and document types.
 * - CivilLawSuggestionsInput - The input type for the civilLawSuggestions function.
 * - CivilLawSuggestionsOutput - The return type for the civilLawSuggestions function (structurally same as SuggestRelevantLawsOutput).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { SuggestRelevantLawsOutput } from './suggest-relevant-laws'; // Re-using the output structure

const CivilLawSuggestionsInputSchema = z.object({
  caseDetails: z
    .string()
    .describe('Detailed information about the civil case for which relevant laws are to be suggested.'),
});
export type CivilLawSuggestionsInput = z.infer<typeof CivilLawSuggestionsInputSchema>;

// Output schema is the same as SuggestRelevantLawsOutput for consistency
const CivilLawSuggestionsOutputSchema = z.object({
  relevantLaws: z
    .string()
    .describe('A list of relevant civil case laws and precedents suggested by the AI.'),
  confidenceScore: z.number().describe('The confidence score of the suggestion for civil laws (0-1).'),
  suggestedDocumentTypes: z
    .array(z.enum(["motion", "affidavit", "complaint"]))
    .describe('A list of document types relevant to this civil case.'),
});
export type CivilLawSuggestionsOutput = z.infer<typeof CivilLawSuggestionsOutputSchema>;

export async function civilLawSuggestions(input: CivilLawSuggestionsInput): Promise<CivilLawSuggestionsOutput> {
  return civilLawSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'civilLawSuggestionsPrompt',
  input: {schema: CivilLawSuggestionsInputSchema},
  output: {schema: CivilLawSuggestionsOutputSchema},
  prompt: `You are an expert AI legal assistant specializing in Civil Law. Based on the case details provided, suggest relevant state and federal case laws.
Focus on areas such as:
- Contract law (breach, interpretation, formation)
- Tort law (negligence, intentional torts, product liability)
- Family law (divorce, custody, support - if applicable from details)
- Employment law (discrimination, wrongful termination, wage disputes)
- Civil rights claims (e.g., Section 1983)
- Administrative law (challenges to agency decisions)
Consider different burden of proof standards applicable in civil litigation (e.g., preponderance of the evidence).

Also, suggest types of legal documents (from the allowed list: 'motion', 'affidavit', 'complaint') that might be appropriate to generate for this case.
Provide a confidence score (a number between 0 and 1, where 1 is highest confidence) for your legal suggestions.

Case Details:
{{{caseDetails}}}

Ensure your output strictly adheres to the defined schema, including specific document types and a numeric confidence score.
If no specific documents seem immediately relevant from the allowed list, return an empty list for suggestedDocumentTypes.
`,
});

const civilLawSuggestionsFlow = ai.defineFlow(
  {
    name: 'civilLawSuggestionsFlow',
    inputSchema: CivilLawSuggestionsInputSchema,
    outputSchema: CivilLawSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output! as CivilLawSuggestionsOutput; // Ensure correct typing
  }
);
