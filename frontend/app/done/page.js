"use client";
import Link from "next/link";
import { useRouter } from "next/router"; // Use useRouter from next/router instead of next/navigation

export default function DonePage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-xl w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Booking Successful!
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Thank you for your booking. Your reservation has been confirmed.
        </p>
        <Link href="/" passHref>
          <button className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out">
            Go to Home
          </button>
        </Link>
      </div>
    </section>
  );
}
