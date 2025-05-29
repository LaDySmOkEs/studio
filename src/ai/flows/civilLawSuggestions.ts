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

const CivilLawSuggestionsInputSchema = z.object({
  caseDetails: z
    .string()
    .describe('Detailed information about the civil case for which relevant laws are to be suggested.'),
});
export type CivilLawSuggestionsInput = z.infer<typeof CivilLawSuggestionsInputSchema>;

const DocumentTypeEnum = z.enum([
  "motion", "affidavit", "complaint", 
  "motionForBailReduction", "discoveryRequest", "petitionForExpungement",
  "foiaRequest",
  "civilCoverSheet", "summons", "motionToQuash", "motionToDismiss",
  "inFormaPauperisApplication", "declarationOfNextFriend"
]);

// Output schema is the same as SuggestRelevantLawsOutput for consistency
const CivilLawSuggestionsOutputSchema = z.object({
  relevantLaws: z
    .string()
    .describe('A list of relevant civil case laws and precedents suggested by the AI.'),
  confidenceScore: z.number().describe('The confidence score of the suggestion for civil laws (0-1).'),
  suggestedDocumentTypes: z
    .array(DocumentTypeEnum)
    .describe('A list of document types relevant to this civil case.'),
  dueProcessViolationScore: z
    .string()
    .describe('A qualitative assessment of potential due process violation risks in a civil context, such as issues with service of process, opportunity to be heard, or biased adjudication. e.g., "Moderate Risk: Allegation of improper service of summons.", "Low Risk: Standard civil procedures appear followed based on input." If details are sparse, indicate that a more thorough review is needed.'),
});
export type CivilLawSuggestionsOutput = z.infer<typeof CivilLawSuggestionsOutputSchema>;

export async function civilLawSuggestions(input: CivilLawSuggestionsInput): Promise<CivilLawSuggestionsOutput> {
  return civilLawSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'civilLawSuggestionsPrompt',
  input: {schema: CivilLawSuggestionsInputSchema},
  output: {schema: CivilLawSuggestionsOutputSchema},
  prompt: `You are an expert AI legal assistant specializing in Civil Law. Based on the case details provided:
1. Suggest relevant state and federal case laws. Focus on contract law, tort law, family law, employment law, civil rights claims (e.g., Section 1983), administrative law, and different burden of proof standards.
2. Suggest types of legal documents that might be appropriate. Consider from this list: 'motion', 'affidavit', 'complaint', 'civilCoverSheet', 'summons', 'motionToQuash', 'motionToDismiss', 'inFormaPauperisApplication', 'declarationOfNextFriend'. You may also suggest 'foiaRequest' if relevant for obtaining information.
3. Provide a confidence score (0-1) for your legal suggestions.
4. Provide a 'Due Process Violation Score'. This should be a qualitative assessment of potential due process violation risks in a civil context (e.g., "Low Risk", "Moderate Risk: Potential issue with notice of hearing", "High Risk: Concerns about biased decision-maker and lack of opportunity to present evidence."). Analyze the severity and volume of potential violations suggested by the case details. Consider elements like proper service of process, adequate notice of hearings, opportunity to be heard, and impartial adjudication. If details are too sparse to make a determination, state that explicitly in the score (e.g., "Indeterminate: Insufficient details to assess specific due process risks.").

Case Details:
{{{caseDetails}}}

Ensure your output strictly adheres to the defined schema.
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
