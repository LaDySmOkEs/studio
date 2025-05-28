// src/app/help-faq/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, BookOpen, Lightbulb, ShieldCheck, Landmark } from "lucide-react";

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
                <p><strong>Disclaimer:</strong> DUE PROCESS AI is an informational tool and does not provide legal advice. All outputs, suggestions, and document templates are for guidance only and should be thoroughly reviewed and verified by a qualified legal professional before use. Always consult with an attorney for advice specific to your situation and jurisdiction.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg">
                <BookOpen className="w-5 h-5 mr-2 text-accent" />
                How do I use the Document Generator?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>Navigate to the "Document Generator" page. Select your state, city/county, and court level to tailor the document to your jurisdiction. Then, choose a document type (e.g., Motion, Affidavit, Complaint) from the dropdown. A template will be generated in the text area below. You can edit this template directly and then copy it to your clipboard.</p>
                <p>It's crucial to replace all placeholders like "[Your Name]" or "[Case Details]" with your specific information and review the document carefully. The templates are general starting points and do not constitute legal advice.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-jurisdiction">
              <AccordionTrigger className="text-lg">
                <Landmark className="w-5 h-5 mr-2 text-accent" />
                Understanding Legal Jurisdictions
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p><strong>Why Jurisdiction Matters:</strong> Jurisdiction determines which court system (federal, state, local) has the authority to hear a particular case. Filing in the wrong court can lead to your case being dismissed. Different laws, procedures, and even interpretations of laws apply in different jurisdictions.</p>
                
                <div>
                  <h4 className="font-semibold text-foreground/90">Federal Jurisdiction:</h4>
                  <p>Federal courts primarily hear cases involving:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>Violations of federal laws (e.g., U.S. Constitution, federal statutes like civil rights under 42 U.S.C. § 1983, bankruptcy, copyright, patent law).</li>
                    <li>Cases where the United States government is a party (either suing or being sued).</li>
                    <li>Disputes between states.</li>
                    <li>"Diversity Jurisdiction": Cases between citizens of different states where the amount in controversy exceeds a certain threshold (currently $75,000).</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground/90">State Jurisdiction:</h4>
                  <p>State courts have broad jurisdiction over most types of cases that occur within their borders, including:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>Most criminal matters (violations of state laws).</li>
                    <li>Family law (divorce, child custody, adoption).</li>
                    <li>Contract disputes and business law.</li>
                    <li>Personal injury cases (torts).</li>
                    <li>Probate and estate matters.</li>
                  </ul>
                  <p className="mt-1">Each state has its own court system, typically structured with trial courts, appellate courts, and a state supreme court.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground/90">Local/County/Municipal Courts:</h4>
                  <p>These courts are generally part of the state court system but handle more localized or specific types of cases, such as:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>Traffic violations.</li>
                    <li>Small claims cases (disputes involving small amounts of money).</li>
                    <li>Minor criminal offenses (misdemeanors).</li>
                    <li>Violations of local ordinances (e.g., zoning, public health).</li>
                  </ul>
                  <p className="mt-1">The names and functions of these courts vary significantly from state to state.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground/90">Overlapping & Special Jurisdictions:</h4>
                  <p>Jurisdictional issues can become complex, especially with:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li><strong>Concurrent Jurisdiction:</strong> Situations where both federal and state courts might have the authority to hear a case. The plaintiff may choose where to file, or a defendant might seek to "remove" a case from state to federal court if certain conditions are met.</li>
                    <li><strong>Tribal Jurisdiction:</strong> Native American tribal courts have jurisdiction over certain matters involving tribal members or occurring on tribal lands. This is a distinct and complex area of law.</li>
                    <li><strong>Military Jurisdiction:</strong> Governed by the Uniform Code of Military Justice (UCMJ) for U.S. service members.</li>
                    <li><strong>Territorial Courts:</strong> For U.S. territories like Puerto Rico, Guam, etc.</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground/90">Determining Jurisdiction for Your Case:</h4>
                  <p>This can be one ofr the most challenging aspects of starting a legal action. Key factors include where the incident occurred, where the parties reside or do business, and the subject matter of the dispute. Incorrectly determining jurisdiction can have serious consequences for your case.</p>
                </div>

                <p><strong>Disclaimer:</strong> This information is for general educational purposes only. Determining the correct jurisdiction for a specific legal matter is crucial and often complex. Always consult with a qualified legal professional for advice tailored to your situation.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg">
                <ShieldCheck className="w-5 h-5 mr-2 text-accent" />
                How is my data handled regarding security and privacy?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p><strong>Prototype Data Handling:</strong></p>
                <ul className="list-disc pl-5">
                    <li>Features like the "Rights Recorder" and "Trauma Log" in this prototype store data <strong>locally in your browser</strong>. This data is not uploaded to any server, meaning it's private to your current browser session but will be cleared if you close the browser window or clear your browser's data.</li>
                    <li>Case details submitted for "Case Analysis" are processed by an AI model to provide suggestions. Please be mindful and avoid submitting highly sensitive personal identifiable information that you do not want processed by an external AI service.</li>
                </ul>
                <p className="mt-2"><strong>Production System Considerations:</strong></p>
                <p>For a production version of DUE PROCESS AI, the following measures would be paramount:</p>
                <ul className="list-disc pl-5">
                    <li><strong>Data Security:</strong> All sensitive legal information would be stored using robust encryption-at-rest and in-transit. Access controls and regular security audits would be implemented.</li>
                    <li><strong>Privacy:</strong> Clear data retention policies would be established, detailing how long sensitive legal narratives and other user data are stored and under what conditions they are deleted. We would aim for compliance with relevant data privacy regulations (e.g., GDPR, CCPA if applicable).</li>
                    <li><strong>Scalability:</strong> The application's backend and infrastructure would be designed to accommodate a growing user base and increasing data load, ensuring performance and reliability. The frontend is built using Next.js, a modern framework capable of handling scalable web applications.</li>
                </ul>
                <p className="mt-2">We are committed to user privacy and data security. These principles would guide the development of a production-ready application.</p>
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
