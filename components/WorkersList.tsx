import { Assignment } from '@/lib/airtable'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisVerticalIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const statuses = {
  DONE: 'text-green-700 bg-green-50 ring-green-600/20',
  TODO: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Archived: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function AssignmentsList({ assignments, onDelete }: { assignments: Assignment[], onDelete: (id: string) => void }) {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {assignments.map((assignment) => {
        // Check if all tasks are completed
        const allTasksCompleted = assignment.tasks?.every((task) => task.completed_at);

        return (
          <li key={assignment.id} className="flex items-center justify-between gap-x-6 py-5">
            <div className="min-w-0">
              <div className="flex items-start gap-x-3">
                <p className="text-sm/6 font-semibold text-gray-900">{assignment.Titre}</p>
                <p
                  className={classNames(
                    statuses[assignment.assignment_status],
                    'mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset',
                  )}
                >
                  {assignment.assignment_status === 'TODO' ? 'À faire' : 'Complété'}
                </p>
              </div>
              <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
                <p className="whitespace-nowrap">
                  Assigné le: <time dateTime={assignment.assigned_at}>{assignment.assigned_at}</time>
                </p>
                
                {!assignment.completed_at ? (
                  <div>Not done yet</div>
                ) : (
                  <div>Complété le: <time dateTime={assignment.completed_at}> {assignment.completed_at}</time></div>
                )}

                {/* Show "Tout est fait" if all tasks are completed */}
                {allTasksCompleted && (
                  <p className="text-green-700 text-sm font-medium mt-2">Tout est fait</p>
                )}

                <p className="whitespace-nowrap">
                </p>
                <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <p className="truncate">Assigné à {`${assignment.WorkerFirstName} ${assignment.WorkerLastName}`}</p>
              </div>
            </div>
            <div className="flex flex-none items-center gap-x-4 print:hidden">
              <Link
                href={`/assignments/${assignment.id}`}
                className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
              >
                View project<span className="sr-only">, {assignment.Titre}</span>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="hidden sm:flex items-center">
                    <Trash2Icon className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the assignment and its associated tasks.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(assignment.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Menu as="div" className="relative flex-none">
                <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon aria-hidden="true" className="size-5" />
                </MenuButton>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <Link
                      href="#"
                      className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                    >
                      Edit<span className="sr-only">, {assignment.Titre}</span>
                    </Link>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      href="#"
                      className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                    >
                      Move<span className="sr-only">, {assignment.Titre}</span>
                    </Link>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
