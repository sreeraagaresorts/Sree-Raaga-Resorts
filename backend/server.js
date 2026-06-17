const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

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
app.use(mongoSanitize());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Rate Limiting to prevent brute force / DDoS
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    success: false,
    message: "Too many authentication requests, please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiters to auth & general endpoints
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/", generalLimiter);

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