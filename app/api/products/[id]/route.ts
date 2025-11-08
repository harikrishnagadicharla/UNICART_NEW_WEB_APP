import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/products/[id]
 * Get single product by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            url: true,
            alt: true,
            sortOrder: true,
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
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            stockQuantity: true,
            attributes: true,
          },
        },
      },
    })

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const ratings = product.reviews.map((r) => r.rating)
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription,
        brand: product.brand,
        sku: product.sku,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
        costPrice: product.costPrice ? Number(product.costPrice) : null,
        stockQuantity: product.stockQuantity,
        lowStockThreshold: product.lowStockThreshold,
        weight: product.weight ? Number(product.weight) : null,
        dimensions: product.dimensions,
        isFeatured: product.isFeatured,
        isDigital: product.isDigital,
        requiresShipping: product.requiresShipping,
        trackQuantity: product.trackQuantity,
        allowBackorder: product.allowBackorder,
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        tags: product.tags,
        images: product.images,
        category: product.category,
        variants: product.variants.map((v) => ({
          ...v,
          price: v.price ? Number(v.price) : null,
        })),
        reviews: product.reviews,
        rating: Math.round(averageRating * 10) / 10,
        reviewsCount: product.reviews.length,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    })
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

