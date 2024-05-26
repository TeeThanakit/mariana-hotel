"use client";
import { useState, useEffect } from "react";
import { RoleStaffNav } from "@/components/staff-role-nav";

async function getBookedRoom() {
  try {
    const response = await fetch("http://localhost:5001/api/bookinfview", {
      next: {
        revalidate: 1,
      },
    });
    const jsonData = await response.json();
    if (response.ok) {
      return jsonData;
    } else {
      throw new Error("Failed to fetch data: " + jsonData.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error fetching data: " + error.message);
  }
}

function calculateNights(checkInDate, checkOutDate) {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diffTime = Math.abs(checkOut - checkIn);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function getSeason(month) {
  if (month === 11) return "HIGH";
  return "LOW";
}

function initializeAnalytics() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months.map((month, index) => ({
    month,
    season: getSeason(index),
    totalBooked: 0,
    totalNightsBooked: 0,
    averageNightsBooked: 0,
  }));
}

function getAnalytics(data) {
  const analytics = initializeAnalytics();

  data.forEach((item) => {
    const checkInDate = new Date(item["check-in_date"]);
    const monthIndex = checkInDate.getMonth();
    const nights = calculateNights(item["check-in_date"], item["check-out_date"]);

    analytics[monthIndex].totalBooked += 1;
    analytics[monthIndex].totalNightsBooked += nights;
  });

  analytics.forEach((item) => {
    if (item.totalBooked > 0) {
      item.averageNightsBooked = (
        item.totalNightsBooked / item.totalBooked
      ).toFixed(2);
    }
  });

  return analytics;
}

export default function Staff() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(initializeAnalytics());

  useEffect(() => {
    async function fetchData() {
      const bookedRoomData = await getBookedRoom();
      if (bookedRoomData.error) {
        setError(bookedRoomData.error);
      } else {
        const sortedData = bookedRoomData.sort(
          (a, b) => new Date(a["check-in_date"]) - new Date(b["check-in_date"])
        );
        setData(sortedData);
        setAnalytics(getAnalytics(sortedData));
      }
    }
    fetchData();
  }, []);

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  const style = "py-2 px-4 text-left text-sm font-medium text-gray-700";
  const style1 = "py-2 px-4 text-sm text-gray-700";

  return (
    <div>
      <div className="mt-5">
      </div>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Analytics Report</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className={style}>Month</th>
                <th className={style}>Season</th>
                <th className={style}>Total Booked</th>
                <th className={style}>Total Nights Booked</th>
                <th className={style}>Average Nights Booked</th>
              </tr>
            </thead>
            <tbody>
              {analytics.map((item, index) => (
                <tr
                  key={item.month}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className={style1}>{item.month}</td>
                  <td className={style1}>{item.season}</td>
                  <td className={style1}>{item.totalBooked}</td>
                  <td className={style1}>{item.totalNightsBooked}</td>
                  <td className={style1}>{item.averageNightsBooked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
