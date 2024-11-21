import { NextResponse } from 'next/server';
import { getAllAssignments } from '@/lib/airtable';

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
  } catch (error: any) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments',
        errorDetails: error.message
     }, { status: 500 }
    );
  }
}