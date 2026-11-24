import ApiKey from "../models/ApiKey.js";

export const apiKeyAuth = async (req, res, next) => {
  try {
    // Require valid API key
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) return res.status(401).json({ error: "API key missing" });

    const key = await ApiKey.findOne({ key: apiKey, active: true }).populate(
      "user"
    );

    if (!key)
      return res.status(403).json({ error: "Invalid or inactive API key" });

    req.apiUser = key.user;
    req.apiKey = key;
    req.fromEmail = key.user.email;
    req.fromUserId = key.user._id;

    // Keep usage accounting lightweight and non-blocking for the send path.
    ApiKey.updateOne({ _id: key._id }, { $inc: { usageCount: 1 }, $set: { lastUsedAt: new Date() } }).catch(() => {});

    next();
  } catch (err) {
    console.error("API Key Auth Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
