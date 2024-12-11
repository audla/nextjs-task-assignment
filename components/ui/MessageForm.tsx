import React, { useState } from 'react';

interface MessageFormProps {
  recipientEmail: string;
  senderName: string;
  assignmentTitle: string;
}

const MessageForm: React.FC<MessageFormProps> = ({ recipientEmail, senderName, assignmentTitle }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Make API call to send email
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail,
          senderName,
          assignmentTitle,
          message,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Message sent!');
      } else {
        alert('Failed to send message.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while sending the message.');
    }

    setIsLoading(false);
    setMessage('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
          required
          style={{ width: '100%', height: '100px' }}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
