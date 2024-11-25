import { getAssignmentById, getTaskById } from '@/lib/airtable';
import { getErrorMessage } from '@/lib/utils';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const assignment = await getAssignmentById(params.id);
    return { title: `Assignment: ${assignment.Titre}` };
  } catch {
    return { title: 'Assignment Not Found' };
  }
}

export default async function AssignmentPage({ params }: { params: { id: string } }) {
  try {
    const assignment = await getAssignmentById(params.id);

    // Fetch tasks only if there are any associated with the assignment
    const tasks = assignment.Tasks ? await Promise.all(assignment.Tasks.map(getTaskById)) : [];

    return (
      <div>
        <h1>Assignment Details</h1>
        <p>
          <strong>ID:</strong> {assignment.id}
        </p>
        <p>
          <strong>Title:</strong> {assignment.Titre}
        </p>
        <p>
          <strong>Status:</strong> {assignment.assignment_status}
        </p>
        {tasks.length > 0 && (
          <div>
            <p>
              <strong>Number of Tasks:</strong> {tasks.length}
            </p>
            <ul>
              {tasks.map((task, index) => (
                <li key={task.id}>
                  <strong>Task {index +1}: </strong> {task.title}<br/>
                  Status: {task.status}<br/>
                  Description: {task.description}<br/>
                  Priority: {task.priority}<br/>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  } catch (error: unknown) {
    return (
      <div>
        <h1>Error</h1>
        <p>Failed to load assignment: {getErrorMessage(error)}</p>
      </div>
    );
  }
}
