// src/services/bookingService.js

export const cancelBooking = async (bookingId, currentStatus) => {
    if (currentStatus === 'completed' || currentStatus === 'serving') {
        return { success: false, message: "Cannot cancel a booking that is already in progress or completed." };
    }
    try {
        console.log(`Booking ${bookingId} cancelled successfully.`);
        return { success: true, message: "Your booking has been cancelled." };
    } catch (error) {
        console.error("Error cancelling booking:", error);
        return { success: false, message: "Failed to cancel booking." };
    }
};

export const rescheduleBooking = async (bookingId, newDate, newTimeSlot) => {
    try {
        console.log(`Booking ${bookingId} rescheduled to ${newDate} at ${newTimeSlot}.`);
        return { success: true, message: `Successfully rescheduled to ${newDate}.` };
    } catch (error) {
        console.error("Error rescheduling booking:", error);
        return { success: false, message: "Failed to reschedule booking." };
    }
};
