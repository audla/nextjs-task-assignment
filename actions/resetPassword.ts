'use server'

import { fetchUserByResetCode, updateUserPassword } from "@/lib/audla-auth";




export async function resetPassword(token: string) {
  try {
    // Fetch the user by the reset token from Airtable
    const userRecord = await fetchUserByResetCode(token);

    if (!userRecord) {
      return { success: false, message: 'Invalid or expired recovery token. Please request a new password reset.' };
    }

    // Return success message and proceed to allow setting a new password
    return { success: true, message: 'Account recovered successfully. You can now set a new password.', userId: userRecord.id };
  } catch (error: any) {
    console.error('Error recovering account:', error);
    return { success: false, message: 'Error recovering account. Please try again or contact support.' };
  }
}

export async function updatePassword(userId: string, newPassword: string) {
  try {
    // Ensure userId is valid (this should be passed after verifying the reset token)
    if (!userId) {
      return { success: false, message: 'No valid account found. Please try the recovery process again.' };
    }

    // Update the user record with the new password
    const updateResult = await updateUserPassword(userId, newPassword);

    if (!updateResult) {
      return { success: false, message: 'Failed to update password. Please try again.' };
    }

    return { success: true, message: 'Password updated successfully. You can now log in with your new password.' };
  } catch (error) {
    console.error('Error updating password:', error);
    return { success: false, message: 'Error updating password. Please try again or contact support.' };
  }
}
