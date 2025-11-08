# UniCart UI/UX Wireframes

## Overview
- **Purpose:** Translate BRD requirements into intuitive, accessible, and responsive interfaces for UniCart’s multi-vendor marketplace.
- **Audience:** Product owners, engineers, QA, and stakeholders aligning on scope prior to high-fidelity design.
- **Experience Pillars:** Seamless discovery, trustworthy checkout, actionable account management, empowered administrators, consistent “Aishani” promotional branding on financial calculator touchpoints.
- **Guiding Principles:** Mobile-first responsiveness, WCAG 2.1 AA alignment, performance-friendly layouts, modular components reusable across storefront and admin areas.

## User Flows
- **Customer: Browse to Purchase (Registered)
  1. Land on Home → browse featured categories.
  2. Navigate to Product Listing via category or search.
  3. Apply filters, view product detail, select variant.
  4. Add to cart → review cart → proceed to checkout.
  5. Select saved address → choose payment → review order.
  6. Confirm purchase → receive confirmation, access order tracking.
- **Customer: Guest Checkout with Promo Code
  1. Discover product → add to cart.
  2. Review cart → proceed as guest.
  3. Enter shipping details → continue to payment.
  4. Apply promo code → complete payment via Stripe or PayPal.
  5. View confirmation → optional account creation prompt.
- **Customer: Post-Purchase Management
  1. Login → Account Dashboard.
  2. View Order History → select order.
  3. Track shipment, request return/refund, download invoice.
  4. Receive status updates via email/SMS.
- **Customer: Wishlist to Cart
  1. Save products from listing/product pages.
  2. Visit Wishlist → review availability.
  3. Move selected items to cart with retained variants.
  4. Continue checkout flow.
- **Administrator: Catalog & Order Oversight
  1. Login to Admin Panel → view dashboard KPIs.
  2. Manage products, inventory, categories.
  3. Process orders, manage returns/refunds.
  4. Review analytics and low-stock alerts.

## Screen List
- Storefront Home / Landing
- Product Listing & Advanced Filters
- Product Detail Page (PDP)
- Cart Review
- Checkout – Shipping Address
- Checkout – Payment & Review
- Order Confirmation
- Wishlist
- User Account Dashboard
- Order History & Detail
- Authentication (Login & Register)
- Password Reset
- Financial Calculator Promo Modal (Aishani branding)
- Admin Dashboard
- Admin Product Management
- Admin Order Management & Fulfillment
- Admin Analytics & Reports

## Screen Wireframes

### Screen: Storefront Home / Landing
- **Purpose:** Introduce brand, highlight promotions, and direct shoppers to key categories.
- **Layout/Sections:** Global header, hero carousel, promotional tiles, category grid, personalized recommendations, footer.
- **Key Functionalities:** Search with autosuggest, category navigation, personalized product rails, promo CTA.
- **Navigation:** Links to listing pages, PDPs, account, cart, wishlist.

**Desktop Wireframe**
```
+--------------------------------------------------------------------------------+
| Global Header: Logo | Search Bar | Account | Wishlist | Cart (0)               |
+--------------------------------------------------------------------------------+
| Mega Nav: Categories | Deals | New Arrivals | Support                         |
+-----------------------------------+--------------------------------------------+
| Hero Carousel (auto & manual)     | Promo Tiles (Stacked)                      |
| • Primary CTA                     | • Flash Sale                               | 
| • Secondary CTA                   | • Free Shipping                            |
+-----------------------------------+--------------------------------------------+
| Category Highlights (4-up cards with icons & badges)                          |
+--------------------------------------------------------------------------------+
| Recommended For You (horizontal scroll)                                       |
+--------------------------------------------------------------------------------+
| Footer: Support | Policies | Newsletter | Social                               |
+--------------------------------------------------------------------------------+
```

**Mobile Wireframe**
```
+----------------------------------+
| Sticky Top Bar: ☰ | Logo | 🛒0 |
| Search Field (full width)        |
+----------------------------------+
| Hero Carousel (swipe)            |
+----------------------------------+
| Promo Stack (Flash Sale, Free Shipping) |
+----------------------------------+
| Category Chips (h-scroll)        |
+----------------------------------+
| Recommended (card carousel)      |
+----------------------------------+
| Footer accordion links           |
+----------------------------------+
```

### Screen: Product Listing & Advanced Filters
- **Purpose:** Present categorized/search results with rich filters to speed discovery.
- **Layout/Sections:** Header, breadcrumb, filter sidebar, product grid, pagination/continuous scroll.
- **Key Functionalities:** Keyword highlight, multi-select filters, sort by options, quick add to wishlist.
- **Navigation:** Back to categories, link to PDP, persistent cart access.

**Desktop Wireframe**
```
+--------------------------------------------------------------------------------+
| Header (persistent)                                                             |
+--------------------------------------------------------------------------------+
| Breadcrumb: Home > Electronics > Laptops                                        |
+---------------------------+-----------------------------------------------------+
| Filters Sidebar           | Product Grid (card 3-up)                            |
| • Price slider            | [Image][Title][Rating][Price][Add to Cart]          |
| • Brand checkboxes        |                                                     |
| • Rating stars            |                                                     |
| • Availability toggle     |                                                     |
| • Promo code eligibility  |                                                     |
+---------------------------+-----------------------------------------------------+
| Results info & pagination controls                                             |
+--------------------------------------------------------------------------------+
```

**Mobile Wireframe**
```
+----------------------------------+
| Header (Logo, Search, Cart)      |
+----------------------------------+
| Breadcrumb (collapsible)         |
+----------------------------------+
| Filter & Sort Sticky Bar [Filter][Sort] |
+----------------------------------+
| Product Cards (2-up responsive)  |
| • Image                           |
| • Title                           |
| • Rating, Price, CTA             |
+----------------------------------+
| Infinite scroll loader            |
+----------------------------------+
```

### Screen: Product Detail Page (PDP)
- **Purpose:** Provide full product information, variant selection, and purchase actions.
- **Layout/Sections:** Gallery, product summary, pricing, variants, description, reviews, related items.
- **Key Functionalities:** Image zoom, variant selectors, add to cart, add to wishlist, review submission.
- **Navigation:** Back to listings, breadcrumb, related product links, cart.

**Desktop Wireframe**
```
+--------------------------------------------------------------------------------+
| Header                                                                   🛒     |
+--------------------------------------------------------------------------------+
| Breadcrumb                                                                |
+--------------------------+------------------------------------------------------+
| Image Gallery            | Product Summary                                     |
| • Main image             | • Title                                             |
| • Thumbnails             | • Ratings & Stars                                   |
| • 360° view icon         | • Price & Promo (badge)                             |
|                          | • Variant selectors (Size, Color)                   |
|                          | • Quantity stepper                                  |
|                          | • Buttons: Add to Cart | Buy Now | Wishlist         |
+--------------------------+------------------------------------------------------+
| Tabs: Description | Specs | Reviews | Q&A                                       |
+--------------------------------------------------------------------------------+
| Related Products Carousel (4 cards)                                           |
+--------------------------------------------------------------------------------+
```

**Mobile Wireframe**
```
+----------------------------------+
| Header with back, logo, cart     |
+----------------------------------+
| Image Carousel (swipe, pinch)    |
+----------------------------------+
| Product Summary                  |
| • Title                          |
| • Rating & Reviews link          |
| • Price + Promo badge            |
+----------------------------------+
| Variant selectors (accordion)    |
| Quantity stepper                 |
| CTA Buttons (stacked)            |
+----------------------------------+
| Tabs (sticky) Description | Reviews |
+----------------------------------+
| Related carousel                 |
+----------------------------------+
```

### Screen: Cart Review
- **Purpose:** Summarize selected items, enable adjustments, and present order totals.
- **Layout/Sections:** Item list, price summary, promotion entry, recommendations.
- **Key Functionalities:** Quantity updates, remove/undo, promo code apply, continue shopping.
- **Navigation:** Proceed to checkout, return to PDP/listing, wishlist move.

**Desktop Wireframe**
```
+--------------------------------------------------------------------------------+
| Header (progress indicator: Cart > Checkout > Confirmation)                   |
+----------------------------------+---------------------------------------------+
| Cart Items List                 | Order Summary                               |
| [Img][Title][Variant][Qty +/-]  | • Subtotal                                  |
| Save for later / Remove links   | • Shipping estimate                          |
| Stock alerts inline             | • Tax                                        |
|                                 | • Promo code field + Apply                   |
|                                 | • Total & Checkout CTA                       |
+----------------------------------+---------------------------------------------+
| Recommended Add-ons (carousel)                                               |
+--------------------------------------------------------------------------------+
```

**Mobile Wireframe**
```
+----------------------------------+
| Header stepper: Cart • Checkout |
+----------------------------------+
| Item Card                        |
| • Image left, details right      |
| • Qty controls, remove, save     |
+----------------------------------+
| Order Summary (sticky footer)    |
| • Promo field, totals, Checkout  |
+----------------------------------+
```

### Screen: Checkout – Shipping Address
- **Purpose:** Collect or confirm shipping details for guest and registered users.
- **Layout/Sections:** Progress indicator, address selection/entry, shipping options, contact info.
- **Key Functionalities:** Saved address cards, add new form with validation, delivery options with ETA.
- **Navigation:** Back to cart, forward to payment step, link to account address book.

**Desktop Wireframe**
```
+--------------------------------------------------------------------------------+
| Checkout Stepper: Cart > Shipping > Payment > Review                          |
+----------------------------------+---------------------------------------------+
| Saved Addresses                  | Order Summary (read-only)                  |
| [Radio][Address Card Edit]       | • Items                                    |
| + Add New Address button         | • Totals                                   |
| New Address Form (collapsible)   | • Support info                             |
| Shipping Method (radio list)     |                                             |
+----------------------------------+---------------------------------------------+
| CTA: Continue to Payment (primary) | Back to Cart (secondary)                  |
+--------------------------------------------------------------------------------+
```

**Mobile Wireframe**
```
+----------------------------------+
| Stepper: Cart > Ship > Pay > Review |
+----------------------------------+
| Saved Address Cards (stacked)    |
| Add New (accordion form)         |
| Shipping options (radio)         |
+----------------------------------+
| Sticky order summary & CTA       |
+----------------------------------+
```

### Screen: Checkout – Payment & Review
- **Purpose:** Capture payment, promo, and final review before confirmation.
- **Layout/Sections:** Payment method selection, billing address, order summary, promo entry, trust signals.
- **Key Functionalities:** Stripe card element, PayPal button, promo validation, terms acceptance.
- **Navigation:** Back to shipping, complete order, link to help.

**Desktop Wireframe**
```
+--------------------------------------------------------------------------------+
| Stepper: Cart > Shipping > Payment > Review                                    |
+----------------------------------+---------------------------------------------+
| Payment Methods                  | Order Review                               |
| • Stripe Card Form               | • Item list (expandable)                   |
| • PayPal Button                  | • Totals, taxes, shipping                  |
| Billing address toggle           | • Promo code input                         |
| Terms checkbox                   | • Estimated delivery                       |
+----------------------------------+---------------------------------------------+
| CTA: Place Order (primary)        | Back to Shipping                           |
+--------------------------------------------------------------------------------+
```

**Mobile Wireframe**
```
+----------------------------------+
| Stepper condensed (dots + titles) |
+----------------------------------+
| Payment options (accordion)       |
| Card form fields                  |
| PayPal button                     |
+----------------------------------+
| Order Review accordion            |
| Promo input                       |
| Terms checkbox                    |
+----------------------------------+
| Sticky Place Order button         |
+----------------------------------+
```

### Screen: Order Confirmation
- **Purpose:** Confirm successful purchase, show next steps, and encourage continued engagement.
- **Layout/Sections:** Confirmation banner, order summary, tracking info, recommended products.
- **Key Functionalities:** Download invoice, share order, account creation prompt for guests.
- **Navigation:** View order details, continue shopping, manage account.

**Desktop Wireframe**
```
+--------------------------------------------------------------------------------+
| Success Banner: ✅ Order Confirmed (Order #12345)                              |
+----------------------------------+---------------------------------------------+
| Order Snapshot                   | Next Steps                                  |
| • Items summary                  | • Track shipment button                     |
| • Shipping address               | • Download invoice                          |
| • Payment method                 | • Create account prompt (guest)             |
+----------------------------------+---------------------------------------------+
| Recommended Products row                                                     |
+--------------------------------------------------------------------------------+
| Footer links                                                                |
+--------------------------------------------------------------------------------+
```

**Mobile Wireframe**
```
+----------------------------------+
| ✅ Order Confirmed banner         |
+----------------------------------+
| Order summary card                |
| Track shipment button             |
| Invoice download link             |
+----------------------------------+
| Recommended carousel              |
+----------------------------------+
| CTA: Continue Shopping            |
+----------------------------------+
```

### Screen: Wishlist
- **Purpose:** Allow users to manage saved items and transition them into the cart.
- **Layout/Sections:** Saved item grid/list, stock indicators, bulk actions.
- **Key Functionalities:** Move to cart, remove, stock alerts, sharing.
- **Navigation:** Back to PDP/listing, cart.

**Desktop Wireframe**
```
+--------------------------------------------------------------------------------+
| Header                                                                     🛒 |
+--------------------------------------------------------------------------------+
| Wishlist Controls: Select All | Move to Cart | Remove | Sort by              |
+--------------------------------------------------------------------------------+
| Item Cards (3-up): [Image][Details][Stock][Buttons]                          |
+--------------------------------------------------------------------------------+
| Recently Viewed Strip                                                       |
+--------------------------------------------------------------------------------+
```

**Mobile Wireframe**
```
+----------------------------------+
| Header with back, title, cart    |
+----------------------------------+
| Bulk actions (icons)             |
+----------------------------------+
| Item cards (stacked)             |
| • Image top                      |
| • Stock pill                     |
| • Move to Cart / Remove buttons  |
+----------------------------------+
| Recently viewed (scroll)         |
+----------------------------------+
```

### Screen: User Account Dashboard
- **Purpose:** Provide centralized access to profile, orders, addresses, payment methods.
- **Layout/Sections:** Overview cards, quick actions, navigation menu.
- **Key Functionalities:** Order status snapshot, address management, security settings.
- **Navigation:** Deep links to orders, wishlist, profile, support.

**Desktop Wireframe**
```
+--------------------------------------------------------------------------------+
| Account Header: Greeting, Logout, Support                                    |
+----------------------+---------------------------------------------------------+
| Side Nav             | Main Content                                          |
| • Overview           | • Order Status cards (In Progress, Delivered)         |
| • Orders             | • Quick Links: Manage Addresses, Payment Methods      |
| • Addresses          | • Recent activity feed                                |
| • Payments           |                                                      |
| • Security           |                                                      |
+----------------------+---------------------------------------------------------+
```

**Mobile Wireframe**
```
+----------------------------------+
| Top Bar: Back | Account | Logout |
+----------------------------------+
| Overview cards (swipe)           |
+----------------------------------+
| Quick actions list               |
+----------------------------------+
| Tabs: Orders | Addresses | Payments | Settings |
+----------------------------------+
| Recent activity list             |
+----------------------------------+
```

### Screen: Order History & Detail
- **Purpose:** Allow users to track, manage, and service past orders.
- **Layout/Sections:** Order list, filters, detail pane with timeline and actions.
- **Key Functionalities:** Tracking link, request return, invoice download, status notifications.
- **Navigation:** Back to dashboard, link to support.

**Desktop Wireframe**
```
+--------------------------------------------------------------------------------+
| Order Filters: Status dropdown, Date range, Search by ID                      |
+----------------------------------+---------------------------------------------+
| Order List (left column)         | Order Detail (right panel)                 |
| [Order #][Status][Date][Total]   | • Status timeline                          |
|                                  | • Shipment tracking CTA                     |
|                                  | • Items table                               |
|                                  | • Actions: Return, Invoice, Support         |
+----------------------------------+---------------------------------------------+
```

**Mobile Wireframe**
```
+----------------------------------+
| Filters button + search field    |
+----------------------------------+
| Order cards (accordion)          |
| • Order #, status badge          |
| • Expand to show items, actions  |
+----------------------------------+
| Tracking link & action buttons   |
+----------------------------------+
```

### Screen: Authentication (Login & Register)
- **Purpose:** Provide secure access with standard credentials and social logins.
- **Layout/Sections:** Auth tabs, form fields, social buttons, security messaging.
- **Key Functionalities:** Email/password validation, OAuth options, password visibility toggle.
- **Navigation:** Links to password reset, privacy policy, back to storefront.

**Desktop Wireframe**
```
+--------------------------------------------------------------------------------+
| Centered Auth Card                                                           |
| [Logo]                                                                       |
| Tabs: Login | Register                                                       |
| Form Fields (Email, Password, Confirm)                                       |
| Remember me checkbox, Forgot password link                                   |
| CTA Button                                                                   |
| Divider: Or continue with                                                    |
| Social Buttons: Google, Facebook                                             |
+--------------------------------------------------------------------------------+
```

**Mobile Wireframe**
```
+----------------------------------+
| Back arrow | Logo centered       |
+----------------------------------+
| Auth card full width             |
| Tabs stacked                      |
| Form fields vertical              |
| CTA button full width            |
| Social buttons icons             |
+----------------------------------+
```

### Screen: Password Reset
- **Purpose:** Allow users to request and set a new password securely.
- **Layout/Sections:** Request form, confirmation messaging, strength indicator.
- **Key Functionalities:** Email validation, success state, follow-up guidance.
- **Navigation:** Back to login, contact support.

**Desktop Wireframe**
```
+--------------------------------------------------------------------------------+
| Password Reset Card                                                          |
| • Email input                                                                |
| • Send Reset Link button                                                      |
| • Info panel: “Check your email for instructions”                             |
| • Link back to Login                                                          |
+--------------------------------------------------------------------------------+
```

**Mobile Wireframe**
```
+----------------------------------+
| Back arrow | Reset Password      |
+----------------------------------+
| Email field full width           |
| CTA button                       |
| Info message                     |
| Back to Login link               |
+----------------------------------+
```

### Screen: Financial Calculator Promo Modal (Aishani Branding)
- **Purpose:** Promote financing options and calculate estimated payments with branded experience.
- **Layout/Sections:** Modal header, input fields, results summary, CTA.
- **Key Functionalities:** Loan amount slider, interest rate input, monthly payment output, share/download.
- **Navigation:** Triggered from PDP and cart, closes to return context.

**Desktop Wireframe**
```
+--------------------------------------------------------------+
| Modal Header: "Aishani Financing" (Embossed logo treatment)  |
| Close (X)                                                     |
+--------------------------------------------------------------+
| Inputs:                                                      |
| • Purchase amount slider                                     |
| • Down payment input                                         |
| • Term dropdown                                              |
| • Interest rate field                                        |
+--------------------------------------------------------------+
| Results Panel:                                               |
| • Monthly payment                                            |
| • APR summary                                                |
| • CTA buttons: Apply Now, Save Estimate                      |
+--------------------------------------------------------------+
| Footer links: Learn more | Contact support                   |
+--------------------------------------------------------------+
```

**Mobile Wireframe**
```
+----------------------------------+
| Modal top: Aishani embossed mark |
| Close icon                       |
+----------------------------------+
| Inputs (stacked)                 |
| Slider full width                |
| Term dropdown                    |
+----------------------------------+
| Results card                     |
| Monthly payment highlight        |
| CTA buttons (stacked)            |
+----------------------------------+
| Learn more link                  |
+----------------------------------+
```

### Screen: Admin Dashboard
- **Purpose:** Give administrators a high-level overview of store performance.
- **Layout/Sections:** KPIs, trend charts, alerts, quick actions.
- **Key Functionalities:** Interactive charts, notifications for low-stock, shortcuts to management areas.
- **Navigation:** Side nav to products, orders, users, discounts.

**Desktop Wireframe**
```
+--------------------------------------------------------------------------------+
| Admin Header: Logo, Environment badge, User menu                              |
+----------------------+---------------------------------------------------------+
| Side Nav             | Main Dashboard                                         |
| • Dashboard          | • KPI cards (Revenue, Orders, Conversion, Traffic)     |
| • Products           | • Sales trend chart (line)                             |
| • Orders             | • Low-stock alert list                                 |
| • Users              | • Recent orders table                                  |
| • Discounts          | • Quick actions buttons                                |
+----------------------+---------------------------------------------------------+
```

**Mobile Wireframe**
```
+----------------------------------+
| Top bar: ☰ Admin | Alerts | User |
+----------------------------------+
| KPI cards (scroll)               |
+----------------------------------+
| Charts (stacked)                |
+----------------------------------+
| Alerts list                     |
+----------------------------------+
| Quick actions buttons           |
+----------------------------------+
```

### Screen: Admin Product Management
- **Purpose:** Enable CRUD operations on products with validation and variant handling.
- **Layout/Sections:** Product table, filters, inline actions, detail drawer/form.
- **Key Functionalities:** Bulk edit, status toggles, inventory updates, media gallery management.
- **Navigation:** Links to category management, inventory, add new product.

**Desktop Wireframe**
```
+--------------------------------------------------------------------------------+
| Header: Search products, Add New button                                      |
+----------------------------------+---------------------------------------------+
| Filters panel (collapsible)      | Product Table                              |
| • Category dropdown              | Columns: Name | SKU | Stock | Status | Edit |
| • Status pills                   | Inline actions for Activate, Duplicate      |
| • Vendor filter                  |                                             |
+----------------------------------+---------------------------------------------+
| Slide-over panel (on select): Product form tabs                               |
| • Details | Pricing | Inventory | Media                                        |
+--------------------------------------------------------------------------------+
```

**Mobile Wireframe**
```
+----------------------------------+
| Top bar: Back | Products | +     |
+----------------------------------+
| Filter pill row (scroll)         |
+----------------------------------+
| Product list cards               |
| • Name, SKU, stock badge         |
| • Edit & toggle buttons          |
+----------------------------------+
| Slide-up sheet for product form  |
+----------------------------------+
```

### Screen: Admin Order Management & Fulfillment
- **Purpose:** Allow admins to process, update, and track orders efficiently.
- **Layout/Sections:** Filterable order table, detail drawer with status timeline, fulfillment actions.
- **Key Functionalities:** Update status, trigger emails, print labels, refund initiation.
- **Navigation:** Links to shipping integrations, customer profile.

**Desktop Wireframe**
```
+--------------------------------------------------------------------------------+
| Orders Header: Filters (Status, Date, Channel) | Export | Bulk actions        |
+----------------------------------+---------------------------------------------+
| Order Table                      | Detail Drawer (on row select)               |
| Columns: Order # | Customer | Total | Status | Updated                        |
| Bulk select checkboxes           | • Status timeline                           |
|                                  | • Shipment info & tracking link             |
|                                  | • Items & quantities                        |
|                                  | • Actions: Update status, Refund, Print     |
+----------------------------------+---------------------------------------------+
```

**Mobile Wireframe**
```
+----------------------------------+
| Header: Orders | Filter icon     |
+----------------------------------+
| Order cards with badges          |
| • Order #, customer, total       |
| • Status chip, last update       |
+----------------------------------+
| Expand reveals actions           |
| Buttons: Update, Print, Refund   |
+----------------------------------+
```

### Screen: Admin Analytics & Reports
- **Purpose:** Present actionable insights for performance monitoring.
- **Layout/Sections:** Date selector, KPI tiles, charts, downloadable reports.
- **Key Functionalities:** Toggle metrics, export CSV, drill-down interactions.
- **Navigation:** Link back to dashboard, filters by vendor/category.

**Desktop Wireframe**
```
+--------------------------------------------------------------------------------+
| Analytics Header: Date Range, Compare toggle, Export CSV                      |
+--------------------------------------------------------------------------------+
| KPI Tiles (Revenue, AOV, Conversion, Traffic sources)                         |
+--------------------------------------------------------------------------------+
| Charts grid:                                                                  |
| • Sales vs Targets (line)                                                     |
| • Traffic sources (donut)                                                     |
| • Top categories (bar)                                                        |
+--------------------------------------------------------------------------------+
| Report table with pagination                                                  |
+--------------------------------------------------------------------------------+
```

**Mobile Wireframe**
```
+----------------------------------+
| Header with date picker          |
+----------------------------------+
| KPI tiles (swipe)                |
+----------------------------------+
| Charts stacked (collapsible)     |
+----------------------------------+
| Report list (cards)              |
+----------------------------------+
| Export button                    |
+----------------------------------+
```


