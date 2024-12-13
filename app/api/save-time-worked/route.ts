import { NextResponse } from "next/server";
import { base } from '@/lib/airtable';
//https://airtable.com/appazEhgj3jhg8CxF/tbleQE8E49ShFF5Te/viwHPhIUr5F3fTV7p/fldyIdj9J3c8ujISm

const TABLE_ID = "tbleQE8E49ShFF5Te"

export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const { taskId, timeWorked } = await req.json();
    console.log("Received data:", { taskId, timeWorked });

    // Validation
    if (!taskId || typeof taskId !== 'string') {
      console.error("Invalid taskId:", taskId);
      return NextResponse.json({ error: "Invalid or missing taskId" }, { status: 400 });
    }
    if (timeWorked === undefined || typeof timeWorked !== 'number' || timeWorked <= 0) {
      console.error("Invalid timeWorked:", timeWorked);
      return NextResponse.json({ error: "Invalid or missing timeWorked" }, { status: 400 });
    }

    // Update the record in Airtable
    const update = {
      id: taskId,
      fields: {
        ActualWorkTime: timeWorked, // Directly update the TotalTimeWorked field
      },
    };

    console.log("Prepared update for Airtable:", update);

    // Update the record in Airtable
    const result = await base(TABLE_ID).update([update]);

    console.log("Airtable response:", result);

    // Return success response
    return NextResponse.json({ message: "Time worked updated successfully" });
  } catch (error: unknown) {
    console.error("Airtable update error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
