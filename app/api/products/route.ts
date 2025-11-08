import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/products
 * Get all products with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      isActive: true,
    }

    if (featured) {
      where.isFeatured = true
    }

    if (category) {
      where.category = {
        slug: category,
        isActive: true,
      }
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
            select: {
              url: true,
              alt: true,
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    // Calculate average rating for each product
    const productsWithRating = products.map((product) => {
      const ratings = product.reviews.map((r) => r.rating)
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : 0

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        brand: product.brand,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
        stockQuantity: product.stockQuantity,
        isFeatured: product.isFeatured,
        image: product.images[0]?.url || null,
        imageAlt: product.images[0]?.alt || null,
        category: product.category,
        rating: Math.round(averageRating * 10) / 10,
        reviewsCount: product.reviews.length,
      }
    })

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      products: productsWithRating,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
      },
    })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

