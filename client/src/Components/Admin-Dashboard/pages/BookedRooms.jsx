import React, { useContext, useEffect, useState } from 'react';
import '../css/AllEmployees.css';
import '../css/BookedRooms.css';
import { FaTrash } from 'react-icons/fa6';
import axios from 'axios';
import AnotherContext from '../../../Context/AdminContext/AnotherContext';

const API_BASE = import.meta.env.VITE_API_URL || 'https://employee-activity-monitoring-api.onrender.com';

const AllMeetingRooms = () => {
    const { handleRoomDelete } = useContext(AnotherContext);
    const [BookedRooms, setBookedRooms] = useState([]);

    const allBookedRooms = () => {
        axios
            .get(`${API_BASE}/project/all-booked-rooms`)
            .then((res) => {
                setBookedRooms(res.data.allBookedRooms);
            })
            .catch((error) => {
                console.error('Fetching Booked Room Failed', error);
            });
    };

    useEffect(() => {
        allBookedRooms();
    }, []);

    return (
        <div className="rooms-page">
            {/* ── Header ── */}
            <div className="rooms-header">
                <div className="rooms-header-top">
                    <h4>Booked Rooms</h4>
                    <span className="rooms-header-tag">— Overview</span>
                </div>
            </div>

            {/* ── Table Panel ── */}
            <div className="rooms-body">
                <div className="rooms-table-header">
                    <h5>All Bookings</h5>
                    <span className="rooms-count">
                        {BookedRooms.length} bookings
                    </span>
                </div>

                <div className="rooms-table-wrapper">
                    <table className="rooms-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Project Head</th>
                                <th>Room</th>
                                <th>Reason</th>
                                <th>Booking Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {BookedRooms.length > 0 ? (
                                BookedRooms.map((each, index) => (
                                    <tr key={each._id}>
                                        <td className="td-index">
                                            {index + 1}
                                        </td>
                                        <td className="td-title">
                                            {each.projectHead}
                                        </td>
                                        <td>
                                            <span className="room-badge">
                                                {each.roomsForMeeting}
                                            </span>
                                        </td>
                                        <td className="td-reason">
                                            {each.reasonForMeeting}
                                        </td>
                                        <td>
                                            {new Date(
                                                each.bookingDate,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <span className="time-badge">
                                                {each.meetingStartingTime}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="time-badge">
                                                {each.meetingEndingTime}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="delete-btn"
                                                aria-label="Delete Booking"
                                                onClick={() =>
                                                    handleRoomDelete(each._id)
                                                }
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="td-empty">
                                        No bookings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllMeetingRooms;
