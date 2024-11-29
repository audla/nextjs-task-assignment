import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { baseId, tableIdOrName, recordId, text } = await req.json();

  if (!baseId || !tableIdOrName || !recordId || !text) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  const url = `https://api.airtable.com/v0/${baseId}/${tableIdOrName}/${recordId}/comments`;
  const token = process.env.AIRTABLE_API_KEY;

  if (!token) {
    return NextResponse.json(
      { error: 'Missing Airtable API Key' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add comment', details: (error as Error).message },
      { status: 500 }
    );
  }
}