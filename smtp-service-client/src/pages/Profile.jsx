import React, { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useThemeStyles } from "../utils/useThemeStyles";
import { User, Mail, LayoutDashboard, LogOut, ShieldCheck, KeyRound, LockKeyhole, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import "./Profile.css";
import ApiKeys from "./ApiKeys";
import AppCredentials from "./AppCredentials";

function AccountDetails({ user, styles }) {
  const { background, border, foreground, primary, mutedForeground } = styles;
  return (
    <Card className="profile-panel">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div><CardTitle>Account details</CardTitle><CardDescription>Your identity and account status.</CardDescription></div>
          <ShieldCheck className="text-emerald-500" size={22} />
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <div className="profile-detail" style={{ backgroundColor: background.color, borderColor: border.color }}><div><User size={16} style={{ color: primary.color }} /><span>Full name</span></div><p style={{ color: foreground.color }}>{user.name || "—"}</p></div>
        <div className="profile-detail" style={{ backgroundColor: background.color, borderColor: border.color }}><div><Mail size={16} style={{ color: primary.color }} /><span>Email address</span></div><p className="break-all" style={{ color: foreground.color }}>{user.email || "—"}</p></div>
        <p className="sm:col-span-2 text-xs" style={{ color: mutedForeground.color }}>Your account is verified and ready to send.</p>
      </CardContent>
    </Card>
  );
}

export default function Profile() {
  const { user, loading, handleLogout } = useAuth();
  const styles = useThemeStyles();
  const { background, card, border, foreground, primary, primaryForeground, mutedForeground, secondary } = styles;
  const [activeSection, setActiveSection] = useState("account");

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: background.color }}><p className="animate-pulse text-sm font-medium" style={{ color: mutedForeground.color }}>Loading profile...</p></div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: background.color }}><p style={{ color: mutedForeground.color }}>You are not logged in.</p></div>;

  // Add a settings destination here; the navigation and selected panel are rendered from this registry.
  const sections = [
    { id: "account", label: "Account", description: "Personal details", icon: User, panel: <AccountDetails user={user} styles={styles} /> },
    { id: "api-keys", label: "API keys", description: "Access and usage", icon: KeyRound, panel: <section className="profile-embedded"><ApiKeys embedded /></section> },
    { id: "smtp-credentials", label: "SMTP credentials", description: "Sending identity", icon: LockKeyhole, panel: <section className="profile-embedded"><AppCredentials embedded /></section> },
  ];
  const currentSection = sections.find((section) => section.id === activeSection) || sections[0];

  return (
    <main className="profile-page min-h-screen px-4 py-8 md:px-6 md:py-10" style={{ backgroundColor: background.color, color: foreground.color }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[.18em] mb-2" style={{ color: mutedForeground.color }}>Workspace settings</p><h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: foreground.color }}>Profile & settings</h1><p className="mt-2 text-sm md:text-base" style={{ color: mutedForeground.color }}>Choose a workspace setting to view and manage it.</p></div>

        <div className="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-6 lg:items-start">
          <motion.aside initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="profile-sidebar rounded-2xl p-4" style={{ backgroundColor: card.color, border: `1px solid ${border.color}` }}>
            <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: secondary.color }}>
              <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center mb-4" style={{ backgroundColor: primary.color, color: primaryForeground.color }}>{user.profilePic ? <img src={user.profilePic} alt="User profile" className="w-full h-full object-cover" /> : <span className="text-xl font-bold">{user.name?.charAt(0)?.toUpperCase() || "U"}</span>}</div>
              <h2 className="font-bold truncate" style={{ color: foreground.color }}>{user.name}</h2><p className="text-xs mt-1 truncate" style={{ color: mutedForeground.color }}>{user.email}</p><div className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium" style={{ color: mutedForeground.color }}><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Verified account</div>
            </div>
            <nav aria-label="Profile settings" className="profile-options">
              <p className="profile-nav-label">SETTINGS</p>
              {sections.map(({ id, label, description, icon: Icon }) => <Button key={id} type="button" variant="ghost" aria-current={currentSection.id === id ? "page" : undefined} className={`profile-option ${currentSection.id === id ? "is-selected" : ""}`} onClick={() => setActiveSection(id)}><span className="profile-option-icon"><Icon size={16} /></span><span className="profile-option-copy"><span>{label}</span><small>{description}</small></span><ArrowUpRight size={14} className="profile-option-arrow" /></Button>)}
            </nav>
            <div className="profile-account-actions"><Link to="/dashboard"><LayoutDashboard size={16} />Dashboard</Link><Button type="button" variant="ghost" onClick={handleLogout}><LogOut size={16} />Sign out</Button></div>
          </motion.aside>

          <motion.div key={currentSection.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="min-w-0">
            <div className="profile-content-heading"><div><span className="profile-nav-label">WORKSPACE / SETTINGS</span><h2>{currentSection.label}</h2><p>{currentSection.description}</p></div></div>
            {currentSection.panel}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
