import API from "./api";

// ── Shared handleRequest wrapper ───────────────────────────────────────────────
const handleRequest = async (promise) => {
  try {
    const res = await promise;
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message:
        err.response?.data?.message || err.response?.data?.error || err.message,
    };
  }
};

// ── Template services (main API — localhost:4000) ──────────────────────────────
export const fetchPublicTemplatesService = ({ page = 1, limit = 10 } = {}) => {
  return handleRequest(
    API.get(`/users/email-templates/public?page=${page}&limit=${limit}`)
  );
};

export const fetchMyTemplatesService = () => {
  return handleRequest(API.get("/users/email-templates/my"));
};

export const createEmailTemplateService = async (templateData) => {
  return await handleRequest(
    API.post("/users/create-email-template", templateData)
  );
};

export const updateEmailTemplateService = async (id, templateData) => {
  return await handleRequest(API.patch(`/users/email-templates/${id}`, templateData));
};

export const deleteEmailTemplateService = async (id) => {
  return await handleRequest(API.delete(`/users/email-templates/${id}`));
};

// ── Template variable resolver (SMTP server — localhost:5000) ──────────────────
/**
 * POST /api/users/get-variables  { templateId }
 * Response: { template: { ... }, variables: string[], totalVariables: number }
 */
export const getTemplateVariablesService = async (templateId, signal) => {
  return await handleRequest(
    API.post("/users/get-variables", { templateId }, { signal })
  );
};
