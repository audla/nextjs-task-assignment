import { NextResponse } from "next/server";
import { createMessage } from "@/lib/airtable";

export async function POST(req: Request) {
  try {
    const { content, workerId } = await req.json();

    // Validate the input
    if (!content || !workerId) {
      return NextResponse.json({ error: "Invalid or missing 'content' or 'author'" }, { status: 400 });
    }

    // Create the message in Airtable
    const newMessage = await createMessage({ content, workerId });

    // Respond with the newly created message
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error:any) {
    console.error("Error creating message:", error);
    return NextResponse.json({ error: "Failed to create message", message:error.message }, { status: 500 });

  }
}
