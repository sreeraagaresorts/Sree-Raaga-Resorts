const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const mongoSanitize = require("./middleware/mongoSanitize");

dotenv.config();

const connectDB = require("./config/db");
connectDB();

const app = express();

// Secure HTTP headers - Allow cross-origin resources so frontend can load upload images
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Prevent NoSQL Injection by sanitizing user-supplied data
app.use(mongoSanitize);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);



app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/settings", require("./routes/settingsRoutes"));
app.use("/api/dishes", require("./routes/dishRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));



app.listen(process.env.PORT, () => {
  console.log("Server Running On Port 5000");
});