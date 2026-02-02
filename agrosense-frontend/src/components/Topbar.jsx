import React, { useState } from "react";
import { Bell, LogOut, Key } from "lucide-react";
import { getUser, logout } from "../utils/auth";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const user = getUser();
  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      {/* Left */}
      <div>
        <div className="text-lg font-bold">Dashboard</div>
        <div className="text-xs text-gray-500">
          Real-time insights for smarter farming decisions
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 relative">
        <button className="border rounded-xl p-2 hover:bg-gray-50">
          <Bell size={18} />
        </button>

        {/* Avatar */}
        <button
          onClick={() => setOpen(!open)}
          className="h-9 w-9 rounded-full bg-green-600 text-white font-semibold flex items-center justify-center"
        >
          {firstName[0]}
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-12 w-48 bg-white border rounded-xl shadow-md z-50">
            <div className="px-4 py-3 border-b">
              <div className="text-sm font-semibold">
                {user?.name}
              </div>
              <div className="text-xs text-gray-500">
                {user?.email}
              </div>
            </div>

            <button
              className="w-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
              onClick={() =>
                alert("Change password feature next")
              }
            >
              <Key size={16} />
              Change Password
            </button>

            <button
              className="w-full px-4 py-2 text-sm flex items-center gap-2 text-red-600 hover:bg-gray-50"
              onClick={logout}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
