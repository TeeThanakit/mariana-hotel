"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TbCurrencyBaht } from "react-icons/tb";

let count = 1;
function RoomTypesPage() {
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
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
        alert("Error fetching data: " + error.message); // Displaying alert for clarity
      }
    };

    fetchData();
  }, []);

  //   console.log(roomTypes);
  //   console.log(count++);
  return (
    <div className="mx-auto max-w-5xl">
      <h1>Room Types</h1>
      {roomTypes.length === 0 && <p>Loading....</p>}
      {roomTypes.length > 0 && (
        <ul>
          {roomTypes.map((room) => (
            <li key={room.id}>
              <div className="flex flex-col justify-center items-center">
                <Image
                  src={room.image}
                  width={300}
                  height={100}
                  alt="bedroom"
                />
                <div>
                  <div>
                    <h3>Room type: {room.types}</h3>
                    <p>Price per night: {room.price}</p>
                  </div>
                  <div>
                    <p>Adult: {room.capacity}</p>
                    <p>Children: {room.children}</p>
                  </div>
                </div>
                {room.available === "YES" ? (
                    <Link href="/booknow/booking-form">Book Now</Link>
                ) : (
                  <p>Room is unavailable!!</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RoomTypesPage;
