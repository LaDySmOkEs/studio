
// src/app/legal-aid-referral/page.tsx
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LifeBuoy, LinkIcon, AlertTriangle, Info, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LEGAL_AID_RESOURCES = [
  { name: "Legal Services Corporation (LSC.gov)", url: "https://www.lsc.gov/find-legal-aid", description: "Find LSC-funded legal aid organizations in your area." },
  { name: "American Bar Association - Find Legal Help", url: "https://www.americanbar.org/groups/legal_services/flh-home/", description: "Resources for finding free legal aid, pro bono services, and public service lawyers." },
  { name: "LawHelp.org", url: "https://www.lawhelp.org", description: "Helps low and moderate-income people find free legal aid programs in their communities." },
];

const HELP_TYPES = [
  { value: "criminal_defense", label: "Criminal Defense" },
  { value: "family_law", label: "Family Law (Divorce, Custody)" },
  { value: "housing", label: "Housing (Eviction, Landlord Issues)" },
  { value: "employment", label: "Employment Law" },
  { value: "civil_rights", label: "Civil Rights Violation" },
  { value: "public_benefits", label: "Public Benefits (Social Security, Disability)" },
  { value: "immigration", label: "Immigration Law" },
  { value: "other", label: "Other" },
];

export default function LegalAidReferralPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [caseSummary, setCaseSummary] = useState("");
  const [helpNeeded, setHelpNeeded] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleConceptualSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      toast({
        title: "Referral Information Not Sent (Conceptual)",
        description: "This is a conceptual form. In a fully implemented system, your information might be used to help pre-fill an intake form for a legal aid provider or guide you to a specific referral service. For now, please use the links above to find legal aid.",
        duration: 8000,
      });
      // Reset form (optional)
      // setName(""); setEmail(""); setPhone(""); setCaseSummary(""); setHelpNeeded("");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <LifeBuoy className="w-7 h-7 text-primary" /> Legal Aid & Referral Information
          </CardTitle>
          <CardDescription>
            Find resources for legal aid and understand how to prepare for contacting them. This tool does not directly connect you with lawyers or guarantee representation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="default" className="border-accent bg-accent/10">
            <Info className="h-5 w-5 text-accent" />
            <AlertTitle className="font-semibold text-accent">What is Legal Aid?</AlertTitle>
            <AlertDescription>
              Legal aid organizations provide free or low-cost legal services to individuals who cannot afford to hire a private attorney. Eligibility is often based on income, case type, and local resources. They handle various types of cases, including civil, criminal (public defenders), and family law matters.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Find Legal Aid Resources</CardTitle>
              <CardDescription>Explore these national directories to find legal aid providers in your area.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {LEGAL_AID_RESOURCES.map(resource => (
                <div key={resource.name} className="p-3 border rounded-md hover:shadow-sm">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline flex items-center gap-1">
                    {resource.name} <LinkIcon className="w-4 h-4" />
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preparing to Contact Legal Aid</CardTitle>
              <CardDescription>Having this information ready can help streamline the intake process.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Your full name, contact information, and date of birth.</li>
                <li>Details about your income and household size (for eligibility).</li>
                <li>A brief summary of your legal problem, including important dates, locations, and names of other parties involved.</li>
                <li>Any relevant documents (e.g., court papers, notices, leases, contracts, police reports). Have them organized and ready to discuss.</li>
                <li>Any upcoming deadlines or court dates.</li>
                <li>Specific questions you have for the legal aid provider.</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-destructive"/> Conceptual Referral Information Form</CardTitle>
              <CardDescription>
                This form is a **conceptual placeholder**. Submitting it does not send your information to any legal aid provider. In a full system, this *could* help pre-fill information for an intake process.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleConceptualSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="referralName">Full Name</Label>
                    <Input id="referralName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Full Name" />
                  </div>
                  <div>
                    <Label htmlFor="referralEmail">Email Address</Label>
                    <Input id="referralEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="referralPhone">Phone Number (Optional)</Label>
                  <Input id="referralPhone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
                </div>
                <div>
                  <Label htmlFor="referralHelpNeeded">Type of Help Needed</Label>
                  <Select value={helpNeeded} onValueChange={setHelpNeeded}>
                    <SelectTrigger id="referralHelpNeeded">
                      <SelectValue placeholder="Select the type of legal help..." />
                    </SelectTrigger>
                    <SelectContent>
                      {HELP_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="referralCaseSummary">Brief Case Summary (Confidential - Conceptual)</Label>
                  <Textarea
                    id="referralCaseSummary"
                    value={caseSummary}
                    onChange={(e) => setCaseSummary(e.target.value)}
                    placeholder="Briefly describe your legal issue. Avoid highly sensitive details in this conceptual form."
                    rows={5}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" variant="outline" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : <><Send className="mr-2 h-4 w-4"/>Submit Conceptual Request</>}
                </Button>
              </CardFooter>
            </form>
          </Card>

        </CardContent>
        <CardFooter>
           <p className="text-xs text-muted-foreground">
              <strong>Disclaimer:</strong> DUE PROCESS AI is an informational tool and does not provide legal advice or representation. This page offers general resources and conceptual tools. We are not affiliated with any legal aid provider, and using this page does not create an attorney-client relationship. Always contact legal aid organizations directly to inquire about their services and eligibility.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
