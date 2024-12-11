import { NextResponse } from 'next/server';

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_TABLE_NAME = 'Messages'; // Adjust if different
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

export async function POST(request: Request) {
  try {
    const { content, author } = await request.json();

    // Validate payload
    if (!content || !author) {
      return NextResponse.json(
        { error: 'Missing content or author' },
        { status: 400 }
      );
    }

    const response = await fetch(AIRTABLE_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          Content: content, // Ensure these field names match your Airtable schema
          Author: author,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Airtable API error:', errorData);
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(
      { message: 'Message added successfully', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding message:', error);
    return NextResponse.json({ error: 'Failed to add message' }, { status: 500 });
  }
}

// (Optional) If you want to specify runtime
// export const runtime = 'edge';