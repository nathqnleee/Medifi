import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Camera from "./Camera";
import Navigation from "./Navigation";
import Basic from "./Basic";
import Interactivity from "./Interactivity";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", gap: "12px" }}>
        Examples:
        <Link to="/">Basic</Link>
        <Link to="/interactivity">Interactivity</Link>
        <Link to="/navigation">Navigation</Link>
        <Link to="/camera">Camera</Link>
      </div>
      <Routes>
        <Route path="/" element={<Basic />} />
        <Route path="/interactivity" element={<Interactivity />} />
        <Route path="/navigation" element={<Navigation />} />
        <Route path="/camera" element={<Camera />} />
      </Routes>
    </BrowserRouter>
  );
}
