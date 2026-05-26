"use client";

import { useUser } from "@clerk/nextjs";
import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Calendar,
  FileText,
  Sparkles,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();

  const documents = useQuery(
    api.documents.listDocuments,
    user ? { userId: user.id } : "skip"
  );

  const chats = useQuery(
    api.chats.listChats,
    user ? { userId: user.id } : "skip"
  );

  const readyDocs = documents?.filter((d) => d.status === "ready").length ?? 0;
  const totalChats = chats?.length ?? 0;
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  const stats = [
    { label: "Documents Uploaded", value: readyDocs,   icon: FileText,       color: "text-primary",   bg: "bg-primary/10",    border: "border-primary/20"   },
    { label: "Chat Sessions",       value: totalChats,  icon: MessageSquare,  color: "text-secondary", bg: "bg-secondary/10",  border: "border-secondary/20" },
    { label: "Joined",              value: joinedDate,  icon: Calendar,       color: "text-tertiary",  bg: "bg-tertiary/10",   border: "border-tertiary/20"  },
  ];

  return (
    <div className="h-full overflow-y-auto bg-surface text-on-surface px-4 py-6 md:px-8 md:py-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ── Page Header ── */}
        <div className="animate-fade-up">
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">Profile</h1>
          <p className="text-on-surface-variant text-xs sm:text-sm mt-1">Manage your account and view your study stats</p>
        </div>

        {/* ── Profile Card ── */}
        <div
          className="glass-pane rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 animate-fade-up"
          style={{ animationDelay: "40ms" }}
        >
          <Avatar className="w-16 h-16 ring-2 ring-primary/30 shrink-0">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {user?.firstName?.[0] ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <h2 className="text-xl font-semibold text-on-surface">
                {user?.fullName ?? user?.username ?? "User"}
              </h2>
              <Badge className="bg-primary/10 text-primary border-primary/20 gap-1 text-xs font-semibold">
                <Sparkles className="w-2.5 h-2.5" /> Free Plan
              </Badge>
            </div>
            <p className="text-on-surface-variant text-sm mt-0.5">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon, color, bg, border }, i) => (
            <div
              key={label}
              className="glass-interactive rounded-xl p-5 flex flex-col gap-3 animate-fade-up"
              style={{ animationDelay: `${80 + i * 40}ms` }}
            >
              <div className={`w-9 h-9 rounded-xl ${bg} border ${border} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-on-surface">{value}</p>
                <p className="text-xs text-on-surface-variant mt-0.5 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Clerk Account Settings ── */}
        <div
          className="glass-pane rounded-2xl overflow-hidden animate-fade-up"
          style={{ animationDelay: "200ms" }}
        >
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h3 className="font-semibold text-on-surface">Account Settings</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">Update your name, email, password, and connected accounts</p>
          </div>
          <div className="p-4 sm:p-6">
            <UserProfile
              routing="hash"
              appearance={{ baseTheme: dark }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
