"use client";
import React, { useState, useEffect } from 'react';

function RoomTypesPage() {
    const [roomTypes, setRoomTypes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://43.229.135.65:5001/api/roomtypes');
                const jsonData = await response.json();
                if (response.ok) {
                    setRoomTypes(jsonData);
                } else {
                    throw new Error('Failed to fetch data: ' + jsonData.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error fetching data: ' + error.message);  // Displaying alert for clarity
            }
        };
    
        fetchData();
    }, []);
    

    return (
        <div>
            <h1>Room Types</h1>
            <div>
                {roomTypes.length > 0 ? (
                    <ul>
                        {roomTypes.map(room => (
                            <li key={room._id}>
                                Type: {room.types}, Price: {room.price}, Available: {room.available}
                            </li>
                        ))}
                    </ul>
                ) : <p>No room types loaded</p>}
            </div>
        </div>
    );
}

export default RoomTypesPage;
