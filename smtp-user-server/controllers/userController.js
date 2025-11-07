import User from "../models/User.js";
import ApiKey from "../models/ApiKey.js";
import AppCredential from "../models/AppCredential.js";
import Email from "../models/Email.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import axios from "axios";
import { encrypt, decrypt } from "../utils/encryption.util.js";

// Helper: Send token in cookie
const sendTokenResponse = (user, res) => {
  try {
    if (!process.env.JWT_SECRET)
      throw new Error("JWT_SECRET is not defined in .env");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ success: true, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error("JWT Token Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to generate authentication token",
    });
  }
};

// ------------------- USER CONTROLLERS ------------------- //

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { type, name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await User.findOne({ email }).catch(() => null);
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken: hashedToken,
    });
    await user.save();

    const verifyUrl = `${
      process.env.CLIENT_URL || "http://localhost:5173"
    }/verify/${rawToken}`;

    const API_BASE = (
      process.env.SMTP_LITE_BASE_URL ||
      process.env.SMTP_LITE_API_URL ||
      "https://smtp-service-server.vercel.app"
    ).replace(/\/+$/, "");
    const SEND_URL = /\/api\/email\/send$/.test(API_BASE)
      ? API_BASE
      : `${API_BASE}/api/email/send`;
    const EVENTS_URL_BASE = (
      process.env.SMTP_LITE_EVENTS_URL || `${API_BASE}/api/email/events`
    ).replace(/\/+$/, "");
    const API_KEY = process.env.SMTP_LITE_API_KEY || "";

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Helvetica,Arial,sans-serif;background:#f6f7fb;padding:24px;color:#111;">
        <div style="max-width:640px;margin:auto;background:#ffffff;border-radius:12px;box-shadow:0 4px 18px rgba(0,0,0,.06);overflow:hidden">
          <div style="background:#0f172a;color:#ffffff;padding:16px 20px;font-weight:700">Verify your email</div>
          <div style="padding:22px 20px;line-height:1.6">
            <h2 style="margin:0 0 8px;font-size:20px;color:#0f172a;">Hello ${name},</h2>
            <p>Thank you for registering. Please confirm your email address to activate your account.</p>
            <p style="margin:18px 0">
              <a href="${verifyUrl}" style="background:#4f46e5;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;display:inline-block">Confirm email</a>
            </p>
            <p>If the button does not work, copy and paste this link into your browser:</p>
            <p style="word-break:break-all;color:#334155">${verifyUrl}</p>
            <p style="margin-top:20px;color:#475569;font-size:14px">If you did not create this account, you can ignore this message.</p>
          </div>
          <div style="background:#f8fafc;color:#64748b;padding:12px 20px;font-size:12px;text-align:center">
            This message was sent automatically. Please do not reply.
          </div>
        </div>
      </div>
    `;

    const sendResp = await axios.post(
      SEND_URL,
      {
        type,
        from: process.env.SMTP_RELAY_USER,
        to: email,
        subject: "Verify your email",
        html,
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...(API_KEY ? { "x-api-key": API_KEY } : {}),
        },
      }
    );

    const emailId = sendResp?.data?.id;
    if (!emailId)
      return res
        .status(201)
        .json({ message: "User registered. Verification email queued." });

    const controller = new AbortController();
    const timeoutMs = Number(process.env.SMTP_LITE_TIMEOUT_MS || 180000);
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const sse = await fetch(`${EVENTS_URL_BASE}/${emailId}`, {
      headers: { ...(API_KEY ? { "x-api-key": API_KEY } : {}) },
      signal: controller.signal,
    });

    if (!sse.ok || !sse.body) {
      clearTimeout(timer);
      return res
        .status(201)
        .json({ message: "User registered. Verification email queued." });
    }

    const reader = sse.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let finalStatus = "queued";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop();
      for (const chunk of parts) {
        const line = chunk.split("\n").find((l) => l.startsWith("data:"));
        if (!line) continue;
        const json = line.slice(5).trim();
        try {
          const evt = JSON.parse(json);
          if (evt?.status) {
            finalStatus = evt.status;
            if (finalStatus === "sent" || finalStatus === "failed") {
              try {
                await reader.cancel();
              } catch {}
              clearTimeout(timer);
              return res.status(201).json({
                message:
                  finalStatus === "sent"
                    ? "User registered successfully. Verification email sent."
                    : "User registered. Verification email failed to send.",
                emailId,
              });
            }
          }
        } catch {}
      }
    }

    clearTimeout(timer);
    return res.status(201).json({
      message: `User registered. Verification email status: ${finalStatus}.`,
      emailId,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error: " + err.message });
  }
};

// VERIFY USER
export const verifyUser = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) return res.status(400).json({ message: "Token is required" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({ verificationToken: hashedToken });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: "User is already verified" });
    }

    // Verify user
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email })
      .select("+password")
      .catch(() => null);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt
      .compare(password, user.password)
      .catch(() => false);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email first" });

    sendTokenResponse(user, res);

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// GET USER DETAILS
export const getUserDetails = async (req, res) => {
  try {
    if (!req.user || !req.user.id)
      return res.status(401).json({ message: "Not authenticated" });

    const user = await User.findById(req.user.id)
      .select("-password -verificationToken")
      .catch(() => null);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Get User Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// LOGOUT USER
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

// ------------------- API KEY CONTROLLERS ------------------- //

// CREATE API KEY
export const createApiKey = async (req, res) => {
  try {
    const { name } = req.body;

    const userHasAppCredentials = await AppCredential.findOne({
      createdBy: req.user._id,
    });

    if (!userHasAppCredentials) {
      return res.status(403).json({
        message:
          "You must set up your App Credentials before creating an API Key.",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "API key name is required." });
    }

    const key = ApiKey.generateKey();
    const apiKey = new ApiKey({
      user: req.user._id,
      key,
      name: name.trim(),
    });

    await apiKey.save();

    res.status(201).json({
      message: "API Key created successfully.",
      apiKey,
    });
  } catch (err) {
    console.error("Create API Key Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// LIST API KEYS
export const listApiKeys = async (req, res) => {
  try {
    if (!req.user || !req.user._id)
      return res.status(401).json({ message: "Not authenticated" });

    const apiKeys = await ApiKey.find({ user: req.user._id });

    res.json(apiKeys);
  } catch (err) {
    console.error("List API Keys Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// DELETE API KEY
export const deleteApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user || !req.user._id)
      return res.status(401).json({ message: "Not authenticated" });

    const apiKey = await ApiKey.findOneAndDelete({
      _id: id,
      user: req.user._id,
    }).catch(() => null);

    if (!apiKey)
      return res
        .status(404)
        .json({ message: "API Key not found or not yours" });

    res.json({ message: "API Key deleted successfully" });
  } catch (err) {
    console.error("Delete API Key Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// TOGGLE API KEY (Activate / Deactivate)
export const toggleApiKeyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user || !req.user._id)
      return res.status(401).json({ message: "Not authenticated" });

    const apiKey = await ApiKey.findOne({ _id: id, user: req.user._id });
    if (!apiKey)
      return res
        .status(404)
        .json({ message: "API Key not found or not yours" });

    // Toggle the status (true → false, false → true)
    apiKey.active = !apiKey.active;
    await apiKey.save();

    res.json({
      message: `API Key ${
        apiKey.active ? "activated" : "deactivated"
      } successfully`,
      apiKey: {
        id: apiKey._id,
        name: apiKey.name,
        active: apiKey.active,
        key: apiKey.key,
      },
    });
  } catch (err) {
    console.error("Toggle API Key Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// APP credentails
export const createAppCredentials = async (req, res) => {
  try {
    const { appName, appPassword, appUserEmail } = req.body;

    if (!appName || !appPassword || !appUserEmail) {
      return res.status(400).json({
        message: "All fields (appName, appPassword, appUserEmail) are required",
      });
    }

    const passwordPattern = /^[a-z]{4}\s[a-z]{4}\s[a-z]{4}\s[a-z]{4}$/;
    if (!passwordPattern.test(appPassword)) {
      return res.status(400).json({
        message:
          "Invalid appPassword format. It must look like: 'njip ayoi ytgr vlam' (4 groups of 4 lowercase letters separated by spaces).",
      });
    }

    const existingApp = await AppCredential.findOne({
      createdBy: req.user._id,
    });
    if (existingApp) {
      return res.status(400).json({
        message:
          "You have already created app credentials. Multiple credentials are not allowed.",
      });
    }

    const encryptedPassword = encrypt(appPassword);

    const appCredentials = new AppCredential({
      createdBy: req.user._id,
      appName,
      appPassword: encryptedPassword,
      appUserEmail,
    });

    await appCredentials.save();

    return res.status(201).json({
      message: "App credentials created successfully",
      data: {
        _id: appCredentials._id,
        appName: appCredentials.appName,
        appUserEmail: appCredentials.appUserEmail,
        createdAt: appCredentials.createdAt,
      },
    });
  } catch (error) {
    console.error("Create App Credentials Error:", error);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const listAppCredentials = async (req, res) => {
  try {
    const credentials = await AppCredential.findOne({
      createdBy: req.user._id,
    }).select("+appPassword");

    if (!credentials)
      return res.status(404).json({ message: "No credentials found" });

    return res.status(200).json({
      _id: credentials._id,
      appName: credentials.appName,
      appUserEmail: credentials.appUserEmail,
      appPassword: credentials.appPassword,
      createdAt: credentials.createdAt,
      updatedAt: credentials.updatedAt,
    });
  } catch (error) {
    console.error("Toggle API Key Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

export const deleteAppCredentials = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const appCredentialDetails = await AppCredential.findOneAndDelete({
      _id: id,
      createdBy: req.user._id,
    });

    if (!appCredentialDetails) {
      return res.status(404).json({
        message: "App Credentials not found or not owned by you.",
      });
    }

    const deletedApiKeys = await ApiKey.deleteMany({ user: req.user._id });

    console.log(
      `Deleted ${deletedApiKeys.deletedCount} API keys for user ${req.user._id}`
    );

    return res.status(200).json({
      message:
        "App Credentials and all associated API keys deleted successfully.",
    });
  } catch (error) {
    console.error("Delete App Credentials Error:", error);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const viewDecryptedAppCredential = async (req, res) => {
  try {
    const { id } = req.params;

    const appCredential = await AppCredential.findById(id).select(
      "+appPassword createdBy"
    );

    if (!appCredential) {
      return res.status(404).json({ message: "App credentials not found" });
    }

    if (appCredential.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Access denied. You are not the owner of this credential.",
      });
    }

    // Attempt to decrypt
    let decryptedPassword;
    try {
      decryptedPassword = decrypt(appCredential.appPassword);
    } catch (err) {
      console.error("Decryption error:", err);
      return res
        .status(500)
        .json({ message: "Failed to decrypt app password" });
    }

    return res.status(200).json({
      _id: appCredential._id,
      appName: appCredential.appName,
      appUserEmail: appCredential.appUserEmail,
      decryptedAppPassword: decryptedPassword,
      createdAt: appCredential.createdAt,
      updatedAt: appCredential.updatedAt,
    });
  } catch (error) {
    console.error("View Decrypted Credential Error:", error);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

// export const getUserDashboard = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // Aggregate stats
//     const totalEmails = await Email.countDocuments({ user: userId });
//     const sentEmails = await Email.countDocuments({
//       user: userId,
//       status: "sent",
//     });
//     const failedEmails = await Email.countDocuments({
//       user: userId,
//       status: "failed",
//     });
//     const pendingEmails = await Email.countDocuments({
//       user: userId,
//       status: "pending",
//     });

//     // Last sent email
//     const lastSent = await Email.findOne({ user: userId, status: "sent" })
//       .sort({ createdAt: -1 })
//       .select("createdAt subject to");

//     // Recent emails
//     const recentEmails = await Email.find({ user: userId })
//       .sort({ createdAt: -1 })
//       .limit(10);

//     res.json({
//       summary: {
//         totalEmails,
//         sentEmails,
//         failedEmails,
//         pendingEmails,
//         lastSent,
//       },
//       recentEmails,
//     });
//   } catch (err) {
//     console.error("Dashboard Error:", err);
//     res.status(500).json({ message: "Server error: " + err.message });
//   }
// };

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Pagination + Filtering
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // optional: sent, failed, pending, etc.
    const skip = (page - 1) * limit;

    const filter = { user: userId };
    if (status && status !== "all") filter.status = status;

    // Aggregate stats efficiently using one aggregation pipeline
    const stats = await Email.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalEmails = await Email.countDocuments({ user: userId });
    const sentEmails = await Email.countDocuments({
      user: userId,
      status: "sent",
    });
    const failedEmails = await Email.countDocuments({
      user: userId,
      status: "failed",
    });
    const pendingEmails = await Email.countDocuments({
      user: userId,
      status: "pending",
    });

    const summary = {
      totalEmails,
      sentEmails,
      failedEmails,
      pendingEmails,
    };

    stats.forEach((item) => {
      summary.totalEmails += item.count;
      if (item._id === "sent") summary.sentEmails = item.count;
      if (item._id === "failed") summary.failedEmails = item.count;
      if (item._id === "pending") summary.pendingEmails = item.count;
    });

    // Last sent email
    const lastSent = await Email.findOne({ user: userId, status: "sent" })
      .sort({ createdAt: -1 })
      .select("createdAt subject to");

    summary.lastSent = lastSent || null;

    // Paginated emails
    const [recentEmails, totalFiltered] = await Promise.all([
      Email.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("subject to status createdAt"),
      Email.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalFiltered / limit);

    return res.json({
      summary,
      recentEmails,
      pagination: {
        page,
        limit,
        totalFiltered,
        totalPages,
      },
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};
