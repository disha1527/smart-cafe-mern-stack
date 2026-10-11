import { useState, useEffect, useRef } from "react";
import { FaCalendarAlt, FaClock, FaUsers, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaDownload, FaEye, FaTimes } from "react-icons/fa";
import { jsPDF } from "jspdf";
import { io } from "socket.io-client";

function Booking() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [tableLocation, setTableLocation] = useState("");
  const [previewLocation, setPreviewLocation] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const bookingsRef = useRef(null);
  const token = localStorage.getItem("token");

  const locationOptions = ["Window View", "Quiet Corner", "Center Hall", "Outdoor Patio"];

  useEffect(() => {
    if (date) {
      const selectedDate = new Date(date);
      const dayOfWeek = selectedDate.getDay();
      let startHour = 10;
      let endHour = 22;

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        startHour = 9;
        endHour = 23;
      }

      const slots = [];
      for (let i = startHour; i < endHour; i++) {
        const ampm = i >= 12 ? 'PM' : 'AM';
        const hour12 = i > 12 ? i - 12 : (i === 0 ? 12 : i);
        slots.push(`${hour12}:00 ${ampm}`);
        slots.push(`${hour12}:30 ${ampm}`);
      }
      setTimeSlots(slots);
      setTime("");
    } else {
      setTimeSlots([]);
    }
  }, [date]);

  const fetchBookings = async () => {
    const res = await fetch("http://localhost:5000/api/bookings", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) {
      setBookings(data.bookings);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (date && tableLocation) {
        try {
          const res = await fetch(`http://localhost:5000/api/bookings/booked-slots?date=${date}&tableLocation=${tableLocation}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success) {
            setBookedSlots(data.blockedTimes);
          }
        } catch (error) {
          console.error("Error fetching booked slots", error);
        }
      } else {
        setBookedSlots([]);
      }
    };
    fetchBookedSlots();
  }, [date, tableLocation, token]);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("booking_created", (newBooking) => {
      if (
        date &&
        new Date(date).toISOString().split("T")[0] === new Date(newBooking.date).toISOString().split("T")[0] &&
        tableLocation === newBooking.tableLocation
      ) {
        setBookedSlots((prev) => [...prev, newBooking.time]);
      }
    });

    return () => socket.disconnect();
  }, [date, tableLocation]);

  const handleBooking = async () => {
    if (!date || !time || !tableLocation) {
      alert("Please select date, time and table location");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ date, time, guests, tableLocation })
      });

      const data = await res.json();

      if (data.success) {
        alert("Booking Created Successfully! ✅");
        fetchBookings();
        setDate("");
        setTime("");
        setTableLocation("");
        if (bookingsRef.current) {
          bookingsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        alert(data.message || "Booking failed ❌");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    const confirmCancel = window.confirm(
      "Cancel this booking?\nRefund rules:\n- 24hr before = Full refund\n- 6hr before = 50%\n- Less = No refund"
    );

    if (!confirmCancel) return;

    try {
      const res = await fetch(`http://localhost:5000/api/bookings/cancel/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        alert(`Booking Cancelled. Refund Issued: ₹${data.refundAmount}`);
        fetchBookings();
      } else {
        alert(data.message || "Cancellation failed");
      }
    } catch (error) {
      alert("An error occurred during cancellation.");
    }
  };

  const downloadReceipt = (booking) => {
    if (booking.status === "Pending") {
      alert("Payment is Pending! Please complete your payment to download the receipt.");
      return;
    }

    const doc = new jsPDF();

    // Background & Border
    doc.setFillColor(252, 250, 248); // #FCFAF8
    doc.rect(0, 0, 210, 297, "F");
    doc.setDrawColor(139, 69, 19);
    doc.setLineWidth(1);
    doc.rect(10, 10, 190, 277);

    // Professional Header
    doc.setFillColor(139, 69, 19); // #8B4513
    doc.rect(10, 10, 190, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("QuickCafe", 105, 28, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Official Reservation Systemt", 105, 40, { align: "center" });

    // Booking Details Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Reservation Details", 20, 70);

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, 75, 190, 75);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    const formattedDate = new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    doc.text(`Booking ID:`, 20, 90);
    doc.setFont("helvetica", "bold");
    doc.text(`${booking._id}`, 50, 90);

    doc.setFont("helvetica", "normal");
    doc.text(`Date:`, 20, 105);
    doc.setFont("helvetica", "bold");
    doc.text(`${formattedDate}`, 50, 105);

    doc.setFont("helvetica", "normal");
    doc.text(`Time:`, 20, 120);
    doc.setFont("helvetica", "bold");
    doc.text(`${booking.time}`, 50, 120);

    doc.setFont("helvetica", "normal");
    doc.text(`Guests:`, 20, 135);
    doc.setFont("helvetica", "bold");
    doc.text(`${booking.guests} People`, 50, 135);

    doc.setFont("helvetica", "normal");
    doc.text(`Location:`, 20, 150);
    doc.setFont("helvetica", "bold");
    doc.text(`${booking.tableLocation || "Standard Room"}`, 50, 150);

    doc.setFont("helvetica", "normal");
    doc.text(`Status:`, 20, 165);
    doc.setTextColor(22, 163, 74); // green
    doc.setFont("helvetica", "bold");
    doc.text(`${booking.status}`, 50, 165);

    // Payment Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text("Payment Info", 20, 195);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 200, 190, 200);

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Amount Paid:`, 20, 215);
    doc.setFont("helvetica", "bold");
    doc.text(`Rs. ${booking.bookingAmount}`, 55, 215);

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    doc.text("Thank you for choosing our cafe.", 105, 260, { align: "center" });
    doc.text("Please show this receipt at the entrance upon arrival.", 105, 266, { align: "center" });

    doc.save(`Cafe_Reservation_${booking._id.substring(0, 6)}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2] pb-24 font-sans">

      {/* Hero Section */}
      <div className="relative w-full h-[45vh] lg:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24"
          alt="Cafe Ambiance"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="relative z-20 text-center px-4 max-w-3xl">
          <span className="inline-block px-4 py-1.5 bg-yellow-500/90 text-yellow-950 text-xs font-black tracking-widest uppercase rounded-full mb-4 shadow-lg backdrop-blur-sm">
            Premium Experience
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-xl tracking-tight mb-4 leading-tight">
            Reserve Your Spot
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-medium drop-shadow-md">
            Skip the wait. Choose your favorite corner, pick a time, and let us prepare for your arrival.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-30 grid lg:grid-cols-12 gap-10 items-start">

        {/* Booking Form */}
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-white/50">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-[#3B1F0E] mb-2">Book a Table</h2>
            <p className="text-gray-500">Fill out the details below to secure your reservation.</p>
          </div>

          <div className="space-y-8">

            {/* Grid for Date & Guests */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 font-bold text-gray-700 mb-2">
                  <FaCalendarAlt className="text-[#8B4513]" /> Date
                </label>
                <input
                  type="date"
                  className="w-full bg-[#F8F5F2] text-gray-800 border-2 border-transparent focus:border-[#8B4513] focus:bg-white focus:ring-0 p-3.5 rounded-2xl outline-none transition-all font-medium"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 font-bold text-gray-700 mb-2">
                  <FaUsers className="text-[#8B4513]" /> Number of Guests
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-[#F8F5F2] text-gray-800 border-2 border-transparent focus:border-[#8B4513] focus:bg-white focus:ring-0 p-3.5 rounded-2xl outline-none appearance-none transition-all font-medium cursor-pointer"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* Table Location */}
            <div>
              <label className="flex items-center gap-2 font-bold text-gray-700 mb-3">
                <FaMapMarkerAlt className="text-[#8B4513]" /> Select Table Location
              </label>
              <div className="grid grid-cols-2 gap-4">
                {locationOptions.map((loc) => (
                  <div key={loc} className="relative flex shadow-sm rounded-2xl">
                    <button
                      onClick={() => setTableLocation(loc)}
                      className={`flex-1 p-4 rounded-l-2xl border-2 border-r-0 text-sm md:text-base font-bold transition-all duration-300
                      ${tableLocation === loc
                          ? "bg-[#8B4513] text-white border-[#8B4513] shadow-lg shadow-[#8B4513]/30 z-10"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#8B4513]/50 hover:bg-[#F8F5F2]"
                        }`}
                    >
                      {loc}
                    </button>
                    <button
                      onClick={() => setPreviewLocation(loc)}
                      className={`px-3 flex items-center justify-center rounded-r-2xl border-2 transition-all duration-300 z-10
                      ${tableLocation === loc
                          ? "bg-[#8B4513] text-white border-[#8B4513] border-l-white/20 hover:bg-[#6e360f]"
                          : "bg-white text-gray-400 border-gray-200 border-l-gray-100 hover:text-[#8B4513] hover:bg-gray-50"
                        }`}
                      title="View Location Image"
                    >
                      <FaEye size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className={!date ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
              <label className="flex items-center gap-2 font-bold text-gray-700 mb-3">
                <FaClock className="text-[#8B4513]" /> Select Time
                {!date && <span className="text-xs font-normal text-red-500 ml-2 animate-pulse">(Please pick a date first)</span>}
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-2 pb-2 custom-scrollbar">
                {timeSlots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      onClick={() => !isBooked && setTime(slot)}
                      disabled={isBooked}
                      className={`relative py-3 px-2 rounded-xl border-2 text-sm font-bold transition-all overflow-hidden flex flex-col items-center justify-center
                      ${isBooked
                          ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed opacity-70"
                          : time === slot
                            ? "bg-[#8B4513] text-white border-[#8B4513] shadow-md shadow-[#8B4513]/20 scale-105"
                            : "bg-white text-gray-700 border-gray-200 hover:border-[#8B4513]/50 hover:bg-[#F8F5F2]"
                        }`}
                    >
                      <span>{slot}</span>
                      {isBooked && (
                        <span className="text-[10px] text-red-500 uppercase tracking-widest mt-0.5 font-black">
                          Booked
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                onClick={handleBooking}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#5a2e00] to-[#8B4513] text-white py-4 rounded-2xl font-black text-lg tracking-wide hover:shadow-[0_10px_30px_rgba(139,69,19,0.3)] hover:-translate-y-1 transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? "Processing..." : "Confirm Booking (₹200)"}
              </button>
            </div>

          </div>
        </div>

        {/* My Bookings Sidebar */}
        <div className="lg:col-span-5" ref={bookingsRef}>
          <div className="bg-white/90 backdrop-blur-lg rounded-[2.5rem] shadow-xl p-8 border border-white sticky top-28">
            <h2 className="text-2xl font-extrabold text-[#3B1F0E] mb-6 flex items-center gap-3">
              <FaCheckCircle className="text-green-600" /> My Reservations
            </h2>

            {bookings.length === 0 ? (
              <div className="text-center py-10 bg-[#F8F5F2] rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">You have no active reservations.</p>
                <p className="text-xs text-gray-400 mt-2">Book a table to see it here.</p>
              </div>
            ) : (
              <div className="space-y-5 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-[#F8F5F2] p-5 rounded-2xl border border-gray-100 hover:border-[#8B4513]/30 transition-colors group relative overflow-hidden"
                  >
                    {/* Status Indicator Line */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${booking.status === 'Cancelled' ? 'bg-red-500' : 'bg-green-500'}`}></div>

                    <div className="pl-3">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-[#3B1F0E] font-black text-lg leading-none mb-1">
                            {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-[#8B4513] font-bold text-sm">
                            {booking.time} • {booking.guests} {booking.guests > 1 ? 'Guests' : 'Guest'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-xs font-extrabold rounded-full ${booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 mb-4">
                        <div className="bg-[#F8F5F2] p-2 rounded-lg">
                          <FaMapMarkerAlt className="text-[#8B4513]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Location</p>
                          <p className="text-gray-800 font-bold text-sm">{booking.tableLocation || "Standard Room"}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-2">
                        <div>
                          {booking.status === "Cancelled" && booking.refundAmount !== undefined ? (
                            <p className="text-red-600 font-bold text-sm">
                              Refund: ₹{booking.refundAmount}
                            </p>
                          ) : (
                            <p className="text-gray-600 font-bold text-sm">
                              Paid: ₹{booking.bookingAmount}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {booking.status !== "Cancelled" && (
                            <button
                              onClick={() => downloadReceipt(booking)}
                              className="text-[#8B4513] border border-[#8B4513] hover:bg-[#8B4513] hover:text-white px-4 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5"
                            >
                              <FaDownload /> Receipt
                            </button>
                          )}

                          {booking.status !== "Cancelled" && (
                            <button
                              onClick={() => cancelBooking(booking._id)}
                              className="text-red-500 hover:text-white border border-red-500 hover:bg-red-600 px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Preview Modal */}
      {previewLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in-up" onClick={() => setPreviewLocation(null)}>
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreviewLocation(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
            >
              <FaTimes />
            </button>
            <div className="bg-[#8B4513] text-white p-4 text-center font-bold text-xl">
              {previewLocation}
            </div>
            <img
              src={
                previewLocation === "Window View" ? "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" :
                  previewLocation === "Quiet Corner" ? "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" :
                    previewLocation === "Center Hall" ? "https://www.bing.com/th/id/OIP.GxXmBPMp0Bwy8XsTZiANWwAAAA?w=193&h=135&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" :
                      "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              }
              alt={previewLocation}
              className="w-full h-[60vh] object-cover"
            />
          </div>
        </div>
      )}

      {/* Add custom scrollbar styling globally or inline just for this page */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4a373; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #8b4513; 
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Booking;