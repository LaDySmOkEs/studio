
// src/app/legal-library/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Library, Search, Filter, AlertTriangle, ExternalLink, FileText as FileTextIcon, BookOpen as GuideIcon, Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const JURISDICTIONS_FILTER_OPTIONS = [
  { value: "all_jurisdictions", label: "All Jurisdictions" },
  { value: "federal", label: "Federal (US)" },
  { value: "ca", label: "California" },
  { value: "tx", label: "Texas" },
  { value: "ny", label: "New York" },
  { value: "all_states", label: "All States (General)"},
];

const LEGAL_ISSUE_AREAS_FILTER_OPTIONS = [
  { value: "all_issues", label: "All Legal Issues" },
  { value: "civil_rights", label: "Civil Rights" },
  { value: "criminal_law", label: "Criminal Law" },
  { value: "family_law", label: "Family Law" },
  { value: "contract_law", label: "Contract Law" },
  { value: "due_process", label: "Due Process" },
  { value: "public_records", label: "Public Records" },
  { value: "court_procedure", label: "Court Procedure" },
];

interface LegalResource {
  id: string;
  title: string;
  type: 'statute' | 'case_summary' | 'guide' | 'template_link' | 'external_resource';
  description: string;
  jurisdiction: string[];
  issueArea: string[];
  contentOrLink: string;
  isExternalLink: boolean;
  keywords?: string[];
}

const ALL_RESOURCES: LegalResource[] = [
  {
    id: "usc_1983",
    title: "42 U.S.C. § 1983 - Civil action for deprivation of rights",
    type: "statute",
    description: "Federal statute allowing individuals to sue state and local government officials for violations of their constitutional rights.",
    jurisdiction: ["federal"],
    issueArea: ["civil_rights", "due_process"],
    contentOrLink: "https://www.law.cornell.edu/uscode/text/42/1983",
    isExternalLink: true,
    keywords: ["section 1983", "civil rights", "constitutional rights", "state actor", "government misconduct"],
  },
  {
    id: "miranda_v_arizona",
    title: "Miranda v. Arizona (1966) - Summary",
    type: "case_summary",
    description: "Supreme Court case establishing that criminal suspects must be informed of their constitutional rights (Miranda rights) before custodial interrogation.",
    jurisdiction: ["federal"],
    issueArea: ["criminal_law", "due_process"],
    contentOrLink: "Key takeaways: Suspects must be informed of (1) their right to remain silent, (2) that anything they say can be used against them in court, (3) their right to an attorney, and (4) that if they cannot afford an attorney, one will be appointed for them prior to any questioning if they so desire.",
    isExternalLink: false,
    keywords: ["miranda rights", "self-incrimination", "right to counsel", "custodial interrogation", "fifth amendment", "sixth amendment"],
  },
  {
    id: "foia_guide_federal",
    title: "Guide to the Freedom of Information Act (FOIA - Federal)",
    type: "guide",
    description: "Information on how to make a FOIA request to obtain records from U.S. federal government agencies.",
    jurisdiction: ["federal"],
    issueArea: ["public_records", "civil_rights"],
    contentOrLink: "https://www.foia.gov/",
    isExternalLink: true,
    keywords: ["foia", "freedom of information", "public records", "government transparency", "federal agencies"],
  },
  {
    id: "pro_se_filing_tips",
    title: "Tips for Filing in Court Pro Se (Self-Represented)",
    type: "guide",
    description: "General guidance and considerations for individuals representing themselves in legal proceedings. Includes advice on understanding court rules, organizing documents, and courtroom etiquette.",
    jurisdiction: ["all_states"],
    issueArea: ["due_process", "court_procedure"],
    contentOrLink: "Always check your specific court's local rules. Be organized, respectful, and meet all deadlines. The Filing Assistant page in this app provides more detailed guidance on e-filing. Consider consulting with an attorney, even for limited advice.",
    isExternalLink: false,
    keywords: ["pro se", "self-representation", "court filing", "legal procedure", "litigation"],
  },
  {
    id: "complaint_template_link",
    title: "Complaint Template (via Document Generator)",
    type: "template_link",
    description: "Access a general complaint template in the Document Generator to help structure your initial court filing for civil cases.",
    jurisdiction: ["all_states"],
    issueArea: ["due_process", "court_procedure"],
    contentOrLink: "/document-generator?suggested=complaint",
    isExternalLink: false, 
    keywords: ["complaint", "lawsuit", "legal document", "template", "civil procedure"],
  },
  {
    id: "gideon_v_wainwright",
    title: "Gideon v. Wainwright (1963) - Summary",
    type: "case_summary",
    description: "Supreme Court case holding that the Sixth Amendment's guarantee of counsel is a fundamental right essential to a fair trial and applies to state courts through the Fourteenth Amendment. Requires states to provide defense attorneys to criminal defendants who cannot afford lawyers themselves.",
    jurisdiction: ["federal"],
    issueArea: ["criminal_law", "due_process", "civil_rights"],
    contentOrLink: "Key takeaway: Indigent defendants in felony criminal cases have a right to court-appointed counsel. This ensures a fair trial and access to justice regardless of financial status.",
    isExternalLink: false,
    keywords: ["right to counsel", "indigent defense", "sixth amendment", "fourteenth amendment", "criminal procedure", "fair trial"],
  },
  {
    id: "due_process_checklist_link",
    title: "Due Process Checklist (Internal App Tool)",
    type: "template_link", 
    description: "Use the app's Due Process Checklist to think through common procedural elements for various legal situations like criminal arraignments or administrative hearings.",
    jurisdiction: ["all_states"],
    issueArea: ["due_process", "criminal_law", "court_procedure"],
    contentOrLink: "/due-process-checklist",
    isExternalLink: false,
    keywords: ["due process", "checklist", "legal rights", "court procedure", "fairness"],
  },
];

const getResourceTypeIcon = (type: LegalResource['type']) => {
  switch (type) {
    case 'statute': return <FileTextIcon className="w-5 h-5 text-blue-500" />;
    case 'case_summary': return <FileTextIcon className="w-5 h-5 text-green-500" />;
    case 'guide': return <GuideIcon className="w-5 h-5 text-orange-500" />;
    case 'template_link': return <Link2 className="w-5 h-5 text-purple-500" />;
    case 'external_resource': return <ExternalLink className="w-5 h-5 text-gray-500" />;
    default: return <FileTextIcon className="w-5 h-5" />;
  }
};

export default function LegalLibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("");
  const [selectedLegalIssue, setSelectedLegalIssue] = useState("");
  const [filteredResources, setFilteredResources] = useState<LegalResource[]>(ALL_RESOURCES);

  const { toast } = useToast();

  const performSearchAndFilter = useMemo(() => {
    return () => {
      let resources = ALL_RESOURCES;
      const term = searchTerm.toLowerCase();

      if (term) {
        resources = resources.filter(res => 
          res.title.toLowerCase().includes(term) ||
          res.description.toLowerCase().includes(term) ||
          (res.keywords && res.keywords.some(kw => kw.toLowerCase().includes(term)))
        );
      }

      if (selectedJurisdiction && selectedJurisdiction !== "all_jurisdictions") {
        if (selectedJurisdiction === "all_states") {
          resources = resources.filter(res => res.jurisdiction.includes("all_states"));
        } else {
          resources = resources.filter(res => res.jurisdiction.includes(selectedJurisdiction) || res.jurisdiction.includes("all_states"));
        }
      }

      if (selectedLegalIssue && selectedLegalIssue !== "all_issues") {
        resources = resources.filter(res => res.issueArea.includes(selectedLegalIssue));
      }
      
      setFilteredResources(resources);
    };
  }, [searchTerm, selectedJurisdiction, selectedLegalIssue]);


  useEffect(() => {
    performSearchAndFilter();
  }, [searchTerm, selectedJurisdiction, selectedLegalIssue, performSearchAndFilter]);

  const handleSearchButtonClick = () => {
     performSearchAndFilter(); 
     toast({
      title: "Library Searched",
      description: `Displaying results for your query. Found ${filteredResources.length} item(s).`,
    });
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Library className="w-7 h-7 text-primary" />
            Legal Resource Library
          </CardTitle>
          <CardDescription>
            Access a curated library of statutes, case law summaries, guides, and templates.
            Search or filter by jurisdiction and legal issue. Note: This is a limited collection for demonstration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search title, description, keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
                aria-label="Search legal library"
              />
            </div>
            <Button onClick={handleSearchButtonClick}>
              <Search className="mr-2 h-4 w-4" /> Search Library
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="jurisdiction-filter" className="block text-sm font-medium text-muted-foreground mb-1">
                <Filter className="inline h-4 w-4 mr-1" />Filter by Jurisdiction
              </label>
              <Select onValueChange={setSelectedJurisdiction} value={selectedJurisdiction}>
                <SelectTrigger id="jurisdiction-filter" aria-label="Filter by jurisdiction">
                  <SelectValue placeholder="Select Jurisdiction..." />
                </SelectTrigger>
                <SelectContent>
                  {JURISDICTIONS_FILTER_OPTIONS.map(j => <SelectItem key={j.value} value={j.value}>{j.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="issue-filter" className="block text-sm font-medium text-muted-foreground mb-1">
                <Filter className="inline h-4 w-4 mr-1" />Filter by Legal Issue
              </label>
              <Select onValueChange={setSelectedLegalIssue} value={selectedLegalIssue}>
                <SelectTrigger id="issue-filter" aria-label="Filter by legal issue">
                  <SelectValue placeholder="Select Legal Issue..." />
                </SelectTrigger>
                <SelectContent>
                  {LEGAL_ISSUE_AREAS_FILTER_OPTIONS.map(issue => <SelectItem key={issue.value} value={issue.value}>{issue.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold">Library Resources ({filteredResources.length} found)</h3>
            {filteredResources.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredResources.map(resource => (
                  <Card key={resource.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-start gap-2">
                        {getResourceTypeIcon(resource.type)}
                        {resource.isExternalLink ? (
                          <a href={resource.contentOrLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {resource.title} <ExternalLink className="inline w-4 h-4 ml-1" />
                          </a>
                        ) : resource.type === 'template_link' ? (
                           <Link href={resource.contentOrLink} className="text-primary hover:underline">
                             {resource.title} <Link2 className="inline w-4 h-4 ml-1" />
                           </Link>
                        ) : (
                          resource.title
                        )}
                      </CardTitle>
                       <div className="text-xs space-x-1">
                        {resource.jurisdiction.map(j => {
                            const jurLabel = JURISDICTIONS_FILTER_OPTIONS.find(opt => opt.value === j)?.label || j;
                            return <Badge key={j} variant="secondary">{jurLabel}</Badge>
                        })}
                        {resource.issueArea.map(area => {
                             const areaLabel = LEGAL_ISSUE_AREAS_FILTER_OPTIONS.find(opt => opt.value === area)?.label || area;
                            return <Badge key={area} variant="outline">{areaLabel}</Badge>
                        })}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{resource.description}</p>
                      {!resource.isExternalLink && resource.type !== 'template_link' && (
                        <div className="mt-2 p-2 bg-muted/50 rounded text-xs text-foreground/80 whitespace-pre-wrap">
                          <strong>Content/Summary:</strong> {resource.contentOrLink}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No resources found matching your criteria. Try broadening your search or filters.</p>
            )}
          </div>

          <Alert variant="default" className="border-accent bg-accent/10">
            <AlertTriangle className="h-5 w-5 text-accent" />
            <AlertTitle className="font-semibold text-accent">Disclaimer</AlertTitle>
            <AlertDescription>
              This Legal Library provides a curated collection of resources for informational purposes only and is not exhaustive. It does not constitute legal advice. 
              Always consult official sources and qualified legal professionals for definitive legal information and guidance specific to your situation.
            </AlertDescription>
          </Alert>

        </CardContent>
      </Card>
    </div>
  );
}
    
