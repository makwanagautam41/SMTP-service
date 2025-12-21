import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useThemeStyles } from "../utils/useThemeStyles";

const TemplatePreviewModal = ({ isOpen, template, onClose }) => {
  const { card, border, foreground, muted, background } = useThemeStyles();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!template) return null;

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
            className="relative w-full max-w-2xl rounded-2xl shadow-xl p-3 max-h-[80vh] overflow-y-auto"
            style={{
              backgroundColor: card.color,
              border: `1px solid ${border.color}`,
              color: foreground.color,
            }}
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full transition"
              style={{
                backgroundColor: muted.color,
                color: foreground.color,
                border: `1px solid ${border.color}`,
              }}
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-semibold mb-1">{template.subject}</h2>

            <p className="text-xs mb-4" style={{ color: muted.color }}>
              {template.visibility.toUpperCase()} • {template.status}
            </p>

            <div
              className="p-4 rounded-lg text-sm"
              style={{
                backgroundColor: background.color,
                border: `1px solid ${border.color}`,
              }}
              dangerouslySetInnerHTML={{ __html: template.html }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TemplatePreviewModal;
