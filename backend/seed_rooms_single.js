const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const Room = require("./models/Room");

dotenv.config();

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {}

const generateStatuses = (prefix, count) => {
  const statuses = [];
  for (let i = 1; i <= count; i++) {
    const num = 100 + i;
    statuses.push({
      roomNumber: `${prefix}-${num}`,
      status: "Available"
    });
  }
  return statuses;
};

const roomsData = [
  {
    roomNumber: "40",
    name: "Executive Rooms",
    price: 4990,
    category: "Executive Rooms",
    totalRooms: 40,
    roomStatuses: generateStatuses("HE", 40),
    area: "30 M²",
    beds: "1 Double Bed",
    bathrooms: "1 Bathroom",
    guests: "2 Guests",
    description: "Our Executive Rooms offer a perfect blend of comfort and style, featuring modern amenities, cozy bedding, and a peaceful atmosphere for business or leisure travelers.",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800"
  },
  {
    roomNumber: "9",
    name: "1 BHK Villas",
    price: 6990,
    category: "Luxury Villas",
    totalRooms: 9,
    roomStatuses: generateStatuses("LV", 9),
    area: "45 M²",
    beds: "1 King Bed",
    bathrooms: "1 Bathroom",
    guests: "2 Guests",
    description: "Indulge in our private 1 BHK Villas, offering a spacious living area, fully equipped kitchenette, and a private balcony overlooking the resort's lush gardens.",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800"
  },
  {
    roomNumber: "5",
    name: "Compact Villas",
    price: 5990,
    category: "Compact Villas",
    totalRooms: 5,
    roomStatuses: generateStatuses("CV", 5),
    area: "38 M²",
    beds: "1 Queen Bed",
    bathrooms: "1 Bathroom",
    guests: "2 Guests",
    description: "Compact yet luxurious, these villas are perfect for couples looking for privacy and comfort, complete with premium fittings and beautiful outdoor patio seating.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800"
  },
  {
    roomNumber: "1",
    name: "Duplex Villa",
    price: 9990,
    category: "Duplex Villa",
    totalRooms: 1,
    roomStatuses: [
      { roomNumber: "DV-401", status: "Available" }
    ],
    area: "75 M²",
    beds: "2 Double Beds",
    bathrooms: "2 Bathrooms",
    guests: "4 Guests",
    description: "Our signature Duplex Villa is the pinnacle of resort luxury, spanning two levels with separate living spaces, a private pool access, and premium butler service.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800"
  }
];

const run = async () => {
  const uri = process.env.MONGO_URI;
  await mongoose.connect(uri);
  await Room.deleteMany({});
  console.log("Cleared existing rooms.");

  for (const room of roomsData) {
    const created = new Room(room);
    await created.save();
    console.log(`Created category: ${created.name} (Total: ${created.totalRooms})`);
  }

  console.log("Completed seeding room categories!");
  mongoose.connection.close();
};

run().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
