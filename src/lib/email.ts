// Email notification service using Nodemailer backend API
import { type BookingEventData } from './ics'

export interface EmailNotificationData {
  booking: BookingEventData
  recipientEmail: string
  recipientName: string
}

export interface AdminNotificationData {
  booking: BookingEventData
  customerEmail: string
  customerName: string
}

export interface EmailResult {
  success: boolean
  message: string
  error?: string
}

// API base URL - adjust for production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/**
 * Send booking confirmation email to customer and notification email to admin
 * Uses the Nodemailer backend API for reliable email delivery
 */
export async function sendBookingEmails(
  bookingData: BookingEventData
): Promise<{ customer: EmailResult; admin: EmailResult }> {
  try {
    console.log('Sending booking emails via Nodemailer API...', {
      customer: bookingData.email,
      admin: 'nikita@kedrov.com',
      date: bookingData.date,
      time: bookingData.time
    })

    const response = await fetch(`${API_BASE_URL}/api/send-booking-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingData
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }))
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }

    const result = await response.json()
    
    console.log('Email API response:', result)

    return {
      customer: {
        success: result.results?.customer?.success || false,
        message: result.results?.customer?.message || 'Unknown customer email status'
      },
      admin: {
        success: result.results?.admin?.success || false,
        message: result.results?.admin?.message || 'Unknown admin email status'
      }
    }

  } catch (error) {
    console.error('Error sending booking emails:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return {
      customer: {
        success: false,
        message: 'Failed to send customer email',
        error: errorMessage
      },
      admin: {
        success: false,
        message: 'Failed to send admin email', 
        error: errorMessage
      }
    }
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use sendBookingEmails instead
 */
export async function sendBookingConfirmationEmail(
  emailData: EmailNotificationData
): Promise<EmailResult> {
  console.warn('sendBookingConfirmationEmail is deprecated. Use sendBookingEmails instead.')
  
  const result = await sendBookingEmails(emailData.booking)
  return result.customer
}

/**
 * Legacy function for backward compatibility  
 * @deprecated Use sendBookingEmails instead
 */
export async function sendAdminNotificationEmail(
  emailData: AdminNotificationData
): Promise<EmailResult> {
  console.warn('sendAdminNotificationEmail is deprecated. Use sendBookingEmails instead.')
  
  const result = await sendBookingEmails(emailData.booking)
  return result.admin
}

/**
 * Check if the email service is available
 */
export async function checkEmailServiceHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`)
    return response.ok
  } catch (error) {
    console.error('Email service health check failed:', error)
    return false
  }
}