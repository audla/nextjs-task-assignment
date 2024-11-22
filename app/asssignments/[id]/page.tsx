import { getErrorMessage } from '@/lib/utils';
import { Metadata } from 'next';

async function fetchAssignment(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/assignment/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch assignment: ${await res.text()}`);
  }

  return res.json();
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const _params = await params;
  try {
    const assignment = await fetchAssignment(_params.id);
    return { title: `Assignment: ${assignment.Titre}` };
  } catch {
    return { title: 'Assignment Not Found' };
  }
}

export default async function AssignmentPage({ params }: { params: { id: string } }) {

  const _params = await params;
  try {
    const assignment = await fetchAssignment(_params.id);

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
        <p>
          <strong>Description:</strong> {assignment.description}
        </p>
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