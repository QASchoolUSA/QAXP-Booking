// Booking management utilities for localStorage persistence

export interface Booking {
  id: string;
  name: string;
  email: string;
  notes?: string;
  date: string; // ISO date string
  time: string; // HH:mm format
  duration: number; // minutes
  createdAt: string; // ISO timestamp
}

const BOOKINGS_KEY = 'qaxp-bookings';

/**
 * Get all bookings from localStorage
 */
export function getBookings(): Booking[] {
  try {
    const stored = localStorage.getItem(BOOKINGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load bookings:', error);
    return [];
  }
}

/**
 * Add a new booking to localStorage
 */
export function addBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Booking {
  const newBooking: Booking = {
    ...booking,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  try {
    const bookings = getBookings();
    bookings.push(newBooking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    return newBooking;
  } catch (error) {
    console.error('Failed to save booking:', error);
    throw new Error('Failed to save booking');
  }
}

/**
 * Check if a time slot overlaps with existing bookings
 */
export function isOverlapping(date: string, time: string, duration: number): boolean {
  const bookings = getBookings();
  const requestedStart = new Date(`${date}T${time}`);
  const requestedEnd = new Date(requestedStart.getTime() + duration * 60 * 1000);

  return bookings.some(booking => {
    if (booking.date !== date) return false;
    
    const bookingStart = new Date(`${booking.date}T${booking.time}`);
    const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60 * 1000);
    
    // Check for overlap: requested start < booking end AND requested end > booking start
    return requestedStart < bookingEnd && requestedEnd > bookingStart;
  });
}

/**
 * Get all booked time slots for a specific date
 */
export function getBookedSlots(date: string): Array<{ time: string; duration: number }> {
  const bookings = getBookings();
  return bookings
    .filter(booking => booking.date === date)
    .map(booking => ({ time: booking.time, duration: booking.duration }));
}