'use client';

import { Assignment, Worker } from '@/lib/airtable';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useQuery } from '@tanstack/react-query';
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link';
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

const fetchAssignments = async (assignmentIds: string[]) => {
  try {
    const response = await fetch('/api/assignments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assignmentIds }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assignments');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching assignments:', error);
  }
};

export default function WorkerComponent({ workers }: { workers: Worker[] }) {
  const [activeWorker, setActiveWorker] = useState<Worker | null>(workers[0] || null);

  const { isLoading: assignmentsPending, error: assignmentsError, data: assignmentsData } = useQuery({
    queryKey: ['assignments', activeWorker?.Assignments || []],
    queryFn: () => fetchAssignments(activeWorker?.Assignments || []),
    enabled: !!activeWorker, // Only run the query if a worker is selected
  });

  const handleDelete = (assignmentId: string) => {
    console.log(`Deleting assignment with ID: ${assignmentId}`);
    // Implement your delete logic here
  };

  return !workers.length ? (
    <div>No workers found</div>
  ) : activeWorker ? (
    <div>
      <WorkerSelect workers={workers} setActiveWorker={setActiveWorker} />
      <h2>Worker: {activeWorker.worker_id}</h2>
      <h3>Hourly rate: ${activeWorker.hourly_rate}</h3>
      <h3>Assignments for this worker:</h3>
      {assignmentsPending ? (
        <p>Loading assignments...</p>
      ) : assignmentsError ? (
        <p>Error fetching assignments: {assignmentsError.message}</p>
      ) : (
        <ul>
          {assignmentsData?.map((assignment: Assignment) => (
            <li key={assignment.id}>
              <Link href={`/${assignment.id}`}>
                {assignment.assignment_id}: {assignment.Titre}: {assignment.assignment_status}
              </Link><br />
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                  onClick={() => handleDelete(assignment.id)}
                  className={buttonVariants({ variant: 'destructive' })}>
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the assignment.
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
  ) : (
    <>
      <WorkerSelect workers={workers} setActiveWorker={setActiveWorker} />
      <WorkerListComponent workers={workers} setActiveWorker={setActiveWorker} />
    </>
  );
}

function WorkerSelect({
  workers,
  setActiveWorker,
}: {
  workers: Worker[];
  setActiveWorker: React.Dispatch<React.SetStateAction<Worker | null>>;
}) {
  const handleChange = (value: string) => {
    const selectedWorker = workers.find((worker) => worker.worker_id === value);
    setActiveWorker(selectedWorker || null);
  };

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a worker" />
      </SelectTrigger>
      <SelectContent>
        {workers.map((worker) => (
          <SelectItem value={worker.worker_id} key={worker.id}>
            {worker.worker_id}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function WorkerListComponent({
  workers,
  setActiveWorker,
}: {
  workers: Worker[];
  setActiveWorker: React.Dispatch<React.SetStateAction<Worker | null>>;
}) {
  return (
    <ul className="text-black list-inside text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)] font-bold">
      {workers.map((worker) => {
        return (
          <button
            key={worker.id}
            className="mb-2 hover:bg-black hover:text-white"
            onClick={() => setActiveWorker(worker)}
          >
            <li>
              - {worker.worker_id} : {worker.hourly_rate} $
            </li>
          </button>
        );
      })}
    </ul>
  );
}