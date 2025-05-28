
// src/app/interactive-assistant/page.tsx
"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export default function InteractiveAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: trimmedInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    let aiResponseText = "";
    const lowerCaseInput = trimmedInput.toLowerCase();

    if (lowerCaseInput.includes("evicted") || lowerCaseInput.includes("eviction")) {
      aiResponseText = `When facing an eviction, there's a legal process landlords must follow. Usually, it starts with a formal written notice (like a "Notice to Quit") specifying the reason (e.g., non-payment, lease violation) and a timeframe to resolve the issue or move. If you don't, the landlord typically needs to file an eviction lawsuit. You should then be served with court papers (a summons and complaint) and have the right to respond and attend a hearing. 
Key things to check are:
1. The Notice: Is it valid? Does it give the legally required time? Does it state clear reasons?
2. Your Lease: What does it say about termination or eviction?
3. Property Condition: If conditions are an issue, document them thoroughly.
4. Court Filings: If you receive court papers, pay close attention to deadlines for responding.
What specific part are you concerned about, like the notice you received, your tenant rights, or what to expect in court?`;
    } else if (lowerCaseInput.includes("hearing")) {
      aiResponseText = `A 'hearing' is a fundamental part of due process, providing a formal chance to present your case to a neutral decision-maker. The specifics vary greatly depending on the type of hearing:
- Criminal Hearings: Can include arraignments (initial appearance), bail hearings, preliminary hearings (to determine if there's enough evidence for trial), motion hearings (to decide on legal issues before trial), and the trial itself.
- Civil Hearings: Often involve motions (e.g., for summary judgment, to dismiss), pre-trial conferences, and the trial.
- Administrative Hearings: These are before government agencies (e.g., for benefits, licenses, permits).
Generally, for any hearing, you should receive proper notice beforehand detailing the date, time, location, and purpose. You often have the right to see evidence against you, present your own evidence, call witnesses, and question the other side's witnesses. Understanding the specific rules and procedures for *your* type of hearing is crucial. What kind of hearing are you preparing for or asking about?`;
    } else if (lowerCaseInput.includes("notice")) {
      aiResponseText = `Proper legal 'notice' is key to due process. It means being formally and adequately informed about something that could affect your rights, giving you a chance to respond. A good notice should typically:
1. Be in writing.
2. Clearly identify who it's from and who it's for.
3. Explain the issue, proposed action, or allegations.
4. Mention any relevant dates, deadlines, or hearing information.
5. Inform you of your rights to respond, appeal, or seek legal counsel.
Examples include a 'summons and complaint' if you're sued, a 'notice of proposed agency action' for benefits, or a 'notice to quit' in an eviction. The exact requirements depend on the situation and jurisdiction. If you've received a notice, what is it regarding? Knowing the context helps provide more relevant general information.`;
    } else {
      aiResponseText = `I can provide general information about common legal terms or processes if you use keywords like 'eviction,' 'hearing,' or 'notice.' I'm still learning and my responses are based on pre-defined information for this prototype. If your question is very specific to your personal situation or involves complex legal analysis, I won't be able to provide a detailed answer. Trying to rephrase your question with clear keywords might help, or you can explore other features of the app.`;
    }
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: "ai",
      text: aiResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
    setIsLoading(false);
  };
  
  useEffect(() => {
    setMessages([
      {
        id: "initial-ai-greeting",
        sender: "ai",
        text: "Hello! I'm a prototype Legal Assistant. I can offer general information on common legal topics if you ask using keywords like 'eviction', 'hearing', or 'notice'. How can I conceptually help you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]"> {/* Adjust height as needed */}
      <Card className="flex-grow flex flex-col shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Bot className="w-7 h-7 text-primary" /> Interactive Legal Assistant (Prototype)
          </CardTitle>
          <CardDescription>
            Ask general questions about legal concepts or due process. This assistant is a prototype, offers informational responses only, and cannot provide legal advice.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end gap-2",
                    message.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.sender === "ai" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot size={18} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg px-3 py-2 text-sm shadow",
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <p className={cn(
                        "text-xs mt-1",
                        message.sender === "user" ? "text-primary-foreground/70 text-right" : "text-muted-foreground/70 text-left"
                      )}>{message.timestamp}</p>
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User size={18} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isLoading && (
                <div className="flex items-end gap-2 justify-start">
                  <Avatar className="h-8 w-8">
                     <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot size={18} />
                      </AvatarFallback>
                  </Avatar>
                  <div className="max-w-[70%] rounded-lg px-3 py-2 text-sm shadow bg-muted text-muted-foreground">
                    <p>Thinking...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input
              id="user-question-input"
              type="text"
              placeholder="Ask about 'eviction', 'hearing', 'notice'..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-grow"
              disabled={isLoading}
              aria-label="User question input"
            />
            <Button type="submit" size="icon" disabled={isLoading} aria-label="Send question">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
      <Alert variant="default" className="mt-4 border-accent bg-accent/10">
        <Bot className="h-5 w-5 text-accent" />
        <AlertTitle className="font-semibold text-accent">Important Disclaimer</AlertTitle>
        <AlertDescription>
          This Interactive Legal Assistant is a conceptual prototype for demonstration purposes. The responses are general information and <strong>do not constitute legal advice</strong>. Always consult with a qualified legal professional for any legal concerns or specific advice regarding your situation.
        </AlertDescription>
      </Alert>
    </div>
  );
}

