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
import { UploadCloud, FileText as FileTextIcon, ImageIcon, YoutubeIcon, MicIcon as AudioLinesIcon, VideoIcon, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface EvidenceItem {
  id: string;
  type: 'photo' | 'audio' | 'video' | 'document' | 'youtube' | 'other';
  fileName?: string;
  url?: string;
  label: string;
  description: string;
  previewUrl?: string; // Data URL for images, or icon identifier
  addedDate: string;
  fileObject?: File; // To store the actual file if needed later & for preview
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

export default function EvidenceCompilerPage() {
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([]);
  const [currentLabel, setCurrentLabel] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [inputType, setInputType] = useState<'file' | 'url'>('file');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Clean up preview URLs when component unmounts or items are removed
    return () => {
      evidenceItems.forEach(item => {
        if (item.previewUrl && item.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [evidenceItems]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCurrentFile(event.target.files[0]);
      setCurrentUrl(""); // Clear URL if a file is selected
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

    let newEvidenceItem: Omit<EvidenceItem, 'id' | 'addedDate'>;
    let previewUrl: string | undefined = undefined;

    if (inputType === 'file' && currentFile) {
      const fileType = determineFileType(currentFile);
      if (fileType === 'photo' || fileType === 'video') { // Create blob URLs for image/video previews
        previewUrl = URL.createObjectURL(currentFile);
      }
      newEvidenceItem = {
        type: fileType,
        fileName: currentFile.name,
        label: currentLabel,
        description: currentDescription,
        previewUrl: previewUrl,
        fileObject: currentFile,
      };
    } else if (inputType === 'url' && currentUrl) {
      if (!currentUrl.match(/^(https|http):\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/)) {
         toast({ title: "Invalid URL", description: "Please enter a valid YouTube URL.", variant: "destructive" });
         setIsSubmitting(false);
         return;
      }
      newEvidenceItem = {
        type: 'youtube',
        url: currentUrl,
        label: currentLabel,
        description: currentDescription,
      };
    } else {
      toast({ title: "Error", description: "Could not process evidence.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    setEvidenceItems(prevItems => [
      ...prevItems,
      { ...newEvidenceItem, id: Date.now().toString(), addedDate: new Date().toLocaleString() }
    ]);

    toast({ title: "Evidence Added", description: `"${currentLabel}" has been added to your collection.`, variant: "default" });
    setCurrentLabel("");
    setCurrentDescription("");
    setCurrentFile(null);
    setCurrentUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
    setIsSubmitting(false);
  };

  const handleDeleteEvidence = (id: string) => {
    const itemToDelete = evidenceItems.find(item => item.id === id);
    if (itemToDelete?.previewUrl && itemToDelete.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(itemToDelete.previewUrl);
    }
    setEvidenceItems(prevItems => prevItems.filter(item => item.id !== id));
    toast({ title: "Evidence Removed", description: "The item has been removed from your collection.", variant: "default" });
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
              <UploadCloud className="w-7 h-7 text-primary" /> Evidence Compiler
            </CardTitle>
            <CardDescription>
              Upload or link evidence (photos, videos, documents, YouTube URLs). Label and organize them for your case.
              Uploaded files are handled locally in your browser.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="inputType">Evidence Source</Label>
                 <Select value={inputType} onValueChange={(value: 'file' | 'url') => { setInputType(value); setCurrentFile(null); setCurrentUrl(""); if(fileInputRef.current) fileInputRef.current.value = ""; }}>
                  <SelectTrigger id="inputType">
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
                  <Label htmlFor="evidenceFile">Select File</Label>
                  <Input
                    id="evidenceFile"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  {currentFile && <p className="text-xs text-muted-foreground mt-1">Selected: {currentFile.name}</p>}
                </div>
              )}

              {inputType === 'url' && (
                <div>
                  <Label htmlFor="evidenceUrl">YouTube URL</Label>
                  <Input
                    id="evidenceUrl"
                    type="url"
                    value={currentUrl}
                    onChange={(e) => { setCurrentUrl(e.target.value); setCurrentFile(null); }}
                    placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="evidenceLabel">Evidence Label*</Label>
                <Input
                  id="evidenceLabel"
                  value={currentLabel}
                  onChange={(e) => setCurrentLabel(e.target.value)}
                  placeholder="e.g., Photo of damaged fence, Dashcam footage May 5th"
                  required
                />
              </div>
              <div>
                <Label htmlFor="evidenceDescription">Description/Notes</Label>
                <Textarea
                  id="evidenceDescription"
                  value={currentDescription}
                  onChange={(e) => setCurrentDescription(e.target.value)}
                  placeholder="Add any relevant context, observations, or details about this piece of evidence."
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><CheckCircle className="mr-2 h-4 w-4 animate-spin" />Adding...</> : "Add Evidence to Collection"}
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
              <CardDescription>Review and manage your compiled evidence items below.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-3">
                <ul className="space-y-4">
                  {evidenceItems.map(item => (
                    <li key={item.id} className="border p-4 rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                           {item.previewUrl && (item.type === 'photo' || item.type === 'video') ? (
                            item.type === 'photo' ?
                              <img src={item.previewUrl} alt={item.label} className="w-16 h-16 object-cover rounded" /> :
                              <video src={item.previewUrl} className="w-16 h-16 object-cover rounded" controls={false} muted loop playsInline />
                          ) : (
                            <div className="w-16 h-16 flex items-center justify-center bg-muted rounded">
                              {getFileIcon(item.type)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold text-md">{item.label}</h4>
                            <p className="text-xs text-muted-foreground">
                              Type: <span className="capitalize">{item.type}</span> | Added: {item.addedDate}
                            </p>
                            {item.fileName && <p className="text-xs text-muted-foreground">File: {item.fileName}</p>}
                            {item.url && <p className="text-xs text-muted-foreground">URL: <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{item.url}</a></p>}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => handleDeleteEvidence(item.id)} aria-label="Delete evidence">
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
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-md sticky top-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-accent" /> Criminal Evidence Guidance
            </CardTitle>
            <CardDescription>Key considerations for evidence in criminal cases. (Informational Only)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <h4 className="font-semibold text-primary">Chain of Custody</h4>
              <p className="text-muted-foreground">
                This refers to the chronological documentation or paper trail, showing the seizure, custody, control, transfer, analysis, and disposition of physical or electronic evidence. Maintaining a clear chain of custody is crucial for evidence admissibility. Document who handled the evidence, when, where, and why.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary">Hearsay Exceptions</h4>
              <p className="text-muted-foreground">
                Hearsay is an out-of-court statement offered to prove the truth of the matter asserted. It's generally inadmissible, but many exceptions exist (e.g., excited utterance, business records, statements against interest). Understand these exceptions if dealing with statements made by others.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-primary">Constitutional Admissibility</h4>
              <p className="text-muted-foreground">
                Evidence must be obtained legally. The Fourth Amendment protects against unreasonable searches and seizures. The Fifth Amendment protects against self-incrimination. The Sixth Amendment guarantees the right to counsel. Evidence obtained in violation of these rights may be suppressed (excluded from trial).
              </p>
            </div>
             <Alert variant="default" className="border-accent">
                <AlertTriangle className="h-4 w-4 text-accent" />
                <AlertTitle>Disclaimer</AlertTitle>
                <AlertDescription>
                  This information is for educational purposes only and is not legal advice. Evidence rules are complex and vary by jurisdiction. Always consult with a qualified attorney for advice specific to your situation.
                </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
