import { getAssignmentById, getTaskById } from '@/lib/airtable';
import { getErrorMessage } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';

// Helper function to format date and time
const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

export async function generateMetadata(context: { params: { id?: string } }): Promise<Metadata> {
  const { params } = context;

  try {
    if (!params?.id) {
      throw new Error("Assignment ID is missing.");
    }

    // Safely fetch assignment metadata
    const assignment = await getAssignmentById(params.id);
    return { title: `Assignment: ${assignment.Titre}` };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return { title: "Assignment Not Found" };
  }
}


export default async function AssignmentPage({ params }: { params: { id: string } }) {
  
  const handleSave = (taskId: string, value: string) => {
    // Call API or perform any action to save the `completed_at` value
    console.log(`Save completed_at for task ${taskId}: ${value}`);
  };

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
                  ? 'text-red-500 font-bold text-2xl'
                  : assignment.assignment_status === 'DONE'
                  ? 'text-green-500 font-bold text-2xl'
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
              <ul>
                {tasks.map((task, index) => (
                  <li key={task.id} className="mb-4">
                    <p>
                      <strong>Task {index + 1}:</strong> {task.title}
                    </p> 
                    <p>
                      Priority:{' '}
                      <strong><span
                        className={
                          task.priority === 'Not that important'
                            ? 'text-green-500'
                            : task.priority === 'Important'
                            ? 'text-orange-500'
                            : task.priority === 'Very important'
                            ? 'text-red-600'
                            : ''
                        }
                      >
                        {task.priority}
                      </span></strong>
                    </p>
                    <p>
                      Status:{' '}
                      <strong>
                        <span
                        className={
                          task.status === 'Not Started'
                            ? 'text-slate-700 !important'
                            : task.status === 'Not Ready'
                            ? 'text-pink-500 !important'
                            : task.status === 'Ready'
                            ? 'text-green-500 !important'
                            : ''
                        }
                      >
                        {task.status}
                      </span>
                      </strong>
                    </p>
                    <p>Description: {task.description}</p>
                    <p>Created at: {formatDateTime(task.created_at)}</p>

                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Home Button */}
          <Link
            href="http://localhost:3000"
            className="absolute bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md text-lg font-bold"
          >
            Home
          </Link>
        </div>
      </div>
    );
  } catch (error: unknown) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-md shadow-md max-w-md w-full text-center relative">
          <h1 className="text-2xl font-bold text-red-500 mb-6">Error</h1>
          <p className="text-gray-700">
            Failed to load assignment: {getErrorMessage(error)}
          </p>

          {/* Home Button */}
          <Link
            href="http://localhost:3000"
            className="absolute bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md text-lg font-bold"
          >
            Home
          </Link>
        </div>
      </div>
    );
  }
}