// src/ai/flows/analyzeTimelineEvents.ts
'use server';

/**
 * @fileOverview This flow analyzes a list of timeline events and provides a summary and potential focus areas.
 *
 * - analyzeTimelineEvents - A function that takes a list of events and returns an analysis.
 * - TimelineEventsInput - The input type for the analyzeTimelineEvents function.
 * - TimelineAnalysisOutput - The return type for the analyzeTimelineEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TimelineEventSchema = z.object({
  date: z.string().describe('The date of the event.'),
  type: z.string().describe('The type or category of the event.'),
  description: z.string().describe('A description of the event.'),
});

const TimelineEventsInputSchema = z.object({
  events: z.array(TimelineEventSchema).describe('A list of timeline events to be analyzed.'),
});
export type TimelineEventsInput = z.infer<typeof TimelineEventsInputSchema>;

const TimelineAnalysisOutputSchema = z.object({
  analysisSummary: z.string().describe('A brief textual summary of the timeline, noting any patterns or clusters of events.'),
  potentialFocusAreas: z.array(z.string()).describe('A list of 2-4 event types or sequences from the timeline that might warrant closer review or preparation by the user. This should not be legal advice.'),
});
export type TimelineAnalysisOutput = z.infer<typeof TimelineAnalysisOutputSchema>;

export async function analyzeTimelineEvents(input: TimelineEventsInput): Promise<TimelineAnalysisOutput> {
  return analyzeTimelineEventsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTimelineEventsPrompt',
  input: {schema: TimelineEventsInputSchema},
  output: {schema: TimelineAnalysisOutputSchema},
  prompt: `You are an AI assistant helping a user review their logged case timeline.
Based on the following list of events, provide:
1.  'analysisSummary': A brief summary (2-3 sentences) of the timeline. Note any apparent clusters of activity (e.g., "multiple court-related events in May") or overall progression if discernible.
2.  'potentialFocusAreas': Identify 2-4 event types or specific events from the timeline that seem particularly important or might require the user's attention or preparation (e.g., "Upcoming court hearing for 'Motion Hearing' on [Date]", "Series of 'Interaction with Law Enforcement' entries may need detailed review", "Logged 'Deadline' for [Description] on [Date] is approaching"). Be general and factual. Do not provide legal advice or interpret the legal significance of events.

Events:
{{#each events}}
- Date: {{{date}}}, Type: {{{type}}}, Description: {{{description}}}
{{/each}}

Ensure your output strictly adheres to the defined schema.
If the event list is empty or very sparse, state that in the analysisSummary and provide an empty array for potentialFocusAreas.
`,
});

const analyzeTimelineEventsFlow = ai.defineFlow(
  {
    name: 'analyzeTimelineEventsFlow',
    inputSchema: TimelineEventsInputSchema,
    outputSchema: TimelineAnalysisOutputSchema,
  },
  async (input) => {
    if (!input.events || input.events.length === 0) {
      return {
        analysisSummary: "The timeline is currently empty. Add events to receive an AI analysis.",
        potentialFocusAreas: [],
      };
    }
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to provide a timeline analysis.");
    }
    return output;
  }
);
