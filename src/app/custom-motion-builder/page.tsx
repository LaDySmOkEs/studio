
// src/app/custom-motion-builder/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { FileEdit as PageIcon, PlusCircle, Trash2, ArrowUp, ArrowDown, Copy, XCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Clause {
  id: string;
  title: string;
  category: string;
  templateText: string;
  keywords?: string[];
}

const CLAUSE_CATEGORIES = [
  "All Categories",
  "Caption & Introduction",
  "Jurisdiction & Venue",
  "Parties",
  "Statement of Facts",
  "Causes of Action / Counts",
  "Legal Arguments",
  "Statement on Exhaustion of Remedies",
  "Prayer for Relief",
  "Conclusion & Signature",
];

const AVAILABLE_CLAUSES: Clause[] = [
  {
    id: "cap_01", title: "Case Caption (Generic)", category: "Caption & Introduction",
    templateText: `[YOUR FULL NAME / PLAINTIFF'S FULL NAME]
[Your Street Address]
[Your City, State, Zip Code]
[Your Phone Number]
[Your Email Address]
Plaintiff, Pro Per (or indicate if represented by counsel)

[NAME OF COURT - e.g., UNITED STATES DISTRICT COURT FOR THE DISTRICT OF [Your District]]
[Division, if applicable - e.g., [City] Division]

[Plaintiff Name(s)],
    Plaintiff(s),

v.                                         Case No.: [Leave blank - to be filled by Court Clerk]

[Defendant Name(s)],
    Defendant(s).

MOTION TO [STATE THE PURPOSE OF THE MOTION]
`,
    keywords: ["caption", "court heading", "parties intro"]
  },
  {
    id: "intro_01", title: "Introduction to Motion", category: "Caption & Introduction",
    templateText: `
COMES NOW, [Your Name or Plaintiff's Name], ("Movant" or "Plaintiff"), pro per, and respectfully moves this Honorable Court for an Order [State precisely what you are asking the Court to do, e.g., "dismissing Defendant's Counterclaim," or "compelling discovery responses"]. This motion is made pursuant to [Cite relevant rule or statute, e.g., Federal Rule of Civil Procedure 12(b)(6), State Rule of Procedure XX].
In support of this motion, Movant states as follows:
`,
    keywords: ["introduction", "opening", "purpose of motion"]
  },
  {
    id: "jur_fed_q", title: "Jurisdiction - Federal Question", category: "Jurisdiction & Venue",
    templateText: `
I. JURISDICTION
1. This Court has subject matter jurisdiction over this action pursuant to 28 U.S.C. § 1331 as this case arises under the Constitution, laws, or treaties of the United States, specifically [Cite specific federal statute or constitutional provision, e.g., 42 U.S.C. § 1983 for violation of civil rights].
`,
    keywords: ["jurisdiction", "federal question", "28 USC 1331", "subject matter"]
  },
  {
    id: "jur_div", title: "Jurisdiction - Diversity", category: "Jurisdiction & Venue",
    templateText: `
I. JURISDICTION
1. This Court has subject matter jurisdiction over this action pursuant to 28 U.S.C. § 1332 because there is complete diversity of citizenship between Plaintiff(s) and Defendant(s), and the amount in controversy exceeds $75,000, exclusive of interest and costs.
   a. Plaintiff, [Plaintiff's Name], is a citizen of the State of [Plaintiff's State].
   b. Defendant, [Defendant's Name], is a citizen of the State of [Defendant's State].
`,
    keywords: ["jurisdiction", "diversity", "28 USC 1332", "subject matter", "amount in controversy"]
  },
  {
    id: "venue_01", title: "Venue (Generic Federal)", category: "Jurisdiction & Venue",
    templateText: `
II. VENUE
2. Venue is proper in this district pursuant to 28 U.S.C. § 1391(b) because [Choose one or more: (1) a substantial part of the events or omissions giving rise to the claim occurred in this district / (2) a defendant resides in this district and all defendants reside in the State in which this district is located / (3) if there is no district in which an action may otherwise be brought, this district is one in which any defendant is subject to the court's personal jurisdiction with respect to such action].
`,
    keywords: ["venue", "28 USC 1391", "proper court location"]
  },
  {
    id: "parties_01", title: "Statement of Parties (Generic)", category: "Parties",
    templateText: `
III. PARTIES
3. Plaintiff, [Plaintiff's Full Name], is an individual residing in [City, State].
4. Defendant, [Defendant's Full Name and Title, if applicable], is [Describe Defendant, e.g., "an individual residing in [City, State]," or "a corporation organized under the laws of the State of [State] with its principal place of business in [City, State]"].
   [Add more parties as necessary]
`,
    keywords: ["parties", "plaintiff", "defendant", "identification"]
  },
  {
    id: "facts_01", title: "Statement of Facts (Placeholder)", category: "Statement of Facts",
    templateText: `
IV. STATEMENT OF FACTS
5. [Begin factual allegations here. Describe the events in detail, in chronological order. Use separate numbered paragraphs for each distinct fact or event.]
6. [Be objective and stick to the facts. Provide dates, times, locations, and who did what.]
7. [Continue with all relevant facts supporting your motion.]
`,
    keywords: ["facts", "background", "events", "chronology"]
  },
  {
    id: "arg_01_generic", title: "Legal Argument Section (Generic)", category: "Legal Arguments",
    templateText: `
V. LEGAL ARGUMENT
A. [State the Legal Standard for the Relief You Are Seeking]
8. [Explain the relevant legal standard. For example, for a motion to dismiss, you would discuss the Twombly/Iqbal plausibility standard. For a motion for summary judgment, Rule 56 standards.]

B. [Apply the Law to Your Facts - Argument 1 Heading]
9. [Present your first legal argument, applying the law to the facts you've outlined. Cite relevant statutes, case law, and rules of procedure.]
10. [Develop your argument with supporting details and legal reasoning.]

C. [Apply the Law to Your Facts - Argument 2 Heading (if applicable)]
11. [Present your second legal argument, if any.]
`,
    keywords: ["argument", "law", "application of law", "legal standard", "reasoning"]
  },
  {
    id: "arg_monell", title: "Legal Argument: Monell Claim (Municipal Liability)", category: "Legal Arguments",
    templateText: `
VI. ARGUMENT FOR MONELL CLAIM (AGAINST MUNICIPAL DEFENDANT [Name of Municipality])
12. A municipality may be held liable under 42 U.S.C. § 1983 for constitutional violations resulting from its official policy, custom, or practice (Monell v. Dep't of Soc. Servs., 436 U.S. 658 (1978)).
13. In this case, Defendant [Name of Municipality]'s liability arises from [Choose one or more and elaborate with facts:
    a. An express policy: e.g., "its officially adopted policy of [describe policy]..."
    b. A widespread practice or custom: e.g., "a persistent and widespread custom of [describe custom, e.g., using excessive force] that, although not officially sanctioned, was so common and well-settled as to constitute municipal policy..."
    c. A decision by a final policymaker: e.g., "a decision by [Name and Title of Final Policymaker], who possessed final policymaking authority for [Name of Municipality] regarding [specific area], to [describe decision]..."
    d. Failure to train or supervise: e.g., "its deliberate indifference in failing to adequately train and/or supervise its officers regarding [specific area, e.g., the constitutional limits of force], which directly caused the violation of Plaintiff's rights..."].
14. [Provide specific factual allegations from your Statement of Facts that support the chosen basis for Monell liability.]
`,
    keywords: ["monell claim", "municipal liability", "section 1983", "custom or policy", "failure to train"]
  },
  {
    id: "exhaust_01", title: "Statement on Exhaustion of Remedies", category: "Exhaustion of Remedies",
    templateText: `
VII. EXHAUSTION OF ADMINISTRATIVE REMEDIES
15. Plaintiff has exhausted all available administrative remedies prior to filing this action as required by [Cite relevant statute, e.g., Prison Litigation Reform Act (PLRA), 42 U.S.C. § 1997e(a), if applicable].
    a. Specifically, Plaintiff filed [Describe administrative grievance/appeal, e.g., "a formal grievance with the [Agency Name] on [Date] regarding the issues raised herein"].
    b. [Describe the outcome or status, e.g., "The grievance was denied on [Date]," or "Plaintiff received no response within the time allotted, and thus the remedy is deemed exhausted."].
    (OR, if exhaustion is not required or is excused, explain why)
`,
    keywords: ["exhaustion", "administrative remedies", "plra", "grievance"]
  },
  {
    id: "relief_01", title: "Prayer for Relief (Generic)", category: "Prayer for Relief",
    templateText: `
VIII. PRAYER FOR RELIEF
WHEREFORE, Movant/Plaintiff respectfully requests that this Court enter an Order:
A. Granting this Motion to [State the specific relief sought, matching introduction];
B. [List any other specific relief, e.g., "Awarding Plaintiff reasonable attorneys' fees and costs incurred in bringing this motion"]; and
C. Granting such other and further relief as this Court deems just and proper.
`,
    keywords: ["prayer for relief", "request to court", "what you want"]
  },
  {
    id: "conc_01", title: "Conclusion & Signature Block", category: "Conclusion & Signature",
    templateText: `
Dated: [Date]

Respectfully submitted,

____________________________
[Your Typed Full Name]
[Your Status, e.g., Plaintiff, Pro Per]
[Your Address]
[Your Phone Number]
[Your Email Address]

CERTIFICATE OF SERVICE
I hereby certify that on this [Date], I served a true and correct copy of the foregoing motion upon [Opposing Party Name or Attorney Name] via [Method of Service, e.g., U.S. Mail, first class postage prepaid / E-Filing Portal / Email by agreement] addressed to:
[Opposing Party's or Attorney's Address/Email]

____________________________
[Your Signature]
`,
    keywords: ["conclusion", "signature", "certificate of service", "dated"]
  }
];


export default function CustomMotionBuilderPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [currentMotionStructure, setCurrentMotionStructure] = useState<Clause[]>([]);
  const [motionText, setMotionText] = useState<string>("");
  const { toast } = useToast();

  const filteredClauses = useMemo(() => {
    if (selectedCategory === "All Categories") {
      return AVAILABLE_CLAUSES;
    }
    return AVAILABLE_CLAUSES.filter(clause => clause.category === selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    const newMotionText = currentMotionStructure.map(clause => clause.templateText).join("\n\n");
    setMotionText(newMotionText);
  }, [currentMotionStructure]);

  const handleAddClause = (clause: Clause) => {
    setCurrentMotionStructure(prev => [...prev, { ...clause, id: `${clause.id}_${Date.now()}` }]); // Ensure unique ID for list rendering
    toast({ title: "Clause Added", description: `"${clause.title}" added to your motion.` });
  };

  const handleRemoveClause = (index: number) => {
    const removedClause = currentMotionStructure[index];
    setCurrentMotionStructure(prev => prev.filter((_, i) => i !== index));
    toast({ title: "Clause Removed", description: `"${removedClause.title}" removed from your motion.`, variant: "destructive" });
  };

  const handleMoveClause = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === currentMotionStructure.length - 1) return;

    const newStructure = [...currentMotionStructure];
    const clauseToMove = newStructure.splice(index, 1)[0];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    newStructure.splice(newIndex, 0, clauseToMove);
    setCurrentMotionStructure(newStructure);
  };

  const handleClearMotion = () => {
    setCurrentMotionStructure([]);
    setMotionText("");
    toast({ title: "Motion Cleared", description: "Your current motion draft has been cleared." });
  };

  const handleCopyToClipboard = () => {
    if (motionText) {
      navigator.clipboard.writeText(motionText);
      toast({
        title: "Motion Copied",
        description: "The motion text has been copied to your clipboard. Paste it into your own document editor to save.",
      });
    } else {
      toast({ title: "Nothing to Copy", description: "Your motion is empty.", variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Left Pane: Clause Library */}
      <Card className="lg:w-1/3 shadow-lg flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl">Clause Library</CardTitle>
          <CardDescription>Select a category and add clauses to build your motion.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-grow flex flex-col min-h-0">
          <Select onValueChange={setSelectedCategory} value={selectedCategory}>
            <SelectTrigger aria-label="Filter clauses by category">
              <SelectValue placeholder="Filter by category..." />
            </SelectTrigger>
            <SelectContent>
              {CLAUSE_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </SelectContent>
          </Select>
          <ScrollArea className="flex-grow border rounded-md p-2">
            {filteredClauses.length > 0 ? (
              <ul className="space-y-2">
                {filteredClauses.map(clause => (
                  <li key={clause.id} className="p-2 border rounded-md bg-muted/30 hover:bg-muted/50 flex justify-between items-center">
                    <span className="text-sm font-medium">{clause.title}</span>
                    <Button size="sm" variant="outline" onClick={() => handleAddClause(clause)} aria-label={`Add clause: ${clause.title}`}>
                      <PlusCircle className="w-4 h-4 mr-1" /> Add
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No clauses in this category.</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Right Pane: Motion Assembly */}
      <Card className="lg:w-2/3 shadow-lg flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <PageIcon className="w-6 h-6 text-primary" /> Your Motion
          </CardTitle>
          <CardDescription>Assemble your motion by adding, removing, and reordering clauses. Edit the final text below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex-grow flex flex-col min-h-0">
          <div>
            <Label className="text-md font-semibold">Current Motion Structure:</Label>
            {currentMotionStructure.length === 0 ? (
              <p className="text-sm text-muted-foreground mt-2">Add clauses from the library to begin.</p>
            ) : (
              <ScrollArea className="h-[200px] border rounded-md p-2 mt-1">
                <ul className="space-y-1">
                  {currentMotionStructure.map((clause, index) => (
                    <li key={clause.id} className="p-1.5 border rounded-md bg-card flex justify-between items-center text-sm hover:bg-muted/20">
                      <span>{index + 1}. {clause.title}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMoveClause(index, 'up')} disabled={index === 0} aria-label="Move clause up">
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMoveClause(index, 'down')} disabled={index === currentMotionStructure.length - 1} aria-label="Move clause down">
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleRemoveClause(index)} aria-label="Remove clause">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </div>
          
          <div className="flex-grow flex flex-col min-h-0">
            <Label htmlFor="motionTextarea" className="text-md font-semibold">Motion Text (Editable):</Label>
            <Textarea
              id="motionTextarea"
              value={motionText}
              onChange={(e) => setMotionText(e.target.value)}
              rows={15}
              className="font-mono text-xs flex-grow mt-1 resize-none"
              placeholder="Your assembled motion text will appear here. You can make final edits."
              aria-label="Editable motion text"
            />
          </div>
        </CardContent>
        <CardFooter className="flex-wrap gap-2">
          <Button onClick={handleCopyToClipboard} disabled={!motionText}>
            <Copy className="w-4 h-4 mr-2" /> Copy Motion Text
          </Button>
          <Button variant="destructive" onClick={handleClearMotion} disabled={currentMotionStructure.length === 0 && !motionText}>
            <XCircle className="w-4 h-4 mr-2" /> Clear Current Motion
          </Button>
        </CardFooter>
      </Card>
      <Alert variant="default" className="lg:col-span-full mt-0 border-accent bg-accent/10">
        <Info className="h-5 w-5 text-accent" />
        <AlertTitle className="font-semibold text-accent">Important Usage Notes</AlertTitle>
        <AlertDescription>
            This Custom Motion Builder is a tool to help you structure and draft legal motions. The provided clauses are generic templates and may not be suitable for all jurisdictions or specific legal situations. 
            It is crucial to research the specific rules of your court and the applicable law.
            <br /><strong>This tool does not provide legal advice.</strong> All documents generated should be carefully reviewed, edited for your specific facts and legal arguments, and ideally reviewed by a qualified legal professional before filing with any court.
            Placeholders like "[Your Name]" or "[Case Details]" must be replaced with your specific information.
            "Save Reusable Templates" is conceptual; use "Copy Motion Text" to save your work in your own editor.
        </AlertDescription>
      </Alert>
    </div>
  );
}
