"use client";

import { useState } from "react";
import InteractiveTask from "@/components/InteractiveTask";
import { Task } from "@/lib/airtable";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface TaskListProps {
  tasks: Task[];
  assignmentId: string;
}

export default function TaskList({ tasks, assignmentId }: TaskListProps) {
  const [updatedTasks, setUpdatedTasks] = useState(tasks);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient(); // Initialize Query Client

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    setUpdatedTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    );
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks: updatedTasks }),
      });

      if (!response.ok) {
        throw new Error("Failed to save tasks to Airtable");
      }
       console.log(queryClient.getQueryData(["assignment", assignmentId]));
       queryClient.invalidateQueries({ queryKey: ["assignment", assignmentId] });
       console.log("Query invalidated:", queryClient.getQueryData(["assignment", assignmentId]));

      toast({
        title: "Changes saved successfully!",
        description: "Nous avons enregistré les modifications.",
      });
    } catch (error) {
      console.error("Error saving tasks:", error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (tasks.length === 0) {
    return <p className="text-gray-600 text-lg">No tasks found.</p>;
  }

  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-6">
      <ul className="space-y-6">
        {tasks.map((task, index) => (
          <li key={task.id} className="bg-white rounded-lg shadow p-4 transition-shadow hover:shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Task {index + 1}: {task.title}
            </h3>
            <p className="text-gray-600 mb-2">
              Priority:{" "}
              <span
                className={`font-medium ${
                  task.priority === "Not that important"
                    ? "text-green-600"
                    : task.priority === "Important"
                    ? "text-orange-600"
                    : task.priority === "Very important"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {task.priority}
              </span>
            </p>
            <div className="mb-2">
              <p className="text-gray-600 mb-1">Status:</p>
              <InteractiveTask
                taskId={task.id}
                currentStatus={task.status}
                onStatusChange={handleStatusChange}
              />
            </div>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Description:</span> {task.description}
            </p>
            <p className="text-gray-500 text-sm">
              <span className="font-medium">Created at:</span> {new Date(task.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-start print:hidden">
        <button
          onClick={saveChanges}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-200 ${
            saving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          }`}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-6 py-3 rounded-lg text-white font-semibold bg-gray-500 hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
        >
          Print
        </button>
      </div>

      <style jsx>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

