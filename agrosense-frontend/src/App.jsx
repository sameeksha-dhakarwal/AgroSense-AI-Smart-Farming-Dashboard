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
import Ecommerce from "./pages/Ecommerce";
import Checkout from "./pages/Checkout";
import ManualEntry from "./pages/ManualEntry";
import VoiceAssistant from "./pages/VoiceAssistant";

import CartPage from "./pages/CartPage";
import ProductDetails from "./pages/ProductDetails";

import DashboardLayout from "./layouts/DashboardLayout";

export default function App() {

  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/checkout" element={<Checkout />} />

      {/* Protected */}
      <Route element={<DashboardLayout />}>

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/fields" element={<Fields />} />
        <Route path="/soil-analysis" element={<SoilAnalysis />} />
        <Route path="/disease-scanner" element={<DiseaseScanner />} />
        <Route path="/irrigation" element={<Irrigation />} />
        <Route path="/price-forecast" element={<PriceForecast />} />

        <Route path="/cart" element={<CartPage />} />

        <Route path="/ecommerce" element={<Ecommerce />} />

        <Route path="/marketplace" element={<Marketplace />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/manual-entry" element={<ManualEntry />} />

        <Route path="/voice" element={<VoiceAssistant />} />

      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}