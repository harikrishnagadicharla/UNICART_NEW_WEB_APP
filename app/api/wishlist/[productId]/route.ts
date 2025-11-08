import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, AuthenticatedRequest } from '@/lib/middleware'

/**
 * DELETE /api/wishlist/[productId]
 * Remove wishlist item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const authHandler = withAuth(async (req: AuthenticatedRequest) => {
    try {
      const userId = req.user!.userId
      const { productId } = params

      // Verify wishlist item exists for current user
      const wishlistItem = await prisma.wishlistItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      })

      if (!wishlistItem) {
        return NextResponse.json(
          { error: 'Wishlist item not found' },
          { status: 404 }
        )
      }

      // Delete wishlist item
      await prisma.wishlistItem.delete({
        where: { id: wishlistItem.id },
      })

      return NextResponse.json({
        success: true,
        message: 'Wishlist item removed successfully',
      })
    } catch (error) {
      console.error('Delete wishlist error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  })
  
  return authHandler(request)
}

