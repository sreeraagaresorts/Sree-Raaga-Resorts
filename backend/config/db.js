const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  try {
    // Set public DNS servers (Google and Cloudflare) to resolve MongoDB SRV records
    // where local/router DNS resolvers often fail with ECONNREFUSED/timeout
    try {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (dnsErr) {
      console.warn("Could not set custom DNS servers, using default OS resolver:", dnsErr.message);
    }

    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sree_raaga_resort");
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Auto-confirm existing pending bookings on startup
    try {
      const Booking = require("../models/Booking");
      const Room = require("../models/Room");
      
      const pendingBookings = await Booking.find({ status: "pending" });
      if (pendingBookings.length > 0) {
        console.log(`[Migration] Found ${pendingBookings.length} pending bookings. Auto-confirming them...`);
        for (const booking of pendingBookings) {
          booking.status = "confirmed";
          await booking.save();
          
          if (booking.room_number) {
            const room = await Room.findOne({ id: booking.room_id });
            if (room) {
              const unit = room.roomStatuses.find(u => u.roomNumber === booking.room_number);
              if (unit) {
                unit.status = "Reserved";
                await room.save();
              }
            }
          }
        }
        console.log("[Migration] Successfully confirmed all pending bookings.");
      }
    } catch (migError) {
      console.error("[Migration Error] Failed to auto-confirm pending bookings:", migError);
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;