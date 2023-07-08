"use client";

import { useStaleWhileRevalidate } from "@/lib/swr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, UserCircle, Shapes, Calendar, Download } from "lucide-react";
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
    children: "Home",
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
    icon: <Download size={20} />,
    children: "Ekspor",
  },
  {
    href: "/profile",
    icon: <UserCircle size={20} />,
    children: "Profil Saya",
  },
];

export default function Sidebar() {
  return (
    <aside className="sticky top-0 min-h-screen w-72 bg-celtic-800">
      <div className="flex w-full flex-col gap-3">
        <SidebarProfile />
        <SidebarNav />
      </div>
    </aside>
  );
}

function SidebarNav() {
  const router = useRouter();

  return (
    <nav className="flex w-full flex-col gap-2 px-3 text-white">
      {links.map((link) => (
        <SidebarNavLink
          key={link.href}
          type="link"
          href={link.href}
          icon={link.icon}
        >
          {link.children}
        </SidebarNavLink>
      ))}
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
      <button className="flex w-full items-center justify-start rounded-full px-5 py-2 transition hover:bg-white hover:bg-opacity-20 active:bg-opacity-[15%]">
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
    <div className="group relative w-full">
      <img
        src={data?.image}
        alt="profile"
        className="z-0 aspect-square w-full object-cover"
      />
      <div className="absolute bottom-0 left-0 z-10 flex w-full flex-col items-start justify-center bg-neutral-800 bg-opacity-50 px-5 py-2 backdrop-blur-md">
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
        className="z-0 aspect-square w-full object-cover"
      />
      <div className="absolute bottom-0 left-0 z-10 flex w-full flex-col items-start justify-center bg-neutral-800 bg-opacity-50 px-5 py-2 backdrop-blur-md">
        <p className="font-semibold text-white">Please relogin</p>
        <p className="text-lg font-bold text-white">Unauthenticated!</p>
      </div>
    </div>
  );
}

function SidebarProfileSkeleton() {
  return (
    <div className="relative w-full">
      <div className="aspect-square w-full animate-pulse bg-neutral-300"></div>
      <div className="absolute bottom-0 left-0 z-10 flex w-full flex-col items-start justify-center gap-2 bg-neutral-800 bg-opacity-50 px-5 py-2 backdrop-blur-md">
        <div className="h-5 w-1/2 animate-pulse rounded-full bg-neutral-300" />
        <div className="h-6 w-full animate-pulse rounded-full bg-neutral-300" />
      </div>
    </div>
  );
}
