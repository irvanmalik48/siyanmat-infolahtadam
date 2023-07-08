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
  }
];

export default function QuickNav() {
  return (
    <section className="grid w-full grid-cols-2 gap-5 p-5 mt-8 border rounded-xl border-neutral-300">
      <h2 className="w-full col-span-2 text-lg font-bold text-center">
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