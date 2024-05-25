"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ConfirmPage() {
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const queryRoomId = new URLSearchParams(window.location.search).get("roomId");
    setRoomId(queryRoomId);
  }, []);

  useEffect(() => {
    if (roomId) {
      const availableRooms = localStorage.getItem("availableRooms");
      if (availableRooms) {
        const rooms = JSON.parse(availableRooms);
        const fetchedRoom = rooms.find((room) => room._id === roomId);
        if (fetchedRoom) {
          setRoom(fetchedRoom);
        }
      }
    }

    const storedCheckInDate = localStorage.getItem("checkInDate");
    const storedCheckOutDate = localStorage.getItem("checkOutDate");
    if (storedCheckInDate) setCheckInDate(storedCheckInDate);
    if (storedCheckOutDate) setCheckOutDate(storedCheckOutDate);
  }, [roomId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      paymentType: formData.get("paymentType"),
      roomId: roomId,
      checkInDate,
      checkOutDate,
      room: room.room,
      roomType: room.types,
      roomPrice: room.price
    };

    const errors = {};
    if (!data.name) errors.name = "Name is required";
    if (!data.email) errors.email = "Email is required";
    if (!data.phone) errors.phone = "Phone number is required";
    if (!data.paymentType) errors.paymentType = "Payment Type is required";
    if (!/^\d{10}$/.test(data.phone)) errors.phone = "Phone number must be 10 digits";
    if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Email address is invalid";

    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch("http://localhost:5001/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          console.log("Booking data:", data);
          router.push("/done");
        } else {
          setErrors({ general: "Error confirming booking" });
        }
      } catch (error) {
        console.error("Error:", error);
        setErrors({ general: "An error occurred while confirming booking" });
      }
    } else {
      setErrors(errors);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-semibold mb-8 text-center">Confirm Booking</h1>
        {room ? (
          <div className="mb-8">
            <p className="text-lg">Room: {room.room}</p>
            <p className="text-lg">Room Type: {room.types}</p>
            <p className="text-lg">Room Price: ${room.price}</p>
            <p className="text-lg">Check-in Date: {checkInDate}</p>
            <p className="text-lg">Check-out Date: {checkOutDate}</p>
          </div>
        ) : (
          <p className="text-lg">Loading room details...</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-lg">Name:</span>
            <input
              type="text"
              name="name"
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </label>
          <label className="block">
            <span className="text-lg">Email:</span>
            <input
              type="email"
              name="email"
              required
              className={`mt-1 p-2 border border-gray-300 rounded-md w-full ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </label>
          <label className="block">
            <span className="text-lg">Phone:</span>
            <input
              type="tel"
              name="phone"
              required
              className={`mt-1 p-2 border border-gray-300 rounded-md w-full ${
                errors.phone ? "border-red-500" : ""
              }`}
            />
            {errors.phone && <p className="text-red-500">{errors.phone}</p>}
          </label>
          <label className="block">
            <span className="text-lg">Payment Type:</span>
            <select
              name="paymentType"
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="">Select Payment Type</option>
              <option value="creditCard">Credit Card</option>
              <option value="debitCard">Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bankTransfer">BankTransfer</option>
            </select>
            {errors.paymentType && <p className="text-red-500">{errors.paymentType}</p>}
          </label>
          <button
            type="submit"
            className="block w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 text-center"
          >
            Confirm Booking
          </button>
          {errors.general && <p className="mt-4 text-red-500">{errors.general}</p>}
        </form>
      </div>
    </section>
  );
}
