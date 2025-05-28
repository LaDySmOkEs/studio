
import { z } from "zod";

export const formSchema = z.object({
  caseDetails: z.string().min(50, { message: "Case details must be at least 50 characters long." }),
  caseCategory: z.enum(["general", "criminal", "civil"], { required_error: "Please select a case category." }),
});

export type CaseAnalysisFormValues = z.infer<typeof formSchema>;
