import React, { useEffect, useState } from "react";
import { Mic, Bell, Map } from "lucide-react";
import { authApi } from "../api";
import { setActiveField, getActiveField } from "../utils/activeField";

export default function Topbar() {
  const [fields, setFields] = useState([]);
  const [active, setActive] = useState(getActiveField()?._id || "");

  useEffect(() => {
    authApi("/api/fields").then((res) => {
      if (Array.isArray(res) && res.length > 0) {
        setFields(res);
        if (!getActiveField()) {
          setActiveField(res[0]);
          setActive(res[0]._id);
        }
      }
    });
  }, []);

  const changeField = (id) => {
    const field = fields.find((f) => f._id === id);
    setActiveField(field);
    setActive(id);
    window.location.reload(); // refresh dashboard data
  };

  return (
    <header className="flex items-center justify-between gap-4 p-5 bg-white border-b">
      <div>
        <div className="text-lg font-bold">Dashboard</div>
        <div className="text-xs text-gray-500">
          Real-time insights for smarter farming decisions
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Field Selector */}
        <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
          <Map size={16} />
          <select
            className="text-sm outline-none"
            value={active}
            onChange={(e) => changeField(e.target.value)}
          >
            {fields.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <select className="border rounded-xl px-3 py-2 text-sm">
          <option>English</option>
          <option>తెలుగు</option>
        </select>

        <button className="border rounded-xl p-2">
          <Bell size={18} />
        </button>
        <button className="border rounded-xl p-2">
          <Mic size={18} />
        </button>

        <div className="h-9 w-9 rounded-full bg-green-100" />
      </div>
    </header>
  );
}
