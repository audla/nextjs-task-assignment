'use client';

import { Assignment, Worker } from '@/lib/airtable';
import { useState, useEffect } from 'react';
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
            <li>
            <Link href={`/${assignment.id}`} key={assignment.id}>
              {assignment.assignment_id}: {assignment.Titre}: {assignment.assignment_status}
             </Link><br />
            
             <button className={buttonVariants({ variant: 'destructive' })}>
               Delete
             </button>
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