'use client'

import { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon, PhoneIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'
import { StarIcon, HeartIcon, UserGroupIcon, FireIcon } from '@heroicons/react/24/solid'
import { useReservation } from '../src/hooks/useReservation'
import { useMenu } from '../src/hooks/useMenu'
import { useContact } from '../src/hooks/useContact'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  // API hooks
  const reservationHook = useReservation()
  const menuHook = useMenu()
  const contactHook = useContact()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Load menu data when component mounts
  useEffect(() => {
    if (menuHook.categories.length === 0) {
      menuHook.getMenuByCategory('Breakfast')
    }
  }, [menuHook.categories.length])

  const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Menu', href: '#menu' },
    { name: 'Reservations', href: '#reservations' },
    { name: 'Contact', href: '#contact' },
  ]



  const features = [
    {
      icon: StarIcon,
      title: 'Artisan Coffee',
      description: 'Hand-crafted coffee using premium single-origin beans'
    },
    {
      icon: HeartIcon,
      title: 'Fresh Pastries',
      description: 'Daily baked goods made with love and quality ingredients'
    },
    {
      icon: FireIcon,
      title: 'Warm Atmosphere',
      description: 'Cozy and inviting space perfect for any occasion'
    },
    {
      icon: UserGroupIcon,
      title: 'Community Hub',
      description: 'A place where friends gather and memories are made'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">Sundate Matcha</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-secondary-700 hover:text-primary-600 transition-colors duration-200 font-medium"
                >
                  {item.name}
                </a>
              ))}
              <button className="btn-primary">Reserve Table</button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-secondary-700 hover:text-primary-600"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-secondary-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 rounded-md transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <button className="w-full mt-4 btn-primary">Reserve Table</button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Welcome to{' '}
            <span className="text-gradient">Sundate Matcha</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up">
            Where every moment is special. Experience the perfect blend of comfort, 
            quality, and ambiance in the heart of the city.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <button className="btn-primary text-lg px-8 py-4">
              Explore Our Menu
            </button>
            <button className="btn-secondary text-lg px-8 py-4">
              Book a Table
            </button>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-200/20 to-secondary-200/20"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-800 mb-4">
              Why Choose Sundate Matcha?
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              We&apos;re committed to providing an exceptional dining experience that goes beyond just great food.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors duration-200">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-secondary-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-secondary-800 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-secondary-600 mb-6">
                Founded in 2020, Sundate Matcha began as a dream to create a space where 
                people could gather, connect, and enjoy exceptional food in a warm, 
                welcoming atmosphere.
              </p>
              <p className="text-lg text-secondary-600 mb-6">
                Our passion for quality ingredients, artisanal coffee, and creating 
                memorable experiences has made us a beloved destination for locals and 
                visitors alike.
              </p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">4+</div>
                  <div className="text-secondary-600">Years of Excellence</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">10k+</div>
                  <div className="text-secondary-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">50+</div>
                  <div className="text-secondary-600">Menu Items</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-lg mb-6">
                  To create a welcoming space where every guest feels like family, 
                  every meal is memorable, and every moment is special.
                </p>
                <div className="flex items-center space-x-2">
                  <StarIcon className="w-5 h-5 text-yellow-300" />
                  <StarIcon className="w-5 h-5 text-yellow-300" />
                  <StarIcon className="w-5 h-5 text-yellow-300" />
                  <StarIcon className="w-5 h-5 text-yellow-300" />
                  <StarIcon className="w-5 h-5 text-yellow-300" />
                  <span className="ml-2 text-sm">Rated 5.0 by our customers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-800 mb-4">
              Our Menu
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Discover our carefully crafted menu featuring fresh, seasonal ingredients 
              and innovative culinary creations.
            </p>
          </div>
          
          {menuHook.loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-secondary-600">Loading menu...</p>
            </div>
          )}
          
          {menuHook.error && (
            <div className="text-center py-12">
              <p className="text-red-600">Error loading menu: {menuHook.error}</p>
              <button 
                onClick={() => menuHook.resetMenu()}
                className="mt-4 btn-primary"
              >
                Try Again
              </button>
            </div>
          )}
          
          {!menuHook.loading && !menuHook.error && (
            <div className="space-y-12">
              {menuHook.categories.map((category) => (
                <div key={category}>
                  <h3 className="text-3xl font-bold text-secondary-800 mb-8 text-center">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuHook.menuItems
                      .filter(item => item.category === category)
                      .map((item) => (
                        <div key={item._id} className="card group hover:scale-105 transition-transform duration-200">
                          <div className="text-4xl mb-4">{item.emoji}</div>
                          <h4 className="text-xl font-semibold text-secondary-800 mb-2">
                            {item.name}
                          </h4>
                          <p className="text-secondary-600 mb-4">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-primary-600">
                              ${item.price.toFixed(2)}
                            </span>
                            <button className="text-primary-600 hover:text-primary-700 font-medium">
                              Order Now &rarr;
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reservations Section */}
      <section id="reservations" className="section-padding bg-primary-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-800 mb-4">
              Reserve Your Table
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Book your perfect table and enjoy an unforgettable dining experience 
              at Sundate Matcha.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            {reservationHook.success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-800 text-center">
                  <h3 className="font-semibold text-lg mb-2">Reservation Confirmed!</h3>
                  <p className="mb-2">Your table has been reserved successfully.</p>
                  <p className="text-sm">Confirmation Number: {reservationHook.reservation?._id.toString().slice(-8).toUpperCase()}</p>
                  <button
                    onClick={reservationHook.reset}
                    className="mt-3 text-green-600 hover:text-green-800 underline"
                  >
                    Make Another Reservation
                  </button>
                </div>
              </div>
            )}
            
            {reservationHook.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-800 text-center">
                  <p className="font-semibold">Error: {reservationHook.error}</p>
                  <button
                    onClick={reservationHook.reset}
                    className="mt-2 text-red-600 hover:text-red-800 underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
            
            {!reservationHook.success && (
              <form 
                className="space-y-6" 
                onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const data = {
                    name: formData.get('name') as string,
                    email: formData.get('email') as string,
                    phone: formData.get('phone') as string,
                    date: formData.get('date') as string,
                    time: formData.get('time') as string,
                    guests: parseInt(formData.get('guests') as string),
                    specialRequests: formData.get('specialRequests') as string,
                  }
                  await reservationHook.createReservation(data)
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Guests
                    </label>
                    <select name="guests" required className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="">Select number of guests</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6+</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Date
                    </label>
                    <input
                      name="date"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Time
                    </label>
                    <select name="time" required className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="">Select time</option>
                      <option value="6:00 PM">6:00 PM</option>
                      <option value="6:30 PM">6:30 PM</option>
                      <option value="7:00 PM">7:00 PM</option>
                      <option value="7:30 PM">7:30 PM</option>
                      <option value="8:00 PM">8:00 PM</option>
                      <option value="8:30 PM">8:30 PM</option>
                      <option value="9:00 PM">9:00 PM</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    name="specialRequests"
                    rows={4}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Any special requests or dietary requirements..."
                  />
                </div>
                
                <div className="text-center">
                  <button 
                    type="submit" 
                    disabled={reservationHook.loading}
                    className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {reservationHook.loading ? 'Reserving...' : 'Reserve Table'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-secondary-800 text-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-secondary-200 max-w-2xl mx-auto">
              We&apos;d love to hear from you. Visit us, call us, or send us a message.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <MapPinIcon className="w-12 h-12 text-primary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-secondary-200">
                123 Coffee Street<br />
                Downtown District<br />
                City, State 12345
              </p>
            </div>
            
            <div className="text-center">
              <PhoneIcon className="w-12 h-12 text-primary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-secondary-200">
                (555) 123-4567<br />
                reservations@sundatecafe.com
              </p>
            </div>
            
            <div className="text-center">
              <ClockIcon className="w-12 h-12 text-primary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hours</h3>
              <p className="text-secondary-200">
                Mon-Fri: 7AM - 10PM<br />
                Sat-Sun: 8AM - 11PM
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-6 py-3">
              <FireIcon className="w-5 h-5 text-primary-400" />
              <span className="text-secondary-200">
                Follow us on social media for daily specials and updates!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-primary-400 mb-4">Sundate Matcha</h3>
              <p className="text-secondary-300">
                Where every moment is special. Experience the perfect blend of comfort, 
                quality, and ambiance.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-secondary-300 hover:text-primary-400 transition-colors">Home</a></li>
                <li><a href="#about" className="text-secondary-300 hover:text-primary-400 transition-colors">About</a></li>
                <li><a href="#menu" className="text-secondary-300 hover:text-primary-400 transition-colors">Menu</a></li>
                <li><a href="#reservations" className="text-secondary-300 hover:text-primary-400 transition-colors">Reservations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li className="text-secondary-300">Dine-in</li>
                <li className="text-secondary-300">Takeout</li>
                <li className="text-secondary-300">Private Events</li>
                <li className="text-secondary-300">Catering</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-secondary-300 mb-4">
                Subscribe to get updates on special events and menu changes.
              </p>
              {contactHook.success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">Thank you for subscribing!</p>
                </div>
              )}
              {contactHook.error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">Error: {contactHook.error}</p>
                </div>
              )}
              <form 
                onSubmit={async (e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const email = formData.get('email') as string
                  if (email) {
                    await contactHook.submitContact({
                      name: 'Newsletter Subscriber',
                      email,
                      subject: 'Newsletter Subscription',
                      message: 'Please subscribe me to the newsletter',
                      isNewsletterSignup: true,
                      source: 'Website'
                    })
                    e.currentTarget.reset()
                  }
                }}
                className="flex"
              >
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-l-lg text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button 
                  type="submit"
                  disabled={contactHook.loading}
                  className="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-r-lg transition-colors disabled:opacity-50"
                >
                  {contactHook.loading ? '...' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-secondary-700 mt-8 pt-8 text-center">
            <p className="text-secondary-400">
              © 2024 Sundate Matcha. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
