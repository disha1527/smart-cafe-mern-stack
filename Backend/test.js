require("dotenv").config();
const mongoose = require("mongoose");
const Booking = require("./models/Booking");

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  const blockedBookings = await Booking.find({
    date: new Date("2026-04-26"),
    tableLocation: "Window View",
    status: { $ne: "Cancelled" }
  });

  console.log("BLOCKED TIMES:", blockedBookings.map(b => b.time));
  
  process.exit();
}

test();
