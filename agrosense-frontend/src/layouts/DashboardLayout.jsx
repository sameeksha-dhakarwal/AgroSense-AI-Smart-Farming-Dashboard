import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
  const location = useLocation();

  const isDiseaseScanner =
    location.pathname === "/disease-scanner";

  // 🔹 Only Disease Scanner needs layout here
  if (!isDiseaseScanner) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
