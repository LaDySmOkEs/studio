// src/app/help-faq/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, BookOpen, Lightbulb } from "lucide-react";

export default function HelpFaqPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-primary" />
            Help & Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Find answers to common questions and learn more about using DUE PROCESS AI.
            This section will be expanded with tutorials and detailed guides.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg">
                <Lightbulb className="w-5 h-5 mr-2 text-accent" />
                What is DUE PROCESS AI?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>DUE PROCESS AI is an AI-powered legal assistance tool designed to help users understand legal concepts, generate document templates, organize case information, and more. It aims to make legal processes more accessible.</p>
                <p><strong>Disclaimer:</strong> DUE PROCESS AI does not provide legal advice. It is a tool for informational and organizational purposes only. Always consult with a qualified legal professional for advice specific to your situation.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg">
                <BookOpen className="w-5 h-5 mr-2 text-accent" />
                How do I use the Document Generator?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>Navigate to the "Document Generator" page. Select your state, city/county, and court level to tailor the document to your jurisdiction. Then, choose a document type (e.g., Motion, Affidavit, Complaint) from the dropdown. A template will be generated in the text area below. You can edit this template directly and then copy it to your clipboard.</p>
                <p>It's crucial to replace all placeholders like "[Your Name]" or "[Case Details]" with your specific information and review the document carefully. The templates are general starting points.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg">
                <Lightbulb className="w-5 h-5 mr-2 text-accent" />
                Is my data secure?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>For features like the "Rights Recorder" and "Trauma Log" in this prototype, data is stored locally in your browser and is not uploaded to any server. This means it's private to your session but will be cleared if you close the browser window or clear your browser's data.</p>
                <p>Case details submitted for "Case Analysis" are processed by an AI model to provide suggestions. Please avoid submitting highly sensitive personal identifiable information that you do not want processed by an external AI service.</p>
                <p>For a production version of this application, robust data security and privacy measures would be implemented according to industry best practices and legal requirements.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg">
                <BookOpen className="w-5 h-5 mr-2 text-accent" />
                Where can I find tutorials?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>Tutorials and more detailed guides are planned for future updates. They will cover each feature in-depth, providing step-by-step instructions and tips for best use. Check back here for updates!</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Card className="bg-secondary/50">
            <CardHeader>
                <CardTitle className="text-xl">Need More Help?</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">If you have questions not covered here, or if you're experiencing technical difficulties, please imagine a "Contact Support" button here. In a real application, this would lead to a support channel.</p>
                {/* Placeholder for future contact form or email */}
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
}
