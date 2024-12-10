import type { NextApiRequest, NextApiResponse } from "next";

const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_TABLE_NAME = "Messages"; // Adjust if different
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { content, author } = req.body;

    // Validate payload
    if (!content || !author) {
      return res.status(400).json({ error: "Missing content or author" });
    }

    try {
      // POST request to Airtable API
      const response = await fetch(AIRTABLE_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Content: content, // Ensure these field names match your Airtable schema
            Author: author,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Airtable API error:", errorData);
        return res.status(response.status).json({ error: errorData });
      }

      const data = await response.json();
      res.status(200).json({ message: "Message added successfully", data });
    } catch (error) {
      console.error("Error adding message:", error);
      res.status(500).json({ error: "Failed to add message" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
