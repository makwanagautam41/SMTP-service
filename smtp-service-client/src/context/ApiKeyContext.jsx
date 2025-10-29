import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import {
  fetchApiKeysService,
  createApiKeyService,
  deleteApiKeyService,
  toggleApiKeyStatusService,
} from "../services/apiKeysServices";

const ApiKeyContext = createContext();

export const ApiKeyProvider = ({ children }) => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch API Keys
  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const { data } = await fetchApiKeysService();
      setApiKeys(data || []);
    } catch (err) {
      console.error("Fetch API Keys Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new API Key
  const createApiKey = async (name) => {
    try {
      const res = await createApiKeyService(name);
      if (res.data?.apiKey) {
        setApiKeys((prev) => [res.data.apiKey, ...prev]);
      }
      return res.data;
    } catch (err) {
      console.error("Create API Key Error:", err);
      return { success: false, message: "Failed to create API key" };
    }
  };

  // Delete API Key
  const deleteApiKey = async (id) => {
    try {
      await deleteApiKeyService(id);
      setApiKeys((prev) => prev.filter((key) => key._id !== id));
    } catch (err) {
      console.error("Delete API Key Error:", err);
    }
  };

  const toggleApiKey = async (id) => {
    try {
      const res = await toggleApiKeyStatusService(id);
      if (res.success) {
        // Update the apiKeys state only after server confirms
        setApiKeys((prev) =>
          prev.map((key) =>
            key._id === id ? { ...key, active: !key.active } : key
          )
        );
      }
      return res;
    } catch (err) {
      console.error("Toggle API Key Error:", err);
      return { success: false, message: "Failed to toggle API key" };
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  return (
    <ApiKeyContext.Provider
      value={{
        apiKeys,
        loading,
        fetchApiKeys,
        createApiKey,
        deleteApiKey,
        toggleApiKey,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKeys = () => useContext(ApiKeyContext);
