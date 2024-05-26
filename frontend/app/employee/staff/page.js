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

function formatDate(date) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Date(date).toLocaleString(undefined, options);
}

export default function Staff() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("recent");

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
        filterData(sortedData, filter);
      }
    }
    fetchData();
  }, [filter]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filterData = (data, filter) => {
    if (filter === "recent") {
      const now = new Date();
      const filtered = data.filter(
        (item) => new Date(item["check-out_date"]) >= now
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  useEffect(() => {
    filterData(data, filter);
  }, [data, filter]);

  const handleFilterChange = (filter) => {
    setFilter(filter);
  };

  const displayedData = filteredData.filter(
    (item) =>
      item.room.toLowerCase().includes(search.toLowerCase()) ||
      formatDate(item["check-in_date"])
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      formatDate(item["check-out_date"])
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.paymentID.toLowerCase().includes(search.toLowerCase()) ||
      item.customerID.toLowerCase().includes(search.toLowerCase())
  );

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  const style = "py-2 px-4 text-left text-sm font-medium text-gray-700";
  const style1 = "py-2 px-4 text-sm text-gray-700";

  return (
    <div>
      <div className="mt-5">
        <RoleStaffNav current="staff"/>
      </div>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Booked Rooms</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => handleFilterChange("recent")}
              className={`text-sm font-medium ${
                filter === "recent"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700"
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => handleFilterChange("all")}
              className={`text-sm font-medium ${
                filter === "all"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700"
              }`}
            >
              All Booking
            </button>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
          className="mb-4 p-2 border border-gray-300 rounded-md w-full"
        />
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className={style}>Room</th>
                <th className={style}>Check-in Time</th>
                <th className={style}>Check-out Time</th>
                <th className={style}>Payment ID</th>
                <th className={style}>Customer ID</th>
              </tr>
            </thead>
            <tbody>
              {displayedData.map((item, index) => (
                <tr
                  key={item._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className={style1}>{item.room}</td>
                  <td className={style1}>
                    {formatDate(item["check-in_date"])}
                  </td>
                  <td className={style1}>
                    {formatDate(item["check-out_date"])}
                  </td>
                  <td className={style1}>{item.paymentID}</td>
                  <td className={style1}>{item.customerID}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
