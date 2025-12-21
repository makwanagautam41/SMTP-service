import React, { useEffect, useState } from "react";
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
  const [activeTab, setActiveTab] = useState("all");

  const openPreview = (template) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setSelectedTemplate(null);
    setPreviewOpen(false);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    fetchTemplates({
      tab,
      page: 1,
      limit: 10,
    });
  };

  useEffect(() => {
    fetchTemplates({ tab: activeTab, page: 1, limit: 10 });
  }, []);

  return (
    <div
      className="min-h-screen p-2"
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
            backgroundColor: card.color,
            border: `1px solid ${border.color}`,
          }}
        >
          Create Template
        </Link>
      </div>

      {/* SWITCH */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center sm:justify-start">
        {["all", "my", "public"].map((tab) => (
          <button
            key={tab}
            onClick={() => switchTab(tab)}
            className="px-4 py-2 rounded-sm text-sm font-medium transition"
            style={{
              backgroundColor: activeTab === tab ? primary.color : card.color,
              color: activeTab === tab ? "black" : "white",
              border: `1px solid ${border.color}`,
            }}
          >
            {tab === "all"
              ? "All"
              : tab === "my"
              ? "My Templates"
              : "Public Templates"}
          </button>
        ))}
      </div>

      {loading && <p style={{ color: muted.color }}>Loading templates...</p>}

      {!loading && templates.length === 0 && (
        <p style={{ color: muted.color }}>{message || "No templates found"}</p>
      )}

      <div className="space-y-4">
        {templates.length > 0 ? (
          templates.map((template) => (
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
          ))
        ) : (
          <>
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: card.color,
                border: `1px solid ${border.color}`,
              }}
            >
              <p className="text-sm text-center">No templates found</p>
            </div>
          </>
        )}
      </div>

      {pagination?.hasNextPage && (
        <button
          onClick={() =>
            fetchTemplates({
              tab: activeTab,
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
