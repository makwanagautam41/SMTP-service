import React from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useThemeStyles } from "../utils/useThemeStyles";
import {
  User,
  Mail,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  KeyRound,
  LockKeyhole,
  ChevronRight,
} from "lucide-react";
import ApiKeys from "./ApiKeys";
import AppCredentials from "./AppCredentials";

const Profile = () => {
  const { user, loading, handleLogout } = useAuth();
  const { background, card, border, foreground, primary, primaryForeground, mutedForeground, secondary } = useThemeStyles();

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: background.color }}><p className="animate-pulse text-sm font-medium" style={{ color: mutedForeground.color }}>Loading profile...</p></div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: background.color }}><p style={{ color: mutedForeground.color }}>You are not logged in.</p></div>;

  const menuItems = [
    { label: "Account", description: "Personal details", href: "#account", icon: User },
    { label: "API keys", description: "Access and usage", href: "#api-keys", icon: KeyRound },
    { label: "SMTP credentials", description: "Sending identity", href: "#app-credentials", icon: LockKeyhole },
  ];

  return (
    <main className="min-h-screen px-4 py-8 md:px-6 md:py-10" style={{ backgroundColor: background.color, color: foreground.color }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[.18em] mb-2" style={{ color: primary.color }}>Workspace settings</p><h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: foreground.color }}>Profile & settings</h1><p className="mt-2 text-sm md:text-base" style={{ color: mutedForeground.color }}>Keep your account, sending identity, and access keys organized in one place.</p></div>

        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-6 lg:items-start">
          <motion.aside initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-24 rounded-2xl p-4" style={{ backgroundColor: card.color, border: `1px solid ${border.color}` }}>
            <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: secondary.color }}>
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center mb-4" style={{ backgroundColor: primary.color, color: primaryForeground.color }}>{user.profilePic ? <img src={user.profilePic} alt="User profile" className="w-full h-full object-cover" /> : <span className="text-xl font-bold">{user.name?.charAt(0)?.toUpperCase() || "U"}</span>}</div>
              <h2 className="font-bold truncate" style={{ color: foreground.color }}>{user.name}</h2><p className="text-xs mt-1 truncate" style={{ color: mutedForeground.color }}>{user.email}</p><div className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-emerald-600"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Verified account</div>
            </div>
            <nav aria-label="Profile sections" className="space-y-1">{menuItems.map(({ label, description, href, icon: Icon }) => <a key={href} href={href} className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-black/[.04] dark:hover:bg-white/[.05]"><span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${primary.color}14`, color: primary.color }}><Icon size={16} /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold" style={{ color: foreground.color }}>{label}</span><span className="block text-xs mt-0.5 truncate" style={{ color: mutedForeground.color }}>{description}</span></span><ChevronRight size={15} className="opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: foreground.color }} /></a>)}</nav>
            <div className="border-t mt-4 pt-4" style={{ borderColor: border.color }}><a href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium" style={{ color: mutedForeground.color }}><LayoutDashboard size={16} />Dashboard</a><button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left text-red-500"><LogOut size={16} />Sign out</button></div>
          </motion.aside>

          <div className="min-w-0 space-y-6">
            <motion.section id="account" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="scroll-mt-24 rounded-2xl p-5 md:p-6" style={{ backgroundColor: card.color, border: `1px solid ${border.color}` }}>
              <div className="flex items-start justify-between gap-4 mb-6"><div><h2 className="text-xl font-bold" style={{ color: foreground.color }}>Account details</h2><p className="text-sm mt-1" style={{ color: mutedForeground.color }}>Your identity and account status.</p></div><ShieldCheck className="text-emerald-500" size={22} /></div>
              <div className="grid sm:grid-cols-2 gap-3"><div className="p-4 rounded-xl" style={{ backgroundColor: background.color, border: `1px solid ${border.color}` }}><div className="flex items-center gap-2 mb-2"><User size={16} style={{ color: primary.color }} /><span className="text-xs font-bold uppercase tracking-wide" style={{ color: mutedForeground.color }}>Full name</span></div><p className="text-sm font-semibold" style={{ color: foreground.color }}>{user.name}</p></div><div className="p-4 rounded-xl" style={{ backgroundColor: background.color, border: `1px solid ${border.color}` }}><div className="flex items-center gap-2 mb-2"><Mail size={16} style={{ color: primary.color }} /><span className="text-xs font-bold uppercase tracking-wide" style={{ color: mutedForeground.color }}>Email address</span></div><p className="text-sm font-semibold break-all" style={{ color: foreground.color }}>{user.email}</p></div></div>
            </motion.section>
            <section id="api-keys" className="scroll-mt-24 rounded-2xl p-2 md:p-3" style={{ backgroundColor: card.color, border: `1px solid ${border.color}` }}><ApiKeys embedded /></section>
            <section id="app-credentials" className="scroll-mt-24 rounded-2xl p-2 md:p-3" style={{ backgroundColor: card.color, border: `1px solid ${border.color}` }}><AppCredentials embedded /></section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
