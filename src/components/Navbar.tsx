"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Scroll } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "الرئيسية" },
  { href: "/characters", label: "الشخصيات" },
  { href: "/timeline", label: "الخط الزمني" },
  { href: "/map", label: "الخريطة" },
  { href: "/battles", label: "الحروب والمعارك" },
  { href: "/narratives", label: "الروايات التاريخية" },
  { href: "/time-machine", label: "آلة الزمن" },
  { href: "/alternate", label: "التاريخ البديل" },
  { href: "/live-history", label: "عِش التاريخ" },
  { href: "/about", label: "عن الموقع" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-[rgba(201,162,39,0.2)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <Scroll className="h-7 w-7 text-gold group-hover:text-gold-light transition-colors" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gold-gradient leading-tight">
                أرشيف التاريخ
              </span>
              <span className="text-[10px] text-muted tracking-wider uppercase hidden sm:block">
                History Archive
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm rounded-md transition-colors whitespace-nowrap",
                  pathname === item.href
                    ? "text-gold bg-[rgba(201,162,39,0.12)]"
                    : "text-foreground/80 hover:text-gold hover:bg-[rgba(201,162,39,0.08)]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search + Mobile menu */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="p-2 rounded-full hover:bg-[rgba(201,162,39,0.12)] text-foreground/80 hover:text-gold transition-colors"
              aria-label="بحث"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link
              href="/ask"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border border-[rgba(201,162,39,0.35)] text-gold hover:bg-[rgba(201,162,39,0.12)] transition-colors"
            >
              اسأل التاريخ
            </Link>
            <button
              type="button"
              className="lg:hidden p-2 rounded-md hover:bg-[rgba(201,162,39,0.12)] text-foreground/80"
              onClick={() => setOpen(!open)}
              aria-label="القائمة"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-[rgba(201,162,39,0.15)] glass-strong">
          <nav className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-base transition-colors",
                  pathname === item.href
                    ? "text-gold bg-[rgba(201,162,39,0.12)]"
                    : "text-foreground/90 hover:bg-[rgba(201,162,39,0.08)]"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/ask"
              onClick={() => setOpen(false)}
              className="mt-2 px-4 py-3 rounded-lg text-gold border border-[rgba(201,162,39,0.3)] text-center"
            >
              اسأل التاريخ
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
