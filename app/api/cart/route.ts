import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'

// Validation schema
const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive().default(1),
})

/**
 * GET /api/cart
 * Get all cart items for authenticated user
 */
export async function GET(request: NextRequest) {
  console.log('[GET /api/cart] Request received')
  
  const authHandler = withAuth(async (req: AuthenticatedRequest) => {
    try {
      const userId = req.user!.userId
      console.log('[GET /api/cart] User authenticated:', userId)

      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              stockQuantity: true,
              images: {
                where: { isPrimary: true },
                take: 1,
                select: {
                  url: true,
                  alt: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      // Calculate totals
      const subtotal = cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      )

      const shipping = subtotal >= 50 ? 0 : 9.99
      const tax = subtotal * 0.08
      const total = subtotal + shipping + tax

      console.log('[GET /api/cart] Found', cartItems.length, 'cart items')
      
      return NextResponse.json({
        success: true,
        items: cartItems.map((item) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          price: Number(item.price),
          product: {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            price: Number(item.product.price),
            stockQuantity: item.product.stockQuantity,
            image: item.product.images[0]?.url || null,
            imageAlt: item.product.images[0]?.alt || null,
          },
        })),
        summary: {
          subtotal,
          shipping,
          tax,
          total,
        },
      })
    } catch (error) {
      console.error('Get cart error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
  
  return authHandler(request)
}

/**
 * POST /api/cart
 * Add item to cart
 */
export async function POST(request: NextRequest) {
  const authHandler = withAuth(async (req: AuthenticatedRequest) => {
    try {
      const userId = req.user!.userId
      const body = await req.json()

      console.log('POST /api/cart - Request body:', body)
      console.log('POST /api/cart - User ID:', userId)

      // Validate input
      const validationResult = addToCartSchema.safeParse(body)
      if (!validationResult.success) {
        console.error('POST /api/cart - Validation failed:', validationResult.error.errors)
        return NextResponse.json(
          { error: 'Validation failed', details: validationResult.error.errors },
          { status: 400 }
        )
      }

      const { productId, quantity } = validationResult.data
      console.log('POST /api/cart - Looking for product:', productId)

      // Verify product exists and is active
      const product = await prisma.product.findUnique({
        where: { id: productId },
      })

      console.log('POST /api/cart - Product found:', product ? { id: product.id, name: product.name, isActive: product.isActive } : 'null')

      if (!product || !product.isActive) {
        console.error('POST /api/cart - Product not found or inactive:', productId)
        return NextResponse.json(
          { error: 'Product not found or inactive' },
          { status: 404 }
        )
      }

      // Check stock availability
      if (product.trackQuantity && product.stockQuantity < quantity) {
        return NextResponse.json(
          { error: 'Insufficient stock' },
          { status: 400 }
        )
      }

      // Check if item already exists in cart
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      })

      let cartItem
      if (existingItem) {
        // Update quantity
        cartItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + quantity,
            price: product.price,
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                stockQuantity: true,
                images: {
                  where: { isPrimary: true },
                  take: 1,
                  select: {
                    url: true,
                    alt: true,
                  },
                },
              },
            },
          },
        })
      } else {
        // Create new cart item
        console.log('POST /api/cart - Creating new cart item:', { userId, productId, quantity, price: product.price })
        cartItem = await prisma.cartItem.create({
          data: {
            userId,
            productId,
            quantity,
            price: product.price,
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                stockQuantity: true,
                images: {
                  where: { isPrimary: true },
                  take: 1,
                  select: {
                    url: true,
                    alt: true,
                  },
                },
              },
            },
          },
        })
      }

      return NextResponse.json({
        success: true,
        item: {
          id: cartItem.id,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          price: Number(cartItem.price),
          product: {
            id: cartItem.product.id,
            name: cartItem.product.name,
            slug: cartItem.product.slug,
            price: Number(cartItem.product.price),
            stockQuantity: cartItem.product.stockQuantity,
            image: cartItem.product.images[0]?.url || null,
            imageAlt: cartItem.product.images[0]?.alt || null,
          },
        },
      }, { status: 201 })
    } catch (error) {
      console.error('❌ Add to cart error:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined,
      })
      return NextResponse.json(
        { 
          error: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  })
  
  return authHandler(request)
}

