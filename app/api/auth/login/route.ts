import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword, generateToken } from '@/lib/auth'

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
export async function POST(request: NextRequest) {
  console.log('API CALLED - Login endpoint hit')
  console.log('API CALLED') // Line 13 as requested
  try {
    const body = await request.json()
    console.log('Login request body:', { email: body.email })
    
    // Validate input
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      console.log('Validation failed:', validationResult.error.errors)
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { email, password } = validationResult.data
    console.log('Looking up user:', email.toLowerCase())

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      console.log('User not found')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('User found, verifying password')

    // Check if user is active
    if (!user.isActive) {
      console.log('User account is inactive')
      return NextResponse.json(
        { error: 'Account is inactive' },
        { status: 403 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      console.log('Password verification failed')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('Password verified, generating token')

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    // Generate token
    const token = generateToken(user.id, user.email, user.role)
    console.log('Token generated, returning success response')

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

