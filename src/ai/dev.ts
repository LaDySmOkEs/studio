
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-relevant-laws.ts';
import '@/ai/flows/criminalLawSuggestions.ts';
import '@/ai/flows/civilLawSuggestions.ts';
import '@/ai/flows/suggestLegalStrategies.ts';

