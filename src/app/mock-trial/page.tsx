
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
    { role: "User", prompt: "Your opening statement:" },
    { role: "Judge", line: "Thank you. Now, plaintiff, please present your evidence and call your first witness, if any." },
    { role: "User", prompt: "How you present your first piece of evidence or call a witness:" },
    { role: "Judge", line: "Defendant, you may now cross-examine the witness or respond to the evidence." },
    { role: "User", prompt: " (Opponent's turn - conceptually)" },
    { role: "Judge", line: "Plaintiff, do you have further evidence or witnesses?" },
    { role: "User", prompt: "Your response and further presentation:" },
    { role: "Judge", line: "We will now hear from the defendant. Defendant, your opening statement, please." },
    { role: "User", prompt: " (Opponent's turn - conceptually)" },
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
    { role: "User", prompt: " (Opponent's turn - conceptually)" },
    { role: "Judge", line: "Tenant, do you have anything further to add or any rebuttal?" },
    { role: "User", prompt: "Your further points or rebuttal:" },
    { role: "Judge", line: "The court will consider the arguments and evidence. (End of Simulation)" },
  ],
   traffic_ticket: [
    { role: "Officer/Prosecutor", line: "Your Honor, on [Date], at approximately [Time], I observed the defendant's vehicle, [Vehicle Description], at [Location] traveling at [Speed] in a [Posted Speed Limit] zone. I initiated a traffic stop and issued citation number [Citation Number] for speeding." },
    { role: "User", prompt: "(This is the officer's testimony. The Judge will ask if you have questions for the officer.) Your questions for the officer, if any:" },
    { role: "Judge", line: "Defendant, you've heard the officer's testimony. You may now present your case. Why do you believe you are not guilty of this citation?" },
    { role: "User", prompt: "Your explanation or defense:" },
    { role: "Judge", line: "Do you have any evidence to present, such as photos, diagrams, or dashcam footage?" },
    { role: "User", prompt: "How you present your evidence (if any):" },
    { role: "Officer/Prosecutor", line: "(May respond to your evidence or make a closing statement)." },
    { role: "User", prompt: "(Opponent's turn - conceptually)"},
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
    { role: "User", prompt: "(Conceptual turn: Witness testifies, then opponent cross-examines or responds to evidence)" },
    { role: "Judge", line: "Plaintiff, do you have further witnesses or evidence to present at this time?" },
    { role: "User", prompt: "Your response (e.g., 'Yes, Your Honor, I call [Next Witness].' or 'No further evidence at this time, Your Honor.'):" },
    { role: "Judge", line: "Very well. After the plaintiff rests their case, the defendant will have an opportunity to present their case." },
    { role: "User", prompt: "(Conceptual turn: Opponent presents their case - witnesses, evidence)" },
    { role: "Judge", line: "Plaintiff, you may now present your closing argument. Please summarize the key points of your case and why the court should find in your favor." },
    { role: "User", prompt: "Your closing argument:" },
    { role: "Judge", line: "Thank you. Defendant, your closing argument." },
    { role: "User", prompt: "(Conceptual turn: Opponent gives closing argument)" },
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
    setSelectedScenario(value as keyof typeof MOCK_SCRIPT_STEPS);
    setCurrentStep(0);
    setUserResponse("");
    setTranscript([]);
    if (value && MOCK_SCRIPT_STEPS[value as keyof typeof MOCK_SCRIPT_STEPS]?.length > 0) {
      setTranscript([{ role: MOCK_SCRIPT_STEPS[value as keyof typeof MOCK_SCRIPT_STEPS][0].role, line: MOCK_SCRIPT_STEPS[value as keyof typeof MOCK_SCRIPT_STEPS][0].line }]);
    }
  };

  const handleNextStep = () => {
    if (!selectedScenario) return;
    const scenarioScript = MOCK_SCRIPT_STEPS[selectedScenario];

    // Add user's response to transcript if it was a user prompt step
    if (scenarioScript[currentStep]?.role === "User") {
      setTranscript(prev => [...prev, { role: "You", line: userResponse || "(No response provided)" }]);
    }
    
    const nextStepIndex = currentStep + 1;
    if (nextStepIndex < scenarioScript.length) {
      setCurrentStep(nextStepIndex);
      setTranscript(prev => [...prev, { role: scenarioScript[nextStepIndex].role, line: scenarioScript[nextStepIndex].line }]);
      setUserResponse(""); // Clear response for next user input
    } else {
      toast({ title: "Simulation Ended", description: "You have reached the end of this mock scenario." });
    }
  };

  const currentPrompt = selectedScenario && MOCK_SCRIPT_STEPS[selectedScenario][currentStep]?.role === "User" 
    ? MOCK_SCRIPT_STEPS[selectedScenario][currentStep]?.prompt 
    : null;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Gavel className="w-7 h-7 text-primary" /> Mock Trial Simulator (Conceptual)
          </CardTitle>
          <CardDescription>
            Practice basic court procedures for common scenarios. This is a simplified simulation to help you prepare and is NOT legal advice or a substitute for understanding your specific court's rules.
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

          {selectedScenario && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-xl">Trial Simulation: {MOCK_SCENARIOS.find(s => s.value === selectedScenario)?.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-80 overflow-y-auto p-3 bg-muted/50 rounded-md space-y-2 border">
                  <h3 className="text-sm font-semibold mb-2 sticky top-0 bg-muted/50 py-1 flex items-center gap-1"><ScrollText className="w-4 h-4"/>Transcript</h3>
                  {transcript.map((entry, index) => (
                    <div key={index} className={`text-sm ${entry.role === "User" || entry.role === "You" ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>
                      <strong>{entry.role}:</strong> {entry.line}
                    </div>
                  ))}
                </div>

                {currentPrompt && (
                  <div className="space-y-2">
                    <Label htmlFor="user-response" className="font-semibold flex items-center gap-1"><MessageCircle className="w-4 h-4"/>{currentPrompt}</Label>
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
                <Button onClick={handleNextStep} disabled={currentStep >= MOCK_SCRIPT_STEPS[selectedScenario]?.length -1 && MOCK_SCRIPT_STEPS[selectedScenario][currentStep]?.role !== "User"}>
                  {currentStep >= MOCK_SCRIPT_STEPS[selectedScenario]?.length -1 ? "End Simulation" : "Submit / Next Step"}
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
          This mock trial simulator is a highly simplified tool for conceptual practice only. Actual court proceedings are complex, vary significantly by jurisdiction and case type, and involve specific rules of evidence and procedure. This simulation does not cover all aspects of a trial and should not be used as a substitute for legal research, understanding local court rules, or consultation with a qualified attorney.
        </AlertDescription>
      </Alert>
    </div>
  );
}

