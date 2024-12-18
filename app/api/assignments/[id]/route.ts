import { NextRequest, NextResponse } from 'next/server';
import {  deleteAssignment, deleteTasks, getAssignmentById } from '@/lib/airtable';
import { getErrorMessage } from '@/lib/utils';
import Airtable from 'airtable';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  throw new Error('Airtable API key or Base ID is missing')
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID)

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('DELETE request received', request.json());
  const assignmentId = (await params).id; // Extract assignment ID from params

  try {
    const assignment = await getAssignmentById(assignmentId);

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    let tasksDeleted = true; // Default to true for assignments without tasks

    // Check if the assignment has tasks
    if (assignment.Tasks && assignment.Tasks.length > 0) {
      console.log('Deleting associated tasks...');
      tasksDeleted = await deleteTasks(assignment.Tasks);

      if (tasksDeleted !== true) {
        console.error('Error deleting tasks:', tasksDeleted);
        return NextResponse.json({ error: tasksDeleted }, { status: 500 });
      }
    } else {
      console.log('No tasks associated with this assignment.');
    }

    console.log('Deleting the assignment...');
    const assignmentDeleted = await deleteAssignment(assignmentId);

    if (typeof assignmentDeleted === 'string') {
      console.error(`Error deleting assignment:`, assignmentDeleted);
      return NextResponse.json({ error: assignmentDeleted }, { status: 500 });
    }

    console.log('Assignment deleted successfully');
    return NextResponse.json(
      { success: true, tasksDeleted, assignmentDeleted },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error in DELETE request:', error);
    return NextResponse.json(
      { error: 'Failed to delete tasks or assignment', errorDetails: getErrorMessage(error) },
      { status: 500 }
    );
  }
}



export async function GET(  request: Request,
  { params }: { params: Promise<{ id: string }> }) {
  try {
    const assignmentId = (await params).id;

    if (!assignmentId) {
      return NextResponse.json({ error: "Missing 'assignmentId' parameter" }, { status: 400 });
    }


    // Fetch the messages from Airtable
    const messages = await getAssignmentById(assignmentId);

    // Respond with the fetched messages
    return NextResponse.json(messages, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages", message: getErrorMessage(error) }, { status: 500 });
  }
}


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id

  try {
    const { Titre, Workers, WorkersFirstName, Task } = await request.json()

    if (!Titre && !Workers && !WorkersFirstName) {
      return NextResponse.json(
        { error: 'At least one field (Titre, Workers, or WorkersFirstName) must be provided for update' },
        { status: 400 }
      )
    }

    const updateFields: Partial<{
      Titre: string;
      Workers: string[];
      WorkersFirstName: string[];
    }> = {}

    if (Titre) {
      updateFields.Titre = Titre
    }

    if (Workers) {
      updateFields.Workers = Workers
    }

    if (WorkersFirstName) {
      updateFields.WorkersFirstName = WorkersFirstName
    }

    const updatedRecord = await base('Assignments').update([
      {
        id: id,
        fields: updateFields,
      },
    ])

    if (updatedRecord && updatedRecord.length > 0) {
      return NextResponse.json(
        { message: 'Assignment updated successfully', assignment: updatedRecord[0] },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { error: 'Assignment not found or not updated' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error updating assignment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



