"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import TaskList from "@/components/TaskList";
import SendMessageForm from "@/components/SendMessageForm";
import { Task, Worker } from "@/lib/airtable";

const fetchAssignment = async (id: string) => {
  const response = await fetch(`/api/assignments/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch assignment with id ${id}`);
  }
  const assignment = await response.json();

  // Assuming the API already includes tasks and workers or handles it server-side
  return assignment;
};

export default function AssignmentComponent({ id, tasks, workers }:{id:string, tasks: Task[], workers: Worker[]}) {
  const queryClient = useQueryClient();

  const { data: assignment, isPending, isError } = useQuery(
    {
      queryKey: ["assignment", id],
      queryFn: () => fetchAssignment(id),
      enabled: !!id,
    }
  );

  

  if (isPending) {
    return <p>Loading assignment...</p>;
  }

  if (isError || !assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 print:bg-white print:p-0">
        <div className="bg-white p-8 rounded-md shadow-md max-w-md w-full text-center relative print:shadow-none">
          <h1 className="text-2xl font-bold text-red-500 mb-6 print:text-black">Error</h1>
          <p className="text-gray-700">Failed to load assignment.</p>
          <Link
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-md text-2xl font-bold print:hidden"
          >
            Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-12 pb-24 pt-50 sm:p-24 flex items-start print:bg-white print:p-0">
      <div className="bg-white min-h-[90vh] max-w-[1100px] w-full mx-auto p-6 rounded-md shadow-xl flex flex-col relative print:shadow-none print:min-h-0">
        <h1 className="text-red-500 text-4xl font-bold mb-6 print:text-black">Assignment Details</h1>

        <p className="mb-4">
          <strong>ID:</strong> {assignment.id}
        </p>
        <p className="mb-4">
          <strong>Number:</strong> {assignment.assignment_id}
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

        {assignment.Tasks.length > 0 && (
          <div>
            <p className="mb-6">
              <strong>Number of Tasks:</strong> {tasks?.length}
            </p>
            <TaskList tasks={tasks} />
          </div>
        )}

        <div className="absolute top-4 right-4 flex space-x-4">
          <Link
            href="/"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-md text-2xl font-bold print:hidden"
          >
            Home
          </Link>
        </div>
      </div>
      <div>
        <SendMessageForm
          assignmentId={assignment.id}
          workers={workers}
          messagesIds={assignment.Messages}
          onInvalidate={() => queryClient.invalidateQueries({queryKey:["assignment", id]})}
        />
      </div>
    </div>
  );
}