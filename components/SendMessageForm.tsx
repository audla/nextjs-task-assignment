"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import WorkerSelectionComponent from "@/components/WorkerComponentSelection";
import {  Worker } from "@/lib/airtable";
import { ChatScrollArea } from "./chat-scroll-area";
import { getErrorMessage } from "@/lib/utils";

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


  const { data: messages, isPending, isError } = useQuery({
    queryKey: ["messages", messagesIds],
    queryFn: () => fetchMessages(messagesIds),
    enabled: messagesIds?.length > 0,
  });

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", messagesIds] });
      onInvalidate();
      setMessage("");
    },
    onError: (error: unknown) => {
      console.error("Error sending message:", getErrorMessage(error));
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
    <div className="bg-gray-50 rounded-lg shadow-md p-4 sm:p-6">
      <div className="mb-4">
        <WorkerSelectionComponent
          workers={workers}
          onWorkerSelect={(worker) => setSelectedWorker(worker)}
        />
      </div>
      <div className="bg-white rounded-lg shadow-inner p-4 mb-4 h-64 sm:h-80 overflow-hidden">
        {isPending ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">Error loading messages. Please try again.</p>
          </div>
        ) : (
          <ChatScrollArea messages={messages} workers={workers} />
        )}
      </div>
      <div className="relative">
        <Textarea
          className="w-full pr-24 py-3 px-4 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-200 focus:ring-opacity-50 resize-none transition duration-200 ease-in-out"
          placeholder="Type your message here."
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          variant="default"
          className="absolute bottom-3 right-3 bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          onClick={handleSend}
          disabled={mutation.isPending || !selectedWorker || !message.trim()}
        >
          {mutation.isPending ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}

