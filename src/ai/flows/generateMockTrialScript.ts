
// src/ai/flows/generateMockTrialScript.ts
'use server';

/**
 * @fileOverview This flow generates a mock trial script based on a user's case narrative and selected proceeding type.
 *
 * - generateMockTrialScript - A function that takes case details and returns a structured mock trial script.
 * - GenerateMockTrialScriptInput - The input type for the function.
 * - GenerateMockTrialScriptOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProceedingTypeEnum = z.enum([
  "SMALL_CLAIMS_PLAINTIFF",
  "SMALL_CLAIMS_DEFENDANT",
  "EVICTION_HEARING_TENANT",
  "EVICTION_HEARING_LANDLORD",
  "CIVIL_MOTION_MOVANT",
  "CIVIL_MOTION_RESPONDENT",
  "TRAFFIC_TICKET_DEFENSE",
  "GENERAL_CIVIL_TRIAL_PLAINTIFF",
  "GENERAL_CIVIL_TRIAL_DEFENDANT",
]);

const GenerateMockTrialScriptInputSchema = z.object({
  caseNarrative: z.string().describe("The user's detailed case narrative or summary."),
  proceedingType: ProceedingTypeEnum.describe("The type of legal proceeding to simulate."),
  userRoleInProceeding: z.string().describe("The role the user will play in the simulation (e.g., Plaintiff, Defendant, Tenant)."),
});
export type GenerateMockTrialScriptInput = z.infer<typeof GenerateMockTrialScriptInputSchema>;

const ScriptStepSchema = z.object({
  role: z.string().describe("The 'speaker' or actor in this step (e.g., Judge, You (as Plaintiff), Opposing Counsel, Witness)."),
  lineOrPrompt: z.string().describe("The dialogue for AI roles, or a prompt for the user if isUserInput is true."),
  isUserInput: z.boolean().optional().default(false).describe("True if this step requires input from the user. If true, lineOrPrompt is a prompt for the user."),
});

const GenerateMockTrialScriptOutputSchema = z.object({
  steps: z.array(ScriptStepSchema).describe("An array of steps representing the mock trial script. Should be between 7 and 12 steps total."),
});
export type GenerateMockTrialScriptOutput = z.infer<typeof GenerateMockTrialScriptOutputSchema>;

export async function generateMockTrialScript(input: GenerateMockTrialScriptInput): Promise<GenerateMockTrialScriptOutput> {
  return generateMockTrialScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMockTrialScriptPrompt',
  input: {schema: GenerateMockTrialScriptInputSchema},
  output: {schema: GenerateMockTrialScriptOutputSchema},
  prompt: `You are a legal simulation designer and playwright. Your task is to create a concise (7-12 steps) mock trial or hearing script based on the provided case narrative and proceeding type.

Case Narrative:
{{{caseNarrative}}}

Proceeding Type: {{{proceedingType}}}
User's Role: {{{userRoleInProceeding}}}

Instructions for the script:
1.  The script should have a clear beginning (e.g., Judge opens the hearing), middle (key questions, arguments, evidence presentation points), and end (e.g., Judge concludes).
2.  Include the following roles as appropriate for the proceeding type:
    *   "Judge"
    *   "You (as {{{userRoleInProceeding}}})" - This represents the user.
    *   An opposing role (e.g., "Opposing Counsel", "Defendant", "Landlord", "Plaintiff", "Prosecutor/Officer"). Use a generic but suitable title.
    *   Optionally, a "Witness" role if central to a simple interaction.
3.  For each step, define:
    *   'role': The speaker.
    *   'lineOrPrompt': The dialogue or a question. If 'isUserInput' is true, this should be a clear prompt for what "You (as {{{userRoleInProceeding}}})" should say or respond to.
    *   'isUserInput': Set to true ONLY for steps where "You (as {{{userRoleInProceeding}}})" needs to provide a response or statement. Otherwise, it's false.
4.  Ensure there are at least 2-3 steps where 'isUserInput' is true for "You (as {{{userRoleInProceeding}}})".
5.  The dialogue should be simplified for a mock simulation, focusing on common interactions and procedural points.
6.  The total number of steps in the 'steps' array should be between 7 and 12.

Example of a step where the user provides input:
{
  "role": "You (as Plaintiff)",
  "lineOrPrompt": "Please state your name for the record and briefly explain your claim.",
  "isUserInput": true
}

Example of a step for an AI role:
{
  "role": "Judge",
  "lineOrPrompt": "Thank you. Does the defense have any questions for this witness?",
  "isUserInput": false
}

Focus on creating a logical flow that gives the user a chance to practice speaking and responding in a simulated legal context relevant to their narrative and chosen proceeding.
Ensure your output strictly adheres to the defined output schema, especially the 'steps' array structure.
`,
});

const generateMockTrialScriptFlow = ai.defineFlow(
  {
    name: 'generateMockTrialScriptFlow',
    inputSchema: GenerateMockTrialScriptInputSchema,
    outputSchema: GenerateMockTrialScriptOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a mock trial script.");
    }
    // Ensure isUserInput is explicitly false if not provided, although default(false) should handle this.
    const validatedSteps = output.steps.map(step => ({
        ...step,
        isUserInput: step.isUserInput === undefined ? false : step.isUserInput,
    }));
    return { steps: validatedSteps };
  }
);
