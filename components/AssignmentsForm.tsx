import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import { Assignment, Worker } from "@/lib/airtable";
import { useQuery } from "@tanstack/react-query";

const fetchAssignments = async (assignmentIds: string[]) => {
  const response = await fetch('/api/assignments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assignmentIds }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch assignments');
  }

  return await response.json();
};

export function ProfileForm({ workers, activeWorker }: { workers: Worker[], activeWorker:Worker|undefined }) { 
  const { isLoading, error, data: assignmentsData } = useQuery({
    queryKey: ['assignments', activeWorker?.Assignments || []],
    queryFn: () => fetchAssignments(activeWorker?.Assignments || []),
    enabled: !!activeWorker,
  });

  return (
    <div className=" text-left px-10 py-50">
      <p>
        Assignment Editor
      </p>
    <div>
      <p className=" text-2xl">
        Edit your assignment's name
      </p>
    <Textarea
    className="w-full pr-24 py-3 px-4 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring focus:ring-gray-200 focus:ring-opacity-50 resize-none transition duration-200 ease-in-out"
     placeholder="Change the name"
     />
     </div>
     <div>
      <p>
        Who's working on this?
      </p>
      <p>{activeWorker?.first_name}</p>
      <p>
        Change who's in your assignment
      </p>
     
     </div>
     </div>
  )
}