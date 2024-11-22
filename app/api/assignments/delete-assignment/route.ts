import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';
import { FieldSet, Records } from 'airtable';

// Task type to explicitly define the structure
interface Task {
  id: string;
  fields: {
    assignmentId: string;
    [key: string]: any;
  };
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('DELETE request received at /api/delete-assignment');

    // Parse the request body
    const body = await request.json();
    console.log('Request body:', body);

    const { assignmentId } = body;
    console.log('Parsed assignmentId:', assignmentId);

    // Validate the inputcxcxc
    if (!assignmentId) {
      console.log('No assignment ID provided in the request');
      return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });
    }

    // Initialize Airtable base
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('appazEhgj3jhg8CxF');
    console.log('Airtable base initialized');

    // Fetch tasks associated with the assignment
    console.log('Fetching tasks associated with the assignment...');

    const tasksToDelete: string[] = await new Promise((resolve, reject) => {
      const _tasksToDelete: string[] = [];
      base('Tasks')
        .select({
          filterByFormula: `{assignmentId} = '${assignmentId}'`,
        })
        .eachPage(
          (records: Records<FieldSet>, fetchNextPage) => {
            _tasksToDelete.push(...records.map((record) => record.id));
            fetchNextPage();
          },
          (err) => {
            if (err) {
              console.error('Error fetching tasks from Airtable:', err);
              reject(err);
            } else {
              resolve(_tasksToDelete);
            }
          }
        );
    });

    console.log(`Tasks to delete: ${tasksToDelete.length} found`);

    // Delete tasks
    if (tasksToDelete.length > 0) {
      console.log(`Deleting ${tasksToDelete.length} tasks...`);
      await new Promise<void>((resolve, reject) => {
        base('Tasks').destroy(tasksToDelete, (err) => {
          if (err) {
            console.error('Error deleting tasks:', err);
            reject(err);
          } else {
            console.log('Successfully deleted tasks');
            resolve();
          }
        });
      });
    }

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
  } catch (error: unknown) {
    console.error('Error in DELETE request:', error);
    return NextResponse.json({ error: 'Failed to delete tasks or assignment' }, { status: 500 });
  }
}