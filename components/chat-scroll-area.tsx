'use client'

import React, { useEffect, useRef } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from 'date-fns'
import { Worker } from '@/lib/airtable'

interface Message {
  id: string
  message: string
  MessageFrom: string[]
  sent_at: Date
}

interface ChatScrollAreaProps {
  messages: Message[],
  workers: Worker[]
}


function convertObjectToMap(obj:Worker[]):Map<string,{first_name:string,last_name:string}> {
  const map = new Map()
  obj.forEach((item)=>{
    map.set(item.id,{
      first_name:item.first_name,
      last_name:item.last_name
    })
  })
  return map

}


export function ChatScrollArea({ messages, workers }: ChatScrollAreaProps) {
  const [workerMap, setWorkerMap] = React.useState<Map<string,{first_name:string,last_name:string}> | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (workerMap == null && workers.length > 0) {
      setWorkerMap(convertObjectToMap(workers))
    }
  },[]);


  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4" ref={scrollAreaRef}>
      <div className="space-y-4">
        {messages.map((message, index) => {
          const messageFrom = workerMap ? workerMap.get(message.MessageFrom[0]) : null;
          const workerFullName  = messageFrom ? `${messageFrom.first_name} ${messageFrom.last_name}` : null;
          return (
          <div
            key={message.id}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">

              <span className="text-sm font-semibold">{workerFullName}</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(message.sent_at), 'HH:mm')}
              </span>
            </div>
            <div className="rounded-lg px-4 py-2 bg-muted max-w-[70%]">
              {message.message}
            </div>
          </div>
        )})}
      </div>
    </ScrollArea>
  )
}

