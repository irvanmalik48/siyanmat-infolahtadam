import { Calendar, Shapes, Download, UserCircle } from "lucide-react";
import NavigationCard from "../functional/NavigationCard";

const links = [
  {
    href: "/activities",
    icon: <Calendar size={28} />,
    children: "Kegiatan",
  },
  {
    href: "/tools",
    icon: <Shapes size={28} />,
    children: "Peralatan",
  },
  {
    href: "/export",
    icon: <Download size={28} />,
    children: "Ekspor Laporan",
  },
  {
    href: "/profile",
    icon: <UserCircle size={28} />,
    children: "Profil Saya",
  },
];

export default function QuickNav() {
  return (
    <section className="mt-8 grid w-full grid-cols-2 gap-5 rounded-xl border border-neutral-300 p-5">
      <h2 className="col-span-2 w-full text-center text-lg font-bold">
        Silahkan pilih menu:
      </h2>
      {links.map((link) => (
        <NavigationCard key={link.href} href={link.href} icon={link.icon}>
          {link.children}
        </NavigationCard>
      ))}
    </section>
  );
}
