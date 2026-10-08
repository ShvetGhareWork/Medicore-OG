# MediCore — Self-Healing Microservices Platform

> An application-aware, self-healing microservices platform for hospital management that detects anomalies proactively, automates recovery where it's safe, and escalates to a human whenever data integrity or in-flight transactions are at stake.

[![Java](https://img.shields.io/badge/Java-21-orange)]()
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.3-brightgreen)]()
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black)]()
[![React](https://img.shields.io/badge/React-19-blue)]()
[![Version](https://img.shields.io/badge/Version-1.6.0-purple)]()
[![License](https://img.shields.io/badge/License-MIT-lightgrey)]()

---

## Overview

Modern microservice systems fail in ways that traditional threshold-based monitoring and manual recovery can't handle fast or accurately enough — cascading failures, false alerts, missed anomalies, and prolonged downtime are the norm rather than the exception. Most existing self-healing solutions stop at infrastructure-level recovery, blindly restarting services without accounting for in-flight transactions, risking data corruption in critical operations.

This project builds an **intelligent, application-aware self-healing architecture** that:

- Continuously monitors service health via metrics, logs, and distributed traces
- Uses a lightweight ML-based anomaly detector to catch abnormal behavior beyond fixed thresholds
- Classifies failures as **auto-healable** or **requires-human-confirmation**, based on service state and transaction criticality
- Executes safe automated recovery (pod restart, traffic rerouting, scaling) via the Kubernetes API
- Provides a full **Hospital Management System (MediCore HMS)** as the domain application being monitored and healed

The core novel contribution is the **Watcher / Decision Engine** — a control loop that explicitly reasons about *whether* it is safe to act automatically, based on whether a service is mid-transaction with critical data.

---

## Problem Statement

Modern microservice systems suffer from cascading failures that traditional threshold-based monitoring and manual recovery can't handle fast or accurately enough, resulting in prolonged downtime, false alerts, or missed anomalies. Most existing self-healing solutions only address infrastructure-level recovery, blindly restarting services without accounting for in-flight transactions, risking data corruption in critical operations. This creates the need for an intelligent, application-aware self-healing architecture that detects anomalies proactively, automates recovery where safe, and escalates to human oversight when data integrity is at risk.

---

## Scope

1. Design and implement a microservices-based system instrumented with health checks, metrics, and distributed tracing for real-time observability.
2. Build a lightweight ML-based anomaly detection module to identify abnormal service behavior beyond fixed thresholds.
3. Develop a Watcher/Decision Engine that classifies failures as auto-healable or requiring human confirmation, based on service state and transaction criticality.
4. Implement automated recovery actions (pod restart, traffic rerouting, scaling) via Kubernetes, validated through controlled fault-injection testing.
5. Evaluate the system's effectiveness using measurable metrics — MTTD, MTTR, and false-positive rate — benchmarked against traditional reactive healing.

---

## Architecture

```
Client Layer (Next.js 16 MediCore HMS Frontend)
      │
API Gateway :8080             (Spring Cloud Gateway → Eureka service discovery)
      │
┌──────────────────────────────────────────────────────────────────────┐
│                      Core Domain Microservices                        │
│  Identity :8081 | Patient :8082 | Doctor :8083 | Department :8084    │
│  Appointment :8085 | Insurance :8086 | Admin Analytics :8087          │
│  Clinical :8088                                                        │
└──────────────────────────────────────────────────────────────────────┘
      │
Async Messaging               (Apache Kafka 3.7 — KRaft mode, no ZooKeeper)
      │
Data Layer                    (PostgreSQL 15, Redis 7 AOF)
      │
Distributed Tracing           (Zipkin :9411)
      │
┌─────────────────────────────────────────────────────────────────┐
│   SELF-HEALING CONTROL LOOP (core research contribution)         │
│   Watcher → Anomaly Detector →                                   │
│   Decision Engine → Recovery Executor                            │
└─────────────────────────────────────────────────────────────────┘
      │
Container Orchestration       (Docker Compose → Kubernetes + Helm)
      │
Resilience & Security Layer   (Resilience4j, OAuth2/JWT, mTLS)
      │
Chaos Testing & CI/CD         (Chaos Mesh/LitmusChaos, GitHub Actions)
```

### The Self-Healing Control Loop

The Watcher follows the same reconciler pattern Kubernetes itself uses — observe, compare, act:

1. **Detect** — Prometheus/Actuator metrics are continuously scraped; the Anomaly Detector (Isolation Forest / rolling z-score / autoencoder) flags deviations from learned normal behavior.
2. **Decide** — The Decision Engine checks two things before acting: (a) is this service on the *auto-healable* list, and (b) is there an in-flight transaction on this specific instance right now?
3. **Recover** — If both checks pass, the Recovery Executor calls the Kubernetes API to delete the pod (triggering automatic recreation) or scale the deployment. If not, it alerts a human and holds.

### Kubernetes API — What the Watcher Can Do

Kubernetes has no literal "restart" verb. The Watcher's entire toolkit is two primitives:

| Action | Mechanism |
|---|---|
| **Delete pod** | Deployment/ReplicaSet controller automatically recreates it (closest thing to a "restart") |
| **Scale replicas** | Patch the Deployment's replica count up or down |

### Auto-Healable vs. Human-Confirmation-Required

| Category | Examples | Reasoning |
|---|---|---|
| **Fully automatic** | Stateless/read-path services, crashed pods with no in-flight writes, Kafka consumer lag, Redis cache/lock latency, DLQ reprocessing | Safe to restart — no unsaved state is lost |
| **Alert-only, human confirms** | Services mid-write, mid-payment, or mid-emergency-decision; DB primary failover; low-confidence ML predictions near the decision boundary | Blind auto-heal risks double-writes, lost confirmations, or data divergence |

This distinction — **state-in-flight = human gate** — is the project's core design contribution and differentiates it from existing self-healing literature.

---

## Services

### Backend Microservices (Java 21 + Spring Boot 3.4.3)

| Service | Port | Description |
|---|---|---|
| `eureka-server` | 8761 | Service discovery (Spring Cloud Netflix Eureka) |
| `api-gateway` | 8080 | Unified entry point (Spring Cloud Gateway) |
| `identity-service` | 8081 | Auth: JWT, Google OAuth2, email verification, MFA |
| `patient-service` | 8082 | Patient records, vitals, notes, assessments, timeline |
| `doctor-service` | 8083 | Doctor profiles, medication & lab orders, discharge summaries |
| `department-service` | 8084 | Hospital department management |
| `appointment-service` | 8085 | Appointment scheduling for patients & doctors |
| `insurance-service` | 8086 | Insurance claims, policy tracking, document uploads |
| `admin-analytics-service` | 8087 | Admin dashboards, staff analytics, system metrics |
| `clinical-service` | 8088 | Clinical workspace: SOAP notes, order management, nurse flags |

### Infrastructure (Docker Compose)

| Service | Port | Description |
|---|---|---|
| `postgres-db` | 7777→5432 | PostgreSQL 15 (databases: `Self-heal-arch`, `heal_clinical`) |
| `redis` | 6379 | Redis 7 Alpine (AOF persistence, caching + distributed locks) |
| `kafka` | 9092 | Apache Kafka 3.7 (KRaft mode — broker + controller, no ZooKeeper) |
| `zipkin` | 9411 | Distributed request tracing (in-memory storage) |

### Frontend — Three Role-Gated Portals

A single Next.js 16.3 app routes users to different portals based on their JWT role via middleware:

| Portal | Routes | Roles | Status |
|---|---|---|---|
| **Admin HMS** | `/dashboard`, `/admissions`, `/activity` | `ADMIN`, `ADMINISTRATIVE` | ✅ Complete |
| **Clinical Terminal** | `/terminal`, `/terminal/workspace/**` | `DOCTOR`, `NURSE`, `PATHOLOGIST`, `LAB_TECHNICIAN` | ✅ Complete |
| **Patient Portal** | `/portal` | `PATIENT` | ⚠️ Stub (in progress) |

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16.3 (Turbopack, App Router)
- **UI**: React 19, TypeScript 5
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion v13 (slide-over drawers, step transitions, spring physics)
- **Icons**: Lucide React
- **QR Scanning**: ZXing Browser / ZXing Library (clinical terminal QR login)
- **Smooth Scroll**: Lenis v1.3
- **Auth Decode**: jwt-decode v4

### Backend
- **Runtime**: Java 21, Spring Boot 3.4.3
- **Spring Cloud**: `2024.0.0` — Gateway, Eureka, OpenFeign
- **Auth**: Spring Security, JJWT `0.12.6`, Google OAuth2
- **Persistence**: Spring Data JPA, Flyway migrations, PostgreSQL 15
- **Caching**: Spring Data Redis / Redisson (distributed locks)
- **Messaging**: Spring for Apache Kafka (KRaft)
- **Resilience**: Resilience4j (circuit breakers, retries, bulkheads)
- **Tracing**: Micrometer, Zipkin
- **Mapping**: ModelMapper 3.2.0
- **Security patches**: Logback 1.5.37 (CVE-2025-11226, CVE-2026-1225)

### ML / Self-Healing (Planned)
- Isolation Forest / rolling z-score baseline / autoencoder (pluggable `AnomalyDetector` interface)
- Kubernetes Java Client (`io.kubernetes:client-java`) — pod delete + replica scaling

### Infrastructure
- Docker + Docker Compose (local dev)
- Kubernetes + Helm (production)
- Istio / Linkerd (service mesh, mTLS, traffic shifting)
- Chaos Mesh / LitmusChaos (fault injection)
- GitHub Actions / Jenkins (CI/CD)

### Testing
- Testcontainers (integration tests against real Postgres/Kafka/Redis)
- JMeter / Gatling (load testing)

---

## Frontend Feature Detail

### Admin HMS

**Staff Dashboard (`/dashboard`)**
- KPI stat cards: Total Staff, Active Today, Pending Activations, Role Breakdown
- Staff directory table: portrait avatars, mono Staff IDs (`DOC-2026-0042`), color-coded role badges, live status indicators, JSON export, pagination
- Multi-filter search: name, email, staff ID, department, role, status; instant reset
- **Add Staff Drawer** (Framer Motion, 4-step slide-over):
  1. Basic Info — portrait upload with live preview, full name, work email, contact, DOB
  2. Role & Department — icon role cards with checkmarks, department, designation, supervisor
  3. Access & Security — EHR access tiers, login method (RFID/FIDO2/SSO), shift schedule
  4. Review & Issue — RFID badge preview card, summary grid, identity verification
- **Edit Staff Modal** — inline editing of existing staff records
- **MFA Setup Modal** — multi-factor authentication configuration
- **Google OAuth** button integration

**Admissions (`/admissions`)** — patient admission management with wired `admissionsApi.ts`

### Clinical Terminal

**Lock Screen (`/terminal`)** — shared bedside workstation, QR code scan or PIN connect

**Clinical Workspace (`/terminal/workspace`)**
- **Patient Search** (`/patient-search`) — search by name, ID, bed, ward; status badges (Stable / Critical / Pending Labs)
- **Patient Overview** (`/patient/[patientId]`) — demographics sidebar, active diagnoses card, current medications card, latest vitals strip
- **Vitals** (`/patient/[patientId]/vitals`) — time-series chart, manual entry form, alert threshold highlighting
- **Orders** (`/patient/[patientId]/orders`) — `NewOrderModal`: medication/lab/imaging orders with status pipeline (Pending → Collected → Processing → Resulted)
- **SOAP Notes** (`/patient/[patientId]/notes`) — `SOAPNoteEditor`: structured Subjective/Objective/Assessment/Plan editor, history view, timestamp + author auto-stamp
- **Nurse Flags** (`/patient/[patientId]/flags`) — `NurseFlagModal`: flag creation, severity classification, team notification

**Auto-lock** — `InactivityLogout.tsx` triggers 3-minute timeout, redirects to lock screen

### Patient Portal

Currently a stub sign-in screen at `/portal`. Full portal (timeline, appointments, billing, insurance, documents) under active development.

---

## API Layers (Frontend)

| File | Description |
|---|---|
| `lib/api/staffApi.ts` | Staff CRUD, role management, department assignment |
| `lib/api/admissionsApi.ts` | Patient admissions, bed management |
| `lib/api/clinicalApi.ts` | Patient list, vitals, orders, notes, assessment, discharge |
| `lib/api/clinicalAuth.ts` | QR/PIN clinical session authentication |
| `lib/api/config.ts` | Base URL from `NEXT_PUBLIC_API_URL` env var |
| `lib/auth.ts` | JWT decode, role extraction, redirect path logic |

---

## Getting Started

### Prerequisites
- Java 21+
- Node.js 20+ & npm
- Docker & Docker Compose
- Maven (or use the included `./mvnw`)
- *(For production)* `kubectl` + a Kubernetes cluster (minikube / kind / Docker Desktop)

### Environment Variables

Create a `.env` file at the project root (never commit secrets):

```env
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
NEXT_PUBLIC_API_URL=http://localhost:8080
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=<your-email>
MAIL_PASSWORD=<app-password>
FRONTEND_BASE_URL=http://localhost:3000
```

### 1. Start Infrastructure + Backend

```bash
git clone https://github.com/Shvet21/Medicore-OG.git
cd Medicore-OG
docker-compose up -d
```

This starts: PostgreSQL, Redis, Kafka (KRaft), Zipkin, Eureka Server, API Gateway, and all 8 domain microservices.

To run a single service locally instead:
```bash
./mvnw -pl identity-service spring-boot:run
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

| URL | Portal |
|---|---|
| `http://localhost:3000` | Landing page |
| `http://localhost:3000/login` | Login (role-aware redirect after JWT decode) |
| `http://localhost:3000/dashboard` | Admin HMS |
| `http://localhost:3000/terminal` | Clinical Terminal |
| `http://localhost:3000/portal` | Patient Portal |

### Deploying to Kubernetes

```bash
kubectl apply -f k8s/
helm install medicore ./helm-chart
```

### Running Fault Injection

```bash
kubectl apply -f chaos/pod-kill-experiment.yaml
```

---

## Port Reference

```
3000  Next.js Frontend
8080  API Gateway      ← all external requests go here
8081  Identity Service
8082  Patient Service
8083  Doctor Service
8084  Department Service
8085  Appointment Service
8086  Insurance Service
8087  Admin Analytics Service
8088  Clinical Service
8761  Eureka Server (service registry UI)
7777  PostgreSQL (host → container 5432)
6379  Redis
9092  Kafka (KRaft)
9411  Zipkin (tracing UI)
```

---

## Implementation Status

| Component | Status | Notes |
|---|---|---|
| Landing page | ✅ Done | `LandingPage.tsx` |
| Login / Register | ✅ Done | Password + Google OAuth, email verification |
| JWT middleware (role guard) | ✅ Done | Guards `/dashboard`, `/terminal`, `/portal` |
| Admin HMS shell | ✅ Done | `AdminShell.tsx`, sidebar, inactivity logout |
| Admin staff dashboard | ✅ Done | Full CRUD, filters, 4-step add drawer |
| Admin admissions page | ✅ Done | `admissionsApi.ts` wired |
| Edit staff modal | ✅ Done | `EditStaffModal.tsx` |
| MFA setup modal | ✅ Done | `MfaSetupModal.tsx` |
| Clinical terminal lock screen | ✅ Done | QR/PIN connect, `ClinicalTerminal.tsx` |
| Clinical shell (sidebar + topbar) | ✅ Done | `ClinicalSidebar.tsx`, `ClinicalTopBar.tsx` |
| Clinical patient search | ✅ Done | `/terminal/workspace/patient-search` |
| Clinical patient overview | ✅ Done | Diagnoses, medications, vitals cards |
| Clinical vitals page | ✅ Done | Chart + manual entry |
| Clinical orders | ✅ Done | `NewOrderModal.tsx` |
| Clinical SOAP notes | ✅ Done | `SOAPNoteEditor.tsx` |
| Clinical nurse flags | ✅ Done | `NurseFlagModal.tsx` |
| `clinicalApi.ts` | ✅ Done | Full API layer wired to backend |
| `auth.ts` utility | ✅ Done | JWT decode + role-to-redirect logic |
| Clinical inactivity auto-lock | ✅ Done | `InactivityLogout.tsx` (3-min timeout) |
| Patient portal | ⚠️ Stub | Sign-in screen only; full portal in progress |
| `patientApi.ts` | ❌ Missing | Not yet implemented |
| Watcher / Anomaly Detector | ❌ Planned | Core research contribution |
| Decision Engine | ❌ Planned | Auto-heal vs. human-gate logic |
| Recovery Executor (k8s) | ❌ Planned | Pod delete + scale via Kubernetes Java Client |
| Chaos test suite | ❌ Planned | MTTD/MTTR benchmarking |
| Grafana dashboards | ❌ Planned | Live observability demo |

---

## Evaluation Metrics

The self-healing system will be benchmarked against a traditional reactive-only baseline (Kubernetes-native restart-on-crash):

- **MTTD** — Mean Time to Detect
- **MTTR** — Mean Time to Recover
- **False Positive Rate** — unnecessary recovery actions triggered
- **Precision / Recall / F1** — anomaly detector accuracy against labeled fault-injection runs

---

## Project Structure

```
Medicore-OG/
├── api-gateway/                  # Spring Cloud Gateway
├── eureka-server/                # Service discovery
├── identity-service/             # Auth, OAuth2, JWT, email, MFA
├── patient-service/              # Patient records, vitals, notes
├── doctor-service/               # Doctor profiles, orders, discharge
├── department-service/           # Department management
├── appointment-service/          # Scheduling
├── insurance-service/            # Claims, policies
├── admin-analytics-service/      # Admin metrics & analytics
├── clinical-service/             # Clinical workspace backend
├── frontend/                     # Next.js 16 HMS frontend
│   ├── app/
│   │   ├── (admin)/              # /dashboard, /admissions, /activity
│   │   ├── (clinical)/           # /terminal, /terminal/workspace/**
│   │   └── (patient)/            # /portal
│   ├── components/
│   │   ├── admin/                # AdminShell, EditStaffModal, MfaSetupModal, GoogleOAuthButton
│   │   ├── clinical/             # ClinicalSidebar, SOAPNoteEditor, NewOrderModal, NurseFlagModal, ...
│   │   └── patient/              # PatientPortal (stub)
│   ├── pages/                    # Page-level components
│   │   ├── addmedicformpage/     # Animated 4-step add staff drawer
│   │   ├── admissionspage/       # Admissions management
│   │   ├── dashboardpage/        # Admin staff dashboard
│   │   └── loginpage/            # Login with role-aware redirect
│   └── lib/
│       ├── auth.ts               # JWT utilities
│       └── api/                  # staffApi, admissionsApi, clinicalApi, clinicalAuth, config
├── scripts/                      # DB init, repo search, validation scripts
├── docker-compose.yml            # Full local stack (10 services + 4 infra)
├── pom.xml                       # Maven multi-module root (Spring Boot 3.4.3)
└── VERSION                       # 1.6.0
```

---

## References

This project builds on and differentiates itself from existing literature on self-healing microservices, including work on AWS/PostgreSQL insurance platforms, AI-enhanced self-healing Kubernetes, and AI-driven fault prediction for Java microservices. See [`/docs/literature-review.md`](./docs/literature-review.md) for the full comparative table and identified research gaps this project addresses.

---

## License

This project is licensed under the MIT License — see [`LICENSE`](./LICENSE) for details.


## Author

**Shvet Santosh Ghare**
Final-year B.E. Computer Engineering, Universal College of Engineering, University of Mumbai
GitHub: [Shvet21](https://github.com/Shvet21)
