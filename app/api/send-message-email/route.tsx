import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { MessageNotification } from '@/components/emails/MessageNotification';
import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({
  region: process.env.AWS_SES_REGION,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || ''
  }
});

export async function POST(req: Request): Promise<Response> {
  try {
    const { recipientEmail, senderName, assignmentTitle, message } = await req.json();

    const emailHtml = await render(
      <MessageNotification 
        senderName={senderName} 
        assignmentTitle={assignmentTitle} 
        message={message} 
      />
    );

    const transporter = nodemailer.createTransport({
      SES: { 
        ses, 
        aws: { SendRawEmailCommand }
      }
    });

    const mailOptions = {
      from: 'no-reply@audla.ca',
      to: recipientEmail,
      subject: `New Message Regarding: ${assignmentTitle}`,
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ success: true, message: 'Email sent successfully.' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to send email.' }), { status: 500 });
  }
}