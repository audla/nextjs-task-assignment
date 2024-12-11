import bcrypt from 'bcryptjs';
import axios, { AxiosResponse } from 'axios';
import { base } from './airtable';

interface AirtableRecordFields {
  [key: string]: unknown;
}

interface AirtableRecord {
  id: string;
  fields: AirtableRecordFields;
  createdTime?: string;
}

interface AirtableListResponse {
  records: AirtableRecord[];
}

interface UpdateRecord {
  id: string;
  fields: Record<string, unknown>;
}

interface GetRecordsParams {
  tableId: string;
  fieldName: string;
  fieldValue: string | number;
  sort?: { field: string; direction: 'asc' | 'desc' }[];
  view?: string;
}

export const getRecordsInEdge = async ({
  tableId,
  fieldName,
  fieldValue,
  sort,
  view = 'Grid view',
}: GetRecordsParams): Promise<AirtableRecord[]> => {
  const recordsData: AirtableRecord[] = [];

  try {
    const params: Record<string, unknown> = {
      view,
      filterByFormula: `{${fieldName}} = "${fieldValue}"`,
    };

    if (sort && Array.isArray(sort)) {
      params.sort = sort.map(({ field, direction }) => ({
        field,
        direction,
      }));
    }

    const response: AxiosResponse<AirtableListResponse> = await axios.get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${tableId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
        params,
      }
    );

    const records = response.data.records;
    records.forEach((record) => {
      recordsData.push({
        id: record.id,
        fields: { ...record.fields },
        createdTime: record.createdTime,
      });
    });
  } catch (error) {
    console.error('Error fetching Airtable records:', error);
  }

  return recordsData;
};

// Function to update a record in Airtable
export async function updateRecordsInEdge(
  table: string,
  records: UpdateRecord[]
): Promise<AirtableRecord[] | null> {
  try {
    const response: AxiosResponse<AirtableListResponse> = await axios.patch(
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

    return response.data.records;
  } catch (error) {
    console.error(`Error updating records in table ${table}:`, error);
    return null;
  }
}

// Update user record with the Password Reset Code and return the updated record
export async function updateUserPasswordResetCode(userId: string, resetCode: string): Promise<AirtableRecord[] | null> {
  try {
    const updatedRecord = await updateRecordsInEdge('Users', [
      {
        id: userId,
        fields: {
          PasswordResetCode: resetCode,
        },
      },
    ]);
    return updatedRecord;
  } catch (error) {
    console.error(`Error updating Password Reset Code for user ${userId}:`, error);
    return null;
  }
}

// Function to fetch user by email
export async function fetchUserByEmail(email: string): Promise<AirtableRecord | null> {
  try {
    const promise = new Promise<AirtableRecord | null>((resolve, reject) => {
      base('Users')
        .select({
          filterByFormula: `{Email} = '${email}'`,
        })
        .firstPage((records: AirtableRecord[]) => {
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
export async function fetchUserByResetCode(resetCode: string): Promise<AirtableRecord | null> {
  try {
    const records = await getRecordsInEdge({
      tableId: 'Users',
      fieldName: 'PasswordResetCode',
      fieldValue: resetCode,
    });

    return records.length > 0 ? records[0] : null;
  } catch (error) {
    console.error('Error fetching user by reset code:', error);
    return null;
  }
}

// Function to update user password and clear the reset token
export async function updateUserPassword(userId: string, newPassword: string): Promise<AirtableRecord[] | null> {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updatedRecord = await updateRecordsInEdge('Users', [
      {
        id: userId,
        fields: {
          Password: hashedPassword,
          PasswordResetCode: '',
        },
      },
    ]);
    return updatedRecord;
  } catch (error) {
    console.error(`Error updating password for user ${userId}:`, error);
    return null;
  }
}

export async function resetPassword(token: string): Promise<{ success: boolean; message: string; userId?: string }> {
  try {
    const userRecord = await fetchUserByResetCode(token);

    if (!userRecord) {
      return { success: false, message: 'Invalid or expired recovery token. Please request a new password reset.' };
    }

    return {
      success: true,
      message: 'Account recovered successfully. You can now set a new password.',
      userId: userRecord.id,
    };
  } catch (error) {
    console.error('Error recovering account:', error);
    return { success: false, message: 'Error recovering account. Please try again or contact support.' };
  }
}