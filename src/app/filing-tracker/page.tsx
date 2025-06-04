
// src/app/filing-tracker/page.tsx
"use client";

import { useState, type FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList, Trash2, Info, AlertTriangle, Edit3 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const LOCAL_STORAGE_KEY_FILINGS = "dueProcessAIFilingTrackerData";
const LOCAL_STORAGE_KEY_CASE_ANALYSIS = "dueProcessAICaseAnalysisData";


interface FilingEntry {
  id: string;
  documentTitle: string;
  filingDate: string;
  courtAgency: string;
  caseNumber?: string;
  status: "Drafting" | "Ready to File" | "Submitted - Awaiting Confirmation" | "Filed - Accepted" | "Filed - Rejected" | "Requires Action" | "Other";
  confirmationNumber?: string;
  notes?: string;
  loggedAt: string;
}

interface StoredCaseData {
  caseDetails: string;
  caseCategory: "general" | "criminal" | "civil";
}


export default function FilingTrackerPage() {
  const [filings, setFilings] = useState<FilingEntry[]>([]);
  const [currentDocumentTitle, setCurrentDocumentTitle] = useState("");
  const [currentFilingDate, setCurrentFilingDate] = useState("");
  const [currentCourtAgency, setCurrentCourtAgency] = useState("");
  const [currentCaseNumber, setCurrentCaseNumber] = useState("");
  const [currentStatus, setCurrentStatus] = useState<FilingEntry['status'] | "">("");
  const [currentConfirmationNumber, setCurrentConfirmationNumber] = useState("");
  const [currentNotes, setCurrentNotes] = useState("");
  
  const [isEditing, setIsEditing] = useState<string | null>(null); // Stores ID of filing being edited
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storedCaseSummary, setStoredCaseSummary] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedFilings = localStorage.getItem(LOCAL_STORAGE_KEY_FILINGS);
      if (storedFilings) {
        setFilings(JSON.parse(storedFilings));
      }
      const caseDataString = localStorage.getItem(LOCAL_STORAGE_KEY_CASE_ANALYSIS);
      if (caseDataString) {
        const caseData: StoredCaseData = JSON.parse(caseDataString);
        setStoredCaseSummary(caseData.caseDetails);
         if (caseData.caseCategory === "criminal" && !currentCourtAgency.toLowerCase().includes("criminal court")) {
            // Pre-fill court type if criminal case from case analysis, if not already set
            // This is a simple example, real logic would be more complex
        }
      }
    } catch (e) {
      console.error("Failed to load data from localStorage", e);
      toast({ title: "Error loading data", description: "Could not load saved filing entries.", variant: "destructive"});
    }
  }, [toast]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_FILINGS, JSON.stringify(filings));
    } catch (e) {
      console.error("Failed to save filings to localStorage", e);
      toast({ title: "Error saving data", description: "Could not save filing entries to your browser.", variant: "destructive"});
    }
  }, [filings, toast]);

  const resetForm = () => {
    setCurrentDocumentTitle("");
    setCurrentFilingDate("");
    setCurrentCourtAgency("");
    setCurrentCaseNumber("");
    setCurrentStatus("");
    setCurrentConfirmationNumber("");
    setCurrentNotes("");
    setIsEditing(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentDocumentTitle.trim() || !currentFilingDate || !currentCourtAgency.trim() || !currentStatus) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in Document Title, Filing Date, Court/Agency, and Status.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    const newFilingEntry: FilingEntry = {
      id: isEditing || Date.now().toString(),
      documentTitle: currentDocumentTitle,
      filingDate: currentFilingDate,
      courtAgency: currentCourtAgency,
      caseNumber: currentCaseNumber,
      status: currentStatus as FilingEntry['status'],
      confirmationNumber: currentConfirmationNumber,
      notes: currentNotes,
      loggedAt: new Date().toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    if (isEditing) {
      setFilings(filings.map(f => f.id === isEditing ? newFilingEntry : f).sort((a, b) => new Date(b.filingDate).getTime() - new Date(a.filingDate).getTime()));
      toast({ title: "Filing Updated", description: `"${newFilingEntry.documentTitle}" has been updated.` });
    } else {
      setFilings(prevFilings => [...prevFilings, newFilingEntry].sort((a, b) => new Date(b.filingDate).getTime() - new Date(a.filingDate).getTime()));
      toast({ title: "Filing Logged", description: `"${newFilingEntry.documentTitle}" has been added to your tracker.` });
    }
    
    resetForm();
    setIsSubmitting(false);
  };

  const handleEdit = (filing: FilingEntry) => {
    setIsEditing(filing.id);
    setCurrentDocumentTitle(filing.documentTitle);
    setCurrentFilingDate(filing.filingDate);
    setCurrentCourtAgency(filing.courtAgency);
    setCurrentCaseNumber(filing.caseNumber || "");
    setCurrentStatus(filing.status);
    setCurrentConfirmationNumber(filing.confirmationNumber || "");
    setCurrentNotes(filing.notes || "");
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to see form
  };

  const handleDelete = (id: string) => {
    setFilings(filings.filter(f => f.id !== id));
    toast({ title: "Filing Deleted", description: "The filing entry has been removed.", variant: "destructive" });
    if (isEditing === id) resetForm(); // Reset form if deleting the item being edited
  };
  
  const getStatusBadgeVariant = (status: FilingEntry['status']) => {
    switch (status) {
      case 'Filed - Accepted': return 'default'; // bg-primary
      case 'Filed - Rejected': return 'destructive';
      case 'Submitted - Awaiting Confirmation': return 'secondary';
      case 'Requires Action': return 'outline'; // Consider a more warning-like variant if available
      default: return 'secondary';
    }
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-primary" /> Court Filing Tracker
          </CardTitle>
          <CardDescription>
            Manually log and track the status of your court filings. This tool helps you keep records of what you've filed, when, and its outcome.
            Data is stored locally in your browser.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {storedCaseSummary && (
                <Card className="bg-muted/50 mb-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2"><Info className="w-5 h-5 text-muted-foreground" />Current Case Context</CardTitle>
                    <CardDescription className="text-xs">This summary was entered in the Case Analysis section. It may be relevant for describing your filings.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={storedCaseSummary}
                      readOnly
                      rows={2}
                      className="text-sm bg-background cursor-default h-auto"
                      aria-label="Stored case summary context"
                    />
                  </CardContent>
                </Card>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="documentTitleInput">Document Title*</Label>
                <Input id="documentTitleInput" value={currentDocumentTitle} onChange={e => setCurrentDocumentTitle(e.target.value)} placeholder="e.g., Motion to Dismiss, Answer to Complaint" required />
              </div>
              <div>
                <Label htmlFor="filingDateInput">Filing Date*</Label>
                <Input id="filingDateInput" type="date" value={currentFilingDate} onChange={e => setCurrentFilingDate(e.target.value)} required />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="courtAgencyInput">Court / Agency*</Label>
                <Input id="courtAgencyInput" value={currentCourtAgency} onChange={e => setCurrentCourtAgency(e.target.value)} placeholder="e.g., Superior Court of CA, County of LA" required />
              </div>
              <div>
                <Label htmlFor="caseNumberInput">Case Number (Optional)</Label>
                <Input id="caseNumberInput" value={currentCaseNumber} onChange={e => setCurrentCaseNumber(e.target.value)} placeholder="e.g., 23STCV12345" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="statusSelect">Status*</Label>
                <Select onValueChange={(value) => setCurrentStatus(value as FilingEntry['status'] | "")} value={currentStatus} required>
                  <SelectTrigger id="statusSelect"><SelectValue placeholder="Select status..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Drafting">Drafting</SelectItem>
                    <SelectItem value="Ready to File">Ready to File</SelectItem>
                    <SelectItem value="Submitted - Awaiting Confirmation">Submitted - Awaiting Confirmation</SelectItem>
                    <SelectItem value="Filed - Accepted">Filed - Accepted</SelectItem>
                    <SelectItem value="Filed - Rejected">Filed - Rejected</SelectItem>
                    <SelectItem value="Requires Action">Requires Action</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="confirmationNumberInput">Confirmation/NEF Number (Optional)</Label>
                <Input id="confirmationNumberInput" value={currentConfirmationNumber} onChange={e => setCurrentConfirmationNumber(e.target.value)} placeholder="e.g., ECF No. 123, NEF ID XXXXX" />
              </div>
            </div>
            <div>
              <Label htmlFor="notesTextarea">Notes (Optional)</Label>
              <Textarea id="notesTextarea" value={currentNotes} onChange={e => setCurrentNotes(e.target.value)} placeholder="Add any relevant details, reasons for rejection, next steps, etc." rows={3} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? (isSubmitting ? "Updating..." : "Update Filing Entry") : (isSubmitting ? "Logging..." : "Log Filing Entry")}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
                Cancel Edit
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>

      {filings.length > 0 && (
        <Card className="shadow-md mt-6">
          <CardHeader>
            <CardTitle>Logged Filings</CardTitle>
            <CardDescription>Review and manage your logged court filings below, sorted by filing date (most recent first).</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-3">
              <ul className="space-y-4">
                {filings.map(filing => (
                  <li key={filing.id} className="border p-4 rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-grow min-w-0">
                        <h4 className="font-semibold text-md truncate" title={filing.documentTitle}>{filing.documentTitle}</h4>
                        <p className="text-sm text-muted-foreground">
                          Filed: {new Date(filing.filingDate).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })} | Court: {filing.courtAgency}
                        </p>
                        {filing.caseNumber && <p className="text-xs text-muted-foreground">Case #: {filing.caseNumber}</p>}
                         <p className="text-xs text-muted-foreground">
                            Status: <Badge variant={getStatusBadgeVariant(filing.status)} className="text-xs">{filing.status}</Badge>
                         </p>
                        {filing.confirmationNumber && <p className="text-xs text-muted-foreground">Conf/NEF #: {filing.confirmationNumber}</p>}
                         <p className="text-xs text-muted-foreground">Logged: {filing.loggedAt}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-1 flex-shrink-0">
                        <Button variant="outline" size="sm" className="h-7 px-2 py-1 text-xs" onClick={() => handleEdit(filing)} aria-label={`Edit filing: ${filing.documentTitle}`}>
                          <Edit3 className="w-3 h-3 mr-1" /> Edit
                        </Button>
                        <AlertDialog>
                           <AlertDialogTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/90" aria-label={`Delete filing: ${filing.documentTitle}`}>
                               <Trash2 className="w-4 h-4" />
                             </Button>
                           </AlertDialogTrigger>
                           <AlertDialogContent>
                             <AlertDialogHeader><AlertDialogTitle>Confirm Deletion</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete the filing entry "{filing.documentTitle}"? This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                             <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(filing.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
                           </AlertDialogContent>
                         </AlertDialog>
                      </div>
                    </div>
                    {filing.notes && (
                      <p className="text-sm mt-2 pt-2 border-t text-foreground/80 whitespace-pre-line">
                        <strong>Notes:</strong> {filing.notes}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
           {filings.length > 0 && (
                <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => {
                        setFilings([]);
                        resetForm(); // Also clear form if editing
                        toast({ title: "All Filings Cleared", description: "All filing entries have been cleared.", variant: "destructive" });
                    }}
                    aria-label="Clear all filing entries"
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Clear All Filing Entries
                    </Button>
                </CardFooter>
            )}
        </Card>
      )}

      <Alert variant="default" className="mt-6 border-accent bg-accent/10">
        <AlertTriangle className="h-5 w-5 text-accent" />
        <AlertTitle className="font-semibold text-accent">Important Note & Disclaimer</AlertTitle>
        <AlertDescription>
          This Filing Tracker is a manual organizational tool. It does not connect to any court e-filing system and does not provide legal advice.
          Automatic email parsing and AI-powered document analysis for approval/rejection are complex features envisioned for the future and are not part of this current tool.
          Always verify filing statuses and deadlines directly with the relevant court or agency.
        </AlertDescription>
      </Alert>
    </div>
  );
}
