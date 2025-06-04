
// src/app/mock-trial/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Gavel, AlertTriangle, ScrollText, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MOCK_SCENARIOS = [
  { value: "small_claims", label: "Small Claims Hearing (Plaintiff)" },
  { value: "eviction_defense", label: "Eviction Defense Hearing (Tenant)" },
  { value: "traffic_ticket", label: "Traffic Ticket Challenge" },
  { value: "civil_litigation_plaintiff", label: "Civil Litigation (e.g., Contract Dispute - Plaintiff)" },
];

const MOCK_SCRIPT_STEPS = {
  small_claims: [
    { role: "Judge", line: "This is the case of [Your Name] versus [Opponent Name]. Plaintiff, please begin with your opening statement. Briefly explain what your claim is and what you are asking the court for." },
    { role: "User", prompt: "Your opening statement (Explain your claim and what you seek):" },
    { role: "Judge", line: "Thank you. Now, plaintiff, please present your evidence and call your first witness, if any." },
    { role: "User", prompt: "How you present your first piece of evidence or call a witness:" },
    { role: "Judge", line: "Defendant, you may now cross-examine the witness or respond to the evidence." },
    { role: "System", line: "(Opponent's turn to respond - click Next Step to continue simulation)" },
    { role: "User", prompt: "Click Next Step to proceed after opponent's conceptual turn." },
    { role: "Judge", line: "Plaintiff, do you have further evidence or witnesses?" },
    { role: "User", prompt: "Your response and further presentation (if any):" },
    { role: "Judge", line: "We will now hear from the defendant. Defendant, your opening statement, please." },
    { role: "System", line: "(Opponent's turn to present their case - click Next Step to continue simulation)" },
    { role: "User", prompt: "Click Next Step to proceed after opponent's conceptual turn." },
    { role: "Judge", line: "Plaintiff, you may now make your closing argument. Summarize your case and why you believe the court should rule in your favor." },
    { role: "User", prompt: "Your closing argument:" },
    { role: "Judge", line: "Thank you. The court will take this matter under advisement and issue a ruling. (End of Simulation)" },
  ],
  eviction_defense: [
    { role: "Judge", line: "This is an eviction proceeding, [Landlord Name] versus [Your Name]. Tenant, the landlord claims [reason for eviction, e.g., non-payment of rent]. What is your response?" },
    { role: "User", prompt: "Your initial response to the claim:" },
    { role: "Judge", line: "Do you have any evidence to support your position, such as rent receipts, photos of conditions, or communication with the landlord?" },
    { role: "User", prompt: "How you present your evidence:" },
    { role: "Judge", line: "Landlord, do you have a response to the tenant's evidence or further arguments?" },
    { role: "System", line: "(Landlord's turn to respond - click Next Step to continue simulation)" },
    { role: "User", prompt: "Click Next Step to proceed after Landlord's conceptual turn." },
    { role: "Judge", line: "Tenant, do you have anything further to add or any rebuttal?" },
    { role: "User", prompt: "Your further points or rebuttal:" },
    { role: "Judge", line: "The court will consider the arguments and evidence. (End of Simulation)" },
  ],
   traffic_ticket: [
    { role: "Officer/Prosecutor", line: "Your Honor, on [Date], at approximately [Time], I observed the defendant's vehicle, [Vehicle Description], at [Location] traveling at [Speed] in a [Posted Speed Limit] zone. I initiated a traffic stop and issued citation number [Citation Number] for speeding." },
    { role: "Judge", line: "Thank you, Officer. Defendant, do you have any questions for the officer regarding their testimony?" },
    { role: "User", prompt: "Your questions for the officer, if any (e.g., 'Officer, can you confirm the method used to determine my speed?'):" },
    { role: "Officer/Prosecutor", line: "(Officer responds to your questions - click Next Step)" },
    { role: "User", prompt: "Click Next Step to proceed after officer's conceptual response." },
    { role: "Judge", line: "Defendant, you've heard the officer's testimony. You may now present your case. Why do you believe you are not guilty of this citation?" },
    { role: "User", prompt: "Your explanation or defense:" },
    { role: "Judge", line: "Do you have any evidence to present, such as photos, diagrams, or dashcam footage?" },
    { role: "User", prompt: "How you present your evidence (if any):" },
    { role: "Officer/Prosecutor", line: "(May respond to your evidence or make a closing statement - click Next Step)" },
     { role: "User", prompt: "Click Next Step to proceed after prosecutor's conceptual turn." },
    { role: "Judge", line: "Defendant, do you have a closing statement? Briefly summarize why you believe the citation should be dismissed." },
    { role: "User", prompt: "Your closing statement:" },
    { role: "Judge", line: "The court will make a decision. (End of Simulation)" },
  ],
  civil_litigation_plaintiff: [
    { role: "Judge", line: "Court is in session. This is case number [Case Number], [Your Name] versus [Defendant Name]. Plaintiff, are you ready to proceed with your opening statement regarding your claim for [e.g., breach of contract]?" },
    { role: "User", prompt: "Your opening statement (briefly explain your claim, what happened, and what you are seeking):" },
    { role: "Judge", line: "Thank you. Plaintiff, you may now call your first witness or present your first piece of evidence." },
    { role: "User", prompt: "How you call your first witness (e.g., 'I call [Witness Name] to the stand.') or present evidence (e.g., 'I would like to submit Plaintiff's Exhibit 1, the contract.'):" },
    { role: "Judge", line: "Defendant, you may cross-examine the witness after direct examination, or object to evidence presented." },
    { role: "System", line: "(Conceptual turn: Witness testifies, then opponent cross-examines or responds to evidence - click Next Step)" },
    { role: "User", prompt: "Click Next Step to proceed after conceptual witness testimony and cross-examination." },
    { role: "Judge", line: "Plaintiff, do you have further witnesses or evidence to present at this time?" },
    { role: "User", prompt: "Your response (e.g., 'Yes, Your Honor, I call [Next Witness].' or 'No further evidence at this time, Your Honor.'):" },
    { role: "Judge", line: "Very well. After the plaintiff rests their case, the defendant will have an opportunity to present their case." },
    { role: "System", line: "(Conceptual turn: Opponent presents their case - witnesses, evidence - click Next Step)" },
    { role: "User", prompt: "Click Next Step to proceed after opponent's conceptual case presentation." },
    { role: "Judge", line: "Plaintiff, you may now present your closing argument. Please summarize the key points of your case and why the court should find in your favor." },
    { role: "User", prompt: "Your closing argument:" },
    { role: "Judge", line: "Thank you. Defendant, your closing argument." },
    { role: "System", line: "(Conceptual turn: Opponent gives closing argument - click Next Step)" },
    { role: "User", prompt: "Click Next Step to proceed after opponent's conceptual closing argument." },
    { role: "Judge", line: "The court has heard all arguments and evidence. I will take this matter under advisement and issue a written ruling. (End of Simulation)" },
  ],
};

export default function MockTrialPage() {
  const [selectedScenario, setSelectedScenario] = useState<keyof typeof MOCK_SCRIPT_STEPS | "">("");
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponse, setUserResponse] = useState("");
  const [transcript, setTranscript] = useState<{ role: string; line: string }[]>([]);
  const { toast } = useToast();

  const handleScenarioChange = (value: string) => {
    const scenarioKey = value as keyof typeof MOCK_SCRIPT_STEPS;
    setSelectedScenario(scenarioKey);
    setCurrentStep(0);
    setUserResponse("");
    if (scenarioKey && MOCK_SCRIPT_STEPS[scenarioKey]?.length > 0) {
      setTranscript([{ role: MOCK_SCRIPT_STEPS[scenarioKey][0].role, line: MOCK_SCRIPT_STEPS[scenarioKey][0].line }]);
    } else {
      setTranscript([]);
    }
  };

  const handleNextStep = () => {
    if (!selectedScenario) return;
    const scenarioScript = MOCK_SCRIPT_STEPS[selectedScenario];
    let newTranscript = [...transcript];

    if (scenarioScript[currentStep]?.role === "User") {
      newTranscript.push({ role: "You", line: userResponse || "(No response provided / Skipped)" });
    }
    
    const nextStepIndex = currentStep + 1;

    if (nextStepIndex < scenarioScript.length) {
      setCurrentStep(nextStepIndex);
      newTranscript.push({ role: scenarioScript[nextStepIndex].role, line: scenarioScript[nextStepIndex].line });
      setUserResponse(""); 
    } else {
      // This is the last step, or beyond.
      if (scenarioScript[currentStep]?.role !== "User" && transcript.length > 0 && transcript[transcript.length - 1].line !== scenarioScript[scenarioScript.length - 1].line) {
        // If the last actual script line wasn't a user prompt and hasn't been added, add it.
        // This handles cases where the last line is from Judge/System and "End Simulation" is effectively the action for it.
         if (transcript[transcript.length -1].line !== scenarioScript[scenarioScript.length-1].line && scenarioScript[scenarioScript.length-1].role !== "User") {
           newTranscript.push({ role: scenarioScript[scenarioScript.length-1].role, line: scenarioScript[scenarioScript.length-1].line });
         }
      }
      toast({ title: "Simulation Ended", description: "You have reached the end of this mock scenario." });
      // Consider disabling the button here or changing its text to "Restart"
    }
    setTranscript(newTranscript);
  };

  const scenarioScript = selectedScenario ? MOCK_SCRIPT_STEPS[selectedScenario] : [];
  const isUserTurn = scenarioScript.length > 0 && currentStep < scenarioScript.length && scenarioScript[currentStep]?.role === "User";
  const isSimulationEndReached = scenarioScript.length > 0 && currentStep >= scenarioScript.length -1 && !isUserTurn;
  // Check if the very last line of the script has been added to the transcript
  const isLastLineTranscribed = transcript.length > 0 && scenarioScript.length > 0 && transcript[transcript.length-1].line === scenarioScript[scenarioScript.length-1].line;


  let buttonText = "Next Step";
  if (isUserTurn) {
    buttonText = "Submit Response";
  } else if (isLastLineTranscribed && currentStep >= scenarioScript.length -1) {
     buttonText = "End Simulation";
  } else if (currentStep >= scenarioScript.length -1 && scenarioScript[scenarioScript.length-1].role !== "User") {
     buttonText = "Show Final Message & End";
  }


  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Gavel className="w-7 h-7 text-primary" /> Mock Trial Simulator
          </CardTitle>
          <CardDescription>
            Practice basic court procedures for common scenarios by stepping through a scripted interaction. 
            This tool helps demystify courtroom dynamics, especially if you are representing yourself (pro per / in propria persona) or wish to be a more informed participant. 
            Select a scenario, read the prompts, type your responses where indicated, and click "Submit Response" or "Next Step" to proceed.
            This is a simplified simulation and NOT legal advice or a substitute for understanding your specific court's rules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="scenario-select">Select a Mock Trial Scenario</Label>
            <Select onValueChange={handleScenarioChange} value={selectedScenario}>
              <SelectTrigger id="scenario-select" aria-label="Select mock trial scenario">
                <SelectValue placeholder="Choose a scenario..." />
              </SelectTrigger>
              <SelectContent>
                {MOCK_SCENARIOS.map(scenario => (
                  <SelectItem key={scenario.value} value={scenario.value}>{scenario.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedScenario && scenarioScript.length > 0 && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-xl">Trial Simulation: {MOCK_SCENARIOS.find(s => s.value === selectedScenario)?.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-80 overflow-y-auto p-3 bg-muted/50 rounded-md space-y-2 border">
                  <h3 className="text-sm font-semibold mb-2 sticky top-0 bg-muted/50 py-1 z-10 flex items-center gap-1"><ScrollText className="w-4 h-4"/>Transcript</h3>
                  {transcript.map((entry, index) => (
                    <div key={index} className={`text-sm ${entry.role === "You" ? "text-blue-600 dark:text-blue-400 font-medium" : entry.role === "User" ? "hidden" : "text-foreground"}`}>
                      {entry.role !== "System" && <strong>{entry.role}:</strong>} {entry.line.startsWith("(Conceptual turn") || entry.line.startsWith("Click Next Step") ? <span className="italic text-muted-foreground">{entry.line}</span> : entry.line}
                    </div>
                  ))}
                </ScrollArea>

                {isUserTurn && scenarioScript[currentStep]?.prompt && (
                  <div className="space-y-2">
                    <Label htmlFor="user-response" className="font-semibold flex items-center gap-1"><MessageCircle className="w-4 h-4"/>{scenarioScript[currentStep].prompt}</Label>
                    <Textarea
                      id="user-response"
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      placeholder="Type your response here..."
                      rows={5}
                      aria-label="Your response in the mock trial"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleNextStep} disabled={!selectedScenario || (isLastLineTranscribed && currentStep >= scenarioScript.length -1 && buttonText === "End Simulation")}>
                  {buttonText}
                </Button>
              </CardFooter>
            </Card>
          )}
        </CardContent>
      </Card>

      <Alert variant="default" className="border-accent bg-accent/10">
        <AlertTriangle className="h-5 w-5 text-accent" />
        <AlertTitle className="font-semibold text-accent">Important Disclaimer</AlertTitle>
        <AlertDescription>
          This mock trial simulator is a highly simplified tool for practice only. Actual court proceedings are complex, vary significantly by jurisdiction and case type, and involve specific rules of evidence and procedure. This simulation does not cover all aspects of a trial and should not be used as a substitute for legal research, understanding local court rules, or consultation with a qualified attorney.
        </AlertDescription>
      </Alert>
    </div>
  );
}
