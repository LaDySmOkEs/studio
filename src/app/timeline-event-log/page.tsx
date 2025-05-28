
// src/app/timeline-event-log/page.tsx
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { CalendarClock, Trash2, AlertTriangle, Info } from "lucide-react";
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

interface LoggedEvent {
  id: string;
  date: string;
  type: string;
  description: string;
  loggedAt: string;
}

const EVENT_TYPES = [
  { value: "arrest", label: "Arrest" },
  { value: "initial_appearance", label: "Initial Court Appearance / Arraignment" },
  { value: "bail_hearing", label: "Bail / Bond Hearing" },
  { value: "discovery_received", label: "Received Discovery" },
  { value: "motion_filed", label: "Filed Motion" },
  { value: "hearing_notice_received", label: "Received Hearing Notice" },
  { value: "court_hearing", label: "Court Hearing" },
  { value: "order_judgment_received", label: "Received Court Order / Judgment" },
  { value: "deadline", label: "Deadline" },
  { value: "interaction_le", label: "Interaction with Law Enforcement" },
  { value: "evidence_collected", label: "Evidence Collected/Noted" },
  { value: "other", label: "Other Event" },
];

export default function TimelineEventLogPage() {
  const [events, setEvents] = useState<LoggedEvent[]>([]);
  const [currentEventDate, setCurrentEventDate] = useState("");
  const [currentEventType, setCurrentEventType] = useState("");
  const [currentEventDescription, setCurrentEventDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentEventDate || !currentEventType || !currentEventDescription.trim()) {
      toast({
        title: "All Fields Required",
        description: "Please fill in the date, type, and description for the event.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    const newEvent: LoggedEvent = {
      id: Date.now().toString(),
      date: currentEventDate,
      type: EVENT_TYPES.find(et => et.value === currentEventType)?.label || currentEventType,
      description: currentEventDescription,
      loggedAt: new Date().toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    setEvents(prevEvents => [...prevEvents, newEvent].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setCurrentEventDate("");
    setCurrentEventType("");
    setCurrentEventDescription("");
    toast({
      title: "Event Logged",
      description: `"${newEvent.type}" on ${new Date(newEvent.date).toLocaleDateString()} has been added to your timeline.`,
    });
    setIsSubmitting(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    toast({
      title: "Event Deleted",
      description: "The event has been removed from your timeline.",
      variant: "destructive",
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <CalendarClock className="w-7 h-7 text-primary" /> Timeline & Event Log
            </CardTitle>
            <CardDescription>
              Chronicle important dates, events, and procedural steps related to your case. This log helps organize your case timeline.
              Entries are stored locally in your browser and are cleared when you refresh or close the page. No data is sent to any server.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="eventDate">Event Date*</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={currentEventDate}
                  onChange={(e) => setCurrentEventDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="eventType">Event Type*</Label>
                <Select onValueChange={setCurrentEventType} value={currentEventType}>
                  <SelectTrigger id="eventType">
                    <SelectValue placeholder="Select event type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map(et => (
                      <SelectItem key={et.value} value={et.value}>{et.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="eventDescription">Event Description*</Label>
                <Textarea
                  id="eventDescription"
                  value={currentEventDescription}
                  onChange={(e) => setCurrentEventDescription(e.target.value)}
                  placeholder="Describe the event, who was involved, what happened, relevant details..."
                  rows={5}
                  required
                  className="resize-none"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Logging..." : "Log Event"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {events.length > 0 && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Logged Events Timeline</CardTitle>
              <CardDescription>Review and manage your logged events below, sorted by event date (most recent first).</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-3">
                <ul className="space-y-4">
                  {events.map(event => (
                    <li key={event.id} className="border p-4 rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-md">{event.type} - {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</h4>
                          <p className="text-xs text-muted-foreground">
                            Logged on: {event.loggedAt}
                          </p>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this event from your log.
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
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
             {events.length > 0 && (
                <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => {
                        setEvents([]);
                        toast({ title: "All Events Cleared", description: "All logged events have been cleared.", variant: "destructive" });
                    }}>
                        <Trash2 className="mr-2 h-4 w-4" /> Clear All Events
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
              <Info className="w-6 h-6 text-accent" /> Timeline Analysis (Conceptual)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              This log helps you organize key dates and events in your case. Keeping a detailed and accurate timeline is crucial for understanding case progression and preparing for legal proceedings.
            </p>
            <div>
              <h4 className="font-semibold text-primary">How AI Could Help (Conceptual)</h4>
              <p className="text-muted-foreground">
                In a more advanced system, AI could analyze this timeline to:
              </p>
              <ul className="list-disc pl-5 mt-1 text-muted-foreground space-y-1">
                <li>Identify potential procedural issues, such as missed deadlines or unusually long delays between critical events (e.g., for speedy trial considerations).</li>
                <li>Flag missing common procedural steps based on the type of case and logged events. For example, if you log an 'Arrest' and then a 'Court Hearing' significantly later without an 'Initial Appearance' in between, the system might highlight this for review.</li>
                <li>Cross-reference events with jurisdictional rules (e.g., typical timeframes for responses, statutory limitations).</li>
              </ul>
            </div>
             <Alert variant="default" className="border-accent bg-accent/10">
                <AlertTriangle className="h-4 w-4 text-accent" />
                <AlertTitle className="font-semibold">Important Note & Disclaimer</AlertTitle>
                <AlertDescription>
                  The AI analysis described above is conceptual for this prototype. This tool currently only helps you log events.
                  Always verify procedural requirements, timelines, and any potential violations with a qualified legal professional. This log is for personal organization and does not constitute legal advice.
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
