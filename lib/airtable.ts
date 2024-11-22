import Airtable from "airtable";

export const base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base('appazEhgj3jhg8CxF');

type BaseSelectOption = {
    maxRecords: number,
    view: string,
    filterByFormula?: string
}

type GetAllWorkersParams ={
    filterByFormula?: string
}

export type Worker = {
    worker_id: string;
    id: string;
    first_name: string;  // adjust as needed
    last_name: string;
    email: string;
    phone_number: string;
    hire_date: Date;
    job_title: "Programmer" | "Software Engineer" | "Frontend Developer" | "Backend Developer" | "Full Stack Developer" | "Mobile App Developer" | "DevOps Engineer" | "Cloud Architect" | "Systems Engineer" | "Automation Engineer" | "IT Support Specialist" | "Data Analyst" ;
    department: "Software Development" | "Product Management" | "Data and Analytics" | "Cloud and Infrastructure" | "Cybersecurity" | "Quality Assurance and Testing";  
    hourly_rate: number;
    Assignments: string[];
};

export const getAllWorkers = async ({ filterByFormula = undefined }: GetAllWorkersParams): Promise<Worker[]> => {


    // set a 10second delay to simulate a real-world scenario
    setTimeout(() => {
        console.log(`Workers fetched`);
    }, 10000);

    const baseSelectOptions: BaseSelectOption = {
        maxRecords: 50,
        view: "Grid view",
    };

    if (filterByFormula) {
        baseSelectOptions.filterByFormula = filterByFormula;
    }

    const workers: Worker[] = [];

    return new Promise((resolve, reject) => {
        base('Workers')
            .select(baseSelectOptions)
            .eachPage(
                function page(records, fetchNextPage) {
                    // Process each page of records.
                    records.forEach((record) => {
                        const workerRecord = {
                            id: record.getId(),
                            ...record.fields,
                        };

                        workers.push(workerRecord as Worker);
                    });

                    // Fetch the next page of records.
                    fetchNextPage();
                },
                function done(err) {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        // Resolve the promise with the fully populated array.
                        resolve(workers);
                    }
                }
            );
    });
};

type GetAllTasksParams ={
    filterByFormula?: string
}

export type Task = {
    id: string;
    status: "Not ready" | "In progress" | "Completed";  // adjust as needed
    priority: "Low" | "Medium" | "High" | "Very important";  // adjust as needed
    created_at: string;
    TaskDescription: string;
    AssignmentID: string[];
    title: string;
    description: string;
    due_date: string;  
    estimated_hours: number;
};

// TODO: utiliser ceci pour l'api /api/tasks
export const getAllTasks = async ({ filterByFormula = undefined }: GetAllTasksParams): Promise<Task[]> => {
    const baseSelectOptions: BaseSelectOption = {
        maxRecords: 50,
        view: "Grid view",
    };

    if (filterByFormula) {
        baseSelectOptions.filterByFormula = filterByFormula;
    }

    const tasks: Task[] = [];

    return new Promise((resolve, reject) => {
        base('Tasks')
            .select(baseSelectOptions)
            .eachPage(
                function page(records, fetchNextPage) {
                    // Process each page of records.
                    records.forEach((record) => {
                        const taskRecord = {
                            id: record.getId(),
                            ...record.fields,
                        };

                        tasks.push(taskRecord as Task);
                    });

                    // Fetch the next page of records.
                    fetchNextPage();
                },
                function done(err) {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        // Resolve the promise with the fully populated array.
                        resolve(tasks);
                    }
                }
            );
    });
};


export const deleteTasks = async (taskIds: string[]) => {

    // Delete tasks
    if (taskIds.length > 0) {
        console.log(`Deleting ${taskIds.length} tasks...`);
        return await new Promise<boolean>((resolve, reject) => {
            base('Tasks').destroy(taskIds, (err) => {
                if (err) {
                    console.error('Error deleting tasks:', err);
                    reject(false);
                } else {
                    console.log('Successfully deleted tasks');
                    resolve(true);
                }
            });
        });
    }
    return false;
}

type GetAllAssignmentsParams ={
    filterByFormula?: string
}

export type Assignment = {
    id: string;
    assignment_id: string;
    Titre:string;
    assignment_status: "TODO" | "DONE" ;
    Workers: string[];
    Tasks: string[];
    assigned_at: Date;
    completed_at: Date;
    Notifications: string[];
};

export const getAllAssignments = async ({ filterByFormula = undefined }: GetAllAssignmentsParams): Promise<Assignment[]> => {
    const baseSelectOptions: BaseSelectOption = {
        maxRecords: 50,
        view: "Grid view",
    };

    if (filterByFormula) {
        baseSelectOptions.filterByFormula = filterByFormula;
    }

    const assignments: Assignment[] = [];

    return new Promise((resolve, reject) => {
        base('Assignments')
            .select(baseSelectOptions)
            .eachPage(
                function page(records, fetchNextPage) {
                    // Process each page of records.
                    records.forEach((record) => {
                        const assignmentRecord = {
                            id: record.getId(),
                            ...record.fields,
                        };

                        assignments.push(assignmentRecord as Assignment);
                    });

                    // Fetch the next page of records.
                    fetchNextPage();
                },
                function done(err) {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        // Resolve the promise with the fully populated array.
                        resolve(assignments);
                    }
                }
            );
    });
};


export const getAssignmentById = async (id: string): Promise<Assignment> => {
    return new Promise((res, rej) =>
        base('Assignments').find(id, function(err, record) {
            if (err || !record ) { console.error(err); rej(err); }
            else{
                const assignmentRecordFields= {id:record?.id, ...record.fields} as unknown as Assignment
                res(assignmentRecordFields);
            }
        })
    )
}

export const deleteAssignment = async (id: string): Promise<Assignment | string> => {
    return new Promise((res, rej) =>
        base('Assignments').destroy(id, function(err, deletedRecord) {
            if (err || !deletedRecord) { console.error(err); rej(err.message as string); }
            else{
                res({
                    id: deletedRecord?.id,
                    ...deletedRecord.fields
                } as unknown as Assignment);
            }
        })
    )
}


