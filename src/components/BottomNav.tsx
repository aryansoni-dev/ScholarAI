"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Chat", icon: MessageSquare },
  { href: "/knowledge-base", label: "Library", icon: BookOpen },
  { href: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 h-16 glass-popover border-t border-white/[0.06] flex items-stretch safe-area-pb">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 gap-1 text-[10px] font-semibold tracking-wider uppercase",
              "transition-all duration-200 relative",
              active ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full nav-active-pip" />
            )}
            <Icon
              className={cn(
                "w-5 h-5 transition-all duration-200",
                active ? "scale-110 drop-shadow-[0_0_6px_rgba(208,188,255,0.6)]" : ""
              )}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
