import nodemailer from 'nodemailer'

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

/**
 * Send email using Nodemailer
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param html - HTML email content
 * @param text - Plain text email content (optional)
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@unicart.com',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
    })
  } catch (error) {
    console.error('Email sending error:', error)
    throw new Error('Failed to send email')
  }
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Welcome to UniCart!</h1>
      <p>Hi ${name},</p>
      <p>Thank you for registering with UniCart. We're excited to have you on board!</p>
      <p>Start shopping now and discover amazing products.</p>
      <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/products" 
         style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
        Browse Products
      </a>
    </div>
  `
  await sendEmail(email, 'Welcome to UniCart!', html)
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(
  email: string,
  orderNumber: string,
  total: number
): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Order Confirmed!</h1>
      <p>Thank you for your order!</p>
      <p><strong>Order Number:</strong> ${orderNumber}</p>
      <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      <p>We'll send you a shipping confirmation email once your order ships.</p>
      <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/orders" 
         style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
        View Order
      </a>
    </div>
  `
  await sendEmail(email, `Order Confirmation - ${orderNumber}`, html)
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string
): Promise<void> {
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Password Reset Request</h1>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <a href="${resetUrl}" 
         style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">
        Reset Password
      </a>
      <p style="margin-top: 20px; color: #666; font-size: 12px;">
        If you didn't request this, please ignore this email.
      </p>
    </div>
  `
  await sendEmail(email, 'Password Reset Request', html)
}

