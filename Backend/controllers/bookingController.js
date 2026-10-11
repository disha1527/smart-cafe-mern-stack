

const Booking = require("../models/Booking");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);




// =====================================
// Confirm Payment (Stripe Success)
// =====================================
exports.confirmPayment = async (req, res) => {
  try {
    const { bookingId, paymentIntentId } = req.body;

    if (!bookingId || !paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and Payment Intent ID required"
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // 🔒 Extra security: check booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action"
      });
    }

    booking.isPaid = true;
    booking.status = "Confirmed";
    booking.paymentIntentId = paymentIntentId;

    await booking.save();

    const user = await User.findById(req.user._id);

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #10b981; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Booking Confirmed ✅</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Dear <strong>${user.name}</strong>,</p>
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
            Thank you for choosing QuickCafe! We are delighted to confirm your reservation. Below are the details of your booking:
          </p>
          <div style="background-color: #f3f4f6; border-left: 4px solid #10b981; padding: 15px 20px; border-radius: 4px; margin-bottom: 25px;">
            <p style="margin: 8px 0; color: #374151;"><strong>Booking ID:</strong> <span style="color: #111827;">${booking._id}</span></p>
            <p style="margin: 8px 0; color: #374151;"><strong>Date:</strong> <span style="color: #111827;">${new Date(booking.date).toLocaleDateString()}</span></p>
            <p style="margin: 8px 0; color: #374151;"><strong>Time:</strong> <span style="color: #111827;">${booking.time}</span></p>
            <p style="margin: 8px 0; color: #374151;"><strong>Location:</strong> <span style="color: #111827;">${booking.tableLocation}</span></p>
          </div>
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
            We look forward to hosting you and providing a memorable experience!
          </p>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 14px; color: #6b7280; margin: 0;">QuickCafe &copy; ${new Date().getFullYear()}</p>
          <p style="font-size: 12px; color: #9ca3af; margin-top: 5px;">If you have any questions, please contact our support.</p>
        </div>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: "Booking Confirmed - QuickCafe",
      html: emailHtml
    });

    res.status(200).json({
      success: true,
      message: "Payment successful. Booking confirmed.",
      booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


// =====================================
// Get My Bookings
// =====================================
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// =====================================
// Cancel Booking + Refund Logic
// =====================================
// exports.cancelBooking = async (req, res) => {
//   try {
//     const { bookingId } = req.params;

//     const booking = await Booking.findById(bookingId);

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found"
//       });
//     }

//     // 🔒 Check ownership
//     if (booking.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: "Unauthorized action"
//       });
//     }

//     if (booking.status === "Cancelled") {
//       return res.status(400).json({
//         success: false,
//         message: "Booking already cancelled"
//       });
//     }

//     const bookingDateTime = new Date(booking.date);
//     const now = new Date();

//     const timeDiff = bookingDateTime - now;
//     const hoursDiff = timeDiff / (1000 * 60 * 60);

//     let refundAmount = 0;

//     if (hoursDiff >= 24) {
//       refundAmount = booking.bookingAmount; // Full refund
//     } else if (hoursDiff >= 6) {
//       refundAmount = booking.bookingAmount * 0.5; // 50% refund
//     } else {
//       refundAmount = 0; // No refund
//     }

//     booking.status = "Cancelled";
//     booking.refundAmount = refundAmount;

//     await booking.save();

//     res.status(200).json({
//       success: true,
//       message: "Booking cancelled successfully",
//       refundAmount,
//       booking
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // 🔒 Ownership check
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action"
      });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled"
      });
    }

    const bookingDateTime = new Date(booking.date);
    const now = new Date();

    const timeDiff = bookingDateTime - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    let refundAmount = 0;

    if (hoursDiff >= 24) {
      refundAmount = booking.bookingAmount;
    } else if (hoursDiff >= 6) {
      refundAmount = booking.bookingAmount * 0.5;
    } else {
      refundAmount = 0;
    }

    // 💳 REAL STRIPE REFUND
    if (refundAmount > 0 && booking.paymentIntentId) {
      await stripe.refunds.create({
        payment_intent: booking.paymentIntentId,
        amount: refundAmount * 100 // paise to cents
      });
    }

    booking.status = "Cancelled";
    booking.refundAmount = refundAmount;

    await booking.save();

    const user = await User.findById(req.user._id);

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #ef4444; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Booking Cancelled ❌</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Dear <strong>${user.name}</strong>,</p>
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
            We have received your request and your booking has been successfully cancelled.
          </p>
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px 20px; border-radius: 4px; margin-bottom: 25px;">
            <p style="margin: 8px 0; color: #374151;"><strong>Date:</strong> <span style="color: #111827;">${new Date(booking.date).toLocaleDateString()}</span></p>
            <p style="margin: 8px 0; color: #374151;"><strong>Time:</strong> <span style="color: #111827;">${booking.time}</span></p>
            <p style="margin: 8px 0; color: #374151;"><strong>Refund Amount:</strong> <span style="color: #111827;">₹${refundAmount}</span></p>
          </div>
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
            Your refund will be processed according to our cancellation policy. If you have any questions, feel free to contact us.
          </p>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 14px; color: #6b7280; margin: 0;">QuickCafe &copy; ${new Date().getFullYear()}</p>
        </div>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: "Booking Cancelled - QuickCafe",
      html: emailHtml
    });

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      refundAmount
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Create Stripe PaymentIntent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.bookingAmount * 100, // ₹ to paise
      currency: "inr",
      metadata: {
        bookingId: booking._id.toString()
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};






// Get Blocked Slots
exports.getBlockedSlots = async (req, res) => {
  try {
    const { date, tableLocation } = req.query;

    if (!date || !tableLocation) {
      return res.status(400).json({
        success: false,
        message: "Date and table location required"
      });
    }

    const bookings = await Booking.find({
      date: new Date(date),
      tableLocation: tableLocation,
      status: { $ne: "Cancelled" }
    });

    const blockedTimes = bookings.map(b => b.time);

    res.status(200).json({
      success: true,
      blockedTimes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { date, time, guests, tableLocation } = req.body;

    if (!tableLocation) {
      return res.status(400).json({
        success: false,
        message: "Please select a table location"
      });
    }

    // ✅ Count bookings for selected date, time and location
    const bookingCount = await Booking.countDocuments({
      date: new Date(date),
      time: time,
      tableLocation: tableLocation,
      status: { $ne: "Cancelled" }
    });

    // ❌ If table is already booked at that time
    if (bookingCount >= 1) {
      return res.status(400).json({
        success: false,
        message: `The ${tableLocation} is already booked at ${time} ❌. Please select another time or location.`
      });
    }

    // ✅ Create booking
    const booking = await Booking.create({
      user: req.user._id,
      date,
      time,
      guests,
      tableLocation,
      bookingAmount: 200
    });

    const io = req.app.get("io");
    if (io) {
      io.emit("booking_created", { date, time, tableLocation });
    }

    const user = await User.findById(req.user._id);

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f59e0b; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Booking Pending ⏳</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">Dear <strong>${user.name}</strong>,</p>
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
            We have successfully received your booking request at <strong>QuickCafe</strong>. Please note that your booking status is currently <strong>PENDING</strong>.
          </p>
          <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px 20px; border-radius: 4px; margin-bottom: 25px;">
            <p style="margin: 8px 0; color: #374151;"><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">PENDING</span></p>
            <p style="margin: 8px 0; color: #374151;"><strong>Date:</strong> <span style="color: #111827;">${new Date(date).toLocaleDateString()}</span></p>
            <p style="margin: 8px 0; color: #374151;"><strong>Time:</strong> <span style="color: #111827;">${time}</span></p>
            <p style="margin: 8px 0; color: #374151;"><strong>Guests:</strong> <span style="color: #111827;">${guests}</span></p>
            <p style="margin: 8px 0; color: #374151;"><strong>Location:</strong> <span style="color: #111827;">${tableLocation}</span></p>
          </div>
          <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
            We will review your request. You will receive a separate confirmation email once your booking is officially confirmed by the admin. Please complete any required payments in the application to secure your reservation.
          </p>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 14px; color: #6b7280; margin: 0;">QuickCafe &copy; ${new Date().getFullYear()}</p>
        </div>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: "Your Booking is Pending ⏳ - QuickCafe",
      html: emailHtml
    });

    res.json({
      success: true,
      message: "Booking Created ✅",
      booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};