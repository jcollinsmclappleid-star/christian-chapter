"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, LogOut, Archive, Image, Heart } from "lucide-react";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/applications", label: "Applications", icon: Users },
  { href: "/admin/profiles", label: "Profiles", icon: Image },
  { href: "/admin/matching", label: "Introductions", icon: Heart },
  { href: "/admin/closures", label: "Closures", icon: Archive },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-56 flex-shrink-0 bg-plum min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-ivory/10">
        <p className="font-serif text-ivory text-[1.1rem] tracking-tight">
          Mature Christian Dating
        </p>
        <p className="text-[10px] uppercase tracking-[0.25em] text-stone mt-0.5 font-sans">
          Admin
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <a
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13px] font-sans transition-colors ${
                active
                  ? "bg-ivory/15 text-ivory font-medium"
                  : "text-ivory/60 hover:bg-ivory/8 hover:text-ivory/90"
              }`}
            >
              <Icon size={15} className="flex-shrink-0" />
              {label}
            </a>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-5 border-t border-ivory/10 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 w-full text-left text-[13px] font-sans text-ivory/50 hover:text-ivory/80 transition-colors rounded-md"
        >
          <LogOut size={14} className="flex-shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
