# Backend Setup Instructions

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Neon recommended)
- npm or yarn package manager

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- Prisma ORM
- JWT authentication libraries
- Zod validation
- Nodemailer for emails
- And all other dependencies

### 2. Set Up Environment Variables

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your actual values:

- **DATABASE_URL**: Your Neon PostgreSQL connection string
- **JWT_SECRET**: Generate a strong secret (use: `openssl rand -base64 32`)
- **EMAIL_***: Your email service credentials
- **ADMIN_EMAIL** and **ADMIN_PASSWORD**: Admin user credentials for seeding

### 3. Generate Prisma Client

```bash
npm run db:generate
```

This creates the Prisma Client based on your schema.

### 4. Push Schema to Database

```bash
npm run db:push
```

This creates all tables in your PostgreSQL database based on the Prisma schema.

**Alternative: Use Migrations (Recommended for Production)**

```bash
npm run db:migrate
```

This creates a migration file and applies it to your database.

### 5. Seed the Database

```bash
npm run db:seed
```

This will:
- Create an admin user
- Create 6 categories (Electronics, Fashion, Home & Garden, Sports, Books, Beauty)
- Create 3 sample products with images

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 7. Verify Setup

#### Check Database with Prisma Studio

```bash
npm run db:studio
```

This opens a visual database browser at `http://localhost:5555`

#### Test API Endpoints

- **Login**: `POST /api/auth/login`
  ```json
  {
    "email": "admin@example.com",
    "password": "Admin@123"
  }
  ```

- **Register**: `POST /api/auth/register`
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```

- **Get Products**: `GET /api/products`
- **Get Categories**: `GET /api/categories`
- **Get Cart** (requires auth): `GET /api/cart`
- **Get Wishlist** (requires auth): `GET /api/wishlist`

## Database Schema Overview

The schema includes the following models:

- **User**: Authentication and user management
- **Category**: Product categories with hierarchy support
- **Product**: Product catalog with variants and images
- **ProductImage**: Product image management
- **ProductVariant**: Product variants (size, color, etc.)
- **CartItem**: Shopping cart items
- **WishlistItem**: User wishlists
- **Address**: Shipping and billing addresses
- **Order**: Order management
- **OrderItem**: Order line items
- **Review**: Product reviews and ratings

## API Routes

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/[id]` - Get single product

### Categories
- `GET /api/categories` - List all categories

### Cart (Protected)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[productId]` - Update cart item quantity
- `DELETE /api/cart/[productId]` - Remove cart item

### Wishlist (Protected)
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/[productId]` - Remove wishlist item

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are obtained from the login or register endpoints.

## Troubleshooting

### Database Connection Issues
- Verify your DATABASE_URL is correct
- Check if your database is accessible
- Ensure SSL mode is set correctly for Neon

### Prisma Client Generation Errors
- Run `npm run db:generate` again
- Check if schema.prisma has syntax errors
- Ensure Prisma is installed: `npm install prisma @prisma/client`

### Migration Issues
- Use `db:push` for development (resets schema)
- Use `db:migrate` for production (preserves data)

### Type Errors
- Run `npm run type-check` to check TypeScript errors
- Ensure all dependencies are installed
- Check if Prisma Client is generated

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use `db:migrate:deploy` instead of `db:push`
3. Ensure all environment variables are set securely
4. Use a strong JWT_SECRET (generate with: `openssl rand -base64 32`)
5. Configure proper CORS settings if needed
6. Set up proper email service credentials

## Next Steps

After setup, you can:
1. Update frontend stores to use API endpoints instead of localStorage
2. Implement order creation endpoints
3. Add payment processing integration
4. Set up email notifications
5. Add admin panel functionality

