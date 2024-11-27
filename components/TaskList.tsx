"use client";

import { useState } from "react";
import InteractiveTask from "@/components/InteractiveTask";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  description: string;
  created_at: string;
}

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const [updatedTasks, setUpdatedTasks] = useState(tasks);

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setUpdatedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    console.log(`Updated task ${taskId} to status: ${newStatus}`);
    // Optionally, call an API to persist the change
    // Example:
    // await updateTaskStatus(taskId, newStatus);
  };

  return (
    <ul>
      {updatedTasks.map((task, index) => (
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
          <p>Created at: {new Date(task.created_at).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  );
}
