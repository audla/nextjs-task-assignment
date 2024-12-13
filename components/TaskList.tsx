"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Task } from "@/lib/airtable";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const [updatedTasks, setUpdatedTasks] = useState(tasks);
  const [saving, setSaving] = useState(false);

  // Handle slider change
  const handleTimeWorkedChange = (taskId: string, newTimeWorked: number) => {
    setUpdatedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, timeWorked: newTimeWorked } : task
      )
    );
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/save-time-worked", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks: updatedTasks }),
      });

      if (!response.ok) {
        throw new Error("Failed to save tasks to Airtable");
      }
      toast({
        title: "Changes saved successfully!",
        description: "Time worked has been updated.",
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

  if (tasks.length === 0) {
    return <p className="text-gray-600 text-lg">No tasks found.</p>;
  }

  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-6">
      <ul className="space-y-6">
        {updatedTasks.map((task) => (
          <li
            key={task.id}
            className="bg-white rounded-lg shadow p-4 transition-shadow hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {task.title}
            </h3>

            <p className="text-gray-600 mb-2">Priority: {task.priority}</p>

            <div className="mb-2">
              <p className="text-gray-600 mb-1">Time Worked:</p>
              <input
                type="range"
                min={0}
                max={480} // Example max value: 480 minutes (8 hours)
                value={task.ActualWorkTime || 0}
                onChange={(e) =>
                  handleTimeWorkedChange(task.id, parseInt(e.target.value, 10))
                }
                className="w-full"
              />
              <p className="text-gray-600 text-sm mt-1">
                {task.ActualWorkTime || 0} minutes worked
              </p>
            </div>

            <p className="text-gray-600 mb-2">
              <span className="font-medium">Description:</span> {task.description}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-start">
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
      </div>
    </div>
  );
}
