
// src/app/interactive-assistant/page.tsx
"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils"; // Make sure cn is imported

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

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let aiResponseText = "";

    if (trimmedInput.toLowerCase().includes("evicted") || trimmedInput.toLowerCase().includes("eviction")) {
      aiResponseText = `If you're facing eviction, it's important to understand your rights. Generally, landlords must follow specific legal procedures. This usually includes providing you with a formal written notice stating the reasons for eviction and the time you have to respond or vacate. You also typically have the right to a court hearing where you can present your side of the story before a judge can order an eviction. If these steps weren't followed, it might be a point to discuss with legal counsel. What specific concerns do you have about your eviction process?`;
    } else if (trimmedInput.toLowerCase().includes("hearing")) {
      aiResponseText = `The right to a hearing is a cornerstone of due process. It means that before a significant decision is made that affects your rights (like in a court case, an administrative action such as a license revocation, or sometimes even employment termination in public jobs), you should have a chance to present your case, evidence, and arguments to a neutral decision-maker. The specifics can vary widely depending on the context (criminal, civil, administrative), but the core idea is a fair opportunity to be heard. Can you tell me more about the hearing you're asking about?`;
    } else if (trimmedInput.toLowerCase().includes("notice")) {
      aiResponseText = `Proper legal notice is crucial in many legal proceedings. It means you should be officially informed about any legal action being taken against you, or any government decision that could significantly impact your rights or property. This notice should be timely, clear, and provide enough information for you to understand what's happening and how to respond. For example, a summons for a lawsuit or a notice of a proposed administrative action should clearly state the allegations and any deadlines. What kind of notice are you referring to?`;
    }
    else {
      aiResponseText = `I've received your query: "${trimmedInput}". As a prototype assistant, my ability to answer complex or very specific questions is limited. For a detailed understanding or advice on your situation, consulting a legal professional is always the best approach. However, I can try to provide some general information if you can rephrase or specify your question.`;
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
    // Initial greeting message from AI
    setMessages([
      {
        id: "initial-ai-greeting",
        sender: "ai",
        text: "Hello! I am a prototype Legal Assistant. You can ask me general questions about legal processes or rights. How can I conceptually help you today?",
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
              placeholder="Type your question here..."
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

    
