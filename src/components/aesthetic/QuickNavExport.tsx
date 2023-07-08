import { Calendar, Shapes } from "lucide-react";
import NavigationCard from "../functional/NavigationCard";

const links = [
  {
    href: "export/activities",
    icon: <Calendar size={28} />,
    children: "Laporan Kegiatan",
  },
  {
    href: "export/tools",
    icon: <Shapes size={28} />,
    children: "Laporan Peralatan",
  },
];

export default function QuickNavExport() {
  return (
    <section className="grid w-full grid-cols-2 gap-5 p-5 mt-8 border rounded-xl border-neutral-300">
      <h2 className="w-full col-span-2 text-lg font-bold text-center">
        Silahkan pilih jenis laporan:
      </h2>
      {links.map((link) => (
        <NavigationCard key={link.href} href={link.href} icon={link.icon}>
          {link.children}
        </NavigationCard>
      ))}
    </section>
  );
}