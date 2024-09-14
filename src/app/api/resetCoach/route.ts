
import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'

const COACH_ID = 'single_coach'

export async function POST() {
  const { db } = await connectToDatabase()

  await db.collection('coaches').updateOne(
    { _id: COACH_ID },
    { 
      $set: { 
        seats: Array(80).fill(null),
        lastBookingId: 0
      } 
    },
    { upsert: true }
  )

  return NextResponse.json({ message: 'Coach reset successfully' })}