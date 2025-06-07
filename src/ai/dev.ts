
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-relevant-laws.ts';
import '@/ai/flows/criminalLawSuggestions.ts';
import '@/ai/flows/civilLawSuggestions.ts';
import '@/ai/flows/suggestLegalStrategies.ts';
import '@/ai/flows/suggestFilingDecisionHelper.ts';
import '@/ai/flows/refineCaseAnalysisWithClarification.ts';
import '@/ai/flows/summarizeCaseUnderstanding.ts';
import '@/ai/flows/refineAnalysisFromSummaryFeedback.ts';
import '@/ai/flows/analyzeTimelineEvents.ts';
import '@/ai/flows/generateMockTrialScript.ts';
import '@/ai/flows/generateProceduralRoadmap.ts';
import '@/ai/flows/generateCourtroomPhrasingSuggestions.ts';
import '@/ai/flows/generateNegotiationAdvice.ts';
import '@/ai/flows/interactiveLegalAssistant.ts';
import '@/ai/flows/analyzeDocumentContent.ts'; // Added new flow

    

