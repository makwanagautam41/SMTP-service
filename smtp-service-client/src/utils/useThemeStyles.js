import { useTheme } from "../context/ThemeContext";

// old theme design
// export const legacyLightTheme = {
//   background: {
//     color: "#ffffff",
//     hsl: "hsl(0, 0%, 100%)",
//     title: "main page background",
//   },
//   foreground: {
//     color: "#020817",
//     hsl: "hsl(222.2, 84%, 4.9%)",
//     title: "primary text color",
//   },
//   primary: {
//     color: "#3b82f6",
//     hsl: "hsl(221.2, 83.2%, 53.3%)",
//     title: "brand color, button or links",
//   },
//   primaryForeground: {
//     color: "#f8fafc",
//     hsl: "hsl(210, 40%, 98%)",
//     title: "text on primary backgrounds",
//   },
//   secondary: {
//     color: "#f1f5f9",
//     hsl: "hsl(210, 40%, 96%)",
//     title: "secondary buttons, badges",
//   },
//   secondaryForeground: {
//     color: "#020817",
//     hsl: "hsl(222.2, 84%, 4.9%)",
//     title: "text on secondary backgrounds",
//   },
//   muted: {
//     color: "#f1f5f9",
//     hsl: "hsl(210, 40%, 96%)",
//     title: "code blocks, disabled states",
//   },
//   mutedForeground: {
//     color: "#64748b",
//     hsl: "hsl(215.4, 16.3%, 46.9%)",
//     title: "subtle text, descriptions",
//   },
//   card: {
//     color: "#ffffff",
//     hsl: "hsl(0, 0%, 100%)",
//     title: "card background",
//   },
//   cardForeground: {
//     color: "#020817",
//     hsl: "hsl(222.2, 84%, 4.9%)",
//     title: "text on card",
//   },
//   border: {
//     color: "#e2e8f0",
//     hsl: "hsl(214.3, 31.8%, 91.4%)",
//     title: "borders, dividers",
//   },
//   input: {
//     color: "#e2e8f0",
//     hsl: "hsl(214.3, 31.8%, 91.4%)",
//     title: "input field borders",
//   },
//   ring: {
//     color: "#3b82f6",
//     hsl: "hsl(221.2, 83.2%, 53.3%)",
//     title: "focus rings, outlines",
//   },
//   hover: {
//     background: "#f8fafc",
//     primary: "#2563eb", // slightly darker blue
//     secondary: "#e2e8f0", // subtle gray
//     foreground: "#1e293b",
//   },
// };
// export const legacyDarkTheme = {
//   background: {
//     color: "#020817",
//     hsl: "hsl(222.2, 84%, 4.9%)",
//     title: "main page background",
//   },
//   foreground: {
//     color: "#f8fafc",
//     hsl: "hsl(210, 40%, 98%)",
//     title: "primary text color",
//   },
//   primary: {
//     color: "#3b82f6",
//     hsl: "hsl(217.2, 91.2%, 59.8%)",
//     title: "brand color, button or links",
//   },
//   primaryForeground: {
//     color: "#020817",
//     hsl: "hsl(222.2, 84%, 4.9%)",
//     title: "text on primary backgrounds",
//   },
//   secondary: {
//     color: "#1e293b",
//     hsl: "hsl(217.2, 32.6%, 17.5%)",
//     title: "secondary buttons, badges",
//   },
//   secondaryForeground: {
//     color: "#f8fafc",
//     hsl: "hsl(210, 40%, 98%)",
//     title: "text on secondary backgrounds",
//   },
//   muted: {
//     color: "#1e293b",
//     hsl: "hsl(217.2, 32.6%, 17.5%)",
//     title: "code blocks, disabled states",
//   },
//   mutedForeground: {
//     color: "#94a3b8",
//     hsl: "hsl(215, 20.2%, 65.1%)",
//     title: "subtle text, descriptions",
//   },
//   card: {
//     color: "#020817",
//     hsl: "hsl(222.2, 84%, 4.9%)",
//     title: "card background",
//   },
//   cardForeground: {
//     color: "#f8fafc",
//     hsl: "hsl(210, 40%, 98%)",
//     title: "text on card",
//   },
//   border: {
//     color: "#1e293b",
//     hsl: "hsl(217.2, 32.6%, 17.5%)",
//     title: "borders, dividers",
//   },
//   input: {
//     color: "#1e293b",
//     hsl: "hsl(217.2, 32.6%, 17.5%)",
//     title: "input field borders",
//   },
//   ring: {
//     color: "#e0f2fe",
//     hsl: "hsl(224.3, 76.3%, 94.1%)",
//     title: "focus rings, outlines",
//   },
//   hover: {
//     background: "#1e293b",
//     primary: "#2563eb",
//     secondary: "#334155",
//     foreground: "#e2e8f0",
//   },
// };

// new theme design
export const legacyLightTheme = {
  background: {
    color: "#f6f8fb",
    hsl: "hsl(216, 33%, 97%)",
    title: "main page background",
  },
  foreground: {
    color: "#172033",
    hsl: "hsl(220, 32%, 15%)",
    title: "primary text color",
  },
  primary: {
    color: "#3156d3",
    hsl: "hsl(228, 63%, 51%)",
    title: "brand color, button or links",
  },
  primaryForeground: {
    color: "#ffffff",
    hsl: "hsl(0, 0%, 100%)",
    title: "text on primary backgrounds",
  },
  secondary: {
    color: "#eef2f8",
    hsl: "hsl(216, 33%, 95%)",
    title: "secondary buttons, badges",
  },
  secondaryForeground: {
    color: "#24314a",
    hsl: "hsl(220, 32%, 21%)",
    title: "text on secondary backgrounds",
  },
  muted: {
    color: "#e9eef6",
    hsl: "hsl(216, 33%, 94%)",
    title: "code blocks, disabled states",
  },
  mutedForeground: {
    color: "#667085",
    hsl: "hsl(220, 11%, 50%)",
    title: "subtle text, descriptions",
  },
  card: {
    color: "#ffffff",
    hsl: "hsl(0, 0%, 100%)",
    title: "card background",
  },
  cardForeground: {
    color: "#172033",
    hsl: "hsl(220, 32%, 15%)",
    title: "text on card",
  },
  border: {
    color: "#dce3ee",
    hsl: "hsl(216, 33%, 89%)",
    title: "borders, dividers",
  },
  input: {
    color: "#d5ddea",
    hsl: "hsl(216, 33%, 88%)",
    title: "input field borders",
  },
  ring: {
    color: "#3156d3",
    hsl: "hsl(228, 63%, 51%)",
    title: "focus rings, outlines",
  },
  hover: {
    background: "#eef3f9",
    primary: "#2444b5",
    secondary: "#e5ebf4",
    foreground: "#172033",
  },
};
export const legacyDarkTheme = {
  background: {
    color: "#000000",
    hsl: "hsl(0, 0%, 0%)",
    title: "main page background",
  },
  foreground: {
    color: "#ededed",
    hsl: "hsl(0, 0%, 93%)",
    title: "primary text color",
  },
  primary: {
    color: "#ffffff",
    hsl: "hsl(0, 0%, 100%)",
    title: "brand color, button or links",
  },
  primaryForeground: {
    color: "#000000",
    hsl: "hsl(0, 0%, 0%)",
    title: "text on primary backgrounds",
  },
  secondary: {
    color: "#1a1a1a",
    hsl: "hsl(0, 0%, 10%)",
    title: "secondary buttons, badges",
  },
  secondaryForeground: {
    color: "#ededed",
    hsl: "hsl(0, 0%, 93%)",
    title: "text on secondary backgrounds",
  },
  muted: {
    color: "#0a0a0a",
    hsl: "hsl(0, 0%, 4%)",
    title: "code blocks, disabled states",
  },
  mutedForeground: {
    color: "#a1a1a1",
    hsl: "hsl(0, 0%, 63%)",
    title: "subtle text, descriptions",
  },
  card: {
    color: "#0a0a0a",
    hsl: "hsl(0, 0%, 4%)",
    title: "card background",
  },
  cardForeground: {
    color: "#ededed",
    hsl: "hsl(0, 0%, 93%)",
    title: "text on card",
  },
  border: {
    color: "#262626",
    hsl: "hsl(0, 0%, 15%)",
    title: "borders, dividers",
  },
  input: {
    color: "#262626",
    hsl: "hsl(0, 0%, 15%)",
    title: "input field borders",
  },
  ring: {
    color: "#ffffff",
    hsl: "hsl(0, 0%, 100%)",
    title: "focus rings, outlines",
  },
  hover: {
    background: "#1a1a1a",
    primary: "#e6e6e6",
    secondary: "#262626",
    foreground: "#ffffff",
  },
};

export const useThemeStyles = () => {
  const { theme } = useTheme();
  const legacy = theme === "light" ? legacyLightTheme : legacyDarkTheme;
  return { ...legacy, theme };
};
