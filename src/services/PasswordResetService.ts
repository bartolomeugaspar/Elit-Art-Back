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
        return
      }

      // Generate reset token
      const resetToken = this.generateResetToken()
      const resetTokenExpires = new Date(Date.now() + 86400000) // 24 hours from now
      

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

      // Send reset email and WhatsApp
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
      await EmailService.sendPasswordResetEmail(email, user.name, resetToken, resetLink)
      
      // Send WhatsApp notification
      const { WhatsAppService } = await import('./WhatsAppService')
      await WhatsAppService.sendPasswordResetMessage(email, user.name, resetLink)
        .catch(err => console.error('Error sending reset WhatsApp:', err))

    } catch (error) {
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

    } catch (error) {
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
        return false
      }


      // Check if token matches and hasn't expired
      if (!user.reset_token) {
        return false
      }

      if (user.reset_token !== token) {
        return false
      }

      if (!user.reset_token_expires) {
        return false
      }

      const expiresAt = new Date(user.reset_token_expires)
      const now = new Date()
      
      if (expiresAt < now) {
        return false
      }

      return true
    } catch (error) {
      return false
    }
  }
}
