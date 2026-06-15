import React from "react";
import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home"; // adjust path if needed
import  Layout  from "./ui/components/Layout";
import About from "./ui/pages/About";
import Rooms from "./ui/pages/Rooms";
import RoomDetails from "./ui/pages/RoomDetails";
import Events from "./ui/pages/Events";
import Contact from "./ui/pages/Contact";
import Login from "./ui/UserReg/Login";
import Register from "./ui/UserReg/Register";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route path="/about" element={<About />} />
      <Route path="/rooms" element={<Rooms />} />
           <Route path="rooms/:id" element={<RoomDetails />} />
           <Route path="/events" element={<Events />} />
           <Route path="/contact" element={<Contact />} />
           <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default App;