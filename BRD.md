# Business Requirements Document (BRD)
## UniCart - E-Commerce Platform

**Version:** 1.0  
**Project Name:** UniCart  
**Document Owner:** Product Team

---

## 1. Executive Summary

UniCart is a modern, scalable e-commerce platform modeled after Amazon, delivering an end-to-end shopping experience for consumers and administrators. Leveraging Next.js 14, React 18, TypeScript, and PostgreSQL, the platform enables product discovery, cart management, secure checkout, and comprehensive back-office tooling. The solution emphasizes performance, reliability, and security through JWT-based authentication and robust integrations.

**Key Highlights:**
- Multi-vendor marketplace capability with rich catalog management
- Real-time inventory tracking and low-stock alerts
- Secure, compliant payment processing (Stripe, PayPal)
- Mobile-responsive, SEO-optimized storefront
- Advanced search, filtering, and personalization features
- Embedded financial calculator component featuring "Aishani" embossed branding for promotional tools

---

## 2. Purpose and Objectives

### 2.1 Purpose
Deliver a production-ready e-commerce platform that supports high-volume shopping, streamlines operations for administrators, and upholds enterprise-grade security and compliance.

### 2.2 Business Objectives
- Launch MVP within 3–4 months
- Support 10,000+ concurrent users without degradation
- Maintain ≥ 99.9% uptime SLA
- Process payments with PCI-aligned workflows
- Achieve storefront Time to Interactive under 3 seconds
- Enable scalable multi-vendor onboarding

### 2.3 Success Metrics
- User registration conversion rate ≥ 25%
- Cart abandonment rate ≤ 70%
- Average order value ≥ $50
- Customer satisfaction ≥ 4.5/5
- Mobile traffic share ≥ 60%

---

## 3. Functional Requirements

### 3.1 User Management

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-UM-001 | User registration with email/password | High | Valid email verification, successful account creation, confirmation email delivered |
| FR-UM-002 | JWT-based authentication | High | Access token issued on login, refresh token rotation, tokens expire after 15 min/7 days |
| FR-UM-003 | User login/logout | High | Successful login with valid credentials; logout revokes refresh token |
| FR-UM-004 | Password reset | Medium | Reset link emailed; password updated securely within expiry window |
| FR-UM-005 | Profile management | Medium | Users update name, email, phone, default address |
| FR-UM-006 | Multiple shipping addresses | Low | Users manage multiple addresses with validation |
| FR-UM-007 | OAuth integration (Google, Facebook) | Low | Social login available with secure token exchange |

### 3.2 Product Management

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-PM-001 | Product listing page | High | Lists products with image, price, rating, badges |
| FR-PM-002 | Product detail page | High | Displays gallery, specs, reviews, stock, add-to-cart CTA |
| FR-PM-003 | Categories & subcategories | High | Hierarchical navigation with breadcrumbs |
| FR-PM-004 | Advanced search & filters | High | Keyword search, filters by price, rating, brand, availability |
| FR-PM-005 | Product image gallery | Medium | Supports zoom, carousel, 360° view |
| FR-PM-006 | Product variants | Medium | Handles size, color, and custom attributes |
| FR-PM-007 | Related product recommendations | Medium | Suggests complementary items based on metadata |
| FR-PM-008 | Availability notifications | Low | Users subscribe to restock alerts |
| FR-PM-009 | Brand embossing for calculators | Low | Financial calculator UI includes embossed "Aishani" branding per design system |

### 3.3 Shopping Cart

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-SC-001 | Add to cart | High | Item added with variant selection and stock validation |
| FR-SC-002 | Update quantities | High | Quantity changes persist instantly and obey inventory limits |
| FR-SC-003 | Remove items | High | Items removable with undo option |
| FR-SC-004 | Cart persistence | High | Logged-in carts persist in database; guests retain cart in localStorage for 7 days |
| FR-SC-005 | Real-time totals | High | Subtotal, tax, shipping, discounts update reactively |
| FR-SC-006 | Availability check | Medium | Stock revalidated at checkout initiation |
| FR-SC-007 | Save for later | Low | Items moved between cart and wishlist seamlessly |

### 3.4 Checkout & Payment

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-CP-001 | Guest checkout | High | Checkout completes without account creation |
| FR-CP-002 | Address selection | High | Users select saved address or add new with validation |
| FR-CP-003 | Payment methods | High | Supports Stripe cards, PayPal wallet |
| FR-CP-004 | Order review | High | Summary screen displays items, totals, shipping, taxes |
| FR-CP-005 | Payment processing | High | Secure payment with 3D Secure for eligible cards |
| FR-CP-006 | Order confirmation | High | Confirmation page plus email with order number |
| FR-CP-007 | Promo code application | Medium | Validates codes, applies discounts, logs usage |
| FR-CP-008 | Split payments | Low | Supports split tender between stored and new methods |

### 3.5 Order Management

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-OM-001 | Order history | High | Users view past orders with itemization |
| FR-OM-002 | Order tracking | High | Status timeline with carrier tracking link |
| FR-OM-003 | Order cancellation | Medium | Pre-shipment cancellation with refund initiation |
| FR-OM-004 | Invoice download | Medium | Generate PDF invoice with legal details |
| FR-OM-005 | Return/refund requests | Medium | Initiate return within policy window, status updates |
| FR-OM-006 | Status notifications | Medium | Email/SMS updates for key milestones |

### 3.6 Review & Rating

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-RR-001 | Product reviews | Medium | Verified buyers submit reviews with moderation |
| FR-RR-002 | Star ratings | Medium | 1–5 star system aggregated per product |
| FR-RR-003 | Review media | Low | Images/videos attachable with validation |
| FR-RR-004 | Helpful votes | Low | Users vote helpful/unhelpful, deduplicated per user |
| FR-RR-005 | Moderation queue | Medium | Admin approval workflow with flagging |

### 3.7 Admin Panel

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-AP-001 | Product CRUD | High | Admins manage product catalog with validations |
| FR-AP-002 | Inventory management | High | Real-time stock updates, low-stock alerts |
| FR-AP-003 | Order operations | High | View, update, fulfill orders with audit trail |
| FR-AP-004 | User management | Medium | Admins adjust roles, deactivate accounts |
| FR-AP-005 | Analytics dashboard | Medium | KPIs for sales, conversion, traffic |
| FR-AP-006 | Category management | Medium | Manage hierarchy, attributes, display order |
| FR-AP-007 | Discount management | Low | Create and schedule coupons |

### 3.8 Wishlist

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| FR-WL-001 | Add to wishlist | Medium | Save items from listings and PDP |
| FR-WL-002 | View wishlist | Medium | Paginated list with stock indicators |
| FR-WL-003 | Move to cart | Medium | One-click transfer retaining variants |
| FR-WL-004 | Remove from wishlist | Medium | Items removable with confirmation |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-PF-001 | Page load time | < 3 seconds (p75) | High |
| NFR-PF-002 | Time to Interactive | < 5 seconds (p90) | High |
| NFR-PF-003 | API latency | < 500 ms (p95) | High |
| NFR-PF-004 | Database query latency | < 100 ms (p95) | Medium |
| NFR-PF-005 | Asset optimization | WebP images, lazy loading | High |
| NFR-PF-006 | Code splitting | Route-level chunks & prefetching | Medium |

### 4.2 Scalability

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-SC-001 | Concurrent users | ≥ 10,000 active sessions | High |
| NFR-SC-002 | Horizontal scaling | Stateless services, autoscaling tiers | High |
| NFR-SC-003 | Database capacity | Connection pooling, read replicas | High |
| NFR-SC-004 | CDN distribution | Edge caching for static & ISR routes | Medium |
| NFR-SC-005 | Cache strategy | Application-level caching for hot data | Medium |

### 4.3 Security

| ID | Requirement | Description | Priority |
|----|-------------|-------------|----------|
| NFR-SE-001 | Data encryption in transit | Enforce TLS 1.3 across endpoints | High |
| NFR-SE-002 | Password hashing | bcrypt with ≥ 10 rounds | High |
| NFR-SE-003 | Injection prevention | Parameterized queries, input validation | High |
| NFR-SE-004 | XSS mitigation | Content Security Policy, output encoding | High |
| NFR-SE-005 | CSRF protection | Synchronizer tokens on state changes | High |
| NFR-SE-006 | Rate limiting | ≤ 100 requests/min/IP for auth routes | Medium |
| NFR-SE-007 | JWT hardening | HttpOnly, Secure, SameSite cookies, rotation | High |

### 4.4 Availability

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-AV-001 | Uptime | ≥ 99.9% monthly SLA | High |
| NFR-AV-002 | Backups | Automated daily backups with PITR | High |
| NFR-AV-003 | Disaster recovery | RTO < 4 hours, RPO < 1 hour | Medium |
| NFR-AV-004 | Health monitoring | Real-time alerts on error thresholds | Medium |

### 4.5 Usability

| ID | Requirement | Description | Priority |
|----|-------------|-------------|----------|
| NFR-US-001 | Mobile responsiveness | Support ≥ 320px viewports | High |
| NFR-US-002 | Browser compatibility | Latest two versions of Chrome, Firefox, Safari, Edge | High |
| NFR-US-003 | Accessibility | WCAG 2.1 Level AA compliance | Medium |
| NFR-US-004 | SEO optimization | Structured data, XML sitemap, meta tags | High |

---

## 5. Integration & Merge Requirements

### 5.1 Payment Gateways

| Service | Purpose | Priority |
|---------|---------|----------|
| Stripe | Primary card processing & subscriptions | High |
| PayPal | Alternate wallet-based payments | Medium |

**Integration Details:**
- Webhook handlers for payment success, failure, refunds
- 3D Secure support & Strong Customer Authentication compliance
- Refund API hooks propagated to order service
- Tokenization to ensure card data never touches application servers

### 5.2 Email Services

| Service | Purpose | Priority |
|---------|---------|----------|
| SendGrid or AWS SES | Transactional & lifecycle emails | High |

**Email Templates:** account verification, password reset, order confirmation, shipping updates, return/refund status, promotional campaigns (opt-in).

### 5.3 Shipping APIs

| Service | Purpose | Priority |
|---------|---------|----------|
| Shippo or EasyPost | Multi-carrier rates & tracking | Medium |

**Features:** real-time rate quotes, label generation, tracking webhook ingestion, address validation.

### 5.4 Media & Observability

| Service | Purpose | Priority |
|---------|---------|----------|
| Cloudinary or AWS S3 | Media storage & CDN delivery | High |
| Sentry | Error tracking & performance monitoring | High |
| Google Analytics | Behavioral analytics & funnels | Medium |

---

## 6. High-Level Architecture

### 6.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Browser   │  │   Mobile   │  │   Tablet   │            │
│  │  (Desktop) │  │            │  │            │            │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘            │
└─────────┼────────────────┼────────────────┼─────────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
                    ┌──────▼──────┐
                    │     CDN     │
                    │ (Edge Cache)│
                    └──────┬──────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  NEXT.JS 14 APPLICATION                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          App Router (Server & Client Components)       │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │ │
│  │  │  Routes     │  │   Layouts   │  │ UI Components│   │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │       State Management & Caching (Zustand, Query)      │ │
│  │  ┌───────┐  ┌───────┐  ┌──────────┐                  │ │
│  │  │ Cart  │  │ User  │  │  Auth    │                  │ │
│  │  └───────┘  └───────┘  └──────────┘                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │             API Routes (/app/api/*)                    │ │
│  │  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌──────────┐    │ │
│  │  │ /auth   │ │ /products│ │ /orders│ │ /users   │    │ │
│  │  └─────────┘ └──────────┘ └────────┘ └──────────┘    │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬───────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼──────┐  ┌─────▼─────┐   ┌──────▼──────┐
    │ PostgreSQL │  │  Cache    │   │ External    │
    │  Database  │  │  Layers   │   │ Services    │
    │            │  │ (ISR/CDN) │   │ (Stripe,    │
    └────────────┘  └───────────┘   │ PayPal,     │
                                    │ SendGrid,   │
                                    │ Shippo,     │
                                    │ Cloudinary) │
                                    └─────────────┘
```

### 6.2 Technology Stack Details

**Frontend:** Next.js 14 App Router, React 18 with Suspense/Streaming, TypeScript (strict), Tailwind CSS, Zustand for global state, React Hook Form for forms, Zod for validation.

**Backend:** Next.js API Routes on Node.js runtime, serverless functions for transactional endpoints, background jobs via scheduled route handlers.

**Database:** PostgreSQL 15+, Prisma ORM for type-safe access, migrations managed through Prisma Migrate.

**Deployment:** Vercel for hosting, GitHub Actions CI/CD (lint, test, preview deployments), Infrastructure as Code via Vercel configuration.

### 6.3 Database Architecture

**Connection Management:**
- Connection pooling via PgBouncer equivalent (max 100 connections)
- Idle timeout 10 minutes, query timeout 30 seconds

**Backup Strategy:**
- Automated daily backups with 30-day retention
- Point-in-time recovery enabled for production

---

## 7. User Stories & Security Overview

### 7.1 Customer Epics
- As a customer, I browse products by category to discover relevant items.
- As a customer, I search by keyword and apply filters to find specific products quickly.
- As a customer, I add items to my cart and maintain selections across sessions.
- As a customer, I apply promo codes and complete secure checkout using my preferred payment method.
- As a customer, I track order status and initiate returns when needed.

### 7.2 Admin Epics
- As an admin, I create and update products to keep catalog data accurate.
- As an admin, I manage inventory levels to prevent overselling.
- As an admin, I process orders, handle refunds, and generate shipping labels.
- As an admin, I monitor sales analytics and customer behavior to optimize strategy.

### 7.3 System Stories
- As the system, I send transactional emails so customers receive timely updates.
- As the system, I synchronize inventory after each order to maintain accuracy.
- As the system, I log exceptions and performance metrics for observability.
- As the system, I execute scheduled backups to protect data integrity.

### 7.4 Security & Compliance

#### Authentication & Authorization Flow
1. User submits credentials or OAuth token.
2. Backend validates input against PostgreSQL user records.
3. Access token (15 min) and refresh token (7 days) issued via HttpOnly Secure cookies.
4. Protected routes verify access token signature and scopes.
5. Refresh endpoint rotates tokens and revokes on logout or anomaly detection.

#### Token Specifications & Password Policy
- Algorithms: RS256 preferred (HS256 fallback for internal services).
- Access token TTL: 15 minutes; refresh token TTL: 7 days with rotation.
- Storage: HttpOnly, Secure, SameSite=Lax cookies to mitigate XSS/CSRF.
- Password rules: ≥ 8 characters, uppercase, lowercase, numeric, special character.

#### Data Protection Measures

| Measure | Implementation | Priority |
|---------|----------------|----------|
| Encryption at rest | PostgreSQL native encryption / managed disk encryption | High |
| Encryption in transit | TLS 1.3 enforced end-to-end | High |
| Password hashing | bcrypt (cost ≥ 10) with per-user salts | High |
| Sensitive data masking | Redact PII in logs, monitor access audits | High |
| Data minimization | Collect only necessary user attributes | Medium |

#### Payment Flow Diagram
```
Customer → Stripe.js Card Element → Tokenized Payment Intent → Stripe API →
Webhook Callback → UniCart Order Service → Order Confirmation Email
```

#### API Security Controls
- Rate limiting using middleware (100 req/min/IP on auth routes, 500 req/min/IP on catalog routes)
- Input validation via Zod schemas for all request payloads
- Strict Content Security Policy and secure headers (HSTS, X-Frame-Options)
- CSRF tokens on state-changing requests with double-submit cookie pattern
- CORS allowlist for first-party domains (web, admin, mobile)

#### Privacy & GDPR Compliance
- Consent banner for cookies and tracking scripts
- Data export requests fulfilled within 30 days via automated workflow
- Account deletion triggers anonymization of personal data in transactional tables
- Audit log for administrative access to PII

#### Monitoring & Incident Response
- Centralized logging (JSON structured logs) ingested into monitoring platform
- Alerting thresholds for authentication anomalies, payment failures, error rates
- Incident response runbook with steps: detect, triage, contain, eradicate, recover, postmortem

---

## 8. Success Criteria

**Technical Checklist:**
- [ ] API endpoints ≤ 500 ms at p95 under load tests
- [ ] Time to Interactive ≤ 3 seconds on 4G mobile
- [ ] 99.9% uptime achieved over the last 30 days
- [ ] Zero critical security vulnerabilities in dependency and SAST scans
- [ ] ≥ 80% automated test coverage on critical paths

**Business Checklist:**
- [ ] Successful payment completion rate ≥ 99%
- [ ] Cart abandonment ≤ 70%
- [ ] Registration conversion ≥ 25%
- [ ] Customer satisfaction survey ≥ 4.5/5
- [ ] Mobile performance score ≥ 90 (Lighthouse)

---

**End of Document**

