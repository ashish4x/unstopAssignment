"use client";

import { useState, useEffect } from "react";
import { bookSeats, getAllSeats, resetCoach } from "@/lib/api";

const SeatReservation = () => {
  const [seats, setSeats] = useState<number>(0);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [allSeats, setAllSeats] = useState<(number | null)[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchAllSeats();
  }, []);

  const fetchAllSeats = async () => {
    try {
      const seats = await getAllSeats();
      setAllSeats(seats);
    } catch (error) {
      setError("Failed to fetch seat information. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (seats < 1 || seats > 7) {
      setError("Please enter a number between 1 and 7");
      return;
    }
    try {
      const result = await bookSeats(seats);
      setBookedSeats(result.bookedSeats);
      setAllSeats(result.allSeats);
    } catch (error: any) {
      setError(error.message || "Failed to book seats. Please try again.");
      fetchAllSeats(); // Refresh seat information even if booking fails
    }
  };

  const handleReset = async () => {
    try {
      await resetCoach();
      setBookedSeats([]);
      fetchAllSeats();
      setError("");
    } catch (error) {
      setError("Failed to reset coach. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <form onSubmit={handleSubmit} className="mb-4">
        <label htmlFor="seats" className="block mb-2">
          Number of seats (1-7):
        </label>
        <input
          type="number"
          id="seats"
          value={seats}
          onChange={(e) => setSeats(parseInt(e.target.value))}
          min="1"
          max="7"
          required
          className="w-full p-2 border rounded text-black"
        />
        <div className="mt-4 flex space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Book Seats
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Reset Coach
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {bookedSeats.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Booked Seats:</h2>
          <p>{bookedSeats.join(", ")}</p>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">All Seats:</h2>
        <div className="grid grid-cols-7 gap-2">
          {allSeats.map((seat, index) => (
            <div
              key={index}
              className={`p-2 text-center border text-purple-900 ${
                seat === null
                  ? "bg-green-200"
                  : bookedSeats.includes(index + 1)
                  ? "bg-blue-200"
                  : "bg-red-200"
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className="mt-4 flex space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-200 mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-200 mr-2"></div>
            <span>Just Booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-200 mr-2"></div>
            <span>Already Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatReservation;
