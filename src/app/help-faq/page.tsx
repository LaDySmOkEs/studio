// src/app/help-faq/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, BookOpen, Lightbulb, ShieldCheck, Landmark, Info, Siren } from "lucide-react";

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

             <AccordionItem value="item-ai-transparency">
              <AccordionTrigger className="text-lg">
                <Info className="w-5 h-5 mr-2 text-accent" />
                AI Transparency and How Suggestions Are Made
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>DUE PROCESS AI utilizes advanced artificial intelligence (AI) models, specifically Large Language Models (LLMs), to provide suggestions and analyze information related to legal contexts. Here’s a general overview of how it works and our commitment to transparency:</p>
                
                <div>
                  <h4 className="font-semibold text-foreground/90">How the AI Works (Conceptual):</h4>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li><strong>Pattern Recognition:</strong> The AI is trained on a vast dataset of legal texts, case law, statutes, and other relevant documents. It learns to identify patterns, correlations, and common structures within this data.</li>
                    <li><strong>Input Processing:</strong> When you provide information (e.g., case details in the Case Analysis feature), the AI processes this input to extract key terms, facts, and context.</li>
                    <li><strong>Generating Suggestions:</strong> Based on the patterns it has learned, the AI generates suggestions (e.g., relevant laws, document types, potential due process concerns). This is a probabilistic process; the AI predicts what is most likely to be relevant based on its training.</li>
                    <li><strong>Not Human Understanding:</strong> It's crucial to understand that the AI does not "understand" law or your specific situation in the way a human lawyer does. It doesn't have personal experiences, consciousness, or the ability to apply nuanced legal judgment to unique factual scenarios. Its outputs are based on the data it was trained on.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground/90">Our Commitment to Transparency:</h4>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li><strong>Confidence Scores:</strong> In features like Case Analysis, we provide a "Confidence Score." This score is an AI-generated estimate of how well the provided information aligns with patterns the AI recognizes. The "How is this score determined?" section within Case Analysis offers more detail on the factors influencing this score.</li>
                    <li><strong>Clear Disclaimers:</strong> We consistently emphasize that DUE PROCESS AI is an informational tool and not a substitute for professional legal advice. All AI-generated outputs must be reviewed by a qualified legal professional.</li>
                    <li><strong>Conceptual Features:</strong> Many advanced AI capabilities (like dynamic follow-up questions or OCR analysis) are presented as "conceptual" in this prototype to clearly distinguish current functionality from future possibilities.</li>
                    <li><strong>No Guarantees:</strong> The AI's suggestions are not infallible and should not be taken as definitive legal conclusions or predictions of case outcomes.</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground/90">Continuous Improvement (Conceptual):</h4>
                  <p>In a production system, features allowing user feedback on AI suggestions (like the "Structured Verification" phase in Case Analysis) would ideally contribute to the ongoing refinement and improvement of the AI models. However, this learning mechanism is not active in the current prototype.</p>
                </div>

                <p>We believe in responsible AI development. Providing transparency about how our AI works and its limitations is key to ensuring users can leverage DUE PROCESS AI effectively and safely as a supportive tool.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-pattern-recognition">
              <AccordionTrigger className="text-lg">
                <Siren className="w-5 h-5 mr-2 text-accent" />
                Conceptual: Pattern Recognition &amp; Systemic Issue Alerts
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>One of the long-term visions for a tool like DUE PROCESS AI involves leveraging the power of collective information to identify broader patterns of potential systemic issues.</p>
                
                <div>
                  <h4 className="font-semibold text-foreground/90">How It Could Work (Conceptual):</h4>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li><strong>Aggregated Data Analysis:</strong> In a highly secure and privacy-preserving manner, the system could analyze anonymized data from many users who voluntarily opt-in to share generalized information about their issues (e.g., type of problem, involved agency/jurisdiction, nature of potential due process violation, but without specific personal case facts).</li>
                    <li><strong>Identifying Patterns:</strong> AI algorithms could be trained to detect recurring patterns—for instance, a high number of similar due process concerns (like consistent lack of proper notice) reported against a specific county's agency, or a particular type of procedural irregularity becoming common in a certain type of case across a state.</li>
                    <li><strong>Systemic Issue Flags:</strong> If significant patterns emerge that suggest a potential systemic problem rather than isolated incidents, the system could flag this.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground/90">Potential Benefits (Conceptual):</h4>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li><strong>Early Warning System:</strong> Could act as an early warning for civil rights organizations, legal aid societies, or oversight bodies about potential systemic abuses.</li>
                    <li><strong>Informing Advocacy:</strong> Data-driven insights could help advocacy groups target their efforts more effectively.</li>
                    <li><strong>Supporting Broader Action:</strong> In some cases, identifying widespread, similar issues is a precursor to class action lawsuits or calls for investigation by bodies like the Department of Justice (DOJ) Civil Rights Division. The app could (conceptually) provide information on how users with similar concerns might connect with relevant organizations or understand options for group complaints, always with the strong guidance to seek independent legal advice.</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground/90">Important Considerations:</h4>
                  <p>Implementing such a feature would require overcoming significant technical, ethical, and legal challenges, including:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                     <li>Ensuring robust data anonymization and user privacy.</li>
                     <li>Preventing misuse of the platform for unverified claims.</li>
                     <li>Clearly defining the app's role and avoiding any actions that could be construed as organizing legal action or providing legal advice.</li>
                     <li>Developing highly accurate AI models for pattern detection.</li>
                  </ul>
                </div>

                <p><strong>Disclaimer: This Pattern Recognition &amp; Systemic Issue Alerts feature is purely conceptual and is NOT implemented in the current version of DUE PROCESS AI.</strong> It represents a potential future direction for advanced legal tech tools, contingent on responsible development and addressing the complexities involved.</p>
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
                  <h4 className="font-semibold text-foreground/90">Overlapping &amp; Special Jurisdictions:</h4>
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
