"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import WorkerSelectionComponent from "@/components/WorkerComponentSelection";
import { Message, Worker } from "@/lib/airtable";

const sendMessage = async ({
  content,
  workerId,
  assignmentId,
}: {
  content: string;
  workerId: string;
  assignmentId: string;
}) => {
  const response = await fetch(`/api/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ content, workerId, assignmentId }),
  });
  if (!response.ok) {
    throw new Error("Failed to send the message.");
  }
};

const fetchMessages = async (ids: string[]) => {
  const idsParam = ids.join(",");
  const response = await fetch(`/api/messages?ids=${idsParam}`);
  if (!response.ok) {
    throw new Error("Failed to fetch messages.");
  }
  return response.json();
};

const MessagesStream = ({ messages }: { messages: Message[] }) => {
  return (
    <div>
      {Array.isArray(messages) && messages.length > 0 ? (
        <ul>
          {messages.map((message, index) => (
            <li key={message.id || index} className="mb-4">
              <p>
                <strong>Message {index + 1}:</strong> {message.message || "No content"}
              </p>
              <p>{message.sent_at}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No messages found.</p>
      )}
    </div>
  );
};

export default function SendMessageForm({
  assignmentId,
  workers,
  messagesIds,
  onInvalidate,
}: {
  assignmentId: string;
  workers: Worker[];
  messagesIds: string[];
  onInvalidate: () => void;
}) {
  const [message, setMessage] = useState("");
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const queryClient = useQueryClient();

  // Fetch messages using useQuery
  const { data: messages, isLoading, isError } = useQuery({
    queryKey:["messages", messagesIds],
    queryFn:() => fetchMessages(messagesIds),
     enabled: messagesIds.length > 0 
  });

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["messages", messagesIds]});
      onInvalidate();
      setMessage("");
    },
    onError: (error: any) => {
      console.error("Error sending message:", error.message);
    },
});

  const handleSend = () => {
    if (!message.trim() || !selectedWorker) return;

    mutation.mutate({
      content: message,
      workerId: selectedWorker.id,
      assignmentId,
    });
  };

  return (
    <div className="relative py-2">
      <WorkerSelectionComponent
        workers={workers}
        onWorkerSelect={(worker) => setSelectedWorker(worker)}
      />
       <div className="bg-gray-100 p-2 rounded-md shadow-md">

        <MessagesStream messages={messages} />
       </div>
      <Textarea
        className="bg-gray-100 w-full pr-5 py-2 resize-none"
        placeholder="Type your message here."
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        variant="default"
        className="absolute bottom-2 right-2"
        onClick={handleSend}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Sending..." : "Send"}
      </Button>
    </div>
  );
}