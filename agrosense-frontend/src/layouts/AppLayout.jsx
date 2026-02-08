import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1">
        <Topbar />
        <main className="p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
