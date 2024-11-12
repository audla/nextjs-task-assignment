import Airtable from "airtable";

const base = new Airtable({apiKey: process.env.AIRTABLE_KEY}).base('appazEhgj3jhg8CxF');


export const getAllTasks = async () => {
  const tasks = await base('Tasks').select({
    view: "Grid view",
    filterByFormula: `{Status} = "Not Started"`,
  }).all();

  return tasks.map(task => {
    return {
      id: task.getId(),
      title: task.get('Title'),
      status: task.get('Status'),
      dueDate: task.get('Due Date'),
      priority: task.get('Priority'),
      description: task.get('Description'),
    }
  })
}
