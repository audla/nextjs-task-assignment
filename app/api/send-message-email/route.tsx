// app/api/send-message-email/route.ts
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { MessageNotification } from '@/components/emails/MessageNotification';
let aws = require("@aws-sdk/client-ses");
const ses = new aws.SES({
    credentials: {
        accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || '',
    },
    region: process.env.AWS_SES_REGION
});

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
    const emailHtml = await render(
      <MessageNotification senderName={senderName} assignmentTitle={assignmentTitle} message={message} />
    );

    // Configure the Nodemailer transporter with AWS SES
    const transporter = nodemailer.createTransport({
        SES: { ses, aws },
        sendingRate: 14 
    })

    // Email options
    const mailOptions = {
      from: 'no-reply@audla.ca',
      to: recipientEmail,
      subject: `New Message Regarding: ${assignmentTitle}`,
      text: `You have a new message regarding the assignment: ${assignmentTitle}`,
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
