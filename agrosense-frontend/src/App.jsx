import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Fields from "./pages/Fields";
import SoilAnalysis from "./pages/SoilAnalysis";
import DiseaseScanner from "./pages/DiseaseScanner";
import Irrigation from "./pages/Irrigation";
import PriceForecast from "./pages/PriceForecast";
import Marketplace from "./pages/Marketplace";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Dashboard routes (auth will be added in Step 2) */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/fields" element={<Fields />} />
      <Route path="/soil-analysis" element={<SoilAnalysis />} />
      <Route path="/disease-scanner" element={<DiseaseScanner />} />
      <Route path="/irrigation" element={<Irrigation />} />
      <Route path="/price-forecast" element={<PriceForecast />} />
      <Route path="/marketplace" element={<Marketplace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
