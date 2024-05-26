"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Dashboard.css';

function FinancialDashboard() {
  const [financialData, setFinancialData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  useEffect(() => {
    filterData();
  }, [startDate, endDate, financialData]);

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
          revenue: room ? parseFloat(room.price) : 0
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

  const filterData = () => {
    const filtered = financialData.filter(data => {
      const date = new Date(data.date);
      return date >= startDate && date <= endDate;
    });
    setFilteredData(filtered);
  };

  const totalRevenue = filteredData.reduce((total, data) => total + data.revenue, 0);
  const bookingCount = filteredData.length;

  return (
    <div className="dashboard-container">
      <h1>Financial Dashboard</h1>
      <div className="date-picker-container">
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy/MM/dd"
        />
        <DatePicker
          selected={endDate}
          onChange={date => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy/MM/dd"
        />
      </div>
      {loading ? (
        <p>Loading financial data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="financial-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? filteredData.map((data, index) => (
              <tr key={index}>
                <td>{new Date(data.date).toLocaleDateString()}</td>
                <td>${data.revenue}</td>
              </tr>
            )) : <tr><td colSpan="2">No financial data available</td></tr>}
          </tbody>
          <tfoot>
            <tr>
              <td>Total:</td>
              <td>${totalRevenue}</td>
            </tr>
            <tr>
              <td>Booking Count:</td>
              <td>{bookingCount}</td>
            </tr>
          </tfoot>
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