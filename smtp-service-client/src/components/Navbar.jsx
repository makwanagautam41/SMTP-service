import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  LogIn,
  UserPlus,
  LayoutDashboard,
  KeyRound,
  Sun,
  Moon,
  User,
  Home,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useThemeStyles } from "../utils/useThemeStyles.js";
import logo from "../../public/logo.png";

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const { toggleTheme } = useTheme();
  const { theme, ...legacy } = useThemeStyles();

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (isOpen) return;
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const publicLinks = [
    { name: "Documentations", href: "/documentations", icon: Home },
    { name: "Services", href: "/services", icon: LayoutDashboard },
  ];

  const privateLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "API Keys", href: "/apikeys", icon: KeyRound },
    { name: "APP Credentials", href: "/app-credentials", icon: User },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const navLinks = user ? [...publicLinks, ...privateLinks] : publicLinks;

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: legacy.background.color,
        color: legacy.foreground.color,
        borderBottom: `1px solid ${legacy.border.color}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="flex justify-between items-center h-16"
          style={{ color: legacy.foreground.color }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="MailFlow Logo"
              className="w-10 h-10 object-contain"
            />
            <span
              className="text-2xl font-bold tracking-tight"
              style={{ color: legacy.primary.color }}
            >
              SMTP-LITE
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="font-medium transition-colors duration-200"
                style={{ color: legacy.foreground.color }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = legacy.primary.color)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = legacy.foreground.color)
                }
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: legacy.secondary.color,
              color: legacy.secondaryForeground.color,
            }}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
          </button>

          {/* Desktop Auth */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <span
                  className="font-medium"
                  style={{ color: legacy.foreground.color }}
                >
                  Hi, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: legacy.primary.color,
                    color: legacy.primaryForeground.color,
                    border: `1px solid ${legacy.border.color}`,
                  }}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300"
                  style={{
                    color: legacy.foreground.color,
                    border: `1px solid ${legacy.border.color}`,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = legacy.primary.color)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = legacy.foreground.color)
                  }
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: legacy.primary.color,
                    color: legacy.primaryForeground.color,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      legacy.hover?.primary || legacy.primary.color)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      legacy.primary.color)
                  }
                >
                  <UserPlus size={18} />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="focus:outline-none"
              style={{ color: legacy.foreground.color }}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed top-0 left-0 h-full w-full z-40 overflow-y-auto"
            style={{
              backgroundColor: legacy.background.color,
              color: legacy.foreground.color,
              borderRight: `1px solid ${legacy.border.color}`,
            }}
          >
            <div className="px-4 pt-4 pb-4 space-y-2">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <Link
                  to="/"
                  className="flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <img
                    src={logo}
                    alt="MailFlow Logo"
                    className="w-8 h-8 object-contain"
                  />
                  <span
                    className="text-2xl font-bold"
                    style={{ color: legacy.primary.color }}
                  >
                    SMTP-LITE
                  </span>
                </Link>
                <button
                  onClick={toggleMenu}
                  style={{ color: legacy.foreground.color }}
                >
                  <X size={26} />
                </button>
              </div>

              {/* Links */}
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200"
                    style={{
                      color: legacy.foreground.color,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = legacy.primary.color)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = legacy.foreground.color)
                    }
                  >
                    <Icon size={20} />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                );
              })}

              {/* Auth */}
              <div
                className="pt-4 border-t space-y-2"
                style={{ borderColor: legacy.border.color }}
              >
                {user ? (
                  <>
                    <div
                      className="px-3 py-2 font-medium"
                      style={{ color: legacy.foreground.color }}
                    >
                      Hi, {user.name}
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg"
                      style={{
                        backgroundColor: legacy.primary.color,
                        color: legacy.primaryForeground.color,
                      }}
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg"
                      style={{
                        color: legacy.foreground.color,
                        border: `1px solid ${legacy.border.color}`,
                      }}
                    >
                      <LogIn size={18} />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg"
                      style={{
                        backgroundColor: legacy.primary.color,
                        color: legacy.primaryForeground.color,
                      }}
                    >
                      <UserPlus size={18} />
                      <span>Register</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
