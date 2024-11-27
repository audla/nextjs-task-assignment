"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUS_COLORS: Record<string, string> = {
  "Not Started": "text-gray-500",
  "Not Ready": "text-pink-500",
  "Ready": "text-green-500",
};

interface InteractiveTaskProps {
  taskId: string;
  currentStatus: string;
  onStatusChange: (taskId: string, newStatus: string) => void;
}

export default function InteractiveTask({ taskId, currentStatus, onStatusChange }: InteractiveTaskProps) {
  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={(newStatus) => onStatusChange(taskId, newStatus)}
    >
      <SelectTrigger>
        <SelectValue placeholder={currentStatus} />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(STATUS_COLORS).map((status) => (
          <SelectItem key={status} value={status}>
            <span className={STATUS_COLORS[status]}>{status}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
