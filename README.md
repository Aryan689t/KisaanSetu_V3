# KisanSetu (किसानसेतु) - Direct Crop Procurement Portal

> **Department of Consumer Affairs (DoCA) • Mandi Operations & Direct Procurement Platform**

KisanSetu is a modern, high-performance web application designed to streamline crop procurement, slot booking, live Mandi queue tracking, and supervisory payout settlements for farmers, Mandi operators, and administrative officials.

---

## 🏗️ Architecture Overview

KisanSetu is built as a single-page React application leveraging Vite for high-speed development and bundling, TailwindCSS for custom agricultural-themed styling, and React Context for responsive role-based state management.

```
┌─────────────────────────────────────────────────────────┐
│                    KisanSetu Frontend                   │
│                                                         │
│  ┌─────────────────┐  ┌──────────────────────────────┐  │
│  │   Navbar &      │  │        DemoContext           │  │
│  │  Accessibility  │  │ (Role, Language, Queue, Speech)│ │
│  └────────┬────────┘  └──────────────┬───────────────┘  │
│           │                          │                  │
│  ┌────────┴──────────────────────────┴───────────────┐  │
│  │                     Role Views                    │  │
│  │  ┌──────────────┐ ┌───────────────┐ ┌──────────┐  │  │
│  │  │ Farmer View  │ │ Operator View │ │Admin View│  │  │
│  │  └──────────────┘ └───────────────┘ └──────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Key Technologies Used

- **Core Framework**: [React 18](https://react.dev/) (`react`, `react-dom`)
- **Build Tooling & Dev Server**: [Vite 5](https://vitejs.dev/) (`@vitejs/plugin-react`)
- **Styling & UI Tokens**: [TailwindCSS 3.4](https://tailwindcss.com/), [PostCSS](https://postcss.org/), [Autoprefixer](https://github.com/postcss/autoprefixer)
- **Class Utilities**: `clsx`, `tailwind-merge`
- **Icon System**: [Lucide React](https://lucide.dev/) (`lucide-react`)
- **Analytics & Visualization**: [Recharts 2.13](https://recharts.org/) for Mandi load distribution, queue trends, and payout metrics
- **Accessibility & Voice Assistance**: HTML5 Web Speech Synthesis API (`window.speechSynthesis`) for bilingual voice output (Hindi & English)

---

## 📁 Project Structure

```
KisanSetu_V1-main/
├── .github/                # GitHub Actions CI/CD workflows
├── dist/                   # Production build output directory
├── node_modules/           # Dependencies
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── admin/          # Admin Dashboard, Analytics, Payout Settlement, Centre Load
│   │   ├── farmer/         # Farmer Dashboard, Mandi Discovery, Slot Booking, Live Queue, History
│   │   ├── layout/         # Navbar, Footer, Demo Switcher Bar, Mobile Navigation
│   │   ├── operator/       # Operator Dashboard, Weighment Modal, Live Queue Table
│   │   └── ui/             # Reusable UI primitives (Metric Card, Status Badge, Token Display, Notifications)
│   ├── context/
│   │   └── DemoContext.jsx # Global state store (Roles, Telemetry, Slot Bookings, Notifications, Speech)
│   ├── mock/
│   │   └── initialData.js  # Pre-populated Mandi centers, time slots, crop MSP rates, queue tokens
│   ├── App.jsx             # Main application orchestrator & layout
│   ├── index.css           # Custom Tailwind directives & theme definitions
│   └── main.jsx            # React root mount point
├── index.html              # HTML entry point
├── package.json            # Project manifest & scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Custom agricultural design system tokens & colors
└── vite.config.js          # Vite build configuration
```

---

## 🚀 How to Run the App

### Prerequisites

Ensure you have **Node.js** (v18.x or higher recommended) and **npm** installed on your system.

### 1. Installation

Install all project dependencies:

```bash
npm install
```

### 2. Start Development Server

Launch the Vite local development server:

```bash
npm run dev
```

The application will be accessible at: `http://localhost:5173` (or the next available port indicated in the terminal).

### 3. Build for Production

To create an optimized production build in the `dist/` directory:

```bash
npm run build
```

### 4. Preview Production Build

To preview the built production bundle locally:

```bash
npm run preview
```

### 5. Linting

Run ESLint to check for code quality and formatting issues:

```bash
npm run lint
```

---

## 🔍 Missing Logic & Audit Report

During a codebase analysis, the following status was determined for requested features:

| Feature | Status | Details |
| :--- | :---: | :--- |
| **Language Toggle** | ⚠️ **Partial** | State management (`lang`: `'en'` \| `'hi'`) and Web Speech API exist in `DemoContext.jsx`. Basic UI toggles exist in the Navbar, but full internationalization (i18n) translation dictionaries across all components are not yet wired up. |
| **Accordion Menus** | ❌ **Missing** | No accordion components or expandable FAQ/help section logic exist in the codebase. |
| **Supabase Login** | ❌ **Missing** | `@supabase/supabase-js` is not installed. Role switching is handled entirely in-memory via `DemoContext` without persistent authentication or database backend. |

---

## 💡 Roadmap & Recommendations

1. **Implement i18n Dictionary**: Expand the `lang` state into a full internationalization framework (e.g. `react-i18next` or a structured translation object) to translate all Mandi statistics, crop details, and form fields into Hindi and regional languages.
2. **Add FAQ & Help Accordion Component**: Implement collapsible `<Accordion />` primitives for Mandi submission guidelines, moisture content standards, and MSP policy details.
3. **Supabase / Auth Integration**: Add `@supabase/supabase-js` for user authentication, farmer identity verification, and persistent database storage for slot bookings and weighment receipts.
