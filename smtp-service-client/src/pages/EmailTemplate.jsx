import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEmailTemplate } from "../context/EmailTemplateContext";
import { useThemeStyles } from "../utils/useThemeStyles";
import TemplatePreviewModal from "../components/TemplatePreviewModal";

const EmailTemplate = () => {
  const { templates, loading, message, fetchTemplates, pagination } =
    useEmailTemplate();

  const { background, card, border, primary, foreground, muted } =
    useThemeStyles();

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const openPreview = (template) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setSelectedTemplate(null);
    setPreviewOpen(false);
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: background.color }}
    >
      <div className="flex items-center justify-between mb-6">
        <h1
          className="text-xl font-semibold"
          style={{ color: foreground.color }}
        >
          Email Templates
        </h1>

        <Link
          to="/create-template"
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            backgroundColor: primary.color,
            color: primary.foreground,
          }}
        >
          Create Template
        </Link>
      </div>

      {loading && <p style={{ color: muted.color }}>Loading templates...</p>}

      {!loading && templates.length === 0 && (
        <p style={{ color: muted.color }}>{message || "No templates found"}</p>
      )}

      <div className="space-y-4">
        {templates.map((template) => (
          <div
            key={template.templateId}
            className="p-4 rounded-lg"
            style={{
              backgroundColor: card.color,
              border: `1px solid ${border.color}`,
            }}
          >
            <h2 className="font-medium" style={{ color: foreground.color }}>
              {template.subject}
            </h2>

            <p className="text-xs mt-1" style={{ color: muted.color }}>
              {template.visibility.toUpperCase()} • {template.status}
            </p>

            <div className="mt-3 flex justify-end">
              <button
                onClick={() => openPreview(template)}
                className="text-sm font-medium underline"
                style={{ color: primary.color }}
              >
                View Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {pagination?.hasNextPage && (
        <button
          onClick={() =>
            fetchTemplates({
              page: pagination.page + 1,
              limit: pagination.limit,
            })
          }
          className="mt-6 px-4 py-2 rounded-lg text-sm"
          style={{
            backgroundColor: primary.color,
            color: primary.foreground,
          }}
        >
          Load More Templates
        </button>
      )}

      <TemplatePreviewModal
        isOpen={previewOpen}
        template={selectedTemplate}
        onClose={closePreview}
      />
    </div>
  );
};

export default EmailTemplate;
