import { LayoutDashboard, Activity, Laptop, Printer, LogOut } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 h-screen text-white w-72 bg-tni-darker">
      <div className="relative w-full aspect-square bg-neutral-400">
        <img src="/placeholder_portrait.png" alt="User portrait" />
        <div className="absolute inset-x-0 bottom-0 px-5 py-3 bg-opacity-80 bg-tni-darker backdrop-blur-sm">
          <p className="text-sm font-semibold">
            Welcome back,
          </p>
          <p className="text-lg font-bold">
            Administrator
          </p>
        </div>
      </div>
      <div className="flex flex-col mt-8">
        <Link to="/" className={`px-5 py-3 flex flex-row items-center justify-start gap-5 text-lg font-bold transition ${location.pathname === "/" ? "bg-tni-accented hover:bg-tni-accented" : "hover:bg-tni-dark"}`}>
          <LayoutDashboard size={24} />
          <span>
            Dashboard
          </span>
        </Link>
        <Link to="/kegiatan" className={`px-5 py-3 flex flex-row items-center justify-start gap-5 text-lg font-bold transition ${location.pathname === "/kegiatan" ? "bg-tni-accented hover:bg-tni-accented" : "hover:bg-tni-dark"}`}>
          <Activity size={24} />
          <span>
            Kegiatan
          </span>
        </Link>
        <Link to="/peralatan" className={`px-5 py-3 flex flex-row items-center justify-start gap-5 text-lg font-bold transition ${location.pathname === "/peralatan" ? "bg-tni-accented hover:bg-tni-accented" : "hover:bg-tni-dark"}`}>
          <Laptop size={24} />
          <span>
            Peralatan
          </span>
        </Link>
        <Link to="/cetak" className={`px-5 py-3 flex flex-row items-center justify-start gap-5 text-lg font-bold transition ${location.pathname === "/cetak" ? "bg-tni-accented hover:bg-tni-accented" : "hover:bg-tni-dark"}`}>
          <Printer size={24} />
          <span>
            Cetak
          </span>
        </Link>
        <Link to="/logout" className="flex flex-row items-center justify-start gap-5 px-5 py-3 text-lg font-bold transition hover:bg-tni-dark">
          <LogOut size={24} />
          <span>
            Logout
          </span>
        </Link>
      </div>
    </nav>
  );
}