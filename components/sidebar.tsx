"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
  Layers,
  Zap,
  Newspaper,
  Images,
  Map,
  ShieldCheck,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useSidebar } from "./sidebar-provider";

const navItems = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Profil", href: "/profil", icon: Users },
  { label: "Struktur", href: "/struktur", icon: Layers },
  { label: "Potensi", href: "/potensi", icon: Zap },
  { label: "Berita", href: "/berita", icon: Newspaper },
  { label: "Galeri", href: "/galeri", icon: Images },
  { label: "Peta", href: "/peta", icon: Map },
];

export function Sidebar() {
  const { isExpanded, setIsExpanded, isMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out z-40 flex flex-col ${
          isExpanded ? "w-64" : "w-20"
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          {isExpanded ? (
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-sidebar-foreground"
            >
              <Image
                src="/minahasa.png"
                alt="Logo Kabupaten Minahasa"
                width={50}
                height={50}
                className="shrink-0 rounded bg-white p-1 ring-1 ring-black/5 dark:ring-white/10" // opsional: bingkai halus
                priority
              />
              <span className="text-sm">Kelurahan Sendangan</span>
            </Link>
          ) : (
            <Link href="/" className="mx-auto block">
              <Image
                src="/minahasa.png"
                alt="Logo Kabupaten Minahasa"
                width={28}
                height={28}
                className="shrink-0 rounded bg-white p-1 ring-1 ring-black/5 dark:ring-white/10"
                priority
              />
            </Link>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-hide">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:translate-x-1"
                  }`}
                  title={!isExpanded ? item.label : ""}
                >
                  <Icon
                    size={20}
                    className={`shrink-0 transition-transform ${
                      !isActive && "group-hover:scale-110"
                    }`}
                  />
                  {isExpanded && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                  {isActive && isExpanded && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary-foreground animate-pulse-soft" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-sidebar-border p-2">
          <Link
            href="/admin/login"
            className="group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent/10 hover:translate-x-1 mb-2"
            title={!isExpanded ? "Admin Login" : ""}
          >
            <ShieldCheck
              size={20}
              className="shrink-0 group-hover:scale-110 transition-transform"
            />
            {isExpanded && (
              <span className="text-sm font-medium">Admin Login</span>
            )}
          </Link>
        </div>

        <div className="border-t border-sidebar-border p-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center py-3 rounded-lg hover:bg-sidebar-accent/10 transition-colors text-sidebar-foreground"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
