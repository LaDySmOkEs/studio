
// src/ai/flows/generateNegotiationAdvice.ts
'use server';

/**
 * @fileOverview This flow provides general negotiation advice based on case context and user goals.
 *
 * - generateNegotiationAdvice - A function that takes case summary, goal, and stance, and returns coaching advice.
 * - GenerateNegotiationAdviceInput - The input type for the function.
 * - GenerateNegotiationAdviceOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NegotiationStanceEnum = z.enum([
  "SEEKING_QUICK_RESOLUTION",
  "WILLING_TO_BE_FLEXIBLE",
  "HOLDING_FIRM_ON_KEY_POINTS",
  "EXPLORING_ALL_OPTIONS",
  "FOCUSED_ON_NON_MONETARY_TERMS",
  "PREPARING_FOR_LENGTHY_NEGOTIATION"
]);

export const GenerateNegotiationAdviceInputSchema = z.object({
  caseSummary: z.string().min(30, { message: "Please provide a brief summary of your case (at least 30 characters)." }).describe("A summary of the user's case or situation requiring negotiation."),
  negotiationGoal: z.string().min(10, { message: "Please state your primary goal for this negotiation (at least 10 characters)." }).describe("The user's primary objective for the negotiation."),
  userStance: NegotiationStanceEnum.describe("The user's general approach or attitude towards the negotiation."),
});
export type GenerateNegotiationAdviceInput = z.infer<typeof GenerateNegotiationAdviceInputSchema>;

export const GenerateNegotiationAdviceOutputSchema = z.object({
  generalAdvice: z.array(z.string()).describe("A list of 2-4 general negotiation tips tailored to the user's stance and goal."),
  pointsToConsider: z.array(z.string()).describe("A list of 2-3 key questions or factors the user should reflect on before or during the negotiation."),
  potentialTacticsToWatchFor: z.array(z.string()).describe("A list of 1-3 common negotiation tactics the other side might use, relevant to the user's context."),
  disclaimer: z.string().describe("Standard disclaimer that this is informational and not legal/negotiation advice."),
});
export type GenerateNegotiationAdviceOutput = z.infer<typeof GenerateNegotiationAdviceOutputSchema>;

export async function generateNegotiationAdvice(input: GenerateNegotiationAdviceInput): Promise<GenerateNegotiationAdviceOutput> {
  return generateNegotiationAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNegotiationAdvicePrompt',
  input: {schema: GenerateNegotiationAdviceInputSchema},
  output: {schema: GenerateNegotiationAdviceOutputSchema},
  prompt: `You are an AI Negotiation Coach. Based on the user's case summary, negotiation goal, and stance, provide actionable advice.

Case Summary: {{{caseSummary}}}
Negotiation Goal: {{{negotiationGoal}}}
User's Stance: {{{userStance}}}

Please generate:
1.  'generalAdvice': 2-4 general negotiation tips tailored to their stance and goal. For example, if they are "SEEKING_QUICK_RESOLUTION", advice might focus on identifying acceptable compromises early. If "HOLDING_FIRM_ON_KEY_POINTS", advice might focus on clearly articulating those points and their non-negotiable nature.
2.  'pointsToConsider': 2-3 key questions or factors the user should reflect on. For example, "What is your Best Alternative To a Negotiated Agreement (BATNA)?", "What are the other side's likely interests and priorities?", "What are the full costs (time, money, stress) of not reaching an agreement?".
3.  'potentialTacticsToWatchFor': 1-3 common negotiation tactics the other side might employ, given the context. For example, "Anchoring (making an extreme first offer)" or "Good Cop/Bad Cop routine."
4.  'disclaimer': Set this to "This information is for educational purposes only and does not constitute legal or professional negotiation advice. Always consult with a qualified professional for guidance tailored to your specific situation."

Focus on providing practical, general guidance. Do NOT suggest specific monetary amounts, settlement terms, or predict outcomes.
Ensure your output strictly adheres to the defined schema.
`,
});

const generateNegotiationAdviceFlow = ai.defineFlow(
  {
    name: 'generateNegotiationAdviceFlow',
    inputSchema: GenerateNegotiationAdviceInputSchema,
    outputSchema: GenerateNegotiationAdviceOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate negotiation advice.");
    }
    // Ensure the disclaimer is always the specific one.
    return {
      ...output,
      disclaimer: "This information is for educational purposes only and does not constitute legal or professional negotiation advice. Always consult with a qualified professional for guidance tailored to your specific situation."
    };
  }
);

    
