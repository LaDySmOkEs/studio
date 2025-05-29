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

const CriminalLawSuggestionsInputSchema = z.object({
  caseDetails: z
    .string()
    .describe('Detailed information about the criminal case for which relevant laws are to be suggested.'),
});
export type CriminalLawSuggestionsInput = z.infer<typeof CriminalLawSuggestionsInputSchema>;

const DocumentTypeEnum = z.enum([
  "motion", "affidavit", "complaint", 
  "motionForBailReduction", "discoveryRequest", "petitionForExpungement",
  "foiaRequest",
  "civilCoverSheet", "summons", "motionToQuash", "motionToDismiss",
  "inFormaPauperisApplication", "declarationOfNextFriend"
]);

// Output schema is the same as SuggestRelevantLawsOutput for consistency
const CriminalLawSuggestionsOutputSchema = z.object({
  relevantLaws: z
    .string()
    .describe('A list of relevant criminal case laws and precedents suggested by the AI.'),
  confidenceScore: z.number().describe('The confidence score of the suggestion for criminal laws (0-1).'),
  suggestedDocumentTypes: z
    .array(DocumentTypeEnum)
    .describe('A list of document types relevant to this criminal case.'),
  dueProcessViolationScore: z
    .string()
    .describe('A qualitative assessment of potential due process violation risks specific to criminal law, considering severity and volume of issues like lack of counsel, improper search, coerced statements, Miranda rights, speedy trial issues, etc. e.g., "High Risk: Indication of Miranda violation and lack of timely arraignment.", "Moderate Risk: Concern about effectiveness of counsel mentioned.", "Low Risk: Standard procedures appear followed based on input." If details are sparse, indicate that a more thorough review is needed.'),
});
export type CriminalLawSuggestionsOutput = z.infer<typeof CriminalLawSuggestionsOutputSchema>;


export async function criminalLawSuggestions(input: CriminalLawSuggestionsInput): Promise<CriminalLawSuggestionsOutput> {
  return criminalLawSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'criminalLawSuggestionsPrompt',
  input: {schema: CriminalLawSuggestionsInputSchema},
  output: {schema: CriminalLawSuggestionsOutputSchema},
  prompt: `You are an expert AI legal assistant specializing in Criminal Law. Based on the case details provided:
1. Suggest relevant state and federal case laws. Focus on constitutional precedents (e.g., Fourth, Fifth, Sixth Amendments), Supreme Court criminal procedure rules, state criminal code interpretations, sentencing guidelines, landmark cases (Miranda, search/seizure, right to counsel), and issues related to bail, discovery (Brady, witness lists), and post-conviction relief (expungement).
2. Suggest types of legal documents from the following list: 'motion', 'affidavit', 'complaint', 'motionForBailReduction', 'discoveryRequest', 'petitionForExpungement', 'inFormaPauperisApplication', 'foiaRequest'. Ensure suggestions are relevant to criminal proceedings.
3. Provide a confidence score (0-1) for your legal suggestions.
4. Provide a 'Due Process Violation Score'. This should be a qualitative assessment of potential due process violation risks specific to criminal law (e.g., "Low Risk", "Moderate Risk: Potential speedy trial issue based on timeline", "High Risk: Multiple constitutional violations indicated e.g. lack of counsel and coerced confession."). Analyze the severity and volume of potential violations hinted at in the case details. Consider issues like Miranda rights, right to counsel, illegal search/seizure, coerced statements, speedy trial, prosecutorial misconduct. If details are too sparse to make a determination, state that explicitly in the score (e.g., "Indeterminate: Insufficient details to assess specific due process risks.").

Case Details:
{{{caseDetails}}}

Ensure your output strictly adheres to the defined schema.
If no specific documents seem immediately relevant, return an empty list for suggestedDocumentTypes.
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
