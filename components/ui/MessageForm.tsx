import React, { useState } from "react";

interface MessageFormProps {
  recipientEmail: string; // Email of the person assigned to the task
  senderName: string; // Name of the sender
  assignmentTitle: string; // Title of the assignment
}

const MessageForm: React.FC<MessageFormProps> = ({
  recipientEmail,
  senderName,
  assignmentTitle,
}) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const emailBody = {
      recipientEmail, // Assigned person's email
      senderName, // Sender's name
      assignmentTitle, // Assignment title
      message, // User-provided message
    };

    try {
      const response = await fetch("/api/send-message-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailBody),
      });

      const data = await response.json();

      if (data.success) {
        alert("Message sent to the assigned person!");
      } else {
        alert("Failed to send the message.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred while sending the email.");
    }

    setIsLoading(false);
    setMessage("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
          required
          style={{ width: "100%", height: "100px" }}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
