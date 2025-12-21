import React, { createContext, useContext, useState } from "react";
import {
  fetchEmailTemplatesService,
  createEmailTemplateService,
} from "../services/emailTemplateServices";

const EmailTemplateContext = createContext();

export const EmailTemplateProvider = ({ children }) => {
  const [templates, setTemplates] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchTemplates = async (options = {}) => {
    setLoading(true);

    const res = await fetchEmailTemplatesService(options);

    if (res.success) {
      const newTemplates = res.data.templates || [];

      // If it's page 1, replace templates. Otherwise, append new public templates
      if (options.page === 1) {
        setTemplates(newTemplates);
      } else {
        // On subsequent pages, we need to:
        // 1. Keep all user templates (they're always included)
        // 2. Add new public templates
        setTemplates((prev) => {
          // Separate previous templates
          const prevUserTemplates = prev.filter(
            (t) =>
              t.owner === res.data.userId || t.createdBy === res.data.userId
          );

          // Get only the new public templates (not duplicates)
          const newPublicTemplates = newTemplates.filter(
            (t) =>
              t.owner !== res.data.userId &&
              t.createdBy !== res.data.userId &&
              !prev.find((p) => p._id === t._id)
          );

          return [...prevUserTemplates, ...newPublicTemplates];
        });
      }

      setPagination(res.data.pagination || null);
      setMessage(res.data.message || "");
    } else {
      setTemplates([]);
      setMessage(res.message);
      console.error("Fetch error:", res.message);
    }

    setLoading(false);
  };

  const createEmailTemplate = async (templateData) => {
    const res = await createEmailTemplateService(templateData);
    return res;
  };

  return (
    <EmailTemplateContext.Provider
      value={{
        templates,
        pagination,
        loading,
        message,
        fetchTemplates,
        createEmailTemplate,
      }}
    >
      {children}
    </EmailTemplateContext.Provider>
  );
};

export const useEmailTemplate = () => useContext(EmailTemplateContext);
