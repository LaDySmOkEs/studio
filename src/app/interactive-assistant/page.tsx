
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
      aiResponseText = `If you're facing eviction, it's a serious situation. Generally, a landlord must follow a specific legal procedure. This often starts with a formal written 'Notice to Quit' or 'Eviction Notice,' stating the reason (e.g., non-payment of rent, lease violation) and giving you a timeframe to fix the issue or move out. If you don't comply, the landlord usually has to file an eviction lawsuit in court. You then have the right to receive a copy of that lawsuit (a summons and complaint) and the opportunity to respond and attend a court hearing where a judge decides if the eviction is lawful. Attempting to evict without a court order (like changing locks) could be illegal. What specific part of the eviction process are you concerned about?`;
    } else if (lowerCaseInput.includes("hearing")) {
      aiResponseText = `A 'hearing' is a formal opportunity to present your side of a case to a neutral decision-maker, which is a key part of due process. There are many types:
- In criminal cases: arraignment, bail hearing, preliminary hearing, trial.
- In civil cases (lawsuits): motion hearings, pre-trial conferences, trial.
- Administrative hearings: before government agencies (e.g., for benefits, licenses).
A fair hearing generally means you get proper notice, a chance to see evidence against you, an opportunity to present your own evidence and arguments, and a decision based on that evidence. Could you tell me what kind of hearing you're asking about?`;
    } else if (lowerCaseInput.includes("notice")) {
      aiResponseText = `Proper legal 'notice' means being formally and adequately informed about something that could affect your rights. For example:
- If sued, you must receive a 'summons' and 'complaint' (this is 'service of process').
- Before an agency acts against you (e.g., denies benefits), they usually send a written notice explaining the action and your hearing rights.
- Landlords must provide specific written notices in eviction cases.
Good notice should be timely (giving you time to prepare), clear about what's happening, and explain your rights. What situation involving a notice are you referring to?`;
    } else {
      aiResponseText = `I understand you're looking for information. As a prototype assistant, I can provide general explanations about common legal terms or processes if you use keywords like 'eviction,' 'hearing,' or 'notice.' If your question is very specific to your situation or uses terms I don't recognize, I may not be able to give a detailed answer. For personalized legal advice, consulting a qualified legal professional is always the best step. Perhaps try rephrasing, or explore other app sections like the 'Document Generator' or 'Due Process Checklist'?`;
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
        text: "Hello! I am a prototype Legal Assistant. You can ask me general questions about legal processes or rights by using keywords like 'eviction', 'hearing', or 'notice'. How can I conceptually help you today?",
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
          This Interactive Legal Assistant is a conceptual prototype for demonstration purposes. The responses are pre-defined or very general and <strong>do not constitute legal advice</strong>. Always consult with a qualified legal professional for any legal concerns or specific advice regarding your situation.
        </AlertDescription>
      </Alert>
    </div>
  );
}
