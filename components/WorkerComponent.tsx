'use client'

import { Worker } from "@/lib/airtable"
import { useState} from "react";



const WorkerListComponent = ({ workers, setActiveWorker }: { workers: Worker[], setActiveWorker: React.Dispatch<React.SetStateAction<Worker | null>> }) => {
  return (
    <ul className="text-black list-inside text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)] font-bold">
        {workers.map(
         (worker) => {
           return (
            <button key={worker.id} className="mb-2 hover:bg-black hover:text-white" onClick={() => setActiveWorker(worker)}>
            <li>
              - {worker.worker_id} : {worker.hourly_rate} $
            </li>
            </button>
         )}
       )}
       </ul>
  )
}



export default function WorkerComponent({ workers }: { workers: Worker[] }) {

    const [activeWorker, setActiveWorker] = useState<Worker | null>(workers[0] || null);

 
    return (
      !workers.length ? <div>No workers found</div> :
      ( activeWorker ? <div>
        <h2>Worker: {activeWorker.worker_id}</h2>
        <h3>Hourly rate: ${activeWorker.hourly_rate}</h3>
        <h3>Tasks assigned to this worker:</h3>
        <ul>
          {activeWorker.Assignments.map((assignment) => <li key={assignment}>{assignment}</li>)}
        </ul>
      </div>:(
        <WorkerListComponent workers={workers} setActiveWorker={setActiveWorker} />
      ))
    )
  }