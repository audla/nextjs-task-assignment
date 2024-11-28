import WorkerComponent from "@/components/WorkerComponent";
import { getAllTasks, getAllWorkers } from "@/lib/airtable";
import React, { Suspense } from "react";

export default async function Home() {



  const tasks = await getAllTasks({  });

  const workers = await getAllWorkers({  });

  // const assignments = await getAllAssignments({});




  return (
    <div className="bg-gray-900  items-start min-h-screen p-8 pb-20 pt-50 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="bg-white min-h-[90vh] max-w-[975px] mx-auto p-4 flex flex-col justify-start items-start rounded-md shadow-xl">
      <main className="flex flex-col gap-8 row-start-2 items-start sm:items-start">
         <h1 className= "text-red-700 font-[family-name:var(--font-geist-sans)] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary justify-items-start">
          AUDLA
         </h1>
           <h2 className= "text-black font-[family-name:var(--font-geist-sans)] font-bold text-2xl">
            Workers
           </h2>
           <Suspense fallback={<div>Loading...</div>}>
              <WorkerComponent workers={workers} />
           </Suspense>         
          
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
      </div>
    </div>
  );
}
