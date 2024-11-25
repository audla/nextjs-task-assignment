import { NextRequest, NextResponse } from 'next/server';
import { base, deleteAssignment, deleteTasks, getAllAssignments, getAssignmentById } from '@/lib/airtable';
import { getErrorMessage } from '@/lib/utils';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
