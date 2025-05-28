
// src/app/document-generator/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

type DocumentType = "motion" | "affidavit" | "complaint" | "motionForBailReduction" | "discoveryRequest" | "petitionForExpungement" | "";

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
  complaint: `[YOUR FULL NAME / PLAINTIFF'S FULL NAME, if different, and "Next Friend" status if applicable]
[Your Street Address]
[Your City, State, Zip Code]
[Your Phone Number]
[Your Email Address]
Plaintiff, Pro Se (or indicate if represented by counsel)

[NAME OF COURT - e.g., UNITED STATES DISTRICT COURT FOR THE DISTRICT OF [Your District]]
[Division, if applicable - e.g., [City] Division]

[Plaintiff Name(s), including "Next Friend" status if applicable, e.g., JANE DOE, individually, and as Next Friend of JOHN DOE, a minor],
  Plaintiff(s),

v. Case No.: [Leave blank - to be filled by Court Clerk]

[Defendant Name(s), with titles if known, e.g., OFFICER JOHN SMITH, in his individual and official capacities; CITY OF ANYTOWN],
  Defendant(s).

COMPLAINT FOR VIOLATION OF CIVIL RIGHTS (42 U.S.C. § 1983) AND [OTHER CAUSES OF ACTION, IF ANY]
(JURY TRIAL DEMANDED, if applicable)

I. INTRODUCTION
1. This is an action for [Briefly describe the nature of the lawsuit, e.g., violation of constitutional rights, personal injury, breach of contract]. This complaint seeks [Briefly state what you are asking the court to do, e.g., monetary damages, injunctive relief].

II. JURISDICTION AND VENUE
2. This Court has subject matter jurisdiction over this action pursuant to [State the basis for the court's jurisdiction. For federal civil rights claims under 42 U.S.C. § 1983, cite 28 U.S.C. § 1331 (federal question) and 28 U.S.C. § 1343 (civil rights). For state law claims, state the basis for state court jurisdiction or supplemental jurisdiction if in federal court (28 U.S.C. § 1367)].
3. Venue is proper in this district pursuant to [State the basis for venue, e.g., 28 U.S.C. § 1391(b) because a substantial part of the events or omissions giving rise to the claim occurred in this district, or a defendant resides in this district].

III. PARTIES
4. Plaintiff, [Plaintiff's Full Name], is an individual residing in [City, State]. [If filing as "Next Friend," add: Plaintiff, [Next Friend'S Full Name], is the [Relationship, e.g., parent and legal guardian] of [Minor/Incompetent Person's Full Name], and brings this action on their behalf as Next Friend. [Minor/Incompetent Person's Full Name] is an individual residing in [City, State].]
5. Defendant, [Defendant's Full Name and Title, if applicable, e.g., Officer John Smith], is sued in their [Individual and/or Official capacity, if a state actor]. At all times relevant to this complaint, Defendant [Defendant's Full Name] was acting under color of state law. [Provide address or location if known].
6. Defendant, [Second Defendant's Full Name and Title, e.g., City of Anytown], is a [Type of entity, e.g., municipal corporation organized under the laws of the State of [State]]. [Provide address or location if known].
   [Add more defendants as necessary]

IV. FACTUAL ALLEGATIONS
   (Describe the events in detail, in chronological order. Use separate numbered paragraphs for each distinct fact or event.)
7. On or about [Date], at approximately [Time], at [Location], the following occurred: [Describe the event].
8. [Continue with specific facts, detailing who did what, when, and where. Be objective and stick to the facts.]
9. [Provide details about any injuries, damages, or harm suffered.]

V. CAUSES OF ACTION / CLAIMS FOR RELIEF

COUNT I: VIOLATION OF CIVIL RIGHTS UNDER 42 U.S.C. § 1983 - [SPECIFIC CONSTITUTIONAL RIGHT, e.g., FOURTH AMENDMENT - UNLAWFUL SEIZURE] (Against Defendant [Name(s) of individual state actor(s)])
10. Plaintiffs re-allege and incorporate by reference paragraphs 1 through [Last factual paragraph number] as if fully set forth herein.
11. Defendant(s) [Name(s)], while acting under color of state law, deprived Plaintiff(s) of their rights secured by the [Specify Amendment, e.g., Fourth and Fourteenth Amendments] to the United States Constitution by [Describe specifically how the Defendant(s) violated the right, e.g., unlawfully arresting Plaintiff without probable cause, using excessive force].
12. The actions of Defendant(s) [Name(s)] were [intentional, willful, reckless, and/or deliberately indifferent] to Plaintiff(s)'s constitutional rights.
13. As a direct and proximate result of Defendant(s)' [Name(s)] unconstitutional conduct, Plaintiff(s) has suffered [Describe damages, e.g., physical injuries, emotional distress, financial loss, deprivation of liberty].

COUNT II: [NAME OF SECOND CAUSE OF ACTION, e.g., State Law Claim for Assault and Battery] (Against Defendant [Name(s)])
14. Plaintiffs re-allege and incorporate by reference paragraphs 1 through [Last factual paragraph number] as if fully set forth herein.
15. [State the elements of this cause of action and how the defendant's actions meet those elements under your state's law.]
16. As a direct and proximate result of Defendant's [conduct], Plaintiff(s) has suffered damages including [List damages].
    [Add more counts as necessary for other claims]

VI. PRAYER FOR RELIEF
WHEREFORE, Plaintiff(s) respectfully request(s) that this Court enter judgment in their favor and against Defendant(s), jointly and severally, for the following relief:
A. Compensatory damages in an amount to be determined at trial, for [e.g., physical injuries, emotional pain and suffering, lost wages, medical expenses];
B. Punitive damages against Defendant(s) [Name(s) of individual defendants sued in their individual capacity, if applicable] in an amount to be determined at trial, for their [willful, malicious, reckless] conduct;
C. Declaratory relief stating that Defendant(s)' actions violated Plaintiff(s)' rights;
D. Injunctive relief ordering Defendant(s) to [Specify action, e.g., cease certain conduct, implement new policies];
E. Reasonable attorneys' fees and costs of this action pursuant to 42 U.S.C. § 1988 (if applicable) and/or [other relevant statutes];
F. Pre-judgment and post-judgment interest as allowed by law; and
G. Such other and further relief as this Court deems just and proper.

DEMAND FOR JURY TRIAL
Plaintiff(s) hereby demand a trial by jury on all issues so triable in this action.

Dated: [Date]

Respectfully submitted,

____________________________
[Your Signature]
[Your Typed Full Name]
Plaintiff, Pro Se (or Attorney Name, Bar Number, Firm if represented)
`,
  motionForBailReduction: `[MOTION FOR BAIL REDUCTION]

Case Name: [State/Commonwealth/People] v. [Defendant Name]
Case Number: [Case Number]
Court: [Court Name]

Defendant, [Defendant Name], by and through undersigned counsel (or Pro Se), respectfully moves this Honorable Court to reduce the bail previously set in this case. In support of this motion, Defendant states as follows:

1. Current Bail Status: [Describe current bail amount and conditions, e.g., "Bail is currently set at $X cash or $Y bond."]
2. Defendant's Ties to the Community: [Describe defendant's local residence, family, employment, etc., to show they are not a flight risk.]
3. Inability to Post Current Bail: [Explain why the defendant cannot afford the current bail amount.]
4. Lack of Danger to the Community: [Argue why the defendant does not pose a danger to the community if released on reduced bail or personal recognizance.]
5. Proposed Bail: [Suggest a specific reduced bail amount or conditions, e.g., "Defendant requests bail be reduced to $Z or release on personal recognizance with conditions such as..."]
6. Legal Argument: [Cite any relevant statutes or case law supporting bail reduction for similar circumstances or for defendants with these characteristics.]

WHEREFORE, Defendant respectfully requests that this Court grant this motion and reduce bail to an amount and upon conditions that are reasonable and just.

Dated: [Date]

Respectfully submitted,
[Your Name/Law Firm Name]
[Your Address]
[Your Phone Number]
[Your Email Address]
`,
  discoveryRequest: `[DEFENDANT'S REQUEST FOR DISCOVERY AND BRADY MATERIAL]

Case Name: [State/Commonwealth/People] v. [Defendant Name]
Case Number: [Case Number]
Court: [Court Name]

TO: Prosecuting Attorney
[Prosecutor's Name and Address]

Defendant, [Defendant Name], by and through undersigned counsel (or Pro Se), hereby requests discovery and inspection of all materials to which the Defendant is entitled pursuant to [State's Rules of Criminal Procedure, e.g., Rule X], the United States Constitution, including Brady v. Maryland, 373 U.S. 83 (1963), Giglio v. United States, 405 U.S. 150 (1972), and their progeny.

This request includes, but is not limited to, the following:

1. All statements of the Defendant, oral, written, or recorded.
2. All statements of any co-defendants or alleged co-conspirators.
3. All reports, notes, or statements of law enforcement officers or other government agents related to this case.
4. All results or reports of physical or mental examinations, scientific tests, or experiments.
5. A list of all tangible objects, documents, photographs, or other items obtained from or belonging to the Defendant, or obtained from others, which the prosecution intends to use at trial or which are material to the preparation of the defense.
6. A list of names and addresses of all persons whom the prosecution intends to call as witnesses at trial, together with their relevant written or recorded statements (Witness Lists).
7. All evidence favorable to the Defendant on the issue of guilt or punishment (Brady Material), including but not limited to:
    a. Evidence that could impeach the credibility of prosecution witnesses.
    b. Evidence that points to the innocence of the Defendant or suggests another party may be guilty.
    c. Evidence that could mitigate the sentence if the Defendant is convicted.
8. Any deals, promises, or inducements made to any prosecution witness.

This request is ongoing, and Defendant requests that the prosecution supplement its discovery responses as additional information or materials become available.

Dated: [Date]

Respectfully submitted,
[Your Name/Law Firm Name]
[Your Address]
[Your Phone Number]
[Your Email Address]
`,
  petitionForExpungement: `[PETITION FOR EXPUNGEMENT/SEALING OF CRIMINAL RECORD]

Case Name (if applicable): [Original Case Name, e.g., State v. Your Name]
Case Number (if applicable): [Original Case Number]
Court: [Court Name where conviction/arrest occurred]

Petitioner: [Your Full Name]
Date of Birth: [Your DOB]
Address: [Your Current Address]
Phone: [Your Phone]
Email: [Your Email]

I, [Your Full Name], the Petitioner, respectfully request this Honorable Court to order the expungement (or sealing) of my criminal record(s) pertaining to the arrest(s) and/or conviction(s) detailed below, pursuant to [Cite Specific State Statute, e.g., State Statute § XX-XXX].

1. Details of Arrest/Conviction to be Expunged/Sealed:
   a. Date of Arrest/Conviction: [Date]
   b. Offense(s): [List specific charges]
   c. Arresting Agency/Jurisdiction: [Name of Police Department/County]
   d. Disposition (if applicable): [e.g., Dismissed, Nolle Prosequi, Acquitted, Convicted - specify if conviction]
   e. Sentence (if convicted): [Details of sentence]

2. Eligibility for Expungement/Sealing:
   a. [Explain why you are eligible under the cited statute. This often includes factors like: time elapsed since conviction/sentence completion, nature of the offense, no subsequent convictions, completion of all sentence terms, etc. BE VERY SPECIFIC TO YOUR JURISDICTION'S LAW.]
   b. [Example: "More than X years have passed since the completion of my sentence for the above-referenced misdemeanor offense, as required by {Statute}."]
   c. [Example: "I have no other pending criminal charges and have not been convicted of any other crimes since this incident."]

3. Reasons for Request:
   [Briefly explain why you are seeking expungement/sealing, e.g., to improve employment prospects, housing opportunities, restore civil rights, personal peace of mind. This section may or may not be required by your state.]

4. Supporting Documentation (if any, attach as exhibits):
   [e.g., Certificate of Disposition, proof of sentence completion, character references (if allowed/helpful)]

WHEREFORE, Petitioner prays for an Order from this Court directing all relevant law enforcement agencies, courts, and other state entities to expunge (or seal) all records related to the arrest(s) and/or conviction(s) described herein.

I declare under penalty of perjury under the laws of the State of [Your State] that the foregoing is true and correct.

Dated: [Date]

____________________________
[Your Full Name] - Petitioner (Pro Se)

(Notary Public section may be required depending on jurisdiction)
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
  { value: "Justice Court", label: "Justice Court" },
  { value: "Tribal Court", label: "Tribal Court" },
];


export default function DocumentGeneratorPage() {
  const [selectedDocument, setSelectedDocument] = useState<DocumentType>("");
  const [generatedDocument, setGeneratedDocument] = useState<string>("");
  const [suggestedByAI, setSuggestedByAI] = useState<string[]>([]);

  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>(""); // Represents County or City as per template
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
        setSelectedDocument(firstValidType);
        toast({
          title: "AI Suggestion Applied",
          description: `Pre-selected '${firstValidType.replace(/([A-Z])/g, ' $1').trim()}' based on your case analysis. You can change this selection.`,
        });
      }
    }
  }, [searchParams, toast]);

  useEffect(() => {
    const docType = selectedDocument as Exclude<DocumentType, "">;
    if (docType && DOCUMENT_TEMPLATES[docType]) {
      let template = DOCUMENT_TEMPLATES[docType];

      let effectiveCourtName = "[NAME OF COURT - e.g., UNITED STATES DISTRICT COURT FOR THE DISTRICT OF [Your District]]"; // Default for complaint
      if (docType !== "complaint") {
        effectiveCourtName = "[Court Name]"; // Default for other docs
      }


      if (selectedCourtLevel && selectedState) {
         if (docType === "complaint") {
            const stateLabel = US_STATES.find(s => s.value === selectedState)?.label || selectedState;
            if (selectedCourtLevel.toLowerCase().includes("federal")) {
                 effectiveCourtName = `${selectedCourtLevel.replace("Federal ", "UNITED STATES ")} FOR THE ${selectedCity ? `DISTRICT OF ${stateLabel}, ${selectedCity} DIVISION` : `DISTRICT OF ${stateLabel}` }`;
            } else {
                 effectiveCourtName = `${selectedCourtLevel}${selectedCity ? ` OF ${selectedCity}, ${stateLabel}` : `, ${stateLabel}` }`;
            }
         } else {
            effectiveCourtName = `${selectedCourtLevel}${selectedCity ? ` for ${selectedCity}` : ''}, ${US_STATES.find(s => s.value === selectedState)?.label || selectedState}`;
         }
      } else if (selectedCourtLevel) {
        effectiveCourtName = docType === "complaint" ? selectedCourtLevel.toUpperCase() : selectedCourtLevel;
      } else if (selectedState) {
        const stateLabel = US_STATES.find(s => s.value === selectedState)?.label || selectedState;
        effectiveCourtName = docType === "complaint" ? `[SPECIFY COURT LEVEL] IN ${stateLabel.toUpperCase()}` : `[Specify Court Level] in ${stateLabel}`;
      } else if (selectedCity && docType === "complaint") {
         effectiveCourtName = `[SPECIFY COURT LEVEL AND STATE] FOR ${selectedCity.toUpperCase()} DIVISION`;
      } else if (selectedCity) {
         effectiveCourtName = `[Specify Court Level & State] for ${selectedCity}`;
      }


      template = template.replace(/\[NAME OF COURT - e.g., UNITED STATES DISTRICT COURT FOR THE DISTRICT OF \[Your District\]\]/g, effectiveCourtName);
      template = template.replace(/\[Court Name\]/g, effectiveCourtName); // General for other docs

      template = template.replace(/\[State\/Commonwealth\/People\] v. \[Defendant Name\]/g, selectedState ? `${US_STATES.find(s => s.value === selectedState)?.label || '[State/Commonwealth/People]'} v. [Defendant Name]` : `[State/Commonwealth/People] v. [Defendant Name]`);
      template = template.replace(/State of \[State\]/g, `State of ${selectedState ? US_STATES.find(s => s.value === selectedState)?.label || '[State]' : "[State]"}`);
      template = template.replace(/County of \[County\]/g, `County of ${selectedCity || "[County]"}`);
      template = template.replace(/\[County\/District\]/g, selectedCity || "[County/District]");
      template = template.replace(/under the laws of the State of \[Your State\]/g, `under the laws of the State of ${selectedState ? US_STATES.find(s => s.value === selectedState)?.label || '[Your State]' : "[Your State]"}`);
      template = template.replace(/\[State\]/g, selectedState ? US_STATES.find(s => s.value === selectedState)?.label || '[State]' : "[State]"); // General placeholder for state


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
  
  const getDocumentDisplayName = (docType: DocumentType) => {
    if (!docType) return "Choose a document...";
    // Add spaces before capital letters and capitalize first letter
    return docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Document Generator</CardTitle>
          <CardDescription>
            Select your state, city/county, and court level to help tailor documents for the correct jurisdiction. Then, choose a document type to generate a template. 
            Remember, these templates are for guidance only, do not constitute legal advice, and may require significant modification and review by a legal professional to be suitable for your specific situation and jurisdiction.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {suggestedByAI.length > 0 && (
            <Alert variant="default" className="bg-accent/10 border-accent/50">
              <FileText className="h-4 w-4 text-accent" />
              <AlertTitle className="text-accent">AI Suggestions</AlertTitle>
              <AlertDescription>
                Based on your case analysis, we suggested: {suggestedByAI.map(getDocumentDisplayName).join(', ')}.
                The first valid suggestion has been pre-selected.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="state-select" className="block text-sm font-medium text-foreground mb-1">State</Label>
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
              <Label htmlFor="city-input" className="block text-sm font-medium text-foreground mb-1">City / County / Federal District Division</Label>
              <Input
                id="city-input"
                type="text"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                placeholder="Enter City, County, or Division"
                aria-label="Enter city, county, or federal district division"
              />
            </div>
            <div>
              <Label htmlFor="court-level-select" className="block text-sm font-medium text-foreground mb-1">Court Level</Label>
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
            <Label htmlFor="doc-type-select" className="block text-sm font-medium text-foreground mb-1 pt-4">Select Document Type</Label>
            <Select onValueChange={handleSelectDocument} value={selectedDocument}>
              <SelectTrigger id="doc-type-select" className="w-full sm:w-[320px]" aria-label="Select document type">
                <SelectValue placeholder="Choose a document..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="complaint">Complaint (Detailed Pre-Filing)</SelectItem>
                <SelectItem value="motion">Motion (General)</SelectItem>
                <SelectItem value="affidavit">Affidavit</SelectItem>
                <SelectItem value="motionForBailReduction">Motion for Bail Reduction</SelectItem>
                <SelectItem value="discoveryRequest">Discovery Request (Brady/Witness)</SelectItem>
                <SelectItem value="petitionForExpungement">Petition for Expungement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedDocument && (
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-semibold">Template: {getDocumentDisplayName(selectedDocument)}</h3>
               <Label htmlFor="documentTemplateTextarea" className="sr-only">Editable document template</Label>
              <Textarea
                id="documentTemplateTextarea"
                value={generatedDocument}
                onChange={(e) => setGeneratedDocument(e.target.value)}
                rows={25}
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
            <CardTitle className="flex items-center gap-1"><Info className="w-5 h-5 text-accent" /> Guidance for {getDocumentDisplayName(selectedDocument)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground space-y-2">
              Ensure you replace all bracketed placeholders like "[Your Name]" with your specific information.
              The jurisdictional details (State, City/County/Division, Court Level) you selected have been pre-filled where applicable. Check these carefully.
              <br />
              For the "Complaint (Detailed Pre-Filing)" template, this is a comprehensive starting point often used for civil rights claims (like those under 42 U.S.C. § 1983). It includes sections for jurisdiction, parties (with "Next Friend" guidance), detailed factual allegations, specific causes of action, prayer for relief, and a jury demand. It requires substantial customization for your specific facts and legal claims.
              <br />
              For "Petition for Expungement", legal requirements vary significantly by state; this template is a very general starting point and requires careful review of your specific state's laws.
              <br />
              <strong>Disclaimer:</strong> These templates are for informational purposes only and do not constitute legal advice. Always verify requirements with your local court rules and consult a qualified legal professional before using or submitting any legal document.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    
