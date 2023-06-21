import { Calendar, Shapes, UserCircle } from "lucide-react";
import NavigationCard from "../functional/NavigationCard";

const links = [
  {
    href: "/activities",
    icon: <Calendar size={28} />,
    children: "Atur Kegiatan",
  },
  {
    href: "/tools",
    icon: <Shapes size={28} />,
    children: "Atur Peralatan",
  },
  {
    href: "/profile",
    icon: <UserCircle size={28} />,
    children: "Atur Profil Saya",
  }
];

export default function QuickNav() {
  return (
    <section className="grid w-full grid-cols-3 gap-5 mt-8">
      {links.map((link) => (
        <NavigationCard key={link.href} href={link.href} icon={link.icon}>
          {link.children}
        </NavigationCard>
      ))}
    </section>
  );
}