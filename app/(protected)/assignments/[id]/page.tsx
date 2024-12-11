import AssignmentComponent from "@/components/AssignmentComponent";
import { getAllWorkers, getAssignmentById, getTaskById } from "@/lib/airtable";


export default async function AssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const assignment = await getAssignmentById(id);
  const tasks = assignment.Tasks ? await Promise.all(assignment.Tasks.map(getTaskById)) : [];
  const workers = await getAllWorkers({  });
  return <AssignmentComponent id={id} tasks={tasks} workers={workers} />;
}