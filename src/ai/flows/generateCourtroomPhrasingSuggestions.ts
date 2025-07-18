
// src/ai/flows/generateCourtroomPhrasingSuggestions.ts
'use server';

/**
 * @fileOverview This flow generates courtroom statements based on user-provided key points, context, and case summary.
 * Users can optionally provide their own draft statement for critique and improvement.
 *
 * - generateCourtroomPhrasingSuggestions - A function that takes input and returns AI-generated statements, critique (if draft provided), and advice.
 * - GenerateCourtroomPhrasingInput - The input type for the function.
 * - GenerateCourtroomPhrasingOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StatementContextEnum = z.enum([
  "ADDRESSING_JUDGE",
  "OPENING_STATEMENT",
  "CLOSING_ARGUMENT",
  "DIRECT_EXAMINATION", // Questioning my witness
  "CROSS_EXAMINATION",  // Questioning opponent's witness
  "MAKING_OBJECTION",
  "RESPONDING_TO_OBJECTION",
  "ARGUING_MOTION",
  "PRESENTING_EVIDENCE",
  "RESPONDING_TO_QUESTION_FROM_JUDGE",
  "PLEA_OR_SENTENCING_STATEMENT",
  "NEGOTIATION_WITH_OPPOSING_COUNSEL",
  "MEDIATION_OPENING_STATEMENT",
  "OTHER_COURTROOM_STATEMENT"
]);

// Input schema: keyPointsOrTopic is required, userDraftStatement is optional.
const GenerateCourtroomPhrasingInputSchema = z.object({
  keyPointsOrTopic: z.string().min(10, { message: "Please describe the key points you want to make or the topic of your statement (at least 10 characters)." }).describe("The key points the user wants to convey or the general topic of the statement to be made in court."),
  userDraftStatement: z.string().optional().describe("The user's own draft of the statement, if they want the AI to critique and improve it based on the keyPointsOrTopic."),
  statementContext: StatementContextEnum.describe("The context in which the user will make this statement."),
  caseSummary: z.string().optional().describe("Optional summary of the user's case for better contextual suggestions."),
  caseCategory: z.enum(["general", "criminal", "civil"]).optional().describe("Optional category of the case (general, criminal, civil) for better contextual suggestions."),
});
export type GenerateCourtroomPhrasingInput = z.infer<typeof GenerateCourtroomPhrasingInputSchema>;

const SuggestedPhrasingSchema = z.object({
  phrasing: z.string().describe("An AI-generated statement suitable for the context."),
  rationale: z.string().optional().describe("A brief explanation for why this statement is effective or appropriate."),
});

// Output schema: originalStatementCritique is now optional.
const GenerateCourtroomPhrasingOutputSchema = z.object({
  originalStatementCritique: z.string().optional().describe("If the user provided a 'userDraftStatement', this field contains the AI's critique of that draft in relation to the 'keyPointsOrTopic' and 'statementContext'."),
  suggestedPhrasings: z.array(SuggestedPhrasingSchema).min(1).max(3).describe("1 to 3 AI-generated statements. If a 'userDraftStatement' was provided, these are improved versions. Otherwise, they are generated from scratch based on 'keyPointsOrTopic'."),
  generalTips: z.array(z.string()).max(3).describe("Up to 3 general communication tips relevant to the chosen context (e.g., 'When addressing the judge, always say Your Honor')."),
});
export type GenerateCourtroomPhrasingOutput = z.infer<typeof GenerateCourtroomPhrasingOutputSchema>;

export async function generateCourtroomPhrasingSuggestions(input: GenerateCourtroomPhrasingInput): Promise<GenerateCourtroomPhrasingOutput> {
  return generateCourtroomPhrasingSuggestionsFlow(input);
}

// Prompt updated to handle optional userDraftStatement.
const prompt = ai.definePrompt({
  name: 'generateCourtroomPhrasingSuggestionsPrompt',
  input: {schema: GenerateCourtroomPhrasingInputSchema},
  output: {schema: GenerateCourtroomPhrasingOutputSchema},
  prompt: `You are an expert courtroom communication coach and legal drafter AI.

The user wants to make a statement covering the following key points or topic:
"{{{keyPointsOrTopic}}}"

This statement will be made in the following context: {{{statementContext}}}

{{#if caseSummary}}
For additional context, here is a summary of the user's case:
"{{{caseSummary}}}"
{{#if caseCategory}}
The case category is: {{{caseCategory}}}. Please consider this category when formulating suggestions. For example, statements in a criminal defense context might differ in tone or focus from a civil plaintiff context.
{{/if}}
{{/if}}

{{#if userDraftStatement}}
The user has provided the following draft attempt:
"{{{userDraftStatement}}}"

Based on this, please provide:
1.  'originalStatementCritique': A constructive critique of the user's 'userDraftStatement'. Analyze its effectiveness in conveying the 'keyPointsOrTopic' within the given 'statementContext'. Point out strengths and areas for improvement.
2.  'suggestedPhrasings': An array of 1 to 2 distinct, well-phrased statements that are improved versions of the 'userDraftStatement', ensuring they effectively convey the 'keyPointsOrTopic' and are suitable for the 'statementContext'. For each, provide the 'phrasing' and a 'rationale'.
3.  'generalTips': An array of up to 3 general communication tips specifically relevant to the 'statementContext'.
{{else}}
The user has not provided a draft. Based on the 'keyPointsOrTopic' and context, please provide:
1.  'suggestedPhrasings': An array of 1 to 3 distinct, well-phrased statements that effectively convey the user's 'keyPointsOrTopic' within the given 'statementContext'. For each, provide the 'phrasing' and a 'rationale'.
2.  'generalTips': An array of up to 3 general communication tips specifically relevant to the 'statementContext'.
(Ensure the 'originalStatementCritique' field is NOT included in the output if no draft was provided.)
{{/if}}

Focus on creating practical, actionable statements and advice. Avoid legal advice on the merits of the case; concentrate solely on crafting clear and impactful communication.
Ensure your output strictly adheres to the defined schema.
If the key points/topic are very vague (and no draft is provided), try to generate helpful general statements for the context, or note that more specificity would yield better results in the rationale.
For contexts like OPENING_STATEMENT or CLOSING_ARGUMENT, if the topic is broad, generate a concise key segment or introductory/concluding phrases.
If the context is 'PLEA_OR_SENTENCING_STATEMENT', assume the user is the defendant and tailor suggestions accordingly (e.g., expressing remorse if appropriate for the key points, highlighting mitigating factors).
If the context is 'ARGUING_MOTION', suggestions should be persuasive and focused on legal standards and facts supporting/opposing the motion as per the key points.
If the context is 'RESPONDING_TO_OBJECTION', suggestions should be concise and address the legal basis of the objection (e.g., relevance, hearsay).
`,
});

const generateCourtroomPhrasingSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateCourtroomPhrasingSuggestionsFlow',
    inputSchema: GenerateCourtroomPhrasingInputSchema, 
    outputSchema: GenerateCourtroomPhrasingOutputSchema,
  },
  async (input) => {
    const {output: rawOutput} = await prompt(input);
    if (!rawOutput) {
      throw new Error("AI failed to generate phrasing suggestions.");
    }
    
    // If userDraftStatement was not provided, rawOutput.originalStatementCritique should be undefined 
    // based on the updated prompt. This is compliant with z.string().optional().

    const result: GenerateCourtroomPhrasingOutput = {
      originalStatementCritique: rawOutput.originalStatementCritique, 
      suggestedPhrasings: (rawOutput.suggestedPhrasings || []).map(p => ({
        phrasing: p.phrasing || "", // Ensure phrasing is a string
        rationale: p.rationale,     // Rationale is optional in schema, pass it through
      })),
      generalTips: rawOutput.generalTips || [], // Ensure generalTips is an array
    };
    
    return result;
  }
);

