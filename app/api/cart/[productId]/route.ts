import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'

// Validation schema
const updateCartSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
})

/**
 * PUT /api/cart/[productId]
 * Update cart item quantity
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  return withAuth(async (req: AuthenticatedRequest) => {
    try {
      const userId = req.user!.userId
      const { productId } = params
      const body = await request.json()

      // Validate input
      const validationResult = updateCartSchema.safeParse(body)
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: validationResult.error.errors },
          { status: 400 }
        )
      }

      const { quantity } = validationResult.data

      // Verify cart item exists for current user
      const cartItem = await prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      })

      if (!cartItem) {
        return NextResponse.json(
          { error: 'Cart item not found' },
          { status: 404 }
        )
      }

      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity },
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

      return NextResponse.json({
        success: true,
        item: {
          id: updatedItem.id,
          productId: updatedItem.productId,
          quantity: updatedItem.quantity,
          price: Number(updatedItem.price),
          product: {
            id: updatedItem.product.id,
            name: updatedItem.product.name,
            slug: updatedItem.product.slug,
            price: Number(updatedItem.product.price),
            stockQuantity: updatedItem.product.stockQuantity,
            image: updatedItem.product.images[0]?.url || null,
            imageAlt: updatedItem.product.images[0]?.alt || null,
          },
        },
      })
    } catch (error) {
      console.error('Update cart error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })(request)
}

/**
 * DELETE /api/cart/[productId]
 * Remove cart item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  return withAuth(async (req: AuthenticatedRequest) => {
    try {
      const userId = req.user!.userId
      const { productId } = params

      // Verify cart item exists for current user
      const cartItem = await prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      })

      if (!cartItem) {
        return NextResponse.json(
          { error: 'Cart item not found' },
          { status: 404 }
        )
      }

      // Delete cart item
      await prisma.cartItem.delete({
        where: { id: cartItem.id },
      })

      return NextResponse.json({
        success: true,
        message: 'Cart item removed successfully',
      })
    } catch (error) {
      console.error('Delete cart error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })(request)
}

