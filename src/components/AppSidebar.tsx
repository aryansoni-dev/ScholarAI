"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import {
  MessageSquare,
  BookOpen,
  User,
  Brain,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Chat", icon: MessageSquare },
  { href: "/knowledge-base", label: "Knowledge Base", icon: BookOpen },
  { href: "/profile", label: "Profile", icon: User },
];

export default function AppSidebar({ className, onLinkClick }: { className?: string; onLinkClick?: () => void }) {
  const pathname = usePathname();
  const { user } = useUser();
  const upsertUser = useMutation(api.users.upsertUser);

  useEffect(() => {
    if (!user) return;
    upsertUser({
      clerkId: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? "",
      name: user.fullName ?? user.username ?? "User",
      imageUrl: user.imageUrl,
    });
  }, [user, upsertUser]);

  return (
    <aside
      className={cn(
        "flex flex-col w-64 h-full md:min-h-screen shrink-0 px-3 py-5",
        "bg-surface-container-low border-r border-white/[0.06]",
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between mb-7 px-2">
        <Link
          href="/dashboard"
          onClick={onLinkClick}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center shadow-lg shadow-primary/20 transition-transform duration-200 group-hover:scale-110">
            <Brain className="w-4 h-4 text-on-primary" />
          </div>
          <span className="font-bold text-on-surface text-lg tracking-tight">ScholarAI</span>
        </Link>
        {onLinkClick && (
          <button
            onClick={onLinkClick}
            className="md:hidden p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* New Chat CTA */}
      <Link
        href="/dashboard"
        onClick={onLinkClick}
        className={cn(
          "flex items-center gap-2 px-3 py-2.5 mb-5 rounded-xl text-sm font-medium",
          "btn-primary-glow text-white",
          "group"
        )}
      >
        <Sparkles className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
        New Chat
      </Link>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                "transition-all duration-200 relative group",
                active
                  ? "bg-primary/10 text-on-surface border border-primary/20"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-white/[0.04] border border-transparent"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full nav-active-pip" />
              )}
              <Icon
                className={cn(
                  "w-4 h-4 transition-all duration-200",
                  active ? "text-primary" : "group-hover:text-primary/70"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User footer */}
      <div className="glass-pane rounded-xl px-3 py-2.5 flex items-center gap-3 transition-all duration-200 hover:border-primary/20 cursor-pointer group">
        <UserButton
          appearance={{
            elements: { avatarBox: "w-8 h-8" },
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-on-surface truncate">
            {user?.fullName ?? user?.username ?? "User"}
          </p>
          <p className="text-xs text-on-surface-variant truncate">
            {user?.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>
    </aside>
  );
}
