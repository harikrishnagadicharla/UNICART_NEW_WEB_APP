import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

const SALT_ROUNDS = 12
const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d'

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verify a password against a hash
 * @param password - Plain text password
 * @param hash - Hashed password
 * @returns True if password matches
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate a JWT token for a user
 * @param userId - User ID
 * @param email - User email
 * @param role - User role
 * @returns JWT token string
 */
export function generateToken(userId: string, email: string, role: string): string {
  if (!JWT_SECRET || JWT_SECRET === 'your-secret-key-change-in-production') {
    throw new Error('JWT_SECRET must be set in environment variables')
  }
  
  // @ts-ignore - jsonwebtoken types issue with expiresIn
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token string
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string }
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Extract token from Authorization header
 * @param request - Next.js request object
 * @returns Token string or null
 */
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}
