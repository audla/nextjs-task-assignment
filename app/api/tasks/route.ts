//TODO: add task query

import { NormalizeError } from "next/dist/shared/lib/utils";
import { NextRequest, NextResponse } from "next/server";

import { base, getAllTasks } from '@/lib/airtable';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const filterByFormula = `RECORD_ID()='${id}'`;
    const assignments = await getAllTasks({ filterByFormula });

    if (!assignments.length) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(assignments[0]); // Return the single assignment
  } catch (error: any) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task', errorDetails: error.message },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
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
    } catch (error: any) {
      console.error("Airtable update error:", error);
      return NextResponse.json(error, { status: error.statusCode });
    }
  }