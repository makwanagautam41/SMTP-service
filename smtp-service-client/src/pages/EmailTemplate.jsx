import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Loader2, Mail, ChevronLeft, ChevronRight } from "lucide-react";

import { useEmailTemplate } from "../context/EmailTemplateContext";
import { useAuth } from "../context/AuthContext";
import { useThemeStyles } from "../utils/useThemeStyles";
import TemplatePreviewModal from "../components/TemplatePreviewModal";

const TABS = {
  ALL: "all",
  MY: "my",
  PUBLIC: "public",
};

const ITEMS_PER_PAGE = 9;

const EmailTemplate = () => {
  const { templates, pagination, loading, fetchTemplates } = useEmailTemplate();
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

  const [activeTab, setActiveTab] = useState(TABS.ALL);
  const [clientPage, setClientPage] = useState(1);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  /* --------------------------------------------------
     NORMALIZE TEMPLATES (🔥 MAIN FIX 🔥)
  -------------------------------------------------- */
  const safeTemplates = useMemo(() => {
    if (Array.isArray(templates)) return templates;
    if (templates?.data && Array.isArray(templates.data)) return templates.data;
    return [];
  }, [templates]);

  /* --------------------------------------------------
     FILTER BY TAB
  -------------------------------------------------- */
  const filteredTemplates = useMemo(() => {
    if (!user?._id) return [];

    if (activeTab === TABS.MY) {
      return safeTemplates.filter((t) => t.owner === user._id);
    }

    if (activeTab === TABS.PUBLIC) {
      return safeTemplates.filter(
        (t) =>
          t.visibility === "public" &&
          t.status === "active" &&
          t.owner !== user._id
      );
    }

    return safeTemplates;
  }, [safeTemplates, activeTab, user]);

  /* --------------------------------------------------
     CLIENT PAGINATION
  -------------------------------------------------- */
  const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE);
  const start = (clientPage - 1) * ITEMS_PER_PAGE;
  const currentTemplates = filteredTemplates.slice(
    start,
    start + ITEMS_PER_PAGE
  );

  /* --------------------------------------------------
     INITIAL LOAD
  -------------------------------------------------- */
  useEffect(() => {
    fetchTemplates({ page: 1, limit: 10 });
  }, []);

  useEffect(() => {
    setClientPage(1);
  }, [activeTab]);

  /* --------------------------------------------------
     LOAD MORE (BACKEND)
  -------------------------------------------------- */
  const loadMore = async () => {
    if (!pagination?.hasNextPage || loadingMore) return;
    setLoadingMore(true);
    await fetchTemplates({
      page: pagination.page + 1,
      limit: pagination.limit,
    });
    setLoadingMore(false);
  };

  return (
    <div
      className="min-h-screen p-4 md:p-6"
      style={{ backgroundColor: background.color }}
    >
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1
              className="text-3xl font-bold flex items-center gap-2"
              style={{ color: foreground.color }}
            >
              <Mail className="w-7 h-7" style={{ color: primary.color }} />
              Email Templates
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: mutedForeground.color }}
            >
              Manage reusable email templates
            </p>
          </div>

          <Link
            to="/create-template"
            className="px-5 py-2 rounded-lg font-medium"
            style={{
              backgroundColor: primary.color,
              color: primaryForeground.color,
            }}
          >
            + Create Template
          </Link>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mt-6">
          {Object.values(TABS).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: activeTab === tab ? primary.color : card.color,
                color:
                  activeTab === tab
                    ? primaryForeground.color
                    : foreground.color,
                border: `1px solid ${border.color}`,
              }}
            >
              {tab === "all" ? "All" : tab === "my" ? "My Templates" : "Public"}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto">
        {loading && safeTemplates.length === 0 && (
          <div className="flex justify-center py-20">
            <Loader2
              className="animate-spin w-10 h-10"
              style={{ color: primary.color }}
            />
          </div>
        )}

        {!loading && currentTemplates.length === 0 && (
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTemplates.map((t) => (
            <motion.div
              key={t._id}
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
                {t.subject}
              </h3>

              <div className="flex gap-2 mb-3">
                <span className="text-xs px-2 py-1 rounded bg-green-500 text-white">
                  {t.visibility}
                </span>
                <span className="text-xs px-2 py-1 rounded bg-gray-500 text-white">
                  {t.status}
                </span>
              </div>

              <button
                onClick={() => setPreviewTemplate(t)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg"
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
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              disabled={clientPage === 1}
              onClick={() => setClientPage((p) => p - 1)}
            >
              <ChevronLeft />
            </button>
            <span style={{ color: mutedForeground.color }}>
              {clientPage} / {totalPages}
            </span>
            <button
              disabled={clientPage === totalPages}
              onClick={() => setClientPage((p) => p + 1)}
            >
              <ChevronRight />
            </button>
          </div>
        )}

        {/* BACKEND LOAD MORE */}
        {activeTab === "all" && pagination?.hasNextPage && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-6 py-2 rounded-lg"
              style={{
                backgroundColor: primary.color,
                color: primaryForeground.color,
              }}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>

      <TemplatePreviewModal
        isOpen={!!previewTemplate}
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />
    </div>
  );
};

export default EmailTemplate;
