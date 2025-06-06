
// src/app/interactive-assistant/page.tsx
"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Send, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea"; 
import { getAIResponseAction } from "./actions";
import type { InteractiveAssistantInput } from "@/ai/flows/interactiveLegalAssistant";

const LOCAL_STORAGE_KEY = "dueProcessAICaseAnalysisData";

interface StoredCaseData {
  caseDetails: string;
  caseCategory: "general" | "criminal" | "civil";
}

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
  const [storedCaseSummary, setStoredCaseSummary] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedDataString) {
        const storedData: StoredCaseData = JSON.parse(storedDataString);
        setStoredCaseSummary(storedData.caseDetails);
      }
    } catch (e) {
      console.error("Failed to load or parse case data from localStorage", e);
    }
  }, []);


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

    const actionInput: InteractiveAssistantInput = {
        userQuery: trimmedInput,
        caseContext: storedCaseSummary || undefined,
    };

    const result = await getAIResponseAction(actionInput);
    let aiResponseText = "";

    if ('error' in result) {
        aiResponseText = `Error: ${result.error}. Please try rephrasing or ask a general question. Remember, I cannot provide legal advice.`;
        toast({
            title: "AI Assistant Error",
            description: result.error,
            variant: "destructive",
        });
    } else {
        aiResponseText = result.responseText;
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
    let greetingText = "Hello! I'm your AI Legal Assistant. I can help explain general legal concepts, court processes, and common terminology. ";
    if (storedCaseSummary) {
        greetingText += "I see you have a case summary saved; I can use that for general context if your questions relate to it. ";
    }
    greetingText += "How can I help you today? Please remember, I cannot provide legal advice, and this information is for educational purposes. For specific advice, consult a qualified attorney.";

    setMessages([
      {
        id: "initial-ai-greeting",
        sender: "ai",
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, [storedCaseSummary]);

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]"> 
      <Card className="flex-grow flex flex-col shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Bot className="w-7 h-7 text-primary" /> Interactive Legal Assistant
          </CardTitle>
          <CardDescription>
            Ask questions about general legal concepts, court processes, or terminology. If you have a saved case summary, the AI can use it for context to provide more relevant general explanations. This assistant offers informational responses only and cannot give legal advice.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            {storedCaseSummary && (
                <Card className="bg-muted/50 mb-4 text-sm">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-base flex items-center gap-2"><Info className="w-4 h-4 text-muted-foreground" />Using Case Context:</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <Textarea
                      value={storedCaseSummary}
                      readOnly
                      rows={2}
                      className="text-xs bg-background cursor-default h-auto"
                      aria-label="Stored case summary from case analysis (used for context)"
                    />
                  </CardContent>
                </Card>
            )}
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
                    <p className="whitespace-pre-wrap">Thinking...</p>
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
              placeholder="Ask a general legal question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-grow"
              disabled={isLoading}
              aria-label="User question input"
            />
            <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()} aria-label="Send question">
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
          This Interactive Legal Assistant is powered by AI and provides general information for educational purposes. <strong>It does not constitute legal advice</strong>. Always consult with a qualified legal professional for any legal concerns or specific advice regarding your situation.
        </AlertDescription>
      </Alert>
    </div>
  );
}
