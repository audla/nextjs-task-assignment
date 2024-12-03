'use client';

import { useState } from 'react';
import { Worker } from "@/lib/airtable"; // Adjust import path
import { WorkerSelect } from "@/components/WorkerComponent";

export default function WorkerSelectionComponent({ workers }: { workers: Worker[] }) {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [activeWorker, setActiveWorker] = useState<Worker | null>(workers[0] || null);

  return (
    <div className="bg-gray-100 p-2 rounded-md shadow-md">
      <h2 className="font-bold text-lg mb-4">Who's writing?</h2>
      <WorkerSelect workers={workers} setActiveWorker={setActiveWorker}/>
      {selectedWorker && (
        <div className="mt-4">
          <p>
            <strong>Selected Worker:</strong> {selectedWorker.worker_id}
          </p>
        </div>
      )}
    </div>
  );
}
