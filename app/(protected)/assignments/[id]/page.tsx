import { auth } from "@/auth";
import { SessionUser } from "@/auth.config";
import AssignmentComponent from "@/components/AssignmentComponent";
import { getAllWorkers, getAssignmentById, getTaskById } from "@/lib/airtable";


export default async function AssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const assignment = await getAssignmentById(id);
  const tasks = assignment.Tasks ? await Promise.all(assignment.Tasks.map(getTaskById)) : [];
  const workers = await getAllWorkers({  });
  const session = await auth() as unknown as {user:SessionUser}
  const activeWorker = workers.find((worker) => worker.id === session?.user.workerId);
  return <AssignmentComponent id={id} tasks={tasks} workers={workers} activeWorker={activeWorker}/>;
}