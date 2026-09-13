# MediCore HMS — Hospital Management System Frontend

> A modern, responsive, healthcare management frontend built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Framer Motion**.

---

## Features

### 1. Staff Management Dashboard (`/dashboard`)
- **Real-Time KPI Stat Cards**:
  - `Total Staff`: Dynamic live count with quarter trend indicator.
  - `Active Today`: On-duty operational rate statistics.
  - `Pending Activations`: Verification queue tracker.
  - `By Role Breakdown`: Doctors, nurses, administrators, and lab technicians.
- **Interactive Multi-Filter & Search**:
  - Global search querying by clinician name, work email, staff ID, and department.
  - Role dropdown filter (`Doctor`, `Nurse`, `Pathologist`, `Insurance Coord.`, `Administrative`, `Lab Technician`).
  - Department filter (`Cardiology`, `General Medicine`, `Emergency Care`, `Neurology`, etc.).
  - Status filter (`Active`, `On Sabbatical`).
  - Instant filter reset button.
- **Staff Directory Data Table**:
  - Clinician portrait / initials avatar badges.
  - Mono-styled Staff IDs (e.g. `DOC-2026-0042`, `NRS-2026-0115`).
  - Color-coded role clearance badges.
  - Department and designation hierarchies.
  - Live pulse status indicators.
  - JSON directory export utility.
  - Interactive pagination controls.

---

### 2. Animated Multi-Step "Add Staff Member" Drawer (`/addmedicformpage`)
- **Framer Motion Animations**:
  - Backdrop blur with smooth fade-in/fade-out.
  - Right slide-over drawer with spring physics (`damping: 30`, `stiffness: 300`).
  - Directional sliding step transitions (`enter`, `center`, `exit`).
  - Celebration badge issuance animation.
- **4-Step Workflow**:
  - **Step 1: Basic Info** — Portrait upload with live preview and removal, Full Name with credential sublabel, Work Email with hospital domain validation, Contact Number, Date of Birth picker, and HIPAA/NPI encryption compliance notice.
  - **Step 2: Role & Department** — Selectable role cards with icons and checkmark indicators, department selector, designation title, and searchable reporting supervisor.
  - **Step 3: Access & Security** — Automated security provisioning notice, EHR access tiers, preferred login method (RFID smart badge, FIDO2 hardware key, SSO), and shift schedule.
  - **Step 4: Review & Verification** — Laser-encoded RFID smart badge preview card, full summary review grid, and identity verification compliance confirmation.
- **Live Dashboard Integration**:
  - Submitting provisions a new Staff ID, triggers a success badge issuance notification, and instantly prepends the new clinician to the dashboard directory and updates total counts.

---

## Tech Stack

- **Framework**: [Next.js 16.3 (Turbopack, App Router)](https://nextjs.org)
- **UI Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev)
- **TypeScript**: Strict type checking with custom interfaces

---

## Project Structure

```
frontend/
├── app/
│   ├── dashboard/
│   │   └── page.tsx           # Dashboard route entry point
│   ├── globals.css            # Tailwind CSS v4 directives & root variables
│   ├── layout.tsx             # Root HTML layout & font declarations
│   └── page.tsx               # Landing page route
├── pages/
│   ├── addmedicformpage/
│   │   └── AddMedicFormPage.tsx # Animated Multi-Step Drawer & Modal Component
│   ├── dashboardpage/
│   │   └── DashboardPage.tsx    # Manage Staff Dashboard with Live Table & Filters
│   ├── loginpage/
│   │   └── LoginPage.tsx        # Authentication UI
│   └── registerpage/
│       └── RegisterPage.tsx     # User Registration UI
└── package.json
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

