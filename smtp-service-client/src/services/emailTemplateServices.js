import API from "./api";

const handleRequest = async (axiosPromise) => {
  try {
    const res = await axiosPromise;
    return {
      success: true,
      data: res.data,
      message: res.data?.message || "Success",
    };
  } catch (err) {
    return {
      success: false,
      data: null,
      message:
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Something went wrong",
      status: err.response?.status || 500,
    };
  }
};

export const fetchEmailTemplatesService = async ({
  page = 1,
  limit = 10,
  tab = "all",
  type,
  search,
} = {}) => {
  const params = new URLSearchParams({ page, limit, tab });

  if (type) params.append("type", type);
  if (search) params.append("search", search);

  return await handleRequest(
    API.get(`/users/email-templates?${params.toString()}`)
  );
};

export const createEmailTemplateService = async (templateData) => {
  return await handleRequest(
    API.post("/users/create-email-template", templateData)
  );
};
