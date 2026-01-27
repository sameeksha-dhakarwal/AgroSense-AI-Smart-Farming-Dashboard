import React from "react";
import { Mic, Bell, Map } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white border-b border-gray-200">
      
      {/* Left */}
      <div>
        <div className="text-lg font-bold">Dashboard</div>
        <div className="text-xs text-gray-500">
          Real-time insights for smarter farming decisions
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-3">
        
        {/* Active Field Selector (Step 3G) */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white">
          <Map size={16} className="text-gray-500" />
          <select className="outline-none text-sm bg-transparent">
            <option>North Farm</option>
            <option>South Field</option>
            <option>East Plot</option>
          </select>
        </div>

        {/* Language Selector */}
        <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white">
          <option>English</option>
          <option>తెలుగు (Telugu)</option>
          <option>हिन्दी (Hindi)</option>
        </select>

        {/* Notifications */}
        <button className="border border-gray-200 rounded-xl p-2 hover:bg-gray-50">
          <Bell size={18} />
        </button>

        {/* Voice Assistant */}
        <button className="border border-gray-200 rounded-xl p-2 hover:bg-gray-50">
          <Mic size={18} />
        </button>

        {/* User Avatar */}
        <div
          className="h-9 w-9 rounded-full bg-green-100 border border-green-200"
          title="User"
        />
      </div>
    </header>
  );
}
