
// src/app/document-generator/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, Info, LibrarySquare, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

type DocumentType = 
  | "motion" | "affidavit" | "complaint" 
  | "motionForBailReduction" | "discoveryRequest" | "petitionForExpungement" 
  | "foiaRequest" 
  | "civilCoverSheet" | "summons" | "motionToQuash" | "motionToDismiss" 
  | "inFormaPauperisApplication" | "declarationOfNextFriend"
  | "tpoChallengeResponse"
  | "settlementAgreement" // Added new type
  | "";

const LOCAL_STORAGE_KEY = "dueProcessAICaseAnalysisData"; // Same key as in CaseAnalysisPage

interface StoredCaseData {
  caseDetails: string;
  caseCategory: "general" | "criminal" | "civil";
}


const DOCUMENT_TEMPLATES: Record<Exclude<DocumentType, "">, string> = {
  motion: `[MOTION TITLE]

Case Name: [Plaintiff Name] v. [Defendant Name]
Case Number: [Case Number]
Court: [Court Name]

Introduction
1. [State who is filing the motion and what is being requested.]

Background
2. [Provide a brief summary of relevant case facts.]
3. [Explain why this motion is necessary at this time.]

Argument
4. [Present legal arguments supporting the motion. Cite relevant statutes, case law, and rules.]
   a. [Argument Point 1]
   b. [Argument Point 2]

Conclusion
5. For the foregoing reasons, [Movant Name] respectfully requests that this Court grant this motion and [State the specific relief sought].

Dated: [Date]

Respectfully submitted,
[Your Name/Law Firm Name]
[Your Address]
[Your Phone Number]
[Your Email Address]
`,
  affidavit: `[AFFIDAVIT TITLE]

State of [State]
County of [County]

I, [Your Full Name], being duly sworn, depose and state as follows:

1. I am over the age of 18 and competent to make this affidavit.
2. [State your relationship to the case or the facts you are attesting to.]
3. [Present facts in numbered paragraphs. Each paragraph should contain a single fact or a closely related set of facts. Be specific and stick to what you personally know.]
   Example: On [Date], at approximately [Time], I witnessed [Describe event].
4. [Continue with additional facts.]
5. All statements made herein are true and correct to the best of my knowledge and belief.

____________________________
[Your Full Name] - Affiant

Sworn to and subscribed before me this [Day] day of [Month], [Year].

____________________________
Notary Public
My Commission Expires: [Date]
(Notary Seal)
`,
  complaint: `[YOUR FULL NAME / PLAINTIFF'S FULL NAME, if different, and "Next Friend" status if applicable]
[Your Street Address]
[Your City, State, Zip Code]
[Your Phone Number]
[Your Email Address]
Plaintiff, Pro Per (or indicate if represented by counsel)

[NAME OF COURT - e.g., UNITED STATES DISTRICT COURT FOR THE DISTRICT OF [Your District]]
[Division, if applicable - e.g., [City] Division]

[Plaintiff Name(s), including "Next Friend" status if applicable, e.g., JANE DOE, individually, and as Next Friend of JOHN DOE, a minor],
  Plaintiff(s),

v. Case No.: [Leave blank - to be filled by Court Clerk]

[Defendant Name(s), with titles if known, e.g., OFFICER JOHN SMITH, in his individual and official capacities; CITY OF ANYTOWN],
  Defendant(s).

COMPLAINT FOR VIOLATION OF CIVIL RIGHTS (42 U.S.C. § 1983) AND [OTHER CAUSES OF ACTION, IF ANY]
(JURY TRIAL DEMANDED, if applicable)

I. INTRODUCTION
1. This is an action for [Briefly describe the nature of the lawsuit, e.g., violation of constitutional rights, personal injury, breach of contract]. This complaint seeks [Briefly state what you are asking the court to do, e.g., monetary damages, injunctive relief].

II. JURISDICTION AND VENUE
2. This Court has subject matter jurisdiction over this action pursuant to [State the basis for the court's jurisdiction. For federal civil rights claims under 42 U.S.C. § 1983, cite 28 U.S.C. § 1331 (federal question) and 28 U.S.C. § 1343 (civil rights). For state law claims, state the basis for state court jurisdiction or supplemental jurisdiction if in federal court (28 U.S.C. § 1367)].
3. Venue is proper in this district pursuant to [State the basis for venue, e.g., 28 U.S.C. § 1391(b) because a substantial part of the events or omissions giving rise to the claim occurred in this district, or a defendant resides in this district].

III. PARTIES
4. Plaintiff, [Plaintiff's Full Name], is an individual residing in [City, State]. [If filing as "Next Friend," add: Plaintiff, [Next Friend'S Full Name], is the [Relationship, e.g., parent and legal guardian] of [Minor/Incompetent Person's Full Name], and brings this action on their behalf as Next Friend. [Minor/Incompetent Person's Full Name] is an individual residing in [City, State].]
5. Defendant, [Defendant's Full Name and Title, if applicable, e.g., Officer John Smith], is sued in their [Individual and/or Official capacity, if a state actor]. At all times relevant to this complaint, Defendant [Defendant's Full Name] was acting under color of state law. [Provide address or location if known].
6. Defendant, [Second Defendant's Full Name and Title, e.g., City of Anytown], is a [Type of entity, e.g., municipal corporation organized under the laws of the State of [State]]. [Provide address or location if known].
   [Add more defendants as necessary]

IV. FACTUAL ALLEGATIONS
   (Describe the events in detail, in chronological order. Use separate numbered paragraphs for each distinct fact or event.)
7. On or about [Date], at approximately [Time], at [Location], the following occurred: [Describe the event].
8. [Continue with specific facts, detailing who did what, when, and where. Be objective and stick to the facts.]
9. [Provide details about any injuries, damages, or harm suffered.]

V. CAUSES OF ACTION / CLAIMS FOR RELIEF

COUNT I: VIOLATION OF CIVIL RIGHTS UNDER 42 U.S.C. § 1983 - [SPECIFIC CONSTITUTIONAL RIGHT, e.g., FOURTH AMENDMENT - UNLAWFUL SEIZURE] (Against Defendant [Name(s) of individual state actor(s)])
10. Plaintiffs re-allege and incorporate by reference paragraphs 1 through [Last factual paragraph number] as if fully set forth herein.
11. Defendant(s) [Name(s)], while acting under color of state law, deprived Plaintiff(s) of their rights secured by the [Specify Amendment, e.g., Fourth and Fourteenth Amendments] to the United States Constitution by [Describe specifically how the Defendant(s) violated the right, e.g., unlawfully arresting Plaintiff without probable cause, using excessive force].
12. The actions of Defendant(s) [Name(s)] were [intentional, willful, reckless, and/or deliberately indifferent] to Plaintiff(s)'s constitutional rights.
13. As a direct and proximate result of Defendant(s)' [Name(s)] unconstitutional conduct, Plaintiff(s) has suffered [Describe damages, e.g., physical injuries, emotional distress, financial loss, deprivation of liberty].

COUNT II: [NAME OF SECOND CAUSE OF ACTION, e.g., State Law Claim for Assault and Battery] (Against Defendant [Name(s)])
14. Plaintiffs re-allege and incorporate by reference paragraphs 1 through [Last factual paragraph number] as if fully set forth herein.
15. [State the elements of this cause of action and how the defendant's actions meet those elements under your state's law.]
16. As a direct and proximate result of Defendant's [conduct], Plaintiff(s) has suffered damages including [List damages].
    [Add more counts as necessary for other claims]

VI. PRAYER FOR RELIEF
WHEREFORE, Plaintiff(s) respectfully request(s) that this Court enter judgment in their favor and against Defendant(s), jointly and severally, for the following relief:
A. Compensatory damages in an amount to be determined at trial, for [e.g., physical injuries, emotional pain and suffering, lost wages, medical expenses];
B. Punitive damages against Defendant(s) [Name(s) of individual defendants sued in their individual capacity, if applicable] in an amount to be determined at trial, for their [willful, malicious, reckless] conduct;
C. Declaratory relief stating that Defendant(s)' actions violated Plaintiff(s)' rights;
D. Injunctive relief ordering Defendant(s) to [Specify action, e.g., cease certain conduct, implement new policies];
E. Reasonable attorneys' fees and costs of this action pursuant to 42 U.S.C. § 1988 (if applicable) and/or [other relevant statutes];
F. Pre-judgment and post-judgment interest as allowed by law; and
G. Such other and further relief as this Court deems just and proper.

DEMAND FOR JURY TRIAL
Plaintiff(s) hereby demand a trial by jury on all issues so triable in this action.

Dated: [Date]

Respectfully submitted,

____________________________
[Your Signature]
[Your Typed Full Name]
Plaintiff, Pro Per (or Attorney Name, Bar Number, Firm if represented)
`,
  motionForBailReduction: `[MOTION FOR BAIL REDUCTION]

Case Name: [State/Commonwealth/People] v. [Defendant Name]
Case Number: [Case Number]
Court: [Court Name]

Defendant, [Defendant Name], by and through undersigned counsel (or Pro Per), respectfully moves this Honorable Court to reduce the bail previously set in this case. In support of this motion, Defendant states as follows:

1. Current Bail Status: [Describe current bail amount and conditions, e.g., "Bail is currently set at $X cash or $Y bond."]
2. Defendant's Ties to the Community: [Describe defendant's local residence, family, employment, etc., to show they are not a flight risk.]
3. Inability to Post Current Bail: [Explain why the defendant cannot afford the current bail amount.]
4. Lack of Danger to the Community: [Argue why the defendant does not pose a danger to the community if released on reduced bail or personal recognizance.]
5. Proposed Bail: [Suggest a specific reduced bail amount or conditions, e.g., "Defendant requests bail be reduced to $Z or release on personal recognizance with conditions such as..."]
6. Legal Argument: [Cite any relevant statutes or case law supporting bail reduction for similar circumstances or for defendants with these characteristics.]

WHEREFORE, Defendant respectfully requests that this Court grant this motion and reduce bail to an amount and upon conditions that are reasonable and just.

Dated: [Date]

Respectfully submitted,
[Your Name/Law Firm Name]
[Your Address]
[Your Phone Number]
[Your Email Address]
`,
  discoveryRequest: `[DEFENDANT'S REQUEST FOR DISCOVERY AND BRADY MATERIAL]

Case Name: [State/Commonwealth/People] v. [Defendant Name]
Case Number: [Case Number]
Court: [Court Name]

TO: Prosecuting Attorney
[Prosecutor's Name and Address]

Defendant, [Defendant Name], by and through undersigned counsel (or Pro Per), hereby requests discovery and inspection of all materials to which the Defendant is entitled pursuant to [State's Rules of Criminal Procedure, e.g., Rule X], the United States Constitution, including Brady v. Maryland, 373 U.S. 83 (1963), Giglio v. United States, 405 U.S. 150 (1972), and their progeny.

This request includes, but is not limited to, the following:

1. All statements of the Defendant, oral, written, or recorded.
2. All statements of any co-defendants or alleged co-conspirators.
3. All reports, notes, or statements of law enforcement officers or other government agents related to this case.
4. All results or reports of physical or mental examinations, scientific tests, or experiments.
5. A list of all tangible objects, documents, photographs, or other items obtained from or belonging to the Defendant, or obtained from others, which the prosecution intends to use at trial or which are material to the preparation of the defense.
6. A list of names and addresses of all persons whom the prosecution intends to call as witnesses at trial, together with their relevant written or recorded statements (Witness Lists).
7. All evidence favorable to the Defendant on the issue of guilt or punishment (Brady Material), including but not limited to:
    a. Evidence that could impeach the credibility of prosecution witnesses.
    b. Evidence that points to the innocence of the Defendant or suggests another party may be guilty.
    c. Evidence that could mitigate the sentence if the Defendant is convicted.
8. Any deals, promises, or inducements made to any prosecution witness.

This request is ongoing, and Defendant requests that the prosecution supplement its discovery responses as additional information or materials become available.

Dated: [Date]

Respectfully submitted,
[Your Name/Law Firm Name]
[Your Address]
[Your Phone Number]
[Your Email Address]
`,
  petitionForExpungement: `[PETITION FOR EXPUNGEMENT/SEALING OF CRIMINAL RECORD]

Case Name (if applicable): [Original Case Name, e.g., State v. Your Name]
Case Number (if applicable): [Original Case Number]
Court: [Court Name where conviction/arrest occurred]

Petitioner: [Your Full Name]
Date of Birth: [Your DOB]
Address: [Your Current Address]
Phone: [Your Phone]
Email: [Your Email]

I, [Your Full Name], the Petitioner, respectfully request this Honorable Court to order the expungement (or sealing) of my criminal record(s) pertaining to the arrest(s) and/or conviction(s) detailed below, pursuant to [Cite Specific State Statute, e.g., State Statute § XX-XXX].

1. Details of Arrest/Conviction to be Expunged/Sealed:
   a. Date of Arrest/Conviction: [Date]
   b. Offense(s): [List specific charges]
   c. Arresting Agency/Jurisdiction: [Name of Police Department/County]
   d. Disposition (if applicable): [e.g., Dismissed, Nolle Prosequi, Acquitted, Convicted - specify if conviction]
   e. Sentence (if convicted): [Details of sentence]

2. Eligibility for Expungement/Sealing:
   a. [Explain why you are eligible under the cited statute. This often includes factors like: time elapsed since conviction/sentence completion, nature of the offense, no subsequent convictions, completion of all sentence terms, etc. BE VERY SPECIFIC TO YOUR JURISDICTION'S LAW.]
   b. [Example: "More than X years have passed since the completion of my sentence for the above-referenced misdemeanor offense, as required by {Statute}."]
   c. [Example: "I have no other pending criminal charges and have not been convicted of any other crimes since this incident."]

3. Reasons for Request:
   [Briefly explain why you are seeking expungement/sealing, e.g., to improve employment prospects, housing opportunities, restore civil rights, personal peace of mind. This section may or may not be required by your state.]

4. Supporting Documentation (if any, attach as exhibits):
   [e.g., Certificate of Disposition, proof of sentence completion, character references (if allowed/helpful)]

WHEREFORE, Petitioner prays for an Order from this Court directing all relevant law enforcement agencies, courts, and other state entities to expunge (or seal) all records related to the arrest(s) and/or conviction(s) described herein.

I declare under penalty of perjury under the laws of the State of [Your State] that the foregoing is true and correct.

Dated: [Date]

____________________________
[Your Full Name] - Petitioner (Pro Per)

(Notary Public section may be required depending on jurisdiction)
`,
  foiaRequest: `[Your Full Name/Organization Name]
[Your Street Address]
[Your City, State, Zip Code]
[Your Phone Number]
[Your Email Address]

[Date]

FOIA Officer
[Name of Federal Agency]
[Agency Address - Find specific FOIA office address on agency's website]
[City, State, Zip Code]

Re: Freedom of Information Act Request

Dear FOIA Officer:

Pursuant to the Freedom of Information Act (FOIA), 5 U.S.C. § 552, I am requesting access to the following records:

(Clearly and specifically describe the records you are seeking. Be as specific as possible regarding names, dates, subject matter, record types, etc. For example:
- "All emails between [Official's Name/Title] and [Another Person/Entity] regarding [Subject] from [Start Date] to [End Date]."
- "Copies of all final reports, studies, or analyses concerning [Topic] conducted or commissioned by your agency in the past [Number] years."
- "The complete case file for [Case Name/Number], if applicable and publicly releasable under FOIA.")

I would prefer to receive the information in [Specify format, e.g., electronic format (PDF if possible), paper copies].

Regarding fees, I am willing to pay reasonable duplication fees up to $[Specify amount, e.g., $25.00]. If the anticipated fees will exceed this amount, please contact me before processing my request.
(Optional: If you believe you are eligible for a fee waiver or reduction, state that here and explain why. Common reasons include being a representative of the news media, an educational or noncommercial scientific institution, or if disclosure is in the public interest.)

If any part of this request is denied, please provide a detailed statement of the grounds for withholding each document or portion thereof, citing the specific FOIA exemption(s) claimed. Also, please inform me of FOIA appeal procedures.

Thank you for your time and attention to this matter. I look forward to your response within the 20 working days mandated by the statute.

Sincerely,

____________________________
[Your Typed Full Name/Signature]
`,
  civilCoverSheet: `CIVIL COVER SHEET (Generic Example)
**IMPORTANT: This is a generic example. Most courts require you to use their specific, official Civil Cover Sheet form (e.g., Form JS 44 for U.S. Federal District Courts). Obtain the correct form from your court's website or clerk's office.**

1.  **Court:** [Name of Court]
2.  **Plaintiff(s):** [Full Name(s) and Address(es)]
    **Defendant(s):** [Full Name(s) and Address(es)]
3.  **County of Residence of First Listed Plaintiff:** [County] (If U.S. Plaintiff)
    **County of Residence of First Listed Defendant:** [County] (If U.S. Defendant)
4.  **Attorneys (Firm Name, Address, and Telephone Number):**
    **Plaintiff's Attorney (or Pro Per):** [Your Information if Pro Per]
    **Defendant's Attorney:** [Leave blank if unknown]
5.  **Basis of Jurisdiction (Check One):**
    ( ) U.S. Government Plaintiff     ( ) Federal Question (U.S. Government Not a Party)
    ( ) U.S. Government Defendant   ( ) Diversity (Indicate Citizenship of Parties in Item III)
6.  **Citizenship of Principal Parties (For Diversity Cases Only):**
    Plaintiff: Citizen of This State ( ) Citizen of Another State ( ) [Specify State] Citizen or Subject of a Foreign Country ( ) [Specify Country]
    Defendant: Citizen of This State ( ) Citizen of Another State ( ) [Specify State] Citizen or Subject of a Foreign Country ( ) [Specify Country]
7.  **Nature of Suit (Select the one most appropriate):**
    [Examples: Contract, Real Property, Personal Injury, Civil Rights, Prisoner Petitions, Forfeiture/Penalty, Bankruptcy, Social Security, Tax, Immigration, Other Statute - List common categories relevant to the court]
8.  **Cause of Action:** [Briefly state the primary cause of action and cite U.S. civil statute under which you are filing, if any]
9.  **Requested in Complaint:**
    **Class Action:** ( ) Yes ( ) No
    **Monetary Demand:** $ [Amount, or "To be determined"]
    **Jury Demand:** ( ) Yes ( ) No
10. **Related Case(s), If Any:** [List case number(s) if applicable]

Date: [Date] Signature: ____________________________ ([Your Name, Pro Per])
`,
  summons: `SUMMONS IN A CIVIL ACTION (Generic Example)
**IMPORTANT: This is a generic example. Most courts have their own official Summons form that you MUST use. Obtain the correct form from your court's website or clerk's office.**

To: [Defendant's Full Name]
    [Defendant's Address]

A lawsuit has been filed against you.

Within [Number, e.g., 21] days after service of this summons on you (not counting the day you received it) — or [Number, e.g., 60] days if you are the United States or a United States agency, or an officer or employee of the United States described in Fed. R. Civ. P. 12 (a)(2) or (3) — you must serve on the plaintiff an answer to the attached complaint or a motion under Rule 12 of the Federal Rules of Civil Procedure. The answer or motion must be served on the plaintiff or plaintiff's attorney, whose name and address are:

[Plaintiff's Name or Plaintiff's Attorney's Name]
[Plaintiff's or Attorney's Address]
[Plaintiff's or Attorney's Phone Number]
[Plaintiff's or Attorney's Email Address]

If you fail to respond, judgment by default will be entered against you for the relief demanded in the complaint. You also must file your answer or motion with the court.

Date: [Date of Issuance]

____________________________
Clerk of Court (or Deputy Clerk)
(Seal of the Court, if applicable)

---
Proof of Service (To be completed by server)
This summons for [Name of individual served] was received by me on [Date].
[ ] I personally served the summons on the individual at [Place] on [Date]; or
[ ] I left the summons at the individual's dwelling or usual place of abode with [Name of person], a person of suitable age and discretion who resides there, on [Date], and mailed a copy to the individual's last known address; or
[ ] Other (specify):
My fees are $__________ for travel and $__________ for services, for a total of $__________.
I declare under penalty of perjury that this information is true.
Date: _________________ Server's signature: ____________________________
Printed name and title: _________________________________________________
Server's address: ______________________________________________________
`,
  motionToQuash: `[MOTION TO QUASH SERVICE OF SUMMONS / SUBPOENA / ETC.]

Case Name: [Plaintiff Name] v. [Defendant Name]
Case Number: [Case Number]
Court: [Court Name]

[Movant's Name], [Movant's Status, e.g., Defendant], respectfully moves this Court for an order quashing [Describe what is to be quashed, e.g., "the service of summons and complaint in this action," or "the subpoena duces tecum served on [Date] requiring production of documents"]. This motion is made on the grounds that [Briefly state grounds, e.g., "service was improper under Rule 4 of the Federal Rules of Civil Procedure," or "the subpoena is unduly burdensome and seeks irrelevant information"].

This motion is based on this notice of motion, the attached memorandum of points and authorities, the declaration of [Declarant's Name], [any exhibits], and upon such other evidence and argument as may be presented to the Court.

MEMORANDUM OF POINTS AND AUTHORITIES

I. INTRODUCTION
1.  [Briefly state who you are, what you are asking the court to do, and why.]

II. FACTUAL BACKGROUND
2.  [Describe the relevant facts leading up to the service of the document you want quashed. Be specific about dates, times, methods of service, or content of the subpoena.]

III. ARGUMENT
3.  [Present your legal arguments. Explain why the service was defective or why the subpoena is improper. Cite relevant court rules (e.g., Federal Rules of Civil Procedure, State Rules of Civil Procedure) and case law if possible.]
    a.  [Argument Point 1: e.g., "Service of Process Was Defective Because..."]
    b.  [Argument Point 2: e.g., "The Subpoena Seeks Privileged Information..."]

IV. CONCLUSION
4.  For the foregoing reasons, [Movant Name] respectfully requests that this Court grant this motion and quash the [summons/subpoena].

Dated: [Date]

Respectfully submitted,
____________________________
[Your Name, Pro Per / Attorney Name]
[Your Address / Attorney Address]
[Your Phone / Attorney Phone]
[Your Email / Attorney Email]

(Attach Declaration(s) and Exhibit(s) as needed)
`,
  motionToDismiss: `[MOTION TO DISMISS COMPLAINT PURSUANT TO RULE 12(b)(6) FOR FAILURE TO STATE A CLAIM / OR OTHER APPLICABLE RULE]

Case Name: [Plaintiff Name] v. [Defendant Name]
Case Number: [Case Number]
Court: [Court Name]

Defendant, [Defendant's Name], respectfully moves this Court to dismiss Plaintiff's Complaint (or specify counts/claims) pursuant to [Federal Rule of Civil Procedure 12(b)(6) for failure to state a claim upon which relief can be granted / or relevant state rule or other grounds, e.g., lack of subject matter jurisdiction (Rule 12(b)(1)), lack of personal jurisdiction (Rule 12(b)(2))].

This motion is based on this notice of motion, the attached memorandum of points and authorities, [any attached exhibits, though typically for a 12(b)(6) motion, only the complaint is considered], and upon such other evidence and argument as may be presented to the Court.

MEMORANDUM OF POINTS AND AUTHORITIES

I. INTRODUCTION
1.  [Briefly state who you are (e.g., Defendant in this action) and that you are seeking dismissal of the Plaintiff's Complaint (or specific claims). Briefly state the primary reason for dismissal (e.g., "because even if all allegations in the Complaint are taken as true, they do not establish a legally recognized claim for relief.").]

II. STANDARD OF REVIEW (Example for FRCP 12(b)(6))
2.  [Briefly state the legal standard for a motion to dismiss under the cited rule. For example, for a 12(b)(6) motion, the court accepts all well-pleaded factual allegations in the complaint as true and construes them in the light most favorable to the plaintiff. The complaint must contain sufficient factual matter, accepted as true, to 'state a claim to relief that is plausible on its face.' (Citing cases like Bell Atlantic Corp. v. Twombly and Ashcroft v. Iqbal is common here).]

III. ARGUMENT
3.  [This is the core of your motion. Explain, point by point, why the Plaintiff's complaint (or specific claims) should be dismissed based on the legal standard. Analyze the allegations in the complaint against the elements of the claims asserted.]
    a.  [Example: "Plaintiff's First Cause of Action for [Claim Name] Fails Because It Does Not Allege [Missing Element X]."]
        i.  [Discuss the law related to Element X.]
        ii. [Show how Plaintiff's complaint fails to plead facts supporting Element X.]
    b.  [Continue for each claim or reason for dismissal.]

IV. CONCLUSION
4.  For the foregoing reasons, Defendant [Defendant's Name] respectfully requests that this Court grant this motion and dismiss Plaintiff's Complaint [with/without prejudice].

Dated: [Date]

Respectfully submitted,
____________________________
[Your Name, Pro Per / Attorney Name]
[Your Address / Attorney Address]
[Your Phone / Attorney Phone]
[Your Email / Attorney Email]
`,
  inFormaPauperisApplication: `APPLICATION TO PROCEED IN FORMA PAUPERIS AND SUPPORTING DECLARATION (Generic Example)
**IMPORTANT: This is a generic example. Many courts have their own official form for applying to proceed In Forma Pauperis (IFP) that you MUST use. Obtain the correct form from your court's website or clerk's office.**

Case Name: [Plaintiff Name] v. [Defendant Name] (Or "In Re: [Your Name]" if initiating a case)
Case Number: [Case Number, or "To be assigned if new case"]
Court: [Court Name]

Applicant: [Your Full Name]
Address: [Your Street Address, City, State, Zip Code]
Phone Number: [Your Phone Number]
Email Address: [Your Email Address]

I, [Your Full Name], declare that I am the [Plaintiff/Petitioner/Movant/Defendant] in the above-entitled case. In support of my application to proceed in forma pauperis (without prepayment of fees or costs), I state that I am unable to pay the costs of these proceedings and that I am entitled to the relief sought in my [Complaint/Petition/Motion].

I further declare under penalty of perjury that the following information is true and correct:

1.  **Employment:**
    Are you currently employed? ( ) Yes ( ) No
    If yes, name and address of employer: [Employer Name and Address]
    Your occupation: [Your Occupation]
    Gross monthly pay or wages: $ [Amount]

2.  **Other Income:**
    Have you received within the past 12 months any income from a business, profession, or other form of self-employment, or from interest, dividends, an inheritance, Social Security, disability, pensions, annuities, gifts, rents, or other sources? ( ) Yes ( ) No
    If yes, describe each source of income and state the amount received from each during the past 12 months:
    [Source 1]: $ [Amount]
    [Source 2]: $ [Amount]

3.  **Cash and Bank Accounts:**
    Do you have any cash on hand or money in a checking or savings account? ( ) Yes ( ) No
    If yes, state the total amount: $ [Amount]

4.  **Property:**
    Do you own any real estate, stocks, bonds, notes, automobiles, or other valuable property (excluding ordinary household furnishings and clothing)? ( ) Yes ( ) No
    If yes, describe the property and state its approximate value:
    [Property 1]: Value $ [Amount]
    [Property 2]: Value $ [Amount]

5.  **Dependents:**
    List persons who are dependent on you for support, their relationship to you, and their ages:
    [Dependent 1]: [Relationship], Age [Age]
    [Dependent 2]: [Relationship], Age [Age]

6.  **Monthly Expenses (Approximate):**
    Rent/Mortgage: $ [Amount]
    Utilities: $ [Amount]
    Food: $ [Amount]
    Transportation: $ [Amount]
    Other essential expenses: $ [Amount]

I understand that a false statement or answer to any question in this declaration may subject me to penalties for perjury.

Dated: [Date]

____________________________
[Your Signature]
[Your Typed Full Name]
`,
  declarationOfNextFriend: `DECLARATION OF [Next Friend's Full Name]
IN SUPPORT OF FILING AS NEXT FRIEND FOR [Minor/Incompetent Person's Name]

Case Name: [Plaintiff Name] v. [Defendant Name] (Or "In Re: [Minor/Incompetent Person's Name]" if initiating)
Case Number: [Case Number, or "To be assigned"]
Court: [Court Name]

I, [Next Friend's Full Name], declare as follows:

1.  I am the [Relationship to the minor/incompetent person, e.g., "parent and legal guardian," "court-appointed conservator"] of [Full Name of Minor/Incompetent Person] ("the Real Party in Interest").
2.  The Real Party in Interest is [a minor, being [Age] years of age / an adult who has been deemed incompetent to manage their own affairs by [Name of Court, Case Number, Date of Order, if applicable] because [briefly state reason for incompetency, e.g., "of a medical condition diagnosed as X"]].
3.  As a result of their [minority/incompetency], the Real Party in Interest is unable to adequately understand or prosecute this legal action on their own behalf.
4.  I am bringing this action as "Next Friend" on behalf of the Real Party in Interest to [Briefly state the nature of the action and the relief sought, e.g., "assert their claim for personal injuries sustained on [Date]," or "protect their rights concerning [Subject Matter]"].
5.  I have no interests that are adverse to the interests of the Real Party in Interest in this litigation. My sole purpose in acting as Next Friend is to protect and pursue the rights and best interests of the Real Party in Interest.
6.  I understand my duties as Next Friend, including the duty to act in the best interests of the Real Party in Interest and to account for any funds recovered on their behalf as required by law or court order.

I declare under penalty of perjury under the laws of the State of [Your State] that the foregoing is true and correct.

Executed on [Date], at [City, State].

____________________________
[Next Friend's Full Name]
Declarant
`,
tpoChallengeResponse: `[MOTION TO DISSOLVE TEMPORARY PROTECTIVE ORDER / RESPONSE TO PETITION FOR PROTECTIVE ORDER]
**NOTE: This is a very general template. TPO/Restraining Order laws and procedures are highly specific to each state. Always consult your state's laws and court rules, and seek legal advice.**

Case Name: [Petitioner Name] v. [Respondent Name - Your Name]
Case Number: [Case Number of TPO, if assigned]
Court: [Court Name]

Respondent, [Your Full Name], Pro Per, respectfully submits this [Motion to Dissolve Temporary Protective Order / Response to Petition for Protective Order] and states as follows:

I. INTRODUCTION
1.  This [motion/response] is submitted in opposition to the Temporary Protective Order (TPO) issued on [Date TPO was issued] or the Petition for a Protective Order filed by [Petitioner Name] ("Petitioner").
2.  Respondent, [Your Name], denies the allegations made by the Petitioner that form the basis for the [TPO/Petition] and contends that [Briefly state your main argument, e.g., "the TPO was issued based on false or misleading information," or "there is no ongoing threat of harm justifying a protective order," or "Petitioner's request does not meet the legal standard for a protective order in this jurisdiction."].

II. FACTUAL BACKGROUND / RESPONSE TO ALLEGATIONS
   (Respond specifically to each key allegation made by the Petitioner. Use numbered paragraphs. Be factual and calm.)
3.  Regarding Petitioner's allegation that [Quote or summarize Petitioner's first key allegation]: [Your factual response, including dates, times, locations, and what actually happened from your perspective. If you have evidence, refer to it generally, e.g., "This is contradicted by text messages exchanged on that day (see Exhibit A)."].
4.  Regarding Petitioner's allegation that [Quote or summarize Petitioner's second key allegation]: [Your factual response].
5.  [Continue responding to each significant allegation. If an allegation is true, admit it if appropriate, but explain the context if necessary.]
6.  [If applicable, state any facts that support your position that a protective order is not necessary or appropriate, or that the TPO should be dissolved.]

III. ARGUMENT (Optional, focus on facts if Pro Per, but understand the legal standard if possible)
7.  The Petitioner has failed to meet the legal standard required for the issuance of a [permanent protective order / continuation of the TPO] under [Cite your state's relevant statute, e.g., Family Code § XXXX].
8.  [If applicable: "Petitioner has not demonstrated a credible threat of future harm." Or "Respondent poses no threat to Petitioner." Explain why, based on facts.]
9.  [If applicable: "The incidents described do not constitute [domestic violence/harassment/stalking - as defined by your state's law]."]

IV. REQUESTED RELIEF
WHEREFORE, Respondent, [Your Full Name], respectfully requests that this Court:
A. [If TPO issued: DENY Petitioner's request for a permanent protective order and DISSOLVE the Temporary Protective Order issued on [Date].]
B. [If responding to initial petition: DENY Petitioner's Petition for a Protective Order.]
C. [If applicable: Order Petitioner to return any personal property belonging to Respondent that was taken or is being held.]
D. Grant such other and further relief as the Court deems just and proper.

I declare under penalty of perjury under the laws of the State of [Your State] that the foregoing is true and correct to the best of my knowledge and belief.

Dated: [Date]

Respectfully submitted,

____________________________
[Your Full Name], Respondent, Pro Per
[Your Address]
[Your Phone Number]
[Your Email Address]

(Consider attaching exhibits like relevant text messages, emails, photos, or declarations from witnesses, if allowed by your court's rules for this type of response/motion. Label them Exhibit A, Exhibit B, etc.)
`,
settlementAgreement: `SETTLEMENT AGREEMENT AND RELEASE (Generic Example)
**IMPORTANT: This is a very generic template. Settlement agreements are legally binding contracts and should be drafted or reviewed by an attorney to ensure they accurately reflect your understanding and protect your rights.**

This Settlement Agreement and Release ("Agreement") is entered into as of [Date of Agreement], by and between:

1.  **[Your Full Name / Your Company Name]** ("Party A"), located at [Your Address], and
2.  **[Other Party's Full Name / Other Party's Company Name]** ("Party B"), located at [Other Party's Address].

Party A and Party B are collectively referred to as the "Parties."

RECITALS
WHEREAS, a dispute has arisen between the Parties concerning [Briefly describe the nature of the dispute, e.g., "a car accident that occurred on [Date]," or "allegations of breach of contract dated [Date]," or "Case Name: [Case Name], Case Number: [Case Number], pending in [Court Name]"] (the "Dispute");
WHEREAS, the Parties desire to fully and finally resolve all claims, differences, and causes of action related to the Dispute upon the terms and conditions set forth in this Agreement, without any admission of liability by any Party;

NOW, THEREFORE, in consideration of the mutual covenants and promises contained herein, and other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:

1.  **Settlement Payment (if applicable):**
    [Choose one or modify as needed:]
    (a) Within [Number] days of the execution of this Agreement, Party B shall pay to Party A the sum of [Dollar Amount in words] ($[Dollar Amount in numbers]) (the "Settlement Amount"). This payment shall be made by [Method of payment, e.g., certified check, wire transfer to [Account Details]].
    (b) [If no payment, state: "No monetary payment is being made by either Party under this Agreement." Or describe non-monetary consideration.]

2.  **Release of Claims by Party A:**
    Upon [Choose one: "receipt of the Settlement Amount by Party A" / "execution of this Agreement by all Parties"], Party A, on behalf of themselves and their heirs, executors, administrators, successors, and assigns, hereby fully and forever releases and discharges Party B, and its [if Party B is a company: officers, directors, employees, agents, insurers, successors, and assigns], from any and all claims, demands, actions, causes of action, liabilities, damages, costs, expenses, and attorneys' fees, of whatever kind or nature, whether known or unknown, suspected or unsuspected, asserted or unasserted, which Party A ever had, now has, or hereafter can, shall, or may have against Party B, arising from or in any way related to the Dispute.

3.  **Release of Claims by Party B (if applicable - for mutual release):**
    Upon [Choose one: "payment of the Settlement Amount by Party B" / "execution of this Agreement by all Parties"], Party B, on behalf of themselves and their heirs, executors, administrators, successors, and assigns, hereby fully and forever releases and discharges Party A, and its [if Party A is a company: officers, directors, employees, agents, insurers, successors, and assigns], from any and all claims, demands, actions, causes of action, liabilities, damages, costs, expenses, and attorneys' fees, of whatever kind or nature, whether known or unknown, suspected or unsuspected, asserted or unasserted, which Party B ever had, now has, or hereafter can, shall, or may have against Party A, arising from or in any way related to the Dispute.
    [If only one party is releasing claims, delete the inapplicable section.]

4.  **Dismissal of Litigation (if applicable):**
    Within [Number] days of [Choose one: "receipt of the Settlement Amount by Party A" / "execution of this Agreement by all Parties"], the Parties shall jointly file (or Party A shall file) a Stipulation of Dismissal with Prejudice of the lawsuit styled [Case Name], Case Number [Case Number], pending in [Court Name]. Each party shall bear its own costs and attorneys' fees.

5.  **No Admission of Liability:**
    This Agreement is a compromise of disputed claims and is not to be construed as an admission of liability or wrongdoing by any Party. The Parties enter into this Agreement to avoid further litigation and expense.

6.  **Confidentiality (Optional - modify or delete if not applicable):**
    The Parties agree to keep the terms and conditions of this Agreement confidential and shall not disclose them to any third party, except as may be required by law, to their attorneys, accountants, or financial advisors, or to enforce the terms of this Agreement.

7.  **Governing Law:**
    This Agreement shall be governed by and construed in accordance with the laws of the State of [Your State / Relevant State].

8.  **Entire Agreement:**
    This Agreement constitutes the entire understanding between the Parties with respect to the subject matter hereof and supersedes all prior discussions, negotiations, and agreements, whether oral or written.

9.  **Binding Effect:**
    This Agreement shall be binding upon and inure to the benefit of the Parties and their respective heirs, executors, administrators, successors, and assigns.

10. **Counterparts:**
    This Agreement may be executed in one or more counterparts, each ofwhich shall be deemed an original, but all of which together shall constitute one and the same instrument. Electronic signatures shall be deemed as effective as original signatures.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.

PARTY A:                                     PARTY B:

____________________________                 ____________________________
[Your Typed Full Name / Company Name]        [Other Party's Typed Full Name / Company Name]

By: _________________________ (if company)  By: _________________________ (if company)
Name: _______________________                Name: _______________________
Title: ________________________               Title: ________________________
`,
};

const US_STATES = [
  { value: "AL", label: "Alabama" }, { value: "AK", label: "Alaska" }, { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" }, { value: "CA", label: "California" }, { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" }, { value: "DE", label: "Delaware" }, { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" }, { value: "HI", label: "Hawaii" }, { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" }, { value: "IN", label: "Indiana" }, { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" }, { value: "KY", label: "Kentucky" }, { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" }, { value: "MD", label: "Maryland" }, { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" }, { value: "MN", label: "Minnesota" }, { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" }, { value: "MT", label: "Montana" }, { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" }, { value: "NH", label: "New Hampshire" }, { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" }, { value: "NY", label: "New York" }, { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" }, { value: "OH", label: "Ohio" }, { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" }, { value: "PA", label: "Pennsylvania" }, { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" }, { value: "SD", label: "South Dakota" }, { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" }, { value: "UT", label: "Utah" }, { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" }, { value: "WA", label: "Washington" }, { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" }, { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia"}
];

const COURT_LEVELS = [
  { value: "Federal District Court", label: "Federal District Court" },
  { value: "Federal Court of Appeals", label: "Federal Court of Appeals" },
  { value: "State Supreme Court", label: "State Supreme Court" },
  { value: "State Appellate Court", label: "State Appellate Court" },
  { value: "Superior Court", label: "Superior Court" },
  { value: "District Court", label: "District Court" },
  { value: "County Court", label: "County Court" },
  { value: "County District Court", label: "County District Court" },
  { value: "Circuit Court", label: "Circuit Court" },
  { value: "Municipal Court", label: "Municipal Court" },
  { value: "Small Claims Court", label: "Small Claims Court" },
  { value: "Family Court", label: "Family Court" },
  { value: "Probate Court", label: "Probate Court" },
  { value: "Justice Court", label: "Justice Court" },
  { value: "Tribal Court", label: "Tribal Court" },
];


export default function DocumentGeneratorPage() {
  const [selectedDocument, setSelectedDocument] = useState<DocumentType>("");
  const [generatedDocument, setGeneratedDocument] = useState<string>("");
  const [suggestedByAI, setSuggestedByAI] = useState<string[]>([]);
  const [storedCaseSummary, setStoredCaseSummary] = useState<string | null>(null);

  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>(""); // Represents County or City as per template
  const [selectedCourtLevel, setSelectedCourtLevel] = useState<string>("");

  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    // Load stored case summary from localStorage
    try {
      const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedDataString) {
        const storedData: StoredCaseData = JSON.parse(storedDataString);
        setStoredCaseSummary(storedData.caseDetails);
      }
    } catch (e) {
      console.error("Failed to load or parse case data from localStorage", e);
    }

    const suggestedTypesParam = searchParams.get('suggested');
    if (suggestedTypesParam) {
      const typesFromURL = suggestedTypesParam.split(',') as DocumentType[];
      const validSuggestedTypes = typesFromURL.filter(
        type => Object.keys(DOCUMENT_TEMPLATES).includes(type) && type !== ""
      );

      if (validSuggestedTypes.length > 0) {
        setSuggestedByAI(validSuggestedTypes);
        const firstValidType = validSuggestedTypes[0] as Exclude<DocumentType, "">;
        setSelectedDocument(firstValidType);
        if (DOCUMENT_TEMPLATES[firstValidType]) { 
          toast({
            title: "AI Suggestion Applied",
            description: `Pre-selected '${getDocumentDisplayName(firstValidType)}' based on your case analysis. You can change this selection.`,
          });
        }
      } else if (suggestedTypesParam.trim() !== "") { // Only show if suggestedTypesParam was not empty
         toast({
          title: "AI Suggestion Not Applied",
          description: `The suggested document type '${suggestedTypesParam}' could not be found or is not supported. Please select a document manually.`,
          variant: "default" 
        });
      }
    }
  }, [searchParams, toast]);

  useEffect(() => {
    const docType = selectedDocument as Exclude<DocumentType, "">;
    if (docType && DOCUMENT_TEMPLATES[docType]) {
      let template = DOCUMENT_TEMPLATES[docType];

      if (docType !== "foiaRequest" && docType !== "settlementAgreement") { // FOIA & Settlement are not court-specific in same way
        let effectiveCourtName = "[NAME OF COURT - e.g., UNITED STATES DISTRICT COURT FOR THE DISTRICT OF [Your District]]"; // Default for complaint
        if (docType !== "complaint" && docType !== "civilCoverSheet") { // Civil Cover Sheet also uses more detailed court name
          effectiveCourtName = "[Court Name]"; // Default for other docs
        }
        
        if (selectedCourtLevel && selectedState) {
           if (docType === "complaint" || docType === "civilCoverSheet") {
              const stateLabel = US_STATES.find(s => s.value === selectedState)?.label || selectedState;
              if (selectedCourtLevel.toLowerCase().includes("federal")) {
                   effectiveCourtName = `${selectedCourtLevel.replace("Federal ", "UNITED STATES ")} FOR THE ${selectedCity ? `DISTRICT OF ${stateLabel}, ${selectedCity.toUpperCase()} DIVISION` : `DISTRICT OF ${stateLabel.toUpperCase()}` }`;
              } else {
                   effectiveCourtName = `${selectedCourtLevel}${selectedCity ? ` OF ${selectedCity}, ${stateLabel}` : `, ${stateLabel}` }`;
              }
           } else {
              effectiveCourtName = `${selectedCourtLevel}${selectedCity ? ` for ${selectedCity}` : ''}, ${US_STATES.find(s => s.value === selectedState)?.label || selectedState}`;
           }
        } else if (selectedCourtLevel) {
          effectiveCourtName = (docType === "complaint" || docType === "civilCoverSheet") ? selectedCourtLevel.toUpperCase() : selectedCourtLevel;
        } else if (selectedState) {
          const stateLabel = US_STATES.find(s => s.value === selectedState)?.label || selectedState;
          effectiveCourtName = (docType === "complaint" || docType === "civilCoverSheet") ? `[SPECIFY COURT LEVEL] IN ${stateLabel.toUpperCase()}` : `[Specify Court Level] in ${stateLabel}`;
        } else if (selectedCity && (docType === "complaint" || docType === "civilCoverSheet")) {
           effectiveCourtName = `[SPECIFY COURT LEVEL AND STATE] FOR ${selectedCity.toUpperCase()} DIVISION`;
        } else if (selectedCity) {
           effectiveCourtName = `[Specify Court Level & State] for ${selectedCity}`;
        }


        template = template.replace(/\[NAME OF COURT - e.g., UNITED STATES DISTRICT COURT FOR THE DISTRICT OF \[Your District\]\]/g, effectiveCourtName);
        template = template.replace(/\[Court Name\]/g, effectiveCourtName); // General for other docs

        template = template.replace(/\[State\/Commonwealth\/People\] v. \[Defendant Name\]/g, selectedState ? `${US_STATES.find(s => s.value === selectedState)?.label || '[State/Commonwealth/People]'} v. [Defendant Name]` : `[State/Commonwealth/People] v. [Defendant Name]`);
        template = template.replace(/State of \[State\]/g, `State of ${selectedState ? US_STATES.find(s => s.value === selectedState)?.label || '[State]' : "[State]"}`);
        template = template.replace(/County of \[County\]/g, `County of ${selectedCity || "[County]"}`);
        template = template.replace(/\[County\/District\]/g, selectedCity || "[County/District]");
        template = template.replace(/under the laws of the State of \[Your State\]/g, `under the laws of the State of ${selectedState ? US_STATES.find(s => s.value === selectedState)?.label || '[Your State]' : "[Your State]"}`);
        template = template.replace(/\[State\]/g, selectedState ? US_STATES.find(s => s.value === selectedState)?.label || '[State]' : "[State]"); // General placeholder for state
      } else if (docType === "settlementAgreement") {
         // Handle state replacement for governing law in settlement agreements
        template = template.replace(/the State of \[Your State \/ Relevant State\]/g, `the State of ${selectedState ? US_STATES.find(s => s.value === selectedState)?.label || '[Your State / Relevant State]' : "[Your State / Relevant State]"}`);
      }


      setGeneratedDocument(template);
    } else if (!selectedDocument) {
      setGeneratedDocument("");
    }
  }, [selectedDocument, selectedState, selectedCity, selectedCourtLevel]);


  const handleSelectDocument = (value: string) => {
    const docType = value as DocumentType;
    setSelectedDocument(docType);
  };

  const handleCopyToClipboard = () => {
    if (generatedDocument) {
      navigator.clipboard.writeText(generatedDocument);
      toast({
        title: "Copied to Clipboard",
        description: "The document template has been copied.",
      });
    }
  };
  
  const getDocumentDisplayName = (docType: DocumentType | string): string => {
    if (!docType) return "Choose a document...";
    switch (docType) {
      case 'foiaRequest': return "Freedom of Information Act (FOIA) Request";
      case 'complaint': return "Complaint (Detailed Pre-Filing)";
      case 'civilCoverSheet': return "Civil Cover Sheet (Generic Example)";
      case 'summons': return "Summons (Generic Example)";
      case 'motionToQuash': return "Motion to Quash";
      case 'motionToDismiss': return "Motion to Dismiss";
      case 'inFormaPauperisApplication': return "Application to Proceed In Forma Pauperis (IFP)";
      case 'declarationOfNextFriend': return "Declaration of Next Friend";
      case 'tpoChallengeResponse': return "Temporary Protective Order (TPO) Challenge/Response";
      case 'settlementAgreement': return "Settlement Agreement (Generic)";
      default:
        // Add spaces before capital letters and capitalize first letter
        return docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
    }
  };


  return ()              
          <CardHeader>
           <CardTitle className="text-2xl">Document Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {suggestedByAI.length > 0 && (
            <Alert variant="default" className="bg-accent/10 border-accent/50">
              <FileText className="h-4 w-4 text-accent" />
              <AlertTitle className="text-accent">AI Suggestions</AlertTitle>
              <AlertDescription>
                Based on your case analysis, we suggested: {suggestedByAI.map(docType => getDocumentDisplayName(docType as DocumentType)).join(', ')}.
                The first valid suggestion has been pre-selected.
              </AlertDescription>
            </Alert>
          )}

          {storedCaseSummary && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Info className="w-5 h-5 text-muted-foreground" />Current Case Summary</CardTitle>
                <CardDescription>This summary was entered in the Case Analysis section. You can use it to help fill out your document template.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={storedCaseSummary}
                  readOnly
                  rows={3}
                  className="text-sm bg-background cursor-default"
                  aria-label="Stored case summary from case analysis"
                />
              </CardContent>
            </Card>
          )}


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="state-select" className="block text-sm font-medium text-foreground mb-1">State</Label>
              <Select onValueChange={setSelectedState} value={selectedState}>
                <SelectTrigger id="state-select" aria-label="Select state">
                  <SelectValue placeholder="Select State..." />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map(state => (
                    <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="city-input" className="block text-sm font-medium text-foreground mb-1">City / County / Federal District Division</Label>
              <Input
                id="city-input"
                type="text"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                placeholder="Enter City, County, or Division"
                aria-label="Enter city, county, or federal district division"
              />
            </div>
            <div>
              <Label htmlFor="court-level-select" className="block text-sm font-medium text-foreground mb-1">Court Level</Label>
              <Select onValueChange={setSelectedCourtLevel} value={selectedCourtLevel}>
                <SelectTrigger id="court-level-select" aria-label="Select court level">
                  <SelectValue placeholder="Select Court Level..." />
                </SelectTrigger>
                <SelectContent>
                  {COURT_LEVELS.map(level => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="doc-type-select" className="block text-sm font-medium text-foreground mb-1 pt-4">Select Document Type</Label>
            <Select onValueChange={handleSelectDocument} value={selectedDocument}>
              <SelectTrigger id="doc-type-select" className="w-full sm:w-[320px]" aria-label="Select document type">
                <SelectValue placeholder="Choose a document..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="complaint">{getDocumentDisplayName("complaint")}</SelectItem>
                <SelectItem value="civilCoverSheet">{getDocumentDisplayName("civilCoverSheet")}</SelectItem>
                <SelectItem value="summons">{getDocumentDisplayName("summons")}</SelectItem>
                <SelectItem value="motion">{getDocumentDisplayName("motion")}</SelectItem>
                <SelectItem value="motionToQuash">{getDocumentDisplayName("motionToQuash")}</SelectItem>
                <SelectItem value="motionToDismiss">{getDocumentDisplayName("motionToDismiss")}</SelectItem>
                <SelectItem value="affidavit">{getDocumentDisplayName("affidavit")}</SelectItem>
                <SelectItem value="declarationOfNextFriend">{getDocumentDisplayName("declarationOfNextFriend")}</SelectItem>
                <SelectItem value="inFormaPauperisApplication">{getDocumentDisplayName("inFormaPauperisApplication")}</SelectItem>
                <SelectItem value="motionForBailReduction">{getDocumentDisplayName("motionForBailReduction")}</SelectItem>
                <SelectItem value="discoveryRequest">{getDocumentDisplayName("discoveryRequest")}</SelectItem>
                <SelectItem value="petitionForExpungement">{getDocumentDisplayName("petitionForExpungement")}</SelectItem>
                <SelectItem value="foiaRequest">{getDocumentDisplayName("foiaRequest")}</SelectItem>
                <SelectItem value="tpoChallengeResponse">{getDocumentDisplayName("tpoChallengeResponse")}</SelectItem>
                <SelectItem value="settlementAgreement">{getDocumentDisplayName("settlementAgreement")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedDocument && (
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-semibold">Template: {getDocumentDisplayName(selectedDocument)}</h3>
               <Label htmlFor="documentTemplateTextarea" className="sr-only">Editable document template</Label>
              <Textarea
                id="documentTemplateTextarea"
                value={generatedDocument}
                onChange={(e) => setGeneratedDocument(e.target.value)}
                rows={25}
                className="font-mono text-sm"
                aria-label="Editable document template"
                placeholder="Fill in jurisdiction details and select a document type to see the template. Then, edit as needed."
              />
            </div>
          )}
        </CardContent>
        {selectedDocument && generatedDocument && (
          <CardFooter className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <Button onClick={handleCopyToClipboard}>Copy to Clipboard</Button>
            <div className="text-sm text-muted-foreground">
                Need help filing? 
                <Link href="/filing-assistant" className="ml-1 text-primary hover:underline flex-nowrap items-center gap-1 inline-flex">
                    Go to Filing Assistant <LibrarySquare className="w-4 h-4" />
                </Link>
            </div>
          </CardFooter>
        )}
      </Card>

      {selectedDocument && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-1"><Info className="w-5 h-5 text-accent" /> Guidance for {getDocumentDisplayName(selectedDocument)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground space-y-2">
              Ensure you replace all bracketed placeholders like "[Your Name]" with your specific information.
              The jurisdictional details (State, City/County/Division, Court Level) you selected have been pre-filled where applicable (except for FOIA requests and Settlement Agreements). Check these carefully.
              <br />
              For templates like "Civil Cover Sheet" and "Summons," these are generic examples. **Most courts require you to use their specific, official forms.** Always obtain the correct forms from your court's website or clerk's office.
              <br />
              For the "Complaint (Detailed Pre-Filing)" template, this is a comprehensive starting point often used for civil rights claims (like those under 42 U.S.C. § 1983). It includes sections for jurisdiction, parties (with "Next Friend" guidance), detailed factual allegations, specific causes of action, prayer for relief, and a jury demand. It requires substantial customization for your specific facts and legal claims.
              <br />
              For "Petition for Expungement," "Application to Proceed In Forma Pauperis (IFP)," and "Temporary Protective Order (TPO) Challenge/Response," legal requirements and specific forms vary significantly by jurisdiction; these templates are general starting points and require careful review of your specific state's laws and court rules.
              <br />
              The "Freedom of Information Act (FOIA) Request" template is for requesting records from U.S. federal government agencies. State-level public records laws (often called "Sunshine Laws" or similar) have different procedures and request formats.
              <br />
              The "Settlement Agreement (Generic)" template is a very general starting point. Settlement agreements are legally binding and often complex. This template should be carefully reviewed and customized, ideally with the assistance of an attorney, to ensure it accurately reflects the terms of your specific agreement and protects your interests. Key areas like releases of claims and confidentiality should be tailored to your situation.
              <br />
              <strong>Disclaimer:</strong> These templates are for informational purposes only and do not constitute legal advice. Always verify requirements with your local court rules (or relevant agency for FOIA) and consult a qualified legal professional before using or submitting any legal document.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
    

    

    

