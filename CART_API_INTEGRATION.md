# Cart API Integration - Complete ✅

## Changes Made

### 1. Updated `store/cart.ts`
- ✅ **Replaced localStorage with API calls**
- ✅ **Updated CartItem interface** to match API response structure
- ✅ **Changed addToCart signature** to `(productId: string, quantity?: number)`
- ✅ **Added fetchCart function** to fetch cart from API
- ✅ **All cart operations now use API**:
  - `fetchCart()` - GET /api/cart
  - `addToCart()` - POST /api/cart
  - `updateQuantity()` - PUT /api/cart/[productId]
  - `removeFromCart()` - DELETE /api/cart/[productId]
  - `clearCart()` - Removes all items via API
- ✅ **Added loading and error states**

### 2. Updated `components/ProductCard.tsx`
- ✅ **Changed line 29-37**: Now calls `addToCart(productId, 1)` instead of object
- ✅ **Uses originalId** (database ID) if available, otherwise converts numeric ID
- ✅ **Added error handling** with try/catch
- ✅ **Made function async** to handle API call

### 3. Updated `app/cart/page.tsx`
- ✅ **Added fetchCart** to destructured cart store
- ✅ **Added useEffect** to fetch cart on mount: `useEffect(() => { fetchCart() }, [fetchCart])`
- ✅ **Added isLoading** check in loading condition
- ✅ **Updated handleClearCart** to be async and handle errors

### 4. Updated `components/CartItemCard.tsx`
- ✅ **Updated to use new CartItem structure** with nested product
- ✅ **Changed to use productId** instead of numeric id
- ✅ **Updated image source** to use `item.product.image`
- ✅ **Updated product name** to use `item.product.name`
- ✅ **Added stock quantity check** for increase button
- ✅ **Made all handlers async** to handle API calls

### 5. Updated `data/products.ts`
- ✅ **Added originalId field** to Product interface for storing database ID

### 6. Updated Product Mapping
- ✅ **ProductsContent.tsx** - Stores originalId when mapping API products
- ✅ **categories/[slug]/page.tsx** - Stores originalId when mapping API products
- ✅ **FeaturedProducts.tsx** - Updated to fetch from API and store originalId

## API Integration Details

### Cart Store Functions

**fetchCart()**
- Fetches cart items from `/api/cart`
- Requires JWT token in Authorization header
- Maps API response to CartItem[] format

**addToCart(productId: string, quantity: number = 1)**
- Calls `POST /api/cart` with `{ productId, quantity }`
- Refetches cart after successful add
- Handles errors gracefully

**updateQuantity(productId: string, quantity: number)**
- Calls `PUT /api/cart/[productId]` with `{ quantity }`
- Refetches cart after successful update
- Automatically removes item if quantity <= 0

**removeFromCart(productId: string)**
- Calls `DELETE /api/cart/[productId]`
- Refetches cart after successful removal

**clearCart()**
- Removes all items one by one via API
- Refetches cart after clearing

## CartItem Structure

### Old Structure (localStorage)
```typescript
{
  id: number
  name: string
  price: number
  image: string
  quantity: number
  brand?: string
}
```

### New Structure (API)
```typescript
{
  id: string              // Cart item ID
  productId: string       // Product ID from database
  quantity: number
  price: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    stockQuantity: number
    image: string | null
    imageAlt: string | null
  }
}
```

## Product ID Handling

### Problem
- ProductCard receives Product with numeric `id` (for display compatibility)
- API needs actual database product ID (string)
- Solution: Store `originalId` when mapping API products

### Implementation
1. **Product Interface**: Added optional `originalId?: string` field
2. **Product Mapping**: Store `originalId: apiProduct.id` when mapping
3. **ProductCard**: Use `product.originalId || product.id.toString()` for API calls

## Testing

### Test Add to Cart
1. Navigate to products page
2. Click "Add to Cart" on any product
3. **Check Network tab** - Should see:
   - Request to `POST /api/cart`
   - Status: 201 (created)
   - Response with cart item data
4. **Check cart page** - Item should appear in cart
5. **Check browser console** - No "Expected string, received object" errors

### Test Cart Page
1. Navigate to `/cart`
2. **Check Network tab** - Should see:
   - Request to `GET /api/cart` on mount
   - Status: 200 (success)
   - Response with cart items array
3. **Verify items display** - Should show products from database
4. **Test quantity update** - Click +/- buttons
5. **Test remove** - Click remove button

### Test Cart Operations
1. **Update Quantity**: Click +/- buttons
   - Should see `PUT /api/cart/[productId]` request
   - Cart should update immediately
2. **Remove Item**: Click remove button
   - Should see `DELETE /api/cart/[productId]` request
   - Item should disappear from cart
3. **Clear Cart**: Click clear cart button
   - Should remove all items via API
   - Cart should be empty

## Success Indicators

✅ **No "Expected string, received object" errors** - addToCart now uses correct parameters
✅ **Cart fetches on mount** - Check Network tab for GET /api/cart
✅ **Add to cart works** - Check Network tab for POST /api/cart
✅ **Cart items display correctly** - Using new CartItem structure
✅ **Quantity updates work** - PUT requests to API
✅ **Remove works** - DELETE requests to API
✅ **No localStorage usage** - All operations use API
✅ **Proper error handling** - Errors caught and logged

## API Endpoints Used

- `GET /api/cart` - Fetch user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/[productId]` - Update cart item quantity
- `DELETE /api/cart/[productId]` - Remove cart item

All endpoints require JWT token in Authorization header.

