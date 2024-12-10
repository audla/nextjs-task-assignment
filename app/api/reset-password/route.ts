import { fetchUserByResetCode } from '@/lib/audla-auth';
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { token } = await request.json(); // Get token from request body

    // Fetch the parent by the reset token from Airtable
    const parentRecord = await fetchUserByResetCode(token);

    if (!parentRecord) {
      return NextResponse.json({ success: false, message: 'Invalid or expired recovery token. Please request a new password reset.' });
    }

    // Return success message and pass parentId
    return NextResponse.json({ success: true, message: 'Account recovered successfully. You can now set a new password.', parentId: parentRecord.id });
  } catch (error) {
    console.error('Error recovering account:', error);
    return NextResponse.json({ success: false, message: 'Error recovering account. Please try again or contact support.' });
  }
}
