import { NextResponse } from 'next/server';
import { createMessage, getAllMessages } from '@/lib/airtable';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messageIds, newMessage } = body;

    // Handle new message creation
    if (newMessage) {
      const { content, author, timestamp } = newMessage;

      // Validate required fields
      if (!content || !author) {
        return NextResponse.json(
          { error: 'Missing required fields: content or author' },
          { status: 400 }
        );
      }

      // Create the new message
      const createdMessage = await createMessage({ content, author, timestamp });

      return NextResponse.json(
        { message: 'Message created successfully', createdMessage },
        { status: 201 }
      );
    }

    // Fetch existing messages by IDs
    if (!messageIds || !Array.isArray(messageIds)) {
      return NextResponse.json(
        { error: 'Invalid or missing messageIds' },
        { status: 400 }
      );
    }

    const filterByFormula = `OR(${messageIds.map((id) => `RECORD_ID()='${id}'`).join(',')})`;
    const messages = await getAllMessages({ filterByFormula });

    if (!messages.length) {
      return NextResponse.json({ error: 'No messages found' }, { status: 404 });
    }

    return NextResponse.json(messages);
  } catch (error: any) {
    console.error('Error handling messages:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
