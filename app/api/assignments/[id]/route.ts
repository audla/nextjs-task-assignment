import { NextResponse } from 'next/server';
import { getAllAssignments } from '@/lib/airtable';
import { getErrorMessage } from '@/lib/utils';

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