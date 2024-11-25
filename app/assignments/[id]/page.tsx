import { getAssignmentById, getTaskById } from '@/lib/airtable';
import { getErrorMessage } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';

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
      <div className="bg-gray-900 min-h-screen p-12 pb-24 pt-50 sm:p-24 flex items-start">
        <div className="bg-white min-h-[90vh] max-w-[1100px] w-full mx-auto p-6 rounded-md shadow-xl flex flex-col relative">
          <h1 className="text-red-500 text-4xl font-bold mb-6">Assignment Details</h1>

          <p className="mb-4">
            <strong>ID:</strong> {assignment.id}
          </p>
          <p className="mb-4">
            <strong>Title:</strong> {assignment.Titre}
          </p>
          <p className="mb-8">
            <strong>Status:</strong>{' '}
            <span
              className={
                assignment.assignment_status === 'TODO'
                  ? 'text-red-500 font-bold'
                  : assignment.assignment_status === 'DONE'
                  ? 'text-green-500 font-bold'
                  : 'text-gray-700'
              }
            >
              {assignment.assignment_status}
            </span>
          </p>

          {tasks.length > 0 && (
            <div>
              <p className="mb-6">
                <strong>Number of Tasks:</strong> {tasks.length}
              </p>
              <ul className="list-disc list-inside space-y-4">
                {tasks.map((task, index) => (
                  <li key={task.id} className="mb-4">
                    <p>
                      <strong>Task {index + 1}:</strong> {task.title}
                    </p>
                    <p>Status: {task.status}</p>
                    <p>Description: {task.description}</p>
                    <p>Priority: {task.priority}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Home Button */}
          <div className="mt-10 flex justify-end w-full">
            <Link
              href="http://localhost:3000"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md text-lg font-bold"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error: unknown) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-md shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-6">Error</h1>
          <p className="text-gray-700">
            Failed to load assignment: {getErrorMessage(error)}
          </p>

          {/* Home Button */}
          <div className="mt-6">
            <Link
              href="http://localhost:3000"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md text-lg font-bold"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
