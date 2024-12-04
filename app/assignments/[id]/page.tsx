import { getAssignmentById, getTaskById, getAllWorkers } from "@/lib/airtable";
import { getErrorMessage } from "@/lib/utils";
import TaskList from "@/components/TaskList";
import { Metadata } from "next";
import Link from "next/link";
import{ WorkerSelect } from "@/components/WorkerComponent";
import WorkerSelectionComponent from "@/components/WorkerComponentSelection";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
    const workers = await getAllWorkers({  });

    return (
      <div className="bg-gray-900 min-h-screen p-12 pb-24 pt-50 sm:p-24 flex items-start print:bg-white print:p-0">\

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
          <div className="absolute top-4 right-4 flex space-x-4">
            <Link
              href="/"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-md text-2xl font-bold print:hidden"
            >
              Home
            </Link>
          </div>
        </div>
        <div className="bg-gray-300 w-[300px] p-4 rounded-md shadow-lg flex flex-col print-hidden">
        <WorkerSelectionComponent workers={workers} />
        <div className="relative py-2">
        <Textarea className="bg-gray-100 w-full pr-5 py-2 resize-none " 
        placeholder="Type your message here." 
        rows={3}/>
        <Button variant="default"
        className="absolute bottom-2 right-2">Send</Button>
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

          <div className="absolute top-4 right-4 flex space-x-4">
            <Link
              href="/"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-md text-2xl font-bold print:hidden"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
