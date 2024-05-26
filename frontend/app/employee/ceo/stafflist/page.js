// StaffList.js
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

function StaffList() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/staff");
      setStaffList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching staff list:", error);
      setError("Failed to fetch staff list. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Staff List</h1>
      {loading ? (
        <p className="text-blue-500">Loading staff list...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2 px-4 border-b">Staff ID</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Username</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff.staffID} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{staff.staffID}</td>
                  <td className="py-2 px-4 border-b">
                    {staff.name} {staff.lastName}
                  </td>
                  <td className="py-2 px-4 border-b">{staff.role}</td>
                  <td className="py-2 px-4 border-b">{staff.email}</td>
                  <td className="py-2 px-4 border-b">{staff.tel}</td>
                  <td className="py-2 px-4 border-b">{staff.username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StaffList;
