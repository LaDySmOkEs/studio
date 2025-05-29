
// src/app/help-faq/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, BookOpen, Lightbulb, ShieldCheck, Landmark, Info, Siren, Film, Users, ExternalLinkIcon, AlertTriangle as AlertTriangleIcon, Anchor, Route, UserCheck, ScrollText, Brain, PocketKnife, BellRing } from "lucide-react";

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
                <p>Our goal is to provide you with comprehensive information and powerful organizational tools, assisting you in understanding and preparing for your engagement with the legal system. We aim to help level the playing field by making knowledge more accessible, allowing you to be a more informed and empowered participant in your own legal matters, particularly if you are representing yourself (in propria persona / pro per).</p>
                <p className="font-semibold text-foreground/90">This app is especially useful for:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>People pursuing civil rights claims, including those under 42 U.S.C. § 1983.</li>
                  <li>Victims of selective prosecution or police misconduct seeking to understand their rights and options.</li>
                  <li>Individuals in rural areas or tribal jurisdictions who may have limited access to legal professionals.</li>
                  <li>Families and advocates seeking justice or clarity for incarcerated or persecuted loved ones.</li>
                </ul>
                <p className="mt-2"><strong>Disclaimer:</strong> DUE PROCESS AI is an informational tool and does not provide legal advice. All outputs, suggestions, and document templates are for guidance only and should be thoroughly reviewed and verified by a qualified legal professional before use. Always consult with an attorney for advice specific to your situation and jurisdiction. This tool is not a substitute for professional legal representation.</p>
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

            <AccordionItem value="item-self-advocacy-engagement">
              <AccordionTrigger className="text-lg">
                <UserCheck className="w-5 h-5 mr-2 text-accent" />
                Tips for Self-Advocacy & Engaging with Counsel
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>Navigating the legal system can be challenging, especially if you are representing yourself (in propria persona / pro per) or working with appointed counsel. While DUE PROCESS AI cannot provide legal advice, its tools can help you stay organized and informed. Here are some general tips:</p>
                
                <div>
                  <h4 className="font-semibold text-foreground/90">Stay Organized:</h4>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li><strong>Timeline:</strong> Use the "Timeline & Event Log" to keep a chronological record of all important dates, communications, filings, and events related to your case. This can be invaluable for recalling details.</li>
                    <li><strong>Evidence:</strong> Use the "Evidence Compiler" to gather and label any documents, photos, videos, or notes relevant to your case. Having evidence organized makes it easier to understand and present.</li>
                    <li><strong>Documents:</strong> Keep copies of all documents you send or receive. The "Document Generator" can help you create initial drafts, but always keep the final versions.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground/90">Preparing for Meetings (with any legal representative):</h4>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>Write down your main points and questions beforehand.</li>
                    <li>Bring copies of relevant documents, organized by date or topic. Your timeline and compiled evidence can help here.</li>
                    <li>Be honest and provide all relevant information, even if it seems unfavorable.</li>
                    <li>Take notes during the meeting.</li>
                  </ul>
                </div>
                 <div>
                  <h4 className="font-semibold text-foreground/90">Understanding Your Rights & Procedures:</h4>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>Utilize the "Know Your Rights" section in the Rights Recorder and the "Due Process Checklist" to understand basic rights and common procedures.</li>
                    <li>The "Filing Assistant" provides general guidance on e-filing, but always refer to your specific court's rules.</li>
                    <li>The "Court Directory" can help you find contact information for court personnel if you have procedural questions (they cannot give legal advice).</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground/90">If Representing Yourself (Pro Per / In Propria Persona):</h4>
                  <p>Representing yourself is a significant undertaking. DUE PROCESS AI aims to provide tools and information to assist you. Be prepared to:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                     <li>Learn your court's specific Rules of Procedure and Rules of Evidence. These are critical.</li>
                     <li>Understand deadlines. Missing them can have serious consequences.</li>
                     <li>Be respectful and professional in all interactions with the court and opposing parties.</li>
                     <li>Consider using the "Mock Trial Simulator" to get a conceptual feel for courtroom interactions.</li>
                  </ul>
                </div>

                <p className="mt-2"><strong>Important Disclaimer:</strong> These are general tips for organization and preparation. They are not legal advice. Every case is unique, and the law is complex. If you have legal representation, work closely with your attorney. If you are representing yourself, strongly consider seeking at least a consultation with an attorney to understand your options and the complexities of your case. Legal aid resources are listed on the "Legal Aid Referral" page.</p>
              </AccordionContent>
            </AccordionItem>


            <AccordionItem value="item-pattern-recognition">
              <AccordionTrigger className="text-lg">
                <Siren className="w-5 h-5 mr-2 text-accent" />
                Conceptual: Pattern Recognition & Systemic Issue Alerts
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

                <p><strong>Disclaimer: This Pattern Recognition & Systemic Issue Alerts feature is purely conceptual and is NOT implemented in the current version of DUE PROCESS AI.</strong> It represents a potential future direction for advanced legal tech tools, contingent on responsible development and addressing the complexities involved.</p>
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

            <AccordionItem value="item-chain-of-command">
              <AccordionTrigger className="text-lg">
                <Route className="w-5 h-5 mr-2 text-accent" />
                How do I find the right "Chain of Command" to file a complaint?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>Determining the correct "chain of command" or entity to file a complaint with can be challenging as it varies greatly depending on who or what organization the complaint is about, and your specific location. The AI in this app cannot determine this for your specific case. However, here's some general guidance on how to research this:</p>
                
                <div>
                  <h4 className="font-semibold text-foreground/90">General Steps for Research:</h4>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li><strong>Identify the Entity:</strong> Be clear about which specific person, agency, department, or company your complaint concerns.</li>
                    <li><strong>Check Official Websites:</strong> Most government agencies, police departments, and larger companies have websites. Look for sections like "Contact Us," "File a Complaint," "Internal Affairs," "Professional Standards," "Ethics Office," or "Ombudsman."</li>
                    <li><strong>Look for Complaint Policies/Procedures:</strong> Some organizations publish their complaint procedures online. These documents can outline the steps to take and the appropriate office to contact.</li>
                    <li><strong>Professional Licensing Boards:</strong> If your complaint is about a licensed professional (e.g., doctor, lawyer, contractor, therapist), search for the relevant state licensing board. They usually handle complaints regarding professional misconduct.</li>
                    <li><strong>Inspector General (IG) Offices:</strong> Many federal and some state government agencies have an Inspector General's office responsible for investigating waste, fraud, and abuse within that agency.</li>
                    <li><strong>City/County Clerk or Manager's Office:</strong> For issues with local government services or employees, the city or county clerk's office, or the city/county manager's office, may be able to direct you to the appropriate complaint channel.</li>
                    <li><strong>Keep Records:</strong> When you do make contact, keep detailed records of who you spoke to, when, and what was said or advised.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground/90">Specific Examples (General):</h4>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li><strong>Police Misconduct:</strong> Typically, the first step is the Internal Affairs Division (IAD) or Professional Standards Bureau of the specific police department. Some cities also have independent Civilian Complaint Review Boards (CCRB).</li>
                    <li><strong>Judicial Misconduct:</strong> Each state has a commission or board responsible for judicial conduct and discipline. For federal judges, complaints are handled through the judicial councils of the federal circuits.</li>
                    <li><strong>Consumer Complaints:</strong> Against a business, you might start with the Better Business Bureau (BBB), your state's Attorney General's office (Consumer Protection Division), or relevant federal agencies like the Federal Trade Commission (FTC) or Consumer Financial Protection Bureau (CFPB).</li>
                  </ul>
                </div>
                
                <p><strong>Disclaimer:</strong> This information is general guidance only and not legal advice. Procedures and appropriate authorities vary greatly by jurisdiction and the nature of the complaint. Always try to find the official, local procedures for your specific situation. If you are unsure, consulting with an attorney can help you identify the correct avenues for your complaint.</p>
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
                  <p>This can be one of the most challenging aspects of starting a legal action. Key factors include where the incident occurred, where the parties reside or do business, and the subject matter of the dispute. Incorrectly determining jurisdiction can have serious consequences for your case.</p>
                </div>

                <p><strong>Disclaimer:</strong> This information is for general educational purposes only. Determining the correct jurisdiction for a specific legal matter is crucial and often complex. Always consult with a qualified legal professional for advice tailored to your situation.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="common-maritime-law">
              <AccordionTrigger className="text-lg">
                <Anchor className="w-5 h-5 mr-2 text-accent" />
                Understanding Common Law, Maritime Law, and Jurisdictional Differences
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>The legal world is vast, with different systems of law applying to different situations. Two foundational systems often discussed are Common Law and Maritime Law (also known as Admiralty Law).</p>
                
                <div>
                  <h4 className="font-semibold text-foreground/90">Common Law:</h4>
                  <p>Common Law is the system of law primarily derived from judicial decisions (case law or precedent) rather than from statutes passed by a legislature. It originated in England and forms the basis of the legal systems in many English-speaking countries, including the United States (for most state and federal matters not governed by specific statutes).</p>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>Applies to a wide range of civil and criminal matters, such as contracts, torts (personal injuries), property disputes, and most crimes.</li>
                    <li>Relies heavily on the principle of "stare decisis," where past court decisions guide current ones.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground/90">Maritime Law (Admiralty Law):</h4>
                  <p>Maritime Law is a distinct body of law that governs activities, transactions, and disputes occurring on navigable waters. This includes oceans, seas, and often major lakes and rivers connected to interstate or international commerce.</p>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>Covers issues such as shipping, navigation, marine commerce, carriage of goods by sea, marine insurance, salvage operations, collisions between vessels, and injuries to seamen or passengers.</li>
                    <li>Has its own unique historical development and includes both domestic laws and international conventions.</li>
                    <li>In the United States, federal courts have exclusive jurisdiction over most admiralty and maritime cases (Article III, Section 2 of the U.S. Constitution). This means such cases are typically heard in federal district courts.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground/90">Navigating Jurisdictional Differences:</h4>
                  <p>Understanding which body of law and which court system (jurisdiction) applies is crucial:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>If your legal issue arises from activities on land and doesn't involve specific federal statutes, it's likely governed by state common law and statutes, and heard in state court (unless federal jurisdiction applies for other reasons, like diversity of citizenship or a federal question).</li>
                    <li>If your issue is inherently maritime in nature (e.g., a dispute over a shipping contract, an injury on a vessel in navigable waters), then maritime law will likely apply, and the case would typically be filed in a U.S. federal district court.</li>
                    <li>The distinction can sometimes be complex, for example, an injury occurring on a dock might raise questions about whether maritime or state law applies.</li>
                  </ul>
                </div>
                
                <p><strong>Disclaimer:</strong> This is a very simplified overview of complex legal concepts. Determining whether common law or maritime law applies, and which court has jurisdiction, is a critical legal determination that often requires specialized knowledge. Misunderstanding these aspects can have significant consequences for a case. <strong>Always consult with a qualified attorney, particularly one with experience in maritime law if your situation involves activities on or related to navigable waters, for advice specific to your situation.</strong></p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="exclusive-equity-jurisprudence">
              <AccordionTrigger className="text-lg">
                <ScrollText className="w-5 h-5 mr-2 text-accent" />
                Understanding Exclusive Equity Jurisprudence
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p><strong>What is Equity?</strong> Historically, "equity" developed as a separate system of justice alongside "common law" courts in England. Common law courts primarily offered monetary damages as a remedy. Courts of Equity (like the Court of Chancery) could provide other types of remedies when monetary damages were inadequate or unavailable.</p>
                
                <div>
                  <h4 className="font-semibold text-foreground/90">Exclusive Equity Jurisprudence:</h4>
                  <p>This refers to matters where *only* a court of equity had the authority to provide a remedy. Common law courts offered no solution for these types of issues. Examples traditionally include:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li><strong>Trusts:</strong> Creating and enforcing trusts (where one person holds property for the benefit of another).</li>
                    <li><strong>Specific Performance of Contracts:</strong> Ordering a party to actually perform their obligations under a contract (e.g., to sell a unique piece of land), rather than just paying damages for breach.</li>
                    <li><strong>Injunctions:</strong> Court orders requiring a party to do or refrain from doing a specific act.</li>
                    <li><strong>Accounting:</strong> Requiring a party (like a fiduciary) to provide a detailed accounting of funds or property they managed.</li>
                    <li><strong>Rescission and Reformation of Contracts:</strong> Cancelling or correcting a contract due to fraud, mistake, or duress.</li>
                    <li><strong>Fiduciary Duties:</strong> Enforcing the duties of loyalty and care owed by fiduciaries (e.g., trustees, guardians, agents).</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground/90">Concurrent and Auxiliary Jurisdiction:</h4>
                   <p>Equity also had "concurrent jurisdiction" (where both equity and law courts could offer a remedy, but equity's might be more suitable) and "auxiliary jurisdiction" (where equity assisted common law courts, e.g., by compelling discovery of documents).</p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground/90">Modern Systems:</h4>
                  <p>In most U.S. jurisdictions today, the separate courts of law and equity have been merged. This means a single court system can typically grant both legal (damages) and equitable (non-monetary) remedies. However, the underlying principles of equity and the distinction between legal and equitable claims and remedies remain crucial. A party seeking an equitable remedy usually still needs to show that a legal remedy (like money damages) would be inadequate.</p>
                </div>
                
                <p><strong>Disclaimer:</strong> This is a simplified explanation of a complex area of law with a rich history. The specific application of equitable principles and the availability of equitable remedies depend heavily on the facts of a case and the laws of the particular jurisdiction. <strong>Always consult with a qualified legal professional for advice on matters involving equity or any other legal issue.</strong></p>
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
                    <li>Features like the "Rights Recorder," "Evidence Compiler," "Timeline & Event Log," and "Trauma Log" in this prototype store data <strong>locally in your browser's `localStorage` or in-session memory</strong>. This means the data is generally private to your browser on your device and is not sent to any server. Case details entered for "Case Analysis" are also saved to browser `localStorage` to be reused across different app features. This data persists until explicitly cleared by you or if you clear all browser data for this site.</li>
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

            <AccordionItem value="strawman-sovereign">
              <AccordionTrigger className="text-lg">
                <AlertTriangleIcon className="w-5 h-5 mr-2 text-destructive" />
                What about "Strawman" or "Sovereign Citizen" theories?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>
                  You may encounter discussions about concepts like the "strawman" theory or "sovereign citizen" arguments. These often suggest that individuals have a secret legal personality (the "strawman") created by the government, or that individuals can declare themselves "sovereign" and therefore not subject to governmental laws or courts.
                </p>
                <p>
                  <strong>It is crucial to understand that these theories are not recognized as valid legal arguments by courts in the United States or most other established legal systems.</strong>
                </p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Judges consistently reject arguments based on these theories.</li>
                  <li>Attempting to use them in court can seriously harm your case, lead to sanctions, or even result in criminal charges for contempt of court or filing frivolous lawsuits.</li>
                  <li>These theories often involve complex and misapplied interpretations of legal terms and historical documents.</li>
                </ul>
                <p>
                  While DUE PROCESS AI aims to provide information about the legal system, it focuses on established legal principles and procedures. Relying on unrecognized theories can prevent you from effectively addressing your legal situation.
                </p>
                <p>
                  <strong>If you are facing a legal issue, it is highly recommended to seek advice from a qualified attorney who operates within the established legal framework.</strong> They can help you understand your rights and obligations under the actual laws that apply to your situation.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-advanced-ai-concepts">
                <AccordionTrigger className="text-lg">
                    <PocketKnife className="w-5 h-5 mr-2 text-accent" /> 
                    Advanced AI Tools & Future Concepts (Conceptual)
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-3">
                    <p>DUE PROCESS AI is continually evolving. Here are some advanced AI-powered tools and concepts that are part of our future vision, though they are complex and not yet implemented:</p>
                    
                    <div>
                        <h4 className="font-semibold text-foreground/90">Deadline Calculator (Conceptual)</h4>
                        <p>An AI tool that could help calculate important legal deadlines based on the type of filing, jurisdiction, and relevant court rules. This would require a sophisticated understanding of procedural rules, which vary greatly.</p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-foreground/90">Truly Context-Aware AI Co-litigator (Conceptual)</h4>
                        <p>While our current Interactive Assistant uses saved case summaries for some context, a future AI Co-litigator could more deeply understand the nuances of a user's case from all their inputs across the app (timeline events, evidence details, document drafts). It might then offer more tailored general information, identify potential next steps with greater accuracy, or help draft more specific questions for a human lawyer. This involves significant advancements in natural language understanding and reasoning specific to the legal domain.</p>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold text-foreground/90">AI-Powered "Charge Interpreter" (Conceptual)</h4>
                        <p>An advanced tool that could take specific criminal charges (e.g., from a complaint or indictment) and explain them in plain language, outline common elements the prosecution needs to prove, and suggest general defense considerations or motions (like a "Motion to Suppress" if facts suggest it). This is distinct from providing legal advice and would be for informational purposes to help users understand the charges against them.</p>
                    </div>

                    <p><strong>Disclaimer:</strong> These advanced features are conceptual and represent aspirational goals for future development. They require significant AI research, robust data, and careful ethical consideration before implementation. The current app provides foundational tools and information.</p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="smart-notifications-conceptual">
              <AccordionTrigger className="text-lg">
                <BellRing className="w-5 h-5 mr-2 text-accent" />
                Conceptual: Smart Notifications
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>
                  "Smart Notifications" are envisioned as a future proactive feature of DUE PROCESS AI. The goal would be to help users stay on top of crucial aspects of their case by providing timely alerts and reminders.
                </p>
                <h4 className="font-semibold text-foreground/90 mt-2">Potential Notification Types (Conceptual):</h4>
                <ul className="list-disc pl-5">
                  <li><strong>Filing Deadlines:</strong> Based on information entered in the Timeline & Event Log or Document Generator, the system could (conceptually) calculate and remind users of upcoming court filing deadlines.</li>
                  <li><strong>Evidence Review Reminders:</strong> Prompt users to review or organize evidence they've compiled.</li>
                  <li><strong>Court Feedback (Conceptual):</strong> In a highly advanced system integrated with court e-filing systems (which is a major undertaking), it might provide notifications on the status of submitted documents.</li>
                  <li><strong>Red Flag Alerts:</strong> If AI analysis (from Document Analyzer or Case Analysis) detects potentially critical issues like missing documents for a standard procedure or language in a draft that might be problematic, it could raise a conceptual alert for user review.</li>
                </ul>
                <h4 className="font-semibold text-foreground/90 mt-2">Challenges:</h4>
                <p>
                  Implementing reliable smart notifications, especially for deadlines and "red flags," requires very accurate data input from the user, sophisticated AI analysis, and potentially integration with external systems. Ensuring accuracy and avoiding misleading alerts would be paramount.
                </p>
                <p><strong>Note:</strong> This feature is conceptual and not currently implemented. Users must independently track all deadlines and rely on professional legal advice for critical case decisions and document review.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-citation-mode">
              <AccordionTrigger className="text-lg">
                <ExternalLinkIcon className="w-5 h-5 mr-2 text-accent" />
                Conceptual: Citation Mode
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>A "Citation Mode" is a conceptual feature aimed at enhancing the credibility and utility of AI-generated explanations and suggestions. In this mode, the AI would strive to provide references to relevant case law (e.g., <em>Goldberg v. Kelly</em>, <em>Mathews v. Eldridge</em>), statutes, or legal principles that underpin its responses.</p>
                <h4 className="font-semibold text-foreground/90 mt-2">Potential Benefits:</h4>
                <ul className="list-disc pl-5">
                  <li><strong>Increased Trust:</strong> Citing sources can increase user confidence in the information provided.</li>
                  <li><strong>Further Research:</strong> Users can look up the cited cases or laws for deeper understanding.</li>
                  <li><strong>Professional Review:</strong> Makes it easier for legal professionals to verify the basis of AI suggestions.</li>
                </ul>
                <h4 className="font-semibold text-foreground/90 mt-2">Challenges:</h4>
                <p>Implementing this accurately requires sophisticated AI capabilities, including reliable information retrieval and ensuring citations are contextually appropriate and up-to-date. This is a complex task that goes beyond simple pattern matching.</p>
                <p><strong>Note:</strong> This feature is conceptual and not currently implemented. AI outputs should always be verified by a qualified legal professional, even if citations were provided.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-kyr-library">
              <AccordionTrigger className="text-lg">
                <Film className="w-5 h-5 mr-2 text-accent" />
                Conceptual: "Know Your Rights" Library
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>A "Know Your Rights" Library is envisioned as a dedicated section of the app containing engaging and easily digestible content explaining core legal concepts and rights. This could include:</p>
                <ul className="list-disc pl-5">
                  <li>Short, informative videos.</li>
                  <li>Clear infographics.</li>
                  <li>Concise articles on fundamental rights in various contexts (e.g., during a police stop, in housing disputes, in employment matters).</li>
                </ul>
                <h4 className="font-semibold text-foreground/90 mt-2">Goal:</h4>
                <p>To make complex legal information more accessible and understandable to a broad audience, empowering users with foundational knowledge.</p>
                <p><strong>Note:</strong> While the "Rights Recorder" page currently includes some "Know Your Rights" text, a full library with multimedia content is a conceptual future enhancement.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-user-roles">
              <AccordionTrigger className="text-lg">
                <Users className="w-5 h-5 mr-2 text-accent" />
                Conceptual: User Role Switching
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-2">
                <p>"User Role Switching" is a conceptual feature that would allow different types of users, particularly legal professionals, to interact with the application in ways tailored to their needs. For example:</p>
                <ul className="list-disc pl-5">
                  <li><strong>Advocates/Guardians:</strong> Could potentially use the app to organize information or draft initial documents on behalf of a client or ward, with appropriate consents and safeguards.</li>
                  <li><strong>Attorneys:</strong> Might use the tool for preliminary research, drafting assistance, or to quickly access certain information, understanding its limitations as a non-replacement for professional judgment.</li>
                </ul>
                <h4 className="font-semibold text-foreground/90 mt-2">Requirements:</h4>
                <p>Implementing this would require a robust user authentication system, clear role definitions, and careful consideration of ethical implications, data privacy (especially client confidentiality), and the terms of service.</p>
                <p><strong>Note:</strong> This is a conceptual feature for future development and is not currently available. The app is presently designed for individual user assistance with the understanding that they will consult legal professionals.</p>
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

    