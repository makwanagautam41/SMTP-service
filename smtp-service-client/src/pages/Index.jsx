import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Zap,
  Shield,
  Code,
  CheckCircle,
  ArrowRight,
  Key,
  FileText,
  Clock,
  Globe,
  Users,
  Star,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useThemeStyles } from "../utils/useThemeStyles";
import TextType from "../components/TextType/TextType";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    emailsSent: 0,
    activeUsers: 0,
    uptime: 0,
  });
  const styles = useThemeStyles();

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = {
      emailsSent: 1250000,
      activeUsers: 5420,
      uptime: 99.9,
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setStats({
        emailsSent: Math.floor(targets.emailsSent * progress),
        activeUsers: Math.floor(targets.activeUsers * progress),
        uptime: (targets.uptime * progress).toFixed(1),
      });

      if (step >= steps) {
        clearInterval(timer);
        setStats(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Zap size={32} />,
      title: "Lightning Fast",
      description:
        "Send emails in milliseconds with our optimized infrastructure. No delays, no queues.",
    },
    {
      icon: <Shield size={32} />,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with 99.9% uptime guarantee. Your data is always protected.",
    },
    {
      icon: <Code size={32} />,
      title: "Developer Friendly",
      description:
        "Simple REST API with comprehensive docs. Integrate in minutes with any language.",
    },
    {
      icon: <Globe size={32} />,
      title: "Global Delivery",
      description:
        "Worldwide email delivery with smart routing for optimal performance in every region.",
    },
    {
      icon: <Clock size={32} />,
      title: "Real-time Tracking",
      description:
        "Monitor delivery status, open rates, and engagement metrics in real-time.",
    },
    {
      icon: <Users size={32} />,
      title: "24/7 Support",
      description:
        "Our expert team is always available to help you succeed with your email needs.",
    },
  ];

  const useCases = [
    {
      title: "Password Resets",
      description: "Send secure password reset emails instantly",
      icon: <Key size={24} />,
    },
    {
      title: "Notifications",
      description: "Alert users about important account activities",
      icon: <Mail size={24} />,
    },
    {
      title: "Confirmations",
      description: "Order confirmations, booking receipts, and more",
      icon: <CheckCircle size={24} />,
    },
    {
      title: "Invoices",
      description: "Automated billing and invoice delivery",
      icon: <FileText size={24} />,
    },
  ];

  const testimonials = [
    {
      name: "Dhruvraj Zala",
      role: "CTO at TechStart",
      content:
        "SMTP-LITE transformed our email infrastructure. Setup took 5-10 minutes and we haven't looked back.",
      rating: 5,
    },
    {
      name: "Tushal Bhadani",
      role: "Lead Developer at DataFlow",
      content:
        "The API is incredibly simple yet powerful. Perfect for our transactional email needs.",
      rating: 4,
    },
    {
      name: "Yuvraj Dabhi",
      role: "Product Manager at CloudBase",
      content:
        "Reliable, fast, and affordable. Exactly what we needed for our SaaS platform.",
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for testing and small projects",
      features: [
        "1,000 emails/month",
        "Basic support",
        "API access",
        "Email templates",
      ],
      cta: "Get Started",
      highlight: false,
    },
    {
      name: "Professional",
      price: "$29",
      description: "For growing businesses",
      features: [
        "50,000 emails/month",
        "Priority support",
        "Advanced analytics",
        "Custom templates",
        "Webhooks",
      ],
      cta: "Start Free Trial",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For high-volume senders",
      features: [
        "Unlimited emails",
        "Dedicated support",
        "Custom integration",
        "SLA guarantee",
        "Dedicated IP",
      ],
      cta: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}

      {/* Hero Section */}
      <section className={`relative overflow-hidden ${styles.bgSecondary}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className={`inline-flex items-center gap-2 ${styles.bgThird} ${styles.textPrimary} px-4 py-2 rounded-full text-sm font-medium mb-6`}
              >
                <Zap size={16} />
                Simple. Fast. Reliable.
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                <TextType
                  text={["AnyKind of Email", "Delivered Effortlessly"]}
                  typingSpeed={75}
                  pauseDuration={1000}
                />
              </h1>

              <p
                className={`text-md md:text-lg ${styles.textSecondary} mb-8 leading-relaxed`}
              >
                Send emails with a single API call. No SMTP configuration, no
                hassle. Start sending in minutes, not days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition text-lg font-semibold shadow-lg hover:shadow-xl"
                >
                  Start Free Trial
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/documentations"
                  className={`inline-flex items-center justify-center gap-2 ${styles.borderPrimary} ${styles.textPrimary} border dark:border-gray-100 px-7 py-3 rounded-lg transition text-lg font-semibold`}
                >
                  View Documentations
                  <FileText size={20} />
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" />
                  Free plan available
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gray-900 rounded-lg shadow-2xl p-6 text-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <pre className="text-green-400 overflow-x-auto text-xs md:text-sm">
                  <code>{`curl -X POST \\
  https://smtp-service-server\\
    .vercel.app/api/email/send \\
  -H 'x-api-key: YOUR_KEY' \\
  -H 'Content-Type: \\
    application/json' \\
  -d '{
    "to": "user@example.com",
    "subject": "Welcome!",
    "html": "<h1>Hello</h1>"
  }'

// Response
{
  "success": true,
  "messageId": "abc123xyz"
}`}</code>
                </pre>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
                ✓ Email sent successfully
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`${styles.bgSecondary} py-16 md:py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p
              className={`text-lg md:text-xl ${styles.textThird} max-w-2xl mx-auto`}
            >
              Powerful features designed for developers who want to focus on
              building, not managing email infrastructure.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${styles.bgPrimary} p-8 rounded-xl shadow-sm hover:shadow-md transition`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`${styles.textSecondary} ${styles.bgThird} w-10 h-10 rounded-lg flex items-center justify-center`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className={`text-lg font-bold ${styles.textSecondary}`}>
                    {feature.title}
                  </h3>
                </div>
                <p className={`${styles.textThird} leading-relaxed`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className={`py-16 md:py-20 ${styles.bgSecondary}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perfect For Every Use Case
            </h2>
            <p
              className={`text-lg md:text-xl ${styles.textThird} max-w-2xl mx-auto`}
            >
              From startups to enterprises, SMTP-LITE handles all your
              transactional email needs.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className={`${styles.bgGredient} p-6 rounded-xl ${styles.borderSecondary} hover:shadow-lg transition flex flex-col`}
              >
                {/* Header Row: Icon + Title */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`${styles.textSecondary} ${styles.bgThird} w-10 h-10 rounded-lg flex items-center justify-center`}
                  >
                    {useCase.icon}
                  </div>
                  <h3 className={`text-lg font-bold ${styles.textSecondary}`}>
                    {useCase.title}
                  </h3>
                </div>

                {/* Description */}
                <p className={`${styles.textThird} text-sm leading-relaxed`}>
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Developers
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of developers who trust SMTP-LITE for their email
              infrastructure.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-bold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className={`${styles.bgPrimary} text-gray-300 py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="text-blue-500" size={28} />
                <span className="text-xl font-bold text-white">SMTP‑LITE</span>
              </div>
              <p className="text-gray-400 text-sm">
                Simple, fast, and reliable transactional email API for
                developers.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/pricing" className="hover:text-white transition">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/documentation"
                    className="hover:text-white transition"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/apikeys" className="hover:text-white transition">
                    API Keys
                  </Link>
                </li>
                <li>
                  <Link to="/status" className="hover:text-white transition">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="hover:text-white transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-white transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/privacy" className="hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white transition">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/security" className="hover:text-white transition">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div> */}
          <div className="text-center text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} SMTP‑LITE. All rights reserved. Built
              with <span className="animate-pulse">❤️</span> for developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
