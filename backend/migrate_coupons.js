const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const Booking = require("./models/Booking");

dotenv.config();

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {}

const run = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sree_raaga_resort";
  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected!");

  const bookings = await Booking.find({ coupon_code: { $ne: null } });
  console.log(`Found ${bookings.length} bookings with coupon codes.`);

  let updatedCount = 0;
  for (const booking of bookings) {
    const original = booking.coupon_code;
    const uppercased = original.trim().toUpperCase();
    if (original !== uppercased) {
      booking.coupon_code = uppercased;
      await booking.save();
      console.log(`Updated Booking ID ${booking.id}: "${original}" -> "${uppercased}"`);
      updatedCount++;
    }
  }

  console.log(`Migration completed. Updated ${updatedCount} bookings.`);
  await mongoose.connection.close();
};

run().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
