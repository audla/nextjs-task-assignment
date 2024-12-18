"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Task } from "@/lib/airtable";
import InteractiveTask from "@/components/InteractiveTask";
import { Slider } from "@/components/ui/slider";
import { useQueryClient } from "@tanstack/react-query";


interface TaskListProps {
  tasks: Task[];
  assignmentId: string;
}

export default function TaskList({ tasks, assignmentId }: TaskListProps) {
  const [updatedTasks, setUpdatedTasks] = useState(tasks);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient(); // Initialize Query Client

  const handleTimeWorkedChange = (taskId: string, newTimeWorked: number) => {
    setUpdatedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ActualWorkTime: newTimeWorked } : task
      )
    );
  };

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    setUpdatedTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const saveChanges = async () => {
    const tasksWithZeroTime = updatedTasks.filter((task) => task.ActualWorkTime === 0);

    if (tasksWithZeroTime.length > 0) {
      toast({
        title: "Time Worked Missing",
        description: "Please enter the amount of time worked on all tasks before saving.",
        variant: "destructive",
      });
      return;
    }

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
       queryClient.invalidateQueries({ queryKey: ["assignment", assignmentId] });
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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getMaxSliderValue = (currentValue: number) => {
    const baseMax = 8 * 3600; // 8 hours in seconds
    const dynamicMax = Math.max(baseMax, currentValue * 2);
    return Math.min(dynamicMax, 24 * 3600); // Cap at 24 hours
  };

  if (tasks.length === 0) {
    return <p className="text-gray-600 text-lg">No tasks found.</p>;
  }

  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-6">
      <ul className="space-y-6">
        {updatedTasks.map((task) => {
          const maxSliderValue = getMaxSliderValue(task.ActualWorkTime || 0);
          return (
            <li
              key={task.id}
              className="bg-white rounded-lg shadow p-4 transition-shadow hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {task.title}
              </h3>

              <p className="text-gray-600 mb-2">Priority: {task.priority}</p>

              <div className="mb-2">
                <p className="text-gray-600 mb-1">Status:</p>
                <InteractiveTask
                  taskId={task.id}
                  currentStatus={task.status}
                  onStatusChange={handleStatusChange}
                />
              </div>

              <div className="mb-2">
                <p className="text-gray-600 mb-1">Time Worked:</p>
                <Slider
                  defaultValue={[task.ActualWorkTime || 0]}
                  max={maxSliderValue}
                  onValueChange={(value) => handleTimeWorkedChange(task.id, value[0])}
                  ariaLabelThumb="Time Worked Slider"
                />
                <p className="text-gray-600 text-sm mt-1">
                  {formatTime(task.ActualWorkTime || 0)} worked
                </p>
              </div>

              <p className="text-gray-600 mb-2">
                <span className="font-medium">Description:</span> {task.description}
              </p>
            </li>
          );
        })}
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
