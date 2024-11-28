"use client";

import { useState } from "react";
import InteractiveTask from "@/components/InteractiveTask";
import { Task } from "@/lib/airtable";
import { toast } from "@/hooks/use-toast";

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const [updatedTasks, setUpdatedTasks] = useState(tasks);

  const [saving, setSaving] = useState(false);

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    for(let i = 0; i < updatedTasks.length; i++) {
      if(updatedTasks[i].id === taskId) {
        updatedTasks[i].status = newStatus;
        break;
      }
    }
    setUpdatedTasks([...updatedTasks]);
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      // Send updated tasks to the API
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
      toast({
        title: "Changes saved successfully!",
        description: "Nous avons enregistré les modifications.",
      })
    } catch (error) {
      console.error("Error saving tasks:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <ul>
        {tasks.map((task, index) => (
          <li key={task.id} className="mb-4">
            <p>
              <strong>Task {index + 1}:</strong> {task.title}
            </p>
            <p>
              Priority:{' '}
              <strong>
                <span
                  className={
                    task.priority === "Not that important"
                      ? "text-green-500"
                      : task.priority === "Important"
                      ? "text-orange-500"
                      : task.priority === "Very important"
                      ? "text-red-600"
                      : ""
                  }
                >
                  {task.priority}
                </span>
              </strong>
            </p>
            <p>Status:</p>
            <InteractiveTask
              taskId={task.id}
              currentStatus={task.status}
              onStatusChange={handleStatusChange}
            />
            <p>Description: {task.description}</p>
            <p>Created at: {task.created_at}</p>
          </li>
        ))}
      </ul>

      <button
        onClick={saveChanges}
        className={`mt-6 px-4 py-2 rounded-lg text-white font-bold ${
          saving ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
