// JWT Service Implementation

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { JWTPayload } from '@/types/api'
import { AuthenticationError } from '@/core/errors'

export interface TokenPayload {
  userId: string
  email: string
}

/**
 * JWT Service
 * Handles JWT token generation, verification, and password hashing
 */
export class JWTService {
  private secret: string
  private expiresIn: string

  constructor(secret: string, expiresIn: string = '1h') {
    if (!secret || secret.length < 32) {
      throw new Error('JWT secret must be at least 32 characters long')
    }

    this.secret = secret
    this.expiresIn = expiresIn
  }

  /**
   * Generate JWT access token
   * @param payload - Token payload
   * @returns JWT token string
   */
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    })
  }

  /**
   * Verify and decode JWT token
   * @param token - JWT token string
   * @returns Decoded token payload
   * @throws {AuthenticationError} If token is invalid or expired
   */
  verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as JWTPayload
      return decoded
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid token'
      throw new AuthenticationError(`Token verification failed: ${errorMessage}`)
    }
  }

  /**
   * Hash password using bcrypt
   * @param password - Plain text password
   * @returns Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
  }

  /**
   * Verify password against hash
   * @param plainPassword - Plain text password
   * @param hashedPassword - Hashed password
   * @returns True if password matches
   */
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword)
  }
}

