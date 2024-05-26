"use client";
import { useState, useEffect } from "react";
import { RoleStaffNav } from "@/components/staff-role-nav";
import { usePathname } from "next/navigation";

async function getPayment() {
  try {
    const response = await fetch("http://localhost:5001/api/paymentview");
    const jsonData = await response.json();
    if (response.ok) {
      console.log("Received data:", jsonData);
      return jsonData;
    } else {
      throw new Error("Failed to fetch data: " + jsonData.message);
    }
  } catch (error) {
    console.error("Error:", error);
    return { error: error.message };
  }
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return date.toLocaleString(undefined, options);
}

export default function Payment() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      const paymentData = await getPayment();
      if (paymentData.error) {
        setError(paymentData.error);
      } else {
        setData(paymentData);
      }
    }
    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.paymentType.toLowerCase().includes(search.toLowerCase()) ||
      item.paymentID.toLowerCase().includes(search.toLowerCase()) ||
      formatTimestamp(item.timestamp)
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }
  const pathname = usePathname()
  return (
    <div className="container mx-auto p-4">
      <div className="mt-5">
        <RoleStaffNav current={pathname} />
      </div>
      <h1 className="text-3xl font-bold mb-6">Payments</h1>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded-md w-full"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                Timestamp
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                Payment Type
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                Price
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                Payment ID
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={item._id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                  {formatTimestamp(item.timestamp)}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                  {item.paymentType}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                  {item.roomPrice}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                  {item.name}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700">
                  {item.paymentID}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
