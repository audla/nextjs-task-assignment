import { auth } from "@/auth";
import { SessionUser } from "@/auth.config";
import WorkerComponent from "@/components/WorkerComponent";
import {getAllWorkers } from "@/lib/airtable";
import React, { Suspense } from "react";

export default async function Home() {
  const session = await auth() as unknown as {user:SessionUser}

  console.log("ICI AUSSSSSIIII=============",session?.user.workerId)
  const workers = await getAllWorkers({  });
  const activeWorker = workers.find((worker) => worker.id === session?.user.workerId);


  return (
      <div className="">
      <main className="flex flex-col gap-8 row-start-2 items-start sm:items-start">
           <h2 className= "text-black font-[family-name:var(--font-geist-sans)] font-bold text-2xl">
            Workers
           </h2>
           <Suspense fallback={<div>Loading...</div>}>
              <WorkerComponent workers={workers} activeWorker={activeWorker} />
           </Suspense>         
          
      </main>
      </div>
  );
}
