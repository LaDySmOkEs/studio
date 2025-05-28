// src/app/rights-recorder/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Square, ListChecks, Trash2, PlayCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
  useEffect(() => {
    // For demo purposes, load mock recordings if no recordings exist (e.g. after a delete all)
    if (recordings.length === 0 && MOCK_RECORDINGS.length > 0 && !localStorage.getItem("hasLoadedOnce")) {
        setRecordings(MOCK_RECORDINGS);
        localStorage.setItem("hasLoadedOnce", "true"); // Ensure mock data is loaded only once per session typically
    }
  }, []); // Empty dependency array to run once on mount.

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      let seconds = 0;
      setCurrentTime("00:00"); // Reset timer at start
      interval = setInterval(() => {
        seconds++;
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        setCurrentTime(`${min}:${sec}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setNotes(""); 
    const defaultTitle = `Recording - ${new Date().toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
    setRecordingTitle(defaultTitle);
    toast({
      title: "Recording Started",
      description: "Remember to state you are recording if required by law.",
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
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                <label htmlFor="recording-title" className="block text-sm font-medium text-foreground mb-1">Recording Title</label>
                <Input 
                  id="recording-title"
                  type="text" 
                  value={recordingTitle} 
                  onChange={(e) => setRecordingTitle(e.target.value)}
                  placeholder="Enter a title for your recording"
                  className="bg-background"
                />
              </div>
            )}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-1">Notes</label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isRecording ? "Enter any relevant details, observations, badge numbers, etc. during your recording..." : "Notes will be enabled when you start a recording, or you can add notes to a saved recording later."}
                rows={8}
                className="resize-none"
                disabled={!isRecording && notes === ""} 
              />
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Disclaimer: Ensure you are legally permitted to record in your jurisdiction. This tool does not provide legal advice. All recordings and notes are stored locally in your browser and are not uploaded to any server.
            </p>
          </CardFooter>
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
                        <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Play recording (placeholder)" onClick={() => toast({ title: "Playback Not Implemented", description: "This is a placeholder for actual audio playback."})}>
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
                }}>
                    <Trash2 className="mr-2 h-4 w-4" /> Clear All Recordings
                </Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
