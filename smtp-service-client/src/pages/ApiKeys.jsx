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

const ApiKeys = () => {
  const { apiKeys, loading, createApiKey, deleteApiKey, toggleApiKey } =
    useApiKeys();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  const [togglingIds, setTogglingIds] = useState([]); // Track keys being toggled
  const [deletingIds, setDeletingIds] = useState([]); // Track keys being deleted

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
      await toggleApiKey(id); // Wait for server response
    } catch (err) {
      console.error("Failed to toggle API key:", err);
    } finally {
      setTogglingIds((prev) => prev.filter((keyId) => keyId !== id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 pt-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <KeyRound className="text-blue-600" size={28} />
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
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={creating}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {creating ? <Loader2 className="animate-spin" size={20} /> : "Create"}
        </button>
      </form>

      {/* API Keys List */}
      {loading ? (
        <div className="text-center text-gray-500">Loading keys...</div>
      ) : apiKeys.length === 0 ? (
        <div className="text-center text-gray-500">
          No API keys created yet.
        </div>
      ) : (
        <motion.div layout className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {apiKeys.map((keyObj) => {
            const isToggling = togglingIds.includes(keyObj._id);

            return (
              <motion.div
                key={keyObj._id}
                layout
                className="p-4 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-gray-800">{keyObj.name}</h2>
                  <span
                    className={`text-xs px-2 py-1 rounded-full transition-colors duration-300 ${
                      keyObj.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {keyObj.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="font-mono text-sm bg-gray-100 p-2 rounded overflow-hidden break-all">
                  {keyObj.key.length > 20
                    ? `${keyObj.key.slice(0, 20)}...`
                    : keyObj.key}
                </div>

                <div className="flex justify-end gap-3 mt-3">
                  {/* Toggle Active/Inactive */}
                  <motion.button
                    onClick={() => handleToggle(keyObj._id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition ${
                      keyObj.active
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                    }`}
                    whileTap={{ scale: 0.9 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    disabled={isToggling}
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
                    className="flex items-center text-blue-600 hover:text-blue-800 transition"
                  >
                    {copiedKeyId === keyObj._id ? (
                      <Check size={18} className="text-green-600" />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(keyObj._id)}
                    className="flex items-center text-red-600 hover:text-red-800 transition"
                    disabled={deletingIds.includes(keyObj._id)}
                  >
                    {deletingIds.includes(keyObj._id) ? (
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
  );
};

export default ApiKeys;
