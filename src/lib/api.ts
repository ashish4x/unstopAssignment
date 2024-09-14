const BOOK_SEATS_URL = "/api/bookSeats";
const RESET_COACH_URL = "/api/resetCoach";

export const bookSeats = async (
  seats: number
): Promise<{ bookedSeats: number[]; allSeats: (number | null)[] }> => {
  const response = await fetch(BOOK_SEATS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ seats }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to book seats");
  }

  return data;
};

export const getAllSeats = async (): Promise<(number | null)[]> => {
  const response = await fetch(BOOK_SEATS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ seats: 0 }), // Request 0 seats to just get the current state
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch seat information");
  }

  return data.allSeats;
};

export const resetCoach = async (): Promise<void> => {
  const response = await fetch(RESET_COACH_URL, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to reset coach");
  }
};
