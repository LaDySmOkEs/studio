// src/app/document-generator/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"; // Added Input
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Added Alert
import { FileText } from "lucide-react"; // Added FileText for Alert icon
import { useToast } from "@/hooks/use-toast";

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
D. Pre-judgment and post-judgment interest as allowed by law;
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

const US_STATES = [
  { value: "AL", label: "Alabama" }, { value: "AK", label: "Alaska" }, { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" }, { value: "CA", label: "California" }, { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" }, { value: "DE", label: "Delaware" }, { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" }, { value: "HI", label: "Hawaii" }, { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" }, { value: "IN", label: "Indiana" }, { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" }, { value: "KY", label: "Kentucky" }, { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" }, { value: "MD", label: "Maryland" }, { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" }, { value: "MN", label: "Minnesota" }, { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" }, { value: "MT", label: "Montana" }, { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" }, { value: "NH", label: "New Hampshire" }, { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" }, { value: "NY", label: "New York" }, { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" }, { value: "OH", label: "Ohio" }, { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" }, { value: "PA", label: "Pennsylvania" }, { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" }, { value: "SD", label: "South Dakota" }, { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" }, { value: "UT", label: "Utah" }, { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" }, { value: "WA", label: "Washington" }, { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" }, { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia"}
];

const COURT_LEVELS = [
  { value: "Federal District Court", label: "Federal District Court" },
  { value: "Federal Court of Appeals", label: "Federal Court of Appeals" },
  { value: "State Supreme Court", label: "State Supreme Court" },
  { value: "State Appellate Court", label: "State Appellate Court" },
  { value: "Superior Court", label: "Superior Court" },
  { value: "District Court", label: "District Court" },
  { value: "County Court", label: "County Court" },
  { value: "Circuit Court", label: "Circuit Court" },
  { value: "Municipal Court", label: "Municipal Court" },
  { value: "Small Claims Court", label: "Small Claims Court" },
  { value: "Family Court", label: "Family Court" },
  { value: "Probate Court", label: "Probate Court" },
  { value: "Justice Court", label: "Justice Court" }
];


export default function DocumentGeneratorPage() {
  const [selectedDocument, setSelectedDocument] = useState<DocumentType>("");
  const [generatedDocument, setGeneratedDocument] = useState<string>("");
  const [suggestedByAI, setSuggestedByAI] = useState<string[]>([]);

  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedCourtLevel, setSelectedCourtLevel] = useState<string>("");

  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const suggestedTypesParam = searchParams.get('suggested');
    if (suggestedTypesParam) {
      const typesFromURL = suggestedTypesParam.split(',') as DocumentType[];
      const validSuggestedTypes = typesFromURL.filter(
        type => Object.keys(DOCUMENT_TEMPLATES).includes(type)
      );

      if (validSuggestedTypes.length > 0) {
        setSuggestedByAI(validSuggestedTypes);
        const firstValidType = validSuggestedTypes[0] as Exclude<DocumentType, "">;
        // setSelectedDocument will trigger the other useEffect to populate the template
        setSelectedDocument(firstValidType);
        toast({
          title: "AI Suggestion Applied",
          description: `Pre-selected '${firstValidType}' based on your case analysis. You can change this selection.`,
        });
      }
    }
  }, [searchParams, toast]);

  useEffect(() => {
    const docType = selectedDocument as Exclude<DocumentType, "">;
    if (docType && DOCUMENT_TEMPLATES[docType]) {
      let template = DOCUMENT_TEMPLATES[docType];

      let effectiveCourtName = "[Court Name]";
      if (selectedCourtLevel && selectedState) {
        effectiveCourtName = `${selectedCourtLevel}${selectedCity ? ` of ${selectedCity}` : ''}, ${selectedState}`;
      } else if (selectedCourtLevel) {
        effectiveCourtName = selectedCourtLevel;
      } else if (selectedState) {
        effectiveCourtName = `[Specify Court Level] in ${selectedState}`;
      } else if (selectedCity) {
         effectiveCourtName = `[Specify Court Level & State] of ${selectedCity}`;
      }


      template = template.replace(/\[Court Name\]/g, effectiveCourtName);
      template = template.replace(/State of \[State\]/g, `State of ${selectedState || "[State]"}`);
      template = template.replace(/\[State\]/g, selectedState || "[State]"); // General placeholder for state
      template = template.replace(/County of \[County\]/g, `County of ${selectedCity || "[County]"}`); // Using city as a proxy
      template = template.replace(/\[County\/District\]/g, selectedCity || "[County/District]"); // Using city as a proxy

      setGeneratedDocument(template);
    } else if (!selectedDocument) {
      setGeneratedDocument("");
    }
  }, [selectedDocument, selectedState, selectedCity, selectedCourtLevel]);


  const handleSelectDocument = (value: string) => {
    const docType = value as DocumentType;
    setSelectedDocument(docType);
  };

  const handleCopyToClipboard = () => {
    if (generatedDocument) {
      navigator.clipboard.writeText(generatedDocument);
      toast({
        title: "Copied to Clipboard",
        description: "The document template has been copied.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Document Generator</CardTitle>
          <CardDescription>
            Select jurisdiction and document type to generate a template. You can customize it to fit your needs. Remember, these templates are for guidance only and may not be suitable for all jurisdictions or situations. Always consult with a legal professional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {suggestedByAI.length > 0 && (
            <Alert variant="default" className="bg-accent/10 border-accent/50">
              <FileText className="h-4 w-4 text-accent" />
              <AlertTitle className="text-accent">AI Suggestions</AlertTitle>
              <AlertDescription>
                Based on your case analysis, we suggested: {suggestedByAI.join(', ')}.
                The first valid suggestion has been pre-selected.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label htmlFor="state-select" className="block text-sm font-medium text-foreground mb-1">State</label>
              <Select onValueChange={setSelectedState} value={selectedState}>
                <SelectTrigger id="state-select" aria-label="Select state">
                  <SelectValue placeholder="Select State..." />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map(state => (
                    <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="city-input" className="block text-sm font-medium text-foreground mb-1">City</label>
              <Input
                id="city-input"
                type="text"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                placeholder="Enter City"
                aria-label="Enter city"
              />
            </div>
            <div>
              <label htmlFor="court-level-select" className="block text-sm font-medium text-foreground mb-1">Court Level</label>
              <Select onValueChange={setSelectedCourtLevel} value={selectedCourtLevel}>
                <SelectTrigger id="court-level-select" aria-label="Select court level">
                  <SelectValue placeholder="Select Court Level..." />
                </SelectTrigger>
                <SelectContent>
                  {COURT_LEVELS.map(level => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label htmlFor="doc-type-select" className="block text-sm font-medium text-foreground mb-1 pt-4">Select Document Type</label>
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

          {selectedDocument && (
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-semibold">Template: {selectedDocument.charAt(0).toUpperCase() + selectedDocument.slice(1)}</h3>
              <Textarea
                value={generatedDocument}
                onChange={(e) => setGeneratedDocument(e.target.value)}
                rows={15}
                className="font-mono text-sm"
                aria-label="Editable document template"
                placeholder="Fill in jurisdiction details and select a document type to see the template. Then, edit as needed."
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

      {selectedDocument && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Guidance for {selectedDocument.charAt(0).toUpperCase() + selectedDocument.slice(1)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ensure you replace all bracketed placeholders like "[Your Name]" with your specific information.
              The jurisdictional details (State, City, Court Level) you selected have been pre-filled where applicable.
              Always verify requirements with your local court rules and consult a legal professional.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
