// src/app/timeline-event-log/actions.ts
'use server';

import { analyzeTimelineEvents, type TimelineEventsInput, type TimelineAnalysisOutput } from "@/ai/flows/analyzeTimelineEvents";
import { z } from "zod";

export async function handleAnalyzeTimelineAction(input: TimelineEventsInput): Promise<TimelineAnalysisOutput | { error: string }> {
  try {
    // No Zod validation here as input comes directly from client state which should match TimelineEventsInput
    const result = await analyzeTimelineEvents(input);
    return result;
  } catch (error) {
    console.error("Error in AI timeline analysis:", error);
    // ZodError check might not be necessary if we trust client-side construction of TimelineEventsInput
    // or if analyzeTimelineEvents flow input schema handles it.
    if (error instanceof z.ZodError) {
      return { error: "Invalid input for timeline analysis: " + error.errors.map(e => e.message).join(", ") };
    }
    return { error: error instanceof Error ? error.message : "An unknown error occurred while analyzing the timeline." };
  }
}
