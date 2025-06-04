
// src/app/law-school-in-a-box/page.tsx
"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GraduationCap, BookOpen, CheckSquare, Edit3, AlertTriangle, ChevronRight } from "lucide-react";

interface MicroCourse {
  id: string;
  title: string;
  description: string;
  contentOverview: string;
  learningObjectives: string[];
  keyConcepts: { concept: string; explanation: string }[];
  conceptualQuizText: string;
  conceptualPracticeDoc?: {
    text: string;
    linkText: string;
    href: string;
  };
}

const microCourses: MicroCourse[] = [
  {
    id: "motion-to-dismiss",
    title: "How to Draft a Motion to Dismiss (Conceptual Overview)",
    description: "Learn the basic components and strategic considerations for drafting a Motion to Dismiss, particularly under rules like FRCP 12(b)(6) for failure to state a claim.",
    contentOverview: "This micro-course provides a general overview of a Motion to Dismiss. It focuses on its primary purpose, such as challenging the sufficiency of a complaint. We will cover typical sections: Introduction/Preliminary Statement, Statement of Facts (as alleged by Plaintiff), Standard of Review (e.g., Twombly/Iqbal for federal 12(b)(6)), Legal Argument (applying the standard to the complaint's allegations), and Conclusion/Prayer for Relief. This overview is for informational purposes and is not a substitute for legal research and advice specific to your jurisdiction and case.",
    learningObjectives: [
      "Understand the purpose and common grounds for a Motion to Dismiss.",
      "Identify the typical sections found in a Motion to Dismiss.",
      "Recognize the importance of the 'Standard of Review' in such motions.",
      "Appreciate that specific legal arguments must be tailored to the facts of the complaint and applicable law."
    ],
    keyConcepts: [
      { concept: "FRCP 12(b)(6)", explanation: "Federal Rule of Civil Procedure allowing a defendant to request dismissal for 'failure to state a claim upon which relief can be granted.'" },
      { concept: "Plausibility Standard (Twombly/Iqbal)", explanation: "In federal court, a complaint must contain sufficient factual matter, accepted as true, to 'state a claim to relief that is plausible on its face.'" },
      { concept: "Subject Matter Jurisdiction (FRCP 12(b)(1))", explanation: "A ground for dismissal if the court lacks authority to hear the type of case." },
      { concept: "Personal Jurisdiction (FRCP 12(b)(2))", explanation: "A ground for dismissal if the court lacks power over the defendant." }
    ],
    conceptualQuizText: "A quiz for this section would test your understanding of when a Motion to Dismiss is appropriate and its key components. For example: 'True or False: A Motion to Dismiss under 12(b)(6) allows the defendant to introduce new evidence.' (Answer: False). Interactive quizzes are a future goal for this platform.",
    conceptualPracticeDoc: {
      text: "To practice with a general template, you can explore the Motion to Dismiss option in our Document Generator. Remember to adapt it heavily.",
      linkText: "Go to Document Generator (Motion to Dismiss)",
      href: "/document-generator?suggested=motionToDismiss"
    }
  },
  {
    id: "frcp-basics",
    title: "Understanding the Federal Rules of Civil Procedure (FRCP) - Introduction",
    description: "An introductory look at the FRCP, which govern how civil (non-criminal) lawsuits are handled in U.S. federal courts.",
    contentOverview: "The Federal Rules of Civil Procedure (FRCP) are a comprehensive set of rules that dictate the process for civil litigation in United States district courts. This overview introduces the general scope of the rules (Rule 1), how a lawsuit is started (Rule 3 & 4 - Complaint & Summons), different types of pleadings (Rule 7), motions (Rule 12), discovery (Rules 26-37), and how cases can be resolved (e.g., summary judgment - Rule 56, trial - Rules 38-53, judgment - Rule 54). Understanding the FRCP is essential for anyone involved in federal civil litigation. This is a high-level introduction; the FRCP are detailed and best understood through careful study and application.",
    learningObjectives: [
      "Grasp the overall purpose of the FRCP in ensuring a just, speedy, and inexpensive determination of every action.",
      "Identify key stages of a federal civil lawsuit (e.g., pleadings, discovery, motions, trial).",
      "Understand that specific rules govern each aspect of litigation.",
      "Recognize that the FRCP are complex and require careful attention to detail."
    ],
    keyConcepts: [
      { concept: "Pleadings", explanation: "Formal written documents filed with the court that state the parties' claims and defenses (e.g., Complaint, Answer)." },
      { concept: "Discovery", explanation: "The pre-trial process where parties exchange information and evidence relevant to the case (e.g., interrogatories, depositions, document requests)." },
      { concept: "Motion", explanation: "A request made to the court for an order or ruling." },
      { concept: "Jurisdiction", explanation: "The court's authority to hear a case and make decisions." }
    ],
    conceptualQuizText: "A quiz might ask: 'Which phase of litigation involves formal questioning of witnesses under oath outside of court?' (Answer: Discovery, specifically depositions). Interactive quizzes are planned for future updates.",
  },
  {
    id: "legal-research-basics",
    title: "Basics of Legal Research (Conceptual Guide)",
    description: "An introduction to the fundamental concepts and tools for conducting legal research.",
    contentOverview: "Effective legal research is crucial for understanding the law applicable to your situation. This guide introduces primary sources (constitutions, statutes, case law, regulations) and secondary sources (legal encyclopedias, treatises, law review articles). We'll conceptually discuss how to find relevant case law (precedent) using online databases (like those provided by LexisNexis, Westlaw, or free resources like Google Scholar and court websites) and how to 'Shepardize' or 'KeyCite' a case to ensure it's still good law. Understanding how to read and interpret statutes and case opinions is also key. This is a foundational overview; comprehensive legal research is a skill developed over time.",
    learningObjectives: [
      "Differentiate between primary and secondary legal sources.",
      "Understand the concept of precedent (stare decisis) in case law.",
      "Identify common tools and databases for legal research (conceptual).",
      "Appreciate the importance of checking if legal authority is still current and valid."
    ],
    keyConcepts: [
      { concept: "Primary Sources", explanation: "The law itself (e.g., constitutions, statutes, court opinions, administrative regulations)." },
      { concept: "Secondary Sources", explanation: "Commentary on or analysis of the law (e.g., legal encyclopedias, law review articles, treatises). Useful for understanding and finding primary sources." },
      { concept: "Case Law (Precedent)", explanation: "Decisions made by courts in previous similar cases, which can be binding on lower courts in the same jurisdiction." },
      { concept: "Statutes", explanation: "Laws enacted by a legislative body (e.g., Congress, state legislatures)." }
    ],
    conceptualQuizText: "A sample quiz question: 'Is a law review article a primary or secondary source of law?' (Answer: Secondary). Full interactive quizzes are a future development goal.",
    conceptualPracticeDoc: {
      text: "To find example statutes or case law summaries, you can explore the Legal Library within this app.",
      linkText: "Go to Legal Library",
      href: "/legal-library"
    }
  }
];

export default function LawSchoolInABoxPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-primary" />
            Law School in a Box - Microcourses
          </CardTitle>
          <CardDescription>
            Explore these microcourses for foundational knowledge on various legal topics. 
            Each course provides an overview, learning objectives, and key concepts. 
            Interactive quizzes and guided document practice are conceptual future enhancements.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {microCourses.map((course) => (
            <Card key={course.id} className="shadow-md">
              <Accordion type="single" collapsible>
                <AccordionItem value={course.id}>
                  <AccordionTrigger className="px-6 py-4 text-lg hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <BookOpen className="w-6 h-6 text-primary flex-shrink-0" />
                      {course.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 space-y-4">
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                    
                    <div className="mt-4 p-4 bg-muted/30 rounded-md">
                      <h4 className="font-semibold text-md mb-2">Course Overview:</h4>
                      <p className="text-sm whitespace-pre-wrap">{course.contentOverview}</p>
                    </div>

                    <div className="mt-4 p-4 bg-muted/30 rounded-md">
                      <h4 className="font-semibold text-md mb-2">Learning Objectives:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {course.learningObjectives.map((obj, index) => (
                          <li key={index}>{obj}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 p-4 bg-muted/30 rounded-md">
                      <h4 className="font-semibold text-md mb-2">Key Concepts:</h4>
                      <ul className="space-y-2 text-sm">
                        {course.keyConcepts.map((concept, index) => (
                           <li key={index}>
                             <strong>{concept.concept}:</strong> {concept.explanation}
                           </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-100/30 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-md">
                      <h4 className="font-semibold text-md mb-2 text-blue-700 dark:text-blue-300">Quiz (Conceptual)</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400">{course.conceptualQuizText}</p>
                       <Button variant="outline" size="sm" className="mt-2" disabled>
                        <CheckSquare className="mr-2 h-4 w-4" /> Start Conceptual Quiz (Future Feature)
                      </Button>
                    </div>

                    {course.conceptualPracticeDoc && (
                      <div className="mt-4 p-4 bg-green-100/30 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-md">
                        <h4 className="font-semibold text-md mb-2 text-green-700 dark:text-green-300">Practice Document Writing (Conceptual)</h4>
                        <p className="text-sm text-green-600 dark:text-green-400">{course.conceptualPracticeDoc.text}</p>
                        <Link href={course.conceptualPracticeDoc.href} passHref>
                          <Button variant="outline" size="sm" className="mt-2 border-green-500 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-800/50">
                            <Edit3 className="mr-2 h-4 w-4" /> {course.conceptualPracticeDoc.linkText} <ChevronRight className="ml-1 h-4 w-4"/>
                          </Button>
                        </Link>
                         <p className="text-xs text-green-500 dark:text-green-500 mt-1">Note: This links to a template. Interactive feedback on your writing is a future goal.</p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          ))}
          
          <Alert variant="default" className="mt-6 border-accent bg-accent/10">
            <AlertTriangle className="h-5 w-5 text-accent" />
            <AlertTitle className="font-semibold text-accent">Important Disclaimer</AlertTitle>
            <AlertDescription>
              The "Law School in a Box" microcourses are for general informational and educational purposes only. They are highly simplified overviews and do not constitute legal advice, nor are they a substitute for formal legal education or consultation with a qualified attorney. Laws and legal procedures are complex and vary significantly by jurisdiction. Always consult with a legal professional for advice tailored to your specific situation.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
