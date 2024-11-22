import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

export async function DELETE(request: NextRequest) {
  try {
    console.log('DELETE request received at /api/delete-assignment');

    // Parse the request body
    const body = await request.json();
    console.log('Request body:', body);

    const { assignmentId } = body;
    console.log('Parsed assignmentId:', assignmentId);

    // Validate the input
    if (!assignmentId) {
      console.log('No assignment ID provided in the request');
      return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });
    }

    // Initialize Airtable base
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('appazEhgj3jhg8CxF');
    console.log('Airtable base initialized');

    // Fetch tasks associated with the assignment
   
    console.log('Fetching tasks associated with the assignment...');

    const tasksToDelete = new Promise((resolve, reject) => {
     const _tasksToDelete = []
      base('Tasks')
        .select({
          filterByFormula: `{assignmentId} = '${assignmentId}'`, // Assuming Tasks table has "AssignmentId" field
        })
        .eachPage(
          (records, fetchNextPage) => {
            _tasksToDelete.push(...records.map((record) => record.id)); // Add task IDs
            fetchNextPage();
          },
          (err) => {
            if (err) {
              console.error('Error fetching tasks from Airtable:', err);
              reject(err); // Reject the promise on error
            } else {
              resolve(_tasksToDelete); // Resolve the promise after all pages are fetched
            }
          }
        );
    });

    console.log(`Tasks to delete: ${tasksToDelete.length} found`);

    // Delete the assignment
    console.log(`Deleting assignment with ID: ${assignmentId}`);
    await new Promise<void>((resolve, reject) => {
      base('Assignments').destroy([assignmentId], (err) => {
        if (err) {
          console.error('Error deleting assignment:', err);
          reject(err);
        } else {
          console.log('Successfully deleted assignment');
          resolve();
        }
      });
    });

    return NextResponse.json({ success: true, message: 'Tasks and assignment deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE request:', error);
    return NextResponse.json({ error: 'Failed to delete tasks or assignment' }, { status: 500 });
  }
}
