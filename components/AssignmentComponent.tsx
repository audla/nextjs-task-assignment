"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import TaskList from "@/components/TaskList";
import SendMessageForm from "@/components/SendMessageForm";
import { Task, Worker } from "@/lib/airtable";
import PercentDonutChart from "./ProgressDonut";

const fetchAssignment = async (id: string) => {
  const response = await fetch(`/api/assignments/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch assignment with id ${id}`);
  }
  const assignment = await response.json();
  return assignment;
};

export default function AssignmentComponent({
  id,
  tasks,
  workers,
  activeWorker,
}: {
  id: string;
  tasks: Task[];
  workers: Worker[];
  activeWorker: Worker | undefined;
}) {
  const queryClient = useQueryClient();

  const { data: assignment, isPending, isError } = useQuery({
    queryKey: ["assignment", id],
    queryFn: () => fetchAssignment(id),
    enabled: !!id,
  });

  const handleTimeUpdate = async (ActualWorkTime: number) => {
    try {
      const response = await fetch("/api/update-time", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignmentId: id,
          ActualWorkTime,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Time worked updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["assignment", id] });
      } else {
        alert("Failed to update time worked.");
      }
    } catch (error) {
      console.error("Error updating time worked:", error);
      alert("An error occurred while updating time worked.");
    }
  };

  // Updated logic to consider "Ready" or "Completed" as complete tasks
  const allTasksComplete = tasks.every(
    (task) => task.status === "Ready" || task.status === "Completed"
  );

  // Dynamically set the assignment status
  const assignmentStatus = allTasksComplete ? "DONE" : "TODO";

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700 text-xl">Loading assignment...</p>
      </div>
    );
  }

  if (isError || !assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 print:bg-white print:p-0">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center relative print:shadow-none">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 print:text-black">Error</h1>
          <p className="text-gray-700 mb-6">Failed to load assignment.</p>
          <Link
            href="/"
            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-full shadow-md text-lg font-medium transition-colors duration-200 ease-in-out print:hidden"
          >
            Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10 grid gap-8 md:grid-cols-2">
            <div>
              <h1 className="text-gray-800 text-3xl sm:text-4xl font-bold mb-6 print:text-black">
                Assignment Details
              </h1>

              <div className="space-y-4">
                <div className="mb-6 flex justify-center">
                  <PercentDonutChart percent={assignment.CompletedPercent} />
                </div>
                <p className="text-gray-700">
                  <span className="font-semibold">ID:</span> {assignment.id}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Number:</span> {assignment.assignment_id}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Title:</span> {assignment.Titre}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`font-semibold ${
                      assignmentStatus === "TODO"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {assignmentStatus}
                  </span>
                </p>
              </div>

              {assignment.Tasks.length > 0 && (
                <div className="mt-8">
                  <p className="text-gray-700 mb-4">
                    <span className="font-semibold">Number of Tasks:</span> {tasks?.length}
                  </p>
                  <TaskList tasks={tasks} assignmentId={id} />
                </div>
              )}
            </div>
            <div>
              <SendMessageForm
                assignmentId={assignment.id}
                workers={workers}
                selectedWorker={activeWorker}
                messagesIds={assignment.Messages}
                onInvalidate={() =>
                  queryClient.invalidateQueries({ queryKey: ["assignment", id] })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
