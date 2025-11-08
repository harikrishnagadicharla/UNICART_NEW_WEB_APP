import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { extractToken, verifyToken } from '@/lib/auth'

/**
 * Extended request interface with user information
 */
export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string
    email: string
    role: string
  }
}

/**
 * Middleware to protect routes requiring authentication
 * Adds user information to request if token is valid
 */
export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const token = extractToken(req)
      
      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      const decoded = verifyToken(token)
      
      if (!decoded) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      }

      // Verify user exists and is active
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true, isActive: true },
      })

      if (!user || !user.isActive) {
        return NextResponse.json(
          { error: 'User not found or inactive' },
          { status: 401 }
        )
      }

      // Add user to request
      const authenticatedReq = req as AuthenticatedRequest
      authenticatedReq.user = {
        userId: user.id,
        email: user.email,
        role: user.role,
      }

      return handler(authenticatedReq)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }
  }
}

/**
 * Middleware to protect admin-only routes
 * Requires authentication AND admin role
 */
export function withAdminAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const token = extractToken(req)
      
      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      const decoded = verifyToken(token)
      
      if (!decoded) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      }

      // Verify user exists, is active, and is admin
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true, isActive: true },
      })

      if (!user || !user.isActive) {
        return NextResponse.json(
          { error: 'User not found or inactive' },
          { status: 401 }
        )
      }

      if (user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }

      // Add user to request
      const authenticatedReq = req as AuthenticatedRequest
      authenticatedReq.user = {
        userId: user.id,
        email: user.email,
        role: user.role,
      }

      return handler(authenticatedReq)
    } catch (error) {
      console.error('Admin auth middleware error:', error)
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }
  }
}

