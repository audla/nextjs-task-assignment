import bcrypt from 'bcryptjs';
import axios from 'axios';
import { base } from './airtable';


export const getRecordsInEdge = async ({
  tableId,
  fieldName,
  fieldValue,
  sort = undefined,
  view = 'Grid view',
}: {
  tableId: string;
  fieldName: string;
  fieldValue: string | number;
  sort?: { field: string; direction: 'asc' | 'desc' }[];
  view?: string;
}): Promise<any[]> => {
  let recordsData: any[] = [];

  try {
    const params: any = {
      view,
      filterByFormula: `{${fieldName}} = "${fieldValue}"`,
    };

    if (sort && Array.isArray(sort)) {
      params.sort = sort.map(({ field, direction }) => ({
        field,
        direction,
      }));
    }

    // console.log('Fetching records from Airtable...');
    const response = await axios.get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${tableId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
        params,
      }
    );

    const records = response.data.records;
    records.forEach((record: any) => {
      const fields = record.fields;
      recordsData.push({
        id: record.id, // Airtable record ID
        ...fields,
      });
    });
    // console.log('Fetched records successfully:', recordsData);
  } catch (error) {
    console.error('Error fetching Airtable records:', error);
  }

  return recordsData;
};

// Function to update a record in Airtable
export async function updateRecordsInEdge(table: string, records: { id: string; fields: any }[]): Promise<any | null> {
  try {
    const response = await axios.patch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${table}`,
      {
        records,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response.data);

    // Return the updated records
    return response.data.records;
  } catch (error) {
    console.error(`Error updating records in table ${table}:`, error);
    return null;
  }
}

// Update user record with the Password Reset Code and return the updated record
export async function updateUserPasswordResetCode(userId: string, resetCode: string) {
  try {
    const updatedRecord = await updateRecordsInEdge('Users', [
      {
        id: userId,
        fields: {
          PasswordResetCode: resetCode,
        },
      },
    ]);
    return updatedRecord; // Return the updated record
  } catch (error) {
    console.error(`Error updating Password Reset Code for user ${userId}:`, error);
    return null; // Return null in case of an error
  }
}


// Function to fetch user by email
export async function fetchUserByEmail(email: string): Promise<any | null> {
  try {
    const promise = new Promise((resolve, reject) => {
      base('Users')
        .select({
          filterByFormula: `{Email} = '${email}'`,
        })
        .firstPage((records) => {
          console.log(records);
          
          if (records.length > 0) {
            resolve(records[0]);
          } else {
            reject(null);
          }
        });
    });

      
     return promise;
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error);
    return null;
  }
}

// Function to fetch user by reset token (PasswordResetCode)
export async function fetchUserByResetCode(resetCode: string): Promise<any | null> {
  try {
    const records = await getRecordsInEdge({
      tableId: 'Users',
      fieldName: 'PasswordResetCode',
      fieldValue: resetCode,
    });

    return records.length > 0 ? records[0] : null;
  } catch (error) {
    console.error(`Error fetching user by reset code:`, error);
    return null;
  }
}



// Function to update user password and clear the reset token
export async function updateUserPassword(userId: string, newPassword: string) {
  try {
    // Hash the password using bcryptjs
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user record with the hashed password and clear the reset token
    const updatedRecord = await updateRecordsInEdge('Users', [
      {
        id: userId,
        fields: {
          Password: hashedPassword, // Store the hashed password
          PasswordResetCode: '', // Clear the reset token after successful password update
        },
      },
    ]);
    return updatedRecord;
  } catch (error) {
    console.error(`Error updating password for user ${userId}:`, error);
    return null;
  }
}


export async function resetPassword(token: string) {
  try {
    // Fetch the user by the reset token from Airtable
    const userRecord = await fetchUserByResetCode(token);

    if (!userRecord) {
      return { success: false, message: 'Invalid or expired recovery token. Please request a new password reset.' };
    }

    // Return success message and pass userId
    return { success: true, message: 'Account recovered successfully. You can now set a new password.', userId: userRecord.id };
  } catch (error: any) {
    console.error('Error recovering account:', error);
    return { success: false, message: 'Error recovering account. Please try again or contact support.' };
  }
}


