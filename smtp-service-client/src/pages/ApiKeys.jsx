import React, { useState } from "react";
import { useApiKeys } from "../context/ApiKeyContext";
import { motion } from "framer-motion";
import {
  Copy,
  Trash2,
  KeyRound,
  Loader2,
  Check,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useThemeStyles } from "../utils/useThemeStyles";

const ApiKeys = () => {
  const { apiKeys, loading, createApiKey, deleteApiKey, toggleApiKey } =
    useApiKeys();
  const {
    background,
    card,
    border,
    primary,
    primaryForeground,
    foreground,
    muted,
    input,
    hover,
  } = useThemeStyles();

  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  const [togglingIds, setTogglingIds] = useState([]);
  const [deletingIds, setDeletingIds] = useState([]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    await createApiKey(name);
    setName("");
    setCreating(false);
  };

  const handleCopy = (id, key) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleDelete = async (id) => {
    setDeletingIds((prev) => [...prev, id]);
    try {
      await deleteApiKey(id);
    } catch (err) {
      console.error("Failed to delete API key:", err);
    } finally {
      setDeletingIds((prev) => prev.filter((keyId) => keyId !== id));
    }
  };

  const handleToggle = async (id) => {
    setTogglingIds((prev) => [...prev, id]);
    try {
      await toggleApiKey(id);
    } catch (err) {
      console.error("Failed to toggle API key:", err);
    } finally {
      setTogglingIds((prev) => prev.filter((keyId) => keyId !== id));
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start pt-10 px-2 transition-colors duration-300"
      style={{
        backgroundColor: background.color,
        color: foreground.color,
      }}
    >
      <div className="w-full max-w-5xl">
        <h1
          className="text-3xl font-bold mb-6 flex items-center gap-2"
          style={{ color: primary.color }}
        >
          <KeyRound size={28} />
          Manage API Keys
        </h1>

        {/* Create New Key */}
        <form
          onSubmit={handleCreate}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <input
            type="text"
            placeholder="Enter API Key Name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-grow px-4 py-2 rounded-lg focus:outline-none transition-colors duration-200"
            style={{
              backgroundColor: card.color,
              border: `1px solid ${input.color}`,
              color: foreground.color,
            }}
          />
          <button
            type="submit"
            disabled={creating}
            className="rounded-lg font-medium px-6 py-2 flex items-center justify-center gap-2 transition-colors duration-300"
            style={{
              backgroundColor: primary.color,
              color: primaryForeground.color,
              opacity: creating ? 0.8 : 1,
              cursor: creating ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = hover.primary)
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = primary.color)
            }
          >
            {creating ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Create"
            )}
          </button>
        </form>

        {/* API Keys List */}
        {loading ? (
          <div
            className="text-center font-medium"
            style={{ color: muted.color }}
          >
            Loading keys...
          </div>
        ) : apiKeys.length === 0 ? (
          <div
            className="text-center font-medium"
            style={{ color: muted.color }}
          >
            No API keys created yet.
          </div>
        ) : (
          <motion.div
            layout
            className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
          >
            {apiKeys.map((keyObj) => {
              const isToggling = togglingIds.includes(keyObj._id);
              const isDeleting = deletingIds.includes(keyObj._id);

              return (
                <motion.div
                  key={keyObj._id}
                  layout
                  className="p-4 rounded-xl shadow-md transition-all duration-300"
                  style={{
                    backgroundColor: card.color,
                    color: foreground.color,
                    border: `1px solid ${border.color}`,
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold">{keyObj.name}</h2>
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: keyObj.active
                          ? "rgba(34,197,94,0.15)"
                          : "rgba(239,68,68,0.15)",
                        color: keyObj.active ? "#16a34a" : "#ef4444",
                      }}
                    >
                      {keyObj.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div
                    className="font-mono text-sm p-2 rounded break-all"
                    style={{
                      backgroundColor: muted.color,
                      border: `1px solid ${border.color}`,
                    }}
                  >
                    {keyObj.key.length > 20
                      ? `${keyObj.key.slice(0, 20)}...`
                      : keyObj.key}
                  </div>

                  <div className="flex justify-end gap-3 mt-3">
                    {/* Toggle Active/Inactive */}
                    <motion.button
                      onClick={() => handleToggle(keyObj._id)}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition"
                      whileTap={{ scale: 0.9 }}
                      disabled={isToggling}
                      style={{
                        backgroundColor: keyObj.active
                          ? "rgba(34,197,94,1)"
                          : "rgba(156,163,175,0.5)",
                        color: keyObj.active ? "#fff" : "#111",
                      }}
                    >
                      {isToggling ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : keyObj.active ? (
                        <>
                          <ToggleRight size={16} /> Deactivate
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={16} /> Activate
                        </>
                      )}
                    </motion.button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(keyObj._id, keyObj.key)}
                      className="transition"
                      style={{ color: primary.color }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = hover.primary)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = primary.color)
                      }
                    >
                      {copiedKeyId === keyObj._id ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(keyObj._id)}
                      disabled={isDeleting}
                      className="transition"
                      style={{ color: "#ef4444" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#dc2626")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#ef4444")
                      }
                    >
                      {isDeleting ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ApiKeys;
