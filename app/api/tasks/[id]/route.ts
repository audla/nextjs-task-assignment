import { NextRequest, NextResponse } from "next/server";

// Replace with your Airtable API key and Base ID
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_TASKS_TABLE = "Tasks";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate the required fields
    const { title, description, status, priority, due_date, estimated_hours, assignmentId } = body;

    if (!title || !description || !assignmentId) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, or assignmentId" },
        { status: 422 }
      );
    }

    // Airtable API request payload
    const airtablePayload = {
      fields: {
        Title: title,
        Description: description,
        Status: status || "Not ready",
        Priority: priority || "Not that important",
        DueDate: due_date || null,
        EstimatedHours: estimated_hours || null,
        AssignmentID: assignmentId,
      },
    };

    // Make the request to Airtable
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TASKS_TABLE}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(airtablePayload),
      }
    );

    if (!airtableResponse.ok) {
      const errorData = await airtableResponse.json();
      console.error("Airtable error:", errorData);
      return NextResponse.json(
        { error: "Failed to save task to Airtable", details: errorData },
        { status: 500 }
      );
    }

    const airtableData = await airtableResponse.json();

    return NextResponse.json(
      {
        message: "Task created successfully!",
        task: airtableData,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Invalid request or server error" }, { status: 400 });
  }
}
