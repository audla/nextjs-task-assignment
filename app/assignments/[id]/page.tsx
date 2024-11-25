import { getAssignmentById } from '@/lib/airtable';
import { getErrorMessage } from '@/lib/utils';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const _params = await params;
  try {
    const assignment = await getAssignmentById(_params.id);
    return { title: `Assignment: ${assignment.Titre}` };
  } catch {
    return { title: 'Assignment Not Found' };
  }
}

export default async function AssignmentPage({ params }: { params: { id: string } }) {

  const _params = await params;
  try {
    const assignment = await getAssignmentById(_params.id);

    return (
      <div>
        <h1>Assignment Details</h1>
        <p>
          <strong>ID:</strong> {assignment.id}
        </p>
        <p>
          <strong>Title:</strong> {assignment.Titre}
        </p>
        <p>
          <strong>Status:</strong> {assignment.assignment_status}
        </p>
        {assignment.Tasks &&(<p>
          <strong>Description:</strong> {assignment.Tasks.length} tasks
        </p>)}
      </div>
    );
  } catch (error: unknown) {
    return (
      <div>
        <h1>Error</h1>
        <p>Failed to load assignment: {getErrorMessage(error)}</p>
      </div>
    );
  }
}