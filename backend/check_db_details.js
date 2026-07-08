const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Booking = require("./models/Booking");
const Room = require("./models/Room");

dotenv.config();

const run = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sree_raaga_resort";
  await mongoose.connect(uri);
  
  const rooms = await Room.find({});
  console.log("ROOMS IN DB:");
  rooms.forEach(r => {
    console.log(`  Room ID: ${r.id}, Name: ${r.name}, Price: ${r.price}, GST%: ${r.gst_percentage}`);
  });

  const bookings = await Booking.find({});
  console.log("BOOKINGS IN DB:");
  bookings.forEach(b => {
    console.log(`  Booking ID: ${b.id}, Room ID: ${b.room_id}, Subtotal: ${b.subtotal}, GST: ${b.gst_amount}, Total: ${b.total_price}`);
  });
  
  mongoose.connection.close();
};

run().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
