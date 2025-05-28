
// src/app/rights-recorder/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mic, Square, ListChecks, Trash2, PlayCircle, ShieldAlert, Info, Gavel } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const LOCAL_STORAGE_KEY = "dueProcessAICaseAnalysisData";

interface StoredCaseData {
  caseDetails: string;
  caseCategory: "general" | "criminal" | "civil";
}

interface Recording {
  id: string;
  title: string;
  date: string;
  duration: string;
  notesPreview: string;
  fullNotes: string; // Store full notes for potential future display/edit
}

const MOCK_RECORDINGS: Recording[] = [
  { id: "1", title: "Traffic Stop - Officer Smith", date: "2023-10-26", duration: "5:32", notesPreview: "Recorded interaction during a routine traffic stop. Badge number 123...", fullNotes: "Recorded interaction during a routine traffic stop. Badge number 123. Officer seemed agitated." },
  { id: "2", title: "Landlord Discussion - Entry Notice", date: "2023-11-15", duration: "12:15", notesPreview: "Discussion about notice of entry. Referenced lease clause 4.B...", fullNotes: "Discussion about notice of entry. Referenced lease clause 4.B. Landlord agreed to reschedule." },
  { id: "3", title: "Witness Interview - Jane Doe", date: "2024-01-05", duration: "25:40", notesPreview: "Interview notes regarding the incident on Elm Street...", fullNotes: "Interview notes regarding the incident on Elm Street. Witness saw a red car leaving the scene." },
];

export default function RightsRecorderPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [notes, setNotes] = useState("");
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("00:00");
  const [recordingTitle, setRecordingTitle] = useState("");
  const [storedCaseSummary, setStoredCaseSummary] = useState<string | null>(null);
  const { toast } = useToast();
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
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


    // For demo purposes, load mock recordings if no recordings exist (e.g. after a delete all)
    if (recordings.length === 0 && MOCK_RECORDINGS.length > 0 && !localStorage.getItem("hasLoadedOnceRightsRecorder")) {
        setRecordings(MOCK_RECORDINGS);
        localStorage.setItem("hasLoadedOnceRightsRecorder", "true"); // Ensure mock data is loaded only once per session typically
    }
  }, []); // Empty dependency to run once on mount for summary and mock data loading

  useEffect(() => {
    if (isRecording) {
      let seconds = 0;
      setCurrentTime("00:00"); // Reset timer at start
      timerIntervalRef.current = setInterval(() => {
        seconds++;
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        setCurrentTime(`${min}:${sec}`);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setNotes(""); 
    const defaultTitle = `Recording - ${new Date().toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
    setRecordingTitle(defaultTitle);
    toast({
      title: "Recording Started",
      description: "Remember to state you are recording if required by law. Review 'Know Your Rights' section.",
    });
    // Placeholder: Actual audio recording logic would start here
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Placeholder: Actual audio recording logic would stop here
    const newRecording: Recording = {
      id: String(Date.now()),
      title: recordingTitle.trim() || `Recording - ${new Date().toLocaleDateString()}`,
      date: new Date().toLocaleDateString(),
      duration: currentTime,
      notesPreview: notes.substring(0, 100) + (notes.length > 100 ? "..." : ""),
      fullNotes: notes,
    };
    setRecordings(prev => [newRecording, ...prev]);
    setRecordingTitle("");
    setNotes(""); // Clear notes after saving.
    setCurrentTime("00:00"); // Reset timer display
    toast({
      title: "Recording Saved",
      description: `"${newRecording.title}" has been added to your list.`,
    });
  };
  
  const handleDeleteRecording = (id: string) => {
    const recordingToDelete = recordings.find(rec => rec.id === id);
    setRecordings(prev => prev.filter(rec => rec.id !== id));
    toast({
      title: "Recording Deleted",
      description: `"${recordingToDelete?.title}" has been removed.`,
      variant: "destructive",
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2"><Mic className="w-6 h-6 text-primary" /> Rights Recorder</CardTitle>
            <CardDescription>
              Securely record interactions and document important details. (Audio recording is a placeholder feature).
              This tool does not provide legal advice.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {storedCaseSummary && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2"><Info className="w-5 h-5 text-muted-foreground" />Current Case Context</CardTitle>
                   <CardDescription className="text-xs">This summary was entered in the Case Analysis section. It may be relevant for your notes.</CardDescription>
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
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              {!isRecording ? (
                <Button onClick={handleStartRecording} className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                  <Mic className="mr-2 h-5 w-5" />
                  Start Recording
                </Button>
              ) : (
                <Button onClick={handleStopRecording} className="w-full sm:w-auto">
                  <Square className="mr-2 h-5 w-5" />
                  Stop Recording
                </Button>
              )}
              {isRecording && (
                <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
                  <Badge variant="destructive" className="animate-pulse">REC</Badge>
                  <span className="font-mono text-lg text-foreground">{currentTime}</span>
                </div>
              )}
            </div>
             {isRecording && (
              <div>
                <Label htmlFor="recording-title-input">Recording Title</Label>
                <Input 
                  id="recording-title-input"
                  type="text" 
                  value={recordingTitle} 
                  onChange={(e) => setRecordingTitle(e.target.value)}
                  placeholder="Enter a title for your recording"
                  className="bg-background"
                  aria-label="Recording title"
                />
              </div>
            )}
            <div>
              <Label htmlFor="notes-textarea">Notes</Label>
              <Textarea
                id="notes-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isRecording ? "Enter any relevant details, observations, badge numbers, etc. during your recording..." : "Notes will be enabled when you start a recording, or you can add notes to a saved recording later."}
                rows={8}
                className="resize-none"
                disabled={!isRecording && notes === ""} 
                aria-label="Recording notes"
              />
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Disclaimer: Ensure you are legally permitted to record in your jurisdiction. This tool does not provide legal advice. All recordings and notes are stored locally in your browser and are not uploaded to any server for this prototype.
            </p>
          </CardFooter>
        </Card>

        <Card className="shadow-md border-accent">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent">
                    <ShieldAlert className="w-6 h-6" /> Know Your Rights (U.S. Context)
                </CardTitle>
                <CardDescription>
                    General information about rights during interactions and legal proceedings. This is not legal advice.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div>
                    <h4 className="font-semibold">Right to Remain Silent (Miranda Rights)</h4>
                    <p className="text-muted-foreground">
                        If you are taken into custody and questioned, you have the right to remain silent. Anything you say can be used against you in court. You typically must clearly state you are invoking this right.
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold">Right to an Attorney (Miranda Rights)</h4>
                    <p className="text-muted-foreground">
                        If you are in custody and being interrogated, you have the right to an attorney. If you cannot afford one, an attorney will be appointed for you before any questioning if you wish. You must clearly state you want an attorney.
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold">Consenting to Searches</h4>
                    <p className="text-muted-foreground">
                        You have the right to refuse consent to a search of yourself, your car, or your home if law enforcement does not have a warrant or probable cause for a warrantless search.
                    </p>
                </div>

                <div className="pt-2">
                  <h3 className="text-md font-semibold mt-2 mb-1 text-primary flex items-center gap-2">
                    <Gavel className="w-5 h-5"/> Understanding Due Process
                  </h3>
                  <p className="text-muted-foreground">
                    The 5th and 14th Amendments to the U.S. Constitution guarantee "due process of law." This generally means the government must follow fair procedures and respect your legal rights before depriving you of life, liberty, or property.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Due Process in Criminal Proceedings</h4>
                  <p className="text-muted-foreground">
                    In criminal cases, due process includes rights like: timely notice of charges, the right to a fair and public trial by an impartial jury, the right to confront and cross-examine witnesses, the right to present evidence, the right to counsel, and protection against self-incrimination. Speedy trial rights also fall under this umbrella, ensuring the government doesn't indefinitely delay prosecution.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Due Process in Civil Proceedings</h4>
                  <p className="text-muted-foreground">
                    In civil lawsuits, due process typically ensures adequate notice of the lawsuit and an opportunity to be heard (present your case and evidence) before a neutral decision-maker. This applies to disputes between private parties or between individuals and the government in non-criminal matters.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Due Process in Administrative Proceedings</h4>
                  <p className="text-muted-foreground">
                    When government agencies make decisions that affect individual rights (e.g., revoking a license, denying benefits), due process usually requires notice of the proposed action and some form of hearing or opportunity to present your side before a final decision. The formality of these proceedings can vary.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mt-2">Jurisdictional Differences & Professional Advice</h4>
                  <p className="text-muted-foreground">
                    The specific application and interpretation of due process rights can vary significantly between federal law and different state laws, and depend heavily on the specific circumstances of a case. The information provided here is general in nature and for educational purposes.
                  </p>
                </div>
                 <Alert variant="default" className="bg-accent/10 border-accent/50 mt-4">
                    <Info className="h-4 w-4 text-accent" />
                    <AlertTitle className="text-accent">Crucial Note</AlertTitle>
                    <AlertDescription>
                    Laws are complex and vary by jurisdiction and the specifics of your situation. This information is not a substitute for legal advice from a qualified attorney. If you are unsure of your rights or facing a legal issue, always consult with a lawyer.
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
      </div>

      <Card className="shadow-md lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-accent" />
            Past Recordings
          </CardTitle>
          <CardDescription>Review your saved recordings and notes.</CardDescription>
        </CardHeader>
        <CardContent>
          {recordings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No recordings yet. Start a new recording to add one.</p>
          ) : (
            <ScrollArea className="h-[400px] pr-2">
              <ul className="space-y-3">
                {recordings.map((rec) => (
                  <li key={rec.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-grow min-w-0"> {/* Added for better truncation */}
                        <h4 className="font-semibold text-sm truncate" title={rec.title}>{rec.title}</h4>
                        <p className="text-xs text-muted-foreground">{rec.date} - {rec.duration}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Play recording ${rec.title} (placeholder)`} onClick={() => toast({ title: "Playback Not Implemented", description: "This is a placeholder for actual audio playback."})}>
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/90" aria-label={`Delete recording ${rec.title}`} onClick={() => handleDeleteRecording(rec.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs mt-1 text-muted-foreground truncate" title={rec.fullNotes}>{rec.notesPreview}</p>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </CardContent>
         {recordings.length > 0 && (
            <CardFooter>
                <Button variant="outline" size="sm" className="w-full" onClick={() => {
                    setRecordings([]);
                    toast({ title: "All Recordings Deleted", description: "All recordings have been cleared.", variant: "destructive" });
                }}
                aria-label="Clear all recordings"
                >
                    <Trash2 className="mr-2 h-4 w-4" /> Clear All Recordings
                </Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
    
