import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEmailTemplate } from "../context/EmailTemplateContext";
import { useThemeStyles } from "../utils/useThemeStyles";
import TemplatePreviewModal from "../components/TemplatePreviewModal";
import { useAuth } from "../context/AuthContext";
import { Loader2, Mail, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const TAB_CONFIG = {
  ALL: "all",
  MY: "my",
  PUBLIC: "public",
};

const EmailTemplate = () => {
  const { templates, loading, fetchTemplates, pagination } = useEmailTemplate();
  const { user } = useAuth();

  const themeStyles = useThemeStyles();
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
  } = themeStyles;
  console.log(templates);
  console.log(pagination);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(TAB_CONFIG.ALL);
  const [displayedTemplates, setDisplayedTemplates] = useState([]);
  const [clientPage, setClientPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 9;

  // Separate templates into user and public based on backend logic
  const separateTemplates = (allTemplates) => {
    if (!allTemplates || !user?._id) {
      return { userTemplates: [], publicTemplates: [] };
    }

    const userTemplates = allTemplates.filter(
      (template) =>
        template.owner === user._id || template.createdBy === user._id
    );

    const publicTemplates = allTemplates.filter(
      (template) =>
        template.owner !== user._id &&
        template.createdBy !== user._id &&
        template.visibility === "public" &&
        template.status === "active"
    );

    return { userTemplates, publicTemplates };
  };

  // Filter templates based on active tab (client-side)
  useEffect(() => {
    const { userTemplates, publicTemplates } = separateTemplates(templates);

    let filtered = [];
    switch (activeTab) {
      case TAB_CONFIG.MY:
        filtered = userTemplates;
        break;
      case TAB_CONFIG.PUBLIC:
        filtered = publicTemplates;
        break;
      case TAB_CONFIG.ALL:
      default:
        filtered = templates;
        break;
    }

    setDisplayedTemplates(filtered);
    setClientPage(1); // Reset to page 1 when tab changes
  }, [templates, activeTab, user]);

  // Initial fetch only once
  useEffect(() => {
    fetchTemplates({ page: 1, limit: 10 });
  }, []);

  const handleTabSwitch = (tabId) => {
    setActiveTab(tabId);
  };

  const handleOpenPreview = (template) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setSelectedTemplate(null);
    setIsPreviewOpen(false);
  };

  const handleClientPageChange = (newPage) => {
    const totalClientPages = Math.ceil(
      displayedTemplates.length / ITEMS_PER_PAGE
    );
    if (newPage < 1 || newPage > totalClientPages) return;

    setClientPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadMoreFromBackend = async () => {
    if (!pagination?.hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);
    await fetchTemplates({
      page: pagination.page + 1,
      limit: pagination.limit || 10,
    });
    setIsLoadingMore(false);
  };

  const getStatusBadgeColor = (status) => {
    return status === "active" ? "#10b981" : "#6b7280";
  };

  const getVisibilityBadgeColor = (visibility) => {
    return visibility === "public" ? primary.color : mutedForeground.color;
  };

  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case TAB_CONFIG.MY:
        return {
          title: "No templates found",
          description: "You haven't created any templates yet",
          showCreateButton: true,
        };
      case TAB_CONFIG.PUBLIC:
        return {
          title: "No public templates",
          description: "No public templates are currently available",
          showCreateButton: false,
        };
      default:
        return {
          title: "No templates found",
          description: "Get started by creating your first template",
          showCreateButton: true,
        };
    }
  };

  const emptyState = getEmptyStateMessage();

  // Calculate client-side pagination
  const totalClientPages = Math.ceil(
    displayedTemplates.length / ITEMS_PER_PAGE
  );
  const startIndex = (clientPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTemplates = displayedTemplates.slice(startIndex, endIndex);

  return (
    <div
      className="min-h-screen p-4 md:p-6"
      style={{ backgroundColor: background.color }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
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
              Manage and create email templates for your application
            </p>
          </div>

          <Link
            to="/create-template"
            className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
            style={{
              backgroundColor: primary.color,
              color: primaryForeground.color,
            }}
          >
            + Create Template
          </Link>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(TAB_CONFIG).map(([key, value]) => (
            <motion.button
              key={value}
              onClick={() => handleTabSwitch(value)}
              className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all relative overflow-hidden"
              style={{
                backgroundColor:
                  activeTab === value ? primary.color : card.color,
                color:
                  activeTab === value
                    ? primaryForeground.color
                    : foreground.color,
                border: `1px solid ${border.color}`,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {key === "ALL"
                ? "All Templates"
                : key === "MY"
                ? "My Templates"
                : "Public Templates"}
              {activeTab === value && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: primaryForeground.color }}
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {/* Loading State */}
        {loading && !templates.length && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2
              className="w-12 h-12 animate-spin mb-4"
              style={{ color: primary.color }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: mutedForeground.color }}
            >
              Loading templates...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && displayedTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 rounded-xl"
            style={{
              backgroundColor: card.color,
              border: `1px solid ${border.color}`,
            }}
          >
            <Mail
              className="w-16 h-16 mb-4 opacity-50"
              style={{ color: mutedForeground.color }}
            />
            <p
              className="text-lg font-medium mb-2"
              style={{ color: foreground.color }}
            >
              {emptyState.title}
            </p>
            <p
              className="text-sm mb-6"
              style={{ color: mutedForeground.color }}
            >
              {emptyState.description}
            </p>
            {emptyState.showCreateButton && (
              <Link
                to="/create-template"
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                style={{
                  backgroundColor: primary.color,
                  color: primaryForeground.color,
                }}
              >
                Create Your First Template
              </Link>
            )}
          </motion.div>
        )}

        {/* Templates Grid */}
        {!loading && displayedTemplates.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {paginatedTemplates.map((template, index) => (
                <motion.div
                  key={template._id || template.templateId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-xl p-5 hover:shadow-lg transition-all"
                  style={{
                    backgroundColor: card.color,
                    border: `1px solid ${border.color}`,
                  }}
                >
                  <div className="mb-4">
                    <h3
                      className="font-semibold text-base mb-2 line-clamp-2"
                      style={{ color: foreground.color }}
                    >
                      {template.subject || "Untitled Template"}
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: getVisibilityBadgeColor(
                            template.visibility
                          ),
                          color: "white",
                        }}
                      >
                        {template.visibility?.toUpperCase() || "PRIVATE"}
                      </span>
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: getStatusBadgeColor(template.status),
                          color: "white",
                        }}
                      >
                        {template.status?.toUpperCase() || "INACTIVE"}
                      </span>
                      {(template.owner === user?._id ||
                        template.createdBy === user?._id) && (
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: "#8b5cf6",
                            color: "white",
                          }}
                        >
                          OWNED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p
                      className="text-xs"
                      style={{ color: mutedForeground.color }}
                    >
                      Type: {template.type || "custom"}
                    </p>
                    {template.createdAt && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: mutedForeground.color }}
                      >
                        Created:{" "}
                        {new Date(template.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenPreview(template)}
                    className="w-full px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90"
                    style={{
                      backgroundColor: primary.color,
                      color: primaryForeground.color,
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    View Template
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Client-side Pagination */}
            {totalClientPages > 1 && (
              <div
                className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 rounded-xl"
                style={{
                  backgroundColor: card.color,
                  border: `1px solid ${border.color}`,
                }}
              >
                <p className="text-sm" style={{ color: mutedForeground.color }}>
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, displayedTemplates.length)} of{" "}
                  {displayedTemplates.length} templates
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleClientPageChange(clientPage - 1)}
                    disabled={clientPage === 1}
                    className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: secondary.color,
                      color: secondaryForeground.color,
                      border: `1px solid ${border.color}`,
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(totalClientPages)].map((_, index) => {
                      const pageNum = index + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalClientPages ||
                        (pageNum >= clientPage - 1 && pageNum <= clientPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handleClientPageChange(pageNum)}
                            className="w-10 h-10 rounded-lg font-medium transition-all"
                            style={{
                              backgroundColor:
                                clientPage === pageNum
                                  ? primary.color
                                  : secondary.color,
                              color:
                                clientPage === pageNum
                                  ? primaryForeground.color
                                  : secondaryForeground.color,
                              border: `1px solid ${border.color}`,
                            }}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === clientPage - 2 ||
                        pageNum === clientPage + 2
                      ) {
                        return (
                          <span
                            key={pageNum}
                            className="px-2"
                            style={{ color: mutedForeground.color }}
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handleClientPageChange(clientPage + 1)}
                    disabled={clientPage === totalClientPages}
                    className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: secondary.color,
                      color: secondaryForeground.color,
                      border: `1px solid ${border.color}`,
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Load More from Backend - Only show on All tab if backend has more */}
            {activeTab === TAB_CONFIG.ALL && pagination?.hasNextPage && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMoreFromBackend}
                  disabled={isLoadingMore}
                  className="px-6 py-3 rounded-lg text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                  style={{
                    backgroundColor: primary.color,
                    color: primaryForeground.color,
                  }}
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading More...
                    </>
                  ) : (
                    "Load More Public Templates"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <TemplatePreviewModal
        isOpen={isPreviewOpen}
        template={selectedTemplate}
        onClose={handleClosePreview}
      />
    </div>
  );
};

export default EmailTemplate;
