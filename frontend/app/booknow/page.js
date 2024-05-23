"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MainNavigator from "@/components/main-navbar";
import { Main } from "next/document";

export default function BookingPage() {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [availability, setAvailability] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  function handleSubmit(event) {
    event.preventDefault();

    const bookingData = {
      checkInDate,
      checkOutDate,
      numAdults,
      numChildren,
    };

    fetch("http://localhost:5001/check-availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    })
      .then((response) => response.json())
      .then((data) => {
        setAvailability(data);
        if (data.available) {
          // Save the available rooms to local storage or state management
          localStorage.setItem("availableRooms", JSON.stringify(data.rooms));
          // Redirect to the /available page
          router.push("/available");
        } else {
          alert("No rooms available for the selected dates.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <>
      <MainNavigator />
      <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-semibold mb-8">Book Your Stay</h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-md w-full bg-white shadow-md rounded-lg p-8"
        >
          <div className="mb-4">
            <label
              htmlFor="checkInDate"
              className="block text-sm font-medium text-gray-700"
            >
              Check-in Date:
            </label>
            <input
              type="date"
              id="checkInDate"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="checkOutDate"
              className="block text-sm font-medium text-gray-700"
            >
              Check-out Date:
            </label>
            <input
              type="date"
              id="checkOutDate"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="numAdults"
              className="block text-sm font-medium text-gray-700"
            >
              Number of Adults:
            </label>
            <input
              type="number"
              id="numAdults"
              value={numAdults}
              onChange={(e) => setNumAdults(e.target.value)}
              min={1}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="numChildren"
              className="block text-sm font-medium text-gray-700"
            >
              Number of Children:
            </label>
            <input
              type="number"
              id="numChildren"
              value={numChildren}
              onChange={(e) => setNumChildren(e.target.value)}
              min={0}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 w-full text-center block"
          >
            Check Availability
          </button>
        </form>
      </section>
    </>
  );
}
