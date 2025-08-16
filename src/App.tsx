import { useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { addDays, addMinutes, format, isSameDay, setHours, setMinutes } from 'date-fns'
import { addBooking, isOverlapping } from './lib/bookings'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh bg-gray-50 text-gray-900">
        <SiteHeader />
        <main className="mx-auto max-w-5xl px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<Book />} />
            <Route path="/confirm" element={<Confirm />} />
            <Route path="/success" element={<BookingSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <SiteFooter />
      </div>
    </BrowserRouter>
  )
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8" style={{imageRendering: 'crisp-edges', shapeRendering: 'crispEdges'}} />
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/" end className={({isActive}) => isActive ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-gray-900'}>Home</NavLink>
          <NavLink to="/book" className={({isActive}) => isActive ? 'text-primary-600 font-medium' : 'text-gray-600 hover:text-gray-900'}>Book</NavLink>
          <a href="#" className="btn-primary ml-2">Get Started</a>
        </nav>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white/60">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-gray-500 flex items-center justify-between">
        <p>© {new Date().getFullYear()} QAXP. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-700">Privacy</a>
          <a href="#" className="hover:text-gray-700">Terms</a>
        </div>
      </div>
    </footer>
  )
}

function Home() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section with Profile */}
      <section className="text-center space-y-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
             <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 transform transition-transform duration-300 hover:scale-105" style={{
               background: 'linear-gradient(180deg, #0057B7 0%, #0057B7 50%, #FFD700 50%, #FFD700 100%)',
               boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)'
             }}>
               <img 
                 src="/profile-pic.webp" 
                 alt="Nikita Bogdanov - Profile Picture" 
                 className="w-full h-full rounded-full object-cover"
                 style={{
                   boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                 }}
               />
             </div>
            <div 
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.1) 100%)'
              }}
            />
          </div>
          
          {/* Stand with Ukraine Message */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-4 rounded-sm overflow-hidden shadow-sm">
              <div className="w-full h-1/2 bg-blue-500"></div>
              <div className="w-full h-1/2 bg-yellow-400"></div>
            </div>
            <span className="text-sm font-medium text-gray-700">Stand with Ukraine</span>
            <div className="w-6 h-4 rounded-sm overflow-hidden shadow-sm">
              <div className="w-full h-1/2 bg-blue-500"></div>
              <div className="w-full h-1/2 bg-yellow-400"></div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Nikita Bogdanov</h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">Software Developer & Marketing/SEO Expert</p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">Passionate about creating exceptional digital experiences through modern web technologies and strategic marketing. I help businesses establish their online presence with powerful websites and effective SEO strategies.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/book" className="btn-primary px-8 py-3 text-lg">Book a Consultation</Link>
          <a href="#projects" className="btn-secondary px-8 py-3 text-lg">View My Work</a>
        </div>
      </section>

      {/* Recent Projects Section */}
      <section id="projects" className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Recent Projects</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">A showcase of my latest work and technical achievements</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard 
            title="Sanford Cleaning"
            description="Developed a professional website for a cleaning company based in Sanford, FL, featuring service showcases and online booking capabilities."
            technologies={["React", "Next.js", "Tailwind CSS", "SEO"]}
            demoLink="https://sanfordcleaning.com"
            repoLink="#"
          />
          <ProjectCard 
            title="Palace Pizza Bartow"
            description="Created an engaging website for an Italian restaurant located in Bartow, FL, with menu displays and online ordering integration."
            technologies={["React", "Next.js", "JavaScript", "Responsive Design"]}
            demoLink="https://palacepizzabartow.com"
            repoLink="#"
          />
          <ProjectCard 
            title="DOTSemi"
            description="Designed a comprehensive website for an annual DOT inspections and semi-truck/trailer repair shop with service information and contact forms."
            technologies={["React", "Next.js", "CSS3", "Local SEO"]}
            demoLink="https://dotsemi.com"
            repoLink="#"
          />
        </div>
      </section>

      {/* Skills Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Technical Skills</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Technologies and tools I work with</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Web Development</h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">React</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Next.js</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">JavaScript</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">TypeScript</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">HTML/CSS</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Tailwind CSS</span>
              </div>
            </div>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Mobile Development</h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">React Native</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Cross-Platform</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">iOS</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Android</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Mobile UI/UX</span>
              </div>
            </div>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Marketing & SEO</h3>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Search Engine Optimization</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Local SEO</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Content Strategy</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Google Analytics</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Digital Marketing</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Performance Optimization</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Work Together?</h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">Let's discuss your project and explore how I can help bring your ideas to life.</p>
        <Link to="/book" className="inline-block bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg">
          Schedule a Free Consultation
        </Link>
      </section>
    </div>
  )
}

function ProjectCard({ title, description, technologies, demoLink, repoLink }: {
  title: string;
  description: string;
  technologies: string[];
  demoLink: string;
  repoLink: string;
}) {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <a href={demoLink} className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Live Demo
          </a>
          <a href={repoLink} className="text-gray-600 hover:text-gray-800 font-medium text-sm flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Repository
          </a>
        </div>
      </div>
    </div>
  )
}

function SkillCategory({ title, skills }: {
  title: string;
  skills: Array<{ name: string; level: number }>;
}) {
  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.name} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">{skill.name}</span>
              <span className="text-gray-500">{skill.level}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Book() {
  const [selectedDuration, setSelectedDuration] = useState<number>(30)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const durationOptions = [30]

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr,360px] fade-in">
      <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2 mobile-center">Initial Call</h2>
            <p className="text-gray-600 mb-4 mobile-center">30-minute consultation call to discuss your needs.</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Meeting duration options">
            {durationOptions.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDuration(d)}
                className={
                  d === selectedDuration
                    ? 'btn-primary'
                    : 'duration-option'
                }
                aria-pressed={d === selectedDuration}
              >
                Initial Call - {d} min
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold mobile-center">Pick a date and time</h3>
          <CalendarAndSlots
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              duration={selectedDuration}
            />
        </div>
      </div>

      <aside className="card h-fit sticky top-24">
        <h3 className="font-medium mb-2">Booking Summary</h3>
        <p className="text-sm text-gray-600 mb-4">Your info will be collected on the next step.</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{selectedDuration} min</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{selectedDate ? format(selectedDate, 'EEE, MMM d') : 'Not selected'}</span>
          </div>
          {selectedDate && (
            <div className="mt-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
              <p className="text-xs text-primary-700 font-medium">Next: Select a time slot to continue</p>
            </div>
          )}
        </div>
      </aside>
    </section>
  )
}

function SelectableCalendar({ selectedDate, onSelectDate }: { selectedDate: Date | null; onSelectDate: (d: Date) => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const today = new Date()
  
  const days = useMemo(() => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    const daysInMonth = endOfMonth.getDate()
    
    // Generate all days in the current month that are today or later
    const availableDays: Date[] = []
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      if (date >= today || isSameDay(date, today)) {
        availableDays.push(date)
      }
    }
    
    // If we're viewing current month and there are no available days, show next month
    if (availableDays.length === 0 && isSameDay(currentMonth, today)) {
      const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
      setCurrentMonth(nextMonth)
    }
    
    return availableDays
  }, [currentMonth, today])
  
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    // Don't allow going to months before current month
    if (prevMonth.getFullYear() > today.getFullYear() || 
        (prevMonth.getFullYear() === today.getFullYear() && prevMonth.getMonth() >= today.getMonth())) {
      setCurrentMonth(prevMonth)
    }
  }
  
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    setCurrentMonth(nextMonth)
  }
  
  const canGoPrevious = currentMonth.getFullYear() > today.getFullYear() || 
                       (currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() > today.getMonth())
  
  return (
    <div>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPreviousMonth}
          disabled={!canGoPrevious}
          className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2" role="grid" aria-label="Calendar date picker">
        {days.map((d) => {
          const isSelected = selectedDate ? isSameDay(selectedDate, d) : false
          const isToday = isSameDay(d, today)
          const isPast = d < today && !isSameDay(d, today)
          
          return (
            <button
              type="button"
              key={d.toISOString()}
              onClick={() => onSelectDate(d)}
              className={
                'calendar-day ' +
                (isSelected ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700') +
                (isToday ? ' ring-2 ring-primary-200' : '') +
                (isPast ? ' opacity-50' : '')
              }
              aria-pressed={isSelected}
              aria-label={`${format(d, 'EEEE, MMMM d, yyyy')}${isToday ? ' (today)' : ''}${isSelected ? ' (selected)' : ''}`}
              title={format(d, 'EEEE, MMMM d, yyyy')}
            >
              <span className={isToday ? 'font-bold' : ''}>{format(d, 'd')}</span>
            </button>
          )
        })}
      </div>
      
      {days.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No available dates in this month</p>
        </div>
      )}
    </div>
  )
}

function CalendarAndSlots({ duration, selectedDate, onSelectDate }: { duration: number; selectedDate: Date | null; onSelectDate: (d: Date) => void }) {
  const navigate = useNavigate()
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)

  const generateSlots = (date: Date, interval: number) => {
    // Generate slots from 12PM to 6PM EST daily
    const start = setMinutes(setHours(date, 12), 0)
    const end = setMinutes(setHours(date, 18), 0)
    const slots: string[] = []
    let cursor = start
    while (cursor < end) {
      slots.push(format(cursor, 'HH:mm'))
      cursor = addMinutes(cursor, interval)
    }
    return slots
  }

  const slots = selectedDate ? generateSlots(selectedDate, duration) : []
  const dateParam = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null
  const availableSlots = slots.filter(s => dateParam ? !isOverlapping(dateParam, s, duration) : true)

  const handleTimeSlotClick = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot)
  }

  const handleConfirmSelection = () => {
    if (selectedTimeSlot && dateParam) {
      const search = new URLSearchParams({ date: dateParam, time: selectedTimeSlot, duration: String(duration) }).toString()
      navigate(`/confirm?${search}`)
    }
  }

  const handleCancelSelection = () => {
    setSelectedTimeSlot(null)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr,280px]">
      <div className="card">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mobile-center">Select a date</p>
        </div>
        <SelectableCalendar selectedDate={selectedDate} onSelectDate={onSelectDate} />
      </div>
      <div className="card">
        <div className="mb-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm font-medium text-gray-900 mobile-center">Available times</p>
          {selectedDate && (
            <span className="text-xs text-gray-500">
              {availableSlots.length} of {slots.length} available
            </span>
          )}
        </div>
        {!selectedDate ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">Choose a date to see available times</p>
          </div>
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No time slots available for this date</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="max-w-md w-full bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto">
                {slots.map((s) => {
                  const disabled = dateParam ? isOverlapping(dateParam, s, duration) : false
                  const isSelected = selectedTimeSlot === s
                  return (
                    <div key={s} className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => handleTimeSlotClick(s)}
                        disabled={disabled}
                        className={`time-slot text-center w-full ${disabled ? 'time-slot:disabled' : ''} ${isSelected ? 'border-primary-600 bg-primary-50 text-primary-700' : ''}`}
                        aria-disabled={disabled}
                        aria-pressed={isSelected}
                        aria-label={`Select appointment at ${s}${disabled ? ' (unavailable)' : ''}${isSelected ? ' (selected)' : ''}`}
                      >
                        <div className="flex items-center justify-center">
                          <span className="font-medium">{s}</span>
                          {disabled && (
                            <span className="text-xs text-gray-400 ml-1">Booked</span>
                          )}
                        </div>
                      </button>
                      {isSelected && (
                        <div className="mt-2 flex gap-1">
                          <button
                            type="button"
                            onClick={handleConfirmSelection}
                            className="w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center justify-center transition-colors duration-200"
                            aria-label="Confirm time slot selection"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelSelection}
                            className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center transition-colors duration-200"
                            aria-label="Cancel time slot selection"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Confirm() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const date = params.get('date')
  const time = params.get('time')
  const duration = params.get('duration')

  const friendly = date && time ? format(new Date(`${date}T${time}`), "EEE, MMM d 'at' HH:mm") : null

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))

    if (!date || !time || !duration) {
      setError('Missing booking details. Please go back and select a date and time.')
      setIsSubmitting(false)
      return
    }
    if (!name.trim()) {
      setError('Please enter your name.')
      setIsSubmitting(false)
      return
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      setIsSubmitting(false)
      return
    }

    const dur = Number(duration)
    if (isNaN(dur) || dur <= 0) {
      setError('Invalid duration.')
      setIsSubmitting(false)
      return
    }

    // Prevent double booking
    if (isOverlapping(date, time, dur)) {
      setError('Sorry, that time has just been booked. Please choose another slot.')
      setIsSubmitting(false)
      return
    }

    // Save booking
    addBooking({ name, email, notes, date, time, duration: dur })
    setSuccess('Your booking is confirmed! Redirecting to success page...')
    setIsSubmitting(false)

    // Redirect to success page after a short delay
    setTimeout(() => {
      const search = new URLSearchParams({ date: date!, time: time!, duration: String(dur), name, email }).toString()
      navigate(`/success?${search}`)
    }, 1500)
  }

  return (
    <section className="max-w-2xl mx-auto fade-in">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Confirm your booking</h2>
        <p className="text-gray-600">Please provide your details to complete the booking.</p>
      </div>
      
      {/* Booking Summary Card */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-3 text-gray-900">Booking Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Date & Time</span>
            <p className="font-medium">{friendly ?? 'Not selected'}</p>
          </div>
          <div>
            <span className="text-gray-500">Duration</span>
            <p className="font-medium">{duration ? `${duration} minutes` : 'Not selected'}</p>
          </div>
          <div>
            <span className="text-gray-500">Status</span>
            <p className="font-medium text-green-600">Available</p>
          </div>
        </div>
      </div>

      <form className="card space-y-6" onSubmit={handleSubmit}>
        {error && <div className="alert alert-error fade-in">{error}</div>}
        {success && <div className="alert alert-success fade-in">{success}</div>}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="name">
              Name <span className="text-red-500">*</span>
            </label>
            <input 
              id="name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="input-field" 
              placeholder="Enter your full name"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <input 
              id="email" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="input-field" 
              placeholder="your.email@example.com"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="notes">
            Additional Notes
          </label>
          <textarea 
            id="notes" 
            value={notes} 
            onChange={e => setNotes(e.target.value)} 
            className="input-field" 
            rows={4} 
            placeholder="Any additional information or special requests..."
            disabled={isSubmitting}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
          <button 
            type="button" 
            onClick={() => navigate('/book')} 
            className="btn-secondary w-full sm:w-auto order-2 sm:order-1"
            disabled={isSubmitting}
          >
            ← Back to Booking
          </button>
          <button 
            type="submit" 
            className="btn-primary w-full sm:w-auto order-1 sm:order-2" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner mr-2"></span>
                Confirming...
              </>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </div>
      </form>
    </section>
  )
}

function BookingSuccess() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const date = params.get('date')
  const time = params.get('time')
  const duration = params.get('duration')
  const name = params.get('name')
  const email = params.get('email')

  const friendly = date && time ? format(new Date(`${date}T${time}`), "EEE, MMM d 'at' HH:mm") : null

  return (
    <section className="max-w-2xl mx-auto text-center py-12 fade-in">
      <div className="mb-8">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Your Initial Call has been successfully scheduled.
        </p>
      </div>

      {/* Booking Details Card */}
      <div className="card mb-8 text-left">
        <h2 className="text-xl font-semibold mb-4 text-center">Booking Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Meeting Type:</span>
            <span className="font-medium">Initial Call</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium">{friendly ?? 'Not available'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{duration ? `${duration} minutes` : 'Not available'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{name ?? 'Not available'}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{email ?? 'Not available'}</span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
        <p className="text-blue-800 text-sm">
          You'll receive a confirmation email shortly with meeting details and a calendar invite.
          If you need to reschedule or cancel, please contact us at least 24 hours in advance.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate('/')}
          className="btn-primary px-8"
        >
          Return to Home
        </button>
        <button
          onClick={() => navigate('/book')}
          className="btn-secondary px-8"
        >
          Book Another Meeting
        </button>
      </div>
    </section>
  )
}

function NotFound() {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <p className="text-gray-600">The page you are looking for does not exist.</p>
      <div className="mt-4">
        <Link to="/" className="btn-primary">Go home</Link>
      </div>
    </div>
  )
}

export default App
