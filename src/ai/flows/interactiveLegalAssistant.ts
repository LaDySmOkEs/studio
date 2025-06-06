
'use server';
/**
 * @fileOverview A Genkit flow for the interactive legal assistant.
 *
 * - generalLegalQuery - A function that provides general legal information based on user input and optional case context.
 * - InteractiveAssistantInput - The input type for the function.
 * - InteractiveAssistantOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const InteractiveAssistantInputSchema = z.object({
  userQuery: z.string().describe('The user_s question or statement to the legal assistant.'),
  caseContext: z.string().optional().describe('Optional background context about the user_s case, taken from their case summary.'),
});
export type InteractiveAssistantInput = z.infer<typeof InteractiveAssistantInputSchema>;

export const InteractiveAssistantOutputSchema = z.object({
  responseText: z.string().describe('The AI_s helpful and informative response to the user_s query.'),
});
export type InteractiveAssistantOutput = z.infer<typeof InteractiveAssistantOutputSchema>;

export async function generalLegalQuery(input: InteractiveAssistantInput): Promise<InteractiveAssistantOutput> {
  return interactiveAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interactiveAssistantPrompt',
  input: {schema: InteractiveAssistantInputSchema},
  output: {schema: InteractiveAssistantOutputSchema},
  prompt: `You are an AI Legal Assistant designed to provide helpful, general information about legal concepts, processes, and terminology.
You are NOT a lawyer and CANNOT give legal advice. Your primary function is to explain legal concepts in an accessible way and discuss general procedures.

User's query: "{{userQuery}}"

{{#if caseContext}}
The user has provided the following general context about their case. You can use this for background understanding to make your general explanations more relevant if applicable, but do NOT refer to it as "your case" specifically or give any advice on it. Focus on explaining the legal concepts related to the query in general terms.
Case Context:
"{{caseContext}}"
{{/if}}

Your task is to:
1. Understand the user's query.
2. If the query is about a general legal concept, process, or term (e.g., "What is discovery?", "Explain due process", "What happens at an arraignment?", "Tell me about motions to dismiss"), provide a clear, concise, and easy-to-understand explanation.
3. If the user seems to be asking for advice on their specific situation, or asking "what should I do?", or asking for an opinion on their case, you MUST explicitly state that you cannot provide legal advice for their specific situation and that they should consult a qualified attorney. You can still explain the general legal principles involved in their query if appropriate.
4. Maintain a helpful, empathetic, and professional tone.
5. Ensure your response is purely informational and educational. Do not make predictions, offer opinions on specific legal strategies, or interpret specific documents unless the user provides the text and asks for a general summary of its content (not its legal implications for them).
6. You MUST conclude EVERY response with the following exact sentence: "Please remember, I am an AI assistant and cannot provide legal advice. This information is for educational purposes, and you should consult with a qualified attorney for advice specific to your situation."

Generate the 'responseText'.`,
});

const interactiveAssistantFlow = ai.defineFlow(
  {
    name: 'interactiveAssistantFlow',
    inputSchema: InteractiveAssistantInputSchema,
    outputSchema: InteractiveAssistantOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      return { 
        responseText: "I apologize, but I encountered an issue trying to generate a response. Please try rephrasing your question or ask about a general legal topic. Please remember, I am an AI assistant and cannot provide legal advice. This information is for educational purposes, and you should consult with a qualified attorney for advice specific to your situation."
      };
    }
    // Ensure the mandatory disclaimer is present, even if the model forgets.
    const mandatoryDisclaimer = "Please remember, I am an AI assistant and cannot provide legal advice. This information is for educational purposes, and you should consult with a qualified attorney for advice specific to your situation.";
    if (!output.responseText.includes(mandatoryDisclaimer)) {
        return { responseText: output.responseText + "\n\n" + mandatoryDisclaimer };
    }
    return output;
  }
);
