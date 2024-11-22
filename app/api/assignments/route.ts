import { NextResponse } from 'next/server';
import { getAllAssignments } from '@/lib/airtable';
import { getErrorMessage } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const { assignmentIds } = await req.json();
    

    if (!assignmentIds || !Array.isArray(assignmentIds)) {
      return NextResponse.json({ error: 'Invalid or missing assignmentIds' }, { status: 400 });
    }

    const filterByFormula = `OR(${assignmentIds.map((id) => `RECORD_ID()='${id}'`).join(',')})`;
    const assignments = await getAllAssignments({ filterByFormula });


    if (!assignments.length) {
      return NextResponse.json({ error: 'No assignments found' }, { status: 404 });
    }

    return NextResponse.json(assignments);
  } catch (error: unknown) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments',
        errorDetails: getErrorMessage(error)
     }, { status: 500 }
    );
  }
}