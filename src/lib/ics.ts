// ICS calendar invite generation utilities
import { createEvent, type EventAttributes } from 'ics'
import { format, parse } from 'date-fns'

export interface BookingEventData {
  name: string
  email: string
  date: string // YYYY-MM-DD format
  time: string // HH:mm format
  duration: number // minutes
  notes?: string
}

/**
 * Generate an ICS calendar event for a booking
 */
export function generateICSEvent(booking: BookingEventData): string | null {
  try {
    // Parse the date and time
    const eventDate = parse(`${booking.date} ${booking.time}`, 'yyyy-MM-dd HH:mm', new Date())
    
    // Calculate end time
    const endDate = new Date(eventDate.getTime() + booking.duration * 60 * 1000)
    
    // Format dates for ICS (year, month, day, hour, minute)
    const startArray: [number, number, number, number, number] = [
      eventDate.getFullYear(),
      eventDate.getMonth() + 1, // ICS months are 1-indexed
      eventDate.getDate(),
      eventDate.getHours(),
      eventDate.getMinutes()
    ]
    
    const endArray: [number, number, number, number, number] = [
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      endDate.getDate(),
      endDate.getHours(),
      endDate.getMinutes()
    ]
    
    const event: EventAttributes = {
      start: startArray,
      end: endArray,
      title: 'Phone Call - QAXP Consultation',
      description: `Phone call with ${booking.name}${booking.notes ? `\n\nNotes: ${booking.notes}` : ''}\n\nThis is a confirmation for your scheduled phone call.`,
      url: window.location.origin, // Link back to your booking platform
      organizer: { name: 'QAXP', email: 'no-reply@qaxp.com' },
      attendees: [
        { name: booking.name, email: booking.email, rsvp: true, partstat: 'NEEDS-ACTION', role: 'REQ-PARTICIPANT' }
      ],
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      productId: 'qaxp-booking-platform'
    }
    
    const { error, value } = createEvent(event)
    
    if (error) {
      console.error('Error creating ICS event:', error)
      return null
    }
    
    return value || null
  } catch (error) {
    console.error('Error generating ICS event:', error)
    return null
  }
}

/**
 * Download an ICS file for a booking
 */
export function downloadICSFile(booking: BookingEventData): void {
  const icsContent = generateICSEvent(booking)
  
  if (!icsContent) {
    console.error('Failed to generate ICS content')
    return
  }
  
  // Create a blob with the ICS content
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  
  // Create a download link
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `qaxp-booking-${booking.date}-${booking.time.replace(':', '')}.ics`
  
  // Trigger the download
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up the object URL
  URL.revokeObjectURL(link.href)
}

/**
 * Generate a calendar URL for popular calendar services
 */
export function generateCalendarUrls(booking: BookingEventData) {
  const eventDate = parse(`${booking.date} ${booking.time}`, 'yyyy-MM-dd HH:mm', new Date())
  const endDate = new Date(eventDate.getTime() + booking.duration * 60 * 1000)
  
  // Format for URL parameters
  const startISO = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const endISO = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  
  const title = encodeURIComponent('Initial Call - QAXP Booking')
  const description = encodeURIComponent(`Meeting with ${booking.name}${booking.notes ? `\n\nNotes: ${booking.notes}` : ''}\n\nThis is a confirmation for your scheduled meeting.`)
  const location = encodeURIComponent('Online Meeting')
  
  return {
    google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startISO}/${endISO}&details=${description}&location=${location}`,
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startISO}&enddt=${endISO}&body=${description}&location=${location}`,
    yahoo: `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${title}&st=${startISO}&et=${endISO}&desc=${description}&in_loc=${location}`
  }
}