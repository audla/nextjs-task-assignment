'use client'

import React, { useEffect, useRef } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from 'date-fns'

interface Message {
  id: string
  message: string
  MessageFrom: string
  sent_at: Date
}

interface ChatScrollAreaProps {
  messages: Message[]
}

export function ChatScrollArea({ messages }: ChatScrollAreaProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<HTMLDivElement>(null)

  console.log(messages) 

  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4" ref={scrollAreaRef}>
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold">{message.MessageFrom}</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(message.sent_at), 'HH:mm')}
              </span>
            </div>
            <div className="rounded-lg px-4 py-2 bg-muted max-w-[70%]">
              {message.message}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

