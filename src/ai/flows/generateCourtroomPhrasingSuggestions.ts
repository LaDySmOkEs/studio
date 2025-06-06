
// src/ai/flows/generateCourtroomPhrasingSuggestions.ts
'use server';

/**
 * @fileOverview This flow generates courtroom statements based on user-provided key points, context, and case summary.
 *
 * - generateCourtroomPhrasingSuggestions - A function that takes key points, context, and case summary, and returns AI-generated statements and advice.
 * - GenerateCourtroomPhrasingInput - The input type for the function.
 * - GenerateCourtroomPhrasingOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StatementContextEnum = z.enum([
  "ADDRESSING_JUDGE",
  "OPENING_STATEMENT",
  "DIRECT_EXAMINATION", // Questioning my witness
  "CROSS_EXAMINATION",  // Questioning opponent's witness
  "MAKING_OBJECTION",
  "PRESENTING_EVIDENCE",
  "CLOSING_ARGUMENT",
  "RESPONDING_TO_QUESTION_FROM_JUDGE",
  "NEGOTIATION_WITH_OPPOSING_COUNSEL",
  "OTHER_COURTROOM_STATEMENT"
]);

// Input schema updated: userStatement changed to keyPointsOrTopic
const GenerateCourtroomPhrasingInputSchema = z.object({
  keyPointsOrTopic: z.string().min(10, { message: "Please describe the key points you want to make or the topic of your statement (at least 10 characters)." }).describe("The key points the user wants to convey or the general topic of the statement to be made in court."),
  statementContext: StatementContextEnum.describe("The context in which the user will make this statement."),
  caseSummary: z.string().optional().describe("Optional summary of the user's case for better contextual suggestions."),
});
export type GenerateCourtroomPhrasingInput = z.infer<typeof GenerateCourtroomPhrasingInputSchema>;

const SuggestedPhrasingSchema = z.object({
  phrasing: z.string().describe("An AI-generated statement suitable for the context."),
  rationale: z.string().optional().describe("A brief explanation for why this statement is effective or appropriate."),
});

// Output schema updated: originalStatementCritique removed
const GenerateCourtroomPhrasingOutputSchema = z.object({
  suggestedPhrasings: z.array(SuggestedPhrasingSchema).min(1).max(3).describe("1 to 3 AI-generated statements suitable for the context, with optional rationale."),
  generalTips: z.array(z.string()).max(3).describe("Up to 3 general communication tips relevant to the chosen context (e.g., 'When addressing the judge, always say Your Honor')."),
});
export type GenerateCourtroomPhrasingOutput = z.infer<typeof GenerateCourtroomPhrasingOutputSchema>;

export async function generateCourtroomPhrasingSuggestions(input: GenerateCourtroomPhrasingInput): Promise<GenerateCourtroomPhrasingOutput> {
  return generateCourtroomPhrasingSuggestionsFlow(input);
}

// Prompt updated to generate statements, not critique
const prompt = ai.definePrompt({
  name: 'generateCourtroomPhrasingSuggestionsPrompt',
  input: {schema: GenerateCourtroomPhrasingInputSchema},
  output: {schema: GenerateCourtroomPhrasingOutputSchema},
  prompt: `You are an expert courtroom communication coach and legal drafter AI. Your role is to help users by generating effective statements for them to use in legal settings.

The user wants to make a statement covering the following key points or topic:
"{{{keyPointsOrTopic}}}"

This statement will be made in the following context: {{{statementContext}}}

{{#if caseSummary}}
For additional context, here is a summary of the user's case:
"{{{caseSummary}}}"
{{/if}}

Based on this, please provide:
1.  'suggestedPhrasings': An array of 1 to 3 distinct, well-phrased statements that effectively convey the user's key points or address the topic within the given context. For each, provide the 'phrasing' (the full statement) and a 'rationale' explaining why this phrasing is effective, appropriate, or strategically sound for the courtroom.
2.  'generalTips': An array of up to 3 general communication tips specifically relevant to the provided 'statementContext'.

Focus on creating practical, actionable statements and advice. Avoid legal advice on the merits of the case; concentrate solely on crafting clear and impactful communication.
Ensure your output strictly adheres to the defined schema.
If the key points/topic are very vague, try to generate helpful general statements for the context, or note that more specificity would yield better results in the rationale.
For contexts like OPENING_STATEMENT or CLOSING_ARGUMENT, if the topic is broad, generate a concise key segment or introductory/concluding phrases.
`,
});

const generateCourtroomPhrasingSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateCourtroomPhrasingSuggestionsFlow',
    inputSchema: GenerateCourtroomPhrasingInputSchema, // Using updated schema
    outputSchema: GenerateCourtroomPhrasingOutputSchema, // Using updated schema
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate phrasing suggestions.");
    }
    return output;
  }
);

