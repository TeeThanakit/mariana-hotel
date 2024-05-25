"use client"
import React, { useState, useEffect } from 'react'

function RoomTypesPage() {
    const [roomTypes, setRoomTypes] = useState([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/roomclean')
            const jsonData = await response.json()
            if (response.ok) {
                setRoomTypes(jsonData)
            } else {
                throw new Error('Failed to fetch data: ' + jsonData.message)
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Error fetching data: ' + error.message)
        }
    }

    const handleCleanConfirm = async (room, status) => {
        let newStatus
        if (status === 'NO') {
            newStatus = 'IN_PROGRESS'
        } else if (status === 'IN_PROGRESS') {
            newStatus = 'YES'
        } else {
            return // If status is YES, do nothing
        }

        try {
            const response = await fetch(`http://localhost:5001/api/roomclean/${room}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clean: newStatus })
            })

            if (response.ok) {
                alert('Room status updated successfully!')
                fetchData() // Refresh data
            } else {
                const errorData = await response.json()
                throw new Error('Failed to update room status: ' + errorData.message)
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Error updating room status: ' + error.message)
        }
    }

    const getStatusButton = (room) => {
        if (room.clean === 'YES') {
            return <button style={styles.cleanedButton} disabled>Done</button>
        } else if (room.clean === 'IN_PROGRESS') {
            return <button style={styles.inProgressButton} onClick={() => handleCleanConfirm(room.room, room.clean)}>Press to "Done" cleaning</button>
        } else {
            return <button style={styles.notCleanedButton} onClick={() => handleCleanConfirm(room.room, room.clean)}>Press to "Go" cleaning</button>
        }
    }

    const getStatusBox = (status) => {
        if (status === 'YES') return <div style={styles.cleanedBox}>Cleaned</div>
        if (status === 'IN_PROGRESS') return <div style={styles.inProgressBox}>In Progress</div>
        return <div style={styles.notCleanedBox}>Not Cleaned</div>
    }

    const sortedRoomTypes = roomTypes.sort((a, b) => {
        const statusOrder = { 'NO': 0, 'IN_PROGRESS': 1, 'YES': 2 }
        return statusOrder[a.clean] - statusOrder[b.clean]
    })

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Cleaning Tasks</h1>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>Room</th>
                        <th style={styles.tableHeader}>Status</th>
                        <th style={styles.tableHeader}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedRoomTypes.length > 0 ? sortedRoomTypes.map(room => (
                        <tr key={room._id}>
                            <td style={styles.tableCell}>{room.room}</td>
                            <td style={styles.statusCell}>{getStatusBox(room.clean)}</td>
                            <td style={styles.actionCell}>{getStatusButton(room)}</td>
                        </tr>
                    )) : <tr><td colSpan="3" style={styles.noData}>No room types loaded</td></tr>}
                </tbody>
            </table>
        </div>
    )
}

const styles = {
    container: {
        maxWidth: '100%',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '0 auto',
    },
    tableHeader: {
        backgroundColor: '#f4f4f4',
        padding: '10px',
        border: '1px solid #ddd',
    },
    tableCell: {
        padding: '10px',
        border: '1px solid #ddd',
        textAlign: 'center',
    },
    statusCell: {
        padding: '10px',
        border: '1px solid #ddd',
        textAlign: 'center',
        verticalAlign: 'middle',
    },
    actionCell: {
        padding: '0',
        border: '1px solid #ddd',
        textAlign: 'center',
        verticalAlign: 'middle',
    },
    noData: {
        textAlign: 'center',
        padding: '10px',
    },
    cleanedButton: {
        padding: '7px 15px',
        border: '1px solid #000',
        color: 'black',
        backgroundColor: 'transparent',
        cursor: 'not-allowed',
        borderRadius: '4px',
        width: '240px', // Uniform button width
    },
    inProgressButton: {
        padding: '7px 15px',
        border: '1px solid #000',
        color: 'black',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        borderRadius: '4px',
        width: '240px', // Uniform button width
    },
    notCleanedButton: {
        padding: '7px 0px',
        border: '1px solid #000',
        color: 'black',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        borderRadius: '4px',
        width: '240px', // Uniform button width
    },
    cleanedBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '60%',
        padding: '8px 8px',
        color: 'white',
        backgroundColor: 'green',
        borderRadius: '4px',
    },
    inProgressBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '60%',
        padding: '8px 10px',
        color: 'white',
        backgroundColor: 'orange',
        borderRadius: '4px',
    },
    notCleanedBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '60%',
        padding: '8px 10px',
        color: 'white',
        backgroundColor: 'red',
        borderRadius: '4px',
    },
}

export default RoomTypesPage
