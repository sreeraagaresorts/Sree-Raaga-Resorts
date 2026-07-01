const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const Room = require("./models/Room");

dotenv.config();

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {}

const roomsData = [];

// Helper to generate rooms
const generateRooms = (prefix, name, count, price, category, area, beds, bathrooms, guests, description, image) => {
  for (let i = 1; i <= count; i++) {
    const roomNumber = `${prefix}-${100 + i}`;
    roomsData.push({
      roomNumber,
      name,
      price,
      category,
      area,
      beds,
      bathrooms,
      guests,
      description,
      image
    });
  }
};

// 1. High-end Executive: 24 rooms
generateRooms(
  "HE",
  "High-end Executive",
  24,
  4990,
  "Executive Rooms",
  "30 M²",
  "1 Double Bed",
  "1 Bathroom",
  "2 Guests",
  "Our High-end Executive Rooms offer a perfect blend of comfort and style, featuring modern amenities, cozy bedding, and a peaceful atmosphere for business or leisure travelers.",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800"
);

// 2. Executive with Balcony: 9 rooms
generateRooms(
  "EB",
  "Executive with Balcony",
  9,
  5490,
  "Executive Rooms",
  "35 M²",
  "1 Double Bed",
  "1 Bathroom",
  "2 Guests",
  "Our Executive Rooms with Balcony feature an attached private balcony with outdoor seating to enjoy fresh air and lush resort garden views.",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800"
);

// 3. Executive without Balcony: 7 rooms (making total Executive Rooms = 40)
generateRooms(
  "ENB",
  "Executive without Balcony",
  7,
  4590,
  "Executive Rooms",
  "28 M²",
  "1 Double Bed",
  "1 Bathroom",
  "2 Guests",
  "Our Executive Rooms without Balcony offer all premium indoor amenities, cozy bedding, and a comfortable, budget-friendly stay.",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800"
);

// 4. Luxury Villas (1 BHK Villas): 9 villas
generateRooms(
  "LV",
  "1 BHK Villa",
  9,
  6990,
  "Luxury Villas",
  "45 M²",
  "1 King Bed",
  "1 Bathroom",
  "2 Guests",
  "Indulge in our private 1 BHK Villas, offering a spacious living area, fully equipped kitchenette, and a private balcony overlooking the resort's lush gardens.",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800"
);

// 5. Compact Villas: 5 villas
generateRooms(
  "CV",
  "Compact Villa",
  5,
  5990,
  "Compact Villas",
  "38 M²",
  "1 Queen Bed",
  "1 Bathroom",
  "2 Guests",
  "Compact yet luxurious, these villas are perfect for couples looking for privacy and comfort, complete with premium fittings and beautiful outdoor patio seating.",
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800"
);

// 6. Duplex Villa: 1 villa (4-person occupancy)
generateRooms(
  "DV",
  "Duplex Villa",
  1,
  9990,
  "Duplex Villa",
  "75 M²",
  "2 Double Beds",
  "2 Bathrooms",
  "4 Guests",
  "Our signature Duplex Villa is the pinnacle of resort luxury, spanning two levels with separate living spaces, a private pool access, and premium butler service.",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800"
);

const run = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not found.");
    process.exit(1);
  }

  console.log("Connecting to DB...");
  await mongoose.connect(uri);
  console.log("Connected.");

  // Clear existing rooms (if any, although we checked and it's empty)
  await Room.deleteMany({});
  console.log("Cleared existing rooms.");

  console.log(`Seeding ${roomsData.length} rooms...`);
  for (const room of roomsData) {
    const created = new Room(room);
    await created.save();
    console.log(`Created room ${created.roomNumber} (${created.name})`);
  }

  console.log("Seeding rooms complete!");
  mongoose.connection.close();
};

run().catch(err => {
  console.error("Seeding rooms failed:", err);
  mongoose.connection.close();
});
