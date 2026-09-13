# Self-Healing Microservices Architecture with ML-Driven Anomaly Detection

> An application-aware, self-healing microservices platform that detects anomalies proactively, automates recovery where it's safe, and escalates to a human whenever data integrity or in-flight transactions are at stake.

[![Java](https://img.shields.io/badge/Java-21-orange)]()
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)]()
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestration-blue)]()
[![License](https://img.shields.io/badge/License-MIT-lightgrey)]()

---

## Overview

Modern microservice systems fail in ways that traditional threshold-based monitoring and manual recovery can't handle fast or accurately enough — cascading failures, false alerts, missed anomalies, and prolonged downtime are the norm rather than the exception. Most existing self-healing solutions stop at infrastructure-level recovery, blindly restarting services without accounting for in-flight transactions, risking data corruption in critical operations.

This project builds an **intelligent, application-aware self-healing architecture** that:

- Continuously monitors service health via metrics, logs, and traces
- Uses a lightweight ML-based anomaly detector to catch abnormal behavior beyond fixed thresholds
- Classifies failures as **auto-healable** or **requires-human-confirmation**, based on service state and transaction criticality
- Executes safe automated recovery (pod restart, traffic rerouting, scaling) via the Kubernetes API
- Is validated through controlled fault-injection testing and measured against MTTD, MTTR, and false-positive rate

The core, novel contribution is the **Watcher / Decision Engine** — a control loop that doesn't just detect and react, but explicitly reasons about *whether* it is safe to act automatically, based on whether a service is mid-transaction with critical data.

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

The system is organized into ten cooperating layers:

```
Client Layer
      │
API Gateway & Traffic Layer  (Spring Cloud Gateway, Load Balancer, Service Discovery)
      │
Core Domain Microservices    (independently deployable, database-per-service)
      │
Async Messaging Backbone     (Kafka, RabbitMQ, DLQ)
      │
Data Layer                   (PostgreSQL, Redis, Time-Series Store)
      │
┌─────────────────────────────────────────┐
│   SELF-HEALING CONTROL LOOP (core work)  │
│   Watcher → Anomaly Detector →           │
│   Decision Engine → Recovery Executor    │
└─────────────────────────────────────────┘
      │
Observability Stack           (Prometheus, Grafana, Loki/ELK, Jaeger/OpenTelemetry)
      │
Container Orchestration       (Docker, Kubernetes, Helm)
      │
Resilience & Security Layer   (Resilience4j, Istio, OAuth2/RBAC, mTLS, Encryption)
      │
Chaos Testing & CI/CD         (Chaos Mesh/LitmusChaos, GitHub Actions/Jenkins)
```

A full `.drawio` diagram of the architecture is included in [`/docs/architecture.drawio`](./docs/architecture.drawio).

### The Control Loop

The Watcher follows the same reconciler pattern Kubernetes itself uses — observe, compare, act:

1. **Detect** — Prometheus/Actuator metrics are continuously scraped; the Anomaly Detector (Isolation Forest / rolling z-score / autoencoder) flags deviations from learned normal behavior.
2. **Decide** — The Decision Engine checks two things before acting: (a) is this service on the *auto-healable* list, and (b) is there an in-flight transaction on this specific instance right now?
3. **Recover** — If both checks pass, the Recovery Executor calls the Kubernetes API to delete the pod (triggering automatic recreation) or scale the deployment. If not, it alerts a human and holds.

### Kubernetes API — what the Watcher can actually do

Kubernetes has no literal "restart" verb. The Watcher's entire toolkit is two primitives:

| Action | Mechanism |
|---|---|
| **Delete pod** | Deployment/ReplicaSet controller automatically recreates it (the closest thing to a "restart") |
| **Scale replicas** | Patch the Deployment's replica count up or down |

Everything the system does under the banner of "healing" is built from these two operations — the intelligence lives entirely in *when* the Watcher is allowed to call them, gated by RBAC (technical permission) and the Decision Engine (operational judgment).

### Auto-Healable vs. Human-Confirmation-Required

| Category | Examples | Reasoning |
|---|---|---|
| **Fully automatic** | Stateless/read-path services, crashed pods with no in-flight writes, Kafka consumer lag, Redis cache/lock latency, DLQ reprocessing (transient errors) | Safe to restart because no unsaved state is lost |
| **Alert-only, human confirms** | Services mid-write, mid-payment, or mid-emergency-decision; DB primary failover; low-confidence ML predictions near the decision boundary | A blind auto-heal here risks double-writes, lost confirmations, or data divergence |

This distinction — **state-in-flight = human gate** — is the project's core design contribution and is what differentiates it from existing self-healing literature, which largely treats all failures as equally safe to auto-remediate.

---

## Tech Stack

### Frontend Client (MediCore HMS)
- Next.js 16.3 (Turbopack, App Router)
- React 19 & TypeScript
- Tailwind CSS v4 & Lucide Icons
- Framer Motion (animated multi-step slide-over drawers, modal transitions, and dynamic directory updates)

### Backend
- Java 21, Spring Boot 3.x
- Spring Cloud Gateway, Eureka/Consul (service discovery)
- Spring Data JPA, Flyway (migrations)
- Spring Data Redis / Redisson (caching, distributed locks)
- Spring for Apache Kafka, Spring AMQP (RabbitMQ)
- Resilience4j (circuit breakers, retries, bulkheads)
- Spring Security (OAuth2/JWT, RBAC)

### Data
- PostgreSQL (database-per-service)
- Redis (cache + distributed locks)
- Prometheus TSDB / InfluxDB (time-series metrics)

### Observability
- Prometheus + Grafana
- Loki / ELK Stack (logs)
- Jaeger / OpenTelemetry (distributed tracing)
- Micrometer (metrics facade)

### Orchestration & Infra
- Docker, Kubernetes, Helm
- Istio / Linkerd (service mesh, mTLS, traffic shifting)
- Kubernetes Java Client (`io.kubernetes:client-java`) — used by the Watcher for pod delete/scale operations

### Machine Learning
- Isolation Forest / rolling z-score baseline / autoencoder for anomaly detection
- Pluggable detector interface — swappable between rule-based, statistical, and ML-based strategies without touching the control loop

### Testing & Chaos
- Testcontainers (integration tests against real Postgres/Kafka/Redis)
- Chaos Mesh / LitmusChaos (controlled fault injection)
- JMeter / Gatling (load testing)

### CI/CD
- GitHub Actions / Jenkins

---

## Getting Started

### Prerequisites
- Java 21+
- Node.js 20+ & npm
- Docker & Docker Compose
- kubectl + a local Kubernetes cluster (minikube / kind / Docker Desktop)
- Maven or Gradle

### Local Setup

#### 1. Start Infrastructure & Microservices
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
docker-compose up -d        # spins up Postgres, Redis, Kafka, Prometheus, Grafana
./mvnw spring-boot:run      # or per-service, see /services
```

#### 2. Start Frontend Client (MediCore HMS)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to view the staff management dashboard and interactive multi-step drawer.

### Deploying to Kubernetes
```bash
kubectl apply -f k8s/
helm install self-healing ./helm-chart
```

### Running fault injection
```bash
kubectl apply -f chaos/pod-kill-experiment.yaml
```

---

## Evaluation Metrics

The system is benchmarked against a traditional reactive-only baseline (Kubernetes-native restart-on-crash) using:

- **MTTD** — Mean Time to Detect
- **MTTR** — Mean Time to Recover
- **False Positive Rate** — unnecessary recovery actions triggered
- **Precision / Recall / F1** — anomaly detector accuracy against labeled fault-injection runs

---

## Roadmap

- [ ] Core microservices with Actuator-based health checkpoints
- [ ] Kafka/Redis telemetry pipeline into Prometheus
- [ ] Anomaly detector (baseline: rolling z-score → later: Isolation Forest)
- [ ] Decision Engine with auto-heal / alert-only classification
- [ ] Recovery Executor via Kubernetes Java Client
- [ ] Chaos-engineering test suite and MTTD/MTTR benchmarking
- [ ] Grafana dashboard for live demo
- [ ] IEEE paper writeup

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
