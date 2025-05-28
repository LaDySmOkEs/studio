
// src/app/filing-assistant/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LibrarySquare, AlertTriangle, CheckSquare, ExternalLink } from "lucide-react";

const generalSteps = [
  {
    title: "1. Research Your Court's Specific E-Filing Rules",
    content: "This is the most critical step. Every court (federal, state, county, even specific judges) can have unique rules. Look for 'e-filing rules', 'local rules', 'administrative orders', or 'pro se filer information' on your court's official website. Pay attention to document formatting (PDF/A often required), file size limits, and how to handle exhibits."
  },
  {
    title: "2. Register for an E-Filing Account",
    content: "Most courts require you to create an account on their designated e-filing portal (e.g., PACER for federal courts, or state-specific systems). This may involve providing personal information and agreeing to terms of service."
  },
  {
    title: "3. Prepare Your Documents Correctly",
    content: "Ensure your documents are in the required format (usually searchable PDF). Redact sensitive information (Social Security numbers, minor children's names, financial account numbers) as per court rules. Ensure all documents are signed (electronically or scanned signature as per rules)."
  },
  {
    title: "4. Understand Filing Fees",
    content: "Identify if there are filing fees for your document type. Determine how to pay them through the portal. If you cannot afford the fees, research the court's process for applying for a fee waiver ('in forma pauperis')."
  },
  {
    title: "5. Upload and Submit Your Documents",
    content: "Carefully follow the portal's instructions for uploading your main document and any exhibits. Select the correct case type, document type, and party information. Double-check everything before final submission."
  },
  {
    title: "6. Confirmation and Notice of Electronic Filing (NEF)",
    content: "After successful submission, you should receive a confirmation, often called a Notice of Electronic Filing (NEF). Save this NEF as proof of filing. It will contain the date and time your document was officially filed."
  },
  {
    title: "7. Serve Other Parties",
    content: "E-filing your document with the court does not automatically mean other parties in the case have been served. You must still follow your court's rules for 'service of process'. Some e-filing systems may handle service for registered attorneys, but pro se litigants often have additional responsibilities. Check your local rules carefully."
  }
];

const keyQuestions = [
  {
    id: "kq1",
    question: "Are my documents in the correct format (e.g., searchable PDF, PDF/A)?",
    details: "Courts are very specific about file formats. Non-compliant files may be rejected."
  },
  {
    id: "kq2",
    question: "Have I redacted all sensitive personal information as required by court rules?",
    details: "Failure to redact can lead to privacy issues and document rejection. Check Rule 5.2 of the Federal Rules of Civil Procedure for federal guidance, and your state's equivalent."
  },
  {
    id: "kq3",
    question: "Do I need to attach any exhibits? If so, how should they be labeled and uploaded?",
    details: "Courts have rules on how exhibits should be identified (e.g., Exhibit A, Exhibit 1) and whether they should be uploaded as separate files or part of the main document."
  },
  {
    id: "kq4",
    question: "Have I included all necessary signatures and dates?",
    details: "Ensure your signature (electronic or scanned, as per rules) and the date are on the document."
  },
  {
    id: "kq5",
    question: "Do I know the correct case type and filing codes for my document?",
    details: "E-filing systems often require you to categorize your filing using specific codes. Choosing the wrong one can cause delays."
  },
  {
    id: "kq6",
    question: "Am I aware of all applicable filing fees, or have I applied for a fee waiver if eligible?",
    details: "Filings are often not accepted until fees are paid or a waiver is granted."
  },
  {
    id: "kq7",
    question: "How will I serve the other parties in the case after e-filing?",
    details: "Confirm if the e-filing system handles service or if you need to serve them separately (e.g., by mail, email as per rules)."
  },
  {
    id: "kq8",
    question: "Have I checked for any local rules or standing orders specific to my judge or court division?",
    details: "These can supplement the general court rules and are crucial to follow."
  },
  {
    id: "kq9",
    question: "Do I have a way to save or print my Notice of Electronic Filing (NEF) as proof of submission?",
    details: "This is your official receipt from the court."
  }
];

export default function FilingAssistantPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <LibrarySquare className="w-7 h-7 text-primary" />
            Pro Per Court Filing Assistant (Guidance)
          </CardTitle>
          <CardDescription>
            This guide provides general information and key considerations for individuals representing themselves (pro per or pro se) when e-filing court documents.
            E-filing procedures vary significantly by jurisdiction. <strong>Always consult your specific court's official website, rules, and clerk's office for accurate and up-to-date instructions.</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>This is Not Legal Advice</AlertTitle>
            <AlertDescription>
              The information on this page is for educational purposes only and should not be considered a substitute for advice from a qualified legal professional. We are not responsible for any errors or omissions, or for any actions taken based on this information. E-filing rules are complex and subject to change.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>General E-Filing Steps</CardTitle>
              <CardDescription>While specifics vary, here's a general overview of the e-filing process.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {generalSteps.map((step, index) => (
                  <AccordionItem value={`step-${index}`} key={index}>
                    <AccordionTrigger className="text-left hover:no-underline">{step.title}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{step.content}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Questions & Prompts for Filers</CardTitle>
              <CardDescription>Before and during e-filing, consider these important questions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {keyQuestions.map((item) => (
                <div key={item.id} className="flex items-start p-3 border rounded-md bg-background">
                  <CheckSquare className="w-5 h-5 mr-3 mt-1 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium">{item.question}</p>
                    {item.details && <p className="text-xs text-muted-foreground mt-1">{item.details}</p>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Tips for Pro Per E-Filers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Start Early:</strong> Don't wait until the last minute. Technical issues can occur.</li>
                    <li><strong>Read Everything:</strong> Carefully read all instructions on the court's website and e-filing portal.</li>
                    <li><strong>Court Clerk is a Resource:</strong> While they can't give legal advice, court clerks can often help with procedural questions about e-filing. Be polite and patient.</li>
                    <li><strong>Keep Records:</strong> Save copies of everything you file, all confirmations (NEFs), and any correspondence.</li>
                    <li><strong>Double-Check File Names:</strong> Use clear, descriptive file names as per court guidance (e.g., "Motion_to_Dismiss_Smith_v_Jones.pdf").</li>
                    <li><strong>Test with Non-Critical Filings (If Possible):</strong> Some courts might have a training or test environment, or you might file a simple document first (like a notice of appearance if required) to get familiar.</li>
                     <li><strong>Look for Pro Se Help Desks:</strong> Some courts or local bar associations offer help desks or resources specifically for self-represented litigants.</li>
                </ul>
            </CardContent>
          </Card>

          <Alert variant="default" className="border-accent bg-accent/10">
            <ExternalLink className="h-5 w-5 text-accent" />
            <AlertTitle className="font-semibold text-accent">Always Verify with Your Court</AlertTitle>
            <AlertDescription>
              E-filing procedures and requirements can change. The official court website for the jurisdiction where you are filing is your primary source of information. If you are unsure about any step, contact the court clerk's office. For legal advice and strategy, consult a qualified attorney.
            </AlertDescription>
          </Alert>

        </CardContent>
      </Card>
    </div>
  );
}
