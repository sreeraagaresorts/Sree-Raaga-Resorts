import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import  Navbar  from './ui/components/Navbar';
import  Footer  from './ui/components/Footer';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
      <Navbar />
    <App />
          <Footer />
  </BrowserRouter>
);