
// src/app/legal-library/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Library, Search, Filter, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const JURISDICTIONS = [
  { value: "federal", label: "Federal" },
  { value: "ca", label: "California" },
  { value: "tx", label: "Texas" },
  { value: "ny", label: "New York" },
  // Add more states as needed
];

const LEGAL_ISSUE_AREAS = [
  { value: "civil_rights", label: "Civil Rights" },
  { value: "criminal_law", label: "Criminal Law" },
  { value: "family_law", label: "Family Law" },
  { value: "contract_law", label: "Contract Law" },
  { value: "due_process", label: "Due Process" },
  // Add more areas as needed
];

export default function LegalLibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("");
  const [selectedLegalIssue, setSelectedLegalIssue] = useState("");
  const { toast } = useToast();

  const handleSearch = () => {
    toast({
      title: "Search (Conceptual)",
      description: `This is a conceptual search. In a full system, searching for "${searchTerm}" with selected filters would query a legal database.`,
      duration: 5000,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Library className="w-7 h-7 text-primary" />
            Legal Library (Conceptual Searchable Reference)
          </CardTitle>
          <CardDescription>
            Access a conceptual library of federal statutes, state codes, case law summaries, templates, and guides.
            This feature is a placeholder to demonstrate how a searchable legal library might function. No actual legal database is connected.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search statutes, case law, topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
                aria-label="Search legal library"
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" /> Search Library
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="jurisdiction-filter" className="block text-sm font-medium text-muted-foreground mb-1">
                <Filter className="inline h-4 w-4 mr-1" />Filter by Jurisdiction (Conceptual)
              </label>
              <Select onValueChange={setSelectedJurisdiction} value={selectedJurisdiction}>
                <SelectTrigger id="jurisdiction-filter" aria-label="Filter by jurisdiction">
                  <SelectValue placeholder="Select Jurisdiction..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Jurisdictions</SelectItem>
                  {JURISDICTIONS.map(j => <SelectItem key={j.value} value={j.value}>{j.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="issue-filter" className="block text-sm font-medium text-muted-foreground mb-1">
                <Filter className="inline h-4 w-4 mr-1" />Filter by Legal Issue (Conceptual)
              </label>
              <Select onValueChange={setSelectedLegalIssue} value={selectedLegalIssue}>
                <SelectTrigger id="issue-filter" aria-label="Filter by legal issue">
                  <SelectValue placeholder="Select Legal Issue..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Legal Issues</SelectItem>
                  {LEGAL_ISSUE_AREAS.map(issue => <SelectItem key={issue.value} value={issue.value}>{issue.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Alert variant="default" className="border-accent bg-accent/10">
            <AlertTriangle className="h-5 w-5 text-accent" />
            <AlertTitle className="font-semibold text-accent">Conceptual Feature</AlertTitle>
            <AlertDescription>
              This Legal Library is for demonstration purposes only. The search and filter functions are placeholders and do not query a live legal database.
              In a fully implemented system, this section would provide access to actual legal texts and resources. Always consult official sources and legal professionals for definitive legal information.
            </AlertDescription>
          </Alert>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold">Available Resources (Conceptual Examples):</h3>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1 text-sm">
              <li>Federal Statutes (e.g., United States Code - U.S.C.)</li>
              <li>State Codes (e.g., California Penal Code, New York Civil Practice Law & Rules)</li>
              <li>Summaries of Landmark Case Law (e.g., Miranda v. Arizona, Goldberg v. Kelly)</li>
              <li>Templates for common legal filings (linked from Document Generator)</li>
              <li>Guides on specific legal procedures or rights</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
