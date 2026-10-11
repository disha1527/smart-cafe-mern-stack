



import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const AdminBookings = () => {
  const { adminToken } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/bookings",
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.bookings || [];

      setBookings(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    await axios.delete(
      `http://localhost:5000/api/admin/bookings/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    fetchBookings();
  };

  const updateBooking = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "Pending" ? "Confirmed" : "Pending";

    await axios.put(
      `http://localhost:5000/api/admin/bookings/update/${id}`,
      { status: newStatus },
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );

    fetchBookings();
  };

  useEffect(() => {
    if (adminToken) fetchBookings();
  }, [adminToken]);

  return (
    <div className="min-h-screen bg-[#F4F6F8] pt-28 px-6">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Booking Management
        </h1>
        <p className="text-gray-500 text-sm">
          Manage all customer bookings
        </p>
      </div>

      {/* Card */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg border overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No bookings found
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm text-left">

              {/* Head */}
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Customer & Booking ID</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Guests</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y">

                {bookings.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-gray-800">
                          {b.user?.name || "N/A"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {b.user?.email || "N/A"}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          ID: {b._id}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      <div className="font-medium text-gray-800">
                        {new Date(b.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {b.time}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {b.guests}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {b.tableLocation || "Standard"}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold
                        ${b.status === "Pending" && "bg-yellow-100 text-yellow-600"}
                        ${b.status === "Confirmed" && "bg-green-100 text-green-600"}
                        ${b.status === "Cancelled" && "bg-red-100 text-red-600"}
                        `}
                      >
                        {b.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 flex gap-3 justify-center">

                      <button
                        onClick={() => updateBooking(b._id, b.status)}
                        className="bg-[#7B3F00] text-white px-4 py-1.5 rounded-lg text-sm hover:bg-[#5a2e00]"
                      >
                        Update
                      </button>

                      <button
                        onClick={() => deleteBooking(b._id)}
                        className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>
            </table>

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;