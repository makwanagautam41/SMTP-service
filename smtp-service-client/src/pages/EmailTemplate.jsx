import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Mail, Eye, ChevronLeft, ChevronRight } from "lucide-react";

import { useEmailTemplate } from "../context/EmailTemplateContext";
import { useAuth } from "../context/AuthContext";
import { useThemeStyles } from "../utils/useThemeStyles";
import TemplatePreviewModal from "../components/TemplatePreviewModal";

const TAB_CONFIG = {
  PUBLIC: "public",
  MY: "my",
};

const ITEMS_PER_PAGE = 9;

const EmailTemplate = () => {
  const {
    publicTemplates,
    myTemplates,
    pagination,
    loading,
    fetchPublicTemplates,
    fetchMyTemplates,
  } = useEmailTemplate();
  const { user } = useAuth();

  const theme = useThemeStyles();
  const {
    background,
    card,
    border,
    primary,
    foreground,
    mutedForeground,
    primaryForeground,
    secondary,
    secondaryForeground,
  } = theme;

  const [activeTab, setActiveTab] = useState(TAB_CONFIG.PUBLIC);
  const [clientPage, setClientPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  //  FETCH DATA BASED ON TAB
  useEffect(() => {
    setClientPage(1);

    if (activeTab === TAB_CONFIG.PUBLIC) {
      fetchPublicTemplates({ page: 1, limit: 10 });
    } else {
      fetchMyTemplates();
    }
  }, [activeTab]);

  /* ---------------------------------------------------
     DATA SOURCE
  --------------------------------------------------- */
  const displayedTemplates =
    activeTab === TAB_CONFIG.PUBLIC ? publicTemplates : myTemplates;

  //  CLIENT PAGINATION
  const totalClientPages = Math.ceil(
    displayedTemplates.length / ITEMS_PER_PAGE
  );

  const startIndex = (clientPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedTemplates = displayedTemplates.slice(startIndex, endIndex);

  const handleClientPageChange = (page) => {
    if (page < 1 || page > totalClientPages) return;
    setClientPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //  LOAD MORE (PUBLIC ONLY)
  const handleLoadMore = async () => {
    if (!pagination?.hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);
    await fetchPublicTemplates({
      page: pagination.page + 1,
      limit: pagination.limit,
    });
    setIsLoadingMore(false);
  };

  const getStatusColor = (status) =>
    status === "active" ? "#10b981" : "#6b7280";

  const getVisibilityColor = (visibility) =>
    visibility === "public" ? primary.color : mutedForeground.color;

  return (
    <div
      className="min-h-screen p-2 md:p-4"
      style={{ backgroundColor: background.color }}
    >
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold flex items-center gap-2"
              style={{ color: foreground.color }}
            >
              <Mail className="w-7 h-7" style={{ color: primary.color }} />
              Email Templates
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: mutedForeground.color }}
            >
              Manage and reuse email templates
            </p>
          </div>

          <Link
            to="/create-template"
            className="px-5 py-2.5 rounded-lg text-sm font-medium"
            style={{
              backgroundColor: primary.color,
              color: primaryForeground.color,
            }}
          >
            + Create Template
          </Link>
        </div>

        {/* TABS */}
        <div className="flex gap-2">
          {user &&
            Object.values(TAB_CONFIG).map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-2.5 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor:
                    activeTab === tab ? primary.color : card.color,
                  color:
                    activeTab === tab
                      ? primaryForeground.color
                      : foreground.color,
                  border: `1px solid ${border.color}`,
                }}
              >
                {tab === "public" ? "Public Templates" : "My Templates"}
              </motion.button>
            ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto">
        {loading && displayedTemplates.length === 0 && (
          <div className="flex justify-center py-20">
            <Loader2
              className="w-12 h-12 animate-spin"
              style={{ color: primary.color }}
            />
          </div>
        )}

        {!loading && displayedTemplates.length === 0 && (
          <div
            className="text-center py-20 rounded-xl"
            style={{
              backgroundColor: card.color,
              border: `1px solid ${border.color}`,
            }}
          >
            <p style={{ color: mutedForeground.color }}>No templates found</p>
          </div>
        )}

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedTemplates.map((template) => (
            <motion.div
              key={template._id}
              className="rounded-xl p-5"
              style={{
                backgroundColor: card.color,
                border: `1px solid ${border.color}`,
              }}
            >
              <h3
                className="font-semibold mb-2 line-clamp-2"
                style={{ color: foreground.color }}
              >
                {template.subject}
              </h3>

              <div className="flex gap-2 mb-3">
                <span
                  className="px-2 py-1 rounded text-xs text-white"
                  style={{
                    backgroundColor: getVisibilityColor(template.visibility),
                  }}
                >
                  {template.visibility}
                </span>

                <span
                  className="px-2 py-1 rounded text-xs text-white"
                  style={{
                    backgroundColor: getStatusColor(template.status),
                  }}
                >
                  {template.status}
                </span>
              </div>

              <button
                onClick={() => {
                  setSelectedTemplate(template);
                  setIsPreviewOpen(true);
                }}
                className="w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                style={{
                  backgroundColor: primary.color,
                  color: primaryForeground.color,
                }}
              >
                <Eye size={16} />
                Preview
              </button>
            </motion.div>
          ))}
        </div>

        {/* CLIENT PAGINATION */}
        {totalClientPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => handleClientPageChange(clientPage - 1)}
              disabled={clientPage === 1}
            >
              <ChevronLeft />
            </button>

            <span style={{ color: mutedForeground.color }}>
              {clientPage} / {totalClientPages}
            </span>

            <button
              onClick={() => handleClientPageChange(clientPage + 1)}
              disabled={clientPage === totalClientPages}
            >
              <ChevronRight />
            </button>
          </div>
        )}

        {/* LOAD MORE (PUBLIC ONLY) */}
        {activeTab === TAB_CONFIG.PUBLIC && pagination?.hasNextPage && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-6 py-3 rounded-lg"
              style={{
                backgroundColor: primary.color,
                color: primaryForeground.color,
              }}
            >
              {isLoadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>

      <TemplatePreviewModal
        isOpen={isPreviewOpen}
        template={selectedTemplate}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};

export default EmailTemplate;
