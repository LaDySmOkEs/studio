
// src/app/evidence-compiler/page.tsx
"use client";

import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  UploadCloud, FileText as FileTextIcon, ImageIcon, YoutubeIcon, MicIcon as AudioLinesIcon, 
  VideoIcon, Trash2, AlertTriangle, SearchCheck, Loader2, MessageSquareQuote, 
  AlertOctagon, ShieldCheck, Info, Lightbulb, Eye // Added Eye icon
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge"; // For displaying tags

const LOCAL_STORAGE_KEY = "dueProcessAICaseAnalysisData";

interface StoredCaseData {
  caseDetails: string;
  caseCategory: "general" | "criminal" | "civil";
}

interface ConceptualAnalysis {
  transcriptionHighlights?: string;
  flaggedIrregularities?: string[];
  linkedPrinciples?: string[];
}

interface EvidenceItem {
  id: string;
  type: 'photo' | 'audio' | 'video' | 'document' | 'youtube' | 'other';
  fileName?: string;
  url?: string;
  label: string;
  description: string;
  previewUrl?: string; 
  addedDate: string;
  fileObject?: File;
  size?: number; // New: File size in bytes
  exhibitLabel?: string; // New: User-defined exhibit label (e.g., A, B, C)
  status: 'Pending' | 'Analyzed (Conceptual)'; // New: Status of the item
  analysisTags?: string[]; // New: Conceptual tags from AI analysis
}

interface AnalysisDisplayState {
  itemId: string;
  label: string;
  analysis: ConceptualAnalysis;
}

const getFileIcon = (type: EvidenceItem['type']) => {
  switch (type) {
    case 'photo': return <ImageIcon className="w-5 h-5 text-primary" />;
    case 'audio': return <AudioLinesIcon className="w-5 h-5 text-primary" />;
    case 'video': return <VideoIcon className="w-5 h-5 text-primary" />;
    case 'document': return <FileTextIcon className="w-5 h-5 text-primary" />;
    case 'youtube': return <YoutubeIcon className="w-5 h-5 text-red-600" />;
    default: return <FileTextIcon className="w-5 h-5 text-primary" />;
  }
};

const formatFileSize = (bytes?: number) => {
  if (bytes === undefined || bytes === null) return '';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function EvidenceCompilerPage() {
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [currentLabel, setCurrentLabel] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");
  const [currentExhibitLabel, setCurrentExhibitLabel] = useState(""); // New state for exhibit label
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [inputType, setInputType] = useState<'file' | 'url'>('file');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [analysisLoadingItemId, setAnalysisLoadingItemId] = useState<string | null>(null);
  const [currentAnalysisDisplay, setCurrentAnalysisDisplay] = useState<AnalysisDisplayState | null>(null);
  const [storedCaseSummary, setStoredCaseSummary] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedDataString) {
        const storedData: StoredCaseData = JSON.parse(storedDataString);
        setStoredCaseSummary(storedData.caseDetails);
      }
    } catch (e) {
      console.error("Failed to load or parse case data from localStorage", e);
    }

    return () => {
      evidenceItems.forEach(item => {
        if (item.previewUrl && item.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, []); 

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCurrentFile(event.target.files[0]);
      setCurrentUrl(""); 
    }
  };

  const determineFileType = (file: File): EvidenceItem['type'] => {
    const type = file.type.split('/')[0];
    if (type === 'image') return 'photo';
    if (type === 'audio') return 'audio';
    if (type === 'video') return 'video';
    if (file.type === 'application/pdf' || file.type.includes('document') || file.type.includes('text')) return 'document';
    return 'other';
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if ((!currentFile && inputType === 'file') && (!currentUrl && inputType === 'url')) {
      toast({ title: "No evidence selected", description: "Please select a file or enter a URL.", variant: "destructive" });
      return;
    }
    if (!currentLabel) {
      toast({ title: "Label required", description: "Please provide a label for the evidence.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    setCurrentAnalysisDisplay(null); 

    let newEvidenceItemBase: Omit<EvidenceItem, 'id' | 'addedDate'>;
    let previewUrl: string | undefined = undefined;

    if (inputType === 'file' && currentFile) {
      const fileType = determineFileType(currentFile);
      if (fileType === 'photo' || fileType === 'video') {
        previewUrl = URL.createObjectURL(currentFile);
      }
      newEvidenceItemBase = {
        type: fileType,
        fileName: currentFile.name,
        label: currentLabel,
        description: currentDescription,
        previewUrl: previewUrl,
        fileObject: currentFile,
        size: currentFile.size, // Added file size
        exhibitLabel: currentExhibitLabel.trim() || undefined, // Added exhibit label
        status: 'Pending', // Default status
      };
    } else if (inputType === 'url' && currentUrl) {
      if (!currentUrl.match(/^(https|http):\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/)) {
         toast({ title: "Invalid URL", description: "Please enter a valid YouTube URL.", variant: "destructive" });
         setIsSubmitting(false);
         return;
      }
      newEvidenceItemBase = {
        type: 'youtube',
        url: currentUrl,
        label: currentLabel,
        description: currentDescription,
        exhibitLabel: currentExhibitLabel.trim() || undefined, // Added exhibit label
        status: 'Pending', // Default status
      };
    } else {
      toast({ title: "Error", description: "Could not process evidence.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    setEvidenceItems(prevItems => [
      ...prevItems,
      { ...newEvidenceItemBase, id: Date.now().toString(), addedDate: new Date().toLocaleString() }
    ]);

    toast({ title: "Evidence Added", description: `"${currentLabel}" has been added to your collection.`, variant: "default" });
    setCurrentLabel("");
    setCurrentDescription("");
    setCurrentExhibitLabel(""); // Reset exhibit label
    setCurrentFile(null);
    setCurrentUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsSubmitting(false);
  };

  const handleDeleteEvidence = (id: string) => {
    const itemToDelete = evidenceItems.find(item => item.id === id);
    if (itemToDelete?.previewUrl && itemToDelete.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(itemToDelete.previewUrl);
    }
    setEvidenceItems(prevItems => prevItems.filter(item => item.id !== id));
    if (currentAnalysisDisplay?.itemId === id) {
      setCurrentAnalysisDisplay(null); 
    }
    toast({ title: "Evidence Removed", description: "The item has been removed from your collection.", variant: "default" });
  };

  const handleConceptualAnalyze = async (item: EvidenceItem) => {
    setAnalysisLoadingItemId(item.id);
    setCurrentAnalysisDisplay(null); 
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    let mockAnalysis: ConceptualAnalysis = {};
    let conceptualTranscription = `Conceptual transcription placeholder for "${item.label}":\n\n`;

    if (item.description) {
        conceptualTranscription += `This recording appears to concern: "${item.description.substring(0, 70)}${item.description.length > 70 ? '...' : ''}".\n\n`;
    } else {
        conceptualTranscription += `No specific description was provided for this item.\n\n`;
    }
    
    conceptualTranscription += `In a real system, the full audio/video content would be transcribed here by an AI. Key phrases, speaker identification, and timestamps would be extracted for detailed analysis against legal and procedural standards.`;

    mockAnalysis.transcriptionHighlights = conceptualTranscription;
    
    const mockTags = ["Keyword: " + item.type, "Context: " + (item.label.split(" ")[0] || "General")];
    if (item.description.toLowerCase().includes("important")) mockTags.push("Priority: High");


    if (item.type === 'audio' || item.type === 'video' || item.type === 'youtube') {
        mockAnalysis.flaggedIrregularities = [
            "Example Irregularity: The reason for the interaction was not clearly stated at the outset (if applicable).",
            "Example Irregularity: Questions regarding rights or legal status (e.g., 'Am I free to go?', 'Do I need a lawyer?') were potentially ignored or deflected.",
        ],
        mockAnalysis.linkedPrinciples = [
            "Example Principle: Right to understand the nature of an official interaction.",
            "Example Principle: Right to counsel (Sixth Amendment, if applicable).",
        ]
    }
    
    setEvidenceItems(prevItems => 
      prevItems.map(ev => 
        ev.id === item.id 
          ? { ...ev, status: 'Analyzed (Conceptual)', analysisTags: mockTags } 
          : ev
      )
    );

    setCurrentAnalysisDisplay({ itemId: item.id, label: item.label, analysis: mockAnalysis });
    setAnalysisLoadingItemId(null);
    toast({
      title: "Conceptual Analysis Complete",
      description: `Showing conceptual analysis for "${item.label}". The transcription is a placeholder. Item status updated.`,
    });
  };

  const handlePreview = (item: EvidenceItem) => {
    if (item.type === 'photo' && item.previewUrl) {
      window.open(item.previewUrl, '_blank');
    } else if (item.type === 'youtube' && item.url) {
      window.open(item.url, '_blank');
    } else if (item.type === 'video' && item.previewUrl) {
       window.open(item.previewUrl, '_blank');
    } else {
      toast({
        title: `Preview: ${item.label}`,
        description: `Type: ${item.type}. ${item.fileName || item.url || 'No direct preview for this type.'}. Consider downloading or opening externally if applicable.`,
      });
    }
  };

  const handleAssembleBundle = () => {
    if (evidenceItems.length === 0) {
      toast({ title: "No Evidence", description: "Add some evidence before assembling a bundle.", variant: "destructive" });
      return;
    }
    toast({
      title: "Bundle Assembly (Placeholder)",
      description: "This feature would compile selected evidence into a court-ready format. Not yet implemented.",
      variant: "default",
      duration: 5000,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <UploadCloud className="w-7 h-7 text-primary" /> Evidence Compiler & Analyzer
            </CardTitle>
            <CardDescription>
              Upload or link evidence (photos, videos, documents, YouTube URLs). Label it, add descriptions, and an exhibit label. You can also perform a conceptual analysis on audio/video files.
              Uploaded files are handled locally in your browser.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {storedCaseSummary && (
                <Card className="bg-muted/50 mb-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2"><Info className="w-5 h-5 text-muted-foreground" />Current Case Context</CardTitle>
                    <CardDescription className="text-xs">This summary was entered in the Case Analysis section. Use it to help label and describe your evidence.</CardDescription>
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
                <Label htmlFor="inputTypeSelect">Evidence Source</Label>
                 <Select value={inputType} onValueChange={(value: 'file' | 'url') => { setInputType(value); setCurrentFile(null); setCurrentUrl(""); if(fileInputRef.current) fileInputRef.current.value = ""; }}>
                  <SelectTrigger id="inputTypeSelect" aria-label="Select evidence source type">
                    <SelectValue placeholder="Select source type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="file">Upload File</SelectItem>
                    <SelectItem value="url">YouTube URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {inputType === 'file' && (
                <div>
                  <Label htmlFor="evidenceFileInput">Select File</Label>
                  <Input
                    id="evidenceFileInput"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
                    className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    aria-label="Select file for evidence"
                  />
                  {currentFile && <p className="text-xs text-muted-foreground mt-1">Selected: {currentFile.name} ({formatFileSize(currentFile.size)})</p>}
                </div>
              )}

              {inputType === 'url' && (
                <div>
                  <Label htmlFor="evidenceUrlInput">YouTube URL</Label>
                  <Input
                    id="evidenceUrlInput"
                    type="url"
                    value={currentUrl}
                    onChange={(e) => { setCurrentUrl(e.target.value); setCurrentFile(null); }}
                    placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    aria-label="YouTube URL for evidence"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="evidenceLabelInput">Evidence Label*</Label>
                <Input
                  id="evidenceLabelInput"
                  value={currentLabel}
                  onChange={(e) => setCurrentLabel(e.target.value)}
                  placeholder="e.g., Photo of damaged fence, Dashcam footage May 5th"
                  required
                  aria-label="Evidence label"
                />
              </div>
               <div>
                <Label htmlFor="evidenceExhibitLabelInput">Exhibit Label (Optional)</Label>
                <Input
                  id="evidenceExhibitLabelInput"
                  value={currentExhibitLabel}
                  onChange={(e) => setCurrentExhibitLabel(e.target.value)}
                  placeholder="e.g., Exhibit A, Plaintiff's Exhibit 1"
                  aria-label="Exhibit label for evidence"
                />
              </div>
              <div>
                <Label htmlFor="evidenceDescriptionTextarea">Description/Notes</Label>
                <Textarea
                  id="evidenceDescriptionTextarea"
                  value={currentDescription}
                  onChange={(e) => setCurrentDescription(e.target.value)}
                  placeholder="Add any relevant context, observations, or details about this piece of evidence."
                  rows={3}
                  aria-label="Evidence description or notes"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</> : "Add Evidence to Collection"}
              </Button>
              <Button type="button" variant="outline" onClick={handleAssembleBundle}>
                Assemble Bundle (Placeholder)
              </Button>
            </CardFooter>
          </form>
        </Card>

        {evidenceItems.length > 0 && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Collected Evidence</CardTitle>
              <CardDescription>Review and manage your compiled evidence items below. Audio/video items can be conceptually analyzed.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-3">
                <ul className="space-y-4">
                  {evidenceItems.map(item => (
                    <li key={item.id} className="border p-4 rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3 flex-grow min-w-0">
                           {item.previewUrl && (item.type === 'photo' || item.type === 'video') ? (
                            item.type === 'photo' ?
                              <img src={item.previewUrl} alt={item.label} className="w-16 h-16 object-cover rounded flex-shrink-0" data-ai-hint="evidence photo" /> :
                              <video src={item.previewUrl} className="w-16 h-16 object-cover rounded flex-shrink-0" controls={false} muted loop playsInline />
                          ) : (
                            <div className="w-16 h-16 flex items-center justify-center bg-muted rounded flex-shrink-0">
                              {getFileIcon(item.type)}
                            </div>
                          )}
                          <div className="flex-grow min-w-0">
                            <h4 className="font-semibold text-md truncate" title={item.label}>
                              {item.exhibitLabel && <span className="text-primary font-bold mr-1">[{item.exhibitLabel}]</span>}
                              {item.label}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Type: <span className="capitalize">{item.type}</span> | Added: {item.addedDate}
                            </p>
                            {item.fileName && <p className="text-xs text-muted-foreground truncate">File: {item.fileName}</p>}
                            {item.url && <p className="text-xs text-muted-foreground truncate">URL: <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{item.url}</a></p>}
                            {item.size !== undefined && <p className="text-xs text-muted-foreground">Size: {formatFileSize(item.size)}</p>}
                            <p className="text-xs text-muted-foreground">Status: <Badge variant={item.status === 'Analyzed (Conceptual)' ? 'default' : 'secondary'}>{item.status}</Badge></p>
                            
                            {item.status === 'Analyzed (Conceptual)' && item.analysisTags && item.analysisTags.length > 0 && (
                              <div className="mt-1">
                                {item.analysisTags.map(tag => (
                                  <Badge key={tag} variant="outline" className="mr-1 mb-1 text-xs">{tag}</Badge>
                                ))}
                              </div>
                            )}
                            
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs"
                                onClick={() => handlePreview(item)}
                                aria-label={`Preview evidence: ${item.label}`}
                              >
                                <Eye className="mr-1 h-3 w-3" /> Preview
                              </Button>
                              {(item.type === 'audio' || item.type === 'video' || item.type === 'youtube') && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-xs"
                                  onClick={() => handleConceptualAnalyze(item)}
                                  disabled={analysisLoadingItemId === item.id}
                                  aria-label={`Analyze evidence: ${item.label} (Conceptual)`}
                                >
                                  {analysisLoadingItemId === item.id ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <SearchCheck className="mr-1 h-3 w-3" />}
                                  Analyze (Conceptual)
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 flex-shrink-0" onClick={() => handleDeleteEvidence(item.id)} aria-label={`Delete evidence: ${item.label}`}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {item.description && <p className="text-sm mt-2 pt-2 border-t text-foreground/80 whitespace-pre-wrap">{item.description}</p>}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {currentAnalysisDisplay && (
          <Card className="shadow-lg mt-6 border-primary">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <SearchCheck className="w-6 h-6 text-primary" /> Conceptual Analysis for: <span className="font-normal">{currentAnalysisDisplay.label}</span>
              </CardTitle>
              <CardDescription>
                This is a conceptual AI analysis. The "Transcription Highlights" section below is a placeholder representing what a full AI system would transcribe from the audio/video before further analysis. The flagged irregularities and principles are examples of what an AI might identify. This is for demonstration purposes only and is not legal advice.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentAnalysisDisplay.analysis.transcriptionHighlights && (
                <div>
                  <h4 className="font-semibold text-md flex items-center gap-1 mb-1"><MessageSquareQuote className="w-4 h-4 text-muted-foreground"/>Transcription Highlights (Conceptual Placeholder)</h4>
                  <Label htmlFor="transcriptionHighlightsTextarea" className="sr-only">Conceptual Transcription Placeholder</Label>
                  <Textarea
                    id="transcriptionHighlightsTextarea"
                    value={currentAnalysisDisplay.analysis.transcriptionHighlights}
                    readOnly
                    rows={6}
                    className="bg-muted/50 text-sm font-mono"
                    aria-label="Conceptual Transcription Placeholder"
                  />
                </div>
              )}
              {currentAnalysisDisplay.analysis.flaggedIrregularities && currentAnalysisDisplay.analysis.flaggedIrregularities.length > 0 && (
                <div>
                  <h4 className="font-semibold text-md flex items-center gap-1 mb-1"><AlertOctagon className="w-4 h-4 text-muted-foreground"/>Example Flagged Irregularities (Conceptual)</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {currentAnalysisDisplay.analysis.flaggedIrregularities.map((irregularity, index) => (
                      <li key={index}>{irregularity}</li>
                    ))}
                  </ul>
                </div>
              )}
              {currentAnalysisDisplay.analysis.linkedPrinciples && currentAnalysisDisplay.analysis.linkedPrinciples.length > 0 && (
                <div>
                  <h4 className="font-semibold text-md flex items-center gap-1 mb-1"><ShieldCheck className="w-4 h-4 text-muted-foreground"/>Example Linked Constitutional Principles (Conceptual)</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {currentAnalysisDisplay.analysis.linkedPrinciples.map((principle, index) => (
                      <li key={index}>{principle}</li>
                    ))}
                  </ul>
                </div>
              )}
              <Alert variant="default" className="border-accent bg-accent/10 mt-3">
                <AlertTriangle className="h-4 w-4 text-accent" />
                <AlertTitle className="font-semibold text-accent">Not Legal Advice</AlertTitle>
                <AlertDescription>
                  The analysis presented is illustrative. Always consult with a qualified legal professional for advice specific to your situation and to review any evidence.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
                <Button variant="outline" onClick={() => setCurrentAnalysisDisplay(null)}>Close Analysis</Button>
            </CardFooter>
          </Card>
        )}
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-md sticky top-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-accent" /> Evidence Gathering & Relevance Guide
            </CardTitle>
            <CardDescription>Understanding what evidence might be relevant and general ways to obtain it. (Informational Only)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-primary">Identifying Relevant Evidence</h4>
              <p className="text-muted-foreground">
                The type of evidence you need depends heavily on your case. Consider:
              </p>
              <ul className="list-disc pl-5 mt-1 text-muted-foreground space-y-1">
                <li><strong>Contract Disputes:</strong> The contract itself, amendments, emails or letters about the agreement, invoices, proof of payment or non-payment, records of communication.</li>
                <li><strong>Personal Injury (e.g., car accident):</strong> Photos/videos of the scene and injuries, police reports, medical records and bills, witness contact information, insurance details.</li>
                <li><strong>Employment Issues:</strong> Employment contract, offer letter, pay stubs, performance reviews, emails or messages related to the issue (e.g., harassment, discrimination), company policies.</li>
                <li><strong>Family Law (e.g., divorce, custody):</strong> Marriage certificate, birth certificates, financial statements, property deeds, communication records between parties, school records.</li>
                <li><strong>Criminal Cases:</strong> While law enforcement and attorneys primarily handle evidence collection, understanding what's relevant is key (e.g., witness statements, physical evidence, alibis, surveillance footage, police reports). Your attorney will guide this.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-primary">General Methods for Obtaining Evidence (Legally & Ethically)</h4>
              <p className="text-muted-foreground">
                Always prioritize lawful and ethical means:
              </p>
              <ul className="list-disc pl-5 mt-1 text-muted-foreground space-y-1">
                <li><strong>Your Own Records:</strong> Gather all documents, photos, videos, emails, messages, and any other information you already possess that relates to your case.</li>
                <li><strong>Requests for Information:</strong> You can formally request your own records from various entities (e.g., medical records from your doctor, employment records from HR). Sometimes specific forms or procedures are required.</li>
                <li><strong>Public Records:</strong> Some information is publicly accessible. This can include certain court dockets, property ownership records, business registration details, or government reports available through Freedom of Information Act (FOIA) requests (or state equivalents).</li>
                <li><strong>Witness Information:</strong> If there are people who witnessed relevant events, you (or ideally your attorney) might speak with them. If you do, be truthful, don't pressure them, and accurately note what they say. Formal statements or depositions are typically handled by legal professionals.</li>
                <li><strong>The Discovery Process:</strong> In formal litigation (a lawsuit), there's a legal process called "discovery" where parties can demand evidence from each other. This is usually managed by attorneys and involves tools like interrogatories (written questions), requests for documents, and depositions (sworn out-of-court testimony).</li>
              </ul>
               <Alert variant="default" className="mt-3 border-destructive bg-destructive/10">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <AlertTitle className="font-semibold text-destructive">Important Cautions</AlertTitle>
                  <AlertDescription className="text-destructive/90">
                    Never attempt to obtain evidence illegally or unethically (e.g., unauthorized recording where not permitted by law, trespassing, hacking, misrepresentation). Such actions can harm your case and lead to legal penalties. If unsure, always consult an attorney.
                  </AlertDescription>
              </Alert>
            </div>
            
            <div>
              <h4 className="font-semibold text-primary mt-3">Specific Considerations for Criminal Cases</h4>
               <p className="text-muted-foreground">
                While your attorney will primarily handle evidence in a criminal case, understanding these concepts is useful:
              </p>
              <ul className="list-disc pl-5 mt-1 text-muted-foreground space-y-1">
                <li><strong>Chain of Custody:</strong> This refers to the chronological documentation showing the seizure, custody, control, transfer, analysis, and disposition of physical or electronic evidence. Essential for admissibility.</li>
                <li><strong>Hearsay Exceptions:</strong> Hearsay (an out-of-court statement offered to prove its truth) is generally inadmissible, but many exceptions exist (e.g., excited utterance, business records).</li>
                <li><strong>Constitutional Admissibility (Fourth, Fifth, Sixth Amendments):</strong> Evidence must be obtained legally. Violations of rights against unreasonable searches/seizures, self-incrimination, or the right to counsel can lead to evidence being suppressed.</li>
              </ul>
            </div>

             <Alert variant="default" className="border-accent mt-4">
                <Info className="h-4 w-4 text-accent" />
                <AlertTitle>Disclaimer: General Information Only</AlertTitle>
                <AlertDescription>
                  This information is for educational purposes and is not legal advice. Evidence rules are complex and vary by jurisdiction and case type. How to best identify and obtain evidence for your specific situation should always be discussed with a qualified attorney.
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
    
