import Airtable from "airtable";

const base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base('appazEhgj3jhg8CxF');

type BaseSelectOption = {
    maxRecords: number,
    view: string,
    filterByFormula?: string
}

type GetAllTasksParams ={
    filterByFormula?: string
}

type Task = {
    id: string;
    status: "Not ready" | "In progress" | "Completed";  // adjust as needed
    priority: "Low" | "Medium" | "High" | "Very important";  // adjust as needed
    created_at: string;
    TaskDescription: string;
    Assignments: string[];
    title: string;
    description: string;
    due_date: string;  
    estimated_hours: number;
};

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



