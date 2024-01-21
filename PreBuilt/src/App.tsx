import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Camera from "./Camera";
import Navigation from "./Navigation";
import Basic from "./Basic";
import Interactivity from "./Interactivity";
import ClientButton from "./ClientButton";
import "./styles.css"; // Import the CSS file for styling

export default function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <div className="ui-container">
          {/* Links centered on top */}
          <div className="top-links">
            <Link to="/">Basic</Link>
            <Link to="/interactivity">Interactivity</Link>
            <Link to="/navigation">Navigation</Link>
            <Link to="/camera">Camera</Link>
          </div>
          
          {/* Routes centered in the middle */}
          <div className="middle-routes">
            <Routes>
              <Route path="/" element={<Basic />} />
              <Route path="/interactivity" element={<Interactivity />} />
              <Route path="/navigation" element={<Navigation />} />
              <Route path="/camera" element={<Camera />} />
            </Routes>
          </div>
          
          {/* Button centered at the bottom */}
          <div className="bottom-button">
            <ClientButton />
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}
