import { getAllTasks, getAllWorkers, getAllAssignments } from "@/lib/airtable";
import React from "react";
export default async function Home() {



  const tasks = await getAllTasks({  });

  const workers = await getAllWorkers({  });

  const assignments = await getAllAssignments({});

  console.log(`tasks`, tasks.length);
  console.log(`workers`, workers.length);
  console.log(`assignments`, assignments.length);



  return (
    <div className="bg-gray-900 grid grid-rows-[20px_1fr_20px] items-start min-h-screen p-8 pb-20 pt-50 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="bg-white w-[40%] h-[90vh] mx-auto p-4 flex flex-col justify-start items-start rounded-md shadow-xl">
      <main className="flex flex-col gap-8 row-start-2 items-start sm:items-start">
         <h1 className= "text-red-700 font-[family-name:var(--font-geist-sans)] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary justify-items-start">
          AUDLA
         </h1>
           <h1 className= "text-black font-[family-name:var(--font-geist-sans)] font-bold">
            Workers
           </h1>
            <div className="text-black list-inside text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)] font-bold">
             {workers.map(
              (worker) => {
                
                return (
                <h2 key={worker.id} className="mb-2">
                  - {worker.worker_id} : {worker.hourly_rate} $
                </h2>
              )}
            )}
            </div>
          <h1 className= "text-black font-[family-name:var(--font-geist-sans)] font-bold">
            Assignments
          </h1>
          <ul className="text-black list-inside text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)] font-bold">
            {assignments.map(
              (assignment) => {
                
                return (
                <li key={assignment.id } className="mb-2">
                  - {assignment.assignment_id}. {assignment.Tasks}
                </li>
              )}
            )}
          </ul>
          
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
      </div>
    </div>
  );
}
