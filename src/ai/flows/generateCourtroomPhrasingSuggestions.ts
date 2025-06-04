
// src/ai/flows/generateCourtroomPhrasingSuggestions.ts
'use server';

/**
 * @fileOverview This flow generates suggestions for courtroom phrasing based on user input and context.
 *
 * - generateCourtroomPhrasingSuggestions - A function that takes a user's statement, context, and case summary, and returns phrasing advice.
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

export const GenerateCourtroomPhrasingInputSchema = z.object({
  userStatement: z.string().min(10, { message: "Please provide the statement you intend to make (at least 10 characters)." }).describe("The statement or question the user intends to say in court."),
  statementContext: StatementContextEnum.describe("The context in which the user will make this statement."),
  caseSummary: z.string().optional().describe("Optional summary of the user's case for better contextual suggestions."),
});
export type GenerateCourtroomPhrasingInput = z.infer<typeof GenerateCourtroomPhrasingInputSchema>;

const SuggestedPhrasingSchema = z.object({
  phrasing: z.string().describe("A suggested alternative phrasing."),
  rationale: z.string().optional().describe("A brief explanation for why this phrasing might be more effective or appropriate."),
});

export const GenerateCourtroomPhrasingOutputSchema = z.object({
  originalStatementCritique: z.string().describe("Brief feedback on the user's original statement (e.g., clarity, formality, potential misunderstandings)."),
  suggestedPhrasings: z.array(SuggestedPhrasingSchema).min(1).max(3).describe("1 to 3 alternative ways to phrase the statement, with optional rationale."),
  generalTips: z.array(z.string()).max(3).describe("Up to 3 general communication tips relevant to the chosen context (e.g., 'When addressing the judge, always say Your Honor')."),
});
export type GenerateCourtroomPhrasingOutput = z.infer<typeof GenerateCourtroomPhrasingOutputSchema>;

export async function generateCourtroomPhrasingSuggestions(input: GenerateCourtroomPhrasingInput): Promise<GenerateCourtroomPhrasingOutput> {
  return generateCourtroomPhrasingSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCourtroomPhrasingSuggestionsPrompt',
  input: {schema: GenerateCourtroomPhrasingInputSchema},
  output: {schema: GenerateCourtroomPhrasingOutputSchema},
  prompt: `You are an expert courtroom communication coach AI. Your role is to help users refine how they express themselves in legal settings.
The user wants to make the following statement/ask the following question:
"{{{userStatement}}}"

This statement will be made in the following context: {{{statementContext}}}

{{#if caseSummary}}
For additional context, here is a summary of the user's case:
"{{{caseSummary}}}"
{{/if}}

Based on this, please provide:
1.  'originalStatementCritique': A brief, constructive critique of the user's original statement. Focus on clarity, formality, potential for being misunderstood, or impact. Be polite and helpful.
2.  'suggestedPhrasings': An array of 1 to 3 alternative phrasings. For each, provide the 'phrasing' and an optional 'rationale' explaining why it might be more effective or appropriate in a courtroom.
3.  'generalTips': An array of up to 3 general communication tips specifically relevant to the provided 'statementContext'. For example, if addressing a judge, a tip might be "Always address the judge as 'Your Honor'." If cross-examining, a tip might be "Ask leading questions."

Focus on practical, actionable advice. Avoid legal advice on the merits of the case; concentrate solely on the communication aspect.
Ensure your output strictly adheres to the defined schema.
For contexts like OPENING_STATEMENT or CLOSING_ARGUMENT, the critique and suggestions should focus on a segment or key point from the user's statement if it's long, rather than trying to rewrite the whole thing.
If the user statement is very short or unclear, the critique should reflect that, and suggestions might be more general.
`,
});

const generateCourtroomPhrasingSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateCourtroomPhrasingSuggestionsFlow',
    inputSchema: GenerateCourtroomPhrasingInputSchema,
    outputSchema: GenerateCourtroomPhrasingOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate phrasing suggestions.");
    }
    return output;
  }
);
