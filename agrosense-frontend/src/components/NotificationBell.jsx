import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";

export default function NotificationBell() {

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setNotifications(data);
      } else {
        setNotifications([]);
      }

    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  };

  useEffect(() => {
    if (token) fetchNotifications();
  }, [token]);

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length;

  const markAsRead = async (id) => {
    try {
      await fetch(
        `http://localhost:5000/api/notifications/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotifications();

    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  return (
    <div className="relative">

      {/* 🔔 Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center border rounded-xl px-3 py-2 hover:bg-gray-50"
      >
        <Bell size={18} />

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📩 Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white border rounded-xl shadow-lg p-4 z-50">

          <h4 className="font-semibold mb-3">
            Notifications
          </h4>

          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">
              No notifications
            </p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">

              {notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-3 rounded-lg text-sm ${
                    n.read
                      ? "bg-gray-100"
                      : "bg-green-50"
                  }`}
                >

                  <div className="flex justify-between gap-2">

                    <p className="flex-1">{n.message}</p>

                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n._id)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Mark read
                      </button>
                    )}

                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      )}

    </div>
  );
}