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

export const useThemeStyles = () => {
  const { theme } = useTheme();
  const styles = theme === "light" ? lightTheme : darkTheme;
  return { ...styles, theme };
};
