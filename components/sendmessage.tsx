"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import WorkerSelectionComponent from "@/components/WorkerComponentSelection";

export default function AssignmentPage({ params, assignment, tasks, workers }: any) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState({ success: false, error: "" });

  const handleSend = async () => {
    if (!message.trim()) {
      setFeedback({ success: false, error: "Message cannot be empty." });
      return;
    }

    setIsSending(true);
    setFeedback({ success: false, error: "" });

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
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
        <WorkerSelectionComponent workers={workers} />
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
          {feedback.error && <p className="text-red-500 mt-2">{feedback.error}</p>}
          {feedback.success && <p className="text-green-500 mt-2">Message sent successfully!</p>}
        </div>
      </div>
    </div>
  );
}
