import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check } from "lucide-react";
import { useThemeStyles } from "../utils/useThemeStyles";

const TemplatePreviewModal = ({ isOpen, template, previewMode, onClose }) => {
  const { card, border, foreground, mutedForeground, background, primary } =
    useThemeStyles();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopyTemplateId = async () => {
    try {
      await navigator.clipboard.writeText(template.templateId);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!isOpen || !template) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-2 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-2xl rounded-2xl shadow-xl p-4 sm:p-5 max-h-[80vh] overflow-y-auto"
            style={{
              backgroundColor: card.color,
              border: `1px solid ${border.color}`,
              color: foreground.color,
            }}
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full transition-opacity hover:opacity-80"
              style={{
                backgroundColor: background.color,
                color: foreground.color,
                border: `1px solid ${border.color}`,
              }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* HEADER */}
            <h2 className="text-xl font-semibold mb-1 pr-10">
              {template.subject}
            </h2>

            <p
              className="text-xs mb-4"
              style={{ color: mutedForeground.color }}
            >
              {template.visibility.toUpperCase()} • {template.status}
            </p>

            {/* CONTENT SWITCH */}
            {previewMode === "template" && (
              <div
                className="p-4 rounded-lg text-sm overflow-auto"
                style={{
                  backgroundColor: background.color,
                  border: `1px solid ${border.color}`,
                }}
                dangerouslySetInnerHTML={{ __html: template.html }}
              />
            )}

            {previewMode === "details" && (
              <div
                className="p-4 rounded-lg text-sm space-y-3"
                style={{
                  backgroundColor: background.color,
                  border: `1px solid ${border.color}`,
                }}
              >
                <div>
                  <span
                    className="text-xs block mb-1"
                    style={{ color: mutedForeground.color }}
                  >
                    Template ID
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="font-medium break-all flex-1">
                      {template.templateId}
                    </p>
                    <button
                      onClick={handleCopyTemplateId}
                      className="flex items-center justify-center w-8 h-8 rounded-lg transition-opacity hover:opacity-80 flex-shrink-0"
                      style={{
                        border: `1px solid ${border.color}`,
                        color: copied ? "#fff" : foreground.color,
                      }}
                      aria-label="Copy template ID"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <span
                    className="text-xs block mb-1"
                    style={{ color: mutedForeground.color }}
                  >
                    Owner
                  </span>
                  <div className="flex items-center gap-2">
                    {template.owner?.profilePic && (
                      <img
                        src={template.owner.profilePic}
                        alt={template.owner.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    )}
                    <p className="font-medium">
                      {template.owner?.name || "Unknown"}
                    </p>
                  </div>
                </div>

                <div>
                  <span
                    className="text-xs block mb-1"
                    style={{ color: mutedForeground.color }}
                  >
                    Created At
                  </span>
                  <p className="font-medium">
                    {new Date(template.createdAt).toLocaleString()}
                  </p>
                </div>

                {template.updatedAt && (
                  <div>
                    <span
                      className="text-xs block mb-1"
                      style={{ color: mutedForeground.color }}
                    >
                      Last Updated
                    </span>
                    <p className="font-medium">
                      {new Date(template.updatedAt).toLocaleString()}
                    </p>
                  </div>
                )}

                <div>
                  <span
                    className="text-xs block mb-1"
                    style={{ color: mutedForeground.color }}
                  >
                    Visibility
                  </span>
                  <p className="font-medium capitalize">
                    {template.visibility}
                  </p>
                </div>

                <div>
                  <span
                    className="text-xs block mb-1"
                    style={{ color: mutedForeground.color }}
                  >
                    Status
                  </span>
                  <p className="font-medium capitalize">{template.status}</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TemplatePreviewModal;
