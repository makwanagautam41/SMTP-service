import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      const useSystem = localStorage.getItem("useSystemTheme");

      // If user wants to follow system theme or no preference set
      if (useSystem === "true" || !stored) {
        return getSystemTheme();
      }
      return stored;
    }
    return "light";
  });

  const [followSystemTheme, setFollowSystemTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const useSystem = localStorage.getItem("useSystemTheme");
      return useSystem === "true" || useSystem === null;
    }
    return true;
  });

  // ✅ Apply theme to document
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);

    // Only store theme if not following system
    if (!followSystemTheme) {
      localStorage.setItem("theme", theme);
      localStorage.setItem("useSystemTheme", "false");
    } else {
      localStorage.setItem("useSystemTheme", "true");
      // Store current system theme for reference
      localStorage.setItem("theme", theme);
    }
  }, [theme, followSystemTheme]);

  // ✅ Listen for system theme changes in real time
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      // Only update if following system theme
      if (followSystemTheme) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    // Check if the browser supports addEventListener (modern browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [followSystemTheme]);

  // ✅ Toggle theme (this disables system theme following)
  const toggleTheme = () => {
    setFollowSystemTheme(false);
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // ✅ Reset to system theme
  const resetToSystemTheme = () => {
    setFollowSystemTheme(true);
    setTheme(getSystemTheme());
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        resetToSystemTheme,
        followSystemTheme,
        isSearchOpen,
        setIsSearchOpen,
        copiedCode,
        setCopiedCode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
