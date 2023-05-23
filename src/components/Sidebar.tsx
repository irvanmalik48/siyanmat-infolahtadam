import { LayoutDashboard, Activity, Laptop, Printer, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

export default function Sidebar() {
  const location = useRouter();
  const session = useSession();

  const handleSignOut = async (e: any) => {
    e.preventDefault();
    await signOut();
  }

  return (
    <nav className="sticky top-0 hidden h-screen text-white md:block w-72 bg-tni-darker">
      <div className="relative w-full aspect-square bg-neutral-400">
        <img src="/placeholder_portrait.png" alt="User portrait" />
        <div className="absolute inset-x-0 bottom-0 px-5 py-3 bg-opacity-80 bg-tni-darker backdrop-blur-sm">
          <p className="text-sm font-semibold">
            Welcome back,
          </p>
          <p className="text-lg font-bold">
            {session.data?.user.name}
          </p>
        </div>
      </div>
      <div className="flex flex-col mt-8">
        <Link href="/dashboard" className={`px-5 py-3 flex flex-row items-center justify-start gap-5 text-lg font-bold transition ${location.asPath === "/dashboard" ? "bg-tni-accented hover:bg-tni-accented" : "hover:bg-tni-dark"}`}>
          <LayoutDashboard size={24} />
          <span>
            Dashboard
          </span>
        </Link>
        <Link href="/kegiatan" className={`px-5 py-3 flex flex-row items-center justify-start gap-5 text-lg font-bold transition ${location.asPath === "/kegiatan" ? "bg-tni-accented hover:bg-tni-accented" : "hover:bg-tni-dark"}`}>
          <Activity size={24} />
          <span>
            Kegiatan
          </span>
        </Link>
        <Link href="/peralatan" className={`px-5 py-3 flex flex-row items-center justify-start gap-5 text-lg font-bold transition ${location.asPath === "/peralatan" ? "bg-tni-accented hover:bg-tni-accented" : "hover:bg-tni-dark"}`}>
          <Laptop size={24} />
          <span>
            Peralatan
          </span>
        </Link>
        <Link href="/cetak" className={`px-5 py-3 flex flex-row items-center justify-start gap-5 text-lg font-bold transition ${location.asPath === "/cetak" ? "bg-tni-accented hover:bg-tni-accented" : "hover:bg-tni-dark"}`}>
          <Printer size={24} />
          <span>
            Cetak
          </span>
        </Link>
        <button className="flex flex-row items-center justify-start gap-5 px-5 py-3 text-lg font-bold transition hover:bg-tni-dark" onClick={handleSignOut}>
          <LogOut size={24} />
          <span>
            Logout
          </span>
        </button>
      </div>
    </nav>
  );
}