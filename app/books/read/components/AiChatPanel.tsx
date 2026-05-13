"use client"

import { useState, useRef, useEffect } from "react"
import { flushSync } from 'react-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import ReactMarkdown from 'react-markdown'
import { getChapter } from '../services/readingContextService'
import { processMessageUpdate } from '../utils/messageUtils'

const markdownComponents: React.ComponentProps<typeof ReactMarkdown>['components'] = {
  p: ({ children }) => <p className="mb-3 last:mb-0 leading-7">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2 first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="text-lg font-bold mt-4 mb-2 first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="text-base font-semibold mt-3 mb-1 first:mt-0">{children}</h3>,
  ul: ({ children }) => <ul className="mb-3 ml-5 space-y-1 list-disc">{children}</ul>,
  ol: ({ children }) => <ol className="mb-3 ml-5 space-y-1 list-decimal">{children}</ol>,
  li: ({ children }) => <li className="leading-7 pl-1">{children}</li>,
  hr: () => <hr className="my-4 border-border" />,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" className="text-blue-400 underline underline-offset-2 hover:text-blue-300 transition-colors">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-muted-foreground/30 pl-4 my-3 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    if (!className) {
      return (
        <code className="bg-muted-foreground/15 rounded px-1.5 py-0.5 text-[0.8em] font-mono">
          {children}
        </code>
      )
    }
    return <code className={`${className} font-mono text-sm leading-relaxed`}>{children}</code>
  },
  pre: ({ children }) => {
    const codeEl = children as React.ReactElement<{ className?: string; children?: string }>
    const lang = (codeEl?.props?.className ?? '').replace('language-', '') || 'code'
    const codeText = String(codeEl?.props?.children ?? '').trimEnd()
    return (
      <div className="rounded-lg overflow-hidden my-3 text-sm">
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-700 dark:bg-zinc-800 text-zinc-300 text-xs font-mono">
          <span>{lang}</span>
          <button
            onClick={() => navigator.clipboard.writeText(codeText)}
            className="hover:text-white transition-colors"
          >
            Copy
          </button>
        </div>
        <pre className="bg-zinc-800 dark:bg-zinc-900 text-zinc-100 p-4 overflow-x-auto leading-relaxed">
          {children}
        </pre>
      </div>
    )
  },
}

export interface Message {
  text: string
  sender: 'user' | 'bot'
  isTyping?: boolean
}

export default function AiChatPanel({ socket, highlights, bookName, currentLocation, totalLocations, epubBook }: { 
  socket: any; 
  highlights?: any[]; 
  bookName?: string;
  currentLocation?: any;
  totalLocations?: number;
  epubBook?: any;
}) {
  const [messages, setMessages] = useState<Message[]>([
    { text: "H", sender: 'bot' }
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (!socket) return; // Wait for socket to be available
    socket.on('ai-start', () => {
      flushSync(() => {
        setMessages(prev => [...prev, { text: "...", sender: 'bot', isTyping: true }])
      })
    })
    socket.on('ai-chunk', (chunk: string) => {
      flushSync(() => {
        setMessages(prev => processMessageUpdate(prev, chunk));
        scrollToBottom();
      });
    });

    socket.on('user-message', (text: string) => {
      setMessages(prev => [...prev, { text, sender: 'user' }])
      
      setTimeout(scrollToBottom, 100)

    })

    // Cleanup listeners when socket changes
    return () => {
      socket.off('ai-chunk');
      socket.off('user-message');
    };
  }, [socket])

  const sendMessage = async() => {
    if (input.trim() && !messages[messages.length - 1]?.isTyping) {
      // Extract actual highlight text, not Range objects
      const highlightTexts = highlights?.map(h => h.range?.toString()).filter(text => text && text.trim()) || []
      const chapter = await getChapter(epubBook, currentLocation);  
      console.log("chapter", chapter)
      const messageData = {
        message: input,
        highlights: highlightTexts, // Send actual text, not Range objects
        bookName: bookName || "Unknown Book",
        // readingProgress, // TODO: Add back later if needed
        chapter: chapter,
        // currentSelection: currentSelection, // if user has text selected
      }
      console.log("messageData", messageData)

      socket.emit('message', messageData)
      setMessages(prev => [...prev, { text: input, sender: 'user' }])
      setInput("")
      setTimeout(scrollToBottom, 100)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">AI Chat</h2>
        
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {message.sender === 'user' ? 'U' : 'AI'}
                    </AvatarFallback>
                  </Avatar>
                  <Card className={`py-0 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    <CardContent className="p-3">
                      {message.isTyping ? (
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      ) : message.sender === 'bot' ? (
                        <div className="text-sm max-w-none">
                          <ReactMarkdown components={markdownComponents}>{message.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm">{message.text}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage()
              }
            }}
            placeholder="Type your message..."
            className="flex-1"
            disabled={messages[messages.length - 1]?.isTyping}
          />
          <Button onClick={sendMessage} disabled={!input.trim() || messages[messages.length - 1]?.isTyping}>
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
