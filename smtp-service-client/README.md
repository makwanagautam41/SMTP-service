# SMTP-LITE Client 🎨

<div align="center">

**Modern React Dashboard for SMTP-LITE Email API Platform**

[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-purple)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-cyan)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-6.x-red)](https://reactrouter.com/)

[Features](#-features) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [Deployment](#-deployment)

</div>

---

## 📖 Overview

**SMTP-LITE Client** is the official dashboard for the SMTP-LITE email API platform. Built with **React 18**, **Vite**, and **Tailwind CSS**, it provides a modern, responsive, and intuitive user interface for managing email sending, API keys, SMTP credentials, and analytics.

This is a **pure frontend application** with no backend logic. It communicates with two separate backend services:
- **User Management Server** - Authentication, API keys, app credentials
- **Email Service Server** - Email sending and status tracking

---

## 🏗️ Architecture

### Application Flow

```
┌─────────────────────────────────────────┐
│         SMTP-LITE Client (React)        │
│                                         │
│  ┌────────────┐      ┌──────────────┐  │
│  │   Pages    │──────│  Components  │  │
│  └────────────┘      └──────────────┘  │
│         │                    │          │
│         └──────┬─────────────┘          │
│                │                        │
│         ┌──────▼──────┐                 │
│         │   Context   │                 │
│         │   (State)   │                 │
│         └──────┬──────┘                 │
│                │                        │
│         ┌──────▼──────┐                 │
│         │   Axios     │                 │
│         │  (API calls)│                 │
│         └──────┬──────┘                 │
└────────────────┼────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
┌────────────┐    ┌────────────┐
│    User    │    │   Email    │
│   Server   │    │  Service   │
│  (Auth/    │    │  (Email    │
│   Keys)    │    │  Sending)  │
└────────────┘    └────────────┘
```

### Technology Stack

**Core Framework:**
- **React 18.3** - Component-based UI library
- **Vite 5.x** - Ultra-fast build tool and dev server
- **React Router Dom 6.x** - Client-side routing

**Styling:**
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **Custom Themes** - Multiple color schemes
- **Responsive Design** - Mobile-first approach

**Animation:**
- **Framer-motion** - light weight simple smooth animations
- **GSAP** - very heavy smooth animations

**State Management:**
- **React Context API** - Global state management
- **Custom Hooks** - Reusable stateful logic
- **Local Storage** - Theme persistence

**HTTP Client:**
- **Axios** - Promise-based HTTP client
- **Interceptors** - Automatic error handling
- **Cookie Support** - Credential-based requests

**UI Components:**
- **Lucide React** - Modern icon library
- **Custom Components** - Reusable UI elements
- **Modal System** - Dialog and overlay components

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** or **yarn** or **pnpm**
- Backend servers running (User Server + Email Service)

### Installation

**1. Clone the repository:**

```bash
git clone https://github.com/makwanagautam41/SMTP-service.git
cd smtp-service-client
```

**2. Install dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
```

**3. Create `.env` file:**

```env
# User Management Server URL
VITE_API_BASE_URL=http://localhost:4000/api

# Email Service Server URL
VITE_SMTP_SERVER_API_BASE_URL=http://localhost:5000/api

```

**4. Start development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

**5. Open browser:**

```
http://localhost:5173
```

## 📚 Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3.0 | UI library |
| react-dom | ^18.3.0 | React DOM renderer |
| react-router-dom | ^6.x | Client-side routing |
| axios | ^1.6.0 | HTTP client |
| lucide-react | ^0.263.1 | Icon library |
| react-icons | ^5.5.0 | Icon library |
| framer-motion | ^12.23.24 | Animation Library |
| GSAP | ^3.13.0 | Animation Library |
| GSAP/REACT | ^ 2.1.2 | React GSAP |
| motion | ^12.23.24 | Animation Library |
| reacharts | ^3.3.0 | Charts Library |
| taiwlindcss/vite | ^4.1.16 | Tailwind css Styling
---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style
- Add comments for complex logic
- Test on multiple devices
- Update documentation
- Keep commits atomic

---

## 📄 License

This project is part of the SMTP-LITE commercial SaaS platform.

---

## 🙏 Acknowledgments

**Built with:**
- React 18
- Vite
- Tailwind CSS
- Lucide Icons
- Axios
---

<div align="center">

**Frontend Interface for SMTP-LITE Email API Platform**

[Main Documentation](../README.md) • [Email Server](../smtp-service-server/README.md) • [User Server](../smtp-user-server/README.md)

---

**Made with ❤️ using React & Vite**

</div>