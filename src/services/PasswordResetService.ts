import { supabase } from '../config/database'
import { EmailService } from './EmailService'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

export class PasswordResetService {
  static generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  static async requestPasswordReset(email: string): Promise<void> {
    try {
      // Find user by email
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('email', email)
        .single()

      if (userError || !user) {
        // Don't reveal if email exists for security reasons
        console.log(`Password reset requested for non-existent email: ${email}`)
        return
      }

      // Generate reset token
      const resetToken = this.generateResetToken()
      const resetTokenExpires = new Date(Date.now() + 86400000) // 24 hours from now
      
      console.log(`📝 Generating reset token for ${email}:`)
      console.log(`   Token: ${resetToken.substring(0, 10)}...`)
      console.log(`   Expires at: ${resetTokenExpires.toISOString()}`)

      // Store reset token in database
      const { error: updateError } = await supabase
        .from('users')
        .update({
          reset_token: resetToken,
          reset_token_expires: resetTokenExpires.toISOString(),
        })
        .eq('id', user.id)

      if (updateError) {
        throw new Error('Failed to store reset token')
      }

      // Send reset email
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
      await EmailService.sendPasswordResetEmail(email, user.name, resetToken, resetLink)

      console.log(`✅ Password reset email sent to ${email}`)
      console.log(`📧 Reset link: ${resetLink}`)
    } catch (error) {
      console.error('❌ Error requesting password reset:', error)
      throw new Error('Failed to process password reset request')
    }
  }

  static async resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): Promise<void> {
    try {
      // Find user by email and valid token
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, reset_token, reset_token_expires')
        .eq('email', email)
        .single()

      if (userError || !user) {
        throw new Error('User not found')
      }

      // Verify token
      if (user.reset_token !== token) {
        throw new Error('Invalid reset token')
      }

      // Check if token has expired
      if (!user.reset_token_expires || new Date(user.reset_token_expires) < new Date()) {
        throw new Error('Reset token has expired')
      }

      // Hash new password
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      // Update password and clear reset token
      const { error: updateError } = await supabase
        .from('users')
        .update({
          password: hashedPassword,
          reset_token: null,
          reset_token_expires: null,
        })
        .eq('id', user.id)

      if (updateError) {
        throw new Error('Failed to update password')
      }

      console.log(`✅ Password reset successfully for ${email}`)
    } catch (error) {
      console.error('❌ Error resetting password:', error)
      throw error
    }
  }

  static async validateResetToken(email: string, token: string): Promise<boolean> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('reset_token, reset_token_expires')
        .eq('email', email)
        .single()

      if (error || !user) {
        console.log(`❌ User not found for email: ${email}`)
        return false
      }

      console.log(`🔍 Token validation for ${email}:`)
      console.log(`   Stored token: ${user.reset_token?.substring(0, 10)}...`)
      console.log(`   Provided token: ${token.substring(0, 10)}...`)
      console.log(`   Token expires: ${user.reset_token_expires}`)
      console.log(`   Current time: ${new Date().toISOString()}`)

      // Check if token matches and hasn't expired
      if (!user.reset_token) {
        console.log(`❌ No reset token stored for this user`)
        return false
      }

      if (user.reset_token !== token) {
        console.log(`❌ Token mismatch`)
        return false
      }

      if (!user.reset_token_expires) {
        console.log(`❌ No expiration date set`)
        return false
      }

      const expiresAt = new Date(user.reset_token_expires)
      const now = new Date()
      
      if (expiresAt < now) {
        console.log(`❌ Token expired. Expires at: ${expiresAt.toISOString()}, Now: ${now.toISOString()}`)
        return false
      }

      console.log(`✅ Token is valid`)
      return true
    } catch (error) {
      console.error('❌ Error validating reset token:', error)
      return false
    }
  }
}
