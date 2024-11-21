import { NextResponse } from 'next/server';
import { getAllAssignments } from '@/lib/airtable';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });
    }

    const filterByFormula = `RECORD_ID()='${id}'`;
    const assignments = await getAllAssignments({ filterByFormula });

    if (!assignments.length) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    return NextResponse.json(assignments[0]); // Return the single assignment
  } catch (error: any) {
    console.error('Error fetching assignment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignment', errorDetails: error.message },
      { status: 500 }
    );
  }
}
