
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

    let aiResponseText = "I am a prototype AI assistant. ";

    if (trimmedInput.toLowerCase().includes("evicted") || trimmedInput.toLowerCase().includes("eviction")) {
      aiResponseText += "Regarding eviction, it's important to know that tenants typically have rights, such as receiving proper notice and the opportunity for a hearing before an eviction can legally occur. If you believe these rights were not respected, that could potentially be a due process violation. ";
    } else if (trimmedInput.toLowerCase().includes("hearing")) {
      aiResponseText += "The right to a hearing is a fundamental part of due process in many legal situations, whether criminal, civil, or administrative. This means you should generally have an opportunity to present your case before a neutral decision-maker before a judgment or significant action is taken against you. ";
    } else if (trimmedInput.toLowerCase().includes("notice")) {
      aiResponseText += "Proper notice is a key component of due process. This means you should be formally informed of legal actions against you or decisions affecting your rights, with enough time and information to prepare a response or defense. Lack of adequate notice can be a significant issue. ";
    }
    else {
      aiResponseText += `I have received your query: "${trimmedInput}". For specific legal questions, especially those involving potential rights violations, it's crucial to consult with a qualified legal professional. They can provide advice tailored to your specific situation.`;
    }
    
    aiResponseText += "\n\nThis information is for educational purposes only and is not legal advice. Please consult a lawyer for advice on your specific situation."

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
        text: "Hello! I am a prototype Legal Assistant. You can ask me general questions about legal processes or rights. Please remember, I cannot provide legal advice, and you should always consult with a qualified attorney for your specific situation. How can I conceptually help you today?",
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

    