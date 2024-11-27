import { NextResponse } from 'next/server';
import { base } from '@/lib/airtable'; // assuming this is where you initialize Airtable

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
    return NextResponse.json({ error: "Failed to update tasks" }, { status: 500 });
  }
}
