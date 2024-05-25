"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ConfrimPage() {
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [errors, setErrors] = useState({}); // State to track input errors

  useEffect(() => {
    const queryRoomId = new URLSearchParams(window.location.search).get(
      "roomId"
    );
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
  }, [roomId]);

  const handleConfirmBooking = () => {
    router.push("/done");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      paymentType: formData.get("paymentType"),
      roomId: roomId,
    };

    // Validation
    const errors = {};
    if (!data.name) {
      errors.name = "Name is required";
    }
    if (!data.email) {
      errors.email = "Email is required";
    }
    if (!data.phone) {
      errors.phone = "Phone number is required";
    }
    if (!data.paymentType) {
      errors.paymentType = "Payment Type is required";
    } else if (
      data.paymentType !== "creditCard" &&
      data.paymentType !== "paypal"
    ) {
      errors.paymentType = "Invalid payment type";
    }
    if (!/^\d{10}$/.test(data.phone)) {
      errors.phone = "Phone number must be 10 digits";
    }
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email address is invalid";
    }

    if (Object.keys(errors).length === 0) {
      console.log("Booking data:", data);
      // Handle booking confirmation logic here
    } else {
      setErrors(errors);
    }
  };

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Handler for check-in date change
  const handleCheckInChange = (e) => {
    const newCheckInDate = e.target.value;
    setCheckInDate(newCheckInDate);
    // Adjust check-out date if it's before the new check-in date
    if (newCheckInDate > checkOutDate) {
      setCheckOutDate("");
    }
  };

  // Handler for check-out date change
  const handleCheckOutChange = (e) => {
    setCheckOutDate(e.target.value);
  };

  // Handler for form submission
  const handleFormSubmit = (e) => {
    // Renamed to handleFormSubmit to avoid conflict
    e.preventDefault();
    // Validate the dates before proceeding
    const newErrors = {};
    if (!checkInDate) {
      newErrors.checkInDate = "Check-in date is required";
    }
    if (!checkOutDate) {
      newErrors.checkOutDate = "Check-out date is required";
    } else if (checkOutDate <= checkInDate) {
      newErrors.checkOutDate = "Check-out date must be after the check-in date";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log("Booking data:", { checkInDate, checkOutDate });
      // Handle booking confirmation logic here
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-semibold mb-8 text-center">
          Confirm Booking
        </h1>
        {room ? (
          <div className="mb-8">
            <p className="text-lg">Room ID: {room._id}</p>
            <p className="text-lg">Room Name: {room.room}</p>
            <p className="text-lg">Room Price: ${room.price}</p>
            {/* Display other room details */}
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
          <form onSubmit={handleFormSubmit}>
            <label className="block">
              <span className="text-lg">Check-in Date:</span>
              <input
                type="date"
                name="checkInDate"
                value={checkInDate}
                min={today}
                onChange={handleCheckInChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
              {errors.checkInDate && (
                <span className="text-red-500">{errors.checkInDate}</span>
              )}
            </label>
            <label className="block mt-4">
              <span className="text-lg">Check-out Date:</span>
              <input
                type="date"
                name="checkOutDate"
                value={checkOutDate}
                min={checkInDate || today}
                onChange={handleCheckOutChange}
                required
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
              {errors.checkOutDate && (
                <span className="text-red-500">{errors.checkOutDate}</span>
              )}
            </label>
            <label className="block">
              <span className="text-lg">Payment Type:</span>
              <select
                name="paymentType"
                required
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              >
                <option value="creditCard">Credit Card</option>
                <option value="paypal">PayPal</option>
                {/* Add other payment options */}
              </select>
            </label>
            <Link href="/done">
              <button className="block w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 text-center">
                Confirm Booking
              </button>
            </Link>
          </form>
        </form>
      </div>
    </section>
  );
}
