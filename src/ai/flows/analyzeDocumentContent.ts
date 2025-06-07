
// src/ai/flows/analyzeDocumentContent.ts
'use server';

/**
 * @fileOverview This flow conceptually analyzes document content based on its metadata.
 * It simulates OCR and text extraction, then provides an AI-driven analysis.
 *
 * - analyzeDocumentContent - A function that takes document metadata and returns a conceptual analysis.
 * - DocumentEvidenceInput - The input type for the analyzeDocumentContent function.
 * - DocumentEvidenceAnalysisOutput - The return type for the analyzeDocumentContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const DocumentEvidenceInputSchema = z.object({
  documentLabel: z.string().describe("The user-provided label or title for the document."),
  documentDescription: z.string().optional().describe("The user's description of the document's content or relevance."),
  fileName: z.string().optional().describe("The original filename of the document, if uploaded."),
  caseContext: z.string().optional().describe("Optional broader case context provided by the user from their case summary."),
});
export type DocumentEvidenceInput = z.infer<typeof DocumentEvidenceInputSchema>;

export const DocumentEvidenceAnalysisOutputSchema = z.object({
  summary: z.string().describe("A brief summary of what this document likely contains and its purpose, based on its description and type."),
  potentialIssues: z.array(z.string()).describe("A list of 2-3 potential legal issues, due process concerns, or important points a user should pay close attention to in such a document."),
  keywords: z.array(z.string()).max(5).describe("A list of 3-5 relevant keywords or tags for this document."),
  disclaimer: z.string().describe("A standard disclaimer about the conceptual nature of the analysis."),
});
export type DocumentEvidenceAnalysisOutput = z.infer<typeof DocumentEvidenceAnalysisOutputSchema>;

export async function analyzeDocumentContent(input: DocumentEvidenceInput): Promise<DocumentEvidenceAnalysisOutput> {
  return analyzeDocumentContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDocumentContentPrompt',
  input: {schema: DocumentEvidenceInputSchema},
  output: {schema: DocumentEvidenceAnalysisOutputSchema},
  prompt: `You are an AI Legal Assistant for DUE PROCESS AI. Your task is to conceptually analyze a document based on metadata provided by the user.
Assume that if this were a real document, OCR and text extraction have been performed successfully.
Your analysis should be based on the likely content of a document with the given label, description, and filename.

Document Details Provided by User:
- Label/Title: "{{documentLabel}}"
{{#if documentDescription}}- User's Description: "{{documentDescription}}"{{/if}}
{{#if fileName}}- (Conceptual) Filename: "{{fileName}}"{{/if}}

{{#if caseContext}}
User's General Case Context (for background understanding only, do not refer to it as "their case"):
"{{caseContext}}"
{{/if}}

Based on this information, provide the following:
1.  'summary': A brief summary (2-3 sentences) of what this type of document likely contains and its general purpose in a legal context.
2.  'potentialIssues': A list of 2-3 potential legal issues, due process concerns, or important points a user should generally pay close attention to when reviewing such a document (e.g., "Verify service of process details if it's a summons," "Check for specific deadlines mentioned," "Ensure all named parties are correct and complete," "Cross-reference dates with known events"). Be general and informative.
3.  'keywords': A list of 3-5 relevant keywords or tags that would typically be associated with a document of this nature.
4.  'disclaimer': Provide *exactly* this text: "This analysis is conceptual, based on the document's description and type. No actual file content or OCR was processed by the AI in this prototype. Always review original documents carefully and consult a qualified legal professional."

Ensure your output strictly adheres to the defined schema. If the document label/description is very vague (e.g., "my file"), state that in the summary and provide very general potential issues.
Focus on being helpful and informative within the scope of a conceptual analysis. Do not invent specific facts not inferable from the label/description.
`,
});

const analyzeDocumentContentFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentContentFlow',
    inputSchema: DocumentEvidenceInputSchema,
    outputSchema: DocumentEvidenceAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to provide a conceptual document analysis.");
    }
    // Ensure the disclaimer is always the specific one, even if the model hallucinates another.
    return {
      ...output,
      disclaimer: "This analysis is conceptual, based on the document's description and type. No actual file content or OCR was processed by the AI in this prototype. Always review original documents carefully and consult a qualified legal professional."
    };
  }
);

