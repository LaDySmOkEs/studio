
// src/app/due-process-checklist/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ListChecks, AlertTriangle, ShieldCheck } from "lucide-react";

interface ChecklistItemProps {
  id: string;
  label: string;
  details?: string;
}

const ChecklistItem = ({ id, label, details }: ChecklistItemProps) => (
  <div className="flex items-start space-x-3 py-2">
    <Checkbox id={id} className="mt-1" />
    <div className="grid gap-1.5 leading-snug">
      <Label htmlFor={id} className="font-normal text-sm">
        {label}
      </Label>
      {details && <p className="text-xs text-muted-foreground">{details}</p>}
    </div>
  </div>
);

const criminalArraignmentItems: ChecklistItemProps[] = [
  { id: "ca-notice", label: "Received timely and clear notice of the specific charges against you?" },
  { id: "ca-silent", label: "Informed of your right to remain silent?" },
  { id: "ca-attorney", label: "Informed of your right to an attorney?" },
  { id: "ca-appointed", label: "If you cannot afford an attorney, were you informed of your right to a court-appointed one?" },
  { id: "ca-plea", label: "Given an opportunity to enter a plea (e.g., guilty, not guilty, no contest)?" },
  { id: "ca-bail", label: "Bail/bond discussed and determined, if applicable?", details: "Were factors like flight risk and danger to community considered?" },
  { id: "ca-future-dates", label: "Clearly informed of future court dates and obligations?" },
];

const adminHearingItems: ChecklistItemProps[] = [
  { id: "ah-notice", label: "Received adequate written notice of the proposed action and the reasons for it?" },
  { id: "ah-timing", label: "Was the notice provided with enough time for you to prepare a response?" },
  { id: "ah-rules", label: "Informed of the specific rules, regulations, or laws you allegedly violated?" },
  { id: "ah-evidence", label: "Will you have an opportunity to present your evidence and arguments?", details: "This includes documents and potentially witness testimony." },
  { id: "ah-cross-examine", label: "Will you have an opportunity to see the evidence against you and (if applicable) cross-examine adverse witnesses?" },
  { id: "ah-counsel", label: "Are you permitted to have legal counsel represent you (often at your own expense)?" },
  { id: "ah-impartial", label: "Is the hearing conducted by a neutral and impartial decision-maker?" },
  { id: "ah-record", label: "Will a record of the proceedings be made?" },
  { id: "ah-decision", label: "Will you receive a written decision explaining the outcome and the reasons for it?" },
  { id: "ah-appeal", label: "Informed of any rights to appeal the decision?" },
];

const cpsInvolvementItems: ChecklistItemProps[] = [
  { id: "cps-reason", label: "Clearly informed by CPS about the reason for their involvement and the specific concerns or allegations?" },
  { id: "cps-respond", label: "Given a meaningful opportunity to respond to the allegations or concerns?" },
  { id: "cps-rights-investigation", label: "Informed of your rights during the CPS investigation?", details: "E.g., right to speak with an attorney, right not to speak without an attorney present for certain inquiries." },
  { id: "cps-safety-plan", label: "If a safety plan is proposed, do you understand its terms, and was your input considered?" },
  { id: "cps-court-notice", label: "If CPS intends to file a court petition (e.g., for dependency or removal), have you received formal written notice of the court hearing?" },
  { id: "cps-hearing-rights", label: "If a court hearing is scheduled, are you aware of your right to attend, to be represented by an attorney (and to have one appointed if you cannot afford one in many jurisdictions for these types of cases), to present evidence, and to cross-examine witnesses?" },
  { id: "cps-placement", label: "If children are removed, were you informed about placement, visitation rights, and the steps required for reunification?" },
];

const section1983ClaimItems: ChecklistItemProps[] = [
  { id: "s1983-state-actor", label: "Identify the 'State Actor': Was the person or entity that violated your rights acting under 'color of state law'?", details: "This means they were using authority given to them by a state, county, or local government (e.g., police officer, prison guard, public school official)." },
  { id: "s1983-constitutional-right", label: "Identify the Specific Constitutional Right Violated: Which of your U.S. Constitutional rights was infringed?", details: "E.g., First Amendment (free speech), Fourth Amendment (unreasonable search/seizure), Eighth Amendment (cruel and unusual punishment), Fourteenth Amendment (due process, equal protection)." },
  { id: "s1983-how-violated", label: "Describe How the Right Was Violated: What specific actions did the state actor take (or fail to take) that resulted in the violation of your constitutional right?" },
  { id: "s1983-causation", label: "Establish Causation: Was the state actor's conduct the direct cause of the violation of your rights and any resulting harm?" },
  { id: "s1983-damages-harm", label: "Identify Damages or Harm Suffered: What specific injuries or losses did you experience as a result of the violation?", details: "This can include physical injury, emotional distress, financial loss, or deprivation of liberty." },
  { id: "s1983-relief-sought", label: "Determine the Relief Sought: What do you want the court to do?", details: "E.g., compensatory damages (money for harm), punitive damages (to punish the wrongdoer), injunctive relief (an order to stop or start an action)." },
  { id: "s1983-statute-limitations", label: "Consider Statute of Limitations: Are you within the time limit to file this type of claim?", details: "This varies by state and is a critical deadline. Consult your state's law or an attorney." },
  { id: "s1983-immunities", label: "Be Aware of Potential Immunities: Some state actors may have certain legal immunities (e.g., qualified immunity for police officers).", details: "Understanding these defenses is complex and usually requires legal analysis." },
];

export default function DueProcessChecklistPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <ListChecks className="w-7 h-7 text-primary" />
            Interactive Due Process Checklists
          </CardTitle>
          <CardDescription>
            Use these interactive checklists to think through common due process elements and key considerations for various legal claims and situations.
            This tool is for informational and organizational purposes. It is not exhaustive and does not constitute legal advice. Procedures vary greatly by jurisdiction and the specific facts of your case.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="default" className="border-accent bg-accent/10">
            <AlertTriangle className="h-5 w-5 text-accent" />
            <AlertTitle className="font-semibold text-accent">Important Note</AlertTitle>
            <AlertDescription>
              The checkboxes below are for your personal reference to guide your thinking and preparation.
              Their state is managed by your browser and is not saved permanently or sent to any server. If you refresh the page or close your browser, your selections will be lost.
              Always consult with a qualified legal professional for advice tailored to your specific situation.
            </AlertDescription>
          </Alert>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="criminal-arraignment">
              <AccordionTrigger className="text-lg hover:no-underline">
                Preparing for a Criminal Arraignment
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2 pt-2">
                <p className="text-sm mb-2">An arraignment is typically your first court appearance after being charged with a crime. Key due process rights are often addressed here.</p>
                {criminalArraignmentItems.map(item => <ChecklistItem key={item.id} {...item} />)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="administrative-hearing">
              <AccordionTrigger className="text-lg hover:no-underline">
                Facing an Administrative Hearing
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2 pt-2">
                <p className="text-sm mb-2">Administrative hearings deal with issues like professional licenses, government benefits, zoning, etc. Due process still applies.</p>
                {adminHearingItems.map(item => <ChecklistItem key={item.id} {...item} />)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cps-involvement">
              <AccordionTrigger className="text-lg hover:no-underline">
                Responding to CPS Involvement (Initial Stages)
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2 pt-2">
                <p className="text-sm mb-2">Child Protective Services (CPS) involvement has significant due process implications for families. These are initial considerations.</p>
                {cpsInvolvementItems.map(item => <ChecklistItem key={item.id} {...item} />)}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="section-1983-claim">
              <AccordionTrigger className="text-lg hover:no-underline">
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-destructive" /> {/* Conceptual icon for civil rights */}
                    Considerations for a 42 U.S.C. § 1983 Claim
                 </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2 pt-2">
                <p className="text-sm mb-2">A claim under 42 U.S.C. § 1983 is a way to sue state or local government officials in federal court for violations of your constitutional rights. These are complex cases.</p>
                {section1983ClaimItems.map(item => <ChecklistItem key={item.id} {...item} />)}
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Legal Expertise Crucial</AlertTitle>
                  <AlertDescription>
                    Claims under 42 U.S.C. § 1983 involve complex legal doctrines like "state action," "color of law," and various immunities (e.g., qualified immunity). Successfully pursuing such a claim almost always requires the assistance of an experienced civil rights attorney. This checklist is for general understanding only.
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

