// app/api/send-message-email/route.ts
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { MessageNotification } from '@/components/emails/MessageNotification';
import { MessageNotificationProps } from '@/types/email';

export async function POST(req: Request): Promise<Response> {
  try {
    const body: {
      recipientEmail: string;
      senderName: string;
      assignmentTitle: string;
      message: string;
    } = await req.json();

    const { recipientEmail, senderName, assignmentTitle, message } = body;

    // Render the email content
    const emailHtml = render(
      <MessageNotification senderName={senderName} assignmentTitle={assignmentTitle} message={message} />
    );

    // Configure the Nodemailer transporter with AWS SES
    const transporter = nodemailer.createTransport({
      SES: {
        apiVersion: '2010-12-01',
        region: process.env.AWS_REGION, // Your AWS region
      },
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    });

    // Email options
    const mailOptions = {
      from: 'your-email@example.com', // Your verified email
      to: recipientEmail,
      subject: `New Message Regarding: ${assignmentTitle}`,
      html: emailHtml,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true, message: 'Email sent successfully.' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to send email.' }), { status: 500 });
  }
}
