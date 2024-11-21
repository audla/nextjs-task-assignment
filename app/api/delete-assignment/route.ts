import { NextRequest, NextResponse } from 'next/server'
import Airtable from 'airtable'

export async function DELETE(request: NextRequest) {
  try {
    // Log when the request is received
    console.log('DELETE request received at /api/delete-assignment')

    // Parse the request body using request.json()
    const body = await request.json()
    console.log('Request body:', body)

    const { assignmentId } = body
    console.log('Parsed assignmentId:', assignmentId)

    // Validate the input
    if (!assignmentId) {
      console.log('No assignment ID provided in the request')
      return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 })
    }

    // Initialize Airtable base
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('appazEhgj3jhg8CxF')
    console.log('Airtable base initialized')

    // Perform the deletion
    const deletedRecords = await new Promise((resolve, reject) => {
      base('Assignments').destroy([assignmentId], (err, records) => {
        if (err) {
          console.error('Error deleting record from Airtable:', err)
          reject(err)
        } else {
          console.log('Successfully deleted record:', records)
          resolve(records)
        }
      })
    })

    // Return success response
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    // Log the error for debugging
    console.error('Error in DELETE request:', error)
    return NextResponse.json({ error: 'Failed to delete assignment' }, { status: 500 })
  }
}