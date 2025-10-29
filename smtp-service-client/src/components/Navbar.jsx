import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  User,
  LogOut,
  LogIn,
  UserPlus,
  LayoutDashboard,
  KeyRound,
  Sun,
  Moon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useThemeStyles } from "../utils/useThemeStyles.js";
import logo from "../../public/logo.png";
import { style } from "framer-motion/client";

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const { toggleTheme } = useTheme();
  const styles = useThemeStyles();

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
    { name: "services", href: "/documentations", icon: Home },
  ];
  const privateLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "API Keys", href: "/apikeys", icon: KeyRound },
    { name: "Profile", href: "/profile", icon: User },
  ];
  const navLinks = user ? [...publicLinks, ...privateLinks] : publicLinks;

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 ${styles.bgPrimary} transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={logo}
                alt="SMTP-LITE Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold text-blue-600 tracking-tight">
                SMTP-LITE
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`font-medium ${styles.textPrimary} hover:text-blue-500 transition-colors duration-200 ${styles.text}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors duration-300 ${styles.hover}`}
            aria-label="Toggle Theme"
          >
            {styles.theme === "light" ? (
              <Moon size={22} className="text-black" />
            ) : (
              <Sun size={22} className="text-yellow-400" />
            )}
          </button>

          {/* Desktop Auth */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <span className={`font-medium ${styles.text}`}>
                  Hi, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`flex items-center space-x-2 px-4 py-2 ${styles.textPrimary} rounded-lg transition`}
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${styles.bgThird} ${styles.textPrimary} transition`}
                >
                  <UserPlus size={18} />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-200 focus:outline-none"
            >
              <Menu size={28} />
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
            className={`md:hidden fixed top-0 left-0 h-full w-full ${styles.navBg} border-r border-gray-200 z-40 overflow-y-auto`}
          >
            <div className="px-4 pt-4 pb-4 space-y-2">
              {/* Header with Close */}
              <div className="flex justify-between items-center mb-4">
                <Link
                  to="/"
                  className="flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <img
                    src={logo}
                    alt="SMTP-LITE Logo"
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-2xl font-bold text-blue-600 tracking-tight">
                    SMTP-LITE
                  </span>
                </Link>
                <button
                  onClick={toggleMenu}
                  className="text-gray-700 dark:text-gray-200"
                >
                  <X size={26} />
                </button>
              </div>

              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${styles.hover} transition ${styles.text}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-gray-200 space-y-2">
                {user ? (
                  <>
                    <div className={`px-3 py-2 font-medium ${styles.text}`}>
                      Hi, {user.name}
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`flex items-center space-x-2 px-4 py-2 ${styles.borderPrimary} ${styles.hover} ${styles.textPrimary} rounded-lg transition`}
                    >
                      <LogIn size={18} />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      className={`flex items-center space-x-2 px-4 py-2 text-white rounded-lg bg-[#1f1f21] transition`}
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
