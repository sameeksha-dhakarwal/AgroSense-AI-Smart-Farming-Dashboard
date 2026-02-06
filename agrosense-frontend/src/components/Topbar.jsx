import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";
import { getActiveField, setActiveField } from "../utils/activeField";
import { authApi } from "../api";

export default function Topbar() {
  const [user, setUser] = useState(null);
  const [fields, setFields] = useState([]);
  const [active, setActive] = useState(getActiveField());
  const [fieldOpen, setFieldOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getUserFromToken());
    authApi("/api/fields").then(setFields);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setFieldOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const selectField = (field) => {
    setActiveField(field);
    setActive(field);
    setFieldOpen(false);
    window.dispatchEvent(new Event("active-field-changed"));
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between p-5 bg-white border-b">
      {/* Left */}
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <p className="text-xs text-gray-500">
          Real-time insights for smarter farming decisions
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4 relative" ref={ref}>
        {/* Manage Fields */}
        <button
          onClick={() => setFieldOpen(!fieldOpen)}
          className="flex items-center gap-2 border rounded-xl px-3 py-2 text-sm"
        >
          {active ? active.name : "Select Field"}
          <ChevronDown size={16} />
        </button>

        {fieldOpen && (
          <div className="absolute right-32 top-12 bg-white border rounded-xl shadow-md w-48 z-50">
            {fields.map((f) => (
              <button
                key={f._id}
                onClick={() => selectField(f)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-green-50
                  ${active?._id === f._id ? "bg-green-100" : ""}
                `}
              >
                {f.name}
              </button>
            ))}
          </div>
        )}

        {/* Profile */}
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="h-9 w-9 rounded-full bg-green-600 text-white grid place-items-center font-semibold"
        >
          {user?.name?.[0]?.toUpperCase() || "U"}
        </button>

        {profileOpen && (
          <div className="absolute right-0 top-12 bg-white border rounded-xl shadow-md w-44">
            <button
              onClick={() => navigate("/change-password")}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
            >
              Change Password
            </button>
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
