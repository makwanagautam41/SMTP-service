import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  // Theme mode: 'light', 'dark', or 'system'
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("themeMode");
      return stored || "system";
    }
    return "system";
  });

  // Actual applied theme (resolved from themeMode)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("themeMode");
      if (stored === "system" || !stored) {
        return getSystemTheme();
      }
      return stored;
    }
    return "light";
  });

  // ✅ Update theme when themeMode changes
  useEffect(() => {
    let newTheme;

    if (themeMode === "system") {
      newTheme = getSystemTheme();
    } else {
      newTheme = themeMode;
    }

    setTheme(newTheme);
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  // ✅ Apply theme to document
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  // ✅ Listen for system theme changes in real time
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      // Only update if in system mode
      if (themeMode === "system") {
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
  }, [themeMode]);

  // ✅ Cycle through themes: light -> dark -> system -> light...
  const toggleTheme = () => {
    setThemeMode((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "system";
      return "light";
    });
  };

  // ✅ Set specific theme mode
  const setThemeModeDirect = (mode) => {
    if (["light", "dark", "system"].includes(mode)) {
      setThemeMode(mode);
    }
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        toggleTheme,
        setThemeMode: setThemeModeDirect,
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
