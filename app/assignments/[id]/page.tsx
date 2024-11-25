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
      <div className="bg-gray-900  items-start min-h-screen p-8 pb-20 pt-50 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="bg-white min-h-[90vh] max-w-[975px] mx-auto p-4 flex flex-col justify-start items-start rounded-md shadow-xl">
        <h1 className="text-red-500 text-4xl font-[family-name:var(--font-geist-sans)] font-bold">Assignment Details</h1>
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
