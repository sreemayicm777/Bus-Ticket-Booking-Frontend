// src/pages/AllBookingsPage.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

function AllBookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axiosInstance.get("/booking/admin").then((res) => setBookings(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Bookings (Admin)</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((b) => (
          <div key={b._id} className="border p-4 mb-2 rounded shadow">
            <p><strong>User:</strong> {b.user.name} ({b.user.email})</p>
            <p><strong>Bus:</strong> {b.bus.name}</p>
            <p><strong>Route:</strong> {b.from} → {b.to}</p>
            <p><strong>Seats:</strong> {b.seatsBooked}</p>
            <p><strong>Total Fare:</strong> ₹{b.totalFare}</p>
            <p><strong>Status:</strong> {b.Status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default AllBookingsPage;
