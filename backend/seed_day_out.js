const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const Event = require("./models/Event");

dotenv.config();

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {}

const run = async () => {
  const uri = process.env.MONGO_URI;
  await mongoose.connect(uri);

  const dayOutEvent = {
    name: "Day Out Package",
    description: "A Premium Day-Out & Staycation Destination Near Bangalore. Escape the city's hustle and enjoy a perfect blend of relaxation, adventure, dining, and family entertainment. Package includes Welcome Drink, Lunch Buffet, High Tea, and access to all resort amenities including Rain Dance, Swimming Pool, and Adventure Activities.",
    sqft: "Resort Access",
    price: 1800,
    show_price: true,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200",
    category: "Day Out"
  };

  // Check if exists
  const existing = await Event.findOne({ name: dayOutEvent.name });
  if (existing) {
    console.log("Day Out Package already exists in the database. Updating...");
    existing.description = dayOutEvent.description;
    existing.price = dayOutEvent.price;
    existing.show_price = dayOutEvent.show_price;
    existing.image = dayOutEvent.image;
    existing.category = dayOutEvent.category;
    existing.sqft = dayOutEvent.sqft;
    await existing.save();
    console.log("Updated existing Day Out Package.");
  } else {
    console.log("Creating Day Out Package...");
    const created = new Event(dayOutEvent);
    await created.save();
    console.log(`Created Day Out Package with ID: ${created.id}`);
  }

  mongoose.connection.close();
};

run().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
