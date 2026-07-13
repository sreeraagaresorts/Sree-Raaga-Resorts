const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Booking = require("./models/Booking");

dotenv.config();

const run = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sree_raaga_resort";
  await mongoose.connect(uri);
  
  // Find all bookings with status 'checked_out' where checked_in_at or checked_out_at is null
  const bookings = await Booking.find({
    status: "checked_out",
    $or: [
      { checked_in_at: null },
      { checked_out_at: null }
    ]
  });

  console.log(`Found ${bookings.length} checked-out bookings to migrate.`);

  let migratedCount = 0;
  for (const b of bookings) {
    const update = {};
    if (!b.checked_in_at) {
      const d = new Date(b.check_in);
      d.setHours(13, 0, 0, 0); // 1:00 PM standard
      update.checked_in_at = d;
    }
    if (!b.checked_out_at) {
      const d = new Date(b.check_out);
      d.setHours(12, 0, 0, 0); // 12:00 PM standard
      update.checked_out_at = d;
    }
    await Booking.updateOne({ _id: b._id }, { $set: update });
    migratedCount++;
  }

  console.log(`Successfully migrated ${migratedCount} bookings!`);
  mongoose.connection.close();
};

run().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
