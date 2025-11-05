import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Copy,
  Check,
  Mail,
  Key,
  Send,
  AlertCircle,
  HelpCircle,
  Code,
  ExternalLink,
  Zap,
  Radio,
  Lock,
  ChevronDown,
} from "lucide-react";
import { useThemeStyles } from "../utils/useThemeStyles";
import logo from "../../public/logo.png";
import DocumentationSearch from "../components/DocumentationSearch";
import { useTheme } from "../context/ThemeContext";
import ScrollSearchOverlay from "../components/ScrollSearchOverlay";
import CodeBlock from "../components/CodeBlock";

const Documentations = () => {
  const { isSearchOpen, setIsSearchOpen, copiedCode, setCopiedCode } =
    useTheme();

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const {
    theme,
    background,
    foreground,
    primary,
    primaryForeground,
    secondary,
    secondaryForeground,
    muted,
    mutedForeground,
    card,
    cardForeground,
    border,
    hover,
    legacy,
  } = useThemeStyles();

  const examples = {
    curl: `curl -X POST \\
  https://smtp-service-server.vercel.app/api/email/send \\
  -H 'Content-Type: application/json' \\
  -H 'x-api-key: YOUR_API_KEY_HERE' \\
  -d '{
  "to": "recipient@example.com",
  "subject": "Hello from SMTP-LITE",
  "html": "<strong>This is a test email sent via SMTP-LITE.</strong>"
}'`,

    nodeFetch: `// Node.js with native fetch (Node 18+)
const res = await fetch('https://smtp-service-server.vercel.app/api/email/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY_HERE'
  },
  body: JSON.stringify({
    to: 'recipient@example.com',
    subject: 'Hello from SMTP-LITE',
    html: '<strong>This is a test email sent via SMTP-LITE.</strong>'
  })
});
const data = await res.json();
console.log('Email ID:', data.id);

// To check status, poll the status endpoint:
// GET https://smtp-service-server.vercel.app/api/email/status/{email._id}`,

    fetchBrowser: `fetch('https://smtp-service-server.vercel.app/api/email/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY_HERE'
  },
  body: JSON.stringify({
    to: 'recipient@example.com',
    subject: 'Hello from SMTP-LITE',
    html: '<strong>This is a test email sent via SMTP-LITE.</strong>'
  })
}).then(r => r.json()).then(data => {
  console.log('Email ID:', data.id);
  // To check status, poll: GET https://smtp-service-server.vercel.app/api/email/status/{email._id}
}).catch(console.error);`,

    pythonRequests: `import requests

url = 'https://smtp-service-server.vercel.app/api/email/send'
headers = {
  'Content-Type': 'application/json',
  'x-api-key': 'YOUR_API_KEY_HERE'
}
data = {
  'to': 'recipient@example.com',
  'subject': 'Hello from SMTP-LITE',
  'html': '<strong>This is a test email sent via SMTP-LITE.</strong>'
}
res = requests.post(url, json=data, headers=headers)
response_data = res.json()
print('Email ID:', response_data['id'])

# To check status, poll the status endpoint:
# GET https://smtp-service-server.vercel.app/api/email/status/{email._id}`,

    php: `<?php
$url = 'https://smtp-service-server.vercel.app/api/email/send';
$data = array(
    'to' => 'recipient@example.com',
    'subject' => 'Hello from SMTP-LITE',
    'html' => '<strong>This is a test email sent via SMTP-LITE.</strong>'
);

$options = array(
    'http' => array(
        'header'  => "Content-Type: application/json\\r\\n" .
                     "x-api-key: YOUR_API_KEY_HERE\\r\\n",
        'method'  => 'POST',
        'content' => json_encode($data)
    )
);

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

if ($result === FALSE) {
    echo "Error sending email";
} else {
    $response = json_decode($result, true);
    echo "Email ID: " . $response['id'];
    // To check status, poll: GET https://smtp-service-server.vercel.app/api/email/status/{response._id}
}
?>`,

    aspnet: `using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class EmailService
{
    private static readonly HttpClient client = new HttpClient();
    
    public static async Task SendEmail()
    {
        var url = "https://smtp-service-server.vercel.app/api/email/send";
        
        var emailData = new
        {
            to = "recipient@example.com",
            subject = "Hello from SMTP-LITE",
            html = "<strong>This is a test email sent via SMTP-LITE.</strong>"
        };
        
        var json = JsonSerializer.Serialize(emailData);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        
        client.DefaultRequestHeaders.Add("x-api-key", "YOUR_API_KEY_HERE");
        
        var response = await client.PostAsync(url, content);
        var responseString = await response.Content.ReadAsStringAsync();
        
        Console.WriteLine($"Response: {responseString}");
        // To check status, poll: GET https://smtp-service-server.vercel.app/api/email/status/{response._id}
    }
}`,

    sseNode: `// Node.js - Send email and poll for status
const API_URL = "https://smtp-service-server.vercel.app";
const API_KEY = "YOUR_API_KEY_HERE";

// Send email
const sendEmail = async () => {
  const res = await fetch(\`\${API_URL}/api/email/send\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({
      to: "recipient@example.com",
      subject: "Hello from SMTP-LITE",
      html: "<strong>This is a test email sent via SMTP-LITE.</strong>",
    }),
  });

  const data = await res.json();
  console.log("📬 Email queued with ID:", data.id);
  return data.id;
};

// Poll for status
const checkStatus = async (emailId) => {
  const res = await fetch(\`\${API_URL}/api/email/status/\${data._id}\`, {
    headers: { "x-api-key": API_KEY }
  });
  const data = await res.json();
  console.log("📨 Current status:", data.status);
  return data.status;
};

// Poll every 2 seconds until complete
const pollUntilComplete = async (emailId) => {
  const interval = setInterval(async () => {
    const status = await checkStatus(emailId);
    if (status === "sent" || status === "failed") {
      console.log("✅ Final status:", status);
      clearInterval(interval);
    }
  }, 2000);
};

// Run
(async () => {
  const id = await sendEmail();
  await pollUntilComplete(id);
})();`,
    sseBrowser: `// Browser - Send email and poll for status
async function sendAndTrackEmail() {
  // Send email
  const res = await fetch('https://smtp-service-server.vercel.app/api/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'YOUR_API_KEY_HERE'
    },
    body: JSON.stringify({
      to: 'recipient@example.com',
      subject: 'Hello from Browser',
      html: '<strong>Test email</strong>'
    })
  });
  
  const data = await res.json();
  console.log('📬 Email queued:', data.id);
  
  // Poll for status every 2 seconds
  const pollInterval = setInterval(async () => {
    const statusRes = await fetch(
      \`https://smtp-service-server.vercel.app/api/email/status/\${data._id}\`,
      { headers: { 'x-api-key': 'YOUR_API_KEY_HERE' } }
    );
    
    const statusData = await statusRes.json();
    console.log('📨 Status:', statusData.status);
    
    // Update UI
    document.getElementById('status').textContent = statusData.status;
    
    if (statusData.status === 'sent' || statusData.status === 'failed') {
      clearInterval(pollInterval);
      console.log('✅ Email delivery complete');
    }
  }, 2000);
}`,

    ssePython: `# Python - Send email and poll for status
import requests
import time

API_URL = 'https://smtp-service-server.vercel.app'
API_KEY = 'YOUR_API_KEY_HERE'

# Send email
url = f'{API_URL}/api/email/send'
headers = {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
}
data = {
    'to': 'recipient@example.com',
    'subject': 'Hello from Python',
    'html': '<strong>Test email</strong>'
}

res = requests.post(url, json=data, headers=headers)
email_data = res.json()
email_id = email_data['id']
print(f'📬 Email queued: {email_id}')

# Poll for status
while True:
    status_res = requests.get(
        f'{API_URL}/api/email/status/{email_data._id}',
        headers={'x-api-key': API_KEY}
    )
    status_data = status_res.json()
    print(f'📨 Status: {status_data["status"]}')
    
    if status_data['status'] in ['sent', 'failed']:
        print('✅ Email delivery complete')
        break
    
    time.sleep(2)  # Wait 2 seconds before next poll`,
  };

  const fixBarItems = [
    { id: "overview", icon: <HelpCircle size={16} />, label: "Overview" },
    {
      id: "app-credentials",
      icon: <Lock size={16} />,
      label: "APP Credentials",
    },
    { id: "auth", icon: <Key size={16} />, label: "Authentication" },
    { id: "send", icon: <Send size={16} />, label: "Send Email API" },
    { id: "tracking", icon: <Zap size={16} />, label: "Email Tracking API" },
    { id: "examples", icon: <Code size={16} />, label: "Code Examples" },
    { id: "responses", icon: <AlertCircle size={16} />, label: "Responses" },
  ];

  const documentationSections = useMemo(
    () => [
      {
        id: "overview",
        title: "Overview",
        icon: <HelpCircle size={16} />,
        description:
          "SMTP-LITE is an email API service that provides delivery tracking via simple API polling. You can send emails through the API and check their status using a unique email ID.",
        content: [
          "Track email delivery status using polling",
          "Simple REST API with JSON payloads",
          "Secure authentication with API keys",
          "Supports Node.js, PHP, ASP.NET, Python, and browsers",
          "Lightweight and reliable delivery tracking system",
        ],
      },
      {
        id: "send",
        title: "Send Email API",
        icon: <Send size={16} />,
        description:
          "POST https://smtp-service-server.vercel.app/api/email/send",
        content: [
          "Required headers: Content-Type (application/json) and x-api-key",
          "Request body fields: to (recipient email), subject (email subject), html (email body)",
          "Returns success response with email ID when queued successfully",
        ],
      },
      {
        id: "tracking",
        title: "Email Status Tracking (Polling)",
        icon: <Radio size={16} />,
        description:
          "SMTP-LITE provides a simple endpoint to check email delivery status by polling at intervals (e.g., every 2 seconds).",
        content: [
          "Send an email via /api/email/send and receive a unique email ID",
          "Call /api/email/status/:id to check the current delivery status",
          "Recommended polling interval: every 2–3 seconds",
          "Status progression: pending → sending → sent/failed",
          "Stop polling when final status (sent/failed) is received",
          "Lightweight and compatible with all environments including Vercel",
        ],
      },
      {
        id: "app-credentials",
        title: "App Credentials (SMTP Access)",
        icon: <Lock size={16} />,
        description:
          "To send emails securely using your own Google account, you need to set up App Credentials consisting of your App Name, Google Account Email, and Google App Password.",
        content: [
          "Enable 2-Step Verification in your Google account",
          "Create Google App Password from myaccount.google.com/apppasswords",
          "Your app password is securely encrypted using AES-256 encryption",
          "Credentials are only decrypted temporarily when sending emails",
        ],
      },
      {
        id: "auth",
        title: "Authentication",
        icon: <Key size={16} />,
        description:
          "All API requests require an API key. Include it in the x-api-key header of every request.",
        content: [
          "Get your API key from API Keys Management page",
          "App Credentials must be added before creating API keys",
          "Never expose your API key in client-side code",
          "Use environment variables and make API calls from backend",
        ],
      },

      {
        id: "examples",
        title: "Code Examples",
        icon: <Code size={16} />,
        description:
          "Complete code examples for various programming languages and platforms using polling",
        subsections: [
          {
            title: "PHP Example",
            content:
              "Use file_get_contents or cURL to send emails and poll /status/:id every few seconds.",
          },
          {
            title: "ASP.NET (C#) Example",
            content:
              "Use HttpClient to send emails and periodically request status updates.",
          },
          {
            title: "Node.js Example",
            content:
              "Send emails via fetch() or axios and poll /status/:id in intervals.",
          },
          {
            title: "Browser Example",
            content:
              "Use fetch() to call /status/:id every 2 seconds and update the UI dynamically.",
          },
          {
            title: "Python Example",
            content:
              "Use requests to send email and a simple loop to check /status/:id.",
          },
        ],
      },
      {
        id: "responses",
        title: "API Responses",
        icon: <AlertCircle size={16} />,
        description: "Understanding API response codes and formats",
        content: [
          "Success Response (200): Email queued successfully with ID",
          "GET /status/:id returns the latest delivery status",
          "Error Response (400): Invalid request body or missing fields",
          "Error Response (401): Invalid or missing API key",
          "Error Response (404): Email ID not found",
          "Error Response (500): Server error",
        ],
      },
    ],
    []
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className="min-h-screen text-gray-800"
      style={{
        backgroundColor: background.color,
        color: foreground.color,
      }}
    >
      <ScrollSearchOverlay />
      <div className="max-w-6xl mx-auto p-2">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3 mt-2">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img
                src={logo}
                alt="SMTP-LITE Logo"
                className="w-10 h-10 object-contain"
              />
              <h1 className="text-3xl font-bold">API Documentation</h1>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <Link
              to="/apikeys"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-700 transition"
              style={{
                backgroundColor: primary.color,
                color: primaryForeground.color,
              }}
            >
              <Key size={18} />
              Get API Key
            </Link>
            <Link
              to={"/quick-start"}
              className="inline-flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-md transition"
              style={{
                borderColor: border.color,
                color: foreground.color,
              }}
            >
              <Code size={18} />
              Quick Start
            </Link>
          </div>
        </header>

        {/* Main */}
        <main className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <nav className="md:col-span-1 md:sticky md:top-4 self-start">
            <div
              className="rounded-lg shadow p-4"
              style={{
                backgroundColor: card.color,
                border: `1px solid ${border.color}`,
              }}
            >
              <ul className="space-y-1 text-sm">
                {fixBarItems.map(({ id, icon, label }) => (
                  <li key={id}>
                    <button
                      onClick={(e) => scrollToSection(e, id)}
                      className="w-full cursor-pointer flex items-center gap-2 py-2 px-3 rounded text-left transition duration-200"
                      style={{
                        backgroundColor: "transparent",
                        color: foreground.color,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          hover.background;
                        e.currentTarget.style.color = hover.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = foreground.color;
                      }}
                    >
                      {icon}
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Content */}
          <article className="md:col-span-3 space-y-8">
            {/* Overview */}
            <section
              id="overview"
              className="rounded-lg shadow p-6"
              style={{
                backgroundColor: card.color,
                border: `1px solid ${border.color}`,
              }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <HelpCircle className="text-blue-600" />
                Overview
              </h2>
              <p
                className="leading-relaxed mb-3"
                style={{ color: mutedForeground.color }}
              >
                SMTP-LITE is an worker-driven email API service that provides
                email sending functionality without much configurations. Our
                System is totaly worker based that select the latest email and
                sends that email to customer.
              </p>
              <div
                className="p-4 rounded mt-4 transition-colors duration-300"
                style={{
                  backgroundColor: secondary.color,
                  borderLeft: `4px solid ${primary.color}`,
                  color: foreground.color,
                }}
              >
                <h3
                  className="font-semibold mb-2"
                  style={{ color: primary.color }}
                >
                  Key Features:
                </h3>
                <ul
                  className="space-y-1 text-sm list-disc list-inside"
                  style={{ color: mutedForeground.color }}
                >
                  <li>Polling required – email status updates</li>
                  <li>Simple REST API with JSON payloads</li>
                  <li>
                    Works with Node.js, Python, PHP, ASP.NET, and browsers
                  </li>
                  <li>Worker-driven architecture for scalability</li>
                </ul>
              </div>
            </section>

            {/* APP Credentials */}
            <section
              id="app-credentials"
              className="rounded-lg shadow p-6 transition-colors duration-300 mt-10"
              style={{
                backgroundColor: card.color,
                color: foreground.color,
                border: `1px solid ${border.color}`,
              }}
            >
              <h2
                className="text-2xl font-bold mb-4 flex items-center gap-2"
                style={{ color: primary.color }}
              >
                <Lock style={{ color: primary.color }} />
                App Credentials (SMTP Access)
              </h2>

              <p
                className="leading-relaxed mb-4"
                style={{ color: mutedForeground.color }}
              >
                To send emails securely using your own Google account, you need
                to set up <strong>App Credentials</strong>. These credentials
                consist of your <strong>App Name</strong>,{" "}
                <strong>Google Account Email</strong>, and a{" "}
                <strong>Google App Password</strong>. This password is{" "}
                <em>not your normal Gmail password</em> — it’s a special one
                generated by Google for third-party apps like this system.
              </p>

              {/* How to Create Google App Password */}
              <div
                className="p-4 rounded mb-4 transition-colors duration-300"
                style={{
                  backgroundColor: secondary.color,
                  borderLeft: `4px solid ${primary.color}`,
                }}
              >
                <h4
                  className="font-semibold mb-2"
                  style={{ color: primary.color }}
                >
                  🧭 How to Create a Google App Password
                </h4>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>
                    Go to manage your google account and Enable{" "}
                    <strong>2-Step Verification</strong> if not already enabled.
                  </li>
                  <li>
                    Visit{" "}
                    <a
                      href="https://myaccount.google.com/apppasswords"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline inline-flex items-center gap-1 transition-colors duration-200"
                      style={{ color: "blue" }}
                    >
                      Create and manage your app password{" "}
                      <ExternalLink size={14} />
                    </a>
                  </li>
                  <li>
                    Give it app name then click <strong>Create</strong>.
                  </li>
                  <li>
                    Copy the generated app password (looks like{" "}
                    <code
                      className="px-2 py-1 rounded text-sm"
                      style={{
                        backgroundColor: muted.color,
                        color: mutedForeground.color,
                      }}
                    >
                      flxi ayoi tfmt vlam
                    </code>{" "}
                    ) and paste it when creating your App Credentials in our
                    website.
                  </li>
                </ol>
              </div>

              {/* Security Info */}
              <div
                className="p-4 rounded transition-colors duration-300"
                style={{
                  backgroundColor: muted.color,
                  borderLeft: `4px solid ${primary.color}`,
                }}
              >
                <h4
                  className="font-semibold mb-2"
                  style={{ color: primary.color }}
                >
                  🔐 Security & Encryption
                </h4>
                <p className="text-sm" style={{ color: mutedForeground.color }}>
                  Your app password is <strong>securely encrypted</strong> using
                  industry-grade AES-256 encryption before being stored. Even if
                  our database is compromised, your credentials remain
                  unreadable. They’re only decrypted temporarily and securely
                  inside our mail worker when sending emails.
                </p>
              </div>

              {/* Link to Manage App Credentials */}
              <div
                className="mt-4 p-4 rounded transition-colors duration-300"
                style={{
                  backgroundColor: secondary.color,
                  borderLeft: `4px solid ${primary.color}`,
                }}
              >
                <p className="text-sm" style={{ color: foreground.color }}>
                  <strong>Manage your App Credentials:</strong> Visit{" "}
                  <Link
                    to="/app-credentials"
                    className="inline-flex underline items-center gap-1 transition-colors duration-200"
                    style={{
                      color: "blue",
                    }}
                  >
                    App Credentials Setup <ExternalLink size={14} />
                  </Link>
                </p>
              </div>
            </section>

            {/* Authentication */}
            <section
              id="auth"
              className="rounded-lg shadow p-6 transition-colors duration-300"
              style={{
                backgroundColor: card.color,
                color: foreground.color,
                border: `1px solid ${border.color}`,
              }}
            >
              <h2
                className="text-2xl font-bold mb-4 flex items-center gap-2"
                style={{ color: primary.color }}
              >
                <Key style={{ color: primary.color }} />
                Authentication
              </h2>

              <p
                className="leading-relaxed mb-4"
                style={{ color: mutedForeground.color }}
              >
                All API requests require an API key. Include it in the{" "}
                <code
                  className="px-2 py-1 rounded text-sm"
                  style={{
                    backgroundColor: muted.color,
                    color: mutedForeground.color,
                  }}
                >
                  x-api-key
                </code>{" "}
                header of every request.
              </p>

              {/* Info Box */}
              <div
                className="p-4 rounded transition-colors duration-300"
                style={{
                  backgroundColor: secondary.color,
                  borderLeft: `4px solid ${primary.color}`,
                }}
              >
                <p className="text-sm" style={{ color: foreground.color }}>
                  <strong>Get your API key:</strong> Visit{" "}
                  <Link
                    to="/apikeys"
                    className="inline-flex items-center gap-1 transition-colors duration-200"
                    style={{
                      color: "blue",
                    }}
                  >
                    API Keys Management <ExternalLink size={14} />
                  </Link>
                </p>
              </div>

              {/* 🚨 New Notice: App Credentials Requirement */}
              <div
                className="mt-4 p-4 rounded flex items-start gap-2 transition-colors duration-300"
                style={{
                  backgroundColor: "#fff7e6",
                  borderLeft: `4px solid #f59e0b`,
                }}
              >
                <span className="text-xl">⚠️</span>
                <div>
                  <h4
                    className="font-semibold mb-1"
                    style={{ color: "#92400e" }}
                  >
                    App Credentials Required
                  </h4>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#78350f" }}
                  >
                    Before creating an API key, please add your App Credentials
                    under{" "}
                    <Link
                      to="/app-credentials"
                      className="underline font-medium transition-colors duration-200"
                      style={{ color: "blue" }}
                    >
                      SMTP App Credentials
                    </Link>
                    . Only users with valid credentials can generate API keys.
                  </p>
                </div>
              </div>

              {/* Security Warning Box */}
              <div
                className="mt-4 p-4 rounded transition-colors duration-300"
                style={{
                  backgroundColor: muted.color,
                  borderLeft: `4px solid ${primary.color}`,
                }}
              >
                <h4
                  className="font-semibold mb-2"
                  style={{ color: primary.color }}
                >
                  🔒 Security Note:
                </h4>
                <p className="text-sm" style={{ color: mutedForeground.color }}>
                  Never expose your API key in client-side code. Use environment
                  variables and make API calls from your backend server.
                </p>
              </div>
            </section>

            {/* Send Email API */}
            <section
              id="send"
              className="rounded-lg shadow p-6 transition-colors duration-300"
              style={{
                backgroundColor: card.color,
                color: foreground.color,
                border: `1px solid ${border.color}`,
              }}
            >
              <h2
                className="text-2xl font-bold mb-4 flex items-center gap-2"
                style={{ color: primary.color }}
              >
                <Send style={{ color: primary.color }} />
                Send Email API
              </h2>

              {/* Endpoint Section */}
              <div className="mb-6">
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: foreground.color }}
                >
                  Endpoint
                </h3>
                <div
                  className="p-4 rounded-lg font-mono text-sm"
                  style={{
                    backgroundColor: secondary.color,
                    color: secondaryForeground.color,
                    border: `1px solid ${border.color}`,
                  }}
                >
                  POST https://smtp-service-server.vercel.app/api/email/send
                </div>
              </div>

              {/* Headers Table */}
              <div className="mb-6">
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: foreground.color }}
                >
                  Headers
                </h3>
                <table
                  className="w-full border-collapse text-sm rounded overflow-hidden"
                  style={{ border: `1px solid ${border.color}` }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: secondary.color,
                        color: secondaryForeground.color,
                      }}
                    >
                      <th
                        className="p-3 text-left"
                        style={{ border: `1px solid ${border.color}` }}
                      >
                        Header
                      </th>
                      <th
                        className="p-3 text-left"
                        style={{ border: `1px solid ${border.color}` }}
                      >
                        Value
                      </th>
                      <th
                        className="p-3 text-left"
                        style={{ border: `1px solid ${border.color}` }}
                      >
                        Required
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      style={{
                        backgroundColor: card.color,
                        color: foreground.color,
                      }}
                    >
                      <td
                        className="p-3 font-mono"
                        style={{ border: `1px solid ${border.color}` }}
                      >
                        Content-Type
                      </td>
                      <td
                        className="p-3 font-mono"
                        style={{ border: `1px solid ${border.color}` }}
                      >
                        application/json
                      </td>
                      <td
                        className="p-3 font-semibold"
                        style={{
                          border: `1px solid ${border.color}`,
                          color: primary.color,
                        }}
                      >
                        Yes
                      </td>
                    </tr>
                    <tr
                      style={{
                        backgroundColor: card.color,
                        color: foreground.color,
                      }}
                    >
                      <td
                        className="p-3 font-mono"
                        style={{ border: `1px solid ${border.color}` }}
                      >
                        x-api-key
                      </td>
                      <td
                        className="p-3"
                        style={{ border: `1px solid ${border.color}` }}
                      >
                        Your API key
                      </td>
                      <td
                        className="p-3 font-semibold"
                        style={{
                          border: `1px solid ${border.color}`,
                          color: primary.color,
                        }}
                      >
                        Yes
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Request Body Table */}
              <div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: foreground.color }}
                >
                  Request Body
                </h3>
                <table
                  className="w-full border-collapse text-sm rounded overflow-hidden"
                  style={{ border: `1px solid ${border.color}` }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: secondary.color,
                        color: secondaryForeground.color,
                      }}
                    >
                      <th
                        className="p-3 text-left"
                        style={{ border: `1px solid ${border.color}` }}
                      >
                        Field
                      </th>
                      <th
                        className="p-3 text-left"
                        style={{ border: `1px solid ${border.color}` }}
                      >
                        Type
                      </th>
                      <th
                        className="p-3 text-left"
                        style={{ border: `1px solid ${border.color}` }}
                      >
                        Required
                      </th>
                      <th
                        className="p-3 text-left"
                        style={{ border: `1px solid ${border.color}` }}
                      >
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        field: "to",
                        type: "string",
                        desc: "Recipient email address",
                      },
                      {
                        field: "subject",
                        type: "string",
                        desc: "Email subject line",
                      },
                      {
                        field: "html",
                        type: "string",
                        desc: "HTML email body",
                      },
                    ].map((row, index) => (
                      <tr
                        key={index}
                        style={{
                          backgroundColor: card.color,
                          color: foreground.color,
                        }}
                      >
                        <td
                          className="p-3 font-mono"
                          style={{ border: `1px solid ${border.color}` }}
                        >
                          {row.field}
                        </td>
                        <td
                          className="p-3"
                          style={{ border: `1px solid ${border.color}` }}
                        >
                          {row.type}
                        </td>
                        <td
                          className="p-3 font-semibold"
                          style={{
                            border: `1px solid ${border.color}`,
                            color: primary.color,
                          }}
                        >
                          Yes
                        </td>
                        <td
                          className="p-3"
                          style={{ border: `1px solid ${border.color}` }}
                        >
                          {row.desc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* tracking Endpoint */}
            <section
              id="tracking"
              className="rounded-lg shadow p-6 transition-colors duration-300"
              style={{
                backgroundColor: card.color,
                color: foreground.color,
                border: `1px solid ${border.color}`,
              }}
            >
              <h2
                className="text-2xl font-bold mb-4 flex items-center gap-2"
                style={{ color: primary.color }}
              >
                <Zap style={{ color: primary.color }} />
                Email Tracking Endpoint
              </h2>

              {/* Endpoint Section */}
              <div className="mb-6">
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: foreground.color }}
                >
                  Endpoint
                </h3>
                <div
                  className="p-4 rounded-lg font-mono text-sm"
                  style={{
                    backgroundColor: muted.color,
                    color: mutedForeground.color,
                    border: `1px solid ${border.color}`,
                  }}
                >
                  GET
                  https://smtp-service-server.vercel.app/api/email/status/:id
                </div>
                <p
                  className="text-sm mt-2"
                  style={{ color: mutedForeground.color }}
                >
                  Replace{" "}
                  <code
                    className="px-2 py-1 rounded"
                    style={{
                      backgroundColor: secondary.color,
                      color: secondaryForeground.color,
                    }}
                  >
                    :id
                  </code>{" "}
                  with the email ID returned from the send endpoint.
                </p>
              </div>

              {/* Event Stream Format */}
              <div className="mb-6">
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: foreground.color }}
                >
                  Event Stream Format
                </h3>
                <p className="mb-3" style={{ color: mutedForeground.color }}>
                  The server will send JSON events as the email status changes:
                </p>
                <CodeBlock
                  code={`// Status updates sent via SSE
{"id": "68ff93116cd6d04590c93716","status": "pending", "timestamp": "2025-01-15T10:30:00Z"}
{"id": "68ff93116cd6d04590c93716","status": "sending", "timestamp": "2025-01-15T10:30:05Z"}
{"id": "68ff93116cd6d04590c93716","status": "sent", "timestamp": "2025-01-15T10:30:10Z"}`}
                  language="json"
                  id="sse-format"
                />
              </div>

              {/* Status Flow */}
              <div
                className="p-4 rounded border-l-4"
                style={{
                  backgroundColor: secondary.color,
                  borderColor: primary.color,
                }}
              >
                <h4
                  className="font-semibold mb-2"
                  style={{ color: primary.color }}
                >
                  Status Flow:
                </h4>
                <div
                  className="flex items-center gap-2 text-sm flex-wrap"
                  style={{ color: foreground.color }}
                >
                  <span
                    className="px-3 py-1 rounded"
                    style={{
                      backgroundColor: muted.color,
                      color: mutedForeground.color,
                    }}
                  >
                    pending
                  </span>
                  <span>→</span>
                  <span
                    className="px-3 py-1 rounded"
                    style={{
                      backgroundColor: muted.color,
                      color: foreground.color,
                    }}
                  >
                    sending
                  </span>
                  <span>→</span>
                  <span
                    className="px-3 py-1 rounded"
                    style={{
                      backgroundColor: primary.color,
                      color: primaryForeground.color,
                    }}
                  >
                    sent
                  </span>
                  <span>/</span>
                  <span
                    className="px-3 py-1 rounded"
                    style={{
                      backgroundColor: hover.secondary,
                      color: hover.foreground,
                    }}
                  >
                    failed
                  </span>
                </div>
              </div>
            </section>

            {/* Examples */}
            <section
              id="examples"
              className="rounded-lg shadow p-6 transition-colors duration-300"
              style={{
                backgroundColor: card.color,
                color: foreground.color,
                border: `1px solid ${border.color}`,
              }}
            >
              <h2
                className="text-2xl font-bold mb-6 flex items-center gap-2"
                style={{ color: primary.color }}
              >
                <Code style={{ color: primary.color }} />
                Code Examples
              </h2>

              <div className="space-y-8">
                {/* Basic Email Sending */}
                <div>
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{ color: foreground.color }}
                  >
                    Basic Email Sending
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4
                        className="text-lg font-semibold mb-3"
                        style={{ color: primary.color }}
                      >
                        PHP
                      </h4>
                      <CodeBlock code={examples.php} language="php" id="php" />
                    </div>

                    <div>
                      <h4
                        className="text-lg font-semibold mb-3"
                        style={{ color: primary.color }}
                      >
                        ASP.NET (C#)
                      </h4>
                      <CodeBlock
                        code={examples.aspnet}
                        language="csharp"
                        id="aspnet"
                      />
                    </div>
                  </div>
                </div>

                {/* Real-Time Tracking */}
                <div>
                  <div className="space-y-6">
                    <div>
                      <h4
                        className="text-lg font-semibold mb-3"
                        style={{ color: primary.color }}
                      >
                        Node.js
                      </h4>
                      <CodeBlock
                        code={examples.sseNode}
                        language="javascript"
                        id="sse-node"
                      />
                    </div>

                    <div>
                      <h4
                        className="text-lg font-semibold mb-3"
                        style={{ color: primary.color }}
                      >
                        Browser with EventSource
                      </h4>
                      <CodeBlock
                        code={examples.sseBrowser}
                        language="javascript"
                        id="sse-browser"
                      />
                    </div>

                    <div>
                      <h4
                        className="text-lg font-semibold mb-3"
                        style={{ color: primary.color }}
                      >
                        Python
                      </h4>
                      <CodeBlock
                        code={examples.ssePython}
                        language="python"
                        id="sse-python"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Responses */}
            <section
              id="responses"
              className="rounded-lg shadow p-6 transition-colors duration-300"
              style={{
                backgroundColor: card.color,
                color: foreground.color,
                border: `1px solid ${border.color}`,
              }}
            >
              <h2
                className="text-2xl font-bold mb-4 flex items-center gap-2"
                style={{ color: primary.color }}
              >
                <AlertCircle style={{ color: primary.color }} />
                API Responses
              </h2>

              <div className="space-y-6">
                <div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: "#16a34a" }}
                  >
                    Success Response (200)
                  </h3>
                  <p
                    className="text-sm mb-2"
                    style={{ color: mutedForeground.color }}
                  >
                    When email is successfully queued:
                  </p>
                  <CodeBlock
                    code={`{
  "success": true,
  "id": "507f1f77bcf86cd799439011",
  "message": "Email queued successfully"
}`}
                    language="json"
                    id="success-response"
                  />
                </div>

                <div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: "#dc2626" }}
                  >
                    Error Response (400/401/500)
                  </h3>
                  <CodeBlock
                    code={`{
  "success": false,
  "error": "Invalid API key"
}`}
                    language="json"
                    id="error-response"
                  />
                </div>

                <div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: primary.color }}
                  >
                    Email Status Updates
                  </h3>
                  <p
                    className="text-sm mb-2"
                    style={{ color: mutedForeground.color }}
                  >
                    Events sent during email delivery:
                  </p>
                  <CodeBlock
                    code={`// Event 1: Email is queued
{"status": "pending", "id": "507f1f77bcf86cd799439011"}

// Event 2: Email is being sent
{"status": "sending", "id": "507f1f77bcf86cd799439011"}

// Event 3: Email sent successfully
{
  "status": "sent",
  "id": "507f1f77bcf86cd799439011",
  "timestamp": "2025-10-27T10:30:00.000Z"
}
`}
                    language="json"
                    id="sse-responses"
                  />
                </div>

                <div
                  className="rounded p-4 border-l-4"
                  style={{
                    backgroundColor: secondary.color,
                    borderLeftColor: "#facc15",
                  }}
                >
                  <h4
                    className="font-semibold mb-2"
                    style={{ color: secondaryForeground.color }}
                  >
                    Common Error Codes
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      [
                        "400",
                        "Invalid request body, missing required fields (to, subject, html)",
                      ],
                      ["401", "Invalid or missing x-api-key header"],
                      ["404", "Email ID not found (for SSE endpoint)"],
                      ["500", "Server error while processing request"],
                    ].map(([code, message]) => (
                      <li key={code} className="flex items-start gap-2">
                        <strong
                          className="min-w-[3rem]"
                          style={{ color: primary.color }}
                        >
                          {code}:
                        </strong>
                        <span style={{ color: mutedForeground.color }}>
                          {message}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Architecture Overview */}
            <section
              id="architecture"
              className="rounded-lg shadow p-6 transition-colors duration-300"
              style={{
                backgroundColor: card.color,
                color: foreground.color,
                border: `1px solid ${border.color}`,
              }}
            >
              <h2
                className="text-2xl font-bold mb-6 flex items-center gap-2"
                style={{ color: primary.color }}
              >
                <Code style={{ color: primary.color }} />
                System Architecture
              </h2>

              <div
                className="rounded-lg p-6 mb-6"
                style={{
                  backgroundColor: muted.color,
                  color: mutedForeground.color,
                }}
              >
                <h3
                  className="font-semibold mb-4"
                  style={{ color: foreground.color }}
                >
                  How SMTP-LITE Works
                </h3>

                <div className="space-y-3 text-sm">
                  {[
                    "Email Queued: Your request is validated and stored in MongoDB with status 'pending'",
                    "Event Emitted: Backend EventEmitter broadcasts the queue event",
                    "Worker Processes: Background worker picks up the email and changes status to 'sending'",
                    "SMTP Delivery: Email sent via Nodemailer through configured SMTP server",
                    "Email Updates: Each status change emits on database and change it status",
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className="rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold"
                        style={{
                          backgroundColor:
                            index === 5 ? "#16a34a" : primary.color,
                          color: card.color,
                        }}
                      >
                        {index === 5 ? "✓" : index + 1}
                      </div>
                      <div>{step}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Technologies */}
              <div className="rounded-lg p-4">
                <h4
                  className="font-semibold mb-3"
                  style={{ color: foreground.color }}
                >
                  Key Technologies
                </h4>

                <ul className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    "Node.js + Express",
                    "MongoDB",
                    "Nodemailer",
                    "EventEmitter",
                    "REST API",
                  ].map((tech, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span style={{ color: "#16a34a" }}>✓</span> {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </article>
        </main>
      </div>
      <DocumentationSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        sections={documentationSections}
      />
    </div>
  );
};

export default Documentations;
