import { NextApiRequest, NextApiResponse } from "next";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { taskId, newStatus } = req.body;

  if (!taskId || !newStatus) {
    return res.status(400).json({ error: "Task ID and new status are required" });
  }

  try {
    // Update the task status in Airtable
    await base("Tasks").update(taskId, {
      status: newStatus,
    });

    return res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({ error: "Failed to update task" });
  }
}
