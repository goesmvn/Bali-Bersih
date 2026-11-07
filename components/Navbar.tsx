"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/panduan", label: "Panduan" },
  { href: "/lapor", label: "Lapor" },
  { href: "/laporan", label: "Laporan" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-green-100">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-1.5 font-bold text-green-700">
            <span className="text-xl">🌴</span>
            <span>Bali Bersih</span>
          </Link>
          <div className="flex items-center gap-1 overflow-x-auto">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    active
                      ? "bg-green-600 text-white"
                      : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
