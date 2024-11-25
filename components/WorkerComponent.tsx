'use client';

import { Assignment, Worker } from '@/lib/airtable';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import AssignmentsList from './WorkersList';

const fetchAssignments = async (assignmentIds: string[]) => {
  const response = await fetch('/api/assignments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assignmentIds }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch assignments');
  }

  return await response.json();
};

const deleteAssignmentAndTasks = async (assignmentId: string) => {
  // Assuming that there's a method to delete tasks by assignmentId
  const response = await fetch(`/api/assignments/${assignmentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete assignment and tasks');
  }

  return await response.json();
};

export default function WorkerComponent({ workers }: { workers: Worker[] }) {
  const [activeWorker, setActiveWorker] = useState<Worker | null>(workers[0] || null);
  const queryClient = useQueryClient();

  const { isLoading, error, data: assignmentsData } = useQuery({
    queryKey: ['assignments', activeWorker?.Assignments || []],
    queryFn: () => fetchAssignments(activeWorker?.Assignments || []),
    enabled: !!activeWorker,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAssignmentAndTasks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', activeWorker?.Assignments || []] });
      alert('Assignment and tasks deleted successfully');
    },
    onError: (error: Error) => {
      console.error('Error deleting assignment:', error);
      alert(`Failed to delete assignment: ${error.message}`);
    },
  });

  const handleDelete = (assignmentId: string) => {
    deleteMutation.mutate(assignmentId);
  };

  return (
    <div>
      {!workers.length ? (
        <div>No workers found</div>
      ) : (
        <>
          <WorkerSelect workers={workers} setActiveWorker={setActiveWorker} />
          {activeWorker && (
            <div>
              <h2>Worker: {activeWorker.worker_id}</h2>
              <h3>Hourly rate: ${activeWorker.hourly_rate}</h3>
              <h3>Assignments for this worker:</h3>
              {isLoading ? (
                <p>Loading assignments...</p>
              ) : error ? (
                <p>Error fetching assignments: {(error as Error).message}</p>
              ) : (
                <ul>
                  <AssignmentsList assignments={assignmentsData || []} onDelete={handleDelete} />
                  {assignmentsData?.map((assignment: Assignment) => (
                    <li key={assignment.id}>
                      {assignment.assignment_id}: {assignment.Titre}: {assignment.assignment_status}
                      <br />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. It will permanently delete the assignment and its tasks.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(assignment.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function WorkerSelect({
  workers,
  setActiveWorker,
}: {
  workers: Worker[];
  setActiveWorker: React.Dispatch<React.SetStateAction<Worker | null>>;
}) {
  return (
    <Select onValueChange={(value) => setActiveWorker(workers.find((worker) => worker.worker_id === value) || null)}>
      <SelectTrigger>
        <SelectValue placeholder="Select a worker" />
      </SelectTrigger>
      <SelectContent>
        {workers.map((worker) => (
          <SelectItem key={worker.id} value={worker.worker_id}>
            {worker.worker_id}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
