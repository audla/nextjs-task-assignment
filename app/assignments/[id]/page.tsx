import { getAssignmentById, getTaskById } from "@/lib/airtable";
import { getErrorMessage } from "@/lib/utils";
import TaskList from "@/components/TaskList";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(context: { params: { id?: string } }): Promise<Metadata> {
  const { params } = context;

  try {
    if (!params?.id) {
      throw new Error("Assignment ID is missing.");
    }

    const assignment = await getAssignmentById(params.id);
    return { title: `Assignment: ${assignment.Titre}` };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return { title: "Assignment Not Found" };
  }
}

export default async function AssignmentPage({ params }: { params: { id: string } }) {
  try {
    const assignment = await getAssignmentById(params.id);
    const tasks = assignment.Tasks ? await Promise.all(assignment.Tasks.map(getTaskById)) : [];

    return (
      <div className="bg-gray-900 min-h-screen p-12 pb-24 pt-50 sm:p-24 flex items-start print:bg-white print:p-0">
        <div className="bg-white min-h-[90vh] max-w-[1100px] w-full mx-auto p-6 rounded-md shadow-xl flex flex-col relative print:shadow-none print:min-h-0">
          <h1 className="text-red-500 text-4xl font-bold mb-6 print:text-black">Assignment Details</h1>

          <p className="mb-4">
            <strong>ID:</strong> {assignment.id}
          </p>
          <p className="mb-4">
            <strong>Title:</strong> {assignment.Titre}
          </p>
          <p className="mb-8">
            <strong>Status:</strong>{" "}
            <span
              className={
                assignment.assignment_status === "TODO"
                  ? "text-red-500 font-bold text-2xl print:text-black print:text-base"
                  : assignment.assignment_status === "DONE"
                  ? "text-green-500 font-bold text-2xl print:text-black print:text-base"
                  : "text-gray-700 print:text-black print:text-base"
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
              {/* Client Component */}
              <TaskList tasks={tasks} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute bottom-6 right-6 flex space-x-4">
            <Link
              href="/"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md text-lg font-bold print:hidden"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error: unknown) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 print:bg-white print:p-0">
        <div className="bg-white p-8 rounded-md shadow-md max-w-md w-full text-center relative print:shadow-none">
          <h1 className="text-2xl font-bold text-red-500 mb-6 print:text-black">Error</h1>
          <p className="text-gray-700">Failed to load assignment: {getErrorMessage(error)}</p>

          <div className="absolute bottom-6 right-6 flex space-x-4">
            <Link
              href="/"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md text-lg font-bold print:hidden"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
