import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchEmailTemplatesService } from "../services/emailTemplateServices";

const EmailTemplateContext = createContext();

export const EmailTemplateProvider = ({ children }) => {
  const [templates, setTemplates] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchTemplates = async (options = {}) => {
    setLoading(true);

    const res = await fetchEmailTemplatesService(options);
    console.log("Fetch Email Templates Response:", res);

    if (res.success) {
      setTemplates(res.data.templates || []);
      setPagination(res.data.pagination || null);
      setMessage(res.data.message || "");
    } else {
      setTemplates([]);
      setMessage(res.message);
      console.error("Fetch error:", res.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates({ page: 1, limit: 10 });
  }, []);

  return (
    <EmailTemplateContext.Provider
      value={{
        templates,
        pagination,
        loading,
        message,
        fetchTemplates,
      }}
    >
      {children}
    </EmailTemplateContext.Provider>
  );
};

export const useEmailTemplate = () => useContext(EmailTemplateContext);
