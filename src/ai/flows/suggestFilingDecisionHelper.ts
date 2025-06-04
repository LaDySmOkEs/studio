
// src/ai/flows/suggestFilingDecisionHelper.ts
'use server';

/**
 * @fileOverview This flow helps users decide which legal document to consider filing next.
 *
 * - suggestFilingDecisionHelper - A function that takes case context and returns filing advice.
 * - SuggestFilingDecisionHelperInput - The input type for the function.
 * - SuggestFilingDecisionHelperOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Enum from suggest-relevant-laws.ts, ensure it's consistent
const DocumentTypeEnum = z.enum([
  "motion", "affidavit", "complaint",
  "motionForBailReduction", "discoveryRequest", "petitionForExpungement",
  "foiaRequest",
  "civilCoverSheet", "summons", "motionToQuash", "motionToDismiss",
  "inFormaPauperisApplication", "declarationOfNextFriend", "tpoChallengeResponse"
]);

const SuggestFilingDecisionHelperInputSchema = z.object({
  caseDetails: z.string().describe('Detailed information about the case.'),
  caseCategory: z.enum(["general", "criminal", "civil"]).describe('The category of the case.'),
  relevantLaws: z.string().describe('AI-suggested relevant laws for the case.'),
  dueProcessViolationScore: z.string().describe('AI-generated assessment of potential due process violations.'),
  suggestedDocumentTypes: z.array(DocumentTypeEnum).describe('A list of document types initially suggested as relevant to the case.'),
});
export type SuggestFilingDecisionHelperInput = z.infer<typeof SuggestFilingDecisionHelperInputSchema>;

const SuggestFilingDecisionHelperOutputSchema = z.object({
  filingAdvice: z.string().describe('AI-generated advice on which document(s) to prioritize filing and why.'),
  topSuggestions: z.array(DocumentTypeEnum).describe('A list of 1-2 top suggested document types to consider filing next from the initial list.'),
});
export type SuggestFilingDecisionHelperOutput = z.infer<typeof SuggestFilingDecisionHelperOutputSchema>;

// This is the main exported function that will be called by the server action
export async function suggestFilingDecisionHelper(input: SuggestFilingDecisionHelperInput): Promise<SuggestFilingDecisionHelperOutput> {
  return suggestFilingDecisionHelperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFilingDecisionHelperPrompt',
  input: {schema: SuggestFilingDecisionHelperInputSchema},
  output: {schema: SuggestFilingDecisionHelperOutputSchema},
  prompt: `You are an AI Legal Filing Assistant.
Based on the provided case details, category, relevant laws, due process assessment, and a list of initially suggested document types:
1. Analyze the input.
2. From the 'suggestedDocumentTypes' list, identify the 1 or 2 most critical or impactful documents the user should consider preparing or filing next.
3. Provide clear, concise 'filingAdvice' explaining your reasoning for these top suggestions. Consider the case category and due process score in your reasoning. For example, if due process risk is high, prioritize documents that address that.
4. Populate 'topSuggestions' with the chosen 1-2 document types.

Case Details: {{{caseDetails}}}
Case Category: {{{caseCategory}}}
Relevant Laws: {{{relevantLaws}}}
Due Process Violation Score: {{{dueProcessViolationScore}}}
Initially Suggested Document Types: {{#each suggestedDocumentTypes}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Ensure your output strictly adheres to the defined schema. If the list of suggestedDocumentTypes is empty or no specific documents stand out as immediately critical from the list, state that in the filingAdvice and return an empty array for topSuggestions.
`,
});

const suggestFilingDecisionHelperFlow = ai.defineFlow(
  {
    name: 'suggestFilingDecisionHelperFlow',
    inputSchema: SuggestFilingDecisionHelperInputSchema,
    outputSchema: SuggestFilingDecisionHelperOutputSchema,
  },
  async (input) => {
    if (!input.suggestedDocumentTypes || input.suggestedDocumentTypes.length === 0) {
      return {
        filingAdvice: "No initial document types were suggested, or the list was empty. Therefore, no specific filing recommendations can be prioritized. Consider re-analyzing the case with more details or broadening the scope of document types if appropriate.",
        topSuggestions: [],
      };
    }
    const {output} = await prompt(input);
    if (!output) {
        // Handle cases where the prompt might not return an output as expected
        // This might happen due to content filtering or other model issues
        return {
            filingAdvice: "The AI was unable to determine top suggestions based on the input. Please ensure all details are clear or try rephrasing.",
            topSuggestions: [],
        };
    }
    return output;
  }
);
