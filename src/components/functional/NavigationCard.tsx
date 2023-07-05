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
      className="flex flex-col items-center justify-center w-full gap-2 p-5 transition border rounded-lg border-neutral-300 hover:bg-celtic-50 hover:bg-opacity-50 group hover:border-celtic-800 hover:ring-4 hover:ring-celtic-800 hover:ring-opacity-50"
    >
      <div className="p-5 text-black transition rounded-full w-fit bg-neutral-200 group-hover:bg-celtic-800 group-hover:text-white">
        {icon}
      </div>
      <span className="font-semibold">{children}</span>
    </Link>
  )
}
