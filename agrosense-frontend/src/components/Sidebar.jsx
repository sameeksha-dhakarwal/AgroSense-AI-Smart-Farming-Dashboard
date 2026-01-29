import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Sprout,
  Droplets,
  ScanSearch,
  ShoppingCart,
  LineChart,
  Map,
  Edit3,
  Mic,
} from "lucide-react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/fields", label: "My Fields", icon: Map },
  { to: "/soil-analysis", label: "Soil Analysis", icon: Sprout },
  { to: "/disease-scanner", label: "Disease Scanner", icon: ScanSearch },
  { to: "/irrigation", label: "Smart Irrigation", icon: Droplets },
  { to: "/price-forecast", label: "Price Forecast", icon: LineChart },
  { to: "/marketplace", label: "Marketplace", icon: ShoppingCart },
  { to: "/manual-entry", label: "Manual Entry", icon: Edit3 },
  { to: "/voice", label: "Voice Assistant", icon: Mic },
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 min-h-screen">
      {/* Logo */}
      <div className="p-5">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-green-600" />
          <div>
            <div className="font-bold leading-tight">AgroSense AI</div>
            <div className="text-xs text-gray-500">
              Smart Farming Dashboard
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-3 py-2 rounded-xl mb-1 transition",
                isActive
                  ? "bg-green-50 text-green-700"
                  : "text-gray-700 hover:bg-gray-50",
              ].join(" ")
            }
          >
            <item.icon size={18} />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Tip Box */}
      <div className="p-4 mt-6">
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
          <div className="text-sm font-semibold">Tip</div>
          <div className="text-xs text-gray-600 mt-1">
            Keep soil moisture between 60–70% for healthy growth.
          </div>
        </div>
      </div>
    </aside>
  );
}
