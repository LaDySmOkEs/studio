
// src/ai/flows/refineCaseAnalysisWithClarification.ts
'use server';

/**
 * @fileOverview This flow refines the case analysis based on original details and new user clarifications.
 *
 * - refineCaseAnalysisWithClarification - A function that takes original case details, clarifications, and category, then returns a refined analysis.
 * - RefineCaseAnalysisInput - The input type for the function.
 * - RefineCaseAnalysisOutput - The return type for the function (structurally same as SuggestRelevantLawsOutput).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineCaseAnalysisInputSchema = z.object({
  originalCaseDetails: z
    .string()
    .describe('The initial detailed information about the case.'),
  clarifications: z
    .string()
    .describe('Additional information or clarifications provided by the user to refine the analysis.'),
  caseCategory: z.enum(["general", "criminal", "civil"]).describe('The category of the case.'),
});
export type RefineCaseAnalysisInput = z.infer<typeof RefineCaseAnalysisInputSchema>;

// DocumentTypeEnum should be consistent with other flows
const DocumentTypeEnum = z.enum([
  "motion", "affidavit", "complaint", 
  "motionForBailReduction", "discoveryRequest", "petitionForExpungement",
  "foiaRequest",
  "civilCoverSheet", "summons", "motionToQuash", "motionToDismiss",
  "inFormaPauperisApplication", "declarationOfNextFriend", "tpoChallengeResponse"
]);

// Output schema is the same as SuggestRelevantLawsOutput for consistency
const RefineCaseAnalysisOutputSchema = z.object({
  relevantLaws: z
    .string()
    .describe('A list of relevant case laws suggested by the AI, refined based on original details and new clarifications.'),
  confidenceScore: z.number().describe('The confidence score of the refined suggestion for laws (0-1).'),
  suggestedDocumentTypes: z
    .array(DocumentTypeEnum)
    .describe('A list of document types that might be relevant to generate for this case, based on the refined analysis. If no specific documents seem immediately relevant, return an empty list.'),
  dueProcessViolationScore: z
    .string()
    .describe('A qualitative assessment of potential due process violation risks based on the refined input. Consider common due process elements like notice, opportunity to be heard, right to counsel (if criminal), impartial decision-maker etc. If details are sparse, indicate that a more thorough review is needed.'),
});
export type RefineCaseAnalysisOutput = z.infer<typeof RefineCaseAnalysisOutputSchema>;

export async function refineCaseAnalysisWithClarification(input: RefineCaseAnalysisInput): Promise<RefineCaseAnalysisOutput> {
  return refineCaseAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineCaseAnalysisPrompt',
  input: {schema: RefineCaseAnalysisInputSchema},
  output: {schema: RefineCaseAnalysisOutputSchema},
  prompt: `You are an expert legal assistant. You previously analyzed case details. The user has now provided clarifications.
Review the original case details, the user's new clarifications, and the case category.
Then, provide a *refined* analysis:
1. Suggest relevant case laws.
2. Suggest types of legal documents that might be appropriate from the allowed list: 'motion', 'affidavit', 'complaint', 'motionForBailReduction', 'discoveryRequest', 'petitionForExpungement', 'foiaRequest', 'civilCoverSheet', 'summons', 'motionToQuash', 'motionToDismiss', 'inFormaPauperisApplication', 'declarationOfNextFriend', 'tpoChallengeResponse'.
3. Provide a new confidence score (0-1) for your *refined* legal suggestions.
4. Provide a *refined* 'Due Process Violation Score' (e.g., "Low Risk", "Moderate Risk", "High Risk", "Indeterminate").

Original Case Details:
{{{originalCaseDetails}}}

User's Clarifications:
{{{clarifications}}}

Case Category: {{{caseCategory}}}

Ensure your output strictly adheres to the defined schema. If no specific documents seem immediately relevant, return an empty list for suggestedDocumentTypes.
Focus on incorporating the clarifications to improve the accuracy and specificity of your suggestions.
`,
});

const refineCaseAnalysisFlow = ai.defineFlow(
  {
    name: 'refineCaseAnalysisFlow',
    inputSchema: RefineCaseAnalysisInputSchema,
    outputSchema: RefineCaseAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to provide a refined analysis.");
    }
    return output;
  }
);
