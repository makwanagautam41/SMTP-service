import { useTheme } from "../context/ThemeContext";

const lightTheme = {
  navBg: "bg-white text-gray-900 shadow-md",
  bgPrimary: "bg-white",
  bgSecondary: "bg-gray-50",
  bgThird: "bg-gray-200",
  textPrimary: "text-gray-800",
  textSecondary: "text-gray-600",
  hover: "hover:bg-gray-200",
  hoverSecondary: "hover:bg-gray-100",
  borderPrimary: "border border-[#1f1f21]",
  textThird: "text-gray-500",
  bgGredient: "bg-gradient-to-br from-blue-50 to-purple-50",
  borderSecondary: " border border-gray-100",
};

const darkTheme = {
  navBg: "bg-[#161618] text-gray-100 shadow-lg",
  bgPrimary: "bg-[#161618]",
  bgSecondary: "bg-[#1f1f21]",
  bgThird: "bg-[#373639]",
  textPrimary: "text-gray-50",
  textSecondary: "text-gray-600",
  hover: "hover:bg-[#1f1f21]",
  hoverSecondary: "hover:bg-[#161618]",
  borderPrimary: "border border-[#7b7b7d]",
  textThird: "text-gray-400",
  bgGredient: "rom-blue-900 dark:to-purple-900",
  borderSecondary: " border border-[#7b7b7d]",
};

export const legacyLightTheme = {
  background: {
    color: "#ffffff",
    hsl: "hsl(0, 0%, 100%)",
    title: "main page background",
  },
  foreground: {
    color: "#020817",
    hsl: "hsl(222.2, 84%, 4.9%)",
    title: "primary text color",
  },
  primary: {
    color: "#3b82f6",
    hsl: "hsl(221.2, 83.2%, 53.3%)",
    title: "brand color, button or links",
  },
  primaryForeground: {
    color: "#f8fafc",
    hsl: "hsl(210, 40%, 98%)",
    title: "text on primary backgrounds",
  },
  secondary: {
    color: "#f1f5f9",
    hsl: "hsl(210, 40%, 96%)",
    title: "secondary buttons, badges",
  },
  secondaryForeground: {
    color: "#020817",
    hsl: "hsl(222.2, 84%, 4.9%)",
    title: "text on secondary backgrounds",
  },
  muted: {
    color: "#f1f5f9",
    hsl: "hsl(210, 40%, 96%)",
    title: "code blocks, disabled states",
  },
  mutedForeground: {
    color: "#64748b",
    hsl: "hsl(215.4, 16.3%, 46.9%)",
    title: "subtle text, descriptions",
  },
  card: {
    color: "#ffffff",
    hsl: "hsl(0, 0%, 100%)",
    title: "card background",
  },
  cardForeground: {
    color: "#020817",
    hsl: "hsl(222.2, 84%, 4.9%)",
    title: "text on card",
  },
  border: {
    color: "#e2e8f0",
    hsl: "hsl(214.3, 31.8%, 91.4%)",
    title: "borders, dividers",
  },
  input: {
    color: "#e2e8f0",
    hsl: "hsl(214.3, 31.8%, 91.4%)",
    title: "input field borders",
  },
  ring: {
    color: "#3b82f6",
    hsl: "hsl(221.2, 83.2%, 53.3%)",
    title: "focus rings, outlines",
  },
  hover: {
    background: "#f8fafc",
    primary: "#2563eb", // slightly darker blue
    secondary: "#e2e8f0", // subtle gray
    foreground: "#1e293b",
  },
};

export const legacyDarkTheme = {
  background: {
    color: "#020817",
    hsl: "hsl(222.2, 84%, 4.9%)",
    title: "main page background",
  },
  foreground: {
    color: "#f8fafc",
    hsl: "hsl(210, 40%, 98%)",
    title: "primary text color",
  },
  primary: {
    color: "#3b82f6",
    hsl: "hsl(217.2, 91.2%, 59.8%)",
    title: "brand color, button or links",
  },
  primaryForeground: {
    color: "#020817",
    hsl: "hsl(222.2, 84%, 4.9%)",
    title: "text on primary backgrounds",
  },
  secondary: {
    color: "#1e293b",
    hsl: "hsl(217.2, 32.6%, 17.5%)",
    title: "secondary buttons, badges",
  },
  secondaryForeground: {
    color: "#f8fafc",
    hsl: "hsl(210, 40%, 98%)",
    title: "text on secondary backgrounds",
  },
  muted: {
    color: "#1e293b",
    hsl: "hsl(217.2, 32.6%, 17.5%)",
    title: "code blocks, disabled states",
  },
  mutedForeground: {
    color: "#94a3b8",
    hsl: "hsl(215, 20.2%, 65.1%)",
    title: "subtle text, descriptions",
  },
  card: {
    color: "#020817",
    hsl: "hsl(222.2, 84%, 4.9%)",
    title: "card background",
  },
  cardForeground: {
    color: "#f8fafc",
    hsl: "hsl(210, 40%, 98%)",
    title: "text on card",
  },
  border: {
    color: "#1e293b",
    hsl: "hsl(217.2, 32.6%, 17.5%)",
    title: "borders, dividers",
  },
  input: {
    color: "#1e293b",
    hsl: "hsl(217.2, 32.6%, 17.5%)",
    title: "input field borders",
  },
  ring: {
    color: "#e0f2fe",
    hsl: "hsl(224.3, 76.3%, 94.1%)",
    title: "focus rings, outlines",
  },
  hover: {
    background: "#1e293b",
    primary: "#2563eb",
    secondary: "#334155",
    foreground: "#e2e8f0",
  },
};

export const useThemeStyles = () => {
  const { theme } = useTheme();
  const styles = theme === "light" ? lightTheme : darkTheme;
  const legacy = theme === "light" ? legacyLightTheme : legacyDarkTheme;
  return { ...styles, ...legacy, theme };
};
