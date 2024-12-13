'use client';

import { useState } from 'react';
import { Worker } from "@/lib/airtable"; // Adjust import path
import { WorkerSelect } from "@/components/RolesDashboards";

export default function WorkerSelectionComponent({
  workers,
  onWorkerSelect,
}: {
  workers: Worker[];
  onWorkerSelect: (worker: Worker | null) => void; // Callback to update selected worker
}) {
  const [activeWorker, setActiveWorker] = useState<Worker | null>(workers[0] || "None");
  

  const handleWorkerSelect = (worker: Worker | null) => {
    setActiveWorker(worker);
    onWorkerSelect(worker); // Call the callback to update selected worker in parent component
  };

  return (
    <div className="bg-gray-100 p-2 rounded-md shadow-md">
      <h2 className="font-bold text-lg mb-4">Who&apos;s writing?</h2>
      <WorkerSelect workers={workers} setActiveWorker={handleWorkerSelect} />
      {activeWorker && (
        <div className="mt-4">
          <p>
            <strong>Selected Worker:</strong> {activeWorker.worker_id}
          </p>
        </div>
      )}
    </div>
  );
}
