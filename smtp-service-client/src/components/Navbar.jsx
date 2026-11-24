import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Command, LogOut, Menu, Moon, Search, Sun } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";

const links = [
  { name: "Docs", href: "/docs" },
  { name: "Templates", href: "/email-template" },
  { name: "Quick start", href: "/quick-start" },
];

export default function Navbar() {
  const { user, handleLogout } = useAuth();
  const { theme, toggleTheme, setIsSearchOpen } = useTheme();
  const location = useLocation();
  const showSearch = location.pathname === "/docs";

  return (
    <header className="site-header">
      <div className="site-nav shell">
        <Link to="/" className="brand-lockup" aria-label="SMTPLite home">
          <span className="brand-mark">S<span>.</span></span>
          <span className="brand-name">smtp<span>lite</span></span>
        </Link>

        <NavigationMenu className="desktop-links">
          <NavigationMenuList>
            {links.map((link) => (
              <NavigationMenuItem key={link.href}>
                <Link className={`nav-link ${location.pathname === link.href ? "is-active" : ""}`} to={link.href}>{link.name}</Link>
              </NavigationMenuItem>
            ))}
            {user && <NavigationMenuItem><Link className={`nav-link ${location.pathname === "/dashboard" ? "is-active" : ""}`} to="/dashboard">Dashboard</Link></NavigationMenuItem>}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="nav-actions">
          {showSearch && <Button variant="outline" size="sm" className="search-trigger" onClick={() => setIsSearchOpen(true)}><Search /><span>Search docs</span><kbd><Command size={11} /> K</kbd></Button>}
          <Button variant="ghost" size="icon" className="theme-trigger" aria-label={`Switch theme, currently ${theme}`} title={`Switch theme (${theme})`} onClick={toggleTheme}>{theme === "dark" ? <Sun /> : <Moon />}</Button>
          {user ? <>
            <Link className="nav-user" to="/profile">{user.name || "Account"}<ArrowUpRight size={13} /></Link>
            <Button variant="outline" size="sm" onClick={handleLogout}><LogOut /> Sign out</Button>
          </> : <>
            <Link className="nav-login" to="/login">Sign in</Link>
            <Button render={<Link to="/register" />} className="nav-cta">Start for free <ArrowUpRight /></Button>
          </>}
          <Sheet>
            <SheetTrigger render={<Button variant="outline" size="icon" className="mobile-menu" aria-label="Open menu"><Menu /></Button>} />
            <SheetContent className="mobile-sheet" side="right">
              <SheetHeader><span className="eyebrow">SMTP / LITE</span><SheetTitle>Navigate</SheetTitle></SheetHeader>
              <nav className="mobile-nav">
                {[...links, ...(user ? [{ name: "Dashboard", href: "/dashboard" }, { name: "API keys", href: "/apikeys" }, { name: "App credentials", href: "/app-credentials" }, { name: "Profile", href: "/profile" }] : [])].map((link) => <Link key={link.href} to={link.href}>{link.name}<ArrowUpRight size={15} /></Link>)}
              </nav>
              <div className="mobile-nav-foot">
                <Button variant="outline" onClick={toggleTheme}>{theme === "dark" ? <Sun /> : <Moon />} Switch to {theme === "dark" ? "light" : "dark"} mode</Button>
                {user ? <Button variant="secondary" onClick={handleLogout}><LogOut /> Sign out</Button> : <Button render={<Link to="/register" />}>Create your account <ArrowUpRight /></Button>}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
