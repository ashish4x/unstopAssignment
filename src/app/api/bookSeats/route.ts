import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";

const COACH_ID = "single_coach";

interface Coach {
  _id: string;
  seats: (number | null)[];
  lastBookingId: number;
}
export async function POST(request: Request) {
  const { seats } = await request.json();

  if (seats < 0 || seats > 7) {
    return NextResponse.json(
      { error: "Invalid number of seats" },
      { status: 400 }
    );
  }

  const { db } = await connectToDatabase();

  let coach = await db.collection<Coach>("coaches").findOne({ _id: COACH_ID });

  if (!coach) {
    coach = {
      _id: COACH_ID,
      seats: Array(80).fill(null),
      lastBookingId: 0,
    } as Coach;
    await db.collection<Coach>("coaches").insertOne(coach);
  }

  const availableSeats = coach.seats.filter((seat) => seat === null).length;

  if (seats === 0) {
    // Just return the current seat status without booking
    return NextResponse.json({ allSeats: coach.seats });
  }

  if (availableSeats === 0) {
    return NextResponse.json(
      { error: "All seats are already reserved", allSeats: coach.seats },
      { status: 400 }
    );
  }

  if (seats > availableSeats) {
    return NextResponse.json(
      {
        error: `Only ${availableSeats} seats available`,
        allSeats: coach.seats,
      },
      { status: 400 }
    );
  }

  coach.lastBookingId += 1;

  const bookedSeats = findAndBookSeats(coach.seats, seats, coach.lastBookingId);

  await db.collection<Coach>("coaches").updateOne(
    { _id: COACH_ID },
    {
      $set: {
        seats: coach.seats,
        lastBookingId: coach.lastBookingId,
      },
    }
  );

  return NextResponse.json({
    bookedSeats,
    allSeats: coach.seats,
  });
}

function findAndBookSeats(
  currentSeats: (number | null)[],
  seatsToBook: number,
  bookingId: number
): number[] {
  const bookedSeats: number[] = [];
  const rows = Math.ceil(currentSeats.length / 7);

  for (let row = 0; row < rows; row++) {
    const startIndex = row * 7;
    const endIndex = row === rows - 1 ? currentSeats.length : (row + 1) * 7;
    const availableSeats = currentSeats
      .slice(startIndex, endIndex)
      .filter((seat) => seat === null).length;

    if (availableSeats >= seatsToBook) {
      for (
        let i = startIndex;
        i < endIndex && bookedSeats.length < seatsToBook;
        i++
      ) {
        if (currentSeats[i] === null) {
          currentSeats[i] = bookingId;
          bookedSeats.push(i + 1);
        }
      }
      break;
    }
  }

  if (bookedSeats.length < seatsToBook) {
    for (
      let i = 0;
      i < currentSeats.length && bookedSeats.length < seatsToBook;
      i++
    ) {
      if (currentSeats[i] === null) {
        currentSeats[i] = bookingId;
        bookedSeats.push(i + 1);
      }
    }
  }

  return bookedSeats;
}
