import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

// Validation schema
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request: NextRequest) {
  console.log('API CALLED - Register endpoint hit')
  try {
    const body = await request.json()
    console.log('Register request body:', { email: body.email })
    
    // Validate input
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      console.log('Validation failed:', validationResult.error.errors)
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { email, password, firstName, lastName } = validationResult.data
    console.log('Checking if user exists:', email.toLowerCase())

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      console.log('User already exists')
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    console.log('User does not exist, creating new user')

    // Hash password
    const hashedPassword = await hashPassword(password)
    console.log('Password hashed')

    // Create new user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        role: 'CUSTOMER',
      },
    })

    console.log('User created:', user.id)

    // Generate token
    const token = generateToken(user.id, user.email, user.role)
    console.log('Token generated, returning success response')

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
    }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

