import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Sprout,
  ScanSearch,
  Droplets,
  LineChart,
  ShoppingCart,
  Edit3,
  Mic,
} from "lucide-react";

const navItems = [
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
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* ===== Logo ===== */}
      <div className="p-5 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-green-600 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <div className="font-bold leading-tight">
              AgroSense AI
            </div>
            <div className="text-xs text-gray-500">
              Smart Farming
            </div>
          </div>
        </div>
      </div>

      {/* ===== Navigation ===== */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition",
                isActive
                  ? "bg-green-50 text-green-700"
                  : "text-gray-700 hover:bg-gray-50",
              ].join(" ")
            }
          >
            <Icon
              size={18}
              className="shrink-0"
            />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ===== Tip Card ===== */}
      <div className="p-4">
        <div className="rounded-2xl bg-gray-50 border p-4">
          <div className="text-sm font-semibold">
            Tip
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Keep soil moisture between 60–70% for healthy
            growth.
          </div>
        </div>
      </div>
    </aside>
  );
}
