
'use server';

import { z } from 'zod';
import { 
  generalLegalQuery, 
  type InteractiveAssistantInput, 
  type InteractiveAssistantOutput,
  InteractiveAssistantInputSchema
} from '@/ai/flows/interactiveLegalAssistant';

export async function getAIResponseAction(
  input: InteractiveAssistantInput
): Promise<InteractiveAssistantOutput | { error: string }> {
  try {
    const validatedInput = InteractiveAssistantInputSchema.parse(input);
    const result = await generalLegalQuery(validatedInput);
    return result;
  } catch (error) {
    console.error('Error in AI assistant response generation:', error);
    if (error instanceof z.ZodError) {
      return { error: 'Invalid input for AI assistant: ' + error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') };
    }
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while getting AI response.';
    return { error: errorMessage };
  }
}
