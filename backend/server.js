const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const allowedOrigins=[
  "http//localhost:5173",
  "http://uqi93mcr9lh88oflqkbrwihk.187.127.179.194.sslip.io"
]

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));



app.listen(process.env.PORT, () => {
  console.log("Server Running On Port 5000");
});