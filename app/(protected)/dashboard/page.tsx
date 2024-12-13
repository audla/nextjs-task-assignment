import { auth } from "@/auth";
import { SessionUser } from "@/auth.config";
import {ManagerComponent, WorkerComponent} from "@/components/RolesDashboards";
import {getAllWorkers } from "@/lib/airtable";
import React, { Suspense } from "react";

const ROLES ={
  WORKER: "Worker",
  MANAGER: "Manager",
}

export default async function Home() {
  const session = await auth() as unknown as {user:SessionUser}
  const workers = await getAllWorkers({  });
  const activeWorker = workers.find((worker) => worker.id === session?.user.workerId);


  return (
      <div className="">
      <main className="flex flex-col gap-8 row-start-2 items-start sm:items-start">
       
           <Suspense fallback={<div>Loading...</div>}>
           {session.user.role === ROLES.WORKER && <WorkerComponent workers={workers} activeWorker={activeWorker} />}
           {session.user.role === ROLES.MANAGER && <ManagerComponent workers={workers} activeWorker={activeWorker} />}
           </Suspense>         
          
      </main>
      </div>
  );
}
