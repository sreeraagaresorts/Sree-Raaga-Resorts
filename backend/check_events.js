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
  const events = await Event.find({});
  console.log("Current Events in Database:");
  console.log(JSON.stringify(events, null, 2));
  mongoose.connection.close();
};

run().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
