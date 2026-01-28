"use client"

import { useState, useRef, useEffect } from "react"
import { flushSync } from 'react-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface Message {
  text: string
  sender: 'user' | 'bot'
  isTyping?: boolean
}

export default function AiChatPanel({ socket }: { socket: any }) {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you with this book?", sender: 'bot' }
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [])

  useEffect(() => {
    if (!socket) return; // Wait for socket to be available
    socket.on('ai-start', () => {
      setMessages(prev => [...prev, { text: "...", sender: 'bot', isTyping: true }])
    })
    socket.on('ai-chunk', (chunk: string) => {
      console.log('gotchu')
      flushSync(() => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.sender === 'bot') {
            if (lastMessage.isTyping) {
              // Replace the typing indicator with the first chunk
              newMessages[newMessages.length - 1] = {
                text: chunk,
                sender: 'bot'
              };
            } else {
              // Append chunk to the existing bot message
              newMessages[newMessages.length - 1] = {
                ...lastMessage,
                text: lastMessage.text + chunk
              };
            }
          } else {
            // Add new bot message if last wasn't bot or doesn't exist
            newMessages.push({ text: chunk, sender: 'bot' });
          }
          return newMessages;
        });
      });
      scrollToBottom();
    });

    // Cleanup listeners when socket changes
    return () => {
      socket.off('ai-chunk');
    };
  }, [socket]);

  const sendMessage = () => {
    if (input.trim() && !messages[messages.length - 1]?.isTyping) {
      socket.emit('message', input)
      setMessages(prev => [...prev, { text: input, sender: 'user' }])
      setInput("")
      // Scroll to bottom after state update
      setTimeout(scrollToBottom, 100)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b">
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
