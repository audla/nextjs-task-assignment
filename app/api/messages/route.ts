import { NextRequest, NextResponse } from "next/server";
import { createMessage, getMessages } from "@/lib/airtable";
import { getErrorMessage } from "@/lib/utils";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get('ids');

    if (!ids) {
      return NextResponse.json({ error: "Missing 'ids' parameter" }, { status: 400 });
    }

    const messageIds = ids.split(',');

    // Fetch the messages from Airtable
    const messages = await getMessages(messageIds);

    // Respond with the fetched messages
    return NextResponse.json(messages, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages", message: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { content, workerId, assignmentId } = await req.json();

    // Validate the input
    if (!content || !workerId) {
      return NextResponse.json({ error: "Invalid or missing 'content' or 'author'" }, { status: 400 });
    }

    // Create the message in Airtable
    const newMessage = await createMessage({ content, workerId, assignmentId });

    // Respond with the newly created message
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error:unknown) {
    console.error("Error creating message:", error);
    return NextResponse.json({ error: "Failed to create message", message:getErrorMessage(error) }, { status: 500 });

  }
}
