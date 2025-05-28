
// src/app/trauma-log/page.tsx
"use client";

import { useState, type FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { NotebookPen, Trash2, Eye, AlertTriangle, BookHeart, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const LOCAL_STORAGE_KEY = "dueProcessAICaseAnalysisData";

interface StoredCaseData {
  caseDetails: string;
  caseCategory: "general" | "criminal" | "civil";
}

interface LogEntry {
  id: string;
  title: string;
  content: string;
  date: string;
}

export default function TraumaLogPage() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [viewingEntry, setViewingEntry] = useState<LogEntry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storedCaseSummary, setStoredCaseSummary] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    // Load stored case summary from localStorage
    try {
      const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedDataString) {
        const storedData: StoredCaseData = JSON.parse(storedDataString);
        setStoredCaseSummary(storedData.caseDetails);
      }
    } catch (e) {
      console.error("Failed to load or parse case data from localStorage", e);
    }
  }, []);


  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentContent.trim()) {
      toast({
        title: "Content Required",
        description: "Please write something in your log entry.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    const newEntry: LogEntry = {
      id: Date.now().toString(),
      title: currentTitle.trim() || "Untitled Entry",
      content: currentContent,
      date: new Date().toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    setEntries(prevEntries => [newEntry, ...prevEntries]);
    setCurrentTitle("");
    setCurrentContent("");
    toast({
      title: "Entry Saved",
      description: "Your log entry has been added.",
    });
    setIsSubmitting(false);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
    toast({
      title: "Entry Deleted",
      description: "The log entry has been removed.",
      variant: "destructive",
    });
  };

  const getShortContent = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BookHeart className="w-7 h-7 text-primary" /> Trauma Log
            </CardTitle>
            <CardDescription>
              A private space to chronicle emotional and psychological experiences related to your legal issues.
              Your entries are stored locally in your browser and are cleared when you refresh or close the page. No data is sent to any server.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
             {storedCaseSummary && (
                <Card className="bg-muted/50 mb-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2"><Info className="w-5 h-5 text-muted-foreground" />Current Case Context</CardTitle>
                    <CardDescription className="text-xs">This summary was entered in the Case Analysis section. It may provide context for your log entries.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={storedCaseSummary}
                      readOnly
                      rows={2}
                      className="text-sm bg-background cursor-default h-auto"
                      aria-label="Stored case summary from case analysis"
                    />
                  </CardContent>
                </Card>
              )}
              <div>
                <Label htmlFor="entryTitleInput">Entry Title (Optional)</Label>
                <Input
                  id="entryTitleInput"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  placeholder="e.g., Reflections on today's events, Feelings about the upcoming hearing"
                  aria-label="Entry title"
                />
              </div>
              <div>
                <Label htmlFor="entryContentTextarea">Log Entry*</Label>
                <Textarea
                  id="entryContentTextarea"
                  value={currentContent}
                  onChange={(e) => setCurrentContent(e.target.value)}
                  placeholder="Write about your experiences, feelings, and any details you want to remember..."
                  rows={10}
                  required
                  className="resize-none"
                  aria-label="Log entry content"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Entry"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {entries.length > 0 && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Your Log Entries</CardTitle>
              <CardDescription>Review and manage your saved entries below.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-3">
                <ul className="space-y-4">
                  {entries.map(entry => (
                    <li key={entry.id} className="border p-4 rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-md">{entry.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            Date: {entry.date}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" onClick={() => setViewingEntry(entry)} aria-label={`View entry: ${entry.title}`}>
                            <Eye className="w-4 h-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">View</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" aria-label={`Delete entry: ${entry.title}`}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this log entry.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteEntry(entry.id)} className="bg-destructive hover:bg-destructive/90">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <p className="text-sm mt-2 pt-2 border-t text-foreground/80 whitespace-pre-line">
                        {getShortContent(entry.content)}
                      </p>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
             {entries.length > 0 && (
                <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => {
                        setEntries([]);
                        toast({ title: "All Entries Cleared", description: "All log entries have been cleared.", variant: "destructive" });
                    }}
                    aria-label="Clear all trauma log entries"
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Clear All Entries
                    </Button>
                </CardFooter>
            )}
          </Card>
        )}
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-md sticky top-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <NotebookPen className="w-6 h-6 text-accent" /> Important Considerations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold text-primary">Purpose of a Trauma Log</h4>
              <p className="text-muted-foreground">
                Documenting your emotional and psychological experiences can be a helpful way to process events and recall details later. In some legal contexts, such contemporaneous notes might be relevant.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary">Potential Use</h4>
              <p className="text-muted-foreground">
                In cases involving emotional distress, harassment, domestic violence, or assault, a consistent log can sometimes help illustrate patterns of behavior, the impact of events, or recall specific incidents and dates.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary">Privacy & Admissibility</h4>
              <p className="text-muted-foreground">
                Remember that the legal admissibility of personal logs varies greatly by jurisdiction and case specifics. What you write could potentially be discoverable in legal proceedings.
              </p>
            </div>
             <Alert variant="default" className="border-accent bg-accent/10">
                <AlertTriangle className="h-4 w-4 text-accent" />
                <AlertTitle className="font-semibold">Disclaimer</AlertTitle>
                <AlertDescription>
                  This tool is for personal documentation and does not constitute legal advice. Always consult with a qualified attorney regarding your specific situation and how any personal records might be used.
                  <br /><strong>Entries are stored only in your browser and are lost on refresh.</strong>
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {viewingEntry && (
        <AlertDialog open={!!viewingEntry} onOpenChange={() => setViewingEntry(null)}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>{viewingEntry.title}</AlertDialogTitle>
              <AlertDialogDescription>
                Date: {viewingEntry.date}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <p className="whitespace-pre-line text-sm py-4">{viewingEntry.content}</p>
            </ScrollArea>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setViewingEntry(null)}>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
    
