import Airtable from "airtable";
import { getErrorMessage } from "./utils";

export const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base('appazEhgj3jhg8CxF');

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
    priority: "Not that important" | "Important" | "Very important";  // adjust as needed
    created_at: string;
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
export const getTaskById = async (id: string): Promise<Task> => {
    return new Promise((res, rej) =>
        base('Tasks').find(id, function(err, record) {
            if (err || !record ) { console.error(err); rej(err); }
            else{
                const taskRecordFields= {id:record?.id, ...record.fields} as unknown as Task
                res(taskRecordFields);
            }
        })
    )
}

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
    assigned_at: string;
    completed_at: string;
    Messages: string[];
    WorkerFirstName: string;
    WorkerLastName: string;
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
            // if (err || !record ) { console.error(err); rej(err); }
            if(err){
                return rej(err);
            }
            else if(!record){
                return rej("No record found");
            }
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



type GetAllMessagesParams ={
    filterByFormula?: string
}

export type Message = {
    id: string;
    message: string;
    Assignment: string;
    Workers: string[];
    MessageFrom: string;
    Readby: string;
    sent_at: string;
};

export const getAllMessages = async ({ filterByFormula = undefined }: GetAllMessagesParams): Promise<Message[]> => {
    const baseSelectOptions: BaseSelectOption = {
        maxRecords: 50,
        view: "Grid view",
    };

    if (filterByFormula) {
        baseSelectOptions.filterByFormula = filterByFormula;
    }

    const messages: Message[] = [];

    return new Promise((resolve, reject) => {
        base('Messages')
            .select(baseSelectOptions)
            .eachPage(
                function page(records, fetchNextPage) {
                    // Process each page of records.
                    records.forEach((record) => {
                        const messageRecord = {
                            id: record.getId(),
                            MessageFrom: record.fields.worker_id,
                            ...record.fields,
                        };

                        // Ensure that MessageFrom contains a single worker_id
                        if (record.fields.MessageFrom) {
                            messageRecord.MessageFrom = record.fields.MessageFrom; // Directly assign the single worker_id
                        }

                        messages.push(messageRecord as Message);
                    });

                    // Fetch the next page of records.
                    fetchNextPage();
                },
                function done(err) {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        // Resolve the promise with the fully populated messages array
                        resolve(messages);
                    }
                }
            );
    });
};



export const getMessageById = async (id: string): Promise<Message> => {
    return new Promise((res, rej) =>
        base('Messages').find(id, function(err, record) {
            if (err || !record ) { console.error(err); rej(err); }
            else{
                const messageRecordFields= {id:record?.id, ...record.fields} as unknown as Message
                res(messageRecordFields);
            }
        })
    )
}

export const deleteMessage = async (id: string): Promise<Message | string> => {
    return new Promise((res, rej) =>
        base('Messages').destroy(id, function(err, deletedRecord) {
            if (err || !deletedRecord) { console.error(err); rej(err.message as string); }
            else{
                res({
                    id: deletedRecord?.id,
                    ...deletedRecord.fields
                } as unknown as Message);
            }
        })
    )
}

export async function getMessages(messageIds: string[]) {
    const table = base('Messages');
    // console.log(`Fetching ${messageIds.length} message ids`);
    
  
    try {
      const records = await table.select({
        sort: [{ field: 'sent_at', direction: 'asc' }],
        filterByFormula: `OR(${messageIds.map(id => `RECORD_ID()='${id}'`).join(',')})`
      }).all();

        // console.log(`Successfully fetched ${records.length} messages:`);
  
      return records.map(record => ({
        id: record.id,
        ...record.fields,
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

type NewMessage = {
    content: string;
    workerId: string;
    timestamp?: string;
    assignmentId: string;
  };
  
  export async function createMessage({ content, workerId, timestamp, assignmentId }: NewMessage) {
    try {
        console.log("Creating message:", { content, workerId, timestamp, assignmentId });

        const createdRecord = await base('Messages').create({
            message: content,
            MessageFrom: [workerId],
            Assignment: [assignmentId],
        });

        console.log("Created message:", createdRecord);

        return {
            id: createdRecord.id,
            fields: createdRecord.fields,
        };
    } catch (error:unknown) {
        console.error('Error creating message:', error);
        throw new Error(getErrorMessage(error));
    }
}