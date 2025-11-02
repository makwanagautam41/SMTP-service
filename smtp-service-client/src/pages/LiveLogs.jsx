import React, { useEffect, useState } from "react";
import { useThemeStyles } from "../utils/useThemeStyles";

export default function LiveLogs() {
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const styles = useThemeStyles();

  // Define additional colors for logs (theme-aware)
  const logColors = {
    success: styles.theme === "light" ? "#22c55e" : "#22c55e",
    warning: styles.theme === "light" ? "#f59e0b" : "#f59e0b",
    error: styles.theme === "light" ? "#ef4444" : "#ef4444",
    info: styles.primary.color,
    debug: styles.mutedForeground.color,
  };

  useEffect(() => {
    const apiBase =
      import.meta.env.VITE_SMTP_SERVER_API_BASE_URL ||
      "http://localhost:5000/api";

    let isMounted = true;
    let intervalId;

    const fetchLogs = async () => {
      try {
        const res = await fetch(`${apiBase}/logs/latest`);
        if (!res.ok) throw new Error("Failed to fetch logs");
        const data = await res.json();

        if (isMounted) {
          setLogs(data);
          setIsConnected(true);
        }
      } catch (err) {
        console.error("Error fetching logs:", err);
        if (isMounted) setIsConnected(false);
      }
    };

    // Initial fetch
    fetchLogs();

    // Poll every 2 seconds
    intervalId = setInterval(fetchLogs, 2000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      setIsConnected(false);
    };
  }, []);

  const getLogLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "error":
        return logColors.error;
      case "warn":
      case "warning":
        return logColors.warning;
      case "info":
        return logColors.info;
      case "debug":
        return logColors.debug;
      case "success":
        return logColors.success;
      default:
        return styles.foreground.color;
    }
  };

  const getLogLevelBadge = (level) => {
    const badgeStyles = {
      error: {
        bg: logColors.error,
        text: "#ffffff",
      },
      warn: {
        bg: logColors.warning,
        text: "#000000",
      },
      warning: {
        bg: logColors.warning,
        text: "#000000",
      },
      info: {
        bg: styles.primary.color,
        text: styles.primaryForeground.color,
      },
      debug: {
        bg: styles.muted.color,
        text: styles.mutedForeground.color,
      },
      success: {
        bg: logColors.success,
        text: "#ffffff",
      },
    };

    const levelLower = level?.toLowerCase();
    const badge = badgeStyles[levelLower] || {
      bg: styles.secondary.color,
      text: styles.secondaryForeground.color,
    };

    return (
      <span
        style={{
          backgroundColor: badge.bg,
          color: badge.text,
        }}
        className="px-2 py-0.5 rounded text-xs font-semibold uppercase"
      >
        {level}
      </span>
    );
  };

  return (
    <div
      style={{
        backgroundColor: styles.background.color,
        color: styles.foreground.color,
        borderColor: styles.border.color,
      }}
      className="flex flex-col h-screen"
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: styles.card.color,
          borderBottomColor: styles.border.color,
        }}
        className="px-6 py-4 border-b"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2
              style={{ color: styles.foreground.color }}
              className="text-xl font-semibold"
            >
              Live Backend Logs (Database)
            </h2>
            <div className="flex items-center gap-2">
              <div
                style={{
                  backgroundColor: isConnected
                    ? logColors.success
                    : logColors.error,
                }}
                className="w-2 h-2 rounded-full animate-pulse"
              />
              <span
                style={{ color: styles.mutedForeground.color }}
                className="text-sm"
              >
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              style={{ color: styles.mutedForeground.color }}
              className="text-sm"
            >
              {logs.length} logs
            </span>
            <button
              onClick={() => setLogs([])}
              style={{
                backgroundColor: styles.secondary.color,
                color: styles.secondaryForeground.color,
                borderColor: styles.border.color,
              }}
              className="px-3 py-1.5 text-sm rounded border hover:opacity-80 transition-opacity"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Logs Container */}
      <div className="flex-1 overflow-y-auto p-6 font-mono text-sm">
        {logs.length === 0 ? (
          <div
            style={{ color: styles.mutedForeground.color }}
            className="flex items-center justify-center h-full text-center"
          >
            <div>
              <div className="text-4xl mb-2">📡</div>
              <p>Waiting for logs...</p>
              <p className="text-xs mt-1">
                Logs will appear here from the database
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: styles.card.color,
                  borderColor: styles.border.color,
                }}
                className="p-3 rounded border hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-3">
                  {/* Timestamp */}
                  <span
                    style={{ color: styles.mutedForeground.color }}
                    className="text-xs whitespace-nowrap mt-0.5"
                  >
                    {new Date(log.time).toLocaleTimeString()}
                  </span>

                  {/* Log Level Badge */}
                  <div className="mt-0.5">{getLogLevelBadge(log.level)}</div>

                  {/* Log Message */}
                  <div
                    style={{ color: getLogLevelColor(log.level) }}
                    className="flex-1 break-words"
                  >
                    {log.message}
                  </div>
                </div>

                {/* Additional metadata if present */}
                {log.metadata && (
                  <div
                    style={{
                      backgroundColor: styles.muted.color,
                      color: styles.mutedForeground.color,
                    }}
                    className="mt-2 p-2 rounded text-xs"
                  >
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
