'use client';

import {  Worker } from '@/lib/airtable';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import AssignmentsList from './WorkersList';
import { toast } from '@/hooks/use-toast';
import { SessionUser } from '@/auth.config';

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

export default function WorkerComponent({ workers, activeWorker }: { workers: Worker[], activeWorker:Worker|undefined }) {
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
      toast({
        title: "Changes saved successfully!",
        description: "Nous avons enregistré les modifications.",
      });
    },
    onError: (error: Error) => {
      console.error('Error deleting assignment:', error);
      toast({
        title: "Error!",
        description: "Nous avons rencontre une erreur.",
      });
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
          {/* <WorkerSelect workers={workers} setActiveWorker={setActiveWorker}/> */}
          {activeWorker && (
            <div>
              <h2>Worker: {activeWorker.worker_id}</h2>
              <h3>Hourly rate: ${activeWorker.hourly_rate}</h3>
              <h3>Assignments for this worker:</h3>
              {isLoading ? (
                <p>Loading assignments...</p>
              ) : error ? (
                <p>Error fetching assignments: {(error as Error).message}</p>
              ) : 
                  <AssignmentsList assignments={assignmentsData || []} onDelete={handleDelete} />
                  }
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function WorkerSelect({
  workers,
  setActiveWorker,
}: {
  workers: Worker[];
  setActiveWorker: (workers: Worker | null) => void;
}) {
  // When a new value is selected from the dropdown
  const handleWorkerChange = (value: string) => {
    // Find the worker object that matches the selected value (worker_id)
    const selectedWorker = workers.find((worker) => worker.worker_id === value) || null;
    setActiveWorker(selectedWorker); // Set the selected worker in the parent component
  };
  return (
    <Select onValueChange={handleWorkerChange}>
      <SelectTrigger className="w-40">
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
