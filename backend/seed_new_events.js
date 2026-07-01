const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const Event = require("./models/Event");

dotenv.config();

// Custom DNS to prevent ECONNREFUSED
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {}

const newEvents = [
  {
    name: "Grand Banquet Hall (800 Capacity)",
    description: "Host your grand celebrations, large-scale conferences, or luxurious weddings at our Grand Banquet Hall, boasting a capacity of up to 800 guests. With elegant lighting, state-of-the-art sound systems, and customizable layouts, it's the perfect venue for milestone events.",
    sqft: "12,000 Sq Ft",
    price: 150000,
    show_price: false,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200",
    category: "Banquet Hall"
  },
  {
    name: "Landscaped Event Lawn (500 Capacity)",
    description: "Celebrate under the open sky in our beautifully manicured and spacious event lawn. Perfect for wedding receptions, corporate team building activities, and evening cocktail parties for up to 500 guests.",
    sqft: "15,000 Sq Ft",
    price: 100000,
    show_price: false,
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1200",
    category: "Outdoor Lawn"
  },
  {
    name: "Mini Banquet Hall",
    description: "An intimate and sophisticated space ideal for family gatherings, birthdays, corporate board meetings, or private dinners for up to 150 guests. Equipped with modern audio-visual technology and elegant seating.",
    sqft: "4,500 Sq Ft",
    price: 50000,
    show_price: false,
    image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=1200",
    category: "Banquet Hall"
  },
  {
    name: "Wedding & Reception Venues",
    description: "A collection of breathtaking indoor and outdoor venues specifically curated for your special day. From traditional ceremonies to modern receptions, our venues provide a fairytale setting with full catering and planning support.",
    sqft: "Variable Sizes",
    price: 250000,
    show_price: false,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200",
    category: "Weddings"
  },
  {
    name: "Community & Cultural Events",
    description: "Our versatile open spaces and amphitheatres are designed to host community festivals, art exhibitions, theatrical performances, and musical concerts, fostering cultural connection and celebrations.",
    sqft: "Outdoor Arena",
    price: 75000,
    show_price: false,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200",
    category: "Community"
  }
];

const run = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not found in environment variables.");
    process.exit(1);
  }

  console.log("Connecting to DB...");
  await mongoose.connect(uri);
  console.log("Connected.");

  for (const item of newEvents) {
    // Check if event already exists
    const existing = await Event.findOne({ name: item.name });
    if (existing) {
      console.log(`Event "${item.name}" already exists, skipping.`);
    } else {
      console.log(`Creating event: "${item.name}"`);
      const created = new Event(item);
      await created.save();
      console.log(`Created event "${item.name}" with ID: ${created.id}`);
    }
  }

  console.log("Done seeding events!");
  mongoose.connection.close();
};

run().catch(err => {
  console.error("Execution failed:", err);
  mongoose.connection.close();
});
