import { NextResponse } from "next/server";
import { base } from '@/lib/airtable';
//https://airtable.com/appazEhgj3jhg8CxF/tbleQE8E49ShFF5Te/viwHPhIUr5F3fTV7p/fldyIdj9J3c8ujISm

const TABLE_ID = "tbleQE8E49ShFF5Te"

export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const  {tasks} = await req.json();
    const updatedTasks = tasks.map((task:any) => {
      const id = task.id;
      delete task.id;
      delete task.created_at;
      delete task.date_heure_lastModified;
      delete task.TaskDescription;
      return {
        id,
        fields: {
          ...task,
        },
      }
  });

    // Update the record in Airtable
    const result = await base(TABLE_ID).update(updatedTasks);

    console.log("Airtable response:", result);

    // Return success response
    return NextResponse.json({ message: "Time worked updated successfully" });
  } catch (error: unknown) {
    console.error("Airtable update error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
