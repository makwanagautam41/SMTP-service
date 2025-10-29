import React from "react";
import { useThemeStyles } from "../utils/useThemeStyles.js";
import { Link } from "react-router-dom";

const Footer = () => {
  const { border, muted, mutedForeground, primary } = useThemeStyles();

  return (
    <footer
      className="w-full text-center text-sm transition-colors duration-300 mt-auto"
      style={{
        borderTop: `1px solid ${border.color}`,
        color: mutedForeground.color,
        backgroundColor: muted.color,
        paddingTop: "1.5rem",
        paddingBottom: "1rem",
      }}
    >
      <p>
        © {new Date().getFullYear()} SMTP-LITE — Built with{" "}
        <span style={{ color: "red" }}>❤️</span> for developers
      </p>

      <p className="mt-2">
        Need help? Contact{" "}
        <span style={{ color: primary.color }}>
          support@smtp-lite.vercel.app
        </span>
      </p>

      <div className="mt-4 flex justify-center gap-4 text-xs">
        {[
          { to: "/privacy", text: "Privacy Policy" },
          { to: "/terms", text: "Terms of Service" },
          { to: "/status", text: "System Status" },
        ].map(({ to, text }) => (
          <Link
            key={to}
            to={to}
            style={{
              color: mutedForeground.color,
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.color = primary.color)}
            onMouseLeave={(e) => (e.target.style.color = mutedForeground.color)}
          >
            {text}
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
