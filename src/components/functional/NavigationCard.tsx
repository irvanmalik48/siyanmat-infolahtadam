import Link from "next/link";

interface Props {
  href?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export default function NavigationCard({ href, icon, children }: Props) {
  return (
    <Link
      href={href ?? "#"}
      className="group flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-neutral-300 p-5 transition hover:border-celtic-800 hover:bg-celtic-50 hover:bg-opacity-50 hover:ring-4 hover:ring-celtic-800 hover:ring-opacity-50"
    >
      <div className="w-fit rounded-full bg-neutral-200 p-5 text-black transition group-hover:bg-celtic-800 group-hover:text-white">
        {icon}
      </div>
      <span className="font-semibold">{children}</span>
    </Link>
  );
}
