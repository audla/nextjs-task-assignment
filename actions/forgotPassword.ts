'use server'

import { getRecordsInEdge, updateUserPasswordResetCode } from '@/lib/audla-auth';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
let aws = require("@aws-sdk/client-ses");

const AUDLA_TBL_USERS ={
    ID: "tbl0cWBYYUr5MhXbE",
    EMAIL:"fldJlbXMdSKnnq24E"
  }; 

const ses = new aws.SES({
    credentials: {
        accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY || '',
    },
    region: process.env.AWS_SES_REGION
});

export async function requestPasswordReset(email: string, locale:'en'|'fr') {
    try {
        // 1. Generate a unique reset code
        const resetCode = crypto.randomBytes(20).toString('hex'); // 20 bytes for a 40-character code

        // 2. Fetch the parent record from Airtable using the provided email
        const userRecords = await getRecordsInEdge({
            tableId: AUDLA_TBL_USERS.ID,
            fieldName: AUDLA_TBL_USERS.EMAIL,
            fieldValue: email,
          })

          const userRecord = userRecords[0] as unknown as {id:string,FirstName:string,LastName:string} | null;

        if (!userRecord) {
            return { success: false, message: 'User with the provided email not found.' };
        }

        // 3. Store the reset code in the 'PasswordResetCode' field in Airtable
        const updatedParent = await updateUserPasswordResetCode(userRecord.id, resetCode);

        if (!updatedParent) {
            return { success: false, message: 'Failed to update password reset code.' };
        }

        // 4. Construct the password reset URL
        const resetUrl = `${process.env.NEXT_PUBLIC_URL}/reset-password?code=${resetCode}`;

        // 5. Set up Nodemailer with AWS SES
        const transporter = nodemailer.createTransport({
            SES: { ses, aws },
            sendingRate: 14 // limits sending rate
        });

        // 6. Define the email options
        const mailOptions = {
            from: 'Audla <no-reply@audla.ca>',
            to: `${userRecord.FirstName} ${userRecord.LastName} <${email}>`,
            subject: "Audla - Password Reset Request",
            text: `Hi ${userRecord.FirstName},\n\nWe received a request to reset your password. Click the link below to reset it:\n\n${resetUrl}\n\nIf you didn't request this, please ignore this email.\n\nThank you,\nAudla`,
            html: `
              <p>Hi ${userRecord.FirstName},</p>
              <p>We received a request to reset your password. Click the link below to reset it:</p>
              <a href="${resetUrl}">Reset your password</a>
              <p>If you didn't request this, please ignore this email.</p>
              <p>Thank you,<br/>Audla</p>
            `,
        };

        // 7. Send the email
        await transporter.sendMail(mailOptions);

        return { success: true, message: 'Password reset email sent. Please check your inbox.' };
    } catch (error) {
        console.error('Error requesting password reset:', error);
        return { success: false, message: 'Error requesting password reset. Please try again.' };
    }
}
