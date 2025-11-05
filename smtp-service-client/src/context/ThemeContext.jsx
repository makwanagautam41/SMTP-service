// import React, { createContext, useContext, useEffect, useState } from "react";

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const getSystemTheme = () =>
//     window.matchMedia("(prefers-color-scheme: dark)").matches
//       ? "dark"
//       : "light";

//   // Theme mode: 'light', 'dark', or 'system'
//   const [themeMode, setThemeMode] = useState(() => {
//     if (typeof window !== "undefined") {
//       const stored = localStorage.getItem("themeMode");
//       return stored || "system";
//     }
//     return "system";
//   });

//   // Actual applied theme (resolved from themeMode)
//   const [theme, setTheme] = useState(() => {
//     if (typeof window !== "undefined") {
//       const stored = localStorage.getItem("themeMode");
//       if (stored === "system" || !stored) {
//         return getSystemTheme();
//       }
//       return stored;
//     }
//     return "light";
//   });

//   // ✅ Update theme when themeMode changes
//   useEffect(() => {
//     let newTheme;

//     if (themeMode === "system") {
//       newTheme = getSystemTheme();
//     } else {
//       newTheme = themeMode;
//     }

//     setTheme(newTheme);
//     localStorage.setItem("themeMode", themeMode);
//   }, [themeMode]);

//   // ✅ Apply theme to document
//   useEffect(() => {
//     document.documentElement.classList.remove("light", "dark");
//     document.documentElement.classList.add(theme);
//   }, [theme]);

//   // ✅ Listen for system theme changes in real time
//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

//     const handleChange = (e) => {
//       // Only update if in system mode
//       if (themeMode === "system") {
//         setTheme(e.matches ? "dark" : "light");
//       }
//     };

//     // Check if the browser supports addEventListener (modern browsers)
//     if (mediaQuery.addEventListener) {
//       mediaQuery.addEventListener("change", handleChange);
//       return () => mediaQuery.removeEventListener("change", handleChange);
//     } else {
//       // Fallback for older browsers
//       mediaQuery.addListener(handleChange);
//       return () => mediaQuery.removeListener(handleChange);
//     }
//   }, [themeMode]);

//   // ✅ Cycle through themes: light -> dark -> system -> light...
//   const toggleTheme = () => {
//     setThemeMode((prev) => {
//       if (prev === "light") return "dark";
//       if (prev === "dark") return "system";
//       return "light";
//     });
//   };

//   // ✅ Set specific theme mode
//   const setThemeModeDirect = (mode) => {
//     if (["light", "dark", "system"].includes(mode)) {
//       setThemeMode(mode);
//     }
//   };

//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [copiedCode, setCopiedCode] = useState(null);

//   return (
//     <ThemeContext.Provider
//       value={{
//         theme,
//         themeMode,
//         toggleTheme,
//         setThemeMode: setThemeModeDirect,
//         isSearchOpen,
//         setIsSearchOpen,
//         copiedCode,
//         setCopiedCode,
//       }}
//     >
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);

import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const getSystemTheme = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const [themeMode, setThemeMode] = useState("system");
  const [theme, setTheme] = useState("light");

  // ✅ Load theme from storage after mount
  useEffect(() => {
    const storedMode = localStorage.getItem("themeMode") || "system";
    setThemeMode(storedMode);

    // Determine actual theme
    const actualTheme = storedMode === "system" ? getSystemTheme() : storedMode;
    setTheme(actualTheme);

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(actualTheme);
  }, []);

  // ✅ Apply theme whenever themeMode changes
  useEffect(() => {
    if (!themeMode) return;
    const newTheme = themeMode === "system" ? getSystemTheme() : themeMode;
    setTheme(newTheme);
    localStorage.setItem("themeMode", themeMode);

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  }, [themeMode]);

  // ✅ Listen for system theme change (works on mobile too)
  useEffect(() => {
    if (themeMode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      const newTheme = e.matches ? "dark" : "light";
      setTheme(newTheme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
    };

    // Add event listener for theme changes
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) =>
      prev === "light" ? "dark" : prev === "dark" ? "system" : "light"
    );
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        toggleTheme,
        setThemeMode,
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
