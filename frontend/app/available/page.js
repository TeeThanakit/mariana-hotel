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
      <section className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-3xl font-semibold mb-8">Available Rooms</h1>
        <div className="w-full max-w-4xl overflow-y-auto">
          {rooms.length > 0 ? (
            <div className="space-y-8">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={room.image}
                    alt={`Room ${room.room}`}
                    className="w-full h-auto object-cover"
                  />
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">{room.room}</h2>
                    <p className="text-lg mb-2">Type: {room.types}</p>
                    <p className="text-lg mb-2">Price per day: ${room.price}</p>
                    <p className="text-lg mb-2">Capacity: {room.capacity}</p>
                    <p className="text-lg mb-2">Children: {room.children}</p>
                    <Link href={`/confrim?roomId=${room._id}`}>
                      <span className="text-lg bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 cursor-pointer">
                        Book Now
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700">No available rooms found.</p>
          )}
        </div>
      </section>
    </>
  );
}
