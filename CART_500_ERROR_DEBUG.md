# Cart API 500 Error - Debugging Guide

## Current Issue
- **Status Code**: 500 Internal Server Error
- **Error Location**: `POST /api/cart`
- **Client Error**: "Failed to add to cart"

## What I've Added

### 1. Enhanced Server-Side Logging
- Added detailed error logging in `app/api/cart/route.ts`
- Logs request body, user ID, product lookup, and error details
- Error messages now include stack traces

### 2. Enhanced Client-Side Logging
- Added `[addToCart]` prefixed logs in `store/cart.ts`
- Better error message extraction
- Shows validation errors if present

## Debugging Steps

### Step 1: Check Server Terminal
Look at the terminal where `npm run dev` is running. You should see:
- `POST /api/cart - Request body:` - Shows what was received
- `POST /api/cart - User ID:` - Shows authenticated user
- `POST /api/cart - Looking for product:` - Shows productId
- `POST /api/cart - Product found:` - Shows if product exists
- `❌ Add to cart error:` - Shows the actual error

### Step 2: Check Browser Console
Open browser console (F12) and look for:
- `[addToCart] Error response:` - Shows server error details
- `Cart API response status: 500` - Confirms 500 error

### Step 3: Common Issues

#### Issue 1: Database Not Connected
**Symptoms**: Prisma errors in server logs
**Fix**: 
```bash
npm run db:push
# Or check DATABASE_URL in .env.local
```

#### Issue 2: CartItem Table Missing
**Symptoms**: Table doesn't exist error
**Fix**:
```bash
npx prisma db push
# Or
npx prisma migrate dev
```

#### Issue 3: User Not Authenticated
**Symptoms**: 401 error (not 500)
**Fix**: Login first at `/auth/login`

#### Issue 4: Product Not Found
**Symptoms**: "Product not found or inactive" (404, not 500)
**Fix**: Check if product exists in database

#### Issue 5: Prisma Query Error
**Symptoms**: Prisma error in server logs
**Fix**: Check Prisma schema matches database

## Next Steps

1. **Check Server Terminal** - Look for the actual error message
2. **Share Error Logs** - Copy the error from server terminal
3. **Verify Database** - Run `npx prisma studio` to check CartItem table
4. **Check Authentication** - Verify user is logged in

## Quick Fixes to Try

### Fix 1: Regenerate Prisma Client
```bash
npx prisma generate
```

### Fix 2: Push Schema to Database
```bash
npx prisma db push
```

### Fix 3: Check Database Connection
Verify `.env.local` has correct `DATABASE_URL`

### Fix 4: Restart Dev Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

## Expected Server Logs (Success)
```
POST /api/cart - Request body: { productId: '...', quantity: 1 }
POST /api/cart - User ID: clx...
POST /api/cart - Looking for product: cmhq70yn8000bw3848kdeb40g
POST /api/cart - Product found: { id: '...', name: '...', isActive: true }
POST /api/cart - Creating new cart item: { userId: '...', productId: '...', quantity: 1, price: Decimal('34.99') }
```

## Expected Server Logs (Error)
```
❌ Add to cart error: [Actual Error Message]
Error details: {
  message: '[Error message]',
  stack: '[Stack trace]',
  name: '[Error name]'
}
```

## What to Share
When reporting the issue, please share:
1. **Server terminal error** - The full error message
2. **Browser console error** - The `[addToCart] Error response:` log
3. **Network tab** - The Response tab showing the error JSON

This will help identify the exact cause of the 500 error.

