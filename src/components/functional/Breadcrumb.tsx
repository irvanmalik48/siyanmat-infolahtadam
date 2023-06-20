"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";

export default function Breadcrumb() {
  const pathname = usePathname();

  // make sure to include the home route in the breadcrumb with the href '/' and Home icon
  const breadcrumbHref = pathname.split("/").map((_, i, arr) => {
    return "/" + arr.slice(1, i + 1).join("/");
  });

  return (
    <nav className="flex w-full items-center justify-start gap-3 px-5 py-2 font-semibold">
      {breadcrumbHref.map((href, i) => (
        <div className="contents" key={i}>
          <Link
            href={href}
            key={i}
            className="rounded-full px-2 py-1 text-xs text-black transition hover:bg-celtic-800 hover:bg-opacity-10"
          >
            {i === 0 ? (
              <Home size={16} />
            ) : (
              href.split("/").slice(-1)[0].charAt(0).toUpperCase() +
              href.split("/").slice(-1)[0].slice(1)
            )}
          </Link>
          <span className="text-black text-opacity-50">
            {i !== breadcrumbHref.length - 1 && "/"}
          </span>
        </div>
      ))}
    </nav>
  );
}
