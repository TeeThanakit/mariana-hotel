"use client";
import React, { useState, useEffect } from 'react';

function RoomTypesPage() {
    const [roomTypes, setRoomTypes] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/roomclean');
            const jsonData = await response.json();
            if (response.ok) {
                setRoomTypes(jsonData);
            } else {
                throw new Error('Failed to fetch data: ' + jsonData.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error fetching data: ' + error.message);
        }
    };

    const handleCleanConfirm = async (roomId) => {
        try {
            const response = await fetch(`http://localhost:5001/api/roomclean/${roomId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clean: "YES" })
            });

            if (response.ok) {
                alert('Room status updated successfully!');
                fetchData(); // Refresh data
            } else {
                throw new Error('Failed to update room status.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating room status: ' + error.message);
        }
    };

    return (
        <div>
            <h1>Cleaning Tasks</h1>
            <table>
                <thead>
                    <tr>
                        <th>Room</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {roomTypes.length > 0 ? roomTypes.map(room => (
                        <tr key={room._id}>
                            <td>{room.room}</td>
                            <td>Need Cleaning</td>
                            <td>
                                <button onClick={() => handleCleanConfirm(room._id)}>Confirm Clean</button>
                            </td>
                        </tr>
                    )) : <tr><td colSpan="3">No room types loaded</td></tr>}
                </tbody>
            </table>
        </div>
    );
}

export default RoomTypesPage;
