import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Camera from "./Camera";
import Navigation from "./Navigation";
import Basic from "./Basic";
import Interactivity from "./Interactivity";
import ClientButton from "./ClientButton";
import LogoImage from "./images/medifi_logo_new.png"; // Adjust the import path
import "./styles.css"; // Import the CSS file for styling

export default function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <div className="ui-container">
          {/* Logo in the top-left */}
          <div className="logo-container">
            <img src={LogoImage} alt="Logo" className="logo-image" />
          </div>

          {/* Links centered on top */}
          <div className="top-links">
            <Link to="/" className="nav-button">Basic</Link>
            <Link to="/interactivity" className="nav-button">Interactivity</Link>
            <Link to="/camera" className="nav-button">Camera</Link>
          </div>

          {/* Search bar in the top-right */}
          <div className="fake-search-bar top-right">Search...</div>

          {/* Sidebar on the bottom-left */}
          <div className="sidebar bottom-left">
              <Link to="/" className="sidebar-item highlighted">
                <strong>Home</strong>
              </Link>
              <Link to="/item2" className="sidebar-item">
              <strong>Navigation</strong>
              </Link>
              <Link to="/item3" className="sidebar-item">
              <strong>Department</strong>
              </Link>
              <Link to="/item4" className="sidebar-item">
              <strong>MDs & RNs</strong>
              </Link>
              <Link to="/item5" className="sidebar-item">
              <strong>Patients</strong>
              </Link>
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

          {/* Button title at the bottom */}
          {/* <div className="bottom-title">
          <h2>PATIENTS</h2>
          </div> */}

          {/* Button centered at the bottom */}
          <div className="bottom-button">
          <h2>PATIENTS</h2>
            <ClientButton />
          </div>

          

        </div>
      </BrowserRouter>
    </div>
  );
}
