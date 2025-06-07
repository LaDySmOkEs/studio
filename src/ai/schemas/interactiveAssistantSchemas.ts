
import { z } from 'zod';

export const InteractiveAssistantInputSchema = z.object({
  userQuery: z.string().describe('The user_s question or statement to the legal assistant.'),
  caseContext: z.string().optional().describe('Optional background context about the user_s case, taken from their case summary.'),
});
export type InteractiveAssistantInput = z.infer<typeof InteractiveAssistantInputSchema>;

export const InteractiveAssistantOutputSchema = z.object({
  responseText: z.string().describe('The AI_s helpful and informative response to the user_s query.'),
});
export type InteractiveAssistantOutput = z.infer<typeof InteractiveAssistantOutputSchema>;
