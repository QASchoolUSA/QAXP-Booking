import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createEvent } from 'ics';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Generate ICS content
const generateICSContent = (bookingData) => {
  const startDate = new Date(`${bookingData.date}T${bookingData.time}`);
  const endDate = new Date(startDate.getTime() + bookingData.duration * 60000);
  
  const event = {
    start: [startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate(), startDate.getHours(), startDate.getMinutes()],
    end: [endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate(), endDate.getHours(), endDate.getMinutes()],
    title: `Consultation with ${bookingData.name}`,
    description: `Meeting with ${bookingData.name}\n\nNotes: ${bookingData.notes || 'No additional notes'}\n\nContact: ${bookingData.email}`,
    location: 'Online Meeting',
    url: 'https://qaxp.com',
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
    organizer: { name: 'QAXP', email: 'no-reply@qaxp.com' },
    attendees: [
      { name: bookingData.name, email: bookingData.email, rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' }
    ]
  };
  
  const { error, value } = createEvent(event);
  
  if (error) {
    console.error('Error creating ICS event:', error);
    return null;
  }
  
  return value;
};

// Format date for email display
const formatDate = (date, time) => {
  const dateObj = new Date(`${date}T${time}`);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
};

// Customer confirmation email template
const generateCustomerEmailHTML = (bookingData) => {
  const formattedDate = formatDate(bookingData.date, bookingData.time);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Booking Confirmation - QAXP</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #555; }
            .value { color: #333; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
            .btn { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Booking Confirmed!</h1>
                <p>Thank you for scheduling your consultation</p>
            </div>
            
            <div class="content">
                <p>Dear ${bookingData.name},</p>
                
                <p>Your consultation has been successfully booked. Here are the details:</p>
                
                <div class="booking-details">
                    <div class="detail-row">
                        <span class="label">Date & Time:</span>
                        <span class="value">${formattedDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Duration:</span>
                        <span class="value">${bookingData.duration} minutes</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Contact Email:</span>
                        <span class="value">${bookingData.email}</span>
                    </div>
                    ${bookingData.notes ? `
                    <div class="detail-row">
                        <span class="label">Notes:</span>
                        <span class="value">${bookingData.notes}</span>
                    </div>
                    ` : ''}
                </div>
                
                <p>A calendar invite has been attached to this email. Please add it to your calendar to receive reminders.</p>
                
                <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
                
                <p>Looking forward to our meeting!</p>
                
                <p>Best regards,<br><strong>QAXP Team</strong></p>
            </div>
            
            <div class="footer">
                <p>This email was sent from the QAXP booking system.</p>
                <p>If you have any questions, please contact us at <a href="mailto:nikita@kedrov.com">nikita@kedrov.com</a></p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Admin notification email template
const generateAdminEmailHTML = (bookingData) => {
  const formattedDate = formatDate(bookingData.date, bookingData.time);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>New Booking Alert - QAXP Admin</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .alert-badge { background: #ff4757; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 10px; display: inline-block; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .customer-info { background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
            .booking-details { background: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; color: #555; }
            .value { color: #333; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666; }
            .priority { color: #dc3545; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="alert-badge">NEW BOOKING</div>
                <h1>Booking Alert</h1>
                <p>A new consultation has been scheduled</p>
            </div>
            
            <div class="content">
                <p class="priority">⚠️ Action Required: New booking received</p>
                
                <div class="customer-info">
                    <h3>Customer Information</h3>
                    <div class="detail-row">
                        <span class="label">Name:</span>
                        <span class="value">${bookingData.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Email:</span>
                        <span class="value">${bookingData.email}</span>
                    </div>
                </div>
                
                <div class="booking-details">
                    <h3>Booking Details</h3>
                    <div class="detail-row">
                        <span class="label">Date & Time:</span>
                        <span class="value">${formattedDate}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Duration:</span>
                        <span class="value">${bookingData.duration} minutes</span>
                    </div>
                    ${bookingData.notes ? `
                    <div class="detail-row">
                        <span class="label">Notes:</span>
                        <span class="value">${bookingData.notes}</span>
                    </div>
                    ` : ''}
                </div>
                
                <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
                    <h4 style="margin: 0 0 10px 0; color: #155724;">Next Steps:</h4>
                    <ul style="margin: 0; padding-left: 20px; color: #155724;">
                        <li>Add the attached calendar invite to your calendar</li>
                        <li>Prepare any necessary materials for the consultation</li>
                        <li>The customer has been automatically sent a confirmation email</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <p>This notification was sent from the QAXP booking system.</p>
                <p>© 2024 QAXP. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Send booking emails endpoint
app.post('/api/send-booking-emails', async (req, res) => {
  try {
    const { bookingData } = req.body;
    
    if (!bookingData || !bookingData.name || !bookingData.email || !bookingData.date || !bookingData.time) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required booking data' 
      });
    }
    
    const transporter = createTransporter();
    const icsContent = generateICSContent(bookingData);
    
    if (!icsContent) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to generate calendar invite' 
      });
    }
    
    // Prepare ICS attachment
    const icsAttachment = {
      filename: `booking-${bookingData.date}-${bookingData.time.replace(':', '')}.ics`,
      content: icsContent,
      contentType: 'text/calendar'
    };
    
    // Customer confirmation email
    const customerMailOptions = {
      from: {
        name: 'QAXP',
        address: 'no-reply@qaxp.com'
      },
      to: bookingData.email,
      subject: `Booking Confirmation - ${formatDate(bookingData.date, bookingData.time)}`,
      html: generateCustomerEmailHTML(bookingData),
      attachments: [icsAttachment]
    };
    
    // Admin notification email
    const adminMailOptions = {
      from: {
        name: 'QAXP Booking System',
        address: 'no-reply@qaxp.com'
      },
      to: 'nikita@kedrov.com',
      subject: `🔔 New Booking: ${bookingData.name} - ${formatDate(bookingData.date, bookingData.time)}`,
      html: generateAdminEmailHTML(bookingData),
      attachments: [icsAttachment]
    };
    
    // Send both emails concurrently
    const [customerResult, adminResult] = await Promise.allSettled([
      transporter.sendMail(customerMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);
    
    const results = {
      customer: {
        success: customerResult.status === 'fulfilled',
        message: customerResult.status === 'fulfilled' ? 'Customer email sent successfully' : customerResult.reason?.message || 'Failed to send customer email'
      },
      admin: {
        success: adminResult.status === 'fulfilled',
        message: adminResult.status === 'fulfilled' ? 'Admin email sent successfully' : adminResult.reason?.message || 'Failed to send admin email'
      }
    };
    
    console.log('Email sending results:', results);
    
    // Return success if at least one email was sent
    const overallSuccess = results.customer.success || results.admin.success;
    
    res.json({
      success: overallSuccess,
      message: overallSuccess ? 'Emails processed' : 'Failed to send emails',
      results
    });
    
  } catch (error) {
    console.error('Error sending booking emails:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Email service is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Email service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});