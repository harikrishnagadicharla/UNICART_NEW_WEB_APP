# UniCart Architectural Design

## 1. Introduction

### 1.1 Purpose of the System
UniCart is a cloud-native, multi-vendor e-commerce platform that delivers a seamless end-to-end shopping experience. The solution must support product discovery, secure checkout, post-purchase management, and administrative operations while meeting enterprise-grade performance, security, and compliance targets.

### 1.2 High-Level Description
UniCart leverages a modular Next.js 14 application deployed on Vercel with PostgreSQL as the primary data store. The platform exposes RESTful APIs for core commerce capabilities, integrates with Stripe and PayPal for payments, and incorporates auxiliary services (e.g., SendGrid, Shippo, Cloudinary, Sentry) for operational excellence. A branded financial calculator featuring embossed “Aishani” styling is embedded within storefront flows for promotional financing.

## 2. Architecture Overview

### 2.1 System Architecture (High-Level)
The solution is composed of presentation, application, data, and integration layers. Client applications (web, mobile web, future native apps) communicate with server-side rendered and client-hydrated experiences. Business logic runs within serverless API routes and background tasks. Persistent data resides in PostgreSQL, with CDN-backed caching and third-party integrations supporting payment, messaging, shipping, media, and observability.

### 2.2 Architecture Diagram (ASCII)
```
┌──────────────────────────────────────────────────────────────────────────┐
│                              Client Layer                                │
│  Web (Next.js SSR/CSR) • Mobile Web • Native App (future via BFF APIs)   │
└───────────────▲───────────────────────────▲──────────────────────────────┘
                │                           │
          CDN / Edge Cache (Vercel Edge, ISR Revalidation)                  │
                │                           │
┌───────────────┴──────────────────────────────────────────────────────────┐
│                       Next.js 14 Application Layer                        │
│  - App Router (Server & Client Components)                                │
│  - UI Modules (Storefront, Admin, Calculator w/ “Aishani” embossing)      │
│  - State Mgmt (Zustand, React Query)                                      │
│  - API Routes (/api/auth, /api/products, /api/orders, /api/payments, …)   │
│  - Background jobs (scheduled/revalidation handlers)                      │
└───────────────┬──────────────────────────────────────────────────────────┘
                │
      ┌─────────┴───────────┬──────────────────────┬──────────────────────┐
      │                     │                      │                      │
┌─────▼────┐          ┌─────▼────┐            ┌────▼────┐           ┌─────▼─────┐
│PostgreSQL│          │Redis/Edge│            │Message  │           │3rd Parties│
│ (Prisma) │          │Cache (ISR│            │Queue (e.g│          │Stripe,     │
│          │          │Store, cart│           │. BullMQ)│           │PayPal,     │
└─────┬────┘          │snapshots)│            └────┬────┘           │SendGrid,   │
      │                └─────────┘                 │                │Shippo,     │
      │                                            │                │Cloudinary, │
┌─────▼────────────────────────────────────────────▼────────────────▼───────────┐
│                          Observability & Ops                                   │
│  Sentry • Logging (JSON) • Metrics (Prometheus-compatible) • GitHub Actions CI/CD│
└───────────────────────────────────────────────────────────────────────────────┘
```

## 3. Application Architecture

### 3.1 Frontend Design
- **Frameworks:** Next.js 14 App Router with React 18, TypeScript (strict), Tailwind CSS, component-driven design system.
- **Rendering Strategy:** Hybrid SSR/ISR for SEO-critical storefront routes, CSR for dynamic dashboards, static generation for marketing content.
- **State Management:** React Query for server state (catalog, cart totals), Zustand for lightweight client store (UI toggles, session flags).
- **Form Handling:** React Hook Form + Zod validation across login, checkout, admin forms.
- **Accessibility & Performance:** WCAG 2.1 AA alignment, responsive breakpoints ≥320px, code-splitting via route segments, image optimization via Next Image & Cloudinary CDN.
- **Branding:** Financial calculator modal embeds embossed “Aishani” identity using the design system’s tokenized styles.

### 3.2 Backend Design
- **Execution Environment:** Next.js serverless API routes on Vercel; capability to offload long-running jobs to Vercel Edge Functions or dedicated background workers (e.g., Vercel Cron + external queue).
- **Domain Modules:** Auth, Catalog, Cart, Checkout, Orders, Payments, Reviews, Wishlist, Admin, Analytics, and Calculator.
- **Business Logic Layer:** Shared TypeScript service classes orchestrating database access via Prisma, external API calls, and domain validations.
- **Background Processing:** Scheduled revalidation of ISR pages, inventory synchronization, low-stock alert generation, email dispatch via queue.
- **Configuration & Secrets:** Managed via Vercel environment variables with secret storage; development uses `.env` files secured through secret management tooling.

### 3.3 APIs and Integrations
- **RESTful APIs:** `/api/auth`, `/api/users`, `/api/products`, `/api/cart`, `/api/orders`, `/api/payments`, `/api/reviews`, `/api/admin/*`, `/api/calculator`.
- **Auth Endpoints:** Email/password login, OAuth (Google, Facebook), refresh token rotation, password reset flows.
- **Catalog Endpoints:** Product listing with filtering, PDP retrieval, search, recommendations, wishlist interactions.
- **Checkout/Order Endpoints:** Cart mutation, shipping address management, payment intent creation, order placement, order tracking.
- **Admin APIs:** Product CRUD, inventory adjustments, order lifecycle management, analytics data aggregation.
- **Integrations:** Stripe & PayPal (payments, webhooks), SendGrid/AWS SES (email), Shippo/EasyPost (shipping rates, labels), Cloudinary/S3 (media), Sentry (observability), Google Analytics (behavioral insights).
- **Webhooks:** Stripe payment status, PayPal IPN, Shippo tracking updates—processed via dedicated `/api/webhooks/*` routes with signature validation.

## 4. Data Architecture

### 4.1 Database Design (Schema Overview)
Primary datastore: PostgreSQL 15+ with Prisma ORM. Key entities:
- `User` (id, email, hashed_password, role, oauth_provider, status, created_at)
- `UserProfile` (user_id, name, phone, preferences)
- `Address` (id, user_id, type, address_lines, city, state, postal_code, country, is_default)
- `Product` (id, vendor_id, name, slug, description, category_id, seo_meta, status)
- `ProductVariant` (id, product_id, sku, attributes JSONB, price, compare_at_price)
- `Inventory` (variant_id, quantity_on_hand, safety_stock, low_stock_threshold)
- `ProductAsset` (id, product_id, url, alt_text, position)
- `Category` (id, parent_id, name, path, sort_order)
- `Cart` (id, user_id or session_id, status, updated_at)
- `CartItem` (id, cart_id, variant_id, quantity, price_snapshot, promo_applied)
- `Wishlist` / `WishlistItem` for saved products
- `Order` (id, user_id, cart_id, status, totals JSONB, payment_status, shipped_at)
- `OrderItem` (id, order_id, variant_id, quantity, price, tax, discount)
- `Payment` (id, order_id, provider, external_intent_id, status, amount_paid, method_details JSONB)
- `Shipment` (id, order_id, carrier, tracking_number, status, label_url)
- `Review` (id, product_id, user_id, rating, content, status, moderation_flags)
- `Promotion` (id, code, discount_type, value, start_at, end_at, usage_limit)
- `CalculatorSession` (id, user_id/session, amount, down_payment, rate, term, result_snapshot, created_at)
- `AuditLog` (id, actor_id, action, entity_type, entity_id, metadata, created_at)

**Relationships:** Users to Addresses (1:N), Products to Variants (1:N), Orders to OrderItems (1:N), Orders to Payments (1:1..N), Orders to Shipments (1:1..N), Cart to CartItems (1:N), Wishlist to WishlistItems (1:N), AuditLog references polymorphic entities.

### 4.2 ER Diagram (ASCII)
```
User ─┬─< Address
      ├─1> UserProfile
      ├─< Cart ─< CartItem >─ ProductVariant >─ Product ─< ProductAsset
      ├─< Wishlist ─< WishlistItem >─ ProductVariant
      ├─< Order ─< OrderItem >─ ProductVariant
      └─< Review >─ Product

Product ─< ProductVariant ─1> Inventory
Product ─< Review
Product ─1> Category (self-referencing hierarchy)

Order ─1> Payment
Order ─< Shipment
Order ─1> Cart
Promotion ─< OrderItem (applied promotions)

CalculatorSession ─(optional)─> User
AuditLog ─> {User, Product, Order, Promotion, …}
```

### 4.3 Data Flow
1. **Browsing:** Clients request storefront routes → Next.js SSR renders page → Queries product/catalog data via Prisma → Responses cached via ISR/CDN.
2. **Cart & Checkout:** Client interactions mutate cart via `/api/cart` → Server validates inventory & pricing → Cart state persisted in PostgreSQL, mirrored via client cache → Checkout orchestrates address retrieval, shipping rate calculation (Shippo), payment intent (Stripe/PayPal).
3. **Order Fulfillment:** Payment success webhook updates `Payment` & `Order` status → Inventory decremented → Shipment created via shipping API → Notifications sent via SendGrid queue.
4. **Admin Operations:** Admin interface uses secure APIs to manage products/orders → Writes routed through Prisma transactions, with audit logs recorded.
5. **Financial Calculator:** Modal captures inputs → `/api/calculator` computes amortization → Results stored in `CalculatorSession` for analytics and re-use.

## 5. Technology Stack
- **Languages:** TypeScript (frontend & backend), SQL (Prisma migrations), JSX/TSX.
- **Frontend:** Next.js 14, React 18, Tailwind CSS, Headless UI, React Query, Zustand.
- **Backend:** Node.js (Vercel runtime), Next.js API routes, Prisma ORM, BullMQ (or Vercel Cron + Upstash Queue) for background tasks.
- **Database:** PostgreSQL 15+, optional Redis/Upstash for caching & session acceleration.
- **Infrastructure:** Vercel (hosting & CDN), GitHub Actions (CI/CD), IaC via Vercel project settings & environment configurations.
- **Integrations:** Stripe, PayPal, SendGrid/AWS SES, Shippo/EasyPost, Cloudinary/S3, Sentry, Google Analytics.
- **Tooling:** ESLint, Prettier, Jest/Testing Library, Playwright, Cypress (optional for E2E), Storybook (component documentation).

## 6. Security Architecture

### 6.1 Authentication & Authorization
- **Auth Stack:** JWT access (15 min) & refresh tokens (7 days) delivered via HttpOnly Secure SameSite cookies; OAuth support for Google/Facebook.
- **Role-Based Access:** Roles include `customer`, `vendor`, `admin`, `support`; enforced through middleware and route-level guards.
- **Session Management:** Refresh token rotation, token revocation list stored in Redis/Upstash, anomaly detection triggers forced logout.
- **Admin MFA:** Optional TOTP-based MFA for privileged accounts.

### 6.2 Data Protection & Compliance
- **Encryption:** TLS 1.3 for all traffic; PostgreSQL encryption at rest via managed disks; secrets stored in Vercel Secret Store.
- **Password Policy:** Bcrypt hash (cost ≥10), strong password requirements; rate limiting on login attempts (100 req/min/IP).
- **Input Sanitization:** Zod validation, parameterized queries, output encoding to prevent injection and XSS.
- **CSRF & CORS:** Double-submit cookie tokens for state-changing requests; CORS allowlist covering storefront, admin, and trusted mobile origins.
- **Compliance:** PCI-DSS alignment by delegating payment data to Stripe/PayPal; GDPR readiness via consent management, data export/deletion workflows, audit logging of PII access.
- **Monitoring:** Sentry error tracking, anomaly dashboards, alerting on authentication anomalies, payment failures, 5xx spikes. Incident response runbooks maintained by ops team.

## 7. Deployment Architecture

### 7.1 Hosting Environment
- **Environment Strategy:** Development (local & preview deployments), Staging (mirrors production integrations in sandbox mode), Production (Vercel multi-region).
- **Runtime:** Vercel serverless functions for APIs, edge functions for personalization and caching, static assets via Vercel CDN.
- **Data Hosting:** Managed PostgreSQL (e.g., Neon, Supabase, RDS proxy) proxied via PgBouncer-equivalent; Redis/Upstash for cache; Cloudinary/S3 for media.

### 7.2 Scalability & Performance
- Horizontal scaling via serverless autoscaling and CDN edge network.
- Database scalability with read replicas, connection pooling, and query optimization.
- Application-level caching: React Query cache hydration, ISR revalidation, CDN caching headers.
- Queue-based decoupling for email, webhook, and inventory synchronization ensures resilience under load.

### 7.3 CI/CD Pipeline
- **Source Control:** GitHub with trunk-based branching and feature flags for risky features.
- **Pipeline Stages:**
  1. Lint & Type Check (ESLint, TypeScript).
  2. Unit & Integration Tests (Jest, Testing Library, Prisma test DB).
  3. E2E Tests (Playwright/Cypress against ephemeral preview).
  4. Build & Preview Deployment (Vercel preview URLs).
  5. Manual QA sign-off → Production deployment via protected branch merge.
- **Security Gates:** Dependency scanning (Dependabot/Snyk), secret scanning, SAST rules.

## 8. Non-Functional Considerations

### 8.1 Reliability
- 99.9% uptime target with automated health checks, blue/green deployment via Vercel previews.
- Daily automated backups with PITR (Point-in-Time Recovery); disaster recovery plan with RTO < 4 hours, RPO < 1 hour.
- Graceful degradation for non-critical features (recommendations, personalization) when upstream integrations fail.

### 8.2 Maintainability
- Modular domain-driven folder structure (e.g., `/app/(storefront)`, `/app/(admin)`, `/app/api/*`).
- Shared component library documented in Storybook; strict TypeScript for type safety.
- Automated code formatting (Prettier) and linting to enforce conventions.
- Comprehensive logging & observability to ease troubleshooting.

### 8.3 Performance
- Page load p75 < 3s, TTI < 5s (p90) via SSR, code splitting, image optimization, lazy loading.
- API latency < 500 ms (p95) enforced through Prisma query tuning, caching, and asynchronous processing.
- Database queries optimized (< 100 ms p95) with indexes, hot-path caching, and read replicas.

### 8.4 Availability
- Multi-zone hosting in Vercel, DNS failover readiness.
- Health probes and synthetic monitoring to detect outages.
- Load and stress testing before major releases to validate 10,000+ concurrent user support.

---

**Document Owner:** Solution Architecture Team  
**Last Updated:** 2025-11-07

