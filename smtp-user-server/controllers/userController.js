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

    // Send verification email
    try {
      await axios.post(
        "https://smtp-service-server.vercel.app/api/email/send",
        // "http://localhost:5000/api/email/send",
        {
          type,
          from: "makwanagautam411@gmail.com",
          to: email,
          subject: "Verify your account",
          html: `
          <div style="font-family:sans-serif;padding:20px;">
            <h2>Welcome, ${name}!</h2>
            <p>Click below to verify your email:</p>
            <a href="${verifyUrl}" style="padding:10px 20px;background:#4f46e5;color:#fff;border-radius:6px;text-decoration:none;">Verify Email</a>
            <p>Or copy this link: ${verifyUrl}</p>
          </div>
        `,
        }
      );
    } catch (emailErr) {
      console.error("Email Sending Error:", emailErr);
    }

    res.status(201).json({
      message: "User registered successfully. Verification email sent!",
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
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

export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Aggregate stats
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

    // Last sent email
    const lastSent = await Email.findOne({ user: userId, status: "sent" })
      .sort({ createdAt: -1 })
      .select("createdAt subject to");

    // Recent emails
    const recentEmails = await Email.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      summary: {
        totalEmails,
        sentEmails,
        failedEmails,
        pendingEmails,
        lastSent,
      },
      recentEmails,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};
