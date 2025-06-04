
'use server';
/**
 * @fileOverview A flow that suggests legal strategies and motions based on case details and a due process assessment.
 *
 * - suggestLegalStrategies - A function that handles the strategy suggestion process.
 * - SuggestLegalStrategiesInput - The input type for the suggestLegalStrategies function.
 * - SuggestLegalStrategiesOutput - The return type for the suggestLegalStrategies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLegalStrategiesInputSchema = z.object({
  caseDetails: z.string().describe('Detailed information about the case.'),
  caseCategory: z.enum(["general", "criminal", "civil"]).describe('The category of the case.'),
  dueProcessViolationAssessment: z.string().describe('The AI-generated assessment of potential due process violations (e.g., "Low Risk", "High Risk: Multiple concerns").'),
  relevantLaws: z.string().describe('AI-suggested relevant laws for the case.'),
});
export type SuggestLegalStrategiesInput = z.infer<typeof SuggestLegalStrategiesInputSchema>;

const SuggestLegalStrategiesOutputSchema = z.object({
  suggestedStrategies: z.array(z.string()).describe('A list of potential legal strategies.'),
  suggestedMotions: z.array(z.string()).describe('A list of potential legal motions to consider filing.'),
  reasoning: z.string().describe('The AI_s reasoning behind the suggestions.'),
  disclaimer: z.string().describe('A standard disclaimer that this is not legal advice.'),
});
export type SuggestLegalStrategiesOutput = z.infer<typeof SuggestLegalStrategiesOutputSchema>;

export async function suggestLegalStrategies(input: SuggestLegalStrategiesInput): Promise<SuggestLegalStrategiesOutput> {
  return suggestLegalStrategiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLegalStrategiesPrompt',
  input: {schema: SuggestLegalStrategiesInputSchema},
  output: {schema: SuggestLegalStrategiesOutputSchema},
  prompt: `You are an expert AI legal assistant. Based on the provided case details, case category, due process violation assessment, and relevant laws, suggest potential legal strategies and specific motions that could be considered. Provide a brief reasoning for your suggestions.

Case Details:
{{{caseDetails}}}

Case Category: {{{caseCategory}}}

AI Due Process Violation Assessment:
{{{dueProcessViolationAssessment}}}

AI Suggested Relevant Laws:
{{{relevantLaws}}}

Consider the severity of the due process assessment.
For "High Risk" assessments, suggestions should be more assertive or protective.
For "Criminal" cases, focus on constitutional rights, defenses, and procedural motions (e.g., motion to suppress, motion for discovery, speedy trial motions).
For "Civil" cases, focus on strategies related to evidence, claims, defenses, and procedural motions (e.g., motion to dismiss, motion for summary judgment, discovery motions).
For "General" cases, provide broader strategic advice.

Output Format:
- suggestedStrategies: An array of strings, each a concise strategy.
- suggestedMotions: An array of strings, each a specific motion (e.g., "Motion to Suppress Evidence due to Fourth Amendment violation").
- reasoning: Explain why these strategies/motions are suggested based on the input.
- disclaimer: Include the following exact text: "These are AI-generated suggestions for informational purposes only and do not constitute legal advice. All suggestions must be reviewed by a qualified legal professional. Legal strategy is complex and case-specific."

Provide at least 2-3 strategies and 1-2 motion suggestions if applicable. If the information is too sparse for specific suggestions, state that in the reasoning and provide general advice.
Prioritize actionable and relevant suggestions.
`,
});

const suggestLegalStrategiesFlow = ai.defineFlow(
  {
    name: 'suggestLegalStrategiesFlow',
    inputSchema: SuggestLegalStrategiesInputSchema,
    outputSchema: SuggestLegalStrategiesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
        return {
            suggestedStrategies: [],
            suggestedMotions: [],
            reasoning: "The AI was unable to generate specific strategies or motions based on the provided information. Please ensure the case details are comprehensive.",
            disclaimer: "These are AI-generated suggestions for informational purposes only and do not constitute legal advice. All suggestions must be reviewed by a qualified legal professional. Legal strategy is complex and case-specific."
        };
    }
    return {
        ...output,
        disclaimer: "These are AI-generated suggestions for informational purposes only and do not constitute legal advice. All suggestions must be reviewed by a qualified legal professional. Legal strategy is complex and case-specific."
    };
  }
);

