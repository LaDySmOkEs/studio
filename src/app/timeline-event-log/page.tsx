
// src/app/timeline-event-log/page.tsx
"use client";

import { useState, type FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  CalendarClock, Trash2, AlertTriangle, Info, FileText, Gavel, UserX, 
  DollarSign, Mail, Clock, Shield, Paperclip, Landmark, ClipboardList, type LucideIcon, Loader2, Brain
} from "lucide-react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { handleAnalyzeTimelineAction } from "./actions"; 
import type { TimelineEventsInput, TimelineAnalysisOutput } from "@/ai/flows/analyzeTimelineEvents";


const LOCAL_STORAGE_KEY = "dueProcessAICaseAnalysisData";

interface StoredCaseData {
  caseDetails: string;
  caseCategory: "general" | "criminal" | "civil";
}

interface LoggedEvent {
  id: string;
  date: string;
  type: string; // This will store the label of the event type
  typeValue: string; // This will store the value of the event type for mapping to icon
  description: string;
  loggedAt: string;
}

const EVENT_TYPES = [
  { value: "arrest", label: "Arrest", icon: UserX },
  { value: "initial_appearance", label: "Initial Court Appearance / Arraignment", icon: Gavel },
  { value: "bail_hearing", label: "Bail / Bond Hearing", icon: DollarSign },
  { value: "discovery_received", label: "Received Discovery", icon: FileText },
  { value: "motion_filed", label: "Filed Motion", icon: FileText },
  { value: "hearing_notice_received", label: "Received Hearing Notice", icon: Mail },
  { value: "court_hearing", label: "Court Hearing", icon: Landmark },
  { value: "order_judgment_received", label: "Received Court Order / Judgment", icon: ClipboardList },
  { value: "deadline", label: "Deadline", icon: Clock },
  { value: "interaction_le", label: "Interaction with Law Enforcement", icon: Shield },
  { value: "evidence_collected", label: "Evidence Collected/Noted", icon: Paperclip },
  { value: "other", label: "Other Event", icon: Info },
];

const getEventTypeIcon = (typeValue: string): LucideIcon => {
  const eventType = EVENT_TYPES.find(et => et.value === typeValue);
  return eventType ? eventType.icon : Info;
};

export default function TimelineEventLogPage() {
  const [events, setEvents] = useState<LoggedEvent[]>([]);
  const [currentEventDate, setCurrentEventDate] = useState("");
  const [currentEventTypeValue, setCurrentEventTypeValue] = useState(""); // Store the value
  const [currentEventDescription, setCurrentEventDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storedCaseSummary, setStoredCaseSummary] = useState<string | null>(null);

  const [timelineAnalysisResult, setTimelineAnalysisResult] = useState<TimelineAnalysisOutput | null>(null);
  const [isAnalyzingTimeline, setIsAnalyzingTimeline] = useState(false);

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
    if (!currentEventDate || !currentEventTypeValue || !currentEventDescription.trim()) {
      toast({
        title: "All Fields Required",
        description: "Please fill in the date, type, and description for the event.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    const selectedEventType = EVENT_TYPES.find(et => et.value === currentEventTypeValue);

    const newEvent: LoggedEvent = {
      id: Date.now().toString(),
      date: currentEventDate,
      type: selectedEventType?.label || currentEventTypeValue,
      typeValue: currentEventTypeValue,
      description: currentEventDescription,
      loggedAt: new Date().toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    setEvents(prevEvents => [...prevEvents, newEvent].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setCurrentEventDate("");
    setCurrentEventTypeValue("");
    setCurrentEventDescription("");
    toast({
      title: "Event Logged",
      description: `"${newEvent.type}" on ${new Date(newEvent.date).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })} has been added to your timeline.`,
    });
    setIsSubmitting(false);
    setTimelineAnalysisResult(null); // Clear previous analysis if new event is added
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    toast({
      title: "Event Deleted",
      description: "The event has been removed from your timeline.",
      variant: "destructive",
    });
    setTimelineAnalysisResult(null); // Clear previous analysis if event is deleted
  };

  const triggerTimelineAnalysis = async () => {
    if (events.length === 0) {
      toast({
        title: "No Events to Analyze",
        description: "Please log some events before analyzing the timeline.",
        variant: "destructive",
      });
      return;
    }
    setIsAnalyzingTimeline(true);
    setTimelineAnalysisResult(null);

    const analysisInput: TimelineEventsInput = {
      events: events.map(e => ({ date: e.date, type: e.type, description: e.description })),
    };

    const result = await handleAnalyzeTimelineAction(analysisInput);

    if ('error' in result) {
      toast({
        title: "Timeline Analysis Failed",
        description: result.error,
        variant: "destructive",
      });
    } else {
      setTimelineAnalysisResult(result);
      toast({
        title: "Timeline Analysis Complete",
        description: "AI has provided insights on your timeline.",
      });
    }
    setIsAnalyzingTimeline(false);
  };


  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <CalendarClock className="w-7 h-7 text-primary" /> Due Process Timeline &amp; Event Log
            </CardTitle>
            <CardDescription>
              Log important dates, events, and procedural steps related to your case. This tool serves as a visual aid to organize your case timeline chronologically. Entries are stored locally in your browser.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
               {storedCaseSummary && (
                <Card className="bg-muted/50 mb-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2"><Info className="w-5 h-5 text-muted-foreground" />Current Case Context</CardTitle>
                    <CardDescription className="text-xs">This summary was entered in the Case Analysis section. Use it to help describe your timeline events.</CardDescription>
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
                <Label htmlFor="eventDateInput">Event Date*</Label>
                <Input
                  id="eventDateInput"
                  type="date"
                  value={currentEventDate}
                  onChange={(e) => setCurrentEventDate(e.target.value)}
                  required
                  aria-label="Event date"
                />
              </div>
              <div>
                <Label htmlFor="eventTypeSelect">Event Type*</Label>
                <Select onValueChange={setCurrentEventTypeValue} value={currentEventTypeValue}>
                  <SelectTrigger id="eventTypeSelect" aria-label="Select event type">
                    <SelectValue placeholder="Select event type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map(et => (
                      <SelectItem key={et.value} value={et.value}>
                        <div className="flex items-center gap-2">
                          <et.icon className="w-4 h-4 text-muted-foreground" />
                          {et.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="eventDescriptionTextarea">Event Description*</Label>
                <Textarea
                  id="eventDescriptionTextarea"
                  value={currentEventDescription}
                  onChange={(e) => setCurrentEventDescription(e.target.value)}
                  placeholder="Describe the event, who was involved, what happened, relevant details..."
                  rows={5}
                  required
                  className="resize-none"
                  aria-label="Event description"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging..." : "Log Event to Timeline"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {events.length > 0 && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Case Timeline</CardTitle>
              <CardDescription>Review your logged events below, sorted by event date (most recent first). Each event is shown with its type and an icon.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-3">
                <ul className="space-y-4">
                  {events.map(event => {
                    const EventIcon = getEventTypeIcon(event.typeValue);
                    return (
                      <li key={event.id} className="border p-4 rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                             <EventIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="font-semibold text-md">{event.type}</h4>
                              <p className="text-sm text-muted-foreground">
                                Date: {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Logged on: {event.loggedAt}
                              </p>
                            </div>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" aria-label={`Delete event: ${event.type} on ${event.date}`}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this event from your timeline.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteEvent(event.id)} className="bg-destructive hover:bg-destructive/90">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                        <p className="text-sm mt-2 pt-2 border-t text-foreground/80 whitespace-pre-line">
                          {event.description}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            </CardContent>
             {events.length > 0 && (
                <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => {
                        setEvents([]);
                        toast({ title: "All Events Cleared", description: "All logged events have been cleared from the timeline.", variant: "destructive" });
                        setTimelineAnalysisResult(null); // Clear analysis when all events are cleared
                    }}
                    aria-label="Clear entire timeline"
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Clear Entire Timeline
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
              <Brain className="w-6 h-6 text-accent" /> AI Timeline Analysis
            </CardTitle>
            <CardDescription>
              Get AI-powered insights on your logged timeline events.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Button 
              onClick={triggerTimelineAnalysis} 
              disabled={isAnalyzingTimeline || events.length === 0}
              className="w-full"
            >
              {isAnalyzingTimeline ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
              ) : (
                "Analyze Timeline with AI"
              )}
            </Button>

            {timelineAnalysisResult && !isAnalyzingTimeline && (
              <div className="mt-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-primary">Analysis Summary:</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">{timelineAnalysisResult.analysisSummary}</p>
                </div>
                {timelineAnalysisResult.potentialFocusAreas && timelineAnalysisResult.potentialFocusAreas.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-primary">Potential Focus Areas:</h4>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                      {timelineAnalysisResult.potentialFocusAreas.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
             <Alert variant="default" className="border-accent bg-accent/10 mt-4">
                <AlertTriangle className="h-4 w-4 text-accent" />
                <AlertTitle className="font-semibold">Important Note &amp; Disclaimer</AlertTitle>
                <AlertDescription>
                  The AI analysis provides general observations based on the event types and descriptions you log. It is not legal advice and does not assess legal validity or procedural correctness.
                  Its purpose is to help you identify patterns or significant events in your timeline for further review. Always consult with a qualified legal professional for advice on your specific case.
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

