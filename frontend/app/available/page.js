import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

function RoomTypesPage() {
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await fetch("http://43.229.135.65:5001/api/roomtypes");
        const jsonData = await response.json();
        if (response.ok) {
          setRoomTypes(jsonData);
        } else {
          throw new Error("Failed to fetch data: " + jsonData.message);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error fetching data: " + error.message);
      }
    };

    fetchRoomTypes();
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <h1>Room Types</h1>
      {roomTypes.length === 0 && <p>Loading...</p>}
      {roomTypes.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roomTypes.map((room) => (
            <li
              key={room.id}
              className="border p-4 shadow-lg rounded-lg hover:bg-gray-100"
            >
              <Link href={`/booknow/booking-form?roomType=${room.id}`} passHref>
                <a className="flex flex-col items-center -m-4 p-4">
                  <div>
                    <Image
                      src={room.image}
                      width={300}
                      height={200}
                      alt="Room Image"
                      className="rounded"
                    />
                    <div className="mt-4 text-center">
                      <h3 className="text-lg font-semibold">{room.types}</h3>
                      <p className="text-gray-500">Price: {room.price}</p>
                      <p>Adults: {room.capacity}</p>
                      <p>Children: {room.children}</p>
                    </div>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RoomTypesPage;
