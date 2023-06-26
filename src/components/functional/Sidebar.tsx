"use client";

import { useStaleWhileRevalidate } from "@/lib/swr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Home, UserCircle, LogOut, Shapes, Calendar, Printer, Users } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

interface SafeUser {
  id: string;
  username: string;
  name: string;
  image: string;
  role: string;
}

const links = [
  {
    href: "/",
    icon: <Home size={20} />,
    children: "Dashboard",
  },
  {
    href: "/activities",
    icon: <Calendar size={20} />,
    children: "Kegiatan",
  },
  {
    href: "/tools",
    icon: <Shapes size={20} />,
    children: "Peralatan",
  },
  {
    href: "/export",
    icon: <Printer size={20} />,
    children: "Cetak Laporan",
  },
  {
    href: "/users",
    icon: <Users size={20} />,
    children: "Pengguna",
  },
  {
    href: "/profile",
    icon: <UserCircle size={20} />,
    children: "Profil Saya",
  },
]

export default function Sidebar() {
  return (
    <aside className="sticky top-0 min-h-screen w-72 bg-celtic-800">
      <div className="flex flex-col w-full gap-3">
        <SidebarProfile />
        <SidebarNav />
      </div>
    </aside>
  );
}

function SidebarNav() {
  return (
    <nav className="flex flex-col w-full gap-2 px-3 text-white">
      {links.map((link) => (
        <SidebarNavLink key={link.href} type="link" href={link.href} icon={link.icon}>
          {link.children}
        </SidebarNavLink>
      ))}
      <SidebarNavLink type="button" icon={<LogOut size={20} />} onClick={async () => {
        await signOut();
      }}>
        Logout
      </SidebarNavLink>
    </nav>
  );
}

function SidebarNavLink({
  href,
  icon,
  type,
  onClick,
  children,
}: {
  href?: string;
  icon: React.ReactNode;
  type: "link" | "button";
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const currentLocation = usePathname();

  if (type === "button") {
    return (
      <button
        className="flex w-full items-center justify-start rounded-full px-5 py-2 transition hover:bg-white hover:bg-opacity-20 active:bg-opacity-[15%]"
      >
        {icon}
        <span className="ml-3 text-sm">{children}</span>
      </button>
    );
  }

  return (
    <Link
      href={href ?? "/"}
      className="flex w-full items-center justify-start rounded-full px-5 py-2 transition hover:bg-white hover:bg-opacity-20 active:bg-opacity-[15%]"
      style={{
        backgroundColor:
          currentLocation === href ? "rgba(255, 255, 255, 0.1)" : "transparent",
      }}
      onClick={onClick}
    >
      {icon}
      <span className="ml-3 text-sm">{children}</span>
    </Link>
  );
}

function SidebarProfile() {
  const { data: user } = useSession();
  const { data, error, isLoading } = useStaleWhileRevalidate<SafeUser>(
    `/api/users/${user?.user?.email}`
  );

  if (isLoading) return <SidebarProfileSkeleton />;
  if (error) return <SidebarProfileError />;

  return (
    <div className="relative w-full group">
      <img
        src={data?.image}
        alt="profile"
        className="z-0 object-cover w-full aspect-square"
      />
      <div className="absolute bottom-0 left-0 z-10 flex flex-col items-start justify-center w-full px-5 py-2 bg-opacity-50 bg-neutral-800 backdrop-blur-md">
        <p className="font-semibold text-white">Selamat datang,</p>
        <p className="text-lg font-bold text-white">{data?.name}!</p>
      </div>
    </div>
  );
}

function SidebarProfileError() {
  return (
    <div className="relative w-full">
      <img
        src="/placeholder_portrait.png"
        alt="profile"
        className="z-0 object-cover w-full aspect-square"
      />
      <div className="absolute bottom-0 left-0 z-10 flex flex-col items-start justify-center w-full px-5 py-2 bg-opacity-50 bg-neutral-800 backdrop-blur-md">
        <p className="font-semibold text-white">Please relogin</p>
        <p className="text-lg font-bold text-white">Unauthenticated!</p>
      </div>
    </div>
  );
}

function SidebarProfileSkeleton() {
  return (
    <div className="relative w-full">
      <div className="w-full aspect-square animate-pulse bg-neutral-300"></div>
      <div className="absolute bottom-0 left-0 z-10 flex flex-col items-start justify-center w-full gap-2 px-5 py-2 bg-opacity-50 bg-neutral-800 backdrop-blur-md">
        <div className="w-1/2 h-5 rounded-full animate-pulse bg-neutral-300" />
        <div className="w-full h-6 rounded-full animate-pulse bg-neutral-300" />
      </div>
    </div>
  );
}
