"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import MainNavigator from "@/components/main-navbar";

export default function AvailableRoomsPage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Retrieve available rooms from local storage
    const availableRooms = localStorage.getItem("availableRooms");
    if (availableRooms) {
      setRooms(JSON.parse(availableRooms));
    }
  }, []);

  return (
    <>
      <MainNavigator />
      <div>
        <h1>Available Rooms</h1>
        {rooms.length > 0 ? (
          <ul>
            {rooms.map((room) => (
              <li key={room._id}>
                {`Room: ${room.room}, IMG: ${room.image}, Type: ${room.types}, Price: ${room.price}, Capacity: ${room.capacity}, Children: ${room.children}`}
              </li>
            ))}
          </ul>
        ) : (
          <p>No available rooms found.</p>
        )}
        <Link href="/booknow">Back to Booking</Link>
      </div>
    </>
  );
}
