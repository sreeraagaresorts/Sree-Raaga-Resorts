const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  try {
    // Set public DNS servers (Google and Cloudflare) to resolve MongoDB SRV records
    // where local/router DNS resolvers often fail with ECONNREFUSED/timeout
    try {
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (dnsErr) {
      console.warn("Could not set custom DNS servers, using default OS resolver:", dnsErr.message);
    }

    console.log("Connecting to MongoDB at:", process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sree_raaga_resort");
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sree_raaga_resort");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;