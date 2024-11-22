import { NextRequest, NextResponse } from 'next/server';
import { base, deleteAssignment, deleteTasks, getAllAssignments, getAssignmentById } from '@/lib/airtable';
import { getErrorMessage } from '@/lib/utils';
import Airtable from 'airtable';
import { FieldSet, Records } from 'airtable';

export async function GET(request: Request) {
  try {
    // Extract the ID from the URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });
    }

    const filterByFormula = `RECORD_ID()='${id}'`;
    const assignments = await getAllAssignments({ filterByFormula });

    if (!assignments.length) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    return NextResponse.json(assignments[0]); // Return the single assignment
  } catch (error: unknown) {
    console.error('Error fetching assignment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignment', errorDetails: getErrorMessage(error) },
      { status: 500 }
    );
  }
}


// Task type to explicitly define the structure
interface Task {
  id: string;
  fields: {
    assignmentId: string;
    [key: string]: any;
  };
}

export async function DELETE(request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const assignmentId = (await params).id 
  try {

    const assignment = await getAssignmentById(assignmentId);
    const tasksDeleted =  await deleteTasks(assignment.Tasks);
    let assignmentDeleted = null;


    if(tasksDeleted === true){
      console.log('Tasks deleted successfully');
      assignmentDeleted = await deleteAssignment(assignmentId);

      if(typeof assignmentDeleted === 'string'){
        console.log(`Erreur durant la supression d'un Assignment. Voici l'erreur: `,assignmentDeleted);
        return NextResponse.json({ error: assignmentDeleted }, { status: 500 });
      }else{
        console.log('Assignment deleted successfully');
      }
    }

    return NextResponse.json({ success: true, tasksDeleted, assignmentDeleted }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error in DELETE request:', error);
    return NextResponse.json({ error: 'Failed to delete tasks or assignment' }, { status: 500 });
  }
}