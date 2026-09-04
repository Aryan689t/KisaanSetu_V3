// src/components/farmer/BookingActions.jsx
import React, { useState } from 'react';
import { cancelBooking, rescheduleBooking } from '../../services/bookingService';

export default function BookingActions({ bookingId, currentStatus }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleCancel = async () => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            setLoading(true);
            const result = await cancelBooking(bookingId, currentStatus);
            setMessage(result.message);
            setLoading(false);
        }
    };

    const handleReschedule = async () => {
        // For now, we simulate picking a new date tomorrow
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + 1);
        const fakeNewDate = newDate.toISOString().split('T')[0];

        setLoading(true);
        const result = await rescheduleBooking(bookingId, fakeNewDate, "Morning Slot");
        setMessage(result.message);
        setLoading(false);
    };

    // Hide buttons if the booking is already completed or cancelled
    if (currentStatus === 'completed' || currentStatus === 'cancelled') {
        return null;
    }

    return (
        <div className="mt-4 flex flex-col gap-2">
            {message && (
                <div className="text-sm p-2 bg-blue-50 text-blue-700 rounded border border-blue-200 mb-2">
                    {message}
                </div>
            )}
            <div className="flex gap-3">
                <button
                    onClick={handleReschedule}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Processing...' : 'Reschedule'}
                </button>
                <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm font-medium border border-red-200 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Processing...' : 'Cancel Booking'}
                </button>
            </div>
        </div>
    );
}