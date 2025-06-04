
// src/ai/flows/refineAnalysisFromSummaryFeedback.ts
'use server';

/**
 * @fileOverview This flow refines the case analysis based on user feedback to an AI-generated summary.
 *
 * - refineAnalysisFromSummaryFeedback - A function that takes original narrative, AI summary, user feedback, and category, then returns a refined analysis.
 * - RefineFromFeedbackInput - The input type for the function.
 * - Output is SuggestRelevantLawsOutput structure.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const RefineFromFeedbackInputSchema = z.object({
  fullCaseNarrative: z.string().describe('The complete narrative of the case, including original details and any previous clarifications.'),
  aiGeneratedSummary: z.string().describe("The AI's summary of its understanding of the case, which the user has reviewed."),
  userFeedbackOnSummary: z.string().describe("The user's corrections, additions, or feedback on the AI's summary."),
  caseCategory: z.enum(["general", "criminal", "civil"]).describe('The category of the case.'),
});
export type RefineFromFeedbackInput = z.infer<typeof RefineFromFeedbackInputSchema>;

// DocumentTypeEnum should be consistent with other flows
const DocumentTypeEnum = z.enum([
  "motion", "affidavit", "complaint", 
  "motionForBailReduction", "discoveryRequest", "petitionForExpungement",
  "foiaRequest",
  "civilCoverSheet", "summons", "motionToQuash", "motionToDismiss",
  "inFormaPauperisApplication", "declarationOfNextFriend", "tpoChallengeResponse"
]);

// Output schema is the same as SuggestRelevantLawsOutput for consistency
export const RefinedAnalysisOutputSchema = z.object({
  relevantLaws: z
    .string()
    .describe('A list of relevant case laws suggested by the AI, refined based on user feedback to the AI summary.'),
  confidenceScore: z.number().describe('The confidence score of the refined suggestion for laws (0-1).'),
  suggestedDocumentTypes: z
    .array(DocumentTypeEnum)
    .describe('A list of document types relevant to this case, based on the refined analysis from summary feedback. If no specific documents seem immediately relevant, return an empty list.'),
  dueProcessViolationScore: z
    .string()
    .describe('A qualitative assessment of potential due process violation risks based on the refined input after summary feedback. Consider common due process elements. If details are sparse, indicate that a more thorough review is needed.'),
});
export type RefinedAnalysisOutput = z.infer<typeof RefinedAnalysisOutputSchema>; // This is structurally SuggestRelevantLawsOutput

export async function refineAnalysisFromSummaryFeedback(input: RefineFromFeedbackInput): Promise<RefinedAnalysisOutput> {
  return refineAnalysisFromSummaryFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineAnalysisFromSummaryFeedbackPrompt',
  input: {schema: RefineFromFeedbackInputSchema},
  output: {schema: RefinedAnalysisOutputSchema},
  prompt: `You are an expert legal assistant.
You previously provided a summary of a case:
"{{{aiGeneratedSummary}}}"

The user has reviewed this summary and provided the following feedback/corrections:
"{{{userFeedbackOnSummary}}}"

Now, considering the original full case narrative provided below, your previous summary, and the user's specific feedback on that summary, provide a new, comprehensive, and *refined* case analysis.

Original Full Case Narrative:
"{{{fullCaseNarrative}}}"

Case Category: {{{caseCategory}}}

Your refined analysis should include:
1. Suggested relevant case laws.
2. Suggested types of legal documents that might be appropriate from the allowed list: 'motion', 'affidavit', 'complaint', 'motionForBailReduction', 'discoveryRequest', 'petitionForExpungement', 'foiaRequest', 'civilCoverSheet', 'summons', 'motionToQuash', 'motionToDismiss', 'inFormaPauperisApplication', 'declarationOfNextFriend', 'tpoChallengeResponse'.
3. A new confidence score (0-1) for your *refined* legal suggestions.
4. A *refined* 'Due Process Violation Score' (e.g., "Low Risk", "Moderate Risk", "High Risk", "Indeterminate").

Ensure your output strictly adheres to the defined schema. If no specific documents seem immediately relevant, return an empty list for suggestedDocumentTypes.
Focus on incorporating the user's feedback on your summary to improve the accuracy and specificity of the overall case analysis.
`,
});

const refineAnalysisFromSummaryFeedbackFlow = ai.defineFlow(
  {
    name: 'refineAnalysisFromSummaryFeedbackFlow',
    inputSchema: RefineFromFeedbackInputSchema,
    outputSchema: RefinedAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to provide a refined analysis based on summary feedback.");
    }
    return output;
  }
);
