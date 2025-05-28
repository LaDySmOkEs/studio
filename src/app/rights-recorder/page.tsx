// src/app/rights-recorder/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Square, ListChecks, Trash2, PlayCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Recording {
  id: string;
  title: string;
  date: string;
  duration: string;
  notesPreview: string;
}

const MOCK_RECORDINGS: Recording[] = [
  { id: "1", title: "Traffic Stop - Officer Smith", date: "2023-10-26", duration: "5:32", notesPreview: "Recorded interaction during a routine traffic stop. Badge number 123..." },
  { id: "2", title: "Landlord Discussion - Entry Notice", date: "2023-11-15", duration: "12:15", notesPreview: "Discussion about notice of entry. Referenced lease clause 4.B..." },
  { id: "3", title: "Witness Interview - Jane Doe", date: "2024-01-05", duration: "25:40", notesPreview: "Interview notes regarding the incident on Elm Street..." },
];

export default function RightsRecorderPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [notes, setNotes] = useState("");
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("00:00");
  const [recordingTitle, setRecordingTitle] = useState("");
  
  // Effect to load mock recordings on mount
  useEffect(() => {
    setRecordings(MOCK_RECORDINGS);
  }, []);

  // Effect to simulate recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      let seconds = 0;
      interval = setInterval(() => {
        seconds++;
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        setCurrentTime(`${min}:${sec}`);
      }, 1000);
    } else {
      setCurrentTime("00:00");
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setNotes(""); // Clear notes for new recording
    setRecordingTitle(`Recording - ${new Date().toLocaleString()}`);
    // Placeholder: Actual audio recording logic would start here
    // e.g., navigator.mediaDevices.getUserMedia({ audio: true }).then(...)
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Placeholder: Actual audio recording logic would stop here
    // Add the new recording to the list (mock for now)
    const newRecording: Recording = {
      id: String(Date.now()),
      title: recordingTitle || `Recording - ${new Date().toLocaleDateString()}`,
      date: new Date().toLocaleDateString(),
      duration: currentTime,
      notesPreview: notes.substring(0, 100) + (notes.length > 100 ? "..." : ""),
    };
    setRecordings(prev => [newRecording, ...prev]);
    setRecordingTitle("");
    // Notes are already in `notes` state
  };
  
  const handleDeleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(rec => rec.id !== id));
    // Add toast notification
  };


  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Rights Recorder</CardTitle>
            <CardDescription>
              Securely record interactions and document important details. Your recordings and notes are stored locally. (Audio recording is a placeholder feature).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {!isRecording ? (
                <Button onClick={handleStartRecording} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white">
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
                <label htmlFor="recording-title" className="block text-sm font-medium text-foreground mb-1">Recording Title (Optional)</label>
                <input 
                  id="recording-title"
                  type="text" 
                  value={recordingTitle} 
                  onChange={(e) => setRecordingTitle(e.target.value)}
                  placeholder={`Recording - ${new Date().toLocaleString()}`}
                  className="w-full p-2 border rounded-md bg-background"
                />
              </div>
            )}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-1">Notes</label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any relevant details, observations, badge numbers, etc."
                rows={8}
                className="resize-none"
                disabled={!isRecording && recordings.length === 0 && notes === ""} 
              />
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Ensure you are legally permitted to record in your jurisdiction. This tool does not provide legal advice.
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
            <p className="text-sm text-muted-foreground text-center py-4">No recordings yet.</p>
          ) : (
            <ScrollArea className="h-[400px]">
              <ul className="space-y-3">
                {recordings.map((rec) => (
                  <li key={rec.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-sm">{rec.title}</h4>
                        <p className="text-xs text-muted-foreground">{rec.date} - {rec.duration}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Play recording" onClick={() => alert('Playback feature not implemented.')}>
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" aria-label="Delete recording" onClick={() => handleDeleteRecording(rec.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs mt-1 truncate">{rec.notesPreview}</p>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
