// src/app/document-generator/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

type DocumentType = "motion" | "affidavit" | "complaint" | "";

const DOCUMENT_TEMPLATES: Record<Exclude<DocumentType, "">, string> = {
  motion: `[MOTION TITLE]

Case Name: [Plaintiff Name] v. [Defendant Name]
Case Number: [Case Number]
Court: [Court Name]

Introduction
1. [State who is filing the motion and what is being requested.]

Background
2. [Provide a brief summary of relevant case facts.]
3. [Explain why this motion is necessary at this time.]

Argument
4. [Present legal arguments supporting the motion. Cite relevant statutes, case law, and rules.]
   a. [Argument Point 1]
   b. [Argument Point 2]

Conclusion
5. For the foregoing reasons, [Movant Name] respectfully requests that this Court grant this motion and [State the specific relief sought].

Dated: [Date]

Respectfully submitted,
[Your Name/Law Firm Name]
[Your Address]
[Your Phone Number]
[Your Email Address]
`,
  affidavit: `[AFFIDAVIT TITLE]

State of [State]
County of [County]

I, [Your Full Name], being duly sworn, depose and state as follows:

1. I am over the age of 18 and competent to make this affidavit.
2. [State your relationship to the case or the facts you are attesting to.]
3. [Present facts in numbered paragraphs. Each paragraph should contain a single fact or a closely related set of facts. Be specific and stick to what you personally know.]
   Example: On [Date], at approximately [Time], I witnessed [Describe event].
4. [Continue with additional facts.]
5. All statements made herein are true and correct to the best of my knowledge and belief.

____________________________
[Your Full Name] - Affiant

Sworn to and subscribed before me this [Day] day of [Month], [Year].

____________________________
Notary Public
My Commission Expires: [Date]
(Notary Seal)
`,
  complaint: `[COMPLAINT TITLE]

[Court Name]
[County/District]

[Plaintiff Name(s)],
  Plaintiff(s),

v.                                Case No.: [Leave blank, court will assign]

[Defendant Name(s)],
  Defendant(s).

COMPLAINT

Plaintiff(s), [Plaintiff Name(s)], by and through their undersigned counsel (or Pro Se), bring this Complaint against Defendant(s), [Defendant Name(s)], and allege as follows:

I. JURISDICTION AND VENUE
1. This Court has jurisdiction over this matter because [State basis for jurisdiction, e.g., diversity of citizenship, federal question, specific statute].
2. Venue is proper in this district because [State basis for venue, e.g., where events occurred, where defendant resides].

II. PARTIES
3. Plaintiff, [Plaintiff Name], is [Description of Plaintiff, e.g., an individual residing in City, State].
4. Defendant, [Defendant Name], is [Description of Defendant, e.g., a corporation organized under the laws of State X with its principal place of business in City, State Y].

III. FACTUAL ALLEGATIONS
5. [Describe the events leading to the lawsuit in chronological order. Provide specific dates, locations, and actions. Each paragraph should cover a distinct point.]
6. [Continue with factual allegations.]

IV. CAUSES OF ACTION

COUNT I: [NAME OF FIRST CAUSE OF ACTION, e.g., Negligence]
7. Plaintiff(s) re-allege and incorporate by reference paragraphs 1 through [Last factual paragraph number] as if fully set forth herein.
8. [State the elements of the cause of action and how the defendant's actions meet those elements.]
9. As a direct and proximate result of Defendant's [conduct], Plaintiff(s) has suffered damages including [List damages].

COUNT II: [NAME OF SECOND CAUSE OF ACTION, e.g., Breach of Contract]
10. Plaintiff(s) re-allege and incorporate by reference paragraphs 1 through [Last factual paragraph number] as if fully set forth herein.
11. [State the elements of this cause of action and how the defendant's actions meet those elements.]
12. As a direct and proximate result of Defendant's [conduct], Plaintiff(s) has suffered damages including [List damages].

V. PRAYER FOR RELIEF
WHEREFORE, Plaintiff(s) respectfully request(s) that this Court enter judgment in their favor and against Defendant(s) for the following relief:
A. [Specific relief sought, e.g., Monetary damages in an amount to be determined at trial];
B. [Other specific relief, e.g., Injunctive relief ordering defendant to...];
C. Costs of this action;
D. Pre-judgment and post-judgment interest as allowed by law; and
E. Such other and further relief as this Court deems just and proper.

DEMAND FOR JURY TRIAL (If applicable)
Plaintiff(s) demand a trial by jury on all issues so triable.

Dated: [Date]

Respectfully submitted,
____________________________
[Your Name / Attorney Name]
[Bar Number, if applicable]
[Address]
[Phone Number]
[Email Address]
[Pro Se or Attorney for Plaintiff(s)]
`,
};

export default function DocumentGeneratorPage() {
  const [selectedDocument, setSelectedDocument] = useState<DocumentType>("");
  const [generatedDocument, setGeneratedDocument] = useState<string>("");

  const handleSelectDocument = (value: string) => {
    const docType = value as Exclude<DocumentType, "">;
    setSelectedDocument(docType);
    if (docType && DOCUMENT_TEMPLATES[docType]) {
      setGeneratedDocument(DOCUMENT_TEMPLATES[docType]);
    } else {
      setGeneratedDocument("");
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedDocument);
    // Consider adding a toast notification here
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Document Generator</CardTitle>
          <CardDescription>
            Select a document type to view a template. You can customize it to fit your needs. Remember, these templates are for guidance only and may not be suitable for all jurisdictions or situations. Always consult with a legal professional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="doc-type-select" className="block text-sm font-medium text-foreground mb-1">Select Document Type</label>
            <Select onValueChange={handleSelectDocument} value={selectedDocument}>
              <SelectTrigger id="doc-type-select" className="w-full sm:w-[280px]" aria-label="Select document type">
                <SelectValue placeholder="Choose a document..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="motion">Motion</SelectItem>
                <SelectItem value="affidavit">Affidavit</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedDocument && generatedDocument && (
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-semibold">Template: {selectedDocument.charAt(0).toUpperCase() + selectedDocument.slice(1)}</h3>
               <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted/20">
                <pre className="text-sm whitespace-pre-wrap font-mono">{generatedDocument}</pre>
              </ScrollArea>
              <Textarea
                value={generatedDocument}
                onChange={(e) => setGeneratedDocument(e.target.value)}
                rows={15}
                className="font-mono text-sm"
                aria-label="Editable document template"
              />
            </div>
          )}
        </CardContent>
        {selectedDocument && generatedDocument && (
           <CardFooter className="flex justify-end">
            <Button onClick={handleCopyToClipboard}>Copy to Clipboard</Button>
          </CardFooter>
        )}
      </Card>

      {/* Placeholder for step-by-step guidance or additional features */}
      {selectedDocument && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Guidance for {selectedDocument.charAt(0).toUpperCase() + selectedDocument.slice(1)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Step-by-step guidance for filling out this document will appear here. 
              For now, ensure you replace all bracketed placeholders like "[Your Name]" with your specific information.
              Always verify requirements with your local court rules.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
