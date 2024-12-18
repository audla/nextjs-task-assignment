
import {  NextRequest, NextResponse } from "next/server";
import { base } from '@/lib/airtable';


export async function PATCH(req: Request) {
    try {
      // Parse the incoming request body
      const { tasks } = await req.json();
      console.log("Received tasks:", tasks); // Log to debug
  
      if (!tasks || !Array.isArray(tasks)) {
        console.error("Invalid tasks data:", tasks);
        return NextResponse.json({ error: "Invalid tasks data" }, { status: 400 });
      }
  
      const updates = tasks.map((task: { id: string; status: string }) => ({
        id: task.id,
        fields: { status: task.status },
      }));
  
      console.log("Prepared updates for Airtable:", updates);
  
      const result = await base("Tasks").update(updates);
  
      console.log("Airtable response:", result); // Log Airtable response
  
      return NextResponse.json({ message: "Tasks updated successfully" });
    } catch (error: unknown) {
      console.error("Airtable update error:", error);
      return NextResponse.json(error);
    }
  }

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