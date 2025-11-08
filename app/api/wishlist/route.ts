import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'

// Validation schema
const addToWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
})

/**
 * GET /api/wishlist
 * Get all wishlist items for authenticated user
 */
export async function GET(request: NextRequest) {
  const authHandler = withAuth(async (req: AuthenticatedRequest) => {
    try {
      const userId = req.user!.userId

      const wishlistItems = await prisma.wishlistItem.findMany({
        where: { userId },
        include: {
          product: {
            include: {
              images: {
                orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
                take: 1,
                select: {
                  url: true,
                  alt: true,
                  isPrimary: true,
                },
              },
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
              reviews: {
                select: {
                  rating: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      // Calculate average rating for each product
      const itemsWithRating = wishlistItems.map((item) => {
        const ratings = item.product.reviews.map((r) => r.rating)
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
            : 0

        return {
          id: item.id,
          productId: item.productId,
          createdAt: item.createdAt,
          product: {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            description: item.product.description,
            shortDescription: item.product.shortDescription,
            brand: item.product.brand,
            price: Number(item.product.price),
            comparePrice: item.product.comparePrice
              ? Number(item.product.comparePrice)
              : null,
            stockQuantity: item.product.stockQuantity,
            isFeatured: item.product.isFeatured,
            image: item.product.images[0]?.url || null,
            imageAlt: item.product.images[0]?.alt || null,
            category: item.product.category,
            rating: Math.round(averageRating * 10) / 10,
            reviewsCount: item.product.reviews.length,
          },
        }
      })

      return NextResponse.json({
        success: true,
        items: itemsWithRating,
      })
    } catch (error) {
      console.error('Get wishlist error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
  
  return authHandler(request)
}

/**
 * POST /api/wishlist
 * Add item to wishlist
 */
export async function POST(request: NextRequest) {
  const authHandler = withAuth(async (req: AuthenticatedRequest) => {
    try {
      const userId = req.user!.userId
      const body = await req.json()

      // Validate input
      const validationResult = addToWishlistSchema.safeParse(body)
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: validationResult.error.errors },
          { status: 400 }
        )
      }

      const { productId } = validationResult.data

      // Verify product exists and is active
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
            select: {
              url: true,
              alt: true,
            },
          },
        },
      })

      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: 'Product not found or inactive' },
          { status: 404 }
        )
      }

      // Check if product already in wishlist
      const existingItem = await prisma.wishlistItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      })

      if (existingItem) {
        return NextResponse.json(
          { error: 'Product already in wishlist' },
          { status: 409 }
        )
      }

      // Create wishlist item
      const wishlistItem = await prisma.wishlistItem.create({
        data: {
          userId,
          productId,
        },
        include: {
          product: {
            include: {
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

      return NextResponse.json({
        success: true,
        item: {
          id: wishlistItem.id,
          productId: wishlistItem.productId,
          createdAt: wishlistItem.createdAt,
          product: {
            id: wishlistItem.product.id,
            name: wishlistItem.product.name,
            slug: wishlistItem.product.slug,
            price: Number(wishlistItem.product.price),
            image: wishlistItem.product.images[0]?.url || null,
            imageAlt: wishlistItem.product.images[0]?.alt || null,
          },
        },
      }, { status: 201 })
    } catch (error) {
      console.error('Add to wishlist error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
  
  return authHandler(request)
}

