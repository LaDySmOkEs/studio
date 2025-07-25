
// src/ai/flows/suggest-relevant-laws.ts
'use server';

/**
 * @fileOverview This flow suggests relevant case laws and document types based on user-provided case details.
 *
 * - suggestRelevantLaws - A function that takes case details as input and returns suggested case laws, document types, and clarifying questions.
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

const DocumentTypeEnum = z.enum([
  "motion", "affidavit", "complaint",
  "motionForBailReduction", "discoveryRequest", "petitionForExpungement",
  "foiaRequest",
  "civilCoverSheet", "summons", "motionToQuash", "motionToDismiss",
  "inFormaPauperisApplication", "declarationOfNextFriend", "tpoChallengeResponse"
]);

const SuggestRelevantLawsOutputSchema = z.object({
  relevantLaws: z
    .string()
    .describe('A list of relevant case laws suggested by the AI, based on the case details.'),
  confidenceScore: z.number().describe('The confidence score of the suggestion for laws (0-1).'),
  suggestedDocumentTypes: z
    .array(DocumentTypeEnum)
    .describe('A list of document types that might be relevant to generate for this case. If no specific documents seem immediately relevant, return an empty list.'),
  dueProcessViolationScore: z
    .string()
    .describe('A qualitative assessment of potential due process violation risks based on the input, e.g., "Low Risk: No obvious violations detected from input.", "Moderate Risk: Potential issues with notice or opportunity to be heard indicated.", "High Risk: Multiple potential constitutional violations detected, such as lack of hearing and representation." Consider severity and volume of potential issues mentioned in the case details. Base this on common due process elements like notice, opportunity to be heard, right to counsel (if criminal), impartial decision-maker etc. If details are sparse, indicate that a more thorough review is needed.'),
  clarifyingQuestions: z.array(z.string()).optional().describe('A list of 2-3 specific questions the AI has for the user to help clarify ambiguous points or gather missing information crucial for a more accurate analysis. If the information is very clear and sufficient, an empty array can be returned.'),
});
export type SuggestRelevantLawsOutput = z.infer<typeof SuggestRelevantLawsOutputSchema>;

export async function suggestRelevantLaws(input: SuggestRelevantLawsInput): Promise<SuggestRelevantLawsOutput> {
  return suggestRelevantLawsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantLawsPrompt',
  input: {schema: SuggestRelevantLawsInputSchema},
  output: {schema: SuggestRelevantLawsOutputSchema},
  prompt: `You are an expert legal assistant. Based on the following case details:
1. Suggest relevant case laws.
2. Suggest types of legal documents that might be appropriate to generate for this case. You can suggest from the following list: 'motion', 'affidavit', 'complaint', 'motionForBailReduction', 'discoveryRequest', 'petitionForExpungement', 'foiaRequest', 'civilCoverSheet', 'summons', 'motionToQuash', 'motionToDismiss', 'inFormaPauperisApplication', 'declarationOfNextFriend', 'tpoChallengeResponse'. Focus on the most pertinent document types.
3. Provide a confidence score (0-1) for your legal suggestions. The confidence score must be between 0 and 1.
4. Provide a 'Due Process Violation Score'. This should be a qualitative assessment of potential due process violation risks (e.g., "Low Risk", "Moderate Risk: Potential notice issue", "High Risk: Multiple concerns like lack of hearing and representation indicated"). Analyze the severity and volume of potential violations mentioned. Consider common due process elements: timely and adequate notice, opportunity to be heard, right to counsel (especially if criminal context is implied), impartial decision-maker. If details are too sparse to make a determination, state that explicitly in the score (e.g., "Indeterminate: Insufficient details to assess due process risks.").
5. Based on the details provided, if there are ambiguities or missing pieces of information that, if clarified, would significantly improve your analysis, formulate 2-3 specific clarifying questions for the user. These questions should target information gaps that hinder a more precise legal assessment or document suggestion. If the information is very clear and sufficient, you can return an empty array for clarifyingQuestions.

Case Details: {{{caseDetails}}}

Ensure your output strictly adheres to the defined schema.
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
    

    