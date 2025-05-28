
// src/app/document-analyzer/page.tsx
"use client";

import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileScan, UploadCloud, AlertTriangle, Lightbulb, Loader2, FileText as FileTextIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisFinding {
  type: "issue" | "observation" | "right";
  text: string;
  severity?: "high" | "medium" | "low"; // Optional for issues
}

const DUE_PROCESS_ELEMENTS_TO_CHECK = [
  "Clear notice of proceedings/hearings (dates, times, location)",
  "Opportunity to be heard (e.g., indicated hearing took place or is scheduled)",
  "Named parties clearly identified",
  "Specific allegations or reasons for the order/notice detailed",
  "Jurisdiction of the court/agency stated or implied",
  "Proper signatures (e.g., judge, clerk, relevant parties)",
  "Date of issuance clearly visible",
  "Clear statement of what is being ordered or decided",
  "Information on appeal rights (if applicable to the document type)",
  "Service of process indicated or addressed (if applicable)",
];

export default function DocumentAnalyzerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisFinding[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setFileName(event.target.files[0].name);
      setAnalysisResult(null); // Reset previous results
    } else {
      setSelectedFile(null);
      setFileName(null);
    }
  };

  const handleAnalyzeDocument = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a document to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Conceptual AI Analysis - In a real app, this would involve OCR, Genkit flow, etc.
    const mockResults: AnalysisFinding[] = [
      { type: "issue", text: `File "${fileName}": Conceptual analysis - No clear indication of a scheduled hearing date or time was found. This could be a due process concern if the document implies an action requiring a hearing.`, severity: "medium" },
      { type: "observation", text: `File "${fileName}": Conceptual analysis - The document appears to be a court order but lacks a visible judge's signature in the expected location. Verify if this is a final, signed order.` },
      { type: "right", text: `File "${fileName}": Conceptual analysis - If this document pertains to a new legal action against you, you generally have the right to respond. Check for deadlines.` },
    ];
    
    // Add a random element based on common checklist items if file name suggests it
    if (fileName?.toLowerCase().includes("notice")) {
        mockResults.push({type: "observation", text: `File "${fileName}": Conceptual analysis - For notices, ensure it clearly states what action is being proposed and the reasons why.`});
    } else if (fileName?.toLowerCase().includes("judgment") || fileName?.toLowerCase().includes("order")) {
         mockResults.push({type: "issue", text: `File "${fileName}": Conceptual analysis - Ensure any judgment or order clearly outlines what is required of each party. Ambiguity can be problematic.`, severity: "low"});
    }


    setAnalysisResult(mockResults);
    setIsLoading(false);
    toast({
      title: "Conceptual Analysis Complete",
      description: `The document "${fileName}" has been conceptually analyzed. Results are displayed below.`,
    });
  };

  const getFindingVariant = (type: AnalysisFinding['type'], severity?: AnalysisFinding['severity']) => {
    if (type === 'issue') {
      if (severity === 'high') return 'destructive';
      if (severity === 'medium') return 'default'; // Consider an orange-like variant if available
      return 'default'; // default for low severity issues or unassigned
    }
    if (type === 'right') return 'default'; // Consider a blue/info variant
    return 'default'; // Default for observations
  }

  const getFindingIcon = (type: AnalysisFinding['type']) => {
    if (type === 'issue') return <AlertTriangle className="h-4 w-4" />;
    if (type === 'right') return <FileTextIcon className="h-4 w-4" />; // Placeholder, could be Gavel or Shield
    return <Lightbulb className="h-4 w-4" />;
  }


  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileScan className="w-7 h-7 text-primary" /> Document Analyzer (Conceptual)
          </CardTitle>
          <CardDescription>
            Upload a legal document (e.g., notice, order) for a conceptual AI-powered analysis. The AI will (conceptually) scan for common due process elements and highlight potential areas of concern or relevant rights.
            <br />
            <strong>This is a prototype. No actual document processing or AI analysis occurs. Files are not sent to any server.</strong>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleAnalyzeDocument}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="documentUpload">Upload Document</Label>
              <Input
                id="documentUpload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png" // Common document/image types
                className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {fileName && <p className="text-xs text-muted-foreground mt-1">Selected: {fileName}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || !selectedFile}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Analyze Document (Conceptual)
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {analysisResult && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Conceptual Analysis Results for "{fileName}"</CardTitle>
            <CardDescription>
              Below are conceptual findings. These are examples of what an AI might highlight and are <strong>not legal advice</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysisResult.map((finding, index) => (
              <Alert key={index} variant={getFindingVariant(finding.type, finding.severity)} className={
                finding.type === 'issue' && finding.severity === 'medium' ? 'border-orange-500 text-orange-700 [&>svg]:text-orange-500' : 
                finding.type === 'issue' && finding.severity === 'low' ? 'border-yellow-500 text-yellow-700 [&>svg]:text-yellow-500' :
                finding.type === 'right' ? 'border-blue-500 text-blue-700 [&>svg]:text-blue-500' : ''
              }>
                {getFindingIcon(finding.type)}
                <AlertTitle className="capitalize">
                  {finding.type}{finding.type === 'issue' && finding.severity ? ` (${finding.severity})` : ''}
                </AlertTitle>
                <AlertDescription>{finding.text}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" /> What the AI (Conceptually) Looks For
          </CardTitle>
          <CardDescription>
            In a fully implemented system, the AI would be trained to identify various due process elements and potential issues. Examples include:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {DUE_PROCESS_ELEMENTS_TO_CHECK.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <Alert variant="default" className="mt-4 border-accent bg-accent/10">
            <AlertTriangle className="h-4 w-4 text-accent" />
            <AlertTitle className="font-semibold">Important Disclaimer</AlertTitle>
            <AlertDescription>
              This Document Analyzer is a conceptual tool. The analysis provided is illustrative and <strong>not a substitute for review by a qualified legal professional</strong>. Always have legal documents reviewed by an attorney. No files are actually uploaded or analyzed by AI in this prototype.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

