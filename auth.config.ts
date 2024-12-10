import bcrypt from 'bcryptjs';
import axios from 'axios';
import Credentials from 'next-auth/providers/credentials';

// Define a type for your user object
export type AirtableUser = {
  id: string;
  email: string;
  role: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

const AUDLA_TblUsers = 'tbl0cWBYYUr5MhXbE';

const getRecordsInEdge = async ({
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

    console.log('Fetching records from Airtable with params:', params);
    

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

async function getUser({ email }: { email: string }): Promise<AirtableUser | undefined> {
  try {
    console.log(`Looking for user with email: ${email}`);
    const userRecords = await getRecordsInEdge({
      tableId: AUDLA_TblUsers,
      fieldName: 'Email',
      fieldValue: email,
    });

    if (userRecords.length === 0) {
      console.log(`No user found for email: ${email}`);
      return undefined;
    }
    if (userRecords.length > 1) {
      console.error(`Multiple users found for email: ${email}`);
      return undefined;
    }

    const userRecord = userRecords[0];

    const userPojo: AirtableUser = {
      id: userRecord.id,
      email: userRecord.Email || '',
      password: userRecord.Password || '',
      role: userRecord.Role || 'USER',
      firstName: userRecord.FirstName || '',
      lastName: userRecord.LastName || '',
    };

    // console.log('User found:', userPojo);
    return userPojo;
  } catch (e) {
    console.error('Error in getUser function:', e);
    return undefined;
  }
}

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { email, password }:any = credentials;

          // Fetch the user by email from your database (e.g., Airtable or another service)
          const user = await getUser({ email: email as string });

          if (!user) {
            console.error('User not found');
            return null; // Return null to indicate invalid credentials
          }

          // Compare passwords using bcrypt
          const isValidPassword = await bcrypt.compare(password, user.password);

          if (!isValidPassword) {
            console.error('Invalid password');
            return null; // Return null to indicate invalid credentials
          }

          // Return the user object if the credentials are valid
          return {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          };
        } catch (error) {
          // Log any unexpected errors
          console.error('Error during authorization:', error);
          return null; // Return null to prevent login
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',  // Redirect users to login if they are not authenticated
    error: '/login?error=CredentialsSignin', // Redirect to login with error message
  },
  callbacks: {
    async jwt({ token, user }:any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    async session({ session, token }:any) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
