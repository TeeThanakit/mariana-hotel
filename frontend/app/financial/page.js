"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FinancialDashboard() {
  const [financialData, setFinancialData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const bookingsResponse = await axios.get('http://localhost:5001/api/bookings');
      const roomsResponse = await axios.get('http://localhost:5001/api/rooms');

      const bookings = bookingsResponse.data;
      const rooms = roomsResponse.data;

      const financialData = bookings.map(booking => {
        const room = rooms.find(room => room.room === booking.room);
        return {
          date: booking['check-in_date'],
          revenue: room ? room.price : 0
        };
      });

      setFinancialData(financialData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      setError('Failed to fetch financial data. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Financial Dashboard</h1>
      {loading ? (
        <p>Loading financial data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {financialData.length > 0 ? financialData.map((data, index) => (
              <tr key={index}>
                <td>{new Date(data.date).toLocaleDateString()}</td>
                <td>{data.revenue}</td>
              </tr>
            )) : <tr><td colSpan="2">No financial data available</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <FinancialDashboard />
    </div>
  );
}

export default Dashboard;