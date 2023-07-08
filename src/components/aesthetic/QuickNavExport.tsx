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
    <section className="mt-8 grid w-full grid-cols-2 gap-5 rounded-xl border border-neutral-300 p-5">
      <h2 className="col-span-2 w-full text-center text-lg font-bold">
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
