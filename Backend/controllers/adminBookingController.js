const Booking = require("../models/Booking");
const sendEmail = require("../utils/sendEmail");

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email"); // User info
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update booking status / payment / refund
exports.updateBooking = async (req, res) => {
  try {
    const { status, isPaid, refundAmount } = req.body;
    const booking = await Booking.findById(req.params.id).populate("user", "name email");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    const oldStatus = booking.status;

    if (status) booking.status = status;             // Pending / Confirmed / Cancelled
    if (isPaid !== undefined) booking.isPaid = isPaid;
    if (refundAmount !== undefined) booking.refundAmount = refundAmount;

    await booking.save({ validateBeforeSave: false }); // avoid required field errors

    // 📩 Send email if admin Confirmed it manually
    if (status === "Confirmed" && oldStatus !== "Confirmed" && booking.user) {
      const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #10b981; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Booking Confirmed ✅</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Dear <strong>${booking.user.name}</strong>,</p>
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
            Your table reservation request has been officially <strong>Confirmed</strong> by our administration team. Below are the details of your booking:
          </p>
          <div style="background-color: #f3f4f6; border-left: 4px solid #10b981; padding: 15px 20px; border-radius: 4px; margin-bottom: 25px;">
            <p style="margin: 8px 0; color: #374151;"><strong>Booking ID:</strong> <span style="color: #111827;">${booking._id}</span></p>
            <p style="margin: 8px 0; color: #374151;"><strong>Date:</strong> <span style="color: #111827;">${new Date(booking.date).toLocaleDateString()}</span></p>
            <p style="margin: 8px 0; color: #374151;"><strong>Time:</strong> <span style="color: #111827;">${booking.time}</span></p>
            <p style="margin: 8px 0; color: #374151;"><strong>Location:</strong> <span style="color: #111827;">${booking.tableLocation}</span></p>
            <p style="margin: 8px 0; color: #374151;"><strong>Guests:</strong> <span style="color: #111827;">${booking.guests}</span></p>
          </div>
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
            We look forward to hosting you and providing a memorable experience!
          </p>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 14px; color: #6b7280; margin: 0;">QuickCafe &copy; ${new Date().getFullYear()}</p>
        </div>
      </div>
      `;

      await sendEmail({
        email: booking.user.email,
        subject: "Table Booking Confirmed ✅ - QuickCafe",
        html: emailHtml
      });
    }

    // 📩 Send email if admin Cancelled it manually
    if (status === "Cancelled" && oldStatus !== "Cancelled" && booking.user) {
      const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #ef4444; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Booking Cancelled ❌</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Dear <strong>${booking.user.name}</strong>,</p>
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
            We regret to inform you that your booking request has been cancelled by our administration team.
          </p>
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px 20px; border-radius: 4px; margin-bottom: 25px;">
            <p style="margin: 8px 0; color: #374151;"><strong>Booking ID:</strong> <span style="color: #111827;">${booking._id}</span></p>
            <p style="margin: 8px 0; color: #374151;"><strong>Date:</strong> <span style="color: #111827;">${new Date(booking.date).toLocaleDateString()}</span></p>
            <p style="margin: 8px 0; color: #374151;"><strong>Time:</strong> <span style="color: #111827;">${booking.time}</span></p>
            <p style="margin: 8px 0; color: #374151;"><strong>Location:</strong> <span style="color: #111827;">${booking.tableLocation}</span></p>
          </div>
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
            If you have any questions, please contact our support.
          </p>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 14px; color: #6b7280; margin: 0;">QuickCafe &copy; ${new Date().getFullYear()}</p>
        </div>
      </div>
      `;

      await sendEmail({
        email: booking.user.email,
        subject: "Table Booking Cancelled ❌ - QuickCafe",
        html: emailHtml
      });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    res.status(200).json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};