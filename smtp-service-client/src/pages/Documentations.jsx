import React, { useState } from "react";
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
} from "lucide-react";

const Documentations = () => {
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      alert("Failed to copy: " + err.message);
    }
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
console.log('Email ID:', data.id);`,

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
print('Email ID:', response_data['id'])`,

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
    }
}`,

    sseNode: `import https from "https";

const API_URL = "https://smtp-service-server.vercel.app";
const API_KEY =
  "YOUR_API_KEY_HERE";

// 1️⃣ Send email
const sendEmail = async () => {
  const res = await fetch(\`\${API_URL}/api/email/send\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({
      to = "recipient@example.com",
      subject = "Hello from SMTP-LITE",
      html = "<strong>This is a test email sent via SMTP-LITE.</strong>",
    }),
  });

  const data = await res.json();
  console.log("📬 Email queued with ID:", data.id);
  return data.id;
};

// 2️⃣ Listen to live status using native HTTP (SSE)
const listenForUpdates = (emailId) => {
  console.log("🔗 Connecting to event stream...");

  https.get(\`\${API_URL}/api/email/events/\${emailId}\`, (res) => {
    res.setEncoding("utf8");
    res.on("data", (chunk) => {
      const lines = chunk.split("\\n").filter(Boolean);
      for (const line of lines) {
        if (line.startsWith("data:")) {
          const json = line.replace("data:", "").trim();
          try {
            const event = JSON.parse(json);
            console.log("📡 Status update:", event.status);
            if (event.status === "sent" || event.status === "failed") {
              console.log("✅ Final status:", event.status);
              res.destroy(); // close connection
            }
          } catch {
            // skip malformed data
          }
        }
      }
    });
  });
};

// 3️⃣ Run
(async () => {
  const id = await sendEmail();
  listenForUpdates(id);
})();`,
    sseBrowser: `// Real-time tracking in Browser
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
  
  // Track in real-time using EventSource
  const eventSource = new EventSource(
    \`https://smtp-service-server.vercel.app/api/email/events/\${data.id}\`
  );
  
  eventSource.onmessage = (event) => {
    const update = JSON.parse(event.data);
    console.log('📨 Status update:', update.status);
    
    // Update UI based on status
    document.getElementById('status').textContent = update.status;
    
    if (update.status === 'sent' || update.status === 'failed') {
      eventSource.close();
      console.log('✅ Tracking complete');
    }
  };
  
  eventSource.onerror = (error) => {
    console.error('❌ Connection error:', error);
    eventSource.close();
  };
}`,

    ssePython: `# Real-time tracking with Python
import requests
import json
from sseclient import SSEClient

# Send email
url = 'https://smtp-service-server.vercel.app/api/email/send'
headers = {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY_HERE'
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

# Track in real-time
events_url = f'https://smtp-service-server.vercel.app/api/email/events/{email_id}'
messages = SSEClient(events_url)

for msg in messages:
    if msg.data:
        update = json.loads(msg.data)
        print(f'📨 Status: {update["status"]}')
        
        if update['status'] in ['sent', 'failed']:
            break

print('✅ Tracking complete')`,
  };

  const CodeBlock = ({ code, language, id }) => (
    <div className="relative">
      <div className="absolute top-3 right-3 flex gap-2 items-center">
        <span className="text-xs text-gray-400 uppercase">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition"
          title="Copy code"
        >
          {copiedCode === id ? (
            <Check size={16} className="text-green-400" />
          ) : (
            <Copy size={16} className="text-gray-300" />
          )}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Mail className="text-blue-600" size={32} />
              <h1 className="text-3xl font-bold">
                SMTP‑LITE API Documentation
              </h1>
            </div>
            <p className="mt-1 text-gray-600 max-w-xl">
              Send transactional emails with real-time tracking. Get instant
              status updates via Server-Sent Events (SSE).
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <Link
              to="/apikeys"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <Key size={18} />
              Get API Key
            </Link>
            <button
              onClick={(e) => scrollToSection(e, "getting-started")}
              className="inline-flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-md hover:bg-gray-100 transition"
            >
              <Code size={18} />
              Quick Start
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <nav className="md:col-span-1 md:sticky md:top-4 self-start">
            <div className="bg-white rounded-lg shadow p-4">
              <ul className="space-y-1 text-sm">
                <li>
                  <button
                    onClick={(e) => scrollToSection(e, "overview")}
                    className="w-full flex items-center gap-2 py-2 px-3 rounded hover:bg-blue-50 hover:text-blue-600 transition text-left"
                  >
                    <HelpCircle size={16} />
                    Overview
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => scrollToSection(e, "realtime")}
                    className="w-full flex items-center gap-2 py-2 px-3 rounded hover:bg-blue-50 hover:text-blue-600 transition text-left"
                  >
                    <Radio size={16} />
                    Real-Time Tracking
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => scrollToSection(e, "auth")}
                    className="w-full flex items-center gap-2 py-2 px-3 rounded hover:bg-blue-50 hover:text-blue-600 transition text-left"
                  >
                    <Key size={16} />
                    Authentication
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => scrollToSection(e, "send")}
                    className="w-full flex items-center gap-2 py-2 px-3 rounded hover:bg-blue-50 hover:text-blue-600 transition text-left"
                  >
                    <Send size={16} />
                    Send Email API
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => scrollToSection(e, "sse")}
                    className="w-full flex items-center gap-2 py-2 px-3 rounded hover:bg-blue-50 hover:text-blue-600 transition text-left"
                  >
                    <Zap size={16} />
                    SSE Endpoint
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => scrollToSection(e, "examples")}
                    className="w-full flex items-center gap-2 py-2 px-3 rounded hover:bg-blue-50 hover:text-blue-600 transition text-left"
                  >
                    <Code size={16} />
                    Code Examples
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => scrollToSection(e, "responses")}
                    className="w-full flex items-center gap-2 py-2 px-3 rounded hover:bg-blue-50 hover:text-blue-600 transition text-left"
                  >
                    <AlertCircle size={16} />
                    Responses
                  </button>
                </li>
                <li>
                  <button
                    onClick={(e) => scrollToSection(e, "tips")}
                    className="w-full flex items-center gap-2 py-2 px-3 rounded hover:bg-blue-50 hover:text-blue-600 transition text-left"
                  >
                    <HelpCircle size={16} />
                    Best Practices
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          {/* Content */}
          <article className="md:col-span-3 space-y-8">
            {/* Overview */}
            <section id="overview" className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <HelpCircle className="text-blue-600" />
                Overview
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                SMTP-LITE is an event-driven email API service that provides
                real-time delivery tracking. Unlike traditional email services
                that require polling, SMTP-LITE uses Server-Sent Events (SSE) to
                push status updates instantly to your application.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded mt-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Key Features:
                </h3>
                <ul className="space-y-1 text-sm text-blue-800 list-disc list-inside">
                  <li>Real-time email delivery tracking via SSE</li>
                  <li>No polling required - instant status updates</li>
                  <li>Simple REST API with JSON payloads</li>
                  <li>
                    Works with Node.js, Python, PHP, ASP.NET, and browsers
                  </li>
                  <li>Event-driven architecture for scalability</li>
                </ul>
              </div>
            </section>

            {/* Real-Time Tracking */}
            <section id="realtime" className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Radio className="text-blue-600" />
                Real-Time Tracking System
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                SMTP-LITE uses Server-Sent Events (SSE) to provide live email
                delivery updates without polling.
              </p>

              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                How It Works
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <ol className="space-y-3 text-gray-700">
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">1.</span>
                    <span>
                      Send an email via{" "}
                      <code className="bg-gray-200 px-2 py-1 rounded text-sm">
                        /api/email/send
                      </code>{" "}
                      and receive an email ID
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">2.</span>
                    <span>
                      Connect to{" "}
                      <code className="bg-gray-200 px-2 py-1 rounded text-sm">
                        /api/email/events/:id
                      </code>{" "}
                      using EventSource
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">3.</span>
                    <span>
                      Receive instant status updates as the email moves through
                      stages
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-blue-600">4.</span>
                    <span>
                      Status progression:{" "}
                      <code className="bg-gray-200 px-2 py-1 rounded text-sm">
                        pending → sending → sent/failed
                      </code>
                    </span>
                  </li>
                </ol>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                <h4 className="font-semibold text-green-800 mb-2">
                  Benefits of SSE:
                </h4>
                <ul className="space-y-1 text-sm text-green-700 list-disc list-inside">
                  <li>
                    No polling overhead - server pushes updates automatically
                  </li>
                  <li>Instant notifications when email status changes</li>
                  <li>Native browser support with EventSource API</li>
                  <li>Lightweight and efficient connection management</li>
                  <li>
                    Multiple clients can track the same email simultaneously
                  </li>
                </ul>
              </div>
            </section>

            {/* Authentication */}
            <section id="auth" className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Key className="text-blue-600" />
                Authentication
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All API requests require an API key. Include it in the{" "}
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  x-api-key
                </code>{" "}
                header of every request.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <p className="text-sm text-gray-700">
                  <strong>Get your API key:</strong> Visit{" "}
                  <Link
                    to="/apikeys"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    API Keys Management <ExternalLink size={14} />
                  </Link>
                </p>
              </div>

              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  🔒 Security Note:
                </h4>
                <p className="text-sm text-yellow-700">
                  Never expose your API key in client-side code. Use environment
                  variables and make API calls from your backend server.
                </p>
              </div>
            </section>

            {/* Send Email API */}
            <section id="send" className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Send className="text-blue-600" />
                Send Email API
              </h2>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Endpoint</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  POST https://smtp-service-server.vercel.app/api/email/send
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Headers</h3>
                <table className="w-full border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 p-3 text-left">
                        Header
                      </th>
                      <th className="border border-gray-200 p-3 text-left">
                        Value
                      </th>
                      <th className="border border-gray-200 p-3 text-left">
                        Required
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 p-3 font-mono">
                        Content-Type
                      </td>
                      <td className="border border-gray-200 p-3 font-mono">
                        application/json
                      </td>
                      <td className="border border-gray-200 p-3 text-green-600 font-semibold">
                        Yes
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-3 font-mono">
                        x-api-key
                      </td>
                      <td className="border border-gray-200 p-3">
                        Your API key
                      </td>
                      <td className="border border-gray-200 p-3 text-green-600 font-semibold">
                        Yes
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Request Body</h3>
                <table className="w-full border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 p-3 text-left">
                        Field
                      </th>
                      <th className="border border-gray-200 p-3 text-left">
                        Type
                      </th>
                      <th className="border border-gray-200 p-3 text-left">
                        Required
                      </th>
                      <th className="border border-gray-200 p-3 text-left">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 p-3 font-mono">
                        to
                      </td>
                      <td className="border border-gray-200 p-3">string</td>
                      <td className="border border-gray-200 p-3 text-green-600 font-semibold">
                        Yes
                      </td>
                      <td className="border border-gray-200 p-3">
                        Recipient email address
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-3 font-mono">
                        subject
                      </td>
                      <td className="border border-gray-200 p-3">string</td>
                      <td className="border border-gray-200 p-3 text-green-600 font-semibold">
                        Yes
                      </td>
                      <td className="border border-gray-200 p-3">
                        Email subject line
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-3 font-mono">
                        html
                      </td>
                      <td className="border border-gray-200 p-3">string</td>
                      <td className="border border-gray-200 p-3 text-green-600 font-semibold">
                        Yes
                      </td>
                      <td className="border border-gray-200 p-3">
                        HTML email body
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* SSE Endpoint */}
            <section id="sse" className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Zap className="text-blue-600" />
                Server-Sent Events (SSE) Endpoint
              </h2>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Endpoint</h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  GET
                  https://smtp-service-server.vercel.app/api/email/events/:id
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Replace{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">:id</code>{" "}
                  with the email ID returned from the send endpoint.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Event Stream Format
                </h3>
                <p className="text-gray-700 mb-3">
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

              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                <h4 className="font-semibold text-purple-800 mb-2">
                  Status Flow:
                </h4>
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <span className="bg-yellow-200 px-3 py-1 rounded">
                    pending
                  </span>
                  <span>→</span>
                  <span className="bg-blue-200 px-3 py-1 rounded">sending</span>
                  <span>→</span>
                  <span className="bg-green-200 px-3 py-1 rounded">sent</span>
                  <span>/</span>
                  <span className="bg-red-200 px-3 py-1 rounded">failed</span>
                </div>
              </div>
            </section>

            {/* Examples */}
            <section id="examples" className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Code className="text-blue-600" />
                Code Examples
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    Basic Email Sending
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-3">PHP</h4>
                      <CodeBlock code={examples.php} language="php" id="php" />
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3">
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

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    Real-Time Tracking with SSE
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-3">
                        Node.js with SSE
                      </h4>
                      <CodeBlock
                        code={examples.sseNode}
                        language="javascript"
                        id="sse-node"
                      />
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3">
                        Browser with EventSource
                      </h4>
                      <CodeBlock
                        code={examples.sseBrowser}
                        language="javascript"
                        id="sse-browser"
                      />
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3">
                        Python with SSE
                      </h4>
                      <CodeBlock
                        code={examples.ssePython}
                        language="python"
                        id="sse-python"
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        Note: Requires{" "}
                        <code className="bg-gray-100 px-2 py-1 rounded">
                          sseclient-py
                        </code>{" "}
                        package:
                        <code className="bg-gray-100 px-2 py-1 rounded ml-2">
                          pip install sseclient-py
                        </code>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Responses */}
            <section id="responses" className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="text-blue-600" />
                API Responses
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-green-600">
                    Success Response (200)
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
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
                  <h3 className="text-lg font-semibold mb-2 text-red-600">
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
                  <h3 className="text-lg font-semibold mb-2 text-blue-600">
                    SSE Status Updates
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
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

// Event 3 (Alternative): Email failed
{
  "status": "failed",
  "id": "507f1f77bcf86cd799439011",
  "error": "SMTP connection timeout",
  "timestamp": "2025-10-27T10:30:00.000Z"
}`}
                    language="json"
                    id="sse-responses"
                  />
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    Common Error Codes
                  </h4>
                  <ul className="space-y-2 text-sm text-yellow-900">
                    <li className="flex items-start gap-2">
                      <strong className="min-w-[3rem]">400:</strong>
                      <span>
                        Invalid request body, missing required fields (to,
                        subject, html)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <strong className="min-w-[3rem]">401:</strong>
                      <span>Invalid or missing x-api-key header</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <strong className="min-w-[3rem]">404:</strong>
                      <span>Email ID not found (for SSE endpoint)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <strong className="min-w-[3rem]">500:</strong>
                      <span>Server error while processing request</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Best Practices */}
            <section id="tips" className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <HelpCircle className="text-blue-600" />
                Best Practices & Tips
              </h2>

              <div className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <Zap size={18} />
                    Performance Tips
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-900 list-disc list-inside">
                    <li>
                      Use SSE for real-time tracking instead of polling the API
                      repeatedly
                    </li>
                    <li>
                      Close SSE connections once email reaches final state
                      (sent/failed)
                    </li>
                    <li>
                      Implement connection error handling and automatic
                      reconnection
                    </li>
                    <li>
                      Cache API keys securely on your server, never in
                      client-side code
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
                  <h4 className="font-semibold text-green-800 mb-3">
                    ✓ Email Best Practices
                  </h4>
                  <ul className="space-y-2 text-sm text-green-900 list-disc list-inside">
                    <li>Always validate email addresses before sending</li>
                    <li>
                      Use proper HTML structure with inline CSS for better email
                      client compatibility
                    </li>
                    <li>
                      Include plain text fallback when possible (future feature)
                    </li>
                    <li>
                      Test emails with different email clients (Gmail, Outlook,
                      etc.)
                    </li>
                    <li>Avoid spam trigger words in subject lines</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                  <h4 className="font-semibold text-purple-800 mb-3">
                    🔒 Security Best Practices
                  </h4>
                  <ul className="space-y-2 text-sm text-purple-900 list-disc list-inside">
                    <li>
                      Never expose API keys in client-side JavaScript or public
                      repositories
                    </li>
                    <li>
                      Use environment variables to store API keys securely
                    </li>
                    <li>
                      Make API calls from your backend server, not directly from
                      browsers
                    </li>
                    <li>Rotate API keys periodically for enhanced security</li>
                    <li>Monitor API usage for unusual patterns</li>
                  </ul>
                </div>

                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                  <h4 className="font-semibold text-red-800 mb-3">
                    ✗ Common Issues & Solutions
                  </h4>
                  <div className="space-y-3 text-sm text-red-900">
                    <div>
                      <p className="font-semibold">401 Error - Unauthorized</p>
                      <p className="ml-4 text-red-800">
                        → Check that x-api-key header is included and correct
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Email not received</p>
                      <p className="ml-4 text-red-800">
                        → Check spam/junk folder, verify recipient email address
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">CORS Error in Browser</p>
                      <p className="ml-4 text-red-800">
                        → Make API calls from your backend server instead
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">SSE Connection Timeout</p>
                      <p className="ml-4 text-red-800">
                        → Implement reconnection logic with exponential backoff
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border-l-4 border-gray-600 p-4 rounded">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    📊 Rate Limits & Quotas
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
                    <li>Free tier: 1,000 emails per month</li>
                    <li>Professional tier: 50,000 emails per month</li>
                    <li>Enterprise tier: Custom limits available</li>
                    <li>Rate limit: 100 requests per minute per API key</li>
                    <li>Contact support for higher limits</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <HelpCircle className="text-blue-600" />
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Q: What is Server-Sent Events (SSE)?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    A: SSE is a technology that allows servers to push real-time
                    updates to clients over HTTP. Unlike WebSockets, SSE is
                    unidirectional (server to client) and works seamlessly with
                    existing HTTP infrastructure.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Q: Do I need to poll the API for email status?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    A: No! That's the beauty of SSE. Once you connect to the
                    /api/email/events/:id endpoint, you'll receive automatic
                    updates whenever the email status changes. No polling
                    required.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Q: Can I send attachments?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    A: Attachment support is planned for a future release.
                    Currently, you can include links to hosted files in your
                    email HTML.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Q: How long does the SSE connection stay open?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    A: The connection stays open until the email reaches a final
                    state (sent or failed), or until you manually close it. We
                    recommend closing the connection once you receive the final
                    status.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Q: Can multiple clients track the same email?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    A: Yes! Multiple clients can connect to the same email ID
                    simultaneously and all will receive real-time updates.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Q: What happens if my SSE connection drops?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    A: Implement reconnection logic in your client code. The
                    EventSource API supports automatic reconnection, or you can
                    manually reconnect with exponential backoff.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Q: Is this suitable for marketing emails?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    A: SMTP-LITE is designed for transactional emails (password
                    resets, notifications, confirmations). For marketing
                    campaigns, use a dedicated email marketing platform.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Q: How do I customize the sender email?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    A: The sender email is configured in your account settings.
                    Visit the API Keys page to manage your sender configuration.
                  </p>
                </div>
              </div>
            </section>

            {/* Architecture Overview */}
            <section
              id="architecture"
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Code className="text-blue-600" />
                System Architecture
              </h2>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  How SMTP-LITE Works
                </h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <strong>Email Queued:</strong> Your request is validated
                      and stored in MongoDB with status "pending"
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <strong>Event Emitted:</strong> Backend EventEmitter
                      broadcasts the queue event
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <strong>Worker Processes:</strong> Background worker picks
                      up the email and changes status to "sending"
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold">
                      4
                    </div>
                    <div>
                      <strong>SMTP Delivery:</strong> Email sent via Nodemailer
                      through configured SMTP server
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold">
                      5
                    </div>
                    <div>
                      <strong>Real-Time Updates:</strong> Each status change
                      emits an SSE event to all connected clients
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold">
                      ✓
                    </div>
                    <div>
                      <strong>Final State:</strong> Status becomes "sent" or
                      "failed", clients close SSE connection
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Key Technologies
                </h4>
                <ul className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Node.js + Express
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> MongoDB
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Nodemailer
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> EventEmitter
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Server-Sent Events
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> REST API
                  </li>
                </ul>
              </div>
            </section>
          </article>
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} SMTP‑LITE — Built with{" "}
            <span className="text-red-500">❤️</span> for developers
          </p>
          <p className="mt-2">
            Need help? Contact{" "}
            <span className="text-blue-600">support@smtp-lite.vercel.app</span>
          </p>
          <div className="mt-4 flex justify-center gap-4 text-xs">
            <Link to="/privacy" className="hover:text-gray-700">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-gray-700">
              Terms of Service
            </Link>
            <Link to="/status" className="hover:text-gray-700">
              System Status
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Documentations;
