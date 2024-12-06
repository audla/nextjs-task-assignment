"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Worker } from "@/lib/airtable";
import { Message } from "@/lib/airtable";
import WorkerSelectionComponent from "@/components/WorkerComponentSelection";

export default function SendMessageForm({ params, assignment, tasks, workers, messages }: any) {
  const [message, setMessage] = useState("");
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState({ success: false, error: "" });

  const handleWorkerSelect = (worker: Worker | null) => {
    setSelectedWorker(worker); // Update selected worker in state
  };
  
  const handleSend = async () => {
    if (!message.trim()) {
        setFeedback({ success: false, error: "Message cannot be empty." });
        return;
      }
  
      if (!selectedWorker) {
        setFeedback({ success: false, error: "Please select a worker." });
        return;
      }

      console.log("Message to send:", message);
      console.log("Worker ID to send:", selectedWorker.id);

    setIsSending(true);
    setFeedback({ success: false, error: "" });

    try {
      const response = await fetch(`/api/messages`, {
        method: 'POST',
        headers: { "Content-Type": "application/json",
          Accept: "application/json",
         },
        body: JSON.stringify({
            content: message,
            workerId: selectedWorker.id, 
            assignmentId: assignment,
            Message: assignment,
          }),
      });

      if (!response.ok) {
        throw new Error("Failed to send the message.");
      }

      setFeedback({ success: true, error: "" });
      setMessage(""); // Clear the textarea
    } catch (error: any) {
      setFeedback({ success: false, error: error.message });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-12 pb-24 pt-50 sm:p-24 flex items-start print:bg-white print:p-0">
      {/* Existing assignment details here */}

      {/* Right Sidebar */}
      <div className="bg-gray-300 w-[300px] p-4 rounded-md shadow-lg flex flex-col print-hidden">
        <WorkerSelectionComponent 
        workers={workers}
        onWorkerSelect={handleWorkerSelect}
        />
        <div className="relative py-2">
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
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
           </div>
          {feedback.error && <p className="text-red-500 mt-2">{feedback.error}</p>}
          {feedback.success && <p className="text-green-500 mt-2">Message sent successfully!</p>}
        </div>
        <div>
          {Array.isArray(messages) && messages.length > 0 ? (
            <ul>
              {messages.map((message, index) => (
                <li key={message.id || index} className="mb-4">
                  <p>
                    <strong>Message {index + 1}:</strong> {message.message || "No content"}
                  </p>
                </li>
              ))}
            </ul> 
          ) : (
            <p>No messages found.</p>
          )}
      </div>
    </div>
  );
}
