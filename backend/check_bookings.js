const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Booking = require("./models/Booking");
const Room = require("./models/Room");

dotenv.config();

const run = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sree_raaga_resort";
  await mongoose.connect(uri);
  const bookings = await Booking.find({}).sort({ id: -1 });
  console.log("LAST 5 BOOKINGS:");
  for (let i = 0; i < Math.min(5, bookings.length); i++) {
    const b = bookings[i];
    const room = await Room.findOne({ id: b.room_id });
    console.log(`Booking ID: ${b.id}`);
    console.log(`  Room ID: ${b.room_id} (${room ? room.name : "UNKNOWN"})`);
    console.log(`  Room GST %: ${room ? room.gst_percentage : "N/A"}`);
    console.log(`  Booking room_gst_percentage: ${b.room_gst_percentage}`);
    console.log(`  Subtotal: ${b.subtotal}, GST: ${b.gst_amount}, Total: ${b.total_price}`);
    console.log(JSON.stringify(b.toObject(), null, 2));
  }
  mongoose.connection.close();
};

run().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
