const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const Room = require("./models/Room");

dotenv.config();

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {}

const run = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sree_raaga_resort";
  await mongoose.connect(uri);
  const rooms = await Room.find({});
  console.log("Current Rooms in Database:");
  console.log(JSON.stringify(rooms, null, 2));
  mongoose.connection.close();
};

run().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
